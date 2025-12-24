'use client'

import { useEffect, useRef, useState } from 'react'

interface ChunkedVideoLoaderProps {
  baseUrl: string
  manifestUrl: string
  onVideoReady?: (videoUrl: string) => void
  onProgress?: (progress: number) => void
  onError?: (error: string) => void
  className?: string
  style?: React.CSSProperties
}

interface VideoManifest {
  originalFile: string
  totalSize: number
  chunkSize: number
  numChunks: number
  chunks: Array<{
    index: number
    filename: string
    size: number
  }>
}

export default function ChunkedVideoLoader({
  baseUrl,
  manifestUrl,
  onVideoReady,
  onProgress,
  onError,
  className = '',
  style = {}
}: ChunkedVideoLoaderProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const loadChunkedVideo = async () => {
    setLoading(true)
    setProgress(0)
    setError(null)
    
    // Create new abort controller for this load operation
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      // Load manifest
      console.log('📋 Loading manifest from:', manifestUrl)
      const manifestResponse = await fetch(manifestUrl, { signal })
      
      if (!manifestResponse.ok) {
        throw new Error(`Failed to load manifest: ${manifestResponse.status}`)
      }
      
      const manifest: VideoManifest = await manifestResponse.json()
      console.log(`📦 Loaded manifest: ${manifest.numChunks} chunks, ${(manifest.totalSize / (1024 * 1024)).toFixed(2)} MB total`)

      // Load all chunks
      const chunks: Uint8Array[] = []
      
      for (let i = 0; i < manifest.numChunks; i++) {
        if (signal.aborted) {
          throw new Error('Load operation was cancelled')
        }

        const chunk = manifest.chunks[i]
        const chunkUrl = `${baseUrl}/${chunk.filename}`
        
        console.log(`📤 Loading chunk ${i + 1}/${manifest.numChunks}: ${chunk.filename}`)
        
        const chunkResponse = await fetch(chunkUrl, { signal })
        
        if (!chunkResponse.ok) {
          throw new Error(`Failed to load chunk ${i}: ${chunkResponse.status}`)
        }
        
        const chunkData = await chunkResponse.arrayBuffer()
        chunks.push(new Uint8Array(chunkData))
        
        // Update progress
        const currentProgress = ((i + 1) / manifest.numChunks) * 100
        setProgress(currentProgress)
        onProgress?.(currentProgress)
      }

      if (signal.aborted) {
        throw new Error('Load operation was cancelled')
      }

      // Combine all chunks
      console.log('🔧 Combining chunks...')
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
      const combined = new Uint8Array(totalLength)
      let offset = 0
      
      for (const chunk of chunks) {
        combined.set(chunk, offset)
        offset += chunk.length
      }
      
      // Create blob and object URL
      const videoBlob = new Blob([combined], { type: 'video/webm' })
      const objectUrl = URL.createObjectURL(videoBlob)
      
      console.log(`✅ Video loaded successfully: ${(totalLength / (1024 * 1024)).toFixed(2)} MB`)
      
      setVideoUrl(objectUrl)
      setProgress(100)
      onVideoReady?.(objectUrl)
      
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message.includes('cancelled')) {
        console.log('📝 Video loading was cancelled')
        return
      }
      
      const errorMessage = err.message || 'Failed to load chunked video'
      console.error('❌ Error loading chunked video:', errorMessage)
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const cancelLoad = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setLoading(false)
    setProgress(0)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelLoad()
      // Cleanup object URL to prevent memory leaks
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  if (error) {
    return (
      <div className={`chunked-video-error ${className}`} style={style}>
        <div className="error-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          background: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '8px',
          color: '#ff6b6b'
        }}>
          <p style={{ marginBottom: '1rem', fontWeight: 'bold' }}>
            ❌ Failed to load video
          </p>
          <p style={{ marginBottom: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
            {error}
          </p>
          <button
            onClick={loadChunkedVideo}
            style={{
              padding: '0.5rem 1rem',
              background: '#ff6b6b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`chunked-video-loading ${className}`} style={style}>
        <div className="loading-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          {/* Loading spinner */}
          <div className="loading-spinner" style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderTop: '3px solid #FFFF77',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '1rem'
          }} />
          
          {/* Progress bar */}
          <div style={{
            width: '100%',
            maxWidth: '300px',
            height: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #FFFF77, #E5E500)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '1rem'
          }}>
            Loading high-quality video... {progress.toFixed(1)}%
          </p>
          
          <button
            onClick={cancelLoad}
            style={{
              padding: '0.25rem 0.75rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (!videoUrl) {
    return (
      <div className={`chunked-video-prompt ${className}`} style={style}>
        <div className="prompt-content" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '1rem', 
            color: 'rgba(255, 255, 255, 0.9)' 
          }}>
            🎬 High-Quality Drone Video Available
          </p>
          <p style={{ 
            margin: '0 0 1.5rem 0', 
            fontSize: '0.85rem', 
            color: 'rgba(255, 255, 255, 0.7)' 
          }}>
            This video loads in high quality from our global CDN
          </p>
          <button
            onClick={loadChunkedVideo}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #FFFF77, #E5E500)',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Load Video
          </button>
        </div>
      </div>
    )
  }

  // If we have a video URL, let the parent component handle displaying it
  return null
}
'use client'

import { useEffect, useRef, useState } from 'react'

interface ChunkedVideoProps {
  videoId: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
}

export function ChunkedVideo({ 
  videoId, 
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true
}: ChunkedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaSourceRef = useRef<MediaSource | null>(null)
  const sourceBufferRef = useRef<SourceBuffer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoRef.current || !window.MediaSource) {
      setError('MediaSource API not supported')
      return
    }

    const video = videoRef.current
    const mediaSource = new MediaSource()
    mediaSourceRef.current = mediaSource

    video.src = URL.createObjectURL(mediaSource)

    const loadChunks = async () => {
      try {
        // Fetch manifest
        const manifestUrl = `https://content.silvergrail.com/ramvideos/videos/${videoId}/manifest.json`
        const manifestResponse = await fetch(manifestUrl)
        
        if (!manifestResponse.ok) {
          throw new Error('Failed to load video manifest')
        }
        
        const manifest = await manifestResponse.json()
        
        // Wait for MediaSource to be ready
        await new Promise((resolve) => {
          if (mediaSource.readyState === 'open') {
            resolve(undefined)
          } else {
            mediaSource.addEventListener('sourceopen', () => resolve(undefined), { once: true })
          }
        })

        // Create SourceBuffer
        const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8, vorbis"')
        sourceBufferRef.current = sourceBuffer

        // Load chunks sequentially
        for (const chunk of manifest.chunks) {
          const chunkUrl = `https://content.silvergrail.com/ramvideos/videos/${videoId}/${chunk.filename}`
          console.log(`Loading chunk: ${chunk.filename}`)
          
          const response = await fetch(chunkUrl)
          if (!response.ok) {
            console.warn(`Failed to load chunk: ${chunk.filename}`)
            continue
          }
          
          const data = await response.arrayBuffer()
          
          // Wait for sourceBuffer to be ready
          await new Promise((resolve) => {
            if (!sourceBuffer.updating) {
              resolve(undefined)
            } else {
              sourceBuffer.addEventListener('updateend', () => resolve(undefined), { once: true })
            }
          })
          
          sourceBuffer.appendBuffer(data)
        }

        // Wait for final update to complete
        await new Promise((resolve) => {
          if (!sourceBuffer.updating) {
            resolve(undefined)
          } else {
            sourceBuffer.addEventListener('updateend', () => resolve(undefined), { once: true })
          }
        })

        // Signal end of stream
        if (mediaSource.readyState === 'open') {
          mediaSource.endOfStream()
        }

        setIsLoading(false)
      } catch (err) {
        console.error('Error loading video chunks:', err)
        setError(err instanceof Error ? err.message : 'Failed to load video')
        setIsLoading(false)
      }
    }

    loadChunks()

    return () => {
      if (mediaSourceRef.current) {
        try {
          if (mediaSourceRef.current.readyState === 'open') {
            mediaSourceRef.current.endOfStream()
          }
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      if (video.src.startsWith('blob:')) {
        URL.revokeObjectURL(video.src)
      }
    }
  }, [videoId])

  if (error) {
    // Fallback to simple video element if chunked loading fails
    return (
      <video
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls
      >
        <source 
          src={`/api/stream-video?id=${videoId}`} 
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>
    )
  }

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      <video
        ref={videoRef}
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </>
  )
}
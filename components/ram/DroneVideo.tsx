'use client'

import { useState, useEffect } from 'react'

interface DroneVideoProps {
  videoNumber: number
}

export function DroneVideo({ videoNumber }: DroneVideoProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // For video 1 (chunked), we use our API
  // For video 2, we use direct URL
  const videoSrc = videoNumber === 1 
    ? '/api/stream-video?id=ramdrone1'
    : 'https://content.silvergrail.com/videos/ramdrone2.webm'

  const handleLoadStart = () => {
    setIsLoading(true)
    setError(null)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Failed to load video. The file may be too large for streaming.')
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-white text-sm">Loading video...</p>
            <p className="text-white/60 text-xs mt-2">This may take a moment for large files</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
          <div className="text-center max-w-sm px-4">
            <p className="text-red-400 mb-4">{error}</p>
            <a 
              href={videoSrc}
              download
              className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
            >
              Download Video Instead
            </a>
          </div>
        </div>
      )}

      <video
        className="w-full h-full object-cover"
        controls
        muted
        playsInline
        preload="metadata"
        poster="/images/ram-drone-flyover.jpg"
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      >
        <source src={videoSrc} type="video/webm" />
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
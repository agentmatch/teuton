'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import MuxPlayer to avoid SSR issues
const MuxPlayer = dynamic(
  () => import('@mux/mux-player-react'),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white text-sm">Loading video player...</p>
        </div>
      </div>
    )
  }
)

interface MuxDroneVideoProps {
  playbackId: string
  title: string
  className?: string
  style?: React.CSSProperties
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  playbackRate?: number
}

export function MuxDroneVideo({ 
  playbackId, 
  title, 
  className = '', 
  style,
  autoPlay = true,
  muted = true,
  loop = true,
  playbackRate = 1.0
}: MuxDroneVideoProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-white text-sm">Loading video...</div>
      </div>
    )
  }

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`} style={style}>
      <MuxPlayer
        playbackId={playbackId}
        metadata={{
          video_title: title,
          video_id: playbackId,
        }}
        streamType="on-demand"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playbackRate={playbackRate}
        primaryColor="#FFFFFF"
        secondaryColor="#000000"
        maxResolution="2160p"
        minResolution="1080p"
        preferPlayback="mse"
        disablePictureInPicture={true}
        nohotkeys={true}
        style={{ 
          width: '100%', 
          height: '100%',
          '--media-object-fit': 'cover',
          '--media-object-position': 'center',
          '--controls': 'flex',
          '--center-controls': 'none',
          '--top-controls': 'none',
          '--bottom-play-button': 'none',
          '--bottom-live-button': 'none',
          '--bottom-seek-backward-button': 'none',
          '--bottom-seek-forward-button': 'none',
          '--bottom-mute-button': 'none',
          '--bottom-volume-range': 'none',
          '--bottom-time-range': 'none',
          '--bottom-time-display': 'none',
          '--bottom-duration-display': 'none',
          '--bottom-pip-button': 'none',
          '--bottom-captions-button': 'none',
          '--bottom-airplay-button': 'none',
          '--bottom-cast-button': 'none',
          '--bottom-playback-rate-button': 'none',
          '--bottom-fullscreen-button': 'flex',
        } as React.CSSProperties}
      />
    </div>
  )
}
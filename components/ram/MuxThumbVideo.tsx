'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import MuxPlayer to avoid SSR issues
const MuxPlayer = dynamic(
  () => import('@mux/mux-player-react'),
  {
    ssr: false,
    loading: () => null // Silent loading for thumbnail
  }
)

interface MuxThumbVideoProps {
  playbackId: string
  width: string | number
  height: string | number
  style?: React.CSSProperties
}

export function MuxThumbVideo({ playbackId, width, height, style = {} }: MuxThumbVideoProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div style={{
        width,
        height,
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.8) 100%)',
        ...style
      }} />
    )
  }

  return (
    <div style={{
      width,
      height,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'black',
      ...style
    }}>
      <MuxPlayer
        playbackId={playbackId}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture={true}
        nohotkeys={true}
        streamType="on-demand"
        primaryColor="#FFFFFF"
        secondaryColor="#000000"
        style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '140%',
          height: '140%',
          minWidth: '140%',
          minHeight: '140%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          filter: 'brightness(0.7) contrast(1.1)',
          '--controls': 'none',
          '--bottom-controls': 'none',
          '--center-controls': 'none',
          '--top-controls': 'none',
        } as React.CSSProperties}
      />
    </div>
  )
}
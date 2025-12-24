'use client'

import { useEffect, useState } from 'react'

export default function MobileNavDebug() {
  const [debugInfo, setDebugInfo] = useState({
    isMounted: false,
    innerWidth: 0,
    innerHeight: 0,
    userAgent: '',
    touchPoints: 0,
    orientation: '',
    pixelRatio: 1
  })
  
  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        isMounted: true,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        userAgent: navigator.userAgent,
        touchPoints: navigator.maxTouchPoints,
        orientation: screen.orientation?.type || 'unknown',
        pixelRatio: window.devicePixelRatio
      })
    }
    
    updateDebugInfo()
    window.addEventListener('resize', updateDebugInfo)
    window.addEventListener('orientationchange', updateDebugInfo)
    
    return () => {
      window.removeEventListener('resize', updateDebugInfo)
      window.removeEventListener('orientationchange', updateDebugInfo)
    }
  }, [])
  
  // Only show on mobile in development
  if (process.env.NODE_ENV === 'production') return null
  if (!debugInfo.isMounted) return null
  if (debugInfo.innerWidth >= 768) return null
  
  return (
    <div 
      className="fixed top-20 left-2 z-[100006] bg-black/80 text-white text-xs p-2 rounded"
      style={{ 
        backdropFilter: 'blur(10px)',
        maxWidth: '200px',
        fontSize: '10px',
        lineHeight: '1.4'
      }}
    >
      <div>Width: {debugInfo.innerWidth}px</div>
      <div>Height: {debugInfo.innerHeight}px</div>
      <div>Touch: {debugInfo.touchPoints}</div>
      <div>DPR: {debugInfo.pixelRatio}</div>
      <div>Orient: {debugInfo.orientation.split('-')[0]}</div>
    </div>
  )
}
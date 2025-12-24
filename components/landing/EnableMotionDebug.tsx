'use client'

import { useEffect, useState } from 'react'

export default function EnableMotionDebug() {
  const [debugInfo, setDebugInfo] = useState({
    hasDeviceOrientation: false,
    hasRequestPermission: false,
    isIOS: false,
    permissionState: 'unknown',
    touchEvents: [] as string[]
  })

  useEffect(() => {
    const info = {
      hasDeviceOrientation: 'DeviceOrientationEvent' in window,
      hasRequestPermission: 'DeviceOrientationEvent' in window && 
        'requestPermission' in (DeviceOrientationEvent as any),
      isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
      permissionState: 'unknown',
      touchEvents: [] as string[]
    }
    
    setDebugInfo(info)
  }, [])

  const testPermission = async () => {
    if ('DeviceOrientationEvent' in window && 'requestPermission' in (DeviceOrientationEvent as any)) {
      try {
        const result = await (DeviceOrientationEvent as any).requestPermission()
        setDebugInfo(prev => ({ ...prev, permissionState: result }))
      } catch (error) {
        setDebugInfo(prev => ({ ...prev, permissionState: 'error: ' + (error as Error).message }))
      }
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 999999,
      minWidth: '300px'
    }}>
      <h3>Enable Motion Debug</h3>
      <ul style={{ textAlign: 'left', fontSize: '14px' }}>
        <li>Has DeviceOrientation: {debugInfo.hasDeviceOrientation ? '✓' : '✗'}</li>
        <li>Has requestPermission: {debugInfo.hasRequestPermission ? '✓' : '✗'}</li>
        <li>Is iOS: {debugInfo.isIOS ? '✓' : '✗'}</li>
        <li>Permission State: {debugInfo.permissionState}</li>
        <li>Touch Events: {debugInfo.touchEvents.join(', ') || 'none'}</li>
      </ul>
      
      <button
        onClick={testPermission}
        onTouchStart={(e) => {
          e.preventDefault()
          setDebugInfo(prev => ({ 
            ...prev, 
            touchEvents: [...prev.touchEvents, 'touchstart'] 
          }))
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          setDebugInfo(prev => ({ 
            ...prev, 
            touchEvents: [...prev.touchEvents, 'touchend'] 
          }))
          testPermission()
        }}
        style={{
          background: '#FFFF77',
          color: '#111',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '10px',
          width: '100%',
          minHeight: '48px',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none'
        }}
      >
        Test Permission Request
      </button>
    </div>
  )
}
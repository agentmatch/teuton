'use client'

import { useEffect, useState } from 'react'

interface BottomMobileNavProps {
  currentView?: 'overview' | 'properties' | 'info' | 'ram'
  onOverviewClick: () => void
  onPropertiesClick: () => void
  onInfoClick: () => void
  onRamClick: () => void
}

export default function BottomMobileNav({ 
  currentView = 'overview',
  onOverviewClick,
  onPropertiesClick,
  onInfoClick,
  onRamClick
}: BottomMobileNavProps) {
  const [show, setShow] = useState(false)
  const [bottomOffset, setBottomOffset] = useState(0)

  useEffect(() => {
    // Only show on mobile
    const checkMobile = () => {
      setShow(window.innerWidth < 768)
    }
    
    // Handle visual viewport changes (Android browser UI)
    const handleViewport = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop
        setBottomOffset(Math.max(0, offset))
      }
    }
    
    checkMobile()
    handleViewport()
    
    window.addEventListener('resize', checkMobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewport)
      window.visualViewport.addEventListener('scroll', handleViewport)
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewport)
        window.visualViewport.removeEventListener('scroll', handleViewport)
      }
    }
  }, [])

  if (!show) return null

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: bottomOffset,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.3) 0%, rgba(2, 27, 71, 0.2) 50%, rgba(2, 27, 71, 0.1) 100%)',
        backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
        zIndex: 100005,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transition: 'bottom 0.3s ease',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '64px',
        padding: '0 16px',
      }}>
        <button
          onClick={onOverviewClick}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'overview' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            padding: '8px',
            minWidth: '64px',
            textAlign: 'center',
            fontFamily: "'Switzer Variable', sans-serif",
            cursor: 'pointer',
          }}
        >
          Overview
        </button>
        
        <button
          onClick={onPropertiesClick}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'properties' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            padding: '8px',
            minWidth: '64px',
            textAlign: 'center',
            fontFamily: "'Switzer Variable', sans-serif",
            cursor: 'pointer',
          }}
        >
          Properties
        </button>
        
        <button
          onClick={onInfoClick}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'info' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            padding: '8px',
            minWidth: '64px',
            textAlign: 'center',
            fontFamily: "'Switzer Variable', sans-serif",
            cursor: 'pointer',
          }}
        >
          Red Line
        </button>
        
        <button
          onClick={onRamClick}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'ram' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            padding: '8px',
            minWidth: '64px',
            textAlign: 'center',
            fontFamily: "'Switzer Variable', sans-serif",
            cursor: 'pointer',
          }}
        >
          RAM
        </button>
      </div>
    </div>
  )
}
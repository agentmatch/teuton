'use client'

import { useEffect, useState } from 'react'

interface AlwaysVisibleMobileNavProps {
  onOverviewClick: () => void
  onPropertiesClick: () => void
  onInfoClick: () => void
  currentView?: 'overview' | 'properties' | 'info'
}

export default function AlwaysVisibleMobileNav({ 
  onOverviewClick, 
  onPropertiesClick, 
  onInfoClick,
  currentView = 'overview'
}: AlwaysVisibleMobileNavProps) {
  // Start with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Initial check
    checkMobile()
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // During SSR and initial hydration, render a placeholder to avoid mismatch
  if (isMobile === null) {
    return (
      <div 
        className="fixed bottom-0 left-0 right-0 z-[100005]"
        style={{
          height: '64px',
          visibility: 'hidden',
          pointerEvents: 'none'
        }}
      />
    )
  }
  
  // After hydration, show/hide based on actual viewport
  if (!isMobile) return null
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100005]"
      style={{
        background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.3) 0%, rgba(2, 27, 71, 0.2) 50%, rgba(2, 27, 71, 0.1) 100%)',
        backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'block !important',
        visibility: 'visible' as const,
        opacity: 1,
        pointerEvents: 'auto' as const
      }}
    >
      <nav className="flex justify-around items-center h-16 px-4">
        <button
          onClick={onOverviewClick}
          className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-2"
          style={{
            color: currentView === 'overview' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
          }}
        >
          <span className="text-[10px] font-medium uppercase">Overview</span>
        </button>
        
        <button
          onClick={onPropertiesClick}
          className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-2"
          style={{
            color: currentView === 'properties' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
          }}
        >
          <span className="text-[10px] font-medium uppercase">Properties</span>
        </button>
        
        <button
          onClick={onInfoClick}
          className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-2"
          style={{
            color: currentView === 'info' ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
          }}
        >
          <span className="text-[10px] font-medium uppercase">Red Line</span>
        </button>
      </nav>
    </div>
  )
}
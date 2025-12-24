'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

interface SimpleMobileNavProps {
  onOverviewClick: () => void
  onPropertiesClick: () => void
  onInfoClick: () => void
  currentView?: 'overview' | 'properties' | 'info'
}

// Internal component that only renders on client
function MobileNavContent({ 
  onOverviewClick, 
  onPropertiesClick, 
  onInfoClick,
  currentView = 'overview'
}: SimpleMobileNavProps) {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Only render after mount to avoid any SSR issues
  if (!isMounted) return null
  
  // Check if mobile
  if (typeof window !== 'undefined' && window.innerWidth >= 768) return null
  
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100005]"
      style={{
        background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.3) 0%, rgba(2, 27, 71, 0.2) 50%, rgba(2, 27, 71, 0.1) 100%)',
        backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        pointerEvents: 'auto'
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

// Export as dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(MobileNavContent), {
  ssr: false
})
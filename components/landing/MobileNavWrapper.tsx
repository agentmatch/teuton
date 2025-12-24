'use client'

import { useEffect, useState } from 'react'
import MobileNav from './MobileNav'
import { applySafariFixes } from '@/utils/safari-fixes'

interface MobileNavWrapperProps {
  currentView: 'overview' | 'properties' | 'info'
  onOverviewClick: () => void
  onPropertiesClick: () => void
  onInfoClick: () => void
  showMainContent: boolean
}

export default function MobileNavWrapper({ 
  currentView, 
  onOverviewClick, 
  onPropertiesClick, 
  onInfoClick,
  showMainContent 
}: MobileNavWrapperProps) {
  // Start with null to detect SSR
  const [shouldShow, setShouldShow] = useState<boolean | null>(null)

  useEffect(() => {
    // Apply Safari-specific fixes
    applySafariFixes();
    
    const checkIsMobile = () => {
      // Simple check - just viewport width
      const isMobileViewport = window.innerWidth < 768
      
      // Log for debugging
      console.log('MobileNav Debug:', {
        innerWidth: window.innerWidth,
        isMobileViewport,
        showMainContent,
        userAgent: navigator.userAgent,
        touchPoints: navigator.maxTouchPoints,
        result: isMobileViewport && showMainContent
      })
      
      return isMobileViewport && showMainContent
    }
    
    // Initial check
    setShouldShow(checkIsMobile())
    
    // Update on resize
    const handleResize = () => {
      setShouldShow(checkIsMobile())
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showMainContent])

  // During SSR, render placeholder
  if (shouldShow === null) {
    return <div className="fixed bottom-0 left-0 right-0 h-16" style={{ visibility: 'hidden' }} />
  }

  // Force render on mobile viewports
  if (shouldShow) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[100005]" style={{ display: 'block !important' }}>
        <MobileNav
          currentView={currentView}
          onOverviewClick={onOverviewClick}
          onPropertiesClick={onPropertiesClick}
          onInfoClick={onInfoClick}
          onRamClick={() => {}} // Empty function for teaser page
        />
      </div>
    )
  }

  return null
}
'use client'

import { useEffect, useRef, useState } from 'react'

interface HeaderAwareContentProps {
  children: React.ReactNode
  className?: string
  isLightContent?: boolean
}

export function HeaderAwareContent({ 
  children, 
  className = '', 
  isLightContent = false 
}: HeaderAwareContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isUnderHeader, setIsUnderHeader] = useState(false)

  useEffect(() => {
    if (!isLightContent || !contentRef.current) return

    const element = contentRef.current
    
    const checkPosition = () => {
      const rect = element.getBoundingClientRect()
      // Element is under header if its top is within the header area (0-80px from top)
      const underHeader = rect.top <= 80 && rect.bottom > 0
      setIsUnderHeader(underHeader)
    }

    // Check on scroll
    const handleScroll = () => {
      requestAnimationFrame(checkPosition)
    }

    // Initial check
    checkPosition()

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', checkPosition, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', checkPosition)
    }
  }, [isLightContent])

  return (
    <div 
      ref={contentRef}
      className={className}
      style={{
        position: 'relative',
        ...(isLightContent && isUnderHeader ? {
          background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), ${
            getComputedStyle(contentRef.current || document.body).background || 'inherit'
          }`
        } : {})
      }}
    >
      {children}
    </div>
  )
}
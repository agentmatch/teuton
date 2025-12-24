'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface MobileNavProps {
  onOverviewClick: () => void
  onPropertiesClick: () => void
  onInfoClick: () => void
  onRamClick: () => void
  currentView?: 'overview' | 'properties' | 'info' | 'ram'
}

export default function MobileNav({ 
  onOverviewClick, 
  onPropertiesClick, 
  onInfoClick,
  onRamClick,
  currentView = 'overview'
}: MobileNavProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[100005] md:hidden"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        display: 'block !important', // Force display on mobile
        pointerEvents: 'auto', // Ensure clicks work
        opacity: 1,
        visibility: 'visible',
        transform: 'translateZ(0)', // Force hardware acceleration
        WebkitTransform: 'translateZ(0)', // Safari prefix
        position: 'fixed', // Ensure position is set
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        isolation: 'isolate' // Create new stacking context
      }}
    >
      {/* Glow effect underneath */}
      <div 
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(255, 255, 119, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translateY(50%)',
        }}
      />
      
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.3) 0%, rgba(2, 27, 71, 0.2) 50%, rgba(2, 27, 71, 0.1) 100%)',
          backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
          borderTop: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: `
            0 -8px 32px 0 rgba(0, 0, 0, 0.37),
            inset 0 2px 4px 0 rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1),
            0 0 80px rgba(2, 27, 71, 0.3)
          `,
          position: 'relative',
          overflow: 'hidden',
          transform: 'translateZ(0)', // Force hardware acceleration
          WebkitTransform: 'translateZ(0)', // Safari prefix
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 119, 0.3) 50%, transparent 100%)',
          }}
        />
        
        {/* Subtle inner glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255, 255, 119, 0.05) 0%, transparent 70%)',
          }}
        />
        
        <nav className="flex justify-around items-center h-16 px-4 relative">
        <NavButton 
          label="Overview"
          isActive={currentView === 'overview'}
          onClick={onOverviewClick}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          }
        />
        
        <NavButton 
          label="Properties"
          isActive={currentView === 'properties'}
          onClick={onPropertiesClick}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          }
        />
        
        <NavButton 
          label="Red Line"
          isActive={currentView === 'info'}
          onClick={onInfoClick}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 12l6-6m-6 6l6 6M21 12l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        
        <NavButton 
          label="RAM"
          isActive={currentView === 'ram'}
          onClick={onRamClick}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
              <path d="M12 11V7M12 15h.01" />
            </svg>
          }
        />
        </nav>
      </div>
    </div>
  )
}

interface NavButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
  icon: React.ReactNode
}

function NavButton({ label, isActive, onClick, icon }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] p-2 rounded-xl transition-all relative"
      style={{
        color: isActive ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
        background: isActive 
          ? 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 255, 119, 0.08) 100%)' 
          : 'transparent',
        border: isActive ? '1px solid rgba(255, 255, 119, 0.2)' : '1px solid transparent',
        boxShadow: isActive 
          ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 4px 12px rgba(255, 255, 119, 0.1)' 
          : 'none',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        WebkitTapHighlightColor: 'rgba(255, 255, 119, 0.1)', // Safari tap highlight
        touchAction: 'manipulation', // Prevent double-tap zoom
        cursor: 'pointer',
        userSelect: 'none', // Prevent text selection
        WebkitUserSelect: 'none', // Safari prefix
      }}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active indicator glow */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 119, 0.2) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
      )}
      
      <span className="mb-1 relative z-10" style={{
        filter: isActive ? 'drop-shadow(0 0 8px rgba(255, 255, 119, 0.5))' : 'none',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
        transition: 'all 0.3s ease',
      }}>
        {icon}
      </span>
      <span 
        className="text-xs font-medium relative z-10"
        style={{
          fontFamily: "'Switzer Variable', sans-serif",
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontSize: '10px',
          opacity: isActive ? 1 : 0.8,
          textShadow: isActive ? '0 0 8px rgba(255, 255, 119, 0.5)' : 'none',
        }}
      >
        {label}
      </span>
    </button>
  )
}
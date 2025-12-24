'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import EmailSignup from './EmailSignup'
import { motion, AnimatePresence } from 'framer-motion'
import '@/styles/teaser-font-fix.css'

// Import the header component for teaser
const TeaserHeader = dynamic(() => import('../layout/TeaserHeader'), {
  ssr: false,
  loading: () => null
})

// Use the working SatellitePropertyMap for reliable map display
const SatellitePropertyMap = dynamic(() => import('./SatellitePropertyMap'), {
  ssr: false,
  loading: () => null
})

export default function TeaserPropertyMap() {
  const [showCountdown] = useState(true) // Always show countdown, control visibility with animation
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [showNewsModal, setShowNewsModal] = useState(false)
  const [selectedNewsRelease, setSelectedNewsRelease] = useState<'inaugural' | 'update'>('inaugural')
  const [isNewsBoxHovered, setIsNewsBoxHovered] = useState(false)
  
  // Simple state for animations
  const [showMainContent, setShowMainContent] = useState(false)
  
  // States for tracking property selection from nested SatellitePropertyMap
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [showSplitScreen, setShowSplitScreen] = useState(false)
  
  // Check if October 2nd release should be visible
  const isOctoberReleaseVisible = () => {
    // Release time: October 2, 2025, 5:30 AM Pacific Time
    const releaseDate = new Date('2025-10-02T05:30:00-07:00') // PDT (UTC-7)
    const now = new Date()
    return now >= releaseDate
  }
  
  // REMOVED DUPLICATE FONT LOADING - fonts are loaded at page level like main page

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setIsLargeScreen(width >= 1440)
    }
    
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])
  
  // Ensure the selected release is valid when modal opens
  useEffect(() => {
    if (showNewsModal && selectedNewsRelease === 'update' && !isOctoberReleaseVisible()) {
      setSelectedNewsRelease('inaugural')
    }
  }, [showNewsModal, selectedNewsRelease])

  // Handle body scroll when modal opens/closes
  useEffect(() => {
    if (showNewsModal && isMobile) {
      // Lock body scroll on mobile
      const scrollY = window.scrollY
      document.body.classList.add('modal-open')
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      document.body.style.overscrollBehavior = 'none'
      
      return () => {
        // Restore body scroll
        document.body.classList.remove('modal-open')
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        document.body.style.touchAction = ''
        document.body.style.overscrollBehavior = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [showNewsModal, isMobile])

  
  // Simple content animation timing
  useEffect(() => {
    // Show content after map loads and animates
    const timeout = setTimeout(() => {
      setShowMainContent(true)
      // Also show header when content shows
      const header = document.querySelector('header')
      if (header) {
        header.style.opacity = '1'
      }
    }, 5000) // Allow time for map to load and animate
    
    return () => clearTimeout(timeout)
  }, [])


  return (
    <>
      <link
        rel="preload"
        href="/images/AeonikExtended-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <style jsx global>{`
        @keyframes subtleGlow {
          0% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 10px rgba(254, 217, 146, 0.3);
          }
          50% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 20px rgba(254, 217, 146, 0.5), 0 0 30px rgba(254, 217, 146, 0.3);
          }
          100% {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 10px rgba(254, 217, 146, 0.3);
          }
        }
        
        .latest-news-button {
          animation: subtleGlow 2s ease-in-out infinite;
        }
        
        @font-face {
          font-family: 'Aeonik Extended';
          src: url('/images/AeonikExtended-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: 'Aeonik Extended';
          src: url('/images/AeonikExtended-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: 'Aeonik Extended';
          src: url('/images/AeonikExtended-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
          font-display: block;
        }
        @font-face {
          font-family: 'Aeonik';
          src: url('/images/Aeonik-Light.woff2') format('woff2');
          font-weight: 200;
          font-style: normal;
          font-display: block;
        }


        /* Gradient animation for text */
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Force Aeonik Extended font for teaser heading */
        .teaser-heading h1 {
          font-family: 'Aeonik Extended', sans-serif !important;
        }

        /* Mobile modal scrolling fix - PROVEN SOLUTION */
        @media (max-width: 767px) {
          /* Lock body when modal is open */
          body.modal-open {
            position: fixed !important;
            width: 100% !important;
            height: 100vh !important;
            overflow: hidden !important;
            touch-action: none !important;
            overscroll-behavior: none !important;
          }
          
          /* Modal container must use these exact properties */
          .mobile-modal-scroll {
            position: fixed !important;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            overflow: auto !important;
            -webkit-overflow-scrolling: touch !important;
            overscroll-behavior: contain !important;
          }
          
          /* Force iOS to respect scrolling */
          @supports (-webkit-touch-callout: none) {
            .mobile-modal-scroll {
              -webkit-overflow-scrolling: touch !important;
              transform: translateZ(0) !important;
            }
          }
        }

        /* Ultra-wide screen support (1440px+) */
        @media (min-width: 1440px) {
          .teaser-heading h1 {
            max-width: 1100px;
          }
        }

        /* Extra large screens (1920px+) */
        @media (min-width: 1920px) {
          .teaser-heading h1 {
            max-width: 1300px;
          }
        }

        /* 4K screens (2560px+) */
        @media (min-width: 2560px) {
          .teaser-heading h1 {
            max-width: 1600px;
            font-size: clamp(4rem, 3vw, 6rem) !important;
          }
        }
      `}</style>
      
      {/* Teaser Header */}
      <TeaserHeader isLandingPage={true} />
      
      {/* EXACT COPY FROM MAIN LANDING PAGE */}
      <motion.div 
        className={`fixed pointer-events-none`}
        style={{ 
          zIndex: 1000, 
          left: isMobile ? '1rem' : isTablet ? '3%' : isLargeScreen ? '5%' : '4%',
          right: isMobile ? '1rem' : 'auto',
          top: isMobile 
            ? (typeof window !== 'undefined' && window.innerWidth >= 390 ? '130px' : '80px') 
            : isTablet 
            ? 'calc(140px - 1vh)' 
            : isLargeScreen 
            ? 'calc(180px - 3vh)' 
            : 'calc(160px - 2vh)',
          isolation: 'isolate'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showMainContent && !selectedProperty && !showSplitScreen ? 1 : 0,
          y: showMainContent && !selectedProperty && !showSplitScreen ? 0 : 20
        }}
        transition={{ 
          duration: showSplitScreen || selectedProperty ? 0.3 : 0.8,
          ease: "easeOut", 
          delay: selectedProperty || showSplitScreen ? 0 : 0.5 
        }}
      >
        <div className={`teaser-heading ${isMobile ? 'text-center' : ''}`}>
          <h1 className={`${isMobile ? 'mb-4' : 'mb-8'}`}
              style={{
                fontFamily: "'Aeonik Extended', sans-serif",
                fontWeight: isMobile ? 700 : 400,
                letterSpacing: '-0.03em',
                color: '#FFFFFF', // Fallback color for Chrome
                maxWidth: isMobile ? '100%' : isTablet ? '700px' : isLargeScreen ? '900px' : '750px',
                lineHeight: 1.1,
                fontSize: isMobile 
                  ? 'clamp(1.1rem, 5.5vw, 2rem)' 
                  : isTablet 
                  ? 'clamp(2.2rem, 4.5vw, 3.2rem)' 
                  : isLargeScreen 
                  ? 'clamp(2.5rem, 2.5vw, 3.2rem)' 
                  : 'clamp(2.54rem, 3.5vw, 3rem)',
                textTransform: isMobile ? 'uppercase' : 'none',
              }}>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: showMainContent && !selectedProperty && !showSplitScreen ? 1 : 0 }}
              transition={{ 
                delay: selectedProperty || showSplitScreen ? 0 : 0.8, 
                duration: showSplitScreen || selectedProperty ? 0.3 : 0.8
              }}
              style={!isMobile ? {
                display: 'block',
                position: 'relative',
                zIndex: 1
              } : {}}
            >
              <div style={{ 
                fontSize: isMobile ? 'clamp(1.1rem, 5.5vw, 2rem)' : 'inherit',
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 8s ease infinite',
                display: 'inline-block'
              }}>{isMobile ? 'Large Scale Discovery' : 'Large-Scale Discovery'}</div>
              <div style={{ 
                fontSize: isMobile ? 'clamp(1.1rem, 5.5vw, 2rem)' : 'inherit',
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 8s ease infinite',
                display: 'inline-block',
                ...(isMobile ? {} : {
                  position: 'relative',
                })
              }}>
                {isMobile ? (
                  <>
                    Potential In A <span style={{ color: '#FFFF77', fontWeight: 'inherit', fontSize: 'inherit' }}>World-Class</span>
                  </>
                ) : (
                  <>
                    <span>Potential In A </span>
                    <span style={{ 
                      color: '#FFFF77', 
                      fontWeight: 'inherit', 
                      fontSize: 'inherit'
                    }}>World-Class</span>
                  </>
                )}
              </div>
              <div style={{ 
                fontSize: isMobile ? 'clamp(1.1rem, 5.5vw, 2rem)' : 'inherit',
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 8s ease infinite',
                display: 'inline-block'
              }}>Precious Metals District</div>
            </motion.span>
          </h1>
        </div>

        {/* Countdown Timer and News Button Container */}
        <motion.div 
          style={{ 
            marginTop: isMobile ? '20px' : isTablet ? '25px' : isLargeScreen ? '40px' : '30px',
            display: 'inline-flex', // Always show
            flexDirection: 'column', // Stack vertically
            alignItems: 'stretch', // Make children same width
            gap: isMobile ? '20px' : isTablet ? '22px' : isLargeScreen ? '30px' : '25px', // Space between countdown and button
            pointerEvents: 'auto', // Always allow clicks
            zIndex: 10, // Ensure it's above map but below modal
            position: 'relative' // Needed for z-index to work
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: showMainContent && !selectedProperty && !showSplitScreen ? 1 : 0,
            y: showMainContent && !selectedProperty && !showSplitScreen ? 0 : 20
          }}
          transition={{ 
            duration: showSplitScreen || selectedProperty ? 0.3 : 0.8,
            ease: "easeOut", 
            delay: selectedProperty || showSplitScreen ? 0 : 0.7 
          }}
        >
          <EmailSignup 
            inline={true}
          />
          
          {/* News Releases Section - directly below countdown */}
          <div 
            onMouseEnter={() => !isMobile && setIsNewsBoxHovered(true)}
            onMouseLeave={() => !isMobile && setIsNewsBoxHovered(false)}
            onClick={() => isMobile && setIsNewsBoxHovered(!isNewsBoxHovered)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: isMobile ? '12px' : '14px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              maxHeight: isNewsBoxHovered ? '320px' : '130px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 10,
              pointerEvents: 'auto'
            }}>
            <h3 style={{
              color: '#FFFF77',
              fontSize: isMobile ? '13px' : '14px',
              fontFamily: "'Aeonik Extended', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '10px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              transition: 'opacity 0.3s ease',
              opacity: isNewsBoxHovered ? 0.9 : 1
            }}>
              Latest News Releases
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              transition: 'all 0.4s ease'
            }}>
              {/* Latest News Release - October 2nd - Only show after release time */}
              {isOctoberReleaseVisible() && (
                <button
                  className="latest-news-button"
                  onClick={() => {
                    setSelectedNewsRelease('update')
                    setShowNewsModal(true)
                  }}
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 14px' : '12px 16px',
                    background: `linear-gradient(135deg, 
                      rgba(254, 217, 146, 0.85) 0%, 
                      rgba(255, 255, 119, 0.75) 100%)`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#0d0f1e',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: 500,
                    fontFamily: "'Aeonik', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.animation = 'subtleGlow 1s ease-in-out infinite'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.animation = 'subtleGlow 2s ease-in-out infinite'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: isMobile ? '11px' : '12px', opacity: 0.7 }}>
                    October 2, 2025
                  </span>
                  <span>Private Placement/Update re Ram Property, Golden Triangle, BC</span>
                </button>
              )}

              {/* September News Release - Always visible if October is hidden, otherwise show on hover */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: (!isOctoberReleaseVisible() || isNewsBoxHovered) ? 1 : 0, 
                  height: (!isOctoberReleaseVisible() || isNewsBoxHovered) ? 'auto' : 0
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: 'easeInOut',
                  opacity: { duration: 0.2 }
                }}
                style={{
                  overflow: 'hidden'
                }}
              >
                <button
                  className={!isOctoberReleaseVisible() ? "latest-news-button" : ""}
                  onClick={() => {
                    setSelectedNewsRelease('inaugural')
                    setShowNewsModal(true)
                  }}
                  style={{
                    width: '100%',
                    padding: isMobile ? '10px 14px' : '12px 16px',
                    background: `linear-gradient(135deg, 
                      rgba(254, 217, 146, 0.85) 0%, 
                      rgba(255, 255, 119, 0.75) 100%)`,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '10px',
                    color: '#0d0f1e',
                    fontSize: isMobile ? '13px' : '14px',
                    fontWeight: 500,
                    fontFamily: "'Aeonik', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    if (!isOctoberReleaseVisible()) {
                      e.currentTarget.style.animation = 'subtleGlow 1s ease-in-out infinite'
                    } else {
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.25), 0 0 20px rgba(254, 217, 146, 0.4)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    if (!isOctoberReleaseVisible()) {
                      e.currentTarget.style.animation = 'subtleGlow 2s ease-in-out infinite'
                    } else {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: isMobile ? '11px' : '12px', opacity: 0.7 }}>
                    September 10, 2025
                  </span>
                  <span>Silver Grail Provides Update on 2025 Inaugural Drill Program</span>
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* View Legacy Website Button - bottom right corner, moved left to avoid compass - Hide on mobile */}
      {!isMobile && (
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        onClick={() => {
          window.open('https://legacy.silvergrail.com', '_blank')
        }}
        style={{
          position: 'fixed',
          bottom: isMobile ? '30px' : '24px',  // Aligned with bottom nav bar
          right: isMobile ? '100px' : '180px',  // Moved further left to avoid compass
          padding: '14px 28px',
          background: `linear-gradient(135deg, 
            rgba(254, 217, 146, 0.9) 0%, 
            rgba(255, 255, 119, 0.8) 100%)`,
          backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50px',
          color: '#0d0f1e',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: "'Aeonik Extended', sans-serif",
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          zIndex: 50,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(254, 217, 146, 0.6), 0 0 60px rgba(255, 255, 119, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        View Legacy Website
      </motion.button>
      )}

      {/* Use the working SatellitePropertyMap directly */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}>
        <SatellitePropertyMap 
          hideHeadline={true}
          hideMobileNav={true}
          hideBottomNav={true}
          useTeutonLogo={true}
          isTeaser={true}
          onPropertySelectionChange={setSelectedProperty}
          onSplitScreenChange={setShowSplitScreen}
          screenIsMobile={isMobile}
          screenIsTablet={isTablet}
          screenIsLargeScreen={isLargeScreen}
        />
      </div>

      {/* News Release Modal - COMPLETELY REMADE FOR MOBILE SCROLLING */}
      <AnimatePresence>
        {showNewsModal && (
          <>
            {isMobile ? (
              // MOBILE VERSION - Proven scrolling solution
              <div
                className="mobile-modal-scroll"
                style={{
                  position: 'fixed',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 2147483647,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  overflow: 'auto', // Changed from overflowY
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain', // Prevent scroll chaining
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowNewsModal(false)
                    setSelectedNewsRelease('inaugural')
                  }
                }}
              >
                <div
                  style={{
                    minHeight: '101%', // Slightly over 100% to force scrollbar
                    background: `linear-gradient(135deg, 
                      rgba(255, 190, 152, 0.95) 0%, 
                      rgba(255, 190, 152, 0.9) 30%,
                      rgba(254, 217, 146, 0.85) 70%,
                      rgba(255, 190, 152, 0.92) 100%)`,
                    padding: '60px 20px 80px', // Added extra bottom padding
                    position: 'relative',
                    overflow: 'visible', // Allow content to flow naturally
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button for Mobile */}
                  <button
                    onClick={() => {
                      setShowNewsModal(false)
                      setSelectedNewsRelease('inaugural')
                    }}
                    style={{
                      position: 'fixed',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(13, 15, 30, 0.2)',
                      border: '1px solid rgba(13, 15, 30, 0.3)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: '#0d0f1e',
                      zIndex: 2147483647,
                    }}
                  >
                    ×
                  </button>

                  {/* Mobile Content */}
                  <div 
                    style={{ 
                      color: '#0d0f1e',
                      fontFamily: "'Aeonik', sans-serif",
                      lineHeight: 1.6,
                      fontSize: '13px',
                    }}>
                <h2 style={{
                  fontSize: isMobile ? '20px' : '26px',
                  marginBottom: '20px',
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 600,
                  color: '#0d0f1e',
                  lineHeight: 1.3
                }}>
                  {selectedNewsRelease === 'inaugural' 
                    ? 'Silver Grail Provides Update on 2025 Inaugural Drill Program'
                    : 'Private Placement/Update re Ram Property, Golden Triangle, BC'
                  }
                </h2>

                <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.7, color: '#0d0f1e' }}>
                  {selectedNewsRelease === 'inaugural'
                    ? 'September 10, 2025 – Victoria, BC'
                    : 'Victoria, British Columbia, Canada - October 2, 2025'
                  }
                </p>

                {selectedNewsRelease === 'inaugural' ? (
                  <>
                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      Silver Grail Resources Ltd. ("Silver Grail" or "the Company") ("SVG"-TSX-V) is pleased to provide an update on its 2025 inaugural drill program on the Company's Ram Property (Figure 1), located 7 kilometres ("km") west of the Red Mountain deposit, in the heart of British Columbia's Golden Triangle. The Ram Property is jointly owned with Teuton Resources Corp.
                    </p>
                    <h3 style={{ 
                  fontSize: isMobile ? '14px' : '16px',
                  marginTop: '20px',
                  marginBottom: '12px',
                  color: '#0d0f1e',
                  fontWeight: 600
                }}>
                  Highlights of the 2025 Ram Property drill program include:
                </h3>

                <ul style={{ marginBottom: '20px', paddingLeft: '30px', listStyleType: 'disc' }}>
                  <li style={{ marginBottom: '10px' }}>
                    To date, 1,717 metres ("m") drilled in six completed diamond drill holes (Figure 1). Following a short break, drilling has resumed with a seventh hole that has a planned depth of 400m.
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    Two targets have been drill tested. Both are broadly outlined by previously unexplained magnetic highs which are now explained and are associated with significant mineralization.
                    <ul style={{ marginTop: '10px', paddingLeft: '30px', listStyleType: 'circle' }}>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Target 1 – Western magnetic anomaly</strong> (Holes 3-6 incl.; Figure 1) -- comprises a 1,000 by 800m magnetic high situated 7 km southwest of the Red Mountain gold-silver deposit. Three drill holes tested the target and intersected broad domains of hornfels, narrow porphyry dykes, and high proportions of disseminated, stringer, and vein-related magnetic pyrrhotite-pyrite-chalcopyrite mineralization, sometimes with trace arsenopyrite.
                      </li>
                      <li style={{ marginBottom: '8px' }}>
                        <strong>Target 2 – Eastern, linear magnetic anomaly</strong> (Holes 1-2; 7; Figure 1) -- comprises a 1 km long by 150m wide north-south oriented magnetic high located east of Target 1. Drilling and surface mapping define the magnetic high as a multi-phase porphyritic intrusion with local moderate to strong potassium-feldspar-biotite-magnetite alteration overprinted by moderate to strong chlorite-calcite alteration and intervals with quartz-calcite-pyrite-chalcopyrite stockwork veining and blebby disseminated chalcopyrite.
                      </li>
                    </ul>
                  </li>
                </ul>

                <div style={{ 
                  backgroundColor: 'rgba(13, 15, 30, 0.08)',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  borderLeft: '4px solid rgba(13, 15, 30, 0.3)'
                }}>
                  <p style={{ fontStyle: 'italic', color: 'rgba(13, 15, 30, 0.85)', lineHeight: 1.7 }}>
                    <strong>Dino Cremonese, P. Eng., CEO of Silver Grail:</strong> "We are encouraged that inaugural drilling on the Ram property has yielded significant visual results from both of the chosen targets. The first three holes in Target 1 showed a surprising increase in sulfide concentrations at depth, particularly with pyrrhotite, as they approached the center of the western magnetic anomaly. Given the high proportion of pyrrhotite identified at Target 1, and the association between pyrrhotite and precious metal at the nearby Red Mountain gold deposit (Ascot Resources, 7 km northeast), and Surebet (Goliath Resources, 30 km south), we have reason to hope for associated precious metal endowment on the Ram."
                  </p>
                </div>

                <h3 style={{ 
                  fontSize: isMobile ? '16px' : '18px',
                  marginTop: '28px',
                  marginBottom: '16px',
                  color: '#0d0f1e',
                  fontWeight: 600,
                  fontFamily: "'Aeonik Extended', sans-serif"
                }}>
                  Target 1 Western Magnetic Anomaly – Visual Results
                </h3>

                <p style={{ marginBottom: '20px' }}>
                  Drill holes RAM25-03 – RAM25-06 were collared from a single drill pad, located between two magnetic highs (Targets 1 and 2), in an area that yielded significant gold from surface grab samples (trace to 7.01 grams per tonne ("g/t") gold ("Au"), and 0.12 to 58.63 g/t silver ("Ag") in 25 samples, see Silver Grail News Release dated August 26, 2025), as well as copper ("Cu") and molybdenum.
                </p>

                <p style={{ marginBottom: '20px' }}>
                  Drillholes RAM25-03, RAM25-04, and RAM25-05 extended beyond the zone of surface sampling, beneath inaccessible ground to the west, into a strong approximately 1,000 by 800m magnetic high (Target 1; Figure 1). At the top of hole RAM25-03 veining consistent with gold bearing veins at surface was intersected. Beginning at 140m depth, where the hole approaches the magnetic high, silicified hornfels transitions from non-magnetic with disseminated pyrite to moderately to strongly magnetic with high proportions of disseminated, stringer, and vein-related magnetic pyrrhotite ± pyrite. Veining ranges in density but through the pyrrhotite bearing section (140m – end of hole at 335m) there are typically 1-3 calcite-pyrrhotite ± quartz ± pyrite ± chalcopyrite ± arsenopyrite veins per metre that range from 3 mm to &gt; 50 cm, as well as locally dense narrow pyrrhotite stringers (Figure 2). There are also breccias with abundant sulfides in the matrix (Figure 2), and suspected strongly altered porphyry dykes with 2-5% blebby pyrrhotite. Similar pyrrhotite bearing mineralization has also been identified in drill holes RAM25-04 and RAM25-05.
                </p>

                <p style={{ marginBottom: '20px' }}>
                  A first batch of samples from Hole 3 has been sent to MSA Laboratory in Langley, BC.
                </p>

                <h3 style={{ 
                  fontSize: isMobile ? '16px' : '18px',
                  marginTop: '28px',
                  marginBottom: '16px',
                  color: '#0d0f1e',
                  fontWeight: 600,
                  fontFamily: "'Aeonik Extended', sans-serif"
                }}>
                  Target 2 Eastern Magnetic Anomaly – Visual Results
                </h3>

                <p style={{ marginBottom: '20px' }}>
                  Drill holes RAM25-01 and RAM25-02, and RAM25-07 which is currently being drilled, test an approximately 1 km long 150m wide magnetic high that is associated with a multi-phase porphyry intrusion that contains both primary and secondary magnetite (Figure 1). Prospecting and sampling in 2024 and in the current year have identified widespread Cu ± Au mineralization through the intrusion and along it's contact zone, as highlighted by the Malachite Zone, which was discovered in 2024 (trace to 5.78% Cu, and trace to 2.33 g/t Au in 35 samples; see Silver Grail News Release dated August 26, 2025).
                </p>

                <p style={{ marginBottom: '20px' }}>
                  Drill holes RAM25-01 and RAM25-02 collared from the same pad along the northern portion of the magnetic high and drilled beneath the anomaly in the vicinity of the Malachite Zone. Both holes intersected porphyry intrusions with local moderate to strong K-feldspar-biotite-magnetite alteration (Figure 3) overprinted by moderate to strong chlorite-calcite alteration, and intervals with associated quartz-calcite-pyrite-chalcopyrite stockwork veining (Figure 3) and blebby disseminated chalcopyrite.
                </p>

                <p style={{ marginBottom: '20px' }}>
                  Based on these visual drill results, as well as observations from surface exposures, the intrusion is interpreted to be the driver of a porphyry-copper-gold mineralization system that has potential to extend along the full length of the intrusion. Drill hole RAM25-07 has been collared approximately 620m to the south of holes RAM25-01 and RAM25-02 and comprises a broad step-out along the porphyry intrusion. It will test beneath an area where malachite and chalcopyrite are present at surface within quartz-calcite altered porphyritic intrusive rock.
                </p>

                <h3 style={{ 
                  fontSize: isMobile ? '16px' : '18px',
                  marginTop: '28px',
                  marginBottom: '16px',
                  color: '#0d0f1e',
                  fontWeight: 600,
                  fontFamily: "'Aeonik Extended', sans-serif"
                }}>
                  URLs for Maps and Photos:
                </h3>

                <ul style={{ marginBottom: '20px', paddingLeft: '30px', listStyleType: 'none' }}>
                  <li style={{ marginBottom: '8px' }}>
                    Fig. 1 - Plan Map – 2025 Drilling Ram Property: <a href="https://teuton.com/PlanMap-RamDrilling2025" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/PlanMap-RamDrilling2025</a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    Fig. 2 – Photos Western Anomaly Core Intersections: <a href="https://teuton.com/WesternAnomalyCorePhotos" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/WesternAnomalyCorePhotos</a>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    Fig. 3 – Photos Eastern Anomaly Core Intersections: <a href="https://teuton.com/EasternAnomalyCorePhotos" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/EasternAnomalyCorePhotos</a>
                  </li>
                </ul>

                <div style={{ 
                  marginTop: '30px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{ 
                    fontSize: '16px',
                    marginBottom: '10px',
                    color: '#0d0f1e',
                    fontWeight: 600
                  }}>
                    Qualified Person
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                    D. Cremonese, P. Eng., is the QP for Silver Grail Resources Ltd.; as President and CEO of Silver Grail he is not independent of the Company.
                  </p>

                  <h3 style={{ 
                    fontSize: '16px',
                    marginBottom: '10px',
                    color: '#0d0f1e',
                    fontWeight: 600
                  }}>
                    About Silver Grail
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                    Silver Grail Resources Ltd. is a junior exploration company with a large portfolio of properties in the southern portion of the Golden Triangle region of British Columbia. Its legacy properties, some more than thirty years old, form large islands within the vast claim holdings of Goliath Resources in this region.
                  </p>

                  <h3 style={{ 
                    fontSize: '16px',
                    marginBottom: '10px',
                    color: '#0d0f1e',
                    fontWeight: 600
                  }}>
                    Silver Grail Website:
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                    The all-new Silver Grail website is about to go live with exclusive drone videos, interactive features, and completely new content. Stay tuned.
                  </p>

                  <div style={{ fontSize: '14px', color: 'rgba(13, 15, 30, 0.7)' }}>
                    <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                      ON BEHALF OF THE BOARD OF DIRECTORS OF SILVER GRAIL RESOURCES LTD.
                    </p>
                    <p style={{ marginBottom: '5px' }}>
                      "Dino Cremonese"
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                      Dino Cremonese, P. Eng.,<br />
                      President and Chief Executive Officer
                    </p>

                    <p style={{ marginBottom: '10px' }}>
                      <strong>For further information, please visit the Company's website at www.silvergrail.com or contact:</strong>
                    </p>
                    <p style={{ marginBottom: '5px' }}>
                      Barry Holmes<br />
                      Director Corporate Development and Communications<br />
                      Tel. 778-430-5680<br />
                      Email: bholmesmba@gmail.com
                    </p>
                  </div>

                  <div style={{ 
                    marginTop: '20px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(13, 15, 30, 0.15)',
                    fontSize: '12px',
                    color: 'rgba(13, 15, 30, 0.6)'
                  }}>
                    <p style={{ marginBottom: '10px' }}>
                      Neither the TSX Venture Exchange nor its Regulation Services Provider (as that term is defined in the policies of the TSX Venture Exchange) accepts responsibility for the adequacy or accuracy of this release.
                    </p>

                    <h4 style={{ fontSize: '12px', marginTop: '15px', marginBottom: '10px' }}>
                      Cautionary Statements regarding Forward-Looking information
                    </h4>
                    <p style={{ fontSize: '11px', lineHeight: 1.6 }}>
                      Certain statements contained in this press release constitute forward-looking information. These statements relate to future events or future performance. The use of any of the words "could", "intend", "expect", "believe", "will", "projected", "estimated" and similar expressions and statements relating to matters that are not historical facts are intended to identify forward-looking information and are based on the Company's current belief or assumptions as to the outcome and timing of such future events. Actual future results may differ materially.
                    </p>
                    <p style={{ fontSize: '11px', lineHeight: 1.6, marginTop: '10px' }}>
                      All statements relating to future plans, objectives or expectations of the Company are forward-looking statements that involve various risks and uncertainties. There can be no assurance that such statements will prove to be accurate and actual results and future events could differ materially from those anticipated in such statements. Important factors that could cause actual results to differ materially from the Company's plans or expectations include risks relating to the actual results of current exploration activities, fluctuating gold prices, possibility of equipment breakdowns and delays, exploration cost overruns, availability of capital and financing, general economic, market or business conditions, regulatory changes, timeliness of government or regulatory approvals and other risks detailed herein and from time to time in the filings made by the Company with securities regulators. The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                    </p>
                    <p style={{ fontSize: '11px', lineHeight: 1.6, marginTop: '10px' }}>
                      The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                    </p>
                  </div>
                </div>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      Silver Grail Resources Ltd. ("Silver Grail" or "the Company") ("SVG"-TSX-V) announces that it intends to complete a non-brokered private placement consisting of the issuance of up to 2,500,000 units ("Units") at a price of $0.23 per Unit for gross proceeds of up to $575,000 subject to the approval of the TSX Venture Exchange. Each Unit will consist of one common share ("Common Share") and a Common Share purchase warrant ("Warrant"). Each Warrant is exercisable into one Common Share at a price of $0.33 for a period of two years from closing. Silver Grail's share price closed at $0.28 on October 1, 2025.
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      There are no finder's fees or other commissions associated with the transaction. Certain of the Company's insiders may participate in the private placement. The proceeds of the financing will be used to pay for 2025 exploration of the Ram property as well as further exploration of the Company's other mineral properties in the Golden Triangle and also for general corporate purposes.
                    </p>

                    <h3 style={{ 
                      fontSize: isMobile ? '14px' : '16px',
                      marginTop: '20px',
                      marginBottom: '12px',
                      color: '#0d0f1e',
                      fontWeight: 600
                    }}>
                      Update re Ram Property
                    </h3>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      Drilling is now complete at the Ram property with 2,056 metres having been drilled in seven holes. All of the core has now been logged and diamond sawed and final shipments to the assay lab are expected within the next days. MSALabs has been instructed to hold all assays until such time as the total submittal from the Ram has been completed.
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      During the final days of the drill program, Jeff Kyba, P. Geo., visited the Ram property as well as the Company's Clone, Konkin Silver and Fiji properties. While walking the surface projection of Hole #7, Jeff discovered a new showing of net-textured chalcopyrite (see photo URL below). Also included in the URL section are a number of photos taken by drillers during the program of various select examples of mineralized core.
                    </p>

                    <h3 style={{ 
                      fontSize: isMobile ? '14px' : '16px',
                      marginTop: '20px',
                      marginBottom: '12px',
                      color: '#0d0f1e',
                      fontWeight: 600
                    }}>
                      URLs
                    </h3>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '8px' }}>
                      <a href="https://teuton.com/Ram2025CorePhotos" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/Ram2025CorePhotos</a> -- Various photos of mineralized core
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      <a href="https://teuton.com/NetTexturedSample" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/NetTexturedSample</a> -- Photo of net-textured chalcopyrite
                    </p>

                    <h3 style={{ 
                      fontSize: isMobile ? '14px' : '16px',
                      marginTop: '20px',
                      marginBottom: '12px',
                      color: '#0d0f1e',
                      fontWeight: 600
                    }}>
                      Qualified Person
                    </h3>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      D. Cremonese, P. Eng., is the QP for Silver Grail Resources Ltd.; as President and CEO of Silver Grail he is not independent of the Company.
                    </p>

                    <h3 style={{ 
                      fontSize: isMobile ? '14px' : '16px',
                      marginTop: '20px',
                      marginBottom: '12px',
                      color: '#0d0f1e',
                      fontWeight: 600
                    }}>
                      About Silver Grail
                    </h3>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      Silver Grail Resources Ltd. is a junior exploration company with a large portfolio of properties in the southern portion of the Golden Triangle region of British Columbia. Its legacy properties, some more than thirty years old, form large islands within the vast claim holdings of Goliath Resources in this region.
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '10px', fontWeight: 'bold' }}>
                      ON BEHALF OF THE BOARD OF DIRECTORS OF SILVER GRAIL RESOURCES LTD.
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '5px' }}>
                      "Dino Cremonese"
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      Dino Cremonese, P. Eng.,<br />
                      President and Chief Executive Officer
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      <strong>For further information, please visit the Company's website at www.silvergrail.com or contact:</strong>
                    </p>

                    <p style={{ fontSize: isMobile ? '12px' : '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                      Barry Holmes<br />
                      Director Corporate Development and Communications<br />
                      Tel. 778-430-5680<br />
                      Email: bholmesmba@gmail.com
                    </p>

                    <p style={{ fontSize: isMobile ? '11px' : '12px', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                      Neither the TSX Venture Exchange nor its Regulation Services Provider (as that term is defined in the policies of the TSX Venture Exchange) accepts responsibility for the adequacy or accuracy of this release.
                    </p>

                    <h4 style={{ fontSize: isMobile ? '12px' : '13px', marginTop: '16px', marginBottom: '10px', fontWeight: 600 }}>
                      Cautionary Statements regarding Forward-Looking information
                    </h4>

                    <p style={{ fontSize: isMobile ? '11px' : '12px', lineHeight: 1.6, marginBottom: '10px' }}>
                      Certain statements contained in this press release constitute forward-looking information. These statements relate to future events or future performance. The use of any of the words "could", "intend", "expect", "believe", "will", "projected", "estimated" and similar expressions and statements relating to matters that are not historical facts are intended to identify forward-looking information and are based on the Company's current belief or assumptions as to the outcome and timing of such future events. Actual future results may differ materially.
                    </p>

                    <p style={{ fontSize: isMobile ? '11px' : '12px', lineHeight: 1.6, marginBottom: '10px' }}>
                      All statements relating to future plans, objectives or expectations of the Company are forward-looking statements that involve various risks and uncertainties. There can be no assurance that such statements will prove to be accurate and actual results and future events could differ materially from those anticipated in such statements. Important factors that could cause actual results to differ materially from the Company's plans or expectations include risks relating to the actual results of current exploration activities, fluctuating gold prices, possibility of equipment breakdowns and delays, exploration cost overruns, availability of capital and financing, general economic, market or business conditions, regulatory changes, timeliness of government or regulatory approvals and other risks detailed herein and from time to time in the filings made by the Company with securities regulators. The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                    </p>

                    <p style={{ fontSize: isMobile ? '11px' : '12px', lineHeight: 1.6, marginBottom: '16px' }}>
                      The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                    </p>
                  </>
                )}
                  </div>
                </div>
              </div>
            ) : (
              // DESKTOP VERSION - Original structure with animations
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  zIndex: 999999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowNewsModal(false)
                    setSelectedNewsRelease('inaugural')
                  }
                }}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    maxWidth: '900px',
                    width: '100%',
                    height: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(255, 190, 152, 0.3)',
                    marginTop: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(255, 190, 152, 0.95) 0%, 
                        rgba(255, 190, 152, 0.9) 30%,
                        rgba(254, 217, 146, 0.85) 70%,
                        rgba(255, 190, 152, 0.92) 100%)`,
                      backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                      WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                      padding: '32px',
                      paddingTop: '50px',
                      position: 'relative',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {/* Close Button for Desktop */}
                    <button
                      onClick={() => {
                        setShowNewsModal(false)
                        setSelectedNewsRelease('inaugural')
                      }}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(13, 15, 30, 0.2)',
                        border: '1px solid rgba(13, 15, 30, 0.3)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '28px',
                        color: '#0d0f1e',
                        transition: 'all 0.3s ease',
                        fontWeight: 300,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(13, 15, 30, 0.3)'
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(13, 15, 30, 0.2)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      ×
                    </button>

                    {/* Desktop Content */}
                    <div 
                      className="news-release-scroll"
                      style={{ 
                        color: '#0d0f1e',
                        fontFamily: "'Aeonik', sans-serif",
                        lineHeight: 1.6,
                        fontSize: '14px',
                        maxHeight: 'calc(80vh - 160px)',
                        overflowY: 'auto',
                        paddingRight: '10px',
                        paddingBottom: '20px'
                      }}>
                      <h2 style={{
                        fontSize: '26px',
                        marginBottom: '20px',
                        fontFamily: "'Aeonik Extended', sans-serif",
                        fontWeight: 600,
                        color: '#0d0f1e',
                        lineHeight: 1.3
                      }}>
                        {selectedNewsRelease === 'inaugural' 
                          ? 'Silver Grail Provides Update on 2025 Inaugural Drill Program'
                          : 'Private Placement/Update re Ram Property, Golden Triangle, BC'
                        }
                      </h2>

                      <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.7, color: '#0d0f1e' }}>
                        {selectedNewsRelease === 'inaugural'
                          ? 'September 10, 2025 – Victoria, BC'
                          : 'Victoria, British Columbia, Canada - October 2, 2025'
                        }
                      </p>

                      {selectedNewsRelease === 'inaugural' ? (
                        <>
                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            Silver Grail Resources Ltd. ("Silver Grail" or "the Company") ("SVG"-TSX-V) is pleased to provide an update on its 2025 inaugural drill program on the Company's Ram Property (Figure 1), located 7 kilometres ("km") west of the Red Mountain deposit, in the heart of British Columbia's Golden Triangle. The Ram Property is jointly owned with Teuton Resources Corp.
                          </p>
                          <h3 style={{ 
                            fontSize: '16px',
                            marginTop: '20px',
                            marginBottom: '12px',
                            color: '#0d0f1e',
                            fontWeight: 600
                          }}>
                            Highlights of the 2025 Ram Property drill program include:
                          </h3>

                          <ul style={{ marginBottom: '20px', paddingLeft: '30px', listStyleType: 'disc' }}>
                            <li style={{ marginBottom: '10px' }}>
                              To date, 1,717 metres ("m") drilled in six completed diamond drill holes (Figure 1). Following a short break, drilling has resumed with a seventh hole that has a planned depth of 400m.
                            </li>
                            <li style={{ marginBottom: '10px' }}>
                              Two targets have been drill tested. Both are broadly outlined by previously unexplained magnetic highs which are now explained and are associated with significant mineralization.
                              <ul style={{ marginTop: '10px', paddingLeft: '30px', listStyleType: 'circle' }}>
                                <li style={{ marginBottom: '8px' }}>
                                  <strong>Target 1 – Western magnetic anomaly</strong> (Holes 3-6 incl.; Figure 1) -- comprises a 1,000 by 800m magnetic high situated 7 km southwest of the Red Mountain gold-silver deposit. Three drill holes tested the target and intersected broad domains of hornfels, narrow porphyry dykes, and high proportions of disseminated, stringer, and vein-related magnetic pyrrhotite-pyrite-chalcopyrite mineralization, sometimes with trace arsenopyrite.
                                </li>
                                <li style={{ marginBottom: '8px' }}>
                                  <strong>Target 2 – Eastern, linear magnetic anomaly</strong> (Holes 1-2; 7; Figure 1) -- comprises a 1 km long by 150m wide north-south oriented magnetic high located east of Target 1. Drilling and surface mapping define the magnetic high as a multi-phase porphyritic intrusion with local moderate to strong potassium-feldspar-biotite-magnetite alteration overprinted by moderate to strong chlorite-calcite alteration and intervals with quartz-calcite-pyrite-chalcopyrite stockwork veining and blebby disseminated chalcopyrite.
                                </li>
                              </ul>
                            </li>
                          </ul>

                          <div style={{ 
                            backgroundColor: 'rgba(13, 15, 30, 0.08)',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            borderLeft: '4px solid rgba(13, 15, 30, 0.3)'
                          }}>
                            <p style={{ fontStyle: 'italic', color: 'rgba(13, 15, 30, 0.85)', lineHeight: 1.7 }}>
                              <strong>Dino Cremonese, P. Eng., CEO of Silver Grail:</strong> "We are encouraged that inaugural drilling on the Ram property has yielded significant visual results from both of the chosen targets. The first three holes in Target 1 showed a surprising increase in sulfide concentrations at depth, particularly with pyrrhotite, as they approached the center of the western magnetic anomaly. Given the high proportion of pyrrhotite identified at Target 1, and the association between pyrrhotite and precious metal at the nearby Red Mountain gold deposit (Ascot Resources, 7 km northeast), and Surebet (Goliath Resources, 30 km south), we have reason to hope for associated precious metal endowment on the Ram."
                            </p>
                          </div>

                          <h3 style={{ 
                            fontSize: '18px',
                            marginTop: '28px',
                            marginBottom: '16px',
                            color: '#0d0f1e',
                            fontWeight: 600,
                            fontFamily: "'Aeonik Extended', sans-serif"
                          }}>
                            Target 1 Western Magnetic Anomaly – Visual Results
                          </h3>

                          <p style={{ marginBottom: '20px' }}>
                            Drill holes RAM25-03 – RAM25-06 were collared from a single drill pad, located between two magnetic highs (Targets 1 and 2), in an area that yielded significant gold from surface grab samples (trace to 7.01 grams per tonne ("g/t") gold ("Au"), and 0.12 to 58.63 g/t silver ("Ag") in 25 samples, see Silver Grail News Release dated August 26, 2025), as well as copper ("Cu") and molybdenum.
                          </p>

                          <p style={{ marginBottom: '20px' }}>
                            Drillholes RAM25-03, RAM25-04, and RAM25-05 extended beyond the zone of surface sampling, beneath inaccessible ground to the west, into a strong approximately 1,000 by 800m magnetic high (Target 1; Figure 1). At the top of hole RAM25-03 veining consistent with gold bearing veins at surface was intersected. Beginning at 140m depth, where the hole approaches the magnetic high, silicified hornfels transitions from non-magnetic with disseminated pyrite to moderately to strongly magnetic with high proportions of disseminated, stringer, and vein-related magnetic pyrrhotite ± pyrite. Veining ranges in density but through the pyrrhotite bearing section (140m – end of hole at 335m) there are typically 1-3 calcite-pyrrhotite ± quartz ± pyrite ± chalcopyrite ± arsenopyrite veins per metre that range from 3 mm to &gt; 50 cm, as well as locally dense narrow pyrrhotite stringers (Figure 2). There are also breccias with abundant sulfides in the matrix (Figure 2), and suspected strongly altered porphyry dykes with 2-5% blebby pyrrhotite. Similar pyrrhotite bearing mineralization has also been identified in drill holes RAM25-04 and RAM25-05.
                          </p>

                          <p style={{ marginBottom: '20px' }}>
                            A first batch of samples from Hole 3 has been sent to MSA Laboratory in Langley, BC.
                          </p>

                          <h3 style={{ 
                            fontSize: '18px',
                            marginTop: '28px',
                            marginBottom: '16px',
                            color: '#0d0f1e',
                            fontWeight: 600,
                            fontFamily: "'Aeonik Extended', sans-serif"
                          }}>
                            Target 2 Eastern Magnetic Anomaly – Visual Results
                          </h3>

                          <p style={{ marginBottom: '20px' }}>
                            Drill holes RAM25-01 and RAM25-02, and RAM25-07 which is currently being drilled, test an approximately 1 km long 150m wide magnetic high that is associated with a multi-phase porphyry intrusion that contains both primary and secondary magnetite (Figure 1). Prospecting and sampling in 2024 and in the current year have identified widespread Cu ± Au mineralization through the intrusion and along it's contact zone, as highlighted by the Malachite Zone, which was discovered in 2024 (trace to 5.78% Cu, and trace to 2.33 g/t Au in 35 samples; see Silver Grail News Release dated August 26, 2025).
                          </p>

                          <p style={{ marginBottom: '20px' }}>
                            Drill holes RAM25-01 and RAM25-02 collared from the same pad along the northern portion of the magnetic high and drilled beneath the anomaly in the vicinity of the Malachite Zone. Both holes intersected porphyry intrusions with local moderate to strong K-feldspar-biotite-magnetite alteration (Figure 3) overprinted by moderate to strong chlorite-calcite alteration, and intervals with associated quartz-calcite-pyrite-chalcopyrite stockwork veining (Figure 3) and blebby disseminated chalcopyrite.
                          </p>

                          <p style={{ marginBottom: '20px' }}>
                            Based on these visual drill results, as well as observations from surface exposures, the intrusion is interpreted to be the driver of a porphyry-copper-gold mineralization system that has potential to extend along the full length of the intrusion. Drill hole RAM25-07 has been collared approximately 620m to the south of holes RAM25-01 and RAM25-02 and comprises a broad step-out along the porphyry intrusion. It will test beneath an area where malachite and chalcopyrite are present at surface within quartz-calcite altered porphyritic intrusive rock.
                          </p>

                          <h3 style={{ 
                            fontSize: '18px',
                            marginTop: '28px',
                            marginBottom: '16px',
                            color: '#0d0f1e',
                            fontWeight: 600,
                            fontFamily: "'Aeonik Extended', sans-serif"
                          }}>
                            URLs for Maps and Photos:
                          </h3>

                          <ul style={{ marginBottom: '20px', paddingLeft: '30px', listStyleType: 'none' }}>
                            <li style={{ marginBottom: '8px' }}>
                              Fig. 1 - Plan Map – 2025 Drilling Ram Property: <a href="https://teuton.com/PlanMap-RamDrilling2025" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/PlanMap-RamDrilling2025</a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                              Fig. 2 – Photos Western Anomaly Core Intersections: <a href="https://teuton.com/WesternAnomalyCorePhotos" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/WesternAnomalyCorePhotos</a>
                            </li>
                            <li style={{ marginBottom: '8px' }}>
                              Fig. 3 – Photos Eastern Anomaly Core Intersections: <a href="https://teuton.com/EasternAnomalyCorePhotos" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/EasternAnomalyCorePhotos</a>
                            </li>
                          </ul>

                          <div style={{ 
                            marginTop: '30px',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                          }}>
                            <h3 style={{ 
                              fontSize: '16px',
                              marginBottom: '10px',
                              color: '#0d0f1e',
                              fontWeight: 600
                            }}>
                              Qualified Person
                            </h3>
                            <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                              D. Cremonese, P. Eng., is the QP for Silver Grail Resources Ltd.; as President and CEO of Silver Grail he is not independent of the Company.
                            </p>

                            <h3 style={{ 
                              fontSize: '16px',
                              marginBottom: '10px',
                              color: '#0d0f1e',
                              fontWeight: 600
                            }}>
                              About Silver Grail
                            </h3>
                            <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                              Silver Grail Resources Ltd. is a junior exploration company with a large portfolio of properties in the southern portion of the Golden Triangle region of British Columbia. Its legacy properties, some more than thirty years old, form large islands within the vast claim holdings of Goliath Resources in this region.
                            </p>

                            <h3 style={{ 
                              fontSize: '16px',
                              marginBottom: '10px',
                              color: '#0d0f1e',
                              fontWeight: 600
                            }}>
                              Silver Grail Website:
                            </h3>
                            <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                              The all-new Silver Grail website is about to go live with exclusive drone videos, interactive features, and completely new content. Stay tuned.
                            </p>

                            <div style={{ fontSize: '14px', color: 'rgba(13, 15, 30, 0.7)' }}>
                              <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                                ON BEHALF OF THE BOARD OF DIRECTORS OF SILVER GRAIL RESOURCES LTD.
                              </p>
                              <p style={{ marginBottom: '5px' }}>
                                "Dino Cremonese"
                              </p>
                              <p style={{ marginBottom: '20px' }}>
                                Dino Cremonese, P. Eng.,<br />
                                President and Chief Executive Officer
                              </p>

                              <p style={{ marginBottom: '10px' }}>
                                <strong>For further information, please visit the Company's website at www.silvergrail.com or contact:</strong>
                              </p>
                              <p style={{ marginBottom: '5px' }}>
                                Barry Holmes<br />
                                Director Corporate Development and Communications<br />
                                Tel. 778-430-5680<br />
                                Email: bholmesmba@gmail.com
                              </p>
                            </div>

                            <div style={{ 
                              marginTop: '20px',
                              paddingTop: '15px',
                              borderTop: '1px solid rgba(13, 15, 30, 0.15)',
                              fontSize: '12px',
                              color: 'rgba(13, 15, 30, 0.6)'
                            }}>
                              <p style={{ marginBottom: '10px' }}>
                                Neither the TSX Venture Exchange nor its Regulation Services Provider (as that term is defined in the policies of the TSX Venture Exchange) accepts responsibility for the adequacy or accuracy of this release.
                              </p>

                              <h4 style={{ fontSize: '12px', marginTop: '15px', marginBottom: '10px' }}>
                                Cautionary Statements regarding Forward-Looking information
                              </h4>
                              <p style={{ fontSize: '11px', lineHeight: 1.6 }}>
                                Certain statements contained in this press release constitute forward-looking information. These statements relate to future events or future performance. The use of any of the words "could", "intend", "expect", "believe", "will", "projected", "estimated" and similar expressions and statements relating to matters that are not historical facts are intended to identify forward-looking information and are based on the Company's current belief or assumptions as to the outcome and timing of such future events. Actual future results may differ materially.
                              </p>
                              <p style={{ fontSize: '11px', lineHeight: 1.6, marginTop: '10px' }}>
                                All statements relating to future plans, objectives or expectations of the Company are forward-looking statements that involve various risks and uncertainties. There can be no assurance that such statements will prove to be accurate and actual results and future events could differ materially from those anticipated in such statements. Important factors that could cause actual results to differ materially from the Company's plans or expectations include risks relating to the actual results of current exploration activities, fluctuating gold prices, possibility of equipment breakdowns and delays, exploration cost overruns, availability of capital and financing, general economic, market or business conditions, regulatory changes, timeliness of government or regulatory approvals and other risks detailed herein and from time to time in the filings made by the Company with securities regulators. The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                              </p>
                              <p style={{ fontSize: '11px', lineHeight: 1.6, marginTop: '10px' }}>
                                The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            Silver Grail Resources Ltd. ("Silver Grail" or "the Company") ("SVG"-TSX-V) announces that it intends to complete a non-brokered private placement consisting of the issuance of up to 2,500,000 units ("Units") at a price of $0.23 per Unit for gross proceeds of up to $575,000 subject to the approval of the TSX Venture Exchange. Each Unit will consist of one common share ("Common Share") and a Common Share purchase warrant ("Warrant"). Each Warrant is exercisable into one Common Share at a price of $0.33 for a period of two years from closing. Silver Grail's share price closed at $0.28 on October 1, 2025.
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            There are no finder's fees or other commissions associated with the transaction. Certain of the Company's insiders may participate in the private placement. The proceeds of the financing will be used to pay for 2025 exploration of the Ram property as well as further exploration of the Company's other mineral properties in the Golden Triangle and also for general corporate purposes.
                          </p>

                          <h3 style={{ 
                            fontSize: '16px',
                            marginTop: '20px',
                            marginBottom: '12px',
                            color: '#0d0f1e',
                            fontWeight: 600
                          }}>
                            Update re Ram Property
                          </h3>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            Drilling is now complete at the Ram property with 2,056 metres having been drilled in seven holes. All of the core has now been logged and diamond sawed and final shipments to the assay lab are expected within the next days. MSALabs has been instructed to hold all assays until such time as the total submittal from the Ram has been completed.
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            During the final days of the drill program, Jeff Kyba, P. Geo., visited the Ram property as well as the Company's Clone, Konkin Silver and Fiji properties. While walking the surface projection of Hole #7, Jeff discovered a new showing of net-textured chalcopyrite (see photo URL below). Also included in the URL section are a number of photos taken by drillers during the program of various select examples of mineralized core.
                          </p>

                          <h3 style={{ 
                            fontSize: '16px',
                            marginTop: '20px',
                            marginBottom: '12px',
                            color: '#0d0f1e',
                            fontWeight: 600
                          }}>
                            URLs
                          </h3>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>
                            <a href="https://teuton.com/Ram2025CorePhotos" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/Ram2025CorePhotos</a> -- Various photos of mineralized core
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            <a href="https://teuton.com/NetTexturedSample" target="_blank" rel="noopener noreferrer" style={{ color: '#5c7ca3', textDecoration: 'underline' }}>https://teuton.com/NetTexturedSample</a> -- Photo of net-textured chalcopyrite
                          </p>

                          <h3 style={{ 
                            fontSize: '16px',
                            marginTop: '20px',
                            marginBottom: '12px',
                            color: '#0d0f1e',
                            fontWeight: 600
                          }}>
                            Qualified Person
                          </h3>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            D. Cremonese, P. Eng., is the QP for Silver Grail Resources Ltd.; as President and CEO of Silver Grail he is not independent of the Company.
                          </p>

                          <h3 style={{ 
                            fontSize: '16px',
                            marginTop: '20px',
                            marginBottom: '12px',
                            color: '#0d0f1e',
                            fontWeight: 600
                          }}>
                            About Silver Grail
                          </h3>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            Silver Grail Resources Ltd. is a junior exploration company with a large portfolio of properties in the southern portion of the Golden Triangle region of British Columbia. Its legacy properties, some more than thirty years old, form large islands within the vast claim holdings of Goliath Resources in this region.
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '10px', fontWeight: 'bold' }}>
                            ON BEHALF OF THE BOARD OF DIRECTORS OF SILVER GRAIL RESOURCES LTD.
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '5px' }}>
                            "Dino Cremonese"
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            Dino Cremonese, P. Eng.,<br />
                            President and Chief Executive Officer
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            <strong>For further information, please visit the Company's website at www.silvergrail.com or contact:</strong>
                          </p>

                          <p style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
                            Barry Holmes<br />
                            Director Corporate Development and Communications<br />
                            Tel. 778-430-5680<br />
                            Email: bholmesmba@gmail.com
                          </p>

                          <p style={{ fontSize: '12px', lineHeight: 1.6, marginBottom: '16px', fontStyle: 'italic' }}>
                            Neither the TSX Venture Exchange nor its Regulation Services Provider (as that term is defined in the policies of the TSX Venture Exchange) accepts responsibility for the adequacy or accuracy of this release.
                          </p>

                          <h4 style={{ fontSize: '13px', marginTop: '16px', marginBottom: '10px', fontWeight: 600 }}>
                            Cautionary Statements regarding Forward-Looking information
                          </h4>

                          <p style={{ fontSize: '12px', lineHeight: 1.6, marginBottom: '10px' }}>
                            Certain statements contained in this press release constitute forward-looking information. These statements relate to future events or future performance. The use of any of the words "could", "intend", "expect", "believe", "will", "projected", "estimated" and similar expressions and statements relating to matters that are not historical facts are intended to identify forward-looking information and are based on the Company's current belief or assumptions as to the outcome and timing of such future events. Actual future results may differ materially.
                          </p>

                          <p style={{ fontSize: '12px', lineHeight: 1.6, marginBottom: '10px' }}>
                            All statements relating to future plans, objectives or expectations of the Company are forward-looking statements that involve various risks and uncertainties. There can be no assurance that such statements will prove to be accurate and actual results and future events could differ materially from those anticipated in such statements. Important factors that could cause actual results to differ materially from the Company's plans or expectations include risks relating to the actual results of current exploration activities, fluctuating gold prices, possibility of equipment breakdowns and delays, exploration cost overruns, availability of capital and financing, general economic, market or business conditions, regulatory changes, timeliness of government or regulatory approvals and other risks detailed herein and from time to time in the filings made by the Company with securities regulators. The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                          </p>

                          <p style={{ fontSize: '12px', lineHeight: 1.6, marginBottom: '16px' }}>
                            The Company expressly disclaims any intention or obligation to update or revise any forward-looking statements whether as a result of new information, future events or otherwise except as otherwise required by applicable securities legislation.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
      
      {/* Custom scrollbar styles for the modal */}
      <style jsx global>{`
        /* Show scrollbar for news release content */
        .news-release-scroll::-webkit-scrollbar {
          width: 8px;
        }
        
        .news-release-scroll::-webkit-scrollbar-track {
          background: rgba(13, 15, 30, 0.1);
          border-radius: 4px;
        }
        
        .news-release-scroll::-webkit-scrollbar-thumb {
          background: rgba(13, 15, 30, 0.3);
          border-radius: 4px;
        }
        
        .news-release-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(13, 15, 30, 0.5);
        }
        
        /* Firefox scrollbar */
        .news-release-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(13, 15, 30, 0.3) rgba(13, 15, 30, 0.1);
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .news-modal-content > div:first-child::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .news-modal-content > div:first-child {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Custom scrollbar track inside the modal */
        .custom-scrollbar {
          position: absolute;
          right: 8px;
          top: 60px;
          bottom: 20px;
          width: 6px;
          background: rgba(13, 15, 30, 0.1);
          border-radius: 3px;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .news-modal-content:hover .custom-scrollbar {
          opacity: 1;
        }
        
        /* Custom scrollbar thumb */
        .custom-scrollbar-thumb {
          position: absolute;
          width: 100%;
          background: rgba(13, 15, 30, 0.4);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar-thumb:hover {
          background: rgba(13, 15, 30, 0.6);
        }
        
        /* Prevent body scroll when modal is open */
        @media (max-width: 767px) {
          body.modal-open {
            position: fixed !important;
            width: 100% !important;
          }
        }
        
        /* iOS scroll fix */
        @supports (-webkit-touch-callout: none) {
          .news-modal-content,
          [style*="overflow-y: auto"],
          [style*="overflowY: auto"] {
            -webkit-overflow-scrolling: touch !important;
            touch-action: pan-y !important;
            scroll-behavior: smooth !important;
          }
        }
      `}</style>
    </>
  )
}

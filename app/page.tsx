'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import TickerSwitcher from '@/components/landing/TickerSwitcher'

// Lazy load heavy components for better performance
const StrategicLocationMap = dynamic(() => import('@/components/landing/StrategicLocationMap'), {
  ssr: false
})

const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'low'>('auto')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [videoCanPlay, setVideoCanPlay] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Set dynamic viewport height for mobile
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setViewportHeight()
    window.addEventListener('resize', setViewportHeight)
    window.addEventListener('orientationchange', setViewportHeight)

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    // Check device performance
    const checkPerformance = () => {
      const memory = (navigator as any).deviceMemory
      const connection = (navigator as any).connection

      if (memory && memory < 4) {
        setPerformanceMode('low')
      } else if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
        setPerformanceMode('low')
      }
    }

    checkPerformance()

    // Set dark theme
    document.documentElement.setAttribute('data-header-theme', 'dark')

    // Hide the global header and footer on this page
    const header = document.querySelector('header')
    const footer = document.querySelector('footer')
    if (header) header.style.display = 'none'
    if (footer) footer.style.display = 'none'

    // Optimize font loading
    if ('fonts' in document) {
      Promise.all([
        (document as any).fonts.load('1em Aeonik Extended'),
        (document as any).fonts.load('1em Switzer Variable'),
        (document as any).fonts.load('500 1em Aeonik Medium')
      ]).then(() => {
        setIsLoaded(true)
      }).catch(() => {
        setTimeout(() => setIsLoaded(true), 500)
      })
    } else {
      setIsLoaded(true)
    }

    // Start video after map animation completes (approximately 5 seconds)
    const videoTimer = setTimeout(() => {
      setVideoCanPlay(true)
      if (videoRef.current) {
        videoRef.current.play()
      }
    }, 5000)

    return () => {
      document.documentElement.removeAttribute('data-header-theme')
      const header = document.querySelector('header')
      const footer = document.querySelector('footer')
      if (header) header.style.display = ''
      if (footer) footer.style.display = ''
      mediaQuery.removeEventListener('change', handleChange)
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
      clearTimeout(videoTimer)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Hide global header completely on landing page */
        header {
          display: none !important;
        }

        /* Dark background for landing page */
        html, body, #__next, main {
          background-color: #080a14 !important;
        }

        * {
          background-color: transparent;
        }

        /* Prevent scrolling */
        body, html {
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
        }

        main {
          flex: none !important;
          height: 100vh !important;
          height: calc(var(--vh, 1vh) * 100) !important;
          overflow: hidden !important;
        }

        .flex.min-h-screen {
          min-height: 100vh !important;
          height: 100vh !important;
          height: calc(var(--vh, 1vh) * 100) !important;
          overflow: hidden !important;
        }

        /* Performance optimizations */
        .hero-panel * {
          backface-visibility: hidden;
        }

        /* Silver shimmer animation for logo */
        @keyframes silverShimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .logo-shimmer {
          position: relative;
          display: inline-block;
        }

        .logo-shimmer-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 30%,
            rgba(220, 230, 240, 0.7) 45%,
            rgba(255, 255, 255, 0.9) 50%,
            rgba(200, 210, 220, 0.7) 55%,
            rgba(255, 255, 255, 0) 70%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: silverShimmer 4s ease-in-out infinite;
          pointer-events: none;
          mask-image: url('/images/teuton-logo.svg');
          mask-size: contain;
          mask-repeat: no-repeat;
          mask-position: center;
          -webkit-mask-image: url('/images/teuton-logo.svg');
          -webkit-mask-size: contain;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
        }
      `}</style>

      {/* Full viewport video background */}
      <div
        className="fixed inset-0 w-full h-full overflow-hidden"
        style={{
          backgroundColor: '#080a14',
        }}
      >
        {/* Video Background */}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster="/images/ramflyover-first-frame.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: videoCanPlay ? 'brightness(0.6)' : 'brightness(0.25)',
            transition: 'filter 1.5s ease-in-out',
            backgroundColor: '#080a14',
          }}
          onLoadedData={(e) => {
            // Ensure first frame is visible
            e.currentTarget.currentTime = 0
          }}
          onEnded={(e) => {
            const video = e.currentTarget
            video.currentTime = video.duration
            video.pause()
          }}
        >
          <source src="/videos/ramflyover.webm" type="video/webm" />
        </video>

        {/* Dark overlay - fades out when video starts */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(145deg, rgba(8, 10, 20, 0.7) 0%, rgba(10, 12, 24, 0.8) 40%, rgba(6, 8, 16, 0.7) 100%)',
            opacity: videoCanPlay ? 0 : 1,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />

        {/* Persistent subtle overlay for contrast */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(145deg, rgba(8, 10, 20, 0.3) 0%, rgba(10, 12, 24, 0.35) 40%, rgba(6, 8, 16, 0.3) 100%)',
          }}
        />

        {/* Dark blue overlay for sky area at top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(10, 20, 45, 0.7) 0%, rgba(10, 20, 45, 0.4) 15%, transparent 35%)',
          }}
        />

        {/* Gold dust particles */}
        {performanceMode !== 'low' && !reducedMotion && (
          <Suspense fallback={null}>
            <GoldDustParticles />
          </Suspense>
        )}

        {/* Navigation Bar - Above the floating panel */}
        <div
          className="absolute z-50 w-full flex justify-center"
          style={{
            top: 'clamp(8px, 1vw, 12px)',
            paddingLeft: 'clamp(8px, 1vw, 12px)',
            paddingRight: 'clamp(8px, 1vw, 12px)',
          }}
        >
          <motion.nav
            className="flex items-center justify-between px-6 py-4 w-full max-w-[1600px]"
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: isLoaded ? 1 : 0,
              y: isLoaded ? 0 : -20
            }}
            transition={{
              duration: reducedMotion ? 0 : 0.8,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="relative h-[44px] w-[185px] md:h-[52px] md:w-[215px] logo-shimmer"
              >
                <img
                  src="/images/teuton-logo.svg"
                  alt="Teuton Resources"
                  className="relative z-10 w-full h-full object-contain"
                  style={{
                    filter: 'brightness(0) invert(1)',
                    transition: 'filter 1.5s ease-in-out',
                  }}
                />
                <div className="logo-shimmer-overlay" />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {['About', 'Properties', 'Investors', 'News', 'Contact'].map((item) => (
                <button
                  key={item}
                  className="relative px-5 py-2 rounded-full transition-all duration-200"
                  style={{
                    fontFamily: "'Aeonik', sans-serif",
                    fontSize: '13px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Ticker */}
            <div className="hidden lg:flex items-center">
              <TickerSwitcher />
            </div>
          </motion.nav>
        </div>

        {/* Floating Hero Panel - Below the nav */}
        <motion.div
          className="hero-panel absolute inset-0 flex flex-col items-center"
          style={{
            paddingTop: 'calc(clamp(8px, 1vw, 12px) + 90px)',
            paddingLeft: 'clamp(8px, 1vw, 12px)',
            paddingRight: 'clamp(8px, 1vw, 12px)',
            paddingBottom: 'clamp(8px, 1vw, 12px)',
            gap: 'clamp(12px, 1.5vw, 20px)',
          }}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            y: isLoaded ? 0 : 30,
            scale: isLoaded ? 1 : 0.98
          }}
          transition={{
            duration: reducedMotion ? 0 : 1,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          {/* The Floating Panel */}
          <div
            className="relative w-[98%] flex-1 max-w-[1600px] flex flex-col overflow-hidden"
            style={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(20, 45, 80, 0.95) 50%, rgba(15, 35, 65, 0.92) 100%)',
              backdropFilter: 'blur(40px) saturate(150%)',
              WebkitBackdropFilter: 'blur(40px) saturate(150%)',
              border: '0.5px solid rgba(100, 160, 220, 0.45)',
              boxShadow: `
                0 0 0 0.5px rgba(80, 140, 200, 0.3),
                0 0 20px rgba(60, 120, 180, 0.2),
                0 0 40px rgba(80, 140, 200, 0.15),
                0 0 80px rgba(100, 160, 220, 0.1),
                0 40px 120px rgba(0, 0, 0, 0.5),
                0 20px 60px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(120, 180, 240, 0.25)
              `,
            }}
          >
            {/* Top edge highlight - blue */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(100, 180, 255, 0.6) 20%, rgba(140, 200, 255, 0.8) 50%, rgba(100, 180, 255, 0.6) 80%, transparent 100%)',
              }}
            />

            {/* Left edge highlight - blue */}
            <div
              className="absolute top-0 left-0 bottom-0 w-px pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(100, 180, 255, 0.5) 0%, rgba(140, 200, 255, 0.18) 50%, rgba(100, 180, 255, 0.5) 100%)',
              }}
            />

            {/* Right edge highlight - blue */}
            <div
              className="absolute top-0 right-0 bottom-0 w-px pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(100, 180, 255, 0.5) 0%, rgba(140, 200, 255, 0.18) 50%, rgba(100, 180, 255, 0.5) 100%)',
              }}
            />

            {/* Map Content Area */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{
                transform: 'translate3d(0,0,0)',
                isolation: 'isolate',
                contain: 'layout paint',
                borderRadius: '16px',
              }}
            >
              <Suspense fallback={
                <div className="absolute inset-0 bg-[#0d1a2a] flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#64B4FF] border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <StrategicLocationMap
                  hideHeadline={false}
                  hideMobileNav={true}
                  useTeutonLogo={true}
                  onMapInteraction={() => {
                    if (videoRef.current && !videoRef.current.paused) {
                      videoRef.current.pause()
                    }
                  }}
                />
              </Suspense>
            </div>

            {/* Bottom edge subtle glow - blue */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(100, 180, 255, 0.45) 20%, rgba(140, 200, 255, 0.6) 50%, rgba(100, 180, 255, 0.45) 80%, transparent 100%)',
              }}
            />
          </div>

          {/* Bottom Spacer - maintains padding */}
          <div style={{ height: 'clamp(40px, 5vw, 60px)' }} />
        </motion.div>

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
      </div>
    </>
  )
}

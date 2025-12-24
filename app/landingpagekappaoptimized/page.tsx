'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Lazy load heavy components
const StrategicLocationMap = dynamic(() => import('@/components/landing/StrategicLocationMapOptimized'), {
  loading: () => <MapLoadingState />,
  ssr: false
})

const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

// Optimized loading state
function MapLoadingState() {
  return (
    <div className="absolute inset-0 bg-[#1C1C1C] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-[#FFFF77] border-opacity-20 rounded-full animate-ping" />
          <div className="absolute inset-0 border-4 border-[#FFFF77] border-opacity-40 rounded-full animate-ping animation-delay-200" />
          <div className="absolute inset-0 border-4 border-[#FFFF77] border-opacity-60 rounded-full animate-ping animation-delay-400" />
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-[#FFFF77]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.235V18.11a3 3 0 001.664-5.336 3 3 0 001.336-2.774v-.001A3 3 0 0015 7m-6 0v.01M12 20v-2m0-12V4" />
            </svg>
          </div>
        </div>
        <h2 className="text-[#FFFF77] text-xl font-medium mb-2">Loading Golden Triangle</h2>
        <p className="text-gray-400 text-sm">Preparing your exploration experience...</p>
      </div>
    </div>
  )
}

export default function LandingPageKappaOptimized() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'low'>('auto')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    // Check device performance
    const checkPerformance = () => {
      // Check for low-end device indicators
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
    
    // Hide footer on this page
    const footer = document.querySelector('footer')
    if (footer) {
      footer.style.display = 'none'
    }
    
    // Optimize font loading
    if ('fonts' in document) {
      Promise.all([
        (document as any).fonts.load('1em Aeonik Extended'),
        (document as any).fonts.load('1em Switzer Variable'),
        (document as any).fonts.load('500 1em Aeonik Medium')
      ]).then(() => {
        setIsLoaded(true)
      }).catch(() => {
        // Fallback if fonts fail to load
        setTimeout(() => setIsLoaded(true), 500)
      })
    } else {
      setIsLoaded(true)
    }
    
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
      const footer = document.querySelector('footer')
      if (footer) {
        footer.style.display = ''
      }
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Optimized styles with performance improvements */
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        /* Optimize header appearance */
        header {
          opacity: 0;
          transition: opacity 0.3s ease;
          will-change: opacity;
        }
        
        /* Remove white background on landing page */
        body {
          background-color: #1C1C1C !important;
          overflow: hidden !important;
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        /* Prevent scrolling on html element */
        html {
          overflow: hidden !important;
          height: 100% !important;
        }
        
        /* Ensure main container doesn't add extra space */
        main {
          flex: none !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        /* Remove min-height from parent container */
        .flex.min-h-screen {
          min-height: 100vh !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        /* Mobile specific fixes */
        @media (max-width: 768px) {
          body, html {
            touch-action: none !important;
            -webkit-overflow-scrolling: touch !important;
          }
          
          .landing-kappa-loading {
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
          }
        }
        
        /* Reduce repaints for animations */
        .landing-kappa-loading * {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Optimize touch targets for mobile */
        @media (max-width: 768px) {
          button, a, [role="button"], .clickable {
            min-height: 48px !important;
            min-width: 48px !important;
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px !important;
          }
          
          /* Ensure Mapbox attribution links are accessible */
          .mapboxgl-ctrl-attrib a {
            padding: 8px !important;
            margin: 4px !important;
            display: inline-block !important;
            min-height: 48px !important;
            line-height: 32px !important;
          }
          
          /* Fix navigation items */
          nav a, nav button {
            padding: 14px 20px !important;
            margin: 0 4px !important;
          }
          
          /* Fix header buttons */
          header button {
            min-width: 48px !important;
            min-height: 48px !important;
          }
          
          /* Expand click areas with pseudo elements */
          button::after, a::after, [role="button"]::after {
            content: '';
            position: absolute;
            top: -8px;
            right: -8px;
            bottom: -8px;
            left: -8px;
            z-index: -1;
          }
        }
        
        /* Text sizing optimized for visual aesthetics */
        @media (max-width: 768px) {
          /* Balanced text sizing for better visual hierarchy */
          html, body {
            font-size: 16px !important;
            line-height: 1.6 !important;
          }
          
          /* Property descriptions with elegant sizing */
          .property-description {
            font-size: 15px !important;
            line-height: 1.65 !important;
          }
        }
          .mapboxgl-popup-content {
            font-size: 16px !important;
            line-height: 1.6 !important;
          }
        }
        
        /* Optimize for high DPI screens */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .map-container {
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>
      
      <div className="fixed inset-0 w-full h-full landing-kappa-loading overflow-hidden">
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#FFFF77] text-black px-4 py-2 rounded-md font-medium z-50"
        >
          Skip to main content
        </a>
        
        {/* Performance mode toggle for users */}
        <AnimatePresence>
          {isLoaded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 z-50 hidden md:block"
            >
              <button
                onClick={() => {
                  const modes: Array<'auto' | 'high' | 'low'> = ['auto', 'high', 'low']
                  const currentIndex = modes.indexOf(performanceMode)
                  const nextIndex = (currentIndex + 1) % modes.length
                  setPerformanceMode(modes[nextIndex])
                }}
                className="bg-black/50 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2 text-xs text-white/80 hover:text-white hover:border-white/40 transition-all"
                aria-label={`Performance mode: ${performanceMode}`}
              >
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Performance: {performanceMode}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Conditionally render particles based on performance */}
        {performanceMode !== 'low' && !reducedMotion && (
          <Suspense fallback={null}>
            <GoldDustParticles />
          </Suspense>
        )}
        
        {/* Main Section: Strategic Location - Satellite Map */}
        <motion.section 
          id="main-content"
          className="absolute inset-0 w-full h-full bg-[#1C1C1C] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1 }}
        >
          <Suspense fallback={<MapLoadingState />}>
            <StrategicLocationMap />
          </Suspense>
          
          {/* Improved mobile hint overlay */}
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="absolute bottom-24 left-0 right-0 flex justify-center md:hidden pointer-events-none"
              >
                <div className="bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#FFFF77] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span className="text-white text-sm font-medium">Tap properties to explore</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
      </div>
    </>
  )
}


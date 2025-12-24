'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

// Use the working StrategicLocationMap pattern but create teaser version
const TeaserStrategicLocationMap = dynamic(() => import('@/components/landing/TeaserStrategicLocationMap'), {
  ssr: false
})

const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

export default function TeaserHome() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'low'>('auto')
  const [reducedMotion, setReducedMotion] = useState(false)

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
    
    // Optimize font loading - FORCE LOAD SPECIFIC FONTS (Enhanced from previous session)
    if ('fonts' in document) {
      // Load the exact fonts we need
      const fontPromises = [
        (document as any).fonts.load('700 1em "Aeonik Extended"'),  // Mobile heading
        (document as any).fonts.load('200 1em "Aeonik Light"'),     // Desktop heading
        (document as any).fonts.load('400 1em "Switzer Variable"'),
        (document as any).fonts.load('500 1em "Aeonik Medium"')
      ]
      
      Promise.all(fontPromises).then(() => {
        console.log('Fonts loaded successfully!')
        // Check which fonts are actually available
        document.fonts.forEach((font: any) => {
          console.log(`Available font: ${font.family} - Weight: ${font.weight} - Status: ${font.status}`)
        })
        setIsLoaded(true)
      }).catch((err) => {
        console.error('Font loading error:', err)
        // Fallback if fonts fail to load
        setTimeout(() => setIsLoaded(true), 500)
      })
    } else {
      setIsLoaded(true)
    }
    
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
      // Restore footer when leaving the page
      const footer = document.querySelector('footer')
      if (footer) {
        footer.style.display = ''
      }
      mediaQuery.removeEventListener('change', handleChange)
      window.removeEventListener('resize', setViewportHeight)
      window.removeEventListener('orientationchange', setViewportHeight)
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Hide header initially to prevent flash */
        header {
          opacity: 0;
          transition: opacity 0.3s ease;
          will-change: opacity;
        }
        
        /* Remove white background on landing page */
        body {
          background-color: #1C1C1C !important;
        }
        
        /* Desktop only - prevent scrolling */
        @media (min-width: 768px) {
          body {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
          }
          
          html {
            overflow: hidden !important;
            height: 100% !important;
          }
          
          main {
            flex: none !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
          
          .flex.min-h-screen {
            min-height: 100vh !important;
            height: 100vh !important;
            overflow: hidden !important;
          }
        }
        
        /* Mobile specific fixes */
        @media (max-width: 767px) {
          /* Use dynamic viewport height */
          body {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: calc(var(--vh, 1vh) * 100) !important;
          }
          
          main {
            flex: none !important;
            height: calc(var(--vh, 1vh) * 100) !important;
            overflow: hidden !important;
          }
          
          .landing-kappa-loading {
            height: calc(var(--vh, 1vh) * 100) !important;
            max-height: calc(var(--vh, 1vh) * 100) !important;
          }
        }
        
        /* Performance optimizations */
        .landing-kappa-loading * {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Optimize for high DPI screens */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .map-container {
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>
      <div className="fixed inset-0 w-full h-full landing-kappa-loading overflow-hidden">
        {/* Conditionally render particles based on performance */}
        {performanceMode !== 'low' && !reducedMotion && (
          <Suspense fallback={null}>
            <GoldDustParticles />
          </Suspense>
        )}
        
        {/* Main Section: Strategic Location - Satellite Map */}
        <motion.section 
          className="absolute inset-0 w-full h-full bg-[#1C1C1C] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 1 }}
        >
          <Suspense fallback={<div className="absolute inset-0 bg-[#1C1C1C]" />}>
            <TeaserStrategicLocationMap />
          </Suspense>
          
          {/* Title overlay removed - text is already in the map component */}
        </motion.section>

        {/* Preload critical resources */}
        <link rel="preconnect" href="https://api.mapbox.com" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
      </div>
    </>
  )
}
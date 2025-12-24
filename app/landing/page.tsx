'use client'

import { useState, useEffect, useRef } from 'react'
import { Metadata } from 'next'
import LandingHeroV2 from '@/components/landing/LandingHeroV2'
import LandingProperties from '@/components/landing/LandingProperties'
import LandingTickerLiquidGlass from '@/components/landing/LandingTickerLiquidGlass'
import LandingStory from '@/components/landing/LandingStory'
import LandingFeaturesV2 from '@/components/landing/LandingFeaturesV2'
import LandingGoldenTriangle from '@/components/landing/LandingGoldenTriangle'
import LandingInteractive from '@/components/landing/LandingInteractive'
import LandingShowcase from '@/components/landing/LandingShowcase'
import LandingTimeline from '@/components/landing/LandingTimeline'
import LandingInvestors from '@/components/landing/LandingInvestors'
import LandingFAQ from '@/components/landing/LandingFAQ'
import LandingCTAV2 from '@/components/landing/LandingCTAV2'
import LandingGravitationalPull from '@/components/landing/LandingGravitationalPull'
import LandingClaimBoundaries from '@/components/landing/LandingClaimBoundariesV3'

export default function LandingPage() {
  const [headerTheme, setHeaderTheme] = useState<'light' | 'dark'>('light')
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionName, setSectionName] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const propertiesRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const gravitationalRef = useRef<HTMLDivElement>(null)
  const claimBoundariesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)
  const lastScrollTime = useRef(0)
  const scrollThreshold = 800 // Minimum time between section changes in ms

  // Track which section is in view for header theme
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      
      const scrollTop = containerRef.current.scrollTop
      const heroHeight = heroRef.current?.offsetHeight || 0
      const propertiesHeight = propertiesRef.current?.offsetHeight || 0
      const storyHeight = storyRef.current?.offsetHeight || 0
      const gravitationalHeight = gravitationalRef.current?.offsetHeight || 0
      const claimBoundariesHeight = claimBoundariesRef.current?.offsetHeight || 0
      
      // Determine current section based on scroll position
      if (scrollTop < heroHeight * 0.5) {
        setCurrentSection(0)
        setHeaderTheme('light')
        setSectionName('')
      } else if (scrollTop < heroHeight + propertiesHeight * 0.5) {
        setCurrentSection(1)
        setHeaderTheme('dark')
        setSectionName('properties')
      } else if (scrollTop < heroHeight + propertiesHeight + storyHeight * 0.5) {
        setCurrentSection(2)
        setHeaderTheme('light')
        setSectionName('story')
      } else if (scrollTop < heroHeight + propertiesHeight + storyHeight + gravitationalHeight * 0.5) {
        setCurrentSection(3)
        setHeaderTheme('dark')
        setSectionName('gravitational')
      } else if (scrollTop < heroHeight + propertiesHeight + storyHeight + gravitationalHeight + claimBoundariesHeight * 0.5) {
        setCurrentSection(4)
        setHeaderTheme('light')
        setSectionName('boundaries')
      } else {
        setCurrentSection(5)
        setHeaderTheme('light')
        setSectionName('')
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll() // Check initial position
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Pass theme and section to header through data attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-header-theme', headerTheme)
  }, [headerTheme])
  
  useEffect(() => {
    document.documentElement.setAttribute('data-current-section', sectionName)
  }, [sectionName])

  // Handle scroll snapping
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout | null = null
    let accumulatedDelta = 0

    const handleWheel = (e: WheelEvent) => {
      const heroHeight = heroRef.current?.offsetHeight || 0
      const propertiesHeight = propertiesRef.current?.offsetHeight || 0
      const storyHeight = storyRef.current?.offsetHeight || 0
      const gravitationalHeight = gravitationalRef.current?.offsetHeight || 0
      const claimBoundariesHeight = claimBoundariesRef.current?.offsetHeight || 0
      const scrollTop = container.scrollTop
      
      // Define snap zones
      const inHeroZone = scrollTop < heroHeight * 0.9
      const inPropertiesZone = scrollTop >= heroHeight * 0.9 && scrollTop < heroHeight + propertiesHeight * 0.9
      const inStoryZone = scrollTop >= heroHeight + propertiesHeight * 0.9 && scrollTop < heroHeight + propertiesHeight + storyHeight * 0.9
      const inGravitationalZone = scrollTop >= heroHeight + propertiesHeight + storyHeight * 0.9 && scrollTop < heroHeight + propertiesHeight + storyHeight + gravitationalHeight * 0.9
      const inClaimBoundariesZone = scrollTop >= heroHeight + propertiesHeight + storyHeight + gravitationalHeight * 0.9 && scrollTop < heroHeight + propertiesHeight + storyHeight + gravitationalHeight + claimBoundariesHeight * 0.9
      const inContentZone = scrollTop >= heroHeight + propertiesHeight + storyHeight + gravitationalHeight + claimBoundariesHeight * 0.9
      
      // Check if story section wants to handle scroll
      const storySection = storyRef.current
      const storyScrollComplete = storySection?.getAttribute('data-scroll-complete') === 'true'
      
      // If in story zone and story is not complete, let the story handle scrolling
      if (inStoryZone && !storyScrollComplete && e.deltaY > 0) {
        return // Let the story section handle internal scroll
      }
      
      // Allow normal scrolling in content section
      if (inContentZone) {
        return
      }
      
      // Always prevent default in snap zones
      if (inHeroZone || inPropertiesZone || inStoryZone || inGravitationalZone || inClaimBoundariesZone) {
        e.preventDefault()
      }
      
      // If already scrolling, just prevent default
      if (isScrolling.current) {
        return
      }
      
      // Accumulate scroll delta
      accumulatedDelta += e.deltaY
      
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      
      // Set new timeout to handle scroll
      scrollTimeout = setTimeout(() => {
        const direction = accumulatedDelta > 0 ? 1 : -1
        let targetScroll: number | null = null
        
        // Only trigger if accumulated delta is significant (prevents tiny scrolls)
        if (Math.abs(accumulatedDelta) > 50) {
          if (inHeroZone && direction === 1) {
            targetScroll = heroHeight
          } else if (inPropertiesZone && direction === -1) {
            targetScroll = 0
          } else if (inPropertiesZone && direction === 1) {
            targetScroll = heroHeight + propertiesHeight
          } else if (inStoryZone && direction === -1) {
            targetScroll = heroHeight + propertiesHeight
          } else if (inStoryZone && direction === 1 && storyScrollComplete) {
            targetScroll = heroHeight + propertiesHeight + storyHeight
          } else if (inGravitationalZone && direction === -1) {
            targetScroll = heroHeight + propertiesHeight + storyHeight
          } else if (inGravitationalZone && direction === 1) {
            targetScroll = heroHeight + propertiesHeight + storyHeight + gravitationalHeight
          } else if (inClaimBoundariesZone && direction === -1) {
            targetScroll = heroHeight + propertiesHeight + storyHeight + gravitationalHeight
          } else if (inClaimBoundariesZone && direction === 1) {
            targetScroll = heroHeight + propertiesHeight + storyHeight + gravitationalHeight + claimBoundariesHeight
          }
          
          if (targetScroll !== null) {
            isScrolling.current = true
            
            container.scrollTo({
              top: targetScroll,
              behavior: 'smooth'
            })
            
            // Wait for scroll to complete
            setTimeout(() => {
              isScrolling.current = false
            }, 1200)
          }
        }
        
        // Reset accumulated delta
        accumulatedDelta = 0
      }, 100) // Small delay to accumulate scroll events
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden"
    >
      {/* Hero section */}
      <div 
        ref={heroRef}
        className="min-h-screen"
      >
        <LandingHeroV2 />
      </div>
      
      {/* Properties section */}
      <div 
        ref={propertiesRef}
        className="min-h-screen"
      >
        <LandingProperties />
      </div>
      
      {/* Story section */}
      <div 
        ref={storyRef}
        className="min-h-screen"
      >
        <LandingStory />
      </div>
      
      {/* Gravitational Pull of Giants section */}
      <div 
        ref={gravitationalRef}
        className="min-h-screen"
      >
        <LandingGravitationalPull />
      </div>
      
      {/* Claim Boundaries section */}
      <div 
        ref={claimBoundariesRef}
        className="min-h-screen"
      >
        <LandingClaimBoundaries />
      </div>
      
      {/* Rest of the content */}
      <div 
        ref={contentRef}
        className="bg-background"
      >
        <LandingTickerLiquidGlass />
        <LandingFeaturesV2 />
        <LandingGoldenTriangle />
        <LandingInteractive />
        <LandingShowcase />
        <LandingTimeline />
        <LandingInvestors />
        <LandingFAQ />
        <LandingCTAV2 />
      </div>
    </div>
  )
}
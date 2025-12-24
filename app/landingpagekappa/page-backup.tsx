'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import LiquidMetalGradient from '@/components/landing/LiquidMetalGradient'
import GlassmorphicPyramid from '@/components/landing/GlassmorphicPyramid'
import PyramidInterior from '@/components/landing/PyramidInterior'

export default function LandingPageKappa() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [tutVisible, setTutVisible] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false)
  const [transitionComplete, setTransitionComplete] = useState(false)
  const [pyramidZoom, setPyramidZoom] = useState(0) // 0 to 1 for zoom animation
  const [showPyramidInterior, setShowPyramidInterior] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Motion values for mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const startTransition = () => {
    setHasStartedScrolling(true)
    // Animate the transition over time
    const duration = 3000 // 3 seconds
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setTransitionProgress(progress)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        // Transition complete
        setTransitionComplete(true)
        console.log('Transition complete - enabling scroll')
        // Re-enable body scrolling
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        // Ensure scroll is at the top of the first section
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = 0
        }
      }
    }
    
    requestAnimationFrame(animate)
  }

  // Initial setup
  useEffect(() => {
    setIsLoaded(true)
    // Set dark theme for enhanced logo visibility
    document.documentElement.setAttribute('data-header-theme', 'dark')
    
    // Prevent scrolling on body and html immediately
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.width = '100%'
    
    // Show King Tut after a delay
    const timer = setTimeout(() => {
      setTutVisible(true)
    }, 1500)
    
    // Cleanup on unmount
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      clearTimeout(timer)
    }
  }, [])

  // Separate useEffect for wheel handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only prevent default if transition is not complete
      if (!transitionComplete) {
        e.preventDefault()
        
        // Don't allow scrolling until King Tut is visible
        if (!tutVisible) {
          return
        }
        
        // Start transition on scroll if not already started
        if (!hasStartedScrolling && e.deltaY > 0) {
          startTransition()
        }
      }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [hasStartedScrolling, tutVisible, transitionComplete])
  
  
  // Handle wheel for pyramid zoom effect
  useEffect(() => {
    if (!transitionComplete) return
    
    let zoomVelocity = 0
    let animationFrameId: number
    
    const handleWheel = (e: WheelEvent) => {
      if (showPyramidInterior) return // Already zoomed in
      
      // Zoom in on scroll down
      if (e.deltaY > 0 && pyramidZoom < 1) {
        e.preventDefault()
        zoomVelocity = Math.min(0.02, e.deltaY * 0.0001)
      }
    }
    
    const animate = () => {
      if (zoomVelocity > 0 && pyramidZoom < 1) {
        const newZoom = Math.min(1, pyramidZoom + zoomVelocity)
        setPyramidZoom(newZoom)
        
        // Show interior when zoom is complete
        if (newZoom >= 0.98) {
          setShowPyramidInterior(true)
          zoomVelocity = 0
        }
        
        // Decay velocity
        zoomVelocity *= 0.95
        if (zoomVelocity < 0.001) zoomVelocity = 0
      }
      
      if (zoomVelocity > 0) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [transitionComplete, pyramidZoom, showPyramidInterior])
  

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    
    mouseX.set((x - 0.5) * 2)
    mouseY.set((y - 0.5) * 2)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }


  return (
    <div className="relative h-screen overflow-hidden">
        
        {/* Golden Sky Background - Shows through transition */}
      <div className="fixed inset-0 w-full h-screen" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#8E621D] via-[#C6790C] to-[#E98900]" />
        {/* Darkening overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/30"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: transitionProgress > 0.9 ? 1 : 0
          }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* Properties Section - Positioned behind, revealed by zoom */}
      <motion.div 
        className="fixed inset-0"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showPyramidInterior ? 1 : 0,
          pointerEvents: showPyramidInterior ? 'auto' : 'none'
        }}
        transition={{ duration: 0.5 }}
        style={{ zIndex: 5 }}
      >
        {showPyramidInterior && <PyramidInterior />}
      </motion.div>

      {/* Scrollable container for pyramid section - fades in as transition completes */}
      <motion.div 
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: transitionProgress > 0.7 ? 1 : 0,
          pointerEvents: transitionComplete && !showPyramidInterior ? 'auto' : 'none'
        }}
        transition={{ duration: 0.5 }}
        style={{ 
          zIndex: 10,
          height: '100vh',
          width: '100vw'
        }}
      >
        {/* Section 1: Two World-Class Systems */}
        <motion.section 
          className="relative h-screen w-full" 
          style={{ 
            zIndex: 1,
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
          animate={{
            perspectiveOrigin: `50% ${50 - pyramidZoom * 20}%`
          }}
        >
            {/* Desert background image */}
            <motion.div 
              className="absolute inset-0 w-full h-full"
              animate={{
                scale: 1 + pyramidZoom * 0.5,
                filter: `blur(${pyramidZoom * 8}px)`
              }}
              style={{
                backgroundImage: 'url(/images/desert2.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                transformOrigin: 'center center'
              }}
            />
            
            {/* Gradient overlay for atmosphere */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-[#8E621D]/20 via-[#C6790C]/30 to-[#E98900]/40"
              animate={{
                opacity: 1 - pyramidZoom * 0.5
              }}
            />
            
            {/* Darkening overlay that fades in after transition */}
            <motion.div 
              className="absolute inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: transitionProgress > 0.9 ? (1 - pyramidZoom * 0.3) : 0
              }}
              transition={{ duration: 0.6 }}
            />
          
          {/* 3D Glassmorphic Pyramid - Full width with zoom */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: transitionProgress > 0.85 ? (1 - pyramidZoom) : 0
            }}
            transition={{ duration: pyramidZoom > 0 ? 0.1 : 1 }}
            style={{
              perspective: '1000px',
              transformStyle: 'preserve-3d',
              transform: `translateZ(${pyramidZoom * 2000}px) scale(${1 + pyramidZoom * 3})`
            }}
          >
            <GlassmorphicPyramid shouldStartRivers={transitionProgress > 0.9} />
          </motion.div>
          
          <div className="absolute inset-0">
            {/* Main heading with subheading - positioned to the left */}
            <motion.div 
              className="absolute left-8 top-1/2 -translate-y-1/2 max-w-2xl"
              animate={{ 
                opacity: 1 - pyramidZoom,
                scale: 1 - pyramidZoom * 0.3,
                filter: `blur(${pyramidZoom * 5}px)`
              }}
            >
              <motion.h2 
                className="text-5xl text-white font-bold relative z-10 mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: transitionProgress > 0.8 ? 1 : 0,
                  scale: transitionProgress > 0.8 ? 1 : 0.9
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  textShadow: '0 4px 40px rgba(139,69,19,0.8), 0 0 80px rgba(139,69,19,0.5)',
                  fontFamily: 'Georgia, serif'
                }}
              >
                Two World-Class Systems.<br />One Massive Opportunity.
              </motion.h2>
              <motion.p
                className="text-3xl text-white/90 font-light italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: transitionProgress > 0.82 ? 1 : 0,
                  y: transitionProgress > 0.82 ? 0 : 20
                }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  textShadow: '0 2px 20px rgba(0,0,0,0.8)',
                  fontFamily: 'Georgia, serif'
                }}
              >
                The last big canvas in a masterpiece district.
              </motion.p>
            </motion.div>
              
            {/* Powerful Typing Text - Right Side */}
            <motion.div 
              className="absolute right-[3%] top-[12%] bottom-[18%] w-[40%] flex items-center pointer-events-auto"
              animate={{ 
                opacity: 1 - pyramidZoom,
                scale: 1 - pyramidZoom * 0.3,
                filter: `blur(${pyramidZoom * 5}px)`
              }}
            >
              <motion.div
                className="w-full text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: transitionProgress > 0.85 ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Line 1: Hectares */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="overflow-hidden inline-block">
                    <motion.div 
                      className="text-6xl lg:text-7xl font-bold text-[#FFD700]"
                      style={{ textShadow: '0 0 40px rgba(255,215,0,0.4)' }}
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                    >
                      20,481
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-xl text-white/70 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                  >
                    HECTARES IN BC'S GOLDEN TRIANGLE
                  </motion.div>
                </motion.div>

                {/* Line 2: Geological Features */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
                >
                  <div className="text-lg text-white/60 mb-2">BISECTED BY</div>
                  <div className="space-y-2">
                    <div className="overflow-hidden">
                      <motion.div 
                        className="text-4xl lg:text-5xl font-bold text-[#D4A574] inline-block"
                        style={{ textShadow: '0 0 25px rgba(212,165,116,0.4)' }}
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 2.3 }}
                      >
                        SULPHURETS FAULT
                      </motion.div>
                    </div>
                    <div className="overflow-hidden">
                      <motion.div 
                        className="text-4xl lg:text-5xl font-bold text-[#D4A574] inline-block"
                        style={{ textShadow: '0 0 25px rgba(212,165,116,0.4)' }}
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 3.1 }}
                      >
                        ESKAY RIFT
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Line 3: Neighbors */}
                <motion.div 
                  className="mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 3.9 }}
                >
                  <div className="text-lg text-white/60 mb-3">ALONG STRIKE FROM</div>
                  <div className="space-y-1 text-3xl lg:text-4xl font-bold text-[#FFD700]">
                    <motion.div
                      style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 4.4 }}
                    >
                      KSM
                    </motion.div>
                    <motion.div
                      style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 4.6 }}
                    >
                      BRUCEJACK
                    </motion.div>
                    <motion.div
                      style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 4.8 }}
                    >
                      TREATY CREEK
                    </motion.div>
                    <motion.div
                      style={{ textShadow: '0 0 20px rgba(255,215,0,0.3)' }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 5.0 }}
                    >
                      ESKAY CREEK
                    </motion.div>
                  </div>
                </motion.div>

                {/* Line 4: Discovery Potential */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 5.5 }}
                >
                  <div className="text-lg text-white/60 mb-2">EXCELLENT</div>
                  <motion.div 
                    className="text-5xl lg:text-6xl font-bold text-[#FFD700]"
                    style={{ 
                      textShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
                      transformOrigin: "right center" 
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 5.5 }}
                  >
                    DISCOVERY POTENTIAL
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Scroll Indicator - bottom center */}
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: transitionProgress > 0.9 && pyramidZoom === 0 ? 1 : 0,
                y: transitionProgress > 0.9 ? 0 : 20
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-[#D4A574] text-sm font-medium tracking-wider">
                  EXPLORE PROPERTIES
                </span>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-80"
                >
                  <path 
                    d="M12 5L12 19M12 19L5 12M12 19L19 12" 
                    stroke="#D4A574" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </div>
          </motion.section>
      </motion.div>
      
      {/* Hero Section - Initially visible, fades out after transition */}
      <motion.section 
        className="relative h-screen w-full" 
        animate={{
          opacity: transitionProgress < 0.9 ? 1 : 0,
          pointerEvents: transitionProgress < 0.9 ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: 2 }}>
        {/* Container for hero content */}
        <div className="absolute inset-0" 
          ref={containerRef}
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
          style={{
            perspective: '1200px',
            perspectiveOrigin: '50% 50%'
          }}
        >
          {/* Pyramids background - scales and fades with transition */}
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/pyramids3.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 1 - transitionProgress, // Fades out completely
              scale: 1 + transitionProgress * 4, // Scales from 1x to 5x
              transformOrigin: 'center 35%', // Focus on upper-middle area (sky)
              y: `-${transitionProgress * 20}%`, // Move up toward sky
            }}
          />

          {/* King Tut - shrinks and fades with transition */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: tutVisible && !hasStartedScrolling ? 1 : 0,
              scale: 1 - transitionProgress * 0.8
            }}
            transition={{ 
              opacity: { duration: hasStartedScrolling ? 0.3 : 0.5, ease: "easeOut" },
              scale: { duration: 0.1 }
            }}
          >
            <div className="relative">
              <img 
                src="/images/kingtut.png" 
                alt="King Tut"
                className="h-[120vh] w-auto object-contain"
                style={{ 
                  transform: 'translateY(15%)',
                  maxWidth: 'none'
                }}
              />
              {/* "Our Time is Now" text */}
              <motion.div
                className="absolute text-white text-center w-full"
                style={{ 
                  bottom: '17%',
                  textShadow: '0 0 40px rgba(0,0,0,0.9), 0 0 80px rgba(0,0,0,0.7)',
                  fontFamily: 'Georgia, serif'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: tutVisible ? 1 : 0, y: tutVisible ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h1 className="text-5xl md:text-7xl font-bold whitespace-nowrap mb-4">
                  Our Time is Now
                </h1>
                <p className="text-lg md:text-2xl text-white/90 max-w-4xl mx-auto px-8"
                  style={{
                    textShadow: '0 0 30px rgba(0,0,0,0.95), 0 0 60px rgba(0,0,0,0.8), 0 0 90px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,1)'
                  }}
                >
                  One of the last large-scale exploration opportunities in the world's richest gold district
                </p>
                
                {/* Enter Site Button - Thin style */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: tutVisible && !hasStartedScrolling ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onClick={startTransition}
                  className="mt-6 px-6 py-2 bg-transparent border border-white/50 text-white text-sm font-medium rounded-full hover:bg-white/10 hover:border-white/70 transition-all duration-200"
                >
                  Enter Site
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: tutVisible && transitionProgress < 0.5 ? 1 : 0, 
              y: tutVisible ? 0 : -20 
            }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-white text-sm font-medium opacity-80">
                {tutVisible ? 'Scroll to Enter' : 'Loading...'}
              </span>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80"
              >
                <path 
                  d="M12 5L12 19M12 19L5 12M12 19L19 12" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
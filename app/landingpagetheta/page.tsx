'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import LandingTickerV2 from '@/components/landing/LandingTickerV2'

export default function LandingPageTheta() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [tutVisible, setTutVisible] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  })

  // Transform values for scroll effects - disabled for now
  const contentOpacity = 1
  const leftPanelY = 0
  const rightPanelY = 0
  const portalScale = 0
  const mainScale = 1

  // Spring configuration for smooth motion - slower response
  const springConfig = { damping: 30, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Transform values for parallax effect - reduced movement
  const backgroundX = useTransform(springX, [-1, 1], [-10, 10])
  const backgroundY = useTransform(springY, [-1, 1], [-10, 10])
  const foregroundX = useTransform(springX, [-1, 1], [-20, 20])
  const foregroundY = useTransform(springY, [-1, 1], [-20, 20])

  useEffect(() => {
    setIsLoaded(true)
    // Set dark theme for enhanced logo visibility
    document.documentElement.setAttribute('data-header-theme', 'dark')
    
    // Prevent body scroll to hide footer
    document.body.style.overflow = 'hidden'
    document.body.style.height = '100vh'
    
    // Show King Tut after a delay
    const timer = setTimeout(() => {
      setTutVisible(true)
    }, 1500)
    
    // Cleanup on unmount
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
      document.body.style.overflow = ''
      document.body.style.height = ''
      clearTimeout(timer)
    }
  }, [])

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
    <div ref={scrollRef} className="relative overflow-hidden" style={{ height: '100vh', maxHeight: '100vh' }}>
      <LandingTickerV2 />
      <div className="fixed inset-0" 
        onMouseMove={handleMouseMove} 
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'radial-gradient(ellipse at center, #3d2418 0%, #1a0f08 100%)'
        }}
      >

        <div className="fixed inset-0" style={{ zIndex: 10 }}>

            {/* Main content container */}
            <div className="absolute inset-0">
              {/* Background image */}
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url('/images/pyramids3.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              
              {/* King Tut - centered and bottom 1/4 off screen */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: tutVisible ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ zIndex: 3 }}
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
                  </motion.div>
                </div>
              </motion.div>
              
              
              {/* Content overlay */}
              <motion.div 
                className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none" 
                style={{ 
                  zIndex: 15
                }}
              >
                
                {/* Main content */}
                <div className="flex-1 flex items-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-4xl"
                  >
                    
                  </motion.div>
                </div>
                
                {/* Bottom content - removed duplicate text */}
              </motion.div>
            </div>


        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: tutVisible ? 1 : 0, 
            y: tutVisible ? 0 : -20 
          }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
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
            <span className="text-white text-sm font-medium opacity-80">Scroll</span>
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
    </div>
  )
}
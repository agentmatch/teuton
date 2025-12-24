'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function LandingPageDeltaScrollTransition() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredElement, setHoveredElement] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Scroll-based animation values
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end start"]
  })

  // Transform scroll progress for different effects
  const leftPanelY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const rightPanelY = useTransform(scrollYProgress, [0, 1], [0, -300])
  const portalScale = useTransform(scrollYProgress, [0, 0.3, 1], [0, 0, 2.5])
  const portalOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0, 1])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 0.5, 0])
  const mainImageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  // Spring configuration for smooth motion
  const springConfig = { damping: 30, stiffness: 100 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Transform values for parallax effect
  const backgroundX = useTransform(springX, [-1, 1], [-10, 10])
  const backgroundY = useTransform(springY, [-1, 1], [-10, 10])
  const foregroundX = useTransform(springX, [-1, 1], [-20, 20])
  const foregroundY = useTransform(springY, [-1, 1], [-20, 20])

  useEffect(() => {
    setIsLoaded(true)
    document.documentElement.setAttribute('data-header-theme', 'dark')
    
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
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
    <div ref={scrollContainerRef} className="relative">
      {/* Main content container - made scrollable */}
      <div className="h-[200vh]"> {/* Extended height for scroll */}
        <div 
          className="fixed inset-0 bg-black" 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
          style={{
            backgroundColor: '#000000',
            backgroundImage: `url('/images/countours1.png')`,
            backgroundSize: '600px 600px',
            backgroundRepeat: 'repeat',
            backgroundBlendMode: 'screen'
          }}
        >
          <div className="fixed inset-0 overflow-hidden">
            <div className="min-h-screen flex items-center justify-center p-8">
              {/* Main container */}
              <motion.div
                ref={containerRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-[1600px] h-[90vh] rounded-3xl overflow-hidden bg-black mt-8 mx-2 mb-2 p-2"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
                  opacity: contentOpacity
                }}
              >
                {/* Three-panel mask container */}
                <div className="absolute inset-0 flex">
                  {/* Left Panel */}
                  <motion.div 
                    className="relative w-1/3 h-full overflow-hidden"
                    style={{ y: leftPanelY }}
                  >
                    <div className="absolute inset-0 rounded-l-2xl overflow-hidden">
                      {/* Mountain background - left section */}
                      <motion.div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url('/images/mountain2.png')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'left center',
                          backgroundRepeat: 'no-repeat',
                          x: backgroundX,
                          y: backgroundY,
                          scale: mainImageScale,
                          width: '300%',
                          left: '0%'
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Center Panel with Portal */}
                  <div className="relative w-1/3 h-full overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      {/* Mountain background - center section */}
                      <motion.div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url('/images/mountain2.png')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center center',
                          backgroundRepeat: 'no-repeat',
                          x: backgroundX,
                          y: backgroundY,
                          scale: mainImageScale,
                          width: '300%',
                          left: '-100%'
                        }}
                      />
                      
                      {/* Portal Effect */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ opacity: portalOpacity }}
                      >
                        <motion.div
                          className="relative rounded-full"
                          style={{
                            width: '400px',
                            height: '400px',
                            scale: portalScale,
                            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.4) 60%, transparent 100%)',
                            boxShadow: '0 0 100px rgba(255,255,255,0.8), 0 0 200px rgba(255,255,255,0.6), 0 0 300px rgba(255,255,255,0.4)',
                            filter: 'blur(1px)'
                          }}
                        >
                          {/* Inner portal glow */}
                          <div className="absolute inset-[20%] rounded-full"
                            style={{
                              background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                              boxShadow: 'inset 0 0 50px rgba(255,255,255,0.9)',
                              filter: 'blur(2px)'
                            }}
                          />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right Panel */}
                  <motion.div 
                    className="relative w-1/3 h-full overflow-hidden"
                    style={{ y: rightPanelY }}
                  >
                    <div className="absolute inset-0 rounded-r-2xl overflow-hidden">
                      {/* Mountain background - right section */}
                      <motion.div 
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url('/images/mountain2.png')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'right center',
                          backgroundRepeat: 'no-repeat',
                          x: backgroundX,
                          y: backgroundY,
                          scale: mainImageScale,
                          width: '300%',
                          left: '-200%'
                        }}
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Glassmorphic inner border */}
                <div 
                  className="absolute inset-[8px] rounded-2xl pointer-events-none"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    background: 'transparent',
                    boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.1)',
                    zIndex: 20
                  }}
                />

                {/* Foreground rocks overlay */}
                <motion.div 
                  className="absolute -left-[5%] -right-[5%] -bottom-[5%] h-[35%] pointer-events-none"
                  style={{
                    backgroundImage: `url('/images/foregroundrocks2.png')`,
                    backgroundSize: '110% auto',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: 10,
                    x: foregroundX,
                    y: foregroundY,
                    opacity: contentOpacity
                  }}
                />

                {/* Floating metallic orbs - simplified for clarity */}
                <motion.div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ zIndex: 3, opacity: contentOpacity }}
                >
                  {/* Gold orb */}
                  <motion.div
                    className="absolute top-[20%] left-[15%] w-24 h-24 md:w-36 md:h-36 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 235, 59, 0.2) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(255, 193, 7, 0.05) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 215, 0, 0.3)',
                      boxShadow: '0 20px 60px rgba(255, 215, 0, 0.4), 0 0 100px rgba(255, 215, 0, 0.2)'
                    }}
                    animate={{
                      y: [0, -40, 20, -30, 0],
                      x: [0, 30, 50, 20, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Silver orb */}
                  <motion.div
                    className="absolute top-[35%] right-[25%] w-20 h-20 md:w-32 md:h-32 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(224, 224, 224, 0.3) 0%, rgba(192, 192, 192, 0.15) 50%, rgba(158, 158, 158, 0.1) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '2px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 20px 60px rgba(192, 192, 192, 0.5), 0 0 100px rgba(255, 255, 255, 0.3)'
                    }}
                    animate={{
                      y: [0, 35, -20, 40, 0],
                      x: [0, -40, -60, -30, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                  />
                </motion.div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" style={{ zIndex: 5 }} />

                {/* Content overlay */}
                <motion.div 
                  className="absolute inset-0 flex flex-col justify-between p-12" 
                  style={{ zIndex: 15, opacity: contentOpacity }}
                >
                  {/* Top section with periodic elements */}
                  <div className="flex justify-end -mt-4">
                    <motion.div
                      initial={{ opacity: 0, y: -30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="flex gap-3"
                    >
                      {/* Gold (Au) */}
                      <div className="w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-white/20 bg-white/5 backdrop-blur-sm p-2 flex flex-col items-center justify-center">
                        <span className="text-xs" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.6)' }}>79</span>
                        <span className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.9)' }}>Au</span>
                        <span className="text-[10px] mt-1" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.5)' }}>Gold</span>
                      </div>
                      
                      {/* Copper (Cu) */}
                      <div className="w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-white/20 bg-white/5 backdrop-blur-sm p-2 flex flex-col items-center justify-center">
                        <span className="text-xs" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.6)' }}>29</span>
                        <span className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.9)' }}>Cu</span>
                        <span className="text-[10px] mt-1" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.5)' }}>Copper</span>
                      </div>
                      
                      {/* Silver (Ag) */}
                      <div className="w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-white/20 bg-white/5 backdrop-blur-sm p-2 flex flex-col items-center justify-center">
                        <span className="text-xs" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.6)' }}>47</span>
                        <span className="text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.9)' }}>Ag</span>
                        <span className="text-[10px] mt-1" style={{ fontFamily: 'Georgia, serif', color: 'rgba(255, 255, 255, 0.5)' }}>Silver</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom content */}
                  <div className="flex justify-between items-end">
                    {/* Tagline in bottom left */}
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                      className="text-lg md:text-xl lg:text-2xl text-white/90 tracking-tight max-w-lg"
                      style={{ 
                        fontFamily: 'Georgia, serif',
                        filter: 'drop-shadow(0 0 30px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 60px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 100px rgba(0, 0, 0, 0.6))'
                      }}
                    >
                      One of the last large-scale exploration opportunities in the world's richest gold district
                    </motion.p>
                    
                    {/* Discovery text in bottom right */}
                    <motion.h1
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                      className="text-6xl md:text-8xl lg:text-9xl font-semibold text-white tracking-tighter"
                      style={{ 
                        filter: 'drop-shadow(0 0 40px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 80px rgba(0, 0, 0, 0.6))'
                      }}
                    >
                      Discovery.
                    </motion.h1>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Next page content - revealed through portal */}
      <motion.div 
        className="fixed inset-0 bg-white flex items-center justify-center"
        style={{ 
          zIndex: -1,
          opacity: portalOpacity
        }}
      >
        <div className="text-center">
          <h2 className="text-6xl font-bold text-black mb-4">Welcome to Luxor Metals</h2>
          <p className="text-xl text-gray-700">Exploring the Golden Triangle</p>
        </div>
      </motion.div>
    </div>
  )
}
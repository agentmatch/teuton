'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'
import LandingTickerV2 from '@/components/landing/LandingTickerV2'

export default function LandingPageDelta() {
  const [isLoaded, setIsLoaded] = useState(false)
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

  // Transform values for scroll effects
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const leftPanelY = useTransform(scrollYProgress, [0.1, 0.5], [0, -800])
  const rightPanelY = useTransform(scrollYProgress, [0.1, 0.5], [0, -800])
  const portalScale = useTransform(scrollYProgress, [0.2, 0.8], [0, 2])
  const mainScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05])

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
    
    // Cleanup on unmount
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
    <div ref={scrollRef} className="relative" style={{ height: '200vh' }}>
      <LandingTickerV2 />
      <div className="fixed inset-0 bg-black" 
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
        {/* Next page content - behind everything */}
        <div className="absolute inset-0 flex items-center justify-center bg-black" style={{ zIndex: 1 }}>
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">Next Section Content</h2>
            <p className="text-xl text-white/80 mb-8">This is revealed through the portal</p>
          </div>
        </div>

        {/* Portal effect that starts in middle third then covers entire viewport */}
        <motion.div 
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.2, 0.3], [0, 1])
          }}
        >
          {/* Black circle that grows from middle panel to full screen */}
          <motion.div
            className="bg-black rounded-full"
            style={{
              width: useTransform(scrollYProgress, 
                [0.2, 0.4, 0.8], 
                ['0vw', '30vw', '200vmax']
              ),
              height: useTransform(scrollYProgress, 
                [0.2, 0.4, 0.8], 
                ['0vw', '30vw', '200vmax']
              ),
            }}
          />
        </motion.div>

        <div className="fixed inset-0 overflow-auto" style={{ zIndex: 10 }}>
          <div className="min-h-screen flex items-center justify-center p-8">
        {/* Main container with black border */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-[1600px] h-[90vh] rounded-3xl overflow-hidden bg-black mt-8 mx-2 mb-2 p-2"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
            scale: mainScale
          }}
        >
          {/* Inner container with mountain background */}
          <div 
            className="relative w-full h-full rounded-2xl overflow-hidden"
          >

            {/* Main content container */}
            <div className="absolute inset-0">
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
              {/* Mountain background - base layer that gets split */}
              <motion.div 
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: useTransform(scrollYProgress, (progress) => {
                    if (progress <= 0.05) return 'none';
                    return 'polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%), polygon(66.67% 0, 100% 0, 100% 100%, 66.67% 100%)';
                  })
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/images/glacier.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    x: backgroundX,
                    y: backgroundY,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Center panel that remains visible */}
              <motion.div 
                className="absolute inset-0"
                style={{
                  clipPath: useTransform(scrollYProgress, (progress) => {
                    if (progress <= 0.05) return 'none';
                    return 'polygon(33.33% 0, 66.67% 0, 66.67% 100%, 33.33% 100%)';
                  })
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/images/glacier.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    x: backgroundX,
                    y: backgroundY,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Moving panels - left and right */}
              <motion.div 
                className="absolute inset-0"
                style={{
                  clipPath: useTransform(scrollYProgress, (progress) => {
                    if (progress <= 0.05) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
                    return 'none';
                  })
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/images/glacier.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    x: backgroundX,
                    y: backgroundY,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Left panel that moves up */}
              <motion.div 
                className="absolute left-0 w-[33.33%] h-full overflow-hidden"
                style={{
                  y: leftPanelY,
                  display: useTransform(scrollYProgress, (progress) => progress > 0.05 ? 'block' : 'none')
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    width: '300%',
                    backgroundImage: `url('/images/glacier.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'left center',
                    backgroundRepeat: 'no-repeat',
                    x: useTransform(backgroundX, (x) => x * 3),
                    y: backgroundY,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Right panel that moves up */}
              <motion.div 
                className="absolute right-0 w-[33.33%] h-full overflow-hidden"
                style={{
                  y: rightPanelY,
                  display: useTransform(scrollYProgress, (progress) => progress > 0.05 ? 'block' : 'none')
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    width: '300%',
                    right: 0,
                    backgroundImage: `url('/images/glacier.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    x: useTransform(backgroundX, (x) => x * 3 - 200),
                    y: backgroundY,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Foreground rocks - follows same split pattern */}
              <motion.div 
                className="absolute -left-[5%] -right-[5%] -bottom-[5%] h-[35%] pointer-events-none"
                style={{
                  clipPath: useTransform(scrollYProgress, (progress) => {
                    if (progress <= 0.05) return 'none';
                    return 'polygon(0 0, 33.33% 0, 33.33% 100%, 0 100%), polygon(66.67% 0, 100% 0, 100% 100%, 66.67% 100%)';
                  }),
                  zIndex: 10
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/images/glaicerrocks.png')`,
                    backgroundSize: '110% auto',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                    x: foregroundX,
                    y: foregroundY
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Center foreground that remains */}
              <motion.div 
                className="absolute -left-[5%] -right-[5%] -bottom-[5%] h-[35%] pointer-events-none"
                style={{
                  clipPath: useTransform(scrollYProgress, (progress) => {
                    if (progress <= 0.05) return 'none';
                    return 'polygon(33.33% 0, 66.67% 0, 66.67% 100%, 33.33% 100%)';
                  }),
                  zIndex: 10
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/images/glaicerrocks.png')`,
                    backgroundSize: '110% auto',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                    x: foregroundX,
                    y: foregroundY
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Initial foreground before split */}
              <motion.div 
                className="absolute -left-[5%] -right-[5%] -bottom-[5%] h-[35%] pointer-events-none"
                style={{
                  clipPath: useTransform(scrollYProgress, (progress) => {
                    if (progress <= 0.05) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
                    return 'none';
                  }),
                  zIndex: 10
                }}
              >
                <motion.div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/images/glaicerrocks.png')`,
                    backgroundSize: '110% auto',
                    backgroundPosition: 'bottom center',
                    backgroundRepeat: 'no-repeat',
                    x: foregroundX,
                    y: foregroundY
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Left foreground panel */}
              <motion.div 
                className="absolute left-0 w-[33.33%] -bottom-[5%] h-[35%] pointer-events-none overflow-hidden"
                style={{
                  y: leftPanelY,
                  display: useTransform(scrollYProgress, (progress) => progress > 0.05 ? 'block' : 'none'),
                  zIndex: 10
                }}
              >
                <motion.div 
                  className="absolute -left-[15%] -bottom-[5%] h-full"
                  style={{
                    width: '330%',
                    backgroundImage: `url('/images/glaicerrocks.png')`,
                    backgroundSize: '110% auto',
                    backgroundPosition: 'bottom left',
                    backgroundRepeat: 'no-repeat',
                    x: useTransform(foregroundX, (x) => x * 3),
                    y: foregroundY
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Right foreground panel */}
              <motion.div 
                className="absolute right-0 w-[33.33%] -bottom-[5%] h-[35%] pointer-events-none overflow-hidden"
                style={{
                  y: rightPanelY,
                  display: useTransform(scrollYProgress, (progress) => progress > 0.05 ? 'block' : 'none'),
                  zIndex: 10
                }}
              >
                <motion.div 
                  className="absolute -right-[15%] -bottom-[5%] h-full"
                  style={{
                    width: '330%',
                    backgroundImage: `url('/images/glaicerrocks.png')`,
                    backgroundSize: '110% auto',
                    backgroundPosition: 'bottom right',
                    backgroundRepeat: 'no-repeat',
                    x: useTransform(foregroundX, (x) => x * 3 - 220),
                    y: foregroundY
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                />
              </motion.div>
              
              {/* Black separation bars */}
              <motion.div 
                className="absolute top-0 left-[calc(33.33%-4px)] w-2 h-full bg-black" 
                style={{
                  display: useTransform(scrollYProgress, (progress) => progress > 0.05 ? 'block' : 'none'),
                  zIndex: 20
                }}
              />
              <motion.div 
                className="absolute top-0 right-[calc(33.33%-4px)] w-2 h-full bg-black" 
                style={{
                  display: useTransform(scrollYProgress, (progress) => progress > 0.05 ? 'block' : 'none'),
                  zIndex: 20
                }}
              />
              
              {/* Floating metallic orbs */}
              <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 6 }}>
                {/* Gold orb */}
                <motion.div
                  className="absolute w-24 h-24 md:w-36 md:h-36 rounded-full overflow-hidden cursor-pointer"
                  initial={{ x: '20%', y: '20%' }}
                  onMouseEnter={() => setHoveredElement('gold')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(253, 222, 97, 0.05) 0%, rgba(253, 222, 97, 0.1) 40%, rgba(253, 222, 97, 0.3) 70%, rgba(253, 222, 97, 0.6) 85%, rgba(253, 222, 97, 0.9) 95%, rgba(253, 222, 97, 1) 100%)',
                    border: '2px solid rgba(253, 222, 97, 0.8)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    boxShadow: hoveredElement === 'gold' 
                      ? '0 0 30px #FDDE61, 0 0 60px #FDDE61, 0 0 90px rgba(253, 222, 97, 0.8), 0 0 120px rgba(253, 222, 97, 0.6), 0 0 150px rgba(253, 222, 97, 0.4), inset 0 0 30px rgba(253, 222, 97, 0.4), inset 0 0 60px rgba(253, 222, 97, 0.2)'
                      : '0 0 20px #FDDE61, 0 0 40px rgba(253, 222, 97, 0.8), 0 0 60px rgba(253, 222, 97, 0.6), 0 0 80px rgba(253, 222, 97, 0.4), 0 0 100px rgba(253, 222, 97, 0.2), inset 0 0 20px rgba(253, 222, 97, 0.3)',
                    transform: hoveredElement === 'gold' ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  animate={{
                    x: ['20%', '110%', '-10%', '20%'],
                    y: ['20%', '80%', '40%', '20%'],
                  }}
                  transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Inner highlight for 3D effect */}
                  <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.36) 0%, transparent 70%)',
                      filter: 'blur(2px)'
                    }}
                  />
                </motion.div>
                
                {/* Silver orb */}
                <motion.div
                  className="absolute w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden cursor-pointer"
                  initial={{ x: '70%', y: '35%' }}
                  onMouseEnter={() => setHoveredElement('silver')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(224, 224, 224, 0.3) 70%, rgba(192, 192, 192, 0.6) 85%, rgba(192, 192, 192, 0.9) 95%, rgba(192, 192, 192, 1) 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    boxShadow: hoveredElement === 'silver'
                      ? '0 0 30px #FFFFFF, 0 0 60px #FFFFFF, 0 0 90px rgba(255, 255, 255, 0.8), 0 0 120px rgba(224, 224, 224, 0.6), 0 0 150px rgba(192, 192, 192, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.2)'
                      : '0 0 20px #FFFFFF, 0 0 40px rgba(255, 255, 255, 0.8), 0 0 60px rgba(224, 224, 224, 0.6), 0 0 80px rgba(192, 192, 192, 0.4), 0 0 100px rgba(192, 192, 192, 0.2), inset 0 0 20px rgba(255, 255, 255, 0.3)',
                    transform: hoveredElement === 'silver' ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  animate={{
                    x: ['70%', '-10%', '110%', '70%'],
                    y: ['35%', '60%', '10%', '35%'],
                  }}
                  transition={{
                    duration: 70,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Inner highlight for 3D effect */}
                  <div className="absolute top-[15%] left-[15%] w-[35%] h-[35%] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.42) 0%, transparent 70%)',
                      filter: 'blur(3px)'
                    }}
                  />
                </motion.div>
                
                {/* Copper orb */}
                <motion.div
                  className="absolute w-16 h-16 md:w-28 md:h-28 rounded-full overflow-hidden cursor-pointer"
                  initial={{ x: '50%', y: '15%' }}
                  onMouseEnter={() => setHoveredElement('copper')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(139, 69, 19, 0.05) 0%, rgba(139, 69, 19, 0.1) 40%, rgba(160, 82, 45, 0.3) 70%, rgba(139, 69, 19, 0.6) 85%, rgba(101, 50, 14, 0.9) 95%, rgba(101, 50, 14, 1) 100%)',
                    border: '2px solid rgba(139, 69, 19, 0.8)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    boxShadow: hoveredElement === 'copper'
                      ? '0 0 30px #8B4513, 0 0 60px #8B4513, 0 0 90px rgba(139, 69, 19, 0.8), 0 0 120px rgba(160, 82, 45, 0.6), 0 0 150px rgba(101, 50, 14, 0.4), inset 0 0 30px rgba(139, 69, 19, 0.4), inset 0 0 60px rgba(160, 82, 45, 0.2)'
                      : '0 0 20px #8B4513, 0 0 40px rgba(139, 69, 19, 0.8), 0 0 60px rgba(160, 82, 45, 0.6), 0 0 80px rgba(101, 50, 14, 0.4), 0 0 100px rgba(101, 50, 14, 0.2), inset 0 0 20px rgba(139, 69, 19, 0.3)',
                    transform: hoveredElement === 'copper' ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  animate={{
                    x: ['50%', '80%', '20%', '50%'],
                    y: ['15%', '85%', '110%', '-10%', '15%'],
                  }}
                  transition={{
                    duration: 80,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Inner highlight for 3D effect */}
                  <div className="absolute top-[12%] left-[12%] w-[28%] h-[28%] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                      filter: 'blur(2px)'
                    }}
                  />
                </motion.div>
                
                {/* Small gold orb */}
                <motion.div
                  className="absolute w-14 h-14 md:w-24 md:h-24 rounded-full overflow-hidden cursor-pointer"
                  initial={{ x: '25%', y: '65%' }}
                  onMouseEnter={() => setHoveredElement('gold')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{
                    background: 'radial-gradient(circle at center, rgba(253, 222, 97, 0.05) 0%, rgba(253, 222, 97, 0.1) 40%, rgba(253, 222, 97, 0.3) 70%, rgba(253, 222, 97, 0.6) 85%, rgba(253, 222, 97, 0.9) 95%, rgba(253, 222, 97, 1) 100%)',
                    border: '2px solid rgba(253, 222, 97, 0.8)',
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    boxShadow: hoveredElement === 'gold'
                      ? '0 0 25px #FDDE61, 0 0 50px #FDDE61, 0 0 75px rgba(253, 222, 97, 0.8), 0 0 100px rgba(253, 222, 97, 0.6), 0 0 125px rgba(253, 222, 97, 0.4), inset 0 0 25px rgba(253, 222, 97, 0.4), inset 0 0 50px rgba(253, 222, 97, 0.2)'
                      : '0 0 15px #FDDE61, 0 0 30px rgba(253, 222, 97, 0.8), 0 0 45px rgba(253, 222, 97, 0.6), 0 0 60px rgba(253, 222, 97, 0.4), 0 0 75px rgba(253, 222, 97, 0.2), inset 0 0 15px rgba(253, 222, 97, 0.3)',
                    transform: hoveredElement === 'gold' ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  animate={{
                    x: ['25%', '110%', '-10%', '80%', '25%'],
                    y: ['65%', '25%', '90%', '45%', '65%'],
                  }}
                  transition={{
                    duration: 90,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Inner highlight for 3D effect */}
                  <div className="absolute top-[18%] left-[18%] w-[25%] h-[25%] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                      filter: 'blur(1.5px)'
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" style={{ zIndex: 5 }} />
              
              {/* Content overlay */}
              <motion.div 
                className="absolute inset-0 flex flex-col justify-between p-12" 
                style={{ 
                  zIndex: 15,
                  opacity: contentOpacity
                }}
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
                    <motion.div 
                      className="relative"
                      animate={{
                        scale: hoveredElement === 'gold' ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 backdrop-blur-sm p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        hoveredElement === 'gold' 
                          ? 'border-[#FDDE61]/50 bg-[#FDDE61]/10' 
                          : 'border-white/20 bg-white/5'
                      }`}
                        style={{ 
                          boxShadow: hoveredElement === 'gold' 
                            ? '0 0 30px rgba(253, 222, 97, 0.5), inset 0 0 20px rgba(253, 222, 97, 0.2)' 
                            : '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <span className={`text-xs transition-colors duration-300 ${
                          hoveredElement === 'gold' ? 'text-[#FDDE61]/80' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'gold' ? undefined : 'rgba(255, 255, 255, 0.6)' }}>79</span>
                        <span className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 ${
                          hoveredElement === 'gold' ? 'text-[#FDDE61]' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'gold' ? undefined : 'rgba(255, 255, 255, 0.9)' }}>Au</span>
                        <span className={`text-[10px] mt-1 transition-colors duration-300 ${
                          hoveredElement === 'gold' ? 'text-[#FDDE61]/70' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'gold' ? undefined : 'rgba(255, 255, 255, 0.5)' }}>Gold</span>
                      </div>
                    </motion.div>
                    
                    {/* Copper (Cu) */}
                    <motion.div 
                      className="relative"
                      animate={{
                        scale: hoveredElement === 'copper' ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 backdrop-blur-sm p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        hoveredElement === 'copper' 
                          ? 'border-[#8B4513]/50 bg-[#8B4513]/10' 
                          : 'border-white/20 bg-white/5'
                      }`}
                        style={{ 
                          boxShadow: hoveredElement === 'copper' 
                            ? '0 0 30px rgba(139, 69, 19, 0.5), inset 0 0 20px rgba(139, 69, 19, 0.2)' 
                            : '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <span className={`text-xs transition-colors duration-300 ${
                          hoveredElement === 'copper' ? 'text-[#8B4513]/80' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'copper' ? undefined : 'rgba(255, 255, 255, 0.6)' }}>29</span>
                        <span className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 ${
                          hoveredElement === 'copper' ? 'text-[#8B4513]' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'copper' ? undefined : 'rgba(255, 255, 255, 0.9)' }}>Cu</span>
                        <span className={`text-[10px] mt-1 transition-colors duration-300 ${
                          hoveredElement === 'copper' ? 'text-[#8B4513]/70' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'copper' ? undefined : 'rgba(255, 255, 255, 0.5)' }}>Copper</span>
                      </div>
                    </motion.div>
                    
                    {/* Silver (Ag) */}
                    <motion.div 
                      className="relative"
                      animate={{
                        scale: hoveredElement === 'silver' ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 backdrop-blur-sm p-2 flex flex-col items-center justify-center transition-all duration-300 ${
                        hoveredElement === 'silver' 
                          ? 'border-white/70 bg-white/20' 
                          : 'border-white/20 bg-white/5'
                      }`}
                        style={{ 
                          boxShadow: hoveredElement === 'silver' 
                            ? '0 0 30px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.2)' 
                            : '0 0 20px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <span className={`text-xs transition-colors duration-300 ${
                          hoveredElement === 'silver' ? 'text-gray-300/80' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'silver' ? undefined : 'rgba(255, 255, 255, 0.6)' }}>47</span>
                        <span className={`text-2xl md:text-3xl font-semibold transition-colors duration-300 ${
                          hoveredElement === 'silver' ? 'text-gray-300' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'silver' ? undefined : 'rgba(255, 255, 255, 0.9)' }}>Ag</span>
                        <span className={`text-[10px] mt-1 transition-colors duration-300 ${
                          hoveredElement === 'silver' ? 'text-gray-300/70' : ''
                        }`} style={{ fontFamily: 'Georgia, serif', color: hoveredElement === 'silver' ? undefined : 'rgba(255, 255, 255, 0.5)' }}>Silver</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
                
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
            </div>


          </div>
        </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
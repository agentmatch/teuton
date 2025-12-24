'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiArrowRight, FiTrendingUp, FiMapPin, FiCompass } from 'react-icons/fi'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function LandingHeroV2() {
  const ref = useRef(null)
  const [showIntro, setShowIntro] = useState(true)
  const [contentReady, setContentReady] = useState(false)
  const [imageTransitioning, setImageTransitioning] = useState(false)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])

  useEffect(() => {
    // Start transitioning after 3 seconds
    const timer = setTimeout(() => {
      setImageTransitioning(true)
      setContentReady(true)
      // Remove intro completely after transition
      setTimeout(() => {
        setShowIntro(false)
      }, 1500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center"
      style={{ background: 'linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--background)), rgba(0,34,210,0.02))' }}
    >
      {/* Full screen intro image that slides down */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              y: imageTransitioning ? '100vh' : 0
            }}
            transition={{ 
              opacity: { duration: 1 },
              y: { duration: 1.2, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50"
            style={{ willChange: 'transform' }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/images/dinojeremy4j.jpg"
                alt="Luxor Metals Leadership"
                fill
                className="object-cover"
                priority
                quality={90}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main hero content - appears as image slides down */}
      <AnimatePresence>
        {contentReady && (
          <>
            {/* Layered background system */}
            
            {/* Layer 1: Topographic pattern */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 30 20 50 10 T 90 10' stroke='%230022d2' fill='none' stroke-width='0.5'/%3E%3Cpath d='M10 30 Q 30 40 50 30 T 90 30' stroke='%230022d2' fill='none' stroke-width='0.5'/%3E%3Cpath d='M10 50 Q 30 60 50 50 T 90 50' stroke='%230022d2' fill='none' stroke-width='0.5'/%3E%3Cpath d='M10 70 Q 30 80 50 70 T 90 70' stroke='%230022d2' fill='none' stroke-width='0.5'/%3E%3Cpath d='M10 90 Q 30 100 50 90 T 90 90' stroke='%230022d2' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '200px 200px'
              }}
            />
            
            {/* Layer 2: Aurora waves */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
              >
                <motion.div
                  className="w-full h-full"
                  animate={{
                    background: [
                      'radial-gradient(ellipse at 20% 30%, rgba(255,184,0,0.08) 0%, transparent 50%)',
                      'radial-gradient(ellipse at 80% 70%, rgba(0,34,210,0.08) 0%, transparent 50%)',
                      'radial-gradient(ellipse at 50% 50%, rgba(30,0,159,0.06) 0%, transparent 50%)',
                      'radial-gradient(ellipse at 20% 30%, rgba(255,184,0,0.08) 0%, transparent 50%)',
                    ]
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
            
            {/* Layer 3: Floating particles - Gold vein system */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute inset-0 overflow-hidden"
            >
              {/* Underground gold vein clusters */}
              {[...Array(120)].map((_, i) => {
                const cluster = Math.floor(i / 30);
                const angle = (cluster * 137.5) * Math.PI / 180;
                const radius = Math.sqrt(i) * 8;
                const centerX = 50 + Math.cos(angle) * radius;
                const centerY = 50 + Math.sin(angle) * radius;
                
                return (
                  <motion.div
                    key={`vein-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${centerX + (Math.random() * 10 - 5)}%`,
                      top: `${120 + Math.random() * 30}%`,
                      width: '1px',
                      height: '1px',
                      background: '#ffb800',
                      boxShadow: '0 0 3px #ffb800',
                      opacity: 0
                    }}
                    animate={{
                      y: [-20, -window.innerHeight - 100],
                      opacity: [0, 0.6, 0.6, 0],
                      scale: [0, 2, 2, 0],
                    }}
                    transition={{
                      duration: 30 + Math.random() * 10,
                      repeat: Infinity,
                      delay: (cluster * 3) + Math.random() * 15,
                      ease: "easeInOut"
                    }}
                  />
                )
              })}
              
              {/* Ambient glow particles */}
              {[...Array(60)].map((_, i) => {
                const x = Math.random() * 100;
                const pulseDelay = (x / 100) * 5;
                
                return (
                  <motion.div
                    key={`glow-${i}`}
                    className="absolute"
                    style={{
                      left: `${x}%`,
                      top: `${Math.random() * 100}%`,
                      width: '1px',
                      height: '1px',
                      background: '#ffb800',
                      borderRadius: '50%',
                      filter: 'blur(1px)'
                    }}
                    animate={{
                      opacity: [0, 0.3, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: pulseDelay + Math.random() * 10,
                      repeatDelay: 5 + Math.random() * 5
                    }}
                  />
                )
              })}
              
              {/* Deep formation particles */}
              {[...Array(40)].map((_, i) => {
                const depth = i / 40;
                const size = 1 + (1 - depth) * 1.5;
                
                return (
                  <motion.div
                    key={`deep-${i}`}
                    className="absolute rounded-full"
                    style={{
                      left: `${30 + Math.random() * 40}%`,
                      top: `${110 + depth * 40}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      background: depth > 0.6 ? 
                        `radial-gradient(circle, rgba(30,0,159,0.8), transparent)` : 
                        `radial-gradient(circle, rgba(0,34,210,0.8), transparent)`,
                      opacity: 0
                    }}
                    animate={{
                      y: [-50 - (depth * 100), -window.innerHeight - 100],
                      opacity: [0, 0.2 * (1 - depth * 0.5), 0],
                    }}
                    transition={{
                      duration: 40 + depth * 20,
                      repeat: Infinity,
                      delay: depth * 10 + Math.random() * 10,
                      ease: "linear"
                    }}
                  />
                )
              })}
              
              {/* Rare flash particles */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={`flash-${i}`}
                  className="absolute"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${Math.random() * 80}%`,
                    width: '2px',
                    height: '2px',
                    background: 'radial-gradient(circle, #ffb800, transparent)',
                    borderRadius: '50%',
                    opacity: 0
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    scale: [0, 3, 0],
                    filter: ['blur(0px)', 'blur(0.5px)', 'blur(0px)']
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: 10 + Math.random() * 30,
                    repeatDelay: 20 + Math.random() * 40
                  }}
                />
              ))}
            </motion.div>
            
            {/* Layer 4: Gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="gradient-orb w-96 h-96 top-0 left-0" 
                style={{ background: 'radial-gradient(circle, rgba(255,184,0,0.15), rgba(216,155,0,0.05))' }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.7 }}
                className="gradient-orb w-80 h-80 bottom-1/4 right-1/4" 
                style={{ background: 'radial-gradient(circle, rgba(0,34,210,0.15), rgba(30,0,159,0.05))' }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -40, 0],
                    y: [0, -40, 0]
                  }}
                  transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                  className="w-full h-full"
                />
              </motion.div>
            </div>
            
            {/* Layer 5: Geometric grid overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.02 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,34,210,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,34,210,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                transform: 'perspective(1000px) rotateX(60deg)',
                transformOrigin: 'center bottom'
              }}
            />
            
            {/* Foreground rocks overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="fixed left-0 right-0 pointer-events-none z-30"
              style={{
                bottom: '-20%',
              }}
            >
              <img 
                src="/images/glaicerrocks.png"
                alt=""
                className="w-full h-auto"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                }}
              />
            </motion.div>
            
            {/* Layer 6: 3D Terrain Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="relative w-full max-w-7xl h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              >
                {/* Terrain mesh lines */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 600"
                  preserveAspectRatio="none"
                  style={{ opacity: 0.15 }}
                >
                  <defs>
                    <linearGradient id="terrainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ffb800" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#0022d2" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#1e009f" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  
                  {/* Mountain ridges */}
                  <motion.path
                    d="M 0 400 Q 150 350 300 380 T 600 360 Q 750 340 900 370 L 1000 400"
                    stroke="url(#terrainGradient)"
                    strokeWidth="1"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 1 }}
                  />
                  <motion.path
                    d="M 0 450 Q 200 400 400 430 T 800 410 L 1000 450"
                    stroke="url(#terrainGradient)"
                    strokeWidth="0.5"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 3, delay: 1.2 }}
                  />
                  
                  {/* Contour lines */}
                  {[...Array(8)].map((_, i) => (
                    <motion.path
                      key={`contour-${i}`}
                      d={`M ${i * 125} 500 Q ${i * 125 + 60} ${480 - i * 10} ${i * 125 + 125} 500`}
                      stroke="rgba(0,34,210,0.1)"
                      strokeWidth="0.5"
                      fill="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 1.5 + i * 0.1 }}
                    />
                  ))}
                </svg>
                
                {/* 3D elevation effect overlay */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(to bottom, transparent 60%, rgba(0,34,210,0.05) 100%),
                      linear-gradient(to right, transparent 20%, rgba(255,184,0,0.02) 50%, transparent 80%)
                    `,
                    transform: 'perspective(1000px) rotateX(10deg)',
                    transformOrigin: 'center bottom'
                  }}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      {contentReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{ opacity, scale, y }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="w-full px-4 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:text-left lg:ml-[15%]"
            >
              {/* Main headline with asymmetric layout */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-10"
              >
                <h1 className="space-y-2">
                  {/* Subtle intro */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-lg md:text-xl lg:text-2xl font-medium uppercase tracking-[0.2em] mb-6"
                    style={{ color: '#0022d2' }}
                  >
                    Ready for The Next Major
                  </motion.div>
                  
                  {/* Hero word */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="relative inline-block"
                  >
                    <span 
                      className="text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-black leading-[0.85] block relative z-10"
                      style={{
                        letterSpacing: '-0.02em',
                        color: '#000000',
                      }}
                    >
                      DISCOVERY
                    </span>
                    {/* Pulsing gold glow behind */}
                    <motion.div 
                      className="absolute -inset-20" 
                      style={{ 
                        background: 'radial-gradient(circle, #d89b00 0%, transparent 70%)',
                        filter: 'blur(60px)'
                      }}
                      animate={{
                        opacity: [0.15, 0.25, 0.15],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                </h1>
              </motion.div>

              {/* Subheadline positioned asymmetrically */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-10 max-w-3xl font-light lg:ml-32"
              >
                One of the last large-scale exploration opportunities in the world's richest gold district
              </motion.p>

            </motion.div>
            
            {/* Prominent CTA - centered with ticker design */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex justify-center mt-16"
            >
              <Link href="#luxor-story">
                <div className="inline-flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer group"
                  style={{ 
                    backgroundColor: 'rgba(0,34,210,0.02)',
                    border: '1px solid rgba(0,34,210,0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,34,210,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(0,34,210,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0,34,210,0.02)';
                    e.currentTarget.style.borderColor = 'rgba(0,34,210,0.15)';
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <FiCompass className="w-5 h-5" style={{ color: '#0022d2' }} />
                  </motion.div>
                  <span className="text-lg font-semibold" style={{ color: '#0022d2' }}>Discover The Luxor Story</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" style={{ color: '#0022d2' }} />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Modern scroll indicator - only show after content is ready */}
      {contentReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-10 border-2 rounded-full p-1" style={{ borderColor: 'rgba(0,34,210,0.3)' }}>
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 rounded-full mx-auto"
                style={{ backgroundColor: '#0022d2' }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}
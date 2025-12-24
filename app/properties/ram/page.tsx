'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FiArrowLeft, FiExternalLink, FiMapPin, FiActivity, FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi'
import { HeaderAwareContent } from '@/components/layout/HeaderAwareContent'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})
const MuxDroneVideo = dynamic(() => import('@/components/ram/MuxDroneVideo').then(m => m.MuxDroneVideo), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
      <div className="text-white">Loading video player...</div>
    </div>
  )
})

// Remove BackgroundMap import - we'll use the mountain background instead

// New color palette matching properties page
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

// Mux Playback IDs for RAM drone videos
const MUX_PLAYBACK_IDS = {
  ramdrone1: 'RPb301S7bOIXXQCzqDHSfO8qioVUIGyxlBjYhsYia5Wk', // RAM drone video 1
  ramdrone2: 'yuJk01P8BH1yYaADncP3Z3Bu00wgBvPSOtak005D5xJuBc'  // RAM drone video 2
}

export default function RAMPropertyPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [currentDroneVideo, setCurrentDroneVideo] = useState(1)
  const imageRef = useRef<HTMLDivElement>(null)
  const coreImageRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Set dark theme for header
  useEffect(() => {
    document.documentElement.setAttribute('data-header-theme', 'dark')
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
    }
  }, [])

  // Modal handlers
  const openModal = (src: string, title: string) => {
    setModalImage({ src, title })
  }

  const closeModal = () => {
    setModalImage(null)
  }

  // Magnifying glass handlers
  const handleCoreImageMouseMove = (e: React.MouseEvent) => {
    if (!coreImageRef.current || isMobile) return
    
    const containerRect = coreImageRef.current.getBoundingClientRect()
    const img = coreImageRef.current.querySelector('img')
    
    if (img) {
      const imgRect = img.getBoundingClientRect()
      
      // Calculate mouse position relative to the actual image (not container)
      const imgX = ((e.clientX - imgRect.left) / imgRect.width) * 100
      const imgY = ((e.clientY - imgRect.top) / imgRect.height) * 100
      
      // Store actual image dimensions for magnifier calculations
      setImageSize({ width: imgRect.width, height: imgRect.height })
      
      // Clamp values between 0 and 100
      setMousePosition({
        x: Math.max(0, Math.min(100, imgX)),
        y: Math.max(0, Math.min(100, imgY))
      })
    }
  }

  const handleCoreImageMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true)
    }
  }

  const handleCoreImageMouseLeave = () => {
    setIsHovering(false)
    setMousePosition({ x: 50, y: 50 }) // Reset to center
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    if (modalImage) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [modalImage])

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20" 
         style={{ backgroundColor: palette.dark, isolation: 'isolate' }} 
         data-theme="dark">
      
      {/* Mountain landscape background */}
      <div className="fixed inset-0 z-0" aria-hidden="true" 
           style={{ 
             willChange: 'transform',
             transform: 'translateZ(0)',
             backfaceVisibility: 'hidden'
           }}>
        <Image 
          src="/images/rambackground.png"
          alt="Mountain landscape"
          fill
          priority
          quality={90}
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
        {/* Animated aurora gradient overlay - 2024/2025 trend */}
        <div className="absolute inset-0 overflow-hidden"
             style={{ 
               willChange: 'transform',
               transform: 'translateZ(0)'
             }}>
          {/* Layer 1: Base gradient - balanced for star visibility */}
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(180deg, 
              rgba(3, 23, 48, 0.9) 0%, 
              rgba(3, 23, 48, 0.8) 15%,
              rgba(0, 106, 148, 0.3) 50%, 
              rgba(3, 23, 48, 0.7) 100%)`,
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} />
          
          {/* Layer 2: Static gradient mesh */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              background: `radial-gradient(circle at 20% 50%, rgba(0, 106, 148, 0.4) 0%, transparent 50%),
                          radial-gradient(circle at 80% 50%, rgba(3, 23, 48, 0.6) 0%, transparent 50%),
                          radial-gradient(circle at 50% 30%, rgba(0, 106, 148, 0.3) 0%, transparent 40%)`,
              filter: 'blur(40px)',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }} 
          />
          
          {/* Layer 3: Static glow */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{ 
              background: `radial-gradient(ellipse at top, rgba(0, 106, 148, 0.3) 0%, transparent 60%)`,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }} 
          />
        </div>
      </div>
      <GoldDustParticles />
      
      <div className="container mx-auto max-w-6xl relative z-10" style={{ padding: `0 clamp(1rem, 3vw, 1.5rem)` }}>
        {/* Back Button - Absolute positioned */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-4 md:left-6"
          style={{ zIndex: 20 }}
        >
          <Link href="/properties" className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 190, 152, 0.9) 0%, 
                    rgba(255, 190, 152, 0.8) 30%,
                    rgba(254, 217, 146, 0.7) 70%,
                    rgba(255, 190, 152, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: palette.dark
                }}>
            <FiArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: "Aeonik, sans-serif" }}>Back to Properties</span>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: `clamp(2rem, 5vw, 3rem)` }}
        >
          <motion.h1 
            initial={{ y: 100, opacity: 0, filter: 'blur(20px)' }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              filter: 'blur(0px)',
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              filter: { duration: 1.2 }
            }}
            className="text-white mb-4 md:mb-6 relative"
            style={{ 
              fontFamily: "'Aeonik Extended', sans-serif", 
              fontWeight: 500,
              fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : '4rem',
              lineHeight: '1.1',
              // Gradient text with subtle animation
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 8s ease infinite',
              // Subtle text shadow for depth
              filter: 'drop-shadow(0 2px 20px rgba(160, 196, 255, 0.3))',
              // Mix blend mode for interesting interactions
              mixBlendMode: 'screen',
            }}>
            RAM Property
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                // Matching gradient text like properties page
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 10s ease infinite',
                letterSpacing: '0.02em',
                // Subtle dark shadow for prominence
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))',
              }}
            >
              <span style={{ display: 'block' }}>Large-scale porphyry Cu-Au and VMS exploration</span>
              <span style={{ display: 'block', marginTop: '0.3rem' }}>in the southern Golden Triangle</span>
            </motion.p>
          </div>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: `clamp(0.75rem, 2vw, 1rem)`, marginBottom: `clamp(2rem, 5vw, 3rem)` }}
        >
          <motion.div 
               className="rounded-xl text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
               variants={{
                 hidden: { 
                   opacity: 0, 
                   y: 40,
                   scale: 0.8,
                   filter: 'blur(10px)'
                 },
                 visible: { 
                   opacity: 1, 
                   y: 0,
                   scale: 1,
                   filter: 'blur(0px)',
                   transition: {
                     type: "spring",
                     stiffness: 100,
                     damping: 12,
                     duration: 0.6
                   }
                 }
               }}
               whileHover={{
                 y: -5,
                 transition: { type: "spring", stiffness: 300 }
               }}
               style={{
                 padding: `clamp(0.75rem, 2vw, 1rem)`,
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)',
                 border: `1px solid rgba(255, 255, 255, 0.08)`,
                 borderRadius: '16px',
                 transition: 'all 0.3s ease'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
            <p 
                 className="font-bold mb-1 transition-all duration-300"
                 style={{ 
                   fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                   background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                   backgroundSize: '200% 200%',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   animation: 'gradientShift 8s ease infinite',
                   filter: 'drop-shadow(0 2px 10px rgba(160, 196, 255, 0.3))',
                   display: 'inline-block'
                 }}>
              3,200
            </p>
            <p className="text-xs uppercase tracking-wider font-medium transition-all duration-300" style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 10s ease infinite',
              filter: 'drop-shadow(0 1px 4px rgba(160, 196, 255, 0.2))',
              display: 'block'
            }}>Hectares</p>
          </motion.div>
          <motion.div 
               className="rounded-xl text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
               variants={{
                 hidden: { 
                   opacity: 0, 
                   y: 40,
                   scale: 0.8,
                   filter: 'blur(10px)'
                 },
                 visible: { 
                   opacity: 1, 
                   y: 0,
                   scale: 1,
                   filter: 'blur(0px)',
                   transition: {
                     type: "spring",
                     stiffness: 100,
                     damping: 12,
                     duration: 0.6
                   }
                 }
               }}
               whileHover={{
                 y: -5,
                 transition: { type: "spring", stiffness: 300 }
               }}
               style={{
                 padding: `clamp(0.75rem, 2vw, 1rem)`,
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)',
                 border: `1px solid rgba(255, 255, 255, 0.08)`,
                 borderRadius: '16px',
                 transition: 'all 0.3s ease'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
            <p 
                 className="font-bold mb-1 transition-all duration-300"
                 style={{ 
                   fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                   background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                   backgroundSize: '200% 200%',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   animation: 'gradientShift 8s ease infinite',
                   filter: 'drop-shadow(0 2px 10px rgba(160, 196, 255, 0.3))',
                   display: 'inline-block'
                 }}>
              2
            </p>
            <p className="text-xs uppercase tracking-wider font-medium transition-all duration-300" style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 10s ease infinite',
              filter: 'drop-shadow(0 1px 4px rgba(160, 196, 255, 0.2))',
              display: 'block'
            }}>New Zones</p>
          </motion.div>
          <motion.div 
               className="rounded-xl text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
               variants={{
                 hidden: { 
                   opacity: 0, 
                   y: 40,
                   scale: 0.8,
                   filter: 'blur(10px)'
                 },
                 visible: { 
                   opacity: 1, 
                   y: 0,
                   scale: 1,
                   filter: 'blur(0px)',
                   transition: {
                     type: "spring",
                     stiffness: 100,
                     damping: 12,
                     duration: 0.6
                   }
                 }
               }}
               whileHover={{
                 y: -5,
                 transition: { type: "spring", stiffness: 300 }
               }}
               style={{
                 padding: `clamp(0.75rem, 2vw, 1rem)`,
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)',
                 border: `1px solid rgba(255, 255, 255, 0.08)`,
                 borderRadius: '16px',
                 transition: 'all 0.3s ease'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
            <p 
                 className="font-bold mb-1 transition-all duration-300"
                 style={{ 
                   fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                   background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                   backgroundSize: '200% 200%',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   color: 'transparent',
                   animation: 'gradientShift 8s ease infinite',
                   WebkitAnimation: 'gradientShift 8s ease infinite',
                   filter: 'drop-shadow(0 2px 10px rgba(160, 196, 255, 0.3))',
                   display: 'inline-block'
                 }}>
              2025
            </p>
            <p className="text-xs uppercase tracking-wider font-medium transition-all duration-300" style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 10s ease infinite',
              filter: 'drop-shadow(0 1px 4px rgba(160, 196, 255, 0.2))',
              display: 'block'
            }}>Drill Program</p>
          </motion.div>
          <motion.div 
               className="rounded-xl text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
               variants={{
                 hidden: { 
                   opacity: 0, 
                   y: 40,
                   scale: 0.8,
                   filter: 'blur(10px)'
                 },
                 visible: { 
                   opacity: 1, 
                   y: 0,
                   scale: 1,
                   filter: 'blur(0px)',
                   transition: {
                     type: "spring",
                     stiffness: 100,
                     damping: 12,
                     duration: 0.6
                   }
                 }
               }}
               whileHover={{
                 y: -5,
                 transition: { type: "spring", stiffness: 300 }
               }}
               style={{
                 padding: `clamp(0.75rem, 2vw, 1rem)`,
                 background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)',
                 border: `1px solid rgba(255, 255, 255, 0.08)`,
                 borderRadius: '16px',
                 transition: 'all 0.3s ease'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                 e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
                 e.currentTarget.style.boxShadow = 'none';
               }}>
            <p 
                 className="font-bold mb-1 transition-all duration-300"
                 style={{ 
                   fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
                   background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                   backgroundSize: '200% 200%',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                   animation: 'gradientShift 8s ease infinite',
                   filter: 'drop-shadow(0 2px 10px rgba(160, 196, 255, 0.3))',
                   display: 'inline-block'
                 }}>
              6
            </p>
            <p className="text-xs uppercase tracking-wider font-medium transition-all duration-300" style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 10s ease infinite',
              filter: 'drop-shadow(0 1px 4px rgba(160, 196, 255, 0.2))',
              display: 'block'
            }}>Holes Completed</p>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 190, 152, 0.9) 0%, 
              rgba(255, 190, 152, 0.8) 30%,
              rgba(254, 217, 146, 0.7) 70%,
              rgba(255, 190, 152, 0.85) 100%)`,
            backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: `
              0 12px 48px 0 rgba(31, 38, 135, 0.2),
              0 8px 24px 0 rgba(255, 190, 152, 0.4),
              inset 0 3px 6px 0 rgba(255, 255, 255, 0.4),
              inset 0 -2px 4px 0 rgba(0, 0, 0, 0.15)
            `,
            borderRadius: '16px'
          }}
        >
          <div style={{ padding: `clamp(1.5rem, 4vw, 3rem)` }}>
            {/* Main Content */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Prospecting in 2024 of an emerging area of fresh outcrop (exposed because of melting icefields) quickly led to the discovery of two large mineralized zones. The first, called the Malachite Porphyry, is a 450m by 150m outcrop with widespread malachite (copper carbonate) staining and magnetite veinlets. Saw cuts into this showing revealed a mixture of pyrrhotite, pyrite and chalcopyrite with malachite on weathered surfaces. To the west a zone of en-echelon massive sulfide stringers (mostly pyrite and pyrrhotite with occasional chalcopyrite), now termed the Mitch zone, was observed for several hundred meters trending north.
              </p>
              
              {/* RAM Compilation Map - Professional Layout */}
              <div style={{ marginBottom: `clamp(1.5rem, 3vw, 2rem)` }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: `clamp(1.5rem, 3vw, 2rem)` }}>
                  {/* Map Image - Left Side (50% width) */}
                  <div className="lg:col-span-1 lg:row-span-2">
                    <div className="rounded-xl overflow-hidden"
                         style={{
                           background: 'linear-gradient(135deg, rgba(200, 200, 210, 0.95) 0%, rgba(220, 225, 230, 0.9) 50%, rgba(190, 195, 205, 0.95) 100%)',
                           backdropFilter: 'blur(20px) saturate(120%)',
                           WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                           border: '1px solid rgba(180, 185, 195, 0.6)',
                           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                         }}>
                      <div className="cursor-pointer group relative"
                           onClick={() => openModal('/images/ram-compilation-map.png', 'RAM Property Compilation Map - July 2025')}>
                        <img 
                          src="/images/ram-compilation-map.png"
                          alt="RAM Property Compilation Map showing Malachite Porphyry Zone and Mitch Zone"
                          className="w-full h-auto group-hover:scale-[1.02] transition-all duration-500 block"
                          style={{
                            objectFit: 'cover',
                            background: 'rgba(255, 255, 255, 0.02)'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t"
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(200, 200, 210, 0.95) 0%, rgba(220, 225, 230, 0.9) 50%, rgba(190, 195, 205, 0.95) 100%)',
                             backdropFilter: 'blur(20px) saturate(150%)',
                             WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                             borderTopColor: 'rgba(200, 200, 210, 0.5)',
                             boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                           }}>
                        <h4 className="font-semibold mb-2 text-center"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          RAM Property Compilation Map - July 2025
                        </h4>
                        <p className="text-sm text-center"
                           style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>
                          Click to view detailed geological features and sampling locations
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Column - Key Features and Drone Video */}
                  <div className="lg:col-span-1 flex flex-col" style={{ gap: `clamp(1rem, 2.5vw, 1.5rem)` }}>
                    {/* Key Geological Features - Top Right */}
                    <div className="rounded-xl"
                         style={{
                           padding: `clamp(1rem, 2.5vw, 1.25rem)`,
                           position: 'relative',
                           zIndex: 10,
                           background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                           backgroundColor: 'rgba(12, 14, 29, 0.6)',
                           backdropFilter: 'blur(20px) saturate(150%)',
                           WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                           border: '1px solid rgba(12, 14, 29, 0.6)',
                           boxShadow: '0 8px 32px 0 rgba(12, 14, 29, 0.4), inset 0 2px 4px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)'
                         }}>
                      <h4 className="font-semibold mb-3 text-lg"
                          style={{ 
                            fontFamily: "Aeonik Extended, sans-serif",
                            background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                            backgroundSize: '200% 200%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            animation: 'gradientShift 8s ease infinite'
                          }}>
                        Key Geological Features
                      </h4>
                      <ul className="text-sm space-y-2"
                          style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-400 mt-2"></span>
                          <span><strong>Malachite Porphyry Zone:</strong> 2.94% Cu, 1.27 g/t Au</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-2"></span>
                          <span><strong>Mitch Zone VMS:</strong> Up to 7.01 g/t Au</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2"></span>
                          <span><strong>Red Line Contact:</strong> Triassic-Jurassic boundary</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
                          <span><strong>2024 Sampling:</strong> Surface sample locations</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-400 mt-2"></span>
                          <span><strong>Strategic Position:</strong> Adjacent to Red Mountain</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-2"></span>
                          <span><strong>Regional Context:</strong> Within Goliath holdings</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => openModal('/images/ram-compilation-map.png', 'RAM Property Compilation Map - July 2025')}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full hover:scale-[1.02] transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.5) 0%, rgba(12, 14, 29, 0.4) 100%)',
                          border: '1px solid rgba(12, 14, 29, 0.7)',
                          fontFamily: "Aeonik Extended, sans-serif",
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.95)'
                        }}
                      >
                        <FiZoomIn className="w-4 h-4" />
                        View Full Size Map
                      </button>
                    </div>

                    {/* Drone Video Card - Bottom Right */}
                    <div className="rounded-xl overflow-hidden"
                         style={{
                           position: 'relative',
                           zIndex: 10,
                           background: 'linear-gradient(135deg, rgba(160, 196, 255, 0.4) 0%, rgba(200, 200, 210, 0.7) 50%, rgba(220, 225, 230, 0.9) 100%)',
                           backdropFilter: 'blur(20px) saturate(120%)',
                           WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                           border: '1px solid rgba(180, 185, 195, 0.6)',
                           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                         }}>
                      {/* Video Title */}
                      <div className="px-5 pt-4 pb-3">
                        <h4 className="font-semibold text-lg"
                            style={{ 
                              fontFamily: "Aeonik Extended, sans-serif",
                              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                              backgroundSize: '200% 200%',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              color: 'transparent',
                              animation: 'gradientShift 8s ease infinite',
                              WebkitAnimation: 'gradientShift 8s ease infinite',
                              filter: 'drop-shadow(0 1px 6px rgba(160, 196, 255, 0.4))',
                              display: 'inline-block'
                            }}>
                          Aerial Drone Footage
                        </h4>
                        <p className="text-sm mt-2"
                           style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>
                          High-resolution aerial survey of the RAM property
                        </p>
                      </div>

                      {/* Video Container */}
                      <MuxDroneVideo 
                        playbackId={currentDroneVideo === 1 ? MUX_PLAYBACK_IDS.ramdrone1 : MUX_PLAYBACK_IDS.ramdrone2}
                        title={currentDroneVideo === 1 ? 'RAM Property Drone Footage - View 1' : 'RAM Property Drone Footage - View 2'}
                        className="w-full"
                      />

                      {/* Video Controls - Below Video */}
                      <div className="px-5 py-5 flex gap-3 justify-center" style={{ 
                        background: 'linear-gradient(135deg, rgba(200, 200, 210, 0.95) 0%, rgba(220, 225, 230, 0.9) 50%, rgba(190, 195, 205, 0.95) 100%)',
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        boxShadow: 'inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                      }}>
                        <button
                          onClick={() => setCurrentDroneVideo(1)}
                          className={`px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] ${currentDroneVideo === 1 ? 'opacity-100' : 'opacity-70'}`}
                          style={{
                            background: `linear-gradient(135deg, 
                              rgba(255, 190, 152, 0.9) 0%, 
                              rgba(255, 190, 152, 0.8) 30%,
                              rgba(254, 217, 146, 0.7) 70%,
                              rgba(255, 190, 152, 0.85) 100%)`,
                            backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: palette.dark,
                            fontFamily: "Aeonik, sans-serif",
                            boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)'
                          }}
                        >
                          View 1
                        </button>
                        <button
                          onClick={() => setCurrentDroneVideo(2)}
                          className={`px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] ${currentDroneVideo === 2 ? 'opacity-100' : 'opacity-70'}`}
                          style={{
                            background: `linear-gradient(135deg, 
                              rgba(255, 190, 152, 0.9) 0%, 
                              rgba(255, 190, 152, 0.8) 30%,
                              rgba(254, 217, 146, 0.7) 70%,
                              rgba(255, 190, 152, 0.85) 100%)`,
                            backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: palette.dark,
                            fontFamily: "Aeonik, sans-serif",
                            boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)'
                          }}
                        >
                          View 2
                        </button>
                      </div>

                      {/* Video Info */}
                      <div className="px-5 py-3 border-t hidden"
                           style={{ 
                             borderTopColor: 'rgba(255, 255, 255, 0.1)'
                           }}>
                        <p className="text-sm text-center"
                           style={{ fontFamily: "Aeonik, sans-serif", color: 'rgba(255, 255, 255, 0.6)' }}>
                          {currentDroneVideo === 1 
                            ? 'Northern zone overview - Malachite Porphyry area'
                            : 'Southern zone overview - Mitch zone VMS targets'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Geological Context */}
            <section className="mb-10">
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                In this part of the Ram property, Upper Triassic Stuhini rocks and Lower Jurassic Hazelton volcano-sedimentary sequences are intruded by early Jurassic porphyries.  These are thought to be similar to the Goldslide and Hillside intrusive suites at the neighbouring Red Mountain property. This geological setting is favourable for both porphyry and VMS-style mineralization, but also, and probably most likely, for intrusive-related gold as in evidence at Red Mountain. Precious metal mineralization at Red Mountain has been described as high-grade (3 g/t to 20 g/t) gold in semi-tabular pyrite + pyrrhotite stockworks 5m to 29m thick with intense sericite alteration surrounded by disseminated sphalerite + pyrrhotite.  The largest of the deposits at Red Mountain, the Marc zone, graded 11.5 g/t gold.
              </p>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                [Note:  Please refer to the following article for a 1995 description of mineralization at Red Mountain.]
              </p>
              
              {/* Article Link */}
              <a href="#" className="inline-flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
                 style={{
                   background: `linear-gradient(135deg, 
                     rgba(255, 190, 152, 0.9) 0%, 
                     rgba(255, 190, 152, 0.8) 30%,
                     rgba(254, 217, 146, 0.7) 70%,
                     rgba(255, 190, 152, 0.85) 100%)`,
                   backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                   WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                   border: '1px solid rgba(255, 255, 255, 0.3)',
                   boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                   color: `${palette.dark}CC`,
                   fontFamily: "Aeonik, sans-serif",
                   fontSize: '0.875rem',
                   textDecoration: 'none'
                 }}>
                <FiExternalLink className="w-4 h-4" />
                Red Mountain Article (1995 Description)
              </a>
            </section>

            {/* 2025 Drill Program */}
            <section className="mb-10">
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                A 2025 drill program has started at the Ram and to date 6 holes have been completed.  See below for a select core sample from the Mitch zone.
              </p>
              
              {/* Core Sample Image - Professional Right-Side Layout */}
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                  {/* Core Analysis - Left Side */}
                  <div className="lg:col-span-1 lg:order-1 flex flex-col">
                    <div className="rounded-xl p-6"
                         style={{
                           background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                           backgroundColor: 'rgba(12, 14, 29, 0.6)',
                           backdropFilter: 'blur(20px) saturate(150%)',
                           WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                           border: '1px solid rgba(12, 14, 29, 0.6)',
                           boxShadow: '0 8px 32px 0 rgba(12, 14, 29, 0.4), inset 0 2px 4px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)'
                         }}>
                      <h4 className="font-semibold mb-4 text-lg text-white"
                          style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                        Core Analysis Results
                      </h4>
                      <ul className="text-sm space-y-3 text-white/80"
                          style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.6' }}>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-400 mt-2"></span>
                          <span><strong>Sulfide Minerals:</strong> Pyrite and pyrrhotite with chalcopyrite</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-copper-400 mt-2"></span>
                          <span><strong>Structure:</strong> En-echelon massive sulfide stringers</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-2"></span>
                          <span><strong>Mineralization:</strong> Visible copper mineralization</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
                          <span><strong>Alteration:</strong> VMS-style alteration patterns</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-400 mt-2"></span>
                          <span><strong>Condition:</strong> Fresh unweathered core sections</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => openModal('/images/ram-core-sample.png', 'Mitch Zone Core Sample - Enlarged View')}
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full text-white hover:text-green-200 transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          background: `linear-gradient(135deg, rgba(181, 204, 218, 0.15) 0%, rgba(181, 204, 218, 0.08) 100%)`,
                          border: `1px solid rgba(181, 204, 218, 0.3)`,
                          fontFamily: "Aeonik Extended, sans-serif",
                          fontWeight: 500
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-current">
                          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                          <path d="21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                          <path d="8 11h6M11 8v6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Enlarge Image
                      </button>
                    </div>

                    {/* Strategic Position */}
                    <div className="rounded-xl overflow-hidden mt-6 flex-grow flex flex-col"
                         style={{
                           position: 'relative',
                           zIndex: 10,
                           background: 'linear-gradient(135deg, rgba(160, 196, 255, 0.4) 0%, rgba(200, 200, 210, 0.7) 50%, rgba(220, 225, 230, 0.9) 100%)',
                           backdropFilter: 'blur(20px) saturate(120%)',
                           WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                           border: '1px solid rgba(180, 185, 195, 0.6)',
                           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                         }}>
                      <div className="px-5 pt-4 pb-3">
                        <h4 className="font-semibold text-lg"
                            style={{ 
                              fontFamily: "Aeonik Extended, sans-serif",
                              color: palette.dark
                            }}>
                          Strategic Position
                        </h4>
                      </div>
                      <div className="px-5 pb-4 flex-grow flex flex-col justify-center">
                        <p className="text-sm"
                           style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.8', color: `${palette.dark}CC` }}>
                          The Ram property sits in the heart of one of Canada's most active exploration regions, where recent discoveries by Goliath Resources and Dolly Varden Silver have renewed focus on the southern Golden Triangle. Silver Grail's legacy land position, with many claims staked over 30 years ago, now appears as strategic "islands" within Goliath's expanded holdings, potentially benefiting from the regional exploration momentum and geological understanding.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Core Sample Image - Right Side */}
                  <div className="lg:col-span-1 lg:order-2">
                    <div className="rounded-xl overflow-hidden"
                         style={{
                           position: 'relative',
                           zIndex: 10,
                           background: 'linear-gradient(135deg, rgba(160, 196, 255, 0.4) 0%, rgba(200, 200, 210, 0.7) 50%, rgba(220, 225, 230, 0.9) 100%)',
                           backdropFilter: 'blur(20px) saturate(120%)',
                           WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                           border: '1px solid rgba(180, 185, 195, 0.6)',
                           boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                         }}>
                      <div 
                        className="cursor-pointer group relative"
                        ref={coreImageRef}
                        onMouseMove={handleCoreImageMouseMove}
                        onMouseEnter={handleCoreImageMouseEnter}
                        onMouseLeave={handleCoreImageMouseLeave}
                        onClick={() => openModal('/images/ram-core-sample.png', 'Mitch Zone Core Sample - Enlarged View')}
                        style={{ 
                          cursor: isHovering && !isMobile ? 'none' : 'pointer',
                          position: 'relative'
                        }}
                      >
                        <img 
                          src="/images/ram-core-sample.png"
                          alt="Select core sample from the Mitch zone showing sulfide mineralization"
                          className="w-full h-full transition-all duration-500"
                          style={{
                            minHeight: '400px',
                            maxHeight: '500px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Magnifying Glass Effect */}
                        {isHovering && !isMobile && (
                          <div
                            className="absolute pointer-events-none z-30"
                            style={{
                              left: `${mousePosition.x}%`,
                              top: `${mousePosition.y}%`,
                              transform: 'translate(-50%, -50%)',
                              width: '200px',
                              height: '200px',
                              borderRadius: '50%',
                              border: '4px solid rgba(255, 255, 255, 0.95)',
                              boxShadow: '0 0 35px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                              overflow: 'hidden',
                              background: '#000'
                            }}
                          >
                            {/* Magnified Image */}
                            <img
                              src="/images/ram-core-sample.png"
                              alt=""
                              style={{
                                position: 'absolute',
                                width: '1200px',
                                height: 'auto',
                                left: `${100 - (mousePosition.x / 100) * 1200}px`,
                                top: `${100 - (mousePosition.y / 100) * 1200}px`,
                                maxWidth: 'none',
                                minWidth: '1200px'
                              }}
                            />
                            
                            {/* Magnifying Glass Handle */}
                            <div
                              className="absolute"
                              style={{
                                bottom: '-25px',
                                right: '-15px',
                                width: '35px',
                                height: '4px',
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '3px',
                                transform: 'rotate(45deg)',
                                boxShadow: '0 3px 12px rgba(0, 0, 0, 0.7)'
                              }}
                            />
                            
                            {/* Glass Reflection Effect */}
                            <div
                              className="absolute inset-0 rounded-full"
                              style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 30%, transparent 70%, rgba(255, 255, 255, 0.1) 100%)'
                              }}
                            />
                          </div>
                        )}

                        {/* Hover Instructions */}
                        <div className="absolute bottom-4 left-4 bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-green-200 text-sm font-medium" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            🔍 Hover to magnify • Click for full view
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-4 border-t"
                           style={{ 
                             background: 'linear-gradient(135deg, rgba(200, 200, 210, 0.95) 0%, rgba(220, 225, 230, 0.9) 50%, rgba(190, 195, 205, 0.95) 100%)',
                             backdropFilter: 'blur(20px) saturate(150%)',
                             WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                             borderTopColor: 'rgba(200, 200, 210, 0.5)',
                             boxShadow: 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                           }}>
                        <h4 className="font-semibold mb-2 text-center"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          Mitch Zone Core Sample - 2025 Drill Program
                        </h4>
                        <p className="text-sm text-center"
                           style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>
                          Sulfide mineralization with visible copper content - Hover to magnify details
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* News Release */}
            <section className="text-center">
              <p className="leading-relaxed mb-6 text-lg md:text-xl font-medium"
                 style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>
                For further details of past work on the Ram please refer to the news release dated August 25, 2025.
              </p>
              
              <a href="/news/silver-grail-drills-ram-property-in-bc-s-active-golden-triangle" className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02]"
                 style={{
                   background: `linear-gradient(135deg, 
                     rgba(255, 190, 152, 0.9) 0%, 
                     rgba(255, 190, 152, 0.8) 30%,
                     rgba(254, 217, 146, 0.7) 70%,
                     rgba(255, 190, 152, 0.85) 100%)`,
                   backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                   WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                   border: '1px solid rgba(255, 255, 255, 0.3)',
                   boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                   color: `${palette.dark}CC`,
                   fontFamily: "Aeonik Extended, sans-serif",
                   fontWeight: 500,
                   fontSize: '0.95rem',
                   textDecoration: 'none'
                 }}>
                <FiExternalLink className="w-5 h-5" />
                News Release - August 25, 2025
              </a>
            </section>
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex justify-between items-center"
        >
          <Link href="/properties" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 190, 152, 0.9) 0%, 
                    rgba(255, 190, 152, 0.8) 30%,
                    rgba(254, 217, 146, 0.7) 70%,
                    rgba(255, 190, 152, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: palette.dark
                }}>
            <FiArrowLeft className="w-5 h-5" />
            <span style={{ fontFamily: "Aeonik, sans-serif", color: palette.dark }}>All Properties</span>
          </Link>
        </motion.div>
      </div>

      {/* Image Modal with Zoom */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
            onClick={closeModal}
          >
            <div className="relative w-full max-w-7xl p-4 flex flex-col min-h-screen mt-20 md:mt-24">
              {/* Close Button Only */}
              <div className="sticky top-24 md:top-28 float-right z-10 mb-4">
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(255, 190, 152, 0.9) 0%, 
                    rgba(255, 190, 152, 0.8) 30%,
                    rgba(254, 217, 146, 0.7) 70%,
                    rgba(255, 190, 152, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: palette.dark
                }}
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Image Container - Scrollable */}
              <div className="flex-1 relative flex justify-center mb-4">
                <img
                  src={modalImage.src}
                  alt={modalImage.title}
                  className="w-auto h-auto object-contain"
                  style={{ 
                    maxWidth: '100%'
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Close Button */}
              <div className="text-center flex-shrink-0 pb-20">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    fontFamily: "Aeonik, sans-serif",
                    background: `linear-gradient(135deg, 
                      rgba(255, 190, 152, 0.9) 0%, 
                      rgba(255, 190, 152, 0.8) 30%,
                      rgba(254, 217, 146, 0.7) 70%,
                      rgba(255, 190, 152, 0.85) 100%)`,
                    backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: palette.dark
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* CSS Animation for gradient text */}
      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}
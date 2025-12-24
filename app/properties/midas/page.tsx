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
// Remove BackgroundMap import - we'll use the mountain background instead

// New color palette matching properties page
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

export default function MidasPropertyPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
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
            Midas Property
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
              <span style={{ display: 'block' }}>High-grade gold discovery with</span>
              <span style={{ display: 'block', marginTop: '0.3rem' }}>untested ZTEM anomalies</span>
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
              3.0 oz/ton
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
            }}>Gold Discovery</p>
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
            }}>ZTEM Anomalies</p>
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
              25/75%
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
            }}>SVG/Teuton</p>
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
              2018
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
            }}>ZTEM Survey</p>
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
            {/* Discovery Story */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Alex Walus, an émigré from Poland whose first job in Canada as a geologist was for Silver Grail and Teuton, discovered a piece of quartz float one afternoon while making a traverse through the Midas property.  When the assay came back at 3.0 oz/ton gold he could not believe it and decided to return to the same spot for another sample.  That one too ran 3.0 oz/ton, although there was nothing else visible in the quartz to account for such a high value.
              </p>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Later on a vein was found close by and consequently sampled at many locations.   It became known as the "3 Ounce Vein".
              </p>
            </section>

            {/* Drilling and Exploration */}
            <section className="mb-10">
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                A few years later the property was under option to Sabina Silver who carried out a drill program over the claim.  The second hole of the program intersected 2.52 g/t gold (0.07 oz/ton) over an estimated true width of 29.2 meters or 96 feet in near surface mineralization. A sub-interval within this ran 26.77 g/t gold (0.78 oz per ton) over 0.7 meter.  Although Sabina Silver finally dropped the option, there is still much exploration to be done in the immediate area, the more so because the grade obtained in the second hole of 2006 suggests good potential for defining a bulk tonnage deposit owing to recent dramatic increases in the price of gold.
              </p>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                A Geotech ZTEM airborne survey was flown over the property in 2018 disclosing target areas on the Midas property.  [cf. 2018 Geotech ZTEM Survey – Target Map]
              </p>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Two large ZTEM anomalies were detected in the eastern part of the property both of which remain to be drill tested.  A third target, suggesting a porphyry copper deposit, was located in the western part.  Limited geochemical sampling done in the area in 2024 returned anomalous copper values.
              </p>
            </section>

            {/* Property Location and Ownership */}
            <section className="mb-10">
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Ownership of the Midas property is presently 25% Silver Grail and 75% Teuton Resources Corp.  It is located approximately 17 miles east of Stewart, British Columbia, in the upper drainage area of the White River system. Nearest road access is about five miles to the east, at the western end of a network of logging roads connecting to Highway 37.   Significantly, Willoughby Creek, one of the few gold-bearing placer streams in the Stewart area, cuts west-east across the property.
              </p>
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
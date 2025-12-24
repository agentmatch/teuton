'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { FiArrowLeft, FiExternalLink, FiMapPin, FiActivity, FiX, FiZoomIn, FiZoomOut } from 'react-icons/fi'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

// New color palette matching RAM property
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

export default function GoldMountainPropertyPage() {
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
          className="absolute"
          style={{ 
            zIndex: 20,
            top: 0,
            left: '-2rem'
          }}
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
            Gold Mountain Property
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
              <span style={{ display: 'block' }}>High-grade gold discovery adjacent to</span>
              <span style={{ display: 'block', marginTop: '0.3rem' }}>Red Mountain gold property</span>
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
              0.632
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
            }}>oz/ton Au</p>
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
              300m
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
            }}>x 200m Zone</p>
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
              11.5
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
            }}>g/t Au Marc Zone</p>
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
              Adjacent
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
            }}>Red Mountain</p>
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
            {/* Summary Section */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <h2 className="text-2xl md:text-3xl font-semibold"
                  style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500, color: palette.dark }}>
                Summary
              </h2>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                The Gold Mountain property consists of a large number of claims adjoining on the east side of the Red Mountain property and west of the Willoughby gold-silver property. Only a small fraction of these claims have been examined. In one locality to the south on the former Bud claims, Silver Grail personnel found two areas of interest: in the first, a 200 by 300m wide zone of pervasive quartz calcite veinlets was found to carry gold values up to 0.632oz/ton; in the second area, chalcopyrite and bornite mineralization are found associated with hornblende diorite dykes. No follow-up work has been undertaken. The property retains significant potential for Red Mountain type, high-grade gold and silver mineralization.
              </p>
            </section>

            {/* Red Mountain Property Section */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <h2 className="text-2xl md:text-3xl font-semibold"
                  style={{ 
                    marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                    fontFamily: "Aeonik Extended, sans-serif", 
                    fontWeight: 500, 
                    color: palette.dark 
                  }}>
                Red Mountain Property
              </h2>
              <p className="leading-relaxed"
                 style={{ 
                   marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC` 
                 }}>
                The Red Mountain gold property currently owned by Ascot Resources contains the most developed deposits in the immediate area. These high-grade, gold-silver deposits have obtained final approval from federal and provincial authorities, with a production decision anticipated in the near future.
              </p>
              <p className="leading-relaxed"
                 style={{ 
                   marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC` 
                 }}>
                Discovered in 1989, the Red Mountain property was explored extensively until 1996 by Lac Minerals Ltd. and Royal Oak Mines Inc., with 466 diamond drill holes and over 2,000 metres of underground development completed, along with extensive engineering and environmental baseline work. Additional studies were completed over the past 12 years by Seabridge, North American Metals Corp. and Banks Island Gold Ltd.
              </p>
              <p className="leading-relaxed"
                 style={{ 
                   marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC` 
                 }}>
                Red Mountain is a 14-square-kilometre hydrothermal system within the Stikine terrain. Gold mineralization is associated with and partially hosted within an early to mid-Jurassic multiphase intrusive complex, with associated volcanic and volcaniclastic rocks and sediments. Many gold mineralized zones occur on the property, including four mineralized zones with established resource estimates. Three of the four mineralized zones have been folded and are separated by dip-slip fault zones: the Marc, AV and JW zones. These mineralized zones are moderate to steeply dipping, roughly tabular and vary in widths from one to 40 metres, averaging about 15 metres in thickness. Gold and silver tellurides, and free milling mineralization are associated with stockworks, dissemination and patches of coarse-grained pyrite. Alteration facies includes strong quartz-sericite alteration.
              </p>
              <p className="leading-relaxed"
                 style={{ 
                   marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC` 
                 }}>
                Throughout the property, multiple high-grade areas have been identified through surface sampling and local drilling by previous explorers. Of particular significance, since the vast majority of exploration work was completed on the property during 1996, and prior glacial retreat surrounding known mineralized areas has been very extensive, with up to a kilometre at the south end of the property.
              </p>
              <p className="leading-relaxed"
                 style={{ 
                   marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC` 
                 }}>
                IDM Mining purchased the Red Mountain property from Seabridge Gold in 2014 and thereafter steadily advanced the project. In 2019, IDM was taken over by Ascot Resources, owner of the Premier Mine and associated Big Missouri and Dilworth properties.
              </p>
            </section>

            {/* Red Mountain Resources Section */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <h2 className="text-2xl md:text-3xl font-semibold"
                  style={{ 
                    marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                    fontFamily: "Aeonik Extended, sans-serif", 
                    fontWeight: 500, 
                    color: palette.dark 
                  }}>
                Current 2019 Red Mountain Resources
              </h2>
              
              {/* Resource Table */}
              <div className="overflow-x-auto" style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)` }}>
                <div className="rounded-xl overflow-hidden"
                     style={{
                       background: 'rgba(255, 255, 255, 0.05)',
                       border: '1px solid rgba(13, 15, 30, 0.15)',
                       boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
                     }}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'rgba(13, 15, 30, 0.08)' }}>
                        <th className="p-4 text-left font-semibold"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          Class
                        </th>
                        <th className="p-4 text-left font-semibold"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          In situ Tonnes (000's)
                        </th>
                        <th className="p-4 text-left font-semibold"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          Au g/t
                        </th>
                        <th className="p-4 text-left font-semibold"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          Ag g/t
                        </th>
                        <th className="p-4 text-left font-semibold"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          Au (000's oz)
                        </th>
                        <th className="p-4 text-left font-semibold"
                            style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                          Ag (000's oz)
                        </th>
                      </tr>
                    </thead>
                    <tbody style={{ fontFamily: "Aeonik, sans-serif" }}>
                      <tr className="border-t" style={{ borderColor: 'rgba(13, 15, 30, 0.1)' }}>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>Measured</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>1,920</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>8.8</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>128.3</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>543,800</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>7,947,000</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: 'rgba(13, 15, 30, 0.1)' }}>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>Indicated</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>1,298</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>5.85</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>10.01</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>238,800</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>408,800</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: 'rgba(13, 15, 30, 0.1)', background: 'rgba(13, 15, 30, 0.05)' }}>
                        <td className="p-4 font-semibold" style={{ color: palette.dark }}>Total M&I</td>
                        <td className="p-4 font-semibold" style={{ color: palette.dark }}>3,218</td>
                        <td className="p-4 font-semibold" style={{ color: palette.dark }}>7.63</td>
                        <td className="p-4 font-semibold" style={{ color: palette.dark }}>21.02</td>
                        <td className="p-4 font-semibold" style={{ color: palette.dark }}>782,600</td>
                        <td className="p-4 font-semibold" style={{ color: palette.dark }}>2,155,800</td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: 'rgba(13, 15, 30, 0.1)' }}>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>Inferred</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>405</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>5.32</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>7.3</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>69,300</td>
                        <td className="p-4" style={{ color: `${palette.dark}CC` }}>95,500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resource Notes */}
              <div className="rounded-xl p-6"
                   style={{
                     background: 'rgba(255, 255, 255, 0.03)',
                     border: '1px solid rgba(13, 15, 30, 0.1)',
                     boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.05)'
                   }}>
                <h4 className="font-semibold mb-3 text-sm"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                  Notes for Red Mountain Resources:
                </h4>
                <ul className="text-xs space-y-1"
                    style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.5', color: `${palette.dark}B3` }}>
                  <li>1. Red Mountain Resources are reported at a 3.0 g/t Au cut-off</li>
                  <li>2. The Red Mountain Gold Project arise from the press release dated October 31, 2019 authored by Gilles Arsenault, P.Geo, a Qualified Person as defined by NI 43-101 as filed on Sedar.</li>
                  <li>3. The effective date and report date and of the NI 43-101 report are; August 30, 2019 and November 22, 2019, respectively</li>
                  <li>4. Numbers may not sum due to rounding</li>
                </ul>
              </div>
            </section>

            {/* Key Highlights */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <h2 className="text-2xl md:text-3xl font-semibold"
                  style={{ 
                    marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                    fontFamily: "Aeonik Extended, sans-serif", 
                    fontWeight: 500, 
                    color: palette.dark 
                  }}>
                Key Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: `clamp(1rem, 3vw, 1.5rem)` }}>
                <div className="rounded-xl p-6"
                     style={{
                       background: 'rgba(255, 255, 255, 0.05)',
                       border: '1px solid rgba(13, 15, 30, 0.15)',
                       boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
                     }}>
                  <h4 className="font-semibold mb-4 text-lg"
                      style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                    High-Grade Discovery
                  </h4>
                  <ul className="text-sm space-y-2"
                      style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.6', color: `${palette.dark}CC` }}>
                    <li>• Gold values up to 0.632 oz/ton</li>
                    <li>• 200m x 300m mineralized zone</li>
                    <li>• Pervasive quartz calcite veinlets</li>
                    <li>• Copper mineralization (chalcopyrite, bornite)</li>
                    <li>• Hornblende diorite dyke association</li>
                  </ul>
                </div>
                
                <div className="rounded-xl p-6"
                     style={{
                       background: 'rgba(255, 255, 255, 0.05)',
                       border: '1px solid rgba(13, 15, 30, 0.15)',
                       boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.1)'
                     }}>
                  <h4 className="font-semibold mb-4 text-lg"
                      style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>
                    Strategic Position
                  </h4>
                  <ul className="text-sm space-y-2"
                      style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.6', color: `${palette.dark}CC` }}>
                    <li>• Adjacent to Red Mountain deposits</li>
                    <li>• 782,600 oz Au M&I at Red Mountain</li>
                    <li>• Production decision anticipated</li>
                    <li>• Marc zone averages 11.5 g/t gold</li>
                    <li>• 14 km² hydrothermal system</li>
                  </ul>
                </div>
              </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
            onClick={closeModal}
          >
            <div className="relative w-full h-full max-w-7xl max-h-screen p-4 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-white text-lg font-semibold"
                    style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                  {modalImage.title}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Image Container - Pure Black Background */}
              <div className="flex-1 relative flex items-center justify-center rounded-lg" style={{ backgroundColor: '#000000' }}>
                <img
                  src={modalImage.src}
                  alt={modalImage.title}
                  className="max-w-full max-h-full object-contain"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center text-white/60 text-sm flex-shrink-0">
                ESC or click outside to close
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
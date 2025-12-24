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

// Color palette matching RAM property
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

export default function ClonePropertyPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  
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

  const closeModal = (e?: React.MouseEvent) => {
    e?.stopPropagation()
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
        {/* Aurora gradient overlay with 3 layers */}
        <div className="absolute inset-0 overflow-hidden"
             style={{ 
               willChange: 'transform',
               transform: 'translateZ(0)'
             }}>
          {/* Layer 1: Base gradient */}
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
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 8s ease infinite',
              filter: 'drop-shadow(0 2px 20px rgba(160, 196, 255, 0.3))',
              mixBlendMode: 'screen',
            }}>
            Clone Property
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 10s ease infinite',
                letterSpacing: '0.02em',
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))',
              }}
            >
              <span style={{ display: 'block' }}>High-grade gold-cobalt shear zones</span>
              <span style={{ display: 'block', marginTop: '0.3rem' }}>near the legendary Red Line</span>
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
              500m
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
            }}>Strike Length</p>
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
              137.1 g/t
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
            }}>Bulk Sample Au</p>
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
              $7M
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
            }}>Investment</p>
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
            }}>IP Survey</p>
          </motion.div>
        </motion.div>

        {/* Main Content Container with Peachy Glassmorphic Styling */}
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
            {/* Discovery Overview Section */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                The Clone property is situated 16km northwest of Goliath Resources' Surebet discovery. Mineralized occurrences on both properties lie in close proximity to Kyba's "Red Line", a regional horizon that is an important marker for large-scale deposits within the Golden Triangle.
              </p>
              
              {/* Two-column layout matching RAM design */}
              <div style={{ marginBottom: `clamp(1.5rem, 3vw, 2rem)` }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: `clamp(1.5rem, 3vw, 2rem)` }}>
                  {/* Map - Left Side */}
                  <div className="lg:col-span-1">
                    <div className="overflow-hidden">
                      <div 
                        className="cursor-pointer group relative"
                        style={{
                          aspectRatio: '1/1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        ref={imageRef}
                        onClick={() => openModal('/images/ram-compilation-map.png', 'Clone Property Compilation Map')}
                      >
                        <Image
                          src="/images/ram-compilation-map.png"
                          alt="Clone Property Compilation Map"
                          fill
                          style={{ 
                            objectFit: 'contain',
                            objectPosition: 'center'
                          }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Side Column - Key Features */}
                  <div className="lg:col-span-1 flex flex-col" style={{ gap: `clamp(1rem, 2.5vw, 1.5rem)` }}>
                    {/* Discovery Details - Top Right */}
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
                        High-Grade Discovery
                      </h4>
                      <ul className="text-sm space-y-2"
                          style={{ fontFamily: "Aeonik, sans-serif", lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-400 mt-2"></span>
                          <span><strong>Main Zone:</strong> 500m strike length, 130m vertical range</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-2"></span>
                          <span><strong>H-1 Structure:</strong> 32.9ft @ 1.28 oz/t Au (Hole #110)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
                          <span><strong>S-2A Zone:</strong> 19.7ft @ 1.53 oz/t Au, 0.33% Co</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-400 mt-2"></span>
                          <span><strong>Bulk Sample:</strong> 102 tons @ 137.1 g/t Au (4.0 oz/t)</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2"></span>
                          <span><strong>Red Line Proximity:</strong> Near regional contact zone</span>
                        </li>
                      </ul>
                    </div>

                    {/* Strategic Position */}
                    <div className="rounded-xl overflow-hidden flex-grow flex flex-col"
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
                          Located just 16km from Goliath Resources' Surebet discovery, the Clone property benefits from its proximity to Kyba's "Red Line" - a critical geological marker associated with world-class Golden Triangle deposits. The 1995 discovery triggered significant industry interest, leading to a $2.6M investment from Prime Resources-Homestake Canada, owners of the renowned Eskay Creek mine.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Exploration History */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                High-grade, gold-bearing shear zones were discovered in 1995 on the Clone property at the head of Sutton Glacier, triggering a staking rush in the immediate area and ultimately leading to a cash infusion of $2.6 million into joint owners Silver Grail and Teuton by Prime Resources-Homestake Canada, two companies which owned the rich Eskay Creek mine. Drilling programs from 1995-97 defined several high-grade gold shoots within the Main Zone, situated at the southeastern end of a 3km long package of volcanic and sedimentary rocks.
              </p>
            </section>

            {/* Main Zone Details */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                High-grade gold and gold-cobalt mineralization occurs on the Clone property within a series of sub-parallel shears exposed over a strike length of 500m and a vertical range of 130m. Trenching of the shears returned values ranging up to 3.59 oz/ton gold over 5.5m (18 feet). Significant cobalt values were found to accompany gold in the southeast portion of the zone.
              </p>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Drilling in 1995-96 was confined to the 500m long Main Zone at the south end of the mineralized system, overlapping the original discovery area. The most promising structure outlined by the drilling was the "H-1" which yielded many holes carrying high-grade gold mineralization over significant widths. The best of these was Hole #110 which contained a 32.9 foot intercept grading 1.28 oz/ton gold. Some outstanding intersections were also reported from the parallel S-2A structure, known from trenching to host both gold and cobalt mineralization. Hole #18 into the S-2A contained a 19.7 foot intercept grading 1.53 oz/ton gold and 0.33% cobalt.
              </p>
            </section>

            {/* Bulk Sampling Results */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                In 2010 a bulk sampling program was commenced on the Clone property in the high-grade portion of the H-1 zone. A total of 34 samples taken from the one-ton lots comprising the 2010 Clone bulk sample returned an average grade of 68.65 g/t gold. A larger bulk sample of 102 tons was taken in 2011 which averaged 137.1 g/t gold (4.0 oz/ton gold). Approximately $7 million has been spent on the property to date.
              </p>
            </section>

            {/* Recent Exploration */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                From 2003 to 2004 small scale prospecting and geochemical sampling has outlined a new area of interest lying 500m southwest of the previously explored Main Zone. This area, lying very close to the "Red Line", features many samples with copper values and is now tentatively interpreted as being the distal expression of a possible porphyry copper-gold deposit at depth. Cross-cutting structures in this locality contain high-grade gold values to 63 g/t. Anomalous values in molybdenum, bismuth and tungsten have been found in many rocks sampled in the area. Felsic and porphyritic dykes of Tertiary age also occur.
              </p>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                Weather permitting, an IP survey is scheduled for September of 2025.
              </p>
            </section>

            {/* IP Survey CTA */}
            <section className="text-center">
              <p className="leading-relaxed mb-6 text-lg md:text-xl font-medium"
                 style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>
                For updates on the upcoming IP survey and exploration results, follow our latest news releases.
              </p>
              
              <a href="/news" className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02]"
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
                View Latest News
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
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal(e)
              }
            }}
          >
            <div className="relative w-full max-w-7xl p-4 flex flex-col min-h-screen mt-20 md:mt-24">
              {/* Close Button Only */}
              <div className="sticky top-24 md:top-28 float-right z-10 mb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeModal(e)
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation()
                    closeModal(e)
                  }}
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

      <style jsx global>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
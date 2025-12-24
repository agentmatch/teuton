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

const MuxDroneVideo = dynamic(
  () => import('@/components/ram/MuxDroneVideo').then(mod => ({ default: mod.MuxDroneVideo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    )
  }
)

// Remove BackgroundMap import - we'll use the mountain background instead

// New color palette matching properties page
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}


export default function FijiPropertyPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
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

  const closeModal = () => {
    setModalImage(null)
  }

  // Magnifying glass handlers
  const handleImageMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current || isMobile) return
    
    const containerRect = imageRef.current.getBoundingClientRect()
    const img = imageRef.current.querySelector('img')
    
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

  const handleImageMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true)
    }
  }

  const handleImageMouseLeave = () => {
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
            Fiji Property
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
              <span style={{ display: 'block' }}>High-grade gold discovery within</span>
              <span style={{ display: 'block', marginTop: '0.3rem' }}>the prolific Kitsault Valley Trend</span>
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
              1,250
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
              47.1
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
            }}>g/t Au Max</p>
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
              5/16
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
            }}>Samples &gt;11 g/t</p>
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
              2006
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
            }}>Discovery</p>
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
                High gold values have been found on surface in the northern part of the Fiji property within the northwest-trending Kitsault Valley Trend (as defined by Dolly Varden Silver, owner of the major property adjoining to the east).  Five out of sixteen samples returned gold values higher than 11 g/t, ranging from 11.21 to 47.1 g/t gold
              </p>
              
              {/* Goliath Map Placeholder - Professional Layout */}
              <div style={{ marginBottom: `clamp(1.5rem, 3vw, 2rem)` }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: `clamp(1.5rem, 3vw, 2rem)` }}>
                  {/* Goliath Map - Left Side (50% width) */}
                  <div className="lg:col-span-1 lg:row-span-2">
                    <div className="overflow-hidden">
                      <div className="cursor-pointer group relative"
                           style={{
                             aspectRatio: '1/1',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                           }}
                           onClick={() => openModal('/images/Fiji-Goliath-Regional-Map.png', 'Fiji Property Location Map')}>
                        <Image
                          src="/images/Fiji-Goliath-Regional-Map.png"
                          alt="Fiji Property Location Map"
                          fill
                          style={{ 
                            objectFit: 'contain',
                            objectPosition: 'center'
                          }}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <FiZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Column - Key Features */}
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
                          <span><strong>High-Grade Zone:</strong> 5 of 16 samples &gt;11 g/t Au</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-green-400 mt-2"></span>
                          <span><strong>Maximum Grade:</strong> 47.1 g/t Au surface sample</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 mt-2"></span>
                          <span><strong>Kitsault Valley Trend:</strong> Northwest-trending structure</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2"></span>
                          <span><strong>New Exposures:</strong> Recently exposed quartz-carbonate structure</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-400 mt-2"></span>
                          <span><strong>Strategic Location:</strong> Adjacent to Homestake Ridge</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-2"></span>
                          <span><strong>Untested Potential:</strong> Steep cliff faces to north</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => openModal('/images/goliath-map-placeholder.png', 'Goliath Map - Fiji Property Location')}
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
                  </div>
                </div>
              </div>
            </section>

            {/* Continue with additional content paragraphs */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed"
                 style={{ marginBottom: `clamp(1rem, 3vw, 1.5rem)`, fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC` }}>
                The Kitsault Valley trend begins in the Dolly Varden silver-bearing deposits to the south (Torbrit, Dolly Varden, Wolf, Moose, etc.) and continues northwest into and past the Homestake Ridge gold-silver deposit.  Anomalous gold and silver soil and rock geochemistry has been found by Dolly Varden stretching northwest from the Homestake Ridge deposit to the common border between the Fiji property and the Homestake Ridge property.  The high gold values found on the Fiji are just east of this common border on Fiji ground. Continuation of this trend is down a steep cliff to the north which remains to be sampled by mountaineering geologists.
              </p>
              
              {/* Recently Exposed Vein Section with Video */}
              <div className="grid grid-cols-1 lg:grid-cols-2 items-start" style={{ gap: `clamp(1.5rem, 3vw, 2rem)`, alignItems: 'flex-start' }}>
                {/* Text Content - Left Side */}
                <div className="lg:col-span-1">
                  <p className="leading-relaxed"
                     style={{ fontFamily: "Aeonik, sans-serif", fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', color: `${palette.dark}CC`, marginTop: '0' }}>
                    Further to the northwest, still in the Kitsault Valley Trend, ablation of snow and ice in recent years has exposed a strong, quartz-carbonate structure.  This structure has the potential to carry silver-bearing shoots as found by recent drilling on Dolly Varden's Wolf vein.  It has not yet been drill-tested.
                  </p>
                </div>
                
                {/* Video - Right Side (moved up) */}
                <div className="lg:col-span-1" style={{ marginTop: '-1rem' }}>
                  <div className="rounded-xl overflow-hidden"
                       style={{
                         background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                         backgroundColor: 'rgba(12, 14, 29, 0.6)',
                         backdropFilter: 'blur(20px) saturate(150%)',
                         WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                         border: '1px solid rgba(12, 14, 29, 0.6)',
                         boxShadow: '0 8px 32px 0 rgba(12, 14, 29, 0.4), inset 0 2px 4px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)'
                       }}>
                    <div style={{ padding: `clamp(1rem, 2.5vw, 1.25rem)` }}>
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
                        Recently Exposed Vein
                      </h4>
                      <div className="aspect-video rounded-lg overflow-hidden">
                        <MuxDroneVideo
                          playbackId="WIXSFwdLIH00vBpzhO5AhjLRa3eKKOEJ3EEeNqc7LCdo"
                          title="Recently Exposed Vein - Fiji Property"
                          autoPlay
                          muted
                          loop
                          playbackRate={0.75}
                        />
                      </div>
                      <p className="text-sm mt-3"
                         style={{ 
                           fontFamily: "Aeonik, sans-serif", 
                           color: 'rgba(255, 255, 255, 0.7)',
                           lineHeight: '1.5'
                         }}>
                        Quartz-carbonate structure exposed by recent snow and ice ablation
                      </p>
                    </div>
                  </div>
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
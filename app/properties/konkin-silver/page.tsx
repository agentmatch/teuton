'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiExternalLink, FiMapPin, FiInfo, FiDownload, FiMaximize2 } from 'react-icons/fi'
import dynamic from 'next/dynamic'

const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0" />
})

const palette = {
  dark: '#0d0f1e',
  blue: '#5c7ca3',
  light: '#b5ccda',
  peach: '#ffbe98',
  yellow: '#fed992'
}

export default function KonkinSilverPropertyPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState('')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const openImageModal = (imageSrc: string) => {
    setModalImage(imageSrc)
    setShowImageModal(true)
  }

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

      {/* Gold dust particles */}
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
          <Link href="/properties" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
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
            Konkin Silver Property
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
              <span style={{ display: 'block' }}>Multiple High-Grade Silver Targets</span>
              <span style={{ display: 'block', marginTop: '0.3rem' }}>ZTEM Anomalies & Historic Silver Showings</span>
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Grid */}
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
              1,070 oz/t
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
            }}>Ag Max Sample</p>
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
              5
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
            }}>Mineralized Structures</p>
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
        </motion.div>

        {/* Main Content Container */}
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
                  style={{ 
                    marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                    fontFamily: "Aeonik Extended, sans-serif", 
                    fontWeight: 500, 
                    color: palette.dark 
                  }}>
                Summary
              </h2>
              <p className="leading-relaxed"
                 style={{ 
                   marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC` 
                 }}>
                The Konkin Silver property has multiple targets. A Geotech ZTEM survey carried out in 2018 identified two large ZTEM anomalies—"A-9" and "A-10"-- in the eastern portion of the property. In the west, the same survey identified a porphyry copper-gold target called the "P-3". The ZTEM anomalies form a northerly-trending chain along a volcanic-sediment contact. In the Del Norte property to the north (now owned by Teuton and Decade Resources), one of these ZTEM anomalies overlies the LG Vein which has been tested by many drill holes, many of them returning high-grade gold and silver values. The vein strikes for over 500m.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Goliath Map */}
                <div>
                  <div 
                    className="relative overflow-hidden cursor-pointer group"
                    onClick={() => openImageModal('/images/konkin-silver-ztem-map.png')}
                    style={{
                      aspectRatio: '1/1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Image
                      src="/images/konkin-silver-ztem-map.png"
                      alt="2018 Geotech VTEM Survey Map"
                      fill
                      style={{ 
                        objectFit: 'contain',
                        objectPosition: 'center'
                      }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                         style={{ backgroundColor: 'rgba(13, 15, 30, 0.8)' }}>
                      <FiMaximize2 className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                {/* Western Structures Info */}
                <div className="space-y-4">
                  <div className="rounded-xl"
                       style={{
                         background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                         backdropFilter: 'blur(20px) saturate(150%)',
                         WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                         border: '1px solid rgba(12, 14, 29, 0.6)',
                         padding: '1.5rem'
                       }}>
                    <h3 className="text-lg font-semibold mb-3"
                        style={{ color: palette.peach, fontFamily: "Aeonik Extended, sans-serif" }}>
                      Western Portion Highlights
                    </h3>
                    <p style={{ 
                      fontFamily: "Aeonik, sans-serif", 
                      fontSize: 'clamp(0.9rem, 1.4vw, 0.95rem)', 
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '1rem'
                    }}>
                      In the western portion of the Konkin Silver at least five structures have been tested by trenching, one of them by a short drill program. All of them returned good silver values over widths running from 5.7 to 29 feet.
                    </p>
                    <p style={{ 
                      fontFamily: "Aeonik, sans-serif", 
                      fontSize: 'clamp(0.9rem, 1.4vw, 0.95rem)', 
                      color: 'rgba(255, 255, 255, 0.9)'
                    }}>
                      In the intervening years, ice has melted back considerably exposing a network of barite veins below the Konkin Silver showing. None of these have yet been sampled. Ross Sherlock, Ph.D., likened the main Konkin Silver showing to a white smoker, and said it resembled in some facets high-grade silver-bearing barite zones at the former Eskay Creek mine.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Mineralized Structures Table */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <h2 className="text-2xl md:text-3xl font-semibold"
                  style={{ 
                    marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                    fontFamily: "Aeonik Extended, sans-serif", 
                    fontWeight: 500, 
                    color: palette.dark 
                  }}>
                Mineralized Structures on Konkin Silver Property
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '500px' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${palette.dark}` }}>
                      <th className="text-left py-2 px-3" style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>Structure</th>
                      <th className="text-left py-2 px-3" style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>Trench/Chipline</th>
                      <th className="text-left py-2 px-3" style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>Width (feet)</th>
                      <th className="text-left py-2 px-3" style={{ fontFamily: "Aeonik Extended, sans-serif", color: palette.dark }}>Silver (oz/ton)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Konkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>341-349</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>29.5</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>34.94</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Konkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>403-407</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>16.4</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>36.27</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Konkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>408-412</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>15.1</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>6.18</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Konkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>417-424</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>26.2</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>14.84</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Konkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>426-429</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>14.8</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>2.53</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Konkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>430-432</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>11.2</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>27.11</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Niknok</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>158-166</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>29.5</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>19.00</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Niknok</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>167-168</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>6.6</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>17.16</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>Onkkin</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>94-95</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>6.6</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>10.02</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>King Konk</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>#1</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>5.7</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>27.00</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>King Konk</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>#2</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>7.1</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>23.63</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${palette.light}` }}>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>King Konk</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>#3</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>13.1</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>4.21</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>King Konk</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>#4</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>13.1</td>
                      <td className="py-2 px-3" style={{ fontFamily: "Aeonik, sans-serif", color: `${palette.dark}CC` }}>15.03</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* ZTEM Anomalies Description */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <h2 className="text-2xl md:text-3xl font-semibold"
                  style={{ 
                    marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
                    fontFamily: "Aeonik Extended, sans-serif", 
                    fontWeight: 500, 
                    color: palette.dark 
                  }}>
                Description of Geotech ZTEM Anomalies
              </h2>
              
              <div className="space-y-4">
                <div className="rounded-xl" style={{
                  background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(12, 14, 29, 0.6)',
                  padding: '1.5rem'
                }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: palette.peach, fontFamily: "Aeonik Extended, sans-serif" }}>A-9</h3>
                  <p style={{ 
                    fontFamily: "Aeonik, sans-serif", 
                    fontSize: 'clamp(0.9rem, 1.4vw, 0.95rem)', 
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    This target is located in the south-eastern part of the block and lies within the Konkin Silver mineralized zone. It lies within the Hazelton Group volcanics and appears to be structurally controlled by a NNW striking fault. It is stretching roughly in the NNW direction over a distance of ≈ 2 km along an inferred fault zone. It has an estimated resistivity value of &lt; 30 ohm-m at depth of 300m and coincides with a strong Aerotem conductor.
                  </p>
                </div>
                
                <div className="rounded-xl" style={{
                  background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(12, 14, 29, 0.6)',
                  padding: '1.5rem'
                }}>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: palette.peach, fontFamily: "Aeonik Extended, sans-serif" }}>A-10</h3>
                  <p style={{ 
                    fontFamily: "Aeonik, sans-serif", 
                    fontSize: 'clamp(0.9rem, 1.4vw, 0.95rem)', 
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    Located in the south-eastern corner of the survey area, this target is stretching roughly in the NNW direction over a distance of ≈ 1.5 km. It lies within the Hazelton Group volcanics and occurs at the contact with a magnetic structure. It exhibits an estimated resistivity value of &lt;25 ohm-m at depth of 300m and coincides with a strong Aerotem conductor.
                  </p>
                </div>
              </div>
            </section>

            {/* Ownership Note */}
            <section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
              <p className="leading-relaxed text-center"
                 style={{ 
                   fontFamily: "Aeonik, sans-serif", 
                   fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
                   color: `${palette.dark}CC`,
                   fontStyle: 'italic'
                 }}>
                The Konkin Silver is owned jointly with Teuton Resources.
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

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
            onClick={() => setShowImageModal(false)}
          >
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              style={{ zIndex: 10001 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto">
              <Image
                src={modalImage}
                alt="Full size image"
                width={1920}
                height={1080}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                onClick={(e) => e.stopPropagation()}
              />
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
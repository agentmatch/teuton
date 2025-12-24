'use client'

import { useState, useEffect } from 'react'
// import Link from 'next/link' // Temporarily disabled
// import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import TickerSwitcher from '@/components/landing/TickerSwitcher'

// Navigation temporarily disabled for showcase
const navigation: any[] = []

// Enhanced Navigation Item Component
function NavItem({ item }: { item: string }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.preventDefault()}
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glassmorphic pill background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, rgba(254, 217, 146, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(254, 217, 146, 0.2)',
          boxShadow: isHovered ? '0 8px 24px rgba(254, 217, 146, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.1)' : 'none',
        }}
      />
      
      {/* Button text */}
      <div
        className="relative px-6 py-2.5"
        style={{ 
          fontFamily: "'Aeonik', sans-serif",
          fontSize: '13px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontWeight: isHovered ? 500 : 400,
          color: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
          textShadow: isHovered ? '0 0 20px rgba(254, 217, 146, 0.5)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        {item}
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 0.4 : 0,
          }}
          style={{
            background: 'radial-gradient(circle at center, rgba(254, 217, 146, 0.4) 0%, transparent 60%)',
            filter: 'blur(12px)',
          }}
        />
      </div>
    </motion.div>
  )
}

export function HeaderLanding() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [showPropertiesLabel, setShowPropertiesLabel] = useState(false)
  const [currentSection, setCurrentSection] = useState('')
  const [isMapZoomed, setIsMapZoomed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for theme changes and current section
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'data-header-theme') {
            const theme = document.documentElement.getAttribute('data-header-theme')
            setIsDarkTheme(theme === 'dark')
            // Show properties label when in dark theme (properties section)
            setShowPropertiesLabel(theme === 'dark')
          }
          if (mutation.attributeName === 'data-current-section') {
            const section = document.documentElement.getAttribute('data-current-section')
            setCurrentSection(section || '')
          }
          if (mutation.attributeName === 'data-map-zoomed') {
            const zoomed = document.documentElement.getAttribute('data-map-zoomed')
            setIsMapZoomed(zoomed === 'true')
          }
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-header-theme', 'data-current-section', 'data-map-zoomed']
    })

    // Check initial values
    const initialTheme = document.documentElement.getAttribute('data-header-theme')
    const initialSection = document.documentElement.getAttribute('data-current-section')
    setIsDarkTheme(initialTheme === 'dark')
    setShowPropertiesLabel(initialTheme === 'dark')
    setCurrentSection(initialSection || '')

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style jsx global>{`
        @font-face {
          font-family: 'Switzer';
          src: url('/images/Switzer-Regular.woff') format('woff');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <header
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 py-2"
        style={{
          background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)',
          backdropFilter: 'blur(30px) saturate(200%)',
          WebkitBackdropFilter: 'blur(30px) saturate(200%)',
          borderBottom: '1px solid rgba(254, 217, 146, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(254, 217, 146, 0.25)',
        }}
      >
      <div className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <div
              className="relative group transition-all duration-500 h-[55px] w-[220px] md:h-[70px] md:w-[265px] ml-[2%]"
              onClick={(e) => e.preventDefault()}
              style={{ cursor: 'default' }}
            >
            {/* Pulsing glow effect - golden theme */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
              <motion.div
                className="absolute w-full h-full"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(254, 217, 146, 0.3) 0%, rgba(254, 217, 146, 0.15) 30%, transparent 70%)',
                  filter: 'blur(25px)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute w-[90%] h-[90%]"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(254, 217, 146, 0.35) 0%, rgba(254, 217, 146, 0.2) 20%, transparent 50%)',
                  filter: 'blur(15px)',
                }}
                animate={{
                  scale: [1.1, 0.95, 1.1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
              {/* Sparkle particles on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ zIndex: 1000 }}
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      background: 'linear-gradient(135deg, #FED992, #FFFF77)',
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 60],
                      y: [0, (Math.random() - 0.5) * 60],
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      repeatDelay: 1,
                    }}
                  />
                ))}
              </motion.div>
            </div>
            {/* Golden metallic texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
              style={{
                background: `repeating-linear-gradient(
                  90deg,
                  rgba(254, 217, 146, 0.3) 0px,
                  rgba(255, 255, 119, 0.5) 1px,
                  rgba(254, 217, 146, 0.3) 2px,
                  rgba(255, 255, 119, 0.6) 3px,
                  rgba(254, 217, 146, 0.3) 4px
                )`,
                zIndex: 15,
              }}
            />
            {/* Metallic shimmer effect */}
            <motion.div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
              style={{
                background: `linear-gradient(105deg, 
                  transparent 30%, 
                  rgba(255, 255, 255, 0.9) 50%, 
                  transparent 70%)`,
                backgroundSize: '200% 200%',
                zIndex: 16,
                opacity: 0.7,
              }}
              animate={{
                backgroundPosition: ['0% 0%', '200% 200%'],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <div className="w-full h-full relative z-10">
              <img
                src="/images/teuton-logo.svg"
                alt="Teuton Resources"
                className="w-full h-full object-contain transition-all duration-700"
                style={{
                  transform: 'scale(0.6)',
                  transformOrigin: 'left center',
                  filter: `drop-shadow(0 0 8px rgba(254, 217, 146, 0.7))
                           drop-shadow(0 0 20px rgba(254, 217, 146, 0.5))
                           drop-shadow(0 0 40px rgba(254, 217, 146, 0.3))`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = `drop-shadow(0 0 15px rgba(249, 220, 92, 0.8))
                                                  drop-shadow(0 0 35px rgba(249, 220, 92, 0.6))
                                                  drop-shadow(0 0 55px rgba(249, 220, 92, 0.4))`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = `drop-shadow(0 0 10px rgba(249, 220, 92, 0.6))
                                                  drop-shadow(0 0 25px rgba(249, 220, 92, 0.4))
                                                  drop-shadow(0 0 40px rgba(249, 220, 92, 0.3))`;
                }}
              />
            </div>
            </div>

            {/* Section Labels */}
            <AnimatePresence mode="wait">
              {currentSection && (
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:flex items-center ml-8"
                >
                  <div className="relative">
                    <h2 
                      className="text-lg lg:text-xl font-semibold uppercase tracking-[0.2em]" 
                      style={{ 
                        color: currentSection === 'story' ? '#ffb800' : 
                               currentSection === 'gravitational' ? '#e9c357' : 
                               currentSection === 'boundaries' ? '#FFD700' : '#e9c357'
                      }}
                    >
                      {currentSection === 'properties' ? 'Strategic Properties' : 
                       currentSection === 'story' ? 'Our Story' : 
                       currentSection === 'gravitational' ? 'The Right Neighbourhood' : 
                       currentSection === 'boundaries' ? 'Claim Boundaries' : ''}
                    </h2>
                    <motion.div
                      className="absolute -bottom-1 left-0 h-px"
                      style={{ 
                        background: `linear-gradient(to right, ${currentSection === 'story' ? '#ffb800' : currentSection === 'gravitational' ? '#e9c357' : currentSection === 'boundaries' ? '#FFD700' : '#e9c357'}, ${currentSection === 'story' ? '#ffb800' : currentSection === 'gravitational' ? '#e9c357' : currentSection === 'boundaries' ? '#FFD700' : '#e9c357'}, transparent)`,
                        opacity: 0.6 
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Modern Navigation Links - Enhanced UI/UX */}
          <nav className="flex-1 hidden md:flex items-center justify-center gap-3">
            {['About', 'Properties', 'Investors', 'News', 'Contact'].map((item) => (
              <NavItem key={item} item={item} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center" style={{ marginRight: '-2rem' }}>
            <TickerSwitcher />
          </div>

          {/* Mobile menu button temporarily hidden for showcase */}
        </nav>
        </div>
      </div>

      {/* Glassmorphic silver line that appears when map is zoomed */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMapZoomed ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div 
          className="h-full w-full"
          style={{
            background: `linear-gradient(90deg,
              rgba(255,255,255,0.2) 0%,
              rgba(255,255,255,0.25) 20%,
              rgba(255,255,255,0.3) 40%,
              rgba(255,255,255,0.35) 50%,
              rgba(255,255,255,0.3) 60%,
              rgba(255,255,255,0.25) 80%,
              rgba(255,255,255,0.2) 100%)`,
            boxShadow: `
              0 0 20px rgba(255,255,255,0.2),
              0 0 40px rgba(255,255,255,0.1),
              0 0 60px rgba(255,255,255,0.05)
            `,
            filter: 'blur(0.5px)',
          }}
        />
        <motion.div
          className="absolute top-0 left-0 h-full"
          style={{
            width: '100%',
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(255,255,255,0.4) 45%,
              rgba(255,255,255,0.5) 50%,
              rgba(255,255,255,0.4) 55%,
              transparent 100%)`,
            filter: 'blur(1px)',
          }}
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 2
          }}
        />
      </motion.div>

      {/* Mobile menu temporarily disabled for showcase */}
      </header>
      
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
    </>
  )
}
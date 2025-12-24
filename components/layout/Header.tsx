'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import TickerSwitcher from '@/components/landing/TickerSwitcher'
import { usePathname } from 'next/navigation'

// Navigation temporarily disabled for showcase
const navigation: any[] = []

// Property list for dropdown
const propertyPages = [
  { name: 'All Properties', slug: '/properties' },
  { name: 'RAM', slug: '/properties/ram' },
  { name: 'Gold Mountain', slug: '/properties/gold-mountain' },
  { name: 'Fiji', slug: '/properties/fiji' },
  { name: 'Midas', slug: '/properties/midas' },
  { name: 'Konkin Silver', slug: '/properties/konkin-silver' },
  { name: 'Clone', slug: '/properties/clone' },
  { name: 'Tonga', slug: '/properties/tonga' },
]

// Enhanced Navigation Item Component
function NavItem({ item, href, hasDropdown = false, dropdownItems = [] }: { 
  item: string; 
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; slug: string }[];
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [recentDropdownClick, setRecentDropdownClick] = useState(false)
  const router = useRouter()
  
  const handleClick = (e: React.MouseEvent) => {
    if (hasDropdown && href) {
      // Don't navigate if there was a recent dropdown click or dropdown is open
      if (!isDropdownOpen && !recentDropdownClick) {
        e.preventDefault()
        router.push(href)
      }
    }
  }

  const content = (
    <motion.div
      className="relative cursor-pointer"
      style={{ zIndex: isDropdownOpen ? 1001 : 1 }}
      onMouseEnter={() => {
        setIsHovered(true)
        if (hasDropdown) setIsDropdownOpen(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        if (hasDropdown) setIsDropdownOpen(false)
      }}
      onClick={handleClick}
      animate={{
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Subtle default background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          opacity: isHovered ? 0 : 1,
          transition: 'opacity 0.2s ease',
        }}
      />
      
      {/* Glassmorphic pill background on hover */}
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
      
      {/* Button container */}
      <div className="relative px-6 py-2.5 flex items-center gap-1">
        {/* Simple text without complex gradient */}
        <span
          style={{ 
            position: 'relative',
            zIndex: 1,
            fontFamily: "'Aeonik', sans-serif",
            fontSize: '12.5px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: isHovered ? 500 : 450,
            color: isHovered ? '#ffffff' : '#a0c4ff',
            textShadow: isHovered ? '0 0 20px rgba(254, 217, 146, 0.5)' : '0 0 10px rgba(160, 196, 255, 0.3)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
          }}
        >
          {item}
        </span>
        {hasDropdown && (
          <svg 
            className="w-3 h-3 transition-transform duration-200"
            style={{ 
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: isHovered ? '#ffffff' : '#a0c4ff',
            }}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      
      {/* Dropdown Menu */}
      {hasDropdown && (
        <>
          {/* Invisible bridge to prevent gap */}
          {isDropdownOpen && (
            <div 
              className="absolute left-0 w-56"
              style={{
                top: '100%',
                height: '8px',
                pointerEvents: 'auto',
                zIndex: 999,
              }}
            />
          )}
          <motion.div
            className="absolute left-0 w-56 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: isDropdownOpen ? 1 : 0,
              y: isDropdownOpen ? 0 : -10,
              pointerEvents: isDropdownOpen ? 'auto' : 'none'
            }}
            transition={{ duration: 0.2 }}
            style={{
              top: 'calc(100% + 8px)',
              background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              border: '1px solid rgba(192, 192, 192, 0.15)',
              borderRadius: '12px',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6), 0 5px 20px rgba(192, 192, 192, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              zIndex: 1000,
            }}
          >
          {/* Silver gradient line at top */}
          <div style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.5), transparent)',
          }} />
          
          {dropdownItems.map((dropdownItem, index) => (
            <Link 
              key={index} 
              href={dropdownItem.slug} 
              className="block relative group/item transition-all duration-300 cursor-pointer"
              style={{
                padding: '14px 20px',
                borderBottom: index < dropdownItems.length - 1 ? '1px solid rgba(192, 192, 192, 0.08)' : 'none',
              }}
              onClick={() => {
                // Close dropdown on click and mark recent dropdown interaction
                setIsDropdownOpen(false)
                setIsHovered(false)
                setRecentDropdownClick(true)
                
                // Clear the flag after a short delay
                setTimeout(() => {
                  setRecentDropdownClick(false)
                }, 500)
              }}
            >
              {/* Hover background with silver shimmer */}
              <div 
                className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(192, 192, 192, 0.08), transparent)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s infinite',
                }}
              />
              
              {/* Hover glow effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(192, 192, 192, 0.1), transparent 70%)',
                }}
              />
              
              <span
                className="relative z-10 transition-all duration-300 group-hover/item:text-white pointer-events-none"
                style={{
                  fontFamily: "'Aeonik', sans-serif",
                  fontSize: index === 0 ? '13px' : '12px',
                  fontWeight: index === 0 ? 500 : 400,
                  letterSpacing: '0.08em',
                  color: index === 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(192, 192, 192, 0.9)',
                  textTransform: index === 0 ? 'uppercase' : 'none',
                  display: 'block',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                }}
              >
                {dropdownItem.name}
                {index === 0 && (
                  <span style={{
                    fontSize: '10px',
                    opacity: 0.6,
                    marginLeft: '8px',
                    letterSpacing: '0.1em',
                  }}>
                    VIEW ALL
                  </span>
                )}
              </span>
            </Link>
          ))}
          </motion.div>
        </>
      )}
    </motion.div>
  )
  
  if (!hasDropdown) {
    return <Link href={href}>{content}</Link>
  }
  
  // For dropdown items, don't wrap in Link to avoid conflicts
  return content
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'bg-nile-blue/10 backdrop-blur-md py-2'
            : 'bg-nile-blue/5 backdrop-blur-sm py-2'
        }`}
      >
      <div className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="relative group transition-all duration-500 ml-[2%] h-[3.3rem] w-[13.2rem] md:h-[4.2rem] md:w-[15.6rem]"
              style={{ 
                display: 'block',
              }}
            >
            {/* Dark gradient background for logo pop */}
            <div 
              className="absolute inset-0 scale-[3]"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.1) 50%, transparent 70%)',
                filter: 'blur(20px)',
                transform: 'scale(3)',
                zIndex: 1,
              }}
            />
            {/* Subtle metallic reflection - much less prominent */}
            <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
              <motion.div
                className="absolute w-full h-full"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.05) 30%, transparent 60%)',
                  filter: 'blur(20px)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Sparkle particles on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              >
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-white to-gray-200"
                    style={{
                      left: '50%',
                      top: '50%',
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
            {/* SVG filters for metallic effect */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
              <defs>
                <filter id="metallic-silver">
                  {/* Invert dark to light first */}
                  <feColorMatrix type="matrix" values="-1 0 0 0 1
                                                        0 -1 0 0 1
                                                        0 0 -1 0 1
                                                        0 0 0 1 0"/>
                  
                  {/* Desaturate to grayscale */}
                  <feColorMatrix type="saturate" values="0" />
                  
                  {/* Adjust brightness and contrast for silver */}
                  <feComponentTransfer>
                    <feFuncR type="linear" slope="1.2" intercept="0.1"/>
                    <feFuncG type="linear" slope="1.2" intercept="0.1"/>
                    <feFuncB type="linear" slope="1.2" intercept="0.15"/>
                  </feComponentTransfer>
                  
                  {/* Add metallic lighting effect */}
                  <feGaussianBlur stdDeviation="0.3" result="blur" />
                  <feSpecularLighting result="specOut" specularExponent="25" lightingColor="#ffffff" surfaceScale="2">
                    <fePointLight x="-50" y="30" z="150"/>
                  </feSpecularLighting>
                  <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2"/>
                  <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="litPaint"/>
                  
                  {/* Add subtle blue tint for metallic look */}
                  <feColorMatrix type="matrix" values="0.95 0 0 0 0
                                                        0 0.95 0 0 0
                                                        0 0 1.05 0 0
                                                        0 0 0 1 0"/>
                </filter>
              </defs>
            </svg>
            
            <img
              src="/images/teuton-logo.svg"
              alt="Teuton Resources"
              className="w-full h-full object-contain relative z-10 transition-all duration-500"
              style={{
                filter: 'url(#metallic-silver) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                WebkitFilter: 'url(#metallic-silver) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                transform: 'scale(0.6) translateZ(0)',
                transformOrigin: 'left center',
              }}
            />
            </Link>

          </div>

          {/* Modern Navigation Links - Enhanced UI/UX */}
          <nav className="flex-1 hidden md:flex items-center justify-center gap-3">
            <NavItem item="About" href="/about" />
            <NavItem 
              item="Properties" 
              href="/properties" 
              hasDropdown={true}
              dropdownItems={propertyPages}
            />
            <NavItem item="Investors" href="/investors" />
            <NavItem item="News" href="/news" />
            <NavItem item="Contact" href="/contact" />
          </nav>

          <div className="hidden lg:flex items-center" style={{ marginRight: '-2rem' }}>
            <TickerSwitcher />
          </div>

          {/* Mobile menu button temporarily hidden for showcase */}
        </nav>
        </div>
      </div>


      {/* Mobile menu temporarily disabled for showcase */}
      {/* Subtle white line at bottom - desktop only */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
      
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
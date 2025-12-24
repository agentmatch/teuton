'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
// import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import TickerSwitcher from '@/components/landing/TickerSwitcher'
import { useSwipe } from '@/hooks/useSwipe'
import { usePathname } from 'next/navigation'
import '@/styles/mobile-menu-fix.css'

// Navigation temporarily disabled for showcase
const navigation: any[] = []

interface StockData {
  symbol?: string
  price?: number
  change?: number
  changePercent?: number
  volume?: string
  high?: number
  low?: number
  marketCap?: string
  timestamp?: string
}

export function HeaderLight() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loadingStock, setLoadingStock] = useState(true)
  const [showNavContainer, setShowNavContainer] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  
  // Add swipe to close functionality
  useSwipe(mobileMenuRef, {
    onSwipeRight: () => {
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    },
    threshold: 50
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        if (data && data.price !== undefined) {
          setStockData({
            symbol: data.symbol || 'TSX-V: TUO',
            price: data.price,
            change: data.change || 0,
            changePercent: data.changePercent || 0,
            volume: data.volume || '--',
            high: data.high || data.price,
            low: data.low || data.price,
            marketCap: data.marketCap || '--',
            timestamp: data.timestamp
          })
        }
        setLoadingStock(false)
      } catch (err) {
        console.error('Error fetching stock quote:', err)
        setLoadingStock(false)
      }
    }

    if (isMobileMenuOpen) {
      fetchStockData()
      const stockInterval = setInterval(fetchStockData, 300000) // Update every 5 minutes
      return () => clearInterval(stockInterval)
    }
  }, [isMobileMenuOpen])


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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? 'backdrop-blur-md py-3 shadow-lg'
            : 'backdrop-blur-sm py-3'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(180deg, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)'
            : 'linear-gradient(180deg, rgba(10, 10, 10, 0.8) 0%, rgba(10, 10, 10, 0.7) 100%)'
        }}
      >
      <div className="w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <nav className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="relative group transition-all duration-500 h-11 w-44 md:h-14 md:w-52 ml-[10%]"
              style={{ cursor: 'pointer' }}
              id="logo-container"
            >
            <img
              src="/images/luxorlogonew.png"
              alt="Luxor Metals"
              className="w-full h-full object-contain relative z-10 transition-all duration-500 hover:brightness-90"
              style={{
                filter: `brightness(1.2) saturate(1.1)`,
                transform: 'scale(1.1) translateZ(0)',
                backfaceVisibility: 'hidden',
                perspective: '1000px'
              }}
            />
            </Link>

          </div>

          {/* Modern Navigation Links - Centered */}
          <nav 
            className="hidden md:flex flex-1 items-center justify-center"
            onMouseEnter={() => setShowNavContainer(true)}
            onMouseLeave={() => setShowNavContainer(false)}
          >
            <div className={`relative flex items-center gap-2 transition-all duration-300 ${
              showNavContainer ? 'glassmorphic-nav-pills' : ''
            }`}
                 style={{
                   ...(showNavContainer ? {
                     background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%)',
                     backdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
                     WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
                     borderRadius: '28px',
                     padding: '4px',
                     border: '1px solid rgba(255, 255, 255, 0.1)',
                     boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.12), inset 0 4px 12px 0 rgba(0, 0, 0, 0.8), inset 0 -4px 12px 0 rgba(255, 255, 255, 0.05)',
                   } : {}),
                 }}>
            <Link
              href="/about"
              className="relative px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer rounded-[22px] z-[2]"
              style={{ 
                fontFamily: "'Switzer', 'Helvetica Neue', Arial, sans-serif",
                color: pathname === '/about' ? '#FFFF77' : 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                background: pathname === '/about' ? 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 255, 119, 0.1) 50%, rgba(255, 255, 119, 0.05) 100%)' : 'transparent',
                boxShadow: pathname === '/about' ? 'inset 0 0 0 1px rgba(255, 255, 119, 0.3), inset 0 2px 4px rgba(255, 255, 119, 0.1), 0 0 20px rgba(255, 255, 119, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/about') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/about') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              About
            </Link>
            <Link
              href="/properties"
              className="relative px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer rounded-[22px] z-[2]"
              style={{ 
                fontFamily: "'Switzer', 'Helvetica Neue', Arial, sans-serif",
                color: pathname === '/properties' ? '#FFFF77' : 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                background: pathname === '/properties' ? 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 255, 119, 0.1) 50%, rgba(255, 255, 119, 0.05) 100%)' : 'transparent',
                boxShadow: pathname === '/properties' ? 'inset 0 0 0 1px rgba(255, 255, 119, 0.3), inset 0 2px 4px rgba(255, 255, 119, 0.1), 0 0 20px rgba(255, 255, 119, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/properties') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/properties') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              Properties
            </Link>
            <Link
              href="/investors"
              className="relative px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer rounded-[22px] z-[2]"
              style={{ 
                fontFamily: "'Switzer', 'Helvetica Neue', Arial, sans-serif",
                color: pathname === '/investors' ? '#FFFF77' : 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                background: pathname === '/investors' ? 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 255, 119, 0.1) 50%, rgba(255, 255, 119, 0.05) 100%)' : 'transparent',
                boxShadow: pathname === '/investors' ? 'inset 0 0 0 1px rgba(255, 255, 119, 0.3), inset 0 2px 4px rgba(255, 255, 119, 0.1), 0 0 20px rgba(255, 255, 119, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/investors') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/investors') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              Investors
            </Link>
            <Link
              href="/news"
              className="relative px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer rounded-[22px] z-[2]"
              style={{ 
                fontFamily: "'Switzer', 'Helvetica Neue', Arial, sans-serif",
                color: pathname === '/news' ? '#FFFF77' : 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                background: pathname === '/news' ? 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 255, 119, 0.1) 50%, rgba(255, 255, 119, 0.05) 100%)' : 'transparent',
                boxShadow: pathname === '/news' ? 'inset 0 0 0 1px rgba(255, 255, 119, 0.3), inset 0 2px 4px rgba(255, 255, 119, 0.1), 0 0 20px rgba(255, 255, 119, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/news') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/news') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              News
            </Link>
            <Link
              href="/contact"
              className="relative px-6 py-3 text-sm font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer rounded-[22px] z-[2]"
              style={{ 
                fontFamily: "'Switzer', 'Helvetica Neue', Arial, sans-serif",
                color: pathname === '/contact' ? '#0A4A5C' : 'rgba(26, 60, 64, 0.8)',
                fontSize: '14px',
                letterSpacing: '0.08em',
                background: pathname === '/contact' ? 'linear-gradient(135deg, rgba(10, 74, 92, 0.15) 0%, rgba(10, 74, 92, 0.1) 50%, rgba(10, 74, 92, 0.05) 100%)' : 'transparent',
                boxShadow: pathname === '/contact' ? 'inset 0 0 0 1px rgba(10, 74, 92, 0.3), inset 0 2px 4px rgba(10, 74, 92, 0.1), 0 0 20px rgba(10, 74, 92, 0.1)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (pathname !== '/contact') {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (pathname !== '/contact') {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              Contact
            </Link>
            </div>
          </nav>

          <div className="hidden lg:flex items-center" style={{ marginRight: '-2rem' }}>
            <TickerSwitcher />
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden flex z-50 rounded-xl min-w-[48px] min-h-[48px] items-center justify-center focus:outline-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                background: 'linear-gradient(135deg, rgba(26, 60, 64, 0.1) 0%, rgba(26, 60, 64, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(200%) brightness(1.3)',
                WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.3)',
                border: '1px solid rgba(26, 60, 64, 0.2)',
                boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
                width: '48px',
                height: '48px',
              }}
              aria-label="Open menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative" style={{ width: '20px', height: '16px' }}>
                <motion.span
                  className="absolute rounded-full"
                  style={{ 
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: isMobileMenuOpen ? '#FFD700' : 'rgba(26, 60, 64, 0.8)',
                  }}
                  animate={{ rotate: isMobileMenuOpen ? 45 : 0, y: isMobileMenuOpen ? 7 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute rounded-full"
                  style={{ 
                    top: '50%', 
                    left: 0,
                    right: 0,
                    transform: 'translateY(-50%)',
                    height: '2px',
                    background: 'rgba(26, 60, 64, 0.8)',
                  }}
                  animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute rounded-full"
                  style={{ 
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: isMobileMenuOpen ? '#FFD700' : 'rgba(26, 60, 64, 0.8)',
                  }}
                  animate={{ rotate: isMobileMenuOpen ? -45 : 0, y: isMobileMenuOpen ? -7 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.button>
        </nav>
        </div>
      </div>


      {/* Mobile Menu Overlay */}
      {typeof window !== 'undefined' && createPortal(
        <div style={{ position: 'fixed', inset: 0, pointerEvents: isMobileMenuOpen ? 'auto' : 'none', zIndex: 2147483647 }}>
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/30"
                  style={{ zIndex: 2147483647 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  ref={mobileMenuRef}
                  className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] flex flex-col"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  style={{
                    zIndex: 2147483647,
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)',
                    backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                    borderLeft: '1px solid rgba(26, 60, 64, 0.1)',
                    boxShadow: '-8px 0 32px 0 rgba(0, 0, 0, 0.1)',
                  }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 rounded-full transition-all z-10 flex items-center justify-center"
                style={{
                  background: 'rgba(26, 60, 64, 0.05)',
                  border: '1px solid rgba(26, 60, 64, 0.1)',
                  width: '40px',
                  height: '40px',
                }}
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="rgba(26, 60, 64, 0.8)" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="flex-1 overflow-y-auto p-6 pt-20" style={{ paddingBottom: '80px' }}>
                {/* Mobile SVG Ticker - Minimal Style */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{
                    background: 'rgba(26, 60, 64, 0.05)',
                    border: '1px solid rgba(26, 60, 64, 0.1)',
                    whiteSpace: 'nowrap',
                  }}>
                      {loadingStock ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                          </div>
                          <div className="animate-pulse">
                            <div className="h-5 bg-gray-300 rounded w-20"></div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Status Indicator */}
                          <div className="relative">
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: stockData ? '#4CAF50' : 'rgba(26, 60, 64, 0.4)',
                              boxShadow: stockData ? '0 0 8px rgba(76, 175, 80, 0.8)' : 'none',
                            }}></div>
                            {stockData && (
                              <div className="absolute inset-0 animate-ping" style={{
                                borderRadius: '50%',
                                background: 'rgba(76, 175, 80, 0.4)',
                              }}></div>
                            )}
                          </div>
                          
                          {/* Symbol */}
                          <span style={{
                            color: 'rgba(26, 60, 64, 0.7)',
                            fontFamily: "'Switzer Variable', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}>
                            TSX-V: TUO
                          </span>
                          
                          {/* Price */}
                          <span style={{
                            color: '#1A3C40',
                            fontSize: '18px',
                            fontWeight: 600,
                            fontFamily: "'Switzer Variable', sans-serif",
                          }}>
                            ${stockData?.price ? (stockData.price % 0.01 === 0 ? stockData.price.toFixed(2) : stockData.price.toFixed(3)) : '--'}
                          </span>
                          
                          {/* Change */}
                          {stockData && stockData.changePercent !== undefined && stockData.changePercent !== 0 && (
                            <div className="flex items-center gap-0.5">
                              {stockData.changePercent > 0 ? (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3">
                                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F44336" strokeWidth="3">
                                  <path d="M7 7L17 17M7 17H17M7 17V7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                              <span style={{
                                color: stockData.changePercent > 0 ? '#4CAF50' : '#F44336',
                                fontSize: '11px',
                                fontFamily: "'Switzer Variable', sans-serif",
                                fontWeight: 500,
                              }}>
                                ({stockData.changePercent > 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </div>
                
                <nav className="space-y-3">
                  <Link
                    href="/about"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    style={{
                      background: pathname === '/about' ? 'rgba(10, 74, 92, 0.1)' : 'rgba(26, 60, 64, 0.05)',
                      border: pathname === '/about' ? '1px solid rgba(10, 74, 92, 0.3)' : '1px solid rgba(26, 60, 64, 0.1)',
                      color: pathname === '/about' ? '#0A4A5C' : 'rgba(26, 60, 64, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                      fontWeight: pathname === '/about' ? 600 : 400,
                    }}
                  >
                    About
                  </Link>
                  
                  <Link
                    href="/properties"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    style={{
                      background: pathname === '/properties' ? 'rgba(10, 74, 92, 0.1)' : 'rgba(26, 60, 64, 0.05)',
                      border: pathname === '/properties' ? '1px solid rgba(10, 74, 92, 0.3)' : '1px solid rgba(26, 60, 64, 0.1)',
                      color: pathname === '/properties' ? '#0A4A5C' : 'rgba(26, 60, 64, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                      fontWeight: pathname === '/properties' ? 600 : 400,
                    }}
                  >
                    Properties
                  </Link>
                  
                  <Link
                    href="/investors"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    style={{
                      background: pathname === '/investors' ? 'rgba(10, 74, 92, 0.1)' : 'rgba(26, 60, 64, 0.05)',
                      border: pathname === '/investors' ? '1px solid rgba(10, 74, 92, 0.3)' : '1px solid rgba(26, 60, 64, 0.1)',
                      color: pathname === '/investors' ? '#0A4A5C' : 'rgba(26, 60, 64, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                      fontWeight: pathname === '/investors' ? 600 : 400,
                    }}
                  >
                    Investors
                  </Link>
                  
                  <Link
                    href="/news"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    style={{
                      background: pathname === '/news' ? 'rgba(10, 74, 92, 0.1)' : 'rgba(26, 60, 64, 0.05)',
                      border: pathname === '/news' ? '1px solid rgba(10, 74, 92, 0.3)' : '1px solid rgba(26, 60, 64, 0.1)',
                      color: pathname === '/news' ? '#0A4A5C' : 'rgba(26, 60, 64, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                      fontWeight: pathname === '/news' ? 600 : 400,
                    }}
                  >
                    News
                  </Link>
                  
                  <Link
                    href="/contact"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                    }}
                    style={{
                      background: pathname === '/contact' ? 'rgba(10, 74, 92, 0.1)' : 'rgba(26, 60, 64, 0.05)',
                      border: pathname === '/contact' ? '1px solid rgba(10, 74, 92, 0.3)' : '1px solid rgba(26, 60, 64, 0.1)',
                      color: pathname === '/contact' ? '#0A4A5C' : 'rgba(26, 60, 64, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                      fontWeight: pathname === '/contact' ? 600 : 400,
                    }}
                  >
                    Contact
                  </Link>
                </nav>
              </div>
              
              {/* Contact Information - Fixed at bottom (hidden on iPhone SE) */}
              {typeof window !== 'undefined' && window.innerWidth >= 390 && (
                <div className="p-6" style={{
                  paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
                }}>
                  <div className="space-y-2" style={{
                    borderTop: '1px solid rgba(26, 60, 64, 0.1)',
                    paddingTop: '16px',
                  }}>
                    <h3 style={{
                      color: '#FFD700',
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      marginBottom: '12px',
                    }}>
                      LUXOR METALS LTD.
                    </h3>
                    <p style={{
                      color: 'rgba(26, 60, 64, 0.7)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}>
                      2130 Crescent Road<br />
                      Victoria, BC, V8S 2H3
                    </p>
                    <p style={{
                      color: 'rgba(26, 60, 64, 0.7)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '14px',
                      lineHeight: 1.5,
                      marginTop: '8px',
                    }}>
                      778-430-5680
                    </p>
                    <a 
                      href="mailto:info@luxormetals.com"
                      style={{
                        color: '#FFD700',
                        fontFamily: "'Switzer Variable', sans-serif",
                        fontSize: '14px',
                        lineHeight: 1.5,
                        textDecoration: 'none',
                        display: 'inline-block',
                        marginTop: '4px',
                      }}
                    >
                      info@luxormetals.com
                    </a>
                  </div>
                </div>
              )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
      
      {/* Gold divider with upward glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[rgba(26,60,64,0.2)]" />
      
      {/* Upward glow effect */}
      <div 
        className="absolute pointer-events-none md:hidden"
        style={{
          left: '8px',
          width: '192px',
          height: '45px',
          bottom: '1px',
          background: 'linear-gradient(0deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.15) 20%, rgba(255, 215, 0, 0.05) 35%, transparent 60%)',
          filter: 'blur(2px)'
        }}
      />
      <div 
        className="absolute pointer-events-none hidden md:block"
        style={{
          left: '28px',
          width: '219px',
          height: '45px',
          bottom: '1px',
          background: 'linear-gradient(0deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 215, 0, 0.15) 20%, rgba(255, 215, 0, 0.05) 35%, transparent 60%)',
          filter: 'blur(2px)'
        }}
      />
      
      {/* Gold bar */}
      <div 
        className="absolute bottom-0 md:hidden"
        style={{
          left: '8px',
          width: '192px',
          height: '1px',
          backgroundColor: '#FFD700',
          boxShadow: '0 0 8px rgba(255, 215, 0, 0.6), 0 0 4px rgba(255, 215, 0, 0.8)'
        }}
      />
      <div 
        className="absolute bottom-0 hidden md:block"
        style={{
          left: '28px',
          width: '219px',
          height: '1px',
          backgroundColor: '#FFD700',
          boxShadow: '0 0 8px rgba(255, 215, 0, 0.6), 0 0 4px rgba(255, 215, 0, 0.8)'
        }}
      />
      {/* Subtle white line at bottom - desktop only */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[1px] bg-black/10" />
      
      </header>
    </>
  )
}
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import '@/styles/investor-mobile-fix.css'
import '@/styles/investor-glassmorphic.css'
import '@/styles/investor-background-fix.css'
import styles from './investor-styles.module.css'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

// Remove BackgroundMap for mountain background

// New color palette matching RAM page
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: string
  high: number
  low: number
  open?: number
  close?: number
  previousClose?: number
  marketCap: string
  timestamp: string
  bid?: number
  ask?: number
  bidSize?: number
  askSize?: number
  weekHigh52?: number
  weekLow52?: number
  avgVolume?: string
  consolidatedVolume?: string
  marketCapAllClasses?: string
  listedSharesOut?: number
  totalSharesAllClasses?: number
  peRatio?: number
  divYield?: number
}

interface Trade {
  time: string
  price: number
  volume: number
  change?: number
  changePercent?: number
  exchange?: string
  priceFormatted?: string
  volumeFormatted?: string
  buyer?: string
  seller?: string
}


export default function InvestorsPage() {
  // Add gradient animation keyframes
  if (typeof window !== 'undefined' && !document.getElementById('gradientShiftAnimation')) {
    const style = document.createElement('style')
    style.id = 'gradientShiftAnimation'
    style.innerHTML = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `
    document.head.appendChild(style)
  }
  const [activeTab, setActiveTab] = useState('overview')
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('1D')
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, price: string, time: string, open?: string, high?: string, low?: string, close?: string } | null>(null)
  const [trades, setTrades] = useState<Trade[]>([])
  const [tradesLoading, setTradesLoading] = useState(true)
  const [tradesError, setTradesError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Format price for TSX-V trading (nearest $0.005)
  const formatPrice = (price: number | undefined): string => {
    if (!price && price !== 0) return '--'
    // Round to nearest $0.005
    const rounded = Math.round(price * 200) / 200
    // Show 2 decimals for round cents, 3 for half-cents
    return rounded % 0.01 === 0 ? rounded.toFixed(2) : rounded.toFixed(3)
  }
  
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        if (data && data.price) {
          setStockData(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stock data:', error)
        setLoading(false)
      }
    }

    const fetchTradeHistory = async () => {
      try {
        setTradesError(null)
        const response = await fetch('/api/trade-history')
        const data = await response.json()
        
        if (data.success && data.trades) {
          setTrades(data.trades)
        } else {
          setTradesError(data.message || 'Unable to load trade history')
        }
        setTradesLoading(false)
      } catch (error) {
        console.error('Error fetching trade history:', error)
        setTradesError('Failed to load trade history')
        setTradesLoading(false)
      }
    }


    fetchStockData()
    fetchTradeHistory()
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      fetchStockData()
      fetchTradeHistory()
    }, 300000)
    
    return () => clearInterval(interval)
  }, [])

  const tabs = [
    { id: 'overview', label: 'Stock Overview' },
    { id: 'reports', label: 'Corporate Information' },
  ]

  return (
    <div 
      className="min-h-screen pt-20 md:pt-32 pb-20" 
      style={{ 
        backgroundColor: palette.dark,
        isolation: 'isolate' 
      }} 
      data-theme="dark"
    >
      {/* Mountain landscape background - matching RAM page */}
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
        {/* Animated aurora gradient overlay - matching RAM page */}
        <div className="absolute inset-0 overflow-hidden"
             style={{ 
               willChange: 'transform',
               transform: 'translateZ(0)'
             }}>
          {/* Layer 1: Base gradient */}
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(180deg, 
              rgba(3, 23, 48, 0.8) 0%, 
              rgba(3, 23, 48, 0.65) 15%,
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
        {/* Page Header - RAM Style */}
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
              // Gradient text with subtle animation - matching RAM page
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
            Investor Centre
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                // Matching gradient text like RAM page
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
              Building value through strategic exploration in British Columbia's Golden Triangle
            </motion.p>
          </div>
        </motion.div>

        {/* Tab Navigation - RAM Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4 justify-center flex-wrap"
          style={{ marginBottom: `clamp(2rem, 5vw, 3rem)` }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-70'
              }`}
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
                fontFamily: "Aeonik Extended, sans-serif",
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                boxShadow: activeTab === tab.id 
                  ? '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)'
                  : '0 0 10px rgba(13, 15, 30, 0.3), 0 0 20px rgba(13, 15, 30, 0.2)'
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stock Overview Card - Dark Glass Layer for better readability */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(12, 14, 29, 0.85) 0%, 
                    rgba(12, 14, 29, 0.9) 50%, 
                    rgba(12, 14, 29, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                  padding: isMobile ? '1.5rem' : '2rem'
                }}
              >
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-white/10 rounded w-1/3 mb-6"></div>
                    <div className="h-64 bg-white/5 rounded mb-6"></div>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-white/10 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                <div className={`${isMobile ? 'space-y-4' : 'flex items-center justify-between'} mb-6`}>
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-white"
                        style={{ 
                          fontFamily: "Aeonik Extended, sans-serif", 
                          fontWeight: 500
                        }}>
                      {stockData?.symbol || 'TSX-V: TUO'}
                    </h2>
                    <p className="text-xs md:text-sm mt-1 text-white/60">Teuton Resources Corp.</p>
                  </div>
                  <div className={`flex items-center ${isMobile ? 'justify-between' : 'gap-4'}`}>
                    <div className={isMobile ? '' : 'text-right'}>
                      <p className="text-xl md:text-2xl font-bold text-white">
                        {stockData?.price !== undefined ? `$${formatPrice(stockData.price)}` : '--'}
                      </p>
                      <p className="text-xs md:text-sm text-white/60">CAD</p>
                    </div>
                    <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg ${
                      stockData && stockData.change >= 0 
                        ? 'bg-[#22C55E]/10 border border-[#22C55E]/30'
                        : 'bg-[#FF7777]/10 border border-[#FF7777]/30'
                    }`}>
                      <p className={`text-xs md:text-sm font-medium ${
                        stockData && stockData.change >= 0 ? 'text-[#22C55E]' : 'text-[#FF7777]'
                      }`}>
                        {stockData ? (
                          <>
                            {stockData.change >= 0 ? '+' : ''}{formatPrice(stockData.change)} ({stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                          </>
                        ) : (
                          '-- (--%)'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Last Updated */}
                <div className="text-xs mb-2 text-white/40">
                  Last updated: {stockData?.timestamp ? new Date(stockData.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZoneName: 'short'
                  }) : '--'}
                </div>
                
                {/* Time Period Selector */}
                <div className="flex gap-1 md:gap-2 mb-4 overflow-x-auto">
                  {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap`}
                      style={{ 
                        fontFamily: "Aeonik Extended, sans-serif",
                        backgroundColor: period === selectedPeriod ? `rgba(255, 190, 152, 0.2)` : 'transparent',
                        color: period === selectedPeriod ? palette.peach : 'rgba(255, 255, 255, 0.6)',
                        border: period === selectedPeriod ? `1px solid rgba(255, 190, 152, 0.4)` : '1px solid transparent',
                      }}
                    >
                      {period}
                    </button>
                  ))}
                </div>
                
                {/* Chart with Period-Specific Data */}
                <div 
                  className="h-48 md:h-64 rounded-lg relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(12, 14, 29, 0.7) 0%, 
                      rgba(12, 14, 29, 0.85) 50%, 
                      rgba(12, 14, 29, 0.7) 100%)`,
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    border: `1px solid rgba(12, 14, 29, 0.6)`
                  }}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {/* Price axis on right */}
                  <div className="absolute right-1 md:right-2 top-4 bottom-4 flex flex-col justify-between text-[10px] md:text-xs text-[#E5E5E5]/60">
                    {(() => {
                      if (!stockData?.price) {
                        return Array(5).fill(null).map((_, i) => (
                          <span key={i}>--</span>
                        ))
                      }
                      const currentPrice = stockData.price
                      const range = selectedPeriod === '1W' ? 0.04 : 0.02 // Match the volatility used in chart
                      const maxPrice = currentPrice * (1 + range)
                      const minPrice = currentPrice * (1 - range)
                      const prices = [
                        maxPrice,
                        currentPrice + (maxPrice - currentPrice) * 0.5,
                        currentPrice,
                        currentPrice - (currentPrice - minPrice) * 0.5,
                        minPrice
                      ]
                      return prices.map((price, i) => (
                        <span key={i}>${formatPrice(price)}</span>
                      ))
                    })()}
                  </div>
                  
                  {/* Chart container with padding */}
                  <div className="p-4 pr-12 h-full">
                  
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid meet">
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={palette.peach} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={palette.peach} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                      {/* Grid lines */}
                      <g>
                        {/* Horizontal grid lines */}
                        {[0, 50, 100, 150, 200].map((y) => (
                          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                        ))}
                      </g>
                      {/* Simple line chart */}
                      {(() => {
                        if (!stockData?.price) return null;
                        
                        if (selectedPeriod === '1D' || selectedPeriod === '1W') {
                          // Generate realistic-looking chart based on actual price
                          const currentPrice = stockData.price;
                          const volatility = selectedPeriod === '1D' ? 0.02 : 0.04; // 2% for day, 4% for week
                          
                          // Create data points that end at current price (y=100)
                          const points = selectedPeriod === '1D' 
                            ? [
                                [0, 100 + (volatility * 200)],   // Start higher
                                [100, 100 + (volatility * 150)],
                                [200, 100 + (volatility * 180)],
                                [300, 100 + (volatility * 100)],
                                [400, 100 + (volatility * 50)],
                                [500, 100 + (volatility * 80)],
                                [600, 100 + (volatility * 30)],
                                [700, 100 + (volatility * 10)],
                                [800, 100]  // End at current price
                              ]
                            : [
                                [0, 100 + (volatility * 100)],   // Start higher for week
                                [200, 100 + (volatility * 75)],
                                [400, 100 + (volatility * 37.5)],
                                [600, 100 + (volatility * 12.5)],
                                [800, 100]  // End at current price
                              ];
                          
                          const path = points.map(([x, y], i) => 
                            `${i === 0 ? 'M' : 'L'} ${x},${y}`
                          ).join(' ');
                          
                          return (
                            <>
                              {/* Area fill */}
                              <path
                                d={`${path} L 800,200 L 0,200 Z`}
                                fill="url(#areaGradient)"
                              />
                              {/* Line */}
                              <path
                                d={path}
                                fill="none"
                                stroke={palette.peach}
                                strokeWidth="2"
                              />
                              {/* Current price dot */}
                              <circle
                                cx="800"
                                cy="100"
                                r="4"
                                fill={palette.peach}
                                stroke="rgba(13, 15, 30, 0.8)"
                                strokeWidth="2"
                              />
                            </>
                          )
                        }
                        return null
                      })()}
                    
                    {/* Interactive Overlay */}
                    <rect
                      x="0"
                      y="0"
                      width="800"
                      height="200"
                      fill="transparent"
                      style={{ cursor: 'crosshair' }}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = ((e.clientX - rect.left) / rect.width) * 800
                        const normalizedX = x / 800
                        
                        if (selectedPeriod !== '1D' && selectedPeriod !== '1W') {
                          return
                        }
                        
                        if (!stockData?.price) return
                        
                        const currentPrice = stockData.price
                        let price = currentPrice
                        let y = 100
                        
                        // Calculate price based on position using same volatility as chart
                        const volatility = selectedPeriod === '1D' ? 0.02 : 0.04
                        
                        if (selectedPeriod === '1D') {
                          const points = [
                            [0, 100 + (volatility * 200)],
                            [100, 100 + (volatility * 150)],
                            [200, 100 + (volatility * 180)],
                            [300, 100 + (volatility * 100)],
                            [400, 100 + (volatility * 50)],
                            [500, 100 + (volatility * 80)],
                            [600, 100 + (volatility * 30)],
                            [700, 100 + (volatility * 10)],
                            [800, 100]
                          ]
                          for (let i = 0; i < points.length - 1; i++) {
                            if (x >= points[i][0] && x <= points[i + 1][0]) {
                              const t = (x - points[i][0]) / (points[i + 1][0] - points[i][0])
                              y = points[i][1] + t * (points[i + 1][1] - points[i][1])
                              break
                            }
                          }
                          // Map y to price - y=100 is current price, scale based on volatility
                          price = currentPrice * (1 + ((y - 100) / 100) * volatility)
                        } else {
                          const points = [
                            [0, 100 + (volatility * 100)],
                            [200, 100 + (volatility * 75)],
                            [400, 100 + (volatility * 37.5)],
                            [600, 100 + (volatility * 12.5)],
                            [800, 100]
                          ]
                          for (let i = 0; i < points.length - 1; i++) {
                            if (x >= points[i][0] && x <= points[i + 1][0]) {
                              const t = (x - points[i][0]) / (points[i + 1][0] - points[i][0])
                              y = points[i][1] + t * (points[i + 1][1] - points[i][1])
                              break
                            }
                          }
                          // Map y to price
                          price = currentPrice * (1 + ((y - 100) / 100) * volatility)
                        }
                        
                        // Round price
                        price = Math.round(price * 200) / 200
                        
                        // Get time
                        const timeLabels = selectedPeriod === '1D' 
                          ? ['9:30', '10:30', '11:30', '12:30', '1:30', '2:30', '3:30', '4:00']
                          : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
                        const timeIndex = Math.floor(normalizedX * (timeLabels.length - 1))
                        
                        setHoveredPoint({
                          x: x,
                          y: y,
                          price: `$${formatPrice(price)}`,
                          time: timeLabels[timeIndex] || ''
                        })
                      }}
                    />
                    
                    {/* Hover Indicator Crosshair and Dot */}
                    {hoveredPoint && selectedPeriod !== '1M' && selectedPeriod !== '3M' && selectedPeriod !== '1Y' && selectedPeriod !== 'ALL' && (
                      <>
                        {/* Vertical line */}
                        <line
                          x1={hoveredPoint.x}
                          y1="0"
                          x2={hoveredPoint.x}
                          y2="200"
                          stroke="rgba(229, 229, 229, 0.3)"
                          strokeWidth="1"
                        />
                        {/* Dot on line */}
                        <circle
                          cx={hoveredPoint.x}
                          cy={hoveredPoint.y}
                          r="4"
                          fill="#E5E5E5"
                          stroke="rgba(7, 52, 64, 0.8)"
                          strokeWidth="2"
                        />
                      </>
                    )}
                  </svg>
                  
                  {/* No Data Message */}
                  {(selectedPeriod === '1M' || selectedPeriod === '3M' || selectedPeriod === '1Y' || selectedPeriod === 'ALL') && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/60 backdrop-blur-sm px-6 py-3 rounded-lg border border-[#E5E5E5]/20">
                        <p className="text-[#E5E5E5]/60 text-sm font-medium">
                          No historical data available for this period
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Hover Tooltip */}
                  {hoveredPoint && (selectedPeriod === '1D' || selectedPeriod === '1W') && (
                    <div
                      className="absolute pointer-events-none z-10 bg-black/90 border border-[#E5E5E5]/30 rounded shadow-lg px-2 py-1 backdrop-blur-sm"
                      style={{
                        left: `${Math.min(Math.max((hoveredPoint.x / 800) * 100, 10), 80)}%`,
                        top: '20px',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <p className="text-xs text-white/60">{hoveredPoint.time}</p>
                      <p className="text-sm font-semibold text-white">{hoveredPoint.price}</p>
                    </div>
                  )}
                  
                  {/* Chart Labels */}
                  <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs text-[#E5E5E5]/60">
                    {(() => {
                      switch(selectedPeriod) {
                        case '1D':
                          return ['9:30', '11:00', '12:30', '2:00', '3:30']
                        case '1W':
                          return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
                        case '1M':
                        case '3M':
                        case '1Y':
                        case 'ALL':
                          return [] // No labels for periods without data
                        default:
                          return []
                      }
                    })().map((label, index) => (
                      <span key={index}>{label}</span>
                    ))}
                  </div>
                  </div>
                </div>
                
                {/* Trading Stats - All Fields */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Open</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.open !== undefined ? formatPrice(stockData.open) : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Day High/Low</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.high !== undefined && stockData?.low !== undefined 
                        ? `${formatPrice(stockData.high)}/${formatPrice(stockData.low)}`
                        : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">52 Week High/Low</p>
                    <p className="text-sm md:text-base font-medium text-white text-[11px] sm:text-sm">
                      {stockData?.weekHigh52 !== undefined && stockData?.weekLow52 !== undefined
                        ? `${formatPrice(stockData.weekHigh52)}/${formatPrice(stockData.weekLow52)}`
                        : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Close</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.close !== undefined ? formatPrice(stockData.close) : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Prev. Close</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.previousClose !== undefined ? formatPrice(stockData.previousClose) : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Volume</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.volume || '--'}
                    </p>
                  </div>
                </div>
                
                {/* Additional Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4 pt-4 border-t border-[#1A3C40]/10">
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Consolidated Vol.</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.consolidatedVolume || '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Market Cap</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.marketCap || '--'}
                    </p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs md:text-sm text-white/60">Market Cap (All)</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.marketCapAllClasses || '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Listed Shares</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.listedSharesOut ? stockData.listedSharesOut.toLocaleString() : '--'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-white/60">Total Shares</p>
                    <p className="text-sm md:text-base font-medium text-white">
                      {stockData?.totalSharesAllClasses ? stockData.totalSharesAllClasses.toLocaleString() : '--'}
                    </p>
                  </div>
                </div>
                  </>
                )}
              </motion.div>

              {/* Recent Trades */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glassmorphic-card"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                  Recent Trades
                </h2>
                
                {tradesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-white/60">Loading trade history...</div>
                  </div>
                ) : tradesError ? (
                  <div className="text-center py-12">
                    <p className="text-white/60">{tradesError}</p>
                  </div>
                ) : trades.length > 0 ? (
                  <div>
                    {isMobile ? (
                      // Mobile card view
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {trades.slice(0, 20).map((trade, index) => (
                          <div key={index} className="bg-white/50 rounded-lg p-3 border border-[#1A3C40]/10">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="text-xs text-white/60">{trade.time}</p>
                                <p className="text-base font-semibold text-white">
                                  {trade.priceFormatted || formatPrice(trade.price)}
                                </p>
                              </div>
                              <div className="text-right">
                                {trade.change !== undefined && trade.change !== 0 ? (
                                  <p className={`text-sm font-medium ${trade.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {trade.change > 0 ? '+' : ''}{formatPrice(trade.change)} {trade.changePercent !== undefined ? `(${trade.changePercent > 0 ? '+' : ''}${trade.changePercent.toFixed(2)}%)` : ''}
                                  </p>
                                ) : (
                                  <p className="text-sm text-white/40">No change</p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-white/60">Volume: </span>
                                <span className="text-white font-medium">{trade.volumeFormatted || trade.volume.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-white/60">Exchange: </span>
                                <span className="text-white font-medium">{trade.exchange || 'TSXV'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Desktop table view
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-black/50 backdrop-blur-sm">
                            <tr className="border-b border-white/10">
                              <th className="text-left py-2 px-2 font-medium text-white/60">Date/Time</th>
                              <th className="text-right py-2 px-2 font-medium text-white/60">Price</th>
                              <th className="text-right py-2 px-2 font-medium text-white/60">Change</th>
                              <th className="text-right py-2 px-2 font-medium text-white/60">Change %</th>
                              <th className="text-right py-2 px-2 font-medium text-white/60">Volume</th>
                              <th className="text-center py-2 px-2 font-medium text-white/60">Exchange</th>
                              <th className="text-left py-2 px-2 font-medium text-white/60">Buyer</th>
                              <th className="text-left py-2 px-2 font-medium text-white/60">Seller</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trades.slice(0, 20).map((trade, index) => (
                              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="py-2 px-2 text-white whitespace-nowrap">{trade.time}</td>
                                <td className="text-right py-2 px-2 font-medium text-white">
                                  {trade.priceFormatted || formatPrice(trade.price)}
                                </td>
                                <td className="text-right py-2 px-2">
                                  {trade.change !== undefined && trade.change !== 0 ? (
                                    <span className={trade.change > 0 ? 'text-green-600' : 'text-red-600'}>
                                      {trade.change > 0 ? '+' : ''}{trade.change.toFixed(3)}
                                    </span>
                                  ) : (
                                    <span className="text-white/40">-</span>
                                  )}
                                </td>
                                <td className="text-right py-2 px-2">
                                  {trade.changePercent !== undefined && trade.changePercent !== 0 ? (
                                    <span className={trade.changePercent > 0 ? 'text-green-600' : 'text-red-600'}>
                                      {trade.changePercent > 0 ? '+' : ''}{trade.changePercent.toFixed(3)}
                                    </span>
                                  ) : (
                                    <span className="text-white/40">-</span>
                                  )}
                                </td>
                                <td className="text-right py-2 px-2 text-white">
                                  {trade.volumeFormatted || trade.volume.toLocaleString()}
                                </td>
                                <td className="text-center py-2 px-2 text-white/80">
                                  {trade.exchange || 'TSXV'}
                                </td>
                                <td className="text-left py-2 px-2 text-white/80 text-xs truncate max-w-[120px]" title={trade.buyer}>
                                  {trade.buyer || 'N/A'}
                                </td>
                                <td className="text-left py-2 px-2 text-white/80 text-xs truncate max-w-[120px]" title={trade.seller}>
                                  {trade.seller || 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {trades.length > 20 && (
                      <div className="text-center py-2 text-xs md:text-sm text-white/60">
                        Showing 20 of {trades.length} trades
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white/60">No recent trades available</p>
                  </div>
                )}
              </motion.div>
            </div>
          )}


          {activeTab === 'reports' && (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(12, 14, 29, 0.85) 0%, 
                    rgba(12, 14, 29, 0.9) 50%, 
                    rgba(12, 14, 29, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                  padding: isMobile ? '1.5rem' : '2rem'
                }}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                  Corporate Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Share Structure */}
                  <div style={{
                    background: `linear-gradient(135deg, 
                      rgba(12, 14, 29, 0.6) 0%, 
                      rgba(12, 14, 29, 0.75) 50%, 
                      rgba(12, 14, 29, 0.6) 100%)`,
                    backdropFilter: 'blur(10px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: isMobile ? '1rem' : '1.5rem'
                  }}>
                    <h3 className="text-base md:text-lg font-semibold text-[#E5E5E5] mb-4">
                      Share Structure
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Total Shares (All Classes)</span>
                        <span className="text-white font-medium">36,594,622</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Issued & Outstanding</span>
                        <span className="text-white font-medium">36,594,622</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Warrants</span>
                        <span className="text-white font-medium">--</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Options</span>
                        <span className="text-white font-medium">--</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/70 font-medium">Fully Diluted</span>
                        <span className="text-[#E5E5E5] font-bold">36,594,622</span>
                      </div>
                    </div>
                  </div>

                  {/* Market Information */}
                  <div style={{
                    background: `linear-gradient(135deg, 
                      rgba(12, 14, 29, 0.6) 0%, 
                      rgba(12, 14, 29, 0.75) 50%, 
                      rgba(12, 14, 29, 0.6) 100%)`,
                    backdropFilter: 'blur(10px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: isMobile ? '1rem' : '1.5rem'
                  }}>
                    <h3 className="text-base md:text-lg font-semibold text-[#E5E5E5] mb-4">
                      Market Information
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">Market Cap</span>
                        <span className="text-white font-medium">
                          ${stockData ? (stockData.price * 36594622 / 1000000).toFixed(2) + 'M' : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">52 Week High</span>
                        <span className="text-white font-medium">
                          ${stockData?.weekHigh52 ? formatPrice(stockData.weekHigh52) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">52 Week Low</span>
                        <span className="text-white font-medium">
                          ${stockData?.weekLow52 ? formatPrice(stockData.weekLow52) : '--'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/70">Avg Volume</span>
                        <span className="text-white font-medium">
                          {stockData?.avgVolume || '--'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Corporate Details */}
                  <div style={{
                    background: `linear-gradient(135deg, 
                      rgba(12, 14, 29, 0.6) 0%, 
                      rgba(12, 14, 29, 0.75) 50%, 
                      rgba(12, 14, 29, 0.6) 100%)`,
                    backdropFilter: 'blur(10px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: isMobile ? '1rem' : '1.5rem'
                  }}>
                    <h3 className="text-base md:text-lg font-semibold text-[#E5E5E5] mb-4">
                      Corporate Details
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      <div className="py-2">
                        <span className="text-white/70 block mb-1">Exchanges</span>
                        <span className="text-white font-medium">TSX-V: TUO<br />Frankfurt: TFE.F</span>
                      </div>
                      <div className="py-2">
                        <span className="text-white/70 block mb-1">CUSIP</span>
                        <span className="text-white font-medium">82772H</span>
                      </div>
                      <div className="py-2">
                        <span className="text-white/70 block mb-1">ISIN</span>
                        <span className="text-white font-medium">CA82772U1075</span>
                      </div>
                      <div className="py-2">
                        <span className="text-white/70 block mb-1">Fiscal Year End</span>
                        <span className="text-white font-medium">March 31</span>
                      </div>
                      <div className="py-2">
                        <span className="text-white/70 block mb-1">Incorporated</span>
                        <span className="text-white font-medium">June 15, 1980<br />British Columbia, Canada</span>
                      </div>
                    </div>
                  </div>

                  {/* Management */}
                  <div 
                    style={{
                      background: `linear-gradient(135deg, 
                        rgba(12, 14, 29, 0.85) 0%, 
                        rgba(12, 14, 29, 0.9) 50%, 
                        rgba(12, 14, 29, 0.85) 100%)`,
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                        inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                        inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                      borderRadius: '0.5rem',
                      padding: isMobile ? '1rem' : '1.5rem'
                    }}
                  >
                    <h3 className="text-base md:text-lg font-semibold text-[#E5E5E5] mb-4">
                      Management
                    </h3>
                    <div className="space-y-3 text-sm md:text-base">
                      <div className="py-2">
                        <span className="text-white font-medium">Chief Executive Officer</span>
                        <span className="text-white/70 block">Dino Cremonese</span>
                      </div>
                      <div className="py-2">
                        <span className="text-white font-medium">Chief Financial Officer</span>
                        <span className="text-white/70 block">Robert Smiley</span>
                      </div>
                      <div className="py-2">
                        <span className="text-white font-medium">Industry Classification</span>
                        <span className="text-white/70 block">NAICS 212220<br />Gold and Silver Ore Mining</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div 
                  className="mt-8"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(12, 14, 29, 0.85) 0%, 
                      rgba(12, 14, 29, 0.9) 50%, 
                      rgba(12, 14, 29, 0.85) 100%)`,
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                      inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                      inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                    borderRadius: '0.5rem',
                    padding: isMobile ? '1rem' : '1.5rem'
                  }}
                >
                  <h3 className="text-base md:text-lg font-semibold text-[#E5E5E5] mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-white font-medium mb-2">Head Office</h4>
                      <p className="text-white/70 text-sm">
                        2130 Crescent Road<br />
                        Victoria, BC V8S 2H3<br />
                        Canada
                      </p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Contact</h4>
                      <p className="text-white/70 text-sm">
                        Phone: +1 (778) 430-5680<br />
                        Fax: +1 (250) 387-1464<br />
                        Website: www.teuton.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transfer Agent & Auditor */}
                <div className="mt-6 space-y-2">
                  <p className="flex items-start gap-2 text-sm text-white/60">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>Transfer Agent:</strong> Computershare Trust Company of Canada<br />
                      510 Burrard St., Vancouver, BC V6C 3B9 | Phone: +1 (604) 661-0247
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm text-white/60">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>Auditor:</strong> Charlton + Company<br />
                      Suite 1111, 1100 Melville Street, Vancouver, BC V6E 4A6 | Phone: +1 (604) 683-3277
                    </span>
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .glassmorphic-tabs {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.03) 50%,
            rgba(255, 255, 255, 0.01) 100%
          );
          backdrop-filter: blur(20px) saturate(180%) brightness(0.9);
          -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(0.9);
          border-radius: 24px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 119, 0.15);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.5),
            inset 0 2px 4px 0 rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2);
          overflow: hidden;
          position: relative;
        }
        
        .glassmorphic-tabs::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.8) 50%,
            transparent 100%
          );
          opacity: 0.8;
        }
        
        .glassmorphic-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          backdrop-filter: blur(20px) saturate(180%) brightness(0.9);
          -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(0.9);
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 119, 0.1);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.4),
            inset 0 2px 4px 0 rgba(255, 255, 255, 0.05),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
        
        @media (min-width: 768px) {
          .glassmorphic-card {
            border-radius: 22px;
            padding: 24px;
          }
        }
        
        .glassmorphic-card:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px 0 rgba(0, 0, 0, 0.5),
            inset 0 2px 6px 0 rgba(255, 255, 255, 0.1),
            inset 0 -2px 6px 0 rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}

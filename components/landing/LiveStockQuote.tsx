'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi'

interface QuoteData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: string
  high: number
  low: number
  marketCap: string
  timestamp: string
}

export default function LiveStockQuote() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastClose, setLastClose] = useState<number>(0.20) // Default fallback price from TMX
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    // Check initial theme immediately
    if (typeof window !== 'undefined') {
      return document.documentElement.getAttribute('data-header-theme') === 'dark'
    }
    return false
  })
  const [isHovered, setIsHovered] = useState(false)

  // Listen for theme changes
  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-header-theme')
      setIsDarkTheme(theme === 'dark')
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-header-theme') {
          checkTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-header-theme']
    })

    checkTheme() // Check initial theme

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        // Fetch data from TSX scraping script
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        
        if (data && data.price) {
          // Save the last known price
          setLastClose(data.price)
          
          setQuoteData({
            symbol: data.symbol,
            price: data.price,
            change: data.change,
            changePercent: data.changePercent,
            volume: data.volume,
            high: data.high,
            low: data.low,
            marketCap: data.marketCap,
            timestamp: data.timestamp
          })
          setError(false)
        } else {
          setError(true)
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching quote:', err)
        setError(true)
        setLoading(false)
      }
    }

    fetchQuote()
    // Refresh every 5 minutes
    const interval = setInterval(fetchQuote, 300000)
    
    return () => clearInterval(interval)
  }, [])

  // Define colors based on theme - default to gold to prevent blue flash
  const colors = {
    primary: isDarkTheme || loading ? '#D4A574' : '#0022d2',
    background: isDarkTheme || loading ? 'rgba(26, 15, 8, 0.6)' : 'rgba(0,34,210,0.02)',
    backgroundHover: isDarkTheme || loading ? 'rgba(26, 15, 8, 0.8)' : 'rgba(0,34,210,0.05)',
    border: isDarkTheme || loading ? 'rgba(212, 165, 116, 0.3)' : 'rgba(0,34,210,0.15)',
    borderHover: isDarkTheme || loading ? 'rgba(212, 165, 116, 0.6)' : 'rgba(0,34,210,0.2)',
    text: isDarkTheme || loading ? '#D4A574' : '#0022d2',
    textSecondary: isDarkTheme || loading ? 'rgba(212, 165, 116, 0.8)' : 'rgba(0,34,210,0.7)',
  }

  if (loading) {
    // Default to gold colors for loading state to prevent blue flash
    const loadingColors = {
      primary: '#D4A574',
      background: 'rgba(26, 15, 8, 0.6)',
      skeleton: 'rgba(212, 165, 116, 0.2)'
    }
    
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl animate-pulse transition-all duration-500" 
        style={{ 
          backgroundColor: loadingColors.background,
          border: '1px solid rgba(212, 165, 116, 0.3)',
          boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.05)'
        }}>
        <div className="relative">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: loadingColors.primary }} />
          <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: loadingColors.primary, opacity: 0.5 }} />
        </div>
        <div className="h-4 w-20 rounded" style={{ backgroundColor: loadingColors.skeleton }} />
        <div className="h-4 w-16 rounded" style={{ backgroundColor: loadingColors.skeleton }} />
      </div>
    )
  }

  if (error || !quoteData) {
    // Show last known closing price when API fails or market is closed
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-500" 
        style={{ 
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.05)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundHover;
          e.currentTarget.style.border = `1px solid ${colors.borderHover}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.background;
          e.currentTarget.style.border = `1px solid ${colors.border}`;
        }}
      >
        <div className="relative">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: colors.primary, opacity: 0.3 }} />
        </div>
        <span className="text-sm font-semibold transition-colors duration-500" style={{ color: colors.text }}>TSX-V: TUO</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold transition-colors duration-500" style={{ color: colors.text }}>${lastClose.toFixed(3)}</span>
          <span className="text-xs px-2 py-0.5 rounded-md transition-all duration-500" 
            style={{ 
              backgroundColor: isDarkTheme ? 'rgba(212, 165, 116, 0.2)' : 'rgba(0,34,210,0.1)', 
              color: colors.text 
            }}>Close</span>
        </div>
      </div>
    )
  }

  const isPositive = quoteData.change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-500"
      style={{ 
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.05)'
      }}
      onMouseEnter={(e) => {
        setIsHovered(true);
        e.currentTarget.style.backgroundColor = colors.backgroundHover;
        e.currentTarget.style.border = `1px solid ${colors.borderHover}`;
        e.currentTarget.style.boxShadow = 'inset 0 0 15px rgba(255, 255, 255, 0.1)';
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.backgroundColor = colors.background;
        e.currentTarget.style.border = `1px solid ${colors.border}`;
        e.currentTarget.style.boxShadow = 'inset 0 0 10px rgba(255, 255, 255, 0.05)';
      }}
    >
        <div className="relative">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
          <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: colors.primary }} />
        </div>
        
        <span className="text-sm font-semibold transition-colors duration-500" style={{ color: colors.text }}>TSX-V: TUO</span>
        
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold transition-colors duration-500" style={{ color: colors.text }}>${quoteData.price.toFixed(3)}</span>
          
          <div className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-md transition-all duration-500 ${
            isPositive 
              ? isDarkTheme ? 'bg-green-400/20 text-green-400' : 'bg-green-500/10 text-green-500'
              : isDarkTheme ? 'bg-red-400/20 text-red-400' : 'bg-red-500/10 text-red-500'
          }`}>
            {isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
            <span className="font-medium">{isPositive ? '+' : ''}{quoteData.change.toFixed(3)}</span>
            <span className="text-xs">({isPositive ? '+' : ''}{quoteData.changePercent.toFixed(2)}%)</span>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: 'auto', marginLeft: 16 }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              transition={{ 
                duration: 0.3,
                ease: "easeInOut",
                opacity: { duration: 0.2 }
              }}
              className="hidden sm:flex items-center text-xs border-l overflow-hidden whitespace-nowrap"
              style={{ 
                color: colors.textSecondary, 
                borderColor: colors.border,
                paddingLeft: '16px'
              }}
            >
              <div className="flex items-center gap-2">
                <FiActivity className="w-3 h-3 animate-pulse flex-shrink-0" style={{ color: colors.primary }} />
                <span className="font-semibold">Vol: {quoteData.volume}</span>
                {quoteData.high && quoteData.low && (
                  <>
                    <span className="mx-1 opacity-50">·</span>
                    <span className="font-semibold">H: ${quoteData.high.toFixed(3)}</span>
                    <span className="mx-1 opacity-50">·</span>
                    <span className="font-semibold">L: ${quoteData.low.toFixed(3)}</span>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </motion.div>
  )
}
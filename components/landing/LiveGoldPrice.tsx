'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'
import { GiGoldBar } from 'react-icons/gi'

interface GoldPriceData {
  commodity: string
  unit: string
  price: number
  change: number
  changePercent: number
  bid: number
  ask: number
  high: number
  low: number
}

export default function LiveGoldPrice() {
  const [goldData, setGoldData] = useState<GoldPriceData | null>(null)
  const [loading, setLoading] = useState(true)
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
    const fetchGoldPrice = async () => {
      try {
        const response = await fetch('/api/gold-price')
        const data = await response.json()
        setGoldData(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching gold price:', err)
        setLoading(false)
      }
    }

    fetchGoldPrice()
    // Refresh every minute to match Kitco widget update frequency
    const interval = setInterval(fetchGoldPrice, 60000)
    
    return () => clearInterval(interval)
  }, [])

  // Define colors based on theme - matching Egyptian gold/brown theme
  const colors = {
    primary: isDarkTheme || loading ? '#D4A574' : '#FDDE61',
    background: isDarkTheme || loading ? 'rgba(26, 15, 8, 0.6)' : 'rgba(253, 222, 97, 0.1)',
    backgroundHover: isDarkTheme || loading ? 'rgba(26, 15, 8, 0.8)' : 'rgba(253, 222, 97, 0.15)',
    border: isDarkTheme || loading ? 'rgba(212, 165, 116, 0.3)' : 'rgba(253, 222, 97, 0.3)',
    borderHover: isDarkTheme || loading ? 'rgba(212, 165, 116, 0.6)' : 'rgba(253, 222, 97, 0.4)',
    text: isDarkTheme || loading ? '#D4A574' : '#0022d2',
    textSecondary: isDarkTheme || loading ? 'rgba(212, 165, 116, 0.8)' : 'rgba(0,34,210,0.7)',
  }

  // Loading state with Egyptian theme colors
  if (loading) {
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
        <div className="h-4 w-12 rounded" style={{ backgroundColor: loadingColors.skeleton }} />
        <div className="h-4 w-24 rounded" style={{ backgroundColor: loadingColors.skeleton }} />
      </div>
    )
  }

  // Don't render anything if no data
  if (!goldData || !goldData.price) {
    return null
  }

  const isPositive = goldData.change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-500"
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
      
      <span className="text-sm font-semibold transition-colors duration-500" style={{ color: colors.text }}>Gold</span>
      
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold transition-colors duration-500" style={{ color: colors.text }}>${goldData.price.toFixed(2)} USD/oz</span>
        
        <div className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-md transition-all duration-500 ${
          isPositive 
            ? isDarkTheme ? 'bg-green-400/20 text-green-400' : 'bg-green-500/10 text-green-500'
            : isDarkTheme ? 'bg-red-400/20 text-red-400' : 'bg-red-500/10 text-red-500'
        }`}>
          {isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
          <span className="font-medium">{isPositive ? '+' : ''}{goldData.change.toFixed(2)}</span>
          <span className="text-xs">({isPositive ? '+' : ''}{goldData.changePercent.toFixed(2)}%)</span>
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
              <GiGoldBar className="w-3 h-3 animate-pulse flex-shrink-0" style={{ color: colors.primary }} />
              {goldData.ask && (
                <>
                  <span className="font-semibold">Ask: ${goldData.ask.toFixed(2)}</span>
                  <span className="mx-1 opacity-50">·</span>
                </>
              )}
              {goldData.low && goldData.high && (
                <>
                  <span className="font-semibold">L: ${goldData.low.toFixed(2)}</span>
                  <span className="mx-1 opacity-50">·</span>
                  <span className="font-semibold">H: ${goldData.high.toFixed(2)}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

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

export default function LiveGoldPriceLiquidGlass() {
  const [goldData, setGoldData] = useState<GoldPriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLightTheme, setIsLightTheme] = useState(false)
  const pathname = usePathname()
  const isLandingKappa = pathname === '/landingpagekappa' || pathname === '/'

  useEffect(() => {
    // Check for light theme (but NOT on investors page - it uses dark theme)
    const checkTheme = () => {
      const hasLightTheme = (document.documentElement.getAttribute('data-theme') === 'light' || 
                           document.body.getAttribute('data-theme') === 'light' ||
                           document.querySelector('[data-theme="light"]') !== null) &&
                           pathname !== '/investors' // Investors page uses dark theme
      setIsLightTheme(hasLightTheme)
    }
    
    checkTheme()
    // Check immediately and after a short delay
    setTimeout(checkTheme, 10)
    
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, subtree: true })
    
    return () => observer.disconnect()
  }, [pathname])

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

  if (loading) {
    return (
      <div className="liquid-glass-ticker liquid-glass-ticker-loading">
        <div className="liquid-glass-ticker-inner">
          <div className="ticker-pulse" />
          <div className="ticker-skeleton" />
        </div>
      </div>
    )
  }

  // Don't render anything if no data
  if (!goldData || !goldData.price) {
    return null
  }

  const changeStatus = goldData.change > 0 ? 'positive' : goldData.change < 0 ? 'negative' : 'neutral'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass-ticker"
    >
      <div className="liquid-glass-ticker-inner">
        <div className="ticker-glow" />
        
        <div className="ticker-indicator ticker-indicator-gold" />
        
        <span className="ticker-symbol">Gold</span>
        
        <div className="ticker-price-group">
          <span className="ticker-price">${goldData.price.toFixed(2)}</span>
          <span className="ticker-unit">USD/oz</span>
          
          <div className={`ticker-change ${changeStatus}`}>
            {changeStatus === 'positive' ? <FiTrendingUp className="w-4 h-4" /> : 
             changeStatus === 'negative' ? <FiTrendingDown className="w-4 h-4" /> : 
             <FiTrendingUp className="w-4 h-4" style={{ opacity: 0.5 }} />}
            <span className="ticker-percent">({goldData.change >= 0 ? '+' : ''}{goldData.changePercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .liquid-glass-ticker {
          position: relative;
          display: inline-flex;
          align-items: center;
          border-radius: 24px;
          padding: 2px;
          background: ${!isLightTheme ? 'transparent' : `linear-gradient(
            135deg,
            rgba(250, 245, 228, 0.6) 0%,
            rgba(250, 245, 228, 0.5) 100%
          )`};
          backdrop-filter: ${!isLightTheme ? 'none' : 'blur(20px) saturate(180%)'};
          -webkit-backdrop-filter: ${!isLightTheme ? 'none' : 'blur(20px) saturate(180%)'};
          border: ${!isLightTheme ? 'none' : '1px solid rgba(250, 245, 228, 0.18)'};
          box-shadow: ${!isLightTheme ? 'none' : `
            0 8px 32px 0 rgba(0, 0, 0, 0.37),
            inset 0 2px 4px 0 rgba(250, 245, 228, 0.2),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)`};
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .liquid-glass-ticker:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 40px 0 rgba(0, 0, 0, 0.4),
            inset 0 2px 6px 0 rgba(250, 245, 228, 0.3),
            inset 0 -2px 6px 0 rgba(0, 0, 0, 0.15);
          border-color: rgba(250, 245, 228, 0.25);
        }
        
        .liquid-glass-ticker-inner {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-radius: 22px;
          background: transparent;
          overflow: hidden;
          white-space: nowrap;
        }
        
        .ticker-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(255, 215, 0, 0.15) 0%,
            transparent 70%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .liquid-glass-ticker:hover .ticker-glow {
          opacity: 1;
        }
        
        .ticker-indicator {
          position: relative;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.8);
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        }
        
        .ticker-indicator-gold::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.4);
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0;
            transform: scale(1.5);
          }
        }
        
        .ticker-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.6);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .ticker-skeleton {
          height: 16px;
          width: 80px;
          background: linear-gradient(
            90deg,
            rgba(255, 215, 0, 0.1) 25%,
            rgba(255, 215, 0, 0.2) 50%,
            rgba(255, 215, 0, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .ticker-symbol {
          font-size: 16px;
          font-weight: 600;
          color: ${isLightTheme ? '#1C1C1C' : 'rgba(250, 245, 228, 0.9)'};
          letter-spacing: 0.025em;
        }
        
        .ticker-price-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .ticker-unit {
          font-size: 14px;
          font-weight: 500;
          color: ${isLightTheme ? 'rgba(28, 28, 28, 0.6)' : 'rgba(250, 245, 228, 0.7)'};
          white-space: nowrap;
        }
        
        .ticker-price {
          font-size: 20px;
          font-weight: 700;
          color: ${isLightTheme ? '#1C1C1C' : '#fff'};
          text-shadow: ${isLightTheme ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
        }
        
        .ticker-change {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          transition: all 0.2s ease;
        }
        
        .ticker-change.positive {
          background: rgba(34, 197, 94, 0.25);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.5);
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        
        .ticker-change.negative {
          background: ${isLightTheme ? 'rgba(107, 114, 128, 0.1)' : 'rgba(250, 245, 228, 0.25)'};
          color: ${isLightTheme ? '#6B7280' : 'rgba(250, 245, 228, 0.9)'};
          border: 1px solid ${isLightTheme ? 'rgba(107, 114, 128, 0.3)' : 'rgba(250, 245, 228, 0.3)'};
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        
        .ticker-change.neutral {
          background: ${isLightTheme ? 'rgba(107, 114, 128, 0.1)' : 'rgba(250, 245, 228, 0.25)'};
          color: ${isLightTheme ? '#6B7280' : 'rgba(250, 245, 228, 0.9)'};
          border: 1px solid ${isLightTheme ? 'rgba(107, 114, 128, 0.3)' : 'rgba(250, 245, 228, 0.3)'};
          font-weight: 600;
          backdrop-filter: blur(10px);
        }
        
        .ticker-percent {
          font-size: 12px;
          opacity: 0.8;
          color: ${isLightTheme ? '#1C1C1C' : 'inherit'};
        }
        
        /* Dark theme adjustments */
        [data-header-theme="dark"] .liquid-glass-ticker {
          background: linear-gradient(
            135deg,
            rgba(26, 15, 8, 0.95) 0%,
            rgba(26, 15, 8, 0.85) 100%
          );
          border-color: rgba(255, 215, 0, 0.3);
        }
        
        [data-header-theme="dark"] .ticker-symbol,
        [data-header-theme="dark"] .ticker-price {
          color: #FFD700;
        }
        
        /* Loading state */
        .liquid-glass-ticker-loading .liquid-glass-ticker-inner {
          gap: 8px;
        }
      `}</style>
    </motion.div>
  )
}
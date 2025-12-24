'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
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
  previousClose?: number
}

export default function LiveStockQuoteLiquidGlass() {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    symbol: 'TSX-V: TUO',
    price: 0.185,  // Default close price
    change: 0,
    changePercent: 0,
    volume: '--',
    high: 0.185,
    low: 0.185,
    marketCap: '--',
    timestamp: new Date().toISOString()
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [lastClose, setLastClose] = useState<number | null>(0.185)
  const [isHovered, setIsHovered] = useState(false)
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
    const fetchQuote = async (retryCount = 0) => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await fetch('/api/stock-quote', {
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        if (data && data.price !== undefined && data.price > 0) {
          // We have price data from TMX (this is the close price when market is closed)
          setLastClose(data.price)
          setQuoteData({
            symbol: data.symbol || 'TSX-V: TUO',
            price: data.price,
            change: data.change || 0,
            changePercent: data.changePercent || 0,
            volume: data.volume || '--',
            high: data.high || data.price,
            low: data.low || data.price,
            marketCap: data.marketCap || '--',
            timestamp: data.timestamp,
            previousClose: data.previousClose || data.price
          })
          setError(false)
        } else {
          // No valid price data
          setQuoteData({
            symbol: data?.symbol || 'TSX-V: TUO',
            price: 0.20, // Fallback price
            change: 0,
            changePercent: 0,
            volume: '--',
            high: 0.20,
            low: 0.20,
            marketCap: '--',
            timestamp: data?.timestamp || new Date().toISOString()
          })
          setError(true)
        }
        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching quote:', err)
        
        // Retry logic for network errors
        if (retryCount < 2 && err.name !== 'AbortError') {
          setTimeout(() => fetchQuote(retryCount + 1), 1000)
          return
        }
        
        // Set fallback data instead of just erroring
        if (!quoteData || quoteData.price === 0) {
          setQuoteData({
            symbol: 'TSX-V: TUO',
            price: 0.20, // Fallback price
            change: 0,
            changePercent: 0,
            volume: '--',
            high: 0.20,
            low: 0.20,
            marketCap: '--',
            timestamp: new Date().toISOString()
          })
          setLastClose(0.20)
        }
        setError(true)
        setLoading(false)
      }
    }

    fetchQuote()
    const interval = setInterval(fetchQuote, 300000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="liquid-glass-ticker liquid-glass-ticker-loading">
        <div className="liquid-glass-ticker-inner">
          <div className="ticker-pulse" />
          <div className="ticker-skeleton" />
          <div className="ticker-skeleton-small" />
        </div>
      </div>
    )
  }

  if (error || !quoteData) {
    return (
      <div className="liquid-glass-ticker">
        <div className="liquid-glass-ticker-inner">
          <div className="ticker-indicator" />
          <span className="ticker-symbol">TSX-V: TUO</span>
          <div className="ticker-price-group">
            <span className="ticker-price">{lastClose !== null && lastClose > 0 ? `$${lastClose % 0.01 === 0 ? lastClose.toFixed(2) : lastClose.toFixed(3)}` : '$0.20'}</span>
            <span className="ticker-status">Market Closed</span>
          </div>
        </div>
      </div>
    )
  }

  const changeStatus = quoteData.change > 0 ? 'positive' : quoteData.change < 0 ? 'negative' : 'neutral'
  const isMarketClosed = quoteData.volume === '--' || (quoteData.change === 0 && quoteData.changePercent === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass-ticker"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="liquid-glass-ticker-inner">
        <div className="ticker-glow" />
        
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ticker-content-wrapper"
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              <div className={`ticker-indicator ${isMarketClosed ? '' : 'ticker-indicator-live'}`} />
              <span className="ticker-symbol">TSX-V: TUO</span>
              <span className="ticker-price">{quoteData.price > 0 ? `$${quoteData.price % 0.01 === 0 ? quoteData.price.toFixed(2) : quoteData.price.toFixed(3)}` : '--'}</span>
              {isMarketClosed ? (
                <span className="ticker-status" style={{ fontSize: '0.75rem', opacity: 0.7 }}>Market Closed</span>
              ) : (
                <div className={`ticker-change ${changeStatus}`}>
                  {changeStatus === 'positive' ? <FiTrendingUp className="w-4 h-4" /> : 
                   changeStatus === 'negative' ? <FiTrendingDown className="w-4 h-4" /> : 
                   <FiActivity className="w-4 h-4" />}
                  <span className="ticker-percent">{quoteData.price > 0 ? `(${quoteData.change >= 0 ? '+' : ''}${quoteData.changePercent.toFixed(2)}%)` : ''}</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="ticker-content-wrapper"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div className="ticker-details-expanded">
                <span>Vol {quoteData.volume}</span>
                <span className="ticker-separator">·</span>
                <span>H {quoteData.high > 0 ? `$${quoteData.high % 0.01 === 0 ? quoteData.high.toFixed(2) : quoteData.high.toFixed(3)}` : '--'}</span>
                <span className="ticker-separator">·</span>
                <span>L {quoteData.low > 0 ? `$${quoteData.low % 0.01 === 0 ? quoteData.low.toFixed(2) : quoteData.low.toFixed(3)}` : '--'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
          flex-wrap: nowrap;
        }
        
        .ticker-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle at center,
            rgba(210, 180, 140, 0.15) 0%,
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
          background: rgba(210, 180, 140, 0.8);
          box-shadow: 0 0 12px rgba(210, 180, 140, 0.6);
        }
        
        .ticker-indicator-live::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(210, 180, 140, 0.4);
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
          background: rgba(210, 180, 140, 0.6);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .ticker-skeleton {
          height: 16px;
          width: 80px;
          background: linear-gradient(
            90deg,
            rgba(210, 180, 140, 0.1) 25%,
            rgba(210, 180, 140, 0.2) 50%,
            rgba(210, 180, 140, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        
        .ticker-skeleton-small {
          height: 16px;
          width: 60px;
          background: linear-gradient(
            90deg,
            rgba(210, 180, 140, 0.1) 25%,
            rgba(210, 180, 140, 0.2) 50%,
            rgba(210, 180, 140, 0.1) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          animation-delay: 0.2s;
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
          color: ${isLightTheme ? '#1C1C1C' : 'rgba(255, 255, 255, 0.9)'};
          letter-spacing: 0.025em;
        }
        
        
        .ticker-price {
          font-size: 20px;
          font-weight: 700;
          color: ${isLightTheme ? '#1C1C1C' : '#fff'};
          text-shadow: ${isLightTheme ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.2)'};
        }
        
        .ticker-status {
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
          background: ${isLightTheme ? 'rgba(193, 68, 14, 0.15)' : 'rgba(210, 180, 140, 0.2)'};
          color: ${isLightTheme ? '#C1440E' : 'rgba(210, 180, 140, 0.9)'};
          font-weight: 500;
          backdrop-filter: blur(10px);
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
        
        .ticker-content-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          white-space: nowrap;
          flex-wrap: nowrap;
        }
        
        .ticker-details-expanded {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 16px;
          color: ${isLightTheme ? 'rgba(28, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
          white-space: nowrap;
          font-weight: 500;
          flex-wrap: nowrap;
        }
        
        .ticker-icon {
          color: #D2B48C;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .ticker-separator {
          opacity: 0.3;
        }
        
        /* Dark theme adjustments */
        [data-header-theme="dark"] .liquid-glass-ticker {
          background: linear-gradient(
            135deg,
            rgba(28, 28, 28, 0.95) 0%,
            rgba(28, 28, 28, 0.85) 100%
          );
          border-color: rgba(210, 180, 140, 0.3);
        }
        
        [data-header-theme="dark"] .ticker-symbol,
        [data-header-theme="dark"] .ticker-price {
          color: #D2B48C;
        }
        
        /* Loading state */
        .liquid-glass-ticker-loading .liquid-glass-ticker-inner {
          gap: 8px;
        }
      `}</style>
    </motion.div>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TickerItem {
  label: string
  value: string
  change?: string
  positive?: boolean
}

export default function LandingTickerLiquidGlass() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    { label: 'TSX-V: LUXR', value: '$0.200', change: '+0.005', positive: true },
    { label: 'Market Cap', value: '$18.5M' },
    { label: 'Gold Price', value: '$2,045/oz', change: '+0.8%', positive: true },
    { label: 'Volume', value: '125.3K' },
    { label: '52W Range', value: '$0.15-$0.35' },
    { label: 'Big Gold Discovery', value: '90m @ 14.4 g/t Au' },
  ])

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        
        if (data && data.price) {
          setTickerItems(prev => [
            { 
              label: 'TSX-V: LUXR', 
              value: `$${data.price.toFixed(3)}`, 
              change: `${data.change >= 0 ? '+' : ''}${data.change.toFixed(3)}`, 
              positive: data.change >= 0 
            },
            { 
              label: 'Market Cap', 
              value: data.marketCap || '$18.5M'
            },
            { 
              label: 'Gold Price', 
              value: '$2,045/oz', 
              change: '+0.8%', 
              positive: true 
            },
            { 
              label: 'Volume', 
              value: data.volume || '125.3K'
            },
            { 
              label: 'Day Range', 
              value: data.high && data.low ? `$${data.low.toFixed(3)}-$${data.high.toFixed(3)}` : '$0.18-$0.21'
            },
            { 
              label: 'Big Gold Discovery', 
              value: '90m @ 14.4 g/t Au' 
            },
          ])
        }
      } catch (error) {
        console.error('Error fetching market data:', error)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 300000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="liquid-glass-ticker-bar">
      <div className="ticker-glass-layer" />
      <div className="ticker-content">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ 
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          }}
          className="ticker-track"
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="ticker-item">
              <div className="ticker-item-inner">
                <span className="ticker-label">{item.label}:</span>
                <span className="ticker-value">{item.value}</span>
                {item.change && (
                  <span className={`ticker-change ${item.positive ? 'positive' : 'negative'}`}>
                    {item.change}
                  </span>
                )}
              </div>
              <span className="ticker-divider">•</span>
            </div>
          ))}
        </motion.div>
      </div>
      
      <style jsx>{`
        .liquid-glass-ticker-bar {
          position: relative;
          width: 100%;
          padding: 16px 0;
          overflow: hidden;
          background: linear-gradient(
            180deg,
            rgba(142, 98, 29, 0.6) 0%,
            rgba(142, 98, 29, 0.5) 100%
          );
          border-top: 1px solid rgba(212, 165, 116, 0.2);
          border-bottom: 1px solid rgba(212, 165, 116, 0.2);
          z-index: 1;
        }
        
        .ticker-glass-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          backdrop-filter: blur(10px) saturate(150%);
          -webkit-backdrop-filter: blur(10px) saturate(150%);
          pointer-events: none;
        }
        
        .ticker-glass-layer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            rgba(212, 165, 116, 0.1) 0%,
            transparent 10%,
            transparent 90%,
            rgba(212, 165, 116, 0.1) 100%
          );
        }
        
        .ticker-content {
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
          width: 100%;
        }
        
        .ticker-track {
          display: flex;
          gap: 32px;
          white-space: nowrap;
          position: relative;
          will-change: transform;
        }
        
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .ticker-item-inner {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .ticker-item-inner:hover {
          background: rgba(255, 255, 255, 0.5);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 
            0 6px 16px rgba(0, 0, 0, 0.15),
            inset 0 1px 3px rgba(255, 255, 255, 0.15);
        }
        
        .ticker-label {
          font-size: 13px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.025em;
        }
        
        .ticker-value {
          font-size: 14px;
          font-weight: 700;
          color: #D4A574;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .ticker-change {
          font-size: 12px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 8px;
          backdrop-filter: blur(10px);
        }
        
        .ticker-change.positive {
          background: rgba(255, 255, 119, 0.6);
          color: #FFFF77;
          border: 1px solid rgba(255, 255, 119, 0.8);
          font-weight: 600;
        }
        
        .ticker-change.negative {
          background: rgba(193, 68, 14, 0.6);
          color: #FAF5E4;
          border: 1px solid rgba(193, 68, 14, 0.8);
          font-weight: 600;
        }
        
        .ticker-divider {
          color: rgba(212, 165, 116, 0.3);
          font-size: 18px;
          line-height: 1;
        }
        
        /* Gradient edges for fade effect */
        .liquid-glass-ticker-bar::before,
        .liquid-glass-ticker-bar::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100px;
          pointer-events: none;
          z-index: 10;
        }
        
        .liquid-glass-ticker-bar::before {
          left: 0;
          background: linear-gradient(
            90deg,
            rgba(142, 98, 29, 1) 0%,
            rgba(142, 98, 29, 0.8) 30%,
            transparent 100%
          );
        }
        
        .liquid-glass-ticker-bar::after {
          right: 0;
          background: linear-gradient(
            270deg,
            rgba(142, 98, 29, 1) 0%,
            rgba(142, 98, 29, 0.8) 30%,
            transparent 100%
          );
        }
        
        /* Dark theme */
        [data-theme="dark"] .liquid-glass-ticker-bar {
          background: linear-gradient(
            180deg,
            rgba(26, 15, 8, 0.6) 0%,
            rgba(26, 15, 8, 0.3) 100%
          );
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .ticker-track {
            gap: 24px;
          }
          
          .ticker-item-inner {
            padding: 6px 12px;
          }
          
          .ticker-label {
            font-size: 12px;
          }
          
          .ticker-value {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
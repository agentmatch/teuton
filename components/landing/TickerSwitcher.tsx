'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import LiveStockQuoteLiquidGlass from './LiveStockQuoteLiquidGlass'
import LiveGoldPriceLiquidGlass from './LiveGoldPriceLiquidGlass'
import LiveSilverPriceLiquidGlass from './LiveSilverPriceLiquidGlass'

export default function TickerSwitcher() {
  const [activeTab, setActiveTab] = useState<'teuton' | 'gold' | 'silver'>('teuton')
  const [isLightTheme, setIsLightTheme] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setMounted(true)
    // Check if parent has light theme data attribute (but NOT on investors page - it uses dark theme)
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
    
    // Check on DOM changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, subtree: true })
    
    return () => observer.disconnect()
  }, [pathname])

  return (
    <div className="ticker-switcher">
      {/* Tab Switcher */}
      <div className={`ticker-tabs ${isLightTheme ? 'light-theme' : ''}`}>
        <button
          className={`ticker-tab ${activeTab === 'teuton' ? 'active' : 'inactive-outline'}`}
          onClick={() => setActiveTab('teuton')}
        >
          <span className="tab-label">TUO</span>
        </button>
        <button
          className={`ticker-tab ${activeTab === 'gold' ? 'active' : 'inactive-outline'}`}
          onClick={() => setActiveTab('gold')}
        >
          <span className="tab-label">GOLD</span>
        </button>
        <button
          className={`ticker-tab ${activeTab === 'silver' ? 'active' : 'inactive-outline'}`}
          onClick={() => setActiveTab('silver')}
        >
          <span className="tab-label">SILVER</span>
        </button>
      </div>

      {/* Ticker Content */}
      <div className="ticker-content">
        {mounted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {activeTab === 'teuton' ? (
                <LiveStockQuoteLiquidGlass />
              ) : activeTab === 'gold' ? (
                <LiveGoldPriceLiquidGlass />
              ) : (
                <LiveSilverPriceLiquidGlass />
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <LiveStockQuoteLiquidGlass />
          </div>
        )}
      </div>

      <style jsx>{`
        /* Dynamic styles based on theme */
        .ticker-switcher {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 16px;
        }

        .ticker-tabs {
          display: flex;
          flex-direction: row;
          position: relative;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 20px;
          padding: 6px;
          gap: 5px;
        }

        /* Light theme styles for ticker tabs */
        .ticker-tabs.light-theme {
          background: transparent;
          border: 1px solid rgba(26, 60, 64, 0.2);
        }

        .ticker-tab {
          position: relative;
          padding: 8px 20px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 2;
          border-radius: 22px;
          width: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ticker-tab.inactive-outline {
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        
        .light-theme .ticker-tab.inactive-outline {
          border: 1px solid rgba(26, 60, 64, 0.04);
        }

        .ticker-tab:hover:not(.active) {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px) saturate(130%);
          -webkit-backdrop-filter: blur(15px) saturate(130%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 2px 8px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.2);
        }
        
        .light-theme .ticker-tab:hover:not(.active) {
          background: rgba(26, 60, 64, 0.05);
        }

        .ticker-tab.active {
          background: rgba(254, 217, 146, 0.4);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(254, 217, 146, 0.5);
          box-shadow: 
            0 4px 12px rgba(254, 217, 146, 0.3),
            inset 0 1px 2px rgba(255, 255, 255, 0.3),
            inset 0 -1px 1px rgba(254, 217, 146, 0.2);
        }
        
        .light-theme .ticker-tab.active {
          background: linear-gradient(
            135deg,
            rgba(193, 68, 14, 0.15) 0%,
            rgba(193, 68, 14, 0.1) 50%,
            rgba(193, 68, 14, 0.05) 100%
          );
          box-shadow: 
            inset 0 0 0 1px rgba(193, 68, 14, 0.3),
            inset 0 2px 4px rgba(193, 68, 14, 0.1);
        }

        .tab-label {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: ${isLightTheme ? 'rgba(26, 60, 64, 0.5)' : 'rgba(255, 255, 255, 0.5)'};
          transition: all 0.2s ease;
        }
        
        .light-theme .tab-label {
          color: rgba(26, 60, 64, 0.5);
        }

        .ticker-tab.active .tab-label {
          color: ${isLightTheme ? 'rgba(26, 60, 64, 1)' : 'rgba(255, 255, 255, 1)'};
          text-shadow: ${isLightTheme ? '0 0 10px rgba(193, 68, 14, 0.3)' : '0 0 10px rgba(255, 215, 0, 0.5)'};
        }
        
        .light-theme .ticker-tab.active .tab-label {
          color: rgba(26, 60, 64, 1);
          text-shadow: 0 0 10px rgba(193, 68, 14, 0.3);
        }


        .ticker-content {
          position: relative;
          min-width: 420px;
          height: 48px;
          display: flex;
          align-items: center;
        }

        /* Mobile adjustments */
        @media (max-width: 768px) {
          .ticker-switcher {
            gap: 12px;
          }

          .ticker-tab {
            padding: 6px 16px;
            width: 78px;
          }

          .tab-label {
            font-size: 12px;
          }
          
          .ticker-content {
            min-width: 350px;
          }
        }
      `}</style>
    </div>
  )
}
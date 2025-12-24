'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiX, FiTrendingUp, FiTrendingDown, FiActivity, FiDollarSign, FiBarChart2 } from 'react-icons/fi'

interface StockModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function StockModal({ isOpen, onClose }: StockModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'details'>('overview')
  
  // Data from TSX scraping script (fallback values match /api/stock-quote)
  const stockData = {
    symbol: 'LUXR',
    price: 0.20,
    change: -0.02,
    changePercent: -9.091,
    high: 0.22,
    low: 0.115,
    volume: '47.16K',
    avgVolume: '30K',
    marketCap: '$3.8M',
    pe: 'N/A',
    eps: 'N/A',
    beta: '2.1',
    yearHigh: 0.42,
    yearLow: 0.08,
    shares: '19M',
    float: '15M',
  }

  // Chart data showing intraday movement (matching TSX data)
  const chartData = [
    { time: '9:30', price: 0.22 },
    { time: '10:00', price: 0.215 },
    { time: '10:30', price: 0.21 },
    { time: '11:00', price: 0.205 },
    { time: '11:30', price: 0.21 },
    { time: '12:00', price: 0.205 },
    { time: '12:30', price: 0.20 },
    { time: '1:00', price: 0.195 },
    { time: '1:30', price: 0.20 },
    { time: '2:00', price: 0.195 },
    { time: '2:30', price: 0.19 },
    { time: '3:00', price: 0.195 },
    { time: '3:30', price: 0.20 },
  ]

  const isPositive = stockData.change >= 0
  const maxPrice = Math.max(...chartData.map(d => d.price))
  const minPrice = Math.min(...chartData.map(d => d.price))
  const priceRange = maxPrice - minPrice

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-full max-w-4xl"
            >
              <div className="neumorphic-card bg-background border-2 border-accent/20 max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-accent/20">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-accent">TSX-V: {stockData.symbol}</span>
                    <span className="text-sm font-normal text-muted-foreground">Luxor Metals Corp.</span>
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-3xl font-bold">${stockData.price.toFixed(2)}</span>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                      isPositive ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {isPositive ? <FiTrendingUp className="w-4 h-4" /> : <FiTrendingDown className="w-4 h-4" />}
                      <span className="font-medium">{isPositive ? '+' : ''}{stockData.change.toFixed(2)}</span>
                      <span className="text-sm">({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="neumorphic-button rounded-xl p-3 hover:text-accent transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-accent/20">
                {['overview', 'chart', 'details'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 px-6 py-3 capitalize font-medium transition-all ${
                      activeTab === tab
                        ? 'text-accent border-b-2 border-accent bg-accent/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/5'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="neumorphic-card p-4 bg-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                          <FiActivity className="w-4 h-4" />
                          <span>Volume</span>
                        </div>
                        <div className="font-semibold text-lg">{stockData.volume}</div>
                        <div className="text-xs text-muted-foreground">Avg: {stockData.avgVolume}</div>
                      </div>
                      <div className="neumorphic-card p-4 bg-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                          <FiDollarSign className="w-4 h-4" />
                          <span>Market Cap</span>
                        </div>
                        <div className="font-semibold text-lg">{stockData.marketCap}</div>
                        <div className="text-xs text-muted-foreground">Shares: {stockData.shares}</div>
                      </div>
                      <div className="neumorphic-card p-4 bg-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                          <FiBarChart2 className="w-4 h-4" />
                          <span>Day Range</span>
                        </div>
                        <div className="font-semibold text-lg">${stockData.low} - ${stockData.high}</div>
                        <div className="text-xs text-muted-foreground">52W: ${stockData.yearLow} - ${stockData.yearHigh}</div>
                      </div>
                      <div className="neumorphic-card p-4 bg-accent/5 border border-accent/20">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                          <FiTrendingUp className="w-4 h-4" />
                          <span>Performance</span>
                        </div>
                        <div className="font-semibold text-lg text-green-500">+66.67%</div>
                        <div className="text-xs text-muted-foreground">YTD Return</div>
                      </div>
                    </div>

                    {/* Company Overview */}
                    <div className="neumorphic-card p-6 bg-accent/5 border border-accent/20">
                      <h3 className="font-semibold text-lg mb-3 text-accent">Company Overview</h3>
                      <p className="text-muted-foreground mb-4">
                        Luxor Metals Corp. is a mineral exploration company focused on high-grade gold and copper discoveries 
                        in British Columbia's Golden Triangle. The company holds six strategic properties covering 20,481 hectares 
                        adjacent to world-class deposits including Eskay Creek and KSM.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Exchange:</span>
                          <span className="ml-2 font-medium">TSX Venture</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sector:</span>
                          <span className="ml-2 font-medium">Mining</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Industry:</span>
                          <span className="ml-2 font-medium">Gold/Copper</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Employees:</span>
                          <span className="ml-2 font-medium">12</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'chart' && (
                  <div className="neumorphic-card p-6 bg-accent/5 border border-accent/20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Intraday Chart</h3>
                      <div className="flex gap-2">
                        {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                          <button
                            key={period}
                            className="px-3 py-1 text-sm rounded-lg neumorphic-button hover:bg-accent/10 hover:text-accent transition-colors"
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Simple SVG Chart */}
                    <div className="relative h-64 mt-4">
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        {/* Grid lines */}
                        {[0, 1, 2, 3, 4].map((i) => (
                          <line
                            key={i}
                            x1="0"
                            y1={i * 50}
                            x2="400"
                            y2={i * 50}
                            stroke="currentColor"
                            strokeOpacity="0.1"
                          />
                        ))}
                        
                        {/* Price line */}
                        <polyline
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          points={chartData.map((d, i) => {
                            const x = (i / (chartData.length - 1)) * 400
                            const y = 200 - ((d.price - minPrice) / priceRange) * 180
                            return `${x},${y}`
                          }).join(' ')}
                        />
                        
                        {/* Area fill */}
                        <polygon
                          fill="url(#areaGradient)"
                          opacity="0.1"
                          points={`0,200 ${chartData.map((d, i) => {
                            const x = (i / (chartData.length - 1)) * 400
                            const y = 200 - ((d.price - minPrice) / priceRange) * 180
                            return `${x},${y}`
                          }).join(' ')} 400,200`}
                        />
                        
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#5B9FEB" />
                            <stop offset="100%" stopColor="#FFD700" />
                          </linearGradient>
                          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#5B9FEB" />
                            <stop offset="100%" stopColor="#5B9FEB" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
                        <span>${maxPrice.toFixed(3)}</span>
                        <span>${((maxPrice + minPrice) / 2).toFixed(3)}</span>
                        <span>${minPrice.toFixed(3)}</span>
                      </div>
                    </div>
                    
                    {/* Time labels */}
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>9:30 AM</span>
                      <span>12:00 PM</span>
                      <span>3:30 PM</span>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <div className="neumorphic-card p-6 bg-accent/5 border border-accent/20">
                      <h3 className="font-semibold text-lg mb-4 text-accent">Detailed Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Previous Close</span>
                            <span className="font-medium">$0.22</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Open</span>
                            <span className="font-medium">$0.22</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Bid</span>
                            <span className="font-medium">$0.199 x 1000</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ask</span>
                            <span className="font-medium">$0.201 x 1500</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Day's Range</span>
                            <span className="font-medium">${stockData.low} - ${stockData.high}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">52 Week Range</span>
                            <span className="font-medium">${stockData.yearLow} - ${stockData.yearHigh}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Volume</span>
                            <span className="font-medium">{stockData.volume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Avg. Volume</span>
                            <span className="font-medium">{stockData.avgVolume}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Market Cap</span>
                            <span className="font-medium">{stockData.marketCap}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Beta (5Y Monthly)</span>
                            <span className="font-medium">{stockData.beta}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="neumorphic-card p-6 bg-accent/5 border border-accent/20">
                      <h3 className="font-semibold text-lg mb-4 text-accent">Share Statistics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Shares Outstanding</span>
                            <span className="font-medium">{stockData.shares}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Float</span>
                            <span className="font-medium">{stockData.float}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">% Held by Insiders</span>
                            <span className="font-medium">22.8%</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">% Held by Institutions</span>
                            <span className="font-medium">15.3%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Short Interest</span>
                            <span className="font-medium">2.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Short Ratio</span>
                            <span className="font-medium">1.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiTrendingUp, FiTrendingDown, FiBarChart2 } from 'react-icons/fi'

interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: string
  volume: string
  high: number
  low: number
  open: number
  previousClose: number
  marketCap: string
}

export default function StockWidget() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=LUXR.V&apikey=UFVSW1PZ5ZI6P67U`
        )
        const data = await response.json()
        
        if (data['Global Quote']) {
          const quote = data['Global Quote']
          const price = parseFloat(quote['05. price'])
          const sharesOutstanding = 100000000 // Update with actual shares
          
          setStockData({
            symbol: quote['01. symbol'],
            price: price,
            change: parseFloat(quote['09. change']),
            changePercent: quote['10. change percent'],
            volume: parseInt(quote['06. volume']).toLocaleString(),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            open: parseFloat(quote['02. open']),
            previousClose: parseFloat(quote['08. previous close']),
            marketCap: `$${(price * sharesOutstanding / 1000000).toFixed(1)}M`
          })
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching stock data:', err)
        setLoading(false)
      }
    }

    fetchStockData()
    const interval = setInterval(fetchStockData, 300000) // 5 minutes
    
    return () => clearInterval(interval)
  }, [])

  if (loading || !stockData) {
    return (
      <div className="bg-background/10 backdrop-blur-sm border-2 border-background/20 p-6 animate-pulse">
        <div className="h-8 w-32 bg-background/20 rounded mb-4" />
        <div className="h-12 w-24 bg-background/20 rounded" />
      </div>
    )
  }

  const isPositive = stockData.change >= 0
  const dayRange = ((stockData.price - stockData.low) / (stockData.high - stockData.low)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-background/10 backdrop-blur-sm border-2 border-background/20 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-background mb-1">TSX-V: LUXR</h3>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">${stockData.price.toFixed(2)}</span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
              <span className="font-semibold">
                {isPositive ? '+' : ''}{stockData.change.toFixed(2)} ({stockData.changePercent})
              </span>
            </div>
          </div>
        </div>
        <FiBarChart2 className="w-8 h-8 text-primary opacity-50" />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-background/70">Market Cap</span>
          <span className="font-semibold text-background">{stockData.marketCap}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-background/70">Volume</span>
          <span className="font-semibold text-background">{stockData.volume}</span>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-background/70">Day Range</span>
            <span className="font-semibold text-background">${stockData.low} - ${stockData.high}</span>
          </div>
          <div className="relative h-2 bg-background/20 overflow-hidden">
            <div className="absolute inset-y-0 left-0 bg-primary/50" style={{ width: '100%' }} />
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg"
              style={{ left: `${dayRange}%` }}
            />
          </div>
        </div>
        
        <div className="pt-3 border-t border-background/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-background/50">Live prices • 15min delay</span>
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
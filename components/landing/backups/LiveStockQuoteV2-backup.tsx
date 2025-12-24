'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
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
}

export default function LiveStockQuoteV2() {
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        setQuoteData(data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching quote:', err)
        setLoading(false)
      }
    }

    fetchQuote()
    // Refresh every 60 seconds
    const interval = setInterval(fetchQuote, 60000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 backdrop-blur-sm animate-pulse">
        <div className="w-2 h-2 bg-primary/50 rounded-full" />
        <div className="h-4 w-20 bg-primary/20 rounded" />
        <div className="h-4 w-16 bg-primary/20 rounded" />
      </div>
    )
  }

  if (!quoteData) {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 backdrop-blur-sm">
        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        <span className="text-sm font-medium">TSX-V: LUXR</span>
        <span className="text-sm text-muted-foreground">$0.45</span>
      </div>
    )
  }

  const isPositive = quoteData.change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 border border-primary/20 backdrop-blur-sm"
    >
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
      </div>
      
      <span className="text-sm font-medium">TSX-V: LUXR</span>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">${quoteData.price.toFixed(2)}</span>
        
        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
          <span>{isPositive ? '+' : ''}{quoteData.change.toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{quoteData.changePercent.toFixed(1)}%)</span>
        </div>
      </div>
      
      <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground border-l border-border pl-3">
        <FiActivity className="w-3 h-3" />
        <span>Vol: {quoteData.volume}</span>
      </div>
    </motion.div>
  )
}
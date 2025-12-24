'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface TickerItem {
  label: string
  value: string
  change?: string
  positive?: boolean
}

export default function LandingTickerV2() {
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([
    { label: 'TSX-V: LUXR', value: 'Loading...', change: '', positive: true },
    { label: 'Market Cap', value: 'Calculating...' },
    { label: 'Gold Price', value: 'Loading...', change: '', positive: true },
    { label: 'Volume', value: 'Loading...' },
    { label: '52W High', value: 'Loading...' },
    { label: 'Big Gold Discovery', value: '90m @ 14.4 g/t Au' },
  ])

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // Fetch LUXR quote
        const luxrResponse = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=LUXR.V&apikey=UFVSW1PZ5ZI6P67U`
        )
        const luxrData = await luxrResponse.json()
        
        if (luxrData['Global Quote']) {
          const quote = luxrData['Global Quote']
          const price = parseFloat(quote['05. price'])
          const change = parseFloat(quote['09. change'])
          const changePercent = quote['10. change percent']
          const volume = parseInt(quote['06. volume'])
          const high52w = parseFloat(quote['03. high']) // This would need a different endpoint for true 52w high
          
          // Calculate market cap (assuming 100M shares outstanding - adjust as needed)
          const sharesOutstanding = 100000000
          const marketCap = price * sharesOutstanding
          
          setTickerItems([
            { 
              label: 'TSX-V: LUXR', 
              value: `$${price.toFixed(2)}`, 
              change: changePercent, 
              positive: change >= 0 
            },
            { 
              label: 'Market Cap', 
              value: `$${(marketCap / 1000000).toFixed(1)}M` 
            },
            { 
              label: 'Gold Price', 
              value: '$2,045/oz', 
              change: '+0.8%', 
              positive: true 
            },
            { 
              label: 'Volume', 
              value: volume.toLocaleString() 
            },
            { 
              label: 'Day Range', 
              value: `$${quote['04. low']}-$${quote['03. high']}` 
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
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 300000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-foreground text-background py-3 overflow-hidden">
      <div className="relative">
        <motion.div
          animate={{ x: [0, -50 + '%'] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.label}:</span>
              <span className="text-sm font-bold text-primary">{item.value}</span>
              {item.change && (
                <span className={`text-sm ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {item.change}
                </span>
              )}
              <span className="text-background/30 mx-4">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
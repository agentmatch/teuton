'use client'

import { motion } from 'framer-motion'

const tickerItems = [
  { label: 'TSX-V: LXR', value: '$0.45', change: '+12.5%', positive: true },
  { label: 'Market Cap', value: '$45M' },
  { label: 'Gold Price', value: '$2,045/oz', change: '+0.8%', positive: true },
  { label: 'Volume', value: '1.2M' },
  { label: '52W High', value: '$0.68' },
  { label: 'Big Gold Discovery', value: '90m @ 14.4 g/t Au' },
]

export default function LandingTicker() {
  return (
    <div className="bg-foreground text-background py-3 overflow-hidden">
      <div className="relative">
        <motion.div
          animate={{ x: [0, -50 + '%'] }}
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
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
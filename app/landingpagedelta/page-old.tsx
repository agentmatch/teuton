'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

export default function LandingPageDelta() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      {/* Main container with black border */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-[1600px] h-[90vh] rounded-3xl overflow-hidden bg-black p-4"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Inner container with the glacier background */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url('data:image/jpeg;base64,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')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-12">
            {/* Header space - logo is in the main header */}
            <div></div>
            
            {/* Main content */}
            <div className="flex-1 flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-4xl"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
                  Ready for The Next
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                    Major Discovery
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl leading-relaxed">
                  One of the last large-scale exploration opportunities in the world's richest gold district
                </p>
                
                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <Link href="/landing">
                    <button className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25">
                      Explore Our Story
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Bottom content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex justify-between items-end"
            >
              <div className="text-white/70">
                <p className="text-sm">British Columbia's Golden Triangle</p>
                <p className="text-xs mt-1">20,481 Hectares of Strategic Claims</p>
              </div>
              
              <div className="text-right text-white/70">
                <p className="text-sm">TSX-V: LXR</p>
                <p className="text-xs mt-1">Frankfurt: 4HL</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
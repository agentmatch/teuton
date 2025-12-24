'use client'

import { motion } from 'framer-motion'

export function AboutHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950" />
      <div className="absolute inset-0 bg-[url('/images/mining-bg.jpg')] bg-cover bg-center opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-gradient from-gold-400 to-gold-600">Luxor Metals</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100">
            Pioneering sustainable mineral exploration for over two decades
          </p>
        </motion.div>
      </div>
    </section>
  )
}
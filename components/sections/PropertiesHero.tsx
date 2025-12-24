'use client'

import { motion } from 'framer-motion'

export function PropertiesHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-gold-900" />
      <div className="absolute inset-0 bg-[url('/images/properties-bg.jpg')] bg-cover bg-center opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-gradient from-gold-400 to-gold-600">Properties</span>
          </h1>
          <p className="text-xl md:text-2xl text-primary-100">
            Six distinct exploration targets across 20,481 hectares in the Golden Triangle
          </p>
        </motion.div>
      </div>
    </section>
  )
}
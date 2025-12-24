'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import the 3D map component to avoid SSR issues
const GoldenTriangleMap = dynamic(() => import('./GoldenTriangleMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] rounded-lg bg-black/20 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-[#0022d2] border-r-transparent border-b-[#ffb800] border-l-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D Map...</p>
      </div>
    </div>
  ),
})

export default function LandingGoldenTriangle() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 relative overflow-hidden" 
      style={{ background: 'linear-gradient(to bottom, hsl(var(--background)), rgba(0,34,210,0.02), hsl(var(--background)))' }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Strategic Position in the{' '}
            <span style={{
              background: 'linear-gradient(to right, #ffb800, #0022d2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Golden Triangle
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore our 20,481 hectare land package positioned among the world's richest gold deposits
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <Suspense fallback={
            <div className="w-full h-[600px] rounded-lg bg-black/20 animate-pulse" />
          }>
            <GoldenTriangleMap />
          </Suspense>
        </motion.div>

        {/* Key highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="text-3xl font-bold mb-2" style={{ color: '#ffb800' }}>6</div>
            <p className="text-sm text-muted-foreground">Strategic Properties</p>
          </div>
          
          <div className="text-center p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="text-3xl font-bold mb-2" style={{ color: '#0022d2' }}>161M oz</div>
            <p className="text-sm text-muted-foreground">Adjacent Gold Resources</p>
          </div>
          
          <div className="text-center p-6 rounded-lg"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="text-3xl font-bold mb-2" style={{ color: '#00ff00' }}>3</div>
            <p className="text-sm text-muted-foreground">Operating Mines Nearby</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheckCircle, FiTrendingUp, FiAward } from 'react-icons/fi'
import Image from 'next/image'

export default function LandingHighlights() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="highlights" className="py-20 bg-background relative golden-triangles">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl neumorphic-button mb-6">
              <FiTrendingUp className="w-4 h-4 text-accent bounce-hover" />
              <span className="text-sm font-medium text-accent">Discovery Highlight</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Big Gold Discovery
              <span className="block mt-2" style={{
                background: 'linear-gradient(to right, #FFD700, #5B9FEB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block'
              }}>90m @ 14.4 g/t Au</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8">
              One of the highest-grade intercepts in the Golden Triangle, with visible gold 
              throughout the mineralized zone. This discovery validates our systematic 
              exploration approach.
            </p>

            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheckCircle className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Visible Gold Throughout</h4>
                  <p className="text-sm text-muted-foreground">
                    Coarse visible gold observed in drill core across the entire 90m intercept
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Open in All Directions</h4>
                  <p className="text-sm text-muted-foreground">
                    Mineralization remains open for expansion with multiple untested targets
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FiCheckCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Year-Round Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Road accessible via Highway 37 with established infrastructure
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Key stats cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="neumorphic-card p-4 text-center group cursor-pointer transition-all hover:scale-105">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">13 g/t</div>
                <div className="text-xs text-muted-foreground">Silver (Ag)</div>
              </div>
              <div className="neumorphic-card p-4 text-center group cursor-pointer transition-all hover:scale-105">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">1.21%</div>
                <div className="text-xs text-muted-foreground">Copper (Cu)</div>
              </div>
              <div className="neumorphic-card p-4 text-center group cursor-pointer transition-all hover:scale-105">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">0.62%</div>
                <div className="text-xs text-muted-foreground">Lead (Pb)</div>
              </div>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[600px] bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
              {/* Placeholder for core photo or 3D visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <FiAward className="w-24 h-24 text-primary/30 mx-auto mb-4" />
                  <p className="text-primary/50 font-medium">Core Sample Visualization</p>
                </div>
              </div>
              
              {/* Floating annotation */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/4 right-8 bg-card border-2 border-primary p-3 shadow-lg"
              >
                <div className="text-sm font-bold text-primary">Visible Gold</div>
                <div className="text-xs text-muted-foreground">Throughout intercept</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
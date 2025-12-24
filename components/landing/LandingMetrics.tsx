'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { useRef } from 'react'

const metrics = [
  {
    label: 'Total Hectares',
    value: 20481,
    suffix: '',
    description: 'In the Golden Triangle',
    color: 'from-primary to-gold-400',
    icon: '⛰️',
  },
  {
    label: 'Gold Grade',
    value: 14.4,
    suffix: ' g/t',
    decimals: 1,
    description: 'Big Gold Discovery',
    color: 'from-gold-500 to-accent',
    icon: '✨',
  },
  {
    label: 'Intercept Length',
    value: 90,
    suffix: 'm',
    description: 'Continuous mineralization',
    color: 'from-accent to-blue-600',
    icon: '📏',
  },
  {
    label: 'Properties',
    value: 6,
    suffix: '',
    description: 'Active exploration',
    color: 'from-blue-500 to-primary',
    icon: '🗺️',
  },
]

export default function LandingMetrics() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={containerRef} className="py-20 bg-gradient-to-b from-background via-background to-accent/5 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-yellow-500 to-orange-500" />
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Performance
            <span style={{
              background: 'linear-gradient(to right, #FFD700, #5B9FEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}> Metrics</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Industry-leading results that validate our exploration strategy
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Asymmetric layout */}
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`relative group ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}`}
            >
              <div className="neumorphic-card-hover p-8 h-full relative overflow-hidden">
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${metric.color}`} />
                
                {/* Floating icon */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 text-2xl opacity-20"
                >
                  {metric.icon}
                </motion.div>
                
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2" style={{
                    background: 'linear-gradient(to right, #FFD700, #5B9FEB)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    {inView && (
                      <CountUp
                        end={metric.value}
                        duration={2.5}
                        separator=","
                        decimal="."
                        decimals={metric.decimals || 0}
                        suffix={metric.suffix}
                        enableScrollSpy
                        scrollSpyOnce
                      />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{metric.label}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 neumorphic-card max-w-2xl mx-auto"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">Grade Comparison</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Luxor - Big Gold</span>
                <span className="text-sm font-bold text-accent">14.4 g/t Au</span>
              </div>
              <div className="w-full bg-muted h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: '100%' } : {}}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Industry Average</span>
                <span className="text-sm text-muted-foreground">1.5 g/t Au</span>
              </div>
              <div className="w-full bg-muted h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: '10.4%' } : {}}
                  transition={{ duration: 1, delay: 1 }}
                  className="h-full bg-muted-foreground/50"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
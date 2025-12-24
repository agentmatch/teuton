'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiMapPin, FiActivity, FiArrowRight } from 'react-icons/fi'
import { properties } from '@/lib/properties-data'
import { useState, useRef, useEffect } from 'react'

export function PropertiesGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardPositions, setCardPositions] = useState<{[key: number]: {x: number, y: number}}>({})

  // Track mouse position for ripple effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Calculate card positions for connections
  useEffect(() => {
    const updatePositions = () => {
      const positions: {[key: number]: {x: number, y: number}} = {}
      properties.forEach((property) => {
        const element = document.getElementById(`property-${property.id}`)
        if (element && containerRef.current) {
          const rect = element.getBoundingClientRect()
          const containerRect = containerRef.current.getBoundingClientRect()
          positions[property.id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
          }
        }
      })
      setCardPositions(positions)
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [inView])

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, hsl(var(--background)), rgba(0,34,210,0.02), hsl(var(--background)))' }}>
      {/* Background particle field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`bg-particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#ffb800' : '#0022d2',
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative" ref={containerRef}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span style={{ color: '#0022d2' }}>
              Exploration
            </span>{' '}
            <span className="text-foreground">Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each property offers unique geological characteristics and mineralization potential
          </p>
        </motion.div>

        {/* Geological connections SVG layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <linearGradient id="veinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb800" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#d89b00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0022d2" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Render connections when property is hovered */}
          <AnimatePresence>
            {hoveredProperty && cardPositions[hoveredProperty] && (
              <g>
                {properties
                  .filter(p => p.id !== hoveredProperty && cardPositions[p.id])
                  .map(property => (
                    <motion.g key={`connection-${property.id}`}>
                      {/* Connection line */}
                      <motion.path
                        d={`M ${cardPositions[hoveredProperty].x} ${cardPositions[hoveredProperty].y} 
                           Q ${(cardPositions[hoveredProperty].x + cardPositions[property.id].x) / 2} 
                             ${Math.min(cardPositions[hoveredProperty].y, cardPositions[property.id].y) - 50}
                             ${cardPositions[property.id].x} ${cardPositions[property.id].y}`}
                        stroke="url(#veinGradient)"
                        strokeWidth="2"
                        fill="none"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        exit={{ pathLength: 0, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                      
                      {/* Pulsing particles along the vein */}
                      <motion.circle
                        r="3"
                        fill="#ffb800"
                        filter="url(#glow)"
                        initial={{ offsetDistance: '0%', opacity: 0 }}
                        animate={{ 
                          offsetDistance: ['0%', '100%'],
                          opacity: [0, 1, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{
                          offsetPath: `path("M ${cardPositions[hoveredProperty].x} ${cardPositions[hoveredProperty].y} Q ${(cardPositions[hoveredProperty].x + cardPositions[property.id].x) / 2} ${Math.min(cardPositions[hoveredProperty].y, cardPositions[property.id].y) - 50} ${cardPositions[property.id].x} ${cardPositions[property.id].y}")`
                        }}
                      />
                    </motion.g>
                  ))}
              </g>
            )}
          </AnimatePresence>
        </svg>

        {/* Properties grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative" style={{ zIndex: 2 }}>
          {properties.map((property, index) => (
            <motion.div
              key={property.slug}
              id={`property-${property.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative"
              onMouseEnter={() => setHoveredProperty(property.id)}
              onMouseLeave={() => setHoveredProperty(null)}
            >
              {/* Ripple effect container */}
              <AnimatePresence>
                {hoveredProperty === property.id && (
                  <motion.div
                    className="absolute -inset-4 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={`ripple-${i}`}
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          border: '1px solid rgba(255,184,0,0.3)',
                        }}
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ 
                          scale: 1 + (i + 1) * 0.15,
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.3,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Glassmorphism card */}
              <div 
                className="h-full overflow-hidden rounded-2xl relative"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: hoveredProperty === property.id 
                    ? '0 8px 32px rgba(255,184,0,0.2), inset 0 0 20px rgba(0,34,210,0.1)' 
                    : '0 8px 32px rgba(0,34,210,0.1)',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Property image section with gradient overlay */}
                <div className="relative h-64 overflow-hidden">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, rgba(0,34,210,0.8), rgba(30,0,159,0.9))`,
                    }}
                  />
                  
                  {/* Animated mineral particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {property.minerals.map((mineral, i) => (
                      <motion.div
                        key={`mineral-particle-${i}`}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: '80%',
                          background: '#ffb800',
                          boxShadow: '0 0 6px #ffb800',
                        }}
                        animate={{
                          y: [-20, -100],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0],
                        }}
                        transition={{
                          duration: 3,
                          delay: i * 0.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <span 
                      className="px-3 py-1 text-sm text-white rounded-lg"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {property.status}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 transition-all duration-300"
                      style={{
                        transform: hoveredProperty === property.id ? 'translateY(-4px)' : 'translateY(0)',
                        textShadow: hoveredProperty === property.id ? '0 0 20px rgba(255,184,0,0.5)' : 'none',
                      }}
                    >
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <FiMapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content section */}
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    {property.description}
                  </p>
                  
                  {/* Mineral tags with glow effect */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {property.minerals.map((mineral) => (
                      <span
                        key={mineral}
                        className="px-3 py-1 text-sm rounded-lg transition-all duration-300"
                        style={{
                          background: hoveredProperty === property.id 
                            ? 'rgba(255,184,0,0.1)' 
                            : 'rgba(0,34,210,0.05)',
                          border: hoveredProperty === property.id 
                            ? '1px solid rgba(255,184,0,0.3)' 
                            : '1px solid rgba(0,34,210,0.2)',
                          color: hoveredProperty === property.id ? '#ffb800' : '#0022d2',
                        }}
                      >
                        {mineral}
                      </span>
                    ))}
                  </div>
                  
                  {/* Highlights with animated indicators */}
                  <div className="space-y-2 mb-6">
                    {property.highlights.slice(0, 2).map((highlight, i) => (
                      <div key={highlight.title} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <motion.div 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: '#ffb800' }}
                          animate={hoveredProperty === property.id ? {
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6],
                          } : {}}
                          transition={{
                            duration: 2,
                            delay: i * 0.2,
                            repeat: Infinity,
                          }}
                        />
                        {highlight.title}
                      </div>
                    ))}
                  </div>
                  
                  <Link href={`/properties/${property.slug}`}>
                    <Button 
                      className="w-full transition-all duration-300"
                      style={{
                        background: hoveredProperty === property.id 
                          ? 'linear-gradient(135deg, #ffb800, #d89b00)' 
                          : 'linear-gradient(135deg, #0022d2, #1e009f)',
                        border: 'none',
                        boxShadow: hoveredProperty === property.id 
                          ? '0 4px 20px rgba(255,184,0,0.3)' 
                          : '0 4px 20px rgba(0,34,210,0.2)',
                      }}
                    >
                      Explore Property
                      <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Property data with coordinates and estimated claim areas
const properties = [
  { 
    name: 'Tennyson', 
    coordinates: [-130.267, 56.3], 
    area: '~5,200 hectares',
    color: '#FFD700',
    description: 'Advanced porphyry Cu-Au system'
  },
  { 
    name: 'Big Gold', 
    coordinates: [-130.25, 56.28], 
    area: '~3,800 hectares',
    color: '#FFD700',
    description: 'High-grade massive sulfide discoveries'
  },
  { 
    name: "4 J's", 
    coordinates: [-130.2, 56.3], 
    area: '~2,950 hectares',
    color: '#FFD700',
    description: 'Historic VMS target with new Cu-Au discoveries'
  },
  { 
    name: 'Eskay Rift', 
    coordinates: [-130.27, 56.25], 
    area: '~4,100 hectares',
    color: '#FFD700',
    description: 'Eskay Creek-equivalent stratigraphy'
  },
  { 
    name: 'Leduc', 
    coordinates: [-130.35, 56.27], 
    area: '~2,631 hectares',
    color: '#FFD700',
    description: 'Surrounds past-producing Granduc mine'
  },
  { 
    name: 'Pearson', 
    coordinates: [-130.23, 56.23], 
    area: '~1,800 hectares',
    color: '#FFD700',
    description: 'Strong 2.5 km EM conductor'
  },
]

// Convert coordinates to SVG viewbox coordinates
const latLonToSVG = (lon: number, lat: number) => {
  // Define bounds
  const minLon = -130.4
  const maxLon = -130.1
  const minLat = 56.2
  const maxLat = 56.35
  
  // SVG viewbox dimensions
  const svgWidth = 800
  const svgHeight = 600
  
  const x = ((lon - minLon) / (maxLon - minLon)) * svgWidth
  const y = ((maxLat - lat) / (maxLat - minLat)) * svgHeight
  
  return { x, y }
}

// Generate claim boundary polygon points
const generateClaimBoundary = (center: { x: number, y: number }, size: number) => {
  const points: string[] = []
  const numPoints = 6
  const angleStep = (Math.PI * 2) / numPoints
  
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep + Math.PI / 6 // Rotate to make it look more natural
    const radius = size * (0.8 + Math.random() * 0.4) // Add some variation
    const x = center.x + Math.cos(angle) * radius
    const y = center.y + Math.sin(angle) * radius
    points.push(`${x},${y}`)
  }
  
  return points.join(' ')
}

export default function LandingClaimBoundariesV2() {
  const [stage, setStage] = useState(0)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),  // Show grid
      setTimeout(() => setStage(2), 1000), // Show boundaries
      setTimeout(() => setStage(3), 2500), // Show labels
      setTimeout(() => setStage(4), 3500), // Show connection lines
      setTimeout(() => setStage(5), 4500), // Show total area
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [])
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-950/20 to-black" />
      
      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Strategic Claim Position
        </h2>
        <p className="text-lg text-yellow-400">
          20,481 hectares in the heart of the Golden Triangle
        </p>
      </motion.div>
      
      {/* Map SVG */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-5xl"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.3))' }}
        >
          {/* Grid lines */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                {/* Vertical lines */}
                {[...Array(9)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 100}
                    y1="0"
                    x2={i * 100}
                    y2="600"
                    stroke="#FFD700"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Horizontal lines */}
                {[...Array(7)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 100}
                    x2="800"
                    y2={i * 100}
                    stroke="#FFD700"
                    strokeWidth="0.5"
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Property boundaries */}
          <AnimatePresence>
            {stage >= 2 && properties.map((property, index) => {
              const center = latLonToSVG(property.coordinates[0], property.coordinates[1])
              const size = 40 + (index % 3) * 20 // Vary sizes
              const boundaryPoints = generateClaimBoundary(center, size)
              
              return (
                <motion.g key={property.name}>
                  {/* Claim boundary polygon */}
                  <motion.polygon
                    points={boundaryPoints}
                    fill="none"
                    stroke={property.color}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    style={{
                      filter: hoveredProperty === property.name ? 'brightness(1.5)' : 'brightness(1)',
                      fill: hoveredProperty === property.name ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredProperty(property.name)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    onClick={() => setSelectedProperty(property.name)}
                    className="cursor-pointer transition-all duration-300"
                  />
                  
                  {/* Center marker */}
                  <motion.circle
                    cx={center.x}
                    cy={center.y}
                    r="4"
                    fill={property.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  />
                  
                  {/* Pulsing effect on hover */}
                  {hoveredProperty === property.name && (
                    <motion.circle
                      cx={center.x}
                      cy={center.y}
                      r="8"
                      fill="none"
                      stroke={property.color}
                      strokeWidth="1"
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.g>
              )
            })}
          </AnimatePresence>
          
          {/* Connection lines */}
          <AnimatePresence>
            {stage >= 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}>
                {properties.map((property, i) => {
                  if (i === 0) return null
                  const from = latLonToSVG(properties[i - 1].coordinates[0], properties[i - 1].coordinates[1])
                  const to = latLonToSVG(property.coordinates[0], property.coordinates[1])
                  
                  return (
                    <motion.line
                      key={`connection-${i}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#FFD700"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  )
                })}
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Property labels */}
          <AnimatePresence>
            {stage >= 3 && properties.map((property, index) => {
              const center = latLonToSVG(property.coordinates[0], property.coordinates[1])
              
              return (
                <motion.g
                  key={`label-${property.name}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <text
                    x={center.x}
                    y={center.y - 50}
                    textAnchor="middle"
                    className="fill-white text-sm font-bold"
                    style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                  >
                    {property.name}
                  </text>
                  <text
                    x={center.x}
                    y={center.y - 35}
                    textAnchor="middle"
                    className="fill-yellow-400 text-xs"
                    style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                  >
                    {property.area}
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>
      
      {/* Property details panel */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20"
          >
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30 max-w-sm">
              <h3 className="text-yellow-400 font-bold text-xl mb-2">
                {selectedProperty}
              </h3>
              <p className="text-white/80 text-sm mb-3">
                {properties.find(p => p.name === selectedProperty)?.description}
              </p>
              <p className="text-white text-sm">
                Area: <span className="text-yellow-400 font-bold">
                  {properties.find(p => p.name === selectedProperty)?.area}
                </span>
              </p>
              <button
                onClick={() => setSelectedProperty(null)}
                className="mt-4 text-xs text-white/60 hover:text-white transition-colors"
              >
                Click to close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Total area display */}
      <AnimatePresence>
        {stage >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Total Project Area</p>
                  <p className="text-3xl font-bold text-yellow-400">20,481</p>
                  <p className="text-white/80 text-sm">hectares</p>
                </div>
                <div className="h-16 w-px bg-yellow-400/30" />
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Properties</p>
                  <p className="text-3xl font-bold text-yellow-400">6</p>
                  <p className="text-white/80 text-sm">strategic locations</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-8 right-8 z-10"
      >
        <p className="text-white/60 text-sm">
          Hover over properties for details • Click to learn more
        </p>
      </motion.div>
    </div>
  )
}
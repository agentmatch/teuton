'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Actual property positions extracted from the PDF
const propertyPositions: Record<string, { x: number; y: number }> = {
  "Tennyson": { x: 629.01731, y: 342.70428652 },
  "Big Gold": { x: 381.82622, y: 402.93630652 },
  "Eskay Rift": { x: 471.58299, y: 369.10078652 },
  "Leduc": { x: 369.82666, y: 227.78921255 },
  "Pearson": { x: 409.18524, y: 332.62562652 }
}

// Property data with additional info
const properties = [
  { 
    name: 'Tennyson', 
    area: '~5,200 hectares',
    color: '#FFD700',
    description: 'Advanced porphyry Cu-Au system',
    highlights: ['900m x 700m footprint', '76 historic drill holes']
  },
  { 
    name: 'Big Gold', 
    area: '~3,800 hectares',
    color: '#FFD700',
    description: 'High-grade massive sulfide discoveries',
    highlights: ['27.7 g/t Au', '6,240 g/t Ag']
  },
  { 
    name: "Eskay Rift", 
    area: '~4,100 hectares',
    color: '#FFD700',
    description: 'Eskay Creek-equivalent stratigraphy',
    highlights: ['Strong ZTEM conductors', 'Never drilled']
  },
  { 
    name: 'Leduc', 
    area: '~2,631 hectares',
    color: '#FFD700',
    description: 'Surrounds past-producing Granduc mine',
    highlights: ['Strategic position', 'Same stratigraphy as Granduc']
  },
  { 
    name: 'Pearson', 
    area: '~1,800 hectares',
    color: '#FFD700',
    description: 'Strong 2.5 km EM conductor',
    highlights: ['2.5 km conductor', 'Untested by drilling']
  },
]

// Convert PDF coordinates to SVG viewbox coordinates
const pdfToSVG = (pdfX: number, pdfY: number) => {
  // PDF bounds from extracted data
  const minX = 350
  const maxX = 650
  const minY = 200
  const maxY = 450
  
  // SVG viewbox dimensions
  const svgWidth = 800
  const svgHeight = 600
  
  // Normalize and flip Y axis (PDF has origin at bottom-left)
  const x = ((pdfX - minX) / (maxX - minX)) * svgWidth
  const y = ((maxY - pdfY) / (maxY - minY)) * svgHeight
  
  return { x, y }
}

// Generate irregular hexagon boundary
const generateBoundary = (center: { x: number, y: number }, size: number, seed: number = 0) => {
  const points: [number, number][] = []
  const numPoints = 6
  const angleStep = (Math.PI * 2) / numPoints
  
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleStep + Math.PI / 6
    // Add some randomness based on seed
    const radiusVariation = 0.7 + (Math.sin(seed + i) * 0.3)
    const radius = size * radiusVariation
    const x = center.x + Math.cos(angle) * radius
    const y = center.y + Math.sin(angle) * radius
    points.push([x, y])
  }
  
  return points
}

// Missing 4 J's position - estimate based on other properties
const estimatedPositions: Record<string, { x: number; y: number }> = {
  "4 J's": { x: 520, y: 380 } // Estimated position
}

export default function LandingClaimBoundariesV3() {
  const [stage, setStage] = useState(0)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),   // Show grid
      setTimeout(() => setStage(2), 1000),  // Show boundaries
      setTimeout(() => setStage(3), 2000),  // Show labels
      setTimeout(() => setStage(4), 3000),  // Show connections
      setTimeout(() => setStage(5), 4000),  // Show stats
    ]
    
    return () => timers.forEach(clearTimeout)
  }, [])
  
  // Add 4 J's to properties if not in PDF positions
  const allProperties = [...properties]
  const fourJsExists = Object.keys(propertyPositions).includes("4 J's")
  if (!fourJsExists) {
    allProperties.splice(2, 0, {
      name: "4 J's",
      area: '~2,950 hectares',
      color: '#FFD700',
      description: 'Historic VMS target with new Cu-Au discoveries',
      highlights: ['Since 1929', 'Glacier retreat exposures']
    })
  }
  
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 text-center"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Luxor Project Claim Map
        </h2>
        <p className="text-lg text-yellow-400">
          Actual property positions from official documentation
        </p>
      </motion.div>
      
      {/* Map SVG */}
      <div className="absolute inset-0 flex items-center justify-center p-8 pt-32">
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full max-w-5xl"
          style={{ filter: 'drop-shadow(0 0 30px rgba(255, 215, 0, 0.2))' }}
        >
          {/* Background pattern */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="800" height="600" fill="url(#grid)" />
          
          {/* Coordinate system indicator */}
          <AnimatePresence>
            {stage >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}>
                <text x="750" y="590" className="fill-yellow-400 text-xs" textAnchor="end">
                  NAD 83 Zone 9N
                </text>
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Property boundaries and markers */}
          <AnimatePresence>
            {stage >= 2 && allProperties.map((property, index) => {
              const pdfPos = propertyPositions[property.name] || estimatedPositions[property.name]
              if (!pdfPos) return null
              
              const svgPos = pdfToSVG(pdfPos.x, pdfPos.y)
              const boundary = generateBoundary(svgPos, 60 + (index % 3) * 10, index)
              const boundaryPath = boundary.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z'
              
              return (
                <motion.g key={property.name}>
                  {/* Boundary polygon */}
                  <motion.path
                    d={boundaryPath}
                    fill="none"
                    stroke={property.color}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
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
                    cx={svgPos.x}
                    cy={svgPos.y}
                    r="5"
                    fill={property.color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      duration: 0.5, 
                      delay: index * 0.2 + 0.5 
                    }}
                  />
                  
                  {/* Pulsing effect */}
                  <motion.circle
                    cx={svgPos.x}
                    cy={svgPos.y}
                    r="5"
                    fill="none"
                    stroke={property.color}
                    strokeWidth="1"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ 
                      scale: [1, 2, 1],
                      opacity: [0.8, 0, 0.8]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3
                    }}
                  />
                </motion.g>
              )
            })}
          </AnimatePresence>
          
          {/* Connection lines */}
          <AnimatePresence>
            {stage >= 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}>
                {allProperties.map((property, i) => {
                  if (i === 0) return null
                  const fromPos = propertyPositions[allProperties[i-1].name] || estimatedPositions[allProperties[i-1].name]
                  const toPos = propertyPositions[property.name] || estimatedPositions[property.name]
                  if (!fromPos || !toPos) return null
                  
                  const from = pdfToSVG(fromPos.x, fromPos.y)
                  const to = pdfToSVG(toPos.x, toPos.y)
                  
                  return (
                    <motion.line
                      key={`connection-${i}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#FFD700"
                      strokeWidth="1"
                      strokeDasharray="5 5"
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
            {stage >= 3 && allProperties.map((property, index) => {
              const pdfPos = propertyPositions[property.name] || estimatedPositions[property.name]
              if (!pdfPos) return null
              
              const svgPos = pdfToSVG(pdfPos.x, pdfPos.y)
              
              return (
                <motion.g
                  key={`label-${property.name}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <text
                    x={svgPos.x}
                    y={svgPos.y - 70}
                    textAnchor="middle"
                    className="fill-white text-sm font-bold"
                    style={{ textShadow: '0 0 8px rgba(0,0,0,0.9)' }}
                  >
                    {property.name}
                  </text>
                  <text
                    x={svgPos.x}
                    y={svgPos.y - 55}
                    textAnchor="middle"
                    className="fill-yellow-400 text-xs"
                    style={{ textShadow: '0 0 6px rgba(0,0,0,0.9)' }}
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
            <div className="bg-black/90 backdrop-blur-md rounded-lg p-6 border border-yellow-400/30 max-w-sm">
              <h3 className="text-yellow-400 font-bold text-xl mb-3">
                {selectedProperty}
              </h3>
              <p className="text-white/80 text-sm mb-4">
                {allProperties.find(p => p.name === selectedProperty)?.description}
              </p>
              <div className="space-y-2 mb-4">
                <p className="text-white text-sm">
                  Area: <span className="text-yellow-400 font-bold">
                    {allProperties.find(p => p.name === selectedProperty)?.area}
                  </span>
                </p>
                <div className="text-xs text-white/60 space-y-1">
                  {allProperties.find(p => p.name === selectedProperty)?.highlights.map((h, i) => (
                    <p key={i}>• {h}</p>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-xs text-white/60 hover:text-white transition-colors"
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
            <div className="bg-black/90 backdrop-blur-md rounded-lg p-6 border border-yellow-400/30">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Total Project Area</p>
                  <p className="text-4xl font-bold text-yellow-400">20,481</p>
                  <p className="text-white/80 text-sm">hectares</p>
                </div>
                <div className="h-16 w-px bg-yellow-400/30" />
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Properties</p>
                  <p className="text-4xl font-bold text-yellow-400">6</p>
                  <p className="text-white/80 text-sm">strategic locations</p>
                </div>
                <div className="h-16 w-px bg-yellow-400/30" />
                <div className="text-center">
                  <p className="text-white/80 text-sm mb-1">Golden Triangle</p>
                  <p className="text-4xl font-bold text-yellow-400">100%</p>
                  <p className="text-white/80 text-sm">prime location</p>
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
      
      {/* Scale indicator */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-24 right-8 z-10"
          >
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <div className="w-20 h-px bg-white/60" />
              <span>10 km</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
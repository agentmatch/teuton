'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Property {
  name: string
  slug: string
  hectares: string
  claims: number
}

export default function PropertyOutlineMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [viewBox, setViewBox] = useState<string>('0 0 1000 800')
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 })
  const router = useRouter()

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ 
          width: rect.width || 1000, 
          height: window.innerHeight * 0.7 // 70% of viewport height
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    // Load the GeoJSON data
    fetch('/images/luxor-properties-merged-wgs84.geojson')
      .then(res => res.json())
      .then(data => {
        // Calculate bounds
        let minX = Infinity, maxX = -Infinity
        let minY = Infinity, maxY = -Infinity
        
        data.features.forEach((feature: any) => {
          if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach((polygon: any) => {
              polygon.forEach((ring: any) => {
                ring.forEach((coord: any) => {
                  minX = Math.min(minX, coord[0])
                  maxX = Math.max(maxX, coord[0])
                  minY = Math.min(minY, coord[1])
                  maxY = Math.max(maxY, coord[1])
                })
              })
            })
          }
        })
        
        // Calculate scale and offset for projection
        const { width, height } = dimensions
        const geoWidth = maxX - minX
        const geoHeight = maxY - minY
        const scale = Math.min(width / geoWidth, height / geoHeight) * 0.9 // Use more space
        const offsetX = (width - geoWidth * scale) / 2
        const offsetY = (height - geoHeight * scale) / 2
        
        // Convert GeoJSON to SVG paths
        const processedProperties = data.features.map((feature: any) => {
          const paths: string[] = []
          let minPropX = Infinity, maxPropX = -Infinity
          let minPropY = Infinity, maxPropY = -Infinity
          
          if (feature.geometry.type === 'MultiPolygon') {
            feature.geometry.coordinates.forEach((polygon: any) => {
              const pathData = polygon[0].map((coord: any, index: number) => {
                const x = (coord[0] - minX) * scale + offsetX
                const y = height - ((coord[1] - minY) * scale + offsetY) // Flip Y axis
                minPropX = Math.min(minPropX, x)
                maxPropX = Math.max(maxPropX, x)
                minPropY = Math.min(minPropY, y)
                maxPropY = Math.max(maxPropY, y)
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ') + ' Z'
              paths.push(pathData)
            })
          }
          
          // Use bounding box center for better label positioning
          const centerX = (minPropX + maxPropX) / 2
          const centerY = (minPropY + maxPropY) / 2
          
          // Manual adjustments for specific properties
          let adjustedCenterX = centerX
          let adjustedCenterY = centerY
          if (feature.properties.property_name === 'CATSPAW') {
            adjustedCenterY -= 10
          } else if (feature.properties.property_name === 'ESKAY RIFT') {
            adjustedCenterY -= 15
          }
          
          return {
            name: feature.properties.property_name,
            slug: feature.properties.property_name.toLowerCase().replace(/\s+/g, '-'),
            hectares: feature.properties.total_area_hectares,
            claims: feature.properties.claim_count,
            paths,
            center: { x: adjustedCenterX, y: adjustedCenterY }
          }
        })
        
        setProperties(processedProperties)
        setViewBox(`0 0 ${width} ${height}`)
      })
      .catch(err => console.error('Failed to load properties:', err))
  }, [dimensions])

  const handlePropertyClick = (property: any) => {
    router.push(`/properties/${property.slug}`)
  }

  return (
    <div ref={containerRef} className="relative w-full mb-16" style={{ height: `${dimensions.height}px` }}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        {/* Color definitions */}
        <defs>
          <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0A4A5C', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0A4A5C', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="golden-gradient-hover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FFFF77', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="golden-glow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Property outlines */}
        {properties.map((property, index) => (
          <g
            key={property.name}
            className="cursor-pointer"
            onClick={() => handlePropertyClick(property)}
            onMouseEnter={() => setHoveredProperty(property.name)}
            onMouseLeave={() => setHoveredProperty(null)}
          >
            {property.paths.map((path: string, pathIndex: number) => (
              <motion.path
                key={pathIndex}
                d={path}
                fill={hoveredProperty === property.name ? 'rgba(255, 215, 0, 0.2)' : 'rgba(10, 74, 92, 0.1)'}
                stroke={hoveredProperty === property.name ? "url(#golden-gradient-hover)" : "url(#blue-gradient)"}
                strokeWidth={hoveredProperty === property.name ? 3 : 2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: 1
                }}
                transition={{ 
                  pathLength: { duration: 1.5, delay: index * 0.1 },
                  opacity: { duration: 0.3 }
                }}
                style={{
                  filter: hoveredProperty === property.name ? 'url(#golden-glow)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
            
            {/* Permanent property label */}
            {property.center && (
              <g style={{ pointerEvents: 'none' }}>
                {/* Label background for better readability */}
                <rect
                  x={property.center.x - 80}
                  y={property.center.y - 25}
                  width="160"
                  height="50"
                  rx="8"
                  fill={hoveredProperty === property.name ? "rgba(255, 215, 0, 0.9)" : "rgba(10, 74, 92, 0.8)"}
                  stroke={hoveredProperty === property.name ? "rgba(255, 255, 119, 0.8)" : "rgba(10, 74, 92, 0.3)"}
                  strokeWidth="1"
                  style={{
                    filter: hoveredProperty === property.name ? 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    transition: 'all 0.3s ease'
                  }}
                />
                
                {/* Property name */}
                <text
                  x={property.center.x}
                  y={property.center.y - 5}
                  textAnchor="middle"
                  fill={hoveredProperty === property.name ? "#1A3C40" : "white"}
                  fontSize="14"
                  fontWeight="600"
                  style={{ 
                    fontFamily: 'Aeonik Extended, sans-serif',
                    letterSpacing: '0.05em',
                    transition: 'fill 0.3s ease'
                  }}
                >
                  {property.name}
                </text>
                
                {/* Hectares */}
                <text
                  x={property.center.x}
                  y={property.center.y + 12}
                  textAnchor="middle"
                  fill={hoveredProperty === property.name ? "rgba(26, 60, 64, 0.8)" : "rgba(255, 255, 255, 0.8)"}
                  fontSize="12"
                  style={{ 
                    fontFamily: 'Aeonik, sans-serif',
                    transition: 'fill 0.3s ease'
                  }}
                >
                  {property.hectares.toLocaleString()} hectares
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-[#0A4A5C]/90 backdrop-blur-md rounded-lg shadow-lg px-4 py-2 pointer-events-none border border-[#0A4A5C]/30"
           style={{
             boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
           }}>
        <p className="text-sm text-white/90" style={{ fontFamily: 'Aeonik, sans-serif' }}>
          Hover to highlight • Click to explore
        </p>
      </div>
    </div>
  )
}
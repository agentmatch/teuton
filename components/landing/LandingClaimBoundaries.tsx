'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Text, 
  Line,
  PerspectiveCamera,
  Billboard,
  Html,
} from '@react-three/drei'
import { 
  EffectComposer, 
  Bloom, 
  Vignette,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Property data with coordinates
const properties = [
  { name: 'Tennyson', coordinates: [-130.267, 56.3], color: '#FFD700' },
  { name: 'Big Gold', coordinates: [-130.25, 56.28], color: '#FFD700' },
  { name: "4 J's", coordinates: [-130.2, 56.3], color: '#FFD700' },
  { name: 'Eskay Rift', coordinates: [-130.27, 56.25], color: '#FFD700' },
  { name: 'Leduc', coordinates: [-130.35, 56.27], color: '#FFD700' },
  { name: 'Pearson', coordinates: [-130.23, 56.23], color: '#FFD700' },
]

// Convert lat/lon to 3D coordinates
const latLonToPosition = (lon: number, lat: number): [number, number, number] => {
  // Center around average coordinates
  const centerLon = -130.267
  const centerLat = 56.27
  
  // Scale factor for visualization
  const scale = 100
  
  const x = (lon - centerLon) * scale
  const z = (lat - centerLat) * scale
  
  return [x, 0, z]
}

// Animated claim boundary
const ClaimBoundary: React.FC<{
  properties: typeof properties
  delay?: number
}> = ({ properties, delay = 0 }) => {
  const [progress, setProgress] = useState(0)
  const [showLabels, setShowLabels] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            clearInterval(interval)
            setTimeout(() => setShowLabels(true), 500)
            return 1
          }
          return prev + 0.02
        })
      }, 30)
      
      return () => clearInterval(interval)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [delay])
  
  // Create boundary points (convex hull around properties)
  const boundaryPoints = React.useMemo(() => {
    const points = properties.map(p => latLonToPosition(p.coordinates[0], p.coordinates[1]))
    
    // Simple convex hull - for demo, creating a polygon that encompasses all points
    const sortedPoints = [...points].sort((a, b) => {
      const angleA = Math.atan2(a[2], a[0])
      const angleB = Math.atan2(b[2], b[0])
      return angleA - angleB
    })
    
    // Close the loop
    return [...sortedPoints, sortedPoints[0]]
  }, [])
  
  // Interpolate boundary based on progress
  const visiblePoints = React.useMemo(() => {
    const totalPoints = boundaryPoints.length - 1
    const visibleCount = Math.floor(totalPoints * progress) + 1
    return boundaryPoints.slice(0, visibleCount)
  }, [boundaryPoints, progress])
  
  return (
    <group>
      {/* Animated boundary line */}
      {visiblePoints.length > 1 && (
        <Line
          points={visiblePoints}
          color="#FFD700"
          lineWidth={3}
          transparent
          opacity={0.8}
        />
      )}
      
      {/* Property markers */}
      {properties.map((property, index) => {
        const position = latLonToPosition(property.coordinates[0], property.coordinates[1])
        const markerProgress = progress > (index / properties.length) ? 1 : 0
        
        return (
          <group key={property.name} position={position}>
            {/* Marker */}
            <mesh scale={[markerProgress, markerProgress, markerProgress]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshPhysicalMaterial
                color={property.color}
                emissive={property.color}
                emissiveIntensity={0.5}
                metalness={0.3}
                roughness={0.3}
              />
            </mesh>
            
            {/* Glow effect */}
            <mesh scale={[markerProgress * 1.5, markerProgress * 1.5, markerProgress * 1.5]}>
              <sphereGeometry args={[0.7, 16, 16]} />
              <meshBasicMaterial
                color={property.color}
                transparent
                opacity={0.2}
              />
            </mesh>
            
            {/* Label */}
            {showLabels && (
              <Billboard>
                <Text
                  position={[0, 1.5, 0]}
                  fontSize={0.8}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {property.name}
                </Text>
              </Billboard>
            )}
            
            {/* Vertical line */}
            {markerProgress > 0 && (
              <Line
                points={[[0, 0, 0], [0, markerProgress * 10, 0]]}
                color={property.color}
                lineWidth={1}
                transparent
                opacity={0.3}
              />
            )}
          </group>
        )
      })}
      
      {/* Fill area with transparent plane */}
      {progress >= 1 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshBasicMaterial
            color="#FFD700"
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  )
}

// Total project area display
const ProjectStats: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null
  
  return (
    <Html position={[0, 15, 0]} center>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-yellow-400/30 min-w-[300px]"
      >
        <h3 className="text-yellow-400 font-bold text-xl mb-3">Luxor Project</h3>
        <div className="space-y-2 text-white">
          <p className="text-lg">Total Area: <span className="text-yellow-400 font-bold">20,481 hectares</span></p>
          <p className="text-sm text-white/80">6 Strategic Properties</p>
          <p className="text-sm text-white/80">Northwest British Columbia</p>
        </div>
      </motion.div>
    </Html>
  )
}

// Scene component
const Scene: React.FC = () => {
  const [showStats, setShowStats] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 3000)
    return () => clearTimeout(timer)
  }, [])
  
  // Add rotation animation
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 20, 30]} fov={50} />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 4}
        rotateSpeed={0.3}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={1} color="#FFD700" />
      <pointLight position={[0, 10, 0]} intensity={2} color="#FFD700" />
      
      {/* Grid floor */}
      <gridHelper 
        args={[50, 50, '#FFD700', '#FFD700']} 
        position={[0, -0.5, 0]}
        material-opacity={0.1}
        material-transparent
      />
      
      {/* Main content group */}
      <group ref={groupRef}>
        {/* Claim boundaries */}
        <ClaimBoundary properties={properties} delay={500} />
        
        {/* Project stats */}
        <ProjectStats visible={showStats} />
      </group>
      
      {/* Background sphere */}
      <mesh>
        <sphereGeometry args={[100, 32, 32]} />
        <meshBasicMaterial
          color="#000033"
          side={THREE.BackSide}
        />
      </mesh>
    </>
  )
}

// Main component
export default function LandingClaimBoundaries() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black" />
      
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
      
      {/* Canvas */}
      <Canvas className="absolute inset-0">
        <Scene />
        
        {/* Post-processing */}
        <EffectComposer>
          <Bloom 
            intensity={0.5} 
            luminanceThreshold={0.3} 
            luminanceSmoothing={0.9}
          />
          <Vignette offset={0.3} darkness={0.4} />
        </EffectComposer>
      </Canvas>
      
      {/* Info panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute left-8 bottom-8 z-10"
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/30 max-w-sm">
          <h3 className="text-white font-bold mb-2">Claim Boundaries</h3>
          <p className="text-white/80 text-sm">
            Animated visualization showing the Luxor project's strategic claim boundaries 
            encompassing six key properties in Northwest British Columbia.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
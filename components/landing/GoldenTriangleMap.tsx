'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text, Box, Sphere, Line } from '@react-three/drei'
import { useRef, useState, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Property data based on luxormap.pdf
const luxorProperties = [
  { name: 'Tennyson', position: [0, 0.5, 2], color: '#0022d2' },
  { name: "4 J's", position: [-2, 0.8, 1], color: '#0022d2' },
  { name: 'Big Gold', position: [1, 0.6, 0], color: '#0022d2' },
  { name: 'Eskay Rift', position: [0, 0.7, -1], color: '#0022d2' },
  { name: 'Leduc', position: [-3, 0.4, -2], color: '#0022d2' },
  { name: 'Pearson', position: [2, 0.5, -2], color: '#0022d2' },
]

const neighboringMines = [
  { name: 'KSM', position: [0, 1.2, 5], color: '#ffb800', size: 'large' },
  { name: 'Treaty Creek', position: [-1.5, 1, 4], color: '#ffb800', size: 'medium' },
  { name: 'Brucejack', position: [3, 0.8, 3], color: '#00ff00', size: 'medium' },
  { name: 'Eskay Creek', position: [1, 1.1, -4], color: '#ffb800', size: 'medium' },
  { name: 'Scottie', position: [0, 0.3, -3.5], color: '#ff6600', size: 'small' },
]

// Terrain mesh component
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [heightMap, setHeightMap] = useState<Float32Array | null>(null)

  useEffect(() => {
    // Generate height map for terrain
    const size = 100
    const heights = new Float32Array(size * size)
    
    for (let i = 0; i < size * size; i++) {
      const x = (i % size) / size
      const y = Math.floor(i / size) / size
      
      // Create mountain-like terrain
      heights[i] = 
        Math.sin(x * Math.PI * 4) * 0.3 +
        Math.cos(y * Math.PI * 3) * 0.4 +
        Math.sin((x + y) * Math.PI * 2) * 0.2 +
        Math.random() * 0.1
    }
    
    setHeightMap(heights)
  }, [])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.01
    }
  })

  if (!heightMap) return null

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20, 99, 99]} />
      <meshStandardMaterial
        color="#1a1a1a"
        roughness={0.8}
        metalness={0.2}
        wireframe={false}
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

// Property marker component
function PropertyMarker({ property, isLuxor = false }: { property: any, isLuxor?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<any>(null)

  useFrame(({ clock }) => {
    if (meshRef.current && isLuxor) {
      meshRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.1)
    }
    if (textRef.current) {
      textRef.current.lookAt(0, 0, 10)
    }
  })

  const size = property.size === 'large' ? 0.4 : property.size === 'medium' ? 0.3 : 0.2

  return (
    <group position={property.position}>
      {/* Glow effect */}
      <Sphere args={[size * 2, 16, 16]} ref={meshRef}>
        <meshBasicMaterial
          color={property.color}
          transparent
          opacity={hovered ? 0.4 : 0.2}
        />
      </Sphere>
      
      {/* Main marker */}
      <Sphere
        args={[size, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={property.color}
          emissive={property.color}
          emissiveIntensity={isLuxor ? 0.5 : 0.3}
          roughness={0.3}
          metalness={0.7}
        />
      </Sphere>
      
      {/* Vertical beam for Luxor properties */}
      {isLuxor && (
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
          <meshBasicMaterial
            color={property.color}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Label */}
      <Text
        ref={textRef}
        position={[0, size + 0.3, 0]}
        fontSize={0.25}
        color={hovered ? '#ffffff' : property.color}
        anchorX="center"
        anchorY="middle"
        visible={hovered || isLuxor}
      >
        {property.name}
      </Text>
    </group>
  )
}

// Connection lines between properties
function ConnectionLines() {
  const lines = [
    // Connect Luxor properties
    [[0, 0.5, 2], [-2, 0.8, 1]], // Tennyson to 4 J's
    [[0, 0.5, 2], [1, 0.6, 0]], // Tennyson to Big Gold
    [[1, 0.6, 0], [0, 0.7, -1]], // Big Gold to Eskay Rift
    [[-2, 0.8, 1], [-3, 0.4, -2]], // 4 J's to Leduc
    [[0, 0.7, -1], [2, 0.5, -2]], // Eskay Rift to Pearson
  ]

  return (
    <>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={line.flat() as any}
          color="#0022d2"
          lineWidth={1}
          transparent
          opacity={0.3}
          dashed
          dashScale={5}
          dashSize={0.1}
          gapSize={0.1}
        />
      ))}
    </>
  )
}

// Main 3D scene
function Scene() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 8, 12)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#ffb800" />
      
      <Terrain />
      <ConnectionLines />
      
      {/* Luxor Properties */}
      {luxorProperties.map((property) => (
        <PropertyMarker key={property.name} property={property} isLuxor={true} />
      ))}
      
      {/* Neighboring Mines */}
      {neighboringMines.map((property) => (
        <PropertyMarker key={property.name} property={property} isLuxor={false} />
      ))}
      
      {/* Grid helper */}
      <gridHelper args={[20, 20, '#333333', '#222222']} position={[0, -0.49, 0]} />
    </>
  )
}

// Loading component
function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-t-[#0022d2] border-r-transparent border-b-[#ffb800] border-l-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading 3D Map...</p>
      </div>
    </div>
  )
}

export default function GoldenTriangleMap() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingFallback />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative w-full h-[600px] rounded-lg overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)',
        border: '1px solid rgba(255,184,0,0.2)',
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas>
          <Scene />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2.2}
          />
        </Canvas>
      </Suspense>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-4 rounded-lg"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h4 className="text-sm font-semibold mb-2 text-white">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#0022d2' }} />
            <span className="text-xs text-gray-300">Luxor Properties</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffb800' }} />
            <span className="text-xs text-gray-300">Major Discoveries</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: '#00ff00' }} />
            <span className="text-xs text-gray-300">Operating Mines</span>
          </div>
        </div>
      </div>
      
      {/* Info panel */}
      <div className="absolute top-4 right-4 p-4 rounded-lg max-w-xs"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h4 className="text-sm font-semibold mb-2 text-white">Golden Triangle</h4>
        <p className="text-xs text-gray-300">
          Interactive 3D visualization of Luxor Metals' strategic position among world-class deposits.
          Use mouse to rotate and zoom.
        </p>
      </div>
    </motion.div>
  )
}
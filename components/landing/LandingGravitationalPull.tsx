'use client'

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Text, 
  Html,
  Sphere,
  Ring,
  MeshDistortMaterial,
  PerspectiveCamera,
  Billboard,
} from '@react-three/drei'
import { 
  EffectComposer, 
  Bloom, 
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing'
import * as THREE from 'three'
import { motion } from 'framer-motion'

// Types
interface DepositData {
  name: string
  position: [number, number, number]
  size: number
  color: string
  metalType: 'gold' | 'silver' | 'copper' | 'mixed'
  description: string
  metrics?: {
    grade?: string
    resources?: string
    distance?: string
  }
  actualDistance: number // in km
}

// Convert km to scene units (1 km = 0.5 units for better visualization)
const kmToUnits = (km: number) => km * 0.5

// Calculate position on ring based on angle and distance
const getPositionOnRing = (distance: number, angle: number, height: number = 0): [number, number, number] => {
  const radius = kmToUnits(distance)
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  return [x, height, z]
}

// Deposit data with actual distances
const deposits: DepositData[] = [
  {
    name: 'Eskay Creek',
    position: getPositionOnRing(20, Math.PI * 0.4, -1),
    size: 3.5,
    color: '#C0C0C0',
    metalType: 'silver',
    description: 'Historic high-grade VMS deposit',
    metrics: {
      grade: '45 g/t Au, 2,224 g/t Ag',
      resources: 'Past producer',
      distance: '20km from Luxor'
    },
    actualDistance: 20
  },
  {
    name: 'Brucejack',
    position: getPositionOnRing(25, Math.PI * 0.8, 3),
    size: 3,
    color: '#FFD700',
    metalType: 'gold',
    description: 'Active high-grade gold mine',
    metrics: {
      grade: '8.7 g/t Au',
      resources: 'Active mine',
      distance: '25km from Luxor'
    },
    actualDistance: 25
  },
  {
    name: 'Treaty Creek',
    position: getPositionOnRing(30, Math.PI * 1.2, 1),
    size: 1.8,
    color: '#FFD700',
    metalType: 'gold',
    description: 'Growing exploration project',
    metrics: {
      distance: '30km from Luxor'
    },
    actualDistance: 30
  },
  {
    name: 'KSM',
    position: getPositionOnRing(35, Math.PI * 1.6, 2),
    size: 6,
    color: '#FFD700',
    metalType: 'mixed',
    description: 'Massive copper-gold porphyry system',
    metrics: {
      grade: '0.55 g/t Au, 0.21% Cu',
      resources: '38.8M oz Au, 10.2B lbs Cu',
      distance: '35km from Luxor'
    },
    actualDistance: 35
  },
  {
    name: 'Granduc',
    position: getPositionOnRing(40, Math.PI * 1.9, -2),
    size: 2.5,
    color: '#B87333',
    metalType: 'copper',
    description: 'Historic copper producer',
    metrics: {
      grade: '1.73% Cu',
      resources: 'Past producer',
      distance: '40km from Luxor'
    },
    actualDistance: 40
  }
]

// Simple particle system
const SimpleParticles: React.FC<{ 
  position: [number, number, number]
  color: string
}> = ({ position, color }) => {
  const particles = useRef<THREE.Points>(null)
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(20 * 3)
    for (let i = 0; i < 20; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    return positions
  }, [])

  useFrame((state) => {
    if (!particles.current) return
    particles.current.rotation.y = state.clock.getElapsedTime() * 0.05
  })

  return (
    <points ref={particles} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
          count={20}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Deposit component with hover effects
const Deposit: React.FC<{ 
  data: DepositData
  onHover: (name: string | null) => void
  isHovered: boolean
}> = ({ data, onHover, isHovered }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return
    const time = state.clock.getElapsedTime()
    
    // Gentle rotation
    meshRef.current.rotation.y = time * 0.1
    
    // Hover effect - lift and scale
    const targetY = isHovered ? 2 : 0
    const targetScale = isHovered ? 1.2 : 1
    
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
  })

  return (
    <group ref={groupRef} position={data.position}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover(data.name)
          }}
          onPointerOut={() => {
            onHover(null)
          }}
        >
          <sphereGeometry args={[data.size, 32, 32]} />
          <MeshDistortMaterial
            color={data.color}
            emissive={data.color}
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
            distort={0.05}
            speed={2}
          />
        </mesh>
        
        {/* Simple particles */}
        <SimpleParticles position={[0, 0, 0]} color={data.color} />
        
        {/* Text labels with billboard effect (always face camera) */}
        <Billboard>
          <Text
            position={[0, data.size + 2, 0]}
            fontSize={1.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            {data.name}
          </Text>
          
          {/* Distance label */}
          <Text
            position={[0, data.size + 1, 0]}
            fontSize={0.6}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
          >
            {data.metrics?.distance}
          </Text>
        </Billboard>
        
        {/* Info panel on hover */}
        {isHovered && (
          <Html position={[0, data.size + 3.5, 0]} center>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/90 text-white p-4 rounded-lg backdrop-blur-sm min-w-[250px] border border-yellow-400/30"
            >
              <h4 className="font-bold text-yellow-400 mb-2 text-lg">{data.name}</h4>
              <p className="text-sm mb-2">{data.description}</p>
              {data.metrics && (
                <div className="text-xs space-y-1">
                  {data.metrics.grade && <p>Grade: {data.metrics.grade}</p>}
                  {data.metrics.resources && <p>Resources: {data.metrics.resources}</p>}
                  {data.metrics.distance && <p className="font-bold text-yellow-400">{data.metrics.distance}</p>}
                </div>
              )}
            </motion.div>
          </Html>
        )}
      </Float>
    </group>
  )
}

// Luxor center deposit
const LuxorDeposit: React.FC<{ onHover: (name: string | null) => void }> = ({ onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.getElapsedTime()
    meshRef.current.rotation.y = time * 0.2
  })

  return (
    <group position={[0, 0, 0]}>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => {
            setHovered(true)
            onHover('Luxor')
          }}
          onPointerOut={() => {
            setHovered(false)
            onHover(null)
          }}
        >
          <octahedronGeometry args={[2, 0]} />
          <meshPhysicalMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.8}
            metalness={0.3}
            roughness={0}
            transmission={0.6}
            thickness={0.5}
          />
        </mesh>
        
        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.2} />
        </mesh>
        
        {/* Text label with billboard effect */}
        <Billboard>
          <Text
            position={[0, 4, 0]}
            fontSize={1.5}
            color="#FFD700"
            anchorX="center"
            anchorY="middle"
            font={undefined}
          >
            LUXOR
          </Text>
        </Billboard>
        
        
        {hovered && (
          <Html position={[0, 5, 0]} center>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-500/10 backdrop-blur-md text-white p-4 rounded-lg border border-yellow-400/50 min-w-[300px]"
            >
              <h4 className="font-bold text-yellow-400 mb-2 text-xl">Luxor Metals Project</h4>
              <p className="text-sm mb-2">Strategic exploration in the Golden Triangle</p>
              <div className="text-xs space-y-1">
                <p>Location: Heart of proven deposits</p>
                <p>Potential: Multi-metal targets</p>
                <p>Status: Active exploration</p>
              </div>
            </motion.div>
          </Html>
        )}
      </Float>
    </group>
  )
}

// Distance rings with labels
const DistanceRings: React.FC = () => {
  const distances = [15, 20, 25, 30, 35, 40] // km
  
  return (
    <>
      {distances.map((distance, index) => {
        const radius = kmToUnits(distance)
        const opacity = 0.3 - (index * 0.04)
        
        return (
          <group key={distance}>
            <Ring 
              args={[radius - 0.1, radius + 0.1, 64]} 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, -0.1, 0]}
            >
              <meshBasicMaterial color="#FFD700" transparent opacity={opacity} />
            </Ring>
            
            {/* Distance label on ring */}
            <Billboard>
              <Text
                position={[radius, 0.5, 0]}
                fontSize={0.8}
                color="#FFD700"
                anchorX="center"
                anchorY="middle"
              >
                {distance}km
                <meshBasicMaterial transparent opacity={0.8} />
              </Text>
            </Billboard>
          </group>
        )
      })}
    </>
  )
}

// Scene component
const Scene: React.FC = () => {
  const [hoveredDeposit, setHoveredDeposit] = useState<string | null>(null)
  
  return (
    <>
      {/* Fixed camera */}
      <PerspectiveCamera makeDefault position={[0, 25, 40]} fov={60} />
      
      {/* Limited orbit controls */}
      <OrbitControls 
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 4}
        rotateSpeed={0.5}
      />
      
      {/* Enhanced lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#FFD700" />
      <pointLight position={[0, 0, 0]} intensity={3} color="#FFD700" />
      
      {/* Additional rim lights */}
      <pointLight position={[20, 0, 0]} intensity={0.5} color="#4B79D8" />
      <pointLight position={[-20, 0, 0]} intensity={0.5} color="#FFD700" />
      
      {/* Environment */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />
      
      {/* Distance rings */}
      <DistanceRings />
      
      {/* Connection lines from deposits to Luxor */}
      {deposits.map((deposit) => (
        <line key={`line-${deposit.name}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([
                0, 0, 0,
                ...deposit.position
              ]), 3]}
              count={2}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#FFD700" 
            transparent 
            opacity={hoveredDeposit === deposit.name ? 0.3 : 0.1} 
          />
        </line>
      ))}
      
      {/* Deposits */}
      {deposits.map((deposit) => (
        <Deposit
          key={deposit.name}
          data={deposit}
          onHover={setHoveredDeposit}
          isHovered={hoveredDeposit === deposit.name}
        />
      ))}
      
      {/* Luxor at center */}
      <LuxorDeposit onHover={setHoveredDeposit} />
      
      {/* Gravitational field effect */}
      <mesh>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial
          color="#FFD700"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </>
  )
}

// Main component
export default function LandingGravitationalPull() {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/20 to-black" />
      
      
      {/* Canvas - larger and properly centered */}
      <Canvas className="absolute inset-0" style={{ transform: 'scale(1.1) translateY(-8%) translateX(-52%)', left: '52%' }}>
        <Scene />
        
        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom 
            intensity={0.8} 
            luminanceThreshold={0.2} 
            luminanceSmoothing={0.9}
            radius={0.8}
          />
          <ChromaticAberration 
            offset={[0.0005, 0.0005]} 
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette offset={0.3} darkness={0.5} />
        </EffectComposer>
      </Canvas>
      
      {/* Controls hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 border border-yellow-400/30">
          <p className="text-yellow-400 text-sm">
            Hover over deposits for details • Drag to rotate view
          </p>
        </div>
      </motion.div>
      
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-8 bottom-8 z-10 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/10"
      >
        <h3 className="text-white font-bold mb-2">Distance from Luxor</h3>
        <div className="space-y-1 text-xs">
          <p className="text-white/80">Concentric rings show actual distances</p>
          <p className="text-yellow-400">All major deposits within 40km radius</p>
        </div>
      </motion.div>
    </div>
  )
}
'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Text } from '@react-three/drei'
import * as THREE from 'three'

// Minimalist deposit marker
function Deposit({ position, size, name, delay = 0 }: {
  position: [number, number, number]
  size: string
  name: string
  delay?: number
}) {
  const [visible, setVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  
  if (!visible) return null
  
  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
      <group position={position}>
        <Text
          fontSize={1.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.6}
          color="#FFD700"
          anchorX="center"
          anchorY="middle"
        >
          {size}
        </Text>
      </group>
    </Float>
  )
}

// Single data point
function DataPoint({ position, index }: {
  position: [number, number, number]
  index: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + index) * 0.1
      const material = meshRef.current.material
      if (!Array.isArray(material) && 'opacity' in material) {
        material.opacity = 0.3 + Math.sin(time * 3 + index) * 0.2
      }
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color="#FFD700" transparent />
    </mesh>
  )
}

// Main scene
function Scene() {
  const [stage, setStage] = useState(0)
  const centerRef = useRef<THREE.Group>(null)
  
  useEffect(() => {
    const timer = setInterval(() => {
      setStage(s => s < 5 ? s + 1 : s)
    }, 800)
    return () => clearInterval(timer)
  }, [])
  
  useFrame((state) => {
    if (centerRef.current) {
      centerRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  // Create grid of data points
  const dataPoints = []
  for (let x = -2; x <= 2; x += 0.4) {
    for (let z = -2; z <= 2; z += 0.4) {
      const distance = Math.sqrt(x * x + z * z)
      if (distance > 0.3 && distance < 2) {
        dataPoints.push([x, 0, z] as [number, number, number])
      }
    }
  }
  
  return (
    <>
      <ambientLight intensity={1} />
      
      {/* The giants */}
      <Deposit 
        position={[-3, 1, 0]} 
        size="38.8M oz" 
        name="KSM"
        delay={0}
      />
      
      <Deposit 
        position={[3, 1, 0]} 
        size="23.4M oz" 
        name="TREATY CREEK"
        delay={500}
      />
      
      <Deposit 
        position={[0, -2.5, 0]} 
        size="8.7M oz" 
        name="BRUCEJACK"
        delay={1000}
      />
      
      {/* Center - Luxor */}
      <group ref={centerRef}>
        {/* Data points */}
        {stage >= 3 && dataPoints.map((pos, i) => (
          <DataPoint key={i} position={pos} index={i} />
        ))}
        
        {/* Center text */}
        {stage >= 4 && (
          <Float speed={1} rotationIntensity={0} floatIntensity={0.1}>
            <Text
              position={[0, 0, 0]}
              fontSize={1}
              color="#FFD700"
              anchorX="center"
              anchorY="middle"
            >
              LUXOR
            </Text>
          </Float>
        )}
      </group>
      
      {/* Bottom text */}
      {stage >= 5 && (
        <group position={[0, -3.5, 0]}>
          <Text
            fontSize={0.25}
            color="white"
            anchorX="center"
            letterSpacing={0.1}
          >
            40 YEARS OF DATA · SURROUNDED BY GIANTS
          </Text>
        </group>
      )}
    </>
  )
}

export default function ExplorationStoryVisualization() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
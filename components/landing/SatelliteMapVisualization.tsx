'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'

interface Project {
  name: string
  position: { x: number; z: number }
  color: string
}

const MAJOR_PROJECTS: Project[] = [
  { name: 'KSM', position: { x: -2, z: -1 }, color: '#FFD700' },
  { name: 'BRUCEJACK', position: { x: 2, z: -2 }, color: '#00D4FF' },
  { name: 'TREATY CREEK', position: { x: 1, z: 1 }, color: '#F7B500' },
  { name: 'ESKAY CREEK', position: { x: -3, z: 2 }, color: '#00FF88' },
]

export default function SatelliteMapVisualization() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const frameRef = useRef<number | null>(null)
  const [zoomProgress, setZoomProgress] = useState(0)
  const pulsingRingsRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 10, 50)
    sceneRef.current = scene

    // Camera setup - starting from high above
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 20, 20)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create terrain plane with satellite texture effect
    const terrainGeometry = new THREE.PlaneGeometry(30, 30, 100, 100)
    
    // Create height map effect
    const vertices = terrainGeometry.attributes.position.array
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i]
      const y = vertices[i + 1]
      // Simple noise function for terrain
      vertices[i + 2] = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 0.5 + 
                        Math.random() * 0.1
    }
    terrainGeometry.computeVertexNormals()

    const terrainMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      metalness: 0.1,
      roughness: 0.9,
      wireframe: false
    })

    const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
    terrain.rotation.x = -Math.PI / 2
    scene.add(terrain)

    // Grid overlay for map effect
    const gridHelper = new THREE.GridHelper(30, 30, 0x00D4FF, 0x00D4FF)
    gridHelper.material.opacity = 0.1
    gridHelper.material.transparent = true
    scene.add(gridHelper)

    // Add Luxor property boundaries
    const luxorGeometry = new THREE.BufferGeometry()
    const luxorVertices = new Float32Array([
      -0.5, 0.1, -0.5,
      0.5, 0.1, -0.5,
      0.5, 0.1, 0.5,
      -0.5, 0.1, 0.5,
      -0.5, 0.1, -0.5
    ])
    luxorGeometry.setAttribute('position', new THREE.BufferAttribute(luxorVertices, 3))
    
    const luxorMaterial = new THREE.LineBasicMaterial({
      color: 0x00D4FF,
      linewidth: 3,
      transparent: true
    })
    
    const luxorBoundary = new THREE.Line(luxorGeometry, luxorMaterial)
    scene.add(luxorBoundary)

    // Add glowing area for Luxor property
    const luxorAreaGeometry = new THREE.PlaneGeometry(1, 1)
    const luxorAreaMaterial = new THREE.MeshBasicMaterial({
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    })
    const luxorArea = new THREE.Mesh(luxorAreaGeometry, luxorAreaMaterial)
    luxorArea.rotation.x = -Math.PI / 2
    luxorArea.position.y = 0.05
    scene.add(luxorArea)

    // Add major projects with pulsing rings
    MAJOR_PROJECTS.forEach((project, index) => {
      // Project marker
      const markerGeometry = new THREE.ConeGeometry(0.2, 0.5, 8)
      const markerMaterial = new THREE.MeshPhysicalMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.set(project.position.x, 0.25, project.position.z)
      scene.add(marker)

      // Pulsing ring
      const ringGeometry = new THREE.RingGeometry(0.1, 0.5, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: project.color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.rotation.x = -Math.PI / 2
      ring.position.set(project.position.x, 0.01, project.position.z)
      scene.add(ring)
      pulsingRingsRef.current.push(ring)

      // Project label (using sprite)
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 64
      const context = canvas.getContext('2d')!
      context.font = 'Bold 32px Arial'
      context.fillStyle = 'white'
      context.textAlign = 'center'
      context.fillText(project.name, 128, 40)
      
      const texture = new THREE.CanvasTexture(canvas)
      const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      })
      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.set(project.position.x, 1, project.position.z)
      sprite.scale.set(2, 0.5, 1)
      scene.add(sprite)
    })

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation
    let time = 0
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      time += 0.01

      // Animate zoom
      if (zoomProgress < 1) {
        setZoomProgress(prev => Math.min(prev + 0.005, 1))
        
        // Camera zoom animation
        const startY = 20
        const endY = 5
        const startZ = 20
        const endZ = 8
        
        camera.position.y = startY + (endY - startY) * zoomProgress
        camera.position.z = startZ + (endZ - startZ) * zoomProgress
        camera.lookAt(0, 0, 0)
      }

      // Animate pulsing rings
      pulsingRingsRef.current.forEach((ring, index) => {
        const scale = 1 + Math.sin(time * 2 + index * 0.5) * 0.5
        ring.scale.set(scale, scale, 1)
        if ('opacity' in ring.material) {
          (ring.material as any).opacity = 0.5 - (scale - 1) * 0.5
        }
      })

      // Animate Luxor boundary glow
      luxorMaterial.opacity = 0.5 + Math.sin(time * 3) * 0.3
      luxorAreaMaterial.opacity = 0.1 + Math.sin(time * 3) * 0.05

      renderer.render(scene, camera)
    }
    
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      // Dispose all geometries and materials
      terrainGeometry.dispose()
      terrainMaterial.dispose()
      luxorGeometry.dispose()
      luxorMaterial.dispose()
      luxorAreaGeometry.dispose()
      luxorAreaMaterial.dispose()
    }
  }, [])

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      
      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Title */}
        <motion.div 
          className="absolute top-8 left-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-white mb-2">Strategic Location</h2>
          <p className="text-xl text-cyan-400">BC's Golden Triangle</p>
        </motion.div>

        {/* Distance indicators */}
        <motion.div 
          className="absolute bottom-8 right-8 rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.025) 100%)',
            backdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 4px 12px 0 rgba(255, 255, 255, 0.1), inset 0 -4px 12px 0 rgba(0, 0, 0, 0.1)'
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: zoomProgress > 0.5 ? 1 : 0, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-white font-bold mb-4 text-xl" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>World-Class Neighbours</h3>
          <div className="space-y-3">
            <motion.div 
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#FFD700', boxShadow: `0 0 10px #FFD700` }}
                />
                <span className="text-white font-medium text-base" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>KSM (Mitchell)</span>
              </div>
              <span className="text-gray-400 text-sm" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>~30 km north</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#00FF88', boxShadow: `0 0 10px #00FF88` }}
                />
                <span className="text-white font-medium text-base" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>Brucejack</span>
              </div>
              <span className="text-gray-400 text-sm" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>~28 km north</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#F7B500', boxShadow: `0 0 10px #F7B500` }}
                />
                <span className="text-white font-medium text-base" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>Treaty Creek</span>
              </div>
              <span className="text-gray-400 text-sm" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>~35 km north</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#00FF88', boxShadow: `0 0 10px #00FF88` }}
                />
                <span className="text-white font-medium text-base" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>Eskay Creek</span>
              </div>
              <span className="text-gray-400 text-sm" style={{ fontFamily: "'Switzer', 'Proxima Nova', system-ui, sans-serif" }}>~40 km northwest</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Zoom indicator */}
        <motion.div 
          className="absolute top-8 right-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-cyan-400 font-mono text-sm">
            ZOOM: {Math.round(zoomProgress * 100)}%
          </div>
        </motion.div>

        {/* Luxor label */}
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: zoomProgress > 0.8 ? 1 : 0,
            scale: zoomProgress > 0.8 ? 1 : 0
          }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="text-center">
            <h3 className="text-3xl font-bold text-cyan-400 mb-2"
                style={{ textShadow: '0 0 20px rgba(0,212,255,0.5)' }}>
              LUXOR PROPERTIES
            </h3>
            <p className="text-white text-lg">20,481 Hectares</p>
          </div>
        </motion.div>
      </div>
    </>
  )
}
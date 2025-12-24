'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import LandingProperties from './LandingProperties'

export default function PyramidInterior() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup - inside the pyramid looking out
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 0) // Center of pyramid
    camera.lookAt(0, 0, -5) // Looking forward

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create inverted pyramid geometry (we're inside looking out)
    const pyramidGeometry = new THREE.ConeGeometry(8, 10, 4)
    
    // Golden glass material for interior walls
    const pyramidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFD700,
      metalness: 0.3,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.4,
      side: THREE.BackSide, // Render inside faces
      envMapIntensity: 2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.1,
    })

    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
    pyramid.position.y = 2 // Adjust so camera is at comfortable height
    pyramid.rotation.y = Math.PI / 4 // 45 degrees
    scene.add(pyramid)

    // Add golden edges
    const edges = new THREE.EdgesGeometry(pyramidGeometry)
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xFFD700, 
      transparent: true,
      opacity: 0.6,
      linewidth: 2
    })
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
    pyramid.add(edgeLines)

    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0xFFD700, 0.3)
    scene.add(ambientLight)

    // Golden point lights at corners
    const lightPositions = [
      [3, 3, 3],
      [-3, 3, 3],
      [3, 3, -3],
      [-3, 3, -3]
    ]
    
    lightPositions.forEach(pos => {
      const light = new THREE.PointLight(0xFFD700, 0.5, 10)
      light.position.set(pos[0], pos[1], pos[2])
      scene.add(light)
    })

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Mouse tracking for subtle camera movement
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      
      // Rotate pyramid slowly
      pyramid.rotation.y += 0.001
      
      // Subtle camera movement based on mouse
      camera.rotation.y = mouse.x * 0.1
      camera.rotation.x = mouse.y * 0.1
      
      renderer.render(scene, camera)
    }
    
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      pyramidGeometry.dispose()
      pyramidMaterial.dispose()
    }
  }, [])

  return (
    <>
      {/* 3D Pyramid Interior */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      
      {/* Golden overlay effect */}
      <div className="absolute inset-0 pointer-events-none"
           style={{
             background: 'radial-gradient(circle at center, transparent 0%, rgba(255,215,0,0.05) 50%, rgba(255,215,0,0.1) 100%)',
           }}
      />
      
      {/* Properties Content with fade-in */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <LandingProperties />
      </motion.div>
    </>
  )
}
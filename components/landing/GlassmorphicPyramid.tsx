'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import MetalRivers from './MetalRivers'

interface GlassmorphicPyramidProps {
  shouldStartRivers?: boolean
}

export default function GlassmorphicPyramid({ shouldStartRivers = false }: GlassmorphicPyramidProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number | null>(null)
  const pyramidRef = useRef<THREE.Mesh | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    camera.position.y = -0.5

    // Renderer setup with transparency
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Lighting - much brighter to eliminate shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9) // Very bright ambient
    scene.add(ambientLight)

    // Soft directional lights from multiple angles
    const directionalLight1 = new THREE.DirectionalLight(0xffd700, 0.4)
    directionalLight1.position.set(5, 5, 5)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xffd700, 0.4)
    directionalLight2.position.set(-5, 5, 5)
    scene.add(directionalLight2)
    
    const directionalLight3 = new THREE.DirectionalLight(0xffd700, 0.4)
    directionalLight3.position.set(5, 5, -5)
    scene.add(directionalLight3)
    
    const directionalLight4 = new THREE.DirectionalLight(0xffd700, 0.4)
    directionalLight4.position.set(-5, 5, -5)
    scene.add(directionalLight4)
    
    // Fill light from below
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(0, -5, 0)
    scene.add(fillLight)

    const pointLight = new THREE.PointLight(0xffd700, 0.5, 100)
    pointLight.position.set(0, 0, 0)
    scene.add(pointLight)

    // Create pyramid geometry with Egyptian proportions
    // Egyptian pyramids have base:height ratio of ~1.57:1
    const pyramidGeometry = new THREE.ConeGeometry(2.5, 3.2, 4)
    
    // Create sharp glass material with warm base tint
    const pyramidMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFFAF0, // Start with warm white, not pure white
      metalness: 0.1,
      roughness: 0.0,
      transmission: 0.9,
      transparent: true,
      opacity: 0.3,
      reflectivity: 1,
      ior: 2.0, // Crystal-like refraction
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      side: THREE.DoubleSide,
      envMapIntensity: 3,
      thickness: 0.1, // Thin for sharp edges
      specularIntensity: 1,
      specularColor: 0xFFFAF0, // Warm white specular
      sheen: 0.5,
      sheenRoughness: 0.0,
      sheenColor: 0xFFFAF0, // Warm white sheen
    })

    // Create pyramid mesh
    const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial)
    pyramid.rotation.y = Math.PI / 4 // Start at 45 degrees for square base visibility
    pyramid.position.y = 0 // Center vertically
    pyramidRef.current = pyramid
    scene.add(pyramid)

    // Add edge geometry for sharp definition
    const edges = new THREE.EdgesGeometry(pyramidGeometry)
    const edgeMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffffff, 
      transparent: true,
      opacity: 0.8, // Strong edges for sharp glass
      linewidth: 2
    })
    const edgeLines = new THREE.LineSegments(edges, edgeMaterial)
    pyramid.add(edgeLines)

    // Add glowing core
    const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32)
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.8
    })
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.position.y = -0.5
    pyramid.add(core)

    
    // Animation variables
    let time = 0
    const mouse = { x: 0, y: 0 }
    const targetRotation = { x: 0, y: 0 }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      
      time += 0.01

      // Track when rivers start
      if (shouldStartRivers && !startTimeRef.current) {
        startTimeRef.current = Date.now()
      }

      // Rotate pyramid
      if (pyramid) {
        pyramid.rotation.y += 0.005
        
        // Subtle mouse influence on rotation only
        targetRotation.x = mouse.y * 0.05  // Reduced from 0.2
        targetRotation.y = mouse.x * 0.05  // Reduced from 0.2
        
        pyramid.rotation.x += (targetRotation.x - pyramid.rotation.x) * 0.05
        // Keep pyramid centered - no position changes
        pyramid.position.x = 0
        pyramid.position.y = 0
      }

      // Calculate river arrival based on actual start time
      let riverArrival = 0
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000
        // Rivers take 8 seconds to flow, start transition at 9.5s, complete at 12.5s
        riverArrival = Math.min(1.0, Math.max(0, (elapsed - 9.5) / 3.0))
        
        // Smooth easing for fade-in
        if (riverArrival > 0 && riverArrival < 1) {
          // Apply smooth step easing
          riverArrival = riverArrival * riverArrival * (3.0 - 2.0 * riverArrival)
        }
      }
      
      const convergenceGlow = riverArrival // Simple linear progression, no pulsing

      // Core remains stable, no pulsing
      if (core) {
        core.scale.setScalar(1.1 + riverArrival * 0.2) // Slight growth, no pulsing
        
        // Subtle core enhancement with convergence
        if (riverArrival > 0) {
          coreMaterial.opacity = 0.8
        }
      }
      
      // Always apply transformation, even when riverArrival is 0
      // This prevents the flash when the transition starts
      const logoGoldColor = new THREE.Color(0xFFD700) // Logo gold
      const originalColor = new THREE.Color(0xFFFAF0) // Warm white base
      pyramidMaterial.color.lerpColors(originalColor, logoGoldColor, riverArrival * 0.7) // 70% transition for noticeable gold
      
      // All properties transition smoothly from their base values
      // Base values are already set in the material creation
      pyramidMaterial.metalness = 0.1 + riverArrival * 0.15 // Reduced metalness for softer shadows
      pyramidMaterial.transmission = 0.9 - riverArrival * 0.2 // More opaque when golden
      pyramidMaterial.opacity = 0.3 + riverArrival * 0.4 // Higher opacity to reduce transparency shadows
      pyramidMaterial.ior = 2.0 + riverArrival * 0.2 // Less refraction
      pyramidMaterial.thickness = 0.1 + riverArrival * 0.2 // Less thickness variation
      pyramidMaterial.envMapIntensity = 3 + riverArrival * 1 // Softer reflections
      
      // Sheen transitions from base value
      pyramidMaterial.sheen = 0.5 - riverArrival * 0.2 // Reduce base sheen slightly
      if (riverArrival > 0) {
        pyramidMaterial.sheen += riverArrival * 0.2 // Then add golden sheen
        pyramidMaterial.sheenColor.lerpColors(new THREE.Color(0xFFFAF0), new THREE.Color(0xFFD700), riverArrival)
      }
      
      // Emissive starts from zero and fades in - increased for self-illumination
      pyramidMaterial.emissive = new THREE.Color(0xFFD700)
      pyramidMaterial.emissiveIntensity = riverArrival * 0.5 // Increased glow to reduce shadows
      
      // Clearcoat also starts from base and transitions
      pyramidMaterial.clearcoat = 1.0 - riverArrival * 0.7 // Reduce clearcoat more when golden
      pyramidMaterial.clearcoat += riverArrival * 0.3 // Less clearcoat overall
      
      // Update edge material to glow golden
      edgeMaterial.color.setHSL(0.12, 1, 0.5 + convergenceGlow * 0.5)
      edgeMaterial.opacity = 0.8 + convergenceGlow * 0.2
      
      // Add strong golden glow to edges when pyramid fills
      if (riverArrival > 0.8) {
        const goldIntensity = (riverArrival - 0.8) * 5.0 // 0 to 1 mapped to strong glow
        edgeMaterial.color.setHSL(0.12, 1, 0.7 + goldIntensity * 0.3)
        edgeMaterial.opacity = Math.min(1.0, 0.8 + goldIntensity * 0.4)
      }
      
      // Update point light to pulse more dramatically
      pointLight.intensity = 1 + convergenceGlow * 4
      pointLight.color.setHSL(0.12, 1, 0.5 + convergenceGlow * 0.5)
      
      // Dynamically adjust ambient light when golden to reduce shadows
      if (riverArrival > 0) {
        ambientLight.intensity = 0.9 + riverArrival * 0.1 // Increase to almost 1.0 when fully golden
        ambientLight.color.setHSL(0.12, 0.2 * riverArrival, 0.95) // Slight golden tint
      }
      
      // Core glow intensifies with convergence
      if (core) {
        core.scale.setScalar(1 + Math.sin(time * 2) * 0.2 + convergenceGlow * 0.3)
        coreMaterial.opacity = 0.8 + convergenceGlow * 0.2
      }
      
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
      edgeMaterial.dispose()
      coreGeometry.dispose()
      coreMaterial.dispose()
    }
  }, [shouldStartRivers])

  return (
    <>
      {/* Metal rivers layer */}
      <MetalRivers shouldStart={shouldStartRivers} />
      
      {/* Pyramid layer */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 w-full h-full"
        style={{ 
          filter: 'contrast(1.2) brightness(1.1)'
        }}
      />
      
      {/* Subtle glow from convergence point */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 70%, rgba(255, 215, 0, 0.1) 0%, transparent 40%)',
          filter: 'blur(40px)',
        }}
      />
    </>
  )
}
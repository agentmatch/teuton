'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function GoldenTriangleParticles() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create golden triangle particles
    const particleCount = 1500
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    // Golden triangle vertices (equilateral triangle)
    const triangleHeight = 3
    const triangleWidth = triangleHeight * 2 / Math.sqrt(3)
    
    const vertices = [
      new THREE.Vector3(0, triangleHeight / 2, 0), // Top
      new THREE.Vector3(-triangleWidth / 2, -triangleHeight / 2, 0), // Bottom left
      new THREE.Vector3(triangleWidth / 2, -triangleHeight / 2, 0), // Bottom right
    ]

    // Function to get random point on triangle edge
    const getRandomPointOnTriangle = () => {
      const edge = Math.floor(Math.random() * 3)
      const t = Math.random()
      
      let point: THREE.Vector3
      if (edge === 0) {
        // Top to bottom left
        point = vertices[0].clone().lerp(vertices[1], t)
      } else if (edge === 1) {
        // Bottom left to bottom right
        point = vertices[1].clone().lerp(vertices[2], t)
      } else {
        // Bottom right to top
        point = vertices[2].clone().lerp(vertices[0], t)
      }
      
      // Add some variance
      const variance = 0.3
      point.x += (Math.random() - 0.5) * variance
      point.y += (Math.random() - 0.5) * variance
      point.z += (Math.random() - 0.5) * variance * 2
      
      return point
    }

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      const point = getRandomPointOnTriangle()
      positions[i3] = point.x
      positions[i3 + 1] = point.y
      positions[i3 + 2] = point.z

      // Golden colors
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        // Electric gold
        colors[i3] = 1.0
        colors[i3 + 1] = 0.843
        colors[i3 + 2] = 0.0
      } else if (colorChoice < 0.66) {
        // Liquid gold
        colors[i3] = 1.0
        colors[i3 + 1] = 0.647
        colors[i3 + 2] = 0.0
      } else {
        // Copper glow
        colors[i3] = 0.722
        colors[i3 + 1] = 0.451
        colors[i3 + 2] = 0.2
      }

      sizes[i] = Math.random() * 3 + 1
    }

    // Create geometry and material
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // Shader material for glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        uniform float pixelRatio;
        
        void main() {
          vColor = color;
          vSize = size;
          
          vec3 pos = position;
          
          // Floating animation
          pos.y += sin(time * 0.5 + position.x * 2.0) * 0.1;
          pos.x += cos(time * 0.3 + position.y * 2.0) * 0.05;
          
          // Depth pulsing
          pos.z += sin(time * 0.7 + position.x + position.y) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Size attenuation
          gl_PointSize = size * pixelRatio * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        
        void main() {
          // Create glowing circle
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          // Soft glow falloff
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha *= 0.8; // Overall transparency
          
          // Add shimmer
          alpha *= 0.8 + 0.2 * sin(dist * 10.0);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // Add rim light triangles
    const createRimTriangle = (scale: number, opacity: number) => {
      const rimGeometry = new THREE.BufferGeometry()
      const rimPositions = new Float32Array([
        vertices[0].x * scale, vertices[0].y * scale, vertices[0].z,
        vertices[1].x * scale, vertices[1].y * scale, vertices[1].z,
        vertices[2].x * scale, vertices[2].y * scale, vertices[2].z,
      ])
      rimGeometry.setAttribute('position', new THREE.BufferAttribute(rimPositions, 3))
      
      const rimMaterial = new THREE.LineBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: opacity,
        linewidth: 2,
        blending: THREE.AdditiveBlending
      })
      
      const rimLine = new THREE.LineLoop(rimGeometry, rimMaterial)
      return rimLine
    }

    // Add multiple rim triangles for glow effect
    const rim1 = createRimTriangle(1.0, 0.6)
    const rim2 = createRimTriangle(1.05, 0.3)
    const rim3 = createRimTriangle(1.1, 0.15)
    
    scene.add(rim1)
    scene.add(rim2)
    scene.add(rim3)

    // Animation variables
    let time = 0

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
      material.uniforms.time.value = time
      
      // Rotate the entire system slowly
      particleSystem.rotation.z += 0.001
      rim1.rotation.z += 0.001
      rim2.rotation.z += 0.001
      rim3.rotation.z += 0.001
      
      // Subtle camera movement
      camera.position.x = Math.sin(time * 0.2) * 0.3
      camera.position.y = Math.cos(time * 0.15) * 0.2
      camera.lookAt(scene.position)
      
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
      geometry.dispose()
      material.dispose()
    }
  }, [])

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full"
      style={{ 
        opacity: 0.7,
        filter: 'blur(0.5px)'
      }}
    />
  )
}
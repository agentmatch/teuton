'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import * as THREE from 'three'

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)

    // Create dense glowing particle system filling the viewport
    const particleCount = 50000  // Significantly increased density
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const velocities = new Float32Array(particleCount * 3)
    const origins = new Float32Array(particleCount * 3)
    
    // Create particles with higher concentration in center
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      // Use gaussian distribution for more central concentration
      const gaussianRandom = () => {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      }
      
      // Concentrate particles more in the center
      origins[i3] = gaussianRandom() * 25
      origins[i3 + 1] = (Math.random() - 0.5) * 60 - 10
      origins[i3 + 2] = gaussianRandom() * 20 - 10
      
      positions[i3] = origins[i3]
      positions[i3 + 1] = origins[i3 + 1]
      positions[i3 + 2] = origins[i3 + 2]
      
      // Varied floating speeds for depth
      const speed = 0.3 + Math.random() * 0.5
      velocities[i3] = (Math.random() - 0.5) * 0.1
      velocities[i3 + 1] = speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1
      
      // Rich gold color palette
      const goldType = Math.random()
      if (goldType < 0.4) {
        // Pure gold
        colors[i3] = 1.0
        colors[i3 + 1] = 0.843
        colors[i3 + 2] = 0.0
      } else if (goldType < 0.7) {
        // Copper gold
        colors[i3] = 0.8
        colors[i3 + 1] = 0.498
        colors[i3 + 2] = 0.196
      } else if (goldType < 0.9) {
        // White gold (silver)
        colors[i3] = 0.9
        colors[i3 + 1] = 0.9
        colors[i3 + 2] = 0.9
      } else {
        // Rose gold
        colors[i3] = 0.7
        colors[i3 + 1] = 0.4
        colors[i3 + 2] = 0.3
      }
      
      // Smaller sizes for denser field - occasional sparkles
      sizes[i] = Math.random() < 0.05 ? (0.3 + Math.random() * 0.3) : (0.05 + Math.random() * 0.15)
    }
    
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
    particleGeometry.setAttribute('origin', new THREE.BufferAttribute(origins, 3))
    
    // Create shader material for more realistic gold dust
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        attribute vec3 velocity;
        attribute vec3 origin;
        varying vec3 vColor;
        varying float vOpacity;
        uniform float time;
        
        void main() {
          vColor = color;
          
          // Calculate particle lifecycle for continuous flow
          float particlePhase = float(gl_VertexID) * 0.0001;
          float cycleTime = mod(time * 0.3 + particlePhase * 10.0, 5.0);
          
          // Start from origin and float upward
          vec3 pos = origin;
          pos += velocity * cycleTime * 3.0;
          
          // Add gentle swaying motion
          pos.x += sin(cycleTime + origin.x * 0.1) * 2.0;
          pos.z += cos(cycleTime + origin.z * 0.1) * 2.0;
          
          // Wrap particles that go too high
          if (pos.y > 40.0) {
            pos.y = mod(pos.y + 40.0, 80.0) - 40.0;
          }
          
          // Distance-based opacity for depth
          float distanceFromCamera = length(pos - cameraPosition);
          float depthFade = smoothstep(100.0, 20.0, distanceFromCamera);
          
          // Fade in and out smoothly
          vOpacity = smoothstep(0.0, 1.0, cycleTime) * smoothstep(5.0, 3.0, cycleTime) * depthFade;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (500.0 / -mvPosition.z) * (0.8 + sin(time + particlePhase * 10.0) * 0.3);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Create a glowing effect
          float glow = 1.0 - smoothstep(0.0, 0.5, r);
          float core = 1.0 - smoothstep(0.0, 0.2, r);
          
          vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 0.8), core * 0.5);
          float finalOpacity = (glow * 0.6 + core * 0.4) * vOpacity;
          
          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)

    // Add subtle lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    scene.add(particleSystem)

    camera.position.z = 30

    const animate = (time: number) => {
      requestAnimationFrame(animate)
      
      // Update time uniform for shader animation
      particleMaterial.uniforms.time.value = time * 0.001
      
      // Very subtle camera movement for depth
      camera.position.x = Math.sin(time * 0.0001) * 2
      camera.position.y = Math.cos(time * 0.0001) * 1
      camera.lookAt(0, 0, 0)
      
      renderer.render(scene, camera)
    }

    animate(0)

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black z-10" />
      
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-gradient from-primary-400 to-gold-400">
              Luxor Project
            </span>
            <br />
            <span className="text-white">British Columbia's Next Discovery</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Exploring 20,481 hectares in the prolific Golden Triangle, targeting
            VMS, porphyry Cu-Au, and epithermal Au-Ag deposits.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/properties">
              <Button size="lg" className="min-w-[160px] gold-shimmer">
                Explore Properties
              </Button>
            </Link>
            <Link href="/investors">
              <Button size="lg" variant="glass" className="min-w-[160px]">
                Investor Relations
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 text-white/50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
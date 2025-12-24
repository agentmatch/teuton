'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Custom shader for the scanning effect
const scanningVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const scanningFragmentShader = `
  uniform float time;
  uniform float scanProgress;
  uniform vec3 scanColor;
  uniform vec3 baseColor;
  uniform float opacity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    // Create scanning line effect
    float scanLine = smoothstep(scanProgress - 0.02, scanProgress, vPosition.y) 
                   - smoothstep(scanProgress, scanProgress + 0.02, vPosition.y);
    
    // Grid pattern
    float grid = 0.0;
    float gridSize = 10.0;
    if (mod(vPosition.x * gridSize, 1.0) < 0.05 || mod(vPosition.z * gridSize, 1.0) < 0.05) {
      grid = 0.3;
    }
    
    // Data points
    float dataPoint = 0.0;
    float pulse = sin(time * 2.0 + vPosition.y * 5.0) * 0.5 + 0.5;
    if (mod(vPosition.x * 5.0 + time * 0.5, 1.0) < 0.1 && mod(vPosition.z * 5.0, 1.0) < 0.1) {
      dataPoint = pulse;
    }
    
    // Combine effects
    vec3 color = baseColor;
    color = mix(color, scanColor, scanLine);
    color += vec3(grid * 0.2);
    color += vec3(dataPoint * 0.5, dataPoint * 0.3, 0.0);
    
    // Fade based on height for holographic effect
    float heightFade = 1.0 - smoothstep(0.0, 1.0, vPosition.y);
    
    gl_FragColor = vec4(color, opacity * (0.5 + heightFade * 0.5));
  }
`

interface DataPyramidProps {
  progress: number // 0 to 1, controls the transition from wireframe to solid
  shouldStartRivers?: boolean
}

export default function DataPyramid({ progress, shouldStartRivers }: DataPyramidProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const pyramidRef = useRef<THREE.Group | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 5, 15)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5)
    camera.lookAt(0, 0, 0)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Create pyramid group
    const pyramidGroup = new THREE.Group()
    pyramidRef.current = pyramidGroup
    scene.add(pyramidGroup)

    // Pyramid geometry
    const pyramidGeometry = new THREE.ConeGeometry(1.5, 2, 4)
    
    // Wireframe pyramid (exploration phase)
    const wireframeGeometry = new THREE.EdgesGeometry(pyramidGeometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00D4FF,
      transparent: true,
      opacity: 0.8
    })
    const wireframePyramid = new THREE.LineSegments(wireframeGeometry, wireframeMaterial)
    pyramidGroup.add(wireframePyramid)

    // Scanning effect pyramid
    const scanMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scanProgress: { value: 0 },
        scanColor: { value: new THREE.Color(0x00D4FF) },
        baseColor: { value: new THREE.Color(0x0A0E27) },
        opacity: { value: 0.3 }
      },
      vertexShader: scanningVertexShader,
      fragmentShader: scanningFragmentShader,
      transparent: true,
      side: THREE.DoubleSide
    })
    const scanPyramid = new THREE.Mesh(pyramidGeometry, scanMaterial)
    pyramidGroup.add(scanPyramid)


    // Solid gold pyramid (discovery phase)
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xF7B500,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0,
      envMapIntensity: 1,
      reflectivity: 0.8
    })
    const goldPyramid = new THREE.Mesh(pyramidGeometry, goldMaterial)
    pyramidGroup.add(goldPyramid)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00D4FF, 1, 10)
    pointLight1.position.set(3, 3, 3)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xF7B500, 1, 10)
    pointLight2.position.set(-3, 3, -3)
    scene.add(pointLight2)

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
      timeRef.current += 0.01

      // Update scan progress
      if (shouldStartRivers && scanProgress < 1) {
        setScanProgress(prev => Math.min(prev + 0.01, 1))
      }

      // Rotate pyramid
      if (pyramidGroup) {
        pyramidGroup.rotation.y += 0.003
      }

      // Update scan shader
      if (scanMaterial.uniforms) {
        scanMaterial.uniforms.time.value = timeRef.current
        scanMaterial.uniforms.scanProgress.value = (Math.sin(timeRef.current * 0.5) + 1) * 0.5
      }


      // Transition based on progress
      if (progress > 0) {
        // Fade out wireframe
        wireframeMaterial.opacity = 0.8 * (1 - progress)
        
        // Fade in gold
        goldMaterial.opacity = progress * 0.9
        
        // Change scan color to gold
        const scanColor = scanMaterial.uniforms.scanColor.value
        scanColor.r = progress * 0.97
        scanColor.g = progress * 0.71
        scanColor.b = (1 - progress) * 1.0
        
      }

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
      pyramidGeometry.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      scanMaterial.dispose()
      goldMaterial.dispose()
    }
  }, [])

  // Update progress
  useEffect(() => {
    // Progress is handled in the animation loop
  }, [progress])

  return (
    <>
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />
      
    </>
  )
}
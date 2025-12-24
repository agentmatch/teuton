'use client'

import { useEffect, useRef } from 'react'

const vertexShader = `
attribute vec2 a_position;
attribute float a_river; // 0 for left river, 1 for right river
attribute float a_progress; // Progress along river path
attribute float a_offset; // Random offset for particle

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_flowProgress; // 0 to 1, controls how far the rivers have flowed

varying float v_river;
varying float v_brightness;

// Simple noise function for natural variation
float snoise(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Bezier curve calculation
vec2 bezier(vec2 p0, vec2 p1, vec2 p2, vec2 p3, float t) {
  float t2 = t * t;
  float t3 = t2 * t;
  float mt = 1.0 - t;
  float mt2 = mt * mt;
  float mt3 = mt2 * mt;
  return mt3 * p0 + 3.0 * mt2 * t * p1 + 3.0 * mt * t2 * p2 + t3 * p3;
}

void main() {
  // River endpoints - further off-screen
  vec2 leftStart = vec2(-1.5, 0.0);
  vec2 rightStart = vec2(1.5, 0.0);
  vec2 center = vec2(0.0, 0.0);
  
  // Control particle flow and visibility
  float particleVisible = 0.0;
  vec2 position;
  float progress = a_progress; // Base progress for this particle
  
  // Only show and animate particles after flow starts
  if (u_flowProgress > 0.01) {
    // Create soft, flowing edge
    float edgeSoftness = 0.3; // Much wider fade zone
    float waveVariation = sin(a_offset * 10.0 + u_time * 2.0) * 0.1;
    float noiseOffset = snoise(vec2(a_offset * 15.0, u_time * 0.3)) * 0.15;
    
    // Variable edge based on particle position for natural flow
    float adjustedProgress = a_progress + waveVariation + noiseOffset;
    particleVisible = smoothstep(adjustedProgress - edgeSoftness, adjustedProgress, u_flowProgress);
    
    // Add density variation for more natural appearance
    if (abs(adjustedProgress - u_flowProgress) < 0.2) {
      float edgeFade = 1.0 - abs(adjustedProgress - u_flowProgress) / 0.2;
      particleVisible *= mix(0.1, 1.0, 1.0 - edgeFade * edgeFade);
    }
    
    // Continuous flow animation
    if (particleVisible > 0.0) {
      // Add continuous movement
      float flowSpeed = 0.03;
      progress = a_progress + u_time * flowSpeed;
      
      // Keep particles flowing continuously
      if (u_flowProgress >= 1.0) {
        progress = fract(progress);
      } else {
        // During initial flow, prevent particles from getting too far ahead
        float maxAllowedProgress = u_flowProgress + 0.05;
        progress = min(progress, maxAllowedProgress);
      }
    }
  }
  
  // Create a cloud-like distribution instead of following bezier exactly
  if (a_river < 0.5) {
    // Left river - general direction toward center
    float angle = mix(-0.2, -2.5, progress); // Curve from slight down to left-up
    float dist = mix(1.5, 0.0, progress); // Distance from center - reaches center
    
    // Base position
    position = center + vec2(cos(angle), sin(angle)) * dist;
    
    // Smoother, more uniform spread that maintains river shape
    float spread = 0.3 * (1.0 - progress * 0.5); // Less reduction in spread as it approaches center
    float randomAngle = a_offset * 6.28;
    float randomDist = (fract(a_offset * 7.13) - 0.5) * spread;
    
    // Add perpendicular spread to maintain width at convergence
    vec2 direction = normalize(vec2(cos(angle), sin(angle)));
    vec2 perpendicular = vec2(-direction.y, direction.x);
    
    position += perpendicular * randomDist;
    position += direction * randomDist * 0.3; // Some variation along flow direction
    
  } else {
    // Right river - general direction toward center  
    float angle = mix(3.34, 0.64, progress); // Curve from slight down to right-up
    float dist = mix(1.5, 0.0, progress); // Distance from center - reaches center
    
    // Base position
    position = center + vec2(cos(angle), sin(angle)) * dist;
    
    // Smoother spread
    float spread = 0.3 * (1.0 - progress * 0.5);
    float randomAngle = a_offset * 6.28;
    float randomDist = (fract(a_offset * 7.13) - 0.5) * spread;
    
    // Add perpendicular spread
    vec2 direction = normalize(vec2(cos(angle), sin(angle)));
    vec2 perpendicular = vec2(-direction.y, direction.x);
    
    position += perpendicular * randomDist;
    position += direction * randomDist * 0.3;
  }
  
  // Add flowing motion without creating streams
  float time = u_time * 0.3;
  float wave1 = sin(time + a_offset * 8.0) * 0.03;
  float wave2 = cos(time * 0.7 + a_offset * 5.0 + progress * 3.0) * 0.02;
  
  position.x += wave1;
  position.y += wave2;
  
  // Base brightness from progress
  v_brightness = smoothstep(0.0, 0.05, progress) * smoothstep(1.0, 0.95, progress);
  
  // Apply visibility based on flow progress
  v_brightness *= particleVisible;
  
  // Smooth fade during late convergence to prevent overlap artifacts
  if (u_flowProgress > 0.85 && progress > 0.9) {
    float lateFade = smoothstep(0.85, 0.95, u_flowProgress);
    v_brightness *= (1.0 - lateFade * 0.7);
  }
  
  // Convergence effect - gentle swirling at pyramid base
  float distToCenter = distance(position, center);
  
  // When particles reach the center, create swirling effect
  if (distToCenter < 0.4 && u_flowProgress > 0.6) {
    float swirlStrength = smoothstep(0.6, 1.0, u_flowProgress);
    
    // All particles swirl together in a tight vortex
    float vortexAngle = u_time * 3.0 * swirlStrength + a_offset * 3.14;
    vec2 tangent = vec2(-position.y + center.y, position.x - center.x);
    tangent = normalize(tangent);
    position += tangent * 0.03 * swirlStrength;
    
    // Inward pull that allows particles to reach center
    vec2 toCenter = normalize(center - position);
    float pullStrength = smoothstep(0.4, 0.0, distToCenter);
    position += toCenter * pullStrength * 0.015 * swirlStrength;
    
    // Fill the very center with particles
    if (distToCenter < 0.15) {
      // Distribute particles across the center area
      float fillAngle = a_offset * 6.28 + u_time * 1.5;
      float fillRadius = fract(a_offset * 13.7) * 0.1;
      vec2 fillPos = center + vec2(cos(fillAngle), sin(fillAngle)) * fillRadius;
      position = mix(position, fillPos, smoothstep(0.15, 0.0, distToCenter) * 0.5);
    }
    
    // Subtle brightness increase
    v_brightness *= (1.0 + swirlStrength * 0.5);
  }
  
  // Brighten particles near/in pyramid with electric effect
  float centerGlow = 0.0;
  if (distToCenter < 0.4) {
    centerGlow = smoothstep(0.4, 0.0, distToCenter);
    float convergenceIntensity = smoothstep(0.6, 1.0, u_flowProgress);
    v_brightness += centerGlow * 0.5 * (1.0 + convergenceIntensity * 2.0);
  }
  
  v_brightness = clamp(v_brightness, 0.0, 1.0);
  
  // Vary size - smaller particles create more galaxy-like appearance
  float baseSize = 1.5 + sin(progress * 3.14159) * 0.5;
  
  // Gentle size increase at convergence
  float convergencePhase = smoothstep(0.7, 1.0, u_flowProgress);
  if (distToCenter < 0.3 && convergencePhase > 0.0) {
    // Particles near center grow slightly
    float sizeBoost = (1.0 - distToCenter / 0.3) * convergencePhase;
    baseSize += sizeBoost * 1.5;
  }
  
  gl_PointSize = baseSize + centerGlow * 2.0;
  
  // Pass river ID to fragment shader
  v_river = a_river;
  
  // Convert to clip space
  vec2 clipSpace = ((position + 1.0) / 2.0) * 2.0 - 1.0;
  gl_Position = vec4(clipSpace, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

varying float v_river;
varying float v_brightness;

uniform float u_time;
uniform float u_flowProgress;

void main() {
  // Distance from center of point
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);
  
  // Soft circle
  float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
  
  // Color based on river with metallic particles
  vec3 color;
  float metallic = fract(v_river * 100.0); // Use fractional part for particle variation
  
  if (v_river < 0.5) {
    // Sulphurets - gold with copper particles
    if (metallic < 0.20) {
      // Copper particles (20%)
      color = vec3(0.72, 0.45, 0.20); // Distinct copper color
    } else {
      // Gold particles (80%)
      color = vec3(1.0, 0.843, 0.0);
    }
  } else {
    // Eskay - gold with silver particles
    if (metallic < 0.20) {
      // Silver particles (20%)
      color = vec3(0.82, 0.82, 0.82); // Distinct silver color
    } else {
      // Gold particles (80%)
      color = vec3(1.0, 0.718, 0.0);
    }
  }
  
  // Add subtle shimmer
  float shimmer = sin(u_time * 2.0 + v_river * 6.28) * 0.05 + 0.95;
  color *= shimmer;
  
  // Inner glow
  float glow = exp(-dist * 5.0);
  color += vec3(1.0, 0.95, 0.8) * glow * 0.5;
  
  // Color mixing effect when converging
  float convergence = smoothstep(0.7, 1.0, u_flowProgress);
  if (convergence > 0.0) {
    // Create swirling color blend at convergence
    float swirl = sin(u_time * 3.0 + v_river * 10.0) * 0.5 + 0.5;
    
    // Mix colors from both rivers
    vec3 mixedMetals;
    if (swirl > 0.5) {
      // Blend towards copper-gold
      mixedMetals = mix(color, vec3(0.95, 0.75, 0.4), convergence * 0.3);
    } else {
      // Blend towards silver-gold
      mixedMetals = mix(color, vec3(0.95, 0.85, 0.65), convergence * 0.3);
    }
    
    // Subtle brightening at convergence
    color = mix(color, mixedMetals, convergence);
    alpha *= (1.0 + convergence * 0.5);
    
    // Soft glow effect
    float centerGlow = exp(-dist * 4.0) * convergence;
    color += vec3(1.0, 0.95, 0.8) * centerGlow * 0.3;
  }
  
  gl_FragColor = vec4(color, alpha * v_brightness);
}
`

// Additional shader for river trails
const trailVertexShader = `
attribute vec2 a_position;
uniform float u_time;

varying vec2 v_uv;

void main() {
  v_uv = (a_position + 1.0) * 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const trailFragmentShader = `
precision highp float;

varying vec2 v_uv;
uniform float u_time;
uniform sampler2D u_particles; // Particle texture for trails

// Noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Bezier distance function
float distToBezier(vec2 p, vec2 p0, vec2 p1, vec2 p2, vec2 p3) {
  float minDist = 9999.0;
  for (float t = 0.0; t <= 1.0; t += 0.02) {
    float t2 = t * t;
    float t3 = t2 * t;
    float mt = 1.0 - t;
    float mt2 = mt * mt;
    float mt3 = mt2 * mt;
    vec2 point = mt3 * p0 + 3.0 * mt2 * t * p1 + 3.0 * mt * t2 * p2 + t3 * p3;
    float dist = distance(p, point);
    minDist = min(minDist, dist);
  }
  return minDist;
}

void main() {
  vec2 uv = v_uv * 2.0 - 1.0; // Convert to -1 to 1 range
  
  // Define river paths
  vec2 leftStart = vec2(-1.2, 0.0);
  vec2 rightStart = vec2(1.2, 0.0);
  vec2 center = vec2(0.0, 0.0);
  
  // Left river bezier
  vec2 lcp1 = vec2(-0.4, 0.3);
  vec2 lcp2 = vec2(-0.2, -0.2);
  float leftDist = distToBezier(uv, leftStart, lcp1, lcp2, center);
  
  // Right river bezier
  vec2 rcp1 = vec2(0.4, -0.3);
  vec2 rcp2 = vec2(0.2, 0.2);
  float rightDist = distToBezier(uv, rightStart, rcp1, rcp2, center);
  
  // River width with noise
  float noise1 = snoise(uv * 5.0 + vec2(u_time * 0.1, 0.0)) * 0.01;
  float noise2 = snoise(uv * 10.0 - vec2(0.0, u_time * 0.15)) * 0.005;
  float riverWidth = 0.03 + noise1 + noise2;
  
  // Create river masks
  float leftMask = 1.0 - smoothstep(riverWidth * 0.5, riverWidth, leftDist);
  float rightMask = 1.0 - smoothstep(riverWidth * 0.5, riverWidth, rightDist);
  
  // Glow effect
  float leftGlow = exp(-leftDist * 20.0) * 0.5;
  float rightGlow = exp(-rightDist * 20.0) * 0.5;
  
  // Colors
  vec3 leftColor = vec3(1.0, 0.843, 0.0);
  vec3 rightColor = vec3(1.0, 0.718, 0.0);
  
  // Flow animation
  float flow = snoise(uv * 20.0 - vec2(u_time * 0.5, u_time * 0.3));
  
  // Combine
  vec3 color = leftColor * (leftMask + leftGlow) * (1.0 + flow * 0.2);
  color += rightColor * (rightMask + rightGlow) * (1.0 + flow * 0.2);
  
  // Convergence glow
  float centerDist = distance(uv, center);
  float convergence = exp(-centerDist * 5.0) * (sin(u_time * 3.0) * 0.3 + 0.7);
  color += vec3(1.0, 0.9, 0.7) * convergence * 0.5;
  
  float alpha = clamp(leftMask + rightMask + leftGlow + rightGlow + convergence * 0.5, 0.0, 1.0);
  gl_FragColor = vec4(color, alpha * 0.8);
}
`

interface MetalRiversProps {
  shouldStart?: boolean
}

export default function MetalRivers({ shouldStart = false }: MetalRiversProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)
  
  // Store shader programs
  const particleProgramRef = useRef<WebGLProgram | null>(null)
  const trailProgramRef = useRef<WebGLProgram | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      premultipliedAlpha: false,
      antialias: false // We'll handle anti-aliasing in shaders
    })
    
    if (!gl) {
      console.error('WebGL not supported')
      return
    }
    
    glRef.current = gl

    // Helper functions
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      
      return shader
    }

    const createProgram = (vertexSource: string, fragmentSource: string) => {
      const vShader = createShader(gl.VERTEX_SHADER, vertexSource)
      const fShader = createShader(gl.FRAGMENT_SHADER, fragmentSource)
      
      if (!vShader || !fShader) return null

      const program = gl.createProgram()
      if (!program) return null
      
      gl.attachShader(program, vShader)
      gl.attachShader(program, fShader)
      gl.linkProgram(program)
      
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program))
        return null
      }
      
      return program
    }

    // Create particle program
    const particleProgram = createProgram(vertexShader, fragmentShader)
    if (!particleProgram) return
    particleProgramRef.current = particleProgram

    // Create trail program
    const trailProgram = createProgram(trailVertexShader, trailFragmentShader)
    if (!trailProgram) return
    trailProgramRef.current = trailProgram

    // Generate particle data
    const PARTICLE_COUNT = 100000 // 100k particles for dense river flow
    const particleData = new Float32Array(PARTICLE_COUNT * 5) // x, y, river, progress, offset
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 5
      particleData[idx] = 0     // x (calculated in shader)
      particleData[idx + 1] = 0 // y (calculated in shader)
      const baseRiver = i < PARTICLE_COUNT / 2 ? 0 : 1
      // Add variation to create metallic particles
      const metalVariation = Math.random()
      particleData[idx + 2] = baseRiver + metalVariation * 0.01 // Small variation determines metal type
      particleData[idx + 3] = Math.random() // progress
      particleData[idx + 4] = Math.random() // offset for variation
    }

    // Create buffers
    const particleBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, particleData, gl.STATIC_DRAW)

    // Get attribute locations for particle program
    const particleAttribs = {
      position: gl.getAttribLocation(particleProgram, 'a_position'),
      river: gl.getAttribLocation(particleProgram, 'a_river'),
      progress: gl.getAttribLocation(particleProgram, 'a_progress'),
      offset: gl.getAttribLocation(particleProgram, 'a_offset')
    }

    const particleUniforms = {
      time: gl.getUniformLocation(particleProgram, 'u_time'),
      resolution: gl.getUniformLocation(particleProgram, 'u_resolution'),
      flowProgress: gl.getUniformLocation(particleProgram, 'u_flowProgress')
    }
    
    // Also get fragment shader uniform
    const fragmentUniforms = {
      time: gl.getUniformLocation(particleProgram, 'u_time'),
      flowProgress: gl.getUniformLocation(particleProgram, 'u_flowProgress')
    }

    // Trail quad vertices
    const trailVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ])

    const trailBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, trailBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, trailVertices, gl.STATIC_DRAW)

    const trailAttribs = {
      position: gl.getAttribLocation(trailProgram, 'a_position')
    }

    const trailUniforms = {
      time: gl.getUniformLocation(trailProgram, 'u_time')
    }

    // Handle resize
    const handleResize = () => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)

    // Animation loop
    let flowProgress = 0
    const flowDelay = 1.0 // 1 second delay before rivers start
    const flowDuration = 8.0 // 8 seconds for rivers to flow - slower approach
    
    const render = () => {
      animationRef.current = requestAnimationFrame(render)
      
      // Calculate elapsed time
      let time = 0
      
      // Start animation when shouldStart prop becomes true
      if (shouldStart && !hasStartedRef.current) {
        hasStartedRef.current = true
        startTimeRef.current = Date.now()
      }
      
      // Only animate if started
      if (hasStartedRef.current && startTimeRef.current) {
        time = (Date.now() - startTimeRef.current) / 1000
        
        // Animate flow progress after delay
        if (time > flowDelay) {
          flowProgress = Math.min(1.0, (time - flowDelay) / flowDuration)
        } else {
          flowProgress = 0
        }
      } else {
        flowProgress = 0
      }
      
      // Clear
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      
      // Enable blending
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
      
      // Skip trail rendering - it creates the beaded stream effect
      // gl.useProgram(trailProgram)
      // gl.bindBuffer(gl.ARRAY_BUFFER, trailBuffer)
      // gl.enableVertexAttribArray(trailAttribs.position)
      // gl.vertexAttribPointer(trailAttribs.position, 2, gl.FLOAT, false, 0, 0)
      // gl.uniform1f(trailUniforms.time, time)
      // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      // Render particles on top
      gl.useProgram(particleProgram)
      gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
      
      // Set up attributes (5 floats per particle: x, y, river, progress, offset)
      const stride = 20 // 5 floats * 4 bytes
      gl.enableVertexAttribArray(particleAttribs.position)
      gl.vertexAttribPointer(particleAttribs.position, 2, gl.FLOAT, false, stride, 0)
      
      gl.enableVertexAttribArray(particleAttribs.river)
      gl.vertexAttribPointer(particleAttribs.river, 1, gl.FLOAT, false, stride, 8)
      
      gl.enableVertexAttribArray(particleAttribs.progress)
      gl.vertexAttribPointer(particleAttribs.progress, 1, gl.FLOAT, false, stride, 12)
      
      gl.enableVertexAttribArray(particleAttribs.offset)
      gl.vertexAttribPointer(particleAttribs.offset, 1, gl.FLOAT, false, stride, 16)
      
      // Set uniforms
      gl.uniform1f(particleUniforms.time, time)
      gl.uniform2f(particleUniforms.resolution, canvas.width, canvas.height)
      gl.uniform1f(particleUniforms.flowProgress, flowProgress)
      
      // Draw particles
      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)
    }
    
    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (gl) {
        if (particleProgram) gl.deleteProgram(particleProgram)
        if (trailProgram) gl.deleteProgram(trailProgram)
        gl.deleteBuffer(particleBuffer)
        gl.deleteBuffer(trailBuffer)
      }
    }
  }, [shouldStart])

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        mixBlendMode: 'screen',
        opacity: 0.9 
      }}
    />
  )
}
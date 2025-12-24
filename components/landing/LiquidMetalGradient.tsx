'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function LiquidMetalGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 })
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    })

    if (!gl) {
      console.error('WebGL2 not supported')
      return
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio
      canvas.height = window.innerHeight * window.devicePixelRatio
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Vertex shader
    const vertexShaderSource = `#version 300 es
      in vec2 a_position;
      out vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `

    // Fragment shader - liquid gold gradients
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      
      in vec2 v_texCoord;
      out vec4 fragColor;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      
      // Property positions for golden triangle
      uniform vec2 u_tennyson;
      uniform vec2 u_biggold;
      uniform vec2 u_fourjs;
      
      // Simplex noise for organic flow
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
      
      // Flow field function
      vec2 flowField(vec2 p, float time) {
        float n1 = snoise(vec3(p * 2.0, time * 0.5));
        float n2 = snoise(vec3(p * 2.0 + 100.0, time * 0.5));
        return vec2(n1, n2) * 0.5;
      }
      
      // Distance to line segment
      float distToSegment(vec2 p, vec2 a, vec2 b) {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h);
      }
      
      // Main gradient function
      vec3 liquidGold(vec2 uv) {
        // Base colors matching the sky gradient
        vec3 topColor = vec3(0.557, 0.384, 0.114); // #8E621D
        vec3 midColor = vec3(0.776, 0.475, 0.047); // #C6790C
        vec3 bottomColor = vec3(0.914, 0.537, 0.0); // #E98900
        vec3 electricGold = vec3(1.0, 0.843, 0.0);
        vec3 liquidGold = vec3(1.0, 0.647, 0.0);
        vec3 copperGlow = vec3(0.722, 0.451, 0.2);
        
        // Create flow pattern
        vec2 flow = flowField(uv * 3.0, u_time);
        vec2 distortedUV = uv + flow * 0.1;
        
        // Calculate distances to properties (golden triangle)
        float distTennyson = length(uv - u_tennyson);
        float distBigGold = length(uv - u_biggold);
        float distFourJs = length(uv - u_fourjs);
        
        // Create gradient fields around each property
        float fieldTennyson = 1.0 - smoothstep(0.0, 0.4, distTennyson);
        float fieldBigGold = 1.0 - smoothstep(0.0, 0.4, distBigGold);
        float fieldFourJs = 1.0 - smoothstep(0.0, 0.4, distFourJs);
        
        // Connection lines between properties (golden triangle)
        float connection1 = 1.0 - smoothstep(0.0, 0.02, distToSegment(uv, u_tennyson, u_biggold));
        float connection2 = 1.0 - smoothstep(0.0, 0.02, distToSegment(uv, u_biggold, u_fourjs));
        float connection3 = 1.0 - smoothstep(0.0, 0.02, distToSegment(uv, u_fourjs, u_tennyson));
        
        float connections = max(max(connection1, connection2), connection3) * 0.7;
        
        // Combine fields with flow
        float combinedField = fieldTennyson + fieldBigGold + fieldFourJs;
        
        // Add flowing noise
        float flowNoise = snoise(vec3(distortedUV * 5.0, u_time * 0.2)) * 0.5 + 0.5;
        combinedField += flowNoise * 0.3;
        
        // Mouse influence
        float mouseDist = length(uv - u_mouse);
        float mouseInfluence = 1.0 - smoothstep(0.0, 0.3, mouseDist);
        combinedField += mouseInfluence * 0.3;
        
        // Create base gradient matching sky colors
        vec3 baseGradient = mix(topColor, midColor, smoothstep(0.0, 0.5, uv.y));
        baseGradient = mix(baseGradient, bottomColor, smoothstep(0.5, 1.0, uv.y));
        
        // Add liquid metal effect
        vec3 goldGradient = mix(electricGold, liquidGold, flowNoise);
        goldGradient = mix(goldGradient, copperGlow, pow(flowNoise, 2.0));
        
        // Blend base gradient with gold effects
        vec3 color = mix(baseGradient, goldGradient, combinedField * 0.6);
        
        // Connection lines glow
        color = mix(color, electricGold, connections);
        
        // Add shimmer
        float shimmer = sin(u_time * 2.0 + distortedUV.x * 10.0 + distortedUV.y * 10.0) * 0.5 + 0.5;
        color += shimmer * combinedField * 0.1;
        
        // Subtle vignette
        float vignette = 1.0 - length(uv - 0.5) * 0.8;
        color *= (0.8 + vignette * 0.2);
        
        return color;
      }
      
      void main() {
        vec2 uv = v_texCoord;
        vec3 color = liquidGold(uv);
        
        // Output with gamma correction
        fragColor = vec4(pow(color, vec3(1.0/2.2)), 0.9);
      }
    `

    // Compile shader function
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      
      return shader
    }

    // Create shaders
    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
    
    if (!vertexShader || !fragmentShader) return

    // Create program
    const program = gl.createProgram()
    if (!program) return
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program))
      return
    }

    // Get uniform locations
    const uniforms = {
      time: gl.getUniformLocation(program, 'u_time'),
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      mouse: gl.getUniformLocation(program, 'u_mouse'),
      tennyson: gl.getUniformLocation(program, 'u_tennyson'),
      biggold: gl.getUniformLocation(program, 'u_biggold'),
      fourjs: gl.getUniformLocation(program, 'u_fourjs')
    }

    // Create vertex buffer
    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ])
    
    const vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    
    const positionLocation = gl.getAttribLocation(program, 'a_position')

    // Property positions for golden triangle
    const properties = {
      tennyson: { x: 0.5, y: 0.2 },
      biggold: { x: 0.2, y: 0.7 },
      fourjs: { x: 0.8, y: 0.7 }
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth
      mouseRef.current.targetY = 1.0 - (e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Render loop
    const render = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001
      
      // Smooth mouse movement
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1
      
      // Set uniforms
      gl.useProgram(program)
      gl.uniform1f(uniforms.time, time)
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height)
      gl.uniform2f(uniforms.mouse, mouseRef.current.x, mouseRef.current.y)
      gl.uniform2f(uniforms.tennyson, properties.tennyson.x, properties.tennyson.y)
      gl.uniform2f(uniforms.biggold, properties.biggold.x, properties.biggold.y)
      gl.uniform2f(uniforms.fourjs, properties.fourjs.x, properties.fourjs.y)
      
      // Bind vertex buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
      gl.enableVertexAttribArray(positionLocation)
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
      
      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{ 
        opacity: 0.6,
        mixBlendMode: 'screen'
      }}
    />
  )
}
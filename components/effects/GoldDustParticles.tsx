'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export default function GoldDustParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })

    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Generate particles
    const particleCount = 40
    const newParticles: Particle[] = []

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * windowSize.width,
        y: Math.random() * windowSize.height,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.6 + 0.2
      })
    }

    setParticles(newParticles)
  }, [windowSize])

  return (
    <div className="gold-particles-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="gold-particle"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: [
              particle.x,
              particle.x + (Math.random() - 0.5) * 200,
              particle.x + (Math.random() - 0.5) * 150,
              particle.x
            ],
            y: [
              particle.y,
              particle.y - 100,
              particle.y - 200,
              particle.y - 300,
              windowSize.height + 50
            ],
            scale: [0, 1, 1, 1, 0],
            opacity: [0, particle.opacity, particle.opacity, particle.opacity * 0.5, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            pointerEvents: 'none',
            zIndex: 50
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #FFD700, #FFA500, #FF8C00)`,
              boxShadow: `
                0 0 ${particle.size * 2}px #FFD700,
                0 0 ${particle.size * 4}px #FFA50080,
                0 0 ${particle.size * 6}px #FFD70040
              `,
              filter: 'blur(0.5px)'
            }}
          />
        </motion.div>
      ))}

      {/* Larger, slower particles for depth */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`large-${i}`}
          className="gold-particle-large"
          initial={{
            x: Math.random() * windowSize.width,
            y: windowSize.height + 50,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: [
              null,
              `+=${(Math.random() - 0.5) * 300}`
            ],
            y: -50,
            scale: [0, 1.5, 1.5, 0],
            opacity: [0, 0.3, 0.3, 0]
          }}
          transition={{
            duration: 30 + Math.random() * 15,
            delay: Math.random() * 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            pointerEvents: 'none',
            zIndex: 45
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #FFD700, #FFA500)`,
              boxShadow: `
                0 0 12px #FFD700,
                0 0 24px #FFA50060,
                0 0 36px #FFD70030
              `,
              filter: 'blur(1px)'
            }}
          />
        </motion.div>
      ))}

      <style jsx>{`
        .gold-particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 50;
        }

        @media (prefers-reduced-motion: reduce) {
          .gold-particles-container {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
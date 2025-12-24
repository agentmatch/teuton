'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiArrowRight, FiTrendingUp, FiMapPin, FiCompass } from 'react-icons/fi'
import { useRef, useState } from 'react'
import Image from 'next/image'

export default function LandingHeroV3() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background layers - subtle and sophisticated */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[#ffb800]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-[#0022d2]/10 to-transparent rounded-full blur-3xl" />
        </div>
        
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230022d2' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0 items-center min-h-screen">
          
          {/* Left side - Content */}
          <motion.div
            style={{ opacity, scale, y }}
            className="relative z-20 lg:pr-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6"
              >
                <span className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: 'rgba(255,184,0,0.1)',
                    color: '#d89b00',
                    border: '1px solid rgba(255,184,0,0.2)'
                  }}
                >
                  TSX-V: LUX
                </span>
              </motion.div>

              {/* Main headline */}
              <h1 className="mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  The Next Major
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                  style={{
                    background: 'linear-gradient(135deg, #ffb800 0%, #d89b00 50%, #0022d2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Discovery Awaits
                </motion.span>
              </h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
              >
                20,481 hectares in the Golden Triangle with <span className="text-[#ffb800] font-semibold">90m @ 14.4 g/t Au</span> discovery. 
                One of the last large-scale exploration opportunities in the world's richest gold district.
              </motion.p>

              {/* Key metrics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-6 mb-10"
              >
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold mb-1" style={{ color: '#ffb800' }}>6</div>
                  <div className="text-sm text-muted-foreground">Strategic Properties</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold mb-1" style={{ color: '#0022d2' }}>64</div>
                  <div className="text-sm text-muted-foreground">Historical Drill Holes</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold mb-1" style={{ color: '#1e009f' }}>161M oz</div>
                  <div className="text-sm text-muted-foreground">Adjacent Resources</div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="#luxor-story">
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden"
                    style={{ 
                      backgroundColor: '#0022d2',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Discover Our Story
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0"
                      style={{ backgroundColor: '#1e009f' }}
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </Link>
                
                <Link href="#properties">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="group"
                    style={{ 
                      borderColor: '#ffb800',
                      color: '#ffb800'
                    }}
                  >
                    <FiMapPin className="w-4 h-4 mr-2" />
                    Explore Properties
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side - Image with overlay effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-screen lg:h-auto lg:min-h-screen flex items-center"
          >
            <div className="relative w-full h-full lg:absolute lg:inset-0">
              {/* Image container with parallax */}
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="relative h-full w-full"
              >
                <div className="absolute inset-0 lg:right-[-20%] lg:left-[-20%]">
                  {/* Gradient overlay for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent z-10 lg:block hidden" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 lg:hidden" />
                  
                  {/* The image */}
                  <Image
                    src="/images/dinojeremy4j.jpg"
                    alt="Luxor Metals Leadership"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                  />
                  
                  {/* Foreground rocks overlay */}
                  <motion.div 
                    className="absolute -bottom-[5%] left-0 right-0 h-[40%] pointer-events-none z-20"
                    style={{
                      backgroundImage: `url('/images/glacierrocks.png')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'bottom center',
                      backgroundRepeat: 'no-repeat',
                      y: imageY
                    }}
                  />
                  
                  {/* Overlay effects */}
                  <div className="absolute inset-0 z-20">
                    {/* Gold shimmer effect */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'radial-gradient(circle at 70% 30%, rgba(255,184,0,0.1) 0%, transparent 50%)',
                      }}
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Floating particles over image */}
                    <div className="absolute inset-0 overflow-hidden">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 2 === 0 ? '#ffb800' : '#0022d2',
                            boxShadow: `0 0 6px ${i % 2 === 0 ? '#ffb800' : '#0022d2'}`,
                          }}
                          animate={{
                            y: [-20, -80, -20],
                            opacity: [0, 0.8, 0],
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Caption overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="absolute bottom-8 left-8 right-8 z-30"
                  >
                    <div className="backdrop-blur-md bg-black/30 rounded-lg p-4 border border-white/10">
                      <p className="text-white/90 text-sm">
                        Leadership with proven track record in the Golden Triangle
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">Scroll to explore</span>
          <div className="w-6 h-10 border-2 rounded-full p-1" style={{ borderColor: 'rgba(0,34,210,0.3)' }}>
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 rounded-full mx-auto"
              style={{ backgroundColor: '#0022d2' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
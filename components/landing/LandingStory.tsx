'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'

export default function LandingStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isStoryScrollComplete, setIsStoryScrollComplete] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Parallax transforms
  const dinoY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const dinoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95])

  // Handle internal scroll completion
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
      
      setIsStoryScrollComplete(isAtBottom)
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      handleScroll() // Check initial state
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  // Pass scroll completion state to parent
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute('data-scroll-complete', isStoryScrollComplete.toString())
    }
  }, [isStoryScrollComplete])

  return (
    <section 
      ref={containerRef} 
      id="luxor-story" 
      className="h-screen relative overflow-hidden bg-gradient-to-b from-background via-[#faf8f5] to-[#f5f2ed]"
      data-scroll-hijack="true"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating gold particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#ffb800' : '#0022d2',
              opacity: 0.3,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Large gradient orbs */}
        <motion.div
          className="absolute -top-48 -right-48 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, #ffb800, transparent)',
            filter: 'blur(60px)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <motion.div
          ref={ref}
          className="w-full h-full flex items-center"
        >
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 lg:gap-16 items-start h-[80vh]">
            {/* Left side - Dino's Image (Fixed) */}
            <div className="lg:sticky lg:top-0 space-y-6">
              <motion.div
                style={{ y: dinoY, scale: dinoScale }}
                className="relative"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative aspect-[3/4] max-h-[60vh] rounded-3xl overflow-hidden mx-auto lg:mx-0"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                >
                  <Image
                    src="/images/dinocutoutfade.png"
                    alt="Dino Cremonese - Founder of Luxor Metals"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Name overlay */}
                  <div className="absolute bottom-8 left-8 right-8">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={inView ? { y: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
                        Dino Cremonese
                      </h3>
                      <p className="text-lg text-white/90 font-light">
                        Visionary Geologist & Founder
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isStoryScrollComplete ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:flex items-center justify-center gap-2 text-sm text-muted-foreground"
              >
                <span>Scroll to read the story</span>
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-4 h-4"
                >
                  ↓
                </motion.div>
              </motion.div>
            </div>

            {/* Right side - Scrollable Story Content */}
            <div 
              ref={scrollRef}
              className="h-full overflow-y-auto scrollbar-hide pr-4"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
              }}
            >
              <div className="space-y-8 py-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    The Man Who Saw Tomorrow
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    In 1979, while others saw only ice and rock, Dino Cremonese saw opportunity. His first major discovery that year was just the beginning of a journey that would span four decades and position him at the heart of Canada's Golden Triangle.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-yellow-600">1980: The Strategic Stakes</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    While glaciers still covered most of the Golden Triangle, Cremonese made a decision that would define the next 40 years. He staked claims on <span className="font-semibold text-foreground">20,481 hectares</span> of what others dismissed as frozen wasteland. His geological understanding told him these lands sat adjacent to what would become some of the world's richest gold deposits.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-blue-600">Four Decades of Patient Capital</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    From 1980 to 2020, Cremonese perfected the prospect generator model. Rather than diluting shareholder value through constant financing, he attracted over <span className="font-semibold text-foreground">$50 million</span> in partner-funded exploration. This patient approach preserved capital while systematically advancing the geological understanding of his properties.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Each drilling season brought new data. Each partner brought new perspectives. And slowly, methodically, the true potential of these lands began to emerge.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-yellow-600">The Validation</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Cremonese's strategic positioning proved prescient when the Treaty Creek discovery was announced just 20 kilometers north. With <span className="font-semibold text-foreground">31 million ounces</span> of gold equivalent, it validated everything he had believed about the geology of the region. The smart money took notice.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Eric Sprott, legendary resource investor, backed Cremonese with over <span className="font-semibold text-foreground">$10 million</span> in investment. When Sprott invests, the market listens.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-blue-600 bg-clip-text text-transparent">
                    2024: The Culmination
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Luxor Metals represents the culmination of Cremonese's vision. Same properties. Same technical team. Same geological thesis. But now with the added advantages of climate change revealing new targets, neighboring discoveries proving the model, and perfect market timing.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    After 40 years of strategic positioning, the conditions for discovery have never been better. The glaciers are retreating. The geology is proven. The infrastructure is in place.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="bg-gradient-to-r from-yellow-400/10 via-transparent to-blue-600/10 rounded-3xl p-8 backdrop-blur-sm border border-white/10 mt-12"
                >
                  <h3 className="text-3xl font-black mb-4">
                    We're Ready for The Next Major Discovery
                  </h3>
                  <p className="text-xl text-muted-foreground">
                    The geology is proven. The neighbors have found billions. And we have 40 years of preparation on our side.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
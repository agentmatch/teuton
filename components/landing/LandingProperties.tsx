'use client'

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useRef, useEffect } from 'react'
import { FiArrowRight, FiMapPin, FiActivity, FiLayers, FiTrendingUp, FiTarget, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import Image from 'next/image'

// New color palette
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

const properties = [
  {
    id: 1,
    name: 'Tennyson',
    tagline: 'Advanced Porphyry System',
    shortDescription: '64 drill holes defining 900m x 700m Cu-Au system',
    description: 'Our most advanced exploration target featuring 64 historical drill holes that have defined a substantial 900m x 700m copper-gold porphyry system.',
    highlights: ['900m x 700m footprint', 'Porphyry Cu-Au system', '64 historical drill holes', 'Multiple mineralized zones'],
    metrics: { 
      drillHoles: '64 holes',
      systemSize: '900m x 700m',
      mineralization: 'Cu-Au Porphyry',
      stage: 'Advanced'
    },
    color: palette.peach,
    elements: [
      { symbol: 'Cu', number: '29', name: 'Copper' },
      { symbol: 'Au', number: '79', name: 'Gold' }
    ],
  },
  {
    id: 2,
    name: 'Big Gold',
    tagline: 'High-Grade Discovery',
    shortDescription: '90m @ 14.4 g/t Au with visible gold',
    description: 'Exceptional high-grade gold discovery with an intercept of 90m @ 14.4 g/t Au including visible gold.',
    highlights: ['14.4 g/t Au over 90m', 'Visible gold occurrences', 'Open at depth', 'Year-round access'],
    metrics: { 
      bestIntercept: '90m @ 14.4 g/t',
      discovery: 'High-grade gold',
      potential: 'Open all directions',
      infrastructure: 'Road accessible'
    },
    color: palette.peach,
    elements: [
      { symbol: 'Au', number: '79', name: 'Gold' }
    ],
  },
  {
    id: 3,
    name: "4 J's",
    tagline: 'VMS & Porphyry Potential',
    shortDescription: 'Multiple styles with glacier edge discoveries',
    description: 'Diverse property hosting multiple mineralization styles including VMS and porphyry potential.',
    highlights: ['VMS potential identified', 'Glacier retreat exposures', 'New Cu-Au discoveries', 'Multiple target types'],
    metrics: { 
      targets: '3 priority targets',
      geology: 'VMS & Porphyry',
      discovery: 'Glacier retreat',
      exploration: 'Early stage'
    },
    color: palette.peach,
    elements: [
      { symbol: 'Cu', number: '29', name: 'Copper' },
      { symbol: 'Zn', number: '30', name: 'Zinc' }
    ],
  },
  {
    id: 4,
    name: 'Eskay Rift',
    tagline: 'Eskay Creek Analog',
    shortDescription: 'Preserved Eskay Creek-equivalent stratigraphy',
    description: 'Large preserved package of Eskay Creek-equivalent stratigraphy with untested ZTEM anomalies.',
    highlights: ['ZTEM anomalies defined', 'Eskay Creek stratigraphy', 'Untested targets', 'Large land package'],
    metrics: { 
      anomalies: '2 ZTEM targets',
      geology: 'Eskay-equivalent',
      size: 'Large land position',
      potential: 'World-class analog'
    },
    color: palette.yellow,
    elements: [
      { symbol: 'Au', number: '79', name: 'Gold' },
      { symbol: 'Ag', number: '47', name: 'Silver' }
    ],
  },
  {
    id: 5,
    name: 'Leduc & Pearson',
    tagline: 'Regional Exploration',
    shortDescription: 'Strategic position with untested targets',
    description: 'Strategic land position providing regional exploration upside with multiple untested geophysical targets.',
    highlights: ['Strategic land position', 'Multiple untested targets', 'Year-round road access', 'Regional potential'],
    metrics: { 
      access: 'Year-round roads',
      targets: 'Multiple geophysical',
      stage: 'Early exploration',
      upside: 'Significant potential'
    },
    color: palette.peach,
    elements: [
      { symbol: 'Cu', number: '29', name: 'Copper' },
      { symbol: 'Mo', number: '42', name: 'Molybdenum' }
    ],
  },
]

function PropertyCard({ property, index, currentIndex, onClick, totalCards }: { 
  property: any; 
  index: number; 
  currentIndex: number;
  onClick: () => void;
  totalCards: number;
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isActive = index === currentIndex
  
  // Calculate fan-out position with cycling
  let relativeIndex = index - currentIndex
  
  // Implement cycling - if cards are too far away, cycle them to the other side
  if (relativeIndex > 2) {
    relativeIndex = relativeIndex - totalCards
  } else if (relativeIndex < -2) {
    relativeIndex = relativeIndex + totalCards
  }
  
  const fanAngle = 15 // degrees between cards
  const rotation = relativeIndex * fanAngle
  const translateX = relativeIndex * 60
  const translateY = Math.abs(relativeIndex) * 30
  const zIndex = totalCards - Math.abs(relativeIndex)
  
  // Hide cards that are too far away
  const isVisible = Math.abs(relativeIndex) <= 2
  
  // Mouse tracking for hover lift
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      className="absolute cursor-pointer"
      style={{
        width: '320px',
        height: '450px',
        transformOrigin: 'bottom center',
        zIndex: isActive ? 100 : zIndex,
      }}
      animate={{
        rotateZ: rotation,
        x: translateX,
        y: isActive ? -50 : translateY,
        scale: isActive ? 1.05 : 1,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      whileHover={!isActive ? {
        y: translateY - 20,
        transition: { duration: 0.2 }
      } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden"
        style={{
          boxShadow: isActive 
            ? `0 30px 60px -15px rgba(0,0,0,0.8), 0 0 0 1px ${property.color}20`
            : isHovered
            ? '0 25px 50px -12px rgba(0,0,0,0.6)'
            : '0 20px 40px -10px rgba(0,0,0,0.5)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Card background - New palette theme */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${palette.dark}, ${palette.dark}ee)`,
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          }}
        />
        
        {/* Subtle gradient accent */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${property.color}25 0%, transparent 50%)`,
          }}
        />
        
        {/* Border gradient */}
        <div 
          className="absolute inset-0 rounded-3xl"
          style={{
            padding: '1px',
            background: isActive ? `linear-gradient(135deg, ${property.color}60, ${palette.blue}40)` : 'transparent',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Content */}
        <div className="relative h-full p-8 flex flex-col">
          {/* Periodic Elements */}
          <div className="flex gap-2 mb-6">
            {property.elements.map((element: any, i: number) => (
              <motion.div
                key={i}
                className="relative w-16 h-16 rounded-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${property.color}20, ${property.color}10)`,
                  border: `1px solid ${property.color}30`,
                  boxShadow: isActive ? `0 0 20px ${property.color}20` : 'none',
                }}
                animate={isActive ? {
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1,
                }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium text-white/60">{element.number}</span>
                  <span className="text-xl font-black text-white">{element.symbol}</span>
                  <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">{element.name}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-3xl font-extrabold text-white mb-2">
            {property.name}
          </h3>
          <p className="text-sm font-semibold uppercase tracking-wider mb-4"
             style={{ color: `${property.color}80` }}>
            {property.tagline}
          </p>

          {/* Description */}
          <p className="text-white/90 text-sm leading-relaxed mb-6 flex-grow">
            {property.shortDescription}
          </p>

          {/* Metrics preview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(property.metrics).slice(0, 2).map(([key, value]) => (
              <div key={key} className="text-left p-3 rounded-lg"
                   style={{ 
                     background: 'rgba(212, 165, 116, 0.1)',
                     border: '1px solid rgba(212, 165, 116, 0.2)'
                   }}>
                <p className="text-xs uppercase mb-1" style={{ color: 'rgba(212, 165, 116, 0.7)' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm font-semibold text-white">{value as string}</p>
              </div>
            ))}
          </div>

          {/* View details indicator */}
          <motion.div 
            className="flex items-center gap-2"
            style={{ color: property.color }}
            animate={isActive ? {
              opacity: [0.6, 1, 0.6],
            } : { opacity: 0.5 }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          >
            <span className="text-sm font-medium">View Details</span>
            <FiArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Subtle top shine */}
        {isActive && (
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${property.color}40, transparent)`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default function LandingProperties() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const nextProperty = () => {
    setCurrentIndex((prev) => (prev + 1) % properties.length)
  }

  const prevProperty = () => {
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length)
  }


  const currentProperty = properties[currentIndex]

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-[#1a0f08]">
      <div ref={containerRef} className="absolute inset-0">
        {/* Static background */}
        <div className="absolute inset-0">
          <Image
            src="/images/dinojeremy4j.jpg"
            alt="Luxor Metals Leadership"
            fill
            className="object-cover opacity-80"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0f08] via-[#1a0f08]/50 to-transparent" 
               style={{ backgroundSize: '100% 60%', backgroundRepeat: 'no-repeat' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f08]/30 via-transparent to-transparent" />
        </div>

        {/* Content grid */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-center">
              {/* Left side - Cards fanned out */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative h-[600px] flex items-end justify-center"
              >
                <div className="relative" style={{ width: '400px', height: '500px' }}>
                  {properties.map((property, index) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      index={index}
                      currentIndex={currentIndex}
                      totalCards={properties.length}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Right side - Information display */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="mt-16"
              >

                {/* Active property details */}
                <div className="rounded-2xl p-8 border"
                     style={{
                       background: 'rgba(26, 15, 8, 0.8)',
                       borderColor: 'rgba(212, 165, 116, 0.3)',
                       backdropFilter: 'blur(20px)',
                       WebkitBackdropFilter: 'blur(20px)',
                     }}>
                      {/* Property header */}
                      <div className="flex items-start gap-4 mb-6">
                        <motion.div 
                          className="flex gap-2 flex-shrink-0"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          key={`elements-${currentIndex}`}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          {currentProperty.elements.map((element: any, i: number) => (
                            <div
                              key={i}
                              className="w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${currentProperty.color}20, ${currentProperty.color}10)`,
                                border: `1px solid ${currentProperty.color}30`,
                              }}
                            >
                              <span className="text-[9px] font-medium text-white/60">{element.number}</span>
                              <span className="text-sm font-black text-white leading-none">{element.symbol}</span>
                            </div>
                          ))}
                        </motion.div>
                        <div>
                          <motion.h3 
                            className="text-3xl font-extrabold text-white mb-1"
                            key={`name-${currentIndex}`}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {currentProperty.name}
                          </motion.h3>
                          <motion.p 
                            className="text-sm font-semibold uppercase tracking-wider"
                            style={{ color: `${currentProperty.color}80` }}
                            key={`tagline-${currentIndex}`}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, delay: 0.05 }}
                          >
                            {currentProperty.tagline}
                          </motion.p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-white/80 mb-8 text-lg leading-relaxed">
                        {currentProperty.description}
                      </p>

                      {/* Highlights */}
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {currentProperty.highlights.map((highlight: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-2"
                          >
                            <div 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: currentProperty.color }}
                            />
                            <span className="text-sm text-white/70">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* All metrics */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {Object.entries(currentProperty.metrics).map(([key, value]) => (
                          <div 
                            key={key}
                            className="p-4 rounded-xl"
                            style={{ 
                              background: 'rgba(212, 165, 116, 0.1)',
                              border: '1px solid rgba(212, 165, 116, 0.2)'
                            }}
                          >
                            <p className="text-xs uppercase mb-1" style={{ color: 'rgba(212, 165, 116, 0.8)' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-base font-semibold text-white">
                              {value as string}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Navigation controls - Egyptian theme */}
                      <div className="flex items-center gap-4 pt-6 border-t"
                           style={{ borderColor: 'rgba(212, 165, 116, 0.2)' }}>
                        <button
                          onClick={prevProperty}
                          className="p-3 rounded-full transition-all"
                          style={{
                            background: 'rgba(212, 165, 116, 0.1)',
                            border: '1px solid rgba(212, 165, 116, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.3)';
                          }}
                        >
                          <FiChevronLeft className="w-5 h-5" style={{ color: '#D4A574' }} />
                        </button>

                        {/* Indicators */}
                        <div className="flex gap-2 flex-1">
                          {properties.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentIndex(index)}
                              className="h-1 rounded-full transition-all flex-1"
                              style={{
                                background: index === currentIndex 
                                  ? '#D4A574' 
                                  : 'rgba(212, 165, 116, 0.3)'
                              }}
                              onMouseEnter={(e) => {
                                if (index !== currentIndex) {
                                  e.currentTarget.style.background = 'rgba(212, 165, 116, 0.5)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (index !== currentIndex) {
                                  e.currentTarget.style.background = 'rgba(212, 165, 116, 0.3)';
                                }
                              }}
                            />
                          ))}
                        </div>

                        <button
                          onClick={nextProperty}
                          className="p-3 rounded-full transition-all"
                          style={{
                            background: 'rgba(212, 165, 116, 0.1)',
                            border: '1px solid rgba(212, 165, 116, 0.3)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 165, 116, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.5)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(212, 165, 116, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(212, 165, 116, 0.3)';
                          }}
                        >
                          <FiChevronRight className="w-5 h-5" style={{ color: '#D4A574' }} />
                        </button>
                      </div>
                    </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
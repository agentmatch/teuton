'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiTarget, FiTrendingUp, FiMap, FiAward } from 'react-icons/fi'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: FiMap,
    title: '20,481 Hectares in the Golden Triangle',
    description: 'Six strategic properties in BC\'s most prolific mining district, home to world-class deposits like Eskay Creek and KSM',
    stats: { value: '20,481', unit: 'hectares' },
    color: '#ffb800',
    additionalInfo: [
      'Adjacent to major discoveries',
      'Year-round road access',
      'Proven geological trends'
    ]
  },
  {
    icon: FiTarget,
    title: 'Multiple Discovery Targets',
    description: 'VMS, porphyry Cu-Au, and epithermal Au-Ag targets with proven mineralization across all properties',
    stats: { value: '6', unit: 'properties' },
    color: '#0022d2',
    additionalInfo: [
      'Three deposit types identified',
      'Multiple untested anomalies',
      'Historic drilling confirms potential'
    ]
  },
  {
    icon: FiAward,
    title: 'Proven Leadership & Track Record',
    description: 'Management team with decades of discovery success and value creation in multiple mining jurisdictions',
    stats: { value: '40+', unit: 'years exp' },
    color: '#1e009f',
    additionalInfo: [
      'Multiple past discoveries',
      'Strong capital markets experience',
      'Deep technical expertise'
    ]
  },
]

function FeatureCard({ feature, index, inView }: { feature: typeof features[0], index: number, inView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 30, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)
  
  // Much more subtle tilt effect
  const rotateX = useTransform(mouseY, [-100, 100], [3, -3])
  const rotateY = useTransform(mouseX, [-100, 100], [-3, 3])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) * 0.1) // Reduced movement
    mouseY.set((e.clientY - centerY) * 0.1)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative group"
      style={{ 
        x, 
        y,
        rotateX,
        rotateY,
        transformPerspective: 1000
      }}
    >
      {/* Glassmorphism card with square edges */}
      <div 
        className="p-8 h-full text-center relative overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? feature.color + '30' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: isHovered 
            ? `0 20px 40px ${feature.color}20, inset 0 0 20px ${feature.color}10` 
            : '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        {/* Animated gradient background on hover */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: `radial-gradient(circle at 50% 0%, ${feature.color}10 0%, transparent 70%)`,
          }}
        />


        {/* Icon with glassmorphism effect */}
        <motion.div 
          className="w-20 h-20 mx-auto mb-6 flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${feature.color}20`,
            boxShadow: `0 8px 16px ${feature.color}10`,
          }}
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            borderColor: isHovered ? `${feature.color}40` : `${feature.color}20`,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            animate={{ 
              rotateY: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <feature.icon 
              className="w-10 h-10 relative z-10" 
              style={{ color: feature.color }}
            />
          </motion.div>
          
          {/* Icon glow effect */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(circle, ${feature.color}20 0%, transparent 70%)`,
            }}
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 text-foreground relative z-10">
          {feature.title}
        </h3>

        {/* Description with height animation */}
        <motion.div
          animate={{ height: isHovered ? 'auto' : '48px' }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="overflow-hidden mb-6"
        >
          <p className="text-muted-foreground relative z-10">
            {feature.description}
          </p>
          
          {/* Additional info that appears on hover */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : -10,
            }}
            transition={{ duration: 0.3, delay: isHovered ? 0.1 : 0 }}
            className="mt-4 space-y-2"
          >
            {feature.additionalInfo.map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -20,
                }}
                transition={{ 
                  duration: 0.3, 
                  delay: isHovered ? 0.2 + (i * 0.1) : 0 
                }}
                className="flex items-center gap-2"
              >
                <div 
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: feature.color }}
                />
                <span className="text-sm" style={{ color: feature.color + 'dd' }}>
                  {info}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Animated stat with glassmorphism */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ 
            scale: isHovered ? 1.05 : 1, 
            opacity: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-baseline gap-1 px-4 py-2"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${feature.color}30`,
            boxShadow: isHovered ? `0 4px 12px ${feature.color}20` : 'none',
          }}
        >
          <span className="text-2xl font-bold" style={{ color: feature.color }}>
            {feature.stats.value}
          </span>
          <span className="text-sm" style={{ color: feature.color + '90' }}>
            {feature.stats.unit}
          </span>
        </motion.div>

        {/* Edge accent lines */}
        <motion.div
          className="absolute top-0 left-0 w-full h-0.5"
          style={{ background: feature.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5"
          style={{ background: feature.color }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      </div>
    </motion.div>
  )
}

export default function LandingFeaturesV2() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, hsl(var(--background)), rgba(255,184,0,0.02), hsl(var(--background)))' }}>
      {/* Golden Triangle Grid Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="triangleGrid" x="0" y="0" width="100" height="86.6" patternUnits="userSpaceOnUse">
              {/* Equilateral triangles pattern */}
              <polygon points="50,0 100,86.6 0,86.6" fill="none" stroke="#ffb800" strokeWidth="0.5" />
              <polygon points="0,0 50,86.6 -50,86.6" fill="none" stroke="#ffb800" strokeWidth="0.5" />
              <polygon points="100,0 150,86.6 50,86.6" fill="none" stroke="#ffb800" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="triangleFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffb800" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffb800" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffb800" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangleGrid)" />
          <rect width="100%" height="100%" fill="url(#triangleFade)" opacity="0.1" />
        </svg>
      </div>
      
      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,184,0,0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span style={{
              background: 'linear-gradient(to right, #ffb800, #0022d2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Luxor Metals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Six strategic properties in BC's most prolific mining district, home to world-class deposits like Eskay Creek and KSM
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              feature={feature}
              index={index}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
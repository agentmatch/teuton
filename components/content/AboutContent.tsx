'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { FiCalendar, FiMapPin, FiAward, FiTrendingUp, FiMail, FiLinkedin, FiChevronDown, FiDownload } from 'react-icons/fi'
import Image from 'next/image'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

// RAM Design Color Palette
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach
  yellow: '#fed992'     // Soft yellow
}

interface TimelineEvent {
  year: string
  title: string
  description: string
  icon: any
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  email: string
  linkedin?: string
  experience: string
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2019',
    title: 'Company Formation',
    description: 'Silver Grail was founded with a vision to become a leading mineral exploration company in British Columbia\'s Golden Triangle.',
    icon: FiAward
  },
  {
    year: '2020',
    title: 'Initial Property Acquisition',
    description: 'Acquired our flagship Tennyson Property, strategically located near major discoveries in the Golden Triangle.',
    icon: FiMapPin
  },
  {
    year: '2021',
    title: 'Expansion Phase',
    description: 'Expanded our portfolio to include Four J\'s, Big Gold, and Eskay Rift properties, totaling over 15,000 hectares.',
    icon: FiTrendingUp
  },
  {
    year: '2022',
    title: 'First Drilling Program',
    description: 'Completed our inaugural drilling program at Tennyson, intersecting significant mineralization and validating our exploration model.',
    icon: FiAward
  },
  {
    year: '2023',
    title: 'Strategic Partnerships',
    description: 'Formed key partnerships with local First Nations and established relationships with major mining companies in the region.',
    icon: FiTrendingUp
  },
  {
    year: '2024',
    title: 'Portfolio Optimization',
    description: 'Optimized property portfolio, bringing our total land package to 18,400 hectares across 7 strategic properties.',
    icon: FiMapPin
  },
  {
    year: '2025',
    title: 'Accelerated Exploration',
    description: 'Launched comprehensive exploration programs across all properties with advanced geophysics and expanded drilling campaigns.',
    icon: FiTrendingUp
  }
]

// Photo Story Component
const PhotoStorySection = () => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const photoStories = [
    {
      image: '/images/dino1.JPG',
      title: 'The Early Years',
      subtitle: '1970s - The Foundation',
      story: 'Dino Cremonese graduated from UBC with degrees in Applied Science (1972) and Law (1979). His career in exploration began with the discovery of the "Dino" vein in 1979, which would set the course for a distinguished career in mineral exploration.',
      highlight: 'UBC Graduate • Law & Engineering Background'
    },
    {
      image: '/images/dino3.jpeg',
      title: 'The Research Method',
      subtitle: '1980s - Systematic Approach',
      story: 'Dino\'s methodical approach combined extensive library research with systematic field work. He would spend countless hours reading geological reports, government publications, and even old newspaper archives to identify promising exploration targets.',
      highlight: 'Library Research • Strategic Property Staking'
    },
    {
      image: '/images/dino4.jpeg',
      title: 'Major Discoveries',
      subtitle: '1984-1989 - Game Changers',
      story: 'The Treaty Creek discovery in 1984-1985 started with a simple silt sample at Treaty Glacier showing 0.51 g/t gold. This would eventually become a 23.37 million ounce gold equivalent resource. Red Mountain followed in 1988-1989 with similar methodology.',
      highlight: '23.37M oz AuEq Treaty Creek • 783K oz Red Mountain'
    },
    {
      image: '/images/dino2.jpeg',
      title: 'Current Focus',
      subtitle: '2025 - Ram Drilling Program',
      story: 'Today, Dino continues applying his proven methodology at the Ram property, adjacent to Red Mountain. With 1,000m of drilling completed on the Malachite Porphyry and Mitch zones, early core observations show promising mineralization patterns.',
      highlight: '1,000m Drilled • Malachite & Mitch Zones'
    }
  ]

  const activeStory = photoStories[activePhotoIndex]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, 
          rgba(255, 190, 152, 0.9) 0%, 
          rgba(255, 190, 152, 0.8) 30%,
          rgba(254, 217, 146, 0.7) 70%,
          rgba(255, 190, 152, 0.85) 100%)`,
        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: `
          0 12px 48px 0 rgba(31, 38, 135, 0.2),
          0 8px 24px 0 rgba(255, 190, 152, 0.4),
          inset 0 3px 6px 0 rgba(255, 255, 255, 0.4),
          inset 0 -2px 4px 0 rgba(0, 0, 0, 0.15)
        `,
        borderRadius: '16px'
      }}
    >
      <div style={{ padding: `clamp(1.5rem, 4vw, 3rem)` }}>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center"
            style={{ 
              fontFamily: "Aeonik Extended, sans-serif", 
              fontWeight: 500,
              color: palette.dark,
              marginBottom: `clamp(1.5rem, 3vw, 2rem)`
            }}>
          Dino Cremonese, Silver Grail's President since 1986
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden" 
                 style={{
                   background: 'linear-gradient(135deg, rgba(200, 200, 210, 0.95) 0%, rgba(220, 225, 230, 0.9) 50%, rgba(190, 195, 205, 0.95) 100%)',
                   backdropFilter: 'blur(20px) saturate(120%)',
                   WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                   border: '1px solid rgba(180, 185, 195, 0.6)',
                   boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3), inset 0 2px 4px 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)'
                 }}>
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover object-center"
                style={{
                  filter: 'sepia(10%) contrast(110%) brightness(105%)',
                  objectPosition: 'center top'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6">
                <div 
                  className="p-4 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    border: '1px solid rgba(12, 14, 29, 0.6)'
                  }}
                >
                  <h3 className="text-xl font-bold mb-1 text-white"
                      style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                    {activeStory.title}
                  </h3>
                  <p className="text-sm font-medium"
                     style={{ 
                       fontFamily: "Aeonik Extended, sans-serif",
                       color: palette.yellow
                     }}>
                    {activeStory.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 gap-3">
              {photoStories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePhotoIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activePhotoIndex
                      ? 'scale-125'
                      : 'hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: index === activePhotoIndex ? palette.yellow : 'rgba(255, 255, 255, 0.3)'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="relative">
            <div className="space-y-6">
              {/* Highlight Badge */}
              <div
                className="inline-block px-4 py-2 rounded-full text-sm font-medium"
                style={{ 
                  fontFamily: "Aeonik Extended, sans-serif",
                  background: `linear-gradient(135deg, 
                    rgba(255, 190, 152, 0.9) 0%, 
                    rgba(255, 190, 152, 0.8) 30%,
                    rgba(254, 217, 146, 0.7) 70%,
                    rgba(255, 190, 152, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: palette.dark
                }}
              >
                {activeStory.highlight}
              </div>

              {/* Title */}
              <h3
                className="text-2xl md:text-3xl font-semibold"
                style={{ 
                  fontFamily: "Aeonik Extended, sans-serif",
                  color: palette.dark,
                  fontWeight: 500
                }}
              >
                {activeStory.title}
              </h3>

              {/* Story Text */}
              <p
                className="leading-relaxed text-base md:text-lg"
                style={{ 
                  fontFamily: "Aeonik, sans-serif",
                  fontSize: 'clamp(0.95rem, 1.5vw, 1rem)',
                  color: `${palette.dark}CC`
                }}
              >
                {activeStory.story}
              </p>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setActivePhotoIndex((prev) => 
                    prev === 0 ? photoStories.length - 1 : prev - 1
                  )}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 190, 152, 0.9) 0%, 
                      rgba(255, 190, 152, 0.8) 30%,
                      rgba(254, 217, 146, 0.7) 70%,
                      rgba(255, 190, 152, 0.85) 100%)`,
                    backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: palette.dark
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>Previous</span>
                </button>
                
                <button
                  onClick={() => setActivePhotoIndex((prev) => 
                    (prev + 1) % photoStories.length
                  )}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, 
                      rgba(255, 190, 152, 0.9) 0%, 
                      rgba(255, 190, 152, 0.8) 30%,
                      rgba(254, 217, 146, 0.7) 70%,
                      rgba(255, 190, 152, 0.85) 100%)`,
                    backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                    WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: palette.dark
                  }}
                >
                  <span className="text-sm" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full rounded-full h-2 overflow-hidden"
             style={{ 
               background: 'rgba(255, 255, 255, 0.2)',
               backdropFilter: 'blur(10px)'
             }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${((activePhotoIndex + 1) / photoStories.length) * 100}%`,
              background: `linear-gradient(90deg, ${palette.yellow}, ${palette.peach})`
            }}
          />
        </div>
      </div>
    </motion.div>
  )
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Dino Cremonese, P.Eng, LL.B',
    role: 'President & CEO, Director',
    bio: 'Director of the Company since 1980, President since 1986. Currently also CEO. Dino graduated from the University of British Columbia with a Bachelor of Applied Science degree in 1972 and a Bachelor of Laws degree in 1979. He has devoted 38 years of his life to grass roots exploration of the prolific Stewart-Eskay Creek region of northwestern British Columbia, Canada.',
    image: '/images/dinonew.png',
    email: 'dino@teuton.com',
    linkedin: 'https://linkedin.com/in/dinocremonese',
    experience: '45+ years'
  },
  {
    id: '2',
    name: 'Barry Holmes, MBA',
    role: 'Director',
    bio: 'Mr. Holmes spent 32 years as a commercial helicopter pilot and a further 7 years as a senior manager with Canada\'s largest privately-owned helicopter charter operator. From 1985-87 Barry did a sabbatical as a stockbroker with a major Vancouver brokerage firm that specialized in resource exploration financing. During his aviation career he was involved with numerous Golden Triangle explorers including major projects such as: Pretium Resources; Treaty Creek; Galore Creek; Schaft Creek; Granduc; Johnny Mountain; Snip Mine; Red Mountain; and Seabridge Gold.',
    image: '/images/barrynew.png',
    email: 'bholmesmba@gmail.com',
    linkedin: 'https://ca.linkedin.com/in/barry-holmes-mba-42b25740',
    experience: '39+ years'
  },
  {
    id: '3',
    name: 'Alex Cremonese, B.Comm',
    role: 'Director',
    bio: 'Currently, Director--Provincial and LP Sales, The Valens Company. Previously, Manager, Business Development and Sourcing at Tilray, Inc.; Senior Account Executive at Yelp; Account Director, Turnstyle Solutions. Alexandra graduated from the University of Victoria with a B. Comm in 2013.',
    image: '/images/alexnew.png',
    email: 'alexcremonese@gmail.com',
    linkedin: 'https://au.linkedin.com/in/alex-cremonese-93004140',
    experience: '12+ years'
  },
  {
    id: '4',
    name: 'Robert Smiley, LL.B',
    role: 'Director',
    bio: 'Mr. Smiley is a business consultant working with junior companies. He has been self-employed in this capacity for the past twenty years. He is a former lawyer who specialized in oil and gas and securities law for twenty-five years. He is currently also a director of Sterling Ventures and Teuton Resources Corp. He has served on the boards of a number of junior and intermediate companies in the past.',
    image: '/images/placeholder-director.svg',
    email: '',
    experience: '45+ years'
  }
]

export default function AboutContent() {
  const [activeTab, setActiveTab] = useState('story')
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [barryExpanded, setBarryExpanded] = useState(false)
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const tabs = [
    { id: 'story', label: 'Our Story' },
    { id: 'team', label: 'Leadership Team' }
  ]

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-8 relative" 
         style={{ backgroundColor: palette.dark, isolation: 'isolate' }} 
         data-theme="dark">
      
      {/* Mountain Background Image */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Image
          src="/images/rambackground.png"
          alt="Mountain landscape"
          fill
          priority
          quality={90}
          className="object-cover"
          style={{ 
            filter: 'brightness(0.4) contrast(1.1)',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Aurora Gradient Overlay - 3 Layer System from RAM */}
      <div className="fixed inset-0 z-[1]" aria-hidden="true">
        <div className="relative w-full h-full">
          {/* Layer 1: Base gradient - balanced for star visibility */}
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(180deg, 
              rgba(3, 23, 48, 0.9) 0%, 
              rgba(3, 23, 48, 0.8) 15%,
              rgba(0, 106, 148, 0.3) 50%, 
              rgba(3, 23, 48, 0.7) 100%)`,
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} />
          
          {/* Layer 2: Gradient mesh */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              background: `
                radial-gradient(ellipse 80% 50% at 20% 0%, rgba(0, 106, 148, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse 60% 40% at 80% 0%, rgba(0, 106, 148, 0.3) 0%, transparent 40%),
                radial-gradient(ellipse 70% 60% at 50% 100%, rgba(3, 23, 48, 0.5) 0%, transparent 50%)
              `,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }} 
          />
          
          {/* Layer 3: Static glow */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{ 
              background: `radial-gradient(ellipse at top, rgba(0, 106, 148, 0.3) 0%, transparent 60%)`,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }} 
          />
        </div>
      </div>
      
      {/* Subtle gold dust particles effect */}
      <GoldDustParticles />
    
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Page Header with Kinetic Typography */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="animated-gradient-text mb-4 md:mb-6 block"
              style={{ 
                fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif", 
                fontWeight: 500,
                fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : 'clamp(3rem, 4vw, 4rem)',
                lineHeight: '1.1',
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 8s ease infinite'
              }}>
              About Silver Grail
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto overflow-hidden px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 400 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradient-shift 8s ease infinite',
                opacity: 0.9
              }}
            >
              Pioneering mineral exploration in BC's Golden Triangle
            </motion.p>
          </div>
        </motion.div>

        {/* Premium Tab Navigation - RAM Exploration Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex gap-4 justify-center flex-wrap">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
                style={{
                  display: 'inline-flex',
                  padding: 0,
                  border: 'none',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'transparent',
                  boxShadow: activeTab === tab.id ? `
                    0 10px 40px rgba(229, 229, 229, 0.3),
                    0 2px 10px rgba(0, 0, 0, 0.5),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  ` : `
                    0 5px 20px rgba(229, 229, 229, 0.1),
                    0 2px 8px rgba(0, 0, 0, 0.3)
                  `
                }}
              >
                {/* Animated border gradient for active tab */}
                {activeTab === tab.id && (
                  <motion.div 
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{
                      duration: 3,
                      ease: "linear",
                      repeat: Infinity
                    }}
                    style={{
                      position: 'absolute',
                      inset: '-2px',
                      background: `linear-gradient(90deg, ${palette.peach}, ${palette.yellow}, ${palette.peach})`,
                      backgroundSize: '200% 100%',
                      borderRadius: '16px',
                      opacity: 0.6,
                      zIndex: 0
                    }} 
                  />
                )}
                
                {/* Main Content Container */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: activeTab === tab.id 
                    ? `linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)`
                    : 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  borderRadius: '14px',
                  padding: isMobile ? '0.875rem 1.5rem' : '1rem 2rem',
                  position: 'relative',
                  zIndex: 1,
                  border: activeTab === tab.id ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(12, 14, 29, 0.6)'
                }}>
                  <span style={{
                    color: activeTab === tab.id ? palette.dark : 'rgba(255, 255, 255, 0.7)',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: activeTab === tab.id ? 500 : 400,
                    fontSize: isMobile ? '0.875rem' : '1rem',
                    letterSpacing: '0.025em',
                    whiteSpace: 'nowrap',
                    textAlign: 'center'
                  }}>
                    {tab.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'story' && (
              <div className="space-y-8">
                {/* Interactive Photo Story */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="glassmorphic-card-dark mb-8"
                >
                  <PhotoStorySection />
                </motion.div>

                {/* Chapter-Based Story Navigation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glassmorphic-card-dark mb-8"
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-6"
                      style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                    Our Story: A Legacy of Discovery
                  </h2>
                  
                  {/* Story Chapters */}
                  <div className="space-y-6">
                    {/* Chapter 1: The Beginning */}
                    <motion.div 
                      className="border border-white/20 rounded-xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                               border: '1px solid rgba(255, 255, 255, 0.4)'
                             }}>
                          <span className="text-[#0d0f1e] font-bold text-lg" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>1</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0d0f1e] font-semibold text-lg mb-3"
                              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            The Beginning (1979)
                          </h3>
                          <p className="text-[#0d0f1e]/80 leading-relaxed text-sm md:text-base"
                             style={{ fontFamily: "Aeonik, sans-serif" }}>
                            The beginning was 1979 when I found the "Dino" vein for Cusac Industries in the Cassiar region. That vein was small but very rich, the first sample ran 80 oz/ton gold over two feet—Cusac stock subsequently rose from $0.20 to over $10.00 a share. After that I was hooked on prospecting, but I didn't want to work for anyone, I wanted to find things on my own.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chapter 2: The Method */}
                    <motion.div 
                      className="border border-white/20 rounded-xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                               border: '1px solid rgba(255, 255, 255, 0.4)'
                             }}>
                          <span className="text-[#0d0f1e] font-bold text-lg" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>2</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0d0f1e] font-semibold text-lg mb-3"
                              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            The Method
                          </h3>
                          <p className="text-[#0d0f1e]/80 leading-relaxed text-sm md:text-base"
                             style={{ fontFamily: "Aeonik, sans-serif" }}>
                            The first thing I did was extensive "research", lots of it. I went to the library and read everything: geological reports, government publications, periodicals, maps, even microfiche copies of old newspapers. That told me where to look. Then I went out in the field and staked some properties based on what I had read. Two of the properties became major gold discoveries.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chapter 3: Treaty Creek Discovery */}
                    <motion.div 
                      className="border border-white/20 rounded-xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                               border: '1px solid rgba(255, 255, 255, 0.4)'
                             }}>
                          <span className="text-[#0d0f1e] font-bold text-lg" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>3</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0d0f1e] font-semibold text-lg mb-3"
                              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            Treaty Creek Discovery (1984-1985)<br/>
                            <span className="text-[#E5E5E5] font-medium">23.37 Million Ounces AuEq</span>
                          </h3>
                          <p className="text-[#0d0f1e]/80 leading-relaxed text-sm md:text-base"
                             style={{ fontFamily: "Aeonik, sans-serif" }}>
                            Exploration always started with taking stream sediment (silt) samples. Back in 1984-1985 at Treaty Creek (70 km north of Stewart, BC) the first thing I did after staking was the collection of a large silt sample at the base of Treaty Glacier. It ran 0.51 g/t gold, a very anomalous result suggesting a gold source up-glacier. It took a while before we got any kind of gold values in rocks to explain that highly anomalous silt sample—the property was farmed-out five different times—but it eventually happened. In 2016, the property was joint ventured to Tudor Gold, headed by Walter Storm. In 2019 he hired Ken Konkin, award-winning geologist, to head up his program. In 2023 a third resource estimate was published by Tudor Gold showing an Indicated Mineral Resource of 23.37 million ounces (Moz) of gold equivalent (AuEq)—considered one of the largest gold discoveries in the world during the last ten years.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chapter 4: Red Mountain Success */}
                    <motion.div 
                      className="border border-white/20 rounded-xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                               border: '1px solid rgba(255, 255, 255, 0.4)'
                             }}>
                          <span className="text-[#0d0f1e] font-bold text-lg" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>4</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0d0f1e] font-semibold text-lg mb-3"
                              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            Red Mountain Discovery (1988-1989)<br/>
                            <span className="text-[#E5E5E5] font-medium">783,000 Ounces Gold</span>
                          </h3>
                          <p className="text-[#0d0f1e]/80 leading-relaxed text-sm md:text-base"
                             style={{ fontFamily: "Aeonik, sans-serif" }}>
                            A similar thing happened at Red Mountain, 15 km east of Stewart. I staked that property in 1988 and then took a number of samples from a creek draining a large gossan at higher elevation. The samples all registered very high values in gold, silver, copper and zinc, suggesting a large mineralized source upstream. That source was discovered next year in 1989 and now, 36 years and over $60 million later, Red Mountain is awaiting a start-up decision from owner Ascot Resources. The deposit received provincial and federal approval for production in 2019 and has a measured and indicated resource of 783,000 ounces gold. It is smaller than Treaty Creek but higher in grade.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chapter 5: Evolution of Strategy */}
                    <motion.div 
                      className="border border-white/20 rounded-xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                               border: '1px solid rgba(255, 255, 255, 0.4)'
                             }}>
                          <span className="text-[#0d0f1e] font-bold text-lg" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>5</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0d0f1e] font-semibold text-lg mb-3"
                              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            Current Focus: Ram Drilling (2025)<br/>
                            <span className="text-[#E5E5E5] font-medium">1,000m Drilled</span>
                          </h3>
                          <p className="text-[#0d0f1e]/80 leading-relaxed text-sm md:text-base"
                             style={{ fontFamily: "Aeonik, sans-serif" }}>
                            Serendipitously, I am now back in the Red Mountain area drilling a property that adjoins directly south called the "Ram", jointly owned by Silver Grail and sister company Teuton Resources. As of late August, 2025 we have drilled close to 1,000m on the Malachite Porphyry and Mitch zones which have features of both porphyry deposits and VMS deposits. Earlier surface sampling showed good grades in copper and gold and one could say there are definite similarities to the situation at Red Mountain itself.<br/><br/>
                            Although we have no assay data yet, early indications from observing core are that the two Malachite Porphyry holes drilled to date both have pyrite and pyrrhotite mineralization occurring in numerous quartz veinlets in zones which sometimes have red sphalerite on their boundaries. The two Mitch zone holes have abundant massive sulfide intervals consistent with, and occasionally stronger than, what has been observed on surface.
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Chapter 6: Current Focus - Ram Property */}
                    <motion.div 
                      className="border border-white/20 rounded-xl p-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                             style={{
                               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.2) 100%)',
                               border: '1px solid rgba(255, 255, 255, 0.4)'
                             }}>
                          <span className="text-[#0d0f1e] font-bold text-lg" style={{ fontFamily: "Aeonik Extended, sans-serif" }}>6</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#0d0f1e] font-semibold text-lg mb-3"
                              style={{ fontFamily: "Aeonik Extended, sans-serif" }}>
                            The Golden Triangle Portfolio<br/>
                            <span className="text-[#E5E5E5] font-medium">Strategic Red Line Positioning</span>
                          </h3>
                          <p className="text-[#0d0f1e]/80 leading-relaxed text-sm md:text-base"
                             style={{ fontFamily: "Aeonik, sans-serif" }}>
                            Our many other properties in the Golden Triangle region have a variety of mineralized zones all of which contain significant potential. On the Konkin Silver, for instance, a number of high-grade silver intervals were trenched in previous years, several of which will soon be revisited because of the recent increases in the price of silver. Perhaps the most promising is the Clone property situated west of the Ram. A new area on this property has been explored during the last two years revealing a number of high-grade, gold-bearing cross structures occurring within a wide area containing anomalous copper rock geochemical samples. Both the Ram and the Clone (as well as the Golddigger zones) are all found in close proximity to the "Red Line", a contact zone between Triassic and Jurassic age rocks which has been shown to be an important marker for large-scale porphyry deposits in the Golden Triangle.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Signature Section */}
                  <motion.div 
                    className="mt-8 border border-white/20 rounded-xl p-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                      backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                      WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                      boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="text-center">
                      <p className="text-[#0d0f1e]/90 text-lg mb-2" style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                        Dino Cremonese, P.Eng
                      </p>
                      <p className="text-[#0d0f1e]/70 text-sm mb-4" style={{ fontFamily: "Aeonik, sans-serif" }}>
                        President & CEO, Silver Grail Resources
                      </p>
                      <div className="text-[#0d0f1e]/50 text-xs italic" style={{ fontFamily: "Aeonik, sans-serif" }}>
                        Dino Cremonese
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Footnote */}
                  <div className="mt-6 text-center">
                    <p className="text-white/40 text-xs" style={{ fontFamily: "Aeonik, sans-serif" }}>
                      <sup>1</sup>AuEq g/t = Au g/t + (Ag g/t*0.0098765) + (Cu ppm*0.0001185)
                    </p>
                  </div>
                </motion.div>

              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-8">
                {/* Team Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative"
                      style={{
                        position: 'relative',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        background: 'transparent',
                        boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)',
                        minHeight: '450px'
                      }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Animated border gradient */}
                      <motion.div 
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                        }}
                        transition={{
                          duration: 4,
                          ease: "linear",
                          repeat: Infinity
                        }}
                        style={{
                          position: 'absolute',
                          inset: '-2px',
                          background: `linear-gradient(90deg, ${palette.peach}, ${palette.yellow}, ${palette.light}, ${palette.yellow}, ${palette.peach})`,
                          backgroundSize: '200% 100%',
                          borderRadius: '16px',
                          opacity: 0.3,
                          zIndex: 0
                        }} 
                      />
                      
                      {/* Main Content Container */}
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.9) 0%, rgba(255, 190, 152, 0.8) 30%, rgba(254, 217, 146, 0.7) 70%, rgba(255, 190, 152, 0.85) 100%)',
                        backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 1,
                        padding: '0',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        {/* Member Photo */}
                        <div className="relative overflow-hidden h-64">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            style={{
                              filter: 'contrast(105%) brightness(105%)',
                              objectPosition: 'center 20%',
                              transform: 'scale(1.1)',
                              transformOrigin: 'center center'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          
                          {/* Member Basic Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-semibold text-lg mb-1 transition-all duration-300"
                                style={{ 
                                  fontFamily: "'Aeonik Extended', sans-serif", 
                                  fontWeight: 600,
                                  fontSize: '1.1rem',
                                  lineHeight: '1.2',
                                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                                  color: '#ffffff'
                                }}>
                              {member.name.split(',')[0]} {/* Show just the name part before comma */}
                            </h3>
                            <p className="text-sm font-medium"
                               style={{ 
                                 fontFamily: "'Aeonik Extended', sans-serif",
                                 textShadow: '0 1px 4px rgba(0, 0, 0, 0.8)',
                                 color: 'rgba(255, 255, 255, 0.9)'
                               }}>
                              {member.role}
                            </p>
                          </div>
                        </div>
                        
                        {/* Content Section */}
                        <div className="flex-grow p-6 flex flex-col">
                          {/* Credentials */}
                          {member.name.includes(',') && (
                            <div className="mb-3">
                              <span className="text-xs font-medium px-2 py-1 rounded-full"
                                    style={{ 
                                      fontFamily: "'Aeonik Extended', sans-serif",
                                      background: 'rgba(13, 15, 30, 0.2)',
                                      border: '1px solid rgba(13, 15, 30, 0.3)',
                                      color: palette.dark
                                    }}>
                                {member.name.split(',').slice(1).join(',').trim()}
                              </span>
                            </div>
                          )}
                          
                          {/* Bio Preview/Full */}
                          <div className="flex-grow">
                            {member.id === '2' ? (
                              <p className="text-sm mb-4 transition-all duration-300"
                                 style={{ fontFamily: "Aeonik, sans-serif", lineHeight: 1.6, color: palette.dark, minHeight: '120px' }}>
                                {barryExpanded ? member.bio : (
                                  <>
                                    {member.bio.substring(0, 275)}
                                    <span>...</span>
                                    <button
                                      onClick={() => setBarryExpanded(true)}
                                      className="ml-1 text-xs font-medium transition-all duration-300 hover:opacity-70"
                                      style={{ 
                                        fontFamily: "'Aeonik Extended', sans-serif",
                                        color: palette.blue,
                                        textDecoration: 'underline',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Read More
                                    </button>
                                  </>
                                )}
                                {barryExpanded && (
                                  <button
                                    onClick={() => setBarryExpanded(false)}
                                    className="ml-1 text-xs font-medium transition-all duration-300 hover:opacity-70"
                                    style={{ 
                                      fontFamily: "'Aeonik Extended', sans-serif",
                                      color: palette.blue,
                                      textDecoration: 'underline',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Show Less
                                  </button>
                                )}
                              </p>
                            ) : (
                              <p className="text-sm mb-4 transition-all duration-300"
                                 style={{ fontFamily: "Aeonik, sans-serif", lineHeight: 1.6, color: palette.dark, minHeight: '120px' }}>
                                {member.bio}
                              </p>
                            )}
                          </div>
                          
                          {/* Contact Info */}
                          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'rgba(13, 15, 30, 0.2)' }}>
                            {member.email && (
                              <a 
                                href={`mailto:${member.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                                style={{ color: 'rgba(13, 15, 30, 0.7)' }}
                              >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(13, 15, 30, 0.1)' }}>
                                  <FiMail className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium" style={{ fontFamily: "'Aeonik Extended', sans-serif" }}>Email</span>
                              </a>
                            )}
                            {member.linkedin && (
                              <a 
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
                              style={{ color: 'rgba(13, 15, 30, 0.7)' }}
                              >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300" style={{ background: 'rgba(13, 15, 30, 0.1)' }}>
                                  <FiLinkedin className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-medium" style={{ fontFamily: "'Aeonik Extended', sans-serif" }}>LinkedIn</span>
                              </a>
                            )}
                          </div>
                        </div>
                        
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animated-gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 8s ease infinite;
        }
        
        .glassmorphic-card-dark {
          background: linear-gradient(
            135deg,
            rgba(12, 14, 29, 0.7) 0%,
            rgba(12, 14, 29, 0.85) 50%,
            rgba(12, 14, 29, 0.7) 100%
          );
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(12, 14, 29, 0.6);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        @media (min-width: 768px) {
          .glassmorphic-card-dark {
            border-radius: 22px;
            padding: 24px;
          }
        }
        
        .glassmorphic-card-dark:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 12px 32px 0 rgba(0, 0, 0, 0.6);
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
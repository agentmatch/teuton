'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

interface PropertyData {
  name: string
  slug: string
  hectares: string
  type: string
  description: string
  highlights: string[]
  coordinates: [number, number] // Longitude, Latitude for property location
}

const SILVER_GRAIL_PROPERTIES: PropertyData[] = [
  {
    name: 'FIJI',
    slug: 'fiji',
    hectares: '2,500',
    type: '',
    description: 'Prospecting by Silver Grail-Teuton personnel in 2006 on the Fiji identified two promising zones of high-grade, gold-bearing mineralization in an area lying just west, along regional trend, of the common border with Dolly Varden Silver\'s Homestake Ridge property.',
    highlights: [],
    coordinates: [-130.22, 56.35]
  },
  {
    name: 'TONGA',
    slug: 'tonga',
    hectares: '1,800',
    type: '',
    description: 'Staked in the 1980\'s because of highly anomalous silver stream geochemistry. High-grade silver and gold bearing float discovered in streams. Situated between Dolly Varden Silver\'s Kombi gold-silver target and Goliath Resources\' Gold Swarm showing.',
    highlights: [],
    coordinates: [-130.28, 56.40]
  },
  {
    name: 'RAM',
    slug: 'ram',
    hectares: '3,200',
    type: '',
    description: 'Currently drilling targets focusing on newly discovered porphyry copper-gold and VMS mineralized zones. Strategic location within the active southern Golden Triangle, surrounded by Goliath Resources\' expanded claim block.',
    highlights: [],
    coordinates: [-129.8, 56.1] // RAM property coordinates
  },
  {
    name: 'CLONE',
    slug: 'clone',
    hectares: '2,100',
    type: '',
    description: 'Two zones of interest occur on the property. The first, the Main zone, features of a number of very high-grade gold and gold-cobalt bearing shear zones (100 tons grading 4.0 oz/ton gold was bulk sampled here). In recent years focus has changed to a southwest zone which appears to lie above a reduced porphyry system, the upper portions of which are anomalous in copper, molybdenum, tungsten, bismuth and gold. This latter area is transected by Kyba\'s "Red Line".',
    highlights: [],
    coordinates: [-130.31, 56.48]
  },
  {
    name: 'KONKIN SILVER',
    slug: 'konkin-silver',
    hectares: '4,500',
    type: '',
    description: 'Ross Sherlock, Ph.D. geologist, reported that the Konkin Silver showing, with high grade silver in massive baritic zones, had similar geology to the Eskay Creek precious metal rich VMS deposit.',
    highlights: [],
    coordinates: [-130.25, 56.42]
  },
  {
    name: 'MIDAS',
    slug: 'midas',
    hectares: '1,900',
    type: '',
    description: 'The Midas property lies along a favourable contact zone, south of the Del Norte property of Teuton Resources which hosts the high-grade gold and silver bearing "LG" vein along the same horizon. Two prominent airborne VTEM anomalies remain to be tested on this property.',
    highlights: [],
    coordinates: [-130.12, 56.38]
  },
  {
    name: 'GOLD MOUNTAIN',
    slug: 'gold-mountain',
    hectares: '2,400',
    type: '',
    description: 'Quartz calcite veinlets occurring over a 200 by 300m area carry gold values from a few ppb to 0.632oz/ton. The property adjoins Ascot Resources\' Red Mountain property to the southeast where gold and gold tellurides are found in various deposits such as the Marc zone (average grade 11.5 g/t gold).',
    highlights: [],
    coordinates: [-130.15, 56.45]
  }
]


// New color palette
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}

export default function PropertiesPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Set dark theme for header
  useEffect(() => {
    document.documentElement.setAttribute('data-header-theme', 'dark')
    return () => {
      document.documentElement.removeAttribute('data-header-theme')
    }
  }, [])


  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-20" 
         style={{ backgroundColor: palette.dark, isolation: 'isolate' }} 
         data-theme="dark">
      
      {/* Mountain landscape background */}
      <div className="fixed inset-0 z-0" aria-hidden="true" 
           style={{ 
             willChange: 'transform',
             transform: 'translateZ(0)',
             backfaceVisibility: 'hidden'
           }}>
        <Image 
          src="/images/rambackground.png"
          alt="Mountain landscape"
          fill
          priority
          quality={90}
          style={{ 
            objectFit: 'cover',
            objectPosition: 'center',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
        {/* Animated aurora gradient overlay - 2024/2025 trend */}
        <div className="absolute inset-0 overflow-hidden"
             style={{ 
               willChange: 'transform',
               transform: 'translateZ(0)'
             }}>
          {/* Layer 1: Base gradient - balanced for star visibility */}
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(180deg, 
              rgba(3, 23, 48, 0.8) 0%, 
              rgba(3, 23, 48, 0.65) 15%,
              rgba(0, 106, 148, 0.3) 50%, 
              rgba(3, 23, 48, 0.7) 100%)`,
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} />
          
          {/* Layer 2: Static gradient mesh */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              background: `radial-gradient(circle at 20% 50%, rgba(0, 106, 148, 0.4) 0%, transparent 50%),
                          radial-gradient(circle at 80% 50%, rgba(3, 23, 48, 0.6) 0%, transparent 50%),
                          radial-gradient(circle at 50% 30%, rgba(0, 106, 148, 0.3) 0%, transparent 40%)`,
              filter: 'blur(40px)',
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
      {/* <BackgroundMap /> */}
      <GoldDustParticles />
      
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ y: 100, opacity: 0, filter: 'blur(20px)' }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              filter: 'blur(0px)',
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              filter: { duration: 1.2 }
            }}
            className="text-white mb-4 md:mb-6 relative"
            style={{ 
              fontFamily: "'Aeonik Extended', sans-serif", 
              fontWeight: 500,
              fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : '4rem',
              lineHeight: '1.1',
              // Gradient text with subtle animation
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 8s ease infinite',
              // Subtle text shadow for depth
              filter: 'drop-shadow(0 2px 20px rgba(160, 196, 255, 0.3))',
              // Mix blend mode for interesting interactions
              mixBlendMode: 'screen',
            }}>
            Our Properties
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                // Matching gradient text like the heading
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 10s ease infinite',
                letterSpacing: '0.02em',
              }}
            >
              Seven strategic exploration properties covering<br />18,400 hectares in British Columbia's Golden Triangle
            </motion.p>
          </div>
        </motion.div>

        {/* Properties Grid - Top Row (3 properties) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mb-8"
          style={{ 
            willChange: 'opacity',
            transform: 'translateZ(0)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* First 3 properties + RAM (spanning 2 cols) = 4 total columns */}
            {SILVER_GRAIL_PROPERTIES.slice(0, 2).map((property, index) => (
              <PropertyCard key={property.slug} property={property} index={index} isMobile={isMobile} hoveredProperty={hoveredProperty} setHoveredProperty={setHoveredProperty} palette={palette} />
            ))}
            
            {/* RAM Property - Featured (spans 2 columns) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              onMouseEnter={() => setHoveredProperty('RAM')}
              onMouseLeave={() => setHoveredProperty(null)}
              className="group xl:col-span-2 lg:col-span-2 md:col-span-2"
              style={{ 
                willChange: 'opacity, transform',
                transform: 'translateZ(0)'
              }}
            >
              <Link href="/properties/ram">
                <div className="relative h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col"
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
                       borderRadius: '16px',
                       minHeight: '480px',
                       position: 'relative',
                       overflow: 'hidden'
                     }}>
                  
                  {/* Glass reflection overlay */}
                  <div 
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      background: `linear-gradient(105deg, 
                        transparent 40%, 
                        rgba(255, 255, 255, 0.25) 45%, 
                        rgba(255, 255, 255, 0.15) 50%, 
                        transparent 55%)`,
                      transform: hoveredProperty === 'RAM' ? 'translateX(100%)' : 'translateX(-100%)',
                      transition: 'transform 1s ease-out'
                    }}
                  />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                         style={{ 
                           fontFamily: "'Aeonik Extended', sans-serif",
                           background: palette.yellow,
                           color: palette.dark
                         }}>
                      ACTIVE DRILLING
                    </div>
                  </div>
                  
                  {/* Header Section */}
                  <div className="relative w-full px-6 pt-8 pb-6 text-center">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full" 
                 style={{ background: `linear-gradient(135deg, ${palette.peach}60, ${palette.yellow}40)` }} />
                    
                    <h3 className="mb-6 transform transition-all duration-300"
                        style={{ 
                          fontFamily: "'Aeonik Extended', sans-serif", 
                          fontWeight: 600,
                          fontSize: isMobile ? 'clamp(1.5rem, 4vw, 2rem)' : '2.2rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          lineHeight: '1.2',
                          color: palette.dark
                        }}>
                      RAM
                    </h3>
                    
                    <div className="mt-6 mb-4 h-[1px] w-full" style={{ background: `linear-gradient(to right, transparent, ${palette.dark}30, transparent)` }} />
                  </div>

                  {/* Content Section */}
                  <div className="flex-grow px-6 flex flex-col">
                    <div className="flex-1 mb-6">
                      <motion.p 
                         className="relative overflow-hidden"
                         initial={{ opacity: 0.85 }}
                         whileHover={{ opacity: 1 }}
                         transition={{ duration: 0.3 }}
                         style={{ 
                           color: palette.dark, 
                           fontFamily: "Aeonik, sans-serif", 
                           lineHeight: '1.5',
                           fontSize: '0.95rem' // 15% increase from text-sm
                         }}>
                        Currently drilling targets focusing on newly discovered porphyry copper-gold and VMS mineralized zones. 
                        Strategic location within the active southern Golden Triangle, surrounded by Goliath Resources' expanded claim block.
                      </motion.p>
                    </div>

                    {/* Property Image - Full Width */}
                    <div className="relative -mx-6 overflow-hidden">
                      <div className="relative w-full h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50">
                        <img 
                          src="/images/ram-sky.jpg" 
                          alt="RAM Property Aerial View"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          style={{ objectPosition: 'bottom right' }}
                          onError={(e) => {
                            console.error('Failed to load RAM sky image:', e);
                            // Hide the image container if it fails to load
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Button */}
                  <div className="mt-auto" style={{ borderTop: `1px solid ${palette.dark}20` }}>
                    <button className="w-full py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300" 
                    style={{ 
                      color: palette.yellow,
                      background: palette.dark
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textShadow = '0 0 20px rgba(254, 217, 146, 0.8), 0 0 40px rgba(254, 217, 146, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = 'none'
                    }}>
                      <span style={{ 
                        fontFamily: "Aeonik Extended, sans-serif", 
                        fontWeight: 400,
                        fontSize: '0.875rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}>
                        View Property
                      </span>
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" 
                           fill="none" 
                           stroke="currentColor" 
                           viewBox="0 0 24 24">
                        <path strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={1.5} 
                              d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Properties Grid - Bottom Row (4 properties) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SILVER_GRAIL_PROPERTIES.filter((_, i) => i !== 2).slice(2).map((property, index) => (
              <PropertyCard key={property.slug} property={property} index={index + 3} isMobile={isMobile} hoveredProperty={hoveredProperty} setHoveredProperty={setHoveredProperty} palette={palette} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Extracted PropertyCard component for reuse
function PropertyCard({ property, index, isMobile, hoveredProperty, setHoveredProperty, palette }: {
  property: PropertyData,
  index: number,
  isMobile: boolean,
  hoveredProperty: string | null,
  setHoveredProperty: (name: string | null) => void,
  palette: {
    dark: string,
    blue: string,
    light: string,
    peach: string,
    yellow: string
  }
}) {
  return (
    <motion.div
      key={property.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      onMouseEnter={() => {
        setHoveredProperty(property.name)
      }}
      onMouseLeave={() => {
        setHoveredProperty(null)
      }}
      className="group"
      style={{ 
        willChange: 'opacity, transform',
        transform: 'translateZ(0)'
      }}
    >
      <Link href={`/properties/${property.slug}`}>
        <div className="relative h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02] flex flex-col"
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
               borderRadius: '16px',
               minHeight: '480px',
               position: 'relative',
               overflow: 'hidden'
             }}>
          
          {/* Glass reflection overlay */}
          <div 
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, 
                transparent 40%, 
                rgba(255, 255, 255, 0.2) 45%, 
                rgba(255, 255, 255, 0.1) 50%, 
                transparent 55%)`,
              transform: hoveredProperty === property.name ? 'translateX(100%)' : 'translateX(-100%)',
              transition: 'transform 0.8s ease-out'
            }}
          />
          
          <div className="relative w-full px-6 pt-8 pb-6 text-center">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full" 
                 style={{ background: `linear-gradient(135deg, ${palette.peach}60, ${palette.yellow}40)` }} />
            
            <motion.h3 
                className="mb-6 transform transition-all duration-300 relative"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 5px 15px rgba(0,0,0,0.3)"
                }}
                style={{ 
                  fontFamily: "'Aeonik Extended', sans-serif", 
                  fontWeight: 600,
                  fontSize: isMobile ? 'clamp(1.3rem, 3.5vw, 1.6rem)' : '1.75rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  lineHeight: '1.2',
                  color: palette.dark,
                  // Variable font weight on hover
                  fontVariationSettings: hoveredProperty === property.name ? '"wght" 700' : '"wght" 600',
                  transition: 'font-variation-settings 0.3s ease',
                }}>
              {property.name}
            </motion.h3>
            
            <div className="mt-6 mb-4 h-[1px] w-full" style={{ background: `linear-gradient(to right, transparent, ${palette.dark}30, transparent)` }} />
          </div>

          <div className="flex-grow px-6 pb-6 flex flex-col">
            <div className="flex-grow flex items-start">
              <motion.p 
                className="relative overflow-hidden"
                initial={{ opacity: 0.85 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  color: palette.dark, 
                  fontFamily: "Aeonik, sans-serif", 
                  lineHeight: '1.5',
                  fontSize: '0.95rem', // 15% increase from 0.875rem (text-sm)
                }}>
                {property.description}
              </motion.p>
            </div>
          </div>

          <div className="mt-auto" style={{ borderTop: `1px solid ${palette.dark}20` }}>
            <button className="w-full py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300" 
                    style={{ 
                      color: palette.yellow,
                      background: palette.dark
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textShadow = '0 0 20px rgba(254, 217, 146, 0.8), 0 0 40px rgba(254, 217, 146, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = 'none'
                    }}>
              <span style={{ 
                fontFamily: "Aeonik Extended, sans-serif", 
                fontWeight: 400,
                fontSize: '0.875rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                View Property
              </span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" 
                   fill="none" 
                   stroke="currentColor" 
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
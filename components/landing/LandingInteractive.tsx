'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { FiMapPin, FiInfo } from 'react-icons/fi'

const properties = [
  { 
    id: 'tennyson', 
    name: 'Tennyson', 
    x: '20%', 
    y: '30%',
    minerals: 'Cu-Au porphyry',
    highlight: '0.89% Cu over 12.8m'
  },
  { 
    id: 'big-gold', 
    name: 'Big Gold', 
    x: '35%', 
    y: '25%',
    minerals: 'Au-Ag VMS',
    highlight: '90m @ 14.4 g/t Au'
  },
  { 
    id: '4js', 
    name: '4 J\'s', 
    x: '50%', 
    y: '40%',
    minerals: 'Cu-Au',
    highlight: 'Glacier retreat exposing new zones'
  },
  { 
    id: 'eskay-rift', 
    name: 'Eskay Rift', 
    x: '65%', 
    y: '20%',
    minerals: 'Au-Ag epithermal',
    highlight: 'Adjacent to Eskay Creek'
  },
  { 
    id: 'leduc', 
    name: 'Leduc', 
    x: '45%', 
    y: '60%',
    minerals: 'Cu-Mo porphyry',
    highlight: 'Large alteration system'
  },
  { 
    id: 'pearson', 
    name: 'Pearson', 
    x: '75%', 
    y: '50%',
    minerals: 'Cu-Au',
    highlight: 'Multiple targets identified'
  },
]

export default function LandingInteractive() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [activeProperty, setActiveProperty] = useState<typeof properties[0] | null>(null)

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-accent/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Strategic Property
            <span className="text-gradient-gold-blue"> Portfolio</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Six properties covering 20,481 hectares in the heart of the Golden Triangle
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Asymmetric positioning */}
          <div className="lg:mt-8">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative neumorphic-card p-8 min-h-[500px] overflow-hidden bg-accent/5 border border-accent/20"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-muted-foreground">
              <FiInfo className="w-4 h-4" />
              <span>Click properties to explore</span>
            </div>

            {/* Map container */}
            <div className="relative w-full h-full min-h-[400px]">
              {/* Background pattern to simulate map */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/5" />
              
              {/* Property markers */}
              {properties.map((property) => (
                <motion.button
                  key={property.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: property.x, top: property.y }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveProperty(property)}
                >
                  <div className={`
                    relative w-12 h-12 rounded-full flex items-center justify-center
                    ${activeProperty?.id === property.id 
                      ? 'bg-accent text-white pulse-accent' 
                      : 'neumorphic-button text-accent bg-accent/10 border border-accent/20'
                    }
                    group-hover:scale-110 transition-all duration-200
                  `}>
                    <FiMapPin className="w-6 h-6 bounce-hover" />
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium">
                    {property.name}
                  </span>
                </motion.button>
              ))}
              
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                  d="M 35% 25% Q 50% 35% 65% 20%"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-primary/20"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : {}}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </svg>
            </div>
          </motion.div>
          </div>

          {/* Property Details */}
          <div className="space-y-4 lg:mt-0">
            {activeProperty ? (
              <motion.div
                key={activeProperty.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="neumorphic-card border-l-4 border-accent bg-accent/5 border border-accent/20"
              >
                <h3 className="text-2xl font-bold mb-2">{activeProperty.name} Property</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Target Minerals:</span>
                    <p className="font-semibold text-accent">{activeProperty.minerals}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Key Highlight:</span>
                    <p className="font-semibold">{activeProperty.highlight}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="neumorphic-card text-center text-muted-foreground bg-accent/5 border border-accent/20">
                <FiMapPin className="w-12 h-12 mx-auto mb-3 text-accent/30" />
                <p>Select a property on the map to view details</p>
              </div>
            )}

            {/* Property grid */}
            <div className="grid grid-cols-2 gap-4">
              {properties.map((property, index) => (
                <motion.button
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveProperty(property)}
                  className={`
                    p-4 text-left transition-all duration-200 rounded-xl
                    ${activeProperty?.id === property.id 
                      ? 'bg-accent text-white neumorphic-inset' 
                      : 'neumorphic-button hover:text-accent ripple bg-accent/5 border border-accent/20'
                    }
                  `}
                >
                  <h4 className="font-semibold mb-1">{property.name}</h4>
                  <p className={`text-sm ${
                    activeProperty?.id === property.id 
                      ? 'text-black/70' 
                      : 'text-muted-foreground'
                  }`}>
                    {property.minerals}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
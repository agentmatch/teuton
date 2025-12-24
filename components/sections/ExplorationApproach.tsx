'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMap, FiLayers, FiActivity, FiTarget } from 'react-icons/fi'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const approaches = [
  {
    icon: FiMap,
    title: 'Advanced Geophysics',
    description: 'ZTEM surveys identifying deep conductors and untested anomalies across the property',
  },
  {
    icon: FiLayers,
    title: 'Systematic Exploration',
    description: 'Methodical approach targeting multiple deposit types in prospective geological settings',
  },
  {
    icon: FiActivity,
    title: 'Glacial Retreat Advantage',
    description: 'New exposures from retreating glaciers revealing previously hidden mineralization',
  },
  {
    icon: FiTarget,
    title: 'District-Scale Potential',
    description: 'Located along major mineralized trends hosting world-class deposits',
  },
]

export function ExplorationApproach() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/50 to-gold-900/50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our Exploration <span className="text-gradient from-gold-400 to-gold-600">Approach</span>
          </h2>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Combining cutting-edge technology with geological expertise to unlock mineral potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {approaches.map((approach, index) => {
            const Icon = approach.icon
            return (
              <motion.div
                key={approach.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/20 mb-4">
                  <Icon className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{approach.title}</h3>
                <p className="text-primary-200">{approach.description}</p>
              </motion.div>
            )
          })}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            With over 20,481 hectares in the heart of British Columbia's Golden Triangle, 
            the Luxor Project represents one of the most prospective exploration opportunities 
            in North America.
          </p>
          <Link href="/properties">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black">
              Explore Our Properties
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
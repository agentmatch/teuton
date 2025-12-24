'use client'

import { motion } from 'framer-motion'
import { FiTarget, FiMap, FiAward, FiTrendingUp } from 'react-icons/fi'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    icon: FiMap,
    title: 'Prime Golden Triangle Location',
    description: '20,481 hectares adjacent to world-class deposits including Eskay Creek, KSM, and Brucejack mines.',
  },
  {
    icon: FiTarget,
    title: 'High-Grade Discoveries',
    description: 'Big Gold: 90m @ 14.4 g/t Au with visible gold. Multiple untested targets across six properties.',
  },
  {
    icon: FiAward,
    title: 'Proven Deposit Types',
    description: 'Targeting VMS, porphyry Cu-Au, and epithermal systems - the same as neighboring billion-dollar mines.',
  },
  {
    icon: FiTrendingUp,
    title: 'Accelerating Exploration',
    description: 'Systematic drilling programs with year-round access via established infrastructure.',
  },
]

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient from-primary-500 to-primary-700">
              Why Choose
            </span>{' '}
            <span className="text-foreground">Luxor Metals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Positioned for discovery with exceptional grades in the heart of BC's Golden Triangle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <div className="bento bento-hover p-8 h-full">
                  <div className="w-16 h-16 bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2 border-primary/20">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
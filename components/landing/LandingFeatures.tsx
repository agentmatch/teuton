'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiTarget, FiTrendingUp, FiMap, FiAward } from 'react-icons/fi'

const features = [
  {
    icon: FiMap,
    title: '20,481 Hectares in the Golden Triangle',
    description: 'Six strategic properties in BC\'s most prolific mining district, home to world-class deposits like Eskay Creek and KSM',
  },
  {
    icon: FiTarget,
    title: 'Multiple Discovery Targets',
    description: 'VMS, porphyry Cu-Au, and epithermal Au-Ag targets with proven mineralization across all properties',
  },
  {
    icon: FiTrendingUp,
    title: 'Exceptional Early Results',
    description: 'Big Gold discovery: 90m @ 14.4 g/t Au, 13 g/t Ag, 1.21% Cu - among the highest grades in the region',
  },
  {
    icon: FiAward,
    title: 'Proven Leadership',
    description: 'Management team with track records of discovery and value creation in multiple mining jurisdictions',
  },
]

export default function LandingFeatures() {
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-primary">Luxor Metals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Positioned for discovery in one of the world's most prolific mining districts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bento bento-hover p-8 text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-primary/20 bg-primary/5 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
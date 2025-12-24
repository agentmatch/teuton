'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheckCircle } from 'react-icons/fi'

const reasons = [
  {
    title: 'World-Class Location',
    points: [
      '20,481 hectares in BC\'s Golden Triangle',
      'Adjacent to Eskay Creek (past producer: 3.3M oz Au, 160M oz Ag)',
      'Near KSM project (proven reserves: 38.8M oz Au, 10.2B lbs Cu)',
      'Year-round road access via Highway 37',
    ],
  },
  {
    title: 'Exceptional Discovery Potential',
    points: [
      'Big Gold: 90m @ 14.4 g/t Au with visible gold',
      'Multiple untested geophysical and geochemical anomalies',
      'Three proven deposit types: VMS, porphyry, epithermal',
      'Historical drilling shows widespread mineralization',
    ],
  },
  {
    title: 'Strategic Advantages',
    points: [
      'Glacier retreat exposing new mineralized zones',
      'Established infrastructure reduces exploration costs',
      'Strong First Nations relationships',
      'British Columbia mining-friendly jurisdiction',
    ],
  },
]

export function WhyLuxorSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-primary">Luxor Advantage</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Positioned for discovery in one of the world's most prolific mining districts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bento p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-foreground">
                {reason.title}
              </h3>
              <ul className="space-y-3">
                {reason.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <FiCheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-primary/10 border-2 border-primary/20">
            <div className="text-left">
              <div className="text-sm text-muted-foreground">Investment Highlight</div>
              <div className="text-lg font-semibold text-foreground">
                Same geological setting as neighboring mines worth billions
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

const stats = [
  {
    value: 20481,
    suffix: '',
    label: 'Hectares in the Golden Triangle',
    prefix: '',
  },
  {
    value: 14.4,
    suffix: ' g/t',
    label: 'Gold Grade at Big Gold',
    prefix: '',
    decimals: 1,
  },
  {
    value: 90,
    suffix: 'm',
    label: 'High-Grade Intercept',
    prefix: '',
  },
  {
    value: 6,
    suffix: '',
    label: 'Active Properties',
    prefix: '',
  },
]

export default function LandingStats() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Numbers That <span className="text-primary">Matter</span>
          </h2>
          <p className="text-xl text-background/70 max-w-3xl mx-auto">
            Our track record speaks for itself
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {inView && (
                  <>
                    {stat.prefix}
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      separator=","
                      decimal="."
                      decimals={stat.decimals || 0}
                    />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-background/70">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
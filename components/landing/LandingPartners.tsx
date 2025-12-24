'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const partners = [
  { name: 'TSX Venture', logo: 'TSX-V' },
  { name: 'OTCQB', logo: 'OTCQB' },
  { name: 'Bureau Veritas', logo: 'BV' },
  { name: 'SGS Canada', logo: 'SGS' },
  { name: 'ALS Global', logo: 'ALS' },
  { name: 'SRK Consulting', logo: 'SRK' },
]

export default function LandingPartners() {
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
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Working with industry-leading organizations
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bento p-6 flex items-center justify-center hover:border-primary transition-colors group"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {partner.logo}
                </div>
                <div className="text-xs text-muted-foreground mt-2">{partner.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export function CompanyStory() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gradient from-primary-500 to-primary-700">
                Our Story
              </span>
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p className="text-lg">
                Founded in 2002, Luxor Metals emerged from a vision to revolutionize mineral exploration
                through the integration of cutting-edge technology and sustainable practices. What began
                as a small team of geologists has grown into a global leader in mineral discovery.
              </p>
              <p className="text-lg">
                Our journey has taken us across continents, from the remote regions of Canada to the
                mineral-rich landscapes of South America and Africa. Each project has strengthened our
                commitment to responsible exploration and community partnership.
              </p>
              <p className="text-lg">
                Today, we stand at the forefront of the mining industry, pioneering new methods of
                exploration that minimize environmental impact while maximizing discovery potential.
                Our success is built on innovation, integrity, and an unwavering dedication to
                creating value for all stakeholders.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-6 max-w-xs">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">20+</div>
              <div className="text-gray-600 dark:text-gray-400">Years of Excellence</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
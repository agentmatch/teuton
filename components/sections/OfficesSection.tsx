'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMapPin } from 'react-icons/fi'

const offices = [
  {
    city: 'Victoria',
    country: 'Canada',
    address: '2130 Crescent Road, Victoria, BC, V8S 2H3',
    type: 'Head Office',
  },
  {
    city: 'Stewart',
    country: 'Canada',
    address: 'Field Operations Base, Stewart, BC',
    type: 'Exploration Office',
  },
  {
    city: 'Vancouver',
    country: 'Canada',
    address: 'Corporate Relations Office, Vancouver, BC',
    type: 'Investor Relations',
  },
]

export function OfficesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
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
              Global
            </span>{' '}
            <span className="text-gray-900 dark:text-white">Offices</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our international presence ensures local expertise and global reach
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <motion.div
              key={office.city}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {office.type}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {office.city}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {office.country}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {office.address}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
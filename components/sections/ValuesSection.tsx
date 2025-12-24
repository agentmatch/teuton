'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiHeart, FiShield, FiUsers, FiTrendingUp } from 'react-icons/fi'

const values = [
  {
    icon: FiShield,
    title: 'Integrity',
    description: 'We operate with transparency and ethical standards in all our business dealings.',
  },
  {
    icon: FiHeart,
    title: 'Sustainability',
    description: 'Environmental stewardship and community welfare guide every decision we make.',
  },
  {
    icon: FiUsers,
    title: 'Collaboration',
    description: 'Strong partnerships with communities, governments, and stakeholders drive our success.',
  },
  {
    icon: FiTrendingUp,
    title: 'Innovation',
    description: 'We embrace new technologies and methodologies to lead the industry forward.',
  },
]

export function ValuesSection() {
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
              Our Values
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            The principles that guide our exploration and define our corporate culture
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 mb-6">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
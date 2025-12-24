'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const milestones = [
  {
    year: '2002',
    title: 'Company Founded',
    description: 'Luxor Metals established with a vision to revolutionize mineral exploration.',
  },
  {
    year: '2008',
    title: 'First Major Discovery',
    description: 'Discovered the Aurora Gold deposit in Northern Canada.',
  },
  {
    year: '2015',
    title: 'Global Expansion',
    description: 'Expanded operations to South America and Africa.',
  },
  {
    year: '2020',
    title: 'Technology Integration',
    description: 'Pioneered AI-driven exploration techniques in the industry.',
  },
  {
    year: '2024',
    title: 'Sustainability Leader',
    description: 'Recognized as industry leader in sustainable exploration practices.',
  },
]

export function TimelineSection() {
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
              Our Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Key milestones in our evolution as a global exploration leader
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 dark:bg-gray-700" />
          
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`w-5/12 ${
                  index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'
                }`}
              >
                <div className="glass rounded-xl p-6">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                    {milestone.year}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              </div>
              
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-gray-900" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
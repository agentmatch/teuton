'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const depositTypes = [
  {
    type: 'VMS Deposits',
    title: 'Volcanogenic Massive Sulfide',
    description: 'High-grade polymetallic deposits formed on ancient seafloor',
    characteristics: [
      'Eskay Creek-type precious metal rich',
      'Granduc-type Besshi copper rich',
      'Massive sulfide lenses',
      'Polymetallic mineralization',
    ],
    examples: 'Big Gold, 4 J\'s, Eskay Rift areas',
    potential: 'Multiple untested ZTEM conductors',
  },
  {
    type: 'Porphyry Cu-Au',
    title: 'Porphyry Copper-Gold Systems',
    description: 'Large-tonnage deposits associated with intrusive rocks',
    characteristics: [
      'Large scale mineralization',
      'Associated with Texas Creek Suite',
      'Zoned alteration patterns',
      'Long mine life potential',
    ],
    examples: 'Tennyson area',
    potential: 'Along Sulphurets thrust fault trend',
  },
  {
    type: 'Epithermal Au-Ag',
    title: 'Epithermal Gold-Silver',
    description: 'High-grade precious metal veins and disseminations',
    characteristics: [
      'High-grade gold and silver',
      'Structurally controlled',
      'Near-surface deposits',
      'Quick to production',
    ],
    examples: 'Various vein occurrences',
    potential: 'Untested structural zones',
  },
]

export function DepositTypes() {
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
              Deposit
            </span>{' '}
            <span className="text-gray-900 dark:text-white">Types</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Multiple mineralization styles provide diverse exploration opportunities
          </p>
        </motion.div>

        <div className="space-y-12">
          {depositTypes.map((deposit, index) => (
            <motion.div
              key={deposit.type}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="glass rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                <div>
                  <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
                    {deposit.type}
                  </span>
                  
                  <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    {deposit.title}
                  </h3>
                  
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                    {deposit.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Key Characteristics:</h4>
                    {deposit.characteristics.map((char) => (
                      <div key={char} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-primary-500 rounded-full" />
                        {char}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="glass-dark rounded-xl p-6">
                    <h4 className="font-semibold text-white mb-2">Project Examples:</h4>
                    <p className="text-gray-300">{deposit.examples}</p>
                  </div>
                  
                  <div className="glass-dark rounded-xl p-6">
                    <h4 className="font-semibold text-white mb-2">Exploration Potential:</h4>
                    <p className="text-gray-300">{deposit.potential}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
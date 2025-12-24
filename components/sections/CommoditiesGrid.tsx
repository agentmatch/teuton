'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GiGoldBar, GiSilverBullet, GiMetalBar, GiCrystalGrowth } from 'react-icons/gi'
import { FaIndustry } from 'react-icons/fa'
import { BiAtom } from 'react-icons/bi'

const commodities = [
  {
    name: 'Gold (Au)',
    icon: GiGoldBar,
    color: 'from-yellow-400 to-yellow-600',
    description: 'High-grade gold mineralization discovered across multiple zones',
    highlights: [
      'Up to 27.7 g/t Au at Big Gold',
      'Porphyry-style at Tennyson',
      'Epithermal potential',
    ],
    uses: 'Investment, jewelry, electronics',
  },
  {
    name: 'Silver (Ag)',
    icon: GiSilverBullet,
    color: 'from-gray-300 to-gray-500',
    description: 'Exceptional silver grades in massive sulfide occurrences',
    highlights: [
      'Up to 6,240 g/t Ag at Big Gold',
      'Associated with base metals',
      'VMS-style deposits',
    ],
    uses: 'Industrial, solar panels, electronics',
  },
  {
    name: 'Copper (Cu)',
    icon: GiMetalBar,
    color: 'from-orange-500 to-orange-700',
    description: 'Significant copper mineralization in porphyry and VMS systems',
    highlights: [
      'Porphyry Cu-Au at Tennyson',
      'VMS-style at 4 J\'s',
      'Up to 1.455% Cu',
    ],
    uses: 'Electrical, construction, renewable energy',
  },
  {
    name: 'Lead (Pb)',
    icon: FaIndustry,
    color: 'from-slate-500 to-slate-700',
    description: 'High-grade lead in polymetallic massive sulfide zones',
    highlights: [
      'Up to 6.4% Pb',
      'Associated with zinc',
      'VMS deposits',
    ],
    uses: 'Batteries, radiation shielding',
  },
  {
    name: 'Zinc (Zn)',
    icon: GiCrystalGrowth,
    color: 'from-blue-400 to-blue-600',
    description: 'Zinc mineralization in VMS and epithermal systems',
    highlights: [
      'Up to 3.11% Zn',
      'Polymetallic deposits',
      'Multiple occurrences',
    ],
    uses: 'Galvanizing, alloys, chemicals',
  },
  {
    name: 'Molybdenum (Mo)',
    icon: BiAtom,
    color: 'from-purple-500 to-purple-700',
    description: 'Associated with porphyry copper-gold systems',
    highlights: [
      'Porphyry-related',
      'Tennyson area',
      'By-product potential',
    ],
    uses: 'Steel alloys, catalysts, lubricants',
  },
]

export function CommoditiesGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient from-gold-500 to-gold-700">
              Our
            </span>{' '}
            <span className="text-gray-900 dark:text-white">Commodities</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            A diverse portfolio of precious and base metals with world-class potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {commodities.map((commodity, index) => {
            const Icon = commodity.icon
            return (
              <motion.div
                key={commodity.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${commodity.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {commodity.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {commodity.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {commodity.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        {highlight}
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      <span className="font-medium">Uses:</span> {commodity.uses}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiMapPin, FiCalendar, FiTrendingUp } from 'react-icons/fi'

const allProjects = [
  {
    id: 1,
    name: 'Tennyson Area',
    location: 'Stewart, BC, Canada',
    status: 'Advanced Exploration',
    stage: 'Drilling Completed',
    minerals: ['Copper', 'Gold', 'Molybdenum'],
    description: 'Advanced porphyry Cu-Au exploration target with completed drilling program.',
    highlights: ['Multiple drilling campaigns', 'Porphyry Cu-Au system', 'Year-round access'],
  },
  {
    id: 2,
    name: 'Big Gold Area',
    location: 'Stewart, BC, Canada',
    status: 'Discovery',
    stage: 'New Discovery',
    minerals: ['Gold', 'Silver', 'Copper', 'Lead', 'Zinc'],
    description: 'Recent massive sulfide discoveries including Roman and Zall occurrences with exceptional grades.',
    highlights: ['27.7 g/t Au, 6,240 g/t Ag', 'Massive sulfide mineralization', 'Multiple new showings'],
  },
  {
    id: 3,
    name: '4 J\'s/Catspaw Area',
    location: 'Stewart, BC, Canada',
    status: 'Exploration',
    stage: 'Target Development',
    minerals: ['Copper', 'Gold', 'Silver'],
    description: 'VMS and Cu-Au mineralization exposed by recent glacier retreat.',
    highlights: ['Glacier retreat exposures', 'VMS potential', 'New Cu-Au discoveries'],
  },
  {
    id: 4,
    name: 'Eskay Rift Area',
    location: 'Stewart, BC, Canada',
    status: 'Exploration',
    stage: 'Early Exploration',
    minerals: ['Gold', 'Silver', 'Copper', 'Lead', 'Zinc'],
    description: 'Prospective area for VMS deposits similar to the world-class Eskay Creek mine.',
    highlights: ['Eskay Creek analogue', 'VMS prospective', 'Regional geology'],
  },
  {
    id: 5,
    name: 'Leduc Area',
    location: 'Stewart, BC, Canada',
    status: 'Exploration',
    stage: 'Target Definition',
    minerals: ['Copper', 'Gold'],
    description: 'Located near the historic Granduc mine, prospective for Cu-Au mineralization.',
    highlights: ['Near Granduc mine', 'Historic production area', 'Infrastructure nearby'],
  },
  {
    id: 6,
    name: 'Pearson Area',
    location: 'Stewart, BC, Canada',
    status: 'Exploration',
    stage: 'Geophysical Anomaly',
    minerals: ['Copper', 'Gold', 'Silver'],
    description: 'Strong EM anomaly indicating potential for significant mineralization.',
    highlights: ['Strong EM anomaly', 'Untested target', 'High priority'],
  },
]

export function ProjectsList() {
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
              Project
            </span>{' '}
            <span className="text-gray-900 dark:text-white">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Six key target areas across 20,481 hectares in British Columbia's Golden Triangle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {allProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiTrendingUp className="w-4 h-4" />
                        {project.stage}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === 'Development'
                      ? 'bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-300'
                      : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.minerals.map((mineral) => (
                    <span
                      key={mineral}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {mineral}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-2 mb-6">
                  {project.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                      {highlight}
                    </div>
                  ))}
                </div>
                
                <Link href={`/projects/${project.id}`}>
                  <Button variant="outline" className="w-full">
                    View Project Details
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
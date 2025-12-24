'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiMapPin, FiActivity } from 'react-icons/fi'

const projects = [
  {
    id: 1,
    name: 'Tennyson Area',
    location: 'Northwest BC, Canada',
    status: 'Advanced Exploration',
    image: '/images/tennyson.jpg',
    description: 'Porphyry Cu-Au exploration with significant drilling completed',
    minerals: ['Copper', 'Gold', 'Molybdenum'],
  },
  {
    id: 2,
    name: 'Big Gold Area',
    location: 'Northwest BC, Canada',
    status: 'Discovery',
    image: '/images/biggold.jpg',
    description: 'Recent massive sulfide discoveries with exceptional grades',
    minerals: ['Gold', 'Silver', 'Copper', 'Lead', 'Zinc'],
  },
  {
    id: 3,
    name: '4 J\'s/Catspaw Area',
    location: 'Northwest BC, Canada',
    status: 'Exploration',
    image: '/images/4js.jpg',
    description: 'VMS and Cu-Au mineralization exposed by glacier retreat',
    minerals: ['Copper', 'Gold', 'Silver'],
  },
]

export function ProjectsSection() {
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
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient from-gold-500 to-gold-700">
              Featured
            </span>{' '}
            <span className="text-foreground">Properties</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Exploring 20,481 hectares in the prolific Golden Triangle of British Columbia
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bento bento-gold bento-hover overflow-hidden">
                <div className="relative h-64 bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-primary text-black px-3 py-1 text-sm font-medium border-2 border-black/20">
                    {project.status}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-muted-foreground mb-3">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.minerals.map((mineral) => (
                      <span
                        key={mineral}
                        className="px-3 py-1 bg-muted text-foreground border border-border text-sm"
                      >
                        {mineral}
                      </span>
                    ))}
                  </div>
                  
                  <Link href="/properties">
                    <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/properties">
            <Button size="lg" variant="outline">
              View All Properties
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
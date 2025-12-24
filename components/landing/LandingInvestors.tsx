'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiDownload, FiPlayCircle, FiCalendar, FiFileText } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'

const resources = [
  {
    title: 'Investor Presentation',
    description: 'Latest corporate deck with discovery highlights',
    icon: FiFileText,
    action: 'Download PDF',
    size: '4.2 MB',
  },
  {
    title: 'Corporate Video',
    description: '5-minute overview of the Big Gold discovery',
    icon: FiPlayCircle,
    action: 'Watch Now',
    duration: '5:12',
  },
  {
    title: 'Technical Report',
    description: 'Detailed geological assessment and drill results',
    icon: FiDownload,
    action: 'Download PDF',
    size: '12.8 MB',
  },
  {
    title: 'Webinar Recording',
    description: 'CEO presents Q4 2024 exploration update',
    icon: FiCalendar,
    action: 'View Recording',
    duration: '45:00',
  },
]

export default function LandingInvestors() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-blue-500/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Investor
            <span className="text-gradient-gold-blue"> Resources</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to evaluate this exceptional opportunity
          </p>
        </motion.div>

        {/* Resource cards - Asymmetric layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`neumorphic-card-hover group bg-accent/5 border border-accent/20 ${index % 2 === 1 ? 'md:mt-8' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl neumorphic-button flex items-center justify-center flex-shrink-0 group-hover:text-accent transition-colors bg-accent/10 border border-accent/20">
                  <resource.icon className="w-6 h-6 text-accent bounce-hover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Button variant="neumorphic" size="sm" className="px-4 py-2 text-sm hover:text-accent ripple bg-accent/10 border border-accent/20">
                      {resource.action} →
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {resource.size || resource.duration}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <div className="neumorphic-card max-w-2xl mx-auto border-t-4 border-accent bg-accent/5 border border-accent/20">
            <h3 className="text-2xl font-bold mb-4">Speak with Our Team</h3>
            <p className="text-muted-foreground mb-6">
              Schedule a call with our investor relations team to discuss the opportunity
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="neumorphic" className="min-w-[160px] bg-accent text-white hover:bg-accent/90 ripple">
                Schedule Call
              </Button>
              <Button variant="neumorphic" className="min-w-[160px] hover:text-accent ripple bg-background border border-accent/20">
                Email IR Team
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Phone:</span> +1 (604) 555-0123
              </div>
              <div className="w-px h-4 bg-border" />
              <div>
                <span className="font-medium">Email:</span> ir@luxormetals.com
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
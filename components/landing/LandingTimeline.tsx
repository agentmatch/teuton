'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiCheckCircle, FiTarget, FiTrendingUp } from 'react-icons/fi'

const timelineEvents = [
  {
    year: '2022',
    title: 'Property Acquisition',
    description: 'Acquired 20,481 hectares in the Golden Triangle',
    icon: FiCheckCircle,
    highlight: false,
  },
  {
    year: '2023',
    title: 'Initial Exploration',
    description: 'Systematic mapping and sampling program initiated',
    icon: FiTarget,
    highlight: false,
  },
  {
    year: '2024',
    title: 'Big Gold Discovery',
    description: '90m @ 14.4 g/t Au - One of the highest grades in the region',
    icon: FiTrendingUp,
    highlight: true,
  },
  {
    year: '2025',
    title: 'Expansion Drilling',
    description: 'Follow-up program to expand known mineralization',
    icon: FiTarget,
    highlight: false,
    future: true,
  },
]

export default function LandingTimeline() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Path to
            <span style={{
              background: 'linear-gradient(to right, #FFD700, #5B9FEB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}> Discovery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From acquisition to world-class discovery in under 24 months
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line - animated */}
            <motion.div 
              className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-blue-500"
              initial={{ height: 0 }}
              animate={inView ? { height: '100%' } : {}}
              transition={{ duration: 2, ease: 'easeOut' }}
            />

            {/* Timeline events */}
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative flex items-start mb-12 last:mb-0"
              >
                {/* Icon */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative z-10 w-16 h-16 flex items-center justify-center rounded-2xl cursor-pointer
                    ${event.highlight 
                      ? 'bg-accent text-white neumorphic pulse-accent' 
                      : event.future
                      ? 'neumorphic-flat border-2 border-dashed border-accent/30 bg-accent/5'
                      : 'neumorphic-button bg-accent/10 border border-accent/20'
                    }
                  `}>
                  <event.icon className="w-6 h-6 bounce-hover" />
                  {event.highlight && (
                    <div className="absolute -inset-2 bg-accent/20 animate-pulse -z-10 rounded-2xl" />
                  )}
                </motion.div>

                {/* Content */}
                <div className="ml-8 flex-1">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className={`text-2xl font-bold ${event.future ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {event.year}
                    </span>
                    {event.highlight && (
                      <span className="px-3 py-1 rounded-xl neumorphic-button text-accent text-sm font-medium bg-accent/10 border border-accent/20">
                        DISCOVERY
                      </span>
                    )}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${event.future ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Next steps CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-4 neumorphic-card border-l-4 border-accent bg-accent/5 border border-accent/20">
              <FiTrendingUp className="w-5 h-5 text-accent bounce-hover" />
              <div className="text-left">
                <div className="font-semibold">2025 Catalyst</div>
                <div className="text-sm text-muted-foreground">
                  50,000m drill program planned to expand discovery
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
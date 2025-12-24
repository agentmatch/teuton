'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi'

const showcaseItems = [
  {
    id: 1,
    title: 'Visible Gold in Core',
    description: 'Coarse visible gold throughout 90m intercept at Big Gold',
    type: 'Core Photo',
  },
  {
    id: 2,
    title: 'Geological Map',
    description: 'Regional geology showing property locations relative to major deposits',
    type: 'Map',
  },
  {
    id: 3,
    title: 'Drill Site Access',
    description: 'Year-round road access via Highway 37 infrastructure',
    type: 'Site Photo',
  },
  {
    id: 4,
    title: '3D Mineralization Model',
    description: 'Conceptual model showing ore body geometry and potential',
    type: '3D Model',
  },
]

export default function LandingShowcase() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [activeIndex, setActiveIndex] = useState(0)

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % showcaseItems.length)
  }

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Visual
            <span className="text-gradient-gold-blue"> Evidence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See the discovery that's capturing investor attention
          </p>
        </motion.div>

        {/* Showcase carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative neumorphic-card p-0 overflow-hidden bg-accent/5 border border-accent/20">
            {/* Main display area */}
            <div className="relative h-[500px] bg-gradient-to-br from-background to-accent/5">
              {/* Placeholder for images/3D models */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-muted-foreground/20 mb-4">
                    {showcaseItems[activeIndex].type}
                  </div>
                  <p className="text-muted-foreground">High-resolution content placeholder</p>
                </div>
              </div>

              {/* Navigation buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 neumorphic-button rounded-xl p-3 hover:text-accent ripple bg-background/90 border border-accent/20"
              >
                <FiChevronLeft className="w-6 h-6 bounce-hover" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 neumorphic-button rounded-xl p-3 hover:text-accent ripple bg-background/90 border border-accent/20"
              >
                <FiChevronRight className="w-6 h-6 bounce-hover" />
              </button>

              {/* Fullscreen button */}
              <button className="absolute top-4 right-4 neumorphic-button rounded-xl p-3 hover:text-accent ripple bg-background/90 border border-accent/20">
                <FiMaximize2 className="w-5 h-5 bounce-hover" />
              </button>
            </div>

            {/* Info panel */}
            <div className="p-6 border-t border-border/20">
              <h3 className="text-xl font-semibold mb-2">
                {showcaseItems[activeIndex].title}
              </h3>
              <p className="text-muted-foreground">
                {showcaseItems[activeIndex].description}
              </p>
            </div>

            {/* Thumbnail navigation */}
            <div className="p-6 pt-0">
              <div className="grid grid-cols-4 gap-4">
                {showcaseItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(index)}
                    className={`
                      relative h-20 overflow-hidden transition-all duration-200 rounded-xl
                      ${activeIndex === index 
                        ? 'neumorphic-inset ring-2 ring-accent bg-accent/20' 
                        : 'neumorphic-button hover:scale-105 bg-accent/5 border border-accent/20'
                      }
                    `}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
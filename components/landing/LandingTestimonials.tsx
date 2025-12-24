'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiStar } from 'react-icons/fi'

const testimonials = [
  {
    name: 'Michael Chen',
    role: 'Portfolio Manager, Apex Capital',
    content: 'Luxor Metals has consistently delivered on their exploration targets. Their systematic approach and experienced team make them a standout in the junior mining sector.',
    rating: 5,
  },
  {
    name: 'Sarah Williams',
    role: 'Mining Analyst, Resource Insights',
    content: 'The quality of their properties and technical expertise is exceptional. They have a keen eye for identifying high-potential targets in proven districts.',
    rating: 5,
  },
  {
    name: 'David Morrison',
    role: 'Investment Director, Northern Resources Fund',
    content: 'What sets Luxor apart is their commitment to ESG principles while maintaining aggressive exploration programs. A rare combination in this sector.',
    rating: 5,
  },
]

export default function LandingTestimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="text-primary">Investors</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            What industry experts are saying about Luxor Metals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bento p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div className="border-t-2 border-border pt-4">
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
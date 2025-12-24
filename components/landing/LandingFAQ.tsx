'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { FiPlus, FiMinus } from 'react-icons/fi'

const faqs = [
  {
    question: 'What makes the Big Gold discovery significant?',
    answer: 'The 90m @ 14.4 g/t Au intercept is one of the highest-grade discoveries in the Golden Triangle in recent years. The presence of visible gold throughout the intercept and the fact that mineralization remains open in all directions makes this a potentially game-changing discovery.',
  },
  {
    question: 'How does Luxor compare to neighboring projects?',
    answer: 'We\'re located adjacent to world-class deposits including Eskay Creek (3.3M oz Au, 160M oz Ag), KSM (38.8M oz Au, 10.2B lbs Cu), and Brucejack (8.7M oz Au). Our geological setting is identical to these major deposits.',
  },
  {
    question: 'What is the exploration timeline?',
    answer: 'Following our 2024 discovery, we\'re planning an aggressive 50,000m drill program for 2025 to expand the known mineralization. With year-round road access, we can maintain continuous exploration activities.',
  },
  {
    question: 'What are the infrastructure advantages?',
    answer: 'Our properties have exceptional infrastructure with year-round road access via Highway 37, proximity to power lines, and established camps. This significantly reduces exploration costs and accelerates development timelines.',
  },
  {
    question: 'How is the company funded?',
    answer: 'Luxor Metals is well-funded with $2.5M raised in our recent financing. This provides sufficient capital for our 2025 exploration program without near-term dilution concerns.',
  },
]

export default function LandingFAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 bg-gradient-to-b from-background via-background to-accent/5 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked
            <span className="text-gradient-gold-blue"> Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get answers to common investor questions
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="neumorphic-card p-0 overflow-hidden group bg-accent/5 border border-accent/20"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/10 transition-all ripple"
              >
                <h3 className="font-semibold pr-4">{faq.question}</h3>
                <motion.div 
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  {openIndex === index ? (
                    <FiMinus className="w-5 h-5 text-accent bounce-hover" />
                  ) : (
                    <FiPlus className="w-5 h-5 text-muted-foreground hover:text-accent transition-colors" />
                  )}
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-muted-foreground border-t border-accent/20 bg-accent/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
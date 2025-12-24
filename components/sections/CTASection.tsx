'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-gold-900" />
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Invest in the Future of Mining?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join us in our mission to discover and develop the world's next generation of mineral resources
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="glass" className="min-w-[160px] bg-white/20 hover:bg-white/30">
                Get in Touch
              </Button>
            </Link>
            <Link href="/investors">
              <Button size="lg" className="min-w-[160px] bg-gold-500 hover:bg-gold-600 text-black">
                Investor Portal
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
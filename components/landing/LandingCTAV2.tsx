'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiArrowRight, FiMail, FiPhone } from 'react-icons/fi'
import StockWidget from './StockWidget'

export default function LandingCTAV2() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-gradient-to-br from-accent via-accent to-accent/95 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Value proposition */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl mb-8">
            <span className="text-sm font-medium">Limited Time Opportunity</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Don't Miss the Next
            <span className="block text-white mt-2">Eskay Creek</span>
          </h2>

          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            With grades of 14.4 g/t Au over 90m, Luxor Metals is positioned to become 
            the Golden Triangle's next major discovery story.
          </p>

          {/* Live stock widget */}
          <div className="max-w-md mx-auto mb-12">
            <StockWidget />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="neumorphic"
                className="min-w-[200px] bg-white text-accent hover:bg-white/90"
              >
                Get Investor Package
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
            <a href="tel:+16045550123">
              <Button 
                size="lg" 
                variant="neumorphic" 
                className="min-w-[200px] bg-white/10 text-white hover:bg-white/20 border border-white/20"
              >
                <FiPhone className="mr-2" />
                Call: (604) 555-0123
              </Button>
            </a>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-white/70">
            <a href="mailto:ir@luxormetals.com" className="flex items-center gap-2 hover:text-white transition-colors">
              <FiMail className="w-4 h-4" />
              ir@luxormetals.com
            </a>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div>TSX-V: LXR | OTCQB: LXRRF</div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-white/50 max-w-2xl mx-auto">
            Forward-Looking Statements: This presentation contains forward-looking statements. 
            All statements, other than statements of historical fact, are forward-looking statements. 
            Investors are cautioned that such statements are not guarantees of future performance.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
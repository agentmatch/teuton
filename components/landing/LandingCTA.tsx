'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { FiArrowRight, FiMail, FiFileText } from 'react-icons/fi'

export default function LandingCTA() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20 bg-foreground text-background relative overflow-hidden">
      {/* Gold accent pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to <span className="text-primary">Invest</span> in the Future?
          </h2>
          <p className="text-xl text-background/70 mb-8 max-w-2xl mx-auto">
            Join us in discovering Canada's next major mineral deposits. Get our investor package and latest updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/investors">
              <Button 
                size="lg" 
                variant="outline" 
                className="min-w-[200px] bg-background text-foreground hover:bg-background/90 border-2"
              >
                <FiFileText className="mr-2" />
                Investor Package
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                className="min-w-[200px] bg-primary text-black hover:bg-primary/90 border-2 border-primary"
              >
                <FiMail className="mr-2" />
                Contact IR Team
              </Button>
            </Link>
          </div>

          <div className="border-t-2 border-background/20 pt-8">
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">TSX-V: LXR</div>
                <div className="text-sm text-background/70">Toronto Venture Exchange</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-background/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">OTCQB: LXRRF</div>
                <div className="text-sm text-background/70">OTC Markets</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Luxor Metals Corp. All rights reserved. | 
            <Link href="/privacy" className="hover:text-primary ml-1">Privacy Policy</Link> | 
            <Link href="/terms" className="hover:text-primary ml-1">Terms of Service</Link>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
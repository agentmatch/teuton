'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight, FiExternalLink, FiDownload } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { StickyNewsletterBar } from '@/components/ui/StickyNewsletterBar'

// Lazy load gold dust particles for footer
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const footerLinks = {
  explore: [
    { name: 'Properties', href: '/properties' },
    { name: 'Overview Map', href: '/landingpagekappa#map' },
    { name: 'Red Line', href: '/landingpagekappa#redline' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  investors: [
    { name: 'Investor Relations', href: '/investors' },
    { name: 'Stock Information', href: '/investors#stock' },
    { name: 'Reports & Filings', href: '/investors#reports' },
    { name: 'News', href: '/news' },
  ],
}

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [stockPrice, setStockPrice] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  
  // Check if we're on a dark theme page
  const isDarkTheme = pathname === '/investors'

  // Fetch stock price on mount
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        if (data && data.price !== undefined) {
          setStockPrice(data.price)
        }
      } catch (err) {
        console.error('Error fetching stock quote:', err)
      }
    }
    fetchStockData()
  }, [])

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (email: string) => {
    if (!email) {
      setMessage('Please enter your email address')
      setMessageType('error')
      return
    }

    setIsSubmitting(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || 'Successfully subscribed!')
        setMessageType('success')
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage('Failed to subscribe. Please try again.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('')
        setMessageType('')
      }, 5000)
    }
  }

  return (
    <>
      {/* Sticky Newsletter Bar */}
      <StickyNewsletterBar
        onSubmit={handleNewsletterSubmit}
        isSubmitting={isSubmitting}
        message={message}
        messageType={messageType}
      />

      {/* Footer Separator */}
      <div className="relative" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <div className="container mx-auto px-4">
          <motion.div
            className="h-px w-full"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(229, 229, 229, 0.2) 20%, rgba(229, 229, 229, 0.3) 50%, rgba(229, 229, 229, 0.2) 80%, transparent 100%)',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      <footer className="relative overflow-hidden border-t border-[#0A4A5C]/30" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>

      <div className="relative z-10">


        {/* Strategic Navigation - Story-Driven Layout */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* EXPLORE: Properties & Opportunities */}
            <motion.div 
              className="p-6 rounded-2xl group"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(229, 229, 229, 0.1)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ 
                y: -5,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center">
                  <FiMapPin className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#E5E5E5]"
                    style={{ fontFamily: 'Aeonik Extended, sans-serif' }}>
                  Explore Properties
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                {[
                  { name: 'Interactive Map', href: '/' },
                  { name: 'All Properties', href: '/properties' },
                  { name: 'Red Line Project', href: '/landingpagekappa#redline' },
                  { name: 'About Company', href: '/about' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group/link flex items-center gap-2 transition-all duration-300 text-white/60 hover:text-blue-300 text-sm"
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <motion.span className="relative" style={{ fontFamily: 'Aeonik, sans-serif' }}>
                        {link.name}
                        {hoveredLink === link.name && (
                          <motion.div
                            className="absolute -bottom-0.5 left-0 right-0 h-px bg-blue-300"
                            layoutId="footerLinkUnderline"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.span>
                      <FiArrowUpRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* INVEST: Investor Resources */}
            <motion.div 
              className="p-6 rounded-2xl group"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(229, 229, 229, 0.1)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ 
                y: -5,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center">
                  <FiDownload className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#E5E5E5]"
                    style={{ fontFamily: 'Aeonik Extended, sans-serif' }}>
                  Investment Hub
                </h3>
              </div>
              <ul className="space-y-2 mb-4">
                {[
                  { name: 'Investor Relations', href: '/investors' },
                  { name: 'Financial Reports', href: '/investors#reports' },
                  { name: 'Stock Information', href: '/investors#stock' },
                  { name: 'Latest News', href: '/news' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group/link flex items-center gap-2 transition-all duration-300 text-white/60 hover:text-green-300 text-sm"
                      onMouseEnter={() => setHoveredLink(link.name)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      <motion.span className="relative" style={{ fontFamily: 'Aeonik, sans-serif' }}>
                        {link.name}
                        {hoveredLink === link.name && (
                          <motion.div
                            className="absolute -bottom-0.5 left-0 right-0 h-px bg-green-300"
                            layoutId="footerLinkUnderline"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.span>
                      <FiArrowUpRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* CONNECT: Contact Information Only */}
            <motion.div 
              className="p-6 rounded-2xl group"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(229, 229, 229, 0.1)',
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ 
                y: -5,
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center">
                  <FiMail className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#E5E5E5]"
                    style={{ fontFamily: 'Aeonik Extended, sans-serif' }}>
                  Contact Us
                </h3>
              </div>
              
              <div className="space-y-3">
                <a href="mailto:info@teuton.com" className="flex items-center gap-3 text-white/60 hover:text-purple-300 text-sm transition-colors group/contact">
                  <FiMail className="w-4 h-4 group-hover/contact:scale-110 transition-transform" />
                  <span style={{ fontFamily: 'Aeonik, sans-serif' }}>info@teuton.com</span>
                </a>
                <a href="tel:+17784305680" className="flex items-center gap-3 text-white/60 hover:text-purple-300 text-sm transition-colors group/contact">
                  <FiPhone className="w-4 h-4 group-hover/contact:scale-110 transition-transform" />
                  <span style={{ fontFamily: 'Aeonik, sans-serif' }}>+1 (778) 430-5680</span>
                </a>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span style={{ fontFamily: 'Aeonik, sans-serif' }}>
                    2130 Crescent Road<br />
                    Victoria, BC V8S 2H3
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Company Logo - Right Justified */}
          <motion.div 
            className="mt-8 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="group">
              <Image
                src="/images/teuton-logo.svg"
                alt="Teuton Resources"
                width={140}
                height={35}
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-105 brightness-200"
              />
            </Link>
          </motion.div>

          {/* Compact Bottom Bar */}
          <div className={`mt-6 pt-4 border-t ${isDarkTheme ? 'border-white/10' : 'border-[#1A3C40]/10'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-3">
              <p className={`text-xs ${isDarkTheme ? 'text-white/40' : 'text-[#1A3C40]/40'}`}
                 style={{ fontFamily: 'Aeonik, sans-serif' }}>
                © {currentYear} Teuton Resources Corp.
              </p>
              
              <div className="flex items-center gap-4 text-xs">
                {['Privacy Policy', 'Terms of Use', 'Disclaimer'].map((item, index) => (
                  <Link 
                    key={item}
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className={`transition-colors relative group ${
                      isDarkTheme 
                        ? 'text-white/40 hover:text-[#FFFF77]' 
                        : 'text-[#1A3C40]/40 hover:text-[#0A4A5C]'
                    }`}
                    style={{ fontFamily: 'Aeonik, sans-serif' }}
                  >
                    {item}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}
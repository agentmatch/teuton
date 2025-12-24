'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect } from 'react'
import { FiX } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

interface StickyNewsletterBarProps {
  onSubmit: (email: string) => Promise<void>
  isSubmitting: boolean
  message: string
  messageType: 'success' | 'error' | ''
}

export function StickyNewsletterBar({ 
  onSubmit, 
  isSubmitting, 
  message, 
  messageType 
}: StickyNewsletterBarProps) {
  const [email, setEmail] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  const [isNearFooter, setIsNearFooter] = useState(false)
  const pathname = usePathname()
  
  const { scrollY } = useScroll()

  // Check if we're near the footer
  useEffect(() => {
    const checkFooterProximity = () => {
      const footer = document.querySelector('footer')
      if (!footer) return

      const footerTop = footer.offsetTop
      const windowHeight = window.innerHeight
      const scrollPosition = window.scrollY
      const documentHeight = document.documentElement.scrollHeight

      // Check if we're within 200px of the footer or at the bottom
      const distanceToFooter = footerTop - (scrollPosition + windowHeight)
      const isAtBottom = scrollPosition + windowHeight >= documentHeight - 100

      setIsNearFooter(distanceToFooter <= 200 || isAtBottom)
    }

    const handleScroll = () => {
      checkFooterProximity()
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    
    try {
      await onSubmit(email)
      setEmail('')
    } catch (error) {
      console.error('Newsletter submission error:', error)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  // Don't show on front page
  if (pathname === '/' || !isVisible) {
    return null
  }

  return (
    <motion.div
      className={`${isNearFooter ? 'relative' : 'fixed bottom-0'} left-0 right-0 z-40 transition-all duration-700 ease-out`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        position: isNearFooter ? 'relative' : 'fixed'
      }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      {/* Curved Newsletter Bar - Full Width */}
      <div className="relative w-full">
        {/* Custom curved background spanning full viewport - Nearly black design */}
        <div
          className="relative w-full"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(25px) saturate(150%)',
            WebkitBackdropFilter: 'blur(25px) saturate(150%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
            boxShadow: isNearFooter 
              ? '0 -8px 32px rgba(0, 0, 0, 0.8), 0 -4px 16px rgba(0, 0, 0, 0.6)' 
              : '0 -15px 50px rgba(0, 0, 0, 0.9), 0 -8px 25px rgba(0, 0, 0, 0.7)',
            clipPath: 'ellipse(100% 100% at 50% 100%)',
            height: '60px',
            pointerEvents: 'auto',
          }}
        >
          {/* Single Line Content Container */}
          <div className="flex items-center justify-center gap-6 h-full">
            {/* Compact Title - Hidden on mobile */}
            <div className="hidden lg:block">
              <h4 className="text-base font-semibold text-[#E5E5E5] whitespace-nowrap"
                  style={{ fontFamily: 'Aeonik Extended, sans-serif' }}>
                Subscribe to Updates
              </h4>
            </div>
            
            {/* Newsletter Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-64 px-4 py-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 text-white placeholder-white/60 focus:ring-white/50 disabled:opacity-50 text-sm"
                style={{
                  fontFamily: 'Aeonik, sans-serif',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.05)',
                }}
              />
              <motion.button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="px-5 py-2 rounded-full font-semibold transition-all duration-300 disabled:opacity-50 text-sm whitespace-nowrap"
                style={{ 
                  fontFamily: 'Aeonik Extended, sans-serif',
                  fontWeight: 600,
                  background: '#FFFFFF',
                  color: '#000000',
                  border: '1px solid #FFFFFF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
                whileHover={!isSubmitting ? { 
                  scale: 1.05,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                } : {}}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>

            {/* Close button */}
            {!isNearFooter && (
              <motion.button
                onClick={handleClose}
                className="ml-2 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/70 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX className="w-3 h-3" />
              </motion.button>
            )}
          </div>

          {/* Message Display - Positioned Below */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs px-4 py-2 rounded-full ${
                messageType === 'success' 
                  ? 'text-green-300 bg-green-500/20 border border-green-500/30' 
                  : 'text-red-300 bg-red-500/20 border border-red-500/30'
              }`}
              style={{ 
                fontFamily: 'Aeonik, sans-serif',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {message}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
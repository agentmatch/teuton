'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import '@/styles/investor-mobile-fix.css'
import '@/styles/investor-glassmorphic.css'
import '@/styles/investor-background-fix.css'
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiBriefcase, FiMessageSquare, FiCalendar, FiArrowRight, FiGlobe } from 'react-icons/fi'

// Lazy load components for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

// New color palette matching RAM/Investors page
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach
  yellow: '#fed992'     // Soft yellow
}

interface FormData {
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
}

export default function ContactPage() {
  // Add gradient animation keyframes
  if (typeof window !== 'undefined' && !document.getElementById('gradientShiftAnimation')) {
    const style = document.createElement('style')
    style.id = 'gradientShiftAnimation'
    style.innerHTML = `
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `
    document.head.appendChild(style)
  }
  
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [activeTab, setActiveTab] = useState('contact')
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitStatus('success')
        
        // Reset form after success
        setTimeout(() => {
          setSubmitStatus('idle')
          setFormData({
            name: '',
            email: '',
            company: '',
            phone: '',
            subject: '',
            message: '',
          })
        }, 3000)
      } else {
        setSubmitStatus('error')
        console.error('Contact form error:', data.error)
        
        // Reset error status after 5 seconds
        setTimeout(() => {
          setSubmitStatus('idle')
        }, 5000)
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      setSubmitStatus('error')
      
      // Reset error status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const tabs = [
    { id: 'contact', label: 'Get in Touch' },
    { id: 'office', label: 'Office Locations' },
    { id: 'corporate', label: 'Corporate Info' },
  ]

  const contactMethods = [
    {
      type: 'Investor Relations',
      title: 'Direct Line',
      phone: '+1 (778) 430-5680',
      email: 'info@teuton.com',
      description: 'For investment inquiries and shareholder relations',
      priority: true
    },
    {
      type: 'Corporate Affairs',
      title: 'General Inquiries',
      phone: '+1 (778) 430-5680',
      email: 'info@teuton.com',
      description: 'Media relations and partnership opportunities',
      priority: false
    }
  ]

  const officeInfo = [
    {
      title: 'Head Office',
      address: '2130 Crescent Road\nVictoria, BC V8S 2H3\nCanada',
      hours: 'Monday - Friday: 8:00 AM - 6:00 PM PST\nSaturday: 9:00 AM - 2:00 PM PST\nSunday: Closed',
      type: 'primary'
    },
    {
      title: 'Field Operations',
      address: '507 4th Avenue\nStewart, BC V0T 1W0\nCanada',
      hours: 'Seasonal Operations\nMay through October\nWeather Dependent',
      type: 'secondary'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ paddingTop: isMobile ? '80px' : '120px' }}>
      {/* Mountain Background with Aurora Effect - Matching Investors Page */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/rambackground.png"
          alt="Mountain landscape"
          fill
          className="object-cover"
          priority
          quality={90}
          style={{ 
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        />
        
        {/* Aurora gradient overlay */}
        <div className="absolute inset-0" 
             style={{ 
               pointerEvents: 'none',
               willChange: 'transform',
               transform: 'translateZ(0)'
             }}>
          {/* Layer 1: Base gradient */}
          <div className="absolute inset-0" style={{ 
            background: `linear-gradient(180deg, 
              rgba(3, 23, 48, 0.8) 0%, 
              rgba(3, 23, 48, 0.65) 15%,
              rgba(0, 106, 148, 0.3) 50%, 
              rgba(3, 23, 48, 0.7) 100%)`,
            willChange: 'transform',
            transform: 'translateZ(0)'
          }} />
          
          {/* Layer 2: Static gradient mesh */}
          <div 
            className="absolute inset-0 opacity-40"
            style={{ 
              background: `radial-gradient(circle at 20% 50%, rgba(0, 106, 148, 0.4) 0%, transparent 50%),
                          radial-gradient(circle at 80% 50%, rgba(3, 23, 48, 0.6) 0%, transparent 50%),
                          radial-gradient(circle at 50% 30%, rgba(0, 106, 148, 0.3) 0%, transparent 40%)`,
              filter: 'blur(40px)',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }} 
          />
          
          {/* Layer 3: Static glow */}
          <div 
            className="absolute inset-0 opacity-25"
            style={{ 
              background: `radial-gradient(ellipse at top, rgba(0, 106, 148, 0.3) 0%, transparent 60%)`,
              willChange: 'transform',
              transform: 'translateZ(0)'
            }} 
          />
        </div>
      </div>
      <GoldDustParticles />
      
      <div className="container mx-auto max-w-6xl relative z-10" style={{ padding: `0 clamp(1rem, 3vw, 1.5rem)` }}>
        {/* Page Header - Investors/RAM Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ marginBottom: `clamp(2rem, 5vw, 3rem)` }}
        >
          <motion.h1 
            initial={{ y: 100, opacity: 0, filter: 'blur(20px)' }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              filter: 'blur(0px)',
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              filter: { duration: 1.2 }
            }}
            className="text-white mb-4 md:mb-6 relative"
            style={{ 
              fontFamily: "'Aeonik Extended', sans-serif", 
              fontWeight: 500,
              fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : '4rem',
              lineHeight: '1.1',
              // Gradient text with subtle animation - matching RAM page
              background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 8s ease infinite',
              // Subtle text shadow for depth
              filter: 'drop-shadow(0 2px 20px rgba(160, 196, 255, 0.3))',
              // Mix blend mode for interesting interactions
              mixBlendMode: 'screen',
            }}>
            Contact Us
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              style={{
                // Matching gradient text like RAM page
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 10s ease infinite',
                letterSpacing: '0.02em',
                // Subtle dark shadow for prominence
                filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))',
              }}
            >
              Connect with Teuton Resources for investment opportunities and partnership inquiries
            </motion.p>
          </div>
        </motion.div>

        {/* Tab Navigation - Investors/RAM Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-4 justify-center flex-wrap"
          style={{ marginBottom: `clamp(2rem, 5vw, 3rem)` }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab.id ? 'opacity-100' : 'opacity-70'
              }`}
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 190, 152, 0.9) 0%, 
                  rgba(255, 190, 152, 0.8) 30%,
                  rgba(254, 217, 146, 0.7) 70%,
                  rgba(255, 190, 152, 0.85) 100%)`,
                backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: palette.dark,
                fontFamily: "Aeonik Extended, sans-serif",
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : '1rem',
                boxShadow: activeTab === tab.id 
                  ? '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)'
                  : '0 0 10px rgba(13, 15, 30, 0.3), 0 0 20px rgba(13, 15, 30, 0.2)'
              }}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Contact Methods - Dark Glass Layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(12, 14, 29, 0.85) 0%, 
                    rgba(12, 14, 29, 0.9) 50%, 
                    rgba(12, 14, 29, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                  padding: isMobile ? '1.5rem' : '2rem'
                }}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                  Direct Contact
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} 
                         className={`rounded-lg p-6 ${
                           method.priority 
                             ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20' 
                             : 'bg-black/30 border border-white/10'
                         }`}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{method.type}</h3>
                        {method.priority && (
                          <span className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.3) 0%, rgba(254, 217, 146, 0.3) 100%)',
                                  color: palette.peach,
                                  border: '1px solid rgba(255, 190, 152, 0.4)'
                                }}>
                            Priority
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 mb-4 text-sm">{method.description}</p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <FiPhone className="w-4 h-4" style={{ color: palette.peach }} />
                          <a href={`tel:${method.phone.replace(/\s/g, '')}`} 
                             className="text-white hover:text-white/80 transition-colors">
                            {method.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <FiMail className="w-4 h-4" style={{ color: palette.peach }} />
                          <a href={`mailto:${method.email}`} 
                             className="text-white hover:text-white/80 transition-colors">
                            {method.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact Form - Dark Glass Layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(12, 14, 29, 0.85) 0%, 
                    rgba(12, 14, 29, 0.9) 50%, 
                    rgba(12, 14, 29, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                  padding: isMobile ? '1.5rem' : '2rem'
                }}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                  Send Us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-3">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
                          placeholder="John Doe"
                          style={{ fontFamily: "Aeonik, sans-serif" }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-3">
                        Email Address *
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
                          placeholder="john@example.com"
                          style={{ fontFamily: "Aeonik, sans-serif" }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-white/70 mb-3">
                        Company
                      </label>
                      <div className="relative">
                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                          type="text"
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
                          placeholder="Your Company"
                          style={{ fontFamily: "Aeonik, sans-serif" }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white/70 mb-3">
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all backdrop-blur-sm"
                          placeholder="+1 (555) 123-4567"
                          style={{ fontFamily: "Aeonik, sans-serif" }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-3">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all appearance-none backdrop-blur-sm"
                      style={{ fontFamily: "Aeonik, sans-serif" }}
                    >
                      <option value="" className="bg-gray-900">Select a subject</option>
                      <option value="investment" className="bg-gray-900">Investment Inquiry</option>
                      <option value="exploration" className="bg-gray-900">Exploration Partnership</option>
                      <option value="media" className="bg-gray-900">Media Request</option>
                      <option value="corporate" className="bg-gray-900">Corporate Affairs</option>
                      <option value="general" className="bg-gray-900">General Inquiry</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-3">
                      Message *
                    </label>
                    <div className="relative">
                      <FiMessageSquare className="absolute left-3 top-3 text-white/40 w-4 h-4" />
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none backdrop-blur-sm"
                        placeholder="Tell us about your inquiry..."
                        style={{ fontFamily: "Aeonik, sans-serif" }}
                      />
                    </div>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className={`w-full md:w-auto px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2`}
                    style={{
                      background: submitStatus === 'success' 
                        ? 'linear-gradient(135deg, rgba(119, 255, 119, 0.9) 0%, rgba(119, 255, 119, 0.7) 100%)'
                        : submitStatus === 'error'
                        ? 'linear-gradient(135deg, rgba(255, 119, 119, 0.9) 0%, rgba(255, 119, 119, 0.7) 100%)'
                        : `linear-gradient(135deg, 
                          rgba(255, 190, 152, 0.9) 0%, 
                          rgba(255, 190, 152, 0.8) 30%,
                          rgba(254, 217, 146, 0.7) 70%,
                          rgba(255, 190, 152, 0.85) 100%)`,
                      backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                      WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: palette.dark,
                      fontFamily: "Aeonik Extended, sans-serif",
                      fontWeight: 500,
                      boxShadow: '0 0 20px rgba(13, 15, 30, 0.5), 0 0 40px rgba(13, 15, 30, 0.3)'
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <span>Sending...</span>
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          ✓
                        </motion.div>
                        <span>Message Sent!</span>
                      </>
                    ) : submitStatus === 'error' ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          ✗
                        </motion.div>
                        <span>Error - Try Again</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <FiSend className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </div>
          )}

          {activeTab === 'office' && (
            <div className="space-y-6">
              {/* Office Locations - Dark Glass Layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(12, 14, 29, 0.85) 0%, 
                    rgba(12, 14, 29, 0.9) 50%, 
                    rgba(12, 14, 29, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                  padding: isMobile ? '1.5rem' : '2rem'
                }}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                  Our Locations
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {officeInfo.map((office, index) => (
                    <div key={index} 
                         className={`rounded-lg p-6 ${
                           office.type === 'primary' 
                             ? 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20' 
                             : 'bg-black/30 border border-white/10'
                         }`}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <FiMapPin className="w-5 h-5" style={{ color: palette.peach }} />
                          {office.title}
                        </h3>
                        {office.type === 'primary' && (
                          <span className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(255, 190, 152, 0.3) 0%, rgba(254, 217, 146, 0.3) 100%)',
                                  color: palette.peach,
                                  border: '1px solid rgba(255, 190, 152, 0.4)'
                                }}>
                            Primary
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-white/60 text-sm mb-2">Address:</p>
                          <p className="text-white whitespace-pre-line">{office.address}</p>
                        </div>
                        
                        <div>
                          <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                            <FiClock className="w-4 h-4" />
                            Hours:
                          </p>
                          <p className="text-white/80 whitespace-pre-line text-sm">{office.hours}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'corporate' && (
            <div className="space-y-6">
              {/* Corporate Information - Dark Glass Layer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, 
                    rgba(12, 14, 29, 0.85) 0%, 
                    rgba(12, 14, 29, 0.9) 50%, 
                    rgba(12, 14, 29, 0.85) 100%)`,
                  backdropFilter: 'blur(20px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.4), 
                    inset 0 2px 4px 0 rgba(255, 255, 255, 0.05), 
                    inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2)`,
                  padding: isMobile ? '1.5rem' : '2rem'
                }}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6"
                    style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
                  Corporate Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FiGlobe className="w-5 h-5" style={{ color: palette.peach }} />
                      Stock Exchange
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Primary Exchange</span>
                        <span className="text-white font-medium">TSX-V: TUO</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Frankfurt</span>
                        <span className="text-white font-medium">KD7.F</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">ISIN</span>
                        <span className="text-white font-medium">CA82772U1075</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/60">CUSIP</span>
                        <span className="text-white font-medium">82772H</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Professional Services
                    </h3>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-white/60 mb-1">Transfer Agent:</p>
                        <p className="text-white">Computershare Trust Company</p>
                        <p className="text-white/50">510 Burrard St., Vancouver, BC</p>
                        <p className="text-white/50">Phone: +1 (604) 661-0247</p>
                      </div>
                      
                      <div>
                        <p className="text-white/60 mb-1">Auditor:</p>
                        <p className="text-white">Charlton + Company</p>
                        <p className="text-white/50">Suite 1111, 1100 Melville Street</p>
                        <p className="text-white/50">Vancouver, BC V6E 4A6</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="mt-6 bg-black/30 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Company Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Incorporation</span>
                        <span className="text-white font-medium">June 15, 1980</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Jurisdiction</span>
                        <span className="text-white font-medium">British Columbia, Canada</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/60">Fiscal Year End</span>
                        <span className="text-white font-medium">March 31</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">Industry</span>
                        <span className="text-white font-medium">Mining & Exploration</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/60">NAICS Code</span>
                        <span className="text-white font-medium">212220</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-white/60">Website</span>
                        <a href="https://teuton.com" className="hover:opacity-80 transition-colors" style={{ color: palette.peach }}>
                          teuton.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Bottom spacing for mobile */}
      <div style={{ paddingBottom: isMobile ? '100px' : '50px' }} />
    </div>
  )
}
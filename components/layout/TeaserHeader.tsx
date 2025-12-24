'use client'

import React, { useEffect, useState } from 'react'
import TickerSwitcher from '@/components/landing/TickerSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

interface TeaserHeaderProps {
  logoTransform?: number
  isLandingPage?: boolean
}

const TeaserHeader: React.FC<TeaserHeaderProps> = ({ logoTransform = 0.6, isLandingPage = true }) => {
  const [mounted, setMounted] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Preload font files to ensure they load correctly */}
      <link rel="preload" as="font" type="font/woff2" href="/images/Aeonik-Light.woff2" crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href="/images/Aeonik-Regular.woff2" crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href="/images/Aeonik-Medium.woff2" crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href="/images/AeonikExtended-Medium.woff2" crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href="/images/AeonikExtended-Bold.woff2" crossOrigin="" />
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        /* Sparkle animations */
        @keyframes sparkle-0 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(-20px, -20px) scale(1); opacity: 0; }
        }
        @keyframes sparkle-1 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(20px, -20px) scale(1); opacity: 0; }
        }
        @keyframes sparkle-2 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(-20px, 20px) scale(1); opacity: 0; }
        }
        @keyframes sparkle-3 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(20px, 20px) scale(1); opacity: 0; }
        }
        @keyframes sparkle-4 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(0, -25px) scale(1); opacity: 0; }
        }
        @keyframes sparkle-5 {
          0% { transform: translate(0, 0) scale(0); opacity: 1; }
          100% { transform: translate(0, 25px) scale(1); opacity: 0; }
        }
      `}</style>
      
      <header 
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500 bg-nile-blue/5 backdrop-blur-sm"
        style={{
          background: isLandingPage 
            ? 'transparent' 
            : 'linear-gradient(180deg, rgba(13, 15, 30, 0.98) 0%, rgba(13, 15, 30, 0.95) 100%)',
          backdropFilter: isLandingPage ? 'none' : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: isLandingPage ? 'none' : 'blur(20px) saturate(180%)',
        }}
      >
        <div className="w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <nav className="w-full flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <div
                  className={`relative group transition-all duration-500 ml-[2%] ${
                    typeof window !== 'undefined' && window.innerWidth < 768
                      ? (window.innerWidth >= 390 ? 'h-[4.125rem] w-[16.5rem]' : 'h-[3.4375rem] w-[13.75rem]')
                      : 'h-[5.25rem] w-[24.375rem]'
                  }`}
                  style={{ display: 'block', cursor: 'default' }}
                >
                  {/* Dark gradient background */}
                  <div
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.1) 50%, transparent 70%)',
                      filter: 'blur(20px)',
                      transform: 'scale(3)',
                      zIndex: 1,
                    }}
                    className="absolute inset-0 scale-[3]"
                  />
                  
                  <div 
                    style={{ zIndex: 2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {/* Glow effect */}
                    <div className="absolute w-full h-full" style={{
                      background: 'radial-gradient(ellipse at center, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0.05) 30%, transparent 60%)',
                      filter: 'blur(20px)',
                    }} />
                    
                    {/* Sparkle particles */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ zIndex: 1000 }}>
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-white to-gray-200"
                          style={{
                            left: '50%',
                            top: '50%',
                            animation: `sparkle-${i} 2s ease-out infinite`,
                            animationDelay: `${i * 0.2}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* SVG Filter */}
                  <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                      <filter id="metallic-silver">
                        <feColorMatrix type="matrix" values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0" />
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                          <feFuncR type="linear" slope="1.2" intercept="0.1" />
                          <feFuncG type="linear" slope="1.2" intercept="0.1" />
                          <feFuncB type="linear" slope="1.2" intercept="0.15" />
                        </feComponentTransfer>
                        <feGaussianBlur stdDeviation="0.3" result="blur" />
                        <feSpecularLighting result="specOut" specularExponent="25" lighting-color="#ffffff" surfaceScale="2">
                          <fePointLight x="-50" y="30" z="150" />
                        </feSpecularLighting>
                        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut2" />
                        <feComposite in="SourceGraphic" in2="specOut2" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="litPaint" />
                        <feColorMatrix type="matrix" values="0.95 0 0 0 0 0 0.95 0 0 0 0 0 1.05 0 0 0 0 0 1 0" />
                      </filter>
                    </defs>
                  </svg>
                  
                  <img
                    src="/images/teuton-logo.svg"
                    alt="Teuton Resources"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                      WebkitFilter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                      transform: `scale(${logoTransform}) translateZ(0)`,
                      transformOrigin: 'left center',
                    }}
                    className="w-full h-full object-contain relative z-10 transition-all duration-500"
                  />
                </div>
              </div>

              {/* Spacer for center alignment */}
              <div className="flex-1" />

              {/* Contact Button */}
              <button
                onClick={() => setShowContactModal(true)}
                style={{
                  padding: '10px 20px',
                  marginRight: '20px',
                  background: `linear-gradient(135deg, 
                    rgba(13, 15, 30, 0.9) 0%, 
                    rgba(13, 15, 30, 0.8) 100%)`,
                  backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                  border: '1px solid rgba(254, 217, 146, 0.3)',
                  borderRadius: '50px',
                  color: '#fed992',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: "'Aeonik Extended', sans-serif",
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(254, 217, 146, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}
                className="hidden md:block"
              >
                Contact
              </button>

              {/* Stock Ticker Switcher */}
              <div className="hidden md:flex items-center mr-8">
                <TickerSwitcher />
              </div>
            </nav>
          </div>
        </div>
        
        {/* Bottom border */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-[1px] bg-white/10" />
      </header>

      {/* Contact Modal - Made smaller vertically */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 2147483646,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => {
              setShowContactModal(false)
              setSubmitStatus('idle')
              setContactFormData({ name: '', email: '', message: '' })
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '480px',
                maxHeight: '75vh',  // Reduced from 90vh
                overflow: 'auto',
                background: `linear-gradient(135deg, 
                  rgba(13, 15, 30, 0.98) 0%, 
                  rgba(13, 15, 30, 0.95) 100%)`,
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                border: '1px solid rgba(254, 217, 146, 0.2)',
                borderRadius: '20px',
                padding: '25px',  // Reduced from 30px
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(254, 217, 146, 0.1)',
                color: '#fed992',
                fontFamily: "'Aeonik', sans-serif",
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowContactModal(false)
                  setSubmitStatus('idle')
                  setContactFormData({ name: '', email: '', message: '' })
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'transparent',
                  border: '1px solid rgba(254, 217, 146, 0.3)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#fed992',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(254, 217, 146, 0.1)'
                  e.currentTarget.style.transform = 'scale(1.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                ×
              </button>

              {/* Modal Header */}
              <h2 style={{
                fontSize: '24px',  // Reduced from 28px
                fontWeight: 600,
                fontFamily: "'Aeonik Extended', sans-serif",
                marginBottom: '20px',  // Reduced from 25px
                background: 'linear-gradient(135deg, #fed992 0%, #ffff77 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.02em',
              }}>
                Get in Touch
              </h2>

              {/* Contact Information - More compact */}
              <div style={{
                marginBottom: '20px',  // Reduced from 30px
                paddingBottom: '18px',  // Reduced from 25px
                borderBottom: '1px solid rgba(254, 217, 146, 0.2)',
              }}>
                <h3 style={{
                  fontSize: '16px',  // Reduced from 18px
                  fontWeight: 500,
                  fontFamily: "'Aeonik Extended', sans-serif",
                  marginBottom: '12px',  // Reduced from 15px
                  color: '#ffff77',
                }}>
                  Silver Grail Resources Ltd.
                </h3>
                
                <div style={{ marginBottom: '8px', fontSize: '13px', color: '#b5ccda' }}>  {/* Reduced from 14px */}
                  <strong style={{ color: '#fed992' }}>Address:</strong> 2130 Crescent Road, Victoria, BC V8S 2H3
                </div>
                
                <div style={{ marginBottom: '8px', fontSize: '13px', color: '#b5ccda' }}>
                  <strong style={{ color: '#fed992' }}>Phone:</strong> (778) 430-5680
                </div>
                
                <div style={{ fontSize: '13px', color: '#b5ccda' }}>
                  <strong style={{ color: '#fed992' }}>Email:</strong> info@silvergrail.com
                </div>
              </div>

              {/* Contact Form - More compact */}
              {submitStatus === 'success' ? (
                <div style={{
                  padding: '25px',  // Reduced from 30px
                  textAlign: 'center',
                  background: 'rgba(254, 217, 146, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(254, 217, 146, 0.2)',
                }}>
                  <div style={{
                    fontSize: '40px',  // Reduced from 48px
                    marginBottom: '12px',
                  }}>
                    ✓
                  </div>
                  <h3 style={{
                    fontSize: '18px',  // Reduced from 20px
                    fontWeight: 500,
                    marginBottom: '8px',
                    color: '#ffff77',
                  }}>
                    Message Sent Successfully!
                  </h3>
                  <p style={{
                    fontSize: '13px',  // Reduced from 14px
                    color: '#b5ccda',
                  }}>
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : submitStatus === 'error' ? (
                <div style={{
                  padding: '25px',
                  textAlign: 'center',
                  background: 'rgba(255, 100, 100, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 100, 100, 0.3)',
                }}>
                  <div style={{
                    fontSize: '40px',
                    marginBottom: '12px',
                    color: '#ff6464',
                  }}>
                    ✕
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    marginBottom: '8px',
                    color: '#ff6464',
                  }}>
                    Failed to Send Message
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#b5ccda',
                    marginBottom: '15px',
                  }}>
                    There was an error sending your message. Please try again or contact us directly.
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(254, 217, 146, 0.2)',
                      border: '1px solid rgba(254, 217, 146, 0.3)',
                      borderRadius: '6px',
                      color: '#fed992',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(254, 217, 146, 0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(254, 217, 146, 0.2)'
                    }}
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  
                  try {
                    const response = await fetch('/api/contact', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(contactFormData)
                    })

                    if (response.ok) {
                      setSubmitStatus('success')
                      // Reset and close modal after 3 seconds
                      setTimeout(() => {
                        setShowContactModal(false)
                        setSubmitStatus('idle')
                        setContactFormData({ name: '', email: '', message: '' })
                      }, 3000)
                    } else {
                      // Handle error
                      const error = await response.json()
                      console.error('Failed to send message:', error)
                      setSubmitStatus('error')
                      setTimeout(() => {
                        setSubmitStatus('idle')
                      }, 3000)
                    }
                  } catch (error) {
                    console.error('Error sending message:', error)
                    setSubmitStatus('error')
                    setTimeout(() => {
                      setSubmitStatus('idle')
                    }, 3000)
                  } finally {
                    setIsSubmitting(false)
                  }
                }}>
                  <h3 style={{
                    fontSize: '14px',  // Reduced from 16px
                    fontWeight: 500,
                    marginBottom: '16px',  // Reduced from 20px
                    color: '#fed992',
                  }}>
                    Send us a Message
                  </h3>

                  {/* Name Field */}
                  <div style={{ marginBottom: '15px' }}>  {/* Reduced from 20px */}
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',  // Reduced from 8px
                      fontSize: '13px',  // Reduced from 14px
                      color: '#fed992',
                      fontWeight: 500,
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',  // Reduced from 12px
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(254, 217, 146, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',  // Reduced from 14px
                        fontFamily: "'Aeonik', sans-serif",
                        transition: 'all 0.3s ease',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(254, 217, 146, 0.6)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(254, 217, 146, 0.3)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>

                  {/* Email Field */}
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '13px',
                      color: '#fed992',
                      fontWeight: 500,
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactFormData.email}
                      onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(254, 217, 146, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontFamily: "'Aeonik', sans-serif",
                        transition: 'all 0.3s ease',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(254, 217, 146, 0.6)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(254, 217, 146, 0.3)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>

                  {/* Message Field */}
                  <div style={{ marginBottom: '20px' }}>  {/* Reduced from 25px */}
                    <label style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '13px',
                      color: '#fed992',
                      fontWeight: 500,
                    }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={3}  // Reduced from 5
                      value={contactFormData.message}
                      onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(254, 217, 146, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontFamily: "'Aeonik', sans-serif",
                        transition: 'all 0.3s ease',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '80px',  // Reduced from 120px
                        maxHeight: '150px',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(254, 217, 146, 0.6)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(254, 217, 146, 0.3)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',  // Reduced from 14px
                      background: isSubmitting 
                        ? 'rgba(254, 217, 146, 0.3)'
                        : 'linear-gradient(135deg, rgba(254, 217, 146, 0.9) 0%, rgba(255, 255, 119, 0.8) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#0d0f1e',
                      fontSize: '14px',  // Reduced from 15px
                      fontWeight: 600,
                      fontFamily: "'Aeonik Extended', sans-serif",
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(254, 217, 146, 0.4)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}

export default TeaserHeader
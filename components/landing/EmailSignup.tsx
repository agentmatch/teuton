'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailSignupProps {
  inline?: boolean
}

const EmailSignup: React.FC<EmailSignupProps> = ({ inline = false }) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          source: 'teaser_page',
          type: 'site_launch'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thank you! We\'ll notify you when we launch.')
        setEmail('')
        
        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 5000)
      } else {
        setStatus('error')
        setMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Connection error. Please try again.')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={inline ? {
        display: 'inline-block',
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        border: '1px solid rgba(254, 217, 146, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(254, 217, 146, 0.2)',
        maxWidth: '500px',
        width: '100%',
      } : {
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: '24px 32px',
        background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        border: '1px solid rgba(254, 217, 146, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(254, 217, 146, 0.2)',
        maxWidth: '500px',
        width: '100%',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{
          background: 'linear-gradient(135deg, #FFFF77 0%, #FED992 50%, #FFFF77 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '16px',
          fontFamily: "'Aeonik Extended', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          margin: 0,
          marginBottom: '8px',
        }}>
          Be First to Know
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '14px',
          marginTop: '4px',
          marginBottom: '12px',
          fontFamily: "'Aeonik', sans-serif",
          lineHeight: 1.5,
        }}>
          Get exclusive updates on Silver Grail Resources and be notified when our full site launches
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontFamily: "'Aeonik', sans-serif",
              outline: 'none',
              transition: 'all 0.3s ease',
              ...(status === 'success' ? { borderColor: 'rgba(119, 255, 119, 0.5)' } : {}),
              ...(status === 'error' ? { borderColor: 'rgba(255, 119, 119, 0.5)' } : {}),
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(254, 217, 146, 0.5)'
              e.target.style.background = 'rgba(255, 255, 255, 0.08)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.target.style.background = 'rgba(255, 255, 255, 0.05)'
            }}
          />
          <motion.button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            whileHover={{ scale: status === 'loading' || status === 'success' ? 1 : 1.02 }}
            whileTap={{ scale: status === 'loading' || status === 'success' ? 1 : 0.98 }}
            style={{
              padding: '12px 24px',
              background: status === 'success' 
                ? 'linear-gradient(135deg, #77FF77 0%, #66DD66 100%)'
                : 'linear-gradient(135deg, #FFFF77 0%, #FED992 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#0d0f1e',
              fontSize: '14px',
              fontFamily: "'Aeonik Extended', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: status === 'loading' || status === 'success' ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(254, 217, 146, 0.3)',
              minWidth: '120px',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === 'loading' ? 'Subscribing...' : 
             status === 'success' ? '✓ Subscribed' : 
             'Notify Me'}
          </motion.button>
        </div>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                color: status === 'error' ? '#FF7777' : '#77FF77',
                fontSize: '12px',
                fontFamily: "'Aeonik', sans-serif",
                margin: '4px 0 0 0',
                textAlign: 'center',
              }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      <p style={{
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '11px',
        marginTop: '16px',
        textAlign: 'center',
        fontFamily: "'Aeonik', sans-serif",
      }}>
        We respect your privacy. Unsubscribe at any time.
      </p>
    </motion.div>
  )
}

export default EmailSignup
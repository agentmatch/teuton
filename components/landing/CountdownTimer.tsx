'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface CountdownTimerProps {
  targetDate: Date
  onComplete?: () => void
  inline?: boolean
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, onComplete, inline = false }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        if (onComplete) onComplete()
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={inline ? {
        display: 'inline-block',
        padding: '20px 40px',
        background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        border: '1px solid rgba(254, 217, 146, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(254, 217, 146, 0.2)',
      } : {
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: '20px 40px',
        background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)',
        backdropFilter: 'blur(30px) saturate(200%)',
        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
        border: '1px solid rgba(254, 217, 146, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(254, 217, 146, 0.2)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h3 style={{
          background: 'linear-gradient(135deg, #FFFF77 0%, #FED992 50%, #FFFF77 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '14px',
          fontFamily: "'Aeonik Extended', sans-serif",
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          margin: 0,
          textShadow: '0 0 20px rgba(254, 217, 146, 0.4)',
        }}>
          Website Launch Countdown
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
          marginTop: '4px',
          fontFamily: "'Aeonik', sans-serif",
        }}>
          Interactive Maps • Exclusive Drone Footage • All New Content
        </p>
      </div>

      <div style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
      }}>
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' },
        ].map((item, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <motion.div
              key={`${index}-${item.value}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: '28px',
                fontWeight: 700,
                fontFamily: "'Aeonik Extended', sans-serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {String(item.value).padStart(2, '0')}
            </motion.div>
            <div style={{
              fontSize: '10px',
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontFamily: "'Aeonik', sans-serif",
            }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default CountdownTimer
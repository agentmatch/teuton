'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CategoryNavProps {
  currentCategory?: 'advanced' | 'early' | 'royalties'
  onCategoryChange?: (category: 'advanced' | 'early' | 'royalties') => void
  onPropertySelect?: (property: string) => void
}

// Define which properties belong to each category
const CATEGORY_PROPERTIES = {
  advanced: [
    { name: 'TENNYSON', hectares: '5,200 Ha' },
    { name: 'DEL NORTE', hectares: '3,800 Ha' },
  ],
  early: [
    { name: 'ESKAY RIFT', hectares: '2,100 Ha' },
    { name: 'BIG GOLD', hectares: '1,900 Ha' },
    { name: 'FOUR J\'S', hectares: '2,400 Ha' },
    { name: 'PEARSON', hectares: '1,600 Ha' },
    { name: 'LEDUC', hectares: '3,100 Ha' },
  ],
  royalties: [
    { name: 'TREATY CREEK', hectares: 'NSR Royalty' },
    { name: 'ESKAY CREEK', hectares: 'NSR Royalty' },
  ],
}

export default function CategoryNav({
  currentCategory = 'advanced',
  onCategoryChange,
  onPropertySelect
}: CategoryNavProps) {
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [bottomOffset, setBottomOffset] = useState(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Handle visual viewport changes (Android browser UI)
    const handleViewport = () => {
      if (window.visualViewport) {
        const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop
        setBottomOffset(Math.max(0, offset))
      }
    }

    handleViewport()
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewport)
      window.visualViewport.addEventListener('scroll', handleViewport)
    }

    return () => {
      window.removeEventListener('resize', checkMobile)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewport)
        window.visualViewport.removeEventListener('scroll', handleViewport)
      }
    }
  }, [])

  const categories = [
    { id: 'advanced', label: 'Advanced Stage' },
    { id: 'early', label: 'Early Stage' },
    { id: 'royalties', label: 'Royalties' },
  ] as const

  const handleCategoryClick = (categoryId: 'advanced' | 'early' | 'royalties') => {
    if (onCategoryChange) {
      onCategoryChange(categoryId)
    }
  }

  const handlePropertyClick = (propertyName: string) => {
    if (onPropertySelect) {
      onPropertySelect(propertyName)
    }
  }

  const currentProperties = CATEGORY_PROPERTIES[currentCategory] || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{
        position: 'fixed',
        bottom: bottomOffset,
        left: 0,
        right: 0,
        zIndex: 100005,
        background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.3) 0%, rgba(2, 27, 71, 0.2) 50%, rgba(2, 27, 71, 0.1) 100%)',
        backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transition: 'bottom 0.3s ease',
      }}
    >
      {/* Properties Row - shows properties for selected category */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '6px' : '12px',
            padding: isMobile ? '10px 8px' : '14px 24px',
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {currentProperties.map((property) => {
            const isHovered = hoveredProperty === property.name
            return (
              <motion.button
                key={property.name}
                onClick={() => handlePropertyClick(property.name)}
                onMouseEnter={() => setHoveredProperty(property.name)}
                onMouseLeave={() => setHoveredProperty(null)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: isMobile ? '6px 10px' : '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: "'Switzer Variable', sans-serif",
                  fontSize: isMobile ? '10px' : '12px',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease',
                  background: isHovered
                    ? 'rgba(255, 255, 119, 0.15)'
                    : 'transparent',
                  color: isHovered ? '#FFFF77' : 'rgba(250, 245, 228, 0.8)',
                }}
              >
                {property.name}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Category Tabs Row - full width */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '52px',
          padding: '0 16px',
        }}
      >
        {categories.map((category) => {
          const isActive = currentCategory === category.id

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#FFFF77' : 'rgba(250, 245, 228, 0.7)',
                fontSize: '10px',
                fontWeight: 500,
                textTransform: 'uppercase',
                padding: '8px',
                minWidth: '80px',
                textAlign: 'center',
                fontFamily: "'Switzer Variable', sans-serif",
                cursor: 'pointer',
                transition: 'color 0.2s ease',
              }}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

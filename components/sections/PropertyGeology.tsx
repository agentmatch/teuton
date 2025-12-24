'use client'

import { Property } from '@/lib/properties-data'
import { FiLayers } from 'react-icons/fi'

interface PropertyGeologyProps {
  property: Property
}

export function PropertyGeology({ property }: PropertyGeologyProps) {
  const sections = [
    {
      title: 'Mineralization',
      items: property.geology.mineralization,
      color: 'primary',
    },
    {
      title: 'Alteration',
      items: property.geology.alteration,
      color: 'gold',
    },
    {
      title: 'Structural Controls',
      items: property.geology.structures,
      color: 'primary',
    },
  ]

  return (
    <section 
      className="py-12"
      style={{ backgroundColor: '#073440' }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div
          className="text-center mb-8"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500
            }}
          >
            <span style={{ color: '#FFFF77' }}>
              Geological
            </span>{' '}
            <span style={{ color: '#E5E5E5' }}>Setting</span>
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{
              fontFamily: "'Aeonik Extended', sans-serif",
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            Understanding the geology that drives mineralization potential
          </p>
        </div>

        <div
          className="rounded-2xl p-6 mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
            backdropFilter: 'blur(30px) saturate(180%)',
            WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="flex items-start gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.2) 0%, rgba(255, 255, 119, 0.1) 100%)',
                border: '1px solid rgba(255, 255, 119, 0.3)'
              }}
            >
              <FiLayers className="w-6 h-6" style={{ color: '#FFFF77' }} />
            </div>
            <div className="flex-1">
              <h3 
                className="text-2xl font-semibold mb-3"
                style={{
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 500,
                  color: '#E5E5E5'
                }}
              >
                Geological Summary
              </h3>
              <p 
                className="text-lg leading-relaxed"
                style={{
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                {property.geology.summary}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <h3 
                className="text-xl font-semibold mb-4"
                style={{
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 500,
                  color: '#E5E5E5'
                }}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div 
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: section.color === 'gold' ? '#FFFF77' : '#E5E5E5' }}
                    />
                    <span 
                      style={{
                        fontFamily: "'Aeonik Extended', sans-serif",
                        fontWeight: 400,
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
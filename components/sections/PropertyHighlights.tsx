'use client'

import { Property } from '@/lib/properties-data'
import { FiCheckCircle } from 'react-icons/fi'

interface PropertyHighlightsProps {
  property: Property
}

export function PropertyHighlights({ property }: PropertyHighlightsProps) {
  return (
    <section 
      className="py-12 text-white relative overflow-hidden"
      style={{ backgroundColor: '#073440' }}
    >
      <div 
        className="absolute inset-0"
        style={{ 
          background: 'linear-gradient(135deg, rgba(7, 52, 64, 0.8) 0%, rgba(10, 60, 70, 0.6) 100%)' 
        }} 
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div
          className="text-center mb-8"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500,
              color: '#E5E5E5'
            }}
          >
            Key <span style={{ color: '#FFFF77' }}>Highlights</span>
          </h2>
          <p 
            className="text-xl max-w-3xl mx-auto"
            style={{
              fontFamily: "'Aeonik Extended', sans-serif",
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            What makes this property exceptional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {property.highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="rounded-xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.3) 0%, rgba(255, 255, 119, 0.2) 100%)',
                    boxShadow: '0 0 10px rgba(255, 255, 119, 0.3)'
                  }}
                >
                  <FiCheckCircle className="w-6 h-6" style={{ color: '#FFFF77' }} />
                </div>
                <div>
                  <h3 
                    className="text-xl font-semibold mb-2"
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 500,
                      color: '#E5E5E5'
                    }}
                  >
                    {highlight.title}
                  </h3>
                  <p 
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    {highlight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
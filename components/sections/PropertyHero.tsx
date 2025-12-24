'use client'

import { Property } from '@/lib/properties-data'
import { FiMapPin, FiActivity } from 'react-icons/fi'

interface PropertyHeroProps {
  property: Property
}

export function PropertyHero({ property }: PropertyHeroProps) {
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#073440' }}
    >
      {/* Ocean gradient background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#073440' }} />
      
      {/* Background map with subtle claims - temporarily disabled for debugging */}
      {/* <BackgroundMap /> */}
      
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div
          className="max-w-4xl mx-auto text-center"
        >
          <div
            className="inline-block mb-6"
          >
            <span 
              className="px-6 py-2 rounded-full font-medium"
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.1) 0%, rgba(255, 255, 119, 0.05) 100%)',
                backdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                border: '1px solid rgba(255, 255, 119, 0.2)',
                color: '#FFFF77'
              }}
            >
              {property.status || 'Active Exploration'}
            </span>
          </div>
          
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{
              fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 500,
              color: '#E5E5E5'
            }}
          >
            {property.name}
          </h1>
          
          <p
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
            style={{
              fontFamily: "'Aeonik Extended', sans-serif",
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.7)'
            }}
          >
            {property.description}
          </p>
          
          <div
            className="flex flex-wrap justify-center gap-6"
            style={{ color: 'rgba(255, 255, 255, 0.8)' }}
          >
            <div className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5" />
              <span>{property.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiActivity className="w-5 h-5" />
              <span>{property.size}</span>
            </div>
          </div>
          
          <div
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {property.minerals.map((mineral) => (
              <span
                key={mineral}
                className="px-4 py-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  backdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                  border: '1px solid rgba(255, 255, 119, 0.1)',
                  color: '#E5E5E5',
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 500
                }}
              >
                {mineral}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white/50"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  )
}
'use client'

import { Property } from '@/lib/properties-data'
import { FiTrendingUp, FiClock, FiTarget } from 'react-icons/fi'

interface PropertyOverviewProps {
  property: Property
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  return (
    <section 
      className="py-12"
      style={{ backgroundColor: '#073440' }}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{
                fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif",
                fontWeight: 500,
                color: '#E5E5E5'
              }}
            >
              <span style={{ color: '#FFFF77' }}>
                Property
              </span>{' '}
              <span>Overview</span>
            </h2>
            
            <div className="max-w-none">
              <p 
                className="text-lg leading-relaxed"
                style={{
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 400,
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                {property.overview}
              </p>
            </div>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.2) 0%, rgba(255, 255, 119, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 119, 0.3)'
                  }}
                >
                  <FiClock className="w-6 h-6" style={{ color: '#FFFF77' }} />
                </div>
                <div 
                  className="p-4 flex-1 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <h3 
                    className="font-semibold mb-1"
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 500,
                      color: '#E5E5E5'
                    }}
                  >
                    Exploration History
                  </h3>
                  <p 
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    {property.exploration.history}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.2) 0%, rgba(255, 255, 119, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 119, 0.3)'
                  }}
                >
                  <FiTrendingUp className="w-6 h-6" style={{ color: '#FFFF77' }} />
                </div>
                <div 
                  className="p-4 flex-1 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <h3 
                    className="font-semibold mb-1"
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 500,
                      color: '#E5E5E5'
                    }}
                  >
                    Recent Developments
                  </h3>
                  <p 
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    {property.exploration.recent}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.2) 0%, rgba(255, 255, 119, 0.1) 100%)',
                    border: '1px solid rgba(255, 255, 119, 0.3)'
                  }}
                >
                  <FiTarget className="w-6 h-6" style={{ color: '#FFFF77' }} />
                </div>
                <div 
                  className="p-4 flex-1 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <h3 
                    className="font-semibold mb-1"
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 500,
                      color: '#E5E5E5'
                    }}
                  >
                    Exploration Potential
                  </h3>
                  <p 
                    style={{
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 400,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    {property.exploration.potential}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div
            className="relative"
          >
            <div 
              className="relative h-[500px] overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: '#073440' }}
              >
                {/* Property map or image would go here */}
              </div>
              
              {/* Floating stats */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div 
                  className="p-6 rounded-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                    backdropFilter: 'blur(30px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 119, 0.2)'
                  }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 700,
                          color: '#FFFF77'
                        }}
                      >
                        {property.minerals.length}
                      </div>
                      <div 
                        className="text-sm"
                        style={{
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 400,
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}
                      >
                        Target Minerals
                      </div>
                    </div>
                    <div className="text-center">
                      <div 
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 700,
                          color: '#FFFF77'
                        }}
                      >
                        {property.highlights?.length || 0}
                      </div>
                      <div 
                        className="text-sm"
                        style={{
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 400,
                          color: 'rgba(255, 255, 255, 0.6)'
                        }}
                      >
                        Key Features
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
'use client'

import { Property } from '@/lib/properties-data'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FiArrowLeft, FiArrowRight, FiDownload, FiMap } from 'react-icons/fi'
import Image from 'next/image'

interface PropertyGalleryProps {
  property: Property
}

export function PropertyGallery({ property }: PropertyGalleryProps) {
  // Find next and previous properties
  const properties = require('@/lib/properties-data').properties
  const currentIndex = properties.findIndex((p: Property) => p.id === property.id)
  const prevProperty = currentIndex > 0 ? properties[currentIndex - 1] : null
  const nextProperty = currentIndex < properties.length - 1 ? properties[currentIndex + 1] : null

  return (
    <section 
      className="py-12"
      style={{ backgroundColor: '#073440' }}
    >
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Special Goliath Map Section for Fiji Property */}
        {property.slug === 'fiji' && (
          <div
            className=""
          >
            <div 
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FiMap 
                  className="w-6 h-6"
                  style={{ color: '#FFFF77' }}
                />
                <h3 
                  className="text-2xl font-semibold"
                  style={{
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 500,
                    color: '#E5E5E5'
                  }}
                >
                  Regional Context Map
                </h3>
              </div>
              
              <div className="relative w-full mb-6">
                <div 
                  className="w-full rounded-lg overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(7, 52, 64, 0.3)',
                    border: '1px solid rgba(255, 255, 119, 0.1)'
                  }}
                >
                  <div className="relative">
                    <iframe
                      src="/images/GoliathMapFinal.pdf#view=FitH"
                      className="w-full"
                      height="600"
                      title="Fiji Property Regional Context Map"
                      style={{ border: 'none' }}
                    />
                    {/* Fallback message overlay */}
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                      style={{ 
                        background: 'linear-gradient(135deg, rgba(7, 52, 64, 0.95) 0%, rgba(7, 52, 64, 0.9) 100%)',
                        zIndex: -1
                      }}
                    >
                      <FiMap 
                        className="w-16 h-16 mb-4"
                        style={{ color: 'rgba(255, 255, 119, 0.3)' }}
                      />
                      <p 
                        className="text-lg mb-2"
                        style={{
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 500,
                          color: 'rgba(255, 255, 255, 0.7)'
                        }}
                      >
                        Regional Context Map
                      </p>
                      <p 
                        className="text-sm"
                        style={{
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 400,
                          color: 'rgba(255, 255, 255, 0.5)'
                        }}
                      >
                        Click download button below to view
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <a 
                  href="/images/GoliathMapFinal.pdf" 
                  download="Fiji-Goliath-Regional-Map.pdf"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FFFF77 0%, #E5E500 100%)',
                    color: '#000',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 600,
                    boxShadow: '0 4px 20px rgba(255, 255, 119, 0.3)'
                  }}
                >
                  <FiDownload className="w-5 h-5" />
                  Download Regional Map (PDF)
                </a>
                
                <p 
                  className="text-sm"
                  style={{
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 400,
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  Shows Fiji property in relation to Goliath Resources' discoveries
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation to other properties */}
        <div
          className="pt-12"
          style={{ borderTop: '1px solid rgba(255, 255, 119, 0.2)' }}
        >
          <div className="flex justify-between items-center">
            {prevProperty ? (
              <Link href={`/properties/${prevProperty.slug}`}>
                <Button 
                  variant="outline" 
                  className="group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                    border: '1px solid rgba(255, 255, 119, 0.3)',
                    color: '#E5E5E5',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 500
                  }}
                >
                  <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                  {prevProperty.name}
                </Button>
              </Link>
            ) : (
              <div />
            )}
            
            <Link href="/properties">
              <Button 
                variant="ghost"
                style={{
                  color: '#FFFF77',
                  fontFamily: "'Aeonik Extended', sans-serif",
                  fontWeight: 500
                }}
              >
                All Properties
              </Button>
            </Link>
            
            {nextProperty ? (
              <Link href={`/properties/${nextProperty.slug}`}>
                <Button 
                  variant="outline" 
                  className="group"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    backdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(0.9)',
                    border: '1px solid rgba(255, 255, 119, 0.3)',
                    color: '#E5E5E5',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 500
                  }}
                >
                  {nextProperty.name}
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
import React from 'react'

export default function MapSkeleton() {
  return (
    <div className="relative w-full h-full bg-gray-900 animate-pulse" style={{ border: 'none', outline: 'none' }}>
      {/* Skeleton elements that mimic the map UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
      
      {/* Top left logo area */}
      <div className="absolute top-4 left-4 w-32 h-12 bg-gray-800 rounded-lg skeleton" />
      
      {/* Stats area */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-48 h-8 bg-gray-800 rounded skeleton" />
          <div className="flex space-x-8">
            <div className="w-24 h-16 bg-gray-800 rounded skeleton" />
            <div className="w-24 h-16 bg-gray-800 rounded skeleton" />
            <div className="w-24 h-16 bg-gray-800 rounded skeleton" />
          </div>
        </div>
      </div>
      
      {/* Bottom button area */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-48 h-12 bg-gray-800 rounded-full skeleton" />
      </div>
      
      {/* Loading text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-24">
        <div className="text-gray-600 text-sm animate-pulse" style={{ border: 'none', outline: 'none', boxShadow: 'none' }}>Loading map...</div>
      </div>
      
      <style jsx>{`
        .skeleton {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s ease-in-out infinite;
        }
        
        /* Remove any borders from all elements */
        div {
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}
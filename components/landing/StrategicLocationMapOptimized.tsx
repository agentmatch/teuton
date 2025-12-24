'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import SatelliteMapVisualization from './SatelliteMapVisualization'

// Dynamically import the Mapbox component to avoid SSR issues
const SatellitePropertyMap = dynamic(() => import('./SatellitePropertyMap'), {
  ssr: false,
  loading: () => null
})

export default function StrategicLocationMap() {
  const [hasMapboxToken, setHasMapboxToken] = useState(false)
  
  useEffect(() => {
    // Check if Mapbox token exists
    setHasMapboxToken(!!process.env.NEXT_PUBLIC_MAPBOX_TOKEN)
  }, [])

  // If we have a Mapbox token, use the real satellite map
  // Otherwise, use the Three.js visualization
  if (hasMapboxToken) {
    return <SatellitePropertyMap />
  }
  
  return <SatelliteMapVisualization />
}
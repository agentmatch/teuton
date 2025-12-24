'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Mapbox component to avoid SSR issues
const SatellitePropertyMap = dynamic(() => import('./SatellitePropertyMap'), {
  ssr: false,
  loading: () => null
})

interface StrategicLocationMapProps {
  hideHeadline?: boolean
  hideMobileNav?: boolean
  useTeutonLogo?: boolean
  onMapInteraction?: () => void
}

export default function StrategicLocationMap(props: StrategicLocationMapProps) {
  return <SatellitePropertyMap {...props} />
}
'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Teaser Property Map component to avoid SSR issues
const TeaserPropertyMap = dynamic(() => import('./TeaserPropertyMap'), {
  ssr: false,
  loading: () => null
})

export default function TeaserStrategicLocationMap() {
  // Return the TeaserPropertyMap which includes both header and map
  return <TeaserPropertyMap />
}
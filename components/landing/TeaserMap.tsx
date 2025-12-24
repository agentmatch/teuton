'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibHV4b3ItbWV0YWxzIiwiYSI6ImNseW11dDdodzBzejMya3M5MHNsZjduZGEifQ.uNy7I1lXBOMzOhZ2ohOsqQ'

export default function TeaserMap() {
  console.log('TeaserMap component rendering...')
  
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('TeaserMap useEffect running...')
    console.log('map.current:', map.current)
    console.log('mapContainer.current:', mapContainer.current)
    
    if (map.current || !mapContainer.current) {
      console.log('Exiting early - map already exists or container not ready')
      return
    }

    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not found')
      setError('Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.')
      return
    }

    console.log('Mapbox token found:', MAPBOX_TOKEN.substring(0, 10) + '...')
    mapboxgl.accessToken = MAPBOX_TOKEN
    
    console.log('Creating new Mapbox map...')
    console.log('Container dimensions:', mapContainer.current?.offsetWidth, 'x', mapContainer.current?.offsetHeight)

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-130.2, 56.8], // Golden Triangle area
      zoom: 8.5,
      pitch: 60,
      bearing: -15,
      attributionControl: false
    })

    map.current.on('load', () => {
      console.log('Map loaded successfully!')
      if (!map.current) return

      try {
        // Add terrain for 3D effect
        console.log('Adding terrain...')
        map.current.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
          tileSize: 512,
          maxzoom: 14
        })
        
        map.current.setTerrain({
          source: 'mapbox-dem',
          exaggeration: 1.2
        })
        console.log('Terrain added successfully!')
      } catch (terrainError) {
        console.warn('Failed to add terrain:', terrainError)
        // Continue without terrain
      }

      // Simple animation to show the Golden Triangle region
      setTimeout(() => {
        if (map.current) {
          console.log('Starting map animation...')
          map.current.easeTo({
            center: [-130.0, 56.9],
            zoom: 9.2,
            pitch: 65,
            bearing: -18,
            duration: 4000,
            essential: true
          })
        }
      }, 1000)

      setMapReady(true)
      console.log('Map setup complete!')
    })

    // Add more detailed error handling
    map.current.on('sourcedataloading', (e) => {
      console.log('Source data loading:', e.sourceId)
    })

    map.current.on('sourcedata', (e) => {
      console.log('Source data loaded:', e.sourceId, e.isSourceLoaded)
    })

    map.current.on('error', (e) => {
      console.error('Map error:', e)
      setError('Map failed to load: ' + e.error?.message || 'Unknown error')
    })

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  if (error) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1C1C1C',
        color: 'white',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <p>Map failed to load</p>
          <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapContainer} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  )
}
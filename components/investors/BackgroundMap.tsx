'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Try to get token from environment variable, fallback to the one from .env.local
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1Ijoicm9tYW5hbGV4YW5kZXIiLCJhIjoiY2xycmZrYWpkMGRqbTJrbWs4azd5ZHgxeCJ9.lQL4Y2Lod-myxu2MhaBZ6A'

export default function BackgroundMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [effectsApplied, setEffectsApplied] = useState(false)
  const baseCenter = [-129.8, 55.95]
  const baseBearing = -10
  const basePitch = 45

  useEffect(() => {
    // Set initialized immediately to prevent flash
    setMapInitialized(true)
    
    if (!mapContainer.current || map.current) return

    // Check for Mapbox token
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.')
      return
    }

    // Set the access token
    mapboxgl.accessToken = MAPBOX_TOKEN

    // Initialize map with satellite view for blue ocean effect
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // Satellite for ocean blue
      center: baseCenter as [number, number],
      zoom: 8.5,
      pitch: basePitch,
      bearing: baseBearing,
      interactive: false, // Disable all interactions
      attributionControl: false,
      fadeDuration: 0, // Disable fade for instant load
      antialias: false, // Improve performance
      preserveDrawingBuffer: false, // Better performance
      renderWorldCopies: false // Prevent duplicate worlds
    })
    
    // Immediately hide the map canvas until ready
    const canvas = mapContainer.current.querySelector('.mapboxgl-canvas')
    if (canvas) {
      (canvas as HTMLElement).style.opacity = '0'
    }

    map.current.on('load', () => {
      if (!map.current) return
      
      // DON'T set map loaded yet - wait for all effects first
      
      // Add terrain for 3D effect
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.1 })
      
      // Apply more subtle filters for a faded blue ocean effect
      map.current.setPaintProperty('satellite', 'raster-contrast', 0.3)  // Reduced contrast for less distraction
      map.current.setPaintProperty('satellite', 'raster-brightness-min', 0.0)
      map.current.setPaintProperty('satellite', 'raster-brightness-max', 0.3)  // Darker for more fade
      map.current.setPaintProperty('satellite', 'raster-saturation', -0.6)  // More desaturated
      map.current.setPaintProperty('satellite', 'raster-hue-rotate', 200)
      
      // Add sky layer for better 3D effect - more subtle
      map.current.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 10  // Reduced intensity
        }
      })
      
      // Add more faded overlay layer for less distraction
      map.current.addLayer({
        id: 'sandstone-overlay',
        type: 'background',
        paint: {
          'background-color': '#0d0f1e',
          'background-opacity': 0.75  // Reduced from 0.85 for better map visibility
        }
      })

      // Remove claims data - investors page should just show the blue ocean background
      // This matches the front page which doesn't show individual claims until zoomed in
      
      // Wait for multiple render cycles to ensure all styles are applied
      let renderCount = 0
      const checkRender = () => {
        if (!map.current) return
        
        renderCount++
        
        // Wait for at least 3 render cycles AND verify the overlay layer exists
        const overlayLayer = map.current.getLayer('sandstone-overlay')
        const hasAllStyles = overlayLayer && renderCount >= 3
        
        if (hasAllStyles) {
          // Additional delay to be absolutely sure all styles are rendered
          setTimeout(() => {
            // Add class to make map visible and show canvas
            if (mapContainer.current) {
              const mapElement = mapContainer.current.querySelector('.mapboxgl-map')
              if (mapElement) {
                mapElement.classList.add('map-ready')
              }
              // Also make the canvas visible
              const canvas = mapContainer.current.querySelector('.mapboxgl-canvas')
              if (canvas) {
                (canvas as HTMLElement).style.transition = 'opacity 0.8s ease-in-out'
                ;(canvas as HTMLElement).style.opacity = '1'
              }
            }
            setMapLoaded(true)
            setEffectsApplied(true)
          }, 800) // Even longer delay to ensure complete style application
        } else if (renderCount < 10) { // Safety limit
          map.current.once('render', checkRender)
        }
      }
      
      // Start checking after first render
      map.current.once('render', checkRender)

    })

    // Add subtle mouse parallax effect with throttling
    let animationFrame: number | null = null
    const handleMouseMove = (e: MouseEvent) => {
      if (!map.current || !mapLoaded || !effectsApplied) return

      // Cancel previous animation frame
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }

      animationFrame = requestAnimationFrame(() => {
        if (!map.current) return

        // Calculate normalized mouse position (-1 to 1)
        const x = (e.clientX / window.innerWidth) * 2 - 1
        const y = (e.clientY / window.innerHeight) * 2 - 1

        // Apply very subtle camera adjustments based on mouse position
        const bearing = baseBearing + x * 2 // Max 2 degrees rotation (reduced from 5)
        const pitch = basePitch + y * 2 // Max 2 degrees tilt (reduced from 5)
        
        // Very subtle center shift for parallax effect
        const centerLng = baseCenter[0] + x * 0.008 // Reduced from 0.02
        const centerLat = baseCenter[1] - y * 0.008 // Reduced from 0.02

        map.current.easeTo({
          center: [centerLng, centerLat],
          bearing: bearing,
          pitch: pitch,
          duration: 300, // Increased duration for smoother movement
          easing: (t) => t * t * (3 - 2 * t) // Smooth cubic easing
        })
      })
    }

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapLoaded])

  return (
    <div 
      className="fixed inset-0 z-0"
      style={{
        pointerEvents: 'none',
        backgroundColor: '#073440'
      }}
    >
      {/* Primary background - always visible */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundColor: '#073440',
          zIndex: 1 
        }} 
      />
      
      {/* Map container - only visible when fully loaded with effects */}
      <div 
        ref={mapContainer} 
        className="w-full h-full absolute inset-0"
        style={{ 
          backgroundColor: '#073440',
          opacity: (mapLoaded && effectsApplied) ? 1 : 0, 
          visibility: (mapLoaded && effectsApplied) ? 'visible' : 'hidden',
          transition: 'opacity 0.8s ease-in-out',
          zIndex: (mapLoaded && effectsApplied) ? 2 : -1,
          pointerEvents: 'none'
        }} 
      />
      
      {/* Loading state overlay - visible until map and effects are ready */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#073440',
          opacity: (mapLoaded && effectsApplied) ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />
    </div>
  )
}
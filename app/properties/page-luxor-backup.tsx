'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Lazy load particle effect for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

// Mapbox token will be set in the map component

interface PropertyData {
  name: string
  slug: string
  hectares: string
  type: string
  description: string
  highlights: string[]
}

interface PropertyGroup {
  title: string
  description: string
  color: string
  properties: PropertyData[]
}

const PROPERTY_GROUPS: PropertyGroup[] = [
  {
    title: 'Granduc-Type',
    description: 'Besshi VMS analogues to the historic Granduc mine',
    color: '#1A3C40',
    properties: [
      {
        name: 'PEARSON',
        slug: 'pearson',
        hectares: '500',
        type: 'Besshi-type VMS',
        description: 'Potential analogue to the conductor identified at the Granduc mine',
        highlights: ['2.5km EM anomaly', 'Granduc-like signature', 'Anomalous Cu-Au']
      },
      {
        name: 'LEDUC SILVER',
        slug: 'leduc-silver',
        hectares: '1,062',
        type: 'High-Grade Silver',
        description: 'Testing for extensions of Granduc chalcopyrite-magnetite style mineralization',
        highlights: ['99.2-386.6 g/t Ag', 'Near Granduc mine', 'Argentiferous veins']
      }
    ]
  },
  {
    title: 'KSM-Type',
    description: 'Porphyry copper-gold targets',
    color: '#1A3C40',
    properties: [
      {
        name: 'TENNYSON',
        slug: 'tennyson',
        hectares: '100',
        type: 'Porphyry Cu-Au',
        description: 'Along the inferred trace of the Sulphurets fault, genetically linked to the KSM porphyry deposits',
        highlights: ['229.5m @ 0.32% Cu, 0.25 g/t Au', '64 drill holes', '900m × 700m gossan']
      }
    ]
  },
  {
    title: 'Eskay Creek-Type',
    description: 'Precious metal VMS within Eskay Creek-equivalent stratigraphy',
    color: '#1A3C40',
    properties: [
      {
        name: 'BIG GOLD',
        slug: 'big-gold',
        hectares: '430',
        type: 'Eskay Creek-type VMS',
        description: 'Within Eskay Creek-equivalent stratigraphy',
        highlights: ['27.7 g/t Au, 6,240 g/t Ag', 'Roman & Zall zones', 'Extensive alteration']
      },
      {
        name: 'BIG GOLD WEST',
        slug: 'big-gold-west',
        hectares: '359',
        type: 'VMS Extension',
        description: 'Strategic western extension within Eskay Creek-equivalent stratigraphy',
        highlights: ['Along strike potential', 'Untested target', 'Extension of Big Gold']
      },
      {
        name: 'ESKAY RIFT',
        slug: 'eskay-rift',
        hectares: '449',
        type: 'VMS Target',
        description: 'Part of preserved Eskay Creek-equivalent stratigraphy along the length of the rift',
        highlights: ['Two ZTEM conductors', 'Undrilled target', 'Buried massive sulfides']
      }
    ]
  },
  {
    title: 'Multiple Deposit Types',
    description: 'Properties with diverse mineralization styles',
    color: '#1A3C40',
    properties: [
      {
        name: "FOUR J'S",
        slug: 'four-js',
        hectares: '323',
        type: 'VMS + Porphyry',
        description: 'VMS and porphyry potential with three distinct mineralization styles',
        highlights: ['Up to 29.2 g/t Au, 17 g/t Ag', '3 mineralization styles', '30+ drill holes']
      },
      {
        name: 'CATSPAW',
        slug: 'catspaw',
        hectares: '400',
        type: 'High-Grade Silver',
        description: 'High-grade Au-Ag veins from historic 1928 exploration',
        highlights: ['Up to 1,309.7 g/t Ag', '50m adit', 'E-W vein structures']
      }
    ]
  }
]

// Property map component
function PropertyMapPreview({ property, isActive }: { property: PropertyData; isActive: boolean }) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Set Mapbox token
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
    }

    if (!mapboxgl.accessToken) {
      setError('Mapbox token not found')
      console.error('Mapbox token is missing')
      return
    }

    // Declare resizeObserver variable in outer scope
    let resizeObserver: ResizeObserver | null = null

    // Add resize observer to handle container size changes
    resizeObserver = new ResizeObserver(() => {
      if (map.current) {
        map.current.resize()
      }
    })

    resizeObserver.observe(mapContainer.current)

    // Property center coordinates
    const propertyCenters: Record<string, [number, number]> = {
      'TENNYSON': [-130.0789, 56.2357],
      "FOUR J'S": [-130.2012, 56.2456],
      'BIG GOLD': [-130.1456, 56.2789],
      'BIG GOLD WEST': [-130.1789, 56.2789],
      'ESKAY RIFT': [-130.1234, 56.2123],
      'LEDUC SILVER': [-130.3456, 56.1890],
      'PEARSON': [-130.2890, 56.2012],
      'CATSPAW': [-130.2012, 56.2456]
    }

    const center = propertyCenters[property.name] || [-130.158, 56.262]

    // Small delay to ensure container is ready
    setTimeout(() => {
      if (!mapContainer.current) return
      
      try {
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: center,
          zoom: 9,
          interactive: false,
          attributionControl: false,
          preserveDrawingBuffer: true,
          pitch: 30,
          bearing: 0
        })
      } catch (err) {
        console.error('Failed to initialize map:', err)
        setError('Failed to initialize map')
        return
      }

      map.current.on('load', async () => {
      if (!map.current) return
      setMapLoaded(true)

      // Wait for style to be fully loaded
      if (!map.current.isStyleLoaded()) {
        map.current.once('styledata', () => {
          addMapSources()
        })
      } else {
        addMapSources()
      }
      
      function addMapSources() {
        if (!map.current) return
        
        // Add terrain first
        if (!map.current.getSource('mapbox-dem')) {
          map.current.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          })
        }
        map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })
      }
      
      async function initializeMapFeatures() {
        if (!map.current) return
        
        // Add sky layer for better 3D effect
        if (!map.current.getLayer('sky')) {
          map.current.addLayer({
            id: 'sky',
            type: 'sky',
            paint: {
              'sky-type': 'atmosphere',
              'sky-atmosphere-sun': [0.0, 90.0],
              'sky-atmosphere-sun-intensity': 15
            }
          })
        }

        // Apply enhanced style filters to satellite layer for dark blue effect
        if (map.current.getLayer('satellite')) {
          map.current.setPaintProperty('satellite', 'raster-contrast', 0.6)
          map.current.setPaintProperty('satellite', 'raster-brightness-min', 0.0)
          map.current.setPaintProperty('satellite', 'raster-brightness-max', 0.5)
          map.current.setPaintProperty('satellite', 'raster-saturation', -0.4)
          map.current.setPaintProperty('satellite', 'raster-hue-rotate', 200)
        }
        
        // Add sandstone overlay layer for enhanced blue effect - must be after satellite layer loads
        if (!map.current.getLayer('sandstone-overlay')) {
          map.current.addLayer({
            id: 'sandstone-overlay',
            type: 'background',
            paint: {
              'background-color': '#0A4A5C',
              'background-opacity': 0.7
            }
          })
        }

        // Resize map after all layers are loaded
        await new Promise(resolve => setTimeout(resolve, 100))
        map.current.resize()
      }
      
      // Call the initialization function
      await initializeMapFeatures()

      try {
        // Load the property boundaries GeoJSON (merged properties with proper grouping)
        const response = await fetch('/images/luxor-properties-merged-wgs84.geojson')
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`)
        }
        const geojsonData = await response.json()
        console.log('Loaded GeoJSON for property:', property.name)
        console.log('Total features:', geojsonData.features.length)
        
        // Debug: check if property exists in data
        const matchingFeature = geojsonData.features.find((f: any) => f.properties.property_name === property.name)
        console.log('Found property feature:', matchingFeature ? 'Yes' : 'No')

        // Add the property boundaries source with unique ID
        const sourceId = `property-boundaries-${property.slug}`
        if (!map.current.getSource(sourceId)) {
          map.current.addSource(sourceId, {
            type: 'geojson',
            data: geojsonData
          })
        }

        // Use a cleaner masking approach with dark overlay
        // Add dark background over everything
        const darkBackgroundId = `dark-bg-${property.slug}`
        if (!map.current.getLayer(darkBackgroundId)) {
          map.current.addLayer({
            id: darkBackgroundId,
            type: 'background',
            paint: {
              'background-color': '#000000',
              'background-opacity': 0.9
            }
          }, 'satellite')
        }
        
        // Move satellite layer above dark background so it can show through property areas
        map.current.moveLayer('satellite', darkBackgroundId)

        // Add the highlighted property with transparent fill to show the map
        const fillLayerId = `property-fill-${property.slug}`
        if (!map.current.getLayer(fillLayerId)) {
          map.current.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': '#FFFF77',
              'fill-opacity': 0
            },
            filter: ['==', ['get', 'property_name'], property.name]
          })
        }

        // Add highlighted property outline
        const outlineLayerId = `property-outline-${property.slug}`
        if (!map.current.getLayer(outlineLayerId)) {
          map.current.addLayer({
            id: outlineLayerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': '#FFFF77',
              'line-width': 3,
              'line-opacity': 1
            },
            filter: ['==', ['get', 'property_name'], property.name]
          })
        }

        // Get the bounds of the specific property
        const features = geojsonData.features.filter((f: any) => f.properties.property_name === property.name)
        console.log(`Found ${features.length} features for property: ${property.name}`)
        
        if (features.length > 0) {
          const bounds = new mapboxgl.LngLatBounds()
          features.forEach((feature: any) => {
            if (feature.geometry.type === 'Polygon') {
              feature.geometry.coordinates[0].forEach((coord: number[]) => {
                bounds.extend(coord as [number, number])
              })
            } else if (feature.geometry.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                polygon[0].forEach((coord: number[]) => {
                  bounds.extend(coord as [number, number])
                })
              })
            }
          })
          
          // Validate bounds before fitting
          const boundsArray = bounds.toArray()
          if (boundsArray && boundsArray.length === 2 && 
              !isNaN(boundsArray[0][0]) && !isNaN(boundsArray[0][1]) &&
              !isNaN(boundsArray[1][0]) && !isNaN(boundsArray[1][1]) &&
              Math.abs(boundsArray[1][0] - boundsArray[0][0]) > 0.0001 &&
              Math.abs(boundsArray[1][1] - boundsArray[0][1]) > 0.0001) {
            // Fit map to property bounds with proper padding for aspect ratio
            map.current.fitBounds(bounds, {
              padding: { top: 80, bottom: 80, left: 120, right: 120 },
              duration: 0,
              maxZoom: 12
            })
          } else {
            console.error('Invalid bounds:', boundsArray)
            // Fallback to center coordinates
            map.current.setCenter(center)
            map.current.setZoom(10)
          }
        }
      } catch (error) {
        console.error('Error loading property boundaries:', error)
        setError('Failed to load map data')
        
        // Fallback to point representation if GeoJSON fails
        if (!map.current.getSource('property-point')) {
          map.current.addSource('property-point', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: center
              },
              properties: {}
            }
          })
        }

        if (!map.current.getLayer('property-circle')) {
          map.current.addLayer({
            id: 'property-circle',
            type: 'circle',
            source: 'property-point',
            paint: {
              'circle-radius': 15,
              'circle-color': '#FFFF77',
              'circle-opacity': 0.8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF'
            }
          })
        }
      }
    })
    }, 200) // 200ms delay

    return () => {
      resizeObserver?.disconnect()
      map.current?.remove()
      map.current = null
    }
  }, [property.name])

  return (
    <div className="absolute inset-0 rounded-xl bg-black">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 rounded-xl"
        style={{ 
          opacity: isActive ? 1 : 0.8,
          minHeight: '100%',
          minWidth: '100%'
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
          <p className="text-xs text-gray-300">{error}</p>
        </div>
      )}
      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-xl">
          <p className="text-xs text-gray-300">Loading map...</p>
        </div>
      )}
    </div>
  )
}

// Import the new SVG-based component
import PropertyOutlineMap from '@/components/properties/PropertyOutlineMap'

// Interactive Properties Map Component - Complete Rewrite
function InteractivePropertiesMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if container exists
    if (!mapContainer.current) return

    // Set mapbox token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

    // Create new map instance with a completely dark style
    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {},
        layers: [{
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#000000'
          }
        }]
      },
      center: [-130.158, 56.262],
      zoom: 8,
      pitch: 0, // No pitch for cleaner outline view
      bearing: 0,
      interactive: true,
      maxZoom: 12,
      minZoom: 7
    })

    mapInstance.current = newMap

    // Handle map load
    newMap.on('load', () => {
      console.log('Map loaded successfully')
      setIsLoading(false)

      // Load property boundaries - using merged properties with proper grouping
      fetch('/images/luxor-properties-merged-wgs84.geojson')
        .then(res => {
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log('Loaded GeoJSON data:', data);
          console.log('Number of features:', data.features.length);
          
          // Log first property details for debugging
          if (data.features.length > 0) {
            const firstFeature = data.features[0];
            console.log('First property:', firstFeature.properties);
            console.log('Geometry type:', firstFeature.geometry.type);
            console.log('First coordinate:', firstFeature.geometry.coordinates[0][0][0]);
          }
          
          // Add properties source
          newMap.addSource('properties', {
            type: 'geojson',
            data: data
          });

          // Add property fill - transparent by default
          newMap.addLayer({
            id: 'properties-fill',
            type: 'fill',
            source: 'properties',
            paint: {
              'fill-color': 'transparent',
              'fill-opacity': 0
            }
          });

          // Add property outline
          newMap.addLayer({
            id: 'properties-outline',
            type: 'line',
            source: 'properties',
            paint: {
              'line-color': '#FFFF77',
              'line-width': 2,
              'line-opacity': 0.8
            }
          });
          
          // Add minimal dot markers with floating cards on hover
          const markers: mapboxgl.Marker[] = []
          data.features.forEach((feature: any) => {
            if (feature.geometry && feature.properties) {
              // Calculate better center using bounding box for more accurate placement
              let minLng = Infinity, maxLng = -Infinity
              let minLat = Infinity, maxLat = -Infinity
              
              if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((polygon: any) => {
                  polygon.forEach((ring: any) => {
                    ring.forEach((coord: any) => {
                      minLng = Math.min(minLng, coord[0])
                      maxLng = Math.max(maxLng, coord[0])
                      minLat = Math.min(minLat, coord[1])
                      maxLat = Math.max(maxLat, coord[1])
                    })
                  })
                })
              }
              
              if (minLng !== Infinity) {
                // Use bounding box center for better placement
                let centerLng = (minLng + maxLng) / 2
                let centerLat = (minLat + maxLat) / 2
                
                // Manual adjustments for specific properties with irregular shapes
                const propertyName = feature.properties.property_name
                if (propertyName === 'CATSPAW') {
                  // Adjust Catspaw marker position slightly
                  centerLat += 0.002  // Move slightly north
                } else if (propertyName === 'ESKAY RIFT') {
                  // Adjust Eskay Rift marker position
                  centerLat += 0.003  // Move north
                  centerLng -= 0.002  // Move slightly west
                }
                
                // Create marker element with floating card
                const el = document.createElement('div')
                el.className = 'property-marker'
                el.setAttribute('data-property', feature.properties.property_name)
                el.style.cssText = `
                  position: relative;
                  width: 16px;
                  height: 16px;
                  cursor: pointer;
                `
                
                // Format hectares with commas
                const hectares = feature.properties.total_area_hectares
                const formattedHectares = typeof hectares === 'number' 
                  ? hectares.toLocaleString() 
                  : hectares
                
                el.innerHTML = `
                  <!-- Dot indicator -->
                  <div style="
                    width: 16px;
                    height: 16px;
                    background: rgba(255, 255, 119, 0.8);
                    border: 2px solid rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    box-shadow: 
                      0 0 20px rgba(255, 255, 119, 0.6),
                      0 2px 4px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  " class="marker-dot"></div>
                  
                  <!-- Floating card -->
                  <div style="
                    position: absolute;
                    bottom: 28px;
                    left: 50%;
                    transform: translateX(-50%) translateY(10px) scale(0.9);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    pointer-events: none;
                    z-index: 1000;
                  " class="floating-card">
                    <div style="
                      background: linear-gradient(135deg, 
                        rgba(10, 74, 92, 0.95) 0%, 
                        rgba(10, 74, 92, 0.85) 100%);
                      backdrop-filter: blur(20px) saturate(180%);
                      -webkit-backdrop-filter: blur(20px) saturate(180%);
                      padding: 16px 24px;
                      border-radius: 12px;
                      border: 1px solid rgba(255, 255, 255, 0.2);
                      box-shadow: 
                        0 20px 40px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                        0 1px 0 rgba(255, 255, 255, 0.2) inset;
                      min-width: 160px;
                      text-align: center;
                    ">
                      <h3 style="
                        font-family: 'Aeonik Extended', sans-serif;
                        font-weight: 600;
                        font-size: 16px;
                        color: #FFFFFF;
                        margin: 0 0 6px 0;
                        letter-spacing: 0.08em;
                        text-transform: uppercase;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
                      ">${feature.properties.property_name}</h3>
                      <p style="
                        font-family: 'Aeonik', sans-serif;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.8);
                        margin: 0;
                      ">${formattedHectares} hectares</p>
                      <div style="
                        font-family: 'Aeonik', sans-serif;
                        font-size: 12px;
                        color: rgba(255, 255, 119, 0.9);
                        margin-top: 4px;
                        letter-spacing: 0.04em;
                      ">${feature.properties.claim_count} ${feature.properties.claim_count === 1 ? 'claim' : 'claims'}</div>
                    </div>
                    <!-- Arrow pointing down -->
                    <div style="
                      position: absolute;
                      bottom: -6px;
                      left: 50%;
                      transform: translateX(-50%) rotate(45deg);
                      width: 12px;
                      height: 12px;
                      background: rgba(10, 74, 92, 0.95);
                      border-right: 1px solid rgba(255, 255, 255, 0.2);
                      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    "></div>
                  </div>
                `
                
                const marker = new mapboxgl.Marker(el, { anchor: 'center' })
                  .setLngLat([centerLng, centerLat])
                  .addTo(newMap)
                
                markers.push(marker)
              }
            }
          })
          
          // Store markers for cleanup
          markersRef.current = markers
          
          // Add hover listeners to markers for better interaction
          markers.forEach(marker => {
            const el = marker.getElement()
            const markerProperty = el.getAttribute('data-property')
            
            el.addEventListener('mouseenter', () => {
              if (markerProperty) {
                // Trigger same hover effect as property fill
                const floatingCard = el.querySelector('.floating-card') as HTMLElement
                const markerDot = el.querySelector('.marker-dot') as HTMLElement
                
                if (floatingCard && markerDot) {
                  floatingCard.style.opacity = '1'
                  floatingCard.style.visibility = 'visible'
                  floatingCard.style.transform = 'translateX(-50%) translateY(0) scale(1)'
                  markerDot.style.transform = 'scale(1.2)'
                  markerDot.style.boxShadow = '0 0 30px rgba(255, 255, 119, 0.8), 0 2px 8px rgba(0, 0, 0, 0.4)'
                }
                
                // Update map property hover state
                newMap.setPaintProperty('properties-fill', 'fill-opacity', [
                  'case',
                  ['==', ['get', 'property_name'], markerProperty],
                  0.6,
                  0.3
                ])
                newMap.setPaintProperty('properties-outline', 'line-width', [
                  'case',
                  ['==', ['get', 'property_name'], markerProperty],
                  3,
                  2
                ])
              }
            })
            
            el.addEventListener('mouseleave', () => {
              const floatingCard = el.querySelector('.floating-card') as HTMLElement
              const markerDot = el.querySelector('.marker-dot') as HTMLElement
              
              if (floatingCard && markerDot) {
                floatingCard.style.opacity = '0'
                floatingCard.style.visibility = 'hidden'
                floatingCard.style.transform = 'translateX(-50%) translateY(10px) scale(0.9)'
                markerDot.style.transform = 'scale(1)'
                markerDot.style.boxShadow = '0 0 20px rgba(255, 255, 119, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
              }
              
              // Reset map property hover state
              newMap.setPaintProperty('properties-fill', 'fill-opacity', 0.3)
              newMap.setPaintProperty('properties-outline', 'line-width', 2)
            })
            
            // Add click handler to marker
            el.addEventListener('click', () => {
              if (markerProperty) {
                const property = PROPERTY_GROUPS.flatMap(g => g.properties).find(p => p.name === markerProperty)
                if (property) {
                  router.push(`/properties/${property.slug}`)
                }
              }
            })
          })

          // Add hover effect with improved behavior
          let hoveredId: string | null = null
          
          // Track mouse movement over properties
          newMap.on('mousemove', 'properties-fill', (e) => {
            newMap.getCanvas().style.cursor = 'pointer'
            
            if (e.features && e.features[0]) {
              const propertyName = e.features[0].properties?.property_name
              
              // Update hover state if we're over a different property
              if (propertyName !== hoveredId) {
                // Reset previous hover state
                if (hoveredId) {
                  newMap.setFeatureState(
                    { source: 'properties', id: hoveredId },
                    { hover: false }
                  )
                }
                
                // Set new hover state
                hoveredId = propertyName
                
                // Update fill for hovered property only
                newMap.setPaintProperty('properties-fill', 'fill-color', [
                  'case',
                  ['==', ['get', 'property_name'], propertyName],
                  '#FFFF77',
                  'transparent'
                ])
                newMap.setPaintProperty('properties-fill', 'fill-opacity', [
                  'case',
                  ['==', ['get', 'property_name'], propertyName],
                  0.2,
                  0
                ])
                
                // Update outline for hovered property
                newMap.setPaintProperty('properties-outline', 'line-width', [
                  'case',
                  ['==', ['get', 'property_name'], propertyName],
                  3,
                  2
                ])
                
                // Show floating card for hovered property
                if (markersRef.current.length > 0) {
                  markersRef.current.forEach(marker => {
                    const el = marker.getElement()
                    const markerProperty = el.getAttribute('data-property')
                    const floatingCard = el.querySelector('.floating-card') as HTMLElement
                    const markerDot = el.querySelector('.marker-dot') as HTMLElement
                    
                    if (markerProperty === propertyName && floatingCard && markerDot) {
                      // Show card
                      floatingCard.style.opacity = '1'
                      floatingCard.style.visibility = 'visible'
                      floatingCard.style.transform = 'translateX(-50%) translateY(0) scale(1)'
                      // Enhance dot
                      markerDot.style.transform = 'scale(1.2)'
                      markerDot.style.boxShadow = '0 0 30px rgba(255, 255, 119, 0.8), 0 2px 8px rgba(0, 0, 0, 0.4)'
                    } else if (floatingCard && markerDot) {
                      // Hide card
                      floatingCard.style.opacity = '0'
                      floatingCard.style.visibility = 'hidden'
                      floatingCard.style.transform = 'translateX(-50%) translateY(10px) scale(0.9)'
                      // Reset dot
                      markerDot.style.transform = 'scale(1)'
                      markerDot.style.boxShadow = '0 0 20px rgba(255, 255, 119, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                    }
                  })
                }
              }
            }
          })

          newMap.on('mouseleave', 'properties-fill', () => {
            newMap.getCanvas().style.cursor = ''
            
            // Reset all properties to default state
            if (hoveredId) {
              hoveredId = null
              newMap.setPaintProperty('properties-fill', 'fill-color', 'transparent')
              newMap.setPaintProperty('properties-fill', 'fill-opacity', 0)
              newMap.setPaintProperty('properties-outline', 'line-width', 2)
              
              // Hide all floating cards
              if (markersRef.current.length > 0) {
                markersRef.current.forEach(marker => {
                  const el = marker.getElement()
                  const floatingCard = el.querySelector('.floating-card') as HTMLElement
                  const markerDot = el.querySelector('.marker-dot') as HTMLElement
                  
                  if (floatingCard) {
                    floatingCard.style.opacity = '0'
                    floatingCard.style.visibility = 'hidden'
                    floatingCard.style.transform = 'translateX(-50%) translateY(10px) scale(0.9)'
                  }
                  if (markerDot) {
                    markerDot.style.transform = 'scale(1)'
                    markerDot.style.boxShadow = '0 0 20px rgba(255, 255, 119, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                  }
                })
              }
            }
          })

          // Add click handler
          newMap.on('click', 'properties-fill', (e) => {
            if (e.features && e.features[0]) {
              const propertyName = e.features[0].properties?.property_name
              const property = PROPERTY_GROUPS.flatMap(g => g.properties).find(p => p.name === propertyName)
              if (property) {
                router.push(`/properties/${property.slug}`)
              }
            }
          })
          
          // Calculate and fit bounds
          try {
            const bounds = new mapboxgl.LngLatBounds()
            
            data.features.forEach((feature: any) => {
              if (feature.geometry && feature.geometry.coordinates) {
                // For MultiPolygon
                feature.geometry.coordinates.forEach((polygon: any) => {
                  polygon.forEach((ring: any) => {
                    ring.forEach((coord: any) => {
                      if (Array.isArray(coord) && coord.length >= 2) {
                        bounds.extend([coord[0], coord[1]] as [number, number])
                      }
                    })
                  })
                })
              }
            })
            
            if (!bounds.isEmpty()) {
              console.log('Fitting to bounds:', bounds.toArray())
              // Fit to bounds with tighter padding to show just the properties
              newMap.fitBounds(bounds, {
                padding: { top: 60, right: 60, bottom: 60, left: 60 },
                duration: 2000,
                maxZoom: 10 // Don't zoom in too close
              })
              
              // After fitting, lock the bounds very tightly
              newMap.once('moveend', () => {
                const currentBounds = newMap.getBounds()
                if (currentBounds) {
                  // Very small buffer for tight bounds
                  const ne = currentBounds.getNorthEast()
                  const sw = currentBounds.getSouthWest()
                  const buffer = 0.02 // Much smaller buffer
                  
                  const extendedBounds = new mapboxgl.LngLatBounds(
                    [sw.lng - buffer, sw.lat - buffer],
                    [ne.lng + buffer, ne.lat + buffer]
                  )
                  newMap.setMaxBounds(extendedBounds)
                }
              })
            }
          } catch (e) {
            console.error('Error fitting bounds:', e)
          }
        })
        .catch(err => {
          console.error('Failed to load properties:', err)
        })
    })

    // Cleanup
    return () => {
      // Remove markers
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      newMap.remove()
    }
  }, [router])

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl mb-16 bg-black">
      <div ref={mapContainer} className="w-full h-full bg-black" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-lg">Loading map...</div>
        </div>
      )}
      {/* Property info tooltip */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md rounded-lg shadow-lg px-4 py-2 pointer-events-none opacity-90 border border-white/20">
        <p className="text-sm text-white/70" style={{ fontFamily: 'Aeonik, sans-serif' }}>
          Hover over properties • Click to explore
        </p>
      </div>
    </div>
  )
}

export default function PropertiesPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen pt-24 md:pt-40 pb-20" data-theme="light"
         style={{
           background: 'linear-gradient(to bottom, #F5F5F5, #E8E8E8)',
         }}>
      {/* Subtle glassmorphic overlay */}
      <div className="fixed inset-0 z-0"
           style={{
             background: 'radial-gradient(ellipse at top, rgba(10, 74, 92, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(255, 215, 0, 0.03) 0%, transparent 50%)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
           }} />
      
      {/* Subtle gold dust particles effect */}
      <div className="relative z-10">
        <GoldDustParticles /></div>
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-[#1A3C40] mb-4 md:mb-6 block"
            style={{ 
              fontFamily: "'Aeonik Extended', -apple-system, BlinkMacSystemFont, sans-serif", 
              fontWeight: 500,
              fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : '4rem',
              lineHeight: '1.1'
            }}>
            Our Properties
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl text-[#1A3C40]/70 max-w-3xl mx-auto overflow-hidden px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 400 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              Eight strategic exploration properties covering 3,623 hectares in the heart of the Golden Triangle
            </motion.p>
          </div>
        </motion.div>

        {/* Interactive Properties Map - SVG Outline Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <PropertyOutlineMap />
        </motion.div>

        {/* Property Cards Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mb-12 mt-20"
        >
          <h2 className="text-3xl font-semibold text-[#1A3C40] mb-4"
              style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
            Explore Our Properties
          </h2>
          <p className="text-lg text-[#1A3C40]/70">
            Detailed information about each exploration property
          </p>
        </motion.div>

        {/* Group Selector Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              selectedGroup === null 
                ? 'bg-[#1A3C40] text-white shadow-lg' 
                : 'bg-white/70 text-[#1A3C40] hover:bg-white/90 backdrop-blur-sm'
            }`}
            style={{ fontFamily: "Aeonik Extended, sans-serif" }}
          >
            All Properties
          </button>
          {PROPERTY_GROUPS.map((group) => (
            <button
              key={group.title}
              onClick={() => setSelectedGroup(group.title)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedGroup === group.title 
                  ? 'bg-[#1A3C40] text-white shadow-lg' 
                  : 'bg-white/70 text-[#1A3C40] hover:bg-white/90 backdrop-blur-sm'
              }`}
              style={{ fontFamily: "Aeonik Extended, sans-serif" }}
            >
              {group.title}
            </button>
          ))}
        </motion.div>

        {/* Property Groups */}
        <div className="space-y-16">
          {selectedGroup === null ? (
            // All Properties View - Single grid with all properties
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PROPERTY_GROUPS.flatMap(group => group.properties).map((property, index) => (
                  <motion.div
                    key={property.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    onMouseEnter={() => setHoveredProperty(property.name)}
                    onMouseLeave={() => setHoveredProperty(null)}
                    className="group"
                  >
                    <Link href={`/properties/${property.slug}`}>
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                             backdropFilter: 'blur(20px)',
                             WebkitBackdropFilter: 'blur(20px)',
                             border: '1px solid rgba(255, 255, 255, 0.15)',
                             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                           }}>
                        {/* Map Preview */}
                        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                          <PropertyMapPreview 
                            property={property} 
                            isActive={hoveredProperty === property.name}
                          />
                          
                          {/* Subtle Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 pointer-events-none" />
                          
                          {/* Elegant Property Name Display */}
                          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                            {/* Dark backdrop for better contrast */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
                            
                            {/* Property name with enhanced visibility */}
                            <h3 className="relative z-10 text-white tracking-[0.6em] uppercase mb-3 transform transition-all duration-300 group-hover:scale-110"
                                style={{ 
                                  fontFamily: "Aeonik Extended, sans-serif", 
                                  fontWeight: 200,
                                  fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                                  textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 0 60px rgba(255,255,119,0.3)',
                                  letterSpacing: '0.6em',
                                  color: '#FFFFFF'
                                }}>
                              {property.name}
                            </h3>
                            
                            {/* Property details with better visibility */}
                            <div className="relative z-10 flex items-center justify-center gap-4">
                              <span className="text-xs text-white/80 uppercase tracking-[0.3em] font-light"
                                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {property.type}
                              </span>
                              <span className="w-12 h-px bg-gradient-to-r from-transparent via-[#FFFF77]/60 to-transparent"></span>
                              <span className="text-xs text-[#FFFF77] uppercase tracking-[0.3em] font-medium"
                                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {property.hectares} Ha
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <p className="text-sm text-white/70 mb-4 line-clamp-2">
                            {property.description}
                          </p>

                          {/* Highlights */}
                          <div className="space-y-2 mb-6">
                            {property.highlights.slice(0, 2).map((highlight, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FFFF77]" />
                                <span className="text-xs text-white/60 leading-relaxed">{highlight}</span>
                              </div>
                            ))}
                          </div>

                          {/* Learn More Link */}
                          <div className="flex items-center gap-2 text-[#FFFF77] font-semibold group-hover:gap-3 transition-all">
                            <span>Explore Property</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            // Filtered View - Show only selected group
            PROPERTY_GROUPS.filter(group => group.title === selectedGroup).map((group, groupIndex) => {
              // Determine grid columns based on property count
              const propertyCount = group.properties.length
              let gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" // default
              let containerClass = "" // additional container classes
              
              if (propertyCount === 1) {
                gridCols = "grid-cols-1"
                containerClass = "max-w-md mx-auto"
              } else if (propertyCount === 2) {
                gridCols = "grid-cols-1 md:grid-cols-2"
                containerClass = "max-w-4xl mx-auto"
              } else if (propertyCount === 3) {
                gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }
              // 4 or more keeps the default 4 column layout
              
              return (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: groupIndex * 0.1 }}
                >
                  {/* Properties Grid */}
                  <div className={`grid ${gridCols} gap-6 ${containerClass}`}>
                  {group.properties.map((property, index) => (
                    <motion.div
                      key={property.slug}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      onMouseEnter={() => setHoveredProperty(property.name)}
                      onMouseLeave={() => setHoveredProperty(null)}
                      className="group"
                    >
                    <Link href={`/properties/${property.slug}`}>
                      <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105"
                           style={{
                             background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
                             backdropFilter: 'blur(20px)',
                             WebkitBackdropFilter: 'blur(20px)',
                             border: '1px solid rgba(255, 255, 255, 0.15)',
                             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                           }}>
                        {/* Map Preview */}
                        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                          <PropertyMapPreview 
                            property={property} 
                            isActive={hoveredProperty === property.name}
                          />
                          
                          {/* Subtle Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20 pointer-events-none" />
                          
                          {/* Elegant Property Name Display */}
                          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                            {/* Dark backdrop for better contrast */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
                            
                            {/* Property name with enhanced visibility */}
                            <h3 className="relative z-10 text-white tracking-[0.6em] uppercase mb-3 transform transition-all duration-300 group-hover:scale-110"
                                style={{ 
                                  fontFamily: "Aeonik Extended, sans-serif", 
                                  fontWeight: 200,
                                  fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                                  textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8), 0 0 60px rgba(255,255,119,0.3)',
                                  letterSpacing: '0.6em',
                                  color: '#FFFFFF'
                                }}>
                              {property.name}
                            </h3>
                            
                            {/* Property details with better visibility */}
                            <div className="relative z-10 flex items-center justify-center gap-4">
                              <span className="text-xs text-white/80 uppercase tracking-[0.3em] font-light"
                                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {property.type}
                              </span>
                              <span className="w-12 h-px bg-gradient-to-r from-transparent via-[#FFFF77]/60 to-transparent"></span>
                              <span className="text-xs text-[#FFFF77] uppercase tracking-[0.3em] font-medium"
                                    style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                {property.hectares} Ha
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <p className="text-sm text-white/70 mb-4 line-clamp-2">
                            {property.description}
                          </p>

                          {/* Highlights */}
                          <div className="space-y-2 mb-6">
                            {property.highlights.slice(0, 2).map((highlight, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FFFF77]" />
                                <span className="text-xs text-white/60 leading-relaxed">{highlight}</span>
                              </div>
                            ))}
                          </div>

                          {/* Learn More Link */}
                          <div className="flex items-center gap-2 text-[#FFFF77] font-semibold group-hover:gap-3 transition-all">
                            <span>Explore Property</span>
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
              )
            })
          )}
        </div>
      </div>

      <style jsx global>{`
        .property-popup {
          font-family: 'Aeonik Extended', sans-serif;
        }
        .property-popup .mapboxgl-popup-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .property-popup .mapboxgl-popup-tip {
          border-top-color: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  )
}
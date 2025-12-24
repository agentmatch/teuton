'use client'

import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import Link from 'next/link'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { FiArrowRight } from 'react-icons/fi'

// Extend window interface for zone markers
declare global {
  interface Window {
    zoneMarkers?: mapboxgl.Marker[]
    padMarkers?: { marker: mapboxgl.Marker, element: HTMLElement }[]
    ramZoneMarkers?: any[]
  }
}
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import MapSkeleton from './MapSkeleton'
import MobileNav from './MobileNav'
import MobileNavWrapper from './MobileNavWrapper'
import SimpleMobileNav from './SimpleMobileNav'
// ChunkedVideoLoader removed - using MuxDroneVideo instead
import CategoryNav from './CategoryNav'
import { useSwipe } from '@/hooks/useSwipe'
import RedLineModalPortal from './RedLineModalPortal'
import { PROPERTY_INFO, PeriodicElement } from './PropertyInfo'
import { MuxThumbVideo } from '../ram/MuxThumbVideo'
// Dynamic import for MuxDroneVideo to avoid SSR issues
const MuxDroneVideo = dynamic(() => import('../ram/MuxDroneVideo').then(m => m.MuxDroneVideo), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
      <div className="text-white">Loading video player...</div>
    </div>
  )
})
// import Image from 'next/image'

// You'll need to add your Mapbox token to your .env.local file
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// Mux Playback IDs for RAM drone videos
const MUX_DRONE_PLAYBACK_IDS = {
  drone1: 'RPb301S7bOIXXQCzqDHSfO8qioVUIGyxlBjYhsYia5Wk', // RAM drone video 1
  drone2: 'yuJk01P8BH1yYaADncP3Z3Bu00wgBvPSOtak005D5xJuBc'  // RAM drone video 2
}

// Property descriptions
const PROPERTY_DESCRIPTIONS: Record<string, string> = {
  'FIJI': 'Prospecting by Teuton personnel in 2006 on the Fiji identified two promising zones of high-grade, gold-bearing mineralization in an area lying just west, along regional trend, of the common border with Dolly Varden Silver\'s Homestake Ridge property.',
  'TONGA': 'Staked in the 1980\'s because of highly anomalous silver stream geochemistry. High-grade silver and gold bearing float discovered in streams. Situated between Dolly Varden Silver\'s Kombi gold-silver target and Goliath Resources\' Gold Swarm showing.',
  'RAM': 'In this part of the Ram property, Upper Triassic Stuhini rocks and Lower Jurassic Hazelton volcano-sedimentary sequences are intruded by early Jurassic porphyries. These are thought to be similar to the Goldslide and Hillside intrusive suites at the neighbouring Red Mountain property. This geological setting is favourable for both porphyry and VMS-style mineralization, but also, and probably most likely, for intrusive-related gold as in evidence at Red Mountain. Precious metal mineralization at Red Mountain has been described as high-grade (3 g/t to 20 g/t) gold in semi-tabular pyrite + pyrrhotite stockworks 5m to 29m thick with intense sericite alteration surrounded by disseminated sphalerite + pyrrhotite. The largest of the deposits at Red Mountain, the Marc zone, graded 11.5 g/t gold.',
  'CLONE': 'Two zones of interest occur on the property. The first, the Main zone, features a number of very high-grade gold and gold-cobalt bearing shear zones (100 tons grading 4.0 oz/ton gold was bulk sampled here). In recent years focus has changed to a southwest zone which appears to lie above a reduced porphyry system, the upper portions of which are anomalous in copper, molybdenum, tungsten, bismuth and gold. This latter area is transected by Kyba\'s "Red Line".',
  'KONKIN SILVER': 'Ross Sherlock, Ph.D. geologist, reported that the Konkin Silver showing, with high grade silver in massive baritic zones, had similar geology to the Eskay Creek precious metal rich VMS deposit.',
  'MIDAS': 'The Midas property lies along a favourable contact zone, south of the Del Norte property of Teuton Resources which hosts the high-grade gold and silver bearing "LG" vein along the same horizon. Two prominent airborne VTEM anomalies remain to be tested on this property.',
  'GOLD MOUNTAIN': 'Quartz calcite veinlets occurring over a 200 by 300m area carry gold values from a few ppb to 0.632oz/ton. The property adjoins Ascot Resources\' Red Mountain property to the southeast where gold and gold tellurides are found in various deposits such as the Marc zone (average grade 11.5 g/t gold).'
}

// Property URL mappings - using existing pages or dynamic [slug] route
const PROPERTY_URLS: Record<string, string> = {
  'FIJI': '/properties/fiji',
  'TONGA': '/properties/tonga',
  'RAM': '/properties/ram',
  'CLONE': '/properties/clone',
  'KONKIN SILVER': '/properties/konkin-silver',
  'MIDAS': '/properties/midas',
  'GOLD MOUNTAIN': '/properties/gold-mountain'
}


interface PropertyMapProps {
  onZoomComplete?: () => void
  hideHeadline?: boolean
  hideMobileNav?: boolean
  hideBottomNav?: boolean
  useTeutonLogo?: boolean
  onPropertySelectionChange?: (property: string | null) => void
  onSplitScreenChange?: (show: boolean) => void
  onMapInteraction?: () => void
  isTeaser?: boolean
  screenIsMobile?: boolean
  screenIsTablet?: boolean
  screenIsLargeScreen?: boolean
}

// Actual coordinates for Golden Triangle area in BC
const GOLDEN_TRIANGLE_CENTER = [-130.5, 56.8] // Stewart, BC area
const LUXOR_PROPERTIES_CENTER = [-130.235, 56.435] // Center of Teuton properties

// Major nearby projects with accurate coordinates
const MAJOR_PROJECTS = [
  {
    name: 'Red Mountain',
    coordinates: [-129.7223, 55.9487], // IDM Mining - moved 5% south (was 55.9787)
    color: '#FFD700',
    description: 'Underground Au-Ag project'
  },
  {
    name: 'Golddigger',
    coordinates: [-129.7211, 55.6830], // Goliath Resources (J2 Syndicate) - moved 20% north
    color: '#FFD700',
    description: 'Goliath Resources'
  },
  {
    name: 'Dolly Varden',
    coordinates: [-129.5210, 55.7418], // Dolly Varden - moved 10px northwest
    color: '#FFD700',  
    description: 'Silver exploration project'
  },
  {
    name: 'Golddigger',
    coordinates: [-129.780, 55.860], // Goliath Resources - moved northwest to better position over claims
    color: '#FFD700',
    description: 'Goliath Resources'
  },
  // Teuton properties
  {
    name: 'FIJI',
    coordinates: [-129.6240, 55.7840], // Moved 14px northwest
    color: '#FFD700',
    description: 'Teuton property'
  },
  {
    name: 'TONGA',
    coordinates: [-129.6514, 55.6959],
    color: '#FFD700',
    description: 'Teuton property'
  },
  {
    name: 'RAM',
    coordinates: [-129.7050, 55.8750], // Moved 10px north
    color: '#FFD700',
    description: 'Teuton property'
  },
  {
    name: 'CLONE',
    coordinates: [-129.7992, 55.8029],
    color: '#FFD700',
    description: 'Teuton property'
  },
  {
    name: 'KONKIN SILVER',
    coordinates: [-129.4735, 55.9251],
    color: '#FFD700',
    description: 'Teuton property'
  },
  {
    name: 'MIDAS',
    coordinates: [-129.4900, 55.9645],
    color: '#FFD700',
    description: 'Teuton property'
  }
]

// Load actual Luxor property boundaries from BC mineral tenure data
// This will be loaded dynamically from the GeoJSON file
let LUXOR_BOUNDARIES: any = null


export default function SatellitePropertyMap({ onZoomComplete, hideHeadline = false, hideMobileNav = false, hideBottomNav = false, useTeutonLogo = false, onPropertySelectionChange, onSplitScreenChange, onMapInteraction, isTeaser = false, screenIsMobile = false, screenIsTablet = false, screenIsLargeScreen = false }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(7)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [tennysonBounds, setTennysonBounds] = useState<any>(null)
  const [showTennysonView, setShowTennysonView] = useState(false)
  const [showMainContent, setShowMainContent] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapInitialized, setMapInitialized] = useState(false)
  const [mapBearing, setMapBearing] = useState(0)
  const [showKybaText, setShowKybaText] = useState(false)
  const [showInfoBox, setShowInfoBox] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showPropertyModal, setShowPropertyModal] = useState(false)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'overview' | 'properties' | 'info' | 'ram'>('overview')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [deviceOrientation, setDeviceOrientation] = useState({ beta: 0, gamma: 0 })
  const [showOrientationPrompt, setShowOrientationPrompt] = useState(false)
  const [orientationPermissionGranted, setOrientationPermissionGranted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showPropertyLabels, setShowPropertyLabels] = useState(false)
  const [showSplitScreen, setShowSplitScreen] = useState(false)
  const [showDroneVideo, setShowDroneVideo] = useState(false)
  const [ramFeatures, setRamFeatures] = useState({
    drillTargets: false,
    geologicalStructures: false,
    historicalData: false,
    terrainAnalysis: false,
    accessRoutes: false
  })
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [showExploreDropdown, setShowExploreDropdown] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentCategory, setCurrentCategory] = useState<'advanced' | 'early' | 'royalties'>('advanced')
  // Removed chunked video states - using MuxDroneVideo instead

  // Add throttling reference for orientation events
  const orientationThrottleRef = useRef<NodeJS.Timeout | null>(null)
  
  // Helper functions to update state and notify parent
  const updateSelectedProperty = (property: string | null) => {
    setSelectedProperty(property)
    onPropertySelectionChange?.(property)
  }
  
  const updateShowSplitScreen = (show: boolean) => {
    setShowSplitScreen(show)
    onSplitScreenChange?.(show)
  }
  
  // Define handleOrientation at component level to avoid duplicates
  const handleOrientation = (event: DeviceOrientationEvent) => {
    // Throttle orientation updates to reduce jerkiness
    if (orientationThrottleRef.current) return
    
    orientationThrottleRef.current = setTimeout(() => {
      orientationThrottleRef.current = null
    }, 100) // Update at most every 100ms for smoother experience
    
    console.log('Device orientation event:', { beta: event.beta, gamma: event.gamma });
    
    if (!prefersReducedMotion) {
      const { beta, gamma } = event
      // Limit the range to prevent extreme tilts
      const limitedBeta = Math.max(-30, Math.min(30, beta || 0))
      const limitedGamma = Math.max(-30, Math.min(30, gamma || 0))
      console.log('Setting device orientation:', { beta: limitedBeta, gamma: limitedGamma });
      setDeviceOrientation({ beta: limitedBeta, gamma: limitedGamma })
    } else {
      console.log('Orientation not applied:', { 
        prefersReducedMotion, 
        innerWidth: window.innerWidth,
        isMobile: window.innerWidth < 768 
      });
    }
  }
  const propertyModalRef = useRef<HTMLDivElement>(null)
  const redLineModalRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [stockData, setStockData] = useState<any>(null)
  const [loadingStock, setLoadingStock] = useState(true)
  const [showProjectsSubmenu, setShowProjectsSubmenu] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Add swipe to close mobile menu
  useSwipe(mobileMenuRef, {
    onSwipeRight: () => {
      if (showMobileMenu) {
        setShowMobileMenu(false)
      }
    },
    threshold: 50
  })

  // Fetch stock data
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stock-quote')
        const data = await response.json()
        if (data && data.price !== undefined) {
          setStockData({
            symbol: data.symbol || 'TSX-V: TUO',
            price: data.price,
            change: data.change || 0,
            changePercent: data.changePercent || 0,
            volume: data.volume || '--',
            high: data.high || data.price,
            low: data.low || data.price,
            marketCap: data.marketCap || '--',
            timestamp: data.timestamp
          })
        }
        setLoadingStock(false)
      } catch (err) {
        console.error('Error fetching stock quote:', err)
        setLoadingStock(false)
      }
    }

    fetchStockData()
    const stockInterval = setInterval(fetchStockData, 300000) // Update every 5 minutes
    
    return () => clearInterval(stockInterval)
  }, [])

  // Swipe handler for property modal
  useSwipe(propertyModalRef, {
    onSwipeDown: () => {
      if (showPropertyModal) {
        setShowPropertyModal(false)
        setCurrentView('overview')
      }
    },
    threshold: 50
  })

  // Swipe handler for red line modal
  useSwipe(redLineModalRef, {
    onSwipeDown: () => {
      if (showInfoBox) {
        setShowInfoBox(false)
        setCurrentView('overview')
      }
    },
    threshold: 50
  })

  // Helper function to fit bounds for mobile overview
  const fitMobileOverviewBounds = () => {
    if (!map.current || !LUXOR_BOUNDARIES) return
    
    // Calculate bounds of all Luxor properties
    const bounds = new mapboxgl.LngLatBounds()
    
    LUXOR_BOUNDARIES.features.forEach((feature: any) => {
      if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates[0].forEach((coord: number[]) => {
          bounds.extend([coord[0], coord[1]])
        })
      } else if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach((polygon: number[][][]) => {
          polygon[0].forEach((coord: number[]) => {
            bounds.extend([coord[0], coord[1]])
          })
        })
      }
    })
    
    // Also include major projects in bounds for context
    MAJOR_PROJECTS.forEach(project => {
      bounds.extend(project.coordinates as [number, number])
    })
    
    // Include the full extent of the red line (including upper segment)
    // Main line: extends from approximately 56.089 N to 55.513 S
    // Upper segment: extends from approximately 55.468 N to 55.440 S
    // Longitude: from -129.838 W to -129.407 W based on the GeoJSON data
    bounds.extend([-129.838, 56.089]) // Northern extent of main red line
    bounds.extend([-129.407, 55.440]) // Eastern extent of upper segment
    bounds.extend([-129.488, 55.513]) // Southern extent of main red line
    
    // Get the bounds center for adjustment
    const boundsCenter = bounds.getCenter()
    
    // Shift 10% west only
    const westShift = 0.04 // 10% westward shift
    const shiftedCenter: [number, number] = [
      boundsCenter.lng - westShift, // West is negative longitude
      boundsCenter.lat  // No north/south shift
    ]
    
    // Fit bounds with padding adjusted for mobile navigation
    // Bottom padding accounts for nav bar (64px) + safe area + margin
    // Adjust for teaser mode: shift viewport up 20% and zoom out 15%
    map.current.fitBounds(bounds, {
      padding: { 
        top: useTeutonLogo ? 320 : 200, // Shift viewport up 20% for teaser (60% increase in top padding)
        bottom: useTeutonLogo ? 40 : 80, // Reduce bottom padding for teaser
        left: 20, 
        right: 20 
      },
      duration: 800, // Much faster initial zoom
      pitch: 45, // Reduced from 65 to make RAM property appear larger
      bearing: -14.4, // 4% counter-clockwise rotation (360 * 0.04 = 14.4 degrees, negative for CCW)
      maxZoom: useTeutonLogo ? 
        (window.innerWidth >= 390 ? 9.8 : 9.3) : // Zoom out 15% for teaser (11.5 * 0.85 = 9.8, 11 * 0.85 = 9.3)
        (window.innerWidth >= 390 ? 11.5 : 11), // Original zoom for regular mode
      offset: useTeutonLogo ? [0, -40] : [0, 40], // Shift viewport up for teaser (negative offset)
      center: shiftedCenter // Use shifted center
    })
    
    // Show markers and labels after animation completes
    map.current.once('moveend', () => {
      setTimeout(() => {
        const mainMarkers = document.querySelectorAll('.property-marker-main')
        const markers = document.querySelectorAll('.property-marker-icon')
        const labels = document.querySelectorAll('.property-label')
        mainMarkers.forEach((marker) => {
          (marker as HTMLElement).style.opacity = '1'
        })
        markers.forEach((marker) => {
          (marker as HTMLElement).style.opacity = '1'
        })
        labels.forEach((label) => {
          (label as HTMLElement).style.opacity = '1'
        })
      }, 300)
    })
  }

  // Request orientation permission handler (for iOS devices)
  const requestOrientationPermission = async () => {
    console.log('requestOrientationPermission called');
    
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      console.log('iOS device detected, requesting permission...');
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission()
        console.log('Permission response:', response);
        
        if (response === 'granted') {
          // Permission granted - add the event listener
          window.addEventListener('deviceorientation', handleOrientation)
          setOrientationPermissionGranted(true)
          setShowOrientationPrompt(false)
          console.log('✓ Device orientation permission granted and listener added');
          
          // Test if events are firing
          setTimeout(() => {
            console.log('Testing orientation after 2s...');
          }, 2000);
        } else {
          console.log('Permission denied:', response);
          alert('Motion permission was denied. Please enable it in Settings > Safari > Motion & Orientation Access.');
        }
      } catch (error) {
        console.error('Error requesting device orientation permission:', error)
        alert('Error requesting motion permission. Please check your settings.');
      }
    } else {
      // Non-iOS device or no permission API
      console.log('Non-iOS device or no permission API');
      window.addEventListener('deviceorientation', handleOrientation)
      setOrientationPermissionGranted(true)
      setShowOrientationPrompt(false)
      alert('Motion effects enabled!');
    }
  }

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      console.log('Mobile check:', { 
        innerWidth: window.innerWidth, 
        isMobile: mobile,
        showMainContent,
        shouldShowNav: mobile && showMainContent
      })
      
      // Handle header visibility on resize
      const header = document.querySelector('header')
      if (header) {
        if (mobile) {
          header.style.display = 'none'
        } else {
          header.style.display = ''
          header.style.opacity = '0'
          header.style.transition = 'opacity 1.5s ease-in-out'
        }
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(motionQuery.matches)
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    
    // Note: handleOrientation is defined at component level to avoid duplicates
    
    // Internal permission request that also adds the event listener
    const requestPermissionAndAddListener = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const response = await (DeviceOrientationEvent as any).requestPermission()
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
            setOrientationPermissionGranted(true)
            setShowOrientationPrompt(false)
          }
        } catch (error) {
          console.error('Error requesting device orientation permission:', error)
        }
      }
    }
    
    // For iOS 13+, we need user interaction to request permission
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // Motion prompt disabled - no longer shows automatically
      // if (window.innerWidth < 768) {
      //   setTimeout(() => {
      //     if (!orientationPermissionGranted) {
      //       setShowOrientationPrompt(true)
      //     }
      //   }, 2000)
      // }
      
      // Add event listener to request permission on first user interaction
      const handleFirstInteraction = () => {
        requestPermissionAndAddListener()
        window.removeEventListener('touchstart', handleFirstInteraction)
        window.removeEventListener('click', handleFirstInteraction)
      }
      window.addEventListener('touchstart', handleFirstInteraction)
      window.addEventListener('click', handleFirstInteraction)
    } else {
      // Non-iOS devices - no permission needed
      console.log('Non-iOS device detected, adding orientation listener directly');
      window.addEventListener('deviceorientation', handleOrientation)
      setOrientationPermissionGranted(true)
    }
    
    // Hide header initially and on mobile
    const header = document.querySelector('header')
    if (header) {
      if (window.innerWidth < 768) {
        header.style.display = 'none'
      } else {
        header.style.opacity = '0'
        header.style.transition = 'opacity 1.5s ease-in-out'
      }
    }
    
    if (!mapContainer.current) return

    // Check for Mapbox token
    if (!MAPBOX_TOKEN) {
      console.error('Mapbox token not found')
      setError('Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file.')
      return
    }
    
    console.log('Mapbox token found:', MAPBOX_TOKEN.substring(0, 10) + '...')

    // Load Teuton boundaries from GeoJSON file
    fetch('/images/silvergrail-properties.geojson')
      .then(response => response.json())
      .then(data => {
        LUXOR_BOUNDARIES = data
        console.log('Loaded Teuton boundaries:', data.features.length, 'properties')
        console.log('Initial zoomLevel state:', zoomLevel)
        
        // Find FIJI claims for bounds calculation (main property)
        const fijiClaims = data.features.filter((feature: any) => {
          return feature.properties?.name === 'FIJI'
        })
        
        if (fijiClaims.length > 0) {
          console.log('Found', fijiClaims.length, 'FIJI claims')
          
          // Calculate bounds for Tennyson property
          const allCoords: number[][] = []
          fijiClaims.forEach((feature: any) => {
            if (feature.geometry?.type === 'Polygon') {
              feature.geometry.coordinates[0].forEach((coord: number[]) => {
                allCoords.push(coord)
              })
            } else if (feature.geometry?.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                polygon[0].forEach((coord: number[]) => {
                  allCoords.push(coord)
                })
              })
            }
          })
          
          if (allCoords.length > 0) {
            const lngs = allCoords.map(coord => coord[0])
            const lats = allCoords.map(coord => coord[1])
            const bounds = {
              west: Math.min(...lngs),
              east: Math.max(...lngs),
              south: Math.min(...lats),
              north: Math.max(...lats)
            }
            setTennysonBounds(bounds)
          }
        }
        
        // Initialize map
        initializeMap()
      })
      .catch(err => {
        console.error('Error loading claim boundaries:', err)
        // Fall back to placeholder boundaries
        LUXOR_BOUNDARIES = {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: { name: 'Luxor Project' },
            geometry: {
              type: 'Polygon',
              coordinates: [[
                [-130.2, 56.2],
                [-130.1, 56.2],
                [-130.1, 56.3],
                [-130.2, 56.3],
                [-130.2, 56.2]
              ]]
            }
          }]
        }
        // Initialize map with fallback data
        initializeMap()
      })

    // Initialize map
    const initializeMap = () => {
      console.log('Initializing map...')
      console.log('Container:', mapContainer.current)
      console.log('Token exists:', !!MAPBOX_TOKEN)
      console.log('LUXOR_BOUNDARIES loaded:', !!LUXOR_BOUNDARIES)
      
      if (!mapContainer.current) {
        console.error('No map container')
        return
      }
      
      if (!MAPBOX_TOKEN) {
        console.error('No Mapbox token')
        return
      }
      
      mapboxgl.accessToken = MAPBOX_TOKEN
      
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/satellite-v9',
          center: isMobile 
            ? [-129.653, 54.3] as [number, number] // Mobile: shifted much further south for maximum bottom half content
            : [-129.653, 55.827] as [number, number], // Desktop: original center
          zoom: 7,
          pitch: 0,
          bearing: 0,
          interactive: true, // Need this for clicks to work
          attributionControl: false // Disable default attribution
        })
        
        // Add navigation control (compass) in bottom-right for mobile
        if (isMobile) {
          map.current.addControl(new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: false,
            visualizePitch: false
          }), 'bottom-right')
        }
        
        // Add attribution in correct position
        map.current.addControl(new mapboxgl.AttributionControl({
          compact: true
        }), 'bottom-right')
      } catch (err) {
        console.error('Error initializing map:', err)
        setError('Failed to initialize map. Check console for details.')
        return
      }

    // Disable unwanted interactions but keep click events
    map.current.scrollZoom.disable()
    map.current.boxZoom.disable()
    map.current.dragRotate.disable()
    map.current.dragPan.disable()
    map.current.keyboard.disable()
    map.current.doubleClickZoom.disable()
    map.current.touchZoomRotate.disable()
    
    map.current.on('error', (e: any) => {
      console.error('Map error:', e)
      if (e && e.error && e.error.message) {
        setError('Map error: ' + e.error.message)
      } else if (e && e.error) {
        setError('Map error: ' + JSON.stringify(e.error))
      } else {
        setError('Map error: ' + JSON.stringify(e))
      }
    })
    
    map.current.on('load', () => {
      console.log('Map loaded successfully')
      setIsLoaded(true)
      setIsMapLoading(false)
      setError(null) // Clear any errors

      // Notify parent of any map interaction (for pausing background video)
      map.current!.on('click', () => {
        if (onMapInteraction) onMapInteraction()
      })
      map.current!.on('touchstart', () => {
        if (onMapInteraction) onMapInteraction()
      })

      // Click handler for red line detection
      map.current!.on('click', (e) => {
        console.log('Map clicked at:', e.point, e.lngLat)
        
        // Check if we have the red line layers
        if (map.current!.getLayer('red-area-fill')) {
          // Query for red line features at click point
          const features = map.current!.queryRenderedFeatures(e.point, {
            layers: ['red-area-fill', 'red-area-outline', 'red-area-glow']
          })
          
          if (features.length > 0) {
            console.log('Red line clicked! Features:', features.length)
            
            // Toggle info box
            if (showInfoBox) {
              console.log('Closing info box')
              setShowInfoBox(false)
            } else {
              console.log('Opening info box')
              setShowInfoBox(true)
            }
          }
        }
      })
      
      // Wait for style to be fully loaded
      if (!map.current!.isStyleLoaded()) {
        console.log('Waiting for style to load...')
        map.current!.once('styledata', () => {
          console.log('Style loaded, adding sources and layers')
          setMapInitialized(true)
          addMapLayers()
        })
      } else {
        setMapInitialized(true)
        addMapLayers()
      }
      
      // Track zoom level
      map.current!.on('zoom', () => {
        const currentZoom = map.current!.getZoom()
        console.log('Zoom changed to:', currentZoom)
        setZoomLevel(currentZoom)
        
        // Set data attribute for header to respond to
        if (currentZoom > 10) {
          document.documentElement.setAttribute('data-map-zoomed', 'true')
        } else {
          document.documentElement.setAttribute('data-map-zoomed', 'false')
        }
      })
      
      // Track map bearing/rotation
      map.current!.on('rotate', () => {
        const currentBearing = map.current!.getBearing()
        setMapBearing(currentBearing)
      })
      
      // Also track bearing during move events (for flyTo animations)
      map.current!.on('move', () => {
        const currentBearing = map.current!.getBearing()
        setMapBearing(currentBearing)
      })
    })
    
    const addMapLayers = () => {
      if (!map.current) return
      
      // Add 3D terrain if not already present
      if (!map.current!.getSource('mapbox-dem')) {
        try {
          map.current!.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          })
          
          // Add error listener for terrain loading
          map.current!.on('error', (e: any) => {
            if (e.source && e.source.id === 'mapbox-dem') {
              console.error('Terrain loading failed:', e)
              // Try to continue without terrain
              if (map.current) {
                map.current.setTerrain(null)
              }
            }
          })
          
          // Set the terrain with subtle 3D effect
          // Check WebGL support first
          const canvas = map.current!.getCanvas()
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
          
          if (gl) {
            // Add a small delay for mobile to ensure source is loaded
            if (isMobile) {
              setTimeout(() => {
                if (map.current && map.current.getSource('mapbox-dem')) {
                  map.current.setTerrain({ 
                    source: 'mapbox-dem', 
                    exaggeration: 1.3 // More exaggeration on mobile
                  })
                }
              }, 1000)
            } else {
              map.current!.setTerrain({ 
                source: 'mapbox-dem', 
                exaggeration: 1.1
              })
            }
          } else {
            console.warn('WebGL not supported, 3D terrain disabled')
          }
        } catch (error) {
          console.error('Failed to add terrain:', error)
        }
      }
      
      // Set map background to dark blue (matching header)
      map.current!.setPaintProperty('background', 'background-color', '#0d0f1e')

      // Add fog for dark blue atmosphere at edges
      map.current!.setFog({
        color: '#0d0f1e',
        'high-color': '#0a0c19',
        'horizon-blend': 0.08,
        'space-color': '#0d0f1e',
        'star-intensity': 0
      })

      // Apply dark blue tint to satellite imagery (matching header)
      map.current!.setPaintProperty('satellite', 'raster-saturation', 0.2)   // Less saturation
      map.current!.setPaintProperty('satellite', 'raster-hue-rotate', 155)   // More true blue, less purple
      map.current!.setPaintProperty('satellite', 'raster-brightness-min', 0.05)
      map.current!.setPaintProperty('satellite', 'raster-brightness-max', 0.35)
      map.current!.setPaintProperty('satellite', 'raster-contrast', 0.3)
      
      // Always start with individual claims
      if (LUXOR_BOUNDARIES) {
        console.log('Adding luxor-properties source with', LUXOR_BOUNDARIES.features?.length || 0, 'features')
        if (!map.current!.getSource('luxor-properties')) {
          map.current!.addSource('luxor-properties', {
            type: 'geojson',
            data: LUXOR_BOUNDARIES as any
          })
        }
      } else {
        console.warn('LUXOR_BOUNDARIES not loaded yet, skipping source addition')
        return
      }
      
      // Clean up any existing Tennyson layers that might have been left over
      const tennysonLayers = ['tennyson-properties-inner-line', 'tennyson-properties-outline', 'tennyson-properties-glow', 'tennyson-properties-fill']
      tennysonLayers.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          console.log(`Removing leftover Tennyson layer: ${layerId}`)
          map.current!.removeLayer(layerId)
        }
      })
      
      // Create gradient overlay using a fill layer with viewport bounds
      const gradientBounds = [
        [-180, -85],
        [180, -85], 
        [180, 85],
        [-180, 85],
        [-180, -85]
      ]
      
      if (!map.current!.getSource('gradient-overlay-source')) {
        map.current!.addSource('gradient-overlay-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [gradientBounds]
            }
          }
        })
      }
      
      // Add gradient layers with Teuton dark navy theme (#011936)
      if (!map.current!.getLayer('gradient-base')) {
        map.current!.addLayer({
          id: 'gradient-base',
          type: 'fill',
          source: 'gradient-overlay-source',
          paint: {
            'fill-color': '#011936',
            'fill-opacity': 0.4
          }
        })
      }

      if (!map.current!.getLayer('gradient-blue')) {
        map.current!.addLayer({
          id: 'gradient-blue',
          type: 'fill',
          source: 'gradient-overlay-source',
          paint: {
            'fill-color': '#011936',
            'fill-opacity': 0.25
          }
        })
      }
      
      // Remove the glass base layer as it's too subtle on satellite imagery

      // Add fill for Teuton properties (not adjacent) - light blue gradient
      if (!map.current!.getLayer('luxor-properties-fill')) {
        map.current!.addLayer({
        id: 'luxor-properties-fill',
        type: 'fill',
        source: 'luxor-properties',
        filter: ['!=', ['get', 'type'], 'adjacent'],
        paint: {
          'fill-color': '#c0d8ff',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.4,
            10, 0.5,
            14, 0.6
          ]
        }
        })
      }

      // Add fill for adjacent properties with different color
      if (!map.current!.getLayer('adjacent-properties-fill')) {
        map.current!.addLayer({
        id: 'adjacent-properties-fill',
        type: 'fill',
        source: 'luxor-properties',
        filter: ['==', ['get', 'type'], 'adjacent'],
        paint: {
          'fill-color': '#c0d8ff',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.15,
            10, 0.2,
            14, 0.3
          ]
        }
        })
      }

      // Add a glow layer that will pulse (only for Teuton properties)
      if (!map.current!.getLayer('luxor-properties-glow')) {
        map.current!.addLayer({
        id: 'luxor-properties-glow',
        type: 'line',
        source: 'luxor-properties',
        filter: ['!=', ['get', 'type'], 'adjacent'],
        paint: {
          'line-color': '#a0c4ff',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 15,
            10, 25,
            14, 35
          ],
          'line-blur': 15,
          'line-opacity': 0
        }
        })
      }

      // Add a sharp outline around the Teuton properties - light blue
      if (!map.current!.getLayer('luxor-properties-outline')) {
        map.current!.addLayer({
        id: 'luxor-properties-outline',
        type: 'line',
        source: 'luxor-properties',
        filter: ['!=', ['get', 'type'], 'adjacent'],
        paint: {
          'line-color': '#a0c4ff',
          'line-width': 2,
          'line-opacity': 1,
          'line-blur': 0
        }
        })
      }

      // Add outline for adjacent properties
      if (!map.current!.getLayer('adjacent-properties-outline')) {
        map.current!.addLayer({
        id: 'adjacent-properties-outline',
        type: 'line',
        source: 'luxor-properties',
        filter: ['==', ['get', 'type'], 'adjacent'],
        paint: {
          'line-color': '#7aa8e6',  // Slightly darker blue for adjacent
          'line-width': 1.5,
          'line-opacity': 0.8,
          'line-blur': 0,
          'line-dasharray': [2, 2]  // Dashed line
        }
        })
      }

      // Add an inner bright line for extra definition
      if (!map.current!.getLayer('luxor-properties-inner-line')) {
        map.current!.addLayer({
          id: 'luxor-properties-inner-line',
          type: 'line',
          source: 'luxor-properties',
          paint: {
            'line-color': '#c0d8ff',
            'line-width': 1,
            'line-opacity': 0.8,
            'line-offset': -1
          }
        })
      }
      
      // Add the final cleaned Fiji-Goliath red line (including upper segment near RAM)
      fetch('/images/fiji-goliath-red-line-connected.geojson')
        .then(response => {
          console.log('Fiji-Goliath Red line response status:', response.status)
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => {
          console.log('Loaded Fiji-Goliath red line data (with upper segment):', data)
          console.log('Fiji-Goliath red line features count:', data.features?.length || 0)
          
          // Debug: Log all features to verify they're loaded
          data.features?.forEach((feature: any, index: number) => {
            console.log(`Red line feature ${index}:`, feature.properties?.name, 
                       'coordinates count:', feature.geometry?.coordinates?.length)
            if (feature.geometry?.coordinates?.length > 0) {
              const coords = feature.geometry.coordinates
              console.log(`Feature ${index} bounds:`, 
                         'lat:', Math.min(...coords.map((c: any) => c[1])), 'to', Math.max(...coords.map((c: any) => c[1])),
                         'lng:', Math.min(...coords.map((c: any) => c[0])), 'to', Math.max(...coords.map((c: any) => c[0])))
            }
          })
          
          try {
            if (!map.current) return
            
            if (!map.current.getSource('modified-red-line')) {
              map.current.addSource('modified-red-line', {
                type: 'geojson',
                data: data
              })
              console.log('Added Fiji-Goliath red-line source')
            }
            
            // Add red glow layer first (underneath) - for LineString
            if (!map.current.getLayer('red-line-glow')) {
              map.current.addLayer({
                id: 'red-line-glow',
                type: 'line',
                source: 'modified-red-line',
                paint: {
                  'line-color': '#FF0000',
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7, 18,
                    10, 24,
                    14, 36
                  ],
                  'line-blur': 15,
                  'line-opacity': 0.15
                },
                layout: {
                  'line-cap': 'round',
                  'line-join': 'round'
                }
              }, 'luxor-properties-fill')
              console.log('Added red-line-glow layer')
            }
            
            // Add the main red line outline layer
            if (!map.current.getLayer('red-line-main')) {
              map.current.addLayer({
                id: 'red-line-main',
                type: 'line',
                source: 'modified-red-line',
                paint: {
                  'line-color': '#FF0000',
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    7, 3,
                    10, 4,
                    14, 6
                  ],
                  'line-opacity': 0.6
                },
                layout: {
                  'line-cap': 'round',
                  'line-join': 'round'
                }
              }, 'red-line-glow')
              console.log('Added red-line-main layer')
              
              // Delay the pulsing animation until after initial zoom
              setTimeout(() => {
                // Add pulsing red line animation
                let redGlowPhase = Math.PI * 1.5 // Start at minimum point of sine wave
                const redGlowInterval = setInterval(() => {
                  redGlowPhase = (redGlowPhase + 0.04) % (Math.PI * 2)
                  
                  // Calculate pulsing values for line
                  const pulseIntensity = 0.8 + Math.sin(redGlowPhase) * 0.2 // Varies from 0.6 to 1.0
                  const glowIntensity = 0.3 + Math.sin(redGlowPhase) * 0.2 // Varies from 0.1 to 0.5
                  const glowWidth = 1 + Math.sin(redGlowPhase) * 1.5 // Varies from 0 to 3
                  
                  if (map.current) {
                    // Pulse the main line
                    if (map.current.getLayer('red-line-main')) {
                      map.current.setPaintProperty('red-line-main', 'line-opacity', pulseIntensity)
                      map.current.setPaintProperty('red-line-main', 'line-width', [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        6, 2 + glowWidth * 0.5,
                        10, 3 + glowWidth * 0.7,
                        14, 4 + glowWidth,
                        18, 6 + glowWidth * 1.5
                      ])
                    }
                    
                    // Pulse the glow layer
                    if (map.current.getLayer('red-line-glow')) {
                      map.current.setPaintProperty('red-line-glow', 'line-opacity', glowIntensity)
                      map.current.setPaintProperty('red-line-glow', 'line-width', [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        6, 8 + glowWidth * 2,
                        10, 12 + glowWidth * 3,
                        14, 18 + glowWidth * 4,
                        18, 24 + glowWidth * 6
                      ])
                    }
                  }
                }, 80) // Update every 80ms for smooth pulsing
              }, 5000) // Delay 5 seconds before starting the pulse
              
              // Show Kyba's Red Line text after a delay
              setTimeout(() => {
                setShowKybaText(true)
              }, 4000)
            }
            
            // Add cursor pointer on hover for red line
            (['red-line-main', 'red-line-glow'] as const).forEach((layerId: string) => {
              map.current!.on('mouseenter', layerId, () => {
                map.current!.getCanvas().style.cursor = 'pointer'
              })
              
              map.current!.on('mouseleave', layerId, () => {
                map.current!.getCanvas().style.cursor = ''
              })
              
              // Click handler disabled - Red Line info box removed
              /* map.current!.on('click', layerId, (e) => {
                e.preventDefault()
                setShowInfoBox(true)
              }) */
            })
            
            console.log('Fiji-Goliath Red line layers added successfully (including upper segment)')
            // Labels removed - now displaying complete red line with upper segment near RAM
            
          } catch (layerError) {
            console.error('Error adding red line layers:', layerError)
          }
        })
        .catch(error => {
          console.error('Error loading Fiji-Goliath red line:', error)
        })
      
      // Add compass/bearing tracking
      map.current!.on('rotate', () => {
        const bearing = map.current!.getBearing()
        setMapBearing(bearing)
      })


      
      // Clear any existing markers before adding new ones
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      
      // Add major projects as pulsing points - show all markers including Teuton properties
      MAJOR_PROJECTS.forEach((project, index) => {
        // Show all markers now (removed filter)
        
        // Create a custom marker element
        const el = document.createElement('div')
        el.className = 'project-marker'
        el.style.cssText = `
          position: absolute;
          width: 40px;
          height: 40px;
          z-index: ${70000 - index};
          pointer-events: none;
        `
        
        // Adjust label positioning based on project to avoid overlaps
        const isMobileView = window.innerWidth < 768
        
        // Desktop positioning - labels at edge of dots without overlapping
        const desktopPositions: { [key: string]: { top?: string; bottom?: string; left?: string; right?: string; transform?: string } } = {
          'KSM Project': { top: '50%', left: 'calc(-100% - 20px)', transform: 'translateY(-50%)' }, // Left of dot
          'Brucejack': { top: 'calc(100% + 5px)', right: 'calc(0% - 10px)', transform: 'none' }, // Below-right corner
          'Treaty Creek': { bottom: 'calc(100% + 5px)', left: 'calc(0% - 10px)', transform: 'none' }, // Above-left corner
          'Eskay Creek': { bottom: 'calc(100% + 5px)', right: 'calc(0% - 10px)', transform: 'none' }, // Above-right corner
          'Granduc': { top: 'calc(100% + 5px)', left: 'calc(0% - 10px)', transform: 'none' }, // Below-left corner
          'Red Mountain': { top: 'calc(100% - 2px)', left: 'calc(50% + 10px)', transform: 'none' }, // Below and to the right of dot, moved up slightly
          'Golddigger': { bottom: 'calc(100% + 5px)', right: 'calc(50% + 10px)', transform: 'none' }, // Above-left corner
          'Dolly Varden': { top: '50%', left: 'calc(100% + 10px)', transform: 'translateY(-50%)' }, // Right of dot
          // Teuton properties
          'FIJI': { top: 'calc(100% + 5px)', left: 'calc(100% - 20px)', transform: 'none' }, // Below-right of dot
          'TONGA': { top: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' }, // Below center
          'RAM': { top: '50%', left: 'calc(100% + 10px)', transform: 'translateY(-50%)' }, // Right of dot
          'CLONE': { top: 'calc(100% + 5px)', right: 'calc(100% - 20px)', transform: 'none' }, // Below-left of dot
          'KONKIN SILVER': { top: 'calc(100% + 5px)', left: 'calc(50% + 10px)', transform: 'none' }, // Below and to the right
          'MIDAS': { bottom: 'calc(100% + 5px)', left: '50%', transform: 'translateX(-50%)' } // Above center
        }
        
        // Mobile positioning - labels at edge of dots without overlapping
        const mobilePositions: { [key: string]: { top?: string; bottom?: string; left?: string; right?: string; transform?: string } } = {
          'KSM Project': { top: '50%', left: 'calc(-100% - 15px)', transform: 'translateY(-50%)' }, // Left of dot
          'Brucejack': { top: 'calc(100% + 3px)', right: 'calc(0% - 5px)', transform: 'none' }, // Below-right corner
          'Treaty Creek': { bottom: 'calc(100% + 3px)', left: 'calc(0% - 5px)', transform: 'none' }, // Above-left corner
          'Eskay Creek': { bottom: 'calc(100% + 3px)', right: 'calc(0% - 5px)', transform: 'none' }, // Above-right corner
          'Granduc': { top: 'calc(100% + 3px)', left: 'calc(0% - 5px)', transform: 'none' }, // Below-left corner
          'Red Mountain': { top: 'calc(100% - 1px)', left: 'calc(50% + 5px)', transform: 'none' }, // Below and to the right of dot, moved up slightly
          'Golddigger': { bottom: 'calc(100% + 3px)', right: 'calc(50% + 5px)', transform: 'none' }, // Above-left corner
          'Dolly Varden': { top: '50%', left: 'calc(100% + 5px)', transform: 'translateY(-50%)' }, // Right of dot
          // Teuton properties
          'FIJI': { top: 'calc(100% + 3px)', left: 'calc(100% - 10px)', transform: 'none' }, // Below-right of dot
          'TONGA': { top: 'calc(100% + 3px)', left: '50%', transform: 'translateX(-50%)' }, // Below center
          'RAM': { top: '50%', left: 'calc(100% + 5px)', transform: 'translateY(-50%)' }, // Right of dot
          'CLONE': { top: 'calc(100% + 3px)', right: 'calc(100% - 10px)', transform: 'none' }, // Below-left of dot
          'KONKIN SILVER': { top: 'calc(100% + 3px)', left: 'calc(50% + 5px)', transform: 'none' }, // Below and to the right
          'MIDAS': { bottom: 'calc(100% + 3px)', left: '50%', transform: 'translateX(-50%)' } // Above center
        }
        
        const labelPositions = isMobileView ? mobilePositions : desktopPositions
        const labelPos = labelPositions[project.name] || { 
          top: isMobileView ? '-25px' : '-40px', 
          left: '50%', 
          transform: 'translateX(-50%)' 
        }
        
        el.innerHTML = `
          ${project.description === 'Teuton property' ? `
          <div class="pulse-ring" style="
            position: absolute;
            width: 80px;
            height: 80px;
            background: radial-gradient(
              circle,
              transparent 45%,
              ${project.color}15 50%,
              ${project.color}08 55%,
              transparent 60%
            );
            border: 2px solid ${project.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-ring 8s infinite ease-out;
            animation-delay: ${index * 0.2}s;
            opacity: 0.5;
            filter: blur(0.5px);
            box-shadow: 
              0 0 40px ${project.color}80,
              inset 0 0 30px ${project.color}40;
          "></div>
          <div class="pulse-ring" style="
            position: absolute;
            width: 60px;
            height: 60px;
            border: 1.5px solid ${project.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse-ring 8s infinite ease-out;
            animation-delay: ${index * 0.2 + 0.3}s;
            opacity: 0.3;
            filter: blur(0.3px);
          "></div>
          ` : ''}
          <div class="property-marker-main" style="
            position: absolute;
            width: 30px;
            height: 30px;
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.1) 20%,
              ${project.color}99 40%,
              ${project.color} 100%
            );
            border: 2px solid rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 
              0 0 40px ${project.color}, 
              0 8px 32px rgba(31, 38, 135, 0.37),
              inset -3px -3px 6px rgba(0, 0, 0, 0.3),
              inset 3px 3px 6px rgba(255, 255, 255, 0.4),
              0 0 60px ${project.color}60;
            backdrop-filter: blur(20px) saturate(180%) brightness(1.2);
            -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.2);
            overflow: hidden;
            opacity: 0;
            transition: opacity 1.5s ease-in-out;
          ">
            <div style="
              position: absolute;
              top: 2px;
              left: 2px;
              right: 2px;
              bottom: 2px;
              border-radius: 50%;
              background: radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, 0.3) 0%,
                transparent 50%
              );
            "></div>
          </div>
          <div class="property-marker-icon" style="
            position: absolute;
            width: 10px;
            height: 10px;
            background: radial-gradient(
              circle,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(255, 255, 255, 0.7) 50%,
              rgba(255, 255, 255, 0.5) 100%
            );
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 
              0 0 10px rgba(255, 255, 255, 0.8),
              0 0 20px rgba(255, 255, 255, 0.4);
            opacity: 0;
            transition: opacity 1.5s ease-in-out;
          "></div>
          <div class="property-label" style="
            position: absolute;
            ${labelPos.top ? `top: ${labelPos.top};` : ''}
            ${labelPos.bottom ? `bottom: ${labelPos.bottom};` : ''}
            ${labelPos.left ? `left: ${labelPos.left};` : ''}
            ${labelPos.right ? `right: ${labelPos.right};` : ''}
            ${labelPos.transform || (labelPos.left === '50%' ? 'transform: translateX(-50%);' : '')}
            text-align: center;
            min-width: ${window.innerWidth < 768 ? 'auto' : '150px'};
            z-index: 80000;
            pointer-events: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name) && window.innerWidth >= 768 ? 'auto' : 'none'};
            cursor: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name) && window.innerWidth >= 768 ? 'pointer' : 'default'};
            white-space: nowrap;
            opacity: 0;
            transition: opacity 1.5s ease-in-out;
          ">
            <div class="property-label-inner" style="
              position: relative;
              background: ${project.description === 'Teuton property'
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.98) 100%)'
                : 'linear-gradient(135deg, rgba(220, 220, 225, 0.95) 0%, rgba(210, 210, 215, 0.9) 50%, rgba(220, 220, 225, 0.95) 100%)'};
              backdrop-filter: blur(20px) saturate(180%) brightness(1.1);
              -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.1);
              padding: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name)
                ? (window.innerWidth < 768 ? '7px 18px' : '11px 25px')
                : (window.innerWidth < 768 ? '7px 18px' : '9px 24px')};
              border-radius: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name)
                ? (window.innerWidth < 768 ? '14.4px' : '18px')
                : '22px'};
              border: ${project.description === 'Teuton property'
                ? '2px solid rgba(255, 255, 255, 1)'
                : '1px solid rgba(180, 180, 185, 0.8)'};
              box-shadow: ${project.description === 'Teuton property'
                ? '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 2px 4px 0 rgba(255, 255, 255, 0.5)'
                : '0 4px 16px 0 rgba(0, 0, 0, 0.15)'};
              overflow: hidden;
              transition: all 0.3s ease;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            ">
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 1px;
              background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(255, 255, 255, 0.3) 50%,
                transparent 100%
              );
              opacity: 0.5;
            "></div>
            <span style="
              color: #0d0f1e;
              background: none;
              font-weight: ${project.description === 'Teuton property' ? '700' : '500'};
              font-size: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name)
                ? (window.innerWidth < 768 ? '14.4px' : '17.1px')
                : (window.innerWidth < 768 ? '12.75px' : '15.3px')};
              white-space: nowrap;
              font-family: 'Aeonik Extended', sans-serif;
              letter-spacing: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name) ? '0.08em' : '0.06em'};
              text-transform: uppercase;
              line-height: 1.1;
              display: inline-block;
              text-shadow: none;
            ">${project.name}</span>
            ${window.innerWidth >= 768 ? `
              <div style="
                color: rgba(13, 15, 30, 0.75);
                background: none;
                font-size: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name) ? '10.8px' : '9.35px'};
                font-weight: 500;
                font-family: 'Aeonik', sans-serif;
                opacity: 1;
                letter-spacing: 0.04em;
                margin-top: ${['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name) ? '3px' : '2px'};
                line-height: 1.3;
                text-transform: uppercase;
                text-shadow: none;
              ">${project.description}</div>
            ` : ''}
            </div>
          </div>
        `

        const marker = new mapboxgl.Marker(el, { anchor: 'center' })
          .setLngLat(project.coordinates as [number, number])
          .addTo(map.current!)
        
        // Store marker reference for cleanup
        markersRef.current.push(marker)
        el.setAttribute('data-project-name', project.name)
        
        // Add click handler for Teuton property labels
        if (['RAM', 'MIDAS', 'KONKIN SILVER', 'CLONE', 'TONGA', 'FIJI'].includes(project.name)) {
          const labelElement = el.querySelector('.property-label') as HTMLElement
          if (labelElement) {
            // Add hover effect
            const labelInner = labelElement.querySelector('.property-label-inner') as HTMLElement
            if (labelInner) {
              labelElement.addEventListener('mouseenter', () => {
                labelInner.style.transform = 'scale(1.05)'
                labelInner.style.boxShadow = `
                  0 12px 48px 0 rgba(255, 190, 152, 0.35),
                  0 6px 20px 0 rgba(0, 0, 0, 0.15),
                  inset 0 2px 8px 0 rgba(255, 255, 255, 0.35),
                  inset 0 -2px 8px 0 rgba(255, 190, 152, 0.25),
                  0 0 60px rgba(255, 190, 152, 0.25)
                `
              })
              labelElement.addEventListener('mouseleave', () => {
                labelInner.style.transform = 'scale(1)'
                labelInner.style.boxShadow = `
                  0 8px 32px 0 rgba(255, 190, 152, 0.2),
                  0 4px 16px 0 rgba(0, 0, 0, 0.1),
                  inset 0 2px 8px 0 rgba(255, 255, 255, 0.25),
                  inset 0 -2px 8px 0 rgba(255, 190, 152, 0.15),
                  0 0 40px rgba(255, 190, 152, 0.15)
                `
              })
            }
            
            labelElement.addEventListener('click', (e) => {
              e.stopPropagation()
              
              // Handle zoom to specific property
              if (map.current) {
                // Special handling for RAM - use drone view zoom location
                if (project.name === 'RAM') {
                  // Set selected property
                  updateSelectedProperty('RAM')
                  
                  // Use the same zoom location as drone view
                  const drillingCenter: [number, number] = [-129.768, 55.897]
                  const zoomLevel = 14.85
                  const offsetLng = window.innerWidth < 768 ? 0 : -0.0025
                  const offsetLat = window.innerWidth < 768 ? 0 : -0.0065
                  
                  map.current.flyTo({
                    center: [drillingCenter[0] + offsetLng, drillingCenter[1] + offsetLat] as [number, number],
                    zoom: zoomLevel,
                    duration: 2500,
                    pitch: 55,
                    bearing: -45,
                    curve: 1.3
                  })
                  
                  // Show property modal and enable zone labels
                  setTimeout(() => {
                    setShowPropertyModal(true)
                    // Enable zone labels
                    setRamFeatures(prev => ({
                      ...prev,
                      drillTargets: true,
                      geologicalStructures: true
                    }))
                    toggleRamFeature('drillTargets', true)
                    toggleRamFeature('geologicalStructures', true)
                  }, 2500)
                } else {
                  // For other properties, zoom to their coordinates
                  const zoomLevel = 13.5
                  const offsetLng = window.innerWidth < 768 ? 0 : -0.002
                  const offsetLat = window.innerWidth < 768 ? 0 : -0.005
                  
                  map.current.flyTo({
                    center: [project.coordinates[0] + offsetLng, project.coordinates[1] + offsetLat] as [number, number],
                    zoom: zoomLevel,
                    duration: 2500,
                    pitch: 50,
                    bearing: -30,
                    curve: 1.3
                  })
                  
                  // Show property modal after zoom
                  setTimeout(() => {
                    updateSelectedProperty(project.name)
                    setShowPropertyModal(true)
                  }, 2500)
                }
              }
            })
          }
        }
      })

      // Zoom animation sequence
      const startZoomAnimation = () => {
        // Set transitioning to prevent gyroscopic interference
        setIsTransitioning(true)
        
        // First, slowly zoom to show the region
        map.current!.flyTo({
          center: [-129.653, 55.827] as [number, number],
          zoom: 8.5,
          duration: 1200, // Sped up initial zoom only
          curve: 1.2
        })

        // Then zoom to show all major projects in optimal orientation (overview position)
        setTimeout(() => {
          // Calculate the overview center position
          const luxorLat = 55.827
          const luxorLng = -129.653
          const majorDepositsAvgLat = 55.827
          const majorDepositsAvgLng = -129.653
          const centerLat = luxorLat * 0.6 + majorDepositsAvgLat * 0.4
          const centerLng = luxorLng * 0.6 + majorDepositsAvgLng * 0.4
          const adjustedCenterLng = centerLng - 0.186 + 0.04 - 0.013 - 0.026 + 0.025 // Added 3% east
          const adjustedCenterLat = centerLat - 0.04 - 0.025 - 0.0056 - 0.0112 + 0.0056 + 0.0112 - 0.025 // Added 3% south
          
          // For mobile, use fitBounds to ensure all claims are visible
          if (window.innerWidth < 768 && LUXOR_BOUNDARIES && LUXOR_BOUNDARIES.features && LUXOR_BOUNDARIES.features.length > 0) {
            // Calculate bounds of all Luxor properties
            const bounds = new mapboxgl.LngLatBounds()
            
            LUXOR_BOUNDARIES.features.forEach((feature: any) => {
              if (feature.geometry.type === 'Polygon') {
                feature.geometry.coordinates[0].forEach((coord: number[]) => {
                  bounds.extend([coord[0], coord[1]])
                })
              } else if (feature.geometry.type === 'MultiPolygon') {
                feature.geometry.coordinates.forEach((polygon: number[][][]) => {
                  polygon[0].forEach((coord: number[]) => {
                    bounds.extend([coord[0], coord[1]])
                  })
                })
              }
            })
            
            // Also include major projects in bounds for context
            // COMMENTED OUT - Major projects removed
            /*
            MAJOR_PROJECTS.forEach(project => {
              bounds.extend(project.coordinates as [number, number])
            })
            */
            
            // Get the bounds center for adjustment
            const boundsCenter = bounds.getCenter()
            
            // Shift 10% west only
            const westShift = 0.04 // 10% westward shift
            const shiftedCenter: [number, number] = [
              boundsCenter.lng - westShift, // West is negative longitude
              boundsCenter.lat  // No north/south shift
            ]
            
            // Fit bounds with padding adjusted for mobile navigation
            // Adjust for teaser mode: shift viewport up 20% and zoom out 15%
            map.current!.fitBounds(bounds, {
              padding: { 
                top: useTeutonLogo ? 320 : 200, // Shift viewport up 20% for teaser
                bottom: useTeutonLogo ? 40 : 80, // Reduce bottom padding for teaser
                left: 20, 
                right: 20 
              },
              duration: 2800, // Restored original speed for orientation change
              pitch: 45, // Reduced to make properties appear larger
              bearing: -14.4, // 4% counter-clockwise rotation (360 * 0.04 = 14.4 degrees, negative for CCW)
              easing: (t: number) => {
                // Custom easing for smoother acceleration
                return t < 0.5
                  ? 2 * t * t
                  : 1 - Math.pow(-2 * t + 2, 2) / 2
              },
              maxZoom: useTeutonLogo ? 
                (window.innerWidth >= 390 ? 14.6 : 12.2) : // Zoom out 15% for teaser (17.25 * 0.85, 14.35 * 0.85)
                (window.innerWidth >= 390 ? 17.25 : 14.35), // Original zoom levels
              offset: useTeutonLogo ? [0, -40] : [0, 40], // Shift viewport up for teaser
              center: shiftedCenter // Use shifted center
            })
          } else if (window.innerWidth < 768) {
            // Mobile fallback when boundaries not loaded - use predefined bounds
            const fallbackBounds = new mapboxgl.LngLatBounds(
              [-129.86, 55.66],  // Southwest corner (Teuton)
              [-129.44, 55.99]   // Northeast corner (Teuton)
            )
            
            // Get the bounds center for adjustment
            const boundsCenter = fallbackBounds.getCenter()
            
            // Shift 10% west only
            const westShift = 0.04
            const shiftedCenter: [number, number] = [
              boundsCenter.lng - westShift,
              boundsCenter.lat
            ]
            
            map.current!.fitBounds(fallbackBounds, {
              padding: { 
                top: useTeutonLogo ? 320 : 200, // Shift viewport up 20% for teaser
                bottom: useTeutonLogo ? 40 : 80, // Reduce bottom padding for teaser
                left: 20, 
                right: 20 
              },
              duration: 2800, // Restored original speed for orientation change
              pitch: 45, // Reduced to make properties appear larger
              bearing: -14.4,
              easing: (t: number) => {
                // Custom easing for smoother acceleration
                return t < 0.5
                  ? 2 * t * t
                  : 1 - Math.pow(-2 * t + 2, 2) / 2
              },
              maxZoom: useTeutonLogo ? 
                (window.innerWidth >= 390 ? 14.6 : 12.2) : // Zoom out 15% for teaser
                (window.innerWidth >= 390 ? 17.25 : 14.35), // Original zoom levels
              offset: useTeutonLogo ? [0, -40] : [0, 40], // Shift viewport up for teaser
              center: shiftedCenter
            })
          } else {
            // Desktop uses calculated center and zoom
            map.current!.flyTo({
              center: [adjustedCenterLng, adjustedCenterLat],
              zoom: 10.3,
              duration: 2000, // Restored original speed for desktop orientation
              pitch: 45, // Reduced to make properties appear larger
              bearing: -25,
              curve: 1.5
            })
          }

          // Add slow golden glow effect to Luxor properties when zoomed in
          setTimeout(() => {
            // Sharpen the outlines when fully zoomed
            map.current!.setPaintProperty('luxor-properties-outline', 'line-width', 3)
            map.current!.setPaintProperty('luxor-properties-inner-line', 'line-width', 1.5)
            map.current!.setPaintProperty('luxor-properties-fill', 'fill-opacity', 0.6)
            
            // Start the slow golden glow animation
            let glowPhase = 0
            const glowInterval = setInterval(() => {
              glowPhase = (glowPhase + 0.02) % (Math.PI * 2) // Slow progression
              
              // Calculate glow values with subtle breathing effect
              const glowOpacity = 0.1 + Math.sin(glowPhase) * 0.08 // Varies from 0.02 to 0.18
              const glowWidth = 20 + Math.sin(glowPhase) * 10 // Varies from 10 to 30
              
              if (map.current) {
                map.current.setPaintProperty('luxor-properties-glow', 'line-opacity', glowOpacity)
                map.current.setPaintProperty('luxor-properties-glow', 'line-width', glowWidth)
              }
            }, 50) // Update every 50ms for smooth animation
            
            // Show main content after zoom completes
            if (window.innerWidth < 768) {
              // Wait for zoom to complete on mobile (6 seconds) - show markers sooner
              setTimeout(() => {
                console.log('Setting showMainContent to true (mobile)')
                setShowMainContent(true)
                setIsTransitioning(false) // Reset after zoom completes
              }, 100) // Start timing immediately
              
              // Show labels and content early in animation
              setTimeout(() => {
                setShowPropertyLabels(true)
              }, 2000) // Show during orientation change (2800ms total - 800ms early)
            } else {
              setTimeout(() => {
                console.log('Setting showMainContent to true (desktop)')
                setShowMainContent(true)
                setIsTransitioning(false) // Reset after zoom completes
              }, 100) // Start timing immediately
              
              // Show labels and content early in animation
              setTimeout(() => {
                setShowPropertyLabels(true)
              }, 1400) // Show during orientation change (2000ms total - 600ms early)
            }
            
            // Fade in header early
            const headerTimeout = window.innerWidth < 768 ? 800 : 600
            setTimeout(() => {
              const header = document.querySelector('header')
              if (header) {
                header.style.opacity = '1'
              }
            }, headerTimeout)
            
            if (onZoomComplete) {
              setTimeout(() => {
                onZoomComplete()
                // Keep the glow animation running
              }, 1000)
            }
          }, 1000) // Start orientation change immediately after zoom
        }, 1200) // Start second animation right as first completes
    }
    
    // Start zoom animation after a delay - shorter for mobile
    const animationDelay = window.innerWidth < 768 ? 500 : 1000
    setTimeout(() => {
      startZoomAnimation()
      setMapReady(true)
    }, animationDelay)
    } // end addMapLayers
    } // end initializeMap

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      
      if (map.current) {
        map.current.remove()
        map.current = null
      }
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('deviceorientation', handleOrientation)
      // Clear orientation throttle timeout
      if (orientationThrottleRef.current) {
        clearTimeout(orientationThrottleRef.current)
      }
    }
  }, [onZoomComplete])

  // Force show mobile navigation immediately on mobile
  useEffect(() => {
    if (isMobile && !showMainContent) {
      // Show navigation immediately on mobile, don't wait for animations
      console.log('Forcing showMainContent to true for mobile nav');
      setShowMainContent(true);
    }
  }, [isMobile]); // Remove showMainContent from deps to prevent re-triggering
  
  // Fade in property markers and labels after initial zoom
  useEffect(() => {
    if (showPropertyLabels) {
      // Find all property labels and fade them in
      const labels = document.querySelectorAll('.property-label')
      labels.forEach((label) => {
        (label as HTMLElement).style.opacity = '1'
      })
      
      // Also fade in the main gold marker circles
      const mainMarkers = document.querySelectorAll('.property-marker-main')
      mainMarkers.forEach((marker) => {
        (marker as HTMLElement).style.opacity = '1'
      })
      
      // Also fade in the small white marker icons
      const markers = document.querySelectorAll('.property-marker-icon')
      markers.forEach((marker) => {
        (marker as HTMLElement).style.opacity = '1'
      })
    }
  }, [showPropertyLabels])

  // Apply gyroscopic effect to map
  useEffect(() => {
    console.log('Gyroscopic effect check:', {
      hasMap: !!map.current,
      isMobile,
      mapReady,
      prefersReducedMotion,
      isTransitioning,
      deviceOrientation
    });
    
    if (!map.current || !isMobile || !mapReady || prefersReducedMotion || isTransitioning) {
      console.log('Gyroscopic effect blocked');
      return
    }
    
    // Calculate new pitch and bearing based on device orientation
    const basePitch = 45 // Reduced from 65 to make properties appear larger
    const baseBearing = -14.4
    
    // Beta affects pitch (tilt forward/backward)
    const pitchAdjustment = deviceOrientation.beta * 0.02 // Even more subtle effect
    const newPitch = Math.max(0, Math.min(85, basePitch + pitchAdjustment))
    
    // Gamma affects bearing (tilt left/right)
    const bearingAdjustment = deviceOrientation.gamma * 0.03 // Even more subtle effect
    const newBearing = baseBearing + bearingAdjustment
    
    // Apply the new camera position with smoother transition
    map.current.easeTo({
      pitch: newPitch,
      bearing: newBearing,
      duration: 500, // Increased to 500ms for even smoother transition
      easing: (t) => {
        // Use smoother ease-in-out curve
        return t < 0.5 
          ? 2 * t * t 
          : -1 + (4 - 2 * t) * t
      }
    })
  }, [deviceOrientation, isMobile, mapReady, prefersReducedMotion, isTransitioning])

  // Hide/show major project markers when viewing properties on mobile
  useEffect(() => {
    if (!markersRef.current || markersRef.current.length === 0) return
    
    // Only hide markers on mobile when a property is selected
    const shouldHideMarkers = isMobile && (selectedProperty || showPropertyModal)
    
    markersRef.current.forEach(marker => {
      const markerElement = marker.getElement()
      if (markerElement) {
        // Find the label div (the one with project name)
        const labelDiv = markerElement.querySelector('div[style*="text-align: center"]')
        if (labelDiv) {
          (labelDiv as HTMLElement).style.display = shouldHideMarkers ? 'none' : 'block'
        }
      }
    })
    
    console.log(`Major project labels ${shouldHideMarkers ? 'hidden' : 'shown'} on mobile`)
  }, [selectedProperty, showPropertyModal, isMobile])

  // Function to add Tennyson highlighting - DISABLED
  // This function has been disabled as it was causing red outlines on wrong properties
  const addTennysonHighlighting = () => {
    // Disabled - was causing unwanted red outlines
    return
  }
  
  // Function to zoom to Tennyson property
  const zoomToTennyson = () => {
    console.log('zoomToTennyson called')
    console.log('map.current:', map.current)
    console.log('tennysonBounds:', tennysonBounds)
    console.log('isLoaded:', isLoaded)
    
    if (!map.current) {
      console.error('Map not initialized')
      return
    }
    
    if (!isLoaded) {
      console.error('Map not fully loaded yet')
      return
    }
    
    // Set Tennyson view state
    setShowTennysonView(true)
    
    if (!tennysonBounds) {
      console.error('Tennyson bounds not found')
      // Fallback to a general zoom to southern claims
      // Shift center to the left so property appears on right side of screen
      map.current.flyTo({
        center: [-129.653, 55.827], // Teuton center
        zoom: 12.5,
        pitch: 45,
        bearing: 0,
        duration: 3000,
        curve: 1.5
      })
      return
    }
    
    const centerLng = (tennysonBounds.west + tennysonBounds.east) / 2
    const centerLat = (tennysonBounds.south + tennysonBounds.north) / 2
    
    // Simple direct zoom to Tennyson
    console.log('Zooming to Tennyson at:', centerLng, centerLat)
    
    // First, reset the view to remove any wobble
    map.current.jumpTo({
      center: map.current.getCenter(),
      zoom: map.current.getZoom(),
      pitch: 0,
      bearing: 0
    })
    
    // Then fly to Tennyson with a slight offset to position it on the right
    const offsetLng = centerLng - 0.015 // Slight offset to left to position Tennyson on right
    
    // Temporarily disable terrain to prevent rumbling during transition
    const currentTerrain = map.current.getTerrain()
    if (currentTerrain) {
      map.current.setTerrain(null)
    }
    
    map.current.flyTo({
      center: [offsetLng, centerLat],
      zoom: 14,
      pitch: 45,
      bearing: 0,
      duration: 2500,
      curve: 1.2,
      essential: true
    })
    
    // Re-enable terrain after transition
    map.current.once('moveend', () => {
      if (currentTerrain && map.current!.getSource('mapbox-dem')) {
        map.current!.setTerrain({ 
          source: 'mapbox-dem', 
          exaggeration: isMobile ? 1.3 : 1.1
        })
      }
    })
    
    // Add highlighting after the zoom starts to ensure layers are ready
    setTimeout(() => {
      addTennysonHighlighting()
    }, 500)
    
  }
  
  const zoomToTennysonCleanup = () => {
    // Placeholder for cleanup if needed
  };

  // Function to toggle RAM-specific features on the map
  const toggleRamFeature = (featureType: keyof typeof ramFeatures, isEnabled: boolean) => {
    if (!map.current) return

    const ramCoords = [-129.7050, 55.8750] // RAM property coordinates

    switch (featureType) {
      case 'drillTargets':
        if (isEnabled) {
          // Load actual RAM drilling data from GeoJSON
          fetch('/geojson/ram-drilling.geojson')
            .then(response => response.json())
            .then(data => {
              if (!map.current) return
              
              // Filter data for pad markers
              const padOneFeatures = data.features.filter((f: any) => f.properties.pad === 1)
              const padTwoFeatures = data.features.filter((f: any) => f.properties.pad === 2)
              
              // Add drill hole source
              map.current.addSource('ram-drill-holes', {
                type: 'geojson',
                data: data
              })
              
              // Add source for pad one markers
              if (padOneFeatures.length > 0) {
                map.current.addSource('pad-one-markers', {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: padOneFeatures
                  }
                })
              }
              
              // Add source for pad two markers
              if (padTwoFeatures.length > 0) {
                map.current.addSource('pad-two-markers', {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: padTwoFeatures
                  }
                })
              }
              
              // Add drill hole layer
              map.current.addLayer({
                id: 'ram-drill-holes',
                type: 'circle',
                source: 'ram-drill-holes',
                paint: {
                  'circle-radius': 8,
                  'circle-color': '#ff4757',
                  'circle-stroke-width': 2,
                  'circle-stroke-color': '#ffffff',
                  'circle-opacity': 0.9
                }
              })
              
              // Add special markers for Pad One
              if (padOneFeatures.length > 0) {
                map.current.addLayer({
                  id: 'pad-one-markers',
                  type: 'circle',
                  source: 'pad-one-markers',
                  paint: {
                    'circle-radius': 12,
                    'circle-color': '#00FF88',
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#FFFFFF',
                    'circle-opacity': 1,
                    'circle-blur': 0.5
                  }
                })
                
                // Add pulsing effect for Pad One
                map.current.addLayer({
                  id: 'pad-one-pulse',
                  type: 'circle',
                  source: 'pad-one-markers',
                  paint: {
                    'circle-radius': 20,
                    'circle-color': '#00FF88',
                    'circle-opacity': 0,
                    'circle-opacity-transition': {
                      duration: 2000,
                      delay: 0
                    }
                  }
                })
              }
              
              // Add special markers for Pad Two  
              if (padTwoFeatures.length > 0) {
                map.current.addLayer({
                  id: 'pad-two-markers',
                  type: 'circle',
                  source: 'pad-two-markers',
                  paint: {
                    'circle-radius': 12,
                    'circle-color': '#FFD700',
                    'circle-stroke-width': 3,
                    'circle-stroke-color': '#FFFFFF',
                    'circle-opacity': 1,
                    'circle-blur': 0.5
                  }
                })
                
                // Add pulsing effect for Pad Two
                map.current.addLayer({
                  id: 'pad-two-pulse',
                  type: 'circle',
                  source: 'pad-two-markers',
                  paint: {
                    'circle-radius': 20,
                    'circle-color': '#FFD700',
                    'circle-opacity': 0,
                    'circle-opacity-transition': {
                      duration: 2000,
                      delay: 1000
                    }
                  }
                })
              }
              
              // Drill pad markers removed - not displaying correctly
              // // Clear existing pad markers to prevent duplicates
              // if (window.padMarkers) {
              //   window.padMarkers.forEach(item => {
              //     if (item.marker) item.marker.remove()
              //     if (item.element && item.element.parentNode) {
              //       item.element.parentNode.removeChild(item.element)
              //     }
              //   })
              //   window.padMarkers = []
              // }
              
              // // Create drill pad location markers with labels
              // console.log('Creating drill pad markers for', data.features.length, 'features')
              // data.features.forEach((feature: any) => {
              //   const coords = feature.geometry.coordinates
              //   const padNumber = feature.properties.pad
              //   console.log('Creating pad', padNumber, 'at coords', coords)
              //   
              //   // Create pad marker element (numbered circle like before)
              //   const padMarker = document.createElement('div')
              //   padMarker.className = 'drill-pad-marker'
              //   padMarker.style.cssText = `
              //     width: 24px;
              //     height: 24px;
              //     background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%);
              //     border: 2px solid #FFFF77;
              //     border-radius: 50%;
              //     display: flex;
              //     align-items: center;
              //     justify-content: center;
              //     font-family: 'Aeonik Medium', sans-serif;
              //     font-size: 12px;
              //     font-weight: 600;
              //     color: #FFFF77;
              //     box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 119, 0.4);
              //     backdrop-filter: blur(10px);
              //     cursor: pointer;
              //     transition: all 0.3s ease;
              //     position: relative;
              //     z-index: 1000;
              //   `
              //   padMarker.textContent = padNumber.toString()
              //   
              //   // Position label offset based on pad number to avoid overlaps
              //   let labelOffsetX = 0
              //   let labelOffsetY = 0
              //   
              //   if (padNumber === 1) {
              //     labelOffsetX = 60  // Right
              //     labelOffsetY = -20 // Up
              //   } else if (padNumber === 2) {
              //     labelOffsetX = -80 // Left
              //     labelOffsetY = -20 // Up
              //   } else if (padNumber === 3) {
              //     labelOffsetX = 60  // Right
              //     labelOffsetY = 20  // Down
              //   } else {
              //     labelOffsetX = 60  // Default right
              //     labelOffsetY = 0
              //   }
              //   
              //   // Create container for both marker and label
              //   const container = document.createElement('div')
              //   container.style.cssText = `
              //     position: relative;
              //     pointer-events: auto;
              //   `
              //   
              //   // Create connecting line
              //   const lineLength = Math.sqrt(labelOffsetX * labelOffsetX + labelOffsetY * labelOffsetY)
              //   const lineAngle = Math.atan2(labelOffsetY, labelOffsetX) * 180 / Math.PI
              //   
              //   const connectingLine = document.createElement('div')
              //   connectingLine.style.cssText = `
              //     position: absolute;
              //     width: ${lineLength}px;
              //     height: 1px;
              //     background: linear-gradient(90deg, rgba(255, 255, 119, 0.5) 0%, rgba(255, 255, 119, 0.2) 100%);
              //     transform-origin: left center;
              //     transform: rotate(${lineAngle}deg);
              //     top: 50%;
              //     left: 50%;
              //     z-index: 1;
              //     pointer-events: none;
              //   `
              //   
              //   // Create pad label element
              //   const padLabel = document.createElement('div')
              //   padLabel.className = 'drill-pad-label'
              //   padLabel.style.cssText = `
              //     position: absolute;
              //     left: ${labelOffsetX + (labelOffsetX > 0 ? 12 : -12)}px;
              //     top: ${labelOffsetY}px;
              //     transform: translate(${labelOffsetX > 0 ? '0' : '-100%'}, -50%);
              //     background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%);
              //     backdrop-filter: blur(20px) saturate(180%);
              //     border: 1px solid rgba(255, 255, 119, 0.3);
              //     border-radius: 12px;
              //     padding: 8px 14px;
              //     font-family: 'Aeonik Extended', sans-serif;
              //     font-size: 12px;
              //     font-weight: 600;
              //     color: #FFFF77;
              //     white-space: nowrap;
              //     box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 119, 0.2);
              //     letter-spacing: 0.04em;
              //     text-transform: uppercase;
              //     pointer-events: none;
              //     transition: all 0.3s ease;
              //     z-index: 2;
              //   `
              //   padLabel.textContent = `Pad ${padNumber}`
              //   
              //   // Assemble container
              //   container.appendChild(padMarker)
              //   container.appendChild(connectingLine)
              //   container.appendChild(padLabel)
              //   
              //   // Add hover effects
              //   padMarker.addEventListener('mouseenter', () => {
              //     padMarker.style.transform = 'scale(1.15)'
              //     padMarker.style.boxShadow = '0 6px 20px rgba(255, 255, 119, 0.5), inset 0 1px 2px rgba(255, 255, 119, 0.5)'
              //     padLabel.style.background = 'linear-gradient(135deg, rgba(255, 255, 119, 0.2) 0%, rgba(17, 17, 17, 0.9) 100%)'
              //     padLabel.style.borderColor = 'rgba(255, 255, 119, 0.7)'
              //     connectingLine.style.background = 'linear-gradient(90deg, rgba(255, 255, 119, 0.8) 0%, rgba(255, 255, 119, 0.4) 100%)'
              //   })
              //   
              //   padMarker.addEventListener('mouseleave', () => {
              //     padMarker.style.transform = 'scale(1)'
              //     padMarker.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 119, 0.4)'
              //     padLabel.style.background = 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%)'
              //     padLabel.style.borderColor = 'rgba(255, 255, 119, 0.3)'
              //     connectingLine.style.background = 'linear-gradient(90deg, rgba(255, 255, 119, 0.5) 0%, rgba(255, 255, 119, 0.2) 100%)'
              //   })
              //   
              //   // Add to map
              //   const markerObj = new mapboxgl.Marker(container, { anchor: 'center' })
              //     .setLngLat(coords)
              //     .addTo(map.current!)
              //   
              //   // Store marker for cleanup
              //   if (!window.padMarkers) window.padMarkers = []
              //   window.padMarkers.push({ marker: markerObj, element: container })
              // })
              
              // Animate the pulsing markers
              if (padOneFeatures.length > 0 || padTwoFeatures.length > 0) {
                let pulseOpacity = 0
                let increasing = true
                
                const animatePulse = () => {
                  if (!map.current) return
                  
                  if (increasing) {
                    pulseOpacity += 0.02
                    if (pulseOpacity >= 0.4) increasing = false
                  } else {
                    pulseOpacity -= 0.02
                    if (pulseOpacity <= 0) increasing = true
                  }
                  
                  if (map.current.getLayer('pad-one-pulse')) {
                    map.current.setPaintProperty('pad-one-pulse', 'circle-opacity', pulseOpacity)
                    map.current.setPaintProperty('pad-one-pulse', 'circle-radius', 15 + pulseOpacity * 25)
                  }
                  
                  if (map.current.getLayer('pad-two-pulse')) {
                    map.current.setPaintProperty('pad-two-pulse', 'circle-opacity', pulseOpacity * 0.8)
                    map.current.setPaintProperty('pad-two-pulse', 'circle-radius', 15 + pulseOpacity * 20)
                  }
                  
                  requestAnimationFrame(animatePulse)
                }
                
                animatePulse()
              }
            })
            .catch(err => console.error('Error loading drill holes:', err))
          
          // Load zone labels with fancy glassmorphic styling
          // COMMENTED OUT - This creates duplicate labels, using ram-zones-actual.geojson instead
          /*
          fetch('/geojson/zone-labels-overview.geojson')
            .then(response => response.json())
            .then(data => {
              if (!map.current) return
              
              // Create fancy HTML markers for zone labels
              data.features.forEach((feature: any) => {
                const el = document.createElement('div')
                el.className = 'zone-label-marker'
                el.innerHTML = `
                  <div class="zone-label" style="
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                    min-width: 140px;
                    z-index: 85000;
                    pointer-events: none;
                    white-space: nowrap;
                    opacity: 1;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                  ">
                    <div style="
                      position: relative;
                      background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%);
                      backdrop-filter: blur(20px) saturate(180%);
                      -webkit-backdrop-filter: blur(20px) saturate(180%);
                      border: 1px solid rgba(255, 255, 119, 0.4);
                      box-shadow: 
                        0 8px 24px rgba(0, 0, 0, 0.6),
                        inset 0 1px 2px rgba(255, 255, 119, 0.2),
                        0 0 12px rgba(255, 255, 119, 0.1);
                      border-radius: 12px;
                      padding: 10px 18px;
                      overflow: hidden;
                      transition: all 0.3s ease;
                      cursor: pointer;
                    ">
                      <div style="
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 200%;
                        height: 100%;
                        background: linear-gradient(
                          90deg,
                          transparent 0%,
                          rgba(255, 215, 0, 0.08) 50%,
                          transparent 100%
                        );
                        animation: shimmer 6s infinite;
                      "></div>
                      <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        height: 1px;
                        background: linear-gradient(
                          90deg,
                          transparent 0%,
                          rgba(255, 215, 0, 0.4) 50%,
                          transparent 100%
                        );
                      "></div>
                      <span style="
                        color: #FFFF77;
                        font-family: 'Aeonik Extended', sans-serif;
                        font-size: 14px;
                        font-weight: 600;
                        letter-spacing: 0.05em;
                        text-transform: uppercase;
                        text-shadow: 
                          0 1px 3px rgba(0, 0, 0, 0.8),
                          0 0 8px rgba(255, 255, 119, 0.3);
                        display: block;
                        position: relative;
                        z-index: 1;
                        line-height: 1.2;
                      ">${feature.properties.name}</span>
                    </div>
                  </div>
                `
                
                // Position the marker at the zone location
                const marker = new mapboxgl.Marker(el, { anchor: 'center' })
                  .setLngLat([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
                  .addTo(map.current!)
                
                // Store marker reference for cleanup
                if (!window.zoneMarkers) window.zoneMarkers = []
                window.zoneMarkers.push(marker)
              })
            })
            .catch(err => console.error('Error loading zone labels:', err))
          */
          
          // Load RAM zones and create hover-enabled markers
          fetch('/geojson/ram-zones-actual.geojson')
            .then(response => response.json())
            .then(data => {
              if (!map.current) return
              
              // Zone descriptions for hover tooltips
              const zoneInfo = {
                "Malachite Porphyry Zone": "450m x 150m porphyritic outcrop with widespread malachite staining and magnetite veinlets. Surface sampling in 2024 has identified gold-copper mineralization at many points within the zone.",
                "Mitch Zone (VMS)": "Located 500m southwest of the Malachite zone, contains en-echelon massive sulfide stringers up to 7cm wide, exhibiting classic VMS characteristics with robust precious metal grades."
              }
              
              // Define description positioning to avoid pad overlaps
              const descriptionPositions = {
                "Malachite Porphyry Zone": { offset: [0.003, -0.004] }, // Move east and south
                "Mitch Zone (VMS)": { offset: [0.004, -0.0045] } // Move further east and south
              }
              
              // Clear existing zone markers to prevent duplicates
              if (window.ramZoneMarkers) {
                window.ramZoneMarkers.forEach(marker => marker.remove())
                window.ramZoneMarkers = []
              }
              
              // Create zone name labels (clean, no descriptions)
              data.features.forEach((feature: any) => {
                if (feature.properties.Name && feature.properties.Name !== null) {
                  const coords = feature.geometry.coordinates
                  const zoneName = feature.properties.Name
                  
                  // Create clean zone name label
                  const zoneMarker = document.createElement('div')
                  zoneMarker.className = 'ram-zone-marker'
                  zoneMarker.style.cssText = `
                    background: linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%);
                    backdrop-filter: blur(20px) saturate(180%);
                    border: 1px solid rgba(255, 255, 119, 0.4);
                    border-radius: 12px;
                    padding: 10px 18px;
                    font-family: 'Aeonik Extended', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    color: #FFFF77;
                    white-space: nowrap;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 119, 0.2);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
                  `
                  zoneMarker.textContent = zoneName
                  
                  // Add zone label to map
                  const zoneMarkerObj = new mapboxgl.Marker(zoneMarker, { anchor: 'center' })
                    .setLngLat(coords)
                    .addTo(map.current!)
                  
                  // Store marker for cleanup
                  if (!window.ramZoneMarkers) window.ramZoneMarkers = []
                  window.ramZoneMarkers.push(zoneMarkerObj)
                  
                  // No longer creating description markers with lines - will use info cards instead
                }
              })
              
              // Convert point features to polygon zones for background areas
              const zonePolygons: any = {
                type: 'FeatureCollection',
                features: []
              }
              
              // Create polygons around each zone center point
              data.features.forEach((feature: any) => {
                if (feature.properties.Name) {
                  const center = feature.geometry.coordinates
                  const radius = 0.0015 // Approximately 150m radius
                  const sides = 8 // Octagon shape
                  const coordinates = []
                  
                  for (let i = 0; i < sides; i++) {
                    const angle = (i / sides) * 2 * Math.PI
                    coordinates.push([
                      center[0] + radius * Math.cos(angle),
                      center[1] + radius * Math.sin(angle) * 0.7 // Elliptical shape
                    ])
                  }
                  coordinates.push(coordinates[0]) // Close the polygon
                  
                  zonePolygons.features.push({
                    type: 'Feature',
                    properties: feature.properties,
                    geometry: {
                      type: 'Polygon',
                      coordinates: [coordinates]
                    }
                  })
                }
              })
              
              map.current.addSource('ram-zones', {
                type: 'geojson',
                data: zonePolygons
              })
              
              // Add fill pattern (diagonal lines)
              map.current.addLayer({
                id: 'ram-zones-pattern',
                type: 'fill',
                source: 'ram-zones',
                paint: {
                  'fill-color': '#c0d8ff',
                  'fill-opacity': 0.15
                }
              })
              
              // Add diagonal lines effect using line layer
              map.current.addLayer({
                id: 'ram-zones-lines',
                type: 'line',
                source: 'ram-zones',
                paint: {
                  'line-color': '#a0c4ff',
                  'line-width': 2,
                  'line-opacity': 0.6,
                  'line-dasharray': [4, 4]
                }
              })
              
              // Add zone outline
              map.current.addLayer({
                id: 'ram-zones',
                type: 'line',
                source: 'ram-zones',
                paint: {
                  'line-color': '#a0c4ff',
                  'line-width': 3,
                  'line-opacity': 0.7
                }
              })
            })
            .catch(err => console.error('Error loading RAM zones:', err))
        } else {
          // Remove all drill target layers and sources
          const layersToRemove = [
            'ram-drill-holes', 
            'pad-one-markers',
            'pad-one-pulse',
            'pad-two-markers', 
            'pad-two-pulse',
            'ram-zones', 
            'ram-zones-pattern', 
            'ram-zones-lines'
          ]
          const sourcesToRemove = [
            'ram-drill-holes', 
            'pad-one-markers',
            'pad-two-markers',
            'ram-zones'
          ]
          
          // Remove HTML zone label markers (commented out since we're not using zone-labels-overview.geojson)
          /*
          if (window.zoneMarkers) {
            window.zoneMarkers.forEach(marker => marker.remove())
            window.zoneMarkers = []
          }
          */
          
          // Remove drill pad markers
          if (window.padMarkers) {
            window.padMarkers.forEach(item => {
              if (item.marker) item.marker.remove()
              if (item.element && item.element.parentNode) {
                item.element.parentNode.removeChild(item.element)
              }
            })
            window.padMarkers = []
          }
          
          // Remove RAM zone markers
          if (window.ramZoneMarkers) {
            window.ramZoneMarkers.forEach(marker => marker.remove())
            window.ramZoneMarkers = []
          }
          
          layersToRemove.forEach(layerId => {
            if (map.current && map.current.getLayer(layerId)) {
              map.current.removeLayer(layerId)
            }
          })
          
          sourcesToRemove.forEach(sourceId => {
            if (map.current && map.current.getSource(sourceId)) {
              map.current.removeSource(sourceId)
            }
          })
        }
        break

      case 'geologicalStructures':
        if (isEnabled) {
          // Add geological fault lines
          map.current.addSource('ram-fault-lines', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [-129.7100, 55.8700],
                    [-129.7000, 55.8800]
                  ]
                },
                properties: { type: 'fault' }
              }]
            }
          })

          map.current.addLayer({
            id: 'ram-fault-lines',
            type: 'line',
            source: 'ram-fault-lines',
            paint: {
              'line-color': '#ff6b6b',
              'line-width': 3,
              'line-dasharray': [2, 2],
              'line-opacity': 0.8
            }
          })
        } else {
          // Remove geological layers
          if (map.current.getLayer('ram-fault-lines')) {
            map.current.removeLayer('ram-fault-lines')
          }
          if (map.current.getSource('ram-fault-lines')) {
            map.current.removeSource('ram-fault-lines')
          }
        }
        break

      case 'terrainAnalysis':
        if (isEnabled) {
          // Enhance terrain exaggeration for better visualization
          if (map.current.getTerrain()) {
            map.current.setTerrain({ 
              source: 'mapbox-dem', 
              exaggeration: 2.5 // Increased for analysis mode
            })
          }
        } else {
          // Reset terrain to normal
          if (map.current.getTerrain()) {
            map.current.setTerrain({ 
              source: 'mapbox-dem', 
              exaggeration: isMobile ? 1.3 : 1.1
            })
          }
        }
        break

      case 'historicalData':
        if (isEnabled) {
          // Add historical data points
          const historicalPoints = [
            { coords: [-129.7055, 55.8745], data: 'Sample 1: 2.1g/t Au' },
            { coords: [-129.7045, 55.8755], data: 'Sample 2: 1.8g/t Au' }
          ]
          
          historicalPoints.forEach((point, index) => {
            const el = document.createElement('div')
            el.innerHTML = `
              <div style="
                width: 12px;
                height: 12px;
                background: #4ecdc4;
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 12px rgba(78, 205, 196, 0.6);
              " title="${point.data}"></div>
            `
            
            const marker = new mapboxgl.Marker(el)
              .setLngLat(point.coords as [number, number])
              .addTo(map.current!)
            
            markersRef.current.push(marker)
            el.setAttribute('data-ram-feature', 'historicalData')
          })
        } else {
          // Remove historical data markers
          markersRef.current = markersRef.current.filter(marker => {
            const el = marker.getElement()
            if (el.getAttribute('data-ram-feature') === 'historicalData') {
              marker.remove()
              return false
            }
            return true
          })
        }
        break

      case 'accessRoutes':
        if (isEnabled) {
          // Add access route
          map.current.addSource('ram-access-route', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [-129.7100, 55.8650],
                    [-129.7075, 55.8700],
                    [-129.7050, 55.8750]
                  ]
                },
                properties: { type: 'access-route' }
              }]
            }
          })

          map.current.addLayer({
            id: 'ram-access-route',
            type: 'line',
            source: 'ram-access-route',
            paint: {
              'line-color': '#ffd700',
              'line-width': 4,
              'line-opacity': 0.7
            }
          })
        } else {
          // Remove access route
          if (map.current.getLayer('ram-access-route')) {
            map.current.removeLayer('ram-access-route')
          }
          if (map.current.getSource('ram-access-route')) {
            map.current.removeSource('ram-access-route')
          }
        }
        break
    }
  }

  return (
    <>
      {/* Map container wrapper */}
      <div className="absolute inset-0 w-full h-full" style={{
        zIndex: 1,
        backgroundColor: '#0d0f1e',
        overflow: 'hidden'
      }}>
        {/* Loading skeleton */}
        {isMapLoading && <MapSkeleton />}
        
        {/* Map container */}
        <div ref={mapContainer} className="absolute inset-0 w-full h-full"
             style={{
               backgroundColor: '#0d0f1e',
               zIndex: 1,
               opacity: mapInitialized && !isMapLoading ? 1 : 0,
               transition: 'opacity 0.6s ease-in-out'
             }}
        />
        
        
      </div>

      
      <style jsx global>{`
        /* Fix mapbox attribution positioning */
        .mapboxgl-ctrl-bottom-right {
          bottom: 0 !important;
          right: 0 !important;
          position: absolute !important;
        }
        .mapboxgl-ctrl-attrib {
          margin: 0 10px 10px 0 !important;
        }
        .mapboxgl-ctrl-attrib.mapboxgl-compact {
          margin: 0 10px 10px 0 !important;
        }
        /* Ensure drill pad markers are visible */
        .drill-pad-marker {
          z-index: 999 !important;
        }
        .drill-pad-label {
          z-index: 1000 !important;
        }
        
        @font-face {
          font-family: 'Aeonik Extended';
          src: url('/images/AeonikExtended-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Extended Medium';
          src: url('/images/AeonikExtended-Medium.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Decimal';
          src: url('/images/Decimal-SemiboldDecimal-Semibold-Regular-normal.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Decimal Semibold';
          src: url('/images/Decimal-Semibold.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Decimal Medium';
          src: url('/images/Decimal-Medium_Web.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Big Caslon';
          src: url('/images/BigCaslon-Regular.D0vlef8u.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Söhne Mono';
          src: url('/images/SohneMono-Buch.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Founders Grotesk';
          src: url('/images/Founders Grotesk.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'GT America';
          src: url('/images/GT America.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Switzer';
          src: url('/images/Switzer-Medium.woff') format('woff');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Switzer';
          src: url('/images/Switzer-Regular.woff') format('woff');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Switzer Variable';
          src: url('/images/Switzer%20Variable.woff2') format('woff2');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
        
        /* Ensure Mapbox markers are above overlays */
        .mapboxgl-marker {
          z-index: 70000 !important;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(119, 255, 119, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(119, 255, 119, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(119, 255, 119, 0);
          }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.25;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        /* Ensure Mapbox markers and labels are above all overlays */
        .mapboxgl-marker {
          z-index: 100000 !important;
        }
        
        .mapboxgl-popup {
          z-index: 100001 !important;
        }
        
        /* Ensure the map canvas container allows markers to show above */
        .mapboxgl-canvas-container {
          z-index: 10 !important;
        }
        
        .mapboxgl-canvas {
          z-index: 10 !important;
        }

        @keyframes liquidShine {
          0% {
            background-position: 0 0, -100% 0;
          }
          100% {
            background-position: 0 0, 100% 0;
          }
        }

        .mapboxgl-canvas {
          cursor: default !important;
          pointer-events: auto !important;
        }
        
        .mapboxgl-map {
          pointer-events: auto !important;
        }
        
        .mapboxgl-canvas-container {
          pointer-events: auto !important;
        }
        

        /* Glow effect for Luxor properties */
        @keyframes property-glow {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(255, 215, 0, 1));
          }
        }
      `}</style>
      
      <style jsx global>{`
        @font-face {
          font-family: 'Helvetica Now Display';
          src: url('/images/Helvetica Now Display.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Helvetica Now Display';
          src: url('/images/HelveticaNowDisplay-Bold.woff2') format('woff2');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Helvetica Now Display';
          src: url('/images/HelveticaNowDisplay-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'PP Telegraf';
          src: url('/images/Pptelegraf.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Switzer';
          src: url('/images/Switzer.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Switzer Variable';
          src: url('/images/Switzer%20Variable.woff2') format('woff2');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik Extended';
          src: url('/images/AeonikExtended-SemiBold.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik';
          src: url('/images/Aeonik-SemiBold.woff2') format('woff2');
          font-weight: 600;
          font-style: normal;
          font-display: swap;
        }
        
        @font-face {
          font-family: 'Aeonik';
          src: url('/images/Aeonik-Medium.woff2') format('woff2');
          font-weight: 500;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 3, display: 'none' }}>
        
        {/* Cinematic overlays */}
        {/* Top and bottom gradients removed - were contributing to border effect */}
        
        {/* Vignette effect removed - was causing border glow */}
        
        {/* Enhanced color grading overlay - moved outside this container */}
        
        {/* Additional overlay removed - was contributing to edge effect */}
        
        {/* Additional overlay for depth */}
        {/* Removed to prevent covering map features */}
        
        {/* Snow exposure reduction overlay */}
        {/* Removed to prevent covering map features */}
        
        {/* Rocky terrain overlay removed - was creating edge effects */}
        
        {/* Atmospheric haze effect */}
        {/* Removed to prevent covering map features */}
        
        {/* Lens flare removed to prevent white overlay */}
        
        {/* Dynamic light rays - removed to prevent white overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ display: 'none' }}>
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: `conic-gradient(from 45deg at 70% 30%, 
                transparent 0deg, 
                rgba(255, 220, 100, 0.1) 10deg, 
                transparent 20deg, 
                transparent 40deg,
                rgba(255, 220, 100, 0.08) 45deg,
                transparent 50deg,
                transparent 360deg)`,
              transform: 'scale(2)',
              transformOrigin: '70% 30%'
            }}
          />
        </div>
        
        
        {/* Floating particles - reduced for mobile performance */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(isMobile ? 8 : 20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 10,
                }}
                animate={{
                  y: -10,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: (isMobile ? 15 : 10) + Math.random() * 20,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 10,
                }}
                style={{
                  filter: 'blur(1px)',
                  boxShadow: isMobile ? 'none' : '0 0 6px rgba(0, 212, 255, 0.6)',
                  willChange: 'transform',
                }}
              />
            ))}
          </div>
        )}
        
        {/* Grid overlay for tech effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
             style={{
               backgroundImage: `
                 linear-gradient(0deg, rgba(0,212,255,0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
               `,
               backgroundSize: '50px 50px'
             }}
        />
        
        {/* Animated edge glow */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0"
            animate={{
              boxShadow: [
                'inset 0 0 100px rgba(0, 212, 255, 0.2)',
                'inset 0 0 150px rgba(0, 212, 255, 0.4)',
                'inset 0 0 100px rgba(0, 212, 255, 0.2)'
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        {/* Chromatic aberration effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
               style={{
                 background: 'linear-gradient(to right, rgba(255, 0, 0, 0.03), transparent 10%, transparent 90%, rgba(0, 255, 255, 0.03))',
                 mixBlendMode: 'screen'
               }}
          />
        </div>
        
        {/* Noise texture overlay for film grain effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
               mixBlendMode: 'overlay'
             }}
        />
        
        {/* Film burn effect removed - was causing pulsing edge overlay */}
        
        {/* Error display */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1C1C1C]/90">
            <div className="text-center p-8 max-w-lg">
              <h3 className="text-2xl text-red-500 mb-4">Map Configuration Required</h3>
              <p className="text-white mb-4">{error}</p>
              <div className="bg-gray-900 rounded-lg p-4 text-left">
                <p className="text-gray-400 mb-2">To get started:</p>
                <ol className="text-sm text-gray-300 space-y-2">
                  <li>1. Sign up at <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">mapbox.com</a></li>
                  <li>2. Copy your default public token</li>
                  <li>3. Create a .env.local file in your project root</li>
                  <li>4. Add: NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here</li>
                  <li>5. Restart your development server</li>
                </ol>
              </div>
              <p className="text-gray-400 mt-4 text-sm">Using the Three.js visualization as fallback</p>
            </div>
          </div>
        )}


        {/* Main headline and subheading - moved outside overlay container for visibility */}

        {/* FIJI Property headline and subheading - only show when IN FIJI/Tennyson view */}
        <motion.div 
          className="absolute top-40 left-[5%] text-left max-w-2xl pointer-events-auto"
          style={{ zIndex: 10000, display: showTennysonView ? 'block' : 'none' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: showTennysonView && mapReady ? 1 : 0,
            x: showTennysonView && mapReady ? 0 : -20
          }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: showTennysonView ? 1.5 : 0 // Delay appearance when transitioning to Tennyson
          }}
        >
          <div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl relative mb-6"
                style={{
                  fontFamily: "'Helvetica Now Display', 'Helvetica Neue', Helvetica, system-ui, sans-serif",
                  fontWeight: 700,
                  letterSpacing: 'normal',
                  textTransform: 'uppercase',
                  lineHeight: 0.95,
                  margin: 0,
                  padding: 0,
                }}>
              <span style={{
                display: 'block',
                color: 'white',
              }}>
                FIJI
              </span>
              <span style={{
                display: 'block',
                marginTop: '-0.15em',
                color: 'white',
              }}>
                PROPERTY
              </span>
            </h1>
            <motion.div className="border-l-2 border-[#FFFF77] pl-6">
            <p className="text-2xl md:text-3xl leading-relaxed relative"
               style={{
                 fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
                 fontWeight: 400,
                 letterSpacing: '0.01em',
                 color: 'rgba(250, 245, 228, 0.85)',
                 textShadow: `
                   /* Core glass structure */
                   0 1px 3px rgba(0,0,0,0.5),
                   0 2px 6px rgba(0,0,0,0.4),
                   0 4px 12px rgba(0,0,0,0.3),
                   
                   /* 3D depth */
                   0 1px 0 rgba(255,255,255,0.7),
                   0 2px 0 rgba(245,245,255,0.5),
                   0 3px 0 rgba(235,235,245,0.3),
                   0 4px 1px rgba(225,225,235,0.2),
                   
                   /* Deep shadow */
                   0 6px 15px rgba(0,0,0,0.3),
                   0 10px 25px rgba(0,0,0,0.2),
                   
                   /* Inner reflections */
                   inset 0 1px 2px rgba(255,255,255,0.6),
                   inset 0 -1px 2px rgba(0,0,0,0.2),
                   
                   /* Subtle glow */
                   0 0 30px rgba(200,220,255,0.3),
                   0 0 50px rgba(200,220,255,0.2)
                 `,
                 WebkitTextStroke: '0.5px rgba(255,255,255,0.3)',
               }}>
              <span style={{
                position: 'relative',
                display: 'inline-block',
              }}>
                <span style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg,
                    rgba(255,255,255,0.6) 0%,
                    rgba(245,250,255,0.4) 30%,
                    rgba(230,240,255,0.3) 60%,
                    rgba(210,230,255,0.4) 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  mixBlendMode: 'overlay',
                }}>
                  Strategic southern claims with high-grade gold potential<br />
                  90m @ 14.4 g/t Au historic intercept
                </span>
                Strategic southern claims with high-grade gold potential<br />
                90m @ 14.4 g/t Au historic intercept
              </span>
            </p>
            <div className="mt-6 flex items-center gap-8">
              <div className="text-base" style={{ 
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
                color: 'rgba(250, 245, 228, 0.7)'
              }}>
                <span className="text-3xl font-bold" style={{
                  color: '#FFFF77',
                  textShadow: '0 0 20px rgba(255, 255, 119, 0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif"
                }}>7</span> Claims
              </div>
              <div className="text-base" style={{ 
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
                color: 'rgba(250, 245, 228, 0.7)'
              }}>
                <span className="text-3xl font-bold" style={{
                  color: '#FFFF77',
                  textShadow: '0 0 20px rgba(255, 255, 119, 0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif"
                }}>3,672</span> Hectares
              </div>
              <div className="text-base" style={{ 
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
                color: 'rgba(250, 245, 228, 0.7)'
              }}>
                <span className="text-3xl font-bold" style={{
                  color: '#FFFF77',
                  textShadow: '0 0 20px rgba(255, 255, 119, 0.5), 0 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif"
                }}>High-Grade</span> Gold
              </div>
            </div>
            
            {/* Glassmorphic Back to Overview Button */}
            <motion.button
              className="mt-8 px-8 py-4 rounded-full relative overflow-hidden group pointer-events-auto cursor-pointer"
              onClick={() => {
                // Go back to overview
                setShowTennysonView(false)
                
                // Remove Tennyson highlight layers
                if (map.current) {
                  // Remove Tennyson-specific layers
                  if (map.current.getLayer('tennyson-properties-fill')) {
                    map.current.removeLayer('tennyson-properties-fill')
                  }
                  if (map.current.getLayer('tennyson-properties-glow')) {
                    map.current.removeLayer('tennyson-properties-glow')
                  }
                  if (map.current.getLayer('tennyson-properties-outline')) {
                    map.current.removeLayer('tennyson-properties-outline')
                  }
                  if (map.current.getLayer('tennyson-properties-inner-line')) {
                    map.current.removeLayer('tennyson-properties-inner-line')
                  }
                  
                  // Fly back to overview position
                  const luxorLat = 55.827
                  const luxorLng = -129.653
                  const majorDepositsAvgLat = 55.827
                  const majorDepositsAvgLng = -129.653
                  const centerLat = luxorLat * 0.6 + majorDepositsAvgLat * 0.4
                  const centerLng = luxorLng * 0.6 + majorDepositsAvgLng * 0.4
                  const adjustedCenterLng = centerLng - 0.186 + 0.04 - 0.013 - 0.026 + 0.025 // Added 3% east (same as initial)
                  const adjustedCenterLat = centerLat - 0.04 - 0.025 - 0.0056 - 0.0112 + 0.0056 + 0.0112 - 0.025 // Added 3% south (same as initial)
                  
                  if (isMobile) {
                    // Use fitBounds for mobile to ensure all claims are visible
                    fitMobileOverviewBounds()
                  } else {
                    // Desktop uses calculated center and zoom
                    // Reduced zoom to show more of the red line which extends further south
                    map.current.flyTo({
                      center: [adjustedCenterLng, adjustedCenterLat - 0.3], // Shift center south to show more red line
                      zoom: 9.5, // Reduced from 10.3 to show more area
                      pitch: 45, // Reduced to make properties appear larger
                      bearing: -25,
                      duration: 3000,
                      curve: 1.5
                    })
                  }
                }
              }}
              style={{
                background: 'rgba(250, 245, 228, 0.15)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(250, 245, 228, 0.25)',
                borderRadius: '9999px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 2px 4px 0 rgba(250, 245, 228, 0.1)',
                fontFamily: "'Proxima Nova', system-ui, sans-serif",
              }}
              whileHover={{ 
                scale: 1.05,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span className="relative z-10 text-white text-lg font-semibold tracking-wide flex items-center gap-3">
                Back to Overview
                <svg 
                  className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </span>
              
              {/* Gradient overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 117, 0.1) 0%, rgba(255, 255, 117, 0.05) 100%)',
                }}
              />
              
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(250, 245, 228, 0.2) 45%, rgba(250, 245, 228, 0.3) 50%, rgba(250, 245, 228, 0.2) 55%, transparent 100%)',
                  transform: 'translateX(-100%)',
                }}
                animate={{
                  transform: ['translateX(-100%)', 'translateX(100%)'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              />
            </motion.button>
            </motion.div>
          </div>
        </motion.div>


      </div>

      {/* Compass - replaced legend */}
      {mapReady && (
        <motion.div
          className={`absolute ${isMobile ? 'bottom-24 right-4' : 'bottom-8 right-8'}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
            zIndex: 50,
          }}
        >
          {/* Compass outer ring */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(250, 245, 228, 0.1)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '2px solid rgba(250, 245, 228, 0.3)',
              borderRadius: '50%',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 2px 4px 0 rgba(250, 245, 228, 0.1)',
            }}
          />
          
          {/* Compass directions */}
          <div
            style={{
              position: 'absolute',
              inset: '10px',
              borderRadius: '50%',
              background: 'rgba(28, 28, 28, 0.6)',
              border: '1px solid rgba(250, 245, 228, 0.2)',
              transform: `rotate(${-mapBearing}deg)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* N */}
            <div
              style={{
                position: 'absolute',
                top: '8%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#FFFF77',
                fontSize: isMobile ? '14px' : '18px',
                fontWeight: 700,
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
                textShadow: '0 0 10px rgba(255, 255, 119, 0.5)',
              }}
            >
              N
            </div>
            
            {/* S */}
            <div
              style={{
                position: 'absolute',
                bottom: '8%',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(250, 245, 228, 0.6)',
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 500,
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
              }}
            >
              S
            </div>
            
            {/* E */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '8%',
                transform: 'translateY(-50%)',
                color: 'rgba(250, 245, 228, 0.6)',
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 500,
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
              }}
            >
              E
            </div>
            
            {/* W */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '8%',
                transform: 'translateY(-50%)',
                color: 'rgba(250, 245, 228, 0.6)',
                fontSize: isMobile ? '11px' : '14px',
                fontWeight: 500,
                fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif",
              }}
            >
              W
            </div>
            
            {/* Center dot */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: isMobile ? '6px' : '8px',
                height: isMobile ? '6px' : '8px',
                borderRadius: '50%',
                background: '#FFFF77',
                boxShadow: '0 0 12px rgba(255, 255, 119, 0.8)',
              }}
            />
            
            {/* Compass needle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '2px',
                height: '40%',
                transformOrigin: 'center bottom',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: isMobile ? '3px solid transparent' : '4px solid transparent',
                  borderRight: isMobile ? '3px solid transparent' : '4px solid transparent',
                  borderBottom: isMobile ? '14px solid #FFFF77' : '20px solid #FFFF77',
                  filter: 'drop-shadow(0 0 4px rgba(255, 255, 119, 0.6))',
                }}
              />
            </div>
          </div>
          
          {/* Compass ticks/degree marks */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <div
              key={deg}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '100%',
                height: '1px',
                transform: `translate(-50%, -50%) rotate(${deg - mapBearing}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.3s ease-out',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: '5px',
                  width: deg % 90 === 0 ? '8px' : '4px',
                  height: '1px',
                  background: 'rgba(250, 245, 228, 0.4)',
                }}
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Legend content hidden - original code commented out */}
      {false && (
        <div style={{ display: 'none' }}>
          <h3 className="text-white font-bold mb-4 text-lg text-center" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 600 }}>
            World-Class Neighbours
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3" 
                 style={{ 
                   background: 'rgba(250, 245, 228, 0.08)',
                   backdropFilter: 'blur(10px)',
                   WebkitBackdropFilter: 'blur(10px)',
                   border: '1px solid rgba(250, 245, 228, 0.1)',
                   borderRadius: '12px'
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" 
                     style={{ 
                       backgroundColor: '#FFFF77',
                       boxShadow: '0 0 8px #FFFF77'
                     }} />
                <span className="text-white/90 text-base font-medium" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 500 }}>
                  KSM (Mitchell)
                </span>
              </div>
              <span className="text-white/60 text-sm" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 400 }}>
                ~30 km north
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3" 
                 style={{ 
                   background: 'rgba(250, 245, 228, 0.08)',
                   backdropFilter: 'blur(10px)',
                   WebkitBackdropFilter: 'blur(10px)',
                   border: '1px solid rgba(250, 245, 228, 0.1)',
                   borderRadius: '12px'
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" 
                     style={{ 
                       backgroundColor: '#D2B48C',
                       boxShadow: '0 0 8px #D2B48C'
                     }} />
                <span className="text-white/90 text-base font-medium" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 500 }}>
                  Brucejack
                </span>
              </div>
              <span className="text-white/60 text-sm" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 400 }}>
                ~28 km north
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3" 
                 style={{ 
                   background: 'rgba(250, 245, 228, 0.08)',
                   backdropFilter: 'blur(10px)',
                   WebkitBackdropFilter: 'blur(10px)',
                   border: '1px solid rgba(250, 245, 228, 0.1)',
                   borderRadius: '12px'
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" 
                     style={{ 
                       backgroundColor: '#FFFF77',
                       boxShadow: '0 0 8px #FFFF77'
                     }} />
                <span className="text-white/90 text-base font-medium" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 500 }}>
                  Treaty Creek
                </span>
              </div>
              <span className="text-white/60 text-sm" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 400 }}>
                ~35 km north
              </span>
            </div>
            <div className="flex items-center justify-between py-2 px-3" 
                 style={{ 
                   background: 'rgba(250, 245, 228, 0.08)',
                   backdropFilter: 'blur(10px)',
                   WebkitBackdropFilter: 'blur(10px)',
                   border: '1px solid rgba(250, 245, 228, 0.1)',
                   borderRadius: '12px'
                 }}>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" 
                     style={{ 
                       backgroundColor: '#D2B48C',
                       boxShadow: '0 0 8px #D2B48C'
                     }} />
                <span className="text-white/90 text-base font-medium" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 500 }}>
                  Eskay Creek
                </span>
              </div>
              <span className="text-white/60 text-sm" style={{ fontFamily: "'Switzer Variable', 'Proxima Nova', system-ui, sans-serif", fontWeight: 400 }}>
                ~40 km northwest
              </span>
            </div>
          </div>
        </div>
      )}



      {/* Elegant weight transition animation */}
      <style jsx global>{`
        @keyframes elegant-reveal {
          to {
            font-weight: 300;
          }
        }
        
        @keyframes silver-shine {
          0%, 100% {
            background-position: 200% center;
          }
          50% {
            background-position: -200% center;
          }
        }
        
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        
        @keyframes spin {
          0% { 
            transform: rotate(0deg); 
          }
          100% { 
            transform: rotate(360deg); 
          }
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .silver-text {
          background: linear-gradient(
            110deg,
            #BDC3C7 0%,
            #E6E9ED 25%,
            #FFFFFF 50%,
            #E6E9ED 75%,
            #BDC3C7 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      {/* Dark gradient overlay for header area - matches EmailSignup "Be First to Know" style */}
      {/* TOP HEADER GRADIENT OVERLAY - Edit colors here to change top of page overlay */}
      {!hideHeadline && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: isMobile ? '140px' : '160px',
          background: 'linear-gradient(to bottom, rgba(13, 15, 30, 0.98) 0%, rgba(13, 15, 30, 0.85) 30%, rgba(10, 12, 25, 0.5) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 99999
        }}
      />
      )}

      {/* Main headline and subheading - at top above stats */}
      {!hideHeadline && (
      <motion.div
        className={`absolute ${isMobile ? 'left-4 right-4' : 'left-[5.5%]'} pointer-events-none`}
        style={{
          zIndex: 100000,
          top: isMobile ? '48px' : '72px',
          isolation: 'isolate'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showMainContent && !selectedProperty && !showSplitScreen && mapReady ? 1 : 0,
          y: showMainContent && !selectedProperty && !showSplitScreen && mapReady ? 0 : 20
        }}
        transition={{ 
          duration: showSplitScreen ? 0.3 : 0.8,  // Faster fade out, normal fade in
          ease: "easeOut", 
          delay: selectedProperty || showSplitScreen ? 0 : 0.5 
        }}
      >
        <div className={isMobile ? 'text-center' : ''}>
          {/* Main Headline - Large */}
          <h1 className={`${isMobile ? 'mb-3' : 'mb-4'}`}
              style={{
                fontFamily: "'Aeonik Extended', sans-serif",
                fontWeight: isMobile ? 600 : 500,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                maxWidth: isMobile ? '100%' : '900px',
                lineHeight: 1.15,
                fontSize: isMobile ? 'clamp(1.5rem, 6vw, 2.2rem)' : 'clamp(2.2rem, 3.2vw, 3.2rem)',
                transform: !prefersReducedMotion && isMobile ?
                  `perspective(1000px) rotateX(${deviceOrientation.beta * 0.05}deg) rotateY(${deviceOrientation.gamma * 0.05}deg)` :
                  'none',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.15s ease-out'
              }}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: showMainContent && !selectedProperty && !showSplitScreen ? 1 : 0 }}
              transition={{
                delay: selectedProperty || showSplitScreen ? 0 : 0.8,
                duration: showSplitScreen ? 0.3 : 0.8
              }}
              style={{
                display: 'block',
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, #A8A8A8 0%, #FFFFFF 25%, #E8E8E8 50%, #FFFFFF 75%, #A8A8A8 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 8s ease infinite',
              }}
            >
              From Prospector
              <br />
              to Partner in a
              <br />
              <span style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}>Tier-1 Project</span>
            </motion.span>
          </h1>

          {/* Subheading - Smaller */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: showMainContent && !selectedProperty && !showSplitScreen ? 1 : 0 }}
            transition={{
              delay: selectedProperty || showSplitScreen ? 0 : 1,
              duration: showSplitScreen ? 0.3 : 0.8
            }}
            className={`${isMobile ? 'mb-4' : 'mb-8'}`}
            style={{
              fontFamily: "'Aeonik', sans-serif",
              fontWeight: 400,
              letterSpacing: '0.01em',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: isMobile ? '100%' : '700px',
              lineHeight: 1.5,
              fontSize: isMobile ? 'clamp(0.95rem, 3.5vw, 1.1rem)' : 'clamp(1.1rem, 1.5vw, 1.4rem)',
            }}
          >
            With royalties and 30+ exploration
            <br />
            properties across the <span style={{ color: '#FFFF77' }}>Golden Triangle</span>.
          </motion.p>

          {/* Explore Assets Button with Dropdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showMainContent && !selectedProperty && !showSplitScreen ? 1 : 0 }}
            transition={{
              delay: selectedProperty || showSplitScreen ? 0 : 1.2,
              duration: showSplitScreen ? 0.3 : 0.8
            }}
            style={{
              position: 'relative',
              display: 'inline-block',
              pointerEvents: 'auto',
            }}
            onMouseEnter={() => setShowExploreDropdown(true)}
            onMouseLeave={() => setShowExploreDropdown(false)}
          >
            <button
              style={{
                fontFamily: "'Aeonik Extended', sans-serif",
                fontSize: '15px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#FFFFFF',
                background: 'linear-gradient(135deg, rgba(200, 210, 220, 0.15) 0%, rgba(180, 190, 200, 0.1) 50%, rgba(220, 225, 230, 0.15) 100%)',
                border: '1px solid rgba(200, 210, 220, 0.4)',
                borderRadius: '30px',
                padding: '14px 32px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(200, 210, 220, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(220, 225, 235, 0.25) 0%, rgba(200, 210, 220, 0.2) 50%, rgba(230, 235, 240, 0.25) 100%)'
                e.currentTarget.style.borderColor = 'rgba(220, 225, 235, 0.6)'
                e.currentTarget.style.boxShadow = '0 6px 30px rgba(200, 210, 220, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200, 210, 220, 0.15) 0%, rgba(180, 190, 200, 0.1) 50%, rgba(220, 225, 230, 0.15) 100%)'
                e.currentTarget.style.borderColor = 'rgba(200, 210, 220, 0.4)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(200, 210, 220, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              Explore Assets
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showExploreDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, rgba(12, 14, 28, 0.98) 0%, rgba(8, 10, 20, 0.98) 100%)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                    border: '1px solid rgba(200, 210, 220, 0.25)',
                    borderRadius: '16px',
                    padding: '10px',
                    minWidth: '260px',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(200, 210, 220, 0.08)',
                  }}
                >
                  {['Advanced Stage Projects', 'Early Stage Projects', 'Royalties'].map((item) => (
                    <button
                      key={item}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        fontFamily: "'Aeonik', sans-serif",
                        fontSize: '15px',
                        letterSpacing: '0.04em',
                        fontWeight: 500,
                        color: 'rgba(255, 255, 255, 0.9)',
                        background: 'transparent',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(200, 210, 220, 0.15) 0%, rgba(220, 225, 235, 0.1) 100%)'
                        e.currentTarget.style.color = '#FFFFFF'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Subheading and Explore Button */}
          <motion.div 
            style={{ 
              marginTop: isMobile ? '1.5rem' : '2rem',
              marginBottom: isMobile ? '2rem' : '3rem',
              textAlign: 'left',
              pointerEvents: 'auto' // Enable clicks on this section
            }}
            animate={{
              opacity: !showSplitScreen ? 1 : 0,
              scale: !showSplitScreen ? 1 : 0.95
            }}
            transition={{
              duration: showSplitScreen ? 0.2 : 0.5,  // Very fast fade out (200ms), normal fade in
              ease: "easeOut"
            }}
          >
            {/* Premium Drill Program Button - HIDDEN */}
            {false && (
            <motion.button
              onClick={() => {
                // Zoom to RAM property with better view
                if (map.current) {
                  const ramProject = MAJOR_PROJECTS.find(p => p.name === 'RAM')
                  if (ramProject) {
                    // Enhanced zoom to RAM drilling area with offset for split-screen
                    // Center on actual drilling zones and pads from GeoJSON data
                    const drillingCenter: [number, number] = [-129.768, 55.897] // Center of Malachite and Mitch zones
                    const zoomLevel = 14.85 // Increased zoom by 10% (13.5 * 1.1)
                    // Move the map viewport northeast to position drilling zones optimally
                    // Positive offsetLng moves east, positive offsetLat moves north
                    const offsetLng = isMobile ? 0 : -0.0025 // 2.5% west offset (moved 2% southwest)
                    const offsetLat = isMobile ? 0 : -0.0065 // 6.5% south offset (moved 2% southwest)
                    
                    // Start fade out immediately
                    updateShowSplitScreen(true)
                    
                    map.current.flyTo({
                      center: [drillingCenter[0] + offsetLng, drillingCenter[1] + offsetLat] as [number, number],
                      zoom: zoomLevel, // Closer zoom for better detail
                      duration: 3000, // Smoother transition
                      pitch: 55, // Better angle for terrain
                      bearing: -45, // Angled view for depth
                      curve: 1.2 // Smoother flight path
                    })
                    
                    // Show drone video and enable features after zoom completes
                    setTimeout(() => {
                      // Show drone video player
                      setShowDroneVideo(true)
                      
                      // Automatically enable drill targets and geological zones
                      setRamFeatures(prev => ({
                        ...prev,
                        drillTargets: true,
                        geologicalStructures: true
                      }))
                      
                      // Toggle the features on the map
                      toggleRamFeature('drillTargets', true)
                      toggleRamFeature('geologicalStructures', true)
                    }, 3000) // Wait for map zoom to complete
                  }
                }
              }}
              className="group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: isMobile ? '100%' : 'auto',
                padding: 0,
                border: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'transparent',
                boxShadow: `
                  0 10px 40px rgba(255, 255, 119, 0.2),
                  0 2px 10px rgba(0, 0, 0, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
              }}
            >
              {/* Animated border gradient */}
              <motion.div 
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 3,
                  ease: "linear",
                  repeat: Infinity
                }}
                style={{
                  position: 'absolute',
                  inset: '-2px',
                  background: 'linear-gradient(90deg, #FFFF77, #4DEEEA, #FFFF77)',
                  backgroundSize: '200% 100%',
                  borderRadius: '16px',
                  opacity: 0.6,
                  zIndex: 0
                }} 
              />
              
              {/* Main Content Container */}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(10, 10, 10, 0.85) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Left Content */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  padding: isMobile ? '1rem 1.25rem' : '1.25rem 1.75rem',
                  justifyContent: 'center',
                  gap: '0.375rem',
                  background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.03) 0%, transparent 100%)'
                }}>
                  {/* Status Badge Row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.25rem'
                  }}>
                    <span style={{
                      background: 'linear-gradient(90deg, #FF6B6B, #FFFF77)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: isMobile ? '0.7rem' : '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#000',
                      boxShadow: '0 2px 8px rgba(255, 255, 119, 0.3)'
                    }}>LIVE</span>
                    <span style={{
                      background: 'linear-gradient(135deg, #F9DC5C 0%, #FBE99A 50%, #F9DC5C 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      fontSize: isMobile ? '0.75rem' : '0.8rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      animation: 'gradientShift 8s ease infinite',
                      WebkitAnimation: 'gradientShift 8s ease infinite',
                      filter: 'drop-shadow(0 1px 6px rgba(249, 220, 92, 0.4))',
                      display: 'inline-block'
                    }}>2025 Drilling Program</span>
                  </div>
                  
                  {/* Main Title with Icon */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <img 
                      src="/images/ramlogoyellow.svg" 
                      alt="RAM Logo"
                      style={{ 
                        width: isMobile ? 22 : 26,
                        height: isMobile ? 22 : 26,
                        opacity: 0.9
                      }}
                    />
                    <h3 style={{
                      color: '#FFFF77',
                      fontSize: isMobile ? '1.1rem' : '1.25rem',
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      margin: 0,
                      textShadow: '0 2px 12px rgba(255, 255, 119, 0.4)'
                    }}>RAM Exploration</h3>
                  </div>
                  
                  {/* Description with Arrow */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <p style={{
                      background: 'linear-gradient(135deg, #F9DC5C 0%, #FBE99A 50%, #F9DC5C 100%)',
                      backgroundSize: '200% 200%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      fontSize: isMobile ? '0.75rem' : '0.8rem',
                      fontFamily: "'Switzer', sans-serif",
                      margin: 0,
                      lineHeight: 1.3,
                      letterSpacing: '0.02em',
                      flex: 1,
                      animation: 'gradientShift 8s ease infinite',
                      WebkitAnimation: 'gradientShift 8s ease infinite',
                      filter: 'drop-shadow(0 1px 4px rgba(249, 220, 92, 0.3))',
                      fontWeight: 500
                    }}>
                      Click here to watch exclusive drone footage
                    </p>
                    <motion.svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      animate={{
                        x: [0, 2, 0],
                        y: [0, -2, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        repeat: Infinity
                      }}
                      style={{ flexShrink: 0, filter: 'drop-shadow(0 1px 6px rgba(249, 220, 92, 0.4))' }}
                    >
                      <defs>
                        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#F9DC5C" />
                          <stop offset="50%" stopColor="#FBE99A" />
                          <stop offset="100%" stopColor="#F9DC5C" />
                        </linearGradient>
                      </defs>
                      <path 
                        d="M7 17L17 7M17 7H7M17 7V17" 
                        stroke="url(#arrowGradient)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </div>
                </div>
                
                {/* Right Video Section */}
                <div style={{
                  width: isMobile ? '130px' : '180px',
                  height: isMobile ? '110px' : '130px',
                  position: 'relative',
                  overflow: 'hidden',
                  flex: '0 0 auto',
                  background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.8) 100%)'
                }}>
                  {/* Video Background - Using Mux with correct Playback ID */}
                  <MuxThumbVideo
                    playbackId="Gx2Oj1vHHVq2TWsnsX201qpJFroj9d5DwKxHyNMoDoaQ"
                    width={isMobile ? 130 : 180}
                    height={isMobile ? 110 : 130}
                  />
                  
                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.4) 0%, transparent 60%)'
                  }} />
                  
                  
                  {/* Corner Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(10px)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    color: '#4DEEEA',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(77, 238, 234, 0.3)'
                  }}>
                    4K Drone
                  </div>
                </div>
              </div>
            </motion.button>
            )}
          </motion.div>
          
        </div>
      </motion.div>
      )}

      {/* Red Line Modal - Mobile */}
      <RedLineModalPortal>
        <AnimatePresence>
          {/* Red Line Info Box - Mobile - REMOVED to simplify UI */}
          {false && showInfoBox && isMobile && (
          <>
            <motion.div
              className="fixed left-0 right-0 top-0 bg-black/50"
              style={{ 
                zIndex: 9999998,
                position: 'fixed' as const,
                isolation: 'isolate' as const,
                bottom: '64px' // Stop at bottom navigation
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInfoBox(false)}
            />
            <motion.div
              ref={redLineModalRef}
              className="fixed left-0 right-0 rounded-t-3xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                zIndex: 9999999,
                position: 'fixed' as const,
                isolation: 'isolate' as const,
                bottom: '64px', // Height of bottom navigation
                maxHeight: 'calc(100vh - 120px)', // Allow modal to extend higher
                paddingBottom: 'env(safe-area-inset-bottom)',
                background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.25) 0%, rgba(2, 27, 71, 0.15) 50%, rgba(2, 27, 71, 0.08) 100%)',
                backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: `
                  0 -8px 32px 0 rgba(0, 0, 0, 0.37),
                  inset 0 2px 4px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)
                `,
                borderBottom: 'none',
              }}
            >
              {/* Swipe handle indicator */}
              <div className="w-full flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
              
              <div className="p-6 pt-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 style={{
                    color: '#FFFF77',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 600,
                    fontSize: '18px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    Kyba's Red Line
                  </h3>
                  <button
                    onClick={() => setShowInfoBox(false)}
                    className="p-2"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                      pointerEvents: 'auto',
                      minWidth: '44px',
                      minHeight: '44px',
                    }}
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6 text-white/60 hover:text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <h4 style={{
                  color: 'rgba(250, 245, 228, 0.9)',
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: '20px',
                  fontFamily: "'Switzer Variable', sans-serif",
                  letterSpacing: '0.01em',
                }}>
                  Sulphurets Thrust Fault System
                </h4>

                <div style={{
                  color: 'rgba(250, 245, 228, 0.8)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  marginBottom: '20px',
                  fontFamily: "'Switzer Variable', sans-serif",
                }}>
                  <p style={{ marginBottom: '16px' }}>
                    A major crustal-scale structure that served as the primary conduit for magmas and mineralizing fluids in the Golden Triangle. This fault system controlled the emplacement of multiple world-class deposits.
                  </p>
                  <p>
                    The "Red Line" represents the surface trace of this critical geological feature, extending for over 140 km through the heart of the district.
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 119, 0.05)',
                  border: '1px solid rgba(255, 255, 119, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px',
                }}>
                  <h5 style={{
                    color: '#FFFF77',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '12px',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}>
                    Associated Deposits
                  </h5>
                  <div className="space-y-2">
                    {[
                      { name: 'KSM', detail: '77.7 Moz Au, 38.2 Blb Cu' },
                      { name: 'Treaty Creek', detail: '27.9 Moz AuEq' },
                      { name: 'Brucejack', detail: 'Operating mine' },
                      { name: 'Eskay Creek', detail: 'Past producer' },
                    ].map((deposit) => (
                      <div key={deposit.name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <span style={{
                          color: '#FFFF77',
                          fontWeight: 600,
                          fontFamily: "'Switzer Variable', sans-serif",
                          fontSize: '14px',
                        }}>{deposit.name}</span>
                        <span style={{
                          color: 'rgba(250, 245, 228, 0.7)',
                          fontFamily: "'Switzer Variable', sans-serif",
                          fontSize: '13px',
                        }}>{deposit.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{
                  color: 'rgba(250, 245, 228, 0.5)',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  margin: 0,
                  fontFamily: "'Switzer Variable', sans-serif",
                  paddingTop: '8px',
                }}>
                  Nelson, J.L. & Kyba, J. (2014). Structural and stratigraphic control of porphyry and related mineralization in the Treaty Glacier–KSM–Brucejack–Stewart trend of western Stikinia.
                </p>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </RedLineModalPortal>

      {/* Red Line Info Box - Desktop - REMOVED to simplify UI */}
      {false && (
      <AnimatePresence>
        {showInfoBox && !isMobile && (
          <motion.div
            className="fixed pointer-events-auto"
            style={{
              bottom: '2rem',
              right: '2rem',
              zIndex: 100021, // Increased z-index to appear above property info box
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.025) 100%)',
                backdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 4px 12px 0 rgba(255, 255, 255, 0.1), inset 0 -4px 12px 0 rgba(0, 0, 0, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                minWidth: '360px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              
              <button
                onClick={() => setShowInfoBox(false)}
                className="absolute top-4 right-4"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(250, 245, 228, 0.6)',
                  cursor: 'pointer',
                  padding: '0',
                  fontSize: '24px',
                  lineHeight: '1',
                  transition: 'color 0.2s ease',
                  pointerEvents: 'auto',
                  zIndex: 100002,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgba(250, 245, 228, 0.9)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(250, 245, 228, 0.6)'
                }}
                aria-label="Close"
              >
                ×
              </button>

              <h3 className="text-white/90 font-semibold text-lg mb-4" style={{ fontFamily: "'Switzer Variable', sans-serif" }}>
                Kyba's Red Line Info
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Structure Type</span>
                  <span className="text-white/90 font-medium">Thrust Fault System</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Length</span>
                  <span className="text-white/90 font-medium">140+ km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Significance</span>
                  <span className="text-white/90 font-medium">Primary Mineralizing Conduit</span>
                </div>
                <div className="h-px bg-white/10 my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Major Deposits</span>
                  <span className="text-white/90 font-medium">KSM, Treaty Creek</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Total Resources</span>
                  <span className="text-white/90 font-medium">100+ Moz AuEq</span>
                </div>
                <div className="h-px bg-white/10 my-3" />
                <p className="text-white/60 text-xs italic pt-2">
                  The "Red Line" controls the emplacement of world-class porphyry and epithermal deposits throughout the Golden Triangle.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      )}

      {/* Property Navigation Bar - Desktop Only - Hide in drone view */}
      <AnimatePresence>
        {showMainContent && !isMobile && !showSplitScreen && (
          <motion.div
            className={`absolute ${isMobile ? 'bottom-4' : 'bottom-6'} left-0 right-0 flex justify-center z-[100000] ${isMobile ? 'px-4' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div
              className={`flex items-center gap-2 ${isMobile ? 'px-4 py-2' : 'px-6 py-3'} rounded-full ${isMobile ? 'overflow-x-auto max-w-full' : ''}`}
              style={{
                background: 'rgba(250, 245, 228, 0.08)',
                backdropFilter: 'blur(24px) saturate(200%)',
                WebkitBackdropFilter: 'blur(24px) saturate(200%)',
                border: '1px solid rgba(250, 245, 228, 0.2)',
                boxShadow: `
                  0 8px 32px 0 rgba(0, 0, 0, 0.4),
                  inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
                  inset 0 -1px 0 0 rgba(0, 0, 0, 0.3)
                `,
              }}
            >
              {/* Properties */}
              {[
                { name: 'FIJI', hectares: '2,500' },
                { name: 'TONGA', hectares: '1,800' },
                { name: 'RAM', hectares: '3,200' },
                { name: 'CLONE', hectares: '2,100' },
                { name: 'KONKIN SILVER', hectares: '4,500' },
                { name: 'MIDAS', hectares: '1,900' },
              ].map((property, index) => (
                <button
                  key={property.name}
                  className={`relative ${isMobile ? 'px-3 py-1.5' : 'px-4 py-2'} transition-all duration-300 group whitespace-nowrap`}
                  onClick={() => {
                    if (!map.current) return
                    
                    // Special handling for RAM - show property modal but with drone view zoom location
                    if (property.name === 'RAM') {
                      console.log('RAM button clicked - showing property modal with zone labels')
                      
                      // Set selected property to show modal
                      updateSelectedProperty('RAM')
                      
                      // Hide all property markers and labels when zooming
                      const mainMarkers = document.querySelectorAll('.property-marker-main')
                      const markers = document.querySelectorAll('.property-marker-icon')
                      const labels = document.querySelectorAll('.property-label')
                      mainMarkers.forEach((marker) => {
                        (marker as HTMLElement).style.opacity = '0'
                      })
                      markers.forEach((marker) => {
                        (marker as HTMLElement).style.opacity = '0'
                      })
                      labels.forEach((label) => {
                        (label as HTMLElement).style.opacity = '0'
                      })
                      
                      // Use the same zoom location as drone view
                      const drillingCenter: [number, number] = [-129.768, 55.897] // Center of Malachite and Mitch zones
                      const zoomLevel = 14.85 // Same zoom level as drone view
                      const offsetLng = isMobile ? 0 : -0.0025 // 2.5% west offset
                      const offsetLat = isMobile ? 0 : -0.0065 // 6.5% south offset
                      
                      // Zoom to RAM drilling area
                      map.current.flyTo({
                        center: [drillingCenter[0] + offsetLng, drillingCenter[1] + offsetLat] as [number, number],
                        zoom: zoomLevel,
                        duration: 2500,
                        pitch: 55, // Same pitch as drone view for better terrain visibility
                        bearing: -45, // Same bearing as drone view
                        curve: 1.3
                      })
                      
                      // Show property modal and enable zone labels after zoom
                      setTimeout(() => {
                        setShowPropertyModal(true)
                        
                        // Enable drill targets and geological zones to show zone labels
                        setRamFeatures(prev => ({
                          ...prev,
                          drillTargets: true,
                          geologicalStructures: true
                        }))
                        
                        // Toggle the features on the map to show zone labels
                        toggleRamFeature('drillTargets', true)
                        toggleRamFeature('geologicalStructures', true)
                      }, 2500)
                      
                      return
                    }
                    
                    // Regular property handling for non-RAM properties
                    if (!LUXOR_BOUNDARIES) return
                    
                    // Set the selected property
                    console.log('Setting selected property:', property.name)
                    updateSelectedProperty(property.name)
                    
                    // Hide all property markers and labels when zooming
                    const mainMarkers = document.querySelectorAll('.property-marker-main')
                    const markers = document.querySelectorAll('.property-marker-icon')
                    const labels = document.querySelectorAll('.property-label')
                    mainMarkers.forEach((marker) => {
                      (marker as HTMLElement).style.opacity = '0'
                    })
                    markers.forEach((marker) => {
                      (marker as HTMLElement).style.opacity = '0'
                    })
                    labels.forEach((label) => {
                      (label as HTMLElement).style.opacity = '0'
                    })
                    
                    // Find the property in the GeoJSON
                    const propertyFeature = LUXOR_BOUNDARIES.features.find(
                      (f: any) => f.properties.name === property.name
                    )
                    
                    if (propertyFeature) {
                      // Calculate bounds of the property
                      const bounds = new mapboxgl.LngLatBounds()
                      
                      if (propertyFeature.geometry.type === 'Polygon') {
                        propertyFeature.geometry.coordinates[0].forEach((coord: number[]) => {
                          bounds.extend([coord[0], coord[1]])
                        })
                      } else if (propertyFeature.geometry.type === 'MultiPolygon') {
                        propertyFeature.geometry.coordinates.forEach((polygon: number[][][]) => {
                          polygon[0].forEach((coord: number[]) => {
                            bounds.extend([coord[0], coord[1]])
                          })
                        })
                      }
                      
                      // Get the map container dimensions
                      const mapContainer = map.current.getContainer()
                      const containerWidth = mapContainer.offsetWidth
                      
                      // Calculate bounds center and dimensions
                      const center = bounds.getCenter()
                      const ne = bounds.getNorthEast()
                      const sw = bounds.getSouthWest()
                      const latDiff = Math.abs(ne.lat - sw.lat)
                      const lngDiff = Math.abs(ne.lng - sw.lng)
                      const maxDiff = Math.max(latDiff, lngDiff)
                      
                      // Determine zoom level based on property size (less zoom on mobile)
                      let zoom = isMobile ? 12.5 : 13.5
                      if (maxDiff > 0.1) zoom = isMobile ? 10.5 : 11.5
                      else if (maxDiff > 0.05) zoom = isMobile ? 11.5 : 12.5
                      else if (maxDiff > 0.02) zoom = isMobile ? 12 : 13
                      
                      // Position property slightly off-center to avoid content box overlap
                      let adjustedCenter = center
                      if (!isMobile) {
                        // Shift center to position property better in viewport
                        const degreesPerPixel = 360 / (256 * Math.pow(2, zoom))
                        const mapContainer = map.current.getContainer()
                        const viewportWidthInDegrees = mapContainer.offsetWidth * degreesPerPixel
                        const viewportHeightInDegrees = mapContainer.offsetHeight * degreesPerPixel
                        // Shift by 10% left and 10% down
                        const offsetLng = viewportWidthInDegrees * 0.10
                        const offsetLat = viewportHeightInDegrees * 0.10
                        
                        adjustedCenter = new mapboxgl.LngLat(
                          center.lng - offsetLng,
                          center.lat - offsetLat
                        )
                      }
                      
                      // Remove any existing highlight layers BEFORE flying
                      const highlightLayers = ['property-highlight-fill', 'property-highlight-glow', 'property-highlight-outline']
                      highlightLayers.forEach(layerId => {
                        if (map.current!.getLayer(layerId)) {
                          map.current!.removeLayer(layerId)
                        }
                      })
                      
                      // Set up the property filter - use property name directly
                      const propertyNameForFilter = property.name;
                      
                      console.log('Property filter name:', propertyNameForFilter);
                      const propertyFilter = ['==', ['get', 'name'], propertyNameForFilter]
                      
                      // Add highlight layers BEFORE flying to prevent flicker
                      if (map.current.getSource('luxor-properties')) {
                        try {
                          // Remove existing highlight layers first
                          const highlightLayers = ['property-highlight-fill', 'property-highlight-glow', 'property-highlight-outline', 'property-highlight-golden-glow']
                          highlightLayers.forEach(layerId => {
                            if (map.current!.getLayer(layerId)) {
                              map.current!.removeLayer(layerId)
                            }
                          })
                          
                          // Add layers in correct order without specifying beforeId
                          if (!map.current.getLayer('property-highlight-fill')) {
                            map.current.addLayer({
                              id: 'property-highlight-fill',
                              type: 'fill',
                              source: 'luxor-properties',
                              filter: propertyFilter,
                              paint: {
                                'fill-color': '#c0d8ff',
                                'fill-opacity': 0.15
                              }
                            })
                          }
                          
                          if (!map.current.getLayer('property-highlight-glow')) {
                            map.current.addLayer({
                              id: 'property-highlight-glow',
                              type: 'line',
                              source: 'luxor-properties',
                              filter: propertyFilter,
                              paint: {
                                'line-color': '#a0c4ff',
                                'line-width': 35,
                                'line-blur': 30,
                                'line-opacity': 0.4
                              }
                            })
                          }
                          
                          if (!map.current.getLayer('property-highlight-golden-glow')) {
                            map.current.addLayer({
                              id: 'property-highlight-golden-glow',
                              type: 'line',
                              source: 'luxor-properties',
                              filter: propertyFilter,
                              paint: {
                                'line-color': '#a0c4ff',
                                'line-width': 60,
                                'line-blur': 50,
                                'line-opacity': 0.6
                              }
                            })
                          }
                          
                          // Removed black outline - only using golden glow
                        } catch (error) {
                          console.error('Error adding highlight layers:', error)
                        }
                      }
                      
                      // Dim all other properties
                      setTimeout(() => {
                        if (map.current && map.current.getLayer('luxor-properties-fill')) {
                          map.current.setPaintProperty('luxor-properties-fill', 'fill-opacity', [
                            'case',
                            propertyFilter,
                            0.7, // Selected property keeps high opacity
                            0.2  // Other properties dimmed
                          ])
                        }
                        
                        if (map.current && map.current.getLayer('luxor-properties-outline')) {
                          map.current.setPaintProperty('luxor-properties-outline', 'line-opacity', [
                            'case',
                            propertyFilter,
                            1,    // Selected property keeps full opacity
                            0.25   // Other properties at 75% opacity reduction (25% visible)
                          ])
                        }
                        
                        // Also dim the glow layer
                        if (map.current && map.current.getLayer('luxor-properties-glow')) {
                          map.current.setPaintProperty('luxor-properties-glow', 'line-opacity', [
                            'case',
                            propertyFilter,
                            0.8,  // Selected property keeps bright glow
                            0.2   // Other properties have dimmed glow
                          ])
                        }
                      }, 100)
                      
                      // Clear any existing animation
                      if (animationIntervalRef.current) {
                        clearInterval(animationIntervalRef.current)
                      }
                      
                      // Start subtle pulsing golden glow animation
                      let pulsePhase = 0
                      animationIntervalRef.current = setInterval(() => {
                        pulsePhase = (pulsePhase + 0.02) % (Math.PI * 2)  // Slower animation
                        const glowOpacity = 0.3 + Math.sin(pulsePhase) * 0.15  // Subtle: varies from 0.15 to 0.45
                        const glowWidth = 40 + Math.sin(pulsePhase) * 15  // Subtle: varies from 25 to 55
                        
                        if (map.current && map.current.getLayer('property-highlight-golden-glow')) {
                          map.current.setPaintProperty('property-highlight-golden-glow', 'line-opacity', glowOpacity)
                          map.current.setPaintProperty('property-highlight-golden-glow', 'line-width', glowWidth)
                        } else {
                          if (animationIntervalRef.current) {
                            clearInterval(animationIntervalRef.current)
                            animationIntervalRef.current = null
                          }
                        }
                      }, 60)  // Update every 60ms for smooth animation
                      
                      // Temporarily disable terrain to prevent rumbling during transition
                      const currentTerrain = map.current.getTerrain()
                      if (currentTerrain) {
                        map.current.setTerrain(null)
                      }
                      
                      // Use easeTo for smoother transition without rumbling
                      map.current.easeTo({
                        center: [adjustedCenter.lng, adjustedCenter.lat],
                        zoom: zoom,
                        pitch: 45,
                        bearing: -20,
                        duration: 2200,
                        easing: (t: number) => {
                          // Custom easing function for very smooth acceleration/deceleration
                          return t < 0.5
                            ? 4 * t * t * t
                            : 1 - Math.pow(-2 * t + 2, 3) / 2
                        }
                      })
                      
                      // Also ensure highlights are visible after movement
                      map.current.once('moveend', () => {
                        // Re-enable terrain after transition completes
                        if (currentTerrain && map.current!.getSource('mapbox-dem')) {
                          map.current!.setTerrain({ 
                            source: 'mapbox-dem', 
                            exaggeration: isMobile ? 1.3 : 1.1
                          })
                        }
                        
                        // Show markers and labels after zoom completes with a short delay
                        setTimeout(() => {
                          const mainMarkers = document.querySelectorAll('.property-marker-main')
                          const markers = document.querySelectorAll('.property-marker-icon')
                          const labels = document.querySelectorAll('.property-label')
                          mainMarkers.forEach((marker) => {
                            (marker as HTMLElement).style.opacity = '1'
                          })
                          markers.forEach((marker) => {
                            (marker as HTMLElement).style.opacity = '1'
                          })
                          labels.forEach((label) => {
                            (label as HTMLElement).style.opacity = '1'
                          })
                        }, 300)
                        
                        // Re-add highlights if they're not visible (golden glow only)
                        if (!map.current!.getLayer('property-highlight-golden-glow')) {
                          // Remove any existing layers
                          ['property-highlight-fill', 'property-highlight-glow', 'property-highlight-outline', 'property-highlight-golden-glow'].forEach(layerId => {
                            if (map.current!.getLayer(layerId)) {
                              map.current!.removeLayer(layerId)
                            }
                          })
                          
                          // Re-add only the golden glow
                          map.current!.addLayer({
                            id: 'property-highlight-golden-glow',
                            type: 'line',
                            source: 'luxor-properties',
                            filter: propertyFilter,
                            paint: {
                              'line-color': '#a0c4ff',
                              'line-width': 60,
                              'line-blur': 50,
                              'line-opacity': 0.3
                            }
                          })
                        }
                      })
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)',
                      borderRadius: '4px',
                    }}
                  />
                  <div className="relative z-10">
                    <div
                      className="text-sm tracking-wider"
                      style={{
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontFamily: "'Aeonik Extended', sans-serif",
                        fontWeight: 500,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {property.name}
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Reset View Button */}
              <div
                className="h-6 w-px mx-3"
                style={{ background: 'rgba(255, 255, 255, 0.15)' }}
              />
              <button
                className="px-4 py-2 transition-all duration-300 relative group"
                onClick={() => {
                  if (!map.current) return
                  
                  // Clear selected property
                  updateSelectedProperty(null)
                  
                  // Hide all property markers and labels when returning to overview
                  const mainMarkers = document.querySelectorAll('.property-marker-main')
                  const markers = document.querySelectorAll('.property-marker-icon')
                  const labels = document.querySelectorAll('.property-label')
                  mainMarkers.forEach((marker) => {
                    (marker as HTMLElement).style.opacity = '0'
                  })
                  markers.forEach((marker) => {
                    (marker as HTMLElement).style.opacity = '0'
                  })
                  labels.forEach((label) => {
                    (label as HTMLElement).style.opacity = '0'
                  })
                  
                  // Clear any animations
                  if (animationIntervalRef.current) {
                    clearInterval(animationIntervalRef.current)
                    animationIntervalRef.current = null
                  }
                  
                  // Clean up RAM features if they're enabled
                  if (ramFeatures.drillTargets || ramFeatures.geologicalStructures) {
                    // Disable all RAM features
                    Object.keys(ramFeatures).forEach((featureKey) => {
                      if (ramFeatures[featureKey as keyof typeof ramFeatures]) {
                        toggleRamFeature(featureKey as keyof typeof ramFeatures, false)
                      }
                    })
                    // Reset all features to false
                    setRamFeatures({
                      drillTargets: false,
                      geologicalStructures: false,
                      historicalData: false,
                      terrainAnalysis: false,
                      accessRoutes: false
                    })
                  }
                  
                  // Remove any highlight layers
                  const highlightLayers = ['property-highlight-fill', 'property-highlight-glow', 'property-highlight-outline', 'property-highlight-golden-glow', 'property-selected-glow']
                  highlightLayers.forEach(layerId => {
                    if (map.current!.getLayer(layerId)) {
                      map.current!.removeLayer(layerId)
                    }
                  })
                  
                  // Restore full opacity to all properties
                  if (map.current!.getLayer('luxor-properties-fill')) {
                    map.current!.setPaintProperty('luxor-properties-fill', 'fill-opacity', 0.6)
                  }
                  
                  if (map.current!.getLayer('luxor-properties-outline')) {
                    map.current!.setPaintProperty('luxor-properties-outline', 'line-opacity', 1)
                  }
                  
                  // Return to overview
                  const luxorLat = 55.827
                  const luxorLng = -129.653
                  const majorDepositsAvgLat = 55.827
                  const majorDepositsAvgLng = -129.653
                  const centerLat = luxorLat * 0.6 + majorDepositsAvgLat * 0.4
                  const centerLng = luxorLng * 0.6 + majorDepositsAvgLng * 0.4
                  const adjustedCenterLng = centerLng - 0.186 + 0.04 - 0.013 - 0.026 + 0.025 // Added 3% east (same as initial)
                  const adjustedCenterLat = centerLat - 0.04 - 0.025 - 0.0056 - 0.0112 + 0.0056 + 0.0112 - 0.025 // Added 3% south (same as initial)
                  
                  if (isMobile) {
                    // Use fitBounds for mobile to ensure all claims are visible
                    fitMobileOverviewBounds()
                  } else {
                    // Desktop uses calculated center and zoom
                    map.current.easeTo({
                      center: [adjustedCenterLng, adjustedCenterLat],
                      zoom: 10.3,
                      pitch: 45, // Reduced to make properties appear larger
                      bearing: -25,
                      duration: 2200,
                      easing: (t: number) => {
                        return t < 0.5
                          ? 4 * t * t * t
                          : 1 - Math.pow(-2 * t + 2, 3) / 2
                      }
                    })
                    
                    // Show markers and labels after returning to overview
                    map.current.once('moveend', () => {
                      setTimeout(() => {
                        const mainMarkers = document.querySelectorAll('.property-marker-main')
                        const markers = document.querySelectorAll('.property-marker-icon')
                        const labels = document.querySelectorAll('.property-label')
                        mainMarkers.forEach((marker) => {
                          (marker as HTMLElement).style.opacity = '1'
                        })
                        markers.forEach((marker) => {
                          (marker as HTMLElement).style.opacity = '1'
                        })
                        labels.forEach((label) => {
                          (label as HTMLElement).style.opacity = '1'
                        })
                      }, 300)
                    })
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.15) 0%, rgba(255, 215, 0, 0.1) 100%)',
                    borderRadius: '4px',
                  }}
                />
                <div
                  className="relative z-10 text-sm tracking-wider"
                  style={{
                    color: '#FFFF77',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 500,
                    letterSpacing: '0.08em',
                  }}
                >
                  OVERVIEW
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Property Name Display - moved to top level */}
      <AnimatePresence mode="wait">
        {selectedProperty && showMainContent && (
          <motion.div
            key={selectedProperty}
            className={`absolute ${isMobile ? 'left-4 right-4' : 'left-[4%]'} pointer-events-none`}
            style={{
              zIndex: 50,
              top: isMobile ? '120px' : '160px',
              // Removed bottom constraint to allow natural height
              overflowY: 'auto',
              maxHeight: isMobile ? 'calc(100vh - 200px)' : 'auto', // Auto height for desktop
              // Enable smooth touch scrolling on mobile
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              scrollBehavior: 'smooth'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
          >
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                duration: 0.5,
                delay: 0.8 // Reduced delay
              }}
              style={{
                fontFamily: "'Aeonik Extended', sans-serif",
                fontWeight: 600,
                letterSpacing: '0.08em',
                fontSize: isMobile ? 'clamp(1.8rem, 6vw, 2.5rem)' : 'clamp(2.5rem, 4.5vw, 4rem)',
                lineHeight: 1,
                marginBottom: 0,
                paddingLeft: isMobile ? '16px' : '0', // Align with description box padding
                // Gradient text effect
                background: 'linear-gradient(135deg, #F9DC5C 0%, #FBE99A 50%, #F9DC5C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 2px 20px rgba(249, 220, 92, 0.3)',
              }}>
              {selectedProperty}
            </motion.h1>
            {PROPERTY_DESCRIPTIONS[selectedProperty] && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: 1.0 // Reduced delay
                }}
                style={{
                  marginTop: isMobile ? '12px' : '16px',
                  maxWidth: isMobile ? '100%' : '800px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(12px) saturate(150%)',
                  WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                  padding: isMobile ? '12px' : '16px', // Reduced padding
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <p style={{
                    fontFamily: "'Aeonik Medium', 'Aeonik', sans-serif",
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, #F9DC5C 0%, #FBE99A 60%, #F9DC5C 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: isMobile ? 'clamp(0.875rem, 2.5vw, 1rem)' : 'clamp(0.95rem, 1.4vw, 1.1rem)', // Slightly smaller
                    lineHeight: 1.5, // More compact line height
                    filter: 'drop-shadow(0 2px 8px rgba(249, 220, 92, 0.2))',
                    margin: 0,
                  }}>
                    {PROPERTY_DESCRIPTIONS[selectedProperty]}
                  </p>
                  
                  {/* Enhanced property info for desktop */}
                  {!isMobile && PROPERTY_INFO[selectedProperty] && (
                    <div style={{ marginTop: '12px' }}> {/* Reduced margin */}
                      {/* Elements and Stats side by side */}
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}> {/* Reduced gap */}
                        {/* Elements */}
                        <div style={{ flex: '0 0 auto' }}>
                          <h4 style={{
                            fontFamily: "'Aeonik Extended', sans-serif",
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#FFFF77',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '8px',
                          }}>
                            Elements
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {PROPERTY_INFO[selectedProperty].elements.map((element) => (
                              <PeriodicElement key={element.symbol} {...element} />
                            ))}
                          </div>
                        </div>
                      
                        {/* Key Stats */}
                        <div style={{ flex: 1 }}>
                          <h4 style={{
                            fontFamily: "'Aeonik Extended', sans-serif",
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#FFFF77',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: '8px',
                          }}>
                            Key Information
                          </h4>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                            {PROPERTY_INFO[selectedProperty].keyStats.map((stat, index) => (
                              <div key={index} style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                              }}>
                                <div style={{
                                  fontSize: '11px',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  marginBottom: '2px',
                                  fontFamily: "'Switzer Variable', sans-serif",
                                }}>
                                  {stat.label}
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  color: 'rgba(255, 255, 255, 0.9)',
                                  fontWeight: 500,
                                  fontFamily: "'Aeonik', sans-serif",
                                  lineHeight: 1.3,
                                }}>
                                  {stat.value}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mineralization Type */}
                      <div style={{
                        marginTop: '12px',
                        padding: '8px 12px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 119, 0.08) 0%, rgba(255, 255, 119, 0.04) 100%)',
                        borderRadius: '6px',
                        border: '1px solid rgba(255, 255, 119, 0.15)',
                        display: 'inline-block',
                      }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#FFFF77',
                          fontFamily: "'Switzer Variable', sans-serif",
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                        }}>
                          {PROPERTY_INFO[selectedProperty].mineralizationType}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Explore Property Button - styled like RAM page */}
                  {PROPERTY_URLS[selectedProperty] && (
                    <div style={{ 
                      marginTop: isMobile ? '24px' : '32px',
                      marginBottom: '16px',
                      marginRight: isMobile ? '8px' : '12px',
                      display: 'flex',
                      justifyContent: 'flex-end' 
                    }}>
                      {isTeaser ? (
                        <div 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 28px',
                            borderRadius: '9999px',
                            // Muted version for teaser - gray/disabled appearance
                            background: `linear-gradient(135deg, 
                              rgba(100, 100, 100, 0.4) 0%, 
                              rgba(120, 120, 120, 0.3) 30%,
                              rgba(110, 110, 110, 0.2) 70%,
                              rgba(100, 100, 100, 0.35) 100%)`,
                            backdropFilter: 'blur(20px) saturate(120%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontFamily: "'Aeonik', sans-serif",
                            fontSize: '16px',
                            fontWeight: 500,
                            letterSpacing: '0.03em',
                            cursor: 'default',
                            opacity: 0.7,
                          }}
                        >
                          <span>Available at Launch</span>
                          <div style={{ 
                            width: '6px', 
                            height: '6px', 
                            borderRadius: '50%', 
                            background: 'rgba(255, 255, 255, 0.4)' 
                          }} />
                        </div>
                      ) : (
                        <Link 
                          href={PROPERTY_URLS[selectedProperty]} 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 28px',
                            borderRadius: '9999px', // Full rounded
                            transition: 'all 0.3s ease',
                            // Exact gradient from RAM page
                            background: `linear-gradient(135deg, 
                              rgba(255, 190, 152, 0.9) 0%, 
                              rgba(255, 190, 152, 0.8) 30%,
                              rgba(254, 217, 146, 0.7) 70%,
                              rgba(255, 190, 152, 0.85) 100%)`,
                            backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: '#0d0f1e', // Dark text color
                            textDecoration: 'none',
                            fontFamily: "'Aeonik', sans-serif",
                            fontSize: '16px',
                            fontWeight: 500,
                            letterSpacing: '0.03em',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <span>Explore Property</span>
                          <FiArrowRight className="w-6 h-6" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RAM Zone Info Cards - Display on the right when RAM is selected */}
      {selectedProperty === 'RAM' && !isMobile && showMainContent && (
        <motion.div
          className="absolute right-8"
          style={{
            top: '160px',
            zIndex: 55,
            width: '320px',
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="space-y-4">
            {/* Malachite Porphyry Zone Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 119, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 119, 0.1)',
              }}
            >
              <h3 style={{
                fontFamily: "'Aeonik Extended', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFF77',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
              }}>
                Malachite Porphyry Zone
              </h3>
              <p style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: '12px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
              }}>
                A 400m long outcrop of porphyritic rock (open to extension) discovered in the northern portion, south-southwest of Red Mountain.
              </p>
              <ul style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: '11px',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '8px 0 0 0',
                paddingLeft: '16px',
                listStyle: 'disc',
              }}>
                <li>Extensive malachite staining</li>
                <li>Presence of chalcopyrite, pyrite, magnetite, and K-feldspar</li>
                <li>Bismuth mineralization (identified by XRF)</li>
              </ul>
            </motion.div>

            {/* Mitch Zone VMS Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              style={{
                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.85) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 119, 0.3)',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 2px rgba(255, 255, 119, 0.1)',
              }}
            >
              <h3 style={{
                fontFamily: "'Aeonik Extended', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFF77',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
              }}>
                Mitch Zone
              </h3>
              <p style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: '12px',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
              }}>
                Located southwest of the Malachite Porphyry, this zone features:
              </p>
              <ul style={{
                fontFamily: "'Aeonik', sans-serif",
                fontSize: '11px',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.75)',
                margin: '8px 0 0 0',
                paddingLeft: '16px',
                listStyle: 'disc',
              }}>
                <li>En echelon stringers of coarse pyrite mineralization in sediments</li>
                <li>Abundant veins and veinlets ranging from millimeters to 2-4 cm in width</li>
                <li>Lesser areas of massive chalcopyrite veins up to 5 cm thick</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Mobile Logo - With glow effects but no gyroscopic */}
      {isMobile && showMainContent && !hideMobileNav && (
        <motion.div
          className="absolute z-[100002]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            position: 'absolute',
            left: '2%',
            top: useTeutonLogo ? 
              'max(6px, calc(env(safe-area-inset-top) - 6px))' : // Move up 10% for Teuton (12px - 6px = 6px reduction)
              'max(12px, env(safe-area-inset-top))', // Original position for Luxor
            width: window.innerWidth >= 390 ? '155px' : '107px',
            height: window.innerWidth >= 390 ? '55px' : '37px',
          }}
        >
          {/* Dark gradient background for logo pop - Hide for Teuton */}
          {!useTeutonLogo && (
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.1) 50%, transparent 70%)',
              filter: 'blur(10px)',
              transform: 'scale(2)',
              zIndex: 1,
            }}
          />
          )}
          
          {/* Pulsing glow effect - Hide for Teuton */}
          {!prefersReducedMotion && !useTeutonLogo && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.25) 30%, transparent 70%)',
                filter: 'blur(15px)',
                transform: 'scale(1.5)',
                zIndex: 2,
              }}
              animate={{
                scale: [1.5, 1.8, 1.5],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
          
          {/* Secondary glow - Hide for Teuton */}
          {!prefersReducedMotion && !useTeutonLogo && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.5) 0%, rgba(255,215,0,0.3) 20%, transparent 50%)',
                filter: 'blur(8px)',
                transform: 'scale(1.3)',
                zIndex: 3,
              }}
              animate={{
                scale: [1.3, 1.1, 1.3],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          )}
          
          <img
            src="/images/teuton-logo.svg"
            alt="Teuton Resources"
            className="w-full h-full object-contain relative z-10"
            style={{
              filter: `drop-shadow(0 0 8px rgba(249, 220, 92, 0.6))
                       drop-shadow(0 0 20px rgba(249, 220, 92, 0.4))
                       drop-shadow(0 0 40px rgba(249, 220, 92, 0.3))`,
            }}
          />
        </motion.div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && showMainContent && !hideMobileNav && (
        <motion.button
          className="z-[100005] rounded-xl min-w-[48px] min-h-[48px] flex items-center justify-center focus:outline-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute',
            right: '16px',
            top: 'max(12px, env(safe-area-inset-top))',
            background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.25) 0%, rgba(2, 27, 71, 0.15) 50%, rgba(2, 27, 71, 0.1) 100%)',
            backdropFilter: 'blur(20px) saturate(200%) brightness(1.3)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.3)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: `
              0 8px 32px 0 rgba(0, 0, 0, 0.37),
              inset 0 2px 4px 0 rgba(255, 255, 255, 0.2),
              inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1),
              0 0 40px rgba(2, 27, 71, 0.4)
            `,
            width: '48px',
            height: '48px',
            padding: 0,
            overflow: 'hidden',
          }}
          aria-label="Open menu"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Top gradient line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 119, 0.3) 50%, transparent 100%)',
            }}
          />
          
          {/* Subtle inner glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 119, 0.05) 0%, transparent 70%)',
            }}
          />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative" style={{ width: '20px', height: '16px' }}>
              <motion.span
                className="absolute rounded-full"
                style={{ 
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: showMobileMenu ? '#FFFF77' : 'rgba(250, 245, 228, 0.9)',
                  boxShadow: showMobileMenu ? '0 0 6px rgba(255, 255, 119, 0.5)' : 'none',
                }}
                animate={{ rotate: showMobileMenu ? 45 : 0, y: showMobileMenu ? 7 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute rounded-full"
                style={{ 
                  top: '50%', 
                  left: 0,
                  right: 0,
                  transform: 'translateY(-50%)',
                  height: '2px',
                  background: 'rgba(250, 245, 228, 0.9)',
                }}
                animate={{ opacity: showMobileMenu ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="absolute rounded-full"
                style={{ 
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: showMobileMenu ? '#FFFF77' : 'rgba(250, 245, 228, 0.9)',
                  boxShadow: showMobileMenu ? '0 0 6px rgba(255, 255, 119, 0.5)' : 'none',
                }}
                animate={{ rotate: showMobileMenu ? -45 : 0, y: showMobileMenu ? -7 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>
        </motion.button>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence mode="wait">
        {showMobileMenu && isMobile && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60"
              style={{ zIndex: 100010 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              ref={mobileMenuRef}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-[320px] flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                zIndex: 100011,
                background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.3) 0%, rgba(2, 27, 71, 0.2) 50%, rgba(2, 27, 71, 0.1) 100%)',
                backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: `
                  0 8px 32px 0 rgba(0, 0, 0, 0.37),
                  inset 0 2px 4px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1),
                  0 0 80px rgba(2, 27, 71, 0.5)
                `,
              }}
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMobileMenu(false)
                }}
                className="absolute top-4 right-4 rounded-full transition-all flex items-center justify-center hover:bg-white/20"
                style={{
                  background: 'rgba(250, 245, 228, 0.1)',
                  border: '1px solid rgba(250, 245, 228, 0.2)',
                  width: '40px',
                  height: '40px',
                  zIndex: 100020,
                  cursor: 'pointer',
                }}
                aria-label="Close menu"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="rgba(250, 245, 228, 0.9)" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="flex-1 overflow-y-auto p-6 pt-20" style={{ 
                paddingBottom: '80px',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y',
                scrollBehavior: 'smooth'
              }}>
                {/* Mobile SVG Ticker - Minimal Style */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl" style={{
                    border: '1px solid rgba(255, 255, 119, 0.2)',
                    whiteSpace: 'nowrap',
                  }}>
                      {loadingStock ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-pulse">
                            <div className="h-4 bg-white/20 rounded w-16"></div>
                          </div>
                          <div className="animate-pulse">
                            <div className="h-5 bg-white/20 rounded w-20"></div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Status Indicator */}
                          <div className="relative">
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: stockData ? '#77FF77' : 'rgba(255, 255, 255, 0.4)',
                              boxShadow: stockData ? '0 0 8px rgba(119, 255, 119, 0.8)' : 'none',
                            }}></div>
                            {stockData && (
                              <div className="absolute inset-0 animate-ping" style={{
                                borderRadius: '50%',
                                background: 'rgba(119, 255, 119, 0.4)',
                              }}></div>
                            )}
                          </div>
                          
                          {/* Symbol */}
                          <span style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: "'Switzer Variable', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}>
                            TSX-V: TUO
                          </span>
                          
                          {/* Price */}
                          <span style={{
                            color: '#FFFFFF',
                            fontSize: '18px',
                            fontWeight: 600,
                            fontFamily: "'Switzer Variable', sans-serif",
                            textShadow: '0 0 8px rgba(255, 255, 119, 0.3)',
                          }}>
                            ${stockData?.price ? (stockData.price % 0.01 === 0 ? stockData.price.toFixed(2) : stockData.price.toFixed(3)) : '--'}
                          </span>
                          
                          {/* Change */}
                          {stockData && stockData.changePercent !== 0 && (
                            <div className="flex items-center gap-0.5">
                              {stockData.changePercent > 0 ? (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#77FF77" strokeWidth="3">
                                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF7777" strokeWidth="3">
                                  <path d="M7 7L17 17M7 17H17M7 17V7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                              <span style={{
                                color: stockData.changePercent > 0 ? '#77FF77' : '#FF7777',
                                fontSize: '11px',
                                fontFamily: "'Switzer Variable', sans-serif",
                                fontWeight: 500,
                              }}>
                                ({stockData.changePercent > 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </div>
                
                <nav className="space-y-3">
                  {/* Main Navigation Items */}
                  <a
                    href="#about"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowMobileMenu(false)
                    }}
                    style={{
                      background: 'rgba(250, 245, 228, 0.05)',
                      border: '1px solid rgba(250, 245, 228, 0.1)',
                      color: 'rgba(250, 245, 228, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                    }}
                  >
                    About
                  </a>
                  
                  <AnimatePresence mode="wait">
                    {!showProjectsSubmenu ? (
                      <motion.a
                        key="projects-button"
                        href="#projects"
                        className="block py-3 px-4 rounded-2xl transition-all"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                          e.preventDefault()
                          setShowProjectsSubmenu(true)
                        }}
                        style={{
                          background: 'rgba(250, 245, 228, 0.05)',
                          border: '1px solid rgba(250, 245, 228, 0.1)',
                          color: 'rgba(250, 245, 228, 0.9)',
                          fontFamily: "'Switzer Variable', sans-serif",
                          fontSize: '16px',
                        }}
                      >
                        Properties
                      </motion.a>
                    ) : (
                      <motion.div
                        key="projects-split"
                        className="flex gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <button
                          className="flex-1 py-3 px-3 rounded-2xl transition-all flex items-center justify-center gap-1.5"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowMobileMenu(false)
                            setShowProjectsSubmenu(false)
                            setShowPropertyModal(true)
                          }}
                          style={{
                            background: 'rgba(255, 255, 119, 0.1)',
                            border: '1px solid rgba(255, 255, 119, 0.2)',
                            color: '#FFFF77',
                            fontFamily: "'Switzer Variable', sans-serif",
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>Interactive Map</span>
                        </button>
                        
                        <button
                          className="flex-1 py-3 px-3 rounded-2xl transition-all flex items-center justify-center gap-1.5"
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.href = '/properties'
                          }}
                          style={{
                            background: 'rgba(255, 255, 119, 0.1)',
                            border: '1px solid rgba(255, 255, 119, 0.2)',
                            color: '#FFFF77',
                            fontFamily: "'Switzer Variable', sans-serif",
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 11H3M21 11h-6M12 11v6M12 11V5M12 11l4.24-4.24M12 11L7.76 6.76M12 11l4.24 4.24M12 11L7.76 15.24" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>Comprehensive</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <a
                    href="#investors"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowMobileMenu(false)
                    }}
                    style={{
                      background: 'rgba(250, 245, 228, 0.05)',
                      border: '1px solid rgba(250, 245, 228, 0.1)',
                      color: 'rgba(250, 245, 228, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                    }}
                  >
                    Investors
                  </a>
                  
                  <a
                    href="#news"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowMobileMenu(false)
                    }}
                    style={{
                      background: 'rgba(250, 245, 228, 0.05)',
                      border: '1px solid rgba(250, 245, 228, 0.1)',
                      color: 'rgba(250, 245, 228, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                    }}
                  >
                    News
                  </a>
                  
                  <a
                    href="#contact"
                    className="block py-3 px-4 rounded-2xl transition-all"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowMobileMenu(false)
                    }}
                    style={{
                      background: 'rgba(250, 245, 228, 0.05)',
                      border: '1px solid rgba(250, 245, 228, 0.1)',
                      color: 'rgba(250, 245, 228, 0.9)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '16px',
                    }}
                  >
                    Contact
                  </a>
                </nav>
                
              </div>
              
              {/* Contact Information - Fixed at bottom (hidden on iPhone SE) */}
              {window.innerWidth >= 390 && (
                <div className="p-6" style={{
                  paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
                }}>
                  <div className="space-y-2" style={{
                    borderTop: '1px solid rgba(250, 245, 228, 0.1)',
                    paddingTop: '16px',
                  }}>
                    <h3 style={{
                      color: '#FFFF77',
                      fontFamily: "'Aeonik Extended', sans-serif",
                      fontSize: '16px',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      marginBottom: '12px',
                    }}>
                      LUXOR METALS LTD.
                    </h3>
                    <p style={{
                      color: 'rgba(250, 245, 228, 0.7)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '14px',
                      lineHeight: 1.5,
                    }}>
                      2130 Crescent Road<br />
                      Victoria, BC, V8S 2H3
                    </p>
                    <p style={{
                      color: 'rgba(250, 245, 228, 0.7)',
                      fontFamily: "'Switzer Variable', sans-serif",
                      fontSize: '14px',
                      lineHeight: 1.5,
                      marginTop: '8px',
                    }}>
                      778-430-5680
                    </p>
                    <a 
                      href="mailto:info@luxormetals.com"
                      style={{
                        color: '#FFFF77',
                        fontFamily: "'Switzer Variable', sans-serif",
                        fontSize: '14px',
                        lineHeight: 1.5,
                        textDecoration: 'none',
                        display: 'inline-block',
                        marginTop: '4px',
                      }}
                    >
                      info@luxormetals.com
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>


      {/* Mobile Property Modal */}
      <AnimatePresence>
        {showPropertyModal && isMobile && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[100003]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPropertyModal(false)}
            />
            <motion.div
              ref={propertyModalRef}
              className="fixed left-0 right-0 z-[100004] rounded-t-3xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                bottom: '64px', // Height of bottom navigation
                maxHeight: 'calc(100vh - 120px)', // Allow modal to extend higher
                paddingBottom: 'env(safe-area-inset-bottom)',
                background: 'linear-gradient(135deg, rgba(2, 27, 71, 0.25) 0%, rgba(2, 27, 71, 0.15) 50%, rgba(2, 27, 71, 0.08) 100%)',
                backdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%) brightness(1.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: `
                  0 -8px 32px 0 rgba(0, 0, 0, 0.37),
                  inset 0 2px 4px 0 rgba(255, 255, 255, 0.2),
                  inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)
                `,
                borderBottom: 'none',
              }}
            >
              {/* Swipe handle indicator */}
              <div className="w-full flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-white/20 rounded-full" />
              </div>
              
              <div className="p-6 pt-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 style={{
                    color: '#FFFF77',
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontWeight: 600,
                    fontSize: '18px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}>
                    Select Property
                  </h3>
                  <button
                    onClick={() => setShowPropertyModal(false)}
                    className="p-2"
                  >
                    <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'FIJI', hectares: '2,500 Ha' },
                    { name: 'TONGA', hectares: '1,800 Ha' },
                    { name: 'RAM', hectares: '3,200 Ha' },
                    { name: 'CLONE', hectares: '2,100 Ha' },
                    { name: 'KONKIN SILVER', hectares: '4,500 Ha' },
                    { name: 'MIDAS', hectares: '1,900 Ha' },
                  ].map((property) => (
                    <button
                      key={property.name}
                      className="w-full p-4 rounded-xl text-left transition-all"
                      onClick={() => {
                        setShowPropertyModal(false)
                        
                        // Special handling for RAM - open drone view (matching RAM exploration button exactly)
                        if (property.name === 'RAM') {
                          console.log('Mobile RAM button clicked - triggering drone view')
                          // Zoom to RAM property with better view
                          if (map.current) {
                            // Enhanced zoom to RAM drilling area with offset for split-screen
                            // Center on actual drilling zones and pads from GeoJSON data
                            const drillingCenter: [number, number] = [-129.768, 55.897] // Center of Malachite and Mitch zones
                            const zoomLevel = 14.85 // Same as RAM exploration button
                            // Move the map viewport northeast to position drilling zones optimally
                            const offsetLng = isMobile ? 0 : -0.0025 // 2.5% west offset
                            const offsetLat = isMobile ? 0 : -0.0065 // 6.5% south offset
                            
                            // Start fade out immediately
                            updateShowSplitScreen(true)
                            
                            // First do the zoom (matching RAM exploration button parameters exactly)
                            map.current.flyTo({
                              center: [drillingCenter[0] + offsetLng, drillingCenter[1] + offsetLat] as [number, number],
                              zoom: zoomLevel, // Closer zoom for better detail
                              duration: 3000, // Smoother transition
                              pitch: 55, // Better angle for terrain (same as exploration button)
                              bearing: -45, // Angled view for depth (same as exploration button)
                              curve: 1.2 // Smoother flight path
                            })
                            
                            // Show drone video and enable features after zoom completes
                            setTimeout(() => {
                              // Show drone video player
                              setShowDroneVideo(true)
                              
                              // Automatically enable drill targets and geological zones (same as exploration button)
                              setRamFeatures(prev => ({
                                ...prev,
                                drillTargets: true,
                                geologicalStructures: true
                              }))
                              
                              // Toggle the features on the map
                              toggleRamFeature('drillTargets', true)
                              toggleRamFeature('geologicalStructures', true)
                            }, 3000) // Wait for map zoom to complete
                          }
                          return
                        }
                        
                        // Same property selection logic as desktop for other properties
                        if (!map.current || !LUXOR_BOUNDARIES) return
                        
                        updateSelectedProperty(property.name)
                        setIsTransitioning(true)
                        
                        // Hide all property markers and labels when zooming
                        const mainMarkers = document.querySelectorAll('.property-marker-main')
                        const markers = document.querySelectorAll('.property-marker-icon')
                        const labels = document.querySelectorAll('.property-label')
                        mainMarkers.forEach((marker) => {
                          (marker as HTMLElement).style.opacity = '0'
                        })
                        markers.forEach((marker) => {
                          (marker as HTMLElement).style.opacity = '0'
                        })
                        labels.forEach((label) => {
                          (label as HTMLElement).style.opacity = '0'
                        })
                        
                        const propertyFeature = LUXOR_BOUNDARIES.features.find(
                          (f: any) => f.properties.name === property.name
                        )
                        
                        if (propertyFeature) {
                          const bounds = new mapboxgl.LngLatBounds()
                          
                          if (propertyFeature.geometry.type === 'Polygon') {
                            propertyFeature.geometry.coordinates[0].forEach((coord: number[]) => {
                              bounds.extend([coord[0], coord[1]])
                            })
                          } else if (propertyFeature.geometry.type === 'MultiPolygon') {
                            propertyFeature.geometry.coordinates.forEach((polygon: number[][][]) => {
                              polygon[0].forEach((coord: number[]) => {
                                bounds.extend([coord[0], coord[1]])
                              })
                            })
                          }
                          
                          const center = bounds.getCenter()
                          const ne = bounds.getNorthEast()
                          const sw = bounds.getSouthWest()
                          const latDiff = Math.abs(ne.lat - sw.lat)
                          const lngDiff = Math.abs(ne.lng - sw.lng)
                          const maxDiff = Math.max(latDiff, lngDiff)
                          
                          // Mobile gets less zoom
                          let zoom = 12.5
                          if (maxDiff > 0.1) zoom = 10.5
                          else if (maxDiff > 0.05) zoom = 11.5
                          else if (maxDiff > 0.02) zoom = 12
                          
                          // Mobile centers normally
                          const propertyNameForFilter = property.name
                          
                          const propertyFilter = ['==', ['get', 'name'], propertyNameForFilter]
                          
                          // Remove existing highlights
                          const highlightLayers = ['property-highlight-fill', 'property-highlight-glow', 'property-highlight-outline']
                          highlightLayers.forEach(layerId => {
                            if (map.current!.getLayer(layerId)) {
                              map.current!.removeLayer(layerId)
                            }
                          })
                          
                          // Dim non-selected properties by reducing opacity
                          setTimeout(() => {
                            console.log('Applying dimming effect for property:', propertyNameForFilter)
                            console.log('Filter:', propertyFilter)
                            
                            if (map.current!.getLayer('luxor-properties-fill')) {
                              console.log('Setting fill opacity')
                              map.current!.setPaintProperty('luxor-properties-fill', 'fill-opacity', [
                                'case',
                                propertyFilter,
                                0.7, // Selected property keeps high opacity
                                0.2  // Other properties dimmed
                              ])
                            } else {
                              console.log('luxor-properties-fill layer not found')
                            }
                            
                            if (map.current!.getLayer('luxor-properties-outline')) {
                              console.log('Setting outline opacity')
                              map.current!.setPaintProperty('luxor-properties-outline', 'line-opacity', [
                                'case',
                                propertyFilter,
                                1,    // Selected property keeps full opacity
                                0.25   // Other properties at 75% opacity reduction (25% visible)
                              ])
                            } else {
                              console.log('luxor-properties-outline layer not found')
                            }
                          }, 200)
                          
                          // Add pulsing golden glow for selected property
                          try {
                            if (!map.current!.getLayer('property-selected-glow')) {
                              map.current!.addLayer({
                                id: 'property-selected-glow',
                                type: 'line',
                                source: 'luxor-properties',
                                filter: propertyFilter,
                                paint: {
                                  'line-color': '#a0c4ff',
                                  'line-width': 30,
                                  'line-blur': 25,
                                  'line-opacity': 0.4
                                }
                              })
                            }
                          } catch (error) {
                            console.error('Error adding glow layer:', error)
                          }
                          
                          // Start gentle pulsing animation
                          let pulsePhase = 0
                          const pulseInterval = setInterval(() => {
                            pulsePhase = (pulsePhase + 0.03) % (Math.PI * 2)
                            const glowOpacity = 0.3 + Math.sin(pulsePhase) * 0.2  // Varies from 0.1 to 0.5
                            const glowWidth = 25 + Math.sin(pulsePhase) * 15  // Varies from 10 to 40
                            
                            if (map.current && map.current.getLayer('property-selected-glow')) {
                              map.current.setPaintProperty('property-selected-glow', 'line-opacity', glowOpacity)
                              map.current.setPaintProperty('property-selected-glow', 'line-width', glowWidth)
                            } else {
                              clearInterval(pulseInterval)
                            }
                          }, 50)
                          
                          // Keep terrain enabled for 3D effect
                          if (!map.current.getTerrain() && map.current.getSource('mapbox-dem')) {
                            map.current.setTerrain({ 
                              source: 'mapbox-dem', 
                              exaggeration: 1.3 // Mobile terrain exaggeration
                            })
                          }
                          
                          // Use easeTo for mobile
                          map.current.easeTo({
                            center: [center.lng, center.lat],
                            zoom: zoom,
                            pitch: 45,
                            bearing: -20,
                            duration: 2200,
                            easing: (t: number) => {
                              return t < 0.5
                                ? 4 * t * t * t
                                : 1 - Math.pow(-2 * t + 2, 3) / 2
                            }
                          })
                          
                          // Reset transitioning flag after move
                          map.current.once('moveend', () => {
                            // Ensure terrain stays enabled
                            if (!map.current!.getTerrain() && map.current!.getSource('mapbox-dem')) {
                              map.current!.setTerrain({ 
                                source: 'mapbox-dem', 
                                exaggeration: 1.3 // Mobile terrain exaggeration
                              })
                            }
                            setIsTransitioning(false)
                            
                            // Show markers and labels after zoom completes with a short delay
                            setTimeout(() => {
                              const mainMarkers = document.querySelectorAll('.property-marker-main')
                              const markers = document.querySelectorAll('.property-marker-icon')
                              const labels = document.querySelectorAll('.property-label')
                              mainMarkers.forEach((marker) => {
                                (marker as HTMLElement).style.opacity = '1'
                              })
                              markers.forEach((marker) => {
                                (marker as HTMLElement).style.opacity = '1'
                              })
                              labels.forEach((label) => {
                                (label as HTMLElement).style.opacity = '1'
                              })
                            }, 300)
                          })
                        }
                      }}
                      style={{
                        background: selectedProperty === property.name 
                          ? 'rgba(255, 255, 119, 0.1)' 
                          : 'rgba(250, 245, 228, 0.05)',
                        border: selectedProperty === property.name
                          ? '1px solid rgba(255, 255, 119, 0.3)'
                          : '1px solid rgba(250, 245, 228, 0.1)',
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span style={{
                          color: selectedProperty === property.name ? '#FFFF77' : 'rgba(250, 245, 228, 0.9)',
                          fontFamily: "'Aeonik Extended', sans-serif",
                          fontWeight: 500,
                          fontSize: '16px',
                          letterSpacing: '0.02em',
                        }}>
                          {property.name}
                        </span>
                        <span style={{
                          color: 'rgba(250, 245, 228, 0.6)',
                          fontFamily: "'Switzer Variable', sans-serif",
                          fontSize: isMobile ? '11px' : '14px',
                        }}>
                          {property.hectares}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Navigation - Disabled */}

      
      {/* Return to Overview Button - Show only in drone view */}
      {showSplitScreen && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={() => {
            updateShowSplitScreen(false)
            setShowDroneVideo(false)
            // Clean up all RAM features when closing
            Object.keys(ramFeatures).forEach((featureKey) => {
              if (ramFeatures[featureKey as keyof typeof ramFeatures]) {
                toggleRamFeature(featureKey as keyof typeof ramFeatures, false)
              }
            })
            // Reset all features to false
            setRamFeatures({
              drillTargets: false,
              geologicalStructures: false,
              historicalData: false,
              terrainAnalysis: false,
              accessRoutes: false
            })
            // Return map to original Teuton overview with proper centering
            if (map.current) {
              if (isMobile) {
                // Use fitMobileOverviewBounds for mobile
                fitMobileOverviewBounds()
              } else {
                // Desktop: Use the same calculated center as initial load
                const luxorLat = 55.827
                const luxorLng = -129.653
                const majorDepositsAvgLat = 55.827
                const majorDepositsAvgLng = -129.653
                const centerLat = luxorLat * 0.6 + majorDepositsAvgLat * 0.4
                const centerLng = luxorLng * 0.6 + majorDepositsAvgLng * 0.4
                const adjustedCenterLng = centerLng - 0.186 + 0.04 - 0.013 - 0.026 + 0.025 // Added same 3% east adjustment as Overview button
                const adjustedCenterLat = centerLat - 0.04 - 0.025 - 0.0056 - 0.0112 + 0.0056 + 0.0112 - 0.025 // Added same 3% south adjustment as Overview button
                
                map.current.flyTo({
                  center: [adjustedCenterLng, adjustedCenterLat],
                  zoom: 10.3,
                  pitch: 45,
                  bearing: -25,
                  duration: 2000,
                  curve: 1.5
                })
              }
            }
          }}
          className="absolute z-[210]"
          style={{
            bottom: '2rem',
            right: '10rem', // Moved even further left to avoid compass overlap
            // Match Explore Property button styling
            background: `linear-gradient(135deg, 
              rgba(255, 190, 152, 0.9) 0%, 
              rgba(255, 190, 152, 0.8) 30%,
              rgba(254, 217, 146, 0.7) 70%,
              rgba(255, 190, 152, 0.85) 100%)`,
            backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
            WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px', // Full rounded like Explore button
            padding: '14px 28px', // Match Explore button padding
            color: '#0d0f1e', // Dark text like Explore button
            fontSize: '16px', // Match Explore button size
            fontFamily: "'Aeonik', sans-serif",
            fontWeight: 500,
            letterSpacing: '0.03em',
            textTransform: 'none', // Remove uppercase
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px' // Match Explore button gap
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)' // Match Explore button hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#0d0f1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Return to Overview
        </motion.button>
      )}
      
      {/* Original Mobile Navigation - Hidden for now */}
      {false && isMobile && (
        <MobileNav
          currentView={showPropertyModal ? 'properties' : showInfoBox ? 'info' : 'overview'}
          onOverviewClick={() => {
            setCurrentView('overview')
            updateSelectedProperty(null)
          setShowPropertyModal(false)
          setShowInfoBox(false)
          setIsTransitioning(true)
          
          // Clean up RAM features if they're enabled
          if (ramFeatures.drillTargets || ramFeatures.geologicalStructures) {
            // Disable all RAM features
            Object.keys(ramFeatures).forEach((featureKey) => {
              if (ramFeatures[featureKey as keyof typeof ramFeatures]) {
                toggleRamFeature(featureKey as keyof typeof ramFeatures, false)
              }
            })
            // Reset all features to false
            setRamFeatures({
              drillTargets: false,
              geologicalStructures: false,
              historicalData: false,
              terrainAnalysis: false,
              accessRoutes: false
            })
          }
          
          if (map.current) {
            // Reset property opacity
            if (map.current.getLayer('luxor-properties-fill')) {
              map.current.setPaintProperty('luxor-properties-fill', 'fill-opacity', 0.6)
            }
            if (map.current.getLayer('luxor-properties-outline')) {
              map.current.setPaintProperty('luxor-properties-outline', 'line-opacity', 1)
            }
            
            // Remove selected property glow
            if (map.current.getLayer('property-selected-glow')) {
              map.current.removeLayer('property-selected-glow')
            }
            
            // Ensure terrain is enabled
            if (!map.current.getTerrain() && map.current.getSource('mapbox-dem')) {
              map.current.setTerrain({ 
                source: 'mapbox-dem', 
                exaggeration: 1.3 // Mobile terrain exaggeration
              })
            }
            
            fitMobileOverviewBounds()
            
            // Reset transitioning flag after move
            map.current.once('moveend', () => {
              // Ensure terrain stays enabled
              if (!map.current!.getTerrain() && map.current!.getSource('mapbox-dem')) {
                map.current!.setTerrain({ 
                  source: 'mapbox-dem', 
                  exaggeration: 1.3 // Mobile terrain exaggeration
                })
              }
              setIsTransitioning(false)
            })
          }
        }}
        onPropertiesClick={() => {
          if (showPropertyModal) {
            setShowPropertyModal(false)
            setCurrentView('overview')
          } else {
            setCurrentView('properties')
            setShowPropertyModal(true)
            setShowInfoBox(false)
          }
        }}
        onInfoClick={() => {
          // Red Line info box removed - button does nothing now
          // Could potentially show the Red Line on the map or provide other functionality
        }}
        onRamClick={() => {
          // Handle RAM property zoom - same as desktop button
          if (map.current) {
            setCurrentView('ram')
            setShowPropertyModal(false)
            setShowInfoBox(false)
            
            // Set selected property
            updateSelectedProperty('RAM')
            
            // Hide all property markers and labels when zooming
            const mainMarkers = document.querySelectorAll('.property-marker-main')
            const markers = document.querySelectorAll('.property-marker-icon')
            const labels = document.querySelectorAll('.property-label')
            mainMarkers.forEach((marker) => {
              (marker as HTMLElement).style.opacity = '0'
            })
            markers.forEach((marker) => {
              (marker as HTMLElement).style.opacity = '0'
            })
            labels.forEach((label) => {
              (label as HTMLElement).style.opacity = '0'
            })
            
            // Use the same zoom location as drone view
            const drillingCenter: [number, number] = [-129.768, 55.897]
            const zoomLevel = 14.85
            const offsetLng = window.innerWidth < 768 ? 0 : -0.0025
            const offsetLat = window.innerWidth < 768 ? 0 : -0.0065
            
            map.current.flyTo({
              center: [drillingCenter[0] + offsetLng, drillingCenter[1] + offsetLat] as [number, number],
              zoom: zoomLevel,
              duration: 2500,
              pitch: 55,
              bearing: -45,
              curve: 1.3
            })
            
            // Show property modal and enable zone labels after zoom
            setTimeout(() => {
              setShowPropertyModal(true)
              // Enable zone labels
              setRamFeatures(prev => ({
                ...prev,
                drillTargets: true,
                geologicalStructures: true
              }))
              toggleRamFeature('drillTargets', true)
              toggleRamFeature('geologicalStructures', true)
            }, 2500)
          }
        }}
        />
      )}

      
      {/* Device Orientation Permission Prompt */}
      <AnimatePresence>
        {showOrientationPrompt && isMobile && !orientationPermissionGranted && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed left-4 right-4"
            style={{
              bottom: '96px', // Above mobile nav
              maxWidth: '400px',
              margin: '0 auto',
              left: '1rem',
              right: '1rem',
              zIndex: 100010,
              pointerEvents: 'auto',
              isolation: 'isolate' // Create new stacking context
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.9) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 119, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 119, 0.1)',
                pointerEvents: 'auto',
                touchAction: 'manipulation'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3
                  style={{
                    fontFamily: "'Aeonik Extended', sans-serif",
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#FFFF77',
                    letterSpacing: '0.02em',
                    margin: 0,
                  }}
                >
                  Enable Motion & 3D Effects
                </h3>
                <button
                  onClick={() => setShowOrientationPrompt(false)}
                  className="text-white/60 hover:text-white/90 transition-colors"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '0',
                    marginTop: '-4px',
                    marginRight: '-4px',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ×
                </button>
              </div>
              <p
                style={{
                  fontFamily: "'Switzer Variable', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(250, 245, 228, 0.8)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                Allow access to device motion for an enhanced 3D experience with gyroscopic map movements and interactive effects.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Enable Motion clicked');
                    requestOrientationPermission();
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FFFF77 0%, #FFD700 100%)',
                    color: '#111',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontFamily: "'Aeonik Medium', sans-serif",
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    flex: 1,
                    transition: 'all 0.2s ease',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: '48px', // Increased touch target
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 100011, // Higher than parent
                    userSelect: 'none'
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Enable Motion button touched');
                    // Visual feedback
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log('Enable Motion touch end');
                    // Reset visual feedback
                    e.currentTarget.style.transform = 'scale(1)';
                    requestOrientationPermission();
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Enable Motion
                </button>
                <button
                  onClick={() => setShowOrientationPrompt(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(250, 245, 228, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontFamily: "'Aeonik Medium', sans-serif",
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                    minHeight: '44px', // iOS minimum touch target
                    pointerEvents: 'auto',
                    position: 'relative',
                    zIndex: 1
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    console.log('Not Now button touched');
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowOrientationPrompt(false);
                  }}
                >
                  Not Now
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drone Video Modal - WITH BOTTOM NAVIGATION BAR */}
      <AnimatePresence>
        {showDroneVideo && (
          <motion.div
            className="fixed drone-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut"
            }}
            style={{ 
              left: '2%',
              top: '130px',
              bottom: '4%',
              width: isMobile ? '96%' : '46%',
              background: 'rgba(0, 0, 0, 0.9)',
              borderRadius: '16px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              position: 'fixed',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Video Container */}
            <div style={{
              flex: 1,
              position: 'relative',
              borderRadius: '14px 14px 0 0',
              overflow: 'hidden'
            }}>
              {/* Using Mux for drone videos */}
              <MuxDroneVideo 
                playbackId={activeVideoIndex === 0 ? MUX_DRONE_PLAYBACK_IDS.drone1 : MUX_DRONE_PLAYBACK_IDS.drone2}
                title={activeVideoIndex === 0 ? 'RAM Property Drone Footage - View 1' : 'RAM Property Drone Footage - View 2'}
                className="w-full h-full"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1
                }}
              />

              {/* Loading Animation */}
              {videoLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px'
                  }}>
                    {/* Spinning Loader */}
                    <div 
                      style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid rgba(255, 255, 119, 0.3)',
                        borderTop: '3px solid #FFFF77',
                        borderRadius: '50%',
                        animation: 'spin 2s linear infinite'
                      }}
                    ></div>
                    
                    {/* Loading Text */}
                    <div style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontFamily: "'Aeonik Medium', sans-serif",
                      fontWeight: 500,
                      letterSpacing: '0.5px'
                    }}>
                      Loading Drone Video...
                    </div>
                  </div>
                </div>
              )}


            </div>

            {/* Bottom Navigation Bar */}
            <div style={{
              height: '80px',
              background: 'linear-gradient(135deg, rgba(17, 17, 17, 0.98) 0%, rgba(17, 17, 17, 0.95) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(255, 255, 119, 0.2)',
              borderTop: '1px solid rgba(255, 255, 119, 0.3)',
              borderRadius: '0 0 14px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              gap: '20px'
            }}>
              {/* Video Selector (Center) */}
              <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}>
                {[
                  { num: 1, name: 'Ram Drone #1' },
                  { num: 2, name: 'Ram Drone #2' }
                ].map((video) => (
                  <button
                    key={video.num}
                    onClick={() => {
                      // Simply switch the active video index
                      // MuxDroneVideo will handle the playback change
                      setActiveVideoIndex(video.num - 1)
                    }}
                    style={{
                      padding: '8px 16px',
                      background: activeVideoIndex === video.num - 1 
                        ? 'linear-gradient(135deg, rgba(255, 255, 119, 0.3) 0%, rgba(255, 255, 119, 0.15) 100%)'
                        : 'rgba(0, 0, 0, 0.5)',
                      border: activeVideoIndex === video.num - 1
                        ? '1px solid rgba(255, 255, 119, 0.5)'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: activeVideoIndex === video.num - 1 ? '#FFFF77' : 'rgba(255, 255, 255, 0.8)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: "'Aeonik Medium', sans-serif",
                      fontWeight: 500,
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {video.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}
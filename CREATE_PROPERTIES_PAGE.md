# Create Properties Page and Remove Projects Page

## Overview
Create a new Properties page showing Silver Grail's 7 properties, delete the Projects page entirely, and update all navigation to point to Properties instead of Projects.

## Step 1: Delete Projects Page
```bash
# Delete the entire projects folder
rm -rf /Users/roman/claude/silvergrail/app/projects
```

## Step 2: Create Properties Page Structure

### Create `/app/properties/page.tsx`:
```tsx
'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { PropertiesHero } from '@/components/sections/PropertiesHero'
import { PropertiesMap } from '@/components/sections/PropertiesMap'
import { PropertiesList } from '@/components/sections/PropertiesList'

// Lazy load for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

export default function PropertiesPage() {
  return (
    <div 
      className="min-h-screen pt-24 md:pt-40 pb-8 relative" 
      style={{ 
        backgroundColor: '#073440',
        isolation: 'isolate' 
      }} 
      data-theme="dark"
    >
      {/* Immediate background color layer */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ backgroundColor: '#073440' }}
        aria-hidden="true"
      />
      
      {/* Background map with subtle ocean effect */}
      <BackgroundMap />
      
      {/* Subtle gold dust particles effect */}
      <GoldDustParticles />
      
      <div className="relative z-10">
        <PropertiesHero />
        <PropertiesMap />
        <PropertiesList />
      </div>
    </div>
  )
}
```

## Step 3: Create Properties Components

### Create `/components/sections/PropertiesHero.tsx`:
```tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export function PropertiesHero() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient from-gold-500 to-gold-700">
              Our Properties
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Seven strategic properties in British Columbia's premier mining district
          </p>
        </motion.div>
      </div>
    </section>
  )
}
```

### Create `/components/sections/PropertiesMap.tsx`:
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motion } from 'framer-motion'

// Initialize Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

const properties = [
  {
    id: 'fiji',
    name: 'FIJI',
    coordinates: [-130.041, 56.165],
    description: 'High-grade silver target with historic workings showing exceptional mineralization potential.',
    minerals: ['Silver', 'Lead', 'Zinc'],
    status: 'Exploration'
  },
  {
    id: 'tonga',
    name: 'TONGA',
    coordinates: [-130.056, 56.158],
    description: 'Strategic property adjacent to major discoveries with strong geological indicators.',
    minerals: ['Silver', 'Gold', 'Copper'],
    status: 'Early Exploration'
  },
  {
    id: 'ram',
    name: 'RAM',
    coordinates: [-130.028, 56.172],
    description: 'Advanced exploration target with multiple mineralized zones and excellent infrastructure access.',
    minerals: ['Silver', 'Gold'],
    status: 'Advanced Exploration'
  },
  {
    id: 'clone',
    name: 'CLONE',
    coordinates: [-130.063, 56.151],
    description: 'Prospective ground with similar geology to nearby producing mines.',
    minerals: ['Silver', 'Copper', 'Gold'],
    status: 'Target Definition'
  },
  {
    id: 'konkin-silver',
    name: 'KONKIN SILVER',
    coordinates: [-130.035, 56.168],
    description: 'Named after renowned geologist, this property shows significant silver mineralization.',
    minerals: ['Silver', 'Gold'],
    status: 'Discovery'
  },
  {
    id: 'midas',
    name: 'MIDAS',
    coordinates: [-130.048, 56.161],
    description: 'High-potential property with the "Midas touch" - everything here turns to value.',
    minerals: ['Gold', 'Silver', 'Copper'],
    status: 'Exploration'
  },
  {
    id: 'gold-mountain',
    name: 'GOLD MOUNTAIN',
    coordinates: [-130.052, 56.155],
    description: 'True to its name, this property hosts significant gold mineralization with silver credits.',
    minerals: ['Gold', 'Silver'],
    status: 'Development'
  }
]

export function PropertiesMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-130.045, 56.161],
      zoom: 11,
      pitch: 45,
      bearing: -15
    })

    map.current.on('load', () => {
      // Add 3D terrain
      map.current!.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      })
      map.current!.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      // Add property markers
      properties.forEach(property => {
        const el = document.createElement('div')
        el.className = 'property-marker'
        el.innerHTML = `
          <div class="marker-content">
            <div class="marker-pin"></div>
            <div class="marker-label">${property.name}</div>
          </div>
        `
        
        el.addEventListener('click', () => {
          setSelectedProperty(property.id)
          map.current!.flyTo({
            center: property.coordinates as [number, number],
            zoom: 13,
            pitch: 60,
            bearing: 0,
            duration: 2000
          })
        })

        new mapboxgl.Marker(el)
          .setLngLat(property.coordinates as [number, number])
          .addTo(map.current!)
      })
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            <span className="text-white">Interactive </span>
            <span className="text-gradient from-gold-500 to-gold-700">Property Map</span>
          </h2>
          
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div ref={mapContainer} className="w-full h-[600px]" />
            
            {selectedProperty && (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-xl p-6"
                >
                  {(() => {
                    const property = properties.find(p => p.id === selectedProperty)
                    return property ? (
                      <>
                        <h3 className="text-2xl font-bold text-white mb-2">{property.name}</h3>
                        <p className="text-gray-300 mb-4">{property.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {property.minerals.map(mineral => (
                            <span key={mineral} className="px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-sm">
                              {mineral}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Status</span>
                          <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm">
                            {property.status}
                          </span>
                        </div>
                      </>
                    ) : null
                  })()}
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

### Create `/components/sections/PropertiesList.tsx`:
```tsx
'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiMapPin, FiTrendingUp, FiActivity } from 'react-icons/fi'

const allProperties = [
  {
    id: 'fiji',
    name: 'FIJI',
    location: 'Stewart, BC, Canada',
    status: 'Exploration',
    stage: 'Target Development',
    minerals: ['Silver', 'Lead', 'Zinc'],
    description: 'High-grade silver target with historic workings showing exceptional mineralization potential. Strategic location with year-round access.',
    highlights: [
      'Historic high-grade silver showings',
      'Extensive vein systems identified',
      'Year-round road access',
      'Adjacent to producing mines'
    ],
    size: '845 hectares'
  },
  {
    id: 'tonga',
    name: 'TONGA',
    location: 'Stewart, BC, Canada',
    status: 'Early Exploration',
    stage: 'Geological Mapping',
    minerals: ['Silver', 'Gold', 'Copper'],
    description: 'Strategic property adjacent to major discoveries with strong geological indicators for precious metal mineralization.',
    highlights: [
      'Adjacent to recent discoveries',
      'Favorable geological setting',
      'Multiple mineralized trends',
      'Underexplored potential'
    ],
    size: '1,230 hectares'
  },
  {
    id: 'ram',
    name: 'RAM',
    location: 'Stewart, BC, Canada',
    status: 'Advanced Exploration',
    stage: 'Drilling Ready',
    minerals: ['Silver', 'Gold'],
    description: 'Advanced exploration target with multiple mineralized zones identified through systematic exploration programs.',
    highlights: [
      'Drill-ready targets defined',
      'Multiple mineralized zones',
      'Strong geophysical anomalies',
      'Historic drilling with significant intercepts'
    ],
    size: '2,100 hectares'
  },
  {
    id: 'clone',
    name: 'CLONE',
    location: 'Stewart, BC, Canada',
    status: 'Target Definition',
    stage: 'Geophysical Survey',
    minerals: ['Silver', 'Copper', 'Gold'],
    description: 'Prospective ground with similar geology to nearby producing mines, showing strong potential for discovery.',
    highlights: [
      'Analogous geology to producers',
      'Large alteration footprint',
      'Recent geophysical anomalies',
      'Untested at depth'
    ],
    size: '1,567 hectares'
  },
  {
    id: 'konkin-silver',
    name: 'KONKIN SILVER',
    location: 'Stewart, BC, Canada',
    status: 'Discovery',
    stage: 'New Discovery',
    minerals: ['Silver', 'Gold'],
    description: 'Named after renowned geologist Larry Konkin, this property hosts significant silver mineralization with recent discoveries.',
    highlights: [
      'New high-grade silver discovery',
      'Expanding mineralized footprint',
      'Multiple parallel vein systems',
      'Open in all directions'
    ],
    size: '3,200 hectares'
  },
  {
    id: 'midas',
    name: 'MIDAS',
    location: 'Stewart, BC, Canada',
    status: 'Exploration',
    stage: 'Sampling Program',
    minerals: ['Gold', 'Silver', 'Copper'],
    description: 'High-potential property with the "Midas touch" - recent sampling has returned exceptional precious metal values.',
    highlights: [
      'Exceptional surface samples',
      'Large mineralized system',
      'Multiple target types',
      'Infrastructure proximal'
    ],
    size: '890 hectares'
  },
  {
    id: 'gold-mountain',
    name: 'GOLD MOUNTAIN',
    location: 'Stewart, BC, Canada',
    status: 'Development',
    stage: 'Resource Definition',
    minerals: ['Gold', 'Silver'],
    description: 'True to its name, this property hosts significant gold mineralization with silver credits in a camp-scale system.',
    highlights: [
      'Historic resource defined',
      'Expansion potential identified',
      'Infrastructure in place',
      'Permitted for exploration'
    ],
    size: '4,500 hectares'
  }
]

export function PropertiesList() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient from-gold-500 to-gold-700">
              Property
            </span>{' '}
            <span className="text-white">Portfolio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Seven strategic properties covering 14,432 hectares in British Columbia's Golden Triangle
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {allProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass rounded-2xl p-8 h-full hover:shadow-2xl transition-all duration-300 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-white group-hover:text-gold-400 transition-colors">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiMapPin className="w-4 h-4" />
                        {property.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiActivity className="w-4 h-4" />
                        {property.size}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    property.status === 'Development'
                      ? 'bg-gold-500/20 text-gold-300'
                      : property.status === 'Discovery'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-primary-500/20 text-primary-300'
                  }`}>
                    {property.status}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-4">
                  {property.description}
                </p>
                
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <FiTrendingUp className="w-4 h-4 text-gold-400" />
                  <span className="text-gray-400">Stage:</span>
                  <span className="text-white font-medium">{property.stage}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.minerals.map((mineral) => (
                    <span
                      key={mineral}
                      className="px-3 py-1 bg-white/5 text-gray-300 rounded-full text-sm border border-white/10"
                    >
                      {mineral}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-2 mb-6">
                  {property.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 bg-gold-400 rounded-full" />
                      {highlight}
                    </div>
                  ))}
                </div>
                
                <button className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-lg transition-all duration-300 hover:border-gold-400/50">
                  View Property Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

## Step 4: Add Required Styles

### Add to `/styles/globals.css`:
```css
/* Property Marker Styles */
.property-marker {
  cursor: pointer;
  transition: all 0.3s ease;
}

.property-marker:hover {
  transform: scale(1.1);
}

.marker-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-pin {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.5);
}

.marker-label {
  position: absolute;
  top: -30px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Glass morphism for property cards */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
```

## Step 5: Update All Header Components

### Update `/components/layout/Header.tsx`:
Find the navigation link that points to `/projects` and change it to `/properties`:

```tsx
// BEFORE:
<Link href="/projects" className="...">Projects</Link>

// AFTER:
<Link href="/properties" className="...">Properties</Link>
```

### Update `/components/layout/HeaderLight.tsx`:
```tsx
// BEFORE:
<Link href="/projects" className="...">Projects</Link>

// AFTER:
<Link href="/properties" className="...">Properties</Link>
```

### Update `/components/layout/HeaderLanding.tsx` (if it exists):
```tsx
// BEFORE:
<Link href="/projects" className="...">Projects</Link>

// AFTER:
<Link href="/properties" className="...">Properties</Link>
```

### Update `/components/layout/ConditionalHeader.tsx` (if it exists):
```tsx
// BEFORE:
<Link href="/projects" className="...">Projects</Link>

// AFTER:
<Link href="/properties" className="...">Properties</Link>
```

## Step 6: Update Footer Component

### Update `/components/layout/Footer.tsx`:
```tsx
// BEFORE:
<Link href="/projects" className="...">Projects</Link>

// AFTER:
<Link href="/properties" className="...">Properties</Link>
```

## Step 7: Update Any Other Navigation References

Search the entire codebase for any references to `/projects` and update them to `/properties`:

```bash
# Find all references to /projects
grep -r "'/projects'" . --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"
grep -r '"/projects"' . --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"

# Update each found reference from /projects to /properties
```

## Step 8: Update TypeScript Types (if needed)

If there are any TypeScript interfaces or types that reference "projects", update them to "properties":

```tsx
// BEFORE:
interface ProjectData { ... }
type ProjectStatus = ...

// AFTER:
interface PropertyData { ... }
type PropertyStatus = ...
```

## Verification Checklist

- [ ] Deleted `/app/projects` folder completely
- [ ] Created `/app/properties/page.tsx` with dark ocean theme
- [ ] Created `/components/sections/PropertiesHero.tsx`
- [ ] Created `/components/sections/PropertiesMap.tsx` with interactive Mapbox
- [ ] Created `/components/sections/PropertiesList.tsx` with all 7 properties
- [ ] Updated Header.tsx to link to `/properties`
- [ ] Updated HeaderLight.tsx to link to `/properties`
- [ ] Updated HeaderLanding.tsx to link to `/properties` (if exists)
- [ ] Updated ConditionalHeader.tsx to link to `/properties` (if exists)
- [ ] Updated Footer.tsx to link to `/properties`
- [ ] Added property marker styles to globals.css
- [ ] Verified all 7 properties are displayed (FIJI, TONGA, RAM, CLONE, KONKIN SILVER, MIDAS, GOLD MOUNTAIN)
- [ ] Tested interactive map functionality
- [ ] Confirmed dark ocean theme (#073440) is applied
- [ ] Verified BackgroundMap and GoldDustParticles are working
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Navigation works correctly

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `/properties` - should show the new Properties page
3. Try to navigate to `/projects` - should result in 404
4. Click "Properties" in the header - should navigate to Properties page
5. Test the interactive map - clicking properties should zoom in
6. Verify all 7 properties are listed with correct information
7. Check mobile responsiveness
8. Ensure dark ocean theme with map background is consistent

## Important Notes

- The Properties page uses the same dark ocean theme (#073440) as the Investors page
- All 7 Silver Grail properties are included with placeholder descriptions (update with real data when available)
- The interactive map centers on the Stewart, BC area where the properties are located
- Property markers are styled with gold gradient to match the Silver Grail branding
- The page is fully responsive and includes smooth animations
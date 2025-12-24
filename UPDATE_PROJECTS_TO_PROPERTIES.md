# Task: Update Projects Page to Silver Grail Properties

## CRITICAL: Full Implementation Checklist
□ Rename route from /projects to /properties  
□ Update all references from "projects" to "properties"  
□ Replace Luxor properties with Silver Grail properties  
□ Apply consistent theme from investors page  
□ Update navigation links  
□ Test all functionality  

## Silver Grail Properties (from SatellitePropertyMap.tsx)
1. **FIJI** - High-grade gold mineralization near Dolly Varden
2. **TONGA** - Silver target between Dolly Varden and Goliath
3. **RAM** - Large-scale exploration with geophysical anomalies
4. **CLONE** - High-grade gold with porphyry potential
5. **KONKIN SILVER** - High-grade silver similar to Eskay Creek
6. **MIDAS** - Favorable contact zone with VTEM anomalies
7. **GOLD MOUNTAIN** - Gold tellurides adjacent to Red Mountain

## Required Changes (COMPLETE ALL IN ORDER)

### Step 1: Rename Route Folder
**RENAME:**
- `/app/projects/` → `/app/properties/`

### Step 2: Update Properties Page
**REPLACE ENTIRE `/app/properties/page.tsx`:**
```tsx
'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { FiMapPin, FiActivity, FiLayers, FiTrendingUp, FiGrid, FiMap } from 'react-icons/fi'
import Link from 'next/link'

// Lazy load for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

interface Property {
  id: string
  name: string
  location: string
  status: string
  minerals: string[]
  description: string
  highlights: string[]
  coordinates: [number, number]
  size?: string
}

const silverGrailProperties: Property[] = [
  {
    id: 'fiji',
    name: 'FIJI',
    location: 'Stewart District, BC',
    status: 'Advanced Exploration',
    minerals: ['Gold', 'Silver'],
    description: 'High-grade gold-bearing mineralization identified in 2006. Located just west of Dolly Varden Silver\'s Homestake Ridge property along regional trend.',
    highlights: [
      'Two promising zones of high-grade gold',
      'Strategic location near Homestake Ridge',
      'Prospecting success in 2006'
    ],
    coordinates: [-129.6240, 55.7840],
    size: '850 hectares'
  },
  {
    id: 'tonga',
    name: 'TONGA',
    location: 'Stewart District, BC',
    status: 'Early Exploration',
    minerals: ['Silver', 'Gold'],
    description: 'Staked in the 1980\'s due to highly anomalous silver stream geochemistry. High-grade silver and gold bearing float discovered. Located between Dolly Varden\'s Kombi and Goliath\'s Gold Swarm.',
    highlights: [
      'Highly anomalous silver geochemistry',
      'High-grade Ag-Au float samples',
      'Strategic position between major discoveries'
    ],
    coordinates: [-129.6514, 55.6959],
    size: '650 hectares'
  },
  {
    id: 'ram',
    name: 'RAM',
    location: 'Stewart District, BC',
    status: 'Exploration',
    minerals: ['Gold', 'Silver', 'Copper', 'Lead', 'Zinc'],
    description: 'Large-scale exploration property covering prospective volcanic and sedimentary sequences. Multiple geophysical anomalies identified through airborne surveys.',
    highlights: [
      'Multiple geophysical anomalies',
      'Large land package',
      'Significant base and precious metal potential'
    ],
    coordinates: [-129.7050, 55.8750],
    size: '2,200 hectares'
  },
  {
    id: 'clone',
    name: 'CLONE',
    location: 'Stewart District, BC',
    status: 'Advanced Exploration',
    minerals: ['Gold', 'Cobalt', 'Copper', 'Molybdenum'],
    description: 'Features high-grade gold-cobalt shear zones with historical bulk sampling (100 tons @ 4.0 oz/ton gold). Southwest zone shows porphyry potential with Cu-Mo-W-Bi-Au anomalies.',
    highlights: [
      '4.0 oz/ton gold from bulk sample',
      'Porphyry system indicators',
      'Intersected by Kyba\'s "Red Line"'
    ],
    coordinates: [-129.7992, 55.8029],
    size: '1,100 hectares'
  },
  {
    id: 'konkin-silver',
    name: 'KONKIN SILVER',
    location: 'Stewart District, BC',
    status: 'Exploration',
    minerals: ['Silver', 'Lead', 'Zinc'],
    description: 'High-grade silver in massive baritic zones with geology similar to the Eskay Creek precious metal rich VMS deposit, as noted by Ph.D. geologist Ross Sherlock.',
    highlights: [
      'Eskay Creek analogue',
      'Massive baritic zones',
      'High-grade silver showings'
    ],
    coordinates: [-129.801, 55.750],
    size: '450 hectares'
  },
  {
    id: 'midas',
    name: 'MIDAS',
    location: 'Stewart District, BC',
    status: 'Early Exploration',
    minerals: ['Gold', 'Silver'],
    description: 'Located along favorable contact zone, south of Del Norte\'s high-grade "LG" vein. Two prominent airborne VTEM anomalies remain untested.',
    highlights: [
      'Two untested VTEM anomalies',
      'Favorable geological contact',
      'Adjacent to high-grade LG vein'
    ],
    coordinates: [-129.850, 55.720],
    size: '550 hectares'
  },
  {
    id: 'gold-mountain',
    name: 'GOLD MOUNTAIN',
    location: 'Stewart District, BC',
    status: 'Exploration',
    minerals: ['Gold', 'Silver'],
    description: 'Quartz-calcite veinlets over 200x300m area with gold values up to 0.632 oz/ton. Adjoins Ascot\'s Red Mountain property where gold tellurides average 11.5 g/t.',
    highlights: [
      'Gold values up to 0.632 oz/ton',
      'Adjacent to Red Mountain (11.5 g/t Au)',
      'Gold telluride potential'
    ],
    coordinates: [-129.720, 55.680],
    size: '750 hectares'
  }
]

export default function PropertiesPage() {
  const [selectedView, setSelectedView] = useState<'grid' | 'map'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

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
      
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[#E5E5E5] mb-4"
              style={{ fontFamily: "'Aeonik Extended', sans-serif" }}>
            Our Properties
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            Strategic mineral exploration properties in British Columbia's Golden Triangle
          </p>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center gap-2 mb-8"
        >
          <button
            onClick={() => setSelectedView('grid')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedView === 'grid'
                ? 'bg-[#FFFF77]/20 text-[#FFFF77] border border-[#FFFF77]/50'
                : 'bg-black/30 text-white/70 border border-white/20 hover:border-white/40'
            }`}
          >
            <FiGrid /> Grid View
          </button>
          <button
            onClick={() => setSelectedView('map')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
              selectedView === 'map'
                ? 'bg-[#FFFF77]/20 text-[#FFFF77] border border-[#FFFF77]/50'
                : 'bg-black/30 text-white/70 border border-white/20 hover:border-white/40'
            }`}
          >
            <FiMap /> Map View
          </button>
        </motion.div>

        {/* Properties Grid */}
        {selectedView === 'grid' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {silverGrailProperties.map((property, index) => (
              <motion.article
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glassmorphic-card hover:transform hover:scale-[1.02] transition-all cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#E5E5E5] mb-1"
                        style={{ fontFamily: "'Aeonik Extended', sans-serif" }}>
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <FiMapPin className="w-4 h-4" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    property.status === 'Advanced Exploration' 
                      ? 'bg-[#77FF77]/20 text-[#77FF77]'
                      : property.status === 'Exploration'
                      ? 'bg-[#FFFF77]/20 text-[#FFFF77]'
                      : 'bg-white/20 text-white'
                  }`}>
                    {property.status}
                  </span>
                </div>

                {/* Minerals */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.minerals.map(mineral => (
                    <span key={mineral} className="px-2 py-1 bg-white/10 text-white/70 rounded text-xs">
                      {mineral}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm mb-4 line-clamp-3">
                  {property.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2">
                  {property.highlights.slice(0, 2).map((highlight, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <FiTrendingUp className="w-4 h-4 text-[#FFFF77] mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-white/60">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Size */}
                {property.size && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/50">Property Size</span>
                      <span className="text-white font-medium">{property.size}</span>
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Map View */}
        {selectedView === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glassmorphic-card h-[600px] flex items-center justify-center"
          >
            <div className="text-center">
              <FiMap className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60 mb-4">Interactive map view</p>
              <Link href="/">
                <button className="px-6 py-3 bg-[#FFFF77]/20 text-[#FFFF77] border border-[#FFFF77]/50 rounded-lg hover:bg-[#FFFF77]/30 transition-all">
                  View on Main Map
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Property Modal */}
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProperty(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#073440] border border-white/20 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-[#E5E5E5] mb-4"
                  style={{ fontFamily: "'Aeonik Extended', sans-serif" }}>
                {selectedProperty.name}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-1">Location</h3>
                  <p className="text-white">{selectedProperty.location}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-1">Status</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProperty.status === 'Advanced Exploration' 
                      ? 'bg-[#77FF77]/20 text-[#77FF77]'
                      : selectedProperty.status === 'Exploration'
                      ? 'bg-[#FFFF77]/20 text-[#FFFF77]'
                      : 'bg-white/20 text-white'
                  }`}>
                    {selectedProperty.status}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-2">Minerals</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.minerals.map(mineral => (
                      <span key={mineral} className="px-3 py-1 bg-white/10 text-white rounded">
                        {mineral}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-2">Description</h3>
                  <p className="text-white/80">{selectedProperty.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-white/50 mb-2">Key Highlights</h3>
                  <ul className="space-y-2">
                    {selectedProperty.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <FiTrendingUp className="w-4 h-4 text-[#FFFF77] mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {selectedProperty.size && (
                  <div>
                    <h3 className="text-sm font-medium text-white/50 mb-1">Property Size</h3>
                    <p className="text-white font-medium">{selectedProperty.size}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setSelectedProperty(null)}
                className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .glassmorphic-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.05) 50%,
            rgba(255, 255, 255, 0.02) 100%
          );
          backdrop-filter: blur(20px) saturate(180%) brightness(0.9);
          -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(0.9);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 119, 0.1);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.4),
            inset 0 2px 4px 0 rgba(255, 255, 255, 0.05),
            inset 0 -2px 4px 0 rgba(0, 0, 0, 0.2);
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
```

### Step 3: Update Navigation Links
**UPDATE all navigation components that reference `/projects`:**

#### In `/components/layout/Header.tsx`:
**FIND:** `href="/projects"`
**REPLACE WITH:** `href="/properties"`

**FIND:** `Projects`
**REPLACE WITH:** `Properties`

#### In `/components/layout/HeaderLanding.tsx`:
**FIND:** `href="/projects"`
**REPLACE WITH:** `href="/properties"`

**FIND:** `Projects`
**REPLACE WITH:** `Properties`

#### In `/components/layout/HeaderLight.tsx`:
**FIND:** `href="/projects"`
**REPLACE WITH:** `href="/properties"`

**FIND:** `Projects`
**REPLACE WITH:** `Properties`

### Step 4: Delete Old Section Components (if not used elsewhere)
**DELETE these files if they're only used for the old projects page:**
- `/components/sections/ProjectsHero.tsx`
- `/components/sections/ProjectsMap.tsx`
- `/components/sections/ProjectsList.tsx`

### Step 5: Update Metadata
**CREATE `/app/properties/layout.tsx`:**
```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Properties - Silver Grail Resources',
  description: 'Explore our portfolio of strategic mineral exploration properties in British Columbia\'s Golden Triangle.',
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
```

### Step 6: Update Any Links in Other Pages
**SEARCH AND REPLACE in all files:**
- `/projects` → `/properties`
- `ProjectsPage` → `PropertiesPage`
- `Projects` (in navigation context) → `Properties`

### Step 7: Update Footer Links (if applicable)
**In `/components/layout/Footer.tsx`:**
**FIND:** `href="/projects"`
**REPLACE WITH:** `href="/properties"`

**FIND:** `Projects`
**REPLACE WITH:** `Properties`

## Property Data Details

Each property includes:
- **Name**: Official property name
- **Location**: Stewart District, BC
- **Status**: Exploration stage
- **Minerals**: Target commodities
- **Description**: From PROPERTY_DESCRIPTIONS in SatellitePropertyMap
- **Highlights**: Key features and discoveries
- **Coordinates**: For map positioning
- **Size**: Hectares (approximate)

## Testing Checklist
- [ ] Route `/properties` loads correctly
- [ ] All navigation links updated
- [ ] Grid view displays all 7 properties
- [ ] Property cards show correct information
- [ ] Modal opens with detailed information
- [ ] Map view placeholder works
- [ ] Theme matches investor page (dark ocean)
- [ ] Gold particles animate
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Old `/projects` route returns 404

## Styling Notes
- Uses same glassmorphic cards as investor page
- Dark theme with #073440 background
- Gold accent color (#FFFF77)
- White/gray text on dark background
- Consistent with overall site theme

## Future Enhancements
1. **Interactive Map**: Connect to SatellitePropertyMap component
2. **Property Details Pages**: Individual pages for each property
3. **Geological Data**: Add technical reports and assay results
4. **Photo Galleries**: Add property images
5. **Download Section**: Technical reports, maps, presentations

## COPY THIS ENTIRE FILE TO THE OTHER CLAUDE INSTANCE

**Tell the other Claude:**
```
Implement ALL changes from /UPDATE_PROJECTS_TO_PROPERTIES.md.
This will rename Projects to Properties and show Silver Grail's 7 properties.
The page should match the dark ocean theme from the investor page.
```
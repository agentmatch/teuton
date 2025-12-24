# Redesign Properties Page for Silver Grail

## Overview
The existing Properties page shows Luxor Metals properties with their grouped categorization system. We need to redesign it to showcase Silver Grail's 7 properties (FIJI, TONGA, RAM, CLONE, KONKIN SILVER, MIDAS, GOLD MOUNTAIN) with the same design aesthetic but updated data.

## Key Changes Required

### 1. Replace Property Data
Replace the `PROPERTY_GROUPS` array in `/app/properties/page.tsx` with Silver Grail's properties:

```tsx
const SILVER_GRAIL_PROPERTIES: PropertyData[] = [
  {
    name: 'FIJI',
    slug: 'fiji',
    hectares: '2,500',
    type: 'High-Grade Gold Target',
    description: 'Prospecting by Silver Grail-Teuton personnel in 2006 on the Fiji identified two promising zones of high-grade, gold-bearing mineralization in an area lying just west, along regional trend, of the common border with Dolly Varden Silver\'s Homestake Ridge property.',
    highlights: [
      'Two high-grade gold zones identified',
      'Adjacent to Dolly Varden Silver property',
      'Along regional mineralization trend',
      'Prospective for additional discoveries'
    ]
  },
  {
    name: 'TONGA',
    slug: 'tonga',
    hectares: '1,800',
    type: 'Silver-Gold Target',
    description: 'Staked in the 1980\'s because of highly anomalous silver stream geochemistry. High-grade silver and gold bearing float discovered in streams. Situated between Dolly Varden Silver\'s Kombi gold-silver target and Goliath Resources\' Gold Swarm showing.',
    highlights: [
      'Highly anomalous silver stream geochemistry',
      'High-grade Ag-Au bearing float in streams',
      'Strategic location between major targets',
      'Staked based on strong geochemical signatures'
    ]
  },
  {
    name: 'RAM',
    slug: 'ram',
    hectares: '3,200',
    type: 'Large-Scale Exploration',
    description: 'Large-scale exploration property covering prospective volcanic and sedimentary sequences. Multiple geophysical anomalies identified through airborne surveys. Significant base and precious metal potential.',
    highlights: [
      'Prospective volcanic & sedimentary sequences',
      'Multiple geophysical anomalies identified',
      'Airborne survey discoveries',
      'Base and precious metal potential'
    ]
  },
  {
    name: 'CLONE',
    slug: 'clone',
    hectares: '2,100',
    type: 'Multi-Zone Gold Target',
    description: 'Two zones of interest occur on the property. The first, the Main zone, features a number of very high-grade gold and gold-cobalt bearing shear zones (100 tons grading 4.0 oz/ton gold was bulk sampled here). In recent years focus has changed to a southwest zone which appears to lie above a reduced porphyry system, the upper portions of which are anomalous in copper, molybdenum, tungsten, bismuth and gold. This latter area is transected by Kyba\'s "Red Line".',
    highlights: [
      'Main zone: 100 tons @ 4.0 oz/ton Au bulk sample',
      'High-grade gold-cobalt shear zones',
      'Southwest zone: reduced porphyry system',
      'Crossed by Kyba\'s famous "Red Line"'
    ]
  },
  {
    name: 'KONKIN SILVER',
    slug: 'konkin-silver',
    hectares: '4,500',
    type: 'VMS-Style Silver Target',
    description: 'Ross Sherlock, Ph.D. geologist, reported that the Konkin Silver showing, with high grade silver in massive baritic zones, had similar geology to the Eskay Creek precious metal rich VMS deposit.',
    highlights: [
      'Similar geology to Eskay Creek VMS',
      'High-grade silver in massive baritic zones',
      'Evaluated by Ph.D. geologist Ross Sherlock',
      'Precious metal rich VMS potential'
    ]
  },
  {
    name: 'MIDAS',
    slug: 'midas',
    hectares: '1,900',
    type: 'VTEM Anomaly Target',
    description: 'The Midas property lies along a favourable contact zone, south of the Del Norte property of Teuton Resources which hosts the high-grade gold and silver bearing "LG" vein along the same horizon. Two prominent airborne VTEM anomalies remain to be tested on this property.',
    highlights: [
      'Along favourable contact zone',
      'Adjacent to Teuton\'s Del Norte (LG vein)',
      'Two prominent VTEM anomalies',
      'Untested high-priority targets'
    ]
  },
  {
    name: 'GOLD MOUNTAIN',
    slug: 'gold-mountain',
    hectares: '2,400',
    type: 'Gold Veinlet System',
    description: 'Quartz calcite veinlets occurring over a 200 by 300m area carry gold values from a few ppb to 0.632oz/ton. The property adjoins Ascot Resources\' Red Mountain property to the southeast where gold and gold tellurides are found in various deposits such as the Marc zone (average grade 11.5 g/t gold).',
    highlights: [
      'Quartz-calcite veinlets over 200×300m',
      'Gold values up to 0.632 oz/ton',
      'Adjacent to Ascot\'s Red Mountain',
      'Near Marc zone (avg 11.5 g/t Au)'
    ]
  }
]
```

### 2. Update Page Structure
Remove the grouped categorization system and display all 7 properties in a clean grid:

```tsx
export default function PropertiesPage() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  const [hoveredProperty, setHoveredProperty] = useState<string | null>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen pt-24 md:pt-40 pb-20" 
         style={{ backgroundColor: '#073440' }} 
         data-theme="dark">
      
      {/* Dark ocean background with particles */}
      <div className="fixed inset-0 z-0" style={{ backgroundColor: '#073440' }} />
      <BackgroundMap />
      <GoldDustParticles />
      
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
            className="text-white mb-4 md:mb-6"
            style={{ 
              fontFamily: "'Aeonik Extended', sans-serif", 
              fontWeight: 500,
              fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : '4rem',
              lineHeight: '1.1'
            }}>
            Our Properties
          </motion.h1>
          <div className="text-lg sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto px-4 md:px-0"
               style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 400 }}>
            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              Seven strategic exploration properties covering 18,400 hectares in British Columbia's Golden Triangle
            </motion.p>
          </div>
        </motion.div>

        {/* Properties Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SILVER_GRAIL_PROPERTIES.map((property, index) => (
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
                  <div className="relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 bg-black/40 backdrop-blur-md border border-white/10">
                    
                    {/* Map Preview using existing PropertyMapPreview component */}
                    <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                      <PropertyMapPreview 
                        property={property} 
                        isActive={hoveredProperty === property.name}
                      />
                      
                      {/* Property name overlay */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
                        
                        <h3 className="relative z-10 text-white tracking-[0.4em] uppercase mb-3 transform transition-all duration-300 group-hover:scale-110"
                            style={{ 
                              fontFamily: "Aeonik Extended, sans-serif", 
                              fontWeight: 300,
                              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                              textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                              color: '#FFFFFF'
                            }}>
                          {property.name}
                        </h3>
                        
                        <div className="relative z-10 flex items-center justify-center gap-3 text-xs">
                          <span className="text-white/80 uppercase tracking-[0.2em]">
                            {property.type}
                          </span>
                          <span className="w-8 h-px bg-gradient-to-r from-transparent via-[#FFFF77]/60 to-transparent" />
                          <span className="text-[#FFFF77] uppercase tracking-[0.2em] font-medium">
                            {property.hectares} Ha
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-sm text-white/70 mb-4 line-clamp-3 leading-relaxed">
                        {property.description}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-2 mb-6">
                        {property.highlights.slice(0, 3).map((highlight, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FFFF77]/80" />
                            <span className="text-xs text-white/60 leading-relaxed">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* Learn More Link */}
                      <div className="flex items-center gap-2 text-[#FFFF77] font-medium group-hover:gap-3 transition-all text-sm">
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
      </div>
    </div>
  )
}
```

### 3. Update PropertyMapPreview Component
The existing `PropertyMapPreview` component should work with Silver Grail properties, but update the property center coordinates:

```tsx
// Update the propertyCenters object in PropertyMapPreview component
const propertyCenters: Record<string, [number, number]> = {
  'FIJI': [-130.15, 56.25],        // Approximate coordinates for Silver Grail properties
  'TONGA': [-130.12, 56.22],       // Based on Golden Triangle region
  'RAM': [-129.70, 55.88],         // These should be updated with actual coordinates
  'CLONE': [-130.08, 56.20],       // from Silver Grail's geological data
  'KONKIN SILVER': [-130.25, 56.28],
  'MIDAS': [-130.18, 56.24],
  'GOLD MOUNTAIN': [-130.22, 56.26]
}
```

### 4. Update GeoJSON Data Reference
The component currently references Luxor's GeoJSON file. Either:
1. Update to use Silver Grail's property GeoJSON file
2. Or remove the GeoJSON loading and use simple point markers

For option 2 (simpler approach), update the PropertyMapPreview component:

```tsx
// Replace GeoJSON loading with simple point markers
useEffect(() => {
  // ... existing map initialization code ...
  
  map.current.on('load', () => {
    setMapLoaded(true)
    
    // Add simple property marker instead of complex GeoJSON
    const center = propertyCenters[property.name] || [-130.158, 56.262]
    
    // Add property point marker
    map.current!.addSource('property-point', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center
        },
        properties: { name: property.name }
      }
    })
    
    // Add property circle
    map.current!.addLayer({
      id: 'property-circle',
      type: 'circle',
      source: 'property-point',
      paint: {
        'circle-radius': 20,
        'circle-color': '#FFFF77',
        'circle-opacity': 0.8,
        'circle-stroke-width': 3,
        'circle-stroke-color': '#FFFFFF'
      }
    })
    
    // Fit to property location
    map.current!.flyTo({
      center: center,
      zoom: 10,
      duration: 0
    })
  })
}, [property.name])
```

### 5. Apply Dark Ocean Theme
Update the page styling to match the investor page theme:

```tsx
// Add imports at top
import dynamic from 'next/dynamic'

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})
```

### 6. Remove Group-Based Logic
Remove all references to:
- `PROPERTY_GROUPS` array
- `selectedGroup` state
- Group selector pills
- Group-based filtering logic

### 7. Update Total Hectares
Update the description to show correct total:
- FIJI: 2,500 Ha
- TONGA: 1,800 Ha  
- RAM: 3,200 Ha
- CLONE: 2,100 Ha
- KONKIN SILVER: 4,500 Ha
- MIDAS: 1,900 Ha
- GOLD MOUNTAIN: 2,400 Ha
**Total: 18,400 hectares**

### 8. Remove Interactive Map Section
Remove or replace the large `InteractivePropertiesMap` component since it was designed for Luxor's properties. Replace with a simple introduction or remove entirely.

### 9. Update Page Title and Meta
Update any page metadata to reflect Silver Grail properties.

## Implementation Steps

1. **Backup existing file**: Copy current `/app/properties/page.tsx` to `/app/properties/page-luxor-backup.tsx`

2. **Update property data**: Replace `PROPERTY_GROUPS` with `SILVER_GRAIL_PROPERTIES` array

3. **Simplify page structure**: Remove group-based logic, keep single property grid

4. **Apply dark theme**: Add BackgroundMap and GoldDustParticles imports and usage

5. **Update coordinates**: Add proper coordinates for Silver Grail properties in PropertyMapPreview

6. **Simplify map preview**: Remove complex GeoJSON loading, use simple point markers

7. **Test responsiveness**: Ensure grid works well on mobile (consider 2 columns on mobile, 4 on desktop)

8. **Update totals**: Correct hectares count in description

## Verification Checklist

- [ ] Page shows exactly 7 Silver Grail properties
- [ ] Dark ocean theme (#073440) is applied consistently
- [ ] BackgroundMap and GoldDustParticles are working
- [ ] Property cards show correct hectares and descriptions
- [ ] Map previews show property locations (even if approximate)
- [ ] Responsive grid layout works on mobile and desktop
- [ ] Hover effects work correctly
- [ ] Links to individual property pages work (even if pages don't exist yet)
- [ ] No TypeScript errors
- [ ] Page loads without console errors
- [ ] Total hectares in description is correct (18,400)
- [ ] All property descriptions match Silver Grail's actual properties

## Optional Enhancements

1. **Add property statistics**: Show total claims, discovery dates, etc.
2. **Improve map previews**: Add actual property boundary data if available
3. **Add filter options**: By property type, size, or development stage
4. **Enhanced animations**: Staggered loading animations for property cards
5. **Property comparison**: Allow selecting multiple properties to compare

## Notes

- The existing PropertyMapPreview component can be reused but simplified
- Individual property detail pages (`/properties/[slug]`) will need to be created separately
- Consider adding a property location overview map showing all 7 properties
- Silver Grail's properties are in the Golden Triangle region of BC, Canada
- Properties range from early exploration to advanced targets with historical data

This redesign maintains the high-quality aesthetic of the current page while properly showcasing Silver Grail's actual property portfolio instead of Luxor's properties.
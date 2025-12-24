# Silver Grail Website - Complete Site Index

## Project Overview
**Name:** Silver Grail (SVG)  
**Framework:** Next.js 15.3.2 with TypeScript  
**Purpose:** Mining exploration company website showcasing properties in British Columbia's Golden Triangle  
**Stock Symbol:** TSX-V: SVG  

## Tech Stack
- **Frontend:** React 19, Next.js 15, TypeScript 5.8
- **Styling:** Tailwind CSS, CSS Modules, Custom CSS Variables
- **3D/Maps:** Mapbox GL, Three.js, React Three Fiber
- **Animation:** Framer Motion
- **Data Fetching:** Real-time stock quotes via TMX/Yahoo Finance APIs
- **Build Tools:** Webpack, PostCSS, Autoprefixer

## Site Architecture

### 1. Pages & Routes

#### Main Pages
- `/` - Landing page with interactive satellite map
- `/about` - Company information page
- `/properties` - Properties listing page
- `/properties/[slug]` - Individual property details
- `/investors` - Investor information page
- `/projects` - Projects overview
- `/news` - News and updates
- `/contact` - Contact information
- `/resources` - Resources page

#### Alternative Landing Pages (Development)
- `/landing` - Alternative landing page design
- `/landingpagekappa` - Kappa version
- `/landingpagekappaoptimized` - Optimized Kappa version
- `/landingpagedelta` - Delta version with scroll transitions
- `/landingpagetheta` - Theta version
- `/landingpageomega` - Omega version
- `/gravitational-demo` - Gravitational pull demo
- `/test-map` - Map testing page

### 2. API Endpoints

- `/api/stock-quote` - Fetches SVG stock data from TMX/Yahoo
- `/api/gold-price` - Gold price data
- `/api/silver-price` - Silver price data
- `/api/trade-history` - Trading history data
- `/api/news` - News feed data

### 3. Core Components

#### Landing Page Components
- `SatellitePropertyMap` - Main interactive satellite map with property overlays
- `StrategicLocationMap` - Wrapper for satellite map
- `GoldDustParticles` - 3D particle effects
- `MobileNav` / `MobileNavWrapper` - Mobile navigation
- `LiveStockQuote` - Real-time stock ticker
- `LiveGoldPrice` / `LiveSilverPrice` - Commodity prices
- `PropertyInfo` - Property information display

#### 3D Visualization Components
- `GlassmorphicPyramid` - 3D pyramid visualization
- `DataPyramid` / `PyramidInterior` - Data visualization pyramids
- `GoldenTriangleMap` / `GoldenTriangleParticles` - 3D map effects
- `MetalRivers` - Animated metal flow visualization
- `AnimatedContourLines` - Topographic animations

#### Layout Components
- `Header` / `HeaderLanding` / `HeaderLight` - Header variations
- `Footer` - Site footer
- `ConditionalHeader` - Dynamic header selection

#### Property Components
- `PropertiesGrid` - Property listing grid
- `PropertyHero` / `PropertyOverview` - Property detail sections
- `PropertyHighlights` / `PropertyGeology` - Property information
- `PropertyGallery` - Image galleries
- `PropertyOutlineMap` - Property boundary maps

### 4. Data & Content

#### Property Data
Properties tracked in the system:
- Tennyson Property (Advanced Cu-Au porphyry)
- Big Gold Property (VMS targets)
- Four J's Property (Historic mining area)
- Eskay Rift (Exploration target)
- Ram Property (Multiple zones)
- And additional properties...

#### GeoJSON Data Files
- `ram-claims.geojson` - RAM property boundaries
- `ram-drilling.geojson` - Drilling locations
- `ram-zones.geojson` - Mineralized zones
- `adjacent-properties.geojson` - Neighboring claims
- `modified-red-line.geojson` - Red Line transition zone
- `silvergrail-properties.geojson` - All SG properties

### 5. Styling & Assets

#### Fonts
- Aeonik (Regular, Extended variations)
- Switzer Variable
- Proxima Nova family
- Helvetica Now Display
- Custom web fonts in WOFF2 format

#### Images & Media
- Property images and maps
- Drone footage (videos/)
- Logo variations (SVG and PNG)
- Topographic overlays
- Satellite imagery

#### CSS Structure
- Global styles (`globals.css`)
- Font definitions (`fonts.css`)
- Mobile optimizations (`mobile-*.css`)
- Investor page styles (`investor-*.css`)
- Component-specific modules

### 6. Key Features

#### Interactive Map System
- Mapbox satellite imagery with 3D terrain
- Property boundaries with hover effects
- Drill hole locations and data
- Mineralized zone visualization
- Adjacent property information
- Gyroscopic 3D effects on mobile

#### Real-Time Data
- Live stock quotes (TSX-V: SVG)
- Gold and silver spot prices
- Trading volume and market cap
- Price change indicators

#### Mobile Optimizations
- Responsive design for all devices
- Touch gestures and swipe navigation
- Device orientation support
- Performance mode detection
- Dynamic viewport calculations

#### 3D Visualizations
- WebGL-powered 3D graphics
- Particle systems
- Terrain exaggeration
- Interactive camera controls

### 7. Development Tools

#### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run dev:watch` - Auto-restart development
- `npm run lint` - Code linting
- `npm run typecheck` - TypeScript checking

#### Testing
- Playwright test suite
- Visual regression testing
- Viewport testing for devices
- Performance monitoring

#### Deployment
- Vercel deployment configuration
- Slack notification integration
- Environment-specific builds

### 8. Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `vercel.json` - Deployment settings
- `nodemon.json` - Development auto-restart

### 9. Special Features

#### Mapbox Integration
- Custom map styles
- 3D terrain rendering
- Property boundary layers
- Clustering for data points
- Custom markers and popups

#### Animation System
- Framer Motion animations
- CSS transitions
- WebGL shader effects
- Scroll-triggered animations
- Particle systems

#### Data Processing
- GeoJSON manipulation
- Shapefile conversion
- UTM to WGS84 projection
- Property boundary merging
- Drill data aggregation

### 10. Content Management

#### News System
- CSV-based news import
- SEDAR filing integration
- Automated updates
- News categorization

#### Property Information
- Technical reports (NI 43-101)
- Exploration data
- Historical drilling results
- Geological descriptions

### 11. Performance Optimizations

- Code splitting and lazy loading
- Image optimization
- Font preloading
- Critical CSS inlining
- Service worker caching
- WebGL performance modes
- Reduced motion support

### 12. Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- WebGL support required for 3D features
- Fallbacks for older browsers

## Key Files Reference

- Main entry: `app/page.tsx`
- Map component: `components/landing/SatellitePropertyMap.tsx`
- Property data: `lib/properties-data.ts`
- Stock API: `app/api/stock-quote/route.ts`
- Global styles: `app/globals.css`

## Environment Variables
Required for full functionality:
- Mapbox API token
- API endpoints for stock data
- Analytics tracking codes

## Notes
- Site optimized for mining industry investors
- Focus on exploration properties in Golden Triangle, BC
- Real-time market data integration
- Mobile-first responsive design
- High-performance 3D visualizations
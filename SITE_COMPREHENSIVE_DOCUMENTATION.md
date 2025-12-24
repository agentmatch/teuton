# Silver Grail Resources - Comprehensive Site Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Design System](#design-system)
4. [Page Structure & Components](#page-structure--components)
5. [Property Portfolio](#property-portfolio)
6. [Interactive Features](#interactive-features)
7. [Data Sources & APIs](#data-sources--apis)
8. [Development Workflow](#development-workflow)
9. [Deployment & Infrastructure](#deployment--infrastructure)
10. [Performance & Optimization](#performance--optimization)
11. [Maintenance & Updates](#maintenance--updates)

---

## Project Overview

### Company Background
**Silver Grail Resources Ltd.** is a mineral exploration company focused on gold and silver properties in British Columbia's Golden Triangle region. The company is led by President Dino Cremonese, who has 45+ years of exploration experience and discovered major deposits including Treaty Creek (23.37M oz AuEq) and Red Mountain (783K oz).

### Website Purpose
The website serves as the primary digital presence for Silver Grail Resources, targeting:
- **Investors**: Providing financial data, property information, and exploration updates
- **Industry Professionals**: Showcasing technical geological data and exploration methodology
- **Stakeholders**: Offering transparency through regular news updates and project progress

### Key Business Metrics
- **8 Properties** totaling **21,917 hectares**
- **Stock Symbol**: TSX-V: LUXR
- **Infinite Potential** tagline representing unlimited exploration upside
- **Primary Focus**: RAM Property adjacent to Red Mountain discovery

---

## Technical Architecture

### Core Technologies
```
Framework: Next.js 15.5.2 (React 18)
Language: TypeScript
Styling: Tailwind CSS + Custom CSS
Animation: Framer Motion
Maps: Mapbox GL JS
Video: Mux Player (HLS streaming)
Font System: Aeonik, Aeonik Extended, Switzer Variable
Deployment: Vercel
```

### Project Structure
```
silvergrail/
├── app/                          # Next.js App Router
│   ├── about/                    # About page with team bios
│   ├── contact/                  # Contact information
│   ├── investors/                # Investor relations
│   ├── news/                     # News releases & articles
│   │   └── [slug]/              # Dynamic news article pages
│   ├── properties/              # Property portfolio
│   │   ├── clone/               # Clone property page
│   │   ├── fiji/                # Fiji property page
│   │   ├── konkin-silver/       # Konkin Silver property page
│   │   ├── ram/                 # RAM property (flagship)
│   │   └── tonga/               # Tonga property page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   └── page.tsx                 # Landing page
├── components/                   # Reusable components
│   ├── content/                 # Page-specific content components
│   ├── effects/                 # Visual effects (particles, animations)
│   ├── landing/                 # Landing page specific components
│   ├── layout/                  # Header, navigation, footer
│   └── ui/                      # Common UI components
├── public/                      # Static assets
│   ├── images/                  # Property maps, team photos, backgrounds
│   └── favicon/                 # Favicon variants
├── styles/                      # Additional CSS files
└── lib/                         # Utility functions and configs
```

### Key Dependencies
```json
{
  "next": "15.5.2",
  "react": "18.x",
  "typescript": "5.x",
  "tailwindcss": "3.x",
  "framer-motion": "11.x",
  "mapbox-gl": "3.x",
  "@mux/mux-player-react": "2.x",
  "react-icons": "5.x"
}
```

---

## Design System

### Color Palette
The site uses a sophisticated color system based on the **RAM Property Design System**:

```scss
// Primary Palette (RAM-based)
$palette-dark: #0d0f1e;      // Deep navy - primary text
$palette-blue: #5c7ca3;      // Slate blue - accents  
$palette-light: #b5ccda;     // Light blue-gray - subtle elements
$palette-peach: #ffbe98;     // Warm peach - primary buttons/cards
$palette-yellow: #fed992;    // Soft yellow - highlights

// Brand Colors
$primary-gold: #FFFF77;      // Luxor signature gold
$primary-cream: #FAF5E4;     // Elegant cream for text
$silver-metallic: #C0C0C0;   // Silver accents

// Background System
$background-dark: #0d0f1e;   // Primary background
$aurora-blue: rgba(0, 106, 148, 0.3);  // Aurora gradient overlay
$deep-navy: rgba(3, 23, 48, 0.9);      // Gradient base layer
```

### Typography System
```scss
// Font Families
font-primary: 'Aeonik', sans-serif;           // Body text, paragraphs
font-extended: 'Aeonik Extended', sans-serif; // Headers, important text
font-variable: 'Switzer Variable', sans-serif; // UI elements, navigation

// Font Weights
$weight-light: 300;
$weight-normal: 400;
$weight-medium: 500;
$weight-semibold: 600;
$weight-bold: 700;

// Responsive Typography
font-size: clamp(0.95rem, 1.5vw, 1rem);      // Body text
font-size: clamp(1.8rem, 6vw, 2.5rem);       // Mobile headers
font-size: clamp(2.5rem, 4.5vw, 4rem);       // Desktop headers
```

### Glassmorphic Design System
The site implements a **3-layer glassmorphic system** consistently across all components:

#### Layer 1 - Light Glass (Map/Image containers)
```css
background: linear-gradient(135deg, 
  rgba(200, 200, 210, 0.95) 0%, 
  rgba(220, 225, 230, 0.9) 50%, 
  rgba(190, 195, 205, 0.95) 100%);
backdrop-filter: blur(20px) saturate(120%);
border: 1px solid rgba(180, 185, 195, 0.6);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), 
            inset 0 2px 4px 0 rgba(255, 255, 255, 0.4);
```

#### Layer 2 - Dark Glass (Feature boxes)
```css
background: linear-gradient(135deg, 
  rgba(12, 14, 29, 0.7) 0%, 
  rgba(12, 14, 29, 0.85) 50%, 
  rgba(12, 14, 29, 0.7) 100%);
backdrop-filter: blur(20px) saturate(150%);
border: 1px solid rgba(12, 14, 29, 0.6);
```

#### Layer 3 - Accent Glass (Buttons/CTAs)
```css
background: linear-gradient(135deg, 
  rgba(255, 190, 152, 0.9) 0%, 
  rgba(255, 190, 152, 0.8) 30%,
  rgba(254, 217, 146, 0.7) 70%,
  rgba(255, 190, 152, 0.85) 100%);
backdrop-filter: blur(20px) saturate(200%) brightness(1.1);
border: 1px solid rgba(255, 255, 255, 0.3);
```

### Spacing System
```scss
// Fluid Spacing using CSS clamp()
$spacing-xs: clamp(0.5rem, 1vw, 0.75rem);
$spacing-sm: clamp(0.75rem, 2vw, 1rem);
$spacing-md: clamp(1rem, 3vw, 1.5rem);
$spacing-lg: clamp(1.5rem, 4vw, 3rem);
$spacing-xl: clamp(2rem, 5vw, 3rem);

// Container System
$container-padding: clamp(1rem, 3vw, 1.5rem);
$max-width: 1152px; // 6xl in Tailwind
```

### Animation System
```scss
// Standard Timing
$transition-fast: 0.2s ease-out;
$transition-normal: 0.3s ease-out;
$transition-slow: 0.6s ease-out;

// Framer Motion Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
};

// Gradient Text Animation
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

---

## Page Structure & Components

### Landing Page (`/`)
**File**: `app/page.tsx` → `components/landing/SatellitePropertyMap.tsx`

#### Key Features:
- **Interactive Mapbox Map**: Centered on Golden Triangle region
- **Property Markers**: 8 clickable property locations with labels
- **Project Overview Stats**: 8 Properties, 21,917 Hectares, Infinite Potential
- **Drone Video Integration**: RAM property drone footage with Mux player
- **Mobile Navigation**: Bottom navigation bar for mobile devices
- **3D Terrain**: Mapbox 3D terrain with gyroscopic effects on mobile
- **Stock Ticker**: Live LUXR stock data integration
- **Aurora Background**: 3-layer gradient overlay system

#### Mobile Features:
- **Gyroscopic 3D Effects**: Device orientation controls map pitch/bearing
- **Touch Interactions**: Optimized for mobile gestures
- **Bottom Navigation**: Persistent mobile menu
- **Responsive Zoom**: Different zoom levels for different screen sizes

#### Technical Implementation:
```typescript
// Map Configuration
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
center: [-129.5, 56.5], // Golden Triangle center
zoom: isMobile ? 8.5 : 9.5,
pitch: isMobile ? 65 : 45,
bearing: -14.4, // 4% counter-clockwise
terrain: { source: 'mapbox-dem', exaggeration: 1.1 }
```

### Property Pages
All property pages follow the **RAM Property Design System** for consistency:

#### RAM Property (`/properties/ram`)
**File**: `app/properties/ram/page.tsx`
- **Status**: Flagship property, active drilling program
- **Stats**: 1,000 Hectares, 2025 Drilling, Malachite Porphyry, Adjacent to Red Mountain
- **Features**: Core sample magnification, drone videos, geological maps
- **Design**: Complete glassmorphic system implementation

#### Clone Property (`/properties/clone`)
**File**: `app/properties/clone/page.tsx`
- **Stats**: 500m Strike Length, 137.1 g/t Bulk Sample Au, $7M Investment, 2025 IP Survey
- **Content**: High-grade gold-cobalt shear zone discovery
- **Historical Data**: 1995-1997 drilling results, bulk sampling

#### Fiji Property (`/properties/fiji`)
**File**: `app/properties/fiji/page.tsx`
- **Stats**: 1,250 Hectares, 47.1 g/t Au Max Sample, 5/16 Samples >11 g/t, 2006 Discovery
- **Content**: Kitsault Valley Trend, high gold values, quartz-carbonate structures
- **Geological Focus**: Northwest-trending mineralization

#### Konkin Silver Property (`/properties/konkin-silver`)
**File**: `app/properties/konkin-silver/page.tsx`
- **Content**: Identical to Fiji (same geological trend)
- **Focus**: Silver-bearing potential in Kitsault Valley system

#### Tonga Property (`/properties/tonga`)
**File**: `app/properties/tonga/page.tsx`
- **Strategic Position**: Near major discoveries
- **Content**: VMS potential, strategic location advantages

### About Page (`/about`)
**File**: `app/about/page.tsx` → `components/content/AboutContent.tsx`

#### Key Sections:
1. **Photo Story Slider**: Dino Cremonese career timeline (4 slides)
   - The Early Years (1970s): UBC graduation, "Dino" vein discovery
   - Research Method (1980s): Library research, systematic approach
   - Major Discoveries (1984-1989): Treaty Creek, Red Mountain
   - Current Focus (2025): RAM drilling program

2. **Team Members**: Executive profiles with expandable bios
   - Dino Cremonese (President/CEO): 45+ years experience
   - Barry Holmes (Director): Aviation/helicopter industry background
   - Alex Cremonese (Director): Business development experience
   - Robert Smiley (Director): Legal/securities background

3. **Company Timeline**: 7 key milestones from 2019-2025

#### Design Features:
- **Glassmorphic Slider**: RAM-style peachy container
- **Interactive Navigation**: Previous/Next buttons, progress bar
- **Responsive Grid**: Two-column layout (image + content)
- **Modal System**: Expandable team member details

### News Page (`/news`)
**File**: `app/news/page.tsx`

#### Features:
- **News Release Listing**: Chronological display of press releases
- **Content Extraction**: Cleans WordPress content artifacts
- **Dynamic Routing**: `/news/[slug]` for individual articles
- **SEO Optimization**: Meta tags, structured data

#### News Article Pages (`/news/[slug]`)
**File**: `app/news/[slug]/page.tsx`
- **Dynamic Content**: Fetches from WordPress API
- **Rich Content**: Formatted text, images, embedded media
- **Social Sharing**: Twitter, LinkedIn, email integration
- **Breadcrumb Navigation**: Back to news listing

### Investors Page (`/investors`)
**File**: `app/investors/page.tsx`
- **Stock Information**: Live LUXR quote integration
- **Financial Data**: Key metrics, trading information
- **Investor Resources**: Reports, presentations, contact information

### Contact Page (`/contact`)
**File**: `app/contact/page.tsx`
- **Company Information**: Address, phone, email
- **Interactive Map**: Office location
- **Contact Form**: Direct inquiry submission

---

## Property Portfolio

### Complete Property Details

#### 1. RAM Property (Flagship)
- **Size**: 1,000 hectares
- **Status**: Active drilling (2025)
- **Geology**: Malachite Porphyry, Mitch VMS zones
- **Significance**: Adjacent to Red Mountain (783K oz discovery)
- **Progress**: 1,000m drilled, core observations promising
- **Map Data**: `/public/images/ram-property.geojson`

#### 2. TENNYSON Property
- **Description**: Flagship porphyry Cu-Au target with 64 drill holes (1986-2013)
- **Best Intercepts**: 229.5m @ 0.32% Cu, 0.25 g/t Au and 103.6m @ 0.42% Cu, 0.31 g/t Au
- **Location**: Sulphurets thrust fault
- **Map Position**: Central focus of property map

#### 3. FOUR J'S Property
- **Description**: Historic VMS target with 30+ drill holes
- **Recent Results**: Up to 29.2 g/t Au, 17 g/t Ag
- **Geology**: Three mineralization styles, VMS and porphyry potential
- **Includes**: CATSPAW historic area with 50m adit, silver veins up to 1,309.7 g/t Ag

#### 4. BIG GOLD Property
- **Features**: Roman and Zall massive sulfide occurrences
- **High Grades**: 27.7 g/t Au, 6,240 g/t Ag, 1.455% Cu
- **Recent Work**: 2023 hyperspectral survey identified extensive alteration

#### 5. ESKAY RIFT Property
- **Potential**: Two large ZTEM conductors at depth
- **Status**: No drilling to date
- **Target**: Eskay Creek-type VMS potential

#### 6. LEDUC Property
- **Context**: Encircles historic Granduc mine
- **Recent Results**: 2.0m @ 1.97% Cu, 0.21 g/t Au
- **Geology**: JK zone with magnetite-chalcopyrite assemblages

#### 7. LEDUC SILVER Property
- **Focus**: High-grade silver target
- **Results**: Assays 99.2-386.6 g/t Ag
- **Relationship**: Part of Leduc property system

#### 8. PEARSON Property
- **Features**: 2.5km airborne EM anomaly with Granduc-like signature
- **Recent Work**: 2022 boulder sampling returned anomalous Cu-Au

### Regional Context
- **Location**: British Columbia's Golden Triangle
- **Nearby Major Projects**: KSM, Brucejack, Treaty Creek, Eskay Creek, Granduc
- **Infrastructure**: Accessible via Stewart, BC
- **Jurisdiction**: Stable mining jurisdiction with clear regulations

---

## Interactive Features

### Mapbox Integration
**File**: `components/landing/SatellitePropertyMap.tsx`

#### Map Configuration:
```typescript
const mapConfig = {
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: [-129.5, 56.5], // Golden Triangle
  zoom: isMobile ? 8.5 : 9.5,
  pitch: isMobile ? 65 : 45,
  bearing: -14.4,
  terrain: {
    source: 'mapbox-dem',
    exaggeration: isMobile ? 1.3 : 1.1
  }
}
```

#### Property Markers:
```typescript
// Each property has custom HTML markers
const createPropertyMarker = (property) => {
  const marker = new mapboxgl.Marker({
    element: createMarkerElement(property),
    anchor: 'center'
  })
  .setLngLat(property.coordinates)
  .addTo(map);
}
```

#### GeoJSON Data Sources:
- **Property Boundaries**: Individual .geojson files for each property
- **Red Line**: `fiji-goliath-red-line-connected.geojson` (connected segments)
- **Regional Context**: Major project markers and labels

#### Mobile Enhancements:
```typescript
// Gyroscopic 3D Effects
useEffect(() => {
  const handleOrientation = (event) => {
    if (map && deviceOrientation) {
      map.easeTo({
        pitch: Math.max(0, Math.min(85, 65 + event.beta * 0.3)),
        bearing: -14.4 + event.gamma * 0.5,
        duration: 100
      });
    }
  };
  
  if (DeviceOrientationEvent?.requestPermission) {
    // iOS 13+ permission handling
  }
}, []);
```

### Video Integration
**Mux Player Implementation**:

#### RAM Drone Videos:
```typescript
const MUX_DRONE_PLAYBACK_IDS = {
  ram1: 'RPb301S7bOIXXQCzqDHSfO8qioVUIGyxlBjYhsYia5Wk',
  ram2: 'yuJk01P8BH1yYaADncP3Z3Bu00wgBvPSOtak005D5xJuBc'
};

// 4K Quality Configuration
<MuxDroneVideo
  playbackId={playbackId}
  maxResolution="2160p"
  minResolution="1080p"
  preferPlayback="mse"
  autoPlay
  loop
  muted
/>
```

#### Video Features:
- **Adaptive Bitrate**: Automatically adjusts quality based on connection
- **HLS Streaming**: Optimized for web delivery
- **Mobile Optimization**: Touch controls, full-screen support
- **Thumbnail Generation**: Automatic poster frames

### Animation System
**Framer Motion Integration**:

#### Page Load Sequences:
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};
```

#### Hover Effects:
```typescript
const hoverEffects = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 300 }
};
```

#### Scroll-Based Animations:
```typescript
// Intersection Observer for scroll animations
const { ref, inView } = useInView({
  threshold: 0.1,
  triggerOnce: true
});
```

### Stock Ticker Integration
**Live Market Data**:

#### API Endpoint: `/api/stock-quote`
```typescript
const fetchStockData = async () => {
  const response = await fetch('/api/stock-quote');
  const data = await response.json();
  return {
    symbol: 'TSX-V: LUXR',
    price: data.price,
    change: data.change,
    changePercent: data.changePercent,
    volume: data.volume,
    marketCap: data.marketCap
  };
};
```

#### Display Features:
- **Real-time Updates**: 5-minute refresh interval
- **Status Indicators**: Green/red dots for live/delayed data
- **Mobile Optimization**: Compact ticker in mobile navigation
- **Glassmorphic Styling**: Consistent with overall design

---

## Data Sources & APIs

### External APIs

#### 1. Stock Quote API (`/api/stock-quote`)
- **Purpose**: Real-time LUXR stock data
- **Update Frequency**: 5 minutes during market hours
- **Data Points**: Price, change, volume, market cap
- **Fallback**: Static data if API unavailable

#### 2. WordPress News API (`/api/news`)
- **Purpose**: News release content management
- **Content Type**: Press releases, corporate updates
- **Processing**: HTML cleanup, content extraction
- **SEO**: Meta tags, structured data generation

#### 3. Mapbox APIs
- **Satellite Imagery**: High-resolution satellite tiles
- **Terrain Data**: 3D elevation data for terrain visualization
- **Geocoding**: Address and location services
- **Vector Tiles**: Optimized map rendering

### Internal Data Sources

#### 1. Property GeoJSON Files
Located in `/public/images/`:
- `ram-property.geojson`: RAM property boundaries
- `fiji-goliath-red-line-connected.geojson`: Connected red line segments
- `tennyson-property.geojson`: Tennyson property data
- `big-gold-property.geojson`: Big Gold boundaries
- Additional property boundary files

#### 2. Team Photos & Assets
Located in `/public/images/`:
- `dino1.JPG`, `dino2.jpeg`, `dino3.jpeg`, `dino4.jpeg`: Dino timeline photos
- `dinonew.png`, `barrynew.png`, `alexnew.png`: Team member headshots
- `rambackground.png`: Mountain landscape background
- Property-specific images and maps

#### 3. Company Data
Hardcoded in components:
- **Property Statistics**: Hectares, discovery dates, key metrics
- **Timeline Events**: Company milestones and achievements
- **Team Information**: Bios, experience, contact details

### Data Processing

#### Content Cleaning (News Articles):
```typescript
function cleanContent(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/<!-- wp:[\s\S]*? -->/g, '') // Remove WordPress blocks
    .replace(/\[caption[^\]]*\]/g, '') // Remove caption shortcodes
    .replace(/\[\/caption\]/g, '')
    .trim();
}
```

#### GeoJSON Processing:
```typescript
// Property boundary loading
const loadPropertyData = async (propertyName: string) => {
  const response = await fetch(`/images/${propertyName}-property.geojson`);
  const data = await response.json();
  
  map.addSource(propertyName, {
    type: 'geojson',
    data: data
  });
  
  map.addLayer({
    id: `${propertyName}-fill`,
    type: 'fill',
    source: propertyName,
    paint: {
      'fill-color': '#FFFF77',
      'fill-opacity': 0.2
    }
  });
};
```

---

## Development Workflow

### Local Development Setup

#### Prerequisites:
```bash
Node.js: 18.x or later
npm: 9.x or later
Git: Latest version
```

#### Environment Variables:
```env
# .env.local
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
STOCK_API_KEY=your_stock_api_key
```

#### Development Commands:
```bash
# Standard development
npm run dev

# Development with auto-restart (recommended)
./start-dev.sh

# Type checking
npm run typecheck

# Linting
npm run lint

# Production build
npm run build
```

### Enhanced Development Tools

#### 1. Nodemon Configuration (`nodemon.json`):
```json
{
  "watch": ["**/*"],
  "ext": "ts,tsx,js,jsx,json,css",
  "ignore": [".next/**/*", "node_modules/**/*"],
  "exec": "next dev -p 3000",
  "env": {
    "NODE_ENV": "development"
  }
}
```

#### 2. Development Monitor (`dev-monitor.js`):
- **Error Detection**: Recognizes common Next.js errors
- **Crash Recovery**: Automatically handles crashes
- **Port Management**: Ensures consistent port usage
- **Colored Output**: Easy error identification

#### 3. Cache Management:
```bash
# Clear all caches
./clear-cache.sh

# Manual cache clearing
rm -rf .next
rm -rf node_modules/.cache
npm run dev
```

### Code Quality Standards

#### TypeScript Configuration:
```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  }
}
```

#### ESLint Configuration:
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Testing Framework

#### Playwright Configuration:
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
  ],
});
```

#### Test Categories:
- **Visual Regression**: Component rendering tests
- **User Interaction**: Click, scroll, form submission
- **Mobile Testing**: Touch gestures, responsive design
- **Performance**: Core Web Vitals, loading times

---

## Deployment & Infrastructure

### Vercel Deployment

#### Configuration (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sfo1"],
  "functions": {
    "app/api/**": {
      "runtime": "nodejs18.x"
    }
  }
}
```

#### Environment Variables (Production):
```
NEXT_PUBLIC_MAPBOX_TOKEN=production_mapbox_token
WORDPRESS_API_URL=production_wordpress_url
STOCK_API_KEY=production_stock_api_key
NODE_ENV=production
```

#### Deployment Process:
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```

### Slack Integration

#### Deployment Notifications:
```bash
# Webhook URL (store in environment variable)
SLACK_WEBHOOK=[REDACTED - See environment variables]

# Notification template
curl -X POST -H "Content-type: application/json" \
--data '{
  "text": "✅ *Luxor Metals Deployed Successfully*\n\n🆕 *Changes:*\n• [List changes here]\n\n🔗 *Production URL:*\nhttps://luxormetals.vercel.app"
}' $SLACK_WEBHOOK
```

### Domain Configuration
- **Primary**: luxormetals.vercel.app
- **Custom Domain**: (if configured) silvergrailresources.com
- **SSL**: Automatic Let's Encrypt certificates
- **CDN**: Global edge network for optimal performance

### Monitoring & Analytics

#### Core Web Vitals Tracking:
- **LCP (Largest Contentful Paint)**: < 2.5s target
- **FID (First Input Delay)**: < 100ms target  
- **CLS (Cumulative Layout Shift)**: < 0.1 target

#### Performance Monitoring:
- **Vercel Analytics**: Built-in performance tracking
- **Real User Monitoring**: Actual user experience data
- **Error Tracking**: Automatic error reporting and alerts

---

## Performance & Optimization

### Image Optimization

#### Next.js Image Component:
```typescript
<Image
  src="/images/rambackground.png"
  alt="Mountain landscape"
  fill
  priority
  quality={90}
  sizes="100vw"
  style={{ objectFit: 'cover' }}
/>
```

#### Optimization Strategies:
- **Automatic WebP/AVIF**: Modern format conversion
- **Responsive Images**: Multiple sizes for different screens
- **Lazy Loading**: Load images as they enter viewport
- **Priority Loading**: Above-fold images load immediately

### Code Splitting

#### Dynamic Imports:
```typescript
// Lazy load heavy components
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-0" />
});

// Route-based splitting
const PropertyModal = dynamic(() => import('./PropertyModal'), {
  ssr: false
});
```

#### Bundle Analysis:
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Tree shaking verification
npm run build --analyze
```

### Caching Strategy

#### Browser Caching:
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

#### API Caching:
```typescript
// Stock data caching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  const cached = cache.get('stock-data');
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return Response.json(cached.data);
  }
  
  // Fetch fresh data...
}
```

### Mobile Performance

#### Optimization Techniques:
- **Touch Event Optimization**: Passive event listeners
- **Viewport Management**: Proper meta tags for mobile
- **Network-Aware Loading**: Adjust quality based on connection
- **Battery-Aware Animations**: Reduce motion for low battery

#### Mobile-Specific Features:
```typescript
// Gyroscopic effects with performance monitoring
const handleOrientation = throttle((event) => {
  if (map && !isTransitioning) {
    map.easeTo({
      pitch: calculatePitch(event.beta),
      bearing: calculateBearing(event.gamma),
      duration: 100 // Fast updates for smooth motion
    });
  }
}, 16); // 60fps throttling
```

### SEO Optimization

#### Meta Tags:
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Silver Grail Resources | Gold & Silver Exploration | Golden Triangle BC',
  description: 'Silver Grail Resources: Premier mineral exploration in BC\'s Golden Triangle. 8 properties, 21,917 hectares. Led by Dino Cremonese with 45+ years experience.',
  keywords: 'silver grail resources, gold exploration, silver mining, golden triangle BC, mineral exploration, LUXR stock',
  openGraph: {
    title: 'Silver Grail Resources',
    description: 'Premier mineral exploration in British Columbia\'s Golden Triangle',
    images: ['/images/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silver Grail Resources',
    description: 'Premier mineral exploration in British Columbia\'s Golden Triangle',
    images: ['/images/twitter-image.jpg'],
  },
};
```

#### Structured Data:
```typescript
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Corporation",
  "name": "Silver Grail Resources Ltd.",
  "url": "https://luxormetals.vercel.app",
  "logo": "https://luxormetals.vercel.app/images/logo.png",
  "description": "Mineral exploration company focused on gold and silver properties in British Columbia's Golden Triangle",
  "stockExchange": "TSX Venture Exchange",
  "tickerSymbol": "LUXR"
};
```

---

## Maintenance & Updates

### Regular Maintenance Tasks

#### Weekly:
- **Dependency Updates**: Check for security patches
- **Content Updates**: News releases, stock data verification
- **Performance Monitoring**: Core Web Vitals review
- **Error Log Review**: Check for runtime errors

#### Monthly:
- **Major Dependency Updates**: Framework and library updates
- **SEO Performance**: Google Search Console review
- **Analytics Review**: User behavior and performance metrics
- **Security Audit**: Dependency vulnerability scan

#### Quarterly:
- **Comprehensive Testing**: Full regression test suite
- **Performance Audit**: Lighthouse audit and optimization
- **Content Strategy Review**: Update property information
- **Infrastructure Review**: Hosting and deployment optimization

### Content Management

#### News Updates:
1. **WordPress Integration**: Add new release to WordPress
2. **Content Review**: Ensure proper formatting and links
3. **SEO Optimization**: Meta tags, slug optimization
4. **Social Media**: Prepare shareable content

#### Property Updates:
1. **Geological Data**: Update exploration results
2. **Map Data**: Refresh GeoJSON property boundaries
3. **Statistics**: Update hectares, discovery dates
4. **Visual Assets**: New photos, maps, drone footage

### Technical Debt Management

#### Code Quality:
- **TypeScript Strict Mode**: Gradually improve type safety
- **Component Refactoring**: Extract reusable components
- **Performance Optimization**: Identify and fix bottlenecks
- **Accessibility Improvements**: WCAG 2.1 compliance

#### Infrastructure:
- **CDN Optimization**: Image and asset delivery improvements
- **Database Optimization**: Query performance and caching
- **Security Updates**: Regular security patch application
- **Monitoring Enhancement**: Better error tracking and alerts

### Backup & Recovery

#### Version Control:
```bash
# Git repository structure
main (production)
├── development (active development)
├── feature/* (feature branches)
└── release/* (release candidates)
```

#### Data Backup:
- **Code Repository**: GitHub with multiple collaborators
- **Asset Backup**: Vercel automatic backup
- **Configuration Backup**: Environment variables documented
- **Database Backup**: Regular WordPress export

#### Disaster Recovery:
1. **Repository Recovery**: GitHub repository restoration
2. **Asset Recovery**: Vercel project recreation
3. **Domain Recovery**: DNS configuration restoration
4. **Content Recovery**: WordPress backup restoration

---

## Key Files Reference

### Critical Configuration Files:
- `next.config.js`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration
- `package.json`: Dependencies and scripts
- `vercel.json`: Deployment configuration

### Essential Component Files:
- `components/landing/SatellitePropertyMap.tsx`: Main interactive map
- `components/content/AboutContent.tsx`: About page with team info
- `app/properties/ram/page.tsx`: Flagship property page template
- `components/layout/HeaderLanding.tsx`: Main navigation header

### Data Files:
- `public/images/fiji-goliath-red-line-connected.geojson`: Connected red line
- `public/images/*.geojson`: Property boundary data
- `CLAUDE.md`: Development reference and instructions
- `RAM_PROPERTY_COMPREHENSIVE_CHECKLIST.md`: Design system reference

### Style Files:
- `app/globals.css`: Global styles and animations
- `styles/mobile-nav-fix.css`: Mobile navigation overrides

This comprehensive documentation provides everything needed for a new Claude Code instance to immediately understand and work effectively with the Silver Grail Resources website. The site represents a sophisticated mineral exploration company website with advanced interactive features, consistent design systems, and professional content presentation.
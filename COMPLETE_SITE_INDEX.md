# Silver Grail Resources - Complete Site Index

## 🗂️ Project Structure Overview

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Animation**: Framer Motion
- **Maps**: Mapbox GL
- **Video**: Mux Video Player
- **Icons**: React Icons (Feather Icons)
- **3D**: Three.js (for select components)

## 📄 Pages Directory (`/app`)

### Main Pages
1. **Homepage** (`/page.tsx`)
   - Main landing page with satellite property map
   - Interactive 3D map visualization
   - Stock ticker and live pricing
   - Property exploration interface

2. **About** (`/about/page.tsx`)
   - Company information and history
   - Team and leadership
   - Mission and vision statements

3. **Contact** (`/contact/page.tsx`)
   - Contact form
   - Office locations
   - Contact information

4. **Investors** (`/investors/page.tsx`)
   - Investor relations dashboard
   - Stock information (TSX-V: LUXR)
   - Financial reports and filings
   - Real-time stock data integration

5. **News** (`/news/page.tsx`)
   - News and press releases
   - Company updates
   - Dynamic news article pages (`/news/[slug]/page.tsx`)

6. **Properties** (`/properties/page.tsx`)
   - Property portfolio overview
   - Interactive property cards
   - Links to individual property pages

### Individual Property Pages
- **RAM** (`/properties/ram/page.tsx`) - Flagship property with drone videos
- **Fiji** (`/properties/fiji/page.tsx`)
- **Tonga** (`/properties/tonga/page.tsx`)
- **Clone** (`/properties/clone/page.tsx`)
- **Gold Mountain** (`/properties/gold-mountain/page.tsx`)
- **Midas** (`/properties/midas/page.tsx`)
- **Konkin Silver** (Dynamic route via `/properties/[slug]/page.tsx`)

### Landing Page Variants (Testing/Archive)
- `/landingpagekappa/` - Alternative landing design
- `/landingpagetheta/` - Test variant
- `/landingpageomega/` - Test variant
- `/landingpagedelta/` - Test variant with scroll transitions

### Utility Pages
- **Resources** (`/resources/page.tsx`)
- **Projects** (`/projects/page.tsx`) - Legacy projects page
- **Test Map** (`/test-map/page.tsx`) - Development testing

## 🧩 Components Directory (`/components`)

### Core Layout Components

#### **Footer Component** (`/layout/Footer.tsx`)
**Key Features:**
- Three-column glassmorphic design
- Newsletter subscription integration
- Dynamic stock price display
- Contact information
- Navigation links organized by:
  - Explore Properties section
  - Investment Hub section
  - Contact Us section
- Responsive mobile/desktop layouts
- Dark/light theme support

#### **Header Components**
- `Header.tsx` - Main header with navigation
- `HeaderLanding.tsx` - Landing page specific header
- `HeaderLight.tsx` - Light theme variant
- `ConditionalHeader.tsx` - Dynamic header selection
- `HeaderAwareContent.tsx` - Content wrapper for header-aware layouts

### Landing Page Components (`/landing`)

#### Main Map Component
- **SatellitePropertyMap.tsx** - Core interactive map component
  - 3D terrain visualization
  - Property markers and boundaries
  - Drone video integration
  - Mobile gyroscopic effects
  - Red Line geological feature
  - Property information panels

#### Mobile Navigation
- `MobileNav.tsx` - Main mobile navigation menu
- `MobileNavWrapper.tsx` - Hydration-safe wrapper
- `SimpleMobileNav.tsx` - Simplified variant
- `BottomMobileNav.tsx` - Bottom navigation bar
- `AlwaysVisibleMobileNav.tsx` - Persistent mobile nav
- `MobileNavDebug.tsx` - Debug version for development

#### Stock/Price Tickers
- `LiveStockQuote.tsx` - Real-time stock price display
- `LiveStockQuoteV2.tsx` - Updated version
- `LiveGoldPrice.tsx` - Gold price tracker
- `LiveGoldPriceLiquidGlass.tsx` - Glassmorphic gold price
- `LiveSilverPriceLiquidGlass.tsx` - Silver price display
- `LandingTicker.tsx` - Main ticker component
- `LandingTickerV2.tsx` - Updated ticker
- `LandingTickerLiquidGlass.tsx` - Glassmorphic ticker
- `StockWidget.tsx` - Embeddable stock widget
- `StockModal.tsx` - Stock information modal

#### Visual Effects & 3D
- `GlassmorphicPyramid.tsx` - 3D pyramid visualization
- `PyramidInterior.tsx` - Pyramid interior view
- `DataPyramid.tsx` - Data visualization pyramid
- `GoldenTriangleParticles.tsx` - Particle effects
- `MetalRivers.tsx` - Animated metal flow effect
- `LiquidMetalGradient.tsx` - Gradient animations
- `AnimatedContourLines.tsx` - Topographic animations

#### Content Sections
- `LandingHero.tsx`, `LandingHeroV2.tsx`, `LandingHeroV3.tsx` - Hero sections
- `LandingFeatures.tsx`, `LandingFeaturesV2.tsx` - Feature showcases
- `LandingStats.tsx` - Statistics display
- `LandingMetrics.tsx` - Key metrics
- `LandingShowcase.tsx` - Property showcase
- `LandingHighlights.tsx` - Company highlights
- `LandingInvestors.tsx` - Investor information
- `LandingPartners.tsx` - Partner logos
- `LandingStory.tsx` - Company story
- `LandingTimeline.tsx` - Historical timeline
- `LandingTestimonials.tsx` - Customer testimonials
- `LandingFAQ.tsx` - Frequently asked questions
- `LandingCTA.tsx`, `LandingCTAV2.tsx` - Call-to-action sections

#### Map Components
- `GoldenTriangleMap.tsx` - Regional map view
- `StrategicLocationMap.tsx` - Strategic location display
- `StrategicLocationMapOptimized.tsx` - Optimized version
- `SatelliteMapVisualization.tsx` - Satellite imagery
- `MapSkeleton.tsx` - Loading skeleton

#### Property Components
- `PropertyInfo.tsx` - Property information display
- `LandingProperties.tsx` - Properties section
- `LandingClaimBoundaries.tsx`, `V2.tsx`, `V3.tsx` - Claim visualizations

### Section Components (`/sections`)
- `HeroSection.tsx` - Generic hero section
- `AboutHero.tsx` - About page hero
- `ContactHero.tsx` - Contact page hero
- `PropertiesHero.tsx` - Properties page hero
- `ProjectsHero.tsx` - Projects page hero
- `ResourcesHero.tsx` - Resources page hero
- `PropertyHero.tsx` - Individual property hero
- `PropertyOverview.tsx` - Property details
- `PropertyGeology.tsx` - Geological information
- `PropertyHighlights.tsx` - Key highlights
- `PropertyGallery.tsx` - Image gallery
- `ContactForm.tsx` - Contact form component
- `ContactInfo.tsx` - Contact details
- `NewsSection.tsx` - News display
- `TeamSection.tsx` - Team members
- `CompanyStory.tsx` - Company narrative
- `ValuesSection.tsx` - Company values
- `TimelineSection.tsx` - Timeline display
- `StatsSection.tsx` - Statistics
- `FeaturesSection.tsx` - Feature list
- `CTASection.tsx` - Call-to-action
- `WhyLuxorSection.tsx` - Value proposition
- `ExplorationApproach.tsx` - Methodology
- `CommoditiesGrid.tsx` - Commodity display
- `DepositTypes.tsx` - Deposit information
- `OfficesSection.tsx` - Office locations
- `ProjectsList.tsx` - Project listings
- `ProjectsMap.tsx` - Projects map view
- `ProjectsSection.tsx` - Projects overview
- `PropertiesGrid.tsx` - Property grid layout

### RAM Property Components (`/ram`)
- `MuxDroneVideo.tsx` - Drone video player
- `MuxThumbVideo.tsx` - Video thumbnails
- `DroneVideo.tsx` - Drone video wrapper

### UI Components (`/ui`)
- `Button.tsx` - Base button component
- `MagneticButton.tsx` - Interactive magnetic button
- `NewsModal.tsx` - News article modal
- `StickyNewsletterBar.tsx` - Newsletter subscription bar

### Effects Components (`/effects`)
- `GoldDustParticles.tsx` - Gold particle animation effects

### Utility Components
- `ThemeProvider.tsx` - Theme context provider
- `ChunkedVideo.tsx` - Video chunking for large files
- `ChunkedVideoLoader.tsx` - Chunked video loader
- `DevCacheHelper.tsx` - Development cache utilities

## 🔌 API Routes (`/app/api`)

1. **Stock & Commodity Data**
   - `/api/stock-quote` - Live stock price (TSX-V: LUXR)
   - `/api/gold-price` - Gold spot price
   - `/api/silver-price` - Silver spot price
   - `/api/trade-history` - Trading history
   - `/api/recent-trades` - Recent trade data

2. **Content & Communication**
   - `/api/news` - News articles and press releases
   - `/api/contact` - Contact form submission
   - `/api/newsletter/subscribe` - Newsletter subscription

3. **Media**
   - `/api/stream-video` - Video streaming endpoint

## 🎨 Styling & Assets

### Styles (`/styles`)
- `fonts.css` - Custom font definitions
- `mobile-nav-fix.css` - Mobile navigation fixes
- `investor-glassmorphic.css` - Glassmorphic effects
- `safari-mobile-nav-fix.css` - Safari-specific fixes
- Various mobile optimization CSS files

### Fonts (`/public/fonts`)
- Aeonik (Regular, Extended variants)
- Switzer Variable
- Proxima Nova family
- Helvetica Now Display
- Custom brand fonts

### Images (`/public/images`)
- Company logos (Silver Grail, RAM)
- Property images and maps
- Background textures
- Icon assets

## 📊 Data Files

### GeoJSON Data (`/public/geojson`, `/geojson`)
- Property boundaries
- Red Line geological feature
- Adjacent properties
- Drilling locations
- Mineralized zones
- Road access points

### Property Data
- Shapefile conversions
- Claim boundaries
- Exploration data
- Historical mining data

## 🛠️ Configuration Files

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `vercel.json` - Vercel deployment settings
- `nodemon.json` - Development server config

## 📝 Documentation

- `CLAUDE.md` - AI assistant instructions
- `README.md` - Project overview
- `SITE_INDEX.md` - This file
- Various deployment and setup guides

## 🔄 Development Scripts

### Utility Scripts
- `start-dev.sh` - Development server starter
- `clear-cache.sh` - Cache clearing utility
- `deploy-to-vercel.sh` - Deployment script
- Various Python scripts for data processing

### Testing Scripts
- Playwright test files
- Viewport testing utilities
- Visual regression tests

## 🌐 External Integrations

1. **Mapbox** - Interactive maps and 3D terrain
2. **Mux** - Video hosting and streaming
3. **TSX Market Data** - Stock price feeds
4. **AWS SES** - Email services
5. **Cloudflare R2** - Media storage
6. **Vercel** - Hosting platform

## 📱 Mobile Features

- Responsive design for all screen sizes
- Mobile-specific navigation
- Touch gestures and swipe support
- Gyroscopic 3D effects (iOS)
- Optimized video loading
- Bottom navigation bar

## 🔐 Security & Performance

- Server-side rendering (SSR)
- Dynamic imports for code splitting
- Image optimization
- Lazy loading components
- Cache management
- API rate limiting

## 🎯 Key User Journeys

1. **Property Exploration**
   - Homepage → Interactive Map → Property Selection → Property Details

2. **Investor Information**
   - Homepage → Investors → Stock Info/Reports/News

3. **Company Information**
   - Homepage → About → Team/History/Values

4. **Contact & Newsletter**
   - Any Page → Footer → Contact/Newsletter Signup

## 🚀 Recent Updates

- Enhanced mobile navigation with swipe gestures
- Glassmorphic UI design system
- RAM property drone video integration
- Real-time stock price updates
- Interactive 3D terrain visualization
- Newsletter subscription system
- Responsive property cards with hover effects

---

*Last Updated: January 2025*
*Silver Grail Resources Ltd. - TSX-V: LUXR*
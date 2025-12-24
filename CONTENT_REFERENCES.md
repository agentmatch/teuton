# Content References

This file tracks the location of important content and components in the Luxor Metals website.

## Landing Page Component (SatellitePropertyMap.tsx)
**File:** `/components/landing/SatellitePropertyMap.tsx`

### Main Headline
- **Location:** Lines 2106-2108
- **Content:** "Large-Scale Discovery / Potential In A World-Class / Gold & Copper District"
- **Notes:** Appears after zoom animation completes, uses Aeonik font
- **Style Issue Fixed:** Removed `uppercase` class from line 2091 to prevent ALL CAPS display

### Stats Section
- **Location:** Lines 2113-2202
- **Content:** "6 Projects • 21,558 Hectares • Red Line • ∞ Unlimited"
- **Notes:** Below main headline, uses Aeonik Extended font

### Tennyson Property Headline
- **Location:** Lines 1540-1560
- **Content:** "TENNYSON PROPERTY"
- **Notes:** Shows when zoomed into Tennyson property view

### Major Projects Array
- **Location:** Lines 22-52
- **Projects:** KSM (Seabridge), Brucejack (Newmont), Treaty Creek (TUD), Eskay Creek, Granduc
- **Notes:** Red Chris was removed

### Red Line Info Box
- **Location:** Lines 2306-2375
- **Content:** Info box that appears when clicking on red geological lines

### Map Configuration
- **Location:** Lines 203-211
- **Initial Center:** [-130.3, 56.5]
- **Initial Zoom:** 7

### Font Faces
- **Location:** Lines 1252-1369
- **Fonts:** Aeonik Extended, Decimal, Big Caslon, Helvetica Now Display

## Header Component (HeaderLanding.tsx)
**File:** `/components/layout/HeaderLanding.tsx`

### Gradient Overlay
- **Location:** Lines with gradient overlay styling
- **Height:** Changed from 300% to 120px to prevent covering map labels

## Investors Page
**File:** `/app/investors/page.tsx`

### Page Title
- **Location:** Line with "Investor Centre" heading
- **Notes:** Changed from "Investor Relations"

### Stock Ticker
- **File:** `/components/ui/StockTicker.tsx`
- **Notes:** Shows TSX-V: LUXR with real-time data from TMX

### Trade History
- **API Route:** `/app/api/trade-history/route.ts`
- **Notes:** Fetches real trade data from TMX using Puppeteer

## Map Data Files
- **Property Boundaries (Original UTM):** `/public/images/Luxor Properties.geojson` (EPSG:26909 - UTM Zone 9N)
- **Property Boundaries (Converted):** `/public/images/luxor-properties-wgs84.geojson` (EPSG:4326 - WGS84)
- **Red Line Data:** `/public/images/red-line-transition-main-lines.geojson`
- **QMD File:** `/public/images/Luxor Properties.qmd` (metadata file)
- **Conversion Script:** `/scripts/convert-geojson-projection.js` (converts UTM to lat/lon)

## API Routes
- **Stock Quote:** `/app/api/stock-quote/route.ts` - Fetches stock data from TMX
- **Trade History:** `/app/api/trade-history/route.ts` - Fetches trade history from TMX

## Important State Variables
- `showMainContent` - Controls when main headline appears
- `showTennysonView` - Controls Tennyson property view
- `mapReady` - Indicates when map is fully loaded
- `showInfoBox` - Controls red line info box visibility

## Animation Timings
- Initial map load delay: 1000ms
- First zoom duration: 3000ms
- Second zoom duration: 4000ms
- Content reveal delay: 3500ms
- Total time to headline: ~7500ms
- Header fade-in duration: 1.5s (synchronized with headline)
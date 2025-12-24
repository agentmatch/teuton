# Luxor Metals - Development Reference

## CRITICAL: News Release Content Rules

### NEVER EDITORIALIZE NEWS RELEASES
- **ALWAYS use news release text VERBATIM** - exactly as provided by the user
- **DO NOT summarize, paraphrase, or editorialize news release content**
- **DO NOT add bullet points or restructure provided press release text**
- **COPY the exact text word-for-word** when implementing news releases
- **This applies to ALL news releases, press releases, and official announcements**

## Quick Code References

### Front Page Top Header Overlay
**Location**: `/components/landing/SatellitePropertyMap.tsx`
- **Line ~3810-3822**: Top gradient overlay that covers header area
- **Comment**: `{/* TOP HEADER GRADIENT OVERLAY - Edit colors here to change top of page overlay */}`
- **Current Color**: Dark teal `#042A2B` / `rgba(4, 42, 43, 0.95)` fading to transparent
- **Height**: Mobile `140px` | Desktop `160px`
- **Z-Index**: `99999` (on top of everything)

**To change overlay color**, edit the `background` property:
```javascript
background: 'linear-gradient(to bottom, rgba(12, 12, 11, 0.95) 0%, rgba(12, 12, 11, 0.7) 40%, rgba(12, 12, 11, 0.3) 70%, transparent 100%)'
```

### Teuton Color Scheme
```
#363128 - Dark brown/olive (54, 49, 40)
#0c0c0b - Almost black (12, 12, 11)
#f3bd1b - Gold (243, 189, 27)
#f6dd8a - Light gold/cream (246, 221, 138)
```

### Map Gradient Overlays
**Location**: `/components/landing/SatellitePropertyMap.tsx`
- **Line ~871-894**: Map fill overlays (gradient-base and gradient-blue layers)
- **Current**: Using `#0c0c0b` and `#363128` for dark brown theme

### Property View Text Styling (Main Map)
**Location**: `/components/landing/SatellitePropertyMap.tsx`

#### Property Name Heading (When Zoomed In)
- **Line 4775-4794**: Main property heading with gradient text
- **Style**: `linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)`
- **Font**: Aeonik Extended, 600 weight
- **Size**: Mobile `clamp(1.8rem, 6vw, 2.5rem)` | Desktop `clamp(2.5rem, 4.5vw, 4rem)`

#### Property Description Box
- **Line 4817-4826**: Property description paragraph
- **Style**: `linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)`
- **Font**: Aeonik Medium, 500 weight
- **Size**: Mobile `clamp(0.945rem, 2.7vw, 1.08rem)` | Desktop `clamp(1.05rem, 1.5vw, 1.3rem)`

### Properties Page Components
**Location**: `/app/properties/page.tsx`

#### Property Cards
- **Line 474-610**: PropertyCard component definition
- **Line 427**: "View Property" button text
- **Line 412-417**: Button hover effect (text glow)
- **Hover Style**: `textShadow: '0 0 20px rgba(254, 217, 146, 0.8), 0 0 40px rgba(254, 217, 146, 0.4)'`

### RAM Property Page Gradient Reference
**Location**: `/app/properties/ram/page.tsx`
- **Standard Gradient**: `linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)`
- **Subtle Variant**: `linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)`
- **Used on**: Headings, stats, key highlights

## RAM Drone Videos

### Mux Playback IDs
The RAM property features two drone exploration videos hosted on Mux:

- **RAM Drone Video 1**: `RPb301S7bOIXXQCzqDHSfO8qioVUIGyxlBjYhsYia5Wk`
  - M3U8 URL: `https://stream.mux.com/RPb301S7bOIXXQCzqDHSfO8qioVUIGyxlBjYhsYia5Wk.m3u8`
  - Description: Northern zone overview - Malachite Porphyry area

- **RAM Drone Video 2**: `yuJk01P8BH1yYaADncP3Z3Bu00wgBvPSOtak005D5xJuBc`
  - M3U8 URL: `https://stream.mux.com/yuJk01P8BH1yYaADncP3Z3Bu00wgBvPSOtak005D5xJuBc.m3u8`
  - Description: Southern zone overview - Mitch zone VMS targets

### Usage Locations
1. **RAM Property Page** (`/app/properties/ram/page.tsx`)
   - Videos displayed in the drone video card section with toggle buttons
   - Lines 35-39: Playback ID constants defined
   - Lines 762-826: MuxDroneVideo component implementation

2. **Front Page Drone Map View** (`/components/landing/SatellitePropertyMap.tsx`)
   - Lines 45-48: MUX_DRONE_PLAYBACK_IDS constants
   - Lines 6362-6374: MuxDroneVideo component in drone modal
   - Thumbnail button uses separate video for preview
   - Full drone view modal shows both videos with switching capability

### Implementation Notes
- Videos use the `MuxDroneVideo` component for optimized HLS playback
- Adaptive bitrate streaming adjusts quality based on connection
- Autoplay, loop, and muted for seamless experience
- Responsive design for mobile and desktop

### 4K Quality Configuration
The MuxDroneVideo component is configured to automatically select the highest quality:
- `maxResolution="2160p"` - Allows up to 4K (2160p) resolution playback
- `minResolution="1080p"` - Ensures at least Full HD (1080p) quality
- `preferPlayback="mse"` - Uses Media Source Extensions for better quality control and adaptive streaming

This configuration ensures videos play at 4K when available and the user's connection supports it, while maintaining at least 1080p quality for a premium viewing experience.

## RECENT STYLING UPDATES (Session: 2025-01-XX)

### Drone Video Integration & UI Improvements
**Components Updated**: `SatellitePropertyMap.tsx`, `Header.tsx`, `MuxThumbVideo.tsx`

#### 1. RAM Drone Video Button (Front Page)
- **Location**: `/components/landing/SatellitePropertyMap.tsx:3698-3958`
- **Thumbnail Video**: Mux video player with Playback ID (kept as thumbnail preview)
- **Scaling**: 140% video scale to eliminate black bars
- **Button Text**: "2025 DRILLING PROGRAM" with matching RAM Property gradient
- **Animation**: Immediate fade out on click (200-300ms), delayed drone video appearance (3s after map zoom)

#### 2. Fade Animations for Drone View
- **Heading Fade**: Main page heading fades out when entering drone view (`showSplitScreen` state)
- **Button Fade**: RAM exploration button fades out with slight scale animation
- **Timing**: Fast fade out (200-300ms), normal fade in (500-800ms)
- **Return Animation**: Smooth fade back in when clicking "Return to Overview"

#### 3. Header Dropdown Enhancement
**Location**: `/components/layout/Header.tsx:16-243`
- **Properties Dropdown**: Added dropdown to Properties nav link with all property pages
- **Property List**: All Properties, RAM, Gold Mountain, Fiji, Midas, Konkin Silver, Clone, Tonga
- **Styling**: Silver metallic theme matching logo with shimmer animation
- **Smart Navigation**: Click Properties → main page, hover → dropdown, click dropdown items → specific pages
- **Anti-conflict**: 500ms protection prevents accidental navigation after dropdown clicks

#### 4. Silver Grail Logo Enhancement
**Location**: `/components/layout/Header.tsx:123-128`
- **Size Increase**: 20% larger logo while maintaining header bounds
- **Mobile**: 2.75rem → 3.3rem height, 11rem → 13.2rem width  
- **Desktop**: 3.5rem → 4.2rem height, 13rem → 15.6rem width
- **Transform**: Reduced scale from 1.05 to 1.0 since base size increased

### Technical Implementation Notes

#### Mux Video Player Configuration
```javascript
// Thumbnail video with 140% scale for full coverage
<MuxThumbVideo
  playbackId="Gx2Oj1vHHVq2TWsnsX201qpJFroj9d5DwKxHyNMoDoaQ"
  width={isMobile ? 130 : 180}
  height={isMobile ? 110 : 130}
/>
```

#### Dropdown Styling Pattern
```javascript
// Metallic silver theme with glassmorphic background
background: 'linear-gradient(135deg, rgba(13, 15, 30, 0.98) 0%, rgba(10, 12, 25, 0.95) 100%)'
backdropFilter: 'blur(30px) saturate(200%)'
border: '1px solid rgba(192, 192, 192, 0.15)'
boxShadow: '0 15px 50px rgba(0, 0, 0, 0.6), 0 5px 20px rgba(192, 192, 192, 0.1)'
```

#### Animation State Management
```javascript
// Fade animations based on drone view state
animate={{ 
  opacity: showMainContent && !selectedProperty && !showSplitScreen && mapReady ? 1 : 0,
  y: showMainContent && !selectedProperty && !showSplitScreen && mapReady ? 0 : 20
}}
transition={{ 
  duration: showSplitScreen ? 0.3 : 0.8,  // Faster fade out
  ease: "easeOut"
}}
```

## CACHE BUSTING & DEVELOPMENT REFRESH

### Preventing Browser Cache Issues

When making CSS/styling changes, browsers often cache old versions. Solutions:

#### 1. **Quick Cache Clear Script**
```bash
# Run this to clear all caches and restart
./clear-cache.sh
```

#### 2. **Browser Hard Refresh**
- **Mac**: Cmd + Shift + R
- **Windows/Linux**: Ctrl + Shift + F5
- **Alternative**: Ctrl + F5

#### 3. **Disable Cache in DevTools**
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Keep DevTools open while developing

#### 4. **Chrome Specific**
- DevTools → Application → Storage → Clear site data
- Or use Incognito/Private mode (Cmd/Ctrl + Shift + N)

#### 5. **Next.js Config**
The `next.config.js` is configured to disable caching in development:
- No-cache headers on all routes
- Unique chunk names with hash
- Disabled ETags

### When to Use Each Method:
- **CSS/Style changes**: Use hard refresh or clear-cache.sh
- **Component updates**: Usually normal refresh works
- **Persistent issues**: Run clear-cache.sh script
- **Testing production**: Use incognito mode

## COLOR PALETTE IMPLEMENTATION

### Properties Page Palette Example
When implementing a new color palette for card-based layouts:

```javascript
// Define palette at component level
const palette = {
  dark: '#0d0f1e',      // Deep navy - backgrounds
  blue: '#5c7ca3',      // Slate blue - secondary elements
  light: '#b5ccda',     // Light blue-gray - text
  peach: '#ffbe98',     // Warm peach - primary cards
  yellow: '#fed992'     // Soft yellow - accents
}
```

### Key Implementation Steps:
1. **Disable Background Maps**: Comment out `<BackgroundMap />` if it covers your background color
2. **Use Solid Card Backgrounds**: Apply main color as background, not low-opacity overlays
   ```javascript
   // Good - visible card color
   background: palette.peach,
   backgroundImage: `linear-gradient(135deg, rgba(13, 15, 30, 0.2), rgba(13, 15, 30, 0.4))`
   
   // Bad - barely visible
   background: `linear-gradient(135deg, ${palette.peach}15 0%, ...)`
   ```
3. **Adjust Text Colors**: Use dark text on light backgrounds for contrast
4. **Pass Palette to Components**: Include palette in component props for consistency
5. **Update All Elements**: Borders, dividers, buttons, and hovers should use palette colors

## QUALITY ASSURANCE RULES

### Before Making Any Change:
1. **TEST VISUALLY**: Always verify changes work correctly in the browser
2. **UNDERSTAND CONTEXT**: Read surrounding code to understand existing patterns
3. **PRESERVE WORKING CODE**: Never break functionality that's already working
4. **CHECK DEPENDENCIES**: Ensure all required elements (videos, images, styles) are properly referenced

### When Fixing Issues:
1. **IDENTIFY ROOT CAUSE**: Don't guess - inspect the actual problem using browser tools
2. **TEST FIX THOROUGHLY**: Verify the fix works on both mobile and desktop
3. **AVOID SIDE EFFECTS**: Ensure fixes don't break other parts of the component
4. **DOCUMENT CHANGES**: Clearly explain what was changed and why

### Code Quality Standards:
1. **CONSISTENCY**: Match existing code style and patterns in the file
2. **COMPLETENESS**: Finish one task completely before moving to the next
3. **PRECISION**: Make targeted changes, don't rewrite unrelated code
4. **VALIDATION**: Test that TypeScript compiles and the app runs without errors

### Common Pitfalls to Avoid:
1. **Z-INDEX CONFLICTS**: Always check z-index hierarchy before adding new layers
2. **VIDEO DISPLAY ISSUES**: Ensure video elements have proper dimensions and positioning
3. **RESPONSIVE BREAKAGE**: Test changes on both mobile and desktop viewports
4. **STATE MANAGEMENT**: Don't create conflicting state updates or race conditions

### Testing Checklist:
- [ ] Changes compile without TypeScript errors
- [ ] No console errors in browser
- [ ] Feature works on mobile devices
- [ ] Feature works on desktop
- [ ] No visual regressions in other parts of the app
- [ ] Videos/images load and display correctly
- [ ] Animations and transitions work smoothly

## Deployment Process

### Vercel Deployment with Slack Notifications

**IMPORTANT**: Always send a Slack notification after deploying to Vercel.

#### Vercel CLI Installation
Vercel CLI is already installed globally. If needed:
```bash
npm install -g vercel
```

#### Deployment Steps:
1. Deploy to Vercel production:
   ```bash
   vercel --prod
   # or
   npx vercel --prod
   ```
2. Send Slack notification with deployment details

#### Slack Webhook URL:
```
[REDACTED - See environment variables]
```

#### Slack Notification Template:
```bash
curl -X POST -H "Content-type: application/json" --data '{"text":"✅ *Luxor Metals Deployed Successfully*\n\n🆕 *Changes:*\n• [List your changes here]\n\n🔗 *Production URL:*\nhttps://luxormetals.vercel.app\n\n🔗 *Direct URL:*\nhttps://luxormetals-[deployment-id]-roman-romanalexands-projects.vercel.app"}' $SLACK_WEBHOOK_URL
```

#### Example Notification:
```json
{
  "text": "✅ *Luxor Metals Deployed Successfully*\n\n🆕 *Changes:*\n• Added Big Gold West property (359 hectares)\n• Updated total hectares from 21,558 to 21,917\n• Updated property count from 7 to 8\n• Integrated new GeoJSON property data\n\n🔗 *Production URL:*\nhttps://luxormetals.vercel.app\n\n🔗 *Direct URL:*\nhttps://luxormetals-qlfeck7qe-roman-romanalexands-projects.vercel.app"
}
```

## Mobile Menu Implementation

### Overview
The mobile menu in `SatellitePropertyMap.tsx` contains:
- Live LUXR stock ticker with glassmorphic styling
- Navigation items matching desktop header
- Contact information at bottom
- Proper spacing to avoid bottom navigation overlap

### Stock Ticker Implementation

#### Data Fetching
```javascript
// Fetch stock data on component mount
useEffect(() => {
  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/stock-quote')
      const data = await response.json()
      if (data && data.price !== undefined) {
        setStockData({
          symbol: data.symbol || 'TSX-V: LUXR',
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
```

#### Glassmorphic Styling
The ticker uses the same glassmorphic style as the desktop header:
```javascript
style={{
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.025) 100%)',
  backdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 2px 4px 0 rgba(255, 255, 255, 0.2), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)',
}}
```

### Mobile Menu Structure
```
Mobile Menu Container
├── LUXR Stock Ticker (glassmorphic)
│   ├── Symbol & Status Indicator
│   ├── Price Display
│   ├── Change Percentage
│   └── Volume
├── Navigation Items
│   ├── About
│   ├── Projects
│   ├── Investors
│   ├── News
│   ├── Contact
│   ├── Divider
│   ├── Overview Map
│   └── About Red Line
└── Contact Information (fixed at bottom)
    ├── Company Name
    ├── Address
    ├── Phone
    └── Email
```

### Key Features
1. **Live Data Updates**: Stock price fetches from `/api/stock-quote` every 5 minutes
2. **Status Indicator**: Green/red dot shows if data is live
3. **Responsive Design**: Proper spacing and scrolling with bottom navigation awareness
4. **Glassmorphic UI**: Matches desktop header aesthetic
5. **Price Formatting**: Handles both 2 and 3 decimal places based on price value

### API Endpoints
- `/api/stock-quote` - Returns LUXR stock data
- `/api/gold-price` - Returns gold price data (used in desktop header only)

### Color Scheme
- Primary Gold: `#FFFF77`
- White Text: `#FFFFFF`
- Positive Change: `#77FF77`
- Negative Change: `#FF7777`
- Muted Text: `rgba(255, 255, 255, 0.6)`

### Font Usage
- Primary: `'Switzer Variable', sans-serif`
- Extended (headers): `'Aeonik Extended', sans-serif`

## Commands
- Development: `npm run dev` (or `./start-dev.sh` for auto-restart)
- Development with auto-restart: `npm run dev:watch`
- Build: `npm run build`
- Lint: `npm run lint`
- Type Check: `npm run typecheck`

## Nodemon Setup (Added 2025-06-23, Enhanced 2025-06-23)

### Overview
Nodemon is configured to automatically restart the dev server when files change, always using port 3000. Enhanced with error monitoring and crash recovery.

### Starting Development Server

```bash
# Method 1: Enhanced monitor with error detection (RECOMMENDED)
./start-dev.sh

# Method 2: With cache cleaning
./start-dev.sh --clean-cache

# Method 3: Basic nodemon
npm run dev:watch

# Method 4: Traditional (no auto-restart)
npm run dev
```

### Available Scripts
- `npm run dev` - Standard Next.js dev server
- `npm run dev:watch` - Basic nodemon auto-restart
- `npm run dev:monitor` - Enhanced monitor with error detection
- `npm run dev:clean` - Clean start with port cleanup
- `npm run clean` - Remove .next and node_modules cache

### Enhanced Features (dev-monitor.js)
1. **Smart Error Detection**: Recognizes common Next.js errors and provides suggestions
2. **Crash Recovery**: Automatically handles Next.js crashes
3. **Port Management**: Ensures port 3000 is always used, kills conflicting processes
4. **Error Analysis**: Detects patterns like:
   - Module not found → suggests checking imports
   - Cannot find module → suggests running npm install
   - Type errors → suggests checking TypeScript
   - Memory issues → suggests restart
5. **Colored Output**: Easy to spot errors, warnings, and success messages

### Configuration Files
- **nodemon.json**: Main nodemon config
- **dev-server.js**: Basic crash recovery wrapper
- **dev-monitor.js**: Enhanced monitor with error analysis
- **start-dev.sh**: Clean startup script

### Why This Matters
- No more manual restarts when code breaks
- No more random port conflicts (always port 3000)
- Helpful error suggestions when things go wrong
- Consistent experience for all Claude instances
- Handles Next.js compilation errors gracefully

## Playwright Testing Setup

### Installation
```bash
npm install -D @playwright/test
npx playwright install
```

### Test Script Used
Created a comprehensive test script (`test-luxor-site.ts`) that tested:

1. **Desktop Experience**:
   - Initial page load and animations
   - Header visibility and interactions
   - Map zoom animations and property selection
   - Stock ticker functionality
   - Navigation menu interactions
   - Property modal displays

2. **Mobile Experience**:
   - Responsive layout at 375x667 (iPhone SE)
   - Mobile navigation visibility
   - Touch interactions and swipe gestures
   - Property selection on mobile
   - Gyroscopic effect permissions

### Running Tests
```bash
# Run all tests
npx playwright test

# Run with UI mode for debugging
npx playwright test --ui

# Run specific test file
npx playwright test test-luxor-site.ts

# Run in headed mode to see browser
npx playwright test --headed
```

### Key Test Patterns Used

#### Waiting for Animations
```typescript
// Wait for map to be ready
await page.waitForSelector('canvas.mapboxgl-canvas', { 
  state: 'visible',
  timeout: 30000 
})

// Wait for specific elements with custom timeout
await page.waitForSelector('.mobile-nav', { 
  state: 'visible',
  timeout: 10000 
})
```

#### Mobile Testing
```typescript
// Set mobile viewport
await page.setViewportSize({ width: 375, height: 667 })

// Test touch interactions
await page.tap('.property-button')

// Test swipe gestures
await page.touchscreen.swipe({
  startX: 300,
  startY: 400,
  endX: 100,
  endY: 400,
  steps: 10
})
```

#### Taking Screenshots
```typescript
// Capture state at different points
await page.screenshot({ 
  path: 'mobile-nav-visible.png',
  fullPage: false 
})
```

#### Console Logging
```typescript
// Capture console logs for debugging
page.on('console', msg => {
  console.log(`Browser console: ${msg.type()}: ${msg.text()}`)
})
```

### Common Issues Debugged

1. **Mobile Navigation Not Appearing**:
   - Used `page.evaluate()` to check computed styles
   - Verified z-index and display properties
   - Checked for hydration mismatches

2. **Map Loading Issues**:
   - Added longer timeouts for Mapbox initialization
   - Waited for specific map events before proceeding

3. **Animation Timing**:
   - Used `page.waitForTimeout()` for animation sequences
   - Checked element positions after transitions

### Debugging Commands
```bash
# Debug mode with slow motion
npx playwright test --debug --slow-mo=1000

# Generate HTML report
npx playwright show-report

# Record new tests
npx playwright codegen http://localhost:3000
```

## Git Information
- Repository location: `/Users/romanalexander/luxorwebsitelaunch/luxor-metals/.git/`
- Working directory: `/Users/romanalexander/luxorwebsitelaunch/luxor-metals/`

## RAM Property Page Design System Documentation

### Complete Design Implementation Reference for `/properties/ram/page.tsx`

This comprehensive documentation details every design element, animation, interaction pattern, and technical implementation used in the RAM property page. Use this as a template for creating consistent property pages across the site.

#### 1. PAGE ARCHITECTURE & STRUCTURE

**Core Dependencies:**
```typescript
- framer-motion: Animation library for all motion effects
- react-icons/fi: Feather icons for UI elements
- Dynamic imports: Lazy loading for performance
  - GoldDustParticles: Background particle effects
  - MuxDroneVideo: Video player component
```

**Color Palette Definition:**
```javascript
const palette = {
  dark: '#0d0f1e',      // Deep navy - primary text
  blue: '#5c7ca3',      // Slate blue - accents
  light: '#b5ccda',     // Light blue-gray - subtle elements
  peach: '#ffbe98',     // Warm peach - primary buttons/cards
  yellow: '#fed992'     // Soft yellow - highlights
}
```

#### 2. LAYOUT & SPACING SYSTEM

**Fluid Responsive Spacing Using CSS clamp():**
- Padding: `clamp(1.5rem, 4vw, 3rem)` - scales between mobile and desktop
- Gaps: `clamp(0.75rem, 2vw, 1rem)` - responsive grid gaps
- Margins: `clamp(2rem, 5vw, 3rem)` - section spacing
- Font sizes: `clamp(0.95rem, 1.5vw, 1rem)` - readable at all sizes

**Container Structure:**
- Max width: 6xl (1152px)
- Responsive padding: `0 clamp(1rem, 3vw, 1.5rem)`
- Z-index layering: Background (0) → Content (10) → Modals (9999)

#### 3. TYPOGRAPHY SYSTEM

**Font Families:**
- Headers: "Aeonik Extended, sans-serif" (weight 500)
- Body text: "Aeonik, sans-serif"
- Special elements: Custom weight variations

**Text Styling:**
- Header gradient text with animation
- Text shadows for depth: `0 2px 4px rgba(0, 0, 0, 0.5)`
- Opacity variations: `${palette.dark}CC` (80% opacity)

#### 4. GLASSMORPHIC DESIGN SYSTEM

**Three-Layer Glassmorphic Cards:**

**Layer 1 - Light Glass (Map/Image containers):**
```css
background: linear-gradient(135deg, 
  rgba(200, 200, 210, 0.95) 0%, 
  rgba(220, 225, 230, 0.9) 50%, 
  rgba(190, 195, 205, 0.95) 100%)
backdropFilter: blur(20px) saturate(120%)
border: 1px solid rgba(180, 185, 195, 0.6)
boxShadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3), 
  inset 0 2px 4px 0 rgba(255, 255, 255, 0.4), 
  inset 0 -2px 4px 0 rgba(0, 0, 0, 0.1)
```

**Layer 2 - Dark Glass (Feature boxes):**
```css
background: linear-gradient(135deg, 
  rgba(12, 14, 29, 0.7) 0%, 
  rgba(12, 14, 29, 0.85) 50%, 
  rgba(12, 14, 29, 0.7) 100%)
backdropFilter: blur(20px) saturate(150%)
border: 1px solid rgba(12, 14, 29, 0.6)
```

**Layer 3 - Accent Glass (Buttons/CTAs):**
```css
background: linear-gradient(135deg, 
  rgba(255, 190, 152, 0.9) 0%, 
  rgba(255, 190, 152, 0.8) 30%,
  rgba(254, 217, 146, 0.7) 70%,
  rgba(255, 190, 152, 0.85) 100%)
backdropFilter: blur(20px) saturate(200%) brightness(1.1)
border: 1px solid rgba(255, 255, 255, 0.3)
boxShadow: 0 0 20px rgba(13, 15, 30, 0.5), 
  0 0 40px rgba(13, 15, 30, 0.3)
```

#### 5. ANIMATION PATTERNS

**Page Load Sequence:**
1. Header fades in with `y: 20 → 0`
2. Stats grid staggers in (100ms delay between items)
3. Content sections fade in on scroll (Intersection Observer)

**Hover Interactions:**
- Scale: `hover:scale-[1.02]` for buttons
- Opacity shifts for inactive states
- Box shadow intensification on hover

**Motion Variants:**
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
```

#### 6. BACKGROUND & ATMOSPHERE

**Mountain Background Image:**
- Fixed position with cover sizing
- Quality: 90 for optimal file size/quality
- Will-change: transform for GPU acceleration

**Aurora Gradient Overlay:**
- Three-layer gradient mesh
- Static positioning to avoid scroll jank
- Opacity: 40% for subtlety

**Gold Dust Particles:**
- Lazy loaded component
- Fixed positioning
- Subtle animation loop

#### 7. KEY COMPONENT PATTERNS

**Stats Grid (4 columns on desktop, 2 on mobile):**
```jsx
<div className="grid grid-cols-2 md:grid-cols-4" 
     style={{ gap: `clamp(0.75rem, 2vw, 1rem)` }}>
  {/* Each stat box with glassmorphic styling */}
</div>
```

**Two-Column Content Layout:**
- Left: Primary content (map/image)
- Right: Supporting content (features/video)
- Stacks on mobile with proper spacing

**Image with Magnifier Effect:**
- Track mouse position relative to image
- Show magnified view at 2x zoom
- Glass lens effect with border and shadow
- Position calculations account for actual image bounds

#### 8. VIDEO INTEGRATION

**Drone Video Component:**
- Mux video player with lazy loading
- Glassmorphic container with title/description
- Toggle buttons for multiple views
- Consistent button styling with page theme

#### 9. MODAL SYSTEM

**Full-Screen Image Modal:**
- AnimatePresence for smooth transitions
- Dark overlay: `rgba(0, 0, 0, 0.95)`
- Escape key handling
- Sticky close button
- Scrollable image container

#### 10. RESPONSIVE BREAKPOINTS

**Mobile First Approach:**
- Base: < 768px
- Desktop: >= 768px (md breakpoint)
- Large: >= 1024px (lg breakpoint)

**Mobile Optimizations:**
- Simplified animations
- Stacked layouts
- Larger touch targets
- Disabled magnifier on mobile

#### 11. PERFORMANCE OPTIMIZATIONS

**Lazy Loading:**
- Dynamic imports for heavy components
- Loading states for better UX
- SSR disabled for client-only features

**Image Optimization:**
- Next.js Image component
- Priority loading for above-fold images
- Proper sizing constraints

**Animation Performance:**
- Will-change properties
- Transform3d for GPU acceleration
- Passive scroll listeners

#### 12. INTERACTION DETAILS

**Button States:**
- Default: Full opacity with glow
- Hover: Scale 1.02 with enhanced shadow
- Active: Scale 0.98 for tactile feedback
- Inactive: 70% opacity

**Scroll Effects:**
- Fade in sections on scroll
- No parallax to avoid jank
- Smooth transitions

#### 13. CONTENT SECTIONS STRUCTURE

**Section Order:**
1. Page Header (title + subtitle)
2. Key Stats Grid
3. Discovery Section with map
4. Geological Setting with link
5. Drill Program with core sample
6. News Release CTA
7. Bottom Navigation

**Each Section Pattern:**
```jsx
<section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
  <h2 style={{ fontFamily: "Aeonik Extended", color: palette.dark }}>
  <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1rem)' }}>
  {/* Content specific to section */}
</section>
```

#### 14. SPECIAL EFFECTS

**Magnifying Glass Effect:**
- 200x200px circular lens
- 2x magnification
- White border with shadow
- Glass reflection gradient overlay
- Handle element for realism

**Glow Effects:**
- Buttons: Double box-shadow for depth
- Active elements: Colored glow matching theme
- Text: Subtle text-shadow for readability

#### 15. ACCESSIBILITY CONSIDERATIONS

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Focus states for interactive elements
- ARIA labels where needed

### IMPLEMENTATION CHECKLIST

When creating new property pages, ensure:
- [ ] Color palette is defined
- [ ] Fluid spacing with clamp() is used
- [ ] Glassmorphic cards follow the 3-layer system
- [ ] Animations use consistent timing/easing
- [ ] Typography follows the font system
- [ ] Background has proper layering
- [ ] Sections follow the established pattern
- [ ] Mobile responsiveness is tested
- [ ] Performance optimizations are applied
- [ ] Interaction states are implemented
- [ ] Modal system works correctly
- [ ] Video integration follows the pattern
- [ ] Special effects are subtle and performant

## Recent Mobile UI Improvements (Session: 2025-06-22)

### Changes made to `/components/landing/SatellitePropertyMap.tsx`:

1. **Fixed header-headline spacing**
   - Adjusted top position for iPhone SE from '40px' to '80px' to prevent overlap with header
   - Line 2320: `top: isMobile ? (window.innerWidth >= 390 ? '130px' : '80px') : 'calc(160px - 2vh)'`

2. **Improved compass spacing**
   - Changed N/S positions from 15% to 8% from edges for more space from arrow
   - Changed E/W positions from 15% to 8% from edges for consistent spacing
   - Lines 2039, 2056, 2073, 2089

3. **Mobile menu improvements**
   - Changed contact section title from "CONTACT" to "LUXOR METALS LTD." (line 3639)
   - Removed redundant "Luxor Metals Ltd." paragraph below title
   - Added close button (X) in top right corner with proper centering (lines 3391-3415)
   - Added swipe-to-close functionality using useSwipe hook (lines 92, 95-102, 3378)
   - Fixed "TSX-V: LUXR" to display on one line with whiteSpace: 'nowrap' (lines 3384, 3422)

4. **Previous fixes in this session**
   - Removed "View Properties" from mobile menu
   - Projects button becomes split button with "Interactive Map" and "Comprehensive" options
   - Simplified mobile ticker styling (removed glassmorphic background)
   - Hide contact section on iPhone SE screens (< 390px width)
   - Removed "Select Property" button from overview map
   - Increased mobile ticker price font size from 14px to 18px
   - Used Aeonik Light font (weight 300) for desktop headline
   - Adjusted Treaty Creek and Eskay Creek label positions on mobile
   - Increased property overview map zoom by 15% on iPhone Pro and above
   - Various responsive adjustments for different iPhone models

### Mobile Menu Features
- **Close Methods**: X button, swipe right, or tap overlay
- **Swipe Gesture**: Right swipe with 50px threshold closes menu
- **Responsive**: Different layouts for iPhone SE vs larger phones
- **Stock Ticker**: Simplified inline design with live updates

### Mobile Header Logo Sizing (Session: 2025-06-22)

#### Desktop Header Logo (HeaderLanding.tsx)
The logo in HeaderLanding.tsx component (`/components/layout/HeaderLanding.tsx`) has responsive sizing:

#### Logo Size Breakpoints:
- **Base mobile** (< 390px): 
  - Dark theme: `h-11 w-44` (2.75rem x 11rem)
  - Light theme: `h-9 w-36` (2.25rem x 9rem)
- **iPhone Pro and above** (≥ 390px):
  - Dark theme: `h-[3.7rem] w-[14.85rem]` (35% increase from base: 1.2 × 1.25 × 0.9)
  - Light theme: `h-[3rem] w-[12.15rem]` (35% increase from base: 1.2 × 1.25 × 0.9)
- **Desktop** (md breakpoint):
  - Dark theme: `h-14 w-52` (3.5rem x 13rem)
  - Light theme: `h-11 w-44` (2.75rem x 11rem)

The total 35% increase calculation (20% then 25% then -10%):
- Dark mobile: 2.75rem × 1.2 × 1.25 × 0.9 = 3.7125rem (3.7rem), 11rem × 1.2 × 1.25 × 0.9 = 14.85rem
- Light mobile: 2.25rem × 1.2 × 1.25 × 0.9 = 3.0375rem (3rem), 9rem × 1.2 × 1.25 × 0.9 = 12.15rem

#### Mobile-Only Header Logo (SatellitePropertyMap.tsx)
The mobile logo in SatellitePropertyMap.tsx (`/components/landing/SatellitePropertyMap.tsx`) appears at line 3284-3364:

**Logo Size Breakpoints:**
- **Base mobile** (< 390px): 121px × 42px
- **iPhone Pro and above** (≥ 390px): 176px × 62px (35% increase from original)

The total 35% increase calculation (20% then 25% then -10%):
- Width: 131px × 1.2 × 1.25 × 0.9 = 176.85px (rounded to 176px)
- Height: 46px × 1.2 × 1.25 × 0.9 = 62.1px (rounded to 62px)

Location in code: Lines 3292-3293

### Property Descriptions (Session: 2025-06-22, Enhanced: 2025-06-23)

Added property descriptions that display when navigating to each property through the map interface in `SatellitePropertyMap.tsx`:

**Property Descriptions Object** (Lines 17-26) - Enhanced with technical data from NI 43-101 report:
- **TENNYSON**: Flagship porphyry Cu-Au target with 64 drill holes (1986-2013). Best intercepts: 229.5m @ 0.32% Cu, 0.25 g/t Au and 103.6m @ 0.42% Cu, 0.31 g/t Au. Located on Sulphurets thrust fault.
- **FOUR J'S**: Historic VMS target with 30+ drill holes. Recent discoveries up to 29.2 g/t Au, 17 g/t Ag. Three mineralization styles with combined VMS and porphyry potential.
- **BIG GOLD**: Hosts Roman and Zall massive sulfide occurrences. Exceptional grades: 27.7 g/t Au, 6,240 g/t Ag, 1.455% Cu. 2023 hyperspectral survey identified extensive alteration.
- **ESKAY RIFT**: Two large ZTEM conductors at depth. No drilling to date. Significant untested Eskay Creek-type VMS potential.
- **LEDUC**: Encircles historic Granduc mine. Recent drilling: 2.0m @ 1.97% Cu, 0.21 g/t Au. Features JK zone with magnetite-chalcopyrite assemblages.
- **LEDUC SILVER**: High-grade silver target with assays 99.2-386.6 g/t Ag
- **PEARSON**: 2.5km airborne EM anomaly with Granduc-like signature. 2022 boulder sampling returned anomalous Cu-Au.
- **CATSPAW**: 1928 exploration area within 4 J's property. 50m adit by Alphonse Thomas. Part of 4 J's drilling campaign (30 holes, ~2,000m).

**Display Implementation** (Lines 3313-3337):
- Descriptions appear below property name when selected
- Wrapped in glassmorphic container for better readability:
  - Dark semi-transparent background (rgba(0, 0, 0, 0.4))
  - Backdrop blur and saturation filters
  - Rounded corners with subtle border
  - Box shadow for depth
- Typography:
  - Font: Aeonik Medium (weight 500)
  - High contrast white text (95% opacity)
  - Responsive font sizing (mobile: 0.945-1.08rem [8% increase], desktop: 1.05-1.3rem)
  - Increased line height (1.7) for readability
  - Strong text shadow for additional contrast
- Maximum width of 800px on desktop for optimal line length

### Major Project Labels (Session: 2025-06-23)

The major project labels in `SatellitePropertyMap.tsx` are positioned and styled as follows:

#### Label Font Sizes (Line 1038):
- **Mobile**: `14.4px` (increased by 44% from 10px - two 20% increases)
- **Desktop**: `16px`
- **Font Family**: `'Aeonik Extended', sans-serif`
- **Font Weight**: 600

#### Desktop Positioning (Lines 865-871):
```javascript
const desktopPositions = {
  'KSM Project': { top: '50%', left: '-170px', transform: 'translateY(-50%)' },    // Left side
  'Brucejack': { bottom: '-50px', left: '60%', transform: 'translateX(-50%)' },    // Bottom, slightly right
  'Treaty Creek': { top: '-50px', left: '50%', transform: 'translateX(-50%)' },   // Top
  'Eskay Creek': { top: '-50px', left: '50%', transform: 'translateX(-50%)' },    // Top
  'Granduc': { bottom: '-50px', left: '50%', transform: 'translateX(-50%)' }       // Bottom
}
```

#### Mobile Positioning (Lines 874-880):
```javascript
const mobilePositions = {
  'KSM Project': { top: '30%', left: '-144px', transform: 'translateY(-50%)' },   // Left side, moved 42% total left
  'Brucejack': { bottom: '-25px', left: '50%', transform: 'translateX(-50%)' },    // Bottom, very close
  'Treaty Creek': { top: '-25px', left: '-44px', transform: 'translateY(-50%)' },  // Left side, moved 60% left total
  'Eskay Creek': { top: '-25px', left: '-44px', transform: 'translateY(-50%)' },   // Left side, moved 60% left total
  'Granduc': { bottom: '-25px', left: '50%', transform: 'translateX(-50%)' }       // Bottom, very close
}
```

#### Label Styling:
- Background: Glassmorphic style with blur and gradient
- Padding: Mobile `3px 6px`, Desktop `10px 18px`
- Border Radius: Mobile `8px`, Desktop `16px`
- Text Shadow: `0 1px 4px rgba(0,0,0,0.9)`
- Letter Spacing: Mobile `0.08em`, Desktop `0.05em`

### Mobile Heading Responsiveness (Session: 2025-06-23)

Applied responsive vw units for mobile heading:
- **Padding**: Changed from fixed `16px` to `4vw` for equal gaps on all screen sizes
- **Font Size**: Updated to `clamp(1.1rem, 5.5vw, 2rem)` to fit on single lines with proper spacing
- **White Space**: Added `nowrap` to prevent line breaks within each line
- **Text Transform**: Added uppercase styling for mobile heading
- **Text Updates**: "Large Scale Discovery" (no hyphen) on mobile only, "World-Class" keeps hyphen on all devices
- **Consistent Spacing**: Now scales proportionally with viewport width
- **Line Breaks**: Three distinct lines as specified

### Elegant Minimalism Headline Effect (Session: 2025-06-23)

Applied elegant weight transition animation to desktop headline only:
- **Desktop Animation**: `elegant-reveal` - weight transitions from 200 to 300 over 1s
- **Mobile Font**: Aeonik Extended Bold (weight 700) - no animation
- **Timing**: 0.3s delay, ease-out timing function (desktop only)
- **Effect**: Creates subtle "materializing" effect on desktop
- **Color**: Unified cream color (#FAF5E4) for both mobile and desktop
- **Typography**: Clean, minimal approach without 3D effects or metallic styling

### Stats Section Updates (Session: 2025-06-23)

#### Mobile Stats Changes:
- **Removed "Red Line" stat** from mobile view (desktop still shows all 4 stats)
- **Centered remaining 3 stats** with gap-4 spacing
- **Removed dividers on mobile** for better centering
- **Increased all mobile stat sizes by 25%**:
  - Number font size: `clamp(1.375rem, 3.5vw, 1.75rem)` (was `clamp(1.1rem, 2.8vw, 1.4rem)`)
  - Label font size: `clamp(0.703125rem, 1.875vw, 0.859375rem)` (was `clamp(0.5625rem, 1.5vw, 0.6875rem)`) - additional 25% increase
  - Infinity symbol: `clamp(2rem, 4.75vw, 2.5rem)` (was `clamp(1.6rem, 3.8vw, 2rem)`)
- **Adjusted spacing**: Reduced marginTop to -2px for labels, -4px for infinity symbol

### Mobile Map Zoom Enhancement (Session: 2025-06-23)

Increased mobile project overview map zoom to 50% total:
- **iPhone Pro and above (≥390px)**: 
  - maxZoom: 17.25 (original 11.5) - 50% total increase
  - zoom: 14.4 (original 9.6) - 50% total increase
- **Smaller phones (<390px)**:
  - maxZoom: 14.35 (original ~9.57) - 50% total increase
  - zoom: 11.9 (original ~7.93) - 50% total increase

### Bottom Navigation Fix (Session: 2025-06-23)

Fixed MobileNav disappearing on Vercel production:
- **Issue**: `isMobile` state was initialized as `false` causing SSR/hydration mismatch
- **Solution**: Initialize with `typeof window !== 'undefined' ? window.innerWidth < 768 : false`
- **Result**: Bottom navigation now properly renders on production builds

### Enhanced Bottom Navigation Fix (Session: 2025-06-23)

Implemented multiple safeguards to ensure MobileNav always appears on production:
1. **MobileNavWrapper Component**: Created a client-side wrapper that handles hydration properly
2. **Force Display**: Added `display: block` inline style to MobileNav
3. **Global CSS Override**: Added mobile-nav-fix.css with !important rules
4. **Production-Safe Rendering**: Wrapper checks window size after mount

#### Files Created:
- `/components/landing/MobileNavWrapper.tsx`: Client-side wrapper for hydration safety
- `/styles/mobile-nav-fix.css`: CSS overrides to force visibility on mobile

#### Implementation:
```tsx
// MobileNavWrapper handles client-side rendering
useEffect(() => {
  setShouldShow(window.innerWidth < 768 && showMainContent)
}, [showMainContent])
```

This multi-layered approach ensures the mobile navigation will appear on Vercel production builds regardless of SSR/hydration issues.

### Mobile Stats Vertical Alignment Fix (Session: 2025-06-23)

Fixed vertical alignment issues with mobile stats:
- Changed container from `items-center` to `items-center justify-center`
- Set consistent fixed height for number containers: `height: '2rem'` on mobile
- Changed alignment from `alignItems: 'baseline'` to `alignItems: 'center'`
- Added `justifyContent: 'center'` for proper centering
- Normalized marginTop to `2px` for all stat labels (was inconsistent -2px, -4px)
- Added `lineHeight: 1` to labels for consistent spacing
- Removed position adjustments (top: '-0.05em') from infinity symbol

Result: All three stats (Properties, Hectares, Potential) now align vertically on mobile devices.

### Production Issues Fix (Session: 2025-06-23)

#### 1. Mobile Logo Alignment
- Fixed logo sitting too high compared to hamburger button
- Changed top offset from `-7px` to `+3px` for iPhone Pro sizes
- Both logo and hamburger now align at same vertical position

#### 2. Smoother Initial Zoom Animation
- Increased mobile fitBounds duration from 4000ms to 6000ms
- Added custom easing function for smoother acceleration
- Increased setTimeout delay from 3000ms to 4000ms for better transition timing
- Result: Less aggressive, more pleasant initial zoom on mobile

#### 3. iOS Gyroscopic Permission Fix
- Added user interaction requirement for iOS 13+ devices
- Permission now requested on first touchstart or click event
- Stores event listeners for cleanup
- Non-iOS devices continue to work without permission

#### 4. Enhanced MobileNavWrapper
- Added `hasMounted` state to prevent hydration issues
- Renders placeholder div during SSR to prevent layout shifts
- Only checks window size after component mounts
- Better handling of showMainContent prop changes

#### 5. Stronger CSS Overrides
- Added more specific selectors to mobile-nav-fix.css
- Force translateY(0) to prevent animation conflicts
- Target divs with z-index: 100005 specifically
- Added rules for motion div children

These fixes address all production deployment issues while maintaining smooth user experience.

### Gyroscopic 3D Effects (Session: 2025-06-23)

#### Implementation Details:
- **Device Orientation State**: Added `deviceOrientation` state to track beta (forward/backward tilt) and gamma (left/right tilt)
- **Event Listeners**: Implemented deviceorientation event with iOS permission handling
- **Range Limiting**: Limited tilt values to ±30 degrees for subtle effect
- **Reduced Motion**: Respects user's motion preference settings

#### Mobile Map Gyroscopic Effect:
- **Base Pitch**: 65 degrees
- **Base Bearing**: -14.4 degrees (4% counter-clockwise)
- **Pitch Adjustment**: `deviceOrientation.beta * 0.3` (subtle forward/backward tilt)
- **Bearing Adjustment**: `deviceOrientation.gamma * 0.5` (slightly more pronounced left/right rotation)
- **Implementation**: Added useEffect that updates map camera with `easeTo` animation (100ms duration)
- **Constraints**: Pitch clamped between 0-85 degrees

#### Mobile Logo Gyroscopic Effect:
- **Transform**: `rotateX(${deviceOrientation.beta * 0.3}deg) rotateY(${deviceOrientation.gamma * 0.3}deg)`
- **Parent Container**: Added `perspective: 1000px` and `transformStyle: preserve-3d`
- **Transition**: 0.1s ease-out for smooth movement
- **Z-Depth**: Added `translateZ(20px)` for 3D depth effect

#### Code Changes (SatellitePropertyMap.tsx):
- Lines 254-276: Device orientation event handling
- Lines 1243-1265: useEffect for map gyroscopic updates
- Lines 3462-3473: Logo 3D transform implementation
- Line 1241: Added cleanup for deviceorientation event listener
- Line 515: Increased mobile terrain exaggeration to 1.3 (from 1.1)
- Lines 3174-3189: Disable terrain during property transitions (desktop)
- Lines 4177-4209: Disable terrain during property transitions (mobile)
- Lines 4252-4267: Disable terrain during overview return (mobile)
- Lines 1401-1425: Disable terrain during Tennyson zoom

#### Terrain Management:
- **3D Terrain**: Enabled on both mobile and desktop with different exaggeration levels
- **Mobile Exaggeration**: 1.3x for more pronounced 3D effect with gyroscope
- **Desktop Exaggeration**: 1.1x for subtle depth
- **Transition Handling**: Terrain temporarily disabled during all map transitions to prevent "rumbling"
- **Re-enabling**: Terrain re-enabled after moveend event with appropriate exaggeration

### Critical Mobile Fixes (Session: 2025-06-23, Updated: 2025-06-23)

#### Latest Fixes:
1. **Enable Motion Button**:
   - Fixed duplicate handleOrientation functions that prevented event listeners from working
   - Added fallback for non-iOS devices
   - Added debug indicator showing gyroscope values when active
   - Added alerts to confirm when motion is enabled
   - Button now works on all devices, not just iOS

2. **Mobile Navigation Visibility**:
   - Removed motion animation that could cause rendering issues
   - Added inline styles to force visibility
   - Wrapped MobileNav in a div that controls display based on showMainContent
   - Added !important to display style to override any conflicts

### Critical Mobile Fixes (Session: 2025-06-23)

#### Mobile Navigation Not Appearing on Real Phones:
- **Issue**: Navigation worked in Chrome DevTools but not on actual phones
- **Root Cause**: SSR/hydration mismatch and overly complex mobile detection
- **Solution**: 
  - Simplified MobileNavWrapper to use only viewport width detection
  - Added SSR-safe null state handling
  - Force wrapped MobileNav in a div with inline display:block
  - Enhanced CSS with multiple media queries (hover:none, pointer:coarse)
  - Added viewport metadata with viewportFit: 'cover' for iPhone notch

#### 3D Terrain Not Rendering on Mobile:
- **Issue**: Terrain wasn't showing on mobile devices
- **Solution**:
  - Added WebGL support detection before enabling terrain
  - Added error handling for terrain source loading
  - Added 1-second delay on mobile to ensure source loads
  - Added try-catch blocks and error event listeners

#### Gyroscopic Effect Interrupting Initial Zoom:
- **Issue**: Gyroscopic updates were interfering with zoom animation
- **Solution**:
  - Set `isTransitioning` to true during zoom animation
  - Reset flag after animation completes
  - Gyroscopic effect now checks isTransitioning state

### Device Orientation Permission Prompt (Session: 2025-06-23)

#### Implementation:
- **Automatic Prompt**: Shows after 2 seconds on iOS mobile devices
- **State Management**: 
  - `showOrientationPrompt`: Controls prompt visibility
  - `orientationPermissionGranted`: Tracks if permission was granted
- **UI Design**:
  - Glassmorphic dark modal with golden accents
  - Two buttons: "Enable Motion" (primary) and "Not Now" (secondary)
  - Close button (×) in top right corner
  - Positioned above bottom navigation (bottom-24)
  - Max width 400px, centered with 1rem padding
- **Permission Flow**:
  - Only shown on iOS devices that require permission
  - Non-iOS devices automatically get permission
  - Permission persists for the session once granted
  - First touch/click also triggers permission request

### Recent Improvements (Session: 2025-06-23)

#### Property Descriptions Update
- Increased mobile font size by 8% (from 0.875-1rem to 0.945-1.08rem)
- Added two new property descriptions based on luxorreport.pdf:
  - **CATSPAW**: Historic exploration area with 50m adit and silver veins up to 1,309.7 g/t Ag
  - **LEDUC SILVER**: High-grade silver target with assays from 99.2-386.6 g/t Ag

#### Particle Effect Fix (HeaderLanding.tsx)
- Fixed sparkle particles z-index issue on line 164
- Added `style={{ zIndex: 1000 }}` to bring particles to front layer
- Ensures hover effects are visible above other elements

#### Logo Vectorization (Session: 2025-06-23)
- Installed potrace and imagemagick for PNG to SVG conversion
- Created two SVG versions:
  - luxorlogonew.svg (4.9KB) - Basic version
  - luxorlogonew-detailed.svg (12KB) - Detailed version
- Updated components to use SVG instead of PNG:
  - HeaderLanding.tsx (line 190)
  - SatellitePropertyMap.tsx (line 3414)

### Property Labels Location (Session: 2025-09-05)

The property labels on the map are located in `/components/landing/SatellitePropertyMap.tsx`:
- **Lines 1275-1344**: Property label HTML structure and styling
- **Line 1328-1344**: Property name text with gradient animation styling
- The labels are created as part of the marker HTML in the `addPropertyMarkers` function
- Each label uses the animated gradient effect matching the RAM Property headline
- The gradient animation: `linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)` with 8s infinite animation

### Git Commit Message Template
When git is available, use:
```
feat: Enhance mobile UI with improved spacing and interactions

- Fix header-headline overlap on all screen sizes
- Increase compass letter spacing from arrow (15% to 8%)
- Add close button and swipe-to-close for mobile menu
- Update contact section title to "LUXOR METALS LTD."
- Ensure TSX-V: LUXR displays on single line
- Previous: Remove View Properties, add split Projects button
- Previous: Simplify ticker, hide contact on SE, adjust map labels

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Vercel Deployment URL Format

When deploying to Vercel, always provide URLs in this format for easy copying:

**Production URL:**
https://luxormetals.vercel.app

**Direct URL:**
https://luxormetals-[deployment-id]-roman-romanalexands-projects.vercel.app

Note: Each URL should be on its own line with no additional formatting or markdown links.
## Mux Video Implementation Guide

### Installing Mux Player
```bash
npm install @mux/mux-player-react
```

### Component Structure
The MuxDroneVideo component (`/components/ram/MuxDroneVideo.tsx`) handles Mux video playback with:
- Dynamic import to avoid SSR issues
- Named export (not default export)
- Client-side rendering only
- Custom loading state

### Importing MuxDroneVideo Component
```javascript
// CORRECT - Named export with proper dynamic import
const MuxDroneVideo = dynamic(
  () => import("@/components/ram/MuxDroneVideo").then(mod => ({ default: mod.MuxDroneVideo })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-white">Loading video...</div>
      </div>
    )
  }
)
```

### Using MuxDroneVideo
```jsx
<MuxDroneVideo
  playbackId="YOUR_MUX_PLAYBACK_ID"
  title="Video Title"  // Required prop
  autoPlay            // Optional, defaults to true
  muted              // Optional, defaults to true
  loop               // Optional, defaults to true
/>
```

### Key Requirements
1. **Named Export**: MuxDroneVideo is exported as `export function MuxDroneVideo()` not `export default`
2. **Dynamic Import**: Must use `.then(mod => ({ default: mod.MuxDroneVideo }))` to handle named export
3. **Title Prop**: The `title` prop is required for video metadata
4. **SSR Disabled**: Always set `ssr: false` in dynamic import options

### Common Errors and Solutions
- **"Element type is invalid. Received a promise..."**: Wrong dynamic import syntax - use the correct named export import
- **"Missing required prop 'title'"**: Always provide a title prop to MuxDroneVideo
- **Module not found**: Ensure @mux/mux-player-react is installed


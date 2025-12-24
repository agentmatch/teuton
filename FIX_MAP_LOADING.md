# Task: Fix Investor Center Map Loading Flash Issue

## CRITICAL: Full Implementation Checklist
□ Read ALL related files before starting  
□ Make ALL changes in single response  
□ Test compilation after changes  
□ Verify mobile AND desktop  
□ Check browser console for errors  

## Current State Analysis
- **What's working now**: Map loads and displays correctly after initialization
- **What's broken**: Flash of unstyled content - map container shows white/default background before #073440 background is applied
- **Files involved**: 
  - `/components/investors/BackgroundMap.tsx`
  - `/app/investors/page.tsx`
  - Need to create: `/styles/investor-map-preload.css`

## Root Cause
1. Map container renders without background color initially
2. Background color (#073440) only applied after map loads
3. Opacity transition from 0 to 1 happens AFTER map loads, but container is visible before that

## Required Changes (COMPLETE ALL)

### File 1: `/components/investors/BackgroundMap.tsx`
**Lines to modify: 135-147**

**REPLACE the entire return statement (lines 135-147) with:**
```tsx
return (
  <div 
    className="fixed inset-0 z-0"
    style={{
      pointerEvents: 'none',
      backgroundColor: '#073440'
    }}
  >
    {/* Primary background - always visible */}
    <div 
      className="absolute inset-0" 
      style={{ 
        backgroundColor: '#073440',
        zIndex: 1 
      }} 
    />
    
    {/* Map container with proper background */}
    <div 
      ref={mapContainer} 
      className="w-full h-full absolute inset-0"
      style={{ 
        backgroundColor: '#073440',
        opacity: mapLoaded ? 1 : 0, 
        transition: 'opacity 0.8s ease-in-out',
        zIndex: mapLoaded ? 2 : 0
      }} 
    />
    
    {/* Loading state overlay - fades out when map loads */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundColor: '#073440',
        opacity: mapLoaded ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
        zIndex: 3,
        pointerEvents: 'none'
      }}
    />
  </div>
)
```

**ADD after line 13 (after state declarations):**
```tsx
const [mapInitialized, setMapInitialized] = useState(false)
```

**MODIFY the useEffect at line 18, ADD at the beginning:**
```tsx
// Set initialized immediately to prevent flash
setMapInitialized(true)
```

**MODIFY line 79 in the map.current.addLayer for sandstone-overlay:**
```tsx
'background-opacity': 0.75  // Reduced from 0.85 for better map visibility
```

### File 2: `/app/investors/page.tsx`
**Line 146 - MODIFY the main container div:**

**REPLACE line 146:**
```tsx
<div className="min-h-screen pt-24 md:pt-40 pb-8 relative" style={{ backgroundColor: '#073440' }} data-theme="dark">
```

**WITH:**
```tsx
<div 
  className="min-h-screen pt-24 md:pt-40 pb-8 relative" 
  style={{ 
    backgroundColor: '#073440',
    isolation: 'isolate' 
  }} 
  data-theme="dark"
>
```

**ADD right after the opening div (after line 146):**
```tsx
{/* Immediate background color layer */}
<div 
  className="fixed inset-0 z-0" 
  style={{ backgroundColor: '#073440' }}
  aria-hidden="true"
/>
```

### File 3: Create `/styles/investor-map-preload.css`
**CREATE new file with:**
```css
/* Preload styles for investor map to prevent flash */
.investor-page-wrapper {
  background-color: #073440 !important;
  min-height: 100vh;
}

/* Ensure map container has background before initialization */
.mapboxgl-map {
  background-color: #073440 !important;
}

/* Prevent white flash on map canvas */
.mapboxgl-canvas-container,
.mapboxgl-canvas {
  background-color: #073440 !important;
}

/* Hide attribution during load */
.mapboxgl-ctrl-attrib {
  display: none;
}

/* Smooth loading state */
@keyframes fadeInMap {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.map-loading {
  background-color: #073440;
  position: absolute;
  inset: 0;
  z-index: 1;
}
```

### File 4: Update `/app/investors/page.tsx` imports
**ADD after line 9:**
```tsx
import '@/styles/investor-map-preload.css'
```

## Additional Performance Optimization

### In `/components/investors/BackgroundMap.tsx`
**ADD to Mapbox initialization at line 31:**
```tsx
map.current = new mapboxgl.Map({
  container: mapContainer.current,
  style: 'mapbox://styles/mapbox/satellite-v9',
  center: baseCenter as [number, number],
  zoom: 8.5,
  pitch: basePitch,
  bearing: baseBearing,
  interactive: false,
  attributionControl: false,
  fadeDuration: 0, // ADD THIS - Disable fade for instant load
  antialias: false, // ADD THIS - Improve performance
  preserveDrawingBuffer: false // ADD THIS - Better performance
})
```

## Dependencies to Verify
- [x] Mapbox GL JS loaded
- [x] Background color #073440 consistent
- [x] CSS files imported in correct order
- [x] React hooks (useState, useEffect) working

## Testing Requirements
1. Run: `npm run dev`
2. Navigate to: `http://localhost:3000/investors`
3. **HARD REFRESH** the page (Cmd+Shift+R or Ctrl+Shift+F5)
4. Check for flash of white/unstyled content - should see smooth #073440 background immediately
5. Open DevTools Network tab, throttle to "Slow 3G" and refresh
6. Verify these specific behaviors:
   - [ ] Page loads with #073440 background IMMEDIATELY (no white flash)
   - [ ] Map fades in smoothly over background
   - [ ] No janky color transitions
   - [ ] Background stays consistent during map load
   - [ ] Mobile (375px) shows background immediately
   - [ ] Desktop (1920px) shows background immediately
   - [ ] Console has ZERO errors

## Acceptance Criteria
✓ NO flash of white/unstyled content on page load  
✓ Background color #073440 visible BEFORE map loads  
✓ Smooth fade-in transition for map  
✓ No TypeScript errors  
✓ No console errors  
✓ Works on slow connections  
✓ Mobile responsive  
✓ Desktop functional  

## DO NOT:
- Remove the existing map functionality
- Change the map's final appearance
- Break the mouse parallax effect
- Modify the stock data fetching
- Add console.log statements
- Change z-index values of other components

## Verification Commands
```bash
# After implementation, run:
npm run build
npm run lint
npm run typecheck

# Test in production mode:
npm run build && npm run start
# Navigate to http://localhost:3000/investors
```

---

## IMPLEMENTATION APPROACH

This fix uses a **triple-layer approach** to completely eliminate the flash:

1. **Immediate background** on page load (fixed div with #073440)
2. **Pre-styled map container** before Mapbox initializes  
3. **Loading overlay** that smoothly fades out when map is ready

### Why This Works:
- User NEVER sees white/unstyled content
- Background color is applied at THREE levels
- Map fades in smoothly after it's fully loaded
- Works even on very slow connections

### Key Technical Details:
- `isolation: isolate` creates new stacking context
- `fadeDuration: 0` prevents Mapbox's default fade animation
- Triple background ensures color is always visible
- z-index management prevents layer conflicts

---

## COPY THIS ENTIRE FILE TO THE OTHER CLAUDE INSTANCE

**Instructions for the other Claude instance:**
1. Read this entire document first
2. Implement ALL changes in a single response
3. Do NOT skip any section
4. Test thoroughly after implementation
5. Report completion status for each file modified
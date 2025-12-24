# Task: Apply Investor Page Theme to All Pages

## CRITICAL: Full Implementation Checklist
□ Read ALL files before starting  
□ Make ALL changes in single response  
□ Import BackgroundMap to all pages  
□ Apply consistent styling  
□ Test all pages after changes  
□ Verify mobile AND desktop  

## Theme Components to Copy
1. **Background Map** with #073440 ocean color
2. **Dark theme** with isolation stacking
3. **Gold Dust Particles** effect
4. **Consistent padding** (pt-24 md:pt-40 pb-8)
5. **Container styling** (max-w-7xl)
6. **Glassmorphic effects** where applicable

## Current State Analysis
- **Investor page**: Fully themed with map background
- **News page**: Client-side, has particles but NO map background
- **Projects page**: Server-side, simple components, NO theming
- **About page**: Client-side, has particles but NO map background
- **Contact page**: Client-side, has particles but NO map background

## Required Changes (COMPLETE ALL)

### File 1: `/app/news/page.tsx`
**Current**: Missing map background and consistent theme
**Changes needed:**

**ADD after line 10 (after GoldDustParticles import):**
```tsx
// Import BackgroundMap for consistent theme
const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})
```

**FIND the main return statement (around line 100+) and REPLACE the outer container:**
```tsx
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
      {/* EXISTING PAGE CONTENT GOES HERE - don't modify */}
    </div>
  </div>
)
```

### File 2: `/app/projects/page.tsx`
**Current**: Server component, needs conversion to client
**COMPLETE REPLACEMENT:**

```tsx
'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ProjectsHero } from '@/components/sections/ProjectsHero'
import { ProjectsMap } from '@/components/sections/ProjectsMap'
import { ProjectsList } from '@/components/sections/ProjectsList'

// Lazy load for performance
const GoldDustParticles = dynamic(() => import('@/components/effects/GoldDustParticles'), {
  ssr: false
})

const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})

export default function ProjectsPage() {
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
        <ProjectsHero />
        <ProjectsMap />
        <ProjectsList />
      </div>
    </div>
  )
}
```

### File 3: `/app/about/page.tsx`
**Current**: Has particles but missing map
**Changes needed:**

**ADD after line 11 (after GoldDustParticles import):**
```tsx
// Import BackgroundMap for consistent theme
const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})
```

**FIND the main return statement and REPLACE the outer container:**
```tsx
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
      {/* EXISTING PAGE CONTENT GOES HERE - don't modify */}
    </div>
  </div>
)
```

### File 4: `/app/contact/page.tsx`
**Current**: Has particles but missing map
**Changes needed:**

**ADD after line 10 (after GoldDustParticles import):**
```tsx
// Import BackgroundMap for consistent theme
const BackgroundMap = dynamic(() => import('@/components/investors/BackgroundMap'), {
  ssr: false
})
```

**FIND the main return statement and REPLACE the outer container:**
```tsx
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
      {/* EXISTING PAGE CONTENT GOES HERE - don't modify */}
    </div>
  </div>
)
```

## Styling Consistency Rules

### For ALL pages, ensure:
1. **Background color**: `#073440` (sandstone/ocean blue)
2. **Padding top**: `pt-24 md:pt-40` (consistent header spacing)
3. **Padding bottom**: `pb-8` (consistent footer spacing)
4. **Container**: `container mx-auto px-4 md:px-6 max-w-7xl`
5. **Z-index hierarchy**:
   - Background: `z-0`
   - BackgroundMap: `z-0`
   - GoldDustParticles: default
   - Content: `z-10`
6. **Data theme**: `data-theme="dark"`

### Text Colors:
- **Primary headings**: `text-[#E5E5E5]` or `text-white`
- **Body text**: `text-white/70` or `text-white/60`
- **Muted text**: `text-white/40`
- **Accent**: `text-[#FFFF77]` (gold)

### Component Updates Needed:

**UPDATE any section components that have their own backgrounds:**
- Remove individual background colors
- Let the page background show through
- Adjust text colors for dark theme if needed

## Testing Requirements
After implementation:
1. Run: `npm run dev`
2. Visit each page:
   - [ ] `/investors` - Should already work
   - [ ] `/news` - Check map loads
   - [ ] `/projects` - Check conversion to client works
   - [ ] `/about` - Check map loads
   - [ ] `/contact` - Check map loads
3. For each page verify:
   - [ ] Background is consistent #073440
   - [ ] Map loads without flash
   - [ ] Particles appear
   - [ ] Content is readable
   - [ ] Mobile responsive (375px)
   - [ ] Desktop looks good (1920px)

## Common Issues to Avoid

### DO NOT:
- Change the BackgroundMap component itself
- Modify header/footer components (they should adapt)
- Remove existing page functionality
- Add console.log statements
- Break TypeScript types

### WATCH OUT FOR:
- Server components that need client conversion (projects)
- Z-index conflicts with existing modals
- Content that assumes light background
- Forms or interactive elements getting blocked

## Verification Commands
```bash
# Type check all pages
npm run typecheck

# Build to ensure no SSR issues
npm run build

# Check for any console errors
npm run dev
# Then visit each page and check console
```

## Expected Result
All pages should have:
1. Consistent dark ocean background (#073440)
2. Subtle animated map in background
3. Gold particles floating
4. Consistent spacing and layout
5. Professional, cohesive appearance

## COPY THIS ENTIRE FILE TO THE OTHER CLAUDE INSTANCE

**Tell the other Claude:**
```
Implement ALL changes in /APPLY_INVESTOR_THEME.md in a single response.
Apply the investor page theme to news, projects, about, and contact pages.
Do not skip any section. Report completion for each file.
```
# RAM Property Page Styling Checklist

This comprehensive checklist ensures all property pages match the exact styling of the RAM property page.

## Property Pages to Update:
- [ ] `/app/properties/gold-mountain/page.tsx`
- [ ] `/app/properties/tonga/page.tsx` 
- [ ] `/app/properties/clone/page.tsx`
- [ ] `/app/properties/[slug]/page.tsx`
- [ ] `/app/properties/ram-enhanced/page.tsx`

## 1. IMPORTS & DEPENDENCIES
- [ ] Import `Image` from 'next/image'
- [ ] Import all required React Icons (FiArrowLeft, FiExternalLink, FiMapPin, FiActivity, FiX, FiZoomIn, FiZoomOut)
- [ ] Import HeaderAwareContent if needed
- [ ] All dynamic imports for lazy loading components

## 2. COLOR PALETTE
```javascript
const palette = {
  dark: '#0d0f1e',      // Deep navy
  blue: '#5c7ca3',      // Slate blue
  light: '#b5ccda',     // Light blue-gray
  peach: '#ffbe98',     // Warm peach - for property cards
  yellow: '#fed992'     // Soft yellow
}
```

## 3. PAGE CONTAINER SETUP
- [ ] `backgroundColor: palette.dark`
- [ ] `isolation: 'isolate'`
- [ ] `data-theme="dark"`
- [ ] Container classes: `"min-h-screen pt-20 md:pt-32 pb-20"`

## 4. BACKGROUND IMAGE & OVERLAY
### Mountain Landscape Background
- [ ] Background image: `/images/rambackground.png`
- [ ] `fill`, `priority`, `quality={90}`
- [ ] `objectFit: 'cover'`, `objectPosition: 'center'`
- [ ] `willChange: 'transform'`, `transform: 'translateZ(0)'`
- [ ] `backfaceVisibility: 'hidden'`

### Aurora Gradient Overlay (3 Layers)
- [ ] **Layer 1**: Base gradient with rgba(3, 23, 48, 0.9) to rgba(3, 23, 48, 0.7)
- [ ] **Layer 2**: Static gradient mesh with radial gradients, opacity 40%, blur(40px)
- [ ] **Layer 3**: Static glow with radial gradient at top, opacity 25%

## 5. CONTAINER STYLING
- [ ] Max width: `max-w-6xl`
- [ ] Padding: `padding: clamp(1rem, 3vw, 1.5rem)`
- [ ] Relative z-index: `relative z-10`

## 6. BACK BUTTON (ABSOLUTE POSITIONED)
- [ ] **Position**: `absolute top-0 left-4 md:left-6`
- [ ] **Background**: Peachy gradient
  ```
  linear-gradient(135deg, 
    rgba(255, 190, 152, 0.9) 0%, 
    rgba(255, 190, 152, 0.8) 30%,
    rgba(254, 217, 146, 0.7) 70%,
    rgba(255, 190, 152, 0.85) 100%)
  ```
- [ ] **Effects**: `backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)'`
- [ ] **Border**: `1px solid rgba(255, 255, 255, 0.3)`
- [ ] **Hover**: `hover:scale-[1.02]`
- [ ] **Color**: `palette.dark`
- [ ] **Font**: `"Aeonik, sans-serif"`

## 7. PAGE HEADER
### Main Heading (H1)
- [ ] **Font**: `"Aeonik Extended", sans-serif`, weight 500
- [ ] **Size**: Mobile `clamp(2.2rem, 7.5vw, 3.1rem)`, Desktop `4rem`
- [ ] **Gradient Text**: 
  ```
  background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)'
  backgroundSize: '200% 200%'
  WebkitBackgroundClip: 'text'
  WebkitTextFillColor: 'transparent'
  animation: 'gradientShift 8s ease infinite'
  ```
- [ ] **Effects**: `filter: 'drop-shadow(0 2px 20px rgba(160, 196, 255, 0.3))'`
- [ ] **Mix blend**: `mixBlendMode: 'screen'`
- [ ] **Animation**: Initial blur, spring motion

### Description Text
- [ ] **Font**: `"Aeonik Extended", sans-serif`, weight 500
- [ ] **Container**: `max-w-3xl mx-auto px-4 md:px-0`
- [ ] **Gradient Text**: 
  ```
  background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)'
  backgroundSize: '200% 200%'
  animation: 'gradientShift 10s ease infinite'
  ```
- [ ] **Shadow**: `filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))'`
- [ ] **Two-line structure** with specific spacing

## 8. KEY STATS SECTION
### Container
- [ ] **Animation**: Framer Motion variants with staggerChildren
- [ ] **Grid**: `grid-cols-2 md:grid-cols-4`
- [ ] **Gap**: `clamp(0.75rem, 2vw, 1rem)`
- [ ] **Margin**: `marginBottom: clamp(2rem, 5vw, 3rem)`

### Individual Stat Cards
- [ ] **Component**: `motion.div` with spring animations
- [ ] **Background**: 
  ```
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)'
  ```
- [ ] **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- [ ] **Padding**: `clamp(0.75rem, 2vw, 1rem)`
- [ ] **Hover Effects**: Scale and border changes
- [ ] **Numbers**: Gradient text with gradientShift animation
- [ ] **Labels**: Gradient text with gradientShift animation

## 9. MAIN CONTENT CONTAINER
- [ ] **Background**: Peachy glassmorphic gradient
  ```
  background: linear-gradient(135deg, 
    rgba(255, 190, 152, 0.9) 0%, 
    rgba(255, 190, 152, 0.8) 30%,
    rgba(254, 217, 146, 0.7) 70%,
    rgba(255, 190, 152, 0.85) 100%)
  ```
- [ ] **Effects**: `backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)'`
- [ ] **Border**: `1px solid rgba(255, 255, 255, 0.3)`
- [ ] **Shadow**: Multi-layer box shadow with insets
- [ ] **Padding**: `clamp(1.5rem, 4vw, 3rem)`
- [ ] **Border radius**: `16px`

## 10. SECTION HEADINGS (H2)
- [ ] **Font**: `"Aeonik Extended, sans-serif"`, weight 500
- [ ] **Size**: `text-2xl md:text-3xl`
- [ ] **Color**: `palette.dark`
- [ ] **Margin**: `marginBottom: clamp(1rem, 3vw, 1.5rem)`

## 11. PARAGRAPH TEXT
- [ ] **Font**: `"Aeonik, sans-serif"`
- [ ] **Size**: `clamp(0.95rem, 1.5vw, 1rem)`
- [ ] **Color**: `${palette.dark}CC` (with transparency)
- [ ] **Margin**: `marginBottom: clamp(1rem, 3vw, 1.5rem)`
- [ ] **Line height**: `leading-relaxed`

## 12. BUTTONS & LINKS
### Article/External Links
- [ ] **Background**: Peachy gradient (same as back button)
- [ ] **Effects**: Same backdrop filter and border
- [ ] **Hover**: `hover:scale-[1.02]`
- [ ] **Icon**: FiExternalLink with proper sizing
- [ ] **Font**: `"Aeonik, sans-serif"`

### Bottom Navigation Button
- [ ] **Styling**: Identical to back button
- [ ] **Position**: `mt-12 flex justify-between items-center`

## 13. SPECIAL COMPONENTS

### Image Cards/Containers
- [ ] **Background**: Light glassmorphic gradient
  ```
  background: 'linear-gradient(135deg, rgba(200, 200, 210, 0.95) 0%, rgba(220, 225, 230, 0.9) 50%, rgba(190, 195, 205, 0.95) 100%)'
  ```
- [ ] **Effects**: `backdropFilter: 'blur(20px) saturate(120%)'`
- [ ] **Border**: `1px solid rgba(180, 185, 195, 0.6)`
- [ ] **Shadow**: Complex multi-layer shadows

### Feature Cards (Dark)
- [ ] **Background**:
  ```
  background: 'linear-gradient(135deg, rgba(12, 14, 29, 0.7) 0%, rgba(12, 14, 29, 0.85) 50%, rgba(12, 14, 29, 0.7) 100%)'
  ```
- [ ] **Border**: `1px solid rgba(12, 14, 29, 0.6)`
- [ ] **Headings**: White text with gradient animation

## 14. MODAL STYLING
- [ ] **Background**: `rgba(0, 0, 0, 0.95)`
- [ ] **Close buttons**: Peachy gradient styling
- [ ] **z-index**: `[9999]`

## 15. CSS ANIMATIONS
- [ ] **@keyframes gradientShift**:
  ```css
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  ```
- [ ] **Style tag**: `<style jsx global>`

## 16. RESPONSIVE DESIGN
- [ ] All `clamp()` functions for responsive spacing
- [ ] Mobile-specific font sizes and layouts
- [ ] Grid breakpoints (`lg:grid-cols-2`, etc.)
- [ ] Mobile/desktop conditional styling

## 17. MOTION/ANIMATION
- [ ] Framer Motion variants for containers
- [ ] Stagger animations for stats
- [ ] Spring physics for hover effects
- [ ] Initial animations with blur effects

## VERIFICATION CHECKLIST
After applying all changes to each property page:

- [ ] **Visual Consistency**: Page looks identical to RAM page structure
- [ ] **Gradient Text**: All headings have animated gradients
- [ ] **Button Styling**: All buttons match RAM page peachy style
- [ ] **Background**: Mountain image with aurora overlay
- [ ] **Content Cards**: Proper glassmorphic styling
- [ ] **Animations**: Smooth transitions and hover effects
- [ ] **Typography**: Consistent font families and weights
- [ ] **Spacing**: All clamp() responsive spacing
- [ ] **Colors**: Consistent use of palette variables
- [ ] **Icons**: Proper sizing and styling

## FINAL TESTING
- [ ] **Desktop**: All elements render correctly
- [ ] **Mobile**: Responsive design works properly  
- [ ] **Hover States**: All interactive elements respond
- [ ] **Animations**: Gradient shifts and motion work
- [ ] **Navigation**: Back buttons and links function
- [ ] **Accessibility**: Proper contrast and focus states
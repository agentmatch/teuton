# COMPREHENSIVE RAM Property Page Styling Checklist V2

## ALL Property Pages That Need Updates:
- [ ] `/app/properties/gold-mountain/page.tsx`
- [ ] `/app/properties/tonga/page.tsx`
- [ ] `/app/properties/clone/page.tsx`
- [ ] Components for Fiji, Midas, and others that use [slug] system

## COMPLETE ELEMENT-BY-ELEMENT CHECKLIST

### 1. PAGE CONTAINER
```tsx
<div className="min-h-screen pt-20 md:pt-32 pb-20" 
     style={{ backgroundColor: palette.dark, isolation: 'isolate' }} 
     data-theme="dark">
```

### 2. BACKGROUND LAYERS (EXACT COPY)
```tsx
{/* Mountain landscape background */}
<div className="fixed inset-0 z-0" aria-hidden="true" 
     style={{ 
       willChange: 'transform',
       transform: 'translateZ(0)',
       backfaceVisibility: 'hidden'
     }}>
  <Image 
    src="/images/rambackground.png"
    alt="Mountain landscape"
    fill
    priority
    quality={90}
    style={{ 
      objectFit: 'cover',
      objectPosition: 'center',
      willChange: 'transform',
      transform: 'translateZ(0)'
    }}
  />
  {/* Aurora gradient overlay with 3 layers */}
</div>
<GoldDustParticles />
```

### 3. MAIN CONTAINER
```tsx
<div className="container mx-auto max-w-6xl relative z-10" 
     style={{ padding: `0 clamp(1rem, 3vw, 1.5rem)` }}>
```

### 4. BACK BUTTON (MUST BE ABSOLUTE)
```tsx
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.5 }}
  className="absolute top-0 left-4 md:left-6"
>
  <Link href="/properties" 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 190, 152, 0.9) 0%, 
            rgba(255, 190, 152, 0.8) 30%,
            rgba(254, 217, 146, 0.7) 70%,
            rgba(255, 190, 152, 0.85) 100%)`,
          backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: palette.dark
        }}>
    <FiArrowLeft className="w-5 h-5" />
    <span style={{ fontFamily: "Aeonik, sans-serif" }}>Back to Properties</span>
  </Link>
</motion.div>
```

### 5. PAGE HEADER - EXACT STRUCTURE
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="text-center"
  style={{ marginBottom: `clamp(2rem, 5vw, 3rem)` }}
>
  {/* H1 with exact animation and gradient */}
  <motion.h1 
    initial={{ y: 100, opacity: 0, filter: 'blur(20px)' }}
    animate={{ 
      y: 0, 
      opacity: 1, 
      filter: 'blur(0px)',
    }}
    transition={{ 
      duration: 0.8, 
      ease: "easeOut",
      filter: { duration: 1.2 }
    }}
    className="text-white mb-4 md:mb-6 relative"
    style={{ 
      fontFamily: "'Aeonik Extended', sans-serif", 
      fontWeight: 500,
      fontSize: isMobile ? 'clamp(2.2rem, 7.5vw, 3.1rem)' : '4rem',
      lineHeight: '1.1',
      background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 8s ease infinite',
      filter: 'drop-shadow(0 2px 20px rgba(160, 196, 255, 0.3))',
      mixBlendMode: 'screen',
    }}>
    [Property Name] Property
  </motion.h1>
  
  {/* Description paragraph */}
  <div className="text-lg sm:text-lg md:text-xl max-w-3xl mx-auto px-4 md:px-0"
       style={{ fontFamily: "Aeonik Extended, sans-serif", fontWeight: 500 }}>
    <motion.p
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'gradientShift 10s ease infinite',
        letterSpacing: '0.02em',
        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))',
      }}
    >
      <span style={{ display: 'block' }}>[Line 1 of description]</span>
      <span style={{ display: 'block', marginTop: '0.3rem' }}>[Line 2 of description]</span>
    </motion.p>
  </div>
</motion.div>
```

### 6. STATS SECTION - COMPLETE WITH HOVER HANDLERS
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }}
  className="grid grid-cols-2 md:grid-cols-4"
  style={{ gap: `clamp(0.75rem, 2vw, 1rem)`, marginBottom: `clamp(2rem, 5vw, 3rem)` }}
>
  {/* EACH STAT CARD MUST HAVE THIS EXACT STRUCTURE */}
  <motion.div 
    className="rounded-xl text-center transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
    variants={{
      hidden: { 
        opacity: 0, 
        y: 40,
        scale: 0.8,
        filter: 'blur(10px)'
      },
      visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 12,
          duration: 0.6
        }
      }
    }}
    whileHover={{
      y: -5,
      transition: { type: "spring", stiffness: 300 }
    }}
    style={{
      padding: `clamp(0.75rem, 2vw, 1rem)`,
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)',
      border: `1px solid rgba(255, 255, 255, 0.08)`,
      borderRadius: '16px',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
      e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.015) 0%, rgba(160, 196, 255, 0.025) 50%, rgba(255, 255, 255, 0.015) 100%)';
      e.currentTarget.style.boxShadow = 'none';
    }}>
    <p 
      className="font-bold mb-1 transition-all duration-300"
      style={{ 
        fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
        background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 50%, #ffffff 100%)',
        backgroundSize: '200% 200%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'gradientShift 8s ease infinite',
        filter: 'drop-shadow(0 2px 10px rgba(160, 196, 255, 0.3))',
        display: 'inline-block'
      }}>
      [NUMBER]
    </p>
    <p className="text-xs uppercase tracking-wider font-medium transition-all duration-300" style={{ 
      background: 'linear-gradient(135deg, #ffffff 0%, #a0c4ff 60%, #ffffff 100%)',
      backgroundSize: '200% 200%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'gradientShift 10s ease infinite',
      filter: 'drop-shadow(0 1px 4px rgba(160, 196, 255, 0.2))',
      display: 'block'
    }}>[LABEL]</p>
  </motion.div>
</motion.div>
```

### 7. MAIN CONTENT CONTAINER
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.4 }}
  className="rounded-2xl overflow-hidden"
  style={{
    background: `linear-gradient(135deg, 
      rgba(255, 190, 152, 0.9) 0%, 
      rgba(255, 190, 152, 0.8) 30%,
      rgba(254, 217, 146, 0.7) 70%,
      rgba(255, 190, 152, 0.85) 100%)`,
    backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
    WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: `
      0 12px 48px 0 rgba(31, 38, 135, 0.2),
      0 8px 24px 0 rgba(255, 190, 152, 0.4),
      inset 0 3px 6px 0 rgba(255, 255, 255, 0.4),
      inset 0 -2px 4px 0 rgba(0, 0, 0, 0.15)
    `,
    borderRadius: '16px'
  }}
>
  <div style={{ padding: `clamp(1.5rem, 4vw, 3rem)` }}>
    {/* Content sections */}
  </div>
</motion.div>
```

### 8. SECTION STYLING INSIDE CONTENT
```tsx
<section style={{ marginBottom: `clamp(2rem, 4vw, 2.5rem)` }}>
  <h2 className="text-2xl md:text-3xl font-semibold"
      style={{ 
        marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
        fontFamily: "Aeonik Extended, sans-serif", 
        fontWeight: 500, 
        color: palette.dark 
      }}>
    [Section Title]
  </h2>
  <p className="leading-relaxed"
     style={{ 
       marginBottom: `clamp(1rem, 3vw, 1.5rem)`, 
       fontFamily: "Aeonik, sans-serif", 
       fontSize: 'clamp(0.95rem, 1.5vw, 1rem)', 
       color: `${palette.dark}CC` 
     }}>
    [Content]
  </p>
</section>
```

### 9. BOTTOM NAVIGATION
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  className="mt-12 flex justify-between items-center"
>
  <Link href="/properties" 
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.02]"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 190, 152, 0.9) 0%, 
            rgba(255, 190, 152, 0.8) 30%,
            rgba(254, 217, 146, 0.7) 70%,
            rgba(255, 190, 152, 0.85) 100%)`,
          backdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
          WebkitBackdropFilter: 'blur(20px) saturate(200%) brightness(1.1)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: palette.dark
        }}>
    <FiArrowLeft className="w-5 h-5" />
    <span style={{ fontFamily: "Aeonik, sans-serif", color: palette.dark }}>All Properties</span>
  </Link>
</motion.div>
```

### 10. CSS ANIMATION (MUST BE AT END)
```tsx
{/* CSS Animation for gradient text */}
<style jsx global>{`
  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
`}</style>
```

## CRITICAL MISSING ELEMENTS IN GOLD MOUNTAIN:
1. ❌ `onMouseEnter` and `onMouseLeave` handlers on stat cards
2. ❌ Proper container padding using clamp
3. ❌ Section marginBottom using clamp
4. ❌ Text color using palette.dark with transparency
5. ❌ All paragraph text styling with proper color

## VERIFICATION STEPS:
1. Compare side-by-side with RAM page
2. Check all hover states work
3. Verify all gradients animate
4. Confirm peachy background on main content
5. Test responsive spacing with clamp functions
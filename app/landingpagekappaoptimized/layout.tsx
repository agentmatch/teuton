'use client'

export default function OptimizedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style jsx global>{`
        /* Auto-generated visual fixes for optimal aesthetics */
@media (max-width: 768px) {
  /* Reset overly aggressive text sizing */
  html {
    font-size: 16px !important; /* Reduced from 18px */
  }
  
  body {
    font-size: 16px !important; /* Reduced from 18px */
    line-height: 1.6 !important; /* Reduced from 1.7 */
  }
  
  /* General text elements - more reasonable sizing */
  p, span, div, li {
    font-size: clamp(14px, 4vw, 16px) !important; /* Was: max(18px, 1rem) */
    line-height: 1.6 !important; /* Reduced from 1.7 */
    letter-spacing: normal !important; /* Was: 0.01em */
  }
  
  /* Headers - better visual hierarchy */
  h1 {
    font-size: clamp(1.75rem, 6vw, 2.5rem) !important; /* Reduced from clamp(2rem, 7vw, 3rem) */
    line-height: 1.2 !important; /* Tighter for headers */
  }
  
  h2 {
    font-size: clamp(1.5rem, 5vw, 2rem) !important; /* Reduced from clamp(1.75rem, 6vw, 2.5rem) */
    line-height: 1.3 !important;
  }
  
  h3 {
    font-size: clamp(1.25rem, 4vw, 1.75rem) !important; /* Reduced from clamp(1.5rem, 5vw, 2rem) */
    line-height: 1.4 !important;
  }
  
  /* Navigation - compact and elegant */
  nav, nav a, nav button {
    font-size: 15px !important; /* Reduced from 16px */
    padding: 10px 16px !important; /* Adjusted padding */
  }
  
  /* Buttons - refined sizing */
  button, .button, [role="button"] {
    font-size: 14px !important; /* Reduced from max(16px, 1rem) */
    padding: 10px 20px !important; /* Reduced padding */
    min-height: 44px !important; /* Still accessible but not oversized */
  }
  
  /* Property descriptions - elegant and readable */
  p[style*="Aeonik"] {
    font-size: 15px !important; /* Reduced from 18px */
    line-height: 1.65 !important; /* Good readability without excess */
    padding: 12px 16px !important; /* Reduced padding */
  }
  
  /* Map overlays and labels */
  .mapboxgl-popup-content {
    font-size: 14px !important; /* Reduced from 16px */
    line-height: 1.5 !important;
  }
  
  /* Touch targets - maintain accessibility without being oversized */
  a, button, [role="button"], input, select {
    min-width: 44px !important; /* Reduced from 48px */
    min-height: 44px !important; /* Still meets Apple's guidelines */
  }
  
  /* Specific fixes for cramped areas */
  .property-info {
    padding: 16px !important; /* Add breathing room */
  }
  
  /* Mobile menu adjustments */
  .mobile-menu-item {
    font-size: 16px !important;
    padding: 12px 20px !important;
  }
}

/* Desktop adjustments for consistency */
@media (min-width: 769px) {
  /* Maintain visual hierarchy on desktop */
  p, span, div, li {
    font-size: 16px;
    line-height: 1.6;
  }
  
  /* Keep buttons reasonable */
  button, .button, [role="button"] {
    font-size: 15px;
    padding: 10px 24px;
    min-height: 40px;
  }
}

/* Remove the aggressive global overrides */
@media (max-width: 768px) {
  /* Override the previous aggressive rules */
  .mapboxgl-ctrl-attrib a,
  .mapboxgl-ctrl button {
    min-width: auto !important;
    min-height: auto !important;
    padding: 4px 8px !important;
  }
  
  /* Fix extended click areas that cause layout issues */
  button::after, a::after, [role="button"]::after {
    content: none !important; /* Remove pseudo elements causing issues */
  }
}
      `}</style>
      {children}
    </>
  )
}
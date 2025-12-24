// Safari-specific fixes for mobile navigation
export function applySafariFixes() {
  // Only run on client side
  if (typeof window === 'undefined') return;

  // Detect Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  if (!isSafari && !isIOS) return;

  // Fix viewport height units in Safari
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Initial set
  setViewportHeight();

  // Update on resize and orientation change
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);

  // Force mobile nav visibility on Safari
  function forceMobileNavVisibility() {
    const mobileNavs = document.querySelectorAll(
      '[class*="fixed"][class*="bottom-0"][class*="z-\\[100005\\]"], ' +
      '.fixed.bottom-0.z-\\[100005\\], ' +
      'div[style*="z-index: 100005"]'
    );

    mobileNavs.forEach((nav) => {
      if (nav instanceof HTMLElement) {
        // Force display
        nav.style.display = 'block';
        nav.style.opacity = '1';
        nav.style.visibility = 'visible';
        nav.style.transform = 'translateZ(0)';
        nav.style.webkitTransform = 'translateZ(0)';
        
        // Ensure proper positioning
        nav.style.position = 'fixed';
        nav.style.bottom = '0';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.width = '100%';
        
        // Force z-index
        nav.style.zIndex = '2147483647';
      }
    });
  }

  // Apply fixes on load and after a delay
  forceMobileNavVisibility();
  setTimeout(forceMobileNavVisibility, 100);
  setTimeout(forceMobileNavVisibility, 500);

  // Fix Safari bounce scrolling interference
  document.addEventListener('touchmove', function(e) {
    const target = e.target as HTMLElement;
    const isNavButton = target.closest('button') && target.closest('[class*="z-\\[100005\\]"]');
    
    if (isNavButton) {
      e.preventDefault();
    }
  }, { passive: false });

  // Handle Safari's safe area insets dynamically
  function updateSafeAreaInsets() {
    const root = document.documentElement;
    const safeAreaInsetBottom = getComputedStyle(root).getPropertyValue('env(safe-area-inset-bottom)');
    
    // Apply to mobile nav containers
    const mobileNavs = document.querySelectorAll('[class*="z-\\[100005\\]"]');
    mobileNavs.forEach((nav) => {
      if (nav instanceof HTMLElement) {
        nav.style.paddingBottom = `env(safe-area-inset-bottom, 0px)`;
      }
    });
  }

  updateSafeAreaInsets();
  window.addEventListener('resize', updateSafeAreaInsets);
}

// Auto-apply fixes when module is imported
if (typeof window !== 'undefined') {
  // Apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applySafariFixes);
  } else {
    applySafariFixes();
  }
}
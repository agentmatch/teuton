const { chromium } = require('playwright');

async function analyzeSite() {
  const browser = await chromium.launch({ headless: true });
  
  const url = 'https://luxormetals-g4cdmt5ll-roman-romanalexands-projects.vercel.app';
  
  console.log('🔍 Analyzing Luxor Metals Website\n');
  console.log('URL:', url);
  console.log('=' .repeat(80));
  
  // Desktop Analysis
  console.log('\n📱 DESKTOP ANALYSIS');
  console.log('-'.repeat(40));
  
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const desktopPage = await desktopContext.newPage();
  
  try {
    await desktopPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await desktopPage.waitForTimeout(3000); // Wait for animations
    
    // Take screenshot
    await desktopPage.screenshot({ path: 'desktop-homepage.png', fullPage: false });
    
    // Analyze content
    const desktopAnalysis = await desktopPage.evaluate(() => {
      const analysis = {
        title: document.title,
        headerVisible: !!document.querySelector('header'),
        logoVisible: !!document.querySelector('img[alt*="Luxor"]'),
        navigationItems: Array.from(document.querySelectorAll('nav a, nav div[style*="cursor"]')).map(el => el.textContent.trim()).filter(text => text),
        heroContent: document.querySelector('h1')?.textContent || 'No hero heading found',
        mainSections: Array.from(document.querySelectorAll('section')).length,
        hasMap: !!document.querySelector('.mapboxgl-canvas'),
        tickerVisible: !!document.querySelector('[class*="ticker"], [class*="Ticker"]'),
        ctaButtons: Array.from(document.querySelectorAll('button, a[href]')).filter(el => 
          el.textContent && (el.textContent.includes('Explore') || el.textContent.includes('Learn') || el.textContent.includes('Contact'))
        ).map(el => el.textContent.trim()),
        animations: !!document.querySelector('[class*="motion"], [style*="animation"]'),
        goldParticles: !!document.querySelector('canvas'),
        performanceMetrics: {
          domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
          fullyLoaded: performance.timing.loadEventEnd - performance.timing.navigationStart
        }
      };
      
      return analysis;
    });
    
    console.log('Title:', desktopAnalysis.title);
    console.log('Header:', desktopAnalysis.headerVisible ? '✅ Visible' : '❌ Not visible');
    console.log('Logo:', desktopAnalysis.logoVisible ? '✅ Visible' : '❌ Not visible');
    console.log('Navigation:', desktopAnalysis.navigationItems.join(', ') || 'None found');
    console.log('Hero Content:', desktopAnalysis.heroContent);
    console.log('Main Sections:', desktopAnalysis.mainSections);
    console.log('Interactive Map:', desktopAnalysis.hasMap ? '✅ Present' : '❌ Not found');
    console.log('Stock Ticker:', desktopAnalysis.tickerVisible ? '✅ Visible' : '❌ Not visible');
    console.log('CTA Buttons:', desktopAnalysis.ctaButtons.join(', ') || 'None found');
    console.log('Animations:', desktopAnalysis.animations ? '✅ Present' : '❌ Not detected');
    console.log('Gold Particles:', desktopAnalysis.goldParticles ? '✅ Present' : '❌ Not found');
    console.log('Load Times:', `DOM: ${desktopAnalysis.performanceMetrics.domContentLoaded}ms, Full: ${desktopAnalysis.performanceMetrics.fullyLoaded}ms`);
    
  } catch (error) {
    console.error('Desktop analysis error:', error.message);
  }
  
  // Mobile Analysis
  console.log('\n📱 MOBILE ANALYSIS (iPhone 14 Pro)');
  console.log('-'.repeat(40));
  
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    isMobile: true,
    hasTouch: true
  });
  
  const mobilePage = await mobileContext.newPage();
  
  try {
    await mobilePage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await mobilePage.waitForTimeout(3000); // Wait for animations
    
    // Take screenshot
    await mobilePage.screenshot({ path: 'mobile-homepage.png', fullPage: false });
    
    // Analyze mobile content
    const mobileAnalysis = await mobilePage.evaluate(() => {
      const analysis = {
        title: document.title,
        headerVisible: !!document.querySelector('header'),
        mobileMenuButton: !!document.querySelector('button[aria-label*="menu"], button svg[class*="menu"], button:has(svg)'),
        logoVisible: !!document.querySelector('img[alt*="Luxor"]'),
        heroContent: document.querySelector('h1')?.textContent || 'No hero heading found',
        responsiveDesign: window.innerWidth < 768,
        touchTargets: Array.from(document.querySelectorAll('button, a')).filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44; // iOS minimum touch target
        }).length,
        scrollable: document.body.scrollHeight > window.innerHeight,
        mobileOptimizations: {
          viewport: !!document.querySelector('meta[name="viewport"]'),
          mobileNav: !!document.querySelector('[class*="mobile"], nav[class*="Mobile"]'),
          hamburgerMenu: !!document.querySelector('[class*="hamburger"], button[aria-label*="menu"]')
        },
        textReadability: (() => {
          const texts = Array.from(document.querySelectorAll('p, span')).filter(el => el.textContent.trim());
          const readableSizes = texts.filter(el => {
            const fontSize = window.getComputedStyle(el).fontSize;
            return parseFloat(fontSize) >= 14; // Minimum readable size on mobile
          });
          return {
            total: texts.length,
            readable: readableSizes.length,
            percentage: texts.length ? Math.round((readableSizes.length / texts.length) * 100) : 0
          };
        })(),
        mapPresent: !!document.querySelector('.mapboxgl-canvas'),
        bottomNav: !!document.querySelector('nav[class*="bottom"], [class*="MobileNav"]')
      };
      
      return analysis;
    });
    
    console.log('Title:', mobileAnalysis.title);
    console.log('Header:', mobileAnalysis.headerVisible ? '✅ Visible' : '❌ Not visible');
    console.log('Mobile Menu Button:', mobileAnalysis.mobileMenuButton ? '✅ Present' : '❌ Not found');
    console.log('Logo:', mobileAnalysis.logoVisible ? '✅ Visible' : '❌ Not visible');
    console.log('Hero Content:', mobileAnalysis.heroContent);
    console.log('Responsive Design:', mobileAnalysis.responsiveDesign ? '✅ Active' : '❌ Not responsive');
    console.log('Touch-friendly Targets:', mobileAnalysis.touchTargets);
    console.log('Scrollable:', mobileAnalysis.scrollable ? '✅ Yes' : '❌ No');
    console.log('Mobile Optimizations:');
    console.log('  - Viewport Meta:', mobileAnalysis.mobileOptimizations.viewport ? '✅' : '❌');
    console.log('  - Mobile Nav:', mobileAnalysis.mobileOptimizations.mobileNav ? '✅' : '❌');
    console.log('  - Hamburger Menu:', mobileAnalysis.mobileOptimizations.hamburgerMenu ? '✅' : '❌');
    console.log('Text Readability:', `${mobileAnalysis.textReadability.percentage}% (${mobileAnalysis.textReadability.readable}/${mobileAnalysis.textReadability.total})`);
    console.log('Interactive Map:', mobileAnalysis.mapPresent ? '✅ Present' : '❌ Not found');
    console.log('Bottom Navigation:', mobileAnalysis.bottomNav ? '✅ Present' : '❌ Not found');
    
  } catch (error) {
    console.error('Mobile analysis error:', error.message);
  }
  
  // Accessibility Analysis
  console.log('\n♿ ACCESSIBILITY ANALYSIS');
  console.log('-'.repeat(40));
  
  const accessibilityPage = await desktopContext.newPage();
  
  try {
    await accessibilityPage.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    
    const accessibilityAnalysis = await accessibilityPage.evaluate(() => {
      const analysis = {
        altTexts: Array.from(document.querySelectorAll('img')).filter(img => img.alt).length + '/' + document.querySelectorAll('img').length,
        ariaLabels: document.querySelectorAll('[aria-label]').length,
        semanticHTML: {
          header: !!document.querySelector('header'),
          nav: !!document.querySelector('nav'),
          main: !!document.querySelector('main'),
          footer: !!document.querySelector('footer')
        },
        contrastIssues: Array.from(document.querySelectorAll('*')).filter(el => {
          const style = window.getComputedStyle(el);
          const bg = style.backgroundColor;
          const color = style.color;
          // Simple check - in reality would need more complex contrast calculation
          return color && bg && color.includes('rgba') && parseFloat(color.match(/[\d.]+(?=\))/)?.[0] || 1) < 0.7;
        }).length,
        focusableElements: document.querySelectorAll('a, button, input, select, textarea, [tabindex]').length
      };
      
      return analysis;
    });
    
    console.log('Alt Texts:', accessibilityAnalysis.altTexts);
    console.log('ARIA Labels:', accessibilityAnalysis.ariaLabels);
    console.log('Semantic HTML:');
    Object.entries(accessibilityAnalysis.semanticHTML).forEach(([tag, present]) => {
      console.log(`  - <${tag}>:`, present ? '✅' : '❌');
    });
    console.log('Low Contrast Elements:', accessibilityAnalysis.contrastIssues);
    console.log('Focusable Elements:', accessibilityAnalysis.focusableElements);
    
  } catch (error) {
    console.error('Accessibility analysis error:', error.message);
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 ANALYSIS COMPLETE');
  console.log('Screenshots saved: desktop-homepage.png, mobile-homepage.png');
}

analyzeSite().catch(console.error);
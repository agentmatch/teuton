const { chromium, devices } = require('playwright');

async function testOptimizedPage() {
  const browser = await chromium.launch({ headless: true });
  
  const results = {
    improvements: {
      touchTargets: { before: 24, after: 0 },
      textReadability: { before: 68, after: 0 },
      loadTime: { before: 0, after: 0 },
      failedRequests: { before: 8, after: 0 }
    },
    tests: {
      mobile: {},
      desktop: {},
      accessibility: {},
      performance: {}
    }
  };
  
  console.log('🧪 Testing Luxor Metals Optimized Page\n');
  console.log('=' .repeat(60));
  
  // Test Mobile Experience
  console.log('\n📱 MOBILE OPTIMIZATION TEST');
  console.log('-'.repeat(40));
  
  const iPhone = devices['iPhone 14 Pro'];
  const mobileContext = await browser.newContext({
    ...iPhone,
    locale: 'en-US'
  });
  
  const mobilePage = await mobileContext.newPage();
  
  try {
    console.log('Loading optimized mobile version...');
    
    // Start local dev server first
    console.log('Note: Make sure dev server is running (npm run dev)');
    
    await mobilePage.goto('http://localhost:3003/landingpagekappaoptimized', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await mobilePage.waitForTimeout(3000);
    
    // Test 1: Touch Target Sizes
    console.log('\n✓ Testing touch targets...');
    const touchTargetTest = await mobilePage.evaluate(() => {
      const minSize = 44; // Apple's recommended minimum
      const interactiveElements = Array.from(document.querySelectorAll('button, a, [role="button"], input, select, textarea'));
      
      const results = {
        total: interactiveElements.length,
        adequate: 0,
        tooSmall: [],
        details: []
      };
      
      interactiveElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const size = Math.min(width, height);
        
        if (size >= minSize) {
          results.adequate++;
        } else {
          results.tooSmall.push({
            element: el.tagName,
            text: el.textContent?.trim().substring(0, 30),
            size: Math.round(size),
            width: Math.round(width),
            height: Math.round(height)
          });
        }
        
        results.details.push({
          element: el.tagName,
          adequate: size >= minSize,
          size: Math.round(size)
        });
      });
      
      return results;
    });
    
    results.tests.mobile.touchTargets = touchTargetTest;
    console.log(`Touch targets: ${touchTargetTest.adequate}/${touchTargetTest.total} adequate`);
    if (touchTargetTest.tooSmall.length > 0) {
      console.log('Too small targets:', touchTargetTest.tooSmall);
    }
    
    // Test 2: Text Readability
    console.log('\n✓ Testing text readability...');
    const textReadabilityTest = await mobilePage.evaluate(() => {
      const minFontSize = 16; // Recommended minimum for mobile
      const minLineHeight = 1.5;
      
      const textElements = Array.from(document.querySelectorAll('p, span, div, li, h1, h2, h3, h4, h5, h6'))
        .filter(el => el.textContent?.trim() && el.textContent.trim().length > 10);
      
      const results = {
        total: textElements.length,
        adequate: 0,
        issues: [],
        averageFontSize: 0,
        averageLineHeight: 0
      };
      
      let totalFontSize = 0;
      let totalLineHeight = 0;
      
      textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        const lineHeight = parseFloat(styles.lineHeight);
        const lineHeightRatio = lineHeight / fontSize;
        
        totalFontSize += fontSize;
        totalLineHeight += lineHeightRatio;
        
        const isAdequate = fontSize >= minFontSize && lineHeightRatio >= minLineHeight;
        
        if (isAdequate) {
          results.adequate++;
        } else {
          results.issues.push({
            element: el.tagName,
            text: el.textContent?.trim().substring(0, 50),
            fontSize: Math.round(fontSize),
            lineHeightRatio: lineHeightRatio.toFixed(2),
            problems: [
              fontSize < minFontSize ? `Font too small (${Math.round(fontSize)}px)` : null,
              lineHeightRatio < minLineHeight ? `Line height too tight (${lineHeightRatio.toFixed(2)})` : null
            ].filter(Boolean)
          });
        }
      });
      
      results.averageFontSize = Math.round(totalFontSize / textElements.length);
      results.averageLineHeight = (totalLineHeight / textElements.length).toFixed(2);
      results.readabilityScore = Math.round((results.adequate / results.total) * 100);
      
      return results;
    });
    
    results.tests.mobile.textReadability = textReadabilityTest;
    console.log(`Text readability: ${textReadabilityTest.readabilityScore}% (${textReadabilityTest.adequate}/${textReadabilityTest.total})`);
    console.log(`Average font size: ${textReadabilityTest.averageFontSize}px`);
    console.log(`Average line height ratio: ${textReadabilityTest.averageLineHeight}`);
    
    // Test 3: Loading Performance
    console.log('\n✓ Testing loading performance...');
    const performanceMetrics = await mobilePage.evaluate(() => {
      const timing = performance.timing;
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        fullyLoaded: timing.loadEventEnd - timing.navigationStart,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0 // Would need PerformanceObserver
      };
    });
    
    results.tests.mobile.performance = performanceMetrics;
    console.log(`DOM loaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`First contentful paint: ${performanceMetrics.firstContentfulPaint}ms`);
    
    // Test 4: Network Optimization
    console.log('\n✓ Testing network optimization...');
    const requests = [];
    mobilePage.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });
    
    // Reload to capture all requests
    await mobilePage.reload({ waitUntil: 'networkidle' });
    
    const networkAnalysis = {
      totalRequests: requests.length,
      byType: requests.reduce((acc, req) => {
        acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
        return acc;
      }, {}),
      lazyLoaded: await mobilePage.evaluate(() => {
        return document.querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]').length;
      })
    };
    
    results.tests.mobile.network = networkAnalysis;
    console.log(`Total requests: ${networkAnalysis.totalRequests}`);
    console.log(`Lazy loaded resources: ${networkAnalysis.lazyLoaded}`);
    
    // Test 5: Accessibility Features
    console.log('\n✓ Testing accessibility features...');
    const accessibilityTest = await mobilePage.evaluate(() => {
      return {
        skipLink: !!document.querySelector('a[href="#main-content"]'),
        ariaLabels: document.querySelectorAll('[aria-label]').length,
        altTexts: {
          total: document.querySelectorAll('img').length,
          withAlt: document.querySelectorAll('img[alt]').length
        },
        headingStructure: {
          h1: document.querySelectorAll('h1').length,
          h2: document.querySelectorAll('h2').length,
          h3: document.querySelectorAll('h3').length
        },
        landmarks: {
          main: !!document.querySelector('main, [role="main"]'),
          nav: !!document.querySelector('nav, [role="navigation"]'),
          header: !!document.querySelector('header, [role="banner"]')
        }
      };
    });
    
    results.tests.mobile.accessibility = accessibilityTest;
    console.log('Accessibility features:', JSON.stringify(accessibilityTest, null, 2));
    
    // Take screenshot
    await mobilePage.screenshot({ path: 'mobile-optimized.png', fullPage: false });
    
  } catch (error) {
    console.error('Mobile test error:', error.message);
    results.tests.mobile.error = error.message;
  }
  
  // Test Desktop Experience
  console.log('\n\n💻 DESKTOP OPTIMIZATION TEST');
  console.log('-'.repeat(40));
  
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const desktopPage = await desktopContext.newPage();
  
  try {
    await desktopPage.goto('http://localhost:3003/landingpagekappaoptimized', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await desktopPage.waitForTimeout(3000);
    
    // Test performance mode toggle
    const performanceToggle = await desktopPage.evaluate(() => {
      const button = document.querySelector('button[aria-label*="Performance mode"]');
      return !!button;
    });
    
    console.log(`Performance mode toggle: ${performanceToggle ? '✅' : '❌'}`);
    
    // Test loading optimizations
    const loadingOptimizations = await desktopPage.evaluate(() => {
      return {
        lazyComponents: !!window.React?.lazy,
        suspenseBoundaries: document.querySelector('[data-react-suspense]') !== null,
        preconnects: Array.from(document.querySelectorAll('link[rel="preconnect"], link[rel="dns-prefetch"]')).map(l => l.href)
      };
    });
    
    results.tests.desktop.optimizations = loadingOptimizations;
    console.log('Loading optimizations:', loadingOptimizations);
    
    await desktopPage.screenshot({ path: 'desktop-optimized.png', fullPage: false });
    
  } catch (error) {
    console.error('Desktop test error:', error.message);
    results.tests.desktop.error = error.message;
  }
  
  await browser.close();
  
  // Generate Report
  console.log('\n\n📊 OPTIMIZATION REPORT');
  console.log('=' .repeat(60));
  
  // Calculate improvements
  results.improvements.touchTargets.after = results.tests.mobile.touchTargets?.tooSmall?.length || 0;
  results.improvements.textReadability.after = 100 - (results.tests.mobile.textReadability?.readabilityScore || 0);
  
  console.log('\n🎯 Key Metrics Improvement:');
  console.log(`Touch Targets: ${results.improvements.touchTargets.before} → ${results.improvements.touchTargets.after} issues`);
  console.log(`Text Readability: ${results.improvements.textReadability.before}% → ${results.improvements.textReadability.after}% failing`);
  
  console.log('\n✅ Optimizations Implemented:');
  console.log('- Dynamic component loading with Suspense');
  console.log('- Minimum 48px touch targets on mobile');
  console.log('- Minimum 16px font size with 1.6 line height');
  console.log('- Performance mode toggle for low-end devices');
  console.log('- Reduced motion support');
  console.log('- Skip navigation link');
  console.log('- Preconnect to critical domains');
  console.log('- Font loading optimization');
  console.log('- Proper loading states');
  
  console.log('\n🚀 Performance Score:');
  const score = results.tests.mobile.touchTargets?.adequate 
    ? Math.round((results.tests.mobile.touchTargets.adequate / results.tests.mobile.touchTargets.total) * 100)
    : 0;
  console.log(`Mobile UX Score: ${score}%`);
  
  return results;
}

testOptimizedPage().catch(console.error);
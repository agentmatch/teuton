const { chromium, devices } = require('playwright');
const fs = require('fs').promises;

async function deepAnalysis() {
  const browser = await chromium.launch({ headless: false });
  
  const results = {
    original: {},
    optimized: {},
    timestamp: new Date().toISOString()
  };
  
  // Test configurations
  const configs = [
    { 
      name: 'iPhone_14_Pro', 
      device: devices['iPhone 14 Pro'],
      viewport: { width: 393, height: 852 }
    },
    { 
      name: 'iPhone_SE', 
      device: devices['iPhone SE'],
      viewport: { width: 375, height: 667 }
    },
    { 
      name: 'Desktop_1080p', 
      viewport: { width: 1920, height: 1080 }
    }
  ];
  
  console.log('🔬 Starting Deep Playwright Analysis\n');
  console.log('=' .repeat(80));
  
  for (const config of configs) {
    console.log(`\n📱 Testing on ${config.name}...`);
    
    // Test original page
    console.log('  → Original page');
    const originalContext = await browser.newContext({
      ...config.device,
      viewport: config.viewport,
      userAgent: config.device?.userAgent
    });
    const originalPage = await originalContext.newPage();
    results.original[config.name] = await analyzePage(originalPage, 'http://localhost:3003/landingpagekappa', config);
    await originalContext.close();
    
    // Test optimized page
    console.log('  → Optimized page');
    const optimizedContext = await browser.newContext({
      ...config.device,
      viewport: config.viewport,
      userAgent: config.device?.userAgent
    });
    const optimizedPage = await optimizedContext.newPage();
    results.optimized[config.name] = await analyzeOptimizedPage(optimizedPage, 'http://localhost:3003/landingpagekappaoptimized', config);
    await optimizedContext.close();
  }
  
  // Generate comparative analysis
  console.log('\n\n📊 COMPARATIVE ANALYSIS');
  console.log('=' .repeat(80));
  
  generateComparison(results);
  
  // Save detailed results
  await fs.writeFile('playwright-analysis-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Detailed results saved to playwright-analysis-results.json');
  
  await browser.close();
}

async function analyzePage(page, url, config) {
  const metrics = {
    performance: {},
    accessibility: {},
    ux: {},
    network: {},
    errors: []
  };
  
  // Set up monitoring
  const requests = [];
  const responses = [];
  const consoleErrors = [];
  
  page.on('request', request => requests.push({
    url: request.url(),
    method: request.method(),
    resourceType: request.resourceType()
  }));
  
  page.on('response', response => responses.push({
    url: response.url(),
    status: response.status(),
    size: response.headers()['content-length']
  }));
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  try {
    // Navigate and measure performance
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    const loadTime = Date.now() - startTime;
    
    // Wait for map to be interactive
    await page.waitForTimeout(5000);
    
    // Performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        largestContentfulPaint: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
        jsHeapSize: performance.memory?.usedJSHeapSize,
        layoutCount: performance.getEntriesByType('measure').filter(m => m.name.includes('layout')).length
      };
    });
    
    metrics.performance = {
      ...performanceMetrics,
      totalLoadTime: loadTime,
      requestCount: requests.length,
      totalTransferSize: responses.reduce((sum, r) => sum + (parseInt(r.size) || 0), 0),
      failedRequests: responses.filter(r => r.status >= 400).length
    };
    
    // UX Analysis
    console.log('    ✓ Analyzing UX...');
    
    // Touch targets
    const touchTargetAnalysis = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [onclick]');
      const results = { total: 0, passed: 0, failed: 0, elements: [] };
      
      interactiveElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(el);
        
        // Skip hidden elements
        if (rect.width === 0 || rect.height === 0 || 
            computedStyle.display === 'none' || 
            computedStyle.visibility === 'hidden' ||
            computedStyle.opacity === '0') {
          return;
        }
        
        results.total++;
        const minSize = window.innerWidth <= 768 ? 44 : 24;
        
        if (rect.width >= minSize && rect.height >= minSize) {
          results.passed++;
        } else {
          results.failed++;
          results.elements.push({
            tag: el.tagName,
            text: el.textContent?.substring(0, 30),
            size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
            class: el.className
          });
        }
      });
      
      return results;
    });
    
    // Text readability
    const textReadability = await page.evaluate(() => {
      const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, a, button');
      const results = { total: 0, passed: 0, failed: 0, elements: [] };
      
      textElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el);
        const fontSize = parseFloat(computedStyle.fontSize);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        
        // Skip elements without text
        if (!el.textContent?.trim() || computedStyle.display === 'none') return;
        
        results.total++;
        const minFontSize = window.innerWidth <= 768 ? 16 : 14;
        const minLineHeightRatio = 1.5;
        
        if (fontSize >= minFontSize && lineHeight / fontSize >= minLineHeightRatio) {
          results.passed++;
        } else {
          results.failed++;
          if (results.elements.length < 10) { // Limit to first 10 issues
            results.elements.push({
              tag: el.tagName,
              text: el.textContent?.substring(0, 30),
              fontSize: `${fontSize}px`,
              lineHeight: `${lineHeight}px`,
              ratio: (lineHeight / fontSize).toFixed(2)
            });
          }
        }
      });
      
      return results;
    });
    
    // Scroll performance
    const scrollPerformance = await page.evaluate(async () => {
      const measureScroll = () => new Promise(resolve => {
        let frames = 0;
        let startTime = performance.now();
        
        const countFrames = () => {
          frames++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrames);
          } else {
            resolve(frames);
          }
        };
        
        requestAnimationFrame(countFrames);
        
        // Trigger scroll
        window.scrollBy(0, 100);
        setTimeout(() => window.scrollBy(0, -100), 500);
      });
      
      return await measureScroll();
    });
    
    metrics.ux = {
      touchTargets: touchTargetAnalysis,
      textReadability: textReadability,
      scrollFPS: scrollPerformance,
      hasSkipLink: await page.$('a[href="#main-content"]') !== null,
      hasAltText: await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).every(img => img.alt);
      })
    };
    
    // Accessibility Analysis
    console.log('    ✓ Analyzing accessibility...');
    
    const accessibilityMetrics = await page.evaluate(() => {
      const results = {
        landmarks: {},
        headings: {},
        contrast: { passed: 0, failed: 0 },
        ariaLabels: 0,
        focusable: 0
      };
      
      // Landmarks
      results.landmarks = {
        header: document.querySelectorAll('header').length,
        nav: document.querySelectorAll('nav').length,
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length
      };
      
      // Headings
      for (let i = 1; i <= 6; i++) {
        results.headings[`h${i}`] = document.querySelectorAll(`h${i}`).length;
      }
      
      // ARIA labels
      results.ariaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]').length;
      
      // Focusable elements
      results.focusable = document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').length;
      
      return results;
    });
    
    metrics.accessibility = accessibilityMetrics;
    
    // Network Analysis
    const resourceTypes = {};
    requests.forEach(req => {
      resourceTypes[req.resourceType] = (resourceTypes[req.resourceType] || 0) + 1;
    });
    
    metrics.network = {
      totalRequests: requests.length,
      failedRequests: responses.filter(r => r.status >= 400).length,
      resourceTypes,
      averageResponseTime: responses.length > 0 ? 
        responses.reduce((sum, r) => sum + (r.timing?.responseEnd - r.timing?.requestStart || 0), 0) / responses.length : 0
    };
    
    // Errors
    metrics.errors = consoleErrors;
    
    // Interactive elements analysis
    const interactiveAnalysis = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, [role="button"]');
      const links = document.querySelectorAll('a');
      const forms = document.querySelectorAll('form');
      
      return {
        buttons: buttons.length,
        links: links.length,
        forms: forms.length,
        hasHoverStates: Array.from(buttons).some(btn => {
          const computed = window.getComputedStyle(btn);
          return computed.cursor === 'pointer';
        })
      };
    });
    
    metrics.ux.interactive = interactiveAnalysis;
    
    // Mobile-specific metrics
    if (config.device) {
      const mobileMetrics = await page.evaluate(() => {
        return {
          viewportMeta: document.querySelector('meta[name="viewport"]')?.content,
          hasTouchIcon: !!document.querySelector('link[rel*="touch-icon"]'),
          tapDelay: document.documentElement.style.touchAction,
          hasSwipeGestures: !!window.TouchEvent
        };
      });
      
      metrics.ux.mobile = mobileMetrics;
    }
    
  } catch (error) {
    console.error('    ❌ Error analyzing page:', error.message);
    metrics.errors.push(error.message);
  }
  
  return metrics;
}

async function analyzeOptimizedPage(page, url, config) {
  // Run base analysis
  const metrics = await analyzePage(page, url, config);
  
  // Additional optimized-specific checks
  try {
    const optimizationMetrics = await page.evaluate(() => {
      return {
        hasPerformanceMode: !!document.querySelector('button[aria-label*="Performance mode"]'),
        hasLazyLoading: !!document.querySelector('[loading="lazy"]'),
        hasSuspenseBoundary: !!window.React?.Suspense,
        hasReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        fontOptimization: document.fonts?.status === 'loaded'
      };
    });
    
    metrics.optimizations = optimizationMetrics;
  } catch (error) {
    console.error('    ❌ Error checking optimizations:', error.message);
  }
  
  return metrics;
}

function generateComparison(results) {
  const devices = Object.keys(results.original);
  
  devices.forEach(device => {
    console.log(`\n📱 ${device} Comparison:`);
    console.log('-'.repeat(60));
    
    const original = results.original[device];
    const optimized = results.optimized[device];
    
    // Performance comparison
    console.log('\n🚀 Performance:');
    console.log(`  First Paint: ${formatTime(original.performance.firstPaint)} → ${formatTime(optimized.performance.firstPaint)} (${formatDiff(original.performance.firstPaint, optimized.performance.firstPaint)})`);
    console.log(`  FCP: ${formatTime(original.performance.firstContentfulPaint)} → ${formatTime(optimized.performance.firstContentfulPaint)} (${formatDiff(original.performance.firstContentfulPaint, optimized.performance.firstContentfulPaint)})`);
    console.log(`  Total Load: ${formatTime(original.performance.totalLoadTime)} → ${formatTime(optimized.performance.totalLoadTime)} (${formatDiff(original.performance.totalLoadTime, optimized.performance.totalLoadTime)})`);
    console.log(`  Requests: ${original.performance.requestCount} → ${optimized.performance.requestCount} (${formatDiff(original.performance.requestCount, optimized.performance.requestCount, true)})`);
    
    // UX comparison
    console.log('\n👆 User Experience:');
    console.log(`  Touch Targets: ${original.ux.touchTargets.passed}/${original.ux.touchTargets.total} → ${optimized.ux.touchTargets.passed}/${optimized.ux.touchTargets.total} (${formatPercent(original.ux.touchTargets.passed, original.ux.touchTargets.total)} → ${formatPercent(optimized.ux.touchTargets.passed, optimized.ux.touchTargets.total)})`);
    console.log(`  Text Readability: ${original.ux.textReadability.passed}/${original.ux.textReadability.total} → ${optimized.ux.textReadability.passed}/${optimized.ux.textReadability.total} (${formatPercent(original.ux.textReadability.passed, original.ux.textReadability.total)} → ${formatPercent(optimized.ux.textReadability.passed, optimized.ux.textReadability.total)})`);
    console.log(`  Scroll FPS: ${original.ux.scrollFPS} → ${optimized.ux.scrollFPS} (${formatDiff(original.ux.scrollFPS, optimized.ux.scrollFPS, true)})`);
    console.log(`  Skip Link: ${original.ux.hasSkipLink ? '✅' : '❌'} → ${optimized.ux.hasSkipLink ? '✅' : '❌'}`);
    
    // Accessibility comparison
    console.log('\n♿ Accessibility:');
    console.log(`  ARIA Labels: ${original.accessibility.ariaLabels} → ${optimized.accessibility.ariaLabels} (${formatDiff(original.accessibility.ariaLabels, optimized.accessibility.ariaLabels, true)})`);
    console.log(`  Focusable Elements: ${original.accessibility.focusable} → ${optimized.accessibility.focusable}`);
    console.log(`  Landmarks: ${Object.values(original.accessibility.landmarks).reduce((a,b) => a+b, 0)} → ${Object.values(optimized.accessibility.landmarks).reduce((a,b) => a+b, 0)}`);
    
    // Errors
    console.log('\n⚠️  Errors:');
    console.log(`  Console Errors: ${original.errors.length} → ${optimized.errors.length} (${formatDiff(original.errors.length, optimized.errors.length, true)})`);
    console.log(`  Failed Requests: ${original.network.failedRequests} → ${optimized.network.failedRequests} (${formatDiff(original.network.failedRequests, optimized.network.failedRequests, true)})`);
    
    // Optimizations (if available)
    if (optimized.optimizations) {
      console.log('\n✨ Optimizations Applied:');
      Object.entries(optimized.optimizations).forEach(([key, value]) => {
        console.log(`  ${key}: ${value ? '✅' : '❌'}`);
      });
    }
  });
  
  // Overall summary
  console.log('\n\n🎯 OVERALL SUMMARY');
  console.log('=' .repeat(80));
  
  let improvements = 0;
  let regressions = 0;
  
  devices.forEach(device => {
    const o = results.original[device];
    const opt = results.optimized[device];
    
    // Count improvements
    if (opt.performance.firstContentfulPaint < o.performance.firstContentfulPaint) improvements++;
    if (opt.ux.touchTargets.passed > o.ux.touchTargets.passed) improvements++;
    if (opt.ux.textReadability.passed > o.ux.textReadability.passed) improvements++;
    if (opt.errors.length < o.errors.length) improvements++;
    
    // Count regressions
    if (opt.performance.totalLoadTime > o.performance.totalLoadTime * 1.1) regressions++;
    if (opt.performance.requestCount > o.performance.requestCount * 1.2) regressions++;
  });
  
  console.log(`\n✅ Total Improvements: ${improvements}`);
  console.log(`⚠️  Total Regressions: ${regressions}`);
  console.log(`📊 Net Gain: ${improvements - regressions}`);
  
  // Key achievements
  console.log('\n🏆 Key Achievements:');
  
  // Check mobile text readability
  const mobileOrig = results.original.iPhone_14_Pro?.ux.textReadability;
  const mobileOpt = results.optimized.iPhone_14_Pro?.ux.textReadability;
  if (mobileOpt && mobileOrig && mobileOpt.passed / mobileOpt.total > 0.95) {
    console.log('  ✅ Achieved >95% mobile text readability');
  }
  
  // Check touch targets
  const touchOrig = results.original.iPhone_14_Pro?.ux.touchTargets;
  const touchOpt = results.optimized.iPhone_14_Pro?.ux.touchTargets;
  if (touchOpt && touchOrig && touchOpt.failed < touchOrig.failed * 0.2) {
    console.log('  ✅ Reduced touch target failures by >80%');
  }
  
  // Check performance
  const perfOrig = results.original.Desktop_1080p?.performance;
  const perfOpt = results.optimized.Desktop_1080p?.performance;
  if (perfOpt && perfOrig && perfOpt.firstContentfulPaint < 1000) {
    console.log('  ✅ Achieved sub-second First Contentful Paint');
  }
  
  // Check accessibility
  if (results.optimized.iPhone_14_Pro?.ux.hasSkipLink) {
    console.log('  ✅ Added skip navigation link');
  }
}

function formatTime(ms) {
  if (!ms) return 'N/A';
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms/1000).toFixed(2)}s`;
}

function formatDiff(original, optimized, inverse = false) {
  if (!original || !optimized) return '';
  const diff = inverse ? original - optimized : optimized - original;
  const percent = (diff / original) * 100;
  const symbol = percent > 0 ? '+' : '';
  const color = (percent < 0 && !inverse) || (percent > 0 && inverse) ? '✅' : '⚠️';
  return `${color} ${symbol}${percent.toFixed(1)}%`;
}

function formatPercent(passed, total) {
  if (!total) return 'N/A';
  return `${Math.round((passed / total) * 100)}%`;
}

// Run the analysis
deepAnalysis().catch(console.error);
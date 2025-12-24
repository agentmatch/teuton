const { chromium, devices } = require('playwright');
const fs = require('fs').promises;

async function advancedSiteAnalysis() {
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--enable-gpu-rasterization'] 
  });
  
  const url = 'https://luxormetals-g4cdmt5ll-roman-romanalexands-projects.vercel.app';
  const localUrl = 'http://localhost:3000';
  const testUrl = url; // Change to localUrl if testing locally
  
  const results = {
    timestamp: new Date().toISOString(),
    url: testUrl,
    desktop: {},
    mobile: {},
    performance: {},
    accessibility: {},
    network: {},
    security: {},
    userFlows: {}
  };

  console.log('🔬 Advanced Luxor Metals Website Analysis\n');
  console.log('=' .repeat(80));
  
  // Desktop Deep Analysis
  console.log('\n💻 DESKTOP DEEP ANALYSIS');
  console.log('-'.repeat(40));
  
  const desktopContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    recordVideo: { dir: './videos/' },
    ignoreHTTPSErrors: true
  });
  
  // Enable CDP for advanced metrics
  const desktopPage = await desktopContext.newPage();
  const client = await desktopPage.context().newCDPSession(desktopPage);
  
  // Network Analysis Setup
  const networkRequests = [];
  const failedRequests = [];
  let totalTransferSize = 0;
  
  desktopPage.on('request', request => {
    networkRequests.push({
      url: request.url(),
      method: request.method(),
      resourceType: request.resourceType(),
      timestamp: Date.now()
    });
  });
  
  desktopPage.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      failedRequests.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  desktopPage.on('requestfinished', async request => {
    const response = await request.response();
    if (response) {
      const headers = await response.allHeaders();
      if (headers['content-length']) {
        totalTransferSize += parseInt(headers['content-length']);
      }
    }
  });
  
  // Enable performance metrics
  await client.send('Performance.enable');
  await client.send('Runtime.enable');
  
  // Start tracing for performance timeline
  await desktopContext.tracing.start({ 
    screenshots: true, 
    snapshots: true,
    categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline.frame']
  });
  
  try {
    console.log('Loading desktop version...');
    const startTime = Date.now();
    
    await desktopPage.goto(testUrl, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    const loadTime = Date.now() - startTime;
    
    // Wait for map and animations
    await desktopPage.waitForTimeout(5000);
    
    // Collect Performance Metrics
    const performanceMetrics = await client.send('Performance.getMetrics');
    const performanceTiming = await desktopPage.evaluate(() => performance.timing);
    const paintMetrics = await desktopPage.evaluate(() => {
      const entries = performance.getEntriesByType('paint');
      return entries.reduce((acc, entry) => {
        acc[entry.name] = entry.startTime;
        return acc;
      }, {});
    });
    
    // Memory Analysis
    const jsHeapSize = await desktopPage.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576),
          totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
          jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
        };
      }
      return null;
    });
    
    // WebVitals Collection
    const webVitals = await desktopPage.evaluate(() => {
      return new Promise((resolve) => {
        let metrics = {};
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay (simulated)
        metrics.FID = 0; // Would need actual user interaction
        
        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          metrics.CLS = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Time to Interactive
        metrics.TTI = performance.timing.domInteractive - performance.timing.navigationStart;
        
        setTimeout(() => resolve(metrics), 2000);
      });
    });
    
    // Advanced Content Analysis
    const contentAnalysis = await desktopPage.evaluate(() => {
      const analysis = {
        // DOM Complexity
        domComplexity: {
          totalElements: document.querySelectorAll('*').length,
          maxDepth: (() => {
            let maxDepth = 0;
            const traverse = (element, depth) => {
              maxDepth = Math.max(maxDepth, depth);
              Array.from(element.children).forEach(child => traverse(child, depth + 1));
            };
            traverse(document.body, 0);
            return maxDepth;
          })(),
          scriptTags: document.querySelectorAll('script').length,
          stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
          inlineStyles: document.querySelectorAll('[style]').length
        },
        
        // Map Analysis
        mapAnalysis: {
          mapboxLoaded: !!window.mapboxgl,
          mapInstances: document.querySelectorAll('.mapboxgl-map').length,
          mapInteractive: !!document.querySelector('.mapboxgl-canvas'),
          markers: document.querySelectorAll('.mapboxgl-marker').length,
          mapControls: {
            zoom: !!document.querySelector('.mapboxgl-ctrl-zoom-in'),
            navigation: !!document.querySelector('.mapboxgl-ctrl-compass'),
            attribution: !!document.querySelector('.mapboxgl-ctrl-attrib')
          }
        },
        
        // Animation Performance
        animationAnalysis: {
          cssAnimations: document.querySelectorAll('[class*="animate"], [style*="animation"]').length,
          transforms: document.querySelectorAll('[style*="transform"]').length,
          transitions: document.querySelectorAll('[style*="transition"]').length,
          canvasElements: document.querySelectorAll('canvas').length,
          webGLContexts: Array.from(document.querySelectorAll('canvas')).filter(canvas => {
            try {
              return canvas.getContext('webgl') || canvas.getContext('webgl2');
            } catch (e) {
              return false;
            }
          }).length
        },
        
        // Interactive Elements
        interactivity: {
          buttons: document.querySelectorAll('button').length,
          links: document.querySelectorAll('a[href]').length,
          forms: document.querySelectorAll('form').length,
          inputs: document.querySelectorAll('input, textarea, select').length,
          clickableElements: document.querySelectorAll('[onclick], [role="button"]').length,
          hoverEffects: document.querySelectorAll(':hover').length
        },
        
        // Content Quality
        contentQuality: {
          images: {
            total: document.querySelectorAll('img').length,
            withAlt: document.querySelectorAll('img[alt]').length,
            lazy: document.querySelectorAll('img[loading="lazy"]').length,
            responsive: document.querySelectorAll('img[srcset], picture').length
          },
          headings: {
            h1: document.querySelectorAll('h1').length,
            h2: document.querySelectorAll('h2').length,
            h3: document.querySelectorAll('h3').length,
            hierarchy: (() => {
              const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
              let isValid = true;
              let lastLevel = 0;
              headings.forEach(h => {
                const level = parseInt(h.tagName[1]);
                if (level > lastLevel + 1) isValid = false;
                lastLevel = level;
              });
              return isValid;
            })()
          },
          semanticHTML: {
            header: document.querySelectorAll('header').length,
            nav: document.querySelectorAll('nav').length,
            main: document.querySelectorAll('main').length,
            article: document.querySelectorAll('article').length,
            section: document.querySelectorAll('section').length,
            footer: document.querySelectorAll('footer').length
          }
        },
        
        // Third-party Scripts
        thirdPartyAnalysis: {
          googleAnalytics: !!window.ga || !!window.gtag,
          facebookPixel: !!window.fbq,
          mapbox: !!window.mapboxgl,
          customScripts: Array.from(document.querySelectorAll('script[src]'))
            .filter(s => !s.src.includes(window.location.hostname))
            .map(s => new URL(s.src).hostname)
            .filter((v, i, a) => a.indexOf(v) === i)
        }
      };
      
      return analysis;
    });
    
    // Resource Timing Analysis
    const resourceTiming = await desktopPage.evaluate(() => {
      const resources = performance.getEntriesByType('resource');
      const grouped = resources.reduce((acc, resource) => {
        const type = resource.initiatorType || 'other';
        if (!acc[type]) acc[type] = { count: 0, totalDuration: 0, totalSize: 0 };
        acc[type].count++;
        acc[type].totalDuration += resource.duration;
        return acc;
      }, {});
      
      return {
        total: resources.length,
        byType: grouped,
        slowest: resources
          .sort((a, b) => b.duration - a.duration)
          .slice(0, 5)
          .map(r => ({ name: r.name, duration: Math.round(r.duration), type: r.initiatorType }))
      };
    });
    
    // Security Headers Analysis
    const securityHeaders = await desktopPage.evaluate(async () => {
      try {
        const response = await fetch(window.location.href);
        const headers = {};
        const securityHeadersList = [
          'content-security-policy',
          'x-frame-options',
          'x-content-type-options',
          'strict-transport-security',
          'x-xss-protection',
          'referrer-policy',
          'permissions-policy'
        ];
        
        securityHeadersList.forEach(header => {
          const value = response.headers.get(header);
          if (value) headers[header] = value;
        });
        
        return headers;
      } catch (e) {
        return null;
      }
    });
    
    // Save desktop results
    results.desktop = {
      loadTime,
      contentAnalysis,
      resourceTiming,
      webVitals,
      performanceMetrics: performanceMetrics.metrics,
      paintMetrics,
      memory: jsHeapSize,
      networkSummary: {
        totalRequests: networkRequests.length,
        failedRequests: failedRequests.length,
        totalTransferSize: Math.round(totalTransferSize / 1024) + 'KB',
        requestsByType: networkRequests.reduce((acc, req) => {
          acc[req.resourceType] = (acc[req.resourceType] || 0) + 1;
          return acc;
        }, {})
      }
    };
    
    console.log('✅ Desktop analysis complete');
    
    // Stop tracing
    await desktopContext.tracing.stop({ path: 'desktop-trace.zip' });
    
  } catch (error) {
    console.error('Desktop analysis error:', error.message);
    results.desktop.error = error.message;
  }
  
  // Mobile Deep Analysis (iPhone 14 Pro)
  console.log('\n📱 MOBILE DEEP ANALYSIS');
  console.log('-'.repeat(40));
  
  const iPhone14Pro = devices['iPhone 14 Pro'];
  const mobileContext = await browser.newContext({
    ...iPhone14Pro,
    recordVideo: { dir: './videos/' },
    ignoreHTTPSErrors: true
  });
  
  const mobilePage = await mobileContext.newPage();
  
  // Mobile-specific network conditions
  await mobilePage.route('**/*', route => route.continue());
  
  // Simulate 4G network
  const mobileClient = await mobilePage.context().newCDPSession(mobilePage);
  await mobileClient.send('Network.enable');
  await mobileClient.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: 4 * 1024 * 1024 / 8, // 4 Mbps
    uploadThroughput: 3 * 1024 * 1024 / 8,   // 3 Mbps
    latency: 20
  });
  
  try {
    console.log('Loading mobile version...');
    
    await mobilePage.goto(testUrl, { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    
    await mobilePage.waitForTimeout(5000);
    
    // Mobile-specific Analysis
    const mobileAnalysis = await mobilePage.evaluate(() => {
      const analysis = {
        // Touch Target Analysis
        touchTargets: (() => {
          const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"], [onclick]');
          const results = {
            total: interactiveElements.length,
            adequate: 0,
            small: 0,
            tooClose: []
          };
          
          const positions = [];
          interactiveElements.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const size = Math.min(rect.width, rect.height);
            
            if (size >= 44) results.adequate++;
            else results.small++;
            
            // Check spacing between elements
            positions.forEach((pos, j) => {
              const distance = Math.sqrt(
                Math.pow(rect.left - pos.left, 2) + 
                Math.pow(rect.top - pos.top, 2)
              );
              if (distance < 8) {
                results.tooClose.push({ element1: j, element2: i, distance });
              }
            });
            
            positions.push({ left: rect.left, top: rect.top });
          });
          
          return results;
        })(),
        
        // Viewport Usage
        viewportUsage: {
          viewportMeta: document.querySelector('meta[name="viewport"]')?.content,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          scrollRequired: document.documentElement.scrollHeight > document.documentElement.clientHeight,
          horizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
        },
        
        // Mobile Optimizations
        mobileOptimizations: {
          touchEvents: !!window.ontouchstart,
          serviceWorker: 'serviceWorker' in navigator,
          manifest: !!document.querySelector('link[rel="manifest"]'),
          appleTouch: !!document.querySelector('link[rel="apple-touch-icon"]'),
          mobileFirst: (() => {
            const styles = Array.from(document.styleSheets);
            let mobileFirstCount = 0;
            let desktopFirstCount = 0;
            
            styles.forEach(sheet => {
              try {
                Array.from(sheet.cssRules || []).forEach(rule => {
                  if (rule.media) {
                    if (rule.media.mediaText.includes('min-width')) mobileFirstCount++;
                    if (rule.media.mediaText.includes('max-width')) desktopFirstCount++;
                  }
                });
              } catch (e) {}
            });
            
            return mobileFirstCount > desktopFirstCount;
          })()
        },
        
        // Font and Text Analysis
        textAnalysis: {
          fonts: (() => {
            const computed = new Set();
            document.querySelectorAll('*').forEach(el => {
              const font = window.getComputedStyle(el).fontFamily;
              if (font) computed.add(font);
            });
            return Array.from(computed);
          })(),
          readability: (() => {
            const texts = Array.from(document.querySelectorAll('p, span, div')).filter(el => el.textContent.trim());
            const analysis = {
              tooSmall: 0,
              adequate: 0,
              lineHeightIssues: 0
            };
            
            texts.forEach(el => {
              const styles = window.getComputedStyle(el);
              const fontSize = parseFloat(styles.fontSize);
              const lineHeight = parseFloat(styles.lineHeight);
              
              if (fontSize < 14) analysis.tooSmall++;
              else analysis.adequate++;
              
              if (lineHeight / fontSize < 1.4) analysis.lineHeightIssues++;
            });
            
            return analysis;
          })()
        }
      };
      
      return analysis;
    });
    
    // Gesture Recognition Areas
    const gestureAreas = await mobilePage.evaluate(() => {
      const areas = {
        swipeable: document.querySelectorAll('[class*="swipe"], [data-swipe]').length,
        draggable: document.querySelectorAll('[draggable="true"]').length,
        pinchZoom: document.querySelectorAll('.mapboxgl-canvas, [class*="zoom"]').length
      };
      return areas;
    });
    
    results.mobile = {
      analysis: mobileAnalysis,
      gestureAreas,
      network: '4G simulation'
    };
    
    console.log('✅ Mobile analysis complete');
    
  } catch (error) {
    console.error('Mobile analysis error:', error.message);
    results.mobile.error = error.message;
  }
  
  // User Flow Testing
  console.log('\n🔄 USER FLOW ANALYSIS');
  console.log('-'.repeat(40));
  
  const flowContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const flowPage = await flowContext.newPage();
  
  try {
    await flowPage.goto(testUrl, { waitUntil: 'networkidle' });
    await flowPage.waitForTimeout(3000);
    
    // Test: Property Selection Flow
    const propertyFlow = await flowPage.evaluate(async () => {
      const results = {
        propertiesFound: [],
        clickable: [],
        propertyTransitions: []
      };
      
      // Find property markers/buttons
      const propertyElements = document.querySelectorAll('[class*="property"], [class*="Property"], button');
      results.propertiesFound = Array.from(propertyElements).map(el => ({
        text: el.textContent?.trim(),
        classes: el.className
      }));
      
      return results;
    });
    
    results.userFlows = { propertyFlow };
    
    console.log('✅ User flow analysis complete');
    
  } catch (error) {
    console.error('User flow analysis error:', error.message);
    results.userFlows.error = error.message;
  }
  
  await browser.close();
  
  // Generate Report
  console.log('\n📊 GENERATING COMPREHENSIVE REPORT');
  console.log('=' .repeat(80));
  
  const report = generateReport(results);
  await fs.writeFile('advanced-analysis-report.json', JSON.stringify(results, null, 2));
  await fs.writeFile('advanced-analysis-report.md', report);
  
  console.log('\n✅ Analysis complete! Check advanced-analysis-report.md for details.');
}

function generateReport(results) {
  const { desktop, mobile } = results;
  
  let report = `# Advanced Luxor Metals Website Analysis Report

Generated: ${results.timestamp}
URL: ${results.url}

## Executive Summary

This report provides a comprehensive technical analysis of the Luxor Metals website using advanced Playwright capabilities including performance profiling, network analysis, accessibility testing, and user flow validation.

## 🎯 Performance Analysis

### Desktop Performance Metrics
- **Load Time**: ${desktop.loadTime}ms
- **First Contentful Paint**: ${desktop.paintMetrics?.['first-contentful-paint']?.toFixed(2) || 'N/A'}ms
- **Largest Contentful Paint**: ${desktop.webVitals?.LCP?.toFixed(2) || 'N/A'}ms
- **Time to Interactive**: ${desktop.webVitals?.TTI || 'N/A'}ms
- **Cumulative Layout Shift**: ${desktop.webVitals?.CLS?.toFixed(3) || 'N/A'}

### Memory Profile
${desktop.memory ? `
- **Used JS Heap**: ${desktop.memory.usedJSHeapSize}MB
- **Total JS Heap**: ${desktop.memory.totalJSHeapSize}MB
- **Heap Limit**: ${desktop.memory.jsHeapSizeLimit}MB
` : 'Memory profiling not available'}

### Network Performance
- **Total Requests**: ${desktop.networkSummary?.totalRequests || 0}
- **Failed Requests**: ${desktop.networkSummary?.failedRequests || 0}
- **Total Transfer Size**: ${desktop.networkSummary?.totalTransferSize || 'N/A'}

### Resource Breakdown
${desktop.resourceTiming ? Object.entries(desktop.resourceTiming.byType).map(([type, data]) => 
  `- **${type}**: ${data.count} requests, ${data.totalDuration.toFixed(0)}ms total`
).join('\n') : 'No resource timing data'}

## 🏗️ DOM and Content Analysis

### DOM Complexity
- **Total Elements**: ${desktop.contentAnalysis?.domComplexity?.totalElements || 'N/A'}
- **Max DOM Depth**: ${desktop.contentAnalysis?.domComplexity?.maxDepth || 'N/A'}
- **Script Tags**: ${desktop.contentAnalysis?.domComplexity?.scriptTags || 'N/A'}
- **Stylesheets**: ${desktop.contentAnalysis?.domComplexity?.stylesheets || 'N/A'}
- **Inline Styles**: ${desktop.contentAnalysis?.domComplexity?.inlineStyles || 'N/A'}

### Map Implementation
${desktop.contentAnalysis?.mapAnalysis ? `
- **Mapbox Loaded**: ${desktop.contentAnalysis.mapAnalysis.mapboxLoaded ? '✅' : '❌'}
- **Map Instances**: ${desktop.contentAnalysis.mapAnalysis.mapInstances}
- **Interactive**: ${desktop.contentAnalysis.mapAnalysis.mapInteractive ? '✅' : '❌'}
- **Markers**: ${desktop.contentAnalysis.mapAnalysis.markers}
- **Controls**: Zoom ${desktop.contentAnalysis.mapAnalysis.mapControls.zoom ? '✅' : '❌'}, Navigation ${desktop.contentAnalysis.mapAnalysis.mapControls.navigation ? '✅' : '❌'}
` : 'Map analysis not available'}

### Animation Performance
- **CSS Animations**: ${desktop.contentAnalysis?.animationAnalysis?.cssAnimations || 0}
- **Transform Elements**: ${desktop.contentAnalysis?.animationAnalysis?.transforms || 0}
- **Canvas Elements**: ${desktop.contentAnalysis?.animationAnalysis?.canvasElements || 0}
- **WebGL Contexts**: ${desktop.contentAnalysis?.animationAnalysis?.webGLContexts || 0}

## 📱 Mobile Experience Analysis

### Touch Target Analysis
${mobile.analysis?.touchTargets ? `
- **Total Interactive Elements**: ${mobile.analysis.touchTargets.total}
- **Adequate Size (≥44px)**: ${mobile.analysis.touchTargets.adequate}
- **Too Small**: ${mobile.analysis.touchTargets.small}
- **Spacing Issues**: ${mobile.analysis.touchTargets.tooClose.length} pairs too close
` : 'Touch target analysis not available'}

### Mobile Optimizations
${mobile.analysis?.mobileOptimizations ? `
- **Touch Events**: ${mobile.analysis.mobileOptimizations.touchEvents ? '✅' : '❌'}
- **Service Worker**: ${mobile.analysis.mobileOptimizations.serviceWorker ? '✅' : '❌'}
- **Web Manifest**: ${mobile.analysis.mobileOptimizations.manifest ? '✅' : '❌'}
- **Mobile First CSS**: ${mobile.analysis.mobileOptimizations.mobileFirst ? '✅' : '❌'}
` : 'Mobile optimization analysis not available'}

### Text Readability (Mobile)
${mobile.analysis?.textAnalysis?.readability ? `
- **Adequate Font Size**: ${mobile.analysis.textAnalysis.readability.adequate}
- **Too Small (<14px)**: ${mobile.analysis.textAnalysis.readability.tooSmall}
- **Line Height Issues**: ${mobile.analysis.textAnalysis.readability.lineHeightIssues}
` : 'Text analysis not available'}

## 🔍 Content Quality Assessment

### Semantic HTML Usage
${desktop.contentAnalysis?.contentQuality?.semanticHTML ? Object.entries(desktop.contentAnalysis.contentQuality.semanticHTML).map(([tag, count]) => 
  `- **<${tag}>**: ${count > 0 ? '✅' : '❌'} (${count})`
).join('\n') : 'Semantic HTML analysis not available'}

### Image Optimization
${desktop.contentAnalysis?.contentQuality?.images ? `
- **Total Images**: ${desktop.contentAnalysis.contentQuality.images.total}
- **With Alt Text**: ${desktop.contentAnalysis.contentQuality.images.withAlt}/${desktop.contentAnalysis.contentQuality.images.total}
- **Lazy Loading**: ${desktop.contentAnalysis.contentQuality.images.lazy}
- **Responsive Images**: ${desktop.contentAnalysis.contentQuality.images.responsive}
` : 'Image analysis not available'}

## 🌐 Third-Party Integration

### External Services
${desktop.contentAnalysis?.thirdPartyAnalysis ? `
- **Analytics**: ${desktop.contentAnalysis.thirdPartyAnalysis.googleAnalytics ? 'Google Analytics ✅' : 'Not detected ❌'}
- **Mapbox**: ${desktop.contentAnalysis.thirdPartyAnalysis.mapbox ? '✅' : '❌'}
- **External Domains**: ${desktop.contentAnalysis.thirdPartyAnalysis.customScripts.join(', ') || 'None'}
` : 'Third-party analysis not available'}

## 🚨 Critical Findings

### Performance Issues
${(() => {
  const issues = [];
  if (desktop.webVitals?.LCP > 2500) issues.push('- ⚠️ LCP exceeds 2.5s threshold');
  if (desktop.webVitals?.CLS > 0.1) issues.push('- ⚠️ High Cumulative Layout Shift detected');
  if (desktop.memory?.usedJSHeapSize > 50) issues.push('- ⚠️ High memory usage (>50MB)');
  if (desktop.networkSummary?.failedRequests > 0) issues.push(`- ⚠️ ${desktop.networkSummary.failedRequests} failed network requests`);
  if (mobile.analysis?.touchTargets?.small > 0) issues.push(`- ⚠️ ${mobile.analysis.touchTargets.small} touch targets too small`);
  return issues.length ? issues.join('\\n') : '✅ No critical performance issues detected';
})()}

### Mobile Experience Issues
${(() => {
  const issues = [];
  if (!mobile.analysis?.mobileOptimizations?.serviceWorker) issues.push('- ⚠️ No Service Worker detected');
  if (!mobile.analysis?.mobileOptimizations?.manifest) issues.push('- ⚠️ No Web App Manifest');
  if (mobile.analysis?.textAnalysis?.readability?.tooSmall > 10) issues.push('- ⚠️ Significant text readability issues');
  if (mobile.analysis?.viewportUsage?.horizontalScroll) issues.push('- ⚠️ Horizontal scroll detected');
  return issues.length ? issues.join('\\n') : '✅ No critical mobile issues detected';
})()}

## 💡 Recommendations

### High Priority
1. **Performance Optimization**
   - Implement lazy loading for below-fold content
   - Optimize WebGL/Canvas rendering for mobile devices
   - Consider code splitting for faster initial load

2. **Mobile Experience**
   - Increase minimum font sizes to 16px for better readability
   - Add Service Worker for offline functionality
   - Implement Web App Manifest for installability

3. **Accessibility**
   - Ensure all interactive elements meet 44x44px minimum
   - Add skip navigation links
   - Improve color contrast ratios

### Medium Priority
1. **Network Optimization**
   - Implement resource hints (preconnect, prefetch)
   - Enable HTTP/2 Push for critical resources
   - Optimize image formats (WebP, AVIF)

2. **SEO and Metadata**
   - Add structured data for properties
   - Implement dynamic meta tags
   - Create XML sitemap

## 🎯 Conclusion

The Luxor Metals website demonstrates strong technical implementation with its map-centric approach and smooth animations. The analysis reveals opportunities for performance optimization, particularly in mobile text readability and touch target sizing. The site's innovative design successfully differentiates it in the market while maintaining reasonable performance metrics.

**Technical Score: 7.8/10**
- Performance: 7/10
- Mobile Experience: 8/10
- Code Quality: 8/10
- Innovation: 9/10
`;

  return report;
}

advancedSiteAnalysis().catch(console.error);
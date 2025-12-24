const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting Chrome diagnosis for property pages...\n');
  
  // Launch Chrome browser
  const browser = await chromium.launch({
    headless: false, // Show browser to see visual issues
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-gpu-sandbox',
      '--enable-logging',
      '--v=1'
    ]
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  
  const page = await context.newPage();
  
  // Monitor console for errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  // Monitor performance
  page.on('framenavigated', () => {
    console.log('📍 Frame navigated');
  });
  
  try {
    console.log('📄 Loading Fiji property page...');
    await page.goto('http://localhost:3001/properties/fiji', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait for animations to start
    await page.waitForTimeout(500);
    
    // Check for layout shifts
    console.log('\n🔍 Checking for layout issues...');
    
    // Measure section positions and gaps
    const sectionGaps = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const measurements = [];
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const styles = window.getComputedStyle(section);
        
        measurements.push({
          index,
          top: rect.top,
          height: rect.height,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          marginTop: styles.marginTop,
          marginBottom: styles.marginBottom,
          display: styles.display,
          opacity: styles.opacity,
          transform: styles.transform,
          hasBackdropFilter: styles.backdropFilter !== 'none',
          className: section.className
        });
      });
      
      // Calculate gaps between sections
      const gaps = [];
      for (let i = 0; i < measurements.length - 1; i++) {
        const current = measurements[i];
        const next = measurements[i + 1];
        const gap = next.top - (current.top + current.height);
        gaps.push({
          between: `Section ${i} and ${i + 1}`,
          gap: Math.round(gap),
          currentBottom: Math.round(current.top + current.height),
          nextTop: Math.round(next.top)
        });
      }
      
      return { measurements, gaps };
    });
    
    console.log('\n📏 Section Measurements:');
    sectionGaps.measurements.forEach((section, i) => {
      console.log(`\nSection ${i}:`);
      console.log(`  Position: top=${Math.round(section.top)}px, height=${Math.round(section.height)}px`);
      console.log(`  Padding: ${section.paddingTop} / ${section.paddingBottom}`);
      console.log(`  Margin: ${section.marginTop} / ${section.marginBottom}`);
      console.log(`  Opacity: ${section.opacity}`);
      console.log(`  Transform: ${section.transform}`);
      console.log(`  Has backdrop-filter: ${section.hasBackdropFilter}`);
    });
    
    console.log('\n📐 Gaps between sections:');
    sectionGaps.gaps.forEach(gap => {
      const gapSize = gap.gap;
      const indicator = gapSize > 100 ? '⚠️ LARGE GAP' : gapSize < 0 ? '❌ OVERLAP' : '✅';
      console.log(`${indicator} ${gap.between}: ${gap.gap}px gap`);
      console.log(`    (Section ends at ${gap.currentBottom}px, next starts at ${gap.nextTop}px)`);
    });
    
    // Check for animation issues
    console.log('\n🎬 Checking animations...');
    const animationIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check all elements with motion animations
      const motionElements = document.querySelectorAll('[style*="transform"], [style*="opacity"]');
      
      motionElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const styles = window.getComputedStyle(el);
        
        // Check if element is visible but has opacity issues
        if (rect.height > 0 && parseFloat(styles.opacity) < 1) {
          issues.push({
            type: 'opacity',
            element: el.tagName + '.' + el.className.split(' ')[0],
            opacity: styles.opacity,
            visible: rect.top < window.innerHeight && rect.bottom > 0
          });
        }
        
        // Check for transform issues
        if (styles.transform && styles.transform !== 'none') {
          const matrix = styles.transform.match(/matrix.*\((.+)\)/);
          if (matrix) {
            const values = matrix[1].split(', ');
            const translateX = parseFloat(values[4] || 0);
            const translateY = parseFloat(values[5] || 0);
            
            if (Math.abs(translateX) > 10 || Math.abs(translateY) > 10) {
              issues.push({
                type: 'transform',
                element: el.tagName + '.' + el.className.split(' ')[0],
                transform: styles.transform,
                translateX,
                translateY
              });
            }
          }
        }
      });
      
      return issues;
    });
    
    if (animationIssues.length > 0) {
      console.log('\n⚠️ Animation issues found:');
      animationIssues.forEach(issue => {
        if (issue.type === 'opacity') {
          console.log(`  - Element "${issue.element}" has opacity ${issue.opacity} (visible: ${issue.visible})`);
        } else if (issue.type === 'transform') {
          console.log(`  - Element "${issue.element}" has transform offset: X=${issue.translateX}px, Y=${issue.translateY}px`);
        }
      });
    } else {
      console.log('✅ No animation issues detected');
    }
    
    // Check performance metrics
    console.log('\n⚡ Performance Metrics:');
    const performanceMetrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const navigationEntry = performance.getEntriesByType('navigation')[0];
      
      return {
        firstPaint: paintEntries.find(e => e.name === 'first-paint')?.startTime,
        firstContentfulPaint: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime,
        domInteractive: navigationEntry?.domInteractive,
        domComplete: navigationEntry?.domComplete,
        loadComplete: navigationEntry?.loadEventEnd
      };
    });
    
    Object.entries(performanceMetrics).forEach(([key, value]) => {
      console.log(`  ${key}: ${value ? Math.round(value) + 'ms' : 'N/A'}`);
    });
    
    // Check for backdrop-filter performance
    console.log('\n🎨 Checking backdrop-filter usage:');
    const backdropFilterCount = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let count = 0;
      let heavyBlurs = 0;
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backdropFilter && style.backdropFilter !== 'none') {
          count++;
          // Check for heavy blur values
          const blurMatch = style.backdropFilter.match(/blur\((\d+)/);
          if (blurMatch && parseInt(blurMatch[1]) > 20) {
            heavyBlurs++;
          }
        }
      });
      
      return { total: count, heavy: heavyBlurs };
    });
    
    console.log(`  Total elements with backdrop-filter: ${backdropFilterCount.total}`);
    console.log(`  Elements with heavy blur (>20px): ${backdropFilterCount.heavy}`);
    if (backdropFilterCount.heavy > 5) {
      console.log('  ⚠️ Many heavy backdrop-filters may cause performance issues in Chrome');
    }
    
    // Take screenshots for visual inspection
    console.log('\n📸 Taking screenshots...');
    await page.screenshot({ 
      path: 'chrome-property-page-full.png',
      fullPage: true 
    });
    console.log('  ✅ Full page screenshot saved as chrome-property-page-full.png');
    
    await page.screenshot({ 
      path: 'chrome-property-page-viewport.png',
      fullPage: false 
    });
    console.log('  ✅ Viewport screenshot saved as chrome-property-page-viewport.png');
    
    // Scroll to check for issues during scroll
    console.log('\n📜 Testing scroll behavior...');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);
    
    const scrollIssues = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      const issues = [];
      
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const styles = window.getComputedStyle(section);
        
        // Check if section is jumping or has unexpected position
        if (rect.top < -1000 || rect.top > 10000) {
          issues.push({
            section: i,
            issue: 'Unexpected position',
            top: rect.top
          });
        }
      });
      
      return issues;
    });
    
    if (scrollIssues.length > 0) {
      console.log('⚠️ Scroll issues detected:');
      scrollIssues.forEach(issue => {
        console.log(`  - Section ${issue.section}: ${issue.issue} (top: ${issue.top}px)`);
      });
    } else {
      console.log('✅ No scroll issues detected');
    }
    
    console.log('\n✅ Diagnosis complete!');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('\n👀 Browser will remain open for manual inspection.');
    console.log('Press Ctrl+C to close when done.\n');
    
    // Wait indefinitely
    await new Promise(() => {});
  }
})();
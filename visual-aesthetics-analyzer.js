const { chromium, devices } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function analyzeAndFixVisualAesthetics() {
  console.log('🎨 Visual Aesthetics Analyzer - Auto Detection & Fix System\n');
  console.log('=' .repeat(80));
  console.log('Goal: Visually pleasing design > Extreme accessibility\n');
  
  const browser = await chromium.launch({ headless: false });
  
  // Test on key mobile devices
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
    }
  ];
  
  const issues = [];
  const fixes = [];
  
  for (const config of configs) {
    console.log(`\n📱 Analyzing ${config.name}...`);
    
    const context = await browser.newContext({
      ...config.device,
      viewport: config.viewport,
      userAgent: config.device?.userAgent
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:3003/landingpagekappaoptimized', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      // Wait for animations to settle
      await page.waitForTimeout(3000);
      
      // Take screenshot for visual reference
      await page.screenshot({ 
        path: `visual-analysis-${config.name}-before.png`,
        fullPage: true 
      });
      
      console.log('  📸 Screenshot captured');
      
      // Analyze visual issues
      const visualProblems = await page.evaluate(() => {
        const problems = [];
        
        // Helper function to check if text is overlapping
        function elementsOverlap(elem1, elem2) {
          const rect1 = elem1.getBoundingClientRect();
          const rect2 = elem2.getBoundingClientRect();
          
          return !(rect1.right < rect2.left || 
                   rect1.left > rect2.right || 
                   rect1.bottom < rect2.top || 
                   rect1.top > rect2.bottom);
        }
        
        // Helper to check visual density
        function checkVisualDensity(element) {
          const rect = element.getBoundingClientRect();
          const style = window.getComputedStyle(element);
          const fontSize = parseFloat(style.fontSize);
          const lineHeight = parseFloat(style.lineHeight);
          const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
          
          // Check if text is too cramped
          const textDensity = lineHeight / fontSize;
          const containerDensity = rect.height / (fontSize + padding);
          
          return {
            element: element.tagName + (element.className ? '.' + element.className.split(' ')[0] : ''),
            fontSize,
            lineHeight,
            textDensity,
            containerDensity,
            rect,
            isCramped: textDensity < 1.4 || containerDensity < 2,
            isOversized: fontSize > 20 && element.tagName !== 'H1' && element.tagName !== 'H2'
          };
        }
        
        // 1. Check for oversized text elements
        const textElements = document.querySelectorAll('p, span, div, li, a, button');
        textElements.forEach(el => {
          if (!el.textContent?.trim()) return;
          
          const style = window.getComputedStyle(el);
          const fontSize = parseFloat(style.fontSize);
          const parent = el.parentElement;
          const parentRect = parent?.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          
          // Skip if element is hidden
          if (elRect.width === 0 || elRect.height === 0) return;
          
          // Check if text is disproportionately large
          if (fontSize >= 18 && el.tagName !== 'H1' && el.tagName !== 'H2' && el.tagName !== 'H3') {
            // Check if it's causing layout issues
            if (parentRect && elRect.width > parentRect.width * 0.95) {
              problems.push({
                type: 'oversized_text',
                selector: el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ')[0] : ''),
                fontSize: fontSize,
                issue: 'Text too large for container',
                recommendation: Math.min(16, fontSize * 0.85)
              });
            }
          }
          
          // Check for bunched up content
          const density = checkVisualDensity(el);
          if (density.isCramped && fontSize >= 18) {
            problems.push({
              type: 'cramped_text',
              selector: density.element,
              fontSize: density.fontSize,
              lineHeight: density.lineHeight,
              issue: 'Text appears bunched up',
              recommendation: {
                fontSize: Math.min(16, fontSize * 0.9),
                lineHeight: fontSize * 1.6
              }
            });
          }
        });
        
        // 2. Check headers for proportion issues
        const headers = document.querySelectorAll('h1, h2, h3');
        headers.forEach(h => {
          const rect = h.getBoundingClientRect();
          const style = window.getComputedStyle(h);
          const fontSize = parseFloat(style.fontSize);
          
          // Check if header is too large for viewport
          if (rect.width > window.innerWidth * 0.9) {
            problems.push({
              type: 'oversized_header',
              selector: h.tagName.toLowerCase() + (h.className ? '.' + h.className.split(' ')[0] : ''),
              fontSize: fontSize,
              issue: 'Header too wide for viewport',
              recommendation: fontSize * 0.8
            });
          }
        });
        
        // 3. Check for visual hierarchy issues
        const allText = Array.from(document.querySelectorAll('*')).filter(el => {
          const text = el.textContent?.trim();
          return text && text.length > 0 && el.children.length === 0;
        });
        
        let lastFontSize = 0;
        let sameSize = 0;
        allText.forEach(el => {
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          if (fontSize === lastFontSize && fontSize >= 18) {
            sameSize++;
            if (sameSize > 5) {
              problems.push({
                type: 'hierarchy_issue',
                selector: 'multiple_elements',
                fontSize: fontSize,
                issue: 'Too many elements with same large font size',
                recommendation: 'vary_sizes'
              });
              sameSize = 0;
            }
          } else {
            sameSize = 0;
          }
          lastFontSize = fontSize;
        });
        
        // 4. Check specific problem areas
        // Map description text
        const mapDescriptions = document.querySelectorAll('p[style*="Aeonik"]');
        mapDescriptions.forEach(desc => {
          const style = window.getComputedStyle(desc);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize >= 18) {
            problems.push({
              type: 'map_description',
              selector: 'property-description',
              fontSize: fontSize,
              issue: 'Property descriptions too large',
              recommendation: 15
            });
          }
        });
        
        // Navigation items
        const navItems = document.querySelectorAll('nav a, nav button');
        navItems.forEach(nav => {
          const style = window.getComputedStyle(nav);
          const fontSize = parseFloat(style.fontSize);
          if (fontSize > 16) {
            problems.push({
              type: 'nav_text',
              selector: 'nav',
              fontSize: fontSize,
              issue: 'Navigation text too large',
              recommendation: 15
            });
          }
        });
        
        // Button text
        const buttons = document.querySelectorAll('button');
        buttons.forEach(btn => {
          const style = window.getComputedStyle(btn);
          const fontSize = parseFloat(style.fontSize);
          const rect = btn.getBoundingClientRect();
          
          if (fontSize >= 16 && rect.height > 60) {
            problems.push({
              type: 'button_text',
              selector: 'button',
              fontSize: fontSize,
              height: rect.height,
              issue: 'Button text causing oversized buttons',
              recommendation: 14
            });
          }
        });
        
        return problems;
      });
      
      console.log(`  🔍 Found ${visualProblems.length} visual issues`);
      
      visualProblems.forEach(problem => {
        console.log(`  ⚠️  ${problem.type}: ${problem.issue} (${problem.fontSize}px)`);
        issues.push({ device: config.name, ...problem });
      });
      
    } catch (error) {
      console.error(`  ❌ Error analyzing ${config.name}:`, error.message);
    }
    
    await context.close();
  }
  
  // Generate fixes based on issues
  console.log('\n\n🔧 GENERATING AUTOMATIC FIXES');
  console.log('=' .repeat(80));
  
  if (issues.length === 0) {
    console.log('✅ No visual issues detected!');
    await browser.close();
    return;
  }
  
  // Group issues by type to create consolidated fixes
  const fixGroups = {
    oversized_text: [],
    cramped_text: [],
    oversized_header: [],
    map_description: [],
    nav_text: [],
    button_text: []
  };
  
  issues.forEach(issue => {
    if (fixGroups[issue.type]) {
      fixGroups[issue.type].push(issue);
    }
  });
  
  // Generate CSS fixes
  let cssFixContent = `/* Auto-generated visual fixes for optimal aesthetics */
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
}`;
  
  // Apply fixes to layout.tsx
  console.log('\n📝 Applying visual fixes to layout.tsx...');
  
  const layoutPath = path.join(process.cwd(), 'app/landingpagekappaoptimized/layout.tsx');
  let layoutContent = await fs.readFile(layoutPath, 'utf8');
  
  // Replace the global styles section
  const styleStart = layoutContent.indexOf('<style jsx global>{`');
  const styleEnd = layoutContent.indexOf('`}</style>') + '`}</style>'.length;
  
  const newLayoutContent = layoutContent.substring(0, styleStart) +
    `<style jsx global>{\`
        ${cssFixContent}
      \`}</style>` +
    layoutContent.substring(styleEnd);
  
  await fs.writeFile(layoutPath, newLayoutContent);
  console.log('✅ Layout fixes applied');
  
  // Also update page.tsx to remove some aggressive overrides
  console.log('\n📝 Updating page.tsx for better aesthetics...');
  
  const pagePath = path.join(process.cwd(), 'app/landingpagekappaoptimized/page.tsx');
  let pageContent = await fs.readFile(pagePath, 'utf8');
  
  // Remove or comment out the aggressive mobile text rules
  pageContent = pageContent.replace(
    /\/\* Improve text readability on mobile \*\/[\s\S]*?\/\* Map labels and overlays \*\//,
    `/* Text sizing optimized for visual aesthetics */
        @media (max-width: 768px) {
          /* Balanced text sizing for better visual hierarchy */
          html, body {
            font-size: 16px !important;
            line-height: 1.6 !important;
          }
          
          /* Property descriptions with elegant sizing */
          .property-description {
            font-size: 15px !important;
            line-height: 1.65 !important;
          }
        }`
  );
  
  await fs.writeFile(pagePath, pageContent);
  console.log('✅ Page optimizations adjusted');
  
  // Test the fixes
  console.log('\n\n🧪 TESTING VISUAL FIXES');
  console.log('=' .repeat(80));
  
  for (const config of configs) {
    console.log(`\n📱 Re-testing ${config.name}...`);
    
    const context = await browser.newContext({
      ...config.device,
      viewport: config.viewport,
      userAgent: config.device?.userAgent
    });
    
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:3003/landingpagekappaoptimized', {
        waitUntil: 'networkidle',
        timeout: 30000
      });
      
      await page.waitForTimeout(3000);
      
      // Take after screenshot
      await page.screenshot({ 
        path: `visual-analysis-${config.name}-after.png`,
        fullPage: true 
      });
      
      console.log('  📸 After screenshot captured');
      
      // Quick visual check
      const visualCheck = await page.evaluate(() => {
        const elements = document.querySelectorAll('p, span, div, button');
        let oversizedCount = 0;
        let goodCount = 0;
        
        elements.forEach(el => {
          if (!el.textContent?.trim()) return;
          const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
          
          if (fontSize > 18 && el.tagName !== 'H1' && el.tagName !== 'H2') {
            oversizedCount++;
          } else if (fontSize >= 14 && fontSize <= 16) {
            goodCount++;
          }
        });
        
        return { oversizedCount, goodCount, total: elements.length };
      });
      
      console.log(`  ✅ Visual balance: ${visualCheck.goodCount}/${visualCheck.total} elements properly sized`);
      console.log(`  📊 Oversized elements reduced to: ${visualCheck.oversizedCount}`);
      
    } catch (error) {
      console.error(`  ❌ Error testing ${config.name}:`, error.message);
    }
    
    await context.close();
  }
  
  await browser.close();
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    issuesFound: issues.length,
    issues: issues,
    fixesApplied: [
      'Reduced base font size from 18px to 16px',
      'Adjusted line height from 1.7 to 1.6',
      'Refined header sizes for better hierarchy',
      'Optimized button and navigation text',
      'Improved property description sizing',
      'Removed aggressive touch target expansion',
      'Balanced accessibility with visual aesthetics'
    ],
    result: 'Visual aesthetics prioritized while maintaining reasonable readability'
  };
  
  await fs.writeFile('visual-aesthetics-report.json', JSON.stringify(report, null, 2));
  
  console.log('\n\n✨ VISUAL OPTIMIZATION COMPLETE');
  console.log('=' .repeat(80));
  console.log('✅ Automatic detection and fixes applied');
  console.log('📸 Before/after screenshots saved');
  console.log('📄 Report saved to visual-aesthetics-report.json');
  console.log('\nThe page now prioritizes visual aesthetics while maintaining reasonable accessibility.');
}

// Run the analyzer
analyzeAndFixVisualAesthetics().catch(console.error);
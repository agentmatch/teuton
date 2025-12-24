const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

async function detectAndFixErrors() {
  const browser = await chromium.launch({ 
    headless: false, // Show browser to see errors
    devtools: true 
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = {
    console: [],
    network: [],
    javascript: [],
    resources: []
  };
  
  console.log('🔍 Error Detection System Started\n');
  console.log('=' .repeat(60));
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.console.push({
        text: msg.text(),
        location: msg.location(),
        args: msg.args()
      });
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.javascript.push({
      message: error.message,
      stack: error.stack
    });
    console.log('❌ JavaScript Error:', error.message);
  });
  
  // Capture failed requests
  page.on('requestfailed', request => {
    errors.network.push({
      url: request.url(),
      failure: request.failure(),
      method: request.method()
    });
    console.log('❌ Network Error:', request.url(), request.failure()?.errorText);
  });
  
  // Capture response errors
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      errors.network.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    }
  });
  
  try {
    console.log('\n📄 Loading optimized page...\n');
    
    // Navigate with extended timeout
    const response = await page.goto('http://localhost:3003/landingpagekappaoptimized', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    
    // Wait a bit for all errors to be captured
    await page.waitForTimeout(5000);
    
    // Check for specific issues
    console.log('\n🔍 Checking for specific issues...\n');
    
    // 1. Check if StrategicLocationMapOptimized exists
    const mapComponentError = await page.evaluate(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const errorDiv = divs.find(div => div.textContent?.includes('Cannot find module'));
      return errorDiv?.textContent || null;
    });
    
    if (mapComponentError) {
      console.log('❌ Component Import Error:', mapComponentError);
      errors.resources.push({ type: 'import', error: mapComponentError });
    }
    
    // 2. Check for React errors
    const reactErrors = await page.evaluate(() => {
      const errorBoundary = document.querySelector('[data-react-error]');
      const nextError = document.querySelector('#__next-error__');
      return {
        errorBoundary: errorBoundary?.textContent,
        nextError: nextError?.textContent
      };
    });
    
    if (reactErrors.errorBoundary || reactErrors.nextError) {
      console.log('❌ React Error:', reactErrors);
      errors.javascript.push({ type: 'react', ...reactErrors });
    }
    
    // 3. Check for missing dependencies
    const missingDeps = await page.evaluate(() => {
      const errors = [];
      if (typeof React === 'undefined') errors.push('React');
      if (typeof mapboxgl === 'undefined') errors.push('mapboxgl');
      return errors;
    });
    
    if (missingDeps.length > 0) {
      console.log('❌ Missing Dependencies:', missingDeps);
      errors.resources.push({ type: 'dependencies', missing: missingDeps });
    }
    
    // 4. Check page content
    const pageContent = await page.evaluate(() => {
      return {
        hasContent: document.body.textContent.trim().length > 0,
        hasError: document.body.textContent.includes('Error') || 
                  document.body.textContent.includes('error') ||
                  document.body.textContent.includes('Cannot find module'),
        bodyHTML: document.body.innerHTML.substring(0, 500)
      };
    });
    
    if (!pageContent.hasContent || pageContent.hasError) {
      console.log('❌ Page Content Issue:', pageContent);
    }
    
  } catch (error) {
    console.error('❌ Navigation Error:', error.message);
    errors.javascript.push({ type: 'navigation', message: error.message });
  }
  
  // Analyze and generate fixes
  console.log('\n\n📊 ERROR ANALYSIS & FIXES');
  console.log('=' .repeat(60));
  
  const fixes = [];
  
  // Fix 1: Missing StrategicLocationMapOptimized
  if (errors.resources.some(e => e.error?.includes('StrategicLocationMapOptimized'))) {
    console.log('\n🔧 Fix 1: Component import error detected');
    fixes.push({
      file: 'app/landingpagekappaoptimized/page.tsx',
      issue: 'StrategicLocationMapOptimized not found',
      fix: 'Use original StrategicLocationMap component',
      code: `const StrategicLocationMap = dynamic(() => import('@/components/landing/StrategicLocationMap'), {
  loading: () => <MapLoadingState />,
  ssr: false
})`
    });
  }
  
  // Fix 2: Console errors
  if (errors.console.length > 0) {
    console.log('\n🔧 Fix 2: Console errors detected');
    errors.console.forEach(err => {
      console.log('  -', err.text);
      
      // Hydration errors
      if (err.text.includes('Hydration')) {
        fixes.push({
          issue: 'Hydration mismatch',
          fix: 'Add suppressHydrationWarning or use useEffect for client-only code'
        });
      }
      
      // Missing props
      if (err.text.includes('Warning: Failed prop type')) {
        fixes.push({
          issue: 'Prop type validation failed',
          fix: 'Check component props and types'
        });
      }
    });
  }
  
  // Fix 3: Network errors
  if (errors.network.length > 0) {
    console.log('\n🔧 Fix 3: Network errors detected');
    errors.network.forEach(err => {
      console.log('  -', err.url, err.status || err.failure?.errorText);
      
      // Font loading errors
      if (err.url?.includes('.woff') || err.url?.includes('font')) {
        fixes.push({
          issue: 'Font loading failed',
          fix: 'Add fallback fonts or check font paths'
        });
      }
      
      // API errors
      if (err.url?.includes('/api/')) {
        fixes.push({
          issue: 'API endpoint failed',
          fix: 'Check API routes or add error handling'
        });
      }
    });
  }
  
  // Generate automated fixes
  console.log('\n\n🛠️ APPLYING AUTOMATED FIXES');
  console.log('=' .repeat(60));
  
  // Apply Fix 1: Revert to original component
  if (fixes.some(f => f.issue.includes('StrategicLocationMapOptimized'))) {
    console.log('\n✅ Fixing component import...');
    
    const pagePath = path.join(process.cwd(), 'app/landingpagekappaoptimized/page.tsx');
    let pageContent = await fs.readFile(pagePath, 'utf8');
    
    pageContent = pageContent.replace(
      "const StrategicLocationMap = dynamic(() => import('@/components/landing/StrategicLocationMapOptimized')",
      "const StrategicLocationMap = dynamic(() => import('@/components/landing/StrategicLocationMap')"
    );
    
    await fs.writeFile(pagePath, pageContent);
    console.log('✅ Component import fixed');
  }
  
  // Test the fixes
  console.log('\n\n🧪 TESTING FIXES');
  console.log('=' .repeat(60));
  
  const testPage = await context.newPage();
  const testErrors = [];
  
  testPage.on('console', msg => {
    if (msg.type() === 'error') {
      testErrors.push(msg.text());
    }
  });
  
  testPage.on('pageerror', error => {
    testErrors.push(error.message);
  });
  
  try {
    await testPage.goto('http://localhost:3003/landingpagekappaoptimized', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await testPage.waitForTimeout(3000);
    
    const success = await testPage.evaluate(() => {
      return {
        hasMap: !!document.querySelector('.mapboxgl-canvas'),
        hasContent: document.body.textContent.length > 100,
        noErrors: !document.body.textContent.includes('Error')
      };
    });
    
    console.log('\n📊 Test Results:');
    console.log('Map loaded:', success.hasMap ? '✅' : '❌');
    console.log('Content loaded:', success.hasContent ? '✅' : '❌');
    console.log('No errors:', success.noErrors ? '✅' : '❌');
    console.log('Runtime errors:', testErrors.length === 0 ? '✅ None' : `❌ ${testErrors.length} errors`);
    
    if (testErrors.length > 0) {
      console.log('\nRemaining errors:');
      testErrors.forEach(err => console.log('  -', err));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
  
  await browser.close();
  
  // Save error report
  const report = {
    timestamp: new Date().toISOString(),
    errors,
    fixes,
    testResults: testErrors
  };
  
  await fs.writeFile('error-detection-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Error report saved to error-detection-report.json');
  
  return report;
}

// Run the detection and fix system
detectAndFixErrors().catch(console.error);
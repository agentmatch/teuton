const { chromium } = require('@playwright/test');

(async () => {
  console.log('🚀 Starting simple Chrome diagnosis...\n');
  
  const browser = await chromium.launch({
    headless: true, // Run headless for speed
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('📄 Loading properties page...');
    await page.goto('http://localhost:3001/properties', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    console.log('✅ Properties page loaded\n');
    
    console.log('📄 Loading Fiji property page...');
    await page.goto('http://localhost:3001/properties/fiji', {
      waitUntil: 'domcontentloaded', 
      timeout: 10000
    });
    
    console.log('✅ Fiji page loaded\n');
    
    // Quick check for sections
    const sectionInfo = await page.evaluate(() => {
      const sections = document.querySelectorAll('section');
      return {
        count: sections.length,
        info: Array.from(sections).map((s, i) => {
          const rect = s.getBoundingClientRect();
          const styles = window.getComputedStyle(s);
          return {
            index: i,
            height: Math.round(rect.height),
            padding: styles.padding,
            visible: rect.height > 0
          };
        })
      };
    });
    
    console.log(`📏 Found ${sectionInfo.count} sections:`);
    sectionInfo.info.forEach(s => {
      console.log(`  Section ${s.index}: height=${s.height}px, padding="${s.padding}", visible=${s.visible}`);
    });
    
    // Check for animation/transform issues
    const animationCheck = await page.evaluate(() => {
      const elements = document.querySelectorAll('[style*="transform"], [style*="opacity"]');
      return {
        count: elements.length,
        samples: Array.from(elements).slice(0, 5).map(el => ({
          tag: el.tagName,
          opacity: window.getComputedStyle(el).opacity,
          transform: window.getComputedStyle(el).transform
        }))
      };
    });
    
    console.log(`\n🎬 Found ${animationCheck.count} animated elements`);
    if (animationCheck.samples.length > 0) {
      console.log('  First few samples:');
      animationCheck.samples.forEach(s => {
        console.log(`    ${s.tag}: opacity=${s.opacity}, transform=${s.transform}`);
      });
    }
    
    // Check backdrop filters
    const backdropCheck = await page.evaluate(() => {
      let count = 0;
      document.querySelectorAll('*').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.backdropFilter && style.backdropFilter !== 'none') {
          count++;
        }
      });
      return count;
    });
    
    console.log(`\n🎨 Elements with backdrop-filter: ${backdropCheck}`);
    if (backdropCheck > 10) {
      console.log('  ⚠️ Many backdrop-filters detected - may impact Chrome performance');
    }
    
    console.log('\n✅ Quick diagnosis complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
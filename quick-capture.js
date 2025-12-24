const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('Going to properties page...');
  await page.goto('http://localhost:3000/properties', { waitUntil: 'networkidle' });
  
  console.log('Waiting for content...');
  await page.waitForTimeout(3000);
  
  console.log('Taking screenshot...');
  await page.screenshot({ 
    path: 'properties-page.png',
    fullPage: false 
  });
  
  // Get grid info
  const gridInfo = await page.evaluate(() => {
    const grid = document.querySelector('.grid');
    const cards = document.querySelectorAll('.group');
    const firstCard = cards[0];
    const firstMapContainer = firstCard?.querySelector('.aspect-\\[4\\/3\\]');
    
    return {
      gridClasses: grid?.className,
      cardCount: cards.length,
      firstCardBounds: firstCard?.getBoundingClientRect(),
      firstMapBounds: firstMapContainer?.getBoundingClientRect()
    };
  });
  
  console.log('Grid info:', JSON.stringify(gridInfo, null, 2));
  
  console.log('Screenshot saved as properties-page.png');
  
  await browser.close();
})();
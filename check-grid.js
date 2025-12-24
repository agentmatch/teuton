const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('Going to properties page...');
  await page.goto('http://localhost:3000/properties');
  
  await page.waitForSelector('.grid', { timeout: 10000 });
  console.log('Page loaded!');
  
  // Check grid and property info
  const info = await page.evaluate(() => {
    const grid = document.querySelector('.grid');
    const cards = document.querySelectorAll('.group');
    const maps = document.querySelectorAll('.aspect-\\[4\\/3\\]');
    
    // Get computed styles
    const gridStyles = window.getComputedStyle(grid);
    const firstMap = maps[0];
    const mapStyles = firstMap ? window.getComputedStyle(firstMap) : null;
    
    return {
      gridClasses: grid?.className,
      gridColumns: gridStyles.gridTemplateColumns,
      cardCount: cards.length,
      mapCount: maps.length,
      firstMapDimensions: firstMap ? firstMap.getBoundingClientRect() : null,
      mapAspectRatio: mapStyles ? {
        width: mapStyles.width,
        height: mapStyles.height,
        aspectRatio: mapStyles.aspectRatio
      } : null
    };
  });
  
  console.log('Grid and Map Info:');
  console.log(JSON.stringify(info, null, 2));
  
  // Keep open for 30 seconds
  await page.waitForTimeout(30000);
  
  await browser.close();
})();
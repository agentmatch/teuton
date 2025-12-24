const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for map to load
  await page.waitForSelector('canvas.mapboxgl-canvas', { timeout: 30000 });
  console.log('Map loaded');
  
  // Wait for initial animation to complete
  await page.waitForTimeout(10000);
  
  // Take a screenshot of the current view
  await page.screenshot({ path: 'map-current-view.png', fullPage: false });
  console.log('Screenshot saved as map-current-view.png');
  
  // Click on RAM property to zoom in
  await page.click('canvas.mapboxgl-canvas', { position: { x: 400, y: 300 } });
  await page.waitForTimeout(3000);
  
  // Take another screenshot
  await page.screenshot({ path: 'map-zoomed.png', fullPage: false });
  console.log('Screenshot saved as map-zoomed.png');
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
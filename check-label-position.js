const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for map to load
  await page.waitForSelector('canvas.mapboxgl-canvas', { timeout: 30000 });
  console.log('Map loaded');
  
  // Wait for initial animation to complete and zoom in
  await page.waitForTimeout(12000);
  
  // Take a screenshot of the current zoomed view
  await page.screenshot({ path: 'gold-digger-label-position.png', fullPage: false });
  console.log('Screenshot saved as gold-digger-label-position.png');
  
  // Try to zoom in more on the RAM area if possible
  await page.evaluate(() => {
    // Try to find the map instance and zoom to RAM area
    if (window.map && window.map.current) {
      window.map.current.flyTo({
        center: [-129.755, 55.84],
        zoom: 12,
        duration: 2000
      });
    }
  });
  
  await page.waitForTimeout(3000);
  
  // Take another screenshot after zooming
  await page.screenshot({ path: 'gold-digger-label-zoomed.png', fullPage: false });
  console.log('Screenshot saved as gold-digger-label-zoomed.png');
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
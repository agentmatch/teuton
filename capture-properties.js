const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  console.log('Navigating to properties page...');
  await page.goto('http://localhost:3000/properties');
  
  // Wait for the page to load
  await page.waitForSelector('h1:has-text("Our Properties")', { timeout: 30000 });
  console.log('Page loaded, waiting for maps...');
  
  // Wait for maps to load
  await page.waitForTimeout(5000);
  
  // Take screenshot of full page with All Properties selected
  console.log('Taking screenshot of all properties...');
  await page.screenshot({ 
    path: 'properties-all-selected.png',
    fullPage: true 
  });
  
  // Check grid classes
  const gridElement = await page.locator('.grid').first();
  const gridClasses = await gridElement.getAttribute('class');
  console.log('Grid classes:', gridClasses);
  
  // Count properties in the grid
  const propertyCount = await page.locator('.group').count();
  console.log('Number of properties displayed:', propertyCount);
  
  // Take screenshot of just the properties grid
  const propertiesGrid = await page.locator('.grid').first();
  await propertiesGrid.screenshot({ 
    path: 'properties-grid-only.png' 
  });
  
  // Get map container info
  const mapContainer = await page.locator('.aspect-\\[4\\/3\\]').first();
  const mapBox = await mapContainer.boundingBox();
  console.log('First map container dimensions:', mapBox);
  
  // Take a close-up of a single property card
  const firstPropertyCard = await page.locator('.group').first();
  await firstPropertyCard.screenshot({ 
    path: 'single-property-card.png' 
  });
  
  console.log('Screenshots saved!');
  console.log('- properties-all-selected.png');
  console.log('- properties-grid-only.png');
  console.log('- single-property-card.png');
  
  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for 10 seconds for inspection...');
  await page.waitForTimeout(10000);
  
  await browser.close();
})();
import { test } from '@playwright/test';

test('capture properties page visual issues', async ({ page }) => {
  // Set desktop viewport
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to properties page
  await page.goto('http://localhost:3000/properties');
  
  // Wait for the page to load
  await page.waitForSelector('h1:has-text("Our Properties")', { timeout: 30000 });
  
  // Wait for maps to load
  await page.waitForTimeout(5000);
  
  // Take screenshot of full page with All Properties selected
  await page.screenshot({ 
    path: 'properties-all-selected.png',
    fullPage: true 
  });
  
  // Take screenshot of just the properties grid
  const propertiesGrid = await page.locator('.grid').first();
  await propertiesGrid.screenshot({ 
    path: 'properties-grid-only.png' 
  });
  
  // Click on a specific group filter (e.g., Granduc-Type)
  await page.click('button:has-text("Granduc-Type")');
  await page.waitForTimeout(1000);
  
  // Take screenshot with filtered view
  await page.screenshot({ 
    path: 'properties-granduc-filtered.png',
    fullPage: true 
  });
  
  // Take a close-up of a single property card
  const firstPropertyCard = await page.locator('.group').first();
  await firstPropertyCard.screenshot({ 
    path: 'single-property-card.png' 
  });
  
  // Check grid classes
  const gridElement = await page.locator('.grid').first();
  const gridClasses = await gridElement.getAttribute('class');
  console.log('Grid classes:', gridClasses);
  
  // Count properties in the grid
  const propertyCount = await page.locator('.group').count();
  console.log('Number of properties displayed:', propertyCount);
  
  // Check map container dimensions
  const mapContainers = await page.locator('[ref="mapContainer"]').all();
  for (let i = 0; i < Math.min(mapContainers.length, 3); i++) {
    const box = await mapContainers[i].boundingBox();
    console.log(`Map ${i + 1} dimensions:`, box);
  }
});
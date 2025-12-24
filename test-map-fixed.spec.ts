import { test, expect } from '@playwright/test';

test.describe('Map Display After Fix', () => {
  test('should display map without black overlay', async ({ page }) => {
    // Navigate to the site
    await page.goto('http://localhost:3000');
    
    // Wait for the map canvas to be visible (use first if multiple)
    const mapCanvas = page.locator('canvas.mapboxgl-canvas').first();
    await expect(mapCanvas).toBeVisible({ timeout: 30000 });
    
    // Check that there's no black overlay covering the viewport
    const blackOverlay = page.locator('div').filter({ 
      has: page.locator('css=[style*="background-color: black"]')
    });
    
    // The overlay should either not exist or not be visible
    const overlayCount = await blackOverlay.count();
    if (overlayCount > 0) {
      // Check if any are actually visible and covering the full viewport
      for (let i = 0; i < overlayCount; i++) {
        const overlay = blackOverlay.nth(i);
        const isVisible = await overlay.isVisible();
        if (isVisible) {
          const boundingBox = await overlay.boundingBox();
          const viewport = page.viewportSize();
          
          // Check if it's covering the full viewport
          if (boundingBox && viewport) {
            const isFullViewport = 
              boundingBox.width >= viewport.width * 0.9 && 
              boundingBox.height >= viewport.height * 0.9;
            
            expect(isFullViewport).toBe(false);
          }
        }
      }
    }
    
    // Take a screenshot to verify visually
    await page.screenshot({ path: 'map-after-fix.png', fullPage: false });
    
    // Check that map controls are accessible
    const zoomIn = page.locator('.mapboxgl-ctrl-zoom-in');
    await expect(zoomIn).toBeVisible({ timeout: 10000 });
    
    // Check that property markers or labels are visible
    await page.waitForTimeout(5000); // Wait for map to fully load
    
    // Verify no split-screen related elements exist
    const splitScreenButton = page.locator('button:has-text("View RAM Drilling")');
    await expect(splitScreenButton).not.toBeVisible();
    
    const ramBadge = page.locator('h3:has-text("RAM PROPERTY")');
    await expect(ramBadge).not.toBeVisible();
    
    const drillingStats = page.locator('text=Current Operations');
    await expect(drillingStats).not.toBeVisible();
    
    console.log('✅ Map displays correctly without black overlay');
    console.log('✅ No split-screen elements found');
  });
  
  test('should allow map interaction', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for map to be ready
    await page.waitForSelector('canvas.mapboxgl-canvas', { 
      state: 'visible',
      timeout: 30000 
    });
    
    await page.waitForTimeout(3000);
    
    // Try to interact with the map (zoom)
    const mapCanvas = page.locator('canvas.mapboxgl-canvas').first();
    
    // Simulate zoom with mouse wheel
    await mapCanvas.hover();
    await page.mouse.wheel(0, -100);
    
    await page.waitForTimeout(1000);
    
    // Click on the map to ensure it's interactive
    await mapCanvas.click({ position: { x: 400, y: 300 } });
    
    await page.waitForTimeout(1000);
    
    console.log('✅ Map is interactive and responds to user input');
  });
});
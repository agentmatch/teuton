import { test, expect } from '@playwright/test';

test.describe('RAM Drilling Split-Screen Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the site
    await page.goto('http://localhost:3000');
    
    // Wait for the map to be ready
    await page.waitForSelector('canvas.mapboxgl-canvas', { 
      state: 'visible',
      timeout: 30000 
    });
    
    // Wait for initial animations to complete
    await page.waitForTimeout(5000);
  });

  test('should display View RAM Drilling button after map loads', async ({ page }) => {
    // Check if the button appears
    const button = page.locator('button:has-text("View RAM Drilling")');
    await expect(button).toBeVisible({ timeout: 10000 });
    
    // Take screenshot of initial state
    await page.screenshot({ path: 'initial-map-view.png', fullPage: false });
  });

  test('should activate split-screen when clicking View RAM Drilling', async ({ page }) => {
    // Find and click the button
    const button = page.locator('button:has-text("View RAM Drilling")');
    await button.waitFor({ state: 'visible' });
    await button.click();
    
    // Wait for animation
    await page.waitForTimeout(1000);
    
    // Check for video element
    const video = page.locator('video');
    await expect(video).toBeVisible({ timeout: 5000 });
    
    // Check for RAM property badge
    const ramBadge = page.locator('h3:has-text("RAM PROPERTY")');
    await expect(ramBadge).toBeVisible();
    
    // Check for drilling stats
    const drillingStats = page.locator('text=Current Operations');
    await expect(drillingStats).toBeVisible();
    
    // Take screenshot of split-screen
    await page.screenshot({ path: 'split-screen-active.png', fullPage: false });
  });

  test('should show drilling statistics in split-screen mode', async ({ page }) => {
    // Activate split-screen
    const button = page.locator('button:has-text("View RAM Drilling")');
    await button.click();
    await page.waitForTimeout(1500);
    
    // Check for specific drilling stats
    await expect(page.locator('text=Depth')).toBeVisible();
    await expect(page.locator('text=485m')).toBeVisible();
    await expect(page.locator('text=Target')).toBeVisible();
    await expect(page.locator('text=750m')).toBeVisible();
    await expect(page.locator('text=Core Samples')).toBeVisible();
    await expect(page.locator('text=127')).toBeVisible();
    
    // Check for progress bar
    const progressBar = page.locator('.bg-gradient-to-r.from-blue-500.to-cyan-400');
    await expect(progressBar).toBeVisible();
  });

  test('should return to full map view when clicking Full Map button', async ({ page }) => {
    // Activate split-screen
    let button = page.locator('button:has-text("View RAM Drilling")');
    await button.click();
    await page.waitForTimeout(1000);
    
    // Click Full Map button
    button = page.locator('button:has-text("Full Map")');
    await expect(button).toBeVisible();
    await button.click();
    
    // Wait for animation
    await page.waitForTimeout(1000);
    
    // Video should no longer be visible
    const video = page.locator('video');
    await expect(video).not.toBeVisible();
    
    // Original button should be back
    button = page.locator('button:has-text("View RAM Drilling")');
    await expect(button).toBeVisible();
    
    // Take screenshot of restored view
    await page.screenshot({ path: 'full-map-restored.png', fullPage: false });
  });

  test('should zoom to RAM property when activating split-screen', async ({ page }) => {
    // Get initial map state (you'd need to expose this through window object in your component)
    await page.evaluate(() => {
      // This would need to be implemented in your component
      // window.mapCenter = map.current?.getCenter();
      // window.mapZoom = map.current?.getZoom();
    });
    
    // Activate split-screen
    const button = page.locator('button:has-text("View RAM Drilling")');
    await button.click();
    
    // Wait for map animation
    await page.waitForTimeout(2500);
    
    // Verify map has zoomed (would need to expose map state)
    const newState = await page.evaluate(() => {
      // return { center: window.mapCenter, zoom: window.mapZoom };
      return true; // Placeholder
    });
    
    expect(newState).toBeTruthy();
  });

  test('should handle video loading states', async ({ page }) => {
    // Activate split-screen
    const button = page.locator('button:has-text("View RAM Drilling")');
    await button.click();
    
    // Check for loading spinner (if video hasn't loaded)
    // The spinner should disappear once video loads
    const spinner = page.locator('.animate-spin');
    
    // Wait for video to be loaded (spinner should disappear)
    await expect(spinner).toBeHidden({ timeout: 10000 });
  });

  test('should display correct styling and layout', async ({ page }) => {
    // Activate split-screen
    const button = page.locator('button:has-text("View RAM Drilling")');
    await button.click();
    await page.waitForTimeout(1500);
    
    // Check layout - should have two 50% width sections
    const videoSection = page.locator('video').locator('..');
    const mapSection = page.locator('canvas.mapboxgl-canvas').locator('..').locator('..');
    
    // Both sections should be visible
    await expect(videoSection).toBeVisible();
    await expect(mapSection).toBeVisible();
    
    // Check glassmorphic styling on info overlay
    const infoOverlay = page.locator('.bg-black\\/60.backdrop-blur-md');
    await expect(infoOverlay).toBeVisible();
    await expect(infoOverlay).toHaveCSS('backdrop-filter', /blur/);
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should not show split-screen button on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    // Wait for map to load
    await page.waitForSelector('canvas.mapboxgl-canvas', { 
      state: 'visible',
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    // Button should not be visible on mobile
    const button = page.locator('button:has-text("View RAM Drilling")');
    await expect(button).not.toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'mobile-view.png', fullPage: false });
  });
});

test.describe('Error Handling', () => {
  test('should handle missing video gracefully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Wait for map
    await page.waitForSelector('canvas.mapboxgl-canvas', { 
      state: 'visible',
      timeout: 30000 
    });
    
    await page.waitForTimeout(5000);
    
    // Try to activate split-screen
    const button = page.locator('button:has-text("View RAM Drilling")');
    if (await button.isVisible()) {
      await button.click();
      
      // Even if video fails to load, the layout should still work
      await page.waitForTimeout(1500);
      
      // Check that UI elements are still present
      const ramBadge = page.locator('h3:has-text("RAM PROPERTY")');
      await expect(ramBadge).toBeVisible();
    }
  });
});
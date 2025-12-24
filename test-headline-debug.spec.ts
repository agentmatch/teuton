import { test, expect } from '@playwright/test'

test.describe('Headline Visibility Debug', () => {
  test('should show main headline on page load', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Navigate to the site
    await page.goto('http://localhost:3000')
    
    // Wait for map to load
    await page.waitForSelector('canvas.mapboxgl-canvas', { state: 'visible', timeout: 30000 })
    
    // Wait for animations and content to load
    await page.waitForTimeout(8000)
    
    // Debug all relevant state
    const debugInfo = await page.evaluate(() => {
      // Find all h1 elements
      const h1Elements = Array.from(document.querySelectorAll('h1')).map(h1 => ({
        text: h1.textContent,
        visible: h1.offsetHeight > 0 && h1.offsetWidth > 0,
        rect: h1.getBoundingClientRect(),
        styles: {
          display: window.getComputedStyle(h1).display,
          visibility: window.getComputedStyle(h1).visibility,
          opacity: window.getComputedStyle(h1).opacity,
        }
      }))
      
      // Find motion divs with headline content
      const motionDivs = Array.from(document.querySelectorAll('div[style*="zIndex: 20000"], div[style*="z-index: 20000"]')).map(div => ({
        innerHTML: div.innerHTML.substring(0, 200),
        visible: div.offsetHeight > 0 && div.offsetWidth > 0,
        rect: div.getBoundingClientRect(),
        styles: {
          display: window.getComputedStyle(div).display,
          visibility: window.getComputedStyle(div).visibility,
          opacity: window.getComputedStyle(div).opacity,
          zIndex: window.getComputedStyle(div).zIndex
        }
      }))
      
      // Check for any element containing "Large-Scale Discovery"
      const largeScaleElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent?.includes('Large-Scale Discovery') || el.textContent?.includes('Large Scale Discovery')
      ).slice(0, 5).map(el => ({
        tagName: el.tagName,
        text: el.textContent?.substring(0, 100),
        visible: (el as HTMLElement).offsetHeight > 0 && (el as HTMLElement).offsetWidth > 0,
        rect: el.getBoundingClientRect(),
        parent: el.parentElement?.tagName
      }))
      
      // Check showMainContent state by looking for elements that depend on it
      const bottomNavElements = document.querySelectorAll('[style*="z-index: 100000"], [style*="zIndex: 100000"]')
      
      return {
        h1Elements,
        motionDivs,
        largeScaleElements,
        bottomNavCount: bottomNavElements.length,
        windowHeight: window.innerHeight,
        documentHeight: document.documentElement.scrollHeight
      }
    })
    
    console.log('Debug Info:')
    console.log('H1 Elements:', JSON.stringify(debugInfo.h1Elements, null, 2))
    console.log('Motion Divs (z-index 20000):', JSON.stringify(debugInfo.motionDivs, null, 2))
    console.log('Large-Scale Discovery elements:', JSON.stringify(debugInfo.largeScaleElements, null, 2))
    console.log('Bottom nav elements:', debugInfo.bottomNavCount)
    console.log('Window height:', debugInfo.windowHeight, 'Document height:', debugInfo.documentHeight)
    
    // Take a screenshot
    await page.screenshot({ 
      path: 'headline-debug.png',
      fullPage: false 
    })
    
    // Check if main headline exists
    const hasLargeScaleText = debugInfo.largeScaleElements.length > 0
    console.log('Has Large-Scale Discovery text:', hasLargeScaleText)
    
    // Assertion - should have the main headline text
    expect(hasLargeScaleText).toBe(true)
  })
})
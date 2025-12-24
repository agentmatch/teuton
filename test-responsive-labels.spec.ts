import { test, expect } from '@playwright/test'

test.describe('Responsive Layout and Label Positioning', () => {
  // Test at different viewport sizes
  const viewports = [
    { name: 'Desktop HD', width: 1920, height: 1080 },
    { name: 'Desktop', width: 1440, height: 900 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Tablet', width: 1024, height: 768 },
    { name: 'Mobile', width: 375, height: 812 }
  ]
  
  for (const viewport of viewports) {
    test(`should display correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      // Set viewport size
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      
      // Navigate to the site
      await page.goto('http://localhost:3000')
      
      // Wait for map to load
      await page.waitForSelector('canvas.mapboxgl-canvas', { state: 'visible', timeout: 30000 })
      
      // Check if headline is visible (desktop only)
      if (viewport.width >= 768) {
        // Wait a bit more for animations to complete
        await page.waitForTimeout(2000)
        
        // Try multiple selectors to find headline
        const headline = await page.locator('h1').first()
        const headlineCount = await headline.count()
        console.log(`${viewport.name} - H1 elements found:`, headlineCount)
        
        if (headlineCount > 0) {
          const headlineVisible = await headline.isVisible()
          const headlineText = await headline.textContent()
          console.log(`${viewport.name} - Headline visible:`, headlineVisible, 'Text:', headlineText)
        }
        
        // Check viewport height and position of map wrapper
        const mapWrapper = await page.locator('div.absolute.inset-0').first()
        const mapBounds = await mapWrapper.boundingBox()
        console.log(`${viewport.name} - Map wrapper bounds:`, mapBounds)
        
        // Try to find the headline element even if not visible
        const headlineElement = await page.evaluate(() => {
          const h1s = document.querySelectorAll('h1')
          for (const h1 of h1s) {
            const rect = h1.getBoundingClientRect()
            const styles = window.getComputedStyle(h1)
            return {
              text: h1.textContent,
              visible: rect.height > 0 && rect.width > 0,
              position: { top: rect.top, left: rect.left },
              display: styles.display,
              visibility: styles.visibility,
              opacity: styles.opacity,
              zIndex: styles.zIndex
            }
          }
          return null
        })
        console.log(`${viewport.name} - Headline element:`, headlineElement)
      }
      
      // Wait for animations
      await page.waitForTimeout(8000)
      
      // Check label positioning
      const labels = await page.evaluate(() => {
        const labelElements = document.querySelectorAll('.property-label')
        const markerElements = document.querySelectorAll('.property-marker-main')
        
        const results = []
        labelElements.forEach((label) => {
          const labelRect = label.getBoundingClientRect()
          const parent = label.closest('.mapboxgl-marker')
          const markerEl = parent?.querySelector('.property-marker-main')
          
          if (markerEl) {
            const markerRect = markerEl.getBoundingClientRect()
            const labelText = label.querySelector('[style*="text-transform: uppercase"]')?.textContent?.trim() || ''
            
            // Check if label overlaps marker
            const overlaps = !(labelRect.right < markerRect.left || 
                              labelRect.left > markerRect.right || 
                              labelRect.bottom < markerRect.top || 
                              labelRect.top > markerRect.bottom)
            
            // Calculate distance from edge
            let edgeDistance = 0
            if (labelRect.right < markerRect.left) {
              edgeDistance = markerRect.left - labelRect.right
            } else if (labelRect.left > markerRect.right) {
              edgeDistance = labelRect.left - markerRect.right
            } else if (labelRect.bottom < markerRect.top) {
              edgeDistance = markerRect.top - labelRect.bottom
            } else if (labelRect.top > markerRect.bottom) {
              edgeDistance = labelRect.top - markerRect.bottom
            }
            
            results.push({
              name: labelText,
              overlaps,
              edgeDistance: Math.round(edgeDistance)
            })
          }
        })
        
        return results
      })
      
      // Log results
      console.log(`\n${viewport.name} - Label Positioning:`)
      labels.forEach(label => {
        console.log(`  ${label.name}: ${label.overlaps ? 'OVERLAPPING' : `${label.edgeDistance}px from edge`}`)
      })
      
      // Take screenshot
      await page.screenshot({ 
        path: `responsive-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: false 
      })
      
      // Assert no overlapping labels
      const overlappingLabels = labels.filter(l => l.overlaps)
      expect(overlappingLabels.length).toBe(0)
    })
  }
})
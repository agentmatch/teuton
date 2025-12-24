import { test, expect } from '@playwright/test'

test.describe('Zone Label Positioning in Drone View', () => {
  test('should position zone labels correctly in split-screen', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Navigate to the site
    await page.goto('http://localhost:3000')
    
    // Wait for map to load
    await page.waitForSelector('canvas.mapboxgl-canvas', { state: 'visible', timeout: 30000 })
    
    // Wait for initial animations
    await page.waitForTimeout(5000)
    
    // Click on RAM property
    const ramLabel = await page.locator('.property-label').filter({ hasText: 'RAM' }).first()
    await ramLabel.click()
    
    // Wait for property modal
    await page.waitForTimeout(2000)
    
    // Click the Explore Drill Program button
    const drillButton = await page.locator('text=Explore Drill Program').first()
    await drillButton.click()
    
    // Wait for map to zoom to RAM
    await page.waitForTimeout(4000)
    
    // Wait for split-screen to activate
    await page.waitForTimeout(3000)
    
    // Check if zone labels are visible and their positions
    const zoneLabels = await page.evaluate(() => {
      const labels = document.querySelectorAll('.zone-label-marker')
      const results = []
      
      labels.forEach((label) => {
        const rect = label.getBoundingClientRect()
        const text = label.textContent?.trim() || ''
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        }
        
        // Check if label is within viewport
        const inViewport = rect.left >= 0 && 
                          rect.right <= viewport.width &&
                          rect.top >= 0 &&
                          rect.bottom <= viewport.height
        
        results.push({
          text,
          position: {
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom
          },
          inViewport,
          distanceFromLeft: rect.left,
          distanceFromRight: viewport.width - rect.right,
          distanceFromTop: rect.top,
          distanceFromBottom: viewport.height - rect.bottom
        })
      })
      
      return results
    })
    
    console.log('Zone Labels Analysis:')
    zoneLabels.forEach(label => {
      console.log(`\n${label.text}:`)
      console.log(`  Position: (${label.position.left}, ${label.position.top})`)
      console.log(`  In Viewport: ${label.inViewport}`)
      if (!label.inViewport) {
        if (label.position.left < 0) {
          console.log(`  OFF LEFT by ${Math.abs(label.position.left)}px`)
        }
        if (label.position.right > 1920) {
          console.log(`  OFF RIGHT by ${label.position.right - 1920}px`)
        }
        if (label.position.top < 0) {
          console.log(`  OFF TOP by ${Math.abs(label.position.top)}px`)
        }
        if (label.position.bottom > 1080) {
          console.log(`  OFF BOTTOM by ${label.position.bottom - 1080}px`)
        }
      }
    })
    
    // Take screenshot
    await page.screenshot({ 
      path: 'zone-labels-position.png',
      fullPage: false 
    })
    
    // Get map center and bounds for debugging
    const mapInfo = await page.evaluate(() => {
      const mapElement = document.querySelector('.mapboxgl-canvas')
      if (mapElement && (window as any).map) {
        const map = (window as any).map
        const center = map.getCenter()
        const bounds = map.getBounds()
        const zoom = map.getZoom()
        return {
          center: { lng: center.lng, lat: center.lat },
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
          },
          zoom
        }
      }
      return null
    })
    
    console.log('\nMap Info:', mapInfo)
    
    // Check that zone labels are visible
    const visibleLabels = zoneLabels.filter(l => l.inViewport)
    console.log(`\nVisible labels: ${visibleLabels.length}/${zoneLabels.length}`)
    
    // Assert at least some labels are visible
    expect(visibleLabels.length).toBeGreaterThan(0)
  })
})
import { test, expect } from '@playwright/test'

test.describe('Property Label Positioning', () => {
  test('should position labels at edge of marker dots', async ({ page, context }) => {
    // Set viewport to fullscreen size
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Navigate to the site
    await page.goto('http://localhost:3000')
    
    // Wait for map to fully load
    await page.waitForSelector('canvas.mapboxgl-canvas', { state: 'visible', timeout: 30000 })
    
    // Check if headline is visible
    const headline = await page.locator('text=WORLD-CLASS EXPLORATION').first()
    const headlineVisible = await headline.isVisible()
    console.log('Headline visible:', headlineVisible)
    
    // Wait for animations to complete
    await page.waitForTimeout(8000)
    
    // Wait for property markers to be visible
    await page.waitForSelector('.property-marker-main', { state: 'visible' })
    
    // Take a screenshot of the full map with labels
    await page.screenshot({ 
      path: 'label-positioning-full.png',
      fullPage: false 
    })
    
    // Get all property labels and their positions
    const labels = await page.evaluate(() => {
      const labelElements = document.querySelectorAll('.property-label')
      const markerElements = document.querySelectorAll('.property-marker-main')
      
      const results = []
      labelElements.forEach((label, index) => {
        const labelRect = label.getBoundingClientRect()
        const parent = label.closest('.mapboxgl-marker')
        const markerEl = parent?.querySelector('.property-marker-main')
        
        if (markerEl) {
          const markerRect = markerEl.getBoundingClientRect()
          const labelText = label.textContent?.trim() || ''
          
          // Calculate relative positions
          const labelCenterX = labelRect.left + labelRect.width / 2
          const labelCenterY = labelRect.top + labelRect.height / 2
          const markerCenterX = markerRect.left + markerRect.width / 2
          const markerCenterY = markerRect.top + markerRect.height / 2
          
          // Check if label overlaps marker
          const overlaps = !(labelRect.right < markerRect.left || 
                            labelRect.left > markerRect.right || 
                            labelRect.bottom < markerRect.top || 
                            labelRect.top > markerRect.bottom)
          
          // Determine position relative to marker
          let position = ''
          if (labelRect.bottom < markerRect.top) position = 'above'
          else if (labelRect.top > markerRect.bottom) position = 'below'
          else if (labelRect.right < markerRect.left) position = 'left'
          else if (labelRect.left > markerRect.right) position = 'right'
          else if (overlaps) position = 'OVERLAPPING'
          
          // Check if at corner
          const atCorner = {
            topLeft: labelRect.bottom <= markerRect.top + 5 && labelRect.right <= markerRect.left + 5,
            topRight: labelRect.bottom <= markerRect.top + 5 && labelRect.left >= markerRect.right - 5,
            bottomLeft: labelRect.top >= markerRect.bottom - 5 && labelRect.right <= markerRect.left + 5,
            bottomRight: labelRect.top >= markerRect.bottom - 5 && labelRect.left >= markerRect.right - 5
          }
          
          results.push({
            name: labelText,
            overlaps,
            position,
            atCorner,
            distance: Math.sqrt(Math.pow(labelCenterX - markerCenterX, 2) + Math.pow(labelCenterY - markerCenterY, 2)),
            labelRect: {
              top: labelRect.top,
              left: labelRect.left,
              bottom: labelRect.bottom,
              right: labelRect.right
            },
            markerRect: {
              top: markerRect.top,
              left: markerRect.left,
              bottom: markerRect.bottom,
              right: markerRect.right
            }
          })
        }
      })
      
      return results
    })
    
    // Log the positioning for debugging
    console.log('Label Positioning Analysis:')
    labels.forEach(label => {
      console.log(`${label.name}:`)
      console.log(`  Position: ${label.position}`)
      console.log(`  Overlaps: ${label.overlaps}`)
      console.log(`  Distance from center: ${label.distance.toFixed(2)}px`)
      if (label.atCorner.topLeft) console.log('  At top-left corner')
      if (label.atCorner.topRight) console.log('  At top-right corner')
      if (label.atCorner.bottomLeft) console.log('  At bottom-left corner')
      if (label.atCorner.bottomRight) console.log('  At bottom-right corner')
    })
    
    // Check that no labels overlap their markers
    const overlappingLabels = labels.filter(l => l.overlaps)
    if (overlappingLabels.length > 0) {
      console.error('Labels overlapping markers:', overlappingLabels.map(l => l.name))
    }
    
    // Zoom to each property and take a screenshot
    const properties = [
      'Treaty Creek',
      'Eskay Creek',
      'Granduc',
      'Brucejack',
      'MIDAS',
      'KONKIN SILVER',
      'TONGA',
      'FIJI',
      'CLONE',
      'RAM'
    ]
    
    for (const propertyName of properties) {
      // Find and click the property marker
      const marker = await page.locator('.property-label').filter({ hasText: propertyName }).first()
      
      if (await marker.isVisible()) {
        const parent = await marker.locator('..').locator('..')
        await parent.click()
        await page.waitForTimeout(2000)
        
        // Take screenshot of zoomed property
        await page.screenshot({ 
          path: `label-positioning-${propertyName.toLowerCase().replace(' ', '-')}.png`,
          fullPage: false 
        })
        
        // Return to overview
        const overviewButton = page.locator('text=Return to Overview')
        if (await overviewButton.isVisible()) {
          await overviewButton.click()
          await page.waitForTimeout(2000)
        }
      }
    }
    
    // Final assertion - no overlapping labels
    expect(overlappingLabels.length).toBe(0)
  })
})
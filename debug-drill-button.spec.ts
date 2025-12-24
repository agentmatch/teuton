import { test, expect } from '@playwright/test'

test.describe('Drill Button Video Debug', () => {
  test('inspect drill button video thumbnail', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Navigate to the site
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForTimeout(5000)
    
    // Debug the drill button video area
    const buttonInfo = await page.evaluate(() => {
      // Find the drill button by looking for RAM Exploration text
      const buttons = Array.from(document.querySelectorAll('button'))
      const drillButton = buttons.find(btn => btn.textContent?.includes('RAM Exploration'))
      
      if (!drillButton) {
        return { error: 'Drill button not found' }
      }
      
      // Find the video element within the button
      const video = drillButton.querySelector('video')
      if (!video) {
        return { error: 'Video element not found in button' }
      }
      
      const videoContainer = video.parentElement
      const videoRect = video.getBoundingClientRect()
      const containerRect = videoContainer?.getBoundingClientRect()
      
      const computedVideoStyle = window.getComputedStyle(video)
      const computedContainerStyle = videoContainer ? window.getComputedStyle(videoContainer) : null
      
      return {
        video: {
          src: video.src,
          rect: {
            width: videoRect.width,
            height: videoRect.height,
            top: videoRect.top,
            left: videoRect.left,
            bottom: videoRect.bottom,
            right: videoRect.right
          },
          computedStyle: {
            width: computedVideoStyle.width,
            height: computedVideoStyle.height,
            display: computedVideoStyle.display,
            position: computedVideoStyle.position,
            objectFit: computedVideoStyle.objectFit,
            top: computedVideoStyle.top,
            left: computedVideoStyle.left,
            transform: computedVideoStyle.transform
          },
          naturalDimensions: {
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight
          }
        },
        container: containerRect ? {
          rect: {
            width: containerRect.width,
            height: containerRect.height,
            top: containerRect.top,
            left: containerRect.left,
            bottom: containerRect.bottom,
            right: containerRect.right
          },
          computedStyle: computedContainerStyle ? {
            width: computedContainerStyle.width,
            height: computedContainerStyle.height,
            display: computedContainerStyle.display,
            position: computedContainerStyle.position,
            overflow: computedContainerStyle.overflow,
            background: computedContainerStyle.background
          } : null
        } : null,
        gapInfo: {
          containerBottom: containerRect?.bottom,
          videoBottom: videoRect.bottom,
          gap: containerRect ? containerRect.bottom - videoRect.bottom : 0
        }
      }
    })
    
    console.log('Drill button video debug info:', JSON.stringify(buttonInfo, null, 2))
    
    // Take screenshot of the button area
    const drillButton = page.locator('button:has-text("RAM Exploration")')
    if (await drillButton.isVisible()) {
      await drillButton.screenshot({ 
        path: 'drill-button-video-debug.png'
      })
      
      // Also take a full page screenshot to see context
      await page.screenshot({ 
        path: 'full-page-drill-button.png',
        fullPage: false 
      })
    }
    
    // Check for any gaps
    if (buttonInfo && 'gapInfo' in buttonInfo && buttonInfo.gapInfo.gap > 0) {
      console.log(`⚠️ GAP DETECTED: ${buttonInfo.gapInfo.gap}px between video and container bottom`)
    }
  })
})
import { test, expect } from '@playwright/test'

test.describe('Video Thumbnail Debug', () => {
  test('debug video thumbnail dimensions', async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    
    // Navigate to the site
    await page.goto('http://localhost:3000')
    
    // Wait for page to load
    await page.waitForTimeout(8000)
    
    // Look for any video elements on the page
    await page.evaluate(() => {
      console.log('Searching for video elements...')
      const allVideos = document.querySelectorAll('video')
      console.log('Found videos:', allVideos.length)
      allVideos.forEach((video, i) => {
        console.log(`Video ${i}: src=${video.src}`)
      })
    })
    
    // Debug the video thumbnail area
    const videoInfo = await page.evaluate(() => {
      const videos = document.querySelectorAll('video[src="/images/ramdrone1thumb.webm"]')
      console.log('Found videos:', videos.length)
      
      const results = []
      videos.forEach((video, index) => {
        const rect = video.getBoundingClientRect()
        const container = video.parentElement
        const containerRect = container?.getBoundingClientRect()
        
        const computedStyle = window.getComputedStyle(video)
        
        results.push({
          index,
          video: {
            rect: { width: rect.width, height: rect.height, left: rect.left, top: rect.top },
            computedStyle: {
              width: computedStyle.width,
              height: computedStyle.height,
              marginLeft: computedStyle.marginLeft,
              marginTop: computedStyle.marginTop,
              objectFit: computedStyle.objectFit,
              display: computedStyle.display
            },
            naturalSize: {
              videoWidth: (video as HTMLVideoElement).videoWidth,
              videoHeight: (video as HTMLVideoElement).videoHeight
            }
          },
          container: containerRect ? {
            rect: { width: containerRect.width, height: containerRect.height, left: containerRect.left, top: containerRect.top }
          } : null
        })
      })
      
      return results
    })
    
    console.log('Video thumbnail debug info:', JSON.stringify(videoInfo, null, 2))
    
    // Take screenshot
    await page.screenshot({ 
      path: 'video-thumbnail-debug.png',
      fullPage: false 
    })
    
    // Verify video is visible
    const videoElement = page.locator('video[src="/images/ramdrone1thumb.webm"]').first()
    await expect(videoElement).toBeVisible()
    
    // Check if video dimensions are reasonable
    const videoBounds = await videoElement.boundingBox()
    console.log('Video bounding box:', videoBounds)
    
    if (videoBounds) {
      expect(videoBounds.width).toBeGreaterThan(50)
      expect(videoBounds.height).toBeGreaterThan(30)
    }
  })
})
const { chromium, devices } = require('playwright');

async function testMobileIssues() {
  const browser = await chromium.launch({ headless: false });
  
  // Test on iPhone
  const iPhoneContext = await browser.newContext({
    ...devices['iPhone 13'],
    permissions: ['geolocation'],
  });
  const iPhonePage = await iPhoneContext.newPage();
  
  console.log('Testing on iPhone...');
  await iPhonePage.goto('https://luxormetals-gt7q3pavq-roman-romanalexands-projects.vercel.app');
  await iPhonePage.waitForTimeout(3000);
  
  // Check if bottom navigation is visible
  const bottomNav = await iPhonePage.$('div[style*="position: fixed"][style*="bottom: 0"]');
  if (bottomNav) {
    const isVisible = await bottomNav.isVisible();
    console.log('Bottom navigation visible on iPhone:', isVisible);
    
    const boundingBox = await bottomNav.boundingBox();
    console.log('Bottom nav position:', boundingBox);
    
    // Take screenshot
    await iPhonePage.screenshot({ path: 'iphone-bottom-nav.png', fullPage: false });
  } else {
    console.log('Bottom navigation not found on iPhone!');
  }
  
  // Click hamburger menu
  const hamburger = await iPhonePage.$('button[aria-label="Open menu"]');
  if (hamburger) {
    await hamburger.click();
    await iPhonePage.waitForTimeout(1000);
    
    // Check menu items
    const menuNav = await iPhonePage.$('nav.space-y-3');
    if (menuNav) {
      console.log('Mobile menu nav found');
      
      // Get computed styles
      const navStyles = await menuNav.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          display: styles.display,
          flexDirection: styles.flexDirection,
        };
      });
      
      console.log('Nav styles:', navStyles);
      
      // Check menu items
      const menuItems = await menuNav.$$('a');
      console.log('Number of menu items:', menuItems.length);
      
      for (const item of menuItems) {
        const styles = await iPhonePage.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            width: styles.width,
          };
        });
        console.log('Menu item styles:', styles);
      }
    }
    
    await iPhonePage.screenshot({ path: 'iphone-menu-open.png', fullPage: false });
  }
  
  // Test on Android
  const androidContext = await browser.newContext({
    ...devices['Pixel 5'],
  });
  const androidPage = await androidContext.newPage();
  
  console.log('\nTesting on Android...');
  await androidPage.goto('https://luxormetals-gt7q3pavq-roman-romanalexands-projects.vercel.app');
  await androidPage.waitForTimeout(3000);
  
  // Check bottom navigation on Android
  const androidBottomNav = await androidPage.$('div[style*="position: fixed"][style*="bottom: 0"]');
  if (androidBottomNav) {
    const isVisible = await androidBottomNav.isVisible();
    console.log('Bottom navigation visible on Android:', isVisible);
    
    const boundingBox = await androidBottomNav.boundingBox();
    console.log('Bottom nav position:', boundingBox);
    
    await androidPage.screenshot({ path: 'android-bottom-nav.png', fullPage: false });
  } else {
    console.log('Bottom navigation not found on Android!');
  }
  
  await browser.close();
}

testMobileIssues().catch(console.error);
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const devices = require('./iphone-devices.json');
const analyzer = require('./viewport-analyzer');
const reporter = require('./report-generator');

// Command line argument parsing
const args = process.argv.slice(2);
const options = {
  url: 'http://localhost:3000',
  device: null,
  category: null,
  all: false,
  format: 'json',
  compare: null
};

args.forEach(arg => {
  const [key, value] = arg.split('=');
  const option = key.replace('--', '');
  if (option === 'all') {
    options.all = true;
  } else if (options.hasOwnProperty(option)) {
    options[option] = value;
  }
});

// Ensure output directories exist
async function ensureDirectories() {
  const dirs = [
    'output/screenshots',
    'output/reports/individual',
    'output/reports/summary'
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(path.join(__dirname, '..', dir), { recursive: true });
  }
}

// Delay helper
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Capture single device
async function captureDevice(browser, url, device, options = {}) {
  const page = await browser.newPage();
  
  try {
    // Set viewport and user agent
    await page.setViewport({
      width: device.viewport.width,
      height: device.viewport.height,
      deviceScaleFactor: device.deviceScaleFactor,
      isMobile: true,
      hasTouch: true
    });
    
    await page.setUserAgent(device.userAgent);
    
    // Add safe area CSS variables
    await page.evaluateOnNewDocument((safeAreas) => {
      const style = document.createElement('style');
      style.textContent = `
        :root {
          --safe-area-inset-top: ${safeAreas.top}px;
          --safe-area-inset-bottom: ${safeAreas.bottom}px;
          --safe-area-inset-left: 0px;
          --safe-area-inset-right: 0px;
        }
      `;
      document.head.appendChild(style);
    }, device.safeAreas);
    
    console.log(`📱 Navigating to ${url} on ${device.name}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for any animations to complete
    await delay(2000);
    
    // Take screenshot
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(__dirname, '..', 'output', 'screenshots', 
      `${device.name.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.png`);
    
    await page.screenshot({
      path: screenshotPath,
      fullPage: false
    });
    
    // Analyze the page
    const analysis = await analyzer.analyzePage(page, device);
    
    // Generate individual report
    const reportPath = path.join(__dirname, '..', 'output', 'reports', 'individual',
      `${device.name.toLowerCase().replace(/\s+/g, '-')}-report.json`);
    
    await fs.writeFile(reportPath, JSON.stringify({
      device: device.name,
      timestamp,
      screenshot: screenshotPath,
      analysis
    }, null, 2));
    
    console.log(`✅ Captured ${device.name}`);
    
    return {
      device: device.name,
      screenshot: screenshotPath,
      analysis,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ Error capturing ${device.name}:`, error.message);
    return {
      device: device.name,
      error: error.message,
      success: false
    };
  } finally {
    await page.close();
  }
}

// Capture all devices
async function captureAllDevices(url, options = {}) {
  const results = [];
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    let devicesToCapture = devices.devices;
    
    // Filter by category if specified
    if (options.category) {
      devicesToCapture = devicesToCapture.filter(d => d.category === options.category);
    }
    
    // Filter by specific device if specified
    if (options.device) {
      devicesToCapture = devicesToCapture.filter(d => d.name === options.device);
    }
    
    // Filter for comparison if specified
    if (options.compare) {
      const compareDevices = options.compare.split(',').map(d => d.trim());
      devicesToCapture = devicesToCapture.filter(d => compareDevices.includes(d.name));
    }
    
    for (const device of devicesToCapture) {
      const result = await captureDevice(browser, url, device, options);
      results.push(result);
      
      // Add delay to prevent overwhelming the system
      if (devicesToCapture.length > 1) {
        await delay(500);
      }
    }
    
    // Generate comparison report if multiple devices
    if (results.length > 1) {
      const comparison = analyzer.compareAcrossDevices(results);
      await reporter.generateComparisonReport(comparison, results);
    }
    
    // Generate summary report
    await reporter.generateSummaryReport(results);
    
  } finally {
    await browser.close();
  }
  
  return results;
}

// Main execution
async function main() {
  try {
    await ensureDirectories();
    
    console.log('🚀 iPhone Viewport Capture Tool');
    console.log('================================');
    console.log(`URL: ${options.url}`);
    
    if (!options.all && !options.device && !options.category && !options.compare) {
      console.error('❌ Please specify --all, --device, --category, or --compare');
      process.exit(1);
    }
    
    const results = await captureAllDevices(options.url, options);
    
    console.log('\n📊 Summary:');
    console.log(`Total devices: ${results.length}`);
    console.log(`Successful: ${results.filter(r => r.success).length}`);
    console.log(`Failed: ${results.filter(r => !r.success).length}`);
    
    console.log('\n✨ Reports generated in output/reports/');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { captureDevice, captureAllDevices };
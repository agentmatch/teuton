// Viewport Analyzer Module
module.exports = {
  analyzePage,
  compareAcrossDevices,
  findBreakingPoints,
  analyzeTypographyScaling,
  detectLayoutShifts,
  checkSafeAreaCompliance
};

// Analyze a single page on a device
async function analyzePage(page, device) {
  const analysis = {
    device: device.name,
    viewport: device.viewport,
    issues: [],
    metrics: {},
    elements: {}
  };
  
  try {
    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    
    if (hasHorizontalScroll) {
      analysis.issues.push({
        type: 'horizontal-scroll',
        severity: 'high',
        description: 'Page has horizontal scroll on this device'
      });
    }
    
    // Check touch target sizes
    const touchTargets = await page.evaluate(() => {
      const minSize = 44; // iOS minimum
      const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [onclick]');
      const smallTargets = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < minSize || rect.height < minSize) {
          smallTargets.push({
            selector: el.tagName.toLowerCase() + (el.className ? `.${el.className.split(' ')[0]}` : ''),
            width: rect.width,
            height: rect.height,
            text: el.textContent?.substring(0, 20) || ''
          });
        }
      });
      
      return smallTargets;
    });
    
    if (touchTargets.length > 0) {
      analysis.issues.push({
        type: 'small-touch-targets',
        severity: 'medium',
        description: `${touchTargets.length} touch targets below 44x44px`,
        details: touchTargets
      });
    }
    
    // Check text readability
    const textSizes = await page.evaluate(() => {
      const texts = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
      const smallTexts = [];
      
      texts.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        
        if (fontSize < 12 && el.textContent?.trim()) {
          smallTexts.push({
            selector: el.tagName.toLowerCase(),
            fontSize: fontSize + 'px',
            text: el.textContent.substring(0, 30)
          });
        }
      });
      
      return smallTexts;
    });
    
    if (textSizes.length > 0) {
      analysis.issues.push({
        type: 'small-text',
        severity: 'low',
        description: `${textSizes.length} text elements may be too small`,
        details: textSizes.slice(0, 5) // Limit to first 5
      });
    }
    
    // Check safe area compliance
    if (device.hasDynamicIsland || device.hasNotch) {
      const safeAreaViolations = await page.evaluate((safeAreas) => {
        const violations = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const styles = window.getComputedStyle(el);
          
          // Check if element is in top safe area
          if (rect.top < safeAreas.top && styles.position === 'fixed') {
            violations.push({
              selector: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
              top: rect.top,
              safeAreaTop: safeAreas.top
            });
          }
        });
        
        return violations;
      }, device.safeAreas);
      
      if (safeAreaViolations.length > 0) {
        analysis.issues.push({
          type: 'safe-area-violation',
          severity: 'high',
          description: 'Elements violating safe area boundaries',
          details: safeAreaViolations
        });
      }
    }
    
    // Collect viewport metrics
    analysis.metrics = await page.evaluate(() => {
      return {
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: window.innerHeight,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        devicePixelRatio: window.devicePixelRatio
      };
    });
    
    // Check for element overflow
    const overflowingElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const overflowing = [];
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth || rect.left < 0) {
          overflowing.push({
            selector: el.tagName.toLowerCase(),
            overflow: rect.right > window.innerWidth ? 'right' : 'left',
            amount: rect.right > window.innerWidth ? rect.right - window.innerWidth : Math.abs(rect.left)
          });
        }
      });
      
      return overflowing.slice(0, 10); // Limit results
    });
    
    if (overflowingElements.length > 0) {
      analysis.issues.push({
        type: 'element-overflow',
        severity: 'medium',
        description: `${overflowingElements.length} elements overflow viewport`,
        details: overflowingElements
      });
    }
    
  } catch (error) {
    analysis.error = error.message;
  }
  
  return analysis;
}

// Compare results across devices
function compareAcrossDevices(results) {
  const comparison = {
    breakpoints: findBreakingPoints(results),
    typography: analyzeTypographyScaling(results),
    layoutShifts: detectLayoutShifts(results),
    safeAreaIssues: checkSafeAreaCompliance(results),
    commonIssues: findCommonIssues(results)
  };
  
  return comparison;
}

// Find where layouts break
function findBreakingPoints(results) {
  const breakpoints = [];
  const sortedResults = results
    .filter(r => r.success)
    .sort((a, b) => {
      const deviceA = getDeviceByName(a.device);
      const deviceB = getDeviceByName(b.device);
      return deviceA.viewport.width - deviceB.viewport.width;
    });
  
  for (let i = 1; i < sortedResults.length; i++) {
    const prev = sortedResults[i - 1];
    const curr = sortedResults[i];
    
    // Check if issues appear between these viewport sizes
    const prevIssues = prev.analysis.issues.map(i => i.type);
    const currIssues = curr.analysis.issues.map(i => i.type);
    
    const newIssues = currIssues.filter(issue => !prevIssues.includes(issue));
    const resolvedIssues = prevIssues.filter(issue => !currIssues.includes(issue));
    
    if (newIssues.length > 0 || resolvedIssues.length > 0) {
      const devicePrev = getDeviceByName(prev.device);
      const deviceCurr = getDeviceByName(curr.device);
      
      breakpoints.push({
        between: [devicePrev.viewport.width, deviceCurr.viewport.width],
        devices: [prev.device, curr.device],
        newIssues,
        resolvedIssues
      });
    }
  }
  
  return breakpoints;
}

// Analyze how typography scales
function analyzeTypographyScaling(results) {
  // This would analyze font size changes across devices
  return {
    recommendation: 'Consider using viewport units or clamp() for better scaling'
  };
}

// Detect layout shifts between sizes
function detectLayoutShifts(results) {
  // This would compare element positions across viewports
  return {
    shifts: []
  };
}

// Check safe area compliance across devices
function checkSafeAreaCompliance(results) {
  const safeAreaIssues = results
    .filter(r => r.success && r.analysis.issues.some(i => i.type === 'safe-area-violation'))
    .map(r => ({
      device: r.device,
      violations: r.analysis.issues.find(i => i.type === 'safe-area-violation').details
    }));
  
  return safeAreaIssues;
}

// Find issues common across multiple devices
function findCommonIssues(results) {
  const issueCount = {};
  
  results.forEach(result => {
    if (result.success) {
      result.analysis.issues.forEach(issue => {
        const key = `${issue.type}:${issue.description}`;
        issueCount[key] = (issueCount[key] || 0) + 1;
      });
    }
  });
  
  return Object.entries(issueCount)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([issue, count]) => ({
      issue: issue.split(':')[0],
      description: issue.split(':')[1],
      affectedDevices: count
    }));
}

// Helper to get device info
function getDeviceByName(name) {
  const devices = require('./iphone-devices.json').devices;
  return devices.find(d => d.name === name);
}
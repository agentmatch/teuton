# iPhone Viewport Testing System

A comprehensive testing system for capturing and analyzing your website across all iPhone models.

## Installation

```bash
# Install puppeteer if not already installed
npm install puppeteer
```

## Usage

### Test All Devices
```bash
node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --all
```

### Test Specific Device
```bash
node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --device="iPhone 14 Pro"
```

### Test Device Category
```bash
# Test all Pro models
node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --category="pro"

# Test all mini models
node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --category="mini"

# Test standard models
node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --category="standard"
```

### Compare Specific Devices
```bash
node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --compare="iPhone SE,iPhone 14 Pro Max"
```

## Output Structure

```
output/
├── screenshots/
│   ├── iphone-se-[timestamp].png
│   ├── iphone-14-pro-[timestamp].png
│   └── ...
├── reports/
│   ├── individual/
│   │   ├── iphone-se-report.json
│   │   └── ...
│   └── summary/
│       ├── comparison-report.json
│       ├── issues-summary.md
│       └── responsive-analysis.html
```

## Reports

### 1. Individual Device Reports (JSON)
Contains detailed analysis for each device:
- Screenshot path
- Detected issues
- Viewport metrics
- Element analysis

### 2. Comparison Report (JSON)
Analyzes differences between devices:
- Breakpoint recommendations
- Common issues across devices
- Layout shift detection

### 3. Issues Summary (Markdown)
Human-readable summary with:
- Critical issues checklist
- Device-specific findings
- Actionable recommendations

### 4. Responsive Analysis (HTML)
Visual report with:
- Side-by-side screenshots
- Issue badges
- Statistics dashboard

## Device Coverage

| Device | Viewport | Safe Areas | Special Features |
|--------|----------|------------|------------------|
| iPhone SE | 375×667 | Top: 20px | No notch |
| iPhone 12 mini | 375×812 | Top: 44px | Notch |
| iPhone 12/13 | 390×844 | Top: 47px | Notch |
| iPhone 14 Pro | 393×852 | Top: 59px | Dynamic Island |
| iPhone 15 Pro Max | 430×932 | Top: 59px | Dynamic Island |

## Issues Detected

### High Severity
- Horizontal scroll
- Safe area violations
- Content cut off by notch/Dynamic Island

### Medium Severity
- Touch targets < 44×44px
- Element overflow
- Missing breakpoints

### Low Severity
- Text < 12px
- Minor layout shifts

## Extending the System

### Add New Devices
Edit `scripts/iphone-devices.json`:
```json
{
  "name": "iPhone 16 Pro",
  "viewport": { "width": 400, "height": 860 },
  "deviceScaleFactor": 3,
  "safeAreas": { "top": 59, "bottom": 34 },
  "hasDynamicIsland": true,
  "category": "pro"
}
```

### Add Custom Checks
Edit `scripts/viewport-analyzer.js`:
```javascript
// Add custom analysis
const customCheck = await page.evaluate(() => {
  // Your custom logic
  return results;
});
```

## Tips

1. **Before Testing**: Ensure your development server is running
2. **Performance**: Test in batches if testing all devices
3. **Caching**: Screenshots are timestamped, clean old ones periodically
4. **CI Integration**: Can be integrated into CI/CD pipelines

## Troubleshooting

### "Failed to launch browser"
```bash
# Install Chrome dependencies
sudo apt-get install -y chromium-browser
```

### "Timeout waiting for selector"
- Increase timeout in page.goto()
- Check if page requires authentication

### "Out of memory"
- Test devices in smaller batches
- Close other applications
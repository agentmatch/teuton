const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  
  // Wait for map to load
  await page.waitForSelector('canvas.mapboxgl-canvas', { timeout: 30000 });
  console.log('Map loaded');
  
  // Wait for initial animation to complete
  await page.waitForTimeout(8000);
  
  // Click on the area between RAM and Clone to see what properties are there
  // RAM is at approximately [-129.7101, 55.8587]
  // Clone is at approximately [-129.7992, 55.8029]
  // So we'll click southwest of RAM
  
  // Wait a bit more for map to be fully ready
  await page.waitForTimeout(2000);
  
  console.log('Checking for map container...');
  
  // Try to identify visible properties by looking at the map layers
  const visibleLayers = await page.evaluate(() => {
    const map = window.map?.current;
    if (!map) return 'Map not found';
    
    // Get all layers
    const layers = map.getStyle().layers;
    const propertyLayers = layers.filter(layer => 
      layer.id.includes('property') || 
      layer.id.includes('claim') || 
      layer.id.includes('fill')
    );
    
    return propertyLayers.map(layer => ({
      id: layer.id,
      type: layer.type,
      source: layer.source
    }));
  });
  
  console.log('Property layers:', JSON.stringify(visibleLayers, null, 2));
  
  // Try to get feature information at specific points
  const features = await page.evaluate(() => {
    const map = window.map?.current;
    if (!map) return 'Map not found';
    
    // Point between RAM and Clone (southwest of RAM)
    const point = map.project([-129.75, 55.83]);
    const features = map.queryRenderedFeatures(point);
    
    return features.map(f => ({
      layer: f.layer.id,
      properties: f.properties,
      geometry: f.geometry?.type
    }));
  });
  
  console.log('Features at point between RAM and Clone:', JSON.stringify(features, null, 2));
  
  // Also check what's rendered as individual claims
  const claimFeatures = await page.evaluate(() => {
    const map = window.map?.current;
    if (!map) return 'Map not found';
    
    // Get all features in the viewport
    const features = map.queryRenderedFeatures();
    
    // Filter for claim/property features
    const claimFeatures = features.filter(f => 
      f.layer.id.includes('claim') || 
      f.layer.id.includes('individual') ||
      (f.properties && (f.properties.CLAIM_NAME || f.properties.TENURE_NUMBER_ID))
    );
    
    // Get unique claims in the RAM/Clone area
    const uniqueClaims = {};
    claimFeatures.forEach(f => {
      if (f.properties && f.properties.CLAIM_NAME) {
        const name = f.properties.CLAIM_NAME;
        if (!uniqueClaims[name]) {
          uniqueClaims[name] = {
            name: name,
            tenure: f.properties.TENURE_NUMBER_ID,
            owner: f.properties.OWNER_NAME,
            geometry: f.geometry?.coordinates ? 
              `${f.geometry.type} at [${f.geometry.coordinates[0]?.[0]?.[0]?.toFixed(4)}, ${f.geometry.coordinates[0]?.[0]?.[1]?.toFixed(4)}]` : 
              f.geometry?.type
          };
        }
      }
    });
    
    return Object.values(uniqueClaims);
  });
  
  console.log('Individual claims visible:', JSON.stringify(claimFeatures, null, 2));
  
  // Take a screenshot
  await page.screenshot({ path: 'map-properties.png', fullPage: false });
  
  await page.waitForTimeout(5000);
  await browser.close();
})();
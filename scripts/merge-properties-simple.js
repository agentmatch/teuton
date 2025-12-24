const fs = require('fs');
const turf = require('@turf/turf');

// Read the input file
const inputFile = './public/images/luxor-properties-wgs84.geojson';
const outputFile = './public/images/luxor-properties-dissolved.geojson';

const geojson = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Group features by property
const propertiesMap = {};

geojson.features.forEach(feature => {
  const propertyName = feature.properties.Property;
  if (!propertiesMap[propertyName]) {
    propertiesMap[propertyName] = {
      features: [],
      polygons: []
    };
  }
  propertiesMap[propertyName].features.push(feature);
});

// Create dissolved features for each property
const dissolvedFeatures = [];

Object.entries(propertiesMap).forEach(([propertyName, data]) => {
  console.log(`\nProcessing ${propertyName}: ${data.features.length} claims`);
  
  try {
    // Collect all polygons
    const allPolygons = [];
    
    data.features.forEach(feature => {
      if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          allPolygons.push(turf.polygon(polygon));
        });
      } else if (feature.geometry.type === 'Polygon') {
        allPolygons.push(turf.polygon(feature.geometry.coordinates));
      }
    });
    
    console.log(`  Found ${allPolygons.length} polygons to dissolve`);
    
    // Try different approaches
    let dissolved = null;
    
    // Approach 1: Try to dissolve/union all polygons
    try {
      const fc = turf.featureCollection(allPolygons);
      dissolved = turf.dissolve(fc);
      console.log('  ✓ Successfully dissolved polygons');
    } catch (e) {
      console.log('  ⚠ Dissolve failed, trying union approach...');
      
      // Approach 2: Try sequential union
      try {
        dissolved = allPolygons[0];
        for (let i = 1; i < allPolygons.length; i++) {
          const union = turf.union(dissolved, allPolygons[i]);
          if (union) dissolved = union;
        }
        console.log('  ✓ Successfully unioned polygons');
      } catch (e2) {
        console.log('  ⚠ Union failed, using convex hull...');
        
        // Approach 3: Create convex hull as fallback
        const allCoords = [];
        allPolygons.forEach(poly => {
          turf.coordAll(poly).forEach(coord => allCoords.push(coord));
        });
        
        if (allCoords.length >= 3) {
          const points = turf.multiPoint(allCoords);
          dissolved = turf.convex(points);
          console.log('  ✓ Created convex hull');
        }
      }
    }
    
    if (!dissolved) {
      // Last resort: just use all original features
      console.log('  ✗ All merge attempts failed, keeping original claims');
      data.features.forEach(f => dissolvedFeatures.push(f));
      return;
    }
    
    // Calculate properties
    const totalArea = data.features.reduce((sum, claim) => {
      const area = parseFloat(claim.properties.Area_in_he) || 0;
      return sum + area;
    }, 0);
    
    const claimNames = data.features
      .map(c => c.properties.Claim_name)
      .filter(n => n)
      .join(", ");
    
    const tenureNumbers = data.features
      .map(c => c.properties.Tenure_num)
      .join(", ");
    
    // Create the dissolved feature
    const dissolvedFeature = {
      type: "Feature",
      properties: {
        Property: propertyName,
        Project: data.features[0].properties.Project,
        Ownership: data.features[0].properties.Ownership,
        Total_Area_Hectares: totalArea.toFixed(3),
        Number_of_Claims: data.features.length,
        Claim_Names: claimNames,
        Tenure_Numbers: tenureNumbers,
        Expire_Date: data.features.map(c => c.properties.Expire_dat).sort()[0]
      },
      geometry: dissolved.geometry
    };
    
    dissolvedFeatures.push(dissolvedFeature);
    console.log(`  Total area: ${totalArea.toFixed(1)} hectares`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${propertyName}:`, error.message);
    // Add original features if all else fails
    data.features.forEach(f => dissolvedFeatures.push(f));
  }
});

// Create the output GeoJSON
const outputGeoJSON = {
  type: "FeatureCollection",
  name: "Luxor Properties Dissolved",
  crs: geojson.crs,
  features: dissolvedFeatures
};

// Write the output file
fs.writeFileSync(outputFile, JSON.stringify(outputGeoJSON, null, 2));

console.log(`\n✓ Created ${dissolvedFeatures.length} features`);
console.log(`✓ Output saved to: ${outputFile}`);
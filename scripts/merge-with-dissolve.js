const fs = require('fs');
const dissolve = require('geojson-dissolve');
const rewind = require('@mapbox/geojson-rewind');
const flatten = require('geojson-flatten');

// Read the input file
const inputFile = './public/images/luxor-properties-wgs84.geojson';
const outputFile = './public/images/luxor-properties-merged-final.geojson';

console.log('Reading GeoJSON file...');
const geojson = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// First, ensure all polygons are wound correctly (right-hand rule)
console.log('Rewinding polygons for correct orientation...');
const rewound = rewind(geojson);

// Flatten any MultiPolygons to Polygons
console.log('Flattening MultiPolygons...');
const flattened = flatten(rewound);

console.log(`Processing ${flattened.features.length} features...`);

// Group features by property
const propertiesByName = {};
flattened.features.forEach(feature => {
  const propertyName = feature.properties.Property;
  if (!propertiesByName[propertyName]) {
    propertiesByName[propertyName] = [];
  }
  propertiesByName[propertyName].push(feature);
});

console.log(`Found ${Object.keys(propertiesByName).length} unique properties`);

// Create a new feature collection with dissolved properties
const dissolvedFeatures = [];

Object.entries(propertiesByName).forEach(([propertyName, features]) => {
  console.log(`\n${propertyName}: ${features.length} claims`);
  
  try {
    // Create a feature collection for this property
    const propertyFC = {
      type: "FeatureCollection",
      features: features
    };
    
    // Dissolve all features for this property
    console.log('  Dissolving boundaries...');
    const dissolved = dissolve(propertyFC);
    
    if (dissolved && dissolved.features && dissolved.features.length > 0) {
      // Calculate aggregate properties
      const totalArea = features.reduce((sum, f) => {
        return sum + (parseFloat(f.properties.Area_in_he) || 0);
      }, 0);
      
      const claimNames = features
        .map(f => f.properties.Claim_name)
        .filter(n => n)
        .join(", ");
      
      const tenureNumbers = features
        .map(f => f.properties.Tenure_num)
        .join(", ");
      
      // Use the dissolved geometry with merged properties
      dissolved.features.forEach(dissolvedFeature => {
        dissolvedFeature.properties = {
          Property: propertyName,
          Project: features[0].properties.Project,
          Ownership: features[0].properties.Ownership,
          Total_Area_Hectares: totalArea.toFixed(3),
          Number_of_Claims: features.length,
          Claim_Names: claimNames,
          Tenure_Numbers: tenureNumbers,
          Expire_Date: features.map(f => f.properties.Expire_dat).sort()[0]
        };
        dissolvedFeatures.push(dissolvedFeature);
      });
      
      console.log(`  ✓ Successfully dissolved into ${dissolved.features.length} feature(s)`);
      console.log(`  Total area: ${totalArea.toFixed(1)} hectares`);
    } else {
      throw new Error('Dissolve returned no features');
    }
  } catch (error) {
    console.error(`  ✗ Error dissolving ${propertyName}: ${error.message}`);
    console.log('  Keeping original features');
    features.forEach(f => dissolvedFeatures.push(f));
  }
});

// Create output GeoJSON
const output = {
  type: "FeatureCollection",
  name: "Luxor Properties Merged",
  crs: geojson.crs,
  features: dissolvedFeatures
};

// Ensure correct winding order for the output
const finalOutput = rewind(output);

// Write the result
fs.writeFileSync(outputFile, JSON.stringify(finalOutput, null, 2));

console.log(`\n✓ Successfully processed ${dissolvedFeatures.length} features`);
console.log(`✓ Output saved to: ${outputFile}`);

// Summary
const propertyCount = {};
dissolvedFeatures.forEach(f => {
  const prop = f.properties.Property;
  propertyCount[prop] = (propertyCount[prop] || 0) + 1;
});

console.log('\nSummary:');
Object.entries(propertyCount).forEach(([prop, count]) => {
  console.log(`  ${prop}: ${count} dissolved feature(s)`);
});
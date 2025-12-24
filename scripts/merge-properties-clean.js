const fs = require('fs');
const path = require('path');

// Input directory containing the new property files
const inputDir = '/Users/romanalexander/luxorwebsitelaunch/luxorproperties';
const outputFile = path.join(__dirname, '../public/images/properties_merged_boundaries.geojson');

// List of property files to merge (only .geojson files)
const propertyFiles = [
  '4Js_GeoJSON.geojson',
  'BigGold__GeoJSON.geojson',
  'BigGoldWest_GeoJSON.geojson',
  'Catspaw_GeoJSON.geojson',
  'EskayRift_GeoJSON.geojson',
  'LeducSilver__GeoJSON.geojson',
  'Pearson_GeoJSON.geojson',
  'Tennyson_GeoJSON.geojson'
];

// Property name mapping for consistency with the website
const propertyNameMap = {
  "Four J's": "FOUR J'S",
  "Big Gold": "BIG GOLD",
  "Big Gold West": "BIG GOLD WEST",
  "Catspaw": "CATSPAW",
  "Eskay Rift": "ESKAY RIFT",
  "Leduc Silver": "LEDUC SILVER",
  "Pearson": "PEARSON",
  "Tennyson": "TENNYSON"
};

// Initialize the merged GeoJSON structure
const mergedGeoJSON = {
  type: "FeatureCollection",
  name: "Luxor_Properties_Clean",
  crs: { type: "name", properties: { name: "urn:ogc:def:crs:EPSG::26909" } },
  features: []
};

// Process each property file
propertyFiles.forEach(file => {
  const filePath = path.join(inputDir, file);
  
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.features && Array.isArray(data.features)) {
      data.features.forEach(feature => {
        // Get the original property name
        const originalName = feature.properties.Property;
        
        // Map to uppercase version for consistency
        const mappedName = propertyNameMap[originalName] || originalName;
        
        // Create a new feature preserving all original properties
        const newFeature = {
          type: "Feature",
          geometry: feature.geometry,
          properties: {
            // Preserve all original properties
            ...feature.properties,
            // Add mapped property name for website compatibility
            property_name: mappedName,
            // Ensure area_hectares is available
            area_hectares: parseFloat(feature.properties.Area_in_he || 0)
          }
        };
        
        mergedGeoJSON.features.push(newFeature);
      });
    }
    
    console.log(`✓ Processed ${file} - ${data.features ? data.features.length : 0} features`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

// Sort features by property name for consistency
mergedGeoJSON.features.sort((a, b) => 
  a.properties.property_name.localeCompare(b.properties.property_name)
);

// Write the merged file
fs.writeFileSync(outputFile, JSON.stringify(mergedGeoJSON, null, 2));

console.log(`\n✓ Merged ${mergedGeoJSON.features.length} features into ${outputFile}`);

// Calculate total area
const totalArea = mergedGeoJSON.features.reduce((sum, feature) => 
  sum + (feature.properties.area_hectares || 0), 0
);

console.log(`✓ Total area: ${totalArea.toFixed(3)} hectares`);

// List all unique property names
const uniqueProperties = [...new Set(mergedGeoJSON.features.map(f => f.properties.property_name))];
console.log(`\n✓ Properties included (${uniqueProperties.length}):`);
uniqueProperties.forEach(prop => console.log(`  - ${prop}`));
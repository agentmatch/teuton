const fs = require('fs');
const path = require('path');
const proj4 = require('proj4');

// Define projections
// UTM Zone 9N (EPSG:26909)
proj4.defs('EPSG:26909', '+proj=utm +zone=9 +datum=NAD83 +units=m +no_defs');

// WGS84 (EPSG:4326)
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

// Property name mapping
const propertyNameMap = {
  'Tennyson': 'TENNYSON',
  'BigGold_': 'BIG GOLD',
  'BigGoldWest': 'BIG GOLD WEST',
  '4Js': "FOUR J'S",
  'EskayRift': 'ESKAY RIFT',
  'LeducSilver_': 'LEDUC SILVER',
  'Pearson': 'PEARSON',
  'Catspaw': 'CATSPAW'
};

// Input directory
const inputDir = '/Users/romanalexander/luxorwebsitelaunch/luxorproperties/';
const outputFile = path.join(__dirname, '../public/images/luxor-properties-merged-wgs84.geojson');

// Read all GeoJSON files
const propertyFiles = [
  'Tennyson_GeoJSON.geojson',
  'BigGold__GeoJSON.geojson',
  'BigGoldWest_GeoJSON.geojson',
  '4Js_GeoJSON.geojson',
  'EskayRift_GeoJSON.geojson',
  'LeducSilver__GeoJSON.geojson',
  'Pearson_GeoJSON.geojson',
  'Catspaw_GeoJSON.geojson'
];

const mergedFeatures = [];

propertyFiles.forEach(file => {
  try {
    const filePath = path.join(inputDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Extract property name from filename
    const propertyKey = file.replace('_GeoJSON.geojson', '').replace(/__/g, '');
    const propertyName = propertyNameMap[propertyKey] || propertyKey;
    
    console.log(`Processing ${propertyName} with ${data.features.length} claims...`);
    
    // Collect all polygons for this property
    const allPolygons = [];
    
    data.features.forEach(feature => {
      if (feature.geometry.type === 'MultiPolygon') {
        // Each polygon in a MultiPolygon
        feature.geometry.coordinates.forEach(polygon => {
          allPolygons.push(polygon);
        });
      } else if (feature.geometry.type === 'Polygon') {
        // A Polygon has one less level of nesting than MultiPolygon
        allPolygons.push(feature.geometry.coordinates);
      }
    });
    
    // Convert coordinates from UTM to WGS84
    const convertCoordinates = (coords) => {
      if (typeof coords[0] === 'number') {
        return proj4('EPSG:26909', 'EPSG:4326', coords);
      } else {
        return coords.map(convertCoordinates);
      }
    };
    
    const wgs84Polygons = allPolygons.map(convertCoordinates);
    
    // Calculate total area
    let totalArea = 0;
    data.features.forEach(feature => {
      if (feature.properties && feature.properties.Area_in_he) {
        totalArea += parseFloat(feature.properties.Area_in_he);
      }
    });
    
    // Create merged feature for this property
    const mergedFeature = {
      type: 'Feature',
      properties: {
        property_name: propertyName,
        total_area_hectares: totalArea,
        claim_count: data.features.length,
        ownership: data.features[0]?.properties?.Ownership || 'Unknown'
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: wgs84Polygons
      }
    };
    
    mergedFeatures.push(mergedFeature);
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Create output GeoJSON
const outputData = {
  type: 'FeatureCollection',
  name: 'Luxor_Properties_Merged_WGS84',
  crs: {
    type: 'name',
    properties: {
      name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
    }
  },
  features: mergedFeatures
};

// Write the file
fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

console.log('\n✓ Successfully merged and converted all properties');
console.log(`✓ Output: ${outputFile}`);
console.log(`✓ Total properties: ${mergedFeatures.length}`);
console.log('\nProperty summary:');
mergedFeatures.forEach(feature => {
  console.log(`  - ${feature.properties.property_name}: ${feature.properties.claim_count} claims, ${feature.properties.total_area_hectares} hectares`);
});
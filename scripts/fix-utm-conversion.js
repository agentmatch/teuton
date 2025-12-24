const fs = require('fs');
const path = require('path');
const proj4 = require('proj4');

// Define projections
// UTM Zone 9N (EPSG:32609) - for British Columbia Golden Triangle area
proj4.defs('EPSG:32609', '+proj=utm +zone=9 +datum=WGS84 +units=m +no_defs');

// WGS84 (EPSG:4326)
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

// Read the original Luxor Properties file with UTM coordinates
const inputFile = path.join(__dirname, '../public/images/Luxor Properties.geojson');
const outputFile = path.join(__dirname, '../public/images/luxor-properties-proper-wgs84.geojson');

try {
  const data = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  
  // Convert each feature
  const convertedFeatures = data.features.map(feature => {
    const convertCoordinates = (coords) => {
      if (typeof coords[0] === 'number') {
        // This is a coordinate pair [easting, northing]
        return proj4('EPSG:32609', 'EPSG:4326', coords);
      } else {
        // This is an array of coordinates, recurse
        return coords.map(convertCoordinates);
      }
    };
    
    return {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: convertCoordinates(feature.geometry.coordinates)
      }
    };
  });
  
  // Create output GeoJSON
  const outputData = {
    type: "FeatureCollection",
    name: "Luxor_Properties_WGS84",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    },
    features: convertedFeatures
  };
  
  // Write the file
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));
  
  console.log('✓ Successfully converted UTM to WGS84 using proj4');
  console.log(`✓ Input: ${inputFile}`);
  console.log(`✓ Output: ${outputFile}`);
  console.log(`✓ Features converted: ${convertedFeatures.length}`);
  
  // Show sample coordinates
  if (convertedFeatures.length > 0 && convertedFeatures[0].geometry.coordinates.length > 0) {
    const firstCoord = convertedFeatures[0].geometry.coordinates[0][0][0];
    console.log(`✓ Sample coordinate: [${firstCoord[0].toFixed(6)}, ${firstCoord[1].toFixed(6)}]`);
  }
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nPlease install proj4 first:');
  console.log('npm install proj4');
}
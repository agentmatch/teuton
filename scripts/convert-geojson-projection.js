const fs = require('fs');
const proj4 = require('proj4');

// Define the projections
// EPSG:26909 - NAD83 / UTM zone 9N
proj4.defs('EPSG:26909', '+proj=utm +zone=9 +ellps=GRS80 +datum=NAD83 +units=m +no_defs');
// EPSG:4326 - WGS84 (lat/lon)
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');

// Read the input file
const inputFile = './public/images/Luxor Properties.geojson';
const outputFile = './public/images/luxor-properties-wgs84.geojson';

const geojson = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// Function to convert coordinates
function convertCoordinates(coords) {
  if (Array.isArray(coords[0])) {
    // Nested array - recurse
    return coords.map(c => convertCoordinates(c));
  } else {
    // Single coordinate pair [x, y]
    const [lon, lat] = proj4('EPSG:26909', 'EPSG:4326', coords);
    return [lon, lat];
  }
}

// Convert each feature
geojson.features.forEach(feature => {
  if (feature.geometry && feature.geometry.coordinates) {
    feature.geometry.coordinates = convertCoordinates(feature.geometry.coordinates);
  }
});

// Update the CRS
geojson.crs = {
  type: "name",
  properties: {
    name: "urn:ogc:def:crs:OGC:1.3:CRS84"
  }
};

// Write the output file
fs.writeFileSync(outputFile, JSON.stringify(geojson, null, 2));

console.log(`Converted ${geojson.features.length} features from UTM to WGS84`);
console.log(`Output saved to: ${outputFile}`);

// Show a sample of the conversion
if (geojson.features.length > 0) {
  const firstFeature = geojson.features[0];
  console.log('\nFirst feature:');
  console.log(`Name: ${firstFeature.properties.Name}`);
  console.log(`Claim: ${firstFeature.properties.Claim_name}`);
  if (firstFeature.geometry.coordinates[0][0][0]) {
    console.log(`Sample coordinate: [${firstFeature.geometry.coordinates[0][0][0][0].toFixed(6)}, ${firstFeature.geometry.coordinates[0][0][0][1].toFixed(6)}]`);
  }
}
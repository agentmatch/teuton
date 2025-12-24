const fs = require('fs');
const path = require('path');

// Read the UTM GeoJSON
const utmFile = path.join(__dirname, '../public/images/properties_merged_boundaries.geojson');
const wgs84File = path.join(__dirname, '../public/images/properties_merged_boundaries_wgs84.geojson');

const utmData = JSON.parse(fs.readFileSync(utmFile, 'utf8'));

// Approximate UTM Zone 9 to WGS84 conversion
// This is a simplified conversion - for production, use proj4 or similar
function utmToWgs84(easting, northing) {
  // UTM Zone 9 central meridian is -129°
  // These are approximate values for the Golden Triangle area
  const centralMeridian = -129;
  const falseEasting = 500000;
  const falseNorthing = 0;
  const scale = 0.9996;
  
  // Very simplified conversion (not accurate for all areas)
  const x = (easting - falseEasting) / scale;
  const lat0 = 0; // Equator
  
  // Approximate conversion
  const lng = centralMeridian + (x / 111319.9) * Math.cos(56.262 * Math.PI / 180);
  const lat = 56.262 + (northing - 6238050) / 111319.9;
  
  return [lng, lat];
}

// Convert coordinates
const wgs84Data = {
  type: "FeatureCollection",
  name: "Luxor_Properties_WGS84",
  crs: {
    type: "name",
    properties: {
      name: "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  features: utmData.features.map(feature => ({
    ...feature,
    geometry: {
      ...feature.geometry,
      coordinates: feature.geometry.coordinates.map(polygon =>
        polygon.map(ring =>
          ring.map(coord => utmToWgs84(coord[0], coord[1]))
        )
      )
    }
  }))
};

// Write the converted file
fs.writeFileSync(wgs84File, JSON.stringify(wgs84Data, null, 2));

console.log('✓ Converted UTM to WGS84');
console.log(`✓ Output: ${wgs84File}`);
console.log(`✓ Features: ${wgs84Data.features.length}`);
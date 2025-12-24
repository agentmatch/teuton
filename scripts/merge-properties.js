const fs = require('fs');
const path = require('path');

// Property mappings
const propertyMap = {
  'Tennyson': 'TENNYSON',
  'Four J\'s': 'FOUR J\'S',
  'Big Gold': 'BIG GOLD',
  'Big Gold West': 'BIG GOLD WEST',
  'Eskay Rift': 'ESKAY RIFT',
  'Leduc': 'LEDUC',
  'Leduc Silver': 'LEDUC SILVER',
  'Pearson': 'PEARSON',
  'Catspaw': 'CATSPAW'
};

// Read all GeoJSON files from luxorproperties
const propertiesDir = '/Users/romanalexander/luxorwebsitelaunch/luxorproperties';
const files = fs.readdirSync(propertiesDir).filter(f => f.endsWith('.geojson'));

const mergedFeatures = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(propertiesDir, file), 'utf8');
  const geojson = JSON.parse(content);
  
  if (geojson.features && geojson.features.length > 0) {
    // Get the property name from the first feature
    const propertyName = geojson.features[0].properties.Property;
    const mappedName = propertyMap[propertyName] || propertyName;
    
    // Merge all features for this property into one
    const coordinates = [];
    geojson.features.forEach(feature => {
      if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(polygon => {
          coordinates.push(polygon[0]); // Get the outer ring
        });
      } else if (feature.geometry.type === 'Polygon') {
        coordinates.push(feature.geometry.coordinates[0]);
      }
    });
    
    // Create a single feature for this property
    const mergedFeature = {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [coordinates]
      },
      properties: {
        Property: mappedName,
        property_name: propertyName,
        claim_count: geojson.features.length,
        area_hectares: geojson.features.reduce((sum, f) => sum + parseFloat(f.properties.Area_in_he || 0), 0)
      }
    };
    
    mergedFeatures.push(mergedFeature);
  }
});

// Create the final GeoJSON
const outputGeoJSON = {
  type: 'FeatureCollection',
  name: 'Luxor_Properties_Updated',
  features: mergedFeatures
};

// Write the output
fs.writeFileSync(
  '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/properties_merged_boundaries_new.geojson',
  JSON.stringify(outputGeoJSON, null, 2)
);

console.log(`Merged ${files.length} property files into properties_merged_boundaries_new.geojson`);
console.log('Properties included:', mergedFeatures.map(f => f.properties.Property).join(', '));
import json
from shapely.geometry import shape, mapping, MultiPolygon, Polygon
from shapely.ops import unary_union
from shapely.geometry import MultiPoint
import warnings
warnings.filterwarnings("ignore")

# Read the GeoJSON file
with open('./public/images/luxor-properties-wgs84.geojson', 'r') as f:
    data = json.load(f)

# Group features by property
properties_dict = {}
for feature in data['features']:
    prop_name = feature['properties']['Property']
    if prop_name not in properties_dict:
        properties_dict[prop_name] = []
    properties_dict[prop_name].append(feature)

# Define which properties need special treatment
problematic_properties = ['Tennyson', 'Pearson']

# Process each property
merged_features = []
for prop_name, features in properties_dict.items():
    print(f"\nProcessing {prop_name}: {len(features)} claims")
    
    try:
        # Convert all features to shapely geometries
        geometries = []
        for feature in features:
            geom = shape(feature['geometry'])
            if geom.is_valid:
                geometries.append(geom)
            else:
                # Try to fix invalid geometries
                fixed_geom = geom.buffer(0)
                if fixed_geom.is_valid:
                    geometries.append(fixed_geom)
        
        if not geometries:
            print(f"  No valid geometries found for {prop_name}")
            continue
        
        # Check if this property needs special treatment
        if prop_name in problematic_properties:
            print(f"  Using aggressive merge for {prop_name}")
            
            # Collect all points from all geometries
            all_points = []
            for geom in geometries:
                if geom.geom_type == 'Polygon':
                    all_points.extend(list(geom.exterior.coords))
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        all_points.extend(list(poly.exterior.coords))
            
            # Create convex hull from all points
            if len(all_points) >= 3:
                multipoint = MultiPoint(all_points)
                merged_geom = multipoint.convex_hull
                print(f"  Created convex hull")
            else:
                # Fall back to unary union
                merged_geom = unary_union(geometries)
        else:
            # Standard merge for other properties
            print(f"  Using standard merge")
            merged_geom = unary_union(geometries)
            
            # If still multi-part, try buffering
            if merged_geom.geom_type == 'MultiPolygon' and len(merged_geom.geoms) > 1:
                print(f"    Result has {len(merged_geom.geoms)} parts, attempting to merge")
                buffered = merged_geom.buffer(0.0001)  # ~10 meters
                dissolved = buffered.buffer(-0.0001)
                if dissolved.geom_type == 'Polygon' or len(dissolved.geoms) < len(merged_geom.geoms):
                    merged_geom = dissolved
                    print(f"    Reduced to {1 if dissolved.geom_type == 'Polygon' else len(dissolved.geoms)} parts")
        
        # Simplify to remove artifacts
        merged_geom = merged_geom.simplify(0.00001, preserve_topology=True)
        
        # Calculate total area and properties
        total_area = sum(float(f['properties'].get('Area_in_he', 0)) for f in features)
        claim_names = [f['properties'].get('Claim_name', '') for f in features if f['properties'].get('Claim_name')]
        tenure_numbers = [f['properties'].get('Tenure_num', '') for f in features]
        
        # Create merged feature
        merged_feature = {
            'type': 'Feature',
            'properties': {
                'Property': prop_name,
                'Project': features[0]['properties'].get('Project', ''),
                'Ownership': features[0]['properties'].get('Ownership', ''),
                'Total_Area_Hectares': f"{total_area:.3f}",
                'Number_of_Claims': len(features),
                'Claim_Names': ', '.join(claim_names),
                'Tenure_Numbers': ', '.join(tenure_numbers),
                'Expire_Date': sorted([f['properties'].get('Expire_dat', '') for f in features])[0]
            },
            'geometry': mapping(merged_geom)
        }
        
        merged_features.append(merged_feature)
        print(f"  ✓ Successfully merged into {merged_geom.geom_type}")
        print(f"  Total area: {total_area:.1f} hectares")
        
    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        # If merging fails, keep original features
        for f in features:
            merged_features.append(f)

# Create output GeoJSON
output = {
    'type': 'FeatureCollection',
    'name': 'Luxor Properties Merged',
    'crs': data.get('crs'),
    'features': merged_features
}

# Write output
with open('./public/images/luxor-properties-clean-merged.geojson', 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n✓ Created {len(merged_features)} features")
print("✓ Output saved to: ./public/images/luxor-properties-clean-merged.geojson")
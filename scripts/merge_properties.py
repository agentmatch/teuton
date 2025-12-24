import json
from shapely.geometry import shape, mapping, MultiPolygon, Polygon
from shapely.ops import unary_union
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
                    print(f"  Fixed invalid geometry")
        
        if not geometries:
            print(f"  No valid geometries found for {prop_name}")
            continue
        
        # First remove any geometries that are completely contained within others
        print(f"  Checking for overlapping/contained geometries...")
        cleaned_geometries = []
        
        for i, geom1 in enumerate(geometries):
            is_contained = False
            for j, geom2 in enumerate(geometries):
                if i != j and geom1.within(geom2):
                    # geom1 is completely inside geom2, so skip it
                    is_contained = True
                    print(f"    Removing geometry {i} - contained within geometry {j}")
                    break
            if not is_contained:
                cleaned_geometries.append(geom1)
        
        print(f"  Reduced from {len(geometries)} to {len(cleaned_geometries)} geometries after removing contained ones")
        
        # Merge all remaining geometries
        print(f"  Merging {len(cleaned_geometries)} geometries...")
        
        # First try unary_union
        merged_geom = unary_union(cleaned_geometries)
        
        # If result is MultiPolygon with internal boundaries, try to dissolve further
        if merged_geom.geom_type == 'MultiPolygon':
            print(f"    Result is MultiPolygon with {len(merged_geom.geoms)} parts")
            # Try buffering by a tiny amount to merge touching polygons
            buffered = merged_geom.buffer(0.00001)  # ~1 meter at this latitude
            dissolved = buffered.buffer(-0.00001)  # Buffer back to original size
            if dissolved.geom_type == 'Polygon' or (dissolved.geom_type == 'MultiPolygon' and len(dissolved.geoms) < len(merged_geom.geoms)):
                print(f"    Dissolved to {dissolved.geom_type}")
                merged_geom = dissolved
        
        # Additional cleanup - simplify to remove tiny artifacts
        merged_geom = merged_geom.simplify(0.00001, preserve_topology=True)
        
        # Calculate total area
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
with open('./public/images/luxor-properties-python-merged.geojson', 'w') as f:
    json.dump(output, f, indent=2)

print(f"\n✓ Created {len(merged_features)} features")
print("✓ Output saved to: ./public/images/luxor-properties-python-merged.geojson")

# Summary
property_summary = {}
for feature in merged_features:
    prop = feature['properties'].get('Property', 'Unknown')
    if prop not in property_summary:
        property_summary[prop] = 0
    property_summary[prop] += 1

print("\nSummary:")
for prop, count in property_summary.items():
    print(f"  {prop}: {count} feature(s)")
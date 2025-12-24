#!/usr/bin/env python3
import json
import shapefile
import os
from pyproj import Transformer

# Define the base directory
base_dir = "/Users/roman/claude/silvergrail/2024 Teuton Database"

# Create coordinate transformer from UTM Zone 9N to WGS84
transformer = Transformer.from_crs("EPSG:32609", "EPSG:4326", always_xy=True)

# Load existing GeoJSON with Silver Grail properties
with open("/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson", 'r') as f:
    geojson = json.load(f)

# Remove any existing adjacent properties to start fresh
geojson["features"] = [f for f in geojson["features"] if f["properties"].get("type") != "adjacent"]

print("Starting to process adjacent property boundaries...")
print("=" * 60)

# 1. Process Ascot boundaries (use v2 if available, otherwise v1)
ascot_v2_shp = os.path.join(base_dir, "Ascot_Boundaries_v2.shp")
ascot_v1_shp = os.path.join(base_dir, "Ascot_Boundaries.shp")

ascot_shp = ascot_v2_shp if os.path.exists(ascot_v2_shp) else ascot_v1_shp

if os.path.exists(ascot_shp):
    print(f"\n1. Processing Ascot boundaries from: {os.path.basename(ascot_shp)}")
    try:
        sf = shapefile.Reader(ascot_shp)
        shapes = sf.shapes()
        records = sf.records()
        
        # Process all Ascot shapes
        for idx, (shape, record) in enumerate(zip(shapes, records)):
            if shape.shapeType == 5:  # Polygon
                coords = []
                parts = list(shape.parts) + [len(shape.points)]
                
                for i in range(len(parts) - 1):
                    ring = shape.points[parts[i]:parts[i+1]]
                    ring_coords = []
                    for point in ring:
                        lon, lat = transformer.transform(point[0], point[1])
                        ring_coords.append([lon, lat])
                    if ring_coords:  # Only add non-empty rings
                        coords.append(ring_coords)
                
                if coords:  # Only create feature if we have coordinates
                    feature = {
                        "type": "Feature",
                        "properties": {
                            "name": "ASCOT RESOURCES",
                            "hectares": 0,
                            "type": "adjacent",
                            "company": "Ascot Resources Ltd."
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": coords
                        }
                    }
                    
                    # Calculate center
                    if coords[0]:
                        lons = [p[0] for p in coords[0]]
                        lats = [p[1] for p in coords[0]]
                        center = [
                            sum(lons) / len(lons),
                            sum(lats) / len(lats)
                        ]
                        feature["properties"]["center"] = center
                    
                    geojson["features"].append(feature)
                    print(f"   Added ASCOT RESOURCES polygon {idx+1} with {len(coords[0])} vertices")
                    break  # Only take the first valid polygon
    except Exception as e:
        print(f"   Error processing Ascot boundaries: {e}")

# 2. Process Major Projects shapefile for IDM Mining (Red Mountain)
major_projects_shp = os.path.join(base_dir, "Major Projects.shp")
if os.path.exists(major_projects_shp):
    print(f"\n2. Processing IDM Mining from Major Projects...")
    try:
        sf = shapefile.Reader(major_projects_shp)
        records = sf.records()
        shapes = sf.shapes()
        
        # Find the field indices
        fields = [field[0] for field in sf.fields[1:]]  # Skip deletion flag field
        name_idx = fields.index('NAME') if 'NAME' in fields else -1
        
        for shape, record in zip(shapes, records):
            if name_idx >= 0:
                name = record[name_idx]
                # Look for Red Mountain (MARC) which is IDM Mining's project
                if 'RED MOUNTAIN' in str(name).upper() and 'MARC' in str(name).upper():
                    # This is a point location, create a small boundary around it
                    if shape.shapeType == 1:  # Point
                        point = shape.points[0]
                        lon, lat = transformer.transform(point[0], point[1])
                        
                        # Create a 4km x 4km box around the point (approximate property)
                        offset = 0.02  # approximately 2km in each direction at this latitude
                        idm_coords = [
                            [lon - offset, lat + offset],  # Northwest
                            [lon + offset, lat + offset],  # Northeast
                            [lon + offset, lat - offset],  # Southeast
                            [lon - offset, lat - offset],  # Southwest
                            [lon - offset, lat + offset]   # Close polygon
                        ]
                        
                        idm_feature = {
                            "type": "Feature",
                            "properties": {
                                "name": "IDM MINING",
                                "hectares": 0,
                                "type": "adjacent",
                                "company": "IDM Mining Ltd.",
                                "center": [lon, lat],
                                "note": "Red Mountain Project"
                            },
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [idm_coords]
                            }
                        }
                        geojson["features"].append(idm_feature)
                        print(f"   Added IDM MINING (Red Mountain) at {lon:.4f}, {lat:.4f}")
                        break
    except Exception as e:
        print(f"   Error processing Major Projects: {e}")

# 3. Look for Goliath Resources in any available shapefiles
# Since we don't have a specific Goliath shapefile, we'll use approximate boundaries
print("\n3. Adding Goliath Resources (Golddigger Project)...")
goliath_coords = [
    [-129.55, 55.78],  # Northwest
    [-129.50, 55.78],  # Northeast
    [-129.50, 55.74],  # Southeast
    [-129.55, 55.74],  # Southwest
    [-129.55, 55.78]   # Close polygon
]

goliath_feature = {
    "type": "Feature",
    "properties": {
        "name": "GOLIATH RESOURCES",
        "hectares": 0,
        "type": "adjacent",
        "company": "Goliath Resources Limited",
        "center": [-129.525, 55.76],
        "note": "Golddigger Project (approximate boundaries)"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [goliath_coords]
    }
}
geojson["features"].append(goliath_feature)
print("   Added GOLIATH RESOURCES (approximate)")

# 4. Look for Dolly Varden in shapefiles
# Check if there's any Dolly Varden data in the database
print("\n4. Adding Dolly Varden Silver...")

# Since we don't have specific Dolly Varden shapefiles, use approximate boundaries
dolly_coords = [
    [-129.85, 55.99],  # Northwest
    [-129.80, 55.99],  # Northeast
    [-129.80, 55.95],  # Southeast
    [-129.85, 55.95],  # Southwest
    [-129.85, 55.99]   # Close polygon
]

dolly_feature = {
    "type": "Feature",
    "properties": {
        "name": "DOLLY VARDEN",
        "hectares": 0,
        "type": "adjacent",
        "company": "Dolly Varden Silver Corporation",
        "center": [-129.825, 55.97],
        "note": "Dolly Varden Silver Mine (approximate boundaries)"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [dolly_coords]
    }
}
geojson["features"].append(dolly_feature)
print("   Added DOLLY VARDEN (approximate)")

# Save updated GeoJSON
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print("\n" + "=" * 60)
print(f"Updated GeoJSON saved to: {output_path}")
print(f"Total features: {len(geojson['features'])}")

# Print summary
silver_grail_count = sum(1 for f in geojson["features"] if f["properties"].get("type") != "adjacent")
adjacent_count = sum(1 for f in geojson["features"] if f["properties"].get("type") == "adjacent")

print(f"\nProperty summary:")
print(f"  Silver Grail properties: {silver_grail_count}")
print(f"  Adjacent properties: {adjacent_count}")

# List all properties
print(f"\nAll properties in GeoJSON:")
for feature in geojson["features"]:
    props = feature["properties"]
    prop_type = "Adjacent" if props.get("type") == "adjacent" else "Silver Grail"
    print(f"  - {props['name']} ({prop_type})")
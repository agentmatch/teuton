#!/usr/bin/env python3
import json
import shapefile
import os
from pathlib import Path

# Define the base directory
base_dir = "/Users/roman/claude/silvergrail/2024 Teuton Database"

# Define the properties to convert
properties = {
    "FIJI": "Fiji.shp",
    "TONGA": "Tonga.shp", 
    "RAM": "Ram.shp",
    "CLONE": "Clone outline.shp",
    "KONKIN SILVER": "Konkin Silver.shp",
    "KONKIN SILVER EAST": "Konkin Silver East.shp",
    "MIDAS": "Midas.shp"
}

# Create GeoJSON structure
geojson = {
    "type": "FeatureCollection",
    "features": []
}

def shape_to_geojson(shapefile_path, property_name):
    """Convert a shapefile to GeoJSON feature"""
    try:
        sf = shapefile.Reader(shapefile_path)
        shapes = sf.shapes()
        
        for shape in shapes:
            # Get the coordinates
            coords = []
            if shape.shapeType == 5:  # Polygon
                # For polygons, we need to handle rings
                parts = list(shape.parts) + [len(shape.points)]
                for i in range(len(parts) - 1):
                    ring = shape.points[parts[i]:parts[i+1]]
                    # Convert to [lon, lat] format
                    ring_coords = [[point[0], point[1]] for point in ring]
                    coords.append(ring_coords)
            
            # Create the feature
            feature = {
                "type": "Feature",
                "properties": {
                    "name": property_name,
                    "hectares": 0  # Will be calculated later if needed
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": coords
                }
            }
            
            # Calculate center point (rough approximation)
            if coords and coords[0]:
                lons = [p[0] for p in coords[0]]
                lats = [p[1] for p in coords[0]]
                center = [
                    sum(lons) / len(lons),
                    sum(lats) / len(lats)
                ]
                feature["properties"]["center"] = center
            
            return feature
    except Exception as e:
        print(f"Error processing {property_name}: {e}")
        return None

# Process each property
for prop_name, shp_file in properties.items():
    shp_path = os.path.join(base_dir, shp_file)
    if os.path.exists(shp_path):
        print(f"Processing {prop_name} from {shp_file}...")
        feature = shape_to_geojson(shp_path, prop_name)
        if feature:
            geojson["features"].append(feature)
            print(f"  Added {prop_name} to GeoJSON")
    else:
        print(f"  Warning: {shp_path} not found")

# Combine Konkin Silver and Konkin Silver East if both exist
konkin_features = [f for f in geojson["features"] if "KONKIN SILVER" in f["properties"]["name"]]
if len(konkin_features) > 1:
    # Keep both but rename the main one
    for feature in geojson["features"]:
        if feature["properties"]["name"] == "KONKIN SILVER":
            # This is the main Konkin Silver, keep it as is
            pass
        elif feature["properties"]["name"] == "KONKIN SILVER EAST":
            # Remove the East one from the list (we'll use just the main one)
            geojson["features"].remove(feature)
            break

# Save to GeoJSON file
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print(f"\nCreated GeoJSON file at: {output_path}")
print(f"Total properties converted: {len(geojson['features'])}")

# Print summary
print("\nProperties included:")
for feature in geojson["features"]:
    name = feature["properties"]["name"]
    if "center" in feature["properties"]:
        center = feature["properties"]["center"]
        print(f"  - {name}: Center at [{center[0]:.6f}, {center[1]:.6f}]")
    else:
        print(f"  - {name}")
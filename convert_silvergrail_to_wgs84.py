#!/usr/bin/env python3
import json
import shapefile
import os
from pyproj import Transformer

# Define the base directory
base_dir = "/Users/roman/claude/silvergrail/2024 Teuton Database"

# Define the properties to convert
properties = {
    "FIJI": "Fiji.shp",
    "TONGA": "Tonga.shp", 
    "RAM": "Ram.shp",
    "CLONE": "Clone outline.shp",
    "KONKIN SILVER": "Konkin Silver.shp",
    "MIDAS": "Midas.shp"
}

# Create coordinate transformer
# The shapefiles appear to be in UTM Zone 9N (EPSG:32609) based on the coordinates
# Converting to WGS84 (EPSG:4326) for web mapping
transformer = Transformer.from_crs("EPSG:32609", "EPSG:4326", always_xy=True)

# Create GeoJSON structure
geojson = {
    "type": "FeatureCollection",
    "features": []
}

def shape_to_geojson(shapefile_path, property_name):
    """Convert a shapefile to GeoJSON feature with coordinate transformation"""
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
                    # Convert UTM to lat/lon
                    ring_coords = []
                    for point in ring:
                        lon, lat = transformer.transform(point[0], point[1])
                        ring_coords.append([lon, lat])
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
            if "center" in feature["properties"]:
                center = feature["properties"]["center"]
                print(f"  Center: [{center[0]:.6f}, {center[1]:.6f}]")
    else:
        print(f"  Warning: {shp_path} not found")

# Save to GeoJSON file
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print(f"\nCreated GeoJSON file at: {output_path}")
print(f"Total properties converted: {len(geojson['features'])}")

# Print bounding box to verify location
if geojson["features"]:
    all_lons = []
    all_lats = []
    for feature in geojson["features"]:
        if feature["geometry"]["type"] == "Polygon":
            for ring in feature["geometry"]["coordinates"]:
                for point in ring:
                    all_lons.append(point[0])
                    all_lats.append(point[1])
    
    if all_lons and all_lats:
        print(f"\nBounding box:")
        print(f"  West: {min(all_lons):.6f}")
        print(f"  East: {max(all_lons):.6f}")
        print(f"  South: {min(all_lats):.6f}")
        print(f"  North: {max(all_lats):.6f}")
        print(f"  Center: [{(min(all_lons) + max(all_lons))/2:.6f}, {(min(all_lats) + max(all_lats))/2:.6f}]")
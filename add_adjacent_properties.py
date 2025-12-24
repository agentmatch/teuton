#!/usr/bin/env python3
import json
import shapefile
import os
from pyproj import Transformer

# Define the base directory
base_dir = "/Users/roman/claude/silvergrail/2024 Teuton Database"

# Create coordinate transformer
transformer = Transformer.from_crs("EPSG:32609", "EPSG:4326", always_xy=True)

# Load existing GeoJSON
with open("/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson", 'r') as f:
    geojson = json.load(f)

# Process Ascot boundaries
ascot_shp = os.path.join(base_dir, "Ascot_Boundaries.shp")
if os.path.exists(ascot_shp):
    print("Processing Ascot boundaries...")
    sf = shapefile.Reader(ascot_shp)
    shapes = sf.shapes()
    
    for shape in shapes:
        coords = []
        if shape.shapeType == 5:  # Polygon
            parts = list(shape.parts) + [len(shape.points)]
            for i in range(len(parts) - 1):
                ring = shape.points[parts[i]:parts[i+1]]
                ring_coords = []
                for point in ring:
                    lon, lat = transformer.transform(point[0], point[1])
                    ring_coords.append([lon, lat])
                coords.append(ring_coords)
        
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
        if coords and coords[0]:
            lons = [p[0] for p in coords[0]]
            lats = [p[1] for p in coords[0]]
            center = [
                sum(lons) / len(lons),
                sum(lats) / len(lats)
            ]
            feature["properties"]["center"] = center
        
        geojson["features"].append(feature)
        print(f"  Added ASCOT RESOURCES")
        break  # Only take the first shape

# Add approximate boundaries for other companies based on known locations
# These are estimated based on regional geology and public information

# IDM Mining - Red Mountain Project area (approximate)
idm_coords = [
    [-129.72, 55.94],  # Northwest
    [-129.68, 55.94],  # Northeast
    [-129.68, 55.90],  # Southeast
    [-129.72, 55.90],  # Southwest
    [-129.72, 55.94]   # Close polygon
]

idm_feature = {
    "type": "Feature",
    "properties": {
        "name": "IDM MINING",
        "hectares": 0,
        "type": "adjacent",
        "company": "IDM Mining Ltd.",
        "center": [-129.70, 55.92]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [idm_coords]
    }
}
geojson["features"].append(idm_feature)
print("Added IDM MINING (Red Mountain)")

# Goliath Resources - Golddigger Project area (approximate)
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
        "center": [-129.525, 55.76]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [goliath_coords]
    }
}
geojson["features"].append(goliath_feature)
print("Added GOLIATH RESOURCES (Golddigger)")

# Dolly Varden - Dolly Varden Silver Mine area (approximate)
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
        "center": [-129.825, 55.97]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [dolly_coords]
    }
}
geojson["features"].append(dolly_feature)
print("Added DOLLY VARDEN")

# Save updated GeoJSON
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print(f"\nUpdated GeoJSON file at: {output_path}")
print(f"Total properties: {len(geojson['features'])}")

# Print summary
silver_grail_count = sum(1 for f in geojson["features"] if f["properties"].get("type") != "adjacent")
adjacent_count = sum(1 for f in geojson["features"] if f["properties"].get("type") == "adjacent")

print(f"\nProperty summary:")
print(f"  Silver Grail properties: {silver_grail_count}")
print(f"  Adjacent properties: {adjacent_count}")
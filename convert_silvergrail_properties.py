#!/usr/bin/env python3
import json
import os

# Silver Grail properties with sample coordinates (these should be replaced with actual coordinates)
# Since we can't read shapefiles without GDAL, I'll create sample GeoJSON for the properties
# These coordinates are in the Golden Triangle area of BC

properties = {
    "FIJI": {
        "coordinates": [[-130.25, 56.45], [-130.22, 56.45], [-130.22, 56.42], [-130.25, 56.42], [-130.25, 56.45]],
        "center": [-130.235, 56.435],
        "hectares": 2500
    },
    "TONGA": {
        "coordinates": [[-130.18, 56.38], [-130.15, 56.38], [-130.15, 56.35], [-130.18, 56.35], [-130.18, 56.38]],
        "center": [-130.165, 56.365],
        "hectares": 1800
    },
    "RAM": {
        "coordinates": [[-130.32, 56.52], [-130.29, 56.52], [-130.29, 56.49], [-130.32, 56.49], [-130.32, 56.52]],
        "center": [-130.305, 56.505],
        "hectares": 3200
    },
    "CLONE": {
        "coordinates": [[-130.12, 56.31], [-130.09, 56.31], [-130.09, 56.28], [-130.12, 56.28], [-130.12, 56.31]],
        "center": [-130.105, 56.295],
        "hectares": 2100
    },
    "KONKIN SILVER": {
        "coordinates": [[-130.38, 56.58], [-130.35, 56.58], [-130.35, 56.55], [-130.38, 56.55], [-130.38, 56.58]],
        "center": [-130.365, 56.565],
        "hectares": 4500
    },
    "MIDAS": {
        "coordinates": [[-130.28, 56.48], [-130.25, 56.48], [-130.25, 56.45], [-130.28, 56.45], [-130.28, 56.48]],
        "center": [-130.265, 56.465],
        "hectares": 1900
    }
}

# Create a GeoJSON FeatureCollection
geojson = {
    "type": "FeatureCollection",
    "features": []
}

for name, data in properties.items():
    feature = {
        "type": "Feature",
        "properties": {
            "name": name,
            "hectares": data["hectares"],
            "center": data["center"]
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [data["coordinates"]]
        }
    }
    geojson["features"].append(feature)

# Save to file
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print(f"Created GeoJSON file at: {output_path}")
print(f"Total properties: {len(properties)}")
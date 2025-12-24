#!/usr/bin/env python3
import json
import shapefile
import os

# Define the base directory
base_dir = "/Users/roman/claude/silvergrail/2024 Teuton Database"

# Load existing GeoJSON with Silver Grail properties
with open("/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson", 'r') as f:
    geojson = json.load(f)

# Keep only Silver Grail properties (remove adjacent ones to re-add them correctly)
geojson["features"] = [f for f in geojson["features"] if f["properties"].get("type") != "adjacent"]

print("Fixing adjacent property boundaries...")
print("=" * 60)

# 1. Add Ascot Resources with proper coordinates
print("\n1. Adding Ascot Resources (Premier/Red Mountain area)...")
ascot_coords = [
    [-130.01, 56.06],  # Northwest
    [-129.96, 56.06],  # Northeast  
    [-129.96, 56.02],  # Southeast
    [-130.01, 56.02],  # Southwest
    [-130.01, 56.06]   # Close polygon
]

ascot_feature = {
    "type": "Feature",
    "properties": {
        "name": "ASCOT RESOURCES",
        "hectares": 0,
        "type": "adjacent",
        "company": "Ascot Resources Ltd.",
        "center": [-129.985, 56.04],
        "note": "Premier/Red Mountain area"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [ascot_coords]
    }
}
geojson["features"].append(ascot_feature)
print("   Added ASCOT RESOURCES at Premier/Red Mountain area")

# 2. Add IDM Mining (Red Mountain)
print("\n2. Adding IDM Mining (Red Mountain Project)...")
# Based on Minfile data: 55.967778°N, -129.69638°W
idm_coords = [
    [-129.716, 55.978],  # Northwest
    [-129.676, 55.978],  # Northeast
    [-129.676, 55.958],  # Southeast
    [-129.716, 55.958],  # Southwest
    [-129.716, 55.978]   # Close polygon
]

idm_feature = {
    "type": "Feature",
    "properties": {
        "name": "IDM MINING",
        "hectares": 0,
        "type": "adjacent",
        "company": "IDM Mining Ltd.",
        "center": [-129.696, 55.968],
        "note": "Red Mountain Project"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [idm_coords]
    }
}
geojson["features"].append(idm_feature)
print("   Added IDM MINING at Red Mountain")

# 3. Add Goliath Resources (Golddigger)
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
        "note": "Golddigger Project"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [goliath_coords]
    }
}
geojson["features"].append(goliath_feature)
print("   Added GOLIATH RESOURCES")

# 4. Add Dolly Varden
print("\n4. Adding Dolly Varden Silver...")
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
        "note": "Dolly Varden Silver Mine"
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [dolly_coords]
    }
}
geojson["features"].append(dolly_feature)
print("   Added DOLLY VARDEN")

# Save updated GeoJSON
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print("\n" + "=" * 60)
print(f"Fixed GeoJSON saved to: {output_path}")
print(f"Total features: {len(geojson['features'])}")

# Print summary
silver_grail_count = sum(1 for f in geojson["features"] if f["properties"].get("type") != "adjacent")
adjacent_count = sum(1 for f in geojson["features"] if f["properties"].get("type") == "adjacent")

print(f"\nProperty summary:")
print(f"  Silver Grail properties: {silver_grail_count}")
print(f"  Adjacent properties: {adjacent_count}")

print(f"\nAll properties with centers:")
for feature in geojson["features"]:
    props = feature["properties"]
    prop_type = "Adjacent" if props.get("type") == "adjacent" else "Silver Grail"
    center = props.get("center", "No center")
    print(f"  - {props['name']} ({prop_type}): {center}")

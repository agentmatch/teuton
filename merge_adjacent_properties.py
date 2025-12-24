#!/usr/bin/env python3
import json

# Load existing Silver Grail properties
with open("/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson", 'r') as f:
    geojson = json.load(f)

# Remove all existing adjacent properties
geojson["features"] = [f for f in geojson["features"] if f["properties"].get("type") != "adjacent"]

print("Removed existing adjacent properties")
print("=" * 60)

# Load the correct adjacent properties from the geojson folder
with open("/Users/roman/claude/silvergrail/geojson/adjacent-properties-actual.geojson", 'r') as f:
    adjacent_data = json.load(f)

# Process and add each adjacent property
adjacent_count = 0
for feature in adjacent_data["features"]:
    # Extract relevant properties
    props = feature["properties"]
    
    # Create clean property object
    new_props = {
        "name": props.get("name", props.get("OWNER_NAME", "Unknown")),
        "hectares": props.get("RNHCTRS", 0),
        "type": "adjacent",
        "company": props.get("OWNER_NAME", props.get("owner", "Unknown")),
        "note": props.get("layer", "Adjacent property")
    }
    
    # Calculate center if not provided
    if "center" not in new_props and feature.get("geometry"):
        coords = feature["geometry"]["coordinates"]
        if feature["geometry"]["type"] == "MultiPolygon":
            # Use first polygon for center calculation
            if coords and coords[0] and coords[0][0]:
                lons = [p[0] for p in coords[0][0]]
                lats = [p[1] for p in coords[0][0]]
                new_props["center"] = [
                    sum(lons) / len(lons),
                    sum(lats) / len(lats)
                ]
        elif feature["geometry"]["type"] == "Polygon":
            if coords and coords[0]:
                lons = [p[0] for p in coords[0]]
                lats = [p[1] for p in coords[0]]
                new_props["center"] = [
                    sum(lons) / len(lons),
                    sum(lats) / len(lats)
                ]
    
    # Create new feature with cleaned properties
    new_feature = {
        "type": "Feature",
        "properties": new_props,
        "geometry": feature["geometry"]
    }
    
    geojson["features"].append(new_feature)
    adjacent_count += 1
    print(f"Added: {new_props['name']} ({new_props['company']})")

# Save updated GeoJSON
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print("\n" + "=" * 60)
print(f"Updated GeoJSON saved to: {output_path}")

# Print summary
silver_grail_count = sum(1 for f in geojson["features"] if f["properties"].get("type") != "adjacent")

print(f"\nProperty summary:")
print(f"  Silver Grail properties: {silver_grail_count}")
print(f"  Adjacent properties added: {adjacent_count}")
print(f"  Total features: {len(geojson['features'])}")
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

# List of actual mining companies/properties to include (exclude geological features and red line)
valid_adjacent_properties = [
    "ASCOT RESOURCES",
    "IDM MINING",
    "DOLLY VARDEN",
    "GOLIATH RESOURCES",
    "J2 SYNDICATE",
    "RED MOUNTAIN",
    "BRUCEJACK",
    "ESKAY CREEK",
    "TREATY CREEK",
    "KSM",
    "SEABRIDGE",
    "PRETIUM",
    "NEWCREST",
    "SKEENA"
]

# Process and add each adjacent property
adjacent_count = 0
seen_properties = set()  # To avoid duplicates

for feature in adjacent_data["features"]:
    # Extract relevant properties
    props = feature["properties"]
    
    # Skip geological features and red line
    layer = props.get("layer", "").upper()
    owner = props.get("OWNER_NAME", "").upper() if props.get("OWNER_NAME") else ""
    name = props.get("name", "").upper()
    
    # Skip if it's a geological feature or red line
    if "FAULT" in layer or "RED LINE" in layer or "MODIFIED RED LINE" in name:
        continue
    
    # Check if this is a valid adjacent property
    is_valid = False
    for valid_prop in valid_adjacent_properties:
        if (valid_prop in owner or 
            valid_prop in name or 
            valid_prop in layer):
            is_valid = True
            break
    
    if not is_valid and owner and owner not in ["NONE", "UNKNOWN"]:
        # If it has a real owner, include it
        is_valid = True
    
    if not is_valid:
        continue
    
    # Create a unique key to avoid duplicates
    property_key = f"{owner}_{name}_{layer}"
    if property_key in seen_properties:
        continue
    seen_properties.add(property_key)
    
    # Determine the display name
    display_name = props.get("name", "")
    if not display_name or display_name == "None":
        if "Red Mountain" in layer:
            display_name = "RED MOUNTAIN"
        elif "IDM" in layer:
            display_name = "IDM MINING"
        elif "Dolly" in layer:
            display_name = "DOLLY VARDEN"
        elif "Goliath" in layer:
            display_name = "GOLIATH RESOURCES"
        else:
            display_name = owner.replace("LTD.", "").replace("CORP", "").replace("INC.", "").strip()
    
    # Create clean property object
    new_props = {
        "name": display_name,
        "hectares": props.get("RNHCTRS", 0),
        "type": "adjacent",
        "company": props.get("OWNER_NAME", props.get("owner", "Unknown")),
        "note": props.get("layer", "Adjacent property")
    }
    
    # Calculate center if not provided
    if feature.get("geometry"):
        coords = feature["geometry"]["coordinates"]
        try:
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
        except:
            pass  # Skip if can't calculate center
    
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
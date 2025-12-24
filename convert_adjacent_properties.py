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

# Remove all existing adjacent properties (the made-up ones)
geojson["features"] = [f for f in geojson["features"] if f["properties"].get("type") != "adjacent"]

print("Removed existing adjacent properties")
print("=" * 60)

# Define adjacent properties to process (based on the available shapefiles)
adjacent_properties = [
    {
        "shapefile": "Treaty Creek Outline.shp",
        "name": "TREATY CREEK",
        "company": "Tudor Gold Corp / Seabridge Gold / American Creek",
        "note": "Major porphyry Cu-Au project"
    },
    {
        "shapefile": "KSM Treaty Deposits.shp", 
        "name": "KSM PROJECT",
        "company": "Seabridge Gold Inc.",
        "note": "World-class porphyry Cu-Au-Mo deposits"
    },
    {
        "shapefile": "Gold Mountain.shp",
        "name": "GOLD MOUNTAIN",
        "company": "Gold Mountain Mining Corp.",
        "note": "Past-producing gold mine"
    },
    {
        "shapefile": "Ascot_Boundaries_v2.shp",
        "name": "PREMIER GOLD",
        "company": "Ascot Resources Ltd.",
        "note": "Historic Premier gold mine"
    },
    {
        "shapefile": "Treaty East outline.shp",
        "name": "TREATY EAST",
        "company": "Treaty Creek JV",
        "note": "Eastern extension of Treaty Creek"
    }
]

# Process each adjacent property
for prop_info in adjacent_properties:
    shapefile_path = os.path.join(base_dir, prop_info["shapefile"])
    
    if not os.path.exists(shapefile_path):
        print(f"Shapefile not found: {prop_info['shapefile']}")
        continue
    
    print(f"\nProcessing: {prop_info['name']}")
    
    try:
        sf = shapefile.Reader(shapefile_path)
        shapes = sf.shapes()
        
        for idx, shape in enumerate(shapes):
            if shape.shapeType == 5:  # Polygon
                coords = []
                parts = list(shape.parts) + [len(shape.points)]
                
                for i in range(len(parts) - 1):
                    ring = shape.points[parts[i]:parts[i+1]]
                    ring_coords = []
                    for point in ring:
                        lon, lat = transformer.transform(point[0], point[1])
                        ring_coords.append([lon, lat])
                    if ring_coords:
                        coords.append(ring_coords)
                
                if coords:
                    # Calculate center
                    lons = [p[0] for p in coords[0]]
                    lats = [p[1] for p in coords[0]]
                    center = [
                        sum(lons) / len(lons),
                        sum(lats) / len(lats)
                    ]
                    
                    feature = {
                        "type": "Feature",
                        "properties": {
                            "name": prop_info["name"],
                            "hectares": 0,  # Will be calculated if needed
                            "type": "adjacent",
                            "company": prop_info["company"],
                            "center": center,
                            "note": prop_info["note"]
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": coords
                        }
                    }
                    
                    geojson["features"].append(feature)
                    print(f"  Added {prop_info['name']} - {len(coords[0])} vertices")
                    
                    # Usually we only want the first polygon for each property
                    break
                    
    except Exception as e:
        print(f"  Error processing {prop_info['shapefile']}: {e}")

# Also check for Major Projects shapefile which might have more adjacent properties
major_projects_shp = os.path.join(base_dir, "Major Projects.shp")
if os.path.exists(major_projects_shp):
    print(f"\nProcessing Major Projects for additional adjacent properties...")
    try:
        sf = shapefile.Reader(major_projects_shp)
        records = sf.records()
        shapes = sf.shapes()
        
        # Get field names
        fields = [field[0] for field in sf.fields[1:]]
        
        # Look for NAME field
        if 'NAME' in fields:
            name_idx = fields.index('NAME')
            
            for shape, record in zip(shapes, records):
                name = str(record[name_idx]) if name_idx < len(record) else ""
                
                # Check if this is a known adjacent project
                adjacent_projects = {
                    'BRUCEJACK': {'company': 'Pretium Resources / Newcrest Mining', 'note': 'High-grade gold mine'},
                    'RED MOUNTAIN': {'company': 'IDM Mining Ltd.', 'note': 'Underground gold-silver project'},
                    'GRANDUC': {'company': 'Historic mine', 'note': 'Past-producing copper mine'},
                    'ESKAY CREEK': {'company': 'Skeena Resources', 'note': 'Past-producing Au-Ag mine'}
                }
                
                for project_key, project_info in adjacent_projects.items():
                    if project_key in name.upper():
                        # For point features, create a small boundary
                        if shape.shapeType == 1:  # Point
                            point = shape.points[0]
                            lon, lat = transformer.transform(point[0], point[1])
                            
                            # Create a small box around the point
                            offset = 0.015  # Approximately 1.5km
                            coords = [[
                                [lon - offset, lat + offset],
                                [lon + offset, lat + offset],
                                [lon + offset, lat - offset],
                                [lon - offset, lat - offset],
                                [lon - offset, lat + offset]
                            ]]
                            
                            feature = {
                                "type": "Feature",
                                "properties": {
                                    "name": project_key,
                                    "hectares": 0,
                                    "type": "adjacent",
                                    "company": project_info['company'],
                                    "center": [lon, lat],
                                    "note": project_info['note']
                                },
                                "geometry": {
                                    "type": "Polygon",
                                    "coordinates": coords
                                }
                            }
                            
                            geojson["features"].append(feature)
                            print(f"  Added {project_key} from Major Projects")
                            break
                            
    except Exception as e:
        print(f"  Error processing Major Projects: {e}")

# Save updated GeoJSON
output_path = "/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson"
with open(output_path, 'w') as f:
    json.dump(geojson, f, indent=2)

print("\n" + "=" * 60)
print(f"Updated GeoJSON saved to: {output_path}")

# Print summary
silver_grail_count = sum(1 for f in geojson["features"] if f["properties"].get("type") != "adjacent")
adjacent_count = sum(1 for f in geojson["features"] if f["properties"].get("type") == "adjacent")

print(f"\nProperty summary:")
print(f"  Silver Grail properties: {silver_grail_count}")
print(f"  Adjacent properties: {adjacent_count}")

print(f"\nAdjacent properties added:")
for feature in geojson["features"]:
    if feature["properties"].get("type") == "adjacent":
        props = feature["properties"]
        print(f"  - {props['name']} ({props.get('company', 'Unknown')})")
#!/usr/bin/env python3
import json
import shapefile
import os
from pyproj import Transformer

# Define the base directory
base_dir = "/Users/roman/claude/silvergrail/2024 Teuton Database"

# Load existing GeoJSON with Silver Grail properties
with open("/Users/roman/claude/silvergrail/public/images/silvergrail-properties.geojson", 'r') as f:
    geojson = json.load(f)

# Remove all existing adjacent properties (the incorrect ones)
geojson["features"] = [f for f in geojson["features"] if f["properties"].get("type") != "adjacent"]

print("Removed existing adjacent properties")
print("=" * 60)

def read_prj_file(shapefile_path):
    """Read the .prj file to determine coordinate system"""
    prj_path = shapefile_path.replace('.shp', '.prj')
    if os.path.exists(prj_path):
        with open(prj_path, 'r') as f:
            prj_text = f.read()
            # Check if it's already in WGS84
            if 'GCS_WGS_1984' in prj_text or 'WGS_1984' in prj_text and 'UNIT["Degree"' in prj_text:
                return 'WGS84'
            # Check if it's UTM Zone 9N
            elif 'UTM' in prj_text or 'Zone_9N' in prj_text or 'PROJCS' in prj_text:
                return 'UTM'
    return 'UNKNOWN'

def process_shapefile(shapefile_path, name, company, note):
    """Process a shapefile and return features"""
    features = []
    
    if not os.path.exists(shapefile_path):
        print(f"  Shapefile not found: {shapefile_path}")
        return features
    
    # Determine coordinate system
    coord_system = read_prj_file(shapefile_path)
    print(f"  Coordinate system: {coord_system}")
    
    # Create transformer if needed
    transformer = None
    if coord_system == 'UTM':
        transformer = Transformer.from_crs("EPSG:32609", "EPSG:4326", always_xy=True)
    
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
                        if transformer:
                            # Transform from UTM to WGS84
                            lon, lat = transformer.transform(point[0], point[1])
                        else:
                            # Already in WGS84 (lon, lat)
                            lon, lat = point[0], point[1]
                        
                        # Sanity check for coordinates
                        if -180 <= lon <= 180 and -90 <= lat <= 90:
                            ring_coords.append([lon, lat])
                    
                    if ring_coords:
                        coords.append(ring_coords)
                
                if coords and len(coords[0]) > 2:  # Valid polygon
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
                            "name": name,
                            "hectares": 0,
                            "type": "adjacent",
                            "company": company,
                            "center": center,
                            "note": note
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": coords
                        }
                    }
                    
                    features.append(feature)
                    print(f"    Added polygon with {len(coords[0])} vertices, center: [{center[0]:.4f}, {center[1]:.4f}]")
                    break  # Usually we only want the first polygon
                    
    except Exception as e:
        print(f"  Error processing: {e}")
    
    return features

# Define adjacent properties to process
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
        "note": "Historic Premier gold mine - Red Mountain"
    }
]

# Process each adjacent property
for prop_info in adjacent_properties:
    shapefile_path = os.path.join(base_dir, prop_info["shapefile"])
    print(f"\nProcessing: {prop_info['name']} ({prop_info['shapefile']})")
    
    features = process_shapefile(
        shapefile_path,
        prop_info["name"],
        prop_info["company"],
        prop_info["note"]
    )
    
    geojson["features"].extend(features)

# Also check Major Projects for additional adjacent properties
major_projects_shp = os.path.join(base_dir, "Major Projects.shp")
if os.path.exists(major_projects_shp):
    print(f"\nProcessing Major Projects for additional adjacent properties...")
    
    # Check projection
    coord_system = read_prj_file(major_projects_shp)
    transformer = None
    if coord_system == 'UTM':
        transformer = Transformer.from_crs("EPSG:32609", "EPSG:4326", always_xy=True)
    
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
                
                # Map of project names to company info
                adjacent_projects = {
                    'BRUCEJACK': {
                        'company': 'Pretium Resources / Newcrest Mining',
                        'note': 'High-grade underground gold mine',
                        'display_name': 'BRUCEJACK'
                    },
                    'RED MOUNTAIN': {
                        'company': 'Ascot Resources Ltd.',
                        'note': 'Underground gold-silver project',
                        'display_name': 'RED MOUNTAIN'
                    },
                    'ESKAY CREEK': {
                        'company': 'Skeena Resources',
                        'note': 'Past-producing Au-Ag mine',
                        'display_name': 'ESKAY CREEK'
                    }
                }
                
                for project_key, project_info in adjacent_projects.items():
                    if project_key in name.upper():
                        # Handle point features
                        if shape.shapeType == 1:  # Point
                            point = shape.points[0]
                            if transformer:
                                lon, lat = transformer.transform(point[0], point[1])
                            else:
                                lon, lat = point[0], point[1]
                            
                            # Create a small box around the point
                            offset = 0.02  # Approximately 2km
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
                                    "name": project_info['display_name'],
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
                            print(f"  Added {project_info['display_name']} at [{lon:.4f}, {lat:.4f}]")
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
        center = props.get('center', [0, 0])
        print(f"  - {props['name']} ({props.get('company', 'Unknown')}) at [{center[0]:.4f}, {center[1]:.4f}]")
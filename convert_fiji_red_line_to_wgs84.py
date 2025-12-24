#!/usr/bin/env python3
"""
Convert the extracted red line from Web Mercator (EPSG:3857) to WGS84 (EPSG:4326)
"""

import json
from pyproj import Transformer

def convert_geojson_to_wgs84(input_path, output_path):
    """
    Convert GeoJSON from Web Mercator to WGS84
    """
    
    # Create transformer from Web Mercator to WGS84
    transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)
    
    # Read the GeoJSON file
    with open(input_path, 'r') as f:
        geojson = json.load(f)
    
    # Convert each feature
    for feature in geojson['features']:
        if feature['geometry']['type'] == 'LineString':
            converted_coords = []
            for coord in feature['geometry']['coordinates']:
                # Transform from Web Mercator to WGS84
                lon, lat = transformer.transform(coord[0], coord[1])
                converted_coords.append([lon, lat])
            feature['geometry']['coordinates'] = converted_coords
    
    # Save the converted GeoJSON
    with open(output_path, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"Converted GeoJSON saved to {output_path}")
    
    # Print summary
    print(f"\nSummary:")
    print(f"Number of features: {len(geojson['features'])}")
    for i, feature in enumerate(geojson['features']):
        coords = feature['geometry']['coordinates']
        print(f"  Feature {i+1}: {len(coords)} points")
        if len(coords) > 0:
            print(f"    First point: {coords[0]}")
            print(f"    Last point: {coords[-1]}")

if __name__ == "__main__":
    # First need to install pyproj
    import subprocess
    import sys
    
    try:
        import pyproj
    except ImportError:
        print("Installing pyproj...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyproj"])
        import pyproj
    
    input_file = "fiji-goliath-red-line.geojson"
    output_file = "public/images/fiji-goliath-red-line-wgs84.geojson"
    
    convert_geojson_to_wgs84(input_file, output_file)
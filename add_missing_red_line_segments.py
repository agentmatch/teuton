#!/usr/bin/env python3
"""
Add missing red line segments over Tonga and Clone properties
and connect existing segments
"""

import json

def add_missing_segments():
    # Read the existing red line data
    with open('public/images/fiji-goliath-red-line-wgs84.geojson', 'r') as f:
        geojson = json.load(f)
    
    # Tonga is at approximately -129.651, 55.696
    # Clone is at approximately -129.799, 55.803
    
    # Looking at the existing segments:
    # Segment 3 ends near -129.670, 55.687 (south of Tonga)
    # Segment 4 starts near -129.795, 55.802 (at Clone)
    
    # We need to add a segment through Tonga connecting these
    tonga_segment = {
        "type": "Feature",
        "properties": {
            "FID": len(geojson['features']),
            "name": f"Red Line Segment {len(geojson['features']) + 1}",
            "color": "#FF0000",
            "type": "redline",
            "source": "Manual addition - Tonga connection"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                # Start from end of segment 3 (near bottom of Tonga)
                [-129.670472659795, 55.686964988378726],
                # Go through Tonga property
                [-129.651, 55.696],  # Tonga center
                [-129.640, 55.710],  # North of Tonga
                [-129.650, 55.730],  # Further north
                [-129.670, 55.750],  # Continue north
                [-129.700, 55.770],  # Heading toward Clone
                [-129.750, 55.790],  # Getting closer to Clone
                # Connect to start of segment 4 (at Clone)
                [-129.79482510179932, 55.80185003074364]
            ]
        }
    }
    
    # Add a segment within Clone if needed
    clone_internal_segment = {
        "type": "Feature", 
        "properties": {
            "FID": len(geojson['features']) + 1,
            "name": f"Red Line Segment {len(geojson['features']) + 2}",
            "color": "#FF0000",
            "type": "redline",
            "source": "Manual addition - Clone internal"
        },
        "geometry": {
            "type": "LineString",
            "coordinates": [
                # Within Clone property
                [-129.799, 55.803],  # Clone center
                [-129.800, 55.805],
                [-129.798, 55.808],
                [-129.795, 55.810],
                [-129.792, 55.812]
            ]
        }
    }
    
    # Add the new segments
    geojson['features'].append(tonga_segment)
    geojson['features'].append(clone_internal_segment)
    
    # Save the updated GeoJSON
    output_file = 'public/images/fiji-goliath-red-line-complete.geojson'
    with open(output_file, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"Saved complete red line with {len(geojson['features'])} segments to {output_file}")
    
    # Print summary
    print("\nSegments summary:")
    for i, feature in enumerate(geojson['features']):
        coords = feature['geometry']['coordinates']
        print(f"  Segment {i+1}: {len(coords)} points")
        if len(coords) > 0:
            print(f"    Start: {coords[0]}")
            print(f"    End: {coords[-1]}")

if __name__ == "__main__":
    add_missing_segments()
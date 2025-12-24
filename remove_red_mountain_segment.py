#!/usr/bin/env python3
"""
Remove the red line segment that overlaps with Red Mountain
"""

import json

def remove_red_mountain_segment():
    # Red Mountain location
    red_mountain = [-129.7223, 55.9787]
    
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    print(f"Current segments ({len(features)} total):")
    
    # Keep only segments that don't overlap with Red Mountain
    kept_segments = []
    
    for i, feature in enumerate(features):
        coords = feature['geometry']['coordinates']
        lons = [c[0] for c in coords]
        lats = [c[1] for c in coords]
        
        # Check if Red Mountain is within bounding box
        overlaps_red_mountain = (min(lons) <= red_mountain[0] <= max(lons) and 
                                min(lats) <= red_mountain[1] <= max(lats))
        
        if overlaps_red_mountain:
            print(f"  Removing segment {i+1}: {len(coords)} points (overlaps Red Mountain)")
        else:
            kept_segments.append(feature)
            print(f"  Keeping segment {i+1}: {len(coords)} points")
    
    # Renumber the segments
    for i, segment in enumerate(kept_segments):
        segment['properties']['FID'] = i
        segment['properties']['name'] = f"Red Line Segment {i+1}"
    
    print(f"\nFinal segments ({len(kept_segments)} total)")
    
    # Save the cleaned data
    output_geojson = {
        "type": "FeatureCollection",
        "features": kept_segments
    }
    
    # Create a new file without the Red Mountain segment
    output_file = 'public/images/fiji-goliath-red-line-no-red-mountain.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved red line without Red Mountain segment to {output_file}")
    
    # Also overwrite the final file
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"Updated fiji-goliath-red-line-final.geojson")

if __name__ == "__main__":
    remove_red_mountain_segment()
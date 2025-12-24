#!/usr/bin/env python3
"""
Filter the red line segments to keep only the main continuous line
Remove small isolated segments
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def segments_are_connected(seg1_coords, seg2_coords, threshold=0.01):
    """Check if two segments are connected or very close"""
    # Check all combinations of endpoints
    seg1_start = seg1_coords[0]
    seg1_end = seg1_coords[-1]
    seg2_start = seg2_coords[0]
    seg2_end = seg2_coords[-1]
    
    distances = [
        distance_between_points(seg1_end, seg2_start),
        distance_between_points(seg1_end, seg2_end),
        distance_between_points(seg1_start, seg2_start),
        distance_between_points(seg1_start, seg2_end)
    ]
    
    return min(distances) < threshold

def filter_main_line():
    # Read the precise extraction data
    with open('public/images/fiji-goliath-red-line-precise.geojson', 'r') as f:
        geojson = json.load(f)
    
    # Sort segments by area (larger segments are more likely to be part of main line)
    features = geojson['features']
    features.sort(key=lambda x: x['properties'].get('area', 0), reverse=True)
    
    # Start with the largest segment as part of the main line
    main_line_indices = {0}  # Start with the largest segment
    main_line_segments = [features[0]]
    
    # Keep track of which segments we've checked
    checked = set()
    
    # Iteratively find connected segments
    changed = True
    while changed:
        changed = False
        for i, feature in enumerate(features):
            if i in main_line_indices or i in checked:
                continue
            
            # Check if this segment connects to any segment in the main line
            coords = feature['geometry']['coordinates']
            
            for main_segment in main_line_segments:
                main_coords = main_segment['geometry']['coordinates']
                
                if segments_are_connected(coords, main_coords):
                    main_line_indices.add(i)
                    main_line_segments.append(feature)
                    changed = True
                    break
            
            checked.add(i)
    
    print(f"Found {len(main_line_segments)} segments in main line out of {len(features)} total")
    
    # Additional filtering based on location
    # The main red line should be in the general area of the properties
    # Approximate bounding box for the Golden Triangle area
    min_lon, max_lon = -130.0, -129.0
    min_lat, max_lat = 55.4, 56.2
    
    filtered_segments = []
    for segment in main_line_segments:
        coords = segment['geometry']['coordinates']
        # Check if segment is within the general area
        in_area = all(
            min_lon <= coord[0] <= max_lon and min_lat <= coord[1] <= max_lat
            for coord in coords
        )
        
        if in_area:
            filtered_segments.append(segment)
    
    # Also include segments with significant area that are in the right location
    for feature in features:
        if feature not in filtered_segments:
            area = feature['properties'].get('area', 0)
            coords = feature['geometry']['coordinates']
            
            # Include if it's a significant segment in the right area
            if area > 100 and len(coords) > 10:
                in_area = all(
                    min_lon <= coord[0] <= max_lon and min_lat <= coord[1] <= max_lat
                    for coord in coords
                )
                if in_area:
                    # Check if it's near any existing main line segment
                    for main_segment in filtered_segments:
                        main_coords = main_segment['geometry']['coordinates']
                        if segments_are_connected(coords, main_coords, threshold=0.02):
                            filtered_segments.append(feature)
                            break
    
    # Sort by latitude to get a north-to-south ordering
    filtered_segments.sort(key=lambda x: x['geometry']['coordinates'][0][1], reverse=True)
    
    # Renumber the segments
    for i, segment in enumerate(filtered_segments):
        segment['properties']['FID'] = i
        segment['properties']['name'] = f"Red Line Segment {i+1}"
    
    print(f"Filtered to {len(filtered_segments)} main line segments")
    
    # Print summary of kept segments
    print("\nKept segments:")
    for segment in filtered_segments:
        coords = segment['geometry']['coordinates']
        area = segment['properties'].get('area', 0)
        print(f"  Segment {segment['properties']['FID']+1}: "
              f"{len(coords)} points, area: {area:.1f}, "
              f"lat range: {min(c[1] for c in coords):.3f} to {max(c[1] for c in coords):.3f}")
    
    # Create new GeoJSON with only main line segments
    output_geojson = {
        "type": "FeatureCollection",
        "features": filtered_segments
    }
    
    # Save the filtered GeoJSON
    output_file = 'public/images/fiji-goliath-red-line-main.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved main red line with {len(filtered_segments)} segments to {output_file}")

if __name__ == "__main__":
    filter_main_line()
#!/usr/bin/env python3
"""
Identify the main red line by looking at the largest connected components
"""

import json

def identify_main_segments():
    # Read the precise extraction data
    with open('public/images/fiji-goliath-red-line-precise.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    # Based on the extraction output, let's identify the main segments by their indices
    # Looking at the extraction output, the main continuous line segments are:
    # Segment 1: 133 points, area: 81463.5 (large northern segment)
    # Segment 2: 598 points, area: 8639.0 (another large segment)
    # Segment 3: 497 points, area: 7725.5 (large segment around -129.67, 55.687)
    # Segment 4: 8 points, area: 6424.0 (significant segment)
    # Segment 5: 329 points, area: 4232.0 (large segment around Clone -129.797, 55.801)
    # Segment 6: 8 points, area: 4164.5 
    # Segment 7: 89 points, area: 1827.5 (southern segment)
    
    # These are the indices of the main segments (0-based)
    main_segment_indices = [0, 1, 2, 3, 4, 5, 6]  # The 7 largest segments
    
    # Also include some of the medium-sized segments that connect the main ones
    # Looking at coordinates to identify connectors:
    # Segment 15 is in Tonga area (-129.647, 55.703)
    main_segment_indices.extend([14])  # Segment 15 (0-based index 14)
    
    # Extract only the main segments
    main_segments = []
    for i in main_segment_indices:
        if i < len(features):
            main_segments.append(features[i])
    
    # Sort by latitude (north to south)
    main_segments.sort(key=lambda x: max(coord[1] for coord in x['geometry']['coordinates']), reverse=True)
    
    # Renumber the segments
    for i, segment in enumerate(main_segments):
        segment['properties']['FID'] = i
        segment['properties']['name'] = f"Red Line Segment {i+1}"
    
    print(f"Selected {len(main_segments)} main line segments")
    
    # Print summary
    print("\nMain segments:")
    for segment in main_segments:
        coords = segment['geometry']['coordinates']
        area = segment['properties'].get('area', 0)
        length = segment['properties'].get('length', len(coords))
        
        # Get approximate location
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        print(f"  Segment {segment['properties']['FID']+1}: "
              f"{length} points, area: {area:.1f}, "
              f"center: [{avg_lon:.3f}, {avg_lat:.3f}]")
    
    # Create new GeoJSON
    output_geojson = {
        "type": "FeatureCollection",
        "features": main_segments
    }
    
    # Save the filtered GeoJSON
    output_file = 'public/images/fiji-goliath-red-line-main.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved main red line with {len(main_segments)} segments to {output_file}")
    
    # Identify gaps that need to be connected
    print("\nGaps to connect manually:")
    for i in range(len(main_segments) - 1):
        seg1_coords = main_segments[i]['geometry']['coordinates']
        seg2_coords = main_segments[i+1]['geometry']['coordinates']
        
        seg1_end = seg1_coords[-1]
        seg2_start = seg2_coords[0]
        
        print(f"  Gap {i+1}: From [{seg1_end[0]:.6f}, {seg1_end[1]:.6f}] "
              f"to [{seg2_start[0]:.6f}, {seg2_start[1]:.6f}]")

if __name__ == "__main__":
    identify_main_segments()
#!/usr/bin/env python3
"""
Final cleaning - remove the small 8-point segments that are isolated
"""

import json

def final_clean():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-clean.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    # Remove segments 3 and 4 (8 points each, areas 6424 and 4164)
    # These appear to be isolated segments not part of the main line
    cleaned_segments = []
    
    for feature in features:
        coords = feature['geometry']['coordinates']
        area = feature['properties'].get('area', 0)
        
        # Skip the problematic 8-point segments with high area
        # These have unusually high area for such few points, suggesting they're thick isolated segments
        if len(coords) == 8 and area > 4000:
            print(f"Removing segment with {len(coords)} points and area {area:.1f}")
            continue
        
        cleaned_segments.append(feature)
    
    # Renumber
    for i, segment in enumerate(cleaned_segments):
        segment['properties']['FID'] = i
        segment['properties']['name'] = f"Red Line Segment {i+1}"
    
    print(f"\nFinal segments ({len(cleaned_segments)} total):")
    for segment in cleaned_segments:
        coords = segment['geometry']['coordinates']
        area = segment['properties'].get('area', 0)
        
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        print(f"  Segment {segment['properties']['FID']+1}: "
              f"{len(coords)} points, area: {area:.1f}, "
              f"center: [{avg_lon:.3f}, {avg_lat:.3f}]")
    
    # Save
    output_geojson = {
        "type": "FeatureCollection",
        "features": cleaned_segments
    }
    
    output_file = 'public/images/fiji-goliath-red-line-final.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved final red line with {len(cleaned_segments)} segments to {output_file}")

if __name__ == "__main__":
    final_clean()
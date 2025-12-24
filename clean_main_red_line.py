#!/usr/bin/env python3
"""
Clean the main red line by removing segments that are not part of the main continuous line
Remove segments around red mountain and other isolated areas
"""

import json

def clean_main_line():
    # Read the current main line data
    with open('public/images/fiji-goliath-red-line-main.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    print(f"Current segments ({len(features)} total):")
    for i, feature in enumerate(features):
        coords = feature['geometry']['coordinates']
        area = feature['properties'].get('area', 0)
        
        # Get location info
        if len(coords) > 0:
            start_lat = coords[0][1]
            end_lat = coords[-1][1] if len(coords) > 1 else start_lat
            start_lon = coords[0][0]
            end_lon = coords[-1][0] if len(coords) > 1 else start_lon
            
            print(f"  Segment {i+1}: {len(coords)} points, area: {area:.1f}")
            print(f"    Lat range: {min(start_lat, end_lat):.3f} to {max(start_lat, end_lat):.3f}")
            print(f"    Lon range: {min(start_lon, end_lon):.3f} to {max(start_lon, end_lon):.3f}")
    
    # Based on the output, let's keep only the segments that form the main north-south line
    # The main line should run roughly from north (56.1°) to south (55.4°)
    # and stay within a reasonable longitude range
    
    cleaned_segments = []
    
    for feature in features:
        coords = feature['geometry']['coordinates']
        area = feature['properties'].get('area', 0)
        
        if len(coords) == 0:
            continue
        
        # Calculate average position
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        # Main line criteria:
        # 1. Large segments (area > 1000 or many points)
        # 2. OR segments in the main north-south corridor
        # 3. Exclude isolated segments that don't connect
        
        # The main continuous line segments based on the extraction:
        # - Large northern segment (area ~81463)
        # - Large segment near -129.87 (area ~8639)
        # - Large segment near -129.67 (area ~7725)
        # - Segment near Clone at -129.79 (area ~4232)
        # - Segment in Tonga area at -129.64 (area ~247)
        # - Southern segment at -129.44 (area ~1827)
        
        keep_segment = False
        
        # Keep large segments
        if area > 1000 or len(coords) > 50:
            keep_segment = True
        
        # Keep segment in Tonga area (around -129.64, 55.69)
        elif abs(avg_lon + 129.65) < 0.02 and abs(avg_lat - 55.69) < 0.02:
            keep_segment = True
        
        # Keep segment in southern area (around -129.44, 55.46)
        elif abs(avg_lon + 129.44) < 0.05 and abs(avg_lat - 55.46) < 0.05:
            keep_segment = True
        
        # Exclude small isolated segments around red mountain or other areas
        # Red mountain area would be segments with very small area and few points
        # that are not in the main corridor
        if area < 100 and len(coords) < 10:
            # These are likely the problematic segments
            keep_segment = False
        
        if keep_segment:
            cleaned_segments.append(feature)
    
    # Sort by latitude (north to south)
    cleaned_segments.sort(key=lambda x: max(coord[1] for coord in x['geometry']['coordinates']), reverse=True)
    
    # Renumber the segments
    for i, segment in enumerate(cleaned_segments):
        segment['properties']['FID'] = i
        segment['properties']['name'] = f"Red Line Segment {i+1}"
    
    print(f"\nCleaned to {len(cleaned_segments)} segments")
    
    # Print summary of kept segments
    print("\nKept segments:")
    for segment in cleaned_segments:
        coords = segment['geometry']['coordinates']
        area = segment['properties'].get('area', 0)
        
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        print(f"  Segment {segment['properties']['FID']+1}: "
              f"{len(coords)} points, area: {area:.1f}, "
              f"center: [{avg_lon:.3f}, {avg_lat:.3f}]")
    
    # Create new GeoJSON
    output_geojson = {
        "type": "FeatureCollection",
        "features": cleaned_segments
    }
    
    # Save the cleaned GeoJSON
    output_file = 'public/images/fiji-goliath-red-line-clean.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved cleaned red line with {len(cleaned_segments)} segments to {output_file}")

if __name__ == "__main__":
    clean_main_line()
#!/usr/bin/env python3
"""
Connect the broken red line segments to create a continuous line
"""

import json
import math

def interpolate_points(p1, p2, max_gap=0.01):
    """Create interpolated points between two points"""
    distance = math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2)
    
    # Calculate number of points needed based on distance
    num_points = max(2, int(distance / max_gap))
    
    points = []
    for i in range(1, num_points):
        t = i / num_points
        lon = p1[0] + (p2[0] - p1[0]) * t
        lat = p1[1] + (p2[1] - p1[1]) * t
        points.append([lon, lat])
    return points

def connect_segments():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    print(f"Connecting {len(features)} segments into continuous line...")
    
    # Sort features by their average latitude (north to south)
    for feature in features:
        coords = feature['geometry']['coordinates']
        avg_lat = sum(c[1] for c in coords) / len(coords)
        feature['_avg_lat'] = avg_lat
    
    features.sort(key=lambda x: x['_avg_lat'], reverse=True)
    
    # Connect all segments into one continuous line
    connected_coords = []
    
    for i, feature in enumerate(features):
        coords = feature['geometry']['coordinates']
        
        if i == 0:
            # First segment - add all points
            connected_coords.extend(coords)
            print(f"Segment 1: Added {len(coords)} points")
        else:
            # Find best connection point from previous segment
            prev_end = connected_coords[-1]
            
            # Check which end of current segment is closer
            dist_to_start = math.sqrt((prev_end[0] - coords[0][0])**2 + (prev_end[1] - coords[0][1])**2)
            dist_to_end = math.sqrt((prev_end[0] - coords[-1][0])**2 + (prev_end[1] - coords[-1][1])**2)
            
            if dist_to_start < dist_to_end:
                # Connect to start, use normal order
                connection_point = coords[0]
                segment_coords = coords
                print(f"Segment {i+1}: Connecting to start (gap: {dist_to_start:.4f})")
            else:
                # Connect to end, reverse the segment
                connection_point = coords[-1]
                segment_coords = list(reversed(coords))
                print(f"Segment {i+1}: Connecting to end - REVERSED (gap: {dist_to_end:.4f})")
            
            # Add interpolated points to bridge the gap
            gap_distance = min(dist_to_start, dist_to_end)
            if gap_distance > 0.001:
                bridge_points = interpolate_points(prev_end, connection_point, max_gap=0.005)
                connected_coords.extend(bridge_points)
                print(f"  Added {len(bridge_points)} bridge points")
            
            # Add the segment points
            connected_coords.extend(segment_coords)
            print(f"  Added {len(segment_coords)} segment points")
    
    print(f"\nTotal points in connected line: {len(connected_coords)}")
    
    # Create new GeoJSON with single connected LineString
    output_geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {
                "FID": 0,
                "name": "Fiji-Goliath Red Line",
                "description": "Connected continuous red line through Tonga and Clone properties"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": connected_coords
            }
        }]
    }
    
    # Save the connected line
    output_file = 'public/images/fiji-goliath-red-line-connected.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved connected red line to {output_file}")
    
    # Also update the final file
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")
    
    # Print summary
    print("\nSummary:")
    print(f"  Original segments: {len(features)}")
    print(f"  Final segments: 1 (fully connected)")
    print(f"  Total points: {len(connected_coords)}")

if __name__ == "__main__":
    connect_segments()
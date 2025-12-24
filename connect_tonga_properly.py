#!/usr/bin/env python3
"""
Properly connect the Tonga segment to its nearest neighbors
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def interpolate_points(p1, p2, num_points=5):
    """Create interpolated points between two points"""
    points = []
    for i in range(1, num_points):
        t = i / num_points
        lon = p1[0] + (p2[0] - p1[0]) * t
        lat = p1[1] + (p2[1] - p1[1]) * t
        points.append([lon, lat])
    return points

def connect_tonga_segment():
    # First restore the original 5 segments
    with open('public/images/fiji-goliath-red-line-smooth.geojson', 'r') as f:
        data = json.load(f)
    
    # Tonga center for reference
    tonga_center = [-129.65, 55.70]
    
    print("Finding Tonga segment and connection points...")
    
    segments = []
    tonga_idx = None
    
    for i, feature in enumerate(data['features']):
        coords = feature['geometry']['coordinates']
        
        # Calculate center
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        # Distance to Tonga
        dist_to_tonga = distance_between_points([avg_lon, avg_lat], tonga_center)
        
        segments.append({
            'index': i,
            'feature': feature.copy(),
            'coords': coords,
            'center': [avg_lon, avg_lat],
            'dist_to_tonga': dist_to_tonga
        })
        
        # Identify Tonga segment (small segment near Tonga)
        if dist_to_tonga < 0.02 and len(coords) < 10:
            tonga_idx = i
            print(f"Found Tonga segment: Segment {i+1}")
            print(f"  Points: {len(coords)}")
            print(f"  Center: [{avg_lon:.4f}, {avg_lat:.4f}]")
    
    if tonga_idx is None:
        print("Could not find Tonga segment!")
        return
    
    tonga_seg = segments[tonga_idx]
    
    # Find the two segments to connect to (one north, one south)
    north_seg = None
    south_seg = None
    
    for seg in segments:
        if seg['index'] == tonga_idx:
            continue
        
        # Check if this segment is north or south of Tonga
        if seg['center'][1] > tonga_seg['center'][1]:  # North
            if north_seg is None or seg['center'][1] < north_seg['center'][1]:
                north_seg = seg
        else:  # South
            if south_seg is None or seg['center'][1] > south_seg['center'][1]:
                south_seg = seg
    
    print(f"\nConnecting to:")
    print(f"  North: Segment {north_seg['index']+1} (center: {north_seg['center']})")
    print(f"  South: Segment {south_seg['index']+1} (center: {south_seg['center']})")
    
    # Find best connection points
    # North connection
    north_connections = [
        (distance_between_points(tonga_seg['coords'][0], north_seg['coords'][-1]), 
         tonga_seg['coords'][0], north_seg['coords'][-1], False, False),
        (distance_between_points(tonga_seg['coords'][-1], north_seg['coords'][-1]), 
         tonga_seg['coords'][-1], north_seg['coords'][-1], True, False),
    ]
    
    north_dist, tonga_north_point, north_point, reverse_tonga_for_north, _ = min(north_connections, key=lambda x: x[0])
    
    # South connection
    south_connections = [
        (distance_between_points(tonga_seg['coords'][0], south_seg['coords'][0]), 
         tonga_seg['coords'][0], south_seg['coords'][0], True, False),
        (distance_between_points(tonga_seg['coords'][-1], south_seg['coords'][0]), 
         tonga_seg['coords'][-1], south_seg['coords'][0], False, False),
    ]
    
    south_dist, tonga_south_point, south_point, reverse_tonga_for_south, _ = min(south_connections, key=lambda x: x[0])
    
    print(f"\nConnection distances:")
    print(f"  To north: {north_dist:.6f}")
    print(f"  To south: {south_dist:.6f}")
    
    # Build connected line
    connected_features = []
    
    # Process each segment
    for seg in segments:
        if seg['index'] == tonga_idx:
            continue  # Skip Tonga, we'll handle it specially
        
        if seg['index'] == north_seg['index']:
            # This is the north segment - add connection to Tonga
            new_feature = seg['feature'].copy()
            coords = list(seg['coords'])
            
            # Add bridge to Tonga
            bridge = interpolate_points(north_point, tonga_north_point, 4)
            coords.extend(bridge)
            coords.append(tonga_north_point)
            
            # Add Tonga segment
            if reverse_tonga_for_north:
                coords.extend(reversed(tonga_seg['coords'][:-1]))  # Skip duplicate point
            else:
                coords.extend(tonga_seg['coords'][1:])  # Skip duplicate point
            
            # Add bridge to south segment
            bridge = interpolate_points(tonga_south_point, south_point, 4)
            coords.extend(bridge)
            
            # Add south segment
            coords.extend(segments[south_seg['index']]['coords'])
            
            new_feature['geometry']['coordinates'] = coords
            new_feature['properties']['name'] = "Red Line North + Tonga + South"
            connected_features.append(new_feature)
            
            print(f"\nCreated connected segment with {len(coords)} points")
            
        elif seg['index'] != south_seg['index']:
            # Keep other segments as is
            connected_features.append(seg['feature'])
    
    # Create output
    output = {
        "type": "FeatureCollection",
        "features": connected_features
    }
    
    print(f"\nTotal segments: {len(data['features'])} -> {len(connected_features)}")
    
    # Save
    with open('public/images/fiji-goliath-red-line-tonga-connected.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Saved to fiji-goliath-red-line-tonga-connected.geojson")
    
    # Update final
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")

if __name__ == "__main__":
    connect_tonga_segment()
#!/usr/bin/env python3
"""
Connect only the small gaps between red line segments
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def interpolate_points(p1, p2, max_gap=0.005):
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

def connect_small_gaps():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    print(f"Processing {len(features)} segments...")
    
    # Analyze segments
    segments_info = []
    for i, feature in enumerate(features):
        coords = feature['geometry']['coordinates']
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        segments_info.append({
            'index': i,
            'feature': feature,
            'coords': coords,
            'avg_lon': avg_lon,
            'avg_lat': avg_lat,
            'start': coords[0],
            'end': coords[-1]
        })
        
        print(f"Segment {i+1}:")
        print(f"  Center: [{avg_lon:.4f}, {avg_lat:.4f}]")
        print(f"  Points: {len(coords)}")
    
    print("\n" + "="*60)
    print("Checking for small gaps to connect:")
    print("="*60 + "\n")
    
    # Threshold for connecting segments (0.035 degrees is about 3-4 km)
    MAX_CONNECT_DISTANCE = 0.035
    
    # Modified features list
    modified_features = []
    used_indices = set()
    
    for i, seg1 in enumerate(segments_info):
        if i in used_indices:
            continue
            
        # Start with this segment's coordinates
        combined_coords = list(seg1['coords'])
        current_feature = seg1['feature'].copy()
        used_indices.add(i)
        connected_to = []
        
        # Check for close connections to other segments
        for j, seg2 in enumerate(segments_info):
            if i == j or j in used_indices:
                continue
            
            # Check all possible connections
            connections = [
                (seg1['end'], seg2['start'], 'end_to_start', False, False),
                (seg1['end'], seg2['end'], 'end_to_end', False, True),
                (seg1['start'], seg2['start'], 'start_to_start', True, False),
                (seg1['start'], seg2['end'], 'start_to_end', True, True)
            ]
            
            best_dist = float('inf')
            best_connection = None
            
            for p1, p2, desc, reverse1, reverse2 in connections:
                dist = distance_between_points(p1, p2)
                if dist < best_dist:
                    best_dist = dist
                    best_connection = (p1, p2, desc, reverse1, reverse2)
            
            # If close enough, connect them
            if best_dist < MAX_CONNECT_DISTANCE:
                p1, p2, desc, reverse1, reverse2 = best_connection
                
                print(f"Connecting Segment {i+1} to Segment {j+1}:")
                print(f"  Connection type: {desc}")
                print(f"  Distance: {best_dist:.6f}")
                
                # Add bridge points
                bridge = interpolate_points(p1, p2, max_gap=0.005)
                
                # Determine how to add the segments
                if desc == 'end_to_start':
                    # Add bridge at end, then seg2
                    combined_coords.extend(bridge)
                    combined_coords.extend(seg2['coords'])
                elif desc == 'end_to_end':
                    # Add bridge at end, then reversed seg2
                    combined_coords.extend(bridge)
                    combined_coords.extend(reversed(seg2['coords']))
                elif desc == 'start_to_start':
                    # Add reversed seg2 at start, then bridge
                    new_coords = list(reversed(seg2['coords']))
                    new_coords.extend(bridge)
                    new_coords.extend(combined_coords)
                    combined_coords = new_coords
                elif desc == 'start_to_end':
                    # Add seg2 at start, then bridge
                    new_coords = list(seg2['coords'])
                    new_coords.extend(bridge)
                    new_coords.extend(combined_coords)
                    combined_coords = new_coords
                
                used_indices.add(j)
                connected_to.append(j+1)
                print(f"  Added {len(bridge)} bridge points")
                print()
        
        # Update the feature
        current_feature['geometry']['coordinates'] = combined_coords
        current_feature['properties']['name'] = f"Red Line Segment {len(modified_features)+1}"
        
        if connected_to:
            current_feature['properties']['connected_segments'] = f"Connected segments {i+1} and {connected_to}"
            print(f"Created connected segment from {i+1} and {connected_to}")
        else:
            print(f"Segment {i+1} remains separate")
        
        modified_features.append(current_feature)
    
    print(f"\n" + "="*60)
    print(f"Result: {len(features)} segments -> {len(modified_features)} segments")
    print("="*60 + "\n")
    
    # Create output GeoJSON
    output_geojson = {
        "type": "FeatureCollection",
        "features": modified_features
    }
    
    # Save the result
    output_file = 'public/images/fiji-goliath-red-line-final.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"Saved to {output_file}")
    
    # Print summary
    for i, feature in enumerate(modified_features):
        coords = feature['geometry']['coordinates']
        print(f"Final Segment {i+1}: {len(coords)} points")
        if 'connected_segments' in feature['properties']:
            print(f"  ({feature['properties']['connected_segments']})")

if __name__ == "__main__":
    connect_small_gaps()
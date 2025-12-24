#!/usr/bin/env python3
"""
Fix the red line gap at Clone property
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

def analyze_clone_gap():
    # Load current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        data = json.load(f)
    
    # Clone approximate center
    clone_center = [-129.80, 55.80]
    
    print("Analyzing segments for Clone gap...")
    print(f"Clone center: {clone_center}")
    print()
    
    segments = []
    for i, feature in enumerate(data['features']):
        coords = feature['geometry']['coordinates']
        
        # Calculate info
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        dist_to_clone = distance_between_points([avg_lon, avg_lat], clone_center)
        
        segments.append({
            'index': i,
            'feature': feature.copy(),
            'coords': coords,
            'center': [avg_lon, avg_lat],
            'start': coords[0],
            'end': coords[-1],
            'dist_to_clone': dist_to_clone,
            'num_points': len(coords)
        })
        
        print(f"Segment {i+1}:")
        print(f"  Points: {len(coords)}")
        print(f"  Center: [{avg_lon:.4f}, {avg_lat:.4f}]")
        print(f"  Start: [{coords[0][0]:.4f}, {coords[0][1]:.4f}]")
        print(f"  End: [{coords[-1][0]:.4f}, {coords[-1][1]:.4f}]")
        print(f"  Distance to Clone: {dist_to_clone:.4f}")
        
        if dist_to_clone < 0.1:
            print(f"  ** NEAR CLONE **")
        print()
    
    # Find the two segments that need to be connected near Clone
    # Look for segments that are close to Clone center or have endpoints near Clone
    clone_segments = []
    for seg in segments:
        # Check if segment center is near Clone OR if any endpoint is near Clone
        start_dist = distance_between_points(seg['start'], clone_center)
        end_dist = distance_between_points(seg['end'], clone_center)
        
        if seg['dist_to_clone'] < 0.3 or start_dist < 0.1 or end_dist < 0.1:  # Expanded search
            clone_segments.append(seg)
            print(f"  Segment {seg['index']+1}: center dist {seg['dist_to_clone']:.4f}, start dist {start_dist:.4f}, end dist {end_dist:.4f}")
    
    print(f"Found {len(clone_segments)} segments near Clone")
    
    if len(clone_segments) < 2:
        print("Not enough segments near Clone to connect")
        return segments, []
    
    # Find the gap between segments near Clone
    gaps = []
    for i, seg1 in enumerate(clone_segments):
        for j, seg2 in enumerate(clone_segments):
            if i >= j:
                continue
            
            # Check all possible endpoint connections
            connections = [
                (distance_between_points(seg1['start'], seg2['start']), 
                 seg1, seg2, 'start', 'start', seg1['start'], seg2['start']),
                (distance_between_points(seg1['start'], seg2['end']), 
                 seg1, seg2, 'start', 'end', seg1['start'], seg2['end']),
                (distance_between_points(seg1['end'], seg2['start']), 
                 seg1, seg2, 'end', 'start', seg1['end'], seg2['start']),
                (distance_between_points(seg1['end'], seg2['end']), 
                 seg1, seg2, 'end', 'end', seg1['end'], seg2['end'])
            ]
            
            min_gap = min(connections, key=lambda x: x[0])
            dist, s1, s2, end1, end2, point1, point2 = min_gap
            
            gaps.append({
                'distance': dist,
                'seg1': s1,
                'seg2': s2,
                'end1': end1,
                'end2': end2,
                'point1': point1,
                'point2': point2
            })
    
    gaps.sort(key=lambda x: x['distance'])
    
    print("Gaps near Clone:")
    for i, gap in enumerate(gaps[:3]):  # Show top 3
        print(f"  {i+1}. Segments {gap['seg1']['index']+1} and {gap['seg2']['index']+1}")
        print(f"     Distance: {gap['distance']:.6f}")
        print(f"     Connection: seg{gap['seg1']['index']+1}_{gap['end1']} -> seg{gap['seg2']['index']+1}_{gap['end2']}")
        print()
    
    return segments, gaps

def fix_clone_gap():
    segments, gaps = analyze_clone_gap()
    
    if not gaps:
        print("No gaps found to fix")
        return
    
    # Use the smallest gap
    gap_to_fix = gaps[0]
    
    print(f"Fixing gap between Segments {gap_to_fix['seg1']['index']+1} and {gap_to_fix['seg2']['index']+1}")
    print(f"Gap distance: {gap_to_fix['distance']:.6f}")
    
    # Create connected segments
    connected_features = []
    used_indices = set()
    
    # Find the segment that should be connected
    seg1 = gap_to_fix['seg1']
    seg2 = gap_to_fix['seg2']
    
    # Create merged segment
    merged_coords = list(seg1['coords'])
    
    # Add bridge points
    bridge = interpolate_points(gap_to_fix['point1'], gap_to_fix['point2'], 4)
    merged_coords.extend(bridge)
    
    # Add second segment (check if we need to reverse it)
    if gap_to_fix['end2'] == 'start':
        merged_coords.extend(seg2['coords'])
    else:
        merged_coords.extend(reversed(seg2['coords']))
    
    # Create new feature
    merged_feature = seg1['feature'].copy()
    merged_feature['geometry']['coordinates'] = merged_coords
    merged_feature['properties']['name'] = f"Red Line Segments {seg1['index']+1}+{seg2['index']+1} (Clone connected)"
    
    connected_features.append(merged_feature)
    used_indices.add(seg1['index'])
    used_indices.add(seg2['index'])
    
    print(f"Created merged segment with {len(merged_coords)} points")
    
    # Add remaining segments
    for seg in segments:
        if seg['index'] not in used_indices:
            connected_features.append(seg['feature'])
    
    # Create output
    output = {
        "type": "FeatureCollection",
        "features": connected_features
    }
    
    print(f"\nTotal segments: {len(segments)} -> {len(connected_features)}")
    
    # Save
    with open('public/images/fiji-goliath-red-line-clone-fixed.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Saved to fiji-goliath-red-line-clone-fixed.geojson")
    
    # Update final
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")

if __name__ == "__main__":
    fix_clone_gap()
#!/usr/bin/env python3
"""
Connect the broken red line segments around Tonga and Clone properties
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def interpolate_points(p1, p2, num_points=10):
    """Create interpolated points between two points"""
    points = []
    for i in range(1, num_points):
        t = i / num_points
        lon = p1[0] + (p2[0] - p1[0]) * t
        lat = p1[1] + (p2[1] - p1[1]) * t
        points.append([lon, lat])
    return points

def analyze_gaps():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    print(f"Analyzing {len(features)} segments for gaps:")
    print()
    
    # Get Tonga and Clone approximate locations from properties
    tonga_center = [-129.65, 55.70]  # Approximate from property data
    clone_center = [-129.80, 55.80]  # Approximate from property data
    
    # Sort features by their average latitude (north to south)
    features_with_info = []
    for i, feature in enumerate(features):
        coords = feature['geometry']['coordinates']
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        features_with_info.append({
            'index': i,
            'feature': feature,
            'coords': coords,
            'avg_lon': avg_lon,
            'avg_lat': avg_lat,
            'start': coords[0],
            'end': coords[-1]
        })
    
    # Sort by latitude (north to south)
    features_with_info.sort(key=lambda x: x['avg_lat'], reverse=True)
    
    # Print segment information
    for i, info in enumerate(features_with_info):
        print(f"Segment {info['index']+1} (sorted #{i+1}):")
        print(f"  Points: {len(info['coords'])}")
        print(f"  Center: [{info['avg_lon']:.4f}, {info['avg_lat']:.4f}]")
        print(f"  Start: [{info['start'][0]:.4f}, {info['start'][1]:.4f}]")
        print(f"  End: [{info['end'][0]:.4f}, {info['end'][1]:.4f}]")
        
        # Check proximity to Tonga or Clone
        dist_to_tonga = distance_between_points([info['avg_lon'], info['avg_lat']], tonga_center)
        dist_to_clone = distance_between_points([info['avg_lon'], info['avg_lat']], clone_center)
        
        if dist_to_tonga < 0.1:
            print(f"  ** Near TONGA (distance: {dist_to_tonga:.4f})")
        if dist_to_clone < 0.1:
            print(f"  ** Near CLONE (distance: {dist_to_clone:.4f})")
        print()
    
    # Identify gaps between consecutive segments
    print("GAPS between segments (in north-to-south order):")
    for i in range(len(features_with_info) - 1):
        current = features_with_info[i]
        next_seg = features_with_info[i + 1]
        
        # Calculate all possible connections
        distances = [
            (distance_between_points(current['end'], next_seg['start']), 'current_end->next_start'),
            (distance_between_points(current['end'], next_seg['end']), 'current_end->next_end'),
            (distance_between_points(current['start'], next_seg['start']), 'current_start->next_start'),
            (distance_between_points(current['start'], next_seg['end']), 'current_start->next_end')
        ]
        
        min_dist, connection = min(distances, key=lambda x: x[0])
        
        print(f"Gap between Segment {current['index']+1} and {next_seg['index']+1}:")
        print(f"  Distance: {min_dist:.4f}")
        print(f"  Best connection: {connection}")
        
        # Check if gap is near Tonga or Clone
        if 'end' in connection.split('->')[0]:
            gap_start = current['end']
        else:
            gap_start = current['start']
            
        if 'start' in connection.split('->')[1]:
            gap_end = next_seg['start']
        else:
            gap_end = next_seg['end']
        
        gap_center = [(gap_start[0] + gap_end[0])/2, (gap_start[1] + gap_end[1])/2]
        
        dist_to_tonga = distance_between_points(gap_center, tonga_center)
        dist_to_clone = distance_between_points(gap_center, clone_center)
        
        if dist_to_tonga < 0.15:
            print(f"  ** Gap is near TONGA (distance: {dist_to_tonga:.4f})")
        if dist_to_clone < 0.15:
            print(f"  ** Gap is near CLONE (distance: {dist_to_clone:.4f})")
        
        if min_dist < 0.05:  # Small gap that should be connected
            print(f"  >> SHOULD CONNECT THIS GAP")
        
        print()

if __name__ == "__main__":
    analyze_gaps()
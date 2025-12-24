#!/usr/bin/env python3
"""
Analyze which segments have close endpoints that should be connected
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def analyze_close_connections():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    features = geojson['features']
    
    print(f"Analyzing {len(features)} segments for close connections:")
    print()
    
    # Store all endpoints
    segments = []
    for i, feature in enumerate(features):
        coords = feature['geometry']['coordinates']
        segments.append({
            'index': i,
            'feature': feature,
            'start': coords[0],
            'end': coords[-1],
            'num_points': len(coords),
            'coords': coords
        })
    
    # Print segment endpoints
    for seg in segments:
        print(f"Segment {seg['index']+1}:")
        print(f"  Points: {seg['num_points']}")
        print(f"  Start: [{seg['start'][0]:.6f}, {seg['start'][1]:.6f}]")
        print(f"  End: [{seg['end'][0]:.6f}, {seg['end'][1]:.6f}]")
    
    print("\n" + "="*60)
    print("CLOSE CONNECTIONS (distance < 0.01):")
    print("="*60 + "\n")
    
    # Find close connections
    connections = []
    for i in range(len(segments)):
        for j in range(i+1, len(segments)):
            seg1 = segments[i]
            seg2 = segments[j]
            
            # Check all possible endpoint connections
            checks = [
                (seg1['end'], seg2['start'], f"Seg{seg1['index']+1}_end -> Seg{seg2['index']+1}_start"),
                (seg1['end'], seg2['end'], f"Seg{seg1['index']+1}_end -> Seg{seg2['index']+1}_end"),
                (seg1['start'], seg2['start'], f"Seg{seg1['index']+1}_start -> Seg{seg2['index']+1}_start"),
                (seg1['start'], seg2['end'], f"Seg{seg1['index']+1}_start -> Seg{seg2['index']+1}_end")
            ]
            
            for p1, p2, desc in checks:
                dist = distance_between_points(p1, p2)
                if dist < 0.01:  # Very close - less than 0.01 degrees
                    connections.append({
                        'seg1_idx': seg1['index'],
                        'seg2_idx': seg2['index'],
                        'point1': p1,
                        'point2': p2,
                        'distance': dist,
                        'description': desc
                    })
                    print(f"CLOSE GAP FOUND:")
                    print(f"  {desc}")
                    print(f"  Distance: {dist:.6f}")
                    print(f"  Point 1: [{p1[0]:.6f}, {p1[1]:.6f}]")
                    print(f"  Point 2: [{p2[0]:.6f}, {p2[1]:.6f}]")
                    print()
    
    if not connections:
        print("No close connections found (< 0.01 degrees)")
        print("\nLooking for medium-distance connections (< 0.05 degrees):")
        print("="*60 + "\n")
        
        # Try with larger threshold
        for i in range(len(segments)):
            for j in range(i+1, len(segments)):
                seg1 = segments[i]
                seg2 = segments[j]
                
                # Check all possible endpoint connections
                checks = [
                    (seg1['end'], seg2['start'], f"Seg{seg1['index']+1}_end -> Seg{seg2['index']+1}_start"),
                    (seg1['end'], seg2['end'], f"Seg{seg1['index']+1}_end -> Seg{seg2['index']+1}_end"),
                    (seg1['start'], seg2['start'], f"Seg{seg1['index']+1}_start -> Seg{seg2['index']+1}_start"),
                    (seg1['start'], seg2['end'], f"Seg{seg1['index']+1}_start -> Seg{seg2['index']+1}_end")
                ]
                
                for p1, p2, desc in checks:
                    dist = distance_between_points(p1, p2)
                    if dist < 0.05:  # Medium distance
                        print(f"Medium gap:")
                        print(f"  {desc}")
                        print(f"  Distance: {dist:.6f}")
                        print()

if __name__ == "__main__":
    analyze_close_connections()
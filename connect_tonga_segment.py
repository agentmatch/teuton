#!/usr/bin/env python3
"""
Connect the small Tonga segment to its nearest neighbors
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

def analyze_segments():
    # Load current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        data = json.load(f)
    
    # Tonga approximate center
    tonga_center = [-129.65, 55.70]
    
    print("Analyzing segments to find Tonga segment...")
    print()
    
    segments = []
    for i, feature in enumerate(data['features']):
        coords = feature['geometry']['coordinates']
        
        # Calculate center
        avg_lon = sum(c[0] for c in coords) / len(coords)
        avg_lat = sum(c[1] for c in coords) / len(coords)
        
        # Distance to Tonga
        dist_to_tonga = distance_between_points([avg_lon, avg_lat], tonga_center)
        
        segment_info = {
            'index': i,
            'feature': feature,
            'coords': coords,
            'center': [avg_lon, avg_lat],
            'start': coords[0],
            'end': coords[-1],
            'num_points': len(coords),
            'dist_to_tonga': dist_to_tonga
        }
        segments.append(segment_info)
        
        print(f"Segment {i+1}:")
        print(f"  Points: {len(coords)}")
        print(f"  Center: [{avg_lon:.4f}, {avg_lat:.4f}]")
        print(f"  Start: [{coords[0][0]:.4f}, {coords[0][1]:.4f}]")
        print(f"  End: [{coords[-1][0]:.4f}, {coords[-1][1]:.4f}]")
        print(f"  Distance to Tonga: {dist_to_tonga:.4f}")
        
        if dist_to_tonga < 0.05:  # Very close to Tonga
            print(f"  ** THIS IS THE TONGA SEGMENT **")
        print()
    
    # Find the Tonga segment (smallest segment near Tonga)
    tonga_segment = None
    for seg in segments:
        if seg['dist_to_tonga'] < 0.05 and seg['num_points'] < 10:
            tonga_segment = seg
            break
    
    if not tonga_segment:
        print("Could not identify Tonga segment!")
        return
    
    print(f"Tonga segment is Segment {tonga_segment['index']+1}")
    print()
    
    # Find closest connections to other segments
    print("Finding closest connections...")
    connections = []
    
    for seg in segments:
        if seg['index'] == tonga_segment['index']:
            continue
        
        # Check all possible connections
        distances = [
            (distance_between_points(tonga_segment['start'], seg['start']), 
             'tonga_start', 'seg_start', tonga_segment['start'], seg['start']),
            (distance_between_points(tonga_segment['start'], seg['end']), 
             'tonga_start', 'seg_end', tonga_segment['start'], seg['end']),
            (distance_between_points(tonga_segment['end'], seg['start']), 
             'tonga_end', 'seg_start', tonga_segment['end'], seg['start']),
            (distance_between_points(tonga_segment['end'], seg['end']), 
             'tonga_end', 'seg_end', tonga_segment['end'], seg['end'])
        ]
        
        min_dist, from_end, to_end, from_point, to_point = min(distances, key=lambda x: x[0])
        
        connections.append({
            'to_segment': seg['index'],
            'distance': min_dist,
            'from_end': from_end,
            'to_end': to_end,
            'from_point': from_point,
            'to_point': to_point
        })
    
    # Sort by distance
    connections.sort(key=lambda x: x['distance'])
    
    print("Closest connections:")
    for i, conn in enumerate(connections[:3]):  # Show top 3
        print(f"  {i+1}. To Segment {conn['to_segment']+1}:")
        print(f"     Distance: {conn['distance']:.6f}")
        print(f"     Connection: {conn['from_end']} -> {conn['to_end']}")
        print()
    
    # We'll connect to the two closest segments
    connect_to = connections[:2]
    
    return tonga_segment, segments, connect_to

def connect_segments():
    tonga_seg, all_segments, connections = analyze_segments()
    
    if not tonga_seg:
        return
    
    print("Connecting Tonga segment to nearest neighbors...")
    print()
    
    # Build a single connected line
    # We'll merge all segments, connecting through Tonga
    
    # Sort segments by latitude (north to south)
    all_segments.sort(key=lambda x: x['center'][1], reverse=True)
    
    # Create new connected coordinates
    connected_coords = []
    used_indices = set()
    
    # Start with the northernmost segment
    for seg in all_segments:
        if seg['index'] == tonga_seg['index']:
            continue  # Skip Tonga for now
        
        if len(connected_coords) == 0:
            # First segment
            connected_coords.extend(seg['coords'])
            used_indices.add(seg['index'])
            print(f"Started with Segment {seg['index']+1}")
            
            # Check if we should connect to Tonga
            for conn in connections:
                if conn['to_segment'] == seg['index']:
                    # Add connection to Tonga
                    print(f"Connecting to Tonga segment...")
                    
                    # Add bridge points
                    bridge = interpolate_points(conn['to_point'], conn['from_point'], 3)
                    connected_coords.extend(bridge)
                    
                    # Add Tonga segment
                    if conn['from_end'] == 'tonga_start':
                        connected_coords.extend(tonga_seg['coords'])
                    else:
                        connected_coords.extend(reversed(tonga_seg['coords']))
                    
                    used_indices.add(tonga_seg['index'])
                    
                    # Now connect Tonga to the next segment
                    other_conn = connections[0] if connections[1]['to_segment'] == seg['index'] else connections[1]
                    
                    # Add bridge to next segment
                    if other_conn['from_end'] == 'tonga_start':
                        bridge_from = tonga_seg['coords'][0]
                    else:
                        bridge_from = tonga_seg['coords'][-1]
                    
                    bridge = interpolate_points(bridge_from, other_conn['to_point'], 3)
                    connected_coords.extend(bridge)
                    
                    # Add the next segment
                    next_seg = all_segments[other_conn['to_segment']]
                    if other_conn['to_end'] == 'seg_start':
                        connected_coords.extend(next_seg['coords'])
                    else:
                        connected_coords.extend(reversed(next_seg['coords']))
                    
                    used_indices.add(other_conn['to_segment'])
                    print(f"Connected through Tonga to Segment {other_conn['to_segment']+1}")
                    break
    
    # Add any remaining segments
    for seg in all_segments:
        if seg['index'] not in used_indices:
            print(f"Adding remaining Segment {seg['index']+1}")
            
            # Find closest connection point
            if len(connected_coords) > 0:
                last_point = connected_coords[-1]
                dist_to_start = distance_between_points(last_point, seg['coords'][0])
                dist_to_end = distance_between_points(last_point, seg['coords'][-1])
                
                if dist_to_start < dist_to_end:
                    # Add bridge if needed
                    if dist_to_start > 0.01:
                        bridge = interpolate_points(last_point, seg['coords'][0], 3)
                        connected_coords.extend(bridge)
                    connected_coords.extend(seg['coords'])
                else:
                    # Add bridge if needed
                    if dist_to_end > 0.01:
                        bridge = interpolate_points(last_point, seg['coords'][-1], 3)
                        connected_coords.extend(bridge)
                    connected_coords.extend(reversed(seg['coords']))
            else:
                connected_coords.extend(seg['coords'])
    
    print(f"\nTotal points in connected line: {len(connected_coords)}")
    
    # Create new GeoJSON with single connected line
    output = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {
                "FID": 0,
                "name": "Fiji-Goliath Red Line (Connected)",
                "description": "Red line with Tonga segment connected"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": connected_coords
            }
        }]
    }
    
    # Save
    with open('public/images/fiji-goliath-red-line-connected.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Saved to fiji-goliath-red-line-connected.geojson")
    
    # Update final
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")

if __name__ == "__main__":
    connect_segments()
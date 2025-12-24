#!/usr/bin/env python3
"""
Create a single centerline from parallel red line edges
"""

import json
import math
import numpy as np
from scipy.signal import savgol_filter
from collections import defaultdict

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def find_centerline(coords):
    """Find centerline from a set of coordinates that might represent parallel edges"""
    if len(coords) < 10:
        return coords
    
    # Convert to numpy array for easier processing
    points = np.array(coords)
    
    # Calculate distances between consecutive points
    distances = []
    for i in range(1, len(points)):
        dist = distance_between_points(points[i-1], points[i])
        distances.append(dist)
    
    avg_dist = np.mean(distances)
    
    # Identify potential parallel segments by detecting large jumps
    # (when the path jumps to the parallel line)
    jumps = []
    for i, dist in enumerate(distances):
        if dist > avg_dist * 3:  # Large jump detected
            jumps.append(i+1)  # Index after the jump
    
    print(f"  Found {len(jumps)} potential jumps to parallel line")
    
    # If we have jumps, try to identify parallel segments
    if len(jumps) > 0:
        # Split into segments
        segments = []
        last_idx = 0
        for jump_idx in jumps:
            if jump_idx - last_idx > 5:  # Minimum segment size
                segments.append(points[last_idx:jump_idx])
            last_idx = jump_idx
        if len(points) - last_idx > 5:
            segments.append(points[last_idx:])
        
        print(f"  Split into {len(segments)} segments")
        
        # Try to pair parallel segments and average them
        if len(segments) == 2:
            seg1, seg2 = segments[0], segments[1]
            
            # Check if they're roughly parallel by comparing directions
            if len(seg1) > 1 and len(seg2) > 1:
                # Reverse second segment if needed (parallel lines often go in opposite directions)
                start_dist = distance_between_points(seg1[0], seg2[0])
                end_dist = distance_between_points(seg1[-1], seg2[-1])
                start_rev_dist = distance_between_points(seg1[0], seg2[-1])
                end_rev_dist = distance_between_points(seg1[-1], seg2[0])
                
                if start_rev_dist + end_rev_dist < start_dist + end_dist:
                    seg2 = seg2[::-1]
                    print("  Reversed second segment for better alignment")
                
                # Create centerline by averaging paired points
                centerline = []
                
                # Use dynamic time warping or simple interpolation
                if len(seg1) == len(seg2):
                    # Simple case - same number of points
                    for p1, p2 in zip(seg1, seg2):
                        center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
                        centerline.append(center)
                else:
                    # Resample to same number of points
                    num_points = max(len(seg1), len(seg2))
                    
                    # Interpolate both segments to same number of points
                    seg1_interp = resample_line(seg1, num_points)
                    seg2_interp = resample_line(seg2, num_points)
                    
                    for p1, p2 in zip(seg1_interp, seg2_interp):
                        center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
                        centerline.append(center)
                
                return centerline
    
    # If no clear parallel structure, just smooth the existing line
    return smooth_line(coords)

def resample_line(coords, num_points):
    """Resample a line to have a specific number of points"""
    if len(coords) == num_points:
        return coords
    
    # Calculate cumulative distances
    distances = [0]
    for i in range(1, len(coords)):
        dist = distance_between_points(coords[i-1], coords[i])
        distances.append(distances[-1] + dist)
    
    total_length = distances[-1]
    if total_length == 0:
        return coords
    
    # Create evenly spaced points
    resampled = []
    target_dists = np.linspace(0, total_length, num_points)
    
    for target_dist in target_dists:
        # Find the segment containing this distance
        for i in range(len(distances)-1):
            if distances[i] <= target_dist <= distances[i+1]:
                # Interpolate within this segment
                segment_length = distances[i+1] - distances[i]
                if segment_length > 0:
                    t = (target_dist - distances[i]) / segment_length
                    lon = coords[i][0] + t * (coords[i+1][0] - coords[i][0])
                    lat = coords[i][1] + t * (coords[i+1][1] - coords[i][1])
                    resampled.append([lon, lat])
                else:
                    resampled.append(coords[i])
                break
    
    return resampled

def smooth_line(coords, window_size=5):
    """Smooth a line using Savitzky-Golay filter"""
    if len(coords) < window_size:
        return coords
    
    coords_array = np.array(coords)
    
    # Ensure window size is odd
    if window_size % 2 == 0:
        window_size += 1
    
    # Apply smoothing to x and y separately
    try:
        if len(coords) > window_size:
            x_smooth = savgol_filter(coords_array[:, 0], window_size, 2)
            y_smooth = savgol_filter(coords_array[:, 1], window_size, 2)
            
            smoothed = [[x, y] for x, y in zip(x_smooth, y_smooth)]
            return smoothed
    except:
        pass
    
    return coords

def process_red_line():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    print(f"Processing {len(geojson['features'])} segments to create centerlines...")
    print()
    
    processed_features = []
    
    for i, feature in enumerate(geojson['features']):
        coords = feature['geometry']['coordinates']
        print(f"Segment {i+1}: {len(coords)} points")
        
        # Check if this segment might be parallel lines
        if len(coords) > 100:  # Only process large segments
            # Try to find centerline
            centerline = find_centerline(coords)
            
            if len(centerline) != len(coords):
                print(f"  Created centerline with {len(centerline)} points (was {len(coords)})")
            else:
                print(f"  Smoothed line")
            
            feature['geometry']['coordinates'] = centerline
        else:
            # Just smooth smaller segments
            smoothed = smooth_line(coords, window_size=3)
            feature['geometry']['coordinates'] = smoothed
            print(f"  Light smoothing applied")
        
        processed_features.append(feature)
    
    # Create output GeoJSON
    output_geojson = {
        "type": "FeatureCollection",
        "features": processed_features
    }
    
    # Save the result
    output_file = 'public/images/fiji-goliath-red-line-centerline.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved centerline version to {output_file}")
    
    # Also update the final file
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")

if __name__ == "__main__":
    try:
        process_red_line()
    except ImportError as e:
        print(f"Missing required library: {e}")
        print("Installing scipy...")
        import subprocess
        subprocess.check_call(['pip3', 'install', 'scipy'])
        print("Please run the script again.")
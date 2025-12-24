#!/usr/bin/env python3
"""
Extract centerline from closed loop segments (parallel edges of thick line)
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def find_loop_midpoint(coords):
    """Find the approximate midpoint of a closed loop"""
    if len(coords) < 4:
        return len(coords) // 2
    
    # The loop likely goes from start to furthest point, then back
    start = coords[0]
    
    max_dist = 0
    max_idx = 0
    
    for i in range(len(coords) // 3, 2 * len(coords) // 3):  # Search in middle third
        dist = distance_between_points(coords[i], start)
        if dist > max_dist:
            max_dist = dist
            max_idx = i
    
    return max_idx

def extract_centerline_from_loop(coords):
    """Extract centerline from a closed loop (outline of thick line)"""
    
    # Check if this is actually a closed loop
    start_end_dist = distance_between_points(coords[0], coords[-1])
    
    # Calculate average distance to determine if it's a loop
    total_length = 0
    for i in range(1, len(coords)):
        total_length += distance_between_points(coords[i-1], coords[i])
    
    avg_segment_length = total_length / len(coords)
    
    if start_end_dist > avg_segment_length * 5:
        # Not a closed loop, just return smoothed version
        return smooth_line(coords)
    
    # Find the midpoint (furthest point from start)
    mid_idx = find_loop_midpoint(coords)
    
    # Split into two halves
    first_half = coords[:mid_idx+1]
    second_half = coords[mid_idx:]
    
    # Reverse the second half so both go in same direction
    second_half = list(reversed(second_half))
    
    # Make sure both halves have similar number of points for pairing
    if abs(len(first_half) - len(second_half)) > len(coords) * 0.3:
        # Halves are too uneven, try different split
        mid_idx = len(coords) // 2
        first_half = coords[:mid_idx]
        second_half = list(reversed(coords[mid_idx:]))
    
    # Resample both halves to same number of points
    num_points = max(len(first_half), len(second_half))
    first_resampled = resample_line(first_half, num_points)
    second_resampled = resample_line(second_half, num_points)
    
    # Create centerline by averaging paired points
    centerline = []
    for p1, p2 in zip(first_resampled, second_resampled):
        center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
        centerline.append(center)
    
    # Remove duplicate points at the ends
    cleaned = [centerline[0]]
    for i in range(1, len(centerline)):
        if distance_between_points(centerline[i], cleaned[-1]) > 0.0001:
            cleaned.append(centerline[i])
    
    return cleaned

def resample_line(coords, target_points):
    """Resample a line to have specific number of points"""
    if len(coords) <= 2:
        return coords
    
    if len(coords) >= target_points:
        # Downsample
        step = len(coords) / target_points
        resampled = []
        for i in range(target_points):
            idx = int(i * step)
            if idx < len(coords):
                resampled.append(coords[idx])
        return resampled
    
    # Upsample - interpolate
    total_dist = 0
    distances = [0]
    
    for i in range(1, len(coords)):
        dist = distance_between_points(coords[i-1], coords[i])
        total_dist += dist
        distances.append(total_dist)
    
    if total_dist == 0:
        return coords
    
    resampled = []
    step = total_dist / (target_points - 1)
    
    for i in range(target_points):
        target_dist = i * step
        
        # Find segment containing this distance
        for j in range(len(distances) - 1):
            if distances[j] <= target_dist <= distances[j+1]:
                segment_dist = distances[j+1] - distances[j]
                if segment_dist > 0:
                    t = (target_dist - distances[j]) / segment_dist
                    lon = coords[j][0] + t * (coords[j+1][0] - coords[j][0])
                    lat = coords[j][1] + t * (coords[j+1][1] - coords[j][1])
                    resampled.append([lon, lat])
                    break
                else:
                    resampled.append(coords[j])
                    break
    
    return resampled

def smooth_line(coords, window=3):
    """Simple moving average smoothing"""
    if len(coords) <= window:
        return coords
    
    smoothed = []
    half_window = window // 2
    
    for i in range(len(coords)):
        start = max(0, i - half_window)
        end = min(len(coords), i + half_window + 1)
        
        window_points = coords[start:end]
        avg_lon = sum(p[0] for p in window_points) / len(window_points)
        avg_lat = sum(p[1] for p in window_points) / len(window_points)
        
        smoothed.append([avg_lon, avg_lat])
    
    return smoothed

def process_red_lines():
    # Load the no-red-mountain version (5 segments)
    with open('public/images/fiji-goliath-red-line-no-red-mountain.geojson', 'r') as f:
        data = json.load(f)
    
    print(f"Processing {len(data['features'])} segments to extract centerlines...")
    print()
    
    processed_features = []
    
    for i, feature in enumerate(data['features']):
        coords = feature['geometry']['coordinates']
        print(f"Segment {i+1}: {len(coords)} points")
        
        # Check if it's a closed loop
        start_end_dist = distance_between_points(coords[0], coords[-1])
        
        if start_end_dist < 0.01:  # Likely a closed loop
            print(f"  Detected closed loop (gap: {start_end_dist:.6f})")
            centerline = extract_centerline_from_loop(coords)
            print(f"  Extracted centerline: {len(centerline)} points")
        else:
            print(f"  Not a closed loop (gap: {start_end_dist:.6f})")
            # Just smooth it
            centerline = smooth_line(coords, window=5)
            print(f"  Smoothed: {len(centerline)} points")
        
        feature['geometry']['coordinates'] = centerline
        processed_features.append(feature)
    
    print(f"\nTotal segments: {len(processed_features)}")
    
    # Save result
    output = {
        "type": "FeatureCollection",
        "features": processed_features
    }
    
    with open('public/images/fiji-goliath-red-line-centerlines.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Saved to fiji-goliath-red-line-centerlines.geojson")
    
    # Update final file
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")
    
    # Summary
    print("\nSummary:")
    for i, feature in enumerate(processed_features):
        print(f"  Segment {i+1}: {len(feature['geometry']['coordinates'])} points")

if __name__ == "__main__":
    process_red_lines()
#!/usr/bin/env python3
"""
Simplify and clean the red line to create a single smooth line
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def moving_average(coords, window=3):
    """Apply moving average smoothing to coordinates"""
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

def douglas_peucker(coords, epsilon=0.0001):
    """Simplify line using Douglas-Peucker algorithm"""
    if len(coords) <= 2:
        return coords
    
    # Find the point farthest from the line between start and end
    start = coords[0]
    end = coords[-1]
    
    max_dist = 0
    max_idx = 0
    
    for i in range(1, len(coords) - 1):
        dist = perpendicular_distance(coords[i], start, end)
        if dist > max_dist:
            max_dist = dist
            max_idx = i
    
    # If the farthest point is too far, recursively simplify
    if max_dist > epsilon:
        # Recursive call
        left = douglas_peucker(coords[:max_idx + 1], epsilon)
        right = douglas_peucker(coords[max_idx:], epsilon)
        
        # Combine results (avoid duplicating the middle point)
        return left[:-1] + right
    else:
        # All points between can be removed
        return [start, end]

def perpendicular_distance(point, line_start, line_end):
    """Calculate perpendicular distance from point to line"""
    x0, y0 = point
    x1, y1 = line_start
    x2, y2 = line_end
    
    # Line length
    line_length = distance_between_points(line_start, line_end)
    
    if line_length == 0:
        return distance_between_points(point, line_start)
    
    # Calculate perpendicular distance
    t = ((x0 - x1) * (x2 - x1) + (y0 - y1) * (y2 - y1)) / (line_length ** 2)
    t = max(0, min(1, t))
    
    projection = [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]
    return distance_between_points(point, projection)

def detect_and_merge_parallel_segments(coords, parallel_threshold=0.005):
    """Detect if the line has parallel segments and merge them into centerline"""
    if len(coords) < 20:
        return coords
    
    # Look for sudden jumps that might indicate parallel lines
    segments = []
    current_segment = [coords[0]]
    
    for i in range(1, len(coords)):
        dist = distance_between_points(coords[i-1], coords[i])
        
        # If distance is unusually large, might be jump to parallel line
        if dist > 0.01:  # Threshold for detecting jumps
            if len(current_segment) > 5:
                segments.append(current_segment)
            current_segment = [coords[i]]
        else:
            current_segment.append(coords[i])
    
    if len(current_segment) > 5:
        segments.append(current_segment)
    
    print(f"    Found {len(segments)} continuous segments")
    
    # If we have exactly 2 segments, they might be parallel
    if len(segments) == 2:
        seg1, seg2 = segments[0], segments[1]
        
        # Check if segments are roughly parallel
        # Calculate average distance between corresponding points
        min_len = min(len(seg1), len(seg2))
        
        # Sample points to check parallelism
        sample_indices = [0, min_len//4, min_len//2, 3*min_len//4, min_len-1]
        
        distances = []
        for idx in sample_indices:
            if idx < len(seg1) and idx < len(seg2):
                dist = distance_between_points(seg1[idx], seg2[idx])
                distances.append(dist)
        
        avg_separation = sum(distances) / len(distances) if distances else 0
        
        # If segments are consistently separated, they're likely parallel
        if 0.002 < avg_separation < 0.02:
            print(f"    Detected parallel segments with average separation: {avg_separation:.6f}")
            
            # Create centerline by averaging
            centerline = []
            
            # Resample both to same number of points
            num_points = max(len(seg1), len(seg2))
            seg1_resampled = resample_segment(seg1, num_points)
            seg2_resampled = resample_segment(seg2, num_points)
            
            # Check if we need to reverse one segment
            forward_dist = distance_between_points(seg1_resampled[0], seg2_resampled[0]) + \
                          distance_between_points(seg1_resampled[-1], seg2_resampled[-1])
            reverse_dist = distance_between_points(seg1_resampled[0], seg2_resampled[-1]) + \
                          distance_between_points(seg1_resampled[-1], seg2_resampled[0])
            
            if reverse_dist < forward_dist:
                seg2_resampled = list(reversed(seg2_resampled))
                print("    Reversed second segment for better alignment")
            
            # Average the segments
            for p1, p2 in zip(seg1_resampled, seg2_resampled):
                center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
                centerline.append(center)
            
            return centerline
    
    # If not parallel segments, return original
    return coords

def resample_segment(coords, target_points):
    """Resample a segment to have a specific number of points"""
    if len(coords) == target_points:
        return coords
    
    if len(coords) < 2:
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
    step = total_length / (target_points - 1)
    
    for i in range(target_points):
        target_dist = i * step
        
        # Find the segment containing this distance
        for j in range(len(distances) - 1):
            if distances[j] <= target_dist <= distances[j + 1]:
                # Interpolate within this segment
                segment_length = distances[j + 1] - distances[j]
                if segment_length > 0:
                    t = (target_dist - distances[j]) / segment_length
                else:
                    t = 0
                
                lon = coords[j][0] + t * (coords[j + 1][0] - coords[j][0])
                lat = coords[j][1] + t * (coords[j + 1][1] - coords[j][1])
                resampled.append([lon, lat])
                break
        else:
            # Use last point if we've gone past the end
            resampled.append(coords[-1])
    
    return resampled

def process_red_line():
    # Read the current data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        geojson = json.load(f)
    
    print(f"Processing {len(geojson['features'])} segments...")
    print()
    
    processed_features = []
    
    for i, feature in enumerate(geojson['features']):
        coords = feature['geometry']['coordinates']
        print(f"  Segment {i+1}: {len(coords)} points")
        
        # Step 1: Detect and merge parallel segments if present
        merged = detect_and_merge_parallel_segments(coords)
        
        # Step 2: Smooth the line
        smoothed = moving_average(merged, window=5)
        
        # Step 3: Simplify to remove redundant points
        if len(smoothed) > 50:
            simplified = douglas_peucker(smoothed, epsilon=0.0002)
        else:
            simplified = smoothed
        
        print(f"    Final: {len(simplified)} points (reduced from {len(coords)})")
        
        feature['geometry']['coordinates'] = simplified
        processed_features.append(feature)
    
    # Create output GeoJSON
    output_geojson = {
        "type": "FeatureCollection",
        "features": processed_features
    }
    
    # Save the result
    output_file = 'public/images/fiji-goliath-red-line-simplified.geojson'
    with open(output_file, 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print(f"\nSaved simplified version to {output_file}")
    
    # Also update the final file
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output_geojson, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")
    
    # Print summary
    print("\nSummary:")
    total_original = sum(len(f['geometry']['coordinates']) for f in geojson['features'])
    total_simplified = sum(len(f['geometry']['coordinates']) for f in processed_features)
    print(f"  Total points: {total_original} -> {total_simplified}")
    print(f"  Reduction: {((total_original - total_simplified) / total_original * 100):.1f}%")

if __name__ == "__main__":
    process_red_line()
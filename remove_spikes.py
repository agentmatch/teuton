#!/usr/bin/env python3
"""
Remove spiky artifacts from the red line using smoothing and outlier detection
"""

import json
import math

def distance_between_points(p1, p2):
    """Calculate distance between two points"""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def angle_between_vectors(p1, p2, p3):
    """Calculate angle between vectors p1->p2 and p2->p3"""
    # Vector from p1 to p2
    v1_x = p2[0] - p1[0]
    v1_y = p2[1] - p1[1]
    
    # Vector from p2 to p3
    v2_x = p3[0] - p2[0]
    v2_y = p3[1] - p2[1]
    
    # Magnitudes
    mag1 = math.sqrt(v1_x**2 + v1_y**2)
    mag2 = math.sqrt(v2_x**2 + v2_y**2)
    
    if mag1 == 0 or mag2 == 0:
        return 0
    
    # Dot product
    dot = v1_x * v2_x + v1_y * v2_y
    
    # Angle
    cos_angle = dot / (mag1 * mag2)
    cos_angle = max(-1, min(1, cos_angle))  # Clamp to [-1, 1]
    
    angle = math.acos(cos_angle)
    return math.degrees(angle)

def detect_spike(p1, p2, p3, angle_threshold=45):
    """Detect if p2 is a spike based on the angle it forms"""
    angle = angle_between_vectors(p1, p2, p3)
    
    # A spike is a sharp turn (angle < threshold degrees)
    return angle < angle_threshold

def remove_spikes_from_line(coords, angle_threshold=30):
    """Remove spikes from a line by detecting sharp angles"""
    if len(coords) < 3:
        return coords
    
    cleaned = [coords[0]]
    
    i = 1
    while i < len(coords) - 1:
        # Check if current point forms a spike
        if detect_spike(cleaned[-1], coords[i], coords[i+1], angle_threshold):
            # Skip this spike point
            i += 1
        else:
            # Keep this point
            cleaned.append(coords[i])
            i += 1
    
    # Always keep the last point
    cleaned.append(coords[-1])
    
    return cleaned

def smooth_line(coords, window_size=5):
    """Apply moving average smoothing"""
    if len(coords) <= window_size:
        return coords
    
    smoothed = []
    half_window = window_size // 2
    
    for i in range(len(coords)):
        start = max(0, i - half_window)
        end = min(len(coords), i + half_window + 1)
        
        window_points = coords[start:end]
        
        # Calculate weighted average (center point has more weight)
        weights = []
        for j in range(len(window_points)):
            distance_from_center = abs(j - len(window_points)//2)
            weight = 1.0 / (1.0 + distance_from_center * 0.5)
            weights.append(weight)
        
        total_weight = sum(weights)
        
        avg_lon = sum(p[0] * w for p, w in zip(window_points, weights)) / total_weight
        avg_lat = sum(p[1] * w for p, w in zip(window_points, weights)) / total_weight
        
        smoothed.append([avg_lon, avg_lat])
    
    return smoothed

def douglas_peucker_simplify(coords, epsilon=0.0001):
    """Simplify line using Douglas-Peucker algorithm"""
    if len(coords) <= 2:
        return coords
    
    # Find the point with maximum distance from line between first and last
    start = coords[0]
    end = coords[-1]
    
    max_dist = 0
    max_idx = 0
    
    for i in range(1, len(coords) - 1):
        dist = perpendicular_distance(coords[i], start, end)
        if dist > max_dist:
            max_dist = dist
            max_idx = i
    
    # If max distance is greater than epsilon, recursively simplify
    if max_dist > epsilon:
        # Recursive simplification
        left_line = douglas_peucker_simplify(coords[:max_idx+1], epsilon)
        right_line = douglas_peucker_simplify(coords[max_idx:], epsilon)
        
        # Combine results (avoid duplicating the middle point)
        return left_line[:-1] + right_line
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
    
    # Calculate perpendicular distance using cross product
    # |(x2-x1)(y1-y0) - (x1-x0)(y2-y1)| / line_length
    numerator = abs((x2-x1)*(y1-y0) - (x1-x0)*(y2-y1))
    return numerator / line_length

def remove_outliers(coords, threshold=3):
    """Remove points that deviate too much from their neighbors"""
    if len(coords) < 5:
        return coords
    
    cleaned = [coords[0]]
    
    for i in range(1, len(coords) - 1):
        # Calculate expected position based on neighbors
        prev_point = cleaned[-1]
        next_point = coords[i + 1]
        
        # Simple linear interpolation
        expected_lon = (prev_point[0] + next_point[0]) / 2
        expected_lat = (prev_point[1] + next_point[1]) / 2
        
        # Distance from expected position
        actual = coords[i]
        deviation = distance_between_points(actual, [expected_lon, expected_lat])
        
        # Average distance between consecutive points
        avg_dist = distance_between_points(prev_point, next_point) / 2
        
        # If deviation is not too large relative to average distance, keep the point
        if deviation < avg_dist * threshold:
            cleaned.append(actual)
        # else skip this outlier
    
    cleaned.append(coords[-1])
    return cleaned

def process_red_line():
    # Load the current red line data
    with open('public/images/fiji-goliath-red-line-final.geojson', 'r') as f:
        data = json.load(f)
    
    print(f"Processing {len(data['features'])} segments to remove spikes...")
    print()
    
    processed_features = []
    
    for i, feature in enumerate(data['features']):
        coords = feature['geometry']['coordinates']
        original_count = len(coords)
        
        print(f"Segment {i+1}: {original_count} points")
        
        # Step 1: Remove obvious spikes (sharp angles)
        despike = remove_spikes_from_line(coords, angle_threshold=30)
        print(f"  After despike: {len(despike)} points (removed {original_count - len(despike)} spikes)")
        
        # Step 2: Remove outliers
        no_outliers = remove_outliers(despike, threshold=2)
        print(f"  After outlier removal: {len(no_outliers)} points")
        
        # Step 3: Smooth the line
        smoothed = smooth_line(no_outliers, window_size=7)
        print(f"  After smoothing: {len(smoothed)} points")
        
        # Step 4: Simplify to remove redundant points
        simplified = douglas_peucker_simplify(smoothed, epsilon=0.0002)
        print(f"  After simplification: {len(simplified)} points")
        
        # Final smoothing pass with smaller window
        final = smooth_line(simplified, window_size=3)
        print(f"  Final: {len(final)} points (reduced by {((original_count - len(final))/original_count*100):.1f}%)")
        print()
        
        feature['geometry']['coordinates'] = final
        processed_features.append(feature)
    
    # Save result
    output = {
        "type": "FeatureCollection",
        "features": processed_features
    }
    
    # Save to new file
    with open('public/images/fiji-goliath-red-line-smooth.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Saved smooth version to fiji-goliath-red-line-smooth.geojson")
    
    # Also update the final file
    with open('public/images/fiji-goliath-red-line-final.geojson', 'w') as f:
        json.dump(output, f, indent=2)
    
    print("Updated fiji-goliath-red-line-final.geojson")
    
    # Summary
    total_original = sum(len(f['geometry']['coordinates']) for f in data['features'])
    total_final = sum(len(f['geometry']['coordinates']) for f in processed_features)
    print(f"\nTotal points: {total_original} -> {total_final} ({((total_original - total_final)/total_original*100):.1f}% reduction)")

if __name__ == "__main__":
    process_red_line()
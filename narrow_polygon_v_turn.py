#!/usr/bin/env python3
"""
Script to narrow the V-turn gap in the eastern polygon by identifying and adjusting
only the inner edge points at the southern turn.
"""

import json
import numpy as np
from typing import List, Tuple

def find_v_turn_region(coords: List[List[float]], lat_threshold: float = 56.32) -> Tuple[int, int]:
    """
    Find the indices that bracket the V-turn region at the southern end.
    Returns the start and end indices of the turn region.
    """
    # Find all points below the latitude threshold
    turn_indices = [i for i, coord in enumerate(coords) if coord[1] < lat_threshold]
    
    if not turn_indices:
        return -1, -1
    
    # The turn region is continuous, so find the first and last indices
    return turn_indices[0], turn_indices[-1]

def analyze_polygon_direction(coords: List[List[float]]) -> str:
    """
    Determine if the polygon points go clockwise or counter-clockwise.
    Uses the shoelace formula to calculate the signed area.
    """
    n = len(coords)
    area = 0.0
    
    for i in range(n - 1):
        area += coords[i][0] * coords[i + 1][1]
        area -= coords[i + 1][0] * coords[i][1]
    
    # Close the polygon
    area += coords[n - 1][0] * coords[0][1]
    area -= coords[0][0] * coords[n - 1][1]
    
    return "clockwise" if area < 0 else "counter-clockwise"

def identify_inner_edge_points(coords: List[List[float]], turn_start: int, turn_end: int) -> List[int]:
    """
    Identify which points are on the inner edge of the V-turn.
    The inner edge is the one that doesn't go as far south.
    """
    if turn_start == -1 or turn_end == -1:
        return []
    
    # Find the southernmost point (minimum latitude)
    turn_coords = coords[turn_start:turn_end + 1]
    min_lat_idx = min(range(len(turn_coords)), key=lambda i: turn_coords[i][1])
    absolute_min_idx = turn_start + min_lat_idx
    
    # The polygon has two "sides" - one going down and one coming back up
    # We need to identify which side has the inner edge
    
    # Look at points before and after the minimum
    before_min = coords[max(0, absolute_min_idx - 5):absolute_min_idx]
    after_min = coords[absolute_min_idx + 1:min(len(coords), absolute_min_idx + 6)]
    
    # Calculate average latitude for each side near the turn
    avg_lat_before = np.mean([c[1] for c in before_min]) if before_min else float('inf')
    avg_lat_after = np.mean([c[1] for c in after_min]) if after_min else float('inf')
    
    # The side with higher average latitude (less south) is the inner edge
    inner_indices = []
    
    # Based on the polygon structure, identify inner edge points
    # The polygon goes down one side and up the other
    mid_point = len(coords) // 2
    
    # Analyze the turn region more carefully
    # Points in the turn region that are not the southernmost are likely inner edge
    for i in range(turn_start, turn_end + 1):
        lat_diff = coords[i][1] - coords[absolute_min_idx][1]
        # If this point is significantly north of the minimum, it's likely inner edge
        if lat_diff > 0.0005:  # About 55 meters
            inner_indices.append(i)
    
    # Also check points just outside the turn region that might need adjustment
    # Check a few points before turn_start
    for i in range(max(0, turn_start - 10), turn_start):
        if coords[i][1] < 56.325 and coords[i][1] > 56.319:
            # This point is near the turn, check if it's on the inner side
            # Compare its longitude with the southernmost point
            if abs(coords[i][0] - coords[absolute_min_idx][0]) < 0.01:
                inner_indices.append(i)
    
    # Check a few points after turn_end
    for i in range(turn_end + 1, min(len(coords), turn_end + 11)):
        if coords[i][1] < 56.325 and coords[i][1] > 56.319:
            if abs(coords[i][0] - coords[absolute_min_idx][0]) < 0.01:
                inner_indices.append(i)
    
    return sorted(set(inner_indices))

def narrow_v_turn(coords: List[List[float]], adjustment: float = 0.001) -> List[List[float]]:
    """
    Narrow the V-turn by moving inner edge points slightly south.
    """
    # Make a copy to avoid modifying the original
    new_coords = [coord[:] for coord in coords]
    
    # Find the V-turn region
    turn_start, turn_end = find_v_turn_region(coords)
    print(f"V-turn region: indices {turn_start} to {turn_end}")
    
    if turn_start == -1:
        print("No V-turn region found")
        return new_coords
    
    # Analyze polygon direction
    direction = analyze_polygon_direction(coords)
    print(f"Polygon direction: {direction}")
    
    # Identify inner edge points
    inner_indices = identify_inner_edge_points(coords, turn_start, turn_end)
    print(f"Found {len(inner_indices)} inner edge points to adjust")
    
    # Adjust the inner edge points
    for idx in inner_indices:
        # Move points south (decrease latitude)
        old_lat = new_coords[idx][1]
        new_coords[idx][1] -= adjustment
        print(f"Point {idx}: lat {old_lat:.6f} -> {new_coords[idx][1]:.6f}")
    
    return new_coords

def main():
    # Read the GeoJSON file
    input_file = '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/red-line-transition-main-lines.geojson'
    output_file = '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/red-line-transition-main-lines-fixed.geojson'
    
    print(f"Reading {input_file}")
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Process Feature 0 (eastern line)
    if len(data['features']) > 0:
        feature = data['features'][0]
        print(f"\nProcessing Feature 0: {feature['properties'].get('name', 'Unknown')}")
        
        # Get the coordinates (handling both Polygon and MultiPolygon)
        if feature['geometry']['type'] == 'Polygon':
            coords = feature['geometry']['coordinates'][0]
        elif feature['geometry']['type'] == 'MultiPolygon':
            coords = feature['geometry']['coordinates'][0][0]
        else:
            print(f"Unexpected geometry type: {feature['geometry']['type']}")
            return
        
        print(f"Original polygon has {len(coords)} points")
        
        # Narrow the V-turn
        new_coords = narrow_v_turn(coords, adjustment=0.0015)  # About 165 meters
        
        # Update the coordinates
        if feature['geometry']['type'] == 'Polygon':
            feature['geometry']['coordinates'][0] = new_coords
        else:
            feature['geometry']['coordinates'][0][0] = new_coords
        
        # Save the result
        print(f"\nSaving to {output_file}")
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Done!")
    else:
        print("No features found in the GeoJSON file")

if __name__ == "__main__":
    main()
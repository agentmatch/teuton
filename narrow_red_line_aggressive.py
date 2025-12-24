import json
import numpy as np
from typing import List, Tuple

def find_polygon_center_line(coords: List[List[float]], start_idx: int, end_idx: int) -> List[Tuple[float, float]]:
    """Find approximate center line of polygon section by averaging opposite points."""
    section = coords[start_idx:end_idx+1]
    n = len(section)
    center_points = []
    
    # For each point in first half, find corresponding point in second half
    for i in range(n // 2):
        p1 = section[i]
        p2 = section[n - 1 - i]
        center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]
        center_points.append(center)
    
    return center_points

def narrow_polygon_at_turn(coordinates: List[List[float]], lat_threshold: float = 56.32, narrow_factor: float = 0.3):
    """Aggressively narrow the polygon at the sharp turn."""
    coords = coordinates[0]  # Get the outer ring
    
    print(f"Total points in polygon: {len(coords)}")
    
    # Find indices where latitude is around the sharp turn
    turn_indices = []
    for i, coord in enumerate(coords):
        if 56.316 <= coord[1] <= 56.322:  # Broader range around the turn
            turn_indices.append(i)
    
    if not turn_indices:
        print("No points found in the turn area!")
        return coordinates
    
    print(f"Found {len(turn_indices)} points in turn area")
    print(f"Turn area spans indices {turn_indices[0]} to {turn_indices[-1]}")
    
    # Expand the area to include more points before and after the turn
    start_idx = max(0, turn_indices[0] - 20)
    end_idx = min(len(coords) - 1, turn_indices[-1] + 20)
    
    # Find approximate center line for this section
    center_line = find_polygon_center_line(coords, start_idx, end_idx)
    
    # Create new coordinates with aggressive narrowing
    new_coords = coords.copy()
    
    # Process points in the turn area
    for idx in range(start_idx, end_idx + 1):
        coord = coords[idx]
        
        # Find nearest center point
        min_dist = float('inf')
        nearest_center = None
        for center in center_line:
            dist = ((coord[0] - center[0])**2 + (coord[1] - center[1])**2)**0.5
            if dist < min_dist:
                min_dist = dist
                nearest_center = center
        
        if nearest_center:
            # Calculate how much we're in the turn area (0 to 1)
            if 56.318 <= coord[1] <= 56.321:
                turn_intensity = 1.0  # Maximum narrowing at the sharpest part
            elif 56.316 <= coord[1] <= 56.323:
                # Gradual transition
                if coord[1] < 56.318:
                    turn_intensity = (coord[1] - 56.316) / (56.318 - 56.316)
                else:
                    turn_intensity = (56.323 - coord[1]) / (56.323 - 56.321)
            else:
                turn_intensity = 0.0
            
            # Apply aggressive narrowing
            if turn_intensity > 0:
                # Move point much closer to center
                factor = narrow_factor * turn_intensity  # Use narrow_factor (0.3 = keep only 30% of distance)
                new_x = nearest_center[0] + (coord[0] - nearest_center[0]) * factor
                new_y = nearest_center[1] + (coord[1] - nearest_center[1]) * factor
                new_coords[idx] = [new_x, new_y]
                
                # Print some debug info for the most affected points
                if turn_intensity > 0.8:
                    print(f"Point {idx}: moved from {coord} to {new_coords[idx]} (intensity: {turn_intensity:.2f})")
    
    return [new_coords]

def main():
    # Read the GeoJSON file
    input_file = '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/red-line-transition-main-lines.geojson'
    output_file = '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/red-line-transition-main-lines-narrow.geojson'
    
    print(f"Reading from: {input_file}")
    
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Process Feature 0 (eastern line)
    if len(data['features']) > 0:
        feature = data['features'][0]
        print(f"\nProcessing Feature 0: {feature.get('properties', {})}")
        
        if feature['geometry']['type'] == 'Polygon':
            original_coords = feature['geometry']['coordinates']
            
            # Apply aggressive narrowing (keeping only 30% of the width at the turn)
            new_coords = narrow_polygon_at_turn(original_coords, narrow_factor=0.3)
            
            # Update the coordinates
            feature['geometry']['coordinates'] = new_coords
            
            print("\nNarrowing complete!")
    
    # Save the modified GeoJSON
    print(f"\nSaving to: {output_file}")
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Done!")

if __name__ == "__main__":
    main()
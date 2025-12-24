#!/usr/bin/env python3
"""
Extract red line from Fiji-Goliath-Regional-Map.tif and convert to GeoJSON
"""

import cv2
import numpy as np
import json
from PIL import Image
import rasterio
from rasterio.warp import transform_bounds
from affine import Affine

def extract_red_line_from_tif(input_path, output_path):
    """
    Extract red line from TIF image and convert to GeoJSON
    """
    
    # First, try to read georeferencing information if available
    try:
        with rasterio.open(input_path) as src:
            # Get the transform and CRS if available
            transform = src.transform
            crs = src.crs
            bounds = src.bounds
            print(f"Image CRS: {crs}")
            print(f"Image bounds: {bounds}")
            has_georef = True
    except:
        print("No georeferencing information found in TIF")
        has_georef = False
    
    # Read the image using OpenCV
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error: Could not read image from {input_path}")
        return
    
    print(f"Image shape: {img.shape}")
    
    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Define red color range in RGB
    # Pure red is (255, 0, 0), but we'll allow some tolerance
    lower_red = np.array([150, 0, 0])
    upper_red = np.array([255, 100, 100])
    
    # Create mask for red pixels
    mask = cv2.inRange(img_rgb, lower_red, upper_red)
    
    # Also check for darker reds
    lower_dark_red = np.array([100, 0, 0])
    upper_dark_red = np.array([150, 50, 50])
    mask_dark = cv2.inRange(img_rgb, lower_dark_red, upper_dark_red)
    
    # Combine masks
    mask = cv2.bitwise_or(mask, mask_dark)
    
    # Apply morphological operations to clean up the mask
    kernel = np.ones((3, 3), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"Found {len(contours)} contours")
    
    # Filter contours by size (remove small noise)
    min_contour_length = 50  # Minimum number of points
    filtered_contours = [c for c in contours if len(c) >= min_contour_length]
    
    print(f"Filtered to {len(filtered_contours)} significant contours")
    
    # Convert contours to GeoJSON features
    features = []
    
    for i, contour in enumerate(filtered_contours):
        # Simplify the contour using Douglas-Peucker algorithm
        epsilon = 2.0  # Adjust this value to control simplification
        simplified = cv2.approxPolyDP(contour, epsilon, False)
        
        # Convert to coordinates
        coords = []
        for point in simplified:
            x, y = point[0]
            
            if has_georef:
                # Convert pixel coordinates to geographic coordinates
                lon, lat = transform * (x, y)
                coords.append([lon, lat])
            else:
                # No georeferencing, use pixel coordinates
                # We'll need to manually georeference later
                coords.append([float(x), float(y)])
        
        # Create GeoJSON feature
        if len(coords) >= 2:  # Need at least 2 points for a line
            feature = {
                "type": "Feature",
                "properties": {
                    "FID": i,
                    "name": f"Red Line Segment {i+1}",
                    "color": "#FF0000",
                    "type": "redline",
                    "source": "Fiji-Goliath-Regional-Map.tif"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": coords
                }
            }
            features.append(feature)
    
    # Create FeatureCollection
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Save to file
    with open(output_path, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"Saved {len(features)} line segments to {output_path}")
    
    # Also save the mask for visualization
    mask_path = output_path.replace('.geojson', '_mask.png')
    cv2.imwrite(mask_path, mask)
    print(f"Saved mask visualization to {mask_path}")
    
    # If no georeferencing, provide instructions
    if not has_georef:
        print("\nNOTE: The TIF file does not contain georeferencing information.")
        print("The coordinates in the GeoJSON are in pixel space.")
        print("You will need to manually georeference the data using known control points.")
        print("\nSuggested next steps:")
        print("1. Identify known locations on the map (e.g., property boundaries)")
        print("2. Get their real-world coordinates")
        print("3. Use these control points to transform the pixel coordinates to geographic coordinates")

if __name__ == "__main__":
    input_file = "Fiji-Goliath-Regional-Map.tif"
    output_file = "fiji-goliath-red-line.geojson"
    
    extract_red_line_from_tif(input_file, output_file)
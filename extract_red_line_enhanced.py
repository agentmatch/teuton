#!/usr/bin/env python3
"""
Enhanced extraction of red line from Fiji-Goliath-Regional-Map.tif
This version uses broader color detection to catch all red line segments
"""

import cv2
import numpy as np
import json
from PIL import Image
import rasterio
from pyproj import Transformer

def extract_red_line_enhanced(input_path, output_path):
    """
    Extract red line with enhanced color detection
    """
    
    # Read georeferencing information
    with rasterio.open(input_path) as src:
        transform = src.transform
        crs = src.crs
        bounds = src.bounds
        print(f"Image CRS: {crs}")
        print(f"Image bounds: {bounds}")
    
    # Read the image
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error: Could not read image from {input_path}")
        return
    
    print(f"Image shape: {img.shape}")
    
    # Convert BGR to RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    # Convert to HSV for better color detection
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Define multiple red ranges in HSV
    # Red wraps around in HSV, so we need two ranges
    lower_red1 = np.array([0, 50, 50])
    upper_red1 = np.array([10, 255, 255])
    
    lower_red2 = np.array([170, 50, 50])
    upper_red2 = np.array([180, 255, 255])
    
    # Also check for darker/lighter reds in RGB
    lower_rgb_red = np.array([100, 0, 0])
    upper_rgb_red = np.array([255, 100, 100])
    
    # Create masks
    mask_hsv1 = cv2.inRange(img_hsv, lower_red1, upper_red1)
    mask_hsv2 = cv2.inRange(img_hsv, lower_red2, upper_red2)
    mask_rgb = cv2.inRange(img_rgb, lower_rgb_red, upper_rgb_red)
    
    # Combine all masks
    mask = cv2.bitwise_or(mask_hsv1, mask_hsv2)
    mask = cv2.bitwise_or(mask, mask_rgb)
    
    # Apply morphological operations to connect nearby segments
    kernel_connect = np.ones((5, 5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_connect, iterations=2)
    
    # Clean up small noise
    kernel_clean = np.ones((2, 2), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel_clean)
    
    # Apply dilation to make lines slightly thicker
    kernel_dilate = np.ones((3, 3), np.uint8)
    mask = cv2.dilate(mask, kernel_dilate, iterations=1)
    
    # Save enhanced mask for visualization
    mask_path = output_path.replace('.geojson', '_enhanced_mask.png')
    cv2.imwrite(mask_path, mask)
    print(f"Saved enhanced mask to {mask_path}")
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"Found {len(contours)} contours")
    
    # Sort contours by area to get the most significant ones
    contours = sorted(contours, key=cv2.contourArea, reverse=True)
    
    # Filter contours by size (lower threshold to catch smaller segments)
    min_contour_length = 20  # Reduced from 50
    filtered_contours = [c for c in contours if len(c) >= min_contour_length]
    
    print(f"Filtered to {len(filtered_contours)} significant contours")
    
    # Create transformer from Web Mercator to WGS84
    transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)
    
    # Convert contours to GeoJSON features
    features = []
    
    for i, contour in enumerate(filtered_contours):
        # Simplify the contour
        epsilon = 1.5  # Slightly less aggressive simplification
        simplified = cv2.approxPolyDP(contour, epsilon, False)
        
        # Convert to coordinates
        coords = []
        for point in simplified:
            x, y = point[0]
            
            # Convert pixel coordinates to geographic coordinates
            geo_x, geo_y = transform * (x, y)
            lon, lat = transformer.transform(geo_x, geo_y)
            coords.append([lon, lat])
        
        # Create GeoJSON feature
        if len(coords) >= 2:
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
            
            # Print info about each segment
            if len(coords) > 0:
                print(f"  Segment {i+1}: {len(coords)} points")
                print(f"    Start: [{coords[0][0]:.6f}, {coords[0][1]:.6f}]")
                print(f"    End: [{coords[-1][0]:.6f}, {coords[-1][1]:.6f}]")
    
    # Create FeatureCollection
    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    
    # Save to file
    with open(output_path, 'w') as f:
        json.dump(geojson, f, indent=2)
    
    print(f"\nSaved {len(features)} line segments to {output_path}")
    
    # Also create a debug image showing detected segments
    debug_img = img.copy()
    cv2.drawContours(debug_img, filtered_contours, -1, (0, 255, 0), 2)
    debug_path = output_path.replace('.geojson', '_debug.png')
    cv2.imwrite(debug_path, debug_img)
    print(f"Saved debug visualization to {debug_path}")

if __name__ == "__main__":
    input_file = "Fiji-Goliath-Regional-Map.tif"
    output_file = "public/images/fiji-goliath-red-line-enhanced.geojson"
    
    extract_red_line_enhanced(input_file, output_file)
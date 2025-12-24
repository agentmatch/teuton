#!/usr/bin/env python3
"""
Precise extraction of red line from Fiji-Goliath-Regional-Map.tif
This version uses more sensitive detection to capture small segments
"""

import cv2
import numpy as np
import json
from PIL import Image
import rasterio
from pyproj import Transformer

def extract_red_line_precise(input_path, output_path):
    """
    Extract red line with very sensitive detection for small segments
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
    
    # Convert BGR to RGB and HSV
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    
    # Create multiple masks for different shades of red
    masks = []
    
    # HSV red detection (two ranges because red wraps around)
    lower_red1_hsv = np.array([0, 30, 30])
    upper_red1_hsv = np.array([15, 255, 255])
    masks.append(cv2.inRange(img_hsv, lower_red1_hsv, upper_red1_hsv))
    
    lower_red2_hsv = np.array([165, 30, 30])
    upper_red2_hsv = np.array([180, 255, 255])
    masks.append(cv2.inRange(img_hsv, lower_red2_hsv, upper_red2_hsv))
    
    # RGB red detection with multiple ranges
    # Pure red
    lower_rgb1 = np.array([180, 0, 0])
    upper_rgb1 = np.array([255, 80, 80])
    masks.append(cv2.inRange(img_rgb, lower_rgb1, upper_rgb1))
    
    # Darker red
    lower_rgb2 = np.array([120, 0, 0])
    upper_rgb2 = np.array([180, 60, 60])
    masks.append(cv2.inRange(img_rgb, lower_rgb2, upper_rgb2))
    
    # Lighter/pinkish red
    lower_rgb3 = np.array([200, 50, 50])
    upper_rgb3 = np.array([255, 150, 150])
    masks.append(cv2.inRange(img_rgb, lower_rgb3, upper_rgb3))
    
    # Very dark red (almost maroon)
    lower_rgb4 = np.array([80, 0, 0])
    upper_rgb4 = np.array([120, 40, 40])
    masks.append(cv2.inRange(img_rgb, lower_rgb4, upper_rgb4))
    
    # Combine all masks
    combined_mask = masks[0]
    for mask in masks[1:]:
        combined_mask = cv2.bitwise_or(combined_mask, mask)
    
    # Use minimal morphological operations to preserve small segments
    # Just a small closing to connect very close pixels
    kernel_small = np.ones((2, 2), np.uint8)
    combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel_small)
    
    # Save mask for inspection
    mask_path = output_path.replace('.geojson', '_precise_mask.png')
    cv2.imwrite(mask_path, combined_mask)
    print(f"Saved precise mask to {mask_path}")
    
    # Find contours with hierarchy to preserve small segments
    contours, hierarchy = cv2.findContours(combined_mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    print(f"Found {len(contours)} total contours")
    
    # Filter contours - use a very low threshold to catch small segments
    min_contour_length = 5  # Very low threshold
    min_contour_area = 10  # Minimum area to filter out single pixels
    
    filtered_contours = []
    for contour in contours:
        if len(contour) >= min_contour_length or cv2.contourArea(contour) >= min_contour_area:
            filtered_contours.append(contour)
    
    # Sort by area for consistent ordering
    filtered_contours = sorted(filtered_contours, key=cv2.contourArea, reverse=True)
    
    print(f"Filtered to {len(filtered_contours)} contours (including small segments)")
    
    # Create transformer from Web Mercator to WGS84
    transformer = Transformer.from_crs("EPSG:3857", "EPSG:4326", always_xy=True)
    
    # Convert contours to GeoJSON features
    features = []
    
    for i, contour in enumerate(filtered_contours):
        # Use very minimal simplification to preserve shape
        epsilon = 0.5  # Very small epsilon
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
                    "area": float(cv2.contourArea(contour)),
                    "length": len(coords),
                    "source": "Fiji-Goliath-Regional-Map.tif"
                },
                "geometry": {
                    "type": "LineString",
                    "coordinates": coords
                }
            }
            features.append(feature)
            
            # Print info about each segment
            print(f"  Segment {i+1}: {len(coords)} points, area: {cv2.contourArea(contour):.1f}")
            if len(coords) > 0:
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
    
    # Create a debug image showing all detected segments with different colors
    debug_img = img.copy()
    colors = [
        (255, 0, 0),    # Red
        (0, 255, 0),    # Green
        (0, 0, 255),    # Blue
        (255, 255, 0),  # Yellow
        (255, 0, 255),  # Magenta
        (0, 255, 255),  # Cyan
        (128, 255, 0),  # Lime
        (255, 128, 0),  # Orange
    ]
    
    for i, contour in enumerate(filtered_contours[:20]):  # Show first 20
        color = colors[i % len(colors)]
        cv2.drawContours(debug_img, [contour], -1, color, 2)
        # Add label
        M = cv2.moments(contour)
        if M["m00"] != 0:
            cX = int(M["m10"] / M["m00"])
            cY = int(M["m01"] / M["m00"])
            cv2.putText(debug_img, str(i+1), (cX, cY), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
    
    debug_path = output_path.replace('.geojson', '_debug.png')
    cv2.imwrite(debug_path, debug_img)
    print(f"Saved debug visualization to {debug_path}")

if __name__ == "__main__":
    input_file = "Fiji-Goliath-Regional-Map.tif"
    output_file = "public/images/fiji-goliath-red-line-precise.geojson"
    
    extract_red_line_precise(input_file, output_file)
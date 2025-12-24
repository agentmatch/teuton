#!/usr/bin/env python3
"""
Script to verify the narrowing of the V-turn by comparing the original and fixed polygons.
"""

import json
import matplotlib.pyplot as plt

def plot_comparison():
    # Read both files
    original_file = '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/red-line-transition-main-lines.geojson'
    fixed_file = '/Users/romanalexander/luxorwebsitelaunch/luxor-metals/public/images/red-line-transition-main-lines-fixed.geojson'
    
    with open(original_file, 'r') as f:
        original_data = json.load(f)
    
    with open(fixed_file, 'r') as f:
        fixed_data = json.load(f)
    
    # Get coordinates for Feature 0
    if original_data['features'][0]['geometry']['type'] == 'Polygon':
        orig_coords = original_data['features'][0]['geometry']['coordinates'][0]
        fixed_coords = fixed_data['features'][0]['geometry']['coordinates'][0]
    else:
        orig_coords = original_data['features'][0]['geometry']['coordinates'][0][0]
        fixed_coords = fixed_data['features'][0]['geometry']['coordinates'][0][0]
    
    # Extract coordinates for the V-turn region
    lat_threshold = 56.325
    
    # Filter to V-turn region
    orig_turn = [(lon, lat) for lon, lat in orig_coords if lat < lat_threshold]
    fixed_turn = [(lon, lat) for lon, lat in fixed_coords if lat < lat_threshold]
    
    # Create plot
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 8))
    
    # Plot original
    if orig_turn:
        lons, lats = zip(*orig_turn)
        ax1.plot(lons, lats, 'b-', linewidth=2, label='Original')
        ax1.scatter(lons, lats, c='blue', s=10, alpha=0.5)
    ax1.set_title('Original V-turn')
    ax1.set_xlabel('Longitude')
    ax1.set_ylabel('Latitude')
    ax1.grid(True, alpha=0.3)
    ax1.legend()
    
    # Plot comparison
    if orig_turn:
        lons, lats = zip(*orig_turn)
        ax2.plot(lons, lats, 'b-', linewidth=2, alpha=0.5, label='Original')
    if fixed_turn:
        lons, lats = zip(*fixed_turn)
        ax2.plot(lons, lats, 'r-', linewidth=2, label='Fixed (narrowed)')
        ax2.scatter(lons, lats, c='red', s=10, alpha=0.5)
    ax2.set_title('Comparison: Original vs Fixed')
    ax2.set_xlabel('Longitude')
    ax2.set_ylabel('Latitude')
    ax2.grid(True, alpha=0.3)
    ax2.legend()
    
    plt.tight_layout()
    plt.savefig('/Users/romanalexander/luxorwebsitelaunch/luxor-metals/v_turn_comparison.png', dpi=150)
    print("Saved comparison plot to v_turn_comparison.png")
    
    # Print statistics
    print(f"\nOriginal V-turn points: {len(orig_turn)}")
    print(f"Fixed V-turn points: {len(fixed_turn)}")
    
    # Calculate the narrowing at the southernmost point
    orig_min_lat = min(lat for _, lat in orig_turn)
    fixed_min_lat = min(lat for _, lat in fixed_turn)
    print(f"\nSouthernmost latitude:")
    print(f"  Original: {orig_min_lat:.6f}")
    print(f"  Fixed: {fixed_min_lat:.6f}")
    print(f"  Difference: {(orig_min_lat - fixed_min_lat) * 111000:.1f} meters north")

if __name__ == "__main__":
    plot_comparison()
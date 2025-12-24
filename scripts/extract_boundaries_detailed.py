import pdfplumber
import json
from pathlib import Path
import re

def extract_luxor_boundaries(pdf_path):
    """Extract Luxor project specific boundary data from the PDF"""
    
    luxor_data = {
        "project_name": "Luxor Project",
        "properties": {},
        "boundaries": [],
        "total_area": "20,481 hectares",
        "coordinate_system": "NAD 83 Zone 9N"
    }
    
    # Property names to look for
    property_names = ["Tennyson", "Big Gold", "4 J's", "Eskay Rift", "Leduc", "Pearson"]
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            page = pdf.pages[0]  # The map is on the first page
            
            # Extract all shapes/paths
            if hasattr(page, 'curves'):
                print(f"Processing {len(page.curves)} curves...")
                
                # Group curves by color and area to identify potential boundaries
                boundary_candidates = []
                
                for curve in page.curves:
                    # Look for larger shapes that could be property boundaries
                    if hasattr(curve, 'pts') and len(curve['pts']) > 10:
                        # Calculate bounding box
                        points = curve['pts']
                        xs = [p[0] for p in points]
                        ys = [p[1] for p in points]
                        
                        width = max(xs) - min(xs)
                        height = max(ys) - min(ys)
                        area = width * height
                        
                        # Look for reasonably sized shapes
                        if area > 100:  # Adjust threshold as needed
                            boundary_candidates.append({
                                'points': points,
                                'bbox': {
                                    'x0': min(xs),
                                    'y0': min(ys),
                                    'x1': max(xs),
                                    'y1': max(ys)
                                },
                                'area': area,
                                'color': curve.get('non_stroking_color', 'unknown'),
                                'stroke_color': curve.get('stroking_color', 'unknown')
                            })
                
                print(f"Found {len(boundary_candidates)} potential boundary shapes")
                
                # Sort by area to identify main boundaries
                boundary_candidates.sort(key=lambda x: x['area'], reverse=True)
                
                # Take the largest shapes as property boundaries
                for i, boundary in enumerate(boundary_candidates[:10]):  # Top 10 largest
                    luxor_data['boundaries'].append({
                        'id': f'boundary_{i}',
                        'points': [[p[0], p[1]] for p in boundary['points'][:20]],  # Limit points for readability
                        'bbox': boundary['bbox'],
                        'area': boundary['area']
                    })
            
            # Extract text to find property locations
            chars = page.chars
            
            # Find text mentions of our properties
            for prop_name in property_names:
                prop_chars = []
                
                for i, char in enumerate(chars):
                    # Look for property name
                    if char.get('text', '').upper() == prop_name[0].upper():
                        # Check if full property name matches
                        match_text = ''.join([c.get('text', '') for c in chars[i:i+len(prop_name)]])
                        if match_text.upper() == prop_name.upper():
                            # Get position of property name
                            x = char['x0']
                            y = char['y0']
                            
                            luxor_data['properties'][prop_name] = {
                                'name': prop_name,
                                'text_position': {'x': x, 'y': y},
                                'page_location': f"Found at ({x:.1f}, {y:.1f})"
                            }
                            
                            print(f"Found {prop_name} at position ({x:.1f}, {y:.1f})")
                            break
            
            # Extract any visible coordinate information
            text = page.extract_text()
            
            # Look for UTM coordinates or lat/lon
            coord_patterns = [
                r'(\d+)°(\d+)[\'′](\d+(?:\.\d+)?)[\"″]?\s*[NS]',  # Latitude
                r'(\d+)°(\d+)[\'′](\d+(?:\.\d+)?)[\"″]?\s*[EW]',  # Longitude
                r'UTM\s*[:]*\s*(\d+)\s*[EN]\s*(\d+)\s*[EN]',  # UTM coordinates
                r'(\d{6,7})\s*[mE]\s*(\d{6,7})\s*[mN]'  # UTM in meters
            ]
            
            for pattern in coord_patterns:
                matches = re.findall(pattern, text)
                if matches:
                    print(f"Found coordinate matches: {matches}")
            
            # Look for scale information
            scale_match = re.search(r'(\d+)\s*(?:km|kilometers|Kilometers)', text)
            if scale_match:
                luxor_data['scale'] = f"{scale_match.group(1)} km"
                print(f"Map scale: {scale_match.group(1)} km")
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return None
    
    return luxor_data

def create_boundary_visualization(luxor_data):
    """Create a simplified boundary representation for the React component"""
    
    visualization_data = {
        'properties': [],
        'boundaries': []
    }
    
    # If we found property text positions, use them
    for prop_name, prop_data in luxor_data['properties'].items():
        if 'text_position' in prop_data:
            visualization_data['properties'].append({
                'name': prop_name,
                'x': prop_data['text_position']['x'],
                'y': prop_data['text_position']['y']
            })
    
    # Convert boundary points to a simpler format
    for boundary in luxor_data['boundaries'][:6]:  # Limit to 6 boundaries for 6 properties
        simplified_points = []
        points = boundary['points']
        
        # Take every nth point to simplify
        step = max(1, len(points) // 20)  # Max 20 points per boundary
        for i in range(0, len(points), step):
            simplified_points.append(points[i])
        
        visualization_data['boundaries'].append({
            'id': boundary['id'],
            'points': simplified_points,
            'bbox': boundary['bbox']
        })
    
    return visualization_data

if __name__ == "__main__":
    pdf_path = Path("/Users/romanalexander/luxorwebsitelaunch/luxor-metals/luxormap.pdf")
    output_path = Path("/Users/romanalexander/luxorwebsitelaunch/luxor-metals/luxor_boundaries_detailed.json")
    viz_output_path = Path("/Users/romanalexander/luxorwebsitelaunch/luxor-metals/luxor_boundaries_viz.json")
    
    print(f"Extracting Luxor boundaries from: {pdf_path}")
    
    data = extract_luxor_boundaries(pdf_path)
    if data:
        # Save detailed data
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"\nSaved detailed results to {output_path}")
        
        # Create visualization data
        viz_data = create_boundary_visualization(data)
        with open(viz_output_path, 'w') as f:
            json.dump(viz_data, f, indent=2)
        print(f"Saved visualization data to {viz_output_path}")
        
        # Print summary
        print("\n=== SUMMARY ===")
        print(f"Found {len(data['properties'])} property text positions")
        print(f"Found {len(data['boundaries'])} potential boundary shapes")
        print(f"Project area: {data['total_area']}")
        print(f"Coordinate system: {data['coordinate_system']}")
        
        print("\nProperty Locations:")
        for prop_name, prop_data in data['properties'].items():
            print(f"  - {prop_name}: {prop_data.get('page_location', 'Not found')}")
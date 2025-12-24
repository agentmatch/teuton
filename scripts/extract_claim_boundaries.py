import pdfplumber
import json
from pathlib import Path

def extract_claim_boundaries(pdf_path):
    """Extract claim boundary data from the Luxor map PDF"""
    
    boundaries_data = {
        "properties": [],
        "total_area": None,
        "coordinates": [],
        "extracted_text": []
    }
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"PDF has {len(pdf.pages)} pages")
            
            for page_num, page in enumerate(pdf.pages):
                print(f"\nProcessing page {page_num + 1}")
                
                # Extract text
                text = page.extract_text()
                if text:
                    boundaries_data["extracted_text"].append({
                        "page": page_num + 1,
                        "text": text
                    })
                    print(f"Extracted {len(text)} characters of text")
                
                # Extract tables
                tables = page.extract_tables()
                if tables:
                    print(f"Found {len(tables)} tables")
                    for table_idx, table in enumerate(tables):
                        print(f"Table {table_idx + 1} has {len(table)} rows")
                        for row in table[:5]:  # Show first 5 rows
                            print(f"  {row}")
                
                # Extract coordinates from drawings/vectors
                if hasattr(page, 'curves') and page.curves:
                    print(f"Found {len(page.curves)} curves")
                    for curve in page.curves[:5]:  # Show first 5 curves
                        boundaries_data["coordinates"].append({
                            "type": "curve",
                            "points": str(curve)
                        })
                
                if hasattr(page, 'lines') and page.lines:
                    print(f"Found {len(page.lines)} lines")
                    # Extract coordinate data from lines
                    for line in page.lines[:10]:  # Show first 10 lines
                        if hasattr(line, 'x0'):
                            boundaries_data["coordinates"].append({
                                "type": "line",
                                "x0": line.x0,
                                "y0": line.y0,
                                "x1": line.x1,
                                "y1": line.y1
                            })
                
                # Try to extract any embedded images
                if hasattr(page, 'images'):
                    images = list(page.images)
                    if images:
                        print(f"Found {len(images)} images")
                
                # Look for specific keywords in text
                if text:
                    keywords = ['hectares', 'claim', 'boundary', 'coordinates', 'UTM', 'NAD', 
                               'Tennyson', 'Big Gold', "4 J's", 'Eskay Rift', 'Leduc', 'Pearson']
                    for keyword in keywords:
                        if keyword.lower() in text.lower():
                            print(f"Found keyword: {keyword}")
                            # Extract context around keyword
                            lines = text.split('\n')
                            for i, line in enumerate(lines):
                                if keyword.lower() in line.lower():
                                    context_start = max(0, i-2)
                                    context_end = min(len(lines), i+3)
                                    context = '\n'.join(lines[context_start:context_end])
                                    print(f"Context for {keyword}:")
                                    print(context)
                                    print("-" * 40)
    
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return None
    
    return boundaries_data

def save_results(data, output_path):
    """Save extracted data to JSON file"""
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"\nSaved results to {output_path}")

if __name__ == "__main__":
    pdf_path = Path("/Users/romanalexander/luxorwebsitelaunch/luxor-metals/luxormap.pdf")
    output_path = Path("/Users/romanalexander/luxorwebsitelaunch/luxor-metals/extracted_boundaries.json")
    
    print(f"Extracting claim boundaries from: {pdf_path}")
    
    data = extract_claim_boundaries(pdf_path)
    if data:
        save_results(data, output_path)
        
        # Print summary
        print("\n=== SUMMARY ===")
        print(f"Extracted text from {len(data['extracted_text'])} pages")
        print(f"Found {len(data['coordinates'])} coordinate objects")
        
        # Show first few lines of extracted text
        if data['extracted_text']:
            print("\nFirst page text preview:")
            first_page_text = data['extracted_text'][0]['text']
            print(first_page_text[:500] + "..." if len(first_page_text) > 500 else first_page_text)
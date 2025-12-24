# Satellite Map Setup Guide

## Quick Start (5 minutes)

To enable real satellite imagery for your Luxor Metals map:

### 1. Get a Mapbox Token (Free)

1. Go to [https://account.mapbox.com/auth/signup/](https://account.mapbox.com/auth/signup/)
2. Sign up for a free account
3. Once logged in, your default public token will be shown on the dashboard
4. Copy this token (starts with `pk.`)

### 2. Add Token to Your Project

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add this line:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
   ```
3. Save the file
4. Restart your development server (`npm run dev`)

### 3. That's it!

The map will now show:
- High-resolution satellite imagery of BC's Golden Triangle
- Smooth zoom animation from regional to property view
- Luxor's claim boundaries highlighted
- Major nearby projects with pulsing markers
- Real terrain and geographical features

## Current Configuration

The map is configured to show:
- **Center**: Golden Triangle, BC (Stewart area)
- **Major Projects**: KSM, Brucejack, Treaty Creek, Eskay Creek, Red Chris
- **Luxor Properties**: Placeholder boundaries (update with actual claim data)

## Customizing Your Map

### Update Property Boundaries

Edit `/components/landing/SatellitePropertyMap.tsx`:

```javascript
const LUXOR_BOUNDARIES = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Your Property Name' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          // Add your actual coordinates here
          [-130.35, 56.85],
          [-130.25, 56.85],
          // ... more coordinates
        ]]
      }
    }
  ]
}
```

### Getting Accurate Claim Boundaries

1. **BC Government Data**:
   - Visit [BC Data Catalogue](https://catalogue.data.gov.bc.ca/)
   - Search for "mineral titles"
   - Download KML/GeoJSON for your claims
   
2. **Convert to GeoJSON**:
   - Use [geojson.io](https://geojson.io) to convert/edit
   - Copy the coordinates into your component

### Alternative Data Sources

If you prefer not to use Mapbox:

1. **Google Maps**: Update to use Google Maps API
2. **OpenStreetMap**: Free, no token required
3. **Static Image**: Use a high-res screenshot from Google Earth Pro

## Fallback Visualization

If no token is provided, the site automatically uses the Three.js 3D visualization instead, which still looks professional but doesn't show real satellite imagery.

## Support

- Mapbox Documentation: https://docs.mapbox.com/
- BC Mineral Titles: https://www.mtonline.gov.bc.ca/
- Need help? Check the console for error messages
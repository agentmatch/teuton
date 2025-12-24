# Quick Reference - Common Edit Locations

## SatellitePropertyMap.tsx

### Mobile UI Elements
- **Mobile Logo Position**: Line 3538 - `left: '16px'` (matches hamburger spacing)
- **Mobile Logo Size**: Lines 3543-3544 - width/height settings
- **Mobile Logo Top Position**: Lines 3540-3542 - top offset calculation
- **Hamburger Button Position**: Line 3628 - `right: '16px'`
- **Hero Headline Position**: Line 2482 - mobile top position
- **Hero Headline Gyroscopic**: Lines 2520-2523 - transform effect

### Mobile Navigation
- **AlwaysVisibleMobileNav Import**: Line 11
- **AlwaysVisibleMobileNav Usage**: Lines 4510-4537
- **Original MobileNav**: Disabled (line 4540: `{false && isMobile`)
- **Map Container**: Lines 1630-1650 - No bottom padding (fixed black bar)
- **MobileNav Component**: `/components/landing/MobileNav.tsx`
- **AlwaysVisibleMobileNav Component**: `/components/landing/AlwaysVisibleMobileNav.tsx`

### Property Descriptions
- **PROPERTY_DESCRIPTIONS Object**: Lines 18-27
- **Property Headline Display**: Lines 3572-3584 (includes padding alignment)
- **Description Box Display**: Lines 3585-3607

### Map Settings
- **Mobile Zoom Settings**: 
  - Initial zoom: Line 1200 - `maxZoom: window.innerWidth >= 390 ? 17.25 : 14.35`
  - Overview bounds: Lines 200-226 - `fitMobileOverviewBounds` function

### Device Orientation
- **Permission Prompt UI**: Lines 4513-4655
- **Enable Motion Button**: Lines 4586-4626
- **Request Permission Function**: Lines 231-253
- **Orientation State**: Lines 99-101
- **iOS Detection**: Lines 317-325

### Stats Section
- **Mobile Stats Display**: Lines 2757-2832
- **Number Font Sizes**: Line 2788
- **Label Font Sizes**: Line 2806

### Major Project Labels
- **Desktop Positions**: Lines 865-871
- **Mobile Positions**: Lines 874-880
- **Label Font Size**: Line 1038

## Common CSS Values
- **Luxor Gold**: `#FFFF77`
- **Cream Text**: `#FAF5E4` or `rgba(250, 245, 228, 0.9)`
- **Glassmorphic Background**: 
  ```javascript
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.025) 100%)',
  backdropFilter: 'blur(20px) saturate(180%) brightness(1.1)',
  ```

## Update this file when making changes!
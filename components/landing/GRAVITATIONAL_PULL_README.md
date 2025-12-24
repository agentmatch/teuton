# LandingGravitationalPull Component

A sophisticated 3D WebGL visualization showing mining deposits as celestial bodies in the Golden Triangle region, with Luxor at the center.

## Features

### 1. 3D Scene Setup
- Deep space environment with procedurally generated stars
- Dynamic lighting system with ambient, directional, point, and volumetric spot lights
- Post-processing effects including bloom, chromatic aberration, and vignette

### 2. Deposit Visualization
- **KSM**: Largest deposit (3x Luxor size), spherical shape with copper-gold coloring
- **Eskay Creek**: Medium crystalline octahedron with silver-white appearance
- **Brucejack**: Active gold mine with dodecahedron shape
- **Granduc**: Historic copper producer with green patina
- **Smaller neighbors**: Scottie, Treaty Creek represented as smaller objects
- **Luxor**: Central semi-transparent faceted gem with inner glow

### 3. Visual Effects
- Gravitational field distortion sphere
- Distance rings at 10km, 25km, and 50km
- Eskay Rift visualization as animated aurora ribbon
- Particle systems emitting metal-specific particles
- Floating animation for all deposits

### 4. Interactions
- **Hover Effects**: Deposits grow and brighten, display info panels
- **Click Actions**: Zoom to deposit details in modal
- **Camera Controls**: Full orbit, pan, and zoom capabilities
- **View Modes**: Default, size comparison, distance visualization

### 5. Animations
- Initial 5-second load sequence with fade-in
- Continuous rotation of deposits
- Particle emission and movement
- Scroll-based camera zoom
- Smooth hover transitions

## Usage

```tsx
import LandingGravitationalPull from '@/components/landing/LandingGravitationalPull'

export default function Page() {
  return <LandingGravitationalPull />
}
```

## Performance Optimizations

1. **Instanced Rendering**: Particles use instanced buffer geometries
2. **LOD System**: Automatic level-of-detail for complex geometries
3. **Frustum Culling**: Built-in Three.js optimization
4. **Texture Atlasing**: Shared materials where possible
5. **RAF Throttling**: Frame rate limited animations

## Customization

### Adding New Deposits
```tsx
const deposits: DepositData[] = [
  {
    name: 'New Deposit',
    position: [x, y, z],
    size: 2.0,
    color: '#FFD700',
    metalType: 'gold',
    description: 'Description here',
    metrics: {
      grade: '1.0 g/t Au',
      resources: '1M oz Au',
      distance: '10km from Luxor'
    }
  }
]
```

### Modifying Visual Effects
- Adjust bloom intensity in EffectComposer
- Change particle count in ParticleSystem
- Modify distance ring radii
- Customize shader materials for unique effects

## Dependencies
- `three`: Core 3D library
- `@react-three/fiber`: React renderer for Three.js
- `@react-three/drei`: Helper components
- `@react-three/postprocessing`: Visual effects
- `framer-motion`: Animation library

## Browser Requirements
- WebGL 2.0 support
- Modern GPU recommended
- Chrome/Edge/Firefox/Safari latest versions
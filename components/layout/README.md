# HeaderAwareContent Component Usage

This component automatically detects when light content scrolls under the header and applies darkening.

## Usage Example:

```jsx
import { HeaderAwareContent } from '@/components/layout/HeaderAwareContent'

export default function MyPage() {
  return (
    <div>
      {/* Light content that should darken under header */}
      <HeaderAwareContent isLightContent={true} className="bg-white py-8">
        <h1>This is light content</h1>
        <p>This section will automatically darken when scrolling under the header</p>
      </HeaderAwareContent>

      {/* Dark content doesn't need special handling */}
      <div className="bg-gray-900 py-8">
        <h2>This is dark content</h2>
        <p>No changes needed for dark backgrounds</p>
      </div>
    </div>
  )
}
```

## How it works:

1. **Automatic Detection**: Uses scroll position and getBoundingClientRect() to detect when light content is under the header
2. **Dynamic Styling**: Only applies darkening when needed
3. **Performance Optimized**: Uses requestAnimationFrame for smooth scroll performance
4. **Header Unaffected**: Header remains completely unchanged

## Props:

- `isLightContent`: Set to `true` for sections with light backgrounds
- `className`: Standard CSS classes
- `children`: Content to wrap
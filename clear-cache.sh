#!/bin/bash

echo "🧹 Clearing all caches for fresh development..."
echo ""

# Kill any running Next.js processes
echo "📍 Stopping any running Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
sleep 1

# Clear Next.js cache
echo "🗑️  Removing .next directory..."
rm -rf .next

# Clear node_modules cache
echo "🗑️  Clearing node_modules cache..."
rm -rf node_modules/.cache

# Clear TypeScript cache
echo "🗑️  Clearing TypeScript cache..."
rm -rf tsconfig.tsbuildinfo

# Clear any temp files
echo "🗑️  Removing temp files..."
find . -name "*.tmp" -type f -delete 2>/dev/null || true
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

echo ""
echo "✅ All caches cleared!"
echo ""
echo "💡 Browser cache tips:"
echo "   • Chrome/Firefox: Cmd+Shift+R (Mac) or Ctrl+Shift+F5 (Windows/Linux)"
echo "   • Open DevTools (F12) → Network tab → ✅ 'Disable cache'"
echo "   • Chrome DevTools → Application → Storage → Clear site data"
echo ""
echo "🚀 Starting fresh development server..."
echo ""

# Start dev server
npm run dev
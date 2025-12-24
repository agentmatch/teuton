#!/bin/bash

echo "🧹 Clearing Next.js development cache..."

# Kill any running Next.js dev servers
echo "Stopping any running dev servers..."
pkill -f "next dev" || true
pkill -f "npm run dev" || true

# Clear Next.js cache
echo "Clearing .next directory..."
rm -rf .next

# Clear node_modules/.cache (babel, webpack, etc.)
echo "Clearing node_modules cache..."
rm -rf node_modules/.cache

# Clear npm cache (optional)
echo "Clearing npm cache..."
npm cache clean --force

# Clear browser cache headers (create a temp file to force reload)
echo "Creating cache-busting timestamp..."
echo "export const CACHE_BUST = '$(date +%s%3N)'" > lib/cache-bust.ts

echo "✅ Cache cleared! Starting dev server..."
npm run dev
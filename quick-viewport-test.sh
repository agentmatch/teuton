#!/bin/bash

echo "🚀 Quick Viewport Test for landingpagekappa"
echo "=========================================="
echo ""

# Create output directories if they don't exist
mkdir -p output/screenshots
mkdir -p output/reports/individual
mkdir -p output/reports/summary

# Check if dev server is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Development server already running on port 3000"
    echo ""
    echo "📱 Running viewport tests..."
    node scripts/capture-iphone-viewports.js --url=http://localhost:3000/landingpagekappa --all
else
    echo "❌ Development server is not running!"
    echo ""
    echo "Please run in separate terminals:"
    echo "  Terminal 1: npm run dev"
    echo "  Terminal 2: ./quick-viewport-test.sh"
fi
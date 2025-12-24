#!/bin/bash

# Setup script for iPhone viewport testing

echo "📱 Setting up iPhone Viewport Testing System..."

# Create output directories
mkdir -p output/screenshots
mkdir -p output/reports/individual
mkdir -p output/reports/summary

# Check if puppeteer is installed
if ! npm list puppeteer >/dev/null 2>&1; then
    echo "📦 Installing puppeteer..."
    npm install --save-dev puppeteer
else
    echo "✅ Puppeteer already installed"
fi

# Make the script executable
chmod +x scripts/capture-iphone-viewports.js

echo ""
echo "✨ Setup complete!"
echo ""
echo "Usage examples:"
echo "  node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --all"
echo "  node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --device=\"iPhone 14 Pro\""
echo "  node scripts/capture-iphone-viewports.js --url=http://localhost:3000 --category=pro"
echo ""
echo "📊 Reports will be generated in output/reports/"
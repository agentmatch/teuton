#!/bin/bash

echo "🚀 Starting Luxor Metals deployment to Vercel..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
npm install

# Build the project
echo ""
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo ""
echo "If this is your first deployment, you'll be asked to:"
echo "1. Set up and deploy: Answer 'Y'"
echo "2. Select scope: Choose your account"
echo "3. Link to existing project: Answer 'N' if first time"
echo "4. Project name: Press enter to accept default or type 'luxor-metals'"
echo "5. Directory: Press enter (current directory)"
echo "6. Override settings: Answer 'N'"
echo ""
echo "Press Enter to continue..."
read

# Deploy to production
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "⚠️  Don't forget to add your environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_MAPBOX_TOKEN"
echo ""
echo "📱 Your site should be live at your Vercel URL!"
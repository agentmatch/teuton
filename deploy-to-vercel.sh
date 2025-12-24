#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Luxor Metals - Vercel Deployment Script${NC}"
echo -e "${BLUE}===========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Check for Mapbox token
if [ -z "$NEXT_PUBLIC_MAPBOX_TOKEN" ]; then
    echo -e "${YELLOW}⚠️  Warning: NEXT_PUBLIC_MAPBOX_TOKEN not found in environment${NC}"
    echo -e "${YELLOW}   The map won't work without it. Add it in Vercel dashboard after deployment.${NC}"
    echo ""
fi

# Clean previous build
echo -e "${BLUE}🧹 Cleaning previous build...${NC}"
rm -rf .next

# Build the project
echo -e "${BLUE}🔨 Building the project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix the errors above and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📥 Installing Vercel CLI...${NC}"
    npm i -g vercel
fi

# Deploy to Vercel
echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
echo ""

# Check if this is the first deployment
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}This appears to be your first deployment.${NC}"
    echo -e "${YELLOW}You'll be asked to:${NC}"
    echo -e "  1. Log in to Vercel (if not already logged in)"
    echo -e "  2. Set up and deploy: Answer ${GREEN}'Y'${NC}"
    echo -e "  3. Select scope: Choose your account"
    echo -e "  4. Link to existing project: Answer ${GREEN}'N'${NC}"
    echo -e "  5. Project name: Type ${GREEN}'luxor-metals'${NC} or press Enter for default"
    echo -e "  6. Directory: Press ${GREEN}Enter${NC} (current directory)"
    echo -e "  7. Override settings: Answer ${GREEN}'N'${NC}"
    echo ""
    echo -e "${BLUE}Press Enter to continue...${NC}"
    read
fi

# Deploy to production
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment complete!${NC}"
    echo ""
    
    # Get the deployment URL from Vercel
    if [ -f ".vercel/project.json" ]; then
        PROJECT_NAME=$(cat .vercel/project.json | grep -o '"name":"[^"]*' | grep -o '[^"]*$')
        echo -e "${GREEN}🌐 Your site should be live at: https://${PROJECT_NAME}.vercel.app${NC}"
    fi
    
    echo ""
    echo -e "${YELLOW}⚠️  Important: Add these environment variables in Vercel dashboard:${NC}"
    echo -e "${YELLOW}   1. Go to your project settings in Vercel${NC}"
    echo -e "${YELLOW}   2. Navigate to 'Environment Variables'${NC}"
    echo -e "${YELLOW}   3. Add: NEXT_PUBLIC_MAPBOX_TOKEN = your_mapbox_token${NC}"
    echo ""
    echo -e "${BLUE}📱 Mobile users will see an optimized responsive layout!${NC}"
    echo -e "${BLUE}💻 Desktop users will see the full interactive experience!${NC}"
else
    echo -e "${RED}❌ Deployment failed. Please check the errors above.${NC}"
    exit 1
fi
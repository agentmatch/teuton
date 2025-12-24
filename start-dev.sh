#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Luxor Metals Dev Server Cleaner${NC}"
echo "=================================="

# Function to kill processes on specific ports
kill_port_processes() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        echo -e "${YELLOW}  Killing processes on port $port${NC}"
        echo "$pids" | xargs kill -9 2>/dev/null
        return 0
    fi
    return 1
}

# Kill processes on all common dev ports
echo -e "${BLUE}🔍 Checking for running processes...${NC}"
killed=0
for port in 3000 3001 3002 3003; do
    if kill_port_processes $port; then
        killed=1
    fi
done

# Kill any nodemon or next dev processes by name
if pgrep -f "nodemon" > /dev/null; then
    echo -e "${YELLOW}  Killing nodemon processes${NC}"
    pkill -f "nodemon" 2>/dev/null
    killed=1
fi

if pgrep -f "next dev" > /dev/null; then
    echo -e "${YELLOW}  Killing next dev processes${NC}"
    pkill -f "next dev" 2>/dev/null
    killed=1
fi

# Clean Next.js cache if requested
if [ "$1" == "--clean-cache" ]; then
    echo -e "${BLUE}🗑️  Cleaning Next.js cache...${NC}"
    rm -rf .next
    rm -rf node_modules/.cache
    echo -e "${GREEN}✅ Cache cleaned${NC}"
fi

if [ $killed -eq 1 ]; then
    echo -e "${GREEN}✅ Cleaned up old processes${NC}"
    sleep 1
else
    echo -e "${GREEN}✅ No existing processes found${NC}"
fi

echo ""
echo -e "${BLUE}🚀 Starting development server...${NC}"
echo -e "${YELLOW}  Port: 3000${NC}"
echo -e "${YELLOW}  Auto-restart: Enabled${NC}"
echo -e "${YELLOW}  Monitor: Enhanced error detection${NC}"
echo ""
echo -e "${GREEN}Tips:${NC}"
echo "  - Type 'rs' to manually restart"
echo "  - The server will auto-restart on file changes"
echo "  - Errors will be analyzed and suggestions provided"
echo ""

# Start with the enhanced monitor
PORT=3000 npm run dev:monitor
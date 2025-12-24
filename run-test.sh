#!/bin/bash

# Navigate to the project directory
cd /Users/romanalexander/luxorwebsitelaunch/luxor-metals

# Start the Next.js development server in the background
echo "Starting Next.js development server..."
npm run dev &
SERVER_PID=$!

# Wait for the server to be ready
echo "Waiting for server to be ready..."
sleep 10

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
    echo "Server might not be ready. Waiting additional time..."
    sleep 10
fi

# Run the viewport testing script
echo "Running iPhone viewport testing..."
node scripts/capture-iphone-viewports.js --url=http://localhost:3000/landingpagekappa --all

# Kill the server
echo "Stopping server..."
kill $SERVER_PID

echo "Test complete!"
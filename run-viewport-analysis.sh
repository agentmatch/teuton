#!/bin/bash

echo "🚀 Starting Next.js development server..."
npm run dev &
SERVER_PID=$!

echo "⏳ Waiting for server to be ready..."
# Wait for the server to be ready
while ! curl -s http://localhost:3000 > /dev/null; do
    sleep 2
done

echo "✅ Server is ready!"
echo "📱 Running viewport testing script..."

# Run the viewport testing script
node scripts/capture-iphone-viewports.js --url=http://localhost:3000/landingpagekappa --all

echo "🛑 Stopping the server..."
kill $SERVER_PID

echo "✨ Done! Check the output/reports directory for results."
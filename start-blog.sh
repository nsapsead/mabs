#!/bin/bash

echo "🚀 Starting MABS Blog System..."
echo ""

# Check if API server is already running
if curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ API server already running on port 3001"
else
    echo "🔄 Starting API server..."
    cd public/api
    npm start &
    API_PID=$!
    echo "✅ API server started (PID: $API_PID)"
    cd ../..
fi

# Check if web server is already running
if curl -s http://localhost:8000 > /dev/null 2>&1; then
    echo "✅ Web server already running on port 8000"
else
    echo "🔄 Starting web server..."
    python3 -m http.server 8000 &
    WEB_PID=$!
    echo "✅ Web server started (PID: $WEB_PID)"
fi

echo ""
echo "🎉 Blog system is ready!"
echo ""
echo "📝 Blog: http://localhost:8000/public/blog.html"
echo "🔧 API: http://localhost:3001/api/blog/posts"
echo ""
echo "📁 Add new blog posts to: /public/blog/"
echo "🖼️ Add images to: /public/assets/img/"
echo "📖 Documentation: /public/blog-README.md"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait

#!/bin/bash

echo "🧹 Cleaning up MABS blog system..."

# Remove old build artifacts
echo "Removing old posts.json files..."
find /Users/nicksapsead/MABS -name "posts.json" -type f -delete 2>/dev/null || true

# Remove old blog build directory
echo "Removing old blog build directory..."
rm -rf /Users/nicksapsead/MABS/blog/posts 2>/dev/null || true

# Remove old blog build files
echo "Removing old build files..."
rm -f /Users/nicksapsead/MABS/blog/posts.json 2>/dev/null || true

# Clean up any temporary files
echo "Removing temporary files..."
find /Users/nicksapsead/MABS -name "*.tmp" -type f -delete 2>/dev/null || true

echo "✅ Blog cleanup complete!"
echo ""
echo "📁 Current blog structure:"
echo "   /public/blog/ - Your markdown files"
echo "   /public/api/ - Dynamic API server"
echo "   /public/assets/img/ - Blog images"
echo ""
echo "🚀 To start the blog system:"
echo "   ./start-blog.sh"


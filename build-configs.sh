# Build Script for Nixi Configurations
# This script builds all example configurations

echo "🏗️  Building Nixi Configurations..."
echo ""

# Build personal dashboard
echo "📊 Building Personal Dashboard..."
node src/cli.js config/dashboard.nixi
if [ -f "dashboard.html" ]; then
    echo "✅ Dashboard built successfully: dashboard.html"
else
    echo "❌ Dashboard build failed"
fi

# Build todo app
echo ""
echo "✅ Building Todo App..."
node src/cli.js config/todo-app.nixi
if [ -f "todo.html" ]; then
    echo "✅ Todo app built successfully: todo.html"
else
    echo "❌ Todo app build failed"
fi

# Build server configuration
echo ""
echo "🖥️  Building Server Configuration..."
node src/cli.js config/server-config.nixi
if [ -f "server-config.html" ]; then
    echo "✅ Server config built successfully: server-config.html"
else
    echo "❌ Server config build failed"
fi

echo ""
echo "🎉 Build process complete!"
echo ""
echo "📁 Generated files:"
ls -la *.html 2>/dev/null || echo "No HTML files found"
echo ""
echo "🌐 Open in browser:"
echo "  firefox dashboard.html"
echo "  firefox todo.html" 
echo "  firefox server-config.html"
# Build Simple Configurations
# Build working Nixi configurations

echo "🏗️  Building Simple Nixi Configurations..."
echo ""

# Build simple dashboard
echo "📊 Building Simple Dashboard..."
node src/cli.js config/simple-dashboard.nixi
if [ -f "dashboard.html" ]; then
    echo "✅ Dashboard built successfully: dashboard.html"
else
    echo "❌ Dashboard build failed"
fi

# Build simple todo app
echo ""
echo "✅ Building Simple Todo App..."
node src/cli.js config/simple-todo.nixi
if [ -f "todo.html" ]; then
    echo "✅ Todo app built successfully: todo.html"
else
    echo "❌ Todo app build failed"
fi

# Build simple server status
echo ""
echo "🖥️  Building Server Status..."
node src/cli.js config/simple-server.nixi
if [ -f "server.html" ]; then
    echo "✅ Server status built successfully: server.html"
else
    echo "❌ Server status build failed"
fi

echo ""
echo "🎉 Build process complete!"
echo ""
echo "📁 Generated files:"
ls -la *.html 2>/dev/null | grep -v "^total"
echo ""
echo "🌐 Open in browser:"
echo "  firefox dashboard.html"
echo "  firefox todo.html" 
echo "  firefox server.html"
echo ""
echo "💡 These configurations demonstrate:"
echo "  • Component-based architecture"
echo "  • Functional programming with let bindings"
echo "  • CSS styling system"
echo "  • Event handling"
echo "  • Data mapping and filtering"
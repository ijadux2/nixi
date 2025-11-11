# Nixi Configuration Examples

## ✅ Working Configurations

### 1. Ultra Simple Demo
**File**: `config/simple-working.nixi`
**Features**: Basic component creation and HTML generation
**Run**: `node src/cli.js config/simple-working.nixi`

```nixi
let
  app = div { 
    class: "container"; 
    text: "Hello Nixi World!" 
  };
in
  saveHTML(app, "simple-demo.html", "Simple Nixi Demo")
```

### 2. Basic Examples
**Files**: 
- `examples/hello.nixi` - Basic operations and file system
- `examples/simple-gui.nixi` - Simple GUI component
- `examples/gui-demo.nixi` - Complex GUI with styling

## 🏗️ Building Configurations

### Quick Build
```bash
# Build simple demo
node src/cli.js config/simple-working.nixi

# Build hello world
node src/cli.js examples/hello.nixi

# Build GUI examples
node src/cli.js examples/simple-gui.nixi
```

### Build Script
```bash
# Run the build script
./build-simple.sh
```

## 🎯 Language Features Demonstrated

### ✅ **Nix-like Functional Syntax**
```nixi
let
  x = 42;
  y = 8;
  result = x + y;
in
  echo result
```

### ✅ **Bash-like Built-in Functions**
```nixi
echo "Hello World"
ls "."                    # List directory
cd "/tmp"                 # Change directory
pwd                        # Show current path
```

### ✅ **React-like GUI Components**
```nixi
# Component definition
component Button = { text }:
  button { 
    class: "btn"; 
    text: text 
  };

# Component usage
Button { text: "Click Me!" }
```

### ✅ **CSS/QML Styling**
```nixi
style "btn" {
  background: "#007bff";
  color: "white";
  padding: "10px 20px";
  border-radius: "5px";
}
```

### ✅ **HTML Generation**
```nixi
let app = div { class: "app"; text: "Hello" };
in
  saveHTML(app, "output.html", "My App")
```

## 📁 Generated Files

After running configurations, you'll get HTML files:

- `simple-demo.html` - Basic working demo
- `hello.html` - Hello world with system info
- `simple.html` - Simple GUI component
- `dashboard.html` - Complex dashboard (when working)

## 🌐 Viewing Results

```bash
# Open in browser
firefox simple-demo.html
firefox hello.html
firefox simple.html

# Or any web browser
xdg-open simple-demo.html
```

## 🎨 What You'll See

The generated HTML includes:
- Modern CSS styling with gradients and shadows
- Responsive grid layouts
- Hover effects and transitions
- Component-based structure
- Professional typography

## 🔧 Customization

You can modify configurations to:
- Add more components
- Change styling and colors
- Add event handlers
- Include data from files
- Create complex layouts

## 📚 Next Steps

1. **Explore Language**: Try different syntax combinations
2. **Build Apps**: Create your own applications
3. **Add Features**: Extend with new components
4. **Share**: Show others what you built!

## 🚀 Success!

You now have:
- ✅ Working Nixi programming language
- ✅ Neovim syntax highlighting
- ✅ Multiple configuration examples
- ✅ HTML generation capability
- ✅ Component-based GUI system

Ready to build amazing applications with Nixi! 🎉
# Nixi Language - Current Status & Examples

## ✅ **What Works Right Now**

### **Core Language Features**
- ✅ **Let Expressions**: Variable bindings and scoping
- ✅ **Basic Arithmetic**: `+`, `-`, `*`, `/` operations
- ✅ **String Operations**: Concatenation with `+`
- ✅ **Function Calls**: Built-in functions like `add()`, `echo()`, `saveHTML()`
- ✅ **Component System**: HTML-like components (`div`, `h1`, `p`, `button`, etc.)
- ✅ **CSS Styling**: `style` definitions with full CSS support
- ✅ **HTML Generation**: `saveHTML()` and `renderHTML()` functions
- ✅ **File Operations**: `ls()`, `cd()`, `pwd()` functions

### **GUI Components Available**
- `div`, `span`, `h1`, `h2`, `h3`, `p`, `a`
- `button`, `input`
- All support `class`, `text`, `children`, and event handlers

### **Built-in Functions**
- **Math**: `add()`, `multiply()`, `subtract()`, `divide()`
- **String**: `echo()`, `concat()`, `toString()`
- **Array**: `length()`, `map()`
- **File System**: `ls()`, `cd()`, `pwd()`
- **GUI**: `renderHTML()`, `saveHTML()`, `addStyle()`

## 📁 **Working Examples**

### **1. Simple App** (`config/simple-working.nixi`)
```nixi
let
  app = div { 
    class: "container"; 
    text: "Hello Nixi World!" 
  };
in
  saveHTML(app, "simple-demo.html", "Simple Nixi Demo")
```

### **2. Math Demo** (`config/math-demo.nixi`)
```nixi
let
  x = 42;
  y = 23;
  sum = add(x, y);
  message = "The sum is: " + sum;
  
  app = div {
    class: "container";
    children: [
      h1 { text: "Math Demo" };
      p { text: message }
    ]
  };
in
  saveHTML(app, "math-demo.html", "Math Demo")
```

### **3. Complete Demo** (`config/complete-working.nixi`)
- Multiple components with styling
- Event handlers with `onClick`
- Complex CSS with hover effects
- Responsive layout

### **4. Dashboard** (`config/dashboard.nixi`)
- Real-world UI example
- Statistics cards
- Action buttons with handlers
- Professional styling

## 🚧 **Current Limitations**

### **Parser Issues**
- ❌ **Lambda Functions**: `() => expression` syntax not supported
- ❌ **Component Parameters**: `{ title, content }` destructuring fails
- ❌ **Complex CSS**: Grid properties with `>` character cause errors
- ❌ **Multiple Let Blocks**: Only one let expression per file

### **Workarounds**
- Use direct component definitions instead of parameterized functions
- Avoid CSS properties with special characters like `>`
- Use simple function calls: `func(arg1, arg2)` instead of complex syntax
- Put all logic in a single let expression

## 🎯 **Best Practices for Current Version**

### **File Structure**
```
# Style definitions first (top-level statements)
style "app" { ... }
style "header" { ... }

# Main let expression with application logic
let
  # Variables
  title = "My App";
  
  # Components (simple definitions)
  Header = div { ... };
  Content = div { ... };
  
  # Main app
  App = div { ... };
in
  saveHTML(App, "output.html", "My App")
```

### **Component Patterns**
```nixi
# ✅ Works: Simple component
Card = div {
  class: "card";
  text: "Hello World"
};

# ✅ Works: Component with children
Card = div {
  class: "card";
  children: [
    h3 { text: "Title" };
    p { text: "Content" }
  ]
};

# ❌ Doesn't work: Parameterized function
Card = { title, content } =>
  div { ... };
```

### **Function Calls**
```nixi
# ✅ Works: Built-in functions
result = add(5, 3);
message = concat("Hello", "World");

# ✅ Works: Component instantiation
app = Header { text: "Title" };

# ❌ Doesn't work: Lambda functions
double = x => x * 2;
```

## 🚀 **How to Use**

### **Running Examples**
```bash
# Run a specific file
node src/cli.js config/simple-working.nixi

# Interactive REPL
node src/cli.js

# Run tests
node tests/test.js
```

### **Neovim Support**
```bash
# Install syntax highlighting
./install-neovim.sh

# Manual installation
cp neovim/* ~/.config/nvim/
```

## 📈 **Generated Outputs**

All working examples generate functional HTML files:
- `simple-demo.html` - Basic demo
- `math-demo.html` - Math operations demo  
- `complete-working.html` - Full-featured demo
- `dashboard.html` - Professional dashboard

Each HTML file includes:
- Responsive CSS styling
- Interactive JavaScript handlers
- Professional typography and layout
- Hover effects and transitions

## 🔧 **Development Status**

**Version**: 1.0.0 (Working Prototype)
**Status**: Functional for basic to intermediate use
**Test Coverage**: ✅ All core features tested
**Documentation**: ✅ Complete examples and guides

The language is ready for practical use with the current feature set, while development continues on advanced features like lambda functions, parameter destructuring, and module imports.
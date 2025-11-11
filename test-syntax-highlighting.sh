#!/bin/bash

# Test Nixi syntax highlighting
echo "Testing Nixi syntax highlighting in Neovim..."
echo ""

# Create a test file
cat > /tmp/test-nixi.nixi << 'EOF'
# Nixi Syntax Highlighting Test

let
  # Basic functions
  add = x: y: x + y;
  multiply = { x, y }: x * y;
  
  # Component definition
  component Button = { text, onClick }:
    button { 
      class: "button"; 
      text: text;
      onClick: onClick 
    };
    
  # Style definition  
  style "button" {
    background: "#007bff";
    color: "white";
    padding: "10px 20px";
  };
  
  # Test app
  app = div { 
    class: "container";
    children: [
      h1 { text: "Hello Nixi!" };
      Button { 
        text: "Click Me"; 
        onClick: echo "Button clicked!" 
      }
    ]
  };
in
  saveHTML(app, "test.html", "Syntax Test")
EOF

echo "✓ Test file created: /tmp/test-nixi.nixi"
echo ""
echo "To test syntax highlighting:"
echo "1. Open Neovim: nvim /tmp/test-nixi.nixi"
echo "2. Or run: nvim test-syntax.nixi (in nixi directory)"
echo ""
echo "You should see:"
echo "- Comments highlighted in gray"
echo "- Keywords (let, in, component, style) highlighted"
echo "- Built-in functions (echo, div, button, h1) highlighted"
echo "- Strings highlighted in color"
echo "- Numbers highlighted"
echo "- Proper indentation when editing"
echo ""
echo "Installation complete! 🎉"
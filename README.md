# Nixi - A Hybrid Programming Language

Nixi is a programming language that combines:
- Nix-like functional syntax and purity
- Bash-like built-in functions and commands  
- React.js-like GUI components
- CSS/QML styling capabilities

## Language Features

### Nix-like Syntax
```nixi
# Function definitions
let
  add = x: y: x + y;
  multiply = { x, y }: x * y;
in
  add 5 (multiply { x = 3; y = 4 })
```

### Bash-like Functions
```nixi
# Built-in commands
ls "directory"
echo "Hello World"
cd "/path/to/directory"
```

### GUI Components (React-like)
```nixi
component Button = { text, onClick }:
  div {
    class: "button";
    onClick: onClick;
    text
  };

component App = {}:
  div {
    class: "app";
    Button { text: "Click me"; onClick: () => echo "Clicked!" }
  };
```

### CSS/QML Styling
```nixi
style "button" {
  background: "#007bff";
  color: "white";
  padding: "10px 20px";
  border-radius: "5px";
}

style "app" {
  display: "flex";
  flex-direction: "column";
  align-items: "center";
}
```

## Project Structure
- `src/` - Core language implementation
- `examples/` - Example programs
- `docs/` - Documentation
- `tests/` - Test suite
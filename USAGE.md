# Nixi Programming Language

A hybrid programming language that combines Nix-like functional syntax, Bash-like built-in functions, and React.js-like GUI components with CSS styling.

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd nixi

# Install dependencies (if any)
npm install

# Make CLI executable
chmod +x src/cli.js
```

## Usage

### Command Line Interface

```bash
# Run a Nixi file
node src/cli.js examples/hello.nixi

# Start interactive REPL
node src/cli.js

# Show help
node src/cli.js --help

# Show version
node src/cli.js --version
```

### REPL Mode

Start the REPL to experiment with the language:

```bash
node src/cli.js
nixi> let x = 42; in x * 2
84
nixi> echo "Hello from Nixi!"
Hello from Nixi!
nixi> exit
```

## Language Features

### Nix-like Syntax

```nixi
# Function definitions
let
  add = x: y: x + y;
  multiply = { x, y }: x * y;
  result = add 5 (multiply { x = 3; y = 4 });
in
  echo result
```

### Bash-like Functions

```nixi
# Built-in commands
ls "."                    # List directory
echo "Hello World"         # Print message
cd "/path/to/directory"    # Change directory
pwd                       # Show current directory
```

### GUI Components (React-like)

```nixi
# Define components
component Button = { text, onClick }:
  button { 
    class: "button"; 
    onClick: onClick; 
    text: text 
  };

component App = {}:
  div { 
    class: "app";
    children: [
      h1 { text: "Welcome to Nixi!" };
      Button { 
        text: "Click Me"; 
        onClick: echo "Button clicked!" 
      }
    ]
  };
```

### CSS/QML Styling

```nixi
# Define styles
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

### HTML Generation

```nixi
# Generate and save HTML
let app = App {};
in
  saveHTML(app, "output.html", "My App")
```

## Built-in Functions

### Math Functions
- `add(a, b)` - Addition
- `multiply(a, b)` - Multiplication  
- `subtract(a, b)` - Subtraction
- `divide(a, b)` - Division

### String Functions
- `echo(...args)` - Print to console
- `concat(a, b)` - String concatenation
- `toString(value)` - Convert to string

### Array Functions
- `length(array)` - Get array length
- `map(function, array)` - Map function over array

### File System Functions
- `ls(directory)` - List directory contents
- `cd(path)` - Change directory
- `pwd()` - Get current directory

### GUI Functions
- `div(props)`, `span(props)`, `button(props)`, `input(props)`
- `h1(props)`, `h2(props)`, `h3(props)`, `p(props)`, `a(props)`
- `renderHTML(component, title)` - Generate HTML string
- `saveHTML(component, filename, title)` - Save HTML to file
- `addStyle(selector, properties)` - Add CSS styles

## Examples

### Hello World
```nixi
echo "Hello, World!"
```

### Simple Math
```nixi
let
  x = 42;
  y = 23;
  result = x + y;
in
  echo ("The sum is: " + result)
```

### GUI Application
```nixi
let
  app = div { 
    class: "container"; 
    text: "Hello GUI World!" 
  };
in
  saveHTML(app, "hello.html", "Hello GUI")
```

## Testing

Run the test suite:

```bash
node tests/test.js
```

## Project Structure

```
nixi/
├── src/
│   ├── lexer.js          # Tokenizer
│   ├── parser.js         # Parser
│   ├── ast.js           # AST node definitions
│   ├── interpreter.js    # Interpreter/runtime
│   ├── gui-renderer.js  # HTML/CSS generator
│   └── cli.js           # Command line interface
├── examples/            # Example programs
├── tests/              # Test suite
├── README.md           # This file
└── package.json        # Node.js package
```

## Language Design

Nixi combines the best features from multiple paradigms:

- **Nix**: Pure functional expressions, let-bindings, lazy evaluation
- **Bash**: Simple built-in functions for system operations
- **React**: Component-based GUI architecture
- **CSS**: Declarative styling system

The language is interpreted, dynamically typed, and designed for both scripting and GUI application development.
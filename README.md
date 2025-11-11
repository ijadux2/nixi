# Nixi - A Hybrid Programming Language

Nixi is a programming language that combines:
- Nix-like functional syntax and purity
- Bash-like built-in functions and commands  
- React.js-like GUI components
- CSS/QML styling capabilities

## 🚀 Quick Start

### Installation
```bash
git clone https://github.com/ijadux2/nixi.git
cd nixi
npm install
```

### Running Nixi Programs
```bash
# Run a GUI example
node src/cli.js examples/simple-gui.nixi

# Run a config example  
node src/cli.js config/simple-working.nixi
```

## 📖 Documentation

Visit our comprehensive website at [index.html](./index.html) for:
- Interactive examples
- Installation guide
- Language reference
- GUI component library

## 🎯 Language Features

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

## 📁 Project Structure

```
nixi/
├── src/                    # Core language implementation
│   ├── ast.js             # Abstract syntax tree
│   ├── cli.js             # Command-line interface
│   ├── gui-renderer.js    # GUI rendering engine
│   ├── interpreter.js     # Language interpreter
│   ├── lexer.js           # Lexical analyzer
│   └── parser.js          # Parser
├── config/                # Working configuration examples
│   ├── simple-working.nixi
│   ├── math-demo.nixi
│   ├── complete-working.nixi
│   ├── dashboard.nixi
│   ├── ultra-simple.nixi
│   └── working.nixi
├── examples/              # Working GUI examples
│   └── simple-gui.nixi
├── neovim/               # Neovim syntax highlighting
│   ├── ftdetect/nixi.vim
│   ├── indent/nixi.vim
│   ├── syntax/nixi.vim
│   └── README.md
├── tests/               # Test suite
│   └── test.js
├── index.html           # Main documentation website
├── README.md           # This file
├── package.json        # Node.js dependencies
└── install-neovim.sh   # Neovim setup script
```

## 🧪 Working Examples

### GUI Examples
- `examples/simple-gui.nixi` - Basic GUI with buttons and styling

### Configuration Examples  
- `config/simple-working.nixi` - Minimal working example
- `config/math-demo.nixi` - Mathematical operations
- `config/complete-working.nixi` - Full feature demonstration
- `config/dashboard.nixi` - Dashboard layout example
- `config/ultra-simple.nixi` - Absolute minimal example
- `config/working.nixi` - Standard working configuration

## 🛠️ Development

### Running Tests
```bash
node tests/test.js
```

### Neovim Support
Install syntax highlighting:
```bash
./install-neovim.sh
```

## 📊 Language Status

**Version**: 1.0.0 (Basic Use Ready)  
**Working Examples**: 7/7 (100%)  
**Core Features**: ✅ Functional  
**GUI Components**: ✅ Working  
**Styling**: ✅ Working  
**Lambda Functions**: ❌ Not supported  
**Parameter Destructuring**: ⚠️ Limited support  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes thoroughly
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- **GitHub Repository**: https://github.com/ijadux2/nixi
- **Documentation**: [index.html](./index.html)
- **Issues**: Report bugs and feature requests on GitHub

---

*Nixi - Where functional programming meets GUI development*
# Editor Installation Guide

This guide covers installing Nixi language support for various code editors.

## 📋 Table of Contents

- [Neovim](#neovim)
- [VS Code](#vs-code)
- [Cursor](#cursor)
- [Other Editors](#other-editors)

---

## 🔧 Neovim

### Installation Options

#### Option 1: Quick Install Script
```bash
# Run the installation script
./install-neovim.sh
```

#### Option 2: Manual Installation
```bash
# Create directories if they don't exist
mkdir -p ~/.config/nvim/syntax
mkdir -p ~/.config/nvim/ftdetect
mkdir -p ~/.config/nvim/indent

# Copy the files
cp neovim/syntax/nixi.vim ~/.config/nvim/syntax/
cp neovim/ftdetect/nixi.vim ~/.config/nvim/ftdetect/
cp neovim/indent/nixi.vim ~/.config/nvim/indent/

# Restart Neovim or run:
:syntax on
:filetype on
```

#### Option 3: Plugin Manager

**Using vim-plug:**
```vim
call plug#begin('~/.config/nvim/plugged')
Plug 'path/to/nixi', {'rtp': 'neovim'}
call plug#end()
```

**Using Packer.nvim:**
```lua
use {
  'path/to/nixi',
  rtp = 'neovim'
}
```

**Using lazy.nvim:**
```lua
{
  'path/to/nixi',
  rtp = 'neovim',
  config = function()
    -- Optional configuration
  end
}
```

### Features
- ✅ Syntax highlighting for keywords, built-ins, components
- ✅ Smart indentation for let blocks, components, styles
- ✅ File type detection for `.nixi` files
- ✅ Customizable colors and highlighting

### Troubleshooting
```vim
" Check if syntax is working
:syntax on
:set filetype=nixi

" Check file detection
:echo expand('~/.config/nvim')
```

---

## 💻 VS Code

### Installation Options

#### Option 1: VS Code Marketplace (Recommended)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Nixi Language Support"
4. Click Install

#### Option 2: Install from Source
```bash
# Navigate to VS Code extension directory
cd vscode-extension

# Install dependencies
npm install

# Compile the extension
npm run compile

# Package the extension
npm install -g vsce
vsce package

# Install the .vsix file
code --install-extension nixi-language-1.0.0.vsix
```

#### Option 3: Development Mode
```bash
cd vscode-extension
npm install
npm run compile
# Press F5 in VS Code to open Extension Development Host
```

### Features
- ✅ Full syntax highlighting
- ✅ Code snippets (component, let, if, style, etc.)
- ✅ Integrated compilation commands
- ✅ Auto-completion and bracket matching
- ✅ Status bar integration

### Commands
- `Nixi: Compile File` - Compile current .nixi file
- `Nixi: Run File` - Run current .nixi file
- `Nixi: Compile to JavaScript` - Convert to JS

### Configuration
```json
{
  "nixi.enableSyntaxHighlighting": true,
  "nixi.enableSnippets": true,
  "nixi.compilerPath": "nixi"
}
```

### Keyboard Shortcuts
Add to `keybindings.json`:
```json
[
  {
    "key": "ctrl+shift+b",
    "command": "nixi.compile",
    "when": "editorLangId == nixi"
  },
  {
    "key": "f5",
    "command": "nixi.run",
    "when": "editorLangId == nixi"
  }
]
```

---

## 🤖 Cursor

### Installation Options

#### Option 1: Cursor Marketplace (Recommended)
1. Open Cursor
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Nixi Language Support for Cursor"
4. Click Install

#### Option 2: Install from Source
```bash
# Navigate to Cursor extension directory
cd cursor-extension

# Install dependencies
npm install

# Compile the extension
npm run compile

# Package the extension
npm install -g vsce
vsce package

# Install the .vsix file
cursor --install-extension nixi-language-cursor-1.0.0.vsix
```

#### Option 3: Development Mode
```bash
cd cursor-extension
npm install
npm run compile
# Press F5 in Cursor to open Extension Development Host
```

### Features
- ✅ All VS Code features
- ✅ AI-powered code generation
- ✅ Smart error analysis
- ✅ AI-assisted refactoring
- ✅ Context-aware completions

### AI Integration Examples

**Code Generation:**
```
"Create a Nixi component for a user profile card with avatar and name"
"Generate a let block with mathematical functions"
```

**Code Explanation:**
```
"Explain how this component works"
"What does this let-in binding do?"
```

**Refactoring:**
```
"Refactor this component to use props"
"Convert this to a more functional style"
"Add error handling to this function"
```

### Configuration
Same as VS Code:
```json
{
  "nixi.enableSyntaxHighlighting": true,
  "nixi.enableSnippets": true,
  "nixi.compilerPath": "nixi"
}
```

---

## 📝 Other Editors

### Generic TextMate Support

For editors that support TextMate grammars (Sublime Text, Atom, etc.):

1. Copy `vscode-extension/syntaxes/nixi.tmLanguage.json`
2. Install as a TextMate grammar
3. Associate `.nixi` files with the grammar

### Basic Syntax Highlighting

For editors without TextMate support:

1. Use the keyword definitions from `neovim/syntax/nixi.vim`
2. Configure your editor's syntax highlighting rules

**Keywords to highlight:**
```vim
" Control keywords
let in if then else component style true false null

" Built-in functions
echo ls cd pwd add multiply subtract divide concat toString length map
div span button input h1 h2 h3 p a renderHTML saveHTML addStyle

" Operators
+ - * / = == != < > <= >= && || !
```

---

## 🚀 Quick Setup Commands

### Neovim
```bash
./install-neovim.sh
```

### VS Code
```bash
cd vscode-extension && npm install && npm run compile && vsce package && code --install-extension nixi-language-1.0.0.vsix
```

### Cursor
```bash
cd cursor-extension && npm install && npm run compile && vsce package && cursor --install-extension nixi-language-cursor-1.0.0.vsix
```

---

## 🐛 Troubleshooting

### Common Issues

**Syntax highlighting not working:**
1. Restart your editor
2. Check file association (`.nixi` files)
3. Verify extension is installed and enabled

**Compilation commands not working:**
1. Check `nixi.compilerPath` setting
2. Ensure Nixi is installed and in PATH
3. Test with: `nixi --version`

**Snippets not expanding:**
1. Enable snippets in editor settings
2. Check that file is detected as Nixi
3. Try typing snippet prefix and pressing Tab

### Getting Help

- **Neovim**: Check `:help syntax` and `:help filetype`
- **VS Code**: Help → Toggle Developer Tools for console errors
- **Cursor**: Same as VS Code, plus AI chat for assistance

---

## 📚 Additional Resources

- [Main Documentation](../README.md)
- [Compiler Usage Guide](../COMPILER_USAGE.md)
- [Neovim Plugin Details](../neovim/README.md)
- [VS Code Extension Details](../vscode-extension/README.md)
- [Cursor Extension Details](../cursor-extension/README.md)

---

*Choose your editor and follow the appropriate installation guide above!*
# Nixi Cursor Extension

This directory contains the Cursor extension for Nixi language support, providing syntax highlighting, code snippets, and integrated compilation commands for the Cursor AI-powered code editor.

## Features

- **Syntax Highlighting**: Full syntax highlighting for Nixi files (.nixi)
- **Code Snippets**: Pre-built snippets for common Nixi patterns
- **Integrated Commands**: Compile and run Nixi files directly from Cursor
- **Auto-completion**: Smart indentation and bracket matching
- **Status Bar**: Quick access to Nixi commands
- **AI Integration**: Optimized for Cursor's AI-powered features

## Installation

### Option 1: Install from Cursor Marketplace (Recommended)

1. Open Cursor
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Nixi Language Support for Cursor"
4. Click Install

### Option 2: Install from Local Source

1. Clone the Nixi repository
2. Navigate to the `cursor-extension` directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Compile the extension:
   ```bash
   npm run compile
   ```
5. Package the extension:
   ```bash
   vsce package
   ```
6. Install the `.vsix` file:
   ```bash
   cursor --install-extension nixi-language-cursor-1.0.0.vsix
   ```

### Option 3: Development Mode

1. Follow steps 1-4 from Option 2
2. Press F5 in Cursor to open a new Extension Development Host window
3. The extension will be loaded in the new window

## Usage

### Commands

The extension provides the following commands (available via Command Palette Ctrl+Shift+P):

- **Nixi: Compile File** - Compile the current .nixi file
- **Nixi: Run File** - Run the current .nixi file
- **Nixi: Compile to JavaScript** - Compile .nixi file to JavaScript

### AI-Powered Features

When using Cursor's AI features:

- **Code Generation**: Ask Cursor AI to generate Nixi components and functions
- **Code Explanation**: Use AI to explain complex Nixi code
- **Refactoring**: AI-assisted refactoring of Nixi code
- **Error Resolution**: AI help for debugging Nixi programs

Example prompts for Cursor AI:
```
"Create a Nixi component for a user profile card with avatar and name"
"Explain how let-in bindings work in this Nixi code"
"Convert this JavaScript function to Nixi syntax"
"Help me debug this Nixi component that's not rendering"
```

### Keyboard Shortcuts

You can add keyboard shortcuts by editing your `keybindings.json`:

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
  },
  {
    "key": "ctrl+shift+j",
    "command": "nixi.compileToJS",
    "when": "editorLangId == nixi"
  }
]
```

### Configuration

You can configure the extension in your Cursor settings:

```json
{
  "nixi.enableSyntaxHighlighting": true,
  "nixi.enableSnippets": true,
  "nixi.compilerPath": "nixi"
}
```

- **nixi.enableSyntaxHighlighting**: Enable/disable syntax highlighting
- **nixi.enableSnippets**: Enable/disable code snippets
- **nixi.compilerPath**: Path to the Nixi compiler executable

## Available Snippets

Type the following prefixes and press Tab to expand:

- `component` - Create a component definition
- `let` - Create a let block
- `if` - Create an if-then-else expression
- `style` - Create a style definition
- `button` - Create a button component
- `div` - Create a div container
- `input` - Create an input field
- `fun` - Create a function definition
- `lambda` - Create a lambda function
- `echo` - Create an echo statement

## Cursor-Specific Features

### AI Chat Integration

The extension integrates seamlessly with Cursor's AI chat:

1. **Code Context**: AI understands Nixi syntax and semantics
2. **Smart Suggestions**: Context-aware code completion
3. **Error Analysis**: AI can analyze and suggest fixes for Nixi errors
4. **Documentation Generation**: AI can generate documentation for Nixi components

### AI-Powered Refactoring

Use Cursor's AI to refactor Nixi code:

```
"Refactor this component to use props instead of hardcoded values"
"Convert this let block to a more functional style"
"Optimize this Nixi code for better performance"
"Add proper error handling to this function"
```

## Development

### Building the Extension

```bash
npm run compile
```

### Testing

```bash
# Open a new Cursor window with the extension loaded
npm run test
```

### Packaging

```bash
# Install vsce if not already installed
npm install -g vsce

# Package the extension
vsce package
```

## File Structure

```
cursor-extension/
├── package.json              # Extension manifest
├── language-configuration.json # Language configuration
├── tsconfig.json            # TypeScript configuration
├── syntaxes/
│   └── nixi.tmLanguage.json # TextMate grammar
├── snippets/
│   └── nixi.json           # Code snippets
├── src/
│   └── extension.ts        # Main extension file
└── README.md               # This file
```

## Cursor vs VS Code Differences

This version is optimized for Cursor:

1. **AI Integration**: Enhanced AI prompts and context understanding
2. **Smart Completion**: Better integration with Cursor's AI-powered autocomplete
3. **Error Analysis**: AI-assisted error detection and resolution
4. **Documentation**: AI can generate and explain Nixi code
5. **Refactoring**: AI-powered code transformation suggestions

## Contributing

1. Make changes to the source code
2. Run `npm run compile` to build
3. Test the changes using F5 (Extension Development Host)
4. Submit a pull request

## License

MIT License - see the main project LICENSE file for details.
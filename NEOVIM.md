# Nixi Neovim Integration

## Quick Installation

Run the installer script:

```bash
./install-neovim.sh
```

This will automatically install syntax highlighting, file detection, and indentation for Nixi files in your Neovim configuration.

## Manual Installation

### 1. Copy Files to Neovim Config

```bash
# Create directories
mkdir -p ~/.config/nvim/{syntax,ftdetect,indent}

# Copy syntax files
cp neovim/syntax/nixi.vim ~/.config/nvim/syntax/
cp neovim/ftdetect/nixi.vim ~/.config/nvim/ftdetect/
cp neovim/indent/nixi.vim ~/.config/nvim/indent/
```

### 2. Restart Neovim

Or run in Neovim:
```vim
:syntax on
:filetype on
```

## Features

### Syntax Highlighting

- **Keywords**: `let`, `in`, `if`, `then`, `else`, `component`, `style`
- **Built-ins**: `echo`, `ls`, `cd`, `div`, `button`, `h1`, etc.
- **Operators**: `+`, `-`, `*`, `/`, `==`, `!=`, `&&`, `||`
- **Strings**: `"hello"` and `'world'`
- **Comments**: `# This is a comment`
- **Numbers**: `42`, `3.14`

### Smart Indentation

- Proper indentation for `let` blocks
- Component definition formatting
- Style block indentation
- Automatic dedenting for closing braces

### File Detection

- Automatically detects `.nixi` files
- Sets correct filetype and syntax

## Example

After installation, open a `.nixi` file and you'll see:

```nixi
# Comments are highlighted
let
  add = x: y: x + y;  # Functions and keywords highlighted
  app = div { 
    class: "container";  # Component calls and strings
    text: "Hello World"
  };
in
  saveHTML(app, "output.html", "My App")  # Built-ins highlighted
```

## Customization

Add to your `init.vim`:

```vim
" Custom colors for Nixi
highlight NixiKeyword ctermfg=Blue guifg=#0000ff
highlight NixiBuiltin ctermfg=Green guifg=#00ff00
highlight NixiComponent ctermfg=Yellow guifg=#ffff00
highlight NixiString ctermfg=Cyan guifg=#00ffff
```

## Troubleshooting

If syntax highlighting doesn't work:

1. Check files are in `~/.config/nvim/`
2. Run `:set filetype=nixi` manually
3. Ensure `filetype on` is in your config
4. Restart Neovim completely
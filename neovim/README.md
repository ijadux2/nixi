# Nixi Neovim Syntax Highlighting

This directory contains Neovim syntax highlighting files for the Nixi programming language.

## Installation

### Option 1: Manual Installation

1. Copy the files to your Neovim configuration:

```bash
# Create directories if they don't exist
mkdir -p ~/.config/nvim/syntax
mkdir -p ~/.config/nvim/ftdetect
mkdir -p ~/.config/nvim/indent

# Copy the files
cp neovim/syntax/nixi.vim ~/.config/nvim/syntax/
cp neovim/ftdetect/nixi.vim ~/.config/nvim/ftdetect/
cp neovim/indent/nixi.vim ~/.config/nvim/indent/
```

2. Restart Neovim or run `:syntax on` and `:filetype on`

### Option 2: Plugin Manager (Recommended)

#### Using vim-plug
Add to your `init.vim`:

```vim
call plug#begin('~/.config/nvim/plugged')
Plug 'path/to/nixi', {'rtp': 'neovim'}
call plug#end()
```

#### Using Packer.nvim
Add to your `init.lua`:

```lua
use {
  'path/to/nixi',
  rtp = 'neovim'
}
```

#### Using lazy.nvim
Add to your `init.lua`:

```lua
{
  'path/to/nixi',
  rtp = 'neovim',
  config = function()
    -- Optional configuration
  end
}
```

### Option 3: Local Development Setup

If you're working on the Nixi project locally:

```bash
# Create symbolic links to your Neovim config
ln -s /path/to/nixi/neovim/syntax/nixi.vim ~/.config/nvim/syntax/
ln -s /path/to/nixi/neovim/ftdetect/nixi.vim ~/.config/nvim/ftdetect/
ln -s /path/to/nixi/neovim/indent/nixi.vim ~/.config/nvim/indent/
```

## Features

### Syntax Highlighting

- **Keywords**: `let`, `in`, `if`, `then`, `else`, `component`, `style`, `true`, `false`, `null`
- **Built-in Functions**: `echo`, `ls`, `cd`, `pwd`, `add`, `multiply`, `subtract`, `divide`, `concat`, `toString`, `length`, `map`, `div`, `span`, `button`, `input`, `h1`, `h2`, `h3`, `p`, `a`, `renderHTML`, `saveHTML`, `addStyle`
- **Operators**: `+`, `-`, `*`, `/`, `=`, `==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`, `!`
- **Strings**: Double and single quoted strings
- **Numbers**: Integers and floating point numbers
- **Comments**: Line comments starting with `#`
- **Component Calls**: Function calls with object literals
- **Style Properties**: CSS property names in style blocks

### Smart Indentation

- Proper indentation for `let` blocks
- Component definition indentation
- Style block indentation
- Brace and bracket matching
- Automatic dedentation for `in`, `then`, `else`, closing braces/brackets

### File Detection

- Automatically detects `.nixi` files
- Also detects `.nix` files as Nixi (can be modified if needed)

## Customization

### Custom Colors

You can customize the highlighting colors in your Neovim config:

```vim
" Custom highlight groups
highlight NixiKeyword ctermfg=Blue guifg=#0000ff
highlight NixiBuiltin ctermfg=Green guifg=#00ff00
highlight NixiComponent ctermfg=Yellow guifg=#ffff00
highlight NixiString ctermfg=Cyan guifg=#00ffff
highlight NixiComment ctermfg=Gray guifg=#808080
```

### Modify File Detection

To change which file extensions are detected, edit `ftdetect/nixi.vim`:

```vim
" Only detect .nixi files
autocmd BufNewFile,BufRead *.nixi set filetype=nixi

" Or also detect .nix files
autocmd BufNewFile,BufRead *.nixi,*.nix set filetype=nixi
```

## Troubleshooting

### Syntax Not Working

1. Make sure the files are in the correct directories
2. Run `:syntax on` and `:filetype on` in Neovim
3. Restart Neovim completely
4. Check `:echo expand('~/.config/nvim')` to verify your config path

### Indentation Issues

1. Make sure `indent/nixi.vim` is installed
2. Check that `filetype indent on` is set
3. Try `:set filetype=nixi` manually

### File Detection Not Working

1. Verify `ftdetect/nixi.vim` is in the right location
2. Check that `filetype on` is set in your config
3. Try `:set filetype=nixi` manually

## Testing

Open a `.nixi` file and you should see:

```nixi
# This should be highlighted as a comment
let
  add = x: y: x + y;  # Keywords and functions highlighted
  result = add 5 10;     # Numbers and operators highlighted
in
  echo result  # Built-in functions highlighted
```

And for GUI components:

```nixi
component Button = { text, onClick }:  # Component definition highlighted
  button { 
    class: "primary";  # Style properties highlighted
    text: text;
    onClick: onClick
  };
```
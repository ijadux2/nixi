#!/bin/bash

# Nixi Neovim Syntax Highlighting Installer
# This script installs Nixi syntax highlighting for Neovim

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get Neovim config directory
NVIM_CONFIG="${XDG_CONFIG_HOME:-$HOME/.config}/nvim"
NVIM_SYNTAX="$NVIM_CONFIG/syntax"
NVIM_FDETECT="$NVIM_CONFIG/ftdetect"
NVIM_INDENT="$NVIM_CONFIG/indent"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NIXI_DIR="$SCRIPT_DIR"

echo -e "${BLUE}Installing Nixi syntax highlighting for Neovim...${NC}"

# Create directories if they don't exist
echo -e "${YELLOW}Creating directories...${NC}"
mkdir -p "$NVIM_SYNTAX"
mkdir -p "$NVIM_FDETECT"
mkdir -p "$NVIM_INDENT"

# Copy files
echo -e "${YELLOW}Installing syntax files...${NC}"
cp "$NIXI_DIR/neovim/syntax/nixi.vim" "$NVIM_SYNTAX/"
cp "$NIXI_DIR/neovim/ftdetect/nixi.vim" "$NVIM_FDETECT/"
cp "$NIXI_DIR/neovim/indent/nixi.vim" "$NVIM_INDENT/"

# Set permissions
chmod 644 "$NVIM_SYNTAX/nixi.vim"
chmod 644 "$NVIM_FDETECT/nixi.vim"
chmod 644 "$NVIM_INDENT/nixi.vim"

echo -e "${GREEN}✓ Syntax highlighting installed successfully!${NC}"
echo -e "${BLUE}Files installed:${NC}"
echo -e "  ${NVIM_SYNTAX}/nixi.vim"
echo -e "  ${NVIM_FDETECT}/nixi.vim"
echo -e "  ${NVIM_INDENT}/nixi.vim"

echo -e "${YELLOW}To activate:${NC}"
echo -e "  1. Restart Neovim"
echo -e "  2. Or run: :syntax on | :filetype on"
echo -e "  3. Open any .nixi file to test"

# Test installation
echo -e "${YELLOW}Testing installation...${NC}"
if [ -f "$NVIM_SYNTAX/nixi.vim" ] && [ -f "$NVIM_FDETECT/nixi.vim" ] && [ -f "$NVIM_INDENT/nixi.vim" ]; then
    echo -e "${GREEN}✓ All files installed correctly${NC}"
else
    echo -e "${RED}✗ Installation failed - some files missing${NC}"
    exit 1
fi

echo -e "${GREEN}Nixi syntax highlighting is now ready for Neovim!${NC}"
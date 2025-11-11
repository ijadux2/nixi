" Nixi filetype detection for Neovim
" Detect .nixi files as Nixi language

autocmd BufNewFile,BufRead *.nixi set filetype=nixi
autocmd BufNewFile,BufRead *.nix set filetype=nixi
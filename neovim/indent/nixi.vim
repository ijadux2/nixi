" Nixi indentation for Neovim
" Proper indentation for Nixi language syntax

" Only load this indent file when no other indent file is loaded
if exists('b:did_indent')
  finish
endif
let b:did_indent = 1

setlocal indentexpr=GetNixiIndent()
setlocal indentkeys+==end,=in,=then,=else,=0},=0]

" Only define the function once
if exists('*GetNixiIndent')
  finish
endif

function GetNixiIndent()
  let line = getline(v:lnum)
  let prevlnum = prevnonblank(v:lnum - 1)
  let prevline = getline(prevlnum)
  let ind = indent(prevlnum)

  " Increase indent after opening braces
  if prevline =~ '{\s*$'
    let ind += shiftwidth()
  endif

  " Increase indent after opening brackets
  if prevline =~ '\[\s*$'
    let ind += shiftwidth()
  endif

  " Increase indent after let
  if prevline =~ 'let\s*$'
    let ind += shiftwidth()
  endif

  " Increase indent after component definition
  if prevline =~ 'component\s\+\w\+\s*=\s*{.*$'
    let ind += shiftwidth()
  endif

  " Increase indent after style definition
  if prevline =~ 'style\s*".*$'
    let ind += shiftwidth()
  endif

  " Decrease indent for closing braces
  if line =~ '^\s*}'
    let ind -= shiftwidth()
  endif

  " Decrease indent for closing brackets
  if line =~ '^\s*\]'
    let ind -= shiftwidth()
  endif

  " Decrease indent for 'in' keyword
  if line =~ '^\s*in\s'
    let ind -= shiftwidth()
  endif

  " Decrease indent for 'then' and 'else'
  if line =~ '^\s*then\s\|^\s*else\s'
    let ind -= shiftwidth()
  endif

  return ind
endfunction
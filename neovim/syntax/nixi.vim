" Nixi syntax highlighting for Neovim
" Language: Nixi (hybrid of Nix, Bash, and React-like syntax)

" Quit when a syntax file was already loaded
if exists('b:current_syntax')
  finish
endif

let s:keepcpo = &cpo
set cpo&vim

" Keywords
syn keyword nixiKeyword let in if then else component style true false null
syn keyword nixiBuiltin echo ls cd pwd add multiply subtract divide concat toString length map
syn keyword nixiBuiltin div span button input h1 h2 h3 p a renderHTML saveHTML addStyle

" Functions and components
syn match nixiFunction /\w\+\s*=\s*\w\+\s*:/
syn match nixiFunction /\w\+\s*=\s*{\s*\w\+\s*}/
syn match nixiComponent /component\s\+\w\+/
syn match nixiStyle /style\s\+/

" Operators
syn match nixiOperator /[+\-*/=<>!&|]/
syn match nixiOperator /==\|!=\|<=\|>=\|&&\|||/

" Delimiters
syn match nixiDelimiter /[{}[\]();,.]/

" Strings
syn region nixiString start=/"/ skip=/\\"/ end=/"/
syn region nixiString start=/'/ skip=/\\'/ end=/'/

" Numbers
syn match nixiNumber /\d\+\(\.\d\+\)\?/

" Comments
syn match nixiComment /#.*/

" CSS properties in style blocks
syn region nixiStyleBlock start=/style\s*"/ end=/"/ contains=nixiStyleProperty
syn match nixiStyleProperty /[a-zA-Z-]\+\s*:/ contained

" Component calls
syn match nixiComponentCall /^\s*\w\+\s*{/
syn match nixiComponentCall /\w\+\s*{/

" Define the default highlighting
if version >= 508 || !exists('did_nixi_syn_inits')
  if version < 508
    let did_nixi_syn_inits = 1
    command -nargs=+ HiLink hi link <args>
  else
    command -nargs=+ HiLink hi def link <args>
  endif

  HiLink nixiKeyword      Keyword
  HiLink nixiBuiltin       Function
  HiLink nixiFunction      Function
  HiLink nixiComponent     Type
  HiLink nixiStyle         PreProc
  HiLink nixiOperator      Operator
  HiLink nixiDelimiter      Delimiter
  HiLink nixiString        String
  HiLink nixiNumber        Number
  HiLink nixiComment       Comment
  HiLink nixiStyleProperty  Identifier
  HiLink nixiComponentCall Function

  if version < 508
    delfunction HiLink
  endif
endif

let b:current_syntax = 'nixi'

let &cpo = s:keepcpo
unlet s:keepcpo
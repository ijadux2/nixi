class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.line = 1;
    this.column = 1;
  }

  current() {
    return this.input[this.position];
  }

  peek(offset = 1) {
    return this.input[this.position + offset];
  }

  advance() {
    if (this.current() === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.position++;
  }

  skipWhitespace() {
    while (this.position < this.input.length && /\s/.test(this.current())) {
      this.advance();
    }
  }

  skipComment() {
    if (this.current() === '#') {
      while (this.position < this.input.length && this.current() !== '\n') {
        this.advance();
      }
    }
  }

  readString(quote) {
    let value = '';
    this.advance(); // Skip opening quote
    
    while (this.position < this.input.length && this.current() !== quote) {
      if (this.current() === '\\') {
        this.advance();
        if (this.position < this.input.length) {
          const escaped = this.current();
          switch (escaped) {
            case 'n': value += '\n'; break;
            case 't': value += '\t'; break;
            case 'r': value += '\r'; break;
            case '\\': value += '\\'; break;
            case '"': value += '"'; break;
            case "'": value += "'"; break;
            default: value += escaped;
          }
          this.advance();
        }
      } else {
        value += this.current();
        this.advance();
      }
    }
    
    if (this.current() === quote) {
      this.advance(); // Skip closing quote
    }
    
    return { type: 'STRING', value, line: this.line, column: this.column };
  }

  readNumber() {
    let value = '';
    let hasDecimal = false;
    
    while (this.position < this.input.length && 
           (/\d/.test(this.current()) || (this.current() === '.' && !hasDecimal))) {
      if (this.current() === '.') {
        hasDecimal = true;
      }
      value += this.current();
      this.advance();
    }
    
    return {
      type: hasDecimal ? 'FLOAT' : 'INTEGER',
      value: hasDecimal ? parseFloat(value) : parseInt(value),
      line: this.line,
      column: this.column
    };
  }

  readIdentifier() {
    let value = '';
    
    while (this.position < this.input.length && 
           /[a-zA-Z0-9_\-]/.test(this.current())) {
      value += this.current();
      this.advance();
    }
    
    // Check for keywords
    const keywords = {
      'let': 'LET',
      'in': 'IN',
      'if': 'IF',
      'then': 'THEN',
      'else': 'ELSE',
      'component': 'COMPONENT',
      'style': 'STYLE',
      'true': 'TRUE',
      'false': 'FALSE',
      'null': 'NULL'
    };
    
    const type = keywords[value] || 'IDENTIFIER';
    
    return { type, value, line: this.line, column: this.column };
  }

  readOperator() {
    const char = this.current();
    const next = this.peek();
    
    // Multi-character operators
    if (char === '=' && next === '=') {
      this.advance(); this.advance();
      return { type: 'EQ', value: '==', line: this.line, column: this.column };
    }
    
    if (char === '!' && next === '=') {
      this.advance(); this.advance();
      return { type: 'NEQ', value: '!=', line: this.line, column: this.column };
    }
    
    if (char === '<' && next === '=') {
      this.advance(); this.advance();
      return { type: 'LTE', value: '<=', line: this.line, column: this.column };
    }
    
    if (char === '>' && next === '=') {
      this.advance(); this.advance();
      return { type: 'GTE', value: '>=', line: this.line, column: this.column };
    }
    
    if (char === '&' && next === '&') {
      this.advance(); this.advance();
      return { type: 'AND', value: '&&', line: this.line, column: this.column };
    }
    
    if (char === '|' && next === '|') {
      this.advance(); this.advance();
      return { type: 'OR', value: '||', line: this.line, column: this.column };
    }
    
    // Single-character operators
    const operators = {
      '+': 'PLUS',
      '-': 'MINUS',
      '*': 'MULTIPLY',
      '/': 'DIVIDE',
      '=': 'ASSIGN',
      '<': 'LT',
      '>': 'GT',
      ':': 'COLON',
      ';': 'SEMICOLON',
      ',': 'COMMA',
      '.': 'DOT',
      '(': 'LPAREN',
      ')': 'RPAREN',
      '{': 'LBRACE',
      '}': 'RBRACE',
      '[': 'LBRACKET',
      ']': 'RBRACKET'
    };
    
    const type = operators[char];
    if (type) {
      this.advance();
      return { type, value: char, line: this.line, column: this.column };
    }
    
    throw new Error(`Unexpected character: ${char} at line ${this.line}, column ${this.column}`);
  }

  tokenize() {
    const tokens = [];
    
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.position >= this.input.length) break;
      
      // Skip comments
      if (this.current() === '#') {
        this.skipComment();
        continue;
      }
      
      const char = this.current();
      
      if (char === '"' || char === "'") {
        tokens.push(this.readString(char));
      } else if (/\d/.test(char)) {
        tokens.push(this.readNumber());
      } else if (/[a-zA-Z_]/.test(char)) {
        tokens.push(this.readIdentifier());
      } else {
        tokens.push(this.readOperator());
      }
    }
    
    tokens.push({ type: 'EOF', value: null, line: this.line, column: this.column });
    return tokens;
  }
}

module.exports = Lexer;
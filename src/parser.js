const Lexer = require('./lexer');
const {
  IntegerLiteral,
  FloatLiteral,
  StringLiteral,
  BooleanLiteral,
  NullLiteral,
  Identifier,
  FunctionDefinition,
  FunctionCall,
  LambdaExpression,
  LetExpression,
  Binding,
  ObjectLiteral,
  PropertyAccess,
  ArrayLiteral,
  BinaryOperation,
  UnaryOperation,
  ConditionalExpression,
  ComponentDefinition,
  ComponentInstantiation,
  StyleDefinition,
  Program
} = require('./ast');

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek() {
    return this.tokens[this.current];
  }

  advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  isAtEnd() {
    return this.peek().type === 'EOF';
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(`${message}. Got ${this.peek().type} at line ${this.peek().line}`);
  }

  parse() {
    const statements = [];
    
    while (!this.isAtEnd()) {
      statements.push(this.statement());
    }
    
    return new Program(statements);
  }

  statement() {
    if (this.match('LET')) {
      const stmt = this.letStatement();
      this.match('SEMICOLON'); // Optional semicolon
      return stmt;
    }
    if (this.match('COMPONENT')) {
      const stmt = this.componentDefinition();
      this.match('SEMICOLON'); // Optional semicolon
      return stmt;
    }
    if (this.match('STYLE')) {
      const stmt = this.styleDefinition();
      this.match('SEMICOLON'); // Optional semicolon
      return stmt;
    }
    if (this.match('IF')) return this.conditionalExpression();
    
    const expr = this.expression();
    this.match('SEMICOLON'); // Optional semicolon
    return expr;
  }

  letStatement() {
    const bindings = [];
    
    while (!this.check('IN') && !this.isAtEnd()) {
      const name = this.consume('IDENTIFIER', 'Expected identifier after let').value;
      this.consume('ASSIGN', 'Expected = after identifier');
      const value = this.expression();
      
      bindings.push(new Binding(new Identifier(name), value));
      
      if (!this.match('SEMICOLON')) {
        if (!this.check('IN')) {
          throw new Error('Expected ; or in after binding');
        }
        break;
      }
    }
    
    this.consume('IN', 'Expected in after let bindings');
    const body = this.expression();
    
    return new LetExpression(bindings, body);
  }

  componentDefinition() {
    const name = this.consume('IDENTIFIER', 'Expected component name').value;
    this.consume('ASSIGN', 'Expected = after component name');
    const params = this.parseParameters();
    this.consume('COLON', 'Expected : after component parameters');
    const body = this.expression();
    
    return new ComponentDefinition(name, params, body);
  }

  styleDefinition() {
    const selector = this.consume('STRING', 'Expected style selector').value;
    this.consume('LBRACE', 'Expected { after style selector');
    
    const properties = [];
    
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      // Allow hyphens in CSS property names
      let propName = '';
      while (!this.check('COLON') && !this.isAtEnd()) {
        if (this.check('IDENTIFIER') || this.check('MINUS')) {
          propName += this.advance().value;
        } else {
          throw new Error(`Expected property name, got ${this.peek().type}`);
        }
      }
      
      this.consume('COLON', 'Expected : after property name');
      const propValue = this.consume('STRING', 'Expected property value').value;
      
      properties.push({ name: propName, value: propValue });
      
      if (!this.match('SEMICOLON')) {
        if (!this.check('RBRACE')) {
          throw new Error('Expected ; or } after property');
        }
        break;
      }
    }
    
    this.consume('RBRACE', 'Expected } after style properties');
    
    return new StyleDefinition(selector, properties);
  }

  parseParameters() {
    if (this.match('LBRACE')) {
      // Named parameters: { x, y, z }
      const params = [];
      
      while (!this.check('RBRACE') && !this.isAtEnd()) {
        params.push(this.consume('IDENTIFIER', 'Expected parameter name').value);
        
        if (!this.match('COMMA')) {
          if (!this.check('RBRACE')) {
            throw new Error('Expected , or } after parameter');
          }
          break;
        }
      }
      
      this.consume('RBRACE', 'Expected } after parameters');
      return { type: 'named', params };
    } else {
      // Positional parameters: x y z
      const params = [];
      
      while (!this.check('COLON') && !this.isAtEnd() && this.peek().type !== 'ASSIGN') {
        params.push(this.consume('IDENTIFIER', 'Expected parameter name').value);
      }
      
      return { type: 'positional', params };
    }
  }

  expression() {
    return this.assignment();
  }

  assignment() {
    const expr = this.logicalOr();
    
    if (this.match('ASSIGN')) {
      const value = this.assignment();
      
      if (expr.type === 'Identifier') {
        return new BinaryOperation('=', expr, value);
      }
      
      throw new Error('Invalid assignment target');
    }
    
    return expr;
  }

  logicalOr() {
    let expr = this.logicalAnd();
    
    while (this.match('OR')) {
      const operator = this.previous().value;
      const right = this.logicalAnd();
      expr = new BinaryOperation(operator, expr, right);
    }
    
    return expr;
  }

  logicalAnd() {
    let expr = this.equality();
    
    while (this.match('AND')) {
      const operator = this.previous().value;
      const right = this.equality();
      expr = new BinaryOperation(operator, expr, right);
    }
    
    return expr;
  }

  equality() {
    let expr = this.comparison();
    
    while (this.match('EQ', 'NEQ')) {
      const operator = this.previous().value;
      const right = this.comparison();
      expr = new BinaryOperation(operator, expr, right);
    }
    
    return expr;
  }

  comparison() {
    let expr = this.term();
    
    while (this.match('GT', 'GTE', 'LT', 'LTE')) {
      const operator = this.previous().value;
      const right = this.term();
      expr = new BinaryOperation(operator, expr, right);
    }
    
    return expr;
  }

  term() {
    let expr = this.factor();
    
    while (this.match('PLUS', 'MINUS')) {
      const operator = this.previous().value;
      const right = this.factor();
      expr = new BinaryOperation(operator, expr, right);
    }
    
    return expr;
  }

  factor() {
    let expr = this.unary();
    
    while (this.match('MULTIPLY', 'DIVIDE')) {
      const operator = this.previous().value;
      const right = this.unary();
      expr = new BinaryOperation(operator, expr, right);
    }
    
    return expr;
  }

  unary() {
    if (this.match('MINUS', '!')) {
      const operator = this.previous().value;
      const right = this.unary();
      return new UnaryOperation(operator, right);
    }
    
    return this.call();
  }

  call() {
    let expr = this.primary();
    
    while (true) {
      if (this.match('LPAREN')) {
        expr = this.finishCall(expr);
      } else if (this.match('LBRACE')) {
        // Handle function calls with object literal arguments
        const arg = this.objectLiteral();
        expr = new FunctionCall(expr, [arg]);
      } else if (this.check('STRING') || this.check('INTEGER') || this.check('FLOAT') || 
                 this.check('IDENTIFIER') || this.check('LPAREN') || this.check('LBRACKET')) {
        // Handle function calls with space-separated arguments (like echo "hello")
        const args = [];
        while (!this.check('SEMICOLON') && !this.check('RBRACE') && !this.check('RBRACKET') && 
               !this.check('COMMA') && !this.isAtEnd()) {
          args.push(this.expression());
          if (!this.check('SEMICOLON') && !this.check('RBRACE') && !this.check('RBRACKET') && 
              !this.check('COMMA') && !this.isAtEnd()) {
            // Continue parsing arguments
          } else {
            break;
          }
        }
        if (args.length > 0) {
          expr = new FunctionCall(expr, args);
        }
      } else if (this.match('DOT')) {
        const property = this.consume('IDENTIFIER', 'Expected property name after .').value;
        expr = new PropertyAccess(expr, new Identifier(property));
      } else {
        break;
      }
    }
    
    return expr;
  }

  finishCall(callee) {
    const args = [];
    
    if (!this.check('RPAREN')) {
      do {
        args.push(this.expression());
      } while (this.match('COMMA'));
    }
    
    this.consume('RPAREN', 'Expected ) after arguments');
    
    return new FunctionCall(callee, args);
  }

  primary() {
    if (this.match('TRUE')) return new BooleanLiteral(true);
    if (this.match('FALSE')) return new BooleanLiteral(false);
    if (this.match('NULL')) return new NullLiteral();
    
    if (this.match('INTEGER')) {
      return new IntegerLiteral(this.previous().value);
    }
    
    if (this.match('FLOAT')) {
      return new FloatLiteral(this.previous().value);
    }
    
    if (this.match('STRING')) {
      return new StringLiteral(this.previous().value);
    }
    
    if (this.match('IDENTIFIER')) {
      return new Identifier(this.previous().value);
    }
    
    if (this.match('LPAREN')) {
      const expr = this.expression();
      this.consume('RPAREN', 'Expected ) after expression');
      return expr;
    }
    
    if (this.match('LBRACE')) {
      return this.objectLiteral();
    }
    
    if (this.match('LBRACKET')) {
      return this.arrayLiteral();
    }
    
    if (this.match('IF')) {
      return this.conditionalExpression();
    }
    
    throw new Error(`Unexpected token: ${this.peek().type} at line ${this.peek().line}`);
  }

  conditionalExpression() {
    this.consume('LPAREN', 'Expected ( after if');
    const condition = this.expression();
    this.consume('RPAREN', 'Expected ) after condition');
    
    this.consume('THEN', 'Expected then after condition');
    const thenBranch = this.expression();
    
    this.consume('ELSE', 'Expected else after then branch');
    const elseBranch = this.expression();
    
    return new ConditionalExpression(condition, thenBranch, elseBranch);
  }

  objectLiteral() {
    const properties = [];
    
    while (!this.check('RBRACE') && !this.isAtEnd()) {
      // Allow identifiers or keywords as property names
      if (!this.match('IDENTIFIER') && !this.match('STYLE')) {
        throw new Error('Expected property key');
      }
      const key = this.previous().value;
      this.consume('COLON', 'Expected : after property key');
      
      // Check if this is a component call (identifier followed by {)
      let value;
      if (this.check('IDENTIFIER') && this.peek(1) && this.peek(1).type === 'LBRACE') {
        value = this.call(); // Parse as function call
      } else {
        value = this.expression(); // Parse as regular expression
      }
      
      properties.push({ key, value });
      
      if (!this.match('COMMA') && !this.match('SEMICOLON')) {
        if (!this.check('RBRACE')) {
          throw new Error('Expected ,, ;, or } after property');
        }
        break;
      }
    }
    
    this.consume('RBRACE', 'Expected } after object properties');
    
    return new ObjectLiteral(properties);
  }

  arrayLiteral() {
    const elements = [];
    
    while (!this.check('RBRACKET') && !this.isAtEnd()) {
      elements.push(this.expression());
      
      if (!this.match('COMMA') && !this.match('SEMICOLON')) {
        if (!this.check('RBRACKET')) {
          throw new Error('Expected ,, ;, or ] after element');
        }
        break;
      }
    }
    
    this.consume('RBRACKET', 'Expected ] after array elements');
    
    return new ArrayLiteral(elements);
  }
}

module.exports = Parser;
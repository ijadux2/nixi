#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Lexer = require('./lexer');
const Parser = require('./parser');

class NixiCompiler {
  constructor() {
    this.indentLevel = 0;
    this.imports = new Set();
    this.variables = new Map();
    this.components = new Map();
    this.styles = new Map();
  }

  compileFile(filePath, options = {}) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return this.compile(content, filePath, options);
    } catch (error) {
      console.error('Compilation stack:', error.stack);
      throw new Error(`Error reading file ${filePath}: ${error.message}`);
    }
  }

  compile(source, filename = '<stdin>', options = {}) {
    try {
      console.log('Step 1: Lexing...');
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      console.log('Step 2: Parsing...');
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      console.log('Step 3: Generating JavaScript...');
      const jsCode = this.generateJavaScript(ast, options || {});
      
      console.log('Step 4: Compilation complete');
      return {
        code: jsCode,
        imports: Array.from(this.imports),
        components: Array.from(this.components.keys()),
        styles: Array.from(this.styles.keys())
      };
    } catch (error) {
      console.error('Error in compile:', error.stack);
      throw new Error(filename + ':' + error.message);
    }
  }

  generateJavaScript(ast, options = {}) {
    this.indentLevel = 0;
    this.imports.clear();
    this.variables.clear();
    this.components.clear();
    this.styles.clear();
    
    let code = '';
    
    // Add imports
    if (options && options.includeRuntime !== false) {
      code += this.generateRuntimeImports(options);
    }
    
    // Generate main code
    code += this.generateNode(ast);
    
    return code;
  }

  generateRuntimeImports(options = {}) {
    let imports = '';
    
    // File system imports
    this.imports.add('fs');
    this.imports.add('path');
    
    imports += 'const fs = require(\'fs\');\n';
    imports += 'const path = require(\'path\');\n';
    
    // GUI renderer - always include for now
    imports += 'const GUIRenderer = require(\'./gui-renderer\');\n';
    
    // Runtime utilities
    imports += this.generateRuntimeUtilities();
    
    return imports + '\n';
  }

  generateRuntimeUtilities() {
    return `
// Nixi Runtime Utilities
class NixiValue {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }

  static fromNative(value) {
    if (value === null || value === undefined) {
      return new NixiValue('null', null);
    }
    if (typeof value === 'boolean') {
      return new NixiValue('boolean', value);
    }
    if (typeof value === 'number') {
      return new NixiValue('number', value);
    }
    if (typeof value === 'string') {
      return new NixiValue('string', value);
    }
    if (Array.isArray(value)) {
      return new NixiValue('array', value.map(NixiValue.fromNative));
    }
    if (typeof value === 'object') {
      const obj = {};
      for (const [key, val] of Object.entries(value)) {
        obj[key] = NixiValue.fromNative(val);
      }
      return new NixiValue('object', obj);
    }
    if (typeof value === 'function') {
      return new NixiValue('function', value);
    }
    
    return new NixiValue('unknown', value);
  }

  toNative() {
    if (this.type === 'null') return null;
    if (this.type === 'boolean') return this.value;
    if (this.type === 'number') return this.value;
    if (this.type === 'string') return this.value;
    if (this.type === 'array') return this.value.map(v => v.toNative());
    if (this.type === 'object') {
      const obj = {};
      for (const [key, val] of Object.entries(this.value)) {
        obj[key] = val.toNative();
      }
      return obj;
    }
    if (this.type === 'function') return this.value;
    
    return this.value;
  }

  toString() {
    if (this.type === 'string') return '"' + this.value + '"';
    if (this.type === 'null') return 'null';
    if (this.type === 'array') {
      return '[' + this.value.map(v => v.toString()).join(', ') + ']';
    }
    if (this.type === 'object') {
      const props = Object.entries(this.value)
        .map(([key, val]) => key + ' = ' + val.toString())
        .join(', ');
      return '{ ' + props + ' }';
    }
    return String(this.value);
  }
}

// Built-in functions
const builtins = {
  add: (a, b) => new NixiValue('number', a.toNative() + b.toNative()),
  multiply: (a, b) => new NixiValue('number', a.toNative() * b.toNative()),
  subtract: (a, b) => new NixiValue('number', a.toNative() - b.toNative()),
  divide: (a, b) => new NixiValue('number', a.toNative() / b.toNative()),
  echo: (...args) => {
    const message = args.map(arg => arg.toNative()).join(' ');
    console.log(message);
    return new NixiValue('null', null);
  },
  concat: (a, b) => new NixiValue('string', a.toNative() + b.toNative()),
  toString: (value) => new NixiValue('string', String(value.toNative())),
  map: (f, list) => {
    if (list.type !== 'array') {
      throw new Error('map expects array as second argument');
    }
    const result = list.value.map(item => f.value(item));
    return new NixiValue('array', result);
  },
  length: (arr) => {
    if (arr.type === 'array') {
      return new NixiValue('number', arr.value.length);
    }
    if (arr.type === 'string') {
      return new NixiValue('number', arr.value.length);
    }
    throw new Error('length expects array or string');
  },
  ls: (dir) => {
    const dirPath = dir.toNative() || '.';
    try {
      const files = fs.readdirSync(dirPath);
      return NixiValue.fromNative(files);
    } catch (error) {
      throw new Error('ls failed: ' + error.message);
    }
  },
  cd: (dir) => {
    const dirPath = dir.toNative();
    try {
      process.chdir(dirPath);
      return new NixiValue('null', null);
    } catch (error) {
      throw new Error('cd failed: ' + error.message);
    }
  },
  pwd: () => NixiValue.fromNative(process.cwd()),
  div: (props) => NixiValue.fromNative({
    type: 'div',
    props: props.toNative()
  }),
  span: (props) => NixiValue.fromNative({
    type: 'span',
    props: props.toNative()
  }),
  button: (props) => NixiValue.fromNative({
    type: 'button',
    props: props.toNative()
  }),
  input: (props) => NixiValue.fromNative({
    type: 'input',
    props: props.toNative()
  }),
  h1: (props) => NixiValue.fromNative({
    type: 'h1',
    props: props.toNative()
  }),
  h2: (props) => NixiValue.fromNative({
    type: 'h2',
    props: props.toNative()
  }),
  h3: (props) => NixiValue.fromNative({
    type: 'h3',
    props: props.toNative()
  }),
  p: (props) => NixiValue.fromNative({
    type: 'p',
    props: props.toNative()
  }),
  a: (props) => NixiValue.fromNative({
    type: 'a',
    props: props.toNative()
  })
};

let guiRenderer = null;
const getGUIRenderer = () => {
  if (!guiRenderer) {
    guiRenderer = new GUIRenderer();
  }
  return guiRenderer;
};

builtins.renderHTML = (component, title) => {
  const html = getGUIRenderer().generateHTML(component, title.toNative());
  return new NixiValue('string', html);
};

builtins.saveHTML = (component, filename, title) => {
  const html = getGUIRenderer().generateHTML(component, title.toNative());
  getGUIRenderer().saveToFile(html, filename.toNative());
  return new NixiValue('null', null);
};

builtins.addStyle = (selector, properties) => {
  getGUIRenderer().addStyle(selector.toNative(), properties.toNative());
  return new NixiValue('null', null);
};

`;
  }

  generateNode(node) {
    switch (node.type) {
      case 'Program':
        return this.generateProgram(node);
      case 'IntegerLiteral':
        return `new NixiValue('number', ${node.value})`;
      case 'FloatLiteral':
        return `new NixiValue('number', ${node.value})`;
      case 'StringLiteral':
        return `new NixiValue('string', ${JSON.stringify(node.value)})`;
      case 'BooleanLiteral':
        return `new NixiValue('boolean', ${node.value})`;
      case 'NullLiteral':
        return `new NixiValue('null', null)`;
      case 'Identifier':
        return this.generateIdentifier(node);
      case 'BinaryOperation':
        return this.generateBinaryOperation(node);
      case 'UnaryOperation':
        return this.generateUnaryOperation(node);
      case 'FunctionCall':
        return this.generateFunctionCall(node);
      case 'LambdaExpression':
        return this.generateLambdaExpression(node);
      case 'LetExpression':
        return this.generateLetExpression(node);
      case 'ObjectLiteral':
        return this.generateObjectLiteral(node);
      case 'ArrayLiteral':
        return this.generateArrayLiteral(node);
      case 'PropertyAccess':
        return this.generatePropertyAccess(node);
      case 'ConditionalExpression':
        return this.generateConditionalExpression(node);
      case 'ComponentDefinition':
        return this.generateComponentDefinition(node);
      case 'ComponentInstantiation':
        return this.generateComponentInstantiation(node);
      case 'StyleDefinition':
        return this.generateStyleDefinition(node);
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  generateProgram(node) {
    let code = '';
    
    for (const statement of node.body) {
      code += this.generateNode(statement);
      code += ';\n';
    }
    
    return code;
  }

  generateIdentifier(node) {
    // List of built-in functions
    const builtinFunctions = [
      'add', 'multiply', 'subtract', 'divide', 'echo', 'concat', 'toString',
      'map', 'length', 'ls', 'cd', 'pwd', 'div', 'span', 'button', 'input',
      'h1', 'h2', 'h3', 'p', 'a', 'renderHTML', 'saveHTML', 'addStyle'
    ];
    
    // Check if it's a builtin
    if (builtinFunctions.includes(node.name)) {
      return `builtins.${node.name}`;
    }
    
    // Check if it's a component
    if (this.components.has(node.name)) {
      return this.components.get(node.name);
    }
    
    // Otherwise it's a variable
    return node.name;
  }

  generateBinaryOperation(node) {
    const left = this.generateNode(node.left);
    const right = this.generateNode(node.right);
    
    switch (node.operator) {
      case '+':
        return `(function() { 
          const l = ${left}; 
          const r = ${right}; 
          if (l.type === 'number' && r.type === 'number') {
            return new NixiValue('number', l.value + r.value);
          }
          if (l.type === 'string' || r.type === 'string') {
            return new NixiValue('string', l.toNative() + r.toNative());
          }
          throw new Error('Invalid operands for +');
        })()`;
      
      case '-':
      case '*':
      case '/':
        return `(function() { 
          const l = ${left}; 
          const r = ${right}; 
          if (l.type === 'number' && r.type === 'number') {
            const result = l.value ${node.operator} r.value;
            return new NixiValue('number', result);
          }
          throw new Error('Invalid operands for arithmetic operation');
        })()`;
      
      case '==':
        return `new NixiValue('boolean', (${left}).toNative() === (${right}).toNative())`;
      
      case '!=':
        return `new NixiValue('boolean', (${left}).toNative() !== (${right}).toNative())`;
      
      case '<':
      case '<=':
      case '>':
      case '>=':
        return `(function() { 
          const l = ${left}; 
          const r = ${right}; 
          if (l.type === 'number' && r.type === 'number') {
            const result = l.value ${node.operator} r.value;
            return new NixiValue('boolean', result);
          }
          throw new Error('Invalid operands for comparison');
        })()`;
      
      case '&&':
        return `new NixiValue('boolean', (${left}).toNative() && (${right}).toNative())`;
      
      case '||':
        return `new NixiValue('boolean', (${left}).toNative() || (${right}).toNative())`;
      
      case '=':
        if (node.left.type === 'Identifier') {
          return `${this.generateIdentifier(node.left)} = ${right}`;
        }
        throw new Error('Invalid assignment target');
      
      default:
        throw new Error(`Unknown binary operator: ${node.operator}`);
    }
  }

  generateUnaryOperation(node) {
    const operand = this.generateNode(node.operand);
    
    switch (node.operator) {
      case '-':
        return `(function() { 
          const op = ${operand}; 
          if (op.type === 'number') {
            return new NixiValue('number', -op.value);
          }
          throw new Error('Invalid operand for unary -');
        })()`;
      
      case '!':
        return `new NixiValue('boolean', !(${operand}).toNative())`;
      
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  generateFunctionCall(node) {
    const callee = this.generateNode(node.callee);
    const args = node.args.map(arg => this.generateNode(arg));
    
    // Check if it's a builtin function (direct call) or user function (call .value)
    if (node.callee.type === 'Identifier' && 
        ['add', 'multiply', 'subtract', 'divide', 'echo', 'concat', 'toString',
         'map', 'length', 'ls', 'cd', 'pwd', 'div', 'span', 'button', 'input',
         'h1', 'h2', 'h3', 'p', 'a', 'renderHTML', 'saveHTML', 'addStyle'].includes(node.callee.name)) {
      return `(${callee})(${args.join(', ')})`;
    }
    
    return `(${callee}).value(${args.join(', ')})`;
  }

  generateLambdaExpression(node) {
    const params = node.params.type === 'positional' 
      ? node.params.params.join(', ')
      : `{ ${node.params.params.join(', ')} }`;
    
    const body = this.generateNode(node.body);
    
    return `new NixiValue('function', function(${params}) {
      ${body}
    })`;
  }

  generateLetExpression(node) {
    let code = '(function() {\n';
    this.indentLevel++;
    
    // Generate bindings
    for (const binding of node.bindings) {
      const value = this.generateNode(binding.value);
      const name = binding.name.name;
      code += `${this.indent()}const ${name} = ${value};\n`;
    }
    
    // Generate body
    const body = this.generateNode(node.body);
    code += `${this.indent()}return ${body};\n`;
    
    this.indentLevel--;
    code += `${this.indent()}})()`;
    
    return code;
  }

  generateObjectLiteral(node) {
    const properties = node.properties.map(prop => {
      const value = this.generateNode(prop.value);
      return `${JSON.stringify(prop.key)}: ${value}`;
    });
    
    return `new NixiValue('object', { ${properties.join(', ')} })`;
  }

  generateArrayLiteral(node) {
    const elements = node.elements.map(element => this.generateNode(element));
    return `new NixiValue('array', [${elements.join(', ')}])`;
  }

  generatePropertyAccess(node) {
    const object = this.generateNode(node.object);
    const property = node.property.name;
    
    return `(function() { 
      const obj = ${object}; 
      if (obj.type !== 'object') {
        throw new Error('Attempted to access property of non-object');
      }
      return obj.value[${JSON.stringify(property)}] || new NixiValue('null', null);
    })()`;
  }

  generateConditionalExpression(node) {
    const condition = this.generateNode(node.condition);
    const thenBranch = this.generateNode(node.thenBranch);
    const elseBranch = this.generateNode(node.elseBranch);
    
    return `(${condition}).toNative() ? ${thenBranch} : ${elseBranch}`;
  }

  generateComponentDefinition(node) {
    const params = node.params.type === 'positional' 
      ? node.params.params.join(', ')
      : `{ ${node.params.params.join(', ')} }`;
    
    const body = this.generateNode(node.body);
    
    const componentName = `component_${node.name}`;
    const componentCode = `const ${componentName} = new NixiValue('function', function(${params}) {
  ${body}
});`;
    
    this.components.set(node.name, componentName);
    
    return componentCode + `\nconst ${node.name} = ${componentName};`;
  }

  generateComponentInstantiation(node) {
    const component = this.generateNode(node.component);
    const props = this.generateNode(node.props);
    
    return `(${component}).value(${props})`;
  }

  generateStyleDefinition(node) {
    const properties = {};
    for (const prop of node.properties) {
      properties[prop.name] = prop.value;
    }
    
    const styleCode = `(function() {
  const properties = ${JSON.stringify(properties)};
  getGUIRenderer().addStyle(${JSON.stringify(node.selector)}, properties);
  return new NixiValue('null', null);
})()`;
    
    this.styles.set(node.selector, properties);
    
    return styleCode;
  }

  indent() {
    return '  '.repeat(this.indentLevel);
  }

  showHelp() {
    console.log(`
Nixi Compiler v0.1.0

Usage:
  nixi <file>          Compile and run a Nixi file
  nixi --compile <file>  Compile to JavaScript and output
  nixi --help          Show this help
  nixi --version       Show version

Examples:
  nixi hello.nixi
  nixi --compile hello.nixi > hello.js
    `);
  }

  runRepl() {
    console.log('Nixi REPL v0.1.0 (Compiler Mode)');
    console.log('Type "exit" to quit');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'nixi> '
    });
    
    // Initialize runtime environment for REPL
    let replCode = this.generateRuntimeImports({ includeGUI: true });
    
    rl.prompt();
    
    rl.on('line', (line) => {
      if (line.trim() === 'exit') {
        rl.close();
        return;
      }
      
      if (line.trim() === '') {
        rl.prompt();
        return;
      }
      
      try {
        const result = this.run(line);
        if (result && result.code) {
          // Execute the compiled code in REPL context
          const wrappedCode = `
            (function() {
              ${replCode}
              ${result.code}
            })()
          `;
          
          const evalResult = eval(wrappedCode);
          if (evalResult !== undefined) {
            console.log(evalResult.toString ? evalResult.toString() : evalResult);
          }
        }
      } catch (error) {
        console.error('Error:', error.message);
      }
      
      rl.prompt();
    });
    
    rl.on('close', () => {
      console.log('Goodbye!');
      process.exit(0);
    });
  }

  run(source, filename = '<stdin>') {
    try {
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      const result = this.generateJavaScript(ast, { includeRuntime: false });
      
      return {
        code: result,
        ast: ast
      };
    } catch (error) {
      throw new Error(`${filename}:${error.message}`);
    }
  }

  showVersion() {
    console.log('Nixi Compiler v0.1.0');
  }
}

function main() {
  const compiler = new NixiCompiler();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    compiler.runRepl();
    return;
  }
  
  if (args[0] === '--help' || args[0] === '-h') {
    compiler.showHelp();
  } else if (args[0] === '--version' || args[0] === '-v') {
    compiler.showVersion();
  } else if (args[0] === '--compile') {
    if (args.length < 2) {
      console.error('Error: No input file specified for compilation');
      process.exit(1);
    }
    
    try {
      const result = compiler.compileFile(args[1]);
      console.log(result.code);
    } catch (error) {
      console.error('Compilation error:', error.message);
      process.exit(1);
    }
  } else if (args[0].startsWith('-')) {
    console.error(`Unknown option: ${args[0]}`);
    console.log('Use --help for available options');
    process.exit(1);
  } else {
    // Check if the argument is a valid file
    const filename = args[0];
    if (!fs.existsSync(filename)) {
      console.error(`Error: File not found: ${filename}`);
      console.log('Usage: nixi <file>');
      console.log('   or: nixi          (for REPL mode)');
      console.log('   or: nixi --help   (for help)');
      process.exit(1);
    }
    
    try {
      const result = compiler.compileFile(filename);
      
      // Write compiled code to file for debugging
      fs.writeFileSync('debug_output.js', result.code);
      console.log('Compiled code written to debug_output.js');
      
      // Execute the compiled code
      const module = { exports: {} };
      const dirname = path.dirname(path.resolve(filename));
      
      // Change to src directory temporarily for require resolution
      const originalCwd = process.cwd();
      process.chdir(path.resolve(__dirname));
      
      try {
        const wrappedCode = `
          (function(exports, require, module, __filename, __dirname) {
            ${result.code}
          })(module.exports, require, module, filename, dirname);
        `;
        
        eval(wrappedCode);
      } finally {
        process.chdir(originalCwd);
      }
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = NixiCompiler;
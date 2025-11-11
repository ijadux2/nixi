const fs = require('fs');
const path = require('path');
const GUIRenderer = require('./gui-renderer');

class Environment {
  constructor(parent = null) {
    this.parent = parent;
    this.values = new Map();
  }

  define(name, value) {
    this.values.set(name, value);
  }

  get(name) {
    if (this.values.has(name)) {
      return this.values.get(name);
    }
    
    if (this.parent) {
      return this.parent.get(name);
    }
    
    throw new Error(`Undefined variable: ${name}`);
  }

  set(name, value) {
    if (this.values.has(name)) {
      this.values.set(name, value);
      return;
    }
    
    if (this.parent) {
      this.parent.set(name, value);
      return;
    }
    
    throw new Error(`Undefined variable: ${name}`);
  }
}

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
    if (this.type === 'string') return `"${this.value}"`;
    if (this.type === 'null') return 'null';
    if (this.type === 'array') {
      return `[${this.value.map(v => v.toString()).join(', ')}]`;
    }
    if (this.type === 'object') {
      const props = Object.entries(this.value)
        .map(([key, val]) => `${key} = ${val.toString()}`)
        .join(', ');
      return `{ ${props} }`;
    }
    return String(this.value);
  }
}

class Interpreter {
  constructor() {
    this.globals = new Environment();
    this.environment = this.globals;
    this.guiRenderer = new GUIRenderer();
    this.setupBuiltins();
  }

  setupBuiltins() {
    // Math functions
    this.globals.define('add', new NixiValue('function', (a, b) => 
      new NixiValue('number', a.toNative() + b.toNative())));
    
    this.globals.define('multiply', new NixiValue('function', (a, b) => 
      new NixiValue('number', a.toNative() * b.toNative())));
    
    this.globals.define('subtract', new NixiValue('function', (a, b) => 
      new NixiValue('number', a.toNative() - b.toNative())));
    
    this.globals.define('divide', new NixiValue('function', (a, b) => 
      new NixiValue('number', a.toNative() / b.toNative())));
    
    // String functions
    this.globals.define('echo', new NixiValue('function', (...args) => {
      const message = args.map(arg => arg.toNative()).join(' ');
      console.log(message);
      return new NixiValue('null', null);
    }));
    
    this.globals.define('concat', new NixiValue('function', (a, b) => 
      new NixiValue('string', a.toNative() + b.toNative())));
    
    this.globals.define('toString', new NixiValue('function', (value) => 
      new NixiValue('string', String(value.toNative()))));
    
    this.globals.define('map', new NixiValue('function', (f, list) => {
      if (list.type !== 'array') {
        throw new Error('map expects array as second argument');
      }
      const result = list.value.map(item => f.value(item));
      return new NixiValue('array', result);
    }));
    
    // Array functions
    this.globals.define('length', new NixiValue('function', (arr) => {
      if (arr.type === 'array') {
        return new NixiValue('number', arr.value.length);
      }
      if (arr.type === 'string') {
        return new NixiValue('number', arr.value.length);
      }
      throw new Error('length expects array or string');
    }));
    
    // File system functions (Bash-like)
    this.globals.define('ls', new NixiValue('function', (dir) => {
      const dirPath = dir.toNative() || '.';
      try {
        const files = fs.readdirSync(dirPath);
        return NixiValue.fromNative(files);
      } catch (error) {
        throw new Error(`ls failed: ${error.message}`);
      }
    }));
    
    this.globals.define('cd', new NixiValue('function', (dir) => {
      const dirPath = dir.toNative();
      try {
        process.chdir(dirPath);
        return new NixiValue('null', null);
      } catch (error) {
        throw new Error(`cd failed: ${error.message}`);
      }
    }));
    
    this.globals.define('pwd', new NixiValue('function', () => {
      return NixiValue.fromNative(process.cwd());
    }));
    
    // GUI component functions
    this.globals.define('div', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'div',
        props: props.toNative()
      });
    }));
    
    this.globals.define('span', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'span',
        props: props.toNative()
      });
    }));
    
    this.globals.define('button', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'button',
        props: props.toNative()
      });
    }));
    
    this.globals.define('input', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'input',
        props: props.toNative()
      });
    }));
    
    this.globals.define('h1', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'h1',
        props: props.toNative()
      });
    }));
    
    this.globals.define('h2', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'h2',
        props: props.toNative()
      });
    }));
    
    this.globals.define('h3', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'h3',
        props: props.toNative()
      });
    }));
    
    this.globals.define('p', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'p',
        props: props.toNative()
      });
    }));
    
    this.globals.define('a', new NixiValue('function', (props) => {
      return NixiValue.fromNative({
        type: 'a',
        props: props.toNative()
      });
    }));
    
    // GUI rendering functions
    this.globals.define('renderHTML', new NixiValue('function', (component, title) => {
      const html = this.guiRenderer.generateHTML(component, title.toNative());
      return new NixiValue('string', html);
    }));
    
    this.globals.define('saveHTML', new NixiValue('function', (component, filename, title) => {
      const html = this.guiRenderer.generateHTML(component, title.toNative());
      this.guiRenderer.saveToFile(html, filename.toNative());
      return new NixiValue('null', null);
    }));
    
    this.globals.define('addStyle', new NixiValue('function', (selector, properties) => {
      this.guiRenderer.addStyle(selector.toNative(), properties.toNative());
      return new NixiValue('null', null);
    }));
  }

  evaluate(node) {
    switch (node.type) {
      case 'Program':
        return this.evaluateProgram(node);
      
      case 'IntegerLiteral':
        return new NixiValue('number', node.value);
      
      case 'FloatLiteral':
        return new NixiValue('number', node.value);
      
      case 'StringLiteral':
        return new NixiValue('string', node.value);
      
      case 'BooleanLiteral':
        return new NixiValue('boolean', node.value);
      
      case 'NullLiteral':
        return new NixiValue('null', null);
      
      case 'Identifier':
        return this.environment.get(node.name);
      
      case 'BinaryOperation':
        return this.evaluateBinaryOperation(node);
      
      case 'UnaryOperation':
        return this.evaluateUnaryOperation(node);
      
      case 'FunctionCall':
        return this.evaluateFunctionCall(node);
      
      case 'LambdaExpression':
        return this.evaluateLambdaExpression(node);
      
      case 'LetExpression':
        return this.evaluateLetExpression(node);
      
      case 'ObjectLiteral':
        return this.evaluateObjectLiteral(node);
      
      case 'ArrayLiteral':
        return this.evaluateArrayLiteral(node);
      
      case 'PropertyAccess':
        return this.evaluatePropertyAccess(node);
      
      case 'ConditionalExpression':
        return this.evaluateConditionalExpression(node);
      
      case 'ComponentDefinition':
        return this.evaluateComponentDefinition(node);
      
      case 'ComponentInstantiation':
        return this.evaluateComponentInstantiation(node);
      
      case 'StyleDefinition':
        return this.evaluateStyleDefinition(node);
      
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  evaluateProgram(node) {
    let result = new NixiValue('null', null);
    
    for (const statement of node.body) {
      result = this.evaluate(statement);
    }
    
    return result;
  }

  evaluateBinaryOperation(node) {
    const left = this.evaluate(node.left);
    const right = this.evaluate(node.right);
    
    switch (node.operator) {
      case '+':
        if (left.type === 'number' && right.type === 'number') {
          return new NixiValue('number', left.value + right.value);
        }
        if (left.type === 'string' || right.type === 'string') {
          return new NixiValue('string', left.toNative() + right.toNative());
        }
        throw new Error('Invalid operands for +');
      
      case '-':
      case '*':
      case '/':
        if (left.type === 'number' && right.type === 'number') {
          const result = node.operator === '-' ? left.value - right.value :
                        node.operator === '*' ? left.value * right.value :
                        left.value / right.value;
          return new NixiValue('number', result);
        }
        throw new Error('Invalid operands for arithmetic operation');
      
      case '==':
        return new NixiValue('boolean', left.toNative() === right.toNative());
      
      case '!=':
        return new NixiValue('boolean', left.toNative() !== right.toNative());
      
      case '<':
      case '<=':
      case '>':
      case '>=':
        if (left.type === 'number' && right.type === 'number') {
          const result = node.operator === '<' ? left.value < right.value :
                        node.operator === '<=' ? left.value <= right.value :
                        node.operator === '>' ? left.value > right.value :
                        left.value >= right.value;
          return new NixiValue('boolean', result);
        }
        throw new Error('Invalid operands for comparison');
      
      case '&&':
        return new NixiValue('boolean', left.toNative() && right.toNative());
      
      case '||':
        return new NixiValue('boolean', left.toNative() || right.toNative());
      
      case '=':
        if (node.left.type === 'Identifier') {
          this.environment.set(node.left.name, right);
          return right;
        }
        throw new Error('Invalid assignment target');
      
      default:
        throw new Error(`Unknown binary operator: ${node.operator}`);
    }
  }

  evaluateUnaryOperation(node) {
    const operand = this.evaluate(node.operand);
    
    switch (node.operator) {
      case '-':
        if (operand.type === 'number') {
          return new NixiValue('number', -operand.value);
        }
        throw new Error('Invalid operand for unary -');
      
      case '!':
        return new NixiValue('boolean', !operand.toNative());
      
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`);
    }
  }

  evaluateFunctionCall(node) {
    const callee = this.evaluate(node.callee);
    
    if (callee.type !== 'function') {
      throw new Error('Attempted to call non-function');
    }
    
    const args = node.args.map(arg => this.evaluate(arg));
    
    return callee.value(...args);
  }

  evaluateLambdaExpression(node) {
    const func = (...args) => {
      const env = new Environment(this.environment);
      
      if (node.params.type === 'positional') {
        for (let i = 0; i < node.params.params.length; i++) {
          env.define(node.params.params[i], args[i] || new NixiValue('null', null));
        }
      } else {
        // Named parameters - args[0] should be an object
        const props = args[0] && args[0].type === 'object' ? args[0].value : {};
        for (const param of node.params.params) {
          env.define(param, props[param] || new NixiValue('null', null));
        }
      }
      
      const previousEnv = this.environment;
      this.environment = env;
      
      try {
        return this.evaluate(node.body);
      } finally {
        this.environment = previousEnv;
      }
    };
    
    return new NixiValue('function', func);
  }

  evaluateLetExpression(node) {
    const env = new Environment(this.environment);
    const previousEnv = this.environment;
    this.environment = env;
    
    try {
      for (const binding of node.bindings) {
        const value = this.evaluate(binding.value);
        env.define(binding.name.name, value);
      }
      
      return this.evaluate(node.body);
    } finally {
      this.environment = previousEnv;
    }
  }

  evaluateObjectLiteral(node) {
    const obj = {};
    
    for (const property of node.properties) {
      obj[property.key] = this.evaluate(property.value);
    }
    
    return new NixiValue('object', obj);
  }

  evaluateArrayLiteral(node) {
    const elements = node.elements.map(element => this.evaluate(element));
    return new NixiValue('array', elements);
  }

  evaluatePropertyAccess(node) {
    const object = this.evaluate(node.object);
    
    if (object.type !== 'object') {
      throw new Error('Attempted to access property of non-object');
    }
    
    const property = node.property.name;
    
    if (object.value[property]) {
      return object.value[property];
    }
    
    return new NixiValue('null', null);
  }

  evaluateConditionalExpression(node) {
    const condition = this.evaluate(node.condition);
    
    if (condition.toNative()) {
      return this.evaluate(node.thenBranch);
    } else {
      return this.evaluate(node.elseBranch);
    }
  }

  evaluateComponentDefinition(node) {
    const component = (...args) => {
      const env = new Environment(this.environment);
      
      if (node.params.type === 'positional') {
        for (let i = 0; i < node.params.params.length; i++) {
          env.define(node.params.params[i], args[i] || new NixiValue('null', null));
        }
      } else {
        const props = args[0] && args[0].type === 'object' ? args[0].value : {};
        for (const param of node.params.params) {
          env.define(param, props[param] || new NixiValue('null', null));
        }
      }
      
      const previousEnv = this.environment;
      this.environment = env;
      
      try {
        return this.evaluate(node.body);
      } finally {
        this.environment = previousEnv;
      }
    };
    
    this.environment.define(node.name, new NixiValue('function', component));
    
    return new NixiValue('function', component);
  }

  evaluateComponentInstantiation(node) {
    const component = this.evaluate(node.component);
    
    if (component.type !== 'function') {
      throw new Error('Attempted to instantiate non-component');
    }
    
    const props = this.evaluate(node.props);
    
    return component.value(props);
  }

  evaluateStyleDefinition(node) {
    // Convert style properties to a native object
    const properties = {};
    for (const prop of node.properties) {
      properties[prop.name] = prop.value;
    }
    
    // Add the style to the GUI renderer
    this.guiRenderer.addStyle(node.selector, properties);
    
    // Also store it in the environment for reference
    const style = {
      selector: node.selector,
      properties: properties
    };
    
    this.environment.define(`style_${node.selector}`, new NixiValue('object', style));
    
    return new NixiValue('null', null);
  }
}

module.exports = Interpreter;
const fs = require('fs');
const path = require('path');
const GUIRenderer = require('./gui-renderer');

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


(function() {
  const properties = {"border":"1px solid #ccc","padding":"20px","margin":"10px","border-radius":"8px"};
  getGUIRenderer().addStyle(".card", properties);
  return new NixiValue('null', null);
})();
(function() {
  const properties = {"background":"#007bff","color":"white","padding":"10px 20px","border":"none","border-radius":"4px","cursor":"pointer"};
  getGUIRenderer().addStyle(".btn", properties);
  return new NixiValue('null', null);
})();
(function() {
  const card1 = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "card"), "children": new NixiValue('array', [(builtins.h3)(new NixiValue('object', { "text": new NixiValue('string', "Feature 1") })), (builtins.p)(new NixiValue('object', { "text": new NixiValue('string', "This is the first feature card") }))]) }));
  const card2 = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "card"), "children": new NixiValue('array', [(builtins.h3)(new NixiValue('object', { "text": new NixiValue('string', "Feature 2") })), (builtins.p)(new NixiValue('object', { "text": new NixiValue('string', "This is the second feature card") }))]) }));
  const button1 = (builtins.button)(new NixiValue('object', { "class": new NixiValue('string', "btn"), "text": new NixiValue('string', "Click Me"), "onClick": (builtins.echo)(new NixiValue('string', "Button clicked!")) }));
  const app = (builtins.div)(new NixiValue('object', { "class": new NixiValue('string', "app"), "children": new NixiValue('array', [(builtins.h1)(new NixiValue('object', { "text": new NixiValue('string', "Simple Component Demo") })), card1, card2, button1]) }));
  return (builtins.saveHTML)(app, new NixiValue('string', "simple-components.html"), new NixiValue('string', "Simple Component Demo"));
})();

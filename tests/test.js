const Lexer = require('../src/lexer');
const Parser = require('../src/parser');
const Interpreter = require('../src/interpreter');

function test(description, testFn) {
  try {
    testFn();
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ ${description}: ${error.message}`);
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}. ${message}`);
  }
}

function assertDeepEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}. ${message}`);
  }
}

// Test Lexer
function testLexer() {
  console.log('\n=== Testing Lexer ===');
  
  test('should tokenize numbers', () => {
    const lexer = new Lexer('42 3.14');
    const tokens = lexer.tokenize();
    assertEqual(tokens[0].type, 'INTEGER');
    assertEqual(tokens[0].value, 42);
    assertEqual(tokens[1].type, 'FLOAT');
    assertEqual(tokens[1].value, 3.14);
  });
  
  test('should tokenize strings', () => {
    const lexer = new Lexer('"hello" \'world\'');
    const tokens = lexer.tokenize();
    assertEqual(tokens[0].type, 'STRING');
    assertEqual(tokens[0].value, 'hello');
    assertEqual(tokens[1].type, 'STRING');
    assertEqual(tokens[1].value, 'world');
  });
  
  test('should tokenize identifiers and keywords', () => {
    const lexer = new Lexer('let in if then else component style');
    const tokens = lexer.tokenize();
    assertEqual(tokens[0].type, 'LET');
    assertEqual(tokens[1].type, 'IN');
    assertEqual(tokens[2].type, 'IF');
    assertEqual(tokens[3].type, 'THEN');
    assertEqual(tokens[4].type, 'ELSE');
    assertEqual(tokens[5].type, 'COMPONENT');
    assertEqual(tokens[6].type, 'STYLE');
  });
  
  test('should tokenize operators', () => {
    const lexer = new Lexer('+ - * / == != && || < > <= >=');
    const tokens = lexer.tokenize();
    const expectedTypes = ['PLUS', 'MINUS', 'MULTIPLY', 'DIVIDE', 'EQ', 'NEQ', 'AND', 'OR', 'LT', 'GT', 'LTE', 'GTE'];
    expectedTypes.forEach((type, i) => {
      assertEqual(tokens[i].type, type);
    });
  });
}

// Test Parser
function testParser() {
  console.log('\n=== Testing Parser ===');
  
  test('should parse simple expressions', () => {
    const lexer = new Lexer('1 + 2 * 3');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    assertEqual(ast.type, 'Program');
    assertEqual(ast.body[0].type, 'BinaryOperation');
    assertEqual(ast.body[0].operator, '+');
  });
  
  test('should parse let expressions', () => {
    const lexer = new Lexer('let x = 5; y = 10; in x + y');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    assertEqual(ast.body[0].type, 'LetExpression');
    assertEqual(ast.body[0].bindings.length, 2);
    assertEqual(ast.body[0].bindings[0].name.name, 'x');
    assertEqual(ast.body[0].bindings[1].name.name, 'y');
  });
  
  test('should parse function calls', () => {
    const lexer = new Lexer('add(1, 2)');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    
    assertEqual(ast.body[0].type, 'FunctionCall');
    assertEqual(ast.body[0].callee.name, 'add');
    assertEqual(ast.body[0].args.length, 2);
  });
}

// Test Interpreter
function testInterpreter() {
  console.log('\n=== Testing Interpreter ===');
  
  test('should evaluate basic arithmetic', () => {
    const interpreter = new Interpreter();
    const lexer = new Lexer('1 + 2 * 3');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = interpreter.evaluate(ast);
    
    assertEqual(result.type, 'number');
    assertEqual(result.value, 7);
  });
  
  test('should evaluate let expressions', () => {
    const interpreter = new Interpreter();
    const lexer = new Lexer('let x = 5; y = 10; in x + y');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = interpreter.evaluate(ast);
    
    assertEqual(result.type, 'number');
    assertEqual(result.value, 15);
  });
  
  test('should evaluate string operations', () => {
    const interpreter = new Interpreter();
    const lexer = new Lexer('"hello" + " " + "world"');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = interpreter.evaluate(ast);
    
    assertEqual(result.type, 'string');
    assertEqual(result.value, 'hello world');
  });
  
  test('should evaluate boolean expressions', () => {
    const interpreter = new Interpreter();
    const lexer = new Lexer('true && false || true');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = interpreter.evaluate(ast);
    
    assertEqual(result.type, 'boolean');
    assertEqual(result.value, true);
  });
}

// Test GUI Components
function testGUI() {
  console.log('\n=== Testing GUI Components ===');
  
  test('should create basic components', () => {
    const interpreter = new Interpreter();
    const lexer = new Lexer('div { class: "container"; text: "Hello" }');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = interpreter.evaluate(ast);
    
    assertEqual(result.type, 'object');
    assertEqual(result.value.type.value, 'div');
    assertEqual(result.value.props.value.class.value, 'container');
    assertEqual(result.value.props.value.text.value, 'Hello');
  });
  
  test('should generate HTML', () => {
    const interpreter = new Interpreter();
    const lexer = new Lexer('let comp = div { class: "test"; text: "Hello World" }; in renderHTML(comp, "Test")');
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const result = interpreter.evaluate(ast);
    
    assertEqual(result.type, 'string');
    const html = result.value;
    assertEqual(html.includes('<!DOCTYPE html>'), true);
    assertEqual(html.includes('<div class="test"'), true);
    assertEqual(html.includes('Hello World</div>'), true);
  });
}

// Run all tests
function runTests() {
  console.log('Running Nixi Test Suite...');
  
  testLexer();
  testParser();
  testInterpreter();
  testGUI();
  
  console.log('\n=== Test Suite Complete ===');
}

if (require.main === module) {
  runTests();
}

module.exports = { test, assertEqual, assertDeepEqual };
// AST Node Types
class ASTNode {
  constructor(type, props = {}) {
    this.type = type;
    Object.assign(this, props);
  }
}

// Literals
class IntegerLiteral extends ASTNode {
  constructor(value) {
    super('IntegerLiteral', { value });
  }
}

class FloatLiteral extends ASTNode {
  constructor(value) {
    super('FloatLiteral', { value });
  }
}

class StringLiteral extends ASTNode {
  constructor(value) {
    super('StringLiteral', { value });
  }
}

class BooleanLiteral extends ASTNode {
  constructor(value) {
    super('BooleanLiteral', { value });
  }
}

class NullLiteral extends ASTNode {
  constructor() {
    super('NullLiteral');
  }
}

// Variables and References
class Identifier extends ASTNode {
  constructor(name) {
    super('Identifier', { name });
  }
}

// Function-related nodes
class FunctionDefinition extends ASTNode {
  constructor(params, body) {
    super('FunctionDefinition', { params, body });
  }
}

class FunctionCall extends ASTNode {
  constructor(callee, args) {
    super('FunctionCall', { callee, args });
  }
}

class LambdaExpression extends ASTNode {
  constructor(params, body) {
    super('LambdaExpression', { params, body });
  }
}

// Let expressions (Nix-style)
class LetExpression extends ASTNode {
  constructor(bindings, body) {
    super('LetExpression', { bindings, body });
  }
}

class Binding extends ASTNode {
  constructor(name, value) {
    super('Binding', { name, value });
  }
}

// Object/Record operations
class ObjectLiteral extends ASTNode {
  constructor(properties) {
    super('ObjectLiteral', { properties });
  }
}

class PropertyAccess extends ASTNode {
  constructor(object, property) {
    super('PropertyAccess', { object, property });
  }
}

// Array operations
class ArrayLiteral extends ASTNode {
  constructor(elements) {
    super('ArrayLiteral', { elements });
  }
}

// Binary and unary operations
class BinaryOperation extends ASTNode {
  constructor(operator, left, right) {
    super('BinaryOperation', { operator, left, right });
  }
}

class UnaryOperation extends ASTNode {
  constructor(operator, operand) {
    super('UnaryOperation', { operator, operand });
  }
}

// Conditional expressions
class ConditionalExpression extends ASTNode {
  constructor(condition, thenBranch, elseBranch) {
    super('ConditionalExpression', { condition, thenBranch, elseBranch });
  }
}

// Component definitions (GUI)
class ComponentDefinition extends ASTNode {
  constructor(name, params, body) {
    super('ComponentDefinition', { name, params, body });
  }
}

class ComponentInstantiation extends ASTNode {
  constructor(component, props) {
    super('ComponentInstantiation', { component, props });
  }
}

// Style definitions
class StyleDefinition extends ASTNode {
  constructor(selector, properties) {
    super('StyleDefinition', { selector, properties });
  }
}

// Program root
class Program extends ASTNode {
  constructor(body) {
    super('Program', { body });
  }
}

module.exports = {
  ASTNode,
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
};
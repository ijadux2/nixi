import re
from enum import Enum, auto
from dataclasses import dataclass
from typing import List, Any, Optional, Dict
import subprocess
import sys

# ===== LEXER =====
class TokenType(Enum):
    # Literals
    NUMBER = auto()
    STRING = auto()
    IDENTIFIER = auto()
    TRUE = auto()
    FALSE = auto()
    
    # Keywords
    FUNC = auto()
    LET = auto()
    IF = auto()
    THEN = auto()
    ELSE = auto()
    GUI = auto()
    WINDOW = auto()
    BUTTON = auto()
    LABEL = auto()
    TEXTBOX = auto()
    IMPORT = auto()
    RETURN = auto()
    
    # Operators
    ASSIGN = auto()
    PLUS = auto()
    MINUS = auto()
    MULTIPLY = auto()
    DIVIDE = auto()
    EQUALS = auto()
    PIPE = auto()
    ARROW = auto()  # ->
    
    # Delimiters
    LPAREN = auto()
    RPAREN = auto()
    LBRACE = auto()
    RBRACE = auto()
    LBRACKET = auto()
    RBRACKET = auto()
    SEMICOLON = auto()
    COLON = auto()
    COMMA = auto()
    DOT = auto()
    
    EOF = auto()

@dataclass
class Token:
    type: TokenType
    value: Any
    line: int
    column: int

class Lexer:
    def __init__(self, source: str):
        self.source = source
        self.pos = 0
        self.line = 1
        self.column = 1
        self.tokens = []
        
        self.keywords = {
            'func': TokenType.FUNC,
            'let': TokenType.LET,
            'if': TokenType.IF,
            'then': TokenType.THEN,
            'else': TokenType.ELSE,
            'gui': TokenType.GUI,
            'window': TokenType.WINDOW,
            'button': TokenType.BUTTON,
            'label': TokenType.LABEL,
            'textbox': TokenType.TEXTBOX,
            'import': TokenType.IMPORT,
            'return': TokenType.RETURN,
            'true': TokenType.TRUE,
            'false': TokenType.FALSE,
        }
    
    def current_char(self) -> Optional[str]:
        if self.pos >= len(self.source):
            return None
        return self.source[self.pos]
    
    def peek(self, offset=1) -> Optional[str]:
        pos = self.pos + offset
        if pos >= len(self.source):
            return None
        return self.source[pos]
    
    def advance(self):
        if self.current_char() == '\n':
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        self.pos += 1
    
    def skip_whitespace(self):
        while self.current_char() and self.current_char() in ' \t\n\r':
            self.advance()
    
    def skip_comment(self):
        if self.current_char() == '#':
            while self.current_char() and self.current_char() != '\n':
                self.advance()
    
    def read_number(self) -> Token:
        start_col = self.column
        num_str = ''
        while self.current_char() and (self.current_char().isdigit() or self.current_char() == '.'):
            num_str += self.current_char()
            self.advance()
        
        value = float(num_str) if '.' in num_str else int(num_str)
        return Token(TokenType.NUMBER, value, self.line, start_col)
    
    def read_string(self) -> Token:
        start_col = self.column
        quote_char = self.current_char()
        self.advance()
        
        string_val = ''
        while self.current_char() and self.current_char() != quote_char:
            if self.current_char() == '\\' and self.peek() == quote_char:
                self.advance()
                string_val += quote_char
                self.advance()
            else:
                string_val += self.current_char()
                self.advance()
        
        self.advance()
        return Token(TokenType.STRING, string_val, self.line, start_col)
    
    def read_identifier(self) -> Token:
        start_col = self.column
        ident = ''
        while self.current_char() and (self.current_char().isalnum() or self.current_char() in '_-'):
            ident += self.current_char()
            self.advance()
        
        token_type = self.keywords.get(ident, TokenType.IDENTIFIER)
        return Token(token_type, ident, self.line, start_col)
    
    def tokenize(self) -> List[Token]:
        while self.current_char():
            self.skip_whitespace()
            
            if not self.current_char():
                break
            
            if self.current_char() == '#':
                self.skip_comment()
                continue
            
            ch = self.current_char()
            
            if ch.isdigit():
                self.tokens.append(self.read_number())
            elif ch in '"\'':
                self.tokens.append(self.read_string())
            elif ch.isalpha() or ch == '_':
                self.tokens.append(self.read_identifier())
            elif ch == '=' and self.peek() == '=':
                self.tokens.append(Token(TokenType.EQUALS, '==', self.line, self.column))
                self.advance()
                self.advance()
            elif ch == '=':
                self.tokens.append(Token(TokenType.ASSIGN, '=', self.line, self.column))
                self.advance()
            elif ch == '-' and self.peek() == '>':
                self.tokens.append(Token(TokenType.ARROW, '->', self.line, self.column))
                self.advance()
                self.advance()
            elif ch == '+':
                self.tokens.append(Token(TokenType.PLUS, '+', self.line, self.column))
                self.advance()
            elif ch == '-':
                self.tokens.append(Token(TokenType.MINUS, '-', self.line, self.column))
                self.advance()
            elif ch == '*':
                self.tokens.append(Token(TokenType.MULTIPLY, '*', self.line, self.column))
                self.advance()
            elif ch == '/':
                self.tokens.append(Token(TokenType.DIVIDE, '/', self.line, self.column))
                self.advance()
            elif ch == '|':
                self.tokens.append(Token(TokenType.PIPE, '|', self.line, self.column))
                self.advance()
            elif ch == '(':
                self.tokens.append(Token(TokenType.LPAREN, '(', self.line, self.column))
                self.advance()
            elif ch == ')':
                self.tokens.append(Token(TokenType.RPAREN, ')', self.line, self.column))
                self.advance()
            elif ch == '{':
                self.tokens.append(Token(TokenType.LBRACE, '{', self.line, self.column))
                self.advance()
            elif ch == '}':
                self.tokens.append(Token(TokenType.RBRACE, '}', self.line, self.column))
                self.advance()
            elif ch == '[':
                self.tokens.append(Token(TokenType.LBRACKET, '[', self.line, self.column))
                self.advance()
            elif ch == ']':
                self.tokens.append(Token(TokenType.RBRACKET, ']', self.line, self.column))
                self.advance()
            elif ch == ';':
                self.tokens.append(Token(TokenType.SEMICOLON, ';', self.line, self.column))
                self.advance()
            elif ch == ':':
                self.tokens.append(Token(TokenType.COLON, ':', self.line, self.column))
                self.advance()
            elif ch == ',':
                self.tokens.append(Token(TokenType.COMMA, ',', self.line, self.column))
                self.advance()
            elif ch == '.':
                self.tokens.append(Token(TokenType.DOT, '.', self.line, self.column))
                self.advance()
            else:
                raise SyntaxError(f"Unexpected character '{ch}' at line {self.line}, column {self.column}")
        
        self.tokens.append(Token(TokenType.EOF, None, self.line, self.column))
        return self.tokens

# ===== AST NODES =====
@dataclass
class ASTNode:
    pass

@dataclass
class NumberNode(ASTNode):
    value: float

@dataclass
class StringNode(ASTNode):
    value: str

@dataclass
class BoolNode(ASTNode):
    value: bool

@dataclass
class IdentifierNode(ASTNode):
    name: str

@dataclass
class BinaryOpNode(ASTNode):
    left: ASTNode
    operator: str
    right: ASTNode

@dataclass
class AttributeSetNode(ASTNode):
    """Nix-style attribute set: { name = value; }"""
    attributes: Dict[str, ASTNode]

@dataclass
class AttributeAccessNode(ASTNode):
    """Access attribute: obj.attr"""
    object: ASTNode
    attribute: str

@dataclass
class ListNode(ASTNode):
    """List: [1, 2, 3]"""
    elements: List[ASTNode]

@dataclass
class FunctionDefNode(ASTNode):
    name: str
    params: List[str]
    body: List[ASTNode]

@dataclass
class FunctionCallNode(ASTNode):
    name: str
    args: List[ASTNode]

@dataclass
class PipeNode(ASTNode):
    """Bash-style pipe: expr1 | expr2"""
    left: ASTNode
    right: ASTNode

@dataclass
class LetNode(ASTNode):
    name: str
    value: ASTNode

@dataclass
class ReturnNode(ASTNode):
    value: ASTNode

@dataclass
class GUINode(ASTNode):
    """GUI definition"""
    name: str
    elements: List[ASTNode]

@dataclass
class WindowNode(ASTNode):
    """Window widget"""
    attributes: Dict[str, ASTNode]
    children: List[ASTNode]

@dataclass
class WidgetNode(ASTNode):
    """Generic widget (button, label, textbox)"""
    widget_type: str
    attributes: Dict[str, ASTNode]

# ===== PARSER =====
class Parser:
    def __init__(self, tokens: List[Token]):
        self.tokens = tokens
        self.pos = 0
    
    def current_token(self) -> Token:
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return self.tokens[-1]
    
    def advance(self):
        self.pos += 1
    
    def expect(self, token_type: TokenType):
        if self.current_token().type != token_type:
            raise SyntaxError(f"Expected {token_type.name}, got {self.current_token().type.name}")
        self.advance()
    
    def parse(self) -> List[ASTNode]:
        statements = []
        while self.current_token().type != TokenType.EOF:
            statements.append(self.parse_statement())
        return statements
    
    def parse_statement(self) -> ASTNode:
        token = self.current_token()
        
        if token.type == TokenType.LET:
            return self.parse_let()
        elif token.type == TokenType.FUNC:
            return self.parse_function_def()
        elif token.type == TokenType.GUI:
            return self.parse_gui()
        elif token.type == TokenType.RETURN:
            return self.parse_return()
        else:
            expr = self.parse_expression()
            if self.current_token().type == TokenType.SEMICOLON:
                self.advance()
            return expr
    
    def parse_let(self) -> LetNode:
        self.advance()
        name = self.current_token().value
        self.advance()
        self.expect(TokenType.ASSIGN)
        value = self.parse_expression()
        if self.current_token().type == TokenType.SEMICOLON:
            self.advance()
        return LetNode(name, value)
    
    def parse_function_def(self) -> FunctionDefNode:
        self.advance()
        name = self.current_token().value
        self.advance()
        self.expect(TokenType.LPAREN)
        
        params = []
        while self.current_token().type != TokenType.RPAREN:
            params.append(self.current_token().value)
            self.advance()
            if self.current_token().type == TokenType.COMMA:
                self.advance()
        
        self.expect(TokenType.RPAREN)
        self.expect(TokenType.LBRACE)
        
        body = []
        while self.current_token().type != TokenType.RBRACE:
            body.append(self.parse_statement())
        
        self.advance()
        return FunctionDefNode(name, params, body)
    
    def parse_return(self) -> ReturnNode:
        self.advance()
        value = self.parse_expression()
        if self.current_token().type == TokenType.SEMICOLON:
            self.advance()
        return ReturnNode(value)
    
    def parse_gui(self) -> GUINode:
        self.advance()
        name = self.current_token().value
        self.advance()
        self.expect(TokenType.LBRACE)
        
        elements = []
        while self.current_token().type != TokenType.RBRACE:
            elements.append(self.parse_gui_element())
        
        self.expect(TokenType.RBRACE)
        return GUINode(name, elements)
    
    def parse_gui_element(self) -> ASTNode:
        token = self.current_token()
        
        if token.type == TokenType.WINDOW:
            return self.parse_window()
        elif token.type in (TokenType.BUTTON, TokenType.LABEL, TokenType.TEXTBOX):
            return self.parse_widget()
        else:
            raise SyntaxError(f"Unexpected GUI element: {token.type.name}")
    
    def parse_window(self) -> WindowNode:
        self.advance()
        self.expect(TokenType.LPAREN)
        
        attributes = {}
        while self.current_token().type != TokenType.RPAREN:
            attr_name = self.current_token().value
            self.advance()
            self.expect(TokenType.COLON)
            attr_value = self.parse_expression()
            attributes[attr_name] = attr_value
            
            if self.current_token().type == TokenType.COMMA:
                self.advance()
        
        self.expect(TokenType.RPAREN)
        self.expect(TokenType.LBRACE)
        
        children = []
        while self.current_token().type != TokenType.RBRACE:
            children.append(self.parse_widget())
        
        self.expect(TokenType.RBRACE)
        return WindowNode(attributes, children)
    
    def parse_widget(self) -> WidgetNode:
        widget_type = self.current_token().type.name.lower()
        self.advance()
        self.expect(TokenType.LPAREN)
        
        attributes = {}
        while self.current_token().type != TokenType.RPAREN:
            attr_name = self.current_token().value
            self.advance()
            self.expect(TokenType.COLON)
            attr_value = self.parse_expression()
            attributes[attr_name] = attr_value
            
            if self.current_token().type == TokenType.COMMA:
                self.advance()
        
        self.expect(TokenType.RPAREN)
        if self.current_token().type == TokenType.SEMICOLON:
            self.advance()
        
        return WidgetNode(widget_type, attributes)
    
    def parse_expression(self) -> ASTNode:
        return self.parse_pipe()
    
    def parse_pipe(self) -> ASTNode:
        left = self.parse_additive()
        
        while self.current_token().type == TokenType.PIPE:
            self.advance()
            right = self.parse_additive()
            left = PipeNode(left, right)
        
        return left
    
    def parse_additive(self) -> ASTNode:
        left = self.parse_multiplicative()
        
        while self.current_token().type in (TokenType.PLUS, TokenType.MINUS):
            op = self.current_token().value
            self.advance()
            right = self.parse_multiplicative()
            left = BinaryOpNode(left, op, right)
        
        return left
    
    def parse_multiplicative(self) -> ASTNode:
        left = self.parse_postfix()
        
        while self.current_token().type in (TokenType.MULTIPLY, TokenType.DIVIDE):
            op = self.current_token().value
            self.advance()
            right = self.parse_postfix()
            left = BinaryOpNode(left, op, right)
        
        return left
    
    def parse_postfix(self) -> ASTNode:
        expr = self.parse_primary()
        
        while True:
            if self.current_token().type == TokenType.DOT:
                self.advance()
                attr = self.current_token().value
                self.advance()
                expr = AttributeAccessNode(expr, attr)
            elif self.current_token().type == TokenType.LPAREN:
                # Function call
                self.advance()
                args = []
                while self.current_token().type != TokenType.RPAREN:
                    args.append(self.parse_expression())
                    if self.current_token().type == TokenType.COMMA:
                        self.advance()
                self.expect(TokenType.RPAREN)
                
                if isinstance(expr, IdentifierNode):
                    expr = FunctionCallNode(expr.name, args)
                else:
                    raise SyntaxError("Invalid function call")
            else:
                break
        
        return expr
    
    def parse_primary(self) -> ASTNode:
        token = self.current_token()
        
        if token.type == TokenType.NUMBER:
            self.advance()
            return NumberNode(token.value)
        
        elif token.type == TokenType.STRING:
            self.advance()
            return StringNode(token.value)
        
        elif token.type == TokenType.TRUE:
            self.advance()
            return BoolNode(True)
        
        elif token.type == TokenType.FALSE:
            self.advance()
            return BoolNode(False)
        
        elif token.type == TokenType.IDENTIFIER:
            name = token.value
            self.advance()
            return IdentifierNode(name)
        
        elif token.type == TokenType.LBRACE:
            return self.parse_attribute_set()
        
        elif token.type == TokenType.LBRACKET:
            return self.parse_list()
        
        elif token.type == TokenType.LPAREN:
            self.advance()
            expr = self.parse_expression()
            self.expect(TokenType.RPAREN)
            return expr
        
        raise SyntaxError(f"Unexpected token: {token}")
    
    def parse_attribute_set(self) -> AttributeSetNode:
        """Parse Nix-style attribute set"""
        self.expect(TokenType.LBRACE)
        
        attributes = {}
        while self.current_token().type != TokenType.RBRACE:
            name = self.current_token().value
            self.advance()
            self.expect(TokenType.ASSIGN)
            value = self.parse_expression()
            attributes[name] = value
            
            if self.current_token().type == TokenType.SEMICOLON:
                self.advance()
        
        self.expect(TokenType.RBRACE)
        return AttributeSetNode(attributes)
    
    def parse_list(self) -> ListNode:
        self.expect(TokenType.LBRACKET)
        
        elements = []
        while self.current_token().type != TokenType.RBRACKET:
            elements.append(self.parse_expression())
            if self.current_token().type == TokenType.COMMA:
                self.advance()
        
        self.expect(TokenType.RBRACKET)
        return ListNode(elements)

# ===== INTERPRETER =====
class Interpreter:
    def __init__(self):
        self.global_scope = {}
        self.builtin_functions()
    
    def builtin_functions(self):
        """Register built-in functions"""
        self.global_scope['echo'] = lambda *args: print(*args)
        self.global_scope['run'] = lambda cmd: subprocess.run(cmd, shell=True, capture_output=True, text=True).stdout
        self.global_scope['len'] = len
        self.global_scope['str'] = str
        self.global_scope['int'] = int
    
    def evaluate(self, node: ASTNode, scope: Dict = None):
        if scope is None:
            scope = self.global_scope
        
        if isinstance(node, NumberNode):
            return node.value
        
        elif isinstance(node, StringNode):
            return node.value
        
        elif isinstance(node, BoolNode):
            return node.value
        
        elif isinstance(node, IdentifierNode):
            if node.name in scope:
                return scope[node.name]
            raise NameError(f"Undefined variable: {node.name}")
        
        elif isinstance(node, BinaryOpNode):
            left = self.evaluate(node.left, scope)
            right = self.evaluate(node.right, scope)
            
            if node.operator == '+':
                return left + right
            elif node.operator == '-':
                return left - right
            elif node.operator == '*':
                return left * right
            elif node.operator == '/':
                return left / right
            elif node.operator == '==':
                return left == right
        
        elif isinstance(node, AttributeSetNode):
            result = {}
            for key, value in node.attributes.items():
                result[key] = self.evaluate(value, scope)
            return result
        
        elif isinstance(node, AttributeAccessNode):
            obj = self.evaluate(node.object, scope)
            if isinstance(obj, dict):
                return obj.get(node.attribute)
            raise TypeError(f"Cannot access attribute on {type(obj)}")
        
        elif isinstance(node, ListNode):
            return [self.evaluate(elem, scope) for elem in node.elements]
        
        elif isinstance(node, LetNode):
            value = self.evaluate(node.value, scope)
            scope[node.name] = value
            return value
        
        elif isinstance(node, FunctionDefNode):
            def user_function(*args):
                local_scope = scope.copy()
                for i, param in enumerate(node.params):
                    if i < len(args):
                        local_scope[param] = args[i]
                
                result = None
                for stmt in node.body:
                    if isinstance(stmt, ReturnNode):
                        return self.evaluate(stmt.value, local_scope)
                    result = self.evaluate(stmt, local_scope)
                return result
            
            scope[node.name] = user_function
            return user_function
        
        elif isinstance(node, FunctionCallNode):
            func = scope.get(node.name)
            if func is None:
                raise NameError(f"Undefined function: {node.name}")
            
            args = [self.evaluate(arg, scope) for arg in node.args]
            return func(*args)
        
        elif isinstance(node, PipeNode):
            # Bash-style piping
            left_result = self.evaluate(node.left, scope)
            
            # If right is a function call, pass left_result as first argument
            if isinstance(node.right, FunctionCallNode):
                func = scope.get(node.right.name)
                args = [left_result] + [self.evaluate(arg, scope) for arg in node.right.args]
                return func(*args)
            elif isinstance(node.right, IdentifierNode):
                func = scope.get(node.right.name)
                return func(left_result)
            
            return left_result
        
        elif isinstance(node, ReturnNode):
            return self.evaluate(node.value, scope)
        
        elif isinstance(node, GUINode):
            # Store GUI definition for compiler
            return node
        
        return None
    
    def run(self, ast: List[ASTNode]):
        result = None
        for node in ast:
            result = self.evaluate(node)
        return result

# ===== COMPILER (to Python + PyQt5) =====
class Compiler:
    def __init__(self):
        self.output = []
        self.indent_level -= 1
        self.indent_level -= 1
        self.emit("")
    
    def compile_widget(self, widget: WidgetNode):
        """Compile individual widget"""
        widget_map = {
            'button': 'QPushButton',
            'label': 'QLabel',
            'textbox': 'QLineEdit'
        }
        
        qt_class = widget_map.get(widget.widget_type, 'QWidget')
        widget_var = f"widget_{id(widget)}"
        
        # Get text/label
        text = '""'
        if 'text' in widget.attributes:
            text = self.compile_expression(widget.attributes['text'])
        elif 'label' in widget.attributes:
            text = self.compile_expression(widget.attributes['label'])
        
        self.emit(f"{widget_var} = {qt_class}({text})")
        
        # Apply other attributes
        for attr, value in widget.attributes.items():
            if attr in ('text', 'label'):
                continue
            
            val = self.compile_expression(value)
            
            if attr == 'id':
                self.emit(f"self.{val.strip('\"')} = {widget_var}")
            elif attr == 'onClick':
                # Connect signal
                self.emit(f"{widget_var}.clicked.connect({val})")
        
        self.emit(f"layout.addWidget({widget_var})")
        self.emit("")

# ===== EXAMPLE USAGE =====
def main():
    # Example program with all features
    source_code = """
    # Nix-style attribute sets
    let config = {
        name = "MyApp";
        version = "1.0";
        debug = true;
    };
    
    # Function definition
    func greet(name) {
        return "Hello, " | add_suffix(name);
    }
    
    func add_suffix(base, suffix) {
        echo(base);
        return base;
    }
    
    # Bash-style piping
    let result = "World" | greet();
    
    # GUI Definition with Qt
    gui MyApplication {
        window(title: "My First App", width: 400, height: 300) {
            label(text: "Welcome to my app!");
            button(text: "Click Me", id: "myButton", onClick: handle_click);
            textbox(id: "inputBox");
        }
    }
    
    func handle_click() {
        echo("Button clicked!");
    }
    """
    
    print("=" * 60)
    print("STEP 1: LEXICAL ANALYSIS (Tokenization)")
    print("=" * 60)
    lexer = Lexer(source_code)
    tokens = lexer.tokenize()
    
    print(f"\nGenerated {len(tokens)} tokens:")
    for i, token in enumerate(tokens[:20]):  # Show first 20
        print(f"  {i+1:3}. {token.type.name:15} = {repr(token.value)}")
    if len(tokens) > 20:
        print(f"  ... and {len(tokens) - 20} more tokens")
    
    print("\n" + "=" * 60)
    print("STEP 2: SYNTAX ANALYSIS (Parsing to AST)")
    print("=" * 60)
    parser = Parser(tokens)
    ast = parser.parse()
    
    print(f"\nGenerated AST with {len(ast)} top-level nodes:")
    for i, node in enumerate(ast):
        print(f"  {i+1}. {node.__class__.__name__}")
        if isinstance(node, LetNode):
            print(f"     Variable: {node.name}")
        elif isinstance(node, FunctionDefNode):
            print(f"     Function: {node.name}({', '.join(node.params)})")
        elif isinstance(node, GUINode):
            print(f"     GUI: {node.name}")
    
    print("\n" + "=" * 60)
    print("STEP 3: INTERPRETATION (Execute)")
    print("=" * 60)
    interpreter = Interpreter()
    print("\nInterpreter output:")
    result = interpreter.run(ast)
    
    print("\n" + "=" * 60)
    print("STEP 4: COMPILATION (to Python + PyQt5)")
    print("=" * 60)
    compiler = Compiler()
    python_code = compiler.compile_to_python(ast)
    
    print("\nGenerated Python code:")
    print("-" * 60)
    print(python_code)
    print("-" * 60)
    
    # Save compiled code
    with open("compiled_output.py", "w") as f:
        f.write(python_code)
    
    print("\n✓ Compiled code saved to 'compiled_output.py'")
    print("  Run with: python3 compiled_output.py")
    
    print("\n" + "=" * 60)
    print("COMPILATION COMPLETE")
    print("=" * 60)
    print("\nYour language supports:")
    print("  ✓ Nix-style attribute sets: { key = value; }")
    print("  ✓ Bash-style piping: expr1 | expr2")
    print("  ✓ GUI building with Qt")
    print("  ✓ Functions and variables")
    print("  ✓ Compiles to Python + PyQt5")

if __name__ == "__main__":
    main()_level = 0
    
    def indent(self):
        return "    " * self.indent_level
    
    def emit(self, code: str):
        self.output.append(self.indent() + code)
    
    def compile_to_python(self, ast: List[ASTNode]) -> str:
        """Compile to Python with PyQt5 for GUI"""
        self.output = []
        
        # Add imports
        has_gui = any(isinstance(node, GUINode) for node in ast)
        
        if has_gui:
            self.emit("#!/usr/bin/env python3")
            self.emit("import sys")
            self.emit("from PyQt5.QtWidgets import (QApplication, QMainWindow, QPushButton,")
            self.emit("                             QLabel, QLineEdit, QVBoxLayout, QWidget)")
            self.emit("")
        
        # Compile each statement
        for node in ast:
            self.compile_node(node)
        
        # Add GUI execution code if GUI is present
        if has_gui:
            self.emit("")
            self.emit("if __name__ == '__main__':")
            self.indent_level += 1
            self.emit("app = QApplication(sys.argv)")
            
            # Find GUI node and create window
            for node in ast:
                if isinstance(node, GUINode):
                    self.emit(f"window = {node.name}()")
                    self.emit("window.show()")
                    break
            
            self.emit("sys.exit(app.exec_())")
            self.indent_level -= 1
        
        return "\n".join(self.output)
    
    def compile_node(self, node: ASTNode):
        if isinstance(node, LetNode):
            value_code = self.compile_expression(node.value)
            self.emit(f"{node.name} = {value_code}")
        
        elif isinstance(node, FunctionDefNode):
            params = ", ".join(node.params)
            self.emit(f"def {node.name}({params}):")
            self.indent_level += 1
            
            if not node.body:
                self.emit("pass")
            else:
                for stmt in node.body:
                    self.compile_node(stmt)
            
            self.indent_level -= 1
            self.emit("")
        
        elif isinstance(node, GUINode):
            self.compile_gui(node)
        
        elif isinstance(node, FunctionCallNode):
            args = ", ".join(self.compile_expression(arg) for arg in node.args)
            self.emit(f"{node.name}({args})")
        
        elif isinstance(node, ReturnNode):
            value = self.compile_expression(node.value)
            self.emit(f"return {value}")
    
    def compile_expression(self, node: ASTNode) -> str:
        if isinstance(node, NumberNode):
            return str(node.value)
        
        elif isinstance(node, StringNode):
            return f'"{node.value}"'
        
        elif isinstance(node, BoolNode):
            return "True" if node.value else "False"
        
        elif isinstance(node, IdentifierNode):
            return node.name
        
        elif isinstance(node, BinaryOpNode):
            left = self.compile_expression(node.left)
            right = self.compile_expression(node.right)
            return f"({left} {node.operator} {right})"
        
        elif isinstance(node, AttributeSetNode):
            items = [f'"{k}": {self.compile_expression(v)}' for k, v in node.attributes.items()]
            return "{" + ", ".join(items) + "}"
        
        elif isinstance(node, AttributeAccessNode):
            obj = self.compile_expression(node.object)
            return f"{obj}['{node.attribute}']"
        
        elif isinstance(node, ListNode):
            elements = [self.compile_expression(e) for e in node.elements]
            return "[" + ", ".join(elements) + "]"
        
        elif isinstance(node, FunctionCallNode):
            args = ", ".join(self.compile_expression(arg) for arg in node.args)
            return f"{node.name}({args})"
        
        return "None"
    
    def compile_gui(self, node: GUINode):
        """Compile GUI to PyQt5 class"""
        self.emit(f"class {node.name}(QMainWindow):")
        self.indent_level += 1
        
        self.emit("def __init__(self):")
        self.indent_level += 1
        self.emit("super().__init__()")
        
        # Find window element
        window_node = None
        widgets = []
        for elem in node.elements:
            if isinstance(elem, WindowNode):
                window_node = elem
            elif isinstance(elem, WidgetNode):
                widgets.append(elem)
        
        # Set window properties
        if window_node:
            for attr, value in window_node.attributes.items():
                val = self.compile_expression(value)
                if attr == 'title':
                    self.emit(f"self.setWindowTitle({val})")
                elif attr == 'width':
                    width = val
                elif attr == 'height':
                    height = val
            
            if 'width' in window_node.attributes and 'height' in window_node.attributes:
                w = self.compile_expression(window_node.attributes['width'])
                h = self.compile_expression(window_node.attributes['height'])
                self.emit(f"self.setGeometry(100, 100, {w}, {h})")
            
            # Create central widget and layout
            self.emit("")
            self.emit("central_widget = QWidget()")
            self.emit("self.setCentralWidget(central_widget)")
            self.emit("layout = QVBoxLayout()")
            self.emit("central_widget.setLayout(layout)")
            self.emit("")
            
            # Add widgets from window
            for widget in window_node.children:
                self.compile_widget(widget)
        
        self.indent

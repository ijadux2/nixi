#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Lexer = require('./lexer');
const Parser = require('./parser');
const Interpreter = require('./interpreter');

class NixiCLI {
  constructor() {
    this.interpreter = new Interpreter();
  }

  runFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.run(content, filePath);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
      process.exit(1);
    }
  }

  runRepl() {
    console.log('Nixi REPL v0.1.0');
    console.log('Type "exit" to quit');
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'nixi> '
    });
    
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
        if (result) {
          console.log(result.toString());
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
      
      const result = this.interpreter.evaluate(ast);
      
      return result;
    } catch (error) {
      throw new Error(`${filename}:${error.message}`);
    }
  }

  showHelp() {
    console.log(`
Nixi Programming Language v0.1.0

Usage:
  nixi <file>          Run a Nixi file
  nixi                 Start REPL
  nixi --help          Show this help
  nixi --version       Show version

Examples:
  nixi hello.nixi
  nixi
    `);
  }

  showVersion() {
    console.log('Nixi v0.1.0');
  }
}

function main() {
  const cli = new NixiCLI();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    cli.runRepl();
  } else if (args[0] === '--help' || args[0] === '-h') {
    cli.showHelp();
  } else if (args[0] === '--version' || args[0] === '-v') {
    cli.showVersion();
  } else if (args[0].startsWith('-')) {
    console.error(`Unknown option: ${args[0]}`);
    console.log('Use --help for available options');
    process.exit(1);
  } else {
    cli.runFile(args[0]);
  }
}

if (require.main === module) {
  main();
}

module.exports = NixiCLI;

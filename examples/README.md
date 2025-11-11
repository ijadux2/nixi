# Basic Nixi Examples

## Hello World
```nixi
echo "Hello, World!"
```

## Nix-style Functions
```nixi
let
  add = x: y: x + y;
  multiply = { x, y }: x * y;
  result = add 5 (multiply { x = 3; y = 4 });
in
  echo result
```

## Bash-like Commands
```nixi
# List current directory
ls ".";

# Change directory and show current path
cd "/tmp";
pwd;

# Show files in new directory
ls ".";
```

## Simple GUI Application
```nixi
# Define styles
style "app" {
  background: "#f0f0f0";
  padding: "20px";
  font-family: "Arial, sans-serif";
}

style "header" {
  color: "#333";
  text-align: "center";
  margin-bottom: "20px";
}

style "button" {
  background: "#007bff";
  color: "white";
  padding: "10px 20px";
  border: "none";
  border-radius: "5px";
  cursor: "pointer";
}

# Define components
component Header = { title }:
  h1 { class: "header"; title };

component Button = { text, onClick }:
  button { 
    class: "button"; 
    onClick: onClick; 
    text 
  };

component App = {}:
  div { 
    class: "app";
    Header { title: "Welcome to Nixi!" };
    Button { 
      text: "Click Me"; 
      onClick: () => echo "Button clicked!" 
    }
  };

# Create and save the app
let app = App {};
in
  saveHTML app "welcome.html" "Welcome App"
```

## Counter Application
```nixi
component Counter = { initialCount }:
  let
    count = initialCount;
    increment = () => count + 1;
    decrement = () => count - 1;
  in
    div {
      class: "counter";
      h1 { text: "Counter: " + count };
      button { text: "+"; onClick: increment };
      button { text: "-"; onClick: decrement }
    };

let counter = Counter { initialCount: 0 };
in
  saveHTML counter "counter.html" "Counter App"
```

## File Explorer
```nixi
component FileItem = { name, isDir }:
  div {
    class: if isDir then "directory" else "file";
    span { text: name }
  };

component FileList = { path }:
  let
    files = ls path;
    items = map (file: FileItem { 
      name: file; 
      isDir: false  # Simplified for demo
    }) files;
  in
    div {
      class: "file-list";
      h2 { text: "Files in " + path };
      items
    };

let fileList = FileList { path: "." };
in
  saveHTML fileList "files.html" "File Explorer"
```

## Todo List
```nixi
component TodoItem = { text, completed }:
  div {
    class: if completed then "todo-completed" else "todo-pending";
    input { type: "checkbox"; checked: completed };
    span { text: text }
  };

component TodoList = { items }:
  let
    todoItems = map (item: TodoItem item) items;
  in
    div {
      class: "todo-list";
      h1 { text: "Todo List" };
      todoItems
    };

let todos = [
  { text: "Learn Nixi"; completed: false };
  { text: "Build GUI apps"; completed: true };
  { text: "Master functional programming"; completed: false }
];

let todoList = TodoList { items: todos };
in
  saveHTML todoList "todos.html" "Todo List"
```
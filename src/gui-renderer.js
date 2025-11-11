class GUIRenderer {
  constructor() {
    this.components = new Map();
    this.styles = new Map();
    this.componentCounter = 0;
  }

  render(component) {
    if (!component || component.type !== 'object') {
      return '';
    }
    
    const nativeComponent = component.toNative();
    
    if (nativeComponent.type) {
      return this.renderElement(nativeComponent);
    }
    
    return '';
  }

  renderElement(element) {
    const { type, props = {} } = element;
    const id = props.id || `component-${this.componentCounter++}`;
    
    let html = `<${type}`;
    
    // Add attributes
    const attributes = {};
    
    if (props.class) {
      attributes.class = props.class;
    }
    
    if (props.style) {
      attributes.style = this.renderInlineStyles(props.style);
    }
    
    if (props.onClick) {
      attributes.onclick = `handleClick('${id}')`;
    }
    
    if (props.value !== undefined) {
      attributes.value = props.value;
    }
    
    if (props.placeholder) {
      attributes.placeholder = props.placeholder;
    }
    
    if (props.href) {
      attributes.href = props.href;
    }
    
    // Add custom attributes
    for (const [key, value] of Object.entries(props)) {
      if (!['class', 'style', 'onClick', 'value', 'placeholder', 'href', 'children'].includes(key)) {
        attributes[key] = value;
      }
    }
    
    // Add attributes to HTML
    for (const [key, value] of Object.entries(attributes)) {
      html += ` ${key}="${value}"`;
    }
    
    html += '>';
    
    // Add children
    if (props.children) {
      if (Array.isArray(props.children)) {
        for (const child of props.children) {
          if (typeof child === 'string') {
            html += child;
          } else if (child && child.type) {
            html += this.renderElement(child);
          }
        }
      } else if (typeof props.children === 'string') {
        html += props.children;
      } else if (props.children && props.children.type) {
        html += this.renderElement(props.children);
      }
    }
    
    // Handle text content for simple elements
    if (props.text) {
      html += props.text;
    }
    
    html += `</${type}>`;
    
    return html;
  }

  renderInlineStyles(styleObj) {
    if (typeof styleObj === 'string') {
      return styleObj;
    }
    
    if (typeof styleObj === 'object') {
      const styles = [];
      for (const [property, value] of Object.entries(styleObj)) {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        styles.push(`${cssProperty}: ${value}`);
      }
      return styles.join('; ');
    }
    
    return '';
  }

  generateHTML(component, title = 'Nixi App') {
    const bodyHTML = this.render(component);
    const stylesHTML = this.generateStyles();
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${this.getDefaultStyles()}
        ${stylesHTML}
    </style>
</head>
<body>
    ${bodyHTML}
    <script>
        ${this.generateJavaScript()}
    </script>
</body>
</html>`;
  }

  generateStyles() {
    let styles = '';
    
    for (const [selector, properties] of this.styles) {
      styles += `${selector} {
`;
      for (const [property, value] of Object.entries(properties)) {
        styles += `  ${property}: ${value};
`;
      }
      styles += `}
`;
    }
    
    return styles;
  }

  getDefaultStyles() {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f5f5f5;
      }
      
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      
      .button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }
      
      .button:hover {
        background-color: #0056b3;
      }
      
      .input {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        width: 100%;
      }
      
      .input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
      }
      
      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
      }
    `;
  }

  generateJavaScript() {
    return `
      function handleClick(elementId) {
        console.log('Clicked element:', elementId);
        // In a real implementation, this would trigger the Nixi event handler
      }
      
      // Simple state management
      let appState = {};
      
      function updateState(key, value) {
        appState[key] = value;
        console.log('State updated:', appState);
      }
    `;
  }

  addStyle(selector, properties) {
    this.styles.set(selector, properties);
  }

  saveToFile(html, filePath) {
    const fs = require('fs');
    fs.writeFileSync(filePath, html);
  }
}

module.exports = GUIRenderer;
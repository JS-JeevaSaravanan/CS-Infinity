
### 70. Frontend Framework
- Frontend frameworks like React, Vue, Svelte, and Angular help developers build interactive user interfaces.
- These frameworks provide a structure for organizing code and components, enhancing maintainability and reusability.

### 71. Components
- Components are reusable, self-contained pieces of code that represent a part of the user interface.
- They can encapsulate HTML, CSS, and JavaScript, allowing for modular development.

### 72. Declarative Code
- Declarative code describes *what* the UI should look like rather than *how* to achieve that.
- This approach makes it easier to understand and maintain the code, as it focuses on the end result.

### 73. Imperative Code
- Imperative code specifies the exact steps the program must take to achieve a desired state.
- It can be more complex and harder to follow, especially as the application grows.

### 74. NodeJS
- Node.js is a runtime environment that allows JavaScript to be run on the server side.
- It enables developers to use JavaScript for both client-side and server-side scripting.

### 75. V8 Engine
- The V8 engine is an open-source JavaScript engine developed by Google for use in Chrome and Node.js.
- It compiles JavaScript directly to native machine code for improved performance.

### 76. Event Loop
- The event loop is a core concept in Node.js that allows for non-blocking I/O operations.
- It enables the server to handle multiple connections concurrently without waiting for each one to complete.

### 77. Node Package Manager (NPM)
- NPM is a package manager for JavaScript and is the default package manager for Node.js.
- It allows developers to install, share, and manage dependencies for their projects.

### 78. Module
- A module is a reusable piece of code that encapsulates related functionality and can be imported into other files.
- In Node.js, modules can be created using the `module.exports` statement.

### 79. Export Statement
- The export statement is used to define what parts of a module should be accessible to other modules.
- It can export variables, functions, or classes.

### 80. Import Statement
- The import statement is used to bring in functionality from other modules into the current file.
- It allows developers to utilize code from external libraries or their own modules.

Here’s the content for topics 81 to 85:

### 81. Server-Side Rendering (SSR)
- SSR is a technique where the server generates HTML for a webpage and sends it to the client.
- This approach allows for faster initial load times and better SEO, as the content is available to search engines immediately.


---

### 70. Frontend Framework

**Definition**: Frontend frameworks like React, Vue, Svelte, and Angular facilitate the development of interactive user interfaces by providing a structured way to organize code and components.

**Interview Points**:
- Understand the differences between popular frameworks.
- Be prepared to discuss concepts like Virtual DOM (in React), two-way data binding (in Angular), and reactivity (in Vue).

**Example** (React):
```javascript
import React from 'react';

function App() {
  return <h1>Hello, World!</h1>;
}

export default App;
```

---

### 71. Components

**Definition**: Components are modular, reusable pieces of code that encapsulate HTML, CSS, and JavaScript, representing a part of the user interface.

**Interview Points**:
- Explain the lifecycle of a component and the concept of state and props in React.
- Discuss how to create both functional and class components.

**Example** (Vue):
```javascript
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
});
```

---

### 72. Declarative Code

**Definition**: Declarative code focuses on *what* the UI should look like rather than *how* to achieve it, making it easier to understand and maintain.

**Interview Points**:
- Compare declarative programming with imperative programming.
- Be ready to discuss how frameworks use a declarative approach for UI rendering.

**Example** (React):
```javascript
const element = <h1>Hello, World!</h1>; // Declarative
```

---

### 73. Imperative Code

**Definition**: Imperative code specifies the exact steps required to achieve a desired state, often leading to more complex and harder-to-maintain code.

**Interview Points**:
- Provide examples of when imperative programming might be used.
- Discuss potential downsides of using imperative approaches in large applications.

**Example** (Vanilla JS):
```javascript
const element = document.createElement('h1');
element.textContent = "Hello, World!";
document.body.appendChild(element); // Imperative
```

---

### 74. Node.js

**Definition**: Node.js is a runtime environment that allows developers to run JavaScript on the server side, enabling full-stack JavaScript development.

**Interview Points**:
- Discuss the benefits of using Node.js for server-side development.
- Be prepared to explain how Node.js uses a single-threaded model to handle multiple connections.

**Example** (Simple server):
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

---

### 75. V8 Engine

**Definition**: The V8 engine is an open-source JavaScript engine developed by Google that compiles JavaScript directly to native machine code, enhancing performance in Chrome and Node.js.

**Interview Points**:
- Explain how the V8 engine differs from other JavaScript engines (like SpiderMonkey or JavaScriptCore).
- Discuss the implications of Just-In-Time (JIT) compilation.

**Example**: Not applicable; focus on performance metrics and optimizations.

---

### 76. Event Loop

**Definition**: The event loop is a core feature in Node.js that enables non-blocking I/O operations, allowing the server to handle multiple connections concurrently.

**Interview Points**:
- Describe how the event loop works, including the call stack, event queue, and callback queue.
- Be prepared to explain common pitfalls, such as callback hell.

**Example**:
```javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

console.log('End');

// Output:
// Start
// End
// Timeout
```

---

### 77. Node Package Manager (NPM)

**Definition**: NPM is the default package manager for Node.js, enabling developers to install, share, and manage dependencies for their projects.

**Interview Points**:
- Discuss how to create a `package.json` file and the role of dependencies and devDependencies.
- Explain how to publish packages to the NPM registry.

**Example**: Use `npm install <package-name>` to install a package.

---

### 78. Module

**Definition**: A module is a reusable piece of code that encapsulates related functionality, which can be imported into other files.

**Interview Points**:
- Explain the difference between CommonJS and ES6 modules.
- Discuss the advantages of modularization in large codebases.

**Example** (CommonJS):
```javascript
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
};

// main.js
const math = require('./math');
console.log(math.add(2, 3)); // 5
```

---

### 79. Export Statement

**Definition**: The export statement is used to define what parts of a module should be accessible to other modules.

**Interview Points**:
- Discuss named exports vs. default exports.
- Explain how exports can be combined in one file.

**Example** (ES6):
```javascript
// utils.js
export const add = (a, b) => a + b;
export default subtract;

// main.js
import subtract, { add } from './utils';
```

---

### 80. Import Statement

**Definition**: The import statement is used to bring in functionality from other modules into the current file.

**Interview Points**:
- Explain how to use dynamic imports and the implications on performance.
- Discuss circular dependencies and how to handle them.

**Example**:
```javascript
import { add } from './math';
console.log(add(2, 3)); // 5
```

---

### 81. Server-Side Rendering (SSR)

**Definition**: SSR is a technique where the server generates the HTML for a webpage and sends it to the client, allowing for faster initial load times and better SEO.

**Interview Points**:
- Compare SSR with client-side rendering (CSR) in terms of performance and SEO.
- Discuss frameworks that support SSR, such as Next.js or Nuxt.js.

**Example** (Next.js):
```javascript
import React from 'react';

export async function getServerSideProps() {
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  return { props: { data } };
}

const Page = ({ data }) => (
  <div>{data.title}</div>
);

export default Page;
```

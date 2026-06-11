
## Different DOMS

@Ref: [Diff Doms YT ](https://www.youtube.com/watch?v=7Tok22qxPzQ)


![[Pasted image 20241202131219.png]]



### DOM, Virtual DOM, and Shadow DOM Overview

#### 1. **DOM (Document Object Model)**
- **Definition**: In-memory representation of HTML as a tree of objects (nodes).
- **Accessing the DOM**:
  - Use `document` to access elements (e.g., `document.body`, `document.head`).
  - Example: `document.querySelector('h1')` retrieves the `<h1>` element.
- **DOM API**:
  - Methods like `querySelector` are part of the DOM API, not defined in the JavaScript specification.( not in ecma specs , dom spec is separate - https://dom.spec.whatwg.org/ )
  - DOM apis [Document Object Model - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)

![[Pasted image 20240927185325.png]]


#### 2. **Shadow DOM**
- **Definition**: A feature allowing the creation of custom components with encapsulated styles and markup.
- It lets us create custom components ( aka web components ) or in other waords create scoped DOM trees inside our elements
- **Example**: The `<video>` element uses Shadow DOM to manage its internal structure (play/pause buttons).
- **Inspecting Shadow DOM**:
  - Enable "Show User Agent Shadow DOM" in browser settings to view the internal structure. It show shadow-root and its DOM structure
- **Benefits**:
  - Styles from the outer document do not affect the Shadow DOM, and vice versa.
- **Support**: Most major browsers support Shadow DOM; polyfills exist for IE 11.

![[Pasted image 20240927185135.png]]


#### 3. **Virtual DOM**
- **Definition**: An abstraction of the actual DOM used in modern front-end frameworks to optimize performance.
- Abstraction on top of actual DOM where an idea or virtual representation of UI is kept in memory and synced with real DOM
- **Usage**:
  - Frameworks like React manipulate a virtual representation of the DOM to minimize direct manipulations on the actual DOM, which can be slow.
- **Advantages**:
  - Changes are batched and only applied to the actual DOM when necessary, enhancing performance.
- **Differences from Actual DOM**:
  - Attributes may use camelCase (e.g., `className` instead of `class`).
  - Event handlers may behave differently.

### Conclusion
- Understanding DOM, Shadow DOM, and Virtual DOM is crucial for modern web development.
- Each serves different purposes and optimizations for building robust applications.
- For further exploration, consider creating custom components or experimenting with frameworks that utilize Virtual DOM. 

Feel free to ask any questions or for clarifications on these topics!




## Attributes and Properties

In the context of the DOM (Document Object Model) and JavaScript, "attributes" and "properties" are distinct concepts, even though they often seem similar. Here’s a clear distinction:

### Attributes

- **Definition**: Attributes are the original values defined in the HTML markup. They provide information about an element and are defined in the HTML document.
- **Access Method**: Attributes are accessed using methods like `getAttribute()` and `setAttribute()`.
- **Examples**: 
  ```html
  <input type="text" value="Hello" id="myInput">
  ```
  - Here, `type`, `value`, and `id` are attributes.

- **Characteristics**:
  - Attributes are always strings.
  - They represent the initial state of the HTML element as defined in the markup.

### Properties

- **Definition**: Properties are the values of the attributes as represented in the DOM. They reflect the current state of the element in the browser.
- **Access Method**: Properties are accessed directly through the element’s DOM interface (e.g., `element.value`).
- **Examples**:
  ```javascript
  const input = document.getElementById('myInput');
  console.log(input.value); // Outputs: "Hello"
  ```

- **Characteristics**:
  - Properties can be of different types (e.g., strings, numbers, booleans).
  - They can change dynamically through JavaScript, reflecting the current state of the element (e.g., a user typing in an input field).

### Key Differences

| Feature            | Attribute                            | Property                             |
|--------------------|--------------------------------------|--------------------------------------|
| **Definition**     | Values defined in HTML markup        | Values represented in the DOM        |
| **Data Type**      | Always a string                      | Can be various types (string, number, etc.) |
| **Access Method**  | `getAttribute()`, `setAttribute()`  | Directly via DOM properties (e.g., `element.value`) |
| **Initial Value**  | Reflects the initial HTML state      | Reflects the current DOM state       |
| **Modification**   | Changing attributes requires methods | Properties can be changed directly   |

### Example to Illustrate

Consider the following HTML:

```html
<input type="text" value="Hello" id="myInput">
```

- **Attribute**: The `value` attribute initially is `"Hello"`.
- **Property**: If a user types `"World"` into the input field, the `value` property will now be `"World"`, even though the `value` attribute remains `"Hello"`.

### Summary

Attributes and properties serve different purposes in the DOM. Attributes provide the initial settings in the HTML markup, while properties reflect the current state and can change dynamically through JavaScript. Understanding this distinction is crucial for effective DOM manipulation and interaction in web development.




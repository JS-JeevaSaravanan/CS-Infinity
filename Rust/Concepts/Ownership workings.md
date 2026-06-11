
### **Ownership in Rust**

Ownership is a core concept in Rust, enabling memory safety without a garbage collector. Understanding ownership is essential for writing efficient and error-free Rust programs.

---

### **Three Rules of Ownership**

1. **Each value has a single owner**:
    
    - A value in Rust is owned by exactly one variable.
    
    ```rust
    let x = String::from("hello"); // `x` owns the string
    ```
    
2. **Only one owner at a time**:
    
    - Ownership of a value cannot be shared among multiple variables simultaneously.
    
    ```rust
    let y = x; // Ownership of the string moves to `y`. `x` is now invalid.
    ```
    
3. **When the owner goes out of scope, the value is dropped**:
    
    - When a variable (the owner) exits its scope, Rust automatically deallocates the memory.
    
    ```rust
    {
        let z = String::from("world");
        // `z` is valid here
    }
    // `z` is dropped and its memory is freed
    ```
    

---

### **Variable Scope**

- A variable is only valid within the block (scope) it is declared in.
- Example:
    
    ```rust
    {
        let s = String::from("hello");
        // `s` is valid here
    }
    // `s` is no longer valid here
    ```
    

---

### **Memory and Allocation**

#### **Stack Allocation**

- Fixed-size data like integers and literals are stored on the stack.
- Example:
    
    ```rust
    let x = 5; // `x` is stored on the stack
    let y = x; // `y` is a copy of `x`, no ownership issues
    ```
    

#### **Heap Allocation**

- Dynamically-sized data, such as strings, are stored on the heap.
- Rust automatically allocates and deallocates heap memory.
- Example:
    
    ```rust
    let s1 = String::from("hello"); // Heap allocation
    let s2 = s1;                   // Ownership moves to `s2`
    // `s1` is now invalid
    ```
    

---

### **Moves vs. Copies**

#### **Move**

- By default, non-primitive data is moved, not copied.
- Example:
    
    ```rust
    let s1 = String::from("hello");
    let s2 = s1; // Ownership moves, `s1` becomes invalid
    ```
    

#### **Clone**

- If you need to duplicate data, use the `clone` method.
- Example:
    
    ```rust
    let s1 = String::from("hello");
    let s2 = s1.clone(); // Deep copy, `s1` and `s2` are both valid
    ```
    

#### **Copy Trait**

- Simple types (e.g., integers, booleans) implement the `Copy` trait, so they are copied, not moved.
- Example:
    
    ```rust
    let x = 42;
    let y = x; // `x` is copied, both `x` and `y` remain valid
    ```
    

---

### **Key Takeaways**

- Ownership ensures **memory safety** by preventing dangling pointers and double-free errors.
- **Move** is Rust’s default behavior for non-copy types, ensuring efficient memory usage.
- Use **clone** sparingly, as it involves deeper and more expensive memory operations.

This clean and structured system ensures Rust programs are both performant and safe, avoiding many pitfalls of manual memory management.



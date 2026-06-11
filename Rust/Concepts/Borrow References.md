

Here's a cleaned-up and concise explanation of **Ownership & Functions** and **References & Borrowing**, along with improved examples:

---

### **Ownership and Functions**

1. **Moving Ownership to a Function**
    
    - When you pass a variable to a function, **ownership is transferred** to the function's parameter. After this, the variable cannot be used in the original scope.
    
    **Example:**
    
    ```rust
    fn takes_ownership(s: String) {
        println!("{}", s); // `s` is valid here.
    }
    
    fn main() {
        let s = String::from("Hello");
        takes_ownership(s);
        // println!("{}", s); // Error: `s` was moved.
    }
    ```
    
2. **Copying Values to a Function**
    
    - For types implementing the **Copy trait** (e.g., integers), values are copied instead of moved.
    
    **Example:**
    
    ```rust
    fn makes_copy(x: i32) {
        println!("{}", x);
    }
    
    fn main() {
        let x = 5;
        makes_copy(x);
        println!("{}", x); // `x` is still valid here.
    }
    ```
    
3. **Returning Ownership**
    
    - A function can **return ownership** to the caller.
    
    **Example:**
    
    ```rust
    fn gives_ownership() -> String {
        String::from("Ownership moved!")
    }
    
    fn takes_and_gives_back(s: String) -> String {
        s // Ownership returned to the caller.
    }
    
    fn main() {
        let s1 = gives_ownership();
        let s2 = takes_and_gives_back(s1);
        println!("{}", s2); // `s2` owns the value now.
    }
    ```
    

---

### **References and Borrowing**

1. **Immutable References**
    
    - Passing references allows functions to use values **without taking ownership**. References are **immutable by default**.
    
    **Example:**
    
    ```rust
    fn calculate_length(s: &String) -> usize {
        s.len()
    }
    
    fn main() {
        let s = String::from("Hello");
        let len = calculate_length(&s);
        println!("Length: {}", len); // `s` is still valid.
    }
    ```
    
2. **Mutable References**
    
    - To modify a value via a reference, use **mutable references**. You can have **only one mutable reference** to a variable in a given scope.
    
    **Example:**
    
    ```rust
    fn change(s: &mut String) {
        s.push_str(", world!");
    }
    
    fn main() {
        let mut s = String::from("Hello");
        change(&mut s);
        println!("{}", s); // Output: "Hello, world!"
    }
    ```
    
    **Restriction:** Multiple mutable references to the same data are **not allowed** to avoid data races.
    
    ```rust
    fn main() {
        let mut s = String::from("Rust");
        let r1 = &mut s;
        let r2 = &mut s; // Error: cannot borrow `s` as mutable more than once.
    }
    ```
    
3. **Mixing Immutable and Mutable References**
    
    - **Immutable and mutable references cannot coexist** in the same scope. However, multiple immutable references are allowed.
    
    **Example:**
    
    ```rust
    fn main() {
        let mut s = String::from("Rust");
    
        let r1 = &s; // Immutable reference.
        let r2 = &s; // Another immutable reference.
    
        // let r3 = &mut s; // Error: cannot borrow `s` as mutable while immutable references exist.
    
        println!("{} {}", r1, r2); // r1 and r2 go out of scope here.
    
        let r3 = &mut s; // Allowed: No active immutable references.
        println!("{}", r3);
    }
    ```
    
4. **Dangling References**
    
    - Rust **prevents dangling references**, which are references pointing to invalid memory.
    
    **Example:**
    
    ```rust
    fn dangle() -> &String {
        let s = String::from("Hello");
        &s // Error: `s` goes out of scope, reference becomes invalid.
    }
    ```
    
5. **Rules of References**
    
    - At any time, **you can have either:**
        1. One **mutable reference**, OR
        2. Any number of **immutable references**.
    - References must always point to **valid data**.

---

### Summary

- Use **ownership** when transferring responsibility for a value.
- Use **references** for borrowing data without transferring ownership.
- Be mindful of Rust's restrictions on mutable references to avoid data races.
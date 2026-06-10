


```rust

#[derive(Debug)]
struct User {
    name: String,
}

impl User {
    fn new(name: &str) -> Self {
        User {
            name: name.to_string(),
        }
    }
}

fn print(user: &User) {
    println!("User name: {}", user.name);
}

fn print_obj(user: User){
    println!("User: {:?}", user);
} // object is dropped and memory is free

fn main() {
    let user1 = User::new("Alice");

    
    print(&user1);// Borrow instead of move
    println!("User: {}", user1.name); // Still usable here
    print(&user1); // OK: we're just borrowing

    // If you really want to move:
    let user2 = user1; // object ownership is transferred
    // print(&user1); // ❌ Compile error: user1 has been moved
    print(&user2); // ✅ OK
    
    print_obj(user2);
    
    // print(&user2);//:=  borrow of moved value: `user2`
}


```



Move semantics:

In Rust, **move semantics** means transferring ownership of data from one variable to another. When you move data, the original variable is no longer valid, and you can’t use it anymore.

### Key Points:

1. **Move**: When a variable is assigned to another, the ownership is transferred. The original variable is no longer usable.
    
    ```rust
    let x = String::from("Hello");
    let y = x;  // Ownership of the String is moved from x to y
    // println!("{}", x); // Error: x is no longer valid
    ```
    
2. **Borrow**: Instead of moving data, you can borrow it. Borrowing means accessing the data without taking ownership, so the original variable is still valid.
    
    ```rust
    let x = String::from("Hello");
    let y = &x;  // Borrowing: x is still valid
    println!("{}", x); // This works
    ```
    
3. **Copy**: Some types (like integers) implement the `Copy` trait, meaning their value is duplicated instead of moved.
    
    ```rust
    let x = 42;
    let y = x;  // Copying the value, both x and y are valid
    ```
    

### Why It Matters:

- **Performance**: Moving is efficient since no extra memory allocation or copying happens, unlike in languages that use garbage collection.
- **Safety**: Rust ensures there’s no accidental data duplication or double-free by enforcing strict rules on ownership.


---

### 📌 **Borrowing Rules: The Three Laws of Safety**

1. You can have **many immutable** borrows **or** **one mutable** borrow - but not both at the same time.
2. Borrows **must not outlive the owner**.
3. The compiler enforces these rules at **compile time**, not runtime.


reference ~= borrowing


```rust

#[derive(Debug)]
struct User {
    name: String,
}

impl User {
    fn new(name: &str) -> Self {
        User {
            name: name.to_string(),
        }
    }
}

fn print_name(user: &User) {
    println!("User name: {}", user.name);
}

// fn change_name_try(user: &User){
//     user.name = "new name".to_string();
//     //:= cannot assign to `user.name`, which is behind a `&` reference
// } 

fn change_name(user: &mut User){
    user.name = "new name1".to_string();
}

fn change_name2(user: &mut User){
    user.name = "new name2".to_string();
}

fn main() {
    let user1 = User::new("Alice");
    let user2 = user1; // user1 memory is moved
    
    // print_name(&user1);//:= borrow of moved value: `user1`
    print_name(& user2); // just borrowing
    print_name(& user2); // just borrowing
    
    // change_name_try(&user2);
    
    
    let mut user3 = user2; // user2 memory is moved and made mutable
    // print_name(&user2); //:=  borrow of moved value: `user2`
    
    print_name(& user3); //? warning: variable does not need to be mutable
    
    change_name(&mut user3);
    print_name(& user3); // new name1
    
    let user3_non_mut = &user3; // create im_mut reference from mut reference
    print_name(& user3_non_mut); // new name1
    
    
    change_name2(&mut user3);
    print_name(& user3); // new name2
    
    // print_name(& user3_non_mut); 
    // :Cannot borrow `user3` as mutable because it is also borrowed as immutable
    // mutable borrow occurs here after taking immutable reference so causing issue
    
    let user3_non_mut2 = & user3;
    print_name(& user3_non_mut2); // new name2
    print_name(& user3); // new name2
    
    let user3_non_mut3 = & user3;
    print_name(& user3_non_mut3); // new name2
    
    let user2_non_mut2_copy = & user3_non_mut2;
    print_name(& user2_non_mut2_copy); // new name2
   
    
}

```



Borrowing rules:
1) Immutable vs mutable references
2) 1 mutable XOR N immutable references
3) References validity


Immutable reference - should not have underlying value change at any cost!

```rust
#![allow(warnings)]

#[derive(Debug)]
struct User {
    name: String,
}

impl User {
    fn new(name: &str) -> Self {
        User {
            name: name.to_string(),
        }
    }
}

fn print_name(user: &User) {
    println!("{}", user.name);
}

fn change_name(user: &mut User, new_name:&str){
    user.name = new_name.to_string();
}

fn main() {
    let mut user1 = User::new("David");
    print_name(& user1); // David
    change_name(&mut user1, "James");
    print_name(& user1); // James
    
    
    let mut user2 = User::new("Amin");
    let user2_r1 = &mut user2;
    print_name(& user2_r1); // Amin
    
    
    // change_name(&mut user2_r1, "Rajesh");
    //:= cannot borrow `user2_r1` as mutable, as it is not declared as mutable
    
    // let mut user2_r2 = &mut user2;
    // print_name(& user2_r1); //:= cannot borrow `user2` as mutable more than once at a time
    // drop(user2_r1) //:cannot borrow `user2` as mutable more than once at a time
    
    drop(user2_r1); 
    let mut user2_r2 = &mut user2;
    print_name(& user2_r2); // Amin
    
    // print_name(& user2_r1); //:= cannot borrow `user2` as mutable more than once at a time
    
    change_name(&mut user2_r2, "Rajesh");
    print_name(& user2_r2); // Rajesh
    
    print_name(& user2); // Rajesh
    change_name(&mut user2, "Sunil");
    print_name(& user2); // Sunil
    
    print_name(& user2_r2); // : cannot borrow `user2` as immutable because it is also borrowed as mutable
    
}

```


### 🔐 Rust Borrowing Rule — "1 Mutable XOR N Immutable"

Rust enforces this rule to ensure **memory safety without a garbage collector**:

> **At any one time, you can have either:**
> - **One mutable reference** (`&mut T`) **OR**
> - **Any number of immutable references** (`&T`)
> **But not both!**

---

### 🚫 Why?

To prevent:
- **Data races**
- **Unexpected mutations**
- **Dangling or invalid references**

---

### ✅ Examples

**Immutable references (many allowed):**

```rust
let data = String::from("Hello");

let r1 = &data;
let r2 = &data;

println!("{}, {}", r1, r2); // OK
```

**Mutable reference (only one allowed, no immutable refs at same time):**

```rust
let mut data = String::from("Hello");

let r1 = &mut data;
// let r2 = &data; // ❌ ERROR: cannot borrow as immutable while mutable borrow exists

r1.push_str(" world"); // OK
```

---

### 📌 Key Rule:

> **You can read or write, but not both at the same time.**

---



```rust
#![allow(warnings)]

#[derive(Debug)]
struct User {
    name: String,
}

impl User {
    fn new(name: &str) -> Self {
        User {
            name: name.to_string(),
        }
    }
}

fn print_name(user: &User) {
    println!("{}", user.name);
}

fn change_name(user: &mut User, new_name:&str){
    user.name = new_name.to_string();
}

fn main() {
    let mut user1 = User::new("Alice");
    print_name(& user1); //=> Alice
    change_name(&mut user1, "Shanthi");
    print_name(& user1); //=> Shanthi
    
    let r1 = &mut user1;
    let r2 = &user1;
    print_name(&r2); //=> Shanthi
  
    
    // drop(r1); // borrow happend and freed, so user itself freed
    //=: cannot borrow `user1` as immutable because it is also borrowed as mutable
    
    let mut user2 = User::new("Sam");
    let r3 = &mut user2;
    let r4 = &user2;
    
    print_name(&r4); //=> Sam
    
    // print_name(&r3);
    // : cannot borrow `user2` as immutable because it is also borrowed as mutable
    
    
    let mut user3 = User::new("Tommy");
    let mut r5 = &mut user3;
    print_name(&r5); //=> Tommy
    change_name(&mut r5, "Valter");
    print_name(&r5); //=> Valter
    
    let r6 = & r5;
    print_name(&r6); //=> Valter
    
    let r7 = & user3;
    print_name(&r7); //=> Valter
    
    //  change_name(&mut r5, "Arnauld");
     //:  cannot borrow `user3` as immutable because it is also borrowed as mutable
    // affects r7 area
}

```



---


# Rust Ownership Explained: Memory Safety Without a Garbage Collector

Welcome back to _Let's Get Rusty_! In this chapter, we'll explore one of Rust's most distinctive and powerful features: **ownership**.

Ownership is the mechanism that allows Rust to guarantee memory safety **without using a garbage collector**. Along the way, we'll also cover:

- References
    
- Borrowing
    
- Mutable and immutable references
    
- Slices
    
- Stack vs. heap memory
    
- How Rust manages data at runtime
    

Understanding these concepts is essential to becoming proficient in Rust.

---

# Why Do We Need Memory Management?

Every program needs a way to manage memory. Traditionally, there have been two major approaches.

## Garbage Collection

Languages such as Java and C# use a garbage collector to automatically manage memory.

### Advantages

- Memory management is largely automatic.
    
- Fewer memory-related bugs.
    
- Faster development because programmers don't manually manage memory.
    

### Disadvantages

- Less control over memory usage.
    
- Runtime performance can be slower.
    
- Performance may be unpredictable due to garbage collection pauses.
    
- Larger program size because the garbage collector must be included.
    

---

## Manual Memory Management

Languages such as C and C++ require programmers to allocate and free memory manually.

### Advantages

- Full control over memory.
    
- Excellent runtime performance.
    
- Smaller executable size.
    

### Disadvantages

- Extremely error-prone.
    
- Memory leaks, dangling pointers, and buffer overflows are common.
    
- Development takes longer because memory must be managed carefully.
    

---

# Rust's Ownership Model

Rust introduces a third approach: **ownership**.

The ownership model provides many of the benefits of manual memory management while maintaining memory safety.

### Benefits

- Fine-grained memory control.
    
- Fast runtime performance.
    
- Small executable size.
    
- Memory safety guarantees.
    

### Trade-off

Rust performs strict compile-time checks. If ownership rules are violated, compilation fails.

This can initially feel restrictive, but it prevents many difficult runtime bugs before the program ever runs.

---

# Stack vs. Heap

To understand ownership, it's important to understand how memory is organized.

## The Stack

The stack:

- Has a fixed size.
    
- Stores local variables.
    
- Is extremely fast.
    
- Allocates and deallocates memory automatically.
    

Each function call creates a **stack frame** containing its local variables.

Example:

```rust
fn a() {
    let x = 5;
    b();
}

fn b() {
    let y = 10;
}
```

When `b()` finishes, its stack frame is removed. When `a()` finishes, its stack frame is removed.

---

## The Heap

The heap:

- Can grow and shrink at runtime.
    
- Stores dynamically sized data.
    
- Requires allocation.
    
- Is slower than stack allocation.
    

For example:

```rust
let s = String::from("hello");
```

The actual string data is stored on the heap, while the stack stores:

- A pointer to the data
    
- The string length
    
- The string capacity
    

---

# The Three Rules of Ownership

These are the most important rules in Rust:

### Rule 1

Each value has an owner.

### Rule 2

A value can have only one owner at a time.

### Rule 3

When the owner goes out of scope, the value is dropped.

Example:

```rust
{
    let s = String::from("hello");
}
// s is dropped here
```

When the scope ends, Rust automatically frees the heap memory.

---

# Moves and Copies

Consider this example:

```rust
let x = 5;
let y = x;
```

The value is copied because integers implement the `Copy` trait.

Now consider:

```rust
let s1 = String::from("hello");
let s2 = s1;
```

This does **not** create a deep copy.

Instead, ownership is moved from `s1` to `s2`.

After the move:

```rust
println!("{}", s1);
```

produces a compiler error because `s1` is no longer valid.

---

## Cloning Data

If you want a deep copy:

```rust
let s1 = String::from("hello");
let s2 = s1.clone();
```

Now both strings own separate heap allocations.

---

# Ownership and Functions

Passing a value to a function transfers ownership unless the type implements `Copy`.

```rust
fn takes_ownership(s: String) {
    println!("{}", s);
}

let s = String::from("hello");
takes_ownership(s);
```

After the function call:

```rust
println!("{}", s);
```

results in a compile-time error.

---

## Copy Types

```rust
fn makes_copy(x: i32) {
    println!("{}", x);
}

let n = 5;
makes_copy(n);

println!("{}", n);
```

This works because `i32` implements `Copy`.

---

# References and Borrowing

Moving ownership can be inconvenient.

Often, we simply want to use a value temporarily.

That's where references come in.

Example:

```rust
fn calculate_length(s: &String) -> usize {
    s.len()
}

let s1 = String::from("hello");
let len = calculate_length(&s1);
```

The `&` creates a reference.

Ownership stays with `s1`, and the function merely borrows the value.

---

# Mutable References

References are immutable by default.

This does not compile:

```rust
fn change(s: &String) {
    s.push_str(" world");
}
```

Instead:

```rust
fn change(s: &mut String) {
    s.push_str(" world");
}

let mut s = String::from("hello");

change(&mut s);
```

Now the function can modify the string without taking ownership.

---

# Rules for Mutable References

Rust allows either:

- One mutable reference
    

or

- Any number of immutable references
    

but never both at the same time.

Invalid:

```rust
let mut s = String::from("hello");

let r1 = &mut s;
let r2 = &mut s;
```

Valid:

```rust
let s = String::from("hello");

let r1 = &s;
let r2 = &s;
```

These restrictions prevent data races at compile time.

---

# Dangling References

Rust prevents references from pointing to invalid memory.

This code is invalid:

```rust
fn dangle() -> &String {
    let s = String::from("hello");

    &s
}
```

The string is dropped when the function ends, leaving the returned reference invalid.

Rust catches this during compilation.

---

# Reference Rules Summary

1. At any given time, you can have:
    
    - One mutable reference, or
        
    - Any number of immutable references.
        
2. References must always be valid.
    

---

# Slices

A slice references part of a collection without taking ownership.

## String Slices

```rust
let s = String::from("hello world");

let hello = &s[0..5];
let world = &s[6..11];
```

These slices reference portions of the original string.

Shortcut syntax:

```rust
&s[..5]
&s[6..]
&s[..]
```

---

# Why Slices Matter

Suppose we want a function that returns the first word in a string.

Instead of returning an index:

```rust
fn first_word(s: &String) -> usize
```

we can return a string slice:

```rust
fn first_word(s: &str) -> &str
```

Example implementation:

```rust
fn first_word(s: &str) -> &str {
    let bytes = s.as_bytes();

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];
        }
    }

    &s[..]
}
```

This approach ties the returned value directly to the original string, preventing synchronization issues.

---

# String Literals Are Slices

```rust
let s = "hello world";
```

The type of `s` is:

```rust
&str
```

String literals are already string slices pointing into the program binary.

Because of this, functions that accept `&str` are more flexible:

```rust
fn first_word(s: &str) -> &str
```

This function can accept both:

```rust
String
```

and

```rust
&str
```

values.

---

# Array Slices

Slices work with arrays too.

```rust
let a = [1, 2, 3, 4, 5];

let slice = &a[0..2];
```

This creates a slice referencing the first two elements.

Type:

```rust
&[i32]
```

---

# Key Takeaways

Rust's ownership system is the foundation of its memory safety guarantees.

Remember:

- Every value has exactly one owner.
    
- Ownership can be moved.
    
- References allow borrowing without ownership transfer.
    
- Mutable references are exclusive.
    
- Rust prevents dangling references.
    
- Slices allow safe access to portions of collections.
    

While the ownership rules can feel strict at first, they eliminate an entire class of memory-related bugs and enable Rust to provide safety and performance without a garbage collector.****

referred {
https://www.youtube.com/watch?v=VFIOSWy93H0

}



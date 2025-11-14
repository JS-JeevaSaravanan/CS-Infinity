



# 🦀 Rust Mutability

Rust enforces **deep, aliasing-safe mutability** at compile time.

## 1. Variable bindings

```rust
let x = 5;        // immutable
let mut y = 5;    // mutable variable
```

## 2. Reference mutability (`&T` vs `&mut T`)

This is the real power:

- `&T` = shared, immutable reference
    
- `&mut T` = exclusive, mutable reference
    

Rust guarantees:

- You can have **many &T** _or_ **one &mut T**
    
- Never both at the same time
    
- Prevents data races and undefined behavior
    

## 3. Ownership

Rust enforces that exactly **one owner** exists for non-copy values.

```rust
let s = String::new();
let t = s; // s is moved (cannot be used)
```

Mutability ties into this because ownership + exclusive `&mut` access eliminates aliasing problems.

## 4. Interior Mutability (escape hatch)

Rust allows controlled mutation even with `&T` via:

- `Cell<T>`
    
- `RefCell<T>` (runtime borrow checking)
    
- `Mutex<T>` / `RwLock<T>` (thread-safe)
    

This has no Kotlin equivalent.

### Rust summary

- **Deep immutability by default**
- **Borrow checker prevents aliasing bugs**
- **Thread-safety is compile-time enforced**

---




 **how the languages express and enforce mutability**.

---

# 🔥 1. Kotlin (`val` / `var`)

### Keywords

- **`val`** → immutable _binding_ (cannot reassign)
    
- **`var`** → mutable _binding_ (can reassign)
    

### Data mutability

- **Does NOT guarantee deep immutability**
- Objects referenced by `val` can still mutate

```kotlin
val list = mutableListOf(1)
list.add(2)   // allowed — object is mutable

val x = 1
x = 2         // ❌ not allowed — binding is immutable
```

### Enforcement level
- Shallow immutability Only
- Runtime thread-safety, not compile-time

---

# 🍏 2. Swift (`let` / `var`)

### Keywords
- **`let`** → immutable _binding_
- **`var`** → mutable _binding_

Very similar to Kotlin, but _value types_ make immutability stronger:

### Data mutability

- **Value types (struct, enum) are deeply immutable when bound with `let`**
- **Reference types (class) behave like Kotlin — object may still mutate**

```swift
let a = 10
a = 20     // ❌ rebind not allowed

struct Point { var x: Int }
let p = Point(x: 10)
p.x = 20   // ❌ struct becomes deeply immutable under `let`

class C { var x = 10 }
let c = C()
c.x = 20   // ✔️ allowed — reference type data can mutate
```

### Enforcement level

- Binding immutability
- **Deep immutability for value types**
- Runtime safety for reference types

Strongest immutability semantics among mainstream OO languages except Rust.

---

# 🦀 3. Rust (`let`, `let mut`, `&T`, `&mut T`)

### Keywords

- **`let`** → immutable binding _and_ immutable data unless mutably accessed
- **`let mut`** → mutable binding (can change binding and data)
- **`&T`** (shared, immutable reference)
- **`&mut T`** (exclusive, mutable reference)

### Data mutability

Rust enforces **exclusive mutable access**:
- Many `&T`
- OR one `&mut T`
- Never both

```rust
let x = 5;
x = 6;            // ❌ binding immutable

let mut y = 5;
y = 6;            // ✔️

fn bump(v: &mut i32) { *v += 1; } // exclusive borrow for mutation
```

### Enforcement level
- **Deep, alias-safe mutability**
- **Compile-time memory safety**
- **No data races**
- Most powerful and strict model

Rust stands alone in this category.

---

# ⚡ 4. JavaScript (`const`, `let`, `var`)

### Keywords

- **`const`** → immutable _binding_ (cannot reassign)
- **`let`** → block-scoped mutable binding
- **`var`** → function-scoped mutable binding (legacy, avoid)

### Data mutability

Same as Kotlin:

- `const` prevents reassignment but does **not** freeze the object.
    

```js
const x = 10
x = 20     // ❌

const obj = { a: 1 }
obj.a = 2  // ✔️ object still mutable
```

JS has no native deep immutability (only via `Object.freeze`, still shallow).

### Enforcement level

- Shallow immutability only
    
- No compile-time safety; dynamic language
    

---

# 🧠 SUPER COMPRESSED COMPARISON TABLE

|Language|Immutable Keyword|Mutable Keyword|Deep Immutability?|Reference vs Value Behavior|Compile-time Safety|
|---|---|---|---|---|---|
|**Kotlin**|`val`|`var`|❌ No|Reference types always mutable|❌ runtime only|
|**Swift**|`let`|`var`|✔️ for value types only|Structs freeze under `let`; classes don’t|❌ runtime only|
|**Rust**|`let`|`let mut`|✔️ Yes (default)|`&T` vs `&mut T` enforced by borrow checker|✔️ strongest|
|**JavaScript**|`const`|`let`, `var`|❌ No|Objects always mutable unless frozen|❌ none|

---

# 🔥 ULTRA-TL;DR

- **Kotlin** → Immutable reference, mutable objects.
- **Swift** → Immutable reference; value types become deeply immutable.
- **Rust** → Immutable by default everywhere; strict borrow rules; safest.
- **JS** → Immutable reference only, everything else wildly mutable.


---

## C++ / C

Has `const`, but:

- Aliasing rules are unsafe
    
- `const_cast` breaks immutability
    
- Not enforced by a borrow checker
    
- Can mutate through multiple pointers → UB
    

Rust fixed this entire category of problems.

## Java

Similar to Kotlin:

- final = immutable reference only
    
- objects still mutable
    
- no deep immutability
    
- concurrency via locks, no static guarantees
    

## Functional languages (Haskell, OCaml, F#)

- true immutability by default
    
- mutation exists but restricted
    

Rust borrowed some functional ideas but kept mutation with safety.

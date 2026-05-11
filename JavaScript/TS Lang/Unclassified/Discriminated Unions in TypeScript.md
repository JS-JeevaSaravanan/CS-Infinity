
# 🧠 Discriminated Unions in TypeScript (The Safe Way to Model State)

When building frontend applications, especially with APIs, we often need to represent **different states of data fetching**, such as:

- Loading
    
- Success
    
- Error
    

A common mistake is to model all of these states inside a single object with optional fields. While this looks simple, it leads to **unsafe and ambiguous state management**.

---

# ⚠️ The Problem: “Flexible but Dangerous” State Design

A naive approach might look like this:

```ts
interface State {
  status: "loading" | "success" | "error";
  data?: string;
  error?: string;
}
```

At first glance, this seems fine. But it introduces a serious issue:

### ❌ Invalid states become possible

For example:

- `status: "loading"` + `error: "Something went wrong"` ❌ (doesn’t make sense)
    
- `status: "error"` but no `error` message ❌
    
- `status: "success"` but missing `data` ❌
    

This creates a **combinatorial explosion of invalid combinations**, where TypeScript cannot reliably protect you from logic bugs.

---

# ✅ The Solution: Discriminated Unions

Instead of one flexible object, we define **strict, separate states** using a union type.

```ts
type State =
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; error: string };
```

---

# 🧩 Why This Works

Here, `status` is called the **discriminant**.

It tells TypeScript exactly which shape the object belongs to.

So:

### 🔵 Loading state

```ts
{ status: "loading" }
```

### 🟢 Success state

```ts
{ status: "success"; data: string }
```

### 🔴 Error state

```ts
{ status: "error"; error: string }
```

---

# 🛡️ What You Gain

## 1. ❌ Impossible states are eliminated

You can no longer do:

- success without data
    
- error without message
    
- loading with leftover fields
    

TypeScript enforces correctness.

---

## 2. 🧠 Better autocomplete & inference

When you check the status:

```ts
if (state.status === "success") {
  console.log(state.data); // ✅ guaranteed to exist
}
```

TypeScript automatically narrows the type.

---

## 3. 🧼 Cleaner logic

No optional chaining everywhere.  
No guessing if a field exists.

---

## 4. 🔒 Safer refactoring

Adding a new state forces you to handle it everywhere (compile-time safety).

---

# 📌 Key Insight

If you find yourself writing:

- lots of optional fields (`?`)
    
- many conditional checks
    
- unclear object shapes
    

👉 You likely need a **discriminated union**

---

# 🚀 Mental Model

Instead of thinking:

> “One object that can kind of be many things”

Think:

> “One of many strict, well-defined states”

---

# 🧠 Final Takeaway

Discriminated unions in TypeScript are powerful because they:

- eliminate invalid states
    
- enforce correctness at compile time
    
- make state transitions explicit
    
- improve readability and maintainability
    

They are one of the most important patterns for building **reliable frontend applications**.

---

referred {
https://youtube.com/shorts/HDaPLwZWguo?si=go98DSZv9sDaLBn3

}
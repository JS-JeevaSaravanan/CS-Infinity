
Below is a **clean, crisp, tech-talk–ready article**, tightened for **clarity, flow, and examples**, with one clear message:

> **Errors should be values, not control flow.**

You can almost read this verbatim in a session.

---

# Error Handling in TypeScript

## Why “Error as Value” Beats `try/catch`

### Main Motto

> **Error as Value is too good.**

---

## 1️⃣ The Core Problem

TypeScript is excellent at typing **data**.  
It is terrible at typing **failure**.

```ts
async function getUser(id: number): Promise<User> {
  if (id === 2) throw new Error("User not found");
  return { id, name: "Kyle" };
}
```

From TypeScript’s perspective:

```ts
const user = await getUser(2);
// user: User
```

That is a lie.

This function:

- might succeed
    
- might throw
    
- might throw deep inside something else
    

And the type system says **nothing**.

---

## 2️⃣ Why `try/catch` Is a Bad Default

### Example

```ts
try {
  const user = await getUser(2);
  console.log(user.name);
} catch {
  console.log("Something went wrong");
}
```

### Problems

#### ❌ Catches too much

- business errors
    
- typos
    
- logic bugs
    
- programmer mistakes
    

All look identical.

#### ❌ Scope pollution

Everything using `user` must live inside `try`.

#### ❌ Lost intent

The caller has no idea **what failed** or **why**.

👉 `try/catch` is **blind and unsafe**.

---

## 3️⃣ Step 1: Flatten Errors (Bare Minimum Fix)

Instead of catching inline, **return the error**.

```ts
async function catchError<T>(
  promise: Promise<T>
): Promise<[Error | undefined, T | undefined]> {
  try {
    return [undefined, await promise];
  } catch (e) {
    return [e as Error, undefined];
  }
}
```

### Usage

```ts
const [error, user] = await catchError(getUser(2));

if (error) {
  console.log(error.message);
  return;
}

console.log(user.name);
```

### Why this is better

- No nesting
    
- Explicit control flow
    
- Errors are visible
    
- Safer than raw `try/catch`
    

⚠️ But still:

- All errors look the same
    
- Unexpected bugs are swallowed
    

---

## 4️⃣ Step 2: Catch Only Expected Errors (Typed Catch)

Most failures are **expected**:

- 404
    
- validation
    
- auth
    

Everything else should crash.

### Custom error

```ts
class UserNotFoundError extends Error {}
```

```ts
async function getUser(id: number) {
  if (id === 2) throw new UserNotFoundError();
  return { id, name: "Kyle" };
}
```

### Typed catcher

```ts
const [error, user] = await catchErrorTyped(
  getUser(2),
  [UserNotFoundError]
);

if (error) {
  // error is UserNotFoundError
  return;
}

console.log(user.name);
```

### What this gives you

✅ Only expected errors are handled  
✅ Unexpected bugs crash loudly  
✅ Error type is preserved  
✅ Incremental adoption

This is the **last stop before Result types**.

---

## 5️⃣ The Big Leap: Error as Value (Result Pattern)

Instead of throwing, **return failure**.

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

### Example

```ts
function getUser(id: number): Result<User, "USER_NOT_FOUND"> {
  if (id === 2) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }
  return { ok: true, value: { id, name: "Kyle" } };
}
```

### Usage

```ts
const result = getUser(2);

if (!result.ok) {
  switch (result.error) {
    case "USER_NOT_FOUND":
      console.log("Handle 404");
  }
} else {
  console.log(result.value.name);
}
```

### Why this scales

- Errors are part of the type
    
- Impossible to forget handling
    
- Exhaustive checking
    
- No `try/catch`
    
- No surprises
    

This is what **Rust, Go, Gleam, Elixir** do.

Libraries like **`neverthrow`** formalize this in TypeScript.

---

## 6️⃣ Mixing Hard Failures & Soft Fallbacks (Real World)

### Exception-style

```ts
const safeCategoryDiscount = (category: string): number => {
  try {
    return getCategoryDiscount(category).discount;
  } catch {
    return 0; // soft fallback
  }
};
```

### Result-style (cleaner)

```ts
const categoryResult = getCategoryResult(product.category);
const categoryDiscount = categoryResult.ok
  ? categoryResult.value.discount
  : 0;
```

👉 **Soft fallback = value**  
👉 **Hard failure = explicit error**

---

## 7️⃣ Effect: The Nuclear Option

Effect takes “error as value” to its logical extreme.

```ts
const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail("DIVIDE_BY_ZERO")
    : Effect.succeed(a / b);
```

Effect gives:

- typed errors
    
- automatic propagation
    
- zero exceptions
    

But costs:

- new mental model
    
- new runtime
    
- whole codebase buy-in
    

Effect is not incremental.

---

## 8️⃣ The Spectrum 

```text
try/catch        → blind & unsafe
catchError       → explicit, untyped
catchErrorTyped  → typed, selective, incremental
Result / Effect  → full correctness model
```

You don’t jump to Effect.

You **grow** into better models.

---

## 9️⃣ Final Takeaway

> **Errors are not exceptional.  
> They are part of your domain.**

When you:

- throw errors
    
- hide them
    
- hope callers remember to catch
    

Your system becomes fragile.

When you:

- return errors
    
- type them
    
- make them explicit
    

Your system becomes predictable.

---

## Final Advice for Your Tech Session

If the audience remembers **one thing**, make it this:

> **Error as Value > Error as Control Flow**

You don’t need Effect.  
You don’t need FP.

Just stop pretending failure doesn’t exist.

That mindset alone is a massive upgrade 🚀
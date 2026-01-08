# Error Handling in TypeScript: Embracing Chaos and Choosing the Right Strategy

Error handling in TypeScript lives at the intersection of **JavaScript’s runtime chaos** and **TypeScript’s compile-time guarantees**. While TypeScript gives us strong types, it does _not_ eliminate runtime failures. Instead, it gives us tools to **model, predict, and contain chaos**.

This document explores:

- Why error handling is inherently chaotic
    
- The limits of TypeScript’s type system
    
- Common error-handling strategies
    
- Trade-offs and best practices
    

---

## 1. The Nature of Chaos in TypeScript

### 1.1 Compile-Time Safety vs Runtime Reality

TypeScript only exists at **compile time**. At runtime:

- APIs can fail
    
- Networks can timeout
    
- JSON can be malformed
    
- Users can input anything
    
- Third-party libraries can throw unexpected errors
    

```ts
const user = JSON.parse(input); // 💥 runtime chaos
```

Even with perfect typings, runtime behavior is **non-deterministic**.

---

### 1.2 Sources of Chaos

|Source|Example|
|---|---|
|External systems|APIs, databases, file systems|
|User input|Forms, query params|
|Async behavior|Timeouts, race conditions|
|JavaScript itself|`undefined`, `null`, coercion|
|Legacy / third-party code|Uncontrolled throws|

---

## 2. The Default JavaScript Model: `throw` / `try-catch`

### 2.1 Synchronous Errors

```ts
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero");
  }
  return a / b;
}
```

### 2.2 Async Errors

```ts
try {
  const data = await fetchData();
} catch (err) {
  console.error(err);
}
```

### 2.3 Problems With `throw`

- ❌ Errors are **untyped**
    
- ❌ You don’t know what can be thrown
    
- ❌ Forces consumers to _remember_ to catch
    
- ❌ Hard to compose
    

```ts
catch (err) {
  // err: unknown
}
```

---

## 3. TypeScript’s First Defense: `unknown`

TypeScript correctly treats caught errors as `unknown`.

```ts
catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

### Why this matters

- Prevents unsafe assumptions
    
- Forces explicit narrowing
    
- Encourages defensive code
    

---

## 4. Strategy 1: Typed Error Classes

### 4.1 Custom Errors

```ts
class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}
```

Usage:

```ts
throw new NotFoundError("User");
```

Handling:

```ts
catch (err) {
  if (err instanceof NotFoundError) {
    // handle specifically
  }
}
```

### Pros / Cons

✅ Familiar  
✅ Works well with `try-catch`  
❌ Still runtime-only  
❌ Consumers must know all error types

---

## 5. Strategy 2: Result / Either Pattern (Functional Approach)

Instead of throwing, **return errors as data**.

### 5.1 Result Type

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Usage:

```ts
function parseJson(input: string): Result<object, string> {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}
```

Handling:

```ts
const result = parseJson(input);

if (!result.ok) {
  console.error(result.error);
}
```

### Pros / Cons

✅ Fully typed  
✅ No hidden control flow  
✅ Easy to compose  
❌ More verbose  
❌ Can feel unidiomatic in JS-heavy codebases

---

## 6. Strategy 3: `never` for Impossible States

Use `never` to enforce exhaustiveness.

```ts
type ApiError =
  | { type: "NOT_FOUND" }
  | { type: "UNAUTHORIZED" };

function handleError(err: ApiError) {
  switch (err.type) {
    case "NOT_FOUND":
      return;
    case "UNAUTHORIZED":
      return;
    default:
      const _exhaustive: never = err;
      return _exhaustive;
  }
}
```

This catches **logical chaos** at compile time.

---

## 7. Strategy 4: Error Boundaries (UI Chaos)

In frontend frameworks (React):

```ts
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    log(error);
  }
}
```

Purpose:

- Contain failures
    
- Prevent total app crashes
    
- Graceful degradation
    

---

## 8. Strategy 5: Validation as Error Prevention

Prevent chaos before it happens.

### Runtime Validation Libraries

- `zod`
    
- `io-ts`
    
- `yup`
    

```ts
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const user = UserSchema.parse(data); // throws or returns safe data
```

This converts **unknown chaos → known structure**.

---

## 9. Choosing the Right Strategy

|Context|Recommended Approach|
|---|---|
|Library / SDK|Result / Either|
|App logic|Typed errors|
|UI|Error boundaries|
|External input|Runtime validation|
|Critical systems|No throws, explicit errors|

---

## 10. Key Principles

1. **Errors are part of your API**
    
2. **TypeScript can model failure, not prevent it**
    
3. **Prefer explicitness over surprise**
    
4. **Contain chaos close to its source**
    
5. **Fail loudly in development, gracefully in production**
    

---

## Final Thought

TypeScript doesn’t eliminate chaos—it gives you the language to **describe it, constrain it, and survive it**.

Good error handling is not about avoiding failure; it’s about making failure **boring, predictable, and safe**.

---

# TypeScript Error Handling Is Broken — Here’s the Spectrum of Fixes

I’m working on a lot of different projects right now. They don’t overlap much in purpose, but they _all_ share one thing in common:

They’re written in **TypeScript**.

And because of that, they all share the same frustration.

## The Core Problem: TypeScript Doesn’t Care About Errors

TypeScript is great at typing _data_.  
It is **terrible** at typing _failure_.

```ts
async function doMath(): Promise<number> {
  const value = Math.random();
  if (value > 0.5) {
    throw new Error("Too large");
  }
  return value;
}
```

From TypeScript’s perspective:

```ts
const result = await doMath();
// result: number
```

That is a lie.

This function throws **half the time**, but the type system has **no way of expressing that**.  
Unless you’ve read every line of code (and everything it calls), you have no idea what can fail.

Errors are:

- Untyped
    
- Implicit
    
- Invisible in function signatures
    
- Easy to forget
    
- Easy to mishandle
    

This is how bugs sneak in.

---

## The Try/Catch Problem

The obvious fix is `try/catch`.

```ts
try {
  const value = await doMath();
  console.log(value);
} catch (err) {
  console.error(err);
}
```

But this falls apart immediately.

### Problem 1: Scope

```ts
let value: number;

try {
  value = await doMath();
} catch {
  return;
}

console.log(value); // 😬 maybe undefined
```

You either:

- Push all logic into the block
    
- Duplicate logic
    
- Or lie to the type system
    

### Problem 2: Nesting Hell

```ts
try {
  const a = await doMath();
  try {
    const b = await doMath();
    console.log(a + b);
  } catch {}
} catch {}
```

Humans do not think like this.  
This code is fragile, unreadable, and error-prone.

### Problem 3: Rethrowing Loses Context

Once errors bubble up through layers of `catch`, you lose:

- Where it happened
    
- What kind of failure it was
    
- What to do with it
    

This pattern does not scale.

---

## The Bare-Minimum Fix: A Try/Catch Wrapper

I got tired of this and wrote a tiny helper.

```ts
async function tryCatch<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    return [await promise, null];
  } catch (err) {
    return [null, err as Error];
  }
}
```

Usage:

```ts
const [data, error] = await tryCatch(doMath());

if (error) {
  return new Error("Unable to process");
}

// data is now number
console.log(data);
```

### Why This Is Better

- No nested blocks
    
- No invisible control flow
    
- Errors are explicit
    
- Types change _after_ error checks
    

```ts
// Before error check
data: number | null

// After error check
data: number
```

This is **objectively safer** than raw `try/catch`.

This is not a hot take.  
This is just better code.

---

## But This Is Still the Bare Minimum

This wrapper:

- Catches _everything_
    
- Loses error specificity
    
- Still treats all failures as `Error`
    

Once your app has **layers**, this falls apart.

---

## Enter Result Types (aka: Never Throw)

Instead of throwing, **return errors as data**.

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Now functions _must_ declare failure.

```ts
function verifyRequest(): Result<Request, VerifyError> {
  if (!isAuthenticated()) {
    return { ok: false, error: "UNAUTHORIZED" };
  }

  return { ok: true, value: request };
}
```

Usage:

```ts
const result = verifyRequest();

if (!result.ok) {
  switch (result.error) {
    case "UNAUTHORIZED":
      return respond401();
    case "RATE_LIMIT":
      return respond429();
  }
}
```

### Why This Scales

- Errors are typed
    
- Exhaustive checking is possible
    
- You _cannot_ ignore failure
    
- You always know **what went wrong**
    

This is what the `neverthrow` library formalizes.

---

## Where Neverthrow Starts to Hurt

Async composition.

```ts
const result = await getRateLimiter();
// result: Result<Limiter, Error>

// still need to unwrap
if (result.isErr()) return result.error;
```

Chaining async calls requires:

- `andThen`
    
- `map`
    
- Manual unwrapping everywhere
    

It works — but it’s noisy.

Also:

- You end up writing return types everywhere
    
- TypeScript allows you to lie with return types
    
- The ergonomics degrade as complexity grows
    

---

## Effect: The Nuclear Option

Effect solves **everything** above.

But let’s be honest:

> Effect is not a library.  
> Effect is a **language**.

```ts
const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail("Divide by zero")
    : Effect.succeed(a / b);
```

Now:

- Errors are typed
    
- Effects compose
    
- Failures propagate automatically
    
- Nothing throws
    

But…

### The Cost

- Entire mental model change
    
- New runtime
    
- New primitives
    
- New way to structure apps
    
- Your whole codebase must opt in
    

Effect is **React**, not jQuery.  
It wants to be the _root_ of your application.

And when you do that?  
It’s incredible.

But it’s not incremental.

---

## The Spectrum (This Is the Important Part)

Think of error handling as a progression:

### 1. Try/Catch

You’re not thinking about errors.

### 2. Try/Catch Wrapper

You’re acknowledging errors exist.

### 3. Result Types / Neverthrow

You’re modeling errors explicitly.

### 4. Effect

You want correctness above all else.

There is no single “right” answer.

But **doing nothing is wrong**.

---

## The Goal Isn’t Effect — It’s Thinking About Errors

Effect users don’t care if you use Effect.  
They care that you stop pretending failures don’t exist.

As codebases grow:

- APIs multiply
    
- Failure modes explode
    
- Debugging gets harder
    

If your code does not _describe_ failure, it will eventually fail you.

---

## Final Advice

If all of this feels overwhelming:

- Copy the try/catch wrapper
    
- Use it everywhere
    
- Stop throwing blindly
    

Eventually:

- You’ll want typed errors
    
- Then result types
    
- And maybe, someday, Effect
    

Just **do something**.

Don’t throw errors and hope for the best.

That only gets harder with time.

---







referred recommended {

thoe - about error handling different phases
https://www.youtube.com/watch?v=Y6jT-IkV0VM

}



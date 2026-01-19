





# Better Error Handling with Promises & Async/Await in JavaScript

Promises and `async/await` in JavaScript are powerful, but **error handling with `try/catch` or `.catch()` often leads to messy, fragile code**. Let’s look at why this happens and how to fix it using practical patterns.

---

## The Core Problem with `try/catch`

### Example scenario

- `getUser(id)` simulates an async API/database call
    
- Throws an error when `id === 2`
    
- Otherwise returns a user object
    

### The usual approach

```js
try {
  const user = await getUser(1)
  console.log(user)
} catch (e) {
  console.log("There was an error")
}
```

### Problems with this approach

#### 1. **Scope pollution**

All code that depends on `user` must live **inside the `try` block**, forcing nesting.

#### 2. **Over-catching**

Any error inside the `try` block is caught:

- typos
    
- logic bugs
    
- programming errors  
    Not just expected runtime errors (like a 404).
    

#### 3. **Awkward workarounds**

Using `let user;` outside the `try`:

- introduces mutability
    
- allows accidental reassignment
    
- weakens code clarity
    

👉 `try/catch` is **too broad** and **too invasive**.

---

## Solution 1: Tuple-Style Error Handling (Error-First Pattern)

Instead of throwing errors, **return them explicitly**.

### Helper function

```js
async function catchError(promise) {
  try {
    const data = await promise
    return [undefined, data]
  } catch (error) {
    return [error, undefined]
  }
}
```

### Usage

```js
const [error, user] = await catchError(getUser(1))

if (error) {
  console.log(error.message)
} else {
  console.log(user)
}
```

### Why this is better

✅ No nesting  
✅ Clear control flow  
✅ Only expected errors are handled  
✅ Unexpected bugs still crash loudly

This pattern is similar to:

- Go’s `(value, err)`
    
- Rust’s `Result`
    
- Gleam / Elixir style error handling
    

---

## Solution 2: Catch Only _Expected_ Error Types

Sometimes you **only want to handle specific errors** (e.g. 404), and let everything else crash.

### Custom error

```js
class CustomError extends Error {}
```

### Typed error handler

```js
async function catchErrorTyped(promise, errorTypes = []) {
  try {
    const data = await promise
    return [undefined, data]
  } catch (error) {
    if (
      errorTypes.length === 0 ||
      errorTypes.some(type => error instanceof type)
    ) {
      return [error, undefined]
    }
    throw error // unexpected error
  }
}
```

### Usage

```js
const [error, user] = await catchErrorTyped(
  getUser(2),
  [CustomError]
)
```

### Benefits

✅ Handles **only known, expected errors**  
✅ Unexpected errors still surface  
✅ Better type safety in TypeScript  
✅ Cleaner mental model

---

## Why TypeScript Can’t Fully Solve This

- TypeScript **cannot declare thrown error types**
    
- `throw` is invisible to the type system
    
- This will _never_ be added to TS
    

👉 So **patterns and libraries** are the only solution.

---

## Advanced Option: `effect` Library

If you want **first-class error types**:

- Every operation has:
    
    - success type
        
    - error type
        
- Errors are explicit, typed, and composable
    

⚠️ Downsides:

- Large
    
- Steep learning curve
    
- Overkill if you only want simple error handling
    

Use it when:

- building large systems
    
- modeling complex workflows
    
- coming from FP / backend backgrounds
    

---

## Key Takeaways (Important)

### 🔴 What NOT to do

- Don’t use exceptions for normal control flow
    
- Don’t wrap large blocks in `try/catch`
    
- Don’t silently catch unexpected bugs
    

### 🟢 What TO do

- Prefer **explicit error values**
    
- Catch **only expected errors**
    
- Let unexpected errors crash early
    
- Flatten control flow
    

---

## Big Picture Insight

> JavaScript exceptions are **zero-cost when unused**, but **high-cost and low-clarity when overused**.

This is why:

- FP languages avoid exceptions
    
- Rust, Gleam, Go prefer explicit results
    
- Advanced JS code moves away from `try/catch`
    

---



Great question — this is exactly the **right use-case** to compare  
**Exceptions vs Result pattern**, because your flow is **multi-step, dependent, and nested**.

I’ll give you **two full implementations** of the _same business logic_:

1. **Exception-driven flow** (throw / catch)
    
2. **Result-pattern flow** (`ok | err`, no throws)
    

Then I’ll **intentionally make the flow complex and nested** so the differences are obvious.

---

# 1️⃣ Exception-based flow (imperative, implicit failure)

This is close to what you already have.

### Characteristics

- Errors propagate _implicitly_
    
- Any missing data **explodes the stack**
    
- Control flow is simpler but **harder to reason about**
    
- Great for **“this should never happen”** cases
    

---

## Exception version (complex & nested)

```ts
// pricing-exceptions.ts

import {
  getCategoryDiscount,
  getCustomer,
  getProduct,
} from "./data-access";

interface Purchase {
  productId: number;
  customerId: number;
}

export const getProductPriceWithExceptions = ({
  productId,
  customerId,
}: Purchase) => {
  // ❌ throws if customer not found
  const customer = getCustomer(customerId);

  // ❌ throws if product not found
  const product = getProduct(productId);

  const basePrice = product.price;

  // nested decision tree
  let eliteDiscount = 0;
  if (customer.haveElitePass) {
    eliteDiscount = 0.05;
  }

  // ❌ throws if category discount missing
  const categoryDiscount =
    getCategoryDiscount(product.category).discount;

  const totalDiscount = eliteDiscount + categoryDiscount;

  if (totalDiscount > 0.5) {
    throw new Error("Discount exceeds allowed maximum");
  }

  const finalPrice = basePrice * (1 - totalDiscount);

  return {
    product: product.name,
    basePrice,
    eliteDiscount,
    categoryDiscount,
    finalPrice,
  };
};
```

### Usage

```ts
try {
  const price = getProductPriceWithExceptions({
    productId: 1,
    customerId: 99,
  });
  console.log(price);
} catch (err) {
  console.error("Pricing failed:", err);
}
```

### ❗ Problems (by design)

- You **don’t know what failed without reading stack traces**
    
- Errors jump across layers
    
- Impossible to compose safely (batch pricing, retries, etc.)
    

---

# 2️⃣ Result Pattern (explicit, composable, verbose)

Now let’s build a **Result system**.

---

## Result type

```ts
// result.ts

export type Ok<T> = { ok: true; value: T };
export type Err<E = string> = { ok: false; error: E };

export type Result<T, E = string> = Ok<T> | Err<E>;

export const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
export const err = <E>(error: E): Err<E> => ({ ok: false, error });
```

---

## Data-access (Result-based)

```ts
// data-access-result.ts

import { db } from "./db";
import type { Product, Customer, CategoryDiscount } from "./db-types";
import { Result, ok, err } from "./result";

export const getProductR = (
  productId: number
): Result<Product> => {
  const row = db
    .query<Product, [number]>(
      "SELECT * FROM products WHERE id = ?"
    )
    .get(productId);

  return row ? ok(row) : err("PRODUCT_NOT_FOUND");
};

export const getCustomerR = (
  customerId: number
): Result<Customer> => {
  const row = db
    .query<Customer, [number]>(
      "SELECT * FROM customers WHERE id = ?"
    )
    .get(customerId);

  return row ? ok(row) : err("CUSTOMER_NOT_FOUND");
};

export const getCategoryDiscountR = (
  category: string
): Result<CategoryDiscount> => {
  const row = db
    .query<CategoryDiscount, [string]>(
      "SELECT discount FROM category_discounts WHERE category = ?"
    )
    .get(category);

  return row
    ? ok(row)
    : err("CATEGORY_DISCOUNT_NOT_FOUND");
};
```

---

## Result-based pricing flow (nested & explicit)

```ts
// pricing-result.ts

import {
  getProductR,
  getCustomerR,
  getCategoryDiscountR,
} from "./data-access-result";
import { Result, ok, err } from "./result";

interface Purchase {
  productId: number;
  customerId: number;
}

export const getProductPriceWithResult = (
  purchase: Purchase
): Result<{
  product: string;
  basePrice: number;
  eliteDiscount: number;
  categoryDiscount: number;
  finalPrice: number;
}> => {
  const customerRes = getCustomerR(purchase.customerId);
  if (!customerRes.ok) {
    return err(customerRes.error);
  }

  const productRes = getProductR(purchase.productId);
  if (!productRes.ok) {
    return err(productRes.error);
  }

  const categoryRes = getCategoryDiscountR(
    productRes.value.category
  );
  if (!categoryRes.ok) {
    return err(categoryRes.error);
  }

  const basePrice = productRes.value.price;

  const eliteDiscount = customerRes.value.haveElitePass
    ? 0.05
    : 0;

  const totalDiscount =
    eliteDiscount + categoryRes.value.discount;

  if (totalDiscount > 0.5) {
    return err("DISCOUNT_TOO_HIGH");
  }

  const finalPrice = basePrice * (1 - totalDiscount);

  return ok({
    product: productRes.value.name,
    basePrice,
    eliteDiscount,
    categoryDiscount: categoryRes.value.discount,
    finalPrice,
  });
};
```

---

## Usage

```ts
const result = getProductPriceWithResult({
  productId: 1,
  customerId: 99,
});

if (!result.ok) {
  console.log("Pricing failed:", result.error);
} else {
  console.log("Pricing success:", result.value);
}
```

---

# 🔍 Side-by-side comparison

|Aspect|Exceptions|Result Pattern|
|---|---|---|
|Control flow|Implicit|Explicit|
|Error visibility|Hidden|Typed & visible|
|Composability|Poor|Excellent|
|Nested logic|Cleaner|Verbose|
|Batch processing|Painful|Easy|
|Functional style|❌|✅|
|API boundaries|Risky|Safe|

---

# 🧠 When to use what

### Use **exceptions** when:

- Programmer errors
    
- Impossible states
    
- Infrastructure failure (DB down)
    

### Use **Result pattern** when:

- Business rules
    
- Validation
    
- User input
    
- Expected failures
    
- You want predictable flows
    

---


mixed hard-fail + soft-fallback


---


```typescript
import type { GetPriceSchema, PriceDetails } from "../types";
import { getCategoryDiscount, getCustomer, getProduct } from "./data-access";

const safeGetCategoryDiscount = (category: string): number => {
  try {
    return getCategoryDiscount(category).discount;
  } catch (error) {
    // Soft fallback
    return 0;
  }
};

const validateDiscount = (discount: number) => {
  // Hard fails
  if (discount < 0 || discount > 0.5) {
    throw new Error(`Invalid total discount: ${discount}`);
  }
};

export const getProductPriceDetailsWithExceptions = ({
  productId,
  customerId,
}: GetPriceSchema): PriceDetails => {
  console.log("hello");
  // Hard fails
  const customer = getCustomer(customerId);
  const product = getProduct(productId);

  const basePrice = product.price;
  const eliteDiscount = customer.haveElitePass ? 0.05 : 0;
  const categoryDiscount = safeGetCategoryDiscount(product.category);
  const totalDiscount = eliteDiscount + categoryDiscount;
  validateDiscount(totalDiscount);

  const discountedPrice = basePrice * totalDiscount;
  const finalPrice = basePrice - discountedPrice;

  return {
    product: product.name,
    basePrice,
    discountedPrice,
    finalPrice,
  };
};

```




```typescript
import type { GetPriceSchema, PriceDetails } from "../types";
import {
  getCategoryResult,
  getCustomerResult,
  getProductResult,
} from "./data-access";
import { type Result, ok, err } from "./result";

const validateDiscountResult = (discount: number): Result<void> => {
  if (discount < 0 || discount > 0.5) {
    return err(`Invalid total discount: ${discount}`);
  }
  return ok(undefined);
};

export const getProductPriceDetailsWithResult = (
  purchase: GetPriceSchema,
): Result<PriceDetails> => {
  const customerResult = getCustomerResult(purchase.customerId);
  if (!customerResult.ok) return err(customerResult.error);

  const productResult = getProductResult(purchase.productId);
  if (!productResult.ok) return err(productResult.error);

  const categoryResult = getCategoryResult(productResult.value.category);
  const categoryDiscount = categoryResult.ok
    ? categoryResult.value.discount
    : 0;

  const basePrice = productResult.value.price;
  const eliteDiscount = customerResult.value.haveElitePass ? 0.05 : 0;
  const totalDiscount = eliteDiscount + categoryDiscount;

  const discountValidation = validateDiscountResult(totalDiscount);
  if (!discountValidation.ok) {
    return err(discountValidation.error);
  }

  const discountedPrice = basePrice * totalDiscount;
  const finalPrice = basePrice - discountedPrice;

  return ok({
    product: productResult.value.name,
    basePrice,
    discountedPrice,
    finalPrice,
  });
};

```



---




---

# TypeScript Error Handling Is Broken — Here’s the Spectrum of Fixes

I’m working on a lot of different projects right now. They don’t overlap much in purpose, but they _all_ share one thing in common:

They’re written in **TypeScript**.

And because of that, they all share the same frustration.

---

## The Core Problem: TypeScript Doesn’t Care About Errors

TypeScript is excellent at typing **data**.  
It is **terrible** at typing **failure**.

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

This function throws **half the time**, but the type system has **no way to express that**.  
Unless you’ve read every line of code (and everything it calls), you have no idea what can fail.

Errors in TypeScript are:

- Untyped
- Implicit
- Invisible in function signatures
- Easy to forget
- Easy to mishandle


This is how bugs sneak into production.

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

But this falls apart almost immediately.

---

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

You’re forced to either:

- Push all logic into the `try` block
    
- Duplicate logic
    
- Or lie to the type system
    

None of these scale.

---

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

Humans do not think this way.

This code is:

- Hard to read
    
- Easy to break
    
- Nearly impossible to refactor safely
    

---

### Problem 3: Rethrowing Loses Context

As errors bubble through layers of `catch`, you lose:

- Where the error originated
    
- What kind of failure it was
    
- What the caller should actually do
    

This pattern does not scale beyond trivial programs.

---

## The Bare-Minimum Fix: A Try/Catch Wrapper

After fighting this long enough, I wrote a tiny helper.

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

// data is now guaranteed to exist
console.log(data);
```

---

### Why This Is Better

- No nested control flow
    
- No invisible error paths
    
- Errors are explicit
    
- Types narrow _after_ error handling
    

```ts
// Before check
data: number | null

// After check
data: number
```

This is **objectively safer** than raw `try/catch`.

This isn’t an opinion.  
It simply describes reality more accurately.

---

## But This Is Still the Bare Minimum

This wrapper:

- Catches _everything_
    
- Flattens all failures into `Error`
    
- Loses error intent and meaning
    

Once your app has **layers**, this starts breaking down.

---


## `catchErrorTyped` — Catch Only Expected Errors

This function:

- Flattens async error handling
    
- Preserves typing
    
- **Only catches errors you explicitly allow**
    
- Rethrows unexpected errors (the important part)
    

### The Function

```ts
type Constructor<T> = new (...args: any[]) => T;

async function catchErrorTyped<T, E extends Error>(
  promise: Promise<T>,
  errorsToCatch?: Constructor<E>[]
): Promise<[E | undefined, T | undefined]> {
  try {
    const data = await promise;
    return [undefined, data];
  } catch (err) {
    if (!errorsToCatch) {
      return [err as E, undefined];
    }

    if (
      err instanceof Error &&
      errorsToCatch.some((ErrorType) => err instanceof ErrorType)
    ) {
      return [err as E, undefined];
    }

    // Unexpected error → crash loudly
    throw err;
  }
}
```

---

## Custom Error Example

```ts
class NotFoundError extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "NotFoundError";
  }
}
```

---

## Usage: Catch Only What You Expect

```ts
const [error, user] = await catchErrorTyped(
  getUser(2),
  [NotFoundError]
);

if (error) {
  console.log(error.message); // typed as NotFoundError
  return;
}

// user is fully typed here
console.log(user.name);
```

---

## What This Solves (Compared to `try/catch`)

✅ No nesting  
✅ No scope issues  
✅ No catching unrelated bugs  
✅ Typed, intentional failures  
✅ Unexpected errors still explode (GOOD)

This directly addresses the **biggest flaw of `try/catch`**:

> It catches _everything_, including bugs you never meant to handle.

---

## How This Fits the Error-Handling Spectrum

- `try/catch` → blind and unsafe
    
- `catchError` → explicit but untyped
    
- `catchErrorTyped` → **typed, selective, incremental**
    
- `Result / Effect` → full correctness model
    


Here’s a **crisp, step-by-step progression using the _same problem_** so the differences are obvious and comparable.  
One example, four approaches, **zero fluff**.

---



## Enter Result Types (aka: “Never Throw”)

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

---

### Why This Scales

- Errors are typed
    
- Exhaustive handling is possible
    
- You cannot ignore failure
    
- You always know **what went wrong**
    

This is what libraries like **`neverthrow`** formalize.

For layered systems, this is a _huge_ win.

---

## Where Neverthrow Starts to Hurt

Async composition.

```ts
const result = await getRateLimiter();
// Result<Limiter, Error>

if (result.isErr()) return result.error;
```

As chains grow, you need:

- `map`
    
- `andThen`
    
- Explicit unwrapping everywhere
    

It works — but it gets noisy.

Additionally:

- You end up writing return types everywhere
    
- TypeScript allows return-type lies
    
- Ergonomics degrade as complexity increases
    

It’s a strong middle ground, but not frictionless.

---

## Effect: The Nuclear Option

Effect solves **all** of the above.

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
    

---

### The Cost

- Entire mental model shift
    
- New runtime
    
- New primitives
    
- New composition style
    
- Your whole codebase must opt in
    

Effect is **React**, not jQuery.  
It wants to be the _root_ of your application.

When you commit fully, it’s incredible.

But it is **not incremental**.

---

## The Spectrum (This Is the Important Part)

Think of error handling as a progression:

### 1. Try/Catch

You’re not really thinking about errors.

### 2. Try/Catch Wrapper

You acknowledge errors exist.

### 3. Result Types / Neverthrow

You model failure explicitly.

### 4. Effect

You want correctness above all else.

There is no universal “right” answer.

But **doing nothing is wrong**.

---

## A Missing but Important Note: `unknown` and Boundaries

Two practical additions worth calling out:

### Caught errors should be `unknown`

```ts
catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}
```

This forces honesty and prevents unsafe assumptions.

### UI and service boundaries still matter

Not every error needs to be typed to infinity.  
Boundaries are where you translate _technical failure_ into _human meaning_.

---

## The Goal Isn’t Effect — It’s Thinking About Errors

Effect users don’t care if you use Effect.  
They care that you stop pretending failure doesn’t exist.

As codebases grow:

- APIs multiply
    
- Failure modes explode
    
- Debugging becomes archaeology
    

If your code does not _describe_ failure, it will eventually fail you.

---

## Final Advice

If this feels overwhelming:

- Copy the try/catch wrapper
    
- Use it consistently
    
- Stop throwing blindly
    

Over time:

- You’ll want typed errors
    
- Then result types
    
- And maybe, someday, Effect
    

Just **do something**.

Because throwing errors and hoping for the best  
only gets harder with time.

---


---
---
---



# Error Handling Spectrum — Same Problem, Better Models

### Problem

Fetch a user.  
User `id = 2` does not exist.

```ts
async function getUser(id: number) {
  if (id === 2) {
    throw new Error("User not found");
  }
  return { id, name: "Kyle" };
}
```

---

## 1️⃣ `try/catch` → _Blind & Unsafe_

```ts
try {
  const user = await getUser(2);
  console.log(user.name);
} catch (err) {
  console.log("Something went wrong");
}
```

### What’s wrong

- Catches **everything**
    
- Error type is `unknown`
    
- Logic must live inside `try`
    
- Bugs ≠ expected failures
    

❌ No typing  
❌ No intent  
❌ No scale

---

## 2️⃣ `catchError` → _Explicit but Untyped_

```ts
async function catchError<T>(
  promise: Promise<T>
): Promise<[Error | undefined, T | undefined]> {
  try {
    return [undefined, await promise];
  } catch (err) {
    return [err as Error, undefined];
  }
}
```

Usage:

```ts
const [error, user] = await catchError(getUser(2));

if (error) {
  console.log(error.message);
  return;
}

console.log(user.name);
```

### Improvement

- No nesting
    
- Explicit error handling
    
- Safer control flow
    

### Still broken

- All errors look the same
    
- Unexpected bugs are swallowed
    

⚠️ Better, but still coarse

---

## 3️⃣ `catchErrorTyped` → _Typed, Selective, Incremental_

### Custom error

```ts
class UserNotFoundError extends Error {}
```

```ts
async function getUser(id: number) {
  if (id === 2) {
    throw new UserNotFoundError("User not found");
  }
  return { id, name: "Kyle" };
}
```

### Typed catcher

```ts
const [error, user] = await catchErrorTyped(
  getUser(2),
  [UserNotFoundError]
);
```

```ts
if (error) {
  // error is UserNotFoundError
  console.log(error.message);
  return;
}

console.log(user.name);
```

### Why this is powerful

- Only **expected** errors are handled
    
- Unexpected errors **crash**
    
- Error type is known
    
- Works incrementally
    

✅ Typed  
✅ Intentional  
✅ Safe

---

## 4️⃣ `Result / Effect` → _Full Correctness Model_

### Result type

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

```ts
function getUser(id: number): Result<
  { id: number; name: string },
  "USER_NOT_FOUND"
> {
  if (id === 2) {
    return { ok: false, error: "USER_NOT_FOUND" };
  }

  return { ok: true, value: { id, name: "Kyle" } };
}
```

Usage:

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

### What you gain

- Errors are **part of the type**
    
- Impossible to forget handling
    
- Exhaustive checking
    
- Zero `try/catch`
    

Effect goes further:

- Async composition
    
- Automatic propagation
    
- No throwing at all
    

💥 Maximum safety  
💥 Maximum structure  
💥 Maximum buy-in

---

## Summary Table

|Step|Approach|Error Visibility|Safety|Complexity|
|---|---|---|---|---|
|1|try/catch|Invisible|❌|Low|
|2|catchError|Explicit|⚠️|Low|
|3|catchErrorTyped|Typed & selective|✅|Medium|
|4|Result / Effect|First-class|🔒|High|

---

## Final Takeaway

You don’t jump straight to Effect.

You **grow into it**:

1. Stop hiding errors
    
2. Make them explicit
    
3. Type the ones you expect
    
4. Model failure as data
    

**The real upgrade isn’t Effect — it’s intent.**


---
---
---


Short answer: **No — `neverthrow` does not have a built-in `catchErrorTyped` helper**, _but it already solves the same problem in a cleaner, more principled way_.

Let me explain clearly 👇

---

## What `neverthrow` does instead

`neverthrow` **eliminates exceptions as a control-flow mechanism** and replaces them with:

- `Result<T, E>`
    
- `ResultAsync<T, E>`
    

This means:

- Errors are **explicit**
    
- Error types are **part of the type system**
    
- You _don’t need_ `try/catch` or `catchErrorTyped`
    

---

## Equivalent of `catchErrorTyped` in `neverthrow`

### 1️⃣ Catching async errors

Instead of:

```ts
const [error, data] = await catchErrorTyped(promise, [CustomError])
```

You do this:

```ts
import { ResultAsync } from "neverthrow"

const result = ResultAsync.fromPromise(
  getUser(2),
  (e) => e as CustomError
)
```

Now the type is:

```ts
ResultAsync<User, CustomError>
```

---

### 2️⃣ Handling only specific error types

```ts
result.match(
  (user) => {
    console.log(user)
  },
  (error) => {
    if (error instanceof CustomError) {
      console.log(error.message)
    }
  }
)
```

Or with chaining:

```ts
result
  .map(user => user.name)
  .mapErr(err => {
    if (err instanceof CustomError) {
      return err
    }
    throw err // truly unexpected
  })
```

---

## Built-in helpers that replace `catchErrorTyped`

|neverthrow feature|Replaces|
|---|---|
|`ResultAsync.fromPromise`|`try/catch`|
|`fromThrowable`|typed sync error catching|
|`mapErr`|selective error handling|
|`match`|`if (error)` branching|
|`safeTry`|scoped error propagation|

Example with `fromThrowable`:

```ts
const safeFn = fromThrowable(
  () => riskyFunction(),
  (e) => e as CustomError
)
```

---

## Why `neverthrow` doesn’t need `catchErrorTyped`

Your `catchErrorTyped` exists because:

- JS exceptions are untyped
    
- TypeScript can’t track `throw`
    

`neverthrow` fixes this by:

- **never throwing**
    
- encoding errors in the type system
    
- forcing you to handle them explicitly
    

👉 So adding `catchErrorTyped` would be **working against its design philosophy**.

---

## Mental model comparison

### `catchErrorTyped`

- Wraps exceptions
    
- Still relies on `throw`
    
- Partial type safety
    

### `neverthrow`

- No exceptions
    
- Full type safety
    
- FP-style error composition
    
- Scales better in large codebases
    

---

## Bottom line

> **`neverthrow` doesn’t have `catchErrorTyped` because it makes it unnecessary.**

If you like:

- explicit errors
    
- Gleam / Rust-style handling
    
- predictable control flow
    


---
---
---

# TypeScript Error Handling Is Fundamentally Broken

## And the Spectrum of Fixes That Actually Work

I’m working on a lot of different projects right now. They don’t overlap much in what they do—but they all share one thing:

They’re written in **TypeScript**.

And because of that, they all share the same frustration.

## TypeScript Does Not Care About Errors

TypeScript is excellent at typing **data**.  
It is remarkably bad at typing **failure**.

If you call a function in TypeScript:

- It might succeed
    
- It might throw
    
- It might throw sometimes
    
- It might throw deep inside something else
    

And the type system tells you **nothing**.

Unless you’ve read every line of code the function touches (and everything it calls), you have no idea what can fail.

Errors are:

- Untyped
    
- Implicit
    
- Invisible in function signatures
    
- Easy to forget
    
- Easy to mishandle
    

This is not a small problem.  
This is how production bugs happen.

---

## Why `try/catch` Is a Bad Default

`try/catch` is usually the first solution people reach for.

And it immediately breaks down.

### Problem 1: Scope Pollution

Once you wrap logic in a `try`, everything that depends on it must live there too.

That forces:

- Deep indentation
    
- Artificial variable hoisting
    
- Or lying to the type system
    

Humans don’t think in nested blocks.

---

### Problem 2: It Catches Too Much

`try/catch` does not distinguish between:

- Expected failures (404, validation, auth)
    
- Actual bugs (typos, undefined access, logic errors)
    

A typo and a real failure look identical.

That is dangerous.

---

### Problem 3: Error Context Evaporates

As errors bubble up through multiple `catch` blocks:

- Context is lost
    
- Intent is lost
    
- Meaning is lost
    

You end up with code that _handles errors_ but does not **understand them**.

---

## The Bare-Minimum Fix: A `try/catch` Wrapper

Instead of catching errors inline, flatten them.

A small helper function:

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

// data is now safely typed
console.log(data);
```

### Why This Is Better

- No nested blocks
    
- Explicit error handling
    
- Control flow is visible
    
- Types narrow naturally after checks
    

This is **objectively safer** than raw `try/catch`.

---

## But This Is Still the Bare Minimum

This approach still has limits:

- All errors look the same
    
- Error intent is lost
    
- Unexpected bugs are silently handled
    
- Error specificity disappears across layers
    

It works best for **single-layer async calls**.

Once your system grows, it starts to hurt.

---

## Typed Error Catching: Handling Only What You Expect

Instead of catching _everything_, catch **only known error types**.

```ts
class UserNotFoundError extends Error {}
```

```ts
const [error, user] = await catchErrorTyped(
  getUser(2),
  [UserNotFoundError]
);
```

Now:

- Expected errors are handled
    
- Unexpected errors crash loudly (good)
    
- Error types are preserved
    
- The system becomes intentional
    

This is the **last stop before result types**.

---

## Neverthrow: Modeling Errors as Data

At some point, you realize:

> Errors shouldn’t be thrown.  
> They should be **returned**.

That’s the core idea behind **result types**.

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Now every function explicitly declares:

- What success looks like
    
- What failure looks like
    

You cannot forget to handle errors.  
You cannot mis-handle them accidentally.  
You get exhaustive checking for free.

This is powerful—especially in layered systems.

### Where Neverthrow Hurts

- Async composition is noisy
    
- Requires explicit unwrapping (`andThen`, `map`)
    
- Forces return types everywhere
    
- Ergonomics degrade as complexity grows
    

It’s a **strong middle ground**, but not perfect.

---

## Effect: The Nuclear Option

Effect solves everything above.

But let’s be clear:

> Effect is not just a library.  
> Effect is a **language**.

```ts
const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail("Divide by zero")
    : Effect.succeed(a / b);
```

With Effect:

- Errors are fully typed
    
- Composition is automatic
    
- Failures propagate safely
    
- Nothing throws
    

### The Cost

- New mental model
    
- New runtime
    
- New primitives
    
- Whole codebase buy-in
    

Effect is like React.

It works best when it is the **root of your application**, not a small utility you sprinkle in.

---

## The Real Spectrum (This Matters)

Think about error handling as a progression:

1. **try/catch**  
    You’re barely thinking about errors.
    
2. **try/catch wrapper**  
    Errors are explicit.
    
3. **Typed catch / Neverthrow**  
    Errors are modeled and intentional.
    
4. **Effect**  
    Errors are impossible to ignore.
    

There is no single “correct” solution.

But **doing nothing is wrong**.

---

## The Goal Is Not Effect

## The Goal Is Thinking About Errors

Effect users don’t care if you use Effect.

They care that you stop pretending errors don’t exist.

As codebases grow:

- APIs multiply
    
- Failure modes explode
    
- Debugging becomes harder
    

If your code does not _describe failure_, it will eventually fail you.

---

## Final Advice

If this all feels overwhelming:

- Copy the `tryCatch` helper
    
- Use it everywhere
    
- Stop throwing blindly
    

Eventually:

- You’ll want typed errors
    
- Then result types
    
- And maybe—one day—Effect
    

Just **do something**.

Errors don’t get easier with time.


---

# TypeScript Error Handling Is Fundamentally Broken

## And the Spectrum of Fixes That Actually Work

I’m working on a lot of different projects right now. They don’t overlap much in what they do—but they all share one thing:

They’re written in **TypeScript**.

And because of that, they all share the same frustration.

## TypeScript Does Not Care About Errors

TypeScript is excellent at typing **data**.  
It is remarkably bad at typing **failure**.

If you call a function in TypeScript:

- It might succeed
    
- It might throw
    
- It might throw sometimes
    
- It might throw deep inside something else
    

And the type system tells you **nothing**.

Unless you’ve read every line of code the function touches (and everything it calls), you have no idea what can fail.

Errors are:

- Untyped
    
- Implicit
    
- Invisible in function signatures
    
- Easy to forget
    
- Easy to mishandle
    

This is not a small problem.  
This is how production bugs happen.

---

## Why `try/catch` Is a Bad Default

`try/catch` is usually the first solution people reach for.

And it immediately breaks down.

### Problem 1: Scope Pollution

Once you wrap logic in a `try`, everything that depends on it must live there too.

That forces:

- Deep indentation
    
- Artificial variable hoisting
    
- Or lying to the type system
    

Humans don’t think in nested blocks.

---

### Problem 2: It Catches Too Much

`try/catch` does not distinguish between:

- Expected failures (404, validation, auth)
    
- Actual bugs (typos, undefined access, logic errors)
    

A typo and a real failure look identical.

That is dangerous.

---

### Problem 3: Error Context Evaporates

As errors bubble up through multiple `catch` blocks:

- Context is lost
    
- Intent is lost
    
- Meaning is lost
    

You end up with code that _handles errors_ but does not **understand them**.

---

## The Bare-Minimum Fix: A `try/catch` Wrapper

Instead of catching errors inline, flatten them.

A small helper function:

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

// data is now safely typed
console.log(data);
```

### Why This Is Better

- No nested blocks
    
- Explicit error handling
    
- Control flow is visible
    
- Types narrow naturally after checks
    

This is **objectively safer** than raw `try/catch`.

---

## But This Is Still the Bare Minimum

This approach still has limits:

- All errors look the same
    
- Error intent is lost
    
- Unexpected bugs are silently handled
    
- Error specificity disappears across layers
    

It works best for **single-layer async calls**.

Once your system grows, it starts to hurt.

---

## Typed Error Catching: Handling Only What You Expect

Instead of catching _everything_, catch **only known error types**.

```ts
class UserNotFoundError extends Error {}
```

```ts
const [error, user] = await catchErrorTyped(
  getUser(2),
  [UserNotFoundError]
);
```

Now:

- Expected errors are handled
    
- Unexpected errors crash loudly (good)
    
- Error types are preserved
    
- The system becomes intentional
    

This is the **last stop before result types**.

---

## Neverthrow: Modeling Errors as Data

At some point, you realize:

> Errors shouldn’t be thrown.  
> They should be **returned**.

That’s the core idea behind **result types**.

```ts
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

Now every function explicitly declares:

- What success looks like
    
- What failure looks like
    

You cannot forget to handle errors.  
You cannot mis-handle them accidentally.  
You get exhaustive checking for free.

This is powerful—especially in layered systems.

### Where Neverthrow Hurts

- Async composition is noisy
    
- Requires explicit unwrapping (`andThen`, `map`)
    
- Forces return types everywhere
    
- Ergonomics degrade as complexity grows
    

It’s a **strong middle ground**, but not perfect.

---

## Effect: The Nuclear Option

Effect solves everything above.

But let’s be clear:

> Effect is not just a library.  
> Effect is a **language**.

```ts
const divide = (a: number, b: number) =>
  b === 0
    ? Effect.fail("Divide by zero")
    : Effect.succeed(a / b);
```

With Effect:

- Errors are fully typed
    
- Composition is automatic
    
- Failures propagate safely
    
- Nothing throws
    

### The Cost

- New mental model
    
- New runtime
    
- New primitives
    
- Whole codebase buy-in
    

Effect is like React.

It works best when it is the **root of your application**, not a small utility you sprinkle in.

---

## The Real Spectrum (This Matters)

Think about error handling as a progression:

1. **try/catch**  
    You’re barely thinking about errors.
    
2. **try/catch wrapper**  
    Errors are explicit.
    
3. **Typed catch / Neverthrow**  
    Errors are modeled and intentional.
    
4. **Effect**  
    Errors are impossible to ignore.
    

There is no single “correct” solution.

But **doing nothing is wrong**.

---

## The Goal Is Not Effect

## The Goal Is Thinking About Errors

Effect users don’t care if you use Effect.

They care that you stop pretending errors don’t exist.

As codebases grow:

- APIs multiply
    
- Failure modes explode
    
- Debugging becomes harder
    

If your code does not _describe failure_, it will eventually fail you.

---

## Final Advice

If this all feels overwhelming:

- Copy the `tryCatch` helper
    
- Use it everywhere
    
- Stop throwing blindly
    

Eventually:

- You’ll want typed errors
    
- Then result types
    
- And maybe—one day—Effect
    

Just **do something**.

Errors don’t get easier with time.

---
---
---









Reffered {

Recommended. {

[No TryCatch @Kayal](https://youtu.be/AdmGHwvgaVs)

[NoErrorHandlingInTS @Theo](https://youtu.be/Y6jT-IkV0VM?si=QuCLEp01gp7ivfyD)

}

}



To check {


Exception vs Error @Primeagen
https://youtu.be/sS6u5UU3t3c?si=h7uR9eq1vjh7yHtJ

}

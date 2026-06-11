




When you handle errors in JavaScript/TypeScript (especially in Node.js or frontend code), you typically have these main options:

---

# 🟢 **1️⃣ `try...catch`**

### When?

- Used to catch errors **synchronously**, or when using `await` inside an `async` function.
    

### Example

```js
async function getData() {
  try {
    const result = await fetchData();
    console.log(result);
  } catch (err) {
    console.error('Caught error in try...catch:', err);
  }
}
```

### Key points

✅ Easy to read and understand.  
✅ Works well when using `await`.  
⚠️ Only works inside `async` functions for `await`. Outside, it only catches synchronous errors.

---

# 🟡 **2️⃣ `.catch()` on a Promise**

### When?

- Used to catch errors directly on a **Promise chain**.
    

### Example

```js
fetchData()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error('Caught error in .catch():', err);
  });
```

### Key points

✅ Good for chaining promises.  
✅ Works even if you don’t use `async/await`.  
⚠️ Can get messy if you have long or nested chains.

---

# 🔵 **3️⃣ `.catch()` + `await` hybrid**

### Example

```js
const result = await fetchData().catch((err) => {
  console.error('Error in .catch with await:', err);
  return null; // Optional: return fallback
});
```

### Key points

✅ Useful if you want to handle the error **immediately inline** without `try...catch`.  
⚠️ Must remember that after `.catch()`, the code continues executing (no thrown error unless you explicitly rethrow).

---

# 🔴 **4️⃣ Using `.then(onSuccess, onError)`**

### Example

```js
fetchData()
  .then(
    (result) => {
      console.log(result);
    },
    (err) => {
      console.error('Error caught as second argument to then:', err);
    }
  );
```

### Key points

⚠️ Less common and less readable.  
⚠️ Can lead to subtle bugs if you forget about the second parameter.

---

# 🟣 **5️⃣ Global `unhandledRejection`**

If a Promise is not caught anywhere, Node.js will emit an `unhandledRejection` event.

```js
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
```

---

# ✅ **Summary table**

|Method|Works with async/await?|Works with Promise chains?|Stops execution on error?|Common?|
|---|---|---|---|---|
|try...catch|✅|❌ (only synchronous otherwise)|✅|Very common|
|.catch()|✅|✅|❌ (continues)|Very common|
|.then(, onError)|✅|✅|❌ (continues)|Less common|
|Global rejection|N/A|N/A|N/A|Only fallback|

---

# 💬 **My advice?**

✅ Use **`try...catch`** inside `async` functions — most readable and idiomatic.  
✅ Use **`.catch()`** for pure Promise chains (no `async/await`).  
✅ Use `.catch()` with `await` only if you want to handle it inline and not throw further.

---


When you use **`.catch()`** after a `Promise`, you can access the error object, but **JavaScript does not have native typed errors** (unlike some other languages like Java, C#, or Rust).

However! In **TypeScript**, you can **narrow or cast the error type** yourself.

---

# 💡 Example: `.catch()` with error type narrowing

```ts
async function fetchData() {
  throw new Error("Network error");
}

fetchData()
  .then((result) => {
    console.log("Result:", result);
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error("Error message:", err.message);
    } else {
      console.error("Unknown error", err);
    }
  });
```

---

# ✅ Using `.catch()` with `await`

You can also do this style:

```ts
const result = await fetchData().catch((err: unknown) => {
  if (err instanceof Error) {
    console.error("Typed error in await .catch:", err.message);
  } else {
    console.error("Unknown error:", err);
  }
  return null; // fallback value
});
```

---

# 💥 Why `unknown` type?

In TypeScript, it's best practice to type `catch` errors as `unknown` (instead of `any`), because **any thrown value can technically be anything** — not always an `Error` object.

```ts
try {
  await fetchData();
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error("Typed error:", err.message);
  } else {
    console.error("Non-error thrown:", err);
  }
}
```

---

# ✅ Can you specify error types in `.catch()` directly?

Not exactly in a "typed" way like:

```ts
.catch<MyCustomError>((err) => { ... }) // ❌ not valid TypeScript
```

You can **narrow inside the function**, but you cannot force `.catch()` to only accept certain types at compile time.

---

# 💬 **Summary**

|✅ You can|❌ You cannot|
|---|---|
|Narrow type inside `.catch()` callback using `instanceof` or type guards.|Enforce a strict error type at the signature level of `.catch()` directly.|
|Use `unknown` for safer error typing.|Have compile-time checked error types in JS/TS without manual checks.|

---



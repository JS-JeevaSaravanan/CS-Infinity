
Sure! Here's a concise and developer-friendly article on how to detect if a JavaScript method is self-invoked (i.e., recursively called itself):

---

# 🔄 How to Tell if a JavaScript Function Is Self-Invoked (Recursive Call)

In JavaScript, functions can call themselves recursively—this is known as **self-invocation**. But what if you want to detect _within a function_ whether it's currently being called recursively?

JavaScript doesn't provide a built-in way to do this directly, but here are a few approaches—ranging from practical to experimental.

---

## ✅ 1. The Cleanest Way: Use an Internal Flag

The most straightforward and reliable way is to pass an **internal flag** or state to your function, indicating whether it's a retry or recursive call.

```js
function doSomething(params, _isRetry = false) {
  if (_isRetry) {
    console.log('This is a recursive call!');
  }

  try {
    // perform operation
  } catch (e) {
    if (!_isRetry) {
      return doSomething(params, true); // self-invoked
    }
    throw e;
  }
}
```

This keeps your logic clean, testable, and explicit.

---

## ⚙️ 2. Using a Call Stack Check (Hacky)

You can throw an `Error` to inspect the call stack and count how many times the function name appears.

```js
function isSelfInvoked() {
  const stack = new Error().stack;
  const occurrences = (stack.match(/isSelfInvoked/g) || []).length;
  return occurrences > 1;
}

function doSomething() {
  if (isSelfInvoked()) {
    console.log('Self-invoked!');
  }
  // recursive call for demonstration
  // doSomething(); 
}
```

🧨 **Caution**: This is brittle and depends on the JS engine. Not safe for production.

---

## 🧠 3. Use a Scoped Tracker (e.g. Set)

You can use a `Set` to track "in-progress" calls and detect re-entrancy based on parameters.

```js
const callTracker = new Set();

function doSomething(id) {
  if (callTracker.has(id)) {
    console.log(`Already processing ${id}, skipping recursion.`);
    return;
  }

  callTracker.add(id);
  try {
    // logic
    // doSomething(id); // recursive call
  } finally {
    callTracker.delete(id);
  }
}
```

✅ This is useful when dealing with async logic or when you don’t want to modify the method signature.

---

## 🚫 What About `arguments.callee`?

In strict mode (which is default in ES6 modules and modern tools), `arguments.callee` is **not allowed**. So avoid relying on it.

---

## 🧾 Summary

|Approach|Pros|Cons|
|---|---|---|
|Internal Flag|Simple, explicit|Slightly pollutes signature|
|Call Stack|Fun for debugging|Fragile, slow, unreliable|
|Tracker Set|Great for async logic|Needs key tracking|
|`arguments.callee`|Deprecated|Forbidden in strict mode|

When in doubt, **explicit is better than clever**. Use an internal flag or a scoped tracker for the most maintainable solution.



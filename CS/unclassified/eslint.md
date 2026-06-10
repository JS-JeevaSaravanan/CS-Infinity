
### ✅ **ESLint Rule for This:**

```json
"no-floating-promises": "error"
```

This rule ensures that **promises are handled properly**, i.e., either `await`ed or explicitly `.then()`/`.catch()` chained.

---

### 📦 **How to Set It Up**

#### 1. **Install the ESLint plugin for promises (if using TypeScript):**

```bash
pnpm add -D eslint-plugin-promise
```

Or for strict TypeScript checking:

```bash
pnpm add -D @typescript-eslint/eslint-plugin
```

#### 2. **Enable the rule in your `.eslintrc` config:**

For **TypeScript**, use:

```json
{
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

For plain JS with promises:

```json
{
  "plugins": ["promise"],
  "rules": {
    "promise/no-floating-promises": "error"
  }
}
```

---

### 🧠 What It Catches

```ts
async function fetchData() {
  return "data";
}

function test() {
  fetchData(); // ❌ ESLint error: floating promise
}
```

✅ Fix by either:

```ts
await fetchData();
// or
fetchData().then(data => ...);
```

---

### 👀 Bonus: Strict Mode in TypeScript

If you're using **TypeScript**, setting `"strict": true` in `tsconfig.json` helps make async-related issues more visible in general, especially with return types and error handling.

---











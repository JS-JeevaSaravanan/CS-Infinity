

# 🧰 Terminal & Bun Tooling — Core Learning Summary

This document covers **essential Bun tooling**, **terminal commands**, **TypeScript + browser/server boundaries**, and **testing & coverage fundamentals**. Below is a **clear, structured breakdown** of the most important ideas.

---

## 1️⃣ Istanbul-Style Ignore (Code Coverage Control)

### What it is

**Istanbul** is a JavaScript code coverage tool.  
“Istanbul-style ignore” comments tell coverage tools to **skip specific code paths**.

### Common Ignore Comments

```ts
/* istanbul ignore next */   // ignore next statement
/* istanbul ignore if */     // ignore if block
/* istanbul ignore else */   // ignore else block
/* istanbul ignore file */  // ignore entire file
```

### Why it matters

- Avoids false negatives in coverage
    
- Skips:
    
    - defensive code
        
    - environment-specific branches
        
    - unreachable fallback logic
        

✅ **Bun supports Istanbul-style ignores natively**

---

## 2️⃣ Bun Installation & Verification (Terminal)

### Check if Bun is installed

```bash
bun --version
```

### Locate Bun binary

```bash
which bun   # macOS/Linux
where bun   # Windows
```

### Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

📌 Bun includes:

- package manager
    
- test runner
    
- transpiler
    
- runtime
    

---

## 3️⃣ File & Directory Deletion (macOS Terminal)

### Delete a file

```bash
rm file.txt
```

### Delete empty directory

```bash
rmdir folder
```

### Delete directory recursively

```bash
rm -r folder
```

### Force delete (⚠️ dangerous)

```bash
rm -rf folder
```

### Safe habit

```bash
ls folder
```

📌 Common Bun cleanup:

```bash
rm -rf node_modules
rm bun.lockb
```

---

## 4️⃣ UTF-8 Encoding & Emoji Issues

### Problem

Emoji shows as `ðŸŽ‰` → **wrong character encoding**

### Fix (HTML)

```html
<meta charset="UTF-8">
```

### Backend best practice

```ts
headers: {
  "Content-Type": "text/html; charset=UTF-8"
}
```

### Why this matters

- Browsers may “guess” encoding
    
- APIs, logs, curl, Postman do NOT guess reliably
    
- JWT error messages often include Unicode
    

📌 **Rule**: Always define encoding at the HTTP layer.

---

## 5️⃣ TypeScript: Browser vs Server Environments

### Error

```ts
Cannot find name 'document'
```

### Cause

TypeScript defaults to **server environment**  
Browser globals are NOT included unless specified.

### Fix (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM"]
  }
}
```

### Key Insight

> TypeScript types depend on **runtime environment**

|Environment|document|
|---|---|
|Browser|✅|
|Bun/Node|❌|

📌 Later → split configs (`tsconfig.server.json`, `tsconfig.client.json`)

---

## 6️⃣ Transpiler (Critical Concept)

### What it does

**Transpiler converts TypeScript → JavaScript**

- Removes types
    
- Preserves logic
    
- Browser never sees TS
    

### Bun Advantage

Bun has a **built-in transpiler**:

- No Babel
    
- No ts-node
    
- No bundler required
    

### Mental Model

- TypeScript → blueprint
    
- JavaScript → building
    
- Transpiler → construction crew
    

---

## 7️⃣ Async / Await Return Semantics

### Why this works

```ts
async function handler() {
  return new Response("OK");
}
```

Because:

```ts
return X;
```

becomes:

```ts
return Promise.resolve(X);
```

### Rule

- `return value` → resolves Promise
    
- `throw error` → rejects Promise
    

📌 This is **intended JavaScript behavior**, not magic.

---

## 8️⃣ Bun Testing & Coverage

### Run tests with coverage

```bash
bun test --coverage
```

### Generate coverage files

```bash
bun test --coverage --coverage-reporter=lcov
```

### Exclude code from coverage

```ts
/* istanbul ignore file */
/* istanbul ignore next */
```

### Coverage priorities

|Area|Target|
|---|---|
|Utils|100%|
|Auth|95%+|
|Middleware|90%+|
|Routes|85%+|

📌 Coverage only counts **executed code**

---

## 9️⃣ Bun Package Manager Commands

### Install dependencies

```bash
bun install
```

### Add package

```bash
bun add jsonwebtoken
bun add -d @types/jsonwebtoken
```

### Remove package

```bash
bun remove pkg
```

### npm → bun mapping

|npm|bun|
|---|---|
|npm install|bun install|
|npm i pkg|bun add pkg|
|npm uninstall|bun remove|

---

## 🔟 Critical Gotcha: `install` Script Loop

### ❌ Dangerous

```json
"scripts": {
  "install": "bun install"
}
```

Causes:

```
bun install
 → install script
   → bun install
     → infinite loop
```

### ✅ Safe scripts

```json
"scripts": {
  "dev": "bun run src/server.ts",
  "test": "bun test"
}
```

### Rule to Memorize

> **Never call the package manager inside its own lifecycle scripts**

Applies to:

- npm
    
- yarn
    
- pnpm
    
- bun
    

---

## 🎯 Final Takeaways (Most Important)

- Bun replaces **Node + npm + ts-node + Jest**
    
- TypeScript ≠ runtime — environments must be declared
    
- Encoding bugs are transport-level issues
    
- `async` auto-wraps return values
    
- Coverage tools respect Istanbul ignores
    
- Lifecycle scripts can break installs if misused
    

---


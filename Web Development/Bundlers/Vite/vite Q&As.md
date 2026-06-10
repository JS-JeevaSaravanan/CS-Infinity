

Vite is bundler or builder ?

**Vite** is technically a **build tool**, but it can also act as a **bundler** — depending on the context and phase of usage.

### 🔍 Breakdown:

#### ✅ **Development Phase:**

- **Vite is a development server**, not a traditional bundler.
    
- It uses **native ES modules** (via the browser) and **esbuild** (a fast Go-based bundler) to **transform** and **serve** files quickly on demand.
    
- This allows **instant startup** and **fast HMR** (Hot Module Replacement).
    
- So, during development, Vite is not bundling your code — it's serving it as separate modules.
    

#### ✅ **Build Phase (for production):**

- Vite uses **Rollup** (a real bundler) under the hood.
    
- This phase **bundles** your code into optimized static assets (e.g., `main.[hash].js`, `vendor.[hash].js`, etc.).
    
- So in production, **Vite acts as a builder** that leverages **Rollup as the bundler**.
    

---

### 🔁 Summary:

|Phase|Role|Tool used internally|
|---|---|---|
|Development|Dev Server (not a bundler)|esbuild (for transforms)|
|Production|Builder & Bundler|Rollup (for bundling)|

So to answer your question directly:

> **Vite is a build tool that uses a bundler (Rollup) for production and a dev server (with esbuild) for development.**


---

### 🔹 1. **What is Vite?**

**Answer:**  
Vite is a modern frontend **build tool** that offers fast development via native ES modules and bundles production code using **Rollup**.

---

### 🔹 2. **Is Vite a bundler?**

**Answer:**  
Not directly. Vite **uses Rollup** to bundle for production, but in development, it serves files using **native ESM** — no bundling.

---

### 🔹 3. **How is Vite different from Webpack?**

**Answer:**  
Vite is faster in dev because it **doesn't bundle upfront** — it serves modules on-demand. Webpack does **full bundling** even in dev.

---

### 🔹 4. **What powers Vite under the hood?**

**Answer:**

- **esbuild** → Transforms code in dev (very fast).
    
- **Rollup** → Bundles code for production.
    

---

### 🔹 5. **Does Vite support React, Vue, etc.?**

**Answer:**  
Yes. Vite has official plugins for **React**, **Vue**, **Svelte**, **Lit**, and more.

---

### 🔹 6. **What is Hot Module Replacement (HMR) in Vite?**

**Answer:**  
HMR updates only changed modules in the browser **instantly** without full reloads — it's **built-in and very fast** in Vite.

---

### 🔹 7. **Can I use Vite with TypeScript?**

**Answer:**  
Yes. Vite supports TypeScript out of the box (via esbuild), but it doesn’t type-check — use `tsc` or `vite-plugin-checker` for that.

---

### 🔹 8. **Does Vite support code splitting?**

**Answer:**  
Yes. Vite uses **Rollup**, which supports **dynamic imports** and **code splitting** in production.

---

### 🔹 9. **Is Vite good for large projects?**

**Answer:**  
Yes. Vite scales well with **monorepos**, **micro-frontends**, and **large codebases** — especially with plugin support.

---

### 🔹 10. **How do you start a Vite project?**

**Answer:**

```bash
npm create vite@latest
```

---

### 🔹 11. **Can I extend Vite with plugins?**

**Answer:**  
Yes. Vite has a powerful **plugin API** (similar to Rollup) and supports both **official and community** plugins.

---

### 🔹 12. **What is `vite.config.js` used for?**

**Answer:**  
It configures Vite — e.g., **plugins**, **aliases**, **build settings**, **env vars**, etc.

---

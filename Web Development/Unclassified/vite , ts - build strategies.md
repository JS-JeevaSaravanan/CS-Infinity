

## ⚙️ Vite + TypeScript Build Strategies

### 1. **`vite build && tsc`**

- **Use case**: Apps
    
- **Purpose**: Vite bundles, `tsc` for types/declarations
    
- **Notes**: Fast, standard for frontend apps
    

---

### 2. **`tsc -b && vite build`**

- **Use case**: Libraries / Monorepos
    
- **Purpose**: TypeScript builds first (`.js`, `.d.ts`), then Vite bundles
    
- **Notes**: Requires `composite: true` and `tsconfig.build.json`
    

---

### 3. **`tsup` (or `unbuild`)**

- **Use case**: Node/CLI tools or libraries
    
- **Purpose**: Replaces `tsc`, supports `.d.ts`, ES/CJS outputs
    
- **Example**:
    
    ```json
    "build": "tsup src/index.ts --dts"
    ```
    
- **Notes**: Zero-config, faster than `tsc`
    

---

### 4. **`vite build` only**

- **Use case**: Small frontend apps
    
- **Purpose**: Vite handles everything (via esbuild)
    
- **Notes**: Skips type-checking unless paired with `vue-tsc` or `tsc --noEmit`
    

---

### 5. **`rollup` directly**

- **Use case**: Libraries needing full control
    
- **Purpose**: Manual setup with Rollup + plugins
    
- **Notes**: More setup, more control (Vite uses Rollup under the hood)
    

---

### ✅ TL;DR

|Strategy|Type-Checking|Declaration Output|Best For|
|---|---|---|---|
|`vite build && tsc`|✅|✅ (if configured)|Apps|
|`tsc -b && vite build`|✅|✅|Libraries / Monorepos|
|`tsup`|✅ (via SWC)|✅|Libraries / CLIs|
|`vite build`|❌|❌|Simple apps|
|`rollup`|✅ (manual)|✅ (manual)|Custom builds|

---

Let me know if you want a version of this for a README or CLI doc!
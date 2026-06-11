In **Vitest** (just like in Jest), the difference between `toEqual` and `toStrictEqual` comes down to **how strictly they compare objects**, especially around:

- `undefined` vs missing fields
    
- prototype differences
    
- extra properties
    
- array holes
    

Here’s a breakdown:

---

## 🔍 `toEqual`

- ✅ Checks that two values are **deeply equal**
    
- ✅ Ignores missing properties if they're `undefined`
    
- ✅ Allows loose structure matching
    

```ts
expect({ a: 1 }).toEqual({ a: 1 });             // ✅ passes
expect({ a: 1 }).toEqual({ a: 1, b: undefined }); // ✅ passes
```

---

## 🧨 `toStrictEqual`

- ✅ Checks for **deep equality**, **including type, shape, presence of all fields**, and **array holes**
    
- ❌ Fails if a property is `undefined` in one but missing in another
    
- ❌ Fails if prototype is different (e.g., class vs plain object)
    

```ts
expect({ a: 1 }).toStrictEqual({ a: 1, b: undefined }); // ❌ fails
expect([, 1]).toEqual([undefined, 1]);  // ✅ passes
expect([, 1]).toStrictEqual([undefined, 1]); // ❌ fails (hole vs undefined)
```

---

## TL;DR Summary

|Matcher|Deep Equality|Checks Missing vs `undefined`|Checks Prototypes|Sensitive to Array Holes|
|---|---|---|---|---|
|`toEqual`|✅|❌ (loose)|❌|❌|
|`toStrictEqual`|✅|✅ (strict)|✅|✅|

---

## ✨ When to Use What?

- Use `toEqual` when you just care about **value equality**.
    
- Use `toStrictEqual` when you're testing **exact shapes** (e.g., DTOs, API responses, validation schemas).
    

---



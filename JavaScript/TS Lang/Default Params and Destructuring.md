# Default Parameters & Destructuring in TypeScript — Options-Object Functions

A crisp, in-depth guide to the pattern:

```ts
export const useDashboardMetrics = ({ enabled = true }: { enabled?: boolean } = {}) => { ... };
```

Why it's written this way, what each piece does, and the subtle bug the "obvious" alternative hides.

---

## 1. The line, decoded inside-out

```ts
const useDashboardMetrics = ({ enabled = true }: { enabled?: boolean } = {}) => { ... }
//                           └─────┬──────┘  └────────┬────────┘  └┬┘
//                          destructure +      type of the       whole-arg
//                          per-prop default     argument         default
```

There are **three independent things** on that one parameter:

| Piece | What it is | Job |
|-------|-----------|-----|
| `{ enabled }` | Object **destructuring** | Pull `enabled` out into a local variable |
| `= true` (inside braces) | **Per-property default** | Use `true` when the property is missing/`undefined` |
| `: { enabled?: boolean }` | **Type annotation** | Describe the argument's shape; `?` = optional |
| `= {}` (after the type) | **Whole-argument default** | Use `{}` when the argument itself is missing |

Read it as one sentence:
> "Take an object; grab its `enabled` (defaulting to `true` if absent); and if no object is passed at all, start from `{}`."

---

## 2. Destructuring vs. keeping the object whole

**Destructured** — `enabled` becomes a plain local variable:

```ts
const f = ({ enabled = true }: { enabled?: boolean } = {}) => {
  useQuery({ enabled });   // just `enabled`
};
```

**Not destructured** — you carry the object and reach into it:

```ts
const f = (opts: { enabled?: boolean } = {}) => {
  const enabled = opts.enabled ?? true;
  useQuery({ enabled });   // via `opts.enabled`
};
```

Both are valid. Destructuring is terser at the use-site; the non-destructured form is sometimes clearer when there are many fields or you want to forward the whole object.

---

## 3. The two levels of "default" — and why you need BOTH

This is the crux. A parameter default only fires when the value is **`undefined`** (missing). It does **not** fire for an object that merely omits a key.

### Level 1 — whole-argument default (`= {}`)

Handles the "called with nothing" case:

```ts
const f = ({ enabled = true }: { enabled?: boolean }) => {...}   // NO `= {}`
f();   // 💥 TypeError: Cannot destructure property 'enabled' of 'undefined'
```

Without `= {}`, calling `f()` tries to destructure `undefined` and throws. Adding `= {}` gives it an object to destructure.

### Level 2 — per-property default (`enabled = true`)

Handles the "called with an object that omits the key" case:

```ts
const f = (opts: { enabled?: boolean } = { enabled: true }) => {
  return opts.enabled;
};
f({});   // ❌ undefined  — NOT true!
```

Here the default lives on the **whole object**, so it only applies when the object is missing. Pass `{}` (a real object) and the default is skipped → `opts.enabled` is `undefined`.

### Both together = safe at every call

```ts
const f = ({ enabled = true }: { enabled?: boolean } = {}) => enabled;

f();                    // → true   (arg missing → {} → prop default → true)
f({});                  // → true   (arg is {} → prop default → true)
f({ enabled: false });  // → false  (explicit)
f({ enabled: true });   // → true   (explicit)
```

---

## 4. Side-by-side: the common mistake

```ts
// ❌ default on the OBJECT — breaks on f({})
(opts: { enabled?: boolean } = { enabled: true }) => opts.enabled
//  f()   → true
//  f({})  → undefined   ← silent bug
//  f({enabled:false}) → false

// ✅ default on the PROPERTY + object fallback — safe everywhere
({ enabled = true }: { enabled?: boolean } = {}) => enabled
//  f()   → true
//  f({})  → true
//  f({enabled:false}) → false
```

**Rule of thumb:** put defaults on the **properties you destructure**, and use `= {}` only as the "no argument at all" guard. Never rely on an object-level default like `= { enabled: true }` to supply property values.

---

## 5. Equivalent longhand (same behavior, no sugar)

```ts
const useDashboardMetrics = (options = {}) => {
  const enabled = options.enabled ?? true;
  // ...
};
```

- `options = {}` ⇔ the `= {}` whole-arg default.
- `options.enabled ?? true` ⇔ the `enabled = true` per-prop default.

> Note: `??` (nullish coalescing) mirrors destructuring defaults — both trigger only on `undefined`/`null`, **not** on falsy values like `0`, `''`, or `false`. So `false ?? true` → `false`, exactly like a destructuring default. Do **not** use `||` here: `false || true` → `true`, which would wrongly override an explicit `false`.

---

## 6. Why the options-object shape at all?

Compare positional vs. options-object:

```ts
useDashboardMetrics(false);            // positional — what does `false` mean at the call site?
useDashboardMetrics({ enabled: false }); // named — self-documenting
```

Benefits of the object form:
- **Readable call sites** — the flag is named.
- **Extensible** — add `{ enabled, staleTime, retry }` later without breaking existing calls or juggling argument order.
- **Order-independent** — no "which boolean was first?" bugs.

That's why hooks and library APIs (TanStack Query's `useQuery` itself) take a single options object.

---

## 7. Quick reference

```ts
// The safe, idiomatic template:
const useThing = ({ a = 1, b = 'x', c = false }: {
  a?: number;
  b?: string;
  c?: boolean;
} = {}) => { /* a, b, c are always defined locals */ };
```

- Destructure to get clean locals.
- Give **every optional property** its own default.
- End with `= {}` so a zero-arg call works.
- Defaults fire on `undefined` only — safe for `false`/`0`/`''` values.

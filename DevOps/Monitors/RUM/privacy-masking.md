# Datadog RUM — Privacy & Masking

## Global Config (`defaultPrivacyLevel`)

| Value | Behavior |
|-------|----------|
| `allow` | Records everything (default) |
| `mask-user-input` | Masks all input fields, textareas, checkboxes |
| `mask` | Masks all text + inputs (most restrictive) |

```js
datadogRum.init({
  defaultPrivacyLevel: 'mask-user-input'
})
```

---

## Element-Level — `data-dd-privacy` Attribute

| Value | Behavior |
|-------|----------|
| `allow` | Override parent mask → record this element |
| `mask` | Mask all text content in this element |
| `mask-user-input` | Mask only inputs within this element |
| `hidden` | Replaces entire element with a gray block (not just masked) |

```html
<div data-dd-privacy="mask">Sensitive section</div>
<input data-dd-privacy="mask" />
<div data-dd-privacy="hidden">Completely blocked</div>
<span data-dd-privacy="allow">Show this inside a masked parent</span>
```

---

## CSS Class Equivalents (legacy, still supported)

| Class | Equivalent |
|-------|-----------|
| `dd-privacy-allow` | `data-dd-privacy="allow"` |
| `dd-privacy-mask` | `data-dd-privacy="mask"` |
| `dd-privacy-mask-user-input` | `data-dd-privacy="mask-user-input"` |
| `dd-privacy-hidden` | `data-dd-privacy="hidden"` |

---

## `mask` vs `hidden`

| | `mask` | `hidden` |
|--|--------|----------|
| Text | Replaced with `*` | Not visible |
| Layout | Preserved | Replaced with opaque block |
| Use case | Sensitive text | Sensitive UI sections |

> Prefer `data-dd-privacy` attribute over CSS classes — it's the current recommended approach.

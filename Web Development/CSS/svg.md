

Here’s a **crisp, all-in-one guide to SVGs**—focused on what actually matters in real dev work.

---

# ⚡ SVG — Practical Cheat Sheet

## 🧠 What SVG really is

- **Vector graphics (XML-based)**
    
- Resolution-independent (no blur on zoom)
    
- Fully controllable via **CSS + JS**
    

---

## 🧩 Core Structure

```xml
<svg viewBox="0 0 24 24">
  <path d="..." />
</svg>
```

### Key elements:

- `<svg>` → container
    
- `<path>` → most common shape
    
- `<rect>`, `<circle>`, `<line>` → basic shapes
    
- `<g>` → grouping
    
- `<defs>` → reusable definitions
    

---

## 🔑 Must-Know Attributes

### `viewBox` (most important)

```xml
viewBox="0 0 24 24"
```

- Defines coordinate system
    
- Enables scaling
    

---

### `fill` vs `stroke`

- `fill` → solid icons
    
- `stroke` → line icons
    

```xml
fill="currentColor"
stroke="currentColor"
```

---

### `d` (path data)

- Defines the shape
    
- Hard to read, but core of SVG
    

---

## 🎨 Styling SVG

### Best practice:

```xml
fill="currentColor"
```

Then:

```css
color: red;
```

👉 SVG inherits color → easy theming

---

### Inline SVG (recommended)

```html
<svg class="icon">...</svg>
```

✔ Style via CSS  
✔ Animate  
✔ Control parts

---

### `<img>` SVG (limited)

```html
<img src="icon.svg" />
```

❌ No styling  
❌ No control

---

## ⚙️ Performance Rules

### ✅ Keep it light

- Remove:
    
    - comments
        
    - metadata
        
    - unused `<defs>`
        

👉 Use **SVGO**

---

### ❌ Avoid base64 images

```xml
<image xlink:href="data:image/png..." />
```

👉 Not real SVG → heavy + not scalable

---

### ✅ Reuse with `<symbol>`

```xml
<symbol id="icon">
  <path d="..." />
</symbol>

<use href="#icon" />
```

---

## 📐 Sizing & Responsiveness

### Best pattern:

```xml
<svg viewBox="0 0 24 24">
```

Then control via CSS:

```css
width: 20px;
height: 20px;
```

---

## 🎬 Animation

### CSS:

```css
path {
  transition: fill 0.2s;
}
```

### SVG native:

```xml
<animate />
```

👉 Mostly use CSS or JS (Framer Motion, GSAP)

---

## 🧪 Interactivity

- Add `onClick`, `hover`, etc.
    
- Works like DOM elements
    

```html
<svg onclick="...">
```

---

## 🚨 Common Mistakes

### ❌ No `viewBox`

→ breaks scaling

### ❌ Fixed width/height only

→ not responsive

### ❌ Too many `<g>` / nested elements

→ messy + heavy

### ❌ Random IDs (`clip0_123`)

→ comes from Figma export

### ❌ Using transforms unnecessarily

```xml
transform="scale(...)"
```

---

## 🧰 Tooling

- **Figma** → export SVG
    
- **SVGO** → optimize
    
- **SVGOMG** → visual optimizer
    
- **Illustrator** → advanced export
    

---

## 🧠 Mental Model

Think of SVG as:

> “HTML for graphics”

- `<svg>` = container
    
- `<path>` = shape
    
- CSS = styling
    
- JS = interaction
    

---

## 🏁 Golden Rules

1. **Use paths, not images**
    
2. **Always include `viewBox`**
    
3. **Use `currentColor`**
    
4. **Inline SVG for control**
    
5. **Optimize before shipping**
    

---

## ⚡ Quick Decision Guide

|Use case|Approach|
|---|---|
|Icons|Inline SVG|
|Static image|`<img>`|
|Reusable icons|`<symbol>`|
|Animation|Inline SVG + CSS/JS|

---

## 🧠 Final Insight

> If your SVG is heavy, unstyleable, or hard to read → it’s poorly exported, not inherently complex.

---

If you want, I can:

- Review your SVGs and optimize them
    
- Or create a **shared icon system for your project (React/Next setup)**

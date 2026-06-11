

👉 **Claude only reads what you send it — it does not execute JavaScript.**

---

## 🔹 What it can read

- ✅ **HTML (static content)**
    
- ✅ Text extracted from DOM
    
- ✅ API responses (if you pass them)
    

---

## 🔹 What it cannot do

- ❌ Execute JS
    
- ❌ Run client-side scripts
    
- ❌ Wait for React/Vue to render
    
- ❌ Trigger API calls inside the page
    

---

## 🔹 Implication

### If page is SSR:

- HTML already contains content  
    👉 Claude sees everything ✅
    

### If page is CSR (React, etc.):

- HTML may be empty (just `<div id="root">`)  
    👉 Content comes via JS → Claude **won’t see it** ❌
    

---

## 🧠 Example

```html
<!-- What Claude sees -->
<div id="root"></div>

<script>
  // React renders content here later
</script>
```

👉 Claude sees **nothing useful**

---

## 🔹 How to handle this

If you want Claude to understand a page:

- Send:
    
    - **Rendered HTML** (after JS execution)
        
    - OR **clean extracted text**
        
    - OR **API response data**
        

---

## 🧠 Crisp takeaway

👉 **Claude reads HTML/text only — it does not run JavaScript, so client-rendered content must be pre-rendered or extracted.**


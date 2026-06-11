

Your instinct is reasonable, but not entirely correct—this depends on **ownership of concerns**.

---

## 🧠 What your current code does

- `SSM` → provides **base URL**
    
    ```ts
    this.redirectionServiceUrl
    ```
    
- Code → appends **API version (`/v2`) + query**
    

---

## 🔍 Should `/v2` come from SSM?

### ❌ Not ideal to blindly move it to SSM

Because:

- `/v2` is **API contract/versioning**, not environment config
    
- SSM should ideally hold:
    
    - host
        
    - base service URL
        
    - environment-specific values
        

👉 Versioning is **application logic**, not infra config

---

## ✅ Better separation of concerns

### Option 1 (Recommended)

Keep:

```ts
SSM → https://redirect-service.com
Code → /v2
```

👉 Clean separation:

- Infra config vs API contract
    

---

### Option 2 (when it makes sense)

Move `/v2` to SSM **only if**:

- Version differs per environment
    
- You want **runtime switching without deploy**
    
- Multiple services share same config
    

Example:

```ts
https://redirect-service.com/v2
```

---

## ⚠️ Why your current thought can be risky

If `/v2` is in SSM:

- Hidden coupling (harder to trace in code)
    
- Debugging becomes harder
    
- Version changes become **config-driven (less visible)**
    

---

## 🧩 Slight improvement suggestion

Instead of hardcoding inline:

```ts
const redirectionUrl = `${this.redirectionServiceUrl}/v2?data=${encodedData}`;
```

👉 Extract:

```ts
const REDIRECTION_API_VERSION = '/v2';
```

---

## ⚡ Crisp takeaway

👉 **Keep `/v2` in code unless versioning needs to be environment-driven.**  
👉 SSM should hold **base URL, not API semantics.**


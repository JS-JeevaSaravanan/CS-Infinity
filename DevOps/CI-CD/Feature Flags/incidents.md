




# Feature-flagging via LaunchDarkly — and why we moved to Statsig


Here’s a **crisp, presentation-ready summary** of _“Feature-flagging via LaunchDarkly — and why we moved to Statsig”_ by **Chander Ramesh (Motion, 2022)** 👇

---

## 🧠 Why Feature Flags

Motion’s engineering was struggling with:

- 🔥 Constant firefighting
    
- 🕒 Long, unstable release cycles
    
- 🚫 No rollback mechanism
    

**Feature flags** solved all three:

1. Roll back instantly by toggling, not redeploying.
    
2. Merge small, frequent commits gated by flags → fewer long-lived branches.
    
3. Enable fully automated CI-based releases instead of manual Git-Flow merges.
    

---

## ⚙️ Why LaunchDarkly Failed

### 1️⃣ Pricing — Too Expensive for Startups

- LaunchDarkly uses **seat-based pricing**, not usage-based.
    
- Added cost per engineer → reduced productivity.
    
- Inaccurate MAU (monthly active users) inflated bills & broke dashboards.
    

### 2️⃣ Custom Attributes — Fundamentally Broken

- Attributes (e.g., `isInternal`) must be recomputed & sent **on every SDK call**.
    
- No persistent user context → huge dev overhead.
    
- Makes complex segmentation (power users, etc.) painful.
    

### 3️⃣ Chrome Extension Integration — Nightmare

- SDK ran per-tab → memory + perf issues.
    
- Required hacking the SDK to run inside **service worker background threads**.
    
- Two-day engineering workaround with brittle custom code.
    

### 4️⃣ Usage Tracking — Broken Insights

- Even after removing a flag, **LaunchDarkly still showed activity**.
    
- Impossible to know if a flag was truly unused → risk during cleanup.
    
- Led to confusion, “false positives,” and dead code persisting.
    

### 5️⃣ Death by 1000 Papercuts

- ❌ No React Native / Expo support
    
- ❌ Random flag fallback bugs (~1 % users)
    
- ❌ Archiving in test also nuked prod flag
    
- ❌ Approval workflows = paid add-on
    

---

## 🚀 Why Move to **Statsig**

- ✅ Usage-based startup pricing program
    
- ✅ Simpler, stable SDKs (web + mobile + extensions)
    
- ✅ Clean UI & fast setup
    
- ✅ Built-in approval, environment separation
    
- ⚠️ Minor nit: JS SDK lacks realtime updates (easily fixed with polling)
    

---

## 🧹 Key Lessons

### 1️⃣ Vendor choice = strategic decision

Don’t rush it. Evaluate pricing model, SDK reliability, and support early.

### 2️⃣ Clean up flags aggressively

Old flags = tech debt + complexity.  
**Motion policy:** remove flags **2 weeks after launch** unless still needed.

---

### TL;DR

|Problem|LaunchDarkly Issue|Statsig Fix|
|---|---|---|
|Cost|Seat-based billing|Usage-based startup plan|
|Attributes|Must recompute each time|Server-side persistent context|
|Chrome Ext|Heavy SDK|Lightweight polling|
|Observability|Broken Insights|Reliable usage data|
|Governance|Paid approvals|Included by default|

---

Referred {

https://c5r.medium.com/feature-flagging-via-launchdarkly-and-why-we-moved-to-statsig-8c20971e17d

}


---

# LaunchDarkly configuration horror story


Got it — here’s a **super-crisp, presentation-level version** of the _LaunchDarkly configuration horror story_ — distilled for clarity, punch, and slide-readability 👇

---

## ⚙️ Feature Flags Gone Wrong — A Real Incident

### 🧩 Setup

- Using **LaunchDarkly** for controlled rollouts.
    
- Separate API keys for **dev**, **staging**, **prod**.
    
- Flags decide which users see which features.
    

---

### 💥 The Mistake

- **Wrong API key**: staging key committed to prod config.
    
- App connects to **staging environment** → all flags ON.
    
- Every experimental feature instantly live to all users.
    
- No crash, no alerts — silent chaos.
    

---

### 🔎 Symptoms

- Random bugs across unrelated features.
    
- Logs + dashboards looked normal.
    
- Flags “OFF” in LaunchDarkly UI — but code said otherwise.
    

---

### 🧯 Root Cause

```text
PROD_API_KEY = "staging-12345"  # committed by mistake
```

→ Production fetched **staging flag rules** (100% enabled).

---

### 🚀 The Fix

1. Replace with correct API key.
    
2. Redeploy & verify environment.
    
3. Add validation on startup:
    
    ```python
    env_flag = get_flag("current_env")
    if env_flag != LOCAL_ENV:
        raise Exception("LaunchDarkly env mismatch!")
    ```
    
    → Fail fast if wrong key ever used again.
    

---

### 🧠 Lessons

- Config mistakes are **harder than code bugs** — invisible, untestable.
    
- Humans can’t detect opaque API keys → automation must.
    
- Fix **classes** of problems, not single incidents.
    
- “Be careful” ≠ reliable. Automate checks.
    

---

### 💡 Takeaway

> The wrong config can bypass every safeguard.  
> Treat **configuration validation** as part of your production safety net.

---

referred {

https://youtu.be/-4w52waLTx4

}

---

















# 🎯 Percentage Rollouts (a.k.a. Gradual Feature Releases)

**Goal:**  
Release a feature to a controlled percentage of users (e.g. 10%, 25%, 50%) — **without random flickering** and **without changing code per user**.

✅ The key requirement →  
**Each user must always see the same experience** across sessions.

That’s where **Deterministic Hashing** comes in.

---

## 1️⃣ The Core Idea

Instead of random numbers, we use a **consistent hash** of user identity + feature name →  
Convert it to a number between `0` and `100`, then compare it to your rollout percentage.

### Example:

```js
if (hash(user.id + "newDashboard") % 100 < rolloutPercentage) {
    enableFeature();
} else {
    disableFeature();
}
```

So:

- `rolloutPercentage = 20` → 20% of users see it.
    
- The same user always gets the same result.
    

---

## 2️⃣ Simple Implementation — Using Hash Modulo

### Code Example:

```js
function isFeatureEnabled(userId, featureName, rolloutPercent) {
  const key = `${userId}:${featureName}`;
  const hash = Math.abs(hashCode(key)) % 100;  // value 0–99
  return hash < rolloutPercent;
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit int
  }
  return hash;
}

// Example
isFeatureEnabled('user123', 'newCheckout', 25); // true for ~25% users
```

🧠 _Why it works:_

- The hash output is **deterministic** (same for same inputs).
    
- The modulo gives a **uniform distribution** of users across 0–99.
    
- Rollout % acts like a threshold cut-off.
    

---

## 3️⃣ Cryptographic Hashing (More Reliable & Language-Agnostic)

To ensure consistent rollout across multiple services (Node, Python, Java), use a **standardized hash function** like **SHA256**.

### Example:

```js
import crypto from "crypto";

function isFeatureEnabled(userId, featureName, rolloutPercent) {
  const key = `${userId}:${featureName}`;
  const hashHex = crypto.createHash('sha256').update(key).digest('hex');
  const hashInt = parseInt(hashHex.slice(0, 8), 16); // take first 8 hex chars
  const normalized = hashInt % 100; // 0–99
  return normalized < rolloutPercent;
}
```

✅ Deterministic across languages  
✅ Consistent for distributed systems  
✅ Stable even after restarts

---

## 4️⃣ Weighted Rollouts (Advanced)

You can **extend** percentage rollouts to handle **multiple variants** (e.g., A/B/C testing).

### Example:

```js
const variants = [
  { name: 'control', weight: 50 },
  { name: 'newUI', weight: 30 },
  { name: 'darkMode', weight: 20 },
];

function getVariant(userId, featureName) {
  const key = `${userId}:${featureName}`;
  const hash = Math.abs(hashCode(key)) % 100;
  let cumulative = 0;

  for (const v of variants) {
    cumulative += v.weight;
    if (hash < cumulative) return v.name;
  }
}
```

So each user consistently falls into a **bucket** based on weighted distribution.

---

## 5️⃣ Modern Approach (How It’s Done Today)

Most **modern feature flag platforms** (e.g. **LaunchDarkly**, **Flagsmith**, **Unleash**, **AWS AppConfig**) use **consistent hashing** + **stable identifiers** (userID or sessionID) with the following properties:

|Property|Description|
|---|---|
|**Consistent Hashing**|Deterministic mapping across services|
|**Stable Key**|Based on user, org, or device ID|
|**Hash Range (0–9999)**|Fine-grained control (0.01% granularity)|
|**Dynamic Updates**|Percentages can be increased live (10% → 50% → 100%)|
|**Segment Logic**|Combine rollout with conditions (region, role, etc.)|

### Pseudo-code (modern style)

```js
function getRolloutBucket(userId, featureKey) {
  const key = `${userId}:${featureKey}`;
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const intVal = parseInt(hash.slice(0, 8), 16); // 32-bit sample
  return intVal % 10000; // bucket range 0–9999
}

function isEnabled(userId, featureKey, rolloutPercent) {
  const bucket = getRolloutBucket(userId, featureKey);
  return bucket < rolloutPercent * 100; // 10% = 1000/10000
}
```

---

## 6️⃣ Why Deterministic Hashing Is Essential

✅ **Consistency:** User always gets same experience  
✅ **Fair Distribution:** Uniform randomness across population  
✅ **Safe Scaling:** Gradually increase % without code changes  
✅ **Rollback Friendly:** Decrease % or disable instantly  
✅ **Cross-Language Stability:** Cryptographic hash = same everywhere

---

## 🔚 TL;DR

|Method|Description|Best Use|
|---|---|---|
|**Modulo Hash**|Simple, fast, easy to code|Small projects|
|**SHA256 Hash**|Stable across systems|Production-grade|
|**Weighted Hash**|Multi-variant rollout|A/B/C testing|
|**Consistent Hash (Modern)**|Deterministic + fine-grained|Used by feature flag services|

---


Perfect — here’s a **crisp, real-world rundown** of the main **feature-flag rollout use cases** (beyond just “on/off” and “% rollouts”) 👇

---

## 🧩 1️⃣ Percentage Rollouts (Gradual Release)

**What:** Roll out a feature to X% of users deterministically (e.g., 10%, 25%, 50%, 100%).  
**Why:** Reduce risk by controlling exposure.  
**Use Case:**  
→ Deploy a new checkout flow to **10%** of users to monitor conversion before full release.

```js
const hash = hashUserId(user.id, featureKey);
const enabled = hash % 100 < rolloutPercent;
```

---

## 🧍‍♀️ 2️⃣ User / Group Targeting

**What:** Enable feature for **specific users, roles, or accounts.**  
**Why:** Allow internal testing or tiered access.  
**Use Case:**  
→ Enable “AI summary” feature only for **beta testers** or **enterprise clients**.

```js
if (user.role === "beta" || whitelist.includes(user.email)) return true;
```

---

## 🌎 3️⃣ Geo / Region Based Rollout

**What:** Enable feature based on **country / region / timezone.**  
**Why:** Handle localization, regulations, or infrastructure constraints.  
**Use Case:**  
→ Launch payment gateway feature only in **EU** countries first.

```js
if (["DE", "FR", "ES"].includes(user.country)) return true;
```

---

## 🧪 4️⃣ A/B Testing (Variants)

**What:** Serve multiple **variants** (A, B, C...) using flag rules.  
**Why:** Measure performance differences between feature versions.  
**Use Case:**  
→ Try 3 button colors, track click-through rates.

```js
const variant = getVariant(user.id, featureKey, ["A", "B", "C"]);
```

---

## 🧑‍💻 5️⃣ Internal / Canary Rollouts

**What:** Release new code to **internal users or employees** first.  
**Why:** Detect issues early before public exposure.  
**Use Case:**  
→ Only “@company.com” users see new dashboard for the first 3 days.

---

## ⏱️ 6️⃣ Time-based Rollouts

**What:** Automatically enable/disable flags based on schedule.  
**Why:** Launch timed events or auto-disable old experiments.  
**Use Case:**  
→ Enable “Holiday Banner” between Dec 1–31.

```js
if (now > flag.startTime && now < flag.endTime) return true;
```

---

## 🧮 7️⃣ Dynamic Rule-based Rollouts

**What:** Rules depend on **runtime metrics** (e.g., API latency, user plan).  
**Why:** Adaptive releases — turn off features under stress.  
**Use Case:**  
→ Disable “recommendations” if latency > 1s or traffic spikes.

---

## 🧱 8️⃣ Kill Switch / Circuit Breaker

**What:** Emergency flag to **instantly disable** a problematic feature.  
**Why:** Protect system stability.  
**Use Case:**  
→ Turn off “real-time sync” globally after error spike detected.

---

## 🧬 9️⃣ Environment-based Flags

**What:** Different flag states across **dev / staging / prod.**  
**Why:** Prevent accidental public exposure.  
**Use Case:**  
→ Enabled in staging for QA, off in production until verified.

---

## 🪄 10️⃣ Feature Maturity Lifecycle

**What:** Flags evolve — from **dev → beta → GA → retired.**  
**Why:** Track feature lifecycle without code churn.  
**Use Case:**  
→ Mark “Smart Search” as beta for selected users; remove flag after GA.

---

### 🧠 TL;DR — When to Use Which

|Rollout Type|Goal|Example|
|---|---|---|
|% Rollout|Gradual safety|10% users get new checkout|
|User Targeting|Controlled preview|Beta testers only|
|Geo Rollout|Regional launch|EU-only payments|
|A/B Variants|Experiment|Red vs Blue button|
|Canary|Early internal testing|Employees first|
|Time-based|Auto scheduling|Promo banner|
|Rule-based|Adaptive logic|Disable on high latency|
|Kill Switch|Emergency stop|Turn off buggy sync|
|Env-based|Safe staging|QA only|
|Lifecycle|Feature evolution|Beta → GA|

---



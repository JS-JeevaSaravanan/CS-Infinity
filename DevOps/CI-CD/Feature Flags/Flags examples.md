


## 🗄️ **Example 1: Database Migration with Feature Flags**

Imagine you have an **Order Service** — say, for an e-commerce application — that handles customer orders.  
Currently, it uses a **legacy database** to perform CRUD (Create, Read, Update, Delete) operations.

Now, you plan to **migrate** to a **new database**. The two databases are kept in sync, so data written to the old one is also copied to the new one.  
At some point, you’ll need to **redirect reads** from the legacy database to the new one.

### 🧩 Traditional Approach: Deployments

Normally, you might deploy a **new version** of the Order Service that updates its configuration to point to the new database.  
This works, but it has a drawback:  
If a **critical issue** arises with the new database — say it fails to scale or loses data — you must **roll back deployments** across multiple servers.  
That rollback process can be **slow and risky**, especially when handling live traffic.

### ⚙️ Smarter Approach: Using Feature Flags

Instead of changing the code and redeploying, you can control the data source through a **configuration flag**.  
Your application reads this flag at runtime to decide **which database to use**.

So, if you want to switch back to the old database, you simply **update the configuration** — no redeployment required.  
This update can happen instantly, even across many servers, giving you **fast rollback and full control**.

That’s one example of how **feature flags simplify operational flexibility**.

---

## 🌍 **Example 2: Country-Based Feature Control**

Let’s look at another scenario.  
Suppose your Order Service accepts orders from multiple countries — say **the United States**, **India**, and **Canada**.

Over time, you might expand to new countries or temporarily stop orders from others.  
For instance, you may want to add **Australia**, or disable **Canada** due to logistics issues.

### ⚙️ Using Feature Flags for Regional Control

You can manage this via a simple **feature flag configuration**, such as a JSON object:

`{   "countryAllowList": ["US", "IN", "CA"] }`

If you need to **disable Canada**, you simply remove `"CA"` from the list — no new deployment required.  
The system immediately starts accepting orders only from the remaining countries.

This approach — using **allow lists or deny lists** — is one of the most **common and practical uses** of feature flags.


---

# **The Ice Cream Shop Scenario**

Imagine an ice cream shop franchise expanding to a new city.  
We want to show a **“Now Open!” banner** on our website — but **only** for users near the new shop.

Feature Flags make this easy:

- We deploy the feature to production, **wrapped in a flag**.
    
- Then, we simply **turn it on** for users in that specific location.
    

This means:  
✅ No redeployment  
✅ Safe testing in production  
✅ Targeted rollout to specific user


# 👥 **8. Segments: Who Sees What**

Next, we define **segments** — groups of users with shared attributes.

Example:

- **Segment A (Customers near the new store):**  
    Attributes: `current_location`, `zip_code`  
    → These users will see the “Open” banner.
    
- **Segment B (Internal Testers or Employees):**  
    Attributes: `email_id`  
    → Used for internal testing before public rollout.
    

This approach lets you **test in production safely**, turning features on for employees first, then expanding to customers.


# 🔄 **9. Instant Rollback**

If something breaks — no panic.  
Just **flip the toggle off**.  
The issue disappears instantly while developers fix it — no rollback deployment or downtime needed.


# **10. Automation & Scheduling**

Feature Flags can also include **time-based automation**.  
For example:

- The “Open” banner is visible **2 weeks before** the grand opening  
    and **1 week after** — then automatically turns off.
    

This adds **temporal control**, ensuring features activate or expire on schedule.


---



## 8️⃣ Advanced Feature Flag Rules

Flags can be more than true/false. They can depend on:

- **User Roles:** Admins, Testers, Beta users
    
- **Percent Rollouts:** e.g., 25% of users
    
- **Attributes:** Geography, account type, etc.
    

### Example (in code)

```js
const featureFlags = {
  newDashboard: [
    { role: ['admin', 'tester'] },
    { percentage: 25 }
  ]
};
```

### Logic Example

```js
function canViewFeature(user, flagRules) {
  // Check role & percentage eligibility
}
```

---

## 9️⃣ How Percentage Rollouts Work (Deterministic Hashing)

- Combine **Feature Name + User ID**
    
- Hash → produce a number between 0 and 1
    
- Compare with rollout %  
    → e.g., if < 0.25 → user sees feature
    

Ensures:

- Same user sees consistent experience
    
- Equal random distribution
    

---

## 🔟 Real-World Use Case: Safe Query Refactors

- Have two SQL queries (old vs new)
    
- Wrap new query behind a flag
    
- Compare both results silently
    
- Confidently migrate to new logic once validated
    

```js
if (flags.useOptimizedQuery) {
  products = runNewQuery();
  compareResults(products, oldProducts);
}
```

---


Perfect — here’s a **crisp, modern, and technically deep** explanation of **Percentage Rollouts using Deterministic Hashing**, including **how it works**, **different implementation methods**, and **the modern (current) approach developers use today**, all with clean code snippets 👇

---




Sure! Here's a **crisp yet deep** look at **real-world use cases** of feature flags:

---

### 🌍 **9. Real-World Use Cases**

---

#### 🎬 **Netflix: Experimentation & Progressive Rollout**

- Uses flags for **A/B testing UI/UX** and features globally.
    
- Gradually rolls out changes to subsets of users for risk reduction.
    
- Flags enable **rapid innovation without disrupting millions**.
    

---

#### 📘 **Facebook: Dark Launches at Scale**

- Deploys unfinished features **hidden behind flags** (dark launches).
    
- Tests performance and stability **in production without user exposure**.
    
- Enables **fast iteration and rollback** on massive scale.
    

---

#### 🛒 **Shopify: Developer Velocity with Flag Gating**

- Enables developers to **merge incomplete features safely** using flags.
    
- Supports **trunk-based development** and continuous deployment.
    
- Flags act as **control gates** for incremental feature release.
    

---

#### ☁️ **SaaS Apps: Customer-Tiered Feature Access**

- Uses flags to deliver features **based on subscription plans** or user roles.
    
- Enables **dynamic upgrades/downgrades** without redeploying.
    
- Example: Enable premium analytics dashboard only for Enterprise customers.
    

---

### 🧠 TL;DR

|Company|Use Case|Benefit|
|---|---|---|
|Netflix|A/B tests & rollouts|Safer innovation|
|Facebook|Dark launches|Scalable testing|
|Shopify|Flag gating in dev|Faster releases|
|SaaS Apps|Tiered access|Personalized features|

---

Want me to dive into a specific company’s flag strategy or tools?





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



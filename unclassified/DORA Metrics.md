
**DORA Metrics** are the four key software delivery metrics created by the DevOps Research and Assessment team to measure engineering performance.

### The 4 DORA Metrics

|Metric|What it measures|
|---|---|
|**Deployment Frequency**|How often you deploy to production|
|**Lead Time for Changes**|Time from code commit to production|
|**Change Failure Rate**|Percentage of deployments causing incidents, rollbacks, or failures|
|**Time to Restore Service (MTTR)**|How quickly you recover from a production failure|

---

### 1. Deployment Frequency

**Question:** How often do we ship?

Example:

```text
Team A: 10 deployments/day
Team B: 1 deployment/month
```

Higher frequency usually means:

- Smaller changes
    
- Faster feedback
    
- Lower risk per deployment
    

---

### 2. Lead Time for Changes

**Question:** How long does code take to reach production?

Example:

```text
Commit: Monday 10:00 AM
Production: Monday 2:00 PM

Lead Time = 4 hours
```

Lower is generally better.

---

### 3. Change Failure Rate

**Question:** How many deployments break something?

Formula:

```text
Failed Deployments / Total Deployments × 100
```

Example:

```text
100 deployments
5 caused incidents

CFR = 5%
```

---

### 4. Mean Time to Restore (MTTR)

**Question:** When production breaks, how quickly can we fix it?

Example:

```text
Incident starts: 2:00 PM
Service restored: 2:20 PM

MTTR = 20 minutes
```

Lower is better.

---

### Real Example

Suppose your team deployed 200 times last month:

```text
Deployments: 200
Average Lead Time: 3 hours
Failed Deployments: 4
Average Recovery Time: 15 minutes
```

DORA Metrics:

```text
Deployment Frequency: 200/month
Lead Time: 3 hours
Change Failure Rate: 2%
MTTR: 15 minutes
```

That's typically considered a strong engineering performance profile.

---

### Why Engineering Managers Care

DORA metrics help answer:

- Are we shipping fast?
    
- Are we shipping safely?
    
- Are we recovering quickly?
    
- Are our delivery processes improving?
    

The goal is **speed and stability together**, not just more deployments. A team deploying 20 times a day with a 30% failure rate is usually performing worse than a team deploying 5 times a day with a 2% failure rate.



---

Availability:

**99.99% availability** ("four nines") means your application is allowed to be unavailable for only **0.01% of the time**.

### Allowed Downtime

|Period|Max Downtime at 99.99%|
|---|---|
|Per Day|~8.6 seconds|
|Per Week|~1 minute|
|Per Month (30 days)|~4.3 minutes|
|Per Year|~52.6 minutes|

### Availability Formula

Availability = \frac{Total\ Time - Downtime}{Total\ Time} \times 100%

Example:

```text
Monthly time = 43,200 minutes
Downtime = 4.32 minutes

Availability = 99.99%
```

### What Counts as Downtime?

Typically:

- Users cannot access the application.
    
- Critical functionality is unavailable.
    
- Severe outages causing service disruption.
    

Often does **not** include:

- Planned maintenance windows (depending on SLA definition).
    
- Issues affecting a tiny subset of users.
    

### Comparison

|Availability|Downtime / Month|
|---|---|
|99%|~7.3 hours|
|99.9%|~43.8 minutes|
|99.99%|~4.3 minutes|
|99.999%|~26 seconds|

For many SaaS products, **99.9%–99.99%** is a common target. Achieving **99.99%** usually requires redundancy, monitoring, automated failover, and strong incident response processes.

---

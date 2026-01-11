

## DB backend config system 


If you’re managing **feature flags in a database (DB-backed config system)** rather than a managed platform like LaunchDarkly or AppConfig, you’ll want to **build observability and analytics around feature usage yourself**.

Here’s a **complete, production-style explanation** of how to do it — crisp, structured, and with code-level examples 👇

---

# 🧭 Overview

When using **DB-based Feature Flags**, you already have configuration control (CRUD for flags).  
Now, you need **observability**, which means tracking:

|Category|What to Measure|Why It Matters|
|---|---|---|
|**Usage Analytics**|How often each flag is evaluated / used|Understand real impact and adoption|
|**Exposure Tracking**|Who saw which flag or variant|Enable A/B test analysis|
|**Error & Performance Metrics**|Flag load latency, cache misses, etc.|Detect operational issues|
|**Change Auditing**|Who toggled the flag, when, and old→new value|Compliance & rollback history|
|**Health Signals**|Cache hit rates, DB reads, flag sync time|System reliability|

---

# ⚙️ 1️⃣ Instrument Flag Evaluations (Feature Usage Analytics)

Each time your app **evaluates** a flag (i.e. checks `if feature_enabled(...)`), log an event to an analytics table or telemetry system.

### Example — Node.js (DB Flag Model)

```js
// pseudo-code for evaluating feature flag
async function isFeatureEnabled(userId, featureKey) {
  const flag = await db.flags.findOne({ key: featureKey });
  const enabled = flag.enabled;

  // track usage
  await db.featureUsage.insert({
    featureKey,
    userId,
    enabled,
    evaluatedAt: new Date(),
  });

  return enabled;
}
```

🔹 Each evaluation is stored — later you can aggregate:

- Daily active flags
    
- Top-used features
    
- Adoption curves per feature
    

---

# 📊 2️⃣ Aggregate Metrics Periodically

To avoid flooding the DB, **batch events** or **stream to analytics backend** (Kafka, Kinesis, or OpenTelemetry exporter).

### Example: Aggregation Table Schema

| feature_key | date | total_evaluations | enabled_count | disabled_count |  
|--------------|------|------------------|----------------|  
| `new_checkout` | 2025-10-06 | 12,301 | 7,201 | 5,100 |

This can be updated every few minutes via cron or background worker.

---

# 🔍 3️⃣ Exposure Tracking (Who Saw What)

For A/B rollouts or percentage rollouts, track **who got what version**.

```js
await db.featureExposure.insert({
  featureKey,
  userId,
  variant: selectedVariant,  // e.g., "A", "B", "control"
  rolloutPercent: 25,
  country: user.country,
  timestamp: new Date(),
});
```

✅ Enables downstream analysis:

- Conversion rates by variant
    
- Engagement per rollout cohort
    
- Behavior-based tuning of rollout %
    

---

# 🪪 4️⃣ Change Auditing (Toggle History)

Always audit **who changed flags** and **what changed**.

### Schema:

|id|feature_key|changed_by|old_value|new_value|changed_at|
|---|---|---|---|---|---|
|1|new_checkout|alice@dev|false|true|2025-10-05|

### Example Trigger:

```js
CREATE TRIGGER flag_audit_trigger
AFTER UPDATE ON feature_flags
FOR EACH ROW
INSERT INTO feature_audit(feature_key, changed_by, old_value, new_value, changed_at)
VALUES (NEW.key, SESSION_USER, OLD.enabled, NEW.enabled, NOW());
```

✅ Enables rollback, traceability, and accountability.

---

# 📈 5️⃣ Operational Metrics (Health & Performance)

Use **application metrics** for observability — integrate with **Prometheus**, **Datadog**, or **OpenTelemetry**.

Track:

- **Flag fetch latency**
    
- **Cache hit/miss ratio**
    
- **Config sync delay**
    
- **Feature evaluation time**
    

### Example (OpenTelemetry):

```js
const { metrics } = require('@opentelemetry/api');

const featureEvalCounter = metrics.getMeter('feature-flags')
  .createCounter('feature_flag_evaluations', { description: 'Feature flag evaluations count' });

function recordEvaluation(featureKey) {
  featureEvalCounter.add(1, { feature: featureKey });
}
```

✅ These show up in Grafana dashboards like:

- “Feature evaluation QPS per flag”
    
- “DB vs cache lookup ratio”
    
- “Average latency per flag evaluation”
    

---

# 🧠 6️⃣ Alerting & Dashboards

Once metrics flow in, set up **dashboards & alerts**:

|Alert|Threshold|Example Action|
|---|---|---|
|🔴 High DB latency|>200ms avg flag fetch|Check caching layer|
|⚠️ Feature toggle flaps|>3 changes/hour|Investigate toggle churn|
|⚙️ Cache miss rate|>10%|Increase TTL or pre-warm cache|
|📉 Drop in flag eval count|-30% from avg|Possible code path regression|

---

# 🧩 7️⃣ Example Architecture (Self-managed Flags + Observability)

```
[App Service]
   ↓ (flag check)
[FeatureFlag Cache] ←→ [DB Flags Table]
   ↓ (metrics & usage events)
[Telemetry Collector] → [Prometheus / Grafana]
[Event Stream] → [Analytics DB / BigQuery]
[AUDIT LOG] → [Change History Table]
```

✅ **Realtime analytics**  
✅ **Historical trends**  
✅ **Auditable changes**  
✅ **Full visibility** into rollout impact

---

# 🧱 8️⃣ Example Table Designs

### `feature_flags`

| id | key | enabled | rollout_percent | updated_at | updated_by |

### `feature_usage`

| id | feature_key | user_id | enabled | evaluated_at |

### `feature_exposure`

| id | feature_key | user_id | variant | rollout_percent | timestamp |

### `feature_audit`

| id | feature_key | old_value | new_value | changed_by | changed_at |

---

# 🚀 9️⃣ Modern Developer Practice

Today, developers often combine:

- **DB Flags** → for config and control
    
- **Telemetry / OpenTelemetry** → for metrics
    
- **ELK or BigQuery** → for analytics
    
- **Grafana / Kibana** → for visualization
    
- **Audit Table / Event Log** → for compliance
    

This hybrid gives **LaunchDarkly-grade observability**, even in a self-hosted setup.

---

# 💡 TL;DR

|Layer|What It Does|Implementation|
|---|---|---|
|**Evaluation Tracking**|Counts & outcomes|Insert / batch log|
|**Exposure Tracking**|Variant visibility|User-level logs|
|**Change Auditing**|Toggle history|DB triggers|
|**Performance Metrics**|Latency, cache hits|OpenTelemetry / Prometheus|
|**Dashboards & Alerts**|Visualization|Grafana, Datadog|

---





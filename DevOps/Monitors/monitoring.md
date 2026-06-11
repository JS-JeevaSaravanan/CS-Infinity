

# Complete Monitoring & Observability Guide

## Three Pillars of Observability

| Pillar | What It Provides | Example |
|--------|-----------------|---------|
| **Metrics** | Numeric measurements over time | Request rate, error rate, latency P99 |
| **Logs** | Discrete events with context | "User X failed login at 3:02 AM" |
| **Traces** | Request journey across services | Click → API → DB → Cache → Response |

Modern observability adds a fourth: **Events** (deploys, alerts, incidents) that correlate with the three pillars.

---

## Monitoring Taxonomy — By Layer

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          MONITORING LAYERS                                │
├─────────────┬────────────────────────────────────────────────────────────┤
│ Layer       │ Tools / Techniques                                         │
├─────────────┼────────────────────────────────────────────────────────────┤
│ User        │ RUM, Session Replay, Error Tracking, Frustration Signals   │
│ Frontend    │ Synthetic Browser Tests, Core Web Vitals, JS Error Track   │
│ Network     │ NPM, DNS Monitoring, CDN Monitoring, SSL Checks            │
│ API/Gateway │ Synthetic API Tests, Uptime Checks, Rate Limit Monitoring  │
│ Application │ APM, Distributed Tracing, Profiling, Custom Metrics        │
│ Data        │ DB Monitoring, Query Performance, Replication Lag           │
│ Infra       │ Host/Container/Serverless Metrics, Resource Utilization     │
│ Security    │ SIEM, Audit Logs, Threat Detection, WAF Metrics            │
│ Business    │ SLOs, Error Budgets, Funnel Analytics, Revenue Metrics     │
│ CI/CD       │ Deployment Tracking, Pipeline Monitoring, Change Tracking  │
└─────────────┴────────────────────────────────────────────────────────────┘
```

---

## 1. Real User Monitoring (RUM)

| Attribute | Detail |
|-----------|--------|
| **Layer** | User / Frontend |
| **What** | Captures performance + behavior from real users' browsers in production |
| **Data source** | JavaScript SDK in the browser |
| **Key metrics** | LCP, FID, INP, CLS, TTFB, FCP, JS errors, XHR timing |
| **Tools** | Datadog RUM, New Relic Browser, Google Analytics (Web Vitals), Sentry |

### Core Web Vitals (Measured by RUM)

| Metric | Full Name | Measures | Good | Needs Work | Poor |
|--------|-----------|----------|------|------------|------|
| LCP | Largest Contentful Paint | Loading speed | < 2.5s | 2.5–4s | > 4s |
| FID | First Input Delay | Interactivity | < 100ms | 100–300ms | > 300ms |
| INP | Interaction to Next Paint | Responsiveness | < 200ms | 200–500ms | > 500ms |
| CLS | Cumulative Layout Shift | Visual stability | < 0.1 | 0.1–0.25 | > 0.25 |
| TTFB | Time to First Byte | Server speed | < 800ms | 800ms–1.8s | > 1.8s |
| FCP | First Contentful Paint | Perceived speed | < 1.8s | 1.8–3s | > 3s |

### What RUM Tracks

| Category | Examples |
|----------|----------|
| Performance | Page load timings, resource waterfall, long tasks (>50ms) |
| Network | XHR/Fetch timing, failed requests, payload sizes |
| Errors | JS exceptions, unhandled promise rejections, console errors |
| Behavior | Clicks, rage clicks, dead clicks, scrolls, form inputs |
| Sessions | Duration, page views, bounce rate, user journey |
| Context | Browser, OS, device type, geography, connection speed |

### Datadog RUM Init

```typescript
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: '<APP_ID>',
  clientToken: '<CLIENT_TOKEN>',
  site: 'datadoghq.com',
  service: 'my-app',
  env: 'production',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  allowedTracingUrls: [{ match: /https:\/\/api\.example\.com/, propagatorTypes: ['tracecontext'] }],
  defaultPrivacyLevel: 'mask-user-input',
});
```

### Interview Q&A

**Q: How does RUM differ from Synthetic?**
A: RUM = passive, real users, real devices, real networks. Synthetic = active, scripted bots, controlled environments. RUM catches long-tail issues; Synthetic catches availability before users notice.

**Q: What is `allowedTracingUrls`?**
A: Tells the RUM SDK which outgoing requests should have `traceparent`/baggage headers injected — enabling frontend-to-backend trace correlation.

**Q: How does RUM handle SPAs?**
A: SDK auto-detects route changes (history API / hash changes) and creates new "views" without full page reloads. Each route change = new RUM view with its own metrics.

---

## 2. Synthetic Monitoring

| Attribute | Detail |
|-----------|--------|
| **Layer** | Frontend / API / Network |
| **What** | Scripted automated tests from controlled locations on a schedule |
| **Data source** | Bots running from global data centers |
| **Key metrics** | Availability %, response time, SSL expiry, step timing |
| **Tools** | Datadog Synthetics, Pingdom, Checkly, New Relic Synthetics |

### Types of Synthetic Tests

| Type | What It Does | Runs On | Best For |
|------|-------------|---------|----------|
| **API Test** | Single HTTP request + assertions | HTTP client | Uptime, response validation |
| **Multi-step API** | Chained requests with data passing | HTTP client | Workflow validation (auth → action → verify) |
| **Browser Test** | Headless Chromium scripted flow | Real browser | Critical user journeys |
| **SSL Check** | Certificate validity + expiry | TLS handshake | Prevent cert-related outages |
| **DNS Check** | Resolution time + correctness | DNS resolver | DNS propagation issues |
| **TCP/ICMP** | Port availability, ping | Socket | Infrastructure reachability |
| **WebSocket** | Connection + message exchange | WS client | Real-time feature health |
| **gRPC** | Endpoint health check | gRPC client | Service mesh health |

### RUM vs Synthetic — Complete Comparison

| Dimension | RUM | Synthetic |
|-----------|-----|-----------|
| Traffic | Real users | Simulated bots |
| Timing | Only when users visit | 24/7 on schedule |
| Devices | Users' actual devices | Controlled (fixed viewport, CPU) |
| Networks | Users' actual networks | Data center connections |
| Coverage | Whatever users happen to do | Only scripted paths |
| Pre-deploy | No | Yes (CI/CD integration) |
| Baseline | Variable (user diversity) | Consistent (same conditions) |
| Blind spots | Pages nobody visits | Flows nobody scripted |
| Cost | Per session ingested | Per test execution |
| Alerting | Aggregate thresholds | Per-run pass/fail |

### Interview Q&A

**Q: When would Synthetic catch something RUM wouldn't?**
A: 3 AM outage when no users are online; SSL cert expiring in 7 days; a region-specific DNS failure affecting users who haven't visited yet.

**Q: When would RUM catch something Synthetic wouldn't?**
A: Performance degradation on slow 3G mobile in India; a JS error triggered only by a specific browser extension; rage clicks on a confusing UI element.

**Q: Can Synthetic tests run in CI/CD?**
A: Yes — trigger synthetics as a pipeline gate. If the critical browser test fails post-deploy, auto-rollback.

---

## 3. Browser Tests (Synthetic Subtype)

| Attribute | Detail |
|-----------|--------|
| **Layer** | Frontend |
| **What** | Headless browser executing multi-step user flows |
| **Data source** | Managed Chromium instances in Datadog infrastructure |
| **Key metrics** | Step duration, screenshots, resource waterfall, assertion pass/fail |
| **Tools** | Datadog Browser Tests, Checkly, New Relic Scripted Browsers |

### Browser Test vs E2E Test (Playwright/Cypress)

| Dimension | Browser Test (Synthetic) | E2E Test (Playwright/Cypress) |
|-----------|--------------------------|-------------------------------|
| **Purpose** | Production monitoring & alerting | Pre-deploy validation |
| **Runs in** | Vendor-managed infrastructure | CI pipeline or local |
| **Environment** | Production / staging (real infra) | Test environment (may be mocked) |
| **Frequency** | Every N minutes, 24/7 | On PR / merge / release |
| **Alerting** | PagerDuty, Slack, email | Build failure |
| **Tests what** | "Is production working NOW?" | "Will this code work IF deployed?" |
| **Third-party deps** | Tests real third-party integrations | Often mocked/stubbed |
| **Cost model** | Per-execution pricing | CI compute time |
| **Maintenance** | Breaks when UI changes | Breaks when UI changes |
| **Debugging** | Screenshots + video + waterfall | Full browser DevTools |

### Interview Q&A

**Q: Why have both Browser Tests AND E2E tests?**
A: E2E validates code before deploy. Browser Tests validate production after deploy. E2E can't catch CDN failures, third-party outages, or infrastructure issues. They complement each other.

---

## 4. APM (Application Performance Monitoring)

| Attribute | Detail |
|-----------|--------|
| **Layer** | Application / Backend |
| **What** | Monitors request latency, throughput, errors, and dependencies at code level |
| **Data source** | Language-specific agent/library (dd-trace, OpenTelemetry) |
| **Key metrics** | Latency (P50/P95/P99), throughput, error rate, apdex |
| **Tools** | Datadog APM, New Relic APM, Dynatrace, Jaeger, Zipkin |

### What APM Tracks

| Category | Metrics |
|----------|---------|
| Requests | Latency distribution, throughput, error rate per endpoint |
| Dependencies | DB query time, external HTTP calls, cache hit/miss ratio |
| Resources | CPU, memory, GC pauses, event loop lag (Node.js) |
| Code-level | Hot functions, slow spans, N+1 queries |
| Deployments | Performance diff between versions |

### Key APM Concepts

| Concept | Description | Interview Tip |
|---------|-------------|---------------|
| **Service** | Logical unit (e.g., `reputation-api`) | One service = one process with a name |
| **Resource** | Specific endpoint or operation (e.g., `GET /reviews`) | Group traces by resource for per-endpoint metrics |
| **Trace** | Full request journey across services | One trace = one user action end-to-end |
| **Span** | Single operation within a trace | Smallest unit — one DB query, one HTTP call |
| **Service Map** | Dependency graph with health indicators | Shows which services talk to which |
| **Flame Graph** | Time breakdown per function | X-axis = time, Y-axis = call stack |
| **Apdex** | User satisfaction score (0–1) | Based on response time thresholds |

### RED Method (Golden Signals for Services)

| Signal | What | Alert When |
|--------|------|------------|
| **R**ate | Requests per second | Sudden drop (outage) or spike (attack) |
| **E**rrors | Error responses per second | Exceeds baseline |
| **D**uration | Latency per request | P95 exceeds threshold |

### Datadog APM Setup (Node.js)

```typescript
// MUST be imported before everything else
import tracer from 'dd-trace';

tracer.init({
  service: 'reputation-api',
  env: 'production',
  version: '1.0.0',
  logInjection: true,       // adds trace_id to logs
  runtimeMetrics: true,     // GC, event loop, heap
  profiling: true,          // continuous profiling
  appsec: true,             // application security
});
```

### Interview Q&A

**Q: What's the difference between APM and tracing?**
A: APM is the broader discipline (metrics + traces + service maps + profiling). Tracing is one component — following a request across services. APM uses traces to compute aggregate metrics.

**Q: What's the overhead of APM?**
A: Typically 1-3% CPU/memory. Datadog uses sampling to control volume — head-based (decide at ingestion) or tail-based (decide after seeing full trace, keeping interesting ones).

**Q: What are "hot spots" in APM?**
A: Endpoints or functions consuming disproportionate resources. Found via flame graphs or sorting by total self-time.

---

## 5. Distributed Tracing

| Attribute | Detail |
|-----------|--------|
| **Layer** | Application (cross-service) |
| **What** | Tracks a single request across multiple services with timing |
| **Data source** | Trace context propagated via HTTP headers |
| **Key metrics** | Trace duration, span count, error spans, cross-service latency |
| **Tools** | Datadog, Jaeger, Zipkin, AWS X-Ray, OpenTelemetry |

### Trace Propagation Headers

| Header | Standard | Purpose |
|--------|----------|---------|
| `traceparent` | W3C Trace Context | `version-traceId-spanId-flags` |
| `baggage` | W3C Baggage | Key-value context (user ID, tenant, etc.) |
| `x-datadog-trace-id` | Datadog | Vendor-specific trace ID |
| `x-datadog-parent-id` | Datadog | Vendor-specific parent span |
| `x-b3-traceid` | Zipkin/B3 | Zipkin-style propagation |
| `uber-trace-id` | Jaeger | Jaeger-style propagation |

### Trace Flow Example

```
[Browser RUM Span: 1200ms total]
 └─ XHR POST /api/reviews/respond (traceparent injected)
     │
     ▼
[API Gateway Span: 15ms]
 └─ Route to service
     │
     ▼
[Auth Span: 45ms]
 ├─ JWT validation: 5ms
 └─ Permission check (Redis): 40ms
     │
     ▼
[Reputation API Span: 800ms]
 ├─ DB Read (PostgreSQL): 120ms
 │   └─ SELECT review WHERE id = $1
 ├─ Google API Call: 550ms
 │   └─ POST reply to review
 ├─ DB Write (PostgreSQL): 80ms
 │   └─ UPDATE review SET responded_at = NOW()
 └─ SQS Publish: 50ms
     └─ Send notification event
```

### Sampling Strategies

| Strategy | How It Works | Trade-off |
|----------|-------------|-----------|
| **Head-based** | Decide to keep/drop at trace start | Fast, but may miss errors in dropped traces |
| **Tail-based** | Decide after trace completes | Catches all errors, but requires buffering |
| **Priority sampling** | Keep all errors + sample normal | Good balance for most apps |
| **Rule-based** | Keep 100% for specific endpoints | Ensures critical paths always have traces |

### Interview Q&A

**Q: How do you connect a frontend click to a backend database query?**
A: RUM SDK injects `traceparent` header on XHR/Fetch. Backend reads the trace ID and creates child spans. Same trace ID links everything. This requires `allowedTracingUrls` config.

**Q: What's context propagation?**
A: Passing trace context (trace ID + span ID) across service boundaries via HTTP headers, message queue attributes, or other transport mechanisms so all services contribute spans to the same trace.

**Q: What happens when a service doesn't propagate context?**
A: The trace breaks — you get two disconnected traces. The frontend shows the request; the backend shows its work; but they're not linked. Appears as "missing spans."

---

## 6. Log Management

| Attribute | Detail |
|-----------|--------|
| **Layer** | All layers |
| **What** | Centralized collection, indexing, and search of application logs |
| **Data source** | stdout/stderr, log files, syslog |
| **Key metrics** | Log volume, error rate by service, pattern frequency |
| **Tools** | Datadog Logs, ELK Stack, Splunk, Loki (Grafana), CloudWatch |

### Structured vs Unstructured

```
# Unstructured (bad for querying)
[2024-01-15 03:02:15] ERROR: Failed to fetch reviews for customer cust-123

# Structured JSON (good for querying)
{
  "timestamp": "2024-01-15T03:02:15Z",
  "level": "error",
  "message": "Failed to fetch reviews",
  "service": "google-review-job",
  "customerId": "cust-123",
  "error": "ETIMEDOUT",
  "duration_ms": 30000,
  "dd": {
    "trace_id": "abc123def456",
    "span_id": "789ghi"
  }
}
```

### Log ↔ Trace Correlation

When `logInjection: true`:
- Every log line gets `dd.trace_id` and `dd.span_id`
- In Datadog: click a log → jump to exact trace
- In a trace: click "Logs" tab → see all logs emitted during that request

### Log Levels

| Level | When to Use | Alerts? |
|-------|-------------|---------|
| FATAL | App cannot continue | Immediate page |
| ERROR | Operation failed, needs attention | Yes (threshold) |
| WARN | Unexpected but handled | Monitor trend |
| INFO | Normal business events | No |
| DEBUG | Diagnostic detail | Never in prod at volume |
| TRACE | Ultra-verbose (framework internals) | Never in prod |

### Interview Q&A

**Q: Why structured logging?**
A: Enables filtering (`service:api AND level:error AND customerId:cust-123`), aggregation (error count by service), and automatic correlation with traces. Unstructured logs require regex parsing.

**Q: How do you handle log volume?**
A: Exclusion filters (drop debug in prod), sampling (keep 10% of health check logs), archiving (cold storage after 15 days), and log-to-metric (convert patterns into numeric metrics without storing every line).

---

## 7. Infrastructure Monitoring

| Attribute | Detail |
|-----------|--------|
| **Layer** | Infrastructure |
| **What** | Monitors compute, storage, network, and platform resources |
| **Data source** | Agent on host, cloud integration APIs, container runtime |
| **Key metrics** | CPU, memory, disk, network, container restarts, queue depth |
| **Tools** | Datadog Infra, Prometheus + Grafana, CloudWatch, Nagios |

### USE Method (Golden Signals for Infrastructure)

| Signal | What | Example |
|--------|------|---------|
| **U**tilization | % of resource in use | CPU at 85% |
| **S**aturation | Work queued waiting | 50 requests waiting for DB connection |
| **E**rrors | Error events | Disk I/O errors, packet drops |

### Key Metrics by Resource

| Resource | Critical Metrics | Alert Threshold (typical) |
|----------|-----------------|--------------------------|
| CPU | Utilization, steal time, iowait | > 80% sustained |
| Memory | Used %, swap usage, OOM kills | > 85% or any OOM |
| Disk | IOPS, latency, utilization, free space | > 90% full |
| Network | Bandwidth, packet loss, retransmits | > 1% packet loss |
| Container | Restart count, OOMKilled, pending | Any OOMKill |
| Database | Connections used, replication lag, IOPS | Pool > 80% |
| Queue (SQS) | Depth, age of oldest, DLQ size | Age > 5 min |
| Lambda | Cold starts, throttles, duration | Throttles > 0 |

### Interview Q&A

**Q: Difference between USE and RED methods?**
A: USE (Utilization, Saturation, Errors) = for **infrastructure** resources. RED (Rate, Errors, Duration) = for **services/endpoints**. Use both together for full picture.

**Q: How do infra metrics correlate with APM?**
A: APM shows "this endpoint is slow." Infra shows "because the database host CPU is at 95%." Together they answer both "what's slow" and "why."

---

## 8. Error Tracking

| Attribute | Detail |
|-----------|--------|
| **Layer** | Frontend + Backend |
| **What** | Groups, deduplicates, and prioritizes application errors |
| **Data source** | RUM (frontend), APM (backend), log patterns |
| **Key metrics** | Error count, affected users, first/last seen, regression detection |
| **Tools** | Datadog Error Tracking, Sentry, Bugsnag, Rollbar |

### Error Tracking vs Raw Logs

| Dimension | Raw Logs | Error Tracking |
|-----------|----------|----------------|
| Grouping | Individual entries | Fingerprinted into issues |
| Context | Whatever you logged | Stack trace + user + session + request |
| Priority | Manual triage | Auto-ranked by user impact |
| Lifecycle | No state | New → Reviewed → Resolved → Regressed |
| Volume | Thousands of lines | Grouped into tens of issues |
| Source maps | Not applied | Auto-applied (unminified traces) |

### Key Features

| Feature | Value |
|---------|-------|
| **Fingerprinting** | Same error across users → one issue |
| **Regression** | Resolved error reappears → alert |
| **Impact** | "2,300 users affected in last hour" |
| **Source maps** | Unminified production stack traces |
| **Assignees** | Route to team/individual |
| **Integrations** | Auto-create Jira ticket |

### Interview Q&A

**Q: How does error fingerprinting work?**
A: Groups by normalized stack trace (removes line numbers, hashes function names). Same logical error from different users = one issue, not thousands of duplicate log lines.

---

## 9. Session Replay

| Attribute | Detail |
|-----------|--------|
| **Layer** | User / Frontend |
| **What** | Records and replays user sessions as DOM reconstructions |
| **Data source** | DOM mutations captured by RUM SDK |
| **Key metrics** | Session duration, frustration score, replay availability |
| **Tools** | Datadog Session Replay, FullStory, Hotjar, LogRocket |

### What It Captures

| Data | Detail |
|------|--------|
| DOM changes | Every mutation (text, attributes, add/remove elements) |
| Mouse | Movement, clicks, hovers |
| Scroll | Position over time |
| Network | XHR timeline overlaid on replay |
| Console | Logs and errors synced to timeline |
| Frustration | Rage clicks, dead clicks, error clicks |

### What It Is NOT

- Not a screen recording (no video, just DOM reconstruction)
- Not always-on (sampled, e.g., 20% of sessions)
- Not capturing outside the browser (native dialogs, browser chrome)

### Privacy Levels

| Level | What Happens | Use When |
|-------|-------------|----------|
| `mask` | All text → asterisks | Default for sensitive apps |
| `mask-user-input` | Only form fields masked | Balance of insight + privacy |
| `allow` | Nothing masked | Internal tools only |
| `data-dd-privacy="hidden"` | Element replaced with placeholder | Per-element override |

### Interview Q&A

**Q: How is Session Replay different from a screen recording?**
A: It reconstructs the DOM, not pixels. This means it's searchable, you can inspect elements, and the file size is tiny (KB vs MB). But it can't capture canvas elements, WebGL, or native browser UI.

**Q: How does it handle privacy?**
A: Masking is applied at capture time in the browser — sensitive data never leaves the user's device. You can mask all text, only inputs, or specific elements via HTML attributes.

---

## 10. Continuous Profiling

| Attribute | Detail |
|-----------|--------|
| **Layer** | Application (deep) |
| **What** | Samples CPU/memory usage at function level in production |
| **Data source** | Language runtime profiler (V8, JVM, Go pprof) |
| **Key metrics** | CPU time per function, allocations, heap objects |
| **Tools** | Datadog Profiling, Pyroscope, async-profiler, pprof |

### Profile Types

| Type | Question It Answers |
|------|-------------------|
| CPU | "Which functions burn the most CPU?" |
| Wall Time | "Where does my request spend time (including I/O waits)?" |
| Heap (Live Objects) | "What's using memory right now?" |
| Allocations | "Which code allocates the most?" (GC pressure) |

### When to Use

| Scenario | Why Profiling |
|----------|--------------|
| APM shows a slow span, need to know which line | Flame graph reveals the hot function |
| Memory growing over time | Heap profile shows what's accumulating |
| CPU high, unclear why | CPU profile identifies the hot path |
| Comparing two deploys | Diff flame graphs show what changed |

### Interview Q&A

**Q: Overhead of continuous profiling?**
A: ~1-2% CPU, negligible memory. Uses statistical sampling (not instrumentation) so it's safe for production.

**Q: Difference between profiling and APM?**
A: APM tells you "this endpoint takes 500ms." Profiling tells you "350ms of that is in `JSON.parse()` on line 42." APM = request-level; Profiling = code-level.

---

## 11. SLOs (Service Level Objectives)

| Attribute | Detail |
|-----------|--------|
| **Layer** | Business / Reliability |
| **What** | Defines measurable reliability targets and tracks error budgets |
| **Data source** | Metrics from any other monitoring tool |
| **Key metrics** | SLI value, error budget remaining, burn rate |
| **Tools** | Datadog SLOs, Google Cloud SLO Monitoring, Nobl9 |

### Terminology

| Term | Definition | Example |
|------|-----------|---------|
| **SLI** | Service Level Indicator — the metric | "% of requests completing in < 500ms" |
| **SLO** | Service Level Objective — the target | "99.9% of requests < 500ms over 30 days" |
| **SLA** | Service Level Agreement — contractual | "If we miss 99.5%, customer gets credits" |
| **Error Budget** | Allowed unreliability | 0.1% = 43 minutes downtime/month |
| **Burn Rate** | Speed of budget consumption | 2x = budget exhausted in 15 days |

### Common SLOs

| SLO Type | SLI | Typical Target |
|----------|-----|----------------|
| Availability | Successful responses / total requests | 99.9% |
| Latency | Requests < threshold / total requests | 99% < 500ms |
| Correctness | Correct responses / total responses | 99.99% |
| Freshness | Data updated within X minutes | 99.5% |

### Burn Rate Alerts

| Burn Rate | Meaning | Alert Severity |
|-----------|---------|----------------|
| 14.4x | Budget gone in 1 hour | Critical (page) |
| 6x | Budget gone in 5 hours | High (urgent) |
| 1x | Budget gone at month end (on track) | Warning |
| < 1x | Budget healthy | No alert |

### Interview Q&A

**Q: Why SLOs over simple threshold alerts?**
A: Threshold alerts fire on any single spike. SLOs measure cumulative reliability — brief spikes that don't affect the budget don't page anyone. This reduces alert fatigue while catching sustained degradation.

**Q: What's the relationship between SLO and SLA?**
A: SLA = external contract with consequences (refunds). SLO = internal target, always stricter than SLA. If SLA is 99.9%, SLO might be 99.95% — giving a buffer before breaching the contract.

---

## 12. Network Performance Monitoring (NPM)

| Attribute | Detail |
|-----------|--------|
| **Layer** | Network |
| **What** | Maps and monitors network traffic between services and external deps |
| **Data source** | eBPF probes, flow logs, SNMP |
| **Key metrics** | TCP retransmits, latency between endpoints, DNS failures, traffic volume |
| **Tools** | Datadog NPM, Kentik, ThousandEyes, AWS VPC Flow Logs |

### Interview Q&A

**Q: When does NPM matter vs APM?**
A: APM says "this HTTP call took 2s." NPM says "because there are 15% TCP retransmits between these two availability zones." NPM diagnoses network-layer issues invisible to application code.

---

## 13. Database Monitoring

| Attribute | Detail |
|-----------|--------|
| **Layer** | Data |
| **What** | Monitors query performance, connections, locks, and replication |
| **Data source** | DB agent, pg_stat_statements, slow query log |
| **Key metrics** | Query time (P95), active connections, lock waits, replication lag |
| **Tools** | Datadog DBM, pganalyze, AWS RDS Performance Insights |

### Key Indicators

| Metric | Why It Matters |
|--------|---------------|
| Slow queries | Direct impact on API latency |
| Connection pool usage | Exhaustion = cascading failures |
| Lock contention | Blocking = timeouts |
| Replication lag | Stale reads in replicas |
| Cache hit ratio | Low = excessive disk I/O |

---

## 14. Serverless Monitoring

| Attribute | Detail |
|-----------|--------|
| **Layer** | Infrastructure (serverless) |
| **What** | Monitors Lambda/Step Functions execution, cost, and cold starts |
| **Data source** | Cloud provider APIs, extensions |
| **Key metrics** | Duration, cold start %, throttles, concurrent executions, cost |
| **Tools** | Datadog Serverless, AWS X-Ray, Lumigo, Epsagon |

### Key Concerns

| Issue | Impact |
|-------|--------|
| Cold starts | First request after idle is slow (100ms–2s) |
| Throttling | Concurrent limit reached = dropped invocations |
| Timeout | Function exceeds max duration = retry/DLQ |
| Memory | Under-provisioned = slow; over-provisioned = expensive |

---

## 15. Security Monitoring (SIEM + ASM)

| Attribute | Detail |
|-----------|--------|
| **Layer** | Security |
| **What** | Detects threats, suspicious activity, and vulnerabilities in runtime |
| **Data source** | Logs, traces, WAF events, vulnerability scans |
| **Key metrics** | Threat signals, blocked attacks, vulnerability count |
| **Tools** | Datadog Security (ASM, CSM, SIEM), Splunk, CrowdStrike |

### Types

| Type | What It Does |
|------|-------------|
| **ASM** (App Security Monitoring) | Detects attacks in application traffic (SQLi, XSS) |
| **CSM** (Cloud Security Monitoring) | Misconfiguration detection in cloud resources |
| **SIEM** | Correlates security signals across all sources |
| **Vulnerability Management** | Scans dependencies for known CVEs |

---

## 16. CI/CD & Deployment Monitoring

| Attribute | Detail |
|-----------|--------|
| **Layer** | CI/CD |
| **What** | Tracks pipeline performance, deploy frequency, and change failure rate |
| **Data source** | CI provider APIs, deploy events |
| **Key metrics** | DORA metrics (deploy frequency, lead time, MTTR, change failure rate) |
| **Tools** | Datadog CI Visibility, LinearB, Sleuth, Jellyfish |

### DORA Metrics

| Metric | What | Elite Target |
|--------|------|-------------|
| Deploy Frequency | How often you deploy | Multiple times per day |
| Lead Time | Commit to production | < 1 hour |
| MTTR | Time to restore service | < 1 hour |
| Change Failure Rate | % of deploys causing incidents | < 5% |

---

## Complete Comparison Matrix

| Tool | Layer | Passive/Active | Detects Before Users? | Requires Real Traffic? | Overhead |
|------|-------|---------------|----------------------|----------------------|----------|
| RUM | Frontend | Passive | No | Yes | ~2KB SDK |
| Synthetic API | API | Active | Yes | No | Zero (external) |
| Synthetic Browser | Frontend | Active | Yes | No | Zero (external) |
| APM | Backend | Passive | No | Yes | 1-3% |
| Distributed Tracing | Cross-service | Passive | No | Yes | Included in APM |
| Log Management | All | Passive | No | Yes | Disk + network |
| Infra Monitoring | Infrastructure | Passive | Sometimes | No | < 1% |
| Error Tracking | Frontend + Backend | Passive | No | Yes | Included in RUM/APM |
| Session Replay | Frontend | Passive | No | Yes | ~10KB/session |
| Profiling | Backend (deep) | Passive | No | Yes | 1-2% |
| SLOs | Business | Passive | Depends on burn rate | Yes | Zero (computed) |
| NPM | Network | Passive | No | Yes | < 1% (eBPF) |
| DB Monitoring | Data | Passive | No | Yes | < 1% |
| Security (ASM) | Application | Passive | Sometimes | Yes | 1-2% |
| CI/CD Monitoring | Pipeline | Passive | Yes (pre-deploy) | No | Zero |

---

## How Everything Connects (Full Picture)

```
USER DEVICE
│
├─ RUM SDK ──────────────────── Performance + Errors + Behavior
├─ Session Replay ───────────── DOM Recording
├─ Synthetic Browser ────────── Scheduled Flow Validation
│
│  [traceparent + baggage headers]
│
▼
API GATEWAY / CDN
│
├─ Synthetic API ────────────── Uptime + Response Validation
├─ WAF / ASM ────────────────── Attack Detection
│
▼
APPLICATION SERVICES
│
├─ APM ──────────────────────── Request Metrics + Service Map
├─ Distributed Tracing ──────── Cross-Service Request Flow
├─ Continuous Profiling ─────── Function-Level Performance
├─ Error Tracking ───────────── Grouped + Prioritized Errors
├─ Log Management ───────────── Structured Events (correlated via trace_id)
│
▼
DATA LAYER
│
├─ Database Monitoring ──────── Query Performance + Connections
├─ Cache Metrics ────────────── Hit Rate + Evictions
├─ Queue Monitoring ─────────── Depth + Age + DLQ
│
▼
INFRASTRUCTURE
│
├─ Host/Container Metrics ───── CPU, Memory, Disk, Network
├─ Serverless Monitoring ────── Cold Starts, Throttles, Duration
├─ NPM ──────────────────────── Network Traffic + Retransmits
│
▼
RELIABILITY & BUSINESS
│
├─ SLOs ─────────────────────── Error Budgets + Burn Rate
├─ Alerting ─────────────────── Threshold + Anomaly + Composite
├─ DORA Metrics ─────────────── Deploy Frequency, MTTR, Failure Rate
├─ Dashboards ───────────────── Unified Visualization
└─ Incident Management ──────── Triage + Response + Postmortem
```

---

## Interview Power Answers

### "How would you set up monitoring for a new service?"

1. **APM + Tracing** — instrument the runtime, auto-traces for HTTP/DB/cache
2. **Structured Logging** — JSON logs with trace correlation
3. **Infrastructure** — container/host metrics + auto-scaling alerts
4. **Synthetic API test** — health check every minute from 3+ locations
5. **Error Tracking** — group errors, alert on new issues
6. **SLO** — define availability + latency targets, set burn rate alerts
7. **RUM** (if frontend) — Core Web Vitals + user behavior
8. **Dashboard** — single pane: RED metrics + infra + SLO status

### "How do you debug a production performance issue?"

```
User reports slowness
  → Check RUM: which pages? which users? which browsers?
  → Check Synthetic: is it consistent or user-specific?
  → Check APM: which endpoint is slow? which span dominates?
  → Check Tracing: is it this service or a dependency?
  → Check DB Monitoring: slow query? lock contention?
  → Check Infra: CPU/memory/disk saturation?
  → Check Profiling: which function? which line?
  → Fix → Deploy → Verify via RUM + Synthetic
```

### "How do you reduce alert fatigue?"

1. Use **SLOs with burn rates** instead of simple thresholds
2. **Composite alerts** — only fire when multiple signals confirm
3. **Anomaly detection** — alert on deviations, not fixed numbers
4. **Severity tiers** — P1 pages, P2 notifies, P3 creates ticket
5. **Ownership routing** — alerts go to the right team, not everyone
6. **Regular review** — delete alerts nobody acts on

### "RUM vs Synthetic — when to use which?"

| Scenario | Best Tool |
|----------|-----------|
| "Is the site up right now?" | Synthetic |
| "How fast is it for users in India on 3G?" | RUM |
| "Will this deploy break the checkout flow?" | Synthetic (CI gate) |
| "Why are users abandoning this page?" | RUM + Session Replay |
| "Did last night's deploy degrade performance?" | Both (Synthetic for baseline, RUM for real impact) |
| "Test before any user is affected" | Synthetic |
| "Understand the long tail (P99)" | RUM |



****





## 🧠 What’s an Embed Script in RUM?

An **embed script** is a **small JavaScript snippet** you insert into your web pages (often in the `<head>`).  
Its job is to **collect real-time performance and user interaction data** from real users’ browsers and send it to a monitoring backend.

Think of it as the “sensor” for Real User Monitoring.

---

## ⚙️ Typical RUM Script Flow

1. **Initialize** → Load the RUM library (from your monitoring vendor or custom endpoint).
    
2. **Collect Data** → Hook into browser APIs like:
    
    - `PerformanceNavigationTiming`
        
    - `PerformanceObserver`
        
    - `window.onerror`, `fetch`, `XMLHttpRequest`
        
    - `CLS`, `LCP`, `FID` via `PerformanceObserver`
        
3. **Send Data** → Push the collected metrics to your RUM backend periodically (via `beacon`, `fetch`, or `XHR`).
    

---

## 💡 Example 1: Custom Lightweight RUM Script (Vanilla JS)

```html
<script>
(function() {
  const rumData = {
    url: location.href,
    ua: navigator.userAgent,
    startTime: performance.timeOrigin,
    timings: {},
  };

  // Capture navigation timing
  window.addEventListener('load', () => {
    const [nav] = performance.getEntriesByType('navigation');
    rumData.timings = {
      dns: nav.domainLookupEnd - nav.domainLookupStart,
      tcp: nav.connectEnd - nav.connectStart,
      ttfb: nav.responseStart - nav.requestStart,
      domLoad: nav.domContentLoadedEventEnd - nav.startTime,
      totalLoad: nav.loadEventEnd - nav.startTime
    };

    // Capture LCP (Largest Contentful Paint)
    const po = new PerformanceObserver(list => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      rumData.lcp = last.renderTime || last.loadTime;
    });
    po.observe({type: 'largest-contentful-paint', buffered: true});

    // Send data
    navigator.sendBeacon('https://your-rum-endpoint.com/collect', JSON.stringify(rumData));
  });
})();
</script>
```

### 🧩 What it Does:

- Records **network & rendering performance**
    
- Measures **LCP** (a Core Web Vital)
    
- Sends it all to a backend collector via **`sendBeacon()`** (non-blocking)
    

---

## 💡 Example 2: Using a Vendor SDK (Datadog RUM)

```html
<script src="https://www.datadoghq-browser-agent.com/datadog-rum-v4.js"></script>
<script>
  window.DD_RUM && DD_RUM.init({
    clientToken: 'pub1234567890abcdef',
    applicationId: 'app-abc-123',
    site: 'datadoghq.com',
    service: 'my-webapp',
    env: 'production',
    sampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel: 'mask-user-input'
  });
</script>
```

### 🧩 What it Does:

- Loads **Datadog’s RUM agent**
    
- Tracks:
    
    - Page loads
        
    - Resource timings
        
    - JS errors
        
    - User interactions
        
    - Session replays (if enabled)
        

---

## 🔍 Deep Dive: Core APIs Used in RUM Scripts

|API|Purpose|Example|
|---|---|---|
|`PerformanceObserver`|Observe metrics like LCP, FID, CLS|`observe({ type: 'longtask' })`|
|`Performance.getEntriesByType()`|Fetch timing entries|`performance.getEntriesByType('resource')`|
|`window.onerror`, `window.onunhandledrejection`|Capture JS errors|send to RUM backend|
|`navigator.sendBeacon()`|Send async data safely|no blocking on unload|
|`User Timing API`|Custom app-level timings|`performance.mark('checkout-start')`|

---

## 📊 Backend Handling

On your server (e.g., Node.js, Go, or Python), you’d:

- Receive JSON payloads
    
- Store in a time-series DB (e.g., Elastic, ClickHouse, InfluxDB)
    
- Visualize via dashboards (Grafana, Kibana, Datadog UI, etc.)
    

---

## ✅ Summary

> A RUM embed script is a **client-side agent** that taps into browser APIs to **measure, capture, and report** how real users experience your site.

**In short:**

> Script = Sensors → Data = Reality → Insight = Better UX 🚀

---


## **crisp + production-ready** Datadog RUM setup for a **React app using React Router (v6+)**.


### 🧩 **Step 1 — Install**

```bash
npm install @datadog/browser-rum react-router-dom
```

---

### ⚙️ **Step 2 — Initialize RUM before React mounts**

```js
// src/rum.js
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'YOUR_APP_ID',
  clientToken: 'YOUR_CLIENT_TOKEN',
  site: 'datadoghq.com',     // or datadoghq.eu / datad0g.us
  service: 'my-react-app',
  env: 'production',
  version: '1.0.0',
  sampleRate: 100,
  trackInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

// enable session replay (optional)
datadogRum.startSessionReplayRecording();
```

---

### ⚛️ **Step 3 — Integrate with React Router**

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useLocation } from 'react-router-dom';
import App from './App';
import './rum'; // 👈 import RUM init

import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

// Track route changes automatically
function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    datadogRum.addAction('route_change', { path: location.pathname });
  }, [location]);

  return null;
}

const Root = () => (
  <BrowserRouter>
    <RouteTracker />
    <App />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
```

---

### ✅ **How it works**

- `rum.js` initializes Datadog RUM early — before the app loads.
    
- `RouteTracker` listens to **React Router path changes** and logs them as RUM actions.
    
- All user interactions, resources, and performance data are auto-captured.
    

---

⚡ **Summary**

> Drop-in RUM + Router integration = full visibility of **page loads**, **navigations**, and **user experience** in real time.

---


Excellent question — crisp and deep answer 👇

---

## 🧠 Do You Need Backend Setup for Datadog RUM?

### ✅ **Short answer:**

**No backend code is required** to _collect or send RUM data_.

Datadog RUM is **100% client-side** — it sends data **directly from the browser** to Datadog’s RUM intake endpoints (e.g., `https://rum.browser-intake-datadoghq.com`).

---

## ⚙️ What Actually Happens

When you call:

```js
datadogRum.init({ ... });
```

Datadog’s SDK automatically:

1. Captures metrics (load times, user interactions, JS errors, etc.)
    
2. Sends them **directly** via HTTPS to Datadog’s platform.
    
3. Correlates with backend traces (APM) **if configured**.
    

So the **browser → Datadog RUM** flow is fully managed — no need to build or host your own collector.

---

## 🧩 Optional (Advanced) Backend Integrations

You only need backend involvement if you want **enhanced observability** or **security controls**:

|Use Case|What to Add on Backend|
|---|---|
|**Trace linking**|Inject Datadog APM trace headers into frontend responses, so RUM → APM correlation works. Example: `datadog-trace-id`, `datadog-parent-id`.|
|**Custom authentication**|Generate a **temporary client token** from your backend instead of hardcoding it in the frontend.|
|**API monitoring**|Instrument your backend APIs with Datadog **APM SDK** (e.g., Node.js, Java, Python) to correlate frontend and backend latency.|
|**Proxying RUM data**|(Rare) Use a proxy endpoint if corporate policies disallow direct browser → Datadog connections.|

---

### ⚡ Example: Backend-Generated Client Token (Optional)

If you want to avoid exposing your Datadog RUM token publicly:

```js
// server.js (Node.js)
app.get('/rum-token', (req, res) => {
  res.json({ token: process.env.DD_RUM_CLIENT_TOKEN });
});
```

Then in React:

```js
const token = await fetch('/rum-token').then(r => r.json());
datadogRum.init({ clientToken: token, ... });
```

---

## ✅ Summary

|Scenario|Backend Needed?|Why|
|---|---|---|
|Basic RUM setup|❌|Browser sends directly|
|Secure token generation|⚙️ Optional|Avoid exposing client token|
|Trace correlation (APM + RUM)|✅ Recommended|Unified full-stack visibility|

---

So:

> 🚀 For standard React + RUM integration, **no backend changes are required**.  
> But to link frontend sessions with backend traces or hide tokens — yes, add minimal backend logic.

---



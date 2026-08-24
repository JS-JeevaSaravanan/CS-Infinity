Yes. The important distinction is that **HTTP itself generally does not impose one universal “data limit.”** Limits come from different layers: browser, HTTP protocol, server runtime, framework, proxy/load balancer, API gateway, database, and finally your application's own data structures.

For your case—**POST endpoint returning JSON with ~250–1000 records**—the browser is nowhere near the limiting factor.

## 1. First: distinguish request vs response

An HTTP interaction has two independent payloads:

```text
Client
  │
  │  HTTP Request
  │  ├── URL
  │  ├── Headers
  │  └── Body
  │
  ▼
API
  │
  │  HTTP Response
  │  ├── Status
  │  ├── Headers
  │  └── Body
  │
  ▼
Client
```

So there are two completely different questions:

||Request|Response|
|---|---|---|
|Direction|Browser → API|API → Browser|
|Example|POST body containing filters|JSON containing listings|
|Can be large?|Yes, subject to limits|Yes, subject to limits|
|Browser URL limit relevant?|Only if data is in URL|No|
|Fastify `bodyLimit` relevant?|**Yes**|**No**|
|API Gateway payload limit|Yes|Yes|
|JSON parsing memory|Yes|Yes|

This distinction is particularly important for your endpoint.

---

# 2. HTTP does not say "responses can only be X MB"

HTTP itself is fundamentally a **message protocol**.

A response looks conceptually like:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 580000

{
  "data": [...]
}
```

The HTTP specification doesn't say:

> "A browser can only receive 1 MB."

Instead, individual implementations and infrastructure can impose limits.

For example:

```text
Browser
   ↓
CloudFront
   ↓
ALB
   ↓
Fastify / NestJS
   ↓
Database
```

Every layer potentially has its own limits.

Therefore:

> **"What is the HTTP response limit?" isn't really a complete question.**

The better question is:

> **"What is the maximum request/response payload supported by every component in our request path?"**

---

# 3. Browser response size

### There is no practical small browser response limit

Browsers routinely handle:

- 100 KB JSON
    
- 1 MB JSON
    
- 10 MB JSON
    
- 100 MB downloads
    
- GB-sized file downloads
    

The browser can receive the response progressively.

For example:

```javascript
const response = await fetch("/api/listings");

const data = await response.json();
```

The browser doesn't have a rule saying:

```text
if response > 1 MB → reject
```

Instead, the constraints become things like:

- available memory
    
- JavaScript heap
    
- JSON parsing cost
    
- rendering cost
    
- network time
    
- application/framework behavior
    

---

# 4. But receiving data ≠ parsing data ≠ rendering data

This is an important distinction.

Suppose your API returns:

```text
580 KB HTTP response
```

That does **not** necessarily mean the browser only uses 580 KB.

The lifecycle is more like:

```text
Network
   ↓
~580 KB compressed/uncompressed response
   ↓
JSON decoding
   ↓
JavaScript string / buffer
   ↓
JSON.parse()
   ↓
JavaScript objects
   ↓
Array of 1000 records
   ↓
React / DataGrid
   ↓
DOM/UI representation
```

Each stage can consume additional memory.

For example, imagine:

```json
{
  "id": 123,
  "name": "Some Provider",
  "address": "Some address",
  "publisher": "GOOGLE",
  ...
}
```

The wire representation might be:

```text
580 KB
```

But once converted into JavaScript objects, the memory footprint can be considerably larger.

So:

> **HTTP payload size and application memory usage are not the same thing.**

---

# 5. JSON is particularly important

JSON is a **text serialization format**.

For example:

```json
{
  "id": 123,
  "name": "John",
  "active": true
}
```

On the network this is text/bytes.

After parsing:

```typescript
{
  id: 123,
  name: "John",
  active: true
}
```

you now have JavaScript objects.

So you have at least two representations:

```text
Network representation
        ↓
JSON text / bytes
        ↓
JavaScript object representation
```

And the latter usually costs more memory.

---

# 6. Data type makes a difference

This is where "1000 records" alone isn't enough to determine payload size.

Consider:

```typescript
{
  id: 123,
  name: "John"
}
```

versus:

```typescript
{
  id: 123,
  name: "John",
  description: "...",
  address: "...",
  metadata: {...},
  openingHours: [...],
  categories: [...],
  reviews: [...]
}
```

Both are **one record**, but their sizes can differ dramatically.

Therefore:

```text
Number of records
        ↓
does NOT directly determine
        ↓
response size
```

A better model is:

```text
Response size ≈
number of records × average serialized record size
+ JSON structure overhead
```

For your numbers:

```text
250 records × ~580 bytes = ~145 KB

1000 records × ~580 bytes = ~580 KB
```

That's very small.

---

# 7. JSON vs other data formats

The data type/serialization format matters too.

For example:

### JSON

```json
{
  "id": 123,
  "name": "John",
  "rating": 4.5
}
```

Advantages:

- human readable
    
- native browser support
    
- easy debugging
    
- excellent ecosystem
    
- convenient TypeScript integration
    

Disadvantage:

- relatively verbose
    

---

### CSV

```text
id,name,rating
123,John,4.5
```

Can be smaller for tabular data, but doesn't naturally represent nested structures.

---

### Protocol Buffers

Binary serialization:

```text
[compact binary representation]
```

Typically much more compact and efficient for machine-to-machine communication.

But it adds complexity and isn't as convenient for a normal browser REST API.

---

### MessagePack / similar binary formats

Also more compact than JSON in many cases.

But again, for a ~500 KB response, optimizing the serialization format would almost certainly be premature.

---

# 8. Compression changes the actual network transfer

This is another important distinction.

Suppose your JSON is:

```text
1 MB uncompressed
```

With gzip/brotli:

```text
~200–400 KB transferred
```

depending heavily on the data.

The API might effectively do:

```text
Application JSON
      ↓
1 MB
      ↓
gzip/brotli
      ↓
300 KB
      ↓
Network
      ↓
Browser decompresses
      ↓
1 MB JSON
      ↓
JSON.parse()
```

So you can have:

```text
Response body size: 1 MB
Network transfer:   300 KB
Browser memory:     potentially several MB
```

These are three different measurements.

---

# 9. URL length is a completely different problem

This is where GET vs POST matters.

Suppose you did:

```http
GET /listings?customerCode=ABC&ids=123,456,789,...
```

Now the data is encoded into the URL.

URLs have practical limits imposed by:

- browsers
    
- web servers
    
- proxies
    
- load balancers
    
- CDNs
    

There isn't one universal HTTP limit.

You'll commonly encounter practical limits in the **few-thousand-character range**, depending on the infrastructure.

That's why this can become problematic:

```text
GET /listings?ids=1,2,3,4,5,6,7,8,.......
```

With hundreds/thousands of IDs.

---

# 10. POST body is different

With:

```http
POST /listings/search
Content-Type: application/json

{
  "customerCode": "ABC",
  "listingIds": [
    "123",
    "456",
    "789"
  ]
}
```

the data is in the **request body**, not the URL.

Therefore the URL-length constraint doesn't apply to that data.

But the request body still has limits imposed by your infrastructure.

For example:

```text
Browser
  ↓
POST body
  ↓
CloudFront
  ↓
ALB
  ↓
Fastify
  ↓
NestJS
```

Any of these could enforce a request-size limit.

---

# 11. Fastify `bodyLimit`

This one is particularly relevant to your NestJS/Fastify application.

Fastify's `bodyLimit` concerns:

> **incoming request bodies**

For example:

```typescript
{
  customerCode: "...",
  listingIds: [ ... ]
}
```

It does **not** mean:

> "Fastify can only return 1 MB."

So:

```text
POST request
    ↓
bodyLimit applies ✅

GET/POST response
    ↓
bodyLimit does NOT apply ❌
```

That's an important distinction.

---

# 12. Response limits come from infrastructure

This is where you should actually investigate your architecture.

Typical path:

```text
Browser
   ↓
CloudFront
   ↓
ALB
   ↓
NestJS / Fastify
   ↓
RDS
```

or potentially:

```text
Browser
   ↓
API Gateway
   ↓
Lambda
   ↓
Service
```

The second architecture introduces significantly different payload constraints.

For example, AWS API Gateway has documented payload-size constraints, and Lambda synchronous invocation has its own payload limits.

So you shouldn't say:

> "HTTP allows 10 MB."

Instead:

> "Our complete infrastructure path supports X MB."

---

# 13. Database result size is another independent concern

There is also a difference between:

```text
Database result
```

and:

```text
HTTP response
```

Suppose:

```sql
SELECT *
FROM listings
WHERE customer_code = 'ABC';
```

returns:

```text
50,000 rows
```

Your application might retrieve:

```text
50,000 rows
        ↓
Node.js memory
        ↓
map/transform
        ↓
JSON serialization
        ↓
HTTP response
```

Even if the final HTTP response is technically allowed, this can be expensive.

Potential costs:

- DB query time
    
- DB → application network transfer
    
- Node.js memory
    
- object allocation
    
- serialization
    
- CPU
    
- network transfer
    
- browser parsing
    
- browser memory
    
- UI rendering
    

This is why **payload size is not the only performance concern.**

---

# 14. Serialization itself costs CPU

Suppose you return:

```typescript
return {
  data: 1000Records
};
```

Eventually something equivalent to:

```text
JavaScript objects
       ↓
JSON.stringify()
       ↓
UTF-8 bytes
       ↓
HTTP
```

The server has to serialize those objects.

The browser then does approximately:

```text
HTTP bytes
       ↓
JSON text
       ↓
JSON.parse()
       ↓
JavaScript objects
```

So large responses cost CPU on **both sides**.

At 500 KB–1 MB, this is usually trivial.

At 50–100 MB, it becomes a real architectural concern.

---

# 15. Rendering is often a bigger problem than HTTP

This is particularly relevant if you're returning listings to a React DataGrid.

Imagine:

```text
1000 API records
```

The network isn't necessarily your problem.

The UI could be.

For example:

```text
1000 rows
×
20 columns
=
20,000 cells
```

If the UI renders all of them:

```text
React
 ↓
20,000 components/cells
 ↓
layout
 ↓
paint
```

That can become much more expensive than downloading 500 KB.

This is why **virtualized tables** are useful.

Instead of rendering:

```text
1000 rows
```

the browser may only render:

```text
20–50 visible rows
```

while the data remains available in memory.

---

# 16. Data type matters beyond JSON format

There are several different "types" of size you should distinguish.

### A. Logical data size

Your application thinks:

```text
1000 listings
```

### B. Serialized size

JSON representation:

```text
580 KB
```

### C. Compressed network size

After Brotli/gzip:

```text
200 KB
```

### D. JavaScript memory size

After parsing:

```text
potentially >580 KB
```

### E. Rendered UI cost

Potentially much larger computationally.

So:

```text
1000 records
≠
1000 × one fixed amount of memory
```

---

# 17. A useful hierarchy of limits

Think about limits like this:

```text
                    YOUR REQUEST
                         │
          ┌──────────────┴──────────────┐
          │                             │
       REQUEST                       RESPONSE
          │                             │
          ▼                             ▼
      URL length                   HTTP body
          │                             │
       GET only                 Proxy / Gateway
          │                             │
          ▼                             ▼
    Browser/server               Server/framework
    URL limits                       │
                                      ▼
                               Serialization
                                      │
                                      ▼
                                  Network
                                      │
                                      ▼
                                   Browser
                                      │
                                      ▼
                                  JSON.parse
                                      │
                                      ▼
                                JS memory
                                      │
                                      ▼
                                 UI rendering
```

Each stage is a separate constraint.

---

# 18. What about HTTP/1.1 vs HTTP/2 vs HTTP/3?

This generally isn't something you need to worry about for your payload size.

### HTTP/1.1

Response is transferred using things like:

```text
Content-Length
```

or:

```text
Transfer-Encoding: chunked
```

### HTTP/2

Uses binary framing and multiplexed streams.

### HTTP/3

Uses QUIC/UDP underneath.

But none of these means:

```text
HTTP/2 = max 1 MB
HTTP/3 = max 10 MB
```

They don't work that way.

A 500 KB JSON response is completely normal under all of them.

---

# 19. What about TCP packet size?

You may hear things like:

> "Network packets are only ~1500 bytes."

That's **not a response-size limit**.

A 500 KB HTTP response is simply split into many network packets/frames.

Conceptually:

```text
500 KB HTTP response
        ↓
many TCP/QUIC packets
        ↓
network
        ↓
reassembled
        ↓
browser
```

So:

```text
packet size ≠ HTTP response size
```

---

# 20. What about browser memory?

This is a practical limit rather than a fixed API limit.

Modern browsers have substantial memory available, but your JavaScript application doesn't have infinite memory.

Problems become more realistic when you start doing:

```text
50 MB JSON
100 MB JSON
500 MB JSON
```

especially if you:

```javascript
const data = await response.json();
```

because you may temporarily have multiple representations in memory.

For your:

```text
145 KB
580 KB
```

you're nowhere close.

---

# 21. A better way to think about your 250 vs 1000 decision

Suppose your measurements are:

|Records|JSON response|
|--:|--:|
|250|~145 KB|
|500|~290 KB|
|1000|~580 KB|

Then approximately:

```text
250  → 145 KB
500  → 290 KB
1000 → 580 KB
```

That's excellent.

Even if you had:

```text
2000 → ~1.16 MB
5000 → ~2.9 MB
```

those are still not inherently problematic for a browser.

But you should start asking different questions:

### Network

```text
How long does the response take?
```

### Backend

```text
How long does DB query + serialization take?
```

### Browser

```text
How long does JSON.parse() take?
```

### UI

```text
How long does rendering take?
```

### UX

```text
Does the user actually need 5000 records at once?
```

---

# 22. The real engineering trade-off

The question shouldn't really be:

> "Can the browser handle 1000?"

It almost certainly can.

The better question is:

> **"What page size gives us the best balance between backend query cost, network payload, browser processing, UI rendering, and UX?"**

For example:

```text
250 records
```

might be ideal if:

- users usually inspect a small subset
    
- pagination is cheap
    
- requests are fast
    

Whereas:

```text
1000 records
```

might be better if:

- users frequently need to search across many records
    
- pagination causes lots of round trips
    
- the UI uses virtualization
    
- the backend query is efficient
    
- response remains <1 MB
    

---

# 23. One particularly important point: pagination vs "fetch everything"

There's a difference between:

```text
Fetch 1000 records
```

and:

```text
Fetch all 1000 records because that's the entire dataset
```

If the customer has:

```text
50,000 listings
```

then increasing:

```text
250 → 1000
```

only changes page size.

But if the API eventually becomes:

```text
GET/POST → return ALL listings
```

then you have a scalability problem.

For example:

```text
Customer A → 300 listings
Customer B → 10,000 listings
Customer C → 100,000 listings
```

A fixed page size protects you from that variance.

---

# 24. Where I would draw the lines for your case

Given your current numbers:

```text
250 → ~145 KB
1000 → ~580 KB
```

I'd classify them like this:

|Payload|Assessment|
|--:|---|
|<100 KB|Tiny|
|100–500 KB|Small|
|500 KB–1 MB|Still small|
|1–5 MB|Normal but worth measuring|
|5–10 MB|Start paying attention|
|10–50 MB|Significant|
|50+ MB|Usually architectural concern|
|100+ MB|Strongly reconsider API design|

These are **engineering guidelines, not HTTP/browser specifications**.

There is no magical threshold where:

```text
999 KB = good
1 MB = bad
```

---

# 25. The limits you should actually verify in your system

For your endpoint, I'd verify these in order:

### 1. API Gateway / proxy

If present:

```text
maximum request payload
maximum response payload
timeout
```

### 2. ALB

Check:

```text
idle timeout
```

rather than assuming there's a small response-size limit.

### 3. CloudFront

Check:

```text
origin response behavior
timeouts
caching
compression
```

### 4. Fastify

Check:

```text
bodyLimit
```

but remember:

```text
bodyLimit → incoming request
```

not outgoing response.

### 5. NestJS

Check any custom:

```text
interceptors
serialization
response transformation
```

### 6. Database

Measure:

```text
query execution time
rows returned
DB → Node transfer
```

### 7. Browser

Measure:

```text
fetch duration
JSON.parse duration
memory
render duration
```

### 8. DataGrid

Measure:

```text
rendering
virtualization
sorting/filtering
```

---

# 26. One correction to the original statement

I'd slightly refine this claim:

> "JSON.parse() string cap ~512 MB"

I would **not use that as a design limit**.

V8 has implementation-specific limits around strings, arrays, objects, heap size, etc., and those can change by version/runtime. More importantly, hitting hundreds of MB of JSON is already an application architecture problem long before a theoretical parser ceiling becomes relevant.

Similarly:

> "API Gateway / ALB / proxy typically 6–10 MB"

is too broad.

Those limits are **service-specific and configuration/path-specific**. API Gateway and Lambda have documented payload limits, but ALB, CloudFront, Fastify, etc. should be treated separately rather than lumped into a generic 6–10 MB rule.

---

# Bottom line for your endpoint

For:

```text
POST
   ↓
request body containing filters/search criteria
   ↓
API
   ↓
JSON response
   ↓
250–1000 records
   ↓
~145–580 KB
```

I would **not reject 1000 records because of browser response-size concerns**.

The important considerations are:

```text
                    1000 records
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       Backend        Network        Browser
          │              │              │
       DB query       ~580 KB       JSON.parse
       mapping        compressed     JS memory
       stringify      transfer       DataGrid
          │                             │
          └────────── performance ──────┘
```

At **~580 KB**, the payload itself is small.

So if you're choosing between **250 and 1000**, I'd make the decision based primarily on:

1. **DB/query latency**
    
2. **API response latency**
    
3. **number of records users realistically need**
    
4. **DataGrid rendering/virtualization**
    
5. **whether users perform repeated pagination/searches**
    
6. **your actual production infrastructure limits**
    

—not on a supposed browser HTTP response-size limit.

**In short: 1000 × ~580-byte records is completely reasonable for a browser.** The architectural concern starts when the _dataset and processing cost_ scale into many MBs, not at ~0.5 MB.
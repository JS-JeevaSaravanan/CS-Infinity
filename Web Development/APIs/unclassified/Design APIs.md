
# Designing Backend APIs as a Senior Engineer

This guide explains how senior engineers design **robust, scalable, and secure backend APIs**, independent of language, framework, or cloud provider. The focus is on **request flow, correctness, and long-term maintainability**.

---

## 1. Core Design Principle

> APIs should be **explicit, verifiable, and difficult to misuse** — by clients and by developers.

Frameworks change. Architecture does not.

---

## 2. Avoid REST for Private APIs

REST is acceptable for **public APIs** because clients expect it.  
For **private/internal APIs**, REST introduces ambiguity and weak guarantees.

### Problems with REST Internally

- Status codes are easy to misuse or lie about
- Error semantics become inconsistent over time
- Behavior drifts as teams grow

### Recommendation

- **Public APIs** → REST
- **Private APIs** → Proprietary, contract-driven APIs
    

---

## 3. Single Endpoint API Architecture


### Traditional Routing

`/api/login 
/api/getUser 
/api/updateProfile`

Sounds nice on paper — but it breaks down at scale - don't able to batching


### Recommended Structure

```
POST /api
```

All API calls flow through **one endpoint**.

### Why This Works Better

- Enables request batching
- Simplifies routing logic
- Centralizes security and validation
- Makes instrumentation and observability easier

---

## 4. Request Batching (Critical for Scale)

Single-endpoint APIs allow batching:

- Collect requests for ~10–50ms
- Combine them into one payload
- Execute them in parallel on the backend


### Benefits

- Fewer network round trips
- Faster page loads
- Lower backend overhead
- Better mobile performance

### Example

A frontend page needs:

- User data
- Notifications
- Feature flags
    

Instead of **3 separate requests**, you:

- Collect requests for ~50ms
- Batch them
- Send **one request**
    

This is extremely powerful in:

- Web apps
- Mobile apps
- Internal services

---

## 5. Always Use POST

Reasons:

- APIs inevitably evolve to accept data
- `GET` becomes brittle at scale
- Payload validation is cleaner
- Security controls are simpler


---

## Rate Limiting (Senior-Level Approach)

Rate limiting must happen **early in the request lifecycle**, immediately after basic payload parsing and before business logic execution.

### 1. Two Different Strategies

#### Unauthorized Requests

- Rate limit by **IP address**
    
- This is imperfect but unavoidable
    
- IPs may be shared (offices, universities, NATs)
    
- Still required when no user identity exists
    

#### Authorized Requests

- Rate limit by **account ID**
    
- Account ID becomes the primary limiter
    
- Prevents shared IPs from unfair throttling
    

---

### 2. Rate Limit Key Composition

A correct rate-limit key should include:

- Account ID (if authenticated)
    
- API name / operation name
    

This ensures:

- One misbehaving endpoint does not block the entire user
    
- Rate limits are applied **per API**, not globally
    

---

### 3. Where API Name Comes From

Because the system uses a **single POST endpoint**, the API name is:

- Passed explicitly in the request body
    
- Parsed early during validation
    

This enables fine-grained rate limiting even with one endpoint.

---

### 4. JWTs Enable Early Rate Limiting

To rate limit **before database lookups**:

- Use **signed JWT access tokens**
    
- Extract account ID by verifying the token signature
    
- No DB call required at this stage
    

Full session validation happens later in the handler.

---

### 5. Per-API Configuration

Each API defines its own limits:

- Requests per minute
    
- Burst limits (optional)
    

This configuration lives alongside the API’s schema and metadata, not in global middleware.

---

### Key Takeaway

> Rate limiting is not just protection — it is **traffic shaping**.

Done correctly, it:

- Prevents abuse
    
- Avoids accidental lockouts
    
- Scales cleanly
    
- Respects user intent
    

This is how rate limiting is designed in **mature backend systems**.


---

## 6. High-Level Request Flow

A correct backend API flow:


```
1. Load balancer / WAF
   - IP blocking
   - Max payload size
   - Obvious attack patterns

2. Minimal parsing
   - Content-Type
   - JSON well-formed
   - Token/header presence

3. Rate limiting
   - IP-based (unauth)
   - Account-based (JWT)

4. Authentication
   - Token/session validation
   - Optional DB lookup

5. Authorization
   - Role / scope checks

6. Deep input validation
   - Schema (Zod, JSON Schema)
   - Semantic rules

7. Handler execution
   - Business logic

```

This order matters.

---

## 7. Input Validation (Non-Negotiable)

Most security vulnerabilities originate here.

### Rules

- Validate **before** business logic
- Reject unknown fields
- Enforce types, bounds, formats
- Never `JSON.parse` blindly
    

### Golden Rule

> Never trust the request body. Ever.


### Implementation

Each API defines its own schema.

If using TypeScript:

- **Zod** or equivalent schema validators are strongly recommended


Example:
- Email: string, valid email
- Password: min length, max length, regex rules

### Security Impact

Proper schema validation prevents:
- NoSQL injection
- Type confusion
- Malformed payload attacks
- Silent contract drift

---

## 8. API as a Unit (Handler + Metadata)

Each API lives independently:

```
/api/startLogin
  ├─ handler.ts
  └─ metadata.ts
```


### Metadata Includes

- Input schema
- Rate limit configuration
- Auth requirements
- Optional output schema

Rate Limiting - Defined **per API**, not globally:
- 60 requests/minute
- Custom limits per endpoint

Handlers contain **only business logic**.

---

## 10. JWTs for Early Identity Extraction

To rate limit **before full authentication**:

- Use **signed JWT access tokens**
- Extract account ID without database calls
- Verify signature, not just base64 decode
    

Later in the handler:

- Validate session state
    
- Check expiration
    
- Load user roles if needed
    

---

## 11. Mandatory Authorization in Handlers

Every handler starts with explicit authorization:

```ts
await requireUser()
// or
await requireAdmin()
```

Rules:

- No implicit access
- No shared global auth state
- Auth helpers must be heavily tested

 Handle tokens from:
    - Headers
    - HTTP-only cookies
    - Secure local storage - x access token (jwt)


---

## 12. Output Schemas (Strongly Recommended)

While backend output is trusted, output schemas provide:

- End-to-end type safety
- Safe refactoring
- Automatic frontend type generation
    

backend schema is just for type safety, backend is yours, so it don't send anything scary anytime!

This enables **fully typed APIs without heavy frameworks**.

---

## 13. Additional Prominent Best Practices

### Idempotency

- Support idempotency keys for mutations
- Critical for retries and network failures
    

### Versioning Strategy

- Version at the **API operation level**, not URLs
- Avoid breaking changes silently
    

### Observability

- Log request IDs
- Track per-API latency
    
- Measure rejection reasons (rate limit, validation, auth)
    

### Fail Fast

- Reject invalid requests early
    
- Avoid partial execution
    

---

## 14. Final Architecture Outcome

This design produces APIs that are:

- Secure by default
    
- Easy to reason about
    
- Scalable under load
    
- Framework-agnostic
    
- Hard to misuse
    
- Easy to evolve
    

This is how **senior engineers design backend APIs**.



Referred  recommended Jotted {

[Design APIs - Mehul Mohan](https://www.youtube.com/watch?v=rU2T0Y--LG4)

}



---



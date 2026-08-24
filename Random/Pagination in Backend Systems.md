

# Pagination in Backend Systems

## Different Implementation Strategies, API Contracts & Interview Perspective

Pagination looks simple:

```text
Give me 20 records.
```

But in a production backend, pagination affects much more than the API.

It affects:

- API contract
    
- Database queries
    
- Index design
    
- Sorting
    
- Performance
    
- Concurrent inserts/deletes
    
- Consistency
    
- Client UX
    
- Scalability
    

The important question isn't:

> "How do I add `page` and `pageSize`?"

The better question is:

> **"What pagination semantics does this product need, and what database strategy can provide them efficiently?"**

---

# 1. The Pagination Spectrum

There are several ways to implement pagination:

```text
Offset Pagination
       ↓
Cursor Pagination
       ↓
Keyset Pagination
       ↓
Opaque Cursor
       ↓
Composite Cursor
       ↓
Search-After / Token Pagination
       ↓
Snapshot / Version-based Pagination
```

They solve slightly different problems.

The most common approaches are:

|Approach|Best for|
|---|---|
|Offset|Admin tables, reports|
|Cursor|Feeds, infinite scroll|
|Keyset|Large datasets|
|Page Token|Distributed/search APIs|
|Snapshot|Strong consistency requirements|

---

# 2. Offset Pagination

The most familiar approach:

```http
GET /reviews?page=3&pageSize=20
```

The server converts this to:

```text
offset = (page - 1) * pageSize
```

So:

```text
page 1 → OFFSET 0
page 2 → OFFSET 20
page 3 → OFFSET 40
```

SQL:

```sql
SELECT *
FROM reviews
ORDER BY created_at DESC, id DESC
LIMIT 20
OFFSET 40;
```

## API Contract

```json
{
  "items": [],
  "pagination": {
    "page": 3,
    "pageSize": 20,
    "total": 437,
    "totalPages": 22
  }
}
```

## Advantages

- Very easy to understand
    
- Easy to implement
    
- Easy to jump to page N
    
- Natural for tables
    
- Natural for admin dashboards
    
- Easy to display `1 2 3 4 5 ...`
    

## Disadvantages

Large offsets can become expensive.

For example:

```sql
LIMIT 20 OFFSET 1000000
```

The database may need to walk past a large number of rows before finding the requested rows.

More importantly, offset pagination has a **data mutation problem**.

---

# 3. The Offset Consistency Problem

Imagine page size = 5.

Initial data:

```text
A B C D E F G H I J
```

Request:

```text
GET /reviews?page=1
```

Response:

```text
A B C D E
```

Now somebody inserts:

```text
X
```

at the beginning.

Dataset becomes:

```text
X A B C D E F G H I J
```

Client requests:

```text
GET /reviews?page=2
```

Offset = 5.

Result:

```text
E F G H I
```

Notice:

```text
page 1 → A B C D E
page 2 → E F G H I
```

`E` appeared twice.

This is one of the major weaknesses of offset pagination on frequently changing datasets.

---

# 4. Cursor Pagination

Instead of asking:

> "Give me page 3."

the client asks:

> "Give me the next records after this position."

Example:

```http
GET /reviews?limit=20&after=abc123
```

Response:

```json
{
  "items": [],
  "pagination": {
    "limit": 20,
    "nextCursor": "xyz456",
    "hasNextPage": true
  }
}
```

There is no:

```text
page
```

The client is navigating through a **position** rather than a page number.

---

# 5. Cursor Pagination Mental Model

Think of it like a bookmark.

```text
A B C D E F G H I J
        ↑
      cursor
```

Client says:

```text
Continue after E.
```

Server returns:

```text
F G H I J
```

The next response gives another cursor.

```text
Client
  ↓
cursor A
  ↓
Server
  ↓
items + cursor B
  ↓
Client
  ↓
cursor B
  ↓
Server
```

This makes cursor pagination particularly good for:

- Infinite scrolling
    
- Activity feeds
    
- Notifications
    
- Logs
    
- Events
    
- Large datasets
    

---

# 6. Cursor vs Keyset Pagination

These terms are often confused.

They are related, but conceptually different.

## Cursor

A **cursor is an API concept**.

It represents:

> "Where should I continue from?"

Example:

```text
after=abc123
```

## Keyset

Keyset pagination is a **database query strategy**.

Instead of:

```sql
OFFSET 100000
```

you query based on the previous row's key.

For example:

```sql
WHERE id < 123
ORDER BY id DESC
LIMIT 20;
```

So:

```text
Cursor
   ↓
contains position
   ↓
decode
   ↓
Keyset condition
   ↓
Database
```

A cursor API can therefore be implemented using keyset pagination.

---

# 7. Keyset Pagination

Suppose:

```sql
ORDER BY id DESC
```

Last record on the current page:

```text
id = 123
```

Next query:

```sql
SELECT *
FROM reviews
WHERE id < 123
ORDER BY id DESC
LIMIT 20;
```

Instead of:

```sql
OFFSET 100000
```

the database can use the index to find the next range.

This is why keyset pagination scales much better for sequential traversal.

---

# 8. Deterministic Ordering Is Critical

This is one of the most important interview points.

Never think of pagination separately from ordering.

Bad:

```sql
SELECT *
FROM reviews
LIMIT 20;
```

Also potentially problematic:

```sql
ORDER BY created_at DESC
```

Why?

Because `created_at` may not be unique.

Suppose:

```text
id   created_at
1    10:00
2    10:00
3    10:00
4    10:01
```

What is the exact order of records `1`, `2`, and `3`?

Not necessarily deterministic.

Instead:

```sql
ORDER BY created_at DESC, id DESC
```

Now the ordering is:

```text
created_at
    ↓
id
```

The `id` acts as a tie-breaker.

### Interview rule

> **Pagination requires a deterministic ordering, and cursor/keyset pagination usually requires that ordering to resolve to a unique position.**

---

# 9. Composite Keyset Pagination

This is a very common senior-level interview topic.

Suppose:

```sql
ORDER BY created_at DESC, id DESC
```

Current cursor:

```json
{
  "createdAt": "2026-08-18T10:00:00Z",
  "id": 123
}
```

The next query becomes:

```sql
WHERE
    created_at < :createdAt
    OR (
        created_at = :createdAt
        AND id < :id
    )
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

Why?

Because we need to correctly handle records with the same timestamp.

General pattern:

```text
ORDER BY A DESC, B DESC
```

becomes:

```text
A < cursor.A
OR
(A = cursor.A AND B < cursor.B)
```

For ascending order:

```text
A > cursor.A
OR
(A = cursor.A AND B > cursor.B)
```

This is **keyset pagination with a composite ordering key**.

---

# 10. API Contract #1 — Page Based

The simplest API contract:

```http
GET /reviews?page=3&pageSize=20
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 3,
    "pageSize": 20,
    "total": 437,
    "totalPages": 22
  }
}
```

### Best for

```text
Admin UI
Reports
Data tables
Page navigation
```

### Main advantage

The client understands:

```text
Page 3 of 22
```

### Main disadvantage

Usually requires:

```sql
COUNT(*)
```

and offset-based database access.

---

# 11. API Contract #2 — Limit + Offset

You don't necessarily need `page`.

Another API style is:

```http
GET /reviews?limit=20&offset=40
```

Response:

```json
{
  "items": [],
  "limit": 20,
  "offset": 40
}
```

This is closer to the database model.

But there is an important API-design question:

> Should the API expose database concepts such as `offset`?

Often, no.

If the product requirement is:

> "Load more."

then:

```text
after=cursor
```

may better express the API's semantics than:

```text
offset=40
```

---

# 12. API Contract #3 — Cursor Based

Example:

```http
GET /reviews?limit=20&after=eyJpZCI6MTIzfQ
```

Response:

```json
{
  "items": [],
  "pagination": {
    "nextCursor": "eyJpZCI6MTAzMX0",
    "hasNextPage": true
  }
}
```

This is a much better contract for:

```text
Infinite scrolling
Feeds
Activity streams
Large datasets
```

The client doesn't need to understand the database.

It only knows:

```text
current cursor
       ↓
next request
       ↓
next cursor
```

---

# 13. API Contract #4 — Before / After Cursor

A more advanced cursor API can support both directions:

```http
GET /reviews?limit=20&after=cursor
```

and:

```http
GET /reviews?limit=20&before=cursor
```

Response:

```json
{
  "items": [],
  "pagination": {
    "nextCursor": "...",
    "previousCursor": "...",
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

This is useful when the UI needs:

```text
← Previous
Next →
```

or bidirectional scrolling.

But it significantly increases implementation complexity.

---

# 14. API Contract #5 — Page Token / Continuation Token

Another model is:

```http
GET /reviews?limit=20&pageToken=abc123
```

Response:

```json
{
  "items": [],
  "nextPageToken": "xyz456"
}
```

This is conceptually similar to cursor pagination.

The terminology is slightly different:

```text
cursor
continuation token
page token
next token
```

All communicate:

> "Continue from the server-provided position."

This style is especially useful for APIs where the server wants to control the continuation state.

---

# 15. API Contract #6 — Search-After

Search engines commonly use a concept similar to keyset pagination called:

```text
search_after
```

Conceptually:

```json
{
  "search_after": [98, 123]
}
```

where:

```text
98  → score
123 → unique ID
```

The server continues searching after that sort position.

This is particularly useful when pagination is backed by search infrastructure rather than a relational database.

The important conceptual lesson is:

> **Pagination doesn't have to mean page numbers. It can mean continuation from a known sort position.**

---

# 16. Opaque Cursors

Don't expose:

```http
GET /reviews?afterCreatedAt=2026-08-18T10:00:00Z&afterId=123
```

Prefer:

```http
GET /reviews?after=eyJjcmVhdGVkQXQiOi...
```

The cursor might internally contain:

```json
{
  "createdAt": "2026-08-18T10:00:00Z",
  "id": 123
}
```

The client doesn't need to know.

This creates an important abstraction boundary:

```text
Client
  ↓
opaque cursor
  ↓
API
  ↓
decode cursor
  ↓
database position
```

Now you can change your internal implementation without breaking the API contract.

---

# 17. Should the Cursor Be Signed?

Suppose the cursor contains:

```json
{
  "customerId": "abc",
  "createdAt": "...",
  "id": 123
}
```

If users can freely modify it, they could change:

```text
customerId
id
filters
```

A signed cursor can prevent tampering:

```text
cursor payload
      +
signature
      ↓
opaque cursor
```

On the server:

```text
decode
   ↓
verify signature
   ↓
validate
   ↓
use cursor
```

Important distinction:

> Encoding does not provide integrity.

Base64 is not security.

If integrity matters, use a cryptographic signature or authenticated encryption depending on the design.

---

# 18. Cursor Should Represent the Query

This is a subtle but important production concern.

Suppose the request is:

```http
GET /listings?
    publisher=amazon
    &sort=price
    &limit=20
    &after=cursor
```

The cursor was created for:

```text
publisher = amazon
sort = price
```

Now the client sends:

```http
GET /listings?
    publisher=ebay
    &sort=rating
    &limit=20
    &after=cursor
```

The cursor may no longer be valid.

Therefore:

> **A cursor is not just a row position. It is a continuation position within a particular query context.**

A robust cursor may contain:

```json
{
  "position": {
    "price": 100,
    "id": 123
  },
  "sort": "price",
  "direction": "desc"
}
```

You can also bind the cursor to a hash of the relevant query parameters.

---

# 19. Cursor + Filtering

Suppose:

```http
GET /reviews?customerId=10&limit=20&after=cursor
```

The cursor belongs to:

```text
customerId = 10
```

The server must continue within that same result set.

Conceptually:

```text
filter
  ↓
ordering
  ↓
cursor position
  ↓
next page
```

The cursor must not accidentally allow traversal outside the intended filtered dataset.

---

# 20. Cursor + Sorting

Suppose the API supports:

```http
sort=createdAt
sort=rating
sort=price
```

Each ordering creates a different pagination space.

For example:

```text
sort=price
```

might produce:

```text
10
20
30
40
```

while:

```text
sort=rating
```

produces:

```text
5.0
4.9
4.8
4.7
```

A cursor generated for one ordering should not be blindly reused with another.

Therefore cursor APIs must consider:

```text
filters
sort
direction
position
```

---

# 21. `hasNextPage`: Don't Always Use COUNT(*)

A common implementation is:

```sql
SELECT COUNT(*)
FROM reviews;
```

Then:

```text
total = 437
totalPages = 22
```

But if the UI only needs:

```text
Load more
```

you don't necessarily need the total.

Instead, request:

```text
limit = 20
```

but query:

```sql
LIMIT 21
```

Then:

```text
21 rows returned
       ↓
hasNextPage = true
       ↓
return first 20
```

If:

```text
20 or fewer
```

then:

```text
hasNextPage = false
```

This is a very useful optimization.

---

# 22. Do You Really Need `totalCount`?

This is both a technical and product question.

Ask:

> Does the UI actually need the total?

### Usually yes

```text
Admin tables
Reports
Search result counts
"Showing 1–20 of 4,231"
Page navigation
```

### Usually no

```text
Infinite scroll
Activity feeds
Notifications
Event streams
Social feeds
Logs
```

If the client only needs:

```json
{
  "items": [],
  "nextCursor": "...",
  "hasNextPage": true
}
```

don't automatically introduce an expensive count operation.

---

# 23. Database Indexing

Pagination strategy must match your indexes.

Suppose:

```sql
ORDER BY created_at DESC, id DESC
```

and:

```sql
WHERE
    created_at < ?
    OR (
        created_at = ?
        AND id < ?
    )
```

A suitable index can make a huge difference.

Conceptually:

```sql
CREATE INDEX idx_reviews_created_id
ON reviews(created_at DESC, id DESC);
```

The exact index depends on the database and full query.

The important interview principle is:

> **Design indexes around the actual `WHERE + ORDER BY` access pattern.**

Not merely:

```text
"created_at needs an index"
```

but:

```text
How is the database locating and ordering the next page?
```

---

# 24. Pagination + Filtering + Indexing

Consider:

```sql
SELECT *
FROM listings
WHERE publisher = ?
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

An index such as:

```text
(publisher, created_at, id)
```

may be much more useful than three unrelated indexes.

The general thinking is:

```text
WHERE
  ↓
ORDER BY
  ↓
LIMIT
  ↓
Index strategy
```

Pagination is therefore not just an API problem.

It is also a database-access problem.

---

# 25. Pagination Under Concurrent Writes

This is where interview discussions often become interesting.

Offset pagination:

```text
page 1 → A B C D E
insert X
page 2 → E F G H I
```

Potential duplicate.

Cursor/keyset:

```text
page 1 → A B C D E
cursor → E

insert X

page 2:
WHERE position < E

→ F G H I J
```

The new record `X` doesn't suddenly shift the position of previously returned records.

This gives cursor pagination better traversal behavior for changing datasets.

But don't say:

> "Cursor pagination guarantees consistency."

It doesn't.

---

# 26. Cursor Pagination Does NOT Mean Snapshot Consistency

Records can still:

- be deleted
    
- change their ordering field
    
- move between pages
    
- become invisible because of filters
    
- be updated concurrently
    

For strict consistency, you may need:

```text
Snapshot isolation
Transaction boundaries
Version numbers
Immutable ordering keys
Temporal/versioned data
```

Most APIs don't need this.

But in a senior interview, knowing the distinction is valuable.

---

# 27. A Different Strategy: Snapshot Pagination

For certain use cases, you may want:

> "The user should page through the exact same dataset that existed when the query started."

Conceptually:

```text
Request 1
   ↓
snapshot/version = 100
   ↓
page 1

new records arrive

page 2
   ↓
still query snapshot 100
```

This is significantly more complicated and has database/storage implications.

It can make sense for:

```text
Reports
Exports
Auditing
Long-running data traversal
```

But is usually unnecessary for:

```text
Social feeds
Admin tables
Normal CRUD APIs
```

---

# 28. Hybrid Pagination

Sometimes one endpoint genuinely needs multiple behaviors.

For example:

```http
GET /reviews?page=3&pageSize=20
```

for an admin dashboard.

And:

```http
GET /reviews?limit=20&after=cursor
```

for an infinite-scroll UI.

You can support both.

But ask whether you should.

Supporting:

```text
page
offset
cursor
sorting
filtering
forward
backward
totalCount
```

in one endpoint can create a very complicated contract.

A simpler approach may be:

```text
Admin API
    ↓
Offset pagination

Feed API
    ↓
Cursor pagination
```

Even if they read from the same underlying table.

---

# 29. Separate API Contracts by Use Case

This is often cleaner.

### Admin

```http
GET /admin/reviews?page=3&pageSize=50
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 3,
    "pageSize": 50,
    "total": 12431,
    "totalPages": 249
  }
}
```

### Feed

```http
GET /reviews?limit=50&after=cursor
```

Response:

```json
{
  "items": [],
  "pagination": {
    "nextCursor": "...",
    "hasNextPage": true
  }
}
```

The API contract matches the UX.

---

# 30. Backward Pagination

Forward pagination:

```text
after=cursor
```

means:

```text
continue forward
```

But some systems need:

```http
before=cursor
```

For example:

```text
← Older
Newer →
```

This becomes considerably more complicated because the database ordering and returned order may need to be reversed.

A robust implementation needs to carefully handle:

```text
ORDER BY
cursor comparison
LIMIT
returned ordering
next/previous cursor
```

This is a good advanced interview topic.

---

# 31. Maximum Page Size

Never blindly trust:

```http
?pageSize=100000000
```

A malicious or accidental request could create:

```text
Huge DB query
Huge memory usage
Huge response
Network pressure
CPU pressure
```

Always enforce:

```text
default page size
maximum page size
```

For example:

```text
default = 20
maximum = 100
```

The exact values depend on the endpoint.

---

# 32. Invalid Cursor Handling

What happens when:

```http
after=invalid
```

Possible response:

```http
400 Bad Request
```

Example:

```json
{
  "error": {
    "code": "INVALID_CURSOR",
    "message": "The pagination cursor is invalid."
  }
}
```

Don't silently treat an invalid cursor as:

```text
first page
```

because that can hide client bugs and produce confusing behavior.

---

# 33. Cursor Expiration

Depending on the design, cursors can expire.

For example:

```text
cursor generated
      ↓
valid for 1 hour
      ↓
expired
```

Then:

```http
400 Bad Request
```

or a domain-specific pagination error.

Whether expiration is appropriate depends on the system.

For simple database cursors, permanent cursors may be fine.

For cursors containing temporary state, expiration can be useful.

---

# 34. API Contract: A Good Generic Shape

A practical response structure is:

```json
{
  "items": [],
  "pagination": {
    "limit": 20,
    "nextCursor": "...",
    "previousCursor": "...",
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

For offset-based APIs:

```json
{
  "items": [],
  "pagination": {
    "page": 3,
    "pageSize": 20,
    "total": 437,
    "totalPages": 22
  }
}
```

Don't force every field into every pagination strategy.

For example:

```text
cursor API
```

doesn't necessarily need:

```text
totalPages
```

---

# 35. REST vs GraphQL Pagination Contracts

In REST APIs, you commonly see:

```text
page/pageSize
```

or:

```text
limit/offset
```

or:

```text
limit/after
```

GraphQL commonly models pagination around a **connection**:

```text
edges
nodes
pageInfo
```

Conceptually:

```json
{
  "nodes": [],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "..."
  }
}
```

The underlying database can still use keyset pagination.

This demonstrates an important distinction:

```text
API pagination model
        ≠
database pagination implementation
```

Your GraphQL API can expose cursors while your database uses a composite keyset query.

---

# 36. The Most Important Design Separation

Think in four layers:

```text
Product Requirement
       ↓
API Contract
       ↓
Pagination Semantics
       ↓
Database Implementation
```

For example:

```text
"User needs infinite scroll"
        ↓
GET /events?limit=20&after=cursor
        ↓
Cursor pagination
        ↓
Keyset SQL
        ↓
Composite index
```

Another example:

```text
"Admin needs page 87"
        ↓
GET /users?page=87&pageSize=50
        ↓
Offset pagination
        ↓
LIMIT/OFFSET
        ↓
Appropriate indexes
```

Don't start with the SQL.

Start with the requirement.

---

# 37. Interview Question: Offset vs Cursor

### Interviewer

> "What is the difference between offset and cursor pagination?"

### Strong answer

> Offset pagination identifies a page using an absolute position, typically `LIMIT/OFFSET`. It's simple and supports random page access, making it useful for admin tables and reports. However, large offsets can become expensive and concurrent inserts/deletes can cause duplicates or missing records.
> 
> Cursor pagination identifies a continuation position using a server-provided cursor. It is better suited for large, frequently changing datasets and sequential traversal such as feeds and infinite scrolling. It usually requires deterministic ordering and is commonly implemented using keyset queries.

That answer is much stronger than:

> "Cursor is faster."

---

# 38. Interview Question: Why Is `ORDER BY` Important?

### Strong answer

> Pagination without deterministic ordering is unreliable because the database isn't required to return rows in a stable order. For cursor or keyset pagination, I generally use a unique ordering such as `created_at DESC, id DESC`, where `id` acts as a tie-breaker when timestamps are equal.

This shows that you understand the underlying correctness issue.

---

# 39. Interview Question: Why Not Just Use `created_at`?

Suppose:

```sql
ORDER BY created_at DESC
```

Interviewer:

> "What's wrong with that?"

Answer:

> `created_at` may not be unique. Multiple records can have the same timestamp, so the pagination boundary can become ambiguous. I'd add a unique tie-breaker such as `id`, resulting in `ORDER BY created_at DESC, id DESC`.

---

# 40. Interview Question: How Do You Implement Cursor Pagination?

A good answer:

```text
1. Define deterministic ordering.
2. Identify the cursor position.
3. Encode it into an opaque cursor.
4. Decode and validate the cursor.
5. Generate a keyset WHERE condition.
6. Query limit + 1 records.
7. Return requested records.
8. Generate the next cursor.
```

Example:

```sql
ORDER BY created_at DESC, id DESC
```

Cursor:

```json
{
  "createdAt": "...",
  "id": 123
}
```

Next query:

```sql
WHERE
    created_at < :createdAt
    OR (
        created_at = :createdAt
        AND id < :id
    )
ORDER BY created_at DESC, id DESC
LIMIT 21;
```

Then:

```text
21 returned
    ↓
hasNextPage = true
    ↓
return first 20
```

---

# 41. Interview Question: Why `LIMIT + 1`?

Answer:

> If the client asks for 20 records, I can fetch 21 internally. If I receive 21, I know another page exists, so I return the first 20 and set `hasNextPage=true`. This avoids an additional `COUNT(*)` or existence query.

This is a small detail that demonstrates practical backend experience.

---

# 42. Interview Question: Can Cursor Pagination Jump to Page 100?

Usually:

> Not naturally.

Cursor pagination is designed for:

```text
current position
       ↓
next position
```

rather than:

```text
absolute page number
```

If random page access is a core requirement, offset pagination may be more appropriate.

This is one reason pagination strategy should be driven by product requirements.

---

# 43. Interview Question: Is Cursor Pagination Always Faster?

Correct answer:

> No.

Cursor/keyset pagination can be much more efficient for large sequential traversals, especially when the ordering columns are properly indexed. But it adds API and implementation complexity, doesn't naturally provide total counts, and isn't ideal when users need arbitrary page jumps.

This is a much better answer than:

> "Cursor is always better."

---

# 44. Interview Question: What Index Would You Create?

Suppose:

```sql
WHERE
    created_at < ?
    OR (
        created_at = ?
        AND id < ?
    )
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

You should think about an index supporting:

```text
created_at + id
```

For example:

```sql
CREATE INDEX idx_reviews_created_id
ON reviews(created_at DESC, id DESC);
```

But a senior-level answer should add:

> "I'd verify the actual query plan and consider the other filters in the query before deciding the final index."

Don't blindly prescribe an index without looking at the complete workload.

---

# 45. Interview Question: What Happens If a Record Is Deleted?

With cursor pagination:

```text
page 1 → A B C D E
cursor → E
```

If `C` is deleted:

```text
page 2
```

can still continue from the cursor position.

You don't get the same offset shifting problem.

But deletion can still mean the user observes a changing dataset.

So the correct answer is:

> Cursor pagination improves traversal stability but doesn't guarantee snapshot consistency.

---

# 46. Interview Question: How Would You Design Pagination for 100 Million Rows?

A strong approach:

```text
1. Understand UX requirements.
2. Avoid OFFSET for deep sequential traversal.
3. Use cursor/keyset pagination.
4. Establish deterministic ordering.
5. Use a unique tie-breaker.
6. Create an index matching filtering + ordering.
7. Enforce maximum page size.
8. Avoid COUNT(*) unless required.
9. Use LIMIT + 1 for hasNextPage.
10. Make cursor opaque.
11. Validate cursor/query compatibility.
12. Monitor query plans and latency.
```

The key point:

> Don't solve a 100-million-row problem with a UI abstraction like `page=5000000`.

---

# 47. Interview Question: How Would You Design the API?

### Admin table

```http
GET /admin/users?page=3&pageSize=50
```

Response:

```json
{
  "items": [],
  "pagination": {
    "page": 3,
    "pageSize": 50,
    "total": 12431,
    "totalPages": 249
  }
}
```

### Infinite feed

```http
GET /feed?limit=50&after=cursor
```

Response:

```json
{
  "items": [],
  "pagination": {
    "nextCursor": "...",
    "hasNextPage": true
  }
}
```

This demonstrates that you don't believe there is one universal pagination contract.

---

# 48. Common Production Mistakes

### 1. No `ORDER BY`

```sql
LIMIT 20 OFFSET 20
```

Unreliable ordering.

---

### 2. Ordering by a non-unique field

```sql
ORDER BY created_at DESC
```

Potentially ambiguous boundaries.

---

### 3. Deep OFFSET

```sql
OFFSET 5000000
```

Potentially expensive.

---

### 4. `COUNT(*)` on every request

Not always necessary.

---

### 5. Unlimited page size

```http
?pageSize=1000000
```

Resource exhaustion risk.

---

### 6. Exposing cursor internals

Avoid:

```text
afterCreatedAt
afterId
```

as public semantics when an opaque cursor would work better.

---

### 7. Ignoring filters

Cursor generated for:

```text
customer=A
```

mustn't blindly work for:

```text
customer=B
```

---

### 8. Ignoring sort changes

A cursor generated for:

```text
sort=price
```

shouldn't automatically be reused for:

```text
sort=rating
```

---

### 9. Assuming cursor = consistency

Cursor pagination does not magically create a database snapshot.

---

### 10. Choosing pagination before understanding UX

Don't start with:

> "We always use cursor pagination."

Start with:

> "What does the client need to do?"

---

# 49. Decision Matrix

|Requirement|Recommended|
|---|---|
|User needs page numbers|Offset|
|User needs "Page 87"|Offset|
|Admin dashboard|Offset|
|Reporting|Offset|
|Exact total required|Offset + count|
|Infinite scroll|Cursor|
|Activity feed|Cursor|
|Huge dataset|Cursor / Keyset|
|Frequently changing data|Cursor / Keyset|
|Sequential traversal|Cursor / Keyset|
|Search backend|Search-after / token|
|Strict snapshot traversal|Snapshot/version approach|

---

# 50. A Practical Decision Tree

Ask these questions in order:

```text
Does the user need page numbers?
        │
       YES
        ↓
   Offset pagination
```

Otherwise:

```text
Does the user need sequential traversal?
        │
       YES
        ↓
Cursor / Keyset
```

Then:

```text
Is the dataset large?
        │
       YES
        ↓
Prefer keyset + proper indexes
```

Then:

```text
Can records change while paging?
        │
       YES
        ↓
Prefer cursor/keyset semantics
```

Then:

```text
Does the UI require totalCount?
        │
       YES
        ↓
Calculate it intentionally
```

Otherwise:

```text
Use hasNextPage
```

---

# 51. The Senior-Level Mental Model

Don't think:

```text
Pagination = page + pageSize
```

Think:

```text
                    Pagination
                        │
        ┌───────────────┼────────────────┐
        ↓               ↓                ↓
    Product UX       API Contract     Database
        │               │                │
    page numbers      offset           OFFSET
    load more         cursor           keyset
    infinite scroll   token            indexes
        │               │                │
        └───────────────┼────────────────┘
                        ↓
                   Consistency
                        │
                concurrent writes
                inserts/deletes
                ordering changes
```

The implementation should emerge from these requirements.

---

# 52. The Pagination Design Checklist

Before implementing an endpoint, ask:

### Product

- Does the user need page numbers?
    
- Is it infinite scrolling?
    
- Does the user need total results?
    
- Does the user need previous/next navigation?
    

### API

- `page/pageSize`?
    
- `limit/offset`?
    
- `limit/after`?
    
- `before/after`?
    
- Page token?
    
- Opaque cursor?
    

### Database

- What is the ordering?
    
- Is the ordering deterministic?
    
- Is there a unique tie-breaker?
    
- Can keyset pagination be used?
    
- What index supports the query?
    

### Consistency

- Can records be inserted during traversal?
    
- Can records be deleted?
    
- Can ordering fields change?
    
- Do we need snapshot semantics?
    

### Performance

- What's the maximum page size?
    
- Is `COUNT(*)` necessary?
    
- Can we use `LIMIT + 1`?
    
- Will OFFSET become expensive?
    
- What does `EXPLAIN` / query plan say?
    

### Security / Correctness

- Is the cursor opaque?
    
- Should it be signed?
    
- Can it be tampered with?
    
- Does it encode query context?
    
- Can it expire?
    
- What happens if it is invalid?
    

---

# 53. The Interview Cheat Sheet

If the interviewer asks:

### "What are the types of pagination?"

Say:

> "The common approaches are offset pagination and cursor/keyset pagination. Offset identifies an absolute position and is good for page-number based UIs. Cursor pagination identifies a continuation position and is better for large, changing datasets. Keyset pagination is the database technique commonly used underneath cursor APIs."

### "Which is better?"

> "Neither universally. It depends on the product requirement. Page navigation favors offset; large sequential traversal favors cursor/keyset."

### "Why is cursor faster?"

> "It can avoid scanning/skipping a large OFFSET and allows the database to seek into an indexed range."

### "What is the catch?"

> "It requires deterministic ordering, is harder to implement, doesn't naturally support random page jumps, and total counts aren't inherent."

### "Why composite cursor?"

> "To handle ties in the primary sort field. For example, `created_at DESC, id DESC` ensures a deterministic position."

### "Why `LIMIT + 1`?"

> "To determine `hasNextPage` without an additional count query."

### "Should the cursor be exposed?"

> "Expose it as an opaque continuation token rather than exposing database-specific fields."

### "Does cursor guarantee consistency?"

> "No. It improves traversal stability, but strict snapshot consistency requires additional database or application-level mechanisms."

---

# 54. Final Mental Model

The progression worth remembering is:

```text
Basic
  ↓
page + pageSize
  ↓
Offset pagination
  ↓
Cursor pagination
  ↓
Keyset pagination
  ↓
Deterministic ordering
  ↓
Composite keyset
  ↓
Opaque cursor
  ↓
Cursor + filters/sorting
  ↓
Index-aware pagination
  ↓
Concurrency & consistency
  ↓
Production-grade pagination
```

The biggest interview takeaway is this:

> **Pagination is not a `LIMIT/OFFSET` problem. It is an API semantics, database access, ordering, performance, and consistency problem.**

And the strongest system-design answer is not:

> "I prefer cursor pagination."

It is:

> **"I'd first understand the UX. If users need arbitrary page navigation and totals, I'd use offset pagination. If they need sequential traversal over a large or frequently changing dataset, I'd use an opaque cursor backed by deterministic keyset pagination. Then I'd design the ordering and composite index around the query, enforce page-size limits, avoid unnecessary counts, and consider consistency requirements."**

That is the difference between **knowing how to implement pagination** and **knowing how to design pagination in a production system**.
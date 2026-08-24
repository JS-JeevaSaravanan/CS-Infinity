

Ah, you mean the new HTTP QUERY method, not query parameters. Good catch — my previous answer interpreted "query method" as URL query parameters. These are different concepts.

The HTTP QUERY method is a new HTTP method designed for safe, complex read operations. It sits between the ideas of GET and POST. It is defined in 
R
RFC Editor

Why was QUERY introduced?

Before QUERY, developers had two imperfect choices:

Option 1: GET with query parameters

Example:

GET /products?category=laptop&brand=apple&priceMin=50000&priceMax=100000


Problem:

URL length limitations
Complex filters become ugly
Sensitive query details may appear in logs/history
Hard to represent deeply nested queries
Option 2: POST for searching

Many APIs do this:

POST /products/search

{
  "filters": {
    "category": "laptop",
    "price": {
      "min": 50000,
      "max": 100000
    }
  },
  "sort": "rating"
}


This works, but semantically POST means:

"Process this request"
Often used for creating/modifying resources

A search operation is usually read-only, so POST is not the perfect fit.

HTTP QUERY solves this

Example:

QUERY /products/search HTTP/1.1
Content-Type: application/json

{
  "filters": {
    "category": "laptop",
    "price": {
      "min": 50000,
      "max": 100000
    }
  }
}


Now the meaning is clear:

"I want to execute a query and get results, but I am not changing server data."

The request has:

✅ A body like POST
✅ Safe/read-only semantics like GET
✅ Idempotent behavior (same request gives the same result)
✅ Better support for retries and caching behavior 
R
RFC Editor
GET vs QUERY vs POST
Feature	GET	QUERY	POST
Purpose	Retrieve resource	Execute complex query	Submit/process data
Request body	Not normally used	Yes	Yes
Changes server state	No	No	Can
Safe	Yes	Yes	Not necessarily
Idempotent	Yes	Yes	Not necessarily
Good for complex filters	Poor	Excellent	Works but less semantic
Example	Get user by ID	Search with advanced filters	Create user/order
Real-world example

Imagine Amazon product search.

Simple search:
GET /products?keyword=iphone


Good enough.

Advanced search:
{
  "category": "phones",
  "brands": ["Apple", "Samsung"],
  "priceRange": {
      "min": 30000,
      "max": 80000
  },
  "rating": 4,
  "availability": true
}


Using GET would make a huge URL.

Using POST works, but it is not a true read operation.

QUERY is designed exactly for this case. 
R
RFC Editor

Should we start using QUERY in APIs?

Not immediately for most applications.

Reasons:

It is new.
Many frameworks, proxies, API gateways, and monitoring tools may not support it yet.
GET and POST are deeply established.

For now:

Simple reads → GET
Complex searches → often POST /search
Future APIs may use → QUERY

A good interview explanation:

"HTTP QUERY is a new method for safe, idempotent read operations where the query definition is sent in the request body. It provides the flexibility of POST payloads while keeping the semantics of a GET-like read operation." 
R
RFC Editor

R
Sources


https://dev.to/tykok/the-new-http-method-query-2bec

https://www.rfc-editor.org/info/rfc10008/


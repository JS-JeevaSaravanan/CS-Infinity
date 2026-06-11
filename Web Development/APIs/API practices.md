

[# API Design @ByteByteGo](https://youtu.be/_gQaygjm_hg)


Sure! Here are the best practices for designing effective and secure REST APIs, with all points included under their respective headings:

### 1. Use Clear Naming
- Choose straightforward, logical names for your API endpoints.
- Instead of using generic names like `getCod123`, use meaningful names like `cards123`.
- The plural tells API users they are dealing with a group of resources.
- Be consistent and stick with intuitive URL patterns.
- This makes interaction more understandable for developers tapping into your API.

### 2. Ensure Reliability Through Idempotency
- Idempotency means making the same API call multiple times has the same effect as calling it once.
- This concept is key for reliable APIs and prevents bugs if requests get retried.
- Typically, POST requests that create resources are not naturally idempotent; sending the same POST request twice could duplicate that resource.
- Add logic to deduplicate by requiring a client-generated unique ID on every unique request.
- GET requests are idempotent by default; repeated GET requests return the same unchanging information.
- PUT requests to update full resources are idempotent.
- PATCH requests, which change select fields within a resource, may not be idempotent (e.g., patching to append to an array could add duplicate elements).
- DELETE requests should be idempotent; calling delete multiple times should not cause errors if the resource is already deleted.

### 3. Add Versioning
- As your API grows, you need to make changes without breaking applications already using it.
- Use a URL like `v1/cards/123` to introduce new versions, such as `v2`, without impacting current API consumers.
- Versioning allows updating APIs while supporting backward compatibility.
- This lets developers using old versions upgrade on their own timeline.
- Coordinate changes through well-documented release notes.

### 4. Add Pagination
- Pagination controls the amount of data returned by APIs.
- Common pagination approaches are page/offset or cursor-based pagination.
- Page/offset pagination uses page numbers and page size limits (e.g., page 2 would be records 11 to 20 for a size of 10).
- This method is simple but can be slow for huge data sets since the database has to count all rows from the beginning until it reaches the requested page.
- Cursor-based pagination uses a pointer to fetch the next set of records and tracks pages accurately, even with a high rate of data changes.
- Either approach prevents overwhelming API consumers with all data at once and enhances performance.

### 5. Use Clear Query Strings for Sorting and Filtering
- Use clear query strings for sorting and filtering API data (e.g., `sortBy=registered` for sorting by sign-up date).
- This makes response data easy to grasp; developers instantly see the active filters or sort orders applied.
- Additional sorting and filtering criteria are easy to add over time without breaking existing integrations.
- Filtered and sorted result sets can be cached separately for speed.

### 6. Don’t Make Security an Afterthought
- For sensitive credentials like API keys, leverage HTTP headers over URLs to avoid exposing secrets in plaintext.
- URLs get logged in server access logs, increasing the risk of exposure.
- Headers like `Authorization` reduce that risk.
- Enforce full TLS encryption for all traffic to shield transmissions end-to-end.
- Implement robust access controls and verify keys and tokens on every request before processing.
- Security is a deep topic; make sure to keep yourself updated with the latest best practices.

### 7. Keep Cross-Resource References Simple
- Use clear linking between connected resources to avoid cluttering URLs with long query strings.
- For instance, reference item 321 within card 123 through a clean path instead of messy query parameters.
- Direct paths make associations clear for developers using the API.

### 8. Plan for Rate Limiting
- Rate limiting protects APIs from overload and abuse.
- Set request quotas based on dimensions like source IP addresses, user accounts, or endpoint categories.
- For example, free-tier customers may get 100 requests per day, and any single IP is kept at 20 requests per minute.
- These quotas not only protect infrastructure but also encourage fair use as part of the service contract across all clients.
- Rate limiting also reduces the attack surface from DDoS attacks.

By considering these best practices, you will create APIs that are robust, reliable, and enjoyable for developers to work with!


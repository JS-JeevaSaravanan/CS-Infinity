

In JavaScript, there are **3 common ways** to check whether a string is a URL. The best choice depends on how strict you need to be.

### 1. ✅ Recommended: `URL` constructor

```js
function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

isValidUrl("https://example.com"); // true
isValidUrl("http://google.com/path"); // true
isValidUrl("hello"); // false
```

### But there's a catch

`URL` accepts more than just HTTP URLs:

```js
new URL("mailto:test@example.com"); // valid
new URL("ftp://example.com");       // valid
```

If you specifically want **HTTP/HTTPS URLs**:

```js
function isHttpUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
```

```js
isHttpUrl("https://example.com"); // true
isHttpUrl("http://example.com");  // true
isHttpUrl("ftp://example.com");   // false
isHttpUrl("hello");               // false
```

---

## 2. Relative URLs — important distinction

This:

```js
new URL("/users/123");
```

throws an error because it doesn't have a base URL.

But this is a **valid relative URL**:

```text
/users/123
```

If your application accepts both absolute and relative URLs:

```js
function isValidUrl(value) {
  try {
    new URL(value, "https://example.com");
    return true;
  } catch {
    return false;
  }
}
```

```js
isValidUrl("/users");       // true
isValidUrl("users");        // true
isValidUrl("https://x.com"); // true
```

So first decide:

> **Do I want an absolute URL or a URL/path?**

---

## 3. ❌ Regex — usually not recommended

You might see:

```js
const urlRegex = /^(https?:\/\/[^\s]+)$/;

urlRegex.test("https://example.com"); // true
```

This works for simple validation, but URLs are surprisingly complicated.

For example:

```text
https://example.com
https://example.com/users?id=10
https://user:pass@example.com:8080/path
https://[::1]:8080
```

A regex that correctly validates URLs becomes complicated very quickly.

**Prefer the built-in `URL` parser.**

---

# Interview perspective

A good interview answer would be:

> **"I would use the built-in `URL` constructor instead of regex. `new URL(value)` parses an absolute URL and throws for invalid input. If the application only accepts HTTP/HTTPS, I would additionally check the protocol."**

Example:

```js
function isValidHttpUrl(value) {
  try {
    const url = new URL(value);

    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}
```

### Important edge cases

```js
isValidHttpUrl("https://example.com"); // true

isValidHttpUrl("http://localhost:3000"); // true

isValidHttpUrl("https://example.com/a?x=1#top"); // true

isValidHttpUrl("example.com"); // false
// No protocol

isValidHttpUrl("/users/1"); // false
// Relative URL

isValidHttpUrl("hello world"); // false

isValidHttpUrl(""); // false

isValidHttpUrl(null); // false ❗
```

For robust production code, also ensure the input is actually a string:

```js
function isValidHttpUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
```

### One subtle interview point

**"Is this a valid URL?" and "Does this website actually exist?" are different questions.**

```js
new URL("https://does-not-exist-xyz.com");
```

can successfully parse it, but that **doesn't mean the domain exists or the server is reachable**.

Validation:

```text
String
  ↓
URL parser
  ↓
Valid URL syntax?
  ↓
Protocol allowed?
```

Existence checking requires a network request/DNS resolution, which is a completely separate concern.
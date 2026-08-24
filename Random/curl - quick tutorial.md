
curl — learn it quickly, but properly

If you work on backend/API systems, curl is one of the highest-ROI command-line tools to know.

The mental model is:

curl = make an HTTP request from your terminal

1. The basic shape
curl [options] URL


Example:

curl https://api.example.com/users


This means:

HTTP GET
    ↓
https://api.example.com/users


By default, curl performs a GET request.

2. GET
curl https://api.example.com/users


With query parameters:

curl 'https://api.example.com/users?page=2&limit=20'


Important: quote URLs containing &, ?, etc., so your shell doesn't interpret them.

1. See the response headers
curl -i https://api.example.com/users


You might see:

HTTP/1.1 200 OK
Content-Type: application/json

[
  ...
]


-i means:

Include response headers in the output.

2. See EVERYTHING about the request

This is one of the most useful debugging commands:

curl -v https://api.example.com/users


-v = verbose.

It can show:

DNS
connection
TLS
request headers
response headers
redirects


When debugging an API:

Try curl -v before guessing.

3. POST JSON

The pattern you'll use constantly:

curl -X POST https://api.example.com/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dhaval"}'


Break it down:

-X POST
   ↓
HTTP method

-H
   ↓
HTTP header

-d
   ↓
request body


Equivalent HTTP conceptually:

POST /users HTTP/1.1
Content-Type: application/json

{"name":"Dhaval"}

4. POST automatically implies POST with -d

You often don't need:

-X POST


because:

curl -d '{"name":"Dhaval"}' https://api.example.com/users


automatically uses POST.

So this:

curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dhaval"}' \
  https://api.example.com/users


can usually become:

curl \
  -H 'Content-Type: application/json' \
  -d '{"name":"Dhaval"}' \
  https://api.example.com/users


I prefer the shorter version unless explicitly specifying the method improves readability.

5. Headers

General syntax:

-H 'Header-Name: value'


Example:

curl https://api.example.com/users \
  -H 'Authorization: Bearer abc123'


Multiple headers:

curl https://api.example.com/users \
  -H 'Authorization: Bearer abc123' \
  -H 'Accept: application/json'


Think:

-H = add request header

6. Authentication

Bearer token:

curl https://api.example.com/users \
  -H 'Authorization: Bearer TOKEN'


Basic auth:

curl -u username:password https://api.example.com/users


API key:

curl https://api.example.com/users \
  -H 'X-API-Key: abc123'


The exact header depends on the API.

7. PUT / PATCH / DELETE

PUT:

curl -X PUT https://api.example.com/users/123 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice"}'


PATCH:

curl -X PATCH https://api.example.com/users/123 \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice"}'


DELETE:

curl -X DELETE https://api.example.com/users/123


The important distinction:

GET     → retrieve
POST    → create/action
PUT     → replace/update
PATCH   → partial update
DELETE  → delete

8. Status codes

Suppose:

curl https://api.example.com/users


and you get:

{"error":"Unauthorized"}


Don't just look at the body.

Look at the status:

curl -i https://api.example.com/users


You'll see:

HTTP/1.1 401 Unauthorized


The major families:

2xx → success
3xx → redirect
4xx → client/request problem
5xx → server problem


Common ones:

200 OK
201 Created
204 No Content

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests

500 Internal Server Error
502 Bad Gateway
503 Service Unavailable

9. Make JSON readable

If the API returns JSON:

curl https://api.example.com/users | jq


jq is extremely useful.

For example:

curl https://api.example.com/users | jq '.[] | .name'


Could output:

Alice
Bob
Charlie


Think:

curl → get data
jq   → inspect/manipulate JSON


This combination is worth mastering.

10. Save response to a file
curl https://example.com/file.json -o file.json


Or:

curl -o response.json https://api.example.com/users


-o means:

write output to this file.

11. Follow redirects

Sometimes:

curl https://example.com


returns:

301 Moved Permanently


Use:

curl -L https://example.com


-L means:

follow redirects.

Very common.

12. POST data from a file

Instead of:

-d '{"name":"Alice"}'


you can use:

-d @payload.json


Example:

curl https://api.example.com/users \
  -H 'Content-Type: application/json' \
  -d @payload.json


This becomes very useful for large request bodies.

13. Form data

For HTML-style form submission:

curl -X POST https://example.com/login \
  -d 'username=alice&password=secret'


Or:

curl -X POST https://example.com/login \
  -d 'username=alice' \
  -d 'password=secret'


For multipart/file upload:

curl -F 'file=@photo.jpg' https://example.com/upload


-F = multipart form data.

14. The -X trap

You will frequently see:

curl -X GET ...


Usually unnecessary.

GET is already the default.

Similarly:

curl -X POST -d ...


often doesn't need -X POST.

Use -X when you actually need to explicitly select a method:

curl -X PATCH ...


or something unusual/custom.

15. Debugging APIs

This is the workflow I'd memorize.

First
curl URL

Need status + headers?
curl -i URL

Something weird?
curl -v URL

Need JSON readable?
curl URL | jq

Need to reproduce a POST?
curl \
  -H 'Content-Type: application/json' \
  -d '{"foo":"bar"}' \
  URL


This covers a huge percentage of backend debugging.

16. Timing requests

When debugging performance:

curl -w '\nTime: %{time_total}s\n' \
  -o /dev/null \
  -s \
  https://api.example.com/users


Useful metrics include:

time_connect
time_starttransfer
time_total
http_code


This lets you distinguish:

DNS/connection/TLS delay
        vs
server response delay


For serious performance debugging, this becomes very useful.

17. Don't accidentally hide errors

This:

curl https://api.example.com


can return a response even when the server sends:

500


If you're writing scripts, consider:

curl --fail https://api.example.com


or:

curl --fail-with-body https://api.example.com


The latter is especially useful because you can get both:

non-zero exit status
+
error response body


That's much better for automation.

18. Shell scripting matters

This:

curl ...


isn't just a networking command.

It's a Unix program whose:

stdout → response body
stderr → diagnostics
exit code → success/failure


That means you can compose it:

curl ... | jq ...


or:

response=$(curl ...)


or:

if curl --fail ...; then
  echo "success"
fi


This is why curl becomes powerful in CI/CD and debugging scripts.

19. curl vs Postman

Think of them differently.

Postman

Good for:

exploration
saved collections
GUI workflows
team sharing
manual API testing

curl

Good for:

terminal
reproducibility
debugging
CI/CD
scripts
SSH servers
copy-pasteable commands


If someone gives you a curl command, you can reproduce their HTTP request almost exactly.

That's one reason curl is so valuable.

20. Learn to mentally translate curl → HTTP

Given:

curl https://api.example.com/users/123 \
  -H 'Authorization: Bearer abc' \
  -H 'Content-Type: application/json' \
  -X PATCH \
  -d '{"name":"Alice"}'


Mentally translate:

PATCH /users/123

Authorization: Bearer abc
Content-Type: application/json

{"name":"Alice"}


Once you can do this instantly, HTTP debugging gets much easier.

21. Your core cheat sheet
# GET
curl URL

# GET + headers
curl -i URL

# Verbose debugging
curl -v URL

# Follow redirects
curl -L URL

# POST JSON
curl URL \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice"}'

# PATCH
curl -X PATCH URL \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice"}'

# DELETE
curl -X DELETE URL

# Auth
curl URL \
  -H 'Authorization: Bearer TOKEN'

# File body
curl URL \
  -H 'Content-Type: application/json' \
  -d @payload.json

# Pretty JSON
curl URL | jq

# Save response
curl URL -o response.json

# Fail on HTTP errors
curl --fail-with-body URL

22. The 80/20 to memorize

If you only learn 8 things, learn these:

curl URL
curl -i URL
curl -v URL
curl -L URL
curl -H 'Header: value' URL
curl -d 'body' URL
curl -X PATCH URL
curl URL | jq


And understand this structure:

curl
 │
 ├── URL
 ├── method       (-X)
 ├── headers      (-H)
 ├── body         (-d)
 ├── redirect     (-L)
 ├── diagnostics  (-v)
 └── output       (-o / jq)


Once that clicks, curl stops being a collection of flags and becomes what it really is:

A programmable HTTP client that lets you construct and inspect requests directly.
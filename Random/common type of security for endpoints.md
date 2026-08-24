Yes. If you're doing API/input-box security testing, XSS and SQL injection are only two categories. The important ones depend on what the API does with the input.

Common issues to consider
Issue	What you're testing	Typical impact
XSS	Input reaches HTML/JS unsafely	Script execution in user's browser
SQL Injection	Input reaches SQL unsafely	Read/modify/delete DB data
NoSQL Injection	Input reaches MongoDB/other NoSQL queries	Query manipulation/data access
Command Injection	Input reaches OS commands	Server-side command execution
Path Traversal	Input controls file paths	Read/write unintended files
SSRF	Input controls a server-side URL/request	Access internal services
XXE	XML input is parsed unsafely	File disclosure/SSRF
LDAP Injection	Input reaches LDAP queries	Authentication/data access issues
Template Injection	Input reaches a server-side template	Potential server-side code execution
HTTP Header Injection	Input is placed into headers	Header manipulation/cache issues
HTTP Request Smuggling	Proxy/server parses requests differently	Bypass security controls
Open Redirect	User controls redirect destination	Phishing/security bypass
CORS misconfiguration	Untrusted origins can access API	Cross-origin data theft
Broken Access Control / IDOR	User can access another user's resource	Unauthorized data access
Mass Assignment	Client can set fields it shouldn't	Privilege/data manipulation
File Upload	Uploaded files aren't properly validated	Malware, XSS, potentially code execution
DoS / Resource Exhaustion	Huge/expensive input	Slowdown or service outage
Prototype Pollution	Special JSON properties affect JS objects	Logic/security issues
Deserialization issues	Untrusted serialized data is processed	Potential code execution/data corruption
For a normal text input API

If you're specifically testing something like:

POST /reviews
{
  "reviewText": "..."
}


I'd prioritize:

XSS
SQL/NoSQL injection
Oversized input / resource exhaustion
Authorization / IDOR
Mass assignment
HTML/template injection
Unicode/encoding issues
Log injection
Command injection — especially if the text is passed to scripts/tools
SSRF — if the input can influence a URL
One especially relevant issue for your review API

Given your earlier 5 KB review limit, I'd definitely test resource exhaustion.

Don't just test:

5001 bytes


Also test things like:

100 KB
1 MB
10 MB
very large repeated Unicode
very deeply nested JSON


The API should have explicit limits and reject excessive requests before expensive processing.

For example:

HTTP/1.1 413 Payload Too Large


can be appropriate when the request exceeds the API's allowed payload size.

Also test Unicode byte length, since your earlier PostgreSQL/JavaScript discussion is directly relevant:

ASCII characters ≠ UTF-8 bytes


A limit implemented as JavaScript .length may therefore disagree with PostgreSQL OCTET_LENGTH().

One important distinction

Don't make your security test simply:

"Does the API return 400 when I send a malicious string?"

Instead ask:

"Can this input change the behavior of the system in a way the user isn't authorized to cause?"

A malicious-looking string returning 200 can be perfectly secure. A 400 response can still be vulnerable if the application is exploitable through another encoding or input path.
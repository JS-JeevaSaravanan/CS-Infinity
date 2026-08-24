Yes, tokens are typically stored in an authentication flow, but where and how you store them depends on the type of token and your application's architecture.

Common authentication flow
User logs in with credentials.
Server verifies the credentials.
Server generates:
Access Token (short-lived)
Refresh Token (long-lived, optional)
Client stores the token(s).
Client sends the access token with each protected request.
Where should tokens be stored?
Token	Recommended Storage	Why
Access Token	In-memory (preferred) or secure HttpOnly cookie	Limits exposure to XSS attacks
Refresh Token	Secure, HttpOnly, Secure cookie	Not accessible to JavaScript, reducing theft risk

For web applications, storing tokens in HttpOnly cookies is generally considered more secure than storing them in localStorage.

What about localStorage or sessionStorage?

Many applications store access tokens in:

localStorage.setItem("token", accessToken);


While simple, this approach has a drawback:

If your application has an XSS (Cross-Site Scripting) vulnerability, malicious JavaScript could read the token.

Because of this, many modern applications prefer HttpOnly cookies, which JavaScript cannot access.

Should the backend store tokens?

It depends on the authentication mechanism:

JWT Access Token
Usually not stored on the server (stateless).
The server validates the token's signature on each request.
Refresh Token
Often stored in the database so it can be revoked or rotated.

Example:

User
   ↓ Login
Backend
   ↓
Generate JWT Access Token
Generate Refresh Token
   ↓
Store Refresh Token in DB
Send Access Token + Refresh Token to Client

Interview answer

If asked, "Do we store the token in an auth flow?"

A good answer is:

"Yes. After successful authentication, the client stores the access token so it can authenticate future requests. For better security, refresh tokens are commonly stored in secure, HttpOnly cookies, and the backend often stores or tracks refresh tokens to support revocation and rotation. Access tokens, especially JWTs, are typically not stored on the server because they are stateless."

This demonstrates an understanding of both client-side storage and backend token management.
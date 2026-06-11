
### **JWT (JSON Web Token):**  
- **What it is:** A compact, self-contained token format used to securely transmit information between parties.  
- **Structure:** Consists of three parts: Header, Payload, and Signature.  
- **Use case:** Commonly used for user authentication and session management.  
- **Key feature:** Stateless; the token itself contains all the necessary data (e.g., user roles, expiry).  

### **OAuth (Open Authorization):**  
- **What it is:** A framework for token-based authorization that allows third-party apps to access resources on behalf of a user.  
- **Flow:** Involves an Authorization Server, Resource Owner (user), and Client (app).  
- **Use case:** Used to grant scoped access to APIs without exposing user credentials (e.g., "Sign in with Google").  
- **Key feature:** Delegation; separates authentication from authorization.  

**Key Difference:**  
- **JWT:** A token format often used within OAuth for authentication and authorization.  
- **OAuth:** A broader protocol that can use JWT as one of its token formats.



### **JWT (JSON Web Token)**  
1. **Definition:**  
   A secure, self-contained token format used for transmitting claims between parties.

2. **Components:**  
   - **Header:** Specifies the type (JWT) and signing algorithm (e.g., HS256, RS256).  
   - **Payload:** Contains claims (e.g., user data, roles). Not encrypted but Base64 encoded.  
   - **Signature:** Ensures data integrity using a secret key or private/public key pair.

3. **Key Features:**  
   - **Stateless:** Server doesn't store session data; the token carries all necessary information.  
   - **Compact:** Lightweight and easy to pass in HTTP headers, cookies, or URL parameters.  
   - **Verifiable:** Can be validated using the signing key.

4. **Use Cases:**  
   - User authentication (e.g., session tokens).  
   - API authorization (e.g., Bearer tokens).  
   - Secure transmission of metadata.

5. **Security Considerations:**  
   - Always use HTTPS to prevent token interception.  
   - Store secrets securely to avoid signature forgery.  
   - Implement token expiry (`exp` claim) to mitigate misuse.  
   - Avoid storing sensitive data in the payload.

6. **Limitations:**  
   - Tokens are vulnerable if stolen (e.g., XSS attacks).  
   - Cannot be invalidated server-side (statelessness drawback).

---

### **OAuth (Open Authorization)**  
1. **Definition:**  
   A protocol that allows third-party applications to access resources on behalf of a user securely.

2. **Components:**  
   - **Resource Owner (User):** Grants permissions.  
   - **Client (App):** Requests access to resources.  
   - **Authorization Server:** Issues tokens after successful authentication.  
   - **Resource Server:** Provides the resource after verifying the token.

3. **Types of Tokens:**  
   - **Access Token:** Grants access to the resource.  
   - **Refresh Token:** Obtains new access tokens without re-authentication.

4. **OAuth Flows:**  
   - **Authorization Code Flow:** Secure and server-side; often uses JWT for tokens.  
   - **Implicit Flow:** Used for single-page applications (SPA), but less secure.  
   - **Client Credentials Flow:** Used for server-to-server communication.  
   - **Password Grant Flow:** Deprecated due to security concerns.

5. **Use Cases:**  
   - Third-party login (e.g., "Login with Google/Facebook").  
   - Delegated access to APIs (e.g., accessing a user's calendar).

6. **Security Considerations:**  
   - Use PKCE (Proof Key for Code Exchange) for SPAs to mitigate token interception.  
   - Limit token scopes to minimize access.  
   - Employ HTTPS to secure token exchange.  
   - Rotate refresh tokens and enforce token expiration.

7. **Key Features:**  
   - Delegates access without exposing user credentials.  
   - Granular control over permissions (via scopes).  
   - Can integrate with OpenID Connect (OIDC) for user identity verification.

8. **Difference Between OAuth 1.0 and 2.0:**  
   - OAuth 2.0 is simpler, uses bearer tokens, and supports multiple token types.  
   - OAuth 1.0 requires signing each request with a cryptographic signature.

---

### **JWT vs OAuth in Interviews**  
- **Relationship:** OAuth often uses JWT for its tokens, but JWT can work independently (e.g., in custom authentication mechanisms).  
- **Focus:** Be clear on where they fit in modern authentication/authorization workflows.  
- **Real-World Example:** "OAuth powers social logins; JWT is the token format that APIs validate."  
- **Strengths and Weaknesses:** Explain how OAuth handles token lifecycle and scopes, while JWT is lightweight but has revocation challenges.







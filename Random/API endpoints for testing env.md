In your app, if some API endpoints are needed only for testing in development or staging, but should never be available in production, the best approach is to handle this at both the application level and deployment/configuration level.

There are a few ways to do this, depending on your framework and how critical the endpoint is.

## 1. Recommended approach: Environment-based endpoint registration

Keep testing endpoints separate from production endpoints, and register them only in the environments where they are needed.

For example, suppose you have these endpoints:

- `POST /api/test/send-email`
    
- `POST /api/test/clear-cache`
    
- `GET /api/test/generate-dummy-data`
    

These are useful for testing in development and staging, but shouldn't be accessible in production.

Your application can follow this pattern:

javascript

```

const isProduction = process.env.NODE_ENV === "production";

app.get("/api/users", getUsers); // Available everywhere

if (!isProduction) {
  app.post("/api/test/send-email", testSendEmail);
  app.post("/api/test/clear-cache", testClearCache);
  app.get("/api/test/generate-dummy-data", generateDummyData);
}
```

Result:

|Environment|Normal APIs|Testing APIs|
|---|---|---|
|Development|Enabled|Enabled|
|Staging|Enabled|Enabled|
|Production|Enabled|Not registered|

This example uses Express.js, but the same principle applies to Spring Boot, Django, FastAPI, ASP.NET Core, NestJS, and other frameworks.

## 2. Alternative approaches

A. Conditional registration — best for most cases

Register testing routes only when the environment is development or staging. In production, the routes don't exist in the application.

Recommended

B. Feature flags or environment variables

Define a setting such as `ENABLE_TEST_ENDPOINTS=true` in development and staging, and `false` in production.

env

```
# Development / staging
ENABLE_TEST_ENDPOINTS=true

# Production
ENABLE_TEST_ENDPOINTS=false
```

This is useful when you want explicit control instead of relying only on `NODE_ENV`.

C. Authorization or gateway restrictions

Protect testing endpoints with authentication, role-based permissions, or gateway rules. This adds defense in depth, particularly for staging environments accessible over the internet.

This should complement environment-based registration, not replace it when the endpoints must not exist in production.

## 3. What you should avoid

- Don't rely only on hiding endpoints from Swagger/OpenAPI. The endpoint may still be callable directly.
    
- Don't rely only on frontend restrictions. Anyone can send an HTTP request independently of your UI.
    
- Don't rely only on a secret URL or obscure route name. That is not access control.
    
- Don't assume staging is automatically safe. Staging endpoints can still modify data or expose sensitive information.
    
- Don't use a permissive default. If the environment variable is missing in production, testing endpoints should remain disabled.
    

## 4. A robust production-ready design

I would use this combination:

1. Put testing endpoints in a separate module, router, or controller.
    
2. Register that module only when `ENABLE_TEST_ENDPOINTS` is explicitly enabled.
    
3. Set the flag to `false` by default and explicitly disable it in production configuration.
    
4. Add authentication and authorization for staging endpoints.
    
5. Add a deployment or automated test that verifies testing routes are unavailable in production.
    

For example, conceptually:

text

```
Application
├── Common APIs
│   ├── Users
│   ├── Orders
│   └── Payments
│
└── Testing APIs (conditional)
    ├── Generate test data
    ├── Simulate payment callbacks
    └── Clear test cache
```

This keeps testing functionality organized and prevents accidental exposure when deploying to production.

## Let me tailor this to your app

Which backend framework are you using?

Backend framework

Spring Boot Java / Spring Boot

Node.js / Express

NestJS

Python / Django / FastAPI

C# / ASP.NET Core

Other

How do you deploy?

Docker / Kubernetes Docker / Kubernetes

Cloud platform

Traditional server / VM

CI/CD pipeline

What are the endpoints for?

Testing and debugging Testing and debugging

Dummy data generation

Database or cache operations

Mocking external services

Show implementation for my app
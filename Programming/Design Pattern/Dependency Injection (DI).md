

# Dependency Injection (DI) — Modern Practical View

## What is Dependency Injection?

Dependency Injection means:

> A component receives its dependencies from outside instead of creating them internally.

Example:

```ts
function createUserService(repo) {
    return {
        getUser(id) {
            return repo.find(id)
        }
    }
}
```

Here `repo` is injected into `createUserService`.

---

# Why DI matters

DI helps achieve:

- loose coupling
    
- easier testing
    
- easier replacement of implementations
    
- cleaner architecture
    
- better maintainability
    

Without DI:

```ts
const repo = new DatabaseRepo()
```

inside the service tightly couples the code.

With DI:

- dependencies are external
    
- components become reusable and testable
    

---

# Important clarification

## DI ≠ IoC Container

DI is a design principle.

An Inversion of Control container is a framework system that automates:

- object creation
    
- dependency wiring
    
- lifecycle management
    

Examples:

- Spring Framework
    
- ASP.NET Core
    
- NestJS
    

---

# Old enterprise style

Older architectures heavily relied on:

- large IoC containers
    
- annotations/decorators
    
- runtime auto-wiring
    
- reflection
    

Example:

```java
@Autowired
UserRepo repo;
```

This reduced boilerplate but often introduced:

- hidden dependencies
    
- framework magic
    
- harder debugging
    

---

# Modern trend

Modern frameworks increasingly prefer:

- functional composition
    
- explicit dependency passing
    
- lightweight DI
    
- fewer containers
    
- less framework magic
    

Example:

```ts
const service = createUserService({
    repo,
    logger
})
```

Dependencies are visible and explicit.

---

# Composition over inheritance

Older OOP style:

```java
class UserService extends BaseService
```

Modern style:

```ts
const service =
    withCaching(
        withLogging(
            createUserService(repo)
        )
    )
```

Behavior is composed using functions rather than inherited through class hierarchies.

---

# Important insight

Modern systems did NOT abandon DI.

They mainly moved away from:

- heavy IoC containers
    
- implicit runtime wiring
    
- overengineered abstraction layers
    

Toward:

- explicit composition
    
- constructor/function injection
    
- simpler dependency flow
    

---

# Current industry direction

The modern architectural preference is:

> Composition + lightweight explicit DI

instead of:

> Large implicit container-driven architectures

---

# Simple mental model

## DI

```text
"Pass dependencies from outside."
```

## IoC Container

```text
"Framework automatically creates and injects dependencies."
```

---

# Final takeaway

Dependency Injection remains extremely important in modern software engineering.

What changed is:

- not the principle,
    
- but the style of implementation.
    

The industry trend is toward:

- simpler
    
- more explicit
    
- composition-oriented architectures.
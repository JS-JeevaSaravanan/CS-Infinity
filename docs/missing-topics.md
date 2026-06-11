# Missing Topics

Critical gaps identified in this repo, prioritized by relevance to your focus (JS/TS, backend, system design).

---

## Top Priority

### 1. Design Patterns
Only Maybe/Optional pattern exists. Missing the classics:
- Singleton, Factory, Abstract Factory
- Observer, Strategy, Decorator, Command
- Repository, CQRS, Saga
- Event Sourcing

### 2. Distributed Systems & Microservices Patterns
`CS/Distributed Systems/` has 2 files. Missing:
- Event-driven architecture
- Message queues (Kafka, RabbitMQ)
- Circuit breaker, Bulkhead, Retry patterns
- Saga pattern (choreography vs orchestration)
- Service mesh (Istio, Linkerd)
- Eventual consistency patterns
- Outbox pattern

### 3. AI / ML Fundamentals
`AI/` has 3 files. Missing:
- LLM fundamentals (tokenization, attention, transformers)
- Prompt engineering patterns
- Embeddings & vector databases
- Fine-tuning basics
- AI agent patterns & tool use
- Model evaluation metrics

---

## Important Gaps

### 4. Operating Systems
Completely absent. Core CS + interview topic:
- Processes vs threads (deep)
- Scheduling algorithms (Round Robin, CFS)
- Memory management (paging, virtual memory, page faults)
- Deadlocks, semaphores, mutexes
- IPC (pipes, shared memory, message queues)

### 5. Networking — needs depth
Current notes are shallow. Missing:
- TCP/IP deep dive (handshake, flow control, congestion)
- DNS resolution flow
- HTTP/2 vs HTTP/3 (QUIC)
- TLS handshake internals
- CDN internals
- Socket programming basics

### 6. Kubernetes
Docker is well covered but K8s is absent:
- Pods, Deployments, StatefulSets
- Services, Ingress, NetworkPolicy
- ConfigMaps, Secrets
- HPA / VPA (autoscaling)
- Namespaces, RBAC
- Helm basics

### 7. Concurrency & Async (Language-Agnostic)
Scattered across JS event loop and Threads.md. Missing:
- Race conditions, data races
- Mutex, RWMutex, Semaphore
- Deadlock detection & prevention
- Concurrency models: Actor model, CSP
- Lock-free data structures
- Async patterns across languages

### 8. Programming Paradigms — beyond Functional
Functional is well covered. Missing:
- OOP deep dive (SOLID, composition vs inheritance)
- Reactive programming (observables, backpressure)
- Procedural vs declarative comparison

---

## Nice to Have

### 9. Cloud — beyond AWS basics
Current: a few AWS files. Missing:
- IaC — Terraform, CDK
- Serverless patterns & cold starts
- Cloud architecture patterns (well-architected framework)
- Multi-cloud concepts
- FinOps / cost optimization basics

### 10. Performance & Profiling
Frontend perf exists but no systematic coverage:
- Profiling tools (clinic.js, perf, flamegraphs)
- Memory leak detection
- CPU bottleneck analysis
- Backend performance tuning
- DB query optimization (EXPLAIN, indexes deep dive)
- APM tools (Datadog, New Relic)

### 11. Interview Prep — structured
Current notes are thin. Missing:
- Behavioral questions (STAR method)
- System design interview framework (step-by-step)
- Salary negotiation
- Company-specific prep structure
- Coding interview patterns (sliding window, two pointers, etc.)

### 12. Compilers & Language Theory
`CS/Compilers/` has only LLVM. Missing:
- Lexing & parsing (tokenizer, grammar, AST)
- Type systems & type inference
- Memory models
- IR (intermediate representation)
- Relevant especially given Rust interest

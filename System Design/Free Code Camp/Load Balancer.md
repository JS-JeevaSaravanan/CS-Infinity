## What Is a Load Balancer?

A load balancer is a system that distributes incoming client traffic across multiple backend servers to prevent overload and improve:

- Scalability
- Availability
- Reliability
- Performance
- Fault tolerance


It usually acts as a **reverse proxy** between clients and servers.

```text
Client → Load Balancer → Backend Servers
```

---

# Why Load Balancers Are Needed

A single server can handle only limited traffic.

During heavy traffic:
- CPU usage increases
- Memory usage spikes
- Requests slow down
- Server may crash


To solve this:
- Applications scale horizontally by adding more servers.
- A load balancer distributes traffic among them.


---

# Responsibilities of a Load Balancer

- Traffic distribution
- Health checking
- Failover handling
- SSL termination
- Session persistence
- Security filtering
- Routing requests
- Preventing server overload

---

# How Load Balancing Works

1. Client sends request
2. Request reaches load balancer
3. Load balancer selects backend server
4. Request is forwarded
5. Response is returned to client

The client usually does not know which server handled the request.

---


# Common Load Balancing Algorithms

## 1. Round Robin

Requests are distributed sequentially.

```text
A → B → C → A → B
```

### Best For

- Equal-capacity servers
    
- Similar request sizes
    

### Real-World Example

A simple company website where all servers have the same hardware and traffic is predictable.

### Limitation

Does not check server load.

---

# 2. Weighted Round Robin

More powerful servers receive more requests.

```text
Server A → Weight 5
Server B → Weight 2
```

### Best For

Servers with different CPU/RAM capacity.

### Real-World Example

One server has:

- 32 GB RAM
    
- 16 CPUs
    

Another has:

- 8 GB RAM
    
- 4 CPUs
    

The stronger server handles more traffic.

---

# 3. Least Connections

Traffic goes to the server with the fewest active users/connections.

### Best For

Long-running requests.

### Real-World Example

Video streaming or file upload systems where some users stay connected much longer.

### Advantage

Avoids overloading busy servers.

---

# 4. Weighted Least Connections

Chooses:

- Least busy server
    
- While considering server capacity
    

### Best For

Mixed infrastructure with unequal server power.

### Real-World Example

Cloud systems where some machines are larger instances and should handle more users.

---

# 5. Least Response Time

Chooses the server responding fastest.

### Best For

Low-latency applications.

### Real-World Example

- Online gaming
    
- Stock trading
    
- Real-time chat apps
    

where milliseconds matter.

### Advantage

Improves user experience by reducing delay.

---

# 6. IP Hashing

Same client IP always maps to the same server.

```text
Hash(IP) → Server
```

### Best For

Session persistence (sticky sessions).

### Real-World Example

E-commerce websites storing cart/session data in server memory.

A user consistently reaches the same backend server.

### Drawback

Traffic can become uneven.

---

# 7. Consistent Hashing

Uses a hash ring for request distribution.

### Best For

Distributed systems where servers are added/removed frequently.

### Real-World Example

Distributed caches like:

- Redis clusters
    
- Cassandra
    
- DynamoDB
    

When a server fails, only a small portion of data gets reassigned.

### Main Advantage

Minimal redistribution.

---

| Feature                   | Normal Hashing                   | Consistent Hashing                |
| ------------------------- | -------------------------------- | --------------------------------- |
| Mapping Method            | `Hash(key) % N`                  | Hash ring (circular hashing)      |
| When Server Count Changes | Almost all keys remap            | Only small portion remaps         |
| Data Movement             | Very high                        | Minimal                           |
| Cache Impact              | Massive cache misses             | Small cache impact                |
| Scalability               | Poor                             | Excellent                         |
| Stability                 | Unstable during scaling/failures | Stable                            |
| Best For                  | Fixed server count               | Dynamic distributed systems       |
| Used In                   | Simple load balancing            | Distributed caches/databases      |
| Real-World Usage          | Small applications               | Redis, Apache Cassandra, DynamoDB |
|                           |                                  |                                   |

---

# Why Consistent Hashing Is Better

# Normal Hashing

```text
server = Hash(key) % N
```

Example:

```text
Hash(user1) % 3 = Server B
```

If servers change from:

```text
3 → 4
```

then:

```text
Hash(user1) % 4
```

produces a completely different result.

So almost all keys move.

---

# Consistent Hashing Internally

Instead of `% N`,  
consistent hashing places:

- servers
    
- keys
    

on a circular hash ring.

---

# Step 1: Create Hash Ring

```text
0 --- 25 --- 50 --- 75 --- 100
```

---

# Step 2: Hash Servers onto Ring

Example:

```text
Server A → 20
Server B → 50
Server C → 80
```

---

# Step 3: Hash Keys onto Ring

Example:

```text
User1 → 35
User2 → 60
```

---

# Step 4: Find Nearest Clockwise Server

```text
User1 (35) → Server B (50)
User2 (60) → Server C (80)
```

Rule:

> Move clockwise until first server appears.

---

# If a Server Fails

Suppose:

```text
Server B fails
```

Only keys between:

```text
20 → 50
```

move to next server.

Other keys remain unchanged.

---

# Why This Is Powerful

Normal hashing:

```text
Changing N changes everything
```

Consistent hashing:

```text
Only nearby keys move
```

So:

- Minimal redistribution
    
- Better cache efficiency
    
- Easier scaling
    
- Stable distributed systems
    

---

# One-Line Internal Working

> Consistent hashing maps both servers and keys onto a hash ring and assigns each key to the nearest clockwise server.




---

# 8. Geographical Load Balancing

Routes users to the nearest geographic server.

### Best For

Global applications.

### Real-World Example

```text
India User  → Mumbai Server
US User     → Virginia Server
Europe User → Frankfurt Server
```

### Used In

- CDNs
    
- Netflix
    
- YouTube
    
- Global cloud platforms
    

### Advantage

Lower latency and faster response times.

---


# Health Checks

Load balancers continuously monitor server health.

---

## Active Health Checks

Load balancer sends:

- HTTP requests
    
- TCP pings
    

Failed servers are removed from rotation.

---

## Passive Health Checks

Monitors:

- Timeouts
    
- Failed responses
    
- Connection errors
    

---

# Sticky Sessions (Session Persistence)

Sticky sessions ensure a user always hits the same server so session data stored in memory is not lost.

Some applications store session data in server memory.

If a user reaches different servers:

- Session may break
    
- User may get logged out
    
Done using:

- Cookies
- IP hashing


# Problem with Sticky Sessions

- Uneven load (one server may get more users)
- Harder to scale
- If server dies → session is lost

---

# Modern Better Solution

Instead of sticky sessions, systems often use:

- Central session store (Redis / DB)
- So any server can handle any request


---

# Layer 4 vs Layer 7 Load Balancing — Crisp + Deep

---

# Core Idea

- **Layer 4 = connection-based routing**
    
- **Layer 7 = request-aware routing**
    

---

# Layer 4 Load Balancing (Transport Layer)

## What it uses

- IP address
    
- Port (TCP/UDP)
    

## What it does

> Forwards the connection without reading the request content.

---

## How it works (internally)

```text
Client → (IP:Port) → Load Balancer → Server
```

It decides:

- based on network connection only
    
- NOT based on URL or data
    

---

## Example

```text
10.1.1.5:443 → Server A
10.1.1.5:443 → Server B
```

Same request type, just different servers.

---

## Real behavior

If you send:

```text
GET /video
POST /checkout
```

L4 sees ONLY:

```text
TCP request on port 443
```

It does not care about `/video` or `/checkout`.

---

## Key properties

- Very fast ⚡
    
- Low CPU usage
    
- Works at connection level
    
- Cannot do smart routing
    

---

## Real-world use

- Gaming servers
    
- High-frequency trading systems
    
- Simple TCP routing
    

---

# Layer 7 Load Balancing (Application Layer)

## What it uses

Full HTTP request:

- URL
    
- Headers
    
- Cookies
    
- Method (GET/POST)
    

---

## What it does

> Makes decisions based on request content.

---

## How it works

```text
Client → Load Balancer (reads HTTP) → Decision → Server
```

---

## Example routing

```text
GET /video      → Video servers
GET /checkout   → Payment servers
GET /profile    → User service
```

It understands _meaning_ of request.

---

## Real behavior

Request:

```text
GET /checkout
Cookie: user=123
```

Load balancer can:

- check path
    
- check user session
    
- apply rules
    
- route intelligently
    

---

## Key properties

- Smart routing 🧠
    
- Slightly slower (reads full request)
    
- Highly flexible
    
- Supports microservices routing
    

---

## Real-world use

- Web apps
    
- APIs
    
- Microservices systems
    
- Cloud platforms
    

---

# Direct Comparison

|Feature|Layer 4|Layer 7|
|---|---|---|
|Level|Transport|Application|
|Sees|IP + Port|Full HTTP request|
|Decision basis|Connection|Content|
|Speed|Very fast ⚡|Slower|
|Intelligence|Low|High|
|Routing type|Blind forwarding|Smart routing|
|Example|TCP load balancing|/video → media service|

---

# Simple Mental Model

- **Layer 4 = “pipe switch”** (just passes traffic)
    
- **Layer 7 = “smart receptionist”** (reads and decides)
    

---

# One-line Interview Answer

> Layer 4 load balancing routes traffic based on IP and port without inspecting data, while Layer 7 load balancing inspects HTTP content like URL and headers to make intelligent routing decisions.

# SSL Termination by Balancer

## Meaning

Load balancer handles HTTPS encryption/decryption instead of backend servers.

---

## Flow

```text
Client --HTTPS--> Load Balancer --HTTP--> Backend
```

---

## What happens

1. Client sends HTTPS request
2. Load balancer decrypts it
3. Sends HTTP request to backend
4. Backend processes request
5. Load balancer encrypts response back to client
    

---

## Why it is used

- Backend servers don’t do encryption work
- Saves CPU on all servers
- SSL certificate managed in one place (load balancer)
- Easier maintenance
    

---

## Key drawback

Internal traffic between LB and backend is HTTP (not encrypted), so it must stay in a secure private network.

---

## Real-World Example

Used in most cloud systems like:

- Amazon Web Services Application Load Balancer (ALB)
    
- NGINX acting as reverse proxy
    
- HAProxy in high-performance systems
    

---

## One-Line Summary

> SSL termination is when the load balancer decrypts HTTPS traffic so backend servers can handle simple HTTP requests without managing encryption.


---

# Types of Load Balancers

---

## 1. Hardware Load Balancers

Dedicated physical appliances.

### Examples

- F5 Networks BIG-IP
    
- Citrix ADC
    

### Pros

- High performance
    
- Enterprise features
    

### Cons

- Expensive
    

---

## 2. Software Load Balancers

Software-based solutions.

### Examples

- HAProxy
    
- NGINX
    

### Pros

- Flexible
    
- Cost-effective
    

---

## 3. Cloud Load Balancers

Managed cloud services.

### Examples

- Amazon Web Services ELB
    
- Google Cloud Load Balancer
    
- Microsoft Azure Load Balancer
    

### Features

- Autoscaling
    
- Multi-region support
    
- Managed infrastructure
    

---

# Load Balancer Failure

A load balancer itself can become a single point of failure.

If it fails:

- Entire application may become unreachable
    

---

# Preventing Load Balancer Failure

## 1. Active-Active Setup

Multiple load balancers handle traffic together.

### Benefit

Higher scalability.

---

## 2. Active-Passive Setup

One active load balancer + one standby.

### Benefit

Simpler failover.

---

## 3. Health Monitoring

Continuously monitor:

- CPU
    
- Memory
    
- Network
    
- Latency
    

---

## 4. Auto Healing

Cloud systems automatically replace failed instances.

---

## 5. IP Failover

Traffic is redirected to backup load balancer automatically.

---


## Common Techniques

### DNS-Based Routing

DNS returns nearest healthy server.

### Anycast Routing

Same IP shared globally.

Network routes user to nearest server.

---

# Load Balancing in Microservices

Microservices have:

- Multiple services
    
- Multiple instances per service
    

Load balancing distributes requests among service instances.

---

# Client-Side Load Balancing

Client selects service instance.

```text
Client → Service Registry → Instance
```

### Examples

- Netflix Ribbon
    
- Spring Cloud LoadBalancer
    

---

# Server-Side Load Balancing

Dedicated load balancer distributes traffic.

```text
Client → Load Balancer → Instances
```

### Examples

- NGINX
    
- HAProxy
    

---

# Service Discovery

Microservices are dynamic.

Instances frequently:

- Start
    
- Stop
    
- Change IPs
    

Service discovery helps locate healthy instances.

### Examples

- Consul
    
- Eureka
    
- Kubernetes DNS
    

---

# Kubernetes Load Balancing

In Kubernetes:

```text
User
 ↓
Ingress
 ↓
Service
 ↓
Pods
```

- Ingress handles external traffic
    
- Services load balance internally
    
- Pods run application instances
    

---

# Global Server Load Balancing (GSLB)

## Meaning

GSLB distributes user traffic across servers located in **different geographic regions (data centers).**

---

## How it works

```text
User → DNS/GSLB → Select Region → Regional Load Balancer → Servers
```

It decides based on:

- User location
    
- Server health
    
- Network latency
    
- Load in each region
    

---

## Example

```text
India user  → Mumbai data center
US user     → Virginia data center
Europe user → Frankfurt data center
```

---

## Why it is used

- Reduces latency (user connects nearby region)
    
- Disaster recovery (if one region fails, others take over)
    
- Global scalability
    

---

## Key idea

> GSLB = load balancing across _countries/regions_, not just servers.

---

# How Health Checks Work

## Meaning

Health checks ensure only **working servers receive traffic.**

---

## How it works

Load balancer continuously checks servers:

### Active Health Check

Load balancer actively sends requests:

```text
LB → /health endpoint → Server
```

If response is:

- OK → server is healthy
    
- Fail/timeout → server is removed
    

---

### Passive Health Check

Load balancer observes real traffic:

- failures
    
- timeouts
    
- errors
    

If errors increase → server marked unhealthy

---

## What gets checked

- CPU/memory load
    
- response time
    
- HTTP status (200/500)
    
- TCP connection success
    

---

## What happens on failure

```text
Unhealthy Server → Removed from rotation → No traffic sent
```

---

## Key idea

> Health checks = automatic filtering of bad servers.

---

# Load Balancing in Microservices

## Meaning

Microservices systems have:

- many services (auth, payment, cart)
    
- multiple instances of each service
    

Load balancing is needed at **multiple levels.**

---

# A. Service-to-Service Load Balancing

Each service has multiple instances:

```text
Payment Service:
  Instance 1
  Instance 2
  Instance 3
```

Traffic is distributed among them using:

- round robin
    
- least connections
    
- client-side LB
    

---

# B. Client-Side Load Balancing

Client chooses service instance.

```text
Client → Service Registry → Instance selection
```

Example tools:

- Spring Cloud LoadBalancer
    
- Netflix Ribbon
    

---

# C. Server-Side Load Balancing

Dedicated load balancer handles routing:

```text
Client → Load Balancer → Service Instances
```

Example tools:

- NGINX
    
- HAProxy
    

---

# D. Service Discovery (Critical Part)

Services are dynamic (start/stop often), so system needs registry:

Examples:

- Consul
    
- Eureka
    
- Kubernetes
    

---

## Full flow

```text
User
 ↓
API Gateway
 ↓
Load Balancer
 ↓
Service Discovery
 ↓
Service Instances
```

---

## Why load balancing is critical in microservices

- Prevents overload on single instance
    
- Enables horizontal scaling
    
- Supports fault tolerance
    
- Improves response time
    
- Enables rolling deployments
    

---

## Key idea

> In microservices, load balancing happens at gateway level, service level, and sometimes client level.

---

---

# CDN vs Load Balancer vs API Gateway (Crisp + Deep Comparison)

|Feature|CDN (Content Delivery Network)|Load Balancer|API Gateway|
|---|---|---|---|
|Main Purpose|Deliver content fast to users|Distribute traffic across servers|Manage and control API requests|
|Works on|Edge locations (near user)|Data center / cloud region|Front door of backend services|
|Primary Role|Caching + content delivery|Traffic distribution|Request management + control|
|Type of traffic|Mostly static content (images, videos, JS, CSS)|Any application traffic|API requests (microservices)|
|Decision basis|User location (geography)|Server load / algorithm|API rules (auth, path, headers)|
|Latency focus|Very low (edge caching)|Medium (routing efficiency)|Slightly higher (processing logic)|
|Caching|Yes (core feature)|No (usually not)|Limited / optional|
|Security features|DDoS protection, edge filtering|Basic routing security|Authentication, authorization, rate limiting|
|Example routing|Serve image from nearest edge|Send request to least busy server|`/login → auth service`, `/pay → payment service`|

---

# Simple Real-World Understanding

## CDN

> “Bring data closer to the user”

Example:

- Image loads from nearby city server instead of main server
    

Used by:

- Cloudflare
- Amazon Web Services CloudFront
    

---

## Load Balancer

> “Distribute traffic across multiple backend servers”

Example:

- 1 lakh users → split across 10 servers

Used by:

- NGINX
- HAProxy
    

---

## API Gateway

> “Single entry point for all APIs with control”

Example:

- Login request → auth service
- Payment request → payment service
    

Used for:

- Authentication
- Rate limiting
- Request routing
- Logging
    

Used in:

- Microservices systems
- Cloud-native apps
    

---

# One-Line Memory Trick

- **CDN = closer to user (speed)**
- **Load Balancer = distributes traffic (scaling)**
- **API Gateway = controls APIs (management + security)**

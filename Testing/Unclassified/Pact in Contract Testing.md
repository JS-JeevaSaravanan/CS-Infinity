
## ✅ What is **Pact** in Contract Testing?

**Pact** is an open-source tool for **consumer-driven contract testing**, used to ensure **independent services (like microservices)** can communicate with each other correctly.

---

## 📜 What is Contract Testing?

In microservices architecture, services often talk to each other via APIs. **Contract testing** verifies that:

- The **consumer** (e.g., frontend or another microservice) makes requests in a specific format.
    
- The **provider** (e.g., backend API) responds in the expected format.
    

Instead of spinning up all services for integration tests, you **test the contracts (interfaces) between them**.

---

## 🤝 Pact’s Role: Consumer-Driven Contracts

With **Pact**, the consumer (e.g., frontend) **defines the contract**, and the provider agrees to it.

### 🔁 How Pact Works:

1. ✅ **Consumer writes expectations** (mock interactions)
    
2. 📄 Pact generates a **contract file (JSON)**
    
3. ☁️ Contract is shared with provider (via Pact Broker or CI/CD)
    
4. 🔬 Provider **verifies** they meet the contract
    
5. 💥 If provider breaks the contract → test fails
    

---

## 🧪 Example Flow

### 👩‍💻 Consumer Test (e.g., frontend):

```js
const provider = new Pact({...});
provider
  .given('User exists')
  .uponReceiving('a request for user details')
  .withRequest({ method: 'GET', path: '/user/1' })
  .willRespondWith({ status: 200, body: { id: 1, name: 'Alice' } });
```

This generates a contract like:

```json
{
  "request": { "method": "GET", "path": "/user/1" },
  "response": { "status": 200, "body": { "id": 1, "name": "Alice" } }
}
```

### 👨‍🔧 Provider Verifies It

Provider runs Pact **verification tests** against the actual implementation to confirm it meets this contract.

---

## 🌐 Pact Broker (Optional)

A **Pact Broker** is a service for **sharing contracts** between teams/services, enabling:

- Versioning
    
- CI/CD integration
    
- Contract status visualization
    

---

## 🛠️ When to Use Pact?

|Scenario|Use Pact?|
|---|---|
|Microservices with API dependencies|✅ Yes|
|Frontend ↔ Backend integration|✅ Yes|
|Backend ↔ Third-party API|⚠️ Maybe (if mockable)|
|Internal monolith|❌ Not needed|

---

## 🔚 Summary

|Term|Description|
|---|---|
|Pact|A contract testing framework|
|Contract|The expected API interaction between services|
|Consumer|The service making the API call|
|Provider|The service responding to the call|
|Pact Broker|A central hub for sharing and verifying contracts|

---


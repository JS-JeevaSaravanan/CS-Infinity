

In **PostgreSQL**, **SSL** means **Secure Sockets Layer (actually TLS)** used to **encrypt the connection between client and database server**.

---

## 🔹 What it does

👉 Ensures:

- **Encryption** → data isn’t readable in transit
    
- **Integrity** → data isn’t tampered
    
- **Authentication** → optional server/client verification
    

---

## 🔹 Simple meaning

👉 **SSL in Postgres = secure, encrypted DB connection**

---

## 🔹 Example connection

```bash
postgres://user:pass@host:5432/db?sslmode=require
```

---

## 🔹 Common `sslmode` values

|Mode|Meaning|
|---|---|
|`disable`|No SSL|
|`prefer`|Try SSL, fallback if not available|
|`require`|Always use SSL (no verification)|
|`verify-ca`|Verify server certificate|
|`verify-full`|Full verification (hostname + cert)|

---

## 🔹 When you use it

- Production DBs (especially cloud like RDS, Cloud SQL)
    
- When connecting over public networks
    
- Compliance/security requirements
    

---

## ⚠️ Important nuance

- “SSL” is the common term
    
- Technically it’s **TLS (modern secure protocol)**
    

---

## 🧠 Crisp takeaway

👉 **SSL in Postgres means encrypting the DB connection so data is secure over the network.**


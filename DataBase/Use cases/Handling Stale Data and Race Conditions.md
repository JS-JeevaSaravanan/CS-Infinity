

# 🗂️ **Soft Deletes Gone Wrong**: Handling Stale Data and Race Conditions

## 💡 Use Case: Archiving User Records

Let’s say you're working on a service where users can be archived (soft deleted) but **not permanently deleted**, for audit and recovery purposes.

Your `users` table has a schema like:

|id|name|email|is_active|archived_at|
|---|---|---|---|---|
|1|Alice|[alice@mail.com](mailto:alice@mail.com)|true|NULL|
|2|Bob|[bob@mail.com](mailto:bob@mail.com)|false|2023-01-01 12:00:00|

- A user is considered **active** if `is_active = true` and `archived_at IS NULL`.
    
- When archived:
    
    - `is_active = false`
        
    - `archived_at` is set to a timestamp
        

---

## ❗ The Problem: Race Conditions Cause Inconsistent States

Your service has **two API calls** that update users:

1. **`DELETE /users/{id}`** → soft deletes the user
    
2. **`PUT /users/{id}`** → updates user fields
    

Both touch the same row. Here’s what can go wrong:

1. User sends a **delete request**.
    
2. Before it's committed, another service **saves a profile update** (like `name`).
    
3. That update sets `is_active = true` again — **undoing the soft delete**.
    

You now have:

|id|name|email|is_active|archived_at|
|---|---|---|---|---|
|1|Alice|[alice@mail.com](mailto:alice@mail.com)|true ✅|2023-01-01 12:00:00 ❌|

A user with both **active and archived states**. Inconsistent!

---

## ✅ Fixing It With SQL: Clean Up Invalid Soft Deletes

Here’s a generic SQL fix that identifies rows with **conflicting values** and resets `is_active = false` when `archived_at` is NOT NULL.

```sql
UPDATE users
SET is_active = false
WHERE archived_at IS NOT NULL
  AND is_active = true;
```

This ensures:

- If a user is archived (`archived_at IS NOT NULL`), they **must not be active**.
    

---

## 🔍 Alternative Approaches

### 1. **Eliminate Redundancy**: Drop `is_active`

Let the archive timestamp speak for itself:

```sql
SELECT * FROM users
WHERE archived_at IS NULL;
```

**Pros:**

- No duplication of state
    
- Eliminates inconsistency risks
    

**Cons:**

- Requires changes to app logic
    
- May impact performance if `archived_at` isn’t indexed
    

---

### 2. **Enforce Consistency with a CHECK Constraint**

In databases that support it (PostgreSQL, SQL Server, etc.):

```sql
ALTER TABLE users
ADD CONSTRAINT active_consistency
CHECK (
  (archived_at IS NULL AND is_active = true) OR
  (archived_at IS NOT NULL AND is_active = false)
);
```

**Pros:**

- Prevents invalid state at write-time
    

**Cons:**

- Not supported in all databases (e.g., MySQL prior to 8.0 ignores CHECK)
    
- Won’t fix old data — only prevents new inconsistencies
    

---

### 3. **Use a Trigger to Enforce Business Rules**

```sql
CREATE TRIGGER sync_user_status
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.archived_at IS NOT NULL THEN
    SET NEW.is_active = false;
  END IF;
END;
```

**Pros:**

- Automatically enforces correct state
    
- Handles manual SQL and app updates
    

**Cons:**

- Adds hidden logic that may confuse future devs
    
- Can complicate migrations
    

---

### 4. **Use a View to Abstract Soft Deletes**

Define a view that filters out archived users:

```sql
CREATE VIEW active_users AS
SELECT * FROM users
WHERE archived_at IS NULL;
```

Use this view in app queries instead of directly hitting `users`.

**Pros:**

- Keeps app logic simple
    
- Prevents accidental inclusion of archived users
    

**Cons:**

- Can confuse ORMs or query builders
    
- Adds another layer of abstraction
    

---

## 🔁 Prevention Techniques

### ✅ Application Layer: Enforce Idempotent Updates

In the API or service layer:

- **Before updating a user**, check if `archived_at IS NULL`.
    
- If not, **block the update** or warn the caller.
    

```python
if user.archived_at is not None:
    raise ConflictError("Cannot update archived user")
```

---

### ✅ Use Transactions

Wrap multiple actions (archive + update) into a single transaction:

```sql
BEGIN;

UPDATE users SET archived_at = NOW(), is_active = false WHERE id = 1;

-- Other related updates (e.g., logging, audit trails)

COMMIT;
```

This ensures state changes happen together, reducing race conditions.

---

## 📚 Summary

|Approach|Prevents Issue|Fixes Data|Complexity|Notes|
|---|---|---|---|---|
|SQL clean-up query|❌|✅|Low|Good for batch correction|
|Drop `is_active` flag|✅|✅|Medium|Simplifies model|
|CHECK constraint|✅|❌|Low|DB-level enforcement|
|Triggers|✅|✅|Medium|Good if used with care|
|Views|✅|❌|Low|Great for read-only use|
|Application guard clauses|✅|❌|Low|Simple, needs discipline|
|Transactions|✅|❌|Medium|Best with concurrent systems|

---

## 🔚 Conclusion

Soft deletes are common — but without careful enforcement, they lead to **stale, contradictory, or buggy data**.

Just like `is_latest` flags, duplicating state (`is_active` vs. `archived_at`) is a classic source of inconsistency.

💡 Best practice: **Pick one source of truth**, enforce it at the database or app level, and run periodic cleanups if needed.

---

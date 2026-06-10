



# ⚖️ **Handling Inventory Consistency in E-Commerce Systems**

## 🛒 Use Case: Managing Product Stock in High-Traffic Applications

In an e-commerce platform, you have a `product_inventory` table that tracks how many units of a product are available for purchase:

|product_id|stock_quantity|
|---|---|
|101|10|
|102|5|

Each time a customer places an order, the system **reduces the `stock_quantity`**.

Simple, right?

---

## ❗ The Problem: Overselling Due to Race Conditions

Let’s say two customers try to buy the **same product at the same time**:

- Product 101 has `stock_quantity = 1`
    
- Two customers click "Buy" almost simultaneously
    

Both requests:

1. Read `stock_quantity` = 1
    
2. See it's available
    
3. Deduct 1 unit
    
4. Write back `stock_quantity = 0` 🛑
    

But they **both succeed** — now you’ve sold 2 items when only 1 existed. **Overselling has occurred.**

This is a **race condition**, and it happens more often than you'd think — especially during flash sales or viral launches.

---

## ✅ SQL Fix (Cleanup + Protection)

To clean up **over-decremented stock** (optional, if stock is allowed to go negative):

```sql
UPDATE product_inventory
SET stock_quantity = 0
WHERE stock_quantity < 0;
```

To **prevent** future overselling, you need a safer update.

---

## ✅ Solution: Atomic Stock Decrease

Instead of:

```sql
-- BAD: prone to race conditions
SELECT stock_quantity FROM product_inventory WHERE product_id = 101;

-- (application logic: if stock_quantity > 0, then ...)
UPDATE product_inventory
SET stock_quantity = stock_quantity - 1
WHERE product_id = 101;
```

Do **this** in a single atomic operation:

```sql
-- Safe, atomic update
UPDATE product_inventory
SET stock_quantity = stock_quantity - 1
WHERE product_id = 101 AND stock_quantity > 0;
```

Then, **check rows affected** in your application:

- If 1 row was updated → purchase success ✅
    
- If 0 rows were updated → out of stock ❌
    

This avoids the race condition entirely.

---

## 🔄 Alternative Approaches

### 1. **Use Transactions with SELECT FOR UPDATE**

In SQL:

```sql
BEGIN;

-- Lock the row to prevent concurrent access
SELECT stock_quantity
FROM product_inventory
WHERE product_id = 101
FOR UPDATE;

-- Check stock in app logic, then update
UPDATE product_inventory
SET stock_quantity = stock_quantity - 1
WHERE product_id = 101;

COMMIT;
```

**Pros:**

- Prevents overselling
    
- Guarantees safe concurrent access
    

**Cons:**

- Slower under high load
    
- Potential for deadlocks if not handled carefully
    

---

### 2. **Use Optimistic Locking**

Add a `version` column:

|product_id|stock_quantity|version|
|---|---|---|
|101|5|42|

Update with a version check:

```sql
UPDATE product_inventory
SET stock_quantity = stock_quantity - 1,
    version = version + 1
WHERE product_id = 101
  AND stock_quantity > 0
  AND version = 42;
```

If no rows are affected → retry.

**Pros:**

- No locks, better for high concurrency
    
- Works well with retry logic
    

**Cons:**

- Requires retry mechanism in the app
    
- Adds complexity to application logic
    

---

### 3. **Separate Reservation Table**

Instead of decreasing stock immediately, **reserve inventory** first.

```sql
-- inventory table remains unchanged
-- create a new reservation
INSERT INTO stock_reservations (product_id, user_id, quantity)
VALUES (101, 1, 1);
```

Then periodically reconcile confirmed orders vs reservations.

**Pros:**

- Avoids contention on inventory table
    
- Better for pre-orders or long checkout flows
    

**Cons:**

- Adds complexity
    
- Requires cleanup of stale reservations
    

---

## 🔐 Prevention Techniques

|Technique|Prevents Oversell|Best For|Notes|
|---|---|---|---|
|Atomic SQL update|✅|Simple systems|Fast, safe, and easy to implement|
|SELECT FOR UPDATE|✅|Complex logic flows|Slower, but safer under concurrency|
|Optimistic locking|✅|High-concurrency apps|Requires retries|
|Reservation system|✅|Event-driven / carts|Separates intent from commit|
|Background reconciler|❌|Audit only|Doesn’t prevent, just fixes|

---

## ⚠️ Common Interview Traps

- Assuming "check then update" is safe — it’s not unless inside a transaction
    
- Forgetting to handle the case when update affects 0 rows
    
- Not planning for **inventory reconciliation** during order failures or cancellations
    
- Ignoring **idempotency** — what if the same order hits twice?
    

---

## 📚 Summary

|Approach|Prevents Oversell|Complexity|Notes|
|---|---|---|---|
|Atomic `UPDATE ... WHERE stock > 0`|✅|Low|Most common production fix|
|`SELECT FOR UPDATE` transaction|✅|Medium|Safe but can block|
|Optimistic locking|✅|Medium|Retry logic needed|
|Reservation system|✅|High|Great for real-world systems|
|Periodic clean-up|❌|Low|Fixes after the fact|

---

## 🔚 Final Thoughts

Inventory consistency is a textbook case of how **race conditions** can silently damage your system — and it's one of the most asked backend interview questions.

When designing such systems, always ask:

- Can this be **decomposed into atomic steps**?
    
- What happens if **two users act simultaneously**?
    
- Do I have the right **constraints or indexes** to enforce integrity?
    

💡 Rule of thumb: **If your logic is "check then act", put it in a transaction — or rethink it.**

---

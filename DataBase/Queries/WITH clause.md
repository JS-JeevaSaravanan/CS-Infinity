

# 🧩 Mastering the SQL `WITH` Clause — Real-World Use Cases

The **`WITH` clause**, also called a **Common Table Expression (CTE)**, is one of the most elegant ways to write **modular, readable, and maintainable SQL**.  
It lets you define **temporary result sets** that exist only for the duration of a single query — like inline views, but far cleaner.

Let’s see how it shines in **real-world use cases**.

---

## ⚙️ 1. Breaking Down Complex Queries

### 🔸 Problem

When business logic spans multiple subqueries (e.g., filtering, grouping, and joining), the SQL becomes unreadable fast.

### 💡 Example: Top 3 restaurants by average rating per city

```sql
WITH city_avg AS (
  SELECT city, restaurant_id, AVG(rating) AS avg_rating
  FROM reviews
  GROUP BY city, restaurant_id
),
ranked AS (
  SELECT *,
         RANK() OVER (PARTITION BY city ORDER BY avg_rating DESC) AS rank
  FROM city_avg
)
SELECT city, restaurant_id, avg_rating
FROM ranked
WHERE rank <= 3;
```

**Why it’s great:**  
Instead of nesting three layers of SELECTs, you give each step a name — **readable, reusable, testable**.

---

## 🧮 2. Reusing Calculations Across Multiple Queries

### 🔸 Problem

You compute the same derived dataset (e.g., filtered list, totals) across multiple operations — repeating it increases risk of drift.

### 💡 Example: Deleting related records safely

```sql
WITH target_review AS (
  SELECT id
  FROM review
  WHERE publisher_review_id = 'abc123'
)
DELETE FROM reply WHERE review_id IN (SELECT id FROM target_review);
DELETE FROM review WHERE id IN (SELECT id FROM target_review);
```

**Why it’s great:**  
Define once, use twice — no duplication, no mistakes.

---

## 🧾 3. Recursive Queries (Hierarchies, Trees)

### 🔸 Problem

You need to walk a hierarchy — e.g., employees → managers, categories → subcategories — without multiple joins.

### 💡 Example: Find all subcategories under “Electronics”

```sql
WITH RECURSIVE subcategories AS (
  SELECT id, name, parent_id
  FROM categories
  WHERE name = 'Electronics'
  UNION ALL
  SELECT c.id, c.name, c.parent_id
  FROM categories c
  JOIN subcategories s ON c.parent_id = s.id
)
SELECT * FROM subcategories;
```

**Why it’s great:**  
CTEs can **self-reference** — perfect for organizational charts, folder structures, or taxonomy trees.

---

## 📈 4. Simplifying Stepwise Transformations (ETL)

### 🔸 Problem

Data transformations often happen in **phases** — extract → clean → enrich → aggregate.

### 💡 Example: Monthly revenue pipeline

```sql
WITH raw_orders AS (
  SELECT * FROM orders WHERE created_at >= '2025-01-01'
),
cleaned AS (
  SELECT id, customer_id, total_amount, DATE(created_at) AS order_date
  FROM raw_orders
  WHERE total_amount > 0
),
monthly_revenue AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(total_amount) AS revenue
  FROM cleaned
  GROUP BY 1
)
SELECT * FROM monthly_revenue;
```

**Why it’s great:**  
Each step is isolated, readable, and debuggable — just like functional programming.

---

## 🧱 5. Temporary “Joins” Across Multiple Operations

### 🔸 Problem

You need a **temporary derived dataset** (e.g., filtered users) used in multiple follow-up actions — but don’t want to create a table.

### 💡 Example: Operate on a specific user segment

```sql
WITH premium_users AS (
  SELECT id FROM users WHERE plan = 'premium' AND status = 'active'
)
SELECT COUNT(*) FROM premium_users;
UPDATE users SET notified = TRUE WHERE id IN (SELECT id FROM premium_users);
```

**Why it’s great:**  
Acts like an **in-memory table**, without persisting anything.

---

## 🧠 6. Debugging and Readability in Analytics

CTEs are great for analysts who want to **build incrementally** —  
run one part, check results, then extend.

### 💡 Example:

```sql
WITH step1 AS (SELECT * FROM orders WHERE amount > 0),
     step2 AS (SELECT customer_id, SUM(amount) AS total FROM step1 GROUP BY 1),
     step3 AS (SELECT * FROM step2 WHERE total > 1000)
SELECT * FROM step3;
```

**Why it’s great:**  
Each step can be previewed independently — perfect for notebooks, dashboards, or BI pipelines.

---

## ⚡ Summary Table

|Use Case|Description|Benefit|
|---|---|---|
|Simplify complex queries|Split multi-layer SELECTs into readable chunks|Maintainability|
|Reuse temporary data|Define once, use multiple times|DRY, safer changes|
|Recursive hierarchies|Handle tree-like data|No stored procedures|
|ETL transformations|Step-by-step logic for pipelines|Debuggable, modular|
|Temporary data joins|Reuse filtered or computed sets|Cleaner than temp tables|
|Analytics readability|Incremental debugging|Transparency, testing ease|

---

## 🏁 Final Thought

> The `WITH` clause turns messy SQL into **declarative, stepwise logic**.  
> Think of it as **“functions for queries”** — small, composable, and human-friendly.

---

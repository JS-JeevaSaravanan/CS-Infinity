

# 📘 Bulk Insert with Error Handling – MongoDB vs Postgres

---

## 1. **MongoDB**

- **Default behavior:**  
    `insertMany` fails the entire batch if one document errors.
    
- **Solution:** Use `ordered: false`
    
    ```js
    await Model.insertMany(docs, { ordered: false });
    ```
    
    - ✅ Inserts valid docs
        
    - ❌ Skips invalid ones
        
    - You can inspect `err.writeErrors` to identify failed docs.
        
- **Status tracking:** Build a success/failure list by comparing `insertedDocs` with input.
    
- **Alternative:** Use `bulkWrite` for mixed operations (`insertOne`, `deleteOne`, etc.).
    

---

## 2. **Postgres**

Postgres behaves differently:

- **Default behavior:** If any row fails (FK violation, duplicate, null, etc.), the **entire `INSERT` fails and rolls back**.
    

---

### 2.1 Handling Duplicates → `ON CONFLICT`

- Best if **only duplicate keys** are the problem.
    
- Example:
    
    ```sql
    INSERT INTO items (id, name, value)
    VALUES (1, 'apple', 10), (2, 'banana', 20)
    ON CONFLICT (id) DO NOTHING
    RETURNING id;
    ```
    
- ✅ Inserts valid rows
    
- ✅ Skips duplicates
    
- ✅ Use `RETURNING` to detect successful rows
    
- ❌ Does **not** handle FK errors, null violations, type errors, etc.
    

---

### 2.2 Handling Any Constraint Failures

If you want to **insert valid rows but skip bad ones** (e.g., FK violations, nulls, check constraints):

#### **Option A: Staging Table (Recommended for Bulk)**

1. Bulk insert into a **temporary staging table** (no constraints).
    
2. Validate rows using SQL (`JOIN` with FK tables, check conditions).
    
3. Insert only valid rows into the target table.
    
4. Collect invalid rows for error reporting.
    

✅ Keeps bulk performance  
✅ Allows detailed error reporting  
❌ Requires extra logic

#### **Option B: Row-by-Row Insert with Exception Blocks**

- Use PL/pgSQL loop with `BEGIN … EXCEPTION … END` per row.
    
- ✅ Works for any error type
    
- ❌ Slow for large batches
    

#### **Option C: Application Layer Fallback**

- Try **bulk insert first**.
    
- If it fails, fallback to **row-by-row insert** in the application (collect statuses).
    
- ✅ Best of both worlds (fast path + safe path)
    
- ❌ Requires app logic for retry/fallback
    

---

## 3. **Throwing Custom Exceptions**

You wanted bulk inserts to behave consistently with single inserts (where you throw custom exceptions).

- ✅ This is possible:
    
    - Use `RETURNING` (with `ON CONFLICT`) or validation queries (with staging).
        
    - Build a **status report per row** (`success` / `failed` + `reason`).
        
    - If any failures → throw a **custom bulk exception** containing that report.
        

Example structure:

```json
{
  "message": "Bulk insert had failures",
  "statuses": [
    { "id": 1, "status": "success" },
    { "id": 2, "status": "failed", "reason": "foreign key violation" }
  ]
}
```

---

## 4. **Performance Considerations**

- Row-by-row inserts are **very slow** → avoid if you expect large batches.
    
- Best options:
    
    - **Duplicates only:** `ON CONFLICT`
        
    - **Mixed constraints:** Staging + Validation
        
    - **Occasional dirty data:** Bulk insert first, fallback to row-by-row on error
        

---

# ✅ Final Takeaway

- MongoDB → `insertMany({ ordered: false })` handles per-doc errors.
    
- Postgres → no native per-row skipping. You need:
    
    - `ON CONFLICT` for duplicates, or
        
    - **Staging table + validation** for broader error handling, or
        
    - Row-by-row (slow) or app fallback strategy.
        
- To mimic your **single insert exception flow**, collect per-row statuses (success/failure + reason) and throw a **custom bulk exception** after the insert.
    

---


This is a pretty common pattern, but the approach depends on the **database** you’re using. Since earlier you mentioned **Drizzle + Postgres**, I’ll focus on that.

---

## ✅ Options for Bulk Insert with Per-Row Error Handling

### 1. **Postgres `INSERT ... ON CONFLICT DO NOTHING`**

- Insert everything in one statement.
    
- Bad rows (e.g., duplicates) get silently skipped.
    
- You can then query back which rows actually made it.
    

```sql
INSERT INTO reviews (id, publisher, text)
VALUES 
  (1, 'google', 'review1'),
  (2, 'bing', 'review2'),
  (3, 'google', 'review3')
ON CONFLICT DO NOTHING
RETURNING id;
```

In code (Drizzle/Node), you can:

- Collect the returned IDs = **success list**.
    
- Compare against input = infer **failed list**.
    

📖 Reference: [Postgres ON CONFLICT docs](https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT)

---

### 2. **Use a `COPY` into a staging table + validation**

- Bulk load all rows into a **staging table** (super fast).
    
- Validate in SQL which rows are “good” vs “bad”.
    
- Insert valid rows into the main table, keep the invalid ones for reporting.
    

This is common in ETL pipelines.

📖 Reference: [Postgres COPY](https://www.postgresql.org/docs/current/sql-copy.html)

---

### 3. **`unnest()` with `RETURNING`**

- Pass arrays of values.
    
- Insert all at once.
    
- Use `RETURNING` to see what succeeded.
    

📖 Reference: [Postgres unnest](https://www.postgresql.org/docs/current/functions-array.html)

---

### 4. **Drizzle ORM bulk insert with `onConflictDoNothing`**

If you’re on Drizzle:

```ts
await db.insert(reviews)
  .values(reviewsToInsert)
  .onConflictDoNothing()
  .returning();
```

- You get back all successful inserts.
    
- To know which failed: diff against input.
    

📖 Reference: [Drizzle ORM Insert API](https://orm.drizzle.team/docs/insert)

---

## ⚡ Practical Advice

- If most of your issues are **conflicts/duplicates** → go with **Option 1 (`ON CONFLICT DO NOTHING`)**.
    
- If issues could be **data quality/validation errors** → better to use **staging table** (Option 2).
    
- For **performance**: never loop row by row unless the batch is very small (<100).
    

---

👉 Do you want me to draft a **NestJS + Drizzle service example** where you insert a bulk list of reviews, and it returns `{ success: [...], failed: [...] }` automatically?




---

Got it 👍 you don’t want the explanation to be tied just to your **`reply`** table — you want a **domain-generic** version you can apply anywhere (users, orders, products, reviews, etc.).

Here’s the **generic template** 👇

---

## ✅ Bulk Insert with Error Handling (Domain Generic)

### 1. **Simple Bulk Insert with Duplicates Ignored**

Use when only duplicates need skipping.

```ts
import { db, schema } from './db';

type EntityInsert = {
  id?: number;
  field1: string;
  field2: number;
  createdAt: string;
};

async function bulkInsertEntities(
  tx: any,
  entities: EntityInsert[],
): Promise<{ success: number[]; failed: EntityInsert[] }> {
  try {
    const inserted = await tx
      .insert(schema.entity) // generic table
      .values(entities)
      .onConflictDoNothing() // ignore duplicates
      .returning({ id: schema.entity.id });

    const successIds = inserted.map(r => r.id);
    const failed = entities.filter(e => !successIds.includes(e.id!));

    return { success: successIds, failed };
  } catch (err) {
    console.error('Bulk insert error:', err);
    return { success: [], failed: entities };
  }
}
```

✅ Works great for **duplicate keys**.  
❌ Still fails entire batch on **foreign key violations**.

---

### 2. **Row-by-Row (Parallel with `Promise.allSettled`)**

Use when you need **per-row error visibility**, even for foreign key errors.

```ts
async function insertEntitiesOneByOne(
  tx: any,
  entities: EntityInsert[],
): Promise<{ success: EntityInsert[]; failed: { entity: EntityInsert; error: any }[] }> {
  const results = await Promise.allSettled(
    entities.map(entity =>
      tx.insert(schema.entity).values(entity).returning()
    ),
  );

  const success: EntityInsert[] = [];
  const failed: { entity: EntityInsert; error: any }[] = [];

  results.forEach((res, idx) => {
    if (res.status === 'fulfilled') {
      success.push(entities[idx]);
    } else {
      failed.push({ entity: entities[idx], error: res.reason });
    }
  });

  return { success, failed };
}
```

✅ Fine-grained success/failure.  
❌ Slower for large datasets.

---

### 3. **Hybrid Approach (Batch + Fallback)**

Use when you want **speed first, row-level error only when needed**.

```ts
async function bulkInsertHybrid(
  tx: any,
  entities: EntityInsert[],
): Promise<{ success: EntityInsert[]; failed: { entity: EntityInsert; error: any }[] }> {
  try {
    // try in bulk
    const inserted = await tx
      .insert(schema.entity)
      .values(entities)
      .onConflictDoNothing()
      .returning({ id: schema.entity.id });

    const success = inserted.map(i => entities.find(e => e.id === i.id)!);
    const failed = entities.filter(e => !success.includes(e));

    return { success, failed: failed.map(f => ({ entity: f, error: 'conflict/constraint' })) };
  } catch (err) {
    console.warn('Bulk insert failed, retrying one by one...');
    return insertEntitiesOneByOne(tx, entities); // fallback to detailed
  }
}
```

✅ Fast in normal case.  
✅ Still gives per-row error details when things go wrong.  
✅ Recommended for **domain-generic batch operations**.

---

### 4. **Staging Table Validation (ETL Style)**

Use when inserting **huge datasets** and you want DB-driven validation.

```sql
-- Create staging table without constraints
CREATE TEMP TABLE entity_stage (LIKE entity INCLUDING DEFAULTS);

-- Load bulk data
COPY entity_stage FROM 'data.csv' (FORMAT csv);

-- Insert valid rows
INSERT INTO entity (field1, field2, created_at)
SELECT field1, field2, created_at
FROM entity_stage s
WHERE EXISTS (SELECT 1 FROM parent p WHERE p.id = s.parent_id);

-- Fetch invalid rows
SELECT *
FROM entity_stage s
WHERE NOT EXISTS (SELECT 1 FROM parent p WHERE p.id = s.parent_id);
```

✅ Best for **millions of rows**.  
✅ Keeps invalid rows separate.  
❌ More infra-heavy, not always worth it for small datasets.

---

## 📌 Generic Recommendation

- **Small datasets (<10k rows)** → Use **Hybrid** (Option 3).
    
- **Large datasets (100k+ rows)** → Use **Staging table + validation**.
    
- **When only duplicates are possible** → Use **Option 1**.
    

---


Absolutely! Here’s a **generic, reusable hybrid bulk insert utility** using Drizzle + Postgres that:

1. Tries a **fast bulk insert** first.
    
2. Falls back to **row-by-row inserts** with `Promise.allSettled` if bulk fails.
    
3. Returns per-row success/failure.
    
4. Works **for any entity/table**.
    

---

```ts
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { InsertQueryBuilder } from 'drizzle-orm';

// Generic types
type BulkInsertResult<T> = {
  success: T[];
  failed: { entity: T; error: any }[];
};

/**
 * Hybrid bulk insert: tries bulk first, then row-by-row fallback
 * @param db - Drizzle NodePgDatabase instance
 * @param table - Drizzle table object
 * @param entities - array of objects to insert
 */
export async function hybridBulkInsert<T>(
  db: NodePgDatabase<any>,
  table: InsertQueryBuilder<any, any>,
  entities: T[],
): Promise<BulkInsertResult<T>> {
  if (entities.length === 0) return { success: [], failed: [] };

  return db.transaction(async (tx) => {
    try {
      // Attempt fast bulk insert
      const inserted = await tx
        .insert(table)
        .values(entities)
        .onConflictDoNothing() // optional: skip duplicates
        .returning(); // optional: you can select the inserted fields

      const success = inserted.map((_, idx) => entities[idx]);
      const failed = entities.filter((_, idx) => !inserted[idx]); // not returned => failed

      return { success, failed: failed.map(f => ({ entity: f, error: 'conflict/constraint' })) };
    } catch (bulkError) {
      console.warn('Bulk insert failed, falling back to row-by-row', bulkError);

      // Row-by-row fallback using Promise.allSettled
      const results = await Promise.allSettled(
        entities.map(entity => tx.insert(table).values(entity).returning()),
      );

      const success: T[] = [];
      const failed: { entity: T; error: any }[] = [];

      results.forEach((res, idx) => {
        if (res.status === 'fulfilled') {
          success.push(entities[idx]);
        } else {
          failed.push({ entity: entities[idx], error: res.reason });
        }
      });

      return { success, failed };
    }
  });
}
```

---

### ✅ Usage Example

```ts
import { schema, db } from './db';
import { ReplyEntity } from './ReplyEntity';

const replies: ReplyEntity[] = [...];

const { success, failed } = await hybridBulkInsert(db, schema.reply, replies);

console.log('Successfully inserted:', success.length);
console.log('Failed inserts:', failed.length);
failed.forEach(f => console.error(f.error, f.entity));
```

---

### 🔑 Features

- Works **for any table/entity**.
    
- Handles **bulk insert conflicts** with `onConflictDoNothing()`.
    
- Falls back to **row-level inserts** with full success/failure info.
    
- Optional: you can extend `.onConflictDoUpdate()` for upserts.
    

---



TO check {


https://www.postgresql.org/docs/current/sql-copy.html

https://docs.mulesoft.com/mule-runtime/latest/batch-error-handling-faq

https://stackoverflow.com/questions/1340062/handling-errors-and-feedback-when-performing-bulk-operations-in-a-multi-tiered-a

https://app.studyraid.com/en/read/11939/380666/error-handling-in-bulk-operations

https://apps2fusion.com/errors-handling-in-bulk-collect-and-forall-using-sqlbulk_exceptions/

}
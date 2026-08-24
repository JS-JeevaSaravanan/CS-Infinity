
What is COALESCE in SQL?

COALESCE is a SQL function used to return the first non-NULL value from a list of values.

Think of it as:

"Try this value. If it's NULL, try the next one. Keep going until you find a non-NULL value."

Syntax
COALESCE(value1, value2, value3, ...)


SQL checks from left → right and returns the first value that isn't NULL.

Simple example

Suppose you have:

name	phone	email
John	NULL	john@gmail.com
Sarah	9876543210	sarah@gmail.com
Mike	NULL	NULL

You want a contact value, preferring:

Phone
Email
"No contact"
SELECT
    name,
    COALESCE(phone, email, 'No contact') AS contact
FROM users;


Result:

name	contact
John	john@gmail.com
Sarah	9876543210
Mike	No contact
What's happening?

For John:

COALESCE(NULL, 'john@gmail.com', 'No contact')
          ↓
     first non-NULL
          ↓
   john@gmail.com


For Sarah:

COALESCE('9876543210', 'sarah@gmail.com', 'No contact')
          ↓
     first non-NULL
          ↓
       9876543210


For Mike:

COALESCE(NULL, NULL, 'No contact')
                    ↓
              first non-NULL
                    ↓
                No contact

Why is COALESCE useful?

A very common use is providing default values for NULLs.

Imagine:

SELECT name, salary, bonus
FROM employees;


You get:

name	salary	bonus
John	50000	5000
Sarah	60000	NULL
Mike	45000	NULL

If you calculate:

SELECT
    name,
    salary + bonus AS total
FROM employees;


Sarah and Mike may get:

NULL


because:

60000 + NULL = NULL


You can fix it with:

SELECT
    name,
    salary + COALESCE(bonus, 0) AS total
FROM employees;


Now:

name	total
John	55000
Sarah	60000
Mike	45000

Here:

COALESCE(bonus, 0)


means:

If bonus is NULL, treat it as 0.

COALESCE with multiple values

This is where it becomes particularly powerful.

COALESCE(a, b, c, d)


is basically:

Is a NULL?
 ├── No → return a
 └── Yes
      ↓
Is b NULL?
 ├── No → return b
 └── Yes
      ↓
Is c NULL?
 ├── No → return c
 └── Yes
      ↓
return d


For example:

SELECT COALESCE(NULL, NULL, 'Hello', 'World');


Result:

Hello


Because Hello is the first non-NULL value.

Real-world example: User addresses

Suppose you have:

users
--------------------------------
id
name
home_address
work_address
temporary_address


You want to display the user's best available address:

SELECT
    name,
    COALESCE(
        temporary_address,
        home_address,
        work_address,
        'Address not available'
    ) AS address
FROM users;


The priority is:

temporary_address
        ↓
home_address
        ↓
work_address
        ↓
"Address not available"


So COALESCE is often used to implement fallback logic.

COALESCE vs CASE

You could write:

CASE
    WHEN phone IS NOT NULL THEN phone
    WHEN email IS NOT NULL THEN email
    ELSE 'No contact'
END


But COALESCE is much cleaner:

COALESCE(phone, email, 'No contact')


So when your logic is simply:

"Give me the first non-NULL value"

COALESCE is usually the better choice.

Important: NULL is not the same as empty string

This is a common source of confusion.

Suppose:

phone = ''


That's an empty string, not NULL.

Therefore:

COALESCE(phone, 'No phone')


will return:

''


It will not return "No phone".

Because COALESCE only checks for NULL.

If you want to treat both NULL and empty strings as missing, you may need something like:

COALESCE(NULLIF(phone, ''), 'No phone')


NULLIF(phone, '') converts an empty string into NULL, after which COALESCE can provide the fallback.

One very important use: aggregation

Suppose:

SELECT SUM(bonus)
FROM employees;


Depending on the data/query, you may get NULL when there are no values to sum.

You can provide a default:

SELECT COALESCE(SUM(bonus), 0) AS total_bonus
FROM employees;


Meaning:

Calculate the sum. If the result is NULL, give me 0.

This pattern is extremely common:

COALESCE(SUM(amount), 0)
COALESCE(COUNT(...), 0)

Think of it this way

If you see:

COALESCE(A, B, C)


read it as:

"Give me A. If A is NULL, give me B. If B is NULL, give me C."

For example:

COALESCE(phone, email, 'No contact')


means:

phone available?
    ↓
   YES → phone
    ↓ NO
email available?
    ↓
   YES → email
    ↓ NO
"No contact"

The one-line definition

COALESCE returns the first non-NULL expression from left to right.

That's the core concept. Everything else is just different ways of using that fallback behavior.


---

# Why can `COALESCE()` prevent DB index usage?

First: the statement **"COALESCE doesn't work with indexes" is too broad**.

The real rule is:

> An index is easiest to use when the database can compare the indexed column directly against a condition.

---

## 1. The important difference

Suppose you have:

```sql
CREATE INDEX idx_users_name ON users(name);


This is naturally index-friendly:

WHERE name = 'Alice'


Conceptually:

index
  ↓
name = 'Alice'
  ↓
jump directly to matching entries


But now:

WHERE COALESCE(name, 'Unknown') = 'Alice'


You are no longer asking:

"Is the indexed value equal to Alice?"


You're asking:

"After transforming the indexed value with COALESCE,
is the result equal to Alice?"


The database may not be able to use the ordinary name index as efficiently.

1. Why?

An ordinary index stores something conceptually like:

name index

Alice
Bob
Charlie
David
...
NULL


But your condition is on:

COALESCE(name, 'Unknown')


So the database needs to reason about:

name
 ↓
COALESCE(name, 'Unknown')
 ↓
compare with 'Alice'


The existing index is ordered by:

name


not by:

COALESCE(name, 'Unknown')


That's the key.

2. Think "index order"

An index isn't magic storage for arbitrary expressions.

For:

CREATE INDEX idx ON users(name);


the database has an ordered access structure based on:

name


It can efficiently answer:

WHERE name = 'Alice'
WHERE name > 'Alice'
ORDER BY name


But:

WHERE LOWER(name) = 'alice'


is asking about:

LOWER(name)


and:

WHERE COALESCE(name, 'Unknown') = 'Alice'


is asking about:

COALESCE(name, 'Unknown')


Those are different indexed expressions.

3. The classic example

You have:

CREATE INDEX idx_users_name
ON users(name);


Query:

SELECT *
FROM users
WHERE COALESCE(name, 'Unknown') = 'Alice';


Potentially:

Index:
name

Query:
COALESCE(name, 'Unknown')


Mismatch.

Compare with:

SELECT *
FROM users
WHERE name = 'Alice';


Now:

Index:
name

Query:
name


Perfect alignment.

4. But COALESCE doesn't ALWAYS kill the index

This is very important.

PostgreSQL's optimizer can sometimes transform queries, and whether an index is used depends on:

statistics
selectivity
table size
available indexes
query shape
PostgreSQL version
cost estimates

So don't memorize:

COALESCE() = no index.

Memorize:

Applying a function/expression to an indexed column can make a normal index harder or impossible to use directly. Check the execution plan.

5. The classic "optional filter" problem

This is where you see COALESCE frequently.

Someone writes:

WHERE column = COALESCE(:parameter, column)


Meaning:

if parameter exists:
    filter by parameter

if parameter is NULL:
    don't filter


Example:

WHERE publisher = COALESCE(:publisher, publisher)


Looks elegant.

But when:

publisher


is the indexed column, you've created a condition involving the column on both sides.

You may make it harder for the optimizer to use:

INDEX(publisher)


efficiently.

6. Usually better: explicit predicates

Instead of:

WHERE publisher = COALESCE(:publisher, publisher)


prefer:

WHERE
  :publisher IS NULL
  OR publisher = :publisher


This is more explicit about the semantics.

However, this still doesn't guarantee an index scan.

Why?

Because the optimizer sees:

parameter is NULL
OR
publisher = parameter


and must account for both possibilities.

For some workloads, PostgreSQL may choose a sequential scan.

7. The best solution can be different queries

For performance-sensitive endpoints, dynamically constructing the predicate can be better.

If publisher exists:

WHERE publisher = $1


If publisher doesn't exist:

-- no publisher predicate


Now the first query has a very clear shape:

publisher = $1
      ↓
idx_publisher


This is one reason query builders such as Drizzle are useful.

You can conditionally add:

query.publisher !== undefined
  ? eq(publisherExpr, query.publisher)
  : undefined


instead of forcing everything into one clever SQL expression.

8. What about COALESCE in SELECT?

This is different:

SELECT COALESCE(name, 'Unknown')
FROM users;


Here, COALESCE is not being used to filter rows.

The database can still use an index for some other reason.

For example:

SELECT COALESCE(name, 'Unknown')
FROM users
WHERE id = $1;


The index on id can absolutely be used.

So the problem isn't:

"COALESCE exists somewhere in the query"


The important question is:

Is the indexed column being transformed in the predicate/order/join that I'm trying to optimize?

9. Functional indexes solve this

If you genuinely need:

WHERE COALESCE(name, 'Unknown') = 'Alice'


you can create an index on the expression:

CREATE INDEX idx_users_name_coalesce
ON users (COALESCE(name, 'Unknown'));


Now:

query expression
      ↓
COALESCE(name, 'Unknown')

index expression
      ↓
COALESCE(name, 'Unknown')


They match.

Then PostgreSQL can potentially use that functional index.

This is a powerful concept:

If you frequently query by an expression, you can index the expression itself.

10. But don't blindly create functional indexes

Every index has costs:

INSERT
UPDATE
DELETE
    ↓
index maintenance


and:

storage
memory/cache pressure
vacuum work


So ask:

Is this query frequent?
Is it performance-critical?
Is the expression selective?
Is the table large?


Don't create an index just because an expression appears once.

11. COALESCE and NULL semantics

There's another subtle issue.

Suppose:

WHERE COALESCE(name, 'Unknown') = 'Unknown'


This matches:

name = NULL


and:

name = 'Unknown'


because:

COALESCE(NULL, 'Unknown')
    → 'Unknown'

COALESCE('Unknown', 'Unknown')
    → 'Unknown'


But:

WHERE name = 'Unknown'


only matches actual:

name = 'Unknown'


So replacing COALESCE with a simpler predicate isn't always semantically equivalent.

This is a major reason to understand the query rather than blindly optimize it.

12. The mental model

Think of an index as an ordered lookup structure.

CREATE INDEX ON users(name)

          ↓

       name
        │
   ┌────┴────┐
 Alice       Bob
              ...


Good:

WHERE name = 'Alice'


The query asks about the thing the index is ordered by.

Potentially problematic:

WHERE LOWER(name) = 'alice'

WHERE COALESCE(name, 'Unknown') = 'Alice'

WHERE SUBSTRING(name, 1, 3) = 'Ali'


The query asks about a transformed version of the indexed value.

You need either:

rewrite the predicate


or:

index the expression

13. The most important practical rule

When you see:

WHERE some_function(indexed_column) = ...


immediately ask:

14. Can I rewrite this without transforming the column?

15. If not, should I create a functional index?

16. What does EXPLAIN ANALYZE say?


Never decide purely from intuition.

Run:

EXPLAIN (ANALYZE, BUFFERS)
SELECT ...


and inspect whether PostgreSQL chooses:

Index Scan
Index Only Scan
Bitmap Index Scan


or:

Seq Scan

17. One-line takeaway

Indexes are ordered around the indexed expression. If your query transforms the indexed column with COALESCE, LOWER, CAST, etc., the normal index may no longer directly match the predicate; rewrite the query or create an expression index, and verify with EXPLAIN.


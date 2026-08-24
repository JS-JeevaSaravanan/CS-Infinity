
Cascading Rollback in DBMS

Cascading rollback happens when the failure (rollback) of one transaction causes other dependent transactions to also roll back.

It occurs when a transaction reads data that was modified by another transaction before it was committed (called dirty data).

Example

Suppose we have two transactions:

Transaction T1

T1: Write X = 100


(T1 has not committed yet)

Transaction T2

T2: Read X
    Write Y = 200


(T2 uses the value written by T1)

Now suppose T1 fails:

T1 → ROLLBACK


Since T2 used data from T1 that is now invalid, T2 must also be rolled back:

T1 → ROLLBACK
T2 → ROLLBACK


This chain reaction is called cascading rollback.

Diagram
T1 writes X
     |
     ↓
T2 reads X
     |
     ↓
T3 reads data from T2

If T1 fails:

T1 rollback
     ↓
T2 rollback
     ↓
T3 rollback

Why does it happen?

It happens when the database allows:

A transaction to read uncommitted data from another transaction.
Transactions to depend on unfinished transactions.

This is common in lower isolation levels.

How to prevent cascading rollback?

DBMSs use higher isolation levels and strict schedules.

A strict schedule ensures:

A transaction cannot read data written by another transaction until that transaction commits.
A transaction cannot overwrite data written by an uncommitted transaction.

Example:

T1: Write X
T1: COMMIT
T2: Read X


Now if T1 fails, T2 is unaffected because it never used uncommitted data.

Cascading rollback vs normal rollback
Type	Meaning
Normal rollback	Only the failed transaction is undone
Cascading rollback	Failed transaction causes dependent transactions to undo their work

In short: Cascading rollback is a chain reaction of transaction failures caused by reading uncommitted data.


---

How to prevent cascading rollback in DBMS

Cascading rollback can be prevented by ensuring that a transaction does not read or depend on uncommitted data from another transaction.

The main methods are:

1. Use Strict Schedules (Strict 2PL)

A strict schedule prevents a transaction from:

Reading data written by an uncommitted transaction.
Writing data written by an uncommitted transaction.

Example:

Without strict scheduling:

T1: Write(X)
T2: Read(X)
T1: Rollback
T2: Rollback  ← Cascading rollback


With strict scheduling:

T1: Write(X)
T1: Commit
T2: Read(X)


If T1 fails before committing, T2 never reads the invalid value.

2. Use Strict Two-Phase Locking (Strict 2PL)

In Strict 2PL:

A transaction holds its write locks until it commits or rolls back.
Other transactions cannot access modified data until the first transaction finishes.

Example:

T1 obtains write lock on X
        |
        ↓
T1 updates X
        |
        ↓
T1 commits
        |
        ↓
T2 can read X


This eliminates dirty reads.

1. Use Higher Transaction Isolation Levels

DBMSs provide isolation levels:

Isolation Level	Prevents Cascading Rollback?
Read Uncommitted	❌ No
Read Committed	✅ Mostly prevents dirty reads
Repeatable Read	✅ Yes
Serializable	✅ Yes

Using Read Committed or higher isolation prevents transactions from reading uncommitted changes.

2. Use Commit Before Sharing Data

A transaction should commit its changes before allowing other transactions to use them.

Example:

Bad:

T1: Update account balance
T2: Read account balance
T1: Rollback


Good:

T1: Update account balance
T1: Commit
T2: Read account balance

Summary
Method	How it prevents cascading rollback
Strict schedule	Blocks access to uncommitted data
Strict 2PL	Keeps write locks until commit/rollback
Higher isolation levels	Prevents dirty reads
Proper commit order	Avoids dependency on unfinished transactions

The most common DBMS solution is using a strict schedule with Strict Two-Phase Locking (Strict 2PL).


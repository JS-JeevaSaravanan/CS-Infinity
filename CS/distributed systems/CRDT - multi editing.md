

# CRDTs Explained

## How Google Docs Handles Multiple People Typing Simultaneously

Imagine a shared document containing:

```text
cat
```

Two users edit it at the same time:

- Alice wants:
    

```text
chat
```

- Bob wants:
    

```text
cats
```

At first glance, this sounds easy.

In reality, collaborative editing is one of the hardest distributed systems problems in computer science.

---

# The Core Problem

Both users start from the same snapshot:

```text
cat
```

Alice sends:

```text
Insert "h" at index 1
```

Bob sends:

```text
Insert "s" at index 3
```

---

# What Goes Wrong?

If Alice’s edit arrives first:

```text
cat → chat
```

Now indexes shifted.

Bob still says:

```text
Insert at index 3
```

But index 3 is no longer after `t`.

The result becomes:

```text
chast
```

instead of:

```text
chat + cats
```

---

# The Real Problem

Indexes are unstable.

```text
Index 3 in "cat"
≠
Index 3 in "chat"
```

As soon as someone edits the document:

- positions move
    
- indexes become invalid
    
- delayed operations break
    

This is called:

# Index Shift Problem

---

# Traditional Solution: Operational Transformation (OT)

Google Docs originally used:

# OT (Operational Transformation)

The server:

1. Receives edits
    
2. Recalculates shifted indexes
    
3. Rewrites operations
    
4. Broadcasts corrected operations
    

---

## Example

Bob says:

```text
Insert "s" at index 3
```

Server notices Alice already inserted `"h"`.

So server transforms Bob’s operation into:

```text
Insert "s" at index 4
```

---

# Problem With OT

OT works well but:

- extremely complex
    
- difficult edge cases
    
- relies heavily on central server
    
- offline editing is hard
    

---

# CRDT Approach

CRDT stands for:

# Conflict-Free Replicated Data Type

Instead of fixing conflicts later:

```text
CRDTs make conflicts mathematically impossible.
```

---

# Core Idea

CRDTs stop using indexes.

Instead:

```text
Every character gets a permanent unique ID.
```

---

# Example

Original text:

```text
c a t
```

Stored internally as:

|Character|ID|
|---|---|
|c|Alice-1|
|a|Alice-2|
|t|Alice-3|

IDs never change.

---

# How Insertions Work

Alice inserts:

```text
h
```

between:

```text
c and a
```

Instead of saying:

```text
Insert at index 1
```

CRDT says:

```text
Insert after c
Insert before a
```

Internally:

|Character|Origin Left|Origin Right|
|---|---|---|
|h|c|a|

---

# Why This Works

Even if:

- network delays happen
    
- users go offline
    
- messages arrive hours later
    

The instruction:

```text
Between c and a
```

always makes sense.

Unlike indexes.

---

# Simultaneous Inserts

Suppose:

- Alice inserts `"h"`
    
- Bob inserts `"x"`
    

Both between:

```text
c and a
```

Now both edits target same gap.

CRDT resolves this deterministically.

---

# Deterministic Ordering

Each operation includes:

- client ID
    
- operation counter
    

Example:

|User|Operation ID|
|---|---|
|Alice|Alice-4|
|Bob|Bob-1|

Rule:

```text
Sort by client ID
```

Result everywhere:

```text
c h x a t
```

Every machine independently reaches same result.

No central server required.

---

# Key Mathematical Property

CRDT operations are:

|Property|Meaning|
|---|---|
|Commutative|Order doesn't matter|
|Associative|Grouping doesn't matter|
|Idempotent|Repeating operation is safe|

This guarantees:

# Eventual Consistency

All replicas eventually become identical.

---

# How Deletions Work

Deleting is tricky.

Suppose:

```text
a
```

gets removed.

Another delayed operation may still reference it.

If fully deleted:

```text
references break
```

---

# CRDT Solution: Tombstones

Deleted characters stay internally.

Only marked:

```text
isDeleted = true
```

UI hides them.

But references still work.

---

# Example

Visible:

```text
ct
```

Internal:

```text
c [a deleted] t
```

Future operations can still safely reference `"a"`.

---

# Why CRDTs Are Powerful

CRDTs allow:

- offline editing
    
- peer-to-peer collaboration
    
- no locking
    
- no merge conflicts
    
- no central coordination
    

---

# Local-First Software

With CRDTs:

- user edits offline for hours
    
- reconnects later
    
- changes merge automatically
    

This powers:

- collaborative editors
    
- offline-first apps
    
- multiplayer systems
    

---

# Real-World CRDT Libraries

|Library|Usage|
|---|---|
|Yjs|Collaborative editors|
|Automerge|Local-first apps|
|Fluid Framework|Microsoft collaboration|
|Replicache|Sync engines|

---

# Real-World Products Using CRDT Concepts

|Product|Purpose|
|---|---|
|Google Docs|Real-time collaboration|
|Figma|Multiplayer design editing|
|Notion|Collaborative documents|
|Linear|Offline sync|
|Excalidraw|Multiplayer whiteboards|

---

# CRDT vs OT

|Feature|OT|CRDT|
|---|---|---|
|Needs central server|Usually yes|No|
|Offline support|Hard|Excellent|
|Complexity|Very high|High but cleaner|
|Merge conflicts|Possible|Mathematically avoided|
|Scalability|Moderate|Excellent|

---

# Internal Data Structures

Modern CRDT engines optimize memory using:

- doubly linked lists
    
- B-trees
    
- compressed operation logs
    
- tombstone compaction
    
- delta synchronization
    

Without optimization:

```text
millions of edits
=
massive memory usage
```

---

# Biggest Tradeoff of CRDTs

CRDTs solve synchronization beautifully, but:

- metadata overhead is large
    
- tombstones consume memory
    
- implementation is mathematically difficult
    

You trade:

```text
more memory
for
simpler distributed consistency
```

---

# Why CRDTs Matter

CRDTs fundamentally change collaboration.

Instead of:

```text
locking files
```

or:

```text
constantly resolving conflicts
```

they make distributed edits naturally converge through mathematics.

That is why modern collaborative software feels instant, smooth, and resilient even under terrible network conditions.

---

# One-Line Summary

> CRDTs solve collaborative editing by replacing unstable indexes with permanent character identities, allowing all replicas to independently merge concurrent edits into the same final state without conflicts or central coordination.
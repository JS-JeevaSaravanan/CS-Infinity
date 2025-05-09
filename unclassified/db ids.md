

UUID - Universally Unique Identifier


UUID secureness :
Someone played around with UUIDs secureness.. Theo roasted 
https://www.youtube.com/watch?v=K1qvTYJccP8




**Hi** **@channel****, starting a thread on uuid inclusion in mapping tables.**  
We'll be performing DB migrations on mloc mapping table to introduce a new auto-generating UUID column.Even though it's highly unlikely for the uuid collision to happen (1 in 2^122), should we encounter it, postgres will halt the operation (during record insertion or migration). Do you have any thoughts on the proactive error-handling approach for this case? Or should we be approaching it reactively, by observing the DB logs?


Since UUID collisions are extremely rare in real-world use cases, monitoring DB logs and relying on Postgres' built-in unique constraint enforcement should be sufficient


ULID stands for ==Universally Unique Lexicographically Sortable Identifier==. It's a 128-bit identifier, similar to UUID, but with the added feature of being lexicographically sortable, meaning it can be sorted alphabetically and still maintain chronological order based on its time-based component. This makes ULIDs suitable for use cases where time-based sorting or partitioning is needed, such as in databases


[https://medium.com/@sammaingi5/uuid-vs-ulid-how-ulid-improves-write-speeds-d16b23505458](https://medium.com/@sammaingi5/uuid-vs-ulid-how-ulid-improves-write-speeds-d16b23505458)

is ULID just like UUID but better? Or are there any cons for ULID?


It’s a similar unique ID that's time-based, which means we can sort them chronologically.  
 I read that it depends on the system time, so if the system time is unstable, it _could_ lead to issues - though that’s pretty rare. (edited)

Great question! ULIDs are indeed a compelling alternative to UUIDs, especially in systems that benefit from **sortable identifiers**. But they're not a strict "replacement"—just a different tool with different trade-offs.

---

### ✅ **ULID Advantages over UUID:**

1. **Lexicographically Sortable**
    
    - ULIDs encode a timestamp in the first 10 characters.
        
    - This makes them **naturally ordered by creation time**, great for databases, logs, or events.
        
2. **More Human-Friendly**
    
    - ULIDs use **Crockford’s Base32**, avoiding ambiguous characters like `I`, `L`, `O`, and `0`.
        
    - So they’re easier to read, copy, and debug.
        
3. **Compact & URL-safe**
    
    - ULIDs are 26 characters (vs 36 for UUIDs), and don’t require dashes or special formatting.
        
4. **Good for High-Insert Workloads**
    
    - Their sortability improves write patterns (e.g., avoiding index fragmentation in ordered DBs like PostgreSQL with `btree`).
        

---

### ❌ **Cons of ULID:**

1. **Time-Based = Predictable**
    
    - Since the timestamp is encoded, part of the ULID can be guessed.
        
    - Could be a **privacy concern** or **attack vector** if used as public IDs.
        
2. **Clock Dependency**
    
    - If your system clock goes backward or is unstable, you can get **duplicates** (though most libraries handle this with a monotonic counter).
        
3. **Less Standardized**
    
    - UUIDs have an RFC and are universally supported across databases and APIs.
        
    - ULIDs don’t have a universal standard or widespread built-in support (yet).
        
4. **Limited Time Range**
    
    - ULID’s timestamp fits in 48 bits: good up to the year **10895**, so it’s not a real limitation, but technically shorter range than UUIDv1's timestamp.
        

---

### 🆚 When to Use Which?

|Use Case|Recommended ID|
|---|---|
|Need strict uniqueness + randomness|UUIDv4|
|Need sortability & insert performance|ULID|
|Need both time and uniqueness, with some standardization|UUIDv7 (or ULID)|
|Public-facing IDs with security in mind|UUID (not ULID)|

---

### TL;DR:

> **ULID is great** if you want sortable, compact, and readable IDs.  
> But **UUID is still better** for standardized support, total randomness, and public-facing scenarios.  
> Choose based on your priorities (e.g., sortability vs unpredictability).

Let me know if you want code examples comparing ULID vs UUID generation or DB performance!


When comparing **UUID** and **ULID**, the performance differences come down to a few key factors:

### 1. **Size and Format**:

- **UUID**: A standard UUID (specifically UUIDv4) is 16 bytes (128 bits) in size and is typically represented as a 36-character string (including hyphens).
    
- **ULID**: A ULID (Universally Unique Lexicographically Sortable Identifier) is 16 bytes as well but encoded differently. It uses a 128-bit number, with the first 48 bits representing a timestamp, and the remaining 80 bits for random data.
    

**Performance**: ULID may be marginally faster in terms of space efficiency due to its encoding format, which is lexicographically sortable. UUIDs are more standardized, but ULIDs have the advantage of a more compact representation when encoded as base32 or base58.

### 2. **Generation Speed**:

- **UUID** (v4, specifically): Is typically generated using random numbers. It can be computationally expensive since generating random values requires more entropy or randomness.
    
- **ULID**: ULIDs use a timestamp-based approach, which allows for faster generation because it combines a time component (milliseconds) with random data. The timestamp portion ensures uniqueness over time, and the random part helps ensure uniqueness in high-concurrency environments.
    

**Performance**: ULIDs are generally faster in generation due to their timestamp-based structure, which can be computed more quickly than generating truly random values for UUIDs.

### 3. **Lexicographical Sorting**:

- **UUID**: UUIDs are not naturally sortable by time (though v1 UUIDs are time-based, they aren't lexicographically sortable).
    
- **ULID**: ULIDs are designed to be lexicographically sortable, meaning you can sort them as strings in the same order as their creation time.
    

**Performance**: Sorting ULIDs in databases or applications can be more efficient because they can be ordered just by comparing their string representation, which aligns with their timestamp.

### 4. **Uniqueness**:

- Both UUID and ULID are designed to be unique across space and time. However, **UUIDv4** (random) has a very low chance of collision due to its large randomness space (2^122 possible values), while **ULID** uses both a timestamp and randomness, which also guarantees uniqueness but with a different distribution.
    

**Performance**: Both are highly reliable in terms of uniqueness, though **UUIDs** can be slower to generate in some contexts because of the need to generate random data for each identifier.

### Summary:

- **ULID** tends to have better performance in terms of generation speed and sorting due to its timestamp-based structure.
    
- **UUID** (v4) is widely used and more standardized but can be slower in high-performance environments because it relies on random number generation.
    

For most applications, **ULID** will outperform UUID in terms of generation speed and sorting, but UUIDs are still the more widely accepted standard. If you're looking for high performance and lexicographical sorting, **ULID** is the better choice.



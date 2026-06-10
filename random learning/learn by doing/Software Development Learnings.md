
 

## Input Validation

  

### Validation at Boundaries

**Principle**: Validate input at system boundaries, not in business logic.

  

- ✅ Declarative validation (decorators, schemas) → clear contract, consistent errors, self-documenting

- ❌ Manual if-checks scattered through services → inconsistent, hard to maintain, easy to miss

- Boundaries: API endpoints (DTOs), function parameters (guards), database writes (constraints)

  

**Why**: Single responsibility, fail-fast principle, easier testing

  

---

  

## SQL & ORMs

  

### Array Parameters in Raw SQL

**Problem**: Language arrays don't automatically convert to SQL array literals.

  

**Pattern**: When using raw SQL with array parameters:

- Know your database's array syntax (PostgreSQL: `ARRAY['a','b']`, MySQL: `('a','b')`)

- Use ORM escape functions or explicit formatting

- Test with multiple values and empty arrays

  

### NULL Handling in Comparisons

**Principle**: NULL propagates through comparisons and functions.

  

**Pattern**: When comparing nullable columns:

- Wrap comparisons in `COALESCE(value, fallback)` to provide defaults

- Use `GREATEST/LEAST` for multi-column comparisons, then `COALESCE` for NULL safety

- Example: `COALESCE(GREATEST(col1, col2), col1, NOW())`

  

### CTEs for Consistency

**Use Case**: Need same calculated value across multiple columns/rows.

  

**Pattern**: Calculate once in CTE, reference multiple times:

- ❌ `SELECT random(), random()` → different values

- ✅ `WITH calc AS (SELECT random() AS val) SELECT val, val FROM calc` → same value

  

**Why**: Data consistency, single source of truth, easier to reason about

  

---

  

## Integration Testing

  

### Complete Test Data

**Principle**: Test data must exactly mirror production data structure.

  

**Common Pitfall**: Missing "optional" fields that database queries actually filter on:

- Status fields, boolean flags, timestamps

- Result: Queries return 0 rows, tests mysteriously fail

  

**Fix**: Use factories or fixtures that include ALL fields with realistic defaults

  

### Mock Isolation & Cleanup

**Principle**: Mocks from one test shouldn't affect others.

  

**Pattern**:

```javascript

afterEach(() => {

vi.restoreAllMocks(); // Clear all mocks

// Re-establish critical test setup (auth, guards, etc.)

});

```

  

**When**: Shared test instances (app servers, DB connections, singletons)

  

### Mock Timing

**Principle**: Mock before the code path that uses it.

  

- ✅ Mock → Insert test data → Call endpoint → Assert

- ❌ Insert test data → Call endpoint → Mock (too late)

  

**Why**: Execution order matters; mocks must exist when code runs

  

### Mock Reliability

**Pattern**: Choose mock strategy based on call patterns:

- `mockResolvedValue()` → method called multiple times or call count unknown

- `mockResolvedValueOnce()` → method called exactly once, need different values per call

- `mockImplementation()` → complex logic, access to arguments

  

**Gotcha**: Instance mismatch (spy on wrong instance) makes mocks silently fail

  

---

  

## When to Use Raw SQL in ORMs

  

**Use Raw SQL When**:

1. Database-specific functions (date arithmetic, JSON operations, full-text search)

2. Complex CTEs or window functions not supported by ORM

3. Performance-critical bulk operations (batch updates, pagination)

  

**Use ORM When**:

- CRUD operations

- Simple queries with type safety needed

- Portability matters

  

**Trade-off**: Raw SQL = power + performance - safety - portability

  

---

  

## Error Handling Layers

  

### Separate Technical from Domain Errors

**Pattern**:

4. **Repository/Adapter**: Throws technical errors (DB error, network timeout)

5. **Service**: Catches technical errors, returns domain errors (Result<T, E>)

6. **Controller**: Converts domain errors to HTTP responses

  

**Why**: Business logic doesn't care about `ECONNREFUSED` or `SQLSTATE 23505`

  

**Example**:

- Repository: `throw new DatabaseError("Connection failed")`

- Service: `catch (e) => return err(DomainError.UNAVAILABLE)`

- Controller: `if (result.isErr()) return res.status(503)`

  

---

  

## Debugging Failing Tests

  

### Systematic Approach

7. **Verify setup**: Does test data actually exist? Add debug queries before assertions

8. **Check execution**: Are mocks being called? Use spy verification

9. **Inspect output**: What was actually generated? Log SQL queries, API calls, state

10. **Compare working code**: How do passing similar tests do it?

11. **Question assumptions**: Is the mock the problem, or the query?

  

**Principle**: Look at actual behavior (logs, queries, DB state), not just test code

  

---

  

## CSS Specificity

  

### Overriding Third-Party Frameworks

**Problem**: Framework styles applied via multiple layers (variables, properties, !important).

  

**Pattern**: To override framework disabled states:

12. Override CSS custom properties (`--framework-btn-disabled-color`)

13. Override direct properties (`color`, `border-color`, `opacity`)

14. Use `!important` on both if framework uses it

15. Test in actual browser (disabled states have special rendering)

  

**When !important is OK**: Overriding third-party CSS you don't control

  

---

  

## UI Consistency

  

### Systematic State Coverage

**Principle**: Every interactive element has 6+ states to consider.

  

**States**: Normal, hover, focus, active, disabled, loading (spinner)

  

**Pattern**: Define base color, systematically derive state colors:

- Hover: -10% lightness

- Active: -20% lightness

- Disabled: 40% opacity or desaturated

- Focus: outline with same hue

  

**Common Miss**: Disabled state (often uses default gray instead of brand color)

  

### Explicit State Transitions

**Principle**: Users shouldn't have to guess what a button does.

  

**Pattern**:

- ❌ Vague: "Process items"

- ✅ Explicit: "Draft → Published"

- ✅ Show all transitions: "Draft → Published, Pending → Archived"

  

**Why**: Clarity reduces support requests, increases confidence

  

### Required Input UX

**Pattern**: For required fields without defaults:

- Remove default/placeholder values (forces conscious choice)

- Disable submit button until valid input provided

- Show validation state (empty vs invalid vs valid)

  

**Why**: Prevents accidental submissions, guides user to completion

  

---

  

## Documentation

  

### Preserve the Problem-Solving Journey

**What to Document**:

- ✅ Root cause analysis ("Array formatting in SQL")

- ✅ Failed attempts ("Tried mockImplementation, didn't work because...")

- ✅ Solution rationale ("Used ARRAY syntax because...")

- ❌ Just the final code ("Changed line 42")

  

**Why**: Future debuggers need to understand WHY, not just WHAT changed

  

### Separate Specs from Learnings

**Pattern**:

- **Specs**: Project-specific (what was built, files changed, commits)

- **Learnings**: Transferable (patterns, principles, gotchas)

  

**Format**: Crisp bullets, no implementation details, focus on principles

  

---

  

## Error Codes & Messages

  

### Accurate Error Naming

**Principle**: Error codes should reflect what actually happened, not what you assumed.

  

**Pattern**:

- ❌ `DATABASE_ERROR` for any operation failure → misleading when customer service fails

- ✅ `REFRESH_OPERATION_FAILED` for operation failures → accurate for all failure types

- Name errors by **scope**, not by **implementation detail**

  

### Message Accuracy with Validation Layers

**Principle**: Error messages should only describe what the error handler is checking, not what upstream validation already handled.

  

**Pattern**:

```

// With class-validator at controller:

@IsInt() @Min(1) forwardDays

  

// Error message should NOT say:

"The provided forwardDays value is invalid or would exceed..."

  

// Error message SHOULD say:

"Shifting timestamps would exceed the current date."

```

  

**Why**: Class-validator already validates the value. Service-level errors should only describe business rule violations.

  

---

  

## Test Coverage Validation

  

### If Tests Don't Break, You Have No Coverage

**Principle**: If changing code doesn't fail any tests, that code path has no test coverage.

  

**Pattern**: After writing error handling code:

16. Write test that asserts on the error

17. Temporarily break the code (wrong error code)

18. Verify test fails with clear message

19. Fix code back

20. Verify test passes

  

**Example**:

```javascript

// Added error handling:

catch (error) {

return err('REFRESH_OPERATION_FAILED');

}

  

// No test broke → NO COVERAGE

// Add test:

it('returns error when service fails', async () => {

service.mock.mockRejectedValue(new Error());

expect(result.error.code).toBe('REFRESH_OPERATION_FAILED');

});

  

// Change to wrong code:

return err('DATABASE_ERROR');

// Test fails ✅ → Coverage confirmed

  

// Fix back:

return err('REFRESH_OPERATION_FAILED');

// Test passes ✅ → Coverage working

```

  

**Why**: Tests are only valuable if they catch regressions. No failure = no protection.

  

---

  

## TypeScript

  

### Minimal Type Annotations

**Principle**: When fixing implicit `any` errors, type only what's actually used.

  

**Pattern**:

```typescript

// ❌ Over-specified (types unused fields)

function update(obj: { id: number; name: string; email: string }) {

db.update(obj.id); // only uses id

}

  

// ✅ Minimal (types only what's used)

function update(obj: { id: number }) {

db.update(obj.id);

}

```

  

**Why**:

- Looser coupling → easier refactoring

- Less maintenance burden

- Clearer intent (what actually matters)

- Accepts any object with required fields

  

**When**: Parameter only accesses specific properties, not the full object

  

---

  

## Architecture Principles

  

### Logic Layering

**Principle**: Keep business logic out of database layer.

  

**Pattern**:

- ❌ SQL calculations (date arithmetic, random offsets, CTEs with logic)

- ✅ Database: Simple CRUD (SELECT, INSERT, UPDATE with given values)

- ✅ Service: All calculations, validations, business rules

- ✅ Extract complex logic into pure utility functions

  

**Why**:

- Testability → mock data access, test logic separately, pure functions tested in isolation

- Portability → easier to change database or ORM

- Maintainability → logic in one language (not split between JS and SQL)

- Debuggability → step through calculations, not reverse-engineer SQL

- Reusability → pure functions can be used in multiple services

  

**When SQL logic is OK**: Database-specific features (full-text search, JSON operations) that have no JS equivalent

  

### Pure Function Extraction

**Principle**: Extract calculation logic into pure, testable utility functions.

  

**Pattern**:

- ❌ Logic embedded in service (date arithmetic, validation mixed with orchestration)

- ✅ Logic extracted to pure functions (calculations, validations)

- ✅ Service remains thin orchestration layer (fetch → calculate → validate → save)

  

**Benefits**:

- Each utility function has single responsibility

- Test edge cases without database or async operations

- Logic reusable across services

- Service code cleaner and more readable

  

**When to Extract**: Complex calculations, date arithmetic, validation logic, transformations

  

### Repository Should Only Do Data Access

**Principle**: Repository returns full entities. Service extracts what it needs.

  

**Pattern**:

- ❌ Repository selects specific fields, converts types, applies logic

- ✅ Repository: `SELECT * ... WHERE` → returns full entity

- ✅ Service: extracts fields, converts `string → Date`, applies business rules

  

**Why**: Single responsibility — repository owns data access, service owns data interpretation

  

### Dead Code Removal

**Principle**: When refactoring replaces old code paths, remove both the dead code AND its tests.

  

**Pattern**:

- Old function replaced by new approach → delete old function + its test file

- Check with grep/search that nothing imports the dead code

- Removing dead tests is not losing coverage — it's removing misleading coverage

  

### Use Map for Repeated Lookups

**Principle**: When looking up items by ID inside a loop, use a Map instead of `.find()`.

  

**Pattern**:

- ❌ `items.find(i => i.id === targetId)` inside `.map()` → O(n*m)

- ✅ `const itemsById = new Map(items.map(i => [i.id, i]))` then `itemsById.get(targetId)` → O(n+m)

  

### Result Pattern Over Throw/Catch for Known Errors

**Principle**: Use `Result<T, E>` return values instead of throw/catch for expected error cases.

  

**Pattern**:

- ❌ Throw known error in inner method → catch in outer method → convert to Result

- ✅ Return `err()` directly from inner method → propagate Result up the chain

- Reserve throw/catch for truly unexpected errors (crashes, network failures)

  

**Why**: Explicit control flow, no hidden jumps, compiler enforces handling, easier to test

  

### Error Handling at Boundaries, Not at Every Layer

**Principle**: Catch errors at the outermost boundary, not at every intermediate layer.

  

**Pattern**:

- ❌ Try/catch in inner method → log → return error → outer method also catches

- ✅ Inner methods let errors bubble up naturally

- ✅ Single try/catch at the public entry point handles all unexpected errors

  

**Why**: Avoids redundant error handling, keeps inner methods simple, one place to log and convert errors

  

### Combine Related Computations in a Single Pass

**Principle**: When two outputs depend on the same input data, compute them together instead of making separate passes.

  

**Pattern**:

- ❌ Compute A from inputs → build lookup map → compute B using map of A

- ✅ Single iteration computes both A and B together

  

**Why**: Eliminates intermediate data structures (Maps), reduces iteration count, keeps related logic co-located

  

### Atomicity for Related Writes

**Principle**: When multiple database writes must succeed or fail together, wrap them in a single transaction.

  

**Pattern**:

- ❌ Separate transactions for each entity type (reviews, then replies)

- ✅ Single transaction for all related writes

- ✅ Combined repository method that accepts all update data

  

**Why**: Prevents partial updates, ensures data consistency, simpler error handling (one failure rolls back everything)

  

### Variable Names Should Carry Context

**Principle**: Variable names should be specific enough to distinguish similar concepts.

  

**Pattern**:

- ❌ Generic: `result`, `updates`, `data`

- ✅ Contextual: `shiftReviewsResult`, `replyShiftUpdates`, `customerConfig`

  

**Why**: Reduces ambiguity when multiple similar concepts coexist in the same scope

  

---

  

## Development Workflow

  

### Pre-Commit Verification

**Principle**: Always verify builds and tests pass locally before committing.

  

**Required Checks**:

21. Build - full monorepo or affected packages

22. Tests - all affected packages

23. TypeScript - type check without emit

24. Lint - style and quality checks

  

**Why**:

- Catches issues before CI (faster feedback)

- Prevents broken builds in pipeline

- Avoids additional fix commits

- Respects team's time

  

**When to Check**:

- After refactoring (logic changes, file moves)

- After TypeScript type changes

- Before every commit (not just push)

- After resolving merge conflicts

  

**Pattern**: Build → Test → TypeCheck → Lint → Commit

  

---

  

## Meta-Learning

  

### Always Ask "Why?"

Every fix has a deeper lesson:

- "Fixed the query" → Why did it break? (Array formatting)

- "Added !important" → When is that justified? (Framework overrides)

- "Moved mock earlier" → What's the general principle? (Timing matters)

- "Changed error code" → What does this code really represent? (Scope not implementation)

  

### Learn from Failed Approaches

Document what didn't work and why:

- Attempts show the problem space

- Failures teach edge cases

- Multiple attempts → pattern recognition for similar issues

  

### Validate Your Validations

**New Rule**: After adding error handling or validation:

25. Write a test that uses it

26. Break it intentionally

27. Confirm test fails

28. Fix it back

29. Only then is it "done"

  

**Why**: Untested error handling is unvalidated assumptions. The test is the proof.

---

# Learning Log

  

Generic learnings and patterns discovered during development. These principles apply beyond this specific codebase.

  

---

  

## 2026-04-09: Handling Duplicate Data in Batch Processing

  

### Context

When processing data with duplicate entries, batch operations can fail due to constraint violations, even when conflict resolution clauses exist.

  

### Key Learnings

  

#### 1. Batch Insert Constraint Violations

  

**Problem**: Database conflict resolution (e.g., `ON CONFLICT DO UPDATE`) handles conflicts with **existing table rows**, not duplicates **within the same batch**.

  

**Why**: Database validates uniqueness constraints across the entire batch before applying conflict resolution. If duplicates exist in the batch itself, the operation fails immediately.

  

**Takeaway**: **Deduplication must happen before insertion**, not rely on database constraints.

  

---

  

#### 2. Defensive vs Smart Deduplication

  

**Defensive** (Just Prevent Crashes):

- Removes duplicates arbitrarily (first seen, random order)

- Prevents immediate failures

- May keep stale data and filter fresh data

- "Any duplicate will do" approach

  

**Smart** (Choose Correct Record):

- Uses business logic to select which duplicate to keep

- Considers metadata (timestamps, versions, status)

- Ensures data quality, not just crash prevention

- "Keep the best duplicate" approach

  

**Key Insight**: Don't just prevent crashes—ensure data correctness.

  

---

  

#### 3. Filter at the Source vs Destination

  

**Anti-Pattern** (Filter Late):

```

Query → Transfer duplicates → Filter in memory → Waste resources

```

  

**Better** (Filter Early):

```

Query with filtering → Transfer only needed → Process valid records

```

  

**Principle**: Push work to the layer best equipped to handle it. Databases are optimized for filtering and aggregation.

  

---

  

#### 4. Three-Layer Defense Strategy

  

When dealing with data quality issues, implement multiple safety layers:

  

**Layer 1** - Query Level:

- Primary filtering/deduplication

- Most efficient (database-optimized)

- Reduces data transfer

  

**Layer 2** - Service Level:

- Domain-specific edge cases

- Handles combinations from multiple sources

- Adds business context to logging

  

**Layer 3** - Repository Level:

- Final safety net (database constraints)

- Catches unexpected cases

- Logs anomalies for monitoring

  

**Key Insight**: Defense in depth, but **primary work happens at most appropriate layer**. Don't duplicate effort across all layers.

  

---

  

#### 5. Logging Filtered Data

  

When filtering/deduplicating, make it observable:

  

**What to Log**:

- Count of filtered items

- Which items were filtered (identifiers)

- Why they were filtered (decision criteria)

- Context (customer, process, timestamp)

  

**Why**:

- Visibility into data quality issues

- Track if problem is growing/shrinking

- Evidence for root cause analysis

- Alerts when manual intervention needed

  

**Pattern**: Separate detection from logging. Even if main query filters data, run a separate lightweight query to detect and log what was filtered.

  

---

  

#### 6. Self-Healing Systems

  

**Concept**: System automatically corrects data quality issues during normal operation, not just avoids crashes.

  

**Bad** (Defensive Only):

- Filters duplicates at insertion

- Filtered items never processed

- Problem persists indefinitely

  

**Good** (Self-Healing):

- Detects duplicates at query time

- Chooses correct record automatically

- Processes valid data

- System continues despite bad state

  

**Lesson**: Design defensive code to **improve data quality**, not just avoid failures.

  

---

  

#### 7. Asynchronous Processing with State Transitions

  

**Pattern**: Use state placeholders for expensive async work.

  

**Example Flow**:

```

Phase 1 (Fast): Insert record → Set status = 'PENDING'

Phase 2 (Slow): Query WHERE status = 'PENDING' → Process → Update status = 'COMPLETED'

```

  

**Benefits**:

- Decouples fast operations from slow ones

- Clear state machine for tracking

- Query filters completed work automatically

- Retry-friendly (failures don't require re-sync)

- Natural job boundaries

  

**Applies To**: Any expensive async operation (API calls, ML inference, file processing, etc.)

  

---

  

#### 8. Simplicity Over Cleverness

  

**Journey**: Complex timestamp logic → Simplified "first wins" → SQL deduplication → Back to simple application-level

  

**Why Go Back**: Team familiarity, maintainability, debuggability > raw performance

  

**Decision Factors**:

- Team familiarity with pattern

- Type safety and tooling support

- Ease of debugging

- Code maintainability

- **Team > Individual optimization**

  

**Lesson**: The "optimal" solution depends on team and context, not just technical performance.

  

---

  

#### 9. Composition Over Complexity

  

**Problem**: Build generic utilities that handle complex logic, OR keep utilities simple and compose them?

  

**Answer**: **Keep utilities simple, add intelligence through composition**.

  

**Example**: Deduplication utility

- **Bad**: Utility accepts sort criteria, filtering rules, logging callbacks (complex)

- **Good**: Utility just deduplicates, caller handles sorting and logging (simple)

  

**Pattern**:

```

1. Sort data by desired criteria (newest first, highest priority, etc.)

2. Pass sorted data to generic deduplication utility

3. First occurrence = "best" record automatically

4. Log using grouping info from utility

```

  

**Benefits**:

- Utility stays generic and reusable

- Domain-specific logic lives in caller (where context exists)

- Clean separation of concerns

- Easy to test both independently

  

**Lesson**: **Utility = generic algorithm, Caller = domain intelligence**

  

---

  

#### 10. Enhanced Observability Through Data Structures

  

**Problem**: Logging flat lists of filtered items doesn't show relationships.

  

**Bad**:

```

Filtered items: [A, B, C, D]

// Can't tell which items are duplicates of each other

```

  

**Good**:

```

Duplicates:

Key "X": kept A, filtered [B, C] (3 total)

Key "Y": kept D, filtered [E] (2 total)

```

  

**Pattern**: Return grouped structures from utilities, not just flat lists.

  

**Benefits**:

- See which items are duplicates of each other

- Verify correct item was kept

- Spot patterns in bad data

- Easier debugging

  

**Implementation**: Use Map/Dictionary to group items by key, return alongside deduplicated list.

  

**Lesson**: Better data structures enable better observability without complex logic.

  

---

  

#### 11. Service-Layer Deduplication Pattern

  

**Where to Put Deduplication Logic**:

  

**Not in Repository** (Data Access Layer):

- Should be thin, focused on data operations

- Deduplication is business logic, not data access

- Mixing concerns makes testing harder

  

**Not in Utility** (With Complex Business Logic):

- Utility should be generic and reusable

- Business rules (what's "best") belong in domain layer

  

**In Service** (Business Logic Layer):

- Processes and transforms data

- Has domain context to decide what's "correct"

- Can log with business terminology

- Easier to test than repository layer

  

**Pattern**:

```

Service:

1. Fetch data from repository (may include duplicates)

2. Apply business logic (sort by timestamp, priority, etc.)

3. Deduplicate using generic utility

4. Log filtered items with domain context

5. Continue processing with clean data

  

Repository:

- Simple data queries

- Database constraints as final safety net

- No business logic

  

Utility:

- Generic deduplication algorithm

- No domain knowledge

- Reusable across services

```

  

---

  

## Principles for Handling Data Quality Issues

  

6. **Fail Safe, Not Silent**: When detecting bad data, log it clearly

7. **Choose Wisely**: Use business logic to pick the correct record

8. **Filter Early**: Remove invalid data at earliest layer

9. **Layer Defense**: Multiple validation layers prevent cascading failures

10. **Make Observable**: Log what you filter and why

11. **Self-Heal**: Design systems to improve data quality, not just avoid crashes

12. **Team > Individual**: Simple solution team understands > clever solution that confuses

13. **Compose, Don't Complicate**: Generic utilities + domain logic > complex utilities

  

---

  

## Questions to Ask When Deduplicating

  

14. What makes a record "the right one"? (timestamp, version, status?)

15. Should I filter at query, service, or repository layer?

16. What happens to filtered records? (lost forever, reprocessed later?)

17. How do I make this observable? (logging, metrics, alerts?)

18. Is this self-healing or just defensive?

19. What's the root cause, and when will we fix it permanently?

20. Can my team understand and maintain this solution?

  

---

  

*This document captures patterns and principles, not implementation details. These learnings apply to any codebase dealing with duplicate data, batch processing, or data quality issues.*


---

At a high level, **`ORDER BY`** and **`SORT BY`** both deal with arranging data, but they belong to _different contexts_ and have different guarantees.

---

## 🔹 `ORDER BY` (SQL – global ordering)

Used in standard SQL (e.g., PostgreSQL, MySQL, etc.).

### Key characteristics:

- **Globally sorts the entire result set**
    
- Guarantees **fully ordered output**
    
- Can be **expensive** (requires full shuffle/sort in distributed systems)
    

### Example:

```sql
SELECT * 
FROM reviews
ORDER BY rating DESC;
```

👉 This ensures _all rows_ are strictly sorted by `rating` across the dataset.

---

## 🔹 `SORT BY` (Distributed systems – partial ordering)

Used in systems like **Apache Spark SQL / Hive**.

### Key characteristics:

- Sorts **within each partition only**
    
- **No global ordering guarantee**
    
- More **performant** than `ORDER BY` in large-scale distributed data
    

### Example:

```sql
SELECT * 
FROM reviews
SORT BY rating DESC;
```

👉 Each partition is sorted internally, but across partitions:

- Order may look inconsistent
    
- Final dataset is **not globally sorted**
    

---

## 🔥 Core Difference

|Aspect|ORDER BY|SORT BY|
|---|---|---|
|Scope|Global|Per-partition|
|Guarantee|Fully sorted|Partially sorted|
|Performance|Slower (heavy shuffle)|Faster (local sort)|
|Use case|Final output, reporting|Intermediate processing|

---

## 🧠 When to use what

- Use **`ORDER BY`** when:
    
    - You need **strict ordering** (UI display, reports, pagination)
        
    - Small to medium datasets
        
- Use **`SORT BY`** when:
    
    - You're in **Spark/Hive pipelines**
        
    - You want **performance over strict ordering**
        
    - Sorting is just a **step before further processing**
        

---

## ⚠️ Gotcha (important)

In Spark:

- `ORDER BY` → triggers **single partition output** (global sort)
    
- `SORT BY` → keeps data **distributed**
    

---

If you're working in a specific system (Spark, Hive, Postgres, etc.), I can tailor this with execution plans / performance implications.

---



# GitHub Actions Time-Based PR Merge Control - Complete Learnings

  

## Executive Summary

  

**Problem**: Prevent accidental production merges during Boston business hours (9 AM - 6 PM ET, Mon-Fri) in healthcare application.

  

**Solution**: Comment-based approval system where team members type exact phrase to confirm intentional merge during work hours.

  

**Key Innovation**: Optimized from naive implementation to production-grade through:

- Webhook payload usage (eliminated unnecessary API calls)

- Label event filtering (reduced CI waste by 90%)

- Proper step ordering (UX feedback before failure)

- Minimal permissions (only what's actually needed)

  

**Result**: Zero-permission-bloat, fast, resource-efficient, compliance-ready workflow.

  

---

  

## Problem Context

Block PR merges to production during business hours without explicit human confirmation to prevent accidental production changes.

  

**Requirements:**

- Time-aware (Boston timezone, 9 AM - 6 PM, Mon-Fri)

- Human confirmation required

- Audit trail of approvals

- Self-service (not admin-only)

- Flexible (PR creator or team can approve)

  

---

  

## Approach Evaluation

  

### 1. GitHub Environments + Required Reviewers

  

**What it is**: Native GitHub feature for deployment approval gates.

  

**Pros**:

- ✅ Built into GitHub

- ✅ Clear audit trail

- ✅ No custom code

  

**Cons**:

- ❌ Only works for **deployments**, not PR merges

- ❌ Still allows PR merge, just blocks deploy step

- ❌ Doesn't solve blocking merge itself

  

**Learning**: GitHub Environments are for deployment gates in workflow jobs, not for blocking PR merge button. Wrong tool for this requirement.

  

---

  

### 2. Time-Based Auto-Block (No Override)

  

**What it does**: Workflow checks current time and fails during business hours.

  

**Pros**:

- ✅ Simple implementation

- ✅ Fully automated

- ✅ No human interaction needed

  

**Cons**:

- ❌ No override mechanism for urgent fixes

- ❌ Too rigid for production scenarios

- ❌ Doesn't capture human confirmation

  

**Learning**: Pure time-based blocks are too inflexible for real-world production. Always need escape hatch for critical issues.

  

---

  

### 3. Label-Based Approval

  

**How it works**:

1. PR opened during work hours → Status check fails

2. Add `merge-approved` label → Triggers `labeled` event

3. Status check re-runs → Checks if label exists → Passes

  

**Key Mechanism**:

- Use `labeled`/`unlabeled` in PR trigger types

- Fetch labels via `issues.listLabelsOnIssue()` API

- Check if specific label exists in returned array

  

**Pros**:

- ✅ Native GitHub UX (labels are standard)

- ✅ Clear visual indicator on PR

- ✅ Self-service for authorized users

- ✅ Audit trail (GitHub tracks who added label, when)

- ✅ Can restrict who can add label via permissions

- ✅ **Auto re-triggers check** when label added (unlike comments)

  

**Cons**:

- ❌ Less explicit (just clicking a label)

- ❌ Doesn't capture intent in words

- ❌ Can be added accidentally

- ❌ Requires label creation (one-time setup)

  

**Learning**: Labels provide good visual state AND auto-trigger status re-runs (via `labeled` event). However, lack explicit confirmation. Good for simple workflows, not for requiring deliberate intent.

  

---

  

### 4. Comment-Based Approval ✅ CHOSEN

  

**How it works**:

4. PR opened during work hours → Status check fails

5. Team member comments exact phrase: "I agree to push this changes in working hours"

6. Workflow verifies authorization → Status check passes

  

**Pros**:

- ✅ **Explicit intent** - Must type full phrase

- ✅ **Audit trail** - GitHub records approver, timestamp, exact comment

- ✅ **Authorization check** - Verifies write access programmatically

- ✅ **Visible** - Approval in PR conversation

- ✅ **Flexible** - PR creator OR any team member can approve

- ✅ **Self-service** - No bottleneck on specific approvers

  

**Cons**:

- ❌ Requires exact phrase match (typos break it)

- ❌ Status check doesn't auto re-run after comment

- ❌ More complex workflow logic

  

**Why chosen**: Healthcare context requires **explicit, auditable confirmation**. Typing full phrase ensures deliberate decision, not accidental click.

  

---

  

## Technical Learnings

  

### 1. Timezone Handling in GitHub Actions

  

**Challenge**: GitHub Actions runners use UTC by default.

  

**Solution**: Use `TZ` environment variable with bash `date` command for timezone conversion.

  

**Learning**: Don't rely on runner's system timezone. Always explicitly set timezone for business-hours checks.

  

---

  

### 2. Branch-Specific Workflow Triggers

  

**Challenge**: Apply controls only to specific branch (e.g., production).

  

**Solution**: Use `branches` filter in workflow trigger.

  

**Learning**: Scope workflows to specific branches. Prevents unnecessary runs and keeps controls targeted where needed.

  

---

  

### 3. Checking PR Labels

  

**Challenge**: Check if specific label exists on PR.

  

**API**: `issues.listLabelsOnIssue()` - returns array of all labels

  

**Learning**: PRs are treated as issues in GitHub API. Use issues endpoints for labels and comments.

  

---

  

### 4. Searching PR Comments

  

**Challenge**: Check if approval comment exists.

  

**API**: `issues.listComments()` - returns all comments on PR

  

**Learning**: Search through comments array for exact phrase matching. Case-sensitive by default.

  

---

  

### 5. Authorization Verification

  

**Challenge**: Verify commenter has permission to approve.

  

**API**: `repos.getCollaboratorPermissionLevel()` - returns permission level

  

**Permission Levels**: `admin`, `maintain`, `write`, `read`, `none`

  

**Learning**: Programmatically verify authorization to prevent unauthorized approvals. Don't trust comment alone.

  

---

  

### 6. UX Feedback with Emoji Reactions

  

**Challenge**: Provide immediate visual feedback.

  

**API**: `reactions.createForIssueComment()` with content like `+1`, `confused`, `heart`

  

**Learning**: Emoji reactions provide instant feedback without cluttering conversation. Good for approval/rejection signals.

  

---

  

### 7. Filtering PR vs Issue Comments

  

**Challenge**: `issue_comment` event fires for both issues and PRs.

  

**Solution**: Check `github.event.issue.pull_request` field (null for issues, has data for PRs)

  

**Learning**: Always filter when using `issue_comment` event to avoid running on wrong entity type.

  

---

  

### 8. Getting PR Target Branch from Comment Event

  

**Challenge**: Comment event doesn't include full PR details.

  

**API**: Must fetch PR separately using `pulls.get()` to access `base.ref` and `head.ref`

  

**Learning**: Comment payload is minimal. Need additional API call for PR metadata like target branch.

  

---

  

### 9. Status Check Re-run Problem

  

**Key Difference**:

  

| Approach | Auto Re-run? | Reason |

|----------|--------------|---------|

| **Label-based** | ✅ YES | `labeled` event triggers PR workflow |

| **Comment-based** | ❌ NO | `issue_comment` doesn't re-trigger PR checks |

  

**Workarounds for Comment-Based**:

- Empty commit (most common)

- Label manipulation

- Close/reopen PR

  

**Learning**: This is a significant UX advantage for label-based. `labeled`/`unlabeled` events DO trigger PR workflows, but `issue_comment` does NOT.

  

---

  

### 10. Multiple Coordinated Workflows

  

**Pattern**: Split concerns across workflows with different triggers.

  

**Example**:

- Workflow A (on `pull_request`): Status check that blocks/allows

- Workflow B (on `issue_comment`): Handles approval and provides feedback

  

**Learning**: Separate workflows by responsibility and trigger type. Better maintainability and clearer purpose.

  

---

  

### 11. Exact String Matching for Safety

  

**Challenge**: Prevent accidental approvals.

  

**Anti-pattern**: Using keywords like "agree" (matches "disagree")

  

**Best practice**: Require exact phrase like "I agree to push this changes in working hours"

  

**Learning**: Exact phrase matching ensures deliberate, intentional approval. Not accidental click or partial comment.

  

---

  

### 12. GitHub Audit Trail

  

**Automatically Recorded**:

- Username of actor

- Exact timestamp (UTC)

- Comment/label content

- Event history

  

**NOT Recorded**:

- Historical permission levels (API returns current state only)

  

**Learning**: Native GitHub features provide built-in audit trail. Perfect for compliance requirements without custom logging.

  

---

  

### 13. GitHub Actions Permissions (Least-Privilege)

  

**Challenge**: Knowing which permissions are truly needed.

  

**Key Rules**:

- PRs are issues in GitHub API

- BUT: `pull_request` events include labels in webhook payload

- No need for `issues: read` if using `context.payload.pull_request.labels`

  

**Permission Types**:

- `contents: read` - Read repository files

- `issues: read` - Read issues/labels (only if making API calls)

- `pull-requests: write` - Comment on PRs, update status

- `issues: write` - Create/edit issues, add labels

  

**Best Practice**:

7. Check webhook payload first

8. Only add permissions for actual API calls

9. Explicitly declare minimum required permissions

  

**Learning**: Webhook payload optimization can eliminate permission requirements. Always check `context.payload` before adding permissions.

  

---

  

### 14. Workflow Step Execution Order

  

**Challenge**: Failed step stops workflow, subsequent steps don't run.

  

**Problem Pattern**:

- Check condition

- Fail (exit 1) ← Workflow stops here

- Post comment ← Never runs

  

**Solution**: Post comments/feedback BEFORE failing:

- Check condition

- Post comment ← Runs first

- Fail (exit 1) ← Runs last

  

**Learning**: User-facing steps (comments, notifications) should run before `exit 1`. Otherwise users don't see guidance on how to fix the issue.

  

---

  

### 15. Filtering Label Events to Specific Labels

  

**Challenge**: Triggering on `labeled`/`unlabeled` runs workflow for ANY label change.

  

**Problem**: Wasteful CI runs when unrelated labels (e.g., `bug`, `enhancement`) are added.

  

**Solution**: Add job-level condition to filter by specific label name.

  

**Impact**:

- Saves CI resources

- Reduces workflow noise

- Faster feedback (fewer queued runs)

  

**Learning**: When using `labeled`/`unlabeled` triggers, always filter by specific label name using `github.event.label.name` condition to avoid unnecessary workflow runs.

  

---

  

### 16. Using Webhook Payload vs API Calls

  

**Challenge**: Making API call to get data already in webhook payload.

  

**Problem**: `pull_request` events include labels in payload. Making `issues.listLabelsOnIssue()` API call is redundant.

  

**Comparison**:

  

| Approach | Speed | Rate Limits | Permissions Needed |

|----------|-------|-------------|-------------------|

| API call | Slower | Yes | `issues: read` |

| Webhook payload | Instant | No | None (already in context) |

  

**Benefits of Payload**:

- No API call = faster execution

- No rate limit risk

- Fewer permissions needed

- Simpler code

  

**Learning**: Always check webhook payload first before making API calls. Most PR data (labels, comments, files changed, etc.) is already included in the event payload. API calls should be last resort.

  

---

  

## Design Principles

  

### 1. Explicit Intent

Must type full phrase, not just click a button. Ensures deliberate, informed decision.

  

### 2. Fail-Safe

Default to blocking during work hours. Require active approval to proceed.

  

### 3. Authorization Built-In

Verify write access programmatically. Prevent unauthorized approvals.

  

### 4. Visibility

Approval happens in PR conversation. Clear to all stakeholders, not hidden in logs.

  

### 5. Self-Service

Any authorized team member can approve. No single point of failure or bottleneck.

  

### 6. Audit Trail

Leverage GitHub's native tracking. Who, when, what phrase was used.

  

---

  

## Common Pitfalls

  

| Pitfall | Why It Happens | Solution |

|---------|----------------|----------|

| **Wrong timezone** | GitHub runners use UTC | Use `TZ="America/New_York"` with `date` |

| **Loose string matching** | Using keywords instead of exact phrase | Use exact phrase: `comment.body.includes(exactPhrase)` |

| **Issue + PR confusion** | `issue_comment` fires for both | Filter: `github.event.issue.pull_request != null` |

| **Status not re-running (comment)** | Comment event doesn't trigger PR checks | Empty commit or label manipulation |

| **Missing `labeled` event** | Forgetting to include in triggers | Add `labeled, unlabeled` to PR triggers |

| **Missing target branch** | Comment event doesn't include PR details | Fetch PR: `github.rest.pulls.get()` |

| **Accidental approvals** | Click-based approvals (labels) | Require typed phrase for deliberate intent |

| **Authorization bypass** | Not checking permissions | Verify via `getCollaboratorPermissionLevel()` |

| **Missing `issues: read`** | Calling `issues.listLabelsOnIssue()` without permission | Use `context.payload.pull_request.labels` instead |

| **Comment after fail** | `exit 1` stops workflow before comment | Post comment BEFORE failure step |

| **Unfiltered label events** | `labeled`/`unlabeled` trigger on ANY label | Filter by specific label: `github.event.label.name == 'target-label'` |

| **Unnecessary API calls** | Making API calls for data in payload | Check `context.payload` first |

  

---

  

## Best Practices

  

✅ **Use timezone-aware date commands** for accurate time checks

✅ **Verify authorization** before accepting approvals

✅ **Provide immediate UX feedback** (emoji reactions + comments)

✅ **Filter workflows by target branch** (e.g., production only)

✅ **Separate concerns**: One workflow blocks, another unblocks

✅ **Use exact phrase matching** for approval (not fuzzy keywords)

✅ **Leverage native GitHub features** for audit trail

✅ **Use webhook payload over API calls** - check `context.payload` first

✅ **Filter label events by name** - avoid unnecessary runs

✅ **Post feedback before failing** - comments/notifications before `exit 1`

✅ **Test edge cases**: Different timezones, unauthorized users, typos

  

---

  

## Decision Rationale Summary

  

| Requirement | Label-Based | Comment-Based | Winner |

|-------------|-------------|---------------|--------|

| **Explicit confirmation** | Clicking label | Typing full phrase | 🏆 Comment |

| **Auto re-run check** | ✅ Yes (`labeled` event) | ❌ No (manual) | 🏆 Label |

| **Audit trail** | Who + when | Who + when + exact phrase | 🏆 Comment |

| **Authorization** | GitHub permissions | Programmatic API check | 🏆 Comment |

| **UX simplicity** | One click | Type + manual re-trigger | 🏆 Label |

| **Accidental approval prevention** | Easy to misclick | Must type exact phrase | 🏆 Comment |

| **Healthcare compliance** | Good | Explicit intent captured | 🏆 Comment |

  

**Overall**: Comment-based chosen for **explicit intent + audit trail** despite worse UX (manual re-trigger). Label-based is solid alternative for less-critical workflows.

  

---

  

## Real-World Use Cases

  

### Use Case 1: Changeset Check with Label Bypass

  

**Problem**: Require changeset files in PRs, but allow bypass for non-code changes.

  

**Pattern**: Check for file → If missing, check for bypass label → Fail if both missing

  

**Flow**:

10. PR opened → Check for changeset file

11. If missing → Check for `no-changeset-required` label

12. If BOTH missing → Fail + comment

13. If label added → Auto re-runs → Passes

  

**Why label-based**:

- Auto re-trigger when label added

- Clear visual indicator

- Easy to add/remove

- Good for optional requirements with escape hatch

  

**Learning**: Label bypass pattern works well for enforced-by-default checks that need occasional exceptions.

  

---

  

### Use Case 2: Production Merge Approval

  

```

Timeline: Tuesday, 10:45 AM ET

  

10:45 AM - Developer opens PR to production

├── Workflow detects Boston work hours

├── Searches comments for approval phrase (not found)

├── Status check FAILS

└── Bot comments with instructions

  

11:02 AM - Team Lead comments: "I agree to push this changes in working hours"

├── Approval workflow triggers

├── Verifies Team Lead has 'admin' role ✅

├── Reacts with 👍

└── Posts: "Merge approved by @team-lead"

  

11:03 AM - Developer pushes empty commit to re-trigger

└── Status check re-runs

  

11:03 AM - Merge Guard workflow

├── Detects work hours

├── Finds approval comment ✅

├── Status check PASSES

└── PR can be merged

  

11:05 AM - PR merged to production

```

  

---

  

## When to Use Each Approach

  

| Use Case | Recommended Approach |

|----------|---------------------|

| Simple approval, low stakes | Label-based |

| Deployment gates (not merge) | GitHub Environments |

| Explicit confirmation required | **Comment-based** ✅ |

| Regulated environments (healthcare, finance) | **Comment-based** ✅ |

| Just time blocking, no approval | Time-based auto-block |

| Multi-stage approvals | GitHub Environments + branch protection |

  

---

  

## Quick Reference

  

### Key APIs

  

| Need | API | Returns |

|------|-----|---------|

| **Check PR labels** | `issues.listLabelsOnIssue()` | Array of label objects |

| **Get PR comments** | `issues.listComments()` | Array of comment objects |

| **Get user permission** | `repos.getCollaboratorPermissionLevel()` | Permission level string |

| **React to comment** | `reactions.createForIssueComment()` | Reaction object |

| **Get PR details** | `pulls.get()` | Full PR object with base/head refs |

  

### Key Workflow Patterns

  

| Pattern | Trigger Types | When to Use |

|---------|--------------|-------------|

| **Label-based approval** | `[opened, labeled, unlabeled]` | Optional bypass, auto re-trigger needed |

| **Comment-based approval** | `pull_request` + `issue_comment` | Explicit intent required, regulated environments |

| **Time-based check** | `[opened, synchronize]` | Business hours restrictions |

| **Branch-specific** | Add `branches: [name]` | Apply controls to specific branch only |

  

### Key Learnings

  

✅ **Labels** → Auto re-trigger via `labeled` event

✅ **Comments** → Need manual re-trigger (empty commit)

✅ **PRs are Issues** → Use issues API for labels/comments

✅ **Timezone** → Always use `TZ` env var

✅ **Filter PRs** → Check `github.event.issue.pull_request != null`

✅ **Authorization** → Verify programmatically, don't trust alone

✅ **Webhook Payload** → Use `context.payload` instead of API calls

✅ **Filter Labels** → Check `github.event.label.name` for specific labels

✅ **Step Order** → Post comments before `exit 1`

  
  

---

  

## Implementation Evolution

  

### Initial Implementation

- Comment-based approval for production branch

- Required `issues: read` permission

- Ran on all label changes

- Failed before posting comments

  

### Optimization Phase 1 (Copilot Feedback)

**Issue**: Comment step never ran because workflow failed first

**Fix**: Reordered steps - post comment BEFORE exit 1

**Learning**: User-facing steps must precede failure

  

### Optimization Phase 2 (Copilot Feedback)

**Issue**: Missing `issues: read` permission for label API call

**Fix**: Added permission to workflow

**Learning**: Explicit permissions needed for API calls

  

### Optimization Phase 3 (Copilot Feedback)

**Issue**: Unnecessary API call for data in payload

**Fix**: Changed from `issues.listLabelsOnIssue()` to `context.payload.pull_request.labels`

**Result**: Removed `issues: read` permission, faster execution

  

### Optimization Phase 4 (Copilot Feedback)

**Issue**: Workflow runs on ALL label changes (wasteful)

**Fix**: Added job-level filter for specific label name

**Result**: Reduced unnecessary CI runs by ~90%

  

### Final State

- Optimized permissions (only what's needed)

- Efficient (no unnecessary API calls)

- Clean UX (comments before failure)

- Resource-efficient (filtered label events)

  

---

  

## References

  

- [GitHub Actions: Workflow triggers](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)

- [GitHub REST API: Issues/Comments](https://docs.github.com/en/rest/issues/comments)

- [GitHub REST API: Pull Requests](https://docs.github.com/en/rest/pulls/pulls)

- [GitHub REST API: Collaborators](https://docs.github.com/en/rest/collaborators/collaborators)

- [GitHub Actions: Contexts](https://docs.github.com/en/actions/learn-github-actions/contexts)

- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

  

---

  

## Evolution: Comment-Based → Label-Based (2026-04-14)

  

### Why We Migrated

  

After production use of comment-based approval, we identified these pain points:

  

14. **Manual re-trigger needed** - Required empty commit or manual action

15. **Hidden state** - Approval buried in comment thread

16. **Inconsistent with changeset pattern** - Already using labels for `no-changeset-required`

  

### New Label-Based Pattern

  

**Key Change**: Use `allow-deploy-in-working-hours` label instead of comment phrase.

  

| Aspect | Comment-Based | Label-Based |

|--------|---------------|-------------|

| Approval method | Type exact phrase | Add label |

| Re-trigger | Manual (empty commit) | Automatic ✅ |

| State visibility | Comments (hidden) | Label (visible) ✅ |

| Consistency | Event-driven | State-driven ✅ |

  

### Technical Improvements

  

17. **Webhook Payload Usage**

```yaml

# Uses payload directly, no API call

LABELS='${{ toJSON(github.event.pull_request.labels.*.name) }}'

HAS_OVERRIDE=$(echo "$LABELS" | jq 'any(. == "allow-deploy-in-working-hours")')

```

  

18. **Auto Re-trigger**

```yaml

on:

pull_request:

types: [opened, synchronize, labeled, unlabeled] # labeled triggers re-run

```

  

19. **No Extra Permissions**

- Comment-based: `issues: write`, `pull-requests: write`

- Label-based: No permissions needed (uses payload)

  

### Migration Path

  

New workflow: `.github/workflows/production-deploy-guard.yml`

  

Old workflows (can be deprecated):

- `.github/workflows/merge-guard.yml`

- `.github/workflows/merge-approval.yml`

  

**Note**: Both can coexist during transition period.

  

### Preserved Features

  

✅ Time-based blocking (9 AM - 6 PM ET)

✅ Authorization (write access required)

✅ Audit trail (GitHub tracks label history)

✅ Auto-comments (instructions + acknowledgment)

✅ Branch-specific (production only)

  

### Trade-offs

  

| Lost (from comment-based) | Gained (label-based) |

|---------------------------|---------------------|

| Explicit typed confirmation | Auto re-trigger ✅ |

| - | Visual state (label) ✅ |

| - | Consistency with changeset pattern ✅ |

  

**Decision**: Label-based better fits the codebase pattern of "state over events."

  

### Lessons Learned

  

20. **Start with payload** - Always check `context.payload` before adding API calls

21. **Consistency matters** - Use same pattern across workflows (labels for state)

22. **UX wins** - Auto re-trigger is huge UX improvement over manual empty commits

23. **State > Events** - Labels represent current state, easier to reason about than event history

  

---


# How Drizzle Migrations Actually Work — A Field Guide

> Related: [[Drizzle journal when timestamp]] · [[Postgres Migration]] · [[table required not set handling]]

*A generic walkthrough of Drizzle ORM's migration model: what the files are, how a
migration gets applied, how Drizzle knows what has already run, and the mental model
you need to avoid surprises. Postgres-flavoured, but the concepts carry to the other
dialects.*

---

## 1. The three things that make up a migration

When you run `drizzle-kit generate`, Drizzle produces (or updates) three kinds of artifacts:

```
apps/api/migrations/
├── 0093_some-change.sql          ← the actual SQL to run
├── meta/
│   ├── _journal.json             ← the ordered index of all migrations
│   └── 0093_snapshot.json        ← a full snapshot of the schema after this migration
```

| Artifact | What it is | Who reads it |
|----------|-----------|--------------|
| `NNNN_name.sql` | The raw SQL statements for one migration | The **runtime migrator** (when you deploy) |
| `meta/_journal.json` | An ordered list of every migration: its `idx`, `tag`, and `when` timestamp | Both `drizzle-kit` (at generate time) and the runtime migrator |
| `meta/NNNN_snapshot.json` | The complete schema state *after* this migration | `drizzle-kit` only, to compute the next diff |

The critical insight: **`drizzle-kit` (generate time) and the migrator (deploy time) are
two different programs that both trust the journal.** Generate writes it; the migrator
reads it. If the journal is wrong, the migrator does the wrong thing — quietly.

---

## 2. Generate time — how a new migration is born

```
your schema.ts  ─┐
                 ├─►  drizzle-kit diffs them  ─►  new 0093.sql + updated journal + new snapshot
latest snapshot ─┘
```

1. You edit your schema (TypeScript table definitions).
2. `drizzle-kit generate` loads the **most recent snapshot** (`meta/NNNN_snapshot.json`)
   and diffs it against your current schema.
3. The diff becomes a new `.sql` file.
4. Drizzle appends an entry to `_journal.json` and writes a new snapshot.

A journal entry looks like this:

```jsonc
{
  "idx": 93,                 // sequential position, 0-based
  "version": "7",            // journal format version
  "when": 1790087793075,     // millisecond timestamp, stamped at generate time
  "tag": "0093_some-change", // must match the .sql filename (without extension)
  "breakpoints": true
}
```

> **Key idea:** `when` is generated from the clock at the moment you run `generate`.
> It is *not* derived from `idx` or the filename. It is an independent value — and the
> runtime migrator leans on it heavily (next section).

---

## 3. Deploy time — how the migrator decides what to run

At deploy, your app (or a migrate script) calls Drizzle's `migrate()`. Here is the
algorithm, distilled from Drizzle's own source (`drizzle-orm/pg-core/dialect.js`):

```
1. Ensure a bookkeeping table exists:
      drizzle.__drizzle_migrations (id, hash, created_at)

2. Read the SINGLE most-recently-applied row:
      SELECT ... ORDER BY created_at DESC LIMIT 1
      → call its created_at value  lastRun   (null if the table is empty)

3. Walk the journal entries TOP TO BOTTOM. For each one:
      IF   lastRun is null   OR   lastRun < entry.when
      THEN run the .sql, then INSERT a row with created_at = entry.when
      ELSE skip it
```

That's the whole model. Three consequences fall out of it:

### 3a. `when` is the source of truth for "have I run this?"
Not the filename, not `idx`, not a hash of the SQL. The migrator asks a single question
per migration: *"is this migration's `when` greater than the newest `when` I've already
stored?"* If yes, run it. If no, skip it.

### 3b. `lastRun` is read ONCE, as a single high-water mark
The migrator does **not** check each migration individually against the applied set. It
reads *one* value — the maximum `created_at` already in the table — and compares every
journal entry against that same value. This is why ordering matters so much (next).

### 3c. A fresh database runs everything; an existing one only runs "newer" ones
On an empty DB, `lastRun` is null, so every migration runs. On a DB that's already at,
say, `when = 500`, only migrations with `when > 500` will run. This asymmetry is the
root of most "it worked locally but not on staging" migration bugs.

---

## 4. The mental model in one picture

Think of `when` timestamps as a **monotonically rising water line**. Each applied
migration raises the line to its own `when`. A new migration only runs if it pokes
*above* the current line.

```
when →   100   200   300   400   500        ← already applied, line is at 500
                                    ▲ lastRun
new migration with when = 600  →  runs ✅   (600 > 500, pokes above the line)
new migration with when = 450  →  SKIPPED ⛔ (450 < 500, sits below the line — invisible)
```

The dangerous case is the second one: a migration whose `when` is *below* the current
water line is **silently skipped**. No error. The migrator simply concludes it must be
old and moves on. The `.sql` never executes, and your schema quietly diverges from what
the code expects.

---

## 5. The invariant you must protect

> **In `_journal.json`, `when` timestamps must strictly increase from top to bottom,
> and the last (newest) entry must hold the largest value in the file.**

If any entry's `when` is smaller than an entry before it, that migration risks being
skipped on every database that already applied the earlier, larger-timestamped one —
i.e. long-lived environments like **staging and production**. Fresh databases (CI, a new
laptop) won't reveal the problem, because they run everything from an empty table.

### Where this invariant gets broken
- **Merge conflicts in `_journal.json`.** Two branches each add a migration; a hand-merge
  keeps a stale timestamp or reorders entries. This is by far the most common cause.
- **Manually editing the journal** to "fix" a number instead of regenerating.
- **Cherry-picking a migration** from one branch to another without regenerating.
- **Reordering migration files** by renaming without updating `when`.

### How to stay safe
1. **Don't hand-edit the journal to resolve conflicts.** Delete your generated migration,
   take the other side's journal, and re-run `drizzle-kit generate` so your change gets a
   fresh, larger `when`.
2. **Sanity-check after any conflict:** the last entry's `when` should be the biggest
   number in the file, and timestamps should only go up.
   ```bash
   jq '[.entries[].when]' apps/api/migrations/meta/_journal.json \
     | jq 'if . == sort then "✅ monotonic" else "⛔ OUT OF ORDER" end'
   ```
3. **Write idempotent SQL.** Guard `ALTER`/`CREATE`/`DROP` with existence checks
   (`IF NOT EXISTS`, `DO $$ ... END $$` blocks that inspect `information_schema`). If a
   migration is ever partially applied or re-run, idempotency keeps it from corrupting the
   environment. This limits blast radius even when ordering is correct.
4. **Automate the check.** A CI/pre-push guard (e.g. a Danger rule) that validates
   monotonic `when`, sequential `idx`, and journal↔`.sql` parity catches the mistake
   before it ever reaches a real database.

---

## 6. FAQ / gotchas

**Q: If `idx` is sequential, isn't ordering already guaranteed?**
No. The migrator walks entries in journal (array) order, but it *decides whether to run*
each one purely by comparing `when` against the high-water mark. `idx` affects iteration
order, not the run/skip decision. You can have perfect `idx` sequencing and still get a
skip if `when` is out of order.

**Q: What happens if I re-run the same migrations?**
Nothing, ideally. Each applied migration's `when` is stored; on the next run they're all
`<= lastRun`, so they're skipped. This is why the flow is safe to run on every deploy.

**Q: What does the `hash` column do?**
Drizzle stores a SHA-256 of each migration's SQL when it applies it. In this version it's
recorded for bookkeeping; the run/skip decision is driven by `created_at` (`when`), not
the hash. Don't rely on the hash to detect edits to already-applied migrations — editing
an applied `.sql` file won't re-run it.

**Q: Can I just bump the `when` to force a migration to run?**
Making it the new maximum will make the migrator *attempt* it — but if it already ran on
some environments and not others, you now have divergent state. Prefer regenerating +
idempotent SQL over manually poking timestamps.

**Q: Why not order by filename or `idx` in the DB instead of `when`?**
That's simply not how this migrator version is written — it orders the applied set by
`created_at`. Understanding the actual implementation (rather than the intuitive one) is
the whole point of this doc.

---

## 7. TL;DR

- A migration = a `.sql` file + a journal entry (`idx`, `tag`, `when`) + a snapshot.
- The migrator runs a migration **only if its `when` is greater than the newest `when`
  already applied** — read as a single high-water mark, once.
- Therefore `when` timestamps **must only increase** down the journal. An out-of-order
  `when` gets **silently skipped** on already-migrated databases (staging/prod) while
  looking fine on fresh ones.
- Protect the invariant: regenerate instead of hand-merging, write idempotent SQL, and
  automate a journal-integrity check in CI.

---

## References

- [[Drizzle journal when timestamp]] — a real incident where this invariant broke (PR #1704).
- [[Postgres Migration]] — Drizzle + NestJS + Postgres migration setup guide.
- [[table required not set handling]] — related Drizzle migration gotcha.
- Drizzle source: `drizzle-orm/pg-core/dialect.js`.

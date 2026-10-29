# ⚠️ Drizzle `_journal.json` `when` timestamps — how a merge conflict silently broke a migration

> Related: [[How Drizzle migrations work]] · [[Postgres Migration]] · [[table required not set handling]]

**TL;DR:** In `apps/api/migrations/meta/_journal.json`, the `when` timestamps **must only ever increase** from top to bottom. A merge conflict left migration `0093` with a `when` *smaller* than the migration before it — so Drizzle **silently skipped it** on staging/prod (but not on fresh DBs). Fixed in PR #1704.

---

## What `when` is

Every migration in `_journal.json` has a `when` — a millisecond timestamp (e.g. `1789724005182`) recorded when the file was generated. Drizzle copies it into the DB tracking table `drizzle.__drizzle_migrations` as the `created_at` column.

👉 **That number is how Drizzle decides "have I run this yet?"** — not the filename, not the `idx`.

## How Drizzle actually decides what to run

Straight from Drizzle's source (`drizzle-orm/pg-core/dialect.js`), paraphrased:

```
1. Ask the DB: "What's the newest created_at you've applied?"
      → select ... order by created_at desc limit 1
      → call it  lastRun

2. Walk the journal top-to-bottom. For each migration:
      run it  ONLY IF   lastRun < migration.when
```

The trap: `lastRun` is the **single highest** timestamp already applied, and it's read **once** up front. A new migration only runs if its `when` is **bigger than every timestamp already applied.**

## The bug we hit 🐛

Conflict resolution left migration `0093` with a `when` **smaller** than the one before it:

```
idx 92   when 1789724005182   ✅ already applied on staging/prod
idx 93   when 1789640770458   ⬅️ SMALLER than 92  (the bug)
```

Replay Drizzle's logic on a DB that already ran up to `0092`:

```
lastRun = 1789724005182          (from 0092, the newest applied)

0093 check:  1789724005182  <  1789640770458  ?
                  NO   →   0093 is SKIPPED. Forever.
```

`0093` **silently never runs.** No error, no crash — Drizzle thinks it's older than something already applied and moves on. The `reply_origin` column stays `varchar` instead of becoming `varchar[]`, and the app that now expects an array breaks at runtime.

> 💥 **The scary part:** a **fresh** database (CI, a new dev machine) works fine — with an empty table `lastRun` is null, so *everything* runs. The failure only shows up on environments that already ran the earlier migration — i.e. **staging and production.** Green locally, broken where it counts.

## The fix (PR #1704)

1. **Bumped `0093`'s `when`** to `1790087793075` so it's the newest again → Drizzle sees it as pending and runs it.
2. **Made the SQL idempotent** — wrapped the `ALTER COLUMN` in a `DO $$ ... END $$` guard that checks whether the column is already an array, so re-running is safe on any environment.

---

## 📌 The one rule for the team

**In `_journal.json`, `when` timestamps must only ever increase, top to bottom.**

- After resolving any merge conflict in `_journal.json` (or anything in `migrations/meta/`), check that the **last entry's `when` is the largest number in the file.**
- If it isn't, the migration will be **silently skipped** on already-migrated databases.
- **Safest path:** don't hand-merge the journal. Regenerate the migration with `pnpm run drizzle:generate` so it gets a fresh, larger timestamp automatically.
- Bonus: write migrations to be **idempotent** (guard `ALTER`/`CREATE` with existence checks) so a partial/re-run can't corrupt an environment.

---

## References

- [[How Drizzle migrations work]] — generic field guide to Drizzle's migration model (generate vs deploy, the `when` high-water mark).
- [[Postgres Migration]] — Drizzle + NestJS + Postgres migration setup guide.
- [[table required not set handling]] — related Drizzle migration gotcha.
- Fixed in PR #1704 (`reputation-management` repo).
- Drizzle source: `drizzle-orm/pg-core/dialect.js`.

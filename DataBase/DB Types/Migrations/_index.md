# Index — Migrations

Notes on database schema migrations (mostly Drizzle + Postgres).

## How it works
- [[How Drizzle migrations work]] — field guide: generate vs deploy, the `when` high-water mark, run/skip logic.

## Setup & how-to
- [[Postgres Migration]] — Drizzle + NestJS + Postgres migration setup, constraint-name gotchas.

## Gotchas & incidents
- [[Drizzle journal when timestamp]] — merge conflict in `_journal.json` silently skipped a migration (PR #1704).
- [[table required not set handling]] — handling a required column not set during migration.

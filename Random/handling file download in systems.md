
# Handling File Download / Export in Systems — Patterns

**Purpose:** learning reference. How to serve generated files (exports, reports, invoices,
bulk downloads) from a backend to a user, the trade-offs, and how to choose. Crisp but
with enough depth to design correctly.

---

## The core problem

Generating a file couples three costs that grow with data size:
- **Time** — query + serialize can exceed request timeouts (client, LB, API gateway).
- **Memory** — buffering the whole file holds it all in RAM.
- **Connection** — one HTTP request held open for the whole duration is fragile (drops,
  retries, proxy limits, mobile networks).

Every pattern below trades these off differently. Pick by **data volume** and **how
bounded** it is.

---

## Pattern 1 — Synchronous, buffered download

Backend builds the entire file in memory, returns it in one response; browser saves it.

```
Client ──POST /export──▶ Server: query all rows → build file in memory → return bytes
Client ◀──200 + file────
```

- **Pros:** trivial to build; one request; immediate download; no infra.
- **Cons:** memory = full file; blocked by request timeout; no progress; fails hard at
  scale. (This is RM's current review export.)
- **Use when:** data is small and **bounded** (hundreds–low thousands of rows), latency
  well under the timeout.

---

## Pattern 2 — Streaming response

Server streams the file as it produces it (chunked transfer / write row-by-row) instead
of buffering. Browser downloads progressively.

```
Client ──GET /export──▶ Server: for each row → write chunk to response stream
Client ◀═══chunks═══════ (connection stays open, flushes as it goes)
```

- **Pros:** flat memory (never holds whole file); starts downloading immediately;
  single click, no job system.
- **Cons:** connection still held for full duration (timeout risk remains for very long
  runs); harder to signal mid-stream errors (headers/200 already sent); some proxies buffer.
- **Use when:** medium/large but still one-shot; you want to avoid a job system but not
  blow up memory. Node: `res.write()` per chunk / `Readable.pipe(res)`; Java:
  `StreamingResponseBody`; DB cursor / keyset pagination feeding the stream.

---

## Pattern 3 — Async job + notification (the scale standard)

Request kicks off background generation and returns immediately; client learns of
completion via polling, websocket, or email.

```
Client ──POST /export──▶ Server: enqueue job, return 202 {jobId}
                         Worker: generate file → store → mark done
Client ──GET /export/{jobId}──▶ Server: {status: processing|done, downloadUrl?}
        (poll, or push via websocket / email link)
```

- **Pros:** no request-timeout problem at all; survives multi-minute/hour jobs; retryable;
  decouples UI from work; scales horizontally.
- **Cons:** most moving parts (queue, worker, job store/status, storage, notification);
  eventual (not instant) download.
- **Use when:** data is **unbounded / growing**, or generation is heavy. This is what
  mature products use for "Export all."

---

## Pattern 4 — Pre-signed direct download (object storage)

Backend writes the file to object storage (S3/GCS) and hands the client a time-limited
**pre-signed URL**; client downloads straight from storage, bypassing the app server.

```
Worker: generate → upload to S3
Server: return pre-signed URL (expires in N min)
Client ──GET──▶ S3 (direct)   ← app server not in the download path
```

- **Pros:** app server never streams bytes (no app timeout/memory in download path);
  storage handles huge files, ranges, resume; URL expiry = built-in access control.
- **Cons:** needs object storage + credentials; file lands at rest (lifecycle/cleanup +
  security to manage).
- **Use when:** large files and/or you already have S3. **Pairs naturally with Pattern 3**
  (job generates → uploads → returns pre-signed URL). This #3 + #4 combo is the
  industry-standard heavy-export design.

---

## Pattern 5 — Cap / paginate + "refine filter"

Enforce a max export size; if the query exceeds it, reject or truncate and tell the user
to narrow filters (or export in ranges).

- **Pros:** simplest guardrail; bounds all three costs; keeps you in Pattern 1/2 safely.
- **Cons:** not a true "export everything"; pushes work to the user.
- **Use when:** a hard cap is acceptable product-wise; often layered *on top of* 1–4 as a
  safety net.

---

## Choosing — quick decision guide

| Situation | Pattern |
|-----------|---------|
| Small, bounded data | 1 (sync buffered) |
| Medium, one-shot, memory a concern | 2 (streaming) |
| Large / unbounded / heavy generation | 3 + 4 (async job → S3 pre-signed) |
| Need a hard safety bound anywhere | 5 (cap), layered on |

Rule of thumb: **bounded → sync/stream; unbounded → async + storage.** Start simple; move
right on the table only when data volume forces it — don't pre-build a job system for a
1,000-row export.

---

## Cross-cutting concerns (any pattern)

- **Timeouts:** one consistent HTTP timeout; don't stack a second unwired one (RM's bug).
  Sync/stream needs a generous timeout; async removes the question.
- **Memory:** never `SELECT *` into RAM for large sets — use DB cursors / keyset
  pagination feeding a stream.
- **Filenames / headers:** set `Content-Disposition: attachment; filename=...` and correct
  `Content-Type`; `Content-Length` when known (progress bar).
- **CSV safety:** neutralize formula injection (`=`, `+`, `-`, `@`), quote fields with
  delimiters/newlines, doubled quotes (RFC 4180) — see RM's `escapeCsvField`.
- **Security:** authorize the export *and* the download step; pre-signed URLs must expire;
  don't leak other tenants' data.
- **Idempotency / retries:** async jobs should be safe to retry; dedupe by job key.
- **Cleanup:** lifecycle-expire generated files in storage.
- **Progress / UX:** disable the button while running; spinner for sync/stream; status +
  notification for async.
- **Observability:** track export duration (p50/p99) in APM — this is what tells you when
  to move right on the decision table, and how to size any timeout.

---

## Applied to RM (today)

Review export is **Pattern 1** and that's fine for current volumes. The correct evolution
when volumes grow is **Pattern 3 + 4** (async job → S3 pre-signed URL + notify), not a
bigger timeout. See `analysis.md` for the current timeout inconsistency and fix.

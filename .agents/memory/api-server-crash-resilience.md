---
name: API server crash resilience
description: Why the Express api-server can die silently and how to keep it diagnosable.
---

# API server crash resilience

The scaffolded `artifacts/api-server` (Express 5 + tsx) ships with **no Express
error-handling middleware and no process-level handlers**. Consequences observed
while debugging a reported "app crashes on the picture API":

- An uncaught exception or unhandled promise rejection terminates the tsx process
  with **no stack trace** — the workflow shows status `finished` with only
  "Server listening on port 8080" in the log, which looks identical to a clean stop.
  Easy to misread as "the server was just stopped".
- Body-parser failures (oversized payload → `PayloadTooLargeError` 413, malformed
  JSON → 400) without an error handler return Express's **HTML** default error page,
  which a JSON client then fails to parse.

**Fixes that close these gaps (apply to any Express artifact here):**
- `uncaughtException`: log the cause, then **graceful exit** (`server.close()` +
  `process.exit(1)`, guarded by a short unref'd timer) — do NOT keep serving from a
  potentially corrupted process. `unhandledRejection`: log only (less likely to
  corrupt state, and logging keeps it diagnosable).
- Add a 4-arg error middleware AFTER routes that returns JSON for 413/400/500.
- On the client custom-fetch layer, apply a default AbortController timeout (only
  when the caller supplies no signal) so a hung/unreachable server never leaves the
  UI stuck on an infinite loading state.

**Why:** the AI perspective calls legitimately take ~10s; combined with a server
that can die silently, the symptom users report is "crash"/"frozen" rather than a
clear error. Diagnostics + JSON errors + a client timeout make failures visible and
recoverable.

**Note on memory:** container has ~16GB RAM and node heap ~4.2GB; the compressed
images sent by the client are small (downscaled to 1280px ≈ a few hundred KB), so
OOM is NOT the likely cause of a crash here — look at uncaught errors first.

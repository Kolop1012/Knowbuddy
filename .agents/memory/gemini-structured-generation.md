---
name: Gemini structured generation
description: Reliable JSON output and latency control for gemini-2.5-flash via the Replit AI integration.
---

# Gemini structured generation (gemini-2.5-flash)

Rules learned the hard way when generating structured German content for Knowbuddy's perspective engine.

- **gemini-2.5-flash is a thinking model.** By default, thinking tokens consume the output budget and truncate your JSON, producing parse failures. Always set `thinkingConfig: { thinkingBudget: 0 }` for deterministic structured output, plus a generous `maxOutputTokens`.
  **Why:** truncated JSON surfaced as "KI-Antwort konnte nicht als JSON gelesen werden" 502s.

- **Prompt-only JSON is unreliable.** Even with `responseMimeType: "application/json"`, the model intermittently emits raw control chars (literal newlines/tabs) inside string values and otherwise-malformed JSON. Fix by passing a real `responseSchema` (constrained decoding) — it guarantees well-formed, properly-escaped JSON. Import the `Type` enum (re-exported from `@workspace/integrations-gemini-ai`, originally `@google/genai`).
  **Why:** ~1-in-8 calls failed JSON.parse; with `batchProcess` + `Promise.all` a single bad call 502s the whole batch.
  **How to apply:** any endpoint parsing model JSON should use `responseSchema` + a sanitizer fallback that escapes control chars inside string literals, not prompt instructions alone.

- **Parallelize, don't ask for everything in one call.** Generating 8 perspectives in one request took ~55-90s (proxy/deploy timeout risk). Splitting into 8 independent single-perspective calls via `batchProcess` (concurrency 8, retries) dropped wall-clock to ~8-12s. Assemble fixed fields (id/category/color) server-side; let AI fill only the prose.

- **Testing the AI call from bash is impossible here.** The bash tool hard-kills commands at ~60s and backgrounded/`nohup` curls die when the shell exits; `/tmp` and even workspace files written by detached procs don't survive. Verify via a foreground curl when latency is low (often ~10s) or through the browser/proxy (`curl http://localhost:80/<previewPath>/...`, NOT $REPLIT_DEV_DOMAIN), which isn't subject to the bash limit.

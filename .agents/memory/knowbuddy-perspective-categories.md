---
name: Knowbuddy perspective category architecture
description: How the 8 octagon perspective categories are produced and the fixed-color constraint that ties backend to frontend
---

# Knowbuddy perspective categories

Categories shown on the octagon are **self-identified per topic** by Gemini at
runtime (one extra model call before the 8-way perspective batch), not a static
list. Lives in `artifacts/api-server/src/lib/perspectives.ts`.

## Perspective mode (lens) selector
The InputScreen lets the user pick ONE lens that reshapes the 8 categories:
`wissenschaft` (default) | `stakeholder` | `politische_debatte`. It is an optional
scalar `mode` enum on both `/perspectives/text` and `/perspectives/image` requests
(OpenAPI `PerspectiveMode`), defaulted server-side to `wissenschaft` when absent
(backward compatible). Threaded route -> generatePerspectivesFromTopic/Image ->
generatePerspectives -> identifyCategories (branches the prompt via
`MODE_INSTRUCTIONS`). Frontend type is a hand-written union in
`artifacts/knowbuddy/src/types.ts` (NOT imported from api-zod — orval names the
generated enum cryptically and knowbuddy has no api-zod dep).
**Why:** the user's lens must change category *generation*, not just labels.

## The fixed-color constraint (important)
The octagon has 8 fixed node positions, each tied to a fixed hex color. The
frontend `PerspectiveScreen.tsx` keys its `CARD_BG` and `STRIP_CLR` maps by those
exact hex values. So the backend must keep emitting that exact 8-color palette
(`SLOT_COLORS`) and assign dynamic category names onto those fixed colors/ids in
order — never emit arbitrary colors, or the card/strip backgrounds break.

**Why:** colors are the join key between backend output and frontend styling;
there is no negotiation, the hex must match on both sides.

## Robustness rules baked into assembleSlots
- Always returns exactly 8 **distinct** slots.
- Dedupes categories case/diacritic-insensitively (`normalizeCategory`).
- Backfills any shortfall from the **mode-specific** fallback set
  (`FALLBACK_BY_MODE[mode]`), skipping names already present.
- `identifyCategories` never throws — on any failure it returns
  `FALLBACK_BY_MODE[mode]` (mode-aware, so the chosen lens still shapes categories
  on the degraded path) so the octagon always renders. Reduced retry budget (2) so
  a degraded model falls back fast.

## Dev gotcha
The api-server `dev` script runs `tsx` **without watch** — edits do NOT hot-reload.
Restart the `artifacts/api-server: API Server` workflow after changing server code,
or you'll keep testing the old build (symptom: results look like the static set).

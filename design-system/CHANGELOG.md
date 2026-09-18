# Design-system changelog

Decisions and deltas for the Figma ↔ code contract. Visuals live in Figma; this file is the short written log. Pair it with `figma-components.json` and `cards-v2-contract.json`.

## 2026-09-18 — 18thSepWeekend token and Figma cleanup

- Synced Figma variable dump into `tokens.json`: `gray-200` → `#d2d5da`, `gray-700` → `#40454f`, cascaded `surface-subtle`, `border-gray-light`, `icon-subtle`, badge text, and added `icon-gray-light` / `icon-gray-medium`.
- Fixed VibeCheck Colors WEB code syntax for border-gray-* and icon-subtle / icon-gray-* tokens.
- Retired **VibeCheck Component Colors** collection (no live consumers; badge tokens live in VibeCheck Colors).
- Updated Color System — VibeCheck primitive tile labels for gray-200 and gray-700; rebound Color Tokens — VibeCheck swatches to local semantic variables.
- Removed legacy **Feedback Card / Note**, **Feedback Card / Annotation**, and **Feedback Card / Wording** component sets from Figma (Cards v2 replaces them in code).

## 2026-09-15 — Cards v2 parity audit

- Synced the final Figma surface, subtle, danger, pending badge, and success badge values in Light and Dark.
- Corrected Field and ComboField state geometry, 4px Send anchoring, focus/error treatment, multiline growth, and empty Wording compose behavior.
- Updated runtime pins to the asymmetric Figma shape, numeric thread counters, 36px open state, and exact elevation.
- Removed the disabled Type Selector chevron and raised cards/menus above panels without clipping dropdowns.
- Added regression checks for status variants, token values, stacking, geometry, and independent Apply/Resolve behavior.

## 2026-09-15 — Cards v2 implementation

- Shipped the final Comment, Annotation, Wording, ComboField, menu, quote, reply, Send, and Apply Suggestion renderers.
- Replaced Preview/Approve/Reject with repeatable Apply Suggestion and independent Resolve/Reopen behavior.
- Added field-scoped validation, keyboard submission, focus restoration, reply threads, thread links/read state, and resolved filtering.
- Added the v2 local-storage migration and the separately applied Supabase migration at `supabase/migrations/20260915_cards_v2.sql`.
- Promoted Cards v2 component mappings and parity coverage from design-only to implemented.

## 2026-09-15 — Cards v2 behavior pass

- **Resolved comments.** `State=Resolved` stays on Comment and Annotation. Resolving **filters** the card out of Notes by default. **Show resolved comments** (Notes settings, like Figma) shows those cards again using the Resolved variant.
- **Reply Meta.** Default and Hover both include Message Meta. TEXT property renamed `TImestamp` → `Timestamp`.
- **Timestamps.** Relative buckets: just now; minutes; hours; **1–6 days**; 1–4 weeks; then a localized date.
- **Send.** Neutral (`bg/subtle`) while empty. Accent fill only when sendable (`State=Active`): `pin/note` / `pin/implement` / `pin/warning` / `pin/question`, icon `icon/on-accent`.
- **Annotation coverage.** Warning and Question now have Compose Active, Detail Thread, and Detail Resolved (Detail Default already existed).
- **Dark.** Full matrix for Comment and all Annotation kinds. Wording remains a spot-check.
- **Figma docs.** `07 · Behavior Contract` (`222:1720`) and `08 · Changelog` (`222:2234`) on Cards v2. Machine-readable IDs: `cards-v2-contract.json`.

## 2026-09-15 — ComboField and Wording lifecycle

- **ComboField.** Added field-scoped focus and required-field validation, first-only and both-filled coverage, submitting/failure states, retained-value retry, and long-content test instances. Field hover no longer triggers Send hover.
- **Optional reasoning.** The first field gates submission; the second field is optional and is omitted from Detail when empty.
- **Apply suggestion.** Replaced Approve/Reject with a check icon beside Suggested. Applying inserts content into the selected element and changes `Status=Pending` to `Status=Applied`; it never resolves the card.
- **Independent axes.** Wording now separates `Status`, `Thread`, and `Resolution`. Badges, reasoning, and replies persist across Apply and Resolve/Reopen.
- **Dark.** Added complete Wording compose/detail coverage. `pin/suggestion` pairs with `action/on-primary` so the active icon flips correctly.
- **Tokens.** Synced Figma’s `spacing/0`, `spacing/2`, and `radius/4` dimensions to the repository.
- **Implementation boundary at design time.** Runtime Wording and ComboField were unchanged during this design pass; see the implementation entry above for the shipped follow-up.

## 2026-09-15 — Component simplification follow-up

- **Apply Suggestion.** Reduced to Default, Hover, and Active. Applying is repeatable and returns the control to Default after every insertion.
- **Send.** Removed `Active Wording`; all cards use the shared Active variant and apply accent overrides at the composed-component level.
- **Quote.** Removed the Action axis. `Card / Apply Suggestion` exclusively owns interaction state.
- **ComboField messages.** Submitting and failure copy now live in dedicated auto-layout frames with increased spacing.
- **Multiline alignment.** Send is anchored to the second field’s bottom padding for both short and long content.

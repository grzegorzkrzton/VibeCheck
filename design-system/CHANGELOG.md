# Design-system changelog

Decisions and deltas for the Figma ↔ code contract. Visuals live in Figma; this file is the short written log. Pair it with `figma-components.json` and `cards-v2-contract.json`.

## 2026-09-21 — Tool page cursors

- Comment, Annotation, and Wording use a floating SVG follower (page cursor hidden; icon tracks the pointer).
- Remaining Main Toolbar tools use `cursor: url(...)` from the same toolbar glyphs. Toolbar, Notes panel, and other VibeCheck chrome keep the native pointer.

## 2026-09-21 — Notes Panel Resolve header icon removed

- Removed **Card / Header Icon Button** Resolve instance from Notes Panel header (`302:14767`); resolved visibility stays in filter List Menu (**Show resolved comments**).
- Notes Panel header actions are now Filter and More only; card detail headers still use Resolve/Reopen thread.

## 2026-09-21 — Wording toolbar icon

- **Wording** toolbar icon (`5:15`) updated to speech-bubble + pencil glyph; synced to `Icons.content` on Main Toolbar.

## 2026-09-21 — Main Toolbar tool order

- **Main Toolbar** (`352:9729`) tool order now matches Figma: Inspect → Comment → Annotation → Wording → Guides → layout tools → accessibility/visual tools → Search.
- Added divider after Inspect (before feedback tools); existing dividers after Wording, Move, and Accessibility unchanged.

## 2026-09-21 — Annotation toolbar tool

- Added **Annotation** toolbar icon (`368:12163`) and dedicated **Annotation** tool (`N`) — pins an Annotation card directly on click, separate from Comment.
- PM Only toolbar includes Inspect, Comment, Annotation, Wording, and Search.

## 2026-09-21 — Unified Menu List / Menu item

- **Menu List** (`368:11646`) and **Menu item** (`368:11517`) are now the shared dropdown primitives for card overflow, card type, panel filter, and panel more menus.
- Checkmark moves to the right on selected rows; menu chrome uses `--vc-bg`, selected/hover rows use `--vc-surface`.
- Card overflow drops Copy link (Mark as unread, Delete thread… only).
- Notes Panel `…` menu enabled: Hide comments, Just mentions and replies, Mark all as read; prefs persist in `vibecheck:panelPrefs`.

## 2026-09-21 — Feedback Pin Open state

- **Feedback Pin** (`4:76`) State=Open: surface fill, 2px type-colored border, no number label, pin-open elevation.

## 2026-09-21 — Notes Panel List Menu

- Added **List Menu** component for Notes Panel filter icon: Sort by date, Sort by unread, Show resolved comments.
- Filter icon opens anchored dropdown; sort/filter prefs persist in `vibecheck:panelPrefs`.
- Resolve header icon remains a disabled placeholder; resolved visibility moved into List Menu.

## 2026-09-21 — Search Field and Notes Panel autolayout sync

- **Search Field** (`348:9564`): gap 4, padding 6/8/4 (filled: 8 horizontal), content-hug height, 1.5px focus/error border.
- **Notes Panel** (`6:151`): 43px drag header, 40px search/actions row, filters py 8, panel min-width 280.

## 2026-09-21 — Field, Search Field, Notes Panel, and toolbar role

- Added **Field** (`348:8892`) — 32px single-line input for Account popup and other form surfaces. States Default/Hover/Focus/Filled/Disabled/Error; Focus and Error use 1.5px strokes; Body/SM typography.
- Added **Search Field** (`348:9564`) — 32px panel search with 16px Search icon, optional X circle clear, Body/XS typography. Distinct from Toolbar Search Popout.
- **Notes Panel** (`6:151`): Search Field instance, Card / Header Icon Button trio (Filter · Resolve · More), Card / Icon Button collapse/close, filter labels Comments/Writing.
- **Card / Input Field** (`180:1977`) renamed in Figma (was Card / Field); compose/reply field stays 36px with Send — not replaced by Field.
- **Notes Panel Chip** gained Hover variant; **Card / Header Icon Button** gained Filter action.
- **Main Toolbar** is now a component set (`352:9729`) with Role=Full | PM Only. PM Only = Inspect, Comment, Wording, Search.
- Deprecated legacy **Field** (`4:40`) in manifest; Account popup uses new Field for all inputs.
- New icon components catalogued (Sun, Moon, Gear, etc.) in `card-icons.js` for future instances.

## 2026-09-21 — Typography tokens + Figtree

- Added **VibeCheck Typography** primitives and semantic text styles to `tokens.json` (Heading / Body / Comp scale).
- Self-hosted Figtree (OFL) under `design-system/fonts/figtree/`; `design:sync` copies into the extension and emits `@font-face` for the popup + `figtreeFontFaceCss()` for the overlay.
- Migrated `feedback-styles.js` and `extension/popup/popup.css` from hardcoded sizes to `--vc-text-*` tokens.
- Documented the full Figma ↔ code map in `docs/typography-figma-code-map.md`.

## 2026-09-18 — 18thSepWeekend follow-up (toolbar + docs)

- Pointed Main Toolbar and toolbar-tip hotkeys at `--vc-surface` (Figma `surface/surface`). Dark `surface-subtle` is now gray-700, so the old binding made the toolbar look washed out.
- Matched Apply Suggestion to Figma: default/hover icon `--vc-text-gray-light`, hover fill `--vc-button-secondary-hover`, active fill `--vc-surface-subtle`.
- Finished Color Tokens — VibeCheck rows (icon-subtle/critical/accent/gray-*, border-gray-*, Badge, Pin), corrected primitive HEX labels, swapped Toolbar Flows Cards v1 instances to v2, then deleted the v1 sets.

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

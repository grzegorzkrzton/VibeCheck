# 06 — Final design token audit

**Product:** VibeCheck  
**Figma:** [VibeCheck](https://www.figma.com/design/3UduCyltV7tmRYSnDqTEfA/VibeCheck) (`3UduCyltV7tmRYSnDqTEfA`)  
**Repository:** `design-feedback-tool`  
**Audit date:** 2026-09-21  

**Source reports:**
- [`01-figma-token-inventory.md`](./01-figma-token-inventory.md)
- [`02-code-token-inventory.md`](./02-code-token-inventory.md)
- [`03-token-mapping.md`](./03-token-mapping.md)
- [`04-token-comparison.md`](./04-token-comparison.md)
- [`05-component-usage-audit.md`](./05-component-usage-audit.md)

**Method notes:** Inventories were taken from Figma Plugin API locals + repo `design-system/tokens.json` / generated CSS. Comparison statuses come from report 04. Unclear mappings are **not** counted as confirmed mismatches. Partial matches (value-aligned with structural differences) are counted under **Matching code tokens** in the coverage table, with alias/storage issues called out separately.

---

## 1. Executive summary

The design-token contract between Figma and code is **substantially value-aligned** for the live variable system: **82 primitives**, **39 semantic/component colors** (resolved Light/Dark HEX), and **19 of 20 dimensions** match on name+number after documented normalization. Elevation **Pin / Card / Panel** shadows match geometry and alpha after HEX8↔`rgb(…/ %)` normalize.

Material gaps are elsewhere:
1. **Typography** — Figma has five text styles (Inter + size/weight/line-height); code only exposes `--vc-font-family` as a **system-ui stack** (confirmed family **Mismatch**), with type metrics hardcoded in components.
2. **Alias model** — Figma Colors are live `VARIABLE_ALIAS`es; code stores **flattened HEX** in `tokens.json` (Partial match, not a value mismatch).
3. **Usage** — Feedback overlay and popup use `--vc-*` well; metatip, hotkey-map, and selection **bypass** the system via `--theme-color` / neon accents; a few UI paths use **primitives** or **wrong tokens**.
4. **Code-only extras** — motion, z-index, `size-popup`, `shadow-pin-open` have no Figma counterparts in inventory 01.

**Overall:** Safe to treat color/dimension foundations as largely in sync for parity work; prioritize typography, usage hygiene, opacity unit confirmation, and retiring non-token theme accents.

---

## 2. Overall alignment assessment

| Area | Assessment |
|---|---|
| Primitives | **Strong** — Match (04) |
| Semantic/component colors (resolved values) | **Strong values / Partial structure** — Light/Dark HEX align; aliases flattened in code |
| Dimensions (spacing, radius, size) | **Strong** — Match on numeric values |
| Opacity | **Partial / unit Unclear** — `45` vs `0.45` |
| Elevation shadows | **Partial** — values align; Figma effect styles vs CSS strings |
| Typography | **Weak** — styles Missing in code; font family Mismatch |
| Motion / z-index / breakpoints / border-width | **Absent or one-sided** |
| Component consumption | **Mixed** — strong on feedback/popup; weak on metatip/hotkey/selection |

**Verdict:** Foundations (color + most dimensions) are aligned enough for ongoing design–dev sync. The system is **not** fully aligned on typography, alias fidelity, or universal component adoption.

---

## 3. Coverage by category

**Matching code tokens** = report 04 **Match** + **Partial match** where a credible counterpart exists and values are not conflicting.  
**Mismatches** = report 04 **Mismatch** only (Unclear excluded).

| Category | Figma tokens | Matching code tokens | Mismatches | Missing in code | Missing in Figma | Unclear |
|---|---:|---:|---:|---:|---:|---:|
| Color — primitives | 82 | 82 | 0 | 0 | 0 | 0 |
| Color — semantic/component | 39 | 39 | 0 | 0 | 0 | 0 |
| Spacing | 9 | 9 | 0 | 0 | 0 | 0 |
| Border radius | 6 | 6 | 0 | 0 | 0 | 0 |
| Sizing | 4 | 4 | 0 | 0 | 1 (`size-popup`) | 0 |
| Opacity | 1 | 1 | 0 | 0 | 0 | 0 |
| Shadows / elevation | 3 | 3 | 0 | 0 | 1 (`shadow-pin-open`) | 0 |
| Typography (text styles) | 5 | 0 | 0 | 5 | 0 | 0 |
| Font family | 1 (Inter on styles) | 0 | 1 | 0 | 0 | 0 |
| Motion / duration | 0 | 0 | 0 | 0 | 5 | 0 |
| Z-index | 0 | 0 | 0 | 0 | 6 | 0 |
| Breakpoints | 0 | 0 | 0 | 0 | 0 | 1 (absent both) |
| Border width | 0 | 0 | 0 | 0 | 0 | 1 (absent both) |
| Foundations labels (non-variables) | 9 | 0 | 0 | 0 | 0 | 9 |
| Runtime `--vc-card-accent` | 0 | 0 | 0 | 0 | 1 | 0 |

**Notes:**
- Semantic color “matches” are **Partial** in 04 because code does not retain Figma aliases (see §9).
- Opacity counted as matching counterpart with **unit ambiguity** (see F-03).
- Foundations labels are documentation-only in Figma, not live variables (01).

---

## 4. Confirmed matches

Evidence: report 04 status **Match**; mapping confidence High in 03.

| Set | Examples | Evidence |
|---|---|---|
| 82 primitives | `gray/gray-500` ↔ `--vc-gray-500` `#737b8c` | Identical HEX; `tokens.json` primitives + Styleguide `264:7594` |
| Spacing scale | `spacing/4` `4` ↔ `--vc-spacing-4` `4px` | Numeric equal after px normalize; Dimensions collection |
| Radius scale | `radius/8` ↔ `--vc-radius-8` | Same |
| Sizes | `size/pin|tool|panel|card` ↔ `--vc-size-*` | Same |
| Semantic HEX (resolved) | e.g. `text/text` Light→`black`/`#0b0c0e`, Dark→`white`/`#f4f4f6` equals code light/dark maps | Values match; structure Partial (aliases) |

Representative code paths: `design-system/tokens.json`; generated `design-system/generated/tokens.css`.

---

## 5. Confirmed mismatches

Only **value/family conflicts** from 04 (Unclear and Partial excluded).

| Figma | Code | Conflict |
|---|---|---|
| Inter (text styles Body/Label/Title/Heading/Meta) | `--vc-font-family` = `system-ui, -apple-system, Segoe UI, …` | Font **family** strings are not the same |

No confirmed HEX mismatches were found for live Colors or Primitives collections when Light/Dark aliases were resolved.

---

## 6. Tokens missing from code

| Figma source | What’s missing in code | Evidence |
|---|---|---|
| Text styles `VibeCheck/Body/13`, `Label/11`, `Title/13`, `Heading/18`, `Meta/10` | Font-size, weight, line-height, letter-spacing tokens | 01 text styles; 04 Missing in code (5); components hardcode `font: 13px/18px` etc. (05) |
| (Implied by styles) Inter as family variable | No Inter font-family variable; code stack differs | 04 Mismatch / Missing type axes |

---

## 7. Tokens missing from Figma

| Code token | Evidence |
|---|---|
| `--vc-size-popup` (`320px`) | 02 dimension; 04 Missing in Figma |
| `--vc-shadow-pin-open` | 02 effect; 04 Missing in Figma |
| `--vc-duration`, `--vc-duration-fast`, `--vc-duration-panel` | `feedback-styles.js` L15–17 |
| `--vc-ease`, `--vc-ease-soft` | `feedback-styles.js` L18–19 |
| `--vc-card-accent` (runtime) | `feedback-styles.js` (e.g. L231, L844–848) |
| `--layer-top` … `--layer-5` | `_variables.css` L29–34 |

---

## 8. Naming inconsistencies

| Issue | Evidence |
|---|---|
| Figma path vs CSS flat kebab | `surface/surface` ↔ `--vc-surface`; `bg/bg` ↔ `--vc-bg` (duplicate segment collapse in 03) |
| Badge shorthand | `badge/pending - bg` ↔ `--vc-badge-pending-background` |
| Foundations specimen labels ≠ live variables | `text/primary`, `action/primary`, `bg/surface`, … (01 §7; 04 Unclear) |
| Legacy `--theme-text_color` underscore | `_variables.css` L23 vs kebab `--vc-*` |
| Figma `codeSyntax.WEB` already uses `var(--vc-…)` | Aligns names when present; supports High mappings in 03 |

---

## 9. Alias and semantic-token inconsistencies

| Issue | Evidence | Impact |
|---|---|---|
| Figma Colors = `VARIABLE_ALIAS`; code = resolved HEX | 01 Colors; 02 `tokens.json` `color.light/dark`; 04 Partial on all 39 | Updating a primitive in Figma does not automatically update code until HEX is recopied |
| Styleguide forbids primitives in UI; code uses some primitives | 01 Color System warning; 05 `--vc-purple-100`, `--vc-gray-500` | Breaks intended semantic layering |
| `--theme-*` second hop | `_variables.css` L8–27 → `var(--vc-*)` | Extra rename surface; not in Figma |
| Unused badge tokens | `--vc-badge-background` / `--vc-badge-text` unused; default badge uses pending tokens | 05; 02 unused list |
| `--vc-button-primary-hover` unused in popup primary | 05; tokens.json | Hover state not token-wired |

---

## 10. Theme and mode discrepancies

| Topic | Figma | Code | Gap |
|---|---|---|---|
| Color modes | Collections modes `Light` / `Dark` | `tokens.css` light defaults + `prefers-color-scheme: dark`; host light/dark sheets; `#vibecheck-layer[data-scheme]` | Behavior present both sides; mechanisms differ |
| Shared tokens | Primitives/Dimensions mode `Value` | Shared (no per-mode override) | Aligned |
| Non-DS accents | — | `--theme-color: hotpink`, `--theme-blue`, `--theme-purple`; dark only remaps `--theme-color` | `_variables.css` L14–16, L42–46; metatip/hotkey consumers |
| Fallbacks ignore scheme | — | `var(--vc-surface, #1f2937)` / `#f0f2f4` | 05; can disagree with active mode if var missing |

---

## 11. Hardcoded values

From report 05 (non-exhaustive; high-signal):

| Location | Example | Should use / note |
|---|---|---|
| `feedback-styles.js:190` | `border-radius: 16px` | No `--vc-radius-16`; closest `--vc-radius-12` |
| `feedback-styles.js:188,359,389` | `#1f2937`, `#f0f2f4` fallbacks | Token HEX or omit fallback |
| `feedback-styles.js:132,519,739…` | Hardcoded `font: …px` | Missing type tokens (Figma styles) |
| `feedback-styles.js:637,682` | `opacity: 0.4` / `0.75` | Inconsistent with `--vc-opacity-resolved` |
| `vibe-check.element.css:111,173` | Ad-hoc `hsla` shadows | `--vc-shadow-*` |
| `vibe-check.element.js:251` | Literal system-ui stack | `var(--vc-font-family)` |
| `popup.css:16–22,70` | `18px` / `18px` margin / `11px` | Type + spacing tokens |
| Selection CSS | `--neon-pink` / `--neon-purple` | Outside DS |

---

## 12. Component usage issues

From report 05:

| Class | Examples |
|---|---|
| Correct | Pins by type; card surface/shadow; popup primary button + inputs; alert `--vc-text-critical`; panel size/shadow |
| Wrong token | Header icon Active always `--vc-pin-note` (L307–309); focus ring `--vc-pin-note` (L484); `#signout` bg `--vc-text-gray-light` (popup.css:59) |
| Primitive in UI | Send hover `--vc-purple-100` (L623–624); scrollbar `--vc-gray-500` (L536,561) |
| Bypass | Metatip `--theme-color/blue/purple`; hotkey pressed hotpink; selection neon |
| Inconsistent | Card radius 16px vs menus `--vc-radius-12`; disabled opacity 0.4 vs token 0.45 |

---

## 13. Accessibility risks

Risk flags from 05 (**not** measured WCAG lab scores):

| Risk | Evidence |
|---|---|
| `--vc-text-gray-light` on `--vc-surface` for 10–11px labels | `feedback-styles.js` header icons, badges, quote headings |
| `#signout` mid-gray fill | `popup.css:59` using text token as background |
| `--vc-text-inverse` on saturated `--vc-pin-*` / card accents | Pins + kinds selected (warning/suggestion hues) |
| Hotpink / theme accents on surfaces | `hotkey-map/base.element.css:120–122`; metatip |
| Low-visibility focus | `filter: brightness(0.96)` on send (`feedback-styles.js:631–632`) |

---

## 14. Highest-risk findings

| Rank | ID | Why highest |
|---|---|---|
| 1 | F-01 | Typography contract broken (family mismatch + no size/weight tokens) → systemic visual drift |
| 2 | F-02 | Alias flattening → silent desync when Figma primitives change |
| 3 | F-04 / F-05 | Wrong/primitive token use in interactive chrome |
| 4 | F-08 | Non-DS theme accents + possible contrast failures |
| 5 | F-03 | Opacity unit ambiguity for Resolved/Disabled states |

---

## 15. Recommended remediation plan

Only actions supported by audit evidence (no speculative redesigns).

### Phase A — Confirm and document (low cost)

1. Confirm whether Figma `opacity/resolved` `45` is intended as **45%** (= code `0.45`). Record the decision in `design-system/CHANGELOG.md`.
2. Measure contrast for gray-light-on-surface, badge pairs, pin+inverse, and `#signout` in Light and Dark.
3. Decide status of Foundations specimen labels (`text/primary`, …): update Figma labels to live names or mark deprecated.

### Phase B — Usage hygiene (code)

1. Replace `--vc-purple-100` send hover and `--vc-gray-500` scrollbars with semantic tokens already in the system (`--vc-button-secondary-hover` / `--vc-surface-subtle` / `--vc-text-gray-medium` or `--vc-border-gray-medium`) per 05.
2. Fix wrong tokens: header Active → `--vc-card-accent`; `#signout` → secondary button tokens; avoid text tokens as fills.
3. Remove or align non-token `var(--vc-*, #fallback)` HEX to `tokens.json` values.
4. Wire `--vc-button-primary-hover` on popup primary `:hover`, or document why unused.
5. Prefer `--vc-*` in metatip/hotkey where equivalents exist; isolate neon selection chrome as non-DS if intentional.

### Phase C — Contract completeness

1. Add code typography tokens (or ship Inter + size/weight/line-height vars) matching the five Figma text styles — **or** change Figma styles to the system stack if Inter is not the product intent (requires explicit product/design decision).
2. Optionally preserve alias references in `tokens.json` (primitive refs) instead of only resolved HEX, to match Figma.
3. Add Figma variables for code-only tokens that should be shared (`size-popup`, motion, `shadow-pin-open`) **or** document them as code-local in `design-system/README.md`.
4. Replace card `16px` radius with `--vc-radius-12` or add a documented `radius-16` to both Figma and code.

### Phase D — Guardrails

1. Keep `npm run design:check` / `test:parity` in CI.
2. Extend parity checks to forbid new `var(--vc-*-NNN)` primitive usage in `app/vibecheck/` and `extension/popup/` (allowlist if needed).
3. Re-run inventories 01–05 after remediation.

---

## Findings register

| ID | Severity | Finding | Evidence | Impact | Recommended action |
|---|---|---|---|---|---|
| F-01 | Critical | Typography not implemented as tokens; Inter vs system-ui family **Mismatch** | 01 text styles; 04 Missing in code (5) + Mismatch (1); 05 hardcoded `font:` in `feedback-styles.js` / `popup.css` | Systematic type drift vs Figma; cannot sync type from variables | Decide Inter vs system stack; add size/weight/line-height tokens or update Figma styles to match code — then wire components |
| F-02 | High | Semantic colors are aliases in Figma but resolved HEX in code | 01 Colors `VARIABLE_ALIAS`; 02 `color.light/dark`; 04 Partial ×39 | Primitive edits in Figma won’t flow to code automatically | Keep manual sync discipline; optionally store alias targets in `tokens.json`; document in README |
| F-03 | High | Opacity `45` (Figma) vs `0.45` (code) unit semantics unproven | 01 Dimensions `opacity/resolved`; 02 L207; 04 Partial | Wrong opacity if 45≠45% | Confirm with design; normalize one representation in both tools |
| F-04 | High | Interactive UI uses primitive colors | 05: `--vc-purple-100` L623–624; `--vc-gray-500` L536,561; 01 “Never use primitive colors in the UI!” | Violates token layering; dark-mode may look wrong if primitives aren’t mode-aware (they aren’t) | Switch to semantic tokens already defined |
| F-05 | High | Wrong tokens for controls | 05: Active header `--vc-pin-note` L307–309; focus `--vc-pin-note` L484; `#signout` `--vc-text-gray-light` popup.css:59 | Incorrect meaning; `#signout` contrast risk | Use `--vc-card-accent` / secondary button tokens; fix focus to border/focus semantic |
| F-06 | High | Legacy theme accents bypass `--vc-*` | `_variables.css` hotpink/blue/purple; metatip + hotkey-map (05) | Dual palette; incomplete dark remap | Migrate accents to `--vc-*` or document as deprecated non-DS |
| F-07 | Medium | Hardcoded radii, shadows, opacities, sizes | 05: card `16px` L190; hsla shadows; opacity `0.4`/`0.75`; control `24px`/`28px`/`32px` | Visual inconsistency within product | Prefer existing `--vc-*`; add tokens only when Figma adds them too |
| F-08 | Medium | Likely low-contrast gray-light and mid-gray button fill | 05 a11y section; tokens gray-light on surface | Accessibility failures possible | Measure WCAG; raise contrast token or usage |
| F-09 | Medium | Code-only motion, z-index, `size-popup`, `shadow-pin-open` | 02; 04 Missing in Figma | Designers cannot edit these in Figma variables | Add to Figma or mark code-local in docs |
| F-10 | Medium | Non-token color fallbacks on `--vc-surface` / `--vc-text` | `feedback-styles.js` L188,359–361,389–390; tip JS fallbacks `#111827` | Fallbacks disagree with DS HEX if vars fail | Align fallbacks to `tokens.json` or remove |
| F-11 | Medium | Defined tokens unused (`badge-background`, `badge-text`, `button-primary-hover`) while nearby patterns reimplement | 02 unused; 05 | Dead contract / incomplete states | Use tokens or remove from SoT with changelog |
| F-12 | Low | Naming punctuation (`pending - bg`) and Foundations label drift | 01 §7; 03; 04 Unclear ×9 | Mapping friction for humans | Rename labels to live variable paths |
| F-13 | Low | Selection neon / Open Props chrome outside DS | 05 selection `*.css`; `_variables.css` Open Props imports | Intentional debug chrome vs product DS ambiguity | Document as non-DS tooling chrome |
| F-14 | Low | Breakpoints & border-width absent on both sides | 01; 02; 04 Unclear | No token for those axes (not a sync bug) | No action unless product needs them |
| F-15 | Low | 93 `--vc-*` defined without `var()` consumer (mostly primitives) | 02 | Expected if primitives are reference-only; still ship cost | Keep primitives for Figma parity; lint against UI use |

---

## Appendix — Status math (report 04)

| Status | Count | Role in this final |
|---|---:|---|
| Match | 101 | Confirmed matches |
| Partial match | 50 | Matching counterparts with structural caveats (not mismatches) |
| Mismatch | 1 | Confirmed mismatch (font family) |
| Missing in code | 5 | Typography axes |
| Missing in Figma | 14 | Code-only tokens |
| Unclear | 11 | Not counted as mismatches |

---

## Appendix — Audit trail

| Step | Doc |
|---|---|
| Figma inventory | 01 |
| Code inventory | 02 |
| Proposed mapping | 03 |
| Statused comparison | 04 |
| Component usage | 05 |
| Final synthesis | 06 (this file) |

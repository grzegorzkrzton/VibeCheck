# Alignment audit rules

## Token classification

| Type | Figma | Code |
| --- | --- | --- |
| Primitive/raw | `VibeCheck Primitives`, dimension floats, typography primitives | `tokens.json` `primitives`, `dimension`, `font.size/weight/…` |
| Alias/reference | Colors collection `VARIABLE_ALIAS` | `--theme-*` → `var(--vc-*)` (not in `color.light/dark`) |
| Semantic | Role colors (`text/*`, `surface/*`, `bg/*`, `border/*`, `link/*`, `icon/*`) | `color.light/dark` keys, `font.text.*` |
| Component | `pin/*`, `badge/*`, `button/*`, elevation styles | `pin-*`, `badge-*`, `button-*`, `shadow-*` |

**Never** treat a primitive as interchangeable with a semantic or component token in UI usage audits.

## Comparison-only normalization

Apply only when comparing; preserve original names/values in report columns.

| Kind | Rule |
| --- | --- |
| Case | Lowercase for compare |
| Separators | `/`, spaces, `_`, `.` → `-` |
| Duplicate segments | Collapse `gray/gray-50` → `gray-50`, `bg/bg` → `bg` |
| Prefixes | Strip `var(--vc-)`, `--vc-`, `VibeCheck/`, `Elevation/` |
| Badge shorthand | `pending - bg` → `pending-background`; `success - bg` → `success-background` |
| Color | HEX 3/6/8; `rgb(0 0 0 / N%)`; compare sRGB + alpha |
| Units | Figma raw float ↔ code `Npx` numerically; opacity `45` vs `0.45` → **Partial/Unclear** until confirmed |
| Font weight | Regular↔400, Medium↔500, Semi Bold↔600, Bold↔700 |
| Modes | `Light`↔`light`, `Dark`↔`dark`, Figma `Value`↔ code shared/all |

## Mapping confidence

| Level | Criteria |
| --- | --- |
| **High** | Normalized names match; values match both modes (or single-mode); types align |
| **Medium** | Names match; one mode differs, or alias flattening, or unit ambiguity |
| **Low** | Weak name similarity with some value evidence; Foundations labels; partial typography overlap |
| **None** | No credible counterpart |

Similar names alone → **Low** at best, never **High**.

## Comparison status

| Status | When to use |
| --- | --- |
| **Match** | Name, value (after normalize), type tier, mode behavior align |
| **Partial match** | Credible pair with material differences (aliases flattened, effect style vs CSS string, opacity units) |
| **Mismatch** | Proposed pair with conflicting values or families |
| **Missing in code** | Live Figma token/style with no code counterpart |
| **Missing in Figma** | Code token with no Figma variable/style in live inventory |
| **Unclear** | Insufficient evidence (Foundations labels, absent categories on both sides) |

**Unclear is never a Mismatch.**

## Coverage table columns

For report 06:

- **Matching code tokens** = Match + Partial match (where values do not conflict)
- **Mismatches** = Mismatch only
- **Unclear** = Unclear only (not counted as mismatches)

## Component usage issue types

| Issue | Description |
| --- | --- |
| None — correct | Uses expected semantic/component token |
| Wrong token | Semantic/component token exists but a different one is used |
| Primitive in UI | `--vc-{palette}-*` or raw gray/purple in product UI |
| Hardcoded | Literal hex/px/opacity/font not from tokens |
| Inconsistent | Same visual purpose, different literal or token |
| Theme bypass | `--theme-color`, neon, Open Props instead of `--vc-*` |
| Dark-mode | Fallback or accent ignores active scheme |
| A11y risk | Contrast concern from token pairing (flag only; do not claim WCAG pass/fail without measurement) |

## Severity (findings register)

| Severity | Use when |
| --- | --- |
| **Critical** | Systemic contract break (e.g. typography family/scale entirely wrong) |
| **High** | Wrong/primitive tokens in shipped UI; alias drift risk; confirmed value conflict |
| **Medium** | Hardcoded values; unused defined tokens; code-only/Figma-only gaps |
| **Low** | Naming friction; intentional non-DS chrome; reference-only unused primitives |

Recommendations must be **evidence-backed**. Do not propose fixes that require unsupported assumptions.

## Code usage scan exclusions

When counting `var(--vc-*)` consumers, exclude:

- `design-system/generated/*`
- `extension/popup/tokens.css`
- `app/bundle.js`, `**/bundle.min.js`
- `scripts/`, `docs/token-audit/`
- Lines that only **define** `--vc-*:` (not references)

## Figma live dump requirements

Each variable record should capture when available:

- `name`, `resolvedType`, collection, modes
- Raw value or `VARIABLE_ALIAS` target name
- `codeSyntax.WEB` if present
- `scopes`, `description`

Each text style: `fontName`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`.

Each effect style: type, offset, radius, spread, color (HEX8 if present).

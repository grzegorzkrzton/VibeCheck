---
name: figma-code-alignment
description: >-
  Audits live Figma variables and styles against this repo's design tokens
  and component token usage. Use when the user asks for a Figma/code token
  alignment audit, token parity check, Figma alignment skill, or to run the
  figma-code-alignment skill.
disable-model-invocation: true
---

# Figma–code alignment audit

End-to-end audit: live Figma → repo tokens → mapping → comparison → component usage → final report.

**Do not** change product CSS/JS unless the user separately asks to fix findings.

## Before you start

1. Read [references/sources.md](references/sources.md) for file keys, paths, and Figma nodes.
2. Read [references/rules.md](references/rules.md) for statuses, normalization, and severity.
3. Read [references/report-06.md](references/report-06.md) before writing the final report.
4. Load **figma-use** skill before every `use_figma` call (`skillNames: "figma-use"`).

## Fail-closed rules

- **Figma MCP required.** If `use_figma` or variable/style reads fail, stop and report the error. Do **not** treat existing `docs/token-audit/` files as current Figma.
- **Do not infer** Figma values not returned by MCP.
- **Unclear ≠ Mismatch.** Never count Unclear mappings as confirmed mismatches.
- **Primitive ≠ semantic.** Do not treat primitive swatches as interchangeable with semantic UI tokens.
- **Similar values alone ≠ Match.** Require name + value + type + mode evidence per [rules.md](references/rules.md).

## Workflow

Copy this checklist and track progress:

```
Audit progress:
- [ ] Step 0: Preflight
- [ ] Step 1: Figma inventory → docs/token-audit/01-figma-token-inventory.md
- [ ] Step 2: Code inventory → docs/token-audit/02-code-token-inventory.md
- [ ] Step 3: Mapping → docs/token-audit/03-token-mapping.md
- [ ] Step 4: Comparison → docs/token-audit/04-token-comparison.md
- [ ] Step 5: Component usage → docs/token-audit/05-component-usage-audit.md
- [ ] Step 6: Final report → docs/token-audit/06-final-token-audit.md (REQUIRED)
```

### Step 0 — Preflight

1. Read `design-system/tokens.json` → `fileKey`, `figma.collections`, `cssPrefix`.
2. Run `npm run design:check` (or `node scripts/check-parity.mjs`). Record pass/fail for report 06 (markup drift, not token values).
3. Ensure `docs/token-audit/` exists.

### Step 1 — Figma inventory (live)

Use Figma MCP (`use_figma`) to dump:

- All local variable collections, modes, variables (with resolved values and alias targets)
- Local paint, text, effect, and grid styles
- Page/frame structure for Styleguide (`258:4085`), Color Tokens (`287:11678`), Design (`1:3`), Foundations (`3:62`)

Classify each token: **Primitive/raw**, **Alias/reference**, **Semantic**, **Component**.

Write `docs/token-audit/01-figma-token-inventory.md` using the table:

`| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |`

Save raw dump as `.cursor/skills/figma-code-alignment/.cache/figma-inventory.json` for scripts.

**Figma dump script** (adapt as needed):

```javascript
// use_figma — inventory all local variables and styles
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
// ... resolve aliases, export JSON { collections, variables, styles }
```

Also call `get_metadata` on key documentation nodes when structure helps.

### Step 2 — Code inventory

1. Run the scanner:

```bash
node .cursor/skills/figma-code-alignment/scripts/scan-code-tokens.mjs \
  --out .cursor/skills/figma-code-alignment/.cache/code-inventory.json
```

2. Manually note theme adapters (`app/components/_variables*.css`), runtime motion tokens (`app/vibecheck/feedback-styles.js`), and generated vs manual files.

Write `docs/token-audit/02-code-token-inventory.md`:

`| Category | Code token | Type | Value | Alias/reference | Mode/theme | File | Line |`

### Step 3 — Mapping

1. Run comparison script (mapping mode):

```bash
node .cursor/skills/figma-code-alignment/scripts/compare-tokens.mjs \
  --figma .cursor/skills/figma-code-alignment/.cache/figma-inventory.json \
  --code .cursor/skills/figma-code-alignment/.cache/code-inventory.json \
  --out .cursor/skills/figma-code-alignment/.cache/mapping.json
```

2. Review Low/None confidence rows; add human judgment for Foundations labels and badge shorthand names.

Write `docs/token-audit/03-token-mapping.md`:

`| Figma token | Code token | Normalization applied | Confidence | Reason |`

Confidence: **High** / **Medium** / **Low** / **None** (see [rules.md](references/rules.md)).

### Step 4 — Comparison

Use mapping output + [rules.md](references/rules.md) to assign per-token status:

**Match** | **Partial match** | **Mismatch** | **Missing in code** | **Missing in Figma** | **Unclear**

Check separately: names, values, types, aliases, modes, semantics, units, typography structure, shadow structure, breakpoints.

Write `docs/token-audit/04-token-comparison.md`:

`| Category | Figma token | Figma value | Code token | Code value | Status | Evidence |`

Re-run compare script with `--compare` if helpful for status counts.

### Step 5 — Component usage

Inspect representative consumers (grep + read):

| Surface | Paths |
| --- | --- |
| Feedback overlay | `app/vibecheck/feedback-styles.js`, `feedback-ui.js`, `components.js` |
| Popup | `extension/popup/popup.css` |
| Toolbar | `app/components/vibe-check/vibe-check.element.css`, `.js` |
| Legacy theme | `app/components/metatip/`, `hotkey-map/`, `_variables*.css` |
| Selection chrome | `app/components/selection/*.css` |

Flag: correct use, wrong token, primitive in UI, hardcoded values, inconsistent same-purpose values, theme/dark issues, bypass, contrast **risks** (not unmeasured WCAG scores).

Write `docs/token-audit/05-component-usage-audit.md`:

`| Component | Property | Current value/token | Expected token | Issue | File and line |`

### Step 6 — Final report (REQUIRED)

Synthesize 01–05 into `docs/token-audit/06-final-token-audit.md` using the template in [references/report-06.md](references/report-06.md).

Include all 15 sections, coverage table, findings register (F-01…), and `design:check` pass/fail.

## Scripts

| Script | Purpose |
| --- | --- |
| [scripts/scan-code-tokens.mjs](scripts/scan-code-tokens.mjs) | Code token inventory + `var(--vc-*)` usage + hardcoded hex hits |
| [scripts/compare-tokens.mjs](scripts/compare-tokens.mjs) | Mapping + comparison JSON from Figma + code dumps |

Scripts emit JSON; the agent writes human-readable markdown reports.

## Output contract

| File | Required | Role |
| --- | --- | --- |
| `01-figma-token-inventory.md` | Working | Live Figma SoT snapshot |
| `02-code-token-inventory.md` | Working | Repo token SoT snapshot |
| `03-token-mapping.md` | Working | Proposed pairs + confidence |
| `04-token-comparison.md` | Working | Status per mapped token |
| `05-component-usage-audit.md` | Working | Runtime consumption |
| **`06-final-token-audit.md`** | **Required publish** | Executive summary + remediation |

## Related checks (not substitutes)

- `npm run design:sync` — regenerate CSS from `tokens.json`
- `npm run design:check` — `data-vc-component` / generated-file drift ([scripts/check-parity.mjs](../../scripts/check-parity.mjs))
- [docs/typography-figma-code-map.md](../../docs/typography-figma-code-map.md) — typography cross-reference (verify live each run)

## Out of scope

- Pixel/screenshot visual parity
- Code Connect publish
- Fixing product CSS/JS (unless explicitly requested after audit)

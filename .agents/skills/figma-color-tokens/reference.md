# Figma color tokens — reference

## Figma file

| Key | Value |
|-----|-------|
| File key | `3UduCyltV7tmRYSnDqTEfA` |
| File name | VibeCheck |
| Design page | `1:3` |
| Styleguide section | `305:14897` |
| Mapping manifest | [`design-system/figma-components.json`](design-system/figma-components.json) |

## Collections (color skill scope)

| Collection | Mode(s) | Maps to in tokens.json |
|------------|---------|------------------------|
| VibeCheck Primitives | Value | `primitives` |
| VibeCheck Colors | Light, Dark | `color.light`, `color.dark` |

**Not in this skill:** VibeCheck Dimensions, VibeCheck Typography (listed in `tokens.json` `figma.collections` but synced separately).

## Code pipeline

```
design-system/tokens.json
  → npm run design:sync  (scripts/design-sync.js)
  → design-system/generated/tokens.css
  → design-system/generated/tokens-light.css
  → design-system/generated/tokens-dark.css
  → design-system/generated/tokens.js
  → extension/popup/tokens.css

npm run design:check  (scripts/check-parity.mjs)
npm run extension:build  (when toolbar/feedback CSS changes)
```

**CSS prefix:** `--vc` (from `tokens.json` `cssPrefix`)

---

## Name mapping

Figma variable path → `tokens.json` key → CSS custom property.

### Primitives

| Figma | tokens.json key | CSS |
|-------|-----------------|-----|
| `white` | `white` | `--vc-white` |
| `black` | `black` | `--vc-black` |
| `gray/gray-200` | `gray-200` | `--vc-gray-200` |
| `gray/gray-700` | `gray-700` | `--vc-gray-700` |
| `purple/purple-600` | `purple-600` | `--vc-purple-600` |
| … | `{family}-{shade}` | `--vc-{family}-{shade}` |

Strip the group prefix; use hyphenated leaf names.

### Semantic colors (VibeCheck Colors)

| Figma | tokens.json key | CSS |
|-------|-----------------|-----|
| `bg/bg` | `bg` | `--vc-bg` |
| `surface/surface` | `surface` | `--vc-surface` |
| `surface/surface-subtle` | `surface-subtle` | `--vc-surface-subtle` |
| `surface/surface-input` | `surface-input` | `--vc-surface-input` |
| `text/text` | `text` | `--vc-text` |
| `text/text-body` | `text-body` | `--vc-text-body` |
| `text/text-gray-light` | `text-gray-light` | `--vc-text-gray-light` |
| `text/text-gray-medium` | `text-gray-medium` | `--vc-text-gray-medium` |
| `icon/icon` | `icon` | `--vc-icon` |
| `icon/icon-subtle` | `icon-subtle` | `--vc-icon-subtle` |
| `icon/icon-gray-light` | `icon-gray-light` | `--vc-icon-gray-light` |
| `icon/icon-gray-medium` | `icon-gray-medium` | `--vc-icon-gray-medium` |
| `icon/icon-accent` | `icon-accent` | `--vc-icon-accent` |
| `icon/icon-critical` | `icon-critical` | `--vc-icon-critical` |
| `icon/icon-inverse` | `icon-inverse` | `--vc-icon-inverse` |
| `border/border` | `border` | `--vc-border` |
| `border/border-gray-light` | `border-gray-light` | `--vc-border-gray-light` |
| `border/border-gray-medium` | `border-gray-medium` | `--vc-border-gray-medium` |
| `border/border-gray-strong` | `border-gray-strong` | `--vc-border-gray-strong` |
| `border/border-inverse` | `border-inverse` | `--vc-border-inverse` |
| `button/button-primary` | `button-primary` | `--vc-button-primary` |
| `button/button-primary-on` | `button-primary-on` | `--vc-button-primary-on` |
| `button/button-primary-hover` | `button-primary-hover` | `--vc-button-primary-hover` |
| `button/button-secondary-hover` | `button-secondary-hover` | `--vc-button-secondary-hover` |
| `badge/background` | `badge-background` | `--vc-badge-background` |
| `badge/text` | `badge-text` | `--vc-badge-text` |
| `badge/pending - bg` | `badge-pending-background` | `--vc-badge-pending-background` |
| `badge/pending - text` | `badge-pending-text` | `--vc-badge-pending-text` |
| `badge/success - bg` | `badge-success-background` | `--vc-badge-success-background` |
| `badge/success - text` | `badge-success-text` | `--vc-badge-success-text` |
| `pin/note` | `pin-note` | `--vc-pin-note` |
| `pin/implement` | `pin-implement` | `--vc-pin-implement` |
| `pin/warning` | `pin-warning` | `--vc-pin-warning` |
| `pin/question` | `pin-question` | `--vc-pin-question` |
| `pin/suggestion` | `pin-suggestion` | `--vc-pin-suggestion` |
| `link/link` | `link` | `--vc-link` |
| `text/text-critical` | `text-critical` | `--vc-text-critical` |

**Keep `pin-*` names.** Do not rename to `note` / `implement` in CSS leaves.

**Badge CSS leaves use `-background`**, not `-bg` (e.g. `--vc-badge-pending-background`).

---

## WEB syntax checklist

Every VibeCheck Colors variable: `codeSyntax.WEB = var(--vc-{leaf})`.

Verify after every dump:

- [ ] All `border/border-gray-*` and `border/border-inverse` use distinct `--vc-border-*` leaves
- [ ] `icon/icon-subtle` → `--vc-icon-subtle` (not `--vc-icon`)
- [ ] `icon/icon-gray-*` → `--vc-icon-gray-*` (not `--vc-text-gray-*`)
- [ ] Badge pending/success use `-background` / `-text` leaf names

---

## Documentation frames

| Frame | Node ID | Purpose |
|-------|---------|---------|
| Color System — VibeCheck | `264:7594` | Primitive tiles, topology copy |
| Color Tokens — VibeCheck | `287:11678` | Semantic token tables |

**Do not edit:** Color System `258:4823`, Color Tokens `263:9588` (example library frames).

### Color Tokens sections to maintain

Ensure table rows exist for all Colors variables, including:

- **Surface:** bg, surface, surface-subtle, surface-input
- **Text:** text, text-body, text-gray-*, text-inverse, text-critical
- **Icon:** icon, icon-inverse, icon-subtle, icon-critical, icon-accent, icon-gray-light, icon-gray-medium
- **Border:** border, border-gray-light, border-gray-medium, border-gray-strong, border-inverse
- **Button:** button-primary, button-primary-on, button-primary-hover, button-secondary-hover
- **Badge:** background, text, pending-*, success-*
- **Pin:** note, implement, warning, question, suggestion
- **Link:** link

Row pattern: `Row` → Col 3 `Code block` (WEB string), Col 1/4 `_token base` swatches bound to local Colors var with explicit Light/Dark mode.

### Remote color rebind map (examples)

When walking docs frames, rebind remote COLOR vars to local when names align:

| Remote (example library) | Local VibeCheck |
|--------------------------|-----------------|
| `Text/text` | `text/text` |
| `Text/text-body` | `text/text-body` |
| `Border/border-gray-light` | `border/border-gray-light` |
| `Surface/surface-subtle` | `surface/surface-subtle` |
| `Gray/30` | `gray/gray-200` |

Leave remote typography, radius, font-family, blend/alpha, and premium button vars unless user expands scope.

---

## Mapped components (audit list)

All entries in [`design-system/figma-components.json`](design-system/figma-components.json) `components[]`.

Key toolbar/card nodes:

| Component | Node ID |
|-----------|---------|
| Main Toolbar | `5:98` |
| Toolbar Tool Button | `5:64` |
| Toolbar Divider | `5:97` |
| Toolbar Tip / Hotkey | `163:1452`, `160:215` |
| Card / Send | `179:737` |
| Card / Apply Suggestion | `236:2946` |
| Card / Header Icon | `203:1208` |
| Card / Kind Chip | `181:761` |
| Badge | `254:8099` |
| Feedback Pin | `4:76` |

**Skip:** Searchbar `302:14663`

---

## CSS consumer files

| File | What it styles |
|------|----------------|
| `app/components/vibe-check/vibe-check.element.css` | Main toolbar pill, tool buttons, tips, color bar |
| `app/components/_variables.css` | `--theme-*` aliases → `--vc-*` |
| `app/components/_variables_light.css` | Light scheme overrides |
| `app/components/_variables_dark.css` | Dark scheme overrides |
| `app/vibecheck/feedback-styles.js` | Cards, pins, send, apply, header icons, menus |
| `extension/popup/tokens.css` | Generated; do not edit by hand |

---

## CSS vs Figma traps

These caused real regressions after token dumps. Always verify bindings on the Figma node, not assumptions.

### `surface` vs `surface-subtle`

After `gray-200` / `gray-700` cascade, **dark mode values diverged**:

| Token | Dark hex | Alias |
|-------|----------|-------|
| `--vc-surface` | `#2e3138` | gray-800 |
| `--vc-surface-subtle` | `#40454f` | gray-700 |

**Figma bindings:**

| Component | Fill binding | Correct CSS |
|-----------|--------------|-------------|
| Main Toolbar `5:98` | `surface/surface` | `--vc-surface` |
| Toolbar Tip Hotkey `160:215` | `surface/surface` | `--vc-surface` |
| Card / Send empty | `surface/surface-subtle` | `--vc-surface-subtle` |
| Kind chip hover | `surface/surface-subtle` | `--vc-surface-subtle` |

Using `--vc-surface-subtle` on the toolbar made it look washed out.

### Apply Suggestion vs toolbar icons

| Component | Default icon | Hover fill | Active fill |
|-----------|--------------|------------|-------------|
| Toolbar Tool Button Default | `--vc-icon-subtle` | `--vc-button-secondary-hover` | `--vc-button-primary` |
| Card / Apply Suggestion | `--vc-text-gray-light` | `--vc-button-secondary-hover` | `--vc-surface-subtle` (icon: `--vc-text-gray-medium`) |
| Card / Header Icon Default | `--vc-text-gray-light` | `--vc-surface-subtle` | pin/active variants |

Do **not** switch Apply Suggestion to `--vc-icon-subtle` unless the Figma node is bound to `icon/icon-subtle`.

### Theme aliases (`_variables.css`)

| Alias | Typical binding |
|-------|-----------------|
| `--theme-icon_color` | `--vc-icon-subtle` |
| `--theme-icon_hover-bg` | `--vc-button-secondary-hover` |
| `--theme-icon_active-bg` | `--vc-button-primary` |
| `--theme-icon_active-color` | `--vc-icon-accent` |
| `--theme-bg` | `--vc-surface` |

---

## Parity files to touch after color changes

| File | When |
|------|------|
| `scripts/check-parity.mjs` | Changed hex assertions, new `--vc-*` in CSS checks |
| `design-system/cards-v2-contract.json` | Keys already in `resolvedTokenValues` |
| `design-system/CHANGELOG.md` | Every token sync pass |

---

## Retired / forbidden patterns

- **VibeCheck Component Colors** collection — removed; badge tokens live in VibeCheck Colors only.
- Legacy CSS names: `--vc-text-primary`, `--vc-bg-surface`, `--vc-action-primary`, `--vc-badge-pending-bg` (use `-background`).
- Grep repo (except bundles before rebuild) for stale `--vc-badge-*-bg` after sync.

---

## Pin variable IDs (contract)

From `cards-v2-contract.json` — Colors collection:

| Figma | Variable ID |
|-------|-------------|
| `pin/note` | `VariableID:3:29` |
| `pin/implement` | `VariableID:3:30` |
| `pin/warning` | `VariableID:3:31` |
| `pin/question` | `VariableID:3:32` |
| `pin/suggestion` | `VariableID:58:5` |

Use IDs only for contract parity checks; values still come from the live dump.

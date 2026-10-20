---
name: figma-color-tokens
description: >-
  Re-dump VibeCheck Figma color variables, sync design-system/tokens.json,
  regenerate CSS, fix Figma WEB syntax and color docs, and audit mapped
  component CSS bindings. Use when Figma variables change, tokens.json needs
  updating, color tokens drift, VibeCheck Colors dump, or after a Figma
  color-system edit.
---

# Figma color-token maintenance

Figma is the source of truth for **color values**. Code owns behavior. This skill covers **VibeCheck Primitives** and **VibeCheck Colors** only — not Dimensions, Typography, layout, or unmapped components.

## Guardrails

- **Always re-dump Figma at the start.** Never reuse hex values from an earlier chat.
- Edit only [`design-system/tokens.json`](design-system/tokens.json), then run `npm run design:sync`.
- **Never** hand-edit `design-system/generated/*` or `extension/popup/tokens.css`.
- Load **`figma-use`** before every `use_figma` call.
- If the dump disagrees with `tokens.json`, **the dump wins**.
- Do not commit unless the user asks.

## Quick checklist

```
- [ ] 1. Dump Primitives + Colors from Figma
- [ ] 2. Diff dump vs tokens.json
- [ ] 3. Fix Figma WEB code syntax (Colors collection)
- [ ] 4. Patch tokens.json + npm run design:sync
- [ ] 5. Update parity, contract, CHANGELOG
- [ ] 6. Update Color System + Color Tokens docs (color only)
- [ ] 7. Audit mapped components → patch CSS token names
- [ ] 8. npm run design:check (+ extension:build if CSS changed)
```

Details: [reference.md](reference.md)

---

## Step 1 — Dump Figma (mandatory)

**File:** `3UduCyltV7tmRYSnDqTEfA` (VibeCheck)

Use `use_figma` with `skillNames: "figma-use"`. Dump **VibeCheck Primitives** and **VibeCheck Colors** only.

For every variable capture:

| Field | Notes |
|-------|-------|
| `name` | Figma path, e.g. `gray/gray-200`, `surface/surface-subtle` |
| `id` | `VariableID:…` |
| Light hex | Resolved value in Light mode |
| Dark hex | Resolved value in Dark mode |
| Alias | Target primitive or semantic name if aliased |
| `codeSyntax.WEB` | Must be `var(--vc-{leaf})` |

**Dump script outline** (adapt as needed):

```js
function rgbToHex(c) {
  if (!c) return null;
  const r = Math.round(c.r * 255), g = Math.round(c.g * 255), b = Math.round(c.b * 255);
  return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('');
}
async function resolveHex(v, modeId) {
  const val = v.valuesByMode[modeId];
  if (!val) return null;
  if (val.type === 'VARIABLE_ALIAS') {
    const alias = await figma.variables.getVariableByIdAsync(val.id);
    return alias ? resolveHex(alias, modeId) : null;
  }
  if (typeof val === 'object' && 'r' in val) return rgbToHex(val);
  return val;
}
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const out = [];
for (const coll of collections) {
  if (!['VibeCheck Primitives', 'VibeCheck Colors'].includes(coll.name)) continue;
  for (const id of coll.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    const byMode = {};
    for (const m of coll.modes) {
      byMode[m.name] = await resolveHex(v, m.modeId);
    }
    out.push({
      collection: coll.name,
      name: v.name,
      id: v.id,
      web: v.codeSyntax?.WEB || '',
      byMode,
    });
  }
}
return out;
```

---

## Step 2 — Diff vs tokens.json

Compare dump to [`design-system/tokens.json`](design-system/tokens.json):

- **Primitives** → `tokens.primitives` (leaf keys: `gray-200`, not `gray/gray-200`)
- **Colors Light** → `tokens.color.light`
- **Colors Dark** → `tokens.color.dark`

Note: new variables, removed variables, hex changes, alias cascades (e.g. `gray-200` change ripples into `surface-subtle`).

Naming rules: [reference.md → Name mapping](reference.md#name-mapping)

---

## Step 3 — Fix Figma WEB syntax

On **this file** (not example libraries), every Colors variable WEB syntax must be:

```
var(--vc-{css-leaf})
```

Common mistakes to fix in Figma:

| Variable | Wrong WEB | Correct WEB |
|----------|-----------|-------------|
| `border/border-gray-light` | `var(--vc-border)` | `var(--vc-border-gray-light)` |
| `border/border-gray-medium` | `var(--vc-border)` | `var(--vc-border-gray-medium)` |
| `border/border-gray-strong` | `var(--vc-border)` | `var(--vc-border-gray-strong)` |
| `border/border-inverse` | `var(--vc-border)` | `var(--vc-border-inverse)` |
| `icon/icon-subtle` | `var(--vc-icon)` | `var(--vc-icon-subtle)` |
| `icon/icon-gray-light` | `var(--vc-text-gray-light)` | `var(--vc-icon-gray-light)` |
| `icon/icon-gray-medium` | `var(--vc-text-gray-medium)` | `var(--vc-icon-gray-medium)` |
| `badge/pending - bg` | `var(--vc-badge-pending-bg)` | `var(--vc-badge-pending-background)` |

Set via Plugin API: `variable.setVariableCodeSyntax('WEB', 'var(--vc-…)')`.

---

## Step 4 — Patch tokens.json + sync

1. Update `primitives`, `color.light`, `color.dark` in [`design-system/tokens.json`](design-system/tokens.json).
2. Add new semantic tokens that exist in Figma; **do not invent** tokens Figma lacks.
3. Keep `figma.collections` aligned with live local collections (Colors + Primitives for this skill).
4. Run:

```bash
npm run design:sync
```

---

## Step 5 — Parity, contract, changelog

1. **Parity** — [`scripts/check-parity.mjs`](scripts/check-parity.mjs): update assertions for changed hex values and new `--vc-*` names (token generator check, toolbar/feedback CSS checks).
2. **Contract** — [`design-system/cards-v2-contract.json`](design-system/cards-v2-contract.json): update `resolvedTokenValues` **only** for keys already listed there.
3. **Changelog** — [`design-system/CHANGELOG.md`](design-system/CHANGELOG.md): short dated entry (token dump, what changed, doc/CSS follow-through).

---

## Step 6 — Color docs (color bindings only)

**Frames** (Styleguide):

| Frame | Node ID |
|-------|---------|
| Color System — VibeCheck | `264:7594` |
| Color Tokens — VibeCheck | `287:11678` |

**Do:**

- Primitive tiles: HEX labels match bound primitive values (`gray-200`, `gray-700`, etc.).
- Color Tokens: every Colors variable has a table row (clone existing `Row` pattern: Code block + `_token base` Light/Dark).
- Bind `_token base` fills to **local** Colors variables (Light column = Light mode, Dark column = Dark mode).
- Code block text = WEB syntax (`var(--vc-icon-subtle)`, etc.).
- Rebind **remote COLOR** bindings on these frames to local Primitives/Colors when a name match exists.
- Remove any mention of retired collections (e.g. VibeCheck Component Colors).

**Do not:**

- Edit example frames `258:4823` or `263:9588`.
- Create typography collections or unbind remote typography / radius / font-family.

**Docs binding pattern** (`_token base` instances):

```js
const colorsColl = await figma.variables.getVariableCollectionByIdAsync('VariableCollectionId:3:3');
const paint = figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: { r: 1, g: 1, b: 1 } },
  'color',
  await figma.variables.getVariableByIdAsync('VariableID:…'),
);
instance.fills = [paint];
instance.setExplicitVariableModeForCollection(colorsColl, '3:1'); // Light
// Dark column uses mode '3:2'
```

---

## Step 7 — Mapped component audit

Manifest: [`design-system/figma-components.json`](design-system/figma-components.json)

For **each** mapped component `nodeId`:

1. Walk `boundVariables` on fills/strokes (Design page tool components).
2. Map each binding to its WEB name (`var(--vc-…)`).
3. Diff against code CSS:

| File | Surfaces |
|------|----------|
| [`app/components/vibe-check/vibe-check.element.css`](app/components/vibe-check/vibe-check.element.css) | Toolbar, tips, color bar |
| [`app/components/_variables.css`](app/components/_variables.css) | Theme aliases |
| [`app/vibecheck/feedback-styles.js`](app/vibecheck/feedback-styles.js) | Cards, pins, send, apply, header icons |

**Rules:**

- Patch **token names**, not hardcoded hex (unless Figma node is unbound).
- Follow the **Figma binding**, not habit — especially `surface` vs `surface-subtle` (see traps in reference).
- **Out of scope:** Searchbar `302:14663`, WIP frames, unmapped components.
- If a manifest `nodeId` no longer exists → **stop and ask**.

---

## Step 8 — Verify

```bash
npm run design:check
```

If toolbar or feedback CSS changed:

```bash
npm run extension:build
```

Reload the extension and spot-check toolbar + card surfaces in light/dark when UI changed.

---

## Stop and ask

- New local color collection appeared in Figma
- Figma refuses WEB syntax or docs mutation (Smart Mode block)
- Docs row clone/bind returns 0 updates and cause is unclear
- Remote COLOR binding with no local analogue
- Mapped component nodeId missing from Figma
- Component Colors–style duplicate collection reappears with live consumers

## Out of scope

- VibeCheck Dimensions / Typography token sync
- Layout, geometry, variant axes, markup structure
- Cards v1 deletion, inventing new components
- Upstream VisBug merges

## Additional resources

- [reference.md](reference.md) — file key, naming table, doc IDs, CSS traps, consumer list

# sync-figma-icons reference

## Figma file

| Item | Value |
|------|--------|
| File | [VibeCheck](https://www.figma.com/design/3UduCyltV7tmRYSnDqTEfA/VibeCheck) |
| `fileKey` | `3UduCyltV7tmRYSnDqTEfA` |
| Icons section | `341:16410` |
| **New Icons** (staging) | `341:17814` |
| **Toolbar icons** | `341:16411` |
| **UI icons** | `341:17324` |

## Code homes

| Figma bucket | Module | Pattern |
|--------------|--------|---------|
| Toolbar icons | `app/components/vibe-check/vibe-check.icons.js` | `export const name = \`<svg viewBox="0 0 24 24"…>\`` |
| UI icons | `app/vibecheck/card-icons.js` | Path string in `PATHS` + `cardIcon(name, size)` |
| Registry (toolbar names) | `design-system/figma-components.json` | `Toolbar Icon` → `variants.Name` |

UI helpers:

- `cardIcon(name, size = 16)` — always `viewBox="0 0 24 24"`; `size` is render width/height only.
- Figma-name aliases on `PATHS` (e.g. `arrowUpSm`, `checkCircle`, `xSmall`).

## Naming

| Figma component name | Code key |
|----------------------|----------|
| `Arrow up sm` | `arrowUpSm` (also action alias `send` when used for send) |
| `X circle` | `xCircle` |
| `X small` | `xSmall` / action `close` |
| `Check circle` | `checkCircle` / action `resolve` |
| `Dots horizontal` | `dotsHorizontal` / action `more` |
| `Chevron down` | `chevronDown` / action `chevron` |
| `Apply content suggestion` | `applyContentSuggestion` / action `apply` |
| `Arrow diagonal out` | `arrowDiagonalOut` |
| `Arrow diagonal in` | `arrowDiagonalIn` |
| `Logo zendesk` | `logo_zendesk` (toolbar export style) |

Rules:

- Figma title case / spaces → camelCase for UI `PATHS` keys.
- Toolbar exports often use existing VisBug-style names (`guides`, `inspector`, `comments`, …); prefer matching **existing** export names when the tool already exists.
- Action keys (`send`, `close`, …) stay stable for call sites; add Figma-name aliases pointing at the same path.

## Bucket heuristics (suggest only — always ask)

| Signal | Suggest |
|--------|---------|
| Used on toolbar / tool button / `data-tool` | **Toolbar icons** |
| Used on cards, panel, search clear, menus, chips | **UI icons** |
| Both or unclear | Ask; do not move until answered |

## SVG normalize checklist

1. Component frame is 24×24 (fail if not).
2. Output paths use `fill="currentColor"` (or no fill + CSS `currentColor`).
3. Remove `preserveAspectRatio="none"` wrappers from MCP export; keep clean path markup.
4. Do not leave `transform="scale(…)"` unless the user confirms a non-24 source (prefer fixing Figma instead).

## Evaluation notes

- Compare **library** components, not every instance override.
- `send` must track **Arrow up sm**, not a paper plane (paper plane removed from library).
- Panel search clear uses `xCircle`; filter tool uses `funnel`; panel more uses `more` / dots.

# Audit sources — read live each run

Do **not** hardcode collection lists or token counts. Read these files at audit start.

## Figma

| Item | Where to read |
| --- | --- |
| File key | `design-system/tokens.json` → `fileKey` (currently `3UduCyltV7tmRYSnDqTEfA`) |
| File name | `tokens.json` → `fileName` |
| Expected collections | `tokens.json` → `figma.collections` (read current list) |
| Effect style names | `tokens.json` → `figma.effectStyles` |
| CSS prefix | `tokens.json` → `cssPrefix` (typically `--vc`) |

### Figma pages and documentation nodes

| Page / frame | Node ID | Purpose |
| --- | --- | --- |
| Styleguide | `258:4085` | Color system + token tables |
| Color Tokens | `287:11678` | Semantic color documentation |
| Design | `1:3` | Cover, Foundations, components |
| Foundations | `3:62` | Specimen labels (may ≠ live variables) |
| Toolbar Flows | `1:4` | Flows (not token definitions) |

URL pattern: `https://www.figma.com/design/{fileKey}/VibeCheck?node-id={id-with-dashes}`

### MCP tools

| Tool | Use |
| --- | --- |
| `use_figma` | Dump variables, styles, page structure (after figma-use skill) |
| `get_metadata` | Frame tree for Styleguide / Foundations |
| `get_variable_defs` | Spot-check resolved vars on a node (supplement only) |

## Code — canonical

| Path | Role | Generated? |
| --- | --- | --- |
| `design-system/tokens.json` | Source of truth | No |
| `design-system/generated/tokens.css` | `:root`/`:host` + dark media | Yes |
| `design-system/generated/tokens-light.css` | Forced light `:host` | Yes |
| `design-system/generated/tokens-dark.css` | Forced dark `:host` | Yes |
| `design-system/generated/tokens.js` | Overlay injection strings | Yes |
| `extension/popup/tokens.css` | Popup copy of tokens.css | Yes |
| `design-system/figma-components.json` | Component mapping manifest | No |
| `design-system/cards-v2-contract.json` | Cards v2 contract | No |

Regenerate: `npm run design:sync`  
Drift check: `npm run design:check`

## Code — theme and runtime

| Path | Role |
| --- | --- |
| `app/components/_variables.css` | `--theme-*` adapters, `--layer-*`, Open Props |
| `app/components/_variables_light.css` | Forced light host theme |
| `app/components/_variables_dark.css` | Forced dark host theme |
| `app/components/styles.store.js` | Theme sheet wiring |
| `app/utilities/scheme.js` | `color-scheme` attribute |
| `app/vibecheck/feedback-styles.js` | Primary `--vc-*` consumer; defines motion tokens |

## Code — component surfaces (usage audit)

| Surface | Paths |
| --- | --- |
| Feedback overlay | `app/vibecheck/feedback-styles.js`, `feedback-ui.js`, `components.js` |
| Popup | `extension/popup/popup.css`, `popup.js` |
| Toolbar | `app/components/vibe-check/vibe-check.element.css`, `.js`, `_light.css`, `_dark.css` |
| Metatip | `app/components/metatip/metatip.element.css` |
| Hotkey map | `app/components/hotkey-map/base.element.css` |
| Selection | `app/components/selection/*.css`, `*.js` |

## Cross-reference docs

| Doc | Use |
| --- | --- |
| `design-system/README.md` | Contract and pipeline |
| `docs/typography-figma-code-map.md` | Typography mapping (verify live) |
| `design-system/CHANGELOG.md` | Prior decisions |

## Output paths

| File | Role |
| --- | --- |
| `docs/token-audit/01-figma-token-inventory.md` | Working |
| `docs/token-audit/02-code-token-inventory.md` | Working |
| `docs/token-audit/03-token-mapping.md` | Working |
| `docs/token-audit/04-token-comparison.md` | Working |
| `docs/token-audit/05-component-usage-audit.md` | Working |
| `docs/token-audit/06-final-token-audit.md` | **Required publish** |

## Script cache (gitignored)

| Path | Content |
| --- | --- |
| `.cursor/skills/figma-code-alignment/.cache/figma-inventory.json` | Live Figma dump |
| `.cursor/skills/figma-code-alignment/.cache/code-inventory.json` | Scanner output |
| `.cursor/skills/figma-code-alignment/.cache/mapping.json` | Compare output |

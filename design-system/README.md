# VibeCheck design contract

Figma is the visual source of truth. The codebase is the behavioral source of truth for **shipped** UI. Shared names, variants, dimensions, and color tokens keep the two in lockstep.

Cards v2 (Comment / Annotation / Wording redesign) is implemented. Keep these four layers in lockstep whenever that work moves:

| Layer | Where | Owns |
| --- | --- | --- |
| **1. Figma components** | Cards v2 on the Design page (`175:688`) | Visual contract: layout, tokens, variant axes |
| **2. Behavior Contract** | Figma frame `07 · Behavior Contract` (`222:1720`) | Filtering, timestamps, submission, Wording apply/resolve/thread behavior, and overflow |
| **3. Machine-readable manifest** | `figma-components.json` (shipped) + `cards-v2-contract.json` (v2 IDs, axes, behavior) | Node IDs, variant maps, token IDs for implementation |
| **4. Changelog** | Figma `08 · Changelog` (`222:2234`) + `design-system/CHANGELOG.md` | Decisions and deltas |

## Who owns what

| Source | Owns |
| --- | --- |
| **Figma** (`VibeCheck` file, Design page) | Visuals, layout, spacing, typography, elevation, and presentational states (Default / Hover / Active / Open / Resolved / Compose / Detail) |
| **Code** | Storage, events, security, authentication, and data behavior |
| **`design-system/tokens.json`** | Canonical light/dark token values consumed by both surfaces after generation |
| **`design-system/figma-components.json`** | Shipped mapping: Figma node → renderer → CSS selector → `data-vc-component` |
| **`design-system/cards-v2-contract.json`** | Cards v2 node IDs, axes, implementation status, and behavior notes |

Do not restyle a mapped component in CSS or markup without updating the matching Figma node (or tokens). Do not delete runtime fields, event IDs, or security controls to match an incomplete mock.

## Code Connect

Official Figma Code Connect is currently unavailable: the library has no published components. This repository manifest is the mapping until a published library exists. `get_code_connect_suggestions` on the Design page returns no mappings.

## Token pipeline

1. Edit `design-system/tokens.json` (or the matching Figma variables, then copy values here).
2. Run `npm run design:sync` to emit:
   - `design-system/generated/tokens.css` — `:root, :host` custom properties for the popup and default toolbar theme
   - `design-system/generated/tokens-light.css` / `tokens-dark.css` — `:host` properties for the toolbar theme sheets
   - `design-system/generated/tokens.js` — injected into the feedback overlay (page layer), including `figtreeFontFaceCss()`
   - `extension/popup/tokens.css` — copy inside the extension package (includes Figtree `@font-face`)
   - Syncs `design-system/fonts/figtree/` → `extension/fonts/figtree/`
3. Run `npm run design:check` (also `npm run test:parity`) before review. It fails when generated files drift, mapped renderers are missing, or helper markup does not emit `data-vc-component`.
4. For a full Figma ↔ code **token-value** alignment audit (variables, styles, usage, final report), ask the agent to run the **figma-code-alignment** skill (`.cursor/skills/figma-code-alignment/`).

Typography primitives + semantic text styles live under `tokens.json` → `font`. See [docs/typography-figma-code-map.md](../docs/typography-figma-code-map.md) for the full Figma ↔ code map.

Never edit generated files by hand.

## Mapping manifest

Every Figma family in `figma-components.json` records:

- `nodeId` and Figma URL
- `code.source` + `renderer`
- CSS `selector`
- stable `data-vc-component` name
- variant attributes (`data-style`, `data-state`, `data-type`, `data-kind`, `data-vc-type`)

Runtime markup must emit those attributes. Hover/Focus states are CSS-only; Active/Open/Resolved/Compose/Detail are data attributes.

## Future-change recipe

When a designer (or you) changes one component:

1. Provide a **component-specific Figma URL** (file + `node-id`), not just the page.
2. Read that node with design context (`get_design_context` / Figma MCP).
3. Look the node up in `design-system/figma-components.json`.
4. Change **canonical tokens** (`tokens.json`) and/or the **mapped renderer** (`code.source` / `renderer`).
5. Run `npm run design:sync`, then `npm run design:check`.
6. Verify the mapped surface: toolbar, pin, card, panel, or popup.
7. If Figma component-set IDs changed, update `nodeId` in the manifest in the same change.

Example: a Button radius change lives in Figma `4:18` and `--vc-radius-8`. A new card field is added in Figma on the Note family, then in `renderNoteCard`, never as a one-off in `feedback-ui.js` event logic.

# VibeCheck typography — Figma ↔ code map

Canonical reference for how product typography in Figma connects to CSS custom properties in code.

| Layer | Location |
| --- | --- |
| Figma variables | Collection **VibeCheck Typography** |
| Figma text styles | `VibeCheck/Heading/*`, `VibeCheck/Body/*`, `VibeCheck/Comp/*` |
| Source tokens | `design-system/tokens.json` → `font` |
| Generated CSS/JS | `npm run design:sync` → `design-system/generated/*`, `extension/popup/tokens.css` |
| Fonts (self-hosted) | `design-system/fonts/figtree/*.woff2` (OFL) → copied to `extension/fonts/figtree/` |
| Overlay consumers | `app/vibecheck/feedback-styles.js` (+ `@font-face` injected in `feedback-ui.js`) |
| Popup consumers | `extension/popup/popup.css` |

---

## Primitive tokens

| Figma variable | CSS custom property | Value |
| --- | --- | --- |
| `font-family/primary` | `--vc-font-family` | `Figtree, system-ui, …` |
| `font-size/{n}` | `--vc-font-size-{n}` | `8`–`80` px scale |
| `font-weight/regular` | `--vc-font-weight-regular` | `400` |
| `font-weight/medium` | `--vc-font-weight-medium` | `500` |
| `font-weight/semibold` | `--vc-font-weight-semibold` | `600` |
| `font-weight/bold` | `--vc-font-weight-bold` | `700` |
| `line-height/{n}` | `--vc-line-height-{n}` | paired px scale |
| `letter-spacing/normal` | `--vc-letter-spacing-normal` | `0px` |
| `letter-spacing/tight` | `--vc-letter-spacing-tight` | `-0.5px` |

---

## Semantic text styles → CSS

Use as `font: var(--vc-text-…);`. For Heading/LG also set `letter-spacing: var(--vc-text-heading-lg-letter-spacing);`.

Comp styles use **cap-height vertical trim** in Figma only — not replicated in CSS.

| Figma text style | CSS shorthand | Weight | Size / LH | Tracking |
| --- | --- | --- | --- | --- |
| `VibeCheck/Heading/XXL` | `--vc-text-heading-xxl` | bold 700 | 32 / 40 | normal |
| `VibeCheck/Heading/XL` | `--vc-text-heading-xl` | bold 700 | 24 / 32 | normal |
| `VibeCheck/Heading/LG` | `--vc-text-heading-lg` | medium 500 | 20 / 28 | tight (−0.5px) |
| `VibeCheck/Heading/MD` | `--vc-text-heading-md` | semibold 600 | 16 / 24 | normal |
| `VibeCheck/Heading/SM` | `--vc-text-heading-sm` | semibold 600 | 14 / 20 | normal |
| `VibeCheck/Heading/XS` | `--vc-text-heading-xs` | semibold 600 | 12 / 16 | normal |
| `VibeCheck/Heading/XXS` | `--vc-text-heading-xxs` | semibold 600 | 10 / 14 | normal |
| `VibeCheck/Body/LG` | `--vc-text-body-lg` | regular 400 | 20 / 28 | normal |
| `VibeCheck/Body/MD` | `--vc-text-body-md` | regular 400 | 16 / 24 | normal |
| `VibeCheck/Body/SM` | `--vc-text-body-sm` | regular 400 | 14 / 20 | normal |
| `VibeCheck/Body/XS` | `--vc-text-body-xs` | regular 400 | 12 / 16 | normal |
| `VibeCheck/Body/XXS` | `--vc-text-body-xxs` | regular 400 | 10 / 14 | normal |
| `VibeCheck/Comp/LG` | `--vc-text-comp-lg` | semibold 600 | 20 / 28 | normal |
| `VibeCheck/Comp/MD` | `--vc-text-comp-md` | semibold 600 | 16 / 24 | normal |
| `VibeCheck/Comp/SM` | `--vc-text-comp-sm` | semibold 600 | 14 / 20 | normal |
| `VibeCheck/Comp/XS` | `--vc-text-comp-xs` | semibold 600 | 12 / 16 | normal |

Each style also emits `--vc-text-{name}-letter-spacing`.

---

## Component map (Figma → code)

| Figma component | Layer / role | Figma style | Code selector / surface | CSS token |
| --- | --- | --- | --- | --- |
| Feedback Pin Button | Number | Comp/SM | `#vibecheck-layer .vc-pin` | `--vc-text-comp-sm` |
| Item Pin | Number | Body/XS | (card selected / pin label chrome via related selectors) | `--vc-text-body-xs` |
| Card / Selected Item | Label | Heading/XS | `.vc-selected-item` | `--vc-text-heading-xs` |
| Card / Type Selector | Label | Heading/XS | `.vc-type-trigger` | `--vc-text-heading-xs` |
| Card / Type Menu Item | Label default | Body/XS | `.vc-type-menu-item` | `--vc-text-body-xs` |
| Card / Type Menu Item | Label selected | Heading/XS | `.vc-type-menu-item[aria-checked="true"]` | `--vc-text-heading-xs` |
| Card / Overflow Item | Label | Body/XS | `.vc-overflow-menu button` | `--vc-text-body-xs` |
| Card / Annotation Type Chip | Label | Heading/XS | `.vc-kinds button` | `--vc-text-heading-xs` |
| Card / Status Badge | Label | Heading/XS | `.vc-badge` | `--vc-text-heading-xs` |
| Card / Text Action | Label | Heading/XS | header / text actions (Heading/XS family) | `--vc-text-heading-xs` |
| Card / Input Field | Value | Body/SM | `.vc-field` inputs / textareas | `--vc-text-body-sm` |
| Card / ComboField | Value | Body/SM | `.vc-combo-part` inputs / textareas | `--vc-text-body-sm` |
| Card / ComboField | Status / error | Body/XXS | `.vc-field-message` | `--vc-text-body-xxs` |
| Card / Quote | Title / by / User | Heading/XXS | `.vc-quote-heading` | `--vc-text-heading-xxs` |
| Card / Quote | Body | Body/SM | `.vc-quote-body` | `--vc-text-body-sm` |
| Card / Reply | Name | Heading/XXS | `.vc-reply-meta strong` | `--vc-text-heading-xxs` |
| Card / Reply | Timestamp | Body/XXS | `.vc-reply-meta time` | `--vc-text-body-xxs` |
| Card / Reply | Body | Body/XS | `.vc-reply-body` | `--vc-text-body-xs` |
| Card / Wording (Detail body) | Body | Body/SM | field / quote body paths | `--vc-text-body-sm` |
| Card / Comment · Annotation | Compose/detail body | Body/SM | same field / body tokens | `--vc-text-body-sm` |
| Button | Label | Heading/XS | `extension/popup/popup.css` buttons | `--vc-text-heading-xs` |
| Notes Panel | Title | Heading/SM | `.vc-panel-head` | `--vc-text-heading-sm` |
| Notes Panel | Collapse control | Heading/SM | `.vc-collapse` | `--vc-text-heading-sm` |
| Notes Panel Item | Thread / author / reply count | Heading/XXS | `.vc-item-number`, `.vc-item-author strong`, `.vc-reply-count` | `--vc-text-heading-xxs` |
| Notes Panel Item | Context / time | Body/XXS | `.vc-item-context`, `.vc-item-author span` | `--vc-text-body-xxs` |
| Notes Panel Item | Message | Body/XS | `.vc-item-message` | `--vc-text-body-xs` |
| Notes Panel Chip | Label | Heading/XS | panel filter chips (Heading/XS) | `--vc-text-heading-xs` |
| Avatar | Initial | Heading/XXS | `.vc-avatar` | `--vc-text-heading-xxs` |
| Search Field | Value | Body/XS | `.vc-panel-search input` | `--vc-text-body-xs` |
| Toolbar Search Popout | Placeholder | Body/SM | search popout / field Body/SM | `--vc-text-body-sm` |
| Account & Inbox Popup | Title | Heading/LG | `popup.css` `h1` | `--vc-text-heading-lg` |
| Account & Inbox Popup | Section labels | Heading/XS | `popup.css` `h2` | `--vc-text-heading-xs` |
| Account & Inbox Popup | Status / lede | Body/SM | `body`, `.lede` | `--vc-text-body-sm` |
| Account & Inbox Popup | Fields / labels | Body/XS | `label`, `input` | `--vc-text-body-xs` |
| Inbox Item | Title | Heading/XS | `#inbox li` / Inbox Item | `--vc-text-heading-xs` |
| Inbox Item | Meta | Body/XS | `#inbox li span` | `--vc-text-body-xs` |

Legacy Figma styles (`Body/13`, `Label/11`, `Title/13`, `Meta/10`, `Heading/18`) are retired for product UI; do not map new code to them.

---

## How to change typography safely

1. Update Figma variable and/or text style.
2. Mirror values in `design-system/tokens.json` (`font` section).
3. Run `npm run design:sync` (and `npm run design:check`).
4. Point component CSS at the matching `--vc-text-*` token — avoid raw `px` weights/sizes in overlay/popup.
5. Update this document if a component↔style link changes.

## Font loading

- **Popup:** `@font-face` embedded in `extension/popup/tokens.css` with `url(../fonts/figtree/…)`.
- **Page overlay:** `figtreeFontFaceCss()` from `tokens.js`, URLs via `chrome.runtime.getURL('fonts/figtree/…')` in `feedback-ui.js` (`fonts/figtree/*` is web-accessible).
- **Local app demo:** files also under `app/fonts/figtree/` for `/fonts/figtree/` fallback.

## OpenType — single-storey a (`ss01`)

Figtree stylistic set 1 replaces the double-storey **a** with a single-storey **a**.

| Surface | How |
| --- | --- |
| Code | `--vc-font-feature-settings: "ss01" 1` on `#vibecheck-layer` and popup `body` |
| Fonts | Self-hosted Figtree woff2 **with GSUB `ss01`** (not a latin-only subset strip) |
| Figma | Enable manually on each text style: Type settings → Details → **Stylistic set 1**. The Plugin API cannot write OpenType features (read-only). Style descriptions note this. |

# 05 — Component token usage audit

Date: 2026-09-21

Sources: code under `app/vibecheck/`, `app/components/vibe-check/`, `extension/popup/`, `app/components/metatip/`, `app/components/hotkey-map/`, `app/components/selection/`, plus theme adapters in `app/components/_variables.css`. Cross-checked against `design-system/tokens.json` and prior audit docs 01–04.

**Method:** Inspect representative high-use surfaces for `var(--vc-*)`, `var(--theme-*)`, primitives, and hardcoded CSS. No files were modified.

## Component coverage map

| Requested category | Repository stand-in(s) |
|---|---|
| Buttons | Popup `button`, toolbar tools, `.vc-send`, `.vc-kinds button`, overflow/header icon buttons |
| Inputs | Popup `input`, `.vc-field` textarea/input, `.vc-panel-search` |
| Selects | `.vc-type-selector` / `.vc-type-menu` (custom) |
| Modals | `.vc-panel` (Notes), menus/popovers |
| Navigation | Main toolbar (`vibe-check`) |
| Tables | **Not present** |
| Cards | `.vc-card` + Pins |
| Alerts | `[role="alert"].vc-field-message` |
| Typography | Hardcoded font metrics in feedback + popup; metatip/hotkey |
| Layout primitives | Spacing/radius/size tokens on panel/card/toolbar |

## Summary

| Finding class | Count in table (approx.) |
|---|---|
| Correct usage (None) | 8 |
| Wrong token | 4 |
| Primitive where semantic expected | 2 |
| Hardcoded (should token) | 14 |
| Inconsistent same purpose | 5 |
| Theme / dark-mode | 5 |
| Bypass token system | 3 |
| Accessibility / contrast risks | 6 |
| Coverage N/A | 4 |

Overall: **Feedback overlay and popup** are the strongest `--vc-*` consumers. **Metatip, hotkey-map, and selection** largely bypass the design-system palette via `--theme-color` / neon accents. Main risks are **primitive usage on hover/scrollbars**, **non-token fallbacks**, **hardcoded type/radius**, and **low-contrast gray-light text**.

---

## Findings

| Component | Property | Current value/token | Expected token | Issue | File and line |
|---|---|---|---|---|---|
| Feedback Pin | background (by type) | var(--vc-pin-note\|implement\|warning\|question\|suggestion) | same (component tokens) | None — correct semantic/component token usage | app/vibecheck/feedback-styles.js:144–153 |
| Feedback Card surface | background / shadow | var(--vc-surface) / var(--vc-shadow-card) | same | None — correct semantic + elevation tokens | app/vibecheck/feedback-styles.js:188–191 |
| Feedback Alert (field message) | color | var(--vc-text-critical) | same | None — correct critical text token on role=alert | app/vibecheck/feedback-styles.js:693 |
| Popup Button (primary) | background / color | var(--vc-button-primary) / var(--vc-button-primary-on) | same | None — correct component button tokens | extension/popup/popup.css:45–46 |
| Popup Input | border / bg / color | var(--vc-border) / var(--vc-surface-input) / var(--vc-text) | same | None — correct semantic input tokens | extension/popup/popup.css:33–38 |
| Notes Panel | width / shadow / radius | var(--vc-size-panel) / var(--vc-shadow-panel) / var(--vc-radius-12) | same | None — correct sizing/elevation/radius tokens | app/vibecheck/feedback-styles.js:869–879 |
| Badge Applied | background / color | var(--vc-badge-success-*) | same | None — correct badge component tokens | app/vibecheck/feedback-styles.js:742–744 |
| Toolbar tool (active) | background / icon | var(--theme-icon_active-bg) → --vc-button-primary; var(--theme-icon_active-color) → --vc-icon-accent | same (via theme adapter) | None — correct via --theme-* adapters to --vc-* | app/components/vibe-check/vibe-check.element.css:87–96 |
| Card header icon (Active) | background | var(--vc-pin-note) | var(--vc-card-accent) or type-specific pin token | Wrong token — Active header icon always uses Note purple regardless of card type | app/vibecheck/feedback-styles.js:307–309 |
| Combo field focus (second) | focus ring (box-shadow) | var(--vc-pin-note) | semantic focus/border token (e.g. --vc-border or link); or --vc-card-accent if type-tinted focus is intended | Wrong/overloaded token — pin/note color used as generic focus ring | app/vibecheck/feedback-styles.js:484 |
| Popup #signout button | background | var(--vc-text-gray-light) | --vc-button-secondary-hover or --vc-surface-subtle (+ text token) | Wrong token — text color token used as button fill | extension/popup/popup.css:59 |
| Toolbar tip hotkey chip | color (fallback) | var(--vc-text, #111827) | --vc-text only (fallback #111827 ≠ token #0b0c0e / dark #f4f4f6) | Wrong fallback — hardcoded fallback conflicts with design-system text token | app/components/vibe-check/vibe-check.element.js:265,283 |
| Send button hover | background | var(--vc-purple-100) | --vc-button-secondary-hover or surface-subtle / type-tinted semantic | Primitive token used for interactive hover (styleguide: do not use primitives in UI) | app/vibecheck/feedback-styles.js:623–624 |
| Scrollable fields/panel | scrollbar-color / thumb | var(--vc-gray-500) | --vc-text-gray-medium or --vc-border-gray-medium (semantic) | Primitive gray used for chrome; should be semantic | app/vibecheck/feedback-styles.js:536,561 |
| Feedback Card | border-radius | 16px | --vc-radius-12 (closest) or new radius-16 token | Hardcoded radius; not in token scale (scale tops at 12 / full) | app/vibecheck/feedback-styles.js:190 |
| Feedback Card / menus | background fallback | var(--vc-surface, #1f2937) / #f0f2f4 | var(--vc-surface) without non-token fallback (or fallback = token HEX) | Hardcoded fallbacks diverge from tokens.json surface values | app/vibecheck/feedback-styles.js:188,359,389 |
| Type/overflow menus | color fallback | var(--vc-text, #f9fafb) / #111827 | var(--vc-text) with token-aligned fallback | Hardcoded text fallbacks ≠ --vc-text light/dark | app/vibecheck/feedback-styles.js:361,390 |
| Pin / fields / sends | typography | font: 700 12px/14px; 600 11px; 13px/18px; 10px… | Figma text styles (Body/13, Label/11, Meta/10, Title/13) — no code type tokens yet | Hardcoded type scale; bypasses missing typography tokens | app/vibecheck/feedback-styles.js:132,233,519,739,778,829–839 |
| Pin / borders | border-width | 2px / 1.5px / 1px | border-width tokens (none exist) or consistent spacing-derived rule | Hardcoded border widths; no border-width tokens in system | app/vibecheck/feedback-styles.js:129,471–488 |
| Send / apply / header icons | width/height | 28px / 24px | --vc-size-pin (28) or new size-icon-24 token | Hardcoded control sizes alongside tokenized spacing | app/vibecheck/feedback-styles.js:279–280,599–601,785–787 |
| Send disabled | opacity | 0.4 | --vc-opacity-resolved (0.45) or dedicated disabled opacity token | Hardcoded opacity inconsistent with --vc-opacity-resolved | app/vibecheck/feedback-styles.js:637 |
| Combo submitting | opacity | 0.75 | dedicated token or --vc-opacity-resolved | Hardcoded opacity; bypasses opacity token | app/vibecheck/feedback-styles.js:682 |
| Toolbar tip / search | box-shadow | 0 0.1em 4.5em hsla(0,0%,0%,15%); 0 2px 2px hsla(…) | --vc-shadow-panel / --vc-shadow-card / --vc-shadow-pin | Hardcoded shadows instead of elevation tokens | app/components/vibe-check/vibe-check.element.css:111,173; .js:287 |
| Toolbar tip | font-family | system-ui, -apple-system, … (inline) | var(--vc-font-family) | Hardcoded font stack duplicates token but bypasses var() | app/components/vibe-check/vibe-check.element.js:251 |
| Popup typography | font-size | 18px / 12px / 11px / 13px | typography tokens (missing) mapped to Heading/18, Label, Meta, Body | Hardcoded type sizes in popup | extension/popup/popup.css:5,16–18,49,70 |
| Popup secondary spacing | margin | 18px | --vc-spacing-16 or --vc-spacing-24 | Hardcoded margin not on spacing scale | extension/popup/popup.css:22 |
| Panel search | height | 32px | new size token or --vc-size-tool (36) if intentional | Hardcoded height outside size tokens | app/vibecheck/feedback-styles.js:987 |
| Toolbar root | font-size / radius | font-size: 16px; border-radius: 2em / 50% | --vc-font-family + type tokens; --vc-radius-full for pills | Hardcoded layout chrome; mixed em/% with tokenized tool size | app/components/vibe-check/vibe-check.element.css:29,36,60 |
| Card vs menus vs fields | corner radius | 16px vs --vc-radius-12 vs --vc-radius-8 | one radius token per surface role | Inconsistent radii for similar elevated surfaces | feedback-styles.js:190 vs 362,455,647 |
| Toolbar tool hover vs active press | background | hover: --theme-icon_hover-bg; :active: --vc-button-secondary-hover | same token for hover/press (both map to secondary-hover today in _variables) | Inconsistent indirection — hover uses theme adapter, :active uses --vc directly (same underlying token, fragile if adapters diverge) | app/components/vibe-check/vibe-check.element.css:80–84 |
| Disabled opacity | opacity | 0.4 (send) vs var(--vc-opacity-resolved) (fields/pins/badges) | --vc-opacity-resolved or separate disabled token used everywhere | Inconsistent disabled/resolved opacity treatment | feedback-styles.js:637 vs 155,216,501 |
| Menu surface fallbacks | background fallback | #1f2937 (darkish) vs #f0f2f4 (lightish) on same --vc-surface | single token-aligned fallback or none | Inconsistent light/dark fallbacks for same property | feedback-styles.js:188/359 vs 389 |
| Text gray roles | meta / placeholder / reply | --vc-text-gray-light vs --vc-text-gray-medium vs --vc-text | documented role mapping (Meta→gray-light, placeholder→gray-medium, body→text) | Mostly coherent but reply-body uses gray-medium while quote body uses --vc-text — verify intentional | feedback-styles.js:778 vs 838–839 |
| Theme adapters (_variables) | --theme-color / --theme-blue / --theme-purple | hotpink / hsl(188…) / hsl(267…) (+ dark hotpink variant) | map to --vc-* semantic accents or remove from product UI | Theme/dark: non-token brand colors; dark only partially remaps --theme-color | app/components/_variables.css:14–16,42–46 |
| Metatip | accent / links / outlines | var(--theme-color), var(--theme-blue), var(--theme-purple) | --vc-link / --vc-icon-accent / --vc-text | Bypasses --vc semantic tokens via legacy theme accents; dark mode follows OS + incomplete theme remap | app/components/metatip/metatip.element.css:74,116,120,189,235,262 |
| Hotkey map | pressed key bg/fg | background: var(--theme-color); color: var(--theme-bg) | --vc-button-primary / --vc-button-primary-on (or icon-accent pair) | Theme bypass; contrast depends on hotpink-on-surface — risk in light & dark | app/components/hotkey-map/base.element.css:120–122 |
| Toolbar tip (dark/light sheets) | box-shadow | hsla(…,50%) dark vs hsla(…,10%) light | --vc-shadow-* | Theme-specific hardcoded shadows not driven by token elevation | vibe-check.element_dark.css:3; _light.css:3 |
| Feedback layer scheme | color-scheme / data-scheme | layerTokenCss + data-scheme light/dark | same | None for mechanism — scheme switching exists; issues are fallback HEX ignoring scheme | design-system/generated/tokens.js (layerTokenCss); feedback-ui.js scheme helpers |
| Selection chrome (handles/labels/grid) | stroke / fill / bg | var(--neon-pink), var(--neon-purple), display-p3 | --vc-* (none defined for selection); or keep as non-DS debug chrome explicitly | Bypasses design-system tokens entirely (Open Props / neon) | app/components/selection/*.css; grip/handle/label/gridlines |
| Search feature UI | font | 16px/1.4 system-ui… literal | var(--vc-font-family) | Bypasses token font-family | app/features/search.js:76 |
| Send focus-visible | focus affordance | filter: brightness(0.96) | tokenized focus ring (border/shadow semantic) | Bypasses border/focus tokens; low-visibility focus | app/vibecheck/feedback-styles.js:631–632 |
| Popup #signout | bg + default button text | bg --vc-text-gray-light (#abb0ba light) with inherited primary-on text risk | --vc-surface-subtle + --vc-text (or secondary button pattern) | A11y: gray-light fill is mid-gray; likely poor contrast with light or dark text depending on cascade | extension/popup/popup.css:45–46,59 |
| Kinds chip / header icons (default) | color | var(--vc-text-gray-light) on var(--vc-surface) | ensure contrast ≥4.5:1; prefer --vc-text-gray-medium for small text | A11y: gray-light (#abb0ba) on surface (#eeeff1) is low contrast for 10–11px UI text | feedback-styles.js:284,738–739; quote-heading 762–763 |
| Badge pending | bg/fg | --vc-badge-pending-background / --vc-badge-pending-text | verify WCAG for 10px bold label | A11y: pending badge uses gray-300/gray-700 (light) — check small-text contrast | feedback-styles.js:737–739 |
| Pin glyph | fg on pin fills | color: var(--vc-icon-inverse) on saturated pin-* backgrounds | verify inverse on each pin hue (purple/blue/amber/teal/pink) | A11y: inverse gray-50 on amber/pink/teal may be marginal; needs measured contrast | feedback-styles.js:131,144–153 |
| Hotkey pressed + metatip accents | color pairs | hotpink / theme-blue / theme-purple on theme-bg | tokenized pairs with verified contrast | A11y: non-DS accents not contrast-checked against light/dark surfaces | hotkey-map/base.element.css:120–122; metatip.element.css theme-color usages |
| Card selected item / header | color | var(--vc-text-inverse) on var(--vc-card-accent) | OK if accent always dark enough; Suggestion/Warning hues need check | A11y: text-inverse on pin-warning (#d97706) / pin-suggestion (#be185d) should be verified | feedback-styles.js:231–232,726–729 |
| Badge default styles | background/color tokens available | uses --vc-badge-pending-* only; --vc-badge-background / --vc-badge-text unused | --vc-badge-background / --vc-badge-text for default Badge | Defined semantic/component tokens unused; pending tokens used as default | feedback-styles.js:732–739; tokens.json badge-background |
| Primary button hover | hover background | not applied on popup primary button | --vc-button-primary-hover | Token exists but popup primary has no :hover using it | extension/popup/popup.css:41–51; tokens.json button-primary-hover |
| Tables | — | — | — | No table component in VibeCheck UI inventory; N/A | — |
| Modals (dialog) | — | Notes Panel / menus act as overlays | — | No dedicated modal primitive; panel/card patterns apply | app/vibecheck/feedback-styles.js .vc-panel |
| Navigation | — | Toolbar + panel tools | — | No app nav component; toolbar is closest | app/components/vibe-check/vibe-check.element.css |
| Select (native) | — | Custom .vc-type-selector / .vc-type-menu | — | Custom select uses tokens; no native <select> styling in popup | feedback-styles.js:317+ |

---

## Notes on contrast (not instrumented)

Contrast calls above are **risk flags**, not measured WCAG ratios. Recommended follow-up: measure in Light and Dark for (1) `--vc-text-gray-light` on `--vc-surface` / `--vc-bg`, (2) badge pending/success pairs, (3) `--vc-text-inverse` on each `--vc-pin-*`, (4) `#signout` fill, (5) hotpink/`--theme-color` on `--theme-bg`.

## Related audit docs

- [`02-code-token-inventory.md`](./02-code-token-inventory.md) — unused primitives / defined tokens
- [`04-token-comparison.md`](./04-token-comparison.md) — Figma vs code status

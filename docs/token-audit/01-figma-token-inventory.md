# 01 — Figma token inventory

Source file: [VibeCheck](https://www.figma.com/design/3UduCyltV7tmRYSnDqTEfA/VibeCheck) (`fileKey` `3UduCyltV7tmRYSnDqTEfA`)

Entry URL provided: [node `3:59` — `00 · VibeCheck`](https://www.figma.com/design/3UduCyltV7tmRYSnDqTEfA/VibeCheck?node-id=3-59) (cover frame on **Design** page).

Inventory date: 2026-09-21

Method: Figma Plugin API local variables + local styles (`getLocalVariableCollectionsAsync`, `getLocalVariablesAsync`, `getLocalTextStylesAsync`, `getLocalEffectStylesAsync`, `getLocalPaintStylesAsync`, `getLocalGridStylesAsync`), plus page/frame inspection of **Styleguide** and **Design → 01 · Foundations**.

Rules applied: exact names/values from Figma; no inferred values; inaccessible/unspecified items recorded as `Unclear`.

## Summary

| Source | Count | Modes |
|---|---|---|
| Variable collection `VibeCheck Primitives` | 82 | `Value` |
| Variable collection `VibeCheck Colors` | 39 | `Light`, `Dark` |
| Variable collection `VibeCheck Dimensions` | 20 | `Value` |
| Local text styles | 5 | n/a (styles) |
| Local effect styles | 3 | n/a (styles) |
| Local paint styles | 0 | — |
| Local grid styles | 0 | — |
| **Total variable tokens** | **141** | |

### Pages inspected

| Page | ID | Role for tokens |
|---|---|---|
| Info | `0:1` | Empty (no children) |
| --- | `1:2` | Separator |
| Styleguide | `258:4085` | Documented color system + color token tables |
| Design | `1:3` | Cover `3:59`, Foundations `3:62`, component libraries |
| Toolbar Flows | `1:4` | Flows (not a token definition surface) |

### Styleguide documentation frames

| Frame | Node ID | Contents |
|---|---|---|
| Color System — VibeCheck | `264:7594` | Primitive swatches + hierarchy notes (“Never use primitive colors in the UI!”) |
| Color Tokens — VibeCheck | `287:11678` | Semantic/component color tables: Background, Surface, Text, Link, Icon, Border, Button, Badge, Pin |

### Classification guide used

| Classification | Applied to |
|---|---|
| Primitive/raw token | `VibeCheck Primitives` colors; `VibeCheck Dimensions` float values |
| Alias/reference token | All `VibeCheck Colors` variables are Figma `VARIABLE_ALIAS` entries; classification below prefers Semantic/Component by role, with the alias target in **Alias/reference** |
| Semantic token | Role-based color aliases (`bg`, `surface`, `text`, `link`, `icon`, `border`); typography text styles |
| Component token | `button/*`, `badge/*`, `pin/*` color aliases; elevation effect styles named for Pin/Card/Panel |

### Categories not present as Figma variables/styles

No local variables or styles were found for: **border width**, **breakpoints**, **z-index**, **motion/duration**, **font-family as a variable** (font family appears only on text styles), **STRING/BOOLEAN variables**.

Local **paint styles**: none. Elevation is documented as **effect styles**, not color variables.

---

## 1. Color — Primitive/raw (`VibeCheck Primitives`)

Collection ID: `VariableCollectionId:3:2`. Mode: `Value`. Location: Variables panel + Styleguide `Color System — VibeCheck` (`264:7594`).

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Color | amber/amber-100 | Primitive/raw token | #fef3c7 | — | Value | VibeCheck Primitives · var(--vc-amber-100) |
| Color | amber/amber-200 | Primitive/raw token | #fde68a | — | Value | VibeCheck Primitives · var(--vc-amber-200) |
| Color | amber/amber-300 | Primitive/raw token | #fcd34d | — | Value | VibeCheck Primitives · var(--vc-amber-300) |
| Color | amber/amber-400 | Primitive/raw token | #fbbf24 | — | Value | VibeCheck Primitives · var(--vc-amber-400) |
| Color | amber/amber-50 | Primitive/raw token | #fffbeb | — | Value | VibeCheck Primitives · var(--vc-amber-50) |
| Color | amber/amber-500 | Primitive/raw token | #f59e0b | — | Value | VibeCheck Primitives · var(--vc-amber-500) |
| Color | amber/amber-600 | Primitive/raw token | #d97706 | — | Value | VibeCheck Primitives · var(--vc-amber-600) |
| Color | amber/amber-700 | Primitive/raw token | #b45309 | — | Value | VibeCheck Primitives · var(--vc-amber-700) |
| Color | amber/amber-800 | Primitive/raw token | #92400e | — | Value | VibeCheck Primitives · var(--vc-amber-800) |
| Color | amber/amber-900 | Primitive/raw token | #78350f | — | Value | VibeCheck Primitives · var(--vc-amber-900) |
| Color | black | Primitive/raw token | #0b0c0e | — | Value | VibeCheck Primitives · var(--vc-black) |
| Color | blue/blue-100 | Primitive/raw token | #dbeafe | — | Value | VibeCheck Primitives · var(--vc-blue-100) |
| Color | blue/blue-200 | Primitive/raw token | #bfdbfe | — | Value | VibeCheck Primitives · var(--vc-blue-200) |
| Color | blue/blue-300 | Primitive/raw token | #93c5fd | — | Value | VibeCheck Primitives · var(--vc-blue-300) |
| Color | blue/blue-400 | Primitive/raw token | #60a5fa | — | Value | VibeCheck Primitives · var(--vc-blue-400) |
| Color | blue/blue-50 | Primitive/raw token | #eff6ff | — | Value | VibeCheck Primitives · var(--vc-blue-50) |
| Color | blue/blue-500 | Primitive/raw token | #3b82f6 | — | Value | VibeCheck Primitives · var(--vc-blue-500) |
| Color | blue/blue-600 | Primitive/raw token | #2563eb | — | Value | VibeCheck Primitives · var(--vc-blue-600) |
| Color | blue/blue-700 | Primitive/raw token | #1d4ed8 | — | Value | VibeCheck Primitives · var(--vc-blue-700) |
| Color | blue/blue-800 | Primitive/raw token | #1e40af | — | Value | VibeCheck Primitives · var(--vc-blue-800) |
| Color | blue/blue-900 | Primitive/raw token | #1e3a8a | — | Value | VibeCheck Primitives · var(--vc-blue-900) |
| Color | gray/gray-100 | Primitive/raw token | #eeeff1 | — | Value | VibeCheck Primitives · var(--vc-gray-100) |
| Color | gray/gray-200 | Primitive/raw token | #d2d5da | — | Value | VibeCheck Primitives · var(--vc-gray-200) |
| Color | gray/gray-300 | Primitive/raw token | #abb0ba | — | Value | VibeCheck Primitives · var(--vc-gray-300) |
| Color | gray/gray-400 | Primitive/raw token | #8f96a3 | — | Value | VibeCheck Primitives · var(--vc-gray-400) |
| Color | gray/gray-50 | Primitive/raw token | #f9fafa | — | Value | VibeCheck Primitives · var(--vc-gray-50) |
| Color | gray/gray-500 | Primitive/raw token | #737b8c | — | Value | VibeCheck Primitives · var(--vc-gray-500) |
| Color | gray/gray-600 | Primitive/raw token | #5c6370 | — | Value | VibeCheck Primitives · var(--vc-gray-600) |
| Color | gray/gray-700 | Primitive/raw token | #40454f | — | Value | VibeCheck Primitives · var(--vc-gray-700) |
| Color | gray/gray-800 | Primitive/raw token | #2e3138 | — | Value | VibeCheck Primitives · var(--vc-gray-800) |
| Color | gray/gray-900 | Primitive/raw token | #17191c | — | Value | VibeCheck Primitives · var(--vc-gray-900) |
| Color | green/green-100 | Primitive/raw token | #ecfccb | — | Value | VibeCheck Primitives · var(--vc-green-100) |
| Color | green/green-200 | Primitive/raw token | #d9f99d | — | Value | VibeCheck Primitives · var(--vc-green-200) |
| Color | green/green-300 | Primitive/raw token | #bef264 | — | Value | VibeCheck Primitives · var(--vc-green-300) |
| Color | green/green-400 | Primitive/raw token | #9ced2b | — | Value | VibeCheck Primitives · var(--vc-green-400) |
| Color | green/green-50 | Primitive/raw token | #f7fee7 | — | Value | VibeCheck Primitives · var(--vc-green-50) |
| Color | green/green-500 | Primitive/raw token | #84cc16 | — | Value | VibeCheck Primitives · var(--vc-green-500) |
| Color | green/green-600 | Primitive/raw token | #65a30d | — | Value | VibeCheck Primitives · var(--vc-green-600) |
| Color | green/green-700 | Primitive/raw token | #4d7c0f | — | Value | VibeCheck Primitives · var(--vc-green-700) |
| Color | green/green-800 | Primitive/raw token | #3f6212 | — | Value | VibeCheck Primitives · var(--vc-green-800) |
| Color | green/green-900 | Primitive/raw token | #365314 | — | Value | VibeCheck Primitives · var(--vc-green-900) |
| Color | pink/pink-100 | Primitive/raw token | #fce7f3 | — | Value | VibeCheck Primitives · var(--vc-pink-100) |
| Color | pink/pink-200 | Primitive/raw token | #fbcfe8 | — | Value | VibeCheck Primitives · var(--vc-pink-200) |
| Color | pink/pink-300 | Primitive/raw token | #f9a8d4 | — | Value | VibeCheck Primitives · var(--vc-pink-300) |
| Color | pink/pink-400 | Primitive/raw token | #f472b6 | — | Value | VibeCheck Primitives · var(--vc-pink-400) |
| Color | pink/pink-50 | Primitive/raw token | #fdf2f8 | — | Value | VibeCheck Primitives · var(--vc-pink-50) |
| Color | pink/pink-500 | Primitive/raw token | #ec4899 | — | Value | VibeCheck Primitives · var(--vc-pink-500) |
| Color | pink/pink-600 | Primitive/raw token | #db2777 | — | Value | VibeCheck Primitives · var(--vc-pink-600) |
| Color | pink/pink-700 | Primitive/raw token | #be185d | — | Value | VibeCheck Primitives · var(--vc-pink-700) |
| Color | pink/pink-800 | Primitive/raw token | #9d174d | — | Value | VibeCheck Primitives · var(--vc-pink-800) |
| Color | pink/pink-900 | Primitive/raw token | #831843 | — | Value | VibeCheck Primitives · var(--vc-pink-900) |
| Color | purple/purple-100 | Primitive/raw token | #ede9fe | — | Value | VibeCheck Primitives · var(--vc-purple-100) |
| Color | purple/purple-200 | Primitive/raw token | #ddd6fe | — | Value | VibeCheck Primitives · var(--vc-purple-200) |
| Color | purple/purple-300 | Primitive/raw token | #c4b5fd | — | Value | VibeCheck Primitives · var(--vc-purple-300) |
| Color | purple/purple-400 | Primitive/raw token | #a78bfa | — | Value | VibeCheck Primitives · var(--vc-purple-400) |
| Color | purple/purple-50 | Primitive/raw token | #f5f3ff | — | Value | VibeCheck Primitives · var(--vc-purple-50) |
| Color | purple/purple-500 | Primitive/raw token | #8b5cf6 | — | Value | VibeCheck Primitives · var(--vc-purple-500) |
| Color | purple/purple-600 | Primitive/raw token | #7c3aed | — | Value | VibeCheck Primitives · var(--vc-purple-600) |
| Color | purple/purple-700 | Primitive/raw token | #6d28d9 | — | Value | VibeCheck Primitives · var(--vc-purple-700) |
| Color | purple/purple-800 | Primitive/raw token | #5b21b6 | — | Value | VibeCheck Primitives · var(--vc-purple-800) |
| Color | purple/purple-900 | Primitive/raw token | #4c1d95 | — | Value | VibeCheck Primitives · var(--vc-purple-900) |
| Color | red/red-100 | Primitive/raw token | #fee2e2 | — | Value | VibeCheck Primitives · var(--vc-red-100) |
| Color | red/red-200 | Primitive/raw token | #fecaca | — | Value | VibeCheck Primitives · var(--vc-red-200) |
| Color | red/red-300 | Primitive/raw token | #fca5a5 | — | Value | VibeCheck Primitives · var(--vc-red-300) |
| Color | red/red-400 | Primitive/raw token | #f87171 | — | Value | VibeCheck Primitives · var(--vc-red-400) |
| Color | red/red-50 | Primitive/raw token | #fef2f2 | — | Value | VibeCheck Primitives · var(--vc-red-50) |
| Color | red/red-500 | Primitive/raw token | #ef4444 | — | Value | VibeCheck Primitives · var(--vc-red-500) |
| Color | red/red-600 | Primitive/raw token | #dc2626 | — | Value | VibeCheck Primitives · var(--vc-red-600) |
| Color | red/red-700 | Primitive/raw token | #b91c1c | — | Value | VibeCheck Primitives · var(--vc-red-700) |
| Color | red/red-800 | Primitive/raw token | #991b1b | — | Value | VibeCheck Primitives · var(--vc-red-800) |
| Color | red/red-900 | Primitive/raw token | #7f1d1d | — | Value | VibeCheck Primitives · var(--vc-red-900) |
| Color | teal/teal-100 | Primitive/raw token | #ccfbf1 | — | Value | VibeCheck Primitives · var(--vc-teal-100) |
| Color | teal/teal-200 | Primitive/raw token | #99f6e4 | — | Value | VibeCheck Primitives · var(--vc-teal-200) |
| Color | teal/teal-300 | Primitive/raw token | #5eead4 | — | Value | VibeCheck Primitives · var(--vc-teal-300) |
| Color | teal/teal-400 | Primitive/raw token | #2dd4bf | — | Value | VibeCheck Primitives · var(--vc-teal-400) |
| Color | teal/teal-50 | Primitive/raw token | #f0fdfa | — | Value | VibeCheck Primitives · var(--vc-teal-50) |
| Color | teal/teal-500 | Primitive/raw token | #14b8a6 | — | Value | VibeCheck Primitives · var(--vc-teal-500) |
| Color | teal/teal-600 | Primitive/raw token | #0d9488 | — | Value | VibeCheck Primitives · var(--vc-teal-600) |
| Color | teal/teal-700 | Primitive/raw token | #0f766e | — | Value | VibeCheck Primitives · var(--vc-teal-700) |
| Color | teal/teal-800 | Primitive/raw token | #115e59 | — | Value | VibeCheck Primitives · var(--vc-teal-800) |
| Color | teal/teal-900 | Primitive/raw token | #134e4a | — | Value | VibeCheck Primitives · var(--vc-teal-900) |
| Color | white | Primitive/raw token | #f4f4f6 | — | Value | VibeCheck Primitives · var(--vc-white) |

Primitive color count: **82**.

---

## 2. Color — Semantic & component aliases (`VibeCheck Colors`)

Collection ID: `VariableCollectionId:3:3`. Modes: `Light`, `Dark`. Every listed value is a `VARIABLE_ALIAS` to a primitive. **Value** shows the resolved primitive hex for that mode (from the aliased primitive’s `Value` mode). Location: Variables panel + Styleguide `Color Tokens — VibeCheck` (`287:11678`).

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Color | badge/background | Component token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-badge-background) · Color Tokens (badge) |
| Color | badge/background | Component token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-badge-background) · Color Tokens (badge) |
| Color | badge/pending - bg | Component token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-badge-pending-background) · Color Tokens (badge) |
| Color | badge/pending - bg | Component token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-badge-pending-background) · Color Tokens (badge) |
| Color | badge/pending - text | Component token | #40454f | → gray/gray-700 | Light | VibeCheck Colors · var(--vc-badge-pending-text) · Color Tokens (badge) |
| Color | badge/pending - text | Component token | #abb0ba | → gray/gray-300 | Dark | VibeCheck Colors · var(--vc-badge-pending-text) · Color Tokens (badge) |
| Color | badge/success - bg | Component token | #ecfccb | → green/green-100 | Light | VibeCheck Colors · var(--vc-badge-success-background) · Color Tokens (badge) |
| Color | badge/success - bg | Component token | #ecfccb | → green/green-100 | Dark | VibeCheck Colors · var(--vc-badge-success-background) · Color Tokens (badge) |
| Color | badge/success - text | Component token | #3f6212 | → green/green-800 | Light | VibeCheck Colors · var(--vc-badge-success-text) · Color Tokens (badge) |
| Color | badge/success - text | Component token | #3f6212 | → green/green-800 | Dark | VibeCheck Colors · var(--vc-badge-success-text) · Color Tokens (badge) |
| Color | badge/text | Component token | #40454f | → gray/gray-700 | Light | VibeCheck Colors · var(--vc-badge-text) · Color Tokens (badge) |
| Color | badge/text | Component token | #abb0ba | → gray/gray-300 | Dark | VibeCheck Colors · var(--vc-badge-text) · Color Tokens (badge) |
| Color | bg/bg | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-bg) · Color Tokens (bg) |
| Color | bg/bg | Semantic token | #17191c | → gray/gray-900 | Dark | VibeCheck Colors · var(--vc-bg) · Color Tokens (bg) |
| Color | bg/bg-inverse | Semantic token | #17191c | → gray/gray-900 | Light | VibeCheck Colors · var(--vc-bg-inverse) · Color Tokens (bg) |
| Color | bg/bg-inverse | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-bg-inverse) · Color Tokens (bg) |
| Color | border/border | Semantic token | #2e3138 | → gray/gray-800 | Light | VibeCheck Colors · var(--vc-border) · Color Tokens (border) |
| Color | border/border | Semantic token | #eeeff1 | → gray/gray-100 | Dark | VibeCheck Colors · var(--vc-border) · Color Tokens (border) |
| Color | border/border-gray-light | Semantic token | #d2d5da | → gray/gray-200 | Light | VibeCheck Colors · var(--vc-border-gray-light) · Color Tokens (border) |
| Color | border/border-gray-light | Semantic token | #40454f | → gray/gray-700 | Dark | VibeCheck Colors · var(--vc-border-gray-light) · Color Tokens (border) |
| Color | border/border-gray-medium | Semantic token | #8f96a3 | → gray/gray-400 | Light | VibeCheck Colors · var(--vc-border-gray-medium) · Color Tokens (border) |
| Color | border/border-gray-medium | Semantic token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-border-gray-medium) · Color Tokens (border) |
| Color | border/border-gray-strong | Semantic token | #5c6370 | → gray/gray-600 | Light | VibeCheck Colors · var(--vc-border-gray-strong) · Color Tokens (border) |
| Color | border/border-gray-strong | Semantic token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-border-gray-strong) · Color Tokens (border) |
| Color | border/border-inverse | Semantic token | #eeeff1 | → gray/gray-100 | Light | VibeCheck Colors · var(--vc-border-inverse) · Color Tokens (border) |
| Color | border/border-inverse | Semantic token | #2e3138 | → gray/gray-800 | Dark | VibeCheck Colors · var(--vc-border-inverse) · Color Tokens (border) |
| Color | button/button-primary | Component token | #17191c | → gray/gray-900 | Light | VibeCheck Colors · var(--vc-button-primary) · Color Tokens (button) |
| Color | button/button-primary | Component token | #2e3138 | → gray/gray-800 | Dark | VibeCheck Colors · var(--vc-button-primary) · Color Tokens (button) |
| Color | button/button-primary-hover | Component token | #5c6370 | → gray/gray-600 | Light | VibeCheck Colors · var(--vc-button-primary-hover) · Color Tokens (button) |
| Color | button/button-primary-hover | Component token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-button-primary-hover) · Color Tokens (button) |
| Color | button/button-primary-on | Component token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-button-primary-on) · Color Tokens (button) |
| Color | button/button-primary-on | Component token | #17191c | → gray/gray-900 | Dark | VibeCheck Colors · var(--vc-button-primary-on) · Color Tokens (button) |
| Color | button/button-secondary-hover | Component token | #eeeff1 | → gray/gray-100 | Light | VibeCheck Colors · var(--vc-button-secondary-hover) · Color Tokens (button) |
| Color | button/button-secondary-hover | Component token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-button-secondary-hover) · Color Tokens (button) |
| Color | icon/icon | Semantic token | #17191c | → gray/gray-900 | Light | VibeCheck Colors · var(--vc-icon) · Color Tokens (icon) |
| Color | icon/icon | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-icon) · Color Tokens (icon) |
| Color | icon/icon-accent | Semantic token | #9ced2b | → green/green-400 | Light | VibeCheck Colors · var(--vc-icon-accent) · Color Tokens (icon) |
| Color | icon/icon-accent | Semantic token | #9ced2b | → green/green-400 | Dark | VibeCheck Colors · var(--vc-icon-accent) · Color Tokens (icon) |
| Color | icon/icon-critical | Semantic token | #b91c1c | → red/red-700 | Light | VibeCheck Colors · var(--vc-icon-critical) · Color Tokens (icon) |
| Color | icon/icon-critical | Semantic token | #f87171 | → red/red-400 | Dark | VibeCheck Colors · var(--vc-icon-critical) · Color Tokens (icon) |
| Color | icon/icon-gray-light | Semantic token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-icon-gray-light) · Color Tokens (icon) |
| Color | icon/icon-gray-light | Semantic token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-icon-gray-light) · Color Tokens (icon) |
| Color | icon/icon-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Light | VibeCheck Colors · var(--vc-icon-gray-medium) · Color Tokens (icon) |
| Color | icon/icon-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Dark | VibeCheck Colors · var(--vc-icon-gray-medium) · Color Tokens (icon) |
| Color | icon/icon-inverse | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-icon-inverse) · Color Tokens (icon) |
| Color | icon/icon-inverse | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-icon-inverse) · Color Tokens (icon) |
| Color | icon/icon-subtle | Semantic token | #40454f | → gray/gray-700 | Light | VibeCheck Colors · var(--vc-icon-subtle) · Color Tokens (icon) |
| Color | icon/icon-subtle | Semantic token | #d2d5da | → gray/gray-200 | Dark | VibeCheck Colors · var(--vc-icon-subtle) · Color Tokens (icon) |
| Color | link/link | Semantic token | #2563eb | → blue/blue-600 | Light | VibeCheck Colors · var(--vc-link) · Color Tokens (link) |
| Color | link/link | Semantic token | #60a5fa | → blue/blue-400 | Dark | VibeCheck Colors · var(--vc-link) · Color Tokens (link) |
| Color | pin/implement | Component token | #2563eb | → blue/blue-600 | Light | VibeCheck Colors · var(--vc-pin-implement) · Color Tokens (pin) |
| Color | pin/implement | Component token | #2563eb | → blue/blue-600 | Dark | VibeCheck Colors · var(--vc-pin-implement) · Color Tokens (pin) |
| Color | pin/note | Component token | #7c3aed | → purple/purple-600 | Light | VibeCheck Colors · var(--vc-pin-note) · Color Tokens (pin) |
| Color | pin/note | Component token | #7c3aed | → purple/purple-600 | Dark | VibeCheck Colors · var(--vc-pin-note) · Color Tokens (pin) |
| Color | pin/question | Component token | #0f766e | → teal/teal-700 | Light | VibeCheck Colors · var(--vc-pin-question) · Color Tokens (pin) |
| Color | pin/question | Component token | #0f766e | → teal/teal-700 | Dark | VibeCheck Colors · var(--vc-pin-question) · Color Tokens (pin) |
| Color | pin/suggestion | Component token | #be185d | → pink/pink-700 | Light | VibeCheck Colors · var(--vc-pin-suggestion) · Color Tokens (pin) |
| Color | pin/suggestion | Component token | #be185d | → pink/pink-700 | Dark | VibeCheck Colors · var(--vc-pin-suggestion) · Color Tokens (pin) |
| Color | pin/warning | Component token | #d97706 | → amber/amber-600 | Light | VibeCheck Colors · var(--vc-pin-warning) · Color Tokens (pin) |
| Color | pin/warning | Component token | #d97706 | → amber/amber-600 | Dark | VibeCheck Colors · var(--vc-pin-warning) · Color Tokens (pin) |
| Color | surface/surface | Semantic token | #eeeff1 | → gray/gray-100 | Light | VibeCheck Colors · var(--vc-surface) · Color Tokens (surface) |
| Color | surface/surface | Semantic token | #2e3138 | → gray/gray-800 | Dark | VibeCheck Colors · var(--vc-surface) · Color Tokens (surface) |
| Color | surface/surface-input | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-surface-input) · Color Tokens (surface) |
| Color | surface/surface-input | Semantic token | #17191c | → gray/gray-900 | Dark | VibeCheck Colors · var(--vc-surface-input) · Color Tokens (surface) |
| Color | surface/surface-subtle | Semantic token | #d2d5da | → gray/gray-200 | Light | VibeCheck Colors · var(--vc-surface-subtle) · Color Tokens (surface) |
| Color | surface/surface-subtle | Semantic token | #40454f | → gray/gray-700 | Dark | VibeCheck Colors · var(--vc-surface-subtle) · Color Tokens (surface) |
| Color | text/text | Semantic token | #0b0c0e | → black | Light | VibeCheck Colors · var(--vc-text) · Color Tokens (text) |
| Color | text/text | Semantic token | #f4f4f6 | → white | Dark | VibeCheck Colors · var(--vc-text) · Color Tokens (text) |
| Color | text/text-body | Semantic token | #2e3138 | → gray/gray-800 | Light | VibeCheck Colors · var(--vc-text-body) · Color Tokens (text) |
| Color | text/text-body | Semantic token | #eeeff1 | → gray/gray-100 | Dark | VibeCheck Colors · var(--vc-text-body) · Color Tokens (text) |
| Color | text/text-critical | Semantic token | #b91c1c | → red/red-700 | Light | VibeCheck Colors · var(--vc-text-critical) · Color Tokens (text) |
| Color | text/text-critical | Semantic token | #f87171 | → red/red-400 | Dark | VibeCheck Colors · var(--vc-text-critical) · Color Tokens (text) |
| Color | text/text-gray-light | Semantic token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-text-gray-light) · Color Tokens (text) |
| Color | text/text-gray-light | Semantic token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-text-gray-light) · Color Tokens (text) |
| Color | text/text-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Light | VibeCheck Colors · var(--vc-text-gray-medium) · Color Tokens (text) |
| Color | text/text-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Dark | VibeCheck Colors · var(--vc-text-gray-medium) · Color Tokens (text) |
| Color | text/text-inverse | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-text-inverse) · Color Tokens (text) |
| Color | text/text-inverse | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-text-inverse) · Color Tokens (text) |

Alias token count: **39** variables × **2** modes = **78** mode rows.

---

## 3. Spacing / Sizing / Border radius / Opacity (`VibeCheck Dimensions`)

Collection ID: `VariableCollectionId:3:4`. Mode: `Value`. FLOAT variables. Units are Figma float numbers (pixel-equivalent for spacing/radius/size as documented on Foundations specimens where labeled `· Npx`). Opacity is stored as FLOAT `45` with scope `OPACITY`; whether consumers treat this as `45`, `0.45`, or `45%` is **Unclear** from the variable definition alone.

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Opacity | opacity/resolved | Primitive/raw token | 45 | — | Value | VibeCheck Dimensions · scope OPACITY · var(--vc-opacity-resolved) |
| Border radius | radius/12 | Primitive/raw token | 12 | — | Value | VibeCheck Dimensions · scope CORNER_RADIUS · var(--vc-radius-12) |
| Border radius | radius/2 | Primitive/raw token | 2 | — | Value | VibeCheck Dimensions · scope CORNER_RADIUS · var(--vc-radius-2) |
| Border radius | radius/4 | Primitive/raw token | 4 | — | Value | VibeCheck Dimensions · scope CORNER_RADIUS · var(--vc-radius-4) |
| Border radius | radius/6 | Primitive/raw token | 6 | — | Value | VibeCheck Dimensions · scope CORNER_RADIUS · var(--vc-radius-6) |
| Border radius | radius/8 | Primitive/raw token | 8 | — | Value | VibeCheck Dimensions · scope CORNER_RADIUS · var(--vc-radius-8) |
| Border radius | radius/full | Primitive/raw token | 999 | — | Value | VibeCheck Dimensions · scope CORNER_RADIUS · var(--vc-radius-full) |
| Sizing | size/card | Primitive/raw token | 300 | — | Value | VibeCheck Dimensions · scope WIDTH_HEIGHT · var(--vc-size-card) |
| Sizing | size/panel | Primitive/raw token | 280 | — | Value | VibeCheck Dimensions · scope WIDTH_HEIGHT · var(--vc-size-panel) |
| Sizing | size/pin | Primitive/raw token | 28 | — | Value | VibeCheck Dimensions · scope WIDTH_HEIGHT · var(--vc-size-pin) |
| Sizing | size/tool | Primitive/raw token | 36 | — | Value | VibeCheck Dimensions · scope WIDTH_HEIGHT · var(--vc-size-tool) |
| Spacing | spacing/0 | Primitive/raw token | 0 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-0) |
| Spacing | spacing/10 | Primitive/raw token | 10 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-10) |
| Spacing | spacing/12 | Primitive/raw token | 12 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-12) |
| Spacing | spacing/16 | Primitive/raw token | 16 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-16) |
| Spacing | spacing/2 | Primitive/raw token | 2 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-2) |
| Spacing | spacing/24 | Primitive/raw token | 24 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-24) |
| Spacing | spacing/4 | Primitive/raw token | 4 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-4) |
| Spacing | spacing/6 | Primitive/raw token | 6 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-6) |
| Spacing | spacing/8 | Primitive/raw token | 8 | — | Value | VibeCheck Dimensions · scope GAP · var(--vc-spacing-8) |

---

## 4. Typography (local text styles)

Not variables — local text styles. Font family is **Inter** on all styles. No separate font-family variable exists.

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Typography | VibeCheck/Body/13 | Semantic token | fontSize 13; fontName Inter / Regular; fontWeight 400; lineHeight 19px; letterSpacing 0px | — | n/a (text style) | Local text style · Design/Foundations Typography · VibeCheck extension typography: 13px/19px |
| Font family | VibeCheck/Body/13 (font family) | Semantic token | Inter | — | n/a (text style) | From text style VibeCheck/Body/13 |
| Font size | VibeCheck/Body/13 (font size) | Semantic token | 13 | — | n/a (text style) | From text style VibeCheck/Body/13 |
| Font weight | VibeCheck/Body/13 (font weight) | Semantic token | 400 | — | n/a (text style) | From text style VibeCheck/Body/13 variationSettings.wght / style Regular |
| Line height | VibeCheck/Body/13 (line height) | Semantic token | 19px | — | n/a (text style) | From text style VibeCheck/Body/13 |
| Letter spacing | VibeCheck/Body/13 (letter spacing) | Semantic token | 0px | — | n/a (text style) | From text style VibeCheck/Body/13 |
| Typography | VibeCheck/Label/11 | Semantic token | fontSize 11; fontName Inter / Semi Bold; fontWeight 600; lineHeight 139.9999976158142%; letterSpacing 0px | — | n/a (text style) | Local text style · Design/Foundations Typography · VibeCheck extension typography: 11px/14px |
| Font family | VibeCheck/Label/11 (font family) | Semantic token | Inter | — | n/a (text style) | From text style VibeCheck/Label/11 |
| Font size | VibeCheck/Label/11 (font size) | Semantic token | 11 | — | n/a (text style) | From text style VibeCheck/Label/11 |
| Font weight | VibeCheck/Label/11 (font weight) | Semantic token | 600 | — | n/a (text style) | From text style VibeCheck/Label/11 variationSettings.wght / style Semi Bold |
| Line height | VibeCheck/Label/11 (line height) | Semantic token | 139.9999976158142% | — | n/a (text style) | From text style VibeCheck/Label/11 |
| Letter spacing | VibeCheck/Label/11 (letter spacing) | Semantic token | 0px | — | n/a (text style) | From text style VibeCheck/Label/11 |
| Typography | VibeCheck/Title/13 | Semantic token | fontSize 13; fontName Inter / Bold; fontWeight 700; lineHeight 18px; letterSpacing 0px | — | n/a (text style) | Local text style · Design/Foundations Typography · VibeCheck extension typography: 13px/18px |
| Font family | VibeCheck/Title/13 (font family) | Semantic token | Inter | — | n/a (text style) | From text style VibeCheck/Title/13 |
| Font size | VibeCheck/Title/13 (font size) | Semantic token | 13 | — | n/a (text style) | From text style VibeCheck/Title/13 |
| Font weight | VibeCheck/Title/13 (font weight) | Semantic token | 700 | — | n/a (text style) | From text style VibeCheck/Title/13 variationSettings.wght / style Bold |
| Line height | VibeCheck/Title/13 (line height) | Semantic token | 18px | — | n/a (text style) | From text style VibeCheck/Title/13 |
| Letter spacing | VibeCheck/Title/13 (letter spacing) | Semantic token | 0px | — | n/a (text style) | From text style VibeCheck/Title/13 |
| Typography | VibeCheck/Heading/18 | Semantic token | fontSize 18; fontName Inter / Bold; fontWeight 700; lineHeight 24px; letterSpacing 0px | — | n/a (text style) | Local text style · Design/Foundations Typography · VibeCheck extension typography: 18px/24px |
| Font family | VibeCheck/Heading/18 (font family) | Semantic token | Inter | — | n/a (text style) | From text style VibeCheck/Heading/18 |
| Font size | VibeCheck/Heading/18 (font size) | Semantic token | 18 | — | n/a (text style) | From text style VibeCheck/Heading/18 |
| Font weight | VibeCheck/Heading/18 (font weight) | Semantic token | 700 | — | n/a (text style) | From text style VibeCheck/Heading/18 variationSettings.wght / style Bold |
| Line height | VibeCheck/Heading/18 (line height) | Semantic token | 24px | — | n/a (text style) | From text style VibeCheck/Heading/18 |
| Letter spacing | VibeCheck/Heading/18 (letter spacing) | Semantic token | 0px | — | n/a (text style) | From text style VibeCheck/Heading/18 |
| Typography | VibeCheck/Meta/10 | Semantic token | fontSize 10; fontName Inter / Regular; fontWeight 400; lineHeight 14px; letterSpacing 0px | — | n/a (text style) | Local text style · Design/Foundations Typography · VibeCheck extension typography: 10px/14px |
| Font family | VibeCheck/Meta/10 (font family) | Semantic token | Inter | — | n/a (text style) | From text style VibeCheck/Meta/10 |
| Font size | VibeCheck/Meta/10 (font size) | Semantic token | 10 | — | n/a (text style) | From text style VibeCheck/Meta/10 |
| Font weight | VibeCheck/Meta/10 (font weight) | Semantic token | 400 | — | n/a (text style) | From text style VibeCheck/Meta/10 variationSettings.wght / style Regular |
| Line height | VibeCheck/Meta/10 (line height) | Semantic token | 14px | — | n/a (text style) | From text style VibeCheck/Meta/10 |
| Letter spacing | VibeCheck/Meta/10 (letter spacing) | Semantic token | 0px | — | n/a (text style) | From text style VibeCheck/Meta/10 |

---

## 5. Shadows (local effect styles)

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Shadows | VibeCheck/Elevation/Pin | Component token | offset (0, 4); radius 16; spread 0; color #00000047; blendMode NORMAL | — | n/a (effect style) | Local effect style · Design/Foundations Elevation · type DROP_SHADOW |
| Shadows | VibeCheck/Elevation/Card | Component token | offset (0, 16); radius 50; spread 0; color #00000047; blendMode NORMAL | — | n/a (effect style) | Local effect style · Design/Foundations Elevation · type DROP_SHADOW |
| Shadows | VibeCheck/Elevation/Panel | Component token | offset (0, 12); radius 40; spread 0; color #00000038; blendMode NORMAL | — | n/a (effect style) | Local effect style · Design/Foundations Elevation · type DROP_SHADOW |

---

## 6. Categories with no Figma token definitions found

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Border width | — | Unclear | Unclear | — | Unclear | No local variable or style found |
| Breakpoints | — | Unclear | Unclear | — | Unclear | No local variable or style found |
| Z-index | — | Unclear | Unclear | — | Unclear | No local variable or style found |
| Motion or duration | — | Unclear | Unclear | — | Unclear | No local variable or style found |
| Font family (variable) | — | Unclear | Unclear | — | Unclear | Only present on text styles (Inter), not as a variable |

---

## 7. Foundations page labels that are not live variables

On Design → `01 · Foundations` (`3:62`), specimen labels include names that **do not** match any local variable. Values for these labels are **Unclear** (label text only; no bound variable).

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Color (documentation label) | bg/surface | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | bg/subtle | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | text/primary | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | text/secondary | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | border/default | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | action/primary | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | action/on-primary | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | status/danger | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |
| Color (documentation label) | selection/background | Unclear | Unclear | Unclear | Unclear | Design · 01 · Foundations (`3:62`) specimen label only — not present in local variables |

Foundations labels that **do** match live tokens (for cross-check): `pin/note`, `pin/implement`, `pin/warning`, `pin/question`, `badge/background`, spacing `4/6/8/10/12/16/24`, radius `6/8/12/full`, and all five `VibeCheck/*` text styles. Elevation specimens labeled Pin / Card / Panel match effect style names.

Note: Foundations spacing specimens omit documented variable tokens `spacing/0` and `spacing/2`. Radii specimens omit `radius/2` and `radius/4`. Size tokens (`size/pin`, `size/tool`, `size/panel`, `size/card`) and `opacity/resolved` are not labeled on the Foundations frame text scan.

---

## 8. Master inventory table (all tokens)

Combined table of every live Figma variable and style token recorded above.

| Category | Token name | Type | Value | Alias/reference | Mode/theme | Figma location |
|---|---|---|---|---|---|---|
| Color | amber/amber-100 | Primitive/raw token | #fef3c7 | — | Value | VibeCheck Primitives · var(--vc-amber-100) |
| Color | amber/amber-200 | Primitive/raw token | #fde68a | — | Value | VibeCheck Primitives · var(--vc-amber-200) |
| Color | amber/amber-300 | Primitive/raw token | #fcd34d | — | Value | VibeCheck Primitives · var(--vc-amber-300) |
| Color | amber/amber-400 | Primitive/raw token | #fbbf24 | — | Value | VibeCheck Primitives · var(--vc-amber-400) |
| Color | amber/amber-50 | Primitive/raw token | #fffbeb | — | Value | VibeCheck Primitives · var(--vc-amber-50) |
| Color | amber/amber-500 | Primitive/raw token | #f59e0b | — | Value | VibeCheck Primitives · var(--vc-amber-500) |
| Color | amber/amber-600 | Primitive/raw token | #d97706 | — | Value | VibeCheck Primitives · var(--vc-amber-600) |
| Color | amber/amber-700 | Primitive/raw token | #b45309 | — | Value | VibeCheck Primitives · var(--vc-amber-700) |
| Color | amber/amber-800 | Primitive/raw token | #92400e | — | Value | VibeCheck Primitives · var(--vc-amber-800) |
| Color | amber/amber-900 | Primitive/raw token | #78350f | — | Value | VibeCheck Primitives · var(--vc-amber-900) |
| Color | black | Primitive/raw token | #0b0c0e | — | Value | VibeCheck Primitives · var(--vc-black) |
| Color | blue/blue-100 | Primitive/raw token | #dbeafe | — | Value | VibeCheck Primitives · var(--vc-blue-100) |
| Color | blue/blue-200 | Primitive/raw token | #bfdbfe | — | Value | VibeCheck Primitives · var(--vc-blue-200) |
| Color | blue/blue-300 | Primitive/raw token | #93c5fd | — | Value | VibeCheck Primitives · var(--vc-blue-300) |
| Color | blue/blue-400 | Primitive/raw token | #60a5fa | — | Value | VibeCheck Primitives · var(--vc-blue-400) |
| Color | blue/blue-50 | Primitive/raw token | #eff6ff | — | Value | VibeCheck Primitives · var(--vc-blue-50) |
| Color | blue/blue-500 | Primitive/raw token | #3b82f6 | — | Value | VibeCheck Primitives · var(--vc-blue-500) |
| Color | blue/blue-600 | Primitive/raw token | #2563eb | — | Value | VibeCheck Primitives · var(--vc-blue-600) |
| Color | blue/blue-700 | Primitive/raw token | #1d4ed8 | — | Value | VibeCheck Primitives · var(--vc-blue-700) |
| Color | blue/blue-800 | Primitive/raw token | #1e40af | — | Value | VibeCheck Primitives · var(--vc-blue-800) |
| Color | blue/blue-900 | Primitive/raw token | #1e3a8a | — | Value | VibeCheck Primitives · var(--vc-blue-900) |
| Color | gray/gray-100 | Primitive/raw token | #eeeff1 | — | Value | VibeCheck Primitives · var(--vc-gray-100) |
| Color | gray/gray-200 | Primitive/raw token | #d2d5da | — | Value | VibeCheck Primitives · var(--vc-gray-200) |
| Color | gray/gray-300 | Primitive/raw token | #abb0ba | — | Value | VibeCheck Primitives · var(--vc-gray-300) |
| Color | gray/gray-400 | Primitive/raw token | #8f96a3 | — | Value | VibeCheck Primitives · var(--vc-gray-400) |
| Color | gray/gray-50 | Primitive/raw token | #f9fafa | — | Value | VibeCheck Primitives · var(--vc-gray-50) |
| Color | gray/gray-500 | Primitive/raw token | #737b8c | — | Value | VibeCheck Primitives · var(--vc-gray-500) |
| Color | gray/gray-600 | Primitive/raw token | #5c6370 | — | Value | VibeCheck Primitives · var(--vc-gray-600) |
| Color | gray/gray-700 | Primitive/raw token | #40454f | — | Value | VibeCheck Primitives · var(--vc-gray-700) |
| Color | gray/gray-800 | Primitive/raw token | #2e3138 | — | Value | VibeCheck Primitives · var(--vc-gray-800) |
| Color | gray/gray-900 | Primitive/raw token | #17191c | — | Value | VibeCheck Primitives · var(--vc-gray-900) |
| Color | green/green-100 | Primitive/raw token | #ecfccb | — | Value | VibeCheck Primitives · var(--vc-green-100) |
| Color | green/green-200 | Primitive/raw token | #d9f99d | — | Value | VibeCheck Primitives · var(--vc-green-200) |
| Color | green/green-300 | Primitive/raw token | #bef264 | — | Value | VibeCheck Primitives · var(--vc-green-300) |
| Color | green/green-400 | Primitive/raw token | #9ced2b | — | Value | VibeCheck Primitives · var(--vc-green-400) |
| Color | green/green-50 | Primitive/raw token | #f7fee7 | — | Value | VibeCheck Primitives · var(--vc-green-50) |
| Color | green/green-500 | Primitive/raw token | #84cc16 | — | Value | VibeCheck Primitives · var(--vc-green-500) |
| Color | green/green-600 | Primitive/raw token | #65a30d | — | Value | VibeCheck Primitives · var(--vc-green-600) |
| Color | green/green-700 | Primitive/raw token | #4d7c0f | — | Value | VibeCheck Primitives · var(--vc-green-700) |
| Color | green/green-800 | Primitive/raw token | #3f6212 | — | Value | VibeCheck Primitives · var(--vc-green-800) |
| Color | green/green-900 | Primitive/raw token | #365314 | — | Value | VibeCheck Primitives · var(--vc-green-900) |
| Color | pink/pink-100 | Primitive/raw token | #fce7f3 | — | Value | VibeCheck Primitives · var(--vc-pink-100) |
| Color | pink/pink-200 | Primitive/raw token | #fbcfe8 | — | Value | VibeCheck Primitives · var(--vc-pink-200) |
| Color | pink/pink-300 | Primitive/raw token | #f9a8d4 | — | Value | VibeCheck Primitives · var(--vc-pink-300) |
| Color | pink/pink-400 | Primitive/raw token | #f472b6 | — | Value | VibeCheck Primitives · var(--vc-pink-400) |
| Color | pink/pink-50 | Primitive/raw token | #fdf2f8 | — | Value | VibeCheck Primitives · var(--vc-pink-50) |
| Color | pink/pink-500 | Primitive/raw token | #ec4899 | — | Value | VibeCheck Primitives · var(--vc-pink-500) |
| Color | pink/pink-600 | Primitive/raw token | #db2777 | — | Value | VibeCheck Primitives · var(--vc-pink-600) |
| Color | pink/pink-700 | Primitive/raw token | #be185d | — | Value | VibeCheck Primitives · var(--vc-pink-700) |
| Color | pink/pink-800 | Primitive/raw token | #9d174d | — | Value | VibeCheck Primitives · var(--vc-pink-800) |
| Color | pink/pink-900 | Primitive/raw token | #831843 | — | Value | VibeCheck Primitives · var(--vc-pink-900) |
| Color | purple/purple-100 | Primitive/raw token | #ede9fe | — | Value | VibeCheck Primitives · var(--vc-purple-100) |
| Color | purple/purple-200 | Primitive/raw token | #ddd6fe | — | Value | VibeCheck Primitives · var(--vc-purple-200) |
| Color | purple/purple-300 | Primitive/raw token | #c4b5fd | — | Value | VibeCheck Primitives · var(--vc-purple-300) |
| Color | purple/purple-400 | Primitive/raw token | #a78bfa | — | Value | VibeCheck Primitives · var(--vc-purple-400) |
| Color | purple/purple-50 | Primitive/raw token | #f5f3ff | — | Value | VibeCheck Primitives · var(--vc-purple-50) |
| Color | purple/purple-500 | Primitive/raw token | #8b5cf6 | — | Value | VibeCheck Primitives · var(--vc-purple-500) |
| Color | purple/purple-600 | Primitive/raw token | #7c3aed | — | Value | VibeCheck Primitives · var(--vc-purple-600) |
| Color | purple/purple-700 | Primitive/raw token | #6d28d9 | — | Value | VibeCheck Primitives · var(--vc-purple-700) |
| Color | purple/purple-800 | Primitive/raw token | #5b21b6 | — | Value | VibeCheck Primitives · var(--vc-purple-800) |
| Color | purple/purple-900 | Primitive/raw token | #4c1d95 | — | Value | VibeCheck Primitives · var(--vc-purple-900) |
| Color | red/red-100 | Primitive/raw token | #fee2e2 | — | Value | VibeCheck Primitives · var(--vc-red-100) |
| Color | red/red-200 | Primitive/raw token | #fecaca | — | Value | VibeCheck Primitives · var(--vc-red-200) |
| Color | red/red-300 | Primitive/raw token | #fca5a5 | — | Value | VibeCheck Primitives · var(--vc-red-300) |
| Color | red/red-400 | Primitive/raw token | #f87171 | — | Value | VibeCheck Primitives · var(--vc-red-400) |
| Color | red/red-50 | Primitive/raw token | #fef2f2 | — | Value | VibeCheck Primitives · var(--vc-red-50) |
| Color | red/red-500 | Primitive/raw token | #ef4444 | — | Value | VibeCheck Primitives · var(--vc-red-500) |
| Color | red/red-600 | Primitive/raw token | #dc2626 | — | Value | VibeCheck Primitives · var(--vc-red-600) |
| Color | red/red-700 | Primitive/raw token | #b91c1c | — | Value | VibeCheck Primitives · var(--vc-red-700) |
| Color | red/red-800 | Primitive/raw token | #991b1b | — | Value | VibeCheck Primitives · var(--vc-red-800) |
| Color | red/red-900 | Primitive/raw token | #7f1d1d | — | Value | VibeCheck Primitives · var(--vc-red-900) |
| Color | teal/teal-100 | Primitive/raw token | #ccfbf1 | — | Value | VibeCheck Primitives · var(--vc-teal-100) |
| Color | teal/teal-200 | Primitive/raw token | #99f6e4 | — | Value | VibeCheck Primitives · var(--vc-teal-200) |
| Color | teal/teal-300 | Primitive/raw token | #5eead4 | — | Value | VibeCheck Primitives · var(--vc-teal-300) |
| Color | teal/teal-400 | Primitive/raw token | #2dd4bf | — | Value | VibeCheck Primitives · var(--vc-teal-400) |
| Color | teal/teal-50 | Primitive/raw token | #f0fdfa | — | Value | VibeCheck Primitives · var(--vc-teal-50) |
| Color | teal/teal-500 | Primitive/raw token | #14b8a6 | — | Value | VibeCheck Primitives · var(--vc-teal-500) |
| Color | teal/teal-600 | Primitive/raw token | #0d9488 | — | Value | VibeCheck Primitives · var(--vc-teal-600) |
| Color | teal/teal-700 | Primitive/raw token | #0f766e | — | Value | VibeCheck Primitives · var(--vc-teal-700) |
| Color | teal/teal-800 | Primitive/raw token | #115e59 | — | Value | VibeCheck Primitives · var(--vc-teal-800) |
| Color | teal/teal-900 | Primitive/raw token | #134e4a | — | Value | VibeCheck Primitives · var(--vc-teal-900) |
| Color | white | Primitive/raw token | #f4f4f6 | — | Value | VibeCheck Primitives · var(--vc-white) |
| Color | badge/background | Component token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-badge-background) |
| Color | badge/background | Component token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-badge-background) |
| Color | badge/pending - bg | Component token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-badge-pending-background) |
| Color | badge/pending - bg | Component token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-badge-pending-background) |
| Color | badge/pending - text | Component token | #40454f | → gray/gray-700 | Light | VibeCheck Colors · var(--vc-badge-pending-text) |
| Color | badge/pending - text | Component token | #abb0ba | → gray/gray-300 | Dark | VibeCheck Colors · var(--vc-badge-pending-text) |
| Color | badge/success - bg | Component token | #ecfccb | → green/green-100 | Light | VibeCheck Colors · var(--vc-badge-success-background) |
| Color | badge/success - bg | Component token | #ecfccb | → green/green-100 | Dark | VibeCheck Colors · var(--vc-badge-success-background) |
| Color | badge/success - text | Component token | #3f6212 | → green/green-800 | Light | VibeCheck Colors · var(--vc-badge-success-text) |
| Color | badge/success - text | Component token | #3f6212 | → green/green-800 | Dark | VibeCheck Colors · var(--vc-badge-success-text) |
| Color | badge/text | Component token | #40454f | → gray/gray-700 | Light | VibeCheck Colors · var(--vc-badge-text) |
| Color | badge/text | Component token | #abb0ba | → gray/gray-300 | Dark | VibeCheck Colors · var(--vc-badge-text) |
| Color | bg/bg | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-bg) |
| Color | bg/bg | Semantic token | #17191c | → gray/gray-900 | Dark | VibeCheck Colors · var(--vc-bg) |
| Color | bg/bg-inverse | Semantic token | #17191c | → gray/gray-900 | Light | VibeCheck Colors · var(--vc-bg-inverse) |
| Color | bg/bg-inverse | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-bg-inverse) |
| Color | border/border | Semantic token | #2e3138 | → gray/gray-800 | Light | VibeCheck Colors · var(--vc-border) |
| Color | border/border | Semantic token | #eeeff1 | → gray/gray-100 | Dark | VibeCheck Colors · var(--vc-border) |
| Color | border/border-gray-light | Semantic token | #d2d5da | → gray/gray-200 | Light | VibeCheck Colors · var(--vc-border-gray-light) |
| Color | border/border-gray-light | Semantic token | #40454f | → gray/gray-700 | Dark | VibeCheck Colors · var(--vc-border-gray-light) |
| Color | border/border-gray-medium | Semantic token | #8f96a3 | → gray/gray-400 | Light | VibeCheck Colors · var(--vc-border-gray-medium) |
| Color | border/border-gray-medium | Semantic token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-border-gray-medium) |
| Color | border/border-gray-strong | Semantic token | #5c6370 | → gray/gray-600 | Light | VibeCheck Colors · var(--vc-border-gray-strong) |
| Color | border/border-gray-strong | Semantic token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-border-gray-strong) |
| Color | border/border-inverse | Semantic token | #eeeff1 | → gray/gray-100 | Light | VibeCheck Colors · var(--vc-border-inverse) |
| Color | border/border-inverse | Semantic token | #2e3138 | → gray/gray-800 | Dark | VibeCheck Colors · var(--vc-border-inverse) |
| Color | button/button-primary | Component token | #17191c | → gray/gray-900 | Light | VibeCheck Colors · var(--vc-button-primary) |
| Color | button/button-primary | Component token | #2e3138 | → gray/gray-800 | Dark | VibeCheck Colors · var(--vc-button-primary) |
| Color | button/button-primary-hover | Component token | #5c6370 | → gray/gray-600 | Light | VibeCheck Colors · var(--vc-button-primary-hover) |
| Color | button/button-primary-hover | Component token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-button-primary-hover) |
| Color | button/button-primary-on | Component token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-button-primary-on) |
| Color | button/button-primary-on | Component token | #17191c | → gray/gray-900 | Dark | VibeCheck Colors · var(--vc-button-primary-on) |
| Color | button/button-secondary-hover | Component token | #eeeff1 | → gray/gray-100 | Light | VibeCheck Colors · var(--vc-button-secondary-hover) |
| Color | button/button-secondary-hover | Component token | #5c6370 | → gray/gray-600 | Dark | VibeCheck Colors · var(--vc-button-secondary-hover) |
| Color | icon/icon | Semantic token | #17191c | → gray/gray-900 | Light | VibeCheck Colors · var(--vc-icon) |
| Color | icon/icon | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-icon) |
| Color | icon/icon-accent | Semantic token | #9ced2b | → green/green-400 | Light | VibeCheck Colors · var(--vc-icon-accent) |
| Color | icon/icon-accent | Semantic token | #9ced2b | → green/green-400 | Dark | VibeCheck Colors · var(--vc-icon-accent) |
| Color | icon/icon-critical | Semantic token | #b91c1c | → red/red-700 | Light | VibeCheck Colors · var(--vc-icon-critical) |
| Color | icon/icon-critical | Semantic token | #f87171 | → red/red-400 | Dark | VibeCheck Colors · var(--vc-icon-critical) |
| Color | icon/icon-gray-light | Semantic token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-icon-gray-light) |
| Color | icon/icon-gray-light | Semantic token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-icon-gray-light) |
| Color | icon/icon-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Light | VibeCheck Colors · var(--vc-icon-gray-medium) |
| Color | icon/icon-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Dark | VibeCheck Colors · var(--vc-icon-gray-medium) |
| Color | icon/icon-inverse | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-icon-inverse) |
| Color | icon/icon-inverse | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-icon-inverse) |
| Color | icon/icon-subtle | Semantic token | #40454f | → gray/gray-700 | Light | VibeCheck Colors · var(--vc-icon-subtle) |
| Color | icon/icon-subtle | Semantic token | #d2d5da | → gray/gray-200 | Dark | VibeCheck Colors · var(--vc-icon-subtle) |
| Color | link/link | Semantic token | #2563eb | → blue/blue-600 | Light | VibeCheck Colors · var(--vc-link) |
| Color | link/link | Semantic token | #60a5fa | → blue/blue-400 | Dark | VibeCheck Colors · var(--vc-link) |
| Color | pin/implement | Component token | #2563eb | → blue/blue-600 | Light | VibeCheck Colors · var(--vc-pin-implement) |
| Color | pin/implement | Component token | #2563eb | → blue/blue-600 | Dark | VibeCheck Colors · var(--vc-pin-implement) |
| Color | pin/note | Component token | #7c3aed | → purple/purple-600 | Light | VibeCheck Colors · var(--vc-pin-note) |
| Color | pin/note | Component token | #7c3aed | → purple/purple-600 | Dark | VibeCheck Colors · var(--vc-pin-note) |
| Color | pin/question | Component token | #0f766e | → teal/teal-700 | Light | VibeCheck Colors · var(--vc-pin-question) |
| Color | pin/question | Component token | #0f766e | → teal/teal-700 | Dark | VibeCheck Colors · var(--vc-pin-question) |
| Color | pin/suggestion | Component token | #be185d | → pink/pink-700 | Light | VibeCheck Colors · var(--vc-pin-suggestion) |
| Color | pin/suggestion | Component token | #be185d | → pink/pink-700 | Dark | VibeCheck Colors · var(--vc-pin-suggestion) |
| Color | pin/warning | Component token | #d97706 | → amber/amber-600 | Light | VibeCheck Colors · var(--vc-pin-warning) |
| Color | pin/warning | Component token | #d97706 | → amber/amber-600 | Dark | VibeCheck Colors · var(--vc-pin-warning) |
| Color | surface/surface | Semantic token | #eeeff1 | → gray/gray-100 | Light | VibeCheck Colors · var(--vc-surface) |
| Color | surface/surface | Semantic token | #2e3138 | → gray/gray-800 | Dark | VibeCheck Colors · var(--vc-surface) |
| Color | surface/surface-input | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-surface-input) |
| Color | surface/surface-input | Semantic token | #17191c | → gray/gray-900 | Dark | VibeCheck Colors · var(--vc-surface-input) |
| Color | surface/surface-subtle | Semantic token | #d2d5da | → gray/gray-200 | Light | VibeCheck Colors · var(--vc-surface-subtle) |
| Color | surface/surface-subtle | Semantic token | #40454f | → gray/gray-700 | Dark | VibeCheck Colors · var(--vc-surface-subtle) |
| Color | text/text | Semantic token | #0b0c0e | → black | Light | VibeCheck Colors · var(--vc-text) |
| Color | text/text | Semantic token | #f4f4f6 | → white | Dark | VibeCheck Colors · var(--vc-text) |
| Color | text/text-body | Semantic token | #2e3138 | → gray/gray-800 | Light | VibeCheck Colors · var(--vc-text-body) |
| Color | text/text-body | Semantic token | #eeeff1 | → gray/gray-100 | Dark | VibeCheck Colors · var(--vc-text-body) |
| Color | text/text-critical | Semantic token | #b91c1c | → red/red-700 | Light | VibeCheck Colors · var(--vc-text-critical) |
| Color | text/text-critical | Semantic token | #f87171 | → red/red-400 | Dark | VibeCheck Colors · var(--vc-text-critical) |
| Color | text/text-gray-light | Semantic token | #abb0ba | → gray/gray-300 | Light | VibeCheck Colors · var(--vc-text-gray-light) |
| Color | text/text-gray-light | Semantic token | #8f96a3 | → gray/gray-400 | Dark | VibeCheck Colors · var(--vc-text-gray-light) |
| Color | text/text-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Light | VibeCheck Colors · var(--vc-text-gray-medium) |
| Color | text/text-gray-medium | Semantic token | #737b8c | → gray/gray-500 | Dark | VibeCheck Colors · var(--vc-text-gray-medium) |
| Color | text/text-inverse | Semantic token | #f9fafa | → gray/gray-50 | Light | VibeCheck Colors · var(--vc-text-inverse) |
| Color | text/text-inverse | Semantic token | #f9fafa | → gray/gray-50 | Dark | VibeCheck Colors · var(--vc-text-inverse) |
| Opacity | opacity/resolved | Primitive/raw token | 45 | — | Value | VibeCheck Dimensions · var(--vc-opacity-resolved) |
| Border radius | radius/12 | Primitive/raw token | 12 | — | Value | VibeCheck Dimensions · var(--vc-radius-12) |
| Border radius | radius/2 | Primitive/raw token | 2 | — | Value | VibeCheck Dimensions · var(--vc-radius-2) |
| Border radius | radius/4 | Primitive/raw token | 4 | — | Value | VibeCheck Dimensions · var(--vc-radius-4) |
| Border radius | radius/6 | Primitive/raw token | 6 | — | Value | VibeCheck Dimensions · var(--vc-radius-6) |
| Border radius | radius/8 | Primitive/raw token | 8 | — | Value | VibeCheck Dimensions · var(--vc-radius-8) |
| Border radius | radius/full | Primitive/raw token | 999 | — | Value | VibeCheck Dimensions · var(--vc-radius-full) |
| Sizing | size/card | Primitive/raw token | 300 | — | Value | VibeCheck Dimensions · var(--vc-size-card) |
| Sizing | size/panel | Primitive/raw token | 280 | — | Value | VibeCheck Dimensions · var(--vc-size-panel) |
| Sizing | size/pin | Primitive/raw token | 28 | — | Value | VibeCheck Dimensions · var(--vc-size-pin) |
| Sizing | size/tool | Primitive/raw token | 36 | — | Value | VibeCheck Dimensions · var(--vc-size-tool) |
| Spacing | spacing/0 | Primitive/raw token | 0 | — | Value | VibeCheck Dimensions · var(--vc-spacing-0) |
| Spacing | spacing/10 | Primitive/raw token | 10 | — | Value | VibeCheck Dimensions · var(--vc-spacing-10) |
| Spacing | spacing/12 | Primitive/raw token | 12 | — | Value | VibeCheck Dimensions · var(--vc-spacing-12) |
| Spacing | spacing/16 | Primitive/raw token | 16 | — | Value | VibeCheck Dimensions · var(--vc-spacing-16) |
| Spacing | spacing/2 | Primitive/raw token | 2 | — | Value | VibeCheck Dimensions · var(--vc-spacing-2) |
| Spacing | spacing/24 | Primitive/raw token | 24 | — | Value | VibeCheck Dimensions · var(--vc-spacing-24) |
| Spacing | spacing/4 | Primitive/raw token | 4 | — | Value | VibeCheck Dimensions · var(--vc-spacing-4) |
| Spacing | spacing/6 | Primitive/raw token | 6 | — | Value | VibeCheck Dimensions · var(--vc-spacing-6) |
| Spacing | spacing/8 | Primitive/raw token | 8 | — | Value | VibeCheck Dimensions · var(--vc-spacing-8) |
| Typography | VibeCheck/Body/13 | Semantic token | Inter Regular 13/19px weight 400 tracking 0px | — | n/a (text style) | Local text style |
| Typography | VibeCheck/Label/11 | Semantic token | Inter Semi Bold 11/139.9999976158142% weight 600 tracking 0px | — | n/a (text style) | Local text style |
| Typography | VibeCheck/Title/13 | Semantic token | Inter Bold 13/18px weight 700 tracking 0px | — | n/a (text style) | Local text style |
| Typography | VibeCheck/Heading/18 | Semantic token | Inter Bold 18/24px weight 700 tracking 0px | — | n/a (text style) | Local text style |
| Typography | VibeCheck/Meta/10 | Semantic token | Inter Regular 10/14px weight 400 tracking 0px | — | n/a (text style) | Local text style |
| Shadows | VibeCheck/Elevation/Pin | Component token | offset (0, 4); radius 16; spread 0; color #00000047; blendMode NORMAL | — | n/a (effect style) | Local effect style · DROP_SHADOW |
| Shadows | VibeCheck/Elevation/Card | Component token | offset (0, 16); radius 50; spread 0; color #00000047; blendMode NORMAL | — | n/a (effect style) | Local effect style · DROP_SHADOW |
| Shadows | VibeCheck/Elevation/Panel | Component token | offset (0, 12); radius 40; spread 0; color #00000038; blendMode NORMAL | — | n/a (effect style) | Local effect style · DROP_SHADOW |

---

## Appendix — WEB code syntax map (from Figma `codeSyntax.WEB`)

Present on variables (exact strings from Figma):

| Token name | codeSyntax.WEB |
|---|---|
| amber/amber-100 | `var(--vc-amber-100)` |
| amber/amber-200 | `var(--vc-amber-200)` |
| amber/amber-300 | `var(--vc-amber-300)` |
| amber/amber-400 | `var(--vc-amber-400)` |
| amber/amber-50 | `var(--vc-amber-50)` |
| amber/amber-500 | `var(--vc-amber-500)` |
| amber/amber-600 | `var(--vc-amber-600)` |
| amber/amber-700 | `var(--vc-amber-700)` |
| amber/amber-800 | `var(--vc-amber-800)` |
| amber/amber-900 | `var(--vc-amber-900)` |
| black | `var(--vc-black)` |
| blue/blue-100 | `var(--vc-blue-100)` |
| blue/blue-200 | `var(--vc-blue-200)` |
| blue/blue-300 | `var(--vc-blue-300)` |
| blue/blue-400 | `var(--vc-blue-400)` |
| blue/blue-50 | `var(--vc-blue-50)` |
| blue/blue-500 | `var(--vc-blue-500)` |
| blue/blue-600 | `var(--vc-blue-600)` |
| blue/blue-700 | `var(--vc-blue-700)` |
| blue/blue-800 | `var(--vc-blue-800)` |
| blue/blue-900 | `var(--vc-blue-900)` |
| gray/gray-100 | `var(--vc-gray-100)` |
| gray/gray-200 | `var(--vc-gray-200)` |
| gray/gray-300 | `var(--vc-gray-300)` |
| gray/gray-400 | `var(--vc-gray-400)` |
| gray/gray-50 | `var(--vc-gray-50)` |
| gray/gray-500 | `var(--vc-gray-500)` |
| gray/gray-600 | `var(--vc-gray-600)` |
| gray/gray-700 | `var(--vc-gray-700)` |
| gray/gray-800 | `var(--vc-gray-800)` |
| gray/gray-900 | `var(--vc-gray-900)` |
| green/green-100 | `var(--vc-green-100)` |
| green/green-200 | `var(--vc-green-200)` |
| green/green-300 | `var(--vc-green-300)` |
| green/green-400 | `var(--vc-green-400)` |
| green/green-50 | `var(--vc-green-50)` |
| green/green-500 | `var(--vc-green-500)` |
| green/green-600 | `var(--vc-green-600)` |
| green/green-700 | `var(--vc-green-700)` |
| green/green-800 | `var(--vc-green-800)` |
| green/green-900 | `var(--vc-green-900)` |
| pink/pink-100 | `var(--vc-pink-100)` |
| pink/pink-200 | `var(--vc-pink-200)` |
| pink/pink-300 | `var(--vc-pink-300)` |
| pink/pink-400 | `var(--vc-pink-400)` |
| pink/pink-50 | `var(--vc-pink-50)` |
| pink/pink-500 | `var(--vc-pink-500)` |
| pink/pink-600 | `var(--vc-pink-600)` |
| pink/pink-700 | `var(--vc-pink-700)` |
| pink/pink-800 | `var(--vc-pink-800)` |
| pink/pink-900 | `var(--vc-pink-900)` |
| purple/purple-100 | `var(--vc-purple-100)` |
| purple/purple-200 | `var(--vc-purple-200)` |
| purple/purple-300 | `var(--vc-purple-300)` |
| purple/purple-400 | `var(--vc-purple-400)` |
| purple/purple-50 | `var(--vc-purple-50)` |
| purple/purple-500 | `var(--vc-purple-500)` |
| purple/purple-600 | `var(--vc-purple-600)` |
| purple/purple-700 | `var(--vc-purple-700)` |
| purple/purple-800 | `var(--vc-purple-800)` |
| purple/purple-900 | `var(--vc-purple-900)` |
| red/red-100 | `var(--vc-red-100)` |
| red/red-200 | `var(--vc-red-200)` |
| red/red-300 | `var(--vc-red-300)` |
| red/red-400 | `var(--vc-red-400)` |
| red/red-50 | `var(--vc-red-50)` |
| red/red-500 | `var(--vc-red-500)` |
| red/red-600 | `var(--vc-red-600)` |
| red/red-700 | `var(--vc-red-700)` |
| red/red-800 | `var(--vc-red-800)` |
| red/red-900 | `var(--vc-red-900)` |
| teal/teal-100 | `var(--vc-teal-100)` |
| teal/teal-200 | `var(--vc-teal-200)` |
| teal/teal-300 | `var(--vc-teal-300)` |
| teal/teal-400 | `var(--vc-teal-400)` |
| teal/teal-50 | `var(--vc-teal-50)` |
| teal/teal-500 | `var(--vc-teal-500)` |
| teal/teal-600 | `var(--vc-teal-600)` |
| teal/teal-700 | `var(--vc-teal-700)` |
| teal/teal-800 | `var(--vc-teal-800)` |
| teal/teal-900 | `var(--vc-teal-900)` |
| white | `var(--vc-white)` |
| badge/background | `var(--vc-badge-background)` |
| badge/pending - bg | `var(--vc-badge-pending-background)` |
| badge/pending - text | `var(--vc-badge-pending-text)` |
| badge/success - bg | `var(--vc-badge-success-background)` |
| badge/success - text | `var(--vc-badge-success-text)` |
| badge/text | `var(--vc-badge-text)` |
| bg/bg | `var(--vc-bg)` |
| bg/bg-inverse | `var(--vc-bg-inverse)` |
| border/border | `var(--vc-border)` |
| border/border-gray-light | `var(--vc-border-gray-light)` |
| border/border-gray-medium | `var(--vc-border-gray-medium)` |
| border/border-gray-strong | `var(--vc-border-gray-strong)` |
| border/border-inverse | `var(--vc-border-inverse)` |
| button/button-primary | `var(--vc-button-primary)` |
| button/button-primary-hover | `var(--vc-button-primary-hover)` |
| button/button-primary-on | `var(--vc-button-primary-on)` |
| button/button-secondary-hover | `var(--vc-button-secondary-hover)` |
| icon/icon | `var(--vc-icon)` |
| icon/icon-accent | `var(--vc-icon-accent)` |
| icon/icon-critical | `var(--vc-icon-critical)` |
| icon/icon-gray-light | `var(--vc-icon-gray-light)` |
| icon/icon-gray-medium | `var(--vc-icon-gray-medium)` |
| icon/icon-inverse | `var(--vc-icon-inverse)` |
| icon/icon-subtle | `var(--vc-icon-subtle)` |
| link/link | `var(--vc-link)` |
| pin/implement | `var(--vc-pin-implement)` |
| pin/note | `var(--vc-pin-note)` |
| pin/question | `var(--vc-pin-question)` |
| pin/suggestion | `var(--vc-pin-suggestion)` |
| pin/warning | `var(--vc-pin-warning)` |
| surface/surface | `var(--vc-surface)` |
| surface/surface-input | `var(--vc-surface-input)` |
| surface/surface-subtle | `var(--vc-surface-subtle)` |
| text/text | `var(--vc-text)` |
| text/text-body | `var(--vc-text-body)` |
| text/text-critical | `var(--vc-text-critical)` |
| text/text-gray-light | `var(--vc-text-gray-light)` |
| text/text-gray-medium | `var(--vc-text-gray-medium)` |
| text/text-inverse | `var(--vc-text-inverse)` |
| opacity/resolved | `var(--vc-opacity-resolved)` |
| radius/12 | `var(--vc-radius-12)` |
| radius/2 | `var(--vc-radius-2)` |
| radius/4 | `var(--vc-radius-4)` |
| radius/6 | `var(--vc-radius-6)` |
| radius/8 | `var(--vc-radius-8)` |
| radius/full | `var(--vc-radius-full)` |
| size/card | `var(--vc-size-card)` |
| size/panel | `var(--vc-size-panel)` |
| size/pin | `var(--vc-size-pin)` |
| size/tool | `var(--vc-size-tool)` |
| spacing/0 | `var(--vc-spacing-0)` |
| spacing/10 | `var(--vc-spacing-10)` |
| spacing/12 | `var(--vc-spacing-12)` |
| spacing/16 | `var(--vc-spacing-16)` |
| spacing/2 | `var(--vc-spacing-2)` |
| spacing/24 | `var(--vc-spacing-24)` |
| spacing/4 | `var(--vc-spacing-4)` |
| spacing/6 | `var(--vc-spacing-6)` |
| spacing/8 | `var(--vc-spacing-8)` |

Text and effect styles have no `codeSyntax.WEB` in the Plugin API response.

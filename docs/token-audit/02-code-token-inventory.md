# 02 — Code token inventory

Repository: `design-feedback-tool`
Inventory date: 2026-09-21

Method: Parse `design-system/tokens.json` (canonical), generated CSS/JS, theme adapter CSS, runtime motion vars in `feedback-styles.js`, and `var(--vc-…)` usage in source files (excluding `app/bundle.js`, min bundles, and generated token sheets).

## Summary

| Layer | Role | Maintained how |
|---|---|---|
| `design-system/tokens.json` | Canonical token source | **Manual** |
| `design-system/generated/tokens.css` | `:root`/`:host` + `prefers-color-scheme` | **Generated** (`npm run design:sync`) |
| `design-system/generated/tokens-light.css` | Forced light `:host` | **Generated** |
| `design-system/generated/tokens-dark.css` | Forced dark `:host` | **Generated** |
| `design-system/generated/tokens.js` | `tokenCss` / `layerTokenCss` / host sheets | **Generated** |
| `extension/popup/tokens.css` | Copy of `tokens.css` | **Generated** |
| `app/components/_variables*.css` | `--theme-*` adapters + `--layer-*` z-index | **Manual** |
| `app/vibecheck/feedback-styles.js` | Motion `--vc-duration*` / `--vc-ease*` | **Manual** (not in tokens.json) |
| Tailwind / YAML / TS theme objects | — | **Not present** |

### Counts

| Group | Count | Classification |
|---|---|---|
| primitives | 82 | Primitive/raw |
| color.light / color.dark | 39 keys × 2 modes | Semantic + Component (resolved hex) |
| dimension | 21 | Primitive/raw |
| effect | 4 | Component |
| font.family | 1 | Semantic |
| runtime motion | 5 | Semantic (manual) |
| **Unique `--vc-*` from tokens.json** | **147** | |
| `var(--vc-*)` used in source | **60** | |
| defined but no `var()` consumer | **93** | |

### Theme / mode configuration

- Light default in generated `:root, :host` / `#vibecheck-layer`.
- Dark via `@media (prefers-color-scheme: dark)`.
- Forced host: `tokens-light.css` / `tokens-dark.css` via `styles.store.js` + `scheme.js` (`color-scheme`).
- Forced overlay: `#vibecheck-layer[data-scheme="light"|"dark"]`.

### Classification

1. **Primitive/raw** — `primitives`, `dimension`, `--layer-*`.
2. **Alias/reference** — `--theme-*` → `var(--vc-…)`. JSON colors are resolved hex (not code aliases).
3. **Semantic** — role colors, `--vc-font-family`, motion.
4. **Component** — `pin-*`, `badge-*`, `button-*`, `shadow-*`.
5. **Generated vs manual** — Summary table.

---

## 1. Canonical inventory (`design-system/tokens.json`)

| Category | Code token | Type | Value | Alias/reference | Mode/theme | File | Line |
|---|---|---|---|---|---|---|---|
| Color | --vc-white | Primitive/raw token | #f4f4f6 | — | all (shared) | design-system/tokens.json | 19 |
| Color | --vc-black | Primitive/raw token | #0b0c0e | — | all (shared) | design-system/tokens.json | 20 |
| Color | --vc-gray-50 | Primitive/raw token | #f9fafa | — | all (shared) | design-system/tokens.json | 21 |
| Color | --vc-gray-100 | Primitive/raw token | #eeeff1 | — | all (shared) | design-system/tokens.json | 22 |
| Color | --vc-gray-200 | Primitive/raw token | #d2d5da | — | all (shared) | design-system/tokens.json | 23 |
| Color | --vc-gray-300 | Primitive/raw token | #abb0ba | — | all (shared) | design-system/tokens.json | 24 |
| Color | --vc-gray-400 | Primitive/raw token | #8f96a3 | — | all (shared) | design-system/tokens.json | 25 |
| Color | --vc-gray-500 | Primitive/raw token | #737b8c | — | all (shared) | design-system/tokens.json | 26 |
| Color | --vc-gray-600 | Primitive/raw token | #5c6370 | — | all (shared) | design-system/tokens.json | 27 |
| Color | --vc-gray-700 | Primitive/raw token | #40454f | — | all (shared) | design-system/tokens.json | 28 |
| Color | --vc-gray-800 | Primitive/raw token | #2e3138 | — | all (shared) | design-system/tokens.json | 29 |
| Color | --vc-gray-900 | Primitive/raw token | #17191c | — | all (shared) | design-system/tokens.json | 30 |
| Color | --vc-purple-50 | Primitive/raw token | #f5f3ff | — | all (shared) | design-system/tokens.json | 31 |
| Color | --vc-purple-100 | Primitive/raw token | #ede9fe | — | all (shared) | design-system/tokens.json | 32 |
| Color | --vc-purple-200 | Primitive/raw token | #ddd6fe | — | all (shared) | design-system/tokens.json | 33 |
| Color | --vc-purple-300 | Primitive/raw token | #c4b5fd | — | all (shared) | design-system/tokens.json | 34 |
| Color | --vc-purple-400 | Primitive/raw token | #a78bfa | — | all (shared) | design-system/tokens.json | 35 |
| Color | --vc-purple-500 | Primitive/raw token | #8b5cf6 | — | all (shared) | design-system/tokens.json | 36 |
| Color | --vc-purple-600 | Primitive/raw token | #7c3aed | — | all (shared) | design-system/tokens.json | 37 |
| Color | --vc-purple-700 | Primitive/raw token | #6d28d9 | — | all (shared) | design-system/tokens.json | 38 |
| Color | --vc-purple-800 | Primitive/raw token | #5b21b6 | — | all (shared) | design-system/tokens.json | 39 |
| Color | --vc-purple-900 | Primitive/raw token | #4c1d95 | — | all (shared) | design-system/tokens.json | 40 |
| Color | --vc-pink-50 | Primitive/raw token | #fdf2f8 | — | all (shared) | design-system/tokens.json | 41 |
| Color | --vc-pink-100 | Primitive/raw token | #fce7f3 | — | all (shared) | design-system/tokens.json | 42 |
| Color | --vc-pink-200 | Primitive/raw token | #fbcfe8 | — | all (shared) | design-system/tokens.json | 43 |
| Color | --vc-pink-300 | Primitive/raw token | #f9a8d4 | — | all (shared) | design-system/tokens.json | 44 |
| Color | --vc-pink-400 | Primitive/raw token | #f472b6 | — | all (shared) | design-system/tokens.json | 45 |
| Color | --vc-pink-500 | Primitive/raw token | #ec4899 | — | all (shared) | design-system/tokens.json | 46 |
| Color | --vc-pink-600 | Primitive/raw token | #db2777 | — | all (shared) | design-system/tokens.json | 47 |
| Color | --vc-pink-700 | Primitive/raw token | #be185d | — | all (shared) | design-system/tokens.json | 48 |
| Color | --vc-pink-800 | Primitive/raw token | #9d174d | — | all (shared) | design-system/tokens.json | 49 |
| Color | --vc-pink-900 | Primitive/raw token | #831843 | — | all (shared) | design-system/tokens.json | 50 |
| Color | --vc-blue-50 | Primitive/raw token | #eff6ff | — | all (shared) | design-system/tokens.json | 51 |
| Color | --vc-blue-100 | Primitive/raw token | #dbeafe | — | all (shared) | design-system/tokens.json | 52 |
| Color | --vc-blue-200 | Primitive/raw token | #bfdbfe | — | all (shared) | design-system/tokens.json | 53 |
| Color | --vc-blue-300 | Primitive/raw token | #93c5fd | — | all (shared) | design-system/tokens.json | 54 |
| Color | --vc-blue-400 | Primitive/raw token | #60a5fa | — | all (shared) | design-system/tokens.json | 55 |
| Color | --vc-blue-500 | Primitive/raw token | #3b82f6 | — | all (shared) | design-system/tokens.json | 56 |
| Color | --vc-blue-600 | Primitive/raw token | #2563eb | — | all (shared) | design-system/tokens.json | 57 |
| Color | --vc-blue-700 | Primitive/raw token | #1d4ed8 | — | all (shared) | design-system/tokens.json | 58 |
| Color | --vc-blue-800 | Primitive/raw token | #1e40af | — | all (shared) | design-system/tokens.json | 59 |
| Color | --vc-blue-900 | Primitive/raw token | #1e3a8a | — | all (shared) | design-system/tokens.json | 60 |
| Color | --vc-amber-50 | Primitive/raw token | #fffbeb | — | all (shared) | design-system/tokens.json | 61 |
| Color | --vc-amber-100 | Primitive/raw token | #fef3c7 | — | all (shared) | design-system/tokens.json | 62 |
| Color | --vc-amber-200 | Primitive/raw token | #fde68a | — | all (shared) | design-system/tokens.json | 63 |
| Color | --vc-amber-300 | Primitive/raw token | #fcd34d | — | all (shared) | design-system/tokens.json | 64 |
| Color | --vc-amber-400 | Primitive/raw token | #fbbf24 | — | all (shared) | design-system/tokens.json | 65 |
| Color | --vc-amber-500 | Primitive/raw token | #f59e0b | — | all (shared) | design-system/tokens.json | 66 |
| Color | --vc-amber-600 | Primitive/raw token | #d97706 | — | all (shared) | design-system/tokens.json | 67 |
| Color | --vc-amber-700 | Primitive/raw token | #b45309 | — | all (shared) | design-system/tokens.json | 68 |
| Color | --vc-amber-800 | Primitive/raw token | #92400e | — | all (shared) | design-system/tokens.json | 69 |
| Color | --vc-amber-900 | Primitive/raw token | #78350f | — | all (shared) | design-system/tokens.json | 70 |
| Color | --vc-teal-50 | Primitive/raw token | #f0fdfa | — | all (shared) | design-system/tokens.json | 71 |
| Color | --vc-teal-100 | Primitive/raw token | #ccfbf1 | — | all (shared) | design-system/tokens.json | 72 |
| Color | --vc-teal-200 | Primitive/raw token | #99f6e4 | — | all (shared) | design-system/tokens.json | 73 |
| Color | --vc-teal-300 | Primitive/raw token | #5eead4 | — | all (shared) | design-system/tokens.json | 74 |
| Color | --vc-teal-400 | Primitive/raw token | #2dd4bf | — | all (shared) | design-system/tokens.json | 75 |
| Color | --vc-teal-500 | Primitive/raw token | #14b8a6 | — | all (shared) | design-system/tokens.json | 76 |
| Color | --vc-teal-600 | Primitive/raw token | #0d9488 | — | all (shared) | design-system/tokens.json | 77 |
| Color | --vc-teal-700 | Primitive/raw token | #0f766e | — | all (shared) | design-system/tokens.json | 78 |
| Color | --vc-teal-800 | Primitive/raw token | #115e59 | — | all (shared) | design-system/tokens.json | 79 |
| Color | --vc-teal-900 | Primitive/raw token | #134e4a | — | all (shared) | design-system/tokens.json | 80 |
| Color | --vc-red-50 | Primitive/raw token | #fef2f2 | — | all (shared) | design-system/tokens.json | 81 |
| Color | --vc-red-100 | Primitive/raw token | #fee2e2 | — | all (shared) | design-system/tokens.json | 82 |
| Color | --vc-red-200 | Primitive/raw token | #fecaca | — | all (shared) | design-system/tokens.json | 83 |
| Color | --vc-red-300 | Primitive/raw token | #fca5a5 | — | all (shared) | design-system/tokens.json | 84 |
| Color | --vc-red-400 | Primitive/raw token | #f87171 | — | all (shared) | design-system/tokens.json | 85 |
| Color | --vc-red-500 | Primitive/raw token | #ef4444 | — | all (shared) | design-system/tokens.json | 86 |
| Color | --vc-red-600 | Primitive/raw token | #dc2626 | — | all (shared) | design-system/tokens.json | 87 |
| Color | --vc-red-700 | Primitive/raw token | #b91c1c | — | all (shared) | design-system/tokens.json | 88 |
| Color | --vc-red-800 | Primitive/raw token | #991b1b | — | all (shared) | design-system/tokens.json | 89 |
| Color | --vc-red-900 | Primitive/raw token | #7f1d1d | — | all (shared) | design-system/tokens.json | 90 |
| Color | --vc-green-50 | Primitive/raw token | #f7fee7 | — | all (shared) | design-system/tokens.json | 91 |
| Color | --vc-green-100 | Primitive/raw token | #ecfccb | — | all (shared) | design-system/tokens.json | 92 |
| Color | --vc-green-200 | Primitive/raw token | #d9f99d | — | all (shared) | design-system/tokens.json | 93 |
| Color | --vc-green-300 | Primitive/raw token | #bef264 | — | all (shared) | design-system/tokens.json | 94 |
| Color | --vc-green-400 | Primitive/raw token | #9ced2b | — | all (shared) | design-system/tokens.json | 95 |
| Color | --vc-green-500 | Primitive/raw token | #84cc16 | — | all (shared) | design-system/tokens.json | 96 |
| Color | --vc-green-600 | Primitive/raw token | #65a30d | — | all (shared) | design-system/tokens.json | 97 |
| Color | --vc-green-700 | Primitive/raw token | #4d7c0f | — | all (shared) | design-system/tokens.json | 98 |
| Color | --vc-green-800 | Primitive/raw token | #3f6212 | — | all (shared) | design-system/tokens.json | 99 |
| Color | --vc-green-900 | Primitive/raw token | #365314 | — | all (shared) | design-system/tokens.json | 100 |
| Color | --vc-pin-note | Component token | #7c3aed | value matches primitive purple-600 (not a code-level alias) | light | design-system/tokens.json | 104 |
| Color | --vc-pin-implement | Component token | #2563eb | value matches primitive blue-600 (not a code-level alias) | light | design-system/tokens.json | 105 |
| Color | --vc-pin-warning | Component token | #d97706 | value matches primitive amber-600 (not a code-level alias) | light | design-system/tokens.json | 106 |
| Color | --vc-pin-question | Component token | #0f766e | value matches primitive teal-700 (not a code-level alias) | light | design-system/tokens.json | 107 |
| Color | --vc-pin-suggestion | Component token | #be185d | value matches primitive pink-700 (not a code-level alias) | light | design-system/tokens.json | 108 |
| Color | --vc-badge-background | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 109 |
| Color | --vc-badge-text | Component token | #40454f | value matches primitive gray-700 (not a code-level alias) | light | design-system/tokens.json | 110 |
| Color | --vc-badge-pending-background | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 111 |
| Color | --vc-badge-pending-text | Component token | #40454f | value matches primitive gray-700 (not a code-level alias) | light | design-system/tokens.json | 112 |
| Color | --vc-badge-success-background | Component token | #ecfccb | value matches primitive green-100 (not a code-level alias) | light | design-system/tokens.json | 113 |
| Color | --vc-badge-success-text | Component token | #3f6212 | value matches primitive green-800 (not a code-level alias) | light | design-system/tokens.json | 114 |
| Color | --vc-text-critical | Semantic token | #b91c1c | value matches primitive red-700 (not a code-level alias) | light | design-system/tokens.json | 115 |
| Color | --vc-text | Semantic token | #0b0c0e | value matches primitive black (not a code-level alias) | light | design-system/tokens.json | 116 |
| Color | --vc-text-body | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | light | design-system/tokens.json | 117 |
| Color | --vc-text-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | light | design-system/tokens.json | 118 |
| Color | --vc-text-gray-light | Semantic token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 119 |
| Color | --vc-text-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 120 |
| Color | --vc-bg | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 121 |
| Color | --vc-bg-inverse | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | light | design-system/tokens.json | 122 |
| Color | --vc-surface-input | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 123 |
| Color | --vc-surface | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | light | design-system/tokens.json | 124 |
| Color | --vc-surface-subtle | Semantic token | #d2d5da | value matches primitive gray-200 (not a code-level alias) | light | design-system/tokens.json | 125 |
| Color | --vc-border | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | light | design-system/tokens.json | 126 |
| Color | --vc-border-gray-light | Semantic token | #d2d5da | value matches primitive gray-200 (not a code-level alias) | light | design-system/tokens.json | 127 |
| Color | --vc-border-gray-medium | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | light | design-system/tokens.json | 128 |
| Color | --vc-border-gray-strong | Semantic token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | light | design-system/tokens.json | 129 |
| Color | --vc-border-inverse | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | light | design-system/tokens.json | 130 |
| Color | --vc-link | Semantic token | #2563eb | value matches primitive blue-600 (not a code-level alias) | light | design-system/tokens.json | 131 |
| Color | --vc-icon-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 132 |
| Color | --vc-icon-accent | Semantic token | #9ced2b | value matches primitive green-400 (not a code-level alias) | light | design-system/tokens.json | 133 |
| Color | --vc-icon | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | light | design-system/tokens.json | 134 |
| Color | --vc-icon-subtle | Semantic token | #40454f | value matches primitive gray-700 (not a code-level alias) | light | design-system/tokens.json | 135 |
| Color | --vc-icon-critical | Semantic token | #b91c1c | value matches primitive red-700 (not a code-level alias) | light | design-system/tokens.json | 136 |
| Color | --vc-icon-gray-light | Semantic token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 137 |
| Color | --vc-icon-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | light | design-system/tokens.json | 138 |
| Color | --vc-button-primary | Component token | #17191c | value matches primitive gray-900 (not a code-level alias) | light | design-system/tokens.json | 139 |
| Color | --vc-button-primary-on | Component token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 140 |
| Color | --vc-button-primary-hover | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | light | design-system/tokens.json | 141 |
| Color | --vc-button-secondary-hover | Component token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | light | design-system/tokens.json | 142 |
| Color | --vc-pin-note | Component token | #7c3aed | value matches primitive purple-600 (not a code-level alias) | dark | design-system/tokens.json | 145 |
| Color | --vc-pin-implement | Component token | #2563eb | value matches primitive blue-600 (not a code-level alias) | dark | design-system/tokens.json | 146 |
| Color | --vc-pin-warning | Component token | #d97706 | value matches primitive amber-600 (not a code-level alias) | dark | design-system/tokens.json | 147 |
| Color | --vc-pin-question | Component token | #0f766e | value matches primitive teal-700 (not a code-level alias) | dark | design-system/tokens.json | 148 |
| Color | --vc-pin-suggestion | Component token | #be185d | value matches primitive pink-700 (not a code-level alias) | dark | design-system/tokens.json | 149 |
| Color | --vc-badge-background | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 150 |
| Color | --vc-badge-text | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | dark | design-system/tokens.json | 151 |
| Color | --vc-badge-pending-background | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 152 |
| Color | --vc-badge-pending-text | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | dark | design-system/tokens.json | 153 |
| Color | --vc-badge-success-background | Component token | #ecfccb | value matches primitive green-100 (not a code-level alias) | dark | design-system/tokens.json | 154 |
| Color | --vc-badge-success-text | Component token | #3f6212 | value matches primitive green-800 (not a code-level alias) | dark | design-system/tokens.json | 155 |
| Color | --vc-text-critical | Semantic token | #f87171 | value matches primitive red-400 (not a code-level alias) | dark | design-system/tokens.json | 156 |
| Color | --vc-text | Semantic token | #f4f4f6 | value matches primitive white (not a code-level alias) | dark | design-system/tokens.json | 157 |
| Color | --vc-text-body | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | dark | design-system/tokens.json | 158 |
| Color | --vc-text-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | dark | design-system/tokens.json | 159 |
| Color | --vc-text-gray-light | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 160 |
| Color | --vc-text-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 161 |
| Color | --vc-bg | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | dark | design-system/tokens.json | 162 |
| Color | --vc-bg-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 163 |
| Color | --vc-surface-input | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | dark | design-system/tokens.json | 164 |
| Color | --vc-surface | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | dark | design-system/tokens.json | 165 |
| Color | --vc-surface-subtle | Semantic token | #40454f | value matches primitive gray-700 (not a code-level alias) | dark | design-system/tokens.json | 166 |
| Color | --vc-border | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | dark | design-system/tokens.json | 167 |
| Color | --vc-border-gray-light | Semantic token | #40454f | value matches primitive gray-700 (not a code-level alias) | dark | design-system/tokens.json | 168 |
| Color | --vc-border-gray-medium | Semantic token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 169 |
| Color | --vc-border-gray-strong | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 170 |
| Color | --vc-border-inverse | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | dark | design-system/tokens.json | 171 |
| Color | --vc-link | Semantic token | #60a5fa | value matches primitive blue-400 (not a code-level alias) | dark | design-system/tokens.json | 172 |
| Color | --vc-icon-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 173 |
| Color | --vc-icon-accent | Semantic token | #9ced2b | value matches primitive green-400 (not a code-level alias) | dark | design-system/tokens.json | 174 |
| Color | --vc-icon | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 175 |
| Color | --vc-icon-subtle | Semantic token | #d2d5da | value matches primitive gray-200 (not a code-level alias) | dark | design-system/tokens.json | 176 |
| Color | --vc-icon-critical | Semantic token | #f87171 | value matches primitive red-400 (not a code-level alias) | dark | design-system/tokens.json | 177 |
| Color | --vc-icon-gray-light | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 178 |
| Color | --vc-icon-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | dark | design-system/tokens.json | 179 |
| Color | --vc-button-primary | Component token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | dark | design-system/tokens.json | 180 |
| Color | --vc-button-primary-on | Component token | #17191c | value matches primitive gray-900 (not a code-level alias) | dark | design-system/tokens.json | 181 |
| Color | --vc-button-primary-hover | Component token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 182 |
| Color | --vc-button-secondary-hover | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 183 |
| Spacing | --vc-spacing-0 | Primitive/raw token | 0px | — | all (shared) | design-system/tokens.json | 187 |
| Spacing | --vc-spacing-2 | Primitive/raw token | 2px | — | all (shared) | design-system/tokens.json | 188 |
| Spacing | --vc-spacing-4 | Primitive/raw token | 4px | — | all (shared) | design-system/tokens.json | 189 |
| Spacing | --vc-spacing-6 | Primitive/raw token | 6px | — | all (shared) | design-system/tokens.json | 190 |
| Spacing | --vc-spacing-8 | Primitive/raw token | 8px | — | all (shared) | design-system/tokens.json | 191 |
| Spacing | --vc-spacing-10 | Primitive/raw token | 10px | — | all (shared) | design-system/tokens.json | 192 |
| Spacing | --vc-spacing-12 | Primitive/raw token | 12px | — | all (shared) | design-system/tokens.json | 193 |
| Spacing | --vc-spacing-16 | Primitive/raw token | 16px | — | all (shared) | design-system/tokens.json | 194 |
| Spacing | --vc-spacing-24 | Primitive/raw token | 24px | — | all (shared) | design-system/tokens.json | 195 |
| Border radius | --vc-radius-2 | Primitive/raw token | 2px | — | all (shared) | design-system/tokens.json | 196 |
| Border radius | --vc-radius-4 | Primitive/raw token | 4px | — | all (shared) | design-system/tokens.json | 197 |
| Border radius | --vc-radius-6 | Primitive/raw token | 6px | — | all (shared) | design-system/tokens.json | 198 |
| Border radius | --vc-radius-8 | Primitive/raw token | 8px | — | all (shared) | design-system/tokens.json | 199 |
| Border radius | --vc-radius-12 | Primitive/raw token | 12px | — | all (shared) | design-system/tokens.json | 200 |
| Border radius | --vc-radius-full | Primitive/raw token | 999px | — | all (shared) | design-system/tokens.json | 201 |
| Sizing | --vc-size-pin | Primitive/raw token | 28px | — | all (shared) | design-system/tokens.json | 202 |
| Sizing | --vc-size-tool | Primitive/raw token | 36px | — | all (shared) | design-system/tokens.json | 203 |
| Sizing | --vc-size-panel | Primitive/raw token | 280px | — | all (shared) | design-system/tokens.json | 204 |
| Sizing | --vc-size-card | Primitive/raw token | 300px | — | all (shared) | design-system/tokens.json | 205 |
| Sizing | --vc-size-popup | Primitive/raw token | 320px | — | all (shared) | design-system/tokens.json | 206 |
| Opacity | --vc-opacity-resolved | Primitive/raw token | 0.45 | — | all (shared) | design-system/tokens.json | 207 |
| Shadows | --vc-shadow-pin | Component token | 0 4px 16px rgb(0 0 0 / 28%) | — | all (shared) | design-system/tokens.json | 210 |
| Shadows | --vc-shadow-card | Component token | 0 16px 50px rgb(0 0 0 / 28%) | — | all (shared) | design-system/tokens.json | 211 |
| Shadows | --vc-shadow-panel | Component token | 0 12px 40px rgb(0 0 0 / 22%) | — | all (shared) | design-system/tokens.json | 212 |
| Shadows | --vc-shadow-pin-open | Component token | 0 4px 16px rgb(0 0 0 / 28%) | — | all (shared) | design-system/tokens.json | 213 |
| Font family | --vc-font-family | Semantic token | system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif | — | all (shared) | design-system/tokens.json | 216 |

### Generated CSS line map (`design-system/generated/tokens.css`)

| Code token | Mode | Line |
|---|---|---|
| --vc-white | all (shared) | 42 |
| --vc-black | all (shared) | 43 |
| --vc-gray-50 | all (shared) | 44 |
| --vc-gray-100 | all (shared) | 45 |
| --vc-gray-200 | all (shared) | 46 |
| --vc-gray-300 | all (shared) | 47 |
| --vc-gray-400 | all (shared) | 48 |
| --vc-gray-500 | all (shared) | 49 |
| --vc-gray-600 | all (shared) | 50 |
| --vc-gray-700 | all (shared) | 51 |
| --vc-gray-800 | all (shared) | 52 |
| --vc-gray-900 | all (shared) | 53 |
| --vc-purple-50 | all (shared) | 54 |
| --vc-purple-100 | all (shared) | 55 |
| --vc-purple-200 | all (shared) | 56 |
| --vc-purple-300 | all (shared) | 57 |
| --vc-purple-400 | all (shared) | 58 |
| --vc-purple-500 | all (shared) | 59 |
| --vc-purple-600 | all (shared) | 60 |
| --vc-purple-700 | all (shared) | 61 |
| --vc-purple-800 | all (shared) | 62 |
| --vc-purple-900 | all (shared) | 63 |
| --vc-pink-50 | all (shared) | 64 |
| --vc-pink-100 | all (shared) | 65 |
| --vc-pink-200 | all (shared) | 66 |
| --vc-pink-300 | all (shared) | 67 |
| --vc-pink-400 | all (shared) | 68 |
| --vc-pink-500 | all (shared) | 69 |
| --vc-pink-600 | all (shared) | 70 |
| --vc-pink-700 | all (shared) | 71 |
| --vc-pink-800 | all (shared) | 72 |
| --vc-pink-900 | all (shared) | 73 |
| --vc-blue-50 | all (shared) | 74 |
| --vc-blue-100 | all (shared) | 75 |
| --vc-blue-200 | all (shared) | 76 |
| --vc-blue-300 | all (shared) | 77 |
| --vc-blue-400 | all (shared) | 78 |
| --vc-blue-500 | all (shared) | 79 |
| --vc-blue-600 | all (shared) | 80 |
| --vc-blue-700 | all (shared) | 81 |
| --vc-blue-800 | all (shared) | 82 |
| --vc-blue-900 | all (shared) | 83 |
| --vc-amber-50 | all (shared) | 84 |
| --vc-amber-100 | all (shared) | 85 |
| --vc-amber-200 | all (shared) | 86 |
| --vc-amber-300 | all (shared) | 87 |
| --vc-amber-400 | all (shared) | 88 |
| --vc-amber-500 | all (shared) | 89 |
| --vc-amber-600 | all (shared) | 90 |
| --vc-amber-700 | all (shared) | 91 |
| --vc-amber-800 | all (shared) | 92 |
| --vc-amber-900 | all (shared) | 93 |
| --vc-teal-50 | all (shared) | 94 |
| --vc-teal-100 | all (shared) | 95 |
| --vc-teal-200 | all (shared) | 96 |
| --vc-teal-300 | all (shared) | 97 |
| --vc-teal-400 | all (shared) | 98 |
| --vc-teal-500 | all (shared) | 99 |
| --vc-teal-600 | all (shared) | 100 |
| --vc-teal-700 | all (shared) | 101 |
| --vc-teal-800 | all (shared) | 102 |
| --vc-teal-900 | all (shared) | 103 |
| --vc-red-50 | all (shared) | 104 |
| --vc-red-100 | all (shared) | 105 |
| --vc-red-200 | all (shared) | 106 |
| --vc-red-300 | all (shared) | 107 |
| --vc-red-400 | all (shared) | 108 |
| --vc-red-500 | all (shared) | 109 |
| --vc-red-600 | all (shared) | 110 |
| --vc-red-700 | all (shared) | 111 |
| --vc-red-800 | all (shared) | 112 |
| --vc-red-900 | all (shared) | 113 |
| --vc-green-50 | all (shared) | 114 |
| --vc-green-100 | all (shared) | 115 |
| --vc-green-200 | all (shared) | 116 |
| --vc-green-300 | all (shared) | 117 |
| --vc-green-400 | all (shared) | 118 |
| --vc-green-500 | all (shared) | 119 |
| --vc-green-600 | all (shared) | 120 |
| --vc-green-700 | all (shared) | 121 |
| --vc-green-800 | all (shared) | 122 |
| --vc-green-900 | all (shared) | 123 |
| --vc-pin-note | light | 3 |
| --vc-pin-implement | light | 4 |
| --vc-pin-warning | light | 5 |
| --vc-pin-question | light | 6 |
| --vc-pin-suggestion | light | 7 |
| --vc-badge-background | light | 8 |
| --vc-badge-text | light | 9 |
| --vc-badge-pending-background | light | 10 |
| --vc-badge-pending-text | light | 11 |
| --vc-badge-success-background | light | 12 |
| --vc-badge-success-text | light | 13 |
| --vc-text-critical | light | 14 |
| --vc-text | light | 15 |
| --vc-text-body | light | 16 |
| --vc-text-gray-medium | light | 17 |
| --vc-text-gray-light | light | 18 |
| --vc-text-inverse | light | 19 |
| --vc-bg | light | 20 |
| --vc-bg-inverse | light | 21 |
| --vc-surface-input | light | 22 |
| --vc-surface | light | 23 |
| --vc-surface-subtle | light | 24 |
| --vc-border | light | 25 |
| --vc-border-gray-light | light | 26 |
| --vc-border-gray-medium | light | 27 |
| --vc-border-gray-strong | light | 28 |
| --vc-border-inverse | light | 29 |
| --vc-link | light | 30 |
| --vc-icon-inverse | light | 31 |
| --vc-icon-accent | light | 32 |
| --vc-icon | light | 33 |
| --vc-icon-subtle | light | 34 |
| --vc-icon-critical | light | 35 |
| --vc-icon-gray-light | light | 36 |
| --vc-icon-gray-medium | light | 37 |
| --vc-button-primary | light | 38 |
| --vc-button-primary-on | light | 39 |
| --vc-button-primary-hover | light | 40 |
| --vc-button-secondary-hover | light | 41 |
| --vc-pin-note | dark | 154 |
| --vc-pin-implement | dark | 155 |
| --vc-pin-warning | dark | 156 |
| --vc-pin-question | dark | 157 |
| --vc-pin-suggestion | dark | 158 |
| --vc-badge-background | dark | 159 |
| --vc-badge-text | dark | 160 |
| --vc-badge-pending-background | dark | 161 |
| --vc-badge-pending-text | dark | 162 |
| --vc-badge-success-background | dark | 163 |
| --vc-badge-success-text | dark | 164 |
| --vc-text-critical | dark | 165 |
| --vc-text | dark | 166 |
| --vc-text-body | dark | 167 |
| --vc-text-gray-medium | dark | 168 |
| --vc-text-gray-light | dark | 169 |
| --vc-text-inverse | dark | 170 |
| --vc-bg | dark | 171 |
| --vc-bg-inverse | dark | 172 |
| --vc-surface-input | dark | 173 |
| --vc-surface | dark | 174 |
| --vc-surface-subtle | dark | 175 |
| --vc-border | dark | 176 |
| --vc-border-gray-light | dark | 177 |
| --vc-border-gray-medium | dark | 178 |
| --vc-border-gray-strong | dark | 179 |
| --vc-border-inverse | dark | 180 |
| --vc-link | dark | 181 |
| --vc-icon-inverse | dark | 182 |
| --vc-icon-accent | dark | 183 |
| --vc-icon | dark | 184 |
| --vc-icon-subtle | dark | 185 |
| --vc-icon-critical | dark | 186 |
| --vc-icon-gray-light | dark | 187 |
| --vc-icon-gray-medium | dark | 188 |
| --vc-button-primary | dark | 189 |
| --vc-button-primary-on | dark | 190 |
| --vc-button-primary-hover | dark | 191 |
| --vc-button-secondary-hover | dark | 192 |
| --vc-spacing-0 | all (shared) | 124 |
| --vc-spacing-2 | all (shared) | 125 |
| --vc-spacing-4 | all (shared) | 126 |
| --vc-spacing-6 | all (shared) | 127 |
| --vc-spacing-8 | all (shared) | 128 |
| --vc-spacing-10 | all (shared) | 129 |
| --vc-spacing-12 | all (shared) | 130 |
| --vc-spacing-16 | all (shared) | 131 |
| --vc-spacing-24 | all (shared) | 132 |
| --vc-radius-2 | all (shared) | 133 |
| --vc-radius-4 | all (shared) | 134 |
| --vc-radius-6 | all (shared) | 135 |
| --vc-radius-8 | all (shared) | 136 |
| --vc-radius-12 | all (shared) | 137 |
| --vc-radius-full | all (shared) | 138 |
| --vc-size-pin | all (shared) | 139 |
| --vc-size-tool | all (shared) | 140 |
| --vc-size-panel | all (shared) | 141 |
| --vc-size-card | all (shared) | 142 |
| --vc-size-popup | all (shared) | 143 |
| --vc-opacity-resolved | all (shared) | 144 |
| --vc-shadow-pin | all (shared) | 145 |
| --vc-shadow-card | all (shared) | 146 |
| --vc-shadow-panel | all (shared) | 147 |
| --vc-shadow-pin-open | all (shared) | 148 |
| --vc-font-family | all (shared) | 149 |

Also generated: `tokens-light.css`, `tokens-dark.css`, `tokens.js`, `extension/popup/tokens.css`.

---

## 2. Runtime motion tokens (manual)

| Category | Code token | Type | Value | Alias/reference | Mode/theme | File | Line |
|---|---|---|---|---|---|---|---|
| Motion or duration | --vc-duration-fast | Semantic token | 140ms | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 15 |
| Motion or duration | --vc-duration | Semantic token | 200ms | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 16 |
| Motion or duration | --vc-duration-panel | Semantic token | 280ms | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 17 |
| Motion or duration | --vc-ease | Semantic token | cubic-bezier(0.32, 0.72, 0, 1) | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 18 |
| Motion or duration | --vc-ease-soft | Semantic token | cubic-bezier(0.25, 0.1, 0.25, 1) | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 19 |
| Motion or duration | --vc-duration-* (reduced motion) | Semantic token | 0.01ms overrides | — | @media (prefers-reduced-motion: reduce) | app/vibecheck/feedback-styles.js | 24–26 |

| Category | Code token | Type | Value | Alias/reference | Mode/theme | File | Line |
|---|---|---|---|---|---|---|---|
| Color | --vc-card-accent | Component token | Runtime per-card / fallback var(--vc-pin-note) | → pin vars | runtime | app/vibecheck/feedback-styles.js | 231 |

`--vc-card-accent` lines: 231, 615, 728, 844, 845, 846, 847, 848.

---

## 3. Theme adapter & z-index (`_variables*.css`)

| Category | Code token | Type | Value | Alias/reference | Mode/theme | File | Line |
|---|---|---|---|---|---|---|---|
| Theme adapter | --theme-bg | Alias/reference token | var(--vc-surface) | var(--vc-surface) | light/default (:host) | app/components/_variables.css | 8 |
| Theme adapter | --theme-bd | Semantic token | hsl(0 0% 100% / var(--theme-bd-opacity)) | — | light/default (:host) | app/components/_variables.css | 9 |
| Theme adapter | --theme-bd-2 | Alias/reference token | var(--vc-surface) | var(--vc-surface) | light/default (:host) | app/components/_variables.css | 11 |
| Theme adapter | --theme-bd-opacity | Semantic token | 1 | — | light/default (:host) | app/components/_variables.css | 12 |
| Theme adapter | --theme-bd-2-opacity | Semantic token | 1 | — | light/default (:host) | app/components/_variables.css | 13 |
| Theme adapter | --theme-color | Semantic token | hotpink | — | light/default (:host) | app/components/_variables.css | 14 |
| Theme adapter | --theme-blue | Semantic token | hsl(188 90% 45%) | — | light/default (:host) | app/components/_variables.css | 15 |
| Theme adapter | --theme-purple | Semantic token | hsl(267 100% 58%) | — | light/default (:host) | app/components/_variables.css | 16 |
| Theme adapter | --theme-text_color | Alias/reference token | var(--vc-text) | var(--vc-text) | light/default (:host) | app/components/_variables.css | 23 |
| Theme adapter | --theme-icon_color | Alias/reference token | var(--vc-icon-subtle) | var(--vc-icon-subtle) | light/default (:host) | app/components/_variables.css | 24 |
| Theme adapter | --theme-icon_hover-bg | Alias/reference token | var(--vc-button-secondary-hover) | var(--vc-button-secondary-hover) | light/default (:host) | app/components/_variables.css | 25 |
| Theme adapter | --theme-icon_active-bg | Alias/reference token | var(--vc-button-primary) | var(--vc-button-primary) | light/default (:host) | app/components/_variables.css | 26 |
| Theme adapter | --theme-icon_active-color | Alias/reference token | var(--vc-icon-accent) | var(--vc-icon-accent) | light/default (:host) | app/components/_variables.css | 27 |
| Z-index | --layer-top | Primitive/raw token | 2147483647 | — | :host | app/components/_variables.css | 29 |
| Z-index | --layer-1 | Primitive/raw token | 2147483646 | — | :host | app/components/_variables.css | 30 |
| Z-index | --layer-2 | Primitive/raw token | 2147483645 | — | :host | app/components/_variables.css | 31 |
| Z-index | --layer-3 | Primitive/raw token | 2147483644 | — | :host | app/components/_variables.css | 32 |
| Z-index | --layer-4 | Primitive/raw token | 2147483643 | — | :host | app/components/_variables.css | 33 |
| Z-index | --layer-5 | Primitive/raw token | 2147483642 | — | :host | app/components/_variables.css | 34 |
| Theme adapter | --theme-bg | Alias/reference token | var(--vc-surface) | var(--vc-surface) | dark (media) | app/components/_variables.css | 43 |
| Theme adapter | --theme-bd | Semantic token | hsl(var(--gray-10-hsl) / var(--theme-bd-opacity)) | — | dark (media) | app/components/_variables.css | 44 |
| Theme adapter | --theme-bd-2 | Alias/reference token | var(--vc-surface) | var(--vc-surface) | dark (media) | app/components/_variables.css | 45 |
| Theme adapter | --theme-color | Semantic token | hsl(330deg 65% 75%) | — | dark (media) | app/components/_variables.css | 46 |
| Theme adapter | --theme-text_color | Alias/reference token | var(--vc-text) | var(--vc-text) | dark (media) | app/components/_variables.css | 47 |
| Theme adapter | --theme-icon_color | Alias/reference token | var(--vc-icon-subtle) | var(--vc-icon-subtle) | dark (media) | app/components/_variables.css | 48 |
| Theme adapter | --theme-icon_hover-bg | Alias/reference token | var(--vc-button-secondary-hover) | var(--vc-button-secondary-hover) | dark (media) | app/components/_variables.css | 49 |
| Theme adapter | --theme-icon_active-bg | Alias/reference token | var(--vc-button-primary) | var(--vc-button-primary) | dark (media) | app/components/_variables.css | 50 |
| Theme adapter | --theme-icon_active-color | Alias/reference token | var(--vc-icon-accent) | var(--vc-icon-accent) | dark (media) | app/components/_variables.css | 51 |
| Theme adapter | --theme-bd-opacity | Semantic token | .8 | — | dark (media) | app/components/_variables.css | 55 |
| Theme adapter | --theme-bd-opacity | Semantic token | .8 | — | dark (media) | app/components/_variables.css | 59 |
| Theme adapter | --theme-bg | Alias/reference token | var(--vc-surface) | var(--vc-surface) | light (forced host) | app/components/_variables_light.css | 4 |
| Theme adapter | --theme-bd | Semantic token | hsl(0 0% 100% / var(--theme-bd-opacity)) | — | light (forced host) | app/components/_variables_light.css | 5 |
| Theme adapter | --theme-bd-2 | Alias/reference token | var(--vc-surface) | var(--vc-surface) | light (forced host) | app/components/_variables_light.css | 6 |
| Theme adapter | --theme-color | Semantic token | hotpink | — | light (forced host) | app/components/_variables_light.css | 7 |
| Theme adapter | --theme-text_color | Alias/reference token | var(--vc-text) | var(--vc-text) | light (forced host) | app/components/_variables_light.css | 8 |
| Theme adapter | --theme-icon_color | Alias/reference token | var(--vc-icon-subtle) | var(--vc-icon-subtle) | light (forced host) | app/components/_variables_light.css | 9 |
| Theme adapter | --theme-icon_hover-bg | Alias/reference token | var(--vc-button-secondary-hover) | var(--vc-button-secondary-hover) | light (forced host) | app/components/_variables_light.css | 10 |
| Theme adapter | --theme-icon_active-bg | Alias/reference token | var(--vc-button-primary) | var(--vc-button-primary) | light (forced host) | app/components/_variables_light.css | 11 |
| Theme adapter | --theme-bg | Alias/reference token | var(--vc-surface) | var(--vc-surface) | dark (forced host) | app/components/_variables_dark.css | 4 |
| Theme adapter | --theme-bd | Semantic token | hsl(0 0% 10% / var(--theme-bd-opacity)) | — | dark (forced host) | app/components/_variables_dark.css | 5 |
| Theme adapter | --theme-bd-2 | Alias/reference token | var(--vc-surface) | var(--vc-surface) | dark (forced host) | app/components/_variables_dark.css | 6 |
| Theme adapter | --theme-color | Semantic token | hsl(330deg 65% 75%) | — | dark (forced host) | app/components/_variables_dark.css | 7 |
| Theme adapter | --theme-text_color | Alias/reference token | var(--vc-text) | var(--vc-text) | dark (forced host) | app/components/_variables_dark.css | 8 |
| Theme adapter | --theme-icon_color | Alias/reference token | var(--vc-icon-subtle) | var(--vc-icon-subtle) | dark (forced host) | app/components/_variables_dark.css | 9 |
| Theme adapter | --theme-icon_hover-bg | Alias/reference token | var(--vc-button-secondary-hover) | var(--vc-button-secondary-hover) | dark (forced host) | app/components/_variables_dark.css | 10 |
| Theme adapter | --theme-icon_active-bg | Alias/reference token | var(--vc-button-primary) | var(--vc-button-primary) | dark (forced host) | app/components/_variables_dark.css | 11 |

Non-contract vars also in `_variables.css`: `--theme-color`, `--theme-blue`, `--theme-purple`, `--neon-*`, `--text-shadow`, `--theme-bd` / opacities (Open Props).

---

## 4. Tokens defined but never used

Criterion: no `var(--token)` in source CSS/JS under `app/` or `extension/` (excluding generated token sheets and bundles).

| Code token | Type guess | Notes |
|---|---|---|
| `--vc-amber-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-amber-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-badge-background` | Component | No `var()` consumer in source |
| `--vc-badge-text` | Component | No `var()` consumer in source |
| `--vc-bg-inverse` | Semantic / dimension | No `var()` consumer in source |
| `--vc-black` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-blue-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-border-gray-strong` | Semantic / dimension | No `var()` consumer in source |
| `--vc-border-inverse` | Semantic / dimension | No `var()` consumer in source |
| `--vc-button-primary-hover` | Component | No `var()` consumer in source |
| `--vc-ease-soft` | Motion | No `var()` consumer in source |
| `--vc-gray-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-gray-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-green-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-icon-critical` | Semantic / dimension | No `var()` consumer in source |
| `--vc-icon-gray-light` | Semantic / dimension | No `var()` consumer in source |
| `--vc-icon-gray-medium` | Semantic / dimension | No `var()` consumer in source |
| `--vc-pink-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-pink-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-purple-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-radius-2` | Semantic / dimension | No `var()` consumer in source |
| `--vc-red-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-red-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-size-card` | Semantic / dimension | No `var()` consumer in source |
| `--vc-spacing-0` | Semantic / dimension | No `var()` consumer in source |
| `--vc-teal-100` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-200` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-300` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-400` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-50` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-500` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-600` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-700` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-800` | Primitive/raw | No `var()` consumer in source |
| `--vc-teal-900` | Primitive/raw | No `var()` consumer in source |
| `--vc-text-body` | Semantic / dimension | No `var()` consumer in source |
| `--vc-white` | Primitive/raw | No `var()` consumer in source |

Unused: **93** / **153** unique `--vc-*` names.

### Used via `var()` (top references)

| Code token | `var()` count | Example files |
|---|---|---|
| `--vc-text` | 59 | app/components/_variables.css, app/components/_variables_dark.css, app/components/_variables_light.css |
| `--vc-duration` | 48 | app/vibecheck/feedback-styles.js |
| `--vc-ease` | 48 | app/vibecheck/feedback-styles.js |
| `--vc-surface` | 33 | app/components/_variables.css, app/components/_variables_dark.css |
| `--vc-duration-fast` | 31 | app/vibecheck/feedback-styles.js |
| `--vc-spacing-8` | 25 | app/vibecheck/feedback-styles.js |
| `--vc-font-family` | 25 | app/vibecheck/feedback-styles.js |
| `--vc-spacing-4` | 23 | app/components/vibe-check/vibe-check.element.css, app/vibecheck/feedback-styles.js |
| `--vc-spacing-12` | 16 | app/vibecheck/feedback-styles.js |
| `--vc-text-gray-medium` | 12 | app/vibecheck/feedback-styles.js |
| `--vc-border` | 12 | app/components/vibe-check/vibe-check.element.css, app/components/vibe-check/vibe-check.element.js, app/vibecheck/feedback-styles.js |
| `--vc-button-primary` | 12 | app/components/_variables.css, app/components/_variables_dark.css, app/components/_variables_light.css |
| `--vc-surface-subtle` | 11 | app/components/vibe-check/vibe-check.element.css, app/vibecheck/feedback-styles.js |
| `--vc-icon` | 11 | app/components/_variables.css, app/components/_variables_dark.css |
| `--vc-text-gray-light` | 10 | app/vibecheck/feedback-styles.js |
| `--vc-radius-6` | 8 | app/components/vibe-check/vibe-check.element.css, app/components/vibe-check/vibe-check.element.js, app/vibecheck/feedback-styles.js |
| `--vc-radius-8` | 8 | app/vibecheck/feedback-styles.js |
| `--vc-radius-full` | 8 | app/vibecheck/feedback-styles.js |
| `--vc-pin-note` | 7 | app/vibecheck/feedback-styles.js |
| `--vc-text-critical` | 7 | app/vibecheck/feedback-styles.js |
| `--vc-button-secondary-hover` | 7 | app/components/_variables.css, app/components/_variables_dark.css, app/components/_variables_light.css |
| `--vc-radius-12` | 6 | app/vibecheck/feedback-styles.js |
| `--vc-pin-implement` | 5 | app/vibecheck/feedback-styles.js |
| `--vc-icon-inverse` | 5 | app/vibecheck/feedback-styles.js |
| `--vc-spacing-6` | 5 | app/vibecheck/feedback-styles.js, extension/popup/popup.css |
| `--vc-shadow-pin` | 5 | app/components/vibe-check/vibe-check.element.css, app/vibecheck/feedback-styles.js |
| `--vc-duration-panel` | 5 | app/vibecheck/feedback-styles.js |
| `--vc-border-gray-medium` | 4 | app/components/vibe-check/vibe-check.element.css, app/components/vibe-check/vibe-check.element.js, app/vibecheck/feedback-styles.js |
| `--vc-link` | 4 | app/vibecheck/feedback-styles.js |
| `--vc-icon-subtle` | 4 | app/components/_variables.css, app/components/_variables_dark.css, app/components/_variables_light.css |
| `--vc-opacity-resolved` | 4 | app/vibecheck/feedback-styles.js |
| `--vc-pin-warning` | 3 | app/vibecheck/feedback-styles.js |
| `--vc-pin-question` | 3 | app/vibecheck/feedback-styles.js |
| `--vc-text-inverse` | 3 | app/components/vibe-check/vibe-check.element.css, app/vibecheck/feedback-styles.js |
| `--vc-surface-input` | 3 | app/vibecheck/feedback-styles.js, extension/popup/popup.css |
| `--vc-border-gray-light` | 3 | app/components/vibe-check/vibe-check.element.css, app/vibecheck/feedback-styles.js |
| `--vc-spacing-2` | 3 | app/vibecheck/feedback-styles.js |
| `--vc-spacing-10` | 3 | app/vibecheck/feedback-styles.js, extension/popup/popup.css |
| `--vc-spacing-16` | 3 | app/vibecheck/feedback-styles.js, extension/popup/popup.css |
| `--vc-card-accent` | 3 | app/vibecheck/feedback-styles.js |
| `--vc-gray-50` | 2 | app/vibecheck/feedback-styles.js |
| `--vc-gray-500` | 2 | app/vibecheck/feedback-styles.js |
| `--vc-pin-suggestion` | 2 | app/vibecheck/feedback-styles.js |
| `--vc-bg` | 2 | extension/popup/popup.css |
| `--vc-icon-accent` | 2 | app/components/_variables.css |
| `--vc-button-primary-on` | 2 | app/vibecheck/feedback-styles.js, extension/popup/popup.css |
| `--vc-radius-4` | 2 | app/vibecheck/feedback-styles.js |
| `--vc-size-pin` | 2 | app/vibecheck/feedback-styles.js |
| `--vc-size-tool` | 2 | app/components/vibe-check/vibe-check.element.css |
| `--vc-shadow-card` | 2 | app/vibecheck/feedback-styles.js |

---

## 5. Hardcoded values that appear to duplicate token values

### Exact hex duplicates of `tokens.json` colors

Scoped to product UI sources (`vibecheck`, `vibe-check`, metatip, hotkey-map, `_variables*`, `popup.css`). Exact hex match to `tokens.json` colors (usually as `var(--vc-…, #fallback)`).

| Hex | Matching token(s) | File | Line | Snippet |
|---|---|---|---|---|
| #eeeff1 | --vc-gray-100, --vc-surface (light), --vc-border-inverse (light), --vc-button-secondary-hover (light) | app/components/vibe-check/vibe-check.element.js | 281 | background: var(--vc-surface, #eeeff1); |
| #8f96a3 | --vc-gray-400, --vc-border-gray-medium (light), --vc-text-gray-light (dark), --vc-border-gray-strong (dark) | app/components/vibe-check/vibe-check.element.js | 282 | border: 1px solid var(--vc-border-gray-medium, #8f96a3); |

Rows: **2**.

### Hardcoded color fallbacks that do **not** match token hexes

These sit beside `var(--vc-…)` but use non-token palette values (drift risk):

| Literal | Beside token | File | Line |
|---|---|---|---|
| `#1f2937` | `--vc-surface` | `app/vibecheck/feedback-styles.js` | 188, 359 |
| `#f9fafb` | `--vc-text` | `app/vibecheck/feedback-styles.js` | 361 |
| `#f0f2f4` | `--vc-surface` | `app/vibecheck/feedback-styles.js` | 389 |
| `#111827` | `--vc-text` | `app/vibecheck/feedback-styles.js` | 390 |

Legacy non-token colors in `_variables.css`: `hotpink`, `--theme-blue`, `--theme-purple`, `--neon-*` (not in `tokens.json`).

### Dimension `px` literals without `var(--vc-…)` (product UI)

Automated scan for bare `Npx` equal to a dimension token value. **Many hits are coincidental** (e.g. `font-size: 16px` vs `--vc-spacing-16`, `stroke-width: 2px` vs `--vc-spacing-2`). Treat as review candidates, not confirmed spacing duplicates.

| Value | Token | File | Line | Snippet |
|---|---|---|---|---|
| 6px | --vc-spacing-6 | app/components/vibe-check/vibe-check.element.css | 29 | font-size: 16px; |
| 16px | --vc-spacing-16 | app/components/vibe-check/vibe-check.element.css | 29 | font-size: 16px; |
| 6px | --vc-radius-6 | app/components/vibe-check/vibe-check.element.css | 29 | font-size: 16px; |
| 2px | --vc-spacing-2 | app/components/vibe-check/vibe-check.element.css | 173 | box-shadow: 0 2px 2px hsla(0 0% 0% / .25) |
| 2px | --vc-radius-2 | app/components/vibe-check/vibe-check.element.css | 173 | box-shadow: 0 2px 2px hsla(0 0% 0% / .25) |
| 2px | --vc-spacing-2 | app/components/vibe-check/vibe-check.element.css | 190 | box-shadow: 0 0 0 2px var(--theme-bg), 0 0.25em 0.5em hsla(0,0%,0%,25%); |
| 2px | --vc-radius-2 | app/components/vibe-check/vibe-check.element.css | 190 | box-shadow: 0 0 0 2px var(--theme-bg), 0 0.25em 0.5em hsla(0,0%,0%,25%); |
| 2px | --vc-spacing-2 | app/components/vibe-check/vibe-check.element.css | 212 | stroke-width: 2px; |
| 2px | --vc-radius-2 | app/components/vibe-check/vibe-check.element.css | 212 | stroke-width: 2px; |
| 8px | --vc-spacing-8 | app/components/vibe-check/vibe-check.element.js | 244 | transform: translateX(-8px); |
| 8px | --vc-radius-8 | app/components/vibe-check/vibe-check.element.js | 244 | transform: translateX(-8px); |
| 0px | --vc-spacing-0 | app/components/vibe-check/vibe-check.element.js | 250 | max-width: min(360px, calc(100vw - 24px)); |
| 4px | --vc-spacing-4 | app/components/vibe-check/vibe-check.element.js | 250 | max-width: min(360px, calc(100vw - 24px)); |
| 24px | --vc-spacing-24 | app/components/vibe-check/vibe-check.element.js | 250 | max-width: min(360px, calc(100vw - 24px)); |
| 4px | --vc-radius-4 | app/components/vibe-check/vibe-check.element.js | 250 | max-width: min(360px, calc(100vw - 24px)); |
| 6px | --vc-spacing-6 | app/components/vibe-check/vibe-check.element.js | 251 | font: 16px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; |
| 16px | --vc-spacing-16 | app/components/vibe-check/vibe-check.element.js | 251 | font: 16px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; |
| 6px | --vc-radius-6 | app/components/vibe-check/vibe-check.element.js | 251 | font: 16px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; |
| 2px | --vc-spacing-2 | app/components/vibe-check/vibe-check.element.js | 287 | box-shadow: 0 2px 2px hsla(0 0% 0% / .25); |
| 2px | --vc-radius-2 | app/components/vibe-check/vibe-check.element.js | 287 | box-shadow: 0 2px 2px hsla(0 0% 0% / .25); |
| 8px | --vc-spacing-8 | app/components/vibe-check/vibe-check.test.js | 51 | toolbar.style.left = '8px' |
| 8px | --vc-radius-8 | app/components/vibe-check/vibe-check.test.js | 51 | toolbar.style.left = '8px' |
| 8px | --vc-spacing-8 | app/components/vibe-check/vibe-check.test.js | 91 | toolbar.style.left = '8px' |
| 8px | --vc-radius-8 | app/components/vibe-check/vibe-check.test.js | 91 | toolbar.style.left = '8px' |
| 6px | --vc-spacing-6 | app/vibecheck/cards-v2.browser.test.js | 87 | t.is(await page.$eval('.vc-pin', element => getComputedStyle(element).borderRadius), '999px 999px 999px 6px') |
| 6px | --vc-radius-6 | app/vibecheck/cards-v2.browser.test.js | 87 | t.is(await page.$eval('.vc-pin', element => getComputedStyle(element).borderRadius), '999px 999px 999px 6px') |
| 999px | --vc-radius-full | app/vibecheck/cards-v2.browser.test.js | 87 | t.is(await page.$eval('.vc-pin', element => getComputedStyle(element).borderRadius), '999px 999px 999px 6px') |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 50 | transform: translateY(6px) scale(0.98); |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 50 | transform: translateY(6px) scale(0.98); |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 168 | width: 240px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 169 | max-width: calc(100vw - 24px); |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 169 | max-width: calc(100vw - 24px); |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 169 | max-width: calc(100vw - 24px); |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 182 | width: 240px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 184 | max-height: calc(100vh - 24px); |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 184 | max-height: calc(100vh - 24px); |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 184 | max-height: calc(100vh - 24px); |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 190 | border-radius: 16px; |
| 16px | --vc-spacing-16 | app/vibecheck/feedback-styles.js | 190 | border-radius: 16px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 190 | border-radius: 16px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 210 | transform: translateY(4px) scale(0.98); |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 210 | transform: translateY(4px) scale(0.98); |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 243 | min-height: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 243 | min-height: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 243 | min-height: 24px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 279 | width: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 279 | width: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 279 | width: 24px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 280 | height: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 280 | height: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 280 | height: 24px; |
| 8px | --vc-spacing-8 | app/vibecheck/feedback-styles.js | 394 | width: 168px; |
| 8px | --vc-radius-8 | app/vibecheck/feedback-styles.js | 394 | width: 168px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 398 | width: 200px; |
| 2px | --vc-spacing-2 | app/vibecheck/feedback-styles.js | 403 | min-height: 32px; |
| 2px | --vc-radius-2 | app/vibecheck/feedback-styles.js | 403 | min-height: 32px; |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 452 | min-height: 36px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 452 | min-height: 36px; |
| 36px | --vc-size-tool | app/vibecheck/feedback-styles.js | 452 | min-height: 36px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 465 | min-height: 40px; |
| 8px | --vc-spacing-8 | app/vibecheck/feedback-styles.js | 509 | min-height: 28px; |
| 8px | --vc-radius-8 | app/vibecheck/feedback-styles.js | 509 | min-height: 28px; |
| 28px | --vc-size-pin | app/vibecheck/feedback-styles.js | 509 | min-height: 28px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 510 | max-height: 180px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 526 | max-height: 180px; |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 544 | width: 6px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 544 | width: 6px; |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 545 | height: 6px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 545 | height: 6px; |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 576 | min-height: 16px; |
| 16px | --vc-spacing-16 | app/vibecheck/feedback-styles.js | 576 | min-height: 16px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 576 | min-height: 16px; |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 577 | line-height: 16px; |
| 16px | --vc-spacing-16 | app/vibecheck/feedback-styles.js | 577 | line-height: 16px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 577 | line-height: 16px; |
| 8px | --vc-spacing-8 | app/vibecheck/feedback-styles.js | 586 | min-height: 28px; |
| 8px | --vc-radius-8 | app/vibecheck/feedback-styles.js | 586 | min-height: 28px; |
| 28px | --vc-size-pin | app/vibecheck/feedback-styles.js | 586 | min-height: 28px; |
| 8px | --vc-spacing-8 | app/vibecheck/feedback-styles.js | 599 | flex: 0 0 28px; |
| 8px | --vc-radius-8 | app/vibecheck/feedback-styles.js | 599 | flex: 0 0 28px; |
| 28px | --vc-size-pin | app/vibecheck/feedback-styles.js | 599 | flex: 0 0 28px; |
| 8px | --vc-spacing-8 | app/vibecheck/feedback-styles.js | 600 | width: 28px; |
| 8px | --vc-radius-8 | app/vibecheck/feedback-styles.js | 600 | width: 28px; |
| 28px | --vc-size-pin | app/vibecheck/feedback-styles.js | 600 | width: 28px; |
| 8px | --vc-spacing-8 | app/vibecheck/feedback-styles.js | 601 | height: 28px; |
| 8px | --vc-radius-8 | app/vibecheck/feedback-styles.js | 601 | height: 28px; |
| 28px | --vc-size-pin | app/vibecheck/feedback-styles.js | 601 | height: 28px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 750 | max-height: min(360px, calc(100vh - 180px)); |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 785 | flex: 0 0 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 785 | flex: 0 0 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 785 | flex: 0 0 24px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 786 | width: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 786 | width: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 786 | width: 24px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 787 | height: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 787 | height: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 787 | height: 24px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 805 | max-height: min(280px, calc(100vh - 180px)); |
| 280px | --vc-size-panel | app/vibecheck/feedback-styles.js | 805 | max-height: min(280px, calc(100vh - 180px)); |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 863 | top: 40px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 864 | right: 40px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 870 | min-width: 260px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 871 | min-height: 180px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 872 | max-width: calc(100vw - 80px); |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 873 | max-height: calc(100vh - 80px); |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 927 | width: 150px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 928 | min-width: 150px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 966 | width: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 966 | width: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 966 | width: 24px; |
| 4px | --vc-spacing-4 | app/vibecheck/feedback-styles.js | 967 | height: 24px; |
| 24px | --vc-spacing-24 | app/vibecheck/feedback-styles.js | 967 | height: 24px; |
| 4px | --vc-radius-4 | app/vibecheck/feedback-styles.js | 967 | height: 24px; |
| 6px | --vc-spacing-6 | app/vibecheck/feedback-styles.js | 971 | font-size: 16px; |
| 16px | --vc-spacing-16 | app/vibecheck/feedback-styles.js | 971 | font-size: 16px; |
| 6px | --vc-radius-6 | app/vibecheck/feedback-styles.js | 971 | font-size: 16px; |
| 2px | --vc-spacing-2 | app/vibecheck/feedback-styles.js | 987 | height: 32px; |
| 2px | --vc-radius-2 | app/vibecheck/feedback-styles.js | 987 | height: 32px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 999 | flex: 0 0 30px; |
| 0px | --vc-spacing-0 | app/vibecheck/feedback-styles.js | 1013 | height: 30px; |
\n_… 36 more truncated._

Rows: **156**.

---

## 6. Primary consumers

| Surface | Files |
|---|---|
| Feedback overlay | `app/vibecheck/feedback-styles.js`, `feedback-ui.js` |
| Toolbar | `app/components/vibe-check/vibe-check.element.css`, `.js` |
| Popup | `extension/popup/popup.css` |
| Legacy theme | `metatip.element.css`, `hotkey-map/base.element.css` via `--theme-*` |
| CI | `scripts/design-sync.js`, `scripts/check-parity.mjs` |

---

## 7. Master table — all coded design-system tokens

| Category | Code token | Type | Value | Alias/reference | Mode/theme | File | Line |
|---|---|---|---|---|---|---|---|
| Color | --vc-white | Primitive/raw token | #f4f4f6 | — | all (shared) | design-system/tokens.json | 19 |
| Color | --vc-black | Primitive/raw token | #0b0c0e | — | all (shared) | design-system/tokens.json | 20 |
| Color | --vc-gray-50 | Primitive/raw token | #f9fafa | — | all (shared) | design-system/tokens.json | 21 |
| Color | --vc-gray-100 | Primitive/raw token | #eeeff1 | — | all (shared) | design-system/tokens.json | 22 |
| Color | --vc-gray-200 | Primitive/raw token | #d2d5da | — | all (shared) | design-system/tokens.json | 23 |
| Color | --vc-gray-300 | Primitive/raw token | #abb0ba | — | all (shared) | design-system/tokens.json | 24 |
| Color | --vc-gray-400 | Primitive/raw token | #8f96a3 | — | all (shared) | design-system/tokens.json | 25 |
| Color | --vc-gray-500 | Primitive/raw token | #737b8c | — | all (shared) | design-system/tokens.json | 26 |
| Color | --vc-gray-600 | Primitive/raw token | #5c6370 | — | all (shared) | design-system/tokens.json | 27 |
| Color | --vc-gray-700 | Primitive/raw token | #40454f | — | all (shared) | design-system/tokens.json | 28 |
| Color | --vc-gray-800 | Primitive/raw token | #2e3138 | — | all (shared) | design-system/tokens.json | 29 |
| Color | --vc-gray-900 | Primitive/raw token | #17191c | — | all (shared) | design-system/tokens.json | 30 |
| Color | --vc-purple-50 | Primitive/raw token | #f5f3ff | — | all (shared) | design-system/tokens.json | 31 |
| Color | --vc-purple-100 | Primitive/raw token | #ede9fe | — | all (shared) | design-system/tokens.json | 32 |
| Color | --vc-purple-200 | Primitive/raw token | #ddd6fe | — | all (shared) | design-system/tokens.json | 33 |
| Color | --vc-purple-300 | Primitive/raw token | #c4b5fd | — | all (shared) | design-system/tokens.json | 34 |
| Color | --vc-purple-400 | Primitive/raw token | #a78bfa | — | all (shared) | design-system/tokens.json | 35 |
| Color | --vc-purple-500 | Primitive/raw token | #8b5cf6 | — | all (shared) | design-system/tokens.json | 36 |
| Color | --vc-purple-600 | Primitive/raw token | #7c3aed | — | all (shared) | design-system/tokens.json | 37 |
| Color | --vc-purple-700 | Primitive/raw token | #6d28d9 | — | all (shared) | design-system/tokens.json | 38 |
| Color | --vc-purple-800 | Primitive/raw token | #5b21b6 | — | all (shared) | design-system/tokens.json | 39 |
| Color | --vc-purple-900 | Primitive/raw token | #4c1d95 | — | all (shared) | design-system/tokens.json | 40 |
| Color | --vc-pink-50 | Primitive/raw token | #fdf2f8 | — | all (shared) | design-system/tokens.json | 41 |
| Color | --vc-pink-100 | Primitive/raw token | #fce7f3 | — | all (shared) | design-system/tokens.json | 42 |
| Color | --vc-pink-200 | Primitive/raw token | #fbcfe8 | — | all (shared) | design-system/tokens.json | 43 |
| Color | --vc-pink-300 | Primitive/raw token | #f9a8d4 | — | all (shared) | design-system/tokens.json | 44 |
| Color | --vc-pink-400 | Primitive/raw token | #f472b6 | — | all (shared) | design-system/tokens.json | 45 |
| Color | --vc-pink-500 | Primitive/raw token | #ec4899 | — | all (shared) | design-system/tokens.json | 46 |
| Color | --vc-pink-600 | Primitive/raw token | #db2777 | — | all (shared) | design-system/tokens.json | 47 |
| Color | --vc-pink-700 | Primitive/raw token | #be185d | — | all (shared) | design-system/tokens.json | 48 |
| Color | --vc-pink-800 | Primitive/raw token | #9d174d | — | all (shared) | design-system/tokens.json | 49 |
| Color | --vc-pink-900 | Primitive/raw token | #831843 | — | all (shared) | design-system/tokens.json | 50 |
| Color | --vc-blue-50 | Primitive/raw token | #eff6ff | — | all (shared) | design-system/tokens.json | 51 |
| Color | --vc-blue-100 | Primitive/raw token | #dbeafe | — | all (shared) | design-system/tokens.json | 52 |
| Color | --vc-blue-200 | Primitive/raw token | #bfdbfe | — | all (shared) | design-system/tokens.json | 53 |
| Color | --vc-blue-300 | Primitive/raw token | #93c5fd | — | all (shared) | design-system/tokens.json | 54 |
| Color | --vc-blue-400 | Primitive/raw token | #60a5fa | — | all (shared) | design-system/tokens.json | 55 |
| Color | --vc-blue-500 | Primitive/raw token | #3b82f6 | — | all (shared) | design-system/tokens.json | 56 |
| Color | --vc-blue-600 | Primitive/raw token | #2563eb | — | all (shared) | design-system/tokens.json | 57 |
| Color | --vc-blue-700 | Primitive/raw token | #1d4ed8 | — | all (shared) | design-system/tokens.json | 58 |
| Color | --vc-blue-800 | Primitive/raw token | #1e40af | — | all (shared) | design-system/tokens.json | 59 |
| Color | --vc-blue-900 | Primitive/raw token | #1e3a8a | — | all (shared) | design-system/tokens.json | 60 |
| Color | --vc-amber-50 | Primitive/raw token | #fffbeb | — | all (shared) | design-system/tokens.json | 61 |
| Color | --vc-amber-100 | Primitive/raw token | #fef3c7 | — | all (shared) | design-system/tokens.json | 62 |
| Color | --vc-amber-200 | Primitive/raw token | #fde68a | — | all (shared) | design-system/tokens.json | 63 |
| Color | --vc-amber-300 | Primitive/raw token | #fcd34d | — | all (shared) | design-system/tokens.json | 64 |
| Color | --vc-amber-400 | Primitive/raw token | #fbbf24 | — | all (shared) | design-system/tokens.json | 65 |
| Color | --vc-amber-500 | Primitive/raw token | #f59e0b | — | all (shared) | design-system/tokens.json | 66 |
| Color | --vc-amber-600 | Primitive/raw token | #d97706 | — | all (shared) | design-system/tokens.json | 67 |
| Color | --vc-amber-700 | Primitive/raw token | #b45309 | — | all (shared) | design-system/tokens.json | 68 |
| Color | --vc-amber-800 | Primitive/raw token | #92400e | — | all (shared) | design-system/tokens.json | 69 |
| Color | --vc-amber-900 | Primitive/raw token | #78350f | — | all (shared) | design-system/tokens.json | 70 |
| Color | --vc-teal-50 | Primitive/raw token | #f0fdfa | — | all (shared) | design-system/tokens.json | 71 |
| Color | --vc-teal-100 | Primitive/raw token | #ccfbf1 | — | all (shared) | design-system/tokens.json | 72 |
| Color | --vc-teal-200 | Primitive/raw token | #99f6e4 | — | all (shared) | design-system/tokens.json | 73 |
| Color | --vc-teal-300 | Primitive/raw token | #5eead4 | — | all (shared) | design-system/tokens.json | 74 |
| Color | --vc-teal-400 | Primitive/raw token | #2dd4bf | — | all (shared) | design-system/tokens.json | 75 |
| Color | --vc-teal-500 | Primitive/raw token | #14b8a6 | — | all (shared) | design-system/tokens.json | 76 |
| Color | --vc-teal-600 | Primitive/raw token | #0d9488 | — | all (shared) | design-system/tokens.json | 77 |
| Color | --vc-teal-700 | Primitive/raw token | #0f766e | — | all (shared) | design-system/tokens.json | 78 |
| Color | --vc-teal-800 | Primitive/raw token | #115e59 | — | all (shared) | design-system/tokens.json | 79 |
| Color | --vc-teal-900 | Primitive/raw token | #134e4a | — | all (shared) | design-system/tokens.json | 80 |
| Color | --vc-red-50 | Primitive/raw token | #fef2f2 | — | all (shared) | design-system/tokens.json | 81 |
| Color | --vc-red-100 | Primitive/raw token | #fee2e2 | — | all (shared) | design-system/tokens.json | 82 |
| Color | --vc-red-200 | Primitive/raw token | #fecaca | — | all (shared) | design-system/tokens.json | 83 |
| Color | --vc-red-300 | Primitive/raw token | #fca5a5 | — | all (shared) | design-system/tokens.json | 84 |
| Color | --vc-red-400 | Primitive/raw token | #f87171 | — | all (shared) | design-system/tokens.json | 85 |
| Color | --vc-red-500 | Primitive/raw token | #ef4444 | — | all (shared) | design-system/tokens.json | 86 |
| Color | --vc-red-600 | Primitive/raw token | #dc2626 | — | all (shared) | design-system/tokens.json | 87 |
| Color | --vc-red-700 | Primitive/raw token | #b91c1c | — | all (shared) | design-system/tokens.json | 88 |
| Color | --vc-red-800 | Primitive/raw token | #991b1b | — | all (shared) | design-system/tokens.json | 89 |
| Color | --vc-red-900 | Primitive/raw token | #7f1d1d | — | all (shared) | design-system/tokens.json | 90 |
| Color | --vc-green-50 | Primitive/raw token | #f7fee7 | — | all (shared) | design-system/tokens.json | 91 |
| Color | --vc-green-100 | Primitive/raw token | #ecfccb | — | all (shared) | design-system/tokens.json | 92 |
| Color | --vc-green-200 | Primitive/raw token | #d9f99d | — | all (shared) | design-system/tokens.json | 93 |
| Color | --vc-green-300 | Primitive/raw token | #bef264 | — | all (shared) | design-system/tokens.json | 94 |
| Color | --vc-green-400 | Primitive/raw token | #9ced2b | — | all (shared) | design-system/tokens.json | 95 |
| Color | --vc-green-500 | Primitive/raw token | #84cc16 | — | all (shared) | design-system/tokens.json | 96 |
| Color | --vc-green-600 | Primitive/raw token | #65a30d | — | all (shared) | design-system/tokens.json | 97 |
| Color | --vc-green-700 | Primitive/raw token | #4d7c0f | — | all (shared) | design-system/tokens.json | 98 |
| Color | --vc-green-800 | Primitive/raw token | #3f6212 | — | all (shared) | design-system/tokens.json | 99 |
| Color | --vc-green-900 | Primitive/raw token | #365314 | — | all (shared) | design-system/tokens.json | 100 |
| Color | --vc-pin-note | Component token | #7c3aed | value matches primitive purple-600 (not a code-level alias) | light | design-system/tokens.json | 104 |
| Color | --vc-pin-implement | Component token | #2563eb | value matches primitive blue-600 (not a code-level alias) | light | design-system/tokens.json | 105 |
| Color | --vc-pin-warning | Component token | #d97706 | value matches primitive amber-600 (not a code-level alias) | light | design-system/tokens.json | 106 |
| Color | --vc-pin-question | Component token | #0f766e | value matches primitive teal-700 (not a code-level alias) | light | design-system/tokens.json | 107 |
| Color | --vc-pin-suggestion | Component token | #be185d | value matches primitive pink-700 (not a code-level alias) | light | design-system/tokens.json | 108 |
| Color | --vc-badge-background | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 109 |
| Color | --vc-badge-text | Component token | #40454f | value matches primitive gray-700 (not a code-level alias) | light | design-system/tokens.json | 110 |
| Color | --vc-badge-pending-background | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 111 |
| Color | --vc-badge-pending-text | Component token | #40454f | value matches primitive gray-700 (not a code-level alias) | light | design-system/tokens.json | 112 |
| Color | --vc-badge-success-background | Component token | #ecfccb | value matches primitive green-100 (not a code-level alias) | light | design-system/tokens.json | 113 |
| Color | --vc-badge-success-text | Component token | #3f6212 | value matches primitive green-800 (not a code-level alias) | light | design-system/tokens.json | 114 |
| Color | --vc-text-critical | Semantic token | #b91c1c | value matches primitive red-700 (not a code-level alias) | light | design-system/tokens.json | 115 |
| Color | --vc-text | Semantic token | #0b0c0e | value matches primitive black (not a code-level alias) | light | design-system/tokens.json | 116 |
| Color | --vc-text-body | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | light | design-system/tokens.json | 117 |
| Color | --vc-text-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | light | design-system/tokens.json | 118 |
| Color | --vc-text-gray-light | Semantic token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 119 |
| Color | --vc-text-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 120 |
| Color | --vc-bg | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 121 |
| Color | --vc-bg-inverse | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | light | design-system/tokens.json | 122 |
| Color | --vc-surface-input | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 123 |
| Color | --vc-surface | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | light | design-system/tokens.json | 124 |
| Color | --vc-surface-subtle | Semantic token | #d2d5da | value matches primitive gray-200 (not a code-level alias) | light | design-system/tokens.json | 125 |
| Color | --vc-border | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | light | design-system/tokens.json | 126 |
| Color | --vc-border-gray-light | Semantic token | #d2d5da | value matches primitive gray-200 (not a code-level alias) | light | design-system/tokens.json | 127 |
| Color | --vc-border-gray-medium | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | light | design-system/tokens.json | 128 |
| Color | --vc-border-gray-strong | Semantic token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | light | design-system/tokens.json | 129 |
| Color | --vc-border-inverse | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | light | design-system/tokens.json | 130 |
| Color | --vc-link | Semantic token | #2563eb | value matches primitive blue-600 (not a code-level alias) | light | design-system/tokens.json | 131 |
| Color | --vc-icon-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 132 |
| Color | --vc-icon-accent | Semantic token | #9ced2b | value matches primitive green-400 (not a code-level alias) | light | design-system/tokens.json | 133 |
| Color | --vc-icon | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | light | design-system/tokens.json | 134 |
| Color | --vc-icon-subtle | Semantic token | #40454f | value matches primitive gray-700 (not a code-level alias) | light | design-system/tokens.json | 135 |
| Color | --vc-icon-critical | Semantic token | #b91c1c | value matches primitive red-700 (not a code-level alias) | light | design-system/tokens.json | 136 |
| Color | --vc-icon-gray-light | Semantic token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | light | design-system/tokens.json | 137 |
| Color | --vc-icon-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | light | design-system/tokens.json | 138 |
| Color | --vc-button-primary | Component token | #17191c | value matches primitive gray-900 (not a code-level alias) | light | design-system/tokens.json | 139 |
| Color | --vc-button-primary-on | Component token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | light | design-system/tokens.json | 140 |
| Color | --vc-button-primary-hover | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | light | design-system/tokens.json | 141 |
| Color | --vc-button-secondary-hover | Component token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | light | design-system/tokens.json | 142 |
| Color | --vc-pin-note | Component token | #7c3aed | value matches primitive purple-600 (not a code-level alias) | dark | design-system/tokens.json | 145 |
| Color | --vc-pin-implement | Component token | #2563eb | value matches primitive blue-600 (not a code-level alias) | dark | design-system/tokens.json | 146 |
| Color | --vc-pin-warning | Component token | #d97706 | value matches primitive amber-600 (not a code-level alias) | dark | design-system/tokens.json | 147 |
| Color | --vc-pin-question | Component token | #0f766e | value matches primitive teal-700 (not a code-level alias) | dark | design-system/tokens.json | 148 |
| Color | --vc-pin-suggestion | Component token | #be185d | value matches primitive pink-700 (not a code-level alias) | dark | design-system/tokens.json | 149 |
| Color | --vc-badge-background | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 150 |
| Color | --vc-badge-text | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | dark | design-system/tokens.json | 151 |
| Color | --vc-badge-pending-background | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 152 |
| Color | --vc-badge-pending-text | Component token | #abb0ba | value matches primitive gray-300 (not a code-level alias) | dark | design-system/tokens.json | 153 |
| Color | --vc-badge-success-background | Component token | #ecfccb | value matches primitive green-100 (not a code-level alias) | dark | design-system/tokens.json | 154 |
| Color | --vc-badge-success-text | Component token | #3f6212 | value matches primitive green-800 (not a code-level alias) | dark | design-system/tokens.json | 155 |
| Color | --vc-text-critical | Semantic token | #f87171 | value matches primitive red-400 (not a code-level alias) | dark | design-system/tokens.json | 156 |
| Color | --vc-text | Semantic token | #f4f4f6 | value matches primitive white (not a code-level alias) | dark | design-system/tokens.json | 157 |
| Color | --vc-text-body | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | dark | design-system/tokens.json | 158 |
| Color | --vc-text-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | dark | design-system/tokens.json | 159 |
| Color | --vc-text-gray-light | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 160 |
| Color | --vc-text-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 161 |
| Color | --vc-bg | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | dark | design-system/tokens.json | 162 |
| Color | --vc-bg-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 163 |
| Color | --vc-surface-input | Semantic token | #17191c | value matches primitive gray-900 (not a code-level alias) | dark | design-system/tokens.json | 164 |
| Color | --vc-surface | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | dark | design-system/tokens.json | 165 |
| Color | --vc-surface-subtle | Semantic token | #40454f | value matches primitive gray-700 (not a code-level alias) | dark | design-system/tokens.json | 166 |
| Color | --vc-border | Semantic token | #eeeff1 | value matches primitive gray-100 (not a code-level alias) | dark | design-system/tokens.json | 167 |
| Color | --vc-border-gray-light | Semantic token | #40454f | value matches primitive gray-700 (not a code-level alias) | dark | design-system/tokens.json | 168 |
| Color | --vc-border-gray-medium | Semantic token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 169 |
| Color | --vc-border-gray-strong | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 170 |
| Color | --vc-border-inverse | Semantic token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | dark | design-system/tokens.json | 171 |
| Color | --vc-link | Semantic token | #60a5fa | value matches primitive blue-400 (not a code-level alias) | dark | design-system/tokens.json | 172 |
| Color | --vc-icon-inverse | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 173 |
| Color | --vc-icon-accent | Semantic token | #9ced2b | value matches primitive green-400 (not a code-level alias) | dark | design-system/tokens.json | 174 |
| Color | --vc-icon | Semantic token | #f9fafa | value matches primitive gray-50 (not a code-level alias) | dark | design-system/tokens.json | 175 |
| Color | --vc-icon-subtle | Semantic token | #d2d5da | value matches primitive gray-200 (not a code-level alias) | dark | design-system/tokens.json | 176 |
| Color | --vc-icon-critical | Semantic token | #f87171 | value matches primitive red-400 (not a code-level alias) | dark | design-system/tokens.json | 177 |
| Color | --vc-icon-gray-light | Semantic token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 178 |
| Color | --vc-icon-gray-medium | Semantic token | #737b8c | value matches primitive gray-500 (not a code-level alias) | dark | design-system/tokens.json | 179 |
| Color | --vc-button-primary | Component token | #2e3138 | value matches primitive gray-800 (not a code-level alias) | dark | design-system/tokens.json | 180 |
| Color | --vc-button-primary-on | Component token | #17191c | value matches primitive gray-900 (not a code-level alias) | dark | design-system/tokens.json | 181 |
| Color | --vc-button-primary-hover | Component token | #8f96a3 | value matches primitive gray-400 (not a code-level alias) | dark | design-system/tokens.json | 182 |
| Color | --vc-button-secondary-hover | Component token | #5c6370 | value matches primitive gray-600 (not a code-level alias) | dark | design-system/tokens.json | 183 |
| Spacing | --vc-spacing-0 | Primitive/raw token | 0px | — | all (shared) | design-system/tokens.json | 187 |
| Spacing | --vc-spacing-2 | Primitive/raw token | 2px | — | all (shared) | design-system/tokens.json | 188 |
| Spacing | --vc-spacing-4 | Primitive/raw token | 4px | — | all (shared) | design-system/tokens.json | 189 |
| Spacing | --vc-spacing-6 | Primitive/raw token | 6px | — | all (shared) | design-system/tokens.json | 190 |
| Spacing | --vc-spacing-8 | Primitive/raw token | 8px | — | all (shared) | design-system/tokens.json | 191 |
| Spacing | --vc-spacing-10 | Primitive/raw token | 10px | — | all (shared) | design-system/tokens.json | 192 |
| Spacing | --vc-spacing-12 | Primitive/raw token | 12px | — | all (shared) | design-system/tokens.json | 193 |
| Spacing | --vc-spacing-16 | Primitive/raw token | 16px | — | all (shared) | design-system/tokens.json | 194 |
| Spacing | --vc-spacing-24 | Primitive/raw token | 24px | — | all (shared) | design-system/tokens.json | 195 |
| Border radius | --vc-radius-2 | Primitive/raw token | 2px | — | all (shared) | design-system/tokens.json | 196 |
| Border radius | --vc-radius-4 | Primitive/raw token | 4px | — | all (shared) | design-system/tokens.json | 197 |
| Border radius | --vc-radius-6 | Primitive/raw token | 6px | — | all (shared) | design-system/tokens.json | 198 |
| Border radius | --vc-radius-8 | Primitive/raw token | 8px | — | all (shared) | design-system/tokens.json | 199 |
| Border radius | --vc-radius-12 | Primitive/raw token | 12px | — | all (shared) | design-system/tokens.json | 200 |
| Border radius | --vc-radius-full | Primitive/raw token | 999px | — | all (shared) | design-system/tokens.json | 201 |
| Sizing | --vc-size-pin | Primitive/raw token | 28px | — | all (shared) | design-system/tokens.json | 202 |
| Sizing | --vc-size-tool | Primitive/raw token | 36px | — | all (shared) | design-system/tokens.json | 203 |
| Sizing | --vc-size-panel | Primitive/raw token | 280px | — | all (shared) | design-system/tokens.json | 204 |
| Sizing | --vc-size-card | Primitive/raw token | 300px | — | all (shared) | design-system/tokens.json | 205 |
| Sizing | --vc-size-popup | Primitive/raw token | 320px | — | all (shared) | design-system/tokens.json | 206 |
| Opacity | --vc-opacity-resolved | Primitive/raw token | 0.45 | — | all (shared) | design-system/tokens.json | 207 |
| Shadows | --vc-shadow-pin | Component token | 0 4px 16px rgb(0 0 0 / 28%) | — | all (shared) | design-system/tokens.json | 210 |
| Shadows | --vc-shadow-card | Component token | 0 16px 50px rgb(0 0 0 / 28%) | — | all (shared) | design-system/tokens.json | 211 |
| Shadows | --vc-shadow-panel | Component token | 0 12px 40px rgb(0 0 0 / 22%) | — | all (shared) | design-system/tokens.json | 212 |
| Shadows | --vc-shadow-pin-open | Component token | 0 4px 16px rgb(0 0 0 / 28%) | — | all (shared) | design-system/tokens.json | 213 |
| Font family | --vc-font-family | Semantic token | system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif | — | all (shared) | design-system/tokens.json | 216 |
| Motion or duration | --vc-duration-fast | Semantic token | 140ms | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 15 |
| Motion or duration | --vc-duration | Semantic token | 200ms | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 16 |
| Motion or duration | --vc-duration-panel | Semantic token | 280ms | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 17 |
| Motion or duration | --vc-ease | Semantic token | cubic-bezier(0.32, 0.72, 0, 1) | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 18 |
| Motion or duration | --vc-ease-soft | Semantic token | cubic-bezier(0.25, 0.1, 0.25, 1) | — | runtime (#vibecheck-layer) | app/vibecheck/feedback-styles.js | 19 |

---

## Appendix — file map

| Path | Generated? |
|---|---|
| design-system/tokens.json | No |
| design-system/generated/* | Yes |
| extension/popup/tokens.css | Yes |
| app/components/_variables*.css | No |
| app/vibecheck/feedback-styles.js | No |
| app/components/styles.store.js | No |
| app/utilities/scheme.js | No |
| app/bundle.js | Build artifact (excluded from usage) |

## Appendix — categories not coded as tokens

| Category | Status |
|---|---|
| Border width | Not in tokens.json |
| Breakpoints | Not in tokens.json |
| Type size/weight/line-height | Hardcoded in CSS; only `--vc-font-family` |
| Letter spacing | Not tokenized |
| Tailwind theme | Not used |

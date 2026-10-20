# Release plan (publish scope)

This document is the **publish scope** for VibeCheck. It matches the Figma [Release plan board](https://www.figma.com/design/3UduCyltV7tmRYSnDqTEfA/VibeCheck?node-id=447-8597).

The code switch is [`app/vibecheck/release-plan.js`](../app/vibecheck/release-plan.js) (copied to `extension/release-plan.js` on build). Set `CURRENT_RELEASE_PHASE` or lower a feature’s `phase` to ship it.

After changing release gates or extension code, follow [`docs/extension-dev.md`](extension-dev.md) (`npm run extension:build`, then Reload in Chrome).

[`PLAN.md`](../PLAN.md) is the **historical build log** (clone, rebrand, Supabase phases). Do not confuse those phase numbers with this board.

## Rules

- One registry only. No localStorage overrides or env files for release scope.
- Hidden features stay in the codebase; they are gated, not deleted.
- The extension does not honor `?features=all` on prototype pages. Local demo (`app/index.html`) may set `window.__VIBECHECK_FEATURES__ = 'all'` via `?features=all` for full-toolbar development.
- Puppeteer tests set `__VIBECHECK_FEATURES__ = 'all'` so existing tool tests keep the full toolbar.

## Machine-readable fence

Must match `RELEASE_FEATURES` in `release-plan.js` (id and phase only):

```release-plan
toggle 0
theme 0
comment 0
content 0
notes-panel 0
resolve-reopen 0
reply-threads 0
mentions 0
delete-thread 0
filter-sort-notes 0
orphaned-pins 0
shared-feedback 0
inspect 0
guides 0
ai-prompt 0
company-sign-in 0
onboarding 0
display-name 0
accessibility 0
edit-text 0
inbox 1
color-format 1
color-actions 1
margin 1
padding 1
move 1
ai-prompt-v2 1
annotation 2
toolbar-enhanced-layout 2
flex-align 2
hue-shift 2
box-shadows 2
search 2
font-styles 2
toolbar-role 4
```

## Phase 0 (current testers)

Toolbar: Inspect, Comment, Content, Guides, Accessibility, Edit Text, AI Prompt (Q). No margin/padding/move/color toolbar buttons, no annotation tool, no search tool, no PM-only role in popup.

Notes panel: comments, content suggestions, resolve/reopen, replies, mentions, delete, filter/sort, orphaned pins, local storage.

Popup: sign-in, onboarding, display name. Inbox and toolbar role hidden until their phases ship.

## Manual checklist (extension)

After `npm run extension:build`, reload unpacked `extension/` in Chrome.

- Toolbar buttons are only Inspect, Comment, Content, Guides, Accessibility, Edit Text, and AI Prompt.
- No text, background, or border color buttons.
- Context menu still has theme. It does not have hex/HSL/RGB color format.
- Alt+Shift+D still toggles the toolbar.
- Comment pin, notes panel, resolve, reply, delete, filter, and orphaned state still work.
- Content still works.
- Annotation cannot be created from the type menu, and the Annotations filter chip is absent.
- M, P, V, A, H, D, F, S, N do not switch tools.
- Popup still shows sign-in / onboarding / display name.
- Popup hides Inbox and Toolbar role.
- AI prompt button still copies a prompt.

---
name: sync-figma-icons
description: >-
  Syncs VibeCheck icons from the Figma New Icons bucket into repo code, then
  moves them into Toolbar or UI icon frames. Use only when the user explicitly
  asks to sync icons, run icon sync, process New Icons, or audit Figma vs code
  icons. Do not auto-invoke.
disable-model-invocation: true
---

# Sync Figma icons

Repo-wide workflow for VibeCheck icon library sync. Read [reference.md](reference.md) for node IDs, modules, and naming. See [examples.md](examples.md) for walkthroughs.

## Modes

| Mode | When | What |
|------|------|------|
| **Sync** (default) | “sync icons”, “process New Icons” | Steps 1→4 below |
| **Audit only** | “audit icons”, “match Figma icons to code” | Step 4 only across Toolbar + UI (+ New if any). No Figma moves, no code edits |

Never commit unless the user explicitly asks after you offer a commit.

## Hard rules

1. **Unused stay staged** — If a New Icons symbol has **no Figma instances**, report it and make **no code changes** and **no Figma moves**.
2. **Ask bucket, suggest answer** — Before moving, always ask Toolbar vs UI. Suggest based on usage (tool chrome → Toolbar; cards/panel/inputs → UI). Do not guess silently.
3. **Implement + wire** — Add the glyph to the correct icon module **and** wire it into code sites that match Figma usage (replace placeholders / wrong glyphs). If the code target is unclear, ask.
4. **Ask before commit** — When sync is done, summarize and ask whether to commit. Never commit unprompted.
5. **Explicit only** — This skill runs only when the user invokes it.
6. **Already in code** — If the glyph already exists in the repo but is still in New Icons, skip re-export; ask bucket; move in Figma; run evaluation.
7. **No silent glyph swaps** — Never replace an existing action icon path without calling out the visual change and getting confirmation.
8. **24×24 gate** — Library components must be 24×24. If not, stop for that icon and report; do not scale silently.
9. **Normalize SVG** — `viewBox="0 0 24 24"`, `fill="currentColor"` (or paths inheriting currentColor). Strip baked `#17191C` / other hex fills.

## Sync pipeline

### 1. Scan New Icons

- `get_metadata` on New Icons frame (see reference).
- List each `symbol`: `nodeId`, `name`, `width`×`height`.
- If empty → report “New Icons empty” and stop (or offer audit-only).

### 2. Usage check (per symbol)

- Find instances of the component across the VibeCheck file (search / metadata / `use_figma` as needed).
- Record: parent component, frame, nearby labels/actions, Figma component description/tags.
- **No instances** → add to unused list; **no implement, no move**.
- **Has instances** → continue.

### 3. Context → code → move (used icons only)

For each used icon:

1. **Suggest bucket** from usage + ask user to confirm (Toolbar vs UI).
2. Export SVG (`get_design_context` / asset URL). Enforce 24×24 + normalize.
3. **Code**
   - Toolbar → `app/components/vibe-check/vibe-check.icons.js` (+ Toolbar Name in `design-system/figma-components.json` if needed).
   - UI → `app/vibecheck/card-icons.js` (action key if applicable + Figma-name camelCase alias).
4. **Wire** into consuming UI that matches Figma usage; ask if ambiguous.
5. Load **figma-use** skill, then `use_figma` to **move** the component from New Icons → confirmed Toolbar or UI frame. Reflow spacing if the frame looks broken.
6. Do not invent product usage that Figma does not show.

### 4. Match evaluation

Compare Figma library (Toolbar + UI + remaining New) to code. Per icon report:

| Check | Pass |
|--------|------|
| Name | Figma name ↔ code export / alias |
| Size | Figma 24×24 ↔ code `viewBox="0 0 24 24"` |
| Shape | Normalized path data matches export |
| Color | `currentColor`, not baked hex |
| Bucket | Figma frame ↔ code module (Toolbar vs UI) |
| Usage | Used Figma icons have code call sites |

Print a short checklist. Fix failures in the same run only if they came from this sync; otherwise report.

## Output template

```markdown
## Icon sync report
- New Icons scanned: N
- Unused (left in New Icons): …
- Implemented + moved: …
- Bucket decisions: …
- Evaluation: pass/fail per icon
- Commit? (ask)
```

## Tools

- Figma: `get_metadata`, `get_design_context`, `get_screenshot`, `use_figma` (after figma-use skill)
- Repo: edit `vibe-check.icons.js` / `card-icons.js` / consumers / `figma-components.json` as needed

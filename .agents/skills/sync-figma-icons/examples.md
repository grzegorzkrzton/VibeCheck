# sync-figma-icons examples

## Example A — Used UI icon (happy path)

**Figma:** New Icons contains `X circle` (24×24), used on Notes panel search clear.

1. Scan New Icons → find `X circle`.
2. Usage check → instance on panel search → **used**.
3. Suggest **UI icons**; ask user; user confirms.
4. Export SVG → normalize → add `xCircle` to `card-icons.js`.
5. Wire clear button to `cardIcon('xCircle', 16)` if not already.
6. Move component New Icons → UI icons via `use_figma`.
7. Evaluate name / 24 viewBox / path / bucket / call site → pass.
8. Ask whether to commit.

## Example B — Unused staged icon

**Figma:** New Icons contains `Sparkle`, zero instances in the file.

1. Scan → find `Sparkle`.
2. Usage check → unused.
3. Report: left in New Icons; **no code, no Figma move**.
4. Ask whether to commit? → nothing to commit.

## Example C — Already in code, still in New Icons

**Figma:** `Funnel` paths already in `card-icons.js`, but symbol still under New Icons.

1. Detect code already has `funnel`.
2. Skip re-implement; still run usage check.
3. If used → ask bucket (suggest UI) → move only → evaluate.
4. If unused → leave in New Icons; no move.

## Example D — Ambiguous bucket

**Figma:** New icon used on both a toolbar popout chrome and a card header.

1. Suggest based on primary usage; **ask**.
2. Do not move until the user picks Toolbar or UI (or asks to duplicate — out of scope unless they request it).

## Example E — Audit only

**User:** “Audit Figma icons against code.”

1. Skip New Icons implement/move.
2. Inventory Toolbar + UI symbols vs `vibe-check.icons.js` + `card-icons.js`.
3. Report mismatches (missing in code, missing in Figma, name/size/path drift).
4. No edits unless user then asks to fix.

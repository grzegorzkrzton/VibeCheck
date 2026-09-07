# VibeCheck

**Drop feedback pins on vibe-coded prototypes.**

Internal Chrome extension for designers, PMs, engineers, and content design. Built on [VisBug](https://github.com/GoogleChromeLabs/ProjectVisBug) (Apache-2.0) — see `LICENSE` and `NOTICE`. Not the public VisBug store listing.

| Remote | URL |
|--------|-----|
| **origin** (yours) | https://github.com/grzegorzkrzton/design-feedback-tool |
| **upstream** (VisBug) | https://github.com/GoogleChromeLabs/ProjectVisBug |

---

## Quick start

```sh
git clone https://github.com/grzegorzkrzton/design-feedback-tool.git
cd design-feedback-tool
```

Verify the extension folder, then load in Chrome:

```sh
cd extension
./verify-phase0.sh
```

1. Open `chrome://extensions` → **Developer mode** → **Load unpacked**
2. Select the **`extension/`** folder (path must end with `/design-feedback-tool/extension`)
3. Open any normal webpage (not `chrome://` pages)
4. Click the **VibeCheck** icon or press **Alt+Shift+D**
5. Use VisBug tools: guides (**G**), padding (**P**), edit text (**E**), etc.

### After changing code in `app/`

```sh
npm install
npm run extension:build
```

Then **Reload** the extension in `chrome://extensions`.

---

## Phase roadmap

| Phase | Status | What |
|-------|--------|------|
| 0 | Done | VisBug baseline — load, toggle, live-edit |
| 1 | Done | VibeCheck rebrand + icon |
| 2 | Done | Copy AI prompt from live edits (**Q**) |
| 3 | Next | SSO, comments, annotations, copy approval |

Earlier all-in-one work is preserved on branch `backup/full-implementation`.

---

## For teammates

- **Private repo** — ask for GitHub access if clone fails
- **One extension folder** — always load unpacked from `extension/`, not the repo root
- **Reload after pull** — `git pull` then reload in `chrome://extensions`

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
5. Tools: guides (**G**), inspect (**I**), comments (**C**), padding (**P**), edit text (**E**), content (**W**), AI prompt (**Q**)

### After changing code in `app/`

```sh
npm install
npm run extension:build
```

Then **Reload** the extension in `chrome://extensions`.

### After `git pull` on a test machine

```sh
git pull origin main
cd extension && ./verify-phase0.sh
```

Reload the extension. Comments, annotations, and content suggestions are stored in **this browser's localStorage** for the prototype URL. They do **not** sync to another computer until Phase 6 (Supabase).

---

## Phase roadmap

| Phase | Status | What |
|-------|--------|------|
| 0 | Done | VisBug baseline — load, toggle, live-edit |
| 1 | Done | VibeCheck rebrand + icon |
| 2 | Done | Copy AI prompt from live edits (**Q**) |
| 3 | Done | Figma-like comments (**C**), localStorage |
| 4 | Done | Note vs Annotation in the same composer |
| 5 | Done | Content suggestions (**W**), local approve/reject |
| 6 | Ready | Google SSO + Supabase — add keys in Account & inbox |
| 7 | Ready | Mentions + inbox; email after SSO |

Full detail: [`PLAN.md`](PLAN.md).

Earlier all-in-one work is preserved on branch `backup/full-implementation`.

---

## For teammates

- **Private repo** — ask for GitHub access if clone fails
- **One extension folder** — always load unpacked from `extension/`, not the repo root
- **Reload after pull** — `git pull` then reload in `chrome://extensions`
- **Local comments** — same Chrome profile + same prototype URL only, until SSO

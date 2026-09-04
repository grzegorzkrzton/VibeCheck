# Design Handoff

Internal Chrome extension for product designers, PMs, engineers, and content design. Use it on vibe-coded prototypes (GitHub Pages, Lovable, and similar) to comment, annotate, live-edit, export an AI prompt, and suggest copy.

This is a **derivative of [VisBug](https://github.com/GoogleChromeLabs/ProjectVisBug)** (Apache-2.0). It is **not** the public VisBug Chrome Web Store listing and is **not** an official Google product. See `LICENSE` and `NOTICE`.

Git remotes:

- `origin` — your private GitHub repo: https://github.com/grzegorzkrzton/design-feedback-tool
- `upstream` — public ProjectVisBug (optional later pulls)

---

## What you get

| Tool | Shortcut | What it does |
|------|----------|----------------|
| VisBug inspect / spacing / type / color | existing keys | Live-edit the page, same as VisBug |
| Comment | `C` | Pin a Figma-style comment on a DOM element |
| Annotate | `N` | Implementation notes for engineers |
| AI query | `Q` | Copy a consistent prompt of the live edits |
| Write copy | `W` | Content-design suggestion; owner approves or rejects |
| Review panel | right side | Lists comments, notes, copy, resolve/reply |

The extension **popup** (toolbar icon) is for Google sign-in and the inbox. **Alt+Shift+D** (or the popup button, or right-click → Show/Hide) toggles the on-page tools.

---

## Junior setup: load the unpacked extension

You need [Node.js](https://nodejs.org/) (18+) and Chrome.

```sh
npm install
npm run extension:build
```

1. Open `chrome://extensions`
2. Turn on **Developer mode**
3. **Load unpacked** and select the `extension/` folder (not the repo root)
4. Pin **Design Handoff** in the Chrome toolbar
5. Open a prototype URL
6. Click the extension icon → **Continue locally** (until SSO is configured)
7. Click **Open tools on this page**, or press **Alt+Shift+D**
8. Select an element, try padding/`C` comments/`Q` prompt export

If Chrome says the shortcut is unused, set it under `chrome://extensions/shortcuts`.

Reload the extension after every `npm run extension:build`.

---

## How a Chrome extension is wired (this repo)

```
extension/manifest.json     identity card Chrome reads
extension/visbug.js         background service worker (injects the toolbar, talks to Supabase)
extension/popup/            login + inbox
extension/toolbar/          built JS/CSS injected into the prototype page
app/                        source (custom elements + tools). Chrome does not load this directly.
```

`npm run extension:build` bundles `app/` into `extension/toolbar/bundle.min.js` with Rollup.

The injected toolbar **cannot** call `chrome.*` APIs (it runs in the page). It uses `window.postMessage` to `inject.js`, which forwards to the service worker. That avoids prototype **Content Security Policy** blocking calls to Supabase.

---

## Phase checklist

1. **Local VisBug** — load unpacked, Alt+Shift+D works on a prototype.
2. **Prompt export** — edit padding or text, press `Q`, paste into an AI tool.
3. **Comments locally** — Continue locally, press `C`, pin a comment. Reload the page, toggle tools: pins return (this browser only).
4. **SSO** — configure Supabase + Google (below). Then comments sync across teammates.
5. **Annotations + copy suggestions** — `N` and `W`. Owner approves copy in the panel; they also get an inbox item and email once Resend is set.

---

## Google Workspace SSO (Supabase)

The extension ships with **local mode** so you can test without a backend. Shared comments need Supabase.

1. Create a project at [supabase.com](https://supabase.com).
2. SQL editor: run [`supabase/schema.sql`](supabase/schema.sql).
3. Authentication → Providers → **Google**. Use a Google Cloud OAuth client (Web application).
4. Authentication → URL configuration: add the Chrome redirect URL:
   `https://<EXTENSION_ID>.chromiumapp.org/`
   The ID is on `chrome://extensions` once the extension is loaded.
5. Authentication → restrict to your company domain (or set `allowedEmailDomain` below).
6. Copy **Project URL** and **anon public** key into [`extension/collab/config.js`](extension/collab/config.js). Never put the **service role** key in the extension.
7. Reload the extension. Popup → **Sign in with Google**.

Email for copy suggestions: deploy [`supabase/functions/notify-email`](supabase/functions/notify-email/index.ts), set `RESEND_API_KEY` and `NOTIFY_FROM_EMAIL` as function secrets.

---

## Sharing a test build

```sh
npm run extension:zip
```

Send `extension/build/design-handoff.zip`. Testers unzip and Load unpacked on the unzipped folder.

Do **not** publish this to the public Chrome Web Store. Later options: unlisted listing, or Google Admin force-install.

---

## Follow-ups the first testers should answer

- Company Google domain (`allowedEmailDomain`)
- First prototype URL to dogfood
- Whether the first person who reviews a URL should become owner (current behaviour) or owners are assigned
- Whether screenshots of prototype HTML may be stored later

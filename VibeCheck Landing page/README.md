# VibeCheck landing page

A complete product website and deliberate UI/UX critique exercise. The default page contains 12 intentional defects. Keep those behaviors intact; use the separate facilitator guide as the answer key.

## Run locally

Requires Node.js 18 or newer and this folder inside the VibeCheck repository. No install step is needed for the landing page: its live preview uses the repository's already bundled extension runtime.

```sh
cd "/Users/grzegorz.krzton/Desktop/RepoDIR/VibeCheck/VibeCheck Landing page"
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/). Keep that exact host, port, and route during a workshop so feedback stays attached to the same prototype URL.

The local preview is running on that URL at handoff. Restart it with the command above if the process has ended.

`predev` runs `npm run demo:sync` before starting the server. It copies 11 canonical runtime, stylesheet, tutorial, font, and license files without changing their bytes. Generated `demo/vendor/` and `fonts/figtree/` files are ignored by Git. After rebuilding the extension, run `npm run demo:sync` again or restart development to refresh the preview. The local `demo/vendor/provenance.json` records source paths and SHA-256 hashes and is excluded from public routes and builds.

## Build and preview

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

Stop the development server with Ctrl+C before starting the preview on the same port, or use a different port outside a workshop. The build also syncs the canonical demo assets, then outputs a standalone static site in `dist/`. It contains page files, the real extension UI runtime, and its public fonts/images/licenses. Facilitator notes, tests, screenshots, source captures, original artwork, provenance, and repository metadata are excluded. The bundled server returns 404 for those private paths and does not list directories.

The iframe adapter resolves the unmodified runtime's assets relative to the website root. The same static build supports local root hosting and a GitHub Pages project path such as `/VibeCheck/`.

To test the built project path locally:

```sh
npm run preview -- --host 127.0.0.1 --port 4175 --strictPort --base /VibeCheck/
```

Open [http://127.0.0.1:4175/VibeCheck/](http://127.0.0.1:4175/VibeCheck/). This server deliberately denies root-level asset routes while using a project prefix, so missing prefix handling is visible during verification.

## Hosting

This repository does **not** deploy the landing page to GitHub Pages. Use `npm run dev`, `npm run build`, and `npm run preview` locally, or publish the static `dist/` output through your own hosting process. The Zendesk playground copy under `ocr-platform-design/playground/vibecheck-landing` is the team's shared workshop URL when that site is published separately.

## Workshop controls

- Participant view: `http://127.0.0.1:4173/`
- Reset exercise: `http://127.0.0.1:4173/?reset=1`
- Minimal facilitator controls: `http://127.0.0.1:4173/?facilitator=1`

Workshop reset clears this page’s exercise flags, drafts, and local interaction states, and reloads the embedded preview to its seeded comment. **Reset preview** resets only that embedded sample. Neither reset deletes real VibeCheck feedback, native extension preferences, extension storage, or sign-in data. Escape or the visible close control dismisses each simulated overlay. Facilitator tools are a convenience, not an access-control boundary; the answer key is never included in the public site build.

Use invented details in the local access and support demonstrations. No account, access request, subscription, or support message is created. Only three boolean exercise flags are stored; draft email, workspace, and support text are not persisted or submitted.

## Checks

```sh
npm test
npm run build
```

Optional browser regressions use the parent repository’s existing Puppeteer test setup and installed Chrome; they do not add landing-page dependencies. Start the landing preview, then run:

```sh
npm run test:browser
```

`VIBECHECK_LANDING_URL` can select another local URL. To test the production build at the project prefix, start the prefixed preview server above, then run:

```sh
VIBECHECK_LANDING_URL=http://127.0.0.1:4175/VibeCheck/ npm run test:browser
```

The suite launches an isolated browser profile and asserts both the deliberate failures and recovery/reset behavior. See [verification](docs/VERIFICATION.md) for actual results and limitations.

## Files to review

- [Facilitator guide and 12-defect registry](docs/FACILITATOR.md)
- [Verification report](docs/VERIFICATION.md)
- [Visual QA](design-qa.md)
- [Sources and original-artwork prompts](docs/SOURCES.md)
- [Design direction](docs/design-direction.md)
- Current live preview: [desktop](docs/screenshots/live-demo-desktop.png), [content](docs/screenshots/live-demo-content.png), [mobile](docs/screenshots/live-demo-mobile.png), [tablet](docs/screenshots/live-demo-tablet.png)
- Initial layout screenshots: [desktop](docs/screenshots/desktop.png), [desktop full page](docs/screenshots/desktop-full.png), [mobile](docs/screenshots/mobile.png), [mobile full page](docs/screenshots/mobile-full.png), [tablet full page](docs/screenshots/tablet-full.png)

## Live component preview

The product view runs the actual released extension bundle inside its own iframe document. The vertical toolbar, comment composer/detail card, pin, replies, resolve/reopen controls, Content card, and feedback panel are genuine VibeCheck components. The surrounding prototype is sample content.

Use **Try a comment** to open the real composer, or reply to the seeded comment. **Comment**, **Content**, and **Inspect** select the actual runtime tools. Content suggestions can be saved and applied to the sample button. **Reset preview** restores the original button and seeded thread.

The iframe adapter supplies memory-only storage in that child window before loading the unmodified runtime. Demo comments, replies, content suggestions, and preferences disappear when the iframe reloads. The parent window and installed extension retain native storage; no backend, shared feedback, or sign-in is used by this embedded sample.

## Extension boundary

The embedded preview imports the released UI bundle as a local script and uses sample data; it does not exercise extension installation, the browser-action launcher, company sign-in, or shared backend transport. The separate Chrome extension is still required to leave feedback on the full landing page. That authenticated flow requires verification in a configured Chrome profile. See the verification report.

Parent-page styles and event handling are scoped to `#landing-root`; the embedded runtime owns its iframe document. Nonmodal landing overlays stay below an installed extension's document-level overlays.

The extension, original sandbox, authentication, backend, release gates, and shared design-system sources remain unchanged. Publishing work is prepared on `codex/vibecheck-landing-exercise`; the plan restriction above currently prevents a public deployment.

# Source record

Discovery date: 16 October 2026. This separates current source code, historical context, browser observations, and proposals. No other project was edited and no chat was messaged.

## Repository evidence

Verified repository: `/Users/grzegorz.krzton/Desktop/RepoDIR/VibeCheck`. The former `/Users/grzegorz.krzton/Desktop/RepoDIR/design-feedback-tool` path was absent. The landing folder initially contained only `.gitkeep`.

- `docs/release-plan.md` and `app/vibecheck/release-plan.js`: current publish phase `0`. Inspect, Comment, Wording, Guides, Accessibility, Edit Text, AI Prompt; also threads, replies, mentions, resolve/reopen, filters, orphaned pins, shared feedback, sign-in, onboarding. Inbox is phase `1`; Annotation phase `2`.
- `readme.md`: useful positioning, “Drop feedback pins on vibe-coded prototypes,” and internal audiences across design, product, engineering, and content design. Its local-only/Supabase claims and phase roadmap are historical and conflict with newer implementation.
- `PLAN.md`: historical build context, not current release scope.
- `docs/app-foundry-backend-changelog.md`, `app/vibecheck/storage.js`, `extension/backend/app-foundry.js`: AppFoundry remote feedback storage with local demo/cache fallback. Changelog records migration on 23 September 2026. Static inspection does not verify live deployment.
- `design-system/README.md`, `design-system/tokens.json`: ownership contract, canonical Figtree typography/colors, mapped-component rules, generated-file restrictions.
- `assets/vibecheck-logo.svg`, `assets/vibecheck-logo-export.svg`, `assets/vibecheck.svg`, `assets/vibecheck.png`: current green logo assets, locally dated 6 October; SVG metadata identifies Figma `461:10247`.
- `design-system/fonts/figtree/`: local 400/500/600/700 WOFF2 weights and `OFL.txt` license.
- `app/index.html`: existing artboard sandbox, preserved. Legacy logo/full tool examples are not current release marketing evidence.
- `extension/manifest.json`, `extension/vibecheck.js`, `extension/contextmenu/launcher.js`, `extension/backend/auth-gate.js`: `activeTab`/`scripting` injection; no prototype-page allowlist; only persistent host permission is the internal AppFoundry backend. Normal localhost HTTP is compatible by configuration, with company authentication required for actual toolbar entry. Browser testing remains separate.
- `app/vibecheck/url.js`: feedback identity strips query/hash and trailing slash. Maintain origin, port, and route.

No applicable filesystem `AGENTS.md` was found in scanned root/subdirectories or ancestors. User-supplied instructions remain applicable.

## Existing visual assets

Visually inspected `assets/vibecheck.png` (512×512 current logo), `.runtime-card-light.png` (680×740 historical Wording composer), `.scratch/cards-light.png` (historical card/icon overview), and `.scratch/toolbar-light.png` (historical sandbox/toolbar). The last two include Annotation or unshipped tools and legacy branding; do not present them as unqualified current screenshots.

Identified existing 361×203 tutorial files at `app/tuts/inspector.gif`, `guides.gif`, `accessibility.gif`, and `text.gif`. File existence/dimensions do not establish current visual parity. The initial landing build used a labeled product illustration. It has since been replaced by the genuine live component preview described below; historical screenshots of the illustration are not evidence of the new runtime.

## Genuine live component preview

The current demo executes a byte-identical copy of `extension/toolbar/bundle.min.js` inside `demo/index.html`. This is the released UI bundle from this checkout, including its toolbar, selection engine, feedback layer, mapped cards, pins, replies, and resolution behavior. It preserves the actual vertical toolbar layout. The sample prototype and iframe adapter are landing-owned.

`scripts/sync-demo.mjs` copies the bundle to `demo/vendor/vibecheck.js`, `extension/toolbar/bundle.css` to `demo/vendor/vibecheck.css`, four GIFs from `extension/tuts/`, and canonical Figtree 400/500/600/700 fonts plus their license from `design-system/fonts/figtree/`. All 11 files remain byte-identical. Local `demo/vendor/provenance.json` records repository-relative source paths, destinations, sizes, and SHA-256 hashes. This review metadata is excluded from public routes and the static build. `predev` and `npm run build` regenerate the ignored copies; `npm run demo:sync` refreshes them explicitly. No original extension component, bundle, release gate, design token, authentication, or backend source was edited.

`demo/preview.js` supplies sample records, selects tools through the actual `toolSelected()` and selector-engine APIs, and communicates with the parent through messages checked against source window, origin, and channel. Before importing the runtime, it replaces `localStorage` only in the child window with an in-memory adapter. This prevents demo feedback and preferences from reaching native storage or existing extension data. The isolated iframe document's Content Security Policy (CSP) disallows network connections and form submission. This is a local component demonstration; it does not verify installed-extension launch, company authentication, or shared feedback transport.

The final 31-check browser regression runs passed against both the development server and the 37-file production build. They verified served asset hashes, genuine components and interactions, memory/native-storage isolation, reset, mobile containment, and no external/POST requests or runtime errors. Current captures are retained as `docs/screenshots/live-demo-desktop.png`, `live-demo-wording.png`, `live-demo-mobile.png`, and `live-demo-tablet.png`. Detailed coverage and remaining limits are in `VERIFICATION.md`.

The iframe adapter now supplies a `chrome.runtime.getURL()` asset resolver only within that child document. It resolves font paths relative to the site's root using the adapter module URL, supporting both `/` and `/VibeCheck/` without transforming the released runtime. No runtime messaging or extension storage API is supplied. The preview server's `--base /VibeCheck/` mode denies root-level assets to expose missing prefix handling during tests. A fresh production build and all 31 browser regressions passed at that project prefix, including loaded runtime fonts and no 404 requests; this remains local evidence, separate from remote deployment.

## GitHub Pages setup evidence

Publication target: a public Pages website built from the existing private `grzegorzkrzton/VibeCheck` repository. The user authorized public website publication while retaining repository privacy. On 16 October 2026, GitHub's authenticated Pages enablement API rejected the request with HTTP 422, stating that the current plan does not support GitHub Pages for this repository. No successful enablement or live deployment is established by that response.

The workflow follows [GitHub's custom Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). Official release pages checked on 16 October 2026 establish the exact versions selected: [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-node v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0), [configure-pages v6.0.0](https://github.com/actions/configure-pages/releases/tag/v6.0.0), [upload-pages-artifact v5.0.0](https://github.com/actions/upload-pages-artifact/releases/tag/v5.0.0), and [deploy-pages v5.0.1](https://github.com/actions/deploy-pages/releases/tag/v5.0.1). Documentation examples still reference some earlier versions; the official releases were checked directly. No package installation or deployment secret is required by this dependency-free landing build. The build output includes the public extension UI runtime that is already used by the local demo; repository documentation and source metadata are omitted.

## Other projects

- `VibesToProduction/my-site`: focused file/content search found an unrelated Weddly wedding site; no VibeCheck claims or relevant assets.
- `design-feedback-tool-pin-horizontal`: focused README/PLAN/assets review found an older VibeCheck copy with historical localStorage/Supabase positioning and duplicate fonts/tutorials. No newer landing source was identified in the focused scan. Git log metadata was unavailable; no branch/date provenance inferred.

Both directories are siblings of the verified repository and remained unchanged.

## Chats and connected sources

Available chat discovery tools were used to inspect **Create a landing page prompt** and **Prepare VibeCheck tester slides**. The 15 October tester-slide opening description aligns with feedback directly on prototypes, wording, and AI prompts. Contact-slide placeholders are unresolved and are not contact facts.

Google Drive search for `VibeCheck` returned **Weekly Work Log** and **Matthew / Grzegorz notes** dated 24 September. The team read the **Project: VibeCheck** sections of the [Weekly Work Log](https://docs.google.com/document/d/11PxVdNX4HcRUSah6-5G57CRvgy51uBF1bH4lFniP0_g/edit?usp=drivesdk), including weeks of 28 September, 5 October, and 12 October. Its latest 16 October notes describe pilot preparation and tester recruitment while security review is still pending. This is a compiled report; underlying Gmail and Slack evidence was not independently read. It supports careful pilot language, not a promise of approval, publication, or general availability. A focused `design-feedback-tool` search returned no results. Coverage is limited to accessible sources. No private meeting text is reproduced here or in the page. Current release code determines feature claims.

Gmail and Slack were unavailable because no callable tools were exposed; they were not searched. Other inaccessible projects and complete conversation histories are not claimed as inspected. No Figma document contents were inspected in this source/asset review; local logo/design-system metadata supplies Figma provenance.

## Live references

### Gradia

[gradia.framer.website](https://gradia.framer.website/) was inspected rendered in browser on 16 October 2026: initial desktop view, scroll, hover, keyboard focus, and 390px narrow view.

Observed pale diagonal texture; centered 56px desktop/36px narrow heading; pastel dimensional objects; spacious hero; three-column pastel cards; rounded floating navigation after about 1100px scroll with measured 68px inner height; blue keyboard focus; mobile hamburger/stacked actions.

Web Animations reported navigation 460ms/delay 200ms; hero 400ms/delay 300ms with 64px vertical travel; other 400ms/delay 500ms; some 4500ms continuous decorative rotation. Proposed adaptation values are separately marked in `design-direction.md`.

Temporary captured source screenshots, under `/var/folders/kk/_g75cf513057k5pyltg7jykc0000gp/T/.playwright-mcp/`:

- `page-2026-10-16T16-40-22-750Z.png` — desktop.
- `page-2026-10-16T16-42-07-386Z.png` — scrolled navigation.
- `page-2026-10-16T16-42-13-038Z.png` — narrow.

Final landing screenshots are separate deliverables. No Gradia branding or marketing text is copied.

### User Inyerface

[userinyerface.com](https://userinyerface.com/) was inspected rendered on 16 October 2026. Clicking dominant green **NO** kept the landing visible; **HERE** entered the game. The game used split email/local-domain/TLD input. Empty **Next** revealed negative Terms validation. An interrupting cookie banner asked “This site uses cookies, is that a problem for you?” with “Not really, no” and “Yes”. Cancellation used a **Yes** link and **Cancel** button. At 390px it overflowed horizontally and a fixed help overlay obscured the form.

Temporary mobile-game screenshot in the same source directory: `page-2026-10-16T16-42-50-947Z.png`.

The VibeCheck defects adapt these mechanisms to plausible product-site tasks. They do not claim all twelve defects were observed in the reference, recreate its game, or intentionally reproduce overflow/accessibility traps.

## Excluded claims and limits

No invented testimonials, customer counts, pricing, production install destination, release promises, placeholder contacts, or real-account creation. Static source review/build success does not prove live backend availability, company sign-in, or extension browser compatibility. The verification report must record actual tested coverage and remaining limits.

## Landing implementation decisions

Dialogs use non-modal HTML `dialog.show()` and a landing-owned backdrop, rather than the browser top layer. Only a prior landing dialog becomes inert during nesting. There is no body-wide inert state or global keyboard interception; scoped landing Escape recovery respects handled events and extension components. This allows actual VibeCheck overlays to remain above page dialogs by construction. It is not a substitute for extension browser verification.

Workshop reset removes only the native `vibecheck-landing-exercise-v1` key and the `reset` URL parameter, preserving other query parameters and all extension/session storage. It also reloads the live demo, discarding that child window's memory-only feedback and restoring the seed. **Reset preview** reloads only the demo. The interruption flag persists until workshop reset.

## Original generated artwork

Both images were generated on 16 October 2026 with the built-in OpenAI image-generation tool. They are original decorative assets, not product screenshots or reference-site artwork. Public optimized derivatives are `assets/cursor-sculpture.webp` and `assets/paper-grain.webp`; original PNG copies are retained in `docs/assets/` and excluded from the public site build. The paper prompt requested a seamless tile; browser repetition and final opacity must be verified separately.

### Cursor sculpture

Original: `/Users/grzegorz.krzton/.codex/generated_images/01a14597-53f4-7363-a7a9-2dcb221ff6be/exec-688bd2bc-c648-46be-a85c-5a1d4fb0b74e.png`. Retained project source: `docs/assets/cursor-sculpture.png`, 1254×1254 RGBA, 811714 bytes. SHA-256: `7ed431a85eb6ae9cf5dfce8219cbfa3a78cd4bc8ae21035e6bdfc9063e8d4a75`. Generated with `transparent_background: true`.

Exact generation prompt:

```text
Use case: stylized-concept
Asset type: decorative landing-page hero cutout, rendered around 170 by 190 CSS pixels.
Primary request: one original premium playful three-dimensional sculptural computer cursor arrow, with a lime green #9ced2b front surface and soft lavender/lilac extruded side. Smooth rounded bevels, subtle glossy ceramic finish. The arrow points up-left and is tilted about 20 degrees for a dynamic, sculptural appearance.
Scene/backdrop: genuinely transparent background with generous transparent margin around the entire object.
Style/medium: polished minimalist 3D product render, pastel dimensional decoration for an airy typography-led landing page.
Composition/framing: a single isolated cursor sculpture centered in a square image, whole object fully visible, clear readable silhouette at small display size.
Lighting/mood: airy soft studio light, delicate self-shading and soft reflections.
Constraints: no text, no logos, no additional objects, no ground plane, no watermark, no visible background; preserve real transparency.
```

### Paper grain

Original: `/Users/grzegorz.krzton/.codex/generated_images/01a14597-53f4-7363-a7a9-2dcb221ff6be/exec-fcdb964d-e43c-4189-a21a-e902a4e6fe4a.png`. Retained project source: `docs/assets/paper-grain.png`, 1254×1254 RGB, 2197972 bytes. SHA-256: `29605598a5b21102bbcbc431407dc0f907ac577b70bde14b2fd7351daa11443e`. Generated with `transparent_background: false`.

Exact generation prompt:

```text
Use case: stylized-concept
Asset type: seamless repeating paper-grain texture tile for an airy website background, displayed as a 128 by 128 CSS-pixel repeat at low opacity.
Primary request: an extremely subtle neutral pale-lavender paper micrograin texture on an opaque nearly white #f9fafa base. The overall impression must be almost pure soft white, with only the faintest finely dispersed lavender-gray fiber speckle visible on close inspection.
Composition/framing: fill the whole square canvas evenly; seamless and tileable on all four edges, no central focus, no gradients, no vignetting, no directional bands, no large marks.
Style/medium: refined delicate uncoated paper grain, neutral and airy, exceptionally low contrast.
Constraints: texture only; no objects, no text, no logos, no illustrations, no watermark, no dark-gray noise, no heavy fibers, no visible seams. Use an opaque background, preserve the nearly white appearance.
```

## Saved reference evidence and final timing

Captured reference images are retained under `docs/references/`, rather than depending on temporary browser output. Gradia’s mobile hamburger was also activated: it opened a white full-height navigation overlay with section links and a bottom template action (`gradia-mobile-menu.png`). The adaptation uses a smaller menu panel appropriate to this page.

The original artwork is served as `assets/cursor-sculpture.webp` and `assets/paper-grain.webp` (about 85.7KB and 132.1KB). Original PNGs are retained only in `docs/assets/`. Browser rendering and screenshot comparison showed no visible texture seam at the implemented subtle opacity.

Authored implementation timings are 600ms entrance with 0/160/280/400/480ms delays, 550ms reveal, 200ms hover/press, and 6s decorative movement. These differ deliberately from the measured reference timings.

Accessibility verification used [Deque axe-core 4.10.3](https://github.com/dequelabs/axe-core/tree/v4.10.3) only in the test browser; it is not a site dependency. Final verification and extension limitations are in `VERIFICATION.md`.

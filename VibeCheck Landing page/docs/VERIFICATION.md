# Verification report

Verified 16 October 2026. Branch: `codex/vibecheck-landing-exercise`. Local preview: http://127.0.0.1:4173/.

## Result

The landing page runs locally with a genuine embedded component preview. Its iframe executes a byte-identical copy of the released extension bundle; the vertical toolbar, cards, pins, replies, and Content interactions come from that runtime. All 12 registered exercise defects remain active and recoverable. VC-02's inert **View all feedback** text now sits in the demo figure's caption, outside the real components. The original extension, sandbox, release registry, authentication, backend, and shared design-system sources are unchanged. The initial implementation was local. Public GitHub Pages setup is now prepared, but GitHub rejected enablement because the current account plan does not support Pages for this private repository; no public deployment has been verified.

## Passed checks

- Current `npm test`: 7/7 state tests, covering validation, corrupt/unavailable storage, allowed persisted booleans, and reset isolation.
- Publishing preparation rerun: 7/7 state tests, a 37-file production build, and 31/31 browser regressions passed against `/VibeCheck/`. All four runtime Figtree weights loaded. Direct HTTP checks returned 404 for root `/fonts/figtree/figtree-400.woff2`, 200 for `/VibeCheck/fonts/figtree/figtree-400.woff2`, and 404 for `/VibeCheck/demo/vendor/provenance.json`. The browser hash check confirms all 11 copied/served assets still match canonical source bytes.
- `npm run test:browser`: 31/31 browser regressions. Retains deliberate detours, inert link, inconsistent action labels, delayed/generic validation, interruption, negative preference, premature completion, both cancellation outcomes, keyboard recovery, reset/privacy, responsive layouts, navigation, support preview, and private-route coverage. New live-component checks are detailed below.
- Demo sync: all 11 copied runtime, stylesheet, tutorial, font, and license files match canonical source bytes and recorded SHA-256 hashes. Browser checks also compare every served file's hash with its source.
- Infrastructure syntax checks passed for `scripts/sync-demo.mjs`, `scripts/build.mjs`, and `scripts/server.mjs`. Development and build commands regenerate the ignored demo assets. The server explicitly allows the demo files and runtime assets while rejecting provenance, arbitrary demo scripts, documentation, and project metadata.
- Current `npm run build`: synced all 11 unmodified runtime assets and built 37 public files in `dist/`, including the three iframe files and explicitly allowed runtime assets. Documentation, provenance, source captures, tests, and project metadata remain excluded.
- Final browser reruns: 31/31 passed against both the development server at port 4173 and the built preview at port 4174 after focus and readiness refinements. Built-preview checks cover served canonical asset hashes, genuine component interactions, storage isolation, reset, mobile containment, private routes, and no runtime errors or external/POST requests. The temporary built-preview server was stopped; development remains on port 4173.
- Initial build/preview baseline, before the live component replacement: `npm run build` produced 23 public files; a built preview at port 4174 returned HTTP 200, showed working release information, loaded images, denied private facilitator routes, and had no console errors. This baseline does not establish the updated iframe's production-build coverage.
- Parent repository `npm run design:check`: passed. Generated design tokens and mapped components remain in parity.
- Parent `npm run test:unit`: 8/8 release-gate tests passed.
- Parent `npm run test:release-surface`: Phase 0 browser surface checks passed against the existing sandbox test server. The initial environment-limited attempts were rerun successfully; no extension fixes were needed.
- Initial visual baseline at desktop 1440×1000, tablet 768×1024, mobile 390×844: no horizontal page overflow, no missing image, working layout/navigation. A separate touch-emulated 390×844 context passed menu, the earlier illustration modes, access, close, and overflow checks without errors. Current live-component containment is covered below.
- Ordinary motion: entrance completes; scrolling reveals every section; only decoration keeps moving. Reduced motion: no running animations, immediate content visibility, and automatic scroll behavior.
- Hover/press feedback, visible keyboard focus, FAQ disclosure, local support preview, nested overlay dismissal, form recovery, and reset were exercised.

## Genuine component checks

The 31-check browser run verified:

- The actual Full toolbar, anchored pin, seeded Comment Detail card, and real sample button render; the invented toolbar is absent. The Comment, Content, and Inspect controls select the genuine runtime tools.
- **Try a comment** opens the real composer. Shift+Enter creates a new line, Tab reaches Send, and Enter submits a new thread. Replies, overflow-menu Escape/focus return, resolve, reopen, and closing/reopening a saved thread through its pin work.
- The real Content composer saves a suggestion, applies it to the sample button, and displays the Applied state.
- The child window's `localStorage` is a memory adapter distinct from the parent window's native storage. Pre-existing native author, panel preferences, panel layout, and feedback records survive sample interactions and reset unchanged.
- **Reset preview** restores the seed, original button, and Comment tool; workshop reset also reloads the preview while preserving unrelated native storage.
- At a 390×844 parent viewport, the actual toolbar and comment card remain within the iframe, with no horizontal iframe or parent-page overflow.
- The complete tested session emits no runtime/console errors, POST submissions, or external requests. The isolated iframe document's Content Security Policy (CSP) disallows network connections and form submission; no backend or authentication transport was exercised.

The preview adapter supplies the document, sample data, tool selection, parent messaging, and child-window memory storage. It does not replace the actual component rendering or feedback behavior. No original extension bundle, component, backend, authentication, or release gate was changed.

## Accessibility distinction

The accessibility scans in this section were completed before the live iframe replacement. Axe-core 4.10.3 was loaded only into test sessions, not the website. WCAG A/AA and best-practice scans of that baseline main page reported one confirmed violation: the deliberately low-contrast availability note, VC-05 (approximately 1.63:1). No other confirmed violation remained in those tested page, access, interruption, cancellation, review, and support states. A fresh comprehensive accessibility scan of the embedded runtime has not been performed; the new suite verifies specific keyboard interactions and layout containment.

The main-page scan had zero incomplete checks. Review/support scans had a contrast check marked incomplete because of fixed overlapping layers. These were manually inspected: foreground content is visibly unobstructed and sits above the backdrop. Computed support text contrast is 5.51:1, placeholder 5.35:1, field boundary 3.35:1, and progress accent 5.28:1 against its pale surface. These are checks of these states, not a claim of comprehensive accessibility certification.

Accidental contrast failures, hidden-error announcements before submission, weak field boundaries, support draft loss, Escape recovery after leaving an overlay, and narrow artwork stretching/cropping were corrected. VC-05 and all other listed teaching faults were preserved. Nonmodal overlays intentionally avoid trapping focus so the real extension can remain reachable.

## Intentional defects verified

- VC-01: primary hero action opens release information, with a working route onward.
- VC-02: underlined feedback text in the demo caption stays inert; weak installation link actually opens its notes. Genuine feedback components remain functional.
- VC-03: three differently named actions open the same setup.
- VC-04: vague icon-only control opens usable local support.
- VC-05: localized availability text retains the measured contrast failure.
- VC-06: email requires separate name and domain input.
- VC-07: workspace length rule is hidden until a rejected submit, including in the accessibility tree.
- VC-08: invalid email gets generic guidance; help and correction recover.
- VC-09: negative preference starts checked; final local receipt resolves the chosen value.
- VC-10: three workspace characters trigger an interruption once per reset; Escape returns focus.
- VC-11: Continue resumes editing; Cancel inside the confirmation discards the draft.
- VC-12: 100%/all-set state appears while the completion flag remains false; Finish is required.

The 31-check suite asserts the stateful faults so maintenance does not silently repair the exercise. The full reproduction and learning objectives are in [FACILITATOR.md](FACILITATOR.md).

## Installed-extension and deployment limits

Source inspection confirms normal localhost HTTP is compatible with the current active-tab/site-access configuration. Actual authenticated tool use remains unverified.

A separate earlier temporary-profile test attempted to load the repository’s real extension. The bundled Playwright Chromium executable was missing. Installed Chrome 155.0.8059.80 opened the landing page, but unpacked-extension launch flags did not load an extension service worker. Both temporary profiles were closed and removed. No user profile or authentication state was changed. The current embedded-bundle checks establish local component behavior and do not substitute for an installed-extension/authentication test.

Browser-action toolbar launch, company sign-in, shared backend feedback, and tool use against the outer landing page still need a configured Chrome profile with the real extension. The auth gate is confirmed in source, not observed at runtime. Element selection, comment creation, replies, resolution, and content apply were verified inside the embedded runtime only. Mobile checks used browser/touch emulation; physical devices and a live screen reader were not tested.

The iframe adapter now supplies an iframe-local `chrome.runtime.getURL()` resolver, without messaging or storage APIs, before importing the unchanged runtime. Runtime font requests resolve under the static site's own project prefix. The bundled preview server supports `--base /VibeCheck/` and denies root-level asset routes when that prefix is active. The production build and all 31 browser regressions passed at `http://127.0.0.1:4175/VibeCheck/`, using `VIBECHECK_LANDING_URL` with the prefixed preview server. Checks establish that actual fonts load under the prefix, no requests return 404, and the genuine comment/reply/resolve/Content flows, native-storage isolation, reset, and mobile containment still work. The temporary prefixed server was stopped; the existing root development server was not changed. This local project-path result does not establish a live GitHub deployment.

## GitHub Pages publication status

On 16 October 2026, the authenticated Pages enablement request for the existing private `grzegorzkrzton/VibeCheck` repository returned HTTP 422: “Your current plan does not support GitHub Pages for this repository.” Repeating the request with the explicit `2022-11-28` API version returned the same result. This is an account-plan restriction, not a successful Pages configuration. The repository remains private, and [https://grzegorzkrzton.github.io/VibeCheck/](https://grzegorzkrzton.github.io/VibeCheck/) is only the expected address until an actual successful deployment and public HTTP/browser verification establish it.

The prepared `.github/workflows/landing-pages.yml` tests landing state, builds the static output, and uploads only `VibeCheck Landing page/dist`. It permits `main` and `codex/vibecheck-landing-exercise`, serializes deployments, and uses separate read-only build permissions and Pages/OIDC deployment permissions. Its configuration action does not try to enable Pages or alter repository visibility. A supported account plan, Pages source setting, and permitted `github-pages` environment branches are prerequisites. Workflow YAML parsed successfully, and structural checks passed for triggers, artifact path, job dependency, nonpersisted credentials, concurrency, and permissions. An independent read-only review found no issues. GitHub Actions execution and live-site behavior remain unverified until the plan restriction is resolved.

## Evidence

Current live-component captures: [desktop](screenshots/live-demo-desktop.png), [content composer](screenshots/live-demo-content.png), [mobile](screenshots/live-demo-mobile.png), [tablet](screenshots/live-demo-tablet.png).

Initial-build screenshots, retained as historical layout evidence before the live iframe replacement: [desktop](screenshots/desktop.png), [desktop full page](screenshots/desktop-full.png), [tablet](screenshots/tablet-full.png), [mobile](screenshots/mobile.png), [mobile full page](screenshots/mobile-full.png), [mobile setup](screenshots/mobile-setup.png), [validation](screenshots/desktop-validation.png), [premature review](screenshots/desktop-review.png). These captures do not establish the current live preview's appearance.

Visual comparison and iteration history: [design-qa.md](../design-qa.md). Source/coverage record and exact artwork prompts: [SOURCES.md](SOURCES.md).

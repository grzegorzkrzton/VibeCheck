# Visual QA

final result: passed

## Comparison target and evidence

This is an adaptation of Gradia’s composition to VibeCheck, as requested, rather than a pixel clone of its agency website. The product identity, copy, sample prototype, toolkit presentation, and workshop behaviors are intentionally original. The current preview embeds genuine VibeCheck components, as requested in the follow-up review.

Initial-build source visual truth: [Gradia desktop](docs/references/gradia-desktop.png) and [Gradia mobile](docs/references/gradia-mobile.png). Rendered implementation: [1200px desktop](docs/screenshots/desktop-1200.png) and [mobile](docs/screenshots/mobile.png).

The source and implementation were placed in the same comparison images and opened together: [desktop comparison](docs/screenshots/comparison-desktop.png), [mobile comparison](docs/screenshots/comparison-mobile.png). Source is on the left, VibeCheck on the right.

Desktop comparison uses 1200×897 CSS/pixel viewport captures; mobile uses 390×844. Both sides use CSS screenshot scale at 1×, no browser frame, light theme, initial hero state, overlays closed. Full-page captures may exclude the desktop scrollbar, which is not layout drift. No density resampling was needed. Both hero text and controls are readable in these viewport comparisons; separate hero zoom crops would add no useful evidence. The initial product illustration and form were additionally inspected at their actual viewport size, including the [mobile form](docs/screenshots/mobile-setup.png) and [desktop validation](docs/screenshots/desktop-validation.png).

## Findings and iteration history

- Resolved P2: narrow decorative cursor stretched vertically and clipped at the edge. Evidence: [mobile before fix](docs/screenshots/iterations/mobile-before-artwork-fix.png), [tablet before fix](docs/screenshots/iterations/tablet-before-artwork-fix.png). Fix: preserve intrinsic aspect ratio, reduce the narrow artwork size, and position it above the heading. Post-fix evidence: [mobile](docs/screenshots/mobile.png) and [tablet](docs/screenshots/tablet-full.png). The cursor no longer covers reading content.
- Resolved P2: fixed mobile support widget could cover a section heading while scrolling. Fix: position it beside the navigation controls on narrow screens. Post-fix mobile capture shows a clear content column; the deliberately ambiguous support icon remains VC-04.
- Resolved P2: small secondary text and field boundaries outside the defect registry had insufficient contrast. Fix: darken those specific surfaces and placeholders while preserving VC-05. Post-fix browser scans report only the registered note; measured text/boundary values are recorded in [verification](docs/VERIFICATION.md).

The revised captures were compared again. No actionable P0/P1/P2 visual issue remains within the requested adaptation scope. The 12 documented teaching faults are expected product behavior and are excluded from accidental-regression findings.

## Required fidelity surfaces

**Fonts and typography.** Local Figtree 400/500/600/700 loads successfully. Large 600-weight dark headings preserve the source’s strong centered hierarchy. VibeCheck uses a larger display scale (up to 84px desktop, 49px narrow) as an intentional brand adaptation; mobile copy wraps to three clear lines without clipping. Supporting text and responsive form inputs remain readable and browser zoom is unrestricted.

**Spacing and layout rhythm.** Spacious centered hero, deliberate section gaps, soft surfaces, rounded floating navigation, three pastel capability cards, and a quieter workflow/FAQ maintain the reference’s pacing. At 768px the desktop composition still fits. At 390px the capability cards stack; navigation becomes a working menu. No horizontal overflow or cropped task control remains.

**Colors and tokens.** Existing ink, pale surfaces, lime #9ced2b, and pastel families anchor the site to VibeCheck’s local design sources. A subtle paper grain replaces the reference’s stronger diagonal texture. The green primary action is an intentional identity adaptation. Only the documented availability note retains low contrast.

**Image quality and assets.** Current source logo/icons and self-hosted fonts are reused without changing mapped components. Original transparent cursor sculpture and paper grain were visually inspected and supplied as optimized WebP; 1254px source PNGs remain in docs/assets. Aspect ratio, alpha edges, crop, and narrow layout were checked. The initial authored review illustration has been replaced by the actual released UI runtime. The toolbar, comment and wording cards, feedback panel, and pins execute unchanged inside the preview iframe; only the sample prototype and memory adapter are landing-owned. Synced files are byte-identical to canonical sources.

**Copy and product content.** Finished English copy reflects the current release: seven tools plus shared feedback/threads. Future Inbox/Annotation, unsupported metrics, invented testimonials, pricing, and release promises are absent. Local setup/support clearly state that no real data submission or account creation occurs.

## Interaction and motion review

All primary navigation and local simulation paths were exercised. Default motion uses a 600ms entrance with delays 0/160/280/400/480ms, 550ms reveals, 200ms hover/press feedback, and 6s decorative movement. These are authored values, separate from measured reference timings. Reduced motion disables movement and reveals content immediately. Useful annotation targets remain static after entrance. Touch and keyboard alternatives were checked; Escape and visible dismissal recover every landing overlay.

## Follow-up: genuine live component preview

The two browser comments are resolved. The invented horizontal toolbar and feedback cards have been removed, including their unused CSS. The preview now uses the extension's actual vertical toolbar and existing Comment/Wording cards. A seeded anchored comment opens in the real Detail card; visitors can reply, create a comment, resolve/reopen, and save/apply wording suggestions. Parent controls open and focus the genuine composers. Loading/reset states disable controls until the runtime is ready.

Current visual evidence: [desktop comment](docs/screenshots/live-demo-desktop.png), [wording composer](docs/screenshots/live-demo-wording.png), [tablet](docs/screenshots/live-demo-tablet.png), and [mobile](docs/screenshots/live-demo-mobile.png). Desktop captures use 1328×1258, tablet 768×1000, and mobile 390×1000 CSS pixels at 1×. These are current live components, separate from the historical hero/reference comparisons above. Actual component styling and interaction code are unmodified.

All four captures were opened and inspected at viewport size. The real toolbar, card text, reply input, and send actions are readable. At mobile width the Notes panel begins collapsed, and the genuine anchored card fits within the iframe; the overlay may cover sample content, as it does in the extension. At desktop the Notes panel and anchored card remain distinct. No horizontal page overflow or accidental clipping was found. Keyboard creation, reply, menu Escape, resolution, reopening, and wording application pass automated browser checks; feedback is held only in the iframe's memory and resets independently.

The existing landing composition, toolkit, and 12 intentional teaching faults are preserved. VC-02's inert feedback link is now in the demo caption, outside the genuine components. No actionable P0/P1/P2 visual issue was found in this scoped revision.

## Remaining limits and checklist

- Build produces 37 public files. All 7 state tests and 31 browser regression checks pass against both development and built previews; no unexpected console errors or missing assets.
- Desktop, tablet, mobile, touch emulation, and reduced motion pass.
- Initial main-page accessibility scans found VC-05 as the only confirmed failure in their tested states. The new runtime has targeted keyboard/containment coverage; a comprehensive accessibility rescan was not performed.
- Genuine embedded toolbar and feedback interactions are verified. Installed-extension launch, company authentication, and shared backend feedback still need a configured Chrome profile; that separate integration was not exercised.
- No deployment or publishing performed. The verified local preview is the handoff.

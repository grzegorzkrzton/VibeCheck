# VibeCheck Chrome Web Store screenshots

Three upload-ready PNGs, each exactly **1280 × 800**. Use them in this order:

1. `01-good-feedback-better-vibes.png` — lead image: VibeCheck toolbar and feedback on a prototype.
2. `02-comments-in-context.png` — actual Comment detail, posted reply, and anchored pin.
3. `03-find-the-words-that-work.png` — actual Content detail with original text, suggestion, reasoning, and Apply suggestion control.

`vibecheck-chrome-web-store-screenshots.zip` contains only these three upload images. `preview.png` is a contact sheet for review; it is not a store upload asset.

## Art direction and source

Based on the supplied [VibeCheck Figma example, node 497:4617](https://www.figma.com/design/3UduCyltV7tmRYSnDqTEfA/VibeCheck?node-id=497-4617). The set keeps its pale green background, Figtree type, VibeCheck logo, white rounded product canvas, and soft shadow. Lavender and warm cream distinguish the two feature views. The cursor sculpture is reused from the VibeCheck landing page.

The product images are captures of the live landing-page demo, which executes the extension's existing runtime. No product controls were redrawn. The Comment reply and Content suggestion were posted through the real controls, and the Content Apply control was verified. Names, feedback, and the underlying prototype are sample content. Notes was collapsed through its control; the demo helper sentence was hidden for the capture. Open pins intentionally retain the runtime's unnumbered active appearance.

Editable composition: `source/index.html` and `source/styles.css`. The three real UI captures, logo, cursor, and locally hosted fonts are in `source/assets/`. Font license is included. `source/capture-bounds.json` records the capture viewport and actual component bounds; screenshots were captured at 2× and composed into final 1× exports.

Open `source/index.html?shot=1`, `?shot=2`, or `?shot=3` to inspect an individual artboard. To re-export from the repository with its existing installed browser tooling:

```sh
node marketing/chrome-web-store/source/render.cjs
```

Recreate the ZIP if the images change. Exports have full-bleed, opaque backgrounds and square outer corners. Checked at full size and at the store's smaller preview size. [Official Chrome Web Store image guidance](https://developer.chrome.com/docs/webstore/images).

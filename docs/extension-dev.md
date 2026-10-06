# Extension development checklist

Use this whenever you change **app/**, **extension/**, icons, or release gates. You do not need to remember the details—follow these steps.

## After every code change

From the **repo root**:

```sh
npm run extension:build
```

Then in Chrome:

1. Open `chrome://extensions`
2. Find **VibeCheck** (or **DevCheck** if you used `npm run dev:extension`)
3. Click **Reload** (↻)

Chrome only picks up new JS/CSS/icons after **build + reload**. Editing files alone is not enough.

## Version number in `chrome://extensions`

The version label comes from **`extension/manifest.json`**, not from git or file dates.

| What you did | What happens to the version |
|--------------|----------------------------|
| `npm run extension:build` | Manifest version is set from **`package.json`** automatically (`scripts/sync-extension-version.mjs`). |
| You need a new version for testers | Run `npm run bump` (patch), then `npm run extension:build`, then reload in Chrome. |
| Local dev build with DevCheck name | `npm run dev:extension` → manifest version **0.0.0** and dev icon. |

If the list still shows an old version, you skipped **build** or **Reload**, or you are loading a different folder than `design-feedback-tool/extension`.

## First-time / new machine

```sh
npm install
npm run extension:build
cd extension && ./verify-phase0.sh
```

Load unpacked from the **`extension/`** directory (path must end with `/extension`).

## Quick reference

| Goal | Command |
|------|---------|
| Rebuild extension after changes | `npm run extension:build` |
| Dev build (DevCheck 0.0.0) | `npm run dev:extension` |
| Ship patch version | `npm run bump` then `npm run extension:build` |
| Verify folder before load | `cd extension && ./verify-phase0.sh` |

## Related

- Phase 0 tool scope: [`release-plan.md`](release-plan.md)
- Repo overview: [`../readme.md`](../readme.md)

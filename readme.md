# VibeCheck

**Review vibe-coded prototypes together, directly in Chrome.**

VibeCheck is an internal Chrome extension for product designers, content designers, design managers, and teammates reviewing web prototypes. Leave feedback on interface elements, discuss wording suggestions, inspect the page, and turn text edits into structured prompts for an AI coding tool.

## Purpose

Code-based prototypes often lack a shared commenting workflow. VibeCheck brings feedback into the prototype so teams can:

- Keep comments attached to the relevant interface element.
- Involve teammates earlier and discuss changes in context.
- Suggest, discuss, and apply wording changes during content reviews.
- Carry text changes into implementation using an exported AI prompt.

## Current MVP

- **Comments:** pinned feedback, reply threads, mentions, resolve/reopen, and thread deletion.
- **Content suggestions:** proposed wording, supporting reasoning, discussion, and applying a suggestion to the page.
- **Notes panel:** review, filter, and sort feedback.
- **Inspect and Guides:** inspect element properties and dimensions, and compare spacing and alignment.
- **Accessibility:** check text color contrast and inspect accessibility information.
- **Edit Text:** preview text changes on the prototype.
- **AI Prompt:** copy a structured prompt containing text edits across multiple elements for use in an AI coding tool.
- **Appearance:** light and dark toolbar themes.

The current scope is an internal MVP for early testing. The [release plan](docs/release-plan.md) defines which features are enabled; additional tools in the source may belong to later phases.

## Access and requirements

- Google Chrome on your laptop.
- An authorized company account for Okta sign-in.
- Access to the shared AppFoundry backend for profiles and feedback.
- For local installation on a managed company browser: approval through the **Chrome Extension Developer Program**, including manager approval. Use the request link provided with the pilot instructions.

The Chrome Extension Developer Program application is the access request for local installation. Once approved, follow the installation steps below.

## Install locally

Testers can use the prepared extension ZIP without installing development tools.

1. Download the VibeCheck extension ZIP shared with the pilot and unzip it into a folder on your laptop.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the folder containing `manifest.json`. If you downloaded the full repository, select its **`extension/`** subfolder.
5. Keep the extracted folder on your laptop; Chrome loads the extension from that location.
6. Open the prototype you want to review and click **VibeCheck** in Chrome's Extensions menu. You can pin the icon for easier access.
7. Complete company sign-in through Okta and enter your first and last name if prompted.
8. Return to the prototype and click VibeCheck again to open the toolbar.

Click the extension icon or press **Alt+Shift+D** to show or hide the toolbar. Chrome's own pages, such as `chrome://extensions`, cannot host the review tools; open a normal web prototype first.

## Review a prototype

1. **Leave feedback.** Use Comment to select an element and start a discussion. Teammates can reply and add mentions.
2. **Review content.** Use the content suggestion tool to propose replacement wording, explain why, discuss it, and apply it to the page.
3. **Manage feedback.** Open Notes to filter and sort items, resolve or reopen discussions, and delete threads where permitted.
4. **Inspect the interface.** Use Inspect, Guides, and Accessibility to check dimensions, spacing, alignment, and text contrast.
5. **Prepare implementation changes.** Use Edit Text on one or more elements, then choose AI Prompt to copy the recorded text changes. Paste that prompt into your AI coding tool to update the prototype's source code.

Applying a suggestion or editing text changes the page in your browser. The source code is updated separately through your implementation workflow.

### Shared feedback and sign-in

The installed extension uses the **AppFoundry backend** to store user profiles, comments, replies, and content suggestions. Feedback is associated with the prototype URL so teammates can retrieve it for the same page. Prototype URLs are normalized by origin and path; query strings and hash fragments do not create separate feedback spaces.

Okta sign-in and a reachable backend are required for the authenticated extension workflow. Local browser storage also supports caching and standalone demos; a local demo does not verify company sign-in or shared backend behavior.

Mentions are available in discussions. The inbox is outside the current release, and the current backend does not provide email notifications.

## Update a local installation

1. Get the updated extension build and replace the files in the folder Chrome already uses for VibeCheck.
2. Open `chrome://extensions` and click **Reload** on VibeCheck.
3. Refresh the prototype page and activate the extension again.

Locally installed copies need this update step when a new build is shared.

## Develop VibeCheck

Requires **Node.js 18 or newer** and npm.

```sh
git clone https://github.com/grzegorzkrzton/VibeCheck.git
cd VibeCheck
npm install
npm run extension:build
sh extension/verify-phase0.sh
```

Then load the generated `extension/` folder in Chrome using the local installation steps above.

### After source changes

From the repository root:

```sh
npm run extension:build
```

Reload VibeCheck in Chrome and refresh the prototype page. The build bundles the interface source from `app/`, copies the release configuration and assets into `extension/`, and synchronizes the extension version with `package.json`.

For design token changes, run `npm run design:sync` before rebuilding. See the [design system documentation](design-system/README.md) and [extension development checklist](docs/extension-dev.md).

### Package for testers or store submission

```sh
npm run extension:zip
```

This rebuilds the extension and creates **`extension/build/vibecheck.zip`**, with `manifest.json` at the top level of the archive. Share this ZIP with local testers or use it as the extension package for store submission. Store publication and review are separate from creating the ZIP.

### Check changes

```sh
npm run test:unit
npm run test:release-surface
npm run design:check
```

The full browser-based test workflow is available through `npm run test:ci`.

### Repository structure

- [`app/`](app/) — interface and feature source, including comments, content review, inspection, and AI prompt generation.
- [`extension/`](extension/) — browser extension package, sign-in screens, and the client that connects to AppFoundry.
- [`backend/`](backend/) — the server application for authenticated profiles, feedback APIs, and PostgreSQL persistence, deployed separately to AppFoundry.
- [`design-system/`](design-system/) — tokens, fonts, component mappings, and generated styles.
- [`scripts/`](scripts/) — design synchronization, versioning, and validation tools.
- [`tests/`](tests/) — shared test setup; feature tests also live alongside source files in `app/`.
- [`docs/`](docs/) — release scope, development instructions, and design documentation.
- [`Backlog/`](Backlog/) — planning and design work.
- [`supabase/`](supabase/) — files retained from an earlier backend approach; the current extension connects to AppFoundry.

The full repository is used to develop and maintain VibeCheck. Testers install the prepared extension package. AppFoundry continues to run separately; rebuilding the Chrome extension does not deploy backend changes.

## Support and feedback

Use the dedicated pilot Slack channel shared by the organizer for questions, feedback, and issue reports. No reporting template is required. Include what you were doing, what happened, the prototype URL, and screenshots or error messages where helpful. Report sign-in problems and failures to load or save shared feedback as soon as they happen.

## License

Licensed under Apache-2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE) for licensing and attribution information.

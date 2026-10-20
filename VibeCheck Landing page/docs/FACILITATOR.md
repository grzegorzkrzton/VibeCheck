# VibeCheck landing page: facilitator guide

This is a deliberately imperfect product website for a UI/UX critique workshop. Participants explore the page and leave feedback with the real VibeCheck extension. Access, consent, and support flows are local simulations: no account creation, personal-data submission, subscription, or extension changes.

This document is the answer key and implementation contract. Keep it out of participant-facing navigation. The separate verification report records what has actually been tested.

The embedded product preview runs the actual released VibeCheck UI bundle on a sample prototype, including the genuine vertical toolbar, comment card, pins, replies, and Content controls. Its feedback stays in memory inside the iframe. Use the installed extension for critique of the full landing page and its planted defects.

## Before a session

1. Start the local landing page using the landing folder's README. Keep the same origin, port, and path throughout the session; VibeCheck associates feedback with the normalized prototype URL.
2. For feedback on the full landing page, use a Chrome profile with the unpacked extension loaded from the repository's `extension/` folder. Company sign-in may be required before its toolbar opens. The embedded sample preview needs no extension installation or sign-in.
3. Open the preview with `?reset=1` once. The page restores the initial exercise state and removes only the `reset` parameter. Other parameters, including `facilitator=1`, remain.
4. Confirm the normal page exposes no answer key, defect list, facilitator panel, or score.
5. Ask participants to use invented details in the access form. The final receipt must identify the local simulation clearly.

To demonstrate the embedded components, reply to the seeded comment, use **Try a comment** to create another thread, or select **Content** to save and apply a suggestion to the sample button. **Comment**, **Content**, and **Inspect** activate actual runtime tools. These are sample interactions, not feedback saved against the outer landing page. Do not place teaching defects inside the genuine components.

## Suggested participant tasks

These tasks do not name the planted issues.

1. Explain what VibeCheck does and identify two ways to use it when reviewing a live prototype.
2. Find out how to get started, begin the local access walkthrough, then change your mind partway through and leave it.
3. Start again and complete the local access walkthrough using invented details.
4. Find help for setup, check the FAQ, and use VibeCheck to leave a comment and a content suggestion on something you would improve.

Invite participants to describe what happened, what they expected, and why the difference matters. Distinguish a capability question from a landing-page usability finding. Reveal the registry after the critique.

## Reset and recovery

The parent page owns one native localStorage key: `vibecheck-landing-exercise-v1`. It stores only three boolean flags: interruption shown, local setup completed, and simulated updates preference. These persist across reloads and browser sessions until reset; form text stays in memory. The support interruption fires once per reset, not once per browser session. The embedded runtime uses a separate memory-only storage adapter in its child window; its comments, replies, content suggestions, author, and panel preferences are lost on iframe reload and never overwrite native extension data.

- **Full reset:** open the same landing URL with `?reset=1`. It clears only the native exercise key, resets the access form, FAQ, navigation, and overlays, reloads the embedded preview to its seeded comment and original button, and removes only the `reset` query parameter. It preserves `facilitator=1` and other query parameters. It must not clear native localStorage or sessionStorage wholesale.
- **Reset preview:** reloads only the iframe, discarding its memory-only feedback and restoring the seeded comment, original button, and Comment tool. Workshop flags and the access form remain unchanged.
- **Facilitator tools:** open with `?facilitator=1`. Only **Reset workshop** and **Close overlays** are exposed. There is no score or training dashboard.
- **Close overlays:** dismisses simulated dialogs and returns to the page, preserving form and exercise state.
- **Escape:** closes the top simulated dialog when focus is in that dialog or other landing-owned content. Focus returns to its trigger or interrupted form control. Extension-owned keyboard events remain with the extension.
- **Repeat the interruption:** reset before opening the form and entering three workspace characters. The trigger is deterministic and fires once per reset.

Reset does **not** delete real VibeCheck feedback, authentication/session cookies, extension storage, or other website storage. Resolve or clear real feedback through VibeCheck's own controls when needed. After completing the walkthrough, access actions reopen its receipt; reset before asking another participant to repeat the form.

## Dialog and extension behavior

The page uses non-modal HTML `dialog.show()` with a landing-owned backdrop. Dialogs stay outside the browser top layer so real VibeCheck overlays can appear above them. The body is not made inert, no page-wide focus trap is installed, and there is no global shortcut capture. Only the previous landing dialog is temporarily inert while a nested landing dialog is open. Closing the top dialog restores that dialog and appropriate focus. Page styles and keyboard handling are scoped to landing-owned content.

The live sample owns a separate iframe document, so its actual selection overlays, top-layer cards, and keyboard interactions stay inside the preview. No backend or authentication transport is used. Original extension/backend sources remain unchanged. The embedded sample validates component behavior; installed-extension launch and company sign-in remain separate checks.

## Defect registry

Preserve these faults during maintenance. Code identifies each planted behavior by its stable ID. A failure outside this registry is an implementation bug unless explicitly added to the exercise contract.

### VC-01 — Primary action leads to an unexpected destination

- **Location:** prominent hero **Get VibeCheck** action.
- **Trigger:** activate that action.
- **Expected usable behavior:** open the installation/access walkthrough promised by the action.
- **Implemented faulty behavior:** opens release notes first; a secondary continuation reaches setup.
- **User impact:** users must interpret an unrequested detour and locate the actual next step.
- **Learning objective:** evaluate whether visual emphasis and labels predict outcomes.
- **Reproduction:** load the default page, activate **Get VibeCheck**, observe release notes, then follow the setup continuation.
- **Reset/recovery:** continue to setup, close the dialog, or press `Escape`; no full reset required.

### VC-02 — Link appearance does not predict interactivity

- **Location:** underlined **View all feedback** in the demo figure's caption, outside the real components; real installation-notes link in the FAQ.
- **Trigger:** activate the underlined text, then seek installation information in the FAQ.
- **Expected usable behavior:** link-like text is actionable and actual links are recognizable.
- **Implemented faulty behavior:** **View all feedback** is an inert span; the functional installation-notes link has weak visual affordance.
- **User impact:** users waste effort on inert text and may miss the useful destination.
- **Learning objective:** compare perceived affordances with behavior across a page.
- **Reproduction:** click the underlined text in the demo figure's caption; navigate to the relevant FAQ and activate its installation-notes link. The actual embedded feedback panel and cards remain functional.
- **Reset/recovery:** use normal navigation or another setup action; no reset required.

### VC-03 — One task has inconsistent labels

- **Location:** navigation, hero setup action, and final action section.
- **Trigger:** compare **Get early access**, **Set up locally**, and **Join the workspace**.
- **Expected usable behavior:** consistent labels communicate that these actions start the same local walkthrough.
- **Implemented faulty behavior:** the same task has three names.
- **User impact:** users may infer different availability, prerequisites, or destinations.
- **Learning objective:** assess terminology consistency across a complete journey.
- **Reproduction:** activate each action in turn and compare the access walkthrough that opens.
- **Reset/recovery:** close the walkthrough between actions; reset only to repeat the interruption.

### VC-04 — Support control has an unclear meaning

- **Location:** floating icon-only support control.
- **Trigger:** inspect, focus, or activate it.
- **Expected usable behavior:** visible or accessible wording communicates its help/support purpose.
- **Implemented faulty behavior:** an ambiguous icon has the vague accessible name **Open panel**.
- **User impact:** users must experiment; assistive-technology users receive similarly weak information.
- **Learning objective:** evaluate meaningful names and icon comprehension.
- **Reproduction:** tab to the control, inspect its name, activate it, and observe support content.
- **Reset/recovery:** close it or press `Escape`; keyboard reachability and focus return must work.

### VC-05 — Availability information has low contrast

- **Location:** final action section's internal-tester availability note.
- **Trigger:** read the small availability note.
- **Expected usable behavior:** relevant access limitations are readable and sufficiently prominent.
- **Implemented faulty behavior:** this note intentionally has insufficient text/background contrast.
- **User impact:** users may miss that access is intended for internal testers.
- **Learning objective:** connect contrast and hierarchy to informed decisions.
- **Reproduction:** inspect the final note visually or with VibeCheck's Accessibility tool.
- **Reset/recovery:** no reset required; other essential text remains readable.

### VC-06 — Email entry is unnecessarily fragmented

- **Location:** simulated access form's email fields.
- **Trigger:** enter an invented email.
- **Expected usable behavior:** one email field accepts a familiar complete address.
- **Implemented faulty behavior:** users enter the local part and domain separately around a fixed `@`.
- **User impact:** extra focus changes and unfamiliar structure increase effort and mistakes.
- **Learning objective:** assess input structure against users' mental models and autofill expectations.
- **Reproduction:** open access and enter an address across the two fields.
- **Reset/recovery:** edit both fields or close the form; full reset clears the draft.

### VC-07 — A requirement appears only after submission

- **Location:** simulated access form's workspace field.
- **Trigger:** submit a workspace name shorter than six characters.
- **Expected usable behavior:** communicate the minimum length before form submission.
- **Implemented faulty behavior:** the six-character requirement is revealed only after submit.
- **User impact:** users repeat work after an avoidable failed attempt.
- **Learning objective:** distinguish preventive guidance from reactive validation.
- **Reproduction:** enter an otherwise usable email and a short workspace name, dismiss any support interruption, then submit.
- **Reset/recovery:** extend the name to at least six characters and resubmit; reset restores a fresh walkthrough.

### VC-08 — Email validation gives weak guidance

- **Location:** simulated access form's email validation.
- **Trigger:** submit a malformed combined email value.
- **Expected usable behavior:** identify the problem and show a helpful correction or example.
- **Implemented faulty behavior:** a generic initial error does not explain the format problem.
- **User impact:** users must guess what to change.
- **Learning objective:** judge validation by recovery support, not only rejection of bad data.
- **Reproduction:** enter a malformed email and valid workspace name, submit, then activate **Need help?**.
- **Reset/recovery:** **Need help?** reveals useful address-format guidance; correct and resubmit.

### VC-09 — Consent uses ambiguous negative wording

- **Location:** simulated access form's updates checkbox.
- **Trigger:** interpret or change **Don't disable occasional product updates**, checked by default.
- **Expected usable behavior:** direct wording makes the checked state and preference clear.
- **Implemented faulty behavior:** negative wording obscures the selected preference.
- **User impact:** users can choose an unintended preference.
- **Learning objective:** evaluate consent comprehension and default choices.
- **Reproduction:** choose a checkbox state, complete the walkthrough, and compare the receipt's explicit preference summary.
- **Reset/recovery:** before **Finish setup**, choose **Back** to edit the preference. After the receipt, reset to repeat the form. No real subscription exists.

### VC-10 — Help interrupts a task in progress

- **Location:** access form and simulated support-tour dialog.
- **Trigger:** workspace first reaches at least three trimmed characters after reset.
- **Expected usable behavior:** help is available without unexpectedly displacing the task.
- **Implemented faulty behavior:** a support tour interrupts typing once per reset at a deterministic threshold.
- **User impact:** users lose concentration and must dismiss competing content.
- **Learning objective:** assess interruption timing and task continuity.
- **Reproduction:** reset, open setup, and type three workspace characters.
- **Reset/recovery:** close or press `Escape`; preserve the draft and restore form focus. Reset re-arms the interruption.

### VC-11 — Cancellation labels obscure the consequence

- **Location:** access form's cancellation-confirmation dialog.
- **Trigger:** cancel the access walkthrough.
- **Expected usable behavior:** clearly distinguish discarding the draft from returning to editing.
- **Implemented faulty behavior:** **Keep going?** offers **Cancel** to discard and **Continue** to resume editing.
- **User impact:** users must infer which action abandons the task and may choose the opposite result.
- **Learning objective:** assess consequence-based confirmation labels in context.
- **Reproduction:** enter a draft, cancel, choose **Continue**, then repeat and choose **Cancel**.
- **Reset/recovery:** **Continue** resumes; **Cancel** discards; `Escape` safely returns to editing. Reset clears exercise state.

### VC-12 — Completion feedback precedes completion

- **Location:** access walkthrough's valid-submit state.
- **Trigger:** submit valid local form values.
- **Expected usable behavior:** claim completion only after all required actions finish.
- **Implemented faulty behavior:** **You're all set** and 100% progress appear while **Finish setup** remains required.
- **User impact:** users can stop early or misunderstand the state.
- **Learning objective:** compare progress and success feedback with true interaction state.
- **Reproduction:** submit a valid invented email and workspace name of at least six characters; observe the completion claim before **Finish setup**.
- **Reset/recovery:** **Back** returns to editing; **Finish setup** reaches the explicit local-simulation receipt. Close/Escape preserves the current step. Reset restarts the exercise.

## Verification boundary

These twelve defects are expected findings. Unexpected console errors, missing assets, accidental overflow, inaccessible facilitator controls, broken recovery, unlisted contrast failures, or interference with real VibeCheck overlays are regressions. A successful build does not establish visual quality or extension compatibility.

The current 31-check browser suite covers the deliberate faults alongside genuine comment creation, replies, resolve/reopen, pin reopening, menu Escape recovery, content save/apply, memory/native-storage isolation, both reset paths, and mobile containment. It recorded no external requests, POST submissions, or runtime errors. See `VERIFICATION.md` for the remaining installed-extension and accessibility limits.

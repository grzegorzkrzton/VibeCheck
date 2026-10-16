# VibeCheck landing-page direction

## Outcome

A credible, polished website that explains VibeCheck and gives participants realistic material to inspect. Twelve deliberate usability defects appear in the default experience; their answer key remains in the separate facilitator guide. Current release sources determine product claims.

## Composition and identity

Use a spacious centered hero, large dark Figtree typography, a pale textured background, pastel accents, soft cards, and original dimensional decoration. The current green VibeCheck mark and canonical palette anchor the identity. Give the product demonstration enough scale to explain feedback directly on a live prototype, and label illustrative content clearly.

Sequence: navigation, hero, product demonstration, current capabilities, short workflow, FAQ, final action, footer. Most controls work normally. Spread defects across the page, access walkthrough, and support interactions. Local forms simulate access and consent; they do not create accounts or working extension features. No invented testimonials, pricing, customer counts, or release promises.

## Observed references

Rendered Gradia inspection on 16 October 2026 showed a pale diagonal texture; centered 56px desktop and 36px narrow heading; pastel dimensional objects; generous hero spacing; and three-column pastel service cards. At approximately 1100px scroll a rounded floating navigation appeared; its measured inner height was 68px. Link hover feedback and a visible blue keyboard-focus treatment were observed. At 390px the header used a hamburger and actions stacked.

Browser Web Animations inspection reported navigation at 460ms with 200ms delay; hero at 400ms with 300ms delay and 64px vertical travel; other 400ms animations delayed 500ms; and some continuous 4500ms decorative rotations. These are measured reference observations, not adaptation values.

On User Inyerface, clicking the dominant green **NO** did not leave the landing page; **HERE** entered the game. The game split email entry and showed negative terms validation after an empty **Next** action. A cookie banner interrupted the task with negatively phrased choices. Cancellation opened a confirmation with a **Yes** link and **Cancel** button. At 390px the game overflowed horizontally and fixed help obscured the form. Adapt the misleading affordances, fragmented entry, negative wording, interruption, and ambiguous consequence mechanisms. Do not reproduce accidental overflow, obscured essential content, or keyboard traps.

## Proposed motion

Proposed adaptation values, not measured reference timings: 600ms entrance with 160ms stagger, 200ms hover/press feedback, 550ms reveal, and 6s decoration animation. Move decoration only; targets stay stable for feedback annotation. Disable decorative and entrance movement for `prefers-reduced-motion`, with equivalent functional keyboard and touch interactions.

## Implementation boundaries

Use normal inspectable DOM, scoped page styles, and local assets/fonts. Keep scripts and dependencies inside the landing folder where practical. Preserve the extension, existing sandbox, backend, authentication, release gates, shared tokens, mapped components, and generated sources.

The extension's active-tab injection supports a normal localhost HTTP route by configuration. Real toolbar access requires company authentication. Keep origin, port, and route stable: VibeCheck ignores query/hash when identifying prototype feedback.

## Defect inventory

Stable IDs VC-01 through VC-12 cover: unexpected primary-action destination; misleading link affordances; inconsistent labels; unclear support icon; one localized contrast failure; fragmented email; late workspace requirement; generic email validation; negative consent wording; deterministic interruption; ambiguous cancellation; premature completion.

[FACILITATOR.md](FACILITATOR.md) records every trigger, expected behavior, implemented fault, impact, learning objective, reproduction, and recovery. Facilitator tools expose only reset and overlay dismissal; no scoring or default answer key.

## Final implemented motion

600ms entrances use delays of 0, 160, 280, 400, and 480ms; reveals are 550ms; hover/press feedback 200ms; decoration 6s. These authored values were verified separately from the reference observations.

# App Foundry backend changelog

Short record of repository changes for the VibeCheck App Foundry migration.

## 2026-09-22 — P1: backend foundation

- Added the Express entry point under `backend/index.js`.
- Added App Foundry-compatible Node dependencies in `backend/package.json`.
- Added the non-secret runtime configuration template in `backend/.env.example`.
- Added the default Zendesk ingress policy in `.deploy/ingress.yaml`.
- Added `/healthz` and a protected JWT smoke-test endpoint at `/api/v1/auth/context`.
- Added request IDs, CORS configuration, structured errors, and `PORT || 8080` handling.
- No database or extension integration was changed in P1.

## 2026-09-22 — P2: database-backed API

- Added startup migration `schema_migrations` plus profiles, prototypes, comments, and content suggestions tables.
- Added App Foundry-authenticated `/api/v1/me` profile/onboarding endpoints.
- Added normalized-URL store load/save endpoints for comments, annotations, and content suggestions.
- Added parameterized SQL, transactions, payload limits, author-scoped writes, and revision conflict detection.
- Notifications remain an empty response until their event/mention rules are defined.
- The extension and existing Supabase integration were not changed in P2.
- Accepts both the standard `X-Pomerium-Jwt-Assertion` header and the AppFoundry guide’s `X-Pomerium-Jwt` name.

## 2026-09-23 — P2.1: JWT diagnostics and algorithm compatibility

- Added safe logging of JWT `alg`, `kid`, and verification error type; never logs the token.
- Allows the explicit asymmetric Pomerium algorithms `RS256` and `ES256`.

## 2026-09-23 — P3.2: extension authentication connection spike

- Added the AppFoundry backend host permission to the extension manifest.
- Added a service-worker API client using browser credentials; it never copies or sends JWT headers.
- Added AppFoundry auth status/error reporting to the extension popup.
- Restored the pinned extension icon as the toolbar toggle; account settings remain available from the context menu.
- Changed Account settings to open in a normal browser tab and constrained the page to a readable centered width.
- Added a token-based scrollbar style.
- Supabase storage remains temporarily untouched until the remote-store migration phase.

## 2026-09-23 — P3.3: AppFoundry profile and onboarding

- Added GET/PUT `/api/v1/me` calls to the extension service worker.
- Replaced the Supabase account form with AppFoundry login, profile, and onboarding states.
- Applied the supplied Figma component states using existing VibeCheck tokens and exported icons.
- Kept comments and remote store unchanged for P3.4.
- Adapted “Continue with Okta” to the working AppFoundry company-sign-in route.
- Added a protected browser handoff page so sign-in does not end on raw `/api/v1/me` JSON.
- Added a clear error when the settings HTML is opened directly as a local file.

## 2026-09-23 — P3.4: AppFoundry feedback store migration

- Added AppFoundry `/api/v1/store` load/save calls with revision support.
- Routed extension storage messages away from Supabase.
- Migrates existing local comments and suggestions once when the remote store is empty.
- Keeps local browser storage as a demo/cache fallback outside extension runtime.
- Removed the Supabase host permission and unused Supabase client/config.
- Rebuilt the toolbar bundle.
- Added a page-to-extension message bridge so the injected toolbar can reach the service worker and AppFoundry store.

## Verification

- `node --check backend/index.js`
- Static validation checks the backend entry point and migration SQL structure.
- Running the server requires the backend dependencies, App Foundry PostgreSQL variables, and JWT runtime configuration.

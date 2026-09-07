# Phase 6 — Supabase + Google Workspace SSO

Frontend comments already run on localStorage. This folder is the backend swap.

## 1. Create a Supabase project

1. New project in the Supabase dashboard
2. SQL editor → paste [`schema.sql`](schema.sql) → run
3. Authentication → Providers → Google → enable
4. Restrict sign-up to your company domain (or check the domain in the extension after login)

## 2. Google Cloud OAuth

Create a Web application OAuth client. Add authorized redirect URLs:

- `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
- `https://<EXTENSION_ID>.chromiumapp.org/`

The extension id is on `chrome://extensions` after you load unpacked (Developer mode).

## 3. Save config in the extension

Right-click the page → **VibeCheck account & inbox**, or open `extension/popup/index.html` via that menu. Paste:

- Supabase URL (`https://xxxx.supabase.co`)
- Anon key
- Allowed email domain (`yourcompany.com`)

Then **Sign in with Google**. Until this is set, VibeCheck stays in local mode.

## 4. Optional local JSON

Copy `extension/supabase.config.example.json` to `extension/supabase.config.json` (gitignored) if you prefer file-based defaults.

## Email (Phase 7)

Send from a Supabase Edge Function (Resend or Workspace SMTP) when a notification row is inserted. The extension inbox reads `notifications` for the signed-in user.

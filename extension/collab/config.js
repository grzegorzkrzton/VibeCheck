// Fill these in after you create a Supabase project (see README).
// The anon key is safe to ship in an internal extension; never put the service role key here.

export const COLLAB_CONFIG = {
  productName: 'Design Handoff',
  supabaseUrl: '',
  supabaseAnonKey: '',
  // Company Google Workspace domain without @, e.g. "acme.com".
  // Leave empty to allow any Google account (not recommended for production).
  allowedEmailDomain: '',
}

export function isSupabaseConfigured() {
  return Boolean(COLLAB_CONFIG.supabaseUrl && COLLAB_CONFIG.supabaseAnonKey)
}

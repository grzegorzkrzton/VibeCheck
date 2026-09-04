import { COLLAB_CONFIG, isSupabaseConfigured } from './config.js'

const SESSION_KEY = 'handoffSession'
const LOCAL_USER_KEY = 'handoffLocalUser'

function headers(accessToken) {
  return {
    apikey: COLLAB_CONFIG.supabaseAnonKey,
    Authorization: `Bearer ${accessToken || COLLAB_CONFIG.supabaseAnonKey}`,
    'Content-Type': 'application/json',
  }
}

export async function getSession() {
  const stored = await chrome.storage.local.get(SESSION_KEY)
  return stored[SESSION_KEY] || null
}

export async function setSession(session) {
  if (session)
    await chrome.storage.local.set({ [SESSION_KEY]: session })
  else
    await chrome.storage.local.remove(SESSION_KEY)
  return session
}

export async function getLocalUser() {
  const stored = await chrome.storage.local.get(LOCAL_USER_KEY)
  return stored[LOCAL_USER_KEY] || null
}

export async function ensureLocalUser(name = 'Local reviewer') {
  const existing = await getLocalUser()
  if (existing) return existing
  const user = {
    id: crypto.randomUUID(),
    email: 'local@handoff',
    display_name: name,
    avatar_url: null,
    local: true,
  }
  await chrome.storage.local.set({ [LOCAL_USER_KEY]: user })
  return user
}

export async function getActiveUser() {
  const session = await getFreshSession()
  if (session?.user) return session.user
  return getLocalUser()
}

export async function getFreshSession() {
  const session = await getSession()
  if (!session) return null
  if (!isSupabaseConfigured()) return session
  if (session.expires_at && session.expires_at * 1000 > Date.now() + 30_000)
    return session
  if (!session.refresh_token) return session
  try {
    return await refreshSession(session.refresh_token)
  }
  catch {
    await setSession(null)
    return null
  }
}

async function refreshSession(refreshToken) {
  const response = await fetch(`${COLLAB_CONFIG.supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!response.ok)
    throw new Error('Could not refresh session')
  const tokens = await response.json()
  return saveTokens(tokens)
}

export async function loginWithGoogle() {
  if (!isSupabaseConfigured())
    throw new Error('Supabase is not configured. Add your project URL and anon key in extension/collab/config.js.')

  const redirectUri = chrome.identity.getRedirectURL()
  const verifier = randomString(64)
  const challenge = await sha256Base64Url(verifier)
  const authorize = new URL(`${COLLAB_CONFIG.supabaseUrl}/auth/v1/authorize`)
  authorize.searchParams.set('provider', 'google')
  authorize.searchParams.set('redirect_to', redirectUri)
  authorize.searchParams.set('code_challenge', challenge)
  authorize.searchParams.set('code_challenge_method', 'S256')

  const responseUrl = await chrome.identity.launchWebAuthFlow({
    url: authorize.toString(),
    interactive: true,
  })

  if (!responseUrl)
    throw new Error('Google sign-in was cancelled.')

  const tokens = await exchangeRedirect(responseUrl, verifier)
  const session = await saveTokens(tokens)
  assertAllowedDomain(session.user?.email)
  return session
}

async function exchangeRedirect(responseUrl, verifier) {
  const parsed = parseAuthRedirect(responseUrl)

  if (parsed.access_token)
    return parsed

  if (parsed.code) {
    const response = await fetch(`${COLLAB_CONFIG.supabaseUrl}/auth/v1/token?grant_type=pkce`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        auth_code: parsed.code,
        code_verifier: verifier,
      }),
    })
    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`Could not exchange login code. ${detail}`)
    }
    return response.json()
  }

  throw new Error('Google sign-in did not return a token. Add the Chrome redirect URL in Supabase Auth settings.')
}

function parseAuthRedirect(responseUrl) {
  const url = new URL(responseUrl)
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''))
  const query = url.searchParams
  return {
    access_token: hash.get('access_token') || query.get('access_token'),
    refresh_token: hash.get('refresh_token') || query.get('refresh_token'),
    expires_in: hash.get('expires_in') || query.get('expires_in'),
    expires_at: hash.get('expires_at') || query.get('expires_at'),
    code: query.get('code') || hash.get('code'),
  }
}

async function saveTokens(tokens) {
  const access = tokens.access_token
  if (!access)
    throw new Error('No access token in auth response.')

  const user = await fetchUser(access)
  const session = {
    access_token: access,
    refresh_token: tokens.refresh_token,
    expires_at: Number(tokens.expires_at) || Math.floor(Date.now() / 1000) + Number(tokens.expires_in || 3600),
    user: {
      id: user.id,
      email: user.email,
      display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      local: false,
    },
  }
  await setSession(session)
  return session
}

async function fetchUser(accessToken) {
  const response = await fetch(`${COLLAB_CONFIG.supabaseUrl}/auth/v1/user`, {
    headers: headers(accessToken),
  })
  if (!response.ok)
    throw new Error('Could not load the signed-in user.')
  return response.json()
}

export function assertAllowedDomain(email) {
  const domain = COLLAB_CONFIG.allowedEmailDomain?.replace(/^@/, '').toLowerCase()
  if (!domain || !email) return
  const actual = email.split('@')[1]?.toLowerCase()
  if (actual !== domain) {
    setSession(null)
    throw new Error(`Only @${domain} Google accounts can use this internal tool.`)
  }
}

export async function logout() {
  const session = await getSession()
  if (session?.access_token && isSupabaseConfigured()) {
    try {
      await fetch(`${COLLAB_CONFIG.supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: headers(session.access_token),
      })
    }
    catch { /* ignore network errors on sign-out */ }
  }
  await setSession(null)
}

function randomString(length) {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, byte => ('0' + (byte % 36).toString(36)).slice(-1)).join('')
}

async function sha256Base64Url(value) {
  const data = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

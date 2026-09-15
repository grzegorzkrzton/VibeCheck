const platform = typeof browser === 'undefined' ? chrome : browser

const SESSION_KEY = 'vibecheck:session'
const CONFIG_KEY = 'vibecheck:supabase'

export async function getConfig() {
  const stored = await platform.storage.local.get(CONFIG_KEY)
  if (stored[CONFIG_KEY]?.url && stored[CONFIG_KEY]?.anonKey)
    return stored[CONFIG_KEY]

  try {
    const url = platform.runtime.getURL('supabase.config.json')
    const res = await fetch(url)
    if (!res.ok) return null
    return await res.json()
  }
  catch {
    return null
  }
}

export async function setConfig(config) {
  await platform.storage.local.set({ [CONFIG_KEY]: config })
}

export async function getSession() {
  const stored = await platform.storage.local.get(SESSION_KEY)
  return stored[SESSION_KEY] || null
}

export async function setSession(session) {
  if (session) await platform.storage.local.set({ [SESSION_KEY]: session })
  else await platform.storage.local.remove(SESSION_KEY)
}

function headers(config, accessToken) {
  const next = {
    apikey: config.anonKey,
    'Content-Type': 'application/json',
  }
  if (accessToken) next.Authorization = `Bearer ${accessToken}`
  return next
}

export async function rest(config, path, { method = 'GET', token, body, query = '' } = {}) {
  const res = await fetch(`${config.url.replace(/\/$/, '')}${path}${query}`, {
    method,
    headers: {
      ...headers(config, token),
      Prefer: method === 'POST' ? 'return=representation' : 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

export function domainAllowed(email, allowedDomain) {
  if (!allowedDomain) return true
  return String(email || '').toLowerCase().endsWith(`@${allowedDomain.toLowerCase()}`)
}

export async function signInWithGoogle() {
  const config = await getConfig()
  if (!config?.url || !config?.anonKey)
    throw new Error('Add your Supabase URL and anon key first.')

  const redirectUrl = platform.identity.getRedirectURL()
  const authUrl = `${config.url.replace(/\/$/, '')}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`

  const redirect = await platform.identity.launchWebAuthFlow({
    url: authUrl,
    interactive: true,
  })

  const parsed = new URL(redirect.replace('#', '?'))
  const access_token = parsed.searchParams.get('access_token')
  const refresh_token = parsed.searchParams.get('refresh_token')
  if (!access_token) throw new Error('Google sign-in did not return a token.')

  const user = await rest(config, '/auth/v1/user', { token: access_token })
  if (!domainAllowed(user.email, config.allowedDomain)) {
    await setSession(null)
    throw new Error(`That Google account is not on @${config.allowedDomain}`)
  }

  const session = {
    access_token,
    refresh_token,
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email,
      avatar: user.user_metadata?.avatar_url || '',
    },
  }
  await setSession(session)

  await rest(config, '/rest/v1/profiles', {
    method: 'POST',
    token: access_token,
    body: {
      id: user.id,
      email: user.email,
      name: session.user.name,
      avatar_url: session.user.avatar,
    },
  }).catch(() => {})

  return session
}

export async function signOut() {
  await setSession(null)
}

function mapComment(row) {
  return {
    id: row.id,
    type: row.type,
    kind: row.kind,
    body: row.body,
    resolved: row.resolved,
    parentId: row.parent_id,
    parentSuggestionId: row.parent_suggestion_id,
    readAt: row.read_at,
    anchor: row.anchor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author_name,
  }
}

function mapSuggestion(row) {
  return {
    id: row.id,
    originalText: row.original_text,
    suggestedText: row.suggested_text,
    rationale: row.rationale,
    status: row.status,
    resolved: row.resolved,
    readAt: row.read_at,
    anchor: row.anchor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author_name,
  }
}

async function prototypeId(config, token, url, userId) {
  const existing = await rest(config, '/rest/v1/prototypes', {
    token,
    query: `?url=eq.${encodeURIComponent(url)}&select=id`,
  })
  if (existing?.[0]?.id) return existing[0].id
  const created = await rest(config, '/rest/v1/prototypes', {
    method: 'POST',
    token,
    body: { url, owner_id: userId, title: url },
  })
  return created?.[0]?.id
}

export async function loadRemoteStore(url) {
  const config = await getConfig()
  const session = await getSession()
  if (!config?.url || !session?.access_token) return null

  const prototype_id = await prototypeId(config, session.access_token, url, session.user.id)
  const [comments, suggestions, notifications] = await Promise.all([
    rest(config, '/rest/v1/comments', {
      token: session.access_token,
      query: `?prototype_id=eq.${prototype_id}&select=*`,
    }),
    rest(config, '/rest/v1/content_suggestions', {
      token: session.access_token,
      query: `?prototype_id=eq.${prototype_id}&select=*`,
    }),
    rest(config, '/rest/v1/notifications', {
      token: session.access_token,
      query: `?user_id=eq.${session.user.id}&select=*&order=created_at.desc`,
    }),
  ])

  return {
    source: 'remote',
    prototypeId: prototype_id,
    comments: (comments || []).map(mapComment),
    suggestions: (suggestions || []).map(mapSuggestion),
    notifications: (notifications || []).map(row => ({
      id: row.id,
      type: row.type,
      body: row.payload?.body,
      context: row.payload?.context,
      mention: row.payload?.mention,
      createdAt: row.created_at,
      readAt: row.read_at,
    })),
  }
}

export async function saveRemoteStore(url, state) {
  const config = await getConfig()
  const session = await getSession()
  if (!config?.url || !session?.access_token) return null

  const prototype_id = await prototypeId(config, session.access_token, url, session.user.id)
  const token = session.access_token

  for (const comment of state.comments || []) {
    await rest(config, '/rest/v1/comments', {
      method: 'POST',
      token,
      body: {
        id: comment.id,
        prototype_id,
        author_id: session.user.id,
        author_name: comment.authorName,
        body: comment.body || '',
        type: comment.type || 'note',
        kind: comment.kind,
        resolved: Boolean(comment.resolved),
        parent_id: comment.parentId,
        parent_suggestion_id: comment.parentSuggestionId,
        read_at: comment.readAt,
        anchor: comment.anchor || {},
      },
    }).catch(() => rest(config, '/rest/v1/comments', {
      method: 'PATCH',
      token,
      query: `?id=eq.${comment.id}`,
      body: {
        body: comment.body || '',
        type: comment.type || 'note',
        kind: comment.kind,
        resolved: Boolean(comment.resolved),
        parent_id: comment.parentId,
        parent_suggestion_id: comment.parentSuggestionId,
        read_at: comment.readAt,
        anchor: comment.anchor || {},
        updated_at: new Date().toISOString(),
      },
    }))
  }

  for (const suggestion of state.suggestions || []) {
    await rest(config, '/rest/v1/content_suggestions', {
      method: 'POST',
      token,
      body: {
        id: suggestion.id,
        prototype_id,
        author_id: session.user.id,
        author_name: suggestion.authorName,
        original_text: suggestion.originalText,
        suggested_text: suggestion.suggestedText,
        rationale: suggestion.rationale,
        status: suggestion.status || 'pending',
        resolved: Boolean(suggestion.resolved),
        read_at: suggestion.readAt,
        anchor: suggestion.anchor || {},
      },
    }).catch(() => rest(config, '/rest/v1/content_suggestions', {
      method: 'PATCH',
      token,
      query: `?id=eq.${suggestion.id}`,
      body: {
        suggested_text: suggestion.suggestedText,
        rationale: suggestion.rationale,
        status: suggestion.status,
        resolved: Boolean(suggestion.resolved),
        read_at: suggestion.readAt,
        updated_at: new Date().toISOString(),
      },
    }))
  }

  return { ok: true, source: 'remote' }
}

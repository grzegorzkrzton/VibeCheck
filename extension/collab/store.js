import { COLLAB_CONFIG, isSupabaseConfigured } from './config.js'
import { ensureLocalUser, getActiveUser, getFreshSession } from './auth.js'

const LOCAL_DB = 'handoffDb'

const emptyDb = () => ({
  prototypes: [],
  comments: [],
  annotations: [],
  suggestions: [],
  notifications: [],
  profiles: [],
})

async function readDb() {
  const stored = await chrome.storage.local.get(LOCAL_DB)
  return stored[LOCAL_DB] || emptyDb()
}

async function writeDb(db) {
  await chrome.storage.local.set({ [LOCAL_DB]: db })
  return db
}

const TABLE_MAP = {
  comments: 'comments',
  annotations: 'annotations',
  suggestions: 'content_suggestions',
  notifications: 'notifications',
  prototypes: 'prototypes',
  profiles: 'profiles',
  prototype_members: 'prototype_members',
}

function restHeaders(accessToken, extra = {}) {
  return {
    apikey: COLLAB_CONFIG.supabaseAnonKey,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
    ...extra,
  }
}

async function supabaseFetch(path, { method = 'GET', body, query, prefer } = {}) {
  const session = await getFreshSession()
  if (!session?.access_token)
    throw new Error('Sign in with Google to sync review data.')

  const url = new URL(`${COLLAB_CONFIG.supabaseUrl}/rest/v1/${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query))
      url.searchParams.set(key, value)
  }

  const response = await fetch(url.toString(), {
    method,
    headers: restHeaders(session.access_token, prefer ? { Prefer: prefer } : {}),
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `Supabase request failed (${response.status})`)
  }

  const text = await response.text()
  return text ? JSON.parse(text) : null
}

async function requireUser() {
  const user = await getActiveUser()
  if (!user)
    throw new Error('Sign in (or continue locally) before saving review notes.')
  return user
}

export async function ensureProfile() {
  const user = await requireUser()
  if (!isSupabaseConfigured() || user.local) {
    const db = await readDb()
    if (!db.profiles.some(profile => profile.id === user.id)) {
      db.profiles.push({
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
      })
      await writeDb(db)
    }
    return user
  }

  await supabaseFetch('profiles', {
    method: 'POST',
    body: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
    },
    query: { on_conflict: 'id' },
    prefer: 'return=representation,resolution=merge-duplicates',
  }).catch(() => null)

  return user
}

export async function ensurePrototype({ url, title }) {
  const user = await ensureProfile()

  if (!isSupabaseConfigured() || user.local) {
    const db = await readDb()
    let prototype = db.prototypes.find(item => item.url === url)
    if (!prototype) {
      prototype = {
        id: crypto.randomUUID(),
        url,
        title: title || url,
        owner_id: user.id,
        owner_email: user.email,
        owner_name: user.display_name,
        created_at: new Date().toISOString(),
      }
      db.prototypes.push(prototype)
      await writeDb(db)
    }
    return { prototype, user, isOwner: prototype.owner_id === user.id }
  }

  const existing = await supabaseFetch('prototypes', {
    query: { url: `eq.${url}`, select: '*' },
  })
  let prototype = existing?.[0]
  if (!prototype) {
    const created = await supabaseFetch('prototypes', {
      method: 'POST',
      body: {
        url,
        title: title || url,
        owner_id: user.id,
        owner_email: user.email,
        owner_name: user.display_name,
      },
    })
    prototype = created[0]
  }

  await supabaseFetch('prototype_members', {
    method: 'POST',
    body: {
      prototype_id: prototype.id,
      user_id: user.id,
      role: prototype.owner_id === user.id ? 'owner' : 'reviewer',
    },
  }).catch(() => null)

  return { prototype, user, isOwner: prototype.owner_id === user.id }
}

export async function listByPrototype(table, prototypeId) {
  const user = await getActiveUser()
  if (!isSupabaseConfigured() || user?.local) {
    const db = await readDb()
    return (db[table] || [])
      .filter(item => item.prototype_id === prototypeId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }
  return supabaseFetch(TABLE_MAP[table] || table, {
    query: {
      prototype_id: `eq.${prototypeId}`,
      select: '*',
      order: 'created_at.asc',
    },
  })
}

export async function insertRow(table, row) {
  const user = await requireUser()
  const record = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    author_id: user.id,
    author_email: user.email,
    author_name: user.display_name,
    ...row,
  }

  if (!isSupabaseConfigured() || user.local) {
    const db = await readDb()
    db[table].push(record)
    await writeDb(db)
    return record
  }

  const created = await supabaseFetch(TABLE_MAP[table] || table, { method: 'POST', body: record })
  return created[0]
}

export async function updateRow(table, id, patch) {
  const user = await requireUser()
  if (!isSupabaseConfigured() || user.local) {
    const db = await readDb()
    const item = db[table].find(row => row.id === id)
    if (!item) throw new Error('Item not found')
    Object.assign(item, patch, { updated_at: new Date().toISOString() })
    await writeDb(db)
    return item
  }
  const updated = await supabaseFetch(TABLE_MAP[table] || table, {
    method: 'PATCH',
    body: patch,
    query: { id: `eq.${id}` },
  })
  return updated[0]
}

export async function deleteRow(table, id) {
  const user = await requireUser()
  if (!isSupabaseConfigured() || user.local) {
    const db = await readDb()
    db[table] = db[table].filter(row => row.id !== id)
    await writeDb(db)
    return { id }
  }
  await supabaseFetch(TABLE_MAP[table] || table, {
    method: 'DELETE',
    query: { id: `eq.${id}` },
  })
  return { id }
}

export async function listNotifications() {
  const user = await requireUser()
  if (!isSupabaseConfigured() || user.local) {
    const db = await readDb()
    return db.notifications
      .filter(item => item.user_id === user.id)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }
  return supabaseFetch('notifications', {
    query: {
      user_id: `eq.${user.id}`,
      select: '*',
      order: 'created_at.desc',
    },
  })
}

export async function createNotification({ user_id, type, payload }) {
  const actor = await getActiveUser()
  const record = {
    id: crypto.randomUUID(),
    user_id,
    type,
    payload,
    read_at: null,
    created_at: new Date().toISOString(),
  }

  if (!isSupabaseConfigured() || actor?.local) {
    const db = await readDb()
    db.notifications.unshift(record)
    await writeDb(db)
    return record
  }

  const created = await supabaseFetch('notifications', { method: 'POST', body: record })
  return created[0]
}

export async function markNotificationRead(id) {
  return updateRow('notifications', id, { read_at: new Date().toISOString() })
}

export async function searchProfiles(query) {
  const needle = (query || '').toLowerCase()
  const user = await getActiveUser()
  if (!isSupabaseConfigured() || user?.local) {
    const db = await readDb()
    const people = db.profiles.length ? db.profiles : (user ? [user] : [])
    if (!needle) return people.slice(0, 8)
    return people.filter(profile =>
      profile.email?.toLowerCase().includes(needle)
      || profile.display_name?.toLowerCase().includes(needle))
  }
  return supabaseFetch('profiles', {
    query: {
      or: `email.ilike.%${needle}%,display_name.ilike.%${needle}%`,
      select: 'id,email,display_name,avatar_url',
      limit: '8',
    },
  })
}

export async function notifyMentions({ mentions, prototype, actor, type, payload }) {
  if (!mentions?.length) return
  const people = await searchProfiles('')
  for (const mention of mentions) {
    const match = people.find(profile =>
      profile.email?.toLowerCase() === mention
      || profile.display_name?.toLowerCase() === mention
      || profile.email?.split('@')[0]?.toLowerCase() === mention)
    if (match && match.id !== actor.id) {
      await createNotification({
        user_id: match.id,
        type,
        payload: { ...payload, prototype_url: prototype.url },
      })
    }
  }
}

export async function invokeEmail(payload) {
  if (!isSupabaseConfigured()) return { skipped: true }
  const session = await getFreshSession()
  if (!session?.access_token) return { skipped: true }
  const response = await fetch(`${COLLAB_CONFIG.supabaseUrl}/functions/v1/notify-email`, {
    method: 'POST',
    headers: {
      apikey: COLLAB_CONFIG.supabaseAnonKey,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok)
    return { ok: false, error: await response.text() }
  return { ok: true }
}

export { ensureLocalUser }

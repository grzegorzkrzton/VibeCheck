import { COLLAB_CONFIG, isSupabaseConfigured } from './config.js'
import {
  ensureLocalUser,
  getActiveUser,
  getFreshSession,
  loginWithGoogle,
  logout,
} from './auth.js'
import {
  createNotification,
  deleteRow,
  ensurePrototype,
  insertRow,
  invokeEmail,
  listByPrototype,
  listNotifications,
  markNotificationRead,
  notifyMentions,
  searchProfiles,
  updateRow,
} from './store.js'

const handlers = {
  async HANDOFF_AUTH_STATUS() {
    const user = await getActiveUser()
    const session = await getFreshSession()
    const notifications = user ? await listNotifications().catch(() => []) : []
    return {
      ok: true,
      configured: isSupabaseConfigured(),
      productName: COLLAB_CONFIG.productName,
      allowedEmailDomain: COLLAB_CONFIG.allowedEmailDomain,
      user,
      signedIn: Boolean(session || user),
      unread: notifications.filter(item => !item.read_at).length,
    }
  },

  async HANDOFF_AUTH_LOGIN() {
    const session = await loginWithGoogle()
    await ensurePrototypeSafe()
    return { ok: true, user: session.user }
  },

  async HANDOFF_AUTH_LOCAL({ name } = {}) {
    const user = await ensureLocalUser(name)
    return { ok: true, user }
  },

  async HANDOFF_AUTH_LOGOUT() {
    await logout()
    return { ok: true }
  },

  async HANDOFF_ENSURE_PROTOTYPE(payload, sender) {
    const url = payload?.url || sender?.tab?.url
    const title = payload?.title || sender?.tab?.title
    const result = await ensurePrototype({ url, title })
    return { ok: true, ...result }
  },

  async HANDOFF_COMMENTS_LIST(payload, sender) {
    const { prototype } = await proto(payload, sender)
    const comments = await listByPrototype('comments', prototype.id)
    return { ok: true, prototype, comments }
  },

  async HANDOFF_COMMENTS_CREATE(payload, sender) {
    const { prototype, user } = await proto(payload, sender)
    const comment = await insertRow('comments', {
      prototype_id: prototype.id,
      parent_id: payload.parent_id || null,
      body: payload.body,
      mentions: payload.mentions || [],
      anchor: payload.anchor,
      resolved: false,
    })
    await notifyMentions({
      mentions: payload.mentions,
      prototype,
      actor: user,
      type: 'mention',
      payload: { comment_id: comment.id, body: comment.body },
    })
    return { ok: true, comment }
  },

  async HANDOFF_COMMENTS_UPDATE(payload) {
    const comment = await updateRow('comments', payload.id, payload.patch)
    return { ok: true, comment }
  },

  async HANDOFF_ANNOTATIONS_LIST(payload, sender) {
    const { prototype } = await proto(payload, sender)
    const annotations = await listByPrototype('annotations', prototype.id)
    return { ok: true, prototype, annotations }
  },

  async HANDOFF_ANNOTATIONS_CREATE(payload, sender) {
    const { prototype } = await proto(payload, sender)
    const annotation = await insertRow('annotations', {
      prototype_id: prototype.id,
      body: payload.body,
      kind: payload.kind || 'implement',
      anchor: payload.anchor,
    })
    return { ok: true, annotation }
  },

  async HANDOFF_ANNOTATIONS_DELETE(payload) {
    await deleteRow('annotations', payload.id)
    return { ok: true }
  },

  async HANDOFF_SUGGESTIONS_LIST(payload, sender) {
    const { prototype, isOwner } = await proto(payload, sender)
    const suggestions = await listByPrototype('suggestions', prototype.id)
    return { ok: true, prototype, suggestions, isOwner }
  },

  async HANDOFF_SUGGESTIONS_CREATE(payload, sender) {
    const { prototype, user } = await proto(payload, sender)
    const suggestion = await insertRow('suggestions', {
      prototype_id: prototype.id,
      original_text: payload.original_text,
      suggested_text: payload.suggested_text,
      rationale: payload.rationale || '',
      status: 'pending',
      anchor: payload.anchor,
    })

    if (prototype.owner_id && prototype.owner_id !== user.id) {
      await createNotification({
        user_id: prototype.owner_id,
        type: 'content_suggestion',
        payload: {
          suggestion_id: suggestion.id,
          prototype_url: prototype.url,
          suggested_text: suggestion.suggested_text,
          original_text: suggestion.original_text,
          author_name: user.display_name,
        },
      })
      await invokeEmail({
        to: prototype.owner_email,
        subject: `Copy suggestion on ${prototype.title || prototype.url}`,
        text: `${user.display_name} suggested replacing “${suggestion.original_text}” with “${suggestion.suggested_text}” on ${prototype.url}`,
      })
    }

    return { ok: true, suggestion }
  },

  async HANDOFF_SUGGESTIONS_REVIEW(payload, sender) {
    const { user, isOwner } = await proto(payload, sender)
    if (!isOwner)
      throw new Error('Only the prototype owner can approve or reject copy suggestions.')
    const suggestion = await updateRow('suggestions', payload.id, {
      status: payload.status,
      reviewer_id: user.id,
      reviewed_at: new Date().toISOString(),
    })
    return { ok: true, suggestion }
  },

  async HANDOFF_NOTIFICATIONS_LIST() {
    const notifications = await listNotifications()
    return { ok: true, notifications }
  },

  async HANDOFF_NOTIFICATIONS_READ(payload) {
    const notification = await markNotificationRead(payload.id)
    return { ok: true, notification }
  },

  async HANDOFF_PROFILES_SEARCH(payload) {
    const profiles = await searchProfiles(payload?.query)
    return { ok: true, profiles }
  },
}

async function proto(payload, sender) {
  const url = payload?.url || sender?.tab?.url
  const title = payload?.title || sender?.tab?.title
  return ensurePrototype({ url, title })
}

async function ensurePrototypeSafe() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.url) await ensurePrototype({ url: tab.url, title: tab.title })
  }
  catch { /* popup login does not require a prototype yet */ }
}

export async function handleCollabMessage(message, sender) {
  const handler = handlers[message.type]
  if (!handler)
    return { ok: false, error: `Unknown message ${message.type}` }
  try {
    return await handler(message.payload || {}, sender)
  }
  catch (error) {
    return { ok: false, error: error.message || String(error) }
  }
}

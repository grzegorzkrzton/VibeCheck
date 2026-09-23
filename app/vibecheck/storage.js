import { normalizePrototypeUrl } from './url.js'

export const STORE_VERSION = 2
const STORE_PREFIX = 'vibecheck:store:'
const AUTHOR_KEY = 'vibecheck:authorName'
const CHANNEL = 'vibecheck-store'
const BRIDGE_MARKER = 'data-vibecheck-extension'
const BRIDGE_REQUEST_SOURCE = 'vibecheck-page'
const BRIDGE_RESPONSE_SOURCE = 'vibecheck-extension'
const BRIDGE_REQUEST_TYPE = 'vibecheck-store-request'
const BRIDGE_RESPONSE_TYPE = 'vibecheck-store-response'
let bridgeRequestNumber = 0

export function createEmptyState() {
  return {
    version: STORE_VERSION,
    comments: [],
    suggestions: [],
    notifications: [],
  }
}

export function migrateStore(input = {}) {
  const state = {
    ...createEmptyState(),
    ...input,
    comments: Array.isArray(input.comments) ? input.comments : [],
    suggestions: Array.isArray(input.suggestions) ? input.suggestions : [],
    notifications: Array.isArray(input.notifications) ? input.notifications : [],
  }
  return {
    ...state,
    version: STORE_VERSION,
    comments: state.comments.map(comment => ({
      ...comment,
      parentSuggestionId: comment.parentSuggestionId || null,
      resolved: Boolean(comment.resolved),
    })),
    suggestions: state.suggestions.map(suggestion => {
      if (suggestion.status === 'approved') {
        return { ...suggestion, status: 'applied', resolved: true }
      }
      if (suggestion.status === 'rejected') {
        return { ...suggestion, status: 'pending', resolved: true }
      }
      return {
        ...suggestion,
        status: suggestion.status === 'applied' ? 'applied' : 'pending',
        resolved: Boolean(suggestion.resolved),
      }
    }),
  }
}

export function storeKey(url = location.href) {
  return STORE_PREFIX + normalizePrototypeUrl(url)
}

export function uid() {
  return globalThis.crypto?.randomUUID?.()
    || `vc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function getAuthorName() {
  try {
    return localStorage.getItem(AUTHOR_KEY) || 'You'
  }
  catch {
    return 'You'
  }
}

export function setAuthorName(name) {
  const next = (name || '').trim() || 'You'
  try {
    localStorage.setItem(AUTHOR_KEY, next)
  }
  catch { /* quota / private mode */ }
  return next
}

function readLocal(url) {
  try {
    const raw = localStorage.getItem(storeKey(url))
    if (!raw) return createEmptyState()
    const parsed = JSON.parse(raw)
    return migrateStore(parsed)
  }
  catch {
    return createEmptyState()
  }
}

function writeLocal(state, url) {
  try {
    localStorage.setItem(storeKey(url), JSON.stringify({
      ...state,
      version: STORE_VERSION,
      updatedAt: new Date().toISOString(),
    }))
    mirrorToExtension(state, url)
    return true
  }
  catch {
    return false
  }
}

function mirrorToExtension(state, url) {
  if (typeof chrome === 'undefined' || !chrome.storage?.local) return
  const key = 'vibecheck:mirror'
  chrome.storage.local.get(key, data => {
    const current = data[key] || {}
    current[normalizePrototypeUrl(url)] = {
      notifications: state.notifications || [],
      commentCount: (state.comments || []).filter(item => !item.parentId && !item.parentSuggestionId).length,
      suggestionCount: (state.suggestions || []).length,
      updatedAt: new Date().toISOString(),
    }
    chrome.storage.local.set({ [key]: current })
  })
}

function extensionRuntimeAvailable() {
  return typeof chrome !== 'undefined' && Boolean(chrome.runtime?.sendMessage)
}

function extensionBridgeAvailable() {
  return typeof window !== 'undefined'
    && typeof window.postMessage === 'function'
    && document?.documentElement?.hasAttribute(BRIDGE_MARKER)
}

function requestError(response) {
  const error = new Error(
    response?.error || 'The AppFoundry store request could not be completed.',
  )
  error.code = response?.code || 'APP_FOUNDRY_REQUEST_FAILED'
  return error
}

function bridgeCall(method, payload) {
  const id = `vibecheck-${Date.now()}-${bridgeRequestNumber++}`

  return new Promise((resolve, reject) => {
    let timeout
    const onMessage = event => {
      const response = event.data
      if (event.source !== window
        || response?.source !== BRIDGE_RESPONSE_SOURCE
        || response.type !== BRIDGE_RESPONSE_TYPE
        || response.id !== id) return

      window.removeEventListener('message', onMessage)
      clearTimeout(timeout)
      if (response.ok) resolve(response.data)
      else reject(requestError(response))
    }

    window.addEventListener('message', onMessage)
    timeout = setTimeout(() => {
      window.removeEventListener('message', onMessage)
      const error = new Error('The extension storage bridge timed out.')
      error.code = 'EXTENSION_BRIDGE_TIMEOUT'
      reject(error)
    }, 10000)

    window.postMessage({
      source: BRIDGE_REQUEST_SOURCE,
      type: BRIDGE_REQUEST_TYPE,
      id,
      method,
      payload,
    }, '*')
  })
}

async function remoteCall(method, payload = {}) {
  const request = {
    ...payload,
    url: payload.url || normalizePrototypeUrl(),
  }

  if (extensionRuntimeAvailable()) {
    const response = await chrome.runtime.sendMessage({
      channel: CHANNEL,
      method,
      payload: request,
    })
    if (response?.ok) return response.data
    throw requestError(response)
  }

  if (extensionBridgeAvailable())
    return bridgeCall(method, request)

  return null
}

export async function loadStore(url = location.href) {
  const local = readLocal(url)
  const remote = await remoteCall('load', { url })
  if (!remote) return { ...local, source: 'local' }

  const remoteState = { ...migrateStore(remote), source: 'remote' }
  if (remoteState.prototypeId === null && remoteState.revision === 0 && hasFeedback(local)) {
    const migrated = await remoteCall('save', {
      url,
      state: { ...local, revision: remoteState.revision },
    })
    return { ...migrateStore(migrated), source: 'remote' }
  }

  return remoteState
}

export async function saveStore(state, url = location.href) {
  const local = writeLocal(state, url)
  const remote = await remoteCall('save', { url, state })
  if (!remote) return { ok: local, source: 'local' }
  return { ok: true, source: 'remote', revision: remote.revision }
}

function hasFeedback(state) {
  return Boolean(state?.comments?.length || state?.suggestions?.length)
}

export async function upsertComment(comment, url) {
  const state = await loadStore(url)
  const next = { ...comment, updatedAt: new Date().toISOString() }
  const index = state.comments.findIndex(item => item.id === comment.id)
  if (index >= 0) state.comments[index] = { ...state.comments[index], ...next }
  else state.comments.push(next)
  await saveStore(state, url)
  return next
}

export async function removeComment(id, url) {
  const state = await loadStore(url)
  state.comments = state.comments.filter(item => item.id !== id && item.parentId !== id)
  await saveStore(state, url)
}

export async function upsertSuggestion(suggestion, url) {
  const state = await loadStore(url)
  const next = { ...suggestion, updatedAt: new Date().toISOString() }
  const index = state.suggestions.findIndex(item => item.id === suggestion.id)
  if (index >= 0) state.suggestions[index] = { ...state.suggestions[index], ...next }
  else state.suggestions.push(next)
  await saveStore(state, url)
  return next
}

export async function removeSuggestion(id, url) {
  const state = await loadStore(url)
  state.suggestions = state.suggestions.filter(item => item.id !== id)
  state.comments = state.comments.filter(item => item.parentSuggestionId !== id)
  await saveStore(state, url)
}

export async function addNotification(notification, url) {
  const state = await loadStore(url)
  state.notifications.unshift({
    id: uid(),
    readAt: null,
    createdAt: new Date().toISOString(),
    ...notification,
  })
  await saveStore(state, url)
}

export async function markNotificationsRead(url) {
  const state = await loadStore(url)
  const now = new Date().toISOString()
  state.notifications = state.notifications.map(item => ({
    ...item,
    readAt: item.readAt || now,
  }))
  await saveStore(state, url)
}

export function parseMentions(body = '') {
  const found = body.match(/@([^\s]+)/g) || []
  return [...new Set(found.map(token => token.slice(1)))]
}

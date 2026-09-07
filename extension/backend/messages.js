import {
  getConfig,
  getSession,
  loadRemoteStore,
  saveRemoteStore,
  setConfig,
  signInWithGoogle,
  signOut,
} from './supabase.js'

const CHANNEL = 'vibecheck-store'
const platform = typeof browser === 'undefined' ? chrome : browser

platform.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.channel !== CHANNEL) return

  handle(message)
    .then(data => sendResponse({ ok: true, data }))
    .catch(error => sendResponse({ ok: false, error: error.message }))

  return true
})

async function handle({ method, payload = {} }) {
  if (method === 'status') {
    return {
      config: await getConfig(),
      session: await getSession(),
    }
  }

  if (method === 'setConfig') {
    await setConfig(payload)
    return { ok: true }
  }

  if (method === 'signIn')
    return signInWithGoogle()

  if (method === 'signOut') {
    await signOut()
    return { ok: true }
  }

  if (method === 'load')
    return loadRemoteStore(payload.url)

  if (method === 'save')
    return saveRemoteStore(payload.url, payload.state)

  if (method === 'inbox') {
    const mirror = (await platform.storage.local.get('vibecheck:mirror'))['vibecheck:mirror'] || {}
    const notifications = Object.entries(mirror).flatMap(([url, entry]) =>
      (entry.notifications || []).map(item => ({ ...item, url })))
    notifications.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    return { notifications, session: await getSession(), config: await getConfig() }
  }

  throw new Error(`Unknown method ${method}`)
}

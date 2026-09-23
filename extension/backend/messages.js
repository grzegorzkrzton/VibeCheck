import {
  getAuthContext,
  getProfile,
  loadStore,
  saveStore,
  updateProfile,
} from './app-foundry.js'

const CHANNEL = 'vibecheck-store'
const platform = typeof browser === 'undefined' ? chrome : browser

platform.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.channel !== CHANNEL) return

  handle(message)
    .then(data => sendResponse({ ok: true, data }))
    .catch(error => sendResponse({
      ok: false,
      error: error.message,
      code: error.code || 'EXTENSION_REQUEST_FAILED',
    }))

  return true
})

async function handle({ method, payload = {} }) {
  if (method === 'status') {
    const auth = await readAppFoundryAuth()
    return {
      appFoundry: auth.context,
      appFoundryError: auth.error,
    }
  }

  if (method === 'profile')
    return getProfile()

  if (method === 'updateProfile')
    return updateProfile({
      firstName: payload.firstName,
      lastName: payload.lastName,
    })

  if (method === 'load')
    return loadStore(payload.url)

  if (method === 'save')
    return saveStore(payload.url, payload.state)

  if (method === 'inbox') {
    const mirror = (await platform.storage.local.get('vibecheck:mirror'))['vibecheck:mirror'] || {}
    const notifications = Object.entries(mirror).flatMap(([url, entry]) =>
      (entry.notifications || []).map(item => ({ ...item, url })))
    notifications.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    return { notifications }
  }

  throw new Error(`Unknown method ${method}`)
}

async function readAppFoundryAuth() {
  try {
    return {
      context: await getAuthContext(),
      error: null,
    }
  }
  catch (error) {
    return {
      context: null,
      error: {
        code: error.code || 'APP_FOUNDRY_UNAVAILABLE',
        message: error.message || 'Could not connect to AppFoundry.',
      },
    }
  }
}

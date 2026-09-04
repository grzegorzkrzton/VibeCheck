import { loginWithGoogle, logout } from '../collab/auth.js'

const statusEl = document.getElementById('status')
const inboxEl = document.getElementById('inbox')
const unreadEl = document.getElementById('unread')
const hintEl = document.getElementById('config-hint')
const googleBtn = document.getElementById('google')
const localBtn = document.getElementById('local')
const logoutBtn = document.getElementById('logout')
const toggleBtn = document.getElementById('toggle')

async function send(type, payload = {}) {
  return chrome.runtime.sendMessage({ type, payload })
}

async function refresh() {
  const status = await send('HANDOFF_AUTH_STATUS')
  if (!status?.ok) {
    statusEl.textContent = status?.error || 'Could not read sign-in state.'
    return
  }

  if (status.user) {
    statusEl.textContent = status.user.local
      ? `Local reviewer: ${status.user.display_name}. Data stays on this browser until you add SSO.`
      : `Signed in as ${status.user.display_name} (${status.user.email})`
    googleBtn.classList.add('hidden')
    localBtn.classList.add('hidden')
    logoutBtn.classList.remove('hidden')
  }
  else {
    statusEl.textContent = status.configured
      ? `Sign in with your @${status.allowedEmailDomain || 'company'} Google account.`
      : 'Supabase SSO is not configured yet. You can still continue locally to test comments.'
    googleBtn.classList.toggle('hidden', !status.configured)
    localBtn.classList.remove('hidden')
    logoutBtn.classList.add('hidden')
  }

  hintEl.textContent = status.configured
    ? 'Alt+Shift+D toggles the on-page tools. Use Sign in with Google to see shared comments.'
    : 'To enable Google Workspace SSO: create a Supabase project, paste URL + anon key into extension/collab/config.js, then reload the extension.'

  const inbox = status.user ? await send('HANDOFF_NOTIFICATIONS_LIST') : { notifications: [] }
  renderInbox(inbox.notifications || [], status.unread || 0)
}

function renderInbox(items, unread) {
  unreadEl.textContent = String(unread)
  unreadEl.classList.toggle('hidden', !unread)

  if (!items.length) {
    inboxEl.innerHTML = '<li class="empty">No notifications yet.</li>'
    return
  }

  inboxEl.innerHTML = items.map(item => `
    <li>
      <strong>${labelFor(item.type)}</strong>
      <div>${item.payload?.suggested_text || item.payload?.body || item.payload?.prototype_url || ''}</div>
      ${item.payload?.prototype_url ? `<button class="link" data-open="${item.payload.prototype_url}" data-id="${item.id}">Open prototype</button>` : ''}
    </li>
  `).join('')
}

function labelFor(type) {
  if (type === 'content_suggestion') return 'Copy suggestion'
  if (type === 'mention') return 'You were mentioned'
  return type
}

googleBtn.addEventListener('click', async () => {
  googleBtn.disabled = true
  try {
    await loginWithGoogle()
    await refresh()
  }
  catch (error) {
    statusEl.textContent = error.message
  }
  finally {
    googleBtn.disabled = false
  }
})

localBtn.addEventListener('click', async () => {
  await send('HANDOFF_AUTH_LOCAL', { name: 'Local reviewer' })
  await refresh()
})

logoutBtn.addEventListener('click', async () => {
  await logout()
  await send('HANDOFF_AUTH_LOGOUT')
  await refresh()
})

toggleBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab?.id)
    await chrome.runtime.sendMessage({ type: 'HANDOFF_TOGGLE_TAB', payload: { tab } })
  window.close()
})

inboxEl.addEventListener('click', async event => {
  const button = event.target.closest('[data-open]')
  if (!button) return
  await send('HANDOFF_NOTIFICATIONS_READ', { id: button.dataset.id })
  await chrome.tabs.create({ url: button.dataset.open })
})

refresh()

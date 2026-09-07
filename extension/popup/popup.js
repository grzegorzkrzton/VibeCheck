const CHANNEL = 'vibecheck-store'

async function call(method, payload) {
  return chrome.runtime.sendMessage({ channel: CHANNEL, method, payload })
}

function $(id) {
  return document.getElementById(id)
}

async function refresh() {
  const status = await call('status')
  const inbox = await call('inbox')
  const config = status?.data?.config || inbox?.data?.config
  const session = status?.data?.session || inbox?.data?.session

  $('url').value = config?.url || ''
  $('anon').value = config?.anonKey || ''
  $('domain').value = config?.allowedDomain || ''

  const storedAuthor = await chrome.storage.local.get('vibecheck:authorName')
  $('author').value = storedAuthor['vibecheck:authorName'] || 'You'

  if (session?.user) {
    $('status').textContent = `Signed in as ${session.user.email}`
    $('signin').hidden = true
    $('signout').hidden = false
  }
  else if (config?.url) {
    $('status').textContent = 'Supabase is configured. Sign in with Google to sync comments across the team.'
    $('signin').hidden = false
    $('signout').hidden = true
  }
  else {
    $('status').textContent = 'Local mode — comments stay in this browser until you connect Supabase.'
    $('signin').hidden = false
    $('signout').hidden = true
  }

  const list = inbox?.data?.notifications || []
  $('inbox').innerHTML = list.length
    ? list.slice(0, 20).map(item => `
        <li>
          <b>${escapeHtml(item.type || 'update')}</b>
          ${escapeHtml(item.body || item.context || '')}
          <span>${escapeHtml(item.url || '')} · ${escapeHtml(item.createdAt || '')}</span>
        </li>
      `).join('')
    : '<li>No notifications yet. Mentions and content suggestions will land here.</li>'
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

$('save-author').addEventListener('click', async () => {
  const name = $('author').value.trim() || 'You'
  await chrome.storage.local.set({ 'vibecheck:authorName': name })
})

$('save-config').addEventListener('click', async () => {
  const res = await call('setConfig', {
    url: $('url').value.trim(),
    anonKey: $('anon').value.trim(),
    allowedDomain: $('domain').value.trim(),
  })
  $('status').textContent = res?.ok ? 'Config saved.' : (res?.error || 'Could not save config')
})

$('signin').addEventListener('click', async () => {
  const res = await call('signIn')
  $('status').textContent = res?.ok ? `Signed in as ${res.data.user.email}` : (res?.error || 'Sign-in failed')
  refresh()
})

$('signout').addEventListener('click', async () => {
  await call('signOut')
  refresh()
})

refresh()

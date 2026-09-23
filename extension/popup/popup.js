import { APP_FOUNDRY_API_BASE_URL } from '../backend/app-foundry.js'

const CHANNEL = 'vibecheck-store'
const platform = typeof browser === 'undefined' ? chrome : browser
const state = {
  login: 'initial',
  onboarding: 'empty',
  values: {
    firstName: '',
    lastName: '',
  },
  errors: {},
  submitError: '',
  profile: null,
}

function $(id) {
  return document.getElementById(id)
}

async function call(method, payload) {
  const response = await platform.runtime.sendMessage({
    channel: CHANNEL,
    method,
    payload,
  })

  if (!response?.ok) {
    throw new Error(response?.error || 'The extension could not complete this request.')
  }

  return response.data
}

async function refresh() {
  try {
    const status = await call('status')

    if (!status?.appFoundry?.authenticated) {
      state.profile = null
      if (state.login === 'redirecting') state.login = 'error'
      renderLogin()
      return
    }

    const profileResponse = await call('profile')
    const profile = profileResponse?.profile || {}
    state.profile = profileResponse

    if (!profileResponse?.onboardingComplete) {
      if (state.onboarding !== 'submitting') {
        state.values = {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
        }
        state.errors = {}
        state.submitError = ''
        state.onboarding = state.values.firstName || state.values.lastName ? 'filled' : 'empty'
      }
      renderOnboarding()
      return
    }

    await renderAccount(profile)
  }
  catch (error) {
    state.profile = null
    if (state.login === 'redirecting') state.login = 'error'
    renderLogin(error.message)
  }
}

async function startSignIn() {
  state.login = 'redirecting'
  renderLogin()

  try {
    if (!platform.tabs?.create) {
      throw new Error('Open Account settings from the installed VibeCheck extension, not as a local HTML file.')
    }
    await platform.tabs.create({
      url: `${APP_FOUNDRY_API_BASE_URL}/auth/complete`,
      active: true,
    })
  }
  catch (error) {
    state.login = 'error'
    renderLogin(error.message)
  }
}

async function submitOnboarding() {
  if (state.onboarding === 'submitting') return

  const firstName = state.values.firstName.trim()
  const lastName = state.values.lastName.trim()
  state.errors = {
    ...(firstName ? {} : { firstName: 'Enter your first name' }),
    ...(lastName ? {} : { lastName: 'Enter your last name' }),
  }

  if (Object.keys(state.errors).length) {
    state.onboarding = 'validation'
    renderOnboarding()
    return
  }

  state.onboarding = 'submitting'
  state.submitError = ''
  renderOnboarding()

  try {
    state.profile = await call('updateProfile', { firstName, lastName })
    state.onboarding = 'ready'
    renderOnboarding()
  }
  catch (error) {
    state.onboarding = 'submit-failed'
    state.submitError = error.message
    renderOnboarding()
  }
}

async function renderAccount(profile) {
  $('auth-flow').hidden = true
  $('account-content').hidden = false

  const accountName = profile.displayName || profile.email || 'your account'
  $('status').textContent = `Connected to AppFoundry as ${accountName}`
  $('account-profile').textContent = [profile.displayName, profile.email]
    .filter(Boolean)
    .join(' · ')

  const storedAuthor = await platform.storage.local.get('vibecheck:authorName')
  $('author').value = storedAuthor['vibecheck:authorName'] || profile.displayName || 'You'

  const storedRole = await platform.storage.local.get('vibecheck:toolbarRole')
  $('toolbar-role').value = storedRole['vibecheck:toolbarRole'] || 'Full'

  try {
    const inbox = await call('inbox')
    renderInbox(inbox?.notifications || [])
  }
  catch {
    renderInbox([])
  }
}

function renderLogin(message = '') {
  $('auth-flow').hidden = false
  $('account-content').hidden = true

  const redirecting = state.login === 'redirecting'
  const failed = state.login === 'error'
  const body = redirecting
    ? 'Redirecting to your company sign-in…'
    : 'Sign in with your company account to continue.'
  const actionLabel = redirecting
    ? 'Redirecting…'
    : failed
      ? 'Try again'
      : 'Continue with company sign-in'
  const errorText = failed
    ? message || "We couldn't sign you in. Try again."
    : ''

  $('auth-flow').innerHTML = `
    <div class="flow-header">
      <h1>VibeCheck</h1>
      <p>${body}</p>
    </div>
    ${errorText ? flowMessage(errorText) : ''}
    <form id="login-form" class="flow-form">
      <div class="flow-actions">
        <button
          data-vc-component="Button"
          data-style="Secondary"
          data-state="${redirecting ? 'Loading' : failed ? 'Error' : 'Default'}"
          type="submit"
          ${redirecting ? 'disabled' : ''}
        >${actionLabel}</button>
      </div>
    </form>
  `
}

function renderOnboarding() {
  $('auth-flow').hidden = false
  $('account-content').hidden = true

  if (state.onboarding === 'ready') {
    $('auth-flow').innerHTML = `
      <div class="flow-success">
        <img src="assets/check-circle.svg" alt="" aria-hidden="true">
        <div class="flow-header">
          <h1>You're ready</h1>
          <p>You can start using VibeCheck.</p>
        </div>
        <div class="flow-actions">
          <button data-action="get-started" data-vc-component="Button" data-style="Primary" type="button">Get started</button>
        </div>
      </div>
    `
    return
  }

  const submitting = state.onboarding === 'submitting'
  const submitFailed = state.onboarding === 'submit-failed'
  const firstError = state.errors.firstName
  const lastError = state.errors.lastName

  $('auth-flow').innerHTML = `
    <div class="flow-header">
      <h1>Tell us who you are</h1>
      <p>This helps teammates recognize you in VibeCheck.</p>
    </div>
    <form id="onboarding-form" class="flow-form">
      <p class="flow-required">All fields are required.</p>
      <div class="flow-field">
        <label for="first-name">First name</label>
        <input
          id="first-name"
          data-field="firstName"
          data-vc-component="Field"
          data-state="${firstError ? 'Error' : submitting ? 'Disabled' : 'Default'}"
          type="text"
          value="${escapeHtml(state.values.firstName)}"
          aria-invalid="${firstError ? 'true' : 'false'}"
          ${firstError ? 'aria-describedby="first-name-error"' : ''}
          ${submitting ? 'disabled' : ''}
        >
        ${firstError ? `<span id="first-name-error" class="field-error">${escapeHtml(firstError)}</span>` : ''}
      </div>
      <div class="flow-field">
        <label for="last-name">Last name</label>
        <input
          id="last-name"
          data-field="lastName"
          data-vc-component="Field"
          data-state="${lastError ? 'Error' : submitting ? 'Disabled' : 'Default'}"
          type="text"
          value="${escapeHtml(state.values.lastName)}"
          aria-invalid="${lastError ? 'true' : 'false'}"
          ${lastError ? 'aria-describedby="last-name-error"' : ''}
          ${submitting ? 'disabled' : ''}
        >
        ${lastError ? `<span id="last-name-error" class="field-error">${escapeHtml(lastError)}</span>` : ''}
      </div>
      ${submitFailed ? flowMessage('Couldn\'t continue. Try again.', state.submitError) : ''}
      <div class="flow-actions">
        <button
          data-vc-component="Button"
          data-style="Primary"
          data-state="${submitting ? 'Loading' : submitFailed ? 'Error' : 'Default'}"
          type="submit"
          ${submitting ? 'disabled' : ''}
        >${submitting ? 'Continuing…' : 'Continue'}</button>
      </div>
    </form>
  `
}

function flowMessage(text, detail = '') {
  return `
    <p class="flow-message">
      <img src="assets/x-circle.svg" alt="" aria-hidden="true">
      <span>${escapeHtml(text)}${detail && detail !== text ? ` ${escapeHtml(detail)}` : ''}</span>
    </p>
  `
}

function renderInbox(notifications) {
  $('inbox').innerHTML = notifications.length
    ? notifications.slice(0, 20).map(item => `
        <li data-vc-component="Inbox Item">
          <b>${escapeHtml(item.type || 'update')}</b>
          ${escapeHtml(item.body || item.context || '')}
          <span>${escapeHtml(item.url || '')} · ${escapeHtml(item.createdAt || '')}</span>
        </li>
      `).join('')
    : '<li data-vc-component="Inbox Item">No notifications yet. Mentions and content suggestions will land here.</li>'
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

$('auth-flow').addEventListener('submit', event => {
  event.preventDefault()
  if (event.target.id === 'login-form') {
    startSignIn()
    return
  }
  if (event.target.id === 'onboarding-form') submitOnboarding()
})

$('auth-flow').addEventListener('click', async event => {
  const action = event.target.closest('[data-action]')?.dataset.action
  if (action === 'get-started') {
    await renderAccount(state.profile?.profile || {})
  }
})

$('auth-flow').addEventListener('input', event => {
  const field = event.target.dataset.field
  if (!field) return
  state.values[field] = event.target.value
  if (state.errors[field]) delete state.errors[field]
  if (state.onboarding === 'validation') state.onboarding = 'filled'
})

$('save-author').addEventListener('click', async () => {
  const name = $('author').value.trim() || 'You'
  await platform.storage.local.set({ 'vibecheck:authorName': name })
})

$('toolbar-role').addEventListener('change', async () => {
  const role = $('toolbar-role').value === 'PM Only' ? 'PM Only' : 'Full'
  await platform.storage.local.set({ 'vibecheck:toolbarRole': role })
})

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && state.login === 'redirecting') refresh()
})

renderLogin()
refresh()

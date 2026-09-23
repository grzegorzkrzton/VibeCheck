export const APP_FOUNDRY_API_BASE_URL = 'https://vibecheck-backend.internal.zenai-apps.com'

export async function getAuthContext() {
  return request('/api/v1/auth/context')
}

export async function getProfile() {
  return request('/api/v1/me')
}

export async function updateProfile(profile) {
  return request('/api/v1/me', {
    method: 'PUT',
    body: profile,
  })
}

export async function loadStore(url) {
  const query = new URLSearchParams({ url })
  return request(`/api/v1/store?${query.toString()}`)
}

export async function saveStore(url, state) {
  return request('/api/v1/store', {
    method: 'PUT',
    body: {
      url,
      state,
      revision: Number.isInteger(state?.revision) ? state.revision : undefined,
    },
  })
}

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${APP_FOUNDRY_API_BASE_URL}${path}`, {
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await response.json().catch(() => null)
  if (response.ok) return payload

  const error = new Error(
    payload?.error?.message || `AppFoundry request failed with HTTP ${response.status}.`,
  )
  error.code = payload?.error?.code || `HTTP_${response.status}`
  error.status = response.status
  throw error
}

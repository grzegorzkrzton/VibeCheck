import { getAuthContext } from './app-foundry.js'

const platform = typeof browser === 'undefined' ? chrome : browser

export async function isAuthenticated() {
  try {
    const context = await getAuthContext()
    return Boolean(context?.authenticated)
  }
  catch {
    return false
  }
}

export async function openLoginRequiredFlow() {
  const url = platform.runtime.getURL('popup/index.html?gate=login')
  await platform.tabs.create({ url, active: true })
}

export async function ensureAuthenticatedBeforeToolbar() {
  if (await isAuthenticated()) return true
  await openLoginRequiredFlow()
  return false
}

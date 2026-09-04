const SOURCE = 'design-handoff'
const REPLY = 'design-handoff-reply'

export function handoffRequest(type, payload = {}) {
  if (typeof chrome !== 'undefined' && chrome.runtime?.id) {
    return chrome.runtime.sendMessage({ type, payload }).catch(error => ({
      ok: false,
      error: error.message,
    }))
  }

  return new Promise(resolve => {
    const id = crypto.randomUUID()
    const timer = setTimeout(() => {
      window.removeEventListener('message', onMessage)
      resolve({ ok: false, error: 'Timed out talking to the extension. Reload the page and toggle Design Handoff again.' })
    }, 15000)

    const onMessage = event => {
      if (event.source !== window) return
      if (event.data?.source !== REPLY || event.data.id !== id) return
      clearTimeout(timer)
      window.removeEventListener('message', onMessage)
      resolve(event.data.response)
    }

    window.addEventListener('message', onMessage)
    window.postMessage({ source: SOURCE, id, type, payload }, '*')
  })
}

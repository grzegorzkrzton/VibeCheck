var platform = typeof browser === 'undefined'
  ? chrome
  : browser

const script = document.createElement('script')
script.type = 'module'
script.src = platform.runtime.getURL('toolbar/bundle.min.js')

const BRIDGE_REQUEST_SOURCE = 'vibecheck-page'
const BRIDGE_RESPONSE_SOURCE = 'vibecheck-extension'
const BRIDGE_REQUEST_TYPE = 'vibecheck-store-request'
const BRIDGE_RESPONSE_TYPE = 'vibecheck-store-response'
const CHANNEL = 'vibecheck-store'

function normalizePrototypeUrl(raw = location.href) {
  try {
    const url = new URL(raw)
    url.hash = ''
    url.search = ''
    let path = url.pathname || '/'
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
    return `${url.origin}${path}`
  }
  catch {
    return raw
  }
}

function sendBridgeResponse(id, response) {
  window.postMessage({
    source: BRIDGE_RESPONSE_SOURCE,
    type: BRIDGE_RESPONSE_TYPE,
    id,
    ok: Boolean(response?.ok),
    data: response?.data,
    error: response?.error,
    code: response?.code,
  }, '*')
}

document.documentElement.setAttribute('data-vibecheck-extension', 'true')
window.addEventListener('message', event => {
  const request = event.data
  if (event.source !== window
    || request?.source !== BRIDGE_REQUEST_SOURCE
    || request.type !== BRIDGE_REQUEST_TYPE
    || !request.id) return

  const requestedUrl = normalizePrototypeUrl(request.payload?.url)
  if (requestedUrl !== normalizePrototypeUrl()) {
    sendBridgeResponse(request.id, {
      ok: false,
      error: 'The VibeCheck store URL must match the current page.',
      code: 'STORE_URL_MISMATCH',
    })
    return
  }

  platform.runtime.sendMessage({
    channel: CHANNEL,
    method: request.method,
    payload: request.payload,
  }).then(
    response => sendBridgeResponse(request.id, response),
    error => sendBridgeResponse(request.id, {
      ok: false,
      error: error?.message || 'The extension could not reach its service worker.',
      code: error?.code || 'EXTENSION_RUNTIME_ERROR',
    }),
  )
})

document.body.appendChild(script)

const vibecheck = document.createElement('vibe-check')

const src_path = platform.runtime.getURL(`tuts/guides.gif`)
vibecheck.setAttribute('tutsBaseURL', src_path.slice(0, src_path.lastIndexOf('/')))

document.body.prepend(vibecheck)

platform.runtime.onMessage.addListener(request => {
  if (request.action === 'COLOR_MODE') {
    let mode = request.params.mode
    if (document.documentElement.dataset.vibecheckColorFormat === 'off' && mode !== 'hex')
      mode = 'hex'
    vibecheck.setAttribute('color-mode', mode)
  }
  else if (request.action === 'COLOR_SCHEME')
    vibecheck.setAttribute("color-scheme", request.params.mode)
})

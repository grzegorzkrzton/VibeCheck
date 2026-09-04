var platform = typeof browser === 'undefined'
  ? chrome
  : browser

const SOURCE = 'design-handoff'
const REPLY = 'design-handoff-reply'

const script = document.createElement('script')
script.type = 'module'
script.src = platform.runtime.getURL('toolbar/bundle.min.js')
document.documentElement.appendChild(script)

const visbug = document.createElement('vis-bug')

const src_path = platform.runtime.getURL(`tuts/guides.gif`)
visbug.setAttribute('tutsBaseURL', src_path.slice(0, src_path.lastIndexOf('/')))

;(document.body || document.documentElement).prepend(visbug)

window.addEventListener('message', async event => {
  if (event.source !== window) return
  if (event.data?.source !== SOURCE) return

  let response
  try {
    response = await platform.runtime.sendMessage({
      type: event.data.type,
      payload: {
        ...(event.data.payload || {}),
        url: location.href,
        title: document.title,
      },
    })
  }
  catch (error) {
    response = { ok: false, error: error.message }
  }

  window.postMessage({ source: REPLY, id: event.data.id, response }, '*')
})

platform.runtime.onMessage.addListener(request => {
  if (request.action === 'COLOR_MODE')
    visbug.setAttribute('color-mode', request.params.mode)
  else if (request.action === 'COLOR_SCHEME')
    visbug.setAttribute("color-scheme", request.params.mode)
})

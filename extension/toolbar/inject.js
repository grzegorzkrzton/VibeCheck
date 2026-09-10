var platform = typeof browser === 'undefined'
  ? chrome
  : browser

const script = document.createElement('script')
script.type = 'module'
script.src = platform.runtime.getURL('toolbar/bundle.min.js')
document.body.appendChild(script)

const vibecheck = document.createElement('vibe-check')

const src_path = platform.runtime.getURL(`tuts/guides.gif`)
vibecheck.setAttribute('tutsBaseURL', src_path.slice(0, src_path.lastIndexOf('/')))

document.body.prepend(vibecheck)

platform.runtime.onMessage.addListener(request => {
  if (request.action === 'COLOR_MODE')
    vibecheck.setAttribute('color-mode', request.params.mode)
  else if (request.action === 'COLOR_SCHEME')
    vibecheck.setAttribute("color-scheme", request.params.mode)
})

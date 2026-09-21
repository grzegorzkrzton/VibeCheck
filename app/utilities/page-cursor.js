const FOLLOWER_ID = 'vibecheck-page-cursor'
const STYLE_ID = 'vibecheck-page-cursor-styles'
const HOST_ATTR = 'data-vc-page-cursor'
const FILL = '#17191C'
const SIZE = 24

export const FOLLOWER_TOOLS = new Set(['comments', 'annotations', 'content'])

const HOTSPOT = {
  comments: [6, 20],
  annotations: [6, 20],
  content: [6, 20],
}

let follower = null
let moveRaf = 0
let lastPoint = { x: 0, y: 0 }

export function setPageCursor({ tool, icon } = {}) {
  clearPageCursor()
  if (!tool || !icon || typeof document === 'undefined') return

  ensureStyles()

  if (FOLLOWER_TOOLS.has(tool)) {
    startFollower(tool, icon)
    return
  }

  startUrlCursor(tool, icon)
}

export function clearPageCursor() {
  stopFollower()
  if (typeof document === 'undefined') return
  document.documentElement.removeAttribute(HOST_ATTR)
  document.documentElement.style.removeProperty('--vc-page-cursor')
}

export function prepareCursorSvg(markup, { fill = FILL, size = SIZE } = {}) {
  let svg = String(markup || '').trim()
  if (!svg.startsWith('<svg')) return ''
  svg = svg
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\saria-hidden="[^"]*"/g, '')
    .replace(/\sversion="[^"]*"/g, '')
  if (!/\sxmlns=/.test(svg))
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  svg = svg.replace(/<svg([^>]*)>/, (_, attrs) => {
    let next = attrs
    if (!/\swidth=/.test(next)) next += ` width="${size}"`
    if (!/\sheight=/.test(next)) next += ` height="${size}"`
    if (!/\sfill=/.test(next)) next += ` fill="${fill}"`
    return `<svg${next}>`
  })
  return svg
}

export function cursorCssValue(icon, tool) {
  const svg = prepareCursorSvg(icon)
  if (!svg) return 'auto'
  const [x, y] = HOTSPOT[tool] || [12, 12]
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, auto`
}

function startUrlCursor(tool, icon) {
  document.documentElement.style.setProperty('--vc-page-cursor', cursorCssValue(icon, tool))
  document.documentElement.setAttribute(HOST_ATTR, 'url')
}

function startFollower(tool, icon) {
  const svg = prepareCursorSvg(icon)
  if (!svg) return

  follower = document.createElement('div')
  follower.id = FOLLOWER_ID
  follower.setAttribute('aria-hidden', 'true')
  follower.dataset.tool = tool
  follower.innerHTML = svg
  document.documentElement.appendChild(follower)
  document.documentElement.setAttribute(HOST_ATTR, 'follower')

  const [hotX, hotY] = HOTSPOT[tool] || [12, 12]
  follower.style.setProperty('--vc-cursor-hot-x', `${hotX}px`)
  follower.style.setProperty('--vc-cursor-hot-y', `${hotY}px`)

  window.addEventListener('pointermove', onPointerMove, true)
  document.addEventListener('pointerleave', onPointerLeave, true)
  placeFollower(lastPoint.x, lastPoint.y)
}

function stopFollower() {
  window.removeEventListener('pointermove', onPointerMove, true)
  document.removeEventListener('pointerleave', onPointerLeave, true)
  if (moveRaf) cancelAnimationFrame(moveRaf)
  moveRaf = 0
  follower?.remove()
  follower = null
}

function onPointerMove(event) {
  lastPoint = { x: event.clientX, y: event.clientY }
  if (moveRaf) return
  moveRaf = requestAnimationFrame(() => {
    moveRaf = 0
    placeFollower(lastPoint.x, lastPoint.y)
  })
}

function onPointerLeave() {
  if (follower) follower.hidden = true
}

function placeFollower(x, y) {
  if (!follower) return
  const overChrome = isVibeCheckChrome(x, y)
  follower.hidden = overChrome || (!x && !y)
  if (follower.hidden) return
  follower.style.transform = `translate(${x}px, ${y}px)`
}

function isVibeCheckChrome(x, y) {
  const stack = typeof document.elementsFromPoint === 'function'
    ? document.elementsFromPoint(x, y)
    : [document.elementFromPoint(x, y)]
  return stack.some(el => {
    if (!el) return false
    if (el.id === FOLLOWER_ID) return false
    const name = el.localName || el.nodeName?.toLowerCase()
    return el.id === 'vibecheck-layer'
      || el.id === 'vibecheck-toolbar-tip'
      || name === 'vibe-check'
      || name === 'hotkey-map'
  })
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    html[data-vc-page-cursor="url"] {
      cursor: var(--vc-page-cursor);
    }
    html[data-vc-page-cursor="follower"] {
      cursor: none;
    }
    html[data-vc-page-cursor] vibe-check,
    html[data-vc-page-cursor] #vibecheck-layer,
    html[data-vc-page-cursor] #vibecheck-toolbar-tip {
      cursor: auto;
    }
    html[data-vc-page-cursor="url"] [data-measuring="true"] {
      cursor: crosshair;
    }
    #${FOLLOWER_ID} {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483645;
      width: ${SIZE}px;
      height: ${SIZE}px;
      margin: 0;
      padding: 0;
      pointer-events: none;
      color: ${FILL};
      filter: drop-shadow(0 0 1px #fff) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.28));
      transform: translate(-100px, -100px);
      will-change: transform;
    }
    #${FOLLOWER_ID} svg {
      display: block;
      width: ${SIZE}px;
      height: ${SIZE}px;
      fill: currentColor;
    }
    #${FOLLOWER_ID} {
      margin-left: calc(var(--vc-cursor-hot-x, 12px) * -1);
      margin-top: calc(var(--vc-cursor-hot-y, 12px) * -1);
    }
  `
  document.head.appendChild(style)
}

const FOLLOWER_ID = 'vibecheck-page-cursor'
const STYLE_ID = 'vibecheck-page-cursor-styles'
const STYLE_VERSION = 'plate-wcag-v2'
const HOST_ATTR = 'data-vc-page-cursor'
const PLATE_BORDER = '#ABB0BA'
const PLATE_LIGHT = '#FFFFFF'
const PLATE_DARK = '#17191C'
const ICON_ON_LIGHT_PLATE = '#17191C'
const ICON_ON_DARK_PLATE = '#F9FAFA'
/** Figma 465:10281 — 24×24 plate, 16×16 icon. */
const PLATE_SIZE = 24
const ICON_SIZE = 16
const PLATE_RADIUS = PLATE_SIZE / 2
const PLATE_LIGHT_RGB = { r: 255, g: 255, b: 255 }
const PLATE_DARK_RGB = { r: 23, g: 25, b: 28 }
const ICON_DARK_RGB = { r: 23, g: 25, b: 28 }
const ICON_LIGHT_RGB = { r: 249, g: 250, b: 250 }
const DEFAULT_BACKDROP_RGB = { r: 249, g: 250, b: 250 }
const ICON_OFFSET_X = PLATE_RADIUS - ICON_SIZE / 2
const ICON_OFFSET_Y = PLATE_RADIUS - ICON_SIZE / 2

/**
 * Figma 465:10281 teardrop — sharp TL at (0,0); one 270° arc for TR→BR→BL.
 */
export function teardropPlatePath(size) {
  const r = size / 2
  return `M 0 0 L ${r} 0 A ${r} ${r} 0 1 1 0 ${r} Z`
}

export function teardropClipPath(size = PLATE_SIZE) {
  const r = size / 2
  return `path('M 0 0 L ${r} 0 A ${r} ${r} 0 1 1 0 ${r} Z')`
}

const PLATE_PATH = teardropPlatePath(PLATE_SIZE)
const PLATE_CLIP = teardropClipPath(PLATE_SIZE)

export const FOLLOWER_TOOLS = new Set(['comments', 'annotations', 'content'])

/** Pointer anchor — sharp top-left corner of the plate (Figma 465:10281). */
const PLATE_HOTSPOT = [0, 0]

let follower = null
let moveRaf = 0
let lastPoint = { x: 0, y: 0 }

export function setPageCursor({ tool, icon } = {}) {
  clearPageCursor()
  if (!tool || !icon || typeof document === 'undefined') return

  ensureStyles()
  startFollower(tool, icon)
}

export function clearPageCursor() {
  stopFollower()
  if (typeof document === 'undefined') return
  document.documentElement.removeAttribute(HOST_ATTR)
  document.documentElement.style.removeProperty('--vc-page-cursor')
}

export function prepareCursorSvg(markup, { size = ICON_SIZE } = {}) {
  let svg = String(markup || '').trim()
  if (!svg.startsWith('<svg')) return ''
  svg = svg
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\saria-hidden="[^"]*"/g, '')
    .replace(/\sversion="[^"]*"/g, '')
  if (!/\sxmlns=/.test(svg))
    svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
  svg = svg.replace(/<path\b([^>]*?)>/gi, (_, attrs) => {
    let next = attrs
    if (/fill=/.test(next))
      next = next.replace(/\sfill="[^"]*"/gi, '')
    return `<path fill="currentColor"${next}>`
  })
  svg = svg.replace(/<svg([^>]*)>/, (_, attrs) => {
    let next = attrs
    if (!/\swidth=/.test(next)) next += ` width="${size}"`
    if (!/\sheight=/.test(next)) next += ` height="${size}"`
    if (!/\sfill=/.test(next)) next += ` fill="currentColor"`
    return `<svg${next}>`
  })
  return svg
}

function iconSvgInner(svg) {
  const match = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/i)
  return match ? match[1].trim() : ''
}

/** Static SVG cursor — used by tests and cursorCssValue export. */
export function compositeCursorSvg(iconMarkup) {
  const iconSvg = prepareCursorSvg(iconMarkup, { size: ICON_SIZE })
  if (!iconSvg) return ''
  const inner = iconSvgInner(iconSvg)
  const viewBox = iconSvg.match(/viewBox="([^"]+)"/)?.[1] || `0 0 ${ICON_SIZE} ${ICON_SIZE}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PLATE_SIZE}" height="${PLATE_SIZE}" viewBox="0 0 ${PLATE_SIZE} ${PLATE_SIZE}">
    <path fill="${PLATE_LIGHT}" stroke="${PLATE_BORDER}" stroke-width="1" d="${PLATE_PATH}"/>
    <g transform="translate(${ICON_OFFSET_X} ${ICON_OFFSET_Y})" fill="${ICON_ON_LIGHT_PLATE}">
      <svg width="${ICON_SIZE}" height="${ICON_SIZE}" viewBox="${viewBox}" overflow="visible">${inner}</svg>
    </g>
  </svg>`
}

function cssHotspot() {
  return PLATE_HOTSPOT
}

export function cursorCssValue(icon) {
  const svg = compositeCursorSvg(icon)
  if (!svg) return 'auto'
  const [x, y] = cssHotspot()
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${x} ${y}, auto`
}

function buildFollowerMarkup(icon) {
  const iconSvg = prepareCursorSvg(icon, { size: ICON_SIZE })
  if (!iconSvg) return ''
  return `
    <div class="vc-cursor-root">
      <div class="vc-cursor-face">
        <svg class="vc-cursor-plate-svg" viewBox="0 0 ${PLATE_SIZE} ${PLATE_SIZE}" aria-hidden="true">
          <path class="vc-cursor-plate-fill" d="${PLATE_PATH}"/>
          <path class="vc-cursor-plate-stroke" d="${PLATE_PATH}" fill="none" stroke="${PLATE_BORDER}" stroke-width="1" stroke-linejoin="miter" vector-effect="non-scaling-stroke"/>
        </svg>
        <div class="vc-cursor-icon">${iconSvg}</div>
      </div>
    </div>
  `
}

function parseCssColor(value) {
  const raw = String(value || '').trim()
  if (!raw || raw === 'transparent') return null
  const hex = raw.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    let h = hex[1]
    if (h.length === 3)
      h = h.split('').map(c => c + c).join('')
    const n = Number.parseInt(h.slice(0, 6), 16)
    const a = h.length === 8 ? Number.parseInt(h.slice(6, 8), 16) / 255 : 1
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a }
  }
  const rgb = raw.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i)
  if (rgb)
    return {
      r: Number(rgb[1]),
      g: Number(rgb[2]),
      b: Number(rgb[3]),
      a: rgb[4] === undefined ? 1 : Number(rgb[4]),
    }
  return null
}

export function srgbChannel(v) {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.0 relative luminance (sRGB). */
export function relativeLuminance({ r, g, b }) {
  return 0.2126 * srgbChannel(r) + 0.7152 * srgbChannel(g) + 0.0722 * srgbChannel(b)
}

/** WCAG 2.0 contrast ratio (1–21). */
export function contrastRatio(a, b) {
  const L1 = relativeLuminance(a)
  const L2 = relativeLuminance(b)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

export function srgbLuma(r, g, b) {
  return relativeLuminance({ r, g, b })
}

function colorFromElementTree(el) {
  let node = el
  while (node && node.nodeType === 1) {
    const bg = parseCssColor(getComputedStyle(node).backgroundColor)
    if (bg && bg.a > 0.08)
      return { r: bg.r, g: bg.g, b: bg.b }
    node = node.parentElement
  }
  return null
}

/** RGB under the cursor (first opaque background in the hit stack). */
export function sampleBackdropColor(clientX, clientY) {
  if (typeof document === 'undefined') return { ...DEFAULT_BACKDROP_RGB }
  if (typeof document.elementsFromPoint === 'function') {
    const stack = document.elementsFromPoint(clientX, clientY)
    for (const el of stack) {
      if (!el || el.id === FOLLOWER_ID || el.closest?.(`#${FOLLOWER_ID}`)) continue
      const rgb = colorFromElementTree(el)
      if (rgb) return rgb
    }
  }
  return colorFromElementTree(document.body)
    || colorFromElementTree(document.documentElement)
    || { ...DEFAULT_BACKDROP_RGB }
}

/**
 * Pick plate preset with higher WCAG contrast vs backdrop.
 * @returns {'dark'|'light'} `data-vc-backdrop` — dark page → white plate, light page → dark plate.
 */
export function bestPlateThemeForBackdrop(backdrop) {
  const whitePlateContrast = contrastRatio(PLATE_LIGHT_RGB, backdrop)
  const darkPlateContrast = contrastRatio(PLATE_DARK_RGB, backdrop)
  return whitePlateContrast >= darkPlateContrast ? 'dark' : 'light'
}

/** Icon preset with higher WCAG contrast vs the chosen plate fill. */
export function bestIconThemeForPlate(plateTheme) {
  const plate = plateTheme === 'light' ? PLATE_DARK_RGB : PLATE_LIGHT_RGB
  const darkIconContrast = contrastRatio(ICON_DARK_RGB, plate)
  const lightIconContrast = contrastRatio(ICON_LIGHT_RGB, plate)
  return darkIconContrast >= lightIconContrast ? 'dark' : 'light'
}

/** @deprecated use sampleBackdropColor */
export function sampleBackdropLuma(clientX, clientY) {
  const { r, g, b } = sampleBackdropColor(clientX, clientY)
  return srgbLuma(r, g, b)
}

function backdropTheme(backdrop) {
  return bestPlateThemeForBackdrop(backdrop)
}

function updateCursorTheme(clientX, clientY) {
  if (!follower) return
  const sampleX = clientX + PLATE_RADIUS
  const sampleY = clientY + PLATE_RADIUS
  const backdrop = sampleBackdropColor(sampleX, sampleY)
  const plateTheme = backdropTheme(backdrop)
  const iconTheme = bestIconThemeForPlate(plateTheme)
  if (follower.dataset.vcBackdrop !== plateTheme)
    follower.dataset.vcBackdrop = plateTheme
  if (follower.dataset.vcIcon !== iconTheme)
    follower.dataset.vcIcon = iconTheme
}

function cursorMountNode() {
  return document.body || document.documentElement
}

function startFollower(tool, icon) {
  const html = buildFollowerMarkup(icon)
  if (!html) return

  follower = document.createElement('div')
  follower.id = FOLLOWER_ID
  follower.setAttribute('aria-hidden', 'true')
  follower.dataset.tool = tool
  follower.dataset.vcBackdrop = 'dark'
  follower.dataset.vcIcon = 'dark'
  follower.innerHTML = html
  cursorMountNode().appendChild(follower)
  document.documentElement.setAttribute(HOST_ATTR, 'follower')

  const [hotX, hotY] = cssHotspot()
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
  updateCursorTheme(x, y)
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
  const existing = document.getElementById(STYLE_ID)
  if (existing?.dataset.vcVersion === STYLE_VERSION) return
  existing?.remove()

  const style = document.createElement('style')
  style.id = STYLE_ID
  style.dataset.vcVersion = STYLE_VERSION
  style.textContent = `
    html[data-vc-page-cursor="follower"] {
      cursor: none;
    }
    html[data-vc-page-cursor] vibe-check,
    html[data-vc-page-cursor] #vibecheck-layer,
    html[data-vc-page-cursor] #vibecheck-toolbar-tip {
      cursor: auto;
    }
    html[data-vc-page-cursor="follower"] [data-measuring="true"] {
      cursor: crosshair;
    }
    #${FOLLOWER_ID} {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2147483645;
      box-sizing: border-box;
      width: ${PLATE_SIZE}px;
      height: ${PLATE_SIZE}px;
      margin: 0;
      padding: 0;
      pointer-events: none;
      overflow: visible;
      transform: translate(-100px, -100px);
      will-change: transform;
      margin-left: calc(var(--vc-cursor-hot-x, 0px) * -1);
      margin-top: calc(var(--vc-cursor-hot-y, 0px) * -1);
    }
    #${FOLLOWER_ID} .vc-cursor-root {
      width: ${PLATE_SIZE}px;
      height: ${PLATE_SIZE}px;
      overflow: visible;
    }
    #${FOLLOWER_ID} .vc-cursor-face {
      position: relative;
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28));
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      overflow: visible;
    }
    #${FOLLOWER_ID} .vc-cursor-plate-svg {
      position: absolute;
      inset: 0;
      width: ${PLATE_SIZE}px;
      height: ${PLATE_SIZE}px;
      display: block;
      overflow: visible;
      pointer-events: none;
    }
    #${FOLLOWER_ID}[data-vc-backdrop="dark"][data-vc-icon="dark"] .vc-cursor-plate-fill {
      fill: ${PLATE_LIGHT};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="dark"][data-vc-icon="dark"] .vc-cursor-icon {
      color: ${ICON_ON_LIGHT_PLATE};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="light"][data-vc-icon="light"] .vc-cursor-plate-fill {
      fill: ${PLATE_DARK};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="light"][data-vc-icon="light"] .vc-cursor-icon {
      color: ${ICON_ON_DARK_PLATE};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="dark"][data-vc-icon="light"] .vc-cursor-plate-fill {
      fill: ${PLATE_LIGHT};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="dark"][data-vc-icon="light"] .vc-cursor-icon {
      color: ${ICON_ON_DARK_PLATE};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="light"][data-vc-icon="dark"] .vc-cursor-plate-fill {
      fill: ${PLATE_DARK};
    }
    #${FOLLOWER_ID}[data-vc-backdrop="light"][data-vc-icon="dark"] .vc-cursor-icon {
      color: ${ICON_ON_LIGHT_PLATE};
    }
    #${FOLLOWER_ID} .vc-cursor-icon {
      position: relative;
      z-index: 1;
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #${FOLLOWER_ID} .vc-cursor-icon svg {
      display: block;
      width: ${ICON_SIZE}px;
      height: ${ICON_SIZE}px;
    }
    #${FOLLOWER_ID} .vc-cursor-icon path {
      fill: currentColor;
    }
  `
  document.head.appendChild(style)
}

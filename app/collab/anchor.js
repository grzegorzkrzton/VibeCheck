const SKIP = new Set([
  'VIS-BUG', 'HOTKEY-MAP', 'HANDOFF-PANEL', 'HANDOFF-PIN',
  'HANDOFF-COMPOSER', 'HANDOFF-ANNOTATION', 'HANDOFF-TOAST',
])

export function cssPath(el) {
  if (!(el instanceof Element)) return ''
  const parts = []
  let node = el

  while (node && node.nodeType === 1 && node !== document.body && node !== document.documentElement) {
    if (SKIP.has(node.nodeName) || node.id?.startsWith('handoff-'))
      break

    let selector = node.nodeName.toLowerCase()
    if (node.id && !/^\d/.test(node.id) && !node.id.includes(':')) {
      selector += `#${CSS.escape(node.id)}`
      parts.unshift(selector)
      break
    }

    const parent = node.parentElement
    if (parent) {
      const same = [...parent.children].filter(child => child.nodeName === node.nodeName)
      if (same.length > 1)
        selector += `:nth-of-type(${same.indexOf(node) + 1})`
    }

    const classes = [...node.classList]
      .filter(name => name && !name.startsWith('visbug') && name !== 'data-selected')
      .slice(0, 3)
      .map(name => `.${CSS.escape(name)}`)
      .join('')

    parts.unshift(selector + classes)
    node = parent
  }

  return parts.join(' > ')
}

export function createAnchor(el) {
  if (!el || el.nodeType !== 1) return null

  const rect = el.getBoundingClientRect()
  const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140)

  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList].filter(Boolean).slice(0, 8),
    cssPath: cssPath(el),
    text,
    nth: nthOfType(el),
    rect: {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left + window.scrollX),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    },
  }
}

export function describeAnchor(anchor) {
  if (!anchor) return 'element'
  const id = anchor.id ? `#${anchor.id}` : ''
  const cls = (anchor.classes || []).slice(0, 2).map(name => `.${name}`).join('')
  const text = anchor.text ? ` “${anchor.text.slice(0, 40)}”` : ''
  return `${anchor.tag}${id}${cls}${text}`.trim()
}

export function resolveAnchor(anchor) {
  if (!anchor) return { el: null, orphaned: true }

  if (anchor.id) {
    const byId = document.getElementById(anchor.id)
    if (byId) return { el: byId, orphaned: false }
  }

  if (anchor.cssPath) {
    try {
      const byPath = document.querySelector(anchor.cssPath)
      if (byPath && byPath.tagName.toLowerCase() === anchor.tag)
        return { el: byPath, orphaned: false }
    }
    catch { /* invalid selector from an old DOM */ }
  }

  if (anchor.tag && anchor.text) {
    const candidates = [...document.querySelectorAll(anchor.tag)]
    const match = candidates.find(el =>
      (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 140) === anchor.text)
    if (match) return { el: match, orphaned: false }
  }

  return { el: null, orphaned: true }
}

function nthOfType(el) {
  if (!el.parentElement) return 1
  return [...el.parentElement.children]
    .filter(child => child.nodeName === el.nodeName)
    .indexOf(el) + 1
}

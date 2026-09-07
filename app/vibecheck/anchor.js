export function cssPath(el) {
  if (!(el instanceof Element)) return ''
  const parts = []
  let node = el

  while (node && node.nodeType === 1 && node !== document.body && node !== document.documentElement) {
    if (node.nodeName === 'VIS-BUG' || node.id === 'vibecheck-toast')
      break

    let selector = node.nodeName.toLowerCase()
    if (node.id && !/^\d/.test(node.id)) {
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
      .filter(name => name && !name.startsWith('visbug'))
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
  const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140)
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList].filter(Boolean).slice(0, 8),
    cssPath: cssPath(el),
    text,
  }
}

export function describeAnchor(anchor) {
  if (!anchor) return 'element'
  const id = anchor.id ? `#${anchor.id}` : ''
  const cls = (anchor.classes || []).slice(0, 2).map(name => `.${name}`).join('')
  const text = anchor.text ? ` “${anchor.text.slice(0, 40)}”` : ''
  return `${anchor.tag}${id}${cls}${text}`.trim()
}

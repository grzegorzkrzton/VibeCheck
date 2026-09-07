const COMPONENT_ATTRS = [
  'data-component',
  'data-testid',
  'data-cy',
  'data-test',
  'data-qa',
  'data-slot',
]

const SECTION_TAGS = new Set(['HEADER', 'NAV', 'MAIN', 'FOOTER', 'SECTION', 'ARTICLE', 'ASIDE'])

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

function readComponentHint(el) {
  if (!el || el.nodeType !== 1) return null

  for (const attr of COMPONENT_ATTRS) {
    const value = el.getAttribute(attr)
    if (value)
      return { name: value, source: attr }
  }

  for (const cls of el.classList) {
    if (/^[A-Z][a-zA-Z0-9]*$/.test(cls))
      return { name: cls, source: 'class' }
  }

  return null
}

export function getComponentHint(el) {
  if (!el || el.nodeType !== 1) return null

  let node = el
  for (let depth = 0; node && depth < 5; depth++, node = node.parentElement) {
    const hint = readComponentHint(node)
    if (hint)
      return depth === 0 ? hint : { ...hint, source: `${hint.source} (ancestor)` }
  }

  return null
}

export function getSectionContext(el) {
  if (!el || el.nodeType !== 1) return null

  let node = el
  while (node && node !== document.body && node !== document.documentElement) {
    if (node.id && !/^\d/.test(node.id)) {
      const tag = node.tagName.toLowerCase()
      return {
        label: `${tag}#${node.id}`,
        tag,
        id: node.id,
      }
    }

    if (SECTION_TAGS.has(node.tagName)) {
      const tag = node.tagName.toLowerCase()
      const cls = [...node.classList].find(name => name && !name.startsWith('visbug'))
      return {
        label: cls ? `${tag}.${cls}` : tag,
        tag,
        id: null,
      }
    }

    node = node.parentElement
  }

  return { label: 'Page', tag: 'body', id: null }
}

export function createAnchor(el) {
  if (!el || el.nodeType !== 1) return null
  const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140)
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id || null,
    classes: [...el.classList].filter(name => name && !name.startsWith('visbug')).slice(0, 12),
    cssPath: cssPath(el),
    text,
    role: el.getAttribute('role') || null,
    ariaLabel: el.getAttribute('aria-label') || null,
    componentHint: getComponentHint(el),
    section: getSectionContext(el),
  }
}

export function describeAnchor(anchor) {
  if (!anchor) return 'element'
  const id = anchor.id ? `#${anchor.id}` : ''
  const cls = (anchor.classes || []).slice(0, 2).map(name => `.${name}`).join('')
  const text = anchor.text ? ` “${anchor.text.slice(0, 40)}”` : ''
  return `${anchor.tag}${id}${cls}${text}`.trim()
}

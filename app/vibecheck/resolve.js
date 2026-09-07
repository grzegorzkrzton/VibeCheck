import { isSelectorValid } from '../utilities/'

function isPageElement(el) {
  if (!el || el.nodeType !== 1) return false
  const name = el.nodeName
  if (name === 'VIS-BUG' || name.startsWith('VISBUG-') || name.startsWith('VIBECHECK-'))
    return false
  if (el.id === 'vibecheck-toast' || el.id === 'vibecheck-layer' || el.id === 'vibecheck-toolbar-tip')
    return false
  return true
}

function textOf(el) {
  return (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim()
}

export function resolveAnchor(anchor) {
  if (!anchor) return { el: null, orphaned: true }

  if (anchor.id && !/^\d/.test(anchor.id)) {
    const byId = document.getElementById(anchor.id)
    if (isPageElement(byId)) return { el: byId, orphaned: false }
  }

  if (anchor.cssPath && isSelectorValid(anchor.cssPath)) {
    try {
      const found = document.querySelector(anchor.cssPath)
      if (isPageElement(found)) return { el: found, orphaned: false }
    }
    catch { /* invalid in this document */ }
  }

  if (anchor.tag && anchor.text) {
    const needle = anchor.text.slice(0, 40)
    let nodes = []
    try {
      nodes = [...document.querySelectorAll(anchor.tag)]
    }
    catch {
      nodes = []
    }

    const match = nodes.find(el => {
      if (!isPageElement(el)) return false
      const text = textOf(el)
      if (!text) return false
      return text === anchor.text
        || text.includes(needle)
        || anchor.text.includes(text.slice(0, 40))
    })

    if (match) return { el: match, orphaned: false }
  }

  return { el: null, orphaned: true }
}

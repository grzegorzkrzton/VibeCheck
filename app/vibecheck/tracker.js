import { isOffBounds } from '../utilities/'
import { createAnchor, cssPath, describeAnchor } from './anchor'

const STYLE_PROPS = [
  'color', 'background-color', 'font-size', 'font-weight', 'font-family',
  'line-height', 'letter-spacing', 'text-align', 'margin', 'padding',
  'width', 'height', 'border', 'border-radius', 'box-shadow', 'opacity',
  'display', 'gap', 'justify-content', 'align-items', 'position',
  'top', 'left', 'right', 'bottom', 'transform',
]

const originals = new Map()

function isVibeCheckNode(node) {
  if (!node || node.nodeType !== 1) return false
  return node.id === 'vibecheck-toast'
    || node.nodeName.startsWith('VISBUG-')
    || node.nodeName === 'VIS-BUG'
    || node.closest?.('vis-bug, #vibecheck-toast')
}

export function snapshotElement(el) {
  if (!el || el.nodeType !== 1) return null
  const computed = getComputedStyle(el)
  const styles = {}
  for (const prop of STYLE_PROPS)
    styles[prop] = computed.getPropertyValue(prop)
  return {
    text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 240),
    styles,
  }
}

export function captureOriginal(el) {
  if (!el || isOffBounds(el) || isVibeCheckNode(el)) return
  const key = cssPath(el) || String(el)
  if (originals.has(key)) return
  originals.set(key, {
    el,
    anchor: createAnchor(el),
    original: snapshotElement(el),
  })
}

export function startChangeTracker(selectorEngine) {
  if (selectorEngine?.onSelectedUpdate)
    selectorEngine.onSelectedUpdate(els => els.forEach(captureOriginal), false)

  return () => originals.clear()
}

export function getTrackedChanges() {
  const changes = []

  for (const record of originals.values()) {
    const el = record.el?.isConnected ? record.el : null
    const current = el ? snapshotElement(el) : null
    if (!current) continue

    const diffs = []
    if (record.original.text !== current.text) {
      diffs.push({ kind: 'text', from: record.original.text, to: current.text })
    }

    for (const prop of STYLE_PROPS) {
      const from = (record.original.styles[prop] || '').trim()
      const to = (current.styles[prop] || '').trim()
      if (from && to && from !== to)
        diffs.push({ kind: 'style', prop, from, to })
    }

    if (diffs.length) {
      changes.push({
        anchor: record.anchor,
        label: describeAnchor(record.anchor),
        diffs,
      })
    }
  }

  return changes
}

import { createAnchor, resolveAnchor } from './anchor'
import { handoffRequest } from './bridge'
import { extractMentions } from './mentions'
import { closeComposer, openComposer } from '../components/handoff/composer.element'
import { showToast } from '../components/handoff/toast.element'
import '../components/handoff/pin.element'
import '../components/handoff/annotation.element'
import '../components/handoff/panel.element'
import '../components/handoff/toast.element'

let layer = {
  panel: null,
  comments: [],
  annotations: [],
  suggestions: [],
  prototype: null,
  user: null,
  isOwner: false,
}

export function mountReviewLayer() {
  unmountReviewLayer()
  layer.panel = document.createElement('handoff-panel')
  document.documentElement.appendChild(layer.panel)
  layer.panel.addEventListener('handoff-panel-action', onPanelAction)
  document.addEventListener('handoff-pin-action', onPinAction)
  document.addEventListener('handoff-annotation-delete', onAnnotationDelete)
  window.addEventListener('scroll', reposition, true)
  window.addEventListener('resize', reposition)
  refreshReviewLayer()
  return unmountReviewLayer
}

export function unmountReviewLayer() {
  closeComposer()
  document.querySelectorAll('handoff-pin, handoff-annotation, handoff-panel, handoff-composer, handoff-toast')
    .forEach(node => node.remove())
  document.removeEventListener('handoff-pin-action', onPinAction)
  document.removeEventListener('handoff-annotation-delete', onAnnotationDelete)
  window.removeEventListener('scroll', reposition, true)
  window.removeEventListener('resize', reposition)
  layer = { panel: null, comments: [], annotations: [], suggestions: [], prototype: null, user: null, isOwner: false }
}

export async function refreshReviewLayer() {
  const auth = await handoffRequest('HANDOFF_AUTH_STATUS')
  layer.user = auth.user || null

  const [commentsRes, notesRes, copyRes] = await Promise.all([
    handoffRequest('HANDOFF_COMMENTS_LIST'),
    handoffRequest('HANDOFF_ANNOTATIONS_LIST'),
    handoffRequest('HANDOFF_SUGGESTIONS_LIST'),
  ])

  if (!commentsRes.ok) {
    updatePanel()
    return
  }

  layer.prototype = commentsRes.prototype
  layer.comments = decorate(commentsRes.comments || [])
  layer.annotations = decorate(notesRes.annotations || [])
  layer.suggestions = decorate(copyRes.suggestions || [])
  layer.isOwner = Boolean(copyRes.isOwner)
  drawOverlays()
  updatePanel()
}

function decorate(items) {
  return items.map(item => {
    const resolved = resolveAnchor(item.anchor)
    return { ...item, el: resolved.el, orphaned: resolved.orphaned }
  })
}

function drawOverlays() {
  document.querySelectorAll('handoff-pin, handoff-annotation').forEach(node => node.remove())

  const roots = layer.comments.filter(item => !item.parent_id)
  roots.forEach((comment, index) => {
    const pin = document.createElement('handoff-pin')
    pin.data = {
      ...comment,
      index: index + 1,
      replies: layer.comments.filter(item => item.parent_id === comment.id),
    }
    document.documentElement.appendChild(pin)
    positionOnAnchor(pin, comment, { dx: -8, dy: -8 })
  })

  layer.annotations.forEach(note => {
    const callout = document.createElement('handoff-annotation')
    callout.data = note
    document.documentElement.appendChild(callout)
    positionOnAnchor(callout, note, { dx: 8, dy: 0 })
  })
}

function positionOnAnchor(node, item, { dx = 0, dy = 0 } = {}) {
  const rect = item.el
    ? item.el.getBoundingClientRect()
    : {
        top: Math.max(8, (item.anchor?.rect?.top || 80) - window.scrollY),
        left: item.anchor?.rect?.left || 80,
        right: (item.anchor?.rect?.left || 80) + 40,
      }
  node.style.position = 'fixed'
  node.style.top = `${rect.top + dy}px`
  node.style.left = `${(item.el ? rect.left : rect.left) + dx}px`
  if (item.el)
    node.style.left = `${rect.right + dx}px`
}

function reposition() {
  drawOverlays()
}

function updatePanel() {
  if (!layer.panel) return
  layer.panel.state = {
    user: layer.user,
    comments: layer.comments,
    annotations: layer.annotations,
    suggestions: layer.suggestions,
    isOwner: layer.isOwner,
  }
}

export function beginComment(el) {
  if (!el) return showToast('Select an element first')
  openComposer({
    mode: 'comment',
    target: el,
    hint: 'Saved to this prototype URL. Mentions like @name notify teammates after SSO is on.',
    onSubmit: async ({ body }) => {
      const result = await handoffRequest('HANDOFF_COMMENTS_CREATE', {
        body,
        mentions: extractMentions(body),
        anchor: createAnchor(el),
      })
      if (!result.ok) return showToast(result.error)
      showToast('Comment saved')
      refreshReviewLayer()
    },
  })
}

export function beginAnnotation(el) {
  if (!el) return showToast('Select an element first')
  openComposer({
    mode: 'annotate',
    target: el,
    onSubmit: async ({ body, kind }) => {
      const result = await handoffRequest('HANDOFF_ANNOTATIONS_CREATE', {
        body,
        kind,
        anchor: createAnchor(el),
      })
      if (!result.ok) return showToast(result.error)
      showToast('Note added')
      refreshReviewLayer()
    },
  })
}

export function beginContentSuggestion(el) {
  if (!el) return showToast('Select a text element first')
  const originalText = (el.innerText || '').replace(/\s+/g, ' ').trim()
  openComposer({
    mode: 'content',
    target: el,
    originalText,
    onSubmit: async ({ suggested, rationale, original }) => {
      const result = await handoffRequest('HANDOFF_SUGGESTIONS_CREATE', {
        original_text: original || originalText,
        suggested_text: suggested,
        rationale,
        anchor: createAnchor(el),
      })
      if (!result.ok) return showToast(result.error)
      showToast('Copy suggestion sent to the owner')
      refreshReviewLayer()
    },
  })
}

async function onPanelAction(event) {
  const { action, id, status } = event.detail
  if (action === 'refresh') return refreshReviewLayer()
  if (action === 'reply') return replyTo(id)
  if (action === 'resolve') return toggleResolve(id)
  if (action === 'delete-annotation') {
    await handoffRequest('HANDOFF_ANNOTATIONS_DELETE', { id })
    return refreshReviewLayer()
  }
  if (action === 'review') {
    const result = await handoffRequest('HANDOFF_SUGGESTIONS_REVIEW', { id, status })
    showToast(result.ok ? `Marked ${status}` : result.error)
    return refreshReviewLayer()
  }
}

function onPinAction(event) {
  const { action, comment } = event.detail
  if (action === 'reply') replyTo(comment.id, comment.el)
  if (action === 'resolve') toggleResolve(comment.id)
}

async function onAnnotationDelete(event) {
  await handoffRequest('HANDOFF_ANNOTATIONS_DELETE', { id: event.detail.id })
  refreshReviewLayer()
}

function replyTo(id, target) {
  const parent = layer.comments.find(item => item.id === id)
  const el = target || parent?.el || layer.panel
  openComposer({
    mode: 'reply',
    target: el,
    onSubmit: async ({ body }) => {
      const result = await handoffRequest('HANDOFF_COMMENTS_CREATE', {
        parent_id: id,
        body,
        mentions: extractMentions(body),
        anchor: parent?.anchor || createAnchor(el),
      })
      if (!result.ok) return showToast(result.error)
      refreshReviewLayer()
    },
  })
}

async function toggleResolve(id) {
  const comment = layer.comments.find(item => item.id === id)
  const result = await handoffRequest('HANDOFF_COMMENTS_UPDATE', {
    id,
    patch: { resolved: !comment?.resolved },
  })
  if (!result.ok) showToast(result.error)
  refreshReviewLayer()
}

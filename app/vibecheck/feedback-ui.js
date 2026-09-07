import hotkeys from 'hotkeys-js'
import { createAnchor, describeAnchor } from './anchor'
import { resolveAnchor } from './resolve'
import { feedbackStyles } from './feedback-styles'
import {
  addNotification,
  getAuthorName,
  loadStore,
  parseMentions,
  removeComment,
  removeSuggestion,
  setAuthorName,
  uid,
  upsertComment,
  upsertSuggestion,
} from './storage'

const LAYER_ID = 'vibecheck-layer'
const STYLE_ID = 'vibecheck-feedback-styles'

const KIND_LABEL = {
  implement: 'Implement',
  warning: 'Warning',
  question: 'Question',
}

const state = {
  comments: [],
  suggestions: [],
  open: null,
  draft: null,
  filter: 'all',
  hideResolved: true,
  mode: 'browse',
  previewId: null,
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = feedbackStyles
  document.documentElement.appendChild(style)
}

function ensureLayer() {
  ensureStyles()
  let layer = document.getElementById(LAYER_ID)
  if (!layer) {
    layer = document.createElement('div')
    layer.id = LAYER_ID
    document.documentElement.appendChild(layer)
    layer.addEventListener('click', onLayerClick)
    layer.addEventListener('input', onLayerInput)
    layer.addEventListener('keydown', event => event.stopPropagation())
  }
  return layer
}

function commentNumber(comment) {
  const roots = state.comments
    .filter(item => !item.parentId)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
  const index = roots.findIndex(item => item.id === comment.id)
  return index >= 0 ? index + 1 : '•'
}

function visibleItems() {
  const comments = state.comments.filter(item => !item.parentId)
  const suggestions = state.suggestions
  const all = [
    ...comments.map(item => ({ kind: 'comment', item })),
    ...suggestions.map(item => ({ kind: 'suggestion', item })),
  ]

  return all.filter(({ kind, item }) => {
    if (state.hideResolved && (item.resolved || item.status === 'approved' || item.status === 'rejected'))
      return false
    if (state.filter === 'notes') return kind === 'comment' && item.type !== 'annotation'
    if (state.filter === 'annotations') return kind === 'comment' && item.type === 'annotation'
    if (state.filter === 'content') return kind === 'suggestion'
    return true
  })
}

function repliesFor(id) {
  return state.comments
    .filter(item => item.parentId === id)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
}

function currentOpen() {
  if (state.draft) return { kind: 'draft', item: state.draft }
  if (!state.open) return null
  const comment = state.comments.find(item => item.id === state.open.id)
  if (comment) return { kind: 'comment', item: comment }
  const suggestion = state.suggestions.find(item => item.id === state.open.id)
  if (suggestion) return { kind: 'suggestion', item: suggestion }
  return null
}

function pinTarget(item) {
  return resolveAnchor(item.anchor)
}

function placePin(node, el) {
  const rect = el.getBoundingClientRect()
  node.style.top = `${Math.round(rect.top + 8)}px`
  node.style.left = `${Math.round(rect.left + 8)}px`
}

function placeCard(card, el) {
  const rect = el?.getBoundingClientRect?.() || { top: 80, right: 40, bottom: 80 }
  const top = Math.min(Math.max(8, rect.top), window.innerHeight - 320)
  let left = (rect.right || 40) + 12
  if (left + 312 > window.innerWidth)
    left = Math.max(8, (rect.left || 40) - 312)
  card.style.top = `${Math.round(top)}px`
  card.style.left = `${Math.round(left)}px`
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function typeLabel(item) {
  if (item.type === 'annotation')
    return `Annotation · ${KIND_LABEL[item.kind] || 'Implement'}`
  if (item.status) return `Content · ${item.status}`
  return 'Note'
}

function renderCard(open) {
  if (!open) return ''
  const { kind, item } = open
  const author = getAuthorName()

  if (kind === 'draft' || (kind === 'comment' && item._editing)) {
    const isAnnotation = item.type === 'annotation'
    const isSuggestion = kind === 'draft' && item.recordType === 'suggestion'
    return `
      <div class="vc-card" data-card="${item.id}">
        <div class="vc-card-head">
          ${isSuggestion ? `<strong>Content suggestion</strong>` : `
            <div class="vc-types">
              <button type="button" data-action="set-type" data-type="note" aria-pressed="${!isAnnotation}">Note</button>
              <button type="button" data-action="set-type" data-type="annotation" aria-pressed="${isAnnotation}">Annotation for devs</button>
            </div>
          `}
          <button type="button" class="vc-close" data-action="close" aria-label="Close">×</button>
        </div>
        ${!isSuggestion && isAnnotation ? `
          <div class="vc-kinds">
            <button type="button" data-action="set-kind" data-kind="implement" aria-pressed="${item.kind === 'implement'}">Implement</button>
            <button type="button" data-action="set-kind" data-kind="warning" aria-pressed="${item.kind === 'warning'}">Warning</button>
            <button type="button" data-action="set-kind" data-kind="question" aria-pressed="${item.kind === 'question'}">Question</button>
          </div>
        ` : ''}
        <div class="vc-meta">${escapeHtml(describeAnchor(item.anchor))}</div>
        ${isSuggestion ? `
          <textarea data-field="suggestedText" placeholder="Suggested copy">${escapeHtml(item.suggestedText || '')}</textarea>
          <textarea data-field="rationale" placeholder="Why this change? (optional)">${escapeHtml(item.rationale || '')}</textarea>
        ` : `
          <textarea data-field="body" placeholder="${isAnnotation ? 'What should engineering know?' : 'Write a note…'}">${escapeHtml(item.body || '')}</textarea>
        `}
        <input type="text" data-field="authorName" value="${escapeHtml(author)}" placeholder="Your name">
        <div class="vc-actions">
          <button type="button" data-action="cancel">Cancel</button>
          ${isSuggestion ? `<button type="button" data-action="preview">Preview</button>` : ''}
          <button type="button" class="primary" data-action="save">Save</button>
        </div>
      </div>
    `
  }

  if (kind === 'suggestion') {
    return `
      <div class="vc-card" data-card="${item.id}">
        <div class="vc-card-head">
          <strong>Content suggestion</strong>
          <button type="button" class="vc-close" data-action="close" aria-label="Close">×</button>
        </div>
        <div class="vc-meta">${escapeHtml(item.authorName || 'You')} · ${escapeHtml(typeLabel(item))}${item._orphaned ? '<span class="vc-badge">Orphaned</span>' : ''}</div>
        <div class="vc-body"><b>From</b><br>${escapeHtml(item.originalText || '(empty)')}</div>
        <div class="vc-body"><b>To</b><br>${escapeHtml(item.suggestedText || '(empty)')}</div>
        ${item.rationale ? `<div class="vc-body">${escapeHtml(item.rationale)}</div>` : ''}
        <div class="vc-actions">
          <button type="button" data-action="preview">Preview</button>
          ${item.status === 'pending' ? `
            <button type="button" data-action="reject" class="danger">Reject</button>
            <button type="button" class="primary" data-action="approve">Approve</button>
          ` : `<button type="button" data-action="delete" class="danger">Delete</button>`}
        </div>
      </div>
    `
  }

  const replies = repliesFor(item.id)
  return `
    <div class="vc-card" data-card="${item.id}">
      <div class="vc-card-head">
        <strong>${escapeHtml(typeLabel(item))}</strong>
        <button type="button" class="vc-close" data-action="close" aria-label="Close">×</button>
      </div>
      <div class="vc-meta">${escapeHtml(item.authorName || 'You')} · ${escapeHtml(describeAnchor(item.anchor))}${item._orphaned ? '<span class="vc-badge">Orphaned</span>' : ''}${item.resolved ? '<span class="vc-badge">Resolved</span>' : ''}</div>
      <div class="vc-body">${escapeHtml(item.body || '')}</div>
      ${replies.length ? `<div class="vc-thread">${replies.map(reply => `
        <div class="vc-reply"><b>${escapeHtml(reply.authorName || 'You')}</b>${escapeHtml(reply.body || '')}</div>
      `).join('')}</div>` : ''}
      <textarea data-field="reply" placeholder="Reply… use @name to mention"></textarea>
      <div class="vc-actions">
        <button type="button" data-action="delete" class="danger">Delete</button>
        <button type="button" data-action="resolve">${item.resolved ? 'Reopen' : 'Resolve'}</button>
        <button type="button" class="primary" data-action="reply">Reply</button>
      </div>
    </div>
  `
}

function renderPanel() {
  const items = visibleItems()
  const filter = state.filter
  return `
    <aside class="vc-panel">
      <div class="vc-panel-head">
        <span>VibeCheck</span>
        <button type="button" data-action="toggle-resolved">${state.hideResolved ? 'Show resolved' : 'Hide resolved'}</button>
      </div>
      <div class="vc-filters">
        <button type="button" data-action="filter" data-filter="all" aria-pressed="${filter === 'all'}">All</button>
        <button type="button" data-action="filter" data-filter="notes" aria-pressed="${filter === 'notes'}">Notes</button>
        <button type="button" data-action="filter" data-filter="annotations" aria-pressed="${filter === 'annotations'}">Annotations</button>
        <button type="button" data-action="filter" data-filter="content" aria-pressed="${filter === 'content'}">Content</button>
      </div>
      ${items.length ? items.map(({ kind, item }) => `
        <button type="button" class="vc-item" data-action="open" data-id="${item.id}" data-kind="${kind}" data-open="${state.open?.id === item.id}">
          <b>${escapeHtml(kind === 'suggestion' ? 'Content' : typeLabel(item))}${item._orphaned ? '<span class="vc-badge">Orphaned</span>' : ''}</b>
          <span>${escapeHtml((kind === 'suggestion' ? item.suggestedText : item.body) || describeAnchor(item.anchor))}</span>
        </button>
      `).join('') : `<div class="vc-item"><span>No items yet. Press C and click an element to leave a note.</span></div>`}
    </aside>
  `
}

function renderPins() {
  return visibleItems().map(({ kind, item }) => {
    if (item._orphaned) return ''
    const label = kind === 'suggestion' ? 'S' : commentNumber(item)
    const type = kind === 'suggestion' ? 'suggestion' : (item.type || 'note')
    return `<button type="button" class="vc-pin" data-action="open" data-id="${item.id}" data-item="${kind}" data-type="${type}" data-kind="${item.kind || ''}" data-resolved="${Boolean(item.resolved)}" data-open="${state.open?.id === item.id}">${label}</button>`
  }).join('')
}

export function layoutFeedback() {
  const layer = document.getElementById(LAYER_ID)
  if (!layer) return
  const open = currentOpen()
  const card = layer.querySelector('.vc-card')
  if (open && card) {
    const resolved = open.item.anchor ? pinTarget(open.item) : { el: null }
    placeCard(card, resolved.el)
  }

  layer.querySelectorAll('.vc-pin[data-id]').forEach(pin => {
    const id = pin.dataset.id
    const record = state.comments.find(item => item.id === id) || state.suggestions.find(item => item.id === id)
    if (!record) return
    const { el, orphaned } = pinTarget(record)
    if (orphaned || !el) {
      pin.remove()
      return
    }
    placePin(pin, el)
  })
}

export function renderFeedback() {
  const layer = ensureLayer()
  const open = currentOpen()
  layer.innerHTML = `${renderPins()}${renderCard(open)}${renderPanel()}`
  layoutFeedback()
}

export async function refreshFeedback() {
  const store = await loadStore()
  state.comments = store.comments.map(item => {
    const { orphaned } = resolveAnchor(item.anchor)
    return { ...item, _orphaned: !item.parentId && orphaned }
  })
  state.suggestions = store.suggestions.map(item => {
    const { orphaned } = resolveAnchor(item.anchor)
    return { ...item, _orphaned: orphaned }
  })
  renderFeedback()
}

function findSelectedElement(els) {
  return [...els].reverse().find(el => el && el.nodeType === 1) || null
}

export function beginCommentDraft(el, { type = 'note' } = {}) {
  if (!el) return
  state.draft = {
    id: uid(),
    recordType: 'comment',
    type,
    kind: 'implement',
    body: '',
    resolved: false,
    parentId: null,
    anchor: createAnchor(el),
    createdAt: new Date().toISOString(),
    authorName: getAuthorName(),
  }
  state.open = { id: state.draft.id }
  renderFeedback()
}

export function beginSuggestionDraft(el) {
  if (!el) return
  const originalText = (el.innerText || '').replace(/\s+/g, ' ').trim()
  state.draft = {
    id: uid(),
    recordType: 'suggestion',
    originalText,
    suggestedText: originalText,
    rationale: '',
    status: 'pending',
    anchor: createAnchor(el),
    createdAt: new Date().toISOString(),
    authorName: getAuthorName(),
  }
  state.open = { id: state.draft.id }
  renderFeedback()
}

export function setFeedbackMode(mode) {
  state.mode = mode
}

function applySuggestionText(item, text) {
  const { el } = resolveAnchor(item.anchor)
  if (!el) return false
  if (!item._restoreText) item._restoreText = (el.innerText || '').replace(/\s+/g, ' ').trim()
  el.innerText = text
  return true
}

async function notifyMentions(body, context) {
  const mentions = parseMentions(body)
  for (const mention of mentions) {
    await addNotification({
      type: 'mention',
      mention,
      body,
      context,
    })
  }
}

async function onLayerClick(event) {
  const actionEl = event.target.closest('[data-action]')
  if (!actionEl) return
  event.preventDefault()
  event.stopPropagation()
  const action = actionEl.dataset.action

  if (action === 'filter') {
    state.filter = actionEl.dataset.filter
    renderFeedback()
    return
  }

  if (action === 'toggle-resolved') {
    state.hideResolved = !state.hideResolved
    renderFeedback()
    return
  }

  if (action === 'close' || action === 'cancel') {
    state.draft = null
    state.open = null
    renderFeedback()
    return
  }

  if (action === 'open') {
    state.draft = null
    state.open = { id: actionEl.dataset.id }
    renderFeedback()
    return
  }

  if (action === 'set-type' && state.draft) {
    state.draft.type = actionEl.dataset.type
    if (state.draft.type === 'annotation' && !state.draft.kind)
      state.draft.kind = 'implement'
    renderFeedback()
    return
  }

  if (action === 'set-kind' && state.draft) {
    state.draft.type = 'annotation'
    state.draft.kind = actionEl.dataset.kind
    renderFeedback()
    return
  }

  if (action === 'save' && state.draft) {
    const author = setAuthorName(state.draft.authorName || getAuthorName())
    if (state.draft.recordType === 'suggestion') {
      const saved = await upsertSuggestion({
        ...state.draft,
        authorName: author,
      })
      await addNotification({
        type: 'suggestion',
        body: saved.suggestedText,
        context: 'New content suggestion',
      })
    }
    else {
      const saved = await upsertComment({
        id: state.draft.id,
        type: state.draft.type || 'note',
        kind: state.draft.type === 'annotation' ? (state.draft.kind || 'implement') : null,
        body: state.draft.body || '',
        resolved: false,
        parentId: null,
        anchor: state.draft.anchor,
        createdAt: state.draft.createdAt,
        authorName: author,
      })
      await notifyMentions(saved.body, typeLabel(saved))
    }
    const id = state.draft.id
    state.draft = null
    state.open = { id }
    await refreshFeedback()
    return
  }

  const open = currentOpen()
  if (!open) return

  if (action === 'delete') {
    if (open.kind === 'suggestion') await removeSuggestion(open.item.id)
    else await removeComment(open.item.id)
    state.open = null
    await refreshFeedback()
    return
  }

  if (action === 'resolve' && open.kind === 'comment') {
    await upsertComment({ ...open.item, resolved: !open.item.resolved })
    await refreshFeedback()
    return
  }

  if (action === 'reply' && open.kind === 'comment') {
    const box = document.querySelector('#vibecheck-layer textarea[data-field="reply"]')
    const body = box?.value?.trim()
    if (!body) return
    await upsertComment({
      id: uid(),
      type: 'note',
      kind: null,
      body,
      resolved: false,
      parentId: open.item.id,
      anchor: open.item.anchor,
      createdAt: new Date().toISOString(),
      authorName: getAuthorName(),
    })
    await notifyMentions(body, `Reply on ${typeLabel(open.item)}`)
    await refreshFeedback()
    return
  }

  if (action === 'preview' && (open.kind === 'suggestion' || state.draft?.recordType === 'suggestion')) {
    const item = open.item
    applySuggestionText(item, item.suggestedText)
    state.previewId = item.id
    return
  }

  if (action === 'approve' && open.kind === 'suggestion') {
    applySuggestionText(open.item, open.item.suggestedText)
    await upsertSuggestion({ ...open.item, status: 'approved' })
    await addNotification({ type: 'suggestion-status', body: 'Suggestion approved', context: open.item.id })
    await refreshFeedback()
    return
  }

  if (action === 'reject' && open.kind === 'suggestion') {
    if (open.item._restoreText)
      applySuggestionText(open.item, open.item._restoreText)
    await upsertSuggestion({ ...open.item, status: 'rejected' })
    await addNotification({ type: 'suggestion-status', body: 'Suggestion rejected', context: open.item.id })
    await refreshFeedback()
    return
  }
}

function onLayerInput(event) {
  const field = event.target.dataset.field
  if (!field || !state.draft) return
  state.draft[field] = event.target.value
}

let installedFilter = false
function installHotkeyFilter() {
  if (installedFilter) return
  installedFilter = true
  const previous = hotkeys.filter
  hotkeys.filter = event => {
    const path = event.composedPath?.() || []
    if (path.some(node => node && (node.nodeName === 'TEXTAREA' || node.nodeName === 'INPUT' || node.isContentEditable)))
      return false
    if (typeof previous === 'function') return previous(event)
    return true
  }
}

export function startFeedbackLayer() {
  installHotkeyFilter()
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get('vibecheck:authorName', data => {
      if (data['vibecheck:authorName']) setAuthorName(data['vibecheck:authorName'])
    })
  }
  ensureLayer()
  refreshFeedback()
  window.addEventListener('scroll', layoutFeedback, true)
  window.addEventListener('resize', layoutFeedback)
  return () => {
    window.removeEventListener('scroll', layoutFeedback, true)
    window.removeEventListener('resize', layoutFeedback)
    document.getElementById(LAYER_ID)?.remove()
  }
}

import hotkeys from 'hotkeys-js'
import { createAnchor, describeAnchor } from './anchor'
import { resolveAnchor } from './resolve'
import { floatingPosition } from '../utilities'
import { convertDraftType as convertDraftTypeState, relativeTime } from './card-state'
import { feedbackStyles } from './feedback-styles'
import {
  KIND_LABEL,
  renderAnnotationCard,
  renderNoteCard,
  renderNotesPanel,
  renderNotesPanelItem,
  renderPin,
  renderReply,
  renderWordingCard,
} from './components'
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
const PANEL_LAYOUT_KEY = 'vibecheck:panelLayout'

const state = {
  comments: [],
  suggestions: [],
  open: null,
  draft: null,
  filter: 'all',
  search: '',
  hideResolved: true,
  mode: 'browse',
  previewId: null,
  typeMenuOpen: false,
  overflowOpen: false,
  submissionState: null,
  submitError: '',
  replyDraft: '',
  lastPointer: null,
  cardPosition: null,
  scheme: 'auto',
  panelLayout: {
    left: null,
    top: 16,
    collapsed: false,
  },
  drag: null,
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = feedbackStyles
  document.documentElement.appendChild(style)
}

function applyScheme(layer) {
  if (state.scheme === 'light' || state.scheme === 'dark')
    layer.dataset.scheme = state.scheme
  else
    delete layer.dataset.scheme
}

export function setFeedbackScheme(scheme) {
  state.scheme = scheme || 'auto'
  const layer = document.getElementById(LAYER_ID)
  if (layer) applyScheme(layer)
}

function ensureLayer() {
  ensureStyles()
  let layer = document.getElementById(LAYER_ID)
  if (!layer) {
    layer = document.createElement('div')
    layer.id = LAYER_ID
    applyScheme(layer)
    document.documentElement.appendChild(layer)
    layer.addEventListener('click', onLayerClick)
    layer.addEventListener('input', onLayerInput)
    layer.addEventListener('keydown', onLayerKeyDown)
    layer.addEventListener('pointerdown', onDragStart)
  }
  return layer
}

function loadPanelLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(PANEL_LAYOUT_KEY))
    if (!saved || typeof saved !== 'object') return
    state.panelLayout = {
      left: Number.isFinite(saved.left) ? saved.left : null,
      top: Number.isFinite(saved.top) ? saved.top : 16,
      collapsed: Boolean(saved.collapsed),
    }
  }
  catch { /* use defaults */ }
}

function savePanelLayout() {
  try {
    localStorage.setItem(PANEL_LAYOUT_KEY, JSON.stringify(state.panelLayout))
  }
  catch { /* quota / private mode */ }
}

function rememberPointer(event) {
  const target = event.target
  if (target?.closest?.(`#${LAYER_ID}, vis-bug, #vibecheck-toolbar-tip`)) return
  state.lastPointer = { x: event.clientX, y: event.clientY }
}

function commentNumber(comment) {
  const roots = state.comments
    .filter(item => !item.parentId && !item.parentSuggestionId)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
  const index = roots.findIndex(item => item.id === comment.id)
  return index >= 0 ? index + 1 : '•'
}

function threadNumber(record) {
  const roots = [
    ...state.comments.filter(item => !item.parentId && !item.parentSuggestionId),
    ...state.suggestions,
  ].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
  const index = roots.findIndex(item => item.id === record.id)
  return index >= 0 ? index + 1 : '•'
}

function visibleItems() {
  const comments = state.comments.filter(item => !item.parentId && !item.parentSuggestionId)
  const suggestions = state.suggestions
  const all = [
    ...comments.map(item => ({ kind: 'comment', item })),
    ...suggestions.map(item => ({ kind: 'suggestion', item })),
  ]

  const search = state.search.trim().toLocaleLowerCase()
  return all.filter(({ kind, item }) => {
    if (state.hideResolved && item.resolved)
      return false
    if (state.filter === 'notes') return kind === 'comment' && item.type !== 'annotation'
    if (state.filter === 'annotations') return kind === 'comment' && item.type === 'annotation'
    if (state.filter === 'content') return kind === 'suggestion'
    return true
  }).filter(({ kind, item }) => {
    if (!search) return true
    const replies = repliesFor(item.id, kind)
    return [
      item.authorName,
      item.body,
      item.suggestedText,
      item.originalText,
      item.rationale,
      describeAnchor(item.anchor),
      ...replies.flatMap(reply => [reply.authorName, reply.body]),
    ].some(value => String(value || '').toLocaleLowerCase().includes(search))
  })
}

function repliesFor(id, kind = 'comment') {
  return state.comments
    .filter(item => kind === 'suggestion' ? item.parentSuggestionId === id : item.parentId === id)
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

function clampPosition(left, top, width, height) {
  return {
    left: Math.min(Math.max(8, left), Math.max(8, window.innerWidth - width - 8)),
    top: Math.min(Math.max(8, top), Math.max(8, window.innerHeight - height - 8)),
  }
}

function placeCard(card, el) {
  if (state.cardPosition) {
    const position = clampPosition(
      state.cardPosition.left,
      state.cardPosition.top,
      card.offsetWidth || 300,
      card.offsetHeight || 300,
    )
    state.cardPosition = position
    card.style.top = `${Math.round(position.top)}px`
    card.style.left = `${Math.round(position.left)}px`
    return
  }

  const rect = el?.getBoundingClientRect?.() || {
    top: 80,
    left: 40,
    right: 40,
    width: 0,
    height: 0,
  }
  const position = floatingPosition(rect, {
    width: card.offsetWidth || 300,
    height: card.offsetHeight || 300,
  })
  card.dataset.side = position.side
  card.style.top = `${Math.round(position.top)}px`
  card.style.left = `${Math.round(position.left)}px`
}

function placePanel(panel) {
  if (!panel) return
  const fallbackLeft = window.innerWidth - (panel.offsetWidth || 280) - 16
  const position = clampPosition(
    state.panelLayout.left ?? fallbackLeft,
    state.panelLayout.top,
    panel.offsetWidth || 280,
    panel.offsetHeight || 48,
  )
  state.panelLayout.left = position.left
  state.panelLayout.top = position.top
  panel.style.left = `${Math.round(position.left)}px`
  panel.style.top = `${Math.round(position.top)}px`
  panel.style.right = 'auto'
}

function typeLabel(item) {
  if (item.type === 'annotation')
    return `Annotation · ${KIND_LABEL[item.kind] || 'Implement'}`
  if (item.status) return `Wording · ${item.status === 'applied' ? 'Applied' : 'Pending'}`
  return 'Comment'
}

function repliesHtml(item, kind = 'comment') {
  return repliesFor(item.id, kind).map(reply => renderReply({
    name: reply.authorName || 'You',
    timestamp: relativeTime(reply.createdAt || reply.updatedAt),
    body: reply.body || '',
  })).join('')
}

function renderCard(open) {
  if (!open) return ''
  const { kind, item } = open
  const author = getAuthorName()
  const composing = kind === 'draft' || (kind === 'comment' && item._editing)

  if (composing && item.recordType === 'suggestion') {
    return renderWordingCard({
      id: item.id,
      state: 'Compose',
      suggestedText: item.suggestedText || '',
      rationale: item.rationale || '',
      author,
      originalText: item.originalText || '',
      context: describeAnchor(item.anchor),
      typeMenuOpen: state.typeMenuOpen,
      inputState: state.submissionState,
      submitError: state.submitError,
    })
  }

  if (composing && item.type === 'annotation') {
    return renderAnnotationCard({
      id: item.id,
      state: 'Compose',
      kind: item.kind || 'implement',
      body: item.body || '',
      context: describeAnchor(item.anchor),
      typeMenuOpen: state.typeMenuOpen,
      submissionState: state.submissionState,
    })
  }

  if (composing) {
    return renderNoteCard({
      id: item.id,
      state: 'Compose',
      body: item.body || '',
      context: describeAnchor(item.anchor),
      typeMenuOpen: state.typeMenuOpen,
      submissionState: state.submissionState,
    })
  }

  if (kind === 'suggestion') {
    return renderWordingCard({
      id: item.id,
      state: 'Detail',
      suggestedText: item.suggestedText || '(empty)',
      rationale: item.rationale || '',
      originalText: item.originalText || '(empty)',
      author: item.authorName || 'You',
      context: describeAnchor(item.anchor),
      status: item.status,
      resolved: Boolean(item.resolved),
      repliesHtml: repliesHtml(item, 'suggestion'),
      overflowOpen: state.overflowOpen,
      reply: state.replyDraft,
    })
  }

  const sharedDetail = {
    id: item.id,
    state: 'Detail',
    body: item.body || '',
    author: item.authorName || 'You',
    timestamp: relativeTime(item.createdAt || item.updatedAt),
    context: describeAnchor(item.anchor),
    repliesHtml: repliesHtml(item),
    resolved: Boolean(item.resolved),
    overflowOpen: state.overflowOpen,
    reply: state.replyDraft,
  }

  if (item.type === 'annotation') {
    return renderAnnotationCard({
      ...sharedDetail,
      kind: item.kind || 'implement',
    })
  }

  return renderNoteCard(sharedDetail)
}

function renderPanel() {
  const items = visibleItems()
  const itemsHtml = items.length
    ? items.map(({ kind, item }) => {
      const replies = repliesFor(item.id, kind)
      return renderNotesPanelItem({
        id: item.id,
        kind,
        open: state.open?.id === item.id,
        number: threadNumber(item),
        context: describeAnchor(item.anchor),
        author: item.authorName || 'You',
        timestamp: relativeTime(item.createdAt || item.updatedAt),
        message: (kind === 'suggestion' ? item.suggestedText : item.body) || 'No message',
        participants: replies.map(reply => reply.authorName || 'You'),
        replyCount: replies.length,
        badges: item._orphaned ? renderBadge('Orphaned') : '',
      })
    }).join('')
    : `<div class="vc-panel-empty">${state.search ? 'No matching notes.' : 'No items yet. Press C and click an element to leave a note.'}</div>`

  return renderNotesPanel({
    collapsed: state.panelLayout.collapsed,
    hideResolved: state.hideResolved,
    filter: state.filter,
    search: state.search,
    itemsHtml,
  })
}

function renderPins() {
  return visibleItems().map(({ kind, item }) => {
    if (item._orphaned) return ''
    return renderPin({
      id: item.id,
      recordKind: kind,
      type: kind === 'suggestion' ? 'suggestion' : (item.type || 'note'),
      kind: item.kind || '',
      number: kind === 'suggestion' ? 'S' : commentNumber(item),
      open: state.open?.id === item.id,
      resolved: Boolean(item.resolved),
    })
  }).join('')
}

export function layoutFeedback() {
  const layer = document.getElementById(LAYER_ID)
  if (!layer) return
  placePanel(layer.querySelector('.vc-panel'))
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
  layer.querySelectorAll('.vc-avatar img').forEach(image => {
    if (image.complete && !image.naturalWidth) {
      image.remove()
      return
    }
    image.addEventListener('error', () => image.remove(), { once: true })
  })
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
  if (!state.open && !state.draft) {
    const match = location.hash.match(/^#vibecheck-thread=(.+)$/)
    const id = match ? decodeURIComponent(match[1]) : ''
    if (id && [...state.comments, ...state.suggestions].some(item => item.id === id))
      state.open = { id }
  }
  renderFeedback()
}

function findSelectedElement(els) {
  return [...els].reverse().find(el => el && el.nodeType === 1) || null
}

export function beginCommentDraft(el, { type = 'note' } = {}) {
  if (!el) return
  state.cardPosition = positionFromPointer(state.lastPointer)
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
  state.cardPosition = positionFromPointer(state.lastPointer)
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

function positionFromPointer(pointer) {
  if (!pointer) return null
  const position = floatingPosition({
    left: pointer.x,
    right: pointer.x,
    top: pointer.y,
    width: 0,
    height: 0,
  }, {
    width: 300,
    height: 320,
  })
  return {
    left: position.left,
    top: position.top,
  }
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

function onDragStart(event) {
  const handle = event.target.closest('[data-drag-handle]')
  if (!handle || event.target.closest('button, input, textarea, select, a')) return

  const kind = handle.dataset.dragHandle
  const element = kind === 'panel'
    ? handle.closest('.vc-panel')
    : handle.closest('.vc-card')
  if (!element) return

  const rect = element.getBoundingClientRect()
  state.drag = {
    kind,
    element,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top,
  }

  element.dataset.dragging = 'true'
  event.preventDefault()
  event.stopPropagation()
  document.addEventListener('pointermove', onDragMove, true)
  document.addEventListener('pointerup', onDragEnd, true)
  document.addEventListener('pointercancel', onDragEnd, true)
}

function onDragMove(event) {
  if (!state.drag) return
  const { element, offsetX, offsetY, kind } = state.drag
  const position = clampPosition(
    event.clientX - offsetX,
    event.clientY - offsetY,
    element.offsetWidth,
    element.offsetHeight,
  )

  element.style.left = `${Math.round(position.left)}px`
  element.style.top = `${Math.round(position.top)}px`
  element.style.right = 'auto'

  if (kind === 'panel') {
    state.panelLayout.left = position.left
    state.panelLayout.top = position.top
  }
  else {
    state.cardPosition = position
  }

  event.preventDefault()
}

function onDragEnd() {
  if (!state.drag) return
  state.drag.element.removeAttribute('data-dragging')
  if (state.drag.kind === 'panel') savePanelLayout()
  state.drag = null
  document.removeEventListener('pointermove', onDragMove, true)
  document.removeEventListener('pointerup', onDragEnd, true)
  document.removeEventListener('pointercancel', onDragEnd, true)
}

function resetTransientCardState() {
  state.typeMenuOpen = false
  state.overflowOpen = false
  state.submissionState = null
  state.submitError = ''
  state.replyDraft = ''
}

function renderAndFocus(selector) {
  renderFeedback()
  requestAnimationFrame(() => document.querySelector(selector)?.focus())
}

export function convertDraftType(draft, cardType) {
  const { el } = resolveAnchor(draft.anchor)
  const originalText = (el?.innerText || '').replace(/\s+/g, ' ').trim()
  return convertDraftTypeState(draft, cardType, originalText)
}

async function submitDraft() {
  if (!state.draft) return
  const isSuggestion = state.draft.recordType === 'suggestion'
  const value = isSuggestion ? state.draft.suggestedText : state.draft.body
  if (!value?.trim()) {
    state.submissionState = isSuggestion ? 'Error - First' : null
    state.submitError = isSuggestion ? 'Add suggested copy before sending.' : ''
    renderAndFocus(`[data-field="${isSuggestion ? 'suggestedText' : 'body'}"]`)
    return
  }
  state.submissionState = 'Submitting'
  state.submitError = ''
  renderFeedback()
  try {
    const authorName = getAuthorName()
    if (isSuggestion) {
      const saved = await upsertSuggestion({
        ...state.draft,
        status: 'pending',
        resolved: false,
        authorName,
      })
      await addNotification({
        type: 'suggestion',
        body: saved.suggestedText,
        context: 'New content suggestion',
      })
    }
    else {
      const saved = await upsertComment({
        ...state.draft,
        type: state.draft.type || 'note',
        kind: state.draft.type === 'annotation' ? (state.draft.kind || 'implement') : null,
        resolved: false,
        parentId: null,
        parentSuggestionId: null,
        authorName,
      })
      await notifyMentions(saved.body, typeLabel(saved))
    }
    const id = state.draft.id
    state.draft = null
    state.open = { id }
    resetTransientCardState()
    await refreshFeedback()
  }
  catch (error) {
    state.submissionState = 'Submit failed'
    state.submitError = error?.message || 'Could not send. Your text is still here.'
    renderAndFocus('[data-action="retry-send"]')
  }
}

async function onLayerClick(event) {
  const actionEl = event.target.closest('[data-action]')
  if (!actionEl) {
    if (state.typeMenuOpen || state.overflowOpen) {
      state.typeMenuOpen = false
      state.overflowOpen = false
      renderFeedback()
    }
    return
  }
  event.preventDefault()
  event.stopPropagation()
  const action = actionEl.dataset.action

  if (action === 'filter') state.filter = actionEl.dataset.filter
  else if (action === 'cycle-filter') {
    const filters = ['all', 'notes', 'annotations', 'content']
    state.filter = filters[(filters.indexOf(state.filter) + 1) % filters.length]
  }
  else if (action === 'toggle-resolved') state.hideResolved = !state.hideResolved
  else if (action === 'toggle-panel') {
    state.panelLayout.collapsed = !state.panelLayout.collapsed
    savePanelLayout()
  }
  else if (action === 'close' || action === 'cancel') {
    state.draft = null
    state.open = null
    state.cardPosition = null
    resetTransientCardState()
  }
  else if (action === 'open') {
    state.draft = null
    state.open = { id: actionEl.dataset.id }
    state.cardPosition = positionFromPointer({ x: event.clientX, y: event.clientY })
    resetTransientCardState()
    const suggestion = state.suggestions.find(item => item.id === state.open.id)
    const comment = state.comments.find(item => item.id === state.open.id)
    const openedAt = new Date().toISOString()
    if (suggestion) {
      suggestion.readAt = openedAt
      await upsertSuggestion({ ...suggestion, readAt: openedAt })
    }
    else if (comment) {
      comment.readAt = openedAt
      await upsertComment({ ...comment, readAt: openedAt })
    }
  }
  else if (action === 'toggle-type-menu') {
    state.typeMenuOpen = !state.typeMenuOpen
    state.overflowOpen = false
    renderAndFocus(state.typeMenuOpen ? '.vc-type-menu [role^="menuitem"]' : '.vc-type-trigger')
    return
  }
  else if (action === 'set-card-type' && state.draft) {
    state.draft = convertDraftType(state.draft, actionEl.dataset.cardType)
    state.typeMenuOpen = false
    renderAndFocus('.vc-type-trigger')
    return
  }
  else if (action === 'set-kind' && state.draft) {
    state.draft.type = 'annotation'
    state.draft.kind = actionEl.dataset.annotationKind || actionEl.dataset.kind
  }
  else if ((action === 'send' || action === 'retry-send') && state.draft) {
    await submitDraft()
    return
  }
  else {
    const open = currentOpen()
    if (!open) return

    if (action === 'toggle-overflow') {
      state.overflowOpen = !state.overflowOpen
      state.typeMenuOpen = false
      renderAndFocus(state.overflowOpen ? '.vc-overflow-menu [role="menuitem"]' : '[data-action="toggle-overflow"]')
      return
    }
    if (action === 'delete') {
      if (open.kind === 'suggestion') await removeSuggestion(open.item.id)
      else await removeComment(open.item.id)
      state.open = null
      state.cardPosition = null
      resetTransientCardState()
      await refreshFeedback()
      return
    }
    if (action === 'resolve') {
      if (open.kind === 'suggestion')
        await upsertSuggestion({ ...open.item, resolved: !open.item.resolved })
      else
        await upsertComment({ ...open.item, resolved: !open.item.resolved })
      await refreshFeedback()
      return
    }
    if (action === 'reply') {
      const box = document.querySelector('#vibecheck-layer textarea[data-field="reply"]')
      const body = box?.value?.trim()
      if (!body) return
      await upsertComment({
        id: uid(),
        type: 'note',
        kind: null,
        body,
        resolved: false,
        parentId: open.kind === 'comment' ? open.item.id : null,
        parentSuggestionId: open.kind === 'suggestion' ? open.item.id : null,
        anchor: open.item.anchor,
        createdAt: new Date().toISOString(),
        authorName: getAuthorName(),
      })
      await notifyMentions(body, `Reply on ${typeLabel(open.item)}`)
      state.replyDraft = ''
      await refreshFeedback()
      renderAndFocus('[data-field="reply"]')
      return
    }
    if (action === 'apply-suggestion' && open.kind === 'suggestion') {
      if (!applySuggestionText(open.item, open.item.suggestedText)) return
      await upsertSuggestion({ ...open.item, status: 'applied' })
      await addNotification({ type: 'suggestion-status', body: 'Suggestion applied', context: open.item.id })
      await refreshFeedback()
      return
    }
    if (action === 'mark-unread') {
      const update = { ...open.item, readAt: null }
      if (open.kind === 'suggestion') await upsertSuggestion(update)
      else await upsertComment(update)
      state.overflowOpen = false
      await refreshFeedback()
      return
    }
    if (action === 'copy-link') {
      const url = new URL(location.href)
      url.hash = `vibecheck-thread=${encodeURIComponent(open.item.id)}`
      await navigator.clipboard?.writeText?.(url.href)
      state.overflowOpen = false
      renderAndFocus('[data-action="toggle-overflow"]')
      return
    }
  }
  renderFeedback()
}

function onLayerInput(event) {
  const field = event.target.dataset.field
  if (event.target.matches('textarea')) {
    event.target.style.height = 'auto'
    event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`
  }
  if (field === 'panel-search') {
    state.search = event.target.value
    const cursor = event.target.selectionStart
    renderFeedback()
    const search = document.querySelector('#vibecheck-layer [data-field="panel-search"]')
    search?.focus()
    search?.setSelectionRange?.(cursor, cursor)
    return
  }
  if (field === 'reply') {
    state.replyDraft = event.target.value
    const send = event.target.closest('.vc-field')?.querySelector('.vc-send')
    if (send) send.dataset.state = event.target.value.trim() ? 'Active' : 'Default'
    return
  }
  if (!field || !state.draft) return
  state.draft[field] = event.target.value
  state.submissionState = null
  state.submitError = ''
  if (field === 'body' || field === 'suggestedText') {
    const send = event.target.closest('.vc-field, .vc-combo-field')?.querySelector('.vc-send')
    if (send) send.dataset.state = event.target.value.trim() ? 'Active' : 'Default'
  }
}

function onLayerKeyDown(event) {
  event.stopPropagation()
  const menu = event.target.closest('[role="menu"]')
  if (event.key === 'Escape') {
    if (state.typeMenuOpen || state.overflowOpen) {
      const selector = state.typeMenuOpen ? '.vc-type-trigger' : '[data-action="toggle-overflow"]'
      state.typeMenuOpen = false
      state.overflowOpen = false
      renderAndFocus(selector)
    }
    return
  }
  if (menu && ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const items = [...menu.querySelectorAll('[role^="menuitem"]')]
    const current = items.indexOf(event.target)
    const index = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
    items[index]?.focus()
    return
  }
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    const combo = event.target.closest('.vc-combo-field')
    if (!combo) return
    event.preventDefault()
    combo.querySelector('[data-action="send"], [data-action="retry-send"]')?.click()
  }
}

function closeMenusOutside(event) {
  if (!state.typeMenuOpen && !state.overflowOpen) return
  if (event.target.closest?.('.vc-type-selector, .vc-overflow-menu, [data-action="toggle-overflow"]')) return
  state.typeMenuOpen = false
  state.overflowOpen = false
  renderFeedback()
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
  loadPanelLayout()
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get('vibecheck:authorName', data => {
      if (data['vibecheck:authorName']) setAuthorName(data['vibecheck:authorName'])
    })
  }
  ensureLayer()
  refreshFeedback()
  document.addEventListener('pointerdown', rememberPointer, true)
  document.addEventListener('pointerdown', closeMenusOutside, true)
  window.addEventListener('scroll', layoutFeedback, true)
  window.addEventListener('resize', layoutFeedback)
  return () => {
    onDragEnd()
    document.removeEventListener('pointerdown', rememberPointer, true)
    document.removeEventListener('pointerdown', closeMenusOutside, true)
    window.removeEventListener('scroll', layoutFeedback, true)
    window.removeEventListener('resize', layoutFeedback)
    document.getElementById(LAYER_ID)?.remove()
  }
}

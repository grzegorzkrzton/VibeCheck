import hotkeys from 'hotkeys-js'
import { createAnchor, describeAnchor } from './anchor'
import { resolveAnchor } from './resolve'
import { floatingPosition } from '../utilities'
import { convertDraftType as convertDraftTypeState, relativeTime } from './card-state'
import { figtreeFontFaceCss } from '../../design-system/generated/tokens.js'
import { isFeatureEnabled } from './release-plan'
import { feedbackStyles } from './feedback-styles'
import {
  KIND_LABEL,
  renderAnnotationCard,
  renderNoteCard,
  renderFilterMenu,
  renderNotesPanel,
  renderNotesPanelItem,
  renderOverflowMenu,
  renderPanelMoreMenu,
  renderPin,
  renderReply,
  renderTypeMenu,
  renderWordingCard,
} from './components'
import { cardIcon } from './card-icons.js'
import { groupPinsByElement, pinRowOrigin, pinRowPositions } from './pin-layout'
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
const PANEL_PREFS_KEY = 'vibecheck:panelPrefs'
const PANEL_EDGE_INSET = 40

const state = {
  comments: [],
  suggestions: [],
  open: null,
  draft: null,
  filter: 'all',
  search: '',
  sortBy: 'date',
  hideResolved: true,
  hideComments: false,
  mentionsOnly: false,
  mode: 'browse',
  previewId: null,
  typeMenuOpen: false,
  overflowOpen: false,
  filterMenuOpen: false,
  panelMoreOpen: false,
  submissionState: null,
  submitError: '',
  replyDraft: '',
  lastPointer: null,
  cardPosition: null,
  scheme: 'auto',
  panelLayout: {
    left: null,
    top: PANEL_EDGE_INSET,
    collapsed: false,
  },
  drag: null,
  motionCardId: null,
}

function extensionFontBaseUrl() {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.getURL)
      return chrome.runtime.getURL('fonts/figtree/')
  }
  catch (_) { /* ignore */ }
  return '/fonts/figtree/'
}

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  const fonts = figtreeFontFaceCss((file) => `${extensionFontBaseUrl()}${file}`)
  style.textContent = `${fonts}\n${feedbackStyles}`
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
    layer.setAttribute('popover', 'manual')
    applyScheme(layer)
    document.documentElement.appendChild(layer)
    layer.addEventListener('click', onLayerClick)
    layer.addEventListener('input', onLayerInput)
    layer.addEventListener('focusin', onLayerFocusIn)
    layer.addEventListener('focusout', onLayerFocusOut)
    layer.addEventListener('keydown', onLayerKeyDown)
    layer.addEventListener('pointerdown', onDragStart)
  }
  promoteFeedbackLayer(layer)
  return layer
}

/** Keep comment UI above selection popovers in the browser top layer. */
export function promoteFeedbackLayer(layer = document.getElementById(LAYER_ID)) {
  if (!layer?.showPopover) return
  try {
    if (layer.matches?.(':popover-open'))
      layer.hidePopover()
    layer.showPopover()
  }
  catch { /* unsupported / already transitioning */ }
}

function loadPanelPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(PANEL_PREFS_KEY))
    if (!saved || typeof saved !== 'object') return
    if (saved.sortBy === 'date' || saved.sortBy === 'unread')
      state.sortBy = saved.sortBy
    if (typeof saved.hideResolved === 'boolean')
      state.hideResolved = saved.hideResolved
    if (typeof saved.hideComments === 'boolean')
      state.hideComments = saved.hideComments
    if (typeof saved.mentionsOnly === 'boolean')
      state.mentionsOnly = saved.mentionsOnly
  }
  catch (_) { /* ignore */ }
}

function savePanelPrefs() {
  try {
    localStorage.setItem(PANEL_PREFS_KEY, JSON.stringify({
      sortBy: state.sortBy,
      hideResolved: state.hideResolved,
      hideComments: state.hideComments,
      mentionsOnly: state.mentionsOnly,
    }))
  }
  catch (_) { /* ignore */ }
}

function loadPanelLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(PANEL_LAYOUT_KEY))
    if (!saved || typeof saved !== 'object') return
    state.panelLayout = {
      left: Number.isFinite(saved.left) ? saved.left : null,
      top: Number.isFinite(saved.top) ? saved.top : PANEL_EDGE_INSET,
      collapsed: Boolean(saved.collapsed),
    }
  }
  catch { /* use defaults */ }
}

function dockPanelTopRight(panel) {
  const width = panel?.offsetWidth || (state.panelLayout.collapsed ? 150 : 280)
  state.panelLayout.left = window.innerWidth - width - PANEL_EDGE_INSET
  state.panelLayout.top = PANEL_EDGE_INSET
}

function anchorPanelTopRight(panel, { right, top }) {
  state.panelLayout.left = right - panel.offsetWidth
  state.panelLayout.top = top
}

function savePanelLayout() {
  try {
    localStorage.setItem(PANEL_LAYOUT_KEY, JSON.stringify(state.panelLayout))
  }
  catch { /* quota / private mode */ }
}

function prefersReducedMotion() {
  return typeof matchMedia === 'function'
    && matchMedia('(prefers-reduced-motion: reduce)').matches
}

function motionMs(kind = 'base') {
  if (prefersReducedMotion()) return 0
  if (kind === 'fast') return 140
  if (kind === 'panel') return 280
  return 200
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function leaveElements(selector) {
  const layer = document.getElementById(LAYER_ID)
  if (!layer) return
  const elements = [...layer.querySelectorAll(selector)]
  if (!elements.length) return
  if (prefersReducedMotion()) return
  elements.forEach(el => { el.dataset.leaving = 'true' })
  await wait(motionMs('fast'))
}

function applyPanelCollapsedState(panel, collapsed) {
  if (!panel) return
  panel.dataset.collapsed = String(collapsed)
  panel.dataset.state = collapsed ? 'Collapsed' : 'Expanded'
  const slot = panel.querySelector('.vc-panel-collapse')
  if (slot) {
    if (collapsed) slot.setAttribute('aria-hidden', 'true')
    else slot.removeAttribute('aria-hidden')
  }
  const btn = panel.querySelector('[data-action="toggle-panel"]')
  if (btn) {
    btn.innerHTML = cardIcon(collapsed ? 'arrowDiagonalOut' : 'arrowDiagonalIn', 16)
    btn.setAttribute('aria-label', collapsed ? 'Expand notes panel' : 'Collapse notes panel')
  }
  const search = panel.querySelector('[data-field="panel-search"]')
  if (search) {
    if (collapsed) search.setAttribute('tabindex', '-1')
    else search.removeAttribute('tabindex')
  }
}

function rememberPointer(event) {
  const target = event.target
  if (target?.closest?.(`#${LAYER_ID}, vibe-check, #vibecheck-toolbar-tip`)) return
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

function itemMatchesMentionsFilter({ kind, item }) {
  if (!state.mentionsOnly) return true
  const author = getAuthorName().toLowerCase()
  const bodies = [
    item.body,
    item.suggestedText,
    item.rationale,
    ...repliesFor(item.id, kind).map(reply => reply.body),
  ]
  const mentioned = bodies.some(body =>
    parseMentions(body || '').some(name => name.toLowerCase() === author),
  )
  return mentioned || repliesFor(item.id, kind).length > 0
}

function panelFilter() {
  if (!isFeatureEnabled('annotation') && state.filter === 'annotations')
    return 'all'
  return state.filter
}

function visibleItems() {
  const comments = state.comments.filter(item => !item.parentId && !item.parentSuggestionId)
  const suggestions = state.suggestions
  const all = [
    ...comments.map(item => ({ kind: 'comment', item })),
    ...suggestions.map(item => ({ kind: 'suggestion', item })),
  ]

  const search = state.search.trim().toLocaleLowerCase()
  const activeFilter = panelFilter()
  const filtered = all.filter(({ kind, item }) => {
    if (!isFeatureEnabled('annotation') && kind === 'comment' && item.type === 'annotation')
      return false
    if (state.hideResolved && item.resolved)
      return false
    if (state.hideComments && kind === 'comment' && item.type !== 'annotation')
      return false
    if (!itemMatchesMentionsFilter({ kind, item }))
      return false
    if (activeFilter === 'notes') return kind === 'comment' && item.type !== 'annotation'
    if (activeFilter === 'annotations') return kind === 'comment' && item.type === 'annotation'
    if (activeFilter === 'content') return kind === 'suggestion'
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

  const byDate = (a, b) => String(a.item.createdAt || a.item.updatedAt)
    .localeCompare(String(b.item.createdAt || b.item.updatedAt))
  if (state.sortBy === 'unread') {
    return filtered.sort((a, b) => {
      const aUnread = a.item.readAt ? 1 : 0
      const bUnread = b.item.readAt ? 1 : 0
      if (aUnread !== bUnread) return aUnread - bUnread
      return byDate(a, b)
    })
  }
  return filtered.sort(byDate)
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

function placePin(node, left, top) {
  node.style.top = `${Math.round(top)}px`
  node.style.left = `${Math.round(left)}px`
}

/** Spread every pin sharing an element into a horizontal row from its origin. */
function placePinRows(entries) {
  for (const [el, group] of groupPinsByElement(entries)) {
    const origin = pinRowOrigin(el.getBoundingClientRect())
    const lefts = pinRowPositions(group.length, {
      origin: origin.left,
      viewportWidth: window.innerWidth,
    })
    group.forEach((entry, index) => {
      entry.pin.dataset.rowIndex = String(index)
      placePin(entry.pin, lefts[index], origin.top)
    })
  }
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

function placeAnchoredMenu(menu, anchor, {
  gap = 4,
  padding = 8,
  align = 'start',
} = {}) {
  if (!menu || !anchor) return

  const anchorRect = anchor.getBoundingClientRect()
  const width = menu.offsetWidth || 168
  const height = menu.offsetHeight || 88
  const spaceBelow = window.innerHeight - anchorRect.bottom - padding
  const spaceAbove = anchorRect.top - padding
  const placeBelow = spaceBelow >= height || spaceBelow >= spaceAbove

  let left = align === 'end'
    ? anchorRect.right - width
    : anchorRect.left
  left = Math.min(
    Math.max(padding, left),
    Math.max(padding, window.innerWidth - width - padding),
  )

  const top = placeBelow
    ? anchorRect.bottom + gap
    : anchorRect.top - height - gap

  menu.dataset.side = placeBelow ? 'bottom' : 'top'
  menu.style.position = 'fixed'
  menu.style.top = `${Math.round(Math.min(
    Math.max(padding, top),
    Math.max(padding, window.innerHeight - height - padding),
  ))}px`
  menu.style.left = `${Math.round(left)}px`
  menu.style.right = 'auto'
  menu.style.bottom = 'auto'
}

function placeOpenMenus(layer) {
  // Menus use position:fixed + viewport coords. Keep them as direct layer
  // children so card transforms never become a fixed containing block.
  const mountMenu = (menuId, anchorSelector, align = 'end') => {
    const menu = layer.querySelector(`.vc-list-menu[data-menu="${menuId}"]`)
    const anchor = layer.querySelector(anchorSelector)
    if (!menu || !anchor) return
    if (menu.parentElement !== layer)
      layer.appendChild(menu)
    placeAnchoredMenu(menu, anchor, { align })
  }

  mountMenu('type', '.vc-type-trigger', 'start')
  mountMenu('overflow', '[data-action="toggle-overflow"]', 'end')
  mountMenu('filter', '[data-action="toggle-filter-menu"]', 'end')
  mountMenu('panel-more', '[data-action="panel-more"]', 'end')
}

function syncMenuTriggers(layer = document.getElementById(LAYER_ID)) {
  if (!layer) return
  const overflow = layer.querySelector('[data-action="toggle-overflow"]')
  if (overflow)
    overflow.setAttribute('aria-expanded', String(state.overflowOpen))
  const type = layer.querySelector('.vc-type-trigger')
  if (type && type.getAttribute('aria-expanded') != null)
    type.setAttribute('aria-expanded', String(state.typeMenuOpen))
  const filter = layer.querySelector('[data-action="toggle-filter-menu"]')
  if (filter)
    filter.setAttribute('aria-expanded', String(state.filterMenuOpen))
  const panelMore = layer.querySelector('[data-action="panel-more"]')
  if (panelMore)
    panelMore.setAttribute('aria-expanded', String(state.panelMoreOpen))
}

function mountLayerMenu(html) {
  const layer = ensureLayer()
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  const menu = template.content.firstElementChild
  if (!menu) return null
  layer.appendChild(menu)
  return menu
}

async function dismissLayerMenus({ focus } = {}) {
  const layer = document.getElementById(LAYER_ID)
  if (!layer) return
  const hadMenu = Boolean(layer.querySelector('.vc-list-menu'))
  if (hadMenu)
    await leaveElements('.vc-list-menu')
  layer.querySelectorAll('.vc-list-menu').forEach(el => el.remove())
  state.typeMenuOpen = false
  state.overflowOpen = false
  state.filterMenuOpen = false
  state.panelMoreOpen = false
  syncMenuTriggers(layer)
  if (focus)
    requestAnimationFrame(() => layer.querySelector(focus)?.focus())
}

function openFilterMenu() {
  state.typeMenuOpen = false
  state.overflowOpen = false
  state.panelMoreOpen = false
  state.filterMenuOpen = true
}

function openOverflowMenu() {
  const layer = ensureLayer()
  layer.querySelectorAll('.vc-list-menu').forEach(el => el.remove())
  state.typeMenuOpen = false
  state.filterMenuOpen = false
  state.panelMoreOpen = false
  state.overflowOpen = true
  syncMenuTriggers(layer)
  const menu = mountLayerMenu(renderOverflowMenu())
  const anchor = layer.querySelector('[data-action="toggle-overflow"]')
  placeAnchoredMenu(menu, anchor, { align: 'end' })
  // Second pass after layout — first measure can run before paint.
  requestAnimationFrame(() => {
    placeAnchoredMenu(menu, anchor, { align: 'end' })
    menu?.querySelector('[role="menuitem"]')?.focus()
  })
}

function openTypeMenu() {
  const layer = ensureLayer()
  layer.querySelectorAll('.vc-list-menu').forEach(el => el.remove())
  state.overflowOpen = false
  state.filterMenuOpen = false
  state.panelMoreOpen = false
  state.typeMenuOpen = true
  syncMenuTriggers(layer)
  const trigger = layer.querySelector('.vc-type-trigger')
  const current = trigger?.querySelector('span')?.textContent?.trim() || 'Comment'
  const typeOptions = isFeatureEnabled('annotation')
    ? ['Comment', 'Annotation', 'Wording']
    : ['Comment', 'Wording']
  const menu = mountLayerMenu(renderTypeMenu({ type: current, options: typeOptions }))
  placeAnchoredMenu(menu, trigger, { align: 'start' })
  requestAnimationFrame(() => {
    placeAnchoredMenu(menu, trigger, { align: 'start' })
    menu?.querySelector('[role^="menuitem"]')?.focus()
  })
}

function openPanelMoreMenu() {
  state.typeMenuOpen = false
  state.overflowOpen = false
  state.filterMenuOpen = false
  state.panelMoreOpen = true
}

function placePanel(panel) {
  if (!panel) return
  const width = panel.offsetWidth || 280
  const height = panel.offsetHeight || 48
  if (!Number.isFinite(state.panelLayout.left))
    dockPanelTopRight(panel)
  const position = clampPosition(
    state.panelLayout.left,
    state.panelLayout.top ?? PANEL_EDGE_INSET,
    width,
    height,
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
    filterMenuOpen: state.filterMenuOpen,
    panelMoreOpen: state.panelMoreOpen,
    sortBy: state.sortBy,
    showResolvedComments: !state.hideResolved,
    hideComments: state.hideComments,
    mentionsOnly: state.mentionsOnly,
    showAnnotationFilter: isFeatureEnabled('annotation'),
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
      number: threadNumber(item),
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

  const pinEntries = []
  layer.querySelectorAll('.vc-pin[data-id]').forEach(pin => {
    const id = pin.dataset.id
    const record = state.comments.find(item => item.id === id) || state.suggestions.find(item => item.id === id)
    if (!record) return
    const { el, orphaned } = pinTarget(record)
    if (orphaned || !el) {
      pin.remove()
      return
    }
    pinEntries.push({ pin, record, el })
  })
  placePinRows(pinEntries)

  placeOpenMenus(layer)
}

export function renderFeedback() {
  const layer = ensureLayer()
  const open = currentOpen()
  const cardId = open?.item?.id || state.draft?.id || null
  const skipMotion = Boolean(cardId && cardId === state.motionCardId)
  state.motionCardId = cardId

  layer.innerHTML = `${renderPins()}${renderCard(open)}${renderPanel()}`
  const card = layer.querySelector('.vc-card')
  if (card && skipMotion)
    card.dataset.motion = 'settled'

  layer.querySelectorAll('.vc-avatar img').forEach(image => {
    if (image.complete && !image.naturalWidth) {
      image.remove()
      return
    }
    image.addEventListener('error', () => image.remove(), { once: true })
  })
  layoutFeedback()
  promoteFeedbackLayer(layer)
  requestAnimationFrame(() => {
    layer.querySelectorAll('textarea').forEach(textarea => autosizeTextarea(textarea))
  })
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
    suggestedText: '',
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

  if (kind === 'card' && (state.typeMenuOpen || state.overflowOpen)) {
    state.typeMenuOpen = false
    state.overflowOpen = false
    const layer = document.getElementById(LAYER_ID)
    layer?.querySelectorAll('.vc-list-menu').forEach(el => el.remove())
    syncMenuTriggers(layer)
  }

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
    state.submitError = error?.message || 'Couldn\u2019t send. Try again.'
    renderAndFocus('[data-action="retry-send"]')
  }
}

async function onLayerClick(event) {
  const actionEl = event.target.closest('[data-action]')
  if (!actionEl) {
    if (state.typeMenuOpen || state.overflowOpen || state.filterMenuOpen) {
      await dismissLayerMenus()
    }
    return
  }
  event.preventDefault()
  event.stopPropagation()
  const action = actionEl.dataset.action

  if (action === 'filter') state.filter = actionEl.dataset.filter
  else if (action === 'clear-search') {
    state.search = ''
    renderFeedback()
    document.querySelector('#vibecheck-layer [data-field="panel-search"]')?.focus()
  }
  else if (action === 'toggle-filter-menu') {
    if (state.filterMenuOpen) {
      await dismissLayerMenus({ focus: '[data-action="toggle-filter-menu"]' })
      return
    }
    openFilterMenu()
    renderFeedback()
    return
  }
  else if (action === 'panel-more') {
    if (state.panelMoreOpen) {
      await dismissLayerMenus({ focus: '[data-action="panel-more"]' })
      return
    }
    openPanelMoreMenu()
    renderFeedback()
    return
  }
  else if (action === 'toggle-hide-comments') {
    state.hideComments = !state.hideComments
    savePanelPrefs()
    state.panelMoreOpen = true
    renderFeedback()
    return
  }
  else if (action === 'toggle-mentions-only') {
    state.mentionsOnly = !state.mentionsOnly
    savePanelPrefs()
    state.panelMoreOpen = true
    renderFeedback()
    return
  }
  else if (action === 'mark-all-read') {
    const openedAt = new Date().toISOString()
    for (const comment of state.comments.filter(item => !item.parentId && !item.parentSuggestionId && !item.readAt))
      await upsertComment({ ...comment, readAt: openedAt })
    for (const suggestion of state.suggestions.filter(item => !item.readAt))
      await upsertSuggestion({ ...suggestion, readAt: openedAt })
    await dismissLayerMenus({ focus: '[data-action="panel-more"]' })
    await refreshFeedback()
    return
  }
  else if (action === 'set-sort-date') {
    state.sortBy = 'date'
    savePanelPrefs()
    await dismissLayerMenus()
  }
  else if (action === 'set-sort-unread') {
    state.sortBy = 'unread'
    savePanelPrefs()
    await dismissLayerMenus()
  }
  else if (action === 'toggle-show-resolved') {
    state.hideResolved = !state.hideResolved
    savePanelPrefs()
    state.filterMenuOpen = true
    renderFeedback()
    return
  }
  else if (action === 'toggle-panel') {
    const panel = document.querySelector('#vibecheck-layer .vc-panel')
    if (panel) {
      const { right, top } = panel.getBoundingClientRect()
      state.panelLayout.collapsed = !state.panelLayout.collapsed
      applyPanelCollapsedState(panel, state.panelLayout.collapsed)
      anchorPanelTopRight(panel, { right, top })
      placePanel(panel)
      savePanelLayout()
      return
    }
  }
  else if (action === 'close' || action === 'cancel') {
    await dismissLayerMenus()
    await leaveElements('.vc-card')
    state.draft = null
    state.open = null
    state.cardPosition = null
    state.motionCardId = null
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
    if (state.typeMenuOpen) {
      await dismissLayerMenus({ focus: '.vc-type-trigger' })
      return
    }
    openTypeMenu()
    return
  }
  else if (action === 'set-card-type' && state.draft) {
    if (!isFeatureEnabled('annotation') && actionEl.dataset.cardType === 'Annotation')
      return
    state.draft = convertDraftType(state.draft, actionEl.dataset.cardType)
    await dismissLayerMenus()
    renderAndFocus('.vc-type-trigger')
    return
  }
  else if (action === 'set-kind' && state.draft) {
    if (!isFeatureEnabled('annotation')) return
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
      if (state.overflowOpen) {
        await dismissLayerMenus({ focus: '[data-action="toggle-overflow"]' })
        return
      }
      openOverflowMenu()
      return
    }
    if (action === 'delete') {
      await leaveElements('.vc-card')
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
      await dismissLayerMenus()
      await refreshFeedback()
      return
    }
  }
  renderFeedback()
}

function autosizeTextarea(textarea, { max = 180, animate = false } = {}) {
  if (!textarea || textarea.tagName !== 'TEXTAREA') return
  const field = textarea.closest('.vc-field')
  const comboPart = textarea.closest('.vc-combo-part')
  const minHeight = field?.classList.contains('vc-field-compact')
    ? 28
    : comboPart
      ? 16
      : 28

  const from = textarea.offsetHeight || minHeight
  const prevTransition = textarea.style.transition
  textarea.style.transition = 'none'
  textarea.style.height = 'auto'
  const raw = textarea.scrollHeight
  const next = Math.min(Math.max(raw, minHeight), max)
  textarea.style.overflowY = raw > max ? 'auto' : 'hidden'

  if (!animate || prefersReducedMotion() || Math.abs(from - next) < 1) {
    textarea.style.height = `${next}px`
    textarea.style.transition = prevTransition
    return
  }

  textarea.style.height = `${from}px`
  // Force layout so the browser registers the start height before easing.
  void textarea.offsetHeight
  textarea.style.transition = `height var(--vc-duration, 200ms) var(--vc-ease, cubic-bezier(0.32, 0.72, 0, 1))`
  textarea.style.height = `${next}px`

  const finish = () => {
    textarea.style.transition = prevTransition
    textarea.removeEventListener('transitionend', onEnd)
  }
  const onEnd = event => {
    if (event.propertyName !== 'height') return
    finish()
  }
  textarea.addEventListener('transitionend', onEnd)
  setTimeout(finish, motionMs() + 40)
}

function onLayerInput(event) {
  const field = event.target.dataset.field
  const combo = event.target.closest('.vc-combo-field')
  const standaloneField = event.target.closest('.vc-field')
  if (event.target.matches('textarea'))
    autosizeTextarea(event.target)
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
    if (standaloneField)
      standaloneField.dataset.state = event.target.value.trim() ? 'Filled' : 'Default'
    const send = standaloneField?.querySelector('.vc-send')
    if (send) send.dataset.state = event.target.value.trim() ? 'Active' : 'Default'
    return
  }
  if (!field || !state.draft) return
  state.draft[field] = event.target.value
  state.submissionState = null
  state.submitError = ''
  if (combo) syncComboVisualState(combo, field)
  else if (standaloneField) {
    const active = Boolean(event.target.value.trim())
    standaloneField.dataset.state = active ? 'Active' : 'Focus'
    const card = standaloneField.closest('.vc-card')
    if (card) card.dataset.state = active ? 'Active' : 'Default'
  }
  if (field === 'body' || field === 'suggestedText') {
    const send = (standaloneField || combo)?.querySelector('.vc-send')
    if (send) send.dataset.state = event.target.value.trim() ? 'Active' : 'Default'
  }
}

function syncComboVisualState(combo, activeField) {
  const first = combo.querySelector('[data-field="suggestedText"]')?.value.trim()
  const second = combo.querySelector('[data-field="rationale"]')?.value.trim()
  if (activeField === 'suggestedText')
    combo.dataset.state = second ? 'Editing - Both' : first ? 'Editing - First' : 'Focus - First'
  else if (activeField === 'rationale')
    combo.dataset.state = second ? 'Editing - Both' : first ? 'Focus - Second (First filled)' : 'Focus - Second'
}

function onLayerFocusIn(event) {
  const combo = event.target.closest('.vc-combo-field')
  if (combo) {
    syncComboVisualState(combo, event.target.dataset.field)
    if (event.target.matches('textarea'))
      requestAnimationFrame(() => autosizeTextarea(event.target, { animate: true }))
    return
  }
  const field = event.target.closest('.vc-field')
  if (!field) return
  if (field.classList.contains('vc-field-compact'))
    field.dataset.state = event.target.value.trim() ? 'Filled' : 'Focus'
  else
    field.dataset.state = event.target.value.trim() ? 'Active' : 'Focus'
  if (event.target.matches('textarea'))
    requestAnimationFrame(() => autosizeTextarea(event.target, { animate: true }))
}

function onLayerFocusOut(event) {
  const combo = event.target.closest('.vc-combo-field')
  const field = event.target.closest('.vc-field')
  requestAnimationFrame(() => {
    if (combo && !combo.contains(document.activeElement)) {
      if (combo.getAttribute('aria-busy') === 'true' || combo.querySelector('[role="alert"].vc-field-message'))
        return
      const first = combo.querySelector('[data-field="suggestedText"]')?.value.trim()
      const second = combo.querySelector('[data-field="rationale"]')?.value.trim()
      combo.dataset.state = first && second ? 'Filled - Both' : first ? 'Filled - First' : 'Default'
      combo.querySelectorAll('textarea').forEach(textarea => autosizeTextarea(textarea, { animate: true }))
    }
    if (field && !field.contains(document.activeElement)) {
      const input = field.querySelector('[data-field]')
      const value = input?.value.trim()
      field.dataset.state = value ? 'Filled' : 'Default'
      if (input?.matches?.('textarea')) autosizeTextarea(input, { animate: true })
    }
  })
}

function onLayerKeyDown(event) {
  event.stopPropagation()
  const menu = event.target.closest('[role="menu"]')
  if (event.key === 'Escape') {
    if (state.typeMenuOpen || state.overflowOpen || state.filterMenuOpen) {
      const selector = state.typeMenuOpen
        ? '.vc-type-trigger'
        : state.filterMenuOpen
          ? '[data-action="toggle-filter-menu"]'
          : '[data-action="toggle-overflow"]'
      dismissLayerMenus({ focus: selector })
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

  const isEnter = event.key === 'Enter'
  const sendWithModifier = isEnter && (event.metaKey || event.ctrlKey)
  const sendWithEnter = isEnter && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey
  if ((sendWithEnter || sendWithModifier) && event.target.tagName === 'TEXTAREA') {
    if (event.isComposing || event.target.dataset.field === 'panel-search') return
    // Shift+Enter keeps the default newline insertion.
    if (event.shiftKey) return

    const host = event.target.closest('.vc-combo-field, .vc-field')
    const send = host?.querySelector('[data-action="send"], [data-action="retry-send"], [data-action="reply"]')
    if (!send || send.disabled || send.dataset.state === 'Disabled') return
    event.preventDefault()
    send.click()
  }
}

function closeMenusOutside(event) {
  if (!state.typeMenuOpen && !state.overflowOpen && !state.filterMenuOpen && !state.panelMoreOpen) return
  if (event.target.closest?.('.vc-type-selector, .vc-list-menu, [data-action="toggle-overflow"], [data-action="toggle-filter-menu"], [data-action="panel-more"]')) return
  dismissLayerMenus()
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
  loadPanelPrefs()
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

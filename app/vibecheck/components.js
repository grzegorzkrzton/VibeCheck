import { cardIcon } from './card-icons.js'

const KIND_LABEL = {
  implement: 'Implement',
  warning: 'Warning',
  question: 'Question',
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function classNames(...parts) {
  return parts.filter(Boolean).join(' ').trim()
}

function attr(name, value) {
  if (value === undefined || value === null || value === false)
    return ''
  if (value === true)
    return name
  return `${name}="${escapeHtml(String(value))}"`
}

function attrs(map) {
  return Object.entries(map)
    .map(([key, value]) => attr(key, value))
    .filter(Boolean)
    .join(' ')
}

export function pinVisualType(recordKind, type, kind) {
  if (recordKind === 'suggestion' || type === 'suggestion')
    return 'Suggestion'
  if (type === 'annotation') {
    if (kind === 'warning') return 'Warning'
    if (kind === 'question') return 'Question'
    return 'Implement'
  }
  return 'Note'
}

export function pinVisualState({ open, resolved } = {}) {
  if (resolved) return 'Resolved'
  if (open) return 'Open'
  return 'Default'
}

export function cardFamily({ kind, item } = {}) {
  if (kind === 'suggestion' || item?.recordType === 'suggestion')
    return 'Card / Content'
  if (item?.type === 'annotation')
    return 'Card / Annotation'
  return 'Card / Comment'
}

export function cardState(kind, item) {
  if (kind === 'draft' || item?._editing)
    return 'Compose'
  return 'Detail'
}

export function renderButton({
  style = 'Secondary',
  state = 'Default',
  label = '',
  action,
  extraClass = '',
  ariaLabel,
  ariaPressed,
} = {}) {
  const styleClass = style === 'Primary'
    ? 'primary'
    : style === 'Danger'
      ? 'danger'
      : extraClass.includes('vc-close')
        ? ''
        : ''
  return `<button type="button" class="${classNames(styleClass, extraClass)}" ${attrs({
    'data-vc-component': 'Button',
    'data-style': style,
    'data-state': state,
    'data-action': action,
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
  })}>${escapeHtml(label)}</button>`
}

export function renderChip({
  kind = 'Segment',
  selected = false,
  label = '',
  action,
  dataAttrs = {},
} = {}) {
  return `<button type="button" ${attrs({
    'data-vc-component': 'Chip',
    'data-kind': kind,
    'data-state': selected ? 'Selected' : 'Default',
    'data-action': action,
    'aria-pressed': selected ? 'true' : 'false',
    ...dataAttrs,
  })}>${escapeHtml(label)}</button>`
}

export function renderBadge(label = '') {
  if (!label) return ''
  const type = String(label).toLowerCase() === 'applied' ? 'Applied' : 'Pending'
  return `<span class="vc-badge" data-vc-component="Badge" data-type="${type}">${escapeHtml(label)}</span>`
}

export function renderSend({
  state = 'Default',
  action = 'send',
  cardType = 'Comment',
  ariaLabel = 'Send',
} = {}) {
  const disabled = state === 'Disabled'
  return `<button type="button" class="vc-send" ${attrs({
    'data-vc-component': 'Card / Send',
    'data-state': state,
    'data-card-type': cardType,
    'data-action': action,
    'aria-label': ariaLabel,
    'aria-disabled': disabled ? 'true' : undefined,
    disabled,
  })}>${cardIcon('send', 20)}</button>`
}

function headerIconName(action) {
  if (action === 'toggle-overflow' || action === 'panel-more') return 'more'
  if (action === 'resolve') return 'checkCircle'
  if (action === 'toggle-filter-menu' || action === 'cycle-filter') return 'funnel'
  if (action === 'close' || action === 'toggle-panel') return 'close'
  return 'close'
}

export function renderHeaderIcon({
  action,
  label,
  active = false,
  expanded,
  disabled = false,
  extraClass = '',
} = {}) {
  return `<button type="button" class="vc-header-icon ${extraClass}" ${attrs({
    'data-vc-component': 'Card / Header Icon',
    'data-action': action,
    'data-state': active ? 'Active' : 'Default',
    'aria-label': label,
    'aria-expanded': expanded,
    'aria-disabled': disabled ? 'true' : undefined,
    disabled: disabled || undefined,
  })}>${cardIcon(headerIconName(action))}</button>`
}

export function renderIconButton({
  icon,
  action,
  ariaLabel,
  extraClass = '',
} = {}) {
  return `<button type="button" class="vc-icon-button ${extraClass}" ${attrs({
    'data-vc-component': 'Card / Icon Button',
    'data-action': action,
    'data-state': 'Default',
    'aria-label': ariaLabel,
  })}>${cardIcon(icon, 16)}</button>`
}

export function renderSelectedItem(label = '', type = 'Note') {
  return `<span class="vc-selected-item" ${attrs({
    'data-vc-component': 'Card / Selected Item',
    'data-vc-type': type,
  })}>${escapeHtml(label || 'Selected element')}</span>`
}

export function renderTypeSelector({
  type = 'Comment',
  disabled = false,
  open = false,
} = {}) {
  return `
    <div class="vc-type-selector" ${attrs({
      'data-vc-component': 'Card / Type Selector',
      'data-state': disabled ? 'Disabled' : open ? 'Open' : 'Default',
    })}>
      <button type="button" class="vc-type-trigger" ${attrs({
        'data-action': disabled ? undefined : 'toggle-type-menu',
        'aria-label': `Change card type, currently ${type}`,
        'aria-expanded': disabled ? undefined : String(open),
        disabled,
      })}>
        <span>${escapeHtml(type)}</span>${disabled ? '' : cardIcon('chevron')}
      </button>
      ${open && !disabled ? renderTypeMenu({ type }) : ''}
    </div>
  `
}

export function renderListMenuDivider() {
  return `<div class="vc-list-menu-divider" data-vc-component="Menu Divider" role="separator"></div>`
}

export function renderListMenuItem({
  label = '',
  action,
  selected = false,
  role = 'menuitemradio',
  tone = 'default',
  dataComponent = 'Menu item',
  dataCardType,
} = {}) {
  const checked = role === 'menuitemcheckbox' || role === 'menuitemradio'
  const classes = [
    'vc-list-menu-item',
    selected ? 'vc-list-menu-item-selected' : '',
    tone === 'critical' ? 'vc-list-menu-item-critical' : '',
  ].filter(Boolean).join(' ')
  return `
    <button type="button" role="${role}" class="${classes}" ${attrs({
      'data-vc-component': dataComponent,
      'data-action': action,
      'data-card-type': dataCardType,
      'aria-checked': checked ? String(selected) : undefined,
    })}>
      <span class="vc-list-menu-label">${escapeHtml(label)}</span>
      ${selected ? `<span class="vc-list-menu-check" aria-hidden="true">${cardIcon('check', 16)}</span>` : ''}
    </button>
  `
}

export function renderListMenu({
  label = '',
  dataComponent = 'Menu List',
  menuId,
  items = [],
} = {}) {
  const body = items.map(item => {
    if (item.type === 'divider') return renderListMenuDivider()
    return renderListMenuItem({
      label: item.label,
      action: item.action,
      selected: item.selected,
      role: item.role,
      tone: item.tone,
      dataComponent: item.dataComponent || 'Menu item',
      dataCardType: item.dataCardType,
    })
  }).join('')
  return `
    <div class="vc-list-menu" ${attrs({
      'data-vc-component': dataComponent,
      'data-menu': menuId,
      role: 'menu',
      'aria-label': label,
    })}>
      ${body}
    </div>
  `
}

export function renderTypeMenuItem({ option = 'Comment', selected = false } = {}) {
  return renderListMenuItem({
    label: option,
    action: 'set-card-type',
    selected,
    role: 'menuitemradio',
    dataComponent: 'Card / Type Menu Item',
    dataCardType: option,
  })
}

export function renderTypeMenu({ type = 'Comment', options = ['Comment', 'Annotation', 'Content'] } = {}) {
  return renderListMenu({
    label: 'Card type',
    dataComponent: 'Card / Type Menu',
    menuId: 'type',
    items: options.map(option => ({
      type: 'item',
      label: option,
      action: 'set-card-type',
      selected: option === type,
      role: 'menuitemradio',
      dataCardType: option,
      dataComponent: 'Card / Type Menu Item',
    })),
  })
}

export function renderOverflowItem({ action, label, tone = 'default' } = {}) {
  return renderListMenuItem({
    label,
    action,
    role: 'menuitem',
    tone,
    dataComponent: 'Card / Overflow Item',
  })
}

export function renderOverflowMenu() {
  return renderListMenu({
    label: 'Thread actions',
    dataComponent: 'Card / Overflow Menu',
    menuId: 'overflow',
    items: [
      { type: 'item', label: 'Mark as unread', action: 'mark-unread', role: 'menuitem' },
      { type: 'item', label: 'Delete thread…', action: 'delete', role: 'menuitem', tone: 'critical' },
    ],
  })
}

export function renderFilterMenu({
  sortBy = 'date',
  showResolvedComments = false,
} = {}) {
  return renderListMenu({
    label: 'Filter and sort notes',
    dataComponent: 'List Menu',
    menuId: 'filter',
    items: [
      { type: 'item', label: 'Sort by date', action: 'set-sort-date', selected: sortBy === 'date' },
      { type: 'item', label: 'Sort by unread', action: 'set-sort-unread', selected: sortBy === 'unread' },
      { type: 'divider' },
      {
        type: 'item',
        label: 'Show resolved comments',
        action: 'toggle-show-resolved',
        selected: showResolvedComments,
        role: 'menuitemcheckbox',
      },
    ],
  })
}

export function renderPanelMoreMenu({
  hideComments = false,
  mentionsOnly = false,
} = {}) {
  return renderListMenu({
    label: 'More panel actions',
    dataComponent: 'List Menu',
    menuId: 'panel-more',
    items: [
      {
        type: 'item',
        label: 'Hide comments',
        action: 'toggle-hide-comments',
        selected: hideComments,
        role: 'menuitemcheckbox',
      },
      { type: 'divider' },
      {
        type: 'item',
        label: 'Just mentions and replies',
        action: 'toggle-mentions-only',
        selected: mentionsOnly,
        role: 'menuitemcheckbox',
      },
      { type: 'divider' },
      { type: 'item', label: 'Mark all as read', action: 'mark-all-read', role: 'menuitem' },
    ],
  })
}

export function renderReply({
  name = 'You',
  timestamp = 'Just now',
  body = '',
  hover = false,
} = {}) {
  return `
    <div class="vc-reply" ${attrs({
      'data-vc-component': 'Card / Reply',
      'data-state': hover ? 'Hover' : 'Default',
    })}>
      <div class="vc-reply-meta"><strong>${escapeHtml(name)}</strong><time>${escapeHtml(timestamp)}</time></div>
      <div class="vc-reply-body">${escapeHtml(body)}</div>
    </div>
  `
}

export function renderApplySuggestion() {
  return `<button type="button" class="vc-apply-suggestion" data-vc-component="Card / Apply Suggestion" data-state="Default" data-action="apply-suggestion" aria-label="Apply suggestion">${cardIcon('apply')}</button>`
}

export function renderQuote({
  role = 'Original',
  body = '',
  user = '',
  apply = false,
} = {}) {
  const heading = role === 'Suggestion'
    ? `SUGGESTED${user ? ` by ${escapeHtml(user)}` : ''}`
    : role.toUpperCase()
  return `
    <section class="vc-quote" ${attrs({
      'data-vc-component': 'Card / Quote',
      'data-role': role,
    })}>
      <div class="vc-quote-heading">${heading}</div>
      <div class="vc-quote-row">
        <div class="vc-quote-body">${escapeHtml(body)}</div>
        ${apply ? renderApplySuggestion() : ''}
      </div>
    </section>
  `
}

export function renderPin({
  id,
  recordKind,
  type,
  kind,
  number,
  open = false,
  resolved = false,
} = {}) {
  const visualType = pinVisualType(recordKind, type, kind)
  const visualState = pinVisualState({ open, resolved })
  const numericLabel = String(number ?? '').replace(/\D/g, '') || '1'
  const label = visualState === 'Open' ? '' : numericLabel
  return `<button type="button" class="vc-pin" ${attrs({
    'data-vc-component': 'Feedback Pin',
    'data-vc-type': visualType,
    'data-state': visualState,
    'data-action': 'open',
    'data-id': id,
    'data-item': recordKind,
    'data-type': type,
    'data-kind': kind || '',
    'data-resolved': Boolean(resolved),
    'data-open': Boolean(open),
  })}>${label}</button>`
}

export function renderKindSwitch(kind = 'implement') {
  return `
    <div class="vc-kinds">
      ${['implement', 'warning', 'question'].map(value => renderKindChip({
        kind: value,
        selected: kind === value,
      })).join('')}
    </div>
  `
}

export function renderKindChip({ kind = 'implement', selected = false } = {}) {
  return `<button type="button" ${attrs({
    'data-vc-component': 'Card / Kind Chip',
    'data-kind': kind,
    'data-annotation-kind': kind,
    'data-state': selected ? 'Selected' : 'Default',
    'data-action': 'set-kind',
    'aria-pressed': String(selected),
  })}>${escapeHtml(KIND_LABEL[kind] || 'Implement')}</button>`
}

export function renderField({
  type = 'Textarea',
  field,
  value = '',
  placeholder = '',
  state,
  showSend = false,
  sendState,
  sendAction = 'send',
  cardType = 'Comment',
  compact = false,
  invalid = false,
  describedBy,
} = {}) {
  const visualState = state || (value ? 'Filled' : 'Default')
  const disabled = visualState === 'Disabled'
  const input = type === 'Textarea'
    ? `<textarea ${attrs({
      'data-field': field,
      placeholder,
      'aria-invalid': invalid ? 'true' : undefined,
      'aria-describedby': describedBy,
      rows: '1',
      disabled,
    })}>${escapeHtml(value)}</textarea>`
    : `<input type="text" ${attrs({ 'data-field': field, value, placeholder, disabled })}>`
  return `
    <div class="${classNames('vc-field', compact && 'vc-field-compact')}" ${attrs({
      'data-vc-component': 'Card / Field',
      'data-type': type,
      'data-state': visualState,
      'data-invalid': invalid || undefined,
    })}>
      ${input}
      ${showSend ? renderSend({
        state: sendState || (disabled ? 'Disabled' : value.trim() ? 'Active' : 'Default'),
        action: sendAction,
        cardType,
        ariaLabel: compact ? 'Send reply' : 'Send',
      }) : ''}
    </div>
  `
}

export function renderComboField({
  firstValue = '',
  secondValue = '',
  state,
  showSend = true,
  error = '',
  message = '',
} = {}) {
  const sendable = Boolean(firstValue.trim())
  const submitting = state === 'Submitting'
  const disabled = state === 'Disabled'
  const failed = state === 'Submit failed'
  const invalid = state === 'Error - First'
  const visualState = state
    || (firstValue && secondValue ? 'Filled - Both' : firstValue ? 'Filled - First' : 'Default')
  const messageId = message || error ? 'vc-combo-message' : undefined
  return `
    <div class="vc-combo-field" ${attrs({
      'data-vc-component': 'Card / ComboField',
      'data-state': visualState,
      'aria-busy': submitting ? 'true' : undefined,
    })}>
      <label class="vc-combo-part vc-combo-first" data-invalid="${invalid}">
        <span class="vc-sr-only">Suggested copy</span>
        <textarea data-field="suggestedText" placeholder="Suggested copy" rows="1" ${attrs({
          'aria-required': 'true',
          'aria-invalid': invalid || failed ? 'true' : undefined,
          'aria-describedby': messageId,
          disabled: submitting || disabled,
        })}>${escapeHtml(firstValue)}</textarea>
      </label>
      <label class="vc-combo-part vc-combo-second">
        <span class="vc-sr-only">Reasoning, optional</span>
        <textarea data-field="rationale" placeholder="Why this change? (optional)" rows="1" ${attrs({
          disabled: submitting || disabled,
        })}>${escapeHtml(secondValue)}</textarea>
        ${showSend ? renderSend({
          state: submitting || disabled ? 'Disabled' : sendable ? 'Active' : 'Default',
          action: failed ? 'retry-send' : 'send',
          cardType: 'Content',
          ariaLabel: failed ? 'Try sending again' : 'Send suggestion',
        }) : ''}
      </label>
      ${message || error ? `<div id="${messageId}" class="vc-field-message" role="${error ? 'alert' : 'status'}">${escapeHtml(error || message)}</div>` : ''}
    </div>
  `
}

function cardShell({
  family,
  mode,
  state,
  id,
  type,
  context,
  typeMenuOpen = false,
  overflowOpen = false,
  resolved = false,
  status,
  thread,
  body,
}) {
  const detail = mode === 'Detail'
  const typeLabel = type === 'Note' ? 'Comment' : type === 'Suggestion' ? 'Content' : 'Annotation'
  return `
    <div class="vc-card" ${attrs({
      'data-vc-component': family,
      'data-mode': mode,
      'data-state': state,
      'data-status': status,
      'data-thread': thread,
      'data-resolution': resolved ? 'Resolved' : 'Open',
      'data-card-type': type,
      'data-card': id,
    })}>
      <div class="vc-selected-row">${renderSelectedItem(context, type)}</div>
      <div class="vc-card-surface">
      <div class="vc-card-head" data-drag-handle="card" title="Drag to move">
        ${renderTypeSelector({ type: typeLabel, disabled: detail, open: typeMenuOpen })}
        ${status ? renderBadge(status) : ''}
        <div class="vc-header-actions">
          ${detail ? renderHeaderIcon({
            action: 'toggle-overflow',
            label: 'More thread actions',
            expanded: String(overflowOpen),
          }) : ''}
          ${detail ? renderHeaderIcon({
            action: 'resolve',
            label: resolved ? 'Reopen thread' : 'Resolve thread',
            active: resolved,
          }) : ''}
          ${renderHeaderIcon({ action: 'close', label: 'Close card' })}
        </div>
        ${overflowOpen ? renderOverflowMenu() : ''}
      </div>
      ${body}
      </div>
    </div>
  `
}

export function renderNoteCard({
  id,
  state = 'Compose',
  body = '',
  context = '',
  repliesHtml = '',
  resolved = false,
  author = 'You',
  timestamp = 'Just now',
  reply = '',
  typeMenuOpen = false,
  overflowOpen = false,
  submissionState,
} = {}) {
  if (state === 'Compose') {
    return cardShell({
      family: 'Card / Comment',
      mode: 'Compose',
      state: body ? 'Active' : 'Default',
      id,
      type: 'Note',
      context,
      typeMenuOpen,
      body: renderField({
        field: 'body',
        value: body,
        state: body ? 'Active' : 'Default',
        placeholder: 'Write a comment…',
        showSend: true,
        sendState: submissionState === 'Submitting' ? 'Disabled' : body.trim() ? 'Active' : 'Default',
        cardType: 'Comment',
      }),
    })
  }

  return cardShell({
    family: 'Card / Comment',
    mode: 'Detail',
    state: resolved ? 'Resolved' : repliesHtml ? 'Thread' : 'Default',
    id,
    type: 'Note',
    context,
    resolved,
    overflowOpen,
    thread: repliesHtml ? 'Replies' : 'Empty',
    body: `
      <div class="vc-thread">
        ${renderReply({ name: author, timestamp, body })}
        ${repliesHtml}
      </div>
      ${renderField({ field: 'reply', value: reply, placeholder: 'Reply…', compact: true, showSend: true, sendAction: 'reply', cardType: 'Comment' })}
    `,
  })
}

export function renderAnnotationCard({
  id,
  state = 'Compose',
  kind = 'implement',
  body = '',
  context = '',
  repliesHtml = '',
  resolved = false,
  author = 'You',
  timestamp = 'Just now',
  reply = '',
  typeMenuOpen = false,
  overflowOpen = false,
} = {}) {
  const visualType = KIND_LABEL[kind] || 'Implement'
  if (state === 'Compose') {
    return cardShell({
      family: 'Card / Annotation',
      mode: 'Compose',
      state: body ? 'Active' : 'Default',
      id,
      type: visualType,
      context,
      typeMenuOpen,
      body: `
        ${renderKindSwitch(kind)}
        ${renderField({
          field: 'body',
          value: body,
          state: body ? 'Active' : 'Default',
          placeholder: 'What should engineering know?',
          showSend: true,
          cardType: visualType,
        })}
      `,
    })
  }

  return cardShell({
    family: 'Card / Annotation',
    mode: 'Detail',
    state: resolved ? 'Resolved' : repliesHtml ? 'Thread' : 'Default',
    id,
    type: visualType,
    context,
    resolved,
    overflowOpen,
    thread: repliesHtml ? 'Replies' : 'Empty',
    body: `
      <div class="vc-thread">
        ${renderReply({ name: author, timestamp, body })}
        ${repliesHtml}
      </div>
      ${renderField({ field: 'reply', value: reply, placeholder: 'Reply…', compact: true, showSend: true, sendAction: 'reply', cardType: visualType })}
    `,
  })
}

export function renderContentCard({
  id,
  state = 'Compose',
  suggestedText = '',
  rationale = '',
  originalText = '',
  author = '',
  status = 'pending',
  resolved = false,
  context = '',
  repliesHtml = '',
  reply = '',
  typeMenuOpen = false,
  overflowOpen = false,
  inputState,
  submitError = '',
} = {}) {
  if (state === 'Compose') {
    return cardShell({
      family: 'Card / Content',
      mode: 'Compose',
      state: inputState || 'Default',
      id,
      type: 'Suggestion',
      context,
      typeMenuOpen,
      body: `
        ${renderQuote({ role: 'Original', body: originalText })}
        ${renderComboField({
          firstValue: suggestedText,
          secondValue: rationale,
          state: inputState,
          error: submitError,
          message: inputState === 'Submitting' ? 'Sending…' : '',
        })}
      `,
    })
  }

  const displayStatus = status === 'applied' ? 'Applied' : 'Pending'
  return cardShell({
    family: 'Card / Content',
    mode: 'Detail',
    state: 'Read only',
    id,
    type: 'Suggestion',
    context,
    resolved,
    status: displayStatus,
    thread: repliesHtml ? 'Replies' : 'Empty',
    overflowOpen,
    body: `
      <div class="vc-content-body">
        ${renderQuote({ role: 'Original', body: originalText })}
        ${renderQuote({ role: 'Suggestion', body: suggestedText, user: author, apply: true })}
        ${rationale ? renderQuote({ role: 'Reasoning', body: rationale }) : ''}
      </div>
      ${repliesHtml ? `<div class="vc-thread-divider" data-vc-component="Toolbar Divider" aria-hidden="true"></div><div class="vc-thread">${repliesHtml}</div>` : ''}
      ${renderField({ field: 'reply', value: reply, placeholder: 'Reply…', compact: true, showSend: true, sendAction: 'reply', cardType: 'Content' })}
    `,
  })
}

function avatarInitials(name = '') {
  const words = String(name).trim().split(/\s+/).filter(Boolean)
  if (!words.length) return '?'
  return `${words[0][0]}${words.length > 1 ? words[words.length - 1][0] : ''}`.toUpperCase()
}

function safeImageUrl(value = '') {
  const url = String(value).trim()
  return /^(https?:|data:image\/)/i.test(url) ? url : ''
}

export function renderAvatar({
  name = '',
  imageUrl = '',
  tone = 'implement',
} = {}) {
  const safeUrl = safeImageUrl(imageUrl)
  return `<span class="vc-avatar" ${attrs({
    'data-vc-component': 'Avatar',
    'data-tone': tone,
    title: name || 'Unknown participant',
  })}>
    <span aria-hidden="true">${escapeHtml(avatarInitials(name))}</span>
    ${safeUrl ? `<img src="${escapeHtml(safeUrl)}" alt="">` : ''}
  </span>`
}

export function renderNotesPanelItem({
  id,
  kind,
  open = false,
  number = '',
  context = '',
  author = 'You',
  timestamp = '',
  message = '',
  participants = [],
  replyCount = 0,
  badges = '',
} = {}) {
  const people = [author, ...participants]
    .map(person => typeof person === 'string' ? { name: person } : person)
    .filter(person => person?.name)
    .filter((person, index, all) => all.findIndex(candidate => candidate.name === person.name) === index)
    .slice(0, 4)
  const highlightedMessage = escapeHtml(message).replace(
    /(^|[\s(])(@[a-z0-9._-]+)/gi,
    '$1<span class="vc-mention">$2</span>',
  )
  return `
    <button type="button" class="vc-item" ${attrs({
      'data-vc-component': 'Notes Panel Item',
      'data-state': open ? 'Open' : 'Default',
      'data-action': 'open',
      'data-id': id,
      'data-kind': kind,
      'data-open': Boolean(open),
    })}>
      <span class="vc-item-avatars" aria-label="${escapeHtml(people.map(person => person.name).join(', '))}">
        ${people.map((person, index) => renderAvatar({
          name: person.name,
          imageUrl: person.imageUrl,
          tone: ['note', 'implement', 'question', 'warning'][index],
        })).join('')}
      </span>
      <span class="vc-item-context">
        <span class="vc-item-number">#${escapeHtml(number)}</span>
        <span class="vc-thread-icon" aria-hidden="true">↪</span>
        <span class="vc-context-link">${escapeHtml(context)}</span>
        ${badges}
      </span>
      <span class="vc-item-author"><strong>${escapeHtml(author)}</strong><span>${escapeHtml(timestamp)}</span></span>
      <span class="vc-item-message">${highlightedMessage}</span>
      ${replyCount ? `<span class="vc-reply-count">${escapeHtml(replyCount)} ${replyCount === 1 ? 'reply' : 'replies'}</span>` : ''}
    </button>
  `
}

export function renderNotesPanel({
  collapsed = false,
  hideResolved = true,
  filter = 'all',
  search = '',
  filterMenuOpen = false,
  panelMoreOpen = false,
  sortBy = 'date',
  showResolvedComments = false,
  hideComments = false,
  mentionsOnly = false,
  showAnnotationFilter = true,
  itemsHtml = '',
} = {}) {
  const filters = [
    ['all', 'All'],
    ['notes', 'Comments'],
    ...(showAnnotationFilter ? [['annotations', 'Annotations']] : []),
    ['content', 'Content'],
  ]
  return `
    <aside class="vc-panel" ${attrs({
      'data-vc-component': 'Notes Panel',
      'data-state': collapsed ? 'Collapsed' : 'Expanded',
      'data-collapsed': collapsed,
    })}>
      <div class="vc-panel-head" data-drag-handle="panel" title="Drag to move">
        <span>Notes</span>
        <div class="vc-panel-controls">
          ${renderIconButton({
            icon: collapsed ? 'arrowDiagonalOut' : 'arrowDiagonalIn',
            action: 'toggle-panel',
            ariaLabel: collapsed ? 'Expand notes panel' : 'Collapse notes panel',
            extraClass: 'vc-panel-collapse-btn',
          })}
        </div>
      </div>
      <div class="vc-panel-collapse" ${attrs({
        'aria-hidden': collapsed ? 'true' : undefined,
      })}>
        <div class="vc-panel-body">
          <div class="vc-panel-tools">
            <label class="vc-panel-search" data-vc-component="Search Field" data-state="${search.trim() ? 'Filled' : 'Default'}">
              <span class="vc-panel-search-leading" aria-hidden="true">${cardIcon('search', 16)}</span>
              <input type="search" data-field="panel-search" value="${escapeHtml(search)}" placeholder="Search" aria-label="Search notes" ${collapsed ? 'tabindex="-1"' : ''}>
              ${search.trim() ? `<button type="button" class="vc-panel-search-clear" data-action="clear-search" aria-label="Clear search">${cardIcon('xCircle', 16)}</button>` : ''}
            </label>
            <div class="vc-panel-header-actions">
              ${renderHeaderIcon({
                action: 'toggle-filter-menu',
                label: 'Filter and sort notes',
                expanded: filterMenuOpen,
                extraClass: 'vc-panel-header-icon',
              })}
              ${renderHeaderIcon({
                action: 'panel-more',
                label: 'More panel actions',
                expanded: panelMoreOpen,
                extraClass: 'vc-panel-header-icon vc-panel-more',
              })}
            </div>
            ${filterMenuOpen ? renderFilterMenu({ sortBy, showResolvedComments }) : ''}
            ${panelMoreOpen ? renderPanelMoreMenu({ hideComments, mentionsOnly }) : ''}
          </div>
          <div class="vc-filters">
            ${filters.map(([value, label]) => renderChip({
              kind: 'Filter',
              selected: filter === value,
              label,
              action: 'filter',
              dataAttrs: { 'data-filter': value },
            })).join('')}
          </div>
          ${itemsHtml}
        </div>
      </div>
    </aside>
  `
}

export { KIND_LABEL }

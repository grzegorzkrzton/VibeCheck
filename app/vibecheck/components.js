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
    return 'Feedback Card / Wording'
  if (item?.type === 'annotation')
    return 'Feedback Card / Annotation'
  return 'Feedback Card / Note'
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

export function renderField({
  type = 'Input',
  field,
  value = '',
  placeholder = '',
  state = 'Default',
} = {}) {
  const shared = attrs({
    'data-vc-component': 'Field',
    'data-type': type,
    'data-state': state,
    'data-field': field,
    placeholder,
  })
  if (type === 'Textarea')
    return `<textarea ${shared}>${escapeHtml(value)}</textarea>`
  return `<input type="text" ${shared} value="${escapeHtml(value)}">`
}

export function renderBadge(label = '') {
  if (!label) return ''
  return `<span class="vc-badge" data-vc-component="Badge">${escapeHtml(label)}</span>`
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
  })}>${escapeHtml(number)}</button>`
}

export function renderTypeSwitch(isAnnotation) {
  return `
    <div class="vc-types">
      ${renderChip({
        kind: 'Segment',
        selected: !isAnnotation,
        label: 'Note',
        action: 'set-type',
        dataAttrs: { 'data-type': 'note' },
      })}
      ${renderChip({
        kind: 'Segment',
        selected: isAnnotation,
        label: 'Annotation for devs',
        action: 'set-type',
        dataAttrs: { 'data-type': 'annotation' },
      })}
    </div>
  `
}

export function renderKindSwitch(kind = 'implement') {
  return `
    <div class="vc-kinds">
      ${['implement', 'warning', 'question'].map(value => renderChip({
        kind: 'Annotation',
        selected: kind === value,
        label: KIND_LABEL[value],
        action: 'set-kind',
        dataAttrs: { 'data-annotation-kind': value },
      })).join('')}
    </div>
  `
}

function cardShell({ family, state, id, head, body }) {
  return `
    <div class="vc-card" ${attrs({
      'data-vc-component': family,
      'data-state': state,
      'data-card': id,
    })}>
      <div class="vc-card-head" data-drag-handle="card" title="Drag to move">
        ${head}
        ${renderButton({
          style: 'Secondary',
          extraClass: 'vc-close',
          action: 'close',
          label: '×',
          ariaLabel: 'Close',
        })}
      </div>
      ${body}
    </div>
  `
}

export function renderNoteCard({
  id,
  state = 'Compose',
  isAnnotation = false,
  body = '',
  author = '',
  context = '',
  meta = '',
  badges = '',
  repliesHtml = '',
  resolved = false,
} = {}) {
  if (state === 'Compose') {
    return cardShell({
      family: 'Feedback Card / Note',
      state,
      id,
      head: renderTypeSwitch(isAnnotation),
      body: `
        <div class="vc-meta">${context}</div>
        ${renderField({
          type: 'Textarea',
          field: 'body',
          value: body,
          placeholder: 'Write a note…',
        })}
        ${renderField({
          type: 'Input',
          field: 'authorName',
          value: author,
          placeholder: 'Your name',
        })}
        <div class="vc-actions">
          ${renderButton({ style: 'Secondary', label: 'Cancel', action: 'cancel' })}
          ${renderButton({ style: 'Primary', label: 'Save', action: 'save' })}
        </div>
      `,
    })
  }

  return cardShell({
    family: 'Feedback Card / Note',
    state,
    id,
    head: `<strong>Note</strong>`,
    body: `
      <div class="vc-meta">${meta}${badges}</div>
      <div class="vc-body">${body}</div>
      ${repliesHtml}
      ${renderField({ type: 'Textarea', field: 'reply', placeholder: 'Reply… use @name to mention' })}
      <div class="vc-actions">
        ${renderButton({ style: 'Danger', label: 'Delete', action: 'delete' })}
        ${renderButton({ style: 'Secondary', label: resolved ? 'Reopen' : 'Resolve', action: 'resolve' })}
        ${renderButton({ style: 'Primary', label: 'Reply', action: 'reply' })}
      </div>
    `,
  })
}

export function renderAnnotationCard({
  id,
  state = 'Compose',
  kind = 'implement',
  body = '',
  author = '',
  context = '',
  meta = '',
  badges = '',
  repliesHtml = '',
  resolved = false,
} = {}) {
  if (state === 'Compose') {
    return cardShell({
      family: 'Feedback Card / Annotation',
      state,
      id,
      head: renderTypeSwitch(true),
      body: `
        ${renderKindSwitch(kind)}
        <div class="vc-meta">${context}</div>
        ${renderField({
          type: 'Textarea',
          field: 'body',
          value: body,
          placeholder: 'What should engineering know?',
        })}
        ${renderField({
          type: 'Input',
          field: 'authorName',
          value: author,
          placeholder: 'Your name',
        })}
        <div class="vc-actions">
          ${renderButton({ style: 'Secondary', label: 'Cancel', action: 'cancel' })}
          ${renderButton({ style: 'Primary', label: 'Save', action: 'save' })}
        </div>
      `,
    })
  }

  return cardShell({
    family: 'Feedback Card / Annotation',
    state,
    id,
    head: `<strong>Annotation · ${escapeHtml(KIND_LABEL[kind] || 'Implement')}</strong>`,
    body: `
      <div class="vc-meta">${meta}${badges}</div>
      <div class="vc-body">${body}</div>
      ${repliesHtml}
      ${renderField({ type: 'Textarea', field: 'reply', placeholder: 'Reply… use @name to mention' })}
      <div class="vc-actions">
        ${renderButton({ style: 'Danger', label: 'Delete', action: 'delete' })}
        ${renderButton({ style: 'Secondary', label: resolved ? 'Reopen' : 'Resolve', action: 'resolve' })}
        ${renderButton({ style: 'Primary', label: 'Reply', action: 'reply' })}
      </div>
    `,
  })
}

export function renderWordingCard({
  id,
  state = 'Compose',
  suggestedText = '',
  rationale = '',
  originalText = '',
  author = '',
  meta = '',
  badges = '',
  status = 'pending',
} = {}) {
  if (state === 'Compose') {
    return cardShell({
      family: 'Feedback Card / Wording',
      state,
      id,
      head: `<strong>Wording</strong>`,
      body: `
        ${renderField({
          type: 'Textarea',
          field: 'suggestedText',
          value: suggestedText,
          placeholder: 'Suggested copy',
        })}
        ${renderField({
          type: 'Textarea',
          field: 'rationale',
          value: rationale,
          placeholder: 'Why this change? (optional)',
        })}
        ${renderField({
          type: 'Input',
          field: 'authorName',
          value: author,
          placeholder: 'Your name',
        })}
        <div class="vc-actions">
          ${renderButton({ style: 'Secondary', label: 'Cancel', action: 'cancel' })}
          ${renderButton({ style: 'Secondary', label: 'Preview', action: 'preview' })}
          ${renderButton({ style: 'Primary', label: 'Save', action: 'save' })}
        </div>
      `,
    })
  }

  return cardShell({
    family: 'Feedback Card / Wording',
    state,
    id,
    head: `<strong>Wording</strong>`,
    body: `
      <div class="vc-meta">${meta}${badges}</div>
      <div class="vc-body"><b>From</b><br>${originalText}</div>
      <div class="vc-body"><b>To</b><br>${suggestedText}</div>
      ${rationale ? `<div class="vc-body">${rationale}</div>` : ''}
      <div class="vc-actions">
        ${renderButton({ style: 'Secondary', label: 'Preview', action: 'preview' })}
        ${status === 'pending' ? `
          ${renderButton({ style: 'Danger', label: 'Reject', action: 'reject' })}
          ${renderButton({ style: 'Primary', label: 'Approve', action: 'approve' })}
        ` : renderButton({ style: 'Danger', label: 'Delete', action: 'delete' })}
      </div>
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
  itemsHtml = '',
} = {}) {
  const filters = [
    ['all', 'All'],
    ['notes', 'Notes'],
    ['annotations', 'Annotations'],
    ['content', 'Wording'],
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
          ${renderButton({
            style: 'Secondary',
            extraClass: 'vc-collapse',
            action: 'toggle-panel',
            label: collapsed ? '▣' : '−',
            ariaLabel: collapsed ? 'Expand notes panel' : 'Collapse notes panel',
          })}
        </div>
      </div>
      ${collapsed ? '' : `
        <div class="vc-panel-body">
          <div class="vc-panel-tools">
            <label class="vc-panel-search">
              <span aria-hidden="true">
                <svg viewBox="0 0 14 14" width="14" height="14"><path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z"></path><path d="M9 9L12.5 12.5"></path></svg>
              </span>
              <input type="search" data-field="panel-search" value="${escapeHtml(search)}" placeholder="Search" aria-label="Search notes">
            </label>
            ${renderButton({
              style: 'Secondary',
              extraClass: 'vc-panel-tool',
              action: 'cycle-filter',
              label: '≡',
              ariaLabel: `Change filter, currently ${filters.find(([value]) => value === filter)?.[1] || 'All'}`,
            })}
            ${renderButton({
              style: 'Secondary',
              extraClass: 'vc-panel-tool vc-panel-more',
              action: 'toggle-resolved',
              label: '•••',
              ariaLabel: hideResolved ? 'Show resolved notes' : 'Hide resolved notes',
              ariaPressed: hideResolved ? 'false' : 'true',
            })}
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
      `}
    </aside>
  `
}

export { KIND_LABEL }

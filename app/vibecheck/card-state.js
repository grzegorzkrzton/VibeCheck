export function relativeTime(value, now = Date.now()) {
  const timestamp = new Date(value).getTime()
  if (!Number.isFinite(timestamp)) return 'recently'
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000))
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  if (seconds < 3024000) return `${Math.floor(seconds / 604800)} weeks ago`
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: new Date(value).getFullYear() === new Date(now).getFullYear() ? undefined : 'numeric',
  }).format(new Date(value))
}

export function convertDraftType(draft, cardType, originalText = '') {
  const text = draft.recordType === 'suggestion' ? draft.suggestedText : draft.body
  if (cardType === 'Wording') {
    return {
      ...draft,
      recordType: 'suggestion',
      originalText: draft.originalText || originalText,
      suggestedText: text || '',
      rationale: draft.rationale || '',
      status: 'pending',
      resolved: false,
    }
  }
  return {
    ...draft,
    recordType: 'comment',
    type: cardType === 'Annotation' ? 'annotation' : 'note',
    kind: cardType === 'Annotation' ? (draft.kind || 'implement') : null,
    body: text || '',
  }
}

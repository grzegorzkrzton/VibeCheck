export const CURRENT_RELEASE_PHASE = 0

export const RELEASE_FEATURES = [
  { id: 'toggle', phase: 0, label: 'Toggle VibeCheck' },
  { id: 'theme', phase: 0, label: 'Theme' },
  { id: 'comment', phase: 0, label: 'Comment' },
  { id: 'content', phase: 0, label: 'Content' },
  { id: 'notes-panel', phase: 0, label: 'Notes panel' },
  { id: 'resolve-reopen', phase: 0, label: 'Resolve and reopen' },
  { id: 'reply-threads', phase: 0, label: 'Reply threads' },
  { id: 'mentions', phase: 0, label: 'Mentions' },
  { id: 'delete-thread', phase: 0, label: 'Delete thread' },
  { id: 'filter-sort-notes', phase: 0, label: 'Filter and sort notes' },
  { id: 'orphaned-pins', phase: 0, label: 'Orphaned pins' },
  { id: 'shared-feedback', phase: 0, label: 'Shared prototype feedback' },
  { id: 'inspect', phase: 0, label: 'Inspect' },
  { id: 'guides', phase: 0, label: 'Guides' },
  { id: 'ai-prompt', phase: 0, label: 'AI Prompt' },
  { id: 'company-sign-in', phase: 0, label: 'Company sign-in' },
  { id: 'onboarding', phase: 0, label: 'Onboarding' },
  { id: 'display-name', phase: 0, label: 'Display name' },
  { id: 'accessibility', phase: 0, label: 'Accessibility' },
  { id: 'edit-text', phase: 0, label: 'Edit Text' },
  { id: 'inbox', phase: 1, label: 'Inbox' },
  { id: 'color-format', phase: 1, label: 'Color format' },
  { id: 'color-actions', phase: 1, label: 'Toolbar color actions' },
  { id: 'margin', phase: 1, label: 'Margin' },
  { id: 'padding', phase: 1, label: 'Padding' },
  { id: 'move', phase: 1, label: 'Move' },
  { id: 'ai-prompt-v2', phase: 1, label: 'AI Prompt v2' },
  { id: 'annotation', phase: 2, label: 'Annotation' },
  { id: 'toolbar-enhanced-layout', phase: 2, label: 'Toolbar Enhanced Layout' },
  { id: 'flex-align', phase: 2, label: 'Flexbox Align' },
  { id: 'hue-shift', phase: 2, label: 'Hue Shift' },
  { id: 'box-shadows', phase: 2, label: 'Box Shadows' },
  { id: 'search', phase: 2, label: 'Search' },
  { id: 'font-styles', phase: 2, label: 'Font Styles' },
  { id: 'toolbar-role', phase: 4, label: 'Full vs PM Only toolbar' },
]

export function isFeatureEnabled(id) {
  if (globalThis.__VIBECHECK_FEATURES__ === 'all') return true
  const feature = RELEASE_FEATURES.find(item => item.id === id)
  if (!feature) throw new Error(`Unknown release feature: ${id}`)
  return feature.phase <= CURRENT_RELEASE_PHASE
}

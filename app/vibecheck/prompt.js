import { getTrackedChanges } from './tracker'
import { normalizePrototypeUrl } from './url'

export function buildChangePrompt({ url = normalizePrototypeUrl(), changes = getTrackedChanges() } = {}) {
  if (!changes.length) {
    return `You are editing an existing web prototype.
URL: ${url}

No visual or content changes were recorded in this VibeCheck session yet.
Use the toolbar to edit spacing, type, color, or copy on the page, then press Q (AI prompt) again.`
  }

  const grouped = groupChangesBySection(changes)
  const sections = [...grouped.entries()].map(([sectionLabel, sectionChanges]) => {
    const blocks = sectionChanges.map((change, index) => formatChangeBlock(change, index + 1)).join('\n\n')
    return `## ${sectionLabel}\n\n${blocks}`
  }).join('\n\n---\n\n')

  return `You are editing an existing web prototype.
URL: ${url}

Apply ONLY the changes below. Do not refactor unrelated code. Match the prototype's current stack and conventions.

---

${sections}`
}

function groupChangesBySection(changes) {
  const groups = new Map()

  for (const change of changes) {
    const key = change.anchor?.section?.label || 'Page'
    if (!groups.has(key))
      groups.set(key, [])
    groups.get(key).push(change)
  }

  return groups
}

function formatChangeBlock(change, index) {
  const anchor = change.anchor || {}
  const headline = formatHeadline(anchor)
  const codeTarget = formatCodeTarget(anchor)
  const edits = change.diffs.map(diff => {
    if (diff.kind === 'text')
      return `- Text: ${quote(diff.from)} → ${quote(diff.to)}`
    return `- ${diff.prop}: ${diff.from} → ${diff.to}`
  }).join('\n')

  return `### Change ${index} — ${headline}
**Code target**
${codeTarget}

**Edits**
${edits}`
}

function formatHeadline(anchor) {
  const id = anchor.id ? `#${anchor.id}` : ''
  const cls = anchor.classes?.[0] ? `.${anchor.classes[0]}` : ''
  const text = anchor.text ? ` "${truncate(anchor.text, 50)}"` : ''
  return `\`${anchor.tag || 'element'}${id}${cls}\`${text}`
}

function formatCodeTarget(anchor) {
  const lines = [
    `- Tag: \`${anchor.tag || 'unknown'}\``,
    anchor.id
      ? `- ID: \`#${anchor.id}\``
      : '- ID: (none)',
  ]

  if (anchor.classes?.length)
    lines.push(`- Classes: ${anchor.classes.map(name => `\`.${name}\``).join(', ')}`)
  else
    lines.push('- Classes: (none)')

  if (anchor.cssPath)
    lines.push(`- Selector: \`${anchor.cssPath}\``)

  if (anchor.componentHint)
    lines.push(`- Component: \`${anchor.componentHint.name}\` (${anchor.componentHint.source})`)

  if (anchor.role)
    lines.push(`- Role: \`${anchor.role}\``)

  if (anchor.ariaLabel)
    lines.push(`- aria-label: ${quote(anchor.ariaLabel)}`)

  if (anchor.text)
    lines.push(`- Visible text: ${quote(truncate(anchor.text, 80))}`)

  return lines.join('\n')
}

function truncate(value, max) {
  if (!value || value.length <= max) return value || ''
  return `${value.slice(0, max - 1)}…`
}

function quote(value) {
  const text = value || '(empty)'
  return `"${text.replace(/"/g, '\\"')}"`
}

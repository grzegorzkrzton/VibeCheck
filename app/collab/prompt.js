import { describeAnchor } from './anchor'
import { getTrackedChanges } from './tracker'
import { normalizePrototypeUrl } from './url'

export function buildChangePrompt({ url = normalizePrototypeUrl(), changes = getTrackedChanges() } = {}) {
  if (!changes.length) {
    return `You are editing an existing web prototype.
URL: ${url}

No visual or content changes were recorded in this Design Handoff session.
Select elements with the toolbar, edit them (spacing, type, color, or copy), then export the prompt again.`
  }

  const items = changes.map((change, index) => {
    const lines = change.diffs.map(diff => {
      if (diff.kind === 'text')
        return `   - Change text from ${quote(diff.from)} to ${quote(diff.to)}`
      return `   - Change ${diff.prop} from ${diff.from} to ${diff.to}`
    }).join('\n')

    return `${index + 1}. Element: ${change.label || describeAnchor(change.anchor)}\n${lines}`
  }).join('\n')

  return `You are editing an existing web prototype.
URL: ${url}
Make only these visual/content changes:

${items}

Do not refactor unrelated code. Match the prototype’s current stack.`
}

function quote(value) {
  const text = value || '(empty)'
  return `"${text.replace(/"/g, '\\"')}"`
}

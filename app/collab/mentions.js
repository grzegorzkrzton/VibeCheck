const EMAIL = /@([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g
const HANDLE = /@([A-Za-z0-9._-]{2,})/g

export function extractMentions(text = '') {
  const found = new Set()
  for (const match of text.matchAll(EMAIL))
    found.add(match[1].toLowerCase())
  for (const match of text.matchAll(HANDLE)) {
    if (!match[1].includes('@'))
      found.add(match[1].toLowerCase())
  }
  return [...found]
}

export function highlightMentions(text = '') {
  return escapeHtml(text).replace(
    /(@[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|@[A-Za-z0-9._-]{2,})/g,
    '<mark class="mention">$1</mark>',
  )
}

export function escapeHtml(text = '') {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

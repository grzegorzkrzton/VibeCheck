export function normalizePrototypeUrl(raw = location.href) {
  try {
    const url = new URL(raw)
    url.hash = ''
    url.search = ''
    let path = url.pathname || '/'
    if (path.length > 1 && path.endsWith('/'))
      path = path.slice(0, -1)
    return `${url.origin}${path}`
  }
  catch {
    return raw
  }
}

import { beginComment } from '../collab/review-layer'

export function Comment(selectorEngine) {
  const onSelect = els => {
    const el = els?.[0]
    if (el) beginComment(el)
  }

  selectorEngine.onSelectedUpdate(onSelect)

  return () => {
    selectorEngine.removeSelectedCallback(onSelect)
  }
}

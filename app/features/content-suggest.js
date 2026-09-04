import { beginContentSuggestion } from '../collab/review-layer'

export function ContentSuggest(selectorEngine) {
  const onSelect = els => {
    const el = els?.[0]
    if (el) beginContentSuggestion(el)
  }

  selectorEngine.onSelectedUpdate(onSelect)

  return () => {
    selectorEngine.removeSelectedCallback(onSelect)
  }
}

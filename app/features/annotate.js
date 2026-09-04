import { beginAnnotation } from '../collab/review-layer'

export function Annotate(selectorEngine) {
  const onSelect = els => {
    const el = els?.[0]
    if (el) beginAnnotation(el)
  }

  selectorEngine.onSelectedUpdate(onSelect)

  return () => {
    selectorEngine.removeSelectedCallback(onSelect)
  }
}

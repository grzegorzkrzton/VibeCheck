import { beginSuggestionDraft, setFeedbackMode } from '../vibecheck/feedback-ui'

export function ContentSuggest(selectorEngine) {
  setFeedbackMode('content')

  const onSelect = els => {
    const el = els?.[els.length - 1]
    if (!el) return
    beginSuggestionDraft(el)
  }

  selectorEngine.onSelectedUpdate(onSelect, false)

  return () => {
    setFeedbackMode('browse')
    selectorEngine.removeSelectedCallback(onSelect)
  }
}

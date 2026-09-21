import { beginCommentDraft, setFeedbackMode } from '../vibecheck/feedback-ui'

export function Annotations(selectorEngine) {
  setFeedbackMode('annotation')

  const onSelect = els => {
    const el = els?.[els.length - 1]
    if (!el) return
    beginCommentDraft(el, { type: 'annotation' })
  }

  selectorEngine.onSelectedUpdate(onSelect, false)

  return () => {
    setFeedbackMode('browse')
    selectorEngine.removeSelectedCallback(onSelect)
  }
}

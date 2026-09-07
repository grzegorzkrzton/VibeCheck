import { beginCommentDraft, setFeedbackMode } from '../vibecheck/feedback-ui'

export function Comments(selectorEngine) {
  setFeedbackMode('comment')

  const onSelect = els => {
    const el = els?.[els.length - 1]
    if (!el) return
    beginCommentDraft(el)
  }

  selectorEngine.onSelectedUpdate(onSelect)

  return () => {
    setFeedbackMode('browse')
    selectorEngine.removeSelectedCallback(onSelect)
  }
}

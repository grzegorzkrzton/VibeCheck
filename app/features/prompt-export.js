import { buildChangePrompt } from '../collab/prompt'
import { getTrackedChanges } from '../collab/tracker'
import { showToast } from '../components/handoff/toast.element'

export function PromptExport() {
  copyPrompt()
  return () => {}
}

async function copyPrompt() {
  const prompt = buildChangePrompt({ changes: getTrackedChanges() })
  try {
    await navigator.clipboard.writeText(prompt)
  }
  catch {
    const area = document.createElement('textarea')
    area.value = prompt
    document.body.appendChild(area)
    area.select()
    document.execCommand('copy')
    area.remove()
  }
  showToast(getTrackedChanges().length ? 'Prompt copied' : 'Prompt copied — no edits recorded yet')
}

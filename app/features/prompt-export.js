import { buildChangePrompt } from '../vibecheck/prompt'
import { getTrackedChanges } from '../vibecheck/tracker'

export function PromptExport() {
  copyPrompt()
  return () => {}
}

function showToast(message, ms = 2600) {
  let toast = document.getElementById('vibecheck-toast')
  if (!toast) {
    toast = document.createElement('div')
    toast.id = 'vibecheck-toast'
    toast.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:2147483647',
      'background:#16171f', 'color:#f4f4f6', 'border:1px solid #3a3d4a',
      'border-radius:10px', 'padding:10px 14px', 'font:13px/1.4 system-ui,sans-serif',
      'box-shadow:0 10px 40px rgb(0 0 0 / 35%)', 'max-width:280px',
    ].join(';')
    document.documentElement.appendChild(toast)
  }
  toast.textContent = message
  toast.style.display = 'block'
  clearTimeout(showToast._timer)
  showToast._timer = setTimeout(() => { toast.style.display = 'none' }, ms)
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
  const count = getTrackedChanges().length
  showToast(count ? `Prompt copied (${count} change${count === 1 ? '' : 's'})` : 'Prompt copied — edit the page first, then press Q again')
}

import { HotkeyMap } from './base.element'
import { content as icon } from '../vibe-check/vibe-check.icons'

export class ContentHotkeys extends HotkeyMap {
  constructor() {
    super()
    this._hotkey = 'w'
    this._usedkeys = []
    this.tool = 'content'
  }

  show() {
    this.$shadow.host.style.display = 'flex'
  }

  render() {
    return `
      <article>
        <div tool-icon>
          <span>
            ${icon}
            Content Tool
          </span>
        </div>
        <div command>
          Click text, suggest a rewrite, preview, then approve or reject
        </div>
      </article>
    `
  }
}

customElements.define('hotkeys-content', ContentHotkeys)

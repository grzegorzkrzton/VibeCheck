import { HotkeyMap } from './base.element'
import { content as icon } from '../vis-bug/vis-bug.icons'

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
            Wording Tool
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

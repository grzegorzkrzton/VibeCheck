import { HotkeyMap } from './base.element'
import { comments as icon } from '../vibe-check/vibe-check.icons'

export class CommentsHotkeys extends HotkeyMap {
  constructor() {
    super()
    this._hotkey = 'c'
    this._usedkeys = []
    this.tool = 'comments'
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
            Comment Tool
          </span>
        </div>
        <div command>
          Click an element to pin a note or annotation
        </div>
      </article>
    `
  }
}

customElements.define('hotkeys-comments', CommentsHotkeys)

import { HandoffComposerStyles } from '../styles.store'

export class HandoffComposer extends HTMLElement {
  constructor() {
    super()
    this.$shadow = this.attachShadow({ mode: 'open' })
    this.$shadow.adoptedStyleSheets = [HandoffComposerStyles]
    this._onSubmit = event => this.handleSubmit(event)
  }

  set config(value) {
    this._config = value
    this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const cfg = this._config || { mode: 'comment' }
    const title = {
      comment: 'Comment',
      reply: 'Reply',
      annotate: 'Implementation note',
      content: 'Suggest copy',
    }[cfg.mode] || 'Note'

    this.$shadow.innerHTML = `
      <form>
        <strong>${title}</strong>
        ${cfg.mode === 'annotate' ? `
          <label>Type
            <select name="kind">
              <option value="implement">Implement</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </label>` : ''}
        ${cfg.mode === 'content' ? `
          <label>Current copy
            <textarea name="original" readonly>${cfg.originalText || ''}</textarea>
          </label>
          <label>Suggested copy
            <textarea name="suggested" required placeholder="Proposed text"></textarea>
          </label>
          <label>Rationale (optional)
            <textarea name="rationale" placeholder="Why this change?"></textarea>
          </label>` : `
          <label>
            <textarea name="body" required placeholder="${cfg.mode === 'annotate' ? 'What should engineering know?' : 'Leave a comment. Use @email to mention.'}"></textarea>
          </label>`}
        <div class="hint">${cfg.hint || ''}</div>
        <div class="row">
          <button class="cancel" type="button">Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    `

    this.$shadow.querySelector('form').addEventListener('submit', this._onSubmit)
    this.$shadow.querySelector('.cancel').addEventListener('click', () => this.remove())
    this.$shadow.querySelector('textarea[name="body"], textarea[name="suggested"]')?.focus()
  }

  handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    this.dispatchEvent(new CustomEvent('handoff-submit', {
      bubbles: true,
      detail: Object.fromEntries(form.entries()),
    }))
  }
}

customElements.define('handoff-composer', HandoffComposer)

export function placeNear(node, target, { offset = 8 } = {}) {
  const rect = target.getBoundingClientRect()
  node.style.position = 'fixed'
  node.style.top = `${Math.max(8, rect.top)}px`
  node.style.left = `${Math.min(window.innerWidth - 300, rect.right + offset)}px`
}

export function openComposer({ mode, target, originalText, hint, onSubmit }) {
  closeComposer()
  const composer = document.createElement('handoff-composer')
  composer.config = { mode, originalText, hint }
  placeNear(composer, target)
  composer.addEventListener('handoff-submit', event => {
    onSubmit(event.detail)
    composer.remove()
  })
  document.documentElement.appendChild(composer)
  return composer
}

export function closeComposer() {
  document.querySelectorAll('handoff-composer').forEach(node => node.remove())
}

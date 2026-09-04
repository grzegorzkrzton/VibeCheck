import { highlightMentions } from '../../collab/mentions'
import { HandoffPinStyles } from '../styles.store'

export class HandoffPin extends HTMLElement {
  constructor() {
    super()
    this.$shadow = this.attachShadow({ mode: 'open' })
    this.$shadow.adoptedStyleSheets = [HandoffPinStyles]
  }

  set data(value) {
    this._data = value
    this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const item = this._data
    if (!item) return
    const replies = item.replies || []
    this.$shadow.innerHTML = `
      <button class="pin" data-orphaned="${item.orphaned || false}" data-resolved="${item.resolved || false}">${item.index || 1}</button>
      <div class="card">
        <div class="meta">${item.author_name || 'Someone'} · ${item.resolved ? 'Resolved' : 'Open'}${item.orphaned ? ' · element missing' : ''}</div>
        <div class="body">${highlightMentions(item.body || '')}</div>
        ${replies.map(reply => `
          <div class="thread">
            <div class="meta">${reply.author_name || 'Someone'}</div>
            <div class="body">${highlightMentions(reply.body || '')}</div>
          </div>
        `).join('')}
        <div class="actions">
          <button data-act="reply">Reply</button>
          <button data-act="resolve">${item.resolved ? 'Reopen' : 'Resolve'}</button>
        </div>
      </div>
    `
    this.$shadow.querySelector('.pin')?.addEventListener('click', event => {
      event.stopPropagation()
      this.toggleAttribute('open')
    })
    this.$shadow.querySelectorAll('button[data-act]').forEach(button => {
      button.addEventListener('click', event => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('handoff-pin-action', {
          bubbles: true,
          detail: { action: button.dataset.act, comment: item },
        }))
      })
    })
  }
}

customElements.define('handoff-pin', HandoffPin)

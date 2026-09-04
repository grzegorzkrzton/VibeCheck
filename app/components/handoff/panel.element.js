import { highlightMentions } from '../../collab/mentions'
import { HandoffPanelStyles } from '../styles.store'

export class HandoffPanel extends HTMLElement {
  constructor() {
    super()
    this.$shadow = this.attachShadow({ mode: 'open' })
    this.$shadow.adoptedStyleSheets = [HandoffPanelStyles]
    this.filter = 'comments'
  }

  set state(value) {
    this._state = value
    this.render()
  }

  connectedCallback() {
    this.render()
  }

  render() {
    const state = this._state || { user: null, comments: [], annotations: [], suggestions: [], isOwner: false }
    const items = this.itemsFor(state)

    this.$shadow.innerHTML = `
      <section class="panel">
        <header>
          <div>
            <h1>Design Handoff</h1>
            <div class="user">${state.user ? `${state.user.display_name}${state.user.local ? ' · local' : ''}` : 'Not signed in — use the extension popup'}</div>
          </div>
          <button data-act="refresh">Refresh</button>
        </header>
        <nav>
          <button data-filter="comments" aria-selected="${this.filter === 'comments'}">Comments</button>
          <button data-filter="annotations" aria-selected="${this.filter === 'annotations'}">Notes</button>
          <button data-filter="suggestions" aria-selected="${this.filter === 'suggestions'}">Copy</button>
          <button data-filter="all" aria-selected="${this.filter === 'all'}">All</button>
        </nav>
        <div class="list">
          ${items.length ? items.map(item => this.row(item, state)).join('') : `<div class="empty">Nothing here yet. Pick a tool from the left toolbar, then click an element.</div>`}
        </div>
      </section>
    `

    this.$shadow.querySelectorAll('[data-filter]').forEach(button => {
      button.addEventListener('click', () => {
        this.filter = button.dataset.filter
        this.render()
      })
    })

    this.$shadow.querySelectorAll('[data-act]').forEach(button => {
      button.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('handoff-panel-action', {
          bubbles: true,
          composed: true,
          detail: {
            action: button.dataset.act,
            id: button.dataset.id,
            status: button.dataset.status,
            kind: button.dataset.kind,
          },
        }))
      })
    })
  }

  itemsFor(state) {
    const comments = (state.comments || []).filter(item => !item.parent_id).map(item => ({ ...item, kind: 'comment' }))
    const annotations = (state.annotations || []).map(item => ({ ...item, kind: 'annotation' }))
    const suggestions = (state.suggestions || []).map(item => ({ ...item, kind: 'suggestion' }))
    if (this.filter === 'comments') return comments
    if (this.filter === 'annotations') return annotations
    if (this.filter === 'suggestions') return suggestions
    return [...comments, ...annotations, ...suggestions]
  }

  row(item, state) {
    const replies = (state.comments || []).filter(comment => comment.parent_id === item.id)
    return `
      <article class="item ${item.orphaned ? 'orphaned' : ''}">
        <div class="meta">${item.kind} · ${item.author_name || ''} ${item.orphaned ? '· missing element' : ''} ${item.resolved ? '· resolved' : ''} ${item.status ? '· ' + item.status : ''}</div>
        <div>${highlightMentions(item.body || item.suggested_text || '')}</div>
        ${item.original_text ? `<div class="meta">From: ${item.original_text}</div>` : ''}
        ${replies.map(reply => `<div class="meta">${reply.author_name}: ${reply.body}</div>`).join('')}
        <div class="actions">
          ${item.kind === 'comment' ? `<button data-act="reply" data-id="${item.id}">Reply</button>
            <button data-act="resolve" data-id="${item.id}">${item.resolved ? 'Reopen' : 'Resolve'}</button>` : ''}
          ${item.kind === 'annotation' ? `<button data-act="delete-annotation" data-id="${item.id}">Remove</button>` : ''}
          ${item.kind === 'suggestion' && state.isOwner && item.status === 'pending' ? `
            <button data-act="review" data-id="${item.id}" data-status="approved">Approve</button>
            <button data-act="review" data-id="${item.id}" data-status="rejected">Reject</button>` : ''}
        </div>
      </article>
    `
  }
}

customElements.define('handoff-panel', HandoffPanel)

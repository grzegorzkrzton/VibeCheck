import { HandoffAnnotationStyles } from '../styles.store'

export class HandoffAnnotation extends HTMLElement {
  constructor() {
    super()
    this.$shadow = this.attachShadow({ mode: 'open' })
    this.$shadow.adoptedStyleSheets = [HandoffAnnotationStyles]
  }

  set data(value) {
    this._data = value
    this.render()
  }

  render() {
    const item = this._data
    if (!item) return
    this.$shadow.innerHTML = `
      <div class="callout" data-kind="${item.kind || 'implement'}" data-orphaned="${item.orphaned || false}">
        <div class="kind">${item.kind || 'implement'}${item.orphaned ? ' · missing element' : ''}</div>
        <div>${item.body || ''}</div>
        <div class="meta">${item.author_name || ''}</div>
        <button data-act="delete">Remove</button>
      </div>
    `
    this.$shadow.querySelector('button').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('handoff-annotation-delete', {
        bubbles: true,
        detail: { id: item.id },
      }))
    })
  }
}

customElements.define('handoff-annotation', HandoffAnnotation)

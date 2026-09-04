import { HandoffToastStyles } from '../styles.store'

export class HandoffToast extends HTMLElement {
  constructor() {
    super()
    this.$shadow = this.attachShadow({ mode: 'open' })
    this.$shadow.adoptedStyleSheets = [HandoffToastStyles]
  }

  connectedCallback() {
    this.$shadow.innerHTML = `<div class="toast">${this.getAttribute('message') || ''}</div>`
    this.style.right = '24px'
    this.style.bottom = '24px'
  }
}

customElements.define('handoff-toast', HandoffToast)

export function showToast(message, ms = 2400) {
  document.querySelectorAll('handoff-toast').forEach(node => node.remove())
  const toast = document.createElement('handoff-toast')
  toast.setAttribute('message', message)
  document.documentElement.appendChild(toast)
  setTimeout(() => toast.remove(), ms)
}

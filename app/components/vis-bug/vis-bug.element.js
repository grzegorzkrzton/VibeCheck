import $          from 'blingblingjs'
import hotkeys    from 'hotkeys-js'

import {
  Handles, Handle, Label, Overlay, Gridlines, Corners,
  Hotkeys, Metatip, Ally, Distance, BoxModel, Grip
} from '../'

import {
  Selectable, Moveable, Padding, Margin, EditText, Font,
  Flex, Search, ColorPicker, BoxShadow, HueShift, MetaTip,
  Guides, Screenshot, Position, Accessibility, draggable,
  PromptExport, Comments, ContentSuggest,
} from '../../features/'
import { startChangeTracker } from '../../vibecheck/tracker'
import { startFeedbackLayer } from '../../vibecheck/feedback-ui'

import {
  VisBugStyles,
  VisBugLightStyles,
  VisBugDarkStyles
} from '../styles.store'

import { VisBugModel, VisBugPromptTool }  from './model'
import * as Icons                 from './vis-bug.icons'
import { provideSelectorEngine }  from '../../features/search'
import { PluginRegistry }         from '../../plugins/_registry'
import {
  metaKey,
  isPolyfilledCE,
  constructibleStylesheetSupport,
  schemeRule
} from '../../utilities/'

export default class VisBug extends HTMLElement {
  constructor() {
    super()

    this.toolbar_model  = VisBugModel
    this.prompt_tool    = VisBugPromptTool
    this.$shadow        = this.attachShadow({mode: 'closed'})
    this.applyScheme    = schemeRule(
      this.$shadow,
      VisBugStyles, VisBugLightStyles, VisBugDarkStyles
    )
  }

  static get observedAttributes() {
    return ['color-scheme']
  }

  connectedCallback() {
    this._tutsBaseURL = this.getAttribute('tutsBaseURL') || 'tuts'

    this.setup()

    this.selectorEngine = Selectable(this)
    this.colorPicker    = ColorPicker(this.$shadow, this.selectorEngine)

    provideSelectorEngine(this.selectorEngine)
    this.stopChangeTracker = startChangeTracker(this.selectorEngine)
    this.stopFeedbackLayer = startFeedbackLayer()

    this.toolSelected($('[data-tool="guides"]', this.$shadow)[0])
  }

  disconnectedCallback() {
    this.deactivate_feature()
    this.stopChangeTracker?.()
    this.stopFeedbackLayer?.()
    this.teardownToolbarTips()
    this.cleanup()
    this.selectorEngine.disconnect()
    hotkeys.unbind(
      Object.keys(this.toolbar_model).reduce((events, key) =>
        events += ',' + key, '') + ',q')
    hotkeys.unbind(`${metaKey}+/`)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color-scheme')
      this.applyScheme(newValue)
  }

  setup() {
    this.$shadow.innerHTML = this.render()

    this.hasAttribute('color-mode')
      ? this.getAttribute('color-mode')
      : this.setAttribute('color-mode', 'hex')

    this.hasAttribute('color-scheme')
      ? this.getAttribute('color-scheme')
      : this.setAttribute('color-scheme', 'auto')

    this.setAttribute('popover', 'manual')
    this.showPopover && this.showPopover()

    const main_ol = this.$shadow.querySelector('ol:not([colors])')
    const buttonPieces = $('li[data-tool], li[data-tool] *', main_ol)

    const clickEvent = (e) => {
      const target = e.currentTarget || e.target
      const toolButton = target.closest('[data-tool]')
      if (toolButton) this.toolSelected(toolButton) && e.stopPropagation();
    }

    Array.from(buttonPieces)
    .forEach(toolButton => {
      draggable({
        el:this,
        surface: toolButton,
        cursor: 'pointer',
        clickEvent: clickEvent
      })
    })

    draggable({
      el:this,
      surface: main_ol,
      cursor: 'grab',
    })

    this.setupToolbarTips(this.$shadow)

    const promptBtn = $('[data-tool="prompt"]', this.$shadow)[0]
    if (promptBtn) {
      draggable({
        el: this,
        surface: promptBtn,
        cursor: 'pointer',
        clickEvent: e => {
          this.prompt()
          e.stopPropagation()
        },
      })
    }

    Object.entries(this.toolbar_model).forEach(([key, value]) =>
      hotkeys(key, e => {
        e.preventDefault()
        this.toolSelected(
          $(`[data-tool="${value.tool}"]`, this.$shadow)[0]
        )
      })
    )

    hotkeys('q', e => {
      e.preventDefault()
      this.prompt()
    })

    hotkeys(`${metaKey}+/,${metaKey}+.`, e =>
      this.$shadow.host.style.display =
        this.$shadow.host.style.display === 'none'
          ? 'block'
          : 'none')
  }

  cleanup() {
    this.hidePopover && this.hidePopover()

    Array.from(document.body.children)
      .filter(node => node.nodeName.includes('VISBUG'))
      .forEach(el => el.remove())

    this.teardown()

    document.querySelectorAll('[data-pseudo-select=true]')
      .forEach(el =>
        el.removeAttribute('data-pseudo-select'))
  }

  toolSelected(el) {
    if (typeof el === 'string')
      el = $(`[data-tool="${el}"]`, this.$shadow)[0]

    if (this.active_tool && this.active_tool.dataset.tool === el.dataset.tool) {
      if (el.dataset.tool === 'prompt') this.prompt()
      return
    }

    if (this.active_tool) {
      this.active_tool.attr('data-active', null)
      this.deactivate_feature()
    }

    el.attr('data-active', true)
    this.active_tool = el
    this[el.dataset.tool]()
  }

  setupToolbarTips(root) {
    this.teardownToolbarTips()
    this.ensureToolbarTipHost()

    $('li[data-tool]', root).forEach(li => {
      const aside = li.dataset.tool === 'search'
        ? li.querySelector('svg + aside')
        : li.querySelector('aside')

      if (!aside) return

      const trigger = li.dataset.tool === 'search'
        ? li.querySelector('svg')
        : li

      const show = () => {
        clearTimeout(this._tipTimer)
        this._tipTimer = setTimeout(() =>
          this.showToolbarTip(trigger, aside), 1000)
      }

      const hide = () => {
        clearTimeout(this._tipTimer)
        this.hideToolbarTip()
      }

      trigger.addEventListener('mouseenter', show)
      trigger.addEventListener('mouseleave', hide)
      li.addEventListener('mouseleave', hide)
    })
  }

  ensureToolbarTipHost() {
    if (this._tipHost) return

    if (!document.getElementById('vibecheck-tip-styles')) {
      const style = document.createElement('style')
      style.id = 'vibecheck-tip-styles'
      style.textContent = `
        #vibecheck-toolbar-tip {
          position: fixed;
          z-index: 2147483647;
          pointer-events: none;
          opacity: 0;
          transform: translateX(-8px);
          transition: opacity 0.3s ease, transform 0.2s ease;
          direction: ltr;
          text-align: left;
          overflow: hidden;
          border-radius: 1em;
          max-width: min(360px, calc(100vw - 24px));
          font: 16px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
        }
        #vibecheck-toolbar-tip figure { margin: 0; display: grid; }
        #vibecheck-toolbar-tip img { width: 100%; display: block; }
        #vibecheck-toolbar-tip figcaption { padding: 1em; display: grid; gap: 1em; }
        #vibecheck-toolbar-tip h2 {
          margin: 0;
          font-size: 1.5em;
          line-height: 1.1;
          display: grid;
          grid-auto-flow: column;
          justify-content: space-between;
          align-items: center;
        }
        #vibecheck-toolbar-tip h2 u { text-decoration-color: hotpink; }
        #vibecheck-toolbar-tip p { margin: 0; font-size: 1em; line-height: 1.5; }
        #vibecheck-toolbar-tip [table] { display: grid; gap: 0.5em; }
        #vibecheck-toolbar-tip [table] > div {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: 1fr auto;
          justify-content: space-between;
        }
        #vibecheck-toolbar-tip [hotkey] {
          border-radius: .25em;
          height: 1.5em;
          width: 1.5em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid hotpink;
          color: hotpink;
          font-weight: 300;
          font-size: 0.5em;
          text-transform: uppercase;
          box-shadow: 0 2px 2px hsla(0 0% 0% / .25);
        }
      `
      document.head.appendChild(style)
    }

    this._tipHost = document.createElement('div')
    this._tipHost.id = 'vibecheck-toolbar-tip'
    this._tipHost.hidden = true
    document.documentElement.appendChild(this._tipHost)
  }

  showToolbarTip(trigger, aside) {
    if (!this._tipHost || !trigger || !aside) return

    const rect = trigger.getBoundingClientRect()
    const asideStyle = getComputedStyle(aside)

    this._tipHost.innerHTML = aside.innerHTML
    this._tipHost.hidden = false
    this._tipHost.style.background = asideStyle.backgroundColor
    this._tipHost.style.color = asideStyle.color
    this._tipHost.style.boxShadow = asideStyle.boxShadow

    const caption = this._tipHost.querySelector('p')
    const sourceCaption = aside.querySelector('p')
    if (caption && sourceCaption)
      caption.style.color = getComputedStyle(sourceCaption).color

    this._tipHost.style.visibility = 'hidden'
    this._tipHost.style.opacity = '0'
    this._tipHost.style.transform = 'translateX(-8px)'

    let top = rect.top
    let left = rect.right + 12
    this._tipHost.style.left = `${left}px`
    this._tipHost.style.top = `${top}px`

    const tipRect = this._tipHost.getBoundingClientRect()
    if (top + tipRect.height > window.innerHeight - 8)
      top = Math.max(8, window.innerHeight - tipRect.height - 8)
    if (left + tipRect.width > window.innerWidth - 8)
      left = Math.max(8, rect.left - tipRect.width - 12)

    this._tipHost.style.left = `${Math.round(left)}px`
    this._tipHost.style.top = `${Math.round(top)}px`
    this._tipHost.style.visibility = 'visible'

    requestAnimationFrame(() => {
      this._tipHost.style.opacity = '1'
      this._tipHost.style.transform = 'translateX(0)'
    })
  }

  hideToolbarTip() {
    if (!this._tipHost) return
    this._tipHost.style.opacity = '0'
    this._tipHost.style.transform = 'translateX(-8px)'
    setTimeout(() => {
      if (this._tipHost?.style.opacity === '0') {
        this._tipHost.hidden = true
        this._tipHost.innerHTML = ''
      }
    }, 200)
  }

  teardownToolbarTips() {
    clearTimeout(this._tipTimer)
    this._tipTimer = null
    this._tipHost?.remove()
    this._tipHost = null
  }

  render() {
    return `
      <visbug-hotkeys></visbug-hotkeys>
      <ol constructible-support="${constructibleStylesheetSupport ? 'false':'true'}">
        ${Object.entries(this.toolbar_model).reduce((list, [key, tool]) => `
          ${list}
          <li aria-label="${tool.label} Tool" aria-description="${tool.description}" aria-hotkey="${key}" data-tool="${tool.tool}" data-active="${key == 'g'}">
            ${tool.icon}
            ${this.demoTip({key, ...tool})}
          </li>
          ${tool.dividerAfter ? `<li class="vc-divider" aria-hidden="true"></li>` : ''}
        `,'')}
      </ol>
      <ol colors>
        <li class="color" id="foreground" aria-label="Text" aria-description="Change the text color">
          <input type="color">
          ${Icons.color_text}
        </li>
        <li class="color" id="background" aria-label="Background or Fill" aria-description="Change the background color or fill of svg">
          <input type="color">
          ${Icons.color_background}
        </li>
        <li class="color" id="border" aria-label="Border or Stroke" aria-description="Change the border color or stroke of svg">
          <input type="color">
          ${Icons.color_border}
        </li>
        <li class="color prompt-action" aria-label="${this.prompt_tool.label} Tool" aria-description="${this.prompt_tool.description}" aria-hotkey="q" data-tool="${this.prompt_tool.tool}" title="Copy AI prompt (Q)">
          ${this.prompt_tool.icon}
          ${this.demoTip({ key: 'q', ...this.prompt_tool })}
        </li>
      </ol>
    `
  }

  demoTip({key, tool, label, description, instruction, hasTutorial = true}) {
    return `
      <aside ${tool}>
        <figure>
          ${hasTutorial ? `<img src="${this._tutsBaseURL}/${tool}.gif" alt="${description}" />` : ''}
          <figcaption>
            <h2>
              ${label}
              <span hotkey>${key}</span>
            </h2>
            <p>${description}</p>
            ${instruction}
          </figcaption>
        </figure>
      </aside>
    `
  }

  move() {
    this.deactivate_feature = Moveable(this.selectorEngine)
  }

  margin() {
    this.deactivate_feature = Margin(this.selectorEngine)
  }

  padding() {
    this.deactivate_feature = Padding(this.selectorEngine)
  }

  font() {
    this.deactivate_feature = Font(this.selectorEngine)
  }

  text() {
    this.selectorEngine.onSelectedUpdate(EditText)
    this.deactivate_feature = () =>
      this.selectorEngine.removeSelectedCallback(EditText)
  }

  align() {
    this.deactivate_feature = Flex(this.selectorEngine)
  }

  search() {
    this.deactivate_feature = Search($('[data-tool="search"]', this.$shadow))
  }

  boxshadow() {
    this.deactivate_feature = BoxShadow(this.selectorEngine)
  }

  hueshift() {
    this.deactivate_feature = HueShift({
      Color:  this.colorPicker,
      Visbug: this.selectorEngine,
    })
  }

  inspector() {
    this.deactivate_feature = MetaTip(this.selectorEngine)
  }

  accessibility() {
    this.deactivate_feature = Accessibility(this.selectorEngine)
  }

  guides() {
    this.deactivate_feature = Guides(this.selectorEngine)
  }

  screenshot() {
    this.deactivate_feature = Screenshot()
  }

  position() {
    let feature = Position()
    this.selectorEngine.onSelectedUpdate(feature.onNodesSelected)
    this.deactivate_feature = () => {
      this.selectorEngine.removeSelectedCallback(feature.onNodesSelected)
      feature.disconnect()
    }
  }

  prompt() {
    this.deactivate_feature = PromptExport()
  }

  comments() {
    this.deactivate_feature = Comments(this.selectorEngine)
  }

  content() {
    this.deactivate_feature = ContentSuggest(this.selectorEngine)
  }

  execCommand(command) {
    const query = `/${command}`

    if (PluginRegistry.has(query))
      return PluginRegistry.get(query)({
        selected: this.selectorEngine.selection(),
        query
      })

    return Promise.resolve(new Error("Query not found"))
  }

  get activeTool() {
    return this.active_tool.dataset.tool
  }
}

customElements.define('vis-bug', VisBug)

import $          from 'blingblingjs'
import hotkeys    from 'hotkeys-js'

import {
  Handles, Handle, Label, Overlay, Gridlines, Corners,
  Hotkeys, Metatip, Ally, Distance, BoxModel, Grip
} from '../'

import {
  Selectable, Moveable, Padding, Margin, EditText, Font,
  Flex, Search, ColorPicker, BoxShadow, HueShift, MetaTip,
  Guides, Screenshot, Accessibility, draggable,
  PromptExport, Comments, Annotations, ContentSuggest,
} from '../../features/'
import { startChangeTracker } from '../../vibecheck/tracker'
import { startFeedbackLayer, setFeedbackScheme } from '../../vibecheck/feedback-ui'
import { figtreeFontFaceCss } from '../../../design-system/generated/tokens.js'

import {
  VibeCheckStyles,
  VibeCheckLightStyles,
  VibeCheckDarkStyles
} from '../styles.store'

import {
  VibeCheckModel,
  VibeCheckPromptTool,
  TOOLBAR_ROLE_STORAGE_KEY,
  toolbarModelForRole,
} from './model'
import * as Icons                 from './vibe-check.icons'
import { provideSelectorEngine }  from '../../features/search'
import { PluginRegistry }         from '../../plugins/_registry'
import {
  floatingOffset,
  floatingPosition,
  metaKey,
  isPolyfilledCE,
  constructibleStylesheetSupport,
  schemeRule
} from '../../utilities/'

export default class VibeCheck extends HTMLElement {
  constructor() {
    super()

    this.toolbar_role   = 'Full'
    this.toolbar_model  = VibeCheckModel
    this.default_tool_key = 'g'
    this.prompt_tool    = VibeCheckPromptTool
    this.$shadow        = this.attachShadow({mode: 'closed'})
    this.applyScheme    = schemeRule(
      this.$shadow,
      VibeCheckStyles, VibeCheckLightStyles, VibeCheckDarkStyles
    )
  }

  static get observedAttributes() {
    return ['color-scheme']
  }

  async connectedCallback() {
    this._tutsBaseURL = this.getAttribute('tutsBaseURL') || 'tuts'

    await this.loadToolbarRole()
    this.setup()
    this.watchToolbarRole()

    this.selectorEngine = Selectable(this)
    this.colorPicker    = ColorPicker(this.$shadow, this.selectorEngine)

    provideSelectorEngine(this.selectorEngine)
    this.stopChangeTracker = startChangeTracker(this.selectorEngine)
    setFeedbackScheme(this.getAttribute('color-scheme'))
    this.stopFeedbackLayer = startFeedbackLayer()

    this.toolSelected(this.defaultTool())
  }

  disconnectedCallback() {
    this.deactivate_feature()
    this.stopChangeTracker?.()
    this.stopFeedbackLayer?.()
    this.teardownToolbarTips()
    this.unbindToolbarHotkeys()
    this.unwatchToolbarRole()
    this.cleanup()
    this.selectorEngine?.disconnect()
  }

  loadToolbarRole() {
    return new Promise(resolve => {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(TOOLBAR_ROLE_STORAGE_KEY, data => {
          this.applyToolbarRole(data[TOOLBAR_ROLE_STORAGE_KEY] || 'Full')
          resolve(this.toolbar_role)
        })
        return
      }
      this.applyToolbarRole('Full')
      resolve(this.toolbar_role)
    })
  }

  applyToolbarRole(role = 'Full') {
    this.toolbar_role = role === 'PM Only' ? 'PM Only' : 'Full'
    this.toolbar_model = toolbarModelForRole(this.toolbar_role)
    this.default_tool_key = this.toolbar_role === 'PM Only' ? 'i' : 'g'
  }

  defaultTool() {
    return this.toolbar_model[this.default_tool_key]?.tool || 'guides'
  }

  watchToolbarRole() {
    if (typeof chrome === 'undefined' || !chrome.storage?.onChanged) return
    this._onToolbarRoleChange = (changes, area) => {
      if (area !== 'local') return
      const change = changes[TOOLBAR_ROLE_STORAGE_KEY]
      if (!change || change.newValue === this.toolbar_role) return
      this.setToolbarRole(change.newValue || 'Full')
    }
    chrome.storage.onChanged.addListener(this._onToolbarRoleChange)
  }

  unwatchToolbarRole() {
    if (this._onToolbarRoleChange && chrome.storage?.onChanged)
      chrome.storage.onChanged.removeListener(this._onToolbarRoleChange)
    this._onToolbarRoleChange = null
  }

  setToolbarRole(role = 'Full') {
    const previousTool = this.active_tool?.dataset?.tool
    this.deactivate_feature()
    this.unbindToolbarHotkeys()
    this.teardownToolbarTips()
    this.applyToolbarRole(role)
    this.setup()
    const stillVisible = Object.values(this.toolbar_model)
      .some(tool => tool.tool === previousTool)
    const nextTool = stillVisible ? previousTool : this.defaultTool()
    this.toolSelected(nextTool)
  }

  unbindToolbarHotkeys() {
    hotkeys.unbind(
      Object.keys(this.toolbar_model).reduce((events, key) =>
        events += ',' + key, '') + ',q')
    hotkeys.unbind(`${metaKey}+/,${metaKey}+.`)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'color-scheme') {
      this.applyScheme(newValue)
      setFeedbackScheme(newValue)
    }
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
      .filter(node => node.nodeName.includes('VIBECHECK'))
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
      this.active_tool.attr('data-state', 'Default')
      this.deactivate_feature()
    }

    el.attr('data-active', true)
    el.attr('data-state', 'Active')
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
      const fontBase = (() => {
        try {
          if (typeof chrome !== 'undefined' && chrome.runtime?.getURL)
            return chrome.runtime.getURL('fonts/figtree/')
        }
        catch (_) { /* ignore */ }
        return '/fonts/figtree/'
      })()
      const fonts = figtreeFontFaceCss((file) => `${fontBase}${file}`)
      const style = document.createElement('style')
      style.id = 'vibecheck-tip-styles'
      style.textContent = `
        ${fonts}
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
          font-family: var(--vc-font-family, Figtree, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif);
          font-feature-settings: var(--vc-font-feature-settings, "ss01" 1);
          font-size: 16px;
          line-height: 1.4;
          color: var(--vc-text, #f4f4f6);
        }
        #vibecheck-toolbar-tip,
        #vibecheck-toolbar-tip * {
          font-family: inherit;
          font-feature-settings: inherit;
        }
        #vibecheck-toolbar-tip figure { margin: 0; display: grid; }
        #vibecheck-toolbar-tip img { width: 100%; display: block; }
        #vibecheck-toolbar-tip figcaption { padding: 1em; display: grid; gap: 1em; }
        #vibecheck-toolbar-tip h2 {
          margin: 0;
          font: var(--vc-text-heading-xl, 700 24px/32px Figtree, system-ui, sans-serif);
          letter-spacing: var(--vc-text-heading-xl-letter-spacing, 0);
          color: inherit;
          display: grid;
          grid-auto-flow: column;
          justify-content: space-between;
          align-items: center;
        }
        #vibecheck-toolbar-tip h2 u { text-decoration-color: currentColor; }
        #vibecheck-toolbar-tip p {
          margin: 0;
          font: var(--vc-text-body-md, 400 16px/24px Figtree, system-ui, sans-serif);
          letter-spacing: var(--vc-text-body-md-letter-spacing, 0);
          color: var(--vc-icon-subtle, inherit);
        }
        #vibecheck-toolbar-tip [table] {
          display: grid;
          gap: 0.5em;
          color: inherit;
          font: var(--vc-text-body-sm, 400 14px/20px Figtree, system-ui, sans-serif);
        }
        #vibecheck-toolbar-tip [table] > div {
          display: grid;
          grid-auto-flow: column;
          grid-template-columns: 1fr auto;
          justify-content: space-between;
          color: inherit;
        }
        #vibecheck-toolbar-tip [hotkey] {
          border-radius: var(--vc-radius-6, 6px);
          height: 1.5em;
          width: 1.5em;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--vc-surface, #2e3138);
          border: 1px solid var(--vc-border-gray-medium, #5c6370);
          color: inherit;
          font: var(--vc-text-body-xxs, 400 10px/14px Figtree, system-ui, sans-serif);
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
    const hostStyles = getComputedStyle(this)
    for (const name of [
      '--vc-text',
      '--vc-surface',
      '--vc-border-gray-medium',
      '--vc-text-gray-medium',
      '--vc-icon-subtle',
      '--vc-font-family',
      '--vc-font-feature-settings',
      '--vc-text-heading-xl',
      '--vc-text-heading-xl-letter-spacing',
      '--vc-text-body-md',
      '--vc-text-body-md-letter-spacing',
      '--vc-text-body-sm',
      '--vc-text-body-xxs',
      '--vc-radius-6',
    ]) {
      const value = hostStyles.getPropertyValue(name).trim()
      if (value) this._tipHost.style.setProperty(name, value)
    }

    // Force readable title/body: host-page `h2` rules often paint black in light DOM.
    const title = this._tipHost.querySelector('h2')
    if (title) title.style.color = asideStyle.color
    const caption = this._tipHost.querySelector('p')
    const sourceCaption = aside.querySelector('p')
    if (caption && sourceCaption)
      caption.style.color = getComputedStyle(sourceCaption).color

    this._tipHost.style.visibility = 'hidden'
    this._tipHost.style.opacity = '0'

    this._tipHost.style.left = '0'
    this._tipHost.style.top = '0'

    const tipRect = this._tipHost.getBoundingClientRect()
    const position = floatingPosition(rect, tipRect)
    this._tipHost.dataset.side = position.side
    this._tipHost.style.left = `${Math.round(position.left)}px`
    this._tipHost.style.top = `${Math.round(position.top)}px`
    this._tipHost.style.transform = `translateX(${floatingOffset(position.side)}px)`
    this._tipHost.style.visibility = 'visible'

    requestAnimationFrame(() => {
      this._tipHost.style.opacity = '1'
      this._tipHost.style.transform = 'translateX(0)'
    })
  }

  hideToolbarTip() {
    if (!this._tipHost) return
    this._tipHost.style.opacity = '0'
    this._tipHost.style.transform =
      `translateX(${floatingOffset(this._tipHost.dataset.side)}px)`
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
      <vibecheck-hotkeys></vibecheck-hotkeys>
      <ol data-vc-component="Main Toolbar" data-role="${this.toolbar_role}" constructible-support="${constructibleStylesheetSupport ? 'false':'true'}">
        ${Object.entries(this.toolbar_model).reduce((list, [key, tool]) => `
          ${list}
          <li data-vc-component="Toolbar Tool Button" data-state="${key == this.default_tool_key ? 'Active' : 'Default'}" aria-label="${tool.label} Tool" aria-description="${tool.description}" aria-hotkey="${key}" data-tool="${tool.tool}" data-active="${key == this.default_tool_key}">
            ${tool.icon}
            ${this.demoTip({key, ...tool})}
          </li>
          ${tool.dividerAfter ? `<li class="vc-divider" data-vc-component="Toolbar Divider" aria-hidden="true"></li>` : ''}
        `,'')}
      </ol>
      <ol colors data-vc-component="Color & AI Toolbar">
        <li class="color" data-vc-component="Toolbar Color Action" data-type="Text" data-state="Default" id="foreground" aria-label="Text" aria-description="Change the text color">
          <input type="color">
          ${Icons.color_text}
        </li>
        <li class="color" data-vc-component="Toolbar Color Action" data-type="Background" data-state="Default" id="background" aria-label="Background or Fill" aria-description="Change the background color or fill of svg">
          <input type="color">
          ${Icons.color_background}
        </li>
        <li class="color" data-vc-component="Toolbar Color Action" data-type="Border" data-state="Default" id="border" aria-label="Border or Stroke" aria-description="Change the border color or stroke of svg">
          <input type="color">
          ${Icons.color_border}
        </li>
        <li class="color prompt-action" data-vc-component="Toolbar AI Prompt" data-state="Default" aria-label="${this.prompt_tool.label} Tool" aria-description="${this.prompt_tool.description}" aria-hotkey="q" data-tool="${this.prompt_tool.tool}" title="Copy AI prompt (Q)">
          ${this.prompt_tool.icon}
          ${this.demoTip({ key: 'q', ...this.prompt_tool })}
        </li>
      </ol>
    `
  }

  demoTip({key, tool, label, description, instruction, hasTutorial = true}) {
    return `
      <aside ${tool} data-vc-component="Toolbar Tip">
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
      VibeCheck: this.selectorEngine,
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

  prompt() {
    this.deactivate_feature = PromptExport()
  }

  comments() {
    this.deactivate_feature = Comments(this.selectorEngine)
  }

  annotations() {
    this.deactivate_feature = Annotations(this.selectorEngine)
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

customElements.define('vibe-check', VibeCheck)

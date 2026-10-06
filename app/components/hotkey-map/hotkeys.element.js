import $        from 'blingblingjs'
import hotkeys  from 'hotkeys-js'

import { GuidesHotkeys }        from './guides.element'
import { InspectorHotkeys }     from './inspector.element'
import { AccessibilityHotkeys } from './accessibility.element'
import { MoveHotkeys }          from './move.element'
import { MarginHotkeys }        from './margin.element'
import { PaddingHotkeys }       from './padding.element'
import { AlignHotkeys }         from './align.element'
import { HueshiftHotkeys }      from './hueshift.element'
import { BoxshadowHotkeys }     from './boxshadow.element'
import { PositionHotkeys }      from './position.element'
import { FontHotkeys }          from './font.element'
import { TextHotkeys }          from './text.element'
import { SearchHotkeys }        from './search.element'
import { CommentsHotkeys }      from './comments.element'
import { ContentHotkeys }       from './content.element'

import { TOOL_FEATURE_IDS } from '../vibe-check/model'
import { isFeatureEnabled } from '../../vibecheck/release-plan'

export class Hotkeys extends HTMLElement {

  constructor() {
    super()

    this.tool_map = {
      guides:         document.createElement('hotkeys-guides'),
      inspector:      document.createElement('hotkeys-inspector'),
      accessibility:  document.createElement('hotkeys-accessibility'),
      move:           document.createElement('hotkeys-move'),
      margin:         document.createElement('hotkeys-margin'),
      padding:        document.createElement('hotkeys-padding'),
      align:          document.createElement('hotkeys-align'),
      hueshift:       document.createElement('hotkeys-hueshift'),
      boxshadow:      document.createElement('hotkeys-boxshadow'),
      position:       document.createElement('hotkeys-position'),
      font:           document.createElement('hotkeys-font'),
      text:           document.createElement('hotkeys-text'),
      search:         document.createElement('hotkeys-search'),
      comments:       document.createElement('hotkeys-comments'),
      content:        document.createElement('hotkeys-content'),
    }

    const releaseAll = globalThis.__VIBECHECK_FEATURES__ === 'all'

    Object.entries(this.tool_map).forEach(([toolName, tool]) => {
      if (releaseAll) {
        this.appendChild(tool)
        return
      }
      if (toolName === 'position') return
      const featureId = TOOL_FEATURE_IDS[toolName]
      if (featureId && isFeatureEnabled(featureId))
        this.appendChild(tool)
    })
  }

  connectedCallback() {
    hotkeys('shift+/', e =>
      this.cur_tool
        ? this.hideTool()
        : this.showTool())

    hotkeys('esc', e => this.hideTool())
  }

  disconnectedCallback() {}

  hideTool() {
    if (!this.cur_tool) return
    this.cur_tool.hide()
    this.cur_tool = null
  }

  showTool() {
    this.cur_tool = this.tool_map[
      $('vibe-check')[0].activeTool]
    this.cur_tool?.show?.()
  }
}

customElements.define('vibecheck-hotkeys', Hotkeys)

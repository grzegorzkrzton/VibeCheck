import $ from 'blingblingjs'
import hotkeys from 'hotkeys-js'
import { querySelectorAllDeep } from 'query-selector-shadow-dom'
import { PluginRegistry, PluginHints } from '../plugins/_registry'
import { floatingOffset, floatingPosition, notList } from '../utilities'
import { isFirefox } from '../utilities/cross-browser.js'

let SelectorEngine

// create input
const search_base = document.createElement('div')
search_base.classList.add('search')
search_base.dataset.vcComponent = 'Toolbar Search Popout'
search_base.dataset.vcFloating = 'search'
search_base.dataset.state = 'Open'
search_base.innerHTML = `
  <input list="vibecheck-plugins" type="search" placeholder="ex: images, .btn, button, text, ..."/>
  <datalist id="vibecheck-plugins">
    ${isFirefox > 0
      ?  `<option value="h1, h2, h3, .get-multiple">
          <option value="nav > a:first-child">
          <option value="#get-by-id">
          <option value=".get-by.class-names">
          <option value="images">
          <option value="text">
          <hr>`

      :  `<option value="h1, h2, h3, .get-multiple">example</option>
          <option value="nav > a:first-child">example</option>
          <option value="#get-by-id">example</option>
          <option value=".get-by.class-names">example</option>
          <option value="images">alias</option>
          <option value="text">alias</option>
          <hr>`}

    ${PluginHints.reduce((options, hint) =>
      options += isFirefox > 0
        ? `<option value="${hint.command}">`
        : `<option value="${hint.command}">${hint.description}`
    , '')}
  </datalist>
`

const search        = $(search_base)
const searchInput   = $('input', search_base)

let positionFrame

const ensureSearchStyles = () => {
  if (document.getElementById('vibecheck-search-styles')) return
  const style = document.createElement('style')
  style.id = 'vibecheck-search-styles'
  style.textContent = `
    [data-vc-floating="search"] {
      position: fixed;
      z-index: 2147483647;
      display: none;
      height: 36px;
      width: min(250px, calc(100vw - 24px));
      overflow: hidden;
      border-radius: 2em;
      box-shadow: 0 0.25em 0.5em hsl(0 0% 0% / 18%);
      opacity: 0;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    [data-vc-floating="search"] > input {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      border: 0;
      outline: 0;
      padding: 0.4em 0.75em;
      background: inherit;
      color: inherit;
      caret-color: hotpink;
      font: 16px/1.4 system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
      direction: ltr;
      -webkit-appearance: none;
    }
    [data-vc-floating="search"] > input::placeholder {
      color: currentColor;
      opacity: 0.65;
      font-size: 0.8em;
      font-weight: lighter;
    }
  `
  document.head.appendChild(style)
}

const placeSearchBar = trigger => {
  if (!trigger?.isConnected || search_base.style.display === 'none') return
  const anchorRect = trigger.getBoundingClientRect()
  const floatingRect = search_base.getBoundingClientRect()
  const position = floatingPosition(anchorRect, floatingRect)
  search_base.dataset.side = position.side
  search_base.dataset.direction = position.side === 'left' ? 'Left' : 'Right'
  search_base.style.left = `${Math.round(position.left)}px`
  search_base.style.top = `${Math.round(position.top)}px`
}

const trackSearchBar = trigger => {
  placeSearchBar(trigger)
  positionFrame = requestAnimationFrame(() => trackSearchBar(trigger))
}

const resolvedTheme = trigger => {
  const probe = document.createElement('span')
  probe.style.cssText = `
    position: absolute;
    visibility: hidden;
    background: var(--theme-bg);
    color: var(--theme-text_color);
  `
  trigger.appendChild(probe)
  const style = getComputedStyle(probe)
  const theme = {
    background: style.backgroundColor,
    color: style.color,
  }
  probe.remove()
  return theme
}

const showSearchBar = trigger => {
  ensureSearchStyles()
  if (!search_base.isConnected)
    document.documentElement.appendChild(search_base)

  const theme = resolvedTheme(trigger)
  search_base.style.background = theme.background
  search_base.style.color = theme.color
  search_base.style.display = 'block'
  search_base.style.visibility = 'hidden'
  placeSearchBar(trigger)
  search_base.style.opacity = '0'
  search_base.style.transform = `translateX(${floatingOffset(search_base.dataset.side)}px)`
  search_base.style.visibility = 'visible'

  cancelAnimationFrame(positionFrame)
  requestAnimationFrame(() => {
    search_base.style.opacity = '1'
    search_base.style.transform = 'translateX(0)'
    trackSearchBar(trigger)
  })
}

const hideSearchBar = () => {
  cancelAnimationFrame(positionFrame)
  positionFrame = null
  search_base.style.display = 'none'
}
const stopBubbling  = e => e.key != 'Escape' && e.stopPropagation()

export function Search(node) {
  const trigger = node?.[0]
  if (!trigger) return () => {}

  const onQuery = e => {
    e.preventDefault()
    e.stopPropagation()

    const query = e.target.value

    window.requestIdleCallback(_ =>
      queryPage(query))
  }

  const focus = e =>
    searchInput[0].focus()

  searchInput.on('click', focus)
  searchInput.on('input', onQuery)
  searchInput.on('keydown', stopBubbling)
  // searchInput.on('blur', hideSearchBar)

  showSearchBar(trigger)
  focus()

  // hotkeys('escape,esc', (e, handler) => {
  //   hideSearchBar()
  //   hotkeys.unbind('escape,esc')
  // })

  return () => {
    hideSearchBar()
    searchInput.off('oninput', onQuery)
    searchInput.off('keydown', stopBubbling)
    searchInput.off('blur', hideSearchBar)
  }
}

export function provideSelectorEngine(Engine) {
  SelectorEngine = Engine
}

export function queryPage(query, fn) {
  // todo: should stash a cleanup method to be called when query doesnt match
  if (PluginRegistry.has(query))
    return PluginRegistry.get(query)({
      selected: SelectorEngine.selection(),
      query
    })

  if (query == 'links')     query = 'a'
  if (query == 'buttons')   query = 'button'
  if (query == 'images')    query = 'img'
  if (query == 'text')      query = 'p,caption,a,h1,h2,h3,h4,h5,h6,small,date,time,li,dt,dd'

  if (!query) return SelectorEngine.unselect_all()
  if (query == '.' || query == '#' || query.trim().endsWith(',')) return

  try {
    let matches = querySelectorAllDeep(query + notList)
    if (!matches.length) matches = querySelectorAllDeep(query)
    if (matches.length) {
      matches.forEach(el =>
        fn
          ? fn(el)
          : SelectorEngine.select(el))
    }
  }
  catch (err) {}
}

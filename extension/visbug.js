import {gimmeToggle} from "./contextmenu/launcher.js"
import {getColorMode} from "./contextmenu/colormode.js"
import {getColorScheme} from "./contextmenu/colorscheme.js"

const state = {
  loaded:   {},
  injected: {},
}

var platform = typeof browser === 'undefined'
  ? chrome
  : browser

async function injectToolbarCss(tab_id) {
  const url = platform.runtime.getURL('toolbar/bundle.css')
  const response = await fetch(url)

  if (!response.ok)
    throw new Error(
      'Missing toolbar/bundle.css in the loaded extension folder. ' +
      'Load unpacked from the extension/ directory, run git pull, then npm run extension:build if needed.'
    )

  const css = await response.text()
  await platform.scripting.insertCSS({
    target: {tabId: tab_id},
    css,
  })
}

const toggleIn = async ({id: tab_id}) => {
  if (!tab_id) return

  try {
    // toggle out: it's currently loaded and injected
    if (state.loaded[tab_id] && state.injected[tab_id]) {
      await platform.scripting.executeScript({
        target: {tabId: tab_id},
        files: ['toolbar/eject.js'],
      })
      state.injected[tab_id] = false
    }

    // toggle in: it's loaded and needs injected
    else if (state.loaded[tab_id] && !state.injected[tab_id]) {
      await platform.scripting.executeScript({
        target: {tabId: tab_id},
        files: ['toolbar/restore.js'],
      })
      state.injected[tab_id] = true
      getColorMode()
      getColorScheme()
    }

    // fresh start in tab
    else {
      await injectToolbarCss(tab_id)
      await platform.scripting.executeScript({
        target: {tabId: tab_id},
        files: ['toolbar/inject.js'],
      })

      state.loaded[tab_id]    = true
      state.injected[tab_id]  = true
      getColorMode()
      getColorScheme()
    }
  }
  catch (error) {
    console.error('[Design Handoff / VisBug]', error)
    throw error
  }

  platform.tabs.onUpdated.addListener(function(tabId) {
    if (tabId === tab_id)
      state.loaded[tabId] = false
  })
}

gimmeToggle(toggleIn)

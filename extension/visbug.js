import {gimmeToggle} from "./contextmenu/launcher.js"
import {getColorMode} from "./contextmenu/colormode.js"
import {getColorScheme} from "./contextmenu/colorscheme.js"
import { handleCollabMessage } from "./collab/messages.js"

const state = {
  loaded:   {},
  injected: {},
}

var platform = typeof browser === 'undefined'
  ? chrome
  : browser

const toggleIn = ({id:tab_id}) => {
  if (!tab_id) return

  if (state.loaded[tab_id] && state.injected[tab_id]) {
    platform.scripting.executeScript({
      target: {tabId: tab_id},
      files: ['toolbar/eject.js'],
    })
    state.injected[tab_id] = false
  }
  else if (state.loaded[tab_id] && !state.injected[tab_id]) {
    platform.scripting.executeScript({
      target: {tabId: tab_id},
      files: ['toolbar/restore.js'],
    })
    state.injected[tab_id] = true
    getColorMode()
    getColorScheme()
  }
  else {
    platform.scripting.insertCSS({
      target: {tabId: tab_id},
      files: ['toolbar/bundle.css' ],
    })
    platform.scripting.executeScript({
      target: {tabId: tab_id},
      files: ['toolbar/inject.js'],
    })

    state.loaded[tab_id]    = true
    state.injected[tab_id]  = true
    getColorMode()
    getColorScheme()
  }

  platform.tabs.onUpdated.addListener(function(tabId) {
    if (tabId === tab_id)
      state.loaded[tabId] = false
  })
}

gimmeToggle(toggleIn)

platform.commands?.onCommand.addListener(async (command, tab) => {
  if (command !== 'toggle-handoff') return
  const target = tab || (await platform.tabs.query({ active: true, currentWindow: true }))[0]
  if (target) toggleIn(target)
})

platform.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'HANDOFF_TOGGLE_TAB') {
    const tab = message.payload?.tab || sender.tab
    if (tab) toggleIn(tab)
    sendResponse({ ok: true })
    return
  }

  if (!message?.type?.startsWith('HANDOFF_')) return
  handleCollabMessage(message, sender).then(sendResponse)
  return true
})

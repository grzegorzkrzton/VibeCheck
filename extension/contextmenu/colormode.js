import { isFeatureEnabled } from '../release-plan.js'

const storagekey = 'vibecheck-color-mode'
const defaultcolormode = 'hex'

const color_options = [
  'hsl',
  'hex',
  'rgb',
]

const colormodestate = {
  mode: defaultcolormode
}

var platform = typeof browser === 'undefined'
  ? chrome
  : browser

const sendColorMode = () => {
  platform.tabs.query({active: true, currentWindow: true}, ([tab]) => {
    if (!tab?.id) return
    platform.tabs.sendMessage(tab.id, {
      action: 'COLOR_MODE',
      params: {mode: colormodestate.mode},
    }).catch(() => {
      // No listener yet — VibeCheck is not injected on this tab.
    })
  })
}

export const getColorMode = () => {
  if (!isFeatureEnabled('color-format')) {
    colormodestate.mode = defaultcolormode
    sendColorMode()
    return defaultcolormode
  }

  platform.storage.sync.get([storagekey], value => {
    let found_value = value[storagekey]

    const is_default = found_value
      ? value[storagekey] === defaultcolormode
      : false

    if (!found_value && !is_default) {
      found_value = defaultcolormode
      platform.storage.sync.set({[storagekey]: defaultcolormode})
    }

    if (found_value === 'hsla') {
      found_value = 'hsl'
      platform.storage.sync.set({[storagekey]: found_value})
    }
    if (found_value === 'rgba') {
      found_value = 'rgb'
      platform.storage.sync.set({[storagekey]: found_value})
    }

    color_options.forEach(option => {
      platform.contextMenus.update(option, {
        checked: option === found_value
      })
    })

    colormodestate.mode = found_value
    sendColorMode()

    return found_value
  })
}

getColorMode()

if (isFeatureEnabled('color-format')) {
  platform.contextMenus.create({
    id:     'color-mode',
    title:  'Colors',
    contexts: ['all'],
  })

  color_options.forEach(option => {
    platform.contextMenus.create({
      id:       option,
      parentId: 'color-mode',
      title:    ' '+option,
      checked:  false,
      type:     'radio',
      contexts: ['all'],
    })
  })

  platform.contextMenus.onClicked.addListener(({parentMenuItemId, menuItemId}, tab) => {
    if (parentMenuItemId !== 'color-mode') return

    platform.storage.sync.set({[storagekey]: menuItemId})
    colormodestate.mode = menuItemId

    sendColorMode()
  })
}

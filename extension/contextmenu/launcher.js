var platform = typeof browser === 'undefined'
  ? chrome
  : browser

var toggleIt

export const gimmeToggle = toggleIn => {
  toggleIt = toggleIn
  platform.action.onClicked.addListener(toggleIt)
}

function createMenus() {
  platform.contextMenus.create({
    id:     'launcher',
    title:  'Show/Hide VibeCheck',
    contexts: ['all'],
  })
  platform.contextMenus.create({
    id:     'account',
    title:  'VibeCheck account settings',
    contexts: ['all'],
  })
}

if (platform.contextMenus.removeAll) {
  platform.contextMenus.removeAll(() => createMenus())
}
else {
  createMenus()
}

platform.contextMenus.onClicked.addListener(({menuItemId}, tab) => {
  if (menuItemId === 'launcher')
    toggleIt(tab)
  if (menuItemId === 'account') {
    openAccountTab().catch(error => {
      console.error('[VibeCheck] Could not open account settings tab', error)
    })
  }
})

async function openAccountTab() {
  await platform.tabs.create({
    url: platform.runtime.getURL('popup/index.html'),
    active: true,
  })
}

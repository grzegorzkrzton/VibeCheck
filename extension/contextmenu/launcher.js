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
    title:  'VibeCheck account & inbox',
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
    platform.windows.create({
      url: platform.runtime.getURL('popup/index.html'),
      type: 'popup',
      width: 420,
      height: 640,
    })
  }
})

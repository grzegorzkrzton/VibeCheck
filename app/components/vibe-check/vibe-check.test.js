import test from 'ava'

import { setupPptrTab, teardownPptrTab, getActiveTool, pptrMetaKey }
from '../../../tests/helpers'

test.beforeEach(setupPptrTab)

test('Should have guides as default tool', async t => {
  const { page } = t.context
  t.is(await getActiveTool(page), 'guides')
  t.pass()
})

test('Should have 15 tools and 3 dividers', async t => {
  const { page } = t.context
  const tools = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelectorAll('ol:first-of-type > li[data-tool]').length`)
  const dividers = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelectorAll('ol:first-of-type > li.vc-divider').length`)
  const mapped = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelector('[data-vc-component="Main Toolbar"]') !== null`)

  t.is(tools, 15)
  t.is(dividers, 3)
  t.true(mapped)
  t.pass()
})

test('Should have 15 key trainers', async t => {
  const { page } = t.context
  const trainers = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelectorAll('vibecheck-hotkeys > *').length`)

  t.is(trainers, 15)
  t.pass()
})

test('Should have 3 color controls and an AI action', async t => {
  const { page } = t.context
  const pickers = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelectorAll('ol[colors] > li.color:not(.prompt-action)').length`)
  const ai = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelectorAll('ol[colors] > li.prompt-action').length`)
  const colorBar = await page.evaluate(`document.querySelector('vibe-check').$shadow.querySelector('[data-vc-component="Color & AI Toolbar"]') !== null`)

  t.is(pickers, 3)
  t.is(ai, 1)
  t.true(colorBar)
  t.pass()
})

test('Search opens outside the toolbar toward available space', async t => {
  const { page } = t.context

  const positions = await page.evaluate(async () => {
    const toolbar = document.querySelector('vibe-check')
    toolbar.style.left = '8px'
    toolbar.toolSelected('search')
    await new Promise(resolve => setTimeout(resolve, 50))

    const search = document.querySelector('[data-vc-floating="search"]')
    const trigger = toolbar.$shadow.querySelector('[data-tool="search"]')
    const left = {
      side: search.dataset.side,
      search: search.getBoundingClientRect().toJSON(),
      trigger: trigger.getBoundingClientRect().toJSON(),
    }

    toolbar.style.left =
      `${window.innerWidth - toolbar.getBoundingClientRect().width - 8}px`
    await new Promise(resolve => setTimeout(resolve, 50))
    const right = {
      side: search.dataset.side,
      search: search.getBoundingClientRect().toJSON(),
      trigger: trigger.getBoundingClientRect().toJSON(),
    }

    return { left, right, viewportWidth: window.innerWidth }
  })

  t.is(positions.left.side, 'right')
  t.true(positions.left.search.left >= positions.left.trigger.right)
  t.is(positions.right.side, 'left')
  t.true(positions.right.search.right <= positions.right.trigger.left)
  t.true(positions.right.search.left >= 8)
  t.true(positions.right.search.right <= positions.viewportWidth - 8)
})

test('Toolbar tips open toward available space', async t => {
  const { page } = t.context

  const sides = await page.evaluate(() => {
    const toolbar = document.querySelector('vibe-check')
    const trigger = toolbar.$shadow.querySelector('[data-tool="guides"]')
    const aside = trigger.querySelector('aside')

    toolbar.style.left = '8px'
    toolbar.showToolbarTip(trigger, aside)
    const left = document.getElementById('vibecheck-toolbar-tip').dataset.side

    toolbar.style.left =
      `${window.innerWidth - toolbar.getBoundingClientRect().width - 8}px`
    toolbar.showToolbarTip(trigger, aside)
    const right = document.getElementById('vibecheck-toolbar-tip').dataset.side

    return { left, right }
  })

  t.is(sides.left, 'right')
  t.is(sides.right, 'left')
})

test('Should allow selecting 1 element', async t => {
  const { page } = t.context

  await page.click(`[intro]`)

  const handles_elements = await page.evaluate(`document.querySelectorAll('vibecheck-handles').length`)

  t.is(handles_elements, 1)

  t.pass()
})

test('Should allow multi-selection', async t => {
  const { page } = t.context

  await page.click(`.artboard:nth-of-type(1)`)
  await page.keyboard.down('Shift')
  await page.click(`.artboard:nth-of-type(2)`)
  await page.keyboard.up('Shift')

  const handles_elements = await page.evaluate(`document.querySelectorAll('vibecheck-handles').length`)

  t.is(handles_elements, 2)

  t.pass()
})

test('Should allow deselecting', async t => {
  const { page } = t.context

  await page.click(`.artboard:nth-of-type(1)`)
  const handles_elements = await page.evaluate(`document.querySelectorAll('vibecheck-handles').length`)
  t.is(handles_elements, 1)

  await page.keyboard.press('Escape')
  const new_handles_elements = await page.evaluate(`document.querySelectorAll('vibecheck-handles').length`)
  t.is(new_handles_elements, 0)

  t.pass()
})

test('Should be hideable', async t => {
  const { page } = t.context
  const metaKey = await pptrMetaKey(page)

  await page.keyboard.down(metaKey)
  await page.keyboard.down('.')
  await page.keyboard.up(metaKey)
  await page.keyboard.up('.')

  const visibility = await page.evaluate(`document.querySelector('vibe-check').$shadow.host.style.display`)

  t.is(visibility, 'none')
  t.pass()
})

test('Should accept valid execCommand', async t => {
  const { page } = t.context
  const execCommand = await page.evaluate(`document.querySelector('vibe-check').execCommand('shuffle')`)

  t.is(execCommand, undefined)
  t.pass()
})

test('Should throw on invalid execCommand', async t => {
  const { page } = t.context
  const execCommand = await page.evaluate(`document.querySelector('vibe-check').execCommand('invalid command')`)

  t.deepEqual(execCommand, {})
  t.pass()
})

test.afterEach(teardownPptrTab)

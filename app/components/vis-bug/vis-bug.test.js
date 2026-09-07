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
  const tools = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelectorAll('ol:first-of-type > li[data-tool]').length`)
  const dividers = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelectorAll('ol:first-of-type > li.vc-divider').length`)
  const mapped = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelector('[data-vc-component="Main Toolbar"]') !== null`)

  t.is(tools, 15)
  t.is(dividers, 3)
  t.true(mapped)
  t.pass()
})

test('Should have 15 key trainers', async t => {
  const { page } = t.context
  const trainers = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelectorAll('visbug-hotkeys > *').length`)

  t.is(trainers, 15)
  t.pass()
})

test('Should have 3 color controls and an AI action', async t => {
  const { page } = t.context
  const pickers = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelectorAll('ol[colors] > li.color:not(.prompt-action)').length`)
  const ai = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelectorAll('ol[colors] > li.prompt-action').length`)
  const colorBar = await page.evaluate(`document.querySelector('vis-bug').$shadow.querySelector('[data-vc-component="Color & AI Toolbar"]') !== null`)

  t.is(pickers, 3)
  t.is(ai, 1)
  t.true(colorBar)
  t.pass()
})

test('Should allow selecting 1 element', async t => {
  const { page } = t.context

  await page.click(`[intro]`)

  const handles_elements = await page.evaluate(`document.querySelectorAll('visbug-handles').length`)

  t.is(handles_elements, 1)

  t.pass()
})

test('Should allow multi-selection', async t => {
  const { page } = t.context

  await page.click(`.artboard:nth-of-type(1)`)
  await page.keyboard.down('Shift')
  await page.click(`.artboard:nth-of-type(2)`)
  await page.keyboard.up('Shift')

  const handles_elements = await page.evaluate(`document.querySelectorAll('visbug-handles').length`)

  t.is(handles_elements, 2)

  t.pass()
})

test('Should allow deselecting', async t => {
  const { page } = t.context

  await page.click(`.artboard:nth-of-type(1)`)
  const handles_elements = await page.evaluate(`document.querySelectorAll('visbug-handles').length`)
  t.is(handles_elements, 1)

  await page.keyboard.press('Escape')
  const new_handles_elements = await page.evaluate(`document.querySelectorAll('visbug-handles').length`)
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

  const visibility = await page.evaluate(`document.querySelector('vis-bug').$shadow.host.style.display`)

  t.is(visibility, 'none')
  t.pass()
})

test('Should accept valid execCommand', async t => {
  const { page } = t.context
  const execCommand = await page.evaluate(`document.querySelector('vis-bug').execCommand('shuffle')`)

  t.is(execCommand, undefined)
  t.pass()
})

test('Should throw on invalid execCommand', async t => {
  const { page } = t.context
  const execCommand = await page.evaluate(`document.querySelector('vis-bug').execCommand('invalid command')`)

  t.deepEqual(execCommand, {})
  t.pass()
})

test.afterEach(teardownPptrTab)

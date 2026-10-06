import test from 'ava'
import { launchPuppeteer } from '../../tests/puppeteer-launch.cjs'
import { gotoTestApp } from '../../tests/helpers'

const PHASE0_TOOLS = [
  'inspector',
  'guides',
  'accessibility',
  'text',
  'comments',
  'content',
]

test.before(async t => {
  t.context.browser = await launchPuppeteer()
  t.context.page = await t.context.browser.newPage()
  await gotoTestApp(t.context.page)
})

test.after.always(async t => {
  await t.context.page?.close()
  await t.context.browser?.close()
})

test.serial('Phase 0 toolbar exposes only release tools in order', async t => {
  const { page } = t.context
  const tools = await page.evaluate(() =>
    [...document.querySelector('vibe-check').$shadow
      .querySelectorAll('ol:first-of-type > li[data-tool]')]
      .map(li => li.dataset.tool),
  )
  t.deepEqual(tools, PHASE0_TOOLS)
})

test.serial('Phase 0 hides layout and annotation tools', async t => {
  const { page } = t.context
  const tools = await page.evaluate(() =>
    [...document.querySelector('vibe-check').$shadow
      .querySelectorAll('ol:first-of-type > li[data-tool]')]
      .map(li => li.dataset.tool),
  )
  for (const hidden of [
    'margin', 'padding', 'move', 'annotations', 'align',
    'hueshift', 'boxshadow', 'font', 'search',
  ])
    t.false(tools.includes(hidden))
})

test.serial('Phase 0 toolbar dividers and color bar', async t => {
  const { page } = t.context
  const counts = await page.evaluate(() => {
    const shadow = document.querySelector('vibe-check').$shadow
    return {
      dividers: shadow.querySelectorAll('ol:first-of-type > li.vc-divider').length,
      colorPickers: shadow.querySelectorAll('ol[colors] > li.color:not(.prompt-action)').length,
      prompt: shadow.querySelectorAll('ol[colors] > li.prompt-action').length,
      trainers: shadow.querySelectorAll('vibecheck-hotkeys > *').length,
    }
  })
  t.is(counts.dividers, 1)
  t.is(counts.colorPickers, 0)
  t.is(counts.prompt, 1)
  t.is(counts.trainers, 6)
})

test.serial('Phase 0 default tool is guides', async t => {
  const { page } = t.context
  const active = await page.$eval('vibe-check', el => el.activeTool)
  t.is(active, 'guides')
})

test.serial('margin hotkey does not add a margin tool button', async t => {
  const { page } = t.context
  await page.keyboard.press('m')
  const hasMargin = await page.evaluate(() =>
    Boolean(document.querySelector('vibe-check').$shadow
      .querySelector('ol:first-of-type > li[data-tool="margin"]')),
  )
  t.false(hasMargin)
})

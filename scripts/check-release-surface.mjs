import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { launchPuppeteer } = require('../tests/puppeteer-launch.cjs')

const PHASE0_TOOLS = [
  'inspector',
  'guides',
  'accessibility',
  'text',
  'comments',
  'content',
]

const browser = await launchPuppeteer()
const page = await browser.newPage()
page.setDefaultNavigationTimeout(60_000)
await page.goto(process.env.VIBECHECK_TEST_URL || 'http://localhost:3000', {
  waitUntil: 'domcontentloaded',
})
await page.evaluateHandle(`document.body.setAttribute('testing', true)`)
await page.waitForSelector('vibe-check')

const tools = await page.evaluate(() =>
  [...document.querySelector('vibe-check').$shadow
    .querySelectorAll('ol:first-of-type > li[data-tool]')]
    .map(li => li.dataset.tool),
)
assert.deepEqual(tools, PHASE0_TOOLS)

const counts = await page.evaluate(() => {
  const shadow = document.querySelector('vibe-check').$shadow
  return {
    dividers: shadow.querySelectorAll('ol:first-of-type > li.vc-divider').length,
    colorPickers: shadow.querySelectorAll('ol[colors] > li.color:not(.prompt-action)').length,
    prompt: shadow.querySelectorAll('ol[colors] > li.prompt-action').length,
    trainers: shadow.querySelectorAll('vibecheck-hotkeys > *').length,
    activeTool: document.querySelector('vibe-check').activeTool,
  }
})
assert.equal(counts.dividers, 1)
assert.equal(counts.colorPickers, 0)
assert.equal(counts.prompt, 1)
assert.equal(counts.trainers, 6)
assert.equal(counts.activeTool, 'guides')

await page.keyboard.press('m')
const hasMargin = await page.evaluate(() =>
  Boolean(document.querySelector('vibe-check').$shadow
    .querySelector('ol:first-of-type > li[data-tool="margin"]')),
)
assert.equal(hasMargin, false)

await page.close()
await browser.close()

console.log('Phase 0 release surface checks passed')

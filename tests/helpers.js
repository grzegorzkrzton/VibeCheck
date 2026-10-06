import puppeteer from 'puppeteer'
import { puppeteerLaunchOptions } from './puppeteer-launch.cjs'

export const TEST_APP_URL = process.env.VIBECHECK_TEST_URL || 'http://localhost:3000'

export async function gotoTestApp(page) {
  page.setDefaultNavigationTimeout(60_000)
  page.setDefaultTimeout(60_000)
  await page.goto(TEST_APP_URL, { waitUntil: 'domcontentloaded' })
  await page.evaluateHandle(`document.body.setAttribute('testing', true)`)
  await page.waitForSelector('vibe-check')
}

export const setupPptrTab = async t => {
  t.context.browser  = await puppeteer.launch(puppeteerLaunchOptions())
  t.context.page     = await t.context.browser.newPage()
  await t.context.page.evaluateOnNewDocument(() => {
    window.__VIBECHECK_FEATURES__ = 'all'
  })

  await gotoTestApp(t.context.page)
}

export const teardownPptrTab = async ({ context: { page, browser } }) => {
  await page?.close()
  await browser?.close()
}

export const changeMode = async ({page, tool}) =>
  await page.evaluateHandle(`
    var mouseUpEvent = document.createEvent("MouseEvents");
    mouseUpEvent.initEvent("mouseup", true, true);
    document.querySelector('vibe-check').$shadow.querySelector('li[data-tool=${tool}]').dispatchEvent(mouseUpEvent);
  `)

export const getActiveTool = async page =>
  await page.$eval('vibe-check', el =>
    el.activeTool)

export const pptrMetaKey = async page => {
  let isMac = await page.evaluate(_ => window.navigator.platform.includes('Mac'))
  return isMac ? "Meta" : "Control"
}
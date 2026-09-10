import puppeteer from 'puppeteer'

export const setupPptrTab = async t => {
  t.context.browser  = await puppeteer.launch({
    // headless: false,
    args: ['--no-sandbox']
  })
  t.context.page     = await t.context.browser.newPage()

  await t.context.page.goto('http://localhost:3000')
  await t.context.page.evaluateHandle(`document.body.setAttribute('testing', true)`)
  await t.context.page.waitForSelector('vibe-check')
}

export const teardownPptrTab = async ({context:{ page, browser }}) => {
  await page.close()
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
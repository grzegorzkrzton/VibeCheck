const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { launchPuppeteer } = require(path.resolve(__dirname, '../../../tests/puppeteer-launch.cjs'));
const outputDir = path.resolve(__dirname, '..');
const names = ['01-good-feedback-better-vibes.png', '02-comments-in-context.png', '03-find-the-words-that-work.png'];
(async () => {
  const browser = await launchPuppeteer();
  try {
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 800, deviceScaleFactor: 1});
    for (let index = 0; index < names.length; index++) {
      const url = new URL(pathToFileURL(path.join(__dirname, 'index.html')));
      url.searchParams.set('shot', index + 1);
      await page.goto(url.href, {waitUntil: 'networkidle0'});
      await page.evaluate(() => document.fonts.ready);
      const missing = await page.evaluate(() => [...document.querySelector('main:not([hidden])').querySelectorAll('img')].filter(img => !img.complete || img.naturalWidth === 0).map(img => img.getAttribute('src')));
      if (missing.length) throw new Error(`Missing artwork: ${missing.join(', ')}`);
      await page.screenshot({path: path.join(outputDir, names[index]), captureBeyondViewport: false});
    }
    await page.setViewport({width: 1920, height: 400, deviceScaleFactor: 1});
    await page.goto(pathToFileURL(path.join(__dirname, 'preview.html')).href, {waitUntil: 'networkidle0'});
    await page.screenshot({path: path.join(outputDir, 'preview.png'), captureBeyondViewport: false});
    console.log('Exported three 1280×800 PNG screenshots and the contact sheet.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { STORAGE_KEY } from '../src/exercise-state.mjs';

// Optional integration checks use the parent repository's existing Puppeteer setup.
// Start this page with npm run dev before running npm run test:browser.
// Deliberate exercise defects are asserted as expected behavior, not repaired.
const require = createRequire(import.meta.url);
const { launchPuppeteer } = require('../../tests/puppeteer-launch.cjs');
const base = new URL(process.env.VIBECHECK_LANDING_URL || 'http://127.0.0.1:4173/');
const unrelatedKey = 'vibecheck-browser-check-unrelated';
let passed = 0;
let browser;
const pageErrors = [];
const consoleErrors = [];
const requests = [];
const failedResponses = [];

async function check(name, action) {
  try {
    await action();
    passed += 1;
    console.log(`PASS ${passed}: ${name}`);
  } catch (error) {
    console.error(`FAIL: ${name}`);
    throw error;
  }
}

try {
  // The shared helper creates a fresh temporary browser profile; it never uses the user's profile.
  browser = await launchPuppeteer();
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('request', request => requests.push({ url: request.url(), method: request.method() }));
  page.on('response', response => { if (response.status() >= 400) failedResponses.push({ url: response.url(), status: response.status() }); });
  page.setDefaultTimeout(8000);
  await page.setViewport({ width: 1440, height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);

  async function visit(query = '') {
    const url = new URL(base);
    url.search = query;
    await page.goto(url.href, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#landing-root [data-icon] svg');
  }
  async function isOpen(id) {
    return page.$eval(`#${id}`, element => element.open);
  }
  async function isHidden(selector) {
    return page.$eval(selector, element => element.hidden);
  }
  async function savedState() {
    return page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY);
  }
  async function setInput(selector, value) {
    await page.click(selector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    if (value) await page.type(selector, value);
  }
  async function openAccess() {
    await page.click('.nav-cta[data-action="access"]');
    await page.waitForSelector('#access-dialog[open]');
  }
  async function visibleText(selector) {
    return page.$eval(selector, element => element.textContent.trim());
  }
  async function demoFrame() {
    await page.waitForSelector('#live-demo');
    const frame = await (await page.$('#live-demo')).contentFrame();
    assert.ok(frame, 'The live demo must be an iframe with its own document.');
    await frame.waitForSelector('html[data-preview-ready="true"]');
    return frame;
  }
  async function resetDemo() {
    const frame = await demoFrame();
    await Promise.all([
      frame.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('[data-demo-action="reset"]'),
    ]);
    const next = await demoFrame();
    await next.waitForSelector('[data-vc-component="Card / Comment"][data-mode="Detail"]');
    return next;
  }
  async function nativeStorage() {
    return page.evaluate(() => Object.fromEntries(Object.keys(localStorage).sort().map(key => [key, localStorage.getItem(key)])));
  }
  async function revealDemo() {
    // Puppeteer 10 does not scroll the parent when clicking iframe top-layer UI.
    await page.$eval('#live-demo', element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  }

  await visit();
  await check('facilitator controls are hidden by default', async () => {
    assert.equal(await isHidden('#facilitator-controls'), true);
    assert.equal(await page.$eval('#facilitator-controls', element => getComputedStyle(element).display), 'none');
  });

  await check('VC-03: three inconsistent access labels open the same setup dialog', async () => {
    const triggers = await page.$$('[data-action="access"]');
    assert.equal(triggers.length, 3);
    const labels = await page.$$eval('[data-action="access"]', elements => elements.map(element => element.textContent.replace(/\s+/g, ' ').trim()));
    ['Get early access', 'Set up locally', 'Join the workspace'].forEach((label, index) => assert.ok(labels[index].startsWith(label)));
    for (const trigger of triggers) {
      await trigger.click();
      await page.waitForSelector('#access-dialog[open]');
      assert.equal(await isOpen('info-dialog'), false);
      await page.click('#access-dialog .dialog-close');
      assert.equal(await isOpen('access-dialog'), false);
    }
  });

  await check('VC-01: Get VibeCheck takes the intentional release-information detour', async () => {
    await page.click('[data-action="release"]');
    await page.waitForSelector('#info-dialog[open]');
    assert.equal(await visibleText('#info-title'), 'A little inspiration first.');
    assert.equal(await isOpen('access-dialog'), false);
    await page.click('[data-action="access-from-info"]');
    assert.equal(await isOpen('access-dialog'), true);
    assert.equal(await isOpen('info-dialog'), false);
    await page.click('#access-dialog .dialog-close');
  });

  await check('VC-02: View all feedback is intentionally inert', async () => {
    const before = page.url();
    assert.deepEqual(await page.$eval('.false-link', element => ({ tag: element.tagName, href: element.getAttribute('href'), tabIndex: element.tabIndex })), { tag: 'SPAN', href: null, tabIndex: -1 });
    await page.click('.false-link');
    assert.equal(page.url(), before);
    assert.equal(await page.$$eval('.landing-dialog[open]', elements => elements.length), 0);
  });

  await openAccess();
  await check('initial validation errors are hidden and inputs have no error descriptions', async () => {
    assert.equal(await isHidden('#email-error'), true);
    assert.equal(await isHidden('#workspace-error'), true);
    for (const selector of ['#email-name', '#email-domain', '#workspace']) {
      assert.equal(await page.$eval(selector, element => element.getAttribute('aria-describedby')), null);
    }
  });

  await check('VC-10: abc interrupts once per reset and Escape returns workspace focus', async () => {
    await page.type('#workspace', 'abc');
    await page.waitForSelector('#interruption-dialog[open]');
    assert.equal((await savedState()).interrupted, true);
    await page.keyboard.press('Escape');
    assert.equal(await isOpen('interruption-dialog'), false);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'workspace');
    await page.type('#workspace', 'd');
    assert.equal(await isOpen('interruption-dialog'), false);
  });

  await check('VC-07/08: invalid email and short workspace show the intended errors with descriptions', async () => {
    await setInput('#email-name', 'not valid');
    await setInput('#email-domain', 'example');
    await setInput('#workspace', 'abc');
    await page.click('#access-form button[type="submit"]');
    assert.equal(await isHidden('#email-error'), false);
    assert.equal(await isHidden('#workspace-error'), false);
    assert.equal(await visibleText('#email-error'), 'That didn’t work. Try something else.');
    assert.equal(await visibleText('#workspace-error'), 'Workspace names need at least 6 characters.');
    for (const selector of ['#email-name', '#email-domain']) {
      assert.equal(await page.$eval(selector, element => element.getAttribute('aria-describedby')), 'email-error');
      assert.equal(await page.$eval(selector, element => element.getAttribute('aria-invalid')), 'true');
    }
    assert.equal(await page.$eval('#workspace', element => element.getAttribute('aria-describedby')), 'workspace-error');
    assert.equal(await page.$eval('#workspace', element => element.getAttribute('aria-invalid')), 'true');
  });

  await check('email help expands to explain the split fields', async () => {
    assert.equal(await isHidden('#email-guidance'), true);
    await page.click('#email-help');
    assert.equal(await isHidden('#email-guidance'), false);
    assert.equal(await page.$eval('#email-help', element => element.getAttribute('aria-expanded')), 'true');
    assert.match(await visibleText('#email-guidance'), /name before @.*first box.*domain/);
  });

  await check('VC-09: negative updates wording starts checked and can be toggled', async () => {
    assert.equal(await page.$eval('#updates', element => element.checked), true);
    assert.match(await visibleText('.checkbox-label'), /Don’t disable occasional product updates/);
    await page.click('#updates');
    assert.equal(await page.$eval('#updates', element => element.checked), false);
  });

  await check('VC-12: corrected details show 100% progress before access is confirmed', async () => {
    await setInput('#email-name', 'alex');
    await setInput('#email-domain', 'example.com');
    await setInput('#workspace', 'Design team');
    await page.click('#access-form button[type="submit"]');
    assert.equal(await isHidden('#access-review-step'), false);
    assert.equal(await isHidden('#access-form-step'), true);
    assert.equal(await page.$eval('#access-review-step progress', element => element.value), 100);
    assert.match(await visibleText('.premature-success'), /You’re all set!.*100% complete/s);
    assert.equal((await savedState()).accessConfirmed, false);
    assert.equal((await savedState()).updates, false);
    assert.equal(await visibleText('#review-workspace'), 'Design team');
    assert.equal(await visibleText('#review-updates'), 'Disabled');
    assert.equal(await isHidden('#email-error'), true);
    assert.equal(await isHidden('#workspace-error'), true);
    for (const selector of ['#email-name', '#email-domain', '#workspace']) assert.equal(await page.$eval(selector, element => element.getAttribute('aria-describedby')), null);
  });

  await check('Finish confirms only the local receipt and reflects the updates preference', async () => {
    await page.click('#finish-setup');
    assert.equal((await savedState()).accessConfirmed, true);
    assert.equal(await isHidden('#access-complete-step'), false);
    assert.match(await visibleText('#access-complete-step'), /No real account, access request, or subscription was created/);
    assert.equal(await visibleText('#receipt-preference'), 'Simulated product updates: disabled.');
    await page.click('#access-complete-step [data-close="access-dialog"]');
  });

  // Start another exercise through its real reset entry point, without manipulating application flags.
  await visit('?facilitator=1&reset=1');
  await openAccess();
  await setInput('#email-name', 'kept');
  await setInput('#email-domain', 'example.com');
  await page.type('#workspace', 'abc');
  await page.waitForSelector('#interruption-dialog[open]');
  await page.keyboard.press('Escape');
  await setInput('#workspace', 'Saved space');

  await check('VC-11: Continue in the ambiguous cancellation dialog preserves input', async () => {
    await page.click('#cancel-setup');
    await page.waitForSelector('#cancel-dialog[open]');
    assert.equal(await visibleText('#discard-setup'), 'Cancel');
    await page.click('#cancel-dialog .dialog-actions [data-close="cancel-dialog"]');
    assert.equal(await isOpen('cancel-dialog'), false);
    assert.equal(await isOpen('access-dialog'), true);
    assert.equal(await page.$eval('#email-name', element => element.value), 'kept');
    assert.equal(await page.$eval('#workspace', element => element.value), 'Saved space');
  });

  await check('VC-11: Cancel inside the confirmation discards the local form', async () => {
    await page.click('#cancel-setup');
    await page.click('#discard-setup');
    assert.equal(await page.$$eval('.landing-dialog[open]', elements => elements.length), 0);
    await openAccess();
    for (const selector of ['#email-name', '#email-domain', '#workspace']) assert.equal(await page.$eval(selector, element => element.value), '');
    assert.equal(await page.$eval('#updates', element => element.checked), true);
    await page.click('#access-dialog .dialog-close');
  });

  await check('facilitator reset removes only the exercise key and resets the interruption', async () => {
    await page.evaluate(key => localStorage.setItem(key, 'preserve me'), unrelatedKey);
    assert.equal((await savedState()).interrupted, true);
    const previousFrame = await demoFrame();
    await Promise.all([
      previousFrame.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.click('#reset-workshop'),
    ]);
    const resetFrame = await demoFrame();
    await resetFrame.waitForSelector('[data-vc-component="Card / Comment"][data-card="landing-demo-comment"][data-mode="Detail"]');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY), null);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), unrelatedKey), 'preserve me');
    await openAccess();
    assert.equal(await isHidden('#email-error'), true);
    assert.equal(await isHidden('#workspace-error'), true);
    assert.equal(await isHidden('#email-guidance'), true);
    for (const selector of ['#email-name', '#email-domain', '#workspace']) assert.equal(await page.$eval(selector, element => element.getAttribute('aria-describedby')), null);
    await page.type('#workspace', 'abc');
    await page.waitForSelector('#interruption-dialog[open]');
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'workspace');
  });

  await check('Escape closes setup after Shift+Tab moves focus outside its close button', async () => {
    await page.focus('#access-dialog .dialog-close');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    assert.equal(await page.evaluate(() => Boolean(document.activeElement.closest('.landing-dialog'))), false);
    await page.keyboard.press('Escape');
    assert.equal(await isOpen('access-dialog'), false);
  });

  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'tablet', width: 834, height: 1112 }, { name: 'mobile', width: 390, height: 844 }]) {
    await check(`${viewport.name} layout has no horizontal overflow`, async () => {
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await visit();
      const dimensions = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
      assert.ok(dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
      assert.ok(dimensions.body <= dimensions.viewport + 1, JSON.stringify(dimensions));
      assert.equal(await isHidden('#facilitator-controls'), true);
    });
  }

  await check('mobile navigation opens, escapes, and closes after selecting a section', async () => {
    await page.click('#menu-toggle');
    assert.equal(await page.$eval('#menu-toggle', element => element.getAttribute('aria-expanded')), 'true');
    assert.equal(await page.$eval('#navigation-links', element => element.classList.contains('open')), true);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('#menu-toggle', element => element.getAttribute('aria-expanded')), 'false');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'menu-toggle');
    await page.click('#menu-toggle');
    await page.click('#navigation-links a[href="#tools"]');
    assert.equal(await page.$eval('#menu-toggle', element => element.getAttribute('aria-expanded')), 'false');
    assert.equal(new URL(page.url()).hash, '#tools');
  });

  await page.setViewport({ width: 1440, height: 1000 });
  await visit();

  await check('live demo serves the byte-identical released extension runtime and canonical assets', async () => {
    const liveFrame = await demoFrame();
    const fonts = await liveFrame.evaluate(async () => {
      await Promise.all([400, 500, 600, 700].map(weight => document.fonts.load(`${weight} 12px Figtree`)));
      await document.fonts.ready;
      const style = document.getElementById('vibecheck-feedback-styles');
      const fontURLs = [...style.textContent.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => match[1]);
      return {
        fontURLs,
        available: document.fonts.check('400 12px Figtree') && document.fonts.check('600 12px Figtree'),
        messaging: typeof window.chrome?.runtime?.sendMessage,
        extensionStorage: typeof window.chrome?.storage,
      };
    });
    assert.equal(fonts.available, true, 'The actual feedback font must load.');
    assert.ok(fonts.fontURLs.length >= 4, 'The real component should declare all Figtree weights.');
    for (const fontURL of fonts.fontURLs) {
      assert.ok(fontURL.startsWith(new URL('fonts/figtree/', base).href), fontURL);
    }
    assert.equal(fonts.messaging, 'undefined', 'The preview asset resolver must not activate extension messaging.');
    assert.equal(fonts.extensionStorage, 'undefined', 'The preview asset resolver must not enable extension storage.');
    const provenance = JSON.parse(await readFile(new URL('../demo/vendor/provenance.json', import.meta.url), 'utf8'));
    assert.ok(provenance.files.some(file => file.source === 'extension/toolbar/bundle.min.js'));
    for (const file of provenance.files) {
      const source = await readFile(new URL(`../../${file.source}`, import.meta.url));
      const copied = await readFile(new URL(`../${file.destination}`, import.meta.url));
      assert.equal(createHash('sha256').update(source).digest('hex'), file.sha256, file.source);
      assert.equal(createHash('sha256').update(copied).digest('hex'), file.sha256, file.destination);
      const response = await fetch(new URL(file.destination, base));
      assert.equal(response.status, 200, file.destination);
      assert.equal(createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex'), file.sha256, `served ${file.destination}`);
    }
  });

  // Put recognizable existing extension preferences and feedback in native storage.
  // The iframe must keep its ephemeral demo data separate even on the same origin.
  await page.evaluate(demoURL => {
    localStorage.setItem('vibecheck:authorName', 'Native author must survive');
    localStorage.setItem('vibecheck:panelPrefs', JSON.stringify({ sortBy: 'unread', hideResolved: true }));
    localStorage.setItem('vibecheck:panelLayout', JSON.stringify({ left: 20, top: 30, collapsed: true }));
    localStorage.setItem(`vibecheck:store:${demoURL}`, JSON.stringify({ version: 2, comments: [{ id: 'native-record', body: 'Native feedback must survive' }], suggestions: [], notifications: [] }));
  }, new URL('demo/index.html', base).href);
  const beforeDemoStorage = await nativeStorage();
  let frame = await resetDemo();
  let newCommentId;

  await check('live preview renders the real toolbar, anchored pin, and seeded Comment Detail card', async () => {
    assert.equal(await frame.evaluate(() => document.querySelector('vibe-check').activeTool), 'comments');
    assert.equal(await frame.evaluate(() => document.querySelector('vibe-check').$shadow.querySelector('[data-vc-component="Main Toolbar"]').getAttribute('data-role')), 'Full');
    assert.ok(await frame.$('.vc-pin[data-vc-component="Feedback Pin"][data-id="landing-demo-comment"]'));
    assert.ok(await frame.$('[data-vc-component="Card / Comment"][data-card="landing-demo-comment"][data-mode="Detail"]'));
    assert.equal(await frame.$eval('#sample-target', element => element.tagName), 'BUTTON');
    assert.equal(await page.$$('.illustrated-toolbar').then(elements => elements.length), 0);
  });

  await check('Comment, Content, and Inspect controls select the real extension tools', async () => {
    for (const [mode, tool] of [['content', 'content'], ['inspect', 'inspector'], ['comment', 'comments']]) {
      await page.click(`.demo-mode-switch [data-mode="${mode}"]`);
      await frame.waitForFunction(expected => document.querySelector('vibe-check').activeTool === expected, {}, tool);
      assert.equal(await page.$eval(`.demo-mode-switch [data-mode="${mode}"]`, element => element.getAttribute('aria-pressed')), 'true');
      assert.equal(await page.$$eval('.demo-mode-switch [data-mode][aria-pressed="true"]', elements => elements.length), 1);
      assert.equal(await frame.evaluate(() => document.querySelector('vibe-check').$shadow.querySelector('[data-active="true"]').dataset.tool), tool);
    }
  });

  await check('Try a comment opens the genuine composer and keyboard submission creates a local thread', async () => {
    await frame.click('.vc-card [data-action="close"]');
    await frame.waitForFunction(() => !document.querySelector('.vc-card'));
    await page.click('[data-demo-action="comment"]');
    await frame.waitForSelector('[data-vc-component="Card / Comment"][data-mode="Compose"]');
    await revealDemo();
    await frame.focus('[data-field="body"]');
    await page.keyboard.type('This is a live component test.');
    await page.keyboard.down('Shift');
    await page.keyboard.press('Enter');
    await page.keyboard.up('Shift');
    await page.keyboard.type('Keep this second line.');
    assert.match(await frame.$eval('[data-field="body"]', element => element.value), /test\.\nKeep this second line\./);
    await page.keyboard.press('Tab');
    assert.equal(await frame.evaluate(() => document.activeElement.dataset.action), 'send');
    await frame.focus('[data-field="body"]');
    await page.keyboard.press('Enter');
    await frame.waitForSelector('[data-vc-component="Card / Comment"][data-mode="Detail"]');
    assert.match(await frame.$eval('.vc-card .vc-thread', element => element.textContent), /This is a live component test\./);
    newCommentId = await frame.$eval('.vc-card', element => element.dataset.card);
    assert.notEqual(newCommentId, 'landing-demo-comment');
    assert.ok(await frame.$(`.vc-pin[data-id="${newCommentId}"]`));
  });

  await check('real comment reply, thread menu Escape, and resolve/reopen controls work', async () => {
    await frame.type('[data-field="reply"]', 'A reply from the live preview.');
    await frame.click('[data-action="reply"]');
    await frame.waitForFunction(() => [...document.querySelectorAll('.vc-reply-body')].some(element => element.textContent === 'A reply from the live preview.'));
    assert.equal(await frame.$eval('.vc-card', element => element.dataset.thread), 'Replies');
    await frame.click('[data-action="toggle-overflow"]');
    await frame.waitForSelector('.vc-list-menu[data-menu="overflow"]');
    await page.keyboard.press('Escape');
    await frame.waitForFunction(() => !document.querySelector('.vc-list-menu[data-menu="overflow"]'));
    assert.equal(await frame.evaluate(() => document.activeElement.dataset.action), 'toggle-overflow');
    await frame.click('[data-action="resolve"]');
    await frame.waitForSelector('.vc-card[data-resolution="Resolved"]');
    assert.ok(await frame.$('[data-action="resolve"][aria-label="Reopen thread"]'));
    await frame.click('[data-action="resolve"]');
    await frame.waitForSelector('.vc-card[data-resolution="Open"]');
  });

  await check('closing a real comment card leaves a pin that reopens the saved thread', async () => {
    await frame.click('.vc-card [data-action="close"]');
    await frame.waitForFunction(() => !document.querySelector('.vc-card'));
    const pin = `.vc-pin[data-id="${newCommentId}"]`;
    assert.match(await frame.$eval(pin, element => element.textContent.trim()), /^\d+$/);
    await frame.click(pin);
    await frame.waitForSelector(`[data-vc-component="Card / Comment"][data-card="${newCommentId}"][data-mode="Detail"]`);
    assert.match(await frame.$eval('.vc-card .vc-thread', element => element.textContent), /A reply from the live preview\./);
  });

  await check('real Content component saves and applies a suggestion to the sample button', async () => {
    await page.click('.demo-mode-switch [data-mode="content"]');
    await frame.waitForFunction(() => document.querySelector('vibe-check').activeTool === 'content');
    await frame.waitForSelector('[data-vc-component="Card / Content"][data-mode="Compose"]');
    await revealDemo();
    await frame.focus('[data-field="suggestedText"]');
    await page.keyboard.type('Start a new project');
    await page.keyboard.press('Tab');
    assert.equal(await frame.evaluate(() => document.activeElement.dataset.field), 'rationale');
    await page.keyboard.type('Explain the action before the click.');
    await frame.click('[data-action="send"]');
    await frame.waitForSelector('[data-vc-component="Card / Content"][data-mode="Detail"]');
    await frame.click('[data-action="apply-suggestion"]');
    await frame.waitForFunction(() => document.querySelector('#sample-target').textContent.trim() === 'Start a new project');
    assert.equal(await frame.$eval('.vc-badge', element => element.dataset.type), 'Applied');
  });

  await check('demo reset restores the seed and button while preserving every native storage entry', async () => {
    assert.deepEqual(await nativeStorage(), beforeDemoStorage);
    assert.equal(await frame.evaluate(() => localStorage === parent.localStorage), false);
    frame = await resetDemo();
    assert.equal(await frame.$eval('#sample-target', element => element.textContent.trim()), 'Create your project');
    assert.equal(await frame.$$eval('.vc-pin', elements => elements.length), 1);
    assert.equal(await frame.$eval('.vc-card', element => element.dataset.card), 'landing-demo-comment');
    assert.equal(await frame.evaluate(() => localStorage.getItem('vibecheck:authorName')), 'You');
    assert.deepEqual(await nativeStorage(), beforeDemoStorage);
  });

  await check('mobile live demo keeps the genuine toolbar and comment card inside the iframe', async () => {
    await page.setViewport({ width: 390, height: 844 });
    frame = await resetDemo();
    const dimensions = await frame.evaluate(() => {
      const toolbar = document.querySelector('vibe-check').$shadow.querySelector('[data-vc-component="Main Toolbar"]');
      const card = document.querySelector('.vc-card');
      return {
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        surfaces: [toolbar, card].map(element => {
          const { left, right, top, bottom } = element.getBoundingClientRect();
          return { left, right, top, bottom };
        }),
        height: innerHeight,
      };
    });
    assert.ok(dimensions.document <= dimensions.viewport + 1, JSON.stringify(dimensions));
    for (const surface of dimensions.surfaces) {
      assert.ok(surface.left >= -1 && surface.right <= dimensions.viewport + 1, JSON.stringify(dimensions));
      assert.ok(surface.top >= -1 && surface.bottom <= dimensions.height + 1, JSON.stringify(dimensions));
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  });

  await check('support form previews locally and states that nothing was sent', async () => {
    await page.click('.support-launcher');
    await page.waitForSelector('#support-message');
    await page.type('#support-message', 'A made-up local support question.');
    await page.click('#support-form button[type="submit"]');
    assert.equal(await isHidden('#support-preview'), false);
    assert.equal(await visibleText('#support-preview-body'), 'A made-up local support question.');
    assert.match(await visibleText('#support-status'), /Nothing was sent/);
    await page.click('#info-dialog .dialog-close');
  });

  await check('docs, facilitator answers, scripts, metadata, and private asset routes return 404', async () => {
    // Use the Node client so expected 404 responses do not become browser-console errors.
    for (const pathname of ['docs/FACILITATOR.md', 'docs/SOURCES.md', 'package.json', 'scripts/server.mjs', 'tests/browser-check.mjs', '.git/config', 'assets/private.js', 'assets/private.txt', 'assets/', 'demo/vendor/provenance.json', 'demo/private.js']) {
      const response = await fetch(new URL(pathname, base));
      assert.equal(response.status, 404, pathname);
    }
  });

  await check('the page has no runtime or console errors and sends no POST or external requests', async () => {
    assert.deepEqual(pageErrors, []);
    assert.deepEqual(consoleErrors, []);
    assert.deepEqual(failedResponses, [], 'All browser-requested assets, including component fonts, must be served.');
    assert.ok(requests.length > 0);
    assert.deepEqual(requests.filter(request => !['GET', 'HEAD'].includes(request.method)), []);
    assert.deepEqual(requests.filter(request => /^https?:/.test(request.url) && new URL(request.url).origin !== base.origin), []);
  });
  await context.close();
  console.log(`\nBrowser regression checks: ${passed} passed. Expected exercise defects remain intentional.`);
} catch (error) {
  console.error(`\nBrowser regression stopped after ${passed} passing checks.`);
  console.error(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
}

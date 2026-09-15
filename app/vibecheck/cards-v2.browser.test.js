import test from 'ava'
import { changeMode, pptrMetaKey, setupPptrTab, teardownPptrTab } from '../../tests/helpers'

test.beforeEach(setupPptrTab)

test('Wording supports keyboard compose, apply, reply, menus, and resolve', async t => {
  const { page } = t.context
  await changeMode({ page, tool: 'content' })
  await page.click('h1')
  await page.waitForSelector('[data-vc-component="Card / ComboField"]')

  await page.focus('[data-field="suggestedText"]')
  await page.keyboard.press('Tab')
  t.is(await page.evaluate(() => document.activeElement?.dataset.field), 'rationale')
  await page.keyboard.press('Tab')
  t.is(await page.evaluate(() => document.activeElement?.dataset.action), 'send')

  await page.focus('[data-field="suggestedText"]')
  await page.keyboard.down(await pptrMetaKey(page))
  await page.keyboard.press('A')
  await page.keyboard.up(await pptrMetaKey(page))
  await page.keyboard.type('A clearer title')
  await page.keyboard.down(await pptrMetaKey(page))
  await page.keyboard.press('Enter')
  await page.keyboard.up(await pptrMetaKey(page))

  await page.waitForSelector('[data-vc-component="Card / Wording"][data-mode="Detail"]')
  t.is(await page.$('[data-action="approve"], [data-action="reject"], [data-action="preview"]'), null)

  await page.click('[data-action="apply-suggestion"]')
  t.is(await page.$eval('h1', element => element.innerText), 'A clearer title')
  await page.click('[data-action="apply-suggestion"]')
  t.is(await page.$eval('h1', element => element.innerText), 'A clearer title')

  await page.type('[data-field="reply"]', 'Agreed')
  await page.click('[data-action="reply"]')
  await page.waitForFunction(() => [...document.querySelectorAll('.vc-reply-body')].some(node => node.textContent === 'Agreed'))

  await page.click('[data-action="toggle-overflow"]')
  await page.waitForSelector('[role="menu"]')
  await page.keyboard.press('Escape')
  t.is(await page.$('.vc-overflow-menu'), null)

  await page.click('[data-action="resolve"]')
  await page.waitForSelector('[data-vc-component="Card / Wording"][data-resolution="Resolved"]')
  t.truthy(await page.$('[aria-label="Reopen thread"]'))
})

test.afterEach(teardownPptrTab)

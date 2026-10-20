import test from 'ava'
import { changeMode, pptrMetaKey, setupPptrTab, teardownPptrTab } from '../../tests/helpers'

test.beforeEach(setupPptrTab)

test('Content supports keyboard compose, apply, reply, menus, and resolve', async t => {
  const { page } = t.context
  await changeMode({ page, tool: 'content' })
  await page.click('h1')
  await page.waitForSelector('[data-vc-component="Card / ComboField"]')
  const comboGeometry = await page.$eval('.vc-combo-field', element => ({
    height: element.getBoundingClientRect().height,
    parts: [...element.querySelectorAll('.vc-combo-part')].map(part => part.getBoundingClientRect().height),
  }))
  t.deepEqual(comboGeometry, { height: 82, parts: [40, 40] })

  await page.focus('[data-field="suggestedText"]')
  await page.keyboard.press('Tab')
  t.is(await page.evaluate(() => document.activeElement && document.activeElement.dataset.field), 'rationale')
  await page.keyboard.press('Tab')
  t.is(await page.evaluate(() => document.activeElement && document.activeElement.dataset.action), 'send')

  await page.focus('[data-field="suggestedText"]')
  await page.keyboard.down(await pptrMetaKey(page))
  await page.keyboard.press('A')
  await page.keyboard.up(await pptrMetaKey(page))
  await page.keyboard.type('A clearer title')
  await page.keyboard.press('Enter')

  await page.waitForSelector('[data-vc-component="Card / Content"][data-mode="Detail"]')
  t.is(await page.$('[data-action="approve"], [data-action="reject"], [data-action="preview"]'), null)
  t.is(await page.$eval('.vc-type-trigger', element => element.querySelector('svg')), null)
  t.is(await page.$eval('.vc-type-trigger', element => getComputedStyle(element).opacity), '1')
  t.is(await page.$eval('.vc-badge', element => element.dataset.type), 'Pending')

  await page.click('[data-action="apply-suggestion"]')
  t.is(await page.$eval('h1', element => element.innerText), 'A clearer title')
  t.is(await page.$eval('.vc-badge', element => element.dataset.type), 'Applied')
  await page.click('[data-action="apply-suggestion"]')
  t.is(await page.$eval('h1', element => element.innerText), 'A clearer title')

  await page.type('[data-field="reply"]', 'Agreed')
  await page.click('[data-action="reply"]')
  await page.waitForFunction(() => [...document.querySelectorAll('.vc-reply-body')].some(node => node.textContent === 'Agreed'))

  await page.click('[data-action="toggle-overflow"]')
  await page.waitForSelector('[role="menu"]')
  await page.keyboard.press('Escape')
  t.is(await page.$('.vc-list-menu[data-menu="overflow"]'), null)

  await page.click('[data-action="resolve"]')
  await page.waitForSelector('[data-vc-component="Card / Content"][data-resolution="Resolved"]')
  t.truthy(await page.$('[aria-label="Reopen thread"]'))
})

test('Comment field, dropdown, disabled selector, and pin retain visual contracts', async t => {
  const { page } = t.context
  await changeMode({ page, tool: 'comments' })
  await page.click('h1')
  await page.waitForSelector('[data-vc-component="Card / Comment"]')

  t.is(await page.$eval('.vc-field', element => element.getBoundingClientRect().height), 36)
  await page.click('[data-action="toggle-type-menu"]')
  await page.waitForSelector('.vc-list-menu[data-menu="type"]')
  t.is(await page.$eval('.vc-card-surface', element => getComputedStyle(element).overflow), 'visible')

  await page.keyboard.press('Escape')
  await page.focus('[data-field="body"]')
  await page.keyboard.type('Line one')
  await page.keyboard.down('Shift')
  await page.keyboard.press('Enter')
  await page.keyboard.up('Shift')
  await page.keyboard.type('Line two is longer content')
  const activeHeight = await page.$eval('.vc-field', element => element.getBoundingClientRect().height)
  t.true(activeHeight > 36)
  await page.evaluate(() => document.activeElement?.blur())
  await page.waitForFunction(() => document.querySelector('.vc-field')?.dataset.state === 'Filled')
  const filledHeight = await page.$eval('.vc-field', element => element.getBoundingClientRect().height)
  t.true(filledHeight > 36)
  t.is(await page.$eval('.vc-field', element => element.dataset.state), 'Filled')
  await page.click('[data-action="send"]')
  await page.waitForSelector('[data-mode="Detail"]')
  t.is(await page.$eval('.vc-type-trigger', element => element.querySelector('svg')), null)

  await page.click('[data-action="close"]')
  t.regex(await page.$eval('.vc-pin', element => element.textContent.trim()), /^\d+$/)
  t.is(await page.$eval('.vc-pin', element => getComputedStyle(element).borderRadius), '999px 999px 999px 6px')
})

test.afterEach(teardownPptrTab)

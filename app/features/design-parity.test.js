import test from 'ava'

import { setupPptrTab, teardownPptrTab }
from '../../tests/helpers'

test.beforeEach(setupPptrTab)

test('toolbar exposes Figma mapped component names', async t => {
  const { page } = t.context
  const mapped = await page.evaluate(`(() => {
    const root = document.querySelector('vibe-check').$shadow
    return {
      main: !!root.querySelector('[data-vc-component="Main Toolbar"]'),
      color: !!root.querySelector('[data-vc-component="Color & AI Toolbar"]'),
      tools: root.querySelectorAll('[data-vc-component="Toolbar Tool Button"]').length,
      dividers: root.querySelectorAll('[data-vc-component="Toolbar Divider"]').length,
      colors: root.querySelectorAll('[data-vc-component="Toolbar Color Action"]').length,
      ai: root.querySelectorAll('[data-vc-component="Toolbar AI Prompt"]').length,
    }
  })()`)

  t.true(mapped.main)
  t.true(mapped.color)
  t.is(mapped.tools, 15)
  t.is(mapped.dividers, 1)
  t.is(mapped.colors, 3)
  t.is(mapped.ai, 1)
})

test.afterEach(teardownPptrTab)

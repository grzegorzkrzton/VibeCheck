import test from 'ava'

import {
  bestPlateThemeForBackdrop,
  contrastRatio,
  relativeLuminance,
} from './page-cursor.js'

test('WCAG contrast: black on white is 21:1', t => {
  const ratio = contrastRatio(
    { r: 0, g: 0, b: 0 },
    { r: 255, g: 255, b: 255 },
  )
  t.true(ratio >= 20.9 && ratio <= 21.1)
})

test('bestPlateThemeForBackdrop picks white plate on dark backdrop', t => {
  t.is(bestPlateThemeForBackdrop({ r: 23, g: 25, b: 28 }), 'dark')
})

test('bestPlateThemeForBackdrop picks dark plate on light backdrop', t => {
  t.is(bestPlateThemeForBackdrop({ r: 249, g: 250, b: 250 }), 'light')
})

test('relativeLuminance is higher for white than black', t => {
  t.true(relativeLuminance({ r: 255, g: 255, b: 255 }) > relativeLuminance({ r: 0, g: 0, b: 0 }))
})

import assert from 'node:assert/strict'
import {
  floatingOffset,
  floatingPosition,
  horizontalFloatingSide,
} from '../app/utilities/floating.js'

const viewport = {
  viewportWidth: 1000,
  viewportHeight: 700,
}
const floating = { width: 250, height: 120 }

const leftAnchor = { left: 8, right: 44, top: 20, width: 36, height: 36 }
assert.equal(
  horizontalFloatingSide(leftAnchor, floating.width, viewport),
  'right',
)
assert.deepEqual(
  floatingPosition(leftAnchor, floating, viewport),
  { side: 'right', left: 56, top: 20 },
)

const rightAnchor = { left: 956, right: 992, top: 620, width: 36, height: 36 }
assert.equal(
  horizontalFloatingSide(rightAnchor, floating.width, viewport),
  'left',
)
assert.deepEqual(
  floatingPosition(rightAnchor, floating, viewport),
  { side: 'left', left: 694, top: 572 },
)

assert.equal(floatingOffset('right'), -8)
assert.equal(floatingOffset('left'), 8)

console.log('floating positioning checks passed')

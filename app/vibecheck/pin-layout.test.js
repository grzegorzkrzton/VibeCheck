import test from 'ava'
import {
  PIN_ORIGIN_INSET,
  PIN_SPACING,
  comparePinOrder,
  groupPinsByElement,
  pinRowOrigin,
  pinRowPositions,
} from './pin-layout'

const element = name => ({ name })

test('a lone pin keeps the historical rect.left + 8 / rect.top + 8 origin', t => {
  const origin = pinRowOrigin({ left: 120, top: 400 })
  t.deepEqual(origin, { left: 128, top: 408 })
  t.deepEqual(pinRowPositions(1, { origin: origin.left, viewportWidth: 1280 }), [128])
})

test('pins on the same element sit 32px apart, left to right', t => {
  const lefts = pinRowPositions(4, { origin: 128, viewportWidth: 1280 })
  t.deepEqual(lefts, [128, 160, 192, 224])
  const gaps = lefts.slice(1).map((left, index) => left - lefts[index])
  t.deepEqual(gaps, [PIN_SPACING, PIN_SPACING, PIN_SPACING])
  t.is(new Set(lefts).size, lefts.length)
})

test('a row that would overflow the right edge grows leftward from the origin', t => {
  // Origin 8px from the right edge: the row cannot extend right at all.
  const lefts = pinRowPositions(3, { origin: 1272, viewportWidth: 1280 })
  t.deepEqual(lefts, [1208, 1240, 1272])
  // The last pin stays on the element's origin, so the row is still attached.
  t.is(lefts[lefts.length - 1], 1272)
})

test('overflow shifts the row only as far as needed', t => {
  // The trailing pin overhangs the 1272px limit by 6px, so the row slides 6px.
  const lefts = pinRowPositions(3, { origin: 1200, viewportWidth: 1280 })
  t.deepEqual(lefts, [1194, 1226, 1258])
})

test('an anchor scrolled off the right edge is never clamped onscreen', t => {
  t.deepEqual(pinRowPositions(1, { origin: 4000, viewportWidth: 1280 }), [4000])
  // Multi-pin rows only fold back onto their own origin, never onto the edge.
  t.deepEqual(pinRowPositions(2, { origin: 4000, viewportWidth: 1280 }), [3968, 4000])
  t.deepEqual(pinRowPositions(2, { origin: -500, viewportWidth: 1280 }), [-500, -468])
})

test('groups are keyed by the resolved element, not by anchor equality', t => {
  const hero = element('hero')
  const footer = element('footer')
  const entries = [
    { pin: 'p1', el: hero, record: { id: 'b', createdAt: '2026-01-01T00:00:00Z' } },
    { pin: 'p2', el: footer, record: { id: 'c', createdAt: '2026-01-02T00:00:00Z' } },
    { pin: 'p3', el: hero, record: { id: 'a', createdAt: '2026-01-03T00:00:00Z' } },
  ]
  const groups = groupPinsByElement(entries)
  t.is(groups.size, 2)
  t.deepEqual(groups.get(hero).map(entry => entry.pin), ['p1', 'p3'])
  t.deepEqual(groups.get(footer).map(entry => entry.pin), ['p2'])
})

test('row order follows createdAt then id regardless of incoming order', t => {
  const hero = element('hero')
  const records = [
    { id: 'z', createdAt: '2026-01-02T00:00:00Z' },
    { id: 'a', createdAt: '2026-01-02T00:00:00Z' },
    { id: 'm', createdAt: '2026-01-01T00:00:00Z' },
  ]
  const forward = groupPinsByElement(records.map(record => ({ el: hero, record })))
  const reversed = groupPinsByElement([...records].reverse().map(record => ({ el: hero, record })))
  const ids = group => group.get(hero).map(entry => entry.record.id)
  t.deepEqual(ids(forward), ['m', 'a', 'z'])
  t.deepEqual(ids(reversed), ['m', 'a', 'z'])
  t.true(comparePinOrder(records[2], records[0]) < 0)
  t.true(comparePinOrder(records[1], records[0]) < 0)
})

test('same-element pins end up at distinct left offsets when laid out together', t => {
  const hero = element('hero')
  const rect = { left: 40, top: 200 }
  const group = groupPinsByElement([
    { pin: 'p1', el: hero, record: { id: 'b', createdAt: '2026-01-02T00:00:00Z' } },
    { pin: 'p2', el: hero, record: { id: 'a', createdAt: '2026-01-01T00:00:00Z' } },
    { pin: 'p3', el: hero, record: { id: 'c', createdAt: '2026-01-03T00:00:00Z' } },
  ]).get(hero)
  const origin = pinRowOrigin(rect)
  const lefts = pinRowPositions(group.length, { origin: origin.left, viewportWidth: 1280 })
  t.deepEqual(group.map(entry => entry.pin), ['p2', 'p1', 'p3'])
  t.deepEqual(lefts, [
    rect.left + PIN_ORIGIN_INSET,
    rect.left + PIN_ORIGIN_INSET + PIN_SPACING,
    rect.left + PIN_ORIGIN_INSET + PIN_SPACING * 2,
  ])
  // Every pin shares the element's vertical origin.
  t.is(origin.top, rect.top + PIN_ORIGIN_INSET)
})

test('empty and degenerate inputs stay safe', t => {
  t.deepEqual(pinRowPositions(0, { origin: 10, viewportWidth: 1280 }), [])
  t.deepEqual(groupPinsByElement([{ pin: 'p', el: null, record: {} }]).size, 0)
  t.deepEqual(groupPinsByElement(undefined).size, 0)
  // No viewport width available (SSR / detached): never shift.
  t.deepEqual(pinRowPositions(2, { origin: 10 }), [10, 42])
})

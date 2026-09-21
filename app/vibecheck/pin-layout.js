/**
 * Placement maths for feedback pins.
 *
 * Several threads often resolve to the same element, which used to stack every
 * pin on one point. Pins that share an element are laid out as a horizontal
 * row instead: same vertical origin, centres spaced apart left to right.
 *
 * The row is uncapped — every thread on an element gets its own pin, so there
 * is no cluster badge or overflow affordance, and the open thread is always
 * visible without needing to be promoted.
 */

/** Pin diameter, mirrors --vc-size-pin. Pins are centred via translate(-50%, -50%). */
export const PIN_SIZE = 28

/** Centre-to-centre spacing, leaves a 4px gap between neighbouring pins. */
export const PIN_SPACING = 32

/** Offset of the first pin's centre from the element's top-left corner. */
export const PIN_ORIGIN_INSET = 8

/** Breathing room kept between the row and the right viewport edge. */
export const VIEWPORT_INSET = 8

/**
 * Deterministic pin order: oldest thread first, id as the tie-break. Keeping
 * this independent of the panel's sort means toggling date/unread never
 * reshuffles the row.
 */
export function comparePinOrder(a, b) {
  const byCreated = String(a?.createdAt ?? '').localeCompare(String(b?.createdAt ?? ''))
  if (byCreated !== 0) return byCreated
  return String(a?.id ?? '').localeCompare(String(b?.id ?? ''))
}

/**
 * Bucket `{ el, record }` entries by the resolved DOM element. Grouping on the
 * element itself rather than on a serialized anchor catches the case where two
 * different anchors resolve to the same node.
 *
 * @returns {Map<Element, Array>} groups in first-seen order, each sorted by `comparePinOrder`.
 */
export function groupPinsByElement(entries) {
  const groups = new Map()
  for (const entry of entries || []) {
    if (!entry?.el) continue
    const group = groups.get(entry.el)
    if (group) group.push(entry)
    else groups.set(entry.el, [entry])
  }
  for (const group of groups.values())
    group.sort((a, b) => comparePinOrder(a.record, b.record))
  return groups
}

/**
 * Centre x for each pin of a row anchored at `origin`.
 *
 * The row normally grows rightward. When it would cross the right viewport
 * edge it slides left, but never further than `(count - 1) * spacing` — at
 * that point the row has flipped to growing leftward from `origin`, so the
 * first pin still sits exactly where a lone pin would. That cap is what keeps
 * an anchor scrolled off to the right from being dragged onto the screen edge.
 */
export function pinRowPositions(count, {
  origin,
  viewportWidth,
  spacing = PIN_SPACING,
  pinSize = PIN_SIZE,
  inset = VIEWPORT_INSET,
} = {}) {
  if (!Number.isFinite(count) || count <= 0) return []
  const span = (count - 1) * spacing
  const overflow = Number.isFinite(viewportWidth)
    ? origin + span + pinSize / 2 - (viewportWidth - inset)
    : 0
  const shift = Math.min(Math.max(overflow, 0), span)
  return Array.from({ length: count }, (_, index) => origin + index * spacing - shift)
}

/** Row origin for an element rect: the centre of where a single pin would sit. */
export function pinRowOrigin(rect) {
  return {
    left: rect.left + PIN_ORIGIN_INSET,
    top: rect.top + PIN_ORIGIN_INSET,
  }
}

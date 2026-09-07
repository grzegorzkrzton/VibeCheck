export function horizontalFloatingSide(
  anchorRect,
  floatingWidth,
  {
    gap = 12,
    padding = 8,
    viewportWidth = window.innerWidth,
  } = {},
) {
  const roomLeft = anchorRect.left - gap - padding
  const roomRight = viewportWidth - anchorRect.right - gap - padding
  const preferred = anchorRect.left + anchorRect.width / 2 <= viewportWidth / 2
    ? 'right'
    : 'left'

  if (preferred === 'right' && roomRight >= floatingWidth) return 'right'
  if (preferred === 'left' && roomLeft >= floatingWidth) return 'left'
  if (roomRight >= floatingWidth) return 'right'
  if (roomLeft >= floatingWidth) return 'left'
  return roomRight >= roomLeft ? 'right' : 'left'
}

export function floatingPosition(
  anchorRect,
  floatingRect,
  {
    gap = 12,
    padding = 8,
    viewportWidth = window.innerWidth,
    viewportHeight = window.innerHeight,
  } = {},
) {
  const side = horizontalFloatingSide(anchorRect, floatingRect.width, {
    gap,
    padding,
    viewportWidth,
  })
  const idealLeft = side === 'right'
    ? anchorRect.right + gap
    : anchorRect.left - floatingRect.width - gap
  const maxLeft = Math.max(padding, viewportWidth - floatingRect.width - padding)
  const maxTop = Math.max(padding, viewportHeight - floatingRect.height - padding)

  return {
    side,
    left: Math.min(Math.max(padding, idealLeft), maxLeft),
    top: Math.min(Math.max(padding, anchorRect.top), maxTop),
  }
}

export function floatingOffset(side, amount = 8) {
  return side === 'left' ? amount : -amount
}

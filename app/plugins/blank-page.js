export const commands = [
  'empty page',
  'blank page',
  'clear canvas',
]

export const description = 'remove all elements on the page (body tag)'

export default function () {
  document
    .querySelectorAll('body > *:not(vibe-check):not(script)')
    .forEach(node => node.remove())
}

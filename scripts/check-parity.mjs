import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  cardFamily,
  cardState,
  pinVisualState,
  pinVisualType,
  renderAnnotationCard,
  renderBadge,
  renderButton,
  renderChip,
  renderField,
  renderNoteCard,
  renderNotesPanel,
  renderNotesPanelItem,
  renderPin,
  renderWordingCard,
} from '../app/vibecheck/components.js'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

function check(name, fn) {
  fn()
  console.log(`ok ${name}`)
}

check('Button emits mapped component and style attributes', () => {
  const html = renderButton({ style: 'Primary', label: 'Save', action: 'save' })
  assert.match(html, /data-vc-component="Button"/)
  assert.match(html, /data-style="Primary"/)
  assert.match(html, /data-state="Default"/)
  assert.match(html, /data-action="save"/)
})

check('Chip selected state matches Figma Selected', () => {
  const html = renderChip({
    kind: 'Filter',
    selected: true,
    label: 'Wording',
    action: 'filter',
    dataAttrs: { 'data-filter': 'content' },
  })
  assert.match(html, /data-vc-component="Chip"/)
  assert.match(html, /data-kind="Filter"/)
  assert.match(html, /data-state="Selected"/)
  assert.match(html, /data-filter="content"/)
})

check('Field textarea and input use Figma Type names', () => {
  const input = renderField({ type: 'Input', field: 'authorName', value: 'Ada', placeholder: 'Your name' })
  const area = renderField({ type: 'Textarea', field: 'body', value: 'Hello', placeholder: 'Write a note…' })
  assert.match(input, /data-vc-component="Field"/)
  assert.match(input, /data-type="Input"/)
  assert.match(area, /data-type="Textarea"/)
  assert.match(area, /Hello/)
})

check('Badge, pin, and panel item emit stable data-vc-component names', () => {
  assert.match(renderBadge('Resolved'), /data-vc-component="Badge"/)
  const pin = renderPin({
    id: 'c1',
    recordKind: 'comment',
    type: 'annotation',
    kind: 'warning',
    number: 2,
    open: true,
    resolved: false,
  })
  assert.match(pin, /data-vc-component="Feedback Pin"/)
  assert.match(pin, /data-vc-type="Warning"/)
  assert.match(pin, /data-state="Open"/)
  assert.match(pin, /data-type="annotation"/)
  assert.match(pin, /data-kind="warning"/)
  const item = renderNotesPanelItem({ id: 'c1', kind: 'comment', open: true, title: 'Note', preview: 'Hello' })
  assert.match(item, /data-vc-component="Notes Panel Item"/)
  assert.match(item, /data-state="Open"/)
})

check('Figma pin and card variant translation', () => {
  assert.equal(pinVisualType('comment', 'note'), 'Note')
  assert.equal(pinVisualType('comment', 'annotation', 'implement'), 'Implement')
  assert.equal(pinVisualType('comment', 'annotation', 'question'), 'Question')
  assert.equal(pinVisualType('suggestion', 'suggestion'), 'Suggestion')
  assert.equal(pinVisualState({ open: true }), 'Open')
  assert.equal(pinVisualState({ resolved: true }), 'Resolved')
  assert.equal(pinVisualState({}), 'Default')
  assert.equal(cardFamily({ kind: 'draft', item: { type: 'note' } }), 'Feedback Card / Note')
  assert.equal(cardFamily({ kind: 'comment', item: { type: 'annotation' } }), 'Feedback Card / Annotation')
  assert.equal(cardFamily({ kind: 'suggestion', item: {} }), 'Feedback Card / Wording')
  assert.equal(cardState('draft', {}), 'Compose')
  assert.equal(cardState('comment', {}), 'Detail')
})

check('Note compose and detail cards use mapped family names', () => {
  const compose = renderNoteCard({ id: 'n1', state: 'Compose', body: 'Hi', author: 'Ada', context: '.hero' })
  assert.match(compose, /data-vc-component="Feedback Card \/ Note"/)
  assert.match(compose, /data-state="Compose"/)
  assert.match(compose, /data-action="set-type"/)
  const detail = renderNoteCard({ id: 'n1', state: 'Detail', body: 'Hi', meta: 'Ada', resolved: true })
  assert.match(detail, /data-state="Detail"/)
  assert.match(detail, /Reopen/)
  assert.match(detail, /data-action="reply"/)
})

check('Annotation and wording cards keep delegated actions', () => {
  const annotation = renderAnnotationCard({ id: 'a1', state: 'Compose', kind: 'question' })
  assert.match(annotation, /data-vc-component="Feedback Card \/ Annotation"/)
  assert.match(annotation, /data-annotation-kind="question"/)
  assert.match(annotation, /data-kind="Annotation"/)
  const wording = renderWordingCard({
    id: 'w1',
    state: 'Detail',
    originalText: 'From',
    suggestedText: 'To',
    status: 'pending',
  })
  assert.match(wording, /data-vc-component="Feedback Card \/ Wording"/)
  assert.match(wording, /data-action="approve"/)
  assert.match(wording, /<b>From<\/b>/)
})

check('Notes panel uses Notes title and Wording filter', () => {
  const html = renderNotesPanel({ collapsed: false, hideResolved: true, filter: 'content', itemsHtml: '<div></div>' })
  assert.match(html, /data-vc-component="Notes Panel"/)
  assert.match(html, /data-state="Expanded"/)
  assert.match(html, />Notes</)
  assert.match(html, /Show resolved/)
  assert.match(html, /Wording/)
  assert.match(html, /data-filter="content"/)
  assert.equal(html.includes('data-action="close"'), false)
})

check('generated token files match tokens.json', () => {
  const output = execFileSync(process.execPath, ['scripts/design-sync.js', '--check'], {
    cwd: ROOT,
    encoding: 'utf8',
  })
  assert.match(output, /design:check ok/)
})

check('token generator emits mapped CSS custom properties', () => {
  const tokens = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/tokens.json'), 'utf8'))
  const css = fs.readFileSync(path.join(ROOT, 'design-system/generated/tokens.css'), 'utf8')
  assert.equal(tokens.color.light['bg-surface'], '#ffffff')
  assert.match(css, /--vc-bg-surface: #ffffff/)
  assert.match(css, /--vc-action-primary/)
  assert.match(css, /--vc-size-pin: 28px/)
  assert.match(css, /--vc-shadow-card/)
  assert.match(css, /prefers-color-scheme: dark/)
  assert.match(fs.readFileSync(path.join(ROOT, 'design-system/generated/tokens.js'), 'utf8'), /export const layerTokenCss/)
  assert.match(fs.readFileSync(path.join(ROOT, 'extension/popup/tokens.css'), 'utf8'), /:root, :host/)
})

check('mapping manifest references existing sources and renderers', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/figma-components.json'), 'utf8'))
  assert.equal(manifest.codeConnect.available, false)
  assert.ok(manifest.fileKey)
  assert.ok(manifest.components.length >= 19)
  const names = manifest.components.map(item => item.name)
  for (const name of [
    'Button',
    'Chip',
    'Field',
    'Badge',
    'Feedback Pin',
    'Main Toolbar',
    'Color & AI Toolbar',
    'Feedback Card / Note',
    'Feedback Card / Annotation',
    'Feedback Card / Wording',
    'Notes Panel',
    'Account & Inbox Popup',
  ])
    assert.ok(names.includes(name), `missing ${name}`)

  const helperRenderers = [
    'renderButton',
    'renderChip',
    'renderField',
    'renderBadge',
    'renderPin',
    'renderNoteCard',
    'renderAnnotationCard',
    'renderWordingCard',
    'renderNotesPanelItem',
    'renderNotesPanel',
  ]
  for (const item of manifest.components) {
    assert.ok(item.nodeId)
    assert.ok(item.code.dataComponent)
    if (item.name !== 'Toolbar Icon')
      assert.ok(item.code.selector.includes('data-vc-component'), `selector missing data-vc-component for ${item.name}`)
    const source = path.join(ROOT, item.code.source)
    assert.ok(fs.existsSync(source), `missing source ${item.code.source}`)
    if (helperRenderers.includes(item.code.renderer)) {
      const contents = fs.readFileSync(source, 'utf8')
      assert.ok(contents.includes(`export function ${item.code.renderer}`), `missing renderer ${item.code.renderer}`)
    }
  }
})

console.log('parity checks passed')

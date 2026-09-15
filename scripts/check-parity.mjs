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
  renderApplySuggestion,
  renderAvatar,
  renderBadge,
  renderButton,
  renderChip,
  renderField,
  renderComboField,
  renderHeaderIcon,
  renderOverflowMenu,
  renderNoteCard,
  renderNotesPanel,
  renderNotesPanelItem,
  renderPin,
  renderQuote,
  renderReply,
  renderSend,
  renderTypeSelector,
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
  assert.match(input, /data-vc-component="Card \/ Field"/)
  assert.match(input, /data-type="Input"/)
  assert.match(area, /data-type="Textarea"/)
  assert.match(area, /Hello/)
})

check('Field state follows Figma Default, Filled, and Focus variants', () => {
  const empty = renderField({ type: 'Input', field: 'authorName', placeholder: 'Your name' })
  const filled = renderField({ type: 'Textarea', field: 'body', value: 'Hello', placeholder: 'Write a note…' })
  const focused = renderField({ type: 'Input', field: 'authorName', value: 'Ada', state: 'Focus' })
  assert.match(empty, /data-state="Default"/)
  assert.match(filled, /data-state="Filled"/)
  assert.match(focused, /data-state="Focus"/)
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
  const item = renderNotesPanelItem({
    id: 'c1',
    kind: 'comment',
    open: true,
    number: 12,
    context: 'Hero title',
    author: 'Ada',
    timestamp: '6 days ago',
    message: 'Please ask @Maya',
    participants: ['Maya'],
    replyCount: 1,
  })
  assert.match(item, /data-vc-component="Notes Panel Item"/)
  assert.match(item, /data-state="Open"/)
  assert.match(item, /#12/)
  assert.match(item, /class="vc-mention">@Maya/)
  assert.match(item, /1 reply/)
})

check('Avatar matches Figma initials, tones, and photo fallback markup', () => {
  const avatar = renderAvatar({
    name: 'Maya Johnson',
    imageUrl: 'https://example.com/maya.jpg',
    tone: 'implement',
  })
  assert.match(avatar, /data-vc-component="Avatar"/)
  assert.match(avatar, /data-tone="implement"/)
  assert.match(avatar, />MJ<\/span>/)
  assert.match(avatar, /<img src="https:\/\/example.com\/maya.jpg" alt="">/)
  assert.doesNotMatch(renderAvatar({ name: '', imageUrl: 'javascript:alert(1)' }), /<img/)
})

check('Figma pin and card variant translation', () => {
  assert.equal(pinVisualType('comment', 'note'), 'Note')
  assert.equal(pinVisualType('comment', 'annotation', 'implement'), 'Implement')
  assert.equal(pinVisualType('comment', 'annotation', 'question'), 'Question')
  assert.equal(pinVisualType('suggestion', 'suggestion'), 'Suggestion')
  assert.equal(pinVisualState({ open: true }), 'Open')
  assert.equal(pinVisualState({ resolved: true }), 'Resolved')
  assert.equal(pinVisualState({}), 'Default')
  assert.equal(cardFamily({ kind: 'draft', item: { type: 'note' } }), 'Card / Comment')
  assert.equal(cardFamily({ kind: 'comment', item: { type: 'annotation' } }), 'Card / Annotation')
  assert.equal(cardFamily({ kind: 'suggestion', item: {} }), 'Card / Wording')
  assert.equal(cardState('draft', {}), 'Compose')
  assert.equal(cardState('comment', {}), 'Detail')
})

check('Comment compose and detail cards expose Cards v2 axes', () => {
  const compose = renderNoteCard({ id: 'n1', state: 'Compose', body: 'Hi', author: 'Ada', context: '.hero' })
  assert.match(compose, /data-vc-component="Card \/ Comment"/)
  assert.match(compose, /data-mode="Compose"/)
  assert.match(compose, /data-state="Active"/)
  assert.match(compose, /data-action="toggle-type-menu"/)
  const detail = renderNoteCard({ id: 'n1', state: 'Detail', body: 'Hi', meta: 'Ada', resolved: true })
  assert.match(detail, /data-mode="Detail"/)
  assert.match(detail, /data-state="Resolved"/)
  assert.match(detail, /aria-label="Reopen thread"/)
  assert.match(detail, /data-action="reply"/)
})

check('Annotation and Wording cards expose final variants and actions', () => {
  const annotation = renderAnnotationCard({ id: 'a1', state: 'Compose', kind: 'question' })
  assert.match(annotation, /data-vc-component="Card \/ Annotation"/)
  assert.match(annotation, /data-annotation-kind="question"/)
  assert.match(annotation, /data-vc-component="Card \/ Kind Chip"/)
  const wording = renderWordingCard({
    id: 'w1',
    state: 'Detail',
    originalText: 'From',
    suggestedText: 'To',
    status: 'pending',
  })
  assert.match(wording, /data-vc-component="Card \/ Wording"/)
  assert.match(wording, /data-action="apply-suggestion"/)
  assert.match(wording, /data-role="Original"/)
  assert.doesNotMatch(wording, /Approve|Reject|Preview/)
})

check('Cards v2 header and input actions follow Figma order', () => {
  const detail = renderNoteCard({ id: 'n1', state: 'Detail', body: 'Hi' })
  assert.match(
    detail,
    /data-action="toggle-overflow"[\s\S]*data-action="resolve"[\s\S]*data-action="close"[\s\S]*data-action="reply"/,
  )
  const compose = renderWordingCard({ id: 'w1', state: 'Compose' })
  assert.match(
    compose,
    /data-field="suggestedText"[\s\S]*data-field="rationale"[\s\S]*data-action="send"/,
  )
})

check('Cards v2 shared atoms expose exact contracts', () => {
  assert.match(renderSend({ state: 'Active' }), /data-vc-component="Card \/ Send"/)
  assert.match(renderApplySuggestion(), /aria-label="Apply suggestion"/)
  assert.match(renderHeaderIcon({ action: 'resolve', label: 'Resolve' }), /data-vc-component="Card \/ Header Icon"/)
  assert.match(renderTypeSelector({ open: true }), /role="menu"/)
  assert.doesNotMatch(renderTypeSelector({ disabled: true }), /class="vc-icon"/)
  assert.match(renderPin({ recordKind: 'suggestion', number: 'S' }), />1<\/button>/)
  assert.match(renderOverflowMenu(), /mark-unread[\s\S]*copy-link[\s\S]*delete/)
  assert.match(renderReply({ body: 'Reply' }), /data-vc-component="Card \/ Reply"/)
  assert.match(renderQuote({ role: 'Suggestion', apply: true }), /data-role="Suggestion"/)
  const combo = renderComboField({ firstValue: 'Ready', secondValue: 'Reason' })
  assert.match(combo, /data-state="Filled - Both"/)
  assert.match(combo, /data-state="Active" data-card-type="Wording"/)
})

check('toolbar icons carry the synced Figma geometry', () => {
  const icons = fs.readFileSync(path.join(ROOT, 'app/components/vis-bug/vis-bug.icons.js'), 'utf8')
  const signatures = {
    inspector: 'M11.9996 2C17.5225 2 21.9992 6.47794',
    comments: 'M19.0004 2C20.6572 2 22.0004 3.34312',
    content: 'M10.4147 3.58566C10.9666 3.58586',
    hueshift: 'M12.333 2.91699C17.528 2.91702',
    font: 'M20.0004 3C20.5524 3.00021',
    text: 'M13.8274 5.10679C15.3034 3.63107',
    search: 'M10.9992 3.28571C15.4172 3.28571',
    prompt: 'M12.3748 2.51753C12.9271 2.51753',
    margin: 'M2 18V9C2 8.44772 2.44772 8 3 8',
    padding: 'M4.54297 20.8086C4.6287 20.2631',
    align: 'M18.9996 3.99961C18.9998 3.4475',
    move: 'M9.8787 21.1924L8.46449 19.7782',
    accessibility: 'M21 12C21 7.02944 16.9706 3 12 3',
    boxshadow: 'M6 3L5.8457 3.00391C4.66962 3.06349',
    color_text: 'M10.4004 4.89961C10.7888 4.89974',
    color_background: 'M18.8089 14.4C19.0272 14.4',
    color_border: 'M10.9338 2.37105C11.5225 2.37128',
  }
  for (const [name, signature] of Object.entries(signatures))
    assert.ok(icons.includes(signature), `toolbar icon ${name} is out of sync with Figma`)
  // Figma exports carry a baked-in fill; the toolbar tints icons via currentColor.
  assert.equal(icons.includes('#111827'), false)
})

check('Position stays dormant and is excluded from the production toolbar', () => {
  const model = fs.readFileSync(path.join(ROOT, 'app/components/vis-bug/model.js'), 'utf8')
  const element = fs.readFileSync(path.join(ROOT, 'app/components/vis-bug/vis-bug.element.js'), 'utf8')
  const dormant = fs.readFileSync(path.join(ROOT, 'app/components/vis-bug/dormant-tools.js'), 'utf8')

  assert.equal(model.includes("tool:        'position'"), false)
  assert.equal(/\bPosition\b/.test(element), false)
  assert.equal(element.includes('  position() {'), false)
  assert.match(dormant, /export const DormantVisBugTools/)
  assert.match(dormant, /tool:\s+'position'/)
  assert.match(dormant, /export function activateDormantPosition/)
})

check('Notes panel uses Notes title and Wording filter', () => {
  const html = renderNotesPanel({ collapsed: false, hideResolved: true, filter: 'content', itemsHtml: '<div></div>' })
  assert.match(html, /data-vc-component="Notes Panel"/)
  assert.match(html, /data-state="Expanded"/)
  assert.match(html, />Notes</)
  assert.match(html, /Show resolved/)
  assert.match(html, /placeholder="Search"/)
  assert.match(html, /<svg viewBox="0 0 14 14" width="14" height="14">/)
  assert.match(html, /M9 9L12\.5 12\.5/)
  assert.match(html, /data-field="panel-search"/)
  assert.match(html, /data-action="cycle-filter"/)
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
  assert.equal(tokens.color.light['bg-surface'], '#f0f2f4')
  assert.equal(tokens.color.dark['bg-surface'], '#1f2937')
  assert.equal(tokens.color.light['badge-pending-background'], '#d4d7de')
  assert.equal(tokens.color.light['badge-success-background'], '#ecfccb')
  assert.match(css, /--vc-bg-surface: #f0f2f4/)
  assert.match(css, /--vc-badge-success-background: #ecfccb/)
  assert.match(css, /--vc-action-primary/)
  assert.match(css, /--vc-text-on-accent/)
  assert.match(css, /--vc-icon-on-accent/)
  assert.match(css, /--vc-size-pin: 28px/)
  assert.match(css, /--vc-shadow-card/)
  assert.match(css, /prefers-color-scheme: dark/)
  assert.match(fs.readFileSync(path.join(ROOT, 'design-system/generated/tokens.js'), 'utf8'), /export const layerTokenCss/)
  assert.match(fs.readFileSync(path.join(ROOT, 'extension/popup/tokens.css'), 'utf8'), /:root, :host/)
})

check('feedback layer honours an explicit toolbar theme', () => {
  const generated = fs.readFileSync(path.join(ROOT, 'design-system/generated/tokens.js'), 'utf8')
  assert.match(generated, /#vibecheck-layer\[data-scheme=\\"light\\"\][\s\S]*?--vc-bg-surface: #f0f2f4/)
  assert.match(generated, /#vibecheck-layer\[data-scheme=\\"dark\\"\][\s\S]*?--vc-bg-surface: #1f2937/)
  const ui = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-ui.js'), 'utf8')
  assert.match(ui, /export function setFeedbackScheme/)
  const element = fs.readFileSync(path.join(ROOT, 'app/components/vis-bug/vis-bug.element.js'), 'utf8')
  assert.match(element, /setFeedbackScheme\(newValue\)/)
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
    'Card / Field',
    'Card / ComboField',
    'Card / Send',
    'Card / Apply Suggestion',
    'Card / Quote',
    'Card / Type Selector',
    'Card / Overflow Menu',
    'Badge',
    'Feedback Pin',
    'Toolbar Search Popout',
    'Main Toolbar',
    'Color & AI Toolbar',
    'Toolbar Tip',
    'Card / Comment',
    'Card / Annotation',
    'Card / Wording',
    'Avatar',
    'Notes Panel',
    'Account & Inbox Popup',
  ])
    assert.ok(names.includes(name), `missing ${name}`)

  const helperRenderers = [
    'renderButton',
    'renderChip',
    'renderField',
    'renderComboField',
    'renderSend',
    'renderApplySuggestion',
    'renderQuote',
    'renderTypeSelector',
    'renderTypeMenuItem',
    'renderOverflowMenu',
    'renderOverflowItem',
    'renderReply',
    'renderHeaderIcon',
    'renderSelectedItem',
    'renderKindChip',
    'renderBadge',
    'renderPin',
    'renderNoteCard',
    'renderAnnotationCard',
    'renderWordingCard',
    'renderAvatar',
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
  const toolbarIcons = manifest.components.find(item => item.name === 'Toolbar Icon')
  for (const name of ['Border color', 'Palette', 'Text color'])
    assert.ok(toolbarIcons.variants.Name.includes(name), `missing toolbar icon ${name}`)
})

check('feedback CSS matches Figma semantic treatments', () => {
  const css = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-styles.js'), 'utf8')
  const contract = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/cards-v2-contract.json'), 'utf8'))
  assert.deepEqual(contract.behavior.overflow.menu, ['Mark unread', 'Copy link', 'Delete'])
  assert.match(css, /\.vc-pin\[data-state="Open"\][\s\S]*border-width: 3px/)
  assert.match(css, /\.vc-pin \{[\s\S]*border-radius: var\(--vc-radius-full\) var\(--vc-radius-full\) var\(--vc-radius-full\) var\(--vc-radius-6\)/)
  assert.match(css, /\.vc-combo-second \{[\s\S]*align-items: flex-end/)
  assert.match(css, /\.vc-combo-part:focus-within[\s\S]*box-shadow: inset 0 0 0 1\.5px var\(--vc-card-accent/)
  assert.match(css, /\.vc-combo-part\[data-invalid="true"\][\s\S]*box-shadow: inset 0 0 0 1\.5px var\(--vc-status-danger\)/)
  assert.match(css, /\.vc-card\[data-card-type="Suggestion"\] \.vc-send\[data-state="Active"\][\s\S]*color: var\(--vc-action-on-primary\)/)
  assert.match(css, /\.vc-send \{[\s\S]*flex: 0 0 28px/)
  assert.match(css, /\.vc-combo-second \{[\s\S]*border-radius/)
  assert.match(css, /\.vc-panel \{\n  opacity: 1;\n  filter: none;\n  mix-blend-mode: normal;/)
  assert.match(css, /\.vc-card-surface \{[\s\S]*width: 240px/)
  assert.match(css, /\.vc-card-surface \{[\s\S]*overflow: visible/)
  assert.match(css, /\.vc-badge\[data-type="Applied"\][\s\S]*--vc-badge-success-background/)
  assert.match(css, /\.vc-overflow-menu button \{[\s\S]*padding: var\(--vc-spacing-8\) var\(--vc-spacing-10\)/)
  assert.match(css, /\.vc-avatar \{[\s\S]*border: 1px solid var\(--vc-border-default\)/)
  assert.match(css, /\.vc-avatar \+ \.vc-avatar \{ margin-left: -5px; \}/)
})

check('Cards v2 lifecycle source excludes legacy actions', () => {
  const ui = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-ui.js'), 'utf8')
  assert.doesNotMatch(ui, /action === 'approve'|action === 'reject'|action === 'preview'/)
  assert.match(ui, /action === 'apply-suggestion'[\s\S]*status: 'applied'/)
  assert.match(ui, /action === 'resolve'[\s\S]*resolved: !open\.item\.resolved/)
  assert.match(ui, /parentSuggestionId/)
  assert.match(ui, /metaKey \|\| event\.ctrlKey/)
})

console.log('parity checks passed')

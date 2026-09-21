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
  renderFilterMenu,
  renderHeaderIcon,
  renderListMenuItem,
  renderOverflowMenu,
  renderPanelMoreMenu,
  renderTypeMenu,
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
import {
  PIN_ORIGIN_INSET,
  PIN_SPACING,
  groupPinsByElement,
  pinRowOrigin,
  pinRowPositions,
} from '../app/vibecheck/pin-layout.js'

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
  assert.match(pin, /<\/button>$/)
  assert.doesNotMatch(pin, />2<\/button>/)
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
  assert.match(renderOverflowMenu(), /mark-unread[\s\S]*delete/)
  assert.doesNotMatch(renderOverflowMenu(), /copy-link/)
  assert.match(renderTypeMenu({ type: 'Annotation' }), /data-menu="type"/)
  assert.match(renderTypeMenu({ type: 'Annotation' }), /aria-checked="true"[\s\S]*Annotation/)
  assert.match(renderReply({ body: 'Reply' }), /data-vc-component="Card \/ Reply"/)
  assert.match(renderQuote({ role: 'Suggestion', apply: true }), /data-role="Suggestion"/)
  const combo = renderComboField({ firstValue: 'Ready', secondValue: 'Reason' })
  assert.match(combo, /data-state="Filled - Both"/)
  assert.match(combo, /data-state="Active" data-card-type="Wording"/)
})

check('toolbar icons carry the synced Figma geometry', () => {
  const icons = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/vibe-check.icons.js'), 'utf8')
  const signatures = {
    inspector: 'M11.9996 2C17.5225 2 21.9992 6.47794',
    comments: 'M19.0004 2C20.6572 2 22.0004 3.34312',
    annotation: 'M9.46293 6.65721C9.75579 6.36435',
    content: 'M13 3.00019C13 2.4478 12.5522 1.99999',
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
  const model = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/model.js'), 'utf8')
  const element = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/vibe-check.element.js'), 'utf8')
  const dormant = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/dormant-tools.js'), 'utf8')

  assert.equal(model.includes("tool:        'position'"), false)
  assert.equal(/\bPosition\b/.test(element), false)
  assert.equal(element.includes('  position() {'), false)
  assert.match(dormant, /export const DormantVibeCheckTools/)
  assert.match(dormant, /tool:\s+'position'/)
  assert.match(dormant, /export function activateDormantPosition/)
})

check('Notes panel uses Search Field, header actions, and Writing filter', () => {
  const html = renderNotesPanel({ collapsed: false, hideResolved: true, filter: 'content', itemsHtml: '<div></div>' })
  assert.match(html, /data-vc-component="Notes Panel"/)
  assert.match(html, /data-state="Expanded"/)
  assert.match(html, />Notes</)
  assert.match(html, /data-vc-component="Search Field"/)
  assert.match(html, /placeholder="Search"/)
  assert.match(html, /vc-panel-search-leading[\s\S]*viewBox="0 0 24 24" width="16" height="16"/)
  assert.match(html, /M10\.9992 3\.28571/)
  assert.match(html, /data-field="panel-search"/)
  assert.match(html, /data-action="toggle-filter-menu"/)
  assert.match(html, /data-action="panel-more"/)
  assert.equal(html.includes('data-action="resolve-notes"'), false)
  assert.match(html, /Comments/)
  assert.match(html, /Writing/)
  assert.match(html, /data-filter="content"/)
  assert.match(html, /data-vc-component="Card \/ Icon Button"/)
  assert.match(html, /data-action="toggle-panel"/)
  assert.match(html, /M13\.9714 2\.02859/)
  const collapsed = renderNotesPanel({ collapsed: true, itemsHtml: '' })
  assert.match(collapsed, /M8\.66667 2\.66667/)
  assert.equal(html.includes('data-action="close"'), false)
})

check('Header icon filter action maps to funnel glyph', () => {
  const html = renderHeaderIcon({ action: 'toggle-filter-menu', label: 'Filter and sort notes' })
  assert.match(html, /data-vc-component="Card \/ Header Icon"/)
  assert.match(html, /data-action="toggle-filter-menu"/)
  assert.match(html, /M18 3C19\.6569 3/)
})

check('Filter menu renders sort options, divider, and resolved toggle', () => {
  const html = renderFilterMenu({ sortBy: 'date', showResolvedComments: false })
  assert.match(html, /data-vc-component="List Menu"/)
  assert.match(html, /data-menu="filter"/)
  assert.match(html, /data-action="set-sort-date"/)
  assert.match(html, /data-action="set-sort-unread"/)
  assert.match(html, /data-action="toggle-show-resolved"/)
  assert.match(html, /Sort by date/)
  assert.match(html, /Sort by unread/)
  assert.match(html, /Show resolved comments/)
  assert.match(html, /data-vc-component="Menu Divider"/)
  assert.match(html, /role="menuitemradio"[\s\S]*Sort by date/)
  assert.match(html, /role="menuitemcheckbox"[\s\S]*Show resolved comments/)
  const selected = renderListMenuItem({ label: 'Sort by date', action: 'set-sort-date', selected: true })
  assert.match(selected, /aria-checked="true"/)
  assert.match(selected, /Sort by date[\s\S]*vc-list-menu-check/)
})

check('Panel more menu renders toggles and mark-all-read', () => {
  const html = renderPanelMoreMenu({ hideComments: true, mentionsOnly: false })
  assert.match(html, /data-menu="panel-more"/)
  assert.match(html, /Hide comments/)
  assert.match(html, /Just mentions and replies/)
  assert.match(html, /Mark all as read/)
  assert.match(html, /data-action="toggle-hide-comments"/)
  assert.match(html, /data-action="toggle-mentions-only"/)
  assert.match(html, /data-action="mark-all-read"/)
})

check('Main toolbar PM Only model exposes inspect, comment, annotation, wording, and search', () => {
  const model = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/model.js'), 'utf8')
  const element = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/vibe-check.element.js'), 'utf8')
  assert.match(model, /export const VibeCheckModelPMOnly/)
  assert.match(model, /export function toolbarModelForRole/)
  assert.match(element, /data-role="\$\{this\.toolbar_role\}"/)
  assert.match(element, /default_tool_key = this\.toolbar_role === 'PM Only' \? 'i' : 'g'/)
  assert.match(element, /TOOLBAR_ROLE_STORAGE_KEY/)
  assert.match(model, /n: VibeCheckModel\.n/)
  assert.match(element, /annotations\(\)/)
})

check('Main Toolbar tool order matches Figma Role=Full and Role=PM Only', () => {
  const modelPath = path.join(ROOT, 'app/components/vibe-check/model.js')
  const modelSrc = fs.readFileSync(modelPath, 'utf8')
  const fullOrder = ['i', 'c', 'n', 'w', 'g', 'm', 'p', 'a', 'v', 'x', 'h', 'd', 'f', 'e', 's']
  const pmOrder = ['i', 'c', 'n', 'w', 's']
  const fullDividers = ['i', 'w', 'v', 'x']
  const pmDividers = ['i', 'w']

  const fullKeys = [...modelSrc.matchAll(/^\s{2}([a-z]):\s*\{/gm)].map(m => m[1])
  const pmBlock = modelSrc.match(/export const VibeCheckModelPMOnly = \{([\s\S]*?)\n\}/)
  assert.ok(pmBlock, 'VibeCheckModelPMOnly block missing')
  const pmKeys = [...pmBlock[1].matchAll(/^\s{2}([a-z]):\s/gm)].map(m => m[1])

  assert.deepEqual(fullKeys, fullOrder, 'Full toolbar key order drifted from Figma 352:9729')
  assert.deepEqual(pmKeys, pmOrder, 'PM Only toolbar key order drifted from Figma 352:9729')

  for (const key of fullDividers)
    assert.match(modelSrc, new RegExp(`^\\s{2}${key}:\\s*\\{[\\s\\S]*?dividerAfter: true`, 'm'), `missing dividerAfter on ${key}`)
  for (const key of pmDividers)
    assert.match(modelSrc, new RegExp(`^\\s{2}${key}:\\s*\\{[\\s\\S]*?dividerAfter: true`, 'm'), `PM Only inherits dividerAfter on ${key}`)
})

check('page cursor uses a follower for Comment, Annotation, and Wording', () => {
  const cursor = fs.readFileSync(path.join(ROOT, 'app/utilities/page-cursor.js'), 'utf8')
  const element = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/vibe-check.element.js'), 'utf8')
  assert.match(cursor, /FOLLOWER_TOOLS = new Set\(\['comments', 'annotations', 'content'\]\)/)
  assert.match(cursor, /cursor: none/)
  assert.match(cursor, /data:image\/svg\+xml/)
  assert.match(element, /setPageCursor\(\{ tool, icon: entry\.icon \}\)/)
  assert.match(element, /clearPageCursor\(\)/)
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
  assert.equal(tokens.color.light.surface, '#eeeff1')
  assert.equal(tokens.color.dark.surface, '#2e3138')
  assert.equal(tokens.color.light['badge-pending-background'], '#abb0ba')
  assert.equal(tokens.color.light['badge-success-background'], '#ecfccb')
  assert.equal(tokens.color.light['text-gray-medium'], '#737b8c')
  assert.equal(tokens.color.light['text-gray-light'], '#abb0ba')
  assert.equal(tokens.color.light['icon-subtle'], '#40454f')
  assert.equal(tokens.color.dark['icon-subtle'], '#d2d5da')
  assert.equal(tokens.color.light['surface-subtle'], '#d2d5da')
  assert.equal(tokens.color.dark['surface-subtle'], '#40454f')
  assert.equal(tokens.color.light['border-gray-light'], '#d2d5da')
  assert.equal(tokens.color.light['icon-gray-light'], '#abb0ba')
  assert.equal(tokens.color.light['icon-gray-medium'], '#737b8c')
  assert.equal(tokens.primitives['gray-200'], '#d2d5da')
  assert.equal(tokens.primitives['gray-700'], '#40454f')
  assert.equal(tokens.color.light['pin-suggestion'], '#be185d')
  assert.equal(tokens.color.dark['pin-suggestion'], '#be185d')
  assert.equal(tokens.color.light['text-body'], '#2e3138')
  assert.equal(tokens.color.light['bg-inverse'], '#17191c')
  assert.equal(tokens.color.light['border-gray-medium'], '#8f96a3')
  assert.equal(tokens.color.light.border, '#2e3138')
  assert.equal(tokens.primitives['pink-700'], '#be185d')
  assert.match(css, /--vc-pin-suggestion: #be185d/)
  assert.match(css, /--vc-surface: #eeeff1/)
  assert.match(css, /--vc-text-body: #2e3138/)
  assert.match(css, /--vc-bg-inverse: #17191c/)
  assert.match(css, /--vc-pink-700: #be185d/)
  assert.match(css, /--vc-badge-success-background: #ecfccb/)
  assert.match(css, /--vc-icon-subtle:/)
  assert.match(css, /--vc-icon-critical:/)
  assert.match(css, /--vc-button-primary:/)
  assert.match(css, /--vc-text-inverse:/)
  assert.match(css, /--vc-icon:/)
  assert.match(css, /--vc-icon-inverse:/)
  assert.match(
    fs.readFileSync(path.join(ROOT, 'app/components/_variables.css'), 'utf8'),
    /--theme-icon_color: var\(--vc-icon-subtle\)/,
  )
  assert.doesNotMatch(css, /--vc-text-primary:/)
  assert.doesNotMatch(css, /--vc-bg-surface:/)
  assert.doesNotMatch(css, /--vc-action-primary:/)
  assert.match(css, /--vc-size-pin: 28px/)
  assert.match(css, /--vc-shadow-card/)
  assert.match(css, /prefers-color-scheme: dark/)
  assert.match(fs.readFileSync(path.join(ROOT, 'design-system/generated/tokens.js'), 'utf8'), /export const layerTokenCss/)
  assert.match(fs.readFileSync(path.join(ROOT, 'extension/popup/tokens.css'), 'utf8'), /:root, :host/)
})

check('feedback layer honours an explicit toolbar theme', () => {
  const generated = fs.readFileSync(path.join(ROOT, 'design-system/generated/tokens.js'), 'utf8')
  assert.match(generated, /#vibecheck-layer\[data-scheme=\\"light\\"\][\s\S]*?--vc-surface: #eeeff1/)
  assert.match(generated, /#vibecheck-layer\[data-scheme=\\"dark\\"\][\s\S]*?--vc-surface: #2e3138/)
  const ui = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-ui.js'), 'utf8')
  assert.match(ui, /export function setFeedbackScheme/)
  const element = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/vibe-check.element.js'), 'utf8')
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
    'Field',
    'Search Field',
    'Card / Field',
    'Card / ComboField',
    'Card / Send',
    'Card / Apply Suggestion',
    'Card / Quote',
    'Card / Type Selector',
    'Card / Overflow Menu',
    'Menu List',
    'Menu item',
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
    'renderTypeMenu',
    'renderOverflowMenu',
    'renderOverflowItem',
    'renderFilterMenu',
    'renderPanelMoreMenu',
    'renderListMenuItem',
    'renderListMenuDivider',
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

check('pin tokens map to VibeCheck Colors collection IDs', () => {
  const contract = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/cards-v2-contract.json'), 'utf8'))
  const colorsCollectionPinIds = {
    'pin/note': 'VariableID:3:29',
    'pin/implement': 'VariableID:3:30',
    'pin/warning': 'VariableID:3:31',
    'pin/question': 'VariableID:3:32',
    'pin/suggestion': 'VariableID:58:5',
  }
  const removedComponentPinIds = [
    'VariableID:284:3',
    'VariableID:284:4',
    'VariableID:284:5',
    'VariableID:284:6',
    'VariableID:284:7',
  ]
  for (const [figmaName, expectedId] of Object.entries(colorsCollectionPinIds))
    assert.equal(contract.tokens[figmaName], expectedId, `${figmaName} should stay on VibeCheck Colors`)
  for (const id of removedComponentPinIds)
    assert.equal(Object.values(contract.tokens).includes(id), false, `${id} must not remain in contract`)
})

check('feedback CSS matches Figma semantic treatments', () => {
  const css = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-styles.js'), 'utf8')
  const contract = JSON.parse(fs.readFileSync(path.join(ROOT, 'design-system/cards-v2-contract.json'), 'utf8'))
  assert.deepEqual(contract.behavior.overflow.menu, ['Mark unread', 'Delete'])
  assert.match(css, /\.vc-pin\[data-state="Open"\][\s\S]*background: var\(--vc-surface\)/)
  assert.match(css, /\.vc-pin\[data-state="Open"\][\s\S]*border-width: 2px/)
  assert.match(css, /\.vc-pin\[data-state="Open"\]\[data-vc-type="Note"\][\s\S]*border-color: var\(--vc-pin-note\)/)
  assert.match(css, /\.vc-pin \{[\s\S]*border: 2px solid var\(--vc-icon-inverse\)/)
  assert.match(css, /\.vc-pin \{[\s\S]*color: var\(--vc-icon-inverse\)/)
  assert.match(css, /\.vc-pin\[data-vc-type="Suggestion"\] \{ background: var\(--vc-pin-suggestion\); \}/)
  assert.match(css, /\.vc-pin \{[\s\S]*border-radius: var\(--vc-radius-full\) var\(--vc-radius-full\) var\(--vc-radius-full\) var\(--vc-radius-6\)/)
  assert.doesNotMatch(css, /\.vc-pin\[data-state="Open"\][\s\S]*width: 36px/)
  assert.match(css, /\.vc-combo-second \{[\s\S]*align-items: flex-end/)
  assert.match(css, /\.vc-field:focus-within:not\(\[data-state="Error"\]\)[\s\S]*--vc-border-gray-medium/)
  assert.match(css, /\.vc-combo-part:focus-within[\s\S]*--vc-border-gray-medium/)
  assert.match(css, /Focus - Second \(First filled\)[\s\S]*--vc-pin-note/)
  assert.match(css, /\.vc-card\[data-card-type="Suggestion"\] \.vc-send\[data-state="Active"\][\s\S]*--vc-icon-inverse/)
  assert.match(css, /\.vc-combo-part\[data-invalid="true"\][\s\S]*box-shadow: inset 0 0 0 1\.5px var\(--vc-text-critical\)/)
  assert.match(css, /\.vc-kinds button \{[\s\S]*--vc-border-gray-light/)
  assert.match(css, /\.vc-thread-divider \{[\s\S]*--vc-border-gray-light/)
  assert.match(css, /\.vc-apply-suggestion \{[\s\S]*color: var\(--vc-text-gray-light\)/)
  assert.match(css, /\.vc-selected-item \{[\s\S]*color: var\(--vc-text-inverse\)/)
  assert.doesNotMatch(css, /\.vc-card\[data-card-type="Suggestion"\] \.vc-selected-item[\s\S]*--vc-button-primary-on/)
  assert.match(css, /\.vc-send \{[\s\S]*flex: 0 0 28px/)
  assert.match(css, /\.vc-combo-second \{[\s\S]*border-radius/)
  assert.match(css, /\.vc-panel-search \{[\s\S]*gap: var\(--vc-spacing-4\)/)
  assert.match(css, /\.vc-panel-search \{[\s\S]*padding: var\(--vc-spacing-6\) var\(--vc-spacing-4\) var\(--vc-spacing-6\) var\(--vc-spacing-8\)/)
  assert.match(css, /\.vc-panel-tools \{[\s\S]*height: 40px/)
  assert.match(css, /\.vc-panel-head \{[\s\S]*height: 43px/)
  assert.match(css, /\.vc-filters \{[\s\S]*flex-wrap: nowrap/)
  assert.match(css, /\.vc-filters \{[\s\S]*overflow-x: auto/)
  assert.match(css, /\.vc-filters::-webkit-scrollbar \{[\s\S]*display: none/)
  assert.match(css, /\.vc-filters \{[\s\S]*min-width: 0/)
  assert.match(css, /\.vc-filters \{[\s\S]*width: 100%/)
  assert.match(css, /\.vc-filters \{[\s\S]*padding: var\(--vc-spacing-8\) var\(--vc-spacing-12\)/)
  assert.match(css, /\.vc-panel-body \{[\s\S]*overflow-x: hidden/)
  assert.match(css, /\.vc-panel-body \{[\s\S]*overflow-y: auto/)
  assert.match(css, /#vibecheck-layer \.vc-panel \{[\s\S]*filter: none;[\s\S]*mix-blend-mode: normal;/)
  assert.match(css, /#vibecheck-layer \.vc-panel \{[\s\S]*opacity: 1;/)
  assert.match(css, /\.vc-card-surface \{[\s\S]*width: 240px/)
  assert.match(css, /\.vc-card-surface \{[\s\S]*overflow: visible/)
  assert.match(css, /\.vc-badge\[data-type="Applied"\][\s\S]*--vc-badge-success-background/)
  assert.match(css, /\.vc-list-menu \{[\s\S]*background-color: var\(--vc-bg/)
  assert.match(css, /\.vc-list-menu \{[\s\S]*min-width: 167px/)
  assert.match(css, /\.vc-list-menu-item \{[\s\S]*padding: var\(--vc-spacing-6\) var\(--vc-spacing-10\)/)
  assert.match(css, /\.vc-list-menu-item \{[\s\S]*gap: var\(--vc-spacing-8\)/)
  assert.match(css, /\.vc-list-menu-item:hover[\s\S]*background: var\(--vc-surface\)/)
  assert.match(css, /\.vc-list-menu-item-selected[\s\S]*background: var\(--vc-surface\)/)
  assert.match(css, /\.vc-list-menu-check \{[\s\S]*width: 16px/)
  assert.match(css, /\.vc-list-menu-divider \{[\s\S]*background: var\(--vc-border-gray-light\)/)
  assert.match(css, /\.vc-list-menu-item-critical[\s\S]*--vc-text-critical/)
  assert.match(css, /\.vc-avatar \{[\s\S]*border: 1\.5px solid var\(--vc-surface\)/)
  assert.match(css, /\.vc-avatar \{[\s\S]*color: var\(--vc-text-inverse\)/)
  assert.match(css, /\.vc-avatar \+ \.vc-avatar \{ margin-left: -5px; \}/)
})

check('toolbar CSS matches Figma semantic treatments', () => {
  const css = fs.readFileSync(path.join(ROOT, 'app/components/vibe-check/vibe-check.element.css'), 'utf8')
  const vars = fs.readFileSync(path.join(ROOT, 'app/components/_variables.css'), 'utf8')
  assert.match(vars, /--theme-icon_active-bg: var\(--vc-button-primary\)/)
  assert.match(css, /&:first-of-type \{[\s\S]*background-color: var\(--vc-surface\)/)
  assert.match(css, /&:first-of-type \{[\s\S]*box-shadow: var\(--vc-shadow-panel\)/)
  assert.match(css, /&\[data-active=true\][\s\S]*background-color: var\(--theme-icon_active-bg\)/)
  assert.doesNotMatch(css, /&\[data-active=true\][\s\S]*box-shadow: var\(--shadow-2\)/)
  assert.match(css, /\.prompt-action \{[\s\S]*border: 2px solid var\(--vc-button-primary\)/)
  assert.match(css, /\.prompt-action \{[\s\S]*box-shadow: var\(--vc-shadow-pin\)/)
  assert.match(css, /\.prompt-action[\s\S]*&:active \{[\s\S]*--vc-surface-subtle/)
})

check('active product code and paths use the VibeCheck name', () => {
  const tracked = execFileSync('git', ['ls-files', '-z'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).split('\0').filter(Boolean)
  const legacyName = /vis[ -]?bug/i
  const legalAndOperationalExceptions = new Set([
    '.firebaserc',
    'NOTICE',
    'PLAN.md',
    'package.json',
    'readme.md',
  ])

  tracked.forEach(file => {
    assert.doesNotMatch(file, legacyName, `legacy product name in path: ${file}`)
    if (legalAndOperationalExceptions.has(file)) return

    const contents = fs.readFileSync(path.join(ROOT, file))
    if (contents.includes(0)) return
    assert.doesNotMatch(contents.toString('utf8'), legacyName, `legacy product name in ${file}`)
  })
})

check('Cards v2 lifecycle source excludes legacy actions', () => {
  const ui = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-ui.js'), 'utf8')
  assert.doesNotMatch(ui, /action === 'approve'|action === 'reject'|action === 'preview'/)
  assert.match(ui, /action === 'apply-suggestion'[\s\S]*status: 'applied'/)
  assert.match(ui, /action === 'resolve'[\s\S]*resolved: !open\.item\.resolved/)
  assert.match(ui, /parentSuggestionId/)
  assert.match(ui, /metaKey \|\| event\.ctrlKey/)
})

check('pins sharing an element spread into a 32px horizontal row', () => {
  const hero = { tag: 'hero' }
  const rect = { left: 40, top: 200 }
  const group = groupPinsByElement([
    { pin: 'b', el: hero, record: { id: 'b', createdAt: '2026-01-02T00:00:00Z' } },
    { pin: 'a', el: hero, record: { id: 'a', createdAt: '2026-01-01T00:00:00Z' } },
    { pin: 'c', el: hero, record: { id: 'c', createdAt: '2026-01-03T00:00:00Z' } },
  ]).get(hero)
  // Oldest first, id as tie-break, so panel sort order never reshuffles the row.
  assert.deepEqual(group.map(entry => entry.pin), ['a', 'b', 'c'])

  const origin = pinRowOrigin(rect)
  assert.deepEqual(origin, { left: rect.left + PIN_ORIGIN_INSET, top: rect.top + PIN_ORIGIN_INSET })
  const lefts = pinRowPositions(group.length, { origin: origin.left, viewportWidth: 1280 })
  assert.deepEqual(lefts, [48, 80, 112])
  assert.deepEqual(lefts.slice(1).map((left, i) => left - lefts[i]), [PIN_SPACING, PIN_SPACING])

  // Rows fold back onto their own origin rather than clamping to the viewport.
  assert.deepEqual(pinRowPositions(3, { origin: 1272, viewportWidth: 1280 }), [1208, 1240, 1272])
  assert.deepEqual(pinRowPositions(1, { origin: 4000, viewportWidth: 1280 }), [4000])
  assert.deepEqual(pinRowPositions(2, { origin: -500, viewportWidth: 1280 }), [-500, -468])

  const ui = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-ui.js'), 'utf8')
  assert.match(ui, /groupPinsByElement/)
  assert.match(ui, /placePinRows\(pinEntries\)/)
  const css = fs.readFileSync(path.join(ROOT, 'app/vibecheck/feedback-styles.js'), 'utf8')
  assert.match(css, /\.vc-pin \{[\s\S]*transform: translate\(-50%, -50%\)/)
})

check('consumers no longer reference legacy foundation CSS names', () => {
  const legacyVars = [
    '--vc-text-primary',
    '--vc-text-secondary',
    '--vc-text-muted',
    '--vc-text-on-accent',
    '--vc-bg-page',
    '--vc-bg-surface',
    '--vc-bg-subtle',
    '--vc-bg-input',
    '--vc-border-default',
    '--vc-action-primary',
    '--vc-action-on-primary',
    '--vc-action-primary-hover',
    '--vc-action-secondary-hover',
    '--vc-status-danger',
    '--vc-link-accent',
    '--vc-icon-on-accent',
  ]
  const consumerFiles = [
    'app/vibecheck/feedback-styles.js',
    'app/components/vibe-check/vibe-check.element.css',
    'app/components/vibe-check/vibe-check.element.js',
    'app/components/_variables.css',
    'app/components/_variables_light.css',
    'app/components/_variables_dark.css',
    'extension/popup/popup.css',
    'extension/toolbar/bundle.min.js',
  ]
  const usagePattern = name => new RegExp(`var\\(${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([,)\\s])`)
  const hits = []
  for (const rel of consumerFiles) {
    const contents = fs.readFileSync(path.join(ROOT, rel), 'utf8')
    for (const name of legacyVars) {
      if (usagePattern(name).test(contents) || contents.includes(`'${name}'`) || contents.includes(`"${name}"`))
        hits.push(`${rel}: ${name}`)
    }
  }
  assert.deepEqual(hits, [])
})

console.log('parity checks passed')

import test from 'ava'
import {
  renderComboField,
  renderNoteCard,
  renderWordingCard,
} from './components'
import { migrateStore } from './storage'
import { convertDraftType, relativeTime } from './card-state'

test('migrates legacy suggestion lifecycle into independent axes', t => {
  const migrated = migrateStore({
    version: 1,
    comments: [],
    notifications: [],
    suggestions: [
      { id: 'a', status: 'approved' },
      { id: 'r', status: 'rejected' },
      { id: 'p', status: 'pending' },
    ],
  })
  t.is(migrated.version, 2)
  t.deepEqual(
    migrated.suggestions.map(({ status, resolved }) => ({ status, resolved })),
    [
      { status: 'applied', resolved: true },
      { status: 'pending', resolved: true },
      { status: 'pending', resolved: false },
    ],
  )
})

test('relative timestamps follow Cards v2 bucket boundaries', t => {
  const now = new Date('2026-09-15T12:00:00Z').getTime()
  const ago = seconds => new Date(now - seconds * 1000).toISOString()
  t.is(relativeTime(ago(59), now), 'just now')
  t.is(relativeTime(ago(60), now), '1 min ago')
  t.is(relativeTime(ago(3599), now), '59 min ago')
  t.is(relativeTime(ago(3600), now), '1 h ago')
  t.is(relativeTime(ago(86400), now), '1 days ago')
  t.is(relativeTime(ago(604800), now), '1 weeks ago')
  t.notRegex(relativeTime(ago(3024000), now), /ago$/)
})

test('ComboField sendability and failure remain first-field scoped', t => {
  const empty = renderComboField({ secondValue: 'Optional reasoning' })
  const ready = renderComboField({ firstValue: 'Ship this' })
  const failed = renderComboField({
    firstValue: 'Ship this',
    secondValue: 'Because it is clearer',
    state: 'Submit failed',
    error: 'Could not send',
  })
  t.regex(empty, /data-state="Default" data-card-type="Wording"/)
  t.regex(ready, /data-state="Active" data-card-type="Wording"/)
  t.regex(failed, /Ship this/)
  t.regex(failed, /Because it is clearer/)
  t.regex(failed, /data-field="suggestedText"[^>]*aria-invalid="true"/)
  t.notRegex(failed, /data-field="rationale"[^>]*aria-invalid/)
})

test('Apply Suggestion and Resolve remain independent repeatable actions', t => {
  const html = renderWordingCard({
    id: 'w1',
    state: 'Detail',
    originalText: 'Before',
    suggestedText: 'After',
    status: 'applied',
    resolved: false,
  })
  t.regex(html, /data-action="apply-suggestion"/)
  t.regex(html, /data-action="resolve"/)
  t.regex(html, /data-status="Applied"/)
  t.regex(html, /data-resolution="Open"/)
  t.notRegex(html, /Approve|Reject|Preview/)
})

test('resolved cards retain their detail variant for Show resolved', t => {
  const html = renderNoteCard({
    id: 'n1',
    state: 'Detail',
    body: 'Keep this thread',
    resolved: true,
  })
  t.regex(html, /data-state="Resolved"/)
  t.regex(html, /data-resolution="Resolved"/)
  t.regex(html, /aria-label="Reopen thread"/)
})

test('type conversion preserves compatible draft content', t => {
  const comment = {
    id: 'd1',
    recordType: 'comment',
    type: 'note',
    body: 'Preserve me',
    anchor: {},
  }
  const annotation = convertDraftType(comment, 'Annotation')
  t.is(annotation.body, 'Preserve me')
  t.is(annotation.type, 'annotation')
  const back = convertDraftType(annotation, 'Comment')
  t.is(back.body, 'Preserve me')
  t.is(back.type, 'note')
})

test('suggestion replies retain explicit parent ownership', t => {
  const migrated = migrateStore({
    comments: [{ id: 'reply', body: 'Agreed', parentSuggestionId: 'suggestion' }],
  })
  t.is(migrated.comments[0].parentSuggestionId, 'suggestion')
  t.is(migrated.comments[0].parentId, undefined)
})

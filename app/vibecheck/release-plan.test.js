import test from 'ava'
import fs from 'fs'
import path from 'path'

import {
  CURRENT_RELEASE_PHASE,
  RELEASE_FEATURES,
  isFeatureEnabled,
} from './release-plan'

const ROOT = process.cwd()

function parseDocFence() {
  const doc = fs.readFileSync(path.join(ROOT, 'docs/release-plan.md'), 'utf8')
  const match = doc.match(/```release-plan\n([\s\S]*?)```/)
  if (!match) throw new Error('Missing release-plan fence in docs/release-plan.md')
  return match[1]
    .trim()
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [id, phase] = line.trim().split(/\s+/)
      return { id, phase: Number(phase) }
    })
}

test('CURRENT_RELEASE_PHASE is 0', t => {
  t.is(CURRENT_RELEASE_PHASE, 0)
})

test('RELEASE_FEATURES matches docs fence', t => {
  const fence = parseDocFence()
  const fromCode = RELEASE_FEATURES.map(({ id, phase }) => ({ id, phase }))
  t.deepEqual(fromCode, fence)
})

test('feature ids are unique', t => {
  const ids = RELEASE_FEATURES.map(item => item.id)
  t.is(ids.length, new Set(ids).size)
})

test('extension copy matches app release-plan.js', t => {
  const app = fs.readFileSync(path.join(ROOT, 'app/vibecheck/release-plan.js'), 'utf8')
  const ext = fs.readFileSync(path.join(ROOT, 'extension/release-plan.js'), 'utf8')
  t.is(ext, app)
})

test('Phase 0 features are enabled', t => {
  t.true(isFeatureEnabled('guides'))
  t.true(isFeatureEnabled('ai-prompt'))
})

test('post-Phase 0 features are disabled by default', t => {
  t.false(isFeatureEnabled('margin'))
  t.false(isFeatureEnabled('annotation'))
  t.false(isFeatureEnabled('inbox'))
  t.false(isFeatureEnabled('color-actions'))
  t.false(isFeatureEnabled('color-format'))
  t.false(isFeatureEnabled('search'))
  t.false(isFeatureEnabled('toolbar-role'))
  t.false(isFeatureEnabled('ai-prompt-v2'))
  t.false(isFeatureEnabled('toolbar-enhanced-layout'))
})

test('__VIBECHECK_FEATURES__ all enables gated features', t => {
  globalThis.__VIBECHECK_FEATURES__ = 'all'
  t.true(isFeatureEnabled('margin'))
  delete globalThis.__VIBECHECK_FEATURES__
})

test('unknown feature id throws', t => {
  t.throws(() => isFeatureEnabled('not-a-real-feature'))
})

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY, freshState, validateEmail, validateWorkspace,
  loadState, saveState, resetExercise,
} from '../src/exercise-state.mjs';

function memoryStorage(initial = {}) {
  const entries = new Map(Object.entries(initial));
  return {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: key => entries.delete(key),
  };
}

test('fresh state is independent and has the exercise defaults', () => {
  assert.deepEqual(freshState(), { interrupted: false, accessConfirmed: false, updates: true });
  const first = freshState();
  first.updates = false;
  assert.equal(freshState().updates, true);
});

test('email accepts a local part and valid domain', () => {
  for (const [local, domain] of [['sam', 'zendesk.com'], [' sam.w+team ', ' example.co.uk ']]) {
    assert.equal(validateEmail(local, domain), true);
  }
  for (const [local, domain] of [
    ['', 'zendesk.com'], ['sam test', 'zendesk.com'], ['sam@other', 'zendesk.com'],
    ['sam', ''], ['sam', 'com'], ['sam', '.com'], ['sam', 'example..com'],
    ['sam', 'example.com@other'], [null, 'example.com'], ['sam', undefined],
  ]) assert.equal(validateEmail(local, domain), false, `${local}@${domain}`);
});

test('workspace validation counts trimmed characters', () => {
  assert.equal(validateWorkspace('Design'), true);
  assert.equal(validateWorkspace('  Design team  '), true);
  assert.equal(validateWorkspace(' short '), false);
  assert.equal(validateWorkspace('      '), false);
  assert.equal(validateWorkspace(null), false);
});

test('state persists only recognized boolean values', () => {
  const storage = memoryStorage();
  assert.equal(saveState(storage, { interrupted: true, accessConfirmed: true, updates: false, extra: 'private' }), true);
  assert.deepEqual(loadState(storage), { interrupted: true, accessConfirmed: true, updates: false });
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), { interrupted: true, accessConfirmed: true, updates: false });
});

test('missing, malformed, and invalid stored data safely fall back', () => {
  for (const value of [undefined, '{broken', 'null', '42', '"text"', '[]']) {
    const storage = memoryStorage(value === undefined ? {} : { [STORAGE_KEY]: value });
    assert.deepEqual(loadState(storage), freshState());
  }
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ interrupted: true, accessConfirmed: 'yes', updates: 0 }) });
  assert.deepEqual(loadState(storage), { interrupted: true, accessConfirmed: false, updates: true });
});

test('unavailable storage never breaks the page', () => {
  const unavailable = {
    getItem() { throw new Error('Blocked'); },
    setItem() { throw new Error('Quota exceeded'); },
    removeItem() { throw new Error('Blocked'); },
  };
  for (const storage of [undefined, null, unavailable]) {
    assert.deepEqual(loadState(storage), freshState());
    assert.equal(saveState(storage, freshState()), false);
    assert.equal(resetExercise(storage), false);
  }
});

test('reset clears only this exercise and preserves unrelated storage', () => {
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify({ interrupted: true }), unrelated: 'keep me' });
  assert.equal(resetExercise(storage), true);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.equal(storage.getItem('unrelated'), 'keep me');
  assert.deepEqual(loadState(storage), freshState());
});

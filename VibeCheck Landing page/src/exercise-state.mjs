export const STORAGE_KEY = 'vibecheck-landing-exercise-v1';

export function freshState() {
  return { interrupted: false, accessConfirmed: false, updates: true };
}

function mergeState(value) {
  const state = freshState();
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of Object.keys(state)) {
      if (typeof value[key] === 'boolean') state[key] = value[key];
    }
  }
  return state;
}

export function validateEmail(local, domain) {
  if (typeof local !== 'string' || typeof domain !== 'string') return false;
  return /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(`${local.trim()}@${domain.trim()}`);
}

export function validateWorkspace(name) {
  return typeof name === 'string' && name.trim().length >= 6;
}

export function loadState(storage) {
  try {
    return mergeState(JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch {
    return freshState();
  }
}

export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(mergeState(state)));
    return true;
  } catch {
    return false;
  }
}

export function resetExercise(storage) {
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

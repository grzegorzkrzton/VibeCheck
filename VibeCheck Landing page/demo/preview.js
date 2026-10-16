// This adapter supplies only an isolated document, sample data, and transport.
// Toolbar rendering, Comment/Wording cards, pins, replies, and resolution are
// executed by the byte-identical extension runtime in ./vendor/vibecheck.js.
const CHANNEL = 'vibecheck-landing-live-demo-v1';
const values = new Map();
const memoryStorage = {
  get length() { return values.size; },
  key(index) { return [...values.keys()][index] ?? null; },
  getItem(key) { return values.has(String(key)) ? values.get(String(key)) : null; },
  setItem(key, value) { values.set(String(key), String(value)); },
  removeItem(key) { values.delete(String(key)); },
  clear() { values.clear(); },
};
// Per-window override: the parent and installed extension keep native storage.
Object.defineProperty(window, 'localStorage', { configurable: true, value: memoryStorage });
// The unchanged runtime resolves its feedback fonts with extension.getURL when
// available. Supply only that asset resolver in this iframe; omitting messaging
// and storage APIs keeps its existing in-page persistence path active.
if (!window.chrome?.runtime?.getURL) {
  const previewChrome = window.chrome || {};
  const previewRuntime = previewChrome.runtime || {};
  previewRuntime.getURL = asset => new URL(`../${asset}`, import.meta.url).href;
  previewChrome.runtime = previewRuntime;
  window.chrome = previewChrome;
}
const storeURL = new URL(location.href);
storeURL.search = '';
storeURL.hash = '';
const seedID = 'landing-demo-comment';
const anchor = { tag: 'button', id: 'sample-target', classes: ['prototype-button'], cssPath: '#sample-target', text: 'Create your project', role: null, ariaLabel: null };
memoryStorage.setItem(`vibecheck:store:${storeURL.href}`, JSON.stringify({
  version: 2,
  comments: [{ id: seedID, type: 'note', recordType: 'comment', body: 'Could we make this action a little more specific? What happens after I click?', authorName: 'Example reviewer', resolved: false, parentId: null, parentSuggestionId: null, createdAt: new Date().toISOString(), anchor }],
  suggestions: [], notifications: [],
}));
memoryStorage.setItem('vibecheck:authorName', 'You');
memoryStorage.setItem('vibecheck:panelLayout', JSON.stringify({ left: null, top: 40, collapsed: innerWidth < 850 }));
history.replaceState(null, '', `${location.pathname}#vibecheck-thread=${seedID}`);

let toolbar;
function notify(type, detail = {}) {
  if (parent !== window) parent.postMessage({ channel: CHANNEL, type, ...detail }, location.origin);
}
function selectMode(mode, select = true) {
  const tool = { comment: 'comments', wording: 'content', inspect: 'inspector' }[mode];
  if (!tool || !toolbar?.selectorEngine) return;
  toolbar.selectorEngine.unselect_all({ silent: true });
  toolbar.toolSelected(tool);
  if (select) {
    toolbar.selectorEngine.select(document.querySelector(mode === 'inspect' ? '#sample-heading' : '#sample-target'));
    if (mode !== 'inspect') requestAnimationFrame(() => document.querySelector(`#vibecheck-layer [data-field="${mode === 'wording' ? 'suggestedText' : 'body'}"]`)?.focus({ preventScroll: true }));
  }
}
window.addEventListener('message', event => {
  if (event.source !== parent || event.origin !== location.origin || event.data?.channel !== CHANNEL) return;
  if (event.data.type === 'mode') selectMode(event.data.mode);
  if (event.data.type === 'comment') selectMode('comment');
  if (event.data.type === 'reset') location.reload();
});

try {
  await import('./vendor/vibecheck.js');
  await customElements.whenDefined('vibe-check');
  toolbar = document.createElement('vibe-check');
  toolbar.setAttribute('color-scheme', 'light');
  toolbar.setAttribute('tutsBaseURL', './vendor/tuts');
  document.body.prepend(toolbar);
  await new Promise((resolve, reject) => {
    let frames = 0;
    const ready = () => {
      if (toolbar.selectorEngine && toolbar.active_tool && document.querySelector('#vibecheck-layer .vc-card')) return resolve();
      if (++frames > 360) return reject(new Error('VibeCheck preview initialization timed out.'));
      requestAnimationFrame(ready);
    };
    ready();
  });
  selectMode('comment', false);
  const modes = { comments: 'comment', content: 'wording', inspector: 'inspect' };
  new MutationObserver(() => notify('mode-changed', { mode: modes[toolbar.activeTool] || null })).observe(toolbar.$shadow, { subtree: true, attributes: true, attributeFilter: ['data-active'] });
  document.documentElement.dataset.previewReady = 'true';
  notify('ready', { mode: 'comment' });
} catch (error) {
  document.querySelector('#preview-error').hidden = false;
  notify('error');
  console.error(error);
}

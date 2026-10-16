import { freshState, loadState, saveState, resetExercise, validateEmail, validateWorkspace } from './src/exercise-state.mjs';
import { cardIcon } from './src/ui-icons.mjs';

const root = document.querySelector('#landing-root');
const $ = selector => root.querySelector(selector);
const $$ = selector => [...root.querySelectorAll(selector)];
let storage;
try { storage = window.localStorage; } catch { storage = null; }
let state = loadState(storage);
let formStep = 'form';
const stack = [];
const returnTargets = new Map();
const backdrop = document.createElement('div');
backdrop.className = 'dialog-backdrop';
backdrop.hidden = true;
backdrop.setAttribute('aria-hidden', 'true');
root.append(backdrop);

$$('[data-icon]').forEach(node => { node.innerHTML = cardIcon(node.dataset.icon, 20); });

// Non-modal dialogs deliberately stay below the real extension overlays.
// Never make the body inert, capture pointer selection, or intercept extension shortcuts.
function openDialog(id) {
  const dialog = $(`#${id}`);
  if (dialog.open) return;
  const previous = stack.at(-1);
  if (previous) previous.inert = true;
  returnTargets.set(dialog, document.activeElement);
  dialog.style.zIndex = String(90 + stack.length);
  dialog.show();
  stack.push(dialog);
  backdrop.hidden = false;
  const first = dialog.querySelector('button, input, [tabindex="0"]');
  first?.focus({ preventScroll: true });
}

function closeDialog(dialog = stack.at(-1)) {
  if (!dialog || !dialog.open) return;
  if (dialog !== stack.at(-1)) {
    while (stack.at(-1) && stack.at(-1) !== dialog) closeDialog();
  }
  stack.pop();
  dialog.close();
  dialog.inert = false;
  const previous = stack.at(-1);
  if (previous) previous.inert = false;
  backdrop.hidden = stack.length === 0;
  const target = returnTargets.get(dialog);
  if (target?.isConnected && !target.closest('[hidden]') && !target.closest('[inert]')) target.focus({ preventScroll: true });
  returnTargets.delete(dialog);
}

function closeAll() {
  while (stack.length) closeDialog();
}
backdrop.addEventListener('click', () => closeDialog());
$$('.landing-dialog').forEach(dialog => {
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape' && event.target.closest('.landing-dialog') === stack.at(-1)) {
      event.preventDefault();
      closeDialog(dialog);
    }
  });
});

function announce(message) { $('#live-message').textContent = message; }
function persist() { saveState(storage, state); }

const info = {
  release: {
    kicker: 'MEET THE CURRENT TOOLKIT',
    title: 'A little inspiration first.',
    content: '<p>Good feedback starts with noticing the details. This build brings seven tools together on the page:</p><ul><li>Inspect, Guides, and Accessibility for a closer look.</li><li>Comment and Wording for feedback in context.</li><li>Edit Text and AI Prompt to explore a clearer next step.</li></ul><p>For installation, follow your internal pilot’s approved access process.</p>',
    action: '<button class="button button-lime" data-action="access-from-info">Continue to setup <span aria-hidden="true">↗</span></button>',
  },
  install: {
    kicker: 'GETTING STARTED', title: 'A page worth a closer look.',
    content: '<p>VibeCheck is an internal Chrome extension. Access and distribution depend on the approved pilot process.</p><ol><li>Get the approved extension package from your pilot organizer.</li><li>If your pilot uses an unpacked build, open Chrome’s Extensions page, enable Developer mode, and load the <code>extension/</code> folder.</li><li>Open your prototype, click VibeCheck, and sign in when prompted.</li></ol><p>This site does not install the extension. The setup form here is a local demonstration.</p>',
    action: '<button class="button button-dark" data-close="info-dialog">Got it</button>',
  },
  privacy: {
    kicker: 'YOUR DETAILS STAY HERE', title: 'Just a local demonstration.',
    content: '<p>The setup and support interactions on this site do not send data, create accounts, request access, or subscribe you to updates.</p><p>Only three exercise flags are saved in this browser: whether the interruption appeared, whether the demonstration was completed, and the simulated updates preference. Form text stays in memory until you reset or reload.</p><p>The actual VibeCheck extension has its own sign-in and shared-feedback backend. Using it to leave feedback is separate from this website’s local forms.</p>',
    action: '<button class="button button-dark" data-close="info-dialog">Back to the page</button>',
  },
  support: {
    kicker: 'A LITTLE HELP', title: 'What’s on your mind?',
    content: '<p>For real access or installation help, contact your pilot organizer through your agreed internal channel.</p><p class="local-notice">Local support demo. No messages are sent.</p><form id="support-form"><label class="field-label" for="support-message">Your question</label><textarea id="support-message" rows="3" placeholder="Something you’re wondering about…" required></textarea><div id="support-preview" hidden><strong>Message preview</strong><p id="support-preview-body"></p></div><p id="support-status" role="status"></p><div class="dialog-actions"><button class="button button-dark" type="submit">Preview message</button></div></form>',
    action: '',
  },
};

function showInfo(kind) {
  const content = info[kind];
  $('#info-title').textContent = content.title;
  $('#info-kicker').textContent = content.kicker;
  $('#info-content').innerHTML = content.content;
  $('#info-actions').innerHTML = content.action;
  $('#info-actions').hidden = !content.action;
  if (kind === 'support') {
    $('#support-form').addEventListener('submit', event => {
      event.preventDefault();
      $('#support-preview-body').textContent = $('#support-message').value;
      $('#support-preview').hidden = false;
      $('#support-status').textContent = 'Nothing was sent. Contact your pilot organizer to get help.';
    });
  }
  openDialog('info-dialog');
}

function showStep(step) {
  formStep = step;
  $('#access-form-step').hidden = step !== 'form';
  $('#access-review-step').hidden = step !== 'review';
  $('#access-complete-step').hidden = step !== 'complete';
  $('#access-title').textContent = step === 'complete' ? 'That’s a good start.' : 'Make yourself at home.';
  $('.dialog-description').hidden = step === 'complete';
}

function showAccess() {
  if (state.accessConfirmed) {
    showStep('complete');
    $('#receipt-preference').textContent = `Simulated product updates: ${state.updates ? 'enabled' : 'disabled'}.`;
  } else if (formStep === 'complete') showStep('form');
  openDialog('access-dialog');
}

root.addEventListener('click', event => {
  const close = event.target.closest('[data-close]');
  if (close) {
    event.preventDefault();
    closeDialog($(`#${close.dataset.close}`));
    return;
  }
  const action = event.target.closest('[data-action]');
  if (!action) return;
  event.preventDefault();
  if (action.dataset.action === 'access') showAccess();
  else if (action.dataset.action === 'access-from-info') { closeDialog($('#info-dialog')); showAccess(); }
  else if (Object.hasOwn(info, action.dataset.action)) showInfo(action.dataset.action);
});

// VC-07/08: Validation deliberately withholds the workspace rule and gives vague email guidance.
$('#access-form').addEventListener('submit', event => {
  event.preventDefault();
  const emailValid = validateEmail($('#email-name').value, $('#email-domain').value);
  const workspaceValid = validateWorkspace($('#workspace').value);
  $('#email-error').hidden = emailValid;
  $('#workspace-error').hidden = workspaceValid;
  $('#email-name').setAttribute('aria-invalid', String(!emailValid));
  $('#email-domain').setAttribute('aria-invalid', String(!emailValid));
  $('#workspace').setAttribute('aria-invalid', String(!workspaceValid));
  ['#email-name', '#email-domain'].forEach(selector => { if (emailValid) $(selector).removeAttribute('aria-describedby'); else $(selector).setAttribute('aria-describedby', 'email-error'); });
  if (workspaceValid) $('#workspace').removeAttribute('aria-describedby'); else $('#workspace').setAttribute('aria-describedby', 'workspace-error');
  if (!emailValid || !workspaceValid) {
    (!emailValid ? $('#email-name') : $('#workspace')).focus();
    return;
  }
  state.updates = $('#updates').checked;
  persist();
  $('#review-workspace').textContent = $('#workspace').value.trim();
  $('#review-updates').textContent = state.updates ? 'Enabled' : 'Disabled';
  // VC-12: 100% and "You're all set" appear before the final confirmation.
  showStep('review');
  $('#finish-setup').focus();
});
$('#email-help').addEventListener('click', () => {
  $('#email-guidance').hidden = !$('#email-guidance').hidden;
  $('#email-help').setAttribute('aria-expanded', String(!$('#email-guidance').hidden));
});
$('#email-help').setAttribute('aria-expanded', 'false');
$('#email-help').setAttribute('aria-controls', 'email-guidance');
// VC-10: deterministic once-per-reset interruption, triggered during a real task.
$('#workspace').addEventListener('input', () => {
  if (!state.interrupted && $('#workspace').value.trim().length >= 3) {
    state.interrupted = true;
    persist();
    openDialog('interruption-dialog');
  }
});
$('#take-tour').addEventListener('click', () => {
  closeAll();
  $('#tools').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  $('#tools-title').setAttribute('tabindex', '-1');
  $('#tools-title').focus({ preventScroll: true });
});
$('#cancel-setup').addEventListener('click', () => openDialog('cancel-dialog'));
// VC-11: The confirmation labels intentionally obscure discard versus resume.
$('#discard-setup').addEventListener('click', () => {
  closeAll();
  clearForm();
  showStep('form');
  announce('Local setup discarded. You can start again.');
});
$('#back-to-form').addEventListener('click', () => { showStep('form'); $('#workspace').focus(); });
$('#finish-setup').addEventListener('click', () => {
  state.accessConfirmed = true;
  persist();
  showStep('complete');
  $('#receipt-preference').textContent = `Simulated product updates: ${state.updates ? 'enabled' : 'disabled'}.`;
  announce('Local demonstration completed. No account was created.');
  $('#access-complete-step button').focus();
});

function clearForm() {
  $('#access-form').reset();
  $('#email-error').hidden = true;
  $('#workspace-error').hidden = true;
  $('#email-guidance').hidden = true;
  $('#email-help').setAttribute('aria-expanded', 'false');
  $('#review-workspace').textContent = '';
  $('#review-updates').textContent = '';
  $('#receipt-preference').textContent = '';
  if ($('#support-message')) $('#support-message').value = '';
  if ($('#support-preview')) $('#support-preview').hidden = true;
  if ($('#support-preview-body')) $('#support-preview-body').textContent = '';
  if ($('#support-status')) $('#support-status').textContent = '';
  $$('#access-form [aria-invalid]').forEach(input => { input.removeAttribute('aria-invalid'); input.removeAttribute('aria-describedby'); });
}

const DEMO_CHANNEL = 'vibecheck-landing-live-demo-v1';
const demoFrame = $('#live-demo');
let demoReady = false;
function setDemoReady(ready) {
  demoReady = ready;
  demoFrame.setAttribute('aria-busy', String(!ready));
  $$('.demo-mode-switch button, [data-demo-action="comment"]').forEach(button => { button.disabled = !ready; });
}
function sendDemo(type, detail = {}) {
  if (demoReady) demoFrame.contentWindow.postMessage({ channel: DEMO_CHANNEL, type, ...detail }, location.origin);
}
function setMode(mode, { activate = false } = {}) {
  $$('.demo-mode-switch button').forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (activate) sendDemo('mode', { mode });
}
window.addEventListener('message', event => {
  if (event.source !== demoFrame.contentWindow || event.origin !== location.origin || event.data?.channel !== DEMO_CHANNEL) return;
  if (event.data.type === 'ready') {
    setDemoReady(true);
    $('#demo-loading').hidden = true;
    $('#demo-status').textContent = 'Click a pin to reply, or select an element to leave a comment.';
    setMode(event.data.mode);
  }
  if (event.data.type === 'mode-changed') setMode(event.data.mode);
  if (event.data.type === 'error') {
    setDemoReady(false);
    $('#demo-loading').textContent = 'The preview could not start. Use Reset preview to try again.';
    $('#demo-loading').hidden = false;
  }
});
$$('[data-mode]').forEach(button => button.addEventListener('click', () => {
  setMode(button.dataset.mode, { activate: true });
  announce(`Live ${button.dataset.mode} tool selected.`);
}));
$$('[data-demo-action]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.demoAction === 'reset') resetDemo();
  else { setMode('comment'); sendDemo('comment'); }
}));
function resetDemo() {
  setDemoReady(false);
  $('#demo-loading').hidden = false;
  $('#demo-loading').textContent = 'Loading VibeCheck…';
  demoFrame.src = './demo/index.html';
  setMode('comment');
}

const menuButton = $('#menu-toggle');
function closeMenu() {
  $('#navigation-links').classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = $('#navigation-links').classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));
$('.navigation').addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
window.addEventListener('resize', () => { if (innerWidth > 650) closeMenu(); }, { passive: true });
let scrollQueued = false;
function updateNavigation() { $('#site-header').classList.toggle('scrolled', scrollY > 150); scrollQueued = false; }
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateNavigation); }
}, { passive: true });
updateNavigation();

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(element => { element.classList.add('pending'); observer.observe(element); });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { $$('.reveal.pending').forEach(element => element.classList.remove('pending')); observer.disconnect(); }
  });
}

function resetWorkshop() {
  closeAll();
  resetExercise(storage);
  state = freshState();
  clearForm();
  showStep('form');
  resetDemo();
  closeMenu();
  $$('.faq-list details').forEach(details => { details.open = false; });
  announce('Workshop reset. Extension feedback and other browser data were left intact.');
  window.scrollTo({ top: 0, behavior: 'instant' });
}
// Escape also recovers focus that has moved into other landing content.
// Events from extension components are left to the extension.
root.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || event.defaultPrevented || !stack.length) return;
  if (event.composedPath().some(node => node?.localName === 'vibe-check' || node?.hasAttribute?.('data-vc-component'))) return;
  event.preventDefault();
  closeDialog();
});
const params = new URLSearchParams(location.search);
if (params.get('facilitator') === '1') $('#facilitator-controls').hidden = false;
$('#reset-workshop').addEventListener('click', () => { resetWorkshop(); $('#reset-workshop').focus({ preventScroll: true }); });
$('#close-overlays').addEventListener('click', closeAll);
if (params.get('reset') === '1') {
  resetWorkshop();
  params.delete('reset');
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
}

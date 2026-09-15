import { layerTokenCss } from '../../design-system/generated/tokens.js'

export const feedbackStyles = `
${layerTokenCss}

#vibecheck-layer {
  all: initial;
}

${layerTokenCss}

#vibecheck-layer {
  font-family: var(--vc-font-family);
}

/* Host page rules can still match these descendants, so restate the
   properties that would otherwise silently distort the layer. */
#vibecheck-layer .vc-pin,
#vibecheck-layer .vc-card,
#vibecheck-layer .vc-panel {
  opacity: 1;
  filter: none;
  mix-blend-mode: normal;
}

#vibecheck-layer .vc-pin {
  position: fixed;
  z-index: 2147483644;
  width: var(--vc-size-pin);
  height: var(--vc-size-pin);
  margin: 0;
  padding: 0;
  border: 2px solid var(--vc-action-on-primary);
  border-radius: var(--vc-radius-full);
  color: var(--vc-action-on-primary);
  font: 700 12px/24px var(--vc-font-family);
  text-align: center;
  cursor: pointer;
  box-shadow: var(--vc-shadow-pin);
  transform: translate(-50%, -50%);
}

#vibecheck-layer .vc-pin[data-type="note"],
#vibecheck-layer .vc-pin[data-vc-type="Note"] { background: var(--vc-pin-note); }
#vibecheck-layer .vc-pin[data-type="annotation"][data-kind="implement"],
#vibecheck-layer .vc-pin[data-vc-type="Implement"] { background: var(--vc-pin-implement); }
#vibecheck-layer .vc-pin[data-type="annotation"][data-kind="warning"],
#vibecheck-layer .vc-pin[data-vc-type="Warning"] { background: var(--vc-pin-warning); }
#vibecheck-layer .vc-pin[data-type="annotation"][data-kind="question"],
#vibecheck-layer .vc-pin[data-vc-type="Question"] { background: var(--vc-pin-question); }
#vibecheck-layer .vc-pin[data-type="annotation"] { background: var(--vc-pin-implement); }
#vibecheck-layer .vc-pin[data-type="suggestion"],
#vibecheck-layer .vc-pin[data-vc-type="Suggestion"] { background: var(--vc-pin-suggestion); }
#vibecheck-layer .vc-pin[data-resolved="true"],
#vibecheck-layer .vc-pin[data-state="Resolved"] { opacity: var(--vc-opacity-resolved); }
#vibecheck-layer .vc-pin[data-open="true"],
#vibecheck-layer .vc-pin[data-state="Open"] {
  border-width: 3px;
  box-shadow: var(--vc-shadow-pin-open);
}

#vibecheck-layer .vc-card {
  position: fixed;
  z-index: 2147483645;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 240px;
  max-width: calc(100vw - 24px);
  color: var(--vc-text-primary);
}

#vibecheck-layer .vc-card * { box-sizing: border-box; }

#vibecheck-layer .vc-card[data-resolution="Resolved"] { opacity: var(--vc-opacity-resolved); }

#vibecheck-layer .vc-selected-row {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding: 0 var(--vc-spacing-12);
}

#vibecheck-layer .vc-selected-item {
  max-width: 100%;
  overflow: hidden;
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border-radius: var(--vc-radius-8) var(--vc-radius-8) 0 0;
  background: var(--vc-card-accent, var(--vc-pin-note));
  color: var(--vc-text-on-accent);
  font: 600 11px/1.2 var(--vc-font-family);
  text-overflow: ellipsis;
  white-space: nowrap;
}

#vibecheck-layer .vc-card[data-card-type="Suggestion"] .vc-selected-item {
  color: var(--vc-action-on-primary);
}

#vibecheck-layer .vc-card-surface {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-8);
  width: 240px;
  max-width: 100%;
  max-height: calc(100vh - 24px);
  padding: var(--vc-spacing-4);
  overflow: auto;
  background: var(--vc-bg-surface);
  border-radius: 16px;
  box-shadow: var(--vc-shadow-card);
  scrollbar-width: thin;
}

#vibecheck-layer .vc-card-head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  padding: 0 0 0 var(--vc-spacing-8);
  cursor: grab;
  touch-action: none;
  user-select: none;
}

#vibecheck-layer [data-dragging="true"] .vc-card-head,
#vibecheck-layer .vc-panel[data-dragging="true"] .vc-panel-head {
  cursor: grabbing;
}

#vibecheck-layer button {
  font-family: var(--vc-font-family);
}

#vibecheck-layer .vc-header-actions {
  display: flex;
  gap: var(--vc-spacing-2);
  align-items: center;
}

#vibecheck-layer .vc-header-icon,
#vibecheck-layer .vc-send,
#vibecheck-layer .vc-apply-suggestion,
#vibecheck-layer .vc-type-trigger,
#vibecheck-layer .vc-type-menu-item,
#vibecheck-layer .vc-overflow-menu button {
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
}

#vibecheck-layer .vc-header-icon {
  display: grid;
  width: 24px;
  height: 24px;
  padding: var(--vc-spacing-4);
  place-items: center;
  border-radius: var(--vc-radius-full);
  color: var(--vc-text-muted);
}

#vibecheck-layer .vc-header-icon:hover,
#vibecheck-layer .vc-header-icon:focus-visible,
#vibecheck-layer .vc-apply-suggestion:hover,
#vibecheck-layer .vc-apply-suggestion:focus-visible {
  background: var(--vc-bg-subtle);
  color: var(--vc-text-primary);
}

#vibecheck-layer .vc-header-icon[data-state="Active"] {
  background: var(--vc-pin-note);
  color: var(--vc-icon-on-accent);
}

#vibecheck-layer .vc-icon {
  display: block;
  flex: 0 0 auto;
}

#vibecheck-layer .vc-type-selector {
  position: relative;
  z-index: 2;
}

#vibecheck-layer .vc-type-trigger {
  display: flex;
  gap: 0;
  align-items: center;
  padding: var(--vc-spacing-4);
  border-radius: var(--vc-radius-6);
  color: var(--vc-text-primary);
  font: 600 11px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-type-trigger:hover,
#vibecheck-layer .vc-type-trigger[aria-expanded="true"] {
  background: var(--vc-bg-subtle);
}

#vibecheck-layer .vc-type-trigger[aria-expanded="true"] .vc-icon { transform: rotate(180deg); }

#vibecheck-layer .vc-type-trigger:disabled {
  opacity: 0.5;
  color: var(--vc-text-muted);
  cursor: default;
}

#vibecheck-layer .vc-type-menu,
#vibecheck-layer .vc-overflow-menu {
  position: absolute;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-4);
  padding: var(--vc-spacing-4);
  background: var(--vc-bg-surface);
  border-radius: var(--vc-radius-12);
  box-shadow: var(--vc-shadow-card);
}

#vibecheck-layer .vc-type-menu {
  top: calc(100% + var(--vc-spacing-4));
  left: 0;
  width: 168px;
}

#vibecheck-layer .vc-overflow-menu {
  top: 28px;
  right: 0;
  width: 200px;
}

#vibecheck-layer .vc-type-menu-item,
#vibecheck-layer .vc-overflow-menu button {
  display: flex;
  min-height: 32px;
  align-items: center;
  justify-content: space-between;
  padding: var(--vc-spacing-6) var(--vc-spacing-10);
  border-radius: var(--vc-radius-8);
  color: var(--vc-text-primary);
  font: 400 12px/1.2 var(--vc-font-family);
  text-align: left;
}

#vibecheck-layer .vc-type-menu-item:hover,
#vibecheck-layer .vc-type-menu-item:focus-visible,
#vibecheck-layer .vc-type-menu-item[aria-checked="true"],
#vibecheck-layer .vc-overflow-menu button:hover,
#vibecheck-layer .vc-overflow-menu button:focus-visible {
  background: var(--vc-bg-subtle);
}

#vibecheck-layer .vc-type-menu-item[aria-checked="true"] { font-weight: 600; }
#vibecheck-layer .vc-overflow-menu [data-action="delete"] { color: var(--vc-status-danger); }

#vibecheck-layer .vc-field,
#vibecheck-layer .vc-combo-part {
  display: flex;
  gap: var(--vc-spacing-8);
  width: 100%;
  min-height: 40px;
  align-items: flex-end;
  padding: var(--vc-spacing-8) var(--vc-spacing-4) var(--vc-spacing-4) var(--vc-spacing-12);
  background: var(--vc-bg-input);
  border: 1.5px solid transparent;
  border-radius: var(--vc-radius-12);
}

#vibecheck-layer .vc-field:focus-within,
#vibecheck-layer .vc-combo-part:focus-within {
  border-color: var(--vc-card-accent, var(--vc-pin-note));
}

#vibecheck-layer .vc-field[data-invalid="true"],
#vibecheck-layer .vc-combo-part[data-invalid="true"] {
  border-color: var(--vc-status-danger);
}

#vibecheck-layer .vc-field textarea,
#vibecheck-layer .vc-combo-part textarea,
#vibecheck-layer .vc-field input {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  min-height: 28px;
  max-height: 180px;
  margin: 0;
  padding: 0;
  resize: none;
  overflow: auto;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vc-text-primary);
  font: 13px/18px var(--vc-font-family);
}

#vibecheck-layer .vc-field:not(.vc-field-compact) { min-height: 96px; }

#vibecheck-layer .vc-field-compact {
  align-items: center;
  padding-top: var(--vc-spacing-4);
}

#vibecheck-layer .vc-field-compact textarea {
  height: 28px;
  min-height: 28px;
  padding: 5px 0;
}

#vibecheck-layer .vc-field textarea::placeholder,
#vibecheck-layer .vc-combo-part textarea::placeholder,
#vibecheck-layer .vc-field input::placeholder {
  color: var(--vc-text-secondary);
  opacity: 1;
}

#vibecheck-layer .vc-send {
  display: grid;
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  padding: var(--vc-spacing-4);
  place-items: center;
  border-radius: var(--vc-radius-full);
  background: var(--vc-bg-subtle);
  color: var(--vc-text-muted);
}

#vibecheck-layer .vc-send[data-state="Active"] {
  background: var(--vc-card-accent, var(--vc-pin-note));
  color: var(--vc-icon-on-accent);
}

#vibecheck-layer .vc-card[data-card-type="Suggestion"] .vc-send[data-state="Active"] {
  color: var(--vc-action-on-primary);
}

#vibecheck-layer .vc-send:hover:not(:disabled),
#vibecheck-layer .vc-send:focus-visible {
  filter: brightness(0.96);
}

#vibecheck-layer .vc-send:disabled,
#vibecheck-layer .vc-send[data-state="Disabled"] {
  opacity: 0.4;
  cursor: default;
}

#vibecheck-layer .vc-combo-field {
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-2);
  width: 100%;
  overflow: hidden;
  border: 1.5px solid transparent;
  border-radius: var(--vc-radius-12);
}

#vibecheck-layer .vc-combo-first {
  padding: var(--vc-spacing-12) var(--vc-spacing-12) var(--vc-spacing-16);
  border-radius: var(--vc-radius-12) var(--vc-radius-12) var(--vc-radius-4) var(--vc-radius-4);
}

#vibecheck-layer .vc-combo-second {
  border-radius: var(--vc-radius-4) var(--vc-radius-4) var(--vc-radius-12) var(--vc-radius-12);
}

#vibecheck-layer .vc-combo-field[data-state="Submit failed"] {
  border-color: var(--vc-status-danger);
}

#vibecheck-layer .vc-combo-field[data-state="Submitting"] .vc-combo-part { opacity: 0.75; }

#vibecheck-layer .vc-field-message {
  padding: var(--vc-spacing-4) var(--vc-spacing-12);
  color: var(--vc-text-muted);
  font: 11px/13px var(--vc-font-family);
}

#vibecheck-layer [role="alert"].vc-field-message { color: var(--vc-status-danger); }

#vibecheck-layer .vc-kinds {
  display: flex;
  gap: var(--vc-spacing-4);
  padding: 0 var(--vc-spacing-8);
}

#vibecheck-layer .vc-kinds button {
  appearance: none;
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border: 1px solid var(--vc-border-default);
  border-radius: var(--vc-radius-full);
  background: transparent;
  color: var(--vc-text-secondary);
  font: 600 11px/1.2 var(--vc-font-family);
  cursor: pointer;
}

#vibecheck-layer .vc-kinds button[data-state="Selected"] {
  border-color: transparent;
  background: var(--vc-card-accent, var(--vc-pin-implement));
  color: var(--vc-text-on-accent);
}

#vibecheck-layer .vc-badge {
  display: inline-block;
  margin-left: auto;
  padding: 1px var(--vc-spacing-6);
  border-radius: var(--vc-radius-full);
  background: var(--vc-badge-background);
  color: var(--vc-badge-text);
  font-size: 10px;
  font-weight: 700;
}

#vibecheck-layer .vc-wording-content {
  display: flex;
  flex-direction: column;
}

#vibecheck-layer .vc-quote {
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-4);
  padding: var(--vc-spacing-8) var(--vc-spacing-12);
}

#vibecheck-layer .vc-quote-heading {
  color: var(--vc-text-muted);
  font: 600 10px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-quote[data-role="Original"] .vc-quote-heading { color: var(--vc-text-primary); }

#vibecheck-layer .vc-quote-row {
  display: flex;
  gap: var(--vc-spacing-8);
  align-items: flex-start;
}

#vibecheck-layer .vc-quote-body {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--vc-text-primary);
  font: 13px/18px var(--vc-font-family);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

#vibecheck-layer .vc-apply-suggestion {
  display: grid;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  padding: var(--vc-spacing-4);
  place-items: center;
  border-radius: var(--vc-radius-6);
  color: var(--vc-text-muted);
}

#vibecheck-layer .vc-apply-suggestion:active { color: var(--vc-text-primary); }

#vibecheck-layer .vc-thread {
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-8);
  padding: var(--vc-spacing-12);
}

#vibecheck-layer .vc-thread-divider {
  width: 100%;
  height: 1px;
  background: var(--vc-border-default);
}

#vibecheck-layer .vc-reply {
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-4);
}

#vibecheck-layer .vc-reply-meta {
  display: flex;
  gap: var(--vc-spacing-8);
  align-items: baseline;
}

#vibecheck-layer .vc-reply-meta strong {
  color: var(--vc-text-primary);
  font: 600 11px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-reply-meta time {
  color: var(--vc-text-muted);
  font: 10px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-reply-body {
  color: var(--vc-text-secondary);
  font: 12px/1.3 var(--vc-font-family);
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

#vibecheck-layer .vc-card[data-card-type="Note"] { --vc-card-accent: var(--vc-pin-note); }
#vibecheck-layer .vc-card[data-card-type="Implement"] { --vc-card-accent: var(--vc-pin-implement); }
#vibecheck-layer .vc-card[data-card-type="Warning"] { --vc-card-accent: var(--vc-pin-warning); }
#vibecheck-layer .vc-card[data-card-type="Question"] { --vc-card-accent: var(--vc-pin-question); }
#vibecheck-layer .vc-card[data-card-type="Suggestion"] { --vc-card-accent: var(--vc-pin-suggestion); }

#vibecheck-layer .vc-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

#vibecheck-layer .vc-panel {
  position: fixed;
  top: var(--vc-spacing-16);
  left: calc(100vw - 296px);
  z-index: 2147483645;
  display: flex;
  flex-direction: column;
  width: var(--vc-size-panel);
  min-width: 260px;
  min-height: 180px;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 32px);
  overflow: hidden;
  resize: both;
  background: var(--vc-bg-surface);
  color: var(--vc-text-primary);
  border-radius: var(--vc-radius-12);
  box-shadow: var(--vc-shadow-panel);
}

#vibecheck-layer .vc-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--vc-spacing-12) var(--vc-spacing-12) var(--vc-spacing-8);
  font: 700 13px var(--vc-font-family);
  cursor: grab;
  touch-action: none;
  user-select: none;
}

#vibecheck-layer .vc-panel-body {
  min-height: 0;
  overflow: auto;
}

#vibecheck-layer .vc-panel[data-collapsed="true"],
#vibecheck-layer .vc-panel[data-state="Collapsed"] {
  width: 150px;
  min-width: 150px;
  min-height: 0;
  height: auto;
  resize: none;
}

#vibecheck-layer .vc-panel[data-collapsed="true"] .vc-panel-head,
#vibecheck-layer .vc-panel[data-state="Collapsed"] .vc-panel-head {
  padding-bottom: var(--vc-spacing-12);
}

#vibecheck-layer .vc-panel-controls {
  display: flex;
  align-items: center;
  gap: var(--vc-spacing-6);
}

#vibecheck-layer .vc-panel-controls button {
  appearance: none;
  border: 0;
  background: transparent;
  color: var(--vc-text-secondary);
  font: 600 10px var(--vc-font-family);
  cursor: pointer;
}

#vibecheck-layer .vc-panel-controls .vc-collapse {
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: var(--vc-radius-6);
  background: var(--vc-bg-subtle);
  font-size: 16px;
  line-height: 1;
}

#vibecheck-layer .vc-panel-tools {
  display: flex;
  align-items: center;
  gap: var(--vc-spacing-6);
  padding: 0 var(--vc-spacing-12) var(--vc-spacing-8);
}

#vibecheck-layer .vc-panel-search {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  height: 32px;
  border: 1px solid var(--vc-border-default);
  border-radius: var(--vc-radius-6);
  background: var(--vc-bg-input);
  color: var(--vc-text-secondary);
}

#vibecheck-layer .vc-panel-search > span {
  display: grid;
  flex: 0 0 30px;
  place-items: center;
}

#vibecheck-layer .vc-panel-search svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-width: 1;
}

#vibecheck-layer .vc-panel-search input[type="search"] {
  width: 100%;
  min-width: 0;
  height: 30px;
  margin: 0;
  padding: 0 var(--vc-spacing-8) 0 0;
  border: 0;
  outline: 0;
  appearance: none;
  background: transparent;
  color: var(--vc-text-primary);
  font: 12px/1 var(--vc-font-family);
}

#vibecheck-layer .vc-panel-search input::-webkit-search-cancel-button { display: none; }

#vibecheck-layer .vc-panel-search:focus-within {
  border-color: var(--vc-link-accent);
  box-shadow: 0 0 0 1px var(--vc-link-accent);
}

#vibecheck-layer .vc-panel-tool {
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--vc-radius-6);
  background: transparent;
  color: var(--vc-text-secondary);
  cursor: pointer;
  font: 700 15px/1 var(--vc-font-family);
}

#vibecheck-layer .vc-panel-tool:hover { background: var(--vc-action-secondary-hover); }
#vibecheck-layer .vc-panel-more { letter-spacing: -2px; }

#vibecheck-layer .vc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vc-spacing-4);
  padding: 0 var(--vc-spacing-12) var(--vc-spacing-8);
}

#vibecheck-layer .vc-filters button {
  background: var(--vc-bg-surface);
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border-radius: var(--vc-radius-full);
  border: 1px solid var(--vc-border-default);
}

#vibecheck-layer .vc-item {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  padding: var(--vc-spacing-12);
  cursor: pointer;
  font: 12px/1.35 var(--vc-font-family);
  color: inherit;
}

#vibecheck-layer .vc-item + .vc-item { margin-top: var(--vc-spacing-8); }
#vibecheck-layer .vc-item[data-open="true"],
#vibecheck-layer .vc-item[data-state="Open"] {
  background: var(--vc-selection-background);
  border-radius: var(--vc-radius-8);
}

#vibecheck-layer .vc-item-avatars {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  min-height: 24px;
  margin-bottom: var(--vc-spacing-6);
}

#vibecheck-layer .vc-avatar {
  position: relative;
  display: grid;
  flex: 0 0 24px;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--vc-border-default);
  border-radius: var(--vc-radius-full);
  color: var(--vc-action-on-primary);
  font: 700 10px/1 var(--vc-font-family);
}

#vibecheck-layer .vc-avatar[data-tone="note"] { background: var(--vc-pin-note); }
#vibecheck-layer .vc-avatar[data-tone="implement"] { background: var(--vc-pin-implement); }
#vibecheck-layer .vc-avatar[data-tone="question"] { background: var(--vc-pin-question); }
#vibecheck-layer .vc-avatar[data-tone="warning"] { background: var(--vc-pin-warning); }
#vibecheck-layer .vc-avatar + .vc-avatar { margin-left: -5px; }

#vibecheck-layer .vc-avatar img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#vibecheck-layer .vc-item-context,
#vibecheck-layer .vc-item-author,
#vibecheck-layer .vc-item-message,
#vibecheck-layer .vc-reply-count {
  display: block;
}

#vibecheck-layer .vc-item-context {
  overflow: hidden;
  margin-bottom: 2px;
  color: var(--vc-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

#vibecheck-layer .vc-item-number { font-weight: 700; }
#vibecheck-layer .vc-thread-icon { margin: 0 2px; }
#vibecheck-layer .vc-context-link { text-decoration: none; }
#vibecheck-layer .vc-item:hover .vc-context-link { color: var(--vc-link-accent); text-decoration: underline; }

#vibecheck-layer .vc-item-author {
  display: flex;
  gap: var(--vc-spacing-4);
  align-items: baseline;
  margin-bottom: 2px;
}

#vibecheck-layer .vc-item-author strong { color: var(--vc-text-primary); }
#vibecheck-layer .vc-item-author span { color: var(--vc-text-secondary); }
#vibecheck-layer .vc-item-message { color: var(--vc-text-primary); white-space: normal; overflow-wrap: anywhere; }
#vibecheck-layer .vc-mention,
#vibecheck-layer .vc-reply-count { color: var(--vc-link-accent); }
#vibecheck-layer .vc-reply-count { margin-top: 2px; font-weight: 600; }
#vibecheck-layer .vc-item .vc-badge { display: inline-block; }

#vibecheck-layer .vc-panel-empty {
  padding: var(--vc-spacing-16) var(--vc-spacing-12) var(--vc-spacing-24);
  color: var(--vc-text-secondary);
  font: 12px/1.45 var(--vc-font-family);
}
`

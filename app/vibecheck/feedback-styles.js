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
#vibecheck-layer .vc-pin[data-vc-type="Suggestion"] { background: var(--vc-action-primary); }
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
  width: var(--vc-size-card);
  max-width: calc(100vw - 24px);
  background: var(--vc-bg-surface);
  color: var(--vc-text-primary);
  border-radius: var(--vc-radius-12);
  box-shadow: var(--vc-shadow-card);
  overflow: hidden;
}

#vibecheck-layer .vc-card * { box-sizing: border-box; }

#vibecheck-layer .vc-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--vc-spacing-8);
  padding: var(--vc-spacing-10) var(--vc-spacing-12) 0;
  min-height: 38px;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

#vibecheck-layer [data-dragging="true"] .vc-card-head,
#vibecheck-layer .vc-panel[data-dragging="true"] .vc-panel-head {
  cursor: grabbing;
}

#vibecheck-layer .vc-types {
  display: flex;
  gap: var(--vc-spacing-4);
  background: var(--vc-bg-subtle);
  padding: 3px;
  border-radius: var(--vc-radius-8);
}

#vibecheck-layer .vc-types button,
#vibecheck-layer .vc-kinds button,
#vibecheck-layer .vc-filters button,
#vibecheck-layer .vc-actions button {
  appearance: none;
  border: 0;
  background: transparent;
  font: 600 11px/1.2 var(--vc-font-family);
  cursor: pointer;
  color: var(--vc-text-secondary);
}

#vibecheck-layer .vc-types button {
  background: var(--vc-bg-surface);
  padding: var(--vc-spacing-6) var(--vc-spacing-8);
  border-radius: var(--vc-radius-6);
}

#vibecheck-layer .vc-types button[aria-pressed="true"],
#vibecheck-layer .vc-types button[data-state="Selected"],
#vibecheck-layer .vc-kinds button[aria-pressed="true"],
#vibecheck-layer .vc-kinds button[data-state="Selected"],
#vibecheck-layer .vc-filters button[aria-pressed="true"],
#vibecheck-layer .vc-filters button[data-state="Selected"] {
  background: var(--vc-action-primary);
  color: var(--vc-action-on-primary);
}

#vibecheck-layer .vc-close {
  width: var(--vc-size-pin);
  height: var(--vc-size-pin);
  border: 0;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: var(--vc-text-secondary);
}

#vibecheck-layer .vc-kinds {
  display: flex;
  gap: var(--vc-spacing-6);
  padding: var(--vc-spacing-8) var(--vc-spacing-12) 0;
}

#vibecheck-layer .vc-kinds button {
  background: var(--vc-bg-surface);
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border-radius: var(--vc-radius-full);
  border: 1px solid var(--vc-border-default);
}

#vibecheck-layer .vc-meta {
  padding: var(--vc-spacing-8) var(--vc-spacing-12) 0;
  font-size: 11px;
  color: var(--vc-text-secondary);
}

#vibecheck-layer .vc-body,
#vibecheck-layer textarea,
#vibecheck-layer input {
  width: calc(100% - 24px);
  margin: var(--vc-spacing-8) var(--vc-spacing-12) 0;
  font: 13px/1.45 var(--vc-font-family);
}

#vibecheck-layer textarea {
  min-height: 88px;
  resize: vertical;
  border: 1px solid var(--vc-border-default);
  border-radius: var(--vc-radius-8);
  padding: var(--vc-spacing-8);
  background: var(--vc-bg-input);
  color: var(--vc-text-primary);
}

#vibecheck-layer textarea::placeholder,
#vibecheck-layer input::placeholder {
  color: var(--vc-text-secondary);
  opacity: 1;
}

#vibecheck-layer input[type="text"] {
  border: 1px solid var(--vc-border-default);
  border-radius: var(--vc-radius-8);
  padding: var(--vc-spacing-6) var(--vc-spacing-8);
  background: var(--vc-bg-input);
  color: var(--vc-text-primary);
}

#vibecheck-layer .vc-body {
  margin: var(--vc-spacing-8) var(--vc-spacing-12);
  white-space: pre-wrap;
}

#vibecheck-layer .vc-thread {
  margin: 0 var(--vc-spacing-12);
  padding: var(--vc-spacing-8) 0;
  border-top: 1px solid var(--vc-bg-subtle);
}

#vibecheck-layer .vc-reply {
  font-size: 12px;
  margin: 0 0 var(--vc-spacing-8);
}

#vibecheck-layer .vc-reply b { display: block; color: var(--vc-text-secondary); font-size: 10px; }

#vibecheck-layer .vc-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--vc-spacing-8);
  padding: var(--vc-spacing-10) var(--vc-spacing-12) var(--vc-spacing-12);
}

#vibecheck-layer .vc-actions button {
  background: var(--vc-bg-surface);
  color: var(--vc-text-primary);
  border: 1px solid var(--vc-border-default);
  border-radius: var(--vc-radius-8);
  padding: var(--vc-spacing-8) var(--vc-spacing-10);
}

#vibecheck-layer .vc-actions .primary,
#vibecheck-layer .vc-actions [data-style="Primary"] {
  background: var(--vc-action-primary);
  color: var(--vc-action-on-primary);
  border: 0;
  border-radius: var(--vc-radius-8);
  padding: var(--vc-spacing-8) var(--vc-spacing-10);
}

#vibecheck-layer .vc-actions .danger,
#vibecheck-layer .vc-actions [data-style="Danger"] {
  background: var(--vc-status-danger);
  color: var(--vc-action-on-primary);
  border: 0;
}

#vibecheck-layer .vc-badge {
  display: inline-block;
  margin-left: var(--vc-spacing-6);
  padding: 1px var(--vc-spacing-6);
  border-radius: var(--vc-radius-full);
  background: var(--vc-badge-background);
  color: var(--vc-badge-text);
  font-size: 10px;
  font-weight: 700;
}

#vibecheck-layer .vc-panel {
  position: fixed;
  top: var(--vc-spacing-16);
  left: calc(100vw - 296px);
  z-index: 2147483645;
  width: var(--vc-size-panel);
  max-height: calc(100vh - 32px);
  overflow: hidden;
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
  max-height: calc(100vh - 80px);
  overflow: auto;
}

#vibecheck-layer .vc-panel[data-collapsed="true"],
#vibecheck-layer .vc-panel[data-state="Collapsed"] {
  width: 150px;
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
  border-top: 1px solid var(--vc-bg-subtle);
  background: transparent;
  padding: var(--vc-spacing-10) var(--vc-spacing-12);
  cursor: pointer;
  font: 12px/1.4 var(--vc-font-family);
  color: inherit;
}

#vibecheck-layer .vc-item[data-open="true"],
#vibecheck-layer .vc-item[data-state="Open"] { background: var(--vc-selection-background); }
#vibecheck-layer .vc-item b { display: block; margin-bottom: 2px; }
#vibecheck-layer .vc-item span { color: var(--vc-text-secondary); }
`

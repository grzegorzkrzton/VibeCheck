import { layerTokenCss } from '../../design-system/generated/tokens.js'

export const feedbackStyles = `
${layerTokenCss}

#vibecheck-layer {
  all: initial;
}

${layerTokenCss}

#vibecheck-layer {
  font-family: var(--vc-font-family);
  /* Subtle iOS / Revolut-like motion */
  --vc-duration-fast: 140ms;
  --vc-duration: 200ms;
  --vc-duration-panel: 280ms;
  --vc-ease: cubic-bezier(0.32, 0.72, 0, 1);
  --vc-ease-soft: cubic-bezier(0.25, 0.1, 0.25, 1);
}

@media (prefers-reduced-motion: reduce) {
  #vibecheck-layer {
    --vc-duration-fast: 0.01ms;
    --vc-duration: 0.01ms;
    --vc-duration-panel: 0.01ms;
  }

  #vibecheck-layer .vc-card,
  #vibecheck-layer .vc-card-surface,
  #vibecheck-layer .vc-type-menu,
  #vibecheck-layer .vc-overflow-menu {
    animation: none !important;
  }
}

#vibecheck-layer .vc-card[data-motion="settled"],
#vibecheck-layer .vc-card[data-motion="settled"] .vc-card-surface {
  animation: none !important;
}

@keyframes vc-enter-card-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes vc-enter-card-surface {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes vc-enter-menu {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes vc-enter-menu-up {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Popover top-layer reset — keep cards above selection chrome. */
#vibecheck-layer[popover] {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  overflow: visible;
  pointer-events: none;
  color-scheme: inherit;
}

/* Host page rules can still match these descendants, so restate the
   properties that would otherwise silently distort the layer. */
#vibecheck-layer .vc-pin,
#vibecheck-layer .vc-card,
#vibecheck-layer .vc-card-surface,
#vibecheck-layer .vc-type-menu,
#vibecheck-layer .vc-overflow-menu,
#vibecheck-layer .vc-panel {
  pointer-events: auto;
  filter: none;
  mix-blend-mode: normal;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

#vibecheck-layer .vc-pin:not([data-leaving="true"]),
#vibecheck-layer .vc-card:not([data-leaving="true"]),
#vibecheck-layer .vc-card-surface,
#vibecheck-layer .vc-type-menu:not([data-leaving="true"]),
#vibecheck-layer .vc-overflow-menu:not([data-leaving="true"]),
#vibecheck-layer .vc-panel {
  opacity: 1;
}

#vibecheck-layer .vc-pin {
  position: fixed;
  z-index: 2147483646;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--vc-size-pin);
  height: var(--vc-size-pin);
  margin: 0;
  padding: 0;
  border: 2px solid var(--vc-icon-inverse);
  border-radius: var(--vc-radius-full) var(--vc-radius-full) var(--vc-radius-full) var(--vc-radius-6);
  color: var(--vc-icon-inverse);
  font: 700 12px/14px var(--vc-font-family);
  cursor: pointer;
  box-shadow: var(--vc-shadow-pin);
  transform: translate(-50%, -50%);
  transition:
    border-width var(--vc-duration-fast) var(--vc-ease),
    box-shadow var(--vc-duration) var(--vc-ease),
    opacity var(--vc-duration) var(--vc-ease),
    transform var(--vc-duration) var(--vc-ease);
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
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 240px;
  max-width: calc(100vw - 24px);
  color: var(--vc-text);
  /* Keep this node transform-free: fixed menus live as layer children, but
     any transform here still breaks hit-testing / drag geometry. */
  animation: vc-enter-card-fade var(--vc-duration) var(--vc-ease) both;
  transition: opacity var(--vc-duration-fast) var(--vc-ease);
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
  overflow: visible;
  /* Solid fill — host pages often force transparent backgrounds on divs. */
  background-color: var(--vc-surface, #1f2937) !important;
  background-image: none !important;
  border-radius: 16px;
  box-shadow: var(--vc-shadow-card);
  isolation: isolate;
  scrollbar-width: thin;
  transform-origin: top right;
  animation: vc-enter-card-surface var(--vc-duration) var(--vc-ease) both;
  transition:
    opacity var(--vc-duration-fast) var(--vc-ease),
    transform var(--vc-duration) var(--vc-ease);
}

#vibecheck-layer .vc-card[data-side="left"] .vc-card-surface { transform-origin: top left; }

#vibecheck-layer .vc-card[data-leaving="true"] {
  opacity: 0;
  pointer-events: none;
  animation: none;
}

#vibecheck-layer .vc-card[data-leaving="true"] .vc-card-surface {
  transform: translateY(4px) scale(0.98);
  animation: none;
}

#vibecheck-layer .vc-card * { box-sizing: border-box; }

#vibecheck-layer .vc-card[data-resolution="Resolved"] { opacity: var(--vc-opacity-resolved); }
#vibecheck-layer .vc-card[data-resolution="Resolved"][data-leaving="true"] { opacity: 0; }

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
  color: var(--vc-text-inverse);
  font: 600 11px/1.2 var(--vc-font-family);
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: var(--vc-text-gray-light);
  transition:
    background-color var(--vc-duration-fast) var(--vc-ease),
    color var(--vc-duration-fast) var(--vc-ease),
    transform var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-header-icon:hover,
#vibecheck-layer .vc-header-icon:focus-visible,
#vibecheck-layer .vc-apply-suggestion:hover,
#vibecheck-layer .vc-apply-suggestion:focus-visible {
  background: var(--vc-surface-subtle);
  color: var(--vc-text);
}

#vibecheck-layer .vc-header-icon:active {
  transform: scale(0.92);
}

#vibecheck-layer .vc-header-icon[data-state="Active"] {
  background: var(--vc-pin-note);
  color: var(--vc-icon-inverse);
}

#vibecheck-layer .vc-icon {
  display: block;
  flex: 0 0 auto;
}

#vibecheck-layer .vc-type-selector {
  position: relative;
  z-index: 10;
}

#vibecheck-layer .vc-type-trigger {
  display: flex;
  gap: 0;
  align-items: center;
  padding: var(--vc-spacing-4);
  border-radius: var(--vc-radius-6);
  color: var(--vc-text);
  font: 600 11px/1.2 var(--vc-font-family);
  transition: background-color var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-type-trigger:hover,
#vibecheck-layer .vc-type-trigger[aria-expanded="true"] {
  background: var(--vc-surface-subtle);
}

#vibecheck-layer .vc-type-trigger .vc-icon {
  transition: transform var(--vc-duration) var(--vc-ease);
}

#vibecheck-layer .vc-type-trigger[aria-expanded="true"] .vc-icon { transform: rotate(180deg); }

#vibecheck-layer .vc-type-trigger:disabled {
  opacity: 1;
  color: var(--vc-text);
  cursor: default;
}

#vibecheck-layer .vc-type-menu,
#vibecheck-layer .vc-overflow-menu {
  position: fixed;
  z-index: 2147483647;
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-4);
  padding: var(--vc-spacing-4);
  /* Fallback keeps the menu opaque if the surface token fails to resolve. */
  background-color: var(--vc-surface, #1f2937) !important;
  background-image: none !important;
  color: var(--vc-text, #f9fafb);
  border-radius: var(--vc-radius-12);
  box-shadow: var(--vc-shadow-card);
  isolation: isolate;
  opacity: 1;
  transform-origin: top center;
  animation: vc-enter-menu var(--vc-duration-fast) var(--vc-ease) both;
  transition:
    opacity var(--vc-duration-fast) var(--vc-ease),
    transform var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-type-menu[data-side="top"],
#vibecheck-layer .vc-overflow-menu[data-side="top"] {
  transform-origin: bottom center;
  animation-name: vc-enter-menu-up;
}

#vibecheck-layer .vc-type-menu[data-leaving="true"],
#vibecheck-layer .vc-overflow-menu[data-leaving="true"] {
  opacity: 0;
  transform: scale(0.96);
  pointer-events: none;
  animation: none;
}

#vibecheck-layer[data-scheme="light"] .vc-type-menu,
#vibecheck-layer[data-scheme="light"] .vc-overflow-menu {
  background-color: var(--vc-surface, #f0f2f4) !important;
  color: var(--vc-text, #111827);
}

#vibecheck-layer .vc-type-menu {
  width: 168px;
}

#vibecheck-layer .vc-overflow-menu {
  width: 200px;
}

#vibecheck-layer .vc-type-menu-item {
  display: flex;
  min-height: 32px;
  align-items: center;
  justify-content: space-between;
  padding: var(--vc-spacing-6) var(--vc-spacing-10);
  border-radius: var(--vc-radius-8);
  color: var(--vc-text);
  font: 400 12px/1.2 var(--vc-font-family);
  text-align: left;
  transition: background-color var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-overflow-menu button {
  display: flex;
  width: 100%;
  align-items: center;
  padding: var(--vc-spacing-8) var(--vc-spacing-10);
  border-radius: var(--vc-radius-8);
  color: var(--vc-text);
  font: 400 12px/1.2 var(--vc-font-family);
  text-align: left;
  transition: background-color var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-type-menu-item:hover,
#vibecheck-layer .vc-type-menu-item:focus-visible,
#vibecheck-layer .vc-type-menu-item[aria-checked="true"],
#vibecheck-layer .vc-overflow-menu button:hover,
#vibecheck-layer .vc-overflow-menu button:focus-visible {
  background: var(--vc-surface-subtle);
}

#vibecheck-layer .vc-type-menu-item[aria-checked="true"] { font-weight: 600; }
#vibecheck-layer .vc-overflow-menu [data-action="delete"] { color: var(--vc-text-critical); }

#vibecheck-layer .vc-field,
#vibecheck-layer .vc-combo-part {
  display: flex;
  gap: var(--vc-spacing-8);
  width: 100%;
  background: var(--vc-surface-input);
  border: 0;
  transition:
    padding var(--vc-duration) var(--vc-ease),
    box-shadow var(--vc-duration-fast) var(--vc-ease),
    background-color var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-field {
  height: auto;
  min-height: 36px;
  align-items: flex-end;
  padding: var(--vc-spacing-4) var(--vc-spacing-4) var(--vc-spacing-4) var(--vc-spacing-12);
  border-radius: var(--vc-radius-12);
}

#vibecheck-layer .vc-field[data-state="Active"] {
  align-items: flex-end;
  padding-top: var(--vc-spacing-8);
}

#vibecheck-layer .vc-combo-part {
  height: auto;
  min-height: 40px;
  align-items: flex-end;
  padding: var(--vc-spacing-4) var(--vc-spacing-4) var(--vc-spacing-4) var(--vc-spacing-12);
}

#vibecheck-layer .vc-field:focus-within:not([data-state="Error"]) {
  box-shadow: inset 0 0 0 1px var(--vc-border-gray-medium);
}

#vibecheck-layer .vc-field[data-state="Error"],
#vibecheck-layer .vc-field[data-invalid="true"] {
  box-shadow: inset 0 0 0 1.5px var(--vc-text-critical);
}

#vibecheck-layer .vc-combo-part:focus-within {
  box-shadow: inset 0 0 0 1px var(--vc-border-gray-medium);
}

#vibecheck-layer .vc-combo-field[data-state="Focus - Second (First filled)"] .vc-combo-second:focus-within {
  box-shadow: inset 0 0 0 1.5px var(--vc-pin-note);
}

#vibecheck-layer .vc-combo-part[data-invalid="true"] {
  box-shadow: inset 0 0 0 1.5px var(--vc-text-critical);
}

#vibecheck-layer .vc-combo-part[data-invalid="true"] textarea,
#vibecheck-layer .vc-combo-part[data-invalid="true"] textarea::placeholder {
  color: var(--vc-text-critical);
}

#vibecheck-layer .vc-field[data-state="Error"] textarea,
#vibecheck-layer .vc-field[data-state="Error"] textarea::placeholder {
  color: var(--vc-text-critical);
}

#vibecheck-layer .vc-field[data-state="Disabled"] { opacity: var(--vc-opacity-resolved); }

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
  overflow: hidden;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vc-text);
  font: 13px/18px var(--vc-font-family);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

#vibecheck-layer .vc-field[data-state="Active"] textarea {
  /* Height is driven by autosize; keep room to scroll if capped. */
  max-height: 180px;
}

/* Shared modern scrollbar for expanded/scrollable surfaces */
#vibecheck-layer .vc-field textarea,
#vibecheck-layer .vc-combo-part textarea,
#vibecheck-layer .vc-panel-body,
#vibecheck-layer .vc-thread,
#vibecheck-layer .vc-replies {
  scrollbar-width: thin;
  scrollbar-color: var(--vc-gray-500) transparent;
}

#vibecheck-layer .vc-field textarea::-webkit-scrollbar,
#vibecheck-layer .vc-combo-part textarea::-webkit-scrollbar,
#vibecheck-layer .vc-panel-body::-webkit-scrollbar,
#vibecheck-layer .vc-thread::-webkit-scrollbar,
#vibecheck-layer .vc-replies::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

#vibecheck-layer .vc-field textarea::-webkit-scrollbar-track,
#vibecheck-layer .vc-combo-part textarea::-webkit-scrollbar-track,
#vibecheck-layer .vc-panel-body::-webkit-scrollbar-track,
#vibecheck-layer .vc-thread::-webkit-scrollbar-track,
#vibecheck-layer .vc-replies::-webkit-scrollbar-track {
  background: transparent;
}

#vibecheck-layer .vc-field textarea::-webkit-scrollbar-thumb,
#vibecheck-layer .vc-combo-part textarea::-webkit-scrollbar-thumb,
#vibecheck-layer .vc-panel-body::-webkit-scrollbar-thumb,
#vibecheck-layer .vc-thread::-webkit-scrollbar-thumb,
#vibecheck-layer .vc-replies::-webkit-scrollbar-thumb {
  background-color: var(--vc-gray-500);
  border-radius: var(--vc-radius-full);
}

#vibecheck-layer .vc-field textarea::-webkit-scrollbar-button,
#vibecheck-layer .vc-combo-part textarea::-webkit-scrollbar-button,
#vibecheck-layer .vc-panel-body::-webkit-scrollbar-button,
#vibecheck-layer .vc-thread::-webkit-scrollbar-button,
#vibecheck-layer .vc-replies::-webkit-scrollbar-button {
  display: none;
  width: 0;
  height: 0;
}

#vibecheck-layer .vc-combo-part textarea {
  min-height: 16px;
  line-height: 16px;
}

#vibecheck-layer .vc-field-compact {
  align-items: flex-end;
  padding-top: var(--vc-spacing-4);
}

#vibecheck-layer .vc-field-compact textarea {
  min-height: 28px;
  padding: 5px 0;
}

#vibecheck-layer .vc-field textarea::placeholder,
#vibecheck-layer .vc-combo-part textarea::placeholder,
#vibecheck-layer .vc-field input::placeholder {
  color: var(--vc-text-gray-medium);
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
  background: var(--vc-surface-subtle);
  color: var(--vc-text-gray-light);
  transition:
    background-color var(--vc-duration-fast) var(--vc-ease),
    color var(--vc-duration-fast) var(--vc-ease),
    opacity var(--vc-duration-fast) var(--vc-ease),
    transform var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-send[data-state="Active"] {
  background: var(--vc-card-accent, var(--vc-pin-note));
  color: var(--vc-icon-inverse);
}

#vibecheck-layer .vc-card[data-card-type="Suggestion"] .vc-send[data-state="Active"] {
  color: var(--vc-icon-inverse);
}

#vibecheck-layer .vc-send:hover:not(:disabled):not([data-state="Active"]):not([data-state="Disabled"]) {
  background: var(--vc-purple-100);
}

#vibecheck-layer .vc-send:active:not(:disabled):not([data-state="Disabled"]) {
  transform: scale(0.92);
}

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
  border-radius: var(--vc-radius-12);
  transition:
    box-shadow var(--vc-duration-fast) var(--vc-ease),
    opacity var(--vc-duration) var(--vc-ease);
}

#vibecheck-layer .vc-combo-first {
  padding-right: var(--vc-spacing-12);
  border-radius: var(--vc-radius-12) var(--vc-radius-12) var(--vc-radius-4) var(--vc-radius-4);
}

#vibecheck-layer .vc-combo-second {
  align-items: flex-end;
  border-radius: var(--vc-radius-4) var(--vc-radius-4) var(--vc-radius-12) var(--vc-radius-12);
}

#vibecheck-layer .vc-combo-field[data-state="Submit failed"] {
  box-shadow: inset 0 0 0 1.5px var(--vc-text-critical);
}

#vibecheck-layer .vc-combo-field[data-state="Editing - First"] .vc-combo-first,
#vibecheck-layer .vc-combo-field[data-state="Editing - Both"] .vc-combo-first,
#vibecheck-layer .vc-combo-field[data-state="Submitting"] .vc-combo-first,
#vibecheck-layer .vc-combo-field[data-state="Submit failed"] .vc-combo-first {
  height: auto;
  padding-top: var(--vc-spacing-12);
  padding-bottom: var(--vc-spacing-16);
}

#vibecheck-layer .vc-combo-field[data-state="Editing - Both"] .vc-combo-second {
  height: auto;
  padding-top: var(--vc-spacing-12);
}

#vibecheck-layer .vc-combo-field[data-state="Submitting"] .vc-combo-part {
  opacity: 0.75;
  transition: opacity var(--vc-duration) var(--vc-ease);
}
#vibecheck-layer .vc-combo-field[data-state="Disabled"] { opacity: var(--vc-opacity-resolved); }

#vibecheck-layer .vc-field-message {
  padding: var(--vc-spacing-4) var(--vc-spacing-12);
  color: var(--vc-text-gray-light);
  font: 11px/13px var(--vc-font-family);
}

#vibecheck-layer [role="alert"].vc-field-message { color: var(--vc-text-critical); }

#vibecheck-layer .vc-kinds {
  display: flex;
  gap: var(--vc-spacing-4);
  padding: 0 var(--vc-spacing-8);
}

#vibecheck-layer .vc-kinds button {
  appearance: none;
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border: 1px solid var(--vc-border-gray-light);
  border-radius: var(--vc-radius-full);
  background: transparent;
  color: var(--vc-text-gray-medium);
  font: 600 11px/1.2 var(--vc-font-family);
  cursor: pointer;
  transition:
    background-color var(--vc-duration-fast) var(--vc-ease),
    border-color var(--vc-duration-fast) var(--vc-ease),
    color var(--vc-duration-fast) var(--vc-ease),
    transform var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-kinds button:hover:not([data-state="Selected"]) {
  border-color: transparent;
  background: var(--vc-surface-subtle);
}

#vibecheck-layer .vc-kinds button:active {
  transform: scale(0.96);
}

#vibecheck-layer .vc-kinds button[data-state="Selected"] {
  border-color: transparent;
  background: var(--vc-card-accent, var(--vc-pin-implement));
  color: var(--vc-text-inverse);
}

#vibecheck-layer .vc-badge {
  display: inline-block;
  margin-left: auto;
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border-radius: var(--vc-radius-full);
  background: var(--vc-badge-pending-background);
  color: var(--vc-badge-pending-text);
  font: 600 10px/1 var(--vc-font-family);
}

#vibecheck-layer .vc-badge[data-type="Applied"] {
  background: var(--vc-badge-success-background);
  color: var(--vc-badge-success-text);
}

#vibecheck-layer .vc-wording-content {
  display: flex;
  flex-direction: column;
  max-height: min(360px, calc(100vh - 180px));
  overflow: auto;
}

#vibecheck-layer .vc-quote {
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-4);
  padding: var(--vc-spacing-8) var(--vc-spacing-12);
}

#vibecheck-layer .vc-quote-heading {
  color: var(--vc-text-gray-light);
  font: 600 10px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-quote[data-role="Original"] .vc-quote-heading { color: var(--vc-text); }

#vibecheck-layer .vc-quote-row {
  display: flex;
  gap: var(--vc-spacing-8);
  align-items: flex-start;
}

#vibecheck-layer .vc-quote-body {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--vc-text);
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
  color: var(--vc-icon-subtle);
}

#vibecheck-layer .vc-apply-suggestion:active { color: var(--vc-text); }

#vibecheck-layer .vc-thread {
  display: flex;
  flex-direction: column;
  gap: var(--vc-spacing-8);
  padding: var(--vc-spacing-12);
  max-height: min(280px, calc(100vh - 180px));
  overflow: auto;
}

#vibecheck-layer .vc-thread-divider {
  width: 100%;
  height: 1px;
  background: var(--vc-border-gray-light);
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
  color: var(--vc-text);
  font: 600 11px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-reply-meta time {
  color: var(--vc-text-gray-light);
  font: 10px/1.2 var(--vc-font-family);
}

#vibecheck-layer .vc-reply-body {
  color: var(--vc-text-gray-medium);
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
  top: 40px;
  right: 40px;
  left: auto;
  z-index: 2147483643;
  display: flex;
  flex-direction: column;
  width: var(--vc-size-panel);
  min-width: 260px;
  min-height: 180px;
  max-width: calc(100vw - 80px);
  max-height: calc(100vh - 80px);
  overflow: hidden;
  resize: both;
  background-color: var(--vc-surface) !important;
  background-image: none !important;
  color: var(--vc-text);
  border-radius: var(--vc-radius-12);
  box-shadow: var(--vc-shadow-panel);
  isolation: isolate;
  transition:
    width var(--vc-duration-panel) var(--vc-ease),
    min-width var(--vc-duration-panel) var(--vc-ease),
    min-height var(--vc-duration-panel) var(--vc-ease),
    box-shadow var(--vc-duration) var(--vc-ease);
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
  transition: padding var(--vc-duration-panel) var(--vc-ease);
}

#vibecheck-layer .vc-panel-collapse {
  display: grid;
  grid-template-rows: 1fr;
  min-height: 0;
  transition: grid-template-rows var(--vc-duration-panel) var(--vc-ease);
}

#vibecheck-layer .vc-panel-body {
  min-height: 0;
  overflow: auto;
  opacity: 1;
  transition: opacity var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-panel-collapse > .vc-panel-body {
  overflow: auto;
  min-height: 0;
}

#vibecheck-layer .vc-panel[data-collapsed="true"] .vc-panel-collapse > .vc-panel-body,
#vibecheck-layer .vc-panel[data-state="Collapsed"] .vc-panel-collapse > .vc-panel-body {
  overflow: hidden;
}

#vibecheck-layer .vc-panel[data-collapsed="true"],
#vibecheck-layer .vc-panel[data-state="Collapsed"] {
  width: 150px;
  min-width: 150px;
  min-height: 0;
  height: auto;
  resize: none;
}

#vibecheck-layer .vc-panel[data-collapsed="true"] .vc-panel-collapse,
#vibecheck-layer .vc-panel[data-state="Collapsed"] .vc-panel-collapse {
  grid-template-rows: 0fr;
}

#vibecheck-layer .vc-panel[data-collapsed="true"] .vc-panel-body,
#vibecheck-layer .vc-panel[data-state="Collapsed"] .vc-panel-body {
  opacity: 0;
  pointer-events: none;
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
  color: var(--vc-text-gray-medium);
  font: 600 10px var(--vc-font-family);
  cursor: pointer;
}

#vibecheck-layer .vc-panel-controls .vc-collapse {
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: var(--vc-radius-6);
  background: var(--vc-surface-subtle);
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
  border: 1px solid var(--vc-border);
  border-radius: var(--vc-radius-6);
  background: var(--vc-surface-input);
  color: var(--vc-text-gray-medium);
  transition:
    border-color var(--vc-duration-fast) var(--vc-ease),
    box-shadow var(--vc-duration-fast) var(--vc-ease);
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
  color: var(--vc-text);
  font: 12px/1 var(--vc-font-family);
}

#vibecheck-layer .vc-panel-search input::-webkit-search-cancel-button { display: none; }

#vibecheck-layer .vc-panel-search:focus-within {
  border-color: var(--vc-link);
  box-shadow: 0 0 0 1px var(--vc-link);
}

#vibecheck-layer .vc-panel-tool {
  flex: 0 0 28px;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: var(--vc-radius-6);
  background: transparent;
  color: var(--vc-text-gray-medium);
  cursor: pointer;
  font: 700 15px/1 var(--vc-font-family);
  transition: background-color var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-panel-tool:hover { background: var(--vc-button-secondary-hover); }
#vibecheck-layer .vc-panel-more { letter-spacing: -2px; }

#vibecheck-layer .vc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vc-spacing-4);
  padding: 0 var(--vc-spacing-12) var(--vc-spacing-8);
}

#vibecheck-layer .vc-filters button {
  background: var(--vc-surface);
  padding: var(--vc-spacing-4) var(--vc-spacing-8);
  border-radius: var(--vc-radius-full);
  border: 1px solid var(--vc-border);
  transition:
    background-color var(--vc-duration-fast) var(--vc-ease),
    border-color var(--vc-duration-fast) var(--vc-ease),
    color var(--vc-duration-fast) var(--vc-ease);
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
  border-radius: var(--vc-radius-8);
  transition: background-color var(--vc-duration-fast) var(--vc-ease);
}

#vibecheck-layer .vc-item + .vc-item { margin-top: var(--vc-spacing-8); }
#vibecheck-layer .vc-item[data-open="true"],
#vibecheck-layer .vc-item[data-state="Open"] {
  background: var(--vc-surface-subtle);
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
  border: 1px solid var(--vc-border);
  border-radius: var(--vc-radius-full);
  color: var(--vc-button-primary-on);
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
  color: var(--vc-text-gray-medium);
  text-overflow: ellipsis;
  white-space: nowrap;
}

#vibecheck-layer .vc-item-number { font-weight: 700; }
#vibecheck-layer .vc-thread-icon { margin: 0 2px; }
#vibecheck-layer .vc-context-link { text-decoration: none; }
#vibecheck-layer .vc-item:hover .vc-context-link { color: var(--vc-link); text-decoration: underline; }

#vibecheck-layer .vc-item-author {
  display: flex;
  gap: var(--vc-spacing-4);
  align-items: baseline;
  margin-bottom: 2px;
}

#vibecheck-layer .vc-item-author strong { color: var(--vc-text); }
#vibecheck-layer .vc-item-author span { color: var(--vc-text-gray-medium); }
#vibecheck-layer .vc-item-message { color: var(--vc-text); white-space: normal; overflow-wrap: anywhere; }
#vibecheck-layer .vc-mention,
#vibecheck-layer .vc-reply-count { color: var(--vc-link); }
#vibecheck-layer .vc-reply-count { margin-top: 2px; font-weight: 600; }
#vibecheck-layer .vc-item .vc-badge { display: inline-block; }

#vibecheck-layer .vc-panel-empty {
  padding: var(--vc-spacing-16) var(--vc-spacing-12) var(--vc-spacing-24);
  color: var(--vc-text-gray-medium);
  font: 12px/1.45 var(--vc-font-family);
}
`

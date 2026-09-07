export const feedbackStyles = `
#vibecheck-layer {
  all: initial;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
}

#vibecheck-layer .vc-pin {
  position: fixed;
  z-index: 2147483644;
  width: 28px;
  height: 28px;
  margin: 0;
  padding: 0;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #fff;
  font: 700 12px/24px system-ui, sans-serif;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgb(0 0 0 / 28%);
  transform: translate(-50%, -50%);
}

#vibecheck-layer .vc-pin[data-type="note"] { background: #7c3aed; }
#vibecheck-layer .vc-pin[data-type="annotation"][data-kind="implement"] { background: #2563eb; }
#vibecheck-layer .vc-pin[data-type="annotation"][data-kind="warning"] { background: #d97706; }
#vibecheck-layer .vc-pin[data-type="annotation"][data-kind="question"] { background: #0f766e; }
#vibecheck-layer .vc-pin[data-type="annotation"] { background: #2563eb; }
#vibecheck-layer .vc-pin[data-type="suggestion"] { background: #111827; }
#vibecheck-layer .vc-pin[data-resolved="true"] { opacity: 0.45; }
#vibecheck-layer .vc-pin[data-open="true"] { box-shadow: 0 0 0 3px #fff, 0 0 0 6px currentColor, 0 8px 24px rgb(0 0 0 / 35%); }

#vibecheck-layer .vc-card {
  position: fixed;
  z-index: 2147483645;
  width: 300px;
  max-width: calc(100vw - 24px);
  background: #fff;
  color: #111827;
  border-radius: 12px;
  box-shadow: 0 16px 50px rgb(0 0 0 / 28%);
  overflow: hidden;
}

#vibecheck-layer .vc-card * { box-sizing: border-box; }

#vibecheck-layer .vc-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px 0;
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
  gap: 4px;
  background: #f3f4f6;
  padding: 3px;
  border-radius: 8px;
}

#vibecheck-layer .vc-types button,
#vibecheck-layer .vc-kinds button,
#vibecheck-layer .vc-filters button,
#vibecheck-layer .vc-actions button {
  appearance: none;
  border: 0;
  background: transparent;
  font: 600 11px/1.2 system-ui, sans-serif;
  cursor: pointer;
  color: #4b5563;
}

#vibecheck-layer .vc-types button {
  padding: 6px 8px;
  border-radius: 6px;
}

#vibecheck-layer .vc-types button[aria-pressed="true"],
#vibecheck-layer .vc-kinds button[aria-pressed="true"],
#vibecheck-layer .vc-filters button[aria-pressed="true"] {
  background: #111827;
  color: #fff;
}

#vibecheck-layer .vc-close {
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
}

#vibecheck-layer .vc-kinds {
  display: flex;
  gap: 6px;
  padding: 8px 12px 0;
}

#vibecheck-layer .vc-kinds button {
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}

#vibecheck-layer .vc-meta {
  padding: 8px 12px 0;
  font-size: 11px;
  color: #6b7280;
}

#vibecheck-layer .vc-body,
#vibecheck-layer textarea,
#vibecheck-layer input {
  width: calc(100% - 24px);
  margin: 8px 12px 0;
  font: 13px/1.45 system-ui, sans-serif;
}

#vibecheck-layer textarea {
  min-height: 88px;
  resize: vertical;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
}

#vibecheck-layer input[type="text"] {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 6px 8px;
}

#vibecheck-layer .vc-body {
  margin: 8px 12px;
  white-space: pre-wrap;
}

#vibecheck-layer .vc-thread {
  margin: 0 12px;
  padding: 8px 0;
  border-top: 1px solid #f3f4f6;
}

#vibecheck-layer .vc-reply {
  font-size: 12px;
  margin: 0 0 8px;
}

#vibecheck-layer .vc-reply b { display: block; color: #6b7280; font-size: 10px; }

#vibecheck-layer .vc-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 10px 12px 12px;
}

#vibecheck-layer .vc-actions .primary {
  background: #111827;
  color: #fff;
  border-radius: 8px;
  padding: 7px 10px;
}

#vibecheck-layer .vc-actions .danger { color: #b91c1c; }

#vibecheck-layer .vc-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 999px;
  background: #fef3c7;
  color: #92400e;
  font-size: 10px;
  font-weight: 700;
}

#vibecheck-layer .vc-panel {
  position: fixed;
  top: 16px;
  left: calc(100vw - 296px);
  z-index: 2147483645;
  width: 280px;
  max-height: calc(100vh - 32px);
  overflow: hidden;
  background: #fff;
  color: #111827;
  border-radius: 12px;
  box-shadow: 0 12px 40px rgb(0 0 0 / 22%);
}

#vibecheck-layer .vc-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 8px;
  font: 700 13px system-ui, sans-serif;
  cursor: grab;
  touch-action: none;
  user-select: none;
}

#vibecheck-layer .vc-panel-body {
  max-height: calc(100vh - 80px);
  overflow: auto;
}

#vibecheck-layer .vc-panel[data-collapsed="true"] {
  width: 150px;
}

#vibecheck-layer .vc-panel[data-collapsed="true"] .vc-panel-head {
  padding-bottom: 12px;
}

#vibecheck-layer .vc-panel-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

#vibecheck-layer .vc-panel-controls button {
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  font: 600 10px system-ui, sans-serif;
  cursor: pointer;
}

#vibecheck-layer .vc-panel-controls .vc-collapse {
  width: 24px;
  height: 24px;
  padding: 0;
  border-radius: 6px;
  background: #f3f4f6;
  font-size: 16px;
  line-height: 1;
}

#vibecheck-layer .vc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 0 12px 8px;
}

#vibecheck-layer .vc-filters button {
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
}

#vibecheck-layer .vc-item {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  border-top: 1px solid #f3f4f6;
  background: transparent;
  padding: 10px 12px;
  cursor: pointer;
  font: 12px/1.4 system-ui, sans-serif;
  color: inherit;
}

#vibecheck-layer .vc-item[data-open="true"] { background: #f5f3ff; }
#vibecheck-layer .vc-item b { display: block; margin-bottom: 2px; }
#vibecheck-layer .vc-item span { color: #6b7280; }

@media (prefers-color-scheme: dark) {
  #vibecheck-layer .vc-card,
  #vibecheck-layer .vc-panel {
    background: #16171f;
    color: #f4f4f6;
  }
  #vibecheck-layer textarea,
  #vibecheck-layer input[type="text"] {
    background: #111827;
    color: #f4f4f6;
    border-color: #3a3d4a;
  }
  #vibecheck-layer .vc-types,
  #vibecheck-layer .vc-item { border-color: #2a2d38; }
  #vibecheck-layer .vc-types { background: #111827; }
  #vibecheck-layer .vc-item span,
  #vibecheck-layer .vc-meta { color: #9ca3af; }
}
`

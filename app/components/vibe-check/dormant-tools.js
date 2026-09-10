/**
 * Toolbar tools intentionally excluded from production.
 *
 * Position was removed from the shipped toolbar in September 2026, but its
 * implementation remains available here so it can be restored without
 * reconstructing the feature.
 */
import { Position } from '../../features/'
import { altKey } from '../../utilities/'
import * as Icons from './vibe-check.icons'

export const DormantVibeCheckTools = {
  l: {
    tool:        'position',
    icon:        Icons.position,
    label:       'Position',
    description: 'Grab and position elements anywhere',
    instruction: `<div table>
                    <div>
                      <b>Nudge:</b>
                      <span>◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>Place:</b>
                      <span>Click & drag</span>
                    </div>
                    <div>
                      <b>Restore:</b>
                      <span>${altKey} + delete</span>
                    </div>
                  </div>`,
  },
}

export function activateDormantPosition(selectorEngine) {
  const feature = Position()
  selectorEngine.onSelectedUpdate(feature.onNodesSelected)

  return () => {
    selectorEngine.removeSelectedCallback(feature.onNodesSelected)
    feature.disconnect()
  }
}

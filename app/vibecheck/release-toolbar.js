import { isFeatureEnabled } from './release-plan.js'

export const TOOL_FEATURE_IDS = {
  inspector: 'inspect',
  comments: 'comment',
  annotations: 'annotation',
  content: 'content',
  guides: 'guides',
  margin: 'margin',
  padding: 'padding',
  align: 'flex-align',
  move: 'move',
  accessibility: 'accessibility',
  hueshift: 'hue-shift',
  boxshadow: 'box-shadows',
  font: 'font-styles',
  text: 'edit-text',
  search: 'search',
}

export function releasedToolbarModel(model) {
  const filtered = Object.fromEntries(
    Object.entries(model).filter(([, tool]) => {
      const featureId = TOOL_FEATURE_IDS[tool.tool]
      if (!featureId) return true
      return isFeatureEnabled(featureId)
    }),
  )

  const ordered = {}
  for (const toolName of MAIN_TOOLBAR_ORDER) {
    const entry = Object.entries(filtered).find(([, tool]) => tool.tool === toolName)
    if (entry) ordered[entry[0]] = entry[1]
  }
  for (const [key, tool] of Object.entries(filtered)) {
    if (!(key in ordered)) ordered[key] = tool
  }
  return ordered
}

/** Main toolbar display order (matches Figma Phase 0/1 pill layout). */
export const MAIN_TOOLBAR_ORDER = [
  'inspector',
  'guides',
  'accessibility',
  'text',
  'comments',
  'content',
  'annotations',
  'margin',
  'padding',
  'align',
  'move',
  'hueshift',
  'boxshadow',
  'font',
  'search',
]

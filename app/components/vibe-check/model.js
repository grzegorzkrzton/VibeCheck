import * as Icons from './vibe-check.icons'
import { metaKey, altKey } from '../../utilities/'

export { TOOL_FEATURE_IDS, releasedToolbarModel } from '../../vibecheck/release-toolbar.js'

const VibeCheckModelEntries = {
  i: {
    tool:        'inspector',
    icon:        Icons.inspector,
    label:       '<span><u>I</u>nspect</span>',
    description: 'Inspect the common styles of an element',
    instruction: `<div table>
                    <div>
                      <b>Pin it:</b>
                      <span>click</span>
                    </div>
                    <div>
                      <b>Pin many:</b>
                      <span>shift+click</span>
                    </div>
                    <div>
                      <b>Position it:</b>
                      <span>click & drag by the header area</span>
                    </div>
                    <div>
                      <b>Clear:</b>
                      <span>esc</span>
                    </div>
                  </div>`,
  },
  c: {
    tool:         'comments',
    icon:         Icons.comments,
    label:        '<span><u>C</u>omment</span>',
    description:  'Pin a note on a selected element',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Pin:</b>
                      <span>click an element</span>
                    </div>
                    <div>
                      <b>List:</b>
                      <span>right-side panel</span>
                    </div>
                  </div>`,
  },
  n: {
    tool:         'annotations',
    icon:         Icons.annotation,
    label:        '<span>A<u>n</u>notation</span>',
    description:  'Pin a developer annotation on a selected element',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Pin:</b>
                      <span>click an element</span>
                    </div>
                    <div>
                      <b>Kind:</b>
                      <span>Implement, Warning, or Question</span>
                    </div>
                    <div>
                      <b>List:</b>
                      <span>right-side panel</span>
                    </div>
                  </div>`,
  },
  w: {
    tool:         'content',
    icon:         Icons.content,
    label:        '<span>Content</span>',
    description:  'Suggest replacement copy, preview it on the page, then approve or reject locally',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Select:</b>
                      <span>click a text element</span>
                    </div>
                    <div>
                      <b>Preview:</b>
                      <span>see the new copy on page</span>
                    </div>
                    <div>
                      <b>Decide:</b>
                      <span>approve or reject</span>
                    </div>
                  </div>`,
  },
  g: {
    tool:        'guides',
    icon:        Icons.guides,
    label:       '<span><u>G</u>uides</span>',
    description: 'Verify alignment & measure distances',
    instruction: `<div table>
                    <div>
                      <b>Element Guides:</b>
                      <span>hover</span>
                    </div>
                    <div>
                      <b>Measure:</b>
                      <span>click+hover</span>
                    </div>
                    <div>
                      <b>Measure many:</b>
                      <span>shift+click</span>
                    </div>
                    <div>
                      <b>Clear:</b>
                      <span>esc</span>
                    </div>
                  </div>`,
  },
  m: {
    tool:        'margin',
    icon:        Icons.margin,
    label:       '<span><u>M</u>argin</span>',
    description: 'Adjust spacing outside',
    instruction: `<div table>
                    <div>
                      <b>+ Margin:</b>
                      <span>◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>- Margin:</b>
                      <span>${altKey} + ◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>All Sides:</b>
                      <span>${metaKey} +  ▲ ▼</span>
                    </div>
                    <div>
                      <b>Trainer:</b>
                      <span>shift + /</span>
                    </div>
                  </div>`,
  },
  p: {
    tool:        'padding',
    icon:        Icons.padding,
    label:       '<span><u>P</u>adding</span>',
    description: `Adjust spacing within`,
    instruction: `<div table>
                    <div>
                      <b>+ Padding:</b>
                      <span>◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>- Padding:</b>
                      <span>${altKey} + ◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>All Sides:</b>
                      <span>${metaKey} +  ▲ ▼</span>
                    </div>
                    <div>
                      <b>Trainer:</b>
                      <span>shift + /</span>
                    </div>
                  </div>`
  },
  // b: {
  //   tool:        'border',
  //   icon:        Icons.border,
  //   label:       'Border',
  //   description: ''
  // },
  a: {
    tool:        'align',
    icon:        Icons.align,
    label:       '<span>Flexbox <u>A</u>lign</span>',
    description: `Adjust flexbox layout features`,
    instruction: `<div table>
                    <div>
                      <b>Rows:</b>
                      <span>${metaKey} + ▼</span>
                    </div>
                    <div>
                      <b>Columns:</b>
                      <span>${metaKey} + ▶</span>
                    </div>
                    <div>
                      <b>Alignment:</b>
                      <span>◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>Distribution:</b>
                      <span>Shift + ◀ ▶</span>
                    </div>
                    <div>
                      <b>Order:</b>
                      <span>${metaKey} + shift + ◀ ▶</span>
                    </div>
                    <div>
                      <b>Wrapping:</b>
                      <span>${metaKey} + shift + ▲ ▼</span>
                    </div>
                    <div>
                      <b>Trainer:</b>
                      <span>shift + /</span>
                    </div>
                  </div>`,
  },
  v: {
    tool:        'move',
    icon:        Icons.move,
    label:       '<span>Mo<u>v</u>e</span>',
    description: 'Change the position of elements',
    instruction: `<div table>
                    <div>
                      <b>Lateral:</b>
                      <span>click container ⇒ drag child</span>
                    </div>
                    <div>
                      <b>Lateral:</b>
                      <span>◀ ▶</span>
                    </div>
                    <div>
                      <b>Out and above:</b>
                      <span>▲</span>
                    </div>
                    <div>
                      <b>Down+in, out+under:</b>
                      <span>▼</span>
                    </div>
                    <div>
                      <b>Trainer:</b>
                      <span>shift + /</span>
                    </div>
                  </div>`,
  },
  x: {
    tool:        'accessibility',
    icon:        Icons.accessibility,
    label:       'Accessibility',
    description: 'Inspect attributes & contrast compliance',
    instruction: `<div table>
                    <div>
                      <b>Pin it:</b>
                      <span>click</span>
                    </div>
                    <div>
                      <b>Pin many:</b>
                      <span>shift+click</span>
                    </div>
                    <div>
                      <b>Clear:</b>
                      <span>esc</span>
                    </div>
                  </div>`,
  },
  h: {
    tool:        'hueshift',
    icon:        Icons.hueshift,
    label:       '<span><u>H</u>ue Shift</span>',
    description: ``,
    instruction: `<div table>
                    <div>
                      <b>Saturation:</b>
                      <span>◀ ▶</span>
                    </div>
                    <div>
                      <b>Brightness:</b>
                      <span>▲ ▼</span>
                    </div>
                    <div>
                      <b>Hue:</b>
                      <span>${metaKey} +  ▲ ▼</span>
                    </div>
                    <div>
                      <b>Opacity:</b>
                      <span>${metaKey} +  ◀ ▶</span>
                    </div>
                    <div>
                      <b>Trainer:</b>
                      <span>shift + /</span>
                    </div>
                  </div>`,
  },
  d: {
    tool:        'boxshadow',
    icon:        Icons.boxshadow,
    label:       '<span>Box Sha<u>d</u>ows</span>',
    description: ``,
    instruction: `<div table>
                    <div>
                      <b>X/Y Position:</b>
                      <span>◀ ▶ ▲ ▼</span>
                    </div>
                    <div>
                      <b>Blur:</b>
                      <span>${altKey} + ▲ ▼</span>
                    </div>
                    <div>
                      <b>Spread:</b>
                      <span>${altKey} + ◀ ▶</span>
                    </div>
                    <div>
                      <b>Opacity:</b>
                      <span>${metaKey} + ◀ ▶</span>
                    </div>
                  </div>`,
  },
  // t: {
  //   tool:        'transform',
  //   icon:        Icons.transform,
  //   label:       '3D Transform',
  //   description: ''
  // },
  f: {
    tool:        'font',
    icon:        Icons.font,
    label:       '<span><u>F</u>ont Styles</span>',
    description: '',
    instruction: `<div table>
                    <div>
                      <b>Size:</b>
                      <span>▲ ▼</span>
                    </div>
                    <div>
                      <b>Alignment:</b>
                      <span>◀ ▶</span>
                    </div>
                    <div>
                      <b>Leading:</b>
                      <span>Shift + ▲ ▼</span>
                    </div>
                    <div>
                      <b>Letter-spacing:</b>
                      <span>Shift + ◀ ▶</span>
                    </div>
                    <div>
                      <b>Weight:</b>
                      <span>${metaKey} + ▲ ▼</span>
                    </div>
                    <div>
                      <b>Trainer:</b>
                      <span>shift + /</span>
                    </div>
                  </div>`,
  },
  e: {
    tool:        'text',
    icon:        Icons.text,
    label:       '<span><u>E</u>dit Text</span>',
    description: 'Just <b>Double click</b> any text on the page',
    dividerAfter: true,
    instruction: '',
  },
  s: {
    tool:        'search',
    icon:        Icons.search,
    label:       '<span><u>S</u>earch</span>',
    description: 'Select elements programatically by searching for them or use built in plugins with special commands',
    instruction: '',
  },
}

/** Matches Figma Phase 1 main toolbar (top → bottom). */
const TOOLBAR_KEY_ORDER = [
  'i', 'g', 'x', 'e', 'c', 'w', 'n', 'm', 'p', 'a', 'v', 'h', 'd', 'f', 's',
]

export const VibeCheckModel = Object.fromEntries(
  TOOLBAR_KEY_ORDER.map(key => [key, VibeCheckModelEntries[key]]),
)

export const VibeCheckModelPMOnly = {
  i: VibeCheckModel.i,
  c: VibeCheckModel.c,
  n: VibeCheckModel.n,
  w: VibeCheckModel.w,
  s: VibeCheckModel.s,
}

export const TOOLBAR_ROLE_STORAGE_KEY = 'vibecheck:toolbarRole'

export function toolbarModelForRole(role = 'Full') {
  return role === 'PM Only' ? VibeCheckModelPMOnly : VibeCheckModel
}

export const VibeCheckPromptTool = {
  tool:         'prompt',
  icon:         Icons.prompt,
  label:        '<span><u>Q</u> AI Prompt</span>',
  description:  'Copy an AI-ready prompt of your live edits for Cursor, ChatGPT, or your coding agent',
  hasTutorial:  false,
  instruction:  `<div table>
                  <div>
                    <b>Edit first:</b>
                    <span>padding, type, color, text</span>
                  </div>
                  <div>
                    <b>Export:</b>
                    <span>click this button or press Q</span>
                  </div>
                </div>`,
}

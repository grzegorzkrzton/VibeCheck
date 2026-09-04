import * as Icons from './vis-bug.icons'
import { metaKey, altKey } from '../../utilities/'

export const VisBugModel = {
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
    instruction: '',
  },
  // c: {
  //   tool:        'screenshot',
  //   icon:        Icons.camera,
  //   label:       'Screenshot',
  //   description: 'Screenshot selected elements or the entire page'
  // },
  s: {
    tool:        'search',
    icon:        Icons.search,
    label:       '<span><u>S</u>earch</span>',
    description: 'Select elements programatically by searching for them or use built in plugins with special commands',
    instruction: '',
  },
  c: {
    tool:         'comment',
    icon:         Icons.comment,
    label:        '<span><u>C</u>omment</span>',
    description:  'Pin a Figma-style comment on a selected element',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Pin:</b>
                      <span>click an element</span>
                    </div>
                    <div>
                      <b>Mention:</b>
                      <span>@email in the note</span>
                    </div>
                    <div>
                      <b>Resolve:</b>
                      <span>from the pin or panel</span>
                    </div>
                  </div>`,
  },
  n: {
    tool:         'annotate',
    icon:         Icons.annotate,
    label:        '<span>A<u>n</u>notate</span>',
    description:  'Leave implementation notes for engineers',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Add:</b>
                      <span>click an element</span>
                    </div>
                    <div>
                      <b>Types:</b>
                      <span>implement, warning, info</span>
                    </div>
                  </div>`,
  },
  q: {
    tool:         'prompt',
    icon:         Icons.prompt,
    label:        '<span>AI <u>q</u>uery</span>',
    description:  'Copy a consistent prompt of your live visual edits',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Edit first:</b>
                      <span>use padding, type, color, text</span>
                    </div>
                    <div>
                      <b>Export:</b>
                      <span>click this tool to copy</span>
                    </div>
                  </div>`,
  },
  w: {
    tool:         'content',
    icon:         Icons.content,
    label:        '<span><u>W</u>rite copy</span>',
    description:  'Suggest replacement copy for the prototype owner to approve',
    hasTutorial:  false,
    instruction:  `<div table>
                    <div>
                      <b>Select text:</b>
                      <span>click a text element</span>
                    </div>
                    <div>
                      <b>Submit:</b>
                      <span>owner is notified</span>
                    </div>
                  </div>`,
  },
}

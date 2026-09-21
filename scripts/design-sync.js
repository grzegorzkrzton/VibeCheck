#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TOKENS_PATH = path.join(ROOT, 'design-system', 'tokens.json')
const GENERATED_DIR = path.join(ROOT, 'design-system', 'generated')
const POPUP_TOKENS_PATH = path.join(ROOT, 'extension', 'popup', 'tokens.css')
const FONTS_SRC = path.join(ROOT, 'design-system', 'fonts', 'figtree')
const FONTS_EXT = path.join(ROOT, 'extension', 'fonts', 'figtree')

function loadTokens(root = ROOT) {
  return JSON.parse(fs.readFileSync(path.join(root, 'design-system', 'tokens.json'), 'utf8'))
}

function cssName(prefix, key) {
  return `${prefix}-${key}`
}

function declsFor(map, prefix) {
  return Object.entries(map)
    .map(([key, value]) => `  ${cssName(prefix, key)}: ${value};`)
    .join('\n')
}

function colorDecls(tokens, mode) {
  return declsFor(tokens.color[mode], tokens.cssPrefix)
}

function fontPrimitiveDecls(tokens) {
  const prefix = tokens.cssPrefix
  const font = tokens.font
  const lines = [
    `  ${prefix}-font-family: ${font.family};`,
    `  ${prefix}-font-feature-settings: ${font.featureSettings || '"ss01" 1'};`,
  ]

  Object.entries(font.size || {}).forEach(([key, value]) => {
    lines.push(`  ${prefix}-font-size-${key}: ${value};`)
  })
  Object.entries(font.weight || {}).forEach(([key, value]) => {
    lines.push(`  ${prefix}-font-weight-${key}: ${value};`)
  })
  Object.entries(font.lineHeight || {}).forEach(([key, value]) => {
    lines.push(`  ${prefix}-line-height-${key}: ${value};`)
  })
  Object.entries(font.letterSpacing || {}).forEach(([key, value]) => {
    lines.push(`  ${prefix}-letter-spacing-${key}: ${value};`)
  })

  Object.entries(font.text || {}).forEach(([name, recipe]) => {
    const weight = font.weight[recipe.weight]
    const size = font.size[recipe.size]
    const lineHeight = font.lineHeight[recipe.lineHeight]
    lines.push(
      `  ${prefix}-text-${name}: ${weight} ${size}/${lineHeight} var(${prefix}-font-family);`,
    )
    lines.push(
      `  ${prefix}-text-${name}-letter-spacing: var(${prefix}-letter-spacing-${recipe.letterSpacing});`,
    )
  })

  return lines.join('\n')
}

function sharedDecls(tokens) {
  return [
    declsFor(tokens.primitives, tokens.cssPrefix),
    declsFor(tokens.dimension, tokens.cssPrefix),
    declsFor(tokens.effect, tokens.cssPrefix),
    fontPrimitiveDecls(tokens),
  ].join('\n')
}

function banner() {
  return '/* Generated from design-system/tokens.json. Do not edit. */'
}

/** @param {string} urlForFile - function body not used; pass absolute or relative URL builder result per file */
function figtreeFontFaceCss(urlForFile) {
  const faces = [
    [400, 'figtree-400.woff2'],
    [500, 'figtree-500.woff2'],
    [600, 'figtree-600.woff2'],
    [700, 'figtree-700.woff2'],
  ]
  return faces.map(([weight, file]) => `@font-face {
  font-family: 'Figtree';
  font-style: normal;
  font-weight: ${weight};
  font-display: swap;
  src: url('${urlForFile(file)}') format('woff2');
}`).join('\n\n')
}

function popupFontFaceCss() {
  return figtreeFontFaceCss((file) => `../fonts/figtree/${file}`)
}

function generateOutputs(tokens) {
  const lightColors = colorDecls(tokens, 'light')
  const darkColors = colorDecls(tokens, 'dark')
  const shared = sharedDecls(tokens)
  const popupFonts = popupFontFaceCss()

  const tokensCss = `${banner()}
:root, :host {
${lightColors}
${shared}
}

@media (prefers-color-scheme: dark) {
  :root, :host {
${darkColors}
  }
}
`

  const tokensLightCss = `${banner()}
:host {
${lightColors}
${shared}
}
`

  const tokensDarkCss = `${banner()}
:host {
${darkColors}
${shared}
}
`

  const layerTokenCss = `${banner()}
#vibecheck-layer {
${lightColors}
${shared}
}

@media (prefers-color-scheme: dark) {
  #vibecheck-layer {
${darkColors}
  }
}

#vibecheck-layer[data-scheme="light"] {
${lightColors}
}

#vibecheck-layer[data-scheme="dark"] {
${darkColors}
}
`

  const popupTokensCss = `${banner()}
${popupFonts}

:root, :host {
${lightColors}
${shared}
}

@media (prefers-color-scheme: dark) {
  :root, :host {
${darkColors}
  }
}
`

  const tokensJs = `${banner().replace('/* ', '// ').replace(' */', '')}
export const tokenCss = ${JSON.stringify(tokensCss)};
export const layerTokenCss = ${JSON.stringify(layerTokenCss)};
export const hostLightCss = ${JSON.stringify(tokensLightCss)};
export const hostDarkCss = ${JSON.stringify(tokensDarkCss)};

export function figtreeFontFaceCss(urlForFile) {
  const faces = [
    [400, 'figtree-400.woff2'],
    [500, 'figtree-500.woff2'],
    [600, 'figtree-600.woff2'],
    [700, 'figtree-700.woff2'],
  ];
  return faces.map(([weight, file]) => \`@font-face {
  font-family: 'Figtree';
  font-style: normal;
  font-weight: \${weight};
  font-display: swap;
  src: url('\${urlForFile(file)}') format('woff2');
}\`).join('\\n\\n');
}
`

  return {
    'design-system/generated/tokens.css': tokensCss,
    'design-system/generated/tokens-light.css': tokensLightCss,
    'design-system/generated/tokens-dark.css': tokensDarkCss,
    'design-system/generated/tokens.js': tokensJs,
    'extension/popup/tokens.css': popupTokensCss,
  }
}

function syncFontFiles(root = ROOT) {
  const src = path.join(root, 'design-system', 'fonts', 'figtree')
  const dest = path.join(root, 'extension', 'fonts', 'figtree')
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  for (const file of fs.readdirSync(src)) {
    fs.copyFileSync(path.join(src, file), path.join(dest, file))
  }
}

function writeOutputs(root = ROOT, files = generateOutputs(loadTokens(root))) {
  fs.mkdirSync(path.join(root, 'design-system', 'generated'), { recursive: true })
  syncFontFiles(root)
  Object.entries(files).forEach(([rel, contents]) => {
    const abs = path.join(root, rel)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, contents)
  })
  return Object.keys(files)
}

function check(root = ROOT) {
  const expected = generateOutputs(loadTokens(root))
  const drift = []
  Object.entries(expected).forEach(([rel, contents]) => {
    const abs = path.join(root, rel)
    if (!fs.existsSync(abs)) {
      drift.push(`missing ${rel}`)
      return
    }
    if (fs.readFileSync(abs, 'utf8') !== contents)
      drift.push(`stale ${rel}`)
  })
  if (drift.length) {
    const error = new Error(`Design token drift:\n- ${drift.join('\n- ')}\nRun npm run design:sync`)
    error.drift = drift
    throw error
  }
  return Object.keys(expected)
}

function main() {
  const checkMode = process.argv.includes('--check')
  if (checkMode) {
    check()
    console.log('design:check ok')
    return
  }
  const written = writeOutputs()
  console.log(`design:sync wrote ${written.length} files`)
}

if (require.main === module)
  main()

module.exports = {
  TOKENS_PATH,
  GENERATED_DIR,
  POPUP_TOKENS_PATH,
  FONTS_SRC,
  FONTS_EXT,
  loadTokens,
  generateOutputs,
  writeOutputs,
  syncFontFiles,
  figtreeFontFaceCss,
  check,
}

#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const TOKENS_PATH = path.join(ROOT, 'design-system', 'tokens.json')
const GENERATED_DIR = path.join(ROOT, 'design-system', 'generated')
const POPUP_TOKENS_PATH = path.join(ROOT, 'extension', 'popup', 'tokens.css')

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

function sharedDecls(tokens) {
  return [
    declsFor(tokens.dimension, tokens.cssPrefix),
    declsFor(tokens.effect, tokens.cssPrefix),
    `  ${tokens.cssPrefix}-font-family: ${tokens.font.family};`,
  ].join('\n')
}

function banner() {
  return '/* Generated from design-system/tokens.json. Do not edit. */'
}

function generateOutputs(tokens) {
  const lightColors = colorDecls(tokens, 'light')
  const darkColors = colorDecls(tokens, 'dark')
  const shared = sharedDecls(tokens)

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

  const tokensJs = `${banner().replace('/* ', '// ').replace(' */', '')}
export const tokenCss = ${JSON.stringify(tokensCss)};
export const layerTokenCss = ${JSON.stringify(layerTokenCss)};
export const hostLightCss = ${JSON.stringify(tokensLightCss)};
export const hostDarkCss = ${JSON.stringify(tokensDarkCss)};
`

  return {
    'design-system/generated/tokens.css': tokensCss,
    'design-system/generated/tokens-light.css': tokensLightCss,
    'design-system/generated/tokens-dark.css': tokensDarkCss,
    'design-system/generated/tokens.js': tokensJs,
    'extension/popup/tokens.css': tokensCss,
  }
}

function writeOutputs(root = ROOT, files = generateOutputs(loadTokens(root))) {
  fs.mkdirSync(path.join(root, 'design-system', 'generated'), { recursive: true })
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
  loadTokens,
  generateOutputs,
  writeOutputs,
  check,
}

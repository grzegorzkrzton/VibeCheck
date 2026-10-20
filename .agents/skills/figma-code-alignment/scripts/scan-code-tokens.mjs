#!/usr/bin/env node
/**
 * Code token inventory + var(--vc-*) usage scan.
 * Emits JSON for the agent to turn into docs/token-audit/02.
 *
 * Usage:
 *   node .cursor/skills/figma-code-alignment/scripts/scan-code-tokens.mjs
 *   node .../scan-code-tokens.mjs --out .cursor/skills/figma-code-alignment/.cache/code-inventory.json
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '../../../../')
const TOKENS_PATH = path.join(ROOT, 'design-system/tokens.json')

const EXCLUDE_DIRS = new Set([
  'node_modules',
  '.git',
  'design-system/generated',
  'docs/token-audit',
])

const EXCLUDE_FILES = new Set([
  'app/bundle.js',
  'extension/toolbar/bundle.min.js',
  'extension/popup/tokens.css',
])

const SCAN_EXTENSIONS = new Set(['.js', '.css', '.html', '.mjs'])

function parseArgs(argv) {
  const args = { out: null, pretty: true }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--out' && argv[i + 1]) {
      args.out = path.resolve(argv[++i])
    } else if (argv[i] === '--compact') {
      args.pretty = false
    }
  }
  return args
}

function loadTokens() {
  return JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'))
}

function cssVarName(prefix, key) {
  return `${prefix}-${key}`
}

function flattenTokens(tokens) {
  const prefix = tokens.cssPrefix || '--vc'
  const rows = []

  const push = (category, key, type, value, alias, mode, file, line = null) => {
    rows.push({
      category,
      name: cssVarName(prefix, key),
      key,
      type,
      value: value ?? null,
      alias: alias ?? null,
      mode: mode ?? 'all',
      file,
      line,
    })
  }

  for (const [key, value] of Object.entries(tokens.primitives || {})) {
    push('color-primitive', key, 'color', value, null, 'all', 'design-system/tokens.json')
  }

  for (const mode of ['light', 'dark']) {
    for (const [key, value] of Object.entries(tokens.color?.[mode] || {})) {
      push('color-semantic', key, 'color', value, null, mode, 'design-system/tokens.json')
    }
  }

  for (const [key, value] of Object.entries(tokens.dimension || {})) {
    const type = key.startsWith('spacing')
      ? 'spacing'
      : key.startsWith('radius')
        ? 'radius'
        : key.startsWith('size')
          ? 'size'
          : key.startsWith('opacity')
            ? 'opacity'
            : 'dimension'
    push('dimension', key, type, value, null, 'all', 'design-system/tokens.json')
  }

  for (const [key, value] of Object.entries(tokens.effect || {})) {
    push('effect', key, 'shadow', value, null, 'all', 'design-system/tokens.json')
  }

  const font = tokens.font || {}
  if (font.family) {
    push('font', 'font-family', 'font-family', font.family, null, 'all', 'design-system/tokens.json')
  }
  if (font.featureSettings) {
    push('font', 'font-feature-settings', 'font-feature', font.featureSettings, null, 'all', 'design-system/tokens.json')
  }
  for (const [key, value] of Object.entries(font.size || {})) {
    push('font', `font-size-${key}`, 'font-size', value, null, 'all', 'design-system/tokens.json')
  }
  for (const [key, value] of Object.entries(font.weight || {})) {
    push('font', `font-weight-${key}`, 'font-weight', value, null, 'all', 'design-system/tokens.json')
  }
  for (const [key, value] of Object.entries(font.lineHeight || {})) {
    push('font', `line-height-${key}`, 'line-height', value, null, 'all', 'design-system/tokens.json')
  }
  for (const [key, value] of Object.entries(font.letterSpacing || {})) {
    push('font', `letter-spacing-${key}`, 'letter-spacing', value, null, 'all', 'design-system/tokens.json')
  }
  for (const [styleKey, style] of Object.entries(font.text || {})) {
    push(
      'font-text',
      `text-${styleKey}`,
      'text-style',
      JSON.stringify(style),
      null,
      'all',
      'design-system/tokens.json',
    )
  }

  return rows
}

function walkDir(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.relative(ROOT, path.join(dir, entry.name)).split(path.sep).join('/')
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(rel) || [...EXCLUDE_DIRS].some((d) => rel.startsWith(d + '/'))) continue
      walkDir(path.join(dir, entry.name), files)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name)
      if (SCAN_EXTENSIONS.has(ext) && !EXCLUDE_FILES.has(rel)) {
        files.push(path.join(dir, entry.name))
      }
    }
  }
  return files
}

function isDefinitionLine(line, varName) {
  const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`${escaped}\\s*:`).test(line)
}

function scanUsage(tokenNames) {
  const scanRoots = [
    path.join(ROOT, 'app'),
    path.join(ROOT, 'extension'),
    path.join(ROOT, 'scripts'),
    path.join(ROOT, 'design-system'),
  ]

  const usage = Object.fromEntries(tokenNames.map((n) => [n, []]))
  const files = scanRoots.flatMap((r) => walkDir(r))

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath).split(path.sep).join('/')
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const varName of tokenNames) {
        if (!line.includes(varName)) continue
        if (isDefinitionLine(line, varName)) continue
        if (!line.includes(`var(${varName}`) && !line.includes(`var(${varName},`)) continue
        usage[varName].push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 120) })
      }
    }
  }

  return usage
}

function normalizeHex(value) {
  if (typeof value !== 'string') return null
  const m = value.trim().match(/^#([0-9a-f]{3,8})$/i)
  if (!m) return null
  let hex = m[1].toLowerCase()
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (hex.length === 6) return `#${hex}`
  if (hex.length === 8) return `#${hex.slice(0, 6)}`
  return null
}

function scanHardcoded(tokenRows) {
  const colorTokens = tokenRows.filter((r) => r.type === 'color' && r.value)
  const hexToToken = new Map()
  for (const row of colorTokens) {
    const hex = normalizeHex(row.value)
    if (hex && !hexToToken.has(hex)) hexToToken.set(hex, row.name)
  }

  const hits = []
  const scanRoots = [path.join(ROOT, 'app'), path.join(ROOT, 'extension')]
  const hexRe = /#([0-9a-f]{3,8})\b/gi

  for (const root of scanRoots) {
    for (const filePath of walkDir(root)) {
      const rel = path.relative(ROOT, filePath).split(path.sep).join('/')
      if (rel.includes('tokens.css') || rel.endsWith('bundle.js') || rel.endsWith('bundle.min.js')) continue
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.includes('var(--vc-')) continue
        let match
        hexRe.lastIndex = 0
        while ((match = hexRe.exec(line)) !== null) {
          const raw = `#${match[1]}`
          const hex = normalizeHex(raw)
          if (hex && hexToToken.has(hex)) {
            hits.push({
              file: rel,
              line: i + 1,
              literal: raw,
              matchingToken: hexToToken.get(hex),
              snippet: line.trim().slice(0, 120),
            })
          }
        }
      }
    }
  }

  return hits
}

function main() {
  const args = parseArgs(process.argv)
  const tokens = loadTokens()
  const tokenRows = flattenTokens(tokens)
  const tokenNames = tokenRows.map((r) => r.name)
  const usage = scanUsage(tokenNames)
  const hardcoded = scanHardcoded(tokenRows)

  const unused = tokenNames.filter((name) => usage[name].length === 0)

  const output = {
    generatedAt: new Date().toISOString(),
    tokensPath: 'design-system/tokens.json',
    cssPrefix: tokens.cssPrefix || '--vc',
    fileKey: tokens.fileKey,
    figmaCollections: tokens.figma?.collections ?? [],
    summary: {
      totalTokens: tokenRows.length,
      byCategory: tokenRows.reduce((acc, r) => {
        acc[r.category] = (acc[r.category] || 0) + 1
        return acc
      }, {}),
      usedTokens: tokenNames.length - unused.length,
      unusedTokens: unused.length,
      hardcodedHits: hardcoded.length,
    },
    tokens: tokenRows,
    usage,
    unused,
    hardcoded,
  }

  const json = args.pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output)
  if (args.out) {
    fs.mkdirSync(path.dirname(args.out), { recursive: true })
    fs.writeFileSync(args.out, json)
    console.error(`Wrote ${args.out}`)
  } else {
    process.stdout.write(json)
  }
}

main()

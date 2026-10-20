#!/usr/bin/env node
/**
 * Deterministic Figma ↔ code mapping and comparison from JSON dumps.
 *
 * Usage:
 *   node compare-tokens.mjs --figma figma.json --code code.json --out mapping.json
 *   node compare-tokens.mjs --figma figma.json --code code.json --compare --out comparison.json
 *
 * Figma inventory shape (agent-produced from use_figma):
 * {
 *   "variables": [{ "name", "category", "type", "value", "alias", "mode", "collection" }],
 *   "styles": [{ "name", "category", "type", "value", "mode" }]
 * }
 *
 * Code inventory: output of scan-code-tokens.mjs
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const args = { figma: null, code: null, out: null, compare: false, pretty: true }
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--figma' && argv[i + 1]) args.figma = path.resolve(argv[++i])
    else if (argv[i] === '--code' && argv[i + 1]) args.code = path.resolve(argv[++i])
    else if (argv[i] === '--out' && argv[i + 1]) args.out = path.resolve(argv[++i])
    else if (argv[i] === '--compare') args.compare = true
    else if (argv[i] === '--compact') args.pretty = false
  }
  return args
}

function normalizeName(raw) {
  if (!raw) return ''
  let s = String(raw)
    .replace(/^var\(\s*--vc-/i, '')
    .replace(/^--vc-/i, '')
    .replace(/^VibeCheck\//i, '')
    .replace(/^Elevation\//i, '')
    .replace(/\//g, '-')
    .replace(/[\s_]+/g, '-')
    .replace(/\./g, '-')
    .toLowerCase()

  // badge shorthand: "pending - bg" → pending-background
  s = s.replace(/\s*-\s*bg\b/g, '-background')
  s = s.replace(/\s*-\s*fg\b/g, '-foreground')

  // collapse duplicate segments: gray-gray-50 → gray-50, bg-bg → bg
  const parts = s.split('-').filter(Boolean)
  const collapsed = []
  for (const part of parts) {
    if (collapsed.length && collapsed[collapsed.length - 1] === part) continue
    collapsed.push(part)
  }
  return collapsed.join('-')
}

function normalizeMode(mode) {
  if (!mode || mode === 'Value' || mode === 'all') return 'all'
  return String(mode).toLowerCase()
}

function normalizeColor(value) {
  if (value == null) return null
  const s = String(value).trim()
  const hex = s.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    let h = hex[1].toLowerCase()
    if (h.length === 3) h = h.split('').map((c) => c + c).join('')
    return `#${h.slice(0, 6)}`
  }
  const rgb = s.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i)
  if (rgb) {
    const r = Number(rgb[1]).toString(16).padStart(2, '0')
    const g = Number(rgb[2]).toString(16).padStart(2, '0')
    const b = Number(rgb[3]).toString(16).padStart(2, '0')
    return `#${r}${g}${b}`
  }
  return s.toLowerCase()
}

function normalizeNumber(value) {
  if (value == null) return null
  const s = String(value).trim()
  const px = s.match(/^(-?[\d.]+)px$/)
  if (px) return parseFloat(px[1])
  const n = parseFloat(s)
  return Number.isNaN(n) ? s.toLowerCase() : n
}

function normalizeValue(type, value) {
  if (value == null) return null
  if (type === 'color' || String(type).includes('color')) return normalizeColor(value)
  if (['spacing', 'radius', 'size', 'font-size', 'line-height', 'letter-spacing', 'opacity', 'dimension'].includes(type)) {
    return normalizeNumber(value)
  }
  return String(value).trim().toLowerCase()
}

function valuesMatch(type, figmaValue, codeValue) {
  const fv = normalizeValue(type, figmaValue)
  const cv = normalizeValue(type, codeValue)
  if (fv == null || cv == null) return { match: false, reason: 'missing value' }
  if (fv === cv) return { match: true, reason: 'exact' }

  // opacity: 45 vs 0.45
  if (type === 'opacity') {
    const fn = typeof fv === 'number' ? fv : parseFloat(fv)
    const cn = typeof cv === 'number' ? cv : parseFloat(cv)
    if (!Number.isNaN(fn) && !Number.isNaN(cn)) {
      if (fn > 1 && cn <= 1 && Math.abs(fn / 100 - cn) < 0.001) {
        return { match: 'partial', reason: 'opacity percent vs decimal' }
      }
      if (cn > 1 && fn <= 1 && Math.abs(cn / 100 - fn) < 0.001) {
        return { match: 'partial', reason: 'opacity percent vs decimal' }
      }
    }
  }

  // shadow: string containment heuristic
  if (type === 'shadow' || type === 'effect') {
    const a = String(figmaValue).replace(/\s+/g, ' ').toLowerCase()
    const b = String(codeValue).replace(/\s+/g, ' ').toLowerCase()
    if (a.includes(b) || b.includes(a)) return { match: 'partial', reason: 'shadow string overlap' }
  }

  return { match: false, reason: `figma=${fv} code=${cv}` }
}

function confidenceForPair(figma, code, valueResult) {
  const fn = normalizeName(figma.normalizedName || figma.name)
  const cn = normalizeName(code.normalizedName || code.key || code.name)
  if (!fn || !cn) return { level: 'None', reason: 'empty normalized name' }

  const nameMatch = fn === cn
  const nameContains = fn.includes(cn) || cn.includes(fn)

  if (figma.alias && !nameMatch) {
    return { level: 'Medium', reason: 'Figma alias; name path may differ' }
  }

  if (nameMatch && valueResult.match === true) {
    return { level: 'High', reason: 'name and value match' }
  }
  if (nameMatch && valueResult.match === 'partial') {
    return { level: 'Medium', reason: `name match; ${valueResult.reason}` }
  }
  if (nameMatch && valueResult.match === false) {
    return { level: 'Medium', reason: `name match; value differs (${valueResult.reason})` }
  }
  if (nameContains && valueResult.match === true) {
    return { level: 'Low', reason: 'partial name overlap; value match' }
  }
  if (nameContains) {
    return { level: 'Low', reason: 'partial name overlap only' }
  }
  return { level: 'None', reason: 'no credible name link' }
}

function flattenFigmaInventory(figma) {
  const rows = []
  for (const v of figma.variables || []) {
    rows.push({
      source: 'variable',
      name: v.name,
      normalizedName: normalizeName(v.name),
      category: v.category || v.collection || 'unknown',
      type: v.type || 'unknown',
      value: v.value,
      alias: v.alias || null,
      mode: normalizeMode(v.mode),
    })
  }
  for (const s of figma.styles || []) {
    rows.push({
      source: 'style',
      name: s.name,
      normalizedName: normalizeName(s.name),
      category: s.category || 'style',
      type: s.type || 'style',
      value: s.value,
      alias: null,
      mode: normalizeMode(s.mode),
    })
  }
  return rows
}

function flattenCodeInventory(code) {
  return (code.tokens || []).map((t) => ({
    source: 'code',
    name: t.name,
    key: t.key,
    normalizedName: normalizeName(t.key || t.name),
    category: t.category,
    type: t.type,
    value: t.value,
    alias: t.alias,
    mode: normalizeMode(t.mode),
    file: t.file,
  }))
}

function buildIndex(rows) {
  const byNorm = new Map()
  for (const row of rows) {
    const key = `${row.normalizedName}::${row.mode}`
    if (!byNorm.has(key)) byNorm.set(key, [])
    byNorm.get(key).push(row)
  }
  return byNorm
}

function compareInventories(figmaRows, codeRows) {
  const figmaByNorm = buildIndex(figmaRows)
  const codeByNorm = buildIndex(codeRows)
  const mappings = []
  const usedCode = new Set()
  const usedFigma = new Set()

  for (const figma of figmaRows) {
    const modes = figma.mode === 'all' ? ['all', 'light', 'dark'] : [figma.mode, 'all']
    let best = null

    for (const mode of modes) {
      const key = `${figma.normalizedName}::${mode}`
      const candidates = codeByNorm.get(key) || codeByNorm.get(`${figma.normalizedName}::all`) || []
      for (const code of candidates) {
        const valueResult = valuesMatch(figma.type, figma.value, code.value)
        const conf = confidenceForPair(figma, code, valueResult)
        if (conf.level === 'None') continue
        const score = { High: 4, Medium: 3, Low: 2, None: 0 }[conf.level]
        const valueScore = valueResult.match === true ? 2 : valueResult.match === 'partial' ? 1 : 0
        const total = score + valueScore
        if (!best || total > best.total) {
          best = { figma, code, conf, valueResult, total }
        }
      }
    }

    if (best) {
      usedFigma.add(figma.name)
      usedCode.add(best.code.name)
      mappings.push({
        figmaToken: figma.name,
        codeToken: best.code.name,
        figmaValue: figma.value,
        codeValue: best.code.value,
        figmaMode: figma.mode,
        codeMode: best.code.mode,
        normalization: `normalize(${figma.name}) → ${figma.normalizedName}`,
        confidence: best.conf.level,
        confidenceReason: best.conf.reason,
        valueComparison: best.valueResult,
      })
    }
  }

  const unmappedFigma = figmaRows.filter((f) => !usedFigma.has(f.name))
  const unmappedCode = codeRows.filter((c) => !usedCode.has(c.name))

  return { mappings, unmappedFigma, unmappedCode }
}

function statusFromMapping(row) {
  if (row.confidence === 'None') return 'Unclear'
  const vm = row.valueComparison?.match
  if (row.confidence === 'High' && vm === true) return 'Match'
  if (vm === 'partial') return 'Partial match'
  if (vm === false && row.confidence !== 'Low') return 'Mismatch'
  if (row.confidence === 'Low') return 'Unclear'
  if (vm === false) return 'Mismatch'
  return 'Unclear'
}

function toComparison(mappings, unmappedFigma, unmappedCode) {
  const rows = mappings.map((m) => ({
    category: m.figmaToken.includes('/') ? m.figmaToken.split('/')[0] : 'token',
    figmaToken: m.figmaToken,
    figmaValue: m.figmaValue,
    codeToken: m.codeToken,
    codeValue: m.codeValue,
    status: statusFromMapping(m),
    evidence: `${m.confidence}: ${m.confidenceReason}; value: ${m.valueComparison?.reason || 'n/a'}`,
  }))

  for (const f of unmappedFigma) {
    rows.push({
      category: f.category,
      figmaToken: f.name,
      figmaValue: f.value,
      codeToken: null,
      codeValue: null,
      status: 'Missing in code',
      evidence: 'no mapping candidate above Low confidence',
    })
  }

  for (const c of unmappedCode) {
    rows.push({
      category: c.category,
      figmaToken: null,
      figmaValue: null,
      codeToken: c.name,
      codeValue: c.value,
      status: 'Missing in Figma',
      evidence: 'no Figma variable/style matched',
    })
  }

  const counts = rows.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  return { rows, counts }
}

function main() {
  const args = parseArgs(process.argv)
  if (!args.figma || !args.code) {
    console.error('Usage: compare-tokens.mjs --figma <figma.json> --code <code.json> [--compare] [--out <file>]')
    process.exit(1)
  }

  const figma = JSON.parse(fs.readFileSync(args.figma, 'utf8'))
  const code = JSON.parse(fs.readFileSync(args.code, 'utf8'))
  const figmaRows = flattenFigmaInventory(figma)
  const codeRows = flattenCodeInventory(code)
  const { mappings, unmappedFigma, unmappedCode } = compareInventories(figmaRows, codeRows)

  let output
  if (args.compare) {
    output = {
      generatedAt: new Date().toISOString(),
      ...toComparison(mappings, unmappedFigma, unmappedCode),
      mappings,
    }
  } else {
    output = {
      generatedAt: new Date().toISOString(),
      summary: {
        figmaCount: figmaRows.length,
        codeCount: codeRows.length,
        mapped: mappings.length,
        unmappedFigma: unmappedFigma.length,
        unmappedCode: unmappedCode.length,
        byConfidence: mappings.reduce((acc, m) => {
          acc[m.confidence] = (acc[m.confidence] || 0) + 1
          return acc
        }, {}),
      },
      mappings,
      unmappedFigma,
      unmappedCode,
    }
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

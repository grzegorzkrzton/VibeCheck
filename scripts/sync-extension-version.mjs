import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const manifestPath = path.join(ROOT, 'extension/manifest.json')
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))

const devMode = process.argv.includes('--dev')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

manifest.version = devMode ? '0.0.0' : pkg.version

if (devMode) {
  manifest.name = 'DevCheck'
  manifest.icons = { 128: 'icons/vibecheck-dev.png' }
  manifest.action = {
    ...manifest.action,
    default_icon: { 128: 'icons/vibecheck-dev.png' },
  }
}
else {
  manifest.name = 'VibeCheck'
  manifest.icons = { 128: 'icons/vibecheck.png' }
  manifest.action = {
    ...manifest.action,
    default_icon: { 128: 'icons/vibecheck.png' },
  }
}

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`extension/manifest.json version → ${manifest.version}${devMode ? ' (DevCheck)' : ''}`)

const fs = require('fs')
const puppeteer = require('puppeteer')

const SYSTEM_CHROME = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  linux: '/usr/bin/google-chrome',
}

function puppeteerLaunchOptions() {
  const options = { args: ['--no-sandbox'] }

  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    options.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH
    return options
  }

  // Puppeteer 10 ships x86_64 Chromium; Rosetta-less arm64 Macs cannot spawn it (-88).
  if (process.platform === 'darwin' && process.arch === 'arm64') {
    const chrome = SYSTEM_CHROME.darwin
    if (fs.existsSync(chrome)) {
      options.executablePath = chrome
      return options
    }
  }

  const bundled = puppeteer.executablePath()
  if (fs.existsSync(bundled)) return options

  const fallback = SYSTEM_CHROME[process.platform]
  if (fallback && fs.existsSync(fallback)) options.executablePath = fallback
  return options
}

async function launchPuppeteer() {
  return puppeteer.launch(puppeteerLaunchOptions())
}

module.exports = { puppeteerLaunchOptions, launchPuppeteer }

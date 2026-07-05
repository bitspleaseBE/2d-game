const { defineConfig, chromium } = require('@playwright/test');
const fs = require('fs');

// Some sandboxed environments ship a pre-installed Chromium (possibly from an
// older Playwright release) and block browser downloads. When the browser this
// Playwright version expects is missing, fall back to the pre-installed binary.
// On a normal dev machine run `npx playwright install chromium` once and the
// default resolution is used.
const preinstalledChromium = '/opt/pw-browsers/chromium';
let executablePath;
try {
  if (!fs.existsSync(chromium.executablePath()) && fs.existsSync(preinstalledChromium)) {
    executablePath = preinstalledChromium;
  }
} catch {
  if (fs.existsSync(preinstalledChromium)) executablePath = preinstalledChromium;
}

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 90_000,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:1234',
    viewport: { width: 1400, height: 800 },
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:1234',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

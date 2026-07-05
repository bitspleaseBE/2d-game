import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', (msg) => console.log(`[console.${msg.type()}]`, msg.text()));
page.on('pageerror', (err) => console.log('[pageerror]', err.message));
page.on('requestfailed', (req) => console.log('[requestfailed]', req.url(), req.failure()?.errorText));

await page.goto('http://localhost:8899/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);
console.log('--- splash text:', await page.locator('#splash-screen').innerText().catch(() => '(none)'));
console.log('--- welcome present:', await page.locator('#welcome-screen').count());
await browser.close();

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUT_DIR = path.resolve(__dirname, '../../docs/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  const viewports = [
    { name: 'desktop', width: 1440, height: 900, isMobile: false },
    { name: 'mobile', width: 360, height: 780, isMobile: true, hasTouch: true }
  ];

  for (const vp of viewports) {
    await page.setViewport(vp);

    // 1. Home Page
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, `reset_home_${vp.name}.png`), fullPage: false });

    // 2. Sign In Page
    await page.goto('http://127.0.0.1:4173/sign-in', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, `reset_signin_${vp.name}.png`), fullPage: false });

    // 3. Register Page
    await page.goto('http://127.0.0.1:4173/register', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(OUT_DIR, `reset_register_${vp.name}.png`), fullPage: false });

    // 4. Volunteer Dashboard Shell (Dawit Bekele)
    await page.evaluate(() => {
      localStorage.setItem('vts_civic_current_user_v1', JSON.stringify({
        id: 'usr-dawit',
        role: 'volunteer',
        username: 'dawit.bekele',
        email: 'dawit.bekele@vts.et',
        fullName: 'Dawit Bekele',
        accountStatus: 'active',
        createdAt: '2026-01-01T00:00:00Z'
      }));
    });
    await page.goto('http://127.0.0.1:4173/volunteer/home', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUT_DIR, `reset_volunteer_shell_${vp.name}.png`), fullPage: false });

    // Clear session for next loop
    await page.evaluate(() => localStorage.removeItem('vts_civic_current_user_v1'));
  }

  await browser.close();
  console.log('Reset screenshots successfully captured to docs/screenshots');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

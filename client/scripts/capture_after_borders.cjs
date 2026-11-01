const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';
const BORDERS_DIR = path.resolve(__dirname, '../../docs/audit/borders');

if (!fs.existsSync(BORDERS_DIR)) {
  fs.mkdirSync(BORDERS_DIR, { recursive: true });
}

const AFTER_PAGES = [
  { name: 'volunteer_home', username: 'dawit.bekele', path: '/volunteer/home' },
  { name: 'activities', username: 'dawit.bekele', path: '/volunteer/activities' },
  { name: 'hours', username: 'dawit.bekele', path: '/volunteer/hours' },
  { name: 'rank', username: 'dawit.bekele', path: '/volunteer/rank-progress' },
  { name: 'manager_dashboard', username: 'marta.girma', path: '/manager/dashboard' },
  { name: 'finance_overview', username: 'abel.hailu', path: '/finance/overview' },
  { name: 'sign_in', username: null, path: '/sign-in' },
  { name: 'register', username: null, path: '/register' },
];

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Visit sign-in
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });

  for (const item of AFTER_PAGES) {
    if (item.username) {
      await page.evaluate((uname) => {
        const storeKey = 'vts_operations_storage_v2';
        const currentUserKey = 'vts_current_user_v2';
        const rawStore = localStorage.getItem(storeKey);
        if (!rawStore) return;
        const parsed = JSON.parse(rawStore);
        const user = parsed.users.find(u => u.username.toLowerCase() === uname.toLowerCase());
        if (user) {
          localStorage.setItem(currentUserKey, JSON.stringify(user));
        }
      }, item.username);
    } else {
      await page.evaluate(() => localStorage.removeItem('vts_current_user_v2'));
    }

    await page.goto(`${BASE_URL}${item.path}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(BORDERS_DIR, `${item.name}-after.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Saved after screenshot: docs/audit/borders/${item.name}-after.png`);
  }

  await browser.close();
  console.log('All 8 after screenshots successfully saved.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});

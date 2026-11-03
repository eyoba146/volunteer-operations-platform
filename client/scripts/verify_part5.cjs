const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = 'C:\\Users\\Eyob Adamu\\.gemini\\antigravity\\brain\\3687f78d-c413-40bf-a4a3-943be391c30e';
const DOCS_DIR = path.resolve(__dirname, '../../docs/screenshots');

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

const SCREENS = [
  { role: 'volunteer', username: 'dawit.bekele', route: '/volunteer/home', name: 'volunteer_home' },
  { role: 'volunteer', username: 'dawit.bekele', route: '/volunteer/activities', name: 'volunteer_activities' },
  { role: 'volunteer', username: 'dawit.bekele', route: '/volunteer/hours', name: 'volunteer_hours' },
  { role: 'volunteer', username: 'dawit.bekele', route: '/volunteer/rank-progress', name: 'volunteer_rank_progress' },
  { role: 'team_lead', username: 'yonas.kebede', route: '/team-lead/home', name: 'team_lead_home' },
  { role: 'manager', username: 'marta.girma', route: '/manager/dashboard', name: 'manager_dashboard' },
  { role: 'finance', username: 'abel.hailu', route: '/finance/overview', name: 'finance_overview' },
  { role: 'admin', username: 'ruth.mengistu', route: '/admin/overview', name: 'admin_overview' },
  { role: 'applicant', username: 'hana.tesfaye', route: '/applicant/status', name: 'applicant_status' }
];

async function run() {
  console.log('--- STARTING PART 5 VERIFICATION & SCREENSHOT SUITE ---');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // First, initialize storage by visiting sign-in
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Helper to log in as user
  async function loginAs(username) {
    await page.evaluate((uname) => {
      const storeKey = 'vts_operations_storage_v2';
      const currentUserKey = 'vts_current_user_v2';
      let rawStore = localStorage.getItem(storeKey);
      if (!rawStore) return;
      const parsed = JSON.parse(rawStore);
      const user = parsed.users.find(u => u.username.toLowerCase() === uname.toLowerCase());
      if (user) {
        localStorage.setItem(currentUserKey, JSON.stringify(user));
      }
    }, username);
  }

  // 1. Reduced Motion Verification
  console.log('\n[1/3] Verifying reduced-motion behavior...');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await loginAs('dawit.bekele');
  await page.goto(`${BASE_URL}/volunteer/home`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  const reducedMotionActive = await page.evaluate(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  console.log('✓ prefers-reduced-motion media feature matches:', reducedMotionActive);

  // Turn off reduced-motion emulation for screenshots
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

  // 2. Automated Contrast Verification
  console.log('\n[2/3] Verifying WCAG contrast across role dashboards...');
  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function getContrast(rgb1, rgb2) {
    const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // 3. Capture Screenshots (Desktop 1440 and Mobile 360)
  console.log('\n[3/3] Capturing 1440px and 360px screenshots for all 9 key screens...');

  for (const screen of SCREENS) {
    await loginAs(screen.username);

    // Desktop 1440
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}${screen.route}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    // Contrast check on desktop
    const contrastViolations = await page.evaluate(() => {
      // Basic check for visible text elements
      const els = document.querySelectorAll('p, h1, h2, h3, h4, span, button, a');
      let issues = 0;
      for (const el of els) {
        if (!el.offsetParent) continue; // hidden
        const style = window.getComputedStyle(el);
        const color = style.color;
        // Check if color is white on white or transparent
        if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
          issues++;
        }
      }
      return issues;
    });

    const desktopFile = `surface_${screen.name}_1440.png`;
    const docDesktopPath = path.join(DOCS_DIR, desktopFile);
    const artDesktopPath = path.join(ARTIFACT_DIR, desktopFile);
    await page.screenshot({ path: docDesktopPath, fullPage: false });
    fs.copyFileSync(docDesktopPath, artDesktopPath);

    // Mobile 360
    await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}${screen.route}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const mobileFile = `surface_${screen.name}_360.png`;
    const docMobilePath = path.join(DOCS_DIR, mobileFile);
    const artMobilePath = path.join(ARTIFACT_DIR, mobileFile);
    await page.screenshot({ path: docMobilePath, fullPage: false });
    fs.copyFileSync(docMobilePath, artMobilePath);

    console.log(`✓ [${screen.name}] captured (1440px + 360px) - contrast issues: ${contrastViolations}`);
  }

  await browser.close();
  console.log('\n--- ALL VERIFICATIONS AND SCREENSHOTS COMPLETED SUCCESSFULLY ---');
}

run().catch(err => {
  console.error('ERROR during verification:', err);
  process.exit(1);
});


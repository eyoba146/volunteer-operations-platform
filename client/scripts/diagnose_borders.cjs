const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:5173';
const BORDERS_DIR = path.resolve(__dirname, '../../docs/audit/borders');

if (!fs.existsSync(BORDERS_DIR)) {
  fs.mkdirSync(BORDERS_DIR, { recursive: true });
}

// Pages to diagnose
const DIAGNOSE_PAGES = [
  { name: 'volunteer_home', role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/home' },
  { name: 'activities', role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/activities' },
  { name: 'hours', role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/hours' },
  { name: 'rank', role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/rank-progress' },
  { name: 'manager_dashboard', role: 'manager', username: 'marta.girma', path: '/manager/dashboard' },
  { name: 'finance_overview', role: 'finance', username: 'abel.hailu', path: '/finance/overview' },
  { name: 'sign_in', role: 'public', username: null, path: '/sign-in' },
  { name: 'register', role: 'public', username: null, path: '/register' },
];

async function runDiagnosis() {
  console.log('=== STEP 0: DIAGNOSE BORDERS & CAPTURE BEFORE SCREENSHOTS ===\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  async function loginAs(username) {
    if (!username) {
      await page.evaluate(() => localStorage.removeItem('vts_current_user_v2'));
      return;
    }
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
    }, username);
  }

  // Visit sign in to init
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  console.log('--- 1. CAPTURING BEFORE SCREENSHOTS (1440px) ---');
  for (const item of DIAGNOSE_PAGES) {
    await loginAs(item.username);
    await page.goto(`${BASE_URL}${item.path}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(BORDERS_DIR, `${item.name}-before.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`Saved before screenshot: docs/audit/borders/${item.name}-before.png`);
  }

  console.log('\n--- 2. COMPUTED STYLES FOR MAIN CONTAINER, CARD, BUTTON, TAB BAR, TABLE ---');
  const targetPages = [
    { title: 'Volunteer Home', username: 'dawit.bekele', path: '/volunteer/home' },
    { title: 'Activities', username: 'dawit.bekele', path: '/volunteer/activities' },
    { title: 'Your Hours', username: 'dawit.bekele', path: '/volunteer/hours' },
    { title: 'Manager Applications', username: 'marta.girma', path: '/manager/applications' },
    { title: 'Finance Payments', username: 'abel.hailu', path: '/finance/payments' },
  ];

  for (const tp of targetPages) {
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });
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
    }, tp.username);

    await page.goto(`${BASE_URL}${tp.path}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const styles = await page.evaluate(() => {
      function getInfo(el, label) {
        if (!el) return { label, found: false };
        const s = window.getComputedStyle(el);
        return {
          label,
          found: true,
          tagName: el.tagName.toLowerCase(),
          className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 120) : '') : '',
          borderTopWidth: s.borderTopWidth,
          borderRightWidth: s.borderRightWidth,
          borderBottomWidth: s.borderBottomWidth,
          borderLeftWidth: s.borderLeftWidth,
          borderColor: s.borderColor,
          boxShadow: s.boxShadow,
          outline: s.outline,
        };
      }

      // 1. Main container
      const main = document.querySelector('main') || document.querySelector('[data-page]') || document.querySelector('.min-h-screen');
      // 2. Card
      const card = document.querySelector('[data-raised], .rounded-\\[16px\\], .bg-white.p-6, [class*="rounded-[16px]"]') || document.querySelector('.bg-white');
      // 3. Button
      const button = document.querySelector('button');
      // 4. Tab bar or header divider
      const tabBar = document.querySelector('[role="tablist"], .border-b, nav[aria-label]');
      // 5. Table or list
      const table = document.querySelector('table, .space-y-4, .space-y-3, [role="table"]');

      return {
        main: getInfo(main, 'Main container'),
        card: getInfo(card, 'Card / Panel'),
        button: getInfo(button, 'Primary / Secondary Button'),
        tabBar: getInfo(tabBar, 'Tab bar / Header divider'),
        table: getInfo(table, 'Table / List container'),
      };
    });

    console.log(`\nPAGE: ${tp.title} (${tp.path})`);
    for (const [k, v] of Object.entries(styles)) {
      if (v.found) {
        console.log(`  [${v.label}] <${v.tagName}> class="${v.className}"`);
        console.log(`    Borders: T:${v.borderTopWidth} R:${v.borderRightWidth} B:${v.borderBottomWidth} L:${v.borderLeftWidth} | Color: ${v.borderColor}`);
        console.log(`    Box-shadow: ${v.boxShadow}`);
      } else {
        console.log(`  [${v.label}]: Not found on page`);
      }
    }
  }

  await browser.close();

  console.log('\n--- 3. CODEBASE BORDER COUNTS BY FOLDER (client/src) ---');
  countCodebaseBorders();
}

function countCodebaseBorders() {
  const srcDir = path.resolve(__dirname, '../src');

  // Matchers
  // Tailwind border utilities: border, border-2, border-t, border-b, border-l, border-r, border-x, border-y, divide-x, divide-y, ring-1, outline, ring-inset
  const twBorderRegex = /\b(border(-[trblxy])?(-[0-9]+|-none|-dashed|-dotted|-solid|-[a-zA-Z0-9#_\[\]\/\-]+)?|divide-[xy](-[0-9]+|-[a-zA-Z0-9#_\[\]\/\-]+)?|ring(-[0-9]+|-inset|-[a-zA-Z0-9#_\[\]\/\-]+)?|outline(-[0-9]+|-none|-[a-zA-Z0-9#_\[\]\/\-]+)?)\b/g;

  // Filter out focus-visible:outline, focus-visible:ring, focus:ring, border-none, outline-none, ring-0, border-0
  function isTargetUtility(token) {
    if (!token) return false;
    if (token === 'border-none' || token === 'outline-none' || token === 'ring-0' || token === 'border-0') return false;
    if (token.startsWith('border') || token.startsWith('divide-') || token.startsWith('ring') || token.startsWith('outline')) {
      return true;
    }
    return false;
  }

  const countsByFolder = {};

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) {
        const relDir = path.relative(srcDir, dir) || 'root';
        const folder = relDir.split(path.sep)[0];
        if (!countsByFolder[folder]) {
          countsByFolder[folder] = {
            twBorders: 0,
            inlineBorders: 0,
            cssDeclarations: 0,
            total: 0,
            sampleFiles: new Set()
          };
        }

        const content = fs.readFileSync(fullPath, 'utf8');

        // Check CSS file
        if (entry.name.endsWith('.css')) {
          const cssMatches = content.match(/(border(-[a-z]+)?|outline|box-shadow):\s*[^;\}]+/gi) || [];
          countsByFolder[folder].cssDeclarations += cssMatches.length;
          countsByFolder[folder].total += cssMatches.length;
          if (cssMatches.length > 0) countsByFolder[folder].sampleFiles.add(entry.name);
        }

        // Inline border styles
        const inlineMatches = content.match(/style=\{\{[^}]*(border|outline)[^}]*\}\}/gi) || [];
        countsByFolder[folder].inlineBorders += inlineMatches.length;
        countsByFolder[folder].total += inlineMatches.length;

        // ClassName string matches
        const classNameRegex = /className=(?:\{`([^`]+)`\}|"([^"]+)"|'([^']+)')/g;
        let match;
        while ((match = classNameRegex.exec(content)) !== null) {
          const classStr = match[1] || match[2] || match[3] || '';
          const tokens = classStr.split(/\s+/);
          for (const token of tokens) {
            // strip conditional prefixes e.g. hover:, sm:, md:, etc.
            const parts = token.split(':');
            const prefix = parts.length > 1 ? parts.slice(0, -1).join(':') : '';
            const base = parts[parts.length - 1];

            // Ignore focus-visible rings/outlines
            if (prefix.includes('focus-visible') || prefix.includes('focus')) continue;

            if (isTargetUtility(base)) {
              countsByFolder[folder].twBorders++;
              countsByFolder[folder].total++;
              countsByFolder[folder].sampleFiles.add(entry.name);
            }
          }
        }
      }
    }
  }

  walk(srcDir);

  let grandTotal = 0;
  console.log('Folder Breakdown:');
  console.log('----------------------------------------------------------------------');
  console.log('Folder          | Tailwind Utils | Inline Styles | CSS Decls | Total');
  console.log('----------------------------------------------------------------------');
  for (const [folder, data] of Object.entries(countsByFolder)) {
    console.log(
      `${folder.padEnd(16)}| ${String(data.twBorders).padStart(14)} | ${String(data.inlineBorders).padStart(13)} | ${String(data.cssDeclarations).padStart(9)} | ${String(data.total).padStart(5)}`
    );
    grandTotal += data.total;
  }
  console.log('----------------------------------------------------------------------');
  console.log(`TOTAL DETECTED BORDER DECLARATIONS ACROSS CLIENT/SRC: ${grandTotal}\n`);
}

runDiagnosis().catch(err => {
  console.error('Diagnosis error:', err);
  process.exit(1);
});


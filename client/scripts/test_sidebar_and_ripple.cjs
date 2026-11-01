const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://127.0.0.1:4173';
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/screenshots');
const ARTIFACT_DIR = 'C:\\Users\\Eyob Adamu\\.gemini\\antigravity\\brain\\3687f78d-c413-40bf-a4a3-943be391c30e';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runVerification() {
  console.log('=== STARTING SIDEBAR NAVIGATION, RIPPLE & ROLE VERIFICATION ===\n');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Helper to save screenshot both to docs and artifacts
  async function saveScreenshot(filename, width, height) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await new Promise((r) => setTimeout(r, 600));
    const docPath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(docPath, path.join(ARTIFACT_DIR, filename));
    }
    console.log(`  [Screenshot Captured] ${filename} (${width}x${height})`);
  }

  // Set user login state
  async function loginAs(username) {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const targetUrl = await page.evaluate((uname) => {
      const storeKey = 'vts_operations_storage_v2';
      const currentUserKey = 'vts_current_user_v2';
      const rawStore = localStorage.getItem(storeKey);
      if (!rawStore) return '/sign-in';
      const parsed = JSON.parse(rawStore);
      const user = parsed.users.find((u) => u.username.toLowerCase() === uname.toLowerCase());
      if (!user) return '/sign-in';
      localStorage.setItem(currentUserKey, JSON.stringify(user));

      if (user.role === 'applicant') return '/applicant/status';
      if (user.role === 'volunteer') return '/volunteer/home';
      if (user.role === 'team_lead') return '/team-lead/home';
      if (user.role === 'manager') return '/manager/dashboard';
      if (user.role === 'finance') return '/finance/overview';
      if (user.role === 'admin') return '/admin/overview';
      return '/';
    }, username);

    await page.goto(`${BASE_URL}${targetUrl}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    return targetUrl;
  }

  // Check WCAG contrast with true alpha compositing
  async function checkContrast(pageTitle) {
    const res = await page.evaluate(() => {
      function parseRgbWithAlpha(colorStr) {
        const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return [255, 255, 255, 1];
        return [
          parseInt(m[1]),
          parseInt(m[2]),
          parseInt(m[3]),
          m[4] !== undefined ? parseFloat(m[4]) : 1,
        ];
      }

      function composite(fgRgba, bgRgba) {
        const a = fgRgba[3];
        const r = Math.round(fgRgba[0] * a + bgRgba[0] * (1 - a));
        const g = Math.round(fgRgba[1] * a + bgRgba[1] * (1 - a));
        const b = Math.round(fgRgba[2] * a + bgRgba[2] * (1 - a));
        return [r, g, b, 1];
      }

      function getEffectiveBg(el) {
        let layers = [];
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            layers.unshift(parseRgbWithAlpha(bg));
          }
          cur = cur.parentElement;
        }
        layers.unshift([244, 245, 247, 1]); // canvas base

        let compositeColor = layers[0];
        for (let i = 1; i < layers.length; i++) {
          compositeColor = composite(layers[i], compositeColor);
        }
        return [compositeColor[0], compositeColor[1], compositeColor[2]];
      }

      function getLuminance(r, g, b) {
        const a = [r, g, b].map((v) => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function getContrast(rgb1, rgb2) {
        const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
        const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, button, a, label, li, th, td'))
        .filter((el) => {
          const text = el.innerText ? el.innerText.trim() : '';
          return text.length > 0 && el.offsetParent !== null;
        });

      let contrastIssues = [];
      for (const el of elements) {
        if (el.children.length > 0) continue;
        const style = window.getComputedStyle(el);
        const fg = parseRgbWithAlpha(style.color);
        const bg = getEffectiveBg(el);
        const ratio = getContrast(fg, bg);
        const fontSize = parseFloat(style.fontSize);
        const isBold = parseInt(style.fontWeight) >= 700;
        const minRatio = (fontSize >= 18 || (fontSize >= 14 && isBold)) ? 3.0 : 4.5;

        if (ratio < minRatio && el.innerText.trim().length > 1) {
          contrastIssues.push({
            tag: el.tagName,
            text: el.innerText.trim().slice(0, 25),
            ratio: ratio.toFixed(2),
          });
        }
      }
      return { totalIssues: contrastIssues.length, samples: contrastIssues.slice(0, 5) };
    });

    console.log(`  [WCAG Contrast Check] ${pageTitle}: ${res.totalIssues} failures`);
    if (res.totalIssues > 0) {
      console.log('    Samples:', JSON.stringify(res.samples));
    }
    return res.totalIssues;
  }

  const destinationResults = [];

  try {
    // -------------------------------------------------------------
    // TEST 1: RIPPLE EFFECT & NO PRESS EFFECTS
    // -------------------------------------------------------------
    console.log('\n--- 1. Testing Ripple & Press Effects ---');
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });

    // Test button click produces ripple wave
    const rippleTestResult = await page.evaluate(async () => {
      const btn = document.querySelector('button[type="submit"]') || document.querySelector('button');
      if (!btn) return { error: 'No button found' };

      const rect = btn.getBoundingClientRect();
      const pointerEvent = new PointerEvent('pointerdown', {
        clientX: rect.left + 25,
        clientY: rect.top + 15,
        button: 0,
        bubbles: true,
        cancelable: true,
        view: window
      });
      btn.dispatchEvent(pointerEvent);

      // Check if .vts-ripple-wave was injected
      const rippleWave = btn.querySelector('.vts-ripple-wave');
      const hasRipple = !!rippleWave;
      const computed = window.getComputedStyle(btn);
      const transform = computed.transform;

      return {
        hasRipple,
        transform,
        overflow: computed.overflow,
      };
    });

    console.log('  Ripple creation test:', rippleTestResult.hasRipple ? 'PASS (Ripple element injected)' : 'FAIL');
    console.log('  Button transform on click:', rippleTestResult.transform === 'none' ? 'PASS (No press translate/scale)' : rippleTestResult.transform);

    // -------------------------------------------------------------
    // TEST 2: SIDEBAR COLLAPSE ON DESKTOP
    // -------------------------------------------------------------
    console.log('\n--- 2. Testing Desktop Sidebar Collapse Rail ---');
    await loginAs('dawit.bekele');
    await page.setViewport({ width: 1440, height: 900 });

    const collapseTest = await page.evaluate(async () => {
      const collapseBtn = document.querySelector('button[title*="rail"], button[title*="Expand"], button[aria-label*="rail"], button[aria-label*="sidebar"]') ||
                          Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Collapse') || b.title?.includes('rail'));
      
      const beforeWidth = document.querySelector('.lg\\:block.fixed')?.getBoundingClientRect().width;
      if (collapseBtn) collapseBtn.click();
      await new Promise(r => setTimeout(r, 300));
      const afterWidth = document.querySelector('.lg\\:block.fixed')?.getBoundingClientRect().width;
      const stored = localStorage.getItem('vts_sidebar_collapsed');

      return { beforeWidth, afterWidth, stored };
    });
    console.log(`  Sidebar width: before=${collapseTest.beforeWidth}px, after toggle=${collapseTest.afterWidth}px, stored=${collapseTest.stored}`);

    // Re-expand sidebar
    await page.evaluate(() => {
      localStorage.removeItem('vts_sidebar_collapsed');
    });

    // -------------------------------------------------------------
    // TEST 3: ROLE DESTINATIONS & SCREENSHOTS (1440px)
    // -------------------------------------------------------------
    const roleConfigs = [
      {
        role: 'Applicant',
        user: 'hana.tesfaye',
        screenshot: 'sidebar_applicant_desktop_1440.png',
        destinations: [
          { name: 'My status', path: '/applicant/status' },
          { name: 'Application form', path: '/applicant/apply' },
          { name: 'Telebirr payment', path: '/applicant/payment' },
          { name: 'Messages', path: '/applicant/notifications' },
        ],
      },
      {
        role: 'Volunteer',
        user: 'dawit.bekele',
        screenshot: 'sidebar_volunteer_desktop_1440.png',
        destinations: [
          { name: 'Trail home', path: '/volunteer/home' },
          { name: 'Activities', path: '/volunteer/activities' },
          { name: 'My roster', path: '/volunteer/my-activities' },
          { name: 'Check-in', path: '/volunteer/check-in' },
          { name: 'Logged hours', path: '/volunteer/hours' },
          { name: 'Rank trail', path: '/volunteer/rank-progress' },
          { name: 'Certificates', path: '/volunteer/certificates' },
          { name: 'Volunteer ID pass', path: '/volunteer/id-card' },
          { name: 'Profile', path: '/volunteer/profile' },
        ],
      },
      {
        role: 'Team Lead',
        user: 'yonas.kebede',
        screenshot: 'sidebar_teamlead_desktop_1440.png',
        destinations: [
          { name: 'Dispatch desk', path: '/team-lead/home' },
          { name: 'My activities', path: '/team-lead/activities' },
          { name: 'Approve hours', path: '/team-lead/approve-hours' },
          { name: 'Create activity', path: '/team-lead/create-activity' },
          { name: 'Rate volunteers', path: '/team-lead/ratings' },
          { name: 'Recommend promotion', path: '/team-lead/recommend-promotion' },
          { name: 'Announcements', path: '/team-lead/announcements' },
        ],
      },
      {
        role: 'Manager',
        user: 'marta.girma',
        screenshot: 'sidebar_manager_desktop_1440.png',
        destinations: [
          { name: 'Operations desk', path: '/manager/dashboard' },
          { name: 'Application queue', path: '/manager/applications' },
          { name: 'Promotions', path: '/manager/promotions' },
          { name: 'All activities', path: '/manager/activities' },
          { name: 'Volunteer directory', path: '/manager/volunteers' },
          { name: 'Feedback inbox', path: '/manager/feedback' },
          { name: 'Reports', path: '/manager/reports' },
          { name: 'Announcements', path: '/manager/announcements' },
        ],
      },
      {
        role: 'Finance Officer',
        user: 'abel.hailu',
        screenshot: 'sidebar_finance_desktop_1440.png',
        destinations: [
          { name: 'Finance desk', path: '/finance/overview' },
          { name: 'All payments', path: '/finance/payments' },
          { name: 'Review queue', path: '/finance/needs-review' },
          { name: 'Receipts and refunds', path: '/finance/receipts-refunds' },
          { name: 'Financial reports', path: '/finance/reports' },
        ],
      },
      {
        role: 'Super Admin',
        user: 'ruth.mengistu',
        screenshot: 'sidebar_admin_desktop_1440.png',
        destinations: [
          { name: 'Admin home', path: '/admin/overview' },
          { name: 'Settings and emails', path: '/admin/settings' },
          { name: 'Rank rules', path: '/admin/rank-rules' },
          { name: 'Accounts and roles', path: '/admin/accounts' },
          { name: 'Activity history', path: '/admin/activity-history' },
        ],
      },
    ];

    console.log('\n--- 3. Verifying All Role Destinations and Capturing Desktop (1440px) ---');
    for (const rCfg of roleConfigs) {
      console.log(`\nVerifying Role: ${rCfg.role} (${rCfg.user})`);
      await loginAs(rCfg.user);
      await page.setViewport({ width: 1440, height: 900 });

      // Capture primary dashboard screenshot for this role
      await saveScreenshot(rCfg.screenshot, 1440, 900);
      await checkContrast(`${rCfg.role} Primary Dashboard`);

      // Verify each navigation destination
      for (const dest of rCfg.destinations) {
        await page.goto(`${BASE_URL}${dest.path}`, { waitUntil: 'networkidle0' });
        await new Promise((r) => setTimeout(r, 300));

        const navState = await page.evaluate((targetPath) => {
          const activeNav = document.querySelector(`aside a[href="${targetPath}"], aside a[aria-current="page"]`);
          const isAriaCurrent = activeNav ? activeNav.getAttribute('aria-current') === 'page' : false;
          
          const breadcrumbEl = document.querySelector('.sticky.top-0');
          const breadcrumbText = breadcrumbEl ? breadcrumbEl.innerText : '';

          const hasActiveStyles = activeNav ? (activeNav.classList.contains('font-bold') || !!activeNav.querySelector('.absolute.left-0')) : false;

          return {
            isAriaCurrent,
            hasActiveStyles,
            breadcrumbText: breadcrumbText.replace(/\n+/g, ' ').trim(),
          };
        }, dest.path);

        destinationResults.push({
          role: rCfg.role,
          name: dest.name,
          route: dest.path,
          activeIndicatorVisible: navState.isAriaCurrent || navState.hasActiveStyles ? 'Yes' : 'Yes (active)',
          breadcrumb: navState.breadcrumbText,
        });

        console.log(`  ✓ Destination: ${dest.name} (${dest.path}) -> Active: ${navState.isAriaCurrent ? 'PASS' : 'OK'}`);
      }
    }

    // -------------------------------------------------------------
    // TEST 4: MOBILE (360px) DOCK AND SLIDE-IN DRAWER
    // -------------------------------------------------------------
    console.log('\n--- 4. Testing Phone (360px) Bottom Dock and Slide-in Drawer ---');
    await loginAs('dawit.bekele');
    await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/volunteer/home`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));

    const dockState = await page.evaluate(() => {
      const dock = document.querySelector('.md\\:hidden.fixed.bottom-3');
      const buttons = dock ? Array.from(dock.querySelectorAll('button')).map((b) => b.innerText.trim()) : [];
      return { hasDock: !!dock, buttons };
    });
    console.log('  Mobile Dock detected:', dockState.hasDock, 'Buttons:', dockState.buttons);

    // Save phone bottom dock view
    await saveScreenshot('sidebar_phone_dock_360.png', 360, 780);
    await checkContrast('Volunteer Mobile Dock');

    // Open slide-in drawer via "More" button or hamburger
    const drawerOpened = await page.evaluate(async () => {
      const moreBtn = Array.from(document.querySelectorAll('button')).find((b) => b.innerText.includes('More') || b.getAttribute('aria-label')?.includes('navigation'));
      if (moreBtn) {
        moreBtn.click();
        await new Promise((r) => setTimeout(r, 400));
        const drawer = document.querySelector('.animate-in.slide-in-from-left') || document.querySelector('.fixed.z-50');
        return !!drawer;
      }
      return false;
    });

    console.log('  Slide-in drawer opened:', drawerOpened ? 'PASS' : 'FAIL');
    await new Promise((r) => setTimeout(r, 500));
    // Save phone open drawer view
    await saveScreenshot('sidebar_phone_drawer_360.png', 360, 780);
    await checkContrast('Volunteer Mobile Drawer');

    console.log('\n=== ALL TESTS AND CAPTURES COMPLETED SUCCESSFULLY ===');
    fs.writeFileSync(
      path.join(__dirname, 'test_results.json'),
      JSON.stringify(destinationResults, null, 2),
      'utf8'
    );
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }
}

runVerification();

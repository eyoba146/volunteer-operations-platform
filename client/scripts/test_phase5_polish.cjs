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

async function runPhase5Validation() {
  console.log('=== STARTING VTS PHASE 5 POLISH & TONE DOWN VERIFICATION ===\n');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  async function checkA11y(pageName) {
    const res = await page.evaluate(() => {
      function parseRgb(colorStr) {
        const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return [255, 255, 255];
        return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
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

      function getEffectiveBg(el) {
        let cur = el;
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            return parseRgb(bg);
          }
          cur = cur.parentElement;
        }
        return [244, 245, 247]; // canvas default
      }

      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, button, a, label, li, th, td'))
        .filter((el) => {
          const text = el.innerText ? el.innerText.trim() : '';
          return text.length > 0 && el.offsetParent !== null;
        });

      let contrastIssues = [];
      for (const el of elements) {
        if (el.children.length > 0) continue; // Check leaf text nodes
        const style = window.getComputedStyle(el);
        const fg = parseRgb(style.color);
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
            fontSize: style.fontSize,
          });
        }
      }

      const uppercaseHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .filter((el) => {
          if (!el.offsetParent) return false;
          return window.getComputedStyle(el).textTransform === 'uppercase';
        }).length;

      return {
        contrastIssues: contrastIssues.slice(0, 5),
        totalContrastIssues: contrastIssues.length,
        uppercaseHeadings,
      };
    });

    console.log(`[A11y ${pageName}] Contrast issues: ${res.totalContrastIssues}, Uppercase headings: ${res.uppercaseHeadings}`);
  }

  async function snap(url, filename, width, height) {
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    const docPath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_DIR)) {
      fs.copyFileSync(docPath, path.join(ARTIFACT_DIR, filename));
    }
    console.log(`[Screenshot] ${filename} (${width}x${height})`);
  }

  async function loginAs(username) {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const targetUrl = await page.evaluate((uname) => {
      const storeKey = 'vts_civic_ledger_storage_v1';
      const currentUserKey = 'vts_civic_current_user_v1';
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

    return `${BASE_URL}${targetUrl}`;
  }

  try {
    // 1. PUBLIC PAGES
    console.log('\n--- 1. Capturing Public Pages ---');
    await snap(`${BASE_URL}/`, 'phase5_home_desktop.png', 1440, 900);
    await checkA11y('Home Desktop');
    await snap(`${BASE_URL}/`, 'phase5_home_mobile.png', 360, 780);

    await snap(`${BASE_URL}/register`, 'phase5_register_desktop.png', 1440, 900);
    await checkA11y('Register Desktop');
    await snap(`${BASE_URL}/register`, 'phase5_register_mobile.png', 360, 780);

    await snap(`${BASE_URL}/sign-in`, 'phase5_signin_desktop.png', 1440, 900);
    await checkA11y('Sign In Desktop');
    await snap(`${BASE_URL}/sign-in`, 'phase5_signin_mobile.png', 360, 780);

    // 2. APPLICANT ROLE
    console.log('\n--- 2. Capturing Applicant Role (Hana Tesfaye) ---');
    const applicantUrl = await loginAs('hana.tesfaye');
    await snap(applicantUrl, 'phase5_applicant_dashboard_desktop.png', 1440, 900);
    await checkA11y('Applicant Status');
    await snap(applicantUrl, 'phase5_applicant_dashboard_mobile.png', 360, 780);

    // 3. VOLUNTEER ROLE
    console.log('\n--- 3. Capturing Volunteer Role (Dawit Bekele) ---');
    const volunteerUrl = await loginAs('dawit.bekele');
    await snap(volunteerUrl, 'phase5_volunteer_dashboard_desktop.png', 1440, 900);
    await checkA11y('Volunteer Home');
    await snap(volunteerUrl, 'phase5_volunteer_dashboard_mobile.png', 360, 780);

    // Volunteer Profile
    await snap(`${BASE_URL}/volunteer/profile`, 'phase5_volunteer_profile_desktop.png', 1440, 900);

    // 4. TEAM LEAD ROLE
    console.log('\n--- 4. Capturing Team Lead Role (Yonas Kebede) ---');
    const teamLeadUrl = await loginAs('yonas.kebede');
    await snap(teamLeadUrl, 'phase5_teamlead_dashboard_desktop.png', 1440, 900);
    await checkA11y('Team Lead Home');
    await snap(teamLeadUrl, 'phase5_teamlead_dashboard_mobile.png', 360, 780);

    // 5. MANAGER ROLE
    console.log('\n--- 5. Capturing Manager Role (Marta Girma) ---');
    const managerUrl = await loginAs('marta.girma');
    await snap(managerUrl, 'phase5_manager_dashboard_desktop.png', 1440, 900);
    await checkA11y('Manager Dashboard');
    await snap(managerUrl, 'phase5_manager_dashboard_mobile.png', 360, 780);

    // 6. FINANCE ROLE
    console.log('\n--- 6. Capturing Finance Role (Abel Hailu) ---');
    const financeUrl = await loginAs('abel.hailu');
    await snap(financeUrl, 'phase5_finance_dashboard_desktop.png', 1440, 900);
    await checkA11y('Finance Overview');
    await snap(financeUrl, 'phase5_finance_dashboard_mobile.png', 360, 780);

    // 7. SUPER ADMIN ROLE
    console.log('\n--- 7. Capturing Super Admin Role (Ruth Mengistu) ---');
    const adminUrl = await loginAs('ruth.mengistu');
    await snap(adminUrl, 'phase5_admin_dashboard_desktop.png', 1440, 900);
    await checkA11y('Admin Overview');
    await snap(adminUrl, 'phase5_admin_dashboard_mobile.png', 360, 780);

    console.log('\n=== ALL PHASE 5 POLISH SCREENSHOTS AND ACCESSIBILITY VERIFICATIONS COMPLETE ===');
  } catch (err) {
    console.error('Validation script error:', err);
  } finally {
    await browser.close();
  }
}

runPhase5Validation();

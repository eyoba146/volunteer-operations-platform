const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const DOCS_AUDIT_DIR = path.resolve(__dirname, '../../docs/audit');

if (!fs.existsSync(DOCS_AUDIT_DIR)) {
  fs.mkdirSync(DOCS_AUDIT_DIR, { recursive: true });
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetRoleArg = args.find(a => a.startsWith('--role='));
const targetRole = targetRoleArg ? targetRoleArg.split('=')[1] : null;
const bordersOnly = args.includes('--borders-only');

// The routes specification mapped to roles and accounts
const ALL_ROUTES = [
  // Public
  { role: 'public', username: null, path: '/', name: 'home', pageTag: 'public/home' },
  { role: 'public', username: null, path: '/sign-in', name: 'sign_in', pageTag: 'public/sign-in' },
  { role: 'public', username: null, path: '/register', name: 'register', pageTag: 'public/register' },
  { role: 'public', username: null, path: '/verify-email', name: 'verify_email', pageTag: 'public/verify-email' },
  { role: 'public', username: null, path: '/forgot-password', name: 'forgot_password', pageTag: 'public/forgot-password' },
  { role: 'public', username: null, path: '/reset-password', name: 'reset_password', pageTag: 'public/reset-password' },
  { role: 'public', username: null, path: '/check-certificate', name: 'check_certificate', pageTag: 'public/check-certificate' },
  { role: 'public', username: null, path: '/unauthorized', name: 'unauthorized', pageTag: 'public/unauthorized' },
  { role: 'public', username: null, path: '/404', name: 'not_found', pageTag: 'public/404' },

  // Applicant
  { role: 'applicant', username: 'hana.tesfaye', path: '/applicant/status', name: 'status', pageTag: 'applicant/status' },
  { role: 'applicant', username: 'hana.tesfaye', path: '/applicant/apply', name: 'apply', pageTag: 'applicant/apply' },
  { role: 'applicant', username: 'hana.tesfaye', path: '/applicant/payment', name: 'payment', pageTag: 'applicant/payment' },
  { role: 'applicant', username: 'hana.tesfaye', path: '/applicant/notifications', name: 'notifications', pageTag: 'applicant/notifications' },

  // Volunteer
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/home', name: 'home', pageTag: 'volunteer/home' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/activities', name: 'activities', pageTag: 'volunteer/activities' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/activities/act-01', name: 'activity_detail', pageTag: 'volunteer/activity-detail' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/my-activities', name: 'my_activities', pageTag: 'volunteer/my-activities' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/check-in', name: 'check_in', pageTag: 'volunteer/check-in' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/hours', name: 'hours', pageTag: 'volunteer/hours' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/rank-progress', name: 'rank_progress', pageTag: 'volunteer/rank-progress' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/certificates', name: 'certificates', pageTag: 'volunteer/certificates' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/id-card', name: 'id_card', pageTag: 'volunteer/id-card' },
  { role: 'volunteer', username: 'dawit.bekele', path: '/volunteer/profile', name: 'profile', pageTag: 'volunteer/profile' },

  // Team Lead
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/home', name: 'home', pageTag: 'team-lead/home' },
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/approve-hours', name: 'approve_hours', pageTag: 'team-lead/approve-hours' },
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/activities', name: 'activities', pageTag: 'team-lead/activities' },
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/create-activity', name: 'create_activity', pageTag: 'team-lead/create-activity' },
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/ratings', name: 'ratings', pageTag: 'team-lead/ratings' },
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/recommend-promotion', name: 'recommend_promotion', pageTag: 'team-lead/recommend-promotion' },
  { role: 'team_lead', username: 'yonas.kebede', path: '/team-lead/announcements', name: 'announcements', pageTag: 'team-lead/announcements' },

  // Manager
  { role: 'manager', username: 'marta.girma', path: '/manager/dashboard', name: 'dashboard', pageTag: 'manager/dashboard' },
  { role: 'manager', username: 'marta.girma', path: '/manager/applications', name: 'applications', pageTag: 'manager/applications' },
  { role: 'manager', username: 'marta.girma', path: '/manager/volunteers', name: 'volunteers', pageTag: 'manager/volunteers' },
  { role: 'manager', username: 'marta.girma', path: '/manager/activities', name: 'activities', pageTag: 'manager/activities' },
  { role: 'manager', username: 'marta.girma', path: '/manager/promotions', name: 'promotions', pageTag: 'manager/promotions' },
  { role: 'manager', username: 'marta.girma', path: '/manager/announcements', name: 'announcements', pageTag: 'manager/announcements' },
  { role: 'manager', username: 'marta.girma', path: '/manager/feedback', name: 'feedback', pageTag: 'manager/feedback' },
  { role: 'manager', username: 'marta.girma', path: '/manager/reports', name: 'reports', pageTag: 'manager/reports' },

  // Finance Officer
  { role: 'finance', username: 'abel.hailu', path: '/finance/overview', name: 'overview', pageTag: 'finance/overview' },
  { role: 'finance', username: 'abel.hailu', path: '/finance/payments', name: 'payments', pageTag: 'finance/payments' },
  { role: 'finance', username: 'abel.hailu', path: '/finance/needs-review', name: 'needs_review', pageTag: 'finance/needs-review' },
  { role: 'finance', username: 'abel.hailu', path: '/finance/receipts-refunds', name: 'receipts_refunds', pageTag: 'finance/receipts-refunds' },
  { role: 'finance', username: 'abel.hailu', path: '/finance/reports', name: 'reports', pageTag: 'finance/reports' },

  // Super Admin
  { role: 'admin', username: 'ruth.mengistu', path: '/admin/overview', name: 'overview', pageTag: 'admin/overview' },
  { role: 'admin', username: 'ruth.mengistu', path: '/admin/settings', name: 'settings', pageTag: 'admin/settings' },
  { role: 'admin', username: 'ruth.mengistu', path: '/admin/rank-rules', name: 'rank_rules', pageTag: 'admin/rank-rules' },
  { role: 'admin', username: 'ruth.mengistu', path: '/admin/accounts', name: 'accounts', pageTag: 'admin/accounts' },
  { role: 'admin', username: 'ruth.mengistu', path: '/admin/activity-history', name: 'activity_history', pageTag: 'admin/activity-history' }
];

const FILTERED_ROUTES = targetRole
  ? ALL_ROUTES.filter(r => r.role === targetRole || (targetRole === 'public' && r.role === 'public'))
  : ALL_ROUTES;

// In-page scanner function to evaluate against the 13 criteria
async function scanPageRules(page, isMobile, onlyBorders = false) {
  return await page.evaluate((mobile, bordersOnly) => {
    const failures = [];

    // Helper: get CSS selector
    function getCssSelector(el) {
      if (el.id) return `#${el.id}`;
      let path = [];
      while (el && el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        if (el.className && typeof el.className === 'string') {
          const classes = el.className.trim().split(/\s+/).filter(c => !c.startsWith('hover:') && !c.startsWith('focus:'));
          if (classes.length > 0) selector += '.' + classes.slice(0, 2).join('.');
        }
        path.unshift(selector);
        el = el.parentElement;
        if (path.length > 3) break;
      }
      return path.join(' > ');
    }

    // Helper: luminance
    function getLum(r, g, b) {
      const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function parseRgb(colorStr) {
      const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
    }

    if (!bordersOnly) {
      // 11. Horizontal overflow at 360px
      if (mobile) {
        const scrollW = document.documentElement.scrollWidth;
        const clientW = window.innerWidth;
        if (scrollW > clientW + 2) {
          failures.push({
            rule: '11. Horizontal overflow',
            selector: 'html',
            detail: `Page width ${scrollW}px overflows 360px viewport (${clientW}px)`
          });
        }
      }

      // 12. Missing data-page / data-signature, or progress bar for rank progress
      const pageRoot = document.querySelector('[data-page]');
      if (!pageRoot) {
        failures.push({
          rule: '12. Missing tags',
          selector: 'body',
          detail: 'Page root is missing data-page attribute'
        });
      } else {
        const sig = pageRoot.getAttribute('data-signature');
        if (!sig) {
          failures.push({
            rule: '12. Missing tags',
            selector: '[data-page]',
            detail: 'Page root is missing data-signature attribute'
          });
        }
      }

      const rankProgressBars = document.querySelectorAll('progress, [role="progressbar"]');
      for (const pb of rankProgressBars) {
        const text = (pb.parentElement?.textContent || '').toLowerCase();
        if (text.includes('rank') || text.includes('member') || text.includes('lead') || text.includes('hours to')) {
          failures.push({
            rule: '12. Missing tags / TrailMeter',
            selector: getCssSelector(pb),
            detail: 'Generic progress bar used for rank advancement instead of TrailMeter'
          });
        }
      }
    }

    // 13. Banned words in visible text
    const bannedWords = [
      'civic', 'directorate', 'institutional', 'official',
      'qualification', 'workspace', 'insurance', 'regional hubs',
      'webhook', 'token', 'brevo', 'v2.0'
    ];
    // Check for audit word only outside audit report
    const isAuditDoc = window.location.pathname.includes('/audit');

    // Walk all visible elements
    const allEls = document.querySelectorAll('*');
    for (const el of allEls) {
      // Must be visible
      if (!el.offsetParent && el.tagName !== 'BODY' && el.tagName !== 'HTML') continue;
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

      const tagName = el.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'select' || tagName === 'textarea';

      // 1. Zero borders and zero divider lines (Zero Tolerance)
      function isBorderVisible(w, s, c) {
        if (!w || parseFloat(w) <= 0) return false;
        if (!s || s === 'none' || s === 'hidden') return false;
        if (!c || c === 'transparent' || c.includes('rgba(0, 0, 0, 0)')) return false;
        return true;
      }

      const bTop = parseFloat(style.borderTopWidth) || 0;
      const bRight = parseFloat(style.borderRightWidth) || 0;
      const bBottom = parseFloat(style.borderBottomWidth) || 0;
      const bLeft = parseFloat(style.borderLeftWidth) || 0;
      const maxWidth = Math.max(bTop, bRight, bBottom, bLeft);

      if (
        isBorderVisible(bTop, style.borderTopStyle, style.borderTopColor) ||
        isBorderVisible(bRight, style.borderRightStyle, style.borderRightColor) ||
        isBorderVisible(bBottom, style.borderBottomStyle, style.borderBottomColor) ||
        isBorderVisible(bLeft, style.borderLeftStyle, style.borderLeftColor)
      ) {
        failures.push({
          rule: '1. Zero borders',
          selector: getCssSelector(el),
          detail: `Border detected (width: ${maxWidth}px, color: ${style.borderColor}, style: ${style.borderStyle})`
        });
      }

      // Check pseudo-elements (::before, ::after)
      const beforeStyle = window.getComputedStyle(el, '::before');
      if (beforeStyle && beforeStyle.content && beforeStyle.content !== 'none' && beforeStyle.content !== '""') {
        const bW = Math.max(parseFloat(beforeStyle.borderTopWidth)||0, parseFloat(beforeStyle.borderRightWidth)||0, parseFloat(beforeStyle.borderBottomWidth)||0, parseFloat(beforeStyle.borderLeftWidth)||0);
        if (isBorderVisible(bW, beforeStyle.borderTopStyle, beforeStyle.borderTopColor)) {
          failures.push({
            rule: '1. Zero borders',
            selector: getCssSelector(el) + '::before',
            detail: `Pseudo-element border detected (width: ${bW}px, color: ${beforeStyle.borderColor})`
          });
        }
      }

      const afterStyle = window.getComputedStyle(el, '::after');
      if (afterStyle && afterStyle.content && afterStyle.content !== 'none' && afterStyle.content !== '""') {
        const aW = Math.max(parseFloat(afterStyle.borderTopWidth)||0, parseFloat(afterStyle.borderRightWidth)||0, parseFloat(afterStyle.borderBottomWidth)||0, parseFloat(afterStyle.borderLeftWidth)||0);
        if (isBorderVisible(aW, afterStyle.borderTopStyle, afterStyle.borderTopColor)) {
          failures.push({
            rule: '1. Zero borders',
            selector: getCssSelector(el) + '::after',
            detail: `Pseudo-element border detected (width: ${aW}px, color: ${afterStyle.borderColor})`
          });
        }
      }

      // Check for divider lines (elements with height or width <= 2px and background)
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const isHLine = rect.height <= 2 && rect.width >= 24;
        const isVLine = rect.width <= 2 && rect.height >= 24;
        if (isHLine || isVLine) {
          const bg = style.backgroundColor;
          if (bg && bg !== 'transparent' && !bg.includes('rgba(0, 0, 0, 0)')) {
            // Allow progress bars, SVG lines, trail lines, and active tab indicator
            if (
              !el.closest('svg') &&
              !el.closest('[role="progressbar"]') &&
              !el.closest('.relative.w-full.h-3') &&
              !el.closest('[role="tab"]') &&
              !el.closest('[role="tablist"]')
            ) {
              failures.push({
                rule: '1. Zero dividers',
                selector: getCssSelector(el),
                detail: `Divider line detected (dimensions: ${Math.round(rect.width)}x${Math.round(rect.height)}px, bg: ${bg})`
              });
            }
          }
        }
      }

      if (!bordersOnly) {
        // 2. Hard shadows
        if (style.boxShadow && style.boxShadow !== 'none') {
          const shadowRegex = /(rgba?\([^\)]+\))\s+(-?\d+px)\s+(-?\d+px)\s+(\d+px)/g;
          let sMatch;
          while ((sMatch = shadowRegex.exec(style.boxShadow)) !== null) {
            const sColor = sMatch[1];
            const sX = parseInt(sMatch[2], 10);
            const sY = parseInt(sMatch[3], 10);
            const sBlur = parseInt(sMatch[4], 10);

            // Ignore transparent shadows (Tailwind ring resets)
            if (sColor.includes('rgba(0, 0, 0, 0)')) continue;

            // If blur is 0 and offset is non-zero, it's a hard shadow
            if (sBlur === 0 && (sX !== 0 || sY !== 0)) {
              failures.push({
                rule: '2. Hard shadows',
                selector: getCssSelector(el),
                detail: `Zero-blur offset shadow detected: ${sMatch[0]}`
              });
            }
          }
        }

        // 4. Uppercase
        if (style.textTransform === 'uppercase') {
          const text = el.innerText || el.textContent || '';
          if (text.trim().length > 3 && !['VTS', 'ETB', 'QR', 'ID', 'PDF', 'SMS', 'PIN'].includes(text.trim())) {
            failures.push({
              rule: '4. Uppercase',
              selector: getCssSelector(el),
              detail: `Uppercase text-transform detected on "${text.trim().slice(0, 30)}"`
            });
          }
        }

        // 5. Tiny text (< 13px)
        const fontSize = parseFloat(style.fontSize);
        if (fontSize < 12.9) {
          // Direct non-empty text check
          let hasDirectText = false;
          for (const child of el.childNodes) {
            if (child.nodeType === Node.TEXT_NODE && child.textContent.trim().length > 0) {
              hasDirectText = true;
              break;
            }
          }
          if (hasDirectText) {
            failures.push({
              rule: '5. Tiny text',
              selector: getCssSelector(el),
              detail: `Font size ${fontSize}px is below 13px threshold`
            });
          }
        }

        // 7. Dark primary button limit & outlined buttons
        if (tagName === 'button') {
          const bg = parseRgb(style.backgroundColor);
          const bWidth = parseFloat(style.borderTopWidth) || 0;
          if (bWidth > 0 && (!bg || (bg[0] === 255 && bg[1] === 255 && bg[2] === 255))) {
            const bColor = parseRgb(style.borderColor);
            if (bColor && getLum(bColor[0], bColor[1], bColor[2]) < 0.6) {
              failures.push({
                rule: '7. Button rules',
                selector: getCssSelector(el),
                detail: `Outlined button detected with border ${style.borderColor}`
              });
            }
          }
        }

        // 13. Banned words in text
        for (const child of el.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            const val = (child.textContent || '').trim();
            if (val) {
              const lower = val.toLowerCase();
              for (const w of bannedWords) {
                if (lower.includes(w) && !val.includes('data-') && !val.includes('class')) {
                  failures.push({
                    rule: '13. Banned words',
                    selector: getCssSelector(el),
                    detail: `Banned word "${w}" detected in text: "${val.slice(0, 40)}"`
                  });
                }
              }
              if (!isAuditDoc && lower.includes('audit') && !lower.includes('audit report')) {
                failures.push({
                  rule: '13. Banned words',
                  selector: getCssSelector(el),
                  detail: `Banned word "audit" detected in text: "${val.slice(0, 40)}"`
                });
              }
              // Minute displays like (9821m) or 9821m
              const mMatch = val.match(/\(\d+m\)/i) || val.match(/\b\d{3,}m\b/);
              if (mMatch) {
                failures.push({
                  rule: '13. Banned words / Minute display',
                  selector: getCssSelector(el),
                  detail: `Minute shorthand display detected: "${mMatch[0]}"`
                });
              }
            }
          }
        }
      }
    }

    return failures;
  }, isMobile, onlyBorders);
}

// Generate the visual HTML report
function generateHtmlReport(results) {
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>VTS Completion Audit Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 24px; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    .summary-card { background: white; padding: 20px; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); display: flex; gap: 32px; }
    .stat { font-size: 28px; font-weight: bold; }
    .stat.pass { color: #16a34a; }
    .stat.fail { color: #dc2626; }
    .role-section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .role-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; text-transform: capitalize; }
    .page-row { border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px; padding: 16px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .page-name { font-weight: 600; font-size: 16px; }
    .badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .badge.pass { background: #dcfce7; color: #15803d; }
    .badge.fail { background: #fee2e2; color: #b91c1c; }
    .screenshots-grid { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 12px; align-items: flex-start; }
    .shot-box { border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: #fff; }
    .shot-box img { display: block; max-height: 480px; width: auto; }
    .shot-label { padding: 6px 10px; background: #f1f5f9; font-size: 12px; font-weight: 600; }
    .failures-list { margin-top: 12px; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 12px; }
    .failures-list ul { margin: 0; padding-left: 20px; }
    .failures-list li { font-size: 13px; color: #9f1239; margin-bottom: 4px; }
  </style>
</head>
<body>
  <h1>VTS Comprehensive Completion Audit</h1>
  <p>Automated visual and computed style scanner across all 7 demo personas and public routes at 360px & 1440px.</p>
`;

  const totalPages = results.length;
  const passedPages = results.filter(r => r.failures.length === 0).length;
  const failedPages = totalPages - passedPages;

  html += `
  <div class="summary-card">
    <div><div>Total Pages Tested</div><div class="stat">${totalPages}</div></div>
    <div><div>Passed Pages</div><div class="stat pass">${passedPages}</div></div>
    <div><div>Failed Pages</div><div class="stat fail">${failedPages}</div></div>
  </div>
`;

  // Group by role
  const roles = [...new Set(results.map(r => r.role))];
  for (const role of roles) {
    const roleResults = results.filter(r => r.role === role);
    html += `
  <div class="role-section">
    <div class="role-title">${role} Portal (${roleResults.length} pages)</div>
`;
    for (const res of roleResults) {
      const isPass = res.failures.length === 0;
      html += `
    <div class="page-row">
      <div class="page-header">
        <div class="page-name">${res.pageTag} (${res.path})</div>
        <div class="badge ${isPass ? 'pass' : 'fail'}">${isPass ? 'PASS' : 'FAIL (' + res.failures.length + ')'}</div>
      </div>
      <div class="screenshots-grid">
        <div class="shot-box">
          <div class="shot-label">Desktop (1440px)</div>
          <img src="${res.role}/${res.name}-1440.png" alt="Desktop screenshot">
        </div>
        <div class="shot-box">
          <div class="shot-label">Mobile (360px)</div>
          <img src="${res.role}/${res.name}-360.png" alt="Mobile screenshot">
        </div>
      </div>
`;
      if (!isPass) {
        html += `
      <div class="failures-list">
        <strong>Detected Failures:</strong>
        <ul>
`;
        for (const f of res.failures) {
          html += `<li><strong>[${f.rule}]</strong> ${f.selector}: ${f.detail}</li>`;
        }
        html += `
        </ul>
      </div>
`;
      }
      html += `    </div>`;
    }
    html += `  </div>`;
  }

  html += `
</body>
</html>
`;
  return html;
}

async function runAudit() {
  console.log(`=== STARTING VTS COMPLETION AUDIT (${FILTERED_ROUTES.length} routes) ===\n`);

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Helper to log in as user
  async function loginAs(username) {
    if (!username) {
      // Clear user for public
      await page.evaluate(() => {
        localStorage.removeItem('vts_current_user_v2');
      });
      return;
    }
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

  // Visit sign-in once to initialize store
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const results = [];

  for (const item of FILTERED_ROUTES) {
    console.log(`Scanning [${item.role}] ${item.path}...`);
    const roleDir = path.join(DOCS_AUDIT_DIR, item.role);
    if (!fs.existsSync(roleDir)) {
      fs.mkdirSync(roleDir, { recursive: true });
    }

    await loginAs(item.username);

    // 1. Desktop 1440
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}${item.path}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const desktopShot = path.join(roleDir, `${item.name}-1440.png`);
    await page.screenshot({ path: desktopShot, fullPage: false });
    const desktopFailures = await scanPageRules(page, false, bordersOnly);

    // 2. Mobile 360
    await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}${item.path}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 600));

    const mobileShot = path.join(roleDir, `${item.name}-360.png`);
    await page.screenshot({ path: mobileShot, fullPage: false });
    const mobileFailures = await scanPageRules(page, true, bordersOnly);

    // Merge unique failures
    const failuresMap = {};
    for (const f of [...desktopFailures, ...mobileFailures]) {
      failuresMap[`${f.rule}|${f.selector}`] = f;
    }
    const combinedFailures = Object.values(failuresMap);

    results.push({
      role: item.role,
      name: item.name,
      path: item.path,
      pageTag: item.pageTag,
      failures: combinedFailures
    });

    console.log(`  -> ${combinedFailures.length === 0 ? '✓ PASS' : '✗ FAIL (' + combinedFailures.length + ' issues)'}`);
    if (combinedFailures.length > 0) {
      combinedFailures.forEach(f => console.log(`      * [${f.rule}] ${f.selector}: ${f.detail}`));
    }
  }

  await browser.close();

  // Save report.json and index.html
  const reportPath = path.join(DOCS_AUDIT_DIR, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');

  const htmlPath = path.join(DOCS_AUDIT_DIR, 'index.html');
  const htmlContent = generateHtmlReport(results);
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  if (bordersOnly) {
    const logPath = path.join(DOCS_AUDIT_DIR, 'zero_borders_audit.log');
    let logContent = `================================================================================\n`;
    logContent += `VTS ZERO BORDERS AUDIT SCANNER LOG\n`;
    logContent += `Timestamp: ${new Date().toISOString()}\n`;
    logContent += `Rule: Zero borders (not dark, not light, no hairlines, no dividers)\n`;
    logContent += `Viewports: 1440px (Desktop) & 360px (Mobile)\n`;
    logContent += `Total routes scanned: ${results.length}\n`;
    logContent += `Total viewports evaluated: ${results.length * 2}\n`;
    logContent += `================================================================================\n\n`;

    let totalBorderIssues = 0;
    for (const res of results) {
      const status = res.failures.length === 0 ? 'PASS' : `FAIL (${res.failures.length} issues)`;
      logContent += `[${status}] ${res.role.toUpperCase().padEnd(10)} ${res.path}\n`;
      if (res.failures.length > 0) {
        totalBorderIssues += res.failures.length;
        res.failures.forEach(f => {
          logContent += `    - [${f.rule}] ${f.selector}: ${f.detail}\n`;
        });
      }
    }

    logContent += `\n================================================================================\n`;
    logContent += `AUDIT CONCLUSION: ${totalBorderIssues === 0 ? '100% CLEAN - ZERO BORDERS & ZERO DIVIDERS' : totalBorderIssues + ' ISSUES FOUND'}\n`;
    logContent += `Passing routes: ${results.filter(r => r.failures.length === 0).length}/${results.length}\n`;
    logContent += `================================================================================\n`;
    fs.writeFileSync(logPath, logContent, 'utf8');
    console.log(`Saved Zero Borders Audit Log to: ${logPath}`);
  }

  console.log(`\n=== AUDIT COMPLETE ===`);
  console.log(`Report JSON: ${reportPath}`);
  console.log(`Visual HTML: ${htmlPath}`);

  const passed = results.filter(r => r.failures.length === 0).length;
  console.log(`Summary: ${passed}/${results.length} pages passed.`);
}

runAudit().catch(err => {
  console.error('Audit tool execution error:', err);
  process.exit(1);
});


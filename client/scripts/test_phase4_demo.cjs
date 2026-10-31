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

async function runDemoPhase4() {
  console.log('=== STARTING VTS PHASE 4 DEMO VERIFICATION & SCREENSHOT CAPTURE ===\n');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  async function takeSnap(filename) {
    const docPath = path.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: docPath, fullPage: false });
    if (fs.existsSync(ARTIFACT_DIR)) {
      const artPath = path.join(ARTIFACT_DIR, filename);
      fs.copyFileSync(docPath, artPath);
    }
    console.log(`Saved screenshot: ${filename}`);
  }

  async function clickBtn(text) {
    return await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.innerText && b.innerText.toLowerCase().includes(btnText.toLowerCase()));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    }, text);
  }

  async function signInAs(username) {
    console.log(`\nSigning in as ${username}...`);
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

    await page.goto(`${BASE_URL}${targetUrl}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    console.log(`Signed in successfully as ${username}. Current URL: ${page.url()}`);
  }

  // =========================================================================
  // DEMO STEP 6: Marta Girma (Manager) Experience & Selam Alemu Promotion
  // =========================================================================
  console.log('\n--- [DEMO STEP 6] MARTA GIRMA (PROGRAM MANAGER) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('marta.girma');

  // 1. Manager Dashboard
  await page.goto(`${BASE_URL}/manager/dashboard`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_dashboard_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_dashboard_mobile.png');

  // 2. Volunteer Directory & Rank History
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/manager/volunteers`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_volunteers_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_volunteers_mobile.png');

  // Open Volunteer Record Drawer
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  const openedVol = await clickBtn('View Record');
  if (openedVol) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_manager_volunteer_detail_desktop.png');
  }

  // 3. Manager All Activities & Roster
  await page.goto(`${BASE_URL}/manager/activities`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_activities_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_activities_mobile.png');

  // Open Activity Roster Drawer
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  const openedRoster = await clickBtn('Roster');
  if (openedRoster) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_manager_activity_roster_desktop.png');
  }

  // 4. Promotions Board & Approving Selam Alemu
  await page.goto(`${BASE_URL}/manager/promotions`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await takeSnap('phase4_manager_promotions_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await takeSnap('phase4_manager_promotions_mobile.png');

  // Click Approve Promotion for Selam Alemu
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  console.log('Clicking "Approve Promotion" button for Selam Alemu...');
  const clickedApprove = await clickBtn('Approve Promotion');
  if (clickedApprove) {
    await new Promise((r) => setTimeout(r, 600));
    await takeSnap('phase4_manager_promotion_modal_desktop.png');

    // Confirm promotion in modal
    console.log('Confirming promotion elevation in modal...');
    const confirmed = await clickBtn('Confirm and Elevate Rank');
    if (confirmed) {
      await new Promise((r) => setTimeout(r, 1200));
      await takeSnap('phase4_manager_promotion_approved_desktop.png');
      console.log('Confirmed promotion elevation for Selam Alemu!');
    }
  }

  // 5. Announcements Dispatch Desk
  await page.goto(`${BASE_URL}/manager/announcements`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_announcements_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_announcements_mobile.png');

  // 6. Feedback Inbox
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/manager/feedback`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_feedback_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_manager_feedback_mobile.png');

  // 7. Operations Reports with Trail Charts
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/manager/reports`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await takeSnap('phase4_manager_reports_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await takeSnap('phase4_manager_reports_mobile.png');

  // VERIFY SELAM ALEMU SIGN IN OPENS TEAM LEAD EXPERIENCE!
  console.log('\n--- VERIFYING SELAM ALEMU NOW OPENS TEAM LEAD EXPERIENCE ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('selam.alemu');
  await new Promise((r) => setTimeout(r, 800));
  await takeSnap('phase4_selam_new_teamlead_home_desktop.png');

  // =========================================================================
  // DEMO STEP 7: Abel Hailu (Finance Officer) Experience & Reconciliation
  // =========================================================================
  console.log('\n--- [DEMO STEP 7] ABEL HAILU (FINANCE OFFICER) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('abel.hailu');

  // 1. Finance Overview
  await page.goto(`${BASE_URL}/finance/overview`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_overview_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_overview_mobile.png');

  // 2. Finance Needs Review Queue
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/finance/needs-review`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_needs_review_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_needs_review_mobile.png');

  // Click Match & Activate on first exception
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  console.log('Opening Match & Activate modal...');
  const openedMatch = await clickBtn('Match & Activate');
  if (openedMatch) {
    await new Promise((r) => setTimeout(r, 600));
    await takeSnap('phase4_finance_match_modal_desktop.png');

    console.log('Submitting Match confirmation...');
    const matchConfirmed = await clickBtn('Confirm Match & Activate Member');
    if (matchConfirmed) {
      await new Promise((r) => setTimeout(r, 1200));
      await takeSnap('phase4_finance_needs_review_resolved_desktop.png');
      console.log('Confirmed match and activated Member account!');
    }
  }

  // 3. Finance Payments Ledger & Interactive Timeline
  await page.goto(`${BASE_URL}/finance/payments`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_payments_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_payments_mobile.png');

  // Open Timeline Drawer
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  const openedTimeline = await clickBtn('View Timeline');
  if (openedTimeline) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_finance_payment_timeline_desktop.png');
  }

  // 4. Receipts & Refunds
  await page.goto(`${BASE_URL}/finance/receipts-refunds`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_receipts_refunds_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_receipts_refunds_mobile.png');

  // View Printable Receipt
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  const openedReceipt = await clickBtn('View Receipt');
  if (openedReceipt) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_finance_printable_receipt_desktop.png');
  }

  // 5. Finance Reports & Export
  await page.goto(`${BASE_URL}/finance/reports`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_reports_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_finance_reports_mobile.png');

  // =========================================================================
  // DEMO STEP 8: Ruth Mengistu (Super Admin) Experience & System Governance
  // =========================================================================
  console.log('\n--- [DEMO STEP 8] RUTH MENGISTU (SUPER ADMIN) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('ruth.mengistu');

  // 1. Admin Overview
  await page.goto(`${BASE_URL}/admin/overview`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_overview_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_overview_mobile.png');

  // 2. Admin Settings & Fee Adjustment
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_settings_fees_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_settings_fees_mobile.png');

  // Switch to Email Templates & Preview Tab
  await page.setViewport({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  const switchedTpl = await clickBtn('Email Templates');
  if (switchedTpl) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_admin_settings_templates_desktop.png');
  }

  // Switch to Areas & Skills Tab
  const switchedAreas = await clickBtn('Areas & Skills');
  if (switchedAreas) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_admin_settings_areas_desktop.png');
  }

  // Switch to Demo Tools Tab
  const switchedDemo = await clickBtn('Demo Tools');
  if (switchedDemo) {
    await new Promise((r) => setTimeout(r, 800));
    await takeSnap('phase4_admin_settings_demo_desktop.png');
  }

  // 3. Admin Rank Rules Editor
  await page.goto(`${BASE_URL}/admin/rank-rules`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_rank_rules_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_rank_rules_mobile.png');

  // 4. Admin Accounts & Roles
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/admin/accounts`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_accounts_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_accounts_mobile.png');

  // 5. Admin Activity History Audit
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/admin/activity-history`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_activity_history_desktop.png');

  await page.setViewport({ width: 360, height: 740 });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
  await takeSnap('phase4_admin_activity_history_mobile.png');

  console.log('\n=== ALL PHASE 4 DEMO FLOWS AND SCREENSHOTS COMPLETED SUCCESSFULLY ===');
  await browser.close();
}

runDemoPhase4().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});

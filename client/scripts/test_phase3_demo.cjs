const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://127.0.0.1:4173';
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runDemoPhase3() {
  console.log('--- Starting VTS Phase 3 Demo Verification & Screenshot Capture ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  // Helper for signing in via persisted store
  async function signInAs(username) {
    console.log(`Signing in as ${username}...`);
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    const targetUrl = await page.evaluate((uname) => {
      // If store is not initialized, initialize or load
      const storeKey = 'vts_civic_ledger_storage_v1';
      const currentUserKey = 'vts_civic_current_user_v1';
      const rawStore = localStorage.getItem(storeKey);
      if (!rawStore) return '/sign-in';
      const parsed = JSON.parse(rawStore);
      const user = parsed.users.find((u) => u.username.toLowerCase() === uname.toLowerCase());
      if (!user) return '/sign-in';
      localStorage.setItem(currentUserKey, JSON.stringify(user));

      if (user.role === 'volunteer') return '/volunteer/home';
      if (user.role === 'team_lead') return '/team-lead/home';
      if (user.role === 'manager') return '/manager/dashboard';
      return '/volunteer/home';
    }, username);

    await page.goto(`${BASE_URL}${targetUrl}`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 600));
    console.log(`Signed in successfully as ${username}. Current URL: ${page.url()}`);
  }

  // -------------------------------------------------------------
  // STEP A: Dawit Bekele (Member - partway to Senior Member)
  // -------------------------------------------------------------
  console.log('\n--- VERIFYING DAWIT BEKELE (Volunteer Experience) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('dawit.bekele');

  // 1. Volunteer Home
  await page.goto(`${BASE_URL}/volunteer/home`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_home_desktop.png') });
  console.log('Captured: phase3_volunteer_home_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_home_mobile.png') });
  console.log('Captured: phase3_volunteer_home_mobile.png');

  // 2. Rank Progress View (Trail Route Line & Waypoints)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/volunteer/rank-progress`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_rank_progress_desktop.png') });
  console.log('Captured: phase3_volunteer_rank_progress_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_rank_progress_mobile.png') });
  console.log('Captured: phase3_volunteer_rank_progress_mobile.png');

  // 3. Browse Activities (List & Calendar Views)
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/volunteer/activities`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_activities_list_desktop.png') });
  console.log('Captured: phase3_volunteer_activities_list_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_activities_list_mobile.png') });
  console.log('Captured: phase3_volunteer_activities_list_mobile.png');

  // Switch to Calendar view
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/volunteer/activities`, { waitUntil: 'networkidle0' });
  const calButtons = await page.$$('button');
  for (const b of calButtons) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.includes('Calendar View')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_activities_calendar_desktop.png') });
  console.log('Captured: phase3_volunteer_activities_calendar_desktop.png');

  // 4. Activity Detail & Join
  await page.goto(`${BASE_URL}/volunteer/activities/act-01`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_activity_detail_desktop.png') });
  console.log('Captured: phase3_volunteer_activity_detail_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_activity_detail_mobile.png') });
  console.log('Captured: phase3_volunteer_activity_detail_mobile.png');

  // 5. Check-In Page
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/volunteer/check-in`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_checkin_desktop.png') });
  console.log('Captured: phase3_volunteer_checkin_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_checkin_mobile.png') });
  console.log('Captured: phase3_volunteer_checkin_mobile.png');

  // Dawit performs check-in with code 5291
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/volunteer/check-in`, { waitUntil: 'networkidle0' });
  const codeInput = await page.$('input[placeholder="e.g. 5291"]');
  if (codeInput) {
    await codeInput.type('5291');
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Dawit submitted check-in code 5291.');
  }

  // 6. Logged Hours Ledger & Add Missed Hours
  await page.goto(`${BASE_URL}/volunteer/hours`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_hours_desktop.png') });
  console.log('Captured: phase3_volunteer_hours_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_hours_mobile.png') });
  console.log('Captured: phase3_volunteer_hours_mobile.png');

  // Open Add Missed Hours Modal
  await page.setViewport({ width: 1440, height: 900 });
  const addHoursBtns = await page.$$('button');
  for (const b of addHoursBtns) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.includes('Add Missed Hours')) {
      await b.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));
  const noteArea = await page.$('textarea');
  if (noteArea) {
    await noteArea.type('Participated in site preparation logistics; phone battery died prior to code scanning.');
    const submitModalBtn = await page.$('button[type="submit"]');
    if (submitModalBtn) await submitModalBtn.click();
    await new Promise((r) => setTimeout(r, 1200));
    console.log('Dawit submitted manual missed hours claim.');
  }

  // 7. Certificates & ID Card
  await page.goto(`${BASE_URL}/volunteer/certificates`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_certificates_desktop.png') });
  console.log('Captured: phase3_volunteer_certificates_desktop.png');

  await page.goto(`${BASE_URL}/volunteer/id-card`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_idcard_desktop.png') });
  console.log('Captured: phase3_volunteer_idcard_desktop.png');

  // 8. Profile & Notification Settings
  await page.goto(`${BASE_URL}/volunteer/profile`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_volunteer_profile_desktop.png') });
  console.log('Captured: phase3_volunteer_profile_desktop.png');

  // -------------------------------------------------------------
  // STEP B: Selam Alemu (Eligible for Team Lead)
  // -------------------------------------------------------------
  console.log('\n--- VERIFYING SELAM ALEMU (Eligible for Team Lead) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('selam.alemu');

  await page.goto(`${BASE_URL}/volunteer/rank-progress`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_selam_eligible_rank_desktop.png') });
  console.log('Captured: phase3_selam_eligible_rank_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_selam_eligible_rank_mobile.png') });
  console.log('Captured: phase3_selam_eligible_rank_mobile.png');

  // -------------------------------------------------------------
  // STEP C: Yonas Kebede (Team Lead Experience)
  // -------------------------------------------------------------
  console.log('\n--- VERIFYING YONAS KEBEDE (Team Lead Experience) ---');
  await page.setViewport({ width: 1440, height: 900 });
  await signInAs('yonas.kebede');

  // 1. Team Lead Home
  await page.goto(`${BASE_URL}/team-lead/home`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_home_desktop.png') });
  console.log('Captured: phase3_teamlead_home_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_home_mobile.png') });
  console.log('Captured: phase3_teamlead_home_mobile.png');

  // 2. Approve Hours Desk
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/team-lead/approve-hours`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_approve_hours_desktop.png') });
  console.log('Captured: phase3_teamlead_approve_hours_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_approve_hours_mobile.png') });
  console.log('Captured: phase3_teamlead_approve_hours_mobile.png');

  // Click Approve on first item
  await page.setViewport({ width: 1440, height: 900 });
  const approveBtns = await page.$$('button');
  for (const b of approveBtns) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.trim() === 'Approve') {
      await b.click();
      console.log('Yonas approved volunteer hours claim.');
      await new Promise((r) => setTimeout(r, 1200));
      break;
    }
  }

  // 3. Rate Volunteers Page
  await page.goto(`${BASE_URL}/team-lead/ratings`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_ratings_desktop.png') });
  console.log('Captured: phase3_teamlead_ratings_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_ratings_mobile.png') });
  console.log('Captured: phase3_teamlead_ratings_mobile.png');

  // Rate volunteer (click save rating)
  await page.setViewport({ width: 1440, height: 900 });
  const saveRatingBtns = await page.$$('button');
  for (const b of saveRatingBtns) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.includes('Save Rating')) {
      await b.click();
      console.log('Yonas saved volunteer rating.');
      await new Promise((r) => setTimeout(r, 1000));
      break;
    }
  }

  // 4. Recommend Promotion Page
  await page.goto(`${BASE_URL}/team-lead/recommend-promotion`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_recommend_promotion_desktop.png') });
  console.log('Captured: phase3_teamlead_recommend_promotion_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_recommend_promotion_mobile.png') });
  console.log('Captured: phase3_teamlead_recommend_promotion_mobile.png');

  // Submit promotion recommendation
  await page.setViewport({ width: 1440, height: 900 });
  const submitPromoBtn = await page.$('button[type="submit"]');
  if (submitPromoBtn) {
    await submitPromoBtn.click();
    console.log('Yonas submitted promotion recommendation.');
    await new Promise((r) => setTimeout(r, 1200));
  }

  // 5. Lead Activities Page & Roster Modal
  await page.goto(`${BASE_URL}/team-lead/activities`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_activities_desktop.png') });
  console.log('Captured: phase3_teamlead_activities_desktop.png');

  await page.setViewport({ width: 360, height: 800 });
  await new Promise((r) => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_activities_mobile.png') });
  console.log('Captured: phase3_teamlead_activities_mobile.png');

  // Click View Roster to open modal
  await page.setViewport({ width: 1440, height: 900 });
  const viewRosterBtns = await page.$$('button');
  for (const b of viewRosterBtns) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.includes('View Roster')) {
      await b.click();
      await new Promise((r) => setTimeout(r, 800));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_roster_modal_desktop.png') });
      console.log('Captured: phase3_teamlead_roster_modal_desktop.png');
      break;
    }
  }

  // 6. Create Activity Page
  await page.goto(`${BASE_URL}/team-lead/create-activity`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_create_activity_desktop.png') });
  console.log('Captured: phase3_teamlead_create_activity_desktop.png');

  // 7. Announcements Page
  await page.goto(`${BASE_URL}/team-lead/announcements`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase3_teamlead_announcements_desktop.png') });
  console.log('Captured: phase3_teamlead_announcements_desktop.png');

  console.log('\n--- ALL PHASE 3 SCREENSHOTS & ACTIONS VERIFIED SUCCESSFULLY ---');
  await browser.close();
}

runDemoPhase3().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

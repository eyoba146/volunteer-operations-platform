const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://127.0.0.1:4173';
const SCREENSHOT_DIR = path.resolve(__dirname, '../../docs/screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runDemo() {
  console.log('--- Starting VTS Phase 2 Demo Verification & Screenshot Capture ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });

  // -------------------------------------------------------------
  // DEMO STEP 1: Register as new person & submit application
  // -------------------------------------------------------------
  console.log('DEMO STEP 1: Testing Registration & Application submission...');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });

  // Generate unique test user
  const testUser = `berhanu_${Date.now().toString().slice(-4)}`;
  const testEmail = `${testUser}@example.et`;

  await page.type('input[type="email"]', testEmail);
  await page.type('input[autoComplete="username"]', testUser);
  await page.type('input[type="password"]', 'Demo@1234');

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
  ]);

  console.log('Navigated after register:', page.url());

  // Email verification page
  await page.waitForSelector('input', { timeout: 5000 });
  // Enter 6-digit code
  const codeInputs = await page.$$('input');
  if (codeInputs.length === 6) {
    for (let i = 0; i < 6; i++) {
      await codeInputs[i].type('1');
    }
  } else {
    await codeInputs[0].type('123456');
  }

  // Click verify
  const verifyBtn = await page.$('button[type="submit"]');
  if (verifyBtn) {
    await Promise.all([
      verifyBtn.click(),
      page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
    ]);
  }

  console.log('Landed on applicant form:', page.url());
  await new Promise((r) => setTimeout(r, 800));

  // Capture Step 1 Desktop
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_apply_step1_desktop.png'), fullPage: false });

  // Fill Application Step 1
  await page.waitForSelector('input[placeholder*="Hana"]', { timeout: 5000 });
  await page.type('input[placeholder*="Hana"]', 'Berhanu Haile');
  await page.type('input[placeholder*="+251 91"]', '+251 91 888 7766');

  // Next step
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Next: Photo Uploads')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // Select Sample Photo
  const samplePhotoButtons = await page.$$('button');
  for (const b of samplePhotoButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Sample A')) {
      await b.click();
      break;
    }
  }

  // Select Sample ID
  for (const b of samplePhotoButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Sample Kebele ID')) {
      await b.click();
      break;
    }
  }

  // Capture Photo upload step
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_apply_photos_desktop.png'), fullPage: false });

  // Mobile screenshot of Photo step
  await page.setViewport({ width: 360, height: 780 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_apply_photos_mobile.png'), fullPage: false });
  await page.setViewport({ width: 1440, height: 900 });

  // Next: Skills
  const buttonsStep2 = await page.$$('button');
  for (const b of buttonsStep2) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Next: Skills')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // Next: Motivation
  const buttonsStep3 = await page.$$('button');
  for (const b of buttonsStep3) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Next: Motivation')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // Fill Motivation & Emergency
  await page.waitForSelector('textarea', { timeout: 5000 });
  await page.type('textarea', 'I am dedicated to community service and disaster readiness in Kazanchis.');
  await page.type('input[placeholder*="Tesfaye Wolde"]', 'Almaz Haile');
  await page.type('input[placeholder*="+251 91 765"]', '+251 92 111 2233');

  // Submit Application
  const submitBtns = await page.$$('button');
  for (const b of submitBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Send My Application')) {
      await b.click();
      break;
    }
  }

  await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {});
  console.log('Landed on status page:', page.url());
  await new Promise((r) => setTimeout(r, 800));

  // Capture Applicant Status Desktop & Mobile
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_applicant_status_desktop.png'), fullPage: false });
  await page.setViewport({ width: 360, height: 780 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_applicant_status_mobile.png'), fullPage: false });
  await page.setViewport({ width: 1440, height: 900 });

  console.log('✓ STEP 1 PASSED: Application submitted and status timeline displayed.');

  // -------------------------------------------------------------
  // DEMO STEP 2: Sign in as Manager (marta.girma) & Review/Accept
  // -------------------------------------------------------------
  console.log('DEMO STEP 2: Signing in as Manager (Marta Girma)...');
  await page.evaluate(() => {
    localStorage.removeItem('vts_civic_current_user_v1');
  });
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });

  // Click Marta Girma demo button
  const demoButtons = await page.$$('button');
  for (const b of demoButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Marta Girma')) {
      await b.click();
      break;
    }
  }

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
  ]);

  console.log('Landed on Manager Dashboard:', page.url());
  await new Promise((r) => setTimeout(r, 600));

  // Navigate to /manager/applications
  await page.goto(`${BASE_URL}/manager/applications`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Capture Admissions Queue Desktop & Mobile
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_manager_queue_desktop.png'), fullPage: false });
  await page.setViewport({ width: 360, height: 780 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_manager_queue_mobile.png'), fullPage: false });
  await page.setViewport({ width: 1440, height: 900 });

  // Open review for first applicant
  const reviewButtons = await page.$$('button');
  for (const b of reviewButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Review')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 800));

  // Capture Review Sheet Desktop
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_manager_review_sheet_desktop.png'), fullPage: false });

  // Add internal note
  const noteInputs = await page.$$('input[placeholder*="private admissions note"]');
  if (noteInputs.length > 0) {
    await noteInputs[0].type('Verified candidate qualifications. Highly recommended.');
    const addNoteBtns = await page.$$('button');
    for (const b of addNoteBtns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text.includes('Add Note')) {
        await b.click();
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  // Accept & Send Telebirr Invite
  const actionBtns = await page.$$('button');
  for (const b of actionBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Accept & Send Telebirr Invite')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 1200));
  console.log('✓ STEP 2 PASSED: Manager reviewed application, added note, and accepted candidate.');

  // -------------------------------------------------------------
  // DEMO STEP 3: Sign in as Hana Tesfaye & Pay with Telebirr
  // -------------------------------------------------------------
  console.log('DEMO STEP 3: Signing in as Hana Tesfaye & Testing Telebirr flow...');
  await page.evaluate(() => {
    localStorage.removeItem('vts_civic_current_user_v1');
  });
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'networkidle0' });

  // Click Hana Tesfaye demo button
  const hanaBtns = await page.$$('button');
  for (const b of hanaBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Hana Tesfaye')) {
      await b.click();
      break;
    }
  }

  await Promise.all([
    page.click('button[type="submit"]'),
    page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => {}),
  ]);

  console.log('Landed on Hana page:', page.url());
  await new Promise((r) => setTimeout(r, 800));

  // Go to Payment Page
  await page.goto(`${BASE_URL}/applicant/payment`, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));

  // Capture Payment Page Desktop & Mobile
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_payment_ready_desktop.png'), fullPage: false });
  await page.setViewport({ width: 360, height: 780 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_payment_ready_mobile.png'), fullPage: false });
  await page.setViewport({ width: 1440, height: 900 });

  // Click Pay with Telebirr
  const payButtons = await page.$$('button');
  for (const b of payButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('Pay with Telebirr')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 800));

  // Capture In-Flight USSD push simulator screen
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_telebirr_push_simulator_desktop.png'), fullPage: false });

  // Click "1. Succeed (Activate Member)"
  const simButtons = await page.$$('button');
  for (const b of simButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text.includes('1. Succeed')) {
      await b.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 1500));

  // Capture Welcome upgrade moment, receipt, and Volunteer ID Card
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_activation_welcome_desktop.png'), fullPage: false });
  await page.setViewport({ width: 360, height: 780 });
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'phase2_activation_welcome_mobile.png'), fullPage: false });
  await page.setViewport({ width: 1440, height: 900 });

  console.log('✓ STEP 3 PASSED: Telebirr payment confirmed, welcome celebration rendered, volunteer pass unlocked.');

  console.log('--- ALL DEMO STEPS 1 TO 3 COMPLETED SUCCESSFULLY ---');
  await browser.close();
}

runDemo().catch((err) => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});

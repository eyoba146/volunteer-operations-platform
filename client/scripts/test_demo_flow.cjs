const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runTests() {
  console.log('--- Starting VTS End-to-End Flow Verification ---');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

  try {
    // Reset test storage for clean repeatable run
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle0' });
    await page.evaluate(() => localStorage.clear());

    // Test 1: Verify Certificate
    console.log('Test 1: Checking Certificate Verification...');
    await page.goto('http://127.0.0.1:4173/check-certificate', { waitUntil: 'networkidle0' });
    await page.waitForSelector('input');
    await page.type('input', 'VTS-CERT-8842-ET');
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('AUTHENTICATED VOLUNTEER PASS'), { timeout: 6000 });
    console.log('✓ Certificate verified successfully for Dawit Bekele!');

    // Test 2: Sign in as Hana Tesfaye & Telebirr Payment
    console.log('Test 2: Testing Hana Tesfaye Applicant Payment...');
    await page.goto('http://127.0.0.1:4173/sign-in', { waitUntil: 'networkidle0' });
    // Click Hana in Quick Select
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const hanaBtn = buttons.find(b => b.innerText.includes('hana.tesfaye') || b.innerText.includes('Hana Tesfaye'));
      if (hanaBtn) hanaBtn.click();
    });
    await new Promise(r => setTimeout(r, 200));
    await page.click('button[type="submit"]');

    await page.waitForFunction(() => window.location.pathname.includes('/applicant/status'), { timeout: 5000 });
    console.log('Landed on URL after sign in:', page.url());

    // Wait for the Telebirr payment button to appear after loading
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.includes('Pay with Telebirr'));
    }, { timeout: 5000 });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const payBtn = btns.find(b => b.innerText.includes('Pay with Telebirr'));
      if (payBtn) payBtn.click();
    });

    await page.waitForFunction(() => window.location.pathname.includes('/applicant/payment'), { timeout: 5000 });
    console.log('Landed on payment page:', page.url());

    // Wait for button on payment page
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.includes('Pay with Telebirr'));
    }, { timeout: 5000 });

    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const initBtn = btns.find(b => b.innerText.includes('Pay with Telebirr'));
      if (initBtn) initBtn.click();
    });

    // Wait for simulation controls to appear
    await page.waitForFunction(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText.includes('1. Succeed (Activate)'));
    }, { timeout: 6000 });

    await new Promise(r => setTimeout(r, 400));
    console.log('Clicking 1. Succeed (Activate)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const confirmBtn = btns.find(b => b.innerText.includes('1. Succeed (Activate)'));
      if (confirmBtn) {
        console.log('Found confirm button:', confirmBtn.outerHTML);
        confirmBtn.click();
      } else {
        console.log('COULD NOT FIND confirm button among:', btns.map(b => b.innerText));
      }
    });

    try {
      await page.waitForFunction(() => {
        const txt = document.body.innerText.toLowerCase();
        return txt.includes('payment confirmed') || txt.includes('active member') || txt.includes('membership activated');
      }, { timeout: 10000 });
      console.log('✓ Telebirr payment simulation succeeded and membership activated!');
    } catch (e) {
      await page.screenshot({ path: path.join(__dirname, '../../docs/screenshots/payment_failure_debug.png') });
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('DEBUG BODY TEXT AT TIMEOUT:\n', bodyText.slice(0, 1000));
      throw e;
    }

    // Test 3: Manager Promotion Decision for Selam Alemu
    console.log('Test 3: Testing Manager Promotion Board for Selam Alemu...');
    await page.evaluate(() => localStorage.removeItem('vts_civic_current_user_v1'));
    await page.goto('http://127.0.0.1:4173/sign-in', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const martaBtn = buttons.find(b => b.innerText.includes('marta.girma') || b.innerText.includes('Marta Girma'));
      if (martaBtn) martaBtn.click();
    });
    await new Promise(r => setTimeout(r, 200));
    await page.click('button[type="submit"]');

    await page.waitForFunction(() => window.location.pathname.includes('/manager'), { timeout: 5000 });
    await page.goto('http://127.0.0.1:4173/manager/promotions', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.innerText.toLowerCase().includes('selam alemu'), { timeout: 6000 });
    console.log('✓ Manager promotions board loaded with Selam Alemu candidate!');

    // Test 4: Finance Exception Desk
    console.log('Test 4: Testing Finance Needs Review Resolution...');
    await page.evaluate(() => localStorage.removeItem('vts_civic_current_user_v1'));
    await page.goto('http://127.0.0.1:4173/sign-in', { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const abelBtn = buttons.find(b => b.innerText.includes('abel.hailu') || b.innerText.includes('Abel Hailu'));
      if (abelBtn) abelBtn.click();
    });
    await new Promise(r => setTimeout(r, 200));
    await page.click('button[type="submit"]');

    await page.waitForFunction(() => window.location.pathname.includes('/finance'), { timeout: 5000 });
    await page.goto('http://127.0.0.1:4173/finance/needs-review', { waitUntil: 'networkidle0' });
    await page.waitForFunction(() => document.body.innerText.toLowerCase().includes('tb-2026-10294-rev'), { timeout: 6000 });
    console.log('✓ Finance exception queue loaded with flagged Telebirr payments!');

    console.log('--- ALL 4 VERIFICATION FLOWS PASSED PERFECTLY ---');
  } catch (err) {
    console.error('VERIFICATION ERROR:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runTests().catch(() => process.exit(1));

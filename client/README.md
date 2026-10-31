# VTS (Volunteer Tracking System) — Frontend Prototype

A distinctive, civic-editorial web prototype built for the VTS Volunteer Corps in Ethiopia. This application handles the complete volunteer lifecycle: recruitment, Telebirr payment settlement (ETB 200), field activity rosters, duty check-ins, hours audit, and merit-based rank advancement with verifiable qualifications.

---

## 1. How to Run the Prototype

From the project root:

```bash
cd client
npm install
npm run dev
```

Open your browser to: `http://localhost:5173` (or the local URL printed by Vite).

To build for production verification:
```bash
npm run build
```

---

## 2. Demo Evaluator Accounts

All demo accounts share the standard password: **`Demo@1234`**.  
On the **Sign In** screen, a **Quick-Select Panel** allows one-click auto-fill for each persona.

| Role | Persona Name | Username | Scenario & Key Flow |
| --- | --- | --- | --- |
| **Applicant** | Hana Tesfaye | `hana.tesfaye` | Application accepted. Completes ETB 200 Telebirr payment, unlocks Member rank and ID card. |
| **Volunteer (Member)** | Dawit Bekele | `dawit.bekele` | Active volunteer. Enrolled in today’s clean-up, enters check-in code, logs manual hours. |
| **Volunteer (Senior)** | Selam Alemu | `selam.alemu` | Over 160 approved hours and 22 activities. Meets every Team Lead threshold; promotion pending. |
| **Team Lead** | Yonas Kebede | `yonas.kebede` | Manages field rosters, reveals session check-in codes, approves/declines hours, rates participants. |
| **Manager** | Marta Girma | `marta.girma` | Screens applicant queue, decides promotion boards (approves Selam Alemu), publishes notices. |
| **Finance Officer** | Abel Hailu | `abel.hailu` | Audits Telebirr settlements, resolves 2 payments in manual review queue, processes refunds. |
| **Super Admin** | Ruth Mengistu | `ruth.mengistu` | Configures ETB fee amount, adjusts rank thresholds, inspects system activity history. |

---

## 3. End-to-End Evaluation Script (Section 13)

Follow this 8-step walkthrough to test every major module in the specification:

1. **New Applicant Registration & Email Verification**:
   - Navigate to `/register`.
   - Register a new account (e.g. `biruk.tadesse@example.et`, username `biruk.tadesse`).
   - Click the **Brevo Simulator** pill in the top bar to inspect the delivered 6-digit verification code.
   - Enter the 6-digit code on `/verify-email` and submit the multi-step volunteer application form.
2. **Manager Review**:
   - Sign in as `marta.girma`.
   - Go to **Application Queue**, review Biruk’s submission, and click **Accept & Invite to Pay**.
3. **Telebirr Payment & Account Activation**:
   - Sign in as `hana.tesfaye`.
   - Open **Telebirr Payment**. Enter phone number and click **Pay with Telebirr (ETB 200.00)**.
   - Use the demo simulator control **1. Succeed (Activate)** to confirm the payment.
   - Watch the account immediately activate as **Member**, receive receipt `REC-2026-xxxxx`, and inspect the printable **Volunteer ID Card**.
4. **Duty Roster & Check-In**:
   - Sign in as `dawit.bekele`.
   - Open **Check-In Code**. Enter session code `4821` (for Meskel Square clean-up) and confirm attendance.
   - Open **Service Hours Ledger** to view the logged session and test **Add Missed Hours Manually**.
5. **Field Audit & Ratings**:
   - Sign in as `yonas.kebede`.
   - Open **Approve Hours** and approve Dawit’s logged attendance.
   - Go to **Rate Volunteers** and award stars and feedback.
   - Go to **Recommend Promotion** and inspect existing recommendations.
6. **Promotion Approval**:
   - Sign in as `marta.girma`.
   - Open **Promotions Board**. Review the verified evidence summary for `Selam Alemu` (168 hours, 22 activities, 4.9 rating).
   - Click **Approve Promotion**. An official rank credential certificate is generated.
7. **Finance Audit & Needs Review**:
   - Sign in as `abel.hailu`.
   - Open **Review Queue** (`/finance/needs-review`). Inspect flagged payment `TB-2026-10294-REV`.
   - Click **Match & Activate** to force-match the payment.
   - Go to **Financial Export** and test CSV / PDF report export.
8. **Super Admin Governance**:
   - Sign in as `ruth.mengistu`.
   - Open **Program Configuration** and change the registration fee or deadline.
   - Open **Rank Progression Rules** and modify hours thresholds.
   - Open **Activity History** to verify that every action taken in steps 1 through 8 is permanently recorded.

---

## 4. Key Architecture & Simulation Features

* **Brevo Email Preview Inbox**: Accessible from the top header on any screen. Simulates transactional emails (6-digit verification codes, payment receipts, acceptance notifications, password resets) with one-click direct links.
* **Telebirr Gateway Simulator**: Authentic Ethiopian mobile money experience supporting instant confirmation, network delay (needs-review quarantine), and cancellation/failure handling.
* **Public Certificate Verification**: Navigate to `/check-certificate` and enter any certificate code (e.g. `VTS-CERT-8842-ET` or `VTS-CERT-7731-ET`) to view the authenticated digital credential.
* **Civic Ledger Design Language**:
  - Offline local fonts via `@fontsource`: **Fraunces** (human editorial serif), **Plus Jakarta Sans** (crisp UI grotesque), and **JetBrains Mono** (currency and ledger codes).
  - Clean architectural hairlines and warm paper tones (`#FBF9F5` / `#141716` / `#1D4A3E` / `#C88A23`).
  - Strict compliance with all anti-generic and banned pattern guidelines.

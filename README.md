# Volunteer Tracking System (VTS)

A front-end operations prototype and volunteer management platform built for community service organizations in Ethiopia. VTS tracks the entire lifecycle of civic volunteerism: recruitment, multi-step application review, Telebirr registration fee settlement, field activity rosters, duty session check-in/out, supervisor hours audit, merit ratings, and progressive altitude rank advancement.

---

## 1. Project Overview

### What VTS Is
The Volunteer Tracking System (VTS) is an operational web platform designed to organize, verify, and recognize community service across Ethiopian cities (including Addis Ababa, Adama, Hawassa, Bishoftu, and Bahir Dar). It replaces fragile paper sign-in sheets and informal messaging groups with a structured system of record.

### Who It Is For
- **Volunteers and Citizens**: People who want to contribute time to environmental cleanup, tutoring, emergency response, and community health, and build an immutable, verifiable record of their service.
- **Team Leads**: Field coordinators who lead squads on the ground, manage attendance rosters, verify duty hours, and rate volunteer contributions.
- **Program Managers**: Operations directors who review applicant pools, allocate volunteers across regional initiatives, organize targeted announcements, and decide promotional elevation boards.
- **Finance Officers**: Reconciliation auditors who monitor Telebirr registration fees, resolve transaction exceptions, process justified refunds, and issue formal tax receipts.
- **Super Administrators**: Executive directors who calibrate system-wide qualification rules, registration fees, operational area catalogs, staff accounts, and security policies.

### The Problem It Solves
1. **Unverified Service Claims**: Without standardized check-in codes and supervisor verification, volunteer credentials are easy to falsify and difficult for universities or employers to confirm.
2. **Payment Reconciliations**: Informal manual mobile money transfers frequently leave applicants unassigned when reference codes are lost or mistyped.
3. **Disorganized Field Coordination**: Field leads lack real-time visibility into who is enrolled, who checked in on site, and who left early.
4. **Opaque Volunteer Recognition**: Volunteers lack clear visibility into what milestones, hours, or trainings are required to achieve seniority and leadership roles.

---

## 2. Live Demo & Screenshots

### Live Demo Link
`https://vts-operations-demo.internal` *(Prototype deployment link placeholder)*

### Interface Previews
- **Public Entry & Altitude Trail**: Clear typography, high-contrast role fields, and interactive climbing elevation profiles.
- **Applicant Desk**: Step-by-step progress tracking, photo uploading, and simulated Telebirr push settlement.
- **Volunteer Trail**: Next scheduled activity pass, altitude route line, check-in terminal, verifiable ID card, and printable certificates.
- **Team Lead Dispatch**: Field roster overview, 4-digit attendance code display, single and bulk hours approval, and participant rating cards.
- **Manager Operations Desk**: Applicant evaluation queue, dossier slide-overs, promotion evidence reviews, targeted broadcasts, and custom SVG Trail reports.
- **Finance Terminal**: High-contrast Deep Ink ledger, Telebirr settlement rails, exception matching engine, and printable official tax receipts.
- **Super Admin Console**: Dynamic rank rules editor, fee and deadline settings, staff provisioning, interactive email template editor, and system history audit logs.

Screenshots are cataloged in `docs/screenshots/` and documented in `PHASE_4_REPORT.md`.

---

## 3. The Volunteer Journey

1. **Registration**: The applicant enters first name, last name, username, email, Ethiopian mobile number (e.g. `0912 345 678`, automatically normalized to `+251912345678`), and password with a live security checklist.
2. **Email Verification**: A simulated 6-digit confirmation code is generated in the built-in email preview inbox to activate access.
3. **Application Submission**: The applicant completes a multi-step form detailing regional area, motivation, volunteer skills, availability, and emergency contact details, with optional portrait and ID card uploads.
4. **Manager Review**: Program managers inspect the application queue, add private evaluation notes, and approve the candidate (or request additional information).
5. **Telebirr Fee Settlement**: The accepted applicant receives a payment invitation and 7-day countdown. They initiate a Telebirr push payment (ETB 200 standard fee) with realistic success, delay, and failure simulation options.
6. **Account Activation**: Upon payment confirmation, the account instantly transitions to active **Member** rank. The volunteer receives their official printable ID card with QR code, and duty insurance coverage is unlocked.
7. **Field Service & Check-In**: The volunteer joins open activities, arrives on site, and checks in using the Team Lead's 4-digit code. Check-out logs verified minutes automatically.
8. **Hours Audit & Ratings**: Team leads review attendance logs, approve or decline hours with required reasons, and submit peer ratings.
9. **Rank Elevation**: As verified service hours, activity counts, tenure, and ratings satisfy threshold rules, candidates become eligible for board review and elevation to Senior Member, Team Lead, and Manager.

---

## 4. Roles & Permissions

VTS implements role-based access control across 6 defined system roles, plus the unactivated Applicant stage:

| Permission / Capability | Applicant | Volunteer | Team Lead | Manager | Finance Officer | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Browse public activities & verify certificates | Yes | Yes | Yes | Yes | Yes | Yes |
| Submit & update volunteer application | Yes | No | No | No | No | No |
| Pay registration fee via Telebirr | Yes | No | No | No | No | No |
| Access volunteer ID pass & certificates | No | Yes | Yes | Yes | No | No |
| Join & leave field activities | No | Yes | Yes | Yes | No | No |
| Check-in with 4-digit pin & log manual hours | No | Yes | Yes | Yes | No | No |
| Create activities & manage field rosters | No | No | Yes | Yes | No | No |
| Reveal session check-in codes | No | No | Yes | Yes | No | No |
| Approve / decline hours & rate volunteers | No | No | Yes | Yes | No | No |
| Recommend volunteer promotions | No | No | Yes | Yes | No | No |
| Review applicants & make admission decisions | No | No | No | Yes | No | Yes |
| Approve promotions & issue rank certificates | No | No | No | Yes | No | Yes |
| Broadcast announcements by rank / area / roster | No | No | Yes* | Yes | No | Yes |
| View Telebirr financial ledger & totals | No | No | No | No | Yes | Yes |
| Match unassigned payments & process refunds | No | No | No | No | Yes | No |
| Edit system rank rules & registration fee | No | No | No | No | No | Yes |
| Provision staff accounts & suspend access | No | No | No | No | No | Yes |
| Edit email templates & inspect system history | No | No | No | No | No | Yes |

*\*Team leads may broadcast notices to their assigned activity rosters only.*

---

## 5. Ranks, Thresholds & Promotion Governance

Rank in VTS represents altitude earned through service, not arbitrary administrative titles:

| Rank Tier | Minimum Hours | Minimum Activities | Minimum Rating | Minimum Months | Required Training Prerequisite | Approving Authority |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Member** | 0 hrs | 0 | - | - | Orientation & Safety Briefing | Automated upon Telebirr fee settlement |
| **Senior Member** | 60 hrs | 8 activities | 4.0 / 5.0 | 3 months | Community Safety & Ethics | Program Manager Board |
| **Team Lead** | 150 hrs | 20 activities | 4.2 / 5.0 | 6 months | Team Leadership & Field Coordination | Program Manager Board (Nomination by Lead) |
| **Manager** | 300 hrs | 30 activities (5 led) | 4.4 / 5.0 | 12 months | Program Administration & Governance | Super Admin / Board of Directors |

### Governance Rules
- Progress is calculated in real time against approved hours and completed activities in the database.
- When an applicant reaches threshold criteria, their status changes to `eligible`.
- Team leads can submit formal written recommendations for promotion.
- Program managers inspect a comprehensive evidence dossier (hours, activities, ratings, tenure, qualifications) before approving or declining with mandatory written justification.
- When Super Admin modifies thresholds in the Rank Rules Editor, eligibility is dynamically re-computed across the entire system.

---

## 6. Payment Flow & Telebirr Edge Cases

### Payment Mechanics
- **Standard Registration Fee**: ETB 200 (configurable by Super Admin in Settings).
- **Payment Deadline Window**: 7 days from admission notice.
- **Provider**: Ethio Telecom Telebirr API (simulated push prompt and USSD confirmation).

### Edge Cases Handled in Prototype
1. **Network Timeout / Delayed Response**: Simulated network latency with pending status polling; user is kept informed with clear progress states.
2. **Failed Payment**: Provides plain-language explanations (e.g. insufficient Telebirr balance or user cancellation) and an immediate retry option.
3. **Double Payment**: Seed data includes duplicate transactions (`pay-almaz-dup`); Finance Officer review queue surfaces duplicates for automatic resolution.
4. **Unmatched Transaction**: Telebirr reference numbers entered manually without matching applicant IDs (`pay-rev-01`, `pay-rev-02`) appear in the Finance **Needs Review** queue with a search-and-link modal.
5. **Refund Requests**: Formal applicant cancellation requests require a mandatory corporate justification note from the Finance Officer before reversal.

---

## 7. Functional Requirements Compliance Matrix

### 6.1 Authentication & Access
- `FR-AUTH-01`: Register with first name, last name, username, email, phone, password. **Status: Done**
- `FR-AUTH-02`: Verify email with 6-digit code (preview inbox). **Status: Done**
- `FR-AUTH-03`: Sign in with email or username plus password. **Status: Done**
- `FR-AUTH-04`: Forgot password recovery flow and reset page. **Status: Done**
- `FR-AUTH-05`: Role-based route guards and friendly unauthorized fallback. **Status: Done**
- `FR-AUTH-06`: Sign out with state cleanup and notice. **Status: Done**
- `FR-AUTH-07`: Account settings profile management. **Status: Done**
- `FR-AUTH-08`: Session lockout simulation on repeated failures. **Status: Done**

### 6.2 Application & Recruitment
- `FR-APP-01`: Multi-step application with auto-save to local storage. **Status: Done**
- `FR-APP-02`: Profile and national ID card photo upload simulation. **Status: Done**
- `FR-APP-03`: Applicant status timeline showing next action steps. **Status: Done**
- `FR-APP-04`: Manager application queue with search, filter, and sorting. **Status: Done**
- `FR-APP-05`: Application review sheet with private evaluator notes. **Status: Done**
- `FR-APP-06`: Bulk accept and bulk reject modal actions. **Status: Done**
- `FR-APP-07`: Payment invitation with 7-day countdown. **Status: Done**
- `FR-APP-08`: Application withdrawal before payment. **Status: Done**

### 6.3 Volunteer Profile
- `FR-PRO-01`: Complete volunteer profile with skills, bio, languages, emergency contact. **Status: Done**
- `FR-PRO-02`: Rank badges, service tenure, verified metrics display. **Status: Done**
- `FR-PRO-03`: Permanent rank history milestones and certificate gallery. **Status: Done**
- `FR-PRO-04`: Printable Volunteer ID Pass with QR code. **Status: Done**
- `FR-PRO-05`: Profile picture upload, square crop, zoom control, and removal. **Status: Done**

### 6.4 Activities & Field Operations
- `FR-ACT-01`: Activity categorization (event, project, shift, field task, training). **Status: Done**
- `FR-ACT-02`: Field operations metadata (location, spots, skills, lead, cover image). **Status: Done**
- `FR-ACT-03`: Browse activities in list and calendar grid views with filters. **Status: Done**
- `FR-ACT-04`: Join, leave, and waitlist handling. **Status: Done**
- `FR-ACT-05`: Waitlist capacity queueing and automatic offer notifications. **Status: Done**
- `FR-ACT-06`: Team lead roster management and attendance logging. **Status: Done**
- `FR-ACT-07`: Activity reschedule / cancellation alerts. **Status: Done**

### 6.5 Check-In & Service Hours
- `FR-HRS-01`: Check-in via 4-digit code or QR code scan. **Status: Done**
- `FR-HRS-02`: Automatic hours computation on checkout. **Status: Done**
- `FR-HRS-03`: Manual missed hours submission with required justification. **Status: Done**
- `FR-HRS-04`: Single and bulk hours approval / decline with mandatory notes. **Status: Done**

### 6.6 Ratings & Performance
- `FR-RAT-01`: Team lead 5-star scoring and qualitative feedback. **Status: Done**
- `FR-RAT-02`: Volunteer cumulative average rating computation. **Status: Done**

### 6.7 Promotions & Governance
- `FR-PRM-01`: Automated rank threshold eligibility engine. **Status: Done**
- `FR-PRM-02`: Team lead promotion recommendations with justification. **Status: Done**
- `FR-PRM-03`: Manager review board with evidence dossier summary. **Status: Done**
- `FR-PRM-04`: Rank elevation updates user role, certificates, and routes. **Status: Done**

### 6.8 Certificates & Verification
- `FR-CRT-01`: Automatic generation of membership and rank certificates. **Status: Done**
- `FR-CRT-02`: Public certificate verification portal with unique code search. **Status: Done**

### 6.9 Communications & Bulletins
- `FR-COM-01`: Targeted broadcasts (everyone, by rank, by area, by activity roster). **Status: Done**
- `FR-COM-02`: Volunteer post-activity feedback debrief inbox. **Status: Done**

### 6.10 Reports & Analytics
- `FR-REP-01`: Bespoke SVG elevation profiles for hours over time. **Status: Done**
- `FR-REP-02`: Waypoint recruitment funnel and regional turnout bars. **Status: Done**
- `FR-REP-03`: Real CSV downloads (`Blob` export) and physical PDF print styles. **Status: Done**

### 6.11 Finance & Telebirr Audit
- `FR-FIN-01`: Filterable transaction ledger and settlement metrics. **Status: Done**
- `FR-FIN-02`: Interactive 4-stage settlement lifecycle timeline. **Status: Done**
- `FR-FIN-03`: Exception resolution matching Telebirr reference to applicant. **Status: Done**
- `FR-FIN-04`: Mandatory written reason refund ledger and printable tax receipts. **Status: Done**

### 6.12 Administration & System Settings
- `FR-ADM-01`: Operational parameters (fee amount, payment deadline window). **Status: Done**
- `FR-ADM-02`: Dynamic rank rules editor with global ripple recalculation. **Status: Done**
- `FR-ADM-03`: Staff account provisioning and instant access suspension. **Status: Done**
- `FR-ADM-04`: Email template editor with live variable preview card. **Status: Done**
- `FR-ADM-05`: Searchable immutable system activity history audit log. **Status: Done**
- `FR-ADM-06`: One-click demo data reset to seed baseline. **Status: Done**

---

## 8. Screens by Role

### Public Screens
1. **Home** (`/`): Architectural hero, 4 altitude waypoints, steps to join, upcoming field activities.
2. **Sign In** (`/sign-in`): Credentials form with collapsible 7 demo accounts one-click fill panel.
3. **Register** (`/register`): First name, last name, username, email, Ethiopian phone, password checklist.
4. **Verify Email** (`/verify-email`): 6-digit code entry with preview inbox simulator.
5. **Forgot Password** (`/forgot-password`): Password reset request form.
6. **Reset Password** (`/reset-password`): Recovery code confirmation and new password entry.
7. **Certificate Verification** (`/check-certificate`): Public verification of issued certificates.
8. **Unauthorized** (`/unauthorized`): Clean role-mismatch feedback screen.

### Applicant Desk
9. **Status Timeline** (`/applicant/status`): Real-time application milestone progress.
10. **Application Form** (`/applicant/apply`): 3-step application with auto-save and photo upload.
11. **Telebirr Payment** (`/applicant/payment`): Countdown timer, push settlement, failure simulation.
12. **Notifications** (`/applicant/notifications`): Applicant inbox for admission updates.

### Volunteer Portal
13. **Trail Home** (`/volunteer/home`): Next activity pass, altitude route line, announcements.
14. **Browse Activities** (`/volunteer/activities`): List and calendar views with filtering.
15. **Activity Detail** (`/volunteer/activities/:id`): Full field brief, join/leave, waitlist.
16. **My Activities** (`/volunteer/my-activities`): Enrolled schedule and attendance status.
17. **Check-In Terminal** (`/volunteer/check-in`): 4-digit code and QR scan interface.
18. **Logged Hours** (`/volunteer/hours`): Hours ledger with manual missed hours submission.
19. **Rank Progress** (`/volunteer/rank-progress`): Elevation route line with threshold checklists.
20. **Certificates** (`/volunteer/certificates`): Printable certificates gallery with QR codes.
21. **ID Pass** (`/volunteer/id-card`): Printable volunteer pass with photo and barcode.
22. **Profile & Preferences** (`/volunteer/profile`): Contact info, photo cropper, notification toggles.

### Team Lead Dispatch
23. **Lead Dispatch** (`/team-lead/home`): Field schedule, attendance codes, quick actions.
24. **Approve Hours** (`/team-lead/approve-hours`): Single and bulk hours approval with reasons.
25. **Lead Activities** (`/team-lead/activities`): Activity management and enrolled rosters.
26. **Create Activity** (`/team-lead/create-activity`): New initiative creation form.
27. **Rate Work** (`/team-lead/ratings`): 5-star evaluation and commendation cards.
28. **Recommend Promotion** (`/team-lead/recommend-promotion`): Written recommendation modal.
29. **Announcements** (`/team-lead/announcements`): Roster broadcast announcements.

### Manager Operations
30. **Operations Dashboard** (`/manager/dashboard`): Operational metrics, review queues, alerts.
31. **Application Queue** (`/manager/applications`): Searchable applicant reviews and notes.
32. **Volunteer Directory** (`/manager/volunteers`): Volunteer registry with altitude trail drawer.
33. **Field Activities** (`/manager/activities`): System-wide activities and roster inspection.
34. **Promotion Board** (`/manager/promotions`): Candidate evidence review and approval modal.
35. **Targeted Bulletins** (`/manager/announcements`): Broadcast composer with rank/area filters.
36. **Feedback Inbox** (`/manager/feedback`): Post-activity volunteer debriefs.
37. **Trail Reports** (`/manager/reports`): SVG elevation hours graph, waypoint funnel, CSV export.

### Finance Terminal
38. **Finance Overview** (`/finance/overview`): Daily/monthly intake, gateway health stats.
39. **Telebirr Ledger** (`/finance/payments`): Filterable transaction ledger with lifecycle drawer.
40. **Needs Review** (`/finance/needs-review`): Payment matching engine and refund processor.
41. **Receipts & Refunds** (`/finance/receipts-refunds`): Issued receipts and printable tax voucher.
42. **Reconciliation Reports** (`/finance/reports`): Settlement balance sheets and CSV export.

### Super Admin Console
43. **System Overview** (`/admin/overview`): System health, throughput, operational summary.
44. **Fee Settings** (`/admin/settings`): Registration fee, deadline, areas, skills, certificate text.
45. **Dynamic Rank Rules** (`/admin/rank-rules`): Qualification threshold matrix editor.
46. **User Accounts** (`/admin/accounts`): Staff provisioning modal and access suspension toggle.
47. **System History** (`/admin/activity-history`): Searchable permanent audit log.

---

## 9. Data Model & Entity Specifications

Entities are strictly typed in `client/src/types/index.ts`:

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  passwordHash?: string;
  role: Role; // 'applicant' | 'volunteer' | 'team_lead' | 'manager' | 'finance' | 'admin'
  accountStatus: AccountStatus; // 'unverified' | 'active' | 'suspended'
  emailVerifiedAt?: string;
  createdAt: string;
  lastSignInAt?: string;
}

export interface VolunteerProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth: string;
  area: string;
  bio: string;
  skills: string[];
  availability: string[];
  languages: string[];
  emergencyContact: EmergencyContact;
  photoUrl?: string;
  idPhotoUrl?: string;
  rank?: Rank; // 'member' | 'senior_member' | 'team_lead' | 'manager'
  memberSince?: string;
  volunteerNumber?: string;
  rankHistory?: RankHistoryMilestone[];
}

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  decisionReason?: string;
  paymentDeadline?: string;
  notes: ApplicationNote[];
  formData?: {
    firstName?: string;
    lastName?: string;
    fullName: string;
    phone: string;
    avatarUrl?: string;
    dateOfBirth: string;
    area: string;
    skills: string[];
    availability: string[];
    motivation: string;
    languages: string[];
    emergencyContact: EmergencyContact;
    photoUrl?: string;
    idPhotoUrl?: string;
  };
}

export interface Payment {
  id: string;
  userId: string;
  applicationId: string;
  amount: number;
  currency: 'ETB';
  telebirrReference: string;
  status: PaymentStatus;
  createdAt: string;
  confirmedAt?: string;
  receiptNumber?: string;
  refundedAt?: string;
  refundReason?: string;
  payerPhone?: string;
  payerName?: string;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  startsAt: string;
  endsAt: string;
  area: string;
  place: string;
  capacity: number;
  minRank?: Rank;
  skills: string[];
  leadId: string;
  leadName?: string;
  status: ActivityStatus;
  checkInCode: string;
  coverUrl?: string;
}

export interface Enrollment {
  id: string;
  activityId: string;
  userId: string;
  status: EnrollmentStatus;
  joinedAt: string;
  leftAt?: string;
}

export interface HoursEntry {
  id: string;
  userId: string;
  activityId: string;
  checkIn: string;
  checkOut?: string;
  minutes: number;
  source: HoursSource;
  status: HoursStatus;
  decidedBy?: string;
  decisionReason?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  activityId: string;
  userId: string;
  ratedBy: string;
  score: number;
  note?: string;
  createdAt: string;
}

export interface RankRule {
  rank: Rank;
  minHours: number;
  minActivities: number;
  minRating: number;
  minMonths: number;
  requiredTraining?: string;
}

export interface Promotion {
  id: string;
  userId: string;
  fromRank: Rank;
  toRank: Rank;
  status: PromotionStatus;
  recommendedBy?: string;
  recommendationNote?: string;
  decidedBy?: string;
  decidedAt?: string;
  decisionNote?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  kind: CertificateKind;
  title: string;
  issuedAt: string;
  verificationCode: string;
  fileUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
}
```

---

## 10. Technology Stack & Directory Architecture

### Architecture Choices
- **React 19 & TypeScript 5**: Type-safe component architecture with clean hooks.
- **Vite 6**: Fast build pipeline and sub-second HMR.
- **Tailwind CSS 3**: Configured with custom design tokens for hard offset shadows, zero-blur elevation, and role-dominant color fields.
- **Phosphor Icons**: Cohesive, industrial bold iconography without mixed symbol styles.
- **Self-Contained Data Layer**: LocalStorage-persisted mock database with configurable artificial latency (`delay.ts`), emulating real asynchronous REST behavior.

### Directory Structure
```
vts-platform/
├── README.md                     # Root documentation
├── docs/
│   ├── REQUIREMENTS.md           # Product requirements document
│   ├── DESIGN_DIRECTION.md       # Art direction and reference citations
│   ├── BUILD_RULES.md            # Aesthetic and coding constraints
│   └── screenshots/              # High-resolution verification captures
└── client/
    ├── package.json
    ├── tailwind.config.js        # Design tokens & hard shadows
    ├── vite.config.ts
    ├── src/
    │   ├── api/                  # Data layer functions (auth, store, seedData)
    │   ├── components/
    │   │   ├── auth/             # ProtectedRoute guards
    │   │   ├── demo/             # Email preview simulator inbox
    │   │   ├── layout/           # AppShellLayout, PublicLayout, PageTransition
    │   │   └── ui/               # Button, Input, Select, TicketPass, Avatar, etc.
    │   ├── context/              # AuthContext session state
    │   ├── pages/
    │   │   ├── public/           # Home, SignIn, Register, VerifyEmail, etc.
    │   │   ├── applicant/        # Status, Apply, Payment, Notifications
    │   │   ├── volunteer/        # Home, Activities, CheckIn, Hours, Rank, Profile
    │   │   ├── team-lead/        # Home, ApproveHours, Activities, Create, Ratings
    │   │   ├── manager/          # Dashboard, Applications, Directory, Reports
    │   │   ├── finance/          # Overview, Payments, NeedsReview, Receipts
    │   │   └── admin/            # Overview, Settings, RankRules, Accounts, History
    │   ├── types/                # Domain models and interfaces
    │   ├── utils/                # Ethiopian phone normalization and helpers
    │   ├── router.tsx            # Application routing hierarchy
    │   └── main.tsx              # Application entry point and fonts
```

---

## 11. How to Run & 8-Step Evaluation Script

### Local Setup
```bash
# 1. Clone repository
git clone https://github.com/eyoba146/volunteer-operations-platform.git
cd volunteer-operations-platform

# 2. Install dependencies
cd client
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Demo Evaluator Accounts
All accounts share the default password: **`Demo@1234`**

| Role | Persona | Username | Initial Scenario State |
| :--- | :--- | :--- | :--- |
| **Applicant** | Hana Tesfaye | `hana.tesfaye` | Application approved; ready to pay ETB 200 Telebirr fee. |
| **Volunteer** | Dawit Bekele | `dawit.bekele` | Active Member; enrolled in cleanup; ready to check in. |
| **Volunteer** | Selam Alemu | `selam.alemu` | Senior Member; 168 hrs; ready for Team Lead promotion. |
| **Team Lead** | Yonas Kebede | `yonas.kebede` | Field lead; has hours to approve and ratings to submit. |
| **Manager** | Marta Girma | `marta.girma` | Evaluates applicant queue and decides promotion boards. |
| **Finance Officer** | Abel Hailu | `abel.hailu` | Audits Telebirr intake; 2 unassigned payments to review. |
| **Super Admin** | Ruth Mengistu | `ruth.mengistu` | Modifies fee settings, calibrates rank rules, audits history. |

### Resetting Demo Data
Click **Reset Demo** in the top navigation or in the Demo panel, or open browser console and execute:
```javascript
localStorage.clear();
window.location.reload();
```

### 8-Step Walkthrough Script
1. **Applicant Registration**: Register a new user at `/register` with phone `0911 234 567`. Retrieve the 6-digit code in the **Preview Emails** modal to verify email.
2. **Application Submission**: Fill out personal area, skills, and emergency contact at `/applicant/apply`.
3. **Telebirr Fee Settlement**: Sign in as `hana.tesfaye`. Go to `/applicant/payment`, initiate Telebirr push, confirm payment, unlock Member rank, and view the printable ID pass.
4. **Field Duty & Check-In**: Sign in as `dawit.bekele`. Join an activity at `/volunteer/activities`, enter check-in code `7294` at `/volunteer/check-in`, and submit missed hours.
5. **Team Lead Verification**: Sign in as `yonas.kebede`. Go to `/team-lead/approve-hours`, approve Dawit's hours, submit a 5-star rating at `/team-lead/ratings`, and recommend Selam for promotion.
6. **Manager Promotion Board**: Sign in as `marta.girma`. Navigate to `/manager/promotions`, inspect Selam Alemu's verified evidence dossier, and approve the promotion. Sign in as `selam.alemu` to verify immediate routing to `/team-lead/home`.
7. **Finance Payment Matching**: Sign in as `abel.hailu`. Open `/finance/needs-review`, match unassigned transaction `pay-rev-01` to applicant Biruk Tadesse, activate membership, and export the reconciliation CSV.
8. **Super Admin Governance**: Sign in as `ruth.mengistu`. Update the onboarding fee in `/admin/settings`, modify rank thresholds in `/admin/rank-rules`, and inspect the logged changes in `/admin/activity-history`.

---

## 12. Backend Integration Guide

When connecting this front-end to a production backend, replace the local state implementations in `client/src/api/` with HTTP calls to Express endpoints backed by PostgreSQL on Supabase:

| API Function in `src/api/` | Target Express Endpoint | Method | Database Table | External Services |
| :--- | :--- | :--- | :--- | :--- |
| `signIn(ident, pass)` | `/api/auth/sign-in` | `POST` | `users` | Argon2 password hashing |
| `register(fName, lName, ...)` | `/api/auth/register` | `POST` | `users`, `profiles` | Brevo email with verification code |
| `verifyEmail(email, code)` | `/api/auth/verify-email` | `POST` | `users` | - |
| `updateProfilePhoto(userId, url)` | `/api/users/:id/photo` | `PATCH` | `users`, `profiles` | Cloudinary 400px image upload |
| `submitApplication(userId, data)` | `/api/applications` | `POST` | `applications` | - |
| `decideApplication(appId, ...)` | `/api/applications/:id/decision` | `POST` | `applications` | Brevo acceptance email |
| `initiateTelebirrPayment(appId)` | `/api/payments/telebirr/push` | `POST` | `payments` | Telebirr B2C / H5 Payment API |
| `handleTelebirrWebhook(payload)` | `/api/payments/telebirr/callback`| `POST` | `payments`, `users` | Brevo payment receipt email |
| `getActivities(filter)` | `/api/activities` | `GET` | `activities` | - |
| `enrollActivity(actId, userId)` | `/api/activities/:id/enroll` | `POST` | `enrollments` | - |
| `checkIn(userId, code)` | `/api/hours/check-in` | `POST` | `hours_entries` | - |
| `approveHours(hoursId, reason)` | `/api/hours/:id/approve` | `POST` | `hours_entries` | - |
| `rateVolunteer(actId, userId, ...)`| `/api/ratings` | `POST` | `ratings` | - |
| `decidePromotion(promoId, ...)` | `/api/promotions/:id/decision` | `POST` | `promotions`, `certificates` | Cloudinary PDF certificate |
| `matchUnassignedPayment(payId)` | `/api/finance/payments/:id/match`| `POST` | `payments`, `users` | Tax receipt generation |
| `updateRankRule(rank, data)` | `/api/admin/rank-rules/:rank` | `PUT` | `rank_rules` | Audit log event |

### Suggested Environment Variables
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
JWT_SECRET=super-secret-jwt-key
TELEBIRR_APP_ID=your_telebirr_app_id
TELEBIRR_APP_KEY=your_telebirr_app_key
TELEBIRR_SHORTCODE=884120
TELEBIRR_PUBLIC_KEY=your_telebirr_public_key
BREVO_API_KEY=xkeysib-your_brevo_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

---

## 13. Design Direction & Style Tokens

### Visual Philosophy
The Trail design system uses bold, rectangular, high-contrast layouts. Surfaces are crisp white and flat solid role bands over a cool off-white canvas (`#F4F5F7`). All components avoid generic tech aesthetics:
- **Borders**: 2 px solid near-black (`#111111`) on all interactive cards, dialogs, inputs, and navigation bars.
- **Hard Offset Shadows**: Shadows have zero blur (`4px 4px 0 #111111` or `6px 6px 0 #111111`). Buttons depress on click (`translate-x-[2px] translate-y-[2px]`, shadow drops to 0).
- **Secondary Surfaces**: Styled with 2 px borders and no shadow to create a clear visual hierarchy without clutter.
- **Typography**: Headlines and big numerals in **Bricolage Grotesque ExtraBold** (`font-display font-black`). Body text and descriptions in **Hanken Grotesk** (`font-sans`), minimum 16 px base with generous 1.6 line height.
- **Labels**: Sentence-case only (`text-sm font-bold text-ink-primary`). Uppercase monospace labels are banned.
- **Icons**: Phosphor Icons in bold weight with bordered square frames. Emojis and Lucide icons are strictly prohibited.

### Adding a New Screen
1. Wrap page contents with `<PageTransition>` in `client/src/router.tsx`.
2. Nest inside `AppShellLayout` to automatically inherit the active role header and floating mobile dock.
3. Use `<TicketPass>` or `<div className="bg-white border-2 border-ink-primary shadow-[4px_4px_0_#111111] p-6">` for primary modules.
4. Use standard form controls (`<Input>`, `<Select>`, `<Button>`) from `client/src/components/ui/`.
5. Ensure 16 px base text, sentence-case headings, and tap targets of at least 44 px.

---

## 14. Known Limitations & Roadmap

### Known Prototype Limitations
- **Simulated Third-Party Services**: Telebirr push prompts, Cloudinary file uploads, and Brevo transactional emails run as in-browser simulations rather than real external network requests.
- **Local Persistence**: State changes persist within the browser's `localStorage`; opening the prototype in a private browsing window resets state to initial seed data.
- **Multi-Device Sync**: Because state resides in local storage, changes made on one device or browser do not automatically sync to another.
- **SMS Gateways**: Mobile phone verification relies on the in-app preview email simulator rather than physical SMS shortcodes.

### Production Roadmap
- [ ] Connect Express and Node.js REST API layer.
- [ ] Deploy PostgreSQL schema and indexes on Supabase.
- [ ] Integrate Ethio Telecom Telebirr direct merchant credentials and webhook signature verification.
- [ ] Provision Cloudinary signed upload presets for volunteer ID photos and PDF certificate rendering.
- [ ] Implement Twilio / Ethio Telecom SMS gateway for instant phone OTP verification.
- [ ] Configure automated background worker for expired payment deadline cancellations.

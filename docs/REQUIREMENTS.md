# VTS (Volunteer Tracking System): Requirements Specification

Version 2.0 | Prototype phase | Status: verified against production codebase

## 1. Purpose and scope

VTS is a responsive web platform (desktop and mobile) that lets an organization run its volunteer operations from start to finish: recruit candidates online or in-person, collect registration fees through Telebirr, manage a four-tier organization hierarchy, charter community projects, deploy volunteers with designated supervisors, verify attendance with on-site short codes and photo evidence, decide merit promotions, and disburse daily field allowances under strict budget ceilings and separation of duties.

### 1.1 Goals

- Replace scattered spreadsheets, chat groups, and paper sign-in sheets with a single trusted system of record.
- Support dual onboarding paths: self-registered online applicants and staff-assisted in-person walk-in intakes.
- Provide transparent rank progression: volunteers see exactly what thresholds remain to reach the next seniority rank.
- Enforce strict financial controls: automated Telebirr fee collection, manual cash receipts, and four-eye allowance approvals preventing budget overdrafts.
- Provide managers, finance officers, and governance administrators with trustworthy, filterable reports and one-click exports.

### 1.2 Out of scope for version 1

Native mobile apps, peer-to-peer volunteer messaging, multi-language interface localizations (English only for prototype), credit card processing (Telebirr only), and integration with external enterprise HR suites.

### 1.3 Assumptions

| ID | Assumption |
| :--- | :--- |
| A1 | The client is an Ethiopian community service organization operating across major urban centers (Addis Ababa, Adama, Hawassa, Bishoftu, Bahir Dar). |
| A2 | Payment happens after acceptance: apply, get reviewed and accepted, pay the registration fee, become an active Volunteer. Rejected applicants never pay. |
| A3 | The registration fee is a single fixed amount set by the Super Admin (prototype default: ETB 200). Hardship waivers are available via assisted intake. |
| A4 | Telebirr confirms payments automatically via webhooks. A manual Finance review queue exists as an exception fallback. |
| A5 | Rank thresholds are configurable by the Super Admin; default requirements are specified in Section 5. |
| A6 | The system standardizes on Gregorian calendar dates and ETB currency. |
| A7 | Self-registering volunteers must be 18 or older; younger participants join only through assisted intake with documented guardian consent. |

---

## 2. Roles and permissions

There are six distinct operational roles. Each person signs in with their own account; there is no role switching. A person holds exactly one role at a time, which elevates permanently upon promotion or administrative appointment.

| Role | Operational Scope | Core Responsibilities |
| :--- | :--- | :--- |
| **Applicant** | Own profile | Complete application, upload identity documents, replace returned files, pay registration fee. |
| **Volunteer** | Own records | Join activities, check in with short codes, log manual hours with evidence, track rank, request allowances. |
| **Team Lead** | Branch | Create activities, display check-in codes, verify attendance and evidence, rate volunteers, recommend promotions. |
| **Manager** | Area | Review applications, register assisted walk-ins, charter projects, assign volunteers, prepare allowances, decide promotions. |
| **Finance Officer** | Head Office | Monitor Telebirr settlements, record manual branch cash receipts, resolve payment exceptions, disburse allowances. |
| **Super Admin** | Nationwide (All) | Maintain organization tree, edit dynamic permissions matrix, approve allowance budgets, manage rank rules and staff. |

### 2.1 Permission Summary Matrix

| Capability | Applicant | Volunteer | Team Lead | Manager | Finance | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| Edit own profile & security | Yes | Yes | Yes | Yes | Yes | Yes |
| Submit & track application | Yes | - | - | - | - | - |
| Pay registration fee | Yes | - | - | - | - | - |
| Browse & join activities | - | Yes | Yes | Yes | - | - |
| Create & schedule activities | - | - | Yes | Yes | - | - |
| Approve duty hours | - | - | Yes (Branch) | Yes (Area) | - | - |
| Rate volunteer performance | - | - | Yes | Yes | - | - |
| Review applications & files | - | - | - | Yes | - | View |
| Assisted in-person intake | - | - | - | Yes | - | - |
| Charter community projects | - | - | - | Yes | - | Yes |
| Assign volunteers & supervisors | - | - | - | Yes | - | Yes |
| Prepare field allowances | - | - | - | Yes | - | - |
| Verify allowance attendance | - | - | Yes (Branch) | - | - | - |
| Approve allowance budget | - | - | - | - | - | Yes |
| Disburse Telebirr payouts | - | - | - | - | Yes | - |
| Approve promotions | - | - | Recommend | Up to Team Lead | - | Manager rank |
| View payments & issue receipts| Own | - | - | Branch | Yes | Yes |
| Resolve payment exceptions | - | - | - | - | Yes | - |
| Manage organization tree | - | - | - | - | - | Yes |
| Configure dynamic permissions | - | - | - | - | - | Yes |

---

## 3. The Volunteer Journey

1. **Registration**: The individual creates an account online with email, Ethiopian phone, and password, confirming email address with a 6-digit confirmation code. Alternatively, a manager registers them in-person via assisted intake.
2. **Application & Files**: The applicant completes interest and skills surveys and uploads required documents (Kebele ID, portrait photo, recommendation letter).
3. **Manager Review**: Program managers evaluate the dossier. If an upload is unclear, the manager returns it for correction with an explanatory note; the applicant replaces it.
4. **Acceptance & Window**: The admissions board accepts qualified applicants, initiating a 7-day payment window countdown.
5. **Fee Settlement**: The applicant pays the registration fee via Telebirr mobile push (or manager records manual cash/waiver).
6. **Activation & ID Pass**: Confirmed payment immediately transitions the account to active **Volunteer** rank, issuing a verifiable ID pass with QR code and welcome materials.
7. **Deployment & Check-In**: The volunteer joins open activities or accepts project assignments from managers. On-site check-in uses a 4-digit code generated by the Team Lead.
8. **Hours Audit & Evidence**: Team Leads audit attendance minutes and inspect photo evidence for manual duty logs, approving or declining hours with reasons.
9. **Rank Elevation**: As verified hours, completed activities, tenure, and ratings satisfy threshold rules, candidates become eligible for board review and elevation to Senior Volunteer, Team Lead, or Manager.

---

## 4. Financial Operations

### 4.1 Money In (Registration Fees)
- Accepted applicants initiate Telebirr C2B push payments from the payment terminal.
- Successful transactions activate the volunteer account instantly and generate an official receipt.
- Network delays or transaction ID discrepancies route to the Finance Needs Review queue for reconciliation.
- Walk-in applicants can pay via cash or bank deposit at branch offices, with Finance Officers issuing manual receipts.
- Refunds can be issued by Finance Officers with mandatory justification notes.

### 4.2 Money Out (Allowances & Stipends)
- Managers prepare field allowance requests (`days * allowancePerDay`) linked to approved service within remaining project budgets.
- Supervising Team Leads verify physical field service attendance.
- Super Admin acts as Budget Authority, approving expenditure and reserving project funds.
- Four-Eye Principle: No manager can approve an allowance they prepared, and volunteers cannot approve their own requests.
- Finance Officers execute disbursements via simulated Telebirr B2C mobile wallet payouts (`TB-OUT-2026-XXXXXX`). Failed transfers support retries.

---

## 5. Ranks and Promotion

### 5.1 Rank Ladder

| Rank Title | Role Unlocked | Operational Privileges |
| :--- | :--- | :--- |
| **Volunteer** | Volunteer | Join open field activities, obtain digital volunteer ID pass, earn verified duty hours. |
| **Senior Volunteer** | Volunteer | Priority shift enrollment, mentor newer volunteers, Senior Volunteer badge and certificate. |
| **Team Lead** | Team Lead | Dispatch field activities, display check-in codes, verify hours and evidence, rate volunteers, recommend promotions. |
| **Manager** | Manager | Review applicant dossiers, register walk-ins, charter projects, assign volunteers, prepare allowances, decide promotions. |

### 5.2 Starting Default Thresholds (Configurable by Super Admin)

| Target Rank | Approved Hours | Completed Activities | Minimum Rating | Active Tenure | Mandatory Course | Approving Authority |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Senior Volunteer** | 50 hrs | 10 | 4.0 / 5.0 | 3 months | Advanced Field Leadership | Regional Manager Board |
| **Team Lead** | 150 hrs | 25 | 4.5 / 5.0 | 6 months | Crisis Intervention & Safety | Regional Manager Board |
| **Manager** | 300 hrs | 50 (5 led) | 4.8 / 5.0 | 12 months | Operational Governance | Executive Board / Super Admin |

---

## 6. Functional Requirements Inventory

### 6.1 Registration and Authentication
- `FR-REG-01`: Self-registration form with Ethiopian mobile number normalization (`+2519...`).
- `FR-REG-02`: Email confirmation using simulated 6-digit confirmation codes expiring in 15 minutes.
- `FR-REG-03`: Real-time password complexity checklist.
- `FR-REG-04`: Duplicate prevention on username and email addresses.

### 6.2 Application and Intake
- `FR-APP-01`: Multi-step application wizard with draft saving.
- `FR-APP-02`: Capture of regional area, motivation, skills catalog, and emergency contacts.
- `FR-APP-03`: Manager application review queue with dossier drawers and private review notes.
- `FR-APP-04`: Automated acceptance letters and configurable payment window countdowns.

### 6.3 Payments and Registration Fees
- `FR-PAY-01`: Telebirr push payment simulation terminal for accepted applicants.
- `FR-PAY-02`: Simulation modes for payment success, gateway delay, and user cancellation.
- `FR-PAY-03`: Finance exception review queue for resolving payment discrepancies.
- `FR-PAY-04`: Official manual cash/bank receipt generation with printable passes.

### 6.4 Activation and Onboarding
- `FR-ONB-01`: Instant transition to active Volunteer status upon payment confirmation.
- `FR-ONB-02`: Official printable Volunteer ID pass with QR verification code.
- `FR-ONB-03`: Welcome announcement and induction packet delivery.

### 6.5 Activities and Field Operations
- `FR-ACT-01`: Public and authenticated activity browsing with type, area, and skill filters.
- `FR-ACT-02`: Team Lead activity creation with capacity limits and project linkages.
- `FR-ACT-03`: Volunteer enrollment and automated waitlist promotion.
- `FR-ACT-04`: Live activity rosters with 4-digit check-in short code display.

### 6.6 Duty Hours and Attendance
- `FR-HRS-01`: On-site check-in via 4-digit short codes.
- `FR-HRS-02`: Automatic duty duration calculation capped at scheduled end time plus 1 hour.
- `FR-HRS-03`: Manual hours logging with mandatory explanation notes and photo evidence.
- `FR-HRS-04`: Team Lead hours approval and photo evidence inspection scoped to branch.
- `FR-HRS-05`: Single and bulk hours approval workflows with mandatory decline reasons.

### 6.7 Training and Certifications
- `FR-TRN-01`: Training courses modeled as activities that mark completion upon attendance approval.
- `FR-TRN-02`: Verified course completions count directly toward rank promotion eligibility.
- `FR-CRT-01`: Certificates generated for induction, rank milestones, and completed training courses.
- `FR-CRT-02`: Public verification code check page (`/check-certificate`) requiring no sign-in.
- `FR-CRT-03`: Printable digital certificate passes.

### 6.8 Ratings and Performance
- `FR-RAT-01`: Numerical 1 to 5 performance ratings submitted by Team Leads following activities.
- `FR-RAT-02`: Volunteer feedback submission channel to program management.
- `FR-RAT-03`: Average rating calculation displayed on profile and evaluated in promotions.

### 6.9 Promotions and Governance
- `FR-PRM-01`: Real-time visual progress tracker toward next rank milestones.
- `FR-PRM-02`: Candidate eligibility roster with immutable evidence summaries.
- `FR-PRM-03`: Promotional board decisions requiring written rationale.
- `FR-PRM-04`: Dynamic role updating, rank history recording, and certificate issuance upon approval.

### 6.10 Announcements and Notifications
- `FR-NTF-01`: Targeted announcements filtered by audience (all, rank, area, or activity roster).
- `FR-NTF-02`: Real-time in-app notification bell with unread badge count.
- `FR-NTF-03`: Transactional email previews for verification, decisions, and schedule changes.
- `FR-NTF-04`: Multi-channel notification preferences (In-app, Brevo email, SMS shortcode 8080).

### 6.11 Reports and Analytics
- `FR-RPT-01`: Manager operational dashboard metrics (applications, hours, active projects).
- `FR-RPT-02`: Demographic distribution, cumulative hours, and recruitment funnel reports.
- `FR-RPT-03`: Finance revenue ledgers, stipend expenditures, and exception logs.
- `FR-RPT-04`: Client-side simulated export to Excel (`.xlsx`) and formal PDF documents.

### 6.12 System Administration
- `FR-ADM-01`: System settings editor (registration fee, payment deadline, rank thresholds).
- `FR-ADM-02`: Staff account provisioning and status management.
- `FR-ADM-03`: Searchable system activity history and security audit log.
- `FR-ADM-04`: Transactional email template editor with dynamic previewing.

### 6.13 Organisation Structure and Scoping
- `FR-ORG-01`: Four-tier hierarchy: Head Office, Area, Branch, Location.
- `FR-ORG-02`: Hierarchical scoping engine (`all`, `area`, `branch`, `own`) filtering all records.
- `FR-ORG-03`: Branch assignments on all volunteer and staff accounts.
- `FR-ORG-04`: Interactive organization tree management with add, edit, move, and archive actions.

### 6.14 Assisted Walk-In Registration
- `FR-AST-01`: Four-step manager assisted registration wizard for field and walk-in applicants.
- `FR-AST-02`: Immediate Kebele ID capture and manual fee recording or hardship waiver.
- `FR-AST-03`: Instant volunteer activation bypassing online application delays.

### 6.15 Dynamic Security and Permissions
- `FR-SEC-01`: 16-module role permission matrix with granular action toggles.
- `FR-SEC-02`: Automatic account lockout after 5 consecutive failed sign-in attempts within 15 minutes.
- `FR-SEC-03`: Sign-in audit log recording timestamp, IP address, user agent, and failure reasons.

### 6.16 Community Projects
- `FR-PRJ-01`: Branch community projects with ETB budgets and daily stipend allowance rates.
- `FR-PRJ-02`: Activities link directly to parent projects; Team Leads select branch projects.
- `FR-PRJ-03`: Project overview displays remaining budget as a prominent lead numeral with spent and reserved funds inline.
- `FR-PRJ-04`: Project detail displays assigned volunteers and activities as physical ticket passes.

### 6.17 Assignments and Supervisors
- `FR-ASN-01`: Managers assign volunteers to projects or activities, designating a supervising Team Lead.
- `FR-ASN-02`: Assignment lifecycle: `assigned`, `accepted`, `declined`, `completed`.
- `FR-ASN-03`: Volunteers view deployments in "My roster" marked "Assigned by [Manager]" with Accept and Decline actions.
- `FR-ASN-04`: Team Leads have a "My volunteers" directory showing supervised individuals and approved hours.

### 6.18 Verification Documents and Evidence
- `FR-DOC-01`: Super Admin catalog of required verification documents (National ID, Photo, Recommendation, Clearance).
- `FR-DOC-02`: Applicants upload verification files with name, file size, and preview.
- `FR-DOC-03`: Managers review uploads with Accept or Return for correction with mandatory note; applicants see correction alerts.
- `FR-DOC-04`: Volunteers attach photo evidence to manual hours and field submissions ("Submit a completed activity"); Team Leads inspect evidence scoped to their branch.

### 6.19 Field Allowances (Money Out)
- `FR-ALW-01`: Allowance lifecycle: `draft`, `submitted`, `verified`, `approved`, `paid`, `rejected`, `failed`.
- `FR-ALW-02`: Manager prepares allowance request within the project's remaining available budget.
- `FR-ALW-03`: Supervising Team Lead verifies physical field attendance.
- `FR-ALW-04`: Super Admin (Budget Authority) approves request, reserving project budget funds.
- `FR-ALW-05`: Strict separation of duties: nobody can approve an allowance they prepared, and volunteers cannot approve their own requests.
- `FR-ALW-06`: Finance Officers disburse funds via simulated Telebirr B2C mobile wallet payouts with transaction reference.
- `FR-ALW-07`: Volunteers track stipend progress with a journey log timeline and celebration overlay upon payout.

---

## 7. Screens by Role

- **Public**: Home (`/`), Sign In (`/sign-in`), Register (`/register`), Verify Email (`/verify-email`), Forgot Password (`/forgot-password`), Reset Password (`/reset-password`), Public Certificate Check (`/check-certificate`), Access Denied (`/unauthorized`).
- **Applicant**: Status & Documents (`/applicant/status`), Apply Form (`/applicant/apply`), Payment (`/applicant/payment`), Notifications (`/applicant/notifications`).
- **Volunteer**: Home (`/volunteer/home`), Activities (`/volunteer/activities`), Activity Detail (`/volunteer/activities/:id`), My Deployments (`/volunteer/my-activities`), Check-in Terminal (`/volunteer/check-in`), Hours & Evidence (`/volunteer/hours`), Field Allowances (`/volunteer/allowances`), Rank Progress (`/volunteer/rank-progress`), Certificates (`/volunteer/certificates`), ID Pass (`/volunteer/id-card`), Profile & Security (`/volunteer/profile`).
- **Team Lead**: Dispatch Home (`/team-lead/home`), Create Activity (`/team-lead/create-activity`), Activities Roster (`/team-lead/activities`), Approve Hours & Evidence (`/team-lead/approve-hours`), My Volunteers (`/team-lead/volunteers`), Verify Allowances (`/team-lead/allowances`), Rate Volunteers (`/team-lead/ratings`), Recommend Promotion (`/team-lead/recommend-promotion`), Team Announcements (`/team-lead/announcements`).
- **Manager**: Operations Dashboard (`/manager/dashboard`), Applications Review (`/manager/applications`), Assisted Registration (`/manager/register-volunteer`), Volunteer Directory (`/manager/volunteers`), Community Projects (`/manager/projects`), Project Detail & Budgets (`/manager/projects/:id`), Prepare Allowances (`/manager/allowances`), Regional Activities (`/manager/activities`), Promotion Board (`/manager/promotions`), Announcements (`/manager/announcements`), Feedback Inbox (`/manager/feedback`), Reports & Exports (`/manager/reports`).
- **Finance Officer**: Overview (`/finance/overview`), Payments Ledger (`/finance/payments`), Review Queue (`/finance/needs-review`), Receipts & Refunds (`/finance/receipts-refunds`), Pay Allowances (`/finance/allowances`), Reports (`/finance/reports`).
- **Super Admin**: System Overview (`/admin/overview`), Organisation Tree (`/admin/organisation`), Role Permissions Matrix (`/admin/roles-permissions`), Budget Approvals (`/admin/allowances`), Settings & Documents (`/admin/settings`), Rank Rules (`/admin/rank-rules`), User Accounts (`/admin/accounts`), Activity History & Lockout Logs (`/admin/activity-history`).

---

## 8. Data Model Specification

| Entity Name | Primary Key | Key Fields | Key Relationships |
| :--- | :--- | :--- | :--- |
| `User` | `id` | `username`, `email`, `firstName`, `lastName`, `phone`, `role`, `accountStatus`, `branchId` | Belongs to `OrgUnit` |
| `SignInLogEntry` | `id` | `timestamp`, `ipAddress`, `userAgent`, `result`, `failureReason` | Belongs to `User` |
| `OrgUnit` | `id` | `name`, `type`, `code`, `status`, `parentId` | Self-referencing tree |
| `RolePermissionConfig` | `role` | `permissions` (module -> action[]), `scope` | Per role |
| `VolunteerProfile` | `userId` | `fullName`, `dateOfBirth`, `area`, `skills`[], `rank`, `volunteerNumber` | 1-to-1 with `User` |
| `Application` | `id` | `userId`, `status`, `source`, `formData`, `submittedAt`, `paymentDeadline` | Belongs to `User` |
| `ApplicationDocument` | `id` | `applicationId`, `configId`, `name`, `fileName`, `fileUrl`, `status`, `reviewNote` | Belongs to `Application` |
| `RequiredDocumentConfig` | `id` | `name`, `description`, `required` | Configuration |
| `Payment` | `id` | `userId`, `applicationId`, `amount`, `telebirrReference`, `receiptNumber`, `status` | Belongs to `User`, `Application` |
| `Project` | `id` | `name`, `description`, `branchId`, `budget`, `allowancePerDay`, `status`, `managerId` | Belongs to `OrgUnit`, `User` |
| `Activity` | `id` | `title`, `type`, `startsAt`, `endsAt`, `capacity`, `checkInCode`, `status`, `projectId` | Belongs to `Project`, `OrgUnit` |
| `Enrollment` | `id` | `activityId`, `userId`, `status` | Links `User` to `Activity` |
| `Assignment` | `id` | `projectId`, `activityId`, `volunteerId`, `supervisorId`, `status`, `startDate` | Links `User`, `Project`, `User` |
| `HoursEntry` | `id` | `userId`, `activityId`, `checkIn`, `checkOut`, `minutes`, `status`, `evidenceUrl` | Links `User` to `Activity` |
| `Rating` | `id` | `activityId`, `userId`, `ratedBy`, `score`, `note` | Links `User`, `Activity`, `User` |
| `Promotion` | `id` | `userId`, `fromRank`, `toRank`, `status`, `recommendedBy`, `decidedBy`, `note` | Belongs to `User` |
| `Certificate` | `id` | `userId`, `kind`, `title`, `issuedAt`, `verificationCode`, `fileUrl` | Belongs to `User` |
| `Announcement` | `id` | `authorId`, `audience`, `title`, `body`, `createdAt` | Belongs to `User` |
| `Notification` | `id` | `userId`, `title`, `body`, `readAt`, `link` | Belongs to `User` |
| `ActivityLogEntry` | `id` | `actorId`, `actorName`, `action`, `subject`, `createdAt` | Belongs to `User` |
| `Setting` | `key` | `value` | Global settings |
| `EmailTemplate` | `id` | `name`, `subject`, `body`, `variables`[] | Email configuration |
| `AllowanceRequest` | `id` | `allowanceNumber`, `projectId`, `volunteerId`, `days`, `totalAmount`, `status`, `preparedBy`, `supervisorId`, `approvedBy` | Links `Project`, `User`, `User`, `User` |
| `DisbursementDetails` | `transactionId` | `provider`, `phone`, `fee`, `timestamp`, `networkRef` | Embedded in `AllowanceRequest` |

---

## 9. Non-Functional Standards

- **Zero Borders Rule**: No structural borders anywhere in the interface. All spatial separation is achieved using `#FFFFFF` canvas, `#F7F8FA` tonal fills, generous whitespace, and the single approved soft shadow.
- **Editorial Typography**: Bricolage Grotesque for bold display numerals and headlines; Hanken Grotesk for clean, highly readable body copy. Sentence case strictly enforced.
- **Plain Language Policy**: Technical jargon (such as API, token, database, directorate, civic, institutional) is strictly forbidden in user-facing text.
- **Iconography**: Phosphor icons in bold weight only. No emojis, no Lucide.
- **Responsive Layouts**: Fully responsive at 360 px mobile viewports and 1440 px desktop monitors.
- **State Coverage**: Every screen includes dedicated loading, empty, and error states.

---

## 10. Evaluation Demo Accounts and Script

All demo accounts use the standard password: **`Demo@1234`**

| Role | Name | Username | Branch Scope | Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Applicant** | Hana Tesfaye | `hana.tesfaye` | Addis Ababa Area | Accepted; ready to pay registration fee via Telebirr. |
| **Volunteer** | Dawit Bekele | `dawit.bekele` | Kirkos Branch, Addis Ababa | Active volunteer; logs field hours and tracks stipends. |
| **Senior Volunteer** | Selam Alemu | `selam.alemu` | Bole Branch, Addis Ababa | Eligible for promotion to Team Lead. |
| **Team Lead** | Yonas Kebede | `yonas.kebede` | Kirkos Branch, Addis Ababa | Dispatches rosters, displays check-in codes, verifies hours. |
| **Team Lead** | Henok Assefa | `henok.assefa` | Adama Central Branch | Supervises Adama projects; verifies attendance for allowances. |
| **Manager** | Marta Girma | `marta.girma` | Addis Ababa Area | Reviews applications, charters projects, prepares allowances. |
| **Manager** | Tigist Wolde | `tigist.wolde` | Adama Area | Exercises regional scoping; registers walk-ins via assisted intake. |
| **Finance Officer** | Abel Hailu | `abel.hailu` | Head Office (All Scope) | Reconciles Telebirr fees; disburses mobile wallet allowances. |
| **Super Admin** | Ruth Mengistu | `ruth.mengistu` | Head Office (All Scope) | Manages organization tree, approves allowance budgets, sets permissions. |

### Evaluation Demo Script

1. **Assisted Intake**: Sign in as `tigist.wolde` (Manager, Adama). Open `/manager/register-volunteer`. Register a new volunteer in-person via the 4-step wizard with Kebele ID and manual cash receipt.
2. **Document Correction Notice**: Sign in as `marta.girma` (Manager, Addis Ababa). Open `/manager/applications`. Open an application dossier, click **Return for correction**, and submit a note explaining that the uploaded Kebele ID is blurry.
3. **Document Replacement & Payout**: Sign in as `hana.tesfaye` (Applicant). Open `/applicant/status`. See the correction alert, upload a replacement file, and proceed to `/applicant/payment`. Pay the ETB 200 fee with simulated Telebirr success to unlock active volunteer status.
4. **Project Charter & Budget Tracking**: Sign in as `marta.girma`. Open `/manager/projects`. Observe the remaining budget lead figure for the Kirkos Clean & Green Initiative. Open `/manager/projects/proj-kirkos-green` to inspect linked ticket activities and assigned volunteers.
5. **Allowance Preparation**: Still signed in as `marta.girma`, open `/manager/allowances`. Prepare a 3-day field allowance for `dawit.bekele` under the Kirkos project, choosing `yonas.kebede` as supervising Team Lead. Verify that preparing an amount exceeding remaining project funds is blocked.
6. **Supervisor Attendance Verification**: Sign in as `yonas.kebede` (Team Lead). Open `/team-lead/allowances`. Inspect the attendance record and click **Verify attendance** with a confirmation note.
7. **Budget Authority Sign-Off**: Sign in as `ruth.mengistu` (Super Admin). Open `/admin/allowances`. Observe that Marta Girma is barred from approving what she prepared. Click **Approve budget** as Budget Authority, reserving the funds from the project budget.
8. **Telebirr Disbursement**: Sign in as `abel.hailu` (Finance). Open `/finance/allowances`. Select the approved allowance, open the disbursement sheet, choose Telebirr mobile wallet, and click **Disburse funds**. Notice the generation of a transaction reference (`TB-OUT-2026-XXXXXX`).
9. **Volunteer Stipend Celebration**: Sign in as `dawit.bekele` (Volunteer). Open `/volunteer/allowances`. Inspect the verified journey log, view the Telebirr payment reference, and trigger the celebratory payout moment.

# Volunteer Tracking System (VTS)

VTS is a comprehensive operational platform designed to manage community service programs and volunteer operations across Ethiopian cities. It coordinates every phase of volunteerism: online and staff-assisted recruitment, Telebirr registration fee settlement, field deployments, on-site check-in with supervisor attendance verification, rank promotions based on merit and verifiable service hours, and field allowance disbursements with budget ceilings and strict separation of duties.

---

## 1. Overview

### What VTS Is
VTS is an operational system of record built for civic and community organizations operating across multiple regional areas and branches in Ethiopia. It transforms volunteer coordination from fragmented chat groups and paper rosters into a transparent, verifiable operational workflow.

### Who It Is For
- **Volunteers and Applicants**: Individuals who dedicate their time to civic, health, environmental, and educational community projects, earning verifiable service credentials and rank advancement.
- **Team Leads**: Experienced volunteers who coordinate field operations, generate attendance check-in codes, inspect evidence, audit duty hours, and mentor newer volunteers.
- **Program Managers**: Operations staff responsible for admissions review, staff-assisted registration, project chartering, volunteer deployments, broadcast communications, and allowance preparations.
- **Finance Officers**: Financial controllers who reconcile incoming Telebirr settlements, record manual branch cash/bank receipts, resolve payment exceptions, and disburse field allowances via mobile wallet rails.
- **Super Administrators**: Governance executives who manage the four-tier organizational hierarchy, configure role permission matrixes, calibrate rank promotion rules, and monitor system security logs.

### What the Prototype Covers
The current prototype is a fully functioning front-end implementation with an in-memory reactive data layer that persists state to local browser storage. It features:
- All 6 authenticated roles with distinct navigation, permission gates, and scopes.
- 4-tier organization tree (Head Office, Area, Branch, Location) with hierarchical data filtering.
- Dual registration pathways: self-service online application and manager-assisted walk-in registration.
- Complete money-in workflow (Telebirr push simulation with success, failure, and network delay modes, plus manual branch receipts).
- Complete money-out workflow (multi-stage field allowances with budget verification, supervisor attendance checks, budget authority sign-off, and Telebirr disbursement).
- Strict separation of duties enforced across promotions, hours approvals, and allowance workflows.
- Verification evidence attachment for manual hours and field submissions without check-in codes.
- Zero-border editorial visual design using tone, space, and soft shadows.

### What Is Planned for Backend Production
- Node.js and Express REST API backend with JSON Web Token (JWT) sessions and argon2 password hashing.
- PostgreSQL database hosted on Supabase with row-level security policies mirroring client scoping rules.
- Live Telebirr integration using official Ethio Telecom C2B (collection) and B2C (disbursement) HTTPS endpoints with RSA signature verification.
- Brevo transactional email delivery and Ethio Telecom shortcode 8080 SMS integration.
- Cloudinary secure bucket storage for official identity documents, verification photos, and generated PDF certificates.

---

## 2. Key Concepts in Plain Words

- **Role**: A person's operational identity in the system (Applicant, Volunteer, Team Lead, Manager, Finance Officer, Super Admin). A person holds exactly one role at a time, which dictates their default workspace layout and permissions.
- **Rank**: A volunteer's earned level of seniority (Volunteer, Senior Volunteer, Team Lead, Manager). Unlike roles, rank reflects verified service milestones (hours logged, activities completed, average rating, tenure, and mandatory training).
- **Permission**: The explicit authority granted to a role to perform an action (`view`, `create`, `edit`, `delete`, `approve`, `export`) within a specific functional module.
- **Scope**: The geographic and organizational boundary within which a user can view or modify records (`all`, `area`, `branch`, or `own`). For example, an Adama Area Manager sees only Adama data.
- **Workspace**: The dedicated portal interface customized for each role, containing tailored sidebar navigation, action queues, and dashboards.
- **Module**: A distinct domain within VTS (such as Applications, Activities, Hours, Promotions, Allowances, or Projects) controlled by permission gates.

---

## 3. Organisation Structure and Access Scope

VTS organizes operations into a four-tier geographical hierarchy:

```mermaid
flowchart TD
    HO["Head Office (Addis Ababa Headquarters)"]
    
    A_AA["Area: Addis Ababa"]
    A_OR["Area: Oromia"]
    A_SI["Area: Sidama"]
    
    B_KIR["Branch: Kirkos Sub-City"]
    B_BOL["Branch: Bole Sub-City"]
    B_ADA["Branch: Adama Central"]
    B_HAW["Branch: Hawassa Central"]
    
    L_KAZ["Location: Kazanchis Community Hub"]
    L_WON["Location: Wonji Road Center"]
    
    HO --> A_AA
    HO --> A_OR
    HO --> A_SI
    
    A_AA --> B_KIR
    A_AA --> B_BOL
    A_OR --> B_ADA
    A_SI --> B_HAW
    
    B_KIR --> L_KAZ
    B_ADA --> L_WON
```

### Access Scope Enforcement Rules

| Scope Level | Who Uses It | What Records They Can Access |
| :--- | :--- | :--- |
| **All (`all`)** | Super Admin, Head Office Finance | Complete nationwide records across all areas, branches, and locations. |
| **Area (`area`)** | Regional Managers | All records belonging to their assigned area and any branches underneath it. |
| **Branch (`branch`)** | Team Leads, Branch Officers | Records restricted to their specific branch and associated local activities. |
| **Own (`own`)** | Volunteers, Applicants | Only records directly created by or assigned to their personal user ID. |

---

## 4. Roles and Screens

VTS provides 6 distinct workspaces. Below is the screen inventory and structural map for each role group.

### Screen Inventory by Role

- **Public (Unauthenticated)**:
  - Home Page (`/`)
  - Sign In (`/sign-in`)
  - Register (`/register`)
  - Verify Email (`/verify-email`)
  - Forgot Password (`/forgot-password`)
  - Reset Password (`/reset-password`)
  - Public Certificate Verification (`/check-certificate`)
  - Access Denied (`/unauthorized`)

- **Applicant Workspace**:
  - Application Status & Document Uploads (`/applicant/status`)
  - Multi-Step Application Form (`/applicant/apply`)
  - Telebirr Fee Payment (`/applicant/payment`)
  - Notifications Feed (`/applicant/notifications`)

- **Volunteer Workspace**:
  - Volunteer Home Dashboard (`/volunteer/home`)
  - Browse Open Activities (`/volunteer/activities`)
  - Activity Detail & Enrollment (`/volunteer/activities/:id`)
  - My Deployments & Roster (`/volunteer/my-activities`)
  - Live Duty Check-In Terminal (`/volunteer/check-in`)
  - Hours Log & Evidence Submission (`/volunteer/hours`)
  - Field Stipends & Allowances (`/volunteer/allowances`)
  - Rank Elevation Progress (`/volunteer/rank-progress`)
  - Verified Certificates (`/volunteer/certificates`)
  - Official Volunteer ID Pass (`/volunteer/id-card`)
  - Personal Profile & Security (`/volunteer/profile`)

- **Team Lead Workspace**:
  - Team Lead Dispatch Home (`/team-lead/home`)
  - Schedule Activity (`/team-lead/create-activity`)
  - Field Activities Roster (`/team-lead/activities`)
  - Duty Hours Approval & Evidence Inspection (`/team-lead/approve-hours`)
  - Supervised Volunteer Directory (`/team-lead/volunteers`)
  - Field Allowance Attendance Verification (`/team-lead/allowances`)
  - Performance Ratings (`/team-lead/ratings`)
  - Recommend Promotion (`/team-lead/recommend-promotion`)
  - Team Broadcast Announcements (`/team-lead/announcements`)

- **Manager Workspace**:
  - Regional Operations Dashboard (`/manager/dashboard`)
  - Application Intake & Dossier Review (`/manager/applications`)
  - Staff-Assisted Walk-In Registration (`/manager/register-volunteer`)
  - Volunteer Roster & Search (`/manager/volunteers`)
  - Community Projects & Charters (`/manager/projects`)
  - Project Detail, Budgets & Deployments (`/manager/projects/:id`)
  - Field Allowance Preparation (`/manager/allowances`)
  - Regional Activities Overview (`/manager/activities`)
  - Promotion Decisions Board (`/manager/promotions`)
  - Broadcast Announcements (`/manager/announcements`)
  - Volunteer Feedback Inbox (`/manager/feedback`)
  - Operations Reports & Exports (`/manager/reports`)

- **Finance Workspace**:
  - Financial Overview & Metrics (`/finance/overview`)
  - Telebirr Settlements Ledger (`/finance/payments`)
  - Payment Exceptions & Review Queue (`/finance/needs-review`)
  - Manual Receipts & Refunds (`/finance/receipts-refunds`)
  - Field Allowance Payouts Terminal (`/finance/allowances`)
  - Revenue & Stipend Reports (`/finance/reports`)

- **Super Admin Workspace**:
  - System Overview & Activity Metrics (`/admin/overview`)
  - Four-Tier Organization Tree (`/admin/organisation`)
  - Dynamic Role Permission Matrix (`/admin/roles-permissions`)
  - Allowance Budget Authority Approvals (`/admin/allowances`)
  - System Parameters & Required Documents (`/admin/settings`)
  - Rank Threshold Rules Editor (`/admin/rank-rules`)
  - User Accounts & Staff Provisioning (`/admin/accounts`)
  - System Security & Activity History (`/admin/activity-history`)

### Role Workspace Architecture

```mermaid
flowchart TD
    subgraph Public["Public Access"]
        P_HOME["Home (/)"]
        P_AUTH["Auth (Sign In / Register / Reset)"]
        P_CERT["Public Certificate Check (/check-certificate)"]
    end

    subgraph Volunteer["Volunteer & Applicant Core"]
        APP_STAT["Applicant Status (/applicant/status)"]
        APP_PAY["Telebirr Fee (/applicant/payment)"]
        VOL_HOME["Volunteer Home (/volunteer/home)"]
        VOL_HRS["Hours & Evidence (/volunteer/hours)"]
        VOL_ALW["My Allowances (/volunteer/allowances)"]
        VOL_RNK["Rank Progress (/volunteer/rank-progress)"]
    end

    subgraph FieldOps["Team Lead Operations"]
        TL_HOME["Dispatch Home (/team-lead/home)"]
        TL_HRS["Approve Hours (/team-lead/approve-hours)"]
        TL_VOL["My Volunteers (/team-lead/volunteers)"]
        TL_VER["Verify Allowances (/team-lead/allowances)"]
    end

    subgraph Management["Manager & Finance Management"]
        MGR_DASH["Operations Dashboard (/manager/dashboard)"]
        MGR_PRJ["Project Charters & Budgets (/manager/projects)"]
        MGR_ALW["Prepare Allowances (/manager/allowances)"]
        MGR_APP["Applications Intake (/manager/applications)"]
        FIN_PAY["Telebirr Ledger (/finance/payments)"]
        FIN_ALW["Disburse Allowances (/finance/allowances)"]
    end

    subgraph Governance["Super Admin Governance"]
        ADM_ORG["Organization Tree (/admin/organisation)"]
        ADM_ROL["Role Permissions Matrix (/admin/roles-permissions)"]
        ADM_ALW["Budget Approvals (/admin/allowances)"]
        ADM_SET["Settings & Document Config (/admin/settings)"]
    end

    P_AUTH --> APP_STAT
    APP_STAT --> APP_PAY
    APP_PAY --> VOL_HOME
    VOL_HOME --> VOL_HRS
    VOL_HRS --> TL_HRS
    MGR_PRJ --> MGR_ALW
    MGR_ALW --> TL_VER
    TL_VER --> ADM_ALW
    ADM_ALW --> FIN_ALW
```

---

## 5. The Volunteer Lifecycle

The volunteer journey comprises 9 distinct stages:

```mermaid
stateDiagram-v2
    [*] --> Registered: 1. Self-Registration or Assisted Intake
    Registered --> Applied: 2. Submit Application & Documents
    Applied --> InReview: 3. Manager Review & Verification
    InReview --> CorrectionNeeded: Returned for Correction
    CorrectionNeeded --> InReview: Re-uploaded Files
    InReview --> Accepted: 4. Admissions Board Acceptance
    Accepted --> ActiveVolunteer: 5. Telebirr Fee Settlement (or Assisted Waiver)
    ActiveVolunteer --> Deployed: 6. Assigned to Project & Roster
    Deployed --> DutyLogged: 7. Field Check-In / Manual Hours
    DutyLogged --> HoursApproved: 8. Team Lead Hours & Evidence Audit
    HoursApproved --> RankPromoted: 9. Elevation Board Decision
    RankPromoted --> ActiveVolunteer: New Rank & Certificate
```

### Detailed Lifecycle Steps

1. **Registration**: An individual registers online by providing basic details and verifying a 6-digit email confirmation code. Alternatively, a manager registers the volunteer in-person via staff-assisted intake.
2. **Application & Document Submission**: The applicant fills out community interests, skills, and emergency contacts, uploading required identity documents (Kebele ID, passport photograph, recommendation letter).
3. **Manager Review**: Program managers evaluate the application. If a document is blurred or incomplete, the manager returns it for correction with an explanatory note; the applicant is alerted and replaces the file.
4. **Acceptance**: The admissions board accepts qualified applicants, generating a payment invitation with a configurable payment window (default: 7 days).
5. **Fee Settlement & Activation**: The applicant completes the Telebirr registration fee transfer (ETB 200). Upon automated or manual confirmation, the account transitions immediately to active **Volunteer** status, issuing a digital ID pass and welcome notice.
6. **Project Deployment**: Managers assign active volunteers to specific regional projects and activities, pairing them with an assigned supervising Team Lead. Volunteers accept or decline assignments from their roster.
7. **Service & Attendance Logging**: Volunteers attend scheduled shifts using on-site 4-digit check-in codes. For field work without codes, volunteers submit manual duty records or completed activity reports with photo evidence.
8. **Supervisor Verification**: Supervising Team Leads review attendance, inspect uploaded photos, verify hours, and provide numerical performance ratings.
9. **Rank Elevation**: When verified hours, activities, ratings, and tenure satisfy threshold rules, candidates become eligible for board review and elevation to higher ranks.

---

## 6. Ranks and Promotion

VTS features four progressive merit ranks. Rank progression is earned through verifiable field hours, activity participation, tenure, performance ratings, and mandatory training.

### Rank Threshold Requirements

| Rank Title | Minimum Approved Hours | Minimum Activities | Minimum Rating | Minimum Months Active | Mandatory Course | Approving Authority |
| :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| **Volunteer** | 0 hrs | 0 | - | 0 | None (Induction on join) | Automated on registration fee confirmation |
| **Senior Volunteer** | 50 hrs | 10 activities | 4.0 / 5.0 | 3 months | Advanced Field Leadership | Regional Manager Board |
| **Team Lead** | 150 hrs | 25 activities | 4.5 / 5.0 | 6 months | Crisis Intervention & Safety | Regional Manager Board |
| **Manager** | 300 hrs | 50 activities | 4.8 / 5.0 | 12 months | Operational Governance | Executive Board / Super Admin |

### Promotion Governance Rules
- **Recommendations**: Team Leads recommend eligible Senior Volunteers for promotion to Team Lead, submitting peer commendation notes.
- **Evidence Dossier**: Approvers view an immutable evidence summary showing verified hours, attendance counts, rating distributions, and training completions.
- **Decision & Notification**: Approving or declining requires an explanatory note. On approval, the rank milestone is recorded in the volunteer's permanent profile, a digital verification certificate is generated, and permissions update at next sign-in.
- **Separation of Duties**: No volunteer can recommend or approve their own promotion.

---

## 7. Money In and Money Out

VTS handles two independent financial pipelines: incoming registration fees (Money In) and field service stipend allowances (Money Out).

### 7.1 Money In (Registration Fees)

Money In tracks applicant registration fee collections that fund onboarding, volunteer insurance, and identification passes.

```mermaid
flowchart LR
    A["Accepted Applicant"] --> B["Telebirr Push Request"]
    B --> C{"Outcome"}
    C -->|Instant Settlement| D["Confirmed (Active Volunteer)"]
    C -->|Network Delay / Mismatch| E["Needs Review Queue"]
    C -->|Timeout / Cancel| F["Failed (Retry Available)"]
    E -->|Finance Reconciliation| D
    E -->|Invalid Claim| G["Rejected"]
    D -->|Justified Request| H["Refunded"]
```

#### Money In Status List
- `pending`: Application accepted; payment invitation sent with active expiration countdown.
- `confirmed`: Fee successfully settled via Telebirr or manual receipt; account activated.
- `needs_review`: Payment flagged due to reference mismatch, phone discrepancy, or duplicate claim.
- `failed`: Transaction aborted by user or gateway timeout.
- `refunded`: Fee refunded by Finance Officer with required justification note.

#### Money In Business Rules
1. **No Pre-Acceptance Payment**: An applicant cannot make a payment until their application is officially accepted by admissions.
2. **Standard Fee Rate**: The registration fee is a single fixed amount set by Super Admin (default: ETB 200).
3. **Assisted Registration Exemption**: Managers registering walk-in volunteers can mark the fee as settled via cash, bank transfer, or waived under hardship rules.
4. **Exception Handling**: Unmatched Telebirr references route to the Finance Review Queue where officers resolve discrepancies without data loss.

---

### 7.2 Money Out (Allowances & Stipends)

Money Out manages daily field stipends paid to volunteers deployed on community projects.

```mermaid
stateDiagram-v2
    [*] --> Draft: Manager Drafts
    Draft --> Submitted: Manager Submits within Project Budget
    Submitted --> Verified: Supervising Team Lead Confirms Attendance
    Verified --> Approved: Super Admin (Budget Authority) Reserves Funds
    Approved --> Paid: Finance Disburses via Telebirr
    Approved --> Failed: Gateway Payout Error
    Failed --> Approved: Finance Retries Disbursement
    Submitted --> Rejected: Declined by Supervisor or Authority
    Verified --> Rejected: Declined by Budget Authority
    Paid --> [*]
```

#### Money Out Status List
- `draft`: Request created by Manager but not yet formally submitted.
- `submitted`: Formally submitted for attendance verification; remaining budget verified.
- `verified`: Field supervisor (Team Lead) confirms physical attendance and service duration.
- `approved`: Budget Authority (Super Admin) authorizes expenditure; funds reserved from project budget.
- `paid`: Finance Officer disburses funds to volunteer's mobile wallet via Telebirr; transaction reference recorded.
- `rejected`: Request declined by supervisor or budget authority with mandatory explanation note.
- `failed`: Telebirr disbursement API returned a network failure; available for immediate retry.

#### Money Out Business Rules
1. **Project Budget Ceiling**: An allowance request cannot be prepared or approved if the amount exceeds the project's remaining available budget (`budget - (spent + reserved)`).
2. **Duplicate Prevention**: The system rejects any allowance request sharing the same volunteer, project, activity, and service date as an existing non-rejected request.
3. **Four-Eye Principle (Separation of Duties)**:
   - Nobody can approve an allowance request that they prepared.
   - Volunteers cannot approve requests where they are the beneficiary.
4. **Dual-Key Financial Authority**: Budget authorization (`allowances.approve`) and disbursement execution (`payments.create`) require separate role permissions.
5. **Mobile Payout Verification**: Payouts require an Ethiopian mobile number (`+2519...`) and generate a traceable transaction reference (`TB-OUT-2026-XXXXXX`).

---

## 8. Permission Model and Separation of Duties

### Central Permission Matrix

The application enforces authorization using a centralized `can(user, module, action, resource)` engine.

| Permission Module | Volunteer | Team Lead | Manager | Finance Officer | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **applications** | View (Own) | View (Branch) | View, Edit, Approve, Export | - | View, Export |
| **volunteers** | View, Edit (Own) | View (Branch) | View, Create, Edit, Export | View (Scope) | View, Edit, Export |
| **activities** | View, Enroll | View, Create, Edit | View, Create, Edit, Export | View | View, Edit, Delete |
| **hours** | View, Create (Own) | View, Approve, Edit | View, Export | View | View, Export |
| **ratings** | View (Own) | View, Create | View, Export | - | View |
| **promotions** | View (Own) | View, Create (Nominate)| View, Approve, Export | - | View, Approve, Edit |
| **payments** | View (Own) | - | View (Branch) | View, Create, Edit, Export | View, Export |
| **announcements**| View | View, Create (Team) | View, Create, Delete | View | View, Create, Delete |
| **reports** | - | - | View, Export | View, Export | View, Export |
| **settings** | - | - | - | - | View, Edit |
| **organisation** | - | - | View (Area) | - | View, Create, Edit, Delete |
| **accounts** | - | - | - | - | View, Create, Edit, Delete |
| **projects** | View (Assigned) | View (Branch) | View, Create, Edit, Export | View | View, Edit, Delete |
| **assignments** | View, Edit (Own) | View (Supervised) | View, Create, Edit, Export | - | View, Export |
| **documents** | View, Create (Own) | View (Branch) | View, Edit, Approve | - | View, Edit, Delete |
| **allowances** | View (Own) | View, Edit (Verify)| View, Create, Export | View, Create (Pay) | View, Approve, Export |

### Backend Security Invariants
When transitioning from the client prototype to the production Express/PostgreSQL backend, the server must enforce the following non-bypassable constraints:

1. **Self-Approval Ban**: Any API request attempting to approve an entity where `preparedBy === currentUserId` or `beneficiaryId === currentUserId` must return `403 Forbidden`.
2. **Budget Overdraft Lock**: Database transactions preparing or approving an allowance must lock the parent `projects` row using `SELECT ... FOR UPDATE` and verify that `budget >= (spent + reserved + requestedAmount)`.
3. **Hierarchical Scope Enforcement**: All SQL queries must enforce organizational branch path matching (`org_units.path LIKE user_branch.path || '%'`).
4. **Account Lockout**: After 5 consecutive failed authentication attempts within 15 minutes, the account is locked for 30 minutes, recording IP address and user agent in `sign_in_logs`.
5. **Session Invalidation**: Role changes or password resets immediately invalidate all active JWT tokens for that user.

---

## 9. Notifications, Reports, and Exports

### 9.1 Multi-Channel Notifications

VTS supports three delivery channels for operational updates:

| Event Type | In-App Feed | Email (Brevo) | SMS (Shortcode 8080) | Default Audience |
| :--- | :---: | :---: | :---: | :--- |
| **Account Verification** | - | 6-Digit OTP Code | 6-Digit OTP Code | Applicant |
| **Application Result** | Notification Badge | Decision Letter | Status Summary SMS | Applicant |
| **Payment Receipt** | Official Pass | PDF Tax Receipt | Telebirr Confirmation | Volunteer |
| **Activity Reminder** | Reminder Card | Shift Schedule | Venue & Time Alert | Enrolled Volunteers |
| **Project Assignment** | Roster Alert | Deployment Brief | SMS Notice | Assigned Volunteer |
| **Evidence Correction** | Alert Banner | Action Required | Resubmission Alert | Applicant / Volunteer |
| **Allowance Payout** | Celebration Moment | Payout Slip | Telebirr Payout SMS | Beneficiary Volunteer |

Users configure personal channel preferences under `/volunteer/profile`, while critical security notices cannot be disabled.

### 9.2 Operational Reports and Exports

- **Manager Reports (`/manager/reports`)**:
  - Volunteer distribution by rank, area, and specialized skills.
  - Cumulative service hours aggregated by week, month, and fiscal quarter.
  - Activity attendance and fill-rate performance.
  - Recruitment conversion funnel from registration to active deployment.
- **Finance Reports (`/finance/reports`)**:
  - Telebirr registration fee settlements by date range and branch.
  - Project allowance expenditures, committed reserves, and remaining budgets.
  - Manual cash receipt reconciliation logs.
  - Refund audit trail.
- **Export Standards**: All tabular reports provide clean, simulated client-side exports to Excel (`.xlsx`) and formal printable documents (`.pdf`) respecting active search filters and date ranges.

---

## 10. Data Model

Below are the core entities defined in `src/types/index.ts`.

### Entity Definitions

#### User & Security
| Table / Entity | Primary Key | Key Attributes | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `users` | `id` (uuid) | `username`, `email`, `firstName`, `lastName`, `phone`, `role`, `accountStatus`, `failedSignInAttempts`, `lockedUntil`, `passwordChangedAt` | `branchId` -> `org_units.id` |
| `sign_in_logs` | `id` (uuid) | `timestamp`, `ipAddress`, `userAgent`, `result`, `failureReason` | `userId` -> `users.id` |
| `org_units` | `id` (uuid) | `name`, `type` (`head_office`, `area`, `branch`, `location`), `code`, `status` | `parentId` -> `org_units.id` |
| `role_permissions` | `id` (uuid) | `role`, `module`, `actions` (text[]), `scope` | - |

#### Volunteer Operations
| Table / Entity | Primary Key | Key Attributes | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `volunteer_profiles` | `userId` (uuid) | `fullName`, `dateOfBirth`, `area`, `skills`[], `emergencyContact` (jsonb), `rank`, `volunteerNumber` | `userId` -> `users.id`, `branchId` -> `org_units.id` |
| `applications` | `id` (uuid) | `status`, `source`, `formData` (jsonb), `submittedAt`, `reviewedAt`, `decisionReason`, `paymentDeadline` | `userId` -> `users.id`, `reviewedBy` -> `users.id` |
| `application_documents` | `id` (uuid) | `name`, `fileName`, `fileSize`, `fileUrl`, `status`, `reviewNote`, `uploadedAt` | `applicationId` -> `applications.id`, `configId` -> `required_document_configs.id` |
| `projects` | `id` (uuid) | `name`, `description`, `start`, `end`, `budget`, `allowancePerDay`, `status` | `branchId` -> `org_units.id`, `managerId` -> `users.id` |
| `activities` | `id` (uuid) | `title`, `type`, `description`, `startsAt`, `endsAt`, `capacity`, `checkInCode`, `status`, `coverUrl` | `branchId` -> `org_units.id`, `projectId` -> `projects.id`, `leadId` -> `users.id` |
| `assignments` | `id` (uuid) | `status`, `assignedAt`, `startDate`, `endDate`, `declineReason`, `notes` | `volunteerId` -> `users.id`, `supervisorId` -> `users.id`, `projectId` -> `projects.id` |
| `hours_entries` | `id` (uuid) | `checkIn`, `checkOut`, `minutes`, `source`, `status`, `evidenceUrl`, `evidenceNote` | `userId` -> `users.id`, `activityId` -> `activities.id`, `decidedBy` -> `users.id` |
| `ratings` | `id` (uuid) | `score` (1-5), `note`, `createdAt` | `userId` -> `users.id`, `activityId` -> `activities.id`, `ratedBy` -> `users.id` |
| `promotions` | `id` (uuid) | `fromRank`, `toRank`, `status`, `note`, `evidence` (jsonb), `decidedAt` | `userId` -> `users.id`, `recommendedBy` -> `users.id`, `decidedBy` -> `users.id` |
| `certificates` | `id` (uuid) | `kind`, `title`, `issuedAt`, `verificationCode`, `fileUrl` | `userId` -> `users.id` |

#### Financial Entities
| Table / Entity | Primary Key | Key Attributes | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `payments` | `id` (uuid) | `amount`, `currency`, `telebirrReference`, `receiptNumber`, `status`, `paymentMethod`, `refundReason` | `userId` -> `users.id`, `applicationId` -> `applications.id` |
| `allowances` | `id` (uuid) | `allowanceNumber`, `days`, `allowancePerDay`, `totalAmount`, `status`, `paymentReference`, `failureReason` | `projectId` -> `projects.id`, `volunteerId` -> `users.id`, `preparedBy` -> `users.id`, `supervisorId` -> `users.id`, `approvedBy` -> `users.id` |

### Entity-Relationship Diagram

```mermaid
erDiagram
    ORG_UNITS ||--o{ ORG_UNITS : "parent_of"
    ORG_UNITS ||--o{ USERS : "contains"
    ORG_UNITS ||--o{ PROJECTS : "hosts"
    ORG_UNITS ||--o{ ACTIVITIES : "locates"

    USERS ||--|| VOLUNTEER_PROFILES : "has"
    USERS ||--o{ SIGN_IN_LOGS : "logs"
    USERS ||--o{ APPLICATIONS : "submits"
    USERS ||--o{ PAYMENTS : "makes"
    USERS ||--o{ HOURS_ENTRIES : "earns"
    USERS ||--o{ CERTIFICATES : "awarded"
    USERS ||--o{ ASSIGNMENTS : "assigned_to"
    USERS ||--o{ ALLOWANCES : "receives"

    PROJECTS ||--o{ ACTIVITIES : "contains"
    PROJECTS ||--o{ ALLOWANCES : "funds"
    PROJECTS ||--o{ ASSIGNMENTS : "deploys"

    APPLICATIONS ||--o{ APPLICATION_DOCUMENTS : "includes"
    APPLICATIONS ||--o| PAYMENTS : "requires"

    ACTIVITIES ||--o{ HOURS_ENTRIES : "records"
    ACTIVITIES ||--o{ RATINGS : "receives"
```

---

## 11. Architecture and Backend Integration

### 11.1 API Function to Backend Mapping

| Source File Function | Future Express Route | HTTP Method | Supabase Table | External Services & Integrations |
| :--- | :--- | :---: | :--- | :--- |
| `auth.ts` -> `signIn` | `/api/v1/auth/sign-in` | `POST` | `users`, `sign_in_logs` | Argon2 verify; issues JWT cookie |
| `auth.ts` -> `register` | `/api/v1/auth/register` | `POST` | `users`, `volunteer_profiles` | Brevo email OTP / Ethio SMS OTP |
| `auth.ts` -> `verifyEmail` | `/api/v1/auth/verify-email` | `POST` | `users` | Token invalidation |
| `auth.ts` -> `updateProfilePhoto` | `/api/v1/auth/profile-photo` | `PATCH` | `volunteer_profiles` | Cloudinary Image API (`/upload`) |
| `applications.ts` -> `submitApplication` | `/api/v1/applications` | `POST` | `applications` | Brevo confirmation email |
| `applications.ts` -> `reviewApplication` | `/api/v1/applications/:id/review` | `POST` | `applications` | Brevo decision notice email |
| `applications.ts` -> `registerVolunteerAssisted` | `/api/v1/applications/assisted` | `POST` | `users`, `profiles`, `payments` | Single ACID transaction |
| `documents.ts` -> `uploadApplicationDocument` | `/api/v1/applications/:id/documents`| `POST` | `application_documents` | Cloudinary PDF/Image Upload |
| `documents.ts` -> `reviewApplicationDocument` | `/api/v1/documents/:id/review` | `POST` | `application_documents` | Brevo correction notice email |
| `payments.ts` -> `initiateTelebirrPayment` | `/api/v1/payments/telebirr/initiate`| `POST` | `payments` | Telebirr C2B API (`/c2b/payment`) |
| `payments.ts` -> `processTelebirrOutcome` | `/api/v1/payments/telebirr/callback`| `POST` | `payments`, `users` | Telebirr Webhook RSA verification |
| `payments.ts` -> `recordPayment` | `/api/v1/payments/manual` | `POST` | `payments`, `users` | Tax Receipt PDF generation |
| `projects.ts` -> `getProjects` | `/api/v1/projects` | `GET` | `projects` | Scoped by user branch |
| `projects.ts` -> `createProject` | `/api/v1/projects` | `POST` | `projects` | Budget allocation check |
| `activities.ts` -> `createActivity` | `/api/v1/activities` | `POST` | `activities` | Cloudinary Cover Image Upload |
| `assignments.ts` -> `createAssignment` | `/api/v1/assignments` | `POST` | `assignments` | Brevo deployment alert |
| `assignments.ts` -> `respondToAssignment` | `/api/v1/assignments/:id/respond`| `POST` | `assignments` | In-app notification to Manager |
| `hours.ts` -> `checkIn` | `/api/v1/hours/check-in` | `POST` | `hours_entries` | Validates 4-digit activity code |
| `hours.ts` -> `checkOut` | `/api/v1/hours/check-out` | `POST` | `hours_entries` | Auto-caps elapsed minutes |
| `hours.ts` -> `submitManualHours` | `/api/v1/hours/manual` | `POST` | `hours_entries` | Cloudinary Evidence Image Upload |
| `hours.ts` -> `approveHours` | `/api/v1/hours/:id/approve` | `POST` | `hours_entries`, `profiles` | Updates lifetime hours |
| `promotions.ts` -> `decidePromotion` | `/api/v1/promotions/:id/decide` | `POST` | `promotions`, `certificates` | Cloudinary Certificate PDF Storage |
| `certificates.ts` -> `verifyCertificate` | `/api/v1/certificates/verify/:code`| `GET` | `certificates`, `profiles` | Public endpoint (no auth required) |
| `allowances.ts` -> `prepareAllowance` | `/api/v1/allowances` | `POST` | `allowances` | Verifies project budget remaining |
| `allowances.ts` -> `verifyAllowance` | `/api/v1/allowances/:id/verify` | `POST` | `allowances` | Supervisor verification |
| `allowances.ts` -> `approveAllowance` | `/api/v1/allowances/:id/approve` | `POST` | `allowances` | Reserves project funds |
| `allowances.ts` -> `disburseAllowance` | `/api/v1/allowances/:id/disburse` | `POST` | `allowances` | Telebirr B2C Payout API (`/b2c/payout`) |
| `organisation.ts` -> `createOrgUnit` | `/api/v1/organisation` | `POST` | `org_units` | Hierarchical path generation |
| `rolePermissions.ts` -> `updateRolePermission`| `/api/v1/roles-permissions/:role` | `PATCH` | `role_permissions` | Live permission invalidation |

### 11.2 Required Environment Variables

```env
# Server Configuration
PORT=4000
NODE_ENV=production
CLIENT_URL=https://vts.org.et
JWT_SECRET=super-secret-jwt-signing-key-minimum-32-chars
JWT_EXPIRES_IN=24h

# Supabase / PostgreSQL Connection
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[SECRET-SERVICE-KEY]

# Telebirr API Gateway
TELEBIRR_APP_ID=sample_telebirr_app_id
TELEBIRR_APP_KEY=sample_telebirr_app_key
TELEBIRR_SHORT_CODE=808080
TELEBIRR_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
TELEBIRR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
TELEBIRR_PAY_URL=https://app.telebirr.et:8443/api/c2b/payment
TELEBIRR_DISBURSE_URL=https://app.telebirr.et:8443/api/b2c/disbursement
TELEBIRR_NOTIFY_URL=https://api.vts.org.et/api/v1/payments/telebirr/callback

# Brevo Transactional Email & SMS
BREVO_API_KEY=xkeysib-[SECRET-BREVO-API-KEY]
EMAIL_FROM_ADDRESS=admissions@vts.org.et
EMAIL_FROM_NAME="VTS Volunteer Operations"
SMS_SENDER_NAME=8080

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=vts-operations
CLOUDINARY_API_KEY=[API_KEY]
CLOUDINARY_API_SECRET=[API_SECRET]
```

### 11.3 Integration Sequence (Order to Connect)

1. **Step 1: PostgreSQL Schema & Supabase RLS**: Apply the SQL migration script defining tables, foreign keys, and row-level security policies enforcing the organization tree hierarchy.
2. **Step 2: Express Authentication & Sessions**: Implement JWT authentication, argon2 password hashing, and user scope resolution middleware.
3. **Step 3: Cloudinary Media Storage**: Wire image and document upload endpoints for profile photos, Kebele ID cards, evidence photos, and certificate PDFs.
4. **Step 4: Brevo Transactional Messaging**: Connect email delivery for verification codes, decision letters, and schedule changes.
5. **Step 5: Telebirr C2B Integration**: Configure incoming registration fee payment requests, signature generation, and secure callback webhooks.
6. **Step 6: Telebirr B2C Disbursement**: Connect the Money Out stipend payout pipeline with automated retry handling and balance verification.

---

## 12. How to Run

### Installation and Setup

```bash
# Clone the repository
git clone https://github.com/eyoba146/volunteer-operations-platform.git
cd volunteer-operations-platform

# Install client dependencies
cd client
npm install

# Start local development server (runs on port 5173)
npm run dev

# Run automated tests and linting
npm run build
```

To run the automated verification suite:
```bash
node scripts/test_upgrade2.cjs
```

### Demo Accounts

All demo accounts share the password: **`Demo@1234`**

| Role | Full Name | Username | Scope & Assigned Branch | Operational Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Applicant** | Hana Tesfaye | `hana.tesfaye` | Addis Ababa Area | Application accepted; ready to pay registration fee via Telebirr. |
| **Volunteer** | Dawit Bekele | `dawit.bekele` | Kirkos Branch, Addis Ababa | Active volunteer; assigned to Kirkos Green Project; logs field hours. |
| **Senior Volunteer** | Selam Alemu | `selam.alemu` | Bole Branch, Addis Ababa | Has met all Team Lead thresholds; eligible for promotion board review. |
| **Team Lead** | Yonas Kebede | `yonas.kebede` | Kirkos Branch, Addis Ababa | Dispatches field rosters, generates check-in codes, verifies hours. |
| **Team Lead** | Henok Assefa | `henok.assefa` | Adama Central Branch | Supervises Adama projects; verifies volunteer attendance for allowances. |
| **Manager** | Marta Girma | `marta.girma` | Addis Ababa Area | Reviews applications, charters projects, prepares field allowances. |
| **Manager** | Tigist Wolde | `tigist.wolde` | Adama Area | Exercises regional scoping; registers walk-ins via assisted intake. |
| **Finance Officer** | Abel Hailu | `abel.hailu` | Head Office (All Scope) | Reconciles Telebirr fees; disburses mobile wallet allowances. |
| **Super Admin** | Ruth Mengistu | `ruth.mengistu` | Head Office (All Scope) | Manages organization tree; approves allowance budgets; sets permissions. |

### Evaluation Demo Script (Step-by-Step)

1. **Assisted Intake**: Sign in as `tigist.wolde` (Manager, Adama). Go to `/manager/register-volunteer`. Register a new volunteer in-person through the 4-step wizard, recording their Kebele ID and waiving or recording a manual cash fee.
2. **Document Correction Notice**: Sign in as `marta.girma` (Manager, Addis Ababa). Open `/manager/applications`. Open an application dossier, inspect the uploaded Kebele ID, click **Return for correction**, and submit a note explaining that the photo is unreadable.
3. **Document Replacement & Payout**: Sign in as `hana.tesfaye` (Applicant). Go to `/applicant/status`. Observe the correction alert, upload a replacement ID card, and proceed to `/applicant/payment`. Pay the ETB 200 fee with simulated Telebirr success to unlock active volunteer status.
4. **Project Charter & Budget Tracking**: Sign in as `marta.girma`. Go to `/manager/projects`. Observe the remaining budget figure for the Kirkos Clean & Green Initiative. Open the project detail page `/manager/projects/proj-kirkos-green` to inspect linked ticket activities and assigned volunteers.
5. **Allowance Preparation**: Still signed in as `marta.girma`, go to `/manager/allowances`. Prepare a 3-day field allowance for `dawit.bekele` under the Kirkos project, choosing `yonas.kebede` as supervising Team Lead. Verify that preparing an amount exceeding the remaining project budget is strictly blocked.
6. **Supervisor Attendance Verification**: Sign in as `yonas.kebede` (Team Lead). Go to `/team-lead/allowances`. Inspect the attendance record and click **Verify attendance**, adding an observation note confirming field duty.
7. **Budget Authority Sign-Off**: Sign in as `ruth.mengistu` (Super Admin). Go to `/admin/allowances`. Notice that Marta Girma is barred from approving what she prepared. Click **Approve budget** as Budget Authority, reserving the funds from the project budget.
8. **Telebirr Disbursement**: Sign in as `abel.hailu` (Finance). Go to `/finance/allowances`. Select the approved allowance, open the disbursement sheet, choose Telebirr mobile wallet, and click **Disburse funds**. Notice the generation of an official transaction reference (`TB-OUT-2026-XXXXXX`).
9. **Volunteer Stipend Celebration**: Sign in as `dawit.bekele` (Volunteer). Go to `/volunteer/allowances`. View the verified status timeline, inspect the Telebirr payment reference, and trigger the celebratory payout moment.

---

## 13. Requirements Traceability Matrix

| Requirement ID | Module | Summary of Requirement | Status | Proving Screen / Code Reference |
| :--- | :--- | :--- | :---: | :--- |
| **FR-REG-01** | Registration | Self-registration form with mobile normalization | Done | `pages/public/RegisterPage.tsx`, `api/auth.ts` |
| **FR-REG-02** | Registration | 6-digit confirmation code verification via email | Done | `pages/public/VerifyEmailPage.tsx` |
| **FR-REG-03** | Registration | Password complexity meter and checklist | Done | `components/ui/Input.tsx`, `api/auth.ts` |
| **FR-REG-04** | Registration | Prevention of duplicate email and username | Done | `api/auth.ts` -> `checkDuplicate` |
| **FR-APP-01** | Applications | Multi-step application wizard | Done | `pages/applicant/ApplicantApplyPage.tsx` |
| **FR-APP-02** | Applications | Regional area, motivation, skills, availability | Done | `types/index.ts` -> `ApplicationFormData` |
| **FR-APP-03** | Applications | Manager application review queue with dossier drawer | Done | `pages/manager/ManagerApplicationsPage.tsx` |
| **FR-APP-04** | Applications | Decision letter and configurable payment window | Done | `api/applications.ts` -> `reviewApplication` |
| **FR-PAY-01** | Payments | Telebirr registration fee checkout simulation | Done | `pages/applicant/ApplicantPaymentPage.tsx` |
| **FR-PAY-02** | Payments | Success, delay, and failure outcome simulation | Done | `api/payments.ts` -> `initiateTelebirrPayment` |
| **FR-PAY-03** | Payments | Finance review queue for payment exceptions | Done | `pages/finance/FinanceNeedsReviewPage.tsx` |
| **FR-PAY-04** | Payments | Manual branch cash/bank receipt generation | Done | `pages/finance/FinanceReceiptsRefundsPage.tsx` |
| **FR-ONB-01** | Onboarding | Automated transition to active Volunteer rank on payment | Done | `api/payments.ts` -> `processTelebirrOutcome` |
| **FR-ONB-02** | Onboarding | Printable Volunteer ID pass with QR verification code | Done | `pages/volunteer/VolunteerIdCardPage.tsx` |
| **FR-ONB-03** | Onboarding | Welcome announcement and induction packet delivery | Done | `api/payments.ts`, `pages/volunteer/VolunteerHomePage.tsx` |
| **FR-ACT-01** | Activities | Browse, filter, and view open field activities | Done | `pages/volunteer/VolunteerActivitiesPage.tsx` |
| **FR-ACT-02** | Activities | Team Lead activity creation with capacity rules | Done | `pages/team-lead/TeamLeadCreateActivityPage.tsx` |
| **FR-ACT-03** | Activities | Volunteer enrollment and waitlist management | Done | `pages/volunteer/VolunteerActivityDetailPage.tsx` |
| **FR-ACT-04** | Activities | Activity roster with check-in code display | Done | `pages/team-lead/TeamLeadActivitiesPage.tsx` |
| **FR-HRS-01** | Hours | On-site 4-digit check-in and check-out terminal | Done | `pages/volunteer/VolunteerCheckInPage.tsx` |
| **FR-HRS-02** | Hours | Automatic duration calculation with 1-hour cap | Done | `api/hours.ts` -> `checkOut` |
| **FR-HRS-03** | Hours | Manual hours submission with photo evidence | Done | `pages/volunteer/VolunteerHoursPage.tsx` |
| **FR-HRS-04** | Hours | Team Lead hours approval and evidence inspection | Done | `pages/team-lead/TeamLeadApproveHoursPage.tsx` |
| **FR-HRS-05** | Hours | Single and bulk hours approval workflows | Done | `api/hours.ts` -> `bulkApproveHours` |
| **FR-TRN-01** | Training | Training sessions as verified activity types | Done | `types/index.ts` -> `ActivityType = 'training'` |
| **FR-TRN-02** | Training | Completed courses record to profile for promotion | Done | `api/promotions.ts` -> `getRankProgress` |
| **FR-PRM-01** | Promotions | Visual rank progress tracker against thresholds | Done | `pages/volunteer/VolunteerRankProgressPage.tsx` |
| **FR-PRM-02** | Promotions | Eligible candidate roster with evidence summaries | Done | `pages/manager/ManagerPromotionsPage.tsx` |
| **FR-PRM-03** | Promotions | Board review with mandatory decision rationale | Done | `api/promotions.ts` -> `decidePromotion` |
| **FR-PRM-04** | Promotions | Dynamic role update and digital certificate award | Done | `api/promotions.ts`, `pages/volunteer/VolunteerCertificatesPage.tsx` |
| **FR-CRT-01** | Certificates | Certificates for rank elevations and training | Done | `pages/volunteer/VolunteerCertificatesPage.tsx` |
| **FR-CRT-02** | Certificates | Public certificate verification code lookup | Done | `pages/public/CertificateCheckPage.tsx` |
| **FR-CRT-03** | Certificates | Client-side certificate PDF download | Done | `components/signature/VolunteerCard.tsx` |
| **FR-NTF-01** | Notifications| Targeted broadcast announcements by rank and area | Done | `pages/manager/ManagerAnnouncementsPage.tsx` |
| **FR-NTF-02** | Notifications| Real-time in-app notification feed with badge count | Done | `components/layout/AppHeader.tsx`, `api/notifications.ts` |
| **FR-NTF-03** | Notifications| Transactional email delivery previews | Done | `components/demo/DemoEmailInbox.tsx` |
| **FR-NTF-04** | Notifications| Multi-channel alert preferences (In-app, Email, SMS) | Done | `pages/volunteer/VolunteerProfilePage.tsx` |
| **FR-RPT-01** | Reports | Manager dashboard metrics and active summaries | Done | `pages/manager/ManagerDashboardPage.tsx` |
| **FR-RPT-02** | Reports | Demographic, attendance, and funnel reports | Done | `pages/manager/ManagerReportsPage.tsx` |
| **FR-RPT-03** | Reports | Finance revenue, refund, and reconciliation metrics | Done | `pages/finance/FinanceOverviewPage.tsx` |
| **FR-RPT-04** | Reports | Client-side Excel (.xlsx) and PDF simulation exports | Done | `pages/manager/ManagerReportsPage.tsx`, `pages/finance/FinanceReportsPage.tsx` |
| **FR-ADM-01** | Admin | System configuration (fees, deadlines, thresholds) | Done | `pages/admin/AdminSettingsPage.tsx` |
| **FR-ADM-02** | Admin | Staff user provisioning and account state controls | Done | `pages/admin/AdminAccountsPage.tsx` |
| **FR-ADM-03** | Admin | Searchable system activity history and audit log | Done | `pages/admin/AdminActivityHistoryPage.tsx` |
| **FR-ADM-04** | Admin | Transactional email template editor and previews | Done | `pages/admin/AdminSettingsPage.tsx` |
| **FR-ORG-01** | Organisation | 4-tier tree: Head Office, Area, Branch, Location | Done | `pages/admin/AdminOrganisationPage.tsx` |
| **FR-ORG-02** | Organisation | Hierarchical scoping (`all`, `area`, `branch`, `own`) | Done | `utils/scoping.ts` -> `filterByScope` |
| **FR-ORG-03** | Organisation | Branch assignment on volunteer and staff accounts | Done | `types/index.ts`, `pages/admin/AdminAccountsPage.tsx` |
| **FR-ORG-04** | Organisation | Interactive organization tree management | Done | `pages/admin/AdminOrganisationPage.tsx` |
| **FR-AST-01** | Assisted Reg | 4-step manager walk-in registration wizard | Done | `pages/manager/ManagerRegisterVolunteerPage.tsx` |
| **FR-AST-02** | Assisted Reg | Manual fee recording or hardship waiver controls | Done | `api/applications.ts` -> `registerVolunteerAssisted` |
| **FR-AST-03** | Assisted Reg | Immediate volunteer activation from assisted intake | Done | `pages/manager/ManagerRegisterVolunteerPage.tsx` |
| **FR-SEC-01** | Security | 16-module dynamic role permission matrix editor | Done | `pages/admin/AdminRolesPermissionsPage.tsx` |
| **FR-SEC-02** | Security | Account lockout enforcement after 5 failed sign-ins | Done | `api/auth.ts` -> `signIn` |
| **FR-SEC-03** | Security | Sign-in audit log recording IP and user agent | Done | `pages/volunteer/VolunteerProfilePage.tsx` |
| **FR-PRJ-01** | Projects | Branch projects with ETB budget & daily stipend rate| Done | `pages/manager/ManagerProjectsPage.tsx` |
| **FR-PRJ-02** | Projects | Activities linked to parent projects | Done | `pages/team-lead/TeamLeadCreateActivityPage.tsx` |
| **FR-PRJ-03** | Projects | Budget remaining lead figure with spent/reserved | Done | `pages/manager/ManagerProjectDetailPage.tsx` |
| **FR-PRJ-04** | Projects | TicketCard activity passes and volunteer lists | Done | `pages/manager/ManagerProjectDetailPage.tsx` |
| **FR-ASN-01** | Assignments | Manager deployments with supervisor and date bounds | Done | `pages/manager/ManagerProjectDetailPage.tsx` |
| **FR-ASN-02** | Assignments | Lifecycle: assigned, accepted, declined, completed | Done | `types/index.ts` -> `AssignmentStatus` |
| **FR-ASN-03** | Assignments | Volunteer Accept/Decline controls with reason note | Done | `pages/volunteer/VolunteerMyActivitiesPage.tsx` |
| **FR-ASN-04** | Assignments | Team Lead "My volunteers" supervised roster | Done | `pages/team-lead/TeamLeadMyVolunteersPage.tsx` |
| **FR-DOC-01** | Documents | Super Admin required verification documents catalog | Done | `pages/admin/AdminSettingsPage.tsx` |
| **FR-DOC-02** | Documents | Applicant document uploads with preview & file size | Done | `pages/applicant/ApplicantStatusPage.tsx` |
| **FR-DOC-03** | Documents | Manager Accept vs Return for correction with note | Done | `pages/manager/ManagerApplicationsPage.tsx` |
| **FR-DOC-04** | Documents | Evidence photo attachment for un-coded field work | Done | `pages/volunteer/VolunteerHoursPage.tsx`, `api/documents.ts` |
| **FR-ALW-01** | Allowances | Lifecycle: draft, submitted, verified, approved, paid | Done | `types/index.ts` -> `AllowanceStatus` |
| **FR-ALW-02** | Allowances | Manager allowance preparation within budget limits | Done | `pages/manager/ManagerAllowancesPage.tsx` |
| **FR-ALW-03** | Allowances | Supervising Team Lead attendance verification | Done | `pages/team-lead/TeamLeadVerifyAllowancesPage.tsx` |
| **FR-ALW-04** | Allowances | Budget authority approval reserving project funds | Done | `pages/admin/AdminAllowancesPage.tsx` |
| **FR-ALW-05** | Allowances | Strict separation of duties enforced in code | Done | `utils/permissions.ts`, `api/allowances.ts` |
| **FR-ALW-06** | Allowances | Finance Telebirr payout simulation with reference | Done | `pages/finance/FinanceAllowancesPage.tsx` |
| **FR-ALW-07** | Allowances | Volunteer timeline journey log and payout moment | Done | `pages/volunteer/VolunteerAllowancesPage.tsx` |

---

## 14. Roadmap: Modules Beyond the Prototype

The following modules represent strategic expansions planned for subsequent production releases:

1. **Association Membership & Annual Renewals**:
   - Institutional membership tiers (Student, Individual, Patron, Corporate Partner).
   - Annual subscription renewal billing with automated Telebirr recurring push requests.
   - Voting rights accreditation and delegate election badges for general assembly meetings.
2. **Programs & Monitoring Indicators**:
   - Multi-year program tracking linking specific community initiatives to United Nations Sustainable Development Goals (SDGs).
   - Quantitative impact indicators (trees planted, metric tons of waste sorted, students tutored, patients screened).
   - Real-time indicator dashboards and donor audit exports.
3. **Volunteer Human Resources (HR)**:
   - Disciplinary logging, formal grievance submission workflows, and ethics committee review dossiers.
   - Comprehensive volunteer service contracts and parental consent forms for minors.
   - In-person interview scheduling and panel scoring rubrics.
4. **Procurement & Asset Management**:
   - Equipment and asset inventory (safety vests, first aid kits, emergency radios, tools).
   - QR code equipment check-out and return tracking during field shifts.
   - Procurement requisition workflows with three-quote comparisons and manager sign-off.
5. **Executive & Governance Reporting**:
   - Real-time executive dashboards aggregating multi-branch operational health and cash flow.
   - Board of Directors quarterly review packets with automated trend analysis.
   - Ministry of Peace and CSO Authority regulatory compliance reporting.

---

## 15. Assumptions and Open Questions for the Client

### Operational Assumptions
1. **Currency and Locale**: All monetary amounts are denominated in Ethiopian Birr (ETB). The platform standardizes on Gregorian calendar dates for system integrity while allowing Ethiopian calendar display formatting in a future localization pass.
2. **Telebirr Integration**: The client organization will secure an official Ethio Telecom Telebirr Merchant Account for C2B collections and a B2C corporate payout agreement for allowance stipends.
3. **Single Active Role**: A user operates under a single assigned role at any given moment; when promoted from Volunteer to Team Lead, their operational access and default views elevate permanently.
4. **Age Requirement**: Volunteers must be at least 18 years old at self-registration; younger volunteers participate only through staff-assisted programs with documented guardian consent.

### Open Questions for Stakeholders
1. **Tax Treatment of Allowances**: Should field service daily stipends be subject to Ethiopian withholding tax, or are they categorized as non-taxable expense reimbursements under charity guidelines?
2. **Multi-Lingual Prioritization**: What is the target timeline for delivering official Amharic, Afaan Oromo, and Tigrinya localized interface translations?
3. **Offline Duty Logging**: How frequently do field activities occur in rural areas lacking cellular connectivity, and is a Progressive Web App (PWA) offline sync capability required for phase 2?
4. **Telebirr Fee Absorptions**: Will the organization absorb the Telebirr B2C disbursement transaction fee, or is it deducted from the volunteer's gross allowance?
5. **CSO Regulatory Auditing**: Does the regulatory body require direct read-only auditor credentials, or are exported activity log dossiers sufficient?

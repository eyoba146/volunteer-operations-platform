# VTS (Volunteer Tracking System): Requirements Specification

Version 1.0 | Prototype phase | Status: draft for team leader review

## 1. Purpose and scope

VTS is a responsive web platform (desktop and mobile) that lets a company run its volunteer program from start to finish: recruit people, collect a registration fee through Telebirr, organise volunteer work, prove and approve hours, and grow volunteers through ranks based on the work they have verifiably done.

### 1.1 Goals

- Replace scattered spreadsheets, chat groups and paper with one trusted record of every volunteer.
- Make recruitment, payment and activation a clear, trackable journey.
- Make promotion fair and visible: a volunteer can always see what they have done and what is left to reach the next rank.
- Give managers and finance staff reports they can trust and export.

### 1.2 Out of scope for version 1

Native mobile apps, in-app chat between users, multi-language support (English only for now), online card payments (Telebirr only), and integration with external HR systems.

### 1.3 Assumptions (to confirm with the team leader)

| ID | Assumption |
| --- | --- |
| A1 | The client is a company running a community volunteering program; the exact industry is not yet known, so the prototype uses neutral company-community content. |
| A2 | Payment happens after acceptance: apply, get reviewed and accepted, pay the registration fee, become a Volunteer. Rejected applicants never pay. (Confirmed by the team leader.) |
| A3 | The registration fee is one time and a single fixed amount, set by the Super Admin. The prototype uses ETB 200. |
| A4 | Telebirr confirms payments automatically. A manual Finance review exists only as a fallback. |
| A5 | Rank thresholds are configurable by the Super Admin; the values in section 5 are the starting defaults. |
| A6 | Dates use the standard calendar and money uses ETB. Ethiopian calendar support is a later option. |
| A7 | Volunteers must be 18 or older at registration. |

## 2. Roles and permissions

There are six roles. Each person signs in with their own account; there is no role switcher. A person has exactly one role at a time; the role changes when they are promoted.

| Role | Who they are | Main responsibilities |
| --- | --- | --- |
| Applicant | A registered person who is not yet an active volunteer | Complete the application, track its status, pay the fee once accepted |
| Volunteer | An active Volunteer or Senior Volunteer | Join activities, check in, log hours, track rank progress, get certificates and ID card |
| Team Lead | A volunteer holding Team Lead rank | Create and run activities, approve hours, rate volunteers, recommend promotions |
| Manager | Program manager (appointed company staff or regional director) | Review applications, register assisted volunteers, approve promotions, publish announcements, run reports |
| Finance Officer | Company finance staff | Watch Telebirr payments, record manual receipts, handle review queue, refunds, payment reports |
| Super Admin | System owner | Settings, fee amount, rank rules, organisation units, roles & permissions matrix, accounts, activity history |

### 2.1 Permission summary

| Capability | Applicant | Volunteer | Team Lead | Manager | Finance | Super Admin |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| Edit own profile | Yes | Yes | Yes | Yes | Yes | Yes |
| Submit and track application | Yes |  |  |  |  |  |
| Pay registration fee | Yes (after acceptance) |  |  |  |  |  |
| Browse and join activities |  | Yes | Yes | Yes |  |  |
| Create and run activities |  |  | Yes | Yes |  |  |
| Approve hours |  |  | Yes (own activities) | Yes (all) |  |  |
| Rate volunteers |  |  | Yes | Yes |  |  |
| Review applications |  |  |  | Yes |  |  |
| Approve promotions |  |  | Recommend, and approve Member to Senior | Yes (up to Team Lead) |  | Yes (Manager rank) |
| View payments | Own |  |  | Summary only | Yes | Yes |
| Resolve payments needing review, refunds |  |  |  |  | Yes |  |
| Publish announcements |  |  | Own team | Yes |  | Yes |
| Reports and exports |  | Own records | Own activities | Yes | Payments | Yes |
| Settings, rank rules, accounts |  |  |  |  |  | Yes |

## 3. The volunteer journey

1. **Register.** Email, username and password. A 6-digit code is sent by email (Brevo) to verify the address.
2. **Apply.** The Applicant completes a profile (name, phone, age, area, skills, availability, motivation, optional ID photo) and submits.
3. **Review.** A Manager reviews. Outcomes: accepted, more information needed, or rejected with a reason. The Applicant is notified by email and in the app.
4. **Pay.** After acceptance the Applicant has 7 days (configurable) to pay the registration fee through Telebirr. The payment is confirmed automatically.
5. **Activate.** On confirmed payment the account becomes a Member: a welcome moment, receipt by email, volunteer ID card, and access to activities.
6. **Work.** The Member joins activities, checks in, logs hours. The Team Lead approves hours and rates the work.
7. **Grow.** Verified work earns progress toward the next rank. When thresholds are met, the volunteer becomes eligible. A person approves the promotion; the volunteer is notified, gets a new badge and certificate, and unlocks the new responsibilities.

### 3.1 Status values

- **Account:** email not verified, active, suspended.
- **Application:** draft, submitted, in review, more information needed, accepted (waiting for payment), rejected, expired (not paid in time), withdrawn.
- **Payment:** not started, waiting for Telebirr, confirmed, failed, needs review, refunded.
- **Hours:** logged, approved, declined (with a reason).
- **Promotion:** not yet eligible, eligible, recommended, approved, declined.
- **Activity:** draft, open for sign-up, full, in progress, completed, cancelled.

## 4. Payment through Telebirr

### 4.1 Flow

1. Accepted Applicant opens the payment page and sees the fee, what it covers, and a Pay with Telebirr button.
2. The system creates a payment request for the exact amount and sends the person to Telebirr to approve it on their phone.
3. Telebirr tells the system the result automatically. The system marks the payment confirmed and activates the account in the same moment.
4. A receipt (reference number, amount, date) is shown in the app and emailed.

### 4.2 Edge cases the product must handle

- **No confirmation yet:** show "We are checking your payment. This usually takes less than a minute." Keep checking; after 10 minutes move to needs review and tell the person it is being looked at.
- **Payment failed or cancelled:** explain in plain words and offer Try again.
- **Paid twice:** the second payment is flagged for Finance to refund.
- **Acceptance expired:** the Manager can reopen it with one action.
- **Paid but account not activated:** impossible by design; Finance can force-match a payment to an applicant by Telebirr reference.
- **Refunds:** Finance only, with a reason, recorded in the activity history.

### 4.3 Finance screens

All payments with filters, payments needing review, a payment detail view with timeline, receipts, refunds, daily and monthly totals, and export.

## 5. Ranks and promotion

### 5.1 Rank ladder

| Rank | Role unlocked | What it unlocks |
| --- | --- | --- |
| Member | Volunteer | Join activities, certificate of membership, ID card |
| Senior Member | Volunteer | Priority sign-up, mentor new members, Senior badge and certificate |
| Team Lead | Team Lead | Create and run activities, approve hours, rate volunteers, recommend promotions |
| Manager | Manager | Review applications, manage volunteers, approve promotions, reports |

### 5.2 Default thresholds (editable by Super Admin)

| To reach | Approved hours | Completed activities | Average rating | Time as volunteer | Training |
| --- | --- | --- | --- | --- | --- |
| Senior Member | 60 | 8 | 4.0 | 3 months | 1 course |
| Team Lead | 150 | 20 | 4.2 | 6 months | Leadership course |
| Manager | 300 | 30, with 5 led | 4.4 | 12 months | Leadership course |

### 5.3 Rules

- Only approved hours and completed activities count.
- When every threshold is met the system marks the volunteer eligible and notifies the approver. Nobody is promoted automatically.
- Approvers: Team Lead for Member to Senior Member; Manager for Senior Member to Team Lead; Super Admin for Manager.
- Team Leads can recommend someone early with a written reason; the approver decides.
- Every volunteer sees a progress view: each threshold as a clear bar, what is done, what is left, and an estimate of what to do next.
- Declined promotions must show a reason the volunteer can read.
- Rank history is kept permanently on the profile.

## 6. Functional requirements

### 6.1 Accounts and access

- FR-AUTH-01 Register with first name, last name, username, email, phone number and password (rules shown while typing, live validation as user types, Ethiopian phone normalized to +251, duplicate checks).
- FR-AUTH-02 Verify email with a 6-digit code; resend after 60 seconds; code expires in 15 minutes.
- FR-AUTH-03 Sign in with email or username plus password.
- FR-AUTH-04 Forgot password by email link; reset page; confirmation email afterwards.
- FR-AUTH-05 Signed-in users only see pages for their role; others show a friendly not-allowed page.
- FR-AUTH-06 Sign out, and automatic sign-out after inactivity with a plain message.
- FR-AUTH-07 Change password and email from account settings.
- FR-AUTH-08 Lock sign-in for 15 minutes after 5 failed attempts, with a plain explanation.

### 6.2 Application and recruitment

- FR-APP-01 Multi-step application with saved progress.
- FR-APP-02 Upload optional profile photo and ID photo.
- FR-APP-03 Applicant sees a status timeline with what happens next.
- FR-APP-04 Manager sees an application queue with search, filters (status, area, skills, date) and sorting.
- FR-APP-05 Manager opens an application, reads it, adds private notes, and chooses accept, ask for more information, or reject (reason required).
- FR-APP-06 Bulk accept and bulk reject with a confirmation step.
- FR-APP-07 Accepted Applicants receive the payment invitation and a countdown.
- FR-APP-08 Applicants can withdraw before payment.

### 6.3 Volunteer profile

- FR-PRO-01 Profile with photo, bio, area, skills, availability, languages, and emergency contact.
- FR-PRO-02 Rank badge, member since, totals (hours, activities, rating).
- FR-PRO-03 Rank history and certificates.
- FR-PRO-04 Volunteer ID card with name, photo, rank, ID number and a QR code; downloadable and printable.
- FR-PRO-05 Change, crop, preview (zoom control) and remove profile picture from account settings.

### 6.4 Activities

- FR-ACT-01 Activity types: event, project, shift, field task, training session.
- FR-ACT-02 Fields: title, type, description, date and time, duration, location (area and place), spots, minimum rank, skills needed, team lead, cover image.
- FR-ACT-03 Volunteers browse a list and a calendar, filter by type, area, date, skills and rank.
- FR-ACT-04 Join and leave an activity (leaving close to the start is flagged to the lead).
- FR-ACT-05 Waiting list when full; automatic offer when a spot opens.
- FR-ACT-06 Team Lead manages the roster, sends a message to participants, and marks the activity complete.
- FR-ACT-07 Cancel or reschedule with automatic notification.

### 6.5 Check-in and hours

- FR-HRS-01 Check-in by scanning the activity QR or entering the short code shown by the Team Lead.
- FR-HRS-02 Check-out records hours automatically.
- FR-HRS-03 Volunteers can add missed hours manually with a note; these always need approval.
- FR-HRS-04 Team Lead approves or declines hours individually or in bulk; declines need a reason.
- FR-HRS-05 Volunteers see an hours history with the status of each entry.
- FR-HRS-06 Hours cannot overlap and cannot be added for future dates.

### 6.6 Ratings and feedback

- FR-RAT-01 After completion the Team Lead rates each participant from 1 to 5 with an optional note.
- FR-RAT-02 Volunteers can send feedback about an activity to the Manager.
- FR-RAT-03 Average rating appears on the profile and in rank progress.

### 6.7 Training

- FR-TRN-01 Training sessions are a type of activity; attending and being approved marks the course complete.
- FR-TRN-02 Completed courses appear on the profile and count toward rank thresholds.

### 6.8 Promotions

- FR-PRM-01 Progress view for every volunteer (section 5.3).
- FR-PRM-02 Eligible list for approvers with the evidence summarised.
- FR-PRM-03 Approve or decline with a note; the volunteer is notified.
- FR-PRM-04 On approval, the role changes at next sign-in, a new certificate is created, and the rank history is updated.

### 6.9 Certificates and ID cards

- FR-CRT-01 Certificates for: membership, each rank reached, and completed training.
- FR-CRT-02 Each certificate has a verification code and a public check page.
- FR-CRT-03 Download as PDF.

### 6.10 Announcements and notifications

- FR-NTF-01 Announcements to everyone, a rank, an area, or an activity roster.
- FR-NTF-02 In-app notification list with unread count.
- FR-NTF-03 Email through Brevo for: verification code, password reset, application result, payment invitation, payment receipt, welcome, activity reminders, hours decision, promotion result.
- FR-NTF-04 Volunteers choose which emails they receive (except account security emails).

### 6.11 Reports and exports

- FR-RPT-01 Manager dashboard: applications waiting, new volunteers, hours this month, upcoming activities, promotions waiting.
- FR-RPT-02 Reports: volunteers by rank and area, hours by period, activity attendance, application funnel, top volunteers.
- FR-RPT-03 Finance reports: payments by day and month, outstanding acceptances, refunds.
- FR-RPT-04 Export to Excel and PDF with the filters applied.

### 6.12 Administration

- FR-ADM-01 Manage settings: program name, registration fee, payment deadline, rank thresholds, areas, skills list, certificate text.
- FR-ADM-02 Create, suspend and reinstate accounts; assign roles to company staff.
- FR-ADM-03 Activity history: who did what and when, searchable, for accountability.
- FR-ADM-04 Email template preview and editing.

### 6.13 Projects

- FR-PRJ-01 Projects belong to a branch and define budget in ETB, daily allowance stipend in ETB, start/end dates, status, and project manager.
- FR-PRJ-02 Activities can belong to a project; Team Leads can select branch projects when scheduling activities.
- FR-PRJ-03 Manager project overview displays budget as one large numeral for remaining funds, with spent and reserved funds shown as an inline sentence.
- FR-PRJ-04 Manager project detail displays assigned volunteers and linked activities formatted as ticket passes.

### 6.14 Assignments and Supervisors

- FR-ASN-01 Managers can assign volunteers to a project or activity, designating a supervising Team Lead and service dates.
- FR-ASN-02 Assignment statuses: assigned, accepted, declined, completed.
- FR-ASN-03 Volunteers see staff assignments in "My roster" marked "Assigned by [Manager]" with Accept and Decline (with required explanation) actions.
- FR-ASN-04 Team Leads have a "My volunteers" directory showing supervised individuals, active deployments, and approved hours.

### 6.15 Documents and Evidence

- FR-DOC-01 Super Admin configures required applicant verification documents (National ID, Photo, Recommendation, Clearance).
- FR-DOC-02 Applicants upload required files with name, size, and preview.
- FR-DOC-03 Managers review uploaded documents with Accept or Return for correction (with mandatory explanation note); applicants see correction alerts.
- FR-DOC-04 Volunteers attach photo evidence to manual hours and field submissions ("Submit a completed activity"); Team Leads inspect evidence scoped to their branch.

### 6.16 Allowances (Money Out)

- FR-ALW-01 Lifecycle statuses: draft, submitted, verified, approved, paid, rejected, failed.
- FR-ALW-02 Manager prepares allowance request (days * allowancePerDay linked to approved service) within remaining project budget.
- FR-ALW-03 Supervising Team Lead verifies attendance.
- FR-ALW-04 Super Admin (Budget Authority) approves the allowance budget; approved amounts are reserved and paid amounts spent.
- FR-ALW-05 Strict separation of duties: nobody can approve an allowance they prepared, and volunteers cannot approve their own allowance.
- FR-ALW-06 Finance checks budget and disburses stipends via simulated Telebirr disbursement with transaction reference; failed payments can be retried.
- FR-ALW-07 Volunteers track allowance progress in "My allowances" with status journey log and Telebirr transaction reference.

## 7. Screens by role

**Public:** home page explaining the program and how to join, sign in, register, verify email, forgot password, reset password, certificate check.

**Applicant:** application form (steps), application status, payment, receipt, account settings, notifications.

**Volunteer:** home (next activity, rank progress, announcements), browse activities, calendar, activity detail, my activities, check-in, hours history and add hours, rank progress, certificates, ID card, profile, notification settings.

**Team Lead:** home (today, hours waiting, rosters), create and edit activity, my activities, roster and check-in code, hours approval, rate participants, recommend promotion, announcements to my team, plus all Volunteer screens.

**Manager:** dashboard, application queue and detail, volunteer directory and detail, all activities, promotions, announcements, reports, feedback inbox.

**Finance Officer:** payments overview, payment list and detail, needs-review list, refunds, receipts, reports.

**Super Admin:** system overview, settings, rank rules, accounts and roles, email templates, activity history.

## 8. Data model (shaped like the future database)

| Entity | Key fields |
| --- | --- |
| User | id, username, email, firstName, lastName, phone, avatarUrl, passwordHash, role, accountStatus, emailVerifiedAt, createdAt, lastSignInAt |
| VolunteerProfile | userId, firstName, lastName, fullName, phone, avatarUrl, dateOfBirth, area, bio, skills[], availability[], languages[], emergencyContact, photoUrl, idPhotoUrl, rank, memberSince, volunteerNumber, rankHistory[] |
| Application | id, userId, status, submittedAt, reviewedBy, reviewedAt, decisionReason, paymentDeadline, notes\[\] |
| Payment | id, userId, applicationId, amount, currency, telebirrReference, status, createdAt, confirmedAt, receiptNumber, refundedAt, refundReason |
| Activity | id, title, type, description, startsAt, endsAt, area, place, capacity, minRank, skills\[\], leadId, status, checkInCode, coverUrl |
| Enrollment | id, activityId, userId, status (joined, waiting, left, attended, no-show) |
| HoursEntry | id, userId, activityId, checkIn, checkOut, minutes, source (checkin, manual), status, decidedBy, decisionReason |
| Rating | id, activityId, userId, ratedBy, score, note |
| RankRule | rank, minHours, minActivities, minRating, minMonths, requiredTraining |
| Promotion | id, userId, fromRank, toRank, status, recommendedBy, decidedBy, decidedAt, note |
| Certificate | id, userId, kind, title, issuedAt, verificationCode, fileUrl |
| Announcement | id, authorId, audience, title, body, createdAt |
| Notification | id, userId, title, body, readAt, createdAt, link |
| ActivityLogEntry | id, actorId, action, subject, createdAt |
| Setting | key, value |
| Project | id, name, description, branchId, branchName, areaId, areaName, start, end, budget, allowancePerDay, spent, reserved, managerId, status, createdAt |
| Assignment | id, projectId, projectName, activityId, activityTitle, branchId, volunteerId, supervisorId, status, assignedBy, startDate, endDate, declineReason |
| RequiredDocumentConfig | id, name, description, required |
| ApplicationDocument | id, applicationId, configId, name, fileName, fileSize, fileUrl, uploadedAt, status, reviewNote, reviewedBy, reviewedAt |
| AllowanceRequest | id, allowanceNumber, projectId, projectName, branchId, activityId, volunteerId, volunteerName, volunteerPhone, days, allowancePerDay, totalAmount, status, preparedBy, supervisorId, verifiedBy, approvedBy, paidAt, paymentReference, rejectionReason, failureReason |
| DisbursementDetails | provider, phone, fee, transactionId, timestamp, networkRef |

## 9. System integration plan

| Service | Use |
| --- | --- |
| Express and Node.js | REST API, validation, role checks, payment result handling |
| PostgreSQL on Supabase | All entities above; indexes on email, username, status and dates |
| Cloudinary | Profile photos, ID photos, activity covers, generated certificate PDFs |
| Brevo | Verification codes, password resets and all emails in 6.10 |
| Telebirr API | Payment request and automatic result notification |

The prototype keeps every call behind one data layer (a folder of functions that return the same shapes the real API will). Connecting the backend means replacing that layer only; no screen changes.

Main API groups: auth, applications, payments, volunteers, activities, enrollments, hours, ratings, promotions, certificates, announcements, notifications, reports, settings, activity history.

## 10. Non-functional requirements

- **Plain language:** no technical words anywhere in the interface (section 11).
- **Responsive:** designed for phones and desktops with equal care; usable at 360 px width.
- **Speed:** pages feel instant; show skeleton placeholders instead of blank screens; slow connections must not break forms.
- **Navigation:** moving between pages never reloads the whole app; transitions are smooth and consistent.
- **Accessibility:** readable contrast, visible focus, keyboard use, text that scales, labels on every control.
- **Security:** hashed passwords, role checks on every request, locked-down file uploads, no card or secret data in the browser, payment results verified server-side.
- **Privacy:** ID photos visible only to Managers and Super Admin; people can request account deletion.
- **Reliability:** nothing is lost if a person closes the page halfway through a form or payment.
- **Accountability:** sensitive actions are recorded in the activity history.
- **Every screen has:** a loading state, an empty state that tells the person what to do next, and a helpful error state.

## 11. Wording rules for the interface

| Never show | Show instead |
| --- | --- |
| Payment webhook received | Payment received |
| Pending verification | We are checking your payment |
| 401 Unauthorized / session expired | You were signed out for safety. Please sign in again. |
| 500 Internal error | Something went wrong on our side. Please try again. |
| OTP | 6-digit code |
| Audit log | Activity history |
| Role / permission denied | You do not have access to this page. |
| Null / undefined / N/A | A friendly dash or a short explanation |
| Database, API, encrypted, secured, migration, token | Do not mention at all |

Tone: warm, direct, human. Short sentences. Buttons say what they do (Send my application, Pay with Telebirr, Approve hours).

## 12. Prototype scope and mock data

The prototype must demonstrate every module above with realistic data and working interactions (state changes persist while the demo runs).

### 12.1 Demo accounts (password for all: Demo@1234)

| Role | Name | Username | Situation |
| --- | --- | --- | --- |
| Applicant | Hana Tesfaye | hana.tesfaye | Accepted, payment waiting; completes the full upgrade moment |
| Volunteer | Dawit Bekele | dawit.bekele | Active, Kirkos branch (Addis), partway to Senior Volunteer |
| Senior Volunteer | Selam Alemu | selam.alemu | Meets every Team Lead threshold, promotion waiting |
| Team Lead (Addis) | Yonas Kebede | yonas.kebede | Kirkos branch scope, leads activities, hours waiting for approval |
| Team Lead (Adama) | Henok Assefa | henok.assefa | Adama Central branch scope, manages Adama activities and rosters |
| Manager (Addis) | Marta Girma | marta.girma | Addis Ababa area scope, applications queue, promotions waiting |
| Manager (Adama) | Tigist Wolde | tigist.wolde | Adama area scope, Adama volunteers and assisted registration |
| Finance Officer | Abel Hailu | abel.hailu | Head Office scope, review queue, record manual payment receipts |
| Super Admin | Ruth Mengistu | ruth.mengistu | Head Office scope, organisation units, roles & permissions matrix, audit history |

Also seed about 50 volunteers (including 12 in Adama area), 18 applications in different statuses (including 3 staff-assisted applications), 25 activities across Addis Ababa, Adama, Bishoftu, Hawassa and Bahir Dar, 60 payments, hours, ratings, certificates, SMS messages, and announcements. Use real-sounding Ethiopian names, areas, and ETB amounts.

### 12.2 Simulated Telebirr & Finance Manual Payment

A believable Telebirr step: the person sees the amount and a phone confirmation screen, with options in the demo to succeed, fail, or delay so Finance's needs-review flow can be shown. In addition, Finance Officers can record manual bank or branch cash payments, immediately issuing official receipt numbers and activating accounts.

### 12.3 Simulated Email & SMS Text Messages

Emails and SMS messages appear in a visible in-app preview dialog for the demo (verification code, receipts, decisions, reminders), with realistic simulated delivery.

## 13. Demo script (what the evaluator should be able to do)

1. Register as a new person, verify the email code, and submit an application.
2. Sign in as Marta Girma (Manager, Addis Ababa), verify that only Addis Ababa area applications and volunteers appear. Accept an application or register an in-person candidate via assisted intake.
3. Sign in as Tigist Wolde (Manager, Adama), verify that only Adama area volunteers, branches (Adama Central, Wonji Road), and activities appear.
4. Sign in as Hana Tesfaye, pay with Telebirr, and see the welcome moment and Volunteer ID pass.
5. Sign in as Dawit Bekele, join an activity, check in, log hours, view multi-channel alert settings and sign-in history.
6. Sign in as Yonas Kebede, approve hours (notice that self-approval is forbidden by separation of duties), rate volunteers, recommend a promotion.
7. Sign in as Marta Girma, approve Selam Alemu's promotion to Team Lead.
8. Sign in as Abel Hailu (Finance), inspect payment queue, record a manual payment, and export a report.
9. Sign in as Ruth Mengistu (Super Admin), inspect the 4-tier organisation tree (/admin/organisation), adjust role permission toggles with instant live effect (/admin/roles-permissions), look up individual person authorities, and view security & lockout logs.
10. Sign in as Marta Girma (Manager), view active projects and remaining budgets (/manager/projects), open Kirkos project detail, and prepare a 3-day field allowance for Dawit Bekele linked to verified service.
11. Sign in as Henok Assefa (Team Lead supervisor), inspect `/team-lead/allowances`, verify Dawit's field attendance with a verification note.
12. Sign in as Ruth Mengistu (Super Admin / Budget Authority), open `/admin/allowances`, approve the reserved budget for the verified request (confirming that self-approval rules prevent Marta from approving what she prepared).
13. Sign in as Abel Hailu (Finance), open `/finance/allowances`, select the approved request, disburse payment via Telebirr simulation, and observe generated transaction reference.
14. Sign in as Dawit Bekele (Volunteer), open `/volunteer/allowances`, inspect the journey log, see the payment reference, and trigger the payout celebration moment.

## 14. Open questions for the client

1. What does the company do, and what kind of volunteer work will it run?
2. Final registration fee amount and whether it differs by type of volunteer.
3. Real rank thresholds and what each rank should unlock.
4. Is there a minimum age other than 18, and are ID checks required?
5. Should the Ethiopian calendar and Amharic or Afaan Oromo be offered later?
6. Who owns the Telebirr merchant account and test access?
7. Is a yearly renewal fee planned?

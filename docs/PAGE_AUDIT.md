# VTS Site-Wide Page Audit & Verification Matrix
**Branch**: `phase5-polish` | **Ruleset**: R1 to R7

This document tracks visual, typographic, contrast, and plain language compliance across all routes, screen components, modals, and drawers in the Volunteer Tracking System prototype.

## Audit Rules Checklist
- **R1 Readability**: WCAG AA contrast (minimum 4.5:1) in all states. No blending text. Minimum font size: body 16px, secondary 14px, nothing below 13px.
- **R2 Black**: Black fill only for ONE primary button per visible section. Other buttons outlined or text links with arrow (`→`). No dark top bars. No large black bands or panels.
- **R3 Surfaces**: Regular cards and panels white with 1px soft slate border (`#D5DAE1`) and 10px radius, no hard shadow. Inputs/secondary buttons 1.5px dark slate border and 8px radius. Hard offset shadows only on ticket passes (ID card, certificate, receipt, activity tickets).
- **R4 Type**: Sentence case everywhere. No uppercase headlines, card titles, buttons, table headers, or eyebrow labels. Headlines weight 700 to 800.
- **R5 Composition**: Never a row of four identical boxes. Replace rows of equal stat tiles with one large lead numeral plus other numbers as inline list on white. Remove buttons that only repeat top nav and show live information instead. One colour moment per page; everything else white and quiet. Lists and tables ledger-style rows with generous height, not heavy bordered grids.
- **R6 Copy**: Plain, warm, no invented facts. Banned in anything a user can read: *directorate, audit, dynamic, qualification, official, civic, institutional, altitude, basecamp, summit, elevation, workspace, insurance, regional hubs, webhook, token, encrypted, API, OTP, Brevo*. Use: *Admin home, Activity history, Rank rules, Volunteer ID pass, Accounts and roles, Settings and emails*. No emojis, no Lucide.
- **R7 Responsive**: No overflow at 360px, tap targets at least 44px, tables and charts usable on phones.

---

## Page Inventory & Verification Table

| Role | Route / Screen | File | R1 Contrast | R2 Black | R3 Surfaces | R4 Type | R5 Composition | R6 Plain Copy | R7 Responsive (360/1440) | Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Public** | `/` (Home) | `pages/public/HomePage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Interactive) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/sign-in` | `pages/public/SignInPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/register` | `pages/public/RegisterPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/verify-email` | `pages/public/VerifyEmailPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/forgot-password` | `pages/public/ForgotPasswordPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/reset-password` | `pages/public/ResetPasswordPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/check-certificate` | `pages/public/CertificateCheckPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (Ticket/Pass) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Public** | `/unauthorized` | `pages/public/UnauthorizedPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Applicant** | `/applicant/status` | `pages/applicant/ApplicantStatusPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Applicant** | `/applicant/apply` | `pages/applicant/ApplicantApplyPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Applicant** | `/applicant/payment` | `pages/applicant/ApplicantPaymentPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (Pass/Receipt) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Applicant** | `/applicant/notifications` | `pages/applicant/ApplicantNotificationsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/home` | `pages/volunteer/VolunteerHomePage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Lead stat) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/activities` | `pages/volunteer/VolunteerActivitiesPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/activities/:id` | `pages/volunteer/VolunteerActivityDetailPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/my-activities` | `pages/volunteer/VolunteerMyActivitiesPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/check-in` | `pages/volunteer/VolunteerCheckInPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/hours` | `pages/volunteer/VolunteerHoursPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/rank-progress` | `pages/volunteer/VolunteerRankProgressPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Trail curve) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/certificates` | `pages/volunteer/VolunteerCertificatesPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (Ticket/Pass) | Pass (Sentence) | Pass (Physical pass) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/id-card` | `pages/volunteer/VolunteerIdCardPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (Ticket/Pass) | Pass (Sentence) | Pass (Physical pass) | Pass (Cleaned) | Pass (Clean) | Done |
| **Volunteer** | `/volunteer/profile` | `pages/volunteer/VolunteerProfilePage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/home` | `pages/team-lead/TeamLeadHomePage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Lead stat) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/approve-hours` | `pages/team-lead/TeamLeadApproveHoursPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/activities` | `pages/team-lead/TeamLeadActivitiesPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/create-activity` | `pages/team-lead/TeamLeadCreateActivityPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/ratings` | `pages/team-lead/TeamLeadRatingsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/recommend-promotion` | `pages/team-lead/TeamLeadRecommendPromotionPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Team Lead** | `/team-lead/announcements` | `pages/team-lead/TeamLeadAnnouncementsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Stream feed) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/dashboard` | `pages/manager/ManagerDashboardPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Lead stat) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/applications` | `pages/manager/ManagerApplicationsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/volunteers` | `pages/manager/ManagerVolunteersPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/activities` | `pages/manager/ManagerActivitiesPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ledger rows) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/promotions` | `pages/manager/ManagerPromotionsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Lead stat) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/announcements` | `pages/manager/ManagerAnnouncementsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Stream feed) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/feedback` | `pages/manager/ManagerFeedbackPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Cleaned) | Pass (Cleaned) | Pass (Clean) | Done |
| **Manager** | `/manager/reports` | `pages/manager/ManagerReportsPage.tsx` | Pass (AA) | Pass (1 btn/sec) | Pass (1px/#D5DAE1) | Pass (Sentence) | Pass (Ridgeline graph) | Pass (Cleaned) | Pass (Clean) | Done |
| **Finance** | `/finance/overview` | `pages/finance/FinanceOverviewPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Finance** | `/finance/payments` | `pages/finance/FinancePaymentsPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Finance** | `/finance/needs-review` | `pages/finance/FinanceNeedsReviewPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Finance** | `/finance/receipts-refunds` | `pages/finance/FinanceReceiptsRefundsPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Finance** | `/finance/reports` | `pages/finance/FinanceReportsPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Admin** | `/admin/overview` | `pages/admin/AdminOverviewPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Admin** | `/admin/settings` | `pages/admin/AdminSettingsPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Admin** | `/admin/rank-rules` | `pages/admin/AdminRankRulesPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Admin** | `/admin/accounts` | `pages/admin/AdminAccountsPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Admin** | `/admin/activity-history` | `pages/admin/AdminActivityHistoryPage.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Shared** | Top Bar & Dock | `components/layout/AppShellLayout.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Shared** | Public Top & Foot | `components/layout/PublicLayout.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Shared** | Email Preview | `components/demo/DemoEmailInbox.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Shared** | Photo Crop Modal | `components/ui/ProfilePhotoModal.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |
| **Shared** | Drawer / Sheet | `components/ui/SheetModal.tsx` | Pending | Pending | Pending | Pending | Pending | Pending | Pending | Queued |

---

const fs = require('fs');
const file = 'docs/PAGE_AUDIT.md';
let content = fs.readFileSync(file, 'utf8');

const mapping = {
  "pages/public/HomePage.tsx": "TopoBackdrop",
  "pages/public/SignInPage.tsx": "TopoBackdrop",
  "pages/public/RegisterPage.tsx": "TopoBackdrop",
  "pages/public/VerifyEmailPage.tsx": "n/a: 6-digit PIN form",
  "pages/public/ForgotPasswordPage.tsx": "n/a: recovery form",
  "pages/public/ResetPasswordPage.tsx": "n/a: password update form",
  "pages/public/CertificateCheckPage.tsx": "TopoBackdrop (cert pass)",
  "pages/public/UnauthorizedPage.tsx": "n/a: system notice",
  "pages/applicant/ApplicantStatusPage.tsx": "TrailMeter + TopoBackdrop",
  "pages/applicant/ApplicantApplyPage.tsx": "n/a: multi-step form",
  "pages/applicant/ApplicantPaymentPage.tsx": "MomentOverlay + TopoBackdrop",
  "pages/applicant/ApplicantNotificationsPage.tsx": "JourneyLog",
  "pages/volunteer/VolunteerHomePage.tsx": "TopoBackdrop + TrailMeter + TicketCard",
  "pages/volunteer/VolunteerActivitiesPage.tsx": "TicketCard",
  "pages/volunteer/VolunteerActivityDetailPage.tsx": "TopoBackdrop",
  "pages/volunteer/VolunteerMyActivitiesPage.tsx": "TicketCard",
  "pages/volunteer/VolunteerCheckInPage.tsx": "TopoBackdrop (ticket)",
  "pages/volunteer/VolunteerHoursPage.tsx": "JourneyLog",
  "pages/volunteer/VolunteerRankProgressPage.tsx": "TrailMeter + TopoBackdrop",
  "pages/volunteer/VolunteerCertificatesPage.tsx": "TopoBackdrop (ticket)",
  "pages/volunteer/VolunteerIdCardPage.tsx": "VolunteerCard + TopoBackdrop",
  "pages/volunteer/VolunteerProfilePage.tsx": "n/a: profile settings",
  "pages/team-lead/TeamLeadHomePage.tsx": "TopoBackdrop + TicketCard",
  "pages/team-lead/TeamLeadApproveHoursPage.tsx": "MomentOverlay",
  "pages/team-lead/TeamLeadActivitiesPage.tsx": "TicketCard",
  "pages/team-lead/TeamLeadCreateActivityPage.tsx": "n/a: activity form",
  "pages/team-lead/TeamLeadRatingsPage.tsx": "n/a: rating roster",
  "pages/team-lead/TeamLeadRecommendPromotionPage.tsx": "n/a: nomination modal",
  "pages/team-lead/TeamLeadAnnouncementsPage.tsx": "n/a: broadcast feed",
  "pages/manager/ManagerDashboardPage.tsx": "TopoBackdrop + Lead Stat",
  "pages/manager/ManagerApplicationsPage.tsx": "n/a: review queue",
  "pages/manager/ManagerVolunteersPage.tsx": "TrailMeter (compact) + JourneyLog",
  "pages/manager/ManagerActivitiesPage.tsx": "TicketCard",
  "pages/manager/ManagerPromotionsPage.tsx": "MomentOverlay + TopoBackdrop",
  "pages/manager/ManagerAnnouncementsPage.tsx": "n/a: broadcast feed",
  "pages/manager/ManagerFeedbackPage.tsx": "n/a: feedback inbox",
  "pages/manager/ManagerReportsPage.tsx": "n/a: charts & exports",
  "pages/finance/FinanceOverviewPage.tsx": "TopoBackdrop + Lead Stat",
  "pages/finance/FinancePaymentsPage.tsx": "JourneyLog + TopoBackdrop",
  "pages/finance/FinanceNeedsReviewPage.tsx": "n/a: exception queue",
  "pages/finance/FinanceReceiptsRefundsPage.tsx": "TopoBackdrop (receipt)",
  "pages/finance/FinanceReportsPage.tsx": "n/a: revenue charts",
  "pages/admin/AdminOverviewPage.tsx": "TopoBackdrop + Lead Stat",
  "pages/admin/AdminSettingsPage.tsx": "n/a: system settings",
  "pages/admin/AdminRankRulesPage.tsx": "n/a: rank rules matrix",
  "pages/admin/AdminAccountsPage.tsx": "n/a: account table",
  "pages/admin/AdminActivityHistoryPage.tsx": "JourneyLog",
  "components/layout/AppShellLayout.tsx": "TrailMeter (compact sidebar)",
  "components/layout/PublicLayout.tsx": "n/a: public chrome",
  "components/demo/DemoEmailInbox.tsx": "n/a: inbox drawer",
  "components/ui/ProfilePhotoModal.tsx": "n/a: photo crop modal",
  "components/ui/SheetModal.tsx": "n/a: drawer sheet",
};

let lines = content.split('\n');
lines = lines.map(line => {
  if (!line.startsWith('|')) return line;
  for (const [fileKey, sig] of Object.entries(mapping)) {
    if (line.includes(`\`${fileKey}\``)) {
      // line columns: Role | Route | File | R1 | R2 | Surface | Signature | R4 | R5 | R6 | R7 | Sidebar | Ripple | Status
      const parts = line.split('|');
      if (parts.length >= 8) {
        // parts[7] is Signature column (1-indexed based on split)
        parts[7] = ` ${sig} `;
        return parts.join('|');
      }
    }
  }
  return line;
});

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('docs/PAGE_AUDIT.md updated successfully with specific signatures!');


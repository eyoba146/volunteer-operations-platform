import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AppShellLayout } from './components/layout/AppShellLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PageTransition } from './components/layout/PageTransition';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { SignInPage } from './pages/public/SignInPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { CertificateCheckPage } from './pages/public/CertificateCheckPage';
import { UnauthorizedPage } from './pages/public/UnauthorizedPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Applicant Pages
import { ApplicantStatusPage } from './pages/applicant/ApplicantStatusPage';
import { ApplicantApplyPage } from './pages/applicant/ApplicantApplyPage';
import { ApplicantPaymentPage } from './pages/applicant/ApplicantPaymentPage';
import { ApplicantNotificationsPage } from './pages/applicant/ApplicantNotificationsPage';

// Volunteer Pages
import { VolunteerHomePage } from './pages/volunteer/VolunteerHomePage';
import { VolunteerActivitiesPage } from './pages/volunteer/VolunteerActivitiesPage';
import { VolunteerActivityDetailPage } from './pages/volunteer/VolunteerActivityDetailPage';
import { VolunteerMyActivitiesPage } from './pages/volunteer/VolunteerMyActivitiesPage';
import { VolunteerCheckInPage } from './pages/volunteer/VolunteerCheckInPage';
import { VolunteerHoursPage } from './pages/volunteer/VolunteerHoursPage';
import { VolunteerRankProgressPage } from './pages/volunteer/VolunteerRankProgressPage';
import { VolunteerCertificatesPage } from './pages/volunteer/VolunteerCertificatesPage';
import { VolunteerIdCardPage } from './pages/volunteer/VolunteerIdCardPage';
import { VolunteerProfilePage } from './pages/volunteer/VolunteerProfilePage';

// Team Lead Pages
import { TeamLeadHomePage } from './pages/team-lead/TeamLeadHomePage';
import { TeamLeadApproveHoursPage } from './pages/team-lead/TeamLeadApproveHoursPage';
import { TeamLeadActivitiesPage } from './pages/team-lead/TeamLeadActivitiesPage';
import { TeamLeadCreateActivityPage } from './pages/team-lead/TeamLeadCreateActivityPage';
import { TeamLeadRatingsPage } from './pages/team-lead/TeamLeadRatingsPage';
import { TeamLeadRecommendPromotionPage } from './pages/team-lead/TeamLeadRecommendPromotionPage';
import { TeamLeadAnnouncementsPage } from './pages/team-lead/TeamLeadAnnouncementsPage';

// Manager Pages
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage';
import { ManagerApplicationsPage } from './pages/manager/ManagerApplicationsPage';
import { ManagerVolunteersPage } from './pages/manager/ManagerVolunteersPage';
import { ManagerActivitiesPage } from './pages/manager/ManagerActivitiesPage';
import { ManagerPromotionsPage } from './pages/manager/ManagerPromotionsPage';
import { ManagerAnnouncementsPage } from './pages/manager/ManagerAnnouncementsPage';
import { ManagerFeedbackPage } from './pages/manager/ManagerFeedbackPage';
import { ManagerReportsPage } from './pages/manager/ManagerReportsPage';

// Finance Pages
import { FinanceOverviewPage } from './pages/finance/FinanceOverviewPage';
import { FinancePaymentsPage } from './pages/finance/FinancePaymentsPage';
import { FinanceNeedsReviewPage } from './pages/finance/FinanceNeedsReviewPage';
import { FinanceReceiptsRefundsPage } from './pages/finance/FinanceReceiptsRefundsPage';
import { FinanceReportsPage } from './pages/finance/FinanceReportsPage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminRankRulesPage } from './pages/admin/AdminRankRulesPage';
import { AdminAccountsPage } from './pages/admin/AdminAccountsPage';
import { AdminActivityHistoryPage } from './pages/admin/AdminActivityHistoryPage';

export const router = createBrowserRouter([
  // Public Layout routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <PageTransition><HomePage /></PageTransition> },
      { path: 'sign-in', element: <PageTransition><SignInPage /></PageTransition> },
      { path: 'register', element: <PageTransition><RegisterPage /></PageTransition> },
      { path: 'verify-email', element: <PageTransition><VerifyEmailPage /></PageTransition> },
      { path: 'forgot-password', element: <PageTransition><ForgotPasswordPage /></PageTransition> },
      { path: 'reset-password', element: <PageTransition><ResetPasswordPage /></PageTransition> },
      { path: 'check-certificate', element: <PageTransition><CertificateCheckPage /></PageTransition> },
      { path: 'unauthorized', element: <PageTransition><UnauthorizedPage /></PageTransition> },
      { path: '404', element: <PageTransition><NotFoundPage /></PageTransition> },
    ],
  },

  // Applicant Portal
  {
    path: '/applicant',
    element: (
      <ProtectedRoute allowedRoles={['applicant', 'volunteer']}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/applicant/status" replace /> },
      { path: 'status', element: <PageTransition><ApplicantStatusPage /></PageTransition> },
      { path: 'apply', element: <PageTransition><ApplicantApplyPage /></PageTransition> },
      { path: 'payment', element: <PageTransition><ApplicantPaymentPage /></PageTransition> },
      { path: 'notifications', element: <PageTransition><ApplicantNotificationsPage /></PageTransition> },
    ],
  },

  // Volunteer Portal
  {
    path: '/volunteer',
    element: (
      <ProtectedRoute allowedRoles={['volunteer', 'team_lead', 'manager']}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/volunteer/home" replace /> },
      { path: 'home', element: <PageTransition><VolunteerHomePage /></PageTransition> },
      { path: 'activities', element: <PageTransition><VolunteerActivitiesPage /></PageTransition> },
      { path: 'activities/:id', element: <PageTransition><VolunteerActivityDetailPage /></PageTransition> },
      { path: 'my-activities', element: <PageTransition><VolunteerMyActivitiesPage /></PageTransition> },
      { path: 'check-in', element: <PageTransition><VolunteerCheckInPage /></PageTransition> },
      { path: 'hours', element: <PageTransition><VolunteerHoursPage /></PageTransition> },
      { path: 'rank-progress', element: <PageTransition><VolunteerRankProgressPage /></PageTransition> },
      { path: 'certificates', element: <PageTransition><VolunteerCertificatesPage /></PageTransition> },
      { path: 'id-card', element: <PageTransition><VolunteerIdCardPage /></PageTransition> },
      { path: 'profile', element: <PageTransition><VolunteerProfilePage /></PageTransition> },
    ],
  },

  // Team Lead Portal
  {
    path: '/team-lead',
    element: (
      <ProtectedRoute allowedRoles={['team_lead', 'manager']}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/team-lead/home" replace /> },
      { path: 'home', element: <PageTransition><TeamLeadHomePage /></PageTransition> },
      { path: 'approve-hours', element: <PageTransition><TeamLeadApproveHoursPage /></PageTransition> },
      { path: 'activities', element: <PageTransition><TeamLeadActivitiesPage /></PageTransition> },
      { path: 'create-activity', element: <PageTransition><TeamLeadCreateActivityPage /></PageTransition> },
      { path: 'ratings', element: <PageTransition><TeamLeadRatingsPage /></PageTransition> },
      { path: 'recommend-promotion', element: <PageTransition><TeamLeadRecommendPromotionPage /></PageTransition> },
      { path: 'announcements', element: <PageTransition><TeamLeadAnnouncementsPage /></PageTransition> },
    ],
  },

  // Manager Portal
  {
    path: '/manager',
    element: (
      <ProtectedRoute allowedRoles={['manager']}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/manager/dashboard" replace /> },
      { path: 'dashboard', element: <PageTransition><ManagerDashboardPage /></PageTransition> },
      { path: 'applications', element: <PageTransition><ManagerApplicationsPage /></PageTransition> },
      { path: 'volunteers', element: <PageTransition><ManagerVolunteersPage /></PageTransition> },
      { path: 'activities', element: <PageTransition><ManagerActivitiesPage /></PageTransition> },
      { path: 'promotions', element: <PageTransition><ManagerPromotionsPage /></PageTransition> },
      { path: 'announcements', element: <PageTransition><ManagerAnnouncementsPage /></PageTransition> },
      { path: 'feedback', element: <PageTransition><ManagerFeedbackPage /></PageTransition> },
      { path: 'reports', element: <PageTransition><ManagerReportsPage /></PageTransition> },
    ],
  },

  // Finance Officer Portal
  {
    path: '/finance',
    element: (
      <ProtectedRoute allowedRoles={['finance', 'admin']}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/finance/overview" replace /> },
      { path: 'overview', element: <PageTransition><FinanceOverviewPage /></PageTransition> },
      { path: 'payments', element: <PageTransition><FinancePaymentsPage /></PageTransition> },
      { path: 'needs-review', element: <PageTransition><FinanceNeedsReviewPage /></PageTransition> },
      { path: 'receipts-refunds', element: <PageTransition><FinanceReceiptsRefundsPage /></PageTransition> },
      { path: 'reports', element: <PageTransition><FinanceReportsPage /></PageTransition> },
    ],
  },

  // Super Admin Portal
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AppShellLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/overview" replace /> },
      { path: 'overview', element: <PageTransition><AdminOverviewPage /></PageTransition> },
      { path: 'settings', element: <PageTransition><AdminSettingsPage /></PageTransition> },
      { path: 'rank-rules', element: <PageTransition><AdminRankRulesPage /></PageTransition> },
      { path: 'accounts', element: <PageTransition><AdminAccountsPage /></PageTransition> },
      { path: 'activity-history', element: <PageTransition><AdminActivityHistoryPage /></PageTransition> },
    ],
  },

  // Fallback Catch-all
  {
    path: '*',
    element: <PageTransition><NotFoundPage /></PageTransition>,
  },
]);

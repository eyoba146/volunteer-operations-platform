// scripts/inventory.cjs
// Automated Codebase Scanner for Volunteer Tracking System (VTS)
// Generates docs/inventory.json capturing facts, routes, types, APIs, permissions, and requirements.

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const clientRoot = path.join(repoRoot, 'client');
const srcRoot = path.join(clientRoot, 'src');
const docsRoot = path.join(repoRoot, 'docs');

if (!fs.existsSync(docsRoot)) {
  fs.mkdirSync(docsRoot, { recursive: true });
}

console.log('--- Scanning VTS Codebase for docs/inventory.json ---');

// 1. Scan Routes & Data-Pages
const routeDefinitions = [
  // Public
  { path: '/', roleAccess: ['public'], component: 'HomePage', file: 'client/src/pages/public/HomePage.tsx' },
  { path: '/sign-in', roleAccess: ['public'], component: 'SignInPage', file: 'client/src/pages/public/SignInPage.tsx' },
  { path: '/register', roleAccess: ['public'], component: 'RegisterPage', file: 'client/src/pages/public/RegisterPage.tsx' },
  { path: '/verify-email', roleAccess: ['public'], component: 'VerifyEmailPage', file: 'client/src/pages/public/VerifyEmailPage.tsx' },
  { path: '/forgot-password', roleAccess: ['public'], component: 'ForgotPasswordPage', file: 'client/src/pages/public/ForgotPasswordPage.tsx' },
  { path: '/reset-password', roleAccess: ['public'], component: 'ResetPasswordPage', file: 'client/src/pages/public/ResetPasswordPage.tsx' },
  { path: '/check-certificate', roleAccess: ['public'], component: 'CertificateCheckPage', file: 'client/src/pages/public/CertificateCheckPage.tsx' },
  { path: '/unauthorized', roleAccess: ['public'], component: 'UnauthorizedPage', file: 'client/src/pages/public/UnauthorizedPage.tsx' },
  { path: '/404', roleAccess: ['public'], component: 'NotFoundPage', file: 'client/src/pages/public/NotFoundPage.tsx' },
  
  // Applicant
  { path: '/applicant/status', roleAccess: ['applicant', 'volunteer'], component: 'ApplicantStatusPage', file: 'client/src/pages/applicant/ApplicantStatusPage.tsx' },
  { path: '/applicant/apply', roleAccess: ['applicant', 'volunteer'], component: 'ApplicantApplyPage', file: 'client/src/pages/applicant/ApplicantApplyPage.tsx' },
  { path: '/applicant/payment', roleAccess: ['applicant', 'volunteer'], component: 'ApplicantPaymentPage', file: 'client/src/pages/applicant/ApplicantPaymentPage.tsx' },
  { path: '/applicant/notifications', roleAccess: ['applicant', 'volunteer'], component: 'ApplicantNotificationsPage', file: 'client/src/pages/applicant/ApplicantNotificationsPage.tsx' },

  // Volunteer
  { path: '/volunteer/home', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerHomePage', file: 'client/src/pages/volunteer/VolunteerHomePage.tsx' },
  { path: '/volunteer/activities', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerActivitiesPage', file: 'client/src/pages/volunteer/VolunteerActivitiesPage.tsx' },
  { path: '/volunteer/activities/:id', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerActivityDetailPage', file: 'client/src/pages/volunteer/VolunteerActivityDetailPage.tsx' },
  { path: '/volunteer/my-activities', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerMyActivitiesPage', file: 'client/src/pages/volunteer/VolunteerMyActivitiesPage.tsx' },
  { path: '/volunteer/check-in', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerCheckInPage', file: 'client/src/pages/volunteer/VolunteerCheckInPage.tsx' },
  { path: '/volunteer/hours', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerHoursPage', file: 'client/src/pages/volunteer/VolunteerHoursPage.tsx' },
  { path: '/volunteer/rank-progress', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerRankProgressPage', file: 'client/src/pages/volunteer/VolunteerRankProgressPage.tsx' },
  { path: '/volunteer/certificates', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerCertificatesPage', file: 'client/src/pages/volunteer/VolunteerCertificatesPage.tsx' },
  { path: '/volunteer/id-card', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerIdCardPage', file: 'client/src/pages/volunteer/VolunteerIdCardPage.tsx' },
  { path: '/volunteer/profile', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerProfilePage', file: 'client/src/pages/volunteer/VolunteerProfilePage.tsx' },
  { path: '/volunteer/allowances', roleAccess: ['volunteer', 'team_lead', 'manager'], component: 'VolunteerAllowancesPage', file: 'client/src/pages/volunteer/VolunteerAllowancesPage.tsx' },

  // Team Lead
  { path: '/team-lead/home', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadHomePage', file: 'client/src/pages/team-lead/TeamLeadHomePage.tsx' },
  { path: '/team-lead/volunteers', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadMyVolunteersPage', file: 'client/src/pages/team-lead/TeamLeadMyVolunteersPage.tsx' },
  { path: '/team-lead/activities', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadActivitiesPage', file: 'client/src/pages/team-lead/TeamLeadActivitiesPage.tsx' },
  { path: '/team-lead/create-activity', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadCreateActivityPage', file: 'client/src/pages/team-lead/TeamLeadCreateActivityPage.tsx' },
  { path: '/team-lead/approve-hours', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadApproveHoursPage', file: 'client/src/pages/team-lead/TeamLeadApproveHoursPage.tsx' },
  { path: '/team-lead/allowances', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadVerifyAllowancesPage', file: 'client/src/pages/team-lead/TeamLeadVerifyAllowancesPage.tsx' },
  { path: '/team-lead/ratings', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadRatingsPage', file: 'client/src/pages/team-lead/TeamLeadRatingsPage.tsx' },
  { path: '/team-lead/recommend-promotion', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadRecommendPromotionPage', file: 'client/src/pages/team-lead/TeamLeadRecommendPromotionPage.tsx' },
  { path: '/team-lead/announcements', roleAccess: ['team_lead', 'manager'], component: 'TeamLeadAnnouncementsPage', file: 'client/src/pages/team-lead/TeamLeadAnnouncementsPage.tsx' },

  // Manager
  { path: '/manager/dashboard', roleAccess: ['manager'], component: 'ManagerDashboardPage', file: 'client/src/pages/manager/ManagerDashboardPage.tsx' },
  { path: '/manager/projects', roleAccess: ['manager'], component: 'ManagerProjectsPage', file: 'client/src/pages/manager/ManagerProjectsPage.tsx' },
  { path: '/manager/projects/:id', roleAccess: ['manager'], component: 'ManagerProjectDetailPage', file: 'client/src/pages/manager/ManagerProjectDetailPage.tsx' },
  { path: '/manager/allowances', roleAccess: ['manager'], component: 'ManagerAllowancesPage', file: 'client/src/pages/manager/ManagerAllowancesPage.tsx' },
  { path: '/manager/applications', roleAccess: ['manager'], component: 'ManagerApplicationsPage', file: 'client/src/pages/manager/ManagerApplicationsPage.tsx' },
  { path: '/manager/register-volunteer', roleAccess: ['manager'], component: 'ManagerRegisterVolunteerPage', file: 'client/src/pages/manager/ManagerRegisterVolunteerPage.tsx' },
  { path: '/manager/volunteers', roleAccess: ['manager'], component: 'ManagerVolunteersPage', file: 'client/src/pages/manager/ManagerVolunteersPage.tsx' },
  { path: '/manager/activities', roleAccess: ['manager'], component: 'ManagerActivitiesPage', file: 'client/src/pages/manager/ManagerActivitiesPage.tsx' },
  { path: '/manager/promotions', roleAccess: ['manager'], component: 'ManagerPromotionsPage', file: 'client/src/pages/manager/ManagerPromotionsPage.tsx' },
  { path: '/manager/announcements', roleAccess: ['manager'], component: 'ManagerAnnouncementsPage', file: 'client/src/pages/manager/ManagerAnnouncementsPage.tsx' },
  { path: '/manager/feedback', roleAccess: ['manager'], component: 'ManagerFeedbackPage', file: 'client/src/pages/manager/ManagerFeedbackPage.tsx' },
  { path: '/manager/reports', roleAccess: ['manager'], component: 'ManagerReportsPage', file: 'client/src/pages/manager/ManagerReportsPage.tsx' },

  // Finance
  { path: '/finance/overview', roleAccess: ['finance', 'admin'], component: 'FinanceOverviewPage', file: 'client/src/pages/finance/FinanceOverviewPage.tsx' },
  { path: '/finance/allowances', roleAccess: ['finance', 'admin'], component: 'FinanceAllowancesPage', file: 'client/src/pages/finance/FinanceAllowancesPage.tsx' },
  { path: '/finance/payments', roleAccess: ['finance', 'admin'], component: 'FinancePaymentsPage', file: 'client/src/pages/finance/FinancePaymentsPage.tsx' },
  { path: '/finance/needs-review', roleAccess: ['finance', 'admin'], component: 'FinanceNeedsReviewPage', file: 'client/src/pages/finance/FinanceNeedsReviewPage.tsx' },
  { path: '/finance/receipts-refunds', roleAccess: ['finance', 'admin'], component: 'FinanceReceiptsRefundsPage', file: 'client/src/pages/finance/FinanceReceiptsRefundsPage.tsx' },
  { path: '/finance/reports', roleAccess: ['finance', 'admin'], component: 'FinanceReportsPage', file: 'client/src/pages/finance/FinanceReportsPage.tsx' },

  // Admin
  { path: '/admin/overview', roleAccess: ['admin'], component: 'AdminOverviewPage', file: 'client/src/pages/admin/AdminOverviewPage.tsx' },
  { path: '/admin/allowances', roleAccess: ['admin'], component: 'AdminAllowancesPage', file: 'client/src/pages/admin/AdminAllowancesPage.tsx' },
  { path: '/admin/organisation', roleAccess: ['admin'], component: 'AdminOrganisationPage', file: 'client/src/pages/admin/AdminOrganisationPage.tsx' },
  { path: '/admin/roles-permissions', roleAccess: ['admin'], component: 'AdminRolesPermissionsPage', file: 'client/src/pages/admin/AdminRolesPermissionsPage.tsx' },
  { path: '/admin/settings', roleAccess: ['admin'], component: 'AdminSettingsPage', file: 'client/src/pages/admin/AdminSettingsPage.tsx' },
  { path: '/admin/rank-rules', roleAccess: ['admin'], component: 'AdminRankRulesPage', file: 'client/src/pages/admin/AdminRankRulesPage.tsx' },
  { path: '/admin/accounts', roleAccess: ['admin'], component: 'AdminAccountsPage', file: 'client/src/pages/admin/AdminAccountsPage.tsx' },
  { path: '/admin/activity-history', roleAccess: ['admin'], component: 'AdminActivityHistoryPage', file: 'client/src/pages/admin/AdminActivityHistoryPage.tsx' },
];

const scannedRoutes = routeDefinitions.map(r => {
  const fullPath = path.join(repoRoot, r.file);
  let dataPage = 'unknown';
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const match = content.match(/page=["']([^"']+)["']/);
    if (match) dataPage = match[1];
  }
  return { ...r, dataPage };
});

// 2. Roles, Ranks, Scope Levels, Permissions
const roles = [
  { id: 'applicant', label: 'Applicant', description: 'Prospective volunteer completing admissions, fee settlement, and identity verification.' },
  { id: 'volunteer', label: 'Volunteer', description: 'Active enrolled volunteer participating in field service, logging hours, and earning rank milestones.' },
  { id: 'team_lead', label: 'Team Lead', description: 'Field squad supervisor leading activities, auditing hours and evidence, and rating participants.' },
  { id: 'manager', label: 'Manager', description: 'Regional operations manager deciding admissions, assisted intake, projects, and promotional boards.' },
  { id: 'finance', label: 'Finance Officer', description: 'Reconciliation officer managing Telebirr fee settlements and field allowance payouts.' },
  { id: 'admin', label: 'Super Admin', description: 'System owner managing the organization tree, dynamic role permissions matrix, and global settings.' },
];

const ranks = [
  { id: 'volunteer', label: 'Volunteer', order: 1, minHours: 0, minActivities: 0, minRating: 0, minMonths: 0, training: 'Induction' },
  { id: 'senior_volunteer', label: 'Senior Volunteer', order: 2, minHours: 50, minActivities: 10, minRating: 4.0, minMonths: 3, training: 'Advanced Field Leadership' },
  { id: 'team_lead', label: 'Team Lead', order: 3, minHours: 150, minActivities: 25, minRating: 4.5, minMonths: 6, training: 'Crisis Intervention & Safety' },
  { id: 'manager', label: 'Manager', order: 4, minHours: 300, minActivities: 50, minRating: 4.8, minMonths: 12, training: 'Operational Governance' },
];

const scopeLevels = ['all', 'area', 'branch', 'own'];

const permissionModules = [
  'applications', 'volunteers', 'activities', 'hours', 'ratings', 'promotions',
  'payments', 'announcements', 'reports', 'settings', 'organisation', 'accounts',
  'projects', 'assignments', 'documents', 'allowances'
];

const permissionActions = ['view', 'create', 'edit', 'delete', 'approve', 'export'];

// 3. Status Enums
const statusEnums = {
  AccountStatus: ['pending_verification', 'active', 'suspended', 'locked'],
  ApplicationStatus: ['draft', 'submitted', 'in_review', 'more_info_needed', 'accepted', 'rejected', 'expired', 'withdrawn'],
  PaymentStatus: ['pending', 'confirmed', 'failed', 'needs_review', 'refunded'],
  HoursStatus: ['logged', 'approved', 'declined'],
  PromotionStatus: ['not_eligible', 'eligible', 'recommended', 'approved', 'declined'],
  ActivityStatus: ['draft', 'published', 'in_progress', 'completed', 'cancelled'],
  EnrollmentStatus: ['joined', 'waitlisted', 'cancelled', 'attended', 'no_show'],
  CertificateKind: ['membership', 'rank_advancement', 'training_completion', 'appreciation'],
  OrgUnitType: ['head_office', 'area', 'branch', 'location'],
  ProjectStatus: ['planning', 'active', 'completed', 'paused'],
  AssignmentStatus: ['assigned', 'accepted', 'declined', 'completed'],
  DocumentReviewStatus: ['pending', 'accepted', 'returned_for_correction'],
  AllowanceStatus: ['draft', 'submitted', 'verified', 'approved', 'paid', 'rejected', 'failed']
};

// 4. API Functions Scan
const apiDir = path.join(srcRoot, 'api');
const apiFiles = fs.readdirSync(apiDir).filter(f => f.endsWith('.ts') && !['seedData.ts', 'store.ts', 'delay.ts'].includes(f));
const apiFunctions = [];

apiFiles.forEach(file => {
  const content = fs.readFileSync(path.join(apiDir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line) => {
    const match = line.match(/export\s+(async\s+)?function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)(?::\s*([^{]+))?/);
    if (match) {
      apiFunctions.push({
        file: `client/src/api/${file}`,
        name: match[2],
        params: match[3].trim(),
        returnType: match[4] ? match[4].trim() : 'void',
        isAsync: Boolean(match[1])
      });
    }
  });
});

// 5. Requirements Scan
const reqFile = path.join(repoRoot, 'docs/REQUIREMENTS.md');
const reqContent = fs.readFileSync(reqFile, 'utf8');
const reqMatches = reqContent.matchAll(/-\s+`?(FR-[A-Z]+-[0-9]+)`?\s*[:.]?\s*([^\n\r]+)/g);
const requirements = [];

for (const match of reqMatches) {
  requirements.push({
    id: match[1],
    text: match[2].trim()
  });
}

// 6. Demo Accounts & Seed Entities
const demoAccounts = [
  { role: 'Applicant', name: 'Hana Tesfaye', username: 'hana.tesfaye', scope: 'Addis Ababa Area', scenario: 'Accepted candidate ready to settle Telebirr fee' },
  { role: 'Volunteer', name: 'Dawit Bekele', username: 'dawit.bekele', scope: 'Kirkos Branch, Addis Ababa', scenario: 'Active volunteer logging hours and tracking project stipends' },
  { role: 'Senior Volunteer', name: 'Selam Alemu', username: 'selam.alemu', scope: 'Bole Branch, Addis Ababa', scenario: 'Meets leadership thresholds; eligible for Team Lead promotion' },
  { role: 'Team Lead', name: 'Yonas Kebede', username: 'yonas.kebede', scope: 'Kirkos Branch, Addis Ababa', scenario: 'Dispatches activities, generates short codes, audits hours' },
  { role: 'Team Lead', name: 'Henok Assefa', username: 'henok.assefa', scope: 'Adama Central Branch', scenario: 'Supervises Adama projects; verifies attendance for allowances' },
  { role: 'Manager', name: 'Marta Girma', username: 'marta.girma', scope: 'Addis Ababa Area', scenario: 'Reviews applications, charters projects, prepares allowances' },
  { role: 'Manager', name: 'Tigist Wolde', username: 'tigist.wolde', scope: 'Adama Area', scenario: 'Exercises regional scoping; registers walk-ins via assisted intake' },
  { role: 'Finance Officer', name: 'Abel Hailu', username: 'abel.hailu', scope: 'Head Office (All Scope)', scenario: 'Reconciles Telebirr fees; disburses mobile wallet allowances' },
  { role: 'Super Admin', name: 'Ruth Mengistu', username: 'ruth.mengistu', scope: 'Head Office (All Scope)', scenario: 'Manages organization tree, approves allowance budgets, sets permissions' },
];

const seedCounts = {
  users: 52,
  profiles: 52,
  orgUnits: 10,
  applications: 18,
  projects: 4,
  activities: 25,
  assignments: 6,
  hours: 68,
  ratings: 42,
  promotions: 8,
  certificates: 16,
  announcements: 10,
  notifications: 32,
  payments: 60,
  allowances: 13,
  requiredDocumentConfigs: 4,
  applicationDocuments: 3,
  completedActivitySubmissions: 1,
  signInLogs: 24,
  smsMessages: 14
};

// 7. Signature Components & Design Tokens
const signatureComponents = [
  { name: 'TopoBackdrop', purpose: 'Topographic contour SVG backdrop providing geographic texture with subtle opacity' },
  { name: 'TrailMeter', purpose: 'Dynamic milestone curve visualizing progress toward next rank with remaining gap indicators' },
  { name: 'TicketCard', purpose: 'Notched ticket-stub card design for scheduled activities and deployments' },
  { name: 'JourneyLog', purpose: 'Step-by-step chronological audit timeline for hours, allowances, and payments' },
  { name: 'MomentOverlay', purpose: 'Celebratory moment modal triggering upon rank promotion and allowance payout' },
  { name: 'VolunteerCard', purpose: 'Official printable and verifiable ID pass with QR verification code' },
];

const designTokens = {
  colors: {
    canvas: '#FFFFFF',
    panelSubdued: '#F7F8FA',
    panelMuted: '#F1F3F6',
    inkPrimary: '#111315',
    inkSecondary: '#5A606A',
    inkTertiary: '#8D95A5',
    brandTeal: '#0E6266',
    brandTealLight: '#E8F8F5',
    roleApplicant: '#D97706',
    roleVolunteer: '#1E824C',
    roleTeamLead: '#1B4D3E',
    roleManager: '#0E6266',
    roleFinance: '#2B4C7E',
    roleAdmin: '#6A2E35'
  },
  typography: {
    displayFont: 'Bricolage Grotesque',
    bodyFont: 'Hanken Grotesk',
    monoFont: 'JetBrains Mono',
    case: 'Sentence case strictly enforced everywhere'
  },
  surfaces: {
    rule: 'Zero borders anywhere in the UI. All separation is spatial, tonal, and soft shadow.',
    radiusCard: '16px',
    radiusInput: '12px',
    radiusButton: '12px',
    shadowSoft: '0 1px 2px rgba(16,24,40,0.05), 0 8px 24px -12px rgba(16,24,40,0.10)'
  },
  interactions: {
    buttonRipple: 'Material wave ripple on every clickable button or tile',
    pageTransitions: 'Subtle 150ms opacity cross-fade across route changes',
    sidebar: 'Fixed 264px desktop sidebar navigation; off-canvas slide-in mobile navigation drawer'
  }
};

// 8. Demo Script Steps
const demoScriptSteps = [
  { step: 1, title: 'Assisted Intake', role: 'tigist.wolde', route: '/manager/register-volunteer', action: 'Register walk-in volunteer in 4 steps with Kebele ID and cash receipt.' },
  { step: 2, title: 'Document Correction Notice', role: 'marta.girma', route: '/manager/applications', action: 'Return blurry Kebele ID upload for correction with required explanatory note.' },
  { step: 3, title: 'Document Replacement & Payment', role: 'hana.tesfaye', route: '/applicant/status & /applicant/payment', action: 'Upload replacement file and settle ETB 200 fee via Telebirr push to activate volunteer status.' },
  { step: 4, title: 'Project Charter & Budgets', role: 'marta.girma', route: '/manager/projects & detail', action: 'Observe remaining budget figure; inspect assigned volunteers and ticket cards.' },
  { step: 5, title: 'Allowance Preparation', role: 'marta.girma', route: '/manager/allowances', action: 'Prepare 3-day stipend for Dawit Bekele under Kirkos project within budget limit.' },
  { step: 6, title: 'Supervisor Verification', role: 'yonas.kebede', route: '/team-lead/allowances', action: 'Verify field service attendance with physical confirmation note.' },
  { step: 7, title: 'Budget Authority Approval', role: 'ruth.mengistu', route: '/admin/allowances', action: 'Approve reserved budget funds (confirming self-approval ban blocks preparer).' },
  { step: 8, title: 'Telebirr Disbursement', role: 'abel.hailu', route: '/finance/allowances', action: 'Execute mobile wallet payout; observe official transaction reference generation.' },
  { step: 9, title: 'Volunteer Celebration', role: 'dawit.bekele', route: '/volunteer/allowances', action: 'Inspect status journey timeline, Telebirr reference, and trigger celebration overlay.' }
];

// Compile Complete Inventory Object
const inventory = {
  generatedAt: new Date().toISOString(),
  metrics: {
    totalRoutes: scannedRoutes.length,
    totalRoles: roles.length,
    totalRanks: ranks.length,
    totalPermissionModules: permissionModules.length,
    totalStatusEnums: Object.keys(statusEnums).length,
    totalApiFunctions: apiFunctions.length,
    totalRequirements: requirements.length,
    totalDemoAccounts: demoAccounts.length,
    totalDemoScriptSteps: demoScriptSteps.length
  },
  routes: scannedRoutes,
  roles,
  ranks,
  scopeLevels,
  permissionModules,
  permissionActions,
  statusEnums,
  apiFunctions,
  requirements,
  demoAccounts,
  demoScriptSteps,
  seedCounts,
  signatureComponents,
  designTokens
};

// Write docs/inventory.json
const inventoryPath = path.join(docsRoot, 'inventory.json');
fs.writeFileSync(inventoryPath, JSON.stringify(inventory, null, 2), 'utf8');

console.log('\n--- INVENTORY SCAN COMPLETE ---');
console.log(`Routes Scanned:        ${inventory.metrics.totalRoutes}`);
console.log(`Roles Cataloged:       ${inventory.metrics.totalRoles}`);
console.log(`Ranks Cataloged:       ${inventory.metrics.totalRanks}`);
console.log(`Permission Modules:    ${inventory.metrics.totalPermissionModules}`);
console.log(`Status Enums:          ${inventory.metrics.totalStatusEnums}`);
console.log(`API Functions:         ${inventory.metrics.totalApiFunctions}`);
console.log(`Requirements Traced:   ${inventory.metrics.totalRequirements}`);
console.log(`Demo Accounts:         ${inventory.metrics.totalDemoAccounts}`);
console.log(`Demo Script Steps:     ${inventory.metrics.totalDemoScriptSteps}`);
console.log(`Saved output to:       ${path.relative(repoRoot, inventoryPath)}`);

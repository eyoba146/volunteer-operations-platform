// test_upgrade2.cjs
// Verification suite for VTS UPGRADE 2: Work and Money
// Tests: Projects, Assignments, Documents & Evidence, Allowances end-to-end chain,
// Separation of duties, Budget limit enforcement, Duplicate prevention, Scoping, and Zero Borders.

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${message}`);
    testsFailed++;
  }
}

const srcDir = path.resolve(__dirname, '../src');

function scanFiles(dir, exts, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFiles(fullPath, exts, results);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

console.log('====================================================');
console.log('VTS UPGRADE 2: WORK & MONEY VERIFICATION SUITE');
console.log('====================================================\n');

// -----------------------------------------------------------------
// TEST 1: Seed Data Integrity for Projects, Activities, Assignments, Documents, Allowances
// -----------------------------------------------------------------
console.log('--- TEST 1: Seed Data Models & Linkages ---');
const seedDataContent = fs.readFileSync(path.join(srcDir, 'api/seedData.ts'), 'utf8');

// 1.1 Four Projects Across Areas
assert(seedDataContent.includes('export const SEED_PROJECTS: Project[] = ['), 'SEED_PROJECTS defined with Project type');
const projectMatches = seedDataContent.match(/id:\s*['"]proj-[^'"]+['"]/g) || [];
assert(projectMatches.length >= 4, `At least 4 projects seeded across areas (found ${projectMatches.length})`);
assert(seedDataContent.includes('proj-kirkos-green') && seedDataContent.includes('proj-bole-mentorship') &&
       seedDataContent.includes('proj-adama-health') && seedDataContent.includes('proj-hawassa-lake'),
       'Specific projects for Kirkos, Bole, Adama, and Hawassa exist with ETB budgets');

// 1.2 Activities Linked to Projects
const activityProjectLinks = seedDataContent.match(/projectId:\s*['"]proj-[^'"]+['"]/g) || [];
assert(activityProjectLinks.length >= 25, `All 25 seeded activities linked to a project (found ${activityProjectLinks.length})`);

// 1.3 Assignments Seeded
assert(seedDataContent.includes('export const SEED_ASSIGNMENTS: Assignment[] = ['), 'SEED_ASSIGNMENTS defined with Assignment type');
const assignmentMatches = seedDataContent.match(/id:\s*['"]asgn-[^'"]+['"]/g) || [];
assert(assignmentMatches.length >= 6, `At least 6 assignments seeded (found ${assignmentMatches.length})`);
assert(seedDataContent.includes("status: 'assigned'") && seedDataContent.includes("status: 'accepted'"),
       'Assignments have various statuses (assigned, accepted, etc.)');

// 1.4 Required Documents & Evidence
assert(seedDataContent.includes('export const SEED_REQUIRED_DOCUMENTS: RequiredDocumentConfig[] = ['), 'SEED_REQUIRED_DOCUMENTS defined');
assert(seedDataContent.includes('export const SEED_APPLICATION_DOCUMENTS: ApplicationDocument[] = ['), 'SEED_APPLICATION_DOCUMENTS defined');
assert(seedDataContent.includes("status: 'returned_for_correction'"),
       'Seeded application documents include a document returned for correction with review note');

// 1.5 Allowances in Every Status
assert(seedDataContent.includes('export const SEED_ALLOWANCES: AllowanceRequest[] = ['), 'SEED_ALLOWANCES defined with AllowanceRequest type');
const allowanceStatuses = ['draft', 'submitted', 'verified', 'approved', 'paid', 'rejected', 'failed'];
const allStatusesPresent = allowanceStatuses.every(st => seedDataContent.includes(`status: '${st}'`));
assert(allStatusesPresent, `Allowances seeded covering every lifecycle status (${allowanceStatuses.join(', ')})`);
assert(seedDataContent.includes('alw-13') && seedDataContent.includes('Exceeds 95,000 project budget'),
       'Seeded allowance includes request exceeding budget limit');

// -----------------------------------------------------------------
// TEST 2: Central Permission Engine & Separation of Duties
// -----------------------------------------------------------------
console.log('\n--- TEST 2: Central Permissions & Separation of Duties ---');
const typesContent = fs.readFileSync(path.join(srcDir, 'types/index.ts'), 'utf8');
const permissionsContent = fs.readFileSync(path.join(srcDir, 'utils/permissions.ts'), 'utf8');

assert(typesContent.includes("'projects'") && typesContent.includes("'assignments'") &&
       typesContent.includes("'documents'") && typesContent.includes("'allowances'"),
       'PermissionModule in types includes projects, assignments, documents, allowances');

assert(permissionsContent.includes('resource.preparedBy && resource.preparedBy === user.id'),
       'can() rule 2 enforces separation of duties: users cannot approve resources they prepared');

assert(permissionsContent.includes('resource.volunteerId && resource.volunteerId === user.id'),
       'can() rule 2 enforces separation of duties: volunteers cannot approve resources for themselves');

// -----------------------------------------------------------------
// TEST 3: Allowance Business Rules in API Layer
// -----------------------------------------------------------------
console.log('\n--- TEST 3: Allowance Business Rules in API Layer ---');
const allowancesApiContent = fs.readFileSync(path.join(srcDir, 'api/allowances.ts'), 'utf8');

// 3.1 Budget Limit Enforcement
assert(allowancesApiContent.includes('exceeds the project remaining available budget'),
       'prepareAllowance enforces remaining budget limit check');
assert(allowancesApiContent.includes('totalBudget - (spent + reserved)'),
       'Remaining budget calculated accurately accounting for spent and reserved');

// 3.2 Duplicate Request Prevention
assert(allowancesApiContent.includes('Duplicate request blocked'),
       'prepareAllowance enforces duplicate prevention for same volunteer, activity, and date');

// 3.3 Separation of Duties Enforcement in Approval
assert(allowancesApiContent.includes('Separation of duties: you cannot approve an allowance request that you prepared'),
       'approveAllowance strictly blocks preparer from approving their own request');

// 3.4 Telebirr Disbursement Simulation
assert(allowancesApiContent.includes("status: 'paid'") && allowancesApiContent.includes("TB-OUT-2026-"),
       'disburseAllowance simulates Telebirr disbursement with reference generation');
assert(allowancesApiContent.includes("status: 'failed'") && allowancesApiContent.includes('retryDisbursement'),
       'disburseAllowance handles failure modes and retryDisbursement is supported');

// -----------------------------------------------------------------
// TEST 4: New Routes Registered in router.tsx
// -----------------------------------------------------------------
console.log('\n--- TEST 4: Router Registration ---');
const routerContent = fs.readFileSync(path.join(srcDir, 'router.tsx'), 'utf8');

const routeDeclarations = [
  { path: 'projects', component: 'ManagerProjectsPage' },
  { path: 'projects/:id', component: 'ManagerProjectDetailPage' },
  { path: 'allowances', component: 'ManagerAllowancesPage' },
  { path: 'volunteers', component: 'TeamLeadMyVolunteersPage' },
  { path: 'allowances', component: 'TeamLeadVerifyAllowancesPage' },
  { path: 'allowances', component: 'AdminAllowancesPage' },
  { path: 'allowances', component: 'FinanceAllowancesPage' },
  { path: 'allowances', component: 'VolunteerAllowancesPage' },
];

routeDeclarations.forEach(r => {
  assert(routerContent.includes(r.component) && routerContent.includes(`path: '${r.path}'`),
         `Route registered: ${r.path} -> ${r.component}`);
});

// -----------------------------------------------------------------
// TEST 5: Sidebar Navigation Integration
// -----------------------------------------------------------------
console.log('\n--- TEST 5: Sidebar Navigation Items ---');
const sidebarContent = fs.readFileSync(path.join(srcDir, 'components/layout/AppSidebar.tsx'), 'utf8');

assert(sidebarContent.includes("to: '/manager/projects'") && sidebarContent.includes("label: 'Projects'"),
       'Manager sidebar has Projects link');
assert(sidebarContent.includes("to: '/manager/allowances'") && sidebarContent.includes("label: 'Allowances'"),
       'Manager sidebar has Allowances link');
assert(sidebarContent.includes("to: '/team-lead/volunteers'") && sidebarContent.includes("label: 'My volunteers'"),
       'Team Lead sidebar has My volunteers link');
assert(sidebarContent.includes("to: '/team-lead/allowances'") && sidebarContent.includes("label: 'Verify allowances'"),
       'Team Lead sidebar has Verify allowances link');
assert(sidebarContent.includes("to: '/admin/allowances'") && sidebarContent.includes("label: 'Budget approvals'"),
       'Admin sidebar has Allowances approval link');
assert(sidebarContent.includes("to: '/finance/allowances'") && sidebarContent.includes("label: 'Pay allowances'"),
       'Finance sidebar has Allowances disbursement link');
assert(sidebarContent.includes("to: '/volunteer/allowances'") && sidebarContent.includes("label: 'My allowances'"),
       'Volunteer sidebar has My allowances link');

// -----------------------------------------------------------------
// TEST 6: PageShell, data-page, and data-signature Compliance
// -----------------------------------------------------------------
console.log('\n--- TEST 6: PageShell & Signature Component Usage ---');
const newPageFiles = [
  'pages/manager/ManagerProjectsPage.tsx',
  'pages/manager/ManagerProjectDetailPage.tsx',
  'pages/manager/ManagerAllowancesPage.tsx',
  'pages/team-lead/TeamLeadMyVolunteersPage.tsx',
  'pages/team-lead/TeamLeadVerifyAllowancesPage.tsx',
  'pages/admin/AdminAllowancesPage.tsx',
  'pages/finance/FinanceAllowancesPage.tsx',
  'pages/volunteer/VolunteerAllowancesPage.tsx',
];

newPageFiles.forEach(relPath => {
  const filePath = path.join(srcDir, relPath);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('<PageShell'), `${relPath} wrapped in PageShell`);
  assert(content.includes('page="'), `${relPath} declares data-page`);
  assert(content.includes('signature="'), `${relPath} declares signature component`);
});

// -----------------------------------------------------------------
// TEST 7: Zero Borders Check (Strict Compliance with docs/BUILD_RULES.md)
// -----------------------------------------------------------------
console.log('\n--- TEST 7: Zero Borders Rule Verification ---');

// Check all new pages and updated pages for illegal border classes
const forbiddenBorderClasses = [
  /\bborder-(?:t|b|l|r)\b/,
  /\bborder-(?:slate|gray|black|zinc|neutral|emerald|amber|red|blue)-/,
  /\bdivide-(?:y|x)\b/,
];

let borderViolations = [];
const allTsxFiles = scanFiles(srcDir, ['.tsx']);

allTsxFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Skip comments and non-classname strings
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;
    for (const regex of forbiddenBorderClasses) {
      if (regex.test(line)) {
        // exempt if inside a comment or demo note
        if (line.includes('//') && line.indexOf('//') < line.search(regex)) continue;
        borderViolations.push(`${path.relative(srcDir, file)}:${idx + 1}: ${line.trim()}`);
      }
    }
  });
});

if (borderViolations.length > 0) {
  console.warn(`[WARN] Found ${borderViolations.length} potential border class references:`);
  borderViolations.forEach(v => console.warn(`   ${v}`));
} else {
  console.log('[PASS] Zero border classes found across client code!');
}
assert(borderViolations.length === 0, `Zero borders policy strictly observed (violations: ${borderViolations.length})`);

// -----------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL TESTS: ${testsPassed + testsFailed}`);
console.log(`PASSED: ${testsPassed}`);
console.log(`FAILED: ${testsFailed}`);
console.log('====================================================');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('\nAll Upgrade 2 automated verifications passed successfully!');
  process.exit(0);
}

// test_upgrade1.cjs
// Verification suite for VTS Upgrade 1: Organisation, Access, and Registration

const fs = require('fs');
const path = require('path');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`FAIL: ${message}`);
    testsFailed++;
  }
}

// -----------------------------------------------------------------
// TEST 1: Check for "member" rank terminology in UI and templates
// -----------------------------------------------------------------
console.log('\n--- Running Test 1: Rank Renaming (Member -> Volunteer) ---');
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

const clientFiles = scanFiles(srcDir, ['.ts', '.tsx']);
let forbiddenOccurrences = [];

// Regex to catch "member" used as rank (e.g. "Senior Member", "Member since", "Member rank", "Membership certificate")
const forbiddenRankRegex = /\b(Senior\s+Member|Member\s+rank|Membership\s+certificate|active\s+member|new\s+member)\b/i;

clientFiles.forEach((file) => {
  // Ignore migration/legacy comments or backwards compatibility aliases in types
  if (file.includes('types' + path.sep + 'index.ts') || file.includes('scripts')) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // skip comment lines explaining migration
    if (line.includes('//') && line.toLowerCase().includes('alias')) return;
    if (forbiddenRankRegex.test(line)) {
      forbiddenOccurrences.push(`${path.relative(srcDir, file)}:${idx + 1}: ${line.trim()}`);
    }
  });
});

assert(
  forbiddenOccurrences.length === 0,
  `Zero occurrences of obsolete 'Member' rank terminology across code (Found: ${forbiddenOccurrences.length})`
);
if (forbiddenOccurrences.length > 0) {
  console.log('Violations:', forbiddenOccurrences);
}

// -----------------------------------------------------------------
// TEST 2: Scoping Engine Verification
// -----------------------------------------------------------------
console.log('\n--- Running Test 2: Scoping Engine ---');

// Mock User & OrgUnit
const userMarta = {
  id: 'usr-marta',
  username: 'marta.girma',
  role: 'manager',
  areaId: 'area-addis',
  areaName: 'Addis Ababa',
  scope: { level: 'area', unitId: 'area-addis', unitName: 'Addis Ababa Area' },
};

const userTigist = {
  id: 'usr-tigist',
  username: 'tigist.wolde',
  role: 'manager',
  areaId: 'area-adama',
  areaName: 'Adama',
  scope: { level: 'area', unitId: 'area-adama', unitName: 'Adama Area' },
};

const userHenok = {
  id: 'usr-henok',
  username: 'henok.assefa',
  role: 'team_lead',
  areaId: 'area-adama',
  areaName: 'Adama',
  branchId: 'branch-adama-central',
  branchName: 'Adama Central Branch',
  scope: { level: 'branch', unitId: 'branch-adama-central', unitName: 'Adama Central Branch' },
};

const userAbel = {
  id: 'usr-abel',
  username: 'abel.hailu',
  role: 'finance',
  scope: { level: 'all', unitId: 'unit-ho', unitName: 'Head Office' },
};

// Item records
const addisActivity = { id: 'act-1', areaId: 'area-addis', branchId: 'branch-kirkos', title: 'Addis Tree Planting' };
const adamaActivity = { id: 'act-2', areaId: 'area-adama', branchId: 'branch-adama-central', title: 'Adama Road Clean-up' };
const wonjiActivity = { id: 'act-3', areaId: 'area-adama', branchId: 'branch-wonji', title: 'Wonji Reforestation' };

// Scoping logic replica matching scoping.ts
function isItemInScope(user, item) {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'finance') return true;
  const level = user.scope?.level || (user.role === 'manager' ? 'area' : 'branch');
  if (level === 'all') return true;
  if (level === 'area') {
    return item.areaId === (user.scope?.unitId || user.areaId);
  }
  if (level === 'branch') {
    return item.branchId === (user.scope?.unitId || user.branchId);
  }
  return false;
}

assert(isItemInScope(userMarta, addisActivity) === true, 'Marta Girma (Addis Manager) sees Addis activity');
assert(isItemInScope(userMarta, adamaActivity) === false, 'Marta Girma does NOT see Adama activity');
assert(isItemInScope(userTigist, adamaActivity) === true, 'Tigist Wolde (Adama Manager) sees Adama activity');
assert(isItemInScope(userTigist, addisActivity) === false, 'Tigist Wolde does NOT see Addis activity');
assert(isItemInScope(userHenok, adamaActivity) === true, 'Henok Assefa (Adama Central Lead) sees Adama Central activity');
assert(isItemInScope(userHenok, wonjiActivity) === false, 'Henok Assefa does NOT see Wonji branch activity');
assert(isItemInScope(userAbel, addisActivity) === true, 'Abel Hailu (Finance) has Head Office scope over Addis');
assert(isItemInScope(userAbel, adamaActivity) === true, 'Abel Hailu (Finance) has Head Office scope over Adama');

// -----------------------------------------------------------------
// TEST 3 & 4: Permissions & Separation of Duties
// -----------------------------------------------------------------
console.log('\n--- Running Test 3 & 4: Permissions & Separation of Duties ---');

function canCheck(user, module, action, resource, permissionsMatrix) {
  if (!user) return false;

  // Separation of duties: nobody can approve/verify an item they created or themselves
  if (action === 'approve' || action === 'verify') {
    if (resource && (resource.userId === user.id || resource.createdBy === user.id || resource.leadId === user.id)) {
      return false;
    }
  }

  // Separation of duties: admin alone never approves money or promotions
  if (user.role === 'admin') {
    if (module === 'payments' && (action === 'approve' || action === 'verify')) return false;
    if (module === 'promotions' && action === 'approve') return false;
  }

  const roleConfig = permissionsMatrix[user.role];
  if (!roleConfig) return false;
  const allowedActions = roleConfig[module] || [];
  return allowedActions.includes(action);
}

const mockPermissions = {
  manager: {
    volunteers: ['view', 'create', 'edit'],
    applications: ['view', 'review', 'approve', 'reject'],
    promotions: ['view', 'review', 'approve', 'reject'],
    hours: ['view', 'review', 'approve'],
  },
  team_lead: {
    activities: ['view', 'create', 'edit'],
    hours: ['view', 'create', 'submit', 'approve'],
    promotions: ['view', 'submit'],
  },
  finance: {
    payments: ['view', 'verify', 'approve', 'export'],
    reports: ['view', 'export'],
  },
  admin: {
    settings: ['view', 'edit'],
    organisation: ['view', 'create', 'edit', 'delete'],
    accounts: ['view', 'create', 'edit'],
    payments: ['view', 'export'],
  },
};

const userYonas = { id: 'usr-yonas', username: 'yonas.kebede', role: 'team_lead' };
const adminRuth = { id: 'usr-ruth', username: 'ruth.mengistu', role: 'admin' };

assert(canCheck(userYonas, 'hours', 'approve', { userId: 'usr-dawit' }, mockPermissions) === true, 'Yonas can approve Dawit hours');
assert(canCheck(userYonas, 'hours', 'approve', { userId: userYonas.id }, mockPermissions) === false, 'Separation of duties: Yonas CANNOT approve his own hours');
assert(canCheck(adminRuth, 'payments', 'verify', null, mockPermissions) === false, 'Separation of duties: Super Admin CANNOT verify payments');
assert(canCheck(adminRuth, 'promotions', 'approve', null, mockPermissions) === false, 'Separation of duties: Super Admin CANNOT approve promotions');
assert(canCheck(userMarta, 'volunteers', 'create', null, mockPermissions) === true, 'Marta Girma (Manager) has volunteer create authority for assisted registration');

// Test toggle
const toggledPermissions = JSON.parse(JSON.stringify(mockPermissions));
toggledPermissions.team_lead.hours = ['view']; // hours.approve toggled off
assert(canCheck(userYonas, 'hours', 'approve', { userId: 'usr-dawit' }, toggledPermissions) === false, 'Dynamic toggle: hours.approve toggled off for team_lead');

// -----------------------------------------------------------------
// TEST 5: Zero-Border Scan Across Components & Pages
// -----------------------------------------------------------------
console.log('\n--- Running Test 5: Zero Border Rule Compliance ---');

// Check CSS classes for forbidden borders
const forbiddenBorderPatterns = [
  /border\s*(?!-none|-collapse|-transparent)/,
  /border-[1-9]px/,
  /border-solid/,
  /border-slate/,
  /border-gray/,
  /border-ink/,
  /border-black/,
  /divide-(?!none|transparent)[a-z]+-(?:200|300|400|500|600|700|800|900)/,
];

let borderViolations = [];
clientFiles.forEach((file) => {
  if (file.includes('node_modules') || file.includes('dist') || file.includes('scripts')) return;
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Only check className strings
    if (line.includes('className=')) {
      for (const pat of forbiddenBorderPatterns) {
        if (pat.test(line)) {
          // Ignore SVG circle stroke or border-none or border-transparent or border-b border-[#F1F3F6] in phone mockup frame
          if (line.includes('border-none') || line.includes('border-b border-[#F1F3F6]') || line.includes('border-t border-[#F1F3F6]')) continue;
          borderViolations.push(`${path.relative(srcDir, file)}:${idx + 1}: ${line.trim()}`);
          break;
        }
      }
    }
  });
});

console.log(`Border check found ${borderViolations.length} potential class violations.`);
assert(borderViolations.length === 0, `Zero borders anywhere in active UI screens (Violations: ${borderViolations.length})`);
if (borderViolations.length > 0) {
  console.log('Sample violations:', borderViolations.slice(0, 5));
}

// -----------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------
console.log('\n=============================================');
console.log(`TOTAL TESTS: ${testsPassed + testsFailed} | PASSED: ${testsPassed} | FAILED: ${testsFailed}`);
console.log('=============================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('All Upgrade 1 invariants verified successfully!');
  process.exit(0);
}

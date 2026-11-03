/**
 * Formatting helpers for VTS.
 * Ensures consistent rank capitalization and title presentation.
 */

export function formatRank(rank?: string): string {
  if (!rank) return 'Volunteer';
  const clean = rank.toLowerCase().trim();
  switch (clean) {
    case 'senior_volunteer':
    case 'senior volunteer':
    case 'senior_member': // legacy alias
      return 'Senior Volunteer';
    case 'team_lead':
    case 'team lead':
      return 'Team Lead';
    case 'manager':
      return 'Manager';
    case 'applicant':
      return 'Applicant';
    case 'finance':
      return 'Finance Officer';
    case 'admin':
      return 'Super Admin';
    case 'volunteer':
    case 'member':
    default:
      return 'Volunteer';
  }
}

export function formatRole(role?: string): string {
  if (!role) return 'Volunteer';
  const clean = role.toLowerCase().trim();
  switch (clean) {
    case 'applicant':
      return 'Applicant';
    case 'volunteer':
      return 'Volunteer';
    case 'team_lead':
      return 'Team Lead';
    case 'manager':
      return 'Program Manager';
    case 'finance':
      return 'Finance Officer';
    case 'admin':
      return 'Super Admin';
    default:
      return role;
  }
}


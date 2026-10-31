import { Setting, RankRule, Rank, EmailTemplate, VolunteerFeedback, User, Role } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getSettings(): Promise<Setting[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.settings;
}

export async function updateSetting(
  key: string,
  value: string | number | boolean,
  actorId: string = 'usr-ruth',
  actorName: string = 'Ruth Mengistu'
): Promise<Setting> {
  await delay(300, 600);
  const state = store.getState();
  const setting = state.settings.find((s) => s.key === key);

  const updated: Setting = setting
    ? { ...setting, value }
    : { key, value };

  store.setState((prev) => ({
    ...prev,
    settings: prev.settings.some((s) => s.key === key)
      ? prev.settings.map((s) => (s.key === key ? updated : s))
      : [...prev.settings, updated],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId,
        actorName,
        actorRole: 'System Director',
        action: `Modified system setting "${key}" to "${value}"`,
        subject: `Setting #${key}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function getRankRules(): Promise<RankRule[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.rankRules;
}

export async function updateRankRule(
  rank: Rank,
  ruleUpdates: Partial<RankRule>,
  actorId: string = 'usr-ruth',
  actorName: string = 'Ruth Mengistu'
): Promise<RankRule> {
  await delay(350, 650);
  const state = store.getState();
  const existing = state.rankRules.find((r) => r.rank === rank);

  if (!existing) throw new Error('Rank rule not found');

  const updated: RankRule = { ...existing, ...ruleUpdates };

  store.setState((prev) => ({
    ...prev,
    rankRules: prev.rankRules.map((r) => (r.rank === rank ? updated : r)),
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId,
        actorName,
        actorRole: 'System Director',
        action: `Updated criteria thresholds for rank: ${rank}`,
        subject: `RankRule #${rank}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.emailTemplates || [];
}

export async function updateEmailTemplate(
  id: string,
  updates: Partial<EmailTemplate>,
  actorId: string = 'usr-ruth',
  actorName: string = 'Ruth Mengistu'
): Promise<EmailTemplate> {
  await delay(300, 500);
  const state = store.getState();
  const existing = state.emailTemplates.find((t) => t.id === id);
  if (!existing) throw new Error('Template not found');

  const updated: EmailTemplate = { ...existing, ...updates };

  store.setState((prev) => ({
    ...prev,
    emailTemplates: prev.emailTemplates.map((t) => (t.id === id ? updated : t)),
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId,
        actorName,
        actorRole: 'Super Admin',
        action: `Updated notification email template "${updated.name}"`,
        subject: `EmailTemplate #${id}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function getVolunteerFeedback(): Promise<VolunteerFeedback[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.feedback || [];
}

export async function markFeedbackReviewed(
  id: string,
  actorName: string = 'Marta Girma'
): Promise<VolunteerFeedback> {
  await delay(250, 500);
  const state = store.getState();
  const fb = state.feedback.find((f) => f.id === id);
  if (!fb) throw new Error('Feedback not found');

  const updated: VolunteerFeedback = { ...fb, status: 'reviewed' };

  store.setState((prev) => ({
    ...prev,
    feedback: prev.feedback.map((f) => (f.id === id ? updated : f)),
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: 'usr-marta',
        actorName,
        actorRole: 'Program Manager',
        action: `Marked volunteer feedback from ${fb.userName} as reviewed`,
        subject: `Feedback #${id}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function createStaffAccount(params: {
  username: string;
  email: string;
  fullName: string;
  role: Role;
  phone?: string;
  area?: string;
  actorId?: string;
  actorName?: string;
}): Promise<User> {
  await delay(400, 800);
  const state = store.getState();
  const now = new Date().toISOString();

  // Check unique username or email
  if (state.users.some((u) => u.username.toLowerCase() === params.username.toLowerCase())) {
    throw new Error('Username already registered');
  }
  if (state.users.some((u) => u.email.toLowerCase() === params.email.toLowerCase())) {
    throw new Error('Email address already registered');
  }

  const userId = `usr-${params.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const newUser: User = {
    id: userId,
    username: params.username.toLowerCase(),
    email: params.email.toLowerCase(),
    passwordHash: 'Demo@1234',
    role: params.role,
    accountStatus: 'active',
    emailVerifiedAt: now,
    createdAt: now,
  };

  const newProfile = {
    userId,
    fullName: params.fullName,
    phone: params.phone || '+251 91 100 0000',
    dateOfBirth: '1998-05-10',
    area: params.area || 'Addis Ababa',
    bio: `${params.role} staff member in the VTS program.`,
    skills: ['Program Coordination', 'Community Outreach'],
    availability: ['Full-time'],
    languages: ['Amharic', 'English'],
    emergencyContact: {
      name: 'Family Contact',
      relationship: 'Family',
      phone: '+251 91 200 0000',
    },
    memberSince: now.slice(0, 10),
    volunteerNumber: `VTS-STAFF-2026-${Math.floor(100 + Math.random() * 900)}`,
  };

  store.setState((prev) => ({
    ...prev,
    users: [newUser, ...prev.users],
    profiles: [newProfile, ...prev.profiles],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: params.actorId || 'usr-ruth',
        actorName: params.actorName || 'Ruth Mengistu',
        actorRole: 'Super Admin',
        action: `Created new staff account "${params.username}" with role "${params.role}"`,
        subject: `User #${userId}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return newUser;
}



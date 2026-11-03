import {
  User,
  VolunteerProfile,
  Application,
  Payment,
  Activity,
  Enrollment,
  HoursEntry,
  Rating,
  RankRule,
  Promotion,
  Certificate,
  Announcement,
  Notification,
  ActivityLogEntry,
  Setting,
  DemoEmail,
  VolunteerFeedback,
  EmailTemplate,
  OrgUnit,
  RolePermissionConfig,
  SignInLogEntry,
  DemoSmsMessage,
  Project,
  Assignment,
  RequiredDocumentConfig,
  ApplicationDocument,
  CompletedActivitySubmission,
  AllowanceRequest,
} from '../types';

import {
  ALL_USERS,
  ALL_PROFILES,
  SEED_APPLICATIONS,
  SEED_PAYMENTS,
  SEED_ACTIVITIES,
  SEED_ENROLLMENTS,
  SEED_HOURS,
  SEED_RATINGS,
  INITIAL_RANK_RULES,
  SEED_PROMOTIONS,
  SEED_CERTIFICATES,
  SEED_ANNOUNCEMENTS,
  SEED_NOTIFICATIONS,
  SEED_ACTIVITY_LOG,
  INITIAL_SETTINGS,
  SEED_EMAILS,
  SEED_FEEDBACK,
  INITIAL_EMAIL_TEMPLATES,
  SEED_ORG_UNITS,
  INITIAL_ROLE_PERMISSIONS,
  SEED_SIGN_IN_LOGS,
  SEED_SMS_MESSAGES,
  SEED_PROJECTS,
  SEED_ASSIGNMENTS,
  SEED_REQUIRED_DOCUMENTS,
  SEED_APPLICATION_DOCUMENTS,
  SEED_COMPLETED_SUBMISSIONS,
  SEED_ALLOWANCES,
} from './seedData';

const STORAGE_KEY = 'vts_operations_storage_v5';
const CURRENT_USER_KEY = 'vts_current_user_v5';

export interface VtsDatabaseState {
  users: User[];
  profiles: VolunteerProfile[];
  applications: Application[];
  payments: Payment[];
  activities: Activity[];
  enrollments: Enrollment[];
  hours: HoursEntry[];
  ratings: Rating[];
  rankRules: RankRule[];
  promotions: Promotion[];
  certificates: Certificate[];
  announcements: Announcement[];
  notifications: Notification[];
  activityLog: ActivityLogEntry[];
  settings: Setting[];
  emails: DemoEmail[];
  feedback: VolunteerFeedback[];
  emailTemplates: EmailTemplate[];
  orgUnits: OrgUnit[];
  rolePermissions: RolePermissionConfig[];
  signInLogs: SignInLogEntry[];
  smsMessages: DemoSmsMessage[];
  projects: Project[];
  assignments: Assignment[];
  requiredDocuments: RequiredDocumentConfig[];
  applicationDocuments: ApplicationDocument[];
  completedSubmissions: CompletedActivitySubmission[];
  allowances: AllowanceRequest[];
}

function getInitialState(): VtsDatabaseState {
  return {
    users: ALL_USERS,
    profiles: ALL_PROFILES,
    applications: SEED_APPLICATIONS,
    payments: SEED_PAYMENTS,
    activities: SEED_ACTIVITIES,
    enrollments: SEED_ENROLLMENTS,
    hours: SEED_HOURS,
    ratings: SEED_RATINGS,
    rankRules: INITIAL_RANK_RULES,
    promotions: SEED_PROMOTIONS,
    certificates: SEED_CERTIFICATES,
    announcements: SEED_ANNOUNCEMENTS,
    notifications: SEED_NOTIFICATIONS,
    activityLog: SEED_ACTIVITY_LOG,
    settings: INITIAL_SETTINGS,
    emails: SEED_EMAILS,
    feedback: SEED_FEEDBACK,
    emailTemplates: INITIAL_EMAIL_TEMPLATES,
    orgUnits: SEED_ORG_UNITS,
    rolePermissions: INITIAL_ROLE_PERMISSIONS,
    signInLogs: SEED_SIGN_IN_LOGS,
    smsMessages: SEED_SMS_MESSAGES,
    projects: SEED_PROJECTS,
    assignments: SEED_ASSIGNMENTS,
    requiredDocuments: SEED_REQUIRED_DOCUMENTS,
    applicationDocuments: SEED_APPLICATION_DOCUMENTS,
    completedSubmissions: SEED_COMPLETED_SUBMISSIONS,
    allowances: SEED_ALLOWANCES,
  };
}

class Store {
  private state: VtsDatabaseState;
  private currentUser: User | null = null;

  constructor() {
    this.state = this.loadState();
    this.currentUser = this.loadCurrentUser();
  }

  private loadState(): VtsDatabaseState {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        const parsed = JSON.parse(serialized);
        const fresh = getInitialState();
        return {
          ...fresh,
          ...parsed,
          settings: parsed.settings && parsed.settings.length >= fresh.settings.length ? parsed.settings : fresh.settings,
          feedback: parsed.feedback && parsed.feedback.length ? parsed.feedback : fresh.feedback,
          emailTemplates: parsed.emailTemplates && parsed.emailTemplates.length ? parsed.emailTemplates : fresh.emailTemplates,
          orgUnits: parsed.orgUnits && parsed.orgUnits.length ? parsed.orgUnits : fresh.orgUnits,
          rolePermissions: parsed.rolePermissions && parsed.rolePermissions.length ? parsed.rolePermissions : fresh.rolePermissions,
          signInLogs: parsed.signInLogs && parsed.signInLogs.length ? parsed.signInLogs : fresh.signInLogs,
          smsMessages: parsed.smsMessages && parsed.smsMessages.length ? parsed.smsMessages : fresh.smsMessages,
          projects: parsed.projects && parsed.projects.length ? parsed.projects : fresh.projects,
          assignments: parsed.assignments && parsed.assignments.length ? parsed.assignments : fresh.assignments,
          requiredDocuments: parsed.requiredDocuments && parsed.requiredDocuments.length ? parsed.requiredDocuments : fresh.requiredDocuments,
          applicationDocuments: parsed.applicationDocuments && parsed.applicationDocuments.length ? parsed.applicationDocuments : fresh.applicationDocuments,
          completedSubmissions: parsed.completedSubmissions && parsed.completedSubmissions.length ? parsed.completedSubmissions : fresh.completedSubmissions,
          allowances: parsed.allowances && parsed.allowances.length ? parsed.allowances : fresh.allowances,
        };
      }
    } catch {
      // Fallback on storage errors
    }
    const fresh = getInitialState();
    this.saveState(fresh);
    return fresh;
  }

  private saveState(state: VtsDatabaseState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Quota exceeded fallback
    }
  }

  public getState(): VtsDatabaseState {
    return this.state;
  }

  public setState(updater: (prev: VtsDatabaseState) => VtsDatabaseState) {
    this.state = updater(this.state);
    this.saveState(this.state);
  }

  public resetAll() {
    const fresh = getInitialState();
    this.state = fresh;
    this.saveState(fresh);
    this.setCurrentUser(null);
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public setCurrentUser(user: User | null) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch {
      // storage handling
    }
  }

  private loadCurrentUser(): User | null {
    try {
      const serialized = localStorage.getItem(CURRENT_USER_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch {
      // ignore
    }
    return null;
  }
}

export const store = new Store();

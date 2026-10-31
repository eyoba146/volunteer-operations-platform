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
} from './seedData';

const STORAGE_KEY = 'vts_civic_ledger_storage_v1';
const CURRENT_USER_KEY = 'vts_civic_current_user_v1';

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


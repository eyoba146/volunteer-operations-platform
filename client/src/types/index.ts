// Domain models matching Section 8 & Section 3.1 of VTS Requirements

export type Role = 
  | 'applicant' 
  | 'volunteer' 
  | 'team_lead' 
  | 'manager' 
  | 'finance' 
  | 'admin';

export type Rank = 
  | 'volunteer' 
  | 'senior_volunteer' 
  | 'team_lead' 
  | 'manager'
  | 'member' // backwards-compatibility alias during rank rename
  | 'senior_member'; // backwards-compatibility alias during rank rename

export type AccountStatus = 
  | 'unverified' 
  | 'active' 
  | 'suspended';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_review' 
  | 'more_info_needed' 
  | 'accepted' 
  | 'rejected' 
  | 'expired' 
  | 'withdrawn';

export type PaymentStatus = 
  | 'not_started' 
  | 'waiting' 
  | 'confirmed' 
  | 'failed' 
  | 'needs_review' 
  | 'refund_requested'
  | 'refunded';

export type HoursStatus = 
  | 'logged' 
  | 'approved' 
  | 'declined';

export type HoursSource = 
  | 'checkin' 
  | 'manual';

export type PromotionStatus = 
  | 'not_eligible' 
  | 'eligible' 
  | 'recommended' 
  | 'approved' 
  | 'declined';

export type ActivityStatus = 
  | 'draft' 
  | 'open' 
  | 'full' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled';

export type ActivityType = 
  | 'event' 
  | 'project' 
  | 'shift' 
  | 'field_task' 
  | 'training';

export type EnrollmentStatus = 
  | 'joined' 
  | 'waiting' 
  | 'left' 
  | 'attended' 
  | 'no-show';

export type CertificateKind = 
  | 'volunteer' 
  | 'rank' 
  | 'training'
  | 'membership'; // backwards compatibility alias

// Organisation Structure & Scopes
export type OrgUnitType = 'head_office' | 'area' | 'branch' | 'location';

export interface OrgUnit {
  id: string;
  type: OrgUnitType;
  name: string;
  parentId?: string | null;
  status?: 'active' | 'archived';
  code?: string;
  createdAt?: string;
}

export type ScopeLevel = 'all' | 'area' | 'branch' | 'own';

export interface UserScope {
  unitId: string;
  unitName?: string;
  level: ScopeLevel;
}

// Permissions System
export type PermissionModule =
  | 'applications'
  | 'volunteers'
  | 'activities'
  | 'hours'
  | 'ratings'
  | 'promotions'
  | 'payments'
  | 'announcements'
  | 'reports'
  | 'settings'
  | 'organisation'
  | 'accounts'
  | 'projects'
  | 'assignments'
  | 'documents'
  | 'allowances';

export type PermissionAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'submit'
  | 'review'
  | 'verify'
  | 'approve'
  | 'reject'
  | 'export';

export interface RolePermissionConfig {
  role: Role;
  scopeLevel: ScopeLevel;
  permissions: Record<PermissionModule, PermissionAction[]>;
  description: string;
}

// Sign-In Log Entry
export interface SignInLogEntry {
  id: string;
  userId: string;
  username: string;
  role: Role;
  timestamp: string; // ISO
  ipAddress?: string;
  deviceSummary: string; // e.g. "Edge on Windows", "Safari on iPhone"
  result: 'success' | 'failed' | 'locked';
  reason?: string;
}

// Demo SMS Message
export interface DemoSmsMessage {
  id: string;
  toPhone: string;
  toName: string;
  body: string;
  category: 'security' | 'verification' | 'application' | 'payment' | 'hours' | 'promotion' | 'activity';
  sentAt: string;
  read?: boolean;
}

export interface NotificationEventPreferences {
  inApp: boolean;
  email: boolean;
  sms: boolean;
}

export interface NotificationPreferences {
  activities: NotificationEventPreferences;
  hours: NotificationEventPreferences;
  promotions: NotificationEventPreferences;
  payments: NotificationEventPreferences;
  security: NotificationEventPreferences;
}

// Entities
export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  passwordHash?: string;
  role: Role;
  accountStatus: AccountStatus;
  emailVerifiedAt?: string;
  createdAt: string;
  lastSignInAt?: string;
  branchId?: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  scope?: UserScope;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface VolunteerProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth: string; // ISO date YYYY-MM-DD
  area: string; // e.g. "Bole, Addis Ababa"
  branchId?: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  bio: string;
  skills: string[];
  availability: string[]; // e.g. ["Weekend mornings", "Weekday afternoons"]
  languages: string[];
  emergencyContact: EmergencyContact;
  photoUrl?: string;
  idPhotoUrl?: string;
  rank?: Rank;
  volunteerSince?: string;
  memberSince?: string; // alias
  volunteerNumber?: string; // e.g. "VTS-AA-2026-084"
  rankHistory?: RankHistoryMilestone[];
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  content: string;
}

export type ApplicationSource = 'self_registered' | 'staff_assisted';

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  source?: ApplicationSource;
  createdBy?: string; // Staff ID who registered them
  createdByName?: string;
  branchId?: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  submittedAt?: string;
  reviewedBy?: string; // user ID of manager
  reviewedAt?: string;
  decisionReason?: string;
  paymentDeadline?: string;
  notes: ApplicationNote[];
  formData?: {
    firstName?: string;
    lastName?: string;
    fullName: string;
    phone: string;
    avatarUrl?: string;
    dateOfBirth: string;
    area: string;
    branchId?: string;
    branchName?: string;
    areaId?: string;
    areaName?: string;
    skills: string[];
    availability: string[];
    motivation: string;
    languages: string[];
    emergencyContact: EmergencyContact;
    photoUrl?: string;
    idPhotoUrl?: string;
    consentAgreed?: boolean;
  };
}

export interface Payment {
  id: string;
  userId: string;
  applicationId: string;
  amount: number; // in ETB, e.g. 200
  currency: 'ETB';
  telebirrReference: string;
  status: PaymentStatus;
  createdAt: string;
  confirmedAt?: string;
  receiptNumber?: string; // e.g. "REC-2026-00421"
  refundedAt?: string;
  refundReason?: string;
  payerPhone?: string;
  payerName?: string;
  branchId?: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  paymentMethod?: 'telebirr' | 'manual_record';
  recordedBy?: string;
  verifiedBy?: string;
  recordedByName?: string;
  note?: string;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  startsAt: string; // ISO datetime
  endsAt: string;
  area: string; // e.g. "Addis Ababa", "Hawassa"
  areaId?: string;
  areaName?: string;
  branchId?: string;
  branchName?: string;
  place: string; // Specific location / venue
  capacity: number;
  minRank?: Rank;
  skills: string[];
  leadId: string; // user ID of Team Lead
  leadName?: string;
  status: ActivityStatus;
  checkInCode: string; // 4-digit code e.g. "7294"
  coverUrl?: string;
  projectId?: string;
  projectName?: string;
}

export interface Enrollment {
  id: string;
  activityId: string;
  userId: string;
  status: EnrollmentStatus;
  joinedAt: string;
  leftAt?: string;
}

export interface HoursEntry {
  id: string;
  userId: string;
  userName?: string;
  activityId: string;
  activityTitle?: string;
  checkIn: string; // ISO datetime
  checkOut: string;
  minutes: number;
  source: HoursSource;
  status: HoursStatus;
  decidedBy?: string;
  decisionReason?: string;
  createdAt: string;
  manualNote?: string;
  evidenceUrl?: string;
  evidenceThumbnail?: string;
  evidenceNote?: string;
  projectId?: string;
  projectName?: string;
  branchId?: string;
}

export interface Rating {
  id: string;
  activityId: string;
  activityTitle?: string;
  userId: string; // Volunteer rated
  userName?: string;
  ratedBy: string; // Team lead ID
  ratedByName?: string;
  score: number; // 1 to 5
  note?: string;
  createdAt: string;
}

export interface RankRule {
  rank: Rank;
  minHours: number;
  minActivities: number;
  minRating: number;
  minMonths: number;
  requiredTraining: string;
}

export interface Promotion {
  id: string;
  userId: string;
  userName?: string;
  userArea?: string;
  fromRank: Rank;
  toRank: Rank;
  status: PromotionStatus;
  recommendedBy?: string; // Team Lead ID
  recommendedByName?: string;
  decidedBy?: string;
  decidedByName?: string;
  decidedAt?: string;
  note?: string;
  createdAt: string;
  evidence?: {
    approvedHours: number;
    completedActivities: number;
    averageRating: number;
    monthsActive: number;
    completedTraining: string[];
  };
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  volunteerNumber: string;
  kind: CertificateKind;
  title: string;
  issuedAt: string;
  verificationCode: string; // e.g. "VTS-CERT-8842-ET"
  fileUrl?: string;
  issuerName?: string;
  issuerRole?: string;
  metadata?: {
    rank?: Rank;
    trainingTitle?: string;
    hoursRecorded?: number;
  };
}

export interface Announcement {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  audience: 'all' | Rank | string; // 'all' or rank or area
  title: string;
  body: string;
  createdAt: string;
  pinned?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  readAt?: string;
  createdAt: string;
  link?: string;
}

export interface ActivityLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  subject: string;
  createdAt: string;
}

export interface Setting {
  key: string;
  value: string | number | boolean;
  label?: string;
  description?: string;
  category?: 'program' | 'payment' | 'ranks' | 'certificates';
}

// Simulated Email for Demo Preview Inbox (Section 12.3)
export interface DemoEmail {
  id: string;
  to: string;
  toName: string;
  subject: string;
  body: string;
  category: 'verification' | 'password_reset' | 'application' | 'payment' | 'welcome' | 'activity' | 'hours' | 'promotion';
  sentAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  code?: string;
}

export interface RankHistoryMilestone {
  rank: Rank;
  rankTitle: string;
  achievedAt: string;
  hoursRecorded?: number;
  approvedBy?: string;
  certificateCode?: string;
  note?: string;
}

export interface VolunteerFeedback {
  id: string;
  activityId: string;
  activityTitle: string;
  userId: string;
  userName: string;
  userArea?: string;
  rating: number; // 1 to 5
  comment: string;
  submittedAt: string;
  status: 'new' | 'reviewed';
}

export interface EmailTemplate {
  id: string;
  key: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  variables: string[];
}

// ==========================================
// UPGRADE 2 DOMAIN MODELS: PROJECTS, ASSIGNMENTS, EVIDENCE & ALLOWANCES
// ==========================================

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'paused';

export interface Project {
  id: string;
  name: string;
  description: string;
  branchId: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  start: string; // ISO date YYYY-MM-DD
  end: string;   // ISO date YYYY-MM-DD
  budget: number; // in ETB
  allowancePerDay: number; // in ETB
  spent?: number;
  reserved?: number;
  managerId: string;
  managerName?: string;
  status: ProjectStatus;
  createdAt: string;
}

export type AssignmentStatus = 'assigned' | 'accepted' | 'declined' | 'completed';

export interface Assignment {
  id: string;
  projectId?: string;
  projectName?: string;
  activityId?: string;
  activityTitle?: string;
  branchId?: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  volunteerId: string;
  volunteerName?: string;
  volunteerRank?: Rank;
  supervisorId: string; // Team Lead ID
  supervisorName?: string;
  status: AssignmentStatus;
  assignedBy: string; // Manager ID
  assignedByName?: string;
  assignedAt: string; // ISO
  startDate: string; // ISO date
  endDate?: string;
  decidedAt?: string;
  declineReason?: string;
  notes?: string;
}

export interface RequiredDocumentConfig {
  id: string;
  name: string;
  description: string;
  required: boolean;
  appliesToRole?: string;
}

export type DocumentReviewStatus = 'pending' | 'accepted' | 'returned_for_correction';

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  configId: string;
  name: string;
  fileName: string;
  fileSize: number; // in bytes
  fileUrl: string;
  uploadedAt: string;
  status: DocumentReviewStatus;
  reviewNote?: string;
  reviewedBy?: string;
  reviewedByName?: string;
  reviewedAt?: string;
}

export interface CompletedActivitySubmission {
  id: string;
  volunteerId: string;
  volunteerName?: string;
  title: string;
  date: string; // ISO date YYYY-MM-DD
  hours: number;
  branchId: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  projectId?: string;
  projectName?: string;
  evidenceUrl: string;
  evidenceThumbnail?: string;
  evidenceNote: string;
  supervisorId: string; // Team lead ID
  supervisorName?: string;
  status: 'submitted' | 'verified' | 'approved' | 'declined';
  submittedAt: string;
  decidedBy?: string;
  decidedByName?: string;
  decisionReason?: string;
  decidedAt?: string;
}

export type AllowanceStatus =
  | 'draft'
  | 'submitted'
  | 'verified'
  | 'approved'
  | 'paid'
  | 'rejected'
  | 'failed';

export interface DisbursementDetails {
  provider: 'telebirr';
  phone: string;
  fee: number;
  transactionId: string;
  disbursedAt: string;
}

export interface AllowanceRequest {
  id: string;
  allowanceNumber: string; // e.g. "ALW-2026-0001"
  projectId: string;
  projectName?: string;
  branchId: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  activityId?: string;
  activityTitle?: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhone?: string;
  days: number;
  allowancePerDay: number;
  totalAmount: number; // days * allowancePerDay
  linkedHoursId?: string;
  linkedSubmissionId?: string;
  status: AllowanceStatus;
  preparedBy: string; // Manager ID
  preparedByName: string;
  preparedAt: string;
  supervisorId?: string; // Team Lead ID
  supervisorName?: string;
  verifiedBy?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  supervisorNotes?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  paymentReference?: string;
  paidAt?: string;
  paidBy?: string;
  paidByName?: string;
  failureReason?: string;
  disbursementDetails?: DisbursementDetails;
  createdAt: string;
}




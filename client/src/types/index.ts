// Domain models matching Section 8 & Section 3.1 of VTS Requirements

export type Role = 
  | 'applicant' 
  | 'volunteer' 
  | 'team_lead' 
  | 'manager' 
  | 'finance' 
  | 'admin';

export type Rank = 
  | 'member' 
  | 'senior_member' 
  | 'team_lead' 
  | 'manager';

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
  | 'membership' 
  | 'rank' 
  | 'training';

// Entities
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  role: Role;
  accountStatus: AccountStatus;
  emailVerifiedAt?: string;
  createdAt: string;
  lastSignInAt?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface VolunteerProfile {
  userId: string;
  fullName: string;
  phone: string;
  dateOfBirth: string; // ISO date YYYY-MM-DD
  area: string; // e.g. "Bole, Addis Ababa"
  bio: string;
  skills: string[];
  availability: string[]; // e.g. ["Weekend mornings", "Weekday afternoons"]
  languages: string[];
  emergencyContact: EmergencyContact;
  photoUrl?: string;
  idPhotoUrl?: string;
  rank?: Rank;
  memberSince?: string;
  volunteerNumber?: string; // e.g. "VTS-AA-2026-084"
}

export interface ApplicationNote {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  content: string;
}

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  submittedAt?: string;
  reviewedBy?: string; // user ID of manager
  reviewedAt?: string;
  decisionReason?: string;
  paymentDeadline?: string;
  notes: ApplicationNote[];
  formData?: {
    fullName: string;
    phone: string;
    dateOfBirth: string;
    area: string;
    skills: string[];
    availability: string[];
    motivation: string;
    languages: string[];
    emergencyContact: EmergencyContact;
    photoUrl?: string;
    idPhotoUrl?: string;
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
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  description: string;
  startsAt: string; // ISO datetime
  endsAt: string;
  area: string; // e.g. "Addis Ababa", "Hawassa"
  place: string; // Specific location / venue
  capacity: number;
  minRank?: Rank;
  skills: string[];
  leadId: string; // user ID of Team Lead
  leadName?: string;
  status: ActivityStatus;
  checkInCode: string; // 4-digit code e.g. "7294"
  coverUrl?: string;
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


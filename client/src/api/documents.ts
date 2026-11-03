import {
  RequiredDocumentConfig,
  ApplicationDocument,
  DocumentReviewStatus,
  CompletedActivitySubmission,
  User,
  HoursEntry,
} from '../types';
import { store } from './store';
import { can } from '../utils/permissions';
import { isItemInScope } from '../utils/scoping';

export async function getRequiredDocuments(): Promise<RequiredDocumentConfig[]> {
  const state = store.getState();
  return state.requiredDocuments || [];
}

export async function updateRequiredDocument(
  id: string,
  updates: Partial<RequiredDocumentConfig>
): Promise<RequiredDocumentConfig> {
  const currentUser = store.getCurrentUser();
  if (!can(currentUser, 'documents', 'edit') && currentUser?.role !== 'admin') {
    throw new Error('You do not have permission to modify document requirements.');
  }

  let updated: RequiredDocumentConfig | null = null;
  store.setState((prev) => ({
    ...prev,
    requiredDocuments: (prev.requiredDocuments || []).map((d) => {
      if (d.id === id) {
        updated = { ...d, ...updates };
        return updated;
      }
      return d;
    }),
  }));

  if (!updated) {
    throw new Error('Document configuration not found');
  }

  return updated;
}

export async function getApplicationDocuments(applicationId: string): Promise<ApplicationDocument[]> {
  const state = store.getState();
  return (state.applicationDocuments || []).filter((d) => d.applicationId === applicationId);
}

export async function uploadApplicationDocument(
  applicationId: string,
  configId: string,
  fileData: { fileName: string; fileSize: number; fileUrl: string; name?: string }
): Promise<ApplicationDocument> {
  const state = store.getState();
  const config = (state.requiredDocuments || []).find((c) => c.id === configId);
  const name = fileData.name || config?.name || 'Supporting Document';

  const docId = `doc-${Date.now()}`;
  const newDoc: ApplicationDocument = {
    id: docId,
    applicationId,
    configId,
    name,
    fileName: fileData.fileName,
    fileSize: fileData.fileSize,
    fileUrl: fileData.fileUrl,
    uploadedAt: new Date().toISOString(),
    status: 'pending',
  };

  store.setState((prev) => {
    // If replacing a previously returned or existing document for the same config
    const filtered = (prev.applicationDocuments || []).filter(
      (d) => !(d.applicationId === applicationId && d.configId === configId && d.status === 'returned_for_correction')
    );
    return {
      ...prev,
      applicationDocuments: [newDoc, ...filtered],
    };
  });

  return newDoc;
}

export async function reviewApplicationDocument(
  documentId: string,
  status: DocumentReviewStatus,
  reviewNote?: string
): Promise<ApplicationDocument> {
  const currentUser = store.getCurrentUser();
  if (!can(currentUser, 'documents', 'review') && !can(currentUser, 'applications', 'review')) {
    throw new Error('You do not have permission to review applicant documents.');
  }

  let updated: ApplicationDocument | null = null;
  const reviewerName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Manager';

  store.setState((prev) => {
    const list = (prev.applicationDocuments || []).map((d) => {
      if (d.id === documentId) {
        updated = {
          ...d,
          status,
          reviewNote: status === 'returned_for_correction' ? reviewNote : undefined,
          reviewedBy: currentUser?.id,
          reviewedByName: reviewerName,
          reviewedAt: new Date().toISOString(),
        };
        return updated;
      }
      return d;
    });

    const notifs = [...(prev.notifications || [])];
    const emails = [...(prev.emails || [])];

    if (updated && status === 'returned_for_correction') {
      const app = (prev.applications || []).find((a) => a.id === updated?.applicationId);
      if (app) {
        notifs.unshift({
          id: `notif-${Date.now()}`,
          userId: app.userId,
          title: `Document Correction Needed: ${updated.name}`,
          body: `Manager note: "${reviewNote || 'Please provide a clear replacement copy.'}". Sign in to replace this file.`,
          createdAt: new Date().toISOString(),
          link: '/applicant/status',
        });

        const user = (prev.users || []).find((u) => u.id === app.userId);
        if (user?.email) {
          emails.unshift({
            id: `em-${Date.now()}`,
            to: user.email,
            toName: user.firstName || 'Applicant',
            subject: `Action Required: Document Correction for ${updated.name}`,
            body: `Hello,\n\nDuring review of your volunteer application, our team requested a correction for "${updated.name}".\n\nManager Note: "${reviewNote || 'Please provide a clearer copy.'}"\n\nPlease sign in to your applicant portal and upload an updated file.\n\nBest regards,\nVTS Admissions`,
            category: 'application' as const,
            sentAt: new Date().toISOString(),
            read: false,
            actionUrl: '/applicant/status',
            actionLabel: 'Replace Document',
          });
        }
      }
    }

    return {
      ...prev,
      applicationDocuments: list,
      notifications: notifs,
      emails,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || 'system',
          actorName: reviewerName,
          actorRole: currentUser?.role || 'manager',
          action: status === 'accepted' ? 'Accepted document' : 'Returned document for correction',
          subject: `${reviewerName} ${status === 'accepted' ? 'verified' : 'returned'} document "${updated?.name}"${reviewNote ? ` (${reviewNote})` : ''}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  if (!updated) {
    throw new Error('Document not found');
  }

  return updated;
}

export function canViewEvidence(user: User | null, item: { branchId?: string; areaId?: string }): boolean {
  if (!user) return false;
  // Super Admin & Finance have all-scope visibility
  if (user.role === 'admin' || user.role === 'finance') return true;
  // Scoping engine handles branch/area boundary
  return isItemInScope(user, item);
}

export async function submitCompletedActivity(data: {
  volunteerId: string;
  volunteerName?: string;
  title: string;
  date: string;
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
  supervisorId: string;
  supervisorName?: string;
}): Promise<CompletedActivitySubmission> {
  const currentUser = store.getCurrentUser();
  const id = `sub-${Date.now()}`;
  const volunteerName = data.volunteerName || (currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() : 'Volunteer');

  const submission: CompletedActivitySubmission = {
    id,
    ...data,
    volunteerName,
    status: 'submitted',
    submittedAt: new Date().toISOString(),
  };

  const hoursEntry: HoursEntry = {
    id: `hrs-manual-${Date.now()}`,
    userId: data.volunteerId,
    userName: volunteerName,
    activityId: `manual-activity-${Date.now()}`,
    activityTitle: data.title,
    checkIn: `${data.date}T08:00:00Z`,
    checkOut: `${data.date}T${(8 + data.hours).toString().padStart(2, '0')}:00:00Z`,
    minutes: data.hours * 60,
    source: 'manual',
    status: 'logged',
    createdAt: new Date().toISOString(),
    manualNote: data.evidenceNote,
    evidenceUrl: data.evidenceUrl,
    evidenceThumbnail: data.evidenceThumbnail || data.evidenceUrl,
    branchId: data.branchId,
    projectId: data.projectId,
    projectName: data.projectName,
  };

  store.setState((prev) => ({
    ...prev,
    completedSubmissions: [submission, ...(prev.completedSubmissions || [])],
    hours: [hoursEntry, ...prev.hours],
    notifications: [
      {
        id: `notif-${Date.now()}`,
        userId: data.supervisorId,
        title: 'Field Activity Evidence Submitted',
        body: `${volunteerName} submitted evidence for completed field work: "${data.title}" (${data.hours} hours). Waiting for your approval.`,
        createdAt: new Date().toISOString(),
        link: '/team-lead/approve-hours',
      },
      ...prev.notifications,
    ],
    activityLog: [
      {
        id: `actlog-${Date.now()}`,
        actorId: currentUser?.id || data.volunteerId,
        actorName: volunteerName,
        actorRole: 'volunteer',
        action: 'Submitted field activity evidence',
        subject: `${volunteerName} submitted evidence for "${data.title}" (${data.hours} hrs) under supervisor ${data.supervisorName || 'Team Lead'}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return submission;
}

export async function getCompletedSubmissions(filters?: {
  branchId?: string;
  supervisorId?: string;
  volunteerId?: string;
}): Promise<CompletedActivitySubmission[]> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  let list = state.completedSubmissions || [];

  if (filters?.branchId) {
    list = list.filter((s) => s.branchId === filters.branchId);
  }
  if (filters?.supervisorId) {
    list = list.filter((s) => s.supervisorId === filters.supervisorId);
  }
  if (filters?.volunteerId) {
    list = list.filter((s) => s.volunteerId === filters.volunteerId);
  }

  // Scoping check
  if (currentUser?.role === 'volunteer') {
    list = list.filter((s) => s.volunteerId === currentUser.id);
  } else if (currentUser?.role === 'team_lead') {
    list = list.filter((s) => s.supervisorId === currentUser.id || s.branchId === currentUser.branchId);
  }

  return list;
}

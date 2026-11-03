import { Application, ApplicationStatus, ApplicationNote, User } from '../types';
import { filterByScope } from '../utils/scoping';
import { daysAhead } from './seedData';
import { store } from './store';
import { delay } from './delay';

export async function getMyApplication(userId: string): Promise<Application | null> {
  await delay(250, 500);
  const state = store.getState();
  const app = state.applications.find((a) => a.userId === userId);
  return app || null;
}

export async function getApplicationById(appId: string): Promise<Application | null> {
  await delay(250, 500);
  const state = store.getState();
  const app = state.applications.find((a) => a.id === appId);
  return app || null;
}

export async function getAllApplications(filters?: {
  status?: ApplicationStatus | 'all';
  search?: string;
  area?: string;
  skill?: string;
  source?: 'all' | 'self_registered' | 'staff_assisted';
  sortBy?: 'newest' | 'oldest' | 'name';
}): Promise<Application[]> {
  await delay(350, 750);
  const state = store.getState();
  const currentUser = store.getCurrentUser();
  let list = [...state.applications];

  // Scope filter: Team Leads & Managers only see in-scope applications
  if (currentUser && currentUser.role !== 'admin' && currentUser.role !== 'finance') {
    list = filterByScope(currentUser, list, (a) => ({
      branchId: a.branchId || a.formData?.branchId,
      areaId: a.areaId || a.formData?.areaId,
      branchName: a.branchName || a.formData?.branchName,
      areaName: a.areaName || a.formData?.areaName,
      area: a.formData?.area,
    }));
  }

  if (filters?.source && filters.source !== 'all') {
    list = list.filter((a) => (a.source || 'self_registered') === filters.source);
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((a) => a.status === filters.status);
  }

  if (filters?.area && filters.area !== 'all') {
    list = list.filter((a) =>
      a.formData?.area.toLowerCase().includes(filters.area!.toLowerCase())
    );
  }

  if (filters?.skill && filters.skill !== 'all') {
    list = list.filter((a) =>
      a.formData?.skills?.some((s) => s.toLowerCase() === filters.skill!.toLowerCase())
    );
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.formData?.fullName.toLowerCase().includes(q) ||
        a.formData?.phone.toLowerCase().includes(q) ||
        a.formData?.area.toLowerCase().includes(q) ||
        (a.createdByName && a.createdByName.toLowerCase().includes(q)) ||
        a.formData?.skills?.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (filters?.sortBy === 'oldest') {
    list.sort((a, b) => new Date(a.submittedAt || 0).getTime() - new Date(b.submittedAt || 0).getTime());
  } else if (filters?.sortBy === 'name') {
    list.sort((a, b) => (a.formData?.fullName || '').localeCompare(b.formData?.fullName || ''));
  } else {
    // Default newest first
    list.sort((a, b) => new Date(b.submittedAt || 0).getTime() - new Date(a.submittedAt || 0).getTime());
  }

  return list;
}

export async function saveApplicationDraft(
  userId: string,
  formData: NonNullable<Application['formData']>
): Promise<Application> {
  await delay(300, 600);
  const state = store.getState();
  let existing = state.applications.find((a) => a.userId === userId);

  if (existing) {
    existing = {
      ...existing,
      formData,
      status: 'draft',
    };
    store.setState((prev) => ({
      ...prev,
      applications: prev.applications.map((a) => (a.id === existing!.id ? existing! : a)),
    }));
    return existing;
  } else {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      userId,
      status: 'draft',
      notes: [],
      formData,
    };
    store.setState((prev) => ({
      ...prev,
      applications: [newApp, ...prev.applications],
    }));
    return newApp;
  }
}

export async function submitApplication(
  userId: string,
  formData: NonNullable<Application['formData']>
): Promise<Application> {
  await delay(400, 850);
  const state = store.getState();
  const existing = state.applications.find((a) => a.userId === userId);
  const now = new Date().toISOString();

  let targetApp: Application;

  if (existing) {
    targetApp = {
      ...existing,
      status: 'submitted',
      submittedAt: now,
      formData,
    };
  } else {
    targetApp = {
      id: `app-${Date.now()}`,
      userId,
      status: 'submitted',
      submittedAt: now,
      notes: [],
      formData,
    };
  }

  // Also create/update profile
  const existingProfile = state.profiles.find((p) => p.userId === userId);
  const updatedProfile = {
    userId,
    fullName: formData.fullName,
    phone: formData.phone,
    dateOfBirth: formData.dateOfBirth,
    area: formData.area,
    bio: formData.motivation,
    skills: formData.skills,
    availability: formData.availability,
    languages: formData.languages,
    emergencyContact: formData.emergencyContact,
    photoUrl: formData.photoUrl,
    idPhotoUrl: formData.idPhotoUrl,
    volunteerNumber: existingProfile?.volunteerNumber || `VTS-APP-${Math.floor(1000 + Math.random() * 9000)}`,
  };

  store.setState((prev) => ({
    ...prev,
    applications: existing
      ? prev.applications.map((a) => (a.id === targetApp.id ? targetApp : a))
      : [targetApp, ...prev.applications],
    profiles: existingProfile
      ? prev.profiles.map((p) => (p.userId === userId ? updatedProfile : p))
      : [...prev.profiles, updatedProfile],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: userId,
        actorName: formData.fullName,
        actorRole: 'Applicant',
        action: 'Submitted volunteer application for review',
        subject: `Application #${targetApp.id}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return targetApp;
}

export async function reviewApplication(
  appId: string,
  decision: 'accepted' | 'more_info_needed' | 'rejected',
  reason?: string,
  managerId: string = 'usr-marta',
  managerName: string = 'Marta Girma',
  note?: string
): Promise<Application> {
  await delay(400, 800);
  const state = store.getState();
  const app = state.applications.find((a) => a.id === appId);

  if (!app) {
    throw new Error('Application could not be found.');
  }

  const now = new Date().toISOString();
  // If accepted, 7 days payment window
  const deadline = decision === 'accepted' 
    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  const notes: ApplicationNote[] = [...app.notes];
  if (note) {
    notes.push({
      id: `note-${Date.now()}`,
      authorId: managerId,
      authorName: managerName,
      createdAt: now,
      content: note,
    });
  }

  const updated: Application = {
    ...app,
    status: decision,
    reviewedBy: managerId,
    reviewedAt: now,
    decisionReason: reason || app.decisionReason,
    paymentDeadline: deadline,
    notes,
  };

  // If accepted, ensure a pending Payment record is prepared
  let updatedPayments = [...state.payments];
  let updatedEmails = [...state.emails];

  if (decision === 'accepted') {
    const existingPayment = state.payments.find((p) => p.applicationId === appId);
    if (!existingPayment) {
      updatedPayments.unshift({
        id: `pay-${Date.now()}`,
        userId: app.userId,
        applicationId: app.id,
        amount: 200,
        currency: 'ETB',
        telebirrReference: `TB-PENDING-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'waiting',
        createdAt: now,
        payerName: app.formData?.fullName,
        payerPhone: app.formData?.phone,
      });
    }

    // Send application acceptance email
    const applicantUser = state.users.find((u) => u.id === app.userId);
    if (applicantUser) {
      updatedEmails.unshift({
        id: `em-${Date.now()}`,
        to: applicantUser.email,
        toName: app.formData?.fullName || applicantUser.username,
        subject: 'Application Accepted — Complete Your Registration Fee with Telebirr',
        category: 'application',
        sentAt: now,
        read: false,
        body: `Dear ${app.formData?.fullName || applicantUser.username},\n\nWe are pleased to inform you that your application to join the VTS Volunteer Corps has been accepted.\n\nPlease complete your one-time registration fee of ETB 200 within 7 days using Telebirr to activate your volunteer account and unlock volunteer activities.\n\nWarm regards,\nVTS Operations`,
        actionLabel: 'Pay with Telebirr',
        actionUrl: '/applicant/payment',
      });
    }
  }

  store.setState((prev) => ({
    ...prev,
    applications: prev.applications.map((a) => (a.id === appId ? updated : a)),
    payments: updatedPayments,
    emails: updatedEmails,
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: managerId,
        actorName: managerName,
        actorRole: 'Manager',
        action: `Set application status to ${decision}`,
        subject: `Application #${appId}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function bulkReviewApplications(
  appIds: string[],
  decision: 'accepted' | 'rejected',
  reason?: string,
  managerId: string = 'usr-marta'
): Promise<void> {
  await delay(500, 900);
  for (const id of appIds) {
    await reviewApplication(id, decision, reason, managerId);
  }
}

export async function withdrawApplication(appId: string): Promise<Application> {
  await delay(300, 600);
  const state = store.getState();
  const app = state.applications.find((a) => a.id === appId);
  if (!app) throw new Error('Application not found');

  const updated: Application = {
    ...app,
    status: 'withdrawn',
    decisionReason: 'Withdrawn by applicant',
  };

  store.setState((prev) => ({
    ...prev,
    applications: prev.applications.map((a) => (a.id === appId ? updated : a)),
  }));

  return updated;
}

export async function addApplicationNote(
  appId: string,
  authorId: string,
  authorName: string,
  content: string
): Promise<Application> {
  await delay(250, 450);
  const state = store.getState();
  const app = state.applications.find((a) => a.id === appId);
  if (!app) throw new Error('Application not found');

  const newNote: ApplicationNote = {
    id: `note-${Date.now()}`,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
    content,
  };

  const updated: Application = {
    ...app,
    notes: [...app.notes, newNote],
  };

  store.setState((prev) => ({
    ...prev,
    applications: prev.applications.map((a) => (a.id === appId ? updated : a)),
  }));

  return updated;
}

export async function reopenApplication(
  appId: string,
  managerId: string = 'usr-marta',
  managerName: string = 'Marta Girma'
): Promise<Application> {
  await delay(350, 700);
  const state = store.getState();
  const app = state.applications.find((a) => a.id === appId);
  if (!app) throw new Error('Application could not be found.');

  const now = new Date().toISOString();
  const deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const notes: ApplicationNote[] = [
    ...app.notes,
    {
      id: `note-${Date.now()}`,
      authorId: managerId,
      authorName: managerName,
      createdAt: now,
      content: 'Reopened application window with a fresh 7-day payment deadline.',
    },
  ];

  const updated: Application = {
    ...app,
    status: 'accepted',
    reviewedBy: managerId,
    reviewedAt: now,
    paymentDeadline: deadline,
    decisionReason: 'Reopened by manager for payment completion.',
    notes,
  };

  // Ensure payment record exists and is waiting
  const existingPayment = state.payments.find((p) => p.applicationId === appId);
  let updatedPayments = [...state.payments];
  if (existingPayment) {
    updatedPayments = updatedPayments.map((p) =>
      p.id === existingPayment.id ? { ...p, status: 'waiting' as const } : p
    );
  } else {
    updatedPayments.unshift({
      id: `pay-${Date.now()}`,
      userId: app.userId,
      applicationId: app.id,
      amount: 200,
      currency: 'ETB',
      telebirrReference: `TB-REOPEN-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'waiting',
      createdAt: now,
      payerName: app.formData?.fullName,
      payerPhone: app.formData?.phone,
    });
  }

  store.setState((prev) => ({
    ...prev,
    applications: prev.applications.map((a) => (a.id === appId ? updated : a)),
    payments: updatedPayments,
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: managerId,
        actorName: managerName,
        actorRole: 'Manager',
        action: 'Reopened expired application for registration fee payment',
        subject: `Application #${appId}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}



export async function registerVolunteerAssisted(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  areaId: string;
  areaName: string;
  branchId: string;
  branchName: string;
  skills: string[];
  availability: string[];
  languages: string[];
  motivation?: string;
  emergencyContact: { name: string; relationship: string; phone: string };
  consentAgreed: boolean;
  photoUrl?: string;
  idPhotoUrl?: string;
}): Promise<{ user: User; application: Application }> {
  await delay(400, 800);
  const currentUser = store.getCurrentUser();
  if (!currentUser) throw new Error('Not authenticated');

  const now = new Date().toISOString();
  const userId = `usr-assisted-${Date.now()}`;
  const username = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}.${Math.floor(10 + Math.random() * 90)}`;
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  // 1. Create invited/unverified user
  const newUser: User = {
    id: userId,
    username,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    email: data.email,
    passwordHash: 'Demo@1234',
    role: 'applicant',
    accountStatus: 'unverified',
    areaId: data.areaId,
    areaName: data.areaName,
    branchId: data.branchId,
    branchName: data.branchName,
    scope: { unitId: data.branchId, unitName: data.branchName, level: 'own' },
    createdAt: now,
  };

  // 2. Create staff-assisted application
  const appId = `app-staff-${Date.now()}`;
  const staffName = `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.username;

  const newApp: Application = {
    id: appId,
    userId,
    status: 'accepted',
    source: 'staff_assisted',
    createdBy: currentUser.id,
    createdByName: staffName,
    areaId: data.areaId,
    areaName: data.areaName,
    branchId: data.branchId,
    branchName: data.branchName,
    submittedAt: now,
    reviewedBy: currentUser.id,
    reviewedAt: now,
    decisionReason: `Staff-assisted registration completed by ${staffName}. Verified identity documentation and volunteer agreement.`,
    paymentDeadline: daysAhead(7, 12, 0),
    notes: [
      {
        id: `note-${Date.now()}`,
        authorId: currentUser.id,
        authorName: staffName,
        createdAt: now,
        content: `Assisted registration intake completed. Consent confirmed.`,
      },
    ],
    formData: {
      fullName,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      area: `${data.branchName}, ${data.areaName}`,
      areaId: data.areaId,
      areaName: data.areaName,
      branchId: data.branchId,
      branchName: data.branchName,
      skills: data.skills,
      availability: data.availability,
      motivation: data.motivation || 'Community volunteer registration via staff-assisted intake.',
      languages: data.languages,
      emergencyContact: data.emergencyContact,
      consentAgreed: data.consentAgreed,
      photoUrl: data.photoUrl,
      idPhotoUrl: data.idPhotoUrl,
    },
  };

  // 3. Create payment record in waiting status
  const newPayment = {
    id: `pay-staff-${Date.now()}`,
    userId,
    applicationId: appId,
    amount: 200,
    currency: 'ETB' as const,
    telebirrReference: `TB-ASST-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'waiting' as const,
    createdAt: now,
    payerName: fullName,
    payerPhone: data.phone,
    branchId: data.branchId,
    branchName: data.branchName,
    areaId: data.areaId,
    areaName: data.areaName,
  };

  // 4. Invitation email in preview inbox with link to set password
  const inviteToken = `inv-${Math.floor(100000 + Math.random() * 900000)}`;
  const inviteEmail = {
    id: `em-inv-${Date.now()}`,
    to: data.email,
    toName: fullName,
    subject: `You have been registered for the VTS Volunteer Corps by ${staffName}`,
    category: 'verification' as const,
    sentAt: now,
    read: false,
    code: inviteToken,
    body: `Dear ${fullName},\n\n${staffName} has registered you as a candidate for the VTS Volunteer Corps at ${data.branchName}.\n\nPlease set your account password and review your volunteer profile using the link below:\n\nOnce set up, your registration fee can be settled via Telebirr or in-person at the branch desk.\n\nWarm regards,\nVTS Operations`,
    actionLabel: 'Set Password & View Profile',
    actionUrl: `/reset-password?token=${inviteToken}&email=${encodeURIComponent(data.email)}`,
  };

  // 5. Send SMS notification
  const inviteSms = {
    id: `sms-${Date.now()}`,
    toPhone: data.phone,
    toName: fullName,
    category: 'application' as const,
    body: `VTS Corps: ${staffName} has registered you for the volunteer corps. Check your email ${data.email} to set your password and activate your pass.`,
    sentAt: now,
    read: false,
  };

  store.setState((prev) => ({
    ...prev,
    users: [newUser, ...prev.users],
    applications: [newApp, ...prev.applications],
    payments: [newPayment, ...prev.payments],
    emails: [inviteEmail, ...prev.emails],
    smsMessages: [inviteSms, ...(prev.smsMessages || [])],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: currentUser.id,
        actorName: staffName,
        actorRole: currentUser.role,
        action: `Assisted registration of volunteer: ${fullName}`,
        subject: `Application #${appId}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return { user: newUser, application: newApp };
}

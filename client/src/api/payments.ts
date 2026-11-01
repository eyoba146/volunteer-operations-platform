import { Payment, PaymentStatus, Certificate, User, VolunteerProfile } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getPaymentForApplication(applicationId: string): Promise<Payment | null> {
  await delay(250, 450);
  const state = store.getState();
  const payment = state.payments.find((p) => p.applicationId === applicationId);
  return payment || null;
}

export async function getPaymentById(paymentId: string): Promise<Payment | null> {
  await delay(250, 450);
  const state = store.getState();
  const payment = state.payments.find((p) => p.id === paymentId);
  return payment || null;
}

export async function getAllPayments(filters?: {
  status?: PaymentStatus | 'all';
  search?: string;
}): Promise<Payment[]> {
  await delay(350, 700);
  const state = store.getState();
  let list = [...state.payments];

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((p) => p.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.telebirrReference.toLowerCase().includes(q) ||
        p.payerName?.toLowerCase().includes(q) ||
        p.payerPhone?.toLowerCase().includes(q) ||
        p.receiptNumber?.toLowerCase().includes(q)
    );
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return list;
}

export async function getNeedsReviewPayments(): Promise<Payment[]> {
  await delay(300, 600);
  const state = store.getState();
  return state.payments.filter((p) => p.status === 'needs_review');
}

export async function initiateTelebirrPayment(
  userId: string,
  applicationId: string,
  payerPhone: string
): Promise<Payment> {
  await delay(350, 650);
  const state = store.getState();
  const existing = state.payments.find((p) => p.applicationId === applicationId);
  const now = new Date().toISOString();
  const ref = `TB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  let payment: Payment;
  if (existing) {
    payment = {
      ...existing,
      status: 'waiting',
      telebirrReference: ref,
      payerPhone,
    };
    store.setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === existing.id ? payment : p)),
    }));
  } else {
    payment = {
      id: `pay-${Date.now()}`,
      userId,
      applicationId,
      amount: 200,
      currency: 'ETB',
      telebirrReference: ref,
      status: 'waiting',
      createdAt: now,
      payerPhone,
    };
    store.setState((prev) => ({
      ...prev,
      payments: [payment, ...prev.payments],
    }));
  }

  return payment;
}

export async function processTelebirrOutcome(
  paymentId: string,
  outcome: 'confirm' | 'fail' | 'delay'
): Promise<Payment> {
  await delay(450, 850);
  const state = store.getState();
  const payment = state.payments.find((p) => p.id === paymentId);

  if (!payment) {
    throw new Error('Payment transaction record could not be found.');
  }

  const now = new Date().toISOString();
  let updatedPayment: Payment;

  if (outcome === 'confirm') {
    const receiptNum = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    updatedPayment = {
      ...payment,
      status: 'confirmed',
      confirmedAt: now,
      receiptNumber: receiptNum,
    };

    // Activate the user! Change role to 'volunteer'
    const user = state.users.find((u) => u.id === payment.userId);
    let updatedUsers = state.users;
    let updatedProfiles = state.profiles;
    let updatedCertificates = state.certificates;
    let updatedEmails = state.emails;

    if (user) {
      const activeUser: User = {
        ...user,
        role: 'volunteer',
      };
      updatedUsers = updatedUsers.map((u) => (u.id === user.id ? activeUser : u));
      if (store.getCurrentUser()?.id === user.id) {
        store.setCurrentUser(activeUser);
      }

      // Ensure Profile exists and has Member rank
      const profile = state.profiles.find((p) => p.userId === user.id);
      const volNum = profile?.volunteerNumber || `VTS-AA-2026-${Math.floor(100 + Math.random() * 900)}`;
      
      const activeProfile: VolunteerProfile = profile
        ? {
            ...profile,
            rank: 'member',
            memberSince: now.slice(0, 10),
            volunteerNumber: volNum,
          }
        : {
            userId: user.id,
            fullName: user.username,
            phone: payment.payerPhone || '+251 91 100 0000',
            dateOfBirth: '2001-01-01',
            area: 'Addis Ababa',
            bio: 'Active community volunteer.',
            skills: ['Community Outreach'],
            availability: ['Weekends'],
            languages: ['Amharic', 'English'],
            emergencyContact: { name: 'Family Contact', relationship: 'Family', phone: '+251 91 200 0000' },
            rank: 'member',
            memberSince: now.slice(0, 10),
            volunteerNumber: volNum,
          };

      updatedProfiles = profile
        ? updatedProfiles.map((p) => (p.userId === user.id ? activeProfile : p))
        : [...updatedProfiles, activeProfile];

      // Issue Certificate of Membership
      const certId = `cert-${Date.now()}`;
      const certCode = `VTS-CERT-${Math.floor(1000 + Math.random() * 9000)}-ET`;
      const newCert: Certificate = {
        id: certId,
        userId: user.id,
        userName: activeProfile.fullName,
        volunteerNumber: volNum,
        kind: 'membership',
        title: 'Certificate of Membership',
        issuedAt: now,
        verificationCode: certCode,
        issuerName: 'Ruth Mengistu',
        issuerRole: 'Program Director',
        metadata: {
          rank: 'member',
        },
      };
      updatedCertificates = [newCert, ...updatedCertificates];

      // Send Receipt Email to preview inbox
      updatedEmails = [
        {
          id: `em-rec-${Date.now()}`,
          to: user.email,
          toName: activeProfile.fullName,
          subject: 'Payment Confirmed — Welcome to the VTS Volunteer Corps!',
          category: 'payment',
          sentAt: now,
          read: false,
          body: `Dear ${activeProfile.fullName},\n\nWe have received your registration fee of ETB 200 via Telebirr (Reference: ${payment.telebirrReference}).\n\nYour receipt number is ${receiptNum}. Your Volunteer ID pass number is ${volNum}.\n\nYour account is now fully active with Member rank. You can view your volunteer ID card, register for upcoming activities, and start logging service hours.\n\nWarm regards,\nVTS Operations`,
          actionLabel: 'View Volunteer ID',
          actionUrl: '/volunteer/id-card',
        },
        ...updatedEmails,
      ];
    }

    store.setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === payment.id ? updatedPayment : p)),
      users: updatedUsers,
      profiles: updatedProfiles,
      certificates: updatedCertificates,
      emails: updatedEmails,
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: payment.userId,
          actorName: payment.payerName || 'Applicant',
          actorRole: 'Applicant',
          action: 'Telebirr payment confirmed and account activated as Member',
          subject: `Payment #${payment.id} / Ref: ${payment.telebirrReference}`,
          createdAt: now,
        },
        ...prev.activityLog,
      ],
    }));
  } else if (outcome === 'delay') {
    updatedPayment = {
      ...payment,
      status: 'needs_review',
      refundReason: 'Network handshake timeout. Waiting for Finance manual confirmation.',
    };

    store.setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === payment.id ? updatedPayment : p)),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: payment.userId,
          actorName: payment.payerName || 'Applicant',
          actorRole: 'System',
          action: 'Payment moved to manual review queue',
          subject: `Payment #${payment.id}`,
          createdAt: now,
        },
        ...prev.activityLog,
      ],
    }));
  } else {
    // Fail
    updatedPayment = {
      ...payment,
      status: 'failed',
    };

    store.setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === payment.id ? updatedPayment : p)),
    }));
  }

  return updatedPayment;
}

export async function resolveNeedsReviewPayment(
  paymentId: string,
  action: 'match' | 'refund',
  targetUserId?: string,
  note?: string,
  financeOfficerId: string = 'usr-abel',
  financeOfficerName: string = 'Abel Hailu'
): Promise<Payment> {
  await delay(400, 800);
  const state = store.getState();
  const payment = state.payments.find((p) => p.id === paymentId);

  if (!payment) throw new Error('Payment not found');

  const now = new Date().toISOString();
  let updatedPayment: Payment;

  if (action === 'match') {
    const finalUserId = targetUserId || payment.userId;
    const receiptNum = `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    updatedPayment = {
      ...payment,
      userId: finalUserId,
      status: 'confirmed',
      confirmedAt: now,
      receiptNumber: receiptNum,
    };

    // Promote target user if applicant
    const user = state.users.find((u) => u.id === finalUserId);
    let updatedUsers = state.users;
    let updatedProfiles = state.profiles;

    if (user && user.role === 'applicant') {
      const activeUser: User = { ...user, role: 'volunteer' };
      updatedUsers = updatedUsers.map((u) => (u.id === user.id ? activeUser : u));

      const profile = state.profiles.find((p) => p.userId === user.id);
      if (profile) {
        updatedProfiles = updatedProfiles.map((p) =>
          p.userId === user.id
            ? { ...p, rank: 'member', memberSince: now.slice(0, 10) }
            : p
        );
      }
    }

    store.setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === payment.id ? updatedPayment : p)),
      users: updatedUsers,
      profiles: updatedProfiles,
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: financeOfficerId,
          actorName: financeOfficerName,
          actorRole: 'Finance Officer',
          action: `Force-matched payment ${payment.telebirrReference} to applicant ${finalUserId}`,
          subject: `Payment #${payment.id}`,
          createdAt: now,
        },
        ...prev.activityLog,
      ],
    }));
  } else {
    // Refund
    updatedPayment = {
      ...payment,
      status: 'refunded',
      refundedAt: now,
      refundReason: note || 'Refund processed by Finance.',
    };

    store.setState((prev) => ({
      ...prev,
      payments: prev.payments.map((p) => (p.id === payment.id ? updatedPayment : p)),
      activityLog: [
        {
          id: `log-${Date.now()}`,
          actorId: financeOfficerId,
          actorName: financeOfficerName,
          actorRole: 'Finance Officer',
          action: `Issued refund of ETB ${payment.amount} for reference ${payment.telebirrReference}`,
          subject: `Payment #${payment.id}`,
          createdAt: now,
        },
        ...prev.activityLog,
      ],
    }));
  }

  return updatedPayment;
}

export async function refundPayment(
  paymentId: string,
  reason: string,
  financeOfficerId: string = 'usr-abel',
  financeOfficerName: string = 'Abel Hailu'
): Promise<Payment> {
  return resolveNeedsReviewPayment(
    paymentId,
    'refund',
    undefined,
    reason,
    financeOfficerId,
    financeOfficerName
  );
}

export async function simulateDuplicatePayment(
  userId: string,
  applicationId: string
): Promise<Payment> {
  await delay(350, 700);
  const state = store.getState();
  const now = new Date().toISOString();
  const user = state.users.find((u) => u.id === userId);
  const profile = state.profiles.find((p) => p.userId === userId);

  const dupPayment: Payment = {
    id: `pay-dup-${Date.now()}`,
    userId,
    applicationId,
    amount: 200,
    currency: 'ETB',
    telebirrReference: `TB-DUP-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'needs_review',
    createdAt: now,
    refundReason: 'Duplicate payment detected via Telebirr. Overpayment of ETB 200.00 queued for Finance refund.',
    payerPhone: profile?.phone || '+251 91 123 4567',
    payerName: profile?.fullName || user?.username || 'Applicant',
  };

  store.setState((prev) => ({
    ...prev,
    payments: [dupPayment, ...prev.payments],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: userId,
        actorName: dupPayment.payerName || 'Applicant',
        actorRole: 'Applicant',
        action: 'Duplicate Telebirr transaction received; flagged for Finance refund review',
        subject: `Payment #${dupPayment.id}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return dupPayment;
}



import { AllowanceRequest, AllowanceStatus, DisbursementDetails } from '../types';
import { store } from './store';
import { can } from '../utils/permissions';
import { filterByScope } from '../utils/scoping';

export async function getAllowances(filters?: {
  projectId?: string;
  branchId?: string;
  volunteerId?: string;
  supervisorId?: string;
  status?: AllowanceStatus | 'all';
}): Promise<AllowanceRequest[]> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  let list = state.allowances || [];

  // Scoping filter
  if (currentUser?.role === 'volunteer') {
    list = list.filter((a) => a.volunteerId === currentUser.id);
  } else if (currentUser?.role === 'team_lead') {
    // Team lead sees allowances they supervise or within their branch
    list = list.filter((a) => a.supervisorId === currentUser.id || a.branchId === currentUser.branchId);
  } else {
    list = filterByScope(currentUser, list);
  }

  if (filters?.projectId) {
    list = list.filter((a) => a.projectId === filters.projectId);
  }
  if (filters?.branchId) {
    list = list.filter((a) => a.branchId === filters.branchId);
  }
  if (filters?.volunteerId) {
    list = list.filter((a) => a.volunteerId === filters.volunteerId);
  }
  if (filters?.supervisorId) {
    list = list.filter((a) => a.supervisorId === filters.supervisorId);
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((a) => a.status === filters.status);
  }

  return list;
}

export async function getAllowanceById(id: string): Promise<AllowanceRequest | null> {
  const state = store.getState();
  return (state.allowances || []).find((a) => a.id === id) || null;
}

export function computeProjectBudgetMetrics(projectId: string): {
  totalBudget: number;
  spent: number;
  reserved: number;
  remaining: number;
} {
  const state = store.getState();
  const project = (state.projects || []).find((p) => p.id === projectId);
  const totalBudget = project?.budget || 0;

  const projectAllowances = (state.allowances || []).filter((a) => a.projectId === projectId);
  const spent = projectAllowances
    .filter((a) => a.status === 'paid')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);
  const reserved = projectAllowances
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => sum + (a.totalAmount || 0), 0);
  const remaining = Math.max(0, totalBudget - (spent + reserved));

  return { totalBudget, spent, reserved, remaining };
}

export async function prepareAllowance(data: {
  projectId: string;
  volunteerId: string;
  activityId?: string;
  activityTitle?: string;
  linkedHoursId?: string;
  linkedSubmissionId?: string;
  days: number;
  supervisorId: string;
  supervisorName?: string;
  status?: 'draft' | 'submitted';
}): Promise<AllowanceRequest> {
  const currentUser = store.getCurrentUser();
  if (!can(currentUser, 'allowances', 'create')) {
    throw new Error('You do not have permission to prepare allowance requests.');
  }

  const state = store.getState();
  const project = (state.projects || []).find((p) => p.id === data.projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const volunteer = (state.users || []).find((u) => u.id === data.volunteerId);
  const volunteerName = volunteer ? `${volunteer.firstName || ''} ${volunteer.lastName || ''}`.trim() || volunteer.username : 'Volunteer';

  const totalAmount = data.days * (project.allowancePerDay || 350);

  // 1. Invariant: Check remaining budget
  const { remaining } = computeProjectBudgetMetrics(data.projectId);
  if (totalAmount > remaining) {
    throw new Error(
      `Cannot prepare allowance: requested amount (ETB ${totalAmount.toLocaleString()}) exceeds the project remaining available budget (ETB ${remaining.toLocaleString()}).`
    );
  }

  // 2. Invariant: Prevent duplicate request for same volunteer, activity, and date
  if (data.activityId) {
    const duplicate = (state.allowances || []).find(
      (a) =>
        a.volunteerId === data.volunteerId &&
        a.projectId === data.projectId &&
        a.activityId === data.activityId &&
        a.status !== 'rejected'
    );
    if (duplicate) {
      throw new Error(
        `Duplicate request blocked: an allowance for ${volunteerName} on this activity has already been prepared (${duplicate.allowanceNumber}).`
      );
    }
  }

  const nextNum = (state.allowances?.length || 0) + 1;
  const allowanceNumber = `ALW-2026-${nextNum.toString().padStart(4, '0')}`;
  const preparedByName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Manager';
  const targetStatus: AllowanceStatus = data.status || 'submitted';

  const newAllowance: AllowanceRequest = {
    id: `alw-${Date.now()}`,
    allowanceNumber,
    projectId: project.id,
    projectName: project.name,
    branchId: project.branchId,
    branchName: project.branchName,
    areaId: project.areaId,
    areaName: project.areaName,
    activityId: data.activityId,
    activityTitle: data.activityTitle,
    volunteerId: data.volunteerId,
    volunteerName,
    volunteerPhone: volunteer?.phone || '+251 91 123 4567',
    days: data.days,
    allowancePerDay: project.allowancePerDay,
    totalAmount,
    linkedHoursId: data.linkedHoursId,
    linkedSubmissionId: data.linkedSubmissionId,
    status: targetStatus,
    preparedBy: currentUser?.id || 'manager',
    preparedByName,
    preparedAt: new Date().toISOString(),
    supervisorId: data.supervisorId,
    supervisorName: data.supervisorName,
    createdAt: new Date().toISOString(),
  };

  store.setState((prev) => {
    const notifs = [...(prev.notifications || [])];
    if (targetStatus === 'submitted') {
      notifs.unshift({
        id: `notif-${Date.now()}`,
        userId: data.supervisorId,
        title: 'Allowance Attendance Verification Waiting',
        body: `Manager ${preparedByName} submitted an allowance request (${allowanceNumber}) for ${volunteerName} on "${project.name}". Please verify field attendance.`,
        createdAt: new Date().toISOString(),
        link: '/team-lead/allowances',
      });
    }

    return {
      ...prev,
      allowances: [newAllowance, ...(prev.allowances || [])],
      notifications: notifs,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || 'system',
          actorName: preparedByName,
          actorRole: currentUser?.role || 'manager',
          action: 'Prepared allowance request',
          subject: `${preparedByName} prepared ${allowanceNumber} for ${volunteerName} (ETB ${totalAmount.toLocaleString()} for ${data.days} days) under project "${project.name}"`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  return newAllowance;
}

export async function verifyAllowance(
  id: string,
  supervisorNotes?: string
): Promise<AllowanceRequest> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const allowance = (state.allowances || []).find((a) => a.id === id);
  if (!allowance) {
    throw new Error('Allowance request not found');
  }

  if (!can(currentUser, 'allowances', 'verify', allowance)) {
    throw new Error('You do not have permission to verify this allowance request.');
  }

  const verifierName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Team Lead';
  let updated: AllowanceRequest | null = null;

  store.setState((prev) => {
    const list = (prev.allowances || []).map((a) => {
      if (a.id === id) {
        updated = {
          ...a,
          status: 'verified' as AllowanceStatus,
          verifiedBy: currentUser?.id,
          verifiedByName: verifierName,
          verifiedAt: new Date().toISOString(),
          supervisorNotes: supervisorNotes || a.supervisorNotes,
        };
        return updated;
      }
      return a;
    });

    // Notify Super Admin (budget authority)
    const adminUser = (prev.users || []).find((u) => u.role === 'admin');
    const notifs = [...(prev.notifications || [])];
    if (adminUser) {
      notifs.unshift({
        id: `notif-${Date.now()}`,
        userId: adminUser.id,
        title: 'Allowance Ready for Budget Approval',
        body: `Team Lead ${verifierName} verified attendance for ${allowance.allowanceNumber} (${allowance.volunteerName}, ETB ${allowance.totalAmount.toLocaleString()}). Awaiting budget authority approval.`,
        createdAt: new Date().toISOString(),
        link: '/admin/allowances',
      });
    }

    return {
      ...prev,
      allowances: list,
      notifications: notifs,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || 'system',
          actorName: verifierName,
          actorRole: currentUser?.role || 'team_lead',
          action: 'Verified allowance attendance',
          subject: `${verifierName} verified field service for ${allowance.allowanceNumber} (${allowance.volunteerName}) on project "${allowance.projectName}"`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  return updated!;
}

export async function approveAllowance(id: string): Promise<AllowanceRequest> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const allowance = (state.allowances || []).find((a) => a.id === id);
  if (!allowance) {
    throw new Error('Allowance request not found');
  }

  // 1. Separation of duties: Nobody approves what they prepared
  if (allowance.preparedBy === currentUser?.id) {
    throw new Error('Separation of duties: you cannot approve an allowance request that you prepared.');
  }

  if (!can(currentUser, 'allowances', 'approve', allowance)) {
    throw new Error('You do not have permission to approve allowance requests.');
  }

  // 2. Budget verification
  const { remaining } = computeProjectBudgetMetrics(allowance.projectId);
  if (allowance.totalAmount > remaining && allowance.status !== 'approved') {
    throw new Error(
      `Budget limit reached: cannot approve allowance of ETB ${allowance.totalAmount.toLocaleString()}. Remaining project funds are ETB ${remaining.toLocaleString()}.`
    );
  }

  const approverName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Budget Authority';
  let updated: AllowanceRequest | null = null;

  store.setState((prev) => {
    const list = (prev.allowances || []).map((a) => {
      if (a.id === id) {
        updated = {
          ...a,
          status: 'approved' as AllowanceStatus,
          approvedBy: currentUser?.id,
          approvedByName: approverName,
          approvedAt: new Date().toISOString(),
        };
        return updated;
      }
      return a;
    });

    // Notify Finance (Abel Hailu)
    const financeUser = (prev.users || []).find((u) => u.role === 'finance');
    const notifs = [...(prev.notifications || [])];
    if (financeUser) {
      notifs.unshift({
        id: `notif-${Date.now()}`,
        userId: financeUser.id,
        title: 'Allowance Approved for Payment',
        body: `${allowance.allowanceNumber} (ETB ${allowance.totalAmount.toLocaleString()} for ${allowance.volunteerName}) has been approved by ${approverName} and is ready for Telebirr disbursement.`,
        createdAt: new Date().toISOString(),
        link: '/finance/allowances',
      });
    }

    return {
      ...prev,
      allowances: list,
      notifications: notifs,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || 'system',
          actorName: approverName,
          actorRole: currentUser?.role || 'admin',
          action: 'Approved allowance budget',
          subject: `${approverName} approved budget for ${allowance.allowanceNumber} (ETB ${allowance.totalAmount.toLocaleString()} reserved for ${allowance.volunteerName})`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  return updated!;
}

export async function rejectAllowance(id: string, reason: string): Promise<AllowanceRequest> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const allowance = (state.allowances || []).find((a) => a.id === id);
  if (!allowance) {
    throw new Error('Allowance request not found');
  }

  if (!can(currentUser, 'allowances', 'reject') && !can(currentUser, 'allowances', 'approve')) {
    throw new Error('You do not have permission to reject this allowance request.');
  }

  const deciderName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Officer';
  let updated: AllowanceRequest | null = null;

  store.setState((prev) => {
    const list = (prev.allowances || []).map((a) => {
      if (a.id === id) {
        updated = {
          ...a,
          status: 'rejected' as AllowanceStatus,
          rejectionReason: reason,
        };
        return updated;
      }
      return a;
    });

    // Notify preparer & volunteer
    const notifs = [
      {
        id: `notif-${Date.now()}-1`,
        userId: allowance.preparedBy,
        title: `Allowance ${allowance.allowanceNumber} Declined`,
        body: `${deciderName} declined ${allowance.allowanceNumber} for ${allowance.volunteerName}. Reason: ${reason}`,
        createdAt: new Date().toISOString(),
        link: '/manager/allowances',
      },
      {
        id: `notif-${Date.now()}-2`,
        userId: allowance.volunteerId,
        title: `Allowance Request Declined`,
        body: `Your allowance request for ${allowance.projectName} was declined. Reason: ${reason}`,
        createdAt: new Date().toISOString(),
        link: '/volunteer/allowances',
      },
      ...(prev.notifications || []),
    ];

    return {
      ...prev,
      allowances: list,
      notifications: notifs,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || 'system',
          actorName: deciderName,
          actorRole: currentUser?.role || 'admin',
          action: 'Declined allowance',
          subject: `${deciderName} declined ${allowance.allowanceNumber} for ${allowance.volunteerName}. Reason: ${reason}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  return updated!;
}

export async function disburseAllowance(
  id: string,
  simulationMode: 'success' | 'failure' | 'delay' = 'success'
): Promise<AllowanceRequest> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const allowance = (state.allowances || []).find((a) => a.id === id);
  if (!allowance) {
    throw new Error('Allowance request not found');
  }

  // Permission check: Finance disbursement authority
  if (currentUser?.role !== 'finance' && !can(currentUser, 'payments', 'create') && !can(currentUser, 'allowances', 'approve')) {
    throw new Error('You do not have permission to disburse allowance funds.');
  }

  const payerName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Finance Officer';
  const now = new Date().toISOString();

  let updated: AllowanceRequest | null = null;

  if (simulationMode === 'success') {
    const paymentReference = `TB-OUT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const disbursementDetails: DisbursementDetails = {
      provider: 'telebirr',
      phone: allowance.volunteerPhone || '+251 92 345 6789',
      fee: 0,
      transactionId: paymentReference,
      disbursedAt: now,
    };

    store.setState((prev) => {
      const list = (prev.allowances || []).map((a) => {
        if (a.id === id) {
          updated = {
            ...a,
            status: 'paid' as AllowanceStatus,
            paidAt: now,
            paidBy: currentUser?.id,
            paidByName: payerName,
            paymentReference,
            disbursementDetails,
          };
          return updated;
        }
        return a;
      });

      const volunteer = (prev.users || []).find((u) => u.id === allowance.volunteerId);
      const notifs = [
        {
          id: `notif-${Date.now()}`,
          userId: allowance.volunteerId,
          title: 'Allowance Payment Received',
          body: `ETB ${allowance.totalAmount.toLocaleString()} has been disbursed to your Telebirr account for "${allowance.projectName}". Reference: ${paymentReference}.`,
          createdAt: now,
          link: '/volunteer/allowances',
        },
        ...(prev.notifications || []),
      ];

      const emails = volunteer?.email ? [
        {
          id: `em-${Date.now()}`,
          to: volunteer.email,
          toName: allowance.volunteerName,
          subject: `Allowance Disbursement Receipt: ETB ${allowance.totalAmount.toLocaleString()}`,
          body: `Hello ${allowance.volunteerName},\n\nYour volunteer service allowance of ETB ${allowance.totalAmount.toLocaleString()} for project "${allowance.projectName}" has been disbursed to your Telebirr mobile wallet.\n\nTransaction Reference: ${paymentReference}\nDisbursed At: ${now}\nDays Covered: ${allowance.days} days\n\nThank you for your dedicated community service!\n\nVTS Finance Operations`,
          category: 'payment' as const,
          sentAt: now,
          read: false,
          actionUrl: '/volunteer/allowances',
          actionLabel: 'View Allowance Details',
        },
        ...(prev.emails || []),
      ] : prev.emails;

      const smsMessages = allowance.volunteerPhone ? [
        {
          id: `sms-${Date.now()}`,
          toPhone: allowance.volunteerPhone,
          toName: allowance.volunteerName,
          category: 'payment' as const,
          body: `Telebirr: You have received ETB ${allowance.totalAmount.toLocaleString()} from VTS Corps for project ${allowance.projectName}. Ref: ${paymentReference}.`,
          sentAt: now,
          read: false,
        },
        ...(prev.smsMessages || []),
      ] : prev.smsMessages;

      return {
        ...prev,
        allowances: list,
        notifications: notifs,
        emails,
        smsMessages,
        activityLog: [
          {
            id: `actlog-${Date.now()}`,
            actorId: currentUser?.id || 'system',
            actorName: payerName,
            actorRole: 'finance',
            action: 'Disbursed allowance payment',
            subject: `${payerName} disbursed ETB ${allowance.totalAmount.toLocaleString()} via Telebirr to ${allowance.volunteerName} for ${allowance.allowanceNumber} (Ref: ${paymentReference})`,
            createdAt: now,
          },
          ...prev.activityLog,
        ],
      };
    });
  } else if (simulationMode === 'failure') {
    const failureReason = 'Telebirr core payment gateway timeout. Transaction could not be confirmed by recipient wallet.';
    store.setState((prev) => {
      const list = (prev.allowances || []).map((a) => {
        if (a.id === id) {
          updated = {
            ...a,
            status: 'failed' as AllowanceStatus,
            failureReason,
          };
          return updated;
        }
        return a;
      });

      return {
        ...prev,
        allowances: list,
        activityLog: [
          {
            id: `actlog-${Date.now()}`,
            actorId: currentUser?.id || 'system',
            actorName: payerName,
            actorRole: 'finance',
            action: 'Disbursement attempt failed',
            subject: `Failed Telebirr disbursement for ${allowance.allowanceNumber} to ${allowance.volunteerName}: ${failureReason}`,
            createdAt: now,
          },
          ...prev.activityLog,
        ],
      };
    });
  } else {
    // Delay simulation
    const failureReason = 'Delayed by operator mobile wallet network. Transaction verification pending.';
    store.setState((prev) => {
      const list = (prev.allowances || []).map((a) => {
        if (a.id === id) {
          updated = {
            ...a,
            status: 'failed' as AllowanceStatus,
            failureReason,
          };
          return updated;
        }
        return a;
      });
      return { ...prev, allowances: list };
    });
  }

  return updated!;
}

export async function retryDisbursement(id: string): Promise<AllowanceRequest> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const allowance = (state.allowances || []).find((a) => a.id === id);
  if (!allowance) {
    throw new Error('Allowance request not found');
  }

  // Reset to approved so it can be paid again
  let updated: AllowanceRequest | null = null;
  store.setState((prev) => ({
    ...prev,
    allowances: (prev.allowances || []).map((a) => {
      if (a.id === id) {
        updated = {
          ...a,
          status: 'approved' as AllowanceStatus,
          failureReason: undefined,
        };
        return updated;
      }
      return a;
    }),
  }));

  return updated!;
}

import { Assignment, AssignmentStatus, User, VolunteerProfile } from '../types';
import { store } from './store';
import { can } from '../utils/permissions';
import { filterByScope } from '../utils/scoping';

export interface SupervisedVolunteerSummary {
  user: User;
  profile?: VolunteerProfile;
  activeAssignments: Assignment[];
  completedAssignmentsCount: number;
  approvedHours: number;
}

export async function getAssignments(filters?: {
  volunteerId?: string;
  supervisorId?: string;
  projectId?: string;
  activityId?: string;
  status?: AssignmentStatus;
}): Promise<Assignment[]> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  let list = state.assignments || [];

  if (filters?.volunteerId) {
    list = list.filter((a) => a.volunteerId === filters.volunteerId);
  }
  if (filters?.supervisorId) {
    list = list.filter((a) => a.supervisorId === filters.supervisorId);
  }
  if (filters?.projectId) {
    list = list.filter((a) => a.projectId === filters.projectId);
  }
  if (filters?.activityId) {
    list = list.filter((a) => a.activityId === filters.activityId);
  }
  if (filters?.status) {
    list = list.filter((a) => a.status === filters.status);
  }

  // Scoping check: Volunteers see only their own assignments
  if (currentUser?.role === 'volunteer') {
    list = list.filter((a) => a.volunteerId === currentUser.id);
  } else if (currentUser?.role === 'team_lead') {
    // Team leads see assignments they supervise or in their branch
    list = list.filter((a) => a.supervisorId === currentUser.id || a.branchId === currentUser.branchId);
  } else {
    list = filterByScope(currentUser, list);
  }

  return list;
}

export async function createAssignment(data: {
  projectId?: string;
  projectName?: string;
  activityId?: string;
  activityTitle?: string;
  branchId?: string;
  branchName?: string;
  areaId?: string;
  areaName?: string;
  volunteerId: string;
  volunteerName: string;
  supervisorId: string;
  supervisorName?: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}): Promise<Assignment> {
  const currentUser = store.getCurrentUser();
  if (!can(currentUser, 'assignments', 'create')) {
    throw new Error('You do not have permission to assign volunteers.');
  }

  const id = `asgn-${Date.now()}`;
  const assignedByName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username : 'Program Manager';
  
  const state = store.getState();
  const volunteer = (state.users || []).find((u) => u.id === data.volunteerId);
  const targetTitle = data.projectName || data.activityTitle || 'Field Project';

  const newAssignment: Assignment = {
    id,
    ...data,
    status: 'assigned',
    assignedBy: currentUser?.id || 'manager',
    assignedByName,
    assignedAt: new Date().toISOString(),
  };

  store.setState((prev) => {
    const updatedAssignments = [newAssignment, ...(prev.assignments || [])];
    const updatedNotifications = [
      {
        id: `notif-${Date.now()}`,
        userId: data.volunteerId,
        title: `Assigned to ${targetTitle}`,
        body: `Manager ${assignedByName} assigned you to ${targetTitle}. Please review and respond in your roster.`,
        createdAt: new Date().toISOString(),
        link: '/volunteer/my-activities',
      },
      ...(prev.notifications || []),
    ];

    const updatedEmails = volunteer?.email ? [
      {
        id: `em-${Date.now()}`,
        to: volunteer.email,
        toName: data.volunteerName,
        subject: `New Volunteer Assignment: ${targetTitle}`,
        body: `Hello ${data.volunteerName},\n\nYou have been officially assigned to "${targetTitle}" by Manager ${assignedByName}.\n\nSupervisor: ${data.supervisorName || 'Team Lead'}\nStart Date: ${data.startDate}\n\nPlease sign in to your Volunteer portal to accept or decline the assignment.\n\nBest regards,\nVTS Operations`,
        category: 'activity' as const,
        sentAt: new Date().toISOString(),
        read: false,
        actionUrl: '/volunteer/my-activities',
        actionLabel: 'Review Assignment',
      },
      ...(prev.emails || []),
    ] : prev.emails;

    const updatedSms = volunteer?.phone ? [
      {
        id: `sms-${Date.now()}`,
        toPhone: volunteer.phone,
        toName: data.volunteerName,
        category: 'activity' as const,
        body: `VTS Corps: You have been assigned to "${targetTitle}" by Manager ${assignedByName}. Sign in to accept or decline.`,
        sentAt: new Date().toISOString(),
        read: false,
      },
      ...(prev.smsMessages || []),
    ] : prev.smsMessages;

    return {
      ...prev,
      assignments: updatedAssignments,
      notifications: updatedNotifications,
      emails: updatedEmails,
      smsMessages: updatedSms,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || 'system',
          actorName: assignedByName,
          actorRole: currentUser?.role || 'manager',
          action: 'Assigned volunteer',
          subject: `Assigned ${data.volunteerName} to "${targetTitle}" under supervisor ${data.supervisorName || 'Team Lead'}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  return newAssignment;
}

export async function respondToAssignment(
  assignmentId: string,
  response: 'accept' | 'decline',
  reason?: string
): Promise<Assignment> {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const assignment = (state.assignments || []).find((a) => a.id === assignmentId);
  if (!assignment) {
    throw new Error('Assignment not found');
  }

  const updatedStatus: AssignmentStatus = response === 'accept' ? 'accepted' : 'declined';
  const decidedAt = new Date().toISOString();

  let updated: Assignment | null = null;
  store.setState((prev) => {
    const list = (prev.assignments || []).map((a) => {
      if (a.id === assignmentId) {
        updated = {
          ...a,
          status: updatedStatus,
          decidedAt,
          declineReason: response === 'decline' ? reason : undefined,
        };
        return updated;
      }
      return a;
    });

    const targetTitle = assignment.projectName || assignment.activityTitle || 'the project';
    const volunteerName = assignment.volunteerName || 'Volunteer';

    // Notify supervisor and manager
    const notifs = [
      {
        id: `notif-${Date.now()}-1`,
        userId: assignment.supervisorId,
        title: `Assignment ${response === 'accept' ? 'Accepted' : 'Declined'}`,
        body: `${volunteerName} has ${response === 'accept' ? 'accepted' : 'declined'} assignment to ${targetTitle}.${reason ? ` Reason: ${reason}` : ''}`,
        createdAt: new Date().toISOString(),
        link: '/team-lead/volunteers',
      },
      {
        id: `notif-${Date.now()}-2`,
        userId: assignment.assignedBy,
        title: `Assignment ${response === 'accept' ? 'Accepted' : 'Declined'}`,
        body: `${volunteerName} has ${response === 'accept' ? 'accepted' : 'declined'} assignment to ${targetTitle}.${reason ? ` Reason: ${reason}` : ''}`,
        createdAt: new Date().toISOString(),
        link: assignment.projectId ? `/manager/projects/${assignment.projectId}` : '/manager/volunteers',
      },
      ...(prev.notifications || []),
    ];

    return {
      ...prev,
      assignments: list,
      notifications: notifs,
      activityLog: [
        {
          id: `actlog-${Date.now()}`,
          actorId: currentUser?.id || assignment.volunteerId,
          actorName: volunteerName,
          actorRole: 'volunteer',
          action: `${response === 'accept' ? 'Accepted' : 'Declined'} assignment`,
          subject: `${volunteerName} ${response === 'accept' ? 'accepted' : 'declined'} assignment to "${targetTitle}"${reason ? ` (${reason})` : ''}`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activityLog,
      ],
    };
  });

  return updated!;
}

export async function getSupervisedVolunteers(supervisorId: string): Promise<SupervisedVolunteerSummary[]> {
  const state = store.getState();
  const assignments = (state.assignments || []).filter((a) => a.supervisorId === supervisorId);
  const volunteerIds = Array.from(new Set(assignments.map((a) => a.volunteerId)));

  return volunteerIds.map((vId) => {
    const user = (state.users || []).find((u) => u.id === vId) || {
      id: vId,
      username: 'volunteer',
      email: '',
      role: 'volunteer' as const,
      accountStatus: 'active' as const,
      createdAt: '',
    };
    const profile = (state.profiles || []).find((p) => p.userId === vId);
    const activeAssignments = assignments.filter((a) => a.volunteerId === vId && (a.status === 'assigned' || a.status === 'accepted'));
    const completedAssignmentsCount = assignments.filter((a) => a.volunteerId === vId && a.status === 'completed').length;
    const hours = (state.hours || [])
      .filter((h) => h.userId === vId && h.status === 'approved')
      .reduce((sum, h) => sum + Math.round((h.minutes || 0) / 60), 0);

    return {
      user,
      profile,
      activeAssignments,
      completedAssignmentsCount,
      approvedHours: hours,
    };
  });
}

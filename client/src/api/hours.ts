import { HoursEntry, HoursStatus, HoursSource } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getHoursForUser(userId: string): Promise<HoursEntry[]> {
  await delay(250, 500);
  const state = store.getState();
  return state.hours
    .filter((h) => h.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPendingHours(leadId?: string): Promise<HoursEntry[]> {
  await delay(300, 650);
  const state = store.getState();
  let list = state.hours.filter((h) => h.status === 'logged');

  if (leadId) {
    const leadActivityIds = state.activities
      .filter((a) => a.leadId === leadId)
      .map((a) => a.id);
    list = list.filter((h) => leadActivityIds.includes(h.activityId));
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function checkInWithCode(
  userId: string,
  activityId: string,
  code: string
): Promise<HoursEntry> {
  await delay(350, 700);
  const state = store.getState();
  const activity = state.activities.find((a) => a.id === activityId);

  if (!activity) throw new Error('Activity not found.');
  if (activity.checkInCode.trim() !== code.trim()) {
    throw new Error('The check-in code entered does not match the activity session.');
  }

  const user = state.users.find((u) => u.id === userId);
  const profile = state.profiles.find((p) => p.userId === userId);
  const now = new Date().toISOString();

  // If already checked in
  const existing = state.hours.find(
    (h) => h.userId === userId && h.activityId === activityId && h.status === 'logged'
  );
  if (existing) {
    return existing;
  }

  // Calculate default minutes based on activity schedule or 4 hours
  const start = new Date(activity.startsAt).getTime();
  const end = new Date(activity.endsAt).getTime();
  const calculatedMinutes = Math.max(60, Math.round((end - start) / (1000 * 60)));

  const newEntry: HoursEntry = {
    id: `hrs-${Date.now()}`,
    userId,
    userName: profile?.fullName || user?.username || 'Volunteer',
    activityId,
    activityTitle: activity.title,
    checkIn: now,
    checkOut: activity.endsAt,
    minutes: calculatedMinutes,
    source: 'checkin',
    status: 'logged',
    createdAt: now,
  };

  store.setState((prev) => ({
    ...prev,
    hours: [newEntry, ...prev.hours],
    enrollments: prev.enrollments.map((e) =>
      e.activityId === activityId && e.userId === userId
        ? { ...e, status: 'attended' }
        : e
    ),
  }));

  return newEntry;
}

export async function submitManualHours(
  userId: string,
  data: {
    activityId: string;
    date: string;
    hours: number;
    minutes: number;
    note: string;
  }
): Promise<HoursEntry> {
  await delay(400, 750);
  const state = store.getState();
  const activity = state.activities.find((a) => a.id === data.activityId);
  const user = state.users.find((u) => u.id === userId);
  const profile = state.profiles.find((p) => p.userId === userId);

  const totalMinutes = Math.round(data.hours * 60 + data.minutes);
  const now = new Date().toISOString();
  const checkInDate = `${data.date}T09:00:00Z`;
  const checkOutDate = new Date(
    new Date(checkInDate).getTime() + totalMinutes * 60 * 1000
  ).toISOString();

  const newEntry: HoursEntry = {
    id: `hrs-${Date.now()}`,
    userId,
    userName: profile?.fullName || user?.username || 'Volunteer',
    activityId: data.activityId,
    activityTitle: activity?.title || 'Community Service Activity',
    checkIn: checkInDate,
    checkOut: checkOutDate,
    minutes: totalMinutes,
    source: 'manual',
    status: 'logged',
    manualNote: data.note,
    createdAt: now,
  };

  store.setState((prev) => ({
    ...prev,
    hours: [newEntry, ...prev.hours],
  }));

  return newEntry;
}

export async function approveHours(
  hoursId: string,
  approverId: string = 'usr-yonas'
): Promise<HoursEntry> {
  await delay(300, 600);
  const state = store.getState();
  const entry = state.hours.find((h) => h.id === hoursId);
  if (!entry) throw new Error('Hours record not found');

  const updated: HoursEntry = {
    ...entry,
    status: 'approved',
    decidedBy: approverId,
  };

  store.setState((prev) => ({
    ...prev,
    hours: prev.hours.map((h) => (h.id === hoursId ? updated : h)),
  }));

  return updated;
}

export async function declineHours(
  hoursId: string,
  reason: string,
  approverId: string = 'usr-yonas'
): Promise<HoursEntry> {
  await delay(300, 600);
  const state = store.getState();
  const entry = state.hours.find((h) => h.id === hoursId);
  if (!entry) throw new Error('Hours record not found');

  const updated: HoursEntry = {
    ...entry,
    status: 'declined',
    decidedBy: approverId,
    decisionReason: reason,
  };

  store.setState((prev) => ({
    ...prev,
    hours: prev.hours.map((h) => (h.id === hoursId ? updated : h)),
  }));

  return updated;
}

export async function bulkApproveHours(
  hoursIds: string[],
  approverId: string = 'usr-yonas'
): Promise<void> {
  await delay(450, 800);
  for (const id of hoursIds) {
    await approveHours(id, approverId);
  }
}


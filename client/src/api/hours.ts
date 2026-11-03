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
    (h) => h.userId === userId && h.activityId === activityId && h.status === 'logged' && (!h.checkOut || h.checkOut === '')
  );
  if (existing) {
    return existing;
  }

  const newEntry: HoursEntry = {
    id: `hrs-${Date.now()}`,
    userId,
    userName: profile?.fullName || user?.username || 'Volunteer',
    activityId,
    activityTitle: activity.title,
    checkIn: now,
    checkOut: '',
    minutes: 0,
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

export async function checkOut(hoursId: string): Promise<HoursEntry> {
  await delay(300, 600);
  const state = store.getState();
  const entry = state.hours.find((h) => h.id === hoursId);
  if (!entry) throw new Error('Hours record not found');

  const now = new Date().toISOString();
  const start = new Date(entry.checkIn).getTime();
  const end = new Date(now).getTime();
  let elapsedMinutes = Math.max(15, Math.round((end - start) / (1000 * 60)));

  const activity = state.activities.find((a) => a.id === entry.activityId);
  let note = entry.manualNote;

  if (activity) {
    const actStart = new Date(activity.startsAt).getTime();
    const actEnd = new Date(activity.endsAt).getTime();
    const scheduledMinutes = Math.max(30, Math.round((actEnd - actStart) / (1000 * 60)));
    const maxAllowedMinutes = scheduledMinutes + 60; // capped at activity end time + 1 hour

    if (elapsedMinutes > maxAllowedMinutes) {
      elapsedMinutes = maxAllowedMinutes;
      note = note
        ? `${note} • Needs a quick look: check-out closed late, capped at scheduled end + 1 hr`
        : 'Needs a quick look: check-out closed late, capped at scheduled end + 1 hr';
    }
  }

  const updated: HoursEntry = {
    ...entry,
    checkOut: now,
    minutes: elapsedMinutes,
    manualNote: note,
  };

  store.setState((prev) => ({
    ...prev,
    hours: prev.hours.map((h) => (h.id === hoursId ? updated : h)),
  }));

  return updated;
}

export async function submitManualHours(
  userId: string,
  data: {
    activityId: string;
    date: string;
    hours: number;
    minutes: number;
    note: string;
    evidenceUrl?: string;
    evidenceThumbnail?: string;
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
    projectId: activity?.projectId,
    projectName: activity?.projectName,
    branchId: activity?.branchId || user?.branchId || profile?.branchId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    minutes: totalMinutes,
    source: 'manual',
    status: 'logged',
    manualNote: data.note,
    evidenceUrl: data.evidenceUrl,
    evidenceThumbnail: data.evidenceThumbnail,
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


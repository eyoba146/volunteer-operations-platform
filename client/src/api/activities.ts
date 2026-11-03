import { Activity, ActivityStatus, ActivityType, Rank } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getAllActivities(filters?: {
  type?: ActivityType | 'all';
  status?: ActivityStatus | 'all';
  area?: string;
  minRank?: Rank;
  search?: string;
}): Promise<Activity[]> {
  await delay(300, 650);
  const state = store.getState();
  let list = [...state.activities];

  if (filters?.type && filters.type !== 'all') {
    list = list.filter((a) => a.type === filters.type);
  }

  if (filters?.status && filters.status !== 'all') {
    list = list.filter((a) => a.status === filters.status);
  }

  if (filters?.area && filters.area !== 'all') {
    list = list.filter((a) => a.area.toLowerCase().includes(filters.area!.toLowerCase()));
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.place.toLowerCase().includes(q)
    );
  }

  // Sort: upcoming and in_progress first
  list.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  return list;
}

export async function getActivityById(activityId: string): Promise<Activity | null> {
  await delay(250, 450);
  const state = store.getState();
  const act = state.activities.find((a) => a.id === activityId);
  return act || null;
}

export async function createActivity(
  data: Omit<Activity, 'id' | 'status' | 'checkInCode' | 'leadId' | 'leadName'> & {
    branchId?: string;
    branchName?: string;
    areaId?: string;
    areaName?: string;
  },
  leadId: string,
  leadName: string
): Promise<Activity> {
  await delay(400, 750);
  const state = store.getState();
  const id = `act-${Date.now()}`;
  const checkInCode = Math.floor(1000 + Math.random() * 9000).toString();

  const leadUser = state.users.find((u) => u.id === leadId);
  const branchId = data.branchId || leadUser?.branchId || (leadUser?.scope?.unitId?.startsWith('branch') ? leadUser.scope.unitId : undefined);
  const branchName = data.branchName || leadUser?.branchName || (leadUser?.scope?.unitName?.includes('Branch') ? leadUser.scope.unitName : undefined);
  const areaId = data.areaId || leadUser?.areaId || (leadUser?.scope?.unitId?.startsWith('area') ? leadUser.scope.unitId : undefined);
  const areaName = data.areaName || leadUser?.areaName || (leadUser?.scope?.unitName?.includes('Area') ? leadUser.scope.unitName : undefined) || data.area;

  const newActivity: Activity = {
    ...data,
    id,
    leadId,
    leadName,
    branchId,
    branchName,
    areaId,
    areaName,
    status: 'open',
    checkInCode,
  };

  store.setState((prev) => ({
    ...prev,
    activities: [newActivity, ...prev.activities],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: leadId,
        actorName: leadName,
        actorRole: 'Team Lead',
        action: `Created new activity: "${newActivity.title}"`,
        subject: `Activity #${id}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return newActivity;
}

export async function updateActivity(
  activityId: string,
  updates: Partial<Activity>
): Promise<Activity> {
  await delay(300, 600);
  const state = store.getState();
  const act = state.activities.find((a) => a.id === activityId);
  if (!act) throw new Error('Activity not found');

  const updated: Activity = { ...act, ...updates };

  store.setState((prev) => ({
    ...prev,
    activities: prev.activities.map((a) => (a.id === activityId ? updated : a)),
  }));

  return updated;
}

export async function cancelActivity(activityId: string, reason: string): Promise<Activity> {
  await delay(350, 700);
  const state = store.getState();
  const act = state.activities.find((a) => a.id === activityId);
  if (!act) throw new Error('Activity not found');

  const updated: Activity = { ...act, status: 'cancelled' };

  store.setState((prev) => ({
    ...prev,
    activities: prev.activities.map((a) => (a.id === activityId ? updated : a)),
  }));

  return updated;
}

export async function completeActivity(activityId: string): Promise<Activity> {
  await delay(350, 700);
  const state = store.getState();
  const act = state.activities.find((a) => a.id === activityId);
  if (!act) throw new Error('Activity not found');

  const updated: Activity = { ...act, status: 'completed' };

  store.setState((prev) => ({
    ...prev,
    activities: prev.activities.map((a) => (a.id === activityId ? updated : a)),
  }));

  return updated;
}

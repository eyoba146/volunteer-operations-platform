import { ActivityLogEntry } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getActivityLog(query?: string): Promise<ActivityLogEntry[]> {
  await delay(250, 500);
  const state = store.getState();
  let list = [...state.activityLog];

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(
      (entry) =>
        entry.action.toLowerCase().includes(q) ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.subject.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function recordAction(
  actorId: string,
  actorName: string,
  actorRole: string,
  action: string,
  subject: string
): Promise<ActivityLogEntry> {
  const entry: ActivityLogEntry = {
    id: `log-${Date.now()}`,
    actorId,
    actorName,
    actorRole,
    action,
    subject,
    createdAt: new Date().toISOString(),
  };

  store.setState((prev) => ({
    ...prev,
    activityLog: [entry, ...prev.activityLog],
  }));

  return entry;
}


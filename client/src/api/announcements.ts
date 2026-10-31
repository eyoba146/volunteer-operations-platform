import { Announcement } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getAnnouncements(audience?: string): Promise<Announcement[]> {
  await delay(200, 450);
  const state = store.getState();
  let list = [...state.announcements];

  if (audience && audience !== 'all') {
    list = list.filter((a) => a.audience === 'all' || a.audience === audience);
  }

  // Pinned first, then newest
  return list.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export async function createAnnouncement(
  data: Omit<Announcement, 'id' | 'createdAt'>
): Promise<Announcement> {
  await delay(350, 700);
  const now = new Date().toISOString();
  const newAnnouncement: Announcement = {
    ...data,
    id: `anc-${Date.now()}`,
    createdAt: now,
  };

  store.setState((prev) => ({
    ...prev,
    announcements: [newAnnouncement, ...prev.announcements],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: data.authorId,
        actorName: data.authorName,
        actorRole: data.authorRole,
        action: `Published announcement: "${data.title}"`,
        subject: `Announcement #${newAnnouncement.id}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return newAnnouncement;
}


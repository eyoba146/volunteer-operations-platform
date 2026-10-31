import { Notification } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  await delay(150, 300);
  const now = new Date().toISOString();
  store.setState((prev) => ({
    ...prev,
    notifications: prev.notifications.map((n) =>
      n.id === notificationId ? { ...n, readAt: now } : n
    ),
  }));
}

export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  await delay(200, 400);
  const now = new Date().toISOString();
  store.setState((prev) => ({
    ...prev,
    notifications: prev.notifications.map((n) =>
      n.userId === userId ? { ...n, readAt: now } : n
    ),
  }));
}


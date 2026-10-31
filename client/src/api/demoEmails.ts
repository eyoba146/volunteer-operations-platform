import { DemoEmail } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getAllDemoEmails(): Promise<DemoEmail[]> {
  await delay(150, 350);
  const state = store.getState();
  return [...state.emails].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
}

export async function getDemoEmailById(id: string): Promise<DemoEmail | null> {
  await delay(150, 300);
  const state = store.getState();
  const found = state.emails.find((e) => e.id === id);
  return found || null;
}

export async function markDemoEmailRead(id: string): Promise<void> {
  store.setState((prev) => ({
    ...prev,
    emails: prev.emails.map((e) => (e.id === id ? { ...e, read: true } : e)),
  }));
}


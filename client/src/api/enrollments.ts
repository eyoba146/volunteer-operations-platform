import { Enrollment } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getEnrollmentsForActivity(activityId: string): Promise<Enrollment[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.enrollments.filter((e) => e.activityId === activityId);
}

export async function getEnrollmentsForUser(userId: string): Promise<Enrollment[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.enrollments.filter((e) => e.userId === userId);
}

export async function joinActivity(userId: string, activityId: string): Promise<Enrollment> {
  await delay(350, 700);
  const state = store.getState();
  const activity = state.activities.find((a) => a.id === activityId);

  if (!activity) throw new Error('Activity could not be found.');
  if (activity.status === 'completed' || activity.status === 'cancelled') {
    throw new Error('This activity is closed for new participants.');
  }

  const existing = state.enrollments.find(
    (e) => e.activityId === activityId && e.userId === userId
  );

  const activeEnrollments = state.enrollments.filter(
    (e) => e.activityId === activityId && (e.status === 'joined' || e.status === 'attended')
  );

  const isFull = activeEnrollments.length >= activity.capacity;
  const status = isFull ? 'waiting' : 'joined';
  const now = new Date().toISOString();

  let enrollment: Enrollment;

  if (existing) {
    if (existing.status === 'joined') {
      return existing; // already joined
    }
    enrollment = {
      ...existing,
      status,
      joinedAt: now,
      leftAt: undefined,
    };
    store.setState((prev) => ({
      ...prev,
      enrollments: prev.enrollments.map((e) => (e.id === existing.id ? enrollment : e)),
    }));
  } else {
    enrollment = {
      id: `enr-${Date.now()}`,
      activityId,
      userId,
      status,
      joinedAt: now,
    };
    store.setState((prev) => ({
      ...prev,
      enrollments: [enrollment, ...prev.enrollments],
    }));
  }

  return enrollment;
}

export async function leaveActivity(userId: string, activityId: string): Promise<void> {
  await delay(300, 550);
  const state = store.getState();
  const existing = state.enrollments.find(
    (e) => e.activityId === activityId && e.userId === userId
  );

  if (!existing) return;

  const now = new Date().toISOString();
  store.setState((prev) => ({
    ...prev,
    enrollments: prev.enrollments.map((e) =>
      e.id === existing.id ? { ...e, status: 'left', leftAt: now } : e
    ),
  }));
}


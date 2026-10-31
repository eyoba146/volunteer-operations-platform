import { VolunteerProfile, User } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getProfile(userId: string): Promise<VolunteerProfile | null> {
  await delay(200, 450);
  const state = store.getState();
  const profile = state.profiles.find((p) => p.userId === userId);
  return profile || null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<VolunteerProfile>
): Promise<VolunteerProfile> {
  await delay(350, 700);
  const state = store.getState();
  const existing = state.profiles.find((p) => p.userId === userId);

  if (!existing) {
    throw new Error('Profile not found.');
  }

  const updated: VolunteerProfile = { ...existing, ...updates };

  store.setState((prev) => ({
    ...prev,
    profiles: prev.profiles.map((p) => (p.userId === userId ? updated : p)),
  }));

  return updated;
}

export async function getAllVolunteers(filters?: {
  rank?: string;
  area?: string;
  search?: string;
}): Promise<Array<{ user: User; profile: VolunteerProfile }>> {
  await delay(350, 750);
  const state = store.getState();
  const pairs: Array<{ user: User; profile: VolunteerProfile }> = [];

  for (const prof of state.profiles) {
    const user = state.users.find((u) => u.id === prof.userId);
    if (!user) continue;

    if (filters?.rank && filters.rank !== 'all' && prof.rank !== filters.rank) {
      continue;
    }

    if (filters?.area && filters.area !== 'all' && !prof.area.toLowerCase().includes(filters.area.toLowerCase())) {
      continue;
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      const match =
        prof.fullName.toLowerCase().includes(q) ||
        user.username.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        prof.volunteerNumber?.toLowerCase().includes(q) ||
        prof.area.toLowerCase().includes(q);
      if (!match) continue;
    }

    pairs.push({ user, profile: prof });
  }

  return pairs;
}


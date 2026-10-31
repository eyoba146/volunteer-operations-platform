import { Rating } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getRatingsForVolunteer(userId: string): Promise<Rating[]> {
  await delay(200, 450);
  const state = store.getState();
  return state.ratings.filter((r) => r.userId === userId);
}

export async function submitRating(
  activityId: string,
  userId: string,
  ratedBy: string,
  score: number,
  note?: string
): Promise<Rating> {
  await delay(350, 700);
  const state = store.getState();
  const activity = state.activities.find((a) => a.id === activityId);
  const targetUser = state.users.find((u) => u.id === userId);
  const targetProfile = state.profiles.find((p) => p.userId === userId);
  const raterProfile = state.profiles.find((p) => p.userId === ratedBy);

  const newRating: Rating = {
    id: `rat-${Date.now()}`,
    activityId,
    activityTitle: activity?.title || 'Community Activity',
    userId,
    userName: targetProfile?.fullName || targetUser?.username || 'Volunteer',
    ratedBy,
    ratedByName: raterProfile?.fullName || 'Team Lead',
    score,
    note,
    createdAt: new Date().toISOString(),
  };

  store.setState((prev) => ({
    ...prev,
    ratings: [newRating, ...prev.ratings],
  }));

  return newRating;
}


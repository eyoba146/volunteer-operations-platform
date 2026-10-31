import { Setting, RankRule, Rank } from '../types';
import { store } from './store';
import { delay } from './delay';

export async function getSettings(): Promise<Setting[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.settings;
}

export async function updateSetting(
  key: string,
  value: string | number | boolean,
  actorId: string = 'usr-ruth',
  actorName: string = 'Ruth Mengistu'
): Promise<Setting> {
  await delay(300, 600);
  const state = store.getState();
  const setting = state.settings.find((s) => s.key === key);

  const updated: Setting = setting
    ? { ...setting, value }
    : { key, value };

  store.setState((prev) => ({
    ...prev,
    settings: prev.settings.some((s) => s.key === key)
      ? prev.settings.map((s) => (s.key === key ? updated : s))
      : [...prev.settings, updated],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId,
        actorName,
        actorRole: 'System Director',
        action: `Modified system setting "${key}" to "${value}"`,
        subject: `Setting #${key}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}

export async function getRankRules(): Promise<RankRule[]> {
  await delay(200, 400);
  const state = store.getState();
  return state.rankRules;
}

export async function updateRankRule(
  rank: Rank,
  ruleUpdates: Partial<RankRule>,
  actorId: string = 'usr-ruth',
  actorName: string = 'Ruth Mengistu'
): Promise<RankRule> {
  await delay(350, 650);
  const state = store.getState();
  const existing = state.rankRules.find((r) => r.rank === rank);

  if (!existing) throw new Error('Rank rule not found');

  const updated: RankRule = { ...existing, ...ruleUpdates };

  store.setState((prev) => ({
    ...prev,
    rankRules: prev.rankRules.map((r) => (r.rank === rank ? updated : r)),
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId,
        actorName,
        actorRole: 'System Director',
        action: `Updated qualification thresholds for rank: ${rank}`,
        subject: `RankRule #${rank}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return updated;
}


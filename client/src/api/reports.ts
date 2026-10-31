import { store } from './store';
import { delay } from './delay';

export async function getManagerOverviewStats(): Promise<{
  waitingApplications: number;
  newVolunteersThisMonth: number;
  approvedHoursThisMonth: number;
  upcomingActivities: number;
  promotionsWaiting: number;
}> {
  await delay(250, 500);
  const state = store.getState();

  const waitingApplications = state.applications.filter(
    (a) => a.status === 'submitted' || a.status === 'in_review'
  ).length;

  const newVolunteersThisMonth = state.profiles.filter((p) => {
    if (!p.memberSince) return false;
    return p.memberSince.startsWith('2026-10') || p.memberSince.startsWith('2026-09');
  }).length;

  const approvedHours = state.hours
    .filter((h) => h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0);

  const upcomingActivities = state.activities.filter(
    (a) => a.status === 'open' || a.status === 'full' || a.status === 'in_progress'
  ).length;

  const promotionsWaiting = state.promotions.filter(
    (p) => p.status === 'recommended' || p.status === 'eligible'
  ).length;

  return {
    waitingApplications,
    newVolunteersThisMonth,
    approvedHoursThisMonth: Math.round(approvedHours / 60),
    upcomingActivities,
    promotionsWaiting,
  };
}

export async function getFinanceOverviewStats(): Promise<{
  totalCollectedETB: number;
  confirmedCount: number;
  needsReviewCount: number;
  refundedCount: number;
  todayCount: number;
  todayETB: number;
}> {
  await delay(250, 500);
  const state = store.getState();

  const confirmedPayments = state.payments.filter((p) => p.status === 'confirmed');
  const totalCollectedETB = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const needsReviewCount = state.payments.filter((p) => p.status === 'needs_review').length;
  const refundedCount = state.payments.filter((p) => p.status === 'refunded').length;

  const todayStr = '2026-10-31';
  const todayPayments = confirmedPayments.filter((p) =>
    (p.confirmedAt || p.createdAt).startsWith(todayStr)
  );

  return {
    totalCollectedETB,
    confirmedCount: confirmedPayments.length,
    needsReviewCount,
    refundedCount,
    todayCount: todayPayments.length,
    todayETB: todayPayments.reduce((sum, p) => sum + p.amount, 0),
  };
}


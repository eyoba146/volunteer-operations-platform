import { Promotion, PromotionStatus, Rank, Certificate, User, VolunteerProfile } from '../types';
import { store } from './store';
import { delay } from './delay';

export interface RankProgressData {
  currentRank: Rank;
  nextRank: Rank | null;
  approvedHours: number;
  targetHours: number;
  completedActivities: number;
  targetActivities: number;
  averageRating: number;
  targetRating: number;
  monthsActive: number;
  targetMonths: number;
  completedTraining: string[];
  requiredTraining: string;
  isEligible: boolean;
  promotionStatus: PromotionStatus;
  currentPromotion?: Promotion;
}

export async function getRankProgress(userId: string): Promise<RankProgressData> {
  await delay(300, 600);
  const state = store.getState();
  const profile = state.profiles.find((p) => p.userId === userId);
  const currentRank: Rank = profile?.rank || 'member';

  // Determine next rank
  let nextRank: Rank | null = null;
  if (currentRank === 'member') nextRank = 'senior_member';
  else if (currentRank === 'senior_member') nextRank = 'team_lead';
  else if (currentRank === 'team_lead') nextRank = 'manager';

  // Hours calculation
  const approvedHoursEntries = state.hours.filter(
    (h) => h.userId === userId && h.status === 'approved'
  );
  const totalApprovedMinutes = approvedHoursEntries.reduce((sum, h) => sum + h.minutes, 0);
  const approvedHours = Math.round((totalApprovedMinutes / 60) * 10) / 10;

  // Completed activities
  const attendedEnrollments = state.enrollments.filter(
    (e) => e.userId === userId && e.status === 'attended'
  );
  const completedActivities = attendedEnrollments.length;

  // Average rating
  const ratings = state.ratings.filter((r) => r.userId === userId);
  const averageRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length) * 10) / 10
      : 5.0;

  // Months active
  const memberSince = profile?.memberSince ? new Date(profile.memberSince) : new Date();
  const diffTime = Math.abs(Date.now() - memberSince.getTime());
  const monthsActive = Math.round((diffTime / (1000 * 60 * 60 * 24 * 30)) * 10) / 10;

  // Completed training certificates
  const trainingCerts = state.certificates.filter(
    (c) => c.userId === userId && c.kind === 'training'
  );
  const completedTraining = trainingCerts.map((c) => c.metadata?.trainingTitle || c.title);

  const nextRule = nextRank ? state.rankRules.find((r) => r.rank === nextRank) : null;

  const targetHours = nextRule?.minHours || 60;
  const targetActivities = nextRule?.minActivities || 8;
  const targetRating = nextRule?.minRating || 4.0;
  const targetMonths = nextRule?.minMonths || 3;
  const requiredTraining = nextRule?.requiredTraining || 'Community Safety & Ethics';

  const meetsHours = approvedHours >= targetHours;
  const meetsActivities = completedActivities >= targetActivities;
  const meetsRating = averageRating >= targetRating;
  const meetsMonths = monthsActive >= targetMonths;
  const meetsTraining = completedTraining.some((t) =>
    t.toLowerCase().includes(requiredTraining.toLowerCase().slice(0, 10))
  );

  const isEligible =
    nextRank !== null &&
    meetsHours &&
    meetsActivities &&
    meetsRating &&
    meetsMonths &&
    meetsTraining;

  const activePromo = state.promotions.find(
    (p) => p.userId === userId && (p.status === 'recommended' || p.status === 'eligible')
  );

  let promotionStatus: PromotionStatus = 'not_eligible';
  if (activePromo) {
    promotionStatus = activePromo.status;
  } else if (isEligible) {
    promotionStatus = 'eligible';
  }

  return {
    currentRank,
    nextRank,
    approvedHours,
    targetHours,
    completedActivities,
    targetActivities,
    averageRating,
    targetRating,
    monthsActive,
    targetMonths,
    completedTraining,
    requiredTraining,
    isEligible,
    promotionStatus,
    currentPromotion: activePromo,
  };
}

export async function getEligiblePromotions(): Promise<Promotion[]> {
  await delay(300, 650);
  const state = store.getState();
  return state.promotions.filter(
    (p) => p.status === 'recommended' || p.status === 'eligible'
  );
}

export async function recommendPromotion(
  userId: string,
  toRank: Rank,
  note: string,
  recommendedBy: string = 'usr-yonas',
  recommendedByName: string = 'Yonas Kebede'
): Promise<Promotion> {
  await delay(350, 750);
  const state = store.getState();
  const profile = state.profiles.find((p) => p.userId === userId);
  const fromRank: Rank = profile?.rank || 'member';

  const progress = await getRankProgress(userId);

  const newPromotion: Promotion = {
    id: `prm-${Date.now()}`,
    userId,
    userName: profile?.fullName || 'Volunteer',
    userArea: profile?.area || 'Addis Ababa',
    fromRank,
    toRank,
    status: 'recommended',
    recommendedBy,
    recommendedByName,
    note,
    createdAt: new Date().toISOString(),
    evidence: {
      approvedHours: progress.approvedHours,
      completedActivities: progress.completedActivities,
      averageRating: progress.averageRating,
      monthsActive: progress.monthsActive,
      completedTraining: progress.completedTraining,
    },
  };

  store.setState((prev) => ({
    ...prev,
    promotions: [newPromotion, ...prev.promotions],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: recommendedBy,
        actorName: recommendedByName,
        actorRole: 'Team Lead',
        action: `Recommended ${profile?.fullName} for promotion to ${toRank}`,
        subject: `Promotion #${newPromotion.id}`,
        createdAt: new Date().toISOString(),
      },
      ...prev.activityLog,
    ],
  }));

  return newPromotion;
}

export async function decidePromotion(
  promotionId: string,
  decision: 'approved' | 'declined',
  note: string,
  decidedBy: string = 'usr-marta',
  decidedByName: string = 'Marta Girma'
): Promise<Promotion> {
  await delay(400, 800);
  const state = store.getState();
  const promo = state.promotions.find((p) => p.id === promotionId);

  if (!promo) throw new Error('Promotion record not found');

  const now = new Date().toISOString();
  const updatedPromo: Promotion = {
    ...promo,
    status: decision,
    decidedBy,
    decidedByName,
    decidedAt: now,
    note: note || promo.note,
  };

  let updatedUsers = state.users;
  let updatedProfiles = state.profiles;
  let updatedCertificates = state.certificates;
  let updatedEmails = state.emails;

  if (decision === 'approved') {
    // Update profile rank and rank history
    const profile = state.profiles.find((p) => p.userId === promo.userId);
    const certCode = `VTS-CERT-${Math.floor(1000 + Math.random() * 9000)}-ET`;
    const rankTitle =
      promo.toRank === 'senior_member'
        ? 'Senior Member of the Volunteer Corps'
        : promo.toRank === 'team_lead'
        ? 'Team Lead Credential of the Volunteer Corps'
        : 'Manager Credential of the Volunteer Corps';

    const newMilestone = {
      rank: promo.toRank,
      rankTitle,
      achievedAt: now,
      hoursRecorded: promo.evidence?.approvedHours || 150,
      approvedBy: decidedByName,
      certificateCode: certCode,
      note: note || promo.note,
    };

    if (profile) {
      updatedProfiles = updatedProfiles.map((p) =>
        p.userId === promo.userId
          ? {
              ...p,
              rank: promo.toRank,
              rankHistory: p.rankHistory ? [newMilestone, ...p.rankHistory] : [newMilestone],
            }
          : p
      );
    }

    // If moving to team_lead or manager, update User role
    const user = state.users.find((u) => u.id === promo.userId);
    if (user) {
      if (promo.toRank === 'team_lead' || promo.toRank === 'manager') {
        const updatedUser: User = { ...user, role: promo.toRank };
        updatedUsers = updatedUsers.map((u) => (u.id === user.id ? updatedUser : u));
        if (store.getCurrentUser()?.id === user.id) {
          store.setCurrentUser(updatedUser);
        }
      }

      // Generate rank certificate
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        userId: user.id,
        userName: profile?.fullName || user.username,
        volunteerNumber: profile?.volunteerNumber || 'VTS-2026',
        kind: 'rank',
        title: rankTitle,
        issuedAt: now,
        verificationCode: certCode,
        issuerName: decidedByName,
        issuerRole: 'Program Manager',
        metadata: {
          rank: promo.toRank,
        },
      };

      updatedCertificates = [newCert, ...updatedCertificates];

      // Send congratulations email
      updatedEmails = [
        {
          id: `em-${Date.now()}`,
          to: user.email,
          toName: profile?.fullName || user.username,
          subject: `Promotion Approved — Congratulations on Reaching ${promo.toRank.replace('_', ' ').toUpperCase()}!`,
          category: 'promotion',
          sentAt: now,
          read: false,
          body: `Dear ${profile?.fullName || user.username},\n\nWe are proud to share that your promotion to ${promo.toRank.replace('_', ' ')} has been approved by ${decidedByName} in recognition of your exemplary service and leadership.\n\nYour new rank badge, permissions, and official certificate are now active on your profile.\n\nWarm regards,\nVTS Leadership Board`,
          actionLabel: 'View Certificate',
          actionUrl: '/volunteer/certificates',
        },
        ...updatedEmails,
      ];
    }
  }

  const user = state.users.find((u) => u.id === promo.userId);
  let updatedNotifications = state.notifications;
  if (decision === 'approved' && user) {
    updatedNotifications = [
      {
        id: `notif-${Date.now()}`,
        userId: user.id,
        title: `Promotion to ${promo.toRank.replace('_', ' ').toUpperCase()} Approved`,
        body: `Your promotion nomination has been approved by ${decidedByName}. Your Team Lead dispatch desk is now active.`,
        createdAt: now,
        link: '/team-lead/home',
      },
      ...updatedNotifications,
    ];
  }

  store.setState((prev) => ({
    ...prev,
    promotions: prev.promotions.map((p) => (p.id === promotionId ? updatedPromo : p)),
    users: updatedUsers,
    profiles: updatedProfiles,
    certificates: updatedCertificates,
    emails: updatedEmails,
    notifications: updatedNotifications,
    activityLog: [
      {
        id: `log-${Date.now()}`,
        actorId: decidedBy,
        actorName: decidedByName,
        actorRole: 'Program Manager',
        action: `${decision === 'approved' ? 'Approved' : 'Declined'} promotion of ${promo.userName} to ${promo.toRank}`,
        subject: `Promotion #${promotionId}`,
        createdAt: now,
      },
      ...prev.activityLog,
    ],
  }));

  return updatedPromo;
}


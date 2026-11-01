import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { RankProgressData } from '../../api/promotions';
import { Button, StatusMark, ProgressMeter, Skeleton, TrailLine, TopoBackdrop, TrailMeter } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import {
  Sparkle,
  CheckCircle,
  Certificate as CertIcon
} from '@phosphor-icons/react';

export const VolunteerRankProgressPage: React.FC = () => {
  const { user, profile, refreshUser } = useAuth();
  const [progress, setProgress] = useState<RankProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommending, setIsRecommending] = useState(false);
  const toast = useToast();

  const loadProgress = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await api.getRankProgress(user.id);
      setProgress(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, [user]);

  const handleRequestPromotion = async () => {
    if (!user || !progress?.nextRank) return;
    setIsRecommending(true);
    try {
      await api.recommendPromotion(
        user.id,
        progress.nextRank,
        `Self-nomination: Satisfied all rank threshold requirements (${progress.approvedHours} verified hours, ${progress.completedActivities} completed sessions, ${progress.averageRating} average rating).`,
        user.id,
        profile?.fullName || user.username
      );
      toast.success(`Your promotion application to ${progress.nextRank.replace('_', ' ')} has been submitted!`);
      await refreshUser();
      await loadProgress();
    } catch (err: any) {
      toast.error(err.message || 'Could not file promotion request.');
    } finally {
      setIsRecommending(false);
    }
  };

  if (isLoading || !progress) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="rect" className="h-44" />
        <Skeleton variant="rect" className="h-96" />
      </div>
    );
  }

  const rankIndices: Record<string, number> = {
    member: 1,
    senior_member: 2,
    team_lead: 3,
    manager: 4,
  };
  const currentWaypointIndex = rankIndices[progress.currentRank] || 1;

  const waypoints = [
    { id: 'start', label: 'Trailhead', threshold: 'Registration', isCompleted: true },
    { id: 'member', label: 'Member', threshold: '0 hrs • Verified', isCompleted: true },
    {
      id: 'senior_member',
      label: 'Senior Member',
      threshold: '60 hrs • 8 acts',
      isCompleted: progress.currentRank !== 'member',
      isCurrent: progress.currentRank === 'senior_member',
    },
    {
      id: 'team_lead',
      label: 'Team Lead',
      threshold: '150 hrs • 20 acts',
      isCompleted: progress.currentRank === 'team_lead' || progress.currentRank === 'manager',
      isCurrent: progress.currentRank === 'team_lead',
    },
    {
      id: 'manager',
      label: 'Manager',
      threshold: '300 hrs • 30 acts',
      isCompleted: progress.currentRank === 'manager',
      isCurrent: progress.currentRank === 'manager',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink-primary leading-tight mt-1">
            Rank progression board
          </h1>
          <p className="font-sans text-sm text-ink-secondary mt-1">
            Clear, verifiable thresholds for promotion. Every verified hour advances you along the volunteer trail.
          </p>
        </div>

        <div>
          <StatusMark status={progress.promotionStatus} size="md" />
        </div>
      </div>

      {/* THE SIGNATURE TRAIL ROUTE LINE */}
      <div className="relative rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] overflow-hidden p-6 sm:p-8 space-y-4">
        <TopoBackdrop color="#15803D" opacity={0.06} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <div className="space-y-0.5">
            <h3 className="font-display text-2xl font-bold text-ink-primary">
              Rank progression trail
            </h3>
          </div>
          <div className="flex items-center gap-2 font-sans text-sm font-semibold bg-[#F1F3F6] px-3 py-1 rounded-[6px]">
            <span className="text-ink-secondary">Current progress:</span>
            <span className="text-role-volunteer font-bold">{progress.approvedHours} verified hours</span>
          </div>
        </div>

        {/* TrailMeter Continuous Route */}
        <div className="relative z-10 pt-2">
          <TrailMeter
            variant="full"
            currentHours={progress.approvedHours}
            currentRank={progress.currentRank}
          />
        </div>
      </div>

      {/* Promotion Status Banners */}
      {progress.promotionStatus === 'recommended' && (
        <div className="rounded-[16px] bg-[#FFFBEB] p-6 space-y-3">
          <div className="flex items-start gap-3">
            <Sparkle className="w-6 h-6 text-role-applicant shrink-0 mt-0.5" weight="fill" />
            <div className="space-y-1">
              <span className="font-sans text-[13px] font-bold text-role-applicant block">
                Promotion recommendation filed
              </span>
              <h2 className="font-display text-2xl font-bold text-ink-primary">
                Awaiting decision from Program Manager
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {progress.currentPromotion?.note ||
                  'Your Team Lead has formally submitted your promotion recommendation. Upon approval by the Program Manager, your rank credentials and unlocked capabilities will take effect immediately.'}
              </p>
              <span className="font-sans text-[13px] text-ink-secondary block pt-1">
                Nominated by: <strong>{progress.currentPromotion?.recommendedByName || 'Team Lead'}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {progress.promotionStatus === 'eligible' && (
        <div className="rounded-[16px] bg-[#ECFDF5] p-6 space-y-3">
          <div className="flex flex-col flex-wrap sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-sans text-[13px] font-bold text-role-volunteer block">
                All thresholds satisfied
              </span>
              <h2 className="font-display text-2xl font-bold text-ink-primary">
                You are eligible for promotion to {progress.nextRank?.replace('_', ' ')}
              </h2>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                You have met all hours, activity, performance rating, and training requirements. You can submit your candidacy to the review board.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              isLoading={isRecommending}
              onClick={handleRequestPromotion}
            >
              Submit for review
            </Button>
          </div>
        </div>
      )}

      {/* Main Progression Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Station & Unlocked Privileges */}
        <div className="space-y-6">
          <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-4">
            <span className="font-sans text-[13px] font-bold text-ink-secondary block">
              Current rank standing
            </span>

            <div className="flex items-center gap-3 pb-4">
              <div className="w-12 h-12 bg-role-volunteer text-white rounded-[8px] flex items-center justify-center font-display text-2xl font-bold">
                {progress.currentRank === 'senior_member' ? 'SM' : progress.currentRank === 'team_lead' ? 'TL' : 'M'}
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-ink-primary">
                  {progress.currentRank.replace('_', ' ')}
                </h3>
                <span className="font-sans text-[13px] text-ink-secondary">
                  Member since {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Aug 2026'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-sm font-sans text-ink-secondary">
              <div className="flex justify-between pt-1">
                <span>Total approved hours:</span>
                <strong className="text-ink-primary">{progress.approvedHours} hrs</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span>Completed activities:</span>
                <strong className="text-ink-primary">{progress.completedActivities} sessions</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span>Average rating:</span>
                <strong className="text-ink-primary">{progress.averageRating} / 5.0</strong>
              </div>
              <div className="flex justify-between pt-2">
                <span>Active service duration:</span>
                <strong className="text-ink-primary">{progress.monthsActive} months</strong>
              </div>
            </div>
          </div>

          {/* Next Rank Info */}
          {progress.nextRank && (
            <div className="rounded-[16px] bg-[#F7F8FA] p-6 space-y-3">
              <span className="font-sans text-[13px] font-bold text-ink-secondary block">
                Target rank
              </span>
              <h4 className="font-display text-2xl font-bold text-ink-primary">
                {progress.nextRank.replace('_', ' ')}
              </h4>
              <p className="font-sans text-sm text-ink-secondary leading-relaxed">
                {progress.nextRank === 'senior_member'
                  ? 'Unlocks priority activity booking, peer mentorship responsibilities, and Senior Member credential.'
                  : progress.nextRank === 'team_lead'
                    ? 'Unlocks field coordination authority, activity creation, hours approval desk, and volunteer ratings.'
                    : 'Unlocks program operations, recruitment review, and policy coordination.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: 5 Requirement Meters */}
        <div className="lg:col-span-2 rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6">
          <div className="pb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-ink-primary">
              Rank criteria: {progress.nextRank?.replace('_', ' ') || 'Next rank'}
            </h2>
            <span className="font-sans text-[13px] font-bold text-ink-secondary">
              {progress.isEligible ? '5 / 5 met' : 'In progress'}
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Approved Hours */}
            <div className="space-y-1">
              <ProgressMeter
                label="1. Approved service hours"
                current={progress.approvedHours}
                target={progress.targetHours}
                unit="hrs"
                color="green"
              />
              <span className="font-sans text-[13px] text-ink-secondary block">
                {progress.approvedHours >= progress.targetHours
                  ? 'Requirement satisfied'
                  : `${Math.round((progress.targetHours - progress.approvedHours) * 10) / 10} hours left to complete`}
              </span>
            </div>

            {/* 2. Completed Activities */}
            <div className="space-y-1">
              <ProgressMeter
                label="2. Completed field activities"
                current={progress.completedActivities}
                target={progress.targetActivities}
                unit="acts"
                color="green"
              />
              <span className="font-sans text-[13px] text-ink-secondary block">
                {progress.completedActivities >= progress.targetActivities
                  ? 'Requirement satisfied'
                  : `${progress.targetActivities - progress.completedActivities} activities left to attend`}
              </span>
            </div>

            {/* 3. Average Rating */}
            <div className="space-y-1">
              <ProgressMeter
                label="3. Minimum performance rating"
                current={progress.averageRating}
                target={progress.targetRating}
                unit="/ 5.0"
                color="gold"
              />
              <span className="font-sans text-[13px] text-ink-secondary block">
                {progress.averageRating >= progress.targetRating
                  ? 'Requirement satisfied'
                  : 'Score must meet or exceed minimum threshold'}
              </span>
            </div>

            {/* 4. Months in Service */}
            <div className="space-y-1">
              <ProgressMeter
                label="4. Active service duration"
                current={progress.monthsActive}
                target={progress.targetMonths}
                unit="mo"
                color="navy"
              />
              <span className="font-sans text-[13px] text-ink-secondary block">
                {progress.monthsActive >= progress.targetMonths
                  ? 'Requirement satisfied'
                  : `${Math.max(0, Math.round((progress.targetMonths - progress.monthsActive) * 10) / 10)} months remaining`}
              </span>
            </div>

            {/* 5. Required Training Session */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-sans font-bold text-ink-primary">
                  5. Orientation and training
                </span>
                <span className="font-sans text-[13px] font-bold text-ink-primary">
                  {progress.requiredTraining}
                </span>
              </div>
              <div className="p-4 rounded-[12px] bg-[#F7F8FA] flex items-center justify-between text-sm font-sans">
                <div className="flex items-center gap-2.5">
                  <CertIcon className="w-5 h-5 text-role-volunteer" weight="bold" />
                  <span className="font-bold text-ink-primary">{progress.requiredTraining}</span>
                </div>
                {progress.completedTraining.some((t) =>
                  t.toLowerCase().includes(progress.requiredTraining.toLowerCase().slice(0, 10))
                ) ? (
                  <span className="font-sans text-[13px] font-bold text-role-volunteer flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" weight="fill" /> Completed
                  </span>
                ) : (
                  <span className="font-sans text-[13px] text-ink-secondary">Course not yet completed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

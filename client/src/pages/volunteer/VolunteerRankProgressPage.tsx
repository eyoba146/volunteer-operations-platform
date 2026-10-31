import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { RankProgressData } from '../../api/promotions';
import { ProgressMeter, StatusMark, Button, Skeleton, TrailLine } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ChartLineUp, 
  CheckCircle, 
  Clock, 
  Star, 
  Certificate as CertIcon, 
  ShieldCheck, 
  ArrowRight,
  Sparkle,
  CalendarBlank,
  UsersThree
} from '@phosphor-icons/react';

export const VolunteerRankProgressPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState<RankProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommending, setIsRecommending] = useState(false);
  const toast = useToast();

  const loadData = async () => {
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
    loadData();
  }, [user]);

  const handleRequestPromotion = async () => {
    if (!user || !progress || !progress.nextRank) return;
    setIsRecommending(true);
    try {
      await api.recommendPromotion(
        user.id,
        progress.nextRank,
        'Volunteer has fulfilled every threshold and formally filed for promotion review.',
        user.id,
        profile?.fullName || user.username
      );
      toast.success('Your promotion candidacy has been submitted to the review board.');
      await loadData();
    } finally {
      setIsRecommending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-44" />
        <Skeleton variant="rect" className="h-72" />
      </div>
    );
  }

  if (!progress) {
    return <div className="text-sm font-sans text-ink-secondary">Progression data could not be loaded.</div>;
  }

  // Calculate waypoint index for TrailLine
  const rankIndices: Record<string, number> = {
    member: 1,
    senior_member: 2,
    team_lead: 3,
    manager: 4,
  };
  const currentWaypointIndex = rankIndices[progress.currentRank] || 1;

  const waypoints = [
    { id: 'start', label: 'Trailhead', altitude: 'Base 0m', isCompleted: true },
    { id: 'member', label: 'Member', altitude: 'Activated • 0h', isCompleted: true },
    {
      id: 'senior_member',
      label: 'Senior Member',
      altitude: 'Camp 1 • 60h',
      isCompleted: progress.currentRank !== 'member',
      isCurrent: progress.currentRank === 'senior_member',
    },
    {
      id: 'team_lead',
      label: 'Team Lead',
      altitude: 'Camp 2 • 150h',
      isCompleted: progress.currentRank === 'team_lead' || progress.currentRank === 'manager',
      isCurrent: progress.currentRank === 'team_lead',
    },
    {
      id: 'manager',
      label: 'Manager',
      altitude: 'Manager • 300h',
      isCompleted: progress.currentRank === 'manager',
      isCurrent: progress.currentRank === 'manager',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b-2 border-border pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-sans text-xs font-bold text-role-volunteer tracking-tight block">
            Rank and advancement
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-ink-primary leading-none mt-1">
            Rank Progression Board
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
            Clear, verifiable thresholds for promotion. Rank is altitude; every hour logged moves you further up the trail.
          </p>
        </div>

        <div>
          <StatusMark status={progress.promotionStatus} size="md" />
        </div>
      </div>

      {/* THE SIGNATURE TRAIL ROUTE LINE */}
      <div
        className="border-2 border-ink-primary bg-white p-6 sm:p-8 shadow-ticket space-y-3"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border pb-3">
          <div className="space-y-0.5">
            <span className="font-sans text-xs font-bold text-role-volunteer tracking-tight block">
              Active Trail Route
            </span>
            <h3 className="font-display text-2xl font-black text-ink-primary">
              Rank progression trail
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold bg-canvas px-3 py-1 border border-border">
            <span className="text-ink-secondary">Current Altitude:</span>
            <span className="text-role-volunteer">{progress.approvedHours} verified hours</span>
          </div>
        </div>

        {/* Trail Route SVG animation */}
        <TrailLine
          waypoints={waypoints}
          currentWaypointIndex={currentWaypointIndex}
          strokeColor="#1E824C"
          className="pt-2"
        />
      </div>

      {/* Promotion Status Banners */}
      {progress.promotionStatus === 'recommended' && (
        <div className="border-2 border-ink-primary bg-role-applicantLight p-6 shadow-ticket space-y-3">
          <div className="flex items-start gap-3">
            <Sparkle className="w-6 h-6 text-role-applicant shrink-0 mt-0.5" weight="fill" />
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold text-role-applicant block">
                Promotion Recommendation Filed
              </span>
              <h2 className="font-display text-2xl font-black text-ink-primary">
                Awaiting Decision from Program Manager
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {progress.currentPromotion?.note ||
                  'Your Team Lead has formally submitted your promotion recommendation. Upon approval by the Program Manager, your rank credentials and unlocked capabilities will take effect immediately.'}
              </p>
              <span className="font-mono text-xs text-ink-secondary block pt-1">
                Nominated by: <strong>{progress.currentPromotion?.recommendedByName || 'Team Lead'}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {progress.promotionStatus === 'eligible' && (
        <div className="border-2 border-ink-primary bg-role-volunteerLight p-6 shadow-ticket space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold text-role-volunteer block">
                All Thresholds Satisfied
              </span>
              <h2 className="font-display text-2xl font-black text-ink-primary">
                You are Eligible for Promotion to {progress.nextRank?.replace('_', ' ').toUpperCase()}!
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
                You have met all hours, activity, performance rating, and training requirements. You can submit your candidacy to the review board.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              isLoading={isRecommending}
              onClick={handleRequestPromotion}
            >
              Submit for Board Review
            </Button>
          </div>
        </div>
      )}

      {/* Main Progression Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Current Station & Unlocked Privileges */}
        <div className="space-y-6">
          <div className="border-2 border-ink-primary bg-white p-6 shadow-ticket space-y-4">
            <span className="font-sans text-xs font-bold text-ink-tertiary block">
              Current Rank Standing
            </span>

            <div className="flex items-center gap-3 border-b-2 border-border pb-4">
              <div className="w-14 h-14 bg-role-volunteer text-white flex items-center justify-center font-display text-3xl font-black border-2 border-ink-primary">
                {progress.currentRank === 'senior_member' ? 'SM' : progress.currentRank === 'team_lead' ? 'TL' : 'M'}
              </div>
              <div>
                <h3 className="font-display text-2xl font-black text-ink-primary">
                  {progress.currentRank.replace('_', ' ')}
                </h3>
                <span className="font-mono text-xs text-ink-secondary">
                  Member since {profile?.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Aug 2026'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-sans text-ink-secondary">
              <div className="flex justify-between">
                <span>Total Approved Hours:</span>
                <strong className="font-mono text-ink-primary">{progress.approvedHours} hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Completed Activities:</span>
                <strong className="font-mono text-ink-primary">{progress.completedActivities} sessions</strong>
              </div>
              <div className="flex justify-between">
                <span>Average Performance Score:</span>
                <strong className="font-mono text-ink-primary">{progress.averageRating} / 5.0</strong>
              </div>
              <div className="flex justify-between">
                <span>Active Service Duration:</span>
                <strong className="font-mono text-ink-primary">{progress.monthsActive} months</strong>
              </div>
            </div>
          </div>

          {/* Next Rank Info */}
          {progress.nextRank && (
            <div className="border-2 border-ink-primary bg-canvas p-6 shadow-ticket space-y-3">
              <span className="font-sans text-xs font-bold text-ink-tertiary block">
                Target Station
              </span>
              <h4 className="font-display text-2xl font-black text-ink-primary">
                {progress.nextRank.replace('_', ' ')}
              </h4>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                {progress.nextRank === 'senior_member'
                  ? 'Unlocks priority activity booking, peer mentorship responsibilities, and Senior Member credential.'
                  : progress.nextRank === 'team_lead'
                  ? 'Unlocks field coordination authority, activity creation, hours approval desk, and volunteer ratings.'
                  : 'Unlocks program administration, recruitment review, and policy coordination.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: 5 Requirement Meters (Section 5.2) */}
        <div className="lg:col-span-2 border-2 border-ink-primary bg-white p-6 sm:p-8 shadow-ticket space-y-6">
          <div className="border-b-2 border-border pb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl font-black text-ink-primary">
              Threshold Requirements: {progress.nextRank?.replace('_', ' ').toUpperCase() || 'NEXT RANK'}
            </h2>
            <span className="font-mono text-xs font-bold text-ink-tertiary">
              {progress.isEligible ? '5 / 5 MET' : 'IN PROGRESS'}
            </span>
          </div>

          <div className="space-y-6">
            {/* 1. Approved Hours */}
            <div className="space-y-1">
              <ProgressMeter
                label="1. Approved Service Hours"
                current={progress.approvedHours}
                target={progress.targetHours}
                unit="hrs"
                color="green"
              />
              <span className="font-mono text-[13px] text-ink-secondary block">
                {progress.approvedHours >= progress.targetHours
                  ? 'Requirement satisfied'
                  : `${Math.round((progress.targetHours - progress.approvedHours) * 10) / 10} hours left to complete`}
              </span>
            </div>

            {/* 2. Completed Activities */}
            <div className="space-y-1">
              <ProgressMeter
                label="2. Completed Field Activities"
                current={progress.completedActivities}
                target={progress.targetActivities}
                unit="acts"
                color="green"
              />
              <span className="font-mono text-[13px] text-ink-secondary block">
                {progress.completedActivities >= progress.targetActivities
                  ? 'Requirement satisfied'
                  : `${progress.targetActivities - progress.completedActivities} activities left to attend`}
              </span>
            </div>

            {/* 3. Average Rating */}
            <div className="space-y-1">
              <ProgressMeter
                label="3. Minimum Performance Rating"
                current={progress.averageRating}
                target={progress.targetRating}
                unit="/ 5.0"
                color="gold"
              />
              <span className="font-mono text-[13px] text-ink-secondary block">
                {progress.averageRating >= progress.targetRating
                  ? 'Requirement satisfied'
                  : 'Score must meet or exceed minimum threshold'}
              </span>
            </div>

            {/* 4. Months in Service */}
            <div className="space-y-1">
              <ProgressMeter
                label="4. Active Service Duration"
                current={progress.monthsActive}
                target={progress.targetMonths}
                unit="mo"
                color="navy"
              />
              <span className="font-mono text-[13px] text-ink-secondary block">
                {progress.monthsActive >= progress.targetMonths
                  ? 'Requirement satisfied'
                  : `${Math.max(0, Math.round((progress.targetMonths - progress.monthsActive) * 10) / 10)} months remaining`}
              </span>
            </div>

            {/* 5. Required Training Session */}
            <div className="space-y-2 pt-2 border-t-2 border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-bold text-ink-primary">
                  5. Orientation & training
                </span>
                <span className="font-mono text-xs font-bold text-ink-primary">
                  {progress.requiredTraining}
                </span>
              </div>
              <div className="p-4 border-2 border-ink-primary bg-canvas flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2.5">
                  <CertIcon className="w-5 h-5 text-role-volunteer" weight="bold" />
                  <span className="font-bold text-ink-primary">{progress.requiredTraining}</span>
                </div>
                {progress.completedTraining.some((t) =>
                  t.toLowerCase().includes(progress.requiredTraining.toLowerCase().slice(0, 10))
                ) ? (
                  <span className="font-mono font-bold text-role-volunteer flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" weight="fill" /> Completed
                  </span>
                ) : (
                  <span className="font-mono text-ink-tertiary">Course not yet completed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

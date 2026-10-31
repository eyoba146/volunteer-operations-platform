import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { RankProgressData } from '../../api/promotions';
import { ProgressMeter, StatusMark, Button, Skeleton } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ChartLineUp, 
  CheckCircle, 
  Clock, 
  Star, 
  Certificate, 
  ShieldCheck, 
  ArrowRight,
  Sparkle
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
        'Volunteer has fulfilled every threshold and requested formal board review.',
        user.id,
        profile?.fullName || user.username
      );
      toast.success('Your promotion request has been submitted to the review board.');
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
    return <div>Could not load progression metrics.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
              MERIT & ADVANCEMENT
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
              Rank Progression Board
            </h1>
          </div>
          <div>
            <StatusMark status={progress.promotionStatus} size="md" />
          </div>
        </div>
        <p className="font-sans text-xs sm:text-sm text-ink-secondary">
          Clear, visible thresholds for advancement. Every promotion is backed by verifiable civic duty.
        </p>
      </div>

      {/* Promotion Alert Banner if Recommended / Eligible */}
      {progress.promotionStatus === 'recommended' && (
        <div className="border-2 border-civic-gold bg-civic-goldLight p-6 space-y-3 shadow-subtle">
          <div className="flex items-start gap-3">
            <Sparkle className="w-6 h-6 text-[#784E0B] shrink-0 mt-0.5" weight="fill" />
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#784E0B] font-bold block">
                PROMOTION RECOMMENDATION FILED
              </span>
              <h2 className="font-serif text-lg font-bold text-ink-primary">
                Awaiting Review Board Decision
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-secondary leading-relaxed">
                {progress.currentPromotion?.note ||
                  'Your Team Lead has formally submitted your nomination to the Program Manager. Upon approval, your rank credential and permissions will activate automatically.'}
              </p>
              <span className="font-mono text-[11px] text-ink-tertiary block pt-1">
                Submitted by: {progress.currentPromotion?.recommendedByName || 'Team Lead'}
              </span>
            </div>
          </div>
        </div>
      )}

      {progress.promotionStatus === 'eligible' && (
        <div className="border-2 border-civic-green bg-civic-greenLight p-6 space-y-3 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-civic-green font-bold block">
                THRESHOLDS SATISFIED
              </span>
              <h2 className="font-serif text-lg font-bold text-ink-primary">
                You are Eligible for Promotion to {progress.nextRank?.replace('_', ' ').toUpperCase()}!
              </h2>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                You have met all hours, activity, rating, and training requirements. You can submit your candidacy to the review board.
              </p>
            </div>
            <Button
              variant="primary"
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
        {/* Left Column: Current vs Next Rank */}
        <div className="space-y-6">
          <div className="border border-border bg-canvas-raised p-6 space-y-4">
            <span className="font-mono text-xs uppercase text-ink-tertiary block">
              Current Rank Status
            </span>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border border-border bg-canvas-subdued flex items-center justify-center font-bold text-lg font-serif">
                {progress.currentRank === 'senior_member' ? 'S' : 'M'}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-ink-primary capitalize">
                  {progress.currentRank.replace('_', ' ')}
                </h3>
                <span className="font-mono text-xs text-ink-tertiary">
                  Member since: {profile?.memberSince || '2026-08'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border space-y-2 text-xs font-sans text-ink-secondary">
              <div className="flex justify-between">
                <span>Total Approved Hours:</span>
                <strong className="font-mono text-ink-primary">{progress.approvedHours} hrs</strong>
              </div>
              <div className="flex justify-between">
                <span>Activities Completed:</span>
                <strong className="font-mono text-ink-primary">{progress.completedActivities}</strong>
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
            <div className="border border-border bg-canvas-subdued/50 p-6 space-y-3">
              <span className="font-mono text-xs uppercase text-ink-tertiary block">
                Targeted Progression
              </span>
              <h4 className="font-serif text-lg font-bold text-ink-primary capitalize">
                {progress.nextRank.replace('_', ' ')}
              </h4>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                {progress.nextRank === 'senior_member'
                  ? 'Unlocks priority activity booking, peer mentorship duties, and Senior Corps credential.'
                  : progress.nextRank === 'team_lead'
                  ? 'Unlocks field coordination authority, activity creation, hours approval, and volunteer ratings.'
                  : 'Unlocks program administration, recruitment review, and policy coordination.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: 5 Requirement Meters (Section 5.2) */}
        <div className="lg:col-span-2 border border-border bg-canvas-raised p-6 md:p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-ink-primary border-b border-border pb-3">
            Threshold Assessment for {progress.nextRank?.replace('_', ' ').toUpperCase() || 'Next Rank'}
          </h2>

          <div className="space-y-6">
            {/* 1. Approved Hours */}
            <ProgressMeter
              label="1. Approved Service Hours"
              current={progress.approvedHours}
              target={progress.targetHours}
              unit="hrs"
              color="green"
            />

            {/* 2. Completed Activities */}
            <ProgressMeter
              label="2. Completed Field Activities"
              current={progress.completedActivities}
              target={progress.targetActivities}
              unit="activities"
              color="green"
            />

            {/* 3. Average Rating */}
            <ProgressMeter
              label="3. Minimum Average Performance Rating"
              current={progress.averageRating}
              target={progress.targetRating}
              unit="/ 5.0"
              color="gold"
            />

            {/* 4. Months in Service */}
            <ProgressMeter
              label="4. Minimum Time as Active Volunteer"
              current={progress.monthsActive}
              target={progress.targetMonths}
              unit="months"
              color="navy"
            />

            {/* 5. Required Training Session */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="font-sans font-medium text-ink-secondary">
                  5. Required Qualification Training
                </span>
                <span className="font-mono text-xs font-semibold text-ink-primary">
                  {progress.requiredTraining}
                </span>
              </div>
              <div className="p-3 border border-border bg-canvas-subdued flex items-center justify-between text-xs font-sans">
                <div className="flex items-center gap-2">
                  <Certificate className="w-4 h-4 text-ink-tertiary" />
                  <span>{progress.requiredTraining}</span>
                </div>
                {progress.completedTraining.some((t) =>
                  t.toLowerCase().includes(progress.requiredTraining.toLowerCase().slice(0, 10))
                ) ? (
                  <span className="font-mono font-semibold text-civic-green flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" weight="fill" /> Completed
                  </span>
                ) : (
                  <span className="font-mono text-ink-tertiary">Not yet completed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


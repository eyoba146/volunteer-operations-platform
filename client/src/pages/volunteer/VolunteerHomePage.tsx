import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Announcement, Enrollment } from '../../types';
import { formatRank } from '../../utils/format';
import { RankProgressData } from '../../api/promotions';
import { Button, StatusMark, ProgressMeter, Skeleton, Avatar } from '../../components/ui';
import { 
  Calendar, 
  Clock, 
  QrCode, 
  IdentificationCard, 
  ChartLineUp, 
  Megaphone, 
  ArrowRight,
  MapPin,
  CheckCircle
} from '@phosphor-icons/react';

export const VolunteerHomePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState<RankProgressData | null>(null);
  const [nextActivity, setNextActivity] = useState<Activity | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [prog, acts, enrolls, ancs] = await Promise.all([
          api.getRankProgress(user.id),
          api.getAllActivities(),
          api.getEnrollmentsForUser(user.id),
          api.getAnnouncements(profile?.rank || 'member'),
        ]);

        setProgress(prog);
        setAnnouncements(ancs.slice(0, 3));

        // Find upcoming activity that user joined
        const userJoinedIds = enrolls
          .filter((e) => e.status === 'joined')
          .map((e) => e.activityId);
        const upcomingJoined = acts.find((a) => userJoinedIds.includes(a.id));
        setNextActivity(upcomingJoined || acts.find((a) => a.status === 'in_progress' || a.status === 'open') || null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user, profile]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-44" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Volunteer Trail Header */}
      <div className="border border-[#D5DAE1] bg-white rounded-[10px] p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5DAE1] pb-5">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.fullName || user?.username || 'Volunteer'}
              photoUrl={profile?.photoUrl}
              rank={profile?.rank || 'member'}
              size="lg"
              showRankBadge
            />
            <div className="space-y-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-ink-primary leading-tight">
                Good morning, {profile?.fullName || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                <StatusMark status={profile?.rank || 'member'} size="sm" />
                <span className="font-semibold text-ink-secondary text-[13px]">
                  ID: {profile?.volunteerNumber || 'VTS-AA-2026'}
                </span>
                <span className="text-[#D5DAE1]">•</span>
                <span className="text-[13px] text-ink-secondary">
                  {profile?.area || 'Addis Ababa'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<QrCode className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/check-in')}
            >
              Check-in code
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<IdentificationCard className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/id-card')}
            >
              Volunteer ID pass
            </Button>
          </div>
        </div>

        {/* Quick Rank Progression Strip */}
        {progress && progress.nextRank && (
          <div className="pt-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="text-[13px] font-semibold text-ink-secondary">
                Next rank
              </span>
              <h3 className="font-display text-2xl font-bold text-ink-primary">
                {formatRank(progress.nextRank)}
              </h3>
              <p className="text-[13px] text-ink-secondary">
                {progress.isEligible
                  ? 'All requirements met. You are ready for promotion review.'
                  : `${Math.max(0, progress.targetHours - progress.approvedHours)} hours left to reach next rank.`}
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <ProgressMeter
                label="Approved service hours"
                current={progress.approvedHours}
                target={progress.targetHours}
                unit="hrs"
                color="green"
              />
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-secondary">
                  Completed activities: <strong className="text-ink-primary">{progress.completedActivities} / {progress.targetActivities}</strong>
                </span>
                <Link
                  to="/volunteer/rank-progress"
                  className="font-semibold text-ink-primary hover:underline flex items-center gap-1"
                >
                  <span>Detailed breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout: Next Activity & Community Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next / Featured Activity */}
        <div className="border border-[#D5DAE1] bg-white rounded-[10px] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-role-volunteer" weight="bold" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Next field activity
                </h3>
              </div>
              {nextActivity && <StatusMark status={nextActivity.status} size="sm" />}
            </div>

            {nextActivity ? (
              <div className="space-y-3">
                <h4 className="font-display text-2xl font-bold text-ink-primary leading-tight">
                  {nextActivity.title}
                </h4>
                <p className="text-sm text-ink-secondary leading-relaxed line-clamp-3">
                  {nextActivity.description}
                </p>

                <div className="space-y-1.5 pt-2 text-[13px] text-ink-secondary">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink-tertiary" />
                    <span>
                      {new Date(nextActivity.startsAt).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ink-tertiary" />
                    <span>{nextActivity.place}, {nextActivity.area}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-secondary py-4">
                You are not currently enrolled in an upcoming activity.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-[#D5DAE1] flex items-center justify-between">
            <Link
              to={nextActivity ? `/volunteer/activities/${nextActivity.id}` : '/volunteer/activities'}
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1"
            >
              <span>View activity details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<QrCode className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/check-in')}
            >
              Check in
            </Button>
          </div>
        </div>

        {/* Community Announcements */}
        <div className="border border-[#D5DAE1] bg-white rounded-[10px] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-role-teamlead" weight="bold" />
              <h3 className="font-display text-xl font-bold text-ink-primary">
                Community announcements
              </h3>
            </div>
            <span className="text-[13px] font-semibold text-ink-secondary">
              Latest updates
            </span>
          </div>

          <div className="space-y-4 divide-y divide-[#D5DAE1]/60">
            {announcements.map((anc) => (
              <div key={anc.id} className="pt-3 first:pt-0 space-y-1">
                <div className="flex items-center justify-between text-[13px] text-ink-secondary">
                  <span>From: {anc.authorName}</span>
                  <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-ink-primary leading-snug">
                  {anc.title}
                </h4>
                <p className="text-[13px] text-ink-secondary leading-relaxed line-clamp-2">
                  {anc.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Announcement, Enrollment } from '../../types';
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
  CheckCircle,
  UsersThree
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
      <div
        className="border-2 border-ink-primary bg-white p-6 md:p-8 shadow-ticket space-y-4"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-5">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.fullName || user?.username || 'Volunteer'}
              photoUrl={profile?.photoUrl}
              rank={profile?.rank || 'member'}
              size="lg"
              showRankBadge
            />
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold text-role-volunteer uppercase tracking-tight block">
                Volunteer Elevation Track
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink-primary leading-none">
                Good morning, {profile?.fullName || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusMark status={profile?.rank || 'member'} size="sm" />
                <span className="font-mono text-xs font-bold text-ink-tertiary">
                  ID: {profile?.volunteerNumber || 'VTS-AA-2026'}
                </span>
                <span className="text-border">•</span>
                <span className="font-sans text-xs font-semibold text-ink-secondary">
                  {profile?.area || 'Addis Ababa'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<QrCode className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/check-in')}
            >
              Check-In Code
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<IdentificationCard className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/id-card')}
            >
              My Volunteer Pass
            </Button>
          </div>
        </div>

        {/* Quick Rank Progression Strip */}
        {progress && progress.nextRank && (
          <div className="pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold text-ink-tertiary uppercase block">
                Next Altitude Station
              </span>
              <h3 className="font-display text-3xl font-black uppercase text-ink-primary">
                {progress.nextRank.replace('_', ' ')}
              </h3>
              <p className="font-sans text-xs text-ink-secondary">
                {progress.isEligible
                  ? 'All thresholds met! You are eligible for promotion review.'
                  : `${Math.max(0, progress.targetHours - progress.approvedHours)} hours left to reach next camp.`}
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <ProgressMeter
                label="Approved Service Hours"
                current={progress.approvedHours}
                target={progress.targetHours}
                unit="hrs"
                color="green"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-ink-secondary">
                  Completed Activities: <strong>{progress.completedActivities} / {progress.targetActivities}</strong>
                </span>
                <Link
                  to="/volunteer/rank-progress"
                  className="font-sans font-semibold text-ink-primary hover:underline flex items-center gap-1"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Next / Featured Activity (Ticket Silhouette) */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-5 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-role-volunteer" weight="bold" />
                <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
                  Next Field Activity
                </h3>
              </div>
              {nextActivity && <StatusMark status={nextActivity.status} size="sm" />}
            </div>

            {nextActivity ? (
              <div className="space-y-3">
                <h4 className="font-display text-2xl font-black uppercase text-ink-primary leading-tight">
                  {nextActivity.title}
                </h4>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed line-clamp-3">
                  {nextActivity.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs font-mono text-ink-secondary">
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
              <p className="text-xs font-sans text-ink-tertiary">
                You are not currently enrolled in an upcoming activity.
              </p>
            )}
          </div>

          <div className="pt-4 border-t-2 border-dashed border-border flex items-center justify-between">
            <Link
              to={nextActivity ? `/volunteer/activities/${nextActivity.id}` : '/volunteer/activities'}
              className="font-sans text-xs font-bold text-ink-secondary hover:text-ink-primary"
            >
              View Activity Details &rarr;
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<QrCode className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/check-in')}
            >
              Check In
            </Button>
          </div>
        </div>

        {/* Community Announcements */}
        <div className="border-2 border-ink-primary bg-white p-6 space-y-4 shadow-ticket">
          <div className="flex items-center justify-between border-b-2 border-border pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-role-teamlead" weight="bold" />
              <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
                Trail Notices
              </h3>
            </div>
            <span className="font-sans text-xs font-bold text-ink-tertiary">
              Latest updates
            </span>
          </div>

          <div className="space-y-4 divide-y divide-border">
            {announcements.map((anc) => (
              <div key={anc.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-ink-tertiary font-mono">
                  <span>From: {anc.authorName} ({anc.authorRole})</span>
                  <span>{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-ink-primary leading-snug">
                  {anc.title}
                </h4>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed line-clamp-2">
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

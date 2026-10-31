import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Announcement, Enrollment } from '../../types';
import { RankProgressData } from '../../api/promotions';
import { Button, StatusMark, ProgressMeter, Skeleton, Avatar, StatNumber } from '../../components/ui';
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
      {/* 1. HERO CARD: THE RANK JOURNEY */}
      <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.fullName || user?.username || 'Volunteer'}
              photoUrl={profile?.photoUrl}
              rank={profile?.rank || 'member'}
              size="lg"
              showRankBadge
            />
            <div className="space-y-1">
              <span className="font-sans text-xs font-semibold text-brand block">
                Volunteer Elevation Track
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-none">
                Good morning, {profile?.fullName || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <StatusMark status={profile?.rank || 'member'} size="sm" />
                <span className="text-slate-300">•</span>
                <span className="font-mono text-xs text-slate-500">
                  {profile?.volunteerNumber || 'VTS-AA-2026-0042'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-sans text-xs text-slate-500">
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
              Check In
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<IdentificationCard className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/volunteer/id-card')}
            >
              ID Pass
            </Button>
          </div>
        </div>

        {/* Rank Progression Track */}
        {progress && progress.nextRank && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="space-y-1.5">
              <span className="font-sans text-xs font-semibold text-slate-400 block">
                Next Waypoint Station
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {progress.nextRank.replace('_', ' ')}
              </h3>
              <p className="font-sans text-xs text-slate-500 leading-relaxed">
                {progress.isEligible
                  ? 'All criteria met. You are eligible for promotion review.'
                  : `${Math.max(0, progress.targetHours - progress.approvedHours)} hours left to reach next camp.`}
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              <ProgressMeter
                label="Approved Service Hours"
                current={progress.approvedHours}
                target={progress.targetHours}
                unit="hrs"
                roleColor="#0D5C46"
              />
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-sans text-slate-600">
                  Completed Activities: <strong className="font-semibold text-slate-900">{progress.completedActivities} / {progress.targetActivities}</strong>
                </span>
                <Link
                  to="/volunteer/rank-progress"
                  className="font-sans font-semibold text-brand hover:underline flex items-center gap-1"
                >
                  <span>View journey breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. SECONDARY FLAT TINTED TILES OF DIFFERENT SIZES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Activity Ticket (Span 2) */}
        <div className="lg:col-span-2 bg-slate-50 rounded-[24px] p-8 space-y-6 border border-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand" weight="bold" />
                <span className="font-display text-lg font-bold text-slate-900">
                  Your Next Activity
                </span>
              </div>
              {nextActivity && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
                  {nextActivity.area}
                </span>
              )}
            </div>

            {nextActivity ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
                    {nextActivity.title}
                  </h3>
                  <p className="font-sans text-xs text-slate-500 mt-1 leading-relaxed">
                    {nextActivity.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded-[14px] border border-slate-200/80">
                    <span className="text-[11px] text-slate-400 block">Date & Time</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {new Date(nextActivity.startsAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-[14px] border border-slate-200/80">
                    <span className="text-[11px] text-slate-400 block">Location</span>
                    <span className="text-xs font-semibold text-slate-800 truncate block">
                      {nextActivity.place}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-[14px] border border-slate-200/80">
                    <span className="text-[11px] text-slate-400 block">Service Area</span>
                    <span className="text-xs font-semibold text-slate-800">
                      {nextActivity.area}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-500">
                You are not currently enrolled in an active event.
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-200/80">
            <span className="text-xs text-slate-500">
              Check in on arrival using the 4-digit team pin.
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/volunteer/activities')}
              rightIcon={<ArrowRight className="w-4 h-4" weight="bold" />}
            >
              Browse Activities
            </Button>
          </div>
        </div>

        {/* Community Announcements Bulletins (Span 1) */}
        <div className="bg-slate-50 rounded-[24px] p-8 space-y-5 border border-slate-100 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-brand" weight="bold" />
                <span className="font-display text-lg font-bold text-slate-900">
                  Bulletins
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase">
                Announcements
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="p-3.5 bg-white rounded-[16px] border border-slate-200/80 space-y-1 shadow-2xs"
                >
                  <h4 className="font-sans text-xs font-semibold text-slate-900 leading-snug">
                    {anc.title}
                  </h4>
                  <p className="font-sans text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                    {anc.body}
                  </p>
                  <span className="font-sans text-[10px] text-slate-400 block pt-1">
                    {new Date(anc.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/volunteer/certificates"
              className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
            >
              <span>View your earned certificates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

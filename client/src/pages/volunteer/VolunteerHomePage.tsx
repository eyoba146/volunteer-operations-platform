import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, Announcement, Enrollment } from '../../types';
import { formatRank } from '../../utils/format';
import { RankProgressData } from '../../api/promotions';
import { Button, StatusMark, ProgressMeter, Skeleton, Avatar, TopoBackdrop, TrailMeter, TicketCard, PageShell } from '../../components/ui';
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
          api.getAnnouncements(profile?.rank || 'volunteer'),
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
      <PageShell page="volunteer/home" signature="TrailMeter, TicketCard, TopoBackdrop">
        <div className="space-y-6">
          <Skeleton variant="text" className="h-8 w-1/3" />
          <Skeleton variant="rect" className="h-44" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton variant="rect" className="h-64" />
            <Skeleton variant="rect" className="h-64" />
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell page="volunteer/home" signature="TrailMeter, TicketCard, TopoBackdrop">
    <div className="space-y-8">
      {/* Volunteer Trail Header with TopoBackdrop and TrailMeter */}
      <div className="relative rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] overflow-hidden p-6 md:p-8 space-y-6">
        <TopoBackdrop color="#15803D" opacity={0.07} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.fullName || user?.username || 'Volunteer'}
              photoUrl={profile?.photoUrl}
              rank={profile?.rank || 'volunteer'}
              size="lg"
              showRankBadge
            />
            <div className="space-y-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-ink-primary leading-tight">
                Good morning, {profile?.fullName || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                <StatusMark status={profile?.rank || 'volunteer'} size="sm" />
                <span className="font-semibold text-ink-secondary text-[13px]">
                  ID: {profile?.volunteerNumber || 'VTS-AA-2026'}
                </span>
                <span className="text-[#CBD2DA]">•</span>
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

        {/* TrailMeter Route Progression */}
        <div className="relative z-10 pt-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-ink-secondary">
              Your service route
            </span>
            <Link
              to="/volunteer/rank-progress"
              className="text-[13px] font-semibold text-role-volunteer hover:underline flex items-center gap-1"
            >
              <span>View full progress board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <TrailMeter
            variant="full"
            currentHours={progress?.approvedHours || 16.5}
            currentRank={profile?.rank || 'volunteer'}
            userName={profile?.fullName}
          />
        </div>
      </div>

      {/* Two Column Layout: Next Activity as TicketCard & Community Bulletins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Next / Featured Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Next field activity
            </h3>
            <Link
              to="/volunteer/activities"
              className="text-[13px] font-semibold text-role-volunteer hover:underline flex items-center gap-1"
            >
              <span>Browse all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {nextActivity ? (
            <TicketCard activity={nextActivity} />
          ) : (
            <div className="rounded-[16px] bg-[#F7F8FA] p-8 text-center space-y-3">
              <Calendar className="w-8 h-8 text-ink-tertiary mx-auto" />
              <p className="text-[13px] text-ink-secondary">
                You are not currently enrolled in an upcoming activity.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/volunteer/activities')}
              >
                Browse opportunities
              </Button>
            </div>
          )}
        </div>

        {/* Community Announcements */}
        <div className="rounded-[16px] bg-[#F7F8FA] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-role-volunteer" weight="bold" />
              <h3 className="font-display text-xl font-bold text-ink-primary">
                Program announcements
              </h3>
            </div>
            <span className="font-mono text-[13px] text-ink-tertiary">
              {announcements.length} notice{announcements.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-[12px] bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] space-y-1.5"
              >
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-semibold text-role-volunteer">
                    {ann.authorName}
                  </span>
                  <span className="font-mono text-ink-tertiary">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-sans font-bold text-ink-primary text-sm">
                  {ann.title}
                </h4>
                <p className="text-[13px] text-ink-secondary leading-relaxed">
                  {ann.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageShell>
  );
};

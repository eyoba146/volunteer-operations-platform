import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, HoursEntry } from '../../types';
import { Button, StatusMark, Skeleton, Avatar } from '../../components/ui';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Plus, 
  UsersThree, 
  QrCode, 
  Star, 
  ChartLineUp, 
  ArrowRight,
  Megaphone,
  MapPin,
  Key
} from '@phosphor-icons/react';

export const TeamLeadHomePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [leadActivities, setLeadActivities] = useState<Activity[]>([]);
  const [pendingHours, setPendingHours] = useState<HoursEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const [acts, hours] = await Promise.all([
          api.getAllActivities(),
          api.getPendingHours(user.id),
        ]);
        const myActs = acts.filter((a) => a.leadId === user.id);
        setLeadActivities(myActs);
        setPendingHours(hours);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </div>
    );
  }

  const todayAct = leadActivities.find((a) => a.status === 'in_progress' || a.status === 'open');

  return (
    <div className="space-y-8">
      {/* Team Lead Dispatch Header */}
      <div
        className="border-2 border-ink-primary bg-white p-6 sm:p-8 shadow-ticket space-y-4"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border pb-5">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.fullName || user?.username || 'Team Lead'}
              photoUrl={profile?.photoUrl}
              rank="team_lead"
              size="lg"
              showRankBadge
            />
            <div className="space-y-1">
              <span className="font-sans text-xs font-bold text-role-teamlead uppercase tracking-tight block">
                Field Coordination Operations
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-ink-primary leading-none">
                Dispatch Desk: {profile?.fullName || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="font-mono font-bold px-2 py-0.5 bg-role-teamlead text-white uppercase">
                  Team Lead
                </span>
                <span className="text-border">•</span>
                <span className="font-mono text-ink-secondary">
                  ID: {profile?.volunteerNumber || 'VTS-TL-2026'}
                </span>
                <span className="text-border">•</span>
                <span className="font-sans font-semibold text-ink-secondary">
                  {profile?.area || 'Addis Ababa Hub'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/create-activity')}
            >
              Post New Activity
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<CheckCircle className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/approve-hours')}
            >
              Approve Hours ({pendingHours.length})
            </Button>
          </div>
        </div>

        {/* Connected Metric Strip (Never floating 4-cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-ink-primary border-2 border-ink-primary bg-canvas font-mono">
          <div className="p-4 space-y-1">
            <span className="text-xs font-bold uppercase text-ink-tertiary block">
              Hours Awaiting Decision
            </span>
            <div className="font-display text-4xl font-black text-role-teamlead leading-none">
              {pendingHours.length} <span className="font-mono text-xs font-normal text-ink-secondary">claims</span>
            </div>
            <span className="text-[11px] text-ink-secondary font-sans block">
              Volunteers awaiting verified hours
            </span>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-xs font-bold uppercase text-ink-tertiary block">
              Activities Under My Leadership
            </span>
            <div className="font-display text-4xl font-black text-ink-primary leading-none">
              {leadActivities.length} <span className="font-mono text-xs font-normal text-ink-secondary">programs</span>
            </div>
            <span className="text-[11px] text-ink-secondary font-sans block">
              Active community field sessions
            </span>
          </div>

          <div className="p-4 space-y-1">
            <span className="text-xs font-bold uppercase text-ink-tertiary block">
              Assigned Regional Hub
            </span>
            <div className="font-display text-2xl font-black text-ink-primary leading-none pt-2 uppercase">
              {profile?.area || 'Addis Ababa'}
            </div>
            <span className="text-[11px] text-ink-secondary font-sans block">
              Primary operational deployment area
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Active Session & Quick Field Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Active Session Pass & Check-In Code Display */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-5 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-role-teamlead" weight="bold" />
                <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
                  Today's Field Session
                </h3>
              </div>
              {todayAct && <StatusMark status={todayAct.status} size="sm" />}
            </div>

            {todayAct ? (
              <div className="space-y-3">
                <h4 className="font-display text-2xl font-black uppercase text-ink-primary leading-tight">
                  {todayAct.title}
                </h4>
                <p className="font-sans text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                  {todayAct.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-ink-secondary">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink-tertiary" />
                    <span>
                      {new Date(todayAct.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {new Date(todayAct.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-ink-tertiary" />
                    <span>{todayAct.place}, {todayAct.area}</span>
                  </div>
                </div>

                {/* Session Check-In Code Highlight for Volunteers */}
                <div className="p-4 bg-canvas border-2 border-ink-primary flex items-center justify-between gap-4 mt-2">
                  <div className="space-y-0.5">
                    <span className="font-sans text-[11px] font-bold text-ink-tertiary uppercase block">
                      Volunteer Check-In Code
                    </span>
                    <span className="font-sans text-xs text-ink-secondary">
                      Show this 4-digit code to arriving volunteers:
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-ink-primary text-white font-mono text-2xl font-black tracking-widest border border-black shadow-sm">
                    {todayAct.checkInCode}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs font-sans text-ink-secondary py-4">
                No active assignment scheduled for today. You can schedule a new activity or manage existing ones.
              </div>
            )}
          </div>

          <div className="pt-4 border-t-2 border-dashed border-border flex items-center justify-between">
            <Link
              to="/team-lead/activities"
              className="font-sans text-xs font-bold text-ink-secondary hover:text-ink-primary"
            >
              View Full Team Roster &rarr;
            </Link>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Star className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/ratings')}
            >
              Rate Participants
            </Button>
          </div>
        </div>

        {/* Quick Operations & Tools */}
        <div className="border-2 border-ink-primary bg-white p-6 space-y-5 shadow-ticket">
          <div className="border-b-2 border-border pb-3">
            <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
              Lead Responsibilities & Actions
            </h3>
            <p className="font-sans text-xs text-ink-secondary mt-1">
              Field governance workflows assigned to your rank.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/team-lead/approve-hours"
              className="p-4 border-2 border-ink-primary bg-canvas hover:bg-white hover:-rotate-[0.3deg] transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-role-teamlead text-white flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" weight="bold" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-black uppercase text-ink-primary group-hover:text-role-teamlead transition-colors">
                    Approve Service Hours
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary">
                    Review and verify on-site attendance and manual claims.
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 bg-ink-primary text-white">
                {pendingHours.length} waiting
              </span>
            </Link>

            <Link
              to="/team-lead/ratings"
              className="p-4 border-2 border-ink-primary bg-canvas hover:bg-white hover:-rotate-[0.3deg] transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-role-applicant text-ink-primary flex items-center justify-center font-bold">
                  <Star className="w-5 h-5" weight="fill" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-black uppercase text-ink-primary group-hover:text-role-teamlead transition-colors">
                    Rate Volunteer Attendance
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary">
                    Award 1 to 5 stars for dedication and teamwork.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary" weight="bold" />
            </Link>

            <Link
              to="/team-lead/recommend-promotion"
              className="p-4 border-2 border-ink-primary bg-canvas hover:bg-white hover:-rotate-[0.3deg] transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-role-volunteer text-white flex items-center justify-center font-bold">
                  <ChartLineUp className="w-5 h-5" weight="bold" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-black uppercase text-ink-primary group-hover:text-role-teamlead transition-colors">
                    Recommend Early Promotion
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary">
                    Nominate exceptional volunteers with a written recommendation.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary" weight="bold" />
            </Link>

            <Link
              to="/team-lead/announcements"
              className="p-4 border-2 border-ink-primary bg-canvas hover:bg-white hover:-rotate-[0.3deg] transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ink-primary text-white flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" weight="bold" />
                </div>
                <div>
                  <h4 className="font-display text-xl font-black uppercase text-ink-primary group-hover:text-role-teamlead transition-colors">
                    Broadcast Team Notice
                  </h4>
                  <p className="font-sans text-xs text-ink-secondary">
                    Send instructions or reminders to activity rosters.
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary" weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

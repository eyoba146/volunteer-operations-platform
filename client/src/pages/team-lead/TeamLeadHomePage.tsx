import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, HoursEntry } from '../../types';
import { Button, StatusMark, Skeleton, Avatar, TopoBackdrop, TicketCard } from '../../components/ui';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Plus, 
  UsersThree, 
  QrCode, 
  ArrowRight,
  MapPin
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
      {/* Team Lead Dispatch Header with TopoBackdrop */}
      <div className="relative rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] overflow-hidden p-6 sm:p-8 space-y-6">
        <TopoBackdrop color="#DC2626" opacity={0.06} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
          <div className="flex items-center gap-4">
            <Avatar
              name={profile?.fullName || user?.username || 'Team Lead'}
              photoUrl={profile?.photoUrl}
              rank="team_lead"
              size="lg"
              showRankBadge
            />
            <div className="space-y-1">
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight text-ink-primary leading-tight">
                Welcome, {profile?.fullName || user?.username}
              </h1>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
                <span className="font-semibold text-[13px] px-2 py-0.5 rounded-[4px] bg-role-teamlead text-white">
                  Team lead
                </span>
                <span className="text-[#CBD2DA]">•</span>
                <span className="text-ink-secondary text-[13px]">
                  ID: {profile?.volunteerNumber || 'VTS-TL-2026'}
                </span>
                <span className="text-[#CBD2DA]">•</span>
                <span className="text-ink-secondary text-[13px]">
                  {profile?.area || 'Addis Ababa'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/create-activity')}
            >
              Post new activity
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<CheckCircle className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/team-lead/approve-hours')}
            >
              Approve hours ({pendingHours.length})
            </Button>
          </div>
        </div>

        {/* Lead Numeral + Simple Inline List on White */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-4xl sm:text-5xl text-role-teamlead leading-none">
              {pendingHours.length}
            </span>
            <div>
              <span className="text-base font-bold text-ink-primary block leading-tight">
                Hours awaiting decision
              </span>
              <span className="text-[13px] text-ink-secondary">
                Submitted hours claims from your activity sessions
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm pt-2 md:pt-0">
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Supervised activities</span>
              <span className="text-xl font-bold text-ink-primary">
                {leadActivities.length}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Assigned community area</span>
              <span className="text-xl font-bold text-ink-primary">
                {profile?.area || 'Addis Ababa'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Session & Quick Field Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Active Session Pass & Check-In Code */}
        <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-role-teamlead" weight="bold" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Today's field session
                </h3>
              </div>
              {todayAct && <StatusMark status={todayAct.status} size="sm" />}
            </div>

            {todayAct ? (
              <div className="space-y-3">
                <h4 className="font-display text-2xl font-bold text-ink-primary leading-tight">
                  {todayAct.title}
                </h4>
                <p className="text-sm text-ink-secondary line-clamp-2 leading-relaxed">
                  {todayAct.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[13px] text-ink-secondary">
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
                <div className="p-4 bg-[#F7F8FA] rounded-[12px] flex items-center justify-between gap-4 mt-2">
                  <div className="space-y-0.5">
                    <span className="font-sans text-[13px] font-bold text-ink-secondary block">
                      Volunteer check-in code
                    </span>
                    <span className="font-sans text-[13px] text-ink-secondary">
                      Show this 4-digit code to arriving volunteers:
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-ink-primary text-white font-mono text-2xl font-bold tracking-widest rounded-[8px]">
                    {todayAct.checkInCode}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-secondary py-6">
                You do not have an active field activity scheduled for today.
              </p>
            )}
          </div>

          <div className="pt-3">
            <Link
              to={todayAct ? `/team-lead/roster/${todayAct.id}` : '/team-lead/activities'}
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>Open attendance roster</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Pending Hours Approvals Card */}
        <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-role-teamlead" weight="bold" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Hours approval queue
                </h3>
              </div>
              <span className="text-[13px] font-semibold text-ink-secondary">
                {pendingHours.length} pending
              </span>
            </div>

            {pendingHours.length === 0 ? (
              <p className="text-sm text-ink-secondary py-6 text-center">
                All submitted volunteer hours have been reviewed and approved.
              </p>
            ) : (
              <div className="space-y-2">
                {pendingHours.slice(0, 3).map((h) => (
                  <div key={h.id} className="py-2.5 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <span className="font-bold text-ink-primary block">
                        {h.userName || 'Volunteer'}
                      </span>
                      <span className="text-ink-secondary text-[13px] block">
                        {h.activityTitle || 'Field Activity'} • {Math.round(h.minutes / 60)} hours claimed
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/team-lead/approve-hours')}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3">
            <Link
              to="/team-lead/approve-hours"
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>Review full hours queue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

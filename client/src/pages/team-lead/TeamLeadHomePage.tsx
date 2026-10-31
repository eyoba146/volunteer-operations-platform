import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Activity, HoursEntry } from '../../types';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  Plus, 
  UsersThree, 
  QrCode, 
  Star, 
  ChartLineUp, 
  ArrowRight 
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
      {/* Editorial Header */}
      <div className="border border-border bg-canvas-raised p-6 md:p-8 space-y-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
              FIELD COORDINATION DESK
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
              Welcome, Team Lead {profile?.fullName || user?.username}
            </h1>
            <p className="font-sans text-xs text-ink-secondary">
              Managing community assignments, verifying attendance, and recommending volunteer advancement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/team-lead/create-activity')}
            >
              Post New Activity
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<CheckCircle className="w-4 h-4" />}
              onClick={() => navigate('/team-lead/approve-hours')}
            >
              Review Hours ({pendingHours.length})
            </Button>
          </div>
        </div>

        {/* Operational Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono text-xs">
          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase">Hours Awaiting Decision</span>
            <div className="text-2xl font-bold text-[#784E0B]">
              {pendingHours.length} <span className="text-xs font-normal text-ink-tertiary">claims</span>
            </div>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase">Activities Under Leadership</span>
            <div className="text-2xl font-bold text-ink-primary">
              {leadActivities.length} <span className="text-xs font-normal text-ink-tertiary">programs</span>
            </div>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase">Active Field Area</span>
            <div className="text-lg font-bold text-civic-green font-sans">
              {profile?.area || 'Regional Outposts'}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Active Session & Hours Waiting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Active Activity & Check-In Code Reveal */}
        <div className="border border-border bg-canvas-raised p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-civic-green" weight="bold" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  Today's Field Assignment
                </h3>
              </div>
              {todayAct && <StatusMark status={todayAct.status} size="sm" />}
            </div>

            {todayAct ? (
              <div className="space-y-3">
                <h4 className="font-serif text-xl font-bold text-ink-primary">
                  {todayAct.title}
                </h4>
                <p className="font-sans text-xs text-ink-secondary leading-relaxed">
                  {todayAct.description}
                </p>

                {/* Prominent Check-In Code for Volunteers */}
                <div className="border-2 border-dashed border-civic-green bg-civic-greenLight p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase font-bold text-civic-green block">
                      Volunteer Check-In Code
                    </span>
                    <span className="font-sans text-xs text-ink-secondary">
                      Show this 4-digit code to participants on site:
                    </span>
                  </div>
                  <div className="font-mono text-3xl font-extrabold tracking-widest text-civic-green px-3 py-1 bg-canvas-raised border border-civic-green/40">
                    {todayAct.checkInCode}
                  </div>
                </div>

                <div className="text-xs font-mono text-ink-tertiary space-y-1">
                  <div>Venue: <strong className="text-ink-primary">{todayAct.place}</strong></div>
                  <div>Roster Capacity: <strong className="text-ink-primary">{todayAct.capacity} volunteers</strong></div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-sans text-ink-tertiary">
                No active assignment scheduled for today.
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Link
              to="/team-lead/activities"
              className="text-xs font-semibold text-ink-primary hover:underline"
            >
              View Full Team Activities Roster
            </Link>
            {todayAct && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/team-lead/ratings')}
                leftIcon={<Star className="w-4 h-4" />}
              >
                Rate Participants
              </Button>
            )}
          </div>
        </div>

        {/* Pending Hours Review Quick Box */}
        <div className="border border-border bg-canvas-raised p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#784E0B]" weight="bold" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  Hours Waiting for Your Approval
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-tertiary">
                {pendingHours.length} awaiting
              </span>
            </div>

            {pendingHours.length === 0 ? (
              <p className="text-xs font-sans text-ink-tertiary py-6 text-center">
                All participant hours for your activities have been reviewed and decided.
              </p>
            ) : (
              <div className="space-y-3 divide-y divide-border/60">
                {pendingHours.slice(0, 3).map((h) => (
                  <div key={h.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-ink-primary block">{h.userName}</span>
                      <span className="text-[11px] text-ink-tertiary">{h.activityTitle}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-ink-primary">{Math.round((h.minutes / 60) * 10) / 10} hrs</span>
                      <span className="block text-[10px] text-ink-tertiary">{h.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/team-lead/approve-hours')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Hours Approval Queue
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/team-lead/recommend-promotion')}
              leftIcon={<ChartLineUp className="w-4 h-4" />}
            >
              Recommend Promotion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


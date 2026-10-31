import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, Promotion, Activity } from '../../types';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { 
  ClipboardText, 
  UsersThree, 
  Clock, 
  Calendar, 
  ChartLineUp, 
  ArrowRight,
  Sparkle,
  CheckCircle,
  Eye
} from '@phosphor-icons/react';

export const ManagerDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<{
    waitingApplications: number;
    newVolunteersThisMonth: number;
    approvedHoursThisMonth: number;
    upcomingActivities: number;
    promotionsWaiting: number;
  } | null>(null);

  const [pendingApplications, setPendingApplications] = useState<Application[]>([]);
  const [pendingPromotions, setPendingPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [st, apps, promos] = await Promise.all([
          api.getManagerOverviewStats(),
          api.getAllApplications({ status: 'submitted' }),
          api.getEligiblePromotions(),
        ]);
        setStats(st);
        setPendingApplications(apps.slice(0, 4));
        setPendingPromotions(promos.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton variant="text" className="h-10 w-1/3" />
        <Skeleton variant="rect" className="h-40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Editorial Header */}
      <div className="border-4 border-ink-primary bg-white p-6 md:p-8 space-y-5 shadow-ticket">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-role-manager block">
              Program Operations Desk
            </span>
            <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Admissions & Operations Overview
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Review applicant intake, evaluate promotion boards, and supervise fieldwork across 5 regions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="teal"
              size="sm"
              leftIcon={<ClipboardText className="w-4 h-4" />}
              onClick={() => navigate('/manager/applications')}
            >
              Application Queue ({stats?.waitingApplications})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ChartLineUp className="w-4 h-4" />}
              onClick={() => navigate('/manager/promotions')}
            >
              Promotions ({stats?.promotionsWaiting})
            </Button>
          </div>
        </div>

        {/* Operational Dispatch Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-sans text-xs">
          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[11px] block">Awaiting Review</span>
            <div className="font-display text-4xl font-black text-role-applicant leading-none">
              {stats?.waitingApplications || 0}
            </div>
            <span className="text-[11px] text-ink-secondary block">
              New candidates
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[11px] block">Promotions Waiting</span>
            <div className="font-display text-4xl font-black text-role-teamlead leading-none">
              {stats?.promotionsWaiting || 0}
            </div>
            <span className="text-[11px] text-ink-secondary block">
              Eligible candidates
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[11px] block">Activated Members</span>
            <div className="font-display text-4xl font-black text-role-volunteer leading-none">
              +{stats?.newVolunteersThisMonth || 0}
            </div>
            <span className="text-[11px] text-ink-secondary block">
              This month
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[11px] block">Approved Hours</span>
            <div className="font-display text-4xl font-black text-ink-primary leading-none">
              {stats?.approvedHoursThisMonth || 0}
            </div>
            <span className="text-[11px] text-ink-secondary block">
              Verified service hrs
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-ink-tertiary font-bold text-[11px] block">Open Activities</span>
            <div className="font-display text-4xl font-black text-ink-primary leading-none">
              {stats?.upcomingActivities || 0}
            </div>
            <span className="text-[11px] text-ink-secondary block">
              Across regions
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Applications & Pending Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications Waiting */}
        <div className="border-2 border-ink-primary bg-white p-6 space-y-5 flex flex-col justify-between shadow-ticket">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ClipboardText className="w-5 h-5 text-ink-primary" weight="bold" />
                <h3 className="font-display text-xl font-black uppercase text-ink-primary">
                  Applications Requiring Evaluation
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-tertiary font-bold">
                {pendingApplications.length} unreviewed
              </span>
            </div>

            {pendingApplications.length === 0 ? (
              <p className="text-xs font-sans text-ink-tertiary py-8 text-center">
                All submitted applications have been reviewed.
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-ink-primary text-sm">
                        {app.formData?.fullName || 'Applicant'}
                      </h4>
                      <span className="text-ink-tertiary text-xs block">
                        {app.formData?.area || 'Addis Ababa'} • Submitted{' '}
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'recently'}
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/manager/applications')}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="teal"
              size="sm"
              className="w-full"
              onClick={() => navigate('/manager/applications')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Full Application Queue
            </Button>
          </div>
        </div>

        {/* Promotions Waiting Board */}
        <div className="border-2 border-ink-primary bg-white p-6 space-y-5 flex flex-col justify-between shadow-ticket">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkle className="w-5 h-5 text-role-teamlead" weight="fill" />
                <h3 className="font-display text-xl font-black uppercase text-ink-primary">
                  Promotions Awaiting Approval
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-tertiary font-bold">
                Board Queue
              </span>
            </div>

            {pendingPromotions.length === 0 ? (
              <p className="text-xs font-sans text-ink-tertiary py-8 text-center">
                No active promotion recommendations waiting for manager decision.
              </p>
            ) : (
              <div className="divide-y divide-border/60">
                {pendingPromotions.map((promo) => (
                  <div key={promo.id} className="py-3.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink-primary text-sm">
                        {promo.userName}
                      </span>
                      <StatusMark status={promo.status} size="sm" />
                    </div>
                    <p className="text-ink-secondary text-xs">
                      Nominated for promotion from <strong className="font-mono uppercase">{promo.fromRank.replace('_', ' ')}</strong> to{' '}
                      <strong className="font-mono uppercase text-role-volunteer font-bold">{promo.toRank.replace('_', ' ')}</strong>.
                    </p>
                    <p className="text-xs text-ink-tertiary italic">
                      "{promo.note}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/manager/promotions')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Promotion Decision Board
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

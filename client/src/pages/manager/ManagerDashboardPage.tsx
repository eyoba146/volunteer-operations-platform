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
      <div className="space-y-6">
        <Skeleton variant="text" className="h-8 w-1/3" />
        <Skeleton variant="rect" className="h-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rect" className="h-64" />
          <Skeleton variant="rect" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border border-border bg-canvas-raised p-6 md:p-8 space-y-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
              PROGRAM OPERATIONS DESK
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
              Manager Operations Overview
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary">
              Reviewing applicant intake, deciding promotion boards, and overseeing field operations across 5 cities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
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
              Promotions Board ({stats?.promotionsWaiting})
            </Button>
          </div>
        </div>

        {/* Operational Dispatch Numbers (Section 6.11 FR-RPT-01) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2 font-mono text-xs">
          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Awaiting Review</span>
            <div className="text-2xl font-bold text-[#784E0B]">
              {stats?.waitingApplications || 0}
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              New applicants
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Promotions Waiting</span>
            <div className="text-2xl font-bold text-civic-gold">
              {stats?.promotionsWaiting || 0}
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              Eligible candidates
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Activated Members</span>
            <div className="text-2xl font-bold text-civic-green">
              +{stats?.newVolunteersThisMonth || 0}
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              This month
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Approved Hours</span>
            <div className="text-2xl font-bold text-ink-primary">
              {stats?.approvedHoursThisMonth || 0} hrs
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              Verified service
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Open Activities</span>
            <div className="text-2xl font-bold text-ink-primary">
              {stats?.upcomingActivities || 0}
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              Across regions
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Urgent Applications & Pending Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications Waiting */}
        <div className="border border-border bg-canvas-raised p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ClipboardText className="w-4 h-4 text-ink-secondary" weight="bold" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  Applications Requiring Evaluation
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-tertiary">
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
                      <h4 className="font-bold text-ink-primary">
                        {app.formData?.fullName || 'Applicant'}
                      </h4>
                      <span className="font-mono text-ink-tertiary text-[11px]">
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
              variant="primary"
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
        <div className="border border-border bg-canvas-raised p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkle className="w-4 h-4 text-civic-gold" weight="fill" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  Promotions Awaiting Approval
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-tertiary">
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
                    <p className="text-ink-secondary text-[11px]">
                      Nominated for promotion from <strong className="font-mono uppercase">{promo.fromRank.replace('_', ' ')}</strong> to{' '}
                      <strong className="font-mono uppercase text-civic-green">{promo.toRank.replace('_', ' ')}</strong>.
                    </p>
                    <p className="text-[11px] text-ink-tertiary italic">
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


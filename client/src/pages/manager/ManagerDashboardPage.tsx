import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, Promotion } from '../../types';
import { Button, StatusMark, Skeleton, TopoBackdrop } from '../../components/ui';
import { 
  ClipboardText, 
  UsersThree, 
  Clock, 
  Calendar, 
  ChartLineUp, 
  ArrowRight,
  Sparkle,
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
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6 border-none">
        <TopoBackdrop color="#2563EB" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#EDEFF2] pb-6">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary">
              Candidate intake and field operations
            </h1>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Review applicant intake, evaluate promotion boards, and supervise field activity rosters across regional teams.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ClipboardText className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/manager/applications')}
            >
              Application queue ({stats?.waitingApplications || 0})
            </Button>
          </div>
        </div>

        {/* Lead Numeral + Simple Inline List on White (Rule 4: NO 4-box rows) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-5xl sm:text-6xl text-role-applicant leading-none">
              {stats?.waitingApplications || 0}
            </span>
            <div>
              <span className="text-base font-bold text-ink-primary block leading-tight">
                Applications awaiting review
              </span>
              <span className="text-[13px] text-ink-secondary">
                Submitted candidate profiles ready for evaluation
              </span>
            </div>
          </div>

          {/* Simple Inline List with subtle dividers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm pt-2 md:pt-0 border-t md:border-t-0 border-[#D5DAE1]">
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Promotions waiting</span>
              <span className="text-xl font-bold text-role-teamlead">
                {stats?.promotionsWaiting || 0}
              </span>
            </div>
            <div className="w-px h-8 bg-[#EDEFF2] hidden sm:block" />
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">New members</span>
              <span className="text-xl font-bold text-role-volunteer">
                +{stats?.newVolunteersThisMonth || 0}
              </span>
            </div>
            <div className="w-px h-8 bg-[#EDEFF2] hidden sm:block" />
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Approved hours</span>
              <span className="text-xl font-bold text-ink-primary">
                {stats?.approvedHoursThisMonth || 0} hrs
              </span>
            </div>
            <div className="w-px h-8 bg-[#EDEFF2] hidden sm:block" />
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Open activities</span>
              <span className="text-xl font-bold text-ink-primary">
                {stats?.upcomingActivities || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Applications & Pending Promotions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Waiting */}
        <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-5 border-none flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-3">
              <div className="flex items-center gap-2">
                <ClipboardText className="w-5 h-5 text-ink-primary" weight="bold" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Applications requiring evaluation
                </h3>
              </div>
              <span className="text-[13px] text-ink-secondary font-semibold">
                {pendingApplications.length} unreviewed
              </span>
            </div>

            {pendingApplications.length === 0 ? (
              <p className="text-sm font-sans text-ink-secondary py-8 text-center">
                All submitted applications have been reviewed.
              </p>
            ) : (
              <div className="divide-y divide-[#EDEFF2]">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div>
                      <h4 className="font-bold text-ink-primary">
                        {app.formData?.fullName || 'Applicant'}
                      </h4>
                      <span className="text-ink-secondary text-[13px] block mt-0.5">
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

          <div className="pt-3 border-t border-[#EDEFF2]">
            <Link
              to="/manager/applications"
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>View full application queue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Promotions Waiting Board */}
        <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-5 border-none flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDEFF2] pb-3">
              <div className="flex items-center gap-2">
                <Sparkle className="w-5 h-5 text-role-teamlead" weight="fill" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Promotions awaiting approval
                </h3>
              </div>
              <span className="text-[13px] text-ink-secondary font-semibold">
                Board queue
              </span>
            </div>

            {pendingPromotions.length === 0 ? (
              <p className="text-sm font-sans text-ink-secondary py-8 text-center">
                No active promotion recommendations waiting for decision.
              </p>
            ) : (
              <div className="divide-y divide-[#EDEFF2]">
                {pendingPromotions.map((promo) => (
                  <div key={promo.id} className="py-3 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink-primary">
                        {promo.userName}
                      </span>
                      <StatusMark status={promo.status} size="sm" />
                    </div>
                    <p className="text-ink-secondary text-[13px]">
                      Recommended from <strong>{promo.fromRank.replace('_', ' ')}</strong> to{' '}
                      <strong className="text-role-volunteer">{promo.toRank.replace('_', ' ')}</strong>
                    </p>
                    <p className="text-[13px] text-ink-secondary italic">
                      "{promo.note}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#EDEFF2]">
            <Link
              to="/manager/promotions"
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>Open promotion decision board</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

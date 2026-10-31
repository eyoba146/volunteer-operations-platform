import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Application, Promotion, Activity } from '../../types';
import { Button, StatusMark, Skeleton, StatNumber } from '../../components/ui';
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
      {/* 1. HERO CARD: APPLICATIONS AWAITING DECISION */}
      <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold text-brand block">
              Program Operations Desk
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              Manager Overview
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-500">
              Overseeing volunteer intake, promotion decisions, and field crews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ClipboardText className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/manager/applications')}
            >
              Review Applications ({stats?.waitingApplications})
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<ChartLineUp className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/manager/promotions')}
            >
              Promotion Board ({stats?.promotionsWaiting})
            </Button>
          </div>
        </div>

        {/* Hero Big Numeral + Secondary Info Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 bg-slate-50 rounded-[20px] space-y-2 border border-slate-100">
            <span className="text-xs font-semibold text-amber-600">Intake Queue</span>
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
              {stats?.waitingApplications || 0}
            </div>
            <span className="text-xs text-slate-500 block">New applicants waiting</span>
          </div>

          <div className="p-6 bg-slate-50 rounded-[20px] space-y-2 border border-slate-100">
            <span className="text-xs font-semibold text-teal-600">Promotion Candidates</span>
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
              {stats?.promotionsWaiting || 0}
            </div>
            <span className="text-xs text-slate-500 block">Ready for board vote</span>
          </div>

          <div className="p-6 bg-slate-50 rounded-[20px] space-y-2 border border-slate-100">
            <span className="text-xs font-semibold text-emerald-600">Activated Volunteers</span>
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
              +{stats?.newVolunteersThisMonth || 0}
            </div>
            <span className="text-xs text-slate-500 block">Joined this month</span>
          </div>

          <div className="p-6 bg-slate-50 rounded-[20px] space-y-2 border border-slate-100">
            <span className="text-xs font-semibold text-slate-700">Verified Service</span>
            <div className="font-display text-4xl sm:text-5xl font-extrabold text-slate-900 leading-none">
              {stats?.approvedHoursThisMonth || 0}
              <span className="text-lg font-sans text-slate-400 font-normal ml-1">hrs</span>
            </div>
            <span className="text-xs text-slate-500 block">Approved field work</span>
          </div>
        </div>
      </div>

      {/* 2. INTAKE & PROMOTION DECISION LISTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applicants Waiting Review */}
        <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardText className="w-5 h-5 text-brand" weight="bold" />
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Applicants Awaiting Review
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {pendingApplications.length} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 bg-slate-50 rounded-[16px] border border-slate-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-sans text-sm font-semibold text-slate-900">
                      {app.formData?.fullName || 'Applicant'}
                    </h4>
                    <span className="font-sans text-xs text-slate-500 block">
                      {app.formData?.area || 'Addis Ababa'} • {app.formData?.skills?.slice(0, 2).join(', ') || 'General'}
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/manager/applications')}
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link
              to="/manager/applications"
              className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
            >
              <span>View full application roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Promotion Candidates Waiting */}
        <div className="bg-white rounded-[24px] shadow-soft border border-slate-100 p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ChartLineUp className="w-5 h-5 text-brand" weight="bold" />
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Promotion Candidates
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {pendingPromotions.length} eligible
              </span>
            </div>

            <div className="space-y-3">
              {pendingPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="p-4 bg-slate-50 rounded-[16px] border border-slate-100 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <h4 className="font-sans text-sm font-semibold text-slate-900">
                      {promo.userName}
                    </h4>
                    <span className="font-sans text-xs text-slate-500 block">
                      Advancing to <strong className="font-semibold text-slate-800">{promo.toRank.replace('_', ' ')}</strong>
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/manager/promotions')}
                  >
                    Decide
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link
              to="/manager/promotions"
              className="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1"
            >
              <span>Open promotion board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

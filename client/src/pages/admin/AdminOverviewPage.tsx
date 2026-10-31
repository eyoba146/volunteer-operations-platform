import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { 
  Gear, 
  ChartLineUp, 
  UsersThree, 
  Scroll, 
  ShieldCheck, 
  ArrowRight,
  ArrowClockwise,
  Envelope,
  Money
} from '@phosphor-icons/react';

export const AdminOverviewPage: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  const [feeSetting, setFeeSetting] = useState(200);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [users, acts, logs, settings] = await Promise.all([
          api.getAllVolunteers(),
          api.getAllActivities(),
          api.getActivityLog(),
          api.getSettings(),
        ]);
        setUserCount(users.length);
        setActivityCount(acts.length);
        setLogCount(logs.length);
        const fee = settings.find((s) => s.key === 'registration_fee');
        if (fee) setFeeSetting(Number(fee.value));
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
    <div className="space-y-8 text-left">
      {/* Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-amber-600 uppercase tracking-tight block">
              Program Operations Directorate
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              System Administration
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Configure program fees, edit dynamic rank qualification rules, manage staff accounts, and inspect system audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Gear className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/admin/settings')}
            >
              Settings & Templates
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ChartLineUp className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/admin/rank-rules')}
            >
              Rank Rules
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<UsersThree className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/admin/accounts')}
            >
              Staff Accounts
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Scroll className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/admin/activity-history')}
            >
              Activity History
            </Button>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans text-xs">
          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px] font-mono block">Registered Volunteers</span>
            <div className="font-display text-4xl font-black text-ink-primary leading-none">
              {userCount}
            </div>
            <span className="text-[11px] text-ink-secondary block">Across 5 regional hubs</span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px] font-mono block">Field Activities</span>
            <div className="font-display text-4xl font-black text-ink-primary leading-none">
              {activityCount}
            </div>
            <span className="text-[11px] text-ink-secondary block">Active & completed rosters</span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px] font-mono block">Registration Fee</span>
            <div className="font-display text-4xl font-black text-civic-green leading-none">
              ETB {feeSetting}<span className="text-xs font-mono font-normal text-ink-tertiary">.00</span>
            </div>
            <span className="text-[11px] text-ink-secondary block">One-time Telebirr activation</span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px] font-mono block">Audit Log Entries</span>
            <div className="font-display text-4xl font-black text-ink-primary leading-none">
              {logCount}
            </div>
            <span className="text-[11px] text-ink-secondary block">Permanent system actions</span>
          </div>
        </div>
      </div>

      {/* Control Panels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-4 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 border-2 border-ink-primary bg-canvas-subdued flex items-center justify-center">
              <Gear className="w-5 h-5 text-ink-primary" weight="bold" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
              Program Settings & Templates
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Configure fee amount, payment deadline, operational areas, volunteer skills list, and edit transactional email templates with live preview.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/settings')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Settings
          </Button>
        </div>

        {/* Rank Rules Panel */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-4 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 border-2 border-ink-primary bg-canvas-subdued flex items-center justify-center">
              <ChartLineUp className="w-5 h-5 text-role-teamlead" weight="bold" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
              Dynamic Rank Qualification Rules
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Adjust minimum hours, activities, ratings, and course requirements. Changes dynamically update volunteer meters and eligibility across the platform.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/rank-rules')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Edit Rank Rules
          </Button>
        </div>

        {/* Staff & User Accounts */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-4 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-2">
            <div className="w-10 h-10 border-2 border-ink-primary bg-canvas-subdued flex items-center justify-center">
              <UsersThree className="w-5 h-5 text-ink-primary" weight="bold" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
              Accounts & Role Assignments
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed">
              Provision new company staff accounts, pause volunteer access, reinstate accounts, and reassign roles across Manager, Finance, and Lead desks.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/accounts')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage Accounts
          </Button>
        </div>
      </div>
    </div>
  );
};

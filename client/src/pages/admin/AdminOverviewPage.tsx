import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { ActivityLogEntry } from '../../types';
import { Button, Skeleton, TopoBackdrop } from '../../components/ui';
import { 
  Gear, 
  ChartLineUp, 
  UsersThree, 
  Scroll, 
  ArrowRight,
} from '@phosphor-icons/react';

export const AdminOverviewPage: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  const [feeSetting, setFeeSetting] = useState(200);
  const [recentLogs, setRecentLogs] = useState<ActivityLogEntry[]>([]);
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
        setRecentLogs(logs.slice(0, 5));
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
      {/* Editorial Header */}
      <div className="relative overflow-hidden rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 sm:p-8 space-y-6">
        <TopoBackdrop color="#7C3AED" opacity={0.06} />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6">
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-ink-primary">
              Platform administration and configuration
            </h1>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Configure program fees, edit rank rules, manage staff accounts, and inspect system activity history.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Gear className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/admin/settings')}
            >
              Settings and emails
            </Button>
          </div>
        </div>

        {/* Lead Numeral + Simple Inline List on White (Rule 4: NO 4-box rows) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-5xl sm:text-6xl text-ink-primary leading-none">
              {userCount}
            </span>
            <div>
              <span className="text-base font-bold text-ink-primary block leading-tight">
                Registered volunteers
              </span>
              <span className="text-[13px] text-ink-secondary">
                Active member profiles across all community branches
              </span>
            </div>
          </div>

          {/* Simple Inline List with dividers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm pt-2 md:pt-0">
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Field activities</span>
              <span className="text-xl font-bold text-ink-primary">
                {activityCount}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Registration fee</span>
              <span className="text-xl font-bold text-role-volunteer">
                ETB {feeSetting}.00
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">History entries</span>
              <span className="text-xl font-bold text-ink-primary">
                {logCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Live Activity History Stream & Administrative Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live System Activity Feed */}
        <div className="lg:col-span-7 rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-6 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <Scroll className="w-5 h-5 text-ink-primary" weight="bold" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Recent system history
                </h3>
              </div>
              <span className="text-[13px] text-ink-secondary font-medium">
                Live stream
              </span>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-sm text-ink-secondary py-6 text-center">
                No system events recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div key={log.id} className="py-3 flex items-start justify-between gap-3 text-sm">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-ink-primary text-[13px]">
                          {log.actorName || 'System'}
                        </span>
                        <span className="text-[13px] px-2 py-0.5 rounded-[4px] bg-canvas-subdued text-ink-secondary">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[13px] text-ink-secondary">
                        {log.subject || 'System operation executed'}
                      </p>
                    </div>
                    <span className="text-[13px] text-ink-tertiary shrink-0 mt-0.5 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3">
            <Link
              to="/admin/activity-history"
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>View full activity history</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Administrative Areas: Cards with Text Links with Arrows (Rule 2) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Settings Panel */}
          <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[6px] bg-canvas-subdued flex items-center justify-center shrink-0">
                <Gear className="w-5 h-5 text-ink-primary" weight="bold" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-ink-primary">
                  Settings and emails
                </h4>
                <p className="text-[13px] text-ink-secondary">
                  Registration fee, payment deadlines, and email templates
                </p>
              </div>
            </div>
            <div className="pt-1">
              <Link
                to="/admin/settings"
                className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5"
              >
                <span>Open settings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rank Rules Panel */}
          <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[6px] bg-canvas-subdued flex items-center justify-center shrink-0">
                <ChartLineUp className="w-5 h-5 text-role-teamlead" weight="bold" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-ink-primary">
                  Rank rules
                </h4>
                <p className="text-[13px] text-ink-secondary">
                  Adjust hours, activity count, ratings, and training criteria
                </p>
              </div>
            </div>
            <div className="pt-1">
              <Link
                to="/admin/rank-rules"
                className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5"
              >
                <span>Edit rank rules</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Staff Accounts Panel */}
          <div className="rounded-[16px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)] p-5 space-y-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[6px] bg-canvas-subdued flex items-center justify-center shrink-0">
                <UsersThree className="w-5 h-5 text-ink-primary" weight="bold" />
              </div>
              <div>
                <h4 className="font-display text-lg font-bold text-ink-primary">
                  Accounts and roles
                </h4>
                <p className="text-[13px] text-ink-secondary">
                  Provision staff members and assign operational roles
                </p>
              </div>
            </div>
            <div className="pt-1">
              <Link
                to="/admin/accounts"
                className="text-sm font-bold text-ink-primary hover:underline inline-flex items-center gap-1.5"
              >
                <span>Manage accounts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

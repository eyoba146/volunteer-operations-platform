import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { Gear, ChartLineUp, UsersThree, Scroll, ShieldCheck, ArrowRight } from '@phosphor-icons/react';

export const AdminOverviewPage: React.FC = () => {
  const [userCount, setUserCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [users, acts, logs] = await Promise.all([
          api.getAllVolunteers(),
          api.getAllActivities(),
          api.getActivityLog(),
        ]);
        setUserCount(users.length);
        setActivityCount(acts.length);
        setLogCount(logs.length);
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
        <Skeleton variant="rect" className="h-40" />
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
              SYSTEM GOVERNANCE
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
              System Administration
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary">
              Configure program fees, maintain rank thresholds, manage staff roles, and audit system activity history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Gear className="w-4 h-4" />}
              onClick={() => navigate('/admin/settings')}
            >
              System Settings
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Scroll className="w-4 h-4" />}
              onClick={() => navigate('/admin/activity-history')}
            >
              Activity History
            </Button>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-mono text-xs">
          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Registered Volunteers</span>
            <div className="text-2xl font-bold text-ink-primary">{userCount}</div>
            <span className="text-[11px] font-sans text-ink-secondary block">Across 5 cities</span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Active Activities</span>
            <div className="text-2xl font-bold text-ink-primary">{activityCount}</div>
            <span className="text-[11px] font-sans text-ink-secondary block">Assignments logged</span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Telebirr Fee</span>
            <div className="text-2xl font-bold text-civic-gold">ETB 200</div>
            <span className="text-[11px] font-sans text-ink-secondary block">One-time activation</span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Activity Log Records</span>
            <div className="text-2xl font-bold text-ink-primary">{logCount}</div>
            <span className="text-[11px] font-sans text-ink-secondary block">Immutable audit</span>
          </div>
        </div>
      </div>

      {/* Administration Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-border bg-canvas-raised p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gear className="w-5 h-5 text-ink-primary" />
              <h3 className="font-serif text-lg font-bold text-ink-primary">
                Program Settings
              </h3>
            </div>
            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              Modify the registration fee, change the 7-day payment window, update Telebirr merchant credentials, and customize certificate signatures.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/settings')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage Program Settings
          </Button>
        </div>

        <div className="border border-border bg-canvas-raised p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ChartLineUp className="w-5 h-5 text-civic-green" weight="bold" />
              <h3 className="font-serif text-lg font-bold text-ink-primary">
                Rank Progression Rules
              </h3>
            </div>
            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              Configure minimum hours, activity counts, average ratings, and required qualification courses for Senior Member, Team Lead, and Manager.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/rank-rules')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Edit Rank Thresholds
          </Button>
        </div>

        <div className="border border-border bg-canvas-raised p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UsersThree className="w-5 h-5 text-civic-navy" weight="bold" />
              <h3 className="font-serif text-lg font-bold text-ink-primary">
                Accounts & Role Assignment
              </h3>
            </div>
            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              Create company staff accounts, pause or reinstate access, and assign administrative permissions.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/accounts')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Manage Accounts & Roles
          </Button>
        </div>

        <div className="border border-border bg-canvas-raised p-6 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-ink-secondary" />
              <h3 className="font-serif text-lg font-bold text-ink-primary">
                Activity History
              </h3>
            </div>
            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              Searchable, permanent chronological audit log of all sensitive actions, promotions, refunds, and configuration edits.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/admin/activity-history')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Inspect Activity History
          </Button>
        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../../api';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { Money, ArrowsClockwise, Scroll, CheckCircle, Warning, ArrowRight, DownloadSimple } from '@phosphor-icons/react';

export const FinanceOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalCollectedETB: number;
    confirmedCount: number;
    needsReviewCount: number;
    refundedCount: number;
    todayCount: number;
    todayETB: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const s = await api.getFinanceOverviewStats();
        setStats(s);
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
        <Skeleton variant="rect" className="h-36" />
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
              TELEBIRR AUDIT & RECONCILIATION
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
              Finance Operations Desk
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary">
              Watching live Ethio Telecom Telebirr settlement rails, handling manual exception reviews, and auditing fee receipts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ArrowsClockwise className="w-4 h-4" />}
              onClick={() => navigate('/finance/needs-review')}
            >
              Review Queue ({stats?.needsReviewCount || 0})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Money className="w-4 h-4" />}
              onClick={() => navigate('/finance/payments')}
            >
              All Payments Ledger
            </Button>
          </div>
        </div>

        {/* Financial Totals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-mono text-xs">
          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Total Revenue Received</span>
            <div className="text-2xl font-bold text-civic-green">
              ETB {stats?.totalCollectedETB.toLocaleString()}<span className="text-xs font-normal text-ink-tertiary">.00</span>
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              {stats?.confirmedCount} confirmed payments
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Needs Finance Review</span>
            <div className="text-2xl font-bold text-[#784E0B]">
              {stats?.needsReviewCount || 0} <span className="text-xs font-normal text-ink-tertiary">cases</span>
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              Reference / phone mismatch
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Processed Refunds</span>
            <div className="text-2xl font-bold text-ink-primary">
              {stats?.refundedCount || 0} <span className="text-xs font-normal text-ink-tertiary">cases</span>
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              Reimbursed to Telebirr
            </span>
          </div>

          <div className="border border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary uppercase text-[10px]">Today’s Intake</span>
            <div className="text-2xl font-bold text-civic-gold">
              ETB {stats?.todayETB || 0}<span className="text-xs font-normal text-ink-tertiary">.00</span>
            </div>
            <span className="text-[11px] font-sans text-ink-secondary block">
              {stats?.todayCount || 0} transactions today
            </span>
          </div>
        </div>
      </div>

      {/* Two-Column Focus Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Urgent Needs Review Alert Pane */}
        <div className="border-2 border-civic-gold bg-canvas-raised p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Warning className="w-5 h-5 text-civic-gold" weight="bold" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  Payments Needing Manual Resolution
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 bg-civic-goldLight text-[#784E0B] font-bold border border-civic-gold/40">
                {stats?.needsReviewCount} Action Needed
              </span>
            </div>

            <p className="font-sans text-xs text-ink-secondary leading-relaxed">
              When network timeouts occur or a payer phone differs from the registered applicant account, Telebirr transactions are quarantined here. Finance Officers can force-match payments to applicants or process automatic refunds.
            </p>

            <div className="p-3 bg-canvas-subdued border border-border text-xs font-mono text-ink-secondary space-y-1">
              <div>• Case 1: <strong className="text-ink-primary">TB-2026-10294-REV</strong> (Phone number mismatch on Biruk Tadesse account)</div>
              <div>• Case 2: <strong className="text-ink-primary">TB-2026-10301-DUP</strong> (Duplicate transfer detected for Almaz Fikre)</div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/finance/needs-review')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Manual Review Queue
            </Button>
          </div>
        </div>

        {/* Telebirr Rail Status & Reconciliation */}
        <div className="border border-border bg-canvas-raised p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Money className="w-5 h-5 text-civic-green" weight="bold" />
                <h3 className="font-serif text-lg font-bold text-ink-primary">
                  Gateway Integration Health
                </h3>
              </div>
              <span className="font-mono text-[10px] text-civic-green bg-civic-greenLight px-2 py-0.5 border border-civic-green/40 font-bold">
                TELEBIRR ONLINE
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans text-ink-secondary">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Ethio telecom Shortcode:</span>
                <span className="font-mono font-bold text-ink-primary">884120</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Fixed Registration Fee:</span>
                <span className="font-mono font-bold text-ink-primary">ETB 200.00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Webhook Notification Latency:</span>
                <span className="font-mono font-bold text-civic-green">840 ms avg</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Automatic Reconciliation Rate:</span>
                <span className="font-mono font-bold text-ink-primary">96.8%</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Link
              to="/finance/payments"
              className="text-xs font-semibold text-ink-primary hover:underline"
            >
              View Full Transaction Ledger
            </Link>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<DownloadSimple className="w-4 h-4" />}
              onClick={() => navigate('/finance/reports')}
            >
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};


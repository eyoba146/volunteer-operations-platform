import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api';
import { Payment } from '../../types';
import { Button, StatusMark, Skeleton } from '../../components/ui';
import { 
  Money, 
  ArrowsClockwise, 
  Scroll, 
  CheckCircle, 
  Warning, 
  ArrowRight, 
  DownloadSimple,
  ShieldCheck,
  Receipt,
  Clock
} from '@phosphor-icons/react';

export const FinanceOverviewPage: React.FC = () => {
  const [stats, setStats] = useState<{
    totalCollectedETB: number;
    confirmedCount: number;
    needsReviewCount: number;
    refundedCount: number;
    todayCount: number;
    todayETB: number;
  } | null>(null);

  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [s, list] = await Promise.all([
          api.getFinanceOverviewStats(),
          api.getAllPayments(),
        ]);
        setStats(s);
        setRecentPayments(list.slice(0, 5));
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
            <span className="font-sans text-xs font-bold text-ink-primary uppercase tracking-tight block">
              Ethio Telecom Settlement Desk
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Finance & Settlement Desk
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Live Telebirr settlement rails, exception resolution queue, registration fee accounting, and refunds ledger.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ArrowsClockwise className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/finance/needs-review')}
            >
              Review Queue ({stats?.needsReviewCount || 0})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Money className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/finance/payments')}
            >
              All Payments Ledger
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Scroll className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/finance/receipts-refunds')}
            >
              Receipts & Refunds
            </Button>
          </div>
        </div>

        {/* Financial Totals Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans text-xs">
          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[10px] uppercase block">Total Revenue MTD</span>
            <div className="font-display text-3xl sm:text-4xl font-black text-civic-green leading-none">
              ETB {stats?.totalCollectedETB.toLocaleString()}<span className="text-xs font-mono font-normal text-ink-tertiary">.00</span>
            </div>
            <span className="text-[11px] text-ink-secondary block font-mono">
              {stats?.confirmedCount} confirmed settlements
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[10px] uppercase block">Today's Settlements</span>
            <div className="font-display text-3xl sm:text-4xl font-black text-ink-primary leading-none">
              ETB {stats?.todayETB.toLocaleString()}<span className="text-xs font-mono font-normal text-ink-tertiary">.00</span>
            </div>
            <span className="text-[11px] text-ink-secondary block font-mono">
              {stats?.todayCount} fees processed today
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[10px] uppercase block">Review Queue</span>
            <div className={`font-display text-3xl sm:text-4xl font-black leading-none ${
              (stats?.needsReviewCount || 0) > 0 ? 'text-[#784E0B]' : 'text-civic-green'
            }`}>
              {stats?.needsReviewCount || 0} <span className="text-xs font-mono font-normal text-ink-tertiary">cases</span>
            </div>
            <span className="text-[11px] text-ink-secondary block font-sans">
              {(stats?.needsReviewCount || 0) > 0 ? 'Exceptions require matching' : 'Queue clear'}
            </span>
          </div>

          <div className="border-2 border-border bg-canvas-subdued p-4 space-y-1">
            <span className="text-ink-tertiary font-bold text-[10px] uppercase block">Reimbursements</span>
            <div className="font-display text-3xl sm:text-4xl font-black text-ink-primary leading-none">
              {stats?.refundedCount || 0} <span className="text-xs font-mono font-normal text-ink-tertiary">reversals</span>
            </div>
            <span className="text-[11px] text-ink-secondary block font-sans">
              Total audited refunds
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Telebirr Gateway Status & Controls */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-5 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-civic-green" weight="fill" />
                <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
                  Ethio Telecom Merchant Status
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-civic-green px-2 py-0.5 bg-emerald-50 border border-emerald-300">
                LIVE SETTLEMENT RAIL
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3.5 bg-canvas-subdued border border-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-ink-primary block">Merchant Account Name</span>
                  <span className="text-ink-secondary text-[11px]">Ethio Telecom Enterprise Gateway</span>
                </div>
                <span className="font-mono text-xs font-bold text-ink-primary">VTS Program - Ethio Telecom</span>
              </div>

              <div className="p-3.5 bg-canvas-subdued border border-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-ink-primary block">Telebirr Shortcode</span>
                  <span className="text-ink-secondary text-[11px]">Direct USSD & In-App Pay Code</span>
                </div>
                <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 border border-border text-ink-primary">
                  884120
                </span>
              </div>

              <div className="p-3.5 bg-canvas-subdued border border-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-ink-primary block">Automatic Matching Rate</span>
                  <span className="text-ink-secondary text-[11px]">Transactions resolved without manual intervention</span>
                </div>
                <span className="font-mono text-xs font-black text-civic-green">
                  96.8%
                </span>
              </div>

              <div className="p-3.5 bg-canvas-subdued border border-border flex justify-between items-center">
                <div>
                  <span className="font-bold text-ink-primary block">Average Exception Resolution</span>
                  <span className="text-ink-secondary text-[11px]">Speed from customer query to resolution</span>
                </div>
                <span className="font-mono text-xs font-bold text-ink-primary">
                  14 minutes
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-border flex gap-3">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/finance/needs-review')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Resolve Exception Queue ({stats?.needsReviewCount || 0})
            </Button>
          </div>
        </div>

        {/* Recent Transactions Ticker */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-5 flex flex-col justify-between shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-border pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-ink-primary" weight="bold" />
                <h3 className="font-display text-2xl font-black uppercase text-ink-primary">
                  Recent Telebirr Transactions
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-tertiary">
                Real-Time Stream
              </span>
            </div>

            <div className="divide-y divide-border border-2 border-border bg-white">
              {recentPayments.map((p) => (
                <div key={p.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-ink-primary">
                        {p.telebirrReference}
                      </span>
                      <StatusMark status={p.status} size="sm" />
                    </div>
                    <span className="text-ink-secondary block font-sans">
                      {p.payerName || 'Applicant'} • {p.payerPhone || 'No phone'}
                    </span>
                  </div>

                  <div className="text-right font-mono">
                    <span className="font-bold text-xs text-ink-primary block">
                      ETB {p.amount}.00
                    </span>
                    <span className="text-[10px] text-ink-tertiary block">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-border">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => navigate('/finance/payments')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Full Transactions Ledger
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

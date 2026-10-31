import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ShieldCheck, 
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
      {/* Editorial Header */}
      <div className="border border-[#D5DAE1] bg-white rounded-[10px] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#D5DAE1] pb-6">
          <div className="space-y-1">
            <span className="text-[13px] font-bold text-ink-primary">
              Finance desk
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-ink-primary">
              Telebirr settlements and payment ledger
            </h1>
            <p className="text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Live settlement reconciliation, payment exception queue, fee ledger, and refund accounting.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant="primary"
              size="md"
              leftIcon={<ArrowsClockwise className="w-4 h-4" weight="bold" />}
              onClick={() => navigate('/finance/needs-review')}
            >
              Review queue ({stats?.needsReviewCount || 0})
            </Button>
          </div>
        </div>

        {/* Lead Numeral + Simple Inline List on White (Rule 4: NO 4-box rows) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
          <div className="flex items-baseline gap-3">
            <span className="font-display font-black text-4xl sm:text-5xl text-role-volunteer leading-none">
              ETB {stats?.totalCollectedETB.toLocaleString() || '0'}.00
            </span>
            <div>
              <span className="text-base font-bold text-ink-primary block leading-tight">
                Total revenue collected
              </span>
              <span className="text-[13px] text-ink-secondary">
                {stats?.confirmedCount || 0} confirmed volunteer activations
              </span>
            </div>
          </div>

          {/* Simple Inline List with dividers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm pt-2 md:pt-0 border-t md:border-t-0 border-[#D5DAE1]">
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Today's settlements</span>
              <span className="text-xl font-bold text-ink-primary">
                ETB {stats?.todayETB.toLocaleString() || '0'}.00
              </span>
            </div>
            <div className="w-px h-8 bg-[#D5DAE1] hidden sm:block" />
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Review cases</span>
              <span className={`text-xl font-bold ${
                (stats?.needsReviewCount || 0) > 0 ? 'text-role-applicant' : 'text-role-volunteer'
              }`}>
                {stats?.needsReviewCount || 0}
              </span>
            </div>
            <div className="w-px h-8 bg-[#D5DAE1] hidden sm:block" />
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Refund reversals</span>
              <span className="text-xl font-bold text-ink-primary">
                {stats?.refundedCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Transactions & Gateway Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions Feed */}
        <div className="lg:col-span-7 border border-[#D5DAE1] bg-white rounded-[10px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-ink-primary" weight="bold" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Recent Telebirr transactions
                </h3>
              </div>
              <span className="text-[13px] text-ink-secondary font-medium">
                Live stream
              </span>
            </div>

            <div className="divide-y divide-[#D5DAE1]/60">
              {recentPayments.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink-primary">
                        {p.telebirrReference}
                      </span>
                      <StatusMark status={p.status} size="sm" />
                    </div>
                    <span className="text-ink-secondary text-[13px] block">
                      {p.payerName || 'Applicant'} • {p.payerPhone || 'No phone'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-ink-primary block">
                      ETB {p.amount}.00
                    </span>
                    <span className="text-[13px] text-ink-tertiary block">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#D5DAE1]">
            <Link
              to="/finance/payments"
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>Open full transactions ledger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Merchant Settlement Gateway Status */}
        <div className="lg:col-span-5 border border-[#D5DAE1] bg-white rounded-[10px] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#D5DAE1] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-role-volunteer" weight="fill" />
                <h3 className="font-display text-xl font-bold text-ink-primary">
                  Telebirr gateway status
                </h3>
              </div>
              <span className="text-[13px] font-semibold text-role-volunteer px-2 py-0.5 bg-emerald-50 rounded-[4px] border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-canvas-subdued/40 rounded-[8px] flex justify-between items-center">
                <div>
                  <span className="font-semibold text-ink-primary block text-[13px]">Merchant account</span>
                  <span className="text-ink-secondary text-[13px]">Telecom payment integration</span>
                </div>
                <span className="font-semibold text-ink-primary text-[13px]">VTS Ethiopia</span>
              </div>

              <div className="p-3 bg-canvas-subdued/40 rounded-[8px] flex justify-between items-center">
                <div>
                  <span className="font-semibold text-ink-primary block text-[13px]">Telebirr shortcode</span>
                  <span className="text-ink-secondary text-[13px]">Direct pay code</span>
                </div>
                <span className="font-semibold bg-white px-2 py-0.5 rounded-[4px] border border-[#D5DAE1] text-ink-primary text-[13px]">
                  884120
                </span>
              </div>

              <div className="p-3 bg-canvas-subdued/40 rounded-[8px] flex justify-between items-center">
                <div>
                  <span className="font-semibold text-ink-primary block text-[13px]">Automatic matching</span>
                  <span className="text-ink-secondary text-[13px]">Matched without manual review</span>
                </div>
                <span className="font-semibold text-role-volunteer text-[13px]">
                  96.8%
                </span>
              </div>

              <div className="p-3 bg-canvas-subdued/40 rounded-[8px] flex justify-between items-center">
                <div>
                  <span className="font-semibold text-ink-primary block text-[13px]">Pending exceptions</span>
                  <span className="text-ink-secondary text-[13px]">Payments needing confirmation</span>
                </div>
                <span className="font-semibold text-ink-primary text-[13px]">
                  {stats?.needsReviewCount || 0} cases
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#D5DAE1]">
            <Link
              to="/finance/needs-review"
              className="text-sm font-bold text-ink-primary hover:underline flex items-center gap-1.5"
            >
              <span>Resolve exception queue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

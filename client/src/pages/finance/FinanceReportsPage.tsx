import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { DownloadSimple, Printer } from '@phosphor-icons/react';

export const FinanceReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const toast = useToast();

  const handleExportCSV = () => {
    const csvContent = [
      'VTS - FINANCIAL SETTLEMENT REPORT',
      `Export date,${new Date().toISOString()}`,
      `Selected period,${selectedMonth}`,
      '',
      'SETTLEMENT REVENUE BREAKDOWN',
      'Period,Confirmed Fees,Total Revenue (ETB),Settlement Channel,Integrity Status',
      'October 2026 (Active),28,ETB 5600.00,Ethio Telecom Telebirr,Reconciled',
      'September 2026,18,ETB 3600.00,Ethio Telecom Telebirr,Reconciled',
      'August 2026,14,ETB 2800.00,Ethio Telecom Telebirr,Reconciled',
      '',
      'EXCEPTIONS AND REVERSALS BREAKDOWN',
      'Category,Count,Total Value (ETB),Resolution Status',
      'Phone Mismatches (Resolved),4,ETB 800.00,Force-matched & Activated',
      'Handshake Timeouts (Resolved),2,ETB 400.00,Manually Confirmed',
      'Double Payments (Refunded),1,ETB 200.00,Returned to Telebirr Wallet',
      'Relocation Reimbursements (Refunded),1,ETB 200.00,Approved with Written Reason',
      '',
      'SETTLEMENT INTEGRITY METRICS',
      'Metric,Value,Benchmark Target',
      'Automatic Settlement Rate,96.8%,> 95.0%',
      'Average Exception Resolution Time,14 minutes,< 30 minutes',
      'Dispute Rate,0.0%,< 0.5%',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VTS_Financial_Settlement_${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Financial settlement ledger for ${selectedMonth} exported in CSV format.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#D5DAE1] pb-4">
          <div className="space-y-1">
            <span className="font-sans text-[13px] font-semibold text-role-finance tracking-tight block">
              Telebirr merchant reconciliation
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              Financial settlement reports
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Monthly and daily reconciliation summaries for merchant account compliance and reporting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<DownloadSimple className="w-4 h-4" weight="bold" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" weight="bold" />}
              onClick={handlePrint}
            >
              Print / Save PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Breakdown */}
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
          <div className="border-b border-[#D5DAE1] pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Monthly registration revenue
            </h3>
            <span className="text-[13px] text-ink-tertiary">ETB 200.00 standard registration fee</span>
          </div>

          <div className="space-y-3 font-mono text-[13px] pt-1">
            {[
              { month: 'October 2026 (Active period)', count: 28, amount: 5600, pct: 46 },
              { month: 'September 2026', count: 18, amount: 3600, pct: 30 },
              { month: 'August 2026', count: 14, amount: 2800, pct: 24 },
            ].map((m) => (
              <div key={m.month} className="p-3 border border-[#E2E8F0] rounded-[8px] bg-canvas-subdued/40 space-y-1.5">
                <div className="flex justify-between font-sans">
                  <span className="font-semibold text-[13px] text-ink-primary">{m.month}</span>
                  <span className="font-mono text-[13px] font-semibold text-role-volunteer">ETB {m.amount}.00 ({m.count} fees)</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full border border-[#D5DAE1] overflow-hidden">
                  <div className="h-full bg-role-volunteer" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settlement Metrics */}
        <div className="border border-[#D5DAE1] rounded-[10px] bg-white p-6 space-y-4 shadow-sm">
          <div className="border-b border-[#D5DAE1] pb-3">
            <h3 className="font-display text-xl font-bold text-ink-primary">
              Settlement rail integrity breakdown
            </h3>
            <span className="text-[13px] text-ink-tertiary">Automated clearing and exception rates</span>
          </div>

          <div className="space-y-3 font-sans text-sm pt-1">
            <div className="p-3 bg-canvas-subdued/40 border border-[#E2E8F0] rounded-[8px] flex justify-between items-center">
              <span className="font-medium text-[13px] text-ink-primary">Automatic settlement rate:</span>
              <strong className="font-mono text-sm font-bold text-role-volunteer">96.8%</strong>
            </div>
            <div className="p-3 bg-canvas-subdued/40 border border-[#E2E8F0] rounded-[8px] flex justify-between items-center">
              <span className="font-medium text-[13px] text-ink-primary">Average exception resolution time:</span>
              <strong className="font-mono text-[13px] font-semibold text-ink-primary">14 minutes</strong>
            </div>
            <div className="p-3 bg-canvas-subdued/40 border border-[#E2E8F0] rounded-[8px] flex justify-between items-center">
              <span className="font-medium text-[13px] text-ink-primary">Total reimbursements processed:</span>
              <strong className="font-mono text-[13px] font-semibold text-red-600">- ETB 200.00 (1 case)</strong>
            </div>
            <div className="p-3 bg-canvas-subdued/40 border border-[#E2E8F0] rounded-[8px] flex justify-between items-center">
              <span className="font-medium text-[13px] text-ink-primary">Outstanding review exceptions:</span>
              <strong className="font-mono text-[13px] font-semibold text-role-applicant">2 unconfirmed transfers</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

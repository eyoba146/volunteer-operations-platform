import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { DownloadSimple, Printer, Money, Scroll, Calendar, ShieldCheck } from '@phosphor-icons/react';

export const FinanceReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const toast = useToast();

  const handleExportCSV = () => {
    const csvContent = [
      'VTS CIVIC VOLUNTEER PLATFORM - FINANCIAL SETTLEMENT AUDIT REPORT',
      `Export Date,${new Date().toISOString()}`,
      `Selected Period,${selectedMonth}`,
      '',
      'SETTLEMENT REVENUE BREAKDOWN',
      'Period,Confirmed Fees,Total Revenue (ETB),Settlement Channel,Integrity Status',
      'October 2026 (Active),28,ETB 5600.00,Ethio Telecom Telebirr,Reconciled',
      'September 2026,18,ETB 3600.00,Ethio Telecom Telebirr,Reconciled',
      'August 2026,14,ETB 2800.00,Ethio Telecom Telebirr,Reconciled',
      '',
      'EXCEPTION & REVERSAL AUDIT',
      'Category,Count,Total Value (ETB),Resolution Status',
      'Phone Mismatches (Resolved),4,ETB 800.00,Force-matched & Activated',
      'Handshake Timeouts (Resolved),2,ETB 400.00,Manually Confirmed',
      'Double Payments (Refunded),1,ETB 200.00,Returned to Telebirr Wallet',
      'Relocation Reimbursements (Refunded),1,ETB 200.00,Approved with Written Reason',
      '',
      'MERCHANT SETTLEMENT INTEGRITY METRICS',
      'Metric,Value,Benchmark Target',
      'Automatic Settlement Rate,96.8%,> 95.0%',
      'Average Exception Resolution Time,14 minutes,< 30 minutes',
      'Chargeback / Dispute Rate,0.0%,< 0.5%',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VTS_Financial_Settlement_Audit_${selectedMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Financial settlement ledger for ${selectedMonth} exported in CSV format.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-left">
      {/* Top Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-ink-primary tracking-tight block">
              Telebirr Merchant Reconciliation
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-ink-primary leading-none">
              Financial Settlement Reports
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Monthly and daily reconciliation summaries for Ethio Telecom merchant account audits and financial compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<DownloadSimple className="w-4 h-4" weight="bold" />}
              onClick={handleExportCSV}
            >
              Export CSV / Excel
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Breakdown */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-4 shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="border-b-2 border-border pb-2">
            <h3 className="font-display text-2xl font-black text-ink-primary">
              Monthly Registration Revenue (ETB 200.00 / fee)
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs pt-1">
            {[
              { month: 'October 2026 (Active Period)', count: 28, amount: 5600, pct: 46 },
              { month: 'September 2026', count: 18, amount: 3600, pct: 30 },
              { month: 'August 2026', count: 14, amount: 2800, pct: 24 },
            ].map((m) => (
              <div key={m.month} className="p-3 border-2 border-border bg-canvas-subdued space-y-1">
                <div className="flex justify-between font-sans">
                  <span className="font-bold text-xs text-ink-primary">{m.month}</span>
                  <span className="font-mono text-xs font-bold text-civic-green">ETB {m.amount}.00 ({m.count} fees)</span>
                </div>
                <div className="w-full h-2.5 bg-white border border-border">
                  <div className="h-full bg-civic-green" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Metrics */}
        <div
          className="border-2 border-ink-primary bg-white p-6 space-y-4 shadow-ticket"
          style={{
            clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
          }}
        >
          <div className="border-b-2 border-border pb-2">
            <h3 className="font-display text-2xl font-black text-ink-primary">
              Settlement Rail Integrity Breakdown
            </h3>
          </div>

          <div className="space-y-3 font-sans text-xs pt-1">
            <div className="p-3 bg-canvas-subdued border-2 border-border flex justify-between items-center">
              <span className="font-medium text-ink-primary">Automatic Settlement Rate:</span>
              <strong className="font-mono text-sm font-black text-civic-green">96.8%</strong>
            </div>
            <div className="p-3 bg-canvas-subdued border-2 border-border flex justify-between items-center">
              <span className="font-medium text-ink-primary">Average Exception Resolution Time:</span>
              <strong className="font-mono text-xs font-bold text-ink-primary">14 minutes</strong>
            </div>
            <div className="p-3 bg-canvas-subdued border-2 border-border flex justify-between items-center">
              <span className="font-medium text-ink-primary">Total Reimbursements Processed:</span>
              <strong className="font-mono text-xs font-bold text-red-600">- ETB 200.00 (1 case)</strong>
            </div>
            <div className="p-3 bg-canvas-subdued border-2 border-border flex justify-between items-center">
              <span className="font-medium text-ink-primary">Outstanding Review Exceptions:</span>
              <strong className="font-mono text-xs font-bold text-[#784E0B]">2 unconfirmed transfers</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Button } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { DownloadSimple, Printer, Money, Scroll, Calendar } from '@phosphor-icons/react';

export const FinanceReportsPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const toast = useToast();

  const handleExport = (format: 'pdf' | 'csv') => {
    toast.success(`Financial audit exported in ${format.toUpperCase()} format.`);
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-border pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-tertiary block">
            TELEBIRR RECONCILIATION SUMMARY
          </span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink-primary">
            Financial Settlement Reports
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-secondary">
            Daily and monthly settlement reconciliation for Ethio Telecom merchant account audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<DownloadSimple className="w-4 h-4" />}
            onClick={() => handleExport('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => handleExport('pdf')}
          >
            Print PDF Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Breakdown */}
        <div className="border border-border bg-canvas-raised p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
            Monthly Registration Revenue (ETB 200.00 / volunteer)
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              { month: 'October 2026 (Active Period)', count: 28, amount: 5600, pct: 46 },
              { month: 'September 2026', count: 18, amount: 3600, pct: 30 },
              { month: 'August 2026', count: 14, amount: 2800, pct: 24 },
            ].map((m) => (
              <div key={m.month} className="space-y-1">
                <div className="flex justify-between font-sans">
                  <span className="font-semibold text-ink-primary">{m.month}</span>
                  <span className="font-mono font-bold text-civic-green">ETB {m.amount}.00 ({m.count} fees)</span>
                </div>
                <div className="w-full h-2 bg-canvas-inset border border-border">
                  <div className="h-full bg-civic-green" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Metrics */}
        <div className="border border-border bg-canvas-raised p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-ink-primary border-b border-border pb-2">
            Settlement Integrity Breakdown
          </h3>

          <div className="space-y-3 font-sans text-xs">
            <div className="p-3 bg-canvas-subdued border border-border flex justify-between">
              <span>Automatic Settlement Rate:</span>
              <strong className="font-mono text-civic-green font-bold">96.8%</strong>
            </div>
            <div className="p-3 bg-canvas-subdued border border-border flex justify-between">
              <span>Average Resolution Time for Exceptions:</span>
              <strong className="font-mono text-ink-primary font-bold">14 minutes</strong>
            </div>
            <div className="p-3 bg-canvas-subdued border border-border flex justify-between">
              <span>Total Fees Reimbursed:</span>
              <strong className="font-mono text-ink-primary font-bold">ETB 200.00 (1 case)</strong>
            </div>
            <div className="p-3 bg-canvas-subdued border border-border flex justify-between">
              <span>Outstanding Accepted Invitations:</span>
              <strong className="font-mono text-[#784E0B] font-bold">3 applicants</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


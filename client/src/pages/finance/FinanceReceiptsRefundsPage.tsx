import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment } from '../../types';
import { LedgerTable, LedgerColumn, Tabs, Button, StatusMark, SheetModal, Skeleton, EmptyState } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  Receipt, 
  ArrowCounterClockwise, 
  Printer, 
  DownloadSimple, 
  ShieldCheck, 
  Check, 
  Clock 
} from '@phosphor-icons/react';

export const FinanceReceiptsRefundsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeTab, setActiveTab] = useState('receipts');
  const [isLoading, setIsLoading] = useState(true);

  // Refund processing modal
  const [targetRefundPayment, setTargetRefundPayment] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Printable Receipt Modal
  const [viewingReceipt, setViewingReceipt] = useState<Payment | null>(null);

  const toast = useToast();

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await api.getAllPayments();
      setPayments(list);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const receipts = payments.filter((p) => p.receiptNumber && p.status === 'confirmed');
  const refunds = payments.filter((p) => p.status === 'refunded');
  const refundRequests = payments.filter((p) => p.status === 'refund_requested');

  const totalReceiptsETB = receipts.reduce((sum, p) => sum + p.amount, 0);
  const totalRefundsETB = refunds.reduce((sum, p) => sum + p.amount, 0);

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !targetRefundPayment) return;

    if (!refundReason.trim()) {
      toast.error('A written explanation is mandatory for processing a refund.');
      return;
    }

    setIsProcessing(true);
    try {
      await api.refundPayment(
        targetRefundPayment.id,
        refundReason.trim(),
        user.id,
        profile?.fullName || user.username
      );

      toast.info(`Refund of ETB ${targetRefundPayment.amount}.00 processed via Telebirr (Ref: ${targetRefundPayment.telebirrReference}).`);
      setTargetRefundPayment(null);
      setRefundReason('');
      await loadData();
    } catch (err: any) {
      toast.error(err.message || 'Could not process refund.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportCSV = () => {
    const rows = [
      'VTS REVENUE & SETTLEMENT LEDGER',
      `Exported At,${new Date().toISOString()}`,
      `Tab,${activeTab.toUpperCase()}`,
      '',
      'Receipt/Refund ID,Telebirr Reference,Payer Name,Payer Phone,Amount (ETB),Date,Status,Notes/Reason',
    ];

    const currentList = activeTab === 'receipts' ? receipts : activeTab === 'refunds' ? refunds : refundRequests;
    currentList.forEach((p) => {
      rows.push(
        `"${p.receiptNumber || p.id}","${p.telebirrReference}","${p.payerName || ''}","${p.payerPhone || ''}",${p.amount},"${p.confirmedAt || p.createdAt}","${p.status}","${p.refundReason || ''}"`
      );
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VTS_Ledger_${activeTab}_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${activeTab} ledger to CSV.`);
  };

  const receiptColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Receipt Number',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          {p.receiptNumber}
        </span>
      ),
    },
    {
      header: 'Telebirr Reference',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-secondary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Issued To',
      cell: (p) => (
        <div className="font-sans text-xs">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Applicant'}</span>
          <span className="font-mono text-ink-tertiary text-[11px] block">{p.payerPhone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Date Confirmed',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {p.confirmedAt ? new Date(p.confirmedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-civic-green">
          ETB {p.amount}.00
        </span>
      ),
    },
    {
      header: 'Receipt Pass',
      align: 'right',
      cell: (p) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setViewingReceipt(p)}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
        >
          View Receipt
        </Button>
      ),
    },
  ];

  const refundColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Telebirr Reference',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Refunded To',
      cell: (p) => (
        <span className="font-sans text-xs text-ink-primary font-semibold">
          {p.payerName || 'Applicant'}
        </span>
      ),
    },
    {
      header: 'Mandatory Audit Reason',
      cell: (p) => (
        <span className="font-sans text-xs text-civic-rust max-w-sm block">
          {p.refundReason || 'Refund processed by Finance.'}
        </span>
      ),
    },
    {
      header: 'Refund Date',
      cell: (p) => (
        <span className="font-mono text-xs text-ink-tertiary">
          {p.refundedAt ? new Date(p.refundedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Amount Refunded',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-red-600">
          - ETB {p.amount}.00
        </span>
      ),
    },
  ];

  const requestColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Telebirr Reference',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Applicant Payer',
      cell: (p) => (
        <div className="font-sans text-xs">
          <span className="font-semibold text-ink-primary block">{p.payerName}</span>
          <span className="font-mono text-ink-tertiary text-[11px] block">{p.payerPhone}</span>
        </div>
      ),
    },
    {
      header: 'Refund Request Explanation',
      cell: (p) => (
        <span className="font-sans text-xs text-[#784E0B] max-w-sm block">
          {p.refundReason || 'Applicant formally submitted refund request.'}
        </span>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-xs font-bold text-ink-primary">
          ETB {p.amount}.00
        </span>
      ),
    },
    {
      header: 'Audit Action',
      align: 'right',
      cell: (p) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            setTargetRefundPayment(p);
            setRefundReason(p.refundReason || 'Approved applicant reimbursement request.');
          }}
          leftIcon={<ArrowCounterClockwise className="w-3.5 h-3.5" />}
        >
          Process Refund
        </Button>
      ),
    },
  ];

  const getCurrentList = () => {
    if (activeTab === 'receipts') return receipts;
    if (activeTab === 'refunds') return refunds;
    return refundRequests;
  };

  const getColumns = () => {
    if (activeTab === 'receipts') return receiptColumns;
    if (activeTab === 'refunds') return refundColumns;
    return requestColumns;
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div
        className="border-4 border-ink-primary bg-white p-6 sm:p-8 space-y-4 shadow-ticket"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-ink-primary pb-5">
          <div className="space-y-1">
            <span className="font-sans text-xs font-bold text-ink-primary uppercase tracking-tight block">
              Official Accounting Ledger
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-ink-primary leading-none">
              Receipts & Refunds
            </h1>
            <p className="font-sans text-xs sm:text-sm text-ink-secondary mt-1">
              Audit official registration fee tax receipts, review pending refund claims, and record mandatory reimbursement justifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<DownloadSimple className="w-4 h-4" weight="bold" />}
              onClick={handleExportCSV}
            >
              Export {activeTab.toUpperCase()} CSV
            </Button>
          </div>
        </div>

        {/* Daily & Monthly Totals Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-sans text-xs">
          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
            <span className="text-[10px] text-ink-tertiary uppercase font-mono block">Confirmed Receipts MTD</span>
            <span className="font-display text-2xl font-black text-civic-green block leading-none">
              ETB {totalReceiptsETB.toLocaleString()}.00
            </span>
            <span className="text-[11px] text-ink-secondary font-mono">{receipts.length} official receipts</span>
          </div>

          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
            <span className="text-[10px] text-ink-tertiary uppercase font-mono block">Refund Claims Pending</span>
            <span className={`font-display text-2xl font-black block leading-none ${
              refundRequests.length > 0 ? 'text-[#784E0B]' : 'text-civic-green'
            }`}>
              {refundRequests.length} <span className="text-xs font-mono font-normal text-ink-tertiary">claims</span>
            </span>
            <span className="text-[11px] text-ink-secondary font-mono">Requires finance approval</span>
          </div>

          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
            <span className="text-[10px] text-ink-tertiary uppercase font-mono block">Total Reimbursed</span>
            <span className="font-display text-2xl font-black text-red-600 block leading-none">
              - ETB {totalRefundsETB.toLocaleString()}.00
            </span>
            <span className="text-[11px] text-ink-secondary font-mono">{refunds.length} processed refunds</span>
          </div>

          <div className="p-3 border-2 border-border bg-canvas-subdued space-y-0.5">
            <span className="text-[10px] text-ink-tertiary uppercase font-mono block">Net Retained Fee</span>
            <span className="font-display text-2xl font-black text-ink-primary block leading-none">
              ETB {(totalReceiptsETB - totalRefundsETB).toLocaleString()}.00
            </span>
            <span className="text-[11px] text-ink-secondary font-mono">Audited merchant balance</span>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'receipts', label: 'Issued Receipts', count: receipts.length },
          { id: 'requests', label: 'Refund Requests', count: refundRequests.length },
          { id: 'refunds', label: 'Processed Refunds', count: refunds.length },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <LedgerTable
        data={getCurrentList()}
        columns={getColumns()}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
      />

      {/* Process Refund Modal with Mandatory Reason */}
      <SheetModal
        isOpen={targetRefundPayment !== null}
        onClose={() => setTargetRefundPayment(null)}
        title="Approve & Process Telebirr Refund"
        subtitle={`Payer: ${targetRefundPayment?.payerName || 'Applicant'} • Amount: ETB ${targetRefundPayment?.amount}.00`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleProcessRefund} className="space-y-4 text-left font-sans text-xs">
          <p className="text-ink-secondary leading-relaxed">
            This will initiate a reverse settlement through Ethio Telecom Telebirr, refunding ETB {targetRefundPayment?.amount}.00 to phone {targetRefundPayment?.payerPhone || 'the payer handset'}.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase tracking-tight text-ink-primary">
              Mandatory Written Explanation (Audit Requirement)
            </label>
            <textarea
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g. Accidental double payment confirmed with Ethio Telecom statement..."
              className="w-full bg-white text-ink-primary font-sans text-xs border-2 border-ink-primary p-2.5 outline-none"
              required
            />
          </div>

          <div className="pt-3 border-t-2 border-border flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setTargetRefundPayment(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              isLoading={isProcessing}
            >
              Confirm and Issue Refund
            </Button>
          </div>
        </form>
      </SheetModal>

      {/* Printable Receipt Modal */}
      <SheetModal
        isOpen={viewingReceipt !== null}
        onClose={() => setViewingReceipt(null)}
        title="Official Registration Receipt"
        subtitle={`Number: ${viewingReceipt?.receiptNumber || ''}`}
        mode="modal"
        maxWidth="md"
      >
        {viewingReceipt && (
          <div className="space-y-5 text-left font-sans text-xs p-2">
            <div className="border-4 border-ink-primary bg-white p-6 space-y-4 shadow-ticket">
              <div className="flex items-start justify-between border-b-2 border-ink-primary pb-3">
                <div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-ink-primary">
                    VTS Volunteer Program
                  </h3>
                  <span className="font-mono text-[10px] text-ink-tertiary block">
                    Tax Registration Receipt • Ethio Telecom Telebirr
                  </span>
                </div>
                <span className="font-mono text-xs font-bold bg-ink-primary text-white px-2 py-1">
                  PAID
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs py-2">
                <div>
                  <span className="text-[10px] text-ink-tertiary uppercase block">Receipt Number</span>
                  <span className="font-bold text-ink-primary">{viewingReceipt.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary uppercase block">Telebirr Ref</span>
                  <span className="font-bold text-ink-primary">{viewingReceipt.telebirrReference}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary uppercase block">Issued To</span>
                  <span className="font-bold text-ink-primary font-sans">{viewingReceipt.payerName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary uppercase block">Payer Phone</span>
                  <span className="font-bold text-ink-primary">{viewingReceipt.payerPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary uppercase block">Date Settled</span>
                  <span className="text-ink-secondary">{new Date(viewingReceipt.confirmedAt || viewingReceipt.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-ink-tertiary uppercase block">Fee Amount</span>
                  <span className="font-bold text-civic-green text-sm">ETB {viewingReceipt.amount}.00</span>
                </div>
              </div>

              <div className="border-t border-border pt-3 text-[10px] text-ink-tertiary text-center font-mono">
                Ethio Telecom Merchant Account: 884120 • Electronic Proof of Volunteer Registration
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setViewingReceipt(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        )}
      </SheetModal>
    </div>
  );
};

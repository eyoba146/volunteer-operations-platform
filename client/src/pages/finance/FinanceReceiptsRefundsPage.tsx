import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';
import { Payment } from '../../types';
import { LedgerTable, LedgerColumn, Tabs, Button, SheetModal } from '../../components/ui';
import { useToast } from '../../components/ui/ToastContext';
import { 
  ArrowCounterClockwise, 
  Printer, 
  DownloadSimple, 
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
      toast.error('A written explanation is required for processing a refund.');
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
      'VTS REVENUE AND SETTLEMENT LEDGER',
      `Exported at,${new Date().toISOString()}`,
      `Tab,${activeTab}`,
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
      header: 'Receipt number',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-ink-primary">
          {p.receiptNumber}
        </span>
      ),
    },
    {
      header: 'Telebirr reference',
      cell: (p) => (
        <span className="font-mono text-[13px] text-ink-secondary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Issued to',
      cell: (p) => (
        <div className="font-sans text-[13px]">
          <span className="font-semibold text-ink-primary block">{p.payerName || 'Applicant'}</span>
          <span className="font-mono text-ink-tertiary text-[13px] block">{p.payerPhone || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Date confirmed',
      cell: (p) => (
        <span className="font-mono text-[13px] text-ink-tertiary">
          {p.confirmedAt ? new Date(p.confirmedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-role-volunteer">
          ETB {p.amount}.00
        </span>
      ),
    },
    {
      header: 'Receipt pass',
      align: 'right',
      cell: (p) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setViewingReceipt(p)}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
        >
          View receipt
        </Button>
      ),
    },
  ];

  const refundColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Telebirr reference',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-ink-primary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Refunded to',
      cell: (p) => (
        <span className="font-sans text-[13px] text-ink-primary font-semibold">
          {p.payerName || 'Applicant'}
        </span>
      ),
    },
    {
      header: 'Refund reason',
      cell: (p) => (
        <span className="font-sans text-[13px] text-role-applicant max-w-sm block">
          {p.refundReason || 'Refund processed by finance.'}
        </span>
      ),
    },
    {
      header: 'Refund date',
      cell: (p) => (
        <span className="font-mono text-[13px] text-ink-tertiary">
          {p.refundedAt ? new Date(p.refundedAt).toLocaleDateString() : '—'}
        </span>
      ),
    },
    {
      header: 'Amount refunded',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-red-600">
          - ETB {p.amount}.00
        </span>
      ),
    },
  ];

  const requestColumns: LedgerColumn<Payment>[] = [
    {
      header: 'Telebirr reference',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-ink-primary">
          {p.telebirrReference}
        </span>
      ),
    },
    {
      header: 'Applicant payer',
      cell: (p) => (
        <div className="font-sans text-[13px]">
          <span className="font-semibold text-ink-primary block">{p.payerName}</span>
          <span className="font-mono text-ink-tertiary text-[13px] block">{p.payerPhone}</span>
        </div>
      ),
    },
    {
      header: 'Refund request explanation',
      cell: (p) => (
        <span className="font-sans text-[13px] text-role-applicant max-w-sm block">
          {p.refundReason || 'Applicant formally submitted refund request.'}
        </span>
      ),
    },
    {
      header: 'Amount',
      align: 'right',
      cell: (p) => (
        <span className="font-mono text-[13px] font-semibold text-ink-primary">
          ETB {p.amount}.00
        </span>
      ),
    },
    {
      header: 'Action',
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
          Process refund
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
      {/* Top Header Card */}
      <div className="rounded-[10px] bg-white p-6 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
          <div className="space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl tracking-tight text-ink-primary leading-tight">
              Receipts and refunds
            </h1>
            <p className="font-sans text-sm text-ink-secondary mt-1">
              Review registration fee receipts, process pending refund claims, and record reimbursement explanations.
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
          </div>
        </div>

        {/* Lead Numeral + Inline List (R5 Compliant: Replaces 4-tile row) */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pt-1">
          <div>
            <span className="text-[13px] font-mono text-ink-secondary block">
              Confirmed receipts MTD
            </span>
            <div className="flex items-baseline gap-3 mt-0.5">
              <span className="font-display text-4xl sm:text-5xl font-black text-ink-primary tracking-tight leading-none">
                ETB {totalReceiptsETB.toLocaleString()}.00
              </span>
              <span className="font-mono text-[13px] text-ink-tertiary">
                ({receipts.length} confirmed receipts)
              </span>
            </div>
          </div>

          {/* Simple Inline List with dividers */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm pt-2 md:pt-0">
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Pending refund claims</span>
              <span className={`text-xl font-bold ${
                refundRequests.length > 0 ? 'text-role-applicant' : 'text-role-volunteer'
              } `}>
                {refundRequests.length} claims
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Total reimbursed</span>
              <span className="text-xl font-bold text-red-600">
                - ETB {totalRefundsETB.toLocaleString()}.00
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[13px] text-ink-secondary block">Net settled balance</span>
              <span className="text-xl font-bold text-ink-primary">
                ETB {(totalReceiptsETB - totalRefundsETB).toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'receipts', label: 'Issued receipts', count: receipts.length },
          { id: 'requests', label: 'Refund requests', count: refundRequests.length },
          { id: 'refunds', label: 'Processed refunds', count: refunds.length },
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
        title="Approve and process Telebirr refund"
        subtitle={`Payer: ${targetRefundPayment?.payerName || 'Applicant'} • Amount: ETB ${targetRefundPayment?.amount}.00`}
        mode="modal"
        maxWidth="md"
      >
        <form onSubmit={handleProcessRefund} className="space-y-4 text-left font-sans text-sm">
          <p className="text-ink-secondary leading-relaxed text-[13px]">
            This will initiate a reverse settlement through Telebirr, refunding ETB {targetRefundPayment?.amount}.00 to phone {targetRefundPayment?.payerPhone || 'the payer handset'}.
          </p>

          <div className="space-y-1">
            <label className="block text-[13px] font-semibold text-ink-primary">
              Written explanation for refund
            </label>
            <textarea
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="e.g. Accidental double payment confirmed with statement..."
              className="w-full bg-white text-ink-primary font-sans text-sm rounded-[8px] p-2.5 focus:ring-1 focus:ring-ink-primary"
              required
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
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
              Confirm and issue refund
            </Button>
          </div>
        </form>
      </SheetModal>

      {/* Printable Receipt Modal */}
      <SheetModal
        isOpen={viewingReceipt !== null}
        onClose={() => setViewingReceipt(null)}
        title="Registration receipt"
        subtitle={`Number: ${viewingReceipt?.receiptNumber || ''}`}
        mode="modal"
        maxWidth="md"
      >
        {viewingReceipt && (
          <div className="space-y-5 text-left font-sans text-sm p-2">
            {/* Printable Receipt Card */}
            <div className="rounded-[16px] bg-white p-6 space-y-4 shadow-[0_1px_2px_rgba(16,24,40,0.05),0_8px_24px_-12px_rgba(16,24,40,0.10)]">
              <div className="flex items-start justify-between pb-3">
                <div>
                  <h3 className="font-display text-xl font-black tracking-tight text-ink-primary">
                    VTS volunteer program
                  </h3>
                  <span className="font-mono text-[13px] text-ink-tertiary block">
                    Registration receipt • Telebirr settlement
                  </span>
                </div>
                <span className="font-mono text-[13px] font-bold bg-ink-primary text-white px-2 py-0.5 rounded-[4px]">
                  Paid
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-[13px] py-2">
                <div>
                  <span className="text-ink-tertiary block">Receipt number</span>
                  <span className="font-bold text-ink-primary">{viewingReceipt.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">Telebirr ref</span>
                  <span className="font-bold text-ink-primary">{viewingReceipt.telebirrReference}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">Issued to</span>
                  <span className="font-bold text-ink-primary font-sans">{viewingReceipt.payerName}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">Payer phone</span>
                  <span className="font-bold text-ink-primary">{viewingReceipt.payerPhone}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">Date settled</span>
                  <span className="text-ink-secondary">{new Date(viewingReceipt.confirmedAt || viewingReceipt.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-ink-tertiary block">Fee amount</span>
                  <span className="font-bold text-role-volunteer text-sm">ETB {viewingReceipt.amount}.00</span>
                </div>
              </div>

              <div className="pt-3 text-[13px] text-ink-tertiary text-center font-mono">
                Merchant account: 884120 • Electronic proof of volunteer registration
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
                Print receipt
              </Button>
            </div>
          </div>
        )}
      </SheetModal>
    </div>
  );
};
